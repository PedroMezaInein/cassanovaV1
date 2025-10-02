import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { apiPostForm } from '../../../functions/api';
import { doneAlert, printResponseErrorAlert } from '../../../functions/alert';

const BASE = 'v1/proyectos/bodegas/prestamos';

export default function PrestamoAcciones({ prestamo, onRefresh }) {
  const auth = useSelector(state => state.authUser);
  const access_token = auth?.access_token;

  const [openDevolucion, setOpenDevolucion] = useState(false);
  const [openConsumo, setOpenConsumo] = useState(false);
  const [cant, setCant] = useState('');
  const [coment, setComent] = useState('');

  const { cantidad = 0, devuelto = 0, consumido = 0 } = prestamo || {};
  const pendiente = useMemo(
    () => Math.max(0, Number(cantidad) - (Number(devuelto) + Number(consumido))),
    [cantidad, devuelto, consumido]
  );

  const limpiar = () => { setCant(''); setComent(''); };

  const registrarDevolucion = async () => {
    try {
      const n = Number(cant);
      if (!n || n <= 0 || n > pendiente)
        return printResponseErrorAlert({ message: `Cantidad inválida. Pendiente: ${pendiente}` });

      await apiPostForm(`${BASE}/${prestamo.id}/devolver`,
        { cantidad: n, comentarios: coment },
        access_token
      );

      doneAlert('Devolución registrada');
      setOpenDevolucion(false);
      limpiar();
      onRefresh?.();
    } catch (e) { printResponseErrorAlert(e); }
  };

  const registrarConsumo = async () => {
    try {
      const n = Number(cant);
      if (!n || n <= 0 || n > pendiente)
        return printResponseErrorAlert({ message: `Cantidad inválida. Pendiente: ${pendiente}` });

      await apiPostForm(`${BASE}/${prestamo.id}/consumir`,
        { cantidad: n, comentarios: coment },
        access_token
      );

      doneAlert('Consumo registrado');
      setOpenConsumo(false);
      limpiar();
      onRefresh?.();
    } catch (e) { printResponseErrorAlert(e); }
  };


  
  return (
    <>
      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mt={1}>
        <Chip label={`Prestado: ${cantidad}`} size="small" />
        <Chip label={`Devuelto: ${devuelto}`} size="small" color="success" />
        <Chip label={`Consumido: ${consumido}`} size="small" color="primary" />
        <Chip label={`Pendiente: ${pendiente}`} size="small" color={pendiente > 0 ? 'warning' : 'default'} />

        <Box ml="auto" display="flex" gap={1}>
          <Button
            variant="outlined" color="success" size="small"
            disabled={pendiente <= 0}
            onClick={() => setOpenDevolucion(true)}
          >
            Registrar devolución
          </Button>
          <Button
            variant="outlined" color="secondary" size="small"
            disabled={pendiente <= 0}
            onClick={() => setOpenConsumo(true)}
          >
            Registrar consumo
          </Button>
        </Box>
      </Box>

      {/* Modal Devolución */}
      <Dialog open={openDevolucion} onClose={() => setOpenDevolucion(false)} fullWidth maxWidth="sm">
        <DialogTitle>Registrar devolución</DialogTitle>
        <DialogContent>
          <TextField
            label="Cantidad a devolver"
            type="number"
            fullWidth
            inputProps={{ min: 0, step: 'any', max: pendiente }}
            value={cant}
            onChange={e => setCant(e.target.value)}
            helperText={`Pendiente: ${pendiente}`}
            sx={{ mt: 1 }}
          />
          <TextField
            label="Comentarios"
            multiline rows={3} fullWidth
            value={coment}
            onChange={e => setComent(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDevolucion(false)}>Cancelar</Button>
          <Button variant="contained" onClick={registrarDevolucion}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Consumo */}
      <Dialog open={openConsumo} onClose={() => setOpenConsumo(false)} fullWidth maxWidth="sm">
        <DialogTitle>Registrar consumo en obra</DialogTitle>
        <DialogContent>
          <TextField
            label="Cantidad a consumir"
            type="number"
            fullWidth
            inputProps={{ min: 0, step: 'any', max: pendiente }}
            value={cant}
            onChange={e => setCant(e.target.value)}
            helperText={`Pendiente: ${pendiente}`}
            sx={{ mt: 1 }}
          />
          <TextField
            label="Comentarios"
            multiline rows={3} fullWidth
            value={coment}
            onChange={e => setComent(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConsumo(false)}>Cancelar</Button>
          <Button variant="contained" onClick={registrarConsumo}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
