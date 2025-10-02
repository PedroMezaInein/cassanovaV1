import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Modal, Typography, List, ListItem, ListItemText } from '@mui/material';
import { apiGet } from '../../../../functions/api'; // ✅ Solo UNA VEZ, con la ruta correcta

export default function VerHistorial({ data, show, handleClose }) {
    const auth = useSelector(state => state.authUser.access_token);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(false);
    const [equipo, setEquipo] = useState(null);
    const fetchHistorial = async () => {
        if (!data) return;
        setLoading(true);
        try {
            const res = await apiGet(`equipos/historial/${data.id}`, auth);
            setHistorial(res.data.historial || []);
            setEquipo(res.data.equipo || null); // ✅ Guardas el equipo que trae las fechas
        } catch (error) {
            console.error('Error al cargar historial:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (show) {
            fetchHistorial();
        } else {
            setHistorial([]);
        }
    }, [show]);
    const historialFiltrado = historial.filter(
        (item, index, self) => {
            const desc = (item.descripcion || '').trim().toUpperCase();
            const fecha = (item.fecha_asignacion || '').trim();

            return index === self.findIndex((t) =>
                (t.descripcion || '').trim().toUpperCase() === desc &&
                (t.fecha_asignacion || '').trim() === fecha
            );
        }
    );


    return (
        <Modal open={show} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography variant="h6" gutterBottom>
                    Historial
                </Typography>

                {/* Fechas de compra y garantía */}
                <Typography variant="body2" gutterBottom>
                    <strong>Fecha de compra:</strong> {equipo?.fecha_compra || 'N/A'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                    <strong>Fecha de garantía:</strong> {equipo?.fecha_garantia || 'N/A'}
                </Typography>


                {/* Historial */}
                <Box sx={{ position: 'relative', minHeight: '300px' }}>
                    {loading ? (
                        <Typography>Cargando...</Typography>
                    ) : historialFiltrado.length > 0 ? (
                        <>
                            {/* Caja flotante para estatus */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    textAlign: 'left',
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Actualización estatus
                                </Typography>

                                <List dense sx={{ p: 0 }}>
                                    {historialFiltrado.map((item, index) => (
                                        <ListItem key={index} disablePadding disableGutters>
                                            <ListItemText
                                                primary={
                                                    item.empleado
                                                        ? `${item.empleado.nombre} ${item.empleado.apellido_paterno} ${item.empleado.apellido_materno}`
                                                        : item.descripcion
                                                }
                                                secondary={`Fecha: ${item.fecha_asignacion?.slice(0, 10)}`}
                                                sx={{ textAlign: 'left' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </>
                    ) : (
                        <Typography>No hay historial.</Typography>
                    )}
                </Box>





                <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Button variant="outlined" onClick={handleClose}>Cerrar</Button>
                </Box>

            </Box>
        </Modal>
    );
}
