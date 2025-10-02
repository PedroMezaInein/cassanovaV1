import React, { useState, useEffect } from 'react';
import { Button, Box, TextField, Modal, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { apiPostForm } from '../../../../functions/api';

export default function AgregarEquipo({ show, handleClose, onSave, reload}) {
  const auth = useSelector(state => state.authUser.access_token);

  const [form, setForm] = useState({
    nombre: '',
    modelo: '',
    tipo: '',
    serie: '',
    descripcion: '',
    fecha_compra: '',
    fecha_garantia: '',
  });

  useEffect(() => {
    if (show) {
      setForm({
        nombre: '',
        modelo: '',
        tipo: '',
        serie: '',
        descripcion: '',
        fecha_compra: '',
        fecha_garantia: '',
      });
    }
  }, [show]);

  const handleSave = async () => {
    try {
      const res = await apiPostForm(`equipos/agregar`, form, auth);
      const nuevo = {
        ...res.data.inventario,
        fecha_compra: form.fecha_compra,
        fecha_garantia: form.fecha_garantia,
      };

      await apiPostForm(`equipos/historial`, {
        equipo_id: nuevo.id,
        accion: 'Alta de equipo',
        detalle: `Fecha de compra: ${form.fecha_compra || 'N/A'}, Fecha de garantía: ${form.fecha_garantia || 'N/A'}`,
      }, auth);

      Swal.fire({
        icon: 'success',
        title: 'Equipo agregado',
        showConfirmButton: false,
        timer: 1500
      });

      if (onSave) onSave(nuevo);
      handleClose();     // 👈 Primero cierras el modal
      if (reload) reload();  // 👈 Luego recargas los datos


    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar', '', 'error');
    }
  };

  return (
    <Modal open={show} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>Agregar Equipo</Typography>

        <TextField label="Marca" fullWidth margin="normal"
          value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
        />
        <TextField label="Modelo" fullWidth margin="normal"
          value={form.modelo} onChange={e => setForm({ ...form, modelo: e.target.value })}
        />
        <TextField label="Tipo" fullWidth margin="normal"
          value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}
        />
        <TextField label="Serie" fullWidth margin="normal"
          value={form.serie} onChange={e => setForm({ ...form, serie: e.target.value })}
        />
        <TextField label="Descripción" fullWidth margin="normal"
          value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
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
