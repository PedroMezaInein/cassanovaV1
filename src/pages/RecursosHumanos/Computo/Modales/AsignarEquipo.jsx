import React, { useState } from 'react';
import { Button, Box, Autocomplete, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import { apiPostForm } from '../../../../functions/api';
import { useSelector } from 'react-redux';
export default function AsignarEquipo({ data, show, handleClose, reload, users, mode }) {
    const auth = useSelector(state => state.authUser.access_token);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleAssignEquipo = async () => {
        if (mode === 'asignar' && !data?.disponible) {
            Swal.fire('Ya está asignado', '', 'info');
            return;
        }

        if (!selectedUser) {
            Swal.fire('Selecciona un usuario', '', 'warning');
            return;
        }

        try {
            await apiPostForm(`equipos/asignar`, {
                equipoId: data.id,
                persona: selectedUser.id
            }, auth);

            await Swal.fire({
                icon: 'success',
                title: mode === 'reasignar' ? 'Equipo reasignado' : 'Equipo asignado',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            });

            handleClose();
            reload();
        } catch (error) {
            console.error(error);
            Swal.fire('Error al asignar', '', 'error');
        }
    };

    return show && (
        <Box sx={modalStyle}>
            <h2>{mode === 'reasignar' ? 'Reasignar Equipo' : 'Asignar Equipo'}</h2>
            <Autocomplete
                options={users}
                getOptionLabel={(u) => `${u.nombre} ${u.apellido_paterno} ${u.apellido_materno}`}
                onChange={(e, value) => setSelectedUser(value)}
                renderInput={(params) => <TextField {...params} label="Usuario" />}
            />
            <Box mt={2} display="flex" gap={2}>
                <Button variant="contained" onClick={handleAssignEquipo} disabled={!selectedUser}>
                    {mode === 'reasignar' ? 'Reasignar' : 'Asignar'}
                </Button>
                <Button variant="outlined" onClick={handleClose}>Cerrar</Button>
            </Box>
        </Box>
    );
}


const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    width: 400,
    transform: 'translate(-50%, -50%)',
    bgcolor: '#fff',
    p: 4,
    boxShadow: 24,
    borderRadius: 2
};
