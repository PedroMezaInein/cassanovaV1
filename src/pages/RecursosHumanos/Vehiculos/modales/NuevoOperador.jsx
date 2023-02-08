import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { apiGet, apiPostForm } from '../../../../functions/api'

import Style from './NuevoVehiculo.module.css'
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'

import Swal from 'sweetalert2'

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

export default function NuevoOperador(props) {
    const { reload, handleClose, vehiculos } = props
    const authUser = useSelector(state => state.authUser)
    const [form, setForm] = useState({
        id_vehiculo: '',
        usuario: '',
        licencia: '',
        fecha_vigencia: '',
        fecha_vencimiento: '',
        observaciones: '',
    })
    const [errores, setErrores] = useState({})
    const [opcionesVehiculos, setOpcionesVehiculos] = useState(false)

    useEffect(() => {
        getOptions()
    }, [])

    const getOptions = () => {
        Swal.fire({
            title: 'Cargando',
            text: 'Espere un momento',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        })
        try {
            apiGet('vehiculos/options', authUser.access_token)
                .then(res => {
                    let colaboradores = res.data.colaboradores.map(colaborador => {
                        return colaborador
                    })
                    colaboradores.sort((a, b) => {
                        if (a.nombre < b.nombre) { return -1 }
                        if (a.nombre > b.nombre) { return 1 }
                        return 0
                    })
                    setOpcionesVehiculos(colaboradores)
                    Swal.close()
                })
                .catch(err => {
                    Swal.close()
                })

        } catch (error) {

        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    /* const handleMoney = (e) => {
        setForm({
            ...form,
            costo: e
        })
    } */

    const validate = () => {
        let errores = {}
        let valid = true
        if (form.usuario === '') {
            valid = false
            errores.usuario = 'El campo es obligatorio'
        }
        if (form.licencia === '') {
            valid = false
            errores.licencia = 'El campo es obligatorio'
        }
        if (form.fecha_vigencia === '') {
            valid = false
            errores.fecha_vigencia = 'El campo es obligatorio'
        }
        if (form.fecha_vencimiento === '') {
            valid = false
            errores.fecha_vencimiento = 'El campo es obligatorio'
        }

        setErrores(errores)
        return valid
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            Swal.fire({
                title: 'Nuevo Operador',
                text: "¿Deses crear un nuevo operador?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Crear'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Creando operador',
                        text: "Por favor, espera un momento",
                        icon: 'info',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                        showConfirmButton: false,
                        onBeforeOpen: () => {
                            Swal.showLoading()
                        }
                    })

                    try {
                        apiPostForm('servicios/asignacion', form, authUser.access_token)
                            .then(res => {
                                Swal.close()
                                console.log(res)
                                Swal.fire({
                                    title: 'Nuevo Operador creado',
                                    text: "El nuevo operador ha sido creado correctamente",
                                    icon: 'success',
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: 'Ok'
                                })
                                handleClose()
                                if (reload) {
                                    reload.reload()
                                }
                            })
                            .catch(err => {
                                Swal.close()
                                Swal.fire({
                                    title: 'Error',
                                    text: "Ha ocurrido un error al crear el operador",
                                    icon: 'error',
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: 'Ok'
                                })

                                console.log(err)
                            })
                    } catch (error) {

                    }
                }
            })
        } else {
            Swal.fire({
                title: 'Error',
                text: "Por favor, llena todos los campos",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok'
            })
        }
    }
    console.log(form)

    return (
        <>
            <div className={Style.container}>
                <div>
                    <div>
                        <InputLabel>Selecciona el vehiculo</InputLabel>
                        <Select
                            name="id_vehiculo"
                            value={form.id_vehiculo}
                            onChange={handleChange}
                            error={errores.id_vehiculo ? true : false}
                        >
                            {
                                vehiculos.map((item, index) => {
                                    return <MenuItem key={index} value={item.id}>{`${item.marca} ${item.modelo} - ${item.placas}`}</MenuItem>
                                })
                            }
                        </Select>
                    </div>
                    <div>
                        <InputLabel>Operador</InputLabel>
                        <Select
                            
                            name="usuario"
                            value={form.usuario}
                            onChange={handleChange}
                            error={errores.usuario ? true : false}
                        >
                            {
                                opcionesVehiculos ? opcionesVehiculos.map((usuario, index) => {
                                    if (usuario.estatus_empleado === 'Activo') {

                                        if (usuario.apellido_paterno && usuario.apellido_materno) {
                                            return <MenuItem key={index} value={usuario.id}>{`${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno}`}</MenuItem>
                                        } else {
                                            return <MenuItem key={index} value={usuario.id}>{usuario.nombre}</MenuItem>
                                        }
                                    }

                                }) : null
                            }
                        </Select>
                    </div>
                    <div>
                        <InputLabel>No. Licencia</InputLabel>
                        <TextField
                            name="licencia"
                            value={form.licencia}
                            onChange={handleChange}
                            error={errores.licencia ? true : false}
                        />
                    </div>
                </div>

                <div>
                    <div>
                        <InputLabel>Fecha Vigencia</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker
                                    format="dd/MM/yyyy"
                                    name="fecha_vencimiento"
                                    value={form.fecha_vencimiento !== '' ? form.fecha_vencimiento : null}
                                    placeholder="dd/mm/yyyy"
                                    onChange={e => handleChangeFecha(e, 'fecha_vencimiento')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    error={errores.fecha_vencimiento ? true : false}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>

                    <div>
                        <InputLabel>Fecha Vencimiento</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker
                                    format="dd/MM/yyyy"
                                    name="fecha_vigencia"
                                    value={form.fecha_vigencia !== '' ? form.fecha_vigencia : null}
                                    placeholder="dd/mm/yyyy"
                                    onChange={e => handleChangeFecha(e, 'fecha_vigencia')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    error={errores.fecha_vigencia ? true : false}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>
                </div>

                <div>
                    <div>
                        <InputLabel >Observaciones</InputLabel>
                        <TextField
                            name="observaciones"
                            value={form.observaciones}
                            onChange={handleChange}
                            error={errores.observaciones ? true : false}
                            maxRows={4}
                            multiline
                        />
                    </div>
                </div>
            </div>

            <div className="row justify-content-end">
                <div className="col-md-4">
                    <button className={Style.sendButton} type="submit" onClick={handleSubmit}>Crear</button>
                </div>
            </div>
        </>
    )
}