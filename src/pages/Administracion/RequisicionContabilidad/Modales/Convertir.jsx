import React, { useState, useEffect,useCallback } from 'react';
import { useSelector } from 'react-redux'

import { apiPutForm, apiPostForm } from '../../../../functions/api'

import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {  printResponseErrorAlert } from '../../../../functions/alert'

import Swal from 'sweetalert2'

import Style from './AprobarSolicitud.module.css'


import { useDropzone } from "react-dropzone";

import Button from '@material-ui/core/Button';
import Select from '@mui/material/Select';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper,Box,InputLabel  } from '@mui/material';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Autocomplete from '@material-ui/lab/Autocomplete';
// import Style from './AprobarSolicitud.module.css'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@material-ui/core/Typography';

import j2xParser from 'fast-xml-parser'

const useStyles = makeStyles((theme) => ({
    textField: {
        width: '75%',
    },
    error: {
        color: 'red',
    }
}));

export default function Convertir(props) {
    const { data, handleClose, reload, opciones, estatusCompras ,getOpciones} = props
    const departamentos = useSelector(state => state.opciones.areas)
    const proveedores = useSelector((state) => state.opciones.proveedores);

    const auth = useSelector(state => state.authUser)
    console.log(data)
    // const [form, setForm] = useState({
    //     fecha: new Date(data.fecha+ 'T08:10:00.000Z'),
    //     departamento: data.data?.id_departamento,
    //     tipoGasto: data.tipoEgreso_id,
    //     tipoSubgasto: data.tipoSubEgreso_id,
    //     tipoPago: data.tipoPago_id,
    //     monto: data.data.monto,
    //     descripcion: data.descripcion,
    //     id: data.id,
    //     orden_compra: data.orden_compra,
    //     fecha_pago: data.fecha_pago ? new Date(data.fecha_pago+ 'T08:10:00.000Z') : '',
    //     id_cuenta: data.cuenta ? data.cuenta.id : null,
    //     monto_solicitado: data.monto_solicitado,
    //     auto1: data.auto1 ? data.auto1 : false,
    //     auto2: data.auto2 ? data.auto2 : false,
    //     auto3: data.auto3 ? data.auto3 : false,
    //     /* id_estatus: data.id_estatus_compra, */
    //     proveedor: data.proveedor,
    //     estatus_compra: data.estatus_compra,
    //     estatus_conta: data.estatus_conta,
    //     afectarCuentas: false,
    //     compra: data.compra,
    //     conta: data.conta,
    //     // factura: data.factura,
    //     facturas: data.factura == 'Con Factura' ? true : false,
    //     empresa: "",
    //     labelPorveedor: data.proveedor ? opciones.proveedores.find(proveedor => proveedor.value == data.proveedor).name : 'Proveedor',
    //     labelCuenta: data.cuenta ? data.cuenta.nombre : 'cuenta',
    //     fecha_entrega: data.fecha_entrega ? new Date(data.fecha_entrega+ 'T08:10:00.000Z') : '',
    // })

    useEffect(() => {
        if (data && opciones) {
            console.log("Actualizando formulario con data:", data);
    
            const empresaSeleccionada = opciones.empresas?.find((empresa) => empresa.nombre === data.data?.empresa);
            const cuentas = empresaSeleccionada?.cuentas || [];
            const cuentaSeleccionada = cuentas?.find((cuenta) => cuenta.nombre === data.data?.cuenta);
    
            setForm((prevForm) => ({
                ...prevForm,
                cuentas,
                cuenta: cuentaSeleccionada?.id || '',
                area: departamentos?.find((area) => area.nombreArea === data.data?.departamento.nombre)?.id_area || '',
                descripcion: data.data?.descripcion || '',
                factura: data.data?.factura === 'Con factura',
                fecha: data.data?.fecha ? new Date(data.data?.fecha) : '',
                id_partidas: departamentos?.find((area) => area.nombreArea === data.data?.departamento.nombre)
                    ?.partidas?.find((partida) => partida.nombre === data.data?.gasto.nombre)?.id || '',
                subarea: departamentos?.find((area) => area.nombreArea === data.data?.departamento.nombre)
                    ?.partidas?.find((partida) => partida.nombre === data.data?.gasto.nombre)
                    ?.subpartidas?.find((subarea) => subarea.nombre === data.data?.subarea)?.id || '',
                proveedor: proveedores?.find((proveedor) => proveedor.name === data.data?.proveedor)?.id || '',
                tipoImpuesto: opciones.tiposImpuestos?.find((impuesto) => impuesto.id === data?.data?.tipo_impuesto?.id)?.id || '',
                orden_compra: data?.orden || '',
                fecha_pago: data.data?.fecha_pago ? new Date(data.data?.fecha_pago) : '',
                monto: data.data?.cantidad || '',
                id_cuenta: data.data?.cuenta?.id || null,
                monto_solicitado: data.data?.monto_solicitado || '',
                compra: data.data?.compra,
            }));
        }
    }, [data, opciones, departamentos]); // 🔥 Se ejecutará cada vez que `data` o `opciones` cambien
    


    const [file, setFile] = useState({
        factura: '',
        xml: ''
    })

    const [form, setForm] = useState({
        fecha: '',
        departamento:'',
        tipoGasto:'',
        tipoSubgasto: '',
        tipoPago: '',
        monto: '',
        descripcion:'',
        id: data.id,
        orden_compra:'',
        fecha_pago: '',
        id_cuenta: '',
        monto_solicitado: '',
        auto1:'',
        auto2: '',
        auto3:'',
        proveedor: '',
        estatus_compra: '',
        estatus_conta:'',
        afectarCuentas: false,
        compra:'',
        conta:'',
        // factura: data.factura,
        facturas: '',
        empresa: "",
        labelPorveedor: '',
        labelCuenta: '',
        fecha_entrega:'',
        cuentas: [],
    })

    const [errores, setErrores] = useState({})
    const classes = useStyles();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    }

    const handleChangeDepartamento = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
            tipoGasto: null,
            tipoSubgasto: null
        })
    }

    const aprobar = () => {
        if (validateForm()) {
            if (form.auto2) {
                    Swal.fire({
                        title: '¿Estas seguro de aprobar esta solicitud?',
                        text: "Confirma los datos antes de continuar",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si, aprobar!',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            if (validateForm()) {
                                Swal.fire({
                                    title: 'Aprobando...',
                                    allowOutsideClick: false,
                                    onBeforeOpen: () => {
                                        Swal.showLoading()
                                    }
                                })

                                let newForm = {
                                    id_departamento: form.area,
                                    id_gasto: form.id_partidas,
                                    descripcion: form.descripcion,
                                    id_subarea: form.subarea,
                                    id_pago: form.tipoPago,
                                    id_solicitante: data.solicitante_id,
                                    monto_pagado: form.monto,
                                    cantidad: form.monto_solicitado,
                                    // autorizacion_1: form.auto1 ? form.auto1.id: null,
                                    autorizacion_2: form.auto2 ? auth.user.id : null,
                                    orden_compra: form.orden_compra,
                                    fecha_pago: form.fecha_pago,
                                    id_cuenta: form.cuenta,
                                    /* id_estatus: form.id_estatus, */
                                    id_proveedor: form.proveedor,
                                    id_estatus_compra: form.id_estatus,
                                    id_estatus_factura: form.factura,
                                    id_estatus_conta: form.id_estatus,
                                    afectar_cuentas: form.afectarCuentas,
                                    empresa: form.empresa,
                                    autorizacion_conta: true,
                                    fecha_entrega: form.fecha_entrega,
                                    form : 'convertir',
                                    facturas: form.facturas,
                                    fecha: form.fecha,


                                }
                                apiPutForm(`requisicion/${form.id}`, newForm, auth.access_token)
                                  .then(
                                    (response) => {
                                        Swal.close()

                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Guardado',
                                            text: 'Se ha guardado correctamente',
                                            timer: 2000,
                                            timerProgressBar: true,
                                        })
                                        reload();
                                        

                                        handleClose()
                                        // Swal.fire({
                                        //     title: 'Subiendo factura..',
                                        //     allowOutsideClick: false,
                                        //     didOpen: () => {
                                        //         Swal.showLoading()
                                        //     }
                                        // })


                                        // if (form.factura && file.factura && file.factura !== '' && file.xml && file.xml !== '') {
                                        //     let archivo = new FormData();
                                        //     let aux = [...file.xml, ...file.factura]
                                        //     archivo.append(`files_name_requisicion[]`, file.factura.name)
                                        //     archivo.append(`files_requisicion[]`, aux)
                                        //     archivo.append('adjuntos[]', "requisicion")
                                        //     archivo.append('tipo', 'Factura')
                                        //     try {
                                        //         apiPostForm(`requisicion/${props.data.id}/archivos/s3`, archivo, auth.access_token)
                                        //             .then(res => {
                                        //                 Swal.close()
                                        //                 Swal.fire({
                                        //                     icon: 'success',
                                        //                     title: 'Guardado',
                                        //                     text: 'Se ha guardado correctamente',
                                        //                     timer: 2000,
                                        //                     timerProgressBar: true,
                                        //                 })
                                        //             })
                                        //             .catch(err => {
                                        //                 Swal.close()
                                        //                 Swal.fire({
                                        //                     icon: 'error',
                                        //                     title: 'El registro fue actualizado pero no fue posible subir la factura',
                                        //                     text: 'Algo salio mal!',
                                        //                 })
                                        //             })
                                        //     } catch (error) {
                                        //         Swal.close()
                                        //         Swal.fire({
                                        //             icon: 'error',
                                        //             title: 'Oops...',
                                        //             text: 'Algo salio mal!',
                                        //         })
                                        //     }
                                        // }
                                        
                                    }, (error) => { 
                                        // printResponseErrorAlert(error)
                                        // Swal.close()
                                        if(error.response.status == 400){
                                            Swal.close()

                                            Swal.fire(error.response.data.message, "", "info");
                                            handleClose('convertir')

                                        }else{

                                        Swal.fire({
                                            title: error.response.data.message ,
                                            showDenyButton: true,
                                            // showCancelButton: true,
                                            confirmButtonText: "Crear",
                                            denyButtonText: `No Crear`,
                                            text: "¿Deseas crear la partida en el presupuesto para aprobación?",
                                          }).then((result) => {
                                            // console.log(result)
                                            /* Read more about isConfirmed, isDenied below */
                                            if (result.isConfirmed) {
                                                Swal.close()
                                            handleClose('convertir')

                                            reload();
                                                apiPutForm(`requisicion/${form.id}/presupuesto`, newForm, auth.access_token).then(
                                                    res => {
                                                        Swal.close()

                                                        let timerInterval;
                                                            Swal.fire({
                                                            title: res.data.message ,
                                                            html: " <b></b> milliseconds.",
                                                            timer: 10000,
                                                            timerProgressBar: true,
                                                            didOpen: () => {
                                                                Swal.showLoading();
                                                                const timer = Swal.getPopup().querySelector("b");
                                                                timerInterval = setInterval(() => {
                                                                timer.textContent = `${Swal.getTimerLeft()}`;
                                                                }, 100);
                                                            },
                                                            willClose: () => {
                                                                clearInterval(timerInterval);
                                                                
                                                            }

                                                            })
                                                    // Swal.fire("Saved!", "Se creo la partida pero necesita aprovacion", "success");
        
                                                    // Swal.fire({
                                                    //     icon: 'success',
                                                    //     title: 'Guardado',
                                                    //     text: 'Se creó la partida pero necesita aprobación',
                                                    //     timer: 2000,
                                                    //     timerProgressBar: true,
                                                    //     onOpen: () => {
                                                    //         handleClose('convertir')
                                                    //         if (reload) {
                                                    //             reload.reload()
                                                    //         }
                                                    //         Swal.showLoading()
                                                    //     }
                                                    // })
                                                })
                                                .catch(err => {
                                                    Swal.close()
                                                    Swal.fire({
                                                        icon: 'error',
                                                        title: 'El registro fue actualizado pero no fue posible subir la factura',
                                                        text: 'Algo salio mal!',
                                                        onOpen: () => {
                                                            handleClose('convertir')
                                                            reload();
                                                            Swal.showLoading()
                                                        }
                                                    })
                                                })
        
        
                                            } else if (result.isDenied) {
        
                                              Swal.fire("Cambia el tipo de gasto para continuar", "", "info");
                                            }
                                          });
                                        }

                                        // Swal.fire({
                                        //     title: 'Oops...',
                                        //     text: error.response.data.message,
                                        //     icon: 'warning',
                                        //     showCancelButton: false,
                                        //     confirmButtonColor: '#3085d6',
                                        //     // cancelButtonColor: '#d33',
                                        //     // cancelButtonText: 'Cancelar',
                                        //     confirmButtonText: 'Aceptar'
                                        // }).then((result) => {
                                        //     if (result.isConfirmed) {
                                        //         Swal.fire({
                                        //             title: 'Enviando',
                                        //             text: 'Espere un momento...',
                                        //             allowOutsideClick: false,
                                        //             allowEscapeKey: false,
                                        //             allowEnterKey: false,
                                        //             showConfirmButton: false,
                                        //             onOpen: () => {
                                        //                 handleClose('convertir')
                                        //                 if (reload) {
                                        //                     reload.reload()
                                        //                 }
                                        //                 Swal.showLoading()
                                        //             }
                                        //         })
                                           
                                        //     }
                                        // })
                                    }
                                ).catch((error) => {
                                    Swal.close()
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'Ha ocurrido un error',
                                    })
                                })
                            } else {
                                Swal.fire(
                                    'Error!',
                                    'Faltan datos por llenar',
                                    'error'
                                )
                            }
                        }
                    })
                } else {
                    Swal.fire({
                        title: 'Requisición no autorizada!',
                        text: 'Debes aprobar la requisición para poder convertirla',
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok',
                    })
                }
        } else {
            Swal.fire({
                title: 'Faltan datos por llenar!',
                text: 'Debes llenar todos los campos para poder convertirla',errores,
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok',
            })
        }
    }

    const validateForm = () => {
        let valid = true
        let aux = {}
        console.log(form)
        if (form.fecha === '' || form.fecha === null) {
            valid = false
            aux.fecha = true
        }
        if (form.fecha_pago === '' || form.fecha_pago === null){
            valid = false
            aux.fecha_pago = true
        }
        if (form.area === '' || form.area === null) {
            valid = false
            aux.area = true
        }
        if (form.id_partidas === '' || form.id_partidas === null) {
            valid = false
            aux.id_partidas = true
        }
        if (form.subarea === '' || form.subarea === null) {
            valid = false
            aux.subarea = true
        }
        if (form.tipoPago === '' || form.tipoPago === null) {
            valid = false
            aux.tipoPago = true
        }
        if (form.monto === '' || form.monto === null || form.monto === 0) {
            valid = false
            aux.monto = true
        }
        if (form.monto_solicitado === '' || form.monto_solicitado === null || form.monto_solicitado === 0) {
            valid = false
            aux.monto_solicitado = true
        }

        
        if (form.descripcion === '' || form.descripcion === null) {
            valid = false
            aux.descripcion = true
        }
        /* if (form.factura) {
            if(file.factura === '' || file.factura === null){
                valid = false
                aux.factura = true
            }
            if(file.xml === '' || file.xml === null){
                valid = false
                aux.xml = true
            }
        } */
        if(form.empresa === '' || form.empresa === null) {
            valid = false
            aux.empresa = true
        }
        if (!form.afectarCuentas) { 
            valid = false
            aux.afectarCuentas = true
        }
        if (form.proveedor === '' || form.proveedor === null) {
            valid = false
            aux.proveedor = true
        }
       
        if (form.factura === '' || form.factura === null) {
            valid = false
            aux.conta = true
        }
        
        if( form.tipoPago === '' || form.tipoPago === null){
            valid = false
            aux.tipoPago = true
        }
        if (form.cuenta === '' || form.cuenta === null) {
            valid = false
            aux.cuenta = true
        }
        console.log(aux)
        setErrores(aux) 
        return valid
    }

    const handleAprueba = (e) => {
        if (e.target.name === 'auto2') {
            setForm({
                ...form,
                auto2: !form.auto2
            })
        }
    }

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

    const handleFactura = (e, tipo) => { 
        setForm({
            ...form,
            factura: tipo
        })

    }

    const handleFile = (e, tipo) => {
        setFile({
            ...file,
            [tipo]: e.target.files[0]
        })
    }

    const handleMoney = (e) => {
        setForm({
            ...form,
            monto: e
        })
    }
    const monto_solicitado = (e) => {
        setForm({
            ...form,
            monto_solicitado: e
        })
    }

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
                        /* form.nombre = obj.nombre_receptor */

                        /* this.setState({
                            ...this.state,
                            form
                        }) */
                    } else { errores.push('El XML no tiene el receptor') }
                    if (keys.includes('cfdi:Emisor')) {
                        obj.rfc_emisor = jsonObj['cfdi:Emisor']['Rfc']
                        obj.nombre_emisor = jsonObj['cfdi:Emisor']['Nombre']
                        obj.regimen_fiscal = jsonObj['cfdi:Emisor']['RegimenFiscal']
                        /* form.rfc = obj.rfc_emisor
                        form.razonSocial = obj.nombre_emisor */
                        /* this.setState({
                            ...this.state,
                            form
                        }) */
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
                    setForm({
                        ...form,
                        monto: obj.total ? obj.total : form.monto,
                        fecha_pago: obj.fecha ? obj.fecha : form.fecha_pago,
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

            setFile({
                ...file,
                xml: files[0]
            })
        
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

    const handleDeleteAdjunto = (tipo) => { 
        setFile({
            ...file,
            [tipo]: ''
        })
    }

    const handleChangeCuenta = (e, value) => {
        if (value && value.nombre) {
            setForm({
                ...form,
                id_cuenta: value.id,
                labelCuenta: value.nombre
            })
        }
    }

    const handleChangeProveedor = (e, value) => {
    
        if (value && value.name) {
            // console.log("ID del proveedor:", value.data?.id); // ✅ Acceder a ID dentro de `data`
    
            setForm((prevForm) => ({
                ...prevForm,
                proveedor: value.data?.id || '', // Usa `?.` para evitar errores si `data` es `undefined`
                proveedor_nombre: value.name,
            }));
        } else {
            setForm((prevForm) => ({
                ...prevForm,
                proveedor: '',
                proveedor_nombre: '',
            }));
        }
    };

    const handleChangeCheck = () => {
        setForm({
            ...form,
            facturas: !form.facturas
        });
    };

    const handleAutocompleteChange = (event, value) => {
        if (value) {
            // console.log("Empresa seleccionada:", value); // 🔥 Depuración en consola
    
            setForm((prevForm) => ({
                ...prevForm,
                empresa: value.value, // 🔥 Solo actualiza empresa cuando el usuario la selecciona
                cuentas: value.cuentas || [], // 🔥 Carga las cuentas de la empresa
                cuenta: '', // 🔥 Reinicia la cuenta cuando cambia la empresa
            }));
        } else {
            setForm((prevForm) => ({
                ...prevForm,
                empresa: '', // 🔥 Se mantiene vacío si se deselecciona
                cuentas: [],
                cuenta: '',
            }));
        }
    };
    


    const handleCuentaChange = (event) => {
        const { value } = event.target;
        setForm((prevForm) => ({
            ...prevForm,
            cuenta: value, // 🔥 Asigna la cuenta seleccionada
        }));
    };
    
    

    // console.log(data)
//     console.log(form)

// console.log(departamentos)
// console.log(opciones)


    return (
        <>
        <Box>   
          <Container maxWidth="lg">
          <DialogTitle  >Nueva Requisicion</DialogTitle>
          <DialogContent >
            <Grid container spacing={3}> 

                 <Grid item  xs={12} sm={6} md={3}>
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                    <InputLabel>N. orden de Compra</InputLabel>
                    <TextField
                        name="orden_compra"
                        label="Orden de compra"
                        type="text"
                        value={form.orden_compra !== '' ? form.orden_compra : null}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        multiline
                        disabled
                        className="w-100"
                        error={errores.orden_compra ? true : false}
                    />
                    </Paper>
                </Grid>   
                 <Grid item  xs={12} sm={6} md={3} justifyContent="space-around">
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                    {/* <InputLabel>Fecha de Compra</InputLabel> */}
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                        <KeyboardDatePicker
                            disableToolbar
                            label="Fecha de solicitud"
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

                <Grid item  xs={12} sm={6} md={3} justifyContent="space-around">
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                    {/* <InputLabel>Fecha de Compra</InputLabel> */}
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                        <KeyboardDatePicker
                            disableToolbar
                            label="Fecha de pago"
                            format="dd/MM/yyyy"
                            margin="normal"
                            name="fecha_pago"
                            value={form.fecha_pago !== '' ? form.fecha_pago : null}
                            placeholder="dd/mm/yyyy"
                            onChange={(e) => handleChangeFecha(e, 'fecha_pago')}
                            className="w-100"
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            error={errores.fecha_pago ? true : false}
                        />
                    </MuiPickersUtilsProvider>
                    </Paper>
                </Grid>   

                <Grid item  xs={12} sm={6} md={3} justifyContent="space-around">
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                    {/* <InputLabel>Fecha de Compra</InputLabel> */}
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                        <KeyboardDatePicker
                            disableToolbar
                            label="Fecha de entrega"
                            format="dd/MM/yyyy"
                            margin="normal"
                            name="fecha_entrega"
                            value={form.fecha_entrega !== '' ? form.fecha_entrega : null}
                            placeholder="dd/mm/yyyy"
                            onChange={(e) => handleChangeFecha(e, 'fecha_entrega')}
                            className="w-100"
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            error={errores.fecha_entrega ? true : false}
                        />
                    </MuiPickersUtilsProvider>
                    </Paper>
                </Grid>   
                    
            </Grid>
            <Grid container spacing={3}> 
                <Grid item  xs={12} sm={6} md={3} justifyContent="space-around">
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                    <InputLabel>Monto solicitado</InputLabel>
                        <CurrencyTextField
                            label="Monto solicitado"
                            variant="standard"
                            name="monto"
                            value={form.monto}
                            currencySymbol="$"
                            outputFormat="number"
                            disabled
                            modifyValueOnWheel={false}
                            onChange={(event, value) => handleMoney(value)}
                            className="form-control"
                            error={errores.monto ? true : false}
                        />                        
                    </Paper>
                </Grid>        

                <Grid item  xs={12} sm={8} md={3} justifyContent="space-around">
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
                 <Grid item  xs={12} sm={8} md={3} justifyContent="space-around">
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                        {departamentos.length > 0 && form.area !== '' && (
                            <>
                                <InputLabel>Tipo de Gasto</InputLabel>
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
                        )}
                        </Paper>
                    </Grid>
                        <Grid item  xs={12} sm={8} md={3} justifyContent="space-around">
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >                    
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
                        </Paper>
                    </Grid>
                    
            </Grid>

            <Grid container spacing={3}>
            
            <Grid item  xs={12} sm={6} md={3} justifyContent="space-around">
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                    <InputLabel>Monto Pagado</InputLabel>
                        <CurrencyTextField
                            label="Monto solicitado"
                            variant="standard"
                            name="monto_solicitado"
                            value={form.monto_solicitado}
                            currencySymbol="$"
                            outputFormat="number"
                            modifyValueOnWheel={false}
                            onChange={(event, value) => monto_solicitado(value)}
                            className="form-control"
                            error={errores.monto_solicitado ? true : false}
                        />                        
                    </Paper>
                </Grid>  
                <Grid item  xs={12} sm={8} md={3}>
                    <Paper sx={{padding: 2,  textAlign: 'center', }} elevation={0} >
                            {opciones.empresas.length > 0 && (
                                <>
                                <InputLabel>Empresa</InputLabel>
                                <div> 
                                <Autocomplete
                                    id="empresas-autocomplete"
                                    name="empresa"
                                    options={opciones.empresas}
                                    getOptionLabel={(option) => option.name || ''} // 🔥 Muestra el nombre correctamente
                                    isOptionEqualToValue={(option, value) => option.id === value?.id} // 🔥 Compara correctamente los IDs
                                    value={opciones.empresas.find((item) => item.value === form.empresa) || null} // 🔥 Seleccionar la empresa correcta
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
                 <Grid item  xs={12} sm={8} md={3}>
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                    {form.cuentas.length > 0 && (
                        <div>
                            <InputLabel>Cuenta</InputLabel>
                            <Select
                                name="cuenta"
                                value={form.cuenta}
                                onChange={handleCuentaChange}
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
                    )}

                    </Paper>
                </Grid>

                <Grid item xs={12} sm={8} md={3} justifyContent="space-around">
                    <Paper sx={{ padding: 2, textAlign: 'center' }} elevation={0}>
                        <InputLabel>Tipo de Pago</InputLabel>
                        {opciones?.tiposPagos?.length > 0 && ( // 🔥 Verificamos que haya opciones
                            <Autocomplete
                                id="tipo-pago-autocomplete"
                                name="tipoPago"
                                options={opciones.tiposPagos} // 🔥 Opciones de tipo de pago
                                getOptionLabel={(option) => option.name || ""} // 🔥 Muestra el nombre correcto
                                isOptionEqualToValue={(option, value) => option.id === value?.id} // 🔥 Comparación correcta por ID
                                value={opciones.tiposPagos.find((item) => item.data?.id === form.tipoPago) || null} // 🔥 Selecciona el valor correcto
                                onChange={(event, value) => {
                                    console.log("Valor seleccionado:", value); // 🔥 Ver qué valor está seleccionado

                                    setForm((prevForm) => ({
                                        ...prevForm,
                                        tipoPago: value ? value.data.id : "", // 🔥 Guarda el ID seleccionado
                                    }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Tipo de Pago"
                                        variant="outlined"
                                        name="tipoPago"
                                        error={!!errores.tipoPago} // 🔥 Muestra error si es necesario
                                        helperText={errores.tipoPago || ""} // 🔥 Mensaje de error si lo hay
                                    />
                                )}
                            />
                        )}
                    </Paper>
                </Grid>

 
                


            </Grid>

            <Grid container spacing={3}>


                <Grid item xs={12} sm={8} md={3} justifyContent="space-around">
                    <Paper sx={{ padding: 2, textAlign: "center" }} elevation={0}>
                        <InputLabel>Estatus de pago</InputLabel>
                        <Autocomplete
                            id="estatus-pago-autocomplete"
                            options={estatusCompras.filter((item) => item.nivel === 2)} // 🔥 Filtramos solo los de nivel 2
                            getOptionLabel={(option) => option.estatus || ""} // Muestra el estatus en el dropdown
                            isOptionEqualToValue={(option, value) => option.id === value?.id} // Compara por ID
                            value={estatusCompras.find((item) => item.id === form.conta) || null} // Selecciona el valor actual
                            onChange={(event, value) => {
                                setForm((prevForm) => ({
                                    ...prevForm,
                                    conta: value ? value.id : "", // 🔥 Actualiza el ID seleccionado
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Estatus de pago"
                                    variant="outlined"
                                    name="conta"
                                    error={!!errores.conta} // Muestra error si existe
                                    helperText={errores.conta || ""} // Muestra mensaje de error
                                />
                            )}
                        />
                    </Paper>
                </Grid>


                <Grid item  xs={12} sm={8} md={3} justifyContent="space-around">
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                    <InputLabel>Estatus de facturación</InputLabel>
                    <Autocomplete
                            id="estatus-pago-autocomplete"
                            options={estatusCompras.filter((item) => item.nivel === 3)} // 🔥 Filtramos solo los de nivel 2
                            getOptionLabel={(option) => option.estatus || ""} // Muestra el estatus en el dropdown
                            isOptionEqualToValue={(option, value) => option.id === value?.id} // Compara por ID
                            value={estatusCompras.find((item) => item.id === form.factura) || null} // Selecciona el valor actual
                            onChange={(event, value) => {
                                setForm((prevForm) => ({
                                    ...prevForm,
                                    factura: value ? value.id : "", // 🔥 Actualiza el ID seleccionado
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Estatus de facturación"
                                    variant="outlined"
                                    name="factura"
                                    error={!!errores.factura} // Muestra error si existe
                                    helperText={errores.factura || ""} // Muestra mensaje de error
                                />
                            )}
                        />

                    </Paper>
                </Grid> 

                <Grid item  xs={12} sm={8} md={3} justifyContent="space-around">
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                    <InputLabel>Estatus de entrega</InputLabel>
                    <Autocomplete
                            id="estatus-pago-autocomplete"
                            name="id_estatus"
                            options={estatusCompras.filter((item) => item.nivel === 1)} // 🔥 Filtramos solo los de nivel 2
                            getOptionLabel={(option) => option.estatus || ""} // Muestra el estatus en el dropdown
                            isOptionEqualToValue={(option, value) => option.id === value?.id} // Compara por ID
                            value={estatusCompras.find((item) => item.id === form.id_estatus) || null} // Selecciona el valor actual
                            onChange={(event, value) => {
                                setForm((prevForm) => ({
                                    ...prevForm,
                                    id_estatus: value ? value.id : "", // 🔥 Actualiza el ID seleccionado
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Estatus de facturación"
                                    variant="outlined"
                                    name="id_estatus"
                                    error={!!errores.id_estatus} // Muestra error si existe
                                    helperText={errores.id_estatus || ""} // Muestra mensaje de error
                                />
                            )}
                        />

                    </Paper>
                </Grid> 

                 <Grid item xs={12} sm={8} md={3}>
                    <Paper sx={{ padding: 2, textAlign: 'center' }} elevation={0}>
                        <InputLabel>Proveedor</InputLabel>
                        <Autocomplete
                            name="proveedor"
                            options={opciones.proveedores.sort((a, b) => a.name.localeCompare(b.name))} // Orden alfabético
                            getOptionLabel={(option) => option.name || ''} // Muestra el nombre del proveedor
                            isOptionEqualToValue={(option, value) => option.data?.id === value?.data?.id} // Comparar por ID dentro de `data`
                            value={opciones.proveedores.find((item) => item.data?.id === form.proveedor) || null} // Ajustar el valor actual
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
                    </Paper>
                </Grid>


            </Grid>
            <Grid container spacing={3}>
                 <Grid item  xs={12} sm={8} md={4}>
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                    <InputLabel>Descripción</InputLabel>
                    <TextField
                        name="descripcion"
                        label="Descripción"
                        type="text"
                        value={form.descripcion !== '' ? form.descripcion : null}
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
                <Grid item  xs={12} sm={8} md={2}>
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                     <InputLabel className={`${errores.afectarCuentas ? classes.error : ''}`}>AFECTAR CUENTAS</InputLabel>
                        <Checkbox
                            checked={form.afectarCuentas}
                            onChange={handleCuentas}
                            name="afectarCuentas"
                            color="secondary"
                            style={{ marginLeft: '15%' }}
                            disabled={form.afectarCuentas}
                        />
                    </Paper>
                    

                </Grid> 
                <Grid item  xs={12} sm={8} md={2}>
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                        <InputLabel >Aprobar Requsición</InputLabel>
                            <Checkbox
                                checked={form.auto2}
                                onChange={handleAprueba}
                                name="auto2"
                                color="primary"
                                style={{ marginLeft: '20%' }}
                            />
                    </Paper>
                </Grid> 

                <Grid item  xs={12} sm={8} md={2}>
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                    <InputLabel>¿Lleva factura?</InputLabel>
                    <FormGroup row>
                        <FormControlLabel
                            control={<Checkbox checked={!form.facturas} onChange={handleChangeCheck} color='secondary' name='facturas' />}
                            label="No"

                        />
                        <FormControlLabel
                            control={<Checkbox checked={form.facturas} onChange={handleChangeCheck} color='primary' name='facturas' />}
                            label="Si"

                        />
                    </FormGroup>
                    </Paper>
                </Grid> 

            </Grid>





          </DialogContent>

          <DialogActions>
              <Button style={{ backgroundColor: '#F96D49', color: '#fff', '&:hover': { backgroundColor: '#F96D49', }, }} variant="contained"  onClick={() => handleClose()}>
                  Cancelar
                  </Button>
              {/* <Button color="primary" variant="contained" onClick={e => handleSend(form)}>
                  Enviar
              </Button> */}
              <Button style={{ backgroundColor: '#0A3E27', color: '#fff', '&:hover': { backgroundColor: '#0A3E27', }, }} variant="contained" onClick={e => aprobar(form)}>
              Guardar
              </Button>
          </DialogActions>

          </Container>
          </Box>

      </>
    )
}