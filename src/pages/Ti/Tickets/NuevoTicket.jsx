import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { apiPostForm } from './../../../functions/api';

import Swal from 'sweetalert2';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale';

import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Button
} from '@mui/material';

import Grid from '@mui/material/Grid';

export default function NuevoTicket(props) {
  const { handleClose, reload } = props;
  const user = useSelector(state => state.authUser);
  const departamento = useSelector(state => state.authUser.departamento);

  const [state, setState] = useState({
    departamento: departamento.departamentos[0].id,
    tipo: '',
    prioridad: '',
    descripcion: '',
    fecha: new Date(),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`; // ✅ guiones, no slashes
  };


  const validateForm = () => {
    return !!(state.descripcion && state.tipo && state.prioridad);
  };

  const enviar = () => {
    if (!validateForm()) {
      Swal.fire({
        title: 'Faltan campos',
        text: 'Favor de llenar todos los campos',
        icon: 'info',
        showConfirmButton: false,
        timer: 2000,
      });
      return; // ⚡ Evita seguir si falta algo
    }

    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    // ✅ Formateo de fecha con guiones
    const newForm = {
      id_departamento: state.departamento,
      tipo: String(state.tipo),
      descripcion: state.descripcion,
      prioridad: state.prioridad,
      fecha: formatDate(state.fecha),
    };

    console.log('🚀 Payload:', newForm);
    console.log('✅ Token:', user.access_token);

    apiPostForm('ti', newForm, user.access_token)
      .then(() => {
        Swal.fire({
          title: 'Nuevo ticket',
          text: 'Ticket creado correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: true,
        }).then(() => {
          if (typeof reload === 'function') reload();
          if (typeof handleClose === 'function') handleClose();
        });
      })
      .catch((err) => {
        console.error('❌ Error:', err);
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ha ocurrido un error al guardar el ticket',
        });
      });
  };


  const estiloContenedor = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginTop: '1rem',
    marginBottom: '1rem',
  };

  const estiloCampo = {
    flex: 1,
    minWidth: '200px',
  };

  const menuProps = {
    PaperProps: {
      sx: {
        '& .MuiMenuItem-root': {
          display: 'block',
          whiteSpace: 'normal',
        },
      },
    },
  };

  return (
    <>


      {/* SOLICITANTE + FECHA */}
      <div style={estiloContenedor}>
        <div style={estiloCampo}>
          <TextField
            label="Solicitante"
            type="text"
            value={departamento?.departamentos?.[0]?.nombre || ''}
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            disabled
          />
        </div>

        <div style={estiloCampo}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
            <KeyboardDatePicker
              label="Fecha"
              format="dd/MM/yyyy"
              name="fecha"
              value={state.fecha}
              placeholder="dd/mm/yyyy"
              fullWidth
              InputLabelProps={{ shrink: true }}
              KeyboardButtonProps={{ 'aria-label': 'change date' }}
              disabled
            />
          </MuiPickersUtilsProvider>
        </div>
      </div>

      {/* TIPO DE TICKET + PRIORIDAD */}
      <div style={estiloContenedor}>
        <div style={estiloCampo}>
          <InputLabel id="tipo-label">TIPO DE TICKET</InputLabel>
          <Select
            labelId="tipo-label"
            name="tipo"
            value={state.tipo}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            MenuProps={menuProps}
          >
            <MenuItem value="" disabled>Selecciona tipo</MenuItem>
            <MenuItem value={4}>🖥️ Problemas con computadora</MenuItem>
            <MenuItem value={1}>🎓 Capacitación o ayuda técnica</MenuItem>
            <MenuItem value={2}>⚙️ Problemas con la plataforma</MenuItem>
            <MenuItem value={3}>🚀 Nuevo proyecto o desarrollo</MenuItem>
            <MenuItem value={5}>⚠️ Otro...</MenuItem>
          </Select>
        </div>

        <div style={estiloCampo}>
          <InputLabel id="prioridad-label">PRIORIDAD</InputLabel>
          <Select
            labelId="prioridad-label"
            name="prioridad"
            value={state.prioridad}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            MenuProps={menuProps}
          >
            <MenuItem value="" disabled>Selecciona prioridad</MenuItem>
            <MenuItem value="alta">🔴 Alta</MenuItem>
            <MenuItem value="media">🟡 Media</MenuItem>
            <MenuItem value="baja">🟢 Baja</MenuItem>
          </Select>
        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <div style={{ width: '100%', marginTop: '1rem' }}>
        <TextField
          label="Descripción"
          onChange={handleChange}
          name="descripcion"
          value={state.descripcion}
          InputLabelProps={{ shrink: true }}
          multiline
          maxRows={10}
          fullWidth
          size="medium"
          variant="outlined"
        />
      </div>

      {/* BOTÓN */}
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button
          variant="contained"
          style={{
            backgroundColor: '#FFD700',
            color: '#000',
            fontWeight: 'bold',
            borderRadius: '20px',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
          }}
          onClick={enviar}
        >
          AGREGAR
        </Button>
      </div>
    </>
  );
}
