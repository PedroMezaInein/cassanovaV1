import React, { useState, useEffect } from "react"
import { useSelector } from 'react-redux';
import { apiPostForm, apiGet, apiPutForm, apiDelete, catchErrors } from './../../../../functions/api'

import InputLabel from '@material-ui/core/InputLabel';
import j2xParser from 'fast-xml-parser'
import Swal from 'sweetalert2'
// import S3 from 'react-aws-s3'
import {Grid, Paper, Tooltip, Typography, IconButton, 
    Card, CardContent, CardActions, Box,Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import Button from '@material-ui/core/Button';


export default function Factura(props) {
    const { opcionesData, egreso, handleClose, reload, activeTab } = props
    const auth = useSelector((state) => state.authUser.access_token);
    const [reloadTable, setReloadTable] = useState()
    const [facturas, setFacturas] = useState([]);
    const [facturaPreview, setFacturaPreview] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const proveedores = useSelector((state) => state.opciones.proveedores);

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
            imagenes: { files: [], value: '' },
            excel: { files: [], value: '' },
            zip: { files: [], value: '' } // ✅ Agregado ZIP

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
        url_factura: ''
    })

    const [modal, setModal] = useState({
        eliminar: {
            show: false,
            data: false
        },
    })

    useEffect(() => {
            obtenerFacturas();
            // console.log("Facturas actualizadas:", facturas);

        }, []);

    useEffect(() => {
        if (opcionesData) {
            setOpciones(opcionesData)
        }
        if (reloadTable) {
            reloadTable.reload()
        }
    }, [opcionesData])
    // console.log(opcionesData)
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
    
       // 🟢 Obtener facturas de la API
         const obtenerFacturas = async () => {
            try {
                const response = await apiGet(`v2/administracion/egresos/facturas/${egreso}`, auth);
                const facturasCFDI = response.data.egreso.facturas || []; // facturas "normales"
                const facturasAdjuntos = response.data.egreso.factura || []; // nuevos adjuntos
                const todasFacturas = [...facturasCFDI];
                    // 🔥 Si existen adjuntos, agrégalos como "factura simulada"
                    // console.log(facturasAdjuntos)
                    facturasAdjuntos.forEach((adjunto) => {
                        todasFacturas.push({
                            id: adjunto.id, // o algún ID único
                            nombre_emisor: 'Adjunto',
                            nombre_receptor: 'Adjunto',
                            subtotal: 'n/a',
                            total: 'n/a',
                            archivoAdjunto: { url: adjunto.url_temporal, name: adjunto.name }, // ⚡️
                            esAdjunto: true
                        });
                    });

                    // Ahora seteas todo
                    setFacturas(todasFacturas);

                // setFacturas(response.data.egreso.facturas); // Almacenar facturas en el estado
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Error al obtener facturas' });
            }
        };
        
        // console.log(facturas)
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
                       setFacturaPreview({
                           rfc_receptor: jsonObj['cfdi:Receptor']?.Rfc || 'N/A',
                           nombre_receptor: jsonObj['cfdi:Receptor']?.Nombre || 'N/A',
                           uso_cfdi: jsonObj['cfdi:Receptor']?.UsoCFDI || 'N/A',
                           rfc_emisor: jsonObj['cfdi:Emisor']?.Rfc || 'N/A',
                           nombre_emisor: jsonObj['cfdi:Emisor']?.Nombre || 'N/A',
                           regimen_fiscal: jsonObj['cfdi:Emisor']?.RegimenFiscal || 'N/A',
                           fecha: jsonObj.Fecha || 'N/A',
                           metodo_pago: jsonObj.MetodoPago || 'N/A',
                           total: jsonObj.Total || 'N/A',
                           moneda: jsonObj.Moneda || 'N/A',
                           descripcion: jsonObj['cfdi:Conceptos']?.['cfdi:Concepto']?.Descripcion || 'N/A',
                       });
   
                       // 🔥 Abre el modal con los datos
                       setOpenModal(true);
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
                       let empresa = opcionesData.empresas.find((empresa) => empresa.rfc === obj.rfc_receptor)
   
                       if (!empresa) {
   
                           Swal.fire({
                               icon: 'error',
                               title: 'Fromato Sin empresa',
                               text: 'La factura no tiene la empresa receptora registrada',
                               showConfirmButton: false,
                               timer: 2000
                           })
                       } else {
                           let proveedor = proveedores.find((proveedor) => proveedor.rfc === obj.rfc_emisor)
                           let aux = []
                        //    console.log(files)
                           Array.from(files).forEach((file, index) => {
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
                               proveedor: proveedor ? proveedor.id : null,
                               proveedor_nombre: proveedor ? proveedor.name : null,
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
                [tipo]: { files: [...files], value: '' }
            }
        })
    }

    const handleAddFile = (e) => {
        const archivos = Array.from(e.target.files);
        const nuevosAdjuntos = { ...form.adjuntos };

        archivos.forEach((file, index) => {
            const nombre = file.name.toLowerCase();
            const tipoMime = file.type;

            const fileObj = {
            name: file.name,
            file: file,
            url: URL.createObjectURL(file),
            key: Date.now() + index,
            };

            // Clasificación por tipo de archivo
            if (tipoMime.includes("pdf") || nombre.endsWith(".pdf")) {
            if (!nuevosAdjuntos.pdf) nuevosAdjuntos.pdf = { files: [], value: '' };
            nuevosAdjuntos.pdf.files.push(fileObj);
            nuevosAdjuntos.pdf.value = 'C:/fakepath/' + file.name;
            } else if (tipoMime.includes("image") || nombre.match(/\.(jpg|jpeg|png)$/)) {
            if (!nuevosAdjuntos.imagenes) nuevosAdjuntos.imagenes = { files: [], value: '' };
            nuevosAdjuntos.imagenes.files.push(fileObj);
            nuevosAdjuntos.imagenes.value = 'C:/fakepath/' + file.name;
            } else if (
            tipoMime.includes("sheet") ||
            nombre.endsWith(".xls") ||
            nombre.endsWith(".xlsx")
            ) {
            if (!nuevosAdjuntos.excel) nuevosAdjuntos.excel = { files: [], value: '' };
            nuevosAdjuntos.excel.files.push(fileObj);
            nuevosAdjuntos.excel.value = 'C:/fakepath/' + file.name;
            } else if (tipoMime.includes("zip") || nombre.endsWith(".zip")) {
            if (!nuevosAdjuntos.zip) nuevosAdjuntos.zip = { files: [], value: '' };
            nuevosAdjuntos.zip.files.push(fileObj);
            nuevosAdjuntos.zip.value = 'C:/fakepath/' + file.name;
            }
        });

        setForm({
            ...form,
            adjuntos: nuevosAdjuntos,
        });
    };


    // *************** AGREGAR ARCHIVOS ***************
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
            await apiPostForm(`v2/administracion/egresos/${egreso}/archivos/s3`, data, auth);

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

            // console.log(allFiles)
            addNewFacturaAxios(allFiles, egreso);

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

        // drop-in replacement
    const addNewFacturaAxios = async (files: any, egreso: any) => {
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
            fd.append("filePath", "facturas/egresos/");

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
            attachFactura(egreso, factura);

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



    // const addNewFacturaAxios = (files, egreso) => {
    //     let aux = form
    //     aux.archivos = files
    //     // console.log(egreso)
    //     apiPostForm(`v2/administracion/facturas`, aux, auth).then(
    //         (response) => {
    //             const { factura } = response.data
    //             Swal.close()
    //             Swal.fire({
    //                 icon: 'success',
    //                 title: 'Factura subida con éxito',
    //                 text: 'Se subio la factura con éxito',
    //                 showConfirmButton: false,
    //                 timer: 1500
    //             })
    //             setFacturas((prevFacturas) => [...prevFacturas, factura]); // 🔥 Agregar la nueva factura al estado

    //             attachFactura(egreso, factura);

    //             setForm({
    //                 ...form,
    //                 facturaItem: factura,
    //                 archivos: files,
    //                 adjuntos: {
    //                     xml: { files: [], value: '' },
    //                     pdf: { files: [], value: '' }
    //                 }
    //             });
    //             if (reloadTable) {
    //                 reloadTable.reload()
    //             }
    //             // attachFactura(egreso, factura)
    //         }, (error) => { }
    //     ).catch((error) => {
    //         console.error(error, 'error')
    //     })
    // }

    const attachFactura = (egreso, factura) => {

        let objeto = {
            dato: egreso,
            tipo: 'egreso',
            factura: factura.id
        }
        // console.log(egreso)
        apiPutForm(`v2/administracion/facturas/attach`, objeto, auth).then(
            (response) => {
                // console.log(response)

                Swal.close()
                Swal.fire({
                    icon: 'success',
                    title: 'Gasto creado con éxito',
                    text: 'Se creó el gasto con éxito',
                    showConfirmButton: false,
                    timer: 1500
                })
                obtenerFacturas(); // 🔥 Recargar facturas después de adjuntar

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

    const proccessData = (datos) => {
        let aux = [];

        // if (datos.egreso.facturas.length === 0) { //todos estos valores excepto "estatus" estan dentro del array FACTURAS que esta en el objeto EGRESO. Pregunto si existe FACTURAS
        //     aux.push({
        //         folio: 'n/a',
        //         estatus: datos.egreso.estatus_compra.estatus ? datos.egreso.estatus_compra.estatus : 'n/a',
        //         fecha: 'n/a',
        //         serie: 'n/a',
        //         emisor: 'n/a',
        //         receptor: 'n/a',
        //         subtotal: 'n/a',
        //         total: 'n/a',
        //         adjuntos: 'n/a'
        //     });
        // } else { // dentro de facturas están las propiedades de XML y PDF, cada uno es un objeto
        datos.egreso.facturas.forEach((factura) => {
            let adjuntos = []; // creo un nuevo array para almacenar los valores de los adjuntos 
            if (factura.xml) {
                adjuntos.push(
                    <div style={{ width: '100px', marginRight: '2.5rem' }}>
                        <a style={{ width: '90%' }} href={factura.xml.url} target="_blank" rel="noopener noreferrer">
                            XML: {factura.xml.name}
                        </a>
                    </div>
                );
            }
            if (factura.pdf) {
                adjuntos.push(
                    <div style={{ width: '100px' }}>
                        <a style={{ width: '90%' }} href={factura.pdf.url} target="_blank" rel="noopener noreferrer">
                            PDF: {factura.pdf.name}
                        </a>
                    </div>
                );
            }

            aux.push({
                folio: factura.folio ? factura.folio : 'n/a',
                // estatus: factura.status ? factura.status : 'n/a',
                estatus: 'FACTURADO',
                fecha: factura.fecha ? factura.fecha : 'n/a',
                serie: factura.serie ? factura.serie : 'n/a',
                emisor: factura.nombre_emisor ? factura.nombre_emisor : 'n/a',
                receptor: factura.nombre_receptor ? factura.nombre_receptor : 'n/a',
                subtotal: factura.subtotal ? '$ ' + formatNumber(factura.subtotal) : 'n/a',
                total: factura.total ? '$ ' + formatNumber(factura.total) : 'n/a',
                adjuntos: adjuntos.length > 0 ? adjuntos : 'n/a',
                id: factura.id,
                data: factura,
            });
        });
        // }

        return aux;
    };

    // const deleteEgresoAxios = (id) => {

    //     apiDelete(`v2/administracion/egresos/${egreso.id}/facturas/${id}`, auth).then(
    //         (response) => {
    //             Swal.fire(
    //                 '¡Eliminado!',
    //                 'El egreso ha sido eliminado.',
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
              deletePromise = apiDelete(`v2/administracion/egresos/${egreso}/adjuntos/${factura.id}`, auth);
            } else {
              // 🔥 Si es factura CFDI eliminar de la ruta de facturas
              deletePromise = apiDelete(`v2/administracion/egresos/${egreso}/facturas/${factura.id}`, auth);
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
      
    

    let acciones = () => {
        let aux = [
            {
                nombre: 'Eliminar',
                icono: 'fas fa-trash-alt',
                color: 'redButton',
                funcion: (item) => {
                    Swal.fire({
                        title: '¿Estás seguro?',
                        text: "¡No podrás revertir esto!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',

                        confirmButtonText: 'Sí, bórralo',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            deleteEgresoAxios(item.id)

                        }
                    })
                }
            },
        ]
        return aux
    }


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
                                                sx={{ '&:hover': {
                                                    backgroundColor: '#f77c5d',color: '#f77c5d',},}}
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
                                onChange={handleAddFile}
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
                                                sx={{ '&:hover': {
                                                    backgroundColor: '#f77c5d',color: '#f77c5d',},}}                                            >
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
                            style={{backgroundColor: '#0A3E27',color: '#fff','&:hover': {backgroundColor: '#075633', },}}
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
                            <Typography variant="body2"><strong>Emisor:</strong> {factura.nombre_emisor || 'N/A'}</Typography>
                            <Typography variant="body2"><strong>Receptor:</strong> {factura.nombre_receptor || 'N/A'}</Typography>
                            <Typography variant="body2"><strong>Total:</strong> {factura.total !== 'n/a' ? `$${Number(factura.total).toFixed(2)}` : 'N/A'}</Typography>
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
                    url={`v2/administracion/egresos/facturas/${egreso}`}
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