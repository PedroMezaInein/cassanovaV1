import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Autocomplete, TextField, Paper, InputLabel, Collapse, Button as MuiButton } from '@mui/material';
import { useSelector } from 'react-redux';
import { validateAlert } from '../../../functions/alert';
import { Input, CalendarDay, Button } from '../../form-components';
import { apiGet } from '../../../functions/api';

export default function FormPrestamos({
    form = {},
    onSubmit,
    setForm,
    onChange,
    formeditado = 0,
    existencias = 0,
    tipo = '',
    ...props
}) {
    const tipoLower = String(tipo ?? form?.tipo ?? '').trim().toLowerCase();
    const isHerramienta = tipoLower === 'herramienta';
    const [openConsumo, setOpenConsumo] = useState(false);
    const disp = Number(existencias ?? 0);
    const cant = form.cantidad === '' ? '' : Number(form.cantidad);

    const handleSubmit = (e) => {
        e.preventDefault();
        validateAlert(onSubmit, e, 'form-prestamos');
    };
    useEffect(() => {
        if (isHerramienta && (form.cantidad == null || form.cantidad === '')) {
            setForm(prev => ({ ...prev, cantidad: 1 }));
        }
    }, [isHerramienta, form.cantidad, setForm]);

    const proyectos = useSelector(state => state.opciones.proyectos || []);

    // 🔁 Auto-seleccionar si hay solo un proyecto
    useEffect(() => {
        const disponibles = proyectos.filter(p => !!p);
        if (disponibles.length === 1 && !form.proyecto) {
            setForm(prev => ({
                ...prev,
                proyecto: disponibles[0].id
            }));
        }
    }, [proyectos, setForm, form.proyecto]);
    const [empleados, setEmpleados] = useState([]);
    const auth = useSelector(state => state.authUser.access_token);


    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                const res = await apiGet('user/users/options', auth);
                console.log('Empleados sin filtrar:', res.data);

                const empleadosObra = (res.data?.empleados || []).filter(
                    (e) => e.tipo_empleado?.toLowerCase() === 'obra'
                );

                console.log('Empleados filtrados (Obra):', empleadosObra);
                setEmpleados(empleadosObra);
            } catch (error) {
                console.error('Error al cargar empleados:', error);
                setEmpleados([]);
            }
        };

        fetchEmpleados();
    }, [auth]);





    return (
        <Box component="form" id="form-prestamos" onSubmit={handleSubmit} {...props} sx={{ px: 2, py: 3 }}>
            <Grid container spacing={3}>
                {/* FECHA + PROYECTO + RESPONSABLE */}
                <Grid container spacing={2}>
                    {/* FECHA DEL PRÉSTAMO */}
                    <Grid item xs={false} md={1} />
                    <Grid item xs={12} md={4}>
                        <Box textAlign="center" mb={1}>
                            <Typography variant="subtitle2" fontWeight="bold">
                                Fecha del préstamo
                            </Typography>
                        </Box>
                        <CalendarDay
                            value={form.fecha}
                            name="fecha"
                            onChange={onChange}
                            date={form.fecha}
                            withformgroup={0}
                            requirevalidation={1}
                        />
                    </Grid>

                    {/* ESPACIADOR para empujar la columna derecha */}
                    <Grid item xs={false} md={2.5} />

                    {/* COLUMNA DERECHA: Proyecto + Responsable */}
                    <Grid item xs={12} md={4}>
                        <Grid container spacing={2}>
                            {/* Proyecto */}
                            <Grid item xs={12}>
                                <Paper sx={{ padding: 1, textAlign: 'center' }} elevation={0}>
                                    <InputLabel>PRESTAMO PROYECTO</InputLabel>
                                    <Autocomplete
                                        name="proyecto"
                                        options={proyectos.sort((a, b) => a.nombre.localeCompare(b.nombre))}
                                        groupBy={(option) => option.nombre.charAt(0).toUpperCase()}
                                        getOptionLabel={(option) => `${option.nombre} (${option.id})`}
                                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                        value={proyectos.find(p => p.id === form.proyecto) || null}
                                        onChange={(event, value) =>
                                            setForm(prev => ({
                                                ...prev,
                                                proyecto: value?.id || '',
                                                ubicacion: value?.nombre || ''
                                            }))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Proyecto"
                                                fullWidth
                                            />
                                        )}
                                    />
                                </Paper>
                            </Grid>


                            {/* Responsable debajo */}
                            <Grid item xs={12}>
                                <Paper sx={{ padding: 1, textAlign: 'center' }} elevation={0}>
                                    <InputLabel>RESPONSABLE</InputLabel>
                                    <Autocomplete
                                        options={empleados}
                                        getOptionLabel={(option) => `${option.nombre}`}
                                        isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
                                        value={empleados.find(e => e.nombre === form.responsable) || null}
                                        onChange={(event, value) =>
                                            setForm(prev => ({ ...prev, responsable: value?.nombre || '' }))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Responsable"
                                                variant="outlined"
                                                required
                                                fullWidth
                                            />
                                        )}
                                    />
                                </Paper>
                            </Grid>
                            {!isHerramienta && (
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 1, textAlign: 'center' }} elevation={0}>
                                        <InputLabel>CANTIDAD A PRESTAR</InputLabel>
                                        <TextField
                                            name="cantidad"
                                            label="Cantidad"
                                            type="number"
                                            value={form.cantidad ?? ''}
                                            onChange={onChange}
                                            fullWidth
                                            required
                                            inputProps={{ min: 1, step: 'any', max: disp || undefined }}
                                            error={cant !== '' && (cant <= 0 || cant > disp)}
                                            helperText={
                                                cant !== '' && cant > disp
                                                    ? `No puede exceder ${disp}.`
                                                    : `Disponibles: ${disp}`
                                            }
                                        />
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>

                    </Grid>
                    
                {/* Comentario */}
                <Grid item xs={12}>
                    <Paper sx={{ padding: 1, textAlign: 'center' }} elevation={0}>
                        <TextField
                            label="Comentario"
                            name="comentario"
                            value={form.comentario}
                            onChange={onChange}
                            placeholder="COMENTARIO"
                            fullWidth
                            multiline
                            rows={2}
                            required
                            variant="outlined"
                            error={!form.comentario}
                            helperText={!form.comentario ? 'Incorrecto. Ingresa tu comentario.' : ''}
                        />
                    </Paper>
                </Grid>
                </Grid>



                {/* Botón */}
                <Grid item xs={12}>
                    <Box textAlign="right">
                        <Button icon="" text="ENVIAR" type="submit" />
                    </Box>
                </Grid>
            </Grid>
        </Box>



    );
}
