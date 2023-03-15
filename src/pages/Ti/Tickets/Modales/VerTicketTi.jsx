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

export default function VerTicketTi(props) {
    const { data, reload, handleClose } = props
    const authUser = useSelector(state => state.authUser)
    const [form, setForm] = useState({
        fecha: new Date(data.fecha),
        tipo: data.tipo,
        estatus: data.estatus,
        fecha_entrega: data.fecha_entrega ? new Date(data.fecha_entrega) : '',
        descripcion: data.descripcion,
        autorizacion: data.autorizacion,
        funcionalidades: data.funcionalidades ? data.funcionalidades : [],
        funcionalidad: ''
    })
    const [errores, setErrores] = useState({})
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
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    disabled
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>
                    <div>
                        <InputLabel id="fecha_poliza">Fecha de entrega</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker

                                    format="dd/MM/yyyy"
                                    name="fecha_entrega"
                                    value={form.fecha_entrega !== '' ? form.fecha_entrega : null}
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
                        <InputLabel>Tipo</InputLabel>
                        <Select
                            name="tipo"
                            value={form.tipo}
                            disabled
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
                            disabled
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
                            maxRows={4}
                            multiline
                            disabled
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <InputLabel>Funcionalidades</InputLabel>
                        <TextField
                            name="funcionalidad"
                            value={form.funcionalidad}
                            maxRows={4}
                            multiline
                            disabled
                        />

                    </div>
                </div>
                <div>
                    <div>
                        {
                            form.funcionalidades.length > 0 ?
                                form.funcionalidades.map((item, index) => (
                                    <div key={index} className={Style.containerFuncionalidad}><span className={Style.textFuncionalidad}>{item.funcionalidad}</span></div>
                                ))
                            : <div>No hay funcionalidades</div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}