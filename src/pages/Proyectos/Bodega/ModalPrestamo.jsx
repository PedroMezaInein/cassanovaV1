import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  TextField
} from '@mui/material';

export default function ModalPrestamo({
  open,
  onClose,
  bodega,
  showForm,
  mostrarFormulario,
  formPrestamos,
  options,
  onChangePrestamo,
  onSubmitPrestamo,
  formDevoluciones,
  onChangeDevoluciones,
  onSubmitDevolucion,
  deletePrestamoAxios,
  deleteDevolucionAxios,
  tipo
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        {bodega ? (
          <Typography variant="h6">
            Préstamo de <span style={{ color: '#1976d2' }}>{bodega.nombre}</span>
          </Typography>
        ) : (
          'Préstamo'
        )}
      </DialogTitle>

      <DialogContent>
        {bodega?.prestamos?.length > 0 && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            my={3}
          >
            <Box
              display="flex"
              alignItems="center"
              bgcolor="#e8f5e9"
              px={2}
              py={1}
              borderRadius={2}
            >
              <img
                src="/images/svg/Clipboard-check.svg"
                alt="Disponible"
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
              <Typography variant="body2" fontWeight="bold" mr={1}>
                DISPONIBLES:
              </Typography>
              <Typography
                variant="body1"
                color="success.main"
                fontWeight="bold"
              >
                {bodega.cantidad}
              </Typography>
            </Box>

            {bodega.cantidad > 0 && (
              <Button variant="outlined" onClick={mostrarFormulario}>
                AGREGAR PRÉSTAMO
              </Button>
            )}
          </Box>
        )}

        {showForm && (
          <Box component="form" onSubmit={onSubmitPrestamo} mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Responsable"
                  value={formPrestamos.responsable || ''}
                  onChange={(e) => onChangePrestamo('responsable', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cantidad"
                  type="number"
                  value={formPrestamos.cantidad || ''}
                  onChange={(e) => onChangePrestamo('cantidad', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Comentario"
                  value={formPrestamos.comentario || ''}
                  onChange={(e) => onChangePrestamo('comentario', e.target.value)}
                />
              </Grid>
            </Grid>
            <Box textAlign="right" mt={2}>
              <Button type="submit" variant="contained">Guardar préstamo</Button>
            </Box>
          </Box>
        )}

        {bodega && (
          <Box mt={4}>
            <Typography variant="subtitle1" gutterBottom>
              Historial de préstamos y devoluciones
            </Typography>
            {/* Aquí puedes renderizar bodega.prestamos y bodega.devoluciones si quieres */}
            <pre>{JSON.stringify(bodega.prestamos, null, 2)}</pre>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
