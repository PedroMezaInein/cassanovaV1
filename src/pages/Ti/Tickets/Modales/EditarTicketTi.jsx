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

export default function EditarTicketTi(props) {
    const { data, reload, handleClose } = props
    const authUser = useSelector(state => state.authUser)
    const [form, setForm] = useState({
        fecha: reformatDate(data.fecha),
        tipo: data.tipo,
        estatus: data.estatus,
        fecha_entrega: data.fecha_entrega ? reformatDate(data.fecha_entrega) : '',
        descripcion: data.descripcion,
        autorizacion: data.autorizacion,
        funcionalidades: data.funcionalidades ? data.funcionalidades : [],
        funcionalidad: '',
        id: data.id,
        id_departamento: data.id_departamento, 
    })
    const [errores, setErrores] = useState({})

    function reformatDate(input) {
        var datePart = input.match(/\d+/g),
            year = datePart[0].substring(2), // get only two digits
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

    const validateForm = () => {
        let errores = {}
        let formOk = true
        if (form.fecha_entrega === '') {
            if (form.fecha_entrega < form.fecha) {
                errores.fecha_entrega = true
                formOk = false
            }
        }
        if (form.tipo === '') {
            errores.tipo = true
            formOk = false
        }
        if (form.descripcion === '') {
            errores.descripcion = true
            formOk = false
        }
        if (form.funcionalidades.length === 0) {
            errores.funcionalidades = true
            formOk = false
        }
        setErrores(errores)
        return formOk
    }

    

    function formatDate(date) {
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return year + '/' + month + '/' + day;
    }


    const enviar = () => {
        if (validateForm()) {
            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                }
            })
            try {

                let newForm = {
                    tipo: form.tipo,
                    estatus: form.estatus,
                    fecha_entrega: formatDate(form.fecha_entrega),
                    descripcion: form.descripcion,
                    autorizacion: form.autorizacion,
                    funcionalidades: form.funcionalidades,
                    id_departamento: form.id_departamento,
                }
                apiPutForm(`ti/${form.id}`, newForm, authUser.access_token)
                    .then((data) => {
                        Swal.fire({
                            title: 'Requisicion enviada',
                            text: 'La requisicion se ha enviado correctamente',
                            icon: 'success',
                            showConfirmButton: true,
                            timer: 2000,
                        }).then(() => {
                            if (reload) {
                                reload.reload()
                            }
                            handleClose()
                        })

                    })
                    .catch((error) => {
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ha ocurrido un error 1',
                        })
                        console.log(error)
                    })
            } catch (error) {
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error 2',
                })
                console.log(error)
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

    console.log(form)
    console.log(data)

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
                                    value={form.fecha}
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
                        <InputLabel id="fecha_poliza">Fecha de entrega</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker

                                    format="dd/MM/yyyy"
                                    name="fecha_entrega"
                                    value={form.fecha_entrega}
                                    placeholder="dd/mm/yyyy"
                                    onChange={e => handleChangeFecha(e, 'fecha_entrega')}
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
                <div>
                    <div>
                        <InputLabel>Funcionalidades</InputLabel>
                        <TextField
                            name="funcionalidad"
                            value={form.funcionalidad}
                            onChange={handleChange}
                            onKeyPress={handleEnter}
                            error={errores.funcionalidades ? true : false}
                            maxRows={4}
                            multiline
                        />
                        
                    </div>
                </div>
                <div>
                    <div>
                        {
                            form.funcionalidades.length > 0 ?
                                form.funcionalidades.map((item, index) => (
                                    <div key={index} className={Style.containerFuncionalidad}><span onClick={e => handleDelete(index)} className={Style.deleteFuncionalidad}>X</span><span className={Style.textFuncionalidad}>{item.funcionalidad}</span></div>
                                ))
                                : <div>No hay funcionalidades</div>
                        }
                    </div>
                </div>
            </div>

            <div className="row justify-content-end">
                <div className="col-md-4">
                    <button className={Style.sendButton} type="submit" onClick={enviar}>Editar</button>
                </div>
            </div>
           
        </>
    )
}