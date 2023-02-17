import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { apiPutForm } from '../../../../functions/api'

import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'
import Grid from '@material-ui/core/Grid';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import Swal from 'sweetalert2'

import Style from './AprobarSolicitud.module.css'

const useStyles = makeStyles((theme) => ({
    textField: {
        width: '75%',
    },
}));

export default function Convertir(props) { 
    const { data, handleClose, reload, opciones, estatusCompras } = props
    const departamentos = useSelector(state => state.opciones.areas)
    const auth = useSelector(state => state.authUser)
    const [form, setForm] = useState({
        fecha: new Date(data.fecha),
        departamento: data.departamento_id,
        tipoGasto: data.tipoEgreso_id,
        tipoSubgasto: data.tipoSubEgreso_id,
        tipoPago: data.tipoPago_id,
        monto: data.monto_solicitado,
        monto_pagado: data.monto,
        descripcion: data.descripcion,
        id: data.id,
        id_cuenta: data.cuenta ? data.cuenta.id : null,
        auto1: data.auto1 ? data.auto1 : false,
        auto2: data.auto2 ? data.auto2 : false,
        auto3: data.auto3 ? data.auto3 : false,
        id_estatus: data.id_estatus,
        checked: data.auto1 ? true : false,
        proveedor: data.proveedor,
        fecha_entrega: data.fecha_entrega ? new Date(data.fecha_entrega) : '',
        empresa: "",
        conta: data.conta,
        factura: data.factura,
    })
    const [errores, setErrores] = useState({})

    const classes = useStyles();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    const handleChangeDepartamento = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
            tipoGasto: null,
            tipoSubgasto: null
        })
    }

    const validateForm = () => {
        let valid = true
        let errores = []
        if (!form.departamento === '') {
            valid = false
            errores.departamento = 'Selecciona un departamento'
        }
        if (!form.tipoGasto === '') {
            valid = false
            errores.tipoGasto = 'Selecciona un tipo de gasto'
        }
        if (!form.tipoSubgasto === '') {
            valid = false
            errores.tipoSubgasto = 'Selecciona un tipo de subgasto'
        }
        if (!form.tipoPago === '') {
            valid = false
            errores.tipoPago = 'Selecciona un tipo de pago'
        }
        if (!form.monto === '') {
            valid = false
            errores.monto = 'Ingresa un monto'
        }
        if (!form.monto_pagado === '') {
            valid = false
            errores.monto_pagado = 'Ingresa un monto pagado'
        }
        if (!form.descripcion === '') {
            valid = false
            errores.descripcion = 'Ingresa una descripción'
        }
        setErrores(errores)
        return valid
    }

    const aprobar = () => {
        if (form.auto1) {
            Swal.fire({
                title: '¿Estas seguro de aprobar esta solicitud?',
                text: "Confirma los datos antes de continuar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, aprobar!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    if (validateForm()) {
                        Swal.fire({
                            title: 'Aprobando...',
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
                            monto_pagado: form.monto_pagado,
                            cantidad: form.monto,
                            autorizacion_1: form.auto1 && form.auto1.id ? form.auto1.id : form.auto1,
                            autorizacion_2: form.monto === data.monto_solicitado ? form.auto2 ? form.auto2.id : null : null,
                            orden_compra: data.orden_compra,
                            fecha_pago: data.fecha_pago,
                            id_cuenta: form.id_cuenta,
                            id_estatus_compra: form.id_estatus,
                            id_proveedor: form.proveedor,
                            fecha_entrega: form.fecha_entrega,
                            autorizacion_compras: true,
                            id_estatus_factura: form.factura,
                            id_estatus_conta: form.conta,
                        }
                        apiPutForm(`requisicion/${form.id}`, newForm, auth.access_token).then(
                            (response) => {
                                Swal.close()
                                handleClose('convertir')
                                if (reload) {
                                    reload.reload()
                                }
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Aprobado!',
                                    text: 'Se ha aprobado correctamente',
                                    timer: 2000,
                                    timerProgressBar: true,
                                })
                            }, (error) => { }
                        ).catch((error) => {
                            Swal.close()
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Ha ocurrido un error',
                            })
                        })
                    } else {
                        Swal.close()
                        Swal.fire(
                            'Error!',
                            'Faltan datos por llenar',
                            'error'
                        )
                    }
                }
            })
        } else {
            Swal.fire({
                title: 'Requisición no autorizada!',
                text: 'Debes aprobar la requisición para poder convertirla',
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok',
            })
        }
    }

    const handleAprueba = (e) => {
        if (e.target.name === 'auto1') {
            setForm({
                ...form,
                auto1: auth.user.id,
                checked: !form.checked
            })
        }
    }

    const handleMoney = (e) => {
        setForm({
            ...form,
            monto: e
        })
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
                    <InputLabel >Fecha de entrega</InputLabel>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                        <Grid container >
                            <KeyboardDatePicker

                                format="dd/MM/yyyy"
                                name="fecha_entrega"
                                value={form.fecha_entrega !== '' ? form.fecha_entrega : null}
                                placeholder="dd/mm/yyyy"
                                onChange={e => handleChangeFecha(e, 'fecha_entrega')}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            /* error={errores.fecha_entrega ? true : false} */
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                </div>

                <div>
                    <CurrencyTextField
                        label="monto"
                        variant="standard"
                        value={form.monto}
                        currencySymbol="$"
                        outputFormat="number"
                        onChange={(event, value) => handleMoney(value)}
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
                    {departamentos.length > 0 ?
                        <>
                            <InputLabel id="demo-simple-select-label">Tipo de Gasto</InputLabel>
                            <Select
                                value={form.tipoGasto}
                                name="tipoGasto"
                                onChange={handleChange}
                                
                                className={classes.textField}
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
                    {departamentos.length && form.tipoGasto ?
                        <>
                            <InputLabel id="demo-simple-select-label">Tipo de Subgasto</InputLabel>
                            <Select
                                name="tipoSubgasto"
                                onChange={handleChange}
                                value={form.tipoSubgasto}
                                className={classes.textField}
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
                    {
                        opciones ?
                            <>
                                <InputLabel id="demo-simple-select-label">Tipo de Pago</InputLabel>
                                <Select
                                    name="tipoPago"
                                    value={form.tipoPago}
                                    onChange={handleChange}
                                    className={classes.textField}
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
                        estatusCompras ?
                            <>
                                <InputLabel id="demo-simple-select-label">Estatus de entrega</InputLabel>
                                <Select
                                    name="id_estatus"
                                    value={form.id_estatus}
                                    onChange={handleChange}
                                    className={classes.textField}
                                >
                                    {estatusCompras.map((item, index) => {
                                        if (item.nivel === 1) {
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
                                >
                                    {opciones.proveedores.map((item, index) => (
                                        <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                    ))}

                                </Select>
                            </>
                            : null
                    }

                </div>

{/*                 <div>
                    {
                        opciones ?
                            <>
                                <InputLabel id="demo-simple-select-label">Empresa</InputLabel>
                                <Select
                                    name="empresa"
                                    value={form.empresa}
                                    onChange={handleChange}
                                    className={classes.textField}
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
                                <InputLabel id="demo-simple-select-label">Cuenta de salida</InputLabel>
                                <Select
                                    name="id_cuenta"
                                    value={form.id_cuenta}
                                    onChange={handleChange}
                                    className={classes.textField}
                                >
                                    {opciones.empresas.find(item => item.value == form.empresa).cuentas.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                    ))}
                                </Select>
                            </>
                            : opciones ?
                                <>
                                    <InputLabel id="demo-simple-select-label">Cuenta de Salida</InputLabel>
                                    <Select
                                        name="id_cuenta"
                                        value={form.id_cuenta}
                                        onChange={handleChange}
                                        className={classes.textField}
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
                </div> */}

                <div>
                    <TextField
                        name='descripcion'
                        label="Descripción"
                        type="text"
                        defaultValue={form.descripcion}
                        onChange={handleChange}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>

                <div>
                    <InputLabel id="demo-simple-select-label">Aprobar Requsición</InputLabel>
                    <Checkbox
                        checked={form.checked}
                        onChange={handleAprueba}
                        name="auto1"
                        color="primary"
                        style={{marginLeft: '20%'}}
                    />
                </div>

                {/* <div className={Style.btnAprobar}>
                    <button onClick={aprobar}>Convertir</button>
                </div> */}

            </div>

            <div className="row justify-content-end">
                <div className="col-md-4">
                    <button className={Style.sendButton} onClick={aprobar}>Convertir</button>
                </div>
            </div>
        </>
    )
}