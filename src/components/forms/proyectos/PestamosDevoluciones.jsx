import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Grid,
    Tabs,
    Tab,
    Tooltip,
    Typography,
    IconButton,
    Collapse,
    InputLabel,
    Paper,
    TextField,
    Autocomplete,
    Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import SVG from 'react-inlinesvg';
import moment from 'moment';
import { CalendarDay } from '../../form-components';
import { setDiaMesTexto, setFechaTexto } from '../../../functions/functions';
import { deleteAlert } from '../../../functions/alert';
import { toAbsoluteUrl } from '../../../functions/routers';
import { useSelector } from 'react-redux';
import { apiGet } from '../../../functions/api';
import { Delete, Visibility } from '@mui/icons-material';

const PestamosDevoluciones = ({
    bodega,
    setForm,
    form,
    onChange,
    onSubmit,
    deletePrestamo,
    deleteDevolucion,
    tipo,
    data = [],
}) => {
    const [active, setActive] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [empleados, setEmpleados] = useState([]);
    const auth = useSelector((state) => state.authUser.access_token);

    // Ordenar préstamos: activo primero, luego por fecha desc — sin mutar props
    const prestamosOrdenados = useMemo(() => {
        const arr = Array.isArray(bodega?.prestamos) ? [...bodega.prestamos] : [];
        return arr.sort((a, b) => {
            if (a.terminado === 0 && b.terminado !== 0) return -1;
            if (b.terminado === 0 && a.terminado !== 0) return 1;
            return new Date(b.fecha) - new Date(a.fecha);
        });
    }, [bodega?.prestamos]);

    // Prestamo seleccionado
    const currentPrestamo = prestamosOrdenados[active];

    // Sumatoria de devoluciones segura (si no viene calculada del backend)
    const sumDevolucionesSafe = useMemo(() => {
        if (!currentPrestamo) return 0;
        if (typeof currentPrestamo.sumDevoluciones === 'number') {
            return currentPrestamo.sumDevoluciones;
        }
        return (currentPrestamo.devoluciones || []).reduce(
            (acc, d) => acc + (Number(d.cantidad) || 0),
            0
        );
    }, [currentPrestamo]);

    // Métricas
    const prestados = Number(currentPrestamo?.cantidad || 0);
    const devueltos = Number(sumDevolucionesSafe || 0);
    const restante = Math.max(0, prestados - devueltos);
    const estaTerminado = currentPrestamo?.terminado === 1 || restante === 0;

    // Nombre del material
    const nombreMaterial = useMemo(() => {
        if (!currentPrestamo) return '';
        const it = data.find((item) => item.id === currentPrestamo.bodega_id);
        return it?.nombre || '';
    }, [data, currentPrestamo]);

    // Seleccionar tab inicial (activo si existe, si no el primero)
    useEffect(() => {
        if (prestamosOrdenados.length) {
            const idxActivo = prestamosOrdenados.findIndex((p) => p.terminado === 0);
            setActive(idxActivo >= 0 ? idxActivo : 0);
        } else {
            setActive(0);
        }
    }, [prestamosOrdenados]);

    const toggleForm = () => setShowForm((prev) => !prev);

    // Prefill del form al abrir
    useEffect(() => {
        if (showForm && currentPrestamo) {
            setForm((prev) => ({
                ...prev,
                responsable: currentPrestamo.responsable || '',
                ubicacion: currentPrestamo.ubicacion || '',
                adjuntos: prev.adjuntos || [],
                cantidad: restante > 0 ? restante : 0,
                comentario: prev.comentario || '',
                fecha: prev.fecha || new Date(), // default para evitar null
            }));
        }
    }, [showForm, currentPrestamo, setForm, restante]);

    // Cargar empleados de obra
    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                const res = await apiGet('user/users/options', auth);
                const empleadosObra = (res.data?.empleados || []).filter(
                    (e) => e.tipo_empleado?.toLowerCase() === 'obra'
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
        if (Number(form.cantidad) === 0 && (form.adjuntos?.length || 0) > 0) {
            setForm(prev => ({ ...prev, adjuntos: [] }));
        }
    }, [form.cantidad, setForm, form.adjuntos]);

    return (
        <>
            {/* TABS SUPERIOR */}
            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'center',
                    overflowX: 'auto',
                    py: 1,
                    backgroundColor: '#f8f9fa',
                }}
            >
                <Tabs
                    key={prestamosOrdenados.length}
                    value={Math.min(active, Math.max(0, prestamosOrdenados.length - 1))}
                    onChange={(_, newValue) => setActive(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    TabIndicatorProps={{ style: { display: 'none' } }}
                    sx={{ display: 'flex', justifyContent: 'center', px: 2 }}
                >
                    {prestamosOrdenados.map((prestamo, index) => (
                        <Tooltip title={prestamo.ubicacion || 'Sin ubicación'} key={index}>
                            <Tab
                                value={index}
                                disableRipple
                                sx={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: '50%',
                                    bgcolor:
                                        active === index
                                            ? 'rgba(100, 100, 100, 0.15)'
                                            : 'rgba(0, 0, 0, 0.05)',
                                    color: '#000',
                                    mx: 1,
                                    transition: '0.3s',
                                    boxShadow: active === index ? 3 : 1,
                                    '&:hover': {
                                        bgcolor:
                                            active === index
                                                ? 'rgba(100, 100, 100, 0.2)'
                                                : 'rgba(0, 0, 0, 0.08)',
                                    },
                                    padding: 0,
                                    textAlign: 'center',
                                    minWidth: 'unset',
                                }}
                                label={
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        justifyContent="center"
                                        height="100%"
                                    >
                                        <Typography variant="caption" fontWeight="bold" fontSize={11}>
                                            {setDiaMesTexto(prestamo.fecha)}
                                        </Typography>
                                        <Typography variant="caption" fontSize={10}>
                                            {new Date(prestamo.fecha).getFullYear()}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            fontWeight="bold"
                                            fontSize={10}
                                            color="inherit"
                                        >
                                            {prestamo.cantidad}{' '}
                                            /{' '}
                                            {typeof prestamo.sumDevoluciones === 'number'
                                                ? prestamo.sumDevoluciones
                                                : (prestamo.devoluciones || []).reduce(
                                                    (acc, d) => acc + (Number(d.cantidad) || 0),
                                                    0
                                                )}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </Tooltip>
                    ))}
                </Tabs>
            </Box>

            {/* PANEL DE CONTENIDO */}
            {currentPrestamo && (
                <>
                    {/* Estadísticas */}
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Paper sx={{ p: 2, display: 'flex', gap: 4, alignItems: 'center' }}>
                            <Box display="flex" alignItems="center">
                                <SVG
                                    src={toAbsoluteUrl('/images/svg/Sign-out.svg')}
                                    style={{ width: 30 }}
                                />
                                <Typography ml={1}>
                                    <strong>{prestados}</strong> PRESTADOS
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <SVG
                                    src={toAbsoluteUrl('/images/svg/Sign-in.svg')}
                                    style={{ width: 30 }}
                                />
                                <Typography ml={1}>
                                    <strong>{devueltos}</strong> DEVUELTOS
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <SVG
                                    src={toAbsoluteUrl('/images/svg/Warning.svg')}
                                    style={{ width: 30 }}
                                />
                                <Typography ml={1}>
                                    <strong>{restante}</strong> RESTANTE
                                </Typography>
                            </Box>

                            {estaTerminado && (
                                <Box ml={2} px={1.5} py={0.5} borderRadius={1} bgcolor="#e8f5e9">
                                    <Typography
                                        variant="caption"
                                        fontWeight="bold"
                                        color="success.main"
                                    >
                                        PRÉSTAMO TERMINADO
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Box>

                    {/* PRÉSTAMO */}
                    <Box mt={4} p={2} position="relative" borderLeft="4px solid red">
                        <Grid container justifyContent="space-between">
                            <Typography fontWeight="bold">MATERIAL: {nombreMaterial}</Typography>

                            <Typography variant="body2" color="textSecondary">
                                RESPONSABLE: <strong>{currentPrestamo.responsable}</strong>
                            </Typography>
                        </Grid>

                        <Typography fontWeight="bold">
                            FECHA DE PRÉSTAMO:{' '}
                            <strong>{setFechaTexto(currentPrestamo?.fecha)}</strong>
                        </Typography>
                        <Typography fontWeight="bold">
                            COMENTARIOS: {currentPrestamo.comentarios || '—'}
                        </Typography>
                        <Typography fontWeight="bold" mt={1}>
                            CANTIDAD PRESTADA: <strong>{prestados}</strong> · DEVUELTOS:{' '}
                            <strong>{devueltos}</strong> · RESTANTE:{' '}
                            <strong>{restante}</strong>
                        </Typography>

                        {!estaTerminado && (
                            <IconButton
                                color="error"
                                onClick={() =>
                                    deleteAlert(
                                        '¿ESTÁS SEGURO QUE DESEAS ELIMINAR EL PRÉSTAMO?',
                                        '¡NO PODRÁS REVERTIR ESTO!',
                                        () => deletePrestamo(currentPrestamo.bodega_id, currentPrestamo.id)
                                    )
                                }
                            >
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Box>

                    {/* DEVOLUCIONES con “restante tras cada devolución” */}
                    {Array.isArray(currentPrestamo.devoluciones) &&
                        currentPrestamo.devoluciones.length > 0 && (
                            <Box mt={2}>
                                {(() => {
                                    let acumulado = 0;
                                    return currentPrestamo.devoluciones.map((devolucion, key) => {
                                        const cantDev = Number(devolucion.cantidad || 0);
                                        acumulado += cantDev;
                                        const restanteTrasEsta = Math.max(0, prestados - acumulado);

                                        return (
                                            <Box
                                                key={key}
                                                mt={3}
                                                p={2}
                                                borderLeft="4px solid green"
                                                position="relative"
                                            >
                                                <Grid container justifyContent="space-between">
                                                    <Typography fontWeight="bold">
                                                        DEVOLUCIÓN: {nombreMaterial}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        RESPONSABLE: <strong>{devolucion.responsable}</strong>
                                                    </Typography>
                                                </Grid>

                                                <Typography variant="body2" fontWeight="bold" mt={1}>
                                                    FECHA: {setFechaTexto(devolucion.fecha)}
                                                </Typography>

                                                <Typography variant="body2" mt={0.5}>
                                                    CANTIDAD DEVUELTA: <strong>{cantDev}</strong> · RESTANTE
                                                    DESPUÉS: <strong>{restanteTrasEsta}</strong>
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="textSecondary"
                                                    mt={0.5}
                                                >
                                                    COMENTARIOS: {devolucion.comentarios || '—'}
                                                </Typography>

                                                {/* Si deseas permitir borrar la devolución, descomenta */}
                                                {/* <IconButton
                          color="error"
                          onClick={() =>
                            deleteAlert(
                              '¿Eliminar devolución?',
                              'No podrás revertir esto.',
                              () =>
                                deleteDevolucion({
                                  bodega_id: currentPrestamo.bodega_id,
                                  prestamo_id: devolucion.prestamo_bodega_id,
                                  id: devolucion.id,
                                })
                            )
                          }
                        >
                          <DeleteIcon />
                        </IconButton> */}
                                            </Box>
                                        );
                                    });
                                })()}
                            </Box>
                        )}

                    {/* BOTÓN Y FORMULARIO */}
                    <Box mt={3}>
                        {!estaTerminado && restante > 0 && (
                            <Box mt={3} display="flex" justifyContent="flex-end">
                                <Button
                                    startIcon={<ReplyIcon />}
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    onClick={toggleForm}
                                    sx={{
                                        borderRadius: '20px',
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        px: 2.5,
                                        py: 1,
                                        fontSize: '13px',
                                    }}
                                >
                                    REGISTRAR DEVOLUCIÓN
                                </Button>
                            </Box>
                        )}

                        <Collapse in={showForm}>
                            <Box
                                component="form"
                                id="form-devolución"
                                onSubmit={(e) => onSubmit(e, currentPrestamo)}
                                sx={{ borderRadius: 2, px: { xs: 1, md: 3 }, py: 4 }}
                            >
                                <Grid container spacing={3}>

                                    {/* IZQUIERDA: CALENDARIO */}
                                    <Grid item xs={12} md={6}>
                                        <Box textAlign="center" mb={1}>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                Fecha de devolución
                                            </Typography>
                                        </Box>
                                        <CalendarDay
                                            value={form.fecha}
                                            name="fecha"
                                            onChange={onChange}
                                            date={form.fecha}
                                            withformgroup={0}
                                            requirevalidation={1}
                                            minDate={new Date(moment(currentPrestamo.fecha))}
                                        />
                                    </Grid>

                                    {/* DERECHA: CANTIDAD + UBICACIÓN + RESPONSABLE + ADJUNTOS */}
                                    <Grid item xs={12} md={6}>
                                        <Grid container spacing={2}>
                                            {/* Cantidad a devolver */}
                                            <Grid item xs={12}>
                                                <Paper sx={{ p: 1.5 }} elevation={0}>
                                                    <InputLabel>CANTIDAD A DEVOLVER</InputLabel>
                                                    <TextField
                                                        type="number"
                                                        name="cantidad"
                                                        value={form.cantidad ?? ''}
                                                        onChange={(e) => {
                                                            const raw = Number(e.target.value);
                                                            const val = isNaN(raw) ? '' : Math.max(0, Math.min(raw, restante));
                                                            setForm(prev => ({ ...prev, cantidad: val }));
                                                        }}
                                                        inputProps={{ min: 0, max: restante }}
                                                        fullWidth
                                                    // no lo marques required fijo; si quieres, puedes mostrar helper cuando >0
                                                    />

                                                </Paper>
                                            </Grid>

                                            {/* Ubicación */}
                                            <Grid item xs={12}>
                                                <Paper sx={{ p: 1.5 }} elevation={0}>
                                                    <InputLabel>UBICACIÓN DEL PRÉSTAMO</InputLabel>
                                                    <TextField
                                                        name="ubicacion"
                                                        label="Ubicación"
                                                        value={form.ubicacion || ''}
                                                        onChange={onChange}
                                                        fullWidth
                                                        variant="outlined"
                                                        required
                                                    />
                                                </Paper>
                                            </Grid>

                                            {/* Responsable */}
                                            <Grid item xs={12}>
                                                <Paper sx={{ p: 1.5 }} elevation={0}>
                                                    <InputLabel>RESPONSABLE</InputLabel>
                                                    <Autocomplete
                                                        options={empleados}
                                                        getOptionLabel={(option) => `${option.nombre}`}
                                                        isOptionEqualToValue={(option, value) => option.nombre === value?.nombre}
                                                        value={empleados.find(e => e.nombre === form.responsable) || null}
                                                        onChange={(_, value) =>
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

                                            {/* Adjuntos (obligatorio) */}
                                            <Grid item xs={12}>
                                                <Paper sx={{ p: 2 }} elevation={0}>
                                                    <InputLabel sx={{ mb: 1, fontWeight: 'bold' }}>
                                                        Adjuntar archivos {Number(form.cantidad) > 0 ? '(obligatorio)' : '(no aplica)'}
                                                    </InputLabel>

                                                    {/* SOLO renderiza el input cuando hay algo que devolver */}
                                                    {Number(form.cantidad) > 0 && (
                                                        <>
                                                            <Button variant="contained" component="label" sx={{ textTransform: 'none', mb: 2 }}>
                                                                Seleccionar archivos
                                                                <input
                                                                    type="file"
                                                                    multiple
                                                                    hidden
                                                                    accept="image/*"
                                                                    name="adjuntos"
                                                                    required={Number(form.cantidad) > 0}
                                                                    onChange={(e) => {
                                                                        const archivos = Array.from(e.target.files || []);
                                                                        setForm(prev => ({
                                                                            ...prev,
                                                                            adjuntos: [...(prev.adjuntos || []), ...archivos],
                                                                        }));
                                                                    }}
                                                                />
                                                            </Button>

                                                            <Grid container spacing={2}>
                                                                {(form.adjuntos || []).map((file, index) => {
                                                                    const url = URL.createObjectURL(file);
                                                                    return (
                                                                        <Grid item key={index}>
                                                                            <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: 120 }}>
                                                                                <img
                                                                                    src={url}
                                                                                    alt={`adjunto-${index}`}
                                                                                    style={{
                                                                                        width: '100%', height: 'auto', borderRadius: 8,
                                                                                        objectFit: 'cover', border: '1px solid #ccc'
                                                                                    }}
                                                                                />
                                                                                <Box mt={1} display="flex" gap={1}>
                                                                                    <Tooltip title="Ver">
                                                                                        <IconButton color="primary" onClick={() => window.open(url, '_blank')} size="small">
                                                                                            <Visibility />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                    <Tooltip title="Eliminar">
                                                                                        <IconButton
                                                                                            color="error"
                                                                                            onClick={() =>
                                                                                                setForm(prev => ({
                                                                                                    ...prev,
                                                                                                    adjuntos: prev.adjuntos.filter((_, i) => i !== index),
                                                                                                }))
                                                                                            }
                                                                                            size="small"
                                                                                        >
                                                                                            <Delete />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                </Box>
                                                                            </Box>
                                                                        </Grid>
                                                                    );
                                                                })}
                                                            </Grid>

                                                            {/* Mensaje de validación solo si cantidad > 0 y no hay archivos */}
                                                            {(!form.adjuntos || form.adjuntos.length === 0) && (
                                                                <Typography color="error" mt={1}>
                                                                    Debes adjuntar al menos una imagen.
                                                                </Typography>
                                                            )}
                                                        </>
                                                    )}
                                                </Paper>
                                            </Grid>

                                        </Grid>
                                    </Grid>

                                    {/* Comentario (puedes dejarlo abajo a todo el ancho) */}
                                    <Grid item xs={12}>
                                        <Paper sx={{ p: 2, textAlign: 'center' }} elevation={0}>
                                            <TextField
                                                label="Comentario"
                                                name="comentario"
                                                value={form.comentario || ''}
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

                                    {/* Botones */}
                                    <Grid item xs={12}>
                                        <Box display="flex" justifyContent="flex-end" gap={2}>
                                            <Button variant="outlined" color="error" onClick={() => setShowForm(false)}>
                                                Cancelar
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                disabled={
                                                    !form.responsable ||
                                                    !form.ubicacion ||
                                                    form.cantidad === '' ||
                                                    Number(form.cantidad) < 0 ||
                                                    Number(form.cantidad) > restante ||
                                                    (Number(form.cantidad) > 0 && (!form.adjuntos || form.adjuntos.length === 0))
                                                }
                                            >
                                                Agregar devolución
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Collapse>

                    </Box>
                </>
            )}
        </>
    );
};

export default PestamosDevoluciones;
