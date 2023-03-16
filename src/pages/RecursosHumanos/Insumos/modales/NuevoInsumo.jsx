import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'

import { apiGet, apiPostForm } from '../../../../functions/api'

import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';

import Style from './NuevoInsumo.module.css'
import './../../../../styles/_nuevaRequisicion.scss'

export default function NuevoInsumo(props) {

    const {handleClose, reload} = props
    const user = useSelector(state => state.authUser)
     const [state, setState] = useState({
        nombre: '',
        cantidad: '',
        costo: '',
        tipo_unidad: '',
        frecuencia: '',
        stock: '',
        maximo: '',
        minimo: '',
        descripcion: '',
    });

    const [opcionesUnidades, setOpcionesUniadades] = useState(false)
    useEffect(() => {
        getOptions()
    }, [])

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
    
    const [errores, setErrores] = useState({})

    const handleChange = (event) => {
        // name son los diferentes tipos de atributos (departamento, fecha...)
        let name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };

    const validateForm = () => {
        let validar = true
        let error = {}

        if(state.nombre === ''){
            error.nombre = "Escriba un nombre"
            validar = false
        } 
        
        if(state.cantidad === ''){
            error.cantidad = "Escriba una cantidad"
            validar = false
        }
        
        if(state.costo === '' || state.costo === null || state.costo === 0){
            error.costo = "Escriba un costo"
            validar = false
        } 
        
        if (state.tipo_unidad === '') {
            error.id_unidades = "Seleccione una unidad"
            validar = false
        }
        
        if(state.frecuencia === ''){
            error.frecuencia = "Escriba una frecuencia"
            validar = false
        }
        
        if(state.stock === ''){
            error.stock = "Escriba stock"
            validar = false
        }
        if(state.maximo === ''){
            error.maximo = "Escriba un maximo"
            validar = false
        }
        if(state.minimo === ''){
            error.minimo = "Escriba un minimo"
            validar = false
        }

        if(state.descripcion === ''){
            error.descripcion = "Escriba una descripcion"
            validar = false
        }
        
        setErrores(error)
        return validar
    }

    const handleMoney = (e) => {
        setState({
            ...state,
            costo: e
        })
    }

    const enviar = () =>{
        if(validateForm()){

            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                }
            }) 
            try {

                let newForm = {
                    nombre: state.nombre,
                    descripcion: state.descripcion,
                    cantidad: state.cantidad,
                    costo: state.costo,
                    id_unidades: state.id_unidades,
                    tipo_unidad:state.tipo_unidad,
                    frecuencia: state.frecuencia,
                    estatus: state.estatus,
                    stock: state.stock,
                    maximo: state.maximo,
                    minimo: state.minimo,
                }

                apiPostForm('insumos', newForm, user.access_token)
                    .then((data) => {
                        Swal.fire({
                            title: 'Insumo',
                            text: 'se ha creado correctamente',
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
                        value={state.nombre}
                        onChange={handleChange}
                        error={errores.nombre ? true : false}
                    />
                </div>
                <div>
                    <InputLabel id="cantidad" >Cantidad</InputLabel>
                    <TextField
                        name="cantidad"
                        type='number'
                        value={state.cantidad}
                        onChange={handleChange}
                        error={errores.cantidad ? true : false}
                    />
                </div>
                <div>
                    <CurrencyTextField
                            label="Costo"
                            variant="standard"
                            value={state.costo}
                            currencySymbol="$"
                            outputFormat="number"
                            onChange={(event, value) => handleMoney(value)}
                            error={errores.costo ? true : false}
                        />
                </div>
                
                    <div>  
                        {opcionesUnidades.length > 0 && state.opcionesUnidades !== ''?
                            <>
                                <InputLabel>Tipo Unidad</InputLabel>
                                <Select
                                    value={state.id_unidades}
                                    name="id_unidades"
                                    onChange={handleChange}
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
                    </div>

                </div>

                <div>
                    <div>
                        <InputLabel id="frecuencia" >PERIODO (MESES)</InputLabel>
                        <TextField
                            name="frecuencia"
                            type='number'
                            value={state.frecuencia}
                            onChange={handleChange}
                            error={errores.frecuencia ? true : false}
                        />
                    </div>
                    <div>
                        <InputLabel id="stock" >Stock</InputLabel>
                        <TextField
                            name="stock"
                            type='number'
                            value={state.stock}
                            onChange={handleChange}
                            error={errores.stock ? true : false}
                        />
                    </div>
                    <div>
                        <InputLabel id="maximo" >Maximo</InputLabel>
                        <TextField
                            name="maximo"
                            type='number'
                            value={state.maximo}
                            onChange={handleChange}
                            error={errores.maximo ? true : false}
                        />
                    </div>
                    <div>
                        <InputLabel id="minimo" >Minimo</InputLabel>
                        <TextField
                            name="minimo"
                            type='number'
                            value={state.minimo}
                            onChange={handleChange}
                            error={errores.minimo ? true : false}
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
                            defaultValue={state.descripcion}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            multiline
                            error={errores.descripcion ? true : false}
                        />
                    </div>
                </div>

            </div>

            <div>
                <br></br>

                <div className="row justify-content-end mt-n18">
                    <div className="col-md-4">
                        <button className={Style.sendButton} onClick={enviar}>Agregar</button>
                    </div>
                </div>

            </div>
        </>
        
    );  
}