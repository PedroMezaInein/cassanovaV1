import React from 'react';
import { useState } from 'react'
import { useSelector } from 'react-redux';

import $ from 'jquery'
import swal from 'sweetalert2'

import{ printResponseErrorAlert } from './../../../../functions/alert'
import { apiPutForm } from '../../../../functions/api'

import './../../../../styles/_modal_form.scss'

export default function EdithLicenciaForm(props) {
    const { licencia} = props
    let { tipo, nombre, duracion, cantidad, codigos, id } = licencia
    codigos = JSON.parse(codigos)
    codigos = codigos.map((codigo)=>{
        return {
            code: codigo.token,
            flag: codigo.flag
        }
    })

    const authUser = useSelector(state => state.authUser.access_token);
    const [form, setForm] = useState({
        id,
        tipo, 
        nombre,
        duracion,
        cantidad,
        codigos,
        codigo: ''
    })

    const [errores, setErrores] = useState({})

    const validateForm = () => {
        let validacionError = false
        let errors = {}
        if (form.tipo === '') {
          errors.tipo = 'El tipo de licencia es requerido'
          validacionError = true
        }
        if (form.nombre === '') {
          errors.nombre = 'El nombre es requerido'
          validacionError = true
        }
        if (Number(form.duracion) > 0 || form.duracion === '' ) {
          errors.duracion = 'La duración debe ser mayor a 0'
          validacionError = true
        }
        if (form.cantidad > 0) {
          errors.cantidad = 'La cantidad debe ser mayor a 0'
          validacionError = true
        }
        setErrores(errors)
        return validacionError
    }

    const reloadTableLicencias = (filter) => {
        $(`#licencias`).DataTable().search(JSON.stringify(filter)).draw();
    }

    const handleChange = (e) => {
        setForm({
          ...form,
          [e.target.name]: e.target.value
        })
    }

    const handleEnter = (e) => {
        e.preventDefault()
        if(form.codigo !== ''){
            setForm({
            ...form,
            codigos:[...form.codigos, {
                flag: false,
                code: form.codigo
            }],
            codigo: '',
            cantidad: form.cantidad + 1
            })
        } 
    }

    const handleDelete = (e) => {
        e.preventDefault()
        setForm({
          ...form,
          codigos: form.codigos.filter((codigo, index) => index !== parseInt(e.target.id)),
          cantidad: form.cantidad - 1
        })
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        if(validateForm()){
            try {
                apiPutForm(`v1/administracion/licencias/${form.id}`, form, authUser)
                .then(response => {

                    reloadTableLicencias({})

                    swal.fire({
                        icon: 'success',
                        title: 'Licencia Editada con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    })

                })
                setErrores({})
                .catch(error => {
                    //printResponseErrorAlert(error)
                })
            } catch (error) {
                //printResponseErrorAlert(error)
            }
        }
    }
    
        

    return(
        <>
            <div className=''>
                <div>
                    <form>
                        <div className = 'form-container'>
                            <div>
                                <label>Tipo de licencia</label>
                                <input title="" placeholder="Tipo de licencia" type="text" name="tipo" value={form.tipo} onChange = { (e) => {handleChange(e)}} />
                                {errores.tipo && <span>{errores.tipo}</span>}
                            </div>
                            <div>
                                <label>Nombre de licencia</label>
                                <input title="" placeholder="Tipo de licencia" type="text" name="nombre" value={form.nombre} onChange = { (e) => {handleChange(e)}} />
                                {errores.nombre && <span>{errores.nombre}</span>}
                            </div>
                            <div>
                                <label>Duración de licencia</label>
                                <input title="La duracion debe de ser en meses" placeholder="Tipo de licencia" type="number" name="duracion" value={form.duracion} onChange = { (e) => {handleChange(e)}} />
                                
                                {errores.duracion && <span>{errores.duracion}</span>}
                            </div>
                            <div>
                                <label>Cantidad de licencias</label>
                                <input title="" placeholder="Tipo de licencia" type="number" name="cantidad" value={form.cantidad}/>
                            </div>
                        </div>

                        <div className = "input-code">
                            <input placeholder="Código de licencia" type="text" name="codigo" value = {form.codigo} onChange={e => handleChange(e)}/>

                            <button type="button" className="btn" onClick={e => handleEnter(e)}>+ Agregar codigo</button>
                        </div>

                    </form>

                    {form.codigos.length > 0 && <p>Códigos agregados</p>}
                    {form.codigos.map((codigo, index)=>{
                        return(
                        <div key={index}>
                            <button className='btn-delete' id={index} onClick={ e => handleDelete(e) }>X</button>
                            {codigo.code}
                        </div>
                        )
                    })}

                </div>
                
                {form.codigos.length > 0  ?
                    <div className="btn">
                    <button type="button" onClick={e=>handleSubmit(e)}>Editar</button>
                    </div>
                    :null
                }

            </div>

        </>
    )
}