import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { apiGet, apiPutForm } from '../../../../functions/api'

import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import Swal from 'sweetalert2'

import Style from './NuevoInsumo.module.css'
import './../../../../styles/_nuevaRequisicion.scss'

export default function EditarInsumos (props) {
    const { data, handleClose, reload } = props
    const user = useSelector(state => state.authUser)

    const [form, setForm] = useState ({
        nombre: data.nombre ? data.nombre : '',
        cantidad: data.cantidad ? data.cantidad : '',
        costo: data.costo ? data.costo : '',
        unidad: data.unidad && data.unidad.id ? data.unidad.id : '',
        frecuencia: data.frecuencia ? data.frecuencia : '',
        stock: data.stock ? data.stock : '',
        maximo: data.maximo ? data.maximo : '',
        minimo: data.minimo ? data.minimo : '',
        descripcion: data.descripcion ? data.descripcion : '',
    })

    const getOptions = () => {
        Swal.fire({
            title: 'Cargando',
            text: 'Espere un momento',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        })
        try {
            apiGet('insumos/options', user.access_token)
                .then(res => {
                   setOpcionesUniadades( res.data.unidad)

                    Swal.close()
                })
                .catch(err => {
                    Swal.close()
                })
            
        } catch (error) {

        }
    }

    const [opcionesUnidades, setOpcionesUniadades] = useState(false)
    useEffect(() => {
        getOptions()
    }, [])
    
    const [errores, setErrores] = useState({})

    const handleMoney = (e) => {
        setForm({
            ...form,
            costo: e
        })
    }

    const handleChange = (event) => {
        // name son los diferentes tipos de atributos (departamento, fecha...)
        let name = event.target.name;
        setForm({
            ...form,
            [name]: event.target.value,
        });
    };

    const editar = () =>{
        // if(validateForm()){
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
                    nombre: form.nombre,
                    descripcion: form.descripcion,
                    cantidad: form.cantidad,
                    costo: form.costo,
                    id_unidades: form.unidad,
                    // tipo_unidad:form.tipo_unidad,
                    frecuencia: form.frecuencia,
                    estatus: form.estatus,
                    stock: form.stock,
                    maximo: form.maximo,
                    minimo: form.minimo,
                }

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


    return (
        <>
            <div className={Style.container}>
                <div >

                <div>
                    <InputLabel id="nombre" >Nombre</InputLabel>
                    <TextField
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        // error={errores.nombre ? true : false}
                    />
                </div>

                <div>
                    <InputLabel id="cantidad" >Cantidad</InputLabel>
                    <TextField
                        name="cantidad"
                        type='number'
                        value={form.cantidad}
                        onChange={handleChange}
                        // error={errores.cantidad ? true : false}
                    />
                </div>

                <div>
                    <CurrencyTextField
                        label="Costo"
                        variant="standard"
                        value={form.costo}
                        currencySymbol="$"
                        outputFormat="number"
                        onChange={(event, value) => handleMoney(value)}
                    />
                </div>
                
                    <div>  
                        {opcionesUnidades.length > 0 && form.opcionesUnidades !== ''?
                            <>
                                <InputLabel>Tipo Unidad</InputLabel>
                                <Select
                                    value={form.unidad}
                                    name="unidad"
                                    onChange={handleChange}
                                    // error={errores.id_unidades ? true : false}
                                >
                                    {
                                        opcionesUnidades ? opcionesUnidades.map((unidad, index) => {
                                            return <MenuItem key={index} value={unidad.id}>{`${unidad.nombre} `}</MenuItem>                                              
                                            
                                        }) : null
                                    } 

                                </Select>
                            </>
                            : null
                        } 
                    </div>

                </div>

                <div>
                    <div>
                        <InputLabel id="frecuencia" >PERIODO (MESES)</InputLabel>
                        <TextField
                            name="frecuencia"
                            type='text'
                            value={form.frecuencia}
                            onChange={handleChange}
                            // error={errores.frecuencia ? true : false}
                        />
                    </div> 
                    <div>
                        <InputLabel id="stock" >Stock</InputLabel>
                        <TextField
                            name="stock"
                            type='number'
                            value={form.stock}
                            onChange={handleChange}
                            // error={errores.stock ? true : false}
                        />
                    </div>
                    <div>
                        <InputLabel id="maximo" >Maximo</InputLabel>
                        <TextField
                            name="maximo"
                            type='number'
                            value={form.maximo}
                            onChange={handleChange}
                            // error={errores.maximo ? true : false}
                        />
                    </div>
                    <div>
                        <InputLabel id="minimo" >Minimo</InputLabel>
                        <TextField
                            name="minimo"
                            type='number'
                            value={form.minimo}
                            onChange={handleChange}
                            // error={errores.minimo ? true : false}
                        />
                    </div>

                </div>

                <div className={Style.nuevaRequisicion_segundoBloque}>
                    <div className={Style.nuevaRequisicion}>
                    
                        <TextField
                            label="Descripcion"
                            placeholder="Deja una descripción"
                            onChange={handleChange}
                            margin="normal"
                            name='descripcion'
                            defaultValue={form.descripcion}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            multiline
                            // error={errores.descripcion ? true : false}
                        />
                    </div>
                </div>

            </div>

            <div>
                <br></br>

                <div className="row justify-content-end mt-n18">
                    <div className="col-md-4">
                        <button onClick={editar} className={Style.sendButton}>Editar</button>
                    </div>
                </div>

            </div>
        </>
    )
}