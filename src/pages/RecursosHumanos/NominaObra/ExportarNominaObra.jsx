import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { catchErrors, apiPostForm, apiPostFormResponseBlob } from '../../../functions/api'

import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'

import Swal from 'sweetalert2'

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputLabel from '@material-ui/core/InputLabel';

import Style from './ExportNominaObra.module.css'

export default function ExportarNominaObra(props) {
    const auth = useSelector(state => state.authUser.access_token)
    const [form, setForm] = useState({
        fechaInicio: '',
        fechaFin: '',
        proyecto: '',
    })
    const [errores, setErrores] = useState({})

    const validarFormulario = () => {
        let errores = {}
        let formOk = true
        if (form.fechaInicio === '') {
            formOk = false
            errores.fechaInicio = 'Debe seleccionar una fecha de inicio'
        }
        if (form.fechaFin === '') {
            formOk = false
            errores.fechaFin = 'Debe seleccionar una fecha de fin'
        }
        // if (form.proyecto === '') {
        //     formOk = false
        //     errores.proyecto = 'Debe seleccionar un proyecto'
        // }
        setErrores(errores)
        return formOk
    }

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    const handleChangeProyecto = (event, value) => {
        if (value && value.value) {
            setForm({
                ...form,
                proyecto: value.value
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (validarFormulario()) {
            Swal.fire({
                title: 'Generando Excel',
                text: 'Por favor espere...',
                allowOutsideClick: false,
                beforeOpen: () => {
                    Swal.showLoading()
                },
            })
            try {
                let newForm = {
                    fecha_inicio: form.fechaInicio,
                    fecha_fin: form.fechaFin,
                    id_proyecto: form.proyecto
                }
                apiPostFormResponseBlob('rh/nomina-obra/exportar', newForm, auth)
                    .then(response => {
                        //auto download xml response not blow
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'nominaObra.xlsx');
                        document.body.appendChild(link);
                        link.click();
                        
                        Swal.close()
                        Swal.fire({
                            icon: 'success',
                            title: 'Excel generado',
                            text: 'El excel se ha generado correctamente',
                        })
                    })
                    .catch(error => {
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Algo salió mal!',
                        })
                    })

            } catch (error) {
                /* catchErrors(error, window.location.href) */
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal!',
                })
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'todos los campos son obligatorios',
                text: 'Por favor verifique los campos',
            })
        }
    }


    return (
        <>
            <div className={Style.container}>
                <div>
                    <div>
                        <InputLabel id="fecha_poliza">Fecha Inicio</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker
                                    format="dd/MM/yyyy"
                                    name="fechaInicio"
                                    value={form.fechaInicio !== '' ? form.fechaInicio : null}
                                    placeholder="dd/mm/yyyy"
                                    onChange={e => handleChangeFecha(e, 'fechaInicio')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    error={errores.fechaInicio ? true : false}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>
                    <div>
                        <InputLabel id="fecha_poliza">Fecha Fin</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker
                                    format="dd/MM/yyyy"
                                    name="fechaFin"
                                    value={form.fechaFin !== '' ? form.fechaFin : null}
                                    placeholder="dd/mm/yyyy"
                                    onChange={e => handleChangeFecha(e, 'fechaFin')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    error={errores.fechaFin ? true : false}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>
                    
                </div>
                <div>
                    <div>
                        <Autocomplete
                            name="Poryecto"
                            options={props.data.proyectos}
                            getOptionLabel={(option) => option.name}
                            style={{ width: 350 }}
                            onChange={(event, value) => handleChangeProyecto(event, value)}
                            renderInput={(params) => <TextField {...params} label='proyecto' variant="outlined" />}
                            // error={errores.proyecto ? true : false}
                        />
                    </div>
                </div>
            </div>

            <div className="row justify-content-end">
                <div className="col-md-4">
                    <button className={Style.sendButton} type="submit" onClick={handleSubmit}>Exportar</button>
                </div>
            </div>

        </>
    );
}
