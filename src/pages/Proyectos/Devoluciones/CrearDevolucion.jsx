import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import InputLabel from '@material-ui/core/InputLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import { es } from 'date-fns/locale'
import DateFnsUtils from '@date-io/date-fns';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Swal from 'sweetalert2'
import j2xParser from 'fast-xml-parser'
import S3 from 'react-aws-s3'

import { apiPostForm, apiPutForm, apiGet } from '../../../functions/api';
import Style from './crearDevoluciones.module.scss'
import CrearProveedor from './../Compras/CrearProveedor'
import { Modal } from './../../../components/singles'

export default function CrearDevoluciones (props) {
    const { options, opcionesData, reload, handleClose, getProveedores } = props
    const auth = useSelector((state) => state.authUser.access_token);
    const departamentos = useSelector(state => state.opciones.compras)
    const [errores, setErrores] = useState({})

    const [proveedorSelect, setProveedorSelect] = useState({
        preSelect: false,
        id:null,
        name: null,
    })

    useEffect(() => {
        if(proveedorSelect.preSelect){
            let data = {
                ...proveedorSelect
            }
            handleChangeProveedor('', data)
        }
    }, [proveedorSelect])

    const [form, setForm] = useState({
        adjuntos: {
            pago: {files:[], value: ''},
            pdf: { files: [], value: '' },
            presupuesto: { files: [], value: '' },
            xml: { files: [], value: '' },
            xml: { files: [], value: '' },
        },
        factura: false,
        rfc: null,
        facturaItem: '',
        facturaObject: {},
        cuenta: '',
        cuentas: [],
        proveedor: '',
        proyecto: '',
        empresa: '',
        area: '',
        partida_id: '',
        subarea: '',
        descripcion: '',
        tipoImpuesto: '',
        tipoPago: '',
        monto: '',
        total: '',
        comision: '',
        afectarCuentas: false,
        estatusCompra: 2,
    })
    console.log(form)

    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        estatusCompras: [],
        proveedores: [],
        proyectos: [],
        tiposImpuestos: [],
        tiposPagos: [],
    })

    useEffect(() => {
        
        if(opcionesData){
            setOpciones(opcionesData)
        }
    }, [opcionesData])

    const[nuevoProveedor, setNuevoProveedor] = useState(false)

    const handleCloseProveedor = () => {
        setNuevoProveedor(false)
        setForm({
            ...form,
            proveedor: nuevoProveedor.id, // Establecer el proveedor recién creado
            proveedor_nombre: nuevoProveedor.name,
        });
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

    const agregarProveedor = () => {
        setNuevoProveedor(true)
    }

    const handleChangeCheck = () => {
        setForm({
            ...form,
            factura: !form.factura
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

                    let empresa = opcionesData.empresas.find((empresa) => empresa.rfc === obj.rfc_receptor)

                    if(empresa === undefined ){
                        Swal.fire({
                            icon: 'error',
                            title: 'Fromato XML incorrecto',
                            text: 'En esta factura no somos los receptores',
                            showConfirmButton: false,
                            timer: 3000
                        })
                    }
                    let proveedor = opcionesData.proveedores.find((proveedor) => proveedor.rfc === obj.rfc_emisor)

                    if(!proveedor){
                        Swal.fire({
                            icon: 'error',
                            title: 'No existe el proveedor',
                            text: 'No existe el proveedor, favor de crearlo..',
                            showConfirmButton: false,
                            timer: 1000
                        })
                        setNuevoProveedor(true)

                    }else{
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
                title: 'Formato XML incorrecto',
                text: 'La factura no tiene el formato correcto',
                showConfirmButton: false,
                timer: 3000
            })
        }

        reader.readAsText(files[0])
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

    const handleChangeOpciones = (e, value, fieldName) => {
        if (value && value.name) {
            setForm({
                ...form,
                [fieldName]: value.data.id,
                [fieldName + '_nombre']: value.name,
            });
        } else if (value === null) {
            setForm({
                ...form,
                [fieldName]: null,
                [fieldName + '_nombre']: null,
            });
        }
    }

    const handleChangeInt = (e) => {
        const name = e.target.name;
        const value = e.target.value;
    
        setForm({
            ...form,
            [name]: parseInt(value), // Convertir el valor a entero aquí
        })
    }

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    const handleChangeAreas=(e)=>{
        const name = e.target.name;
        const value = e.target.value;

        setForm({
            ...form,
            [name]: parseInt(value),
            // [e.target.name]:e.target.value,
            partida_id: '',
            // subarea: ''
        })
    }

    const handleChange=(e)=>{
        if(e.target.name === 'empresa'){
            setForm({
                ...form,
                [e.target.name]: e.target.value,
                cuentas: options.empresas.find(empresa => empresa.value === e.target.value).cuentas,
            });
        } else {
            const name = e.target.name;
            const value = e.target.value;
            setForm({
                ...form,
                [name]: value,

            });
        }
    }

    const handleChangePagos = (e, value, fieldName) => {
        if (value && value.name) {
            setForm({
                ...form,
                [fieldName]: value.value,
                [fieldName + '_nombre']: value.name,
            });
        } else if (value === null) {
            setForm({
                ...form,
                [fieldName]: null,
                [fieldName + '_nombre']: null,
            });
        }
    }

    const handleChangeMonto = (e) => {
        setForm({
            ...form,
            total: e,
        })
    }

    const handleChangeComision = (e) => {
        setForm({
            ...form,
            comision: e,
        })
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

    const validateForm = () => {
        let validar = true
        let error = {}
        if(form.proveedor === ''){
            error.proveedor = "Seleccione un proveedor"
            validar = false
        }
        if(form.proyecto === ''){
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
        if(form.descripcion === ''){
            error.descripcion = "Escriba una descripcion"
            validar = false
        }
        if(form.area === ''){
            error.area = "Seleccione un departamento"
            validar = false
        }
        if(form.partida_id === ''){
            error.partida_id = "Seleccione el tipo de gasto"
            validar = false
        }
        if (form.subarea === '') {
            error.subarea = "Seleccione una subarea"
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
        if (form.tipoImpuesto === '') {
            error.tipoImpuesto = "indique el tipo de impuestos"
            validar = false
        }
        if (form.tipoPago === '') {
            error.tipoPago = "indique el tipo de impuestos"
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
        if(validateForm()){
            Swal.fire({
                title: '¿Estás seguro?',    
                text: 'Se creará la devolución',
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
                        title: 'Creando devolución',
                        text: 'Por favor, espere...',
                        allowOutsideClick: false,
                        onBeforeOpen: () => {
                            Swal.showLoading()
                        },
                    })

                    let aux = form

                    aux.factura = form.factura ? 'Con factura' : 'Sin factura'
            
                    try {
                        console.log(aux)
                        apiPostForm('v1/proyectos/devoluciones', aux, auth)
                        .then((response) => {
                            const {compra} = response.data
                            Swal.close()
                            Swal.fire({
                                title: 'devolución creada con éxito',
                                text: 'Subiendo adjuntos...',
                                allowOutsideClick: false,
                                onBeforeOpen: () => {
                                    Swal.showLoading()
                                },
                            })
                            
                            setForm({
                                ...form,
                                compra
                            })

                            if (response.data.devolucion.factura) {
                                // Adjunto un XML
                                // if (Object.keys(form.facturaObject).length > 0) {
                                //     if (form.facturaItem) {
                                //         //Tiene una factura guardada
                                //         // attachFactura(response.data, response.data.devolucion.factura)
                                //     } else {
                                //         //No hay factura generada
                                //         // addFacturaS3(response.data.devolucion.id , response.data)
                                //     }
                                // } else {
                                //     //No adjunto XML
                                //     if (form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length) {
                                //         //El compra tiene adjuntos
                                //         // attachFiles(response.data)
                                //     } else {
                                //         //compra generado con éxito 
                                        
                                //     }
                                // }
                                Swal.close()
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Adjuntos subidos con éxito',
                                    text: 'Se subieron los adjuntos con éxito',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                if(reload){
                                    reload.reload()
                                }
                                handleClose()
                            } else {
                                // La compra no es con factura
                                if (form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length) {
                                    //La compra tiene adjuntos
                                    // attachFiles(response.data)

                                } else {
                                    //compra generado con éxito 
                                    Swal.close()
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'devolución creada con éxito',
                                        text: 'Se creó la devolución con éxito',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
                                    if(reload){
                                        reload.reload()
                                    }
                                    handleClose()
                                }
                            }
                        })
                        .catch((error) => {

                            Swal.fire({
                                title: 'Error',
                                text: 'No se pudo crear la devolución',
                                icon: 'error',
                                confirmButtonText: 'Cerrar',
                            })
                        })
                    } catch (error) {
                    }
                }
            })
        } else{
            Swal.fire({
                title: 'Faltan campos',
                text: 'Favor de llenar todos los campos',
                icon: 'info',
                showConfirmButton: false,
                timer: 2000,
            })
        }
    }

    return (
        <>
            <Accordion defaultExpanded className={Style.devoluciones_accordion}>
                <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography className='proyect-Subtitulo'>DATOS DE LA FACTURA</Typography>
                </AccordionSummary>

                <AccordionDetails> 
                    <div style={{width:'100%'}}>

                        <div className={`col-xl-12 ${Style.dev_primeraParte}`}>
                            <div className='col-xl-3'>
                                <InputLabel>¿Lleva factura?</InputLabel>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox checked={!form.factura} onChange={handleChangeCheck} color='secondary' name='factura' />}
                                        label="No"

                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={form.factura} onChange={handleChangeCheck} color='primary' name='factura' />}
                                        label="Si"

                                    />
                                </FormGroup>
                            </div>

                            {
                                form.factura ?
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                                            <div className='col-xl-2'>

                                                <div>
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

                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        {
                                                            form.adjuntos.xml.files.map((item, index) => (
                                                                <div key={index}  style={{ backgroundColor: 'rgba(58, 137, 201, 0.25)', borderRadius: '5px', padding: '5px', marginTop: '5px', marginLeft: '-55px'}}>
                                                                    <div style={{ maxWidth: '140px', display: 'flex', justifyContent: 'space-between' }}>
                                                                        <p>{item.name.length > 10 ? item.name.slice(0, 10) + '...' : item.name}<span onClick={() => handleDeleteFile('xml', index)} style={{ color: 'red', cursor: 'pointer', textAlign: 'center'  }}>X</span></p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>    
                                                </div> 

                                            </div>   

                                        </div>

                                        <div className='col-xl-7'>
                                            <InputLabel>RFC</InputLabel>
                                            <TextField
                                                variant="outlined"
                                                name="rfc"
                                                value={form.rfc ? form.rfc : ''}
                                                style={{ width: 150 }}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                : null 
                            }
                        </div>  

                        <div className= {Style.dev_segundaParte}>
                            <div>
                                {opciones.proveedores.length > 0 ? (
                                    <div>
                                    <InputLabel error={errores.proveedor ? true : false}>Proveedor</InputLabel>
                                    <Autocomplete
                                        name="proveedor"
                                        options={opciones.proveedores}
                                        getOptionLabel={(option) => option.name}
                                        style={{ width: 150 }}
                                        onChange={(event, value) => handleChangeProveedor(event, value)}
                                        renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label={form.proveedor_nombre ? form.proveedor_nombre : 'proveedor'}
                                        />
                                        )}
                                    />
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>

                            {
                                form.factura ? 
                                    <></> :
                                        <div className={`${Style.agregarProveedor}`}>
                                            <Button variant="contained" color="primary" component="span" onClick={agregarProveedor}> 
                                                Agregar proveedor
                                            </Button>
                                        </div>
                            }

                            <div>
                                {
                                    options.proyectos ?
                                        <div> 
                                            <InputLabel error={errores.proyecto ? true : false}>proyecto</InputLabel>
                                            <Autocomplete
                                                name="proyecto"
                                                options={options.proyectos}
                                                getOptionLabel={(option) => option.name}
                                                style={{ width: 150 }}
                                                onChange={(event, value) => handleChangeOpciones(event, value, 'proyecto')}
                                                renderInput={(params) => <TextField {...params}  variant="outlined"  label={form.proyecto_nombre ? form.proyecto_nombre : 'proyecto'} />}
                                            />
                                        </div>    
                                    : <></>
                                }
                            </div>  

                            <div>
                                {
                                    options.empresas.length > 0 ?
                                        <div>
                                            <InputLabel error={errores.empresa ? true : false}>Empresa</InputLabel>
                                            <Select
                                                name="empresa"
                                                value={form.empresa}
                                                onChange={handleChange}
                                                style={{ width: 150 }}
                                            >
                                                {
                                                    options.empresas.map((item, index) => (
                                                        <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </div>
                                    : null
                                }
                            </div>  

                        </div>
                    </div>

                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded className='proyect-accordion'>
                <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography className='proyect-Subtitulo'>SELECCIONA EL ÁREA Y FECHA</Typography>
                </AccordionSummary>

                <AccordionDetails> 
                    <div style={{width:'100%'}}>

                        <div className={`col-xl-12 ${Style.dev_primeraParte}`}>

                            <div>
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
                                            style={{ width: 150 }}
                                            error={errores.fecha ? true : false}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </div>    

                            <div>
                                <TextField
                                    name='descripcion'
                                    label="Descripción"
                                    type="text"
                                    defaultValue={form.descripcion}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    multiline
                                    style={{ width: '150px' }}
                                    error={errores.descripcion ? true : false}
                                />
                            </div>
                        </div>

                        <div className={Style.dev_segundaParte}>
                            <div>
                                {departamentos.length > 0 ?
                                    <>
                                        <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                                        <Select
                                            value={form.area}
                                            name="area"
                                            onChange={handleChangeAreas}
                                            style={{ width: 150, marginRight: '1rem' }}
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

                            <div>
                                {departamentos.length > 0 && form.area !== '' ?
                                    <>
                                        <InputLabel id="demo-simple-select-label">Tipo de Gasto</InputLabel>
                                        <Select
                                            value={form.partida_id}
                                            name="partida_id"
                                            onChange={handleChangeInt}
                                            style={{ width: 150, marginRight: '1rem' }}
                                            error={errores.partida_id ? true : false}
                                        >
                                            {departamentos.find(item => item.id_area == form.area) && departamentos.find(item => item.id_area == form.area).partidas.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                            ))}

                                        </Select>
                                    </>
                                    : null
                                }
                            </div>

                            <div>
                                {departamentos.length && form.partida_id !== '' ?
                                    <>
                                        <InputLabel id="demo-simple-select-label">Tipo de Subgasto</InputLabel>
                                        <Select
                                            name="subarea"
                                            onChange={handleChangeInt}
                                            value={form.subarea}
                                            style={{ width: 150, marginRight: '1rem' }}
                                            error={errores.subarea ? true : false}
                                        >
                                            {departamentos.find(item => item.id_area == form.area).partidas.find(item => item.id == form.partida_id).subpartidas.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                            ))}

                                        </Select>
                                    </>
                                    : null
                                }
                            </div>  
                        </div>

                    </div>
                    
                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded className='proyect-accordion'>
                <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography className='proyect-Subtitulo'>SELECCIONA EL TIPO DE PAGO, IMPUESTO Y ESTATUS</Typography>
                </AccordionSummary>

                <AccordionDetails> 
                    <div style={{width:'100%'}}>

                        <div className={`col-xl-12 ${Style.dev_primeraParte}`}>

                            <div>
                                {
                                    form.cuentas.length > 0 ?
                                        <div>
                                            <InputLabel id="demo-simple-select-label">Cuenta</InputLabel>
                                            <Select
                                                value={form.cuenta}
                                                name="cuenta"
                                                onChange={handleChange}
                                                style={{ width: 150, marginRight: '1rem' }}
                                                // error={errores.cuenta ? true : false}
                                            >
                                                {form.cuentas.map((item, index) => (
                                                    <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    : null
                                }
                            </div> 

                            <div>
                                <CurrencyTextField
                                    label="monto"
                                    variant="standard"
                                    value={form.total} 
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleChangeMonto(value)} 
                                    style={{ width: 150, marginRight: '1rem' }}
                                    error={errores.total ? true : false}
                                />
                            </div>
                            
                            <div>
                                <CurrencyTextField
                                    label="comision"
                                    variant="standard"
                                    value={form.comision} 
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleChangeComision(value)} 
                                    style={{ width: 150, marginRight: '1rem' }}
                                />
                            </div>
                        </div>

                        <div className={Style.dev_segundaParte}>
                            <div>
                                {
                                    options.tiposImpuestos ?
                                        <div>    
                                            <InputLabel error={errores.tipoImpuesto ? true : false}>Tipo de impuesto</InputLabel>
                                            <Autocomplete
                                                name="tipoImpuesto"
                                                options={options.tiposImpuestos}
                                                getOptionLabel={(option) => option.name}
                                                style={{ width: 150, paddingRight: '1rem' }}
                                                onChange={(event, value) => handleChangePagos(event, value, 'tipoImpuesto')}
                                                // onChange={(event, value) => handleChangeImpuestos(event, value)}
                                                renderInput={(params) => <TextField {...params}  variant="outlined"  label={form.impuesto_nombre ? form.impuesto_nombre : 'tipoImpuesto'} />}                            
                                            />
                                        </div>    
                                    : <></>
                                }
                            </div>

                            <div>
                                {
                                    options.tiposPagos ?
                                        <div>    
                                            <InputLabel error={errores.tipoPago ? true : false}>Tipo de pago</InputLabel>
                                            <Autocomplete
                                                name="tipoPago"
                                                options={options.tiposPagos}
                                                getOptionLabel={(option) => option.name}
                                                style={{ width: 150, paddingRight: '1rem' }}
                                                onChange={(event, value) => handleChangePagos(event, value, 'tipoPago')}
                                                renderInput={(params) => <TextField {...params}  variant="outlined"  label={form.impuesto_nombre ? form.impuesto_nombre : 'tipoPago'} />}                            
                                            />
                                        </div>    
                                    : <></>
                                }
                            </div>

                        </div>
                        
                        
                        <div style={{display: 'flex', justifyContent: 'space-evenly', marginTop: '3rem'}}>

                            <div>
                                <InputLabel style={{textAlign: 'center'}}>Pagos</InputLabel>
                                <div>
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

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', width: '20vh'}}>
                                        {
                                            form.adjuntos.pago.files.map((item, index) => (
                                                <div key={index} style={{ backgroundColor: 'rgba(58, 137, 201, 0.25)', borderRadius: '5px', padding: '5px', marginTop: '5px'}}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <p>{item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name}
                                                        <span onClick={() => handleDeleteFile('pago', index)} style={{ color: 'red', cursor: 'pointer'  }}>X</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>    
                                </div>             
                            </div>

                            <div>
                                <InputLabel>Presupuestos</InputLabel>
                                <div>
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

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        {
                                            form.adjuntos.presupuesto.files.map((item, index) => (
                                                <div key={index} style={{ backgroundColor: 'rgba(58, 137, 201, 0.25)', borderRadius: '5px', padding: '5px', marginTop: '5px' }}>
                                                    <div style={{ maxWidth: '140px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <p>{item.name.length > 10 ? item.name.slice(0, 10) + '...' : item.name}
                                                        <span onClick={() => handleDeleteFile('presupuesto', index)} style={{ color: 'red', cursor: 'pointer'  }}>X</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>    
                                </div>             
                            </div>

                            <div>
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
                        {/* <button className={Style.sendButton}>Crear</button> */}
                    </div>
                </div>   
            </div>

            <Modal size="md" title={"agregar proveedor"} handleClose={handleCloseProveedor} show={nuevoProveedor}>
                <CrearProveedor handleClose={handleCloseProveedor} getProveedores={getProveedores} departamentos={departamentos}
                data={form}  reload={reload} handleCloseRecarga={setNuevoProveedor} auth={auth} setProveedorSelect={setProveedorSelect}/>
            </Modal>
        </>
    )
}