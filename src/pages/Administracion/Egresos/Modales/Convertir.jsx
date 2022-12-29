import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Style from './AprobarSolicitud.module.css'

const useStyles = makeStyles((theme) => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

export default function Convertir(props) { 
    const { data } = props
    const classes = useStyles();
    return (
        <>
            <div className={Style.container}>
                
                <div>
                    <TextField
                        id="date"
                        label="Fecha de solicitud"
                        type="date"
                        defaultValue="2017-05-24"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        disabled
                    />    
                </div>

                <div>
                    <TextField
                        id="departamento"
                        label="Departamento"
                        type="text"
                        defaultValue="Proyectos"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        disabled
                    />    
                </div>

                <div>
                    <TextField
                        id="tipoGasto"
                        label="Tipo de gasto"
                        type="text"
                        defaultValue="Proyectos"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        disabled
                    />    
                </div>
                
                <div>
                    <InputLabel id="demo-simple-select-label">Tipo de Subgasto</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={10}
                    >
                        <MenuItem value={10}>Proyectos</MenuItem>
                        <MenuItem value={20}>Mantenimiento</MenuItem>
                        <MenuItem value={30}>Otros</MenuItem>
                    </Select>    
                </div>
                
                <div>
                    <InputLabel id="demo-simple-select-label">Tipo de Pago</InputLabel>  
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={10}
                    >
                        <MenuItem value={10}>Transferencia Bancaria</MenuItem>
                        <MenuItem value={20}>Cheque</MenuItem>
                        <MenuItem value={30}>Efectivo</MenuItem>
                    </Select>
                </div>

                <div>
                    <TextField
                        id="montoSolicitado"
                        label="Monto solicitado"
                        type="number"
                        defaultValue="456.00"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />    
                </div>
                
            </div>
        </>
    )
}