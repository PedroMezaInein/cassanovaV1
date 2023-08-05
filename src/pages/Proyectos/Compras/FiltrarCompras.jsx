import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'

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
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import Style from './../../Administracion/Egresos/Modales/estilos.module.css'

export default function CrearEgreso(props) {
    const {opcionesData, reload, handleClose, filtrarTabla,filtrada,setFiltrado, borrarTabla} = props
    const departamentos = useSelector(state => state.opciones.compras)
    const proyectos = useSelector(state => state.opciones.proyectos)
    const auth = useSelector((state) => state.authUser.access_token);

    console.log(opcionesData)

    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        estatusCompras: [],
        proveedores: [],
        tiposImpuestos: [],
        tiposPagos: [],
    })

    useEffect(() => {
        if(opcionesData){
            setOpciones(opcionesData)
        }
        filtrarTabla('')   

    }, [opcionesData])
 
    const [form, setForm] = useState({
        area: '',
        cuenta: '',
        cuentas: [],
        descripcion: '',
        identificador: '',
        // empresa: opcionesData.empresas[0].id,
        empresa: '',
        monto: '',
        factura: '', 
        fecha_inicio: '',
        fecha_fin: '',
        id_partidas: "",
        proveedor: '',
        proyecto: '',
        subarea: '',
    })

    const handleChangeCheck = (tipo) => {
        if(tipo === 'no'){
            if(form.factura === false){
                setForm({
                    ...form,
                    factura: ''
                });
            } else {
                setForm({
                    ...form,
                    factura: false
                });
            }
        } else if(tipo === 'si'){
            if(form.factura === true){
                setForm({
                    ...form,
                    factura: ''
                });
            } else {
                setForm({
                    ...form,
                    factura: true
                });
            }
        } 
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
            monto: e
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

    const filtrar = () => {  
        filtrarTabla(`&identificador=${form.identificador}&fecha_inicio=${changeDateFormat(form.fecha_inicio)}&fecha_fin=${changeDateFormat(form.fecha_fin)}&proveedor=${form.proveedor}&empresa=${form.empresa}&area=${form.area}&subarea=${form.subarea}&cuenta=${form.cuenta}&monto=${form.monto}&factura=${form.factura}&descripcion=${form.descripcion}&proyecto=${form.proyecto}`)
        // console.log('filtrar tabla')
        handleClose()
        // borrar(false)
    }

    const borrar = () => {
        
            // console.log('filtrar tabla')
            filtrarTabla('')   
            borrarTabla(false)
            handleClose()

        }

    return (
        <>
            <div style={{padding: '1rem'}}>
                
                <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%',marginTop: '1rem', marginBottom: '1rem'}}>
                    <div>
                        <InputLabel>ID</InputLabel>
                        <TextField
                            type="text"
                            name="identificador"
                            value={form.identificador}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{width: '100px'}}
                            
                        />    
                    </div>
                    <div>
                        <InputLabel >fecha inicio</InputLabel>
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
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div> 

                    <div>
                        <InputLabel >fecha fin</InputLabel>
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
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div> 

                </div>
                
                <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%',marginTop: '4rem', marginBottom: '4rem'}}>
                    {
                        opciones.proveedores.length > 0 ?
                        <div>
                            <InputLabel>Proveedor</InputLabel>
                            <Autocomplete
                                name="proveedor"
                                options={opciones.proveedores}
                                getOptionLabel={(option) => option.name}
                                style={{ width: 230, paddingRight: '1rem' }}
                                onChange={(event, value) => handleChangeProveedor(event, value)}
                                renderInput={(params) => <TextField {...params}  variant="outlined"  label={form.proveedor_nombre ? form.proveedor_nombre : 'proveedor'} />}
                            />
                        </div>
                                
                        : null
                    } 

                    <div>
                        {
                            proyectos.length > 0 ?
                            <div> 
                                <InputLabel>proyecto</InputLabel>
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
                        <CurrencyTextField
                            label="total"
                            name="monto"
                            value={form.monto}
                            currencySymbol="$"
                            outputFormat="number"
                            onChange={(event, value) => handleMoney(value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{width: '150px'}}
                            />
                    
                    </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%',marginTop: '4rem', marginBottom: '4rem'}}>

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

                    {
                        form.cuentas.length > 0 ?
                            <div>
                                <InputLabel id="demo-simple-select-label">Cuenta</InputLabel>
                                <Select
                                    value={form.cuenta}
                                    name="cuenta"
                                    onChange={handleChange}
                                    style={{ width: 200, marginRight: '1rem' }}
                                >
                                    {form.cuentas.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                    ))}
                                </Select>
                            </div>
                        : null
                    }    
                </div>

                <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%',marginTop: '1.5rem', marginBottom: '5rem'}}>
                    <div>
                        {departamentos.length > 0 ?
                            <>
                                <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                                <Select
                                    value={form.area}
                                    name="area"
                                    onChange={handleChange}
                                    style={{ width: 230, marginRight: '1rem' }}
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
                                    value={form.id_partidas}
                                    name="id_partidas"
                                    onChange={handleChange}
                                    style={{ width: 230, marginRight: '1rem' }}
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
                        {departamentos.length && form.id_partidas !== '' ?
                            <>
                                <InputLabel id="demo-simple-select-label">Tipo de Subgasto</InputLabel>
                                <Select
                                    name="subarea"
                                    onChange={handleChange}
                                    value={form.subarea}
                                    style={{ width: 230, marginRight: '1rem' }}
                                >
                                    {departamentos.find(item => item.id_area == form.area).partidas.find(item => item.id == form.id_partidas).subpartidas.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                    ))}

                                </Select>
                            </>
                            : null
                        }
                    </div>  
                    
                </div>

                <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%',marginTop: '1.5rem', marginBottom: '5rem'}}>
                    {/* {
                        opciones.estatusCompras.length > 0 ?
                            <div>
                                <InputLabel id="demo-simple-select-label">Estatus de Compra</InputLabel>
                                <Select
                                    value={form.estatusCompra}
                                    name="estatusCompra"
                                    onChange={handleChange}
                                    style={{ width: 230, marginRight: '1rem' }}
                                >
                                    {opciones.estatusCompras.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                            </div>
                            : null
                    } */}
                    
                    <div>
                        <InputLabel>¿Factura?</InputLabel>
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox checked={form.factura === false ? true : false} onChange={e=>handleChangeCheck('no')} color='secondary' name='factura' />}
                                label="No"
                                
                            />
                            <FormControlLabel
                                control={<Checkbox checked={form.factura} onChange={e=>handleChangeCheck('si')} color='primary' name='factura' />}
                                label="Si"
                                
                            />
                        </FormGroup>
                    </div>     
                </div>

                <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%',marginTop: '1.5rem', marginBottom: '1rem'}}>
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
                    />
                </div>
                  
            </div>
            <div>
                <button className={Style.borrarButton}  onClick={borrar}>Borrar</button>
            </div>
            <div>
                <button className={Style.sendButton}  onClick={filtrar}>Filtrar</button>
            </div>

        </>
    ) 
}
