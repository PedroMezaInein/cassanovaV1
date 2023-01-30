import React, {useState} from 'react'
import { useSelector } from 'react-redux'

import {apiPutForm} from '../../../../functions/api'

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Swal from 'sweetalert2'

import Style from './AprobarSolicitud.module.css'
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
    textField: {
        width: '75%',
    },
}));

export default function Editar(props) {
    const { data, handleClose, reload, opciones, estatusCompras } = props
    const departamentos = useSelector(state => state.opciones.areas)
    const auth = useSelector(state => state.authUser)
    const [form, setForm] = useState({
        fecha: data.fecha,
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
        fecha_entrega: data.fecha_entrega,
        empresa: "",

    })

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

    const handleSave = () => {
        Swal.fire({
            title: 'Guardando...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        })
        if (validateForm()) {
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
                    monto_pagado: form.monto_pagado,
                    cantidad: form.monto,
                    autorizacion_1: form.auto1 ? auth.user.id : null,
                    autorizacion_2: form.auto2 ? form.auto2.id : null,
                    orden_compra: data.orden_compra,
                    fecha_pago: data.fecha_pago,
                    id_cuenta: form.id_cuenta,
                    id_estatus: form.id_estatus,
                    id_proveedor: form.proveedor,
                    fecha_entrega: form.fecha_entrega,
                }

                apiPutForm(`requisicion/${form.id}`, newForm, auth.access_token).then(
                    (response) => {
                        handleClose('editar')
                        if (reload) {
                            reload.reload()
                        }
                        Swal.close()
                        Swal.fire({
                            icon: 'success',
                            title: 'Guardado',
                            text: 'Se ha guardado correctamente',
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
            } catch (error) {
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error',
                })
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
        if (form.fecha === '' || form.fecha === null) {
            valid = false
        }
        if (form.departamento === '' || form.departamento === null) {
            valid = false
        }
        if (form.tipoGasto === '' || form.tipoGasto === null) {
            valid = false
        }
        if (form.tipoSubgasto === '' || form.tipoSubgasto === null) {
            valid = false
        }
        if (form.tipoPago === '' || form.tipoPago === null) {
            valid = false
        }
        if (form.monto === '' || form.monto === null) {
            valid = false
        }
        if (form.descripcion === '' || form.descripcion === null) {
            valid = false
        }
        return valid

    }

    const handleAprueba = (e) => {
        console.log(e.target.name)
        if (e.target.name === 'auto1') {
            setForm({
                ...form,
                auto1: !form.auto1
            })
        }
    }

    console.log(opciones)

    return (
        <>
            <div className={Style.container}>

                <div>
                    <TextField
                        label="Fecha de solicitud"
                        type="date"
                        name='fecha'
                        defaultValue={form.fecha}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>

                <div>
                    <TextField
                        name='fecha_entrega'
                        label="Fecha de entrega"
                        type="date"
                        defaultValue={form.fecha_entrega}
                        onChange={handleChange}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>

                <div>
                    <TextField
                        name='monto'
                        label="Monto solicitado"
                        type="number"
                        defaultValue={form.monto}
                        onChange={handleChange}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
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

                <div>
                    <InputLabel id="demo-simple-select-label">Aprobar Requsición</InputLabel>
                    <Checkbox
                        checked={form.auto1}
                        onChange={handleAprueba}
                        name="auto1"
                        color="primary"
                        style={{ marginLeft: '20%' }}
                    />
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
                </div>

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

                <div className={Style.btnAprobar}>
                    <button onClick={handleSave}>Guardar</button>
                </div>

            </div>
        </>
        )
        
}