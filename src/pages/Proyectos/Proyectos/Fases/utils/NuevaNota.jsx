import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'

// MATERIAL UI
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider,KeyboardTimePicker,KeyboardDatePicker } from '@material-ui/pickers';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';

import Style from './../../../../../styles/_nuevaNotaObra.module.css'

import { apiPostForm } from '../../../../../functions/api';

export default function NuevaNota(props) { 
    const { proyecto, reload, opciones, handleClose } = props
    const auth = useSelector(state => state.authUser);

    const [form, setForm] = useState({ 
        fecha:'',
        num_personal: '',
        tema: '',
        proveedor:'',
        tipo_nota: '',
        nota: '',
        adjunto: '',
        urgente: 'urgente',
        normal: 'normal',
        paro_actividades: 'paro de actividades',
        cancelado: 'cancelado',
        concluido: 'concluido',
        acarreos: 'acarreos',
    });
    console.log(form)

    const [errores, setErrores] = useState({})

    const validateForm = () => {
        let validar = true
        let error = {}
        if(form.fecha === ''){
            error.fecha = "Seleccione una fecha"
            validar = false
        }
        if(form.tipo_nota === ''){
            error.tipo_nota = "Indique el tipo de nota"
            validar = false
        }
        if(form.proveedor === ''){
            error.proveedor = "Seleccione un proveedor"
            validar = false
        }
        if(form.nota === ''){
            error.nota = "Escriba una nota"
            validar = false
        }
        if(form.adjunto === ''){
            error.adjunto = "egregue un adjunto"
            validar = false
        }
        
        setErrores(error)
        return validar
    }

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    const handleChange = (e) => {
        setForm({ 
            ...form, 
            [e.target.name]: e.target.value })
    };

    function formatDate(date) {
        var year = date.getFullYear();
    
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
    
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        
        return year + '/' + month + '/' + day;
    }

    const handleFile = (e) => {
        setForm({
            ...form,
            adjunto: e.target.files[0]
        })
    }

    const handleSend = () => {
        
        if (validateForm()) {
        // if (true) {
            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })

            try {
                let dataForm = new FormData()

                let newForm = {
                    proveedor: form.proveedor,
                    notas: form.nota,
                    tipo_nota: form.tipo_nota,
                    fecha:  formatDate(form.fecha),
                    adjunto: form.adjunto,
                    num_personal: form.num_personal,
                    tema: form.tema,
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

                dataForm.append(`files_name_notaObra[]`, 'notaObra')
                dataForm.append(`files_notaObra[]`, form.adjunto)
                dataForm.append('adjuntos[]', "notaObra")

                apiPostForm(`v2/proyectos/nota-bitacora/${proyecto.id}`, dataForm, auth.access_token)
                .then(
                    (response) => {
                        Swal.close()

                        Swal.fire({
                            title: 'Solicitud de Compra',
                            text: 'Solicitud de Compra creada correctamente',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => {
                            if (reload) {
                                reload.reload()
                            }
                            handleClose()
                        })
                    },
                    (error) => {
                        Swal.close()
                        Swal.fire({
                            title: 'Solicitud de Compra',
                            text: 'Error al crear la Solicitud de Compra',
                            icon: 'error',
                            timer: 2000,
                            showConfirmButton: false
                        })
                    }
                ).catch((error) => {
                    Swal.close()
                    Swal.fire({
                        title: 'Solicitud de Compra',
                        text: 'Error al crear la Solicitud de Compra',
                        icon: 'error',
                        timer: 2000,
                        showConfirmButton: false
                    })
                })    
            } catch (error) {
                Swal.close()
                Swal.fire({
                    title: 'Solicitud de Compra',
                    text: 'Error al crear la Solicitud de Compra',
                    icon: 'error',
                    timer: 2000,
                    showConfirmButton: false
                })
            }
            
        } else {
            Swal.fire({
                title: 'Faltan campos por llenar',
                text: 'Favor de llenar todos los campos',
                icon: 'warning',
                timer: 2000,
                showConfirmButton: false

            })
        } 
    }

    return (
        // <div className={classes.formControl}>
        <div className={Style.nueva_nota}>

            <div className='row'>
                <div className='col-xl-3 col-md-3 col-sm-3 col-xs-6'>
                    <InputLabel>Fecha</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid>
                                <KeyboardDatePicker
                                    className={Style.nuevaRequisicion_fecha}
                                    format="dd/MM/yyyy"
                                    name='fecha'
                                    value={form.fecha !=='' ? form.fecha : null}
                                    onChange={e=>handleChangeFecha(e,'fecha')}
                                    // defaultValue={state.fecha}
                                    placeholder="dd/mm/yyyy"
                                    error={errores.fecha ? true : false}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                </div>
                <div className={`col-xl-3 col-md-3 col-sm-3 col-6 ${Style.nuevaRequisicion_fecha}`}>
                    <TextField
                        // className="text"
                        id="standard-multiline-static"
                        label="No. Personal"
                        value={form.num_personal}
                        name='num_personal'
                        onChange={handleChange}
                        multiline
                        rows={2}
                        error={errores.nota ? true : false}
                        // defaultValue="Default Value"
                    />
                </div>
                
                <div className={`col-xl-3 col-md-3 col-sm-3 col-6 ${Style.nuevaRequisicion_fecha}`}>
                    <TextField
                        // className="text"
                        id="standard-multiline-static"
                        label="Platica de seguridad (tema)"
                        value={form.tema}
                        name='tema'
                        onChange={handleChange}
                        multiline
                        rows={2}
                        error={errores.nota ? true : false}
                        // defaultValue="Default Value"
                    />
                </div>
            
            </div>

            <div className='row'>
                <div className={`col-xl-6 col-md-6 col-sm-6 col-6 ${Style.prov}`}>
                    <>  
                        <InputLabel>proveedor</InputLabel>
                        <Select
                           Style="width: 180px;"
                            name="proveedor"
                            value={form.proveedor}
                            onChange={handleChange}
                            error={errores.proveedor ? true : false}
                        >
                            {
                                opciones.proveedores.map((item, index) => {
                                    return <MenuItem value={item.value} key={index}>{item.name}</MenuItem>
                                })
                            }   
                        </Select>
                    </> 
                </div>
                <div className={`col-xl-6 col-md-6 col-sm-6 col-6 `}>
                    <InputLabel>Tipo nota</InputLabel>

                    <Select Style="width: 180px;"
                            name="tipo_nota"
                            value={form.tipo_nota}
                            onChange={handleChange}
                            error={errores.tipo_nota ? true : false}
                        >
                            
                        <MenuItem value={form.urgente}>{form.urgente}</MenuItem>
                        <MenuItem value={form.normal}>{form.normal}</MenuItem>
                        <MenuItem value={form.paro_actividades}>{form.paro_actividades}</MenuItem>
                        <MenuItem value={form.cancelado}>{form.cancelado}</MenuItem>
                        <MenuItem value={form.concluido}>{form.concluido}</MenuItem>
                        <MenuItem value={form.acarreos}>{form.acarreos}</MenuItem>

                    </Select>
                </div>
            </div>

            <div className='row'>

                <div className={`col-xl-12 col-md-12 col-sm-12 col-12`}>
                    <TextField
                        Style="width: 600px;"
                        // className="text"
                        id="standard-multiline-static"
                        label="nota"
                        value={form.nota}
                        name='nota'
                        onChange={handleChange}
                        multiline
                        rows={2}
                        error={errores.nota ? true : false}
                        // defaultValue="Default Value"
                    />
                </div>
            </div>

            <div className='row'>
                <div style={{ marginLeft: '0rem' }} className={`col-xl-8 col-md-8 col-sm-6 col-xs-12 ${Style.file}`}>
                    <label htmlFor="fileObra">Seleccionar archivo</label>
                    <input type="file" id='fileObra' name="file" onChange={handleFile} />
                    <div error={errores.adjunto ? true : false}></div>
                    <div>
                        {form.adjunto.name ? <div className='file-name' >{form.adjunto.name}</div> : null}
                    </div>
                </div>
            
                <div className='col-xl-4 col-md-4 col-sm-6 col-xs-12'>
                    <button className={Style.sendButton} onClick={handleSend}>Crear</button>
                </div>
            </div>

        </div>
        
    )
}
