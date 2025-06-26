import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import Layout from '../../../components/layout/layout';
import { Modal, ModalDelete } from '../../../components/singles';
import { NOMINA_ADMIN_COLUMNS, URL_DEV, ADJUNTOS_COLUMNS } from '../../../constants';
import { AdjuntosForm } from '../../../components/forms';
import { setOptions, setDateTable, setMoneyTable, setTextTableCenter, setAdjuntosList, setTextTable } from '../../../functions/setters';
import { errorAlert, waitAlert, printResponseErrorAlert, deleteAlert, doneAlert } from '../../../functions/alert';
import NewTableServerRender from '../../../components/tables/NewTableServerRender';
import { renderToString } from 'react-dom/server';
import TableForModals from '../../../components/tables/TableForModals';
import { setSingleHeader } from '../../../functions/routers';
import $ from 'jquery';


import { Box, Button, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import { emphasize, styled } from '@mui/material/styles';
import { MaterialReactTable, MRT_ActionMenuItem } from 'material-react-table';
import { Edit, Delete ,Settings, MoreVert} from '@mui/icons-material';
import AttachFile from '@mui/icons-material/AttachFile';
import { ContentCopy } from '@mui/icons-material';
import { format } from 'date-fns';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField,Grid } from '@mui/material';
import { apiGet,apiOptions, catchErrors, apiDelete, apiPostFormResponseBlob } from './../../../functions/api';

import CrearNomina from './CrearNomina'
import EditarNomina from './EditarNomina'




const NominaAdmin = () => {
    const history = useHistory();
    const location = useLocation();
    const authUser = useSelector(state => state.authUser);
    
    const [modal, setModal] = useState({ form: false, delete: false, adjuntos: false });
    const [data, setData] = useState({ adjuntos: [] });
    const [nomina, setNomina] = useState(null);
    // const [form, setForm] = useState({
    //     periodo: '',
    //     empresas: '',
    //     fechaInicio: new Date(),
    //     fechaFin: new Date(),
    //     nominasAdmin: [{ usuario: '', nominImss: '', extraImss: '', restanteNomina: '', extras: '' }],
    //     adjuntos: { adjunto: { value: '', placeholder: 'Ingresa los adjuntos', files: [] } }
    // });
    // const [options, setOptionsState] = useState({ usuarios: [], empresas: [] });
    const [adjuntos, setAdjuntos] = useState([]);

    const auth = useSelector((state) => state.authUser.access_token);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });
    const [totalRows, setTotalRows] = useState(0); // Total de registros
    const [modals, setModals] = useState({
        crearNomina: { show: false, data: null },
        editarNomina: { show: false, data: null },
        exportar: { show: false },
        adjuntos: { show: false, data: null },    
    });
    const [globalFilter, setGlobalFilter] = useState(''); // Estado para el filtro global
    const [columnFilters, setColumnFilters] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);


    // useEffect(() => {
    //     getOptionsAxios();
    // }, []);

    const StyledBreadcrumb = styled(Chip)(({ theme }) => {
        const backgroundColor =
            theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
        return {
            backgroundColor,
            height: theme.spacing(3),
            color: theme.palette.text.primary,
            fontWeight: theme.typography.fontWeightRegular,
            '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
            },
            '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
            },
        };
        }); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591
          

         const columns = [
            { accessorKey: 'id', header: 'ID', size: 80 },
            { accessorKey: 'nombre', header: 'Nombre de nomina', size: 150 },             
            { accessorKey: 'periodo', header: 'Periodo de nomina', size: 150 },             
            { accessorKey: 'inicio', header: 'Fecha inicio',size: 150 },
            { accessorKey: 'fin', header: 'Fecha fin',size: 150 },
            { accessorKey: 'nomina_imss', header: 'Nomina Imss',size: 150 },
            { accessorKey: 'extraImss', header: 'Nomina Extra Imss',size: 150 },
            { accessorKey: 'efectivo', header: 'Nomina Efectivo',size: 150 },
            { accessorKey: 'extraefectivo', header: 'Nomina ExtraEfectivo',size: 150 },
            { accessorKey: 'comision', header: 'Comision',size: 150 },
            { accessorKey: 'isr', header: 'Nomina Isr',size: 150 },
            { accessorKey: 'infonavit / rcv', header: 'Nomina Infonavit',size: 150 },
            { accessorKey: 'imss', header: 'Imss',size: 150 },
            { accessorKey: 'isn', header: 'Nomina Isn',size: 150 },
            // { accessorKey: 'rcv', header: 'Rcv',size: 150 },
            // { accessorKey: 'extra', header: 'Extras' ,size: 150, },
            { accessorKey: 'grantotal', header: 'Total', size: 150,},
            {
              accessorKey: 'adjuntos',
              header: 'Adjuntos',
              size: 200,
              Cell: ({ row }) => {
                const adjuntos = row.original.adjuntos || [];

                if (adjuntos.length === 0) {
                  return <span style={{ color: '#999' }}>Sin adjuntos</span>;
                }

                return (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      overflowX: 'auto',
                      maxWidth: 180,
                      paddingY: 0.5,
                      '&::-webkit-scrollbar': { height: 6 },
                      '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: 2 },
                    }}
                  >
                    {adjuntos.map((file, i) => (
                      <Tooltip key={i} title={file.nombre || `Adjunto ${i + 1}`}>
                        <IconButton
                          component="a"
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          sx={{
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            padding: '4px',
                            backgroundColor: '#f9f9f9',
                            '&:hover': { backgroundColor: '#e0f2f1' },
                          }}
                        >
                          📎
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Box>
                );
              },
            }



              
        ];


        const renderRowActions = ({ row }) => (
            <>
                <IconButton
                    onClick={(event) => handleOpenMenu(event, row.original)} // Pasa la fila seleccionada
                    sx={{ color: '#F96D49', fontSize: '1.5rem' }}
                >
                    <Settings />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu} sx={{ '& .MuiPaper-root': {
                        boxShadow: 'none', border: 'none',},}}>
                   <MenuItem
                        onClick={() => {
                          if (selectedRow.data.egreso === 1) {
                            Swal.fire({
                              icon: 'warning',
                              title: 'Nómina ya generada',
                              text: 'Esta nómina ya tiene un egreso vinculado y no puede ser editada.',
                              confirmButtonText: 'Entendido',
                              confirmButtonColor: '#f44336'
                            });
                          } else {
                            toggleModal('editarNomina', selectedRow);
                            handleCloseMenu();
                          }
                        }}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'primary.light',
                            color: 'white',
                          },
                        }}
                      >
                        <Edit sx={{ marginRight: '10px', color: 'primary.main' }} />
                        Editar
                      </MenuItem>

                    <MenuItem onClick={() => { deleteCompraAxios(selectedRow.id); handleCloseMenu(); }} sx={{ '&:hover': {
                        backgroundColor: '#f77c5d',color: 'white',},}} >
                        <Delete sx={{ marginRight: '10px', color: '#d65e40' }} />
                        Eliminar
                    </MenuItem>
                    {/* <MenuItem onClick={() => { toggleModal('adjuntos', selectedRow.id); handleCloseMenu(); }} sx={{ '&:hover': {
                        backgroundColor: '#E2D1BF',color: 'white',},}}>
                        <AttachFile sx={{ marginRight: '10px', color: '#c6b7a9' }} />
                        Adjuntos
                    </MenuItem> */}
                    {/* <MenuItem onClick={() => { toggleModal('facturas', selectedRow.id); handleCloseMenu(); }} sx={{ '&:hover': {
                        backgroundColor: '#E2D1BF',color: 'white',},}}>
                        <ReceiptIcon sx={{ marginRight: '10px', color: '#c6b7a9' }} />
                        Facturas
                    </MenuItem> */}
                </Menu>
            </>
        );

        const toggleModal = (modalKey, data = null) => {
            setModals((prevModals) => {
                const isOpen = prevModals[modalKey]?.show ?? false;
                return {
                    ...prevModals,
                    [modalKey]: { 
                        show: !isOpen, 
                        data: data ?? prevModals[modalKey]?.data // 🔥 Mantiene los datos si se cierra
                    },
                };
            });
        
        };

        const handleOpenMenu = (event, row) => {
            setAnchorEl(event.currentTarget); // Abre el menú en la posición del clic
            setSelectedRow(row); // Guarda los datos de la fila seleccionada
        };
    
        const handleCloseMenu = () => {
            setAnchorEl(null); // Cierra el menú
            setSelectedRow(null); // Limpia la fila seleccionada
        };
    
 // Función para eliminar una compra
      const deleteCompraAxios = (id) => {
        Swal.fire({
          title: '¿Estás seguro?',
          text: '¡No podrás revertir esto!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, bórralo',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            // Verifica si el usuario tiene permiso de administrador
            if (authUser.user.tipo.tipo === 'Administrador') {
              // Llama a la API para eliminar la compra
              apiDelete(`v2/rh/nomina-administrativa/${id}`, auth) 
              
                .then(() => {
                  Swal.fire('¡Eliminado!', 'El egreso ha sido eliminada.', 'success');
                  reloadData(); 
                  // Actualiza los datos de la tabla eliminando el elemento eliminado
                  setData((prevData) => prevData.filter((item) => item.id !== id));
                })
                .catch((error) => {
                  console.error(error);
                  Swal.fire('Error', 'No se pudo eliminar el egreso.', 'error');
                });
            } else {
              // Mensaje de error si el usuario no tiene permiso
              Swal.fire({
                icon: 'error',
                title: 'No tienes permiso',
                text: 'Lo sentimos, no tienes permiso para borrar esta compra.',
                showConfirmButton: false,
                timer: 4000,
              });
            }
          }
        });
      };
   useEffect(() => {
       if (!modals.crearNomina.show && !modals.editarNomina.show  && !modals.adjuntos.show ) {
           reloadData();
       }
   }, [modals.crearNomina.show, modals.editarNomina.show, modals.adjuntos.show]);

    const reloadData = async () => {
        setIsLoading(true);
        try {
        const page = pagination.pageIndex + 1;
        const pageSize = pagination.pageSize;
        const response = await apiGet(
            `rh/nomina-administrativa?page=${page}&page_size=${pageSize}`,
            auth
        );
        const { data: tableData, total } = response.data.data;
        setData(processData(tableData)); // Actualiza la tabla con nuevos datos
        setTotalRows(total); // Actualiza el total de registros
        } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los datos.', 'error');
        } finally {
        setIsLoading(false);
        }
    };

      // Obtener datos de la API
      useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            const page = pagination.pageIndex + 1; // Ajusta el índice para Laravel
            const pageSize = pagination.pageSize;
            const columnFilterParams = columnFilters.reduce((acc, filter) => {
              acc[filter.id] = filter.value; // Usa el `id` de la columna como clave
              return acc;
            }, {});
            const queryString = Object.keys(columnFilterParams)
            .map((key) => `${key}=${encodeURIComponent(columnFilterParams[key])}`)
            .join('&');
            // console.log(`Fetching page: ${pagination.pageIndex + 1}, pageSize: ${pagination.pageSize}`);
            // console.log(columnFilterParams)
            const response = await apiGet(
              `rh/nomina-administrativa?page=${page}&page_size=${pageSize}&search=${globalFilter}&${queryString}`,
              auth
            );
            // console.log(response)
            const { data: tableData, total } = response.data.data; // Datos y total
            setData(processData(tableData));
            setTotalRows(total); // Total de registros
          } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar los datos.', 'error');
          } finally {
            setIsLoading(false);
          }
        };
        fetchData();
      }, [pagination.pageIndex, pagination.pageSize,globalFilter,columnFilters]);

       // Procesar los datos
        const processData = (datos) => {
            // console.log(datos)
            const formatMonto = (monto) => {
            if (!monto) return '$0'; // Sin información
            return new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN', // Cambia la moneda según sea necesario
                minimumFractionDigits: 2,
            }).format(monto);
            };
            return datos.map((dato) => ({
            id: dato.id || 's/i',
            periodo: dato.periodo,
            nombre: dato.nombre,
            inicio: dato.fecha_inicio ? format(new Date(dato.fecha_inicio), 'yyyy/MM/dd') : 's/i',            // // monto: parseFloat(dato.monto) || 0, // Convertir el monto a número
            fin: dato.fecha_fin ? format(new Date(dato.fecha_fin), 'yyyy/MM/dd') : 's/i',            // // monto: parseFloat(dato.monto) || 0, // Convertir el monto a número
            nomina_imss: formatMonto(dato.totalNominaImss) || 0,
            extraImss: formatMonto(dato.totalExtrasImss) || 0,
            efectivo: formatMonto(dato.totalEfectivo) || 0,
            extraefectivo: formatMonto(dato.totalExtraEfectivo) || 0,
            comision: formatMonto(dato.totalComision) || 0,
            isr: formatMonto(dato.totalIsr) || 0,
            infonavit: formatMonto(dato.totalInfonavit)|| 0,
            imss: formatMonto(dato.totalmss)|| 0,
            isn: formatMonto(dato.totalIsn)|| 0,
            grantotal: formatMonto(dato.granTotal)|| 0,
            adjuntos: dato?.adjuntos || [], // 👈 Esto lo necesitas

            data: dato,

            
            }));
        };


        
        // console.log(options)
        // console.log(form)
    const pathname = location?.pathname ?? '';

    return (
        <Layout authUser={authUser.access_token} location={{ pathname: '/rh/nomina-admin' }} history={{ location: { pathname: '/rh/nomina-admin' } }} active='rh'>

            <Box sx={{ padding: "20px" }}>
                    {/* 🏠 Breadcrumbs: Rastro de Navegación */}
                    <Box mb={2}> 
                        <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                                component="a"
                                href="#"
                                label="Home"
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb component="a" href="" label="rh" />
                            <StyledBreadcrumb component="a" href="/rh/nomina-admin " label="nomina-admin"   />
                        </Breadcrumbs>
                    </Box>
            
                    {/* 📌 Contenedor para los Botones y la Tabla */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>            
                        {/* 📊 Tabla de Datos */}
                        <MaterialReactTable
                            columns={columns}
                            data={data}
                            state={{
                                isLoading,
                                pagination,
                                columnFilters,
                            }}
                            manualPagination
                            onColumnFiltersChange={setColumnFilters}
                            rowCount={totalRows}
                            onPaginationChange={setPagination}
                            renderRowActions={renderRowActions}
                            enableColumnOrdering
                            enableColumnPinning
                            enableColumnResizing={true}
                            enableFullScreenToggle={false}
                            enableToolbar={true}
                            enableGlobalFilter={false}
                            enableColumnFilters={true}
                            enableDensityToggle={true}
                            enablePagination={true}
                            enableRowVirtualization // 🔥 Habilita la virtualización
                            muiTablePaginationProps={{
                                rowsPerPageOptions: [10, 25, 50, 100],
                                labelRowsPerPage: "Filas por página",
                                shape: "rounded",
                                variant: "outlined",
                                sx: { maxHeight: '600px' },
                            }}
                            paginationDisplayMode="pages"
                            initialState={{
                              initialState: { pagination: { pageSize: 50, pageIndex: 1 } },
                              density: 'compact', // Opciones: 'compact', 'comfortable', 'spacious'
                              }}
                            enableRowActions
                            renderTopToolbarCustomActions={({ table }) => (
                              <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
                                <Button sx={{backgroundColor: '#0A3E27',color: '#fff','&:hover': {backgroundColor: '#075633', },}} onClick={() => toggleModal('crearNomina')}variant="contained">
                                  Agregar Nomina
                                </Button>                               
                             
                              </Box>
                            )}
                        />
                    </Box>
                </Box>


        <Modal size = "xl" title = "Crear Nomina Admin" show={modals.crearNomina?.show} handleClose={() => toggleModal('crearNomina')} >
                <CrearNomina handleClose={() => toggleModal('crearNomina')} reload={reloadData}   />
        </Modal>

        <Modal size = "xl" title = "Editar Nomina Admin" show={modals.editarNomina?.show} handleClose={() => toggleModal('editarNomina')} >
                <EditarNomina handleClose={() => toggleModal('editarNomina')} reload={reloadData}  data={modals.editarNomina?.data}  />
        </Modal>


            <ModalDelete
                title='¿Desea eliminar la nómina?'
                show={modal.delete}
                handleClose={() => setModal({ ...modal, delete: false })}
                onClick={async () => {
                    waitAlert();
                    try {
                        await axios.delete(`${URL_DEV}v2/rh/nomina-administrativa/${nomina.id}`, {
                            headers: setSingleHeader(authUser.access_token)
                        });
                        doneAlert('La nómina fue eliminada con éxito.');
                        setModal({ ...modal, delete: false });
                    } catch (error) {
                        printResponseErrorAlert(error);
                    }
                }}
            />

          
        </Layout>
    );
};

export default NominaAdmin;