import React, {useState} from 'react'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'

import { apiPostForm } from '../../../functions/api'

import './../../Catalogos/Areas/AreaStyle/_agregarGasto.scss'

export default function ModalAgregarGasto (props) {
    const {handleClose, reload} = props
    const user = useSelector(state=> state.authUser)

    const [form, setForm] = useState ({
        area:'',
        partida: '',
        createPartida: '',
        createArea: '',
        subPartida: '',
    })

    const submit = () =>{
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

    return (

        <>
        <div>Holi</div>
        </>
        
    )
}