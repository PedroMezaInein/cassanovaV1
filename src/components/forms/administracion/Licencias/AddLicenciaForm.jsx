import React from 'react'
import { useState } from 'react'
import {  useSelector } from "react-redux";
import $ from 'jquery'
import swal from 'sweetalert2'
import { apiPostForm } from '../../../../functions/api'
import './../../../../styles/_modal_form.scss'

export default function AddLicenciaForm() {
  const authUser = useSelector(state => state.authUser.access_token);
  const [licencia, setLicencia] = useState({
    tipo: '',
    nombre: '',
    duracion: '',
    cantidad: 0,
    codigo: '',
    codigos: [],
  })

  const [errores, setErrores] = useState({})

  const validateForm = () => {
    let validacionError = false
    let errors = {}
    if (licencia.tipo === '') {
      errors.tipo = 'El tipo de licencia es requerido'
      validacionError = true
    }
    if (licencia.nombre === '') {
      errors.nombre = 'El nombre es requerido'
      validacionError = true
    }
    if (licencia.duracion > 0) {
      errors.duracion = 'La duración debe ser mayor a 0'
      validacionError = true
    }
    if (licencia.cantidad > 0) {
      errors.cantidad = 'La cantidad debe ser mayor a 0'
      validacionError = true
    }
    setErrores(errors)
    return validacionError
  }


  const handleChange = (e) => {
    
    setLicencia({
      ...licencia,
      [e.target.name]: e.target.value
    })
  }

  const handleEnter = (e) => {
    e.preventDefault()
    if(licencia.codigo !== ''){
      setLicencia({
        ...licencia,
        codigos:[...licencia.codigos, licencia.codigo],
        codigo: '',
        cantidad: licencia.cantidad + 1
      })
    } 
  }

  const reset = () => {
    setLicencia({
      tipo: '',
      nombre: '',
      duracion: '',
      cantidad: 0,
      codigo: '',
      codigos: [],
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
        try {
          apiPostForm('v1/administracion/licencias', licencia, authUser)
          reset()
          reloadTableLicencias({})
        } catch (error) {
          console.log(error);
        }          
        
      swal.fire({
        icon: 'success',
        title: 'Licencia agregada',
        showConfirmButton: false,
        timer: 1500
      })
    } else {
      swal.fire({
        icon: 'error',
        title: 'Error al agregar licencia',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  

  const reloadTableLicencias = (filter) => {
    $(`#licencias`).DataTable().search(JSON.stringify(filter)).draw();
  }

  const handleDelete = (e) => {
    e.preventDefault()
    setLicencia({
      ...licencia,
      codigos: licencia.codigos.filter((codigo, index) => index !== parseInt(e.target.id)),
      cantidad: licencia.cantidad - 1
    })
  }


  return (
    <div className="mt-5">
      <div>
        <form className=''>

          <div className = 'form-container'>
            <div>
              <input placeholder="Tipo de licencia" type="text" name="tipo" onChange={e => handleChange(e)} value={licencia.tipo} />
              {/* {errores.tipo && <span>{errores.tipo}</span>} */}
            </div>

            <div>
              <input placeholder="Nombre de licencia" type="text" name="nombre" onChange={e => handleChange(e)} value={licencia.nombre} />
              {/* {errores.nombre && <span>{errores.nombre}</span>} */}
            </div>

            <div>
              <input placeholder="Duración de licencia" type="number" name="duracion" onChange={e => handleChange(e)} value={licencia.duracion} />
              {/* {errores.duracion && <span>{errores.duracion}</span>} */}
            </div>

            <div>
              <input placeholder="Cantidad de licencias" type="number" value={licencia.cantidad} />
              {/* {errores.cantidad && <span>{errores.cantidad}</span>} */}
            </div>

          </div>

          <div className = "input-code">
              <input placeholder="Código de licencia" type="text" name="codigo" onChange={e => handleChange(e)} value={licencia.codigo} />

              <button type="button" className="btn" onClick={e => handleEnter(e)}> + Agregar codigo</button>
          </div>

          

        </form>
        {licencia.codigos.length > 0 && <p>Códigos agregados</p>}
        {licencia.codigos.map((codigo, index) => (
          <div key={index}><button className='btn-delete' id={index} onClick={(e)=>handleDelete(e)}>X</button>{codigo} </div>
        ))}

      </div>
      {licencia.codigos.length > 0  ?
        <div className="btn">
          <button type="button"  onClick={e => handleSubmit(e)}>Enviar</button>
        </div>
       :null
      }
      
      
    </div>
  )
}
