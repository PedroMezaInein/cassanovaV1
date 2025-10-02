import React, { useState, useEffect } from 'react';
import { Button, Box, TextField, Modal, Typography, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { apiPutForm, apiPostForm } from '../../../../functions/api';

const opcionesEstatus = [
    { value: 'vendido', label: '💰 Vendido — Ya fue vendido y no está disponible' },
    { value: 'dañado', label: '⚠️ Dañado — No disponible por condiciones físicas' },
    { value: 'reparación', label: '🔧 En reparación — En mantenimiento o proceso de reparación' },
    { value: 'robado', label: '🚫 Robado — Declarado como faltante por robo o siniestro' },
];

export default function EstatusEquipo({ data, show, handleClose, reload }) {
    const auth = useSelector(state => state.authUser.access_token);
    const [estatus, setEstatus] = useState('');
    const [fecha, setFecha] = useState(null);

    useEffect(() => {
        if (show && data) {
            setEstatus(data.estatus || '');
            setFecha(null);
        }
    }, [show, data]);

    const handleSave = async () => {
        const requiereDesasignar = ['vendido'];
        const asignado = Array.isArray(data.raws)
            ? data.raws.some(item => !item.disponible)
            : !data.disponible;

        if (requiereDesasignar.includes(estatus.toLowerCase()) && asignado) {
            handleClose();
            Swal.fire({
                icon: 'warning',
                title: 'Debes desasignar el equipo primero',
                text: 'No puedes marcar como vendido mientras siga asignado.',
            });
            return;
        }

        try {
            await apiPutForm(`equipos/estatus/${data.id}`, { estatus, fecha }, auth);


            Swal.fire({ icon: 'success', title: 'Estatus actualizado', showConfirmButton: false, timer: 1500 });
            reload();
            handleClose();
        } catch (error) {
            console.error(error);
            Swal.fire('Error al actualizar estatus o historial', '', 'error');
        }
    };


    return (
        <Modal open={show} onClose={handleClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" gutterBottom sx={{ mb: 4 }} >Cambiar Estatus</Typography>
                <TextField
                    select
                    label="Estatus"
                    fullWidth
                    value={estatus}
                    onChange={e => setEstatus(e.target.value)}
                >
                    {opcionesEstatus.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <Box mt={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label="Fecha de cambio de estatus"
                            value={fecha}
                            onChange={(newValue) => setFecha(newValue)}
                            slotProps={{
                                textField: { fullWidth: true },
                            }}
                        />
                    </LocalizationProvider>
                </Box>


                <Box mt={2} display="flex" gap={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={handleClose}>Cerrar</Button>
                    <Button variant="contained" onClick={handleSave} disabled={!estatus || !fecha}>Guardar</Button>
                </Box>
            </Box>
        </Modal>
    );
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};
