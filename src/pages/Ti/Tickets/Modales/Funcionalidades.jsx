import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'

import Swal from 'sweetalert2'
import { apiGet, apiPutForm, apiPostForm } from '../../../../functions/api'

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import Style from './TicketsTi.module.css'

export default function Funcionalidades(props) { 
    const { data, reload, handleClose } = props
    const authUser = useSelector(state => state.authUser)
    const [funcionalidad, setFuncionalidad] = useState({
        id: data.id,
        descripcion: '',
        fecha: data.fecha,
        tipo: ''
    })

    useEffect(() => {
        getFuncionalidades()
        getOptions()
    }, [])

    function reformatDate(input) {
        var datePart = input.match(/\d+/g),
            year = datePart[0].substring(2), // get only two digits
            month = datePart[1], day = datePart[2];

        return month + '/' + day + '/' + year;
    }

    const getFuncionalidades = () => {
        apiGet(`ti/funcionalidad/${data.id}`, authUser.access_token)
            .then((data) => {
                console.log(data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const getOptions = () => {
        apiGet(`ti/options`, authUser.access_token)
            .then((data) => {
                console.log(data)
            })
            .catch((error) => {
                console.log(error)
            })
    }


    const postFuncionalidad = () => {
        apiPostForm(`ti/add`, funcionalidad, authUser.access_token)
            .then((data) => {
                console.log(data)
                getFuncionalidades()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleEnter = e => {
        if (e.key === 'Enter') {
            
        }
    }

    const handleChange = (e) => {
        setFuncionalidad({
            ...funcionalidad,
            [e.target.name]: e.target.value
        })
    }

    return (
        <>
            <div className={Style.container}>
                <div>
                    <div>
                        <InputLabel>Descripcion</InputLabel>
                        <TextField
                            name="descripcion"
                            value={funcionalidad.descripcion}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <InputLabel>Tipo</InputLabel>
                        <Select
                            name="tipo"
                            value={funcionalidad.tipo}
                            onChange={handleChange}
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
                </div>
            </div>
            <div className="row justify-content-end">
                <div className="col-md-4">
                    <button className={Style.sendButton} type="submit" onClick={postFuncionalidad}>Agregar</button>
                </div>
            </div>
        </>
    )
}