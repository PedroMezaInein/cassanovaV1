import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Autocomplete,
    TextField,
    Paper,
    DialogActions,
    Button,
    InputLabel,
} from '@mui/material';
import Modal from '../../../components/singles/Modal';
import { useSelector } from 'react-redux';
import { apiGet } from '../../../functions/api';

const ModalReasignar = ({
    modalReasignar,
    setModalReasignar,
    prestamoSeleccionado,
    formReasignacion,
    setFormReasignacion,
    handleSubmitReasignar,
}) => {
    const auth = useSelector(state => state.authUser.access_token);
    const proyectos = useSelector(state => state.opciones.proyectos || []);
    const [empleados, setEmpleados] = useState([]);

    // 🔁 Auto-selección si solo hay un proyecto
    useEffect(() => {
        const disponibles = proyectos.filter(p => !!p);
        if (disponibles.length === 1 && !formReasignacion.proyecto) {
            setFormReasignacion(prev => ({
                ...prev,
                proyecto: disponibles[0].id,
            }));
        }
    }, [proyectos, formReasignacion.proyecto, setFormReasignacion]);

    // 🔁 Carga de empleados tipo "obra"
    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                const res = await apiGet('user/users/options', auth);
                const empleadosObra = (res.data?.empleados || []).filter(
                    e => e.tipo_empleado?.toLowerCase() === 'obra'
                );
                setEmpleados(empleadosObra);
            } catch (error) {
                console.error('Error al cargar empleados:', error);
                setEmpleados([]);
            }
        };

        fetchEmpleados();
    }, [auth]);
    useEffect(() => {
        if (prestamoSeleccionado && proyectos.length > 0 && !formReasignacion.proyecto) {
            // Si tienes el ID del proyecto directamente:
            if (prestamoSeleccionado.proyecto_id) {
                const proyectoEncontrado = proyectos.find(p => p.id === prestamoSeleccionado.proyecto_id);
                if (proyectoEncontrado) {
                    setFormReasignacion(prev => ({
                        ...prev,
                        proyecto: proyectoEncontrado.id,
                        ubicacion: proyectoEncontrado.nombre
                    }));
                }
            }
        }
    }, [prestamoSeleccionado, proyectos, formReasignacion.proyecto]);

    return (
        modalReasignar && prestamoSeleccionado && (
            <Modal
                size="md"
                title="Reasignar préstamo"
                show={modalReasignar}
                handleClose={() => setModalReasignar(false)}
            >
                <Box component="form" onSubmit={handleSubmitReasignar} sx={{ px: 2, py: 3 }}>
                    <Grid container spacing={2}>
                        {/* Proyecto */}
                        <Grid item xs={12}>
                            <Paper sx={{ padding: 1, textAlign: 'center' }} elevation={0}>
                                <InputLabel>UBICACIÓN PRÉSTAMO:</InputLabel>
                                <Autocomplete
                                    name="proyecto"
                                    //disabled
                                    options={proyectos.sort((a, b) => a.nombre.localeCompare(b.nombre))}
                                    groupBy={(option) => option.nombre.charAt(0).toUpperCase()}
                                    getOptionLabel={(option) => `${option.nombre} (${option.id})`}
                                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                    value={proyectos.find(p => p.id === formReasignacion.proyecto) || null}
                                    onChange={(event, value) =>
                                        setFormReasignacion(prev => ({
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

                        {/* Responsable */}
                        <Grid item xs={12}>
                            <Paper sx={{ padding: 1, textAlign: 'center' }} elevation={0}>
                                <InputLabel>Responsable</InputLabel>
                                <Autocomplete
                                    options={empleados}
                                    getOptionLabel={(option) => option.nombre}
                                    isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
                                    value={empleados.find(e => e.nombre === formReasignacion.responsable) || null}
                                    onChange={(event, value) =>
                                        setFormReasignacion(prev => ({
                                            ...prev,
                                            responsable: value?.nombre || ''
                                        }))
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} label="Responsable" variant="outlined" fullWidth required />
                                    )}
                                />
                            </Paper>
                        </Grid>

                        {/* Comentario */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Comentario"
                                name="comentario"
                                value={formReasignacion.comentario}
                                onChange={(e) =>
                                    setFormReasignacion(prev => ({ ...prev, comentario: e.target.value }))
                                }
                                margin="normal"
                                multiline
                                rows={3}
                            />
                        </Grid>
                    </Grid>

                    <DialogActions sx={{ justifyContent: 'flex-end' }}>
                        <Button onClick={() => setModalReasignar(false)}>Cancelar</Button>
                        <Button type="submit" variant="contained">Guardar</Button>
                    </DialogActions>
                </Box>
            </Modal>
        )
    );
};

export default ModalReasignar;
