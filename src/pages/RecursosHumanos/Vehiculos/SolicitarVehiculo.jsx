import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import { apiPostForm, apiGet, apiPutForm } from '../../../functions/api';
import Swal from 'sweetalert2'
import '../../../styles/_salaJuntas.scss'

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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

//   const useStyles = makeStyles((theme) => ({
//     root: {
//       '& .MuiTextField-root': {
//         margin: theme.spacing(1),
//         width: '25ch',
//       },
//     },
//   }));

export default function SolicitarVehiculo({ closeModal, rh, }) {
    const userAuth = useSelector((state) => state.authUser);

    const [form, setForm] = useState({   
        fecha_inicio:new Date().toISOString().split('T')[0],
        fecha_final:new Date().toISOString().split('T')[0],
    });

    // MATERIAL UI
    const classes = useStyles();
    const [value, setValue] = React.useState('Controlled');
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const [currency, setCurrency] = useState('camioneta 2');

    const opciones = [
        {
            value: 'camioneta 1',
            label: 'camioneta 1',
        },
        {
            value: 'camioneta 2',
            label: 'camioneta 2',
        }
    ]

    const horas = [
        { id: 1, hora: '09:00', disabled: false },
            { id: 2, hora: '09:30', disabled: false },
            { id: 3, hora: '10:00', disabled: false },
            { id: 4, hora: '10:30', disabled: false },
            { id: 5, hora: '11:00', disabled: false },
            { id: 6, hora: '11:30', disabled: false },
            { id: 7, hora: '12:00', disabled: false },
            { id: 8, hora: '12:30', disabled: false },
            { id: 9, hora: '13:00', disabled: false },
            { id: 10, hora: '13:30', disabled: false },
            { id: 11, hora: '14:00', disabled: false },
            { id: 12, hora: '14:30', disabled: false },
            { id: 13, hora: '15:00', disabled: false },
            { id: 14, hora: '15:30', disabled: false },
            { id: 15, hora: '16:00', disabled: false },
            { id: 16, hora: '16:30', disabled: false },
            { id: 17, hora: '17:00', disabled: false },
        { id: 18, hora: '17:30', disabled: false },
    ]

    const handleChangeVehiculo = (event) => {
        setCurrency(event.target.value);
      };

    return (
        <>
            <div className='vehiculo_reserva'>
                <div>Selecciona la fecha y hora del uso del vehículo</div>
                <form className={classes.container} noValidate>
                    <TextField
                        id="datetime-local"
                        label="Fecha y hora solicitada"
                        type="datetime-local"
                        name='fecha_inicio'
                        // defaultValue="2017-05-24T10:30"
                        defaultValue={form.fecha_inicio}
                        className={classes.textField}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </form> 

                <form className={classes.container} noValidate>
                    <TextField
                        id="datetime-local"
                        label="Fecha y hora estimada de termino"
                        type="datetime-local"
                        name='fecha_final'
                        defaultValue={form.fecha_final}
                        className={classes.textField}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </form> 
            </div>

            <div className='vehiculo_general'>
                <div>
                    <TextField className='nuevaRequisicion_solicitante'
                        label="Solicitante"
                        type="text"
                        defaultValue={"Sulem Pastrana"}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        disabled
                    />
                </div>

                <div>
                    <TextField
                        id="standard-multiline-static"
                        label="Descripción"
                        multiline
                        rows={4}
                        // defaultValue="Default Value"
                    />
                </div>

                <div>
                    <InputLabel id="demo-simple-select-label">Camioneta</InputLabel>
                        <Select
                            value={currency}
                            name="tipo_gasto"
                            onChange={handleChangeVehiculo}
                        >
                            {opciones.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                </div>

                <div>
                    <TextField
                        id="standard-multiline-static"
                        label="Destino"
                        multiline
                        rows={4}
                        // defaultValue="Default Value"
                    />
                </div>
            </div>
        </>
    )     
}