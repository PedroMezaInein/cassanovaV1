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

    const { options, handleClose, reload } = props
    const [errores, setErrores] = useState({});
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [clientes, setClientes] = useState([]);
    const [correos, setCorreos] = useState([]);
    const [clientesSeleccionados, setClientesSeleccionados] = useState([]);

    const arrayClientes = options.clientes

    const auth = useSelector((state) => state.authUser.access_token);

    const [form, setForm] = useState({
        fecha_inicio: '',
        fecha_fin: '',
        empresa: '',
        tipoProyecto: '',
        nombre: '',
        ciudad: '',
        sucursal: '',       
        m2: '',
        costo: '',
        descripcion: '',
        contacto: '',
        cliente: '',
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

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Backspace' || event.key === 'Delete') {
            event.preventDefault();
            if (phoneNumber.length > 0) {
                setPhoneNumber(phoneNumber.slice(0, -1));
                setPhoneNumberError('');
            }
        }
    }

    const formatPhoneNumber = (input) => {
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
        const formattedValue = formatPhoneNumber(value);
        setPhoneNumber(formattedValue);
    }

    const handleBlur = () => {
        const phoneRegex = /^\(\d{2}\) \d{4} - \d{4}$/; // Validar el formato (__) ____ - ____
        if (phoneNumber === '') {
            // Si el campo está vacío después de borrar, limpiamos el error
            setPhoneNumberError('');
        } else if (!phoneRegex.test(phoneNumber)) {
            setPhoneNumberError('Ingrese un número de teléfono válido en el formato (__) ____ - ____.');
        } else {
            setPhoneNumberError('');
        }
    }

    const handleChangeClientes = (event, newValues) => {
        setClientesSeleccionados(newValues);
    }

    useEffect(() => {
        // Precargar el cliente principal si está seleccionado
        if (form.cliente !== '') {
            const clientePrincipal = arrayClientes.find(
            (cliente) => cliente.value === form.cliente
        )
            if (clientePrincipal) {
                setClientesSeleccionados([clientePrincipal]);
            }
        }
    }, [form.cliente, arrayClientes]);

    useEffect(() => {
        // Guardar las selecciones en el estado 'clientes'
        setClientes(clientesSeleccionados);
      }, [clientesSeleccionados]);

    const handleChangeCorreos = (e, value) => {
        setErrores('');
        const correosIngresados = e.target.value
        .split(',')
        .map((correo) => correo.trim());
    
        // Validar cada correo ingresado con una expresión regular
        const correoRegex =(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        const correosValidos = correosIngresados.every((correo) =>
            correoRegex.test(correo)
        );
    
        if (!correosValidos) {
            setErrores('Ingresa correos válidos separados por comas.');
        }
    
        setCorreos(correosIngresados);
    }

    const handleMoney = (e) => {
        setForm({
            ...form,
            costo: e
        })
    }
        
    const validateForm = () => {
        let validar = true
        let error = {}
        if(form.fecha_inicio === '' || form.fecha === null){
            error.fecha_inicio = "Seleccione un fecha de inicio"
            validar = false
        }
        if(form.fecha_fin === '' || form.fecha === null){
            error.fecha_fin = "Seleccione una fecha fin"
            validar = false
        }
        if (form.empresa === '') {
            error.empresa = "Seleccione una empresa"
            validar = false
        }
        if (form.tipoProyecto === '') {
            error.tipoProyecto = "Seleccione una tipo de proyecto"
            validar = false
        }
        if (form.nombre === '') {
            error.nombre = "escriba una secursal"
            validar = false
        }
        if (form.ciudad === '') {
            error.ciudad = "escriba una ciudad"
            validar = false
        }
        if (form.sucursal === '') {
            error.sucursal = "escriba una ubicación"
            validar = false
        }
        if (!check.fase1 && !check.fase2 && !check.fase3) {
            error.fases = "Seleccione al menos una fase";
            validar = false;
        }
        if(form.m2 === ''){
            error.m2 = "ingrese los m2"
            validar = false
        }
        if(form.costo === ''){
            error.costo = "ingrese el costo"
            validar = false
        }
        if(form.descripcion === ''){
            error.descripcion = "Escriba una descripción"
            validar = false
        }
        if(form.contacto === ''){
            error.contacto = "Escriba el nombre del contacto"
            validar = false
        }
        if (phoneNumber.length < 10) {
            error.phoneNumber = "El número de teléfono debe tener al menos 10 dígitos.";
            validar = false;
        }
        if (form.cliente === '') {
            error.cliente = "Seleccione una cliente principal"
            validar = false
        }
        if (clientes === '') {
            error.clientes = "Seleccione los clientes"
            validar = false
        }
        if (correos.length === 0) {
            error.correos = "Ingrese al menos un correo electrónico";
            validar = false;
        } else {
            const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
            const correosValidos = correos.every((correo) =>
                correoRegex.test(correo)
            );
    
            if (!correosValidos) {
                error.correos = "Ingrese correos válidos separados por comas.";
                validar = false;
            }
        }    

        setErrores(error)
        return validar
    }

    const handleSend = () => {
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
                    fecha_inicio: form.fecha_inicio,
                    fecha_fin: form.fecha_fin,
                    empresa: form.empresa,
                    tipoProyecto: form.tipoProyecto ? form.tipoProyecto : '',
                    nombre: form.nombre,
                    ciudad: form.ciudad,
                    sucursal: form.sucursal,
                    m2: form.m2,
                    costo: form.costo,
                    descripcion: form.descripcion,
                    contacto: form.contacto,
                    numero_contacto: phoneNumber,
                    cliente_principal: form.cliente,
                    clientes: clientes,
                    correos: JSON.stringify(correos),
                    fase1: check.fase1,
                    fase2: check.fase2,
                    fase3: check.fase3,
                }

                apiPostForm('v2/proyectos/proyectos', newForm, auth)
                    .then((data) => {
                        Swal.fire({
                            title: 'Proyecto creado',
                            text: 'el Proyecto se ha creado correctamente',
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
            <Accordion defaultExpanded>

                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                </AccordionSummary>

                <Typography style={{marginLeft: '1.5rem'}} className={Style.crear_proyecto}>datos del proyecto</Typography>

                <AccordionDetails> 
                    <div className='col-xl-12'>
                        <div className={Style.crear_primerParte}>
                            <div>
                                <InputLabel error={errores.fecha_inicio ? true : false}>Fecha de inicio</InputLabel>
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                                    <Grid container >
                                        <KeyboardDatePicker

                                            format="dd/MM/yyyy"
                                            name="fecha_inicio"
                                            value={form.fecha_inicio !== '' ? form.fecha_inicio : null}
                                            placeholder="dd/mm/yyyy"
                                            onChange={e => handleChangeFecha(e, 'fecha_inicio')} 
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            style={{ width: 150, paddingRight: '1.5rem'}}

                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </div>  

                            <div>
                                <InputLabel error={errores.fecha_fin ? true : false}>Fecha fin</InputLabel>
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                                    <Grid container >
                                        <KeyboardDatePicker

                                            format="dd/MM/yyyy"
                                            name="fecha_fin"
                                            value={form.fecha_fin !== '' ? form.fecha_fin : null}
                                            placeholder="dd/mm/yyyy"
                                            onChange={e => handleChangeFecha(e, 'fecha_fin')} 
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            style={{ width: 150, paddingRight: '1.5rem' }}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </div>    

                            <div className='col-xl-4'>
                                {
                                    opcionesFiltradas.length > 0 ?
                                        <div>
                                            <InputLabel>Empresa</InputLabel>
                                            <Select
                                                name="empresa"
                                                value={form.empresa}
                                                onChange={handleChange}
                                                error={errores.empresa ? true : false}
                                                style={{ width: 150 }}
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
                                {
                                    opciones.empresas.length > 0 && form.empresa !== '' ?
                                        <div>
                                            <InputLabel>tipo de proyecto</InputLabel>
                                            <Select
                                                name="tipoProyecto"
                                                value={form.tipoProyecto}
                                                onChange={handleChange}
                                                error={errores.tipoProyecto ? true : false}
                                                style={{ width: 150 }}
                                            >
                                                {/* {
                                                    opciones.empresas.map((item, index) => (
                                                        <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                                    ))
                                                } */}

                                                {opciones.empresas.find(item => item.value == form.empresa) && opciones.empresas.find(item => item.value == form.empresa).tipos.map((item, index) => (
                                                        <MenuItem key={index} value={item.id}>{item.tipo}</MenuItem>
                                                ))}

                                                
                                            </Select>
                                        </div>
                                    : null
                                }
                            </div>  
                        </div>

                        <div className={Style.crear_segundaParte}>
                            <div className='col-xl-4'>
                                <TextField
                                    name='nombre'
                                    label="sucursal"
                                    type="text"
                                    defaultValue={form.nombre}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    multiline
                                    style={{ width: 180 }}
                                    error={errores.nombre ? true : false}
                                />
                            </div>
                        
                            <div className='col-xl-4'>
                                <TextField
                                    name='ciudad'
                                    label="ciudad"
                                    type="text"
                                    defaultValue={form.ciudad}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    multiline
                                    style={{ width: 180 }}
                                    error={errores.ciudad ? true : false}
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
                                    style={{ width: 180 }}
                                    error={errores.sucursal ? true : false}
                                />
                            </div>
                        </div>

                        <div className={Style.crear_tercerParte}>
                            <div style={{marginTop: '1rem'}}>
                                <TextField
                                    name='m2'
                                    label="m²"
                                    type="number"
                                    defaultValue={form.m2}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    // multiline
                                    style={{ width: '100px', height: 100 }}
                                    error={errores.m2 ? true : false}
                                />
                            </div>

                            <div>
                                <CurrencyTextField
                                    label="costo con iva"
                                    variant="standard"
                                    value={form.costo} 
                                    name='costo'
                                    currencySymbol="$"
                                    outputFormat="number"
                                    onChange={(event, value) => handleMoney(value)} 
                                    style={{ width: '100px', height: 100, marginTop: '1rem' }}
                                    error={errores.costo ? true : false}
                                />
                            </div>

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
                                    style={{ width: '200px', height: 100 }}
                                    error={errores.descripcion ? true : false}
                                />
                            </div>
                        </div>

                        <div className={Style.crear_cuartaParte}>
                            {/* <div > */}
                                <InputLabel error={errores.fases ? true : false}>fases</InputLabel>
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
                            {/* </div>    */}
                        </div>                        
                    </div>
                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded className='proyect-accordion'>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography className='proyect-Subtitulo'>datos del contacto</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className='col-xl-12'>
                        <div className={Style.crear_quintaParte}>
                            <div>
                                <TextField
                                    name='contacto'
                                    label="nombre del contacto"
                                    type="text"
                                    defaultValue={form.contacto}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    multiline
                                    style={{ width: '220px', height: 100 }}
                                    error={errores.contacto ? true : false}
                                />
                            </div>

                            <div>
                                <InputLabel style={{textAlign:'center'}} id="demo-simple-select-label" error={errores.phoneNumber ? true : false}>numero del contacto</InputLabel>
                                <input
                                    type='text'
                                    value={phoneNumber}
                                    onKeyDown={handleKeyDown}
                                    onBlur={handleBlur}
                                    onChange={handleChangeNumber}
                                    placeholder='(__) ____ - ____'
                                    style={{ border: 'none', outline: 'none', textAlign: 'center'}} 
                                />
                                {/* {phoneNumberError && <div style={{ color: 'red' }}>{phoneNumberError}</div>} */}
                            </div>

                            <div className='col-xl-4'>
                                <InputLabel id="demo-simple-select-label" error={errores.correos ? true : false}>Correos del contacto <p style={{fontSize: '.7rem', marginTop: '.2rem'}}>separa los correos con una coma</p></InputLabel>
                                <TextField
                                name='correos'
                                // label='Correos del contacto'
                                // placeholder='separa los correos con una coma'
                                type='text'
                                onChange={handleChangeCorreos}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                multiline
                                style={{ width: '15rem', height: 100 }}
                                />
                            </div>
                        </div>

                        <div className={Style.crear_sextaParte}>
                            <div className='col-xl-4'>
                                {
                                    arrayClientes ?
                                        <div>
                                            <InputLabel>cliente principal</InputLabel>
                                            <Select
                                                name="cliente"
                                                value={form.cliente}
                                                onChange={handleChange}
                                                error={errores.cliente ? true : false}
                                                style={{ width: 200 }}
                                            >
                                                {
                                                    arrayClientes.map((item, index) => (
                                                        <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </div>
                                    : null
                                }
                            </div> 

                            <div>
                                {arrayClientes.length > 0 ? (
                                    <div>
                                    <InputLabel>Clientes</InputLabel>
                                    <Autocomplete
                                        name="clientes"
                                        options={arrayClientes}
                                        getOptionLabel={(option) => option.name}
                                        style={{ width: 230, paddingRight: '1rem' }}
                                        onChange={handleChangeClientes}
                                        multiple
                                        value={clientesSeleccionados}
                                        renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label={
                                            clientesSeleccionados.length > 0
                                                ? clientesSeleccionados
                                                    .map((c) => c.clientes_nombres)
                                                    .join(', ')
                                                : 'Clientes'
                                            }
                                        />
                                        )}
                                    />
                                    </div>
                                ) : null}
                            </div>

                            {/* <div>
                                {arrayClientes.length > 0 ? 
                                    <div>
                                        <InputLabel>clientes</InputLabel>
                                        <Autocomplete
                                            name="clientes"
                                            options={arrayClientes}
                                            getOptionLabel={(option) => option.name}
                                            style={{ width: 230, paddingRight: '1rem' }}
                                            onChange={handleChangeClientes}
                                            multiple // Esto permite múltiples selecciones
                                            renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label={
                                                clientes.length > 0 ? clientes.map((c) => c.clientes_nombres).join(', ') : 'clientes'
                                                }
                                            />
                                            )}
                                        />
                                    </div>
                                : null}
                            </div> */}

                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>

            <div>
                <div className="row justify-content-end">
                    <div className="col-md-4">
                        <button className={Style.sendButton} onClick={handleSend}>Crear</button>
                    </div>
                </div>   
            </div>
            
        </>
    )
}