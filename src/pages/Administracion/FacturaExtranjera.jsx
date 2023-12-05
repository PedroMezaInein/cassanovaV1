import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { apiOptions, apiPutForm, apiPostForm, apiGet } from './../../functions/api';

import DateFnsUtils from '@date-io/date-fns';
import Swal from 'sweetalert2'
import { es } from 'date-fns/locale'
import S3 from 'react-aws-s3'
import { Card, Tab, Row, Col, Nav } from 'react-bootstrap'
import NumberFormat from 'react-number-format'
import { setLabelTable, dayDMY } from '../../functions/setters'

import { Modal, ItemSlider, ItemDoubleSlider } from '../../components/singles'



import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import j2xParser from 'fast-xml-parser'

import Style from './Egresos/Modales/CrearEgreso.module.css'

export default function EditarEgreso(props) {
    const {opcionesData, reload, handleClose, data} = props
    const auth = useSelector((state) => state.authUser.access_token)
    const departamentos = useSelector(state => state.opciones.areas)
    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        estatusCompras: [],
        proveedores: [],
        tiposImpuestos: [],
        tiposPagos: [],
    })
    // useEffect(() => {
        
    //     if(opcionesData){
    //         setOpciones(opcionesData)
    //     }
    // }, [opcionesData])

    // useEffect(() => {
    //     if(opciones.empresas.length > 0){
    //         setForm({
    //             ...form,
    //             cuentas: opciones.empresas.find(empresa => empresa.id === form.empresa).cuentas
    //         })
    //     }
    // }, [opciones.empresas])

    // useEffect(() => {
    //       if(opciones.empresas.length > 0){
    //         setForm({
    //             ...form,
    //             cuentas: opciones.empresas.find(empresa => empresa.id === form.empresa).cuentas
    //         })
    //     }
        
    //     getEgreso()
        
    // }, [opciones.empresas])

    // useEffect(() => {
    //     if(opciones.empresas.length > 0){
    //         setForm({
    //             ...form,
    //             cuentas: opciones.empresas.find(empresa => empresa.id === data.empresa.id).cuentas
    //         })
    //     }
    // }, [opciones.empresas])

    const getEgreso = async () => {
        // waitAlert()
        // const { areas } = this.props
        apiGet(`v2/administracion/egresos/${data.id}`, auth).then(
            (response) => {
                const { egreso } = response.data
                setForm({
                    ...form,
                    rfc: egreso.proveedor.rfc,
                })
         
            }, (error) => { }
        ).catch((error) => { })
    }
    console.log(data)

    const [form, setForm] = useState({
        // adjuntos: {
        //     pago: {files:[], value: ''},
        //     pdf: { files: [], value: '' },
        //     presupuesto: { files: [], value: '' },
        //     xml: { files: [], value: '' },
        // },
        // area : data.area ?  data.area.id : '',
        // banco: 0,
        // comision: data.comision,
        // correo: '',
        // cuenta: data.cuenta ? data.cuenta.id : '',
        // cuentas: [],
        // comision: 0,
        // descripcion: data.descripcion,
        // empresa: data.empresa.id,
        // estatusCompra: data.estatus_compra.id,
        // data[0]: data.data[0] === 1 ? true : false,
        // facturaItem: '',
        // facturaObject: {},
        // fecha: new Date(data.created_at) ,
        // // id_partidas: `${data.id_partidas}`,
        // leadId: "",
        // nombre: "",
        // numCuenta: "",
        // id_partidas: data.id_partidas ? data.id_partidas : '',
        // proveedor: data.proveedor.id,
        // proveedor_nombre: data.proveedor.razon_social,
        // razonSocial: '',
        // rfc: data.proveedor.length > 0 ? data.proveedor.rfc : '',
        // subarea: data.subarea ? data.subarea.id : '',
        // telefono: '',
        // tipo: 0,
        // tipoImpuesto: data.tipo_impuesto.id,
        // tipoPago: data.tipo_pago.id,
        // total: data.total,
    })

    // useEffect(() => {
    //     if(form.rfc!==''){       
    //         // console.log( opciones.empresas)
    //         if(opciones.empresas){
    //             setForm({
    //                 ...form,
    //                 cuentas: opciones.empresas.find(empresa => empresa.id === data.empresa.id).cuentas
    //             })
    //         }else{
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Espere ....',
    //                 text: 'Se estan cargando las empresas',
    //                 showConfirmButton: false,
    //                 timer: 3000
    //             })
                
    //         }
     
    //     }
    // }, [form.rfc])

    const handleChangeCheck = () => {
        setForm({
            ...form,
            factura: !form.factura
        });
    };

    const handleChange = (e) => {

        if(e.target.name === 'empresa'){
            setForm({
                ...form,
                [e.target.name]: e.target.value,
                cuentas: opciones.empresas.find(empresa => empresa.id === e.target.value).cuentas
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
                    let proveedor = opcionesData.proveedores.find((proveedor) => proveedor.rfc === obj.rfc_emisor)
                    let aux = []
                    files.forEach((file, index) => {
                        aux.push({
                            name: file.name,
                            file: file,
                            url: URL.createObjectURL(file),
                            key: index
                        })
                    })
                    let path = `C:/fakepath/` + aux[0].name
                    
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
                        cuentas: opciones.empresas.find((empresa) => empresa.id === empresa.id).cuentas,
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

        let path = 'C:/fakepath/'+ aux[0].name

        setForm({
            ...form,
            adjuntos: {
                ...form.adjuntos,
                [tipo]: {files: aux, value: path}
            }
        })
    }

    const attachFilesS3 =  (files, egreso) => {
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
                if(reload){
                    reload.reload()
                }
                handleClose()

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

    const  attachFiles = (egreso) => {
        apiGet(`v1/constant/admin-proyectos`, auth).then(
            (response) => {
                const { alma } = response.data
                let filePath = `egresos/${egreso.id}/`
                let aux = []
                form.adjuntos.pago.files.forEach((file) => {
                    aux.push(
                        {
                            name: `${filePath}pagos/${Math.floor(Date.now() / 1000)}-${file.name}`,
                            file: file,
                            tipo: 'pago'
                        }
                    )
                })
                form.adjuntos.presupuesto.files.forEach((file) => {
                    aux.push(
                        {
                            name: `${filePath}presupuestos/${Math.floor(Date.now() / 1000)}-${file.name}`,
                            file: file,
                            tipo: 'presupuesto'
                        }
                    )
                })
                let auxPromises = aux.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file.file.file, file.name)
                            .then((data) => {
                                const { location, status } = data
                                if (status === 204) resolve({ name: file.name, url: location, tipo: file.tipo })
                                else reject(data)
                            })
                            .catch((error) => {
                                reject(error)
                            })
                    })
                })
                Promise.all(auxPromises).then(values => { 
                    attachFilesS3(values, egreso) 
                }).catch(err => console.error(err))
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

    const addFacturaS3 =  (values, egreso) => {
        apiGet(`v1/constant/admin-proyectos`, auth).then(
            (response) => {
                const { alma } = response.data
                let filePath = `facturas/egresos/`
                let aux = []
                form.adjuntos.xml.files.forEach((file) => {
                    aux.push(file)
                })
                form.adjuntos.pdf.files.forEach((file) => {
                    aux.push(file)
                })
                let auxPromises = aux.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file.file, `${filePath}${Math.floor(Date.now() / 1000)}-${file.name}`)
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

    const addNewFacturaAxios = (files, egreso) => {
        let aux = form
        aux.archivos = files
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

    const attachFactura = (egreso, factura) => {
        let objeto = {
            dato: egreso.id,
            tipo: 'egreso',
            factura: factura.id
        }
        apiPutForm(`v2/administracion/facturas/attach`, objeto, auth).then(
            (response) => {
                if (form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length) {
                    attachFiles(egreso)
                } else {
                    Swal.close()
                    Swal.fire({
                        icon: 'success',
                        title: 'Gasto creado con éxito',
                        text: 'Se creó el gasto con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    })
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

    const handleSend = () => {
        Swal.fire({
            title: '¿Estás seguro?',    
            text: 'Se editara el gasto',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, editar',
            cancelButtonText: 'No, cancelar',
            cancelButtonColor: '#d33',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                Swal.close()
                Swal.fire({
                    title: 'Editando gasto',
                    text: 'Por favor, espere...',
                    allowOutsideClick: false,
                    onBeforeOpen: () => {
                        Swal.showLoading()
                    },
                })

                let aux = form

                aux.factura = form.factura ? 'Con factura' : 'Sin factura'
                try {
                    apiPutForm(`v3/administracion/egresos/${data.id}`, form, auth)
                    .then((response) => {
                        const {egreso} = response.data
                        Swal.close()
                        Swal.fire({
                            title: 'Gasto editado con éxito',
                            allowOutsideClick: false,
                            icon: 'success',
                            text: 'Se editó el gasto con éxito',
                            showConfirmButton: false,
                            timer: 1500
                        })
                           
                        setForm({
                            ...form,
                            egreso
                        })
                        if(reload){
                            reload.reload()
                        }
                        handleClose()
                        // if (egreso.factura) {
                        //     if (Object.keys(form.facturaObject).length > 0) {
                        //         if (form.facturaItem) {
                        //             //Tiene una factura guardada
                        //             attachFactura(egreso, egreso.factura)
                        //         } else {
                        //             //No hay factura generada
                        //             addFacturaS3()
                        //         }
                        //     } else {
                        //         //No adjunto XML
                        //         if (form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length) {
                        //             //El egreso tiene adjuntos
                        //             attachFiles(egreso)
                        //         } else {
                        //             //Egreso generado con éxito 
                                    
                        //         }
                        //     }
                        //     Swal.close()
                        //     Swal.fire({
                        //         icon: 'success',
                        //         title: 'Adjuntos subidos con éxito',
                        //         text: 'Se subieron los adjuntos con éxito',
                        //         showConfirmButton: false,
                        //         timer: 1500
                        //     })
                        //     if(reload){
                        //         reload.reload()
                        //     }
                        //     handleClose()
                        // } else {
                        //     // La egreso no es con factura
                        //     if (form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length) {
                        //         //La egreso tiene adjuntos
                        //         attachFiles(egreso)
                                
                        //     } else {
                        //         //Egreso generado con éxito 
                        //         Swal.close()
                        //         Swal.fire({
                        //             icon: 'success',
                        //             title: 'Gasto creado con éxito',
                        //             text: 'Se creó el gasto con éxito',
                        //             showConfirmButton: false,
                        //             timer: 1500
                        //         })
                        //         if(reload){
                        //             reload.reload()
                        //         }
                        //         handleClose()

                        //     }
                        // }
        
                    })
                    .catch((error) => {
                        console.log(error)

                        Swal.fire({
                            title: 'Error',
                            text: 'No se pudo editar el gasto',
                            icon: 'error',
                            confirmButtonText: 'Cerrar',
                        })
                    })
                } catch (error) {
                    console.log(error)
                }
            }
        })

    }

    const handleChangeAreas=(e)=>{
        setForm({
            ...form,
            [e.target.name]:e.target.value,
            id_partidas: '',
            subarea: ''
        })
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

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    const setLabelTables = (objeto) => {
        console.log(objeto)
        let restante = objeto.total - objeto.ventas_compras_count - objeto.ingresos_egresos_count
            let text = {}
            if (objeto.cancelada) {
                text.letra = '#8950FC'
                text.fondo = '#EEE5FF'
                text.estatus = 'CANCELADA'
            } else {
                if (restante <= 1) {
                    text.letra = '#388E3C'
                    text.fondo = '#E8F5E9'
                    text.estatus = 'PAGADA'
                } else {
                    text.letra = '#F64E60'
                    text.fondo = '#FFE2E5'
                    text.estatus = 'PENDIENTE'
                }
            }
            return setLabelTable(text)
        }

        const  setAdjuntosFacturas = () => {
            let aux = [];
            if (data[0] || data[0].xml.length > 0) {
                let xml = data[0].xml
                aux.push({
                    name: xml.folio + '-xml.xml',
                    url: xml.url
                })
            }
            if (data[0] || data[0].pdf.length > 0) {
                let pdf = data[0].pdf
                aux.push({
                    name: pdf.folio + '-pdf.pdf',
                    url: pdf.url
                })
            }
            return aux
        }

    return (
        <>
            
            <div className="col-md-12 mt-4">
                <Tab.Container defaultActiveKey="first">
                    <Row>
                        <Col md={3} className="pl-0 align-self-center">
                            <Nav className="navi navi-hover navi-active navi-bold">
                                <Nav.Item className="navi-item">
                                    <Nav.Link className="navi-link px-3" eventKey="first">
                                        <span className="navi-icon"><i className="flaticon2-file"></i></span>
                                        <span className="navi-text font-size-lg">Datos de la factura</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="navi-item">
                                    <Nav.Link className="navi-link px-3" eventKey="second">
                                        <span className="navi-icon"><i className="fas fa-coins"></i></span>
                                        <span className="navi-text font-size-lg">Datos generales</span>
                                    </Nav.Link>
                                </Nav.Item>
                                {
                                    data[0].pdf || data[0].xml ?
                                        <Nav.Item className="navi-item">
                                            <Nav.Link className="navi-link px-3" eventKey="third" >
                                                <span className="navi-icon"><i className="flaticon2-checking"></i></span>
                                                <span className="navi-text font-size-lg">Facturas</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                        : ''
                                }
                            </Nav>
                        </Col>
                        <Col md={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <Card className="card card-without-box-shadown border-0">
                                        <Card.Body className="p-0">
                                            <div className="text-justify">
                                                <div className="row pb-1">
                                                    <div className="col d-flex justify-content-end">
                                                        {
                                                            data[0] ?
                                                                <span>{setLabelTable(data[0])}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">FOLIO:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].folio ?
                                                                <span>{data[0].folio}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">FECHA:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].fecha ?
                                                                <span>{dayDMY(data[0].fecha)}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">SERIE:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].serie ?
                                                                <span>{data[0].serie}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary text-left">NÚMERO DE CERTIFICADO:</label>
                                                    <div className="col-8 align-self-center">
                                                        {
                                                            data[0].numero_certificado ?
                                                                <span>{data[0].numero_certificado}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">USO CFDI:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].uso_cfdi ?
                                                                <span>{data[0].uso_cfdi}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-2">
                                                    <label className="col-4 font-weight-bolder text-primary align-self-center">EMISOR:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].nombre_emisor ?
                                                                <div>
                                                                    <strong>RFC: </strong><span>{data[0].rfc_emisor}</span><br />
                                                                    <strong>NOMBRE: </strong><span>{data[0].nombre_emisor}</span>
                                                                </div>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary align-self-center">RECEPTOR:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].nombre_receptor ?
                                                                <div>
                                                                    <strong>RFC: </strong><span>{data[0].rfc_receptor}</span><br />
                                                                    <strong>NOMBRE: </strong><span>{data[0].nombre_receptor}</span>
                                                                </div>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <Card className="card card-without-box-shadown border-0">
                                        <Card.Body className="p-0">
                                            <div className="text-justify">
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">SUBTOTAL:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].subtotal ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={data[0].subtotal}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        prefix={'$'}
                                                                        renderText={value => <div>{value}</div>}
                                                                    />
                                                                </span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">TOTAL:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].total ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={data[0].total}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        prefix={'$'}
                                                                        renderText={value => <div>{value}</div>}
                                                                    />
                                                                </span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">MONTO ACUMULADO:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].total ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={data[0].ventas_compras_count + data[0].ingresos_egresos_count}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        prefix={'$'}
                                                                        renderText={value => <div>{value}</div>}
                                                                    />
                                                                </span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">MONTO RESTANTE:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].total ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={data[0].total - data[0].ventas_compras_count - data[0].ingresos_egresos_count}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        prefix={'$'}
                                                                        renderText={value => <div>{value}</div>}
                                                                    />
                                                                </span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary align-self-center">DESCRIPCIÓN:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].descripcion ?
                                                                <span>{data[0].descripcion}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="third">
                                    {
                                        data[0] !== '' ?
                                            <ItemSlider items={setAdjuntosFacturas()} item='' />
                                            : ''
                                    }
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        
        </>
    )
        
}
