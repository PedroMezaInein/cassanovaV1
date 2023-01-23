import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import DateFnsUtils from '@date-io/date-fns';
import Swal from 'sweetalert2'
import { es } from 'date-fns/locale'
import axios from 'axios';
import { URL_DEV } from '../../../../../constants'
import { ordenamiento, setOptions } from '../../../../../functions/setters'
import { setSingleHeader } from "../../../../../functions/routers"

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

export default function SolicitarFactura(props) {
    const user = useSelector((state) => state.authUser);
    const {proyecto, opciones} = props;
    const [form, setForm] = useState({
        cliente_id: proyecto.cliente_id,
        clientes: proyecto.clientes ? proyecto.clientes : [],
    })

    console.log(opciones)

    useEffect(() => {
        
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        })
    }


    return (
        <div>
            <div>
                <div>
                    <InputLabel id="label-select-Tipo">Cliente</InputLabel>
                    <Select
                        value={form.cliente_id}
                        name='cliente_id'
                        labelId="label-select-Tipo"
                        onChange={handleChange}
                    >
                        {form.clientes.map((item, index) => {
                            return (<MenuItem key={index} value={item.id} >{item.empresa}</MenuItem>)
                        })}

                    </Select>
                </div>

                <div>

                </div>
                
            </div>
        </div>
    )
}