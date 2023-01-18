import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { apiOptions, apiPutForm, apiPostForm } from '../../../../functions/api'

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
    const { data, handleClose, reload} = props
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
        monto: data.monto_solicitado,
        monto_pagado: data.monto,
        descripcion: data.descripcion,
        id: data.id,
        auto1: data.auto1 ? data.auto1 : false,
        auto2: data.auto2 ? data.auto2 : false,
        auto3: data.auto3 ? data.auto3 : false,
        id_estatus: data.id_estatus,
        checked: data.auto1 ? true : false,
        proveedor: data.proveedor,
        fecha_entrega: data.fecha_entrega,
    })
    const [estatusCompras, setEstatusCompras] = useState(false)
    const [errores, setErrores] = useState({})

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
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras, proyectos, proveedores, formasPago, metodosPago, estatusFacturas } = response.data
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
                            autorizacion_2: form.auto2 ? form.auto2.id : null,
                            orden_compra: data.orden_compra,
                            fecha_pago: data.fecha_pago,
                            id_cuenta: data.cuenta? data.cuenta.id : null,
                            id_estatus: form.id_estatus,
                            id_proveedor: form.proveedor,
                            fecha_entrega: form.fecha_entrega,
                        }
                        apiPutForm(`requisicion/${form.id}`, newForm, auth.access_token).then(
                            (response) => {
                                handleClose('convertir')
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

    const handleAprueba = (e) => {
        console.log(e.target.name)
        if (e.target.name === 'auto1') {
            setForm({
                ...form,
                auto1: auth.user.id,
                checked: !form.checked
            })
        }
    }

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
                        checked={form.checked}
                        onChange={handleAprueba}
                        name="auto1"
                        color="primary"
                        style={{marginLeft: '20%'}}
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