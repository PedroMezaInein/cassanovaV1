import React, {useState} from 'react'
import { useSelector } from 'react-redux'

import { apiPutForm } from '../../../functions/api'

import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Swal from 'sweetalert2'

export default function ModalModificarSubGasto (props){

    const { data, handleClose, reload , selectOptions} = props
    const user = useSelector(state => state.authUser)

    const [form, setForm] = useState({
        // subGasto: data.subpartida.map((item,index) => (item.nombre))
    })

    const [errores, setErrores] = useState()

    console.log(data)

    /* 
    {
        nombre:"otros",
        id: 54
    } */

    const handleChange = (event) => {
        let name = event.target.name;
        setForm({
            ...form,
            [name]: event.target.value,
        });
        console.log(name)
    };


    const handleSave = () => {
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
                <h4>Eliminarás el sub gasto "{data.nombre}"</h4>
                {/* <h4>Eliminarás el sub gasto "{data.subpartida.map(item => item.nombre )}"</h4> */}
                <br></br>
                <div>y tiene **** compras asignadas</div>
                <br></br>

                <div>
                    <InputLabel id="demo-simple-select-label">Selecciona el sub gasto que lo reemplazará</InputLabel>
                    <Select
                        value={form.subGasto}
                        name="subGasto"
                        // onChange={handleChangeArea}
                    >
                        {
                            selectOptions.subpartida.map((item,index) => (
                                <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                            ))
                        }

                    </Select>
                </div>

                <div>
                    <button onClick={handleSave}>Aceptar</button>
                </div>
            </div>

        </>
    )
}