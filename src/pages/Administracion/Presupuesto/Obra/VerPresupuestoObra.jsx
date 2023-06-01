import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import Swal from 'sweetalert2'

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import InputLabel from '@material-ui/core/InputLabel';

import { apiOptions } from '../../../../functions/api'

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'
import Grid from '@material-ui/core/Grid';

import { waitAlert2 } from '../../../../functions/alert'

const setDateFormate = (date) => {
    let fecha = date.split('-')
    fecha = new Date(`${fecha[0]}`, `${fecha[1] - 1}`, `${fecha[2]}`)
    return fecha
}

export default function VerPresupuestoObra(props) {
    const { reload, handleClose, data } = props
    const areas = useSelector(state => state.opciones.areas)
    const auth = useSelector(state => state.authUser.access_token)
    const proyectos = useSelector(state => state.opciones.proyectos)
    const [form, setForm] = useState([])
    const [general, setGeneral] = useState({
        departamento: data.data.area.nombre,
        departamento_id: data.data.id_area,
        gerente: data.data.usuario.name,
        gerente_id: data.data.usuario.id,
        colaboradores: data.data.colaboradores,
        colaboradores_id: '',
        id_proyecto: data.data.id_proyecto,
        granTotal: '',
        nomina: 0,
        fecha_inicio: setDateFormate(data.data.fecha_inicio),
        fecha_fin: setDateFormate(data.data.fecha_fin),
        nombre: data.data.nombre,
        id: data.data.id,
        total: data.data.presupuesto,
    })

    useEffect(() => {
        getNominas()
    }, [])

    useEffect(() => {
        if (areas.length >= 13) {
            createData()
        }


    }, [areas])

    const createData = () => {
        let aux = []
        let id = 0
        areas.map((area, index) => {
            aux.push([])
        })
        setForm(aux)
    }


    const handleMoney = (value) => {
        setGeneral({
            ...general,
            total: value
        })
    }

    const createCurrencyInput = () => {
        return (
            <>
                <InputLabel >presupuesto total</InputLabel>
                <CurrencyTextField

                    variant="standard"
                    value={general.total}
                    currencySymbol="$"
                    outputFormat="number"
                    onChange={(e, value) => handleMoney(value)}
                    disabled
                />
            </>
        )
    }

    const getNominas = () => {
        waitAlert2()
        try {
            apiOptions(`presupuestosdep?departamento_id=${general.departamento_id}`, auth)
                .then(res => {
                    let suma = 0
                    /* setNominas([...res.data.empleados]) */
                    for (let i = 0; i < res.data.empleados.length; i++) {
                        suma += res.data.empleados[i].nomina_imss + res.data.empleados[i].nomina_extras
                    }
                    suma = suma * 2
                    setGeneral({
                        ...general,
                        nomina: suma,
                        colaboradores: res.data.empleados.length
                    })
                    Swal.close()
                })

        } catch (error) {
            Swal.close()
            console.log(error)
        }
    }

    return (
        <>
            <div style={{ backgroundColor: 'white', padding: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ textAlign: 'center' }}>Infraestructura e Interiores, S.A. de C.V.</h1>
                    <h2 style={{ textAlign: 'center' }}>Presupuesto de Obra</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: '5rem' }}>
                    <div>
                        <InputLabel >Departamento</InputLabel>
                        <TextField
                            type="text"
                            defaultValue={general.departamento}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled
                        />
                    </div>
                    <div>
                        <InputLabel >Colaboradores</InputLabel>
                        <TextField
                            type="text"
                            defaultValue={general.colaboradores}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled
                        />
                    </div>
                    <div>
                        <InputLabel >Gerente</InputLabel>
                        <TextField
                            type="text"
                            defaultValue={general.gerente}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled
                        />
                    </div>
                    <div>
                        <InputLabel >presupuesto total</InputLabel>
                        <CurrencyTextField

                            variant="standard"
                            value={general.total}
                            currencySymbol="$"
                            outputFormat="number"
                            onChange={(e, value) => handleMoney(value)}
                            disabled
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: '5rem' }}>
                    <div>
                        <InputLabel >Fecha</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker

                                    format="dd/MM/yyyy"
                                    name="fecha_pago"
                                    value={general.fecha_inicio !== '' ? general.fecha_inicio : null}
                                    placeholder="dd/mm/yyyy"
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    disabled
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>

                    <div>
                        <InputLabel >Fecha Fin</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker

                                    format="dd/MM/yyyy"
                                    name="fecha_pago"
                                    value={general.fecha_fin !== '' ? general.fecha_fin : null}
                                    placeholder="dd/mm/yyyy"
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    disabled
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>

                    <div>
                        <InputLabel >Nombre del presupuesto</InputLabel>
                        <TextField
                            type="text"
                            defaultValue={general.nombre}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled
                        />
                    </div>

                    {
                        proyectos.length > 0 &&
                        <div>
                            <InputLabel >Proyecto</InputLabel>
                            <Select value={general.id_proyecto} disabled>
                                <MenuItem value="" hidden>Selecciona proyecto</MenuItem>
                                {
                                    proyectos.map((proyecto, index) => (
                                        <MenuItem key={index} value={proyecto.id}>{proyecto.nombre}</MenuItem>
                                    ))
                                }

                            </Select>
                        </div>
                    }

                </div>

            </div>
        </>
    )
}