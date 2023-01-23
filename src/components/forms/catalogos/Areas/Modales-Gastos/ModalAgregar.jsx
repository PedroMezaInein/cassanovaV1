import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { MultiSelect } from "react-multi-select-component";

import axios from 'axios'
import Swal from 'sweetalert2'

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

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

    const [selected, setSelected] = useState([]);

    const [errores, setErrores] = useState()

    const handleChangeArea = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
            partida: null,
            subPartida: null
        })
    }

    const handleChangePartida = (event) => {
        let name = event.target.name
        setForm({
            ...form,
            [name]: event.target.value
        })
    }

    const handleChangeSub = (event) => {
        let name = event.target.name

    }

    const options = [
        { label: "uvas jajaja lol 🍇", value: "grapes" },
        { label: "Mango 🥭", value: "mango" },
        { label: "Strawberry 🍓", value: "strawberry", disabled: true },
      ];

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
        <div className="">  
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
        {errores && errores.partida && form.area !== '' && (form.partida === '' || form.partida === null) && <span className=''>{errores.partida}</span>}
        

        {/* SUBPARTIDA */}
        <div className="">  
            {departamentos.length > 0 && form.partida ?
                <>
                    <InputLabel id="demo-simple-select-label">Tipo de Gasto</InputLabel>
                    {/* <Select
                        value={form.subPartida}
                        name="subPartida"
                        onChange={handleChange}
                    >
                        {departamentos.find(item => item.id_area == form.area).partidas.find(item => item.id == form.partida).subpartidas.map((item, index) => (
                            <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                        ))}
                    </Select> */}
                    <MultiSelect
                       options={options}
                       value={selected}
                       onChange={setSelected}
                       labelledBy='Select'
                    />
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
            <button className="" onClick={enviar}>
                Agregar
            </button>
        </div>
        </>
    )
}