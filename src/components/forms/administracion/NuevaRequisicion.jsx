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
import axios from 'axios'
import { apiPostForm } from '../../../functions/api'

import nuevaRequisicion from '../../../styles/_nuevaRequisicion.scss'
import { isClassExpression } from "typescript";

const useStyles = makeStyles((theme) => ({
    formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    },
    selectEmpty: {
    marginTop: theme.spacing(2),
    },
}));

export default function NativeSelects({at}) {
    const user = useSelector(state=> state.authUser)
    console.log(user)
    const [state, setState] = useState({
        solicitante: user.user.id,
        fecha:new Date().toISOString().split('T')[0],
        departamento: '',
        tipo_gasto: '',
        descripcion: '',
    });
    
    const [errores, setErrores] = useState()

    const classes = useStyles();

    const handleChange = (event) => {
        // name son los diferentes tipos de atributos (departamento, fecha...)
        let name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
        console.log('hola')
        console.log(name)
    };

    console.log(state)

    const inputComentario = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
          },
          textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
          },
    }));

    const comentario = inputComentario();
    // const [value, setValue] = useState('Controlled');

    // const handleChangeComentario = (event) => {
    //     setValue(event.target.value);
    // };

    const validacion= ()=> {
        let error = {}
        if(state.departamento === ''){
            error.departamento = 'No has seleccionado un departamento'
        }
        setErrores(error)
        return error
    }

    const enviar = () =>{
        /* if(Object.keys(validacion()).length ===0){ */
        if(true){
            Swal.fire('Requisicion creada con éxito', '', 'success')
            console.log(state)
            apiPostForm('requisicion', state, user.access_token).then((data)=>{
                if (data.isConfirmed) {
                    // console.log(e)
                    let form = {
                        solicitante: user.user.id,
                        fecha: '',
                        departamento: '',
                        tipo_gasto: '',
                        descripcion: '',
                    }
                    
                    console.log('form')
                    console.log(form)
                    Swal.fire('Se aceptó el permiso', '', 'success') 
                }
                else if (data.isDenied) {
                  Swal.fire('Changes are not saved', '', 'info')
                }
            })
            .catch((err)=>{

            })
        } else{
            Swal.fire('Faltan campos', '', 'info')
        }
    }
    
    return (
        <div className='nuevaRequisicion'>
            <div className='nuevaRequisicion_bloque1'>
                <div>
                <TextField className={classes.formControl}
                        label="Solicitante"
                        type="text"
                        defaultValue={user.user.name}
                        // className={classes.textField}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        disabled
                    />
                </div>
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
                    <option value={82}>TI</option>
                    <option value={81}>Compras</option>
                    <option value={77}>Proyectos</option>
                    <option value={86}>RH</option>
                    <option value={87}>Mercadotecnia</option>
                    </Select>
                </FormControl>
                {errores && errores.departamento && <span>{errores.departamento}</span>}

                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="age-native-simple">Tipo de egreso</InputLabel>
                    <Select
                        native
                        value={state.tipo_gasto}
                        onChange={handleChange}
                        inputProps={{
                        name: 'tipo_gasto',
                        id: 'age-native-simple',
                        }}
                    >
                    <option aria-label="None" value="" />
                    <option value={10}>A</option>
                    <option value={20}>B</option>
                    <option value={30}>C</option>
                    <option value={25}>D</option>
                    <option value={12}>E</option>
                    </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                    <form className={classes.container} noValidate>
                        <TextField
                            id="fecha"
                            label="Fecha"
                            type="date"
                            name='fecha'
                            onChange={handleChange}
                            defaultValue={state.fecha}
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                    </form>
                </FormControl>
            </div>

            <div className='nuevaRequisicion_comentario'>
               <FormControl className={comentario.root}>
                    <TextField 
                        // id="standard-full-width"
                        label="Descripcion"
                        style={{ margin: 8 }}
                        placeholder="Deja un comentario"
                        // helperText="Full width!"
                        // fullWidth
                        onChange={handleChange}
                        margin="normal"
                        name='descripcion'
                        defaultValue={state.descripcion}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </FormControl> 
            </div>
            <div className='boton'>
                <button onClick={enviar} className='nuevaRequisicion_boton'>Agregar</button>
            </div>

        </div>

    );  
}