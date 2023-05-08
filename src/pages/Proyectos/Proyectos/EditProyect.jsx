/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {useSelector} from 'react-redux';

import DateFnsUtils from '@date-io/date-fns';
import Swal from 'sweetalert2'
import { es } from 'date-fns/locale'
import axios from 'axios';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputLabel from '@material-ui/core/InputLabel';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

import { URL_DEV } from '../../../constants'
import { ordenamiento, setOptions } from '../../../functions/setters'
import { setSingleHeader } from "../../../functions/routers"

import { apiPostForm, apiGet, apiDelete } from '../../../functions/api'

import '../../../styles/_editProyect.scss'

export default function EditProyect(props) { 
    const {proyecto, reload} = props;
    const user = useSelector(state => state.authUser);
    const colaboradores = useSelector(state => state.opciones.vehiculos.colaboradores)
    const departamentos = useSelector(state => state.opciones.departamentos)
    const [form, setForm] = useState({
        nombre:proyecto.nombre,
        fechaInicio: proyecto.fecha_inicio,
        fechaFin: proyecto.fecha_fin,
        empresa: { name: proyecto.empresa.name, label: proyecto.empresa.name, value: parseInt(proyecto.empresa.id) },
        tipo: proyecto.tipo_proyecto_id,
        sucursal: proyecto.sucursal,
        ciudad: proyecto.ciudad,
        ubicacion: proyecto.ubicacion ? proyecto.ubicacion : '',
        m2: proyecto.m2,
        costo: proyecto.costo,
        descripcion: proyecto.descripcion,
        fase1: proyecto.fase1 === 1 ? true : false,
        fase2: proyecto.fase2 === 1 ? true : false,
        fase3: proyecto.fase3 === 1 ? true : false,
        contacto: proyecto.contacto,
        numero_contacto: proyecto.numero_contacto,
        correos: proyecto.contactos.map(contacto => contacto.correo),
        clientes: proyecto.clientes,
        cliente_id: proyecto.cliente_id,
        fases: [],
        responsable: proyecto.responsable ? proyecto.responsable.empleado_id : '',
    })
    const [responsable, setResponsable] = useState({
        responsable: '',
        id_responsable: '',
        colaborador: '',
        id_colaborador: '',
        departamento: '',
        id_departamento: '',
    })
    const [state, setState] = useState([])

    const arrayFases = [
        { value: 'fase1', name: 'Fase 1', label: 'Fase 1' },
        { value: 'fase2', name: 'Fase 2', label: 'Fase 2' },
        { value: 'fase3', name: 'Fase 3', label: 'Fase 3' },
    ]

    const [opciones, setOpciones] = useState(false)

    useEffect(() => {
        getOptionsEmpresas();
        handleGetUsers();
    }, [])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeFechaInicio = (date) => {
        setForm({
            ...form,
            fechaInicio: new Date(date)
        })
    };

    const handleChangeFechaFin = (date) => {
        setForm({
            ...form,
            fechaFin: new Date(date)
        })
    };

    const getOptionsEmpresas = async () => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            willOpen: () => {
                Swal.showLoading()
            }
        })

        axios.get(`${URL_DEV}proyectos/opciones`, { headers: { Authorization: `Bearer ${user.access_token}` } }).then(
            (response) => {
                const { clientes, empresas, estatus, proveedores } = response.data
                let aux = [];
                let options = {
                    empresas: [],
                    clientes: [],
                    // colonias: [],
                    estatus: [],
                    // tipos:[],
                    cp_clientes: [],
                    proveedores: []
                }
                clientes.forEach((element) => {
                    aux.push({
                        name: element.empresa,
                        value: element.id.toString(),
                        label: element.empresa,
                        cp: element.cp,
                        estado: element.estado,
                        municipio: element.municipio,
                        colonia: element.colonia,
                        calle: element.calle
                    })
                    return false
                })
                options.clientes = aux.sort(ordenamiento)
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['estatus'] = setOptions(estatus, 'estatus', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')

                if (proyecto.empresa) {
                    options.empresas.forEach(empresa => {
                        if (proyecto.empresa.name === empresa.name) {
                            options.tipos = setOptions(empresa.tipos, 'tipo', 'id')
                        }
                    });
                }

                Swal.close()
                setOpciones(options)
            },
            (error) => {
                
            }
        ).catch((error) => {
            
            
        })
    }

    const handleChangeFase = (e) => {
        form.fase1 = 0
        form.fase2 = 0
        form.fase3 = 0
        let nuevaFase = arrayFases.filter(fase => fase.value === e.target.name)
        setForm({
            ...form,
            [e.target.name]: e.target.checked ? 1 : 0,
            fases: nuevaFase
        })
    }

    const handleChangeCorreo = (e, valor) => {
        setForm({
            ...form,
            correos: valor
        })
    }

    const handleChangeCliente = (e, valor) => {
        setForm({
            ...form,
            clientes: valor
        })
    }

    const handleCahngeEmpresa = (e) => {
        e.preventDefault()
        
        let nuevaEmpresa = opciones.empresas.filter(empresa => empresa.value == e.target.value)
        
        setForm({
            ...form,
            empresa: {
                name: nuevaEmpresa[0].name,
                label: nuevaEmpresa[0].name,
                value: parseInt(e.target.value)
            }
        })
    }

    const handleSave = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Guardando...',
            allowOutsideClick: false,
            willOpen: () => {
                Swal.showLoading()
            },
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
            },
        })
        let tipo_proyecto = opciones.tipos.filter(tipo => tipo.value == form.tipo)
        let nueva_fase
        if (form.fase1) {
            nueva_fase = arrayFases.filter(fase => fase.value === 'fase1')
        } else if (form.fase2 ) {
            nueva_fase = arrayFases.filter(fase => fase.value === 'fase2')
        } else if (form.fase3 ) {
            nueva_fase = arrayFases.filter(fase => fase.value === 'fase3')
        }
        let new_clientes = form.clientes.map(cliente => {
            return {
                name: cliente.empresa,
                value: `${cliente.id}`,
                label: cliente.empresa,
            }
        })

        let cliente = opciones.clientes.filter(cliente => cliente.value == form.cliente_id)
            
        let newForm = {
            nombre: proyecto.nombre,
            fechaInicio: form.fechaInicio,
            fechaFin: form.fechaFin,
            empresa: form.empresa,
            tipoProyecto: {
                name: tipo_proyecto[0].name,
                label: tipo_proyecto[0].name,
                value: `${form.tipo}`
            },
            fases: nueva_fase,
            m2: form.m2,
            ubicacion: form.ubicacion,
            ciudad: form.ciudad,
            sucursal: form.sucursal,
            costo: form.costo,
            ubicacion_cliente: form.ubicacion,
            cliente_principal: {
                name: cliente[0].name,
                label: cliente[0].label,
                value: cliente[0].value
            },
            clientes: new_clientes,
            descripcion: form.descripcion,
            numeroContacto: form.numero_contacto,
            contacto: form.contacto,
            correos: form.correos,

        }
        

        try {
            axios.put(`${URL_DEV}v3/proyectos/proyectos/${proyecto.id}`, newForm, { headers: setSingleHeader(user.access_token) })
                .then((response) => {
                    Swal.close()
                    reload()
                })
                .catch((error) => {
                    Swal.close()
                    Swal.fire({
                        icon: 'warning',
                        title: `${error.response.data.message}`,
                        showConfirmButton: true,
                        timer: 3000,
                        timerProgressBar: true,
                    })
                })
        } catch (error) {

        }
    }

    const handleChangeAdd = (e) => { 
        const { value } = e.target
        let aux

        colaboradores.map((usuario) => {
            if (usuario.id == parseInt(value)) {
                aux = {
                    id_usuario: usuario.id,
                    id_proyecto: proyecto.id,
                }
            }
        })

        try {
            Swal.fire({
                title: 'Agregando colaborador',
                text: 'Espere un momento...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                },
                timer: 2000
            })
            apiPostForm('v2/proyectos/calendario-proyectos/users/create', aux, user.access_token).then((response) => {
                handleGetUsers()
            })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Ocurrió un error al agregar el colaborador',
                    })
                })
        } catch (error) {

        }

    }

    const handleGetUsers = () => {
        apiGet(`v2/proyectos/calendario-proyectos/users/${proyecto.id}`, user.access_token).then((response) => {
            let aux = []
            response.data.User.map((user) => {
                colaboradores.find((usuario) => {
                    if (usuario.id == user.id_usuario) {
                        usuario.id_delete = user.id
                        aux.push(usuario)
                    }
                })
            })
            setState([
                ...aux,
            ])
        })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ocurrió un error al obtener los colaboradores',
                })
            })
    }

    const handleDeleteUser = (e, id) => {
        e.preventDefault()
        Swal.fire({
            title: 'Eliminando colaborador',
            text: "Espera un momento...",
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            },
            timer: 2000,
        })

        apiDelete(`v2/proyectos/calendario-proyectos/users/${id}`, user.access_token)
            .then((response) => {
                handleGetUsers()
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ocurrió un error al eliminar el colaborador',
                })
            })
    }

    const handleSaveResponsable = (id) => {
        try {
            apiPostForm(`v2/proyectos/calendario-proyectos/users/responsable/${proyecto.id}`, { id_user:id}, user.access_token)
                .then((response) => { 
                    console.log(response)
                    reload()
                })
                .catch((error) => { 
                    console.log(error)
                })
        } catch (error) {
            console.log(error)
        }
    }

    console.log(departamentos)

    const handleChangeDepartamento = (e) => {
        setResponsable({
            ...responsable,
            [e.target.name]: e.target.value
        })
    }

    const handleAddResponsable = (e) => {
        e.preventDefault()
        try {
            if (responsable.id_responsable !== '') {
                const newForm = {
                    id_proyecto: proyecto.id,
                    id_area: responsable.id_departamento,
                    id_empleado: responsable.id_responsable,
                    descripcion: 'responsable'
                }
                apiPostForm('areas/asignado', newForm, user.access_token)
                    .then((response) => {
                        console.log(response)
                        /* reload() */
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } 
            if (responsable.id_colaborador !== '') {
                const newForm = {
                    id_proyecto: proyecto.id,
                    id_area: responsable.id_departamento,
                    id_empleado: responsable.id_colaborador,
                    descripcion: 'colaborador'
                }
                apiPostForm('areas/asignado', newForm, user.access_token)
                    .then((response) => {
                        console.log(response)
                        /* reload() */
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
            setResponsable({
                id_departamento: '',
                id_responsable: '',
                id_colaborador: '',
            })
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <div className='proyect-Titulo'>
                <span>{proyecto.simpleName}</span>
            </div>
            
            <form>

                <Accordion
                    defaultExpanded
                    className='proyect-accordion'
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className='proyect-Subtitulo'>Fecha del proyecto</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className='container-Date'>
                            <div>
                                <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
                                    <Grid container justifyContent="space-around">
                                        <KeyboardDatePicker
                                            margin="normal"
                                            label="Fecha de Inicio"
                                            format="dd/MM/yyyy"
                                            value={form.fechaInicio}
                                            onChange={handleChangeFechaInicio}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </div>
                            <Divider orientation="vertical" flexItem />
                            <div>
                                <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
                                    <Grid container justifyContent="space-around">
                                        <KeyboardDatePicker
                                            margin="normal"
                                            label="Fecha de Termino"
                                            format="dd/MM/yyyy"
                                            value={form.fechaFin}
                                            onChange={handleChangeFechaFin}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </div>    
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded className='proyect-accordion'>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography className='proyect-Subtitulo'>Informacion del Proyecto</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className='container-Info-Proyecto'>
                            {
                                opciones ?
                                    <>
                                        <div>
                                            <InputLabel id="label-select-Empresa">Empresa</InputLabel>
                                            <Select
                                                value={form.empresa.value ? form.empresa.value : 0}
                                                labelId="label-select-Empresa"
                                                onChange={handleCahngeEmpresa}
                                            >
                                                <MenuItem value={0}></MenuItem>
                                                {opciones.empresas.map((item, index) => {
                                                    return (<MenuItem key={index} value={item.value} >{item.name}</MenuItem>)
                                                })}

                                            </Select>
                                        </div>
                                        <Divider orientation="vertical" flexItem />
                                        <div>
                                            <InputLabel id="label-select-Tipo">Tipo de Proyecto</InputLabel>
                                            <Select
                                                value={form.tipo}
                                                name='tipo'
                                                labelId="label-select-Tipo"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={0} disabled>Selecciona un Tipo</MenuItem>
                                                {opciones.tipos.map((item, index) => {
                                                    return (<MenuItem key={index} value={item.value} name='tipo'>{item.name}</MenuItem>)
                                                })}

                                            </Select>    
                                        </div>
                                        
                                        
                                    </> : null
                            }
                            <Divider orientation="vertical" flexItem />
                            <TextField
                                name="m2"
                                value={form.m2}
                                label="Metros Cuadrados"
                                onChange={handleChange}
                                type='number'
                            />
                        </div>    
                    </AccordionDetails>
                </Accordion>

                <Accordion
                    className='proyect-accordion'
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className='proyect-Subtitulo'>Colaboradores Designados</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className='container-Cliente'>
                            
                            {
                                colaboradores.length > 0 &&
                                <div>
                                    <InputLabel>Seleccionar Responsable</InputLabel>
                                    
                                    <Select
                                        name='responsable'
                                        onChange={e => handleSaveResponsable(e.target.value)}
                                        value={form.responsable}
                                    >
                                        <MenuItem value={0}></MenuItem>
                                        {
                                            colaboradores.sort((a, b) => {
                                                if (a.nombre > b.nombre) {
                                                    return 1
                                                }
                                                if (a.nombre < b.nombre) {
                                                    return -1
                                                }
                                                return 0
                                            }
                                            ).map((empleado, index) => {
                                                return <MenuItem key={index} value={empleado.id}>{`${empleado.nombre} ${empleado.apellido_paterno !== null ? empleado.apellido_paterno : ''} ${empleado.apellido_materno !== null ? empleado.apellido_materno : ''}`}</MenuItem>
                                            })
                                        }

                                    </Select>
                                </div>
                            }    
                            
                            
                            {
                                colaboradores.length > 0 &&
                                <div>
                                    <InputLabel>Agregar colaborador</InputLabel>
                                    <Select
                                        onChange={handleChangeAdd}
                                    >
                                        <MenuItem value={0}></MenuItem>
                                        {
                                            colaboradores.sort((a, b) => {
                                                if (a.nombre > b.nombre) {
                                                    return 1
                                                }
                                                if (a.nombre < b.nombre) {
                                                    return -1
                                                }
                                                return 0
                                            }
                                            ).map((empleado, index) => {
                                                return <MenuItem key={index} value={empleado.id}>{`${empleado.nombre} ${empleado.apellido_paterno !== null ? empleado.apellido_paterno : ''} ${empleado.apellido_materno !== null ? empleado.apellido_materno : ''}`}</MenuItem>
                                            })
                                        }

                                    </Select>
                                </div>
                            }
                            {
                                state.length > 0 ?
                                    <div className='colaboradores'>
                                        {state.sort((a, b) => {
                                            if (a.nombre > b.nombre) {
                                                return 1
                                            }
                                            if (a.nombre < b.nombre) {
                                                return -1
                                            }
                                            return 0
                                        }
                                        ).map((empleado, index) => {
                                            return <div key={index}><span onClick={e => handleDeleteUser(e, empleado.id_delete)}>X</span>{`${empleado.nombre} ${empleado.apellido_paterno !== null ? empleado.apellido_paterno : ''} ${empleado.apellido_materno !== null ? empleado.apellido_materno : ''}`}</div>
                                        })}
                                    </div>
                                    : <></>
                            }

                            

                            
                        </div>
                        
                    </AccordionDetails>
                </Accordion>

                
                <Accordion
                    className='proyect-accordion'
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className='proyect-Subtitulo'>Responsables</Typography>
                    </AccordionSummary>
                    <AccordionDetails>

                        <div className="container-Info-Proyecto">

                            <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                                
                                {
                                    departamentos.length > 0 &&
                                    <div>
                                            <InputLabel>Departamento</InputLabel>
                                            <Select 
                                                name='id_departamento'
                                                onChange={handleChangeDepartamento}
                                                value={responsable.id_departamento}
                                            >
                                                <MenuItem value={0}></MenuItem>
                                                {
                                                    departamentos.map((departamento, index) => {
                                                        return <MenuItem key={index} value={departamento.id}>{departamento.nombre}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                    </div>
                                }    
                                {
                                    responsable.id_departamento !== '' &&
                                    <div>
                                            <InputLabel>Responsable</InputLabel>
                                            <Select
                                                name='id_responsable'
                                                onChange={handleChangeDepartamento}
                                                value={responsable.id_responsable}
                                            >   
                                                <MenuItem value={0}></MenuItem>
                                                {
                                                    departamentos.filter(departamento => departamento.id === responsable.id_departamento)[0].empleados.map((empleado, index) => {
                                                        return <MenuItem key={index} value={empleado.id}>{`${empleado.nombre} ${empleado.apellido_paterno !== null ? empleado.apellido_paterno : ''} ${empleado.apellido_materno !== null ? empleado.apellido_materno : ''}`}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                    </div>      

                                }

                                {
                                    responsable.id_responsable !== '' &&
                                    <div>
                                            <InputLabel>Colaborador</InputLabel>
                                            <Select
                                                name='id_colaborador'
                                                onChange={handleChangeDepartamento}
                                                value={responsable.id_colaborador}
                                            >
                                                <MenuItem value={0}></MenuItem>
                                                {
                                                    departamentos.filter(departamento => departamento.id === responsable.id_departamento)[0].empleados.map((empleado, index) => {
                                                        return <MenuItem key={index} value={empleado.id}>{`${empleado.nombre} ${empleado.apellido_paterno !== null ? empleado.apellido_paterno : ''} ${empleado.apellido_materno !== null ? empleado.apellido_materno : ''}`}</MenuItem>
                                                    }
                                                    )
                                                }
                                            </Select>
                                    </div>
                                }
                                {
                                    responsable.id_colaborador !== '' &&
                                    <div>
                                            <button
                                                onClick={handleAddResponsable}
                                            >
                                                Agregar
                                            </button>
                                    </div>

                                }

                                {
                                    proyecto.departamentos.length > 0 &&
                                    proyecto.departamentos.map((departamento, index) => {
                                        return (
                                            <div key={index} className='colaboradores'>
                                                <span /* onClick={e => handleDeleteDepartamento(e, departamento.id)} */>X</span>
                                                {`${departamento.nombre}`}
                                            </div>
                                        )
                                    })
                                }
                      
                            </div> 
                        </div>
                        
                        
                    </AccordionDetails>
                </Accordion>
                
                <Accordion className='proyect-accordion'>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3a-content"
                        id="panel3a-header"
                    >
                        <Typography className='proyect-Subtitulo'>Ubicacion del Proyecto</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className='container-Direccion'>
                            <TextField
                                name="nombre"
                                value={form.nombre}
                                label="Sucursal"
                                onChange={handleChange}
                            />
                            <Divider orientation="vertical" flexItem />
                            <TextField
                                name="ciudad"
                                value={form.ciudad}
                                label="Ciudad"
                                onChange={handleChange}
                            />
                            <Divider orientation="vertical" flexItem />
                            <TextField
                                name="sucursal"
                                value={form.sucursal}
                                label="Ubicación"
                                multiline
                                onChange={handleChange}
                            />    
                        </div>    
                    </AccordionDetails>
                </Accordion>
                
                <Accordion className='proyect-accordion'>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4a-content"
                        id="panel4a-header"
                    >
                        <Typography className='proyect-Subtitulo'>Fase </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className='container-Fases'>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={form.fase1 && !form.fase2 && !form.fase3}
                                        name="fase1"
                                        color="primary"
                                    />
                                }
                                label="Fase 1"
                                onChange={handleChangeFase}
                            />
                            <Divider orientation="vertical" flexItem />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={form.fase2 &&  !form.fase3}
                                        name="fase2"
                                        color="primary"
                                    />
                                }
                                label="Fase 2"
                                onChange={handleChangeFase}
                            />
                            <Divider orientation="vertical" flexItem />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={form.fase3}
                                        name="fase3"
                                        color='primary'
                                    />
                                }
                                label="Fase 3"
                                onChange={handleChangeFase}
                            />
                            
                        </div>  
                    </AccordionDetails>
                </Accordion>
                
                <Accordion className='proyect-accordion'>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel5a-content"
                        id="panel5a-header"
                    >
                        <Typography className='proyect-Subtitulo'>Costo del Proyecto</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TextField
                            name="costo"
                            value={form.costo}
                            label="Costo con IVA"
                            color='secondary'
                            onChange={handleChange}
                            type='number'
                        />
                    </AccordionDetails>
                </Accordion>
                
                <Accordion className='proyect-accordion'>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel6a-content"
                        id="panel6a-header"
                    >
                        <Typography className='proyect-Subtitulo'>Cliente</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className='container-Cliente'>
                            {
                                opciones ?
                                    <div>
                                        <InputLabel id="label-select-Cliente_principal">Cliente principal</InputLabel>
                                        <Select
                                            value={form.cliente_id}
                                            labelId="label-select-Cliente_principal"
                                            name='cliente_id'
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={0} disabled>{form.cliente ? form.cliente.nombre : 'Selecciona un cliente principal'}</MenuItem>
                                            {opciones.clientes.map((item, index) => {
                                                return (<MenuItem key={index + 1} value={item.value}>{item.name}</MenuItem>)
                                            })}

                                        </Select>
                                    </div>
                                    : null
                            }
                            {opciones &&
                                <div className='input-tag'>
                                    <Autocomplete
                                        options={opciones.clientes.map((item) => item.name)}
                                        multiple
                                        defaultValue={form.clientes.map((item) => item.empresa)}
                                        id="tags-filled"
                                        freeSolo
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField {...params} variant="filled" label="Clientes" placeholder="agregar cliente" />
                                        )}
                                        onChange={(e, value) => handleChangeCliente(e, value)}
                                    />
                                </div>
                                
                            }
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion className='proyect-accordion'>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel7a-content"
                        id="panel7a-header"
                    >
                        <Typography className='proyect-Subtitulo'>Contacto</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className='container-Contacto-Cliente'>
                            
                            <TextField
                                name="contacto"
                                value={form.contacto}
                                label="Nombre del contacto"
                                fullWidth
                                color='secondary'
                                onChange={handleChange}
                            />   
                            <Divider orientation="vertical" flexItem />
                            <TextField
                                name="numero_contacto"
                                value={form.numero_contacto}
                                label="Telefono del contacto"
                                fullWidth
                                onChange={handleChange}
                            />    
                            <div className='input-tag'>
                                <Autocomplete
                                    options={form.correos ? form.correos : []}
                                    multiple
                                    defaultValue={form.correos ? form.correos : []}
                                    id="tags-filled"
                                    freeSolo
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} variant="filled" label="Correo(s) de contacto" placeholder="agregar correo" />
                                    )}
                                    onChange={(e, value) => handleChangeCorreo(e, value)}
                                />
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded className='proyect-accordion'>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel8a-content"
                        id="panel8a-header"
                    >
                        <Typography className='proyect-Subtitulo'>Descripcion</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className='container-Descripcion'>
                            <TextField
                                name="descripcion"
                                value={form.descripcion}
                                label="Descripción"
                                fullWidth
                                multiline
                                onChange={handleChange}
                            />
                        </div>
                    </AccordionDetails>
                </Accordion>
  
            </form>

            <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSave}
            >
                Guardar
            </Button>
            
            
        </>
    )
}

/* eslint-enable */