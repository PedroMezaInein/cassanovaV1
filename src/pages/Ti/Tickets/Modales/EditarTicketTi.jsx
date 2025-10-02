import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'

import Swal from 'sweetalert2'
import { apiGet, apiPutForm, apiPostForm, apiDelete } from '../../../../functions/api'

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import Style from './TicketsTi.module.css'

export default function EditarTicketTi(props) {
    const { data, reload, handleClose } = props
    const authUser = useSelector(state => state.authUser)
    const [usuarios, setUsuarios] = useState([]);
    const [form, setForm] = useState({
        fecha: reformatDate(data.fecha),
        tipo: data.tipo,
        estatus: [1, 2, 3, 4, 5].includes(data.estatus) ? data.estatus : '',
        fecha_entrega: data.fecha_entrega ? reformatDate(data.fecha_entrega) : '',
        descripcion: data.descripcion,
        autorizacion: data.autorizacion,
        funcionalidades: [],
        funcionalidad: '',
        id: data.id,
        id_departamento: data.id_departamento,
        prioridad: data.prioridad || '',
        asignacion: data.id_asignacion || ''
    })

    const [funcionalidad, setFuncionalidad] = useState({
        id: data.id,
        descripcion: '',
        fecha: new Date(),
    })

    const [errores, setErrores] = useState({})

    useEffect(() => {
        getFuncionalidades();
        getUsersasignar();
    }, [])

    const getUsersasignar = () => {
        try {
            apiGet('user/users/options/ti', authUser.access_token)
                .then(response => {
                    setUsuarios(response.data.empleados)
                })
        } catch (error) {
            console.log(error)
        }
    }

    const getFuncionalidades = () => {
        apiGet(`ti/funcionalidad/${data.id}`, authUser.access_token)
            .then((data) => {
                Swal.close()
                setForm(prev => ({
                    ...prev,
                    funcionalidades: data.data.funcionalidades,
                }))
            })
            .catch(() => {
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal',
                })
            })
    }

    const postFuncionalidad = () => {
        Swal.fire({
            title: 'Agregando funcionalidad',
            text: 'Espere un momento por favor',
            allowOutsideClick: false,
            onBeforeOpen: () => Swal.showLoading()
        })
        apiPostForm(`ti/add`, funcionalidad, authUser.access_token)
            .then(() => {
                getFuncionalidades()
                setFuncionalidad({
                    id: data.id,
                    descripcion: '',
                    fecha: new Date(),
                })
            })
            .catch(() => {
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal',
                })
            })
    }

    function reformatDate(input) {
        var datePart = input.match(/\d+/g),
            year = datePart[0].substring(2),
            month = datePart[1], day = datePart[2];
        return month + '/' + day + '/' + year;
    }

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleEnter = e => {
        if (e.key === 'Enter') {
            if (funcionalidad.descripcion !== '') {
                postFuncionalidad()
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

    const validateForm = () => {
        let errores = {}
        let formOk = true

        if (form.fecha_entrega === '' || form.fecha_entrega < form.fecha) {
            errores.fecha_entrega = true
            formOk = false
        }

        if (form.tipo === '') {
            errores.tipo = true
            formOk = false
        }

        if (form.descripcion === '') {
            errores.descripcion = true
            formOk = false
        }

        if (form.estatus === '') {
            errores.estatus = true
            formOk = false
        }

        if (form.prioridad === '') {
            errores.prioridad = true
            formOk = false
        }

        setErrores(errores)
        return formOk
    }

    const enviar = () => {
        if (validateForm()) {
            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                onBeforeOpen: () => Swal.showLoading()
            })
            try {
                let newForm = {
                    tipo: form.tipo,
                    estatus: form.estatus,
                    fecha_entrega: form.fecha_entrega,
                    descripcion: form.descripcion,
                    autorizacion: form.autorizacion,
                    funcionalidades: form.funcionalidades,
                    id_departamento: form.id_departamento,
                    prioridad: form.prioridad,
                    id_asignacion: form.asignacion
                }

                apiPutForm(`ti/${form.id}`, newForm, authUser.access_token)
                    .then(() => {
                        Swal.fire({
                            title: 'Ticket editado',
                            text: 'El ticket se ha editado correctamente',
                            icon: 'success',
                            showConfirmButton: true,
                            timer: 2000,
                        }).then(() => {
                            if (typeof reload === 'function') reload()
                            handleClose()
                        })
                    })
                    .catch(() => {
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ha ocurrido un error al guardar',
                        })
                    })
            } catch (error) {
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error inesperado en el sistema',
                })
            }
        } else {
            Swal.fire({
                title: 'Faltan campos',
                text: 'Favor de llenar todos los campos',
                icon: 'info',
                showConfirmButton: false,
                timer: 2000,
            })
        }
    }

    const handleChangeFuncionalidad = e => {
        setFuncionalidad({
            ...funcionalidad,
            [e.target.name]: e.target.value
        })
    }

    const handleEnterFuncionalidad = item => {
        apiDelete(`ti/funcionalidad/${item.id}`, authUser.access_token)
            .then(() => getFuncionalidades())
    }

    return (
        <div className={Style.container}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <InputLabel>Fecha de solicitud</InputLabel>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                        <KeyboardDatePicker
                            format="dd/MM/yyyy"
                            name="fecha"
                            value={form.fecha}
                            disabled
                            fullWidth
                        />
                    </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                    <InputLabel>Fecha de entrega</InputLabel>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                        <KeyboardDatePicker
                            format="dd/MM/yyyy"
                            name="fecha_entrega"
                            value={form.fecha_entrega}
                            onChange={e => handleChangeFecha(e, 'fecha_entrega')}
                            fullWidth
                        />
                    </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        error={errores.tipo}
                        fullWidth
                    >
                        <MenuItem value="">Selecciona tipo</MenuItem>
                        <MenuItem value={0}>Cambio</MenuItem>
                        <MenuItem value={1}>Soporte</MenuItem>
                        <MenuItem value={2}>Mejora</MenuItem>
                        <MenuItem value={3}>Reporte</MenuItem>
                        <MenuItem value={4}>Información</MenuItem>
                        <MenuItem value={5}>Capacitación</MenuItem>
                        <MenuItem value={6}>Funcionalidad</MenuItem>
                        <MenuItem value={7}>Proyecto</MenuItem>
                    </Select>
                </Grid>

                <Grid item xs={12} md={6}>
                    <InputLabel>Estatus</InputLabel>
                    <Select
                        name="estatus"
                        value={form.estatus}
                        onChange={handleChange}
                        error={errores.estatus}
                        fullWidth
                    >
                        <MenuItem value="">Selecciona estatus</MenuItem>
                        <MenuItem value={1}>Solicitado</MenuItem>
                        <MenuItem value={2}>En desarrollo</MenuItem>
                        <MenuItem value={3}>Terminado</MenuItem>
                        <MenuItem value={4}>Cancelado</MenuItem>
                        <MenuItem value={5}>Rechazado</MenuItem>
                    </Select>
                </Grid>

                <Grid item xs={12} md={6}>
                    <InputLabel>Prioridad</InputLabel>
                    <Select
                        name="prioridad"
                        value={form.prioridad}
                        onChange={handleChange}
                        fullWidth
                    >
                        <MenuItem value="">Selecciona prioridad</MenuItem>
                        <MenuItem value="alta">🔴 Alta</MenuItem>
                        <MenuItem value="media">🟡 Media</MenuItem>
                        <MenuItem value="baja">🟢 Baja</MenuItem>
                    </Select>
                </Grid>

                <Grid item xs={12} md={6}>
                    <InputLabel>Asignar a</InputLabel>
                    <Select
                        name="asignacion"
                        value={form.asignacion}
                        onChange={handleChange}
                        fullWidth
                    >
                        <MenuItem value="">Selecciona un usuario</MenuItem>
                        {usuarios.map((u, i) => (
                            <MenuItem key={i} value={u.id}>{u.nombre}</MenuItem>
                        ))}
                    </Select>
                </Grid>

                <Grid item xs={12}>
                    <InputLabel>Descripción</InputLabel>
                    <TextField
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        error={errores.descripcion}
                        multiline
                        fullWidth
                    
                    />
                </Grid>

                {!data.autorizacion && (
                    <Grid item xs={12}>
                        <InputLabel>Funcionalidades</InputLabel>
                        <TextField
                            name="descripcion"
                            value={funcionalidad.descripcion}
                            onChange={handleChangeFuncionalidad}
                            onKeyPress={handleEnter}
                            fullWidth
                        />
                    </Grid>
                )}

                {form.funcionalidades.length > 0 && (
                    <Grid item xs={12}>
                        {form.funcionalidades.map((item, i) => (
                            <div key={i} className={Style.containerFuncionalidad}>
                                {!data.autorizacion && (
                                    <span
                                        onClick={() => handleEnterFuncionalidad(item)}
                                        className={Style.deleteFuncionalidad}
                                    >
                                        X
                                    </span>
                                )}
                                <span className={Style.textFuncionalidad}>{item.descripcion}</span>
                            </div>
                        ))}
                    </Grid>
                )}

                {form.funcionalidades.length === 0 && (
                    <Grid item xs={12}>
                        <span>No hay funcionalidades</span>
                    </Grid>
                )}

                <Grid item xs={12} className="text-right">
                    <button className={Style.sendButton} onClick={enviar}>Editar</button>
                </Grid>
            </Grid>
        </div>
    )
}
