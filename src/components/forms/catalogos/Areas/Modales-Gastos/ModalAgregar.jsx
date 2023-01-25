import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'

import axios from 'axios'
import Swal from 'sweetalert2'

import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import { apiPostForm } from '../../../../../functions/api'

// import '../Styles-Gastos/_agregarGastos.scss'

export default function ModalAgregar (props) {
    const {handleClose, reload} = props
    const user = useSelector(state=> state.authUser)
    const departamentos = useSelector(state => state.opciones.areas)

    const [form, setForm] = useState ({
        area:'',
        partida: '',
        subPartida: '',
        arraySubPartidas: []
    })

    

    const [errores, setErrores] = useState()

    const handleChangeArea = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
            partida: null,
            subPartida: null,
            arraySubPartidas: []
        })
    }

    const handleChangePartida = (event) => {
        let name = event.target.name
        setForm({
            ...form,
            [name]: event.target.value,
            arraySubPartidas: []
        })
    }

    const handleChangeSub = (e) => {
        if(form.arraySubPartidas.length > 0 ){
            if(form.arraySubPartidas.find((item => item.id === e.target.value))){

            } else {
                setForm({
                    ...form,
                    arraySubPartidas:[
                        ...form.arraySubPartidas,
                        {
                            id: e.target.value,
                        }
                    ]
                })
            }
           
        } else {
            setForm({
                ...form,
                arraySubPartidas:[
                    ...form.arraySubPartidas,
                    {
                        id: e.target.value,
                    }
                ]
            })
        }
    }

    console.log(form.arraySubPartidas)

    const handleDelete = (e) => {
        const indiceSub = form.arraySubPartidas.findIndex(sub => sub.id === e) //extraigo el indice se la subpartida que quiero eliminar
        const newSub = [...form.arraySubPartidas] // creo una copia de arraySubPartidas
        
        newSub.splice(indiceSub,1) // elimino la subpartida indicando el indice en donde se encontraba
        setForm({
            ...form,
            arraySubPartidas: newSub
        })
    }

    const validateForm = () => {
        let validar = true
        let error = {}
        if(form.area === ''){
            error.area = 'Selecciona un área'
            validar = false
        }
        if(form.partida === '' || form.partida === null){
            error.partida = 'Selecciona una partida'
            validar = false
        }
        if(form.subPartida === '' || form.subPartida === null){
            error.subPartida = 'Selecciona una sub partida'
            validar = false
        }
        setErrores (error)
        return validar
    }

    const enviar = (e) => {
        if(validateForm()){

            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                }
            }) 
        } else {

            let newForm = {
                id_area: form.area,
                id_partida: form.partida,
                id_subPartida: form.subPartida,
                /* [
                    {id:67, nombre: 'mano de obra'}
                    {id:43, nombre: 'mantenimiento'}
                    {id:67, nombre: 'mano de obra'}
                    {id:67, nombre: 'mano de obra'}
                ] */
            }
        
            apiPostForm('requisicion', newForm, user.access_token)
            .then((data)=>{
                Swal.close()
                Swal.fire({
                    icon: 'success',
                    title: 'Nueva Requisicion',
                    text: 'Se ha creado correctamente',
                    timer: 5000,
                    timerProgressBar: true,
                })
                handleClose()
                if(reload){
                    reload.reload()
                }
                
                if (data.isConfirmed) {  
                    Swal.fire('Se creó con éxito')
                }

                else if (data.isDenied) {
                    Swal.fire('Faltan campos', '', 'info')
                }
            })
            .catch((errores)=>{  
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error',
                })
            })
        }
        
    }
     //de aqui son nuevas funciones handlechange

     const handleChange=(e)=>{
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
     }
    const handleEnter=(e)=>{
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



    return (
        <>
        {/* AREA */}
        <div className="area">
            {departamentos.length > 0 ?
                <>
                    <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                    <Select
                        value={form.area}
                        name="area"
                        onChange={handleChangeArea}
                    >
                        {departamentos.map((item, index) => (
                            <MenuItem key={index} value={item.id_area}>{item.nombreArea}</MenuItem>
                        ))}

                    </Select>
                </>
                : null
            }
        </div>
        {errores && errores.area && form.area === '' &&<span className='error_area'>{errores.area}</span>}

        {/* PARTIDA */}
        {/* <div className="">  
            {departamentos.length > 0 && form.area !== ''?
                <>
                    <InputLabel id="demo-simple-select-label">Tipo de Gasto</InputLabel>
                    <Select
                        value={form.partida}
                        name="partida"
                        onChange={handleChangePartida}
                    >
                        {departamentos.find(item => item.id_area == form.area).partidas.map((item, index) => (
                            <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                        ))}
                    </Select>
                </>
                : null
            }
        </div>
        {errores && errores.partida && form.area !== '' && (form.partida === '' || form.partida === null) && <span className=''>{errores.partida}</span>} */}
        

        {/* SUBPARTIDA */}
        {/* <div className="">  
            {departamentos.length > 0 && form.partida ?
                <>
                    <InputLabel id="demo-simple-select-label">Tipo de Gasto</InputLabel>
                    <Select
                        value={form.subPartida}
                        name="subPartida"
                        onChange={handleChangeSub}
                    >
                        {departamentos.find(item => item.id_area == form.area).partidas.find(item => item.id ==                         form.partida).subpartidas.map((item, index) => (
                            <MenuItem key={index} value={item.id} >{item.nombre}</MenuItem>
                        ))}
                    </Select> 
                </>
                : null
            }
        </div> */}
        {/* <div>
            {
                form.arraySubPartidas.length > 0 && departamentos.length > 0 && form.partida ?
                <>
                    {departamentos.find(item => item.id_area == form.area).partidas.find(item => item.id ==                         form.partida).subpartidas.map((item, index) => (
                        form.arraySubPartidas.map((sub,index)=>{
                            if(sub.id === item.id){
                                return <div key={index} value={item.id} >{item.nombre}<span onClick={(e)=>{handleDelete(sub.id)}} >X</span></div>
                            }
                        })
                    ))}
                </>

                

                :null
            }
        </div> */}
        <div className="">  
            {departamentos.length > 0 && form.partida ?
                <>

                        {/* {departamentos.find(item => item.id_area == form.area).partidas.find(item => item.id == form.partida).subpartidas.map((item, index) => (
                            <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                        ))} */}

                </>
                : null
            }
        </div> 
        {errores && errores.subPartida && form.partida !== '' && form.partida !== null && (form.subPartida === '' || form.subPartida === null) &&<span>{errores.subPartida}</span>}

        <div>
            {/* en donde se van a insertar los tags de las subpartidas */}
            {/* 
                arraySubPartidas.map( item =>{
                    return <div key >{item.name} <span value={item.id} onClick={deleteTag}>X</span></div>
                    la funcion deleteTag debe buscar en arraySubPartida con un find item.id === e.target.value
                }

                )
            */}
        </div>

        <div>
            <label>Partida</label>
            <input name='partida' type='text' value={form.partida} onChange={handleChange}></input>
        </div>

        <div>
            <label>Subpartida</label>
            <input name='subPartida' type='text' value={form.subPartida} onKeyPress={handleEnter}  onChange={handleChange}></input>
        </div>

        <div>
            {
                form.arraySubPartidas.length > 0 && form.partida && form.partida !== '' ?
                <>
                    {form.arraySubPartidas.map(subpartida=>{
                        return <div><span onClick={(e)=>handleDeleteSub(subpartida.nombre)}>X</span>{subpartida.nombre}</div>
                    })}
                </>
                :null
            }
        </div>

        {/* <div>
            <input  type='text' onClick={()=>console.log('ajhbajkdhakjwd')}>
                Agregar
            </input>
        </div> */}
        </>
    )
}