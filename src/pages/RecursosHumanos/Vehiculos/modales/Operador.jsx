import React, { useState } from 'react'
import { useSelector } from 'react-redux'

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

export default function EditarVehiculo(props) {
    const { reload, handleClose, vehiculo } = props
    const authUser = useSelector(state => state.authUser)
    const opcionesAreas = useSelector(state => state.opciones.areas)
    const [form, setForm] = useState({
        user: 2,
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

    const handleChangeCheck = (e) => {
        let usuario =  e.target.value
        Swal.fire({
            title: 'Asignar Vehiculo',
            text: "¿Estas seguro de querer asignar este vehiculo al usuario seleccionado?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, asignar'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(usuario)
                Swal.fire({
                    title: 'Vehiculo asignado',
                    text: "El vehiculo se asigno correctamente",
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                })
                setForm({
                    ...form,
                    user: parseInt(usuario)
                })
            }
        })
    }

    const operadores = [
        { id: 1, nombre: 'Juan Perez' },
        { id: 2, nombre: 'Pedro Lopez' },
        { id: 3, nombre: 'Maria Martinez' },
        { id: 4, nombre: 'Jose Gonzalez' },
        { id: 5, nombre: 'Luisa Hernandez' },
    ]

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
                            {
                                operadores.map((operador, index) => { 
                                    return (
                                        <div key={index}>
                                            <Checkbox
                                                checked={form.user === operador.id}
                                                onChange={handleChangeCheck}
                                                name={operador.nombre}
                                                value={operador.id}
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                            />
                                            <label>{operador.nombre}</label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>
            
        </>
    )
}