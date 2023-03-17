import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';

import { apiGet, apiPostForm } from './../../../../functions/api'

import Swal from 'sweetalert2'

export default function AprobarTicket (props) {

    const { data, reload } = props

    const userAuth = useSelector((state) => state.authUser.access_token);

    const [form, setForm] = useState ({
        funcionalidades: [],
    })

    useEffect(() => {
        getFuncionalidades()
    }, [])
    console.log(form)

    const getFuncionalidades = () => {
        apiGet(`ti/funcionalidad/${data.id}`, userAuth).then((response) => {
            let aux = []
            response.data.funcionalidades.map((item)=> {
                 aux.push(item.descripcion)
            })
            setForm({
                ...form,
                funcionalidades: aux,
            })
        })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ocurrió un error al obtener los colaboradores',
                })
            })
    }

    const aprobarTicket = ()=>{

        Swal.fire({
            title: '¿Estás seguro de aprobar las funcionalidades?',
            icon: 'question',
            // input: 'textarea',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            
          }).then((result) => {
            console.log(result)
            if (result.isConfirmed) {
                apiPostForm(`ti/autorizar/${data.id}`, {estatus: "0"}, userAuth).then((response) => {
                    if(reload) {
                        reload.reload()
                    }
                })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ocurrió un error al agregar el colaborador',
                        })
                    })
                Swal.fire('Se aprobó con éxito', '', 'success') 
            }
            else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
        })
    }

    return(
        <>
        <div>
            {
                form.funcionalidades.length > 0 && form.funcionalidades.map(item=>{
                    return <span>{item}</span>
                    
                })
            }
        </div>

        <div className="nuevo_ticket_boton">
            <button className='sendButton' onClick={aprobarTicket}>Aprobar</button>
        </div>

        </>
    )
    
}