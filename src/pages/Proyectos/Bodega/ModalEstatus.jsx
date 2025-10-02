import React, { useMemo, useState, useEffect } from 'react';
import {
    Box, Grid, TextField, MenuItem, Button, InputAdornment,
    Divider, List, ListItem, ListItemText, Typography, Pagination, Stack
} from '@mui/material';
import Modal from '../../../components/singles/Modal';
import Swal from 'sweetalert2';

const PAGE_SIZE = 5;

const ModalEstatus = ({
    open,
    onClose,
    nuevoEstatus,
    setNuevoEstatus,
    handleSubmitEstatus,
    historial = [],
}) => {
    const [fechaVenta, setFechaVenta] = useState('');
    const [montoVenta, setMontoVenta] = useState('');
    const [comentario, setComentario] = useState('');

    // paginación
    const [page, setPage] = useState(1);
    const totalPages = useMemo(
        () => Math.max(1, Math.ceil((historial?.length || 0) / PAGE_SIZE)),
        [historial]
    );

    const paginatedHistorial = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return historial.slice(start, start + PAGE_SIZE);
    }, [historial, page]);

    const esVendido = useMemo(() => nuevoEstatus === 'Vendido', [nuevoEstatus]);

    useEffect(() => {
        if (open) {
            // limpiar campos al abrir
            setFechaVenta('');
            setMontoVenta('');
            setComentario('');
           
            setPage(1); // resetea paginación al abrir
        }
    }, [open, setNuevoEstatus]);

    // si cambia el historial externamente, asegura que la página sea válida
    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [historial, totalPages, page]);

    const handleChangeEstatus = (e) => {
        const value = e.target.value;
        setNuevoEstatus(value);
        if (value !== 'Vendido') {
            setFechaVenta('');
            setMontoVenta('');
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (comentario.trim() === '') {
            Swal.fire('Campo requerido', 'Debes ingresar un comentario.', 'warning');
            return;
        }

        if (esVendido) {
            if (!fechaVenta) {
                Swal.fire('Campo requerido', 'Debes seleccionar la fecha de venta.', 'warning');
                return;
            }
            if (!montoVenta) {
                Swal.fire('Campo requerido', 'Debes ingresar el monto de la venta.', 'warning');
                return;
            }
        }

        if (esVendido) {
            handleSubmitEstatus({
                estatus: 'Vendido',
                fecha: fechaVenta,
                monto: Number(montoVenta),
                nota: comentario,
            });
        } else {
            handleSubmitEstatus({
                estatus: nuevoEstatus,
                nota: comentario,
            });
        }
    };

    // helper “X–Y de N”
    const startIdx = historial.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const endIdx = Math.min(page * PAGE_SIZE, historial.length);

    return (
        <Modal size="lg" title="Cambiar estatus" show={open} handleClose={onClose} contentProps={{ sx: { overflow: 'visible' } }}>
            <Box component="form" onSubmit={onSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="ESTATUS"
                            select
                            name="estatus"
                            value={nuevoEstatus}
                            onChange={handleChangeEstatus}
                            InputLabelProps={{ shrink: true }}
                            margin="normal"                  // 👈 añade espacio vertical MUI
                        >
                            <MenuItem value="Disponible">Disponible (✅ Sin defectos)</MenuItem>
                            <MenuItem value="Precaución">Precaución (⚠️ Puede fallar)</MenuItem>
                            <MenuItem value="Dañado">Dañado (❌ No usar)</MenuItem>
                            <MenuItem value="Mantenimiento">Mantenimiento (⛔ No disponible temporalmente)</MenuItem>
                            <MenuItem value="Vendido">Vendido (💰 Ya no disponible)</MenuItem>
                        </TextField>
                    </Grid>

                    {esVendido && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Fecha de venta"
                                    type="date"
                                    value={fechaVenta}
                                    onChange={(e) => setFechaVenta(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Monto de venta"
                                    type="number"
                                    inputProps={{ step: '0.01', min: '0' }}
                                    value={montoVenta}
                                    onChange={(e) => setMontoVenta(e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        endAdornment: <InputAdornment position="end">MXN</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        </>
                    )}

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Comentario"
                            placeholder="Agrega contexto del cambio de estatus"
                            multiline
                            minRows={2}
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                        />
                    </Grid>
                </Grid>

                <Box display="flex" justifyContent="flex-end" mt={3} gap={1}>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button variant="contained" color="primary" type="submit">
                        Guardar estatus
                    </Button>
                </Box>

                <Divider sx={{ my: 2 }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle1">Historial de estatus</Typography>
                    {historial.length > PAGE_SIZE && (
                        <Typography variant="caption" color="text.secondary">
                            Mostrando {startIdx}–{endIdx} de {historial.length}
                        </Typography>
                    )}
                </Stack>

                {historial.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">Sin movimientos.</Typography>
                ) : (
                    <>
                        <List dense>
                            {paginatedHistorial.map((h, idx) => (
                                <ListItem key={h.id ?? `${page}-${idx}`} disableGutters>
                                    <ListItemText
                                        primary={`${h.estatus}${h.monto ? ` — $${Number(h.monto).toFixed(2)} MXN` : ''}`}
                                        secondary={`${h.cambiado_en ?? ''}${h.nota ? ` · ${h.nota}` : ''}`}
                                    />
                                </ListItem>
                            ))}
                        </List>

                        {historial.length > PAGE_SIZE && (
                            <Box display="flex" justifyContent="center" mt={1}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={(_, value) => setPage(value)}
                                    size="small"
                                    shape="rounded"
                                />
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default ModalEstatus;
