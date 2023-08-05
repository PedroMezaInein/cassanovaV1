import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'
import S3 from 'react-aws-s3';
import { es } from 'date-fns/locale'

// MATERIAL UI
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider,KeyboardTimePicker,KeyboardDatePicker } from '@material-ui/pickers';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';

import Style from './../../../../../styles/_nuevaNotaObra.module.css'

import { apiPostForm, apiGet, apiPutForm } from '../../../../../functions/api';
import ItemSlider from './../../../../../components/singles/ItemSlider'

export default function NuevaNota(props) { 
    const { proyecto, reload, opciones, handleClose, arrayNotas } = props
    const auth = useSelector(state => state.authUser);
    const [form, setForm] = useState({ 
        hora:'',
        num_personal: '',
        tema: '',
        proveedor:'',
        tipo_nota: '',
        nota: '',
        adjunto: '',
        notas: [],
        urgente: 'urgente',
        normal: 'normal',
        paro_actividades: 'paro de actividades',
        cancelado: 'cancelado',
        concluido: 'concluido',
        acarreos: 'acarreos',
        adjuntos: {
            adjuntos: {
                value: '',
                placeholder: 'Adjunto',
                files: []
            }
        }
    });

    const [errores, setErrores] = useState({})

    const validateForm = () => {
        let validar = true
        let error = {}
        if(form.hora === ''){
            error.hora = "Seleccione una hora"
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
        // if(form.adjunto === ''){
        //     error.adjunto = "egregue un adjunto"
        //     validar = false
        // }
        
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

    const handleChangeFiles = (files, item) => {
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        setForm({
            ...form,
            form
        })
    }

    const getNotas = async (proyecto) => {
        apiGet(`v1/proyectos/nota-bitacora?proyecto=${proyecto.id}`, auth.access_token).then(
            (response) => {
                Swal.close()
                const { proyecto } = response.data
                let { notas } = form

                notas = proyecto.notas
                setForm({ 
                    ...form, notas })
            }, (error) => { }
            ).catch((error) => { 
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Error al adjuntar archivos',
                    text: 'Ocurrio un error al adjuntar los archivos',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
    }

    const addFilesToNota = async(values, nota) => {
        
        apiPutForm(`v2/proyectos/nota-bitacora/${nota.nota.id}/files`, { archivos: values }, auth.access_token ).then(
            (response) => {
                getNotas(proyecto)
                setForm({
                    ...form
                })
                // this.setState({ ...this.state, form: this.clearForm(), activeNota: 'notas' })
                Swal.fire({
                    title: 'Nota de obra',
                    text: 'nota creada correctamente',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    handleClose()
                    if (reload) {
                        reload.reload()
                    }
                    // arrayNotas()
                })
                getNotas(proyecto)
            }, (error) => { }
        ).catch((error) => { 
            Swal.close()
            Swal.fire({
                icon: 'error',
                title: 'Error al adjuntar archivos',
                text: 'Ocurrio un error al adjuntar los archivos',
                showConfirmButton: false,
                timer: 1500
            })
        })
    }

    const addFilesToS3 = async(nota) => {
        let auxPromises = []
        apiGet(`v1/constant/admin-proyectos`, auth.access_token)
        .then(
            (response) => {
                const { alma } = response.data
                let urlPath = `proyectos/${proyecto.id}/notas/${nota.id}/`
                auxPromises  = form.adjuntos.adjuntos.files.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file.file, `${urlPath}${Math.floor(Date.now() / 1000)}-${file.file.name}`)
                            .then((data) =>{
                                const { location,status } = data
                                if(status === 204) resolve({ name: file.file.name, url: location})
                                else reject(data)
                            }).catch(err => reject(err))
                    })
                })
                Promise.all(auxPromises).then(values => { addFilesToNota(values, nota) })
                .catch(err => console.error(err))
            }, 
            (error) => { }
        ).catch((error) => { 
            Swal.close()
            Swal.fire({
                icon: 'error',
                title: 'Error al adjuntar archivos',
                text: 'Ocurrio un error al adjuntar los archivos',
                showConfirmButton: false,
                timer: 1500
            })

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
                    hora: new Date(form.hora).toLocaleTimeString(),
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
                dataForm.append(`files_notaObra[]`, form.adjuntos)
                dataForm.append('adjuntos[]', "notaObra")

                apiPostForm(`v2/proyectos/nota-bitacora/${proyecto.id}`, dataForm, auth.access_token)
                .then(
                    (response) => {
                        const nota = response.data

                        Swal.close()

                        addFilesToS3(nota)

                        Swal.fire({
                            title: 'Nota de obra',
                            text: 'nota creada correctamente',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => {
                            handleClose()
                            if (reload) {
                                reload.reload()
                            }
                        })
                    },
                    (error) => {
                        Swal.close()
                        Swal.fire({
                            title: 'Nota',
                            text: 'Error al crear la Nota de obra',
                            icon: 'error',
                            timer: 2000,
                            showConfirmButton: false
                        })
                    }
                ).catch((error) => {
                    Swal.close()
                    Swal.fire({
                        title: 'Nota',
                        text: 'Error al crear la Nota de obra',
                        icon: 'error',
                        timer: 2000,
                        showConfirmButton: false
                    })
                })    
            } catch (error) {
                Swal.close()
                Swal.fire({
                    title: 'Nota',
                    text: 'Error al crear la Nota de obra',
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
                <div className='col-xl-4 col-md-4 col-sm-4 col-4' style={{marginTop: '1rem'}}>
                    <InputLabel>Hora inicio</InputLabel>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                        <Grid container >
                            <KeyboardTimePicker
                                // Style="width: 120px;"
                                className={Style.hora}
                                name='hora'
                                value={form.hora !=='' ? form.hora : null}
                                onChange={e=>handleChangeFecha(e,'hora')}
                                error={errores.hora ? true : false}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                </div>   
                
                <div className={`col-xl-4 col-md-4 col-sm-4 col-4 ${Style.tema}`}>
                    <TextField
                        className={Style.tema}
                        id="standard-multiline-static"
                        label="(tema)"
                        value={form.tema}
                        name='tema'
                        onChange={handleChange}
                        multiline
                        rows={2}
                        error={errores.nota ? true : false}
                        // defaultValue="Default Value"
                    />
                </div>

                <div className={`col-xl-4 col-md-4 col-sm-4 col-4 ${Style.personal}`} style={{marginTop:'1rem'}}>
                    <TextField
                        className={Style.personal}
                        type="number"
                        id="standard-multiline-static"
                        label="No. Personal"
                        value={form.num_personal}
                        name='num_personal'
                        onChange={handleChange}
                        // multiline
                        rows={2}
                        error={errores.nota ? true : false}
                    />
                </div>
            
            </div>

            <div className='row' style={{marginTop: '2rem'}}>
                <div className={`col-xl-4 col-md-5 col-sm-5 col-5 ${Style.prov}`}>
                    <>  
                        <InputLabel>proveedor</InputLabel>
                        <Select
                            className={Style.proveedor}
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

                <div className={`col-xl-4 col-md-2 col-sm-2 col-2 ${Style.prov}`}></div>

                <div className='col-xl-4 col-md-5 col-sm-5 col-5'>
                    <div /*style={{marginLeft:'3.3rem'}}*/>
                        <InputLabel style={{marginLeft:'10%'}}>Tipo nota</InputLabel>
                        <Select 
                            // Style="width: 90%;"
                            className={Style.tipo_nota}
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
            </div>

            <div className='row'>

                <div className={`col-xl-12 col-md-12 col-sm-12 col-12`}>
                    <TextField
                        className={Style.nota}
                        id="standard-multiline-static"
                        label="nota"
                        value={form.nota}
                        name='nota'
                        onChange={handleChange}
                        multiline
                        rows={2}
                        error={errores.nota ? true : false}
                    />
                </div>
            </div>

            <div className='row'>
                <div style={{ marginLeft: '0rem', marginTop: '2rem'}} className={`col-xl-8 col-md-9 col-sm-9 col-12`}>
                    {/* <label htmlFor="fileObra">Seleccionar archivo</label>
                    <input type="file" id='fileObra' name="file" onChange={handleFile} />
                    <div error={errores.adjunto ? true : false}></div>
                    <div>
                        {form.adjunto.name ? <div className='file-name' >{form.adjunto.name}</div> : null}
                    </div> */}

                    <ItemSlider
                        items={form.adjuntos.adjuntos.files}
                        item='adjuntos'
                        handleChange={handleChangeFiles}
                        multiple={true}
                    />
                </div>
            
                <div className={`col-xl-4 col-md-3 col-sm-3 col-12 ${Style.enviar}`}>
                    <button className={Style.sendButton} onClick={handleSend}>Crear</button>
                </div>
            </div>

        </div>
        
    )
}
