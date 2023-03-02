import React, {useState} from 'react'
import { useSelector } from "react-redux";

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
        tipo: data.id_tipo,
        descripcion: data.descripcion,
        fecha: data.fecha,
        id: data.id
    })

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
                <button className='sendButton'>Agregar</button>
            </div>
        </>
    )
}