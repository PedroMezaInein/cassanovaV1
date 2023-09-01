import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Swal from 'sweetalert2'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { es } from 'date-fns/locale'
import DateFnsUtils from '@date-io/date-fns';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import { apiPostForm } from './../../../functions/api';
import Style from './crearProyecto.module.css'

export default function CrearCompras(props) {

    const { options, handleClose, filtrarTabla, borrarTabla, reload } = props   

    const [form, setForm] = useState({
        empresa: '',
        nombre: '',
        sucursal: '',       
        descripcion: '',
    })

    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        estatusCompras: [],
        proveedores: [],
        proyectos: [],
        tiposImpuestos: [],
        tiposPagos: [],
    })

    const opcionesFiltradas = opciones.empresas.filter((item) => item.tipos.length > 0);

    const [check, setCheck] = useState({
        fase1: false,
        fase2: false,
        fase3: false,
    });

    useEffect(() => {
        if(options){
            setOpciones(options)
        }
        filtrarTabla('')   

    }, [options])

    const filtrar = () => { 
        filtrarTabla(`&empresa=${form.empresa}&nombre=${form.nombre}&sucursal=${form.sucursal}&descripcion=${form.descripcion}&fase1=${check.fase1}&fase2=${check.fase2}&fase3=${check.fase3}`)
        // console.log('filtrar tabla')
        handleClose()
        // borrar(false)
    }

    const borrar = () => {
        filtrarTabla('')   
        borrarTabla(false)
        handleClose()
    }

    useEffect(() => {
        
        if(options){
            setOpciones(options)
        }
    }, [options])

    const handleChangeCheck = (event) => {
        const { name, checked } = event.target;
        setCheck((prevCheck) => ({
            ...prevCheck,
            [name]: checked,
        }));
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value,
        })
    };

    return(
        <>
            <Accordion defaultExpanded>

                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                </AccordionSummary>

                <Typography style={{marginLeft: '1.5rem', marginTop: '-3rem', marginBottom: '1rem'}}>datos del proyecto</Typography>

                <AccordionDetails> 
                    <div className='col-xl-12'>
                        <div className={Style.crear_primerParte}>

                            <div className='col-xl-4'>
                                {
                                    opcionesFiltradas.length > 0 ?
                                        <div>
                                            <InputLabel>Empresa</InputLabel>
                                            <Select
                                                name="empresa"
                                                value={form.empresa}
                                                onChange={handleChange}
                                                style={{ width: 160 }}
                                            >
                                                {
                                                    opcionesFiltradas.map((item, index) => (
                                                        <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </div>
                                    : null
                                }
                            </div>  

                            <div className='col-xl-4'>
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
                                    style={{ width: 160 }}
                                />
                            </div>

                            <div className='col-xl-4'>
                                <TextField
                                    name='sucursal'
                                    label="ubicacion"
                                    type="text"
                                    defaultValue={form.sucursal}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    multiline
                                    style={{ width: 150 }}
                                />
                            </div>
                            
                        </div>

                        <div className={Style.crear_segundaParte}>


                            
                        </div>

                        <div className={Style.crear_cuartaParte}>
                            <div style={{marginTop: '1rem'}}>
                                <TextField
                                    name='descripcion'
                                    label="Descripción"
                                    type="text"
                                    defaultValue={form.descripcion}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    multiline
                                    style={{ width: '150px', height: 100 }}
                                />
                            </div>

                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={check.fase1}
                                                onChange={handleChangeCheck}
                                                name="fase1"
                                                color="primary"
                                                // style={{ width: 180 }}
                                            />
                                        }
                                        label="fase 1"
                                    />
                                </FormGroup> 

                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={check.fase2}
                                                onChange={handleChangeCheck}
                                                name="fase2"
                                                color="primary"
                                            />
                                        }
                                        label="fase 2"
                                    />
                                </FormGroup> 

                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={check.fase3}
                                                onChange={handleChangeCheck}
                                                name="fase3"
                                                color="primary"
                                            />
                                        }
                                        label="fase 3"
                                    />
                                </FormGroup> 
                        </div>                        
                    </div>
                </AccordionDetails>
            </Accordion>

            <div className={Style.botones}>
                <div>
                    <button className={Style.borrarButton}  onClick={borrar}>Borrar</button>
                </div>
                <div>
                    <button className={Style.sendButton}  onClick={filtrar}>Filtrar</button>
                </div>  
            </div>
            
        </>
    )
}