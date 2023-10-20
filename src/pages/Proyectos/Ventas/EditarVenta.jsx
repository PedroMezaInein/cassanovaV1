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
import TextField from '@material-ui/core/TextField';
import Swal from 'sweetalert2'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { es } from 'date-fns/locale'
import DateFnsUtils from '@date-io/date-fns';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import { apiPostForm, apiGet, apiPutForm } from '../../../functions/api';
import Style from './../../Administracion/Egresos/Modales/CrearEgreso.module.css'

export default function CrearCompras(props) {

    const { opcionesData, handleClose, reload, data } = props
    const departamentos = useSelector(state => state.opciones.ventas)
    const proyectos = useSelector(state => state.opciones.proyectos)
    const areaCompras = useSelector(state => state.opciones.compras)
    const [errores, setErrores] = useState({})

    const auth = useSelector((state) => state.authUser.access_token);

    // let valorArea = areaCompras.find((element) => parseInt(element.id_area) === data.area.id)
    // let valorPartida = valorArea.partidas.find((element) => parseInt(element.id) === data.partida_id)
    // let valorSubPartida = valorPartida.subpartidas.find((element) => parseInt(element.id) === data.subarea.id)
  
    useEffect(() => {
        
        if(opcionesData){
            setOpciones(opcionesData)
        }
    }, [opcionesData])

    const [form, setForm] = useState({
        adjuntos: {
            pago: {files:[], value: ''},
            pdf: { files: [], value: '' },
            presupuesto: { files: [], value: '' },
            xml: { files: [], value: '' },
        },
        area : data.area ?  data.area.id : '',
        banco: 0,
        // cuenta: '',
        cuenta: data.cuenta ? data.cuenta.id : '',
        cuentas: [],
        descripcion: data.descripcion ? data.descripcion : '',
        empresa: data.empresa.id,
        proveedor:data.cliente ? data.cliente.id : '',
        proveedor_nombre:data.cliente ? data.cliente.empresa : '',
        // empresa: data.empresa.id ? data.empresa.id : '',
        estatusCompra: 2,
        factura: false, 
        facturaItem: '',
        facturaObject: {},
        fecha: data.created_at,
        partida: data.partida ? data.partida.id : '',
        numCuenta: "",
        proyecto: data.proyecto ? data.proyecto.id : '',
        proyecto_nombre:data.proyecto ? data.proyecto.nombre: '',
        subarea: data.subarea ? data.subarea.id : '',
        tipo: 0,
        tipoImpuesto: 1,
        tipoPago: 4,
        total: data.total ? data.total : '',
    })

    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        clientes: [],
        estatusCompras: [],
        proveedores: [],
        proyectos: [],
        tiposImpuestos: [],
        tickets: [],
        tiposPagos: [],
    })

    useEffect(() => {
        
        if(opcionesData){
            setOpciones(opcionesData)
        }
    }, [opcionesData])

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
                cuentas: opciones.empresas.find(empresa => empresa.id === e.target.value).cuentas,

            });
        } else {
            setForm({
                ...form,
                [e.target.name]: e.target.value
            });
        }
        
    };
    
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

    const handleChangeAreas=(e)=>{
        setForm({
            ...form,
            [e.target.name]:e.target.value,
            partida: '',
            subarea: ''
        })
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

    const addFacturaS3 =  (values, egreso) => {
        apiGet(`v1/constant/admin-proyectos`, auth).then(
            (response) => {
                const { alma } = response.data
                let filePath = `facturas/venta/`
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

    const  attachFiles = (venta) => {
        apiGet(`v1/constant/admin-proyectos`, auth).then(
            (response) => {
                const { alma } = response.data
                let filePath = `ventas/${venta.id}/`
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
                    attachFilesS3(values, venta) 
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
            tipo: 'venta',
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
                        title: 'compra editada con éxito',
                        text: 'Se editó la compra con éxito',
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

    const validateForm = () => {
        let validar = true
        let error = {}
        if(form.proveedor === '' || form.proveedor === null){
            error.proveedor = "Seleccione un proveedor"
            validar = false
        }
        if(form.proyecto === '' || form.proyecto === null){
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
        if(form.area === ''){
            error.area = "Seleccione un departamento"
            validar = false
        }
        if(form.partida === ''){
            error.partida = "Seleccione el tipo de gasto"
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
        if(form.descripcion === ''){
            error.descripcion = "Escriba una descripcion"
            validar = false
        }
        if (form.total === '') {
            error.total = "indique el monto total"
            validar = false
        }
       
        setErrores(error)
        return validar
    }

    const handleSend = () => {
        if(validateForm()){

            Swal.fire({
                title: '¿Estás seguro?',    
                text: 'Se editará la compra',
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
                        title: 'editando compra',
                        text: 'Por favor, espere...',
                        allowOutsideClick: false,
                        onBeforeOpen: () => {
                            Swal.showLoading()
                        },
                    })

                    let aux = form

                    aux.factura = form.factura ? 'Con factura' : 'Sin factura'


                    try {
                        apiPutForm(`v2/proyectos/ventas/area/${data.id}`, form, auth)
                        .then((response) => {
                            const {venta} = response.data
                            Swal.close()
                            Swal.fire({
                                title: 'venta editada con éxito',
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
                                        addFacturaS3(venta.id , venta)
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
                                if(reload){
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
                                        title: 'venta editada con éxito',
                                        text: 'Se editó la venta con éxito',
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
                            console.log(error)

                            Swal.fire({
                                title: 'Error',
                                text: 'No se pudo editar la venta',
                                icon: 'error',
                                confirmButtonText: 'Cerrar',
                            })
                        })
                    } catch (error) {
                        console.log(error)
                    }
                }
            }) 
        }else{
            Swal.fire({
                title: 'Faltan campos',
                text: 'Favor de llenar todos los campos',
                icon: 'info',
                showConfirmButton: false,
                timer: 2000,
            })
        }

    }

    return(
        <>
            <Accordion defaultExpanded className='proyect-accordion'>

                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography className='proyect-Subtitulo'>DATOS DE LA FACTURA</Typography>
                </AccordionSummary>

                <AccordionDetails> 
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginRight: '10px', flexDirection: 'column' }}>
                            <div>
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
                                        <div>
                                        <InputLabel>RFC</InputLabel>
                                            <TextField
                                                variant="outlined"
                                                name="rfc"
                                                value={form.rfc ? form.rfc : ''}
                                                onChange={handleChange}
                                            />

                                        </div>
                                    </div>
                                    : null
                                
                            }
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                            <div>
                                {
                                    opciones.clientes.length > 0 ?
                                        <div>    
                                            <InputLabel error={errores.clientes ? true : false}>Cliente</InputLabel>
                                            <Autocomplete
                                                name="cliente"
                                                options={opciones.clientes}
                                                getOptionLabel={(option) => option.name}
                                                style={{ width: 250, paddingRight: '1rem' }}
                                                onChange={(event, value) => handleChangeProveedor(event, value)}
                                                renderInput={(params) => <TextField {...params}  variant="outlined"  label={form.proveedor_nombre ? form.proveedor_nombre : 'cliente'} />}
                                                error={errores.clientes ? true : false}
                                            />
                                        </div>    
                                    : <></>
                                }
                            </div>  

                            <div>
                                {
                                    proyectos.length > 0 ?
                                    <div> 
                                        <InputLabel error={errores.proyecto ? true : false}>proyecto</InputLabel>
                                        <Autocomplete
                                            name="proyecto"
                                            options={proyectos}
                                            getOptionLabel={(option) => option.nombre}
                                            style={{ width: 230, paddingRight: '1rem' }}
                                            onChange={(event, value) => handleChangeProyecto(event, value)}
                                            renderInput={(params) => <TextField {...params}  variant="outlined"  label={form.proyecto_nombre ? form.proyecto_nombre : 'proyecto'} />}
                                        />
                                    </div>    
                                        : <></>
                                }
                            </div>  

                            <div>
                                {
                                    opciones.empresas.length > 0 ?
                                        <div>
                                            <InputLabel>Empresa</InputLabel>
                                            <Select
                                                name="empresa"
                                                value={form.empresa}
                                                onChange={handleChange}
                                                style={{ width: 200, paddingRight: '1rem' }}
                                            >
                                                {
                                                    opciones.empresas.map((item, index) => (
                                                        <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </div>
                                    : null
                                }
                            </div>  
                        </div> 
                        <div>
                                {
                                    opciones.tickets.length > 0 ?
                                        <div>    
                                            <InputLabel error={errores.tickets ? true : false}>tickets</InputLabel>
                                            <Autocomplete
                                                name="tickets"
                                                options={opciones.tickets}
                                                getOptionLabel={(option) => option.name}
                                                style={{ width: 250, paddingRight: '1rem' }}
                                                onChange={(event, value) => handleChangeTicket(event, value)}
                                                renderInput={(params) => <TextField {...params}  variant="outlined"  label={form.tickets_nombre ? form.tickets_nombre : 'tickets'} />}
                                                error={errores.tickets ? true : false}
                                            />
                                        </div>    
                                    : <></>
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
                    <div>

                        <div>
                            <div>
                                <InputLabel >Fecha de la venta</InputLabel>
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

                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div>
                                {departamentos.length > 0 ?
                                    <>
                                        <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                                        <Select
                                            value={form.area}
                                            name="area"
                                            onChange={handleChangeAreas}
                                            style={{ width: 230, marginRight: '1rem' }}
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
                                            value={form.partida}
                                            name="partida"
                                            onChange={handleChange}
                                            style={{ width: 230, marginRight: '1rem' }}
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

                            <div>
                                { form.area && form.partida !== '' ?
                                    <>
                                        <InputLabel id="demo-simple-select-label">Tipo de Subgasto</InputLabel>
                                        <Select
                                            value={form.subarea}
                                            name="subarea"
                                            onChange={handleChange}  
                                            style={{ width: 230, marginRight: '1rem' }}
                                            error={errores.subarea ? true : false}
                                        >
                                            {departamentos.find(item => item.id_area == form.area).partidas.find(item => item.id == form.partida).subpartidas.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                            ))}

                                        </Select>
                                    </>
                                    : null
                                }
                            </div>  
                            
                        </div>

                        <div>

                            <div style={{marginTop: '1rem'}}>
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
                                    style={{ width: '70vh', height: 100 }}
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
                    <div style={{ width: '100%' }}>
                        
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div>
                                {/* {
                                    form.empresa ? 
                                        form.cuentas.length > 0 ? */}
                                        
                                            <div>
                                                <InputLabel id="demo-simple-select-label">Cuenta</InputLabel>
                                                <Select
                                                    value={form.cuenta}
                                                    name="cuenta"
                                                    onChange={handleChange}
                                                    style={{ width: 230, marginRight: '1rem' }}
                                                    error={errores.cuenta ? true : false}
                                                >
                                                    {
                                                        opciones.empresas.map((item, index) => (
                                                            form.empresa == item.id ?
                                                                item.cuentas.map((cuenta, index2) => (
                                                                form.cuenta == cuenta.id ?
                                                                <MenuItem key={index2} value={cuenta.id}>{cuenta.nombre}</MenuItem>
                                                                : 
                                                                <MenuItem key={index2} value={cuenta.id}>{cuenta.nombre}</MenuItem>

                                                                ))
                                                            : <></>
                                                        ))

                                                        // presupuestos.map((item, index) => ( 
                                                        //     item.rel.map((item2, index2) => (
                                                        //         item2.id_area == state.departamento ? 
                                                        //         <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                                        //         : <></>
                                                        //     ))
                                                            
                                                        // ))
                                                    }
                                                </Select>
                                            </div>
                                        
                                {/*         : null
                                     : null
                                 } */}
                                  <div>
                                {
                                    opciones.clientes.length > 0 ?
                                        <div>
                                            <InputLabel id="demo-simple-select-label">Contrato</InputLabel>
                                            <Select
                                                value={form.contrato}
                                                name="contrato"
                                                onChange={handleChange}
                                                style={{ width: 150, marginRight: '1rem' }}
                                                error={errores.contrato ? true : false}
                                            >
                                                  { opciones.clientes.find(item => item.id == form.cliente)  && 
                                                opciones.clientes.find(item => item.id == form.cliente).contratos.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                            ))}
                                            </Select>
                                        </div>
                                        : null
                                }

                            </div> 

                            </div> 
                            <div>
                                {
                                    opciones.tiposPagos.length > 0 ?
            
                                        <div>
                                            <InputLabel id="demo-simple-select-label">Tipo de Pago</InputLabel>

                                            <Select
                                                value={form.tipoPago}
                                                name="tipoPago"
                                                onChange={handleChange}
                                                style={{ width: 230, marginRight: '1rem' }}
                                            >
                                                {opciones.tiposPagos.map((item, index) => (
                                                    <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    : null
                                }

                            </div> 
                            <div>
                            
                            </div> 
                        </div>
                        
                        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '2rem'}}>
                            <div>
                                {
                                    opciones.tiposImpuestos.length > 0 ?
                                        <div>
                                            <InputLabel id="demo-simple-select-label">Tipo de Impuesto</InputLabel>
                                            <Select
                                                value={form.tipoImpuesto}
                                                name="tipoImpuesto"
                                                onChange={handleChange}
                                                style={{ width: 230, marginRight: '1rem' }}
                                            >
                                                {opciones.tiposImpuestos.map((item, index) => (
                                                    <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                        : null
                                }

                            </div> 
                            <div>
                                <CurrencyTextField
                                    label="total"
                                    variant="standard"
                                    value={form.total} 
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleMoney(value)} 
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
                                    onChange={(event, value) => handleMoneyComision(value)} 
                                    
                                />
                            </div>
                        </div>

                    </div>
                </AccordionDetails>
            </Accordion>

            <div>
                <div className="row justify-content-end">
                    <div className="col-md-4">
                        <button className={Style.sendButton} onClick={e => handleSend(form)}>editar</button>
                    </div>
                </div>   
            </div>
            
        </>
    )
}