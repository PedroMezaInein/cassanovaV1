import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'

import { apiPutForm, apiPostForm} from '../../../functions/api'

import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';


import Swal from 'sweetalert2'

function EditarRequisicion (props) {

    const { data } = props
    console.log(data)
    const departamentos = useSelector(state => state.opciones.areas)
    const user = useSelector(state => state.authUser)

    const [form, setForm] = useState({
        fecha: data.fecha,
        departamento: data.departamento ? data.departamento.id : 'no definido',
        tipo_gasto: data.gasto ? data.gasto.id: 'no definido',
        descripcion: data.descripcion ? data.descripcion : 'no definido',
        tipoSubgasto: data.tipoSubEgreso_id,
        tipoPago: data.tipoPago_id,
        monto: data.monto_pago,
        id: data.id
    })

    const [errores, setErrores] = useState()

    const handleChangeDepartamento = (e) => {
        console.log(e)
        setForm({
            ...form,
            [e.target.name]: e.target.value,
            tipo_gasto: null,
        })
    }

    const handleChange = (event) => {
        let name = event.target.name;
        setForm({
            ...form,
            [name]: event.target.value,
        });
        console.log('hola')
        console.log(name)
    };

    
    const validateForm = () => {
        let validar = true
        let error = {}
        // if(form.departamento === ''){
        //     error.departamento = "Seleccione un departamento"
        //     validar = false
        // }
        // if(form.tipo_gasto === ''){
        //     error.tipo_gasto = "Seleccione el tipo de gasto"
        //     validar = false
        // }
        if(form.descripcion === ''){
            error.descripcion = "Escriba una descripcion"
            validar = false
        }
        setErrores(error)
        return validar
    }

    const handleSave = () => {
        if(validateForm()){

            try {
                let newForm = {
                    id_departamento: form.departamento,
                    id_gasto: form.tipo_gasto,
                    descripcion:form.descripcion,
                    fecha: form.fecha,
                    id_subarea: form.tipoSubgasto,
                    id_pago: form.tipoPago,
                    id_solicitante: data.solicitante.id,
                    monto_pagado: form.monto,
                }
                apiPutForm(`requisicion/${data.id}`, newForm, user.access_token).then((response)=>{
                    Swal.fire('Se editó la requisición', '', 'success')  
                })
            }   
            
            catch (error) {
                console.log(error)
            }
        } 
        
        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Todos los campos son obligatorios',
            })
        }
    }

    return (
        <div className='editarRequisicion'>
            <div className='editar_primerBloque'>
                <div>
                    {departamentos.length > 0 ?
                        <>
                            <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                            <Select
                                value={form.departamento}
                                name="departamento"
                                onChange={handleChangeDepartamento}
                            >
                                {departamentos.map((item, index) => (
                                    <MenuItem key={index} value={item.id_area}>{item.nombreArea}</MenuItem>
                                ))}

                            </Select>
                        </>
                        : null
                    }
                </div>
                {/* {errores && errores.departamento && <span className='error_departamento'>{errores.departamento}</span>} */}

                <div>
                    {/* {departamentos.length > 0 ?  */}
                    {departamentos.length > 0 && form.departamento !== ''?
                        <>
                            <InputLabel id="demo-simple-select-label">Tipo de Gasto</InputLabel>
                            <Select
                                value={form.tipo_gasto}
                                name="tipo_gasto"
                                onChange={handleChange}
                            >
                                {departamentos.find(item => item.id_area == form.departamento).partidas.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                ))}
                            </Select>
                        </>
                        : null
                    }
                </div>
                {/* {errores && errores.tipo_gasto && <span className='error_gasto'>{errores.tipo_gasto}</span>} */}

                <div>
                    <FormControl>
                        <form noValidate>
                            <TextField
                                id="fecha"
                                label="Fecha"
                                type="date"
                                name='fecha'
                                onChange={handleChange}
                                defaultValue={form.fecha}
                                InputLabelProps={{
                                shrink: true,
                                }}
                            />
                        </form>
                    </FormControl>
                </div>
            </div>
            

            <div className='editarRequisicion_comentario'>
                <FormControl className='editar_comentario'>
                    <TextField 
                        // id="standard-full-width"
                        label="Descripcion"
                        style={{ margin: 8 }}
                        placeholder="Deja un comentario"
                        // helperText="Full width!"
                        // fullWidth
                        onChange={handleChange}
                        margin="normal"
                        name='descripcion'
                        defaultValue={form.descripcion}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </FormControl> 
            </div>
            {errores && errores.descripcion && <span className='error_descripcion'>{errores.descripcion}</span>}

            <div className='editar_solicitante'>
                <TextField
                    label="Solicitante"
                    type="text"
                    defaultValue={user.user.name}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    disabled
                />
            </div>

            <div className='nuevaRequisicion_enviar'>
                <button className='nuevaRequisicion_boton' onClick={handleSave}>Guardar</button>
            </div>
        </div>
    )
}

export { EditarRequisicion }