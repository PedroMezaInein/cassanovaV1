import React, {useState, useEffect} from "react"
import { useSelector } from 'react-redux';

import { apiPostForm, apiGet, apiPutForm } from '../../../../functions/api'

import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import { es } from 'date-fns/locale'
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import Swal from 'sweetalert2'

import Style from './NuevoInsumo.module.css'

export default function ControlGastos (props) {
    const { data, handleClose, reload } = props
    const userAuth = useSelector((state) => state.authUser);

    const [form, setForm] = useState ({
        nombre: data.nombre ? data.nombre : '',
        cantidad: '',
        fecha: '',
    })

    const handleChange = (event) => {
        // name son los diferentes tipos de atributos (departamento, fecha...)
        let name = event.target.name;
        setForm({
            ...form,
            [name]: event.target.value,
        });
    };

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    const handleSend = (e) => {
        e.preventDefault() //Evita que se recargue por ejecutar lo que tiene por defecto
        // if(validateForm()){
        if(true){

            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                }
            }) 
            try {

                let newForm = {
                    fecha:form.fecha,
                    cantidad: form.cantidad,

                }

                apiPutForm(`insumos/create/${data.id}`, newForm, userAuth.access_token)
                    .then((data) => {
                        Swal.close()
                        Swal.fire({
                            icon: 'success',
                            title: 'Nueva solicitud',
                            text: 'Se ha creado correctamente',
                            timer: 3000,
                            timerProgressBar: true,
                        })
                        handleClose()
                        if(reload){
                            reload.reload()
                        }
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
        <div className={Style.container_insumos}>
            <div className={Style.control_insumos}>
                <div className={Style.control_input}>
                    <InputLabel id="nombre" >Nombre</InputLabel>
                    <TextField
                        name="nombre"
                        value={form.nombre}
                        disabled
                        // error={errores.nombre ? true : false}
                    />
                </div>

                <div className={Style.control_input}>
                    <InputLabel id="nombre" >Cantidad</InputLabel>
                    <TextField
                        name="cantidad"
                        value={form.cantidad}
                        type='number'
                        onChange={handleChange}
                        // error={errores.nombre ? true : false}
                    />
                </div>

                <div className={Style.control_input}>
                    <InputLabel>Fecha</InputLabel>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                        <Grid container >
                            <KeyboardDatePicker
                                className="fecha"
                                format="dd/MM/yyyy"
                                name="fecha"
                                value={form.fecha !=='' ? form.fecha : null}
                                placeholder="dd/mm/yyyy"
                                onChange={e=>handleChangeFecha(e, 'fecha')}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                // error={errores.fecha ? true : false}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                </div>
            </div>  
            

            <div className={Style.control_boton}>
                <div className="col-md-4">
                    <button className={Style.sendButton} onClick={handleSend}>Editar</button>
                </div>
            </div>   
        </div>
    )
}