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

export default function VerOperador(props) {
    const { reload, handleClose, vehiculos, operador } = props
    console.log(props)
    const authUser = useSelector(state => state.authUser)
    const [form, setForm] = useState({
        id_vehiculo: operador.data.id_vehiculo,
        usuario: operador.data.user.empleado_id,
        licencia: operador.licencia,
        fecha_vigencia: new Date(operador.data.fecha_vigencia),
        fecha_vencimiento: new Date(operador.data.fecha_vencimiento),
        observaciones: operador.data.observaciones,
    })
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

    return (
        <>
            <div className={Style.container}>
                <div>
                    <div>
                        <InputLabel>Selecciona el vehiculo</InputLabel>
                        <Select
                            value={form.id_vehiculo}
                            disabled
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
                            value={form.usuario}
                            disabled
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
                            value={form.licencia}
                            disabled
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
                                    value={form.fecha_vencimiento !== '' ? form.fecha_vencimiento : null}
                                    placeholder="dd/mm/yyyy"
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    disabled
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
                                    value={form.fecha_vigencia !== '' ? form.fecha_vigencia : null}
                                    placeholder="dd/mm/yyyy"
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    disabled
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>
                </div>

                <div>
                    <div>
                        <InputLabel >Observaciones</InputLabel>
                        <TextField
                            value={form.observaciones}
                            maxRows={4}
                            multiline
                            disabled
                        />
                    </div>
                </div>
            </div>
        </>
    )
}