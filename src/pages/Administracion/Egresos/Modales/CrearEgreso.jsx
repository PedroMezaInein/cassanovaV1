import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { apiPutForm, apiPostForm, apiGet } from './../../../../functions/api';
import CrearProveedor from './../../../Proyectos/Compras/CrearProveedor'
import { Modal } from './../../../../components/singles'

import DateFnsUtils from '@date-io/date-fns';
import Swal from 'sweetalert2'
import { es } from 'date-fns/locale'
import S3 from 'react-aws-s3'

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
// import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import { addDays, format } from 'date-fns';

import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper,Box,InputLabel  } from '@mui/material';
import { useDropzone } from "react-dropzone";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import j2xParser from 'fast-xml-parser'

import Style from './CrearEgreso.module.css'

export default function CrearEgreso(props) {
    const { opcionesData, reload, handleClose, getProveedores } = props
    const auth = useSelector((state) => state.authUser.access_token);
    const departamentos = useSelector(state => state.opciones.areas)
    const [nuevoProveedor, setNuevoProveedor] = useState(false)
    const [errores, setErrores] = useState({})
    const presupuestos = useSelector(state => state.opciones.presupuestos)
    const proveedores = useSelector((state) => state.opciones.proveedores);
    const empresas = useSelector((state) => state.opciones.empresa);
    const [files, setFiles] = useState({
        xml: null,
        pdf: null,
        pago: null,
        presupuesto: null,
        zip: null,
    });

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
    }, [proveedorSelect])

    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        estatusCompras: [],
        proveedores: [],
        tiposImpuestos: [],
        tiposPagos: [],
    })

    useEffect(() => {

        if (opcionesData) {
            setOpciones(opcionesData)
        }
    }, [opcionesData])

    const [form, setForm] = useState({
        adjuntos: {
            pago: { files: [], value: '' },
            pdf: { files: [], value: '' },
            presupuesto: { files: [], value: '' },
            xml: { files: [], value: '' },
            zip: { files: [], value: '' },
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
        id_partidas: "",
        leadId: "",
        nombre: "",
        numCuenta: "",
        proveedor: '',
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
        presupuestos: '',
        tipoFactura:'',

    })

    const handleChangeCheck = () => {
        setForm({
            ...form,
            factura: !form.factura
        });
    };

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
                    // if (keys.includes('cfdi:Conceptos')) {
                    //     if (jsonObj['cfdi:Conceptos']['cfdi:Concepto']) {
                    //         if (Array.isArray(jsonObj['cfdi:Conceptos']['cfdi:Concepto'])) {
                    //             jsonObj['cfdi:Conceptos']['cfdi:Concepto'].forEach((element, index) => {
                    //                 if (index) {
                    //                     obj.descripcion += ' - '
                    //                 }
                    //                 obj.descripcion += element['Descripcion']
                    //             })
                    //         } else {
                    //             obj.descripcion += jsonObj['cfdi:Conceptos']['cfdi:Concepto']['Descripcion']
                    //         }
                    //     }
                    // }
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

                    let proveedor = proveedores.find((proveedor) => proveedor.rfc === obj.rfc_emisor)

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

    const handleAddFile = (e, tipo) => {
        let aux = []

        e.target.files.forEach((file, index) => {
            aux.push({
                name: file.name,
                file: file,
                url: URL.createObjectURL(file),
                key: index
            })
        })

        let path = 'C:/fakepath/' + aux[0].name

        setForm({
            ...form,
            adjuntos: {
                ...form.adjuntos,
                [tipo]: { files: aux, value: path }
            }
        })
    }

    const agregarProveedor = () => {
        setNuevoProveedor(true)
    }

    const handleCloseProveedor = () => {
        setNuevoProveedor(false)
        setForm({
            ...form,
            proveedor: nuevoProveedor.id, // Establecer el proveedor recién creado
            proveedor_nombre: nuevoProveedor.name,
        });
    }

    const attachFilesS3 = (files, egreso) => {
        apiPutForm(`v3/administracion/egresos/${egreso.id}/archivos/s3`, { archivos: files }, auth).then(
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
                handleClose(true)
                reload()

                // handleClose()

            }, (error) => { }
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

    const attachFiles = (egreso) => {
        apiGet(`v1/constant/admin-proyectos`, auth).then(
            (response) => {
                const { alma } = response.data
                let filePath = `egresos/${egreso.id}/`
                let aux = []
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
                // form.adjuntos.pago.files.forEach((file) => {
                //     aux.push(
                //         {
                //             name: `${filePath}pagos/${Math.floor(Date.now() / 1000)}-${file.name}`,
                //             file: file,
                //             tipo: 'pago'
                //         }
                //     )
                // })
                // form.adjuntos.presupuesto.files.forEach((file) => {
                //     aux.push(
                //         {
                //             name: `${filePath}presupuestos/${Math.floor(Date.now() / 1000)}-${file.name}`,
                //             file: file,
                //             tipo: 'presupuesto'
                //         }
                //     )
                // })
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
                    handleClose(true);

                })
                .catch(err => {
                    console.error("Error subiendo archivos a S3:", err);
                });
            }, (error) => { }
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

    const addFacturaS3 = (values, egreso) => {
        // console.log('estaa addFacturaS3')
        // console.log(values)
        // console.log(egreso)
        apiGet(`v1/constant/admin-proyectos`, auth).then(
            (response) => {
                const { alma } = response.data
                let filePath = `facturas/egresos/`
                let aux = []
                // form.adjuntos.xml.files.forEach((file) => {
                //     aux.push(file)
                // })
                // form.adjuntos.pdf.files.forEach((file) => {
                //     aux.push(file)
                // })
                if (Array.isArray(files.xml)) {
                    files.xml.forEach((file) => {
                        aux.push(file);
                    });
                }
                // if (Array.isArray(files.zip)) {
                //     files.zip.forEach((file) => {
                //         aux.push(file);
                //     });
                // }
    
                if (Array.isArray(files.pdf)) {
                    files.pdf.forEach((file) => {
                        aux.push(file);
                    });
                }
                // console.log('Archivos a subir:', aux);

                // 🔥 **Subida a S3 con Nomenclatura Personalizada**
                let auxPromises = aux.map((file) => {
                    let timestamp = Math.floor(Date.now() / 1000); // Marca de tiempo actual
                    let extension = file.name.split('.').pop(); // Obtener la extensión del archivo
                    let nuevoNombre = `GASTO_${egreso.id}_FECHA_${timestamp}.${extension}`; // Nuevo nombre
                    
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file, `${filePath}${nuevoNombre}`)
                            .then((data) => {
                                // console.log('✅ Archivo subido:', data);
                                const { location, status } = data;
                                if (status === 204) {
                                    resolve({ name: nuevoNombre, url: location });
                                } else {
                                    reject(data);
                                }
                            })
                            .catch((error) => {
                                console.error('❌ Error subiendo archivo: addFacturaS3', error);
                                reject(error);
                            });
                    });
                });
                // console.log(auxPromises)
                // handleClose(true);

                // Promise.all(auxPromises).then(values => { addNewFacturaAxios(values, egreso) }).catch(err => console.error(err))
            // }, (error) => { }
                // Esperar todas las promesas de subida
                    // Esperar todas las promesas de subida
            Promise.all(auxPromises).then(values => { addNewFacturaAxios(values, egreso) }).catch(err => console.error(err))
                }, (error) => { }
            ).catch((error) => {
                console.error('❌ Error al obtener configuración S3:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al adjuntar archivos',
                    text: 'Ocurrió un error al adjuntar los archivos',
                    showConfirmButton: false,
                    timer: 1500
                });
            });
    }

    const addNewFacturaAxios = (files, egreso) => {
        let aux = form
        aux.archivos = files
        // console.log(aux)
        apiPostForm(`v2/administracion/facturas`, aux, auth).then(
            (response) => {
                const { factura } = response.data
                // console.log('Subida de archivos :', response)

                setForm({
                    ...form,
                    facturaItem: factura,
                    archivos: files
                })
                attachFactura(egreso, factura)
                // handleClose(true);
                

            }, (error) => { }
        ).catch((error) => {
            console.error('❌ Error en la subida de archivos:', error)
            console.error(error, 'error')
        })
    }

    const attachFactura = (egreso, factura) => {
        // console.log(factura)
        // console.log(egreso)
        let objeto = {
            dato: egreso.id,
            tipo: 'egreso',
            factura: factura.id
        }

        apiPutForm(`v2/administracion/facturas/attach`, objeto, auth).then(
            (response) => {
                // console.log(response)
                // console.log(files)
                // console.log(form)

                // if ((files.pago?.length > 0) || (files.presupuesto?.length > 0)) {
                //     attachFiles(egreso)
                //     handleClose(true)
                // } else {
                   
                    Swal.close()
                    Swal.fire({
                        icon: 'success',
                        title: 'Gasto creado con éxito',
                        text: 'Se creó el gasto con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    reload();                
                    handleClose(true);
                // }
                // handleClose(true)

            }, (error) => {
                console.log(error)
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
            console.log(error)

            Swal.fire({
                icon: 'error',
                title: 'Error al adjuntar archivos',
                text: 'Ocurrio un error al adjuntar los archivos',
                showConfirmButton: false,
                timer: 1500
            })
        })
    }

    // const handleDeleteFile = (tipo, index) => {
    //     let files = form.adjuntos[tipo].files
    //     files.splice(index, 1)
    //     setForm({
    //         ...form,
    //         adjuntos: {
    //             ...form.adjuntos,
    //             [tipo]: {files: [...files], value: ''}
    //         }
    //     })
    // }
    const handleDeleteFile = (type) => {
        setFiles((prevFiles) => ({
          ...prevFiles,
          [type]: null, // Elimina el archivo seleccionado
        }));
      };

    // const handleDeleteFile = (tipo, index) => {

    //     console.log(tipo)
    //     console.log(index)
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


    const handleChangeFecha = (date, tipo) => {

        const nuevaFecha = new Date(date);
        const year = nuevaFecha.getFullYear();
        const month = nuevaFecha.getMonth() + 1; // Los meses van de 0 a 11, por lo que se suma 1
        const day = nuevaFecha.getDate();
        const fechaFormateada = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        setForm({
            ...form,
            [tipo]: date
        })
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
        if (form.id_partidas === '') {
            error.id_partidas = "Seleccione la partida"
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

    const handleSend = () => {
        // console.log(form)
        if (validateForm()) {

            Swal.fire({
                title: '¿Estás seguro?',
                text: 'Se creará el gasto',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, crear',
                cancelButtonText: 'No, cancelar',
                cancelButtonColor: '#d33',
                reverseButtons: true
            }).then((result) => {

                if (result.value) {
                    Swal.close()
                    Swal.fire({
                        title: 'Creando gasto',
                        text: 'Por favor, espere...',
                        allowOutsideClick: false,
                        onBeforeOpen: () => {
                            Swal.showLoading()
                        },
                    })

                    let aux = form

                    aux.factura = form.factura ? 'Con factura' : 'Sin factura'
                    aux.adjuntos = { ...files }; // Asegurar que se copian bien los archivos

                    try {
                        apiPostForm('v3/administracion/egresos', form, auth)
                        .then((response) => {
                            const { egreso } = response.data;

                            Swal.close();
                            Swal.fire({
                                title: 'Gasto creado con éxito',
                                text: 'Subiendo adjuntos...',
                                allowOutsideClick: false,
                                didOpen: () => Swal.showLoading(),
                            });

                            const tareas = [];

                            // ✅ Factura Extranjera - PDF
                            if (form.tipoFactura === "extranjera" && files?.pdf?.length > 0) {
                                const data = new FormData();
                                files.pdf.forEach(file => {
                                    data.append(`files_name_facturas_pdf[]`, file.name);
                                    data.append(`files_facturas[]`, file);
                                });
                                data.append('adjuntos[]', 'facturas');
                                data.append('tipo', 'facturas');
                                tareas.push(apiPostForm(`v2/administracion/egresos/${egreso.id}/archivos/s3`, data, auth));
                            }

                            // ✅ ZIP
                            if (files.zip?.length > 0) {
                                const data = new FormData();
                                files.zip.forEach(file => {
                                    data.append(`files_name_facturas_pdf[]`, file.name);
                                    data.append(`files_facturas[]`, file);
                                });
                                data.append('adjuntos[]', 'facturas');
                                data.append('tipo', 'facturas');
                                tareas.push(apiPostForm(`v2/administracion/egresos/${egreso.id}/archivos/s3`, data, auth));
                            }

                            // ✅ Si es factura nacional, agrega a S3
                            if (egreso.factura && Object.keys(form.facturaObject).length > 0) {
                                tareas.push(
                                    new Promise((resolve, reject) => {
                                        addFacturaS3(egreso.id, egreso);
                                        resolve(); // puedes adaptar addFacturaS3 para que devuelva una promesa real
                                    })
                                );
                            }

                            // ✅ Archivos: pago y presupuesto
                            if (files.pago || files.presupuesto) {
                                tareas.push(
                                    new Promise((resolve, reject) => {
                                        attachFiles(egreso);
                                        resolve(); // igual, puedes adaptar attachFiles para que devuelva una promesa
                                    })
                                );
                            }

                            // Espera a que todas las tareas se completen antes de cerrar el modal
                            Promise.allSettled(tareas).then(() => {
                                Swal.close();
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Gasto creado con éxito',
                                    showConfirmButton: false,
                                    timer: 1500,
                                });
                                reload(); 
                                handleClose(true); // ✅ Solo aquí se cierra el modal
                            }).catch((err) => {
                                console.error("❌ Error al finalizar tareas post-creación", err);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error al finalizar el proceso',
                                    text: 'Algunos archivos no pudieron subirse',
                                });
                            });

                        })
                        .catch((error) => {
                            console.error("❌ Error al crear el gasto:", error);
                            Swal.fire({
                                title: 'Error',
                                text: 'No se pudo crear el gasto',
                                icon: 'error',
                                confirmButtonText: 'Cerrar',
                            });
                        });

                    } catch (error) {
                        console.log(error)
                    }
                }
            })
        }
    }

     const { getRootProps: getRootPropsXmlPdf, getInputProps: getInputPropsXmlPdf } = useDropzone({
            multiple: true,
            accept: "application/pdf, application/xml, text/xml, application/zip",
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
                        zip: [...(prevFiles.zip || [])]
 
                    };
        
                    let tieneXML = updatedFiles.xml.length > 0;
                    let facturaTipo = form.tipoFactura;
        
                    for (const file of acceptedFiles) {
                        try {
                            // console.log(file.type, file.name);
        
                            if (file.type.includes("xml") || file.name.toLowerCase().endsWith(".xml")) {
                                // 📌 Agrega XML automáticamente
                                updatedFiles.xml.push(file);
                                tieneXML = true;
                                form.tipoFactura = "nacional";
        
                                // Simula evento para procesarlo con `onChangeFactura`
                                const fakeEvent = { target: { files: [file] } };
                                // console.log(fakeEvent);
                                onChangeFactura(fakeEvent);
        
                            } else if (file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf")) {
                                // 📌 Agrega PDF sin afectar XML
                                updatedFiles.pdf.push(file);
                            }else if (file.type.includes("zip") || file.name.toLowerCase().endsWith(".zip")) {
                                // 📌 Agrega ZIP
                                updatedFiles.zip.push(file);
                            }
                        } catch (error) {
                            console.error("Error en la selección del archivo:", error);
                        }
                    }
        
                    // 🔥 Si NO hay XML y se sube un PDF, pregunta si es Factura Nacional o Extranjera
                    if (!tieneXML && (updatedFiles.pdf.length > 0 || updatedFiles.zip.length > 0)) {
                        Swal.fire({
                            title: "Tipo de Factura",
                            text: "¿La factura PDF/ZIP es Nacional o Extranjera?",
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
                accept: "application/pdf, application/xml, text/xml, image/png, image/jpeg, image/jpg, application/zip",
              });

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

              const handleChangeProyecto = (e, value) => {
                if (value && value.nombre) {
                    setForm({
                        ...form,
                        presupuestos: value.id,
                        presupuestos_nombre: value.nombre,
                    })
                }
                if (value === null) {
                    setForm({
                        ...form,
                        presupuestos: null,
                        presupuestos_nombre: null,
                    })
                }
            }
        
            //   console.log(form)
            //   console.log(opciones)
            //   console.log(opcionesData)


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
                            options={proveedores.sort((a, b) => a.name.localeCompare(b.name))} // Orden alfabético
                            groupBy={(option) => option.name.charAt(0).toUpperCase()} // Agrupa por la primera letra del nombre
                            getOptionLabel={(option) => option.name} // Mostrar nombre del proveedor
                            isOptionEqualToValue={(option, value) => option.id === value?.id} // Comparar por ID
                            value={proveedores.find((item) => item.id === form.proveedor) || null} // Ajustar el valor actual
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
                    <InputLabel>Presupuesto</InputLabel>
                    <Autocomplete
                    name="presupuestos"
                    options={presupuestos.sort((a, b) => a.nombre.localeCompare(b.nombre))} // Opciones ordenadas alfabéticamente
                    groupBy={(option) => option.nombre.charAt(0).toUpperCase()} // Agrupa por la primera letra del nombre
                    getOptionLabel={(option) => option.nombre} // Muestra el nombre del proveedor
                    onChange={(event, value) => handleChangeProyecto(event, value)} // Controlador de cambio
                    renderInput={(params) => (
                        <TextField 
                        {...params} 
                        variant="outlined" 
                        label="Presupuesto" 
                        error={!!errores.presupuestos}
                        helperText={errores.presupuestos || ''}
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
            {opcionesData?.tiposPagos?.length > 0 && (
                     <>
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
                    </>
                    )}
                    </Paper>
                </Grid>   
            <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                        {opcionesData?.tiposImpuestos?.length > 0 && (
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
                            <InputLabel>Tipo de gasto</InputLabel>
                            <Autocomplete
                                name="id_partidas"
                                options={
                                    departamentos
                                    .find((item) => item.id_area === form.area)?.partidas || []
                                } // Filtra partidas según el área seleccionada
                                getOptionLabel={(option) => option.nombre || ''} // Muestra el nombre de la partida
                                isOptionEqualToValue={(option, value) => option.id === value?.id} // Compara las partidas por ID
                                value={
                                    departamentos
                                    .find((item) => item.id_area === form.area)
                                    ?.partidas.find((partida) => partida.id === form.id_partidas) || null
                                } // Establece el valor seleccionado
                                onChange={(event, value) => {
                                    setForm((prevForm) => ({
                                    ...prevForm,
                                    id_partidas: value ? value.id : '', // Actualiza el ID de la partida seleccionada
                                    }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Partida"
                                    error={!!errores.id_partidas}
                                    helperText={errores.id_partidas || ''}
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
                                        ?.partidas.find((item) => item.id === form.id_partidas) // Filtra por partida seleccionada
                                        ?.subpartidas || [] // Obtiene las subpartidas o un array vacío
                                    }
                                    getOptionLabel={(option) => option.nombre || ''} // Muestra el nombre de la subpartida
                                    isOptionEqualToValue={(option, value) => option.id === value?.id} // Compara las opciones por ID
                                    value={
                                        departamentos
                                        .find((item) => item.id_area === form.area) // Encuentra el área seleccionada
                                        ?.partidas.find((item) => item.id === form.id_partidas) // Encuentra la partida seleccionada
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

        </>
    )

}