import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { apiGet } from '../../../../functions/api';

import Style from './TicketsTi.module.css';

export default function VerTicketTi({ data }) {
    const authUser = useSelector(state => state.authUser);

    const nombre_empleado = (() => {
        if (data.empleado && typeof data.empleado === 'object') {
            return [data.empleado.nombre, data.empleado.apellido_paterno, data.empleado.apellido_materno]
                .filter(Boolean)
                .join(' ');
        }
        if (data.id_asignacion && typeof data.id_asignacion === 'string') {
            return data.id_asignacion;
        }
        return '';
    })();

    const [funcionalidades, setFuncionalidades] = useState([]);

    useEffect(() => {
        apiGet(`ti/funcionalidad/${data.id}`, authUser.access_token)
            .then(res => {
                setFuncionalidades(res.data.funcionalidades || []);
            })
            .catch(() => {
                setFuncionalidades([]);
            });
    }, [data.id, authUser.access_token]);

    const [form] = useState({
        fecha: new Date(data.fecha),
        tipo: data.tipo,
        estatus: data.estatus,
        fecha_entrega: data.fecha_entrega ? new Date(data.fecha_entrega) : '',
        descripcion: data.descripcion,
        prioridad: data.prioridad || '',
        autorizacion: data.autorizacion,
        funcionalidad: '',
        id_asignacion: data.empleado?.id || '',
        nombre_empleado: nombre_empleado
    });

    return (
        <div className={Style.container}>
            <div>
                <div>
                    <InputLabel>Fecha de solicitud</InputLabel>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                        <Grid container>
                            <KeyboardDatePicker
                                format="dd/MM/yyyy"
                                name="fecha"
                                value={form.fecha || null}
                                placeholder="dd/mm/yyyy"
                                KeyboardButtonProps={{ 'aria-label': 'change date' }}
                                disabled
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                </div>

                <div>
                    <InputLabel>Fecha de entrega</InputLabel>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                        <Grid container>
                            <KeyboardDatePicker
                                format="dd/MM/yyyy"
                                name="fecha_entrega"
                                value={form.fecha_entrega || null}
                                placeholder="dd/mm/yyyy"
                                KeyboardButtonProps={{ 'aria-label': 'change date' }}
                                disabled
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                </div>
            </div>

            <div>
                <div>
                    <InputLabel>Tipo</InputLabel>
                    <Select name="tipo" value={form.tipo} fullWidth disabled>
                        <MenuItem value={0}>Cambio</MenuItem>
                        <MenuItem value={1}>Soporte</MenuItem>
                        <MenuItem value={2}>Mejora</MenuItem>
                        <MenuItem value={3}>Reporte</MenuItem>
                        <MenuItem value={4}>Información</MenuItem>
                        <MenuItem value={5}>Capacitación</MenuItem>
                        <MenuItem value={6}>Servicio</MenuItem>
                        <MenuItem value={7}>Proyecto</MenuItem>
                    </Select>
                </div>

                <div>
                    <InputLabel>Estatus</InputLabel>
                    <Select name="estatus" value={form.estatus} fullWidth disabled>
                        <MenuItem value={0}>Solicitado</MenuItem>
                        <MenuItem value={1}>Autorizado</MenuItem>
                        <MenuItem value={2}>En desarrollo</MenuItem>
                        <MenuItem value={3}>Terminado</MenuItem>
                        <MenuItem value={4}>Cancelado</MenuItem>
                        <MenuItem value={5}>Rechazado</MenuItem>
                    </Select>
                </div>

                <div>
                    <InputLabel>Prioridad</InputLabel>
                    <Select name="prioridad" value={form.prioridad} fullWidth disabled>
                        <MenuItem value="alta">🔴 Alta</MenuItem>
                        <MenuItem value="media">🟡 Media</MenuItem>
                        <MenuItem value="baja">🟢 Baja</MenuItem>
                    </Select>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ minWidth: '120px', fontWeight: 600, color: '#666' }}>ASIGNACIÓN</span>
                <TextField
                    value={form.nombre_empleado}
                    disabled
                    variant="standard"
                    fullWidth
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ minWidth: '120px', fontWeight: 600, color: '#666' }}>DESCRIPCIÓN</span>
                <TextField
                    name="descripcion"
                    value={form.descripcion}
                    maxRows={4}
                    multiline
                    disabled
                    variant="standard"
                    fullWidth
                />
            </div>

            <div>
                <InputLabel>Funcionalidades</InputLabel>
                {funcionalidades.length > 0 ? (
                    funcionalidades.map((item, index) => (
                        <div key={index} className={Style.containerFuncionalidad}>
                            <span className={Style.textFuncionalidad}>
                                {index + 1}.- {item.descripcion}
                            </span>
                        </div>
                    ))
                ) : (
                    <div>No hay funcionalidades</div>
                )}
            </div>
        </div>
    );
}
