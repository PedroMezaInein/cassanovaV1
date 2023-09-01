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
import Swal from 'sweetalert2'

import { apiPostForm } from '../../../functions/api';
import Style from './crearDevoluciones.module.scss'
// import Style from '../../Administracion/Egresos/Modales/estilos.module.css'

export default function FiltrosDevoluciones (props) {
    const { options, opcionesData, reload, handleClose, filtrarTabla, borrarTabla } = props
    const auth = useSelector((state) => state.authUser.access_token);
    const departamentos = useSelector(state => state.opciones.compras)
    console.log(options)

    const [form, setForm] = useState({
        identificador: '',
        factura: false,
        proveedor: '',
        proyecto: '',
        empresa: '',
        fecha_inicio: '',
        fecha_fin: '',
        descripcion: '',
        area: '',
        partida: '',
        subarea: '',
        cuenta: '',
        cuentas: [],
        monto: '',
        comision: '',
        total: '',
        tipo_impuesto: '',
        tipo_pago: '',
        estatusCompra: 2,
    })

    const filtrar = () => {  
        filtrarTabla(`&identificador=${form.identificador}&factura=${form.factura}&proveedor=${form.proveedor}&proyecto=${form.proyecto}&empresa=${form.empresa}&fecha_inicio=${changeDateFormat(form.fecha_inicio)}&fecha_fin=${changeDateFormat(form.fecha_fin)}&descripcion=${form.descripcion}&area=${form.area}&partida=${form.partida}&subarea=${form.subarea}&cuenta=${form.cuenta}&monto=${form.monto}&comision=${form.comision}&tipo_impuesto=${form.tipo_impuesto}&tipo_pago=${form.tipo_pago}&total=${form.total}`)
        // console.log('filtrar tabla')
        handleClose()
        // borrar(false)
    }

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
        filtrarTabla('')
    }, [opcionesData])

    const borrar = () => {
        filtrarTabla('')   
        borrarTabla(false)
        handleClose()
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

    const handleChangeCheck = () => {
        setForm({
            ...form,
            factura: !form.factura
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
            partida: '',
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

    const changeDateFormat = (date) => {
        if(date === null || date === ''){
            return ''
        } else {
            let fecha = new Date(date)
            let dia = fecha.getDate()
            let mes = fecha.getMonth() + 1
            let anio = fecha.getFullYear()
            return `${anio}/${mes}/${dia}`
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

                        </div>  

                        <div className= {Style.dev_segundaParte}>
                            <div>
                                {opciones.proveedores ? (
                                    <div>
                                        <InputLabel>Proveedor</InputLabel>
                                        <Autocomplete
                                            name="proveedor"
                                            options={opciones.proveedores}
                                            getOptionLabel={(option) => option.name}
                                            style={{ width: 150 }}
                                            onChange={(event, value) => handleChangeProveedor(event, value)}
                                            // onChange={(event, value) => handleChangeOpciones(event, value, 'proveedor')}
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

                            <div>
                                {
                                    options.proyectos ?
                                        <div> 
                                            <InputLabel>proyecto</InputLabel>
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
                                            <InputLabel>Empresa</InputLabel>
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
                                <InputLabel >Fecha inicio</InputLabel>
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                                    <Grid container >
                                        <KeyboardDatePicker

                                            format="dd/MM/yyyy"
                                            name="fecha_inicio"
                                            value={form.fecha_inicio !== '' ? form.fecha_inicio : null}
                                            placeholder="dd/mm/yyyy"
                                            onChange={e => handleChangeFecha(e, 'fecha_inicio')} 
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            style={{ width: 150 }}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </div>    

                            <div>
                                <InputLabel >Fecha fin</InputLabel>
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                                    <Grid container >
                                        <KeyboardDatePicker

                                            format="dd/MM/yyyy"
                                            name="fecha_fin"
                                            value={form.fecha_fin !== '' ? form.fecha_fin : null}
                                            placeholder="dd/mm/yyyy"
                                            onChange={e => handleChangeFecha(e, 'fecha_fin')} 
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            style={{ width: 150 }}
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
                                            onChange={handleChangeInt}
                                            style={{ width: 150, marginRight: '1rem' }}
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
                                {departamentos.length && form.partida !== '' ?
                                    <>
                                        <InputLabel id="demo-simple-select-label">Tipo de Subgasto</InputLabel>
                                        <Select
                                            name="subarea"
                                            onChange={handleChangeInt}
                                            value={form.subarea}
                                            style={{ width: 150, marginRight: '1rem' }}
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
                                    value={form.monto} 
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleChangeMonto(value)} 
                                    style={{ width: 150, marginRight: '1rem' }}
                                />
                            </div>
                            <div>
                                <CurrencyTextField
                                    label="total"
                                    variant="standard"
                                    value={form.total} 
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleChangeMonto(value)} 
                                    style={{ width: 150, marginRight: '1rem' }}
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
                                            <InputLabel>Tipo de impuesto</InputLabel>
                                            <Autocomplete
                                                name="tipo_impuesto"
                                                options={options.tiposImpuestos}
                                                getOptionLabel={(option) => option.name}
                                                style={{ width: 150, paddingRight: '1rem' }}
                                                onChange={(event, value) => handleChangePagos(event, value, 'tipo_impuesto')}
                                                // onChange={(event, value) => handleChangeImpuestos(event, value)}
                                                renderInput={(params) => <TextField {...params}  variant="outlined"  label={form.impuesto_nombre ? form.impuesto_nombre : 'tipo_impuesto'} />}                            
                                            />
                                        </div>    
                                    : <></>
                                }
                            </div>

                            <div>
                                {
                                    options.tiposPagos ?
                                        <div>    
                                            <InputLabel>Tipo de pago</InputLabel>
                                            <Autocomplete
                                                name="tipo_pago"
                                                options={options.tiposPagos}
                                                getOptionLabel={(option) => option.name}
                                                style={{ width: 150, paddingRight: '1rem' }}
                                                onChange={(event, value) => handleChangePagos(event, value, 'tipo_pago')}
                                                renderInput={(params) => <TextField {...params}  variant="outlined"  label={form.impuesto_nombre ? form.impuesto_nombre : 'tipo_pago'} />}                            
                                            />
                                        </div>    
                                    : <></>
                                }
                            </div>

                        </div>
                        
                    </div>
                    
                </AccordionDetails>
            </Accordion>

            <div>
                <div className="row justify-content-end">
                <div className="col-md-4">
                <button className={Style.borrarButton}  onClick={borrar}>Borrar</button>
                    </div>

                <div className="col-md-4">
                        <button className={Style.sendButton} onClick={filtrar}>Filtrar</button>
                    </div>
                </div>   
            </div>

        </>
    )
}