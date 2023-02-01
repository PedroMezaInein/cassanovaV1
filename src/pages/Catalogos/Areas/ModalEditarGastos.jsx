import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'

import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import Swal from 'sweetalert2'

export default function ModalEditarGastos (props){

    const { data, handleClose, reload } = props
    const departamentos = useSelector(state => state.opciones.areas)
    const user = useSelector(state => state.authUser)

    console.log(data)
    console.log(data.nombreArea)
    console.log(data.data.id_area)
    console.log(data.partida.subpartidas[0].nombre)

    const [form, setForm] = useState({
        // area: data.nombreArea,
        // partida: data.partida.nombre,
        // subpartida: 
    })
    console.log(form)

    return(
        <>
            <div>
                {
                    data.partida.subpartidas.map((item, index)=>{
                        return <div key={index}>{item.nombre}</div>
                    })
                } 
                <h1>hola</h1>
            </div>

            <div>
                
            </div> 
        </>
    )
}