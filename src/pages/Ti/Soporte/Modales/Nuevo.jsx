import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'

import Swal from 'sweetalert2'
import { apiGet, apiPostForm } from '../../../../functions/api'

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import Style from './TicketsTi.module.css'

export default function Nuevo(props) {
    const { data, reload, handleClose } = props
    const authUser = useSelector(state => state.authUser)
    const usuarios = useSelector(state => state.opciones.vehiculos.colaboradores.sort((a, b) => a.nombre > b.nombre ? 1 : -1))
    const [form, setForm] = useState({
        fecha: new Date(),
        fecha_mantenimiento: '',
        descripcion: '',
        autorizacion: '',
        id_equipo: '',
        costo: 0,
        id_usuario: '',
    })

    const [errores, setErrores] = useState({})

    const [equipos, setEquipos] = useState([])

    useEffect(() => { 
        if (form.id_usuario !== '') {
            getEquipos()
        }
    }, [form.id_usuario])

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        try {
            Swal.fire({
                title: 'Creando ticket',
                text: 'Espere un momento',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                }
            })
            apiPostForm('computo', form, authUser.access_token)
                .then(response => {
                    Swal.close()
                    Swal.fire({
                        title: '¡Éxito!',
                        text: 'Se ha creado el ticket',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    })
                    if (reload) {
                        reload.reload()
                    }
                    handleClose()
                })
                .catch(error => {
                    Swal.close()
                    Swal.fire({
                        title: 'Error',
                        text: 'Ha ocurrido un error al crear el ticket',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                })
            
            
        } catch (error) { 
            Swal.close()
            Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error al crear el ticket',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
        }
    }

    const getEquipos = () => { 
        try {
            apiGet(`v2/rh/empleados/equipos/${form.id_usuario}`, authUser.access_token)
                .then(response => { 
                    setEquipos(response.data.equipos)
                })
        } catch (error) {
            
        }
    }

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

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
                                    name="fecha_mantenimiento"
                                    value={form.fecha_mantenimiento !== '' ? form.fecha_mantenimiento : null}
                                    placeholder="dd/mm/yyyy"
                                    onChange={e => handleChangeFecha(e, 'fecha_mantenimiento')}
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
                        {
                            usuarios.length > 0 ?
                                <div>
                                    <InputLabel>Usuario</InputLabel>
                                    <Select
                                        name="id_usuario"
                                        value={form.id_usuario}
                                        onChange={handleChange}
                                        error={errores.id_usuario ? true : false}
                                    >
                                        {
                                            usuarios.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>{item.nombre} {item.apellido_paterno ? item.apellido_paterno : ''} {item.apellido_materno ? item.apellido_materno : ''}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </div>
                                :
                                <div>
                                    <InputLabel>Usuario</InputLabel>
                                    <Select
                                        name="id_usuario"
                                        value={form.id_usuario}
                                        onChange={handleChange}
                                        error={errores.id_usuario ? true : false}
                                    >
                                        <MenuItem value={0}>No hay usuarios</MenuItem>
                                    </Select>
                                </div>
                        }
                    </div>
                    {
                        equipos.length > 0 ?
                            <div>
                                <InputLabel>Equipo</InputLabel>
                                <Select
                                    name="id_equipo"
                                    value={form.id_equipo}
                                    onChange={handleChange}
                                    error={errores.id_equipo ? true : false}
                                    style={{ maxWidth: '15rem' }}
                                >
                                    {
                                        equipos.map((item, index) => (
                                            <MenuItem key={index}
                                                value={item.id}>{item.equipo.length > 15 ? item.equipo.slice(0, 20) + '...': item.equipo} || marca: {item.marca}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </div>
                            :
                            <div>
                                <InputLabel>Equipo</InputLabel>
                                <Select
                                    name="id_equipo"
                                    value={form.id_equipo}
                                    onChange={handleChange}
                                    error={errores.id_equipo ? true : false}
                                >
                                    <MenuItem value={0}>No hay equipos</MenuItem>
                                </Select>
                            </div>
                    }

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
                    <button className={Style.sendButton} type="submit" onClick={handleSubmit}>Crear</button>
                </div>
            </div>

        </>
    )
}