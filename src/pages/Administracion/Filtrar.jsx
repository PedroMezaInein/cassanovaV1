import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { apiOptions, catchErrors, apiPutForm, apiPostForm, apiGet }  from './../../functions/api';
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
import Button from '@material-ui/core/Button';

import Style from './Egresos/Modales/estilos.module.css'

export default function CrearEgreso(props) {
    const {opcionesData, reload, handleClose, filtrarTabla,filtrada,setFiltrado, borrarTabla} = props
    const departamentos = useSelector(state => state.opciones.areas)
    const auth = useSelector((state) => state.authUser.access_token);

    const [opciones, setOpciones] = useState({
        clientes: [],
        proveedores: [],
    })

    useEffect(() => {
       
        if(opcionesData){
            setOpciones(opcionesData)
        }
        filtrarTabla('')   

    }, [opcionesData])
 
    const [form, setForm] = useState({
        folio: '',
        serie: '',
        emisor_proveedor: '',
        receptor_proveedor: '',
        emisor_cliente: '',
        receptor_cliente: '',
        subtotal: '',
        total: '',
        certificado: '',
        fecha_fin: '',
        fecha_inicio: '',
        descripcion: '',
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

    const handleChangeEmisor = (e, value) => {
        if (value && value.name) {
            setForm({
                ...form,
                emisor_proveedor: value.rfc,
                emisor_nombre: value.name,
            })
        }
        if (value === null) {
            setForm({
                ...form,
                emisor_proveedor: null,
                emisor_nombre: null,
            })
        }
    }

    const handleChangeReceptor = (e, value) => {
        if (value && value.name) {
            setForm({
                ...form,
                receptor_proveedor: value.rfc,
                receptor_nombre: value.name,
            })
        }
        if (value === null) {
            setForm({
                ...form,
                receptor_proveedor: null,
                receptor_nombre: null,
            })
        }
    }

    const handleChangeEmisorCliente = (e, value) => {
        if (value && value.name) {
            setForm({
                ...form,
                emisor_cliente: value.rfc,
                emisor_nombre_cliente: value.name,
            })
        }
        if (value === null) {
            setForm({
                ...form,
                emisor_cliente: null,
                emisor_nombre_cliente: null,
            })
        }
    }

    const handleChangeReceptorCliente = (e, value) => {
        if (value && value.name) {
            setForm({
                ...form,
                receptor_cliente: value.rfc,
                receptor_nombre_cliente: value.name,
            })
        }
        if (value === null) {
            setForm({
                ...form,
                receptor_cliente: null,
                receptor_nombre_cliente: null,
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
            subtotal: e
        })
    }
    const handleMoneyy = (e) => {
        setForm({
            ...form,
            total: e
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
        
            filtrarTabla(`&folio=${form.folio}&fecha_inicio=${changeDateFormat(form.fecha_inicio)}&fecha_fin=${changeDateFormat(form.fecha_fin)}&emisor_proveedor=${form.emisor_proveedor}&receptor_proveedor=${form.receptor_proveedor}&emisor_cliente=${form.emisor_cliente}&receptor_cliente=${form.receptor_cliente}&subtotal=${form.subtotal}&total=${form.total}&certificado=${form.certificado}&serie=${form.serie}&descripcion=${form.descripcion}`)
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
         <div className="form-group form-group-marginless  mx-0">
                    <br></br>      
            <div className="row">
                    <div className="col-md-3">
                        <TextField name="folio"  type="text" value={form.folio} onChange={handleChange} label="folio" variant="outlined" InputLabelProps={{
                                shrink: true, }} />
                    </div>
                    <div className="col-md-3">
                        <TextField name="serie"  type="text" value={form.serie} onChange={handleChange} label="serie" variant="outlined" InputLabelProps={{
                                shrink: true, }} />
                    </div>
                    <div className="col-md-3">
                        <InputLabel >FECHA INICIAL</InputLabel>
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

                    <div className="col-md-3">
                        <InputLabel >FECHA FINAL</InputLabel>
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
                   <br></br>
                
                    <div className=" row mx-0">
                    {
                        opciones.proveedores.length > 0 ?
                        <div className="col-md-6">
                            <InputLabel>EMISOR Proveedor</InputLabel>
                            <Autocomplete
                                name="emisor_proveedor"
                                options={opciones.proveedores}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, value) => handleChangeEmisor(event, value)}
                                renderInput={(params) => <TextField {...params}  variant="outlined"  label={form.emisor_nombre ? form.emisor_nombre : 'emisor_proveedor'} />}
                            />
                        </div>
                                
                        : null
                    } 

                    {
                        opciones.proveedores.length > 0 ?
                        <div className="col-md-6">
                            <InputLabel>RECEPTOR Proveedor</InputLabel>
                            <Autocomplete
                                name="receptor_proveedor"
                                options={opciones.proveedores}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, value) => handleChangeReceptor(event, value)}
                                renderInput={(params) => <TextField {...params}  variant="outlined"  label={form.receptor_nombre ? form.receptor_nombre : 'receptor_proveedor'} />}
                            />
                        </div>
                                
                        : null
                    } 

                       
                </div>

                <br></br>
                
                <div className=" row mx-0">
                {
                    opciones.clientes.length > 0 ?
                    <div className="col-md-6">
                        <InputLabel>EMISOR cliente</InputLabel>
                        <Autocomplete
                            name="emisor_cliente"
                            options={opciones.clientes}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, value) => handleChangeEmisorCliente(event, value)}
                            renderInput={(params) => <TextField {...params}  variant="outlined"  label={form.emisor_nombre_cliente ? form.emisor_nombre_cliente : 'emisor_cliente'} />}
                        />
                    </div>
                            
                    : null
                } 

                {
                    opciones.clientes.length > 0 ?
                    <div className="col-md-6">
                        <InputLabel>RECEPTOR cliente</InputLabel>
                        <Autocomplete
                            name="receptor_cliente"
                            options={opciones.clientes}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, value) => handleChangeReceptorCliente(event, value)}
                            renderInput={(params) => <TextField {...params}  variant="outlined"  label={form.receptor_nombre_cliente ? form.receptor_nombre_cliente : 'receptor_cliente'} />}
                        />
                    </div>
                            
                    : null
                } 

                   
            </div>

                <br></br>
                
                 <div className=" row ">
                       <div className="col-md-2">
                            <CurrencyTextField label="subtotal" name="subtotal" value={form.subtotal} currencySymbol="$" outputFormat="number" onChange={(event, value) => handleMoney(value)} InputLabelProps={{
                                    shrink: true,}}  />
                        </div>
                        <div className="col-md-2">
                            <CurrencyTextField label="total" name="total" value={form.total} currencySymbol="$" outputFormat="number" onChange={(event, value) => handleMoneyy(value)} InputLabelProps={{
                                    shrink: true,}} />
                        </div>
                        <div className="col-md-8">
                            <TextField type="text" name="certificado" value={form.certificado} onChange={handleChange} label="No. certificado" variant="outlined" InputLabelProps={{
                                    shrink: true, }} style={{ width: '80vh' }} />
                        </div>
                 </div>
                <br></br>

                <div className=" row ">
                    <div className="col-md-12">
                        <TextField name='descripcion' label="Descripción" type="text" defaultValue={form.descripcion} onChange={handleChange} InputLabelProps={{
                            shrink: true,}} multiline style={{ width: '80vh', height: 100 }}/>
                    </div>

                </div>
        </div>
        <div className=" row ">

            <div className="col-md-6"> 
                <Button variant="contained" color="secondary" onClick={borrar}>Borrar</Button>
            </div>
            <div className="col-md-6">
                <Button variant="contained" color="primary" onClick={filtrar}>Filtrar</Button>
            </div>
        </div>


        </>
    ) 
}
