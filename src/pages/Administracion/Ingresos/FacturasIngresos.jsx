import React, { useState, useEffect } from "react"
import { useSelector } from 'react-redux';

// import TablaGeneralPaginado from './../../../../components/NewTables/TablaGeneral/TablaGeneralPaginado'
import TablaGeneral from './../../../components/NewTables/TablaGeneral/TablaGeneral'

import { apiPostForm, apiGet, apiPutForm, apiDelete, catchErrors } from './../../../functions/api'

import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

import j2xParser from 'fast-xml-parser'
import Swal from 'sweetalert2'
import S3 from 'react-aws-s3'

import {
    Grid, Paper, Tooltip, Typography, IconButton,
    Card, CardContent, CardActions, Box, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import Style from './../../Administracion/Egresos/Modales/CrearEgreso.module.css'

export default function Factura(props) {
    const { opcionesData, handleClose, reload, compra } = props
    const auth = useSelector((state) => state.authUser.access_token);
    const [reloadTable, setReloadTable] = useState()
    const clientes = useSelector((state) => state.opciones.clientes);
    const empresas = useSelector((state) => state.opciones.empresa);
    const [facturas, setFacturas] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [facturaPreview, setFacturaPreview] = useState(null);

    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        estatusCompras: [],
        proveedores: [],
        tiposImpuestos: [],
        tiposPagos: [],
    })

    const [form, setForm] = useState({
         adjuntos: {
            xml: { files: [], value: '' },
            pdf: { files: [], value: '' },
            excel: { files: [], value: '' },
            imagenes: { files: [], value: '' }, // ✅ agregar
            zip: { files: [], value: '' },
        },  
        options: {
            clientes: [],
            empresas: [],
            proveedores: [],
            estatusCompra: []
        },

        estatusCompra: '',
        facturaObject: false,
        factura: true,
        response: {},
        facturas: [],
        url_factura:''
    })

    const [modal, setModal] = useState({
        eliminar: {
            show: false,
            data: false
        },
    })

    useEffect(() => {
            obtenerFacturas();
        }, []);
    

    useEffect(() => {
        if(opcionesData){
            setOpciones(opcionesData)
        }
        if (reloadTable) {
            reloadTable.reload()
        }
    }, [opcionesData])

    const obtenerFacturas = async () => {
        try {
            const response = await apiGet(`v3/administracion/ingresos/facturas/${compra?.id || compra}`, auth);
            const facturasCFDI = response.data.ingreso.facturas || []; // facturas "normales"
            const facturasAdjuntos = response.data.ingreso.facturas_pdf || []; // nuevos adjuntos
            const todasFacturas = [...facturasCFDI];

            facturasAdjuntos.forEach(adjunto => {
                todasFacturas.push({
                    id: adjunto.id,
                    nombre_emisor: 'Adjunto',
                    nombre_receptor: 'Adjunto',
                    subtotal: 'n/a',
                    total: 'n/a',
                    archivoAdjunto: { url: adjunto.url_temporal, name: adjunto.name },
                    esAdjunto: true
                });
            });
            // console.log(todasFacturas)
            setFacturas(todasFacturas);
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error al obtener facturas' });
        }
    };

    // *************** ESTATUS DE COMPRA ***************
    // const handleChange = (event) => {
    //     const selectedValue = event.target.value;
    //     const selectedOption = opcionesData.estatusCompras.find((item) => item.id === selectedValue);

    //     Swal.fire({
    //         title: `cambiarás el estatus de la compra a: "${selectedOption.name}"?`,
    //         text: '¿Deseas continuar?',
    //         icon: 'question',
    //         showCancelButton: true,
    //         confirmButtonText: 'Sí',
    //         cancelButtonText: 'No'
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //         setForm((prevForm) => ({
    //             ...prevForm,
    //             estatusCompra: selectedValue
    //         }));
    //         handleSaveEstatus();
    //         } else {
    //         // Si se selecciona "No", puedes realizar alguna acción adicional o simplemente no hacer nada
    //         }
    //     });
    // };

    // *****************************************************

    const onChangeFactura = (e) => {
        const { files } = e.target
        const reader = new FileReader()
        if (files[0].type === 'text/xml') {
            reader.onload = (event) => {
                const text = (event.target.result)
                let jsonObj = j2xParser.parse(text, {
                    ignoreAttributes: false,
                    attributeNamePrefix: ''
                })
                if (jsonObj['cfdi:Comprobante']) {
                    jsonObj = jsonObj['cfdi:Comprobante']
                    const keys = Object.keys(jsonObj)
                    let obj = {}
                    let errores = []
                    if (keys.includes('cfdi:Receptor')) {
                        obj.rfc_receptor = jsonObj['cfdi:Receptor']['Rfc']
                        obj.nombre_receptor = jsonObj['cfdi:Receptor']['Nombre']
                        obj.uso_cfdi = jsonObj['cfdi:Receptor']['UsoCFDI']
                    } else { errores.push('El XML no tiene el receptor') }
                    if (keys.includes('cfdi:Emisor')) {
                        obj.rfc_emisor = jsonObj['cfdi:Emisor']['Rfc']
                        obj.nombre_emisor = jsonObj['cfdi:Emisor']['Nombre']
                        obj.regimen_fiscal = jsonObj['cfdi:Emisor']['RegimenFiscal']
                    } else { errores.push('El XML no tiene el emisor') }
                    obj.lugar_expedicion = jsonObj['LugarExpedicion']
                    obj.fecha = jsonObj['Fecha'] ? new Date(jsonObj['Fecha']) : null
                    obj.metodo_pago = jsonObj['MetodoPago']
                    obj.tipo_de_comprobante = jsonObj['TipoDeComprobante']
                    obj.total = jsonObj['Total']
                    obj.subtotal = jsonObj['SubTotal']
                    obj.tipo_cambio = jsonObj['TipoCambio']
                    obj.moneda = jsonObj['Moneda']
                    if (keys.includes('cfdi:Complemento')) {
                        if (jsonObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']) {
                            obj.numero_certificado = jsonObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']['UUID']
                        } else { errores.push('El XML no tiene el UUID') }
                    } else { errores.push('El XML no tiene el UUID') }
                    obj.descripcion = ''
                    if (keys.includes('cfdi:Conceptos')) {
                        if (jsonObj['cfdi:Conceptos']['cfdi:Concepto']) {
                            if (Array.isArray(jsonObj['cfdi:Conceptos']['cfdi:Concepto'])) {
                                jsonObj['cfdi:Conceptos']['cfdi:Concepto'].forEach((element, index) => {
                                    if (index) {
                                        obj.descripcion += ' - '
                                    }
                                    obj.descripcion += element['Descripcion']
                                })
                            } else {
                                obj.descripcion += jsonObj['cfdi:Conceptos']['cfdi:Concepto']['Descripcion']
                            }
                        }
                    }
                    obj.folio = jsonObj['Folio']
                    obj.serie = jsonObj['Serie']
                    if (keys.includes('cfdi:CfdiRelacionados')) {
                        if (Array.isArray(jsonObj['cfdi:CfdiRelacionados'])) {
                            obj.tipo_relacion = jsonObj['cfdi:CfdiRelacionados'][0]['TipoRelacion']
                        }
                    }
                    if (keys.includes('cfdi:CfdiRelacionado')) {
                        if (Array.isArray(jsonObj['cfdi:CfdiRelacionado'])) {
                            obj.uuid_relacionado = jsonObj['cfdi:CfdiRelacionado'][0]['UUID']
                        }
                    }
                    let empresa = empresas.find((empresa) => empresa.rfc === obj.rfc_emisor)

                    if(!empresa ){

                        Swal.fire({
                            icon: 'error',
                            title: 'Fromato Sin empresa',
                            text: 'La factura no tiene la empresa receptora registrada',
                            showConfirmButton: false,
                            timer: 2000
                        })
                    }else {
                            let cliente = clientes.find((clientes) => clientes.rfc === obj.rfc_receptor)
                            let aux = []
                            const filesArray = Array.from(files);
                            filesArray.forEach((file, index) => {
                                aux.push({
                                    name: file.name,
                                    file: file,
                                    url: URL.createObjectURL(file),
                                    key: index
                                })
                            })
                            let path = `C:/fakepath/` + aux[0].name // a lo mejor tiene que ser C:\\fakepath\\ o algo asi
                        
                            setForm({
                                ...form,
                                fecha: obj.fecha,
                                rfc: obj.rfc_emisor,
                                total: obj.total,
                                descripcion: obj.descripcion,
                                empresa: empresa ? empresa.id : null,
                                empresa_nombre: empresa ? empresa.nombre : null,
                                cliente: cliente ? cliente.id : null,
                                cliente_nombre: cliente ? cliente.name : null,
                                cuentas: empresa ? opciones.empresas.find((empresaData) => empresaData.id === empresa.id).cuentas : null,
                                adjuntos: {
                                    ...form.adjuntos,
                                    xml: {
                                        files: aux, 
                                        value: path
                                    }
                                },
                                facturaObject: obj
                            })

                    } 

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Fromato XML incorrecto',
                        text: 'La factura no tiene el formato correcto',
                        showConfirmButton: false,
                        timer: 1500
                    })

                }
            }

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Fromato XML incorrecto',
                text: 'La factura no tiene el formato correcto',
                showConfirmButton: false,
                timer: 3000
            })
        }

        reader.readAsText(files[0])

    }

    const handleDeleteFile = (tipo, index) => {
        let files = form.adjuntos[tipo].files
        files.splice(index, 1)
        setForm({
            ...form,
            adjuntos: {
                ...form.adjuntos,
                [tipo]: {files: [...files], value: ''}
            }
        })
    }

    const handleAddFile = (e, tipo) => {
        let aux = []

        Array.from(e.target.files).forEach((file, index) => {
            aux.push({
                name: file.name,
                file: file,
                url: URL.createObjectURL(file),
                key: index
            });
        });
        

        let path = 'C:/fakepath/'+ aux[0].name

        setForm({
            ...form,
            adjuntos: {
                ...form.adjuntos,
                [tipo]: {files: aux, value: path}
            }
        })
    }

    // *************** AGREGAR ARCHIVOS ***************
    // const addFacturaS3 =  ( ) => { //attachFiles

    //     apiGet(`v1/constant/admin-proyectos`, auth).then(
    //         (response) => {
    //             const { alma } = response.data
    //             let filePath = `facturas/ingresos/`
    //             let aux = []
    //             form.adjuntos.xml.files.forEach((file) => {
    //                 aux.push(file)
    //             })
    //             form.adjuntos.pdf.files.forEach((file) => {
    //                 aux.push(file)
    //             })
    //             let auxPromises = aux.map((file) => {
    //                 return new Promise((resolve, reject) => {
    //                     new S3(alma).uploadFile(file.file, `${filePath}${Math.floor(Date.now() / 1000)}-${file.name}`)
    //                         .then((data) => {
    //                             const { location, status } = data
    //                             if (status === 204) resolve({ name: file.name, url: location })
    //                             else reject(data)
    //                         })
                            
    //                         .catch((error) => {
    //                             reject(error)
    //                         })
    //                         if(reload){
    //                             reload.reload()
    //                         }
    //                 })
    //             })
    //             Promise.all(auxPromises).then(values => { addNewFacturaAxios(values, compra) }).catch(err => console.error(err))
    //         }, (error) => { }
    //     ).catch((error) => { 
    //         Swal.close()
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Error al adjuntar archivos',
    //             text: 'Ocurrio un error al adjuntar los archivos',
    //             showConfirmButton: false,
    //             timer: 1500
    //         })

    //     })
    // }


        const addFacturaS3 = async () => {
            const { xml, pdf, imagenes, excel, zip } = form.adjuntos;
    
            if (
                xml.files.length === 0 &&
                pdf.files.length === 0 &&
                imagenes.files.length === 0 &&
                excel.files.length === 0 &&
                zip.files.length === 0 // ✅ Añadir verificación ZIP
            ) {
                Swal.fire({ icon: 'error', title: 'Debe agregar al menos un archivo' });
                return;
            }
    
            const allFiles = [...xml.files, ...pdf.files, ...imagenes.files, ...excel.files, ...zip.files]; // ✅ Incluir ZIP
    
            // 🔹 Flujo para un solo archivo
            if (allFiles.length === 1) {
                const file = allFiles[0];
                const fileName = file.name.toLowerCase();
                const mimeType = file.file.type;
    
                const data = new FormData();
                data.append(`files_name_facturas[]`, file.name);
                data.append(`files_facturas[]`, file.file);
    
                let tipo = 'facturas';
                if (fileName.endsWith('.pdf')) tipo = 'facturas_pdf';
                else if (fileName.match(/\.(jpg|jpeg|png)$/)) tipo = 'factura-imagen';
                else if (fileName.match(/\.(xls|xlsx)$/)) tipo = 'factura-excel';
                else if (fileName.endsWith('.xml')) tipo = 'factura-xml';
                else if (fileName.endsWith('.zip')) tipo = 'factura-zip'; // ✅ Agregado ZIP
    
                data.append('adjuntos[]', tipo);
                data.append('tipo', tipo);
    
                Swal.fire({ title: 'Subiendo archivo...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    
                try {
                    await apiPostForm(`v3/administracion/ingresos/${compra}/archivos/s3`, data, auth);
    
                    Swal.fire({
                        icon: 'success',
                        title: `Archivo ${file.name} subido con éxito`,
                        showConfirmButton: false,
                        timer: 1000,
                    });
    
                    setForm((prevForm) => ({
                        ...prevForm,
                        adjuntos: {
                            xml: { files: [], value: '' },
                            pdf: { files: [], value: '' },
                            imagenes: { files: [], value: '' },
                            excel: { files: [], value: '' },
                            zip: { files: [], value: '' } // ✅ reset ZIP
    
                        }
                    }));
    
                    obtenerFacturas();
                    if (reloadTable) reloadTable.reload();
    
                } catch (error) {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al subir archivo',
                        text: 'Ocurrió un error al subir el archivo',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
    
            } else {
                // 🔹 Flujo para varios archivos
                Swal.fire({ title: 'Subiendo archivos...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    
                try {
                 
                    addNewFacturaAxios(allFiles, compra);
    
                    setForm((prevForm) => ({
                        ...prevForm,
                        adjuntos: {
                        xml: { files: [], value: '' },
                        pdf: { files: [], value: '' },
                        imagenes: { files: [], value: '' },
                        excel: { files: [], value: '' },
                        }
                    }));
    
                    if (reloadTable) reloadTable.reload();
    
                } catch (error) {
                    console.error(error);
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al subir archivos',
                        text: 'Ocurrió un error al adjuntar los archivos',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }
        };
    

    // const addNewFacturaAxios = (files, compra) => {
    //     let aux = form
    //     aux.archivos = files

    //     apiPostForm(`v2/administracion/facturas`, aux, auth).then(
    //         (response) => {
    //             const { factura } = response.data

    //             setForm({
    //                 ...form,
    //                 facturaItem: factura,
    //                 archivos: files
    //             })
    //             if(reload){
    //                 reload.reload()
    //             }
    //             attachFactura(compra, factura)
    //         }, (error) => { }
    //     ).catch((error) => {
    //         console.error(error, 'error')
    //     })
    // }


        const addNewFacturaAxios = async (files: any, venta: any) => {

    
            try {
                        // 1) arma FormData
                const fd = new FormData();
    
                // facturaObject: ajusta al nombre real dentro de tu "form"
                const facturaObject =
                (form && (form.facturaObject || form.factura)) || {};
                fd.append("facturaObject", JSON.stringify(facturaObject));
    
                // helper para empujar archivos al mismo campo files_zip[]
                const pushFiles = (list?: { file: File; name?: string }[]) => {
                if (!Array.isArray(list)) return;
                list.forEach(({ file, name }) => {
                    // debe ser un File real (no {} ni blob:url)
                    if (!(file instanceof File) || file.size === undefined) return;
                    const stamped =
                    `${Math.floor(Date.now() / 1000)}-` + (name || file.name || "file");
                    fd.append("files_zip[]", file, stamped);
                });
                };
    
                // 2) soporta las distintas formas en que te llega "files"
                // a) objeto tipo adjuntos { pdf:{files:[]}, xml:{files:[]}, ... }
                if (
                files?.pdf || files?.xml || files?.zip || files?.excel || files?.imagenes
                ) {
                pushFiles(files?.pdf?.files);
                pushFiles(files?.xml?.files);
                pushFiles(files?.zip?.files);
                pushFiles(files?.excel?.files);
                pushFiles(files?.imagenes?.files);
                }
                // b) files.adjuntos (por si te lo pasan envuelto)
                else if (files?.adjuntos) {
                const adj = files.adjuntos;
                pushFiles(adj?.pdf?.files);
                pushFiles(adj?.xml?.files);
                pushFiles(adj?.zip?.files);
                pushFiles(adj?.excel?.files);
                pushFiles(adj?.imagenes?.files);
                }
                // c) arreglo plano [{ file, name }]
                else if (Array.isArray(files)) {
                pushFiles(files);
                }
                fd.append("facturaObject", JSON.stringify(facturaObject));
                fd.append("filePath", "facturas/ingresos/");
    
                // console.log(fd)
                // 3) POST (apiPostForm debe detectar FormData y NO serializarlo)
                const response = await apiPostForm(`v2/administracion/facturas`, fd, auth);
    
                const { factura } = response.data;
    
                Swal.close();
                Swal.fire({
                icon: "success",
                title: "Factura subida con éxito",
                text: "Se subio la factura con éxito",
                showConfirmButton: false,
                timer: 1500,
                });
    
                setFacturas((prev) => [...prev, factura]);
                attachFactura(venta, factura);
    
                // Limpia estado (no mutamos form directamente)
                setForm((prev) => ({
                ...prev,
                facturaItem: factura,
                adjuntos: {
                    xml: { files: [], value: "" },
                    pdf: { files: [], value: "" },
                    zip: { files: [], value: "" },
                    excel: { files: [], value: "" },
                    imagenes: { files: [], value: "" },
                },
                }));
    
                if (reloadTable) reloadTable.reload();
                } catch (error) {
                    console.error(error, "error");
                }
            };

    const attachFactura = (compra, factura) => {

        let objeto = {
            dato: compra,
            tipo: 'ingreso',
            factura: factura.id
        }

        apiPutForm(`v2/administracion/facturas/attach`, objeto, auth).then(
            (response) => {
                
                Swal.close()
                Swal.fire({
                    icon: 'success',
                    title: 'ingreso creado con éxito',
                    text: 'Se creó el ingreso con éxito',
                    showConfirmButton: false,
                    timer: 1500
                })
                obtenerFacturas();

                if (reloadTable) {
                    reloadTable.reload()
                }
                
            }, (error) => { 
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Error al adjuntar archivos',
                    text: 'Ocurrio un error al adjuntar los archivos',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        ).catch((error) => { 
            Swal.close()
            Swal.fire({
                icon: 'error',
                title: 'Error al adjuntar archivos',
                text: 'Ocurrio un error al adjuntar los archivos',
                showConfirmButton: false,
                timer: 1500
            })
        })
    }

    // ************************************************

    const columns = [
        { nombre: '', identificador: 'acciones', sort: false, stringSearch: false },
        { nombre: 'folio', identificador: 'folio', sort: false, stringSearch: false },
        { nombre: 'estatus', identificador: 'estatus', stringSearch: false },
        { nombre: 'Fecha', identificador: 'fecha', stringSearch: false },
        { nombre: 'serie', identificador: 'serie', stringSearch: false },
        { nombre: 'emisor', identificador: 'emisor', stringSearch: false },
        { nombre: 'receptor', identificador: 'receptor', stringSearch: false },
        { nombre: 'sub total', identificador: 'subtotal', stringSearch: false },
        { nombre: 'total', identificador: 'total', stringSearch: false },
        // { nombre: 'monto acumulado', identificador: 'monto_acumulado', stringSearch: false },
        // { nombre: 'monto restante', identificador: 'monto_restante', stringSearch: false },
        { nombre: 'adjuntos', identificador: 'adjuntos', stringSearch: false },
    ] 

    const formatNumber = (num) => {
        return `${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

  
    // const deleteEgresoAxios = (factura) => {

    //     apiDelete(`v2/administracion/ingresos/${compra}/facturas/${id}`, auth).then(
    //         (response) => {
    //             Swal.fire(
    //                 '¡Eliminado!',
    //                 'El ingreso ha sido eliminado.',
    //                 'success'
    //             )
    //             if (reloadTable) {
    //                 reloadTable.reload()
    //             }
    //         }, (error) => { }
    //     ).catch((error) => { catchErrors(error) })
    // }  

      const deleteEgresoAxios = (factura) => {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Esta acción no se puede deshacer.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    let deletePromise;
    
                    if (factura.esAdjunto) {
                        // 🔥 Si es adjunto eliminar de la ruta de adjuntos
                        deletePromise = apiDelete(`v2/administracion/ingresos/${compra}/adjuntos/${factura.id}`, auth);
                    } else {
                        // 🔥 Si es factura CFDI eliminar de la ruta de facturas
                        deletePromise = apiDelete(`v2/administracion/ingresos/${compra}/facturas/${factura.id}`, auth);
                    }
    
                    deletePromise
                        .then(() => {
                            Swal.fire('¡Eliminado!', 'Se ha eliminado correctamente.', 'success');
                            setFacturas(prevFacturas => prevFacturas.filter(f => f.id !== factura.id));
                            obtenerFacturas(); // 🔥 Recargar después de eliminar
                        })
                        .catch(() => {
                            Swal.fire('Error', 'No se pudo eliminar.', 'error');
                        });
    
    
                   
                }
            });
        };

    // let acciones = () => {
    //     let aux = [
    //         {
    //             nombre: 'Eliminar',
    //             icono: 'fas fa-trash-alt',
    //             color: 'redButton',
    //             funcion: (item) => {
    //                 Swal.fire({
    //                     title: '¿Estás seguro?',
    //                     text: "¡No podrás revertir esto!",
    //                     icon: 'warning',
    //                     showCancelButton: true,
    //                     confirmButtonColor: '#3085d6',
    //                     cancelButtonColor: '#d33',

    //                     confirmButtonText: 'Sí, bórralo',
    //                     cancelButtonText: 'Cancelar'
    //                 }).then((result) => {
    //                     if (result.isConfirmed) {
    //                         deleteEgresoAxios(item.id)
                            
    //                     }
    //                 })
    //             }
    //         }, 
    //     ]
    //     return aux
    // }

    return (
       <>
       <Box sx={{ maxWidth: 900, margin: 'auto', padding: '2rem' }}>
                <Grid container spacing={4}>

                    {/* Sección de XML */}
                    <Grid item xs={12} md={6}>
                        <Card elevation={4} sx={{ padding: 2 }}>
                            <CardContent>
                                <InputLabel>📄 XML de la Factura</InputLabel>

                                <input
                                    accept="application/xml"
                                    style={{ display: 'none' }}
                                    id="xml-upload"
                                    type="file"
                                    // onChange={(e) => {
                                    //     const file = e.target.files[0];
                                    //     if (file) handleCargarXML(file);
                                    // }}
                                    onChange={onChangeFactura}
                                />

                                <label htmlFor="xml-upload">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component="span"
                                        fullWidth
                                        startIcon={<DescriptionIcon />}
                                        style={{ mt: 1 }}
                                    >
                                        Agregar XML
                                    </Button>
                                </label>
                            </CardContent>
                            {/* 📜 Modal de Vista Previa del XML */}
                            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
                                <DialogTitle>📄 Vista Previa del XML</DialogTitle>
                                <DialogContent>
                                    {facturaPreview ? (
                                        <Box>
                                            <Typography><strong>RFC Emisor:</strong> {facturaPreview.rfc_emisor}</Typography>
                                            <Typography><strong>Nombre Emisor:</strong> {facturaPreview.nombre_emisor}</Typography>
                                            <Typography><strong>RFC Receptor:</strong> {facturaPreview.rfc_receptor}</Typography>
                                            <Typography><strong>Nombre Receptor:</strong> {facturaPreview.nombre_receptor}</Typography>
                                            <Typography><strong>Fecha:</strong> {facturaPreview.fecha}</Typography>
                                            <Typography><strong>Método de Pago:</strong> {facturaPreview.metodo_pago}</Typography>
                                            <Typography><strong>Moneda:</strong> {facturaPreview.moneda}</Typography>
                                            <Typography><strong>Total:</strong> ${facturaPreview.total}</Typography>
                                            <Typography><strong>Descripción:</strong> {facturaPreview.descripcion}</Typography>
                                        </Box>
                                    ) : (
                                        <Typography>❌ No se encontraron datos en el XML.</Typography>
                                    )}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setOpenModal(false)} color="error">Cerrar</Button>
                                </DialogActions>
                            </Dialog>

                            {/* Archivos Cargados */}
                            <CardContent>
                                <Grid container spacing={2}>
                                    {form.adjuntos.xml.files.map((item, index) => (
                                        <Grid item xs={12} key={index}>
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: 1,
                                                    backgroundColor: 'rgba(58, 137, 201, 0.25)',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Tooltip title={item.name} arrow>
                                                    <Typography
                                                        sx={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '150px',
                                                            fontWeight: 'bold',
                                                            color: '#3f51b5',
                                                        }}
                                                    >
                                                        {item.name.length > 15 ? item.name.slice(0, 10) + '...' : item.name}
                                                    </Typography>
                                                </Tooltip>

                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteFile('xml', index)}
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: '#f77c5d', color: '#f77c5d',
                                                        },
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Sección de PDF */}
                    <Grid item xs={12} md={6}>
                        <Card elevation={4} sx={{ padding: 2 }}>
                            <CardContent>
                                <InputLabel>📑 PDF de la Factura</InputLabel>
                                <input
                                    accept="application/pdf,application/zip,image/jpeg,image/png,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    style={{ display: 'none' }}
                                    id="pdf-upload"
                                    type="file"
                                    onChange={(e) => handleAddFile(e, 'pdf')}
                                />
                                <label htmlFor="pdf-upload">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component="span"
                                        fullWidth
                                        startIcon={<PictureAsPdfIcon />}
                                        style={{ mt: 1 }}
                                    >
                                        Agregar PDF
                                    </Button>
                                </label>
                            </CardContent>

                            {/* Archivos Cargados */}
                            <CardContent>
                                <Grid container spacing={2}>
                                    {form.adjuntos.pdf.files.map((item, index) => (
                                        <Grid item xs={12} key={index}>
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: 1,
                                                    backgroundColor: 'rgba(58, 137, 201, 0.25)',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Tooltip title={item.name} arrow>
                                                    <Typography
                                                        sx={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '150px',
                                                            fontWeight: 'bold',
                                                            color: '#3f51b5',
                                                        }}
                                                    >
                                                        {item.name.length > 15 ? item.name.slice(0, 10) + '...' : item.name}
                                                    </Typography>
                                                </Tooltip>

                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteFile('pdf', index)}
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: '#f77c5d', color: '#f77c5d',
                                                        },
                                                    }}                                            >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                            <CardContent>
                                <Grid container spacing={2}>
                                    {form.adjuntos.imagenes?.files.map((item, index) => (
                                        <Grid item xs={12} key={index}>
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: 1,
                                                    backgroundColor: 'rgba(58, 137, 201, 0.15)',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <img src={item.url} alt={item.name} width={40} height={40} style={{ marginRight: 10, borderRadius: 4 }} />
                                                <Tooltip title={item.name} arrow>
                                                    <Typography
                                                        sx={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '150px',
                                                            fontWeight: 'bold',
                                                            color: '#3f51b5',
                                                        }}
                                                    >
                                                        {item.name.length > 15 ? item.name.slice(0, 10) + '...' : item.name}
                                                    </Typography>
                                                </Tooltip>

                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteFile('imagenes', index)}
                                                    sx={{ '&:hover': { backgroundColor: '#f77c5d', color: '#fff' } }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>

                            <CardContent>
                                <Grid container spacing={2}>
                                    {form.adjuntos.excel?.files.map((item, index) => (
                                        <Grid item xs={12} key={index}>
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: 1,
                                                    backgroundColor: 'rgba(58, 137, 201, 0.15)',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Tooltip title={item.name} arrow>
                                                    <Typography
                                                        sx={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '150px',
                                                            fontWeight: 'bold',
                                                            color: '#388e3c',
                                                        }}
                                                    >
                                                        📊 {item.name.length > 15 ? item.name.slice(0, 10) + '...' : item.name}
                                                    </Typography>
                                                </Tooltip>

                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteFile('excel', index)}
                                                    sx={{ '&:hover': { backgroundColor: '#f77c5d', color: '#fff' } }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                            <CardContent>
                                <Grid container spacing={2}>
                                    {form.adjuntos.zip?.files.map((item, index) => (
                                        <Grid item xs={12} key={index}>
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: 1,
                                                    backgroundColor: 'rgba(58, 137, 201, 0.15)',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Tooltip title={item.name} arrow>
                                                    <Typography
                                                        sx={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '150px',
                                                            fontWeight: 'bold',
                                                            color: '#000',
                                                        }}
                                                    >
                                                        🗜️ {item.name}
                                                    </Typography>
                                                </Tooltip>

                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteFile('zip', index)}
                                                    sx={{ '&:hover': { backgroundColor: '#f77c5d', color: '#fff' } }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Botón de Enviar */}
                    <Grid item xs={12}>
                        <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={addFacturaS3}
                                style={{ backgroundColor: '#0A3E27', color: '#fff', '&:hover': { backgroundColor: '#075633', }, }}
                            >
                                Guardar
                            </Button>
                        </CardActions>
                    </Grid>

                </Grid>
            </Box>

            <Box sx={{ maxWidth: 1200, margin: 'auto', padding: '2rem' }}>
                <Grid container spacing={3}>

                    {facturas.length === 0 ? (
                        <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
                            No hay facturas disponibles.  
                        </Typography>
                    ) : (
                        facturas.map((factura, index) => (
                            <Grid item xs={12} sm={8} md={6} key={index}>
                                <Card elevation={4} sx={{ padding: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {factura.esAdjunto
                                                ? 'Factura Adjunto'
                                                : factura.folio
                                                    ? `Folio: ${factura.folio}`
                                                    : 'Sin Folio'}
                                        </Typography>

                                        {/* Si es adjunto solo muestra nombre del archivo */}
                                        {factura.esAdjunto ? (
                                            <Typography variant="body2">
                                                <strong>Archivo:</strong> {factura.archivoAdjunto?.name || 'N/A'}
                                            </Typography>
                                        ) : (
                                            <>
                                                <Typography variant="body2"><strong>CFDI:</strong> {factura.serie || 'N/A'}</Typography>
                                                <Typography variant="body2"><strong>Fecha:</strong> {factura.fecha || 'N/A'}</Typography>
                                                <Typography variant="body2"><strong>Serie:</strong> {factura.serie || 'N/A'}</Typography>
                                                <Typography variant="body2"><strong>Emisor:</strong> {factura.emisor || 'N/A'}</Typography>
                                                <Typography variant="body2"><strong>Receptor:</strong> {factura.receptor || 'N/A'}</Typography>
                                                <Typography variant="body2"><strong>Total:</strong> {factura.total || 'N/A'}</Typography>
                                            </>
                                        )}
                                    </CardContent>

                                    {/* Botones de acciones */}
                                    <CardActions sx={{ justifyContent: 'space-between' }}>
                                        {/* Botón para ver archivo */}
                                        {factura.esAdjunto ? (
                                            <Tooltip title="Ver archivo">
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    href={factura.archivoAdjunto?.url}
                                                    target="_blank"
                                                    size="small"
                                                >
                                                    Ver
                                                </Button>
                                            </Tooltip>
                                        ) : (
                                            <>
                                                {/* Botón Ver XML */}
                                                {factura.xml?.url_temporal && (
                                                    <Tooltip title="Ver XML">
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            href={factura.xml.url_temporal}
                                                            target="_blank"
                                                            size="small"
                                                        >
                                                            XML
                                                        </Button>
                                                    </Tooltip>
                                                )}
                                                {/* Botón Ver PDF */}
                                                {factura.pdf?.url_temporal && (
                                                    <Tooltip title="Ver PDF">
                                                        <Button
                                                            variant="outlined"
                                                            color="secondary"
                                                            href={factura.pdf.url_temporal}
                                                            target="_blank"
                                                            size="small"
                                                        >
                                                            PDF
                                                        </Button>
                                                    </Tooltip>
                                                )}
                                            </>
                                        )}

                                        {/* Botón eliminar (común para ambos) */}
                                        <Tooltip title="Eliminar">
                                            <IconButton
                                                size="small"
                                                onClick={() => deleteEgresoAxios(factura)}
                                                sx={{ color: '#f77c5d' }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    )}

                </Grid>
            </Box>
            {/* <TablaGeneral
                    subtitulo="información general"
                    url={`v2/proyectos/compras/facturas/${compra}`}
                    columnas={columns}
                    numItemsPagina={20}
                    ProccessData={proccessData}
                    // opciones={opciones}
                    acciones={acciones()}
                    reload={setReloadTable}
                /> */}
        </>

    )
}