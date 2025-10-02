import React, { useState, useEffect,useCallback } from 'react';
import { useSelector } from 'react-redux';
import S3 from 'react-aws-s3'

import Accordion from '@material-ui/core/Accordion';
// import AccordionDetails from '@material-ui/core/AccordionDetailshandleChangeCheck';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import j2xParser from 'fast-xml-parser'
import Swal from 'sweetalert2'
// import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
// import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import { es } from 'date-fns/locale'
import DateFnsUtils from '@date-io/date-fns';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import { apiPostForm, apiGet, apiPutForm } from './../../../functions/api';
import CrearProveedor from './CrearProveedor'
import Style from './../../Administracion/Egresos/Modales/CrearEgreso.module.css'
import { Modal } from './../../../components/singles'

// import Autocomplete from '@mui/material/Autocomplete';
// import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, Box, InputLabel } from '@mui/material';
import { useDropzone } from "react-dropzone";
import Autocomplete from '@material-ui/lab/Autocomplete';

import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ButtonGroup from '@mui/material/ButtonGroup';
import CloseIcon from '@material-ui/icons/Close';



export default function CrearCompras(props) {

    const { opcionesData, handleClose, reload, getProveedores } = props
    const departamento = useSelector(state => state.authUser.departamento)
    const departamentos = useSelector(state => state.opciones.compras)
    const proyectos = useSelector(state => state.opciones.proyectos)
    const [errores, setErrores] = useState({})
    const auth = useSelector((state) => state.authUser.access_token);
    // const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    const [filePreview, setFilePreview] = useState(null);
    const [fileName, setFileName] = useState(""); // Nombre del archivo

    const [files, setFiles] = useState({
        xml: null,
        pdf: null,
        pago: null,
        presupuesto: null,
        zip: null,
        excel: null,
        imagenes: null,
    });

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: async (acceptedFiles) => {
            let updatedFiles = { ...files };

            for (const file of acceptedFiles) {
                try {
                    // Validar tipos de archivo permitidos
                    const allowedTypes = [
                        "application/pdf",
                        "application/xml",
                        "text/xml",
                        "image/png",
                        "image/jpeg",
                        "image/jpg",
                        "application/zip",
                    ];

                    if (!allowedTypes.includes(file.type)) {
                        Swal.fire({
                            icon: "error",
                            title: "Formato no permitido",
                            text: `El archivo ${file.name} no es un PDF, XML o imagen.`,
                        });
                        continue; // Salta este archivo
                    }

                    // Preguntar si es Pago o Presupuesto
                    const result = await Swal.fire({
                        title: "Selecciona el tipo de archivo",
                        text: `¿Este archivo (${file.name}) es un Pago o un Presupuesto?`,
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Guardar",
                        cancelButtonText: "Cancelar",
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        input: "radio",
                        inputOptions: {
                            pago: "Pago",
                            presupuesto: "Presupuesto",
                        },
                        inputValidator: (value) => {
                            if (!value) {
                                return "Debes seleccionar una opción.";
                            }
                        },
                        allowOutsideClick: false,
                    });

                    if (result.isConfirmed && result.value) {
                        updatedFiles[result.value] = file;
                        // Actualiza el estado form.adjuntos
                        setForm((prevForm) => ({
                            ...prevForm,
                            adjuntos: {
                                ...prevForm.adjuntos,
                                [result.value]: { files: [file], value: file.name },
                            },
                        }));
                    }
                } catch (error) {
                    console.error("Error en la selección del archivo:", error);
                }
            }

            setFiles(updatedFiles);
        },
        multiple: true, // Permite múltiples archivos
        accept: "application/pdf, application/xml, text/xml, image/png, image/jpeg, image/jpg",
    });


    const { getRootProps: getRootPropsXmlPdf, getInputProps: getInputPropsXmlPdf } = useDropzone({
        multiple: true,
        accept: "application/pdf, application/xml, text/xml, application/zip, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, image/png, image/jpeg",
        onDrop: async (acceptedFiles) => {
            if (!form.factura) {
                Swal.fire({
                    icon: "warning",
                    title: "Subida de archivos bloqueada",
                    text: "Debes marcar la opción de 'Lleva factura' para subir XML o PDF.",
                });
                return;
            }
            setFiles((prevFiles) => {
                let updatedFiles = {
                    xml: [...(prevFiles.xml || [])],
                    pdf: [...(prevFiles.pdf || [])],
                    zip: [...(prevFiles.zip || [])],
                    excel: [...(prevFiles.excel || [])],
                    imagenes: [...(prevFiles.imagenes || [])],
                };

                let tieneXML = updatedFiles.xml.length > 0;
                let facturaTipo = form.tipoFactura;

                for (const file of acceptedFiles) {
                    const ext = file.name.split('.').pop()?.toLowerCase();

                    switch (ext) {
                        case 'xml':
                            // aquí sí validas que sea CFDI
                            updatedFiles.xml.push(file);
                            tieneXML = true;
                            form.tipoFactura = "nacional";
                            onChangeFactura({ target: { files: [file] } });
                            break;

                        case 'pdf':
                            updatedFiles.pdf.push(file);
                            break;

                        case 'zip':
                            updatedFiles.zip.push(file);
                            break;

                        case 'xls':
                        case 'xlsx':
                            updatedFiles.excel.push(file); // ✅ ya no se confunde con xml
                            break;

                        case 'png':
                        case 'jpg':
                        case 'jpeg':
                            updatedFiles.imagenes.push(file);
                            break;

                        default:
                            console.warn("Archivo desconocido:", file.name, file.type);
                    }
                }

                // 🔥 Si NO hay XML y se sube un PDF, pregunta si es Factura Nacional o Extranjera
                if (!tieneXML && (updatedFiles.pdf.length > 0 || updatedFiles.zip.length > 0 || updatedFiles.excel.length > 0 || updatedFiles.imagenes.length > 0)) {
                    Swal.fire({
                        title: "Tipo de Factura",
                        text: "¿La factura PDF es Nacional o Extranjera?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Guardar",
                        cancelButtonText: "Cancelar",
                        input: "radio",
                        inputOptions: {
                            nacional: "Factura Nacional",
                            extranjera: "Comprobante Extranjero",
                        },
                        inputValidator: (value) => (!value ? "Debes seleccionar un tipo de factura." : null),
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.isConfirmed && result.value) {
                            setForm((prevForm) => ({
                                ...prevForm,
                                tipoFactura: result.value, // ✅ Guarda el tipo de factura en el estado
                            }));
                        }
                    });
                }

                return updatedFiles; // 📌 Retorna el nuevo estado actualizado
            });
        },
    });




    // const handleAddFile = (event, type) => {
    //   const file = event.target.files[0];
    //   if (file) {
    //     setFiles((prevFiles) => ({
    //       ...prevFiles,
    //       [type]: file, // Agrega el archivo al estado
    //     }));
    //     if (type === 'xml') {
    //         onChangeFactura(event);
    //       }
    //   }
    // };


    const handleDeleteFile = (type) => {
        setFiles((prevFiles) => ({
            ...prevFiles,
            [type]: null, // Elimina el archivo seleccionado
        }));
    };

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setFilePreview(URL.createObjectURL(file));
    }, []);
    const [proveedorSelect, setProveedorSelect] = useState({
        preSelect: false,
        id: null,
        name: null,
    })

    useEffect(() => {
        if (proveedorSelect.preSelect) {
            let data = {
                ...proveedorSelect
            }
            handleChangeProveedor('', data)
        }
    }, [proveedorSelect]) //cuando proveedorSelect tenga cualquier modificacion, lo que esta dentro de useEffect se ejecuta

    const [form, setForm] = useState({
        adjuntos: {
            pago: { files: [], value: '' },
            pdf: { files: [], value: '' },
            presupuesto: { files: [], value: '' },
            xml: { files: [], value: '' },
            zip: { files: [], value: '' },
            imagenes: { files: [], value: '' },
            excel: { files: [], value: '' },
        },
        area: '',
        banco: 0,
        comision: 0,
        correo: '',
        cuenta: '',
        cuentas: [],
        comision: 0,
        descripcion: '',
        empresa: '',
        estatusCompra: 2,
        factura: false,
        facturaItem: '',
        facturaObject: {},
        fecha: '',
        partida: "",
        leadId: "",
        nombre: "",
        numCuenta: "",
        partida: '',
        proveedor: '',
        proyecto: '',
        razonSocial: '',
        rfc: null,
        subarea: '',
        telefono: '',
        tipo: 0,
        tipoImpuesto: '',
        tipoPago: 4,
        total: '',
        afectarCuentas: false,
        disabled: true,
        tipoFactura: '',

    })

    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        estatusCompras: [],
        proveedores: [],
        proyectos: [],
        tiposImpuestos: [],
        tiposPagos: [],
    })

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const [nuevoProveedor, setNuevoProveedor] = useState(false)

    useEffect(() => {
        // console.log("Estado actualizado:", nuevoProveedor);
    }, [nuevoProveedor]);

    const handleCloseProveedor = () => {
        setNuevoProveedor(false)
        setForm({
            ...form,
            proveedor: nuevoProveedor.id, // Establecer el proveedor recién creado
            proveedor_nombre: nuevoProveedor.name,
        });
    }

    const agregarProveedor = () => {
        setNuevoProveedor(true)
    }

    useEffect(() => {

        if (opcionesData) {
            setOpciones(opcionesData)
        }
    }, [opcionesData])

    const handleChangeCheck = () => {
        setForm({
            ...form,
            factura: !form.factura
        });
    };

    // const handleDeleteFile = (tipo, index) => {
    //     let files = form.adjuntos[tipo].files;
    //     files.splice(index, 1);

    //     // Check if all XML files are deleted
    //     const allXmlFilesDeleted = tipo === 'xml' && files.length === 0;

    //     //LIMPIA LOS CAMPOS DEL FORMULARIO QUE YA HABIAN SIDO LLENADOS POR UNA FACTURA
    //     setForm((prevForm) => ({
    //         ...prevForm,
    //         adjuntos: {
    //             ...prevForm.adjuntos,
    //             [tipo]: { files: [...files], value: '' },
    //         },
    //         rfc: allXmlFilesDeleted ? '' : prevForm.rfc, // Clear rfc field if all XML files deleted
    //         empresa: allXmlFilesDeleted ? '' : prevForm.empresa,
    //         descripcion: allXmlFilesDeleted ? '' : prevForm.descripcion,
    //         fecha: allXmlFilesDeleted ? '' : prevForm.fecha,
    //         total: allXmlFilesDeleted ? '' : prevForm.total,
    //         facturaObject: allXmlFilesDeleted ? '' : prevForm.facturaObject,
    //     }));
    // };

    const handleChange = (e) => {
        if (e.target.name === 'empresa') {
            setForm({
                ...form,
                [e.target.name]: e.target.value,
                cuentas: opciones.empresas.find(empresa => empresa.id === e.target.value).cuentas,
            });
        } else if (e.target.name === 'cuenta') {

            // console.log( opciones)
            // console.log( form.cuentas)
            let cuenta = form.cuentas.find(empresa => empresa.id === e.target.value).factura
            let impuesto = form.cuentas.find(empresa => empresa.id === e.target.value).id_impuesto

            // console.log(cuenta)
            setForm({
                ...form,
                [e.target.name]: e.target.value,
                factura: cuenta == 1 ? true : false,
                tipoImpuesto: impuesto,
                disabled: true
            });
        } else {
            setForm({
                ...form,
                [e.target.name]: e.target.value
            });
        }

    };
    // console.log(form)

    const handleChangeAreas = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
            partida: ''
        })
    }

    const handleAddFile = (event, type) => {
        const files = event.target.files; // Obtén todos los archivos
        if (files.length > 0) {
            const fileArray = Array.from(files); // Convierte FileList a Array
            const file = fileArray[0]; // Usa el primer archivo (puedes ajustar esto según sea necesario)

            // Actualiza el estado de archivos (solo guarda el primero en este ejemplo)
            setFiles((prevFiles) => ({
                ...prevFiles,
                [type]: file,
            }));

            // Si es XML, procesa el archivo con onChangeFactura
            if (type === 'xml') {
                onChangeFactura(event);
            }

            // Genera un arreglo auxiliar para vistas previas y otras propiedades
            const aux = fileArray.map((file, index) => ({
                name: file.name,
                file: file,
                url: URL.createObjectURL(file), // Genera una URL para vista previa
                key: index,
            }));

            // Genera el path del primer archivo (opcional)
            const path = `C:/fakepath/${aux[0].name}`;

            // Actualiza el formulario con los adjuntos
            //   setForm((prevForm) => ({
            //     ...prevForm,
            //     adjuntos: {
            //       ...prevForm.adjuntos,
            //       [type]: { files: aux, value: path },
            //     },
            //   }));
            setForm({
                ...form,
                adjuntos: {
                    ...form.adjuntos,
                    [type]: { files: aux, value: path }
                }
            })
        }
    };


    const onChangeFactura = (e) => {
        // console.log(e)
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

                    let empresa = opcionesData.empresas.find((empresa) => empresa.rfc === obj.rfc_receptor)

                    if (empresa === undefined) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fromato XML incorrecto',
                            text: 'En esta factura no somos los receptores',
                            showConfirmButton: false,
                            timer: 3000
                        })
                    }
                    let proveedor = opcionesData.proveedores.find((proveedor) => proveedor.rfc === obj.rfc_emisor)

                    if (!proveedor) {
                        Swal.fire({
                            icon: 'error',
                            title: 'No existe el proveedor',
                            text: 'No existe el proveedor, favor de crearlo..',
                            showConfirmButton: false,
                            timer: 1000
                        })
                        setNuevoProveedor(true)

                    } else {
                        form.proveedor = proveedor.id.toString()
                        form.contrato = ''
                        // options.contratos = setOptions(proveedor.contratos, 'nombre', 'id')
                    }

                    let aux = []
                    files.forEach((file, index) => {
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
                        cuentas: empresa ? opciones.empresas.find((empresaData) => empresaData.id === empresa.id).cuentas : '',
                        adjuntos: {
                            ...form.adjuntos,
                            xml: {
                                files: aux,
                                value: path
                            }
                        },
                        facturaObject: obj
                    })
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

    const handleChangeProveedor = (e, value) => {
        if (value && value.name) {
            setForm({
                ...form,
                proveedor: value.id,
                proveedor_nombre: value.name,
            })
        }
        if (value === null) {
            setForm({
                ...form,
                proveedor: null,
                proveedor_nombre: null,
            })
        }
    }

    const handleChangeProyecto = (e, value) => {
        if (value && value.nombre) {
            setForm({
                ...form,
                proyecto: value.id,
                proyecto_nombre: value.nombre,
            })
        }
        if (value === null) {
            setForm({
                ...form,
                proyecto: null,
                proyecto_nombre: null,
            })
        }
    }

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    const handleMoney = (e) => {
        setForm({
            ...form,
            total: e
        })
    }

    const handleMoneyComision = (e) => {
        setForm({
            ...form,
            comision: e
        })
    }

    const addNewFacturaAxios = (files, egreso) => {
        // console.log(files)
        // console.log(egreso)

        let aux = form
        aux.archivos = files
        // console.log(aux)
        apiPostForm(`v2/administracion/facturas`, aux, auth).then(
            (response) => {
                const { factura } = response.data
                setForm({
                    ...form,
                    facturaItem: factura,
                    archivos: files
                })
                attachFactura(egreso, factura)
            }, (error) => { }
        ).catch((error) => {
            console.error(error, 'error')
        })
    }

    const addFacturaS3 = (values, egreso) => {
        apiGet(`v1/constant/admin-proyectos`, auth).then(
            (response) => {
                const { alma } = response.data
                let filePath = `facturas/compras/`
                let aux = []
                // form.adjuntos.xml.File.forEach((file) => {
                //     console.log(file)

                //     aux.push(file)
                // })
                // form.adjuntos.pdf.File.forEach((file) => {
                //     aux.push(file)
                // })

                if (Array.isArray(files.xml)) {
                    files.xml.forEach((file) => {
                        aux.push(file);
                    });
                }

                if (Array.isArray(files.pdf)) {
                    files.pdf.forEach((file) => {
                        aux.push(file);
                    });
                }
                let auxPromises = aux.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file, `${filePath}${Math.floor(Date.now() / 1000)}-${file.name}`)
                            .then((data) => {
                                const { location, status } = data
                                if (status === 204) resolve({ name: file.name, url: location })
                                else reject(data)
                            })
                            .catch((error) => {
                                reject(error)
                            })
                    })
                })
                Promise.all(auxPromises).then(values => { addNewFacturaAxios(values, egreso) }).catch(err => console.error(err))
            }, (error) => { }
        ).catch((error) => {
            console.log(error)
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

    const attachFilesS3 = (files, egreso) => {
        apiPutForm(`v2/proyectos/compras/${egreso.id}/archivos/s3`, { archivos: files }, auth).then(
            (response) => {
                Swal.close()
                Swal.fire({
                    icon: 'success',
                    title: 'Archivos adjuntados',
                    text: 'Los archivos se adjuntaron correctamente',
                    showConfirmButton: false,
                    timer: 1500
                })
                // if (reload) {
                //     reload.reload()
                // }
                reload()
                handleClose(true)

            }, (error) => { }
        ).catch((error) => {
            console.log(error)
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

    const attachFiles = (egreso) => {
        apiGet(`v1/constant/admin-proyectos`, auth).then(
            (response) => {
                const { alma } = response.data;
                let filePath = `compras/${egreso.id}/`;
                let aux = [];
                if (files.pago) {
                    aux.push({
                        name: `${filePath}pagos/${Math.floor(Date.now() / 1000)}-${files.pago.name}`,
                        file: files.pago,
                        tipo: 'pago'
                    });
                }

                if (files.presupuesto) {
                    aux.push({
                        name: `${filePath}presupuestos/${Math.floor(Date.now() / 1000)}-${files.presupuesto.name}`,
                        file: files.presupuesto,
                        tipo: 'presupuesto'
                    });
                }

                // 🔹 Verificar si hay archivos antes de intentar recorrerlos
                // if (form.adjuntos.pago && Array.isArray(form.adjuntos.pago) && form.adjuntos.pago.length > 0) {
                //     form.adjuntos.pago.forEach((file) => {
                //         aux.push({
                //             name: `${filePath}pagos/${Math.floor(Date.now() / 1000)}-${file.name}`,
                //             file: file,
                //             tipo: 'pago'
                //         });
                //     });
                // }
    
                // if (form.adjuntos.presupuesto && Array.isArray(form.adjuntos.presupuesto) && form.adjuntos.presupuesto.length > 0) {
                //     form.adjuntos.presupuesto.forEach((file) => {
                //         aux.push({
                //             name: `${filePath}presupuestos/${Math.floor(Date.now() / 1000)}-${file.name}`,
                //             file: file,
                //             tipo: 'presupuesto'
                //         });
                //     });
                // }
    
    
                // Si no hay archivos, salir de la función
                // if (aux.length === 0) {
                //     console.warn("No hay archivos de pago o presupuesto para subir.");
                //     return;
                // }

                let auxPromises = aux.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file.file, file.name)
                            .then((data) => {
                                const { location, status } = data;
                                if (status === 204) {
                                    resolve({ name: file.name, url: location, tipo: file.tipo });
                                } else {
                                    reject(data);
                                }
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    });
                });

                Promise.all(auxPromises)
                    .then(values => {
                        // console.log("Archivos subidos con éxito:", values);
                        attachFilesS3(values, egreso);
                    })
                    .catch(err => {
                        console.error("Error subiendo archivos a S3:", err);
                    });

            }).catch((error) => {
                console.log(error);
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Error al adjuntar archivos',
                    text: 'Ocurrió un error al adjuntar los archivos',
                    showConfirmButton: false,
                    timer: 1500
                });
            });
    };


    const attachFactura = (egreso, factura) => {
        let objeto = {
            dato: egreso.id,
            tipo: 'compra',
            factura: factura.id
        }
        apiPutForm(`v2/administracion/facturas/attach`, objeto, auth).then(
            (response) => {
                if (form.adjuntos.pago.length || form.adjuntos.presupuesto.length) {
                    attachFiles(egreso)
                } else {
                    Swal.close()
                    Swal.fire({
                        icon: 'success',
                        title: 'compra creada con éxito',
                        text: 'Se creó la compra con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    handleClose(true);

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

    const validateForm = () => {
        let validar = true
        let error = {}
        if (form.proveedor === '') {
            error.proveedor = "Seleccione un proveedor"
            validar = false
        }
        if (form.proyecto === '') {
            error.proyecto = "Seleccione un proyecto"
            validar = false
        }
        if (form.empresa === '') {
            error.empresa = "Seleccione una empresa"
            validar = false
        }
        if (form.fecha === '' || form.fecha === null) {
            error.fecha = "Seleccione una fecha"
            validar = false
        }
        if (form.area === '') {
            error.area = "Seleccione un departamento"
            validar = false
        }
        if (form.partida === '') {
            error.partida = "Seleccione el tipo de gasto"
            validar = false
        }
        if (form.subarea === '') {
            error.subarea = "Seleccione una subarea"
            validar = false
        }
        if (form.descripcion === '') {
            error.descripcion = "Escriba una descripcion"
            validar = false
        }
        if (form.cuenta === '') {
            error.cuenta = "Seleccione una cuenta"
            validar = false
        }
        if (form.total === '') {
            error.total = "indique el monto total"
            validar = false
        }
        // if (form.afectarCuentas === false) {
        //     error.afectarCuentas = "Debe afectar cuentas";
        //     validar = false;
        // }
        console.log(error)
        setErrores(error)
        return validar
    }

    // const handleSend = () => {
    //     if (validateForm()) {
    //         Swal.fire({
    //             title: '¿Estás seguro?',
    //             text: 'Se creará la compra',
    //             icon: 'warning',
    //             showCancelButton: true,
    //             confirmButtonText: 'Sí, crear',
    //             cancelButtonText: 'No, cancelar',
    //             cancelButtonColor: '#d33',
    //             reverseButtons: true
    //         }).then((result) => {

    //             if (result.value) {
    //                 Swal.close();
    //                 Swal.fire({
    //                     title: 'Creando compra',
    //                     text: 'Por favor, espere...',
    //                     allowOutsideClick: false,
    //                     onBeforeOpen: () => {
    //                         Swal.showLoading();
    //                     },
    //                 });

    //                 let aux = { ...form };

    //                 aux.factura = form.factura ? 'Con factura' : 'Sin factura';
    //                 aux.adjuntos = { ...files }; // Asegurar que se copian bien los archivos
    //                 // form.adjutnos =  { ...files };
    //                 // console.log("Archivos antes de enviar:", aux.adjuntos);
    //                 console.log(aux)
    //                 try {
    //                     apiPostForm('v2/proyectos/compras', aux, auth)
    //                         .then((response) => {
    //                             console.log("Respuesta del backend:", response);
    //                             const { compra } = response.data;
    //                             Swal.close();
    //                             Swal.fire({
    //                                 title: 'Compra creada con éxito',
    //                                 text: 'Subiendo adjuntos...',
    //                                 allowOutsideClick: false,
    //                                 onBeforeOpen: () => {
    //                                     Swal.showLoading();
    //                                 },
    //                             });
    //                             const tareas = [];

    //                             setForm({ ...form, compra });
    //                             // 📌 **Subir archivos XML/PDF si la factura es extranjera**
    //                             // if (form.tipoFactura === "extranjera" && files.pdf.length > 0) {
    //                             //     let data = new FormData();
    //                             //     files.pdf.forEach((file) => {
    //                             //         data.append(`files_name_facturas_pdf[]`, file.name);
    //                             //         data.append(`files_facturas_pdf[]`, file);
    //                             //     });
    //                             //     data.append('adjuntos[]', 'facturas_pdf');
    //                             //     data.append('tipo', 'facturas_pdf');

    //                             //     apiPostForm(`v2/proyectos/compras/${compra.id}/archivos/adjuntos/s3`, data, auth);
    //                             // }
    //                             //  if (form.tipoFactura === "nacional" && files?.pdf?.length > 0) {
    //                             //         const data = new FormData();
    //                             //         files.pdf.forEach(file => {
    //                             //             data.append(`files_name_facturas_pdf[]`, file.name);
    //                             //             data.append(`files_facturas[]`, file);
    //                             //         });
    //                             //         data.append('adjuntos[]', 'facturas');
    //                             //         data.append('tipo', 'facturas');
    //                             //         tareas.push(apiPostForm(`v2/proyectos/compras/${compra.id}/archivos/adjuntos/s3`, data, auth));
    //                             //     }

    //                             if (
    //                                 (form.tipoFactura === "extranjera" || form.tipoFactura === "nacional") &&
    //                                 (files?.pdf?.length > 0 || files?.imagenes?.length > 0 || files?.excel?.length > 0)
    //                             ) {
    //                                 const data = new FormData();

    //                                 // PDF
    //                                 if (files?.pdf?.length > 0) {
    //                                     files.pdf.forEach(file => {
    //                                         data.append(`files_name_facturas_pdf[]`, file.name);
    //                                         data.append(`files_facturas[]`, file);
    //                                     });
    //                                 }

    //                                 // Imágenes
    //                                 if (files?.imagenes?.length > 0) {
    //                                     files.imagenes.forEach(file => {
    //                                         data.append(`files_name_facturas_imagen[]`, file.name);
    //                                         data.append(`files_facturas[]`, file);
    //                                     });
    //                                 }

    //                                 // Excel
    //                                 if (files?.excel?.length > 0) {
    //                                     files.excel.forEach(file => {
    //                                         data.append(`files_name_facturas_excel[]`, file.name);
    //                                         data.append(`files_facturas[]`, file);
    //                                     });
    //                                 }

    //                                 // Metadatos adicionales
    //                                 data.append('adjuntos[]', 'facturas');
    //                                 data.append('tipo', form.tipoFactura === "extranjera" ? 'facturas_pdf' : 'facturas');

    //                                 tareas.push(
    //                                     apiPostForm(`v2/proyectos/compras/${compra.id}/archivos/adjuntos/s3`, data, auth)
    //                                 );
    //                             }

    //                             console.log("Estado form después de la compra:", form);
    //                             // ✅ ZIP
    //                             if (files.zip?.length > 0 ) {
    //                                 const data = new FormData();
    //                                 files.zip.forEach(file => {
    //                                     data.append(`files_name_facturas_pdf[]`, file.name);
    //                                     data.append(`files_facturas[]`, file);
    //                                 });
    //                                 data.append('adjuntos[]', 'facturas');
    //                                 data.append('tipo', 'facturas');
    //                                 tareas.push(apiPostForm(`v2/proyectos/compras/${compra.id}/archivos/adjuntos/s3`, data, auth));
    //                             }

    //                             // Verificar si la compra tiene factura
    //                             if (compra.factura) {
    //                                 if (Object.keys(form.facturaObject).length > 0) {
    //                                     addFacturaS3(compra.id, compra);
    //                                 }
    //                             }
    //                             if (files.pago || files.presupuesto) {
    //                                 attachFiles(compra);
    //                             } else {
    //                                 Swal.close();
    //                                 Swal.fire({
    //                                     icon: 'success',
    //                                     title: 'Compra creada con éxito',
    //                                     text: 'Se creó la compra con éxito',
    //                                     showConfirmButton: false,
    //                                     timer: 1500
    //                                 });
    //                                 reload();
    //                                 handleClose(true);
    //                             }

    //                             // console.log('factura')
    //                             // console.log( aux.adjuntos)
    //                             // // 🔥 Importante: Verificar bien los archivos
    //                             // if (
    //                             //     aux.adjuntos.pago && aux.adjuntos.pago.length > 0 ||
    //                             //     aux.adjuntos.presupuesto && aux.adjuntos.presupuesto.length > 0
    //                             // ) {
    //                             //     console.log('✅ Archivos detectados, enviando a attachFiles...');
    //                             //     attachFiles(compra);
    //                             // } else {
    //                             //     // 🔥 Si la compra NO tiene factura, aún debe adjuntar archivos
    //                             //     console.log('no factura')
    //                             //     console.log( aux.adjuntos)
    //                             //     // console.log( form.adjuntos)
    //                             //     console.log( Array.isArray(aux.adjuntos.pago)  )
    //                             //     // console.log( Array.isArray(form.adjuntos.pago)  )
    //                             //     console.log(  form.adjuntos.pago.length > 0 )


    //                             //     // if (form.adjuntos.pago && Array.isArray(form.adjuntos.pago) && form.adjuntos.pago.length > 0) {
    //                             //         // (aux.adjuntos.pago && Object.keys(aux.adjuntos.pago).length > 0) || 

    //                             //     if ( aux.adjuntos.pago.length > 0 || aux.adjuntos.presupuesto.length > 0
    //                             //     ) {
    //                             //         console.log('✅ Compra sin factura pero con adjuntos, enviando a attachFiles...');
    //                             //         attachFiles(compra);
    //                             //     } else {
    //                             //         Swal.close();
    //                             //         Swal.fire({
    //                             //             icon: 'success',
    //                             //             title: 'Compra creada con éxito',
    //                             //             text: 'Se creó la compra con éxito',
    //                             //             showConfirmButton: false,
    //                             //             timer: 1500
    //                             //         });
    //                             //         reload();
    //                             //         handleClose(true);
    //                             //     }
    //                             // }
    //                         })
    //                         .catch((error) => {
    //                             console.error("❌ Error al crear la compra:", error);
    //                             Swal.fire({
    //                                 title: 'Error',
    //                                 text: 'No se pudo crear la compra',
    //                                 icon: 'error',
    //                                 confirmButtonText: 'Cerrar',
    //                             });
    //                         });
    //                 } catch (error) {
    //                     console.error("❌ Error inesperado:", error);
    //                 }
    //             }
    //         });
    //     } else {
    //         Swal.fire({
    //             title: 'Faltan campos',
    //             text: 'Favor de llenar todos los campos',
    //             icon: 'info',
    //             showConfirmButton: false,
    //             timer: 1500,
    //         });
    //     }
    // };


    const handleSend = async () => {
    if (!validateForm()) {
        return Swal.fire({
            title: 'Faltan campos',
            text: 'Favor de llenar todos los campos',
            icon: 'info',
            showConfirmButton: false,
            timer: 1500,
        });
    }

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Se creará la compra con sus adjuntos',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, crear',
            cancelButtonText: 'No, cancelar',
            cancelButtonColor: '#d33',
            reverseButtons: true
        });

        if (!result.isConfirmed) return;

        Swal.fire({
            title: 'Creando compra',
            text: 'Por favor, espere...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            const formData = new FormData();

            // Agregar campos del formulario
            formData.append("proveedor", form.proveedor);
            formData.append("empresa", form.empresa);
            formData.append("area", form.area);
            formData.append("partida", form.partida);
            formData.append("subarea", form.subarea);
            formData.append("cuenta", form.cuenta);
            formData.append("tipoPago", form.tipoPago);
            formData.append("tipoImpuesto", form.tipoImpuesto);
            formData.append("estatusCompra", form.estatusCompra);
            formData.append("fecha", new Date(form.fecha).toISOString());
            formData.append("descripcion", form.descripcion ?? "");
            formData.append("factura", form.factura ? "Con factura" : "Sin factura");
            formData.append("total", form.total);
            formData.append("comision", form.comision ?? 0);
            formData.append("tipoFactura", form.tipoFactura ?? "");
            formData.append("proyecto", form.proyecto);

            if (form.facturaObject && Object.keys(form.facturaObject).length > 0) {
                formData.append("facturaObject", JSON.stringify(form.facturaObject));
            }

            // Agregar archivos al FormData
            const appendFiles = (list, fieldName) => {
                if (!list || list.length === 0) return;
                list.forEach(file => {
                    formData.append(fieldName, file, `${Date.now()}-${file.name}`);
                });
            };

            appendFiles(files.xml, "files_factura[]");
            appendFiles(files.pdf, "files_factura[]");
            appendFiles(files.zip, "files_zip[]");
            appendFiles(files.excel, "files_excel[]");
            appendFiles(files.imagenes, "files_imagenes[]");

            if (files.pago) {
                formData.append("files_pago[]", files.pago, `pago-${Date.now()}-${files.pago.name}`);
            }

            if (files.presupuesto) {
                formData.append("files_presupuesto[]", files.presupuesto, `presupuesto-${Date.now()}-${files.presupuesto.name}`);
            }

            // Llamada única al endpoint
            const response = await apiPostForm("v2/proyectos/compras", formData, auth);
            const { compra } = response.data;

            Swal.fire({
                icon: "success",
                title: "Compra creada con éxito",
                showConfirmButton: false,
                timer: 1500,
            });

            setForm({ ...form, compra });
            reload();
            handleClose(true);

        } catch (error) {
            console.error("❌ Error al crear compra:", error);
            let msg = "Error interno del servidor";

            if (error.response) {
                if (error.response.status === 500) {
                    msg = "Ya existe una factura con este folio y certificado";
                } else if (error.response.status === 422) {
                    msg = error.response.data?.message || "Error de validación";
                } else if (error.response.data?.message) {
                    msg = error.response.data.message;
                }
            }

            Swal.fire({
                icon: "error",
                title: "Error al crear la compra",
                text: msg,
            });
        }
    };



    const handleCuentas = (e) => {
        Swal.fire({
            title: '¿Desea afectar cuentas?',
            text: "Si acepta, se afectaran las cuentas de la requisición y no podrá modificarlas",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'red',
            cancelButtonColor: 'gray',
            confirmButtonText: 'AFECTAR CUENTAS',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setForm({
                    ...form,
                    afectarCuentas: !form.afectarCuentas
                })
            }
        })
    }

    const handleAutocompleteChange = (event, value) => {
        if (value) {
            // Encuentra la empresa seleccionada en las opciones
            const selectedEmpresa = opciones.empresas.find((empresa) => empresa.id === value.id);

            if (selectedEmpresa) {
                setForm((prevForm) => ({
                    ...prevForm,
                    empresa: selectedEmpresa.id, // Actualiza con el ID de la empresa seleccionada
                    cuentas: selectedEmpresa.cuentas, // Asigna las cuentas asociadas a la empresa
                }));
            }
        } else {
            // Si se elimina la selección, limpia los campos relacionados
            setForm((prevForm) => ({
                ...prevForm,
                empresa: '',
                cuentas: [],
            }));
        }
    };

    const handleCuentaChange = (event, value) => {
        if (value) {
            const selectedCuenta = form.cuentas.find((cuenta) => cuenta.id === value.id);

            if (selectedCuenta) {
                setForm((prevForm) => ({
                    ...prevForm,
                    cuenta: selectedCuenta.id,
                    factura: selectedCuenta.factura === 1, // Booleano basado en el valor de factura
                    tipoImpuesto: selectedCuenta.id_impuesto, // ID del impuesto asociado
                    disabled: true, // Ajusta según sea necesario
                }));
            }
        } else {
            setForm((prevForm) => ({
                ...prevForm,
                cuenta: '',
                factura: false,
                tipoImpuesto: '',
                disabled: false,
            }));
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFilePreview(URL.createObjectURL(file)); // Genera la URL para vista previa
            setFileName(file.name); // Guarda el nombre del archivo.
        }
    };

    const handleDelete = () => {
        setFilePreview(null); // Limpia la vista previa
        setFileName(""); // Limpia el nombre del archivo
    };


    return (
        <>
            <Box>

                <Container maxWidth="lg">
                    <DialogTitle id="scroll-dialog-title">Crear compra</DialogTitle>
                    <DialogContent >
                        <Grid container spacing={3}>
             <Grid item  xs={12} sm={8} md={4}>
                                <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                                    {opciones.empresas.length > 0 && (
                                        <>
                                            <InputLabel>Empresa</InputLabel>
                                            <div>
                                                <Autocomplete
                                                    id="empresas-autocomplete"
                                                    options={opciones.empresas}
                                                    getOptionLabel={(option) => option.name || ''}
                                                    isOptionEqualToValue={(option, value) => option.id === value} // Compara por ID
                                                    value={opciones.empresas.find((item) => item.id === form.empresa) || null}
                                                    onChange={handleAutocompleteChange}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Empresa"
                                                            variant="outlined"
                                                            error={!!errores.empresa}
                                                            helperText={errores.empresa || ''}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </>
                                    )}

                                </Paper>
                            </Grid>
             <Grid item  xs={12} sm={8} md={4}>
                                <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                                    {/* {form.cuentas.length > 0 && ( */}
                                    <div>
                                        <InputLabel>Cuenta</InputLabel>
                                        <Select
                                            name="cuenta"
                                            value={form.cuenta}
                                            onChange={handleChange}
                                            className="w-100"
                                            error={!!errores.cuenta}
                                        >
                                            {form.cuentas.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>
                                                    {item.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </div>
                                    {/* // )} */}
                                </Paper>
                            </Grid>
            <Grid item  xs={12} sm={8} md={2}>
                                <Paper sx={{ padding: 2, textAlign: 'center' }} elevation={0} >
                                    <InputLabel>¿Lleva factura?</InputLabel>
                                    <FormGroup row className="centered-form-group">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    disabled={form.disabled}
                                                    checked={!form.factura}
                                                    onChange={handleChangeCheck}
                                                    color="secondary"
                                                    name="factura"
                                                />
                                            }
                                            label="No"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    disabled={form.disabled}
                                                    checked={form.factura}
                                                    onChange={handleChangeCheck}
                                                    color="primary"
                                                    name="factura"
                                                />
                                            }
                                            label="Sí"
                                        />
                                    </FormGroup>
                                </Paper>
                            </Grid>
                <Grid item  xs={12} sm={8} md={2}>
                                <Paper sx={{ padding: 2, textAlign: 'center' }} elevation={0} >
                                    <InputLabel>¿Tipo factura?</InputLabel>
                                    <TextField
                                        name="tipoFactura"
                                        value={form.tipoFactura ? (form.tipoFactura === "nacional" ? "Factura Nacional" : "Comprobante Extranjero") : "No especificado"}
                                        variant="outlined"
                                        fullWidth
                                        disabled
                                    />
                                </Paper>
                            </Grid>


                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={8} md={4}>
                                <Paper sx={{ padding: 2, textAlign: "center" }} elevation={0}>
                                    <InputLabel sx={{ fontWeight: "bold", fontSize: "16px", mb: 2 }}>Subir Archivos XML y PDF</InputLabel>

                                    {/* Dropzone Estilizado */}
                                    <Box
                                        {...getRootPropsXmlPdf()}
                                        sx={{
                                            border: "2px dashed #007BFF",
                                            padding: "20px",
                                            textAlign: "center",
                                            cursor: form.factura ? "pointer" : "not-allowed", // 🚨 Bloquear cursor si no lleva factura
                                            borderRadius: "8px",
                                            backgroundColor: form.factura ? "#F8F9FA" : "#E0E0E0", // 🚨 Hacerlo más gris si está deshabilitado
                                            transition: "all 0.3s",
                                            opacity: form.factura ? 1 : 0.5, // 🚨 Reducir opacidad si está deshabilitado
                                            "&:hover": {
                                                backgroundColor: form.factura ? "#E2ECF9" : "#E0E0E0",
                                            },
                                        }}
                                    >
                                        <input {...getInputPropsXmlPdf()} />
                                        <CloudUploadIcon sx={{ fontSize: 40, color: "#007BFF", mb: 1 }} />
                                        <Typography variant="body2" sx={{ color: "#555" }}>
                                            {form.factura ? "Arrastra y suelta archivos aquí o haz clic para seleccionar" : "Debe activar 'Lleva factura' para subir archivos"}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={8} md={4}>
                <Paper sx={{ padding: 2, textAlign: "center",}} elevation={0}>

                                    {/* Lista de archivos subidos con estilos mejorados */}
                    {["xml", "pdf","zip"].map((type) => (
                                        <Box key={type} sx={{ marginTop: "10px" }}>
                                            {files[type]?.length > 0 && (
                                                <>
                                                    <Typography variant="h6" sx={{ marginTop: "15px", fontSize: "14px", color: "#007BFF", fontWeight: "bold" }}>
                                                    </Typography>
                                                    {files[type].map((file, index) => (
                                                        <Box
                                                            key={index}
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "10px",
                                                                backgroundColor: "#fff",
                                                                padding: "10px",
                                                                marginBottom: "8px",
                                                                borderRadius: "5px",
                                                                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                                                                borderLeft: type === "xml" ? "4px solid #FFA500" : "4px solid #28A745",
                                                            }}
                                                        >
                                                            {/* Icono según el tipo de archivo */}
                                                            {type === "xml" ? (
                                                                <Typography sx={{ fontWeight: "bold", color: "#FFA500" }}>📄 <strong>{type} :</strong></Typography>
                                                            ) : type === "pdf" ? (
                                                                <Typography sx={{ fontWeight: "bold", color: "#28A745" }}>📑 <strong>{type} :</strong></Typography>
                                                            ) : (
                                                                <Typography sx={{ fontWeight: "bold", color: "#FF5733" }}>📦 <strong>{type} :</strong></Typography>
                                                            )}

                                                            {/* Nombre del archivo */}
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    flexGrow: 1,
                                                                    color: "#333",
                                                                    fontSize: "0.875rem",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    whiteSpace: "nowrap",
                                                                }}
                                                                title={file.name}
                                                            >
                                                                {file.name}
                                                            </Typography>

                                                            {/* Botón para visualizar */}
                                                            {type !== "zip" && (
                                                                <IconButton color="primary" href={URL.createObjectURL(file)} target="_blank">
                                                                    <VisibilityIcon />
                                                                </IconButton>
                                                            )}

                                                            {/* Botón para eliminar */}
                                                            <IconButton color="secondary" onClick={() => handleDeleteFile(type, index)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>
                                                    ))}
                                                </>
                                            )}
                                        </Box>
                                    ))}
                                    {files.imagenes?.length > 0 && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="h6" sx={{ color: "#007BFF" }}>🖼️ Imágenes</Typography>
                                            {files.imagenes.map((file, index) => (
                                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <img src={URL.createObjectURL(file)} alt="imagen" width={60} style={{ marginRight: 8, borderRadius: 4 }} />
                                                    <Typography variant="body2">{file.name}</Typography>
                                                    <IconButton onClick={() => handleDeleteFile("imagenes", index)}><DeleteIcon /></IconButton>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                    {files.excel?.length > 0 && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="h6" sx={{ color: "#007BFF" }}>📊 Excel</Typography>
                                            {files.excel.map((file, index) => (
                                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <Typography variant="body2" sx={{ flexGrow: 1 }}>{file.name}</Typography>
                                                    <IconButton color="primary" href={URL.createObjectURL(file)} target="_blank">
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDeleteFile("excel", index)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}


                                </Paper>
                            </Grid>

                    <Grid item  xs={12} sm={8} md={4}>
                                <Paper sx={{ padding: 2, textAlign: "center" }} elevation={0}>
                            <TextField disabled name="rfc" id="standard-disabled"  value={form.rfc || ""}  label="RFC"  />                          
                                </Paper>
                                <Paper sx={{ padding: 2, textAlign: "center" }} elevation={0}>

                         <Button variant="contained" color="primary" onClick={() => {setNuevoProveedor(true);
                            setTimeout(() => console.log("Estado después de cambio:", nuevoProveedor), 0);}}
                                style={{marginTop: '20px',  ml: 2,wminWidth: '25px', height: '35px',backgroundColor: '#0A3E27' }} // Ajuste de margen y tamaño
                                    >     +
                                    </Button>
                                </Paper>

                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                <Grid item  xs={10} sm={6} md={4}>
                                <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                                    <InputLabel>Proveedor</InputLabel>

                                    <Box sx={{ alignItems: 'center' }}>
                                        {/* <ButtonGroup variant="outlined" aria-label="Basic button group"> */}

                                        <Autocomplete
                                            name="proveedor"
                                            options={opciones.proveedores.sort((a, b) => a.name.localeCompare(b.name))} // Orden alfabético
                                            groupBy={(option) => option.name.charAt(0).toUpperCase()} // Agrupa por la primera letra del nombre
                                            getOptionLabel={(option) => option.name} // Mostrar nombre del proveedor
                                            isOptionEqualToValue={(option, value) => option.id === value?.id} // Comparar por ID
                                            value={opciones.proveedores.find((item) => item.id === form.proveedor) || null} // Ajustar el valor actual
                                            onChange={(event, value) => handleChangeProveedor(event, value)} // Manejar cambios
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Proveedor"
                                                    error={!!errores.proveedor}
                                                    helperText={errores.proveedor || ''}
                                                />
                                            )}
                                        />


                                        {/* </ButtonGroup> */}
                                    </Box>

                                </Paper>
                            </Grid>
                            {/* <Grid item  xs={3} sm={2} md={1}>
                <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                    <Button variant="contained" color="primary" onClick={() => {
                    setNuevoProveedor(true);
                    setTimeout(() => console.log("Estado después de cambio:", nuevoProveedor), 0);
                }}
                        style={{marginTop: '20px',  ml: 2,wminWidth: '35px', height: '50px',backgroundColor: '#0A3E27' }} // Ajuste de margen y tamaño
                    >     +
                    </Button>
                </Paper>

                </Grid> */}

                <Grid item  xs={12} sm={8} md={4}>
                                <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                                    <InputLabel>Proyecto</InputLabel>
                                    <Autocomplete
                                        name="proyecto"
                                        options={proyectos.sort((a, b) => a.nombre.localeCompare(b.nombre))} // Opciones ordenadas alfabéticamente
                                        groupBy={(option) => option.nombre.charAt(0).toUpperCase()} // Agrupa por la primera letra del nombre
                                        getOptionLabel={(option) => option.nombre} // Muestra el nombre del proveedor
                                        onChange={(event, value) => handleChangeProyecto(event, value)} // Controlador de cambio
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Proyecto"
                                                error={!!errores.proyecto}
                                                helperText={errores.proyecto || ''}
                                            />
                                        )}
                                    />

                                </Paper>
                            </Grid>
                <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
                                <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                                    {/* <InputLabel>Fecha de Compra</InputLabel> */}
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                                        <KeyboardDatePicker
                                            disableToolbar
                                            label="Fecha de compra"
                                            format="dd/MM/yyyy"
                                            margin="normal"
                                            name="fecha"
                                            value={form.fecha !== '' ? form.fecha : null}
                                            placeholder="dd/mm/yyyy"
                                            onChange={(e) => handleChangeFecha(e, 'fecha')}
                                            className="w-100"
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            error={errores.fecha ? true : false}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Paper>
                            </Grid>

                        </Grid>
                        <Grid container spacing={3}>
               <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
                                <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                                    <InputLabel>Tipo de Pago</InputLabel>
                                    <Autocomplete
                                        id="tipo-pago-autocomplete"
                                        options={opcionesData.tiposPagos} // Opciones de tipo de pago
                                        getOptionLabel={(option) => option.name || ''} // Muestra el nombre del tipo de pago
                                        isOptionEqualToValue={(option, value) => option.id === value} // Compara por ID
                                        value={opcionesData.tiposPagos.find((item) => item.id === form.tipoPago) || null} // Selecciona el valor actual
                                        onChange={(event, value) => {
                                            if (value) {
                                                setForm((prevForm) => ({
                                                    ...prevForm,
                                                    tipoPago: value.id, // Actualiza el ID del tipo de pago seleccionado
                                                }));
                                            } else {
                                                setForm((prevForm) => ({
                                                    ...prevForm,
                                                    tipoPago: '', // Limpia el valor si se elimina la selección
                                                }));
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Tipo de Pago"
                                                variant="outlined"
                                                error={!!errores.tipoPago} // Muestra el error si existe
                                                helperText={errores.tipoPago || ''} // Muestra el texto de ayuda
                                            />
                                        )}
                                    />

                                </Paper>
                            </Grid>
            <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
                                <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                                    {opcionesData.tiposImpuestos.length > 0 && (
                                        <>
                                            <InputLabel>Tipo de Impuesto</InputLabel>
                                            <Autocomplete
                                                id="tipo-impuesto-autocomplete"
                                                options={opcionesData.tiposImpuestos} // Opciones para el tipo de impuesto
                                                getOptionLabel={(option) => option.name || ''} // Muestra el nombre del tipo de impuesto
                                                isOptionEqualToValue={(option, value) => option.id === value} // Compara por ID
                                                value={opcionesData.tiposImpuestos.find((item) => item.id === form.tipoImpuesto) || null} // Selecciona el valor actual
                                                onChange={(event, value) => {
                                                    if (value) {
                                                        setForm((prevForm) => ({
                                                            ...prevForm,
                                                            tipoImpuesto: value.id, // Actualiza el ID del tipo de impuesto seleccionado
                                                        }));
                                                    } else {
                                                        setForm((prevForm) => ({
                                                            ...prevForm,
                                                            tipoImpuesto: '', // Limpia el valor si se elimina la selección
                                                        }));
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Tipo de Impuesto"
                                                        variant="outlined"
                                                        error={!!errores.tipoImpuesto} // Muestra el error si existe
                                                        helperText={errores.tipoImpuesto || ''} // Muestra el texto de ayuda
                                                    />
                                                )}
                                            />

                                        </>
                                    )}
                                </Paper>
                            </Grid>
                <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
                                <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                                    {departamentos.length > 0 && (
                                        <>
                                            <InputLabel>Departamento</InputLabel>
                                            <Autocomplete
                                                name="area"
                                                options={departamentos.sort((a, b) => a.nombreArea.localeCompare(b.nombreArea))} // Ordena alfabéticamente por nombreArea
                                                groupBy={(option) => option.nombreArea.charAt(0).toUpperCase()} // Agrupa por la primera letra de nombreArea
                                                getOptionLabel={(option) => option.nombreArea || ''} // Muestra el nombre del área
                                                isOptionEqualToValue={(option, value) => option.id_area === value?.id_area} // Compara por ID del área
                                                value={departamentos.find((item) => item.id_area === form.area) || null} // Selecciona el valor actual del formulario
                                                onChange={(event, value) => {
                                                    setForm((prevForm) => ({
                                                        ...prevForm,
                                                        area: value ? value.id_area : '', // Actualiza el ID del área seleccionada
                                                    }));
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        label="Departamento"
                                                        error={!!errores.area}
                                                        helperText={errores.area || ''}
                                                    />
                                                )}
                                                sx={{ width: '100%' }} // Ajusta el ancho del componente
                                            />

                                        </>
                                    )}
                                </Paper>
                            </Grid>

                        </Grid>
                        <Grid container spacing={3}>
                <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
                                <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                                    {/* {departamentos.length > 0 && form.area !== '' && ( */}
                                    <>
                                        <InputLabel>Tipo de Gasto</InputLabel>
                                        <Autocomplete
                                            name="partida"
                                            options={
                                                departamentos
                                                    .find((item) => item.id_area === form.area)?.partidas || []
                                            } // Filtra partidas según el área seleccionada
                                            getOptionLabel={(option) => option.nombre || ''} // Muestra el nombre de la partida
                                            isOptionEqualToValue={(option, value) => option.id === value?.id} // Compara las partidas por ID
                                            value={
                                                departamentos
                                                    .find((item) => item.id_area === form.area)
                                                    ?.partidas.find((partida) => partida.id === form.partida) || null
                                            } // Establece el valor seleccionado
                                            onChange={(event, value) => {
                                                setForm((prevForm) => ({
                                                    ...prevForm,
                                                    partida: value ? value.id : '', // Actualiza el ID de la partida seleccionada
                                                }));
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Partida"
                                                    error={!!errores.partida}
                                                    helperText={errores.partida || ''}
                                                />
                                            )}
                                        />

                                    </>
                                    {/* )} */}
                                </Paper>
                            </Grid>
            <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
                                <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                                    {/* {form.area && form.partida !== '' && ( */}
                                    <>
                                        <InputLabel>Tipo de Subgasto</InputLabel>
                                        <Autocomplete
                                            name="subarea"
                                            options={
                                                departamentos
                                                    .find((item) => item.id_area === form.area) // Filtra por área seleccionada
                                                    ?.partidas.find((item) => item.id === form.partida) // Filtra por partida seleccionada
                                                    ?.subpartidas || [] // Obtiene las subpartidas o un array vacío
                                            }
                                            getOptionLabel={(option) => option.nombre || ''} // Muestra el nombre de la subpartida
                                            isOptionEqualToValue={(option, value) => option.id === value?.id} // Compara las opciones por ID
                                            value={
                                                departamentos
                                                    .find((item) => item.id_area === form.area) // Encuentra el área seleccionada
                                                    ?.partidas.find((item) => item.id === form.partida) // Encuentra la partida seleccionada
                                                    ?.subpartidas.find((subpartida) => subpartida.id === form.subarea) || null // Encuentra la subpartida seleccionada
                                            }
                                            onChange={(event, value) => {
                                                setForm((prevForm) => ({
                                                    ...prevForm,
                                                    subarea: value ? value.id : '', // Actualiza el ID de la subpartida seleccionada
                                                }));
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Subárea"
                                                    error={!!errores.subarea}
                                                    helperText={errores.subarea || ''}
                                                />
                                            )}
                                        />

                                    </>
                                    {/* )} */}
                                </Paper>
                            </Grid>
                  <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
                                <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                                    <InputLabel>Total</InputLabel>
                                    <CurrencyTextField
                                        label="Total"
                                        variant="standard"
                                        value={form.total}
                                        currencySymbol="$"
                                        outputFormat="number"
                                        modifyValueOnWheel={false}
                                        onChange={(event, value) => handleMoney(value)}
                                        className="form-control"
                                        error={errores.total ? true : false}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>


                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={8} md={4}>
                <Paper sx={{ padding: 2, textAlign: "center",}} elevation={0}>
                                    <InputLabel sx={{ fontWeight: "bold", fontSize: "16px", mb: 2 }}>Subir Archivos (Pago & Presupuesto)</InputLabel>

                                    {/* Dropzone Estilizado */}
                                    <Box
                                        {...getRootProps()}
                                        sx={{
                                            border: "2px dashed #28A745",
                                            padding: "20px",
                                            textAlign: "center",
                                            cursor: "pointer",
                                            borderRadius: "8px",
                                            transition: "all 0.3s",
                                            "&:hover": {
                                                backgroundColor: "#E3F3E1",
                                            },
                                        }}
                                    >
                                        <input {...getInputProps()} />
                                        <CloudUploadIcon sx={{ fontSize: 40, color: "#28A745", mb: 1 }} />
                                        <Typography variant="body2" sx={{ color: "#555" }}>
                                            Arrastra y suelta archivos aquí o haz clic para seleccionar
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={8} md={4}>
                                <Paper sx={{ padding: 2, textAlign: "center" }} elevation={0}>
                                    {/* Archivos subidos - Pago */}
                                    {files.pago && (
                                        <Box
                                            sx={{
                                                marginTop: "10px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                backgroundColor: "#fff",
                                                padding: "10px",
                                                borderRadius: "5px",
                                                borderLeft: "4px solid #FF5733",
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ flexGrow: 1, color: "#333" }} title={files.pago.name}>
                                                <strong>📄 Pago:</strong> {files.pago.name}
                                            </Typography>
                                            {files.pago.type.includes("image") ? (
                                                <img src={URL.createObjectURL(files.pago)} alt="Imagen subida" width="50" style={{ borderRadius: "4px" }} />
                                            ) : (
                                                <IconButton color="primary" href={URL.createObjectURL(files.pago)} target="_blank">
                                                    <VisibilityIcon />
                                                </IconButton>
                                            )}
                                            <IconButton color="secondary" onClick={() => handleDeleteFile("pago")}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    )}

                                    {/* Archivos subidos - Presupuesto */}
                                    {files.presupuesto && (
                                        <Box
                                            sx={{
                                                marginTop: "10px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                backgroundColor: "#fff",
                                                padding: "10px",
                                                borderRadius: "5px",
                                                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                                                borderLeft: "4px solid #007BFF",
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ flexGrow: 1, color: "#333" }} title={files.presupuesto.name}>
                                                <strong>📄 Presupuesto:</strong> {files.presupuesto.name}
                                            </Typography>
                                            {files.presupuesto.type.includes("image") ? (
                                                <img src={URL.createObjectURL(files.presupuesto)} alt="Imagen subida" width="50" style={{ borderRadius: "4px" }} />
                                            ) : (
                                                <IconButton color="primary" href={URL.createObjectURL(files.presupuesto)} target="_blank">
                                                    <VisibilityIcon />
                                                </IconButton>
                                            )}
                                            <IconButton color="secondary" onClick={() => handleDeleteFile("presupuesto")}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                <Grid item  xs={12} sm={8} md={4}>
                                <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                                    <InputLabel>Descripción</InputLabel>
                                    <TextField
                                        name="descripcion"
                                        label="Descripción"
                                        type="text"
                                        defaultValue={form.descripcion}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        multiline
                                        className="w-100"
                                        error={errores.descripcion ? true : false}
                                    />
                                </Paper>
                            </Grid>



                            {/* <Grid item  xs={12} sm={8} md={4}>
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                    <InputLabel>Comisión</InputLabel>
                        <CurrencyTextField
                        label="Comisión"
                        variant="standard"
                        value={form.comision}
                        currencySymbol="$"
                        modifyValueOnWheel={false}
                        outputFormat="number"
                        onChange={(event, value) => handleMoneyComision(value)}
                        className="form-control"
                    />
                    </Paper>
                </Grid> */}



                        </Grid>






                    </DialogContent>

                    <DialogActions>
                        <Button variant="contained" style={{ backgroundColor: '#F96D49', color: '#fff', '&:hover': { backgroundColor: '#F96D49', }, }} onClick={() => handleClose()}>
                            Cancelar
                        </Button>
                        {/* <Button color="primary" variant="contained" onClick={e => handleSend(form)}>
                Enviar
            </Button> */}
                        <Button style={{ backgroundColor: '#0A3E27', color: '#fff', '&:hover': { backgroundColor: '#0A3E27', }, }} variant="contained" onClick={e => handleSend(form)}>
                            Guardar
                        </Button>
                    </DialogActions>

                </Container>
            </Box>
            {nuevoProveedor && console.log("Renderizando modal:", nuevoProveedor)}

            {/* Modal para agregar un nuevo proveedor */}

            <Modal size="md" title={"agregar proveedor"} handleClose={handleCloseProveedor} show={nuevoProveedor}>
                <CrearProveedor handleClose={handleCloseProveedor} getProveedores={getProveedores} departamentos={departamentos}
                    data={form} reload={reload} handleCloseRecarga={setNuevoProveedor} auth={auth} setProveedorSelect={setProveedorSelect} />
            </Modal>

        </>
    )
}