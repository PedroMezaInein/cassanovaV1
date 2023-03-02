import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'

import Swal from 'sweetalert2'
import { apiGet, apiPutForm } from '../../../../functions/api'

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

import Style from './TicketsTi.module.css'

export default function Editar(props) {
    const { data, reload, handleClose } = props
    const authUser = useSelector(state => state.authUser)
    const [form, setForm] = useState({
        fecha: new Date(),
        fecha_servicio: '',
        tipo: '',
        estatus: '',
        descripcion: '',
        autorizacion:'',
    })
    const [errores, setErrores] = useState({})

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleEnter = e => {
        if (e.key === 'Enter') {
            if (form.funcionalidad !== '') {
                setForm({
                    ...form,
                    funcionalidades: [...form.funcionalidades, {
                        funcionalidad: form.funcionalidad,
                        estatus: 0,
                        user: []
                    }],
                    funcionalidad: ''
                })
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'No puedes agregar una funcionalidad vacía',
                })
            }
        }
    }

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    const handleDelete = (index) => {
        setForm({
            ...form,
            funcionalidades: form.funcionalidades.filter((item, i) => i !== index)
        })
    }

    console.log(form)

    return (
        <>
            <div className={Style.container}>
                <div>
                    <div>
                        <InputLabel id="fecha_poliza">Fecha de solicitud</InputLabel>
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
                                    disabled
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>
                    <div>
                        <InputLabel id="fecha_poliza">Fecha de Servicio</InputLabel>
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
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>



                </div>
                <div>
                    <div>
                        <InputLabel>Tipo</InputLabel>
                        <Select
                            name="tipo"
                            value={form.tipo}
                            onChange={handleChange}
                            error={errores.estatus ? true : false}
                        >
                            <MenuItem value={0}>cambio</MenuItem>
                            <MenuItem value={1}>soporte</MenuItem>
                            <MenuItem value={2}>mejora</MenuItem>
                            <MenuItem value={3}>reporte</MenuItem>
                            <MenuItem value={4}>información</MenuItem>
                            <MenuItem value={5}>capacitación</MenuItem>
                            <MenuItem value={6}>servicio</MenuItem>
                            <MenuItem value={7}>proyecto</MenuItem>

                        </Select>
                    </div>
                    <div>
                        <InputLabel>Estatus</InputLabel>
                        <Select
                            name="estatus"
                            value={form.estatus}
                            onChange={handleChange}
                            error={errores.estatus ? true : false}
                        >
                            <MenuItem value={0}>Solicitado</MenuItem>
                            <MenuItem value={1}>Autorizado</MenuItem>
                            <MenuItem value={2}>En desarrollo</MenuItem>
                            <MenuItem value={3}>Terminado</MenuItem>
                            <MenuItem value={4}>Cancelado</MenuItem>
                            <MenuItem value={5}>Rechazado</MenuItem>
                        </Select>
                    </div>

                    <div>
                        <InputLabel>descripción</InputLabel>
                        <TextField
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            error={errores.descripcion ? true : false}
                            maxRows={4}
                            multiline
                        />
                    </div>
                </div>

            </div>

            <div className="row justify-content-end">
                <div className="col-md-4">
                    <button className={Style.sendButton} type="submit" >Crear</button>
                </div>
            </div>

        </>
    )
}