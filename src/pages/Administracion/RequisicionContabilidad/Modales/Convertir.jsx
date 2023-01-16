import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { apiOptions, apiPutForm } from '../../../../functions/api'

import { setOptions } from '../../../../functions/setters'

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';

import Swal from 'sweetalert2'

import Style from './AprobarSolicitud.module.css'

const useStyles = makeStyles((theme) => ({
    textField: {
        width: '75%',
    },
}));

export default function Convertir(props) {
    const { data, handleClose, reload } = props
    console.log(props)
    const departamentos = useSelector(state => state.opciones.areas)
    const [opciones, setOpciones] = useState(false)
    const auth = useSelector(state => state.authUser)
    const [form, setForm] = useState({
        fecha: data.fecha,
        departamento: data.departamento_id,
        tipoGasto: data.tipoEgreso_id,
        tipoSubgasto: data.tipoSubEgreso_id,
        tipoPago: data.tipoPago_id,
        monto: data.monto,
        descripcion: data.descripcion,
        id: data.id,
        orden_compra: data.orden_compra,
        fecha_pago: data.fecha_pago,
        id_cuenta: data.cuenta ? data.cuenta.id : null,
        monto_solicitado: data.monto_solicitado,
        auto1: data.auto1 ? data.auto1 : false,
        auto2: data.auto2 ? data.auto2 : false,
        auto3: data.auto3 ? data.auto3 : false,
        id_estatus: data.id_estatus,
        proveedor: data.proveedor,
        estatus_compra: data.estatus_compra,
        estatus_conta: data.estatus_conta,
    })
    const [estatusCompras, setEstatusCompras] = useState(false)
    const classes = useStyles();

    useEffect(() => {
        getOptions()
    }, [])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const getOptions = () => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        })

        apiOptions(`v2/proyectos/compras`, auth.access_token).then(
            (response) => {
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras, proyectos, proveedores, formasPago, metodosPago, estatusFacturas, cuentas } = response.data
                let aux = {}
                /* aux.empresas = setOptions(empresas, 'name', 'id') */
                aux.proveedores = setOptions(proveedores, 'razon_social', 'id')
                /* aux.areas = setOptions(areas, 'nombre', 'id')
                aux.proyectos = setOptions(proyectos, 'nombre', 'id') */
                aux.tiposPagos = setOptions(tiposPagos, 'tipo', 'id')
                /* aux.tiposImpuestos = setOptions(tiposImpuestos, 'tipo', 'id')
                aux.estatusCompras = setOptions(estatusCompras, 'estatus', 'id')
                aux.estatusFacturas = setOptions(estatusFacturas, 'estatus', 'id')
                aux.formasPago = setOptions(formasPago, 'nombre', 'id')
                aux.metodosPago = setOptions(metodosPago, 'nombre', 'id') */
                aux.cuentas = setOptions(cuentas, 'nombre', 'id')
                setEstatusCompras(estatusCompras)
                setOpciones(aux)
                Swal.close()
            }, (error) => { }
        ).catch((error) => { })
    }

    const handleChangeDepartamento = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
            tipoGasto: null,
            tipoSubgasto: null
        })
    }

    const aprobar = () => {
        if (form.auto2) {
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
                            monto_pagado: form.monto,
                            cantidad: form.monto_solicitado,
                            autorizacion_1: form.auto1 ? form.auto1.id: null,
                            autorizacion_2: form.auto2 ? auth.user.id : null,
                            orden_compra: form.orden_compra,
                            fecha_pago: form.fecha_pago,
                            id_cuenta: form.id_cuenta,
                            id_estatus: form.id_estatus,
                            id_proveedor: form.proveedor,
                            id_estatus_compra: form.estatus_compra,
                            id_estatus_conta: form.estatus_conta,
                        }
                        apiPutForm(`requisicion/${form.id}`, newForm, auth.access_token).then(
                            (response) => {
                                handleClose('convertir')
                                if (reload) {
                                    reload.reload()
                                }
                                reload()
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
                    } else {
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
        if (e.target.name === 'auto2') {
            setForm({
                ...form,
                auto2: !form.auto2
            })
        }
    }

    console.log(form)
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
                        disabled
                    />
                </div>

                <div>
                    <TextField
                        label="Fecha de Pago"
                        type="date"
                        name='fecha_pago'
                        defaultValue={form.fecha_pago}
                        className={classes.textField}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    /> 
                </div>

                <div>
                    <TextField
                        label="N. Orden de compra"
                        name='orden_compra'
                        defaultValue={form.orden_compra}
                        className={classes.textField}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <TextField
                        name='monto'
                        label="Monto De pago"
                        type="number"
                        defaultValue={form.monto}
                        onChange={handleChange}
                        className={classes.textField}
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
                                disabled
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
                                disabled
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
                        opciones ?
                            <>
                                <InputLabel id="demo-simple-select-label">Cuenta de Salida</InputLabel>
                                <Select
                                    name="id_cuenta"
                                    value={form.id_cuenta}
                                    onChange={handleChange}
                                    className={classes.textField}
                                >
                                    {opciones.cuentas.map((item, index) => (
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
                                <InputLabel id="demo-simple-select-label">Estatus de pago</InputLabel>
                                <Select
                                    name="estatus_compra"
                                    value={form.estatus_compra}
                                    onChange={handleChange}
                                    className={classes.textField}
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
                                <InputLabel id="demo-simple-select-label">Estatus de facturación</InputLabel>
                                <Select
                                    name="estatus_conta"
                                    value={form.estatus_conta}
                                    onChange={handleChange}
                                    className={classes.textField}
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
                        checked={form.auto2}
                        onChange={handleAprueba}
                        name="auto2"
                        color="primary"
                        style={{ marginLeft: '20%' }}
                    />
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
                    <button onClick={aprobar}>Convertir</button>
                </div>

            </div>
        </>
    )
}