import React, { useState } from 'react'
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

export default function NuevoGasto(props) {
    const { reload, handleClose, vehiculo } = props
    const authUser = useSelector(state => state.authUser)
    const opcionesAreas = useSelector(state => state.opciones.areas)
    const [form, setForm] = useState({
        id_vehiculo: vehiculo.id,
        fecha: new Date(),
        kilometros: '',
        fecha_servicio: '',
        trabajo_realizado: '',
        costo: '',
        no_factura: '',
        observaciones: '',
        autorizacion_1: authUser.user.id,
        estatus: 0,
    })
    const [errores, setErrores] = useState({})

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
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
            costo: e
        })
    }

    const validate = () => {
        let errores = {}
        let valid = true
        if (form.fecha === '') {
            valid = false
            errores.fecha = 'Este campo es requerido'
        }
        if (form.fecha_servicio === '') {
            valid = false
            errores.fecha_servicio = 'Este campo es requerido'
        }
        if (form.trabajo_realizado === '') {
            valid = false
            errores.trabajo_realizado = 'Este campo es requerido'
        }
        if (form.costo === '') {
            valid = false
            errores.costo = 'Este campo es requerido'
        }
        if (form.observaciones === '') {
            valid = false
            errores.observaciones = 'Este campo es requerido'
        }
        setErrores(errores)
        return valid
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            Swal.fire({
                title: 'Nuevo gasto',
                text: "¿Estas seguro de crear este gasto?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Crear'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Creando gasto',
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
                        apiPostForm('servicios', form, authUser.access_token)
                            .then(res => {
                                Swal.close()
                                console.log(res)
                                Swal.fire({
                                    title: 'Nuevo gasto creado',
                                    text: "El gasto se ha creado correctamente",
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
                                    text: "Ha ocurrido un error al crear el gasto",
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
    console.log(errores)

    return (
        <>
            <div className={Style.container}>
                <div>
                    <div>
                        <InputLabel id="fecha_poliza">Fecha</InputLabel>
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
                                    error={errores.fecha ? true : false}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>
                    <div>
                        <InputLabel id="fecha_poliza">Fecha de servicio</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker
                                    format="dd/MM/yyyy"
                                    name="fecha_servicio"
                                    value={form.fecha_servicio !== '' ? form.fecha_servicio : null}
                                    placeholder="dd/mm/yyyy"
                                    onChange={e => handleChangeFecha(e, 'fecha_servicio')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    error={errores.fecha_servicio ? true : false}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>
                    <div>
                        <InputLabel id="kilometros">Kilometros</InputLabel>
                        <TextField
                            id="kilometros"
                            name="kilometros"
                            type="number"
                            value={form.kilometros}
                            onChange={handleChange}
                            error={errores.kilometros ? true : false}
                        />
                    </div>
                    <div>
                        <InputLabel>Concepto</InputLabel>
                        <TextField
                            name="trabajo_realizado"
                            value={form.trabajo_realizado}
                            onChange={handleChange}
                            error={errores.trabajo_realizado ? true : false}
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <InputLabel>Costo</InputLabel>
                        <CurrencyTextField
                            variant="standard"
                            value={form.costo}
                            currencySymbol="$"
                            outputFormat="number"
                            onChange={(event, value) => handleMoney(value)}
                            error={errores.costo ? true : false}
                        />
                    </div>
                    <div>
                        <InputLabel>No. de factura</InputLabel>
                        <TextField
                            name="no_factura"
                            value={form.no_factura}
                            onChange={handleChange}
                            error={errores.no_factura ? true : false}
                        />
                    </div>
                    <div>
                        <InputLabel >Autorización</InputLabel>
                        <TextField
                            name="autorizacion_1"
                            value={authUser.user.name}
                            onChange={handleChange}
                            disabled
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <InputLabel >Estatus</InputLabel>
                        <Select
                            name="estatus"
                            value={form.estatus}
                            onChange={handleChange}
                            error={errores.estatus ? true : false}
                        >
                            <MenuItem value={0}>Pendiente</MenuItem>
                            <MenuItem value={1}>Pagado</MenuItem>
                        </Select>
                    </div>
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