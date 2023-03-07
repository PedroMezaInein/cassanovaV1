import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'

import axios from 'axios'
import Swal from 'sweetalert2'

import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import { apiPutForm } from '../../../functions/api'

import './AreaStyle/_agregarGasto.scss'
import { forEach } from 'lodash';

export default function ModalEditarGastos (props) {
    const {data, handleClose, reload} = props
    const user = useSelector(state => state.authUser)
    const [form, setForm] = useState({
        area: data.nombreArea,
        partida: data.partida.nombre,
        subPartida: '',// en este se guarda la informacion que se esta escribiendo
        auxSubPartida: [], // aqui se guardan cuando doy enter
        arraySubPartidas: [...data.partida.subpartidas], // este me sirve para mostrar todas las subpartidas, tanto las que ya existen como las nuevas
    })

    console.log(data)

    const handleChange=(e)=>{
        if(e.target.value.replace(/\s/g, '').length > 0){
            setForm({
                ...form,
                [e.target.name]:e.target.value,
            })    
        } else if(e.target.value.replace(/\s/g, '').length === 0){
            setForm({
                ...form,
                [e.target.name]:'',
            })    
        }
        
    }

    const handleEnterSub=(e)=>{
        if(e.key==='Enter' ){
            setForm({
                ...form,
                arraySubPartidas: [...form.arraySubPartidas, e.target.value],
                subPartida:'',
                auxSubPartida: [...form.auxSubPartida, e.target.value ]
            })
        }
    }

    const handleDeleteSub= (e) =>{
        const indiceSub = form.arraySubPartidas.findIndex(sub => {
            if(sub.nombre){
                
            } else {
                if(sub === e){
                    return sub
                }
            }
        })

        const auxIndiceSub = form.auxSubPartida.findIndex(sub => {
            if(sub.nombre){
                
            } else {
                if(sub === e){
                    return sub
                }
            }
        })


        let newSub = [...form.arraySubPartidas]
        newSub.splice(indiceSub,1) // elimino la subpartida indicando el indice en donde se encontraba
        let aux = [...form.auxSubPartida]
        aux.splice(auxIndiceSub,1) // elimino la subpartida indicando el indice en donde se encontraba
        setForm({
            ...form,
            arraySubPartidas: newSub,
            auxSubPartida: aux
        })
    }

    const submit = () =>{
        // if(validateForm()){
        if(true){

            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                }
            }) 

            let newForm = {
                area: form.area,
                id_area: data.id,
                partida: form.partida,
                id_partida: data.partida.id,
                arraySubPartidas: form.arraySubPartidas
                // subareasEditable: [],
                // subareas: form.arraySubPartidas.map((item, index) => {
                //     return item.nombre
                // }),
                // tipo: 'egresos'
            }
 
            apiPutForm(`v2/catalogos/areas/${data.id}`, newForm, user.access_token)
            .then((data)=>{
                Swal.close()
                Swal.fire({
                    icon: 'success',
                    title: 'editar gasto',
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
        }// 
        else{
            Swal.fire({
                title: 'Error',
                text: 'Favor de llenar todos los campos',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000,
            })
        }
    }

/*     const handleChangeSubpartidas = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value,
        })

    } */

    return (
        <>
            {/* <div className='titulo_gasto'>al escribir una nueva área o partida presiona enter para que esta sea creada</div> */}

            <div className='gasto_area'>

                <div>
                    <FormControl className='editar_comentario'>
                        <TextField 
                            // id="standard-full-width"
                            label="área"
                            style={{ margin: 8 }}
                            // placeholder="Deja un comentario"
                            // helperText="Full width!"
                            // fullWidth
                            onChange={handleChange}
                            onKeyPress={handleChange}
                            margin="normal"
                            name='area'
                            defaultValue={form.area}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                    </FormControl> 

                    <div className='etiqueta_gasto'>
                        {
                            form.area !== '' ?
                                <div>
                                    <span className='nombre_partida'>
                                        <span >X</span>{form.area}
                                    </span>
                                </div>
                            : null
                        }
                    </div> 
                </div>

                <div>
                    <FormControl className='editar_comentario'>
                        <TextField 
                            // id="standard-full-width"
                            label="partida"
                            style={{ margin: 8 }}
                            // placeholder="Deja un comentario"
                            // helperText="Full width!"
                            // fullWidth
                            onChange={handleChange}
                            onKeyPress={handleChange}
                            margin="normal"
                            name='partida'
                            defaultValue={form.partida}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                    </FormControl> 

                    <div className='etiqueta_gasto'>
                        {
                            form.partida !== '' ?
                                <div>
                                    <span className='nombre_partida'>
                                        <span >X</span>{form.partida}
                                    </span>
                                </div>
                            : null
                        }
                    </div> 
                </div>

            </div>

            {/* SUBPARTIDA */}

            <div className='subpartida_gasto'>
                <label>Subpartida</label>
                <input 
                    className=''
                    name='subPartida' 
                    type='text' 
                    placeholder="Enter para crear subpartida"
                    value={form.subPartida} 
                    onKeyPress={handleEnterSub}  
                    onChange={handleChange}>
                </input>

                <div className='gasto_etiqueta'>
                    {
                        form.arraySubPartidas.length > 0 ? 
                        form.arraySubPartidas.map((item) => {
                            if(item.nombre){
                                return <span className='sub_partida'>
                                            <span className='sub_eliminar'>X</span>
                                            <span className=''>{item.nombre}</span>
                                        </span>
                            } else{
                                return <span className='sub_partida'>
                                            <span className='sub_eliminar' onClick={(e)=>handleDeleteSub(item)}>X</span>
                                            <span className=''>{item}</span>
                                        </span>
                            }
                        })
                        : <div>No hay su partidas</div>
                    }  
                </div> 
            </div>

            {/* ENVIAR */}
            <div className='boton'>
                <button onClick={submit}>
                    Agregar
                </button> 
            </div>
        </>

    )
}


{/* {
    data.partida.subpartidas.map((item, index)=>{
    return <span className='sub_partida'>
                <span className='sub_eliminar' onClick={(e)=>handleDeleteSub(item.nombre)}>X</span>
                <span className=''>{item.nombre}</span>
            </span>
    })
}  */}