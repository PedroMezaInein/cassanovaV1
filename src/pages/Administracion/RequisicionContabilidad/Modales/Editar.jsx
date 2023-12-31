import React, {useState} from 'react'
import { useSelector } from 'react-redux'

import { apiPutForm } from '../../../../functions/api'

import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'
import Grid from '@material-ui/core/Grid';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import Swal from 'sweetalert2'

import Style from './AprobarSolicitud.module.css'

const useStyles = makeStyles((theme) => ({
    textField: {
        width: '75%',
    },
    error: {
        color: 'red',
    }
}));

export default function Editar(props) {
    const { data, handleClose, reload, opciones, estatusCompras } = props
    const departamentos = useSelector(state => state.opciones.areas)
    const auth = useSelector(state => state.authUser)
    const [form, setForm] = useState({
        fecha: new Date(data.fecha),
        departamento: data.departamento_id,
        tipoGasto: data.tipoEgreso_id,
        tipoSubgasto: data.tipoSubEgreso_id,
        tipoPago: data.tipoPago_id,
        monto: data.monto ? data.monto : 0,
        descripcion: data.descripcion,
        id: data.id,
        orden_compra: data.orden_compra,
        fecha_pago: data.fecha_pago ? new Date(data.fecha_pago) : '',
        id_cuenta: data.cuenta ? data.cuenta.id : null,
        monto_solicitado: data.monto_solicitado,
        auto1: data.auto1 ? data.auto1 : false,
        auto2: data.auto2 ? data.auto2 : false,
        auto3: data.auto3 ? data.auto3 : false,
        /* id_estatus: data.id_estatus_compra, */
        proveedor: data.proveedor,
        estatus_compra: data.estatus_compra,
        estatus_conta: data.estatus_conta,
        compra: data.compra,
        conta: data.conta,
        factura: data.factura,
        empresa: "",
        labelCuenta: data.cuenta ? data.cuenta.nombre : 'cuenta',
        fecha_entrega: data.fecha_entrega ? new Date(data.fecha_entrega) : '',
    })

    const [errores, setErrores] = useState({})

    const classes = useStyles();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
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

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    const handleSave = () => {
        if (validateForm()) {
            if (form.auto2) {
                Swal.fire({
                    title: 'Cuentas afectadas',
                    icon: 'warning',
                    html: 'Esta requisición ya generó una afectación en las cuentas, ¿desea actualizarla?',
                    showCancelButton: true,
                    confirmButtonColor: 'red',
                    confirmButtonText: 'Si, entiendo el alcance de la acción',
                    cancelButtonText: 'No, cancelar',
                }).then((result) => {
                    if (result.isConfirmed) { 
                        try {
                            Swal.fire({
                                title: 'Guardando...',
                                allowOutsideClick: false,
                                onBeforeOpen: () => {
                                    Swal.showLoading()
                                }
                            })
                            let newForm = {
                                id_departamento: form.departamento,
                                id_gasto: form.tipoGasto,
                                descripcion: form.descripcion,
                                id_subarea: form.tipoSubgasto,
                                id_pago: form.tipoPago,
                                id_solicitante: data.solicitante_id,
                                monto_pagado: form.monto,
                                cantidad: form.monto_solicitado,
                                autorizacion_1: form.auto1 ? form.auto1.id : null,
                                autorizacion_2: form.auto2 ? auth.user.id : null,
                                orden_compra: form.orden_compra,
                                fecha_pago: form.fecha_pago,
                                id_cuenta: form.id_cuenta,
                                /* id_estatus: form.id_estatus, */
                                id_proveedor: form.proveedor,
                                id_estatus_compra: form.compra,
                                id_estatus_factura: form.factura,
                                id_estatus_conta: form.conta,
                                fecha_entrega: form.fecha_entrega,
                            }

                            apiPutForm(`requisicion/${form.id}`, newForm, auth.access_token).then((response) => {
                                Swal.close()
                                handleClose('editar')
                                if (reload) {
                                    reload.reload()
                                }
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Guardado',
                                    text: 'Se ha guardado correctamente',
                                })
                            }
                            ).catch((error) => {
                                Swal.close()
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Ha ocurrido un error',
                                })
                                console.log(error)
                            })
                        } catch (error) {
                            console.log(error)
                        }
                    }
                })

            } else {
                try {
                    Swal.fire({
                        title: 'Guardando...',
                        allowOutsideClick: false,
                        onBeforeOpen: () => {
                            Swal.showLoading()
                        }
                    })
                    let newForm = {
                        id_departamento: form.departamento,
                        id_gasto: form.tipoGasto,
                        descripcion: form.descripcion,
                        id_subarea: form.tipoSubgasto,
                        id_pago: form.tipoPago,
                        id_solicitante: data.solicitante_id,
                        monto_pagado: form.monto,
                        cantidad: form.monto_solicitado,
                        autorizacion_1: form.auto1 ? form.auto1.id : null,
                        autorizacion_2: form.auto2 ? auth.user.id : null,
                        orden_compra: form.orden_compra,
                        fecha_pago: form.fecha_pago,
                        id_cuenta: form.id_cuenta,
                        /* id_estatus: form.id_estatus, */
                        id_proveedor: form.proveedor,
                        id_estatus_compra: form.compra,
                        id_estatus_factura: form.factura,
                        id_estatus_conta: form.conta,
                        fecha_entrega: form.fecha_entrega,
                    }

                    apiPutForm(`requisicion/${form.id}`, newForm, auth.access_token).then((response) => {
                        Swal.close()
                        handleClose('editar')
                        if (reload) {
                            reload.reload()
                        }
                        Swal.fire({
                            icon: 'success',
                            title: 'Guardado',
                            text: 'Se ha guardado correctamente',
                        })
                    }
                    ).catch((error) => {
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ha ocurrido un error',
                        })
                        console.log(error)
                    })
                } catch (error) {
                    console.log(error)
                }
            }
            
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Todos los campos son obligatorios',
            })
        }
    }

    const validateForm = () => {
        let valid = true
        let aux = {}
        if (form.fecha === '' || form.fecha === null) {
            valid = false
            aux.fecha = true
        }
        if (form.fecha_pago === '' || form.fecha_pago === null) {
            valid = false
            aux.fecha_pago = true
        }
        if (form.departamento === '' || form.departamento === null) {
            valid = false
            aux.departamento = true
        }
        if (form.tipoGasto === '' || form.tipoGasto === null) {
            valid = false
            aux.tipoGasto = true
        }
        if (form.tipoSubgasto === '' || form.tipoSubgasto === null) {
            valid = false
            aux.tipoSubgasto = true
        }
        if (form.tipoPago === '' || form.tipoPago === null) {
            valid = false
            aux.tipoPago = true
        }
        if (form.compra !== '' && form.compra !== null) {
            let pago = estatusCompras.find(item => item.id === form.compra)
            if (pago) {
                if (pago.estatus !== 'Rechazado' && pago.estatus !== 'RECHAZADO' && pago.estatus !== 'rechazado') {
                    if (form.monto === '' || form.monto === null || form.monto === 0) {
                        valid = false
                        aux.monto = true
                    }
                } else {
                    
                }
            }
        } else {
            if (form.monto === '' || form.monto === null || form.monto === 0) {
                valid = false
                aux.monto = true
            }
        }
        if (form.descripcion === '' || form.descripcion === null) {
            valid = false
            aux.descripcion = true
        }
        if (form.empresa === '' || form.empresa === null) {
            valid = false
            aux.empresa = true
        }
        if (form.proveedor === '' || form.proveedor === null) {
            valid = false
            aux.proveedor = true
        }
        if (form.compra === '' || form.compra === null) {
            valid = false
            aux.compra = true
        }
        if (form.factura === '' || form.factura === null) {
            valid = false
            aux.conta = true
        }
        if (form.tipoGasto === '' || form.tipoGasto === null) {
            valid = false
            aux.tipoGasto = true
        }
        if (form.tipoSubgasto === '' || form.tipoSubgasto === null) {
            valid = false
            aux.tipoSubgasto = true
        }
        if (form.tipoPago === '' || form.tipoPago === null) {
            valid = false
            aux.tipoPago = true
        }
        if (form.id_cuenta === '' || form.id_cuenta === null) {
            valid = false
            aux.id_cuenta = true
        }

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

    const handleMoney = (e) => {
        setForm({
            ...form,
            monto: e
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

    return (
        <>
            <div className={Style.container}>

                <div>
                    <InputLabel >Fecha de solicitud</InputLabel>
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
                            /* error={errores.fecha ? true : false} */
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                </div>

                <div>
                    <InputLabel className={`${errores.fecha_pago ? classes.error : ''}`} >Fecha de Pago</InputLabel>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                        <Grid container >
                            <KeyboardDatePicker

                                format="dd/MM/yyyy"
                                name="fecha_pago"
                                value={form.fecha_pago !== '' ? form.fecha_pago : null}
                                placeholder="dd/mm/yyyy"
                                onChange={e => handleChangeFecha(e, 'fecha_pago')}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            /* error={errores.fecha_pago ? true : false} */
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                </div>

                <div>
                    <TextField
                        label="N. Orden de compra"
                        name='orden_compra'
                        defaultValue={form.orden_compra}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleChange}
                        disabled
                    />
                </div>

                <div>
                    <CurrencyTextField
                        label="monto Solicitado"
                        variant="standard"
                        value={form.monto_solicitado}
                        currencySymbol="$"
                        outputFormat="number"
                        onChange={(event, value) => handleMoney(value)}
                        disabled
                    />
                </div>

                <div>
                    {departamentos.length > 0 ?
                        <>
                            <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                            <Select
                                value={form.departamento}
                                name="departamento"
                                onChange={handleChangeDepartamento}
                                className={classes.textField}
                                disabled
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
                    {departamentos.length && form.tipoGasto ?
                        <>
                            <InputLabel id="demo-simple-select-label">Tipo de Subgasto</InputLabel>
                            <Select
                                name="tipoSubgasto"
                                onChange={handleChange}
                                value={form.tipoSubgasto}
                                className={classes.textField}
                                error={errores.tipoSubgasto ? true : false}
                            >
                                {departamentos.find(item => item.id_area == form.departamento).partidas.find(item => item.id == form.tipoGasto).subpartidas.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                ))}

                            </Select>    
                        </>
                        : null

                    }
                    
                </div>

                <div>
                    {departamentos.length > 0 ?
                        <>
                            <InputLabel id="demo-simple-select-label">Tipo de Gasto</InputLabel>
                            <Select
                                value={form.tipoGasto}
                                name="tipoGasto"
                                onChange={handleChange}
                                className={classes.textField}
                                error={errores.tipoGasto ? true : false}
                            >
                                {departamentos.find(item => item.id_area == form.departamento).partidas.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                ))}

                            </Select>
                        </>
                        : null
                    }
                </div>

                <div>
                    <CurrencyTextField
                        label="monto pagado"
                        variant="standard"
                        value={form.monto}
                        currencySymbol="$"
                        outputFormat="number"
                        onChange={(event, value) => handleMoney(value)}
                        error={errores.monto ? true : false}
                    />
                </div>

                <div>
                    {
                        opciones ?
                            <>
                            <InputLabel id="demo-simple-select-label">Tipo de Pago</InputLabel>
                            <Select
                                name="tipoPago"
                                value={form.tipoPago}
                                onChange={handleChange}
                                className={classes.textField}
                                error={errores.tipoPago ? true : false}
                                >
                                    {opciones.tiposPagos.map((item, index) => (
                                    <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                ))}

                            </Select>    
                            </>
                            : null
                    }
                    
                </div>
                
                <div>
                    {
                        opciones ?
                            <>
                                <InputLabel id="demo-simple-select-label">Empresa</InputLabel>
                                <Select
                                    name="empresa"
                                    value={form.empresa}
                                    onChange={handleChange}
                                    className={classes.textField} 
                                    error={errores.empresa ? true : false}
                                >
                                    {opciones.empresas.map((item, index) => (
                                        <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                    ))}
                                </Select>

                            </>
                            : null
                    }
                </div>

                <div>
                    {
                        opciones && form.empresa !== "" ?
                            <>
                                {/* <InputLabel id="demo-simple-select-label">Cuenta de salida</InputLabel>
                                <Select
                                    name="id_cuenta"
                                    value={form.id_cuenta}
                                    onChange={handleChange}
                                    className={classes.textField}
                                    error={errores.id_cuenta ? true : false}
                                >
                                    {opciones.empresas.find(item => item.value == form.empresa).cuentas.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                    ))}
                                    
                                </Select> */}
                                <InputLabel>Cuenta de salida</InputLabel>
                                <Autocomplete
                                    name="cuenta"
                                    options={opciones.empresas.find(item => item.value == form.empresa).cuentas}
                                    getOptionLabel={(option) => option.nombre}
                                    style={{ width: 230, paddingRight: '1rem' }}
                                    onChange={(event, value) => handleChangeCuenta(event, value)}
                                    renderInput={(params) => <TextField {...params} label={form.labelCuenta} variant="outlined" />}
                                />
                            </>
                            : opciones ?
                                <>
                                    <InputLabel id="demo-simple-select-label">Cuenta de Salida</InputLabel>
                                    <Select
                                        name="id_cuenta"
                                        value={form.id_cuenta}
                                        onChange={handleChange}
                                        className={classes.textField}
                                        error={errores.id_cuenta ? true : false}
                                    >
                                        {opciones.cuentas.map((item, index) => {
                                            if (item.value == form.id_cuenta) {
                                                return <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                            }
                                        })}

                                    </Select>
                                </>
                                : null
                    }
                </div>

                <div>
                    {
                        estatusCompras ?
                            <>
                                <InputLabel id="demo-simple-select-label">Estatus de pago</InputLabel>
                                <Select
                                    name="conta"
                                    value={form.conta}
                                    onChange={handleChange}
                                    className={classes.textField}
                                    error={errores.compra ? true : false}
                                >
                                    {estatusCompras.map((item, index) => {
                                        if (item.nivel === 2) {
                                            return <MenuItem key={index} value={item.id}>{item.estatus}</MenuItem>
                                        }
                                    })}
                                </Select>
                            </>
                            : null
                    }

                </div>

                <div>
                    {
                        estatusCompras ?
                            <>
                                <InputLabel >Estatus de facturación</InputLabel>
                                <Select
                                    name="factura"
                                    value={form.factura}
                                    onChange={handleChange}
                                    className={classes.textField}
                                    error={errores.conta ? true : false}
                                >
                                    {estatusCompras.map((item, index) => {
                                        if (item.nivel === 3) {
                                            return <MenuItem key={index} value={item.id}>{item.estatus}</MenuItem>
                                        }
                                    })}
                                </Select>
                            </>
                            : null
                    }

                </div>

                <div>
                    {
                        opciones ?
                            <>
                                <InputLabel id="demo-simple-select-label">Proveedor</InputLabel>
                                <Select
                                    name="proveedor"
                                    value={form.proveedor}
                                    onChange={handleChange}
                                    className={classes.textField}
                                    disabled
                                    error={errores.proveedor ? true : false}
                                >
                                    {opciones.proveedores.map((item, index) => (
                                        <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                    ))}

                                </Select>
                            </>
                            : null
                    }

                </div>

                {/* <div>
                    <InputLabel id="demo-simple-select-label">Aprobar Requsición</InputLabel>
                    <Checkbox
                        checked={form.auto2}
                        onChange={handleAprueba}
                        name="auto2"
                        color="primary"
                        style={{ marginLeft: '20%' }}
                    />
                </div> */}

                <div>
                    <TextField
                        name='descripcion'
                        label="Descripción"
                        type="text"
                        defaultValue={form.descripcion}
                        onChange={handleChange}
                        multiline
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>

            </div>
            <div className="row justify-content-end">
                <div className="col-md-4">
                    <button className={Style.sendButton} onClick={handleSave}>Editar</button>
                </div>
            </div>
        </>
        )
        
}