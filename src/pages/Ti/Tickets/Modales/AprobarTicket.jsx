import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';

import { apiGet, apiPostForm } from './../../../../functions/api'

import Swal from 'sweetalert2'

import Style from './TicketsTi.module.css'


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
            icon: 'warning',
            text: 'Una vez aprobado no se podrá modificar',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Aprobar',
            
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
            <div className={Style.containerList}>
                {
                    form.funcionalidades.length > 0 && form.funcionalidades.map((item, index )=>{
                        return <span className={Style.autorizado}>{`${index+1}.- `}{item}</span>
                        
                    })
                }
            </div>

        <div className="nuevo_ticket_boton">
            <button className='sendButton' onClick={aprobarTicket}>Aprobar</button>
        </div>

        </>
    )
    
}