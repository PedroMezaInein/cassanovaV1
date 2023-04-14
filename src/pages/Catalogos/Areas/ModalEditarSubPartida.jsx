import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'

import { apiPutForm, apiPostForm} from '../../../functions/api'

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

import Swal from 'sweetalert2'

export default function ModalEditarSubPartida (props){

    const { data, handleClose, reload } = props
    const user = useSelector(state => state.authUser)

    const [form, setForm] = useState({
        subpartida: data.nombre
    })

    const [errores, setErrores] = useState()

    console.log(form)
    console.log(data)

    const handleChange = (event) => {
        let name = event.target.name;
        setForm({
            ...form,
            [name]: event.target.value,
        });
        console.log(name)
    };

    const validateForm = () => {
        let validar = true
        let error = {}
       
        if(form.subpartida === ''){
            error.subpartida = "Escriba una sub partida"
            validar = false
        }
        setErrores(error)
        return validar
    }

    const handleSave = () => {
        if(validateForm()){

            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                }
            }) 
    
            let newForm = {
                id_subarea: form.subpartida,
            }

            apiPutForm(`requisicion/${data.id}`, newForm, user.access_token)
            .then((response)=>{
                Swal.close()
                Swal.fire({
                    icon: 'success',
                    tittle: 'Editar requisición',
                    text: 'Se ha editado correctamente',
                    timer: 2000,
                    timerProgressBar: true,
                })
                handleClose()
                if(reload){
                    reload.reload()
                }
            }) 

            .catch((error)=>{  
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error',
                })
            })
        }
        
        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Todos los campos son obligatorios',
            })
        }
    }

    return(
        <>
            <div> 
                {/* {data.nombre} */}

                <div className=''>
                    <FormControl className=''>
                        <TextField 
                            label="Sub partida"
                            style={{ margin: 8 }}
                            margin="normal"
                            name='subpartida'
                            defaultValue={form.subpartida}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            disabled
                        />
                    </FormControl> 
                </div>

                <div className=''>
                    <FormControl className=''>
                        <TextField 
                            label="Nueva sub partida"
                            style={{ margin: 8 }}
                            placeholder="Escribe una sub partida"
                            onChange={handleChange}
                            margin="normal"
                            name='subpartida'
                            defaultValue={''}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                    </FormControl> 
                </div>
                {errores && errores.subpartida && <span className='error_subpartida'>{errores.subpartida}</span>}

                <div>
                    <button onClick={handleSave}>Aceptar</button>
                </div>
            </div>

        </>
    )
}