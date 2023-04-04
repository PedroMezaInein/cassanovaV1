import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import DateFnsUtils from '@date-io/date-fns';
import Swal from 'sweetalert2'
import { es } from 'date-fns/locale'
import axios from 'axios';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import WorkIcon from '@material-ui/icons/Work';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import { URL_DEV } from '../../../constants'
import { setSingleHeader } from "../../../functions/routers"



export default function NuevaFase(props) {
    const { proyecto, fases } = props
    const user = useSelector(state => state.authUser);
    const [fase, setFase] = useState(fases)

    const [form, setForm] = useState({
        fechaInicio: new Date(),
        fechaFin: new Date(),
        fase1: proyecto.fase1 === 1 ? true : false,
        fase2: proyecto.fase2 === 1 ? true : false,
        fase3: proyecto.fase3 === 1 ? true : false,
        fases: [],
        costo: proyecto.costo,
        nombre: proyecto.nombre,
    })

    const arrayFases = [
        { value: 'fase1', name: 'Fase 1', label: 'Fase 1' },
        { value: 'fase2', name: 'Fase 2', label: 'Fase 2' },
        { value: 'fase3', name: 'Fase 3', label: 'Fase 3' },
    ]

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeFase = (e) => {
        setFase({
            ...fase,
            [e.target.name]: {
                ...fase[e.target.name],
                activeTab: e.target.checked
            }
        })
        setForm({
            ...form,
            [e.target.name]: e.target.checked ? 1 : 0
        })
    }

    const handleChangeFechaInicio = (date) => {
        setForm({
            ...form,
            fechaInicio: new Date(date)
        })
    };

    const handleChangeFechaFin = (date) => {
        setForm({
            ...form,
            fechaFin: new Date(date)
        })
    };

    const handleSubmit = (e) => { 
        e.preventDefault()
        Swal.fire({
            title: 'Contratar nueva fase',
            text: "¿Estás seguro de contratar esta nueva fase?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, contratar'
        }).then((result) => {
            if (result.isConfirmed) {
                let newFases =[]

                /* arrayFases.map(fase => {
                    if (Object.keys(form).includes(fase.value) && form[fase.value] === true) {
                        console.log(fase)
                        newFases.push(fase)
                    }
                }) */
                
                
                /* if (form.fases.length > 0) {
                    newFases = form.fases
                } else {
                    newFases = arrayFases.map(fase => {
                        if (Object.keys(form).includes(fase.value) && proyecto[fase.value] === 1) {
                            return fase
                        }
                    })
                } */
                if (fase.fase1.activeTab) {
                    newFases = []
                    newFases.push(arrayFases[0])
                }
                if (fase.fase2.activeTab) {
                    newFases=[]
                    newFases.push(arrayFases[1])
                }
                if (fase.fase3.activeTab) {
                    newFases=[]
                    newFases.push(arrayFases[2])
                }
                let newForm = {
                    fechaFin: form.fechaFin,
                    fechaInicio: form.fechaInicio,
                    costo: form.costo,
                    nombre: form.nombre,
                    fases: newFases
                }
                Swal.fire({
                    title: 'Contratando fase',
                    text: 'Por favor espere...',
                    allowOutsideClick: false,
                    onBeforeOpen: () => {
                        Swal.showLoading()
                    }
                })
                axios.put(`${URL_DEV}v3/proyectos/proyectos/${proyecto.id}/contratar`, newForm, { headers: setSingleHeader(user.access_token) })
                    .then(res => {
                        console.log(res)
                        Swal.close()
                        Swal.fire(
                            'Contratada!',
                            'La nueva fase ha sido contratada.',
                            'success'
                        )
                    })
                    .catch(err => {
                        console.log(err)
                        Swal.fire(
                            'Error!',
                            'Ha ocurrido un error al contratar la fase.',
                            'error'
                        )
                    })
            }
        })
    }

    console.log(form)

    return (
        <div>

            <form>
                <div className=''>
                    <div>
                        <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
                            <Grid container justifyContent="space-around">
                                <KeyboardDatePicker
                                    margin="normal"
                                    label="Fecha de Inicio"
                                    format="dd/MM/yyyy"
                                    value={form.fechaInicio}
                                    onChange={handleChangeFechaInicio}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>
                    <Divider orientation="vertical" flexItem />
                    <div>
                        <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
                            <Grid container justifyContent="space-around">
                                <KeyboardDatePicker
                                    margin="normal"
                                    label="Fecha de Termino"
                                    format="dd/MM/yyyy"
                                    value={form.fechaFin}
                                    onChange={handleChangeFechaFin}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>
                </div>

                <div className=''>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={form.fase1 || proyecto.fase2 || proyecto.fase3}
                                name="fase1"
                                color="secondary"
                                disabled={proyecto.fase1 === 1 || proyecto.fase2 === 1 || proyecto.fase3 === 1? true : false}
                            />
                        }
                        label="Fase 1"
                        onChange={handleChangeFase}
                    />
                    <Divider orientation="vertical" flexItem />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={form.fase2 || proyecto.fase3}
                                name="fase2"
                                color="secondary"
                                disabled={proyecto.fase2 === 1  || proyecto.fase3 === 1 ? true : false}
                            />
                        }
                        label="Fase 2"
                        onChange={handleChangeFase}
                    />
                    <Divider orientation="vertical" flexItem />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={form.fase3}
                                name="fase3"
                                color='secondary'
                                disabled={proyecto.fase3 === 1 ? true : false}
                            />
                        }
                        label="Fase 3"
                        onChange={handleChangeFase}
                    />

                </div>

                <TextField
                    name="costo"
                    value={form.costo}
                    label="Costo con IVA"
                    color='secondary'
                    onChange={handleChange}
                    type='number'
                />

                <TextField
                    name="nombre"
                    value={form.nombre}
                    label="Nombre del proyecto"
                    color='primary'
                    onChange={handleChange}
                    type='text'
                />

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<WorkIcon />}
                    onClick={handleSubmit}
                >
                    Contratar nueva fase
                </Button>
            </form>


        </div>
    );
}