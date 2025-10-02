import React, { useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { apiGet, apiPostForm, apiDelete } from '../../../functions/api';
import { waitAlert, printResponseErrorAlert } from '../../../functions/alert';
import { Button, Stack } from '@mui/material';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';

// IMPORTA AQUÍ tus componentes modales:
import Editar from './Modales/Editar';
import Adjuntos from './Adjuntos/Adjuntos';

const SoporteTecnicoTable = ({ access_token, userAuth }) => {
  const [data, setData] = useState([]);
  const [registro, setRegistro] = useState(null);
  const [showVerModal, setShowVerModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showAdjuntosModal, setShowAdjuntosModal] = useState(false);

  useEffect(() => {
    fetchMantenimiento();
  }, []);

  const fetchMantenimiento = async () => {
    waitAlert();
    try {
      const res = await apiGet('computo', access_token);
      setData(res.data.computo ?? []);
    } catch (error) {
      printResponseErrorAlert(error);
    }
  };

  const handleAprobar = (item) => {
    Swal.fire({
      title: '¿Autorizar soporte?',
      text: `Monto: $${item.costo}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, autorizar',
    }).then((result) => {
      if (result.isConfirmed) {
        apiPostForm(`computo/autorizar/${item.id}`, {}, access_token)
          .then(() => {
            Swal.fire('Autorizado', 'El ticket fue aprobado.', 'success');
            fetchMantenimiento();
          })
          .catch(() => {
            Swal.fire('Error', 'No se pudo aprobar.', 'error');
          });
      }
    });
  };

  const handleEliminar = (item) => {
    Swal.fire({
      title: '¿Eliminar soporte?',
      text: `Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        apiDelete(`computo/${item.id}`, access_token)
          .then(() => {
            Swal.fire('Eliminado', 'El ticket fue eliminado.', 'success');
            fetchMantenimiento();
          })
          .catch(() => {
            Swal.fire('Error', 'No se pudo eliminar.', 'error');
          });
      }
    });
  };

  const columns = [
    {
      accessorKey: 'acciones',
      header: 'Acciones',
      Cell: ({ row }) => {
        const item = row.original;

        return (
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" onClick={() => { setRegistro(item); setShowVerModal(true); }}>Ver</Button>
            <Button size="small" variant="outlined" onClick={() => {
              if (item.estatus === 1 || item.estatus === "1") {
                Swal.fire('No permitido', 'Ya está aprobado.', 'error');
              } else {
                setRegistro(item);
                setShowEditarModal(true);
              }
            }}>Editar</Button>
            <Button size="small" variant="outlined" onClick={() => { setRegistro(item); setShowAdjuntosModal(true); }}>Adjuntos</Button>
            <Button size="small" variant="outlined" color="success" onClick={() => {
              if (userAuth?.user?.tipo?.id === 1) {
                if (item.estatus === 1 || item.estatus === "1") {
                  Swal.fire('No permitido', 'Ya está aprobado.', 'error');
                } else {
                  handleAprobar(item);
                }
              } else {
                Swal.fire('Sin permisos', 'No tienes permisos para aprobar.', 'error');
              }
            }}>Aprobar</Button>
            <Button size="small" variant="outlined" color="error" onClick={() => {
              if (userAuth?.user?.tipo?.id === 1) {
                handleEliminar(item);
              } else {
                Swal.fire('Sin permisos', 'No tienes permisos para eliminar.', 'error');
              }
            }}>Eliminar</Button>
          </Stack>
        );
      },
    },
    {
      accessorKey: 'equipo',
      header: 'Equipo',
    },
    {
      accessorKey: 'marca',
      header: 'Marca',
    },
    {
      accessorKey: 'fecha',
      header: 'F. Solicitud',
    },
    {
      accessorKey: 'fecha_mantenimiento',
      header: 'F. Servicio',
    },
    {
      accessorKey: 'costo',
      header: 'Monto Autorizado',
      Cell: ({ cell }) => `$${cell.getValue()}`,
    },
    {
      accessorKey: 'estatus',
      header: 'Autorización',
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return (
          <span
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              background: value === 1 || value === "1" ? '#6cbd7d' : '#f9c74f',
              color: '#fff',
            }}
          >
            {value === 1 || value === "1" ? 'APROBADO' : 'PENDIENTE'}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableColumnOrdering
        enablePagination
        enableStickyHeader
        muiTableContainerProps={{ sx: { maxHeight: '630px' } }}
      />

      {/* Ver */}
      <Modal show={showVerModal} onHide={() => setShowVerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Soporte</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {registro && (
            <div>
              <p><strong>Equipo:</strong> {registro.equipo}</p>
              <p><strong>Marca:</strong> {registro.marca}</p>
              <p><strong>Descripción:</strong> {registro.descripcion}</p>
              <p><strong>Fecha Solicitud:</strong> {registro.fecha}</p>
              <p><strong>Fecha Mantenimiento:</strong> {registro.fecha_mantenimiento}</p>
              <p><strong>Costo:</strong> ${registro.costo}</p>
              <p><strong>Estatus:</strong> {registro.estatus === 1 || registro.estatus === "1" ? 'APROBADO' : 'PENDIENTE'}</p>
              {registro.usuario && (
                <p><strong>Usuario:</strong> {registro.usuario.name} ({registro.usuario.email})</p>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Editar */}
      {registro && (
        <Modal size="lg" show={showEditarModal} onHide={() => setShowEditarModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Soporte</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Editar data={registro} handleClose={() => { setShowEditarModal(false); fetchMantenimiento(); }} />
          </Modal.Body>
        </Modal>
      )}

      {/* Adjuntos */}
      {registro && (
        <Modal size="lg" show={showAdjuntosModal} onHide={() => setShowAdjuntosModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Adjuntos</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Adjuntos data={registro} handleClose={() => setShowAdjuntosModal(false)} />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default SoporteTecnicoTable;
