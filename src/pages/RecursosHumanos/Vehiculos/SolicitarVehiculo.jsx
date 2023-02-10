import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import { apiPostForm, apiGet, apiPutForm } from '../../../functions/api';
import Swal from 'sweetalert2'
import '../../../styles/_salaJuntas.scss'

import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';

import Style from './modales/NuevoVehiculo.module.css'

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));

export default function SolicitarVehiculo(props) {

    const {closeModal} = props

    const userAuth = useSelector((state) => state.authUser);

    const [form, setForm] = useState({ 
        id_usuario: userAuth.user.id,
        id_vehiculo: 1,
        fecha_inicio:'',
        fecha_fin:'',
        hora_inicio:'',
        hora_fin:'',
        destino:'',
        comentarios: ''
    });

    const [errores, setErrores] = useState({})

    // MATERIAL UI
    const classes = useStyles();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    const validateForm = () => {
        let validar = true
        let error = {}
        if(form.fecha_inicio === ''){
            error.fecha_inicio = "Seleccione una fecha de inicio"
            validar = false
        }
        if(form.fecha_fin === ''){
            error.fecha_fin = "Seleccione una fecha de termino"
            validar = false
        }
        if(form.hora_inicio === ''){
            error.hora_inicio = "Seleccione una hora de inicio"
            validar = false
        }
        if(form.hora_fin === ''){
            error.hora_fin = "Seleccione una hora de termino"
            validar = false
        }
        if(form.destino === ''){
            error.destino = "Escriba un destino"
            validar = false
        }
        if(form.comentarios === ''){
            error.comentarios = "Escriba una comentarios"
            validar = false
        }
        
        setErrores(error)
        return validar
    }

    const handleSend = (e) => {
        e.preventDefault() //Evita que se recargue por ejecutar lo que tiene por defecto
        if(validateForm()){

            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                }
            }) 
            try {

                let newForm = {
                    id_usuario: form.id_usuario,
                    id_vehiculo: 1,
                    fecha_inicio:form.fecha_inicio,
                    fecha_fin:form.fecha_fin,
                    hora_inicio:form.hora_inicio,
                    hora_fin:form.hora_fin,
                    destino:form.destino,
                    comentarios: form.comentarios
                }

                apiPostForm('vehiculos/solicitud', newForm, userAuth.access_token)
                    .then((data) => {
                        Swal.close()
                        Swal.fire({
                            icon: 'success',
                            title: 'Nueva solicitud',
                            text: 'Se ha creado correctamente',
                            timer: 3000,
                            timerProgressBar: true,
                        })
                        closeModal()
                    })
                    .catch((error) => {
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ha ocurrido un error',
                        })
                        console.log(error)
                    })
            } catch (error) { 
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error',
                })
                console.log(error)
            }
        } else{
            Swal.fire({
                title: 'Faltan campos',
                text: 'Favor de llenar todos los campos',
                icon: 'info',
                showConfirmButton: false,
                timer: 2000,
            })
        }
    }

    return (
        <>
            <div className={Style.container}>

                <div>
                    <div>
                        <InputLabel>Fecha inicio</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker
                                    format="dd/MM/yyyy"
                                    name="fecha_inicio"
                                    value={form.fecha_inicio !=='' ? form.fecha_inicio : null}
                                    placeholder="dd/mm/yyyy"
                                    onChange={e=>handleChangeFecha(e, 'fecha_inicio')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    error={errores.fecha_inicio ? true : false}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>   
                    
                    <div>
                        <InputLabel>Hora inicio</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardTimePicker
                                    value={form.hora_inicio !=='' ? form.hora_inicio : null}
                                    onChange={e=>handleChangeFecha(e, 'hora_inicio')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                    error={errores.hora_inicio ? true : false}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>   

                </div>

                <div>
                    <div>
                        <InputLabel>Fecha fin</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker
                                    // variant="inline"
                                    format="dd/MM/yyyy"
                                    name="fecha_fin"
                                    value={form.fecha_fin !=='' ? form.fecha_fin : null}
                                    placeholder="dd/mm/yyyy"
                                    onChange={e=>handleChangeFecha(e, 'fecha_fin')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    error={errores.fecha_fin ? true : false}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>  

                    <div>
                        <InputLabel>Hora fin</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardTimePicker
                                    // margin="normal"
                                    value={form.hora_fin !=='' ? form.hora_fin : null}
                                    onChange={e=>handleChangeFecha(e, 'hora_fin')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                    error={errores.hora_fin ? true : false}
                                />  
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>   
                </div>

                <div>
                    <div>
                        <TextField
                            className={classes.textField}
                            id="standard-multiline-static"
                            label="Descripción"
                            value={form.comentarios}
                            name='comentarios'
                            onChange={handleChange}
                            multiline
                            fullWidth
                            rows={4}
                            error={errores.comentarios ? true : false}
                            // defaultValue="Default Value"
                        />
                    </div>

                    <div>
                        <TextField
                            className={classes.textField}
                            id="standard-multiline-static"
                            label="Destino"
                            value={form.destino}
                            name='destino'
                            onChange={handleChange}
                            multiline
                            rows={4}
                            error={errores.destino ? true : false}
                            // defaultValue="Default Value"
                        />
                    </div>
                </div>
            </div>

            <div className="row justify-content-end">
                <div className="col-md-4">
                    <button className={Style.sendButton} type="submit" onClick={handleSend}>Crear</button>
                </div>    
            </div>
        </>
    )     
}