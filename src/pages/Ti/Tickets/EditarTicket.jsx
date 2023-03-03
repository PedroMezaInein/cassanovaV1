import React, {useState} from 'react'
import { useSelector } from "react-redux";
import { apiPutForm } from './../../../functions/api'

import Swal from 'sweetalert2'

import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default function EditarTicket (props) {

    const { data, handleClose, reload } = props

    const user = useSelector(state => state.authUser)
    const departamento = useSelector(state => state.authUser.departamento)
    console.log(data)

    const [state, setState] = useState({
        tipo: data.id_tipo ? data.id_tipo : 'sin definir',
        descripcion: data.descripcion ? data.descripcion : 'sin definir',
        // fecha: data.fecha ? data.fecha : 'sin definir',
        id: data.id
    })

    const handleSave = () => {
        // if(validateForm()){
        if(true){

            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                }
            }) 
    
            let newForm = {
                tipo: state.id_tipo,
                descripcion: state.descripcion,
                // fecha: state.fecha,
            }

            apiPutForm(`ti/${data.id}`, newForm, user.access_token)
            .then((response)=>{
                Swal.close()
                Swal.fire({
                    icon: 'success',
                    tittle: 'Editar requisición',
                    text: 'Se ha editado correctamente',
                    timer: 2000,
                    timerProgressBar: true,
                })
                handleClose()
                if(reload){
                    reload.reload()
                }
            }) .catch((error)=>{  
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error',
                })
            })
  
        }   else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Todos los campos son obligatorios',
                })
            }
    }


    return (
        <>
            <div className='nuevo_ticket'>
                <div>
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
                    <InputLabel>Tipo de ticket</InputLabel>
                    <Select
                        value={state.tipo}
                        name="tipo"
                        // onChange={handleChange}
                        disabled
                    >
                        <MenuItem value={0}>Mantenimiento</MenuItem>
                        <MenuItem value={1}>Nuevo módulo</MenuItem>
                        <MenuItem value={2}>Error en plataforma</MenuItem>
                    </Select>          
                </div>

                <div>
                    <TextField
                        label="Descripcion"
                            // placeholder="Deja una descripción"
                        // onChange={handleChange}
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
                <button className='sendButton' onClick={handleSave}>Agregar</button>
            </div>
        </>
    )
}