import React, { useState, useEffect } from 'react';

import {useSelector} from 'react-redux';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';
import Swal from 'sweetalert2'
import { es } from 'date-fns/locale'
import axios from 'axios';

import { URL_DEV } from '../../../constants'
import { ordenamiento, setOptions } from '../../../functions/setters'

export default function EditProyect(props) { 
    const {proyecto} = props;
    const user = useSelector(state => state.authUser);


    const [form, setForm] = useState({
        fecha_inicio: proyecto.fecha_inicio,
        fecha_fin: proyecto.fecha_fin,
        empresa: proyecto.empresa.id,
        tipo: proyecto.tipo_proyecto_id,
        sucursal: proyecto.sucursal,
        ciudad: proyecto.ciudad,
        ubicacion: proyecto.ubicacion,
        m2: proyecto.m2,
        costo: proyecto.costo,
        descripcion: proyecto.descripcion,
    })

    const [opciones, setOpciones] = useState(false)

    useEffect(() => {
        getOptionsEmpresas();
    }, [])

    const handleChangeFechaInicio = (date) => {
        setForm({
            ...form,
            fecha_inicio: date
        })
    };

    const handleChangeFechaFin = (date) => {
        setForm({
            ...form,
            fecha_fin: date
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

    const getOptionsTipo = async () => { 

    }

    return (
        <>
            
            <form>
                {/* Periodo Inicio - Final */}
                <div>
                    <div>
                        <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
                            <Grid container justifyContent="space-around">
                                <KeyboardDatePicker
                                    margin="normal"
                                    label="Fecha de Inicio"
                                    format="dd/MM/yyyy"
                                    value={form.fecha_inicio}
                                    onChange={handleChangeFechaInicio}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>
                    <div>
                        <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
                            <Grid container justifyContent="space-around">
                                <KeyboardDatePicker
                                    margin="normal"
                                    label="Fecha de Termino"
                                    format="dd/MM/yyyy"
                                    value={form.fecha_fin}
                                    onChange={handleChangeFechaFin}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>    
                </div>
                {/* Seleccionar empresa */}
                {
                    opciones ?
                    <div>
                        <Select
                            value={form.empresa}
                            >
                            <MenuItem value={0} disabled>Selecciona una Empresa</MenuItem>
                            {opciones.empresas.map((item, index) => {
                                return (<MenuItem key={index} value={item.value}>{item.name}</MenuItem>)
                            })}

                            </Select>
                            <Select
                                value={form.tipo}
                            >
                                <MenuItem value={0} disabled>Selecciona un Tipo</MenuItem>
                                {opciones.tipos.map((item, index) => {
                                    return (<MenuItem key={index} value={item.value}>{item.name}</MenuItem>)
                                })}

                            </Select>
                    </div>:null
                }

                <TextField
                    name="sucursal"
                    value={form.sucursal}
                    label="Sucursal"
                />
                <TextField
                    name="ciudad"
                    value={form.ciudad}
                    label="Ciudad"
                />
                <TextField
                    name="ubicacion"
                    value={form.ubicacion}
                    label="Ubicación"
                />
                <TextField
                    name="m2"
                    value={form.m2}
                    label="Metros Cuadrados"
                />
                <TextField
                    name="costo"
                    value={form.costo}
                    label="Costo con IVA"
                />
                <TextField
                    name="descripcion"
                    value={form.descripcion}
                    label="Descripción"
                    rows={4}
                    multiline
                />
                <TextField
                    name="Nombre del contacto"
                    value={form.costo}
                    label="Costo con IVA"
                />
                <TextField
                    name="Telefono del contacto"
                    value={form.costo}
                    label="Costo con IVA"
                />
                <TextField
                    name="Correo del contacto"
                    value={form.costo}
                    label="Costo con IVA"
                />
                
                
            </form>
            
        </>
    )
}