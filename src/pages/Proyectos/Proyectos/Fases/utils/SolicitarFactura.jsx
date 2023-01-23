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

export default function SolicitarFactura(props) {
    const user = useSelector((state) => state.authUser);
    const {proyecto, opciones} = props;
    const [form, setForm] = useState({
        clientes: proyecto.clientes ? proyecto.clientes : [],
    })

    console.log(opciones)

    useEffect(() => {
        
    }, [])


    return (
        <div>
            <div>
                <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
                    <Grid container justifyContent="space-around">
                        <KeyboardDatePicker
                            margin="normal"
                            label="Fecha de Inicio"
                            format="dd/MM/yyyy"
                            value={form.fechaInicio}
                            /* onChange={handleChangeFechaInicio} */
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                </MuiPickersUtilsProvider>
            </div>
        </div>
    )
}