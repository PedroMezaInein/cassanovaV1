import React, { useState, useEffect } from 'react';
import { Button, Box, TextField, Modal, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { apiPutForm } from '../../../../functions/api'; // ✅ usa apiPut para PUT

export default function EditarEquipo({ data, show, handleClose, reload }) {
  const auth = useSelector(state => state.authUser.access_token);

  const [form, setForm] = useState({
    id: '',
    nombre: '',
    modelo: '',
    tipo: '',
    serie: '',
    descripcion: '',
    fecha_compra: '',
    fecha_garantia: '',
    disponible: 1,
    estatus: '',
  });

  useEffect(() => {
    if (data) {
      setForm({
        id: data.id || '',
        nombre: data.nombre || '',
        modelo: data.modelo || '',
        tipo: data.tipo || '',
        serie: data.serie || '',
        descripcion: data.descripcion || '',
        fecha_compra: data.fecha_compra || '',      
        fecha_garantia: data.fecha_garantia || '',  
        disponible: data.disponible ?? 1,   
        estatus: data.estatus || '',
      });
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await apiPutForm(`equipos/${form.id}`, form, auth);
      Swal.fire({
        icon: 'success',
        title: 'Equipo editado',
        showConfirmButton: false,
        timer: 1500,
      });

      if (reload) reload({ ...form });  // Aquí envías el equipo editado al padre
      handleClose();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar', '', 'error');
    }
  };


  return (
    <Modal open={show} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>Editar Equipo</Typography>

        <TextField
          label="Marca"
          fullWidth
          margin="normal"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
        />
        <TextField
          label="Modelo"
          fullWidth
          margin="normal"
          value={form.modelo}
          onChange={e => setForm({ ...form, modelo: e.target.value })}
        />
        <TextField
          label="Tipo"
          fullWidth
          margin="normal"
          value={form.tipo}
          onChange={e => setForm({ ...form, tipo: e.target.value })}
        />
        <TextField
          label="Serie"
          fullWidth
          margin="normal"
          value={form.serie}
          onChange={e => setForm({ ...form, serie: e.target.value })}
        />
        <TextField
          label="Descripción"
          fullWidth
          margin="normal"
          value={form.descripcion}
          onChange={e => setForm({ ...form, descripcion: e.target.value })}
        />

        <TextField
          label="Fecha de compra"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={form.fecha_compra}
          onChange={e => setForm({ ...form, fecha_compra: e.target.value })}
        />
        <TextField
          label="Fecha de garantía"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={form.fecha_garantia}
          onChange={e => setForm({ ...form, fecha_garantia: e.target.value })}
        />

        <Box mt={2} display="flex" gap={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={handleClose}>Cerrar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </Box>
      </Box>
    </Modal>
  );
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: 400,
  transform: 'translate(-50%, -50%)',
  bgcolor: '#fff',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};
