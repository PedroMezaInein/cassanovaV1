import React, {useState} from 'react'
import { useSelector } from "react-redux";
import { apiPostForm } from './../../../functions/api'

import Swal from 'sweetalert2'

import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'
import Grid from '@material-ui/core/Grid';
import './nuevoTicket.scss'

export default function NuevoTicket (props) {

    const {handleClose, reload} = props

    const user = useSelector(state => state.authUser)
    const departamento = useSelector(state => state.authUser.departamento)
    const [errores, setErrores] = useState({})
    const[state, setState] = useState({
        departamento: departamento.departamentos[0].id,
        tipo: '',
        descripcion: '',
        fecha: new Date(),
    })

    const handleChange = (event) => {
        // name son los diferentes tipos de atributos (departamento, fecha...)
        let name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };

    function formatDate(date) {
        var year = date.getFullYear();
      
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
      
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        
        return year + '/' + month + '/' + day;
      }

    const validateForm = () => {
        let validar = true
        let error = {}
        if(state.descripcion === ''){
            error.descripcion = "Escriba una descripcion"
            validar = false
        }
        if (state.tipo === '') {
            error.tipo = "Seleccione un tipo de ticket"
            validar = false
        }
        
        setErrores(error)
        return validar
    }

    const enviar = () =>{
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
                    id_departamento: state.departamento,
                    tipo: state.tipo,
                    descripcion: state.descripcion,
                    fecha: formatDate(state.fecha),
                    solicitud: state.solicitud,
                }

                apiPostForm('ti', newForm, user.access_token)
                    .then((data) => {
                        Swal.fire({
                            title: 'Nuevo ticket',
                            text: 'Ticket creado correctamente',
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
            }   catch (error) { 
                    Swal.close()
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Ha ocurrido un error 2',
                    })
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
            <div className='nuevo_ticket'>
                        
                <div className='nuevo_ticket_departamento'>
                    <TextField 
                        label="Solicitante"
                        type="text"
                        defaultValue={departamento.departamentos[0].nombre}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        disabled
                    />
                </div>

                <div>
                    <InputLabel>Fecha</InputLabel>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                        <Grid>
                            <KeyboardDatePicker
                                className='nuevo_ticket_fecha'
                                format="dd/MM/yyyy"
                                name='fecha'
                                value={state.fecha}
                                // onChange={e=>handleChangeFecha(e,'fecha')}
                                // defaultValue={state.fecha}
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
                    <InputLabel>Tipo de ticket</InputLabel>
                    <Select
                        value={state.tipo}
                        name="tipo"
                        onChange={handleChange}
                        /* disabled={user.user.tipo.id ==1 ? false : true} */
                    >
                        <MenuItem value={0}>cambio</MenuItem>
                        <MenuItem value={1}>soporte</MenuItem>
                        <MenuItem value={2}>mejora</MenuItem>
                        <MenuItem value={3}>reporte</MenuItem>
                        <MenuItem value={4}>información</MenuItem>
                        <MenuItem value={5}>capacitación</MenuItem>
                        <MenuItem value={6}>funcionalidad</MenuItem>
                        <MenuItem value={7}>proyecto</MenuItem>
                    </Select>          
                </div>

                
                <div className='nuevo_ticket_departamento'>
                    <TextField
                        label="Descripcion"
                            // placeholder="Deja una descripción"
                        onChange={handleChange}
                        // margin="normal"
                        name='descripcion'
                        defaultValue={state.descripcion}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        multiline
                        maxRows={4}
                        // error={errores.descripcion ? true : false}
                    />
                </div>
            </div>

            <div className="nuevo_ticket_boton">
                <button className='sendButton' onClick={enviar}>Agregar</button>
            </div>
        </>
    )
}