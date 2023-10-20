import React, { useState, useSelector, useEffect} from 'react';

import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Swal from 'sweetalert2'

import { apiPostForm, apiGet, apiPutForm} from './../../../functions/api';
import Style from './../../Administracion/Egresos/Modales/CrearEgreso.module.css'
import { fromJS } from 'immutable';

export default function  CrearProveedor(props) {

    const { reload, handleCloseRecarga, auth, getProveedores, data, setProveedorSelect} = props

    const [telefono, setTelefono] = useState('');
    const [telefonoError, setTelefonoError] = useState('');
    const [errores, setErrores] = useState({})

    const [nuevo, setNuevo] = useState({
        rfc: data.facturaObject.rfc_emisor || '',
        razonSocial: data.facturaObject.nombre_emisor || '',
    })

    useEffect(() => {
        setNuevo({
            razonSocial: data.facturaObject.nombre_emisor || '',
            rfc: data.facturaObject.rfc_emisor || '',
        });
    }, [data.facturaObject]);

    const handleKeyDown = (event) => {
        if (event.key === 'Backspace' || event.key === 'Delete') {
            event.preventDefault();
            if (telefono.length > 0) {
                setTelefono(telefono.slice(0, -1));
                setTelefonoError('');
            }
        }
    }

    const formattelefono = (input) => {
        // Eliminar todos los caracteres que no sean números
        const numericValue = input.replace(/\D/g, '');

        // Limitar el valor numérico a 10 dígitos
        const limitedNumericValue = numericValue.slice(0, 10);
    
        // Aplicar formato de número de teléfono (__) ____ - ____
        const match = limitedNumericValue.match(/^(\d{0,2})(\d{0,4})(\d{0,4})$/);
        if (match) {
            const formattedNumber = `(${match[1]}) ${match[2]} - ${match[3]}`;
            return formattedNumber.trim(); // Eliminar espacios en blanco antes y después del número
        } else {
            return limitedNumericValue; // Mantener el valor limitado si no cumple el formato
        }
    }

    const handleChangeNumber = (event) => {
        const { value } = event.target;
        const formattedValue = formattelefono(value);
        setTelefono(formattedValue);
    }

    const handleBlur = () => {
        const phoneRegex = /^\(\d{2}\) \d{4} - \d{4}$/; // Validar el formato (__) ____ - ____
        if (telefono === '') {
            // Si el campo está vacío después de borrar, limpiamos el error
            setTelefonoError('');
        } else if (!phoneRegex.test(telefono)) {
            setTelefonoError('Ingrese un número de teléfono válido en el formato (__) ____ - ____.');
        } else {
            setTelefonoError('');
        }
    }

    const handleNuevoProveedorChange = (campo, valor) => {
        setNuevo({ 
            ...nuevo, 
            [campo]: valor });
      };

    const validateForm = () => {
        let validar = true
        let error = {}
        if(nuevo.nombre === '' || nuevo.nombre === null){
            error.nombre = "Escriba un nombre"
            validar = false
        }
        if(nuevo.razonSocial === '' || nuevo.razonSocial === null){
            error.razonSocial = "Escriba una razon social"
            validar = false
        }
        if (nuevo.rfc) {
        // if (nuevo.rfc === '' || nuevo.rfc === null) {
            // error.rfc = "Escriba un RFC";
            // validar = false;
        // } else {
            // Expresión regular para validar RFC
            const rfcPattern = /^([A-ZÑ&]{3,4})(\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([A-Z\d]{2})([0-9A])$/;
            if (!rfcPattern.test(nuevo.rfc)) {
                error.rfc = "RFC inválido";
                validar = false;
            }
        }
        if (telefono === '' || telefono === null) {
            error.telefono = "Escriba un télefono del proveedor"
            validar = false
        }
        
        setErrores(error)
        return validar
    }

    const enviar = () =>{
        if(validateForm()){

            Swal.fire({
                title: '¿Estás seguro?',    
                text: 'Se creará la compra',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, crear',
                cancelButtonText: 'No, cancelar',
                cancelButtonColor: '#d33',
                reverseButtons: true
            })
            try {

                Swal.fire({
                    title: 'Cargando...',
                    allowOutsideClick: false,
                    onBeforeOpen: () => {
                        Swal.showLoading()
                    }
                }) 

                let newForm = nuevo

                apiPostForm('proveedores', newForm, auth)
                    .then((data) => {
                        Swal.fire({
                            title: 'proveedor',
                            text: 'se ha creado correctamente',
                            icon: 'success',
                            showConfirmButton: true,
                            timer: 2000,
                        }).then(() => {
                            setNuevo({
                                rfc: data.rfc,
                                razonSocial: data.razonSocial,
                            });
                            setProveedorSelect({
                                preSelect: true,
                                id:data.data.proveedor.id,
                                name: data.data.proveedor.razon_social
                            })
                            handleCloseRecarga(false)
                            getProveedores()
                        })
                    })
                    .catch((error) => {
                        let errorMessage = "Ha ocurrido un error"; // Mensaje de error predeterminado

                        if (error.response && error.response.data && error.response.data.message) {
                            errorMessage = error.response.data.message;
                        }
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: errorMessage,
                        })
                        console.log(error)
                    })
            } catch (error) { 
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
            <div className={`${Style.CrearProveedor} col-xl-12`}>
                <div className={`${Style.primerParte}`}>
                    {/* <div style={{marginTop: '1rem'}}>
                        <TextField
                            name='nombre'
                            label="nombre"
                            type="text"
                            defaultValue={form.nombre}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            multiline
                            style={{ width: '150px', height: 100 }}
                            error={errores.nombre ? true : false}
                        />
                    </div> */}

                    <div style={{marginTop: '1rem'}}>
                        <TextField
                            name='razonSocial'
                            label="razonSocial"
                            id="razonSocial"
                            type="text"
                            // defaultValue={data.facturaObject? data.facturaObject.nombre_emisor : form.razonSocial}
                            value={nuevo.razonSocial }
                            onChange={(e) => handleNuevoProveedorChange('razonSocial', e.target.value)}
                            // onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            multiline
                            style={{ width: '150px', height: 100 }}
                            error={errores.razonSocial ? true : false}
                        />
                    </div>
                </div>

                <div className={`${Style.primerParte}`}>
                    <div style={{marginTop: '-.9rem'}}>
                        <InputLabel>rfc</InputLabel>
                        <TextField
                            name='rfc'
                            label="usar mayúsculas"
                            type="text"
                            value={nuevo.rfc }
                            // defaultValue={data.facturaObject ?data.facturaObject.rfc_emisor  : form.rfc}
                            onChange={(e) => handleNuevoProveedorChange('rfc', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            multiline
                            style={{ width: '150px', height: 100 }}
                            // error={errores.rfc ? true : false}
                        />
                    </div>

                    <div>
                        <InputLabel error={errores.telefono ? true : false} style={{textAlign:'center'}} id="demo-simple-select-label">numero del contacto</InputLabel>
                        <input
                            type='text'
                            value={telefono}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            onChange={handleChangeNumber}
                            placeholder='(__) ____ - ____'
                            style={{ border: 'none', outline: 'none', textAlign: 'center', marginTop: '1.5rem', width:'150px'}} 
                        />
                        {/* {telefonoError && <div style={{ color: 'red' }}>{telefonoError}</div>} */}
                    </div>
                </div>

                <div style={{marginTop:'-1.5rem', marginLeft:'-1rem'}}>
                    <div className="row justify-content-end">
                        <div>
                            <button className={Style.sendButton} onClick={enviar}>Crear</button>
                        </div>
                    </div>   
                </div>

            </div>
        </>
    )
}