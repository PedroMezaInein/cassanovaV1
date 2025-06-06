import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// import { apiOptions, catchErrors, apiPutForm, apiPostForm, apiGet } from './../../../../functions/api';

import DateFnsUtils from '@date-io/date-fns';
import Swal from 'sweetalert2'
import { es } from 'date-fns/locale'
import S3 from 'react-aws-s3'

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

import Style from './estilos.module.css'

export default function CrearEgreso(props) {
    const {opcionesData, reload, handleClose, filtrarTabla, borrarTabla} = props
    const departamentos = useSelector(state => state.opciones.areas)
    const auth = useSelector((state) => state.authUser.access_token);
    const presupuestos = useSelector(state => state.opciones.presupuestos)

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
        descripcion: '',
        orden_compra: '',
        monto: '',
        fecha_fin: '',
        fecha_inicio: '',
        id_partidas: "",
        subarea: '',
        presupuestos: '',
        monto_pagado: '',
    })


    const handleChange = (e) => {
        console.log(e.target.name)
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

      
    const handleMoney2 = (e) => {
        setForm({
            ...form,
            monto_pagado: e
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

    const filtrar = () => {
        
            filtrarTabla(`&orden_compra=${form.orden_compra}&fecha_inicio=${changeDateFormat(form.fecha_inicio)}&fecha_fin=${changeDateFormat(form.fecha_fin)}&area=${form.area}&partida=${form.id_partidas}&subarea=${form.subarea}&monto=${form.monto}&descripcion=${form.descripcion}&presupuestos=${form.presupuestos}&monto_pagado=${form.monto_pagado} `)
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
                        <InputLabel>Orden de compra</InputLabel>
                        <TextField
                            type="text"
                            name="orden_compra"
                            value={form.orden_compra}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{width: '100px'}}
                            
                        />    
                    </div>
                    <div>
                        <InputLabel >RANGO INICIAL</InputLabel>
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
                        <InputLabel >RANGO FINAL</InputLabel>
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
                        <div>
                            <CurrencyTextField
                                label="monto solicitado"
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
                        <div>
                            <CurrencyTextField
                                label="monto pagado"
                                name="monto_pagado"
                                value={form.monto_pagado}
                                currencySymbol="$"
                                outputFormat="number"
                                onChange={(event, value) => handleMoney2(value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{width: '150px'}}
                                />                        
                        </div>
                        <div>
                                {presupuestos.length > 0 ?
                                    <>
                                        <InputLabel id="demo-simple-select-label">Presupuesto</InputLabel>
                                        <Select
                                            value={form.presupuestos}
                                            name="presupuestos"
                                            onChange={handleChange}
                                            style={{ width: 230, marginRight: '1rem' }}
                                        >
                                            {presupuestos.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                            ))}

                                        </Select>
                                    </>
                                    : null
                                }

                            </div>
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
