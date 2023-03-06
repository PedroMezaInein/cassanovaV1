import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'

import axios from 'axios'
import Swal from 'sweetalert2'

import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import { apiPostForm } from '../../../functions/api'

import './AreaStyle/_agregarGasto.scss'

export default function ModalAgregar (props) {
    const {data, handleClose, reload} = props
    const user = useSelector(state=> state.authUser)

    const [form, setForm] = useState ({
        area: data.nombreArea,
        partida: data.partida.nombre,
        subPartida: data.partida.subpartidas,
    })

    console.log(data)
    console.log(data.partida.subpartidas[].nombre)

    const [errores, setErrores] = useState()

     //de aqui son nuevas funciones handlechange

    const handleChangeCreateArea=(e)=>{
        if(e.key==='Enter' ){
            setForm({
                ...form,
                createArea:'',
                i_selectArea: '',
                createPartida: null,
                subPartida: null,
                arraySubPartidas: [],
                area: e.target.value
            })
        } else {
            setForm({
                ...form,
                [e.target.name]:e.target.value,
            })   
        }
    }

    const handleChange=(e)=>{
    setForm({
        ...form,
        [e.target.name]:e.target.value,
        })

    }

    const handleEnterSub=(e)=>{
        if(e.key==='Enter' ){
            setForm({
                ...form,
                arraySubPartidas: [...form.arraySubPartidas, {nombre:form.subPartida}],
                subPartida:''
            })
        }
    }

    const handleDeleteSub= (e) =>{
        const indiceSub = form.arraySubPartidas.findIndex(sub => sub.nombre === e)
        const newSub = [...form.arraySubPartidas]
        newSub.splice(indiceSub,1) // elimino la subpartida indicando el indice en donde se encontraba
        setForm({
            ...form,
            arraySubPartidas: newSub
        })
    }

    const handleChangePrueba = (e) =>{
        if(e.key==='Enter' ){
            setForm({
                ...form,
                createPartida:'',
                i_select: '',
                subPartida: null,
                arraySubPartidas: [],
                partida: e.target.value
            })
        } else {
            setForm({
                ...form,
                [e.target.name]:e.target.value,
            })   
        }
    }

    const handleDeletePartida = ()=>{
        setForm({
            ...form,
            partida:''
        })
    }

    const handleDeleteArea = ()=>{
        setForm({
            ...form,
            area:''
        })
    }

    const validateForm = () => {
        let validar = true
        let error = {}
        if(form.area === ''){
            error.area = 'Crea un área'
            validar = false
        }
        if(form.partida === '' || form.partida === null){
            error.partida = 'Crea una partida'
            validar = false
        }
        if(form.subPartida === '' || form.subPartida === null){
            error.subPartida = 'Crea una o varias sub partidas'
            validar = false
        }
        setErrores (error)
        return validar
    }

    const submit = () =>{
        // if(Object.keys(validateForm()).length ===0){
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
                partida: form.partida,
                subarea: '',
                // subareasEditable: [],
                subareas: form.arraySubPartidas.map((item, index) => {
                    return item.nombre
                }),
                tipo: 'egresos'
            }
 
            apiPostForm('areas', newForm, user.access_token)
            .then((data)=>{
                Swal.close()
                Swal.fire({
                    icon: 'success',
                    title: 'Nueva gasto',
                    text: 'Se ha creado correctamente',
                    timer: 5000,
                    timerProgressBar: true,
                })
                // handleClose()
                // if(reload){
                //     reload.reload()
                // }
               
                
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

    return (

        <div>

            <div className='titulo_gasto'>Crea un área nueva para depués poder crear una partida</div>

            <div className='gasto_area'>

                {/* AREA */}

                {/* CREAR AREA */}
                <div>
                
                    <div>
                        <TextField 
                            label="Crea un área"
                            // style={{ margin: 8 }}
                            placeholder="Enter para crear área"
                            onChange={handleChangeCreateArea}
                            onKeyPress={handleChangeCreateArea}
                            // margin="normal"
                            name='createArea'
                            value={form.createArea}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        /> 
                    </div>
                    {/* {errores && errores.area && form.area === '' &&<span className='error_departamento'>{errores.area}</span>} */}

                
                    <div className='etiqueta_gasto'>
                        {
                            form.area !== '' ?
                                <div>
                                    <span className='nombre_partida'>
                                        <span onClick={e=>{handleDeleteArea(e)}}>X</span>{form.area}
                                    </span>
                                </div>
                            : null
                        }
                    </div> 

                </div>

                {/* PARTIDAS */}
                
                <div>
                    { form.area !== '' ? 
                        <div>
                            <TextField 
                                label="Crea una partida"
                                // style={{ margin: 8 }}
                                placeholder="Enter para crear partida"
                                onChange={handleChangePrueba}
                                onKeyPress={handleChangePrueba}
                                // margin="normal"
                                name='createPartida'
                                value={form.createPartida}
                                InputLabelProps={{
                                shrink: true,
                                }}
                            /> 
                        </div> 
                    :
                    null
                    }
                     
                    <div className='etiqueta_gasto'>

                        {
                            form.partida !== '' ?
                                <div>
                                    <span className='nombre_partida'>
                                        <span onClick={e=>{handleDeletePartida(e)}}>X</span>{form.partida}
                                    </span>
                                </div>
                            : null
                        }

                    </div>  
                </div>
                {/* {errores && errores.partida && form.partida === '' &&<span className='error_departamento'>{errores.partida}</span>} */}

                {/* {errores && errores.partida && form.area !== '' && form.area !== null && (form.partida === '' || form.partida === null) &&<span>{errores.partida}</span>} */}


            </div>

            <div className='subpartida_gasto'>
                { form.partida && form.partida !== ''?
                    <>
                        <label>Subpartida</label>
                        <input 
                            className=''
                            name='subPartida' 
                            type='text' 
                            placeholder="Enter para crear subpartida"
                            value={form.subPartida ? form.subPartida : ''} 
                            onKeyPress={handleEnterSub}  
                            onChange={handleChange}>
                        </input>
                    </>
                    : null
                } 
            </div>

            <div className='subpartidas'>
                {
                    form.arraySubPartidas.length > 0 && form.partida && form.partida !== '' ?
                        <>
                            {form.arraySubPartidas.map(subpartida=>{
                                return <>
                                    <span className='sub_partida'>
                                        <span className='sub_eliminar' onClick={(e)=>handleDeleteSub(subpartida.nombre)}>X</span>
                                        <span className=''>{subpartida.nombre}</span>
                                    </span>
                                </>
                            })}
                        </>
                    :null
                }
            </div>
            {/* {errores && errores.subPartida && form.subPartida === '' &&<span className='error_departamento'>{errores.subPartida}</span>} */}
            
            {/* {errores && errores.subPartida && form.partida !== '' && form.partida !== null && (form.subPartida === '' || form.subPartida === null) &&<span>{errores.subPartida}</span>} */}


            {/* ENVIAR */}
            <div className='boton'>
                <button onClick={submit}>
                    Agregar
                </button> 
            </div>
        </div>
        
    )
}