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
// import CrearProveedor from './CrearProveedor'
import Style from './../../Administracion/Egresos/Modales/CrearEgreso.module.css'
import { Modal } from './../../../components/singles'
import { waitAlert, deleteAlert, doneAlert, createAlertSA2WithActionOnClose, printResponseErrorAlert, customInputAlert, errorAlert, } from '../../../functions/alert'

export default function CrearIngreso(props) {

    const { opcionesData, handleClose, reload, getProveedores } = props
    const departamento = useSelector(state => state.authUser.departamento)
    const departamentos = useSelector(state => state.opciones.ingresos)
    const proyectos = useSelector(state => state.opciones.proyectos)
    const [errores, setErrores] = useState({})
    const auth = useSelector((state) => state.authUser.access_token);
    const empresas = useSelector((state) => state.opciones.empresa|| []);
    const [loadingProveedores, setLoadingProveedores] = useState(true);
    const [loadingClientes, setLoadingClientes] = useState(true);
    const [loadingEmpresas, setLoadingEmpresas] = useState(true);
    const clientes = useSelector((state) => state.opciones.clientes || []);
    const [proveedorSelect, setProveedorSelect] = useState({
        preSelect: false,
        id: null,
        name: null,
    })

    const initialState = {
        clientes: [], // Asegúrate de que este valor inicial sea un array
        empresas: [],
    };
    

    const [form, setForm] = useState({
        adjuntos: {
            pago: { files: [], value: '' },
            pdf: { files: [], value: '' },
            presupuesto: { files: [], value: '' },
            xml: { files: [], value: '' },
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
        clientes: '',
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
        // Simula carga de proveedores
        if (clientes && clientes.length > 0) {
            setLoadingClientes(false);
        }
    }, [clientes]);

    useEffect(() => {
        if (empresas && empresas.length > 0) {
            setLoadingEmpresas(false);
        }
    }, [empresas]);

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

    const handleChangeEmpresa = (event, value) => {
        if (value && value.nombre) {
            setForm({
                ...form,
                empresa: value.id,
                empresa_nombre: value.nombre,
                cuentas: empresas.find(emp => emp.id === value.id)?.cuentas || [],
            });
        } else {
            setForm({
                ...form,
                empresa: null,
                empresa_nombre: null,
                cuentas: [],
            });
        }
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
                cuentas: empresas.find(empresa => empresa.id === e.target.value).cuentas,
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

    const handleAddFile = (e, tipo) => {
        // Convertir FileList a un array
        const filesArray = Array.from(e.target.files);
    
        // Mapear los archivos a un nuevo formato
        const aux = filesArray.map((file, index) => ({
            name: file.name,
            file: file,
            url: URL.createObjectURL(file),
            key: index
        }));
    
        // Crear la ruta para el primer archivo
        const path = aux.length > 0 ? `C:/fakepath/${aux[0].name}` : '';
    
        // Actualizar el formulario
        setForm(prevForm => ({
            ...prevForm,
            adjuntos: {
                ...prevForm.adjuntos,
                [tipo]: { files: aux, value: path }
            }
        }));
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
                    if (empresa === undefined) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fromato XML incorrecto',
                            text: 'En esta factura no somos los receptores',
                            showConfirmButton: false,
                            timer: 3000
                        })
                    }
                    let cliente = clientes.find((clientes) => clientes.rfc === obj.rfc_receptor)
                    if (!cliente) {
                        Swal.fire({
                            icon: 'error',
                            title: 'No existe el cliente',
                            text: 'No existe el cliente, favor de crearlo..',
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
                        cliente_nombre: cliente ? cliente.name : null,
                        cuentas: empresa ? empresas.find((empresaData) => empresaData.id === empresa.id).cuentas : '',
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
                cliente_nombre: value.name,
            })
        }
        if (value === null) {
            setForm({
                ...form,
                cliente: null,
                cliente_nombre: null,
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
                let filePath = `facturas/ingresos/`
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

    const attachFilesS3 = (files, ingreso) => {
        apiPutForm(`v3/administracion/ingresos/${ingreso.id}/archivos/s3`, { archivos: files }, auth).then(
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

    const attachFiles = (ingresos) => {
        apiGet(`v1/constant/admin-proyectos`, auth).then(
            (response) => {
                const { alma } = response.data
                let filePath = `ingresos/${ingresos.id}/`
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
                    attachFilesS3(values, ingresos)
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

    const attachFactura = (egreso, factura) => {

        let objeto = {
            dato: egreso.id,
            tipo: 'ingreso',
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
                        title: 'ingreso creada con éxito',
                        text: 'Se creó la ingreso con éxito',
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
        if (form.cliente === '') {
            error.cliente = "Seleccione un cliente"
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
                text: 'Se creará el ingreso',
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
                        title: 'Creando Ingreso',
                        text: 'Por favor, espere...',
                        allowOutsideClick: false,
                        onBeforeOpen: () => {
                            Swal.showLoading()
                        },
                    })

                    let aux = form

                    aux.factura = form.factura ? 'Con factura' : 'Sin factura'
                    try {

                        apiPostForm('v3/administracion/ingresos', form, auth)
                            .then((response) => {

                                const { ingreso } = response.data
                                Swal.close()
                                Swal.fire({
                                    title: 'Ingreso creada con éxito',
                                    text: 'Subiendo adjuntos...',
                                    allowOutsideClick: false,
                                    onBeforeOpen: () => {
                                        Swal.showLoading()
                                    },
                                })

                                setForm({
                                    ...form,
                                    ingreso
                                })
                                if (ingreso.factura) {
                                    // Adjunto un XML
                                    if (Object.keys(form.facturaObject).length > 0) {
                                        if (form.facturaItem) {
                                            //Tiene una factura guardada
                                            attachFactura(ingreso, ingreso.factura)
                                        } else {
                                            //No hay factura generada
                                            addFacturaS3(ingreso.id, ingreso)
                                        }
                                    } else {
                                        //No adjunto XML
                                        if (form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length) {
                                            //El compra tiene adjuntos
                                            attachFiles(ingreso)
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
                                        attachFiles(ingreso)

                                    } else {
                                        //compra generado con éxito 
                                        Swal.close()
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'ingreso creada con éxito',
                                            text: 'Se creó la ingreso con éxito',
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
                                    text: 'No se pudo crear la ingreso',
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
            <Accordion defaultExpanded className='proyect-accordion'>

                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography className='proyect-Subtitulo'>DATOS DE LA FACTURA</Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <div className=""  style={{ width: '100%' }}>
                        <div className=""  style={{ display: 'flex', justifyContent: 'space-evenly', marginRight: '10px', flexDirection: 'column' }}>
                            <div className="container">
                                <div  className="row">
                                    <div className="col-md-4">
                                    {loadingEmpresas ? (
                                            <div className="" style={{ textAlign: 'center', margin: '1rem 0', fontSize: '1.2rem', color: 'gray' }}>
                                                Cargando empresas...
                                            </div>
                                        ) : (
                                            <div className="" >
                                                <InputLabel error={errores.empresa ? true : false}>Empresa</InputLabel>
                                                <Autocomplete
                                                    name="empresa"
                                                    options={empresas.length > 0 ? empresas : []}
                                                    getOptionLabel={(option) => option.nombre || ''}
                                                    onChange={(event, value) => handleChangeEmpresa(event, value)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params} 
                                                            variant="outlined"
                                                            label={form.empresa_nombre || 'Empresa'}
                                                            error={errores.empresa ? true : false}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div  className="col-md-4">
                                        {
                                            form.cuentas.length > 0 ?
                                                <div className="" >
                                                    <InputLabel id="demo-simple-select-label">Cuenta</InputLabel>
                                                    <Select
                                                        value={form.cuenta}
                                                        name="cuenta"
                                                        onChange={handleChange}
                                                        style={{ width: 150, marginRight: '1rem' }}
                                                        error={errores.cuenta ? true : false}
                                                    >
                                                        {form.cuentas.map((item, index) => (
                                                            <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </div>
                                                : null
                                        }
                                    </div>
                                    <div className="col-md-4">
                                        {
                                            loadingClientes ? ( // Indicar si los proveedores están cargando
                                                <div className=""  style={{ textAlign: 'center', margin: '1rem 0', fontSize: '1.2rem', color: 'gray' }}>
                                                    Cargando clientes...
                                                </div>
                                            ) : (
                                                <div className="" >
                                                    <InputLabel error={errores.cliente ? true : false}>Cliente</InputLabel>
                                                    <Autocomplete
                                                        name="cliente"
                                                        options={clientes.length > 0 ? clientes : []} // Si no hay proveedores, opciones vacías
                                                        getOptionLabel={(option) => option.name || ''}
                                                        onChange={(event, value) => handleChangeProveedor(event, value)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                variant="outlined"
                                                                label={form.cliente_nombre || 'Clientes'}
                                                                error={errores.cliente ? true : false}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>

                            </div>
                            <div className=""  style={{ marginTop: '2rem' }}>
                                <InputLabel>¿Lleva factura?</InputLabel>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox disabled={form.disabled} checked={!form.factura} onChange={handleChangeCheck} color='secondary' name='factura' />}
                                        label="No"

                                    />
                                    <FormControlLabel
                                        control={<Checkbox disabled={form.disabled} checked={form.factura} onChange={handleChangeCheck} color='primary' name='factura' />}
                                        label="Si"

                                    />
                                </FormGroup>
                            </div>

                            {
                                form.factura ?
                                    <div className=""  style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div className="" >
                                            <InputLabel>XML de la factura</InputLabel>
                                            <div >

                                                <div className="" >
                                                    <input
                                                        accept="application/xml"
                                                        style={{ display: 'none' }}
                                                        id="xml"
                                                        type="file"
                                                        onChange={onChangeFactura}
                                                    />
                                                    <label htmlFor="xml" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Button variant="contained" color="primary" component="span">
                                                            Agregar
                                                        </Button>
                                                    </label>
                                                </div>

                                                <div className="" >
                                                    <div className=""  style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        {
                                                            form.adjuntos.xml.files.map((item, index) => (
                                                                <div key={index} style={{ backgroundColor: 'rgba(58, 137, 201, 0.25)', borderRadius: '5px', padding: '5px', marginTop: '5px' }}>
                                                                    <div style={{ maxWidth: '140px', display: 'flex', justifyContent: 'space-between' }}>
                                                                        <p>{item.name.length > 10 ? item.name.slice(0, 10) + '...' : item.name}<span onClick={() => handleDeleteFile('xml', index)} style={{ color: 'red', cursor: 'pointer' }}>X</span></p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>

                                            <div>
                                                <InputLabel>PDF de la factura</InputLabel>
                                                <div className="" >
                                                    <input
                                                        accept="application/pdf"
                                                        style={{ display: 'none' }}
                                                        id="pdf"

                                                        type="file"
                                                        onChange={(e) => handleAddFile(e, 'pdf')}
                                                    />
                                                    <label htmlFor="pdf" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Button variant="contained" color="primary" component="span">
                                                            Agregar
                                                        </Button>
                                                    </label>
                                                </div>

                                                <div className="" >
                                                    <div  className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        {
                                                            form.adjuntos.pdf.files.map((item, index) => (
                                                                <div className=""  key={index} style={{ backgroundColor: 'rgba(58, 137, 201, 0.25)', borderRadius: '5px', padding: '5px', marginTop: '5px' }}>
                                                                    <div className=""  style={{ maxWidth: '140px', display: 'flex', justifyContent: 'space-between' }}>
                                                                        <p>{item.name.length > 10 ? item.name.slice(0, 10) + '...' : item.name}
                                                                            <span onClick={() => handleDeleteFile('pdf', index)} style={{ color: 'red', cursor: 'pointer' }}>X</span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div>
                                            <InputLabel>RFC</InputLabel>
                                            <TextField
                                                variant="outlined"
                                                name="rfc"
                                                value={form.rfc ? form.rfc : ''}
                                                onChange={handleChange}
                                                style={{ width: 150, paddingRight: '1rem' }}
                                            />

                                        </div>
                                    </div>
                                    : null

                            }
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded className='proyect-accordion'>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography className='proyect-Subtitulo'>ÁREA Y FECHA</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <div className="container" >

                      <div className="row" >
                        <div className="col-md-12" >
                            <InputLabel >Fecha de la compra</InputLabel>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                                <Grid container >
                                    <KeyboardDatePicker

                                        format="dd/MM/yyyy"
                                        name="fecha"
                                        value={form.fecha !== '' ? form.fecha : null}
                                        placeholder="dd/mm/yyyy"
                                        onChange={e => handleChangeFecha(e, 'fecha')}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        error={errores.fecha ? true : false}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </div>
                        </div>

                    <div className="row" >

                            <div className="col-md-4">
                                {departamentos.length > 0 ?
                                    <>
                                        <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                                        <Select
                                            value={form.area}
                                            name="area"
                                            onChange={handleChangeAreas}
                                            error={errores.area ? true : false}
                                        >
                                            {departamentos.map((item, index) => (
                                                <MenuItem key={index} value={item.id_area}>{item.nombreArea}</MenuItem>
                                            ))}

                                        </Select>
                                    </>
                                    : null
                                }

                            </div>

                            <div className="col-md-4">
                                {departamentos.length > 0 && form.area !== '' ?
                                    <>
                                        <InputLabel id="demo-simple-select-label">Tipo de Gasto</InputLabel>
                                        <Select
                                            value={form.partida}
                                            name="partida"
                                            onChange={handleChange}
                                            error={errores.partida ? true : false}
                                        >
                                            {departamentos.find(item => item.id_area == form.area) && departamentos.find(item => item.id_area == form.area).partidas.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                            ))}

                                        </Select>
                                    </>
                                    : null
                                }
                            </div>

                            <div className="col-md-4">
                                {form.area && form.partida !== '' ?
                                    <>
                                        <InputLabel id="demo-simple-select-label">Tipo de Subgasto</InputLabel>
                                        <Select
                                            value={form.subarea}
                                            name="subarea"
                                            onChange={handleChange}
                                            error={errores.subarea ? true : false}
                                        >
                                            {departamentos.find(item => item.id_area == form.area).partidas.find(item => item.id === form.partida).subpartidas.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                            ))}

                                        </Select>
                                    </>
                                    : null
                                }
                            </div>

                        </div>


                        <div className="row" >

                            <div className="col-md-12">
                                <TextField
                                    style={{ width: '100%' }}
                                    name='descripcion'
                                    label="Descripción"
                                    type="text"
                                    defaultValue={form.descripcion}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    multiline
                                    error={errores.descripcion ? true : false}
                                />
                            </div>

                        </div>
                    </div>


                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded className='proyect-accordion'>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography className='proyect-Subtitulo'>PAGO</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className=""  style={{ width: '100%' }}>

                        <div className="row" >

                            <div className="col-md-4" >
                                {
                                    opciones.tiposPagos.length > 0 ?
                                        <div className="" >
                                            <InputLabel id="demo-simple-select-label">Tipo de Pago</InputLabel>

                                            <Select
                                                value={form.tipoPago}
                                                name="tipoPago"
                                                onChange={handleChange}
                                                style={{ width: 150, marginRight: '1rem' }}
                                                error={errores.tipoPago ? true : false}
                                            >
                                                {opciones.tiposPagos.map((item, index) => (
                                                    <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                        : null
                                }

                            </div>
                            <div className="col-md-4" >
                                {
                                    opciones.tiposImpuestos.length > 0 ?
                                        <div className="" >
                                            <InputLabel id="demo-simple-select-label">Tipo de Impuesto</InputLabel>
                                            <Select
                                                value={form.tipoImpuesto}
                                                name="tipoImpuesto"
                                                onChange={handleChange}
                                                style={{ width: 150, marginRight: '1rem' }}
                                                error={errores.tipoImpuesto ? true : false}
                                            >
                                                {opciones.tiposImpuestos.map((item, index) => (
                                                    <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                        : null
                                }

                            </div>
                            <div className="col-md-4" >
                                <CurrencyTextField
                                    label="total"
                                    variant="standard"
                                    value={form.total}
                                    currencySymbol="$"
                                    outputFormat="number"
                                    modifyValueOnWheel={false}

                                    onChange={(event, value) => handleMoney(value)}
                                    style={{ width: 150, marginRight: '1rem' }}
                                    error={errores.total ? true : false}
                                />
                            </div>
                        </div>

                        <div className="row" >
                            <div className="col-md-4" >
                                <CurrencyTextField
                                    label="comision"
                                    variant="standard"
                                    value={form.comision}
                                    currencySymbol="$"
                                    modifyValueOnWheel={false}
                                    outputFormat="number"
                                    onChange={(event, value) => handleMoneyComision(value)}

                                />
                            </div>
                        </div>

                        <div className=""  style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '2rem' }}>

                            <div className="" >

                                <div className="" >
                                    <InputLabel>Pagos</InputLabel>
                                    <input
                                        accept="*/*"
                                        style={{ display: 'none' }}
                                        id="pago_gasto"
                                        multiple
                                        type="file"
                                        onChange={(e) => handleAddFile(e, 'pago')}
                                    />
                                    <label htmlFor="pago_gasto" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Button variant="contained" color="primary" component="span">
                                            Agregar
                                        </Button>
                                    </label>
                                </div>

                                <div className="" >
                                    <div className="" style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', width: '20vh' }}>
                                        {
                                            form.adjuntos.pago.files.map((item, index) => (
                                                <div className=""  key={index} style={{ backgroundColor: 'rgba(58, 137, 201, 0.25)', borderRadius: '5px', padding: '5px', marginTop: '5px' }}>
                                                    <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <p>{item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name}
                                                            <span onClick={() => handleDeleteFile('pago', index)} style={{ color: 'red', cursor: 'pointer' }}>X</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="" >
                                <InputLabel>Presupuestos</InputLabel>
                                <div className="" >
                                    <input
                                        accept="*/*"
                                        style={{ display: 'none' }}
                                        id="presupuesto_gasto"
                                        multiple
                                        type="file"
                                        onChange={(e) => handleAddFile(e, 'presupuesto')}
                                    />
                                    <label htmlFor="presupuesto_gasto" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Button variant="contained" color="primary" component="span">
                                            Agregar
                                        </Button>
                                    </label>
                                </div>

                                <div className="" >
                                    <div className=""  style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        {
                                            form.adjuntos.presupuesto.files.map((item, index) => (
                                                <div className="" key={index} style={{ backgroundColor: 'rgba(58, 137, 201, 0.25)', borderRadius: '5px', padding: '5px', marginTop: '5px' }}>
                                                    <div className="" style={{ maxWidth: '140px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <p>{item.name.length > 10 ? item.name.slice(0, 10) + '...' : item.name}
                                                            <span onClick={() => handleDeleteFile('presupuesto', index)} style={{ color: 'red', cursor: 'pointer' }}>X</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="" >
                                <InputLabel error={errores.afectarCuentas ? true : false}>AFECTAR CUENTAS</InputLabel>
                                <Checkbox
                                    checked={form.afectarCuentas}
                                    onChange={handleCuentas}
                                    name="afectarCuentas"
                                    color="secondary"
                                    style={{ marginLeft: '15%' }}
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

            {/* <Modal size="md" title={"agregar proveedor"} handleClose={handleCloseProveedor} show={nuevoProveedor}>
                <CrearProveedor handleClose={handleCloseProveedor} getProveedores={getProveedores} departamentos={departamentos}
                    data={form} reload={reload} handleCloseRecarga={setNuevoProveedor} auth={auth} setProveedorSelect={setProveedorSelect} />
            </Modal> */}

        </>
    )
}