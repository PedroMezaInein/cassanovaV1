import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'

import { apiPutForm, apiOptions } from '../../../functions/api'
import axios from 'axios'
import { URL_DEV } from './../../../constants'
import { setSingleHeader } from './../../../functions/routers'

import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Swal from 'sweetalert2'

export default function ModalModificarSubGasto (props){

    const { data, handleClose, reload , dataGeneral} = props
    const user = useSelector(state => state.authUser)
    const [contadorRelaciones, setContadorRelaciones] = useState(0)
    console.log(contadorRelaciones)

    const [form, setForm] = useState({
        idsubGasto: '',
        idsubGastoViejo: data.id,
        arraySubGastos: ''
    })
    console.log(form)

    useEffect(() => {
        contador()
    }, [])

    console.log(dataGeneral)
    // console.log(data)
    // console.log(data.nombre)

    const handleChange = (event) => {
        let name = event.target.name;
        setForm({
            ...form,
            [name]: event.target.value,
            // subGasto: null
        });
        // console.log(name)
    };

    const contador = () => {
        axios.options(`${URL_DEV}v2/catalogos/areas/gastos?id=${data.id}&tipo=${'gastos'}`, { headers: setSingleHeader(user.access_token) })
        .then((response) => {
            setContadorRelaciones(response.data.areas)
            // return(
            //     <>
            //         {
            //             form.datoContador && form.datoContador < 1 ?
            //                 console.log('hola')
            //             :
            //             console.log('adios')
            //         }
            //     </>
            // ) 
            // setContadorRelaciones(response.data.areas)
            /* console.log(response.data) */
            // if(response.data.subareas.length === 0) {
            /* if(response.data.areas > 0) {
                console.log(response.data.areas)
            }else{
                console.log('adios')
            } */
        })
    }

    const handleChangeSubGasto = () => {
        if(true){

            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                }
            }) 
            try {

                let newForm = {
                    id_subGasto: form.idsubGasto,
                }
                console.log(newForm.id_subGasto)

                apiPutForm(`insumos/${data.id}`, newForm, user.access_token)
                    .then((data) => {
                        Swal.fire({
                            title: 'insumo',
                            text: 'se ha editado correctamente',
                            icon: 'success',
                            showConfirmButton: true,
                            timer: 2000,
                        }).then(() => {
                            if (reload) {
                                reload.reload()
                            }
                            handleClose()
                        })
                    })
                    .catch((error) => {
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ha ocurrido un error 1',
                        })
                        console.log(error)
                    })
            } catch (error) { 
                console.log(error)
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error 2',
                })
                console.log(error)
            }
        } else{
            Swal.fire({
                title: 'Faltan campos',
                text: 'Favor de llenar todos los campos',
                icon: 'info',
                showConfirmButton: false,
                timer: 2000,
            })
        }
    }

    return(
        <> 
        {
            contadorRelaciones !== 0  ?
            <div> 
                <h4>Eliminarás el sub gasto "{data.nombre}"</h4>
                <br></br>
                <div>y tiene compras {contadorRelaciones} asignadas</div>
                <br></br>

                <div>
                    <InputLabel id="demo-simple-select-label">Selecciona el sub gasto que lo reemplazará</InputLabel>
                    <Select
                        value={form.idsubGasto}
                        name="idsubGasto"
                        onChange={handleChange}
                    >
                        {
                            dataGeneral.subpartida.map((item,index) => {
                                if(item.id !== data.id){
                                    return <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                }   
                            })
                        }

                    </Select>
                </div>
                <div>
                    <button onClick={handleChangeSubGasto}>Aceptaaaar</button>
                </div>
            </div>
            
            :<div>
                <h5>estás seguro de eliminar este sub gasto?</h5>
                <div>
                    <button>Aceptar</button>
                    <button>Cancelar</button>
                </div>
            </div>
            
        }
        </>
    )
}