import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { apiPostForm } from '../../../functions/api'

import nuevaRequisicion from '../../../styles/_nuevaRequisicion.scss'

const useStyles = makeStyles((theme) => ({
    formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    },
    selectEmpty: {
    marginTop: theme.spacing(2),
    },
}));

export default function NativeSelects() {
    const user = useSelector(state=> state.authUser)
    const departamentos = useSelector(state => state.opciones.areas)
    const gastos = useSelector(state => state.opciones.areas)
    console.log(user)
    const [state, setState] = useState({
        solicitante: user.user.id,
        fecha:new Date().toISOString().split('T')[0],
        departamento: '',
        tipo_gasto: '', //partida
        descripcion: '',
        solicitud: '',
    });
    
    const [errores, setErrores] = useState()

    const classes = useStyles();

    const handleFile = (e) => {
        console.log(e.target.files)
        setState({
            ...state,
            solicitud: e.target.files[0]
        })
    }

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

            let dataForm = new FormData()

            let newForm = {
                id_solicitante: state.solicitante,
                id_departamento: state.departamento,
                id_gasto: state.tipo_gasto,
                descripcion:state.descripcion,
                fecha: state.fecha
            }

            let aux = Object.keys(newForm)

            aux.forEach((element) => {
                switch (element) {               
                    case 'adjuntos':
                        break;
                    default:
                        dataForm.append(element, newForm[element])
                        break
                }
                
            })

            dataForm.append(`files_name_requisicion[]`, 'requisicion01')
            dataForm.append(`files_requisicion[]`, state.solicitud)
            dataForm.append('adjuntos[]', "requisicion")

            
            apiPostForm('requisicion', dataForm, user.access_token).then((data)=>{
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

    const handleChangeDepartamento = (e) => {
        console.log(e)
        setState({
            ...state,
            [e.target.name]: e.target.value,
            tipo_gasto: null,
        })
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
                
                <div>
                    {departamentos.length > 0 ?
                        <>
                            <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                            <Select
                                value={state.departamento}
                                name="departamento"
                                onChange={handleChangeDepartamento}
                            >
                                {departamentos.map((item, index) => (
                                    <MenuItem key={index} value={item.id_area}>{item.nombreArea}</MenuItem>
                                ))}

                            </Select>
                        </>
                        : null
                    }
                </div>
                {/* {errores && errores.departamento && <span>{errores.departamento}</span>} */}

                <div>
                    {departamentos.length > 0 && state.departamento !== ''?
                        <>
                            <InputLabel id="demo-simple-select-label">Tipo de Gasto</InputLabel>
                            <Select
                                value={state.tipo_gasto}
                                name="tipo_gasto"
                                onChange={handleChange}
                            >
                                {departamentos.find(item => item.id_area == state.departamento).partidas.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                ))}
                            </Select>
                        </>
                        : null
                    }
                </div>

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

            <div>
                <input type='file' onChange={handleFile}></input>
            </div>

            <div className='boton'>
                <button onClick={enviar} className='nuevaRequisicion_boton'>Agregar</button>
            </div>

        </div>

    );  
}