import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import S3 from 'react-aws-s3'

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import j2xParser from 'fast-xml-parser'
import Swal from 'sweetalert2'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { es } from 'date-fns/locale'
import DateFnsUtils from '@date-io/date-fns';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import { apiPostForm, apiGet, apiPutForm } from './../../../functions/api';
import CrearProveedor from './CrearProveedor'
import Style from './../../Administracion/Egresos/Modales/CrearEgreso.module.css'
import { Modal } from './../../../components/singles'

export default function CrearCompras(props) {

    const { opcionesData, handleClose, reload, getProveedores } = props
    const departamento = useSelector(state => state.authUser.departamento)
    const departamentos = useSelector(state => state.opciones.ventas)
    const proyectos = useSelector(state => state.opciones.proyectos)
    const [errores, setErrores] = useState({})
    const auth = useSelector((state) => state.authUser.access_token);

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
        },
        area: '',
        banco: 0,
        cuentas: '',
        descripcion: '',
        empresa: '',
        estatusCompra: 2,
        factura: false,
        facturaItem: '',
        facturaObject: {},
        fecha: '',
        partida: "",
        cliente: '',
        proyecto: '',
        subarea: '',
        tipoImpuesto: 1,
        tipoPago: 4,
        total: '',
        contrato: '',
        tickets: '',
        afectarCuentas: false,
    })

    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        estatusCompras: [],
        clientes: [],
        proyectos: [],
        tiposImpuestos: [],
        tiposPagos: [],
        tickets: [],
        contratos: [],
    })

    const [nuevoProveedor, setNuevoProveedor] = useState(false)

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

    const handleDeleteFile = (tipo, index) => {
        let files = form.adjuntos[tipo].files;
        files.splice(index, 1);

        // Check if all XML files are deleted
        const allXmlFilesDeleted = tipo === 'xml' && files.length === 0;

        //LIMPIA LOS CAMPOS DEL FORMULARIO QUE YA HABIAN SIDO LLENADOS POR UNA FACTURA
        setForm((prevForm) => ({
            ...prevForm,
            adjuntos: {
                ...prevForm.adjuntos,
                [tipo]: { files: [...files], value: '' },
            },
            rfc: allXmlFilesDeleted ? '' : prevForm.rfc, // Clear rfc field if all XML files deleted
            empresa: allXmlFilesDeleted ? '' : prevForm.empresa,
            descripcion: allXmlFilesDeleted ? '' : prevForm.descripcion,
            fecha: allXmlFilesDeleted ? '' : prevForm.fecha,
            total: allXmlFilesDeleted ? '' : prevForm.total,
            facturaObject: allXmlFilesDeleted ? '' : prevForm.facturaObject,
        }));
    };

    const handleChange = (e) => {
        if (e.target.name === 'empresa') {
            setForm({
                ...form,
                [e.target.name]: e.target.value,
                cuentas: opciones.empresas.find(empresa => empresa.id === e.target.value).cuentas,
            });
        } else {
            setForm({
                ...form,
                [e.target.name]: e.target.value
            });
        }

    };

    const handleChangeAreas = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
            partida: ''
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

                    let empresa = opcionesData.empresas.find((empresa) => empresa.rfc === obj.rfc_emisor)

                    if (empresa === undefined) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fromato XML incorrecto',
                            text: 'En esta factura no somos los receptores',
                            showConfirmButton: false,
                            timer: 3000
                        })
                    }
                    let cliente = opcionesData.clientes.find((cliente) => cliente.rfc === obj.rfc_receptor)

                    if (!cliente) {
                        Swal.fire({
                            icon: 'error',
                            title: 'No existe la empresa',
                            text: 'No existe el empresa, favor de crearlo..',
                            showConfirmButton: false,
                            timer: 1000
                        })
                        // setNuevoProveedor(true)

                    } else {
                        form.cliente = cliente.id.toString()
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
                        cliente: cliente ? cliente.id : null,
                        proveedor_nombre: cliente ? cliente.name : null,
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
                cliente: value.id,
                proveedor_nombre: value.name,
            })
        }
        if (value === null) {
            setForm({
                ...form,
                cliente: null,
                proveedor_nombre: null,
            })
        }
    }

    const handleChangeTicket = (e, value) => {
        if (value && value.name) {
            setForm({
                ...form,
                tickets: value.id,
                tickets_nombre: value.name,
            })
        }
        if (value === null) {
            setForm({
                ...form,
                tickets: null,
                tickets_nombre: null,
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

    const addFacturaS3 = (values, egreso) => {
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

    const attachFilesS3 = (files, venta) => {
        apiPutForm(`v2/proyectos/ventas/${venta.id}/archivos/s3`, { archivos: files }, auth).then(
            (response) => {
                Swal.close()
                Swal.fire({
                    icon: 'success',
                    title: 'Archivos adjuntados',
                    text: 'Los archivos se adjuntaron correctamente',
                    showConfirmButton: false,
                    timer: 1500
                })
                if (reload) {
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

    const attachFiles = (ventas) => {
        apiGet(`v1/constant/admin-proyectos`, auth).then(
            (response) => {
                const { alma } = response.data
                let filePath = `ventas/${ventas.id}/`
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
                    attachFilesS3(values, ventas)
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

    const attachFactura = (venta, factura) => {

        let objeto = {
            dato: venta.id,
            tipo: 'venta',
            factura: factura.id
        }

        apiPutForm(`v2/administracion/facturas/attach`, objeto, auth).then(
            (response) => {
                if (form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length) {
                    attachFiles(venta)
                } else {
                    Swal.close()
                    Swal.fire({
                        icon: 'success',
                        title: 'compra creada con éxito',
                        text: 'Se creó la compra con éxito',
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
        if (form.afectarCuentas === false) {
            error.afectarCuentas = "Debe afectar cuentas";
            validar = false;
        }

        setErrores(error)
        return validar
    }

    const handleSend = () => {
        if (validateForm()) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: 'Se creará la venta',
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
                        title: 'Creando venta',
                        text: 'Por favor, espere...',
                        allowOutsideClick: false,
                        onBeforeOpen: () => {
                            Swal.showLoading()
                        },
                    })

                    let aux = form

                    aux.factura = form.factura ? 'Con factura' : 'Sin factura'
                    console.log(form)
                    try {
                        apiPostForm('v3/proyectos/ventas', form, auth)
                            .then((response) => {

                                const { venta } = response.data
                                Swal.close()
                                Swal.fire({
                                    title: 'venta creada con éxito',
                                    text: 'Subiendo adjuntos...',
                                    allowOutsideClick: false,
                                    onBeforeOpen: () => {
                                        Swal.showLoading()
                                    },
                                })

                                setForm({
                                    ...form,
                                    venta
                                })

                                if (venta.factura) {
                                    // Adjunto un XML
                                    if (Object.keys(form.facturaObject).length > 0) {
                                        if (form.facturaItem) {
                                            //Tiene una factura guardada
                                            attachFactura(venta, venta.factura)
                                        } else {
                                            //No hay factura generada
                                            addFacturaS3(venta.id, venta)
                                        }
                                    } else {
                                        //No adjunto XML
                                        if (form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length) {
                                            //El compra tiene adjuntos
                                            attachFiles(venta)
                                        } else {
                                            //compra generado con éxito 

                                        }
                                    }
                                    Swal.close()
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Adjuntos subidos con éxito',
                                        text: 'Se subieron los adjuntos con éxito',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
                                    if (reload) {
                                        reload.reload()
                                    }
                                    handleClose()
                                } else {
                                    // La compra no es con factura
                                    if (form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length) {
                                        //La compra tiene adjuntos
                                        attachFiles(venta)

                                    } else {
                                        //compra generado con éxito 
                                        Swal.close()
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Compra creada con éxito',
                                            text: 'Se creó la compra con éxito',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                        if (reload) {
                                            reload.reload()
                                        }
                                        handleClose()
                                    }
                                }
                            })
                            .catch((error) => {

                                Swal.fire({
                                    title: 'Error',
                                    text: 'No se pudo crear la compra',
                                    icon: 'error',
                                    confirmButtonText: 'Cerrar',
                                })
                            })
                    } catch (error) {
                    }
                }
            })
        } else {
            Swal.fire({
                title: 'Faltan campos',
                text: 'Favor de llenar todos los campos',
                icon: 'info',
                showConfirmButton: false,
                timer: 1500,
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
    return (
        <>

            <Accordion defaultExpanded className="proyect-accordion">

                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className="proyect-Subtitulo">DATOS DE LA FACTURA</Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <div className="container">
                        <div className="row mb-4">
                            <div className="col-12">
                                <InputLabel>¿Lleva factura?</InputLabel>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox checked={!form.factura} onChange={handleChangeCheck} color="secondary" name="factura" />}
                                        label="No"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={form.factura} onChange={handleChangeCheck} color="primary" name="factura" />}
                                        label="Sí"
                                    />
                                </FormGroup>
                            </div>
                        </div>

                        {form.factura && (
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <InputLabel>XML de la factura</InputLabel>
                                    <div>
                                        <input
                                            accept="application/xml"
                                            style={{ display: 'none' }}
                                            id="xml"
                                            type="file"
                                            onChange={onChangeFactura}
                                        />
                                        <label htmlFor="xml" className="d-flex justify-content-center align-items-center">
                                            <Button variant="contained" color="primary" component="span">
                                                Agregar
                                            </Button>
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                        {form.adjuntos.xml.files.map((item, index) => (
                                            <div key={index} className="bg-light border rounded p-2 mb-2">
                                                <div className="d-flex justify-content-between">
                                                    <p className="mb-0">
                                                        {item.name.length > 10 ? `${item.name.slice(0, 10)}...` : item.name}
                                                        <span
                                                            onClick={() => handleDeleteFile('xml', index)}
                                                            className="text-danger ms-2"
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            X
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <InputLabel>PDF de la factura</InputLabel>
                                    <div>
                                        <input
                                            accept="application/pdf"
                                            style={{ display: 'none' }}
                                            id="pdf"
                                            type="file"
                                            onChange={(e) => handleAddFile(e, 'pdf')}
                                        />
                                        <label htmlFor="pdf" className="d-flex justify-content-center align-items-center">
                                            <Button variant="contained" color="primary" component="span">
                                                Agregar
                                            </Button>
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                        {form.adjuntos.pdf.files.map((item, index) => (
                                            <div key={index} className="bg-light border rounded p-2 mb-2">
                                                <div className="d-flex justify-content-between">
                                                    <p className="mb-0">
                                                        {item.name.length > 10 ? `${item.name.slice(0, 10)}...` : item.name}
                                                        <span
                                                            onClick={() => handleDeleteFile('pdf', index)}
                                                            className="text-danger ms-2"
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            X
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 mb-3">
                                    <InputLabel>RFC</InputLabel>
                                    <TextField
                                        variant="outlined"
                                        name="rfc"
                                        value={form.rfc || ''}
                                        onChange={handleChange}
                                        className="w-100"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                {opciones.clientes.length > 0 && (
                                    <>
                                        <InputLabel error={errores.clientes}>Cliente</InputLabel>
                                        <Autocomplete
                                            name="cliente"
                                            options={opciones.clientes}
                                            getOptionLabel={(option) => option.name}
                                            onChange={(event, value) => handleChangeProveedor(event, value)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label={form.proveedor_nombre || 'cliente'}
                                                />
                                            )}
                                        />
                                    </>
                                )}
                            </div>

                            <div className="col-md-4 mb-3">
                                {opciones.clientes.length > 0 && form.cliente && (
                                    <>
                                        <InputLabel>Proyectos</InputLabel>
                                        <Select
                                            value={form.proyecto}
                                            name="proyecto"
                                            onChange={handleChange}
                                            className="w-100"
                                            error={errores.proyecto}
                                        >
                                            {opciones.clientes
                                                .find((item) => item.id === form.cliente)
                                                ?.proyectos.map((item, index) => (
                                                    <MenuItem key={index} value={item.id}>
                                                        {item.nombre}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </>
                                )}
                            </div>

                            <div className="col-md-4 mb-3">
                                {opciones.empresas.length > 0 && (
                                    <>
                                        <InputLabel>Empresa</InputLabel>
                                        <Select
                                            name="empresa"
                                            value={form.empresa}
                                            onChange={handleChange}
                                            className="w-100"
                                            error={errores.empresa}
                                        >
                                            {opciones.empresas.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-12">
                                {opciones.tickets.length > 0 && (
                                    <>
                                        <InputLabel error={errores.tickets}>Tickets</InputLabel>
                                        <Autocomplete
                                            name="tickets"
                                            options={opciones.tickets}
                                            getOptionLabel={(option) => option.name}
                                            onChange={(event, value) => handleChangeTicket(event, value)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label={form.tickets_nombre || 'tickets'}
                                                />
                                            )}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>


            <Accordion defaultExpanded className="proyect-accordion">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className="proyect-Subtitulo">ÁREA Y FECHA</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="container">
                        {/* Fecha */}
                        <div className="row mb-3">
                            <div className="col-12 col-md-4">
                                <InputLabel>Fecha de la venta</InputLabel>
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                                    <Grid container>
                                        <KeyboardDatePicker
                                            format="dd/MM/yyyy"
                                            name="fecha"
                                            value={form.fecha !== "" ? form.fecha : null}
                                            placeholder="dd/mm/yyyy"
                                            onChange={(e) => handleChangeFecha(e, "fecha")}
                                            style={{ width: "100%" }}
                                            KeyboardButtonProps={{
                                                "aria-label": "change date",
                                            }}
                                            error={errores.fecha ? true : false}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </div>
                        </div>

                        {/* Selects en fila */}
                        <div className="row mb-3">
                            {/* Departamento */}
                            <div className="col-12 col-md-4">
                                {departamentos.length > 0 && (
                                    <>
                                        <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                                        <Select
                                            value={form.area}
                                            name="area"
                                            onChange={handleChangeAreas}
                                            className="form-control"
                                            error={errores.area ? true : false}
                                        >
                                            {departamentos.map((item, index) => (
                                                <MenuItem key={index} value={item.id_area}>
                                                    {item.nombreArea}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </>
                                )}
                            </div>

                            {/* Tipo de Gasto */}
                            <div className="col-12 col-md-4">
                                {departamentos.length > 0 && form.area !== "" && (
                                    <>
                                        <InputLabel id="demo-simple-select-label">Tipo de Gasto</InputLabel>
                                        <Select
                                            value={form.partida}
                                            name="partida"
                                            onChange={handleChange}
                                            className="form-control"
                                            error={errores.partida ? true : false}
                                        >
                                            {departamentos
                                                .find((item) => item.id_area == form.area)
                                                ?.partidas.map((item, index) => (
                                                    <MenuItem key={index} value={item.id}>
                                                        {item.nombre}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </>
                                )}
                            </div>

                            {/* Tipo de Subgasto */}
                            <div className="col-12 col-md-4">
                                {form.area && form.partida !== "" && (
                                    <>
                                        <InputLabel id="demo-simple-select-label">Tipo de Subgasto</InputLabel>
                                        <Select
                                            value={form.subarea}
                                            name="subarea"
                                            onChange={handleChange}
                                            className="form-control"
                                            error={errores.subarea ? true : false}
                                        >
                                            {departamentos
                                                .find((item) => item.id_area == form.area)
                                                ?.partidas.find((item) => item.id === form.partida)
                                                ?.subpartidas.map((item, index) => (
                                                    <MenuItem key={index} value={item.id}>
                                                        {item.nombre}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="row">
                            <div className="col-12">
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
                                    className="form-control"
                                    rows={3}
                                    error={errores.descripcion ? true : false}
                                />
                            </div>
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded className="proyect-accordion">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className="proyect-Subtitulo">PAGO</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="container">
                        {/* Primera fila: Cuentas, Contratos */}
                        <div className="row">
                            <div className="col-md-4">
                                {form.cuentas.length > 0 && (
                                    <div>
                                        <InputLabel id="demo-simple-select-label">Cuenta</InputLabel>
                                        <Select
                                            value={form.cuenta}
                                            name="cuenta"
                                            onChange={handleChange}
                                            className="form-control"
                                            error={errores.cuenta ? true : false}
                                        >
                                            {form.cuentas.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>
                                                    {item.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </div>
                                )}
                            </div>
                            <div className="col-md-4">
                                {opciones.clientes.length > 0 && (
                                    <div>
                                        <InputLabel id="demo-simple-select-label">Contrato</InputLabel>
                                        <Select
                                            value={form.contrato}
                                            name="contrato"
                                            onChange={handleChange}
                                            className="form-control"
                                            error={errores.contrato ? true : false}
                                        >
                                            {opciones.clientes
                                                .find((item) => item.id == form.cliente)
                                                ?.contratos.map((item, index) => (
                                                    <MenuItem key={index} value={item.id}>
                                                        {item.nombre}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Segunda fila: Tipo de Impuesto, Total, Comisión */}
                        <div className="row mt-4">
                            <div className="col-md-4">
                                {opciones.tiposImpuestos.length > 0 && (
                                    <div>
                                        <InputLabel id="demo-simple-select-label">Tipo de Impuesto</InputLabel>
                                        <Select
                                            value={form.tipoImpuesto}
                                            name="tipoImpuesto"
                                            onChange={handleChange}
                                            className="form-control"
                                            error={errores.tipoImpuesto ? true : false}
                                        >
                                            {opciones.tiposImpuestos.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </div>
                                )}
                            </div>
                            <div className="col-md-4">
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
                            </div>
                            <div className="col-md-4">
                                <CurrencyTextField
                                    label="Comisión"
                                    variant="standard"
                                    value={form.comision}
                                    currencySymbol="$"
                                    modifyValueOnWheel={false}
                                    outputFormat="number"
                                    className="form-control"
                                    onChange={(event, value) => handleMoneyComision(value)}
                                />
                            </div>
                        </div>

                        {/* Archivos Adjuntos */}
                        <div className="row mt-4">
                            <div className="col-md-4">
                                <InputLabel>Pagos</InputLabel>
                                <input
                                    accept="*/*"
                                    style={{ display: "none" }}
                                    id="pago_gasto"
                                    multiple
                                    type="file"
                                    onChange={(e) => handleAddFile(e, "pago")}
                                />
                                <label htmlFor="pago_gasto" className="d-flex justify-content-center align-items-center">
                                    <Button variant="contained" color="primary" component="span">
                                        Agregar
                                    </Button>
                                </label>
                                <div className="mt-2">
                                    {form.adjuntos.pago.files.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-info bg-opacity-25 rounded p-2 my-1 d-flex justify-content-between"
                                        >
                                            <span>{item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}</span>
                                            <span onClick={() => handleDeleteFile("pago", index)} className="text-danger cursor-pointer">
                                                X
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-md-4">
                                <InputLabel>Presupuestos</InputLabel>
                                <input
                                    accept="*/*"
                                    style={{ display: "none" }}
                                    id="presupuesto_gasto"
                                    multiple
                                    type="file"
                                    onChange={(e) => handleAddFile(e, "presupuesto")}
                                />
                                <label htmlFor="presupuesto_gasto" className="d-flex justify-content-center align-items-center">
                                    <Button variant="contained" color="primary" component="span">
                                        Agregar
                                    </Button>
                                </label>
                                <div className="mt-2">
                                    {form.adjuntos.presupuesto.files.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-info bg-opacity-25 rounded p-2 my-1 d-flex justify-content-between"
                                        >
                                            <span>{item.name.length > 10 ? `${item.name.slice(0, 10)}...` : item.name}</span>
                                            <span onClick={() => handleDeleteFile("presupuesto", index)} className="text-danger cursor-pointer">
                                                X
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-md-4 text-center">
                                <InputLabel error={errores.afectarCuentas ? true : false}>Afectar Cuentas</InputLabel>
                                <Checkbox
                                    checked={form.afectarCuentas}
                                    onChange={handleCuentas}
                                    name="afectarCuentas"
                                    color="secondary"
                                    className="ms-2"
                                    disabled={form.afectarCuentas}
                                />
                            </div>
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>


            <div>
                <div className="row justify-content-end">
                    <div className="col-md-4">
                        <button className={Style.sendButton} onClick={e => handleSend(form)}>Crear</button>
                    </div>
                </div>
            </div>

            <Modal size="md" title={"agregar proveedor"} handleClose={handleCloseProveedor} show={nuevoProveedor}>
                <CrearProveedor handleClose={handleCloseProveedor} getProveedores={getProveedores} departamentos={departamentos}
                    data={form} reload={reload} handleCloseRecarga={setNuevoProveedor} auth={auth} setProveedorSelect={setProveedorSelect} />
            </Modal>

        </>
    )
}