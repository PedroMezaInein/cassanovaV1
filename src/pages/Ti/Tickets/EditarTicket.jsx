import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { apiPutForm } from './../../../functions/api';
import Swal from 'sweetalert2';

import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default function EditarTicketTi(props) {
  const { data, handleClose, reload } = props;
  const user = useSelector(state => state.authUser);
  const departamento = useSelector(state => state.authUser.departamento);

  // Estado completo con TODOS los campos que espera el backend
  const [state, setState] = useState({
    tipo: data.tipo ?? '',
    descripcion: data.descripcion ?? '',
    fecha_entrega: data.fecha_entrega ?? '',
    estatus: data.estatus ?? 1,
    prioridad: data.prioridad ?? 'media',
    id_asignacion: data.id_asignacion ?? '',
    id_departamento: data.id_departamento ?? (departamento?.departamentos?.[0]?.id || ''),
    id: data.id
  });

  // Actualiza campos
  const handleChange = e => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    const newForm = {
      tipo: state.tipo,
      descripcion: state.descripcion,
      fecha_entrega: state.fecha_entrega,
      estatus: state.estatus,
      prioridad: state.prioridad,
      id_asignacion: state.id_asignacion,
      id_departamento: state.id_departamento
    };

    apiPutForm(`ti/${state.id}`, newForm, user.access_token)
      .then(() => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Ticket editado',
          text: 'Se ha editado correctamente',
          timer: 2000,
          timerProgressBar: true,
        });
        handleClose();
        if (reload) reload.reload();
      })
      .catch(() => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ha ocurrido un error al guardar',
        });
      });
  };

  return (
    <>
      <div className='nuevo_ticket'>
        <div>
          <TextField
            label="Fecha de Entrega"
            type="date"
            name="fecha_entrega"
            value={state.fecha_entrega?.slice(0, 10) || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </div>

        <div>
          <InputLabel>Tipo de ticket</InputLabel>
          <Select
            name="tipo"
            value={state.tipo}
            onChange={handleChange}
          >
            <MenuItem value="0">Mantenimiento</MenuItem>
            <MenuItem value="1">Nuevo módulo</MenuItem>
            <MenuItem value="2">Error en plataforma</MenuItem>
            <MenuItem value="4">Otro</MenuItem>
          </Select>
        </div>

        <div>
          <TextField
            label="Descripción"
            name="descripcion"
            value={state.descripcion}
            onChange={handleChange}
            multiline
            rows={3}
            InputLabelProps={{ shrink: true }}
          />
        </div>

        <div>
          <InputLabel>Estatus</InputLabel>
          <Select
            name="estatus"
            value={state.estatus}
            onChange={handleChange}
          >
            <MenuItem value={1}>Pendiente</MenuItem>
            <MenuItem value={2}>En Proceso</MenuItem>
            <MenuItem value={3}>Completado</MenuItem>
          </Select>
        </div>

        <div>
          <InputLabel>Prioridad</InputLabel>
          <Select
            name="prioridad"
            value={state.prioridad}
            onChange={handleChange}
          >
            <MenuItem value="baja">Baja</MenuItem>
            <MenuItem value="media">Media</MenuItem>
            <MenuItem value="alta">Alta</MenuItem>
          </Select>
        </div>

        <div>
          <TextField
            label="ID Asignación"
            name="id_asignacion"
            value={state.id_asignacion}
            onChange={handleChange}
          />
        </div>

      </div>

      <div className="nuevo_ticket_boton">
        <button className='sendButton' onClick={handleSave}>Editar</button>
      </div>
    </>
  );
}
