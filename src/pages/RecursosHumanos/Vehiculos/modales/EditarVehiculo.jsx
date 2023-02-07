import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Style from './NuevoVehiculo.module.css'
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

export default function EditarVehiculo(props) {
    const { reload, handleClose, vehiculo } = props
    const authUser = useSelector(state => state.authUser)
    const opcionesAreas = useSelector(state => state.opciones.areas)
    const [form, setForm] = useState({
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        placas: vehiculo.placas,
        poliza: vehiculo.poliza,
        ciudad: vehiculo.ciudad,
        fecha_poliza: new Date(vehiculo.fecha_poliza),
        fecha_verificacion1: new Date(vehiculo.fecha_verificacion1),
        fecha_verificacion2: new Date(vehiculo.fecha_verificacion2),
        fecha_tenencia: new Date(vehiculo.fecha_tenencia),
        estatus: vehiculo.estatus,
        id_departamento: vehiculo.id_departamento,
        responsable: vehiculo.user ? vehiculo.user.empleado_id : '',
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

    const validate = () => {
        let errores = {}
        let valid = true
        if (form.marca === '') {
            errores.marca = 'El campo marca es obligatorio'
            valid = false
        }
        if (form.modelo === '') {
            errores.modelo = 'El campo modelo es obligatorio'
            valid = false
        }
        if (form.placas === '') {
            errores.placas = 'El campo placas es obligatorio'
            valid = false
        }
        if (form.poliza === '') {
            errores.poliza = 'El campo poliza es obligatorio'
            valid = false
        }
        if (form.ciudad === '') {
            errores.ciudad = 'El campo ciudad es obligatorio'
            valid = false
        }
        if (form.fecha_poliza === '') {
            errores.fecha_poliza = 'El campo fecha poliza es obligatorio'
            valid = false
        }
        if (form.fecha_verificacion1 === '') {
            errores.fecha_verificacion1 = 'El campo fecha verificacion 1 es obligatorio'
            valid = false
        }
        if (form.fecha_verificacion2 === '') {
            errores.fecha_verificacion2 = 'El campo fecha verificacion 2 es obligatorio'
            valid = false
        }
        if (form.fecha_tenencia === '') {
            errores.fecha_tenencia = 'El campo fecha tenencia es obligatorio'
            valid = false
        }
        if (form.id_departamento === '') {
            errores.id_departamento = 'El campo departamento es obligatorio'
            valid = false
        }
        if (form.responsable === '') {
            errores.responsable = 'El campo responsable es obligatorio'
            valid = false
        }
        setErrores(errores)
        return valid
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            Swal.fire({
                title: 'Editar Vehiculo',
                text: "¿Estas seguro de querer editar este vehiculo?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, editar'
            }).then((result) => {
                if (result.isConfirmed) {
                    try {
                        Swal.fire({
                            title: 'Cargando',
                            text: 'Espere un momento',
                            allowOutsideClick: false,
                            onBeforeOpen: () => {
                                Swal.showLoading()
                            }
                        })
                        apiPutForm(`vehiculos/edit/${vehiculo.id}`, form, authUser.access_token)
                            .then(res => {
                                Swal.close()
                                Swal.fire({
                                    title: 'Exito',
                                    text: "Vehiculo creado correctamente",
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
                                    text: "Hubo un error al crear el vehiculo",
                                    icon: 'error',
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: 'Ok'
                                })
                            })

                    } catch (error) {
                        Swal.close()
                        Swal.fire({
                            title: 'Error',
                            text: "Hubo un error al crear el vehiculo",
                            icon: 'error',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok'
                        })
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

    return (
        <>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography variant="h6">Informacion General</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={Style.container}>
                        <div>
                            <div>
                                <InputLabel id="marca" >Marca</InputLabel>
                                <TextField
                                    name="marca"
                                    value={form.marca}
                                    onChange={handleChange}
                                    error={errores.marca ? true : false}
                                />
                            </div>
                            <div>
                                <InputLabel id="modelo">Modelo</InputLabel>
                                <TextField
                                    name="modelo"
                                    value={form.modelo}
                                    onChange={handleChange}
                                    error={errores.modelo ? true : false}
                                />
                            </div>
                            <div>
                                <InputLabel id="placas">Placas</InputLabel>
                                <TextField
                                    name="placas"
                                    value={form.placas}
                                    onChange={handleChange}
                                    error={errores.placas ? true : false}
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                <InputLabel id="ciudad">Ciudad</InputLabel>
                                <TextField
                                    name="ciudad"
                                    value={form.ciudad}
                                    onChange={handleChange}
                                    error={errores.ciudad ? true : false}
                                />
                            </div>
                            <div>
                                <InputLabel id="id_departamento">Departamento</InputLabel>
                                <Select
                                    labelId="id_departamento"
                                    name="id_departamento"
                                    value={form.id_departamento}
                                    onChange={handleChange}
                                    error={errores.id_departamento ? true : false}
                                >
                                    {
                                        opcionesAreas ? opcionesAreas.map((area, index) => {
                                            return <MenuItem key={index} value={area.id_area}>{area.nombreArea}</MenuItem>
                                        }) : null
                                    }
                                </Select>
                            </div>
                            <div>
                                <InputLabel id="estatus">Estatus</InputLabel>
                                <Select
                                    labelId="estatus"
                                    name="estatus"
                                    value={form.estatus}
                                    onChange={handleChange}
                                    error={errores.estatus ? true : false}
                                >
                                    <MenuItem value={1}>Activo</MenuItem>
                                    <MenuItem value={0}>Inactivo</MenuItem>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <div>
                                <InputLabel id="responsable">Responsable</InputLabel>
                                <Select
                                    labelId="responsable"
                                    name="responsable"
                                    value={form.responsable}
                                    onChange={handleChange}
                                    error={errores.responsable ? true : false}
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
                        </div> 
                    </div>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography variant="h6">Poliza</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={Style.container}>
                        <div>
                            <div>
                                <InputLabel id="poliza">Poliza</InputLabel>
                                <TextField
                                    name="poliza"
                                    value={form.poliza}
                                    onChange={handleChange}
                                    error={errores.poliza ? true : false}
                                />
                            </div>
                            <div>
                                <InputLabel id="fecha_poliza">Fecha de Poliza</InputLabel>
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                                    <Grid container >
                                        <KeyboardDatePicker
                                            variant="inline"
                                            format="dd/MM/yyyy"
                                            name="fecha_poliza"
                                            value={form.fecha_poliza !== '' ? form.fecha_poliza : null}
                                            placeholder="dd/mm/yyyy"
                                            onChange={e => handleChangeFecha(e, 'fecha_poliza')}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            error={errores.fecha_poliza ? true : false}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </div>
                        </div>

                    </div>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography variant="h6">Verificacion y Tenencia</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={Style.container}>
                        <div>
                            <div>
                                <InputLabel id="poliza">Verificacion 1</InputLabel>
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                                    <Grid container >
                                        <KeyboardDatePicker
                                            variant="inline"
                                            format="dd/MM/yyyy"
                                            name="fecha_verificacion1"
                                            value={form.fecha_verificacion1 !== '' ? form.fecha_verificacion1 : null}
                                            placeholder="dd/mm/yyyy"
                                            onChange={e => handleChangeFecha(e, 'fecha_verificacion1')}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            error={errores.fecha_verificacion1 ? true : false}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </div>
                            <div>
                                <InputLabel id="poliza">Verificacion 2</InputLabel>
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                                    <Grid container >
                                        <KeyboardDatePicker
                                            variant="inline"
                                            format="dd/MM/yyyy"
                                            name="fecha_verificacion2"
                                            value={form.fecha_verificacion2 !== '' ? form.fecha_verificacion2 : null}
                                            placeholder="dd/mm/yyyy"
                                            onChange={e => handleChangeFecha(e, 'fecha_verificacion2')}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            error={errores.fecha_verificacion2 ? true : false}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </div>
                            <div>
                                <InputLabel id="poliza">Tenencia</InputLabel>
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                                    <Grid container >
                                        <KeyboardDatePicker
                                            variant="inline"
                                            format="dd/MM/yyyy"
                                            name="fecha_tenencia"
                                            value={form.fecha_tenencia !== '' ? form.fecha_tenencia : null}
                                            placeholder="dd/mm/yyyy"
                                            onChange={e => handleChangeFecha(e, 'fecha_tenencia')}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            error={errores.fecha_tenencia ? true : false}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </div>
                        </div>

                    </div>
                </AccordionDetails>
            </Accordion>
            <div className="row justify-content-end">
                <div className="col-md-4">
                    <button className={Style.sendButton} type="submit" onClick={handleSubmit}>Editar</button>
                </div>
            </div>


        </>
    )
}