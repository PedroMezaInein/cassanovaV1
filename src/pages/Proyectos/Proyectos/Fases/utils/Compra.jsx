import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { apiGet, apiPostForm } from '../../../../../functions/api';
import Style from './Compra.module.css';

import ItemSlider from './../../../../../components/singles/ItemSlider'

import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'

import Swal from 'sweetalert2'

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

export default function Compra(props) { 
    const { proyecto, opciones } = props
    const auth = useSelector((state) => state.authUser);
    const [form, setForm] = useState({
        proyecto_id: '',
        proveedor_id: '',
        empresa_id: '',
        monto: 0,
        tipoPago_id: '',
        fecha: new Date(),
        area_id: '',
        subarea_id: '',
        descripcion: '',
        notas: '',
        factura: false,
        adjuntos: {
            adjunto: {
                value: '',
                placeholder: 'Presupuesto',
                files: []
            }
        }
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }

    const handleChangeFecha = (date) => {
        setForm({
            ...form,
            fecha: new Date(date)
        })
    };

    const handleChangeCheck = () => {
        setForm({
            ...form,
            factura: !form.factura
        })
    }

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

    const validateForm = () => {
        let aux = Object.keys(form)
        let valid = true
        let error = {}
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    let aux2 = Object.keys(form.adjuntos)
                    aux2.map((element2) => {
                        if (form.adjuntos[element2].value === '') {
                            valid = false
                            error[element2] = true
                        }
                        return false
                    })
                    break;
                default:
                    if (form[element] === '') {
                        valid = false
                        error[element] = true
                    }
                    break
            }
            return false
        })
        setErrors(error)
        return valid
    }

    const resetForm = () => {
        setForm({
            proyecto_id: '',
            proveedor_id: '',
            empresa_id: '',
            monto: '',
            tipoPago_id: '',
            fecha: new Date(),
            area_id: '',
            subarea_id: '',
            descripcion: '',
            notas: '',
            factura: false,
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Presupuesto',
                    files: []
                }
            }
        })
    }

    const addSolicitudCompraAxios = () => {
        
        if (validateForm()) {
            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })
            const data = new FormData();
            let newform = {
                proveedor: form.proveedor_id,
                proyecto: form.proyecto_id,
                area: form.area_id,
                subarea: form.subarea_id,
                empresa: form.empresa_id,
                descripcion: form.descripcion,
                notas: form.notas,
                total: form.monto,
                remision: '',
                fecha: form.fecha,
                tipoPago: form.tipoPago_id,
                cuenta: '',
                adjuntos: form.adjuntos,
                factura: form.factura? 'Con Factura' : ''
            }

            let aux = Object.keys(newform)
            aux.map((element) => {
                switch (element) {
                    case 'fecha':
                        data.append(element, (new Date(newform[element])).toDateString())
                        break
                    case 'adjuntos':
                        break;
                    default:
                        data.append(element, newform[element])
                        break
                }
                return false
            })
            aux = Object.keys(newform.adjuntos)
            aux.map((element) => {
                if (newform.adjuntos[element].value !== '') {
                    for (var i = 0; i < newform.adjuntos[element].files.length; i++) {
                        data.append(`files_name_${element}[]`, newform.adjuntos[element].files[i].name)
                        data.append(`files_${element}[]`, newform.adjuntos[element].files[i].file)
                    }
                    data.append('adjuntos[]', element)
                }
                return false
            })

            try {
                apiPostForm('solicitud-compra', data, auth.access_token).then(
                    (response) => {
                        resetForm()
                        Swal.close()

                        Swal.fire({
                            title: 'Solicitud de Compra',
                            text: 'Solicitud de Compra creada correctamente',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
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
        <>
            {/* solicitar compra */}
            <Accordion >

                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography className='proyect-Subtitulo'>1. Solicitar Compra</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={Style.container}>
                        <div>
                            <div>
                                <InputLabel className={errors.proyecto_id ? `${Style.error}` : ''}>Proyecto</InputLabel>
                                <Select
                                    value={form.proyecto_id}
                                    name='proyecto_id'
                                    onChange={handleChange}
                                    className={Style.maxWidthInput}
                                >
                                    {
                                        opciones.proyectos.map(item => {
                                            return <MenuItem value={item.value}>{item.name}</MenuItem>
                                        })
                                    }

                                </Select>
                            </div>
                            <div>
                                <InputLabel className={errors.proveedor_id ? `${Style.error}` : ''}>Proveedor</InputLabel>
                                <Select
                                    value={form.proveedor_id}
                                    name='proveedor_id'
                                    onChange={handleChange}
                                    className={Style.maxWidthInput}
                                >
                                    {
                                        opciones.proveedores.map(item => {
                                            return <MenuItem value={item.value}>{item.name}</MenuItem>
                                        })
                                    }
                                </Select>
                            </div>
                            <div>
                                <InputLabel className={errors.empresa_id ? `${Style.error}` : ''}>Empresa</InputLabel>
                                <Select
                                    value={form.empresa_id}
                                    name='empresa_id'
                                    onChange={handleChange}
                                    className={Style.maxWidthInput}
                                >
                                    {
                                        opciones.empresas.map(item => {
                                            return <MenuItem value={item.value}>{item.name}</MenuItem>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                        <div>
                            <div>
                                <InputLabel className={errors.monto ? `${Style.error}` : ''}>Monto</InputLabel>
                                <TextField
                                    name='monto'
                                    value={form.monto}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <InputLabel className={errors.tipoPago_id ? `${Style.error}` : ''}>Tipo de pago</InputLabel>
                                <Select
                                    value={form.tipoPago_id}
                                    name='tipoPago_id'
                                    onChange={handleChange}
                                    className={Style.maxWidthInput}
                                >
                                    {
                                        opciones.tiposPagos.map(item => {
                                            return <MenuItem value={item.value}>{item.name}</MenuItem>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                        
                        
                    </div>
                    
                </AccordionDetails>

            </Accordion>

            {/* Área y fecha */}
            <Accordion >

                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography className='proyect-Subtitulo'>2. Área y fecha</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={Style.container}>

                        <div>
                            <div>
                                <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
                                    <Grid container justifyContent="space-around">
                                        <KeyboardDatePicker
                                            margin="normal"
                                            label="Fecha"
                                            format="dd/MM/yyyy"
                                            value={form.fecha}
                                            onChange={handleChangeFecha}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </div>
                            <div>
                                <InputLabel className={errors.area_id ? `${Style.error}` : ''}>Área</InputLabel>
                                <Select
                                    value={form.area_id}
                                    name='area_id'
                                    onChange={handleChange}
                                    className={Style.maxWidthInput}
                                >
                                    {
                                        opciones.areas.map(item => {
                                            return <MenuItem value={item.value}>{item.name}</MenuItem>
                                        })
                                    }
                                </Select>
                            </div>
                            <div>
                                <InputLabel className={errors.subarea_id ? `${Style.error}` : ''}>Subárea</InputLabel>
                                <Select
                                    value={form.subarea_id}
                                    name='subarea_id'
                                    onChange={handleChange}
                                    className={Style.maxWidthInput}
                                >
                                    {form.area_id !== '' ?
                                        opciones.areas.find(item => item.value === form.area_id).subareas.map(item => {
                                            return <MenuItem value={item.id}>{item.nombre}</MenuItem>
                                        })
                                        :
                                        <MenuItem value=''>Seleccione un área</MenuItem>
                                    }
                                </Select>
                            </div>
                        </div>

                        <div>
                            <div>
                                <InputLabel>Descripción</InputLabel>
                                <TextField
                                    name='descripcion'
                                    value={form.descripcion}
                                    onChange={handleChange}
                                    multiline
                                    className={Style.maxWidthInputText}
                                />

                            </div>
                            <div>
                                <InputLabel>Notas</InputLabel>
                                <TextField
                                    name='notas'
                                    value={form.notas}
                                    onChange={handleChange}
                                    multiline
                                    className={Style.maxWidthInputText}
                                />
                            </div>
                        </div>

                    </div>
                    
                    
                </AccordionDetails>

            </Accordion>

            {/* Presupuesto */}
            <Accordion >

                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography className='proyect-Subtitulo'>3. Presupuesto</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={Style.containerFile}>
                        <div>
                            <InputLabel>Lleva factura</InputLabel>
                            <Checkbox
                                checked={form.factura}
                                onChange={handleChangeCheck}
                                color='primary'
                                style={{ marginLeft: '2.2rem' }}
                            />
                        </div>
                        <div className="col-md-12 text-center">
                            <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.adjunto.placeholder}</label>
                            <ItemSlider
                                items={form.adjuntos.adjunto.files}
                                item='adjunto'
                                handleChange={handleChangeFiles}
                                multiple={true}
                            />
                        </div>    
                    </div>
                    
                </AccordionDetails>

            </Accordion>

            {/* Botones */}
            <div className="row justify-content-end">
                <div className="col-md-4">
                    <button
                        onClick={addSolicitudCompraAxios}
                        className={Style.sendButton}
                    >
                        solicitar
                    </button>
                </div>
            </div>
                    
        
        </>
    )
}