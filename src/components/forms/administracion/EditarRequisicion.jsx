import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'

import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';

function EditarRequisicion (props) {

    const { data } = props
    const departamentos = useSelector(state => state.opciones.areas)
    const auth = useSelector(state => state.authUser)

    const [form, setForm] = useState({
        fecha: data.fecha,
        departamento: data.departamento_id,
        tipo_gasto: data.gasto ? data.gasto.nombre: 'no definido',
        descripcion: data.descripcion
    })
    console.log(data)

    return (
        <>
        <h2>aaaaah</h2>
        </>
    )
}

export { EditarRequisicion }