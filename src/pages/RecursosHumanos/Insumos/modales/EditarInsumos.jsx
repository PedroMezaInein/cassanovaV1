import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';

import Style from './NuevoInsumo.module.css'
import './../../../../styles/_nuevaRequisicion.scss'

export default function EditarInsumos (props) {
    const { data, handleClose, reload } = props
    const [form, setForm] = useState ({
        nombre: data.nombre,
        cantidad: data.cantidad,
        costo: data.costo,
        // tipo_unidad: '',
        frecuencia: data.frecuencia,
        stock: data.stock,
        maximo: data.minimo,
        minimo: data.maximo,
        descripcion: data.descripcion,
    })

    console.log(form)
    
    const [errores, setErrores] = useState({})

    return (
        <>
            <div className={Style.container}>
                <div >

                <div>
                    <InputLabel id="nombre" >Nombre</InputLabel>
                    <TextField
                        name="nombre"
                        value={form.nombre}
                        // onChange={handleChange}
                        // error={errores.nombre ? true : false}
                    />
                </div>
                {/* <div>
                    <InputLabel id="cantidad" >Cantidad</InputLabel>
                    <TextField
                        name="cantidad"
                        type='number'
                        value={form.cantidad}
                        // onChange={handleChange}
                        // error={errores.cantidad ? true : false}
                    />
                </div> */}
                {/* <div>
                    <CurrencyTextField
                            label="Costo"
                            variant="standard"
                            value={form.costo}
                            currencySymbol="$"
                            outputFormat="number"
                            // onChange={(event, value) => handleMoney(value)}
                            
                        />
                </div> */}
                
                    {/* <div>  
                        {opcionesUnidades.length > 0 && form.opcionesUnidades !== ''?
                            <>
                                <InputLabel>Tipo Unidad</InputLabel>
                                <Select
                                    value={form.id_unidades}
                                    name="id_unidades"
                                    // onChange={handleChange}
                                    error={errores.id_unidades ? true : false}
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
                    </div> */}

                </div>

                <div>
                    <div>
                        <InputLabel id="frecuencia" >PERIODO (MESES)</InputLabel>
                        <TextField
                            name="frecuencia"
                            type='number'
                            value={form.frecuencia}
                            // onChange={handleChange}
                            // error={errores.frecuencia ? true : false}
                        />
                    </div> 
                    <div>
                        <InputLabel id="stock" >Stock</InputLabel>
                        <TextField
                            name="stock"
                            type='number'
                            value={form.stock}
                            // onChange={handleChange}
                            // error={errores.stock ? true : false}
                        />
                    </div>
                    <div>
                        <InputLabel id="maximo" >Maximo</InputLabel>
                        <TextField
                            name="maximo"
                            type='number'
                            value={form.maximo}
                            // onChange={handleChange}
                            // error={errores.maximo ? true : false}
                        />
                    </div>
                    <div>
                        <InputLabel id="minimo" >Minimo</InputLabel>
                        <TextField
                            name="minimo"
                            type='number'
                            value={form.minimo}
                            // onChange={handleChange}
                            // error={errores.minimo ? true : false}
                        />
                    </div>

                </div>

                <div className={Style.nuevaRequisicion_segundoBloque}>
                    <div className={Style.nuevaRequisicion}>
                    
                        <TextField
                            label="Descripcion"
                            placeholder="Deja una descripción"
                            // onChange={handleChange}
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
                        <button className={Style.sendButton}>Agregar</button>
                    </div>
                </div>

            </div>
        </>
    )
}