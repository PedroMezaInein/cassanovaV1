import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import TextField from '@material-ui/core/TextField';

import nuevaRequisicion from '../../../styles/_nuevaRequisicion.scss'

export default function NativeSelects() {
    const useStyles = makeStyles((theme) => ({
        formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        },
        selectEmpty: {
        marginTop: theme.spacing(2),
        },
    }));

    const classes = useStyles();
    const [state, setState] = React.useState({
      fecha: '',
      departamento: '',
      tipoEgreso: '',
      descripcion: '',
    });    
    
    const handleChange = (event) => {
    const name = event.target.name;
    setState({
        ...state,
        [name]: event.target.value,
    });
    };

    // const inputComentario = makeStyles((theme) => ({
    //     root: {
    //       '& .MuiTextField-root': {
    //         width: '45ch',
    //       },
    //     },
    // }));

    const inputComentario = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
          },
          textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            // width: '5ch',
          },
    }));


    const comentario = inputComentario();
    const [value, setValue] = React.useState('Controlled');

    const handleChangeComentario = (event) => {
        setValue(event.target.value);
    };
    
    return (
        <div className='nuevaRequisicion'>
            <div className='nuevaRequisicion_bloque1'>
                <FormControl className={classes.formControl}>
                    <form className={classes.container} noValidate>
                        <TextField
                            id="date"
                            label="Birthday"
                            type="date"
                            defaultValue="2017-05-24"
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                    </form>
                </FormControl>

                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="age-native-simple">Departamento</InputLabel>
                    <Select
                        native
                        value={state.departamento}
                        onChange={handleChange}
                        inputProps={{
                        name: 'departamento',
                        id: 'age-native-simple',
                        }}
                    >
                    <option aria-label="None" value="" />
                    <option value={10}>TI</option>
                    <option value={20}>Compras</option>
                    <option value={30}>Proyectos</option>
                    <option value={40}>RH</option>
                    <option value={50}>Mercadotecnia</option>
                    </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="age-native-simple">Tipo de egreso</InputLabel>
                    <Select
                        native
                        value={state.tipoEgreso}
                        onChange={handleChange}
                        inputProps={{
                        name: 'tipoEgreso',
                        id: 'age-native-simple',
                        }}
                    >
                    <option aria-label="None" value="" />
                    <option value={10}>A</option>
                    <option value={20}>B</option>
                    <option value={30}>C</option>
                    <option value={40}>D</option>
                    <option value={50}>E</option>
                    </Select>
                </FormControl>
            </div>

            <div className='nuevaRequisicion_comentario'>
               <FormControl className={comentario.root}>
                    <TextField 
                        // id="standard-full-width"
                        label="Comentario"
                        style={{ margin: 8 }}
                        placeholder="Deja un comentario"
                        // helperText="Full width!"
                        // fullWidth
                        margin="normal"
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </FormControl> 
            </div>

        </div>

    );  
}