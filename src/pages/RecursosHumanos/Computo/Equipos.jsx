
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,

} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';

import { apiGet, apiPutForm, apiDelete } from '../../../functions/api';
import Layout from '../../../components/layout/layout';

import AsignarEquipo from './Modales/AsignarEquipo';
import EditarEquipo from './Modales/EditarEquipo';
import AgregarEquipo from './Modales/AgregarEquipo';
import VerHistorial from './Modales/VerHistorial';
import EstatusEquipo from './Modales/EstatusEquipo';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReplayIcon from '@mui/icons-material/Replay';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import TuneIcon from '@mui/icons-material/Tune';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function Equipos() {
  const auth = useSelector(state => state.authUser.access_token);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [inventarioOriginal, setInventarioOriginal] = useState([]);
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filterMode, setFilterMode] = useState('all');
  const [filters, setFilters] = useState({
    marca: '',
    equipo: '',
    modelo: '',
    serie: '',
    descripcion: '',
    disponible: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const [modal, setModal] = useState({
    asignar: { show: false, data: null },
    editar: { show: false, data: null },
    agregar: { show: false, data: null },
    historial: { show: false, data: null },
    reasignar: { show: false, data: null },
    estatus: { show: false, data: null },
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const open = Boolean(anchorEl);

  const prop = { pathname: '/rh/equipos-computo' };

  const exportToExcel = (data) => {
    const rows = [];
    data.forEach(grupo => {
      const length = grupo.marcas.length;
      for (let i = 0; i < length; i++) {
        const raw = grupo.raws[i]; // Aquí viene la info completa del backend
        rows.push({
          Asignado: grupo.asignado,
          Disponibilidad: grupo.disponible,
          Marca: grupo.marcas[i],
          Equipo: grupo.equipos[i],
          Modelo: grupo.modelos[i],
          Serie: grupo.series[i],
          Descripción: grupo.descripciones[i],
          Estatus: grupo.estatus[i] || 'N/A',
          'Fecha de compra': raw?.fecha_compra?.slice(0, 10) || 'N/A',
          'Fecha de garantía': raw?.fecha_garantia?.slice(0, 10) || 'N/A',

        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipos');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'equipos.xlsx');
  };


  const processData = (inventario, mode = 'all', filters = {}) => {
    const grouped = {};
    const individualesDisponibles = [];
    const individualesNoDisponibles = [];
    const estatusNoDisponible = ['vendido', 'dañado', 'reparación', 'robado'];

    inventario.forEach(item => {
      const estatusEsNoDisponible = estatusNoDisponible.includes((item.estatus || '').toLowerCase());
      const disponibleReal = item.disponible && !estatusEsNoDisponible ? 'Disponible' : 'No disponible';

      const empleado = item.asigna?.empleado;
      if (empleado) {
        if (mode === 'noAsignados') return;
        const key = `${empleado.id}`;
        if (!grouped[key]) {
          grouped[key] = {
            asignado: `${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno}`,
            disponible: disponibleReal,
            marcas: [],
            equipos: [],
            modelos: [],
            series: [],
            descripciones: [],
            estatus: [],
            raws: [],
            estatusReal: item.estatus || null,
          };
        }
        grouped[key].marcas.push(item.nombre || 'N/A');
        grouped[key].equipos.push(item.tipo || 'N/A');
        grouped[key].modelos.push(item.modelo || 'N/A');
        grouped[key].series.push(item.serie || 'N/A');
        grouped[key].descripciones.push(item.descripcion || 'N/A');
        grouped[key].estatus.push(item.estatus || 'N/A');
        grouped[key].raws.push(item);

        if (grouped[key].disponible !== 'No disponible' && disponibleReal === 'No disponible') {
          grouped[key].disponible = 'No disponible';
        }
        if (!grouped[key].estatusReal && item.estatus) grouped[key].estatusReal = item.estatus;

      } else {
        if (filters.marca && !item.nombre?.toLowerCase().includes(filters.marca.toLowerCase())) return;
        if (filters.equipo && !item.tipo?.toLowerCase().includes(filters.equipo.toLowerCase())) return;
        if (filters.modelo && !item.modelo?.toLowerCase().includes(filters.modelo.toLowerCase())) return;
        if (filters.serie && !item.serie?.toLowerCase().includes(filters.serie.toLowerCase())) return;
        if (filters.descripcion && !item.descripcion?.toLowerCase().includes(filters.descripcion.toLowerCase())) return;
        if (filters.estatus && item.estatus !== filters.estatus) return;

        const obj = {
          asignado: 'N/A',
          disponible: disponibleReal,
          marcas: [item.nombre || 'N/A'],
          equipos: [item.tipo || 'N/A'],
          modelos: [item.modelo || 'N/A'],
          series: [item.serie || 'N/A'],
          descripciones: [item.descripcion || 'N/A'],
          estatus: [item.estatus || 'N/A'],
          raws: [item],
        };

        if (disponibleReal === 'Disponible') individualesDisponibles.push(obj);
        else individualesNoDisponibles.push(obj);
      }
    });

    const gruposFiltrados = Object.values(grouped).map(grupo => {
      const indices = grupo.raws.map((item, idx) => {
        if (filters.marca && !item.nombre?.toLowerCase().includes(filters.marca.toLowerCase())) return null;
        if (filters.equipo && !item.tipo?.toLowerCase().includes(filters.equipo.toLowerCase())) return null;
        if (filters.modelo && !item.modelo?.toLowerCase().includes(filters.modelo.toLowerCase())) return null;
        if (filters.serie && !item.serie?.toLowerCase().includes(filters.serie.toLowerCase())) return null;
        if (filters.descripcion && !item.descripcion?.toLowerCase().includes(filters.descripcion.toLowerCase())) return null;
        if (filters.estatus && item.estatus !== filters.estatus) return null;
        return idx;
      }).filter(idx => idx !== null);

      if (indices.length === 0) return null;

      return {
        ...grupo,
        marcas: indices.map(i => grupo.marcas[i]),
        equipos: indices.map(i => grupo.equipos[i]),
        modelos: indices.map(i => grupo.modelos[i]),
        series: indices.map(i => grupo.series[i]),
        descripciones: indices.map(i => grupo.descripciones[i]),
        estatus: indices.map(i => grupo.estatus[i]),
        raws: indices.map(i => grupo.raws[i]),
        estatusReal: indices.length > 0 ? grupo.raws[indices[0]].estatus || null : null,
      };
    }).filter(Boolean);

    return [...individualesDisponibles, ...gruposFiltrados, ...individualesNoDisponibles];
  };

  const fetchEquipos = async () => {
    setIsLoading(true);
    try {
      const res = await apiGet('equipos/equipos', auth);
      const inventarioOrdenado = res.data.inventario.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setInventarioOriginal(inventarioOrdenado);
      setUsers(res.data.usuarios);
    } catch (error) {
      console.error('Error al cargar inventario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchEquipos(); }, []);
  useEffect(() => {
    setData(processData(inventarioOriginal, 'filtered', filters));
  }, [inventarioOriginal, filters]);

  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    const allEmpty = Object.values(updatedFilters).every(v => !v);

    if (allEmpty) {
      setFilterMode('all');
    } else {
      setFilterMode('filtered');  // ⬅️ Usa un valor que identifique cuando se están aplicando filtros
    }

    setFilters(updatedFilters);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };


  const handleOpenModal = (tipo, item = null) => setModal(prev => ({ ...prev, [tipo]: { show: true, data: item } }));
  const handleCloseModal = (tipo) => setModal(prev => ({ ...prev, [tipo]: { show: false, data: null } }));
  const handleMenuOpen = (event, row) => { setAnchorEl(event.currentTarget); setSelectedRow(row); };
  const handleMenuClose = () => { setAnchorEl(null); setSelectedRow(null); };

  const handleUnassignEquipo = async (equipo) => {
    try {
      await apiPutForm(`equipos/desasignar/${equipo.id}`, { equipo: equipo.id }, auth);
      Swal.fire({ icon: 'success', title: 'Equipo desasignado', showConfirmButton: false, timer: 1500 });
      fetchEquipos();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al desasignar', '', 'error');
    }
  };

  const handleDeleteEquipo = async (equipo) => {
    if (equipo && !equipo.disponible) {
      Swal.fire('No puedes eliminar este equipo', 'Primero desasigna el equipo antes de eliminarlo.', 'warning');
      return;
    }
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción eliminará el equipo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiDelete(`equipos/${equipo.id}`, auth);
          Swal.fire({ icon: 'success', title: 'Equipo eliminado', showConfirmButton: false, timer: 1500 });
          fetchEquipos();
        } catch (error) {
          console.error(error);
          Swal.fire('Error al eliminar', '', 'error');
        }
      }
    });
  };
  const handleOpenHistorial = (item) => {
    // Buscamos el equipo actualizado en el inventario original
    const actualizado = inventarioOriginal.find(e => e.id === item.id);
    // Abrimos el modal con el equipo actualizado (o el viejo si no lo encuentra)
    handleOpenModal('historial', actualizado || item);
  };

  return (
    <Layout authUser={auth} location={prop} history={{ location: prop }} active="rh">
      <MaterialReactTable
        columns={[
          { accessorKey: 'asignado', header: 'Asignado' },
          {
            accessorKey: 'disponible',
            header: 'Disponibilidad',
            Cell: ({ cell }) => {
              const estatus = cell.getValue();
              const color = estatus === 'Disponible' ? 'green' : 'red';
              return <span style={{ color, fontWeight: 'bold' }}>{estatus}</span>;
            },
          },
          {
            id: 'detalles',
            header: showFilters && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', gap: '4px' }}>
                  <div style={{ width: 70, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setFilters({ marca: '', equipo: '', modelo: '', serie: '', descripcion: '', disponible: '', estatus: '' });
                        setFilterMode('all');
                        setPagination({ pageIndex: 0, pageSize: 10 });
                        fetchEquipos();
                        setShowFilters(false);
                      }}
                    >
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </div>
                  <div style={{ flex: 1 }}>
                    <TextField placeholder="Marca" size="small" fullWidth value={filters.marca} onChange={e => handleFilterChange('marca', e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <TextField placeholder="Equipo" size="small" fullWidth value={filters.equipo} onChange={e => handleFilterChange('equipo', e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <TextField placeholder="Modelo" size="small" fullWidth value={filters.modelo} onChange={e => handleFilterChange('modelo', e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <TextField placeholder="Serie" size="small" fullWidth value={filters.serie} onChange={e => handleFilterChange('serie', e.target.value)} />
                  </div>
                  <div style={{ flex: 2 }}>
                    <TextField placeholder="Descripción" size="small" fullWidth value={filters.descripcion} onChange={e => handleFilterChange('descripcion', e.target.value)} />
                  </div>
                 
                  <div style={{ flex: 1 }}>
                    <TextField placeholder="Estatus" size="small" fullWidth value={filters.estatus} onChange={e => handleFilterChange('estatus', e.target.value)} />
                  </div>
                </div>
              </div>

            ),
            Cell: ({ row }) => {
              const { marcas = [], equipos = [], modelos = [], series = [], descripciones = [], raws = [], estatus = [] } = row.original;
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', fontWeight: 'bold', borderBottom: '2px solid #000', marginBottom: '4px' }}>
                    <div style={{ width: '70px', textAlign: 'center' }}>Acciones</div>
                    <div style={{ width: '120px', textAlign: 'center' }}>Equipo</div>
                    <div style={{ width: '120px', textAlign: 'center' }}>Marca</div>
                    
                    <div style={{ width: '120px', textAlign: 'center' }}>Modelo</div>
                    <div style={{ width: '120px', textAlign: 'center' }}>Serie</div>
                    <div style={{ flex: 1, textAlign: 'center' }}>Descripción</div>
                    <div style={{ width: '100px', textAlign: 'center' }}>Estatus</div>
                  </div>
                  {marcas.map((_, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd', padding: '2px 0' }}>
                      <div style={{ width: '70px', textAlign: 'center' }}>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, raws[idx])}>
                          <TouchAppIcon fontSize="small" style={{ color: '#1976d2' }} />
                        </IconButton>
                      </div>
                      <div style={{ width: '120px', textAlign: 'center' }}>{equipos[idx]}</div>
                      <div style={{ width: '120px', textAlign: 'center' }}>{marcas[idx]}</div>
                      
                      <div style={{ width: '120px', textAlign: 'center' }}>{modelos[idx]}</div>
                      <div style={{ width: '120px', textAlign: 'center' }}>{series[idx]}</div>
                      <div style={{ flex: 1, textAlign: 'center', whiteSpace: 'pre-line' }}>{descripciones[idx]}</div>
                      <div style={{ width: '100px', textAlign: 'center', flexShrink: 0 }}>
                        {estatus[idx]
                          ? <span style={{ fontSize: '12px' }}>{estatus[idx]}</span>
                          : <span style={{ color: '#bbb' }}>N/A</span>}
                      </div>

                    </div>
                  ))}
                </div>
              );
            },

          },
        ]}
        data={data}
        state={{ isLoading, pagination, showColumnFilters: showFilters, }}
        onPaginationChange={setPagination}
        onShowColumnFiltersChange={setShowFilters}
        enableColumnOrdering
        enableRowActions={false}
        initialState={{ pagination: { pageSize: 10 } }}
        muiTablePaginationProps={{
          rowsPerPageOptions: [10, 20, 50],
          labelRowsPerPage: 'Equipos por página',
        }}
        enableGlobalFilter={false}


        renderTopToolbarCustomActions={() => (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <IconButton onClick={() => {
              fetchEquipos();
              setPagination({ pageIndex: 0, pageSize: 10 });
            }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
            <Button variant="contained" onClick={() => handleOpenModal('agregar')}>Nuevo equipo</Button>
            <Button variant="outlined" onClick={() => exportToExcel(data)}>Exportar a Excel</Button>
          </div>
        )}
      />

      {/* Modales y Menú */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} onClick={handleMenuClose}>
        <MenuItem onClick={() => handleOpenModal('editar', selectedRow)}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { if (selectedRow?.disponible) handleOpenModal('asignar', selectedRow); else Swal.fire('Ya está asignado', '', 'info'); }}>
          <ListItemIcon><AssignmentIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Asignar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleOpenModal('estatus', selectedRow)}>
          <ListItemIcon><TuneIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Estatus</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => { if (!selectedRow?.disponible) handleOpenModal('reasignar', selectedRow); else Swal.fire('Primero asigna el equipo', '', 'info'); }}>
          <ListItemIcon><ReplayIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Reasignar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleOpenHistorial(selectedRow)}>
          <ListItemIcon><HistoryIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Historial</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => {
          if (!selectedRow?.disponible) {
            Swal.fire({
              title: '¿Estás seguro?',
              text: "Esto desasignará el equipo",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sí, desasignar',
              cancelButtonText: 'Cancelar',
            }).then((result) => {
              if (result.isConfirmed) handleUnassignEquipo(selectedRow);
            });
          } else {
            Swal.fire('Este equipo no está asignado', '', 'info');
          }
        }}>
          <ListItemIcon><ReplayIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Desasignar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteEquipo(selectedRow)}>
          <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>

      </Menu>

      <AsignarEquipo data={modal.asignar.data} show={modal.asignar.show} handleClose={() => handleCloseModal('asignar')} reload={fetchEquipos} users={users} mode="asignar" />
      <AsignarEquipo data={modal.reasignar.data} show={modal.reasignar.show} handleClose={() => handleCloseModal('reasignar')} reload={fetchEquipos} users={users} mode="reasignar" />
      <EditarEquipo
        data={modal.editar.data}
        show={modal.editar.show}
        handleClose={() => handleCloseModal('editar')}
        reload={(equipoActualizado) => {
          setInventarioOriginal(prev => prev.map(e => e.id === equipoActualizado.id ? equipoActualizado : e));
          setData(processData([...inventarioOriginal]));
        }}
      />
      <AgregarEquipo
        show={modal.agregar.show}
        handleClose={() => handleCloseModal('agregar')}
        reload={() => {
          fetchEquipos();                 // ✅ Recarga la data
          setPagination({ pageIndex: 0, pageSize: 10 }); // ✅ Resetea a la primera página
        }}
      />





      <VerHistorial data={modal.historial.data} show={modal.historial.show} handleClose={() => handleCloseModal('historial')} />
      <EstatusEquipo data={modal.estatus.data} show={modal.estatus.show} handleClose={() => handleCloseModal('estatus')} reload={fetchEquipos} />
    </Layout>
  );
}
