import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { apiPostForm } from '../../../functions/api'

import '../../../styles/_nuevaRequisicion.scss'
import '../../../styles/_editarRequisicion.scss'



export default function NativeSelects(props) {
    const {handleClose, reload} = props
    const user = useSelector(state => state.authUser)
    const departamento = useSelector(state => state.authUser.departamento)
    const departamentos = useSelector(state => state.opciones.areas)
    const presupuestos = useSelector(state => state.opciones.presupuestos)
    const [state, setState] = useState({
        solicitante: user.user.id,
        fecha:new Date().toISOString().split('T')[0],
        departamento: departamento.departamentos[0].id,
        tipo_gasto: '', //partida
        descripcion: '',
        solicitud: '',
        presupuesto: '',
    });
    
    const [errores, setErrores] = useState()

    const handleFile = (e) => {
        setState({
            ...state,
            solicitud: e.target.files[0]
        })
    }

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
        if(state.departamento === ''){
            error.departamento = "Seleccione un departamento"
            validar = false
        }
        if(state.tipo_gasto === ''){
            error.tipo_gasto = "Seleccione el tipo de gasto"
            validar = false
        }
        if(state.descripcion === ''){
            error.descripcion = "Escriba una descripcion"
            validar = false
        }
        if (state.presupuesto === '') {
            error.presupuesto = "Seleccione un presupuesto"
            validar = false
        }
        
        setErrores(error)
        return validar
    }

    console.log(state)

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
                let dataForm = new FormData()

                let newForm = {
                    id_solicitante: state.solicitante,
                    id_departamento: state.departamento,
                    id_gasto: state.tipo_gasto,
                    descripcion: state.descripcion,
                    fecha: state.fecha,
                    solicitud: state.solicitud,
                    presupuesto: state.presupuesto
                }

                let aux = Object.keys(newForm)

                aux.forEach((element) => {
                    switch (element) {
                        case 'adjuntos':
                            break;
                        default:
                            dataForm.append(element, newForm[element])
                            break
                    }
                })

                dataForm.append(`files_name_requisicion[]`, 'requisicion01')
                dataForm.append(`files_requisicion[]`, state.solicitud)
                dataForm.append('adjuntos[]', "requisicion")


                apiPostForm('requisicion', dataForm, user.access_token)
                    .then((data) => {
                        Swal.close()
                        Swal.fire({
                            icon: 'success',
                            title: 'Nueva Requisicion',
                            text: 'Se ha creado correctamente',
                            timer: 5000,
                            timerProgressBar: true,
                        })
                        handleClose()
                        if (reload) {
                            reload.reload()
                        }

                        /* if (data.isConfirmed) {

                            let form = {
                                solicitante: user.user.id,
                                fecha: '',
                                departamento: '',
                                tipo_gasto: '',
                                descripcion: '',
                                solicitud: ''
                            }

                            console.log('form')
                            console.log(form)

                        } */

                        /* else if (data.isDenied) {
                            Swal.fire('Faltan campos', '', 'info')
                        } */
                    })
                    .catch((error) => {
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ha ocurrido un error',
                        })
                        console.log(error)
                    })
            } catch (error) { 
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error',
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

    const handleChangeDepartamento = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
            tipo_gasto: null,
        })
    }
    
    return (
        <>
            <div className="container">
                <div >

                    <div>
                        <TextField className='nuevaRequisicion_solicitante'
                            label="Solicitante"
                            type="text"
                            defaultValue={user.user.name}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            disabled
                        />
                    </div>
                    
                    <div className="nuevaRequisicion_departamento">
                        {departamentos.length > 0 ?
                            <>
                                <InputLabel>Departamento</InputLabel>
                                <Select
                                    value={state.departamento}
                                    name="departamento"
                                    onChange={handleChangeDepartamento}
                                    disabled
                                >
                                    {departamentos.map((item, index) => (
                                        <MenuItem key={index} value={item.id_area}>{item.nombreArea}</MenuItem>
                                    ))}

                                </Select>
                            </>
                            : null
                        }
                    </div>

                    <div className="nuevaRequisicion_gasto">  
                        {departamentos.length > 0 && state.departamento !== ''?
                            <>
                                <InputLabel>Tipo de Gasto</InputLabel>
                                <Select
                                    value={state.tipo_gasto}
                                    name="tipo_gasto"
                                    onChange={handleChange}
                                >
                                    {departamentos.find(item => item.id_area == state.departamento).partidas.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                    ))}

                                </Select>
                            </>
                            : null
                        }
                    </div>

                </div>

                <div>
                    <div>
                        {presupuestos.length > 0 && state.departamento !== '' ?
                            <>
                                <InputLabel>Presupuesto</InputLabel>
                                <Select
                                    value={state.presupuesto}
                                    name="presupuesto"
                                    onChange={handleChange}
                                >
                                    {
                                        presupuestos.find(item => item.id_area == state.departamento) ?
                                            [presupuestos.find(item => item.id_area == state.departamento)].map((item, index) => (
                                                <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                            ))
                                            : <MenuItem value={null}>No hay presupuestos</MenuItem>


                                    }
                                </Select>
                            </>
                            : null
                        }
                    </div>

                    <div>
                        <TextField
                            id="fecha"
                            label="Fecha"
                            type="date"
                            name='fecha'
                            onChange={handleChange}
                            defaultValue={state.fecha}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>

                    <div>
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
                        />
                    </div>
                </div>

            </div>

            <div>
                <div className='file'>
                    {/* <p id='adjuntos'>Agregar archivos
                        <input className='nuevaRequisicion_adjunto_input' type='file' onChange={handleFile}></input>
                    </p> */}
                    <label htmlFor="file">Seleccionar archivo(s)</label>
                    <input type="file" id="file" name="file" onChange={handleFile} />
                    <div>
                        {state.solicitud.name ? <div className='file-name'>{state.solicitud.name}</div> : null}
                    </div>
                    
                </div>

                <div className="row justify-content-end mt-n18">
                    <div className="col-md-4">
                        <button className='sendButton' onClick={enviar}>Agregar</button>
                    </div>
                </div>

                
            </div>
        </>
        

    );  
}