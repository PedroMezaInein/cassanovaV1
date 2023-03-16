import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';

import { apiGet } from './../../../../functions/api'

import Swal from 'sweetalert2'

export default function AprobarTicket (props) {

    const { data } = props

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

    return(
        <>
        <div>
            {
                form.funcionalidades.length > 0 && form.funcionalidades.map(item=>{
                    return <span>{item}</span>
                    
                })
            }
        </div>
        </>
    )
    
}