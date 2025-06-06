import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MaterialReactTable, MRT_ActionMenuItem } from 'material-react-table';
import Swal from 'sweetalert2';
import {apiGet, apiOptions, catchErrors, apiDelete, apiPostFormResponseBlob } from './../../../functions/api';
import { Edit, Delete ,Settings, MoreVert} from '@mui/icons-material';
import { format } from 'date-fns';
import { Box, Button, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField,Grid } from '@mui/material';
// import Modal from '@material-ui/core/Modal';
import ReceiptIcon from '@material-ui/icons/Receipt';

import CrearCompras from './CrearCompras'
import EditarCompra from './EditarCompra'
import AttachFile from '@mui/icons-material/AttachFile';
import AdjuntosCompras from './AdjuntosCompras'
import FacturasCompras from './FacturasCompras'

import { Modal, ModalDelete, ItemSlider} from '../../../components/singles'
import { emphasize, styled } from '@mui/material/styles';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';


export default function ComprasTable(props) {
  const {  handleClose, reload  } = props

  const auth = useSelector((state) => state.authUser.access_token);
  const authUser = useSelector((state) => state.authUser);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [reloadTable, setReloadTable] = useState()

  const columnVirtualizerInstanceRef = useRef(null);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });
  const [totalRows, setTotalRows] = useState(0); // Total de registros
  const [modals, setModals] = useState({
    crearCompra: { show: false, data: null },
    editarCompra: { show: false, data: null },
    exportar: { show: false },
    adjuntos: { show: false, data: null },    
  });


  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const [fechaInicio, setFechaInicio] = useState(''); // Fecha de inicio
  const [fechaFin, setFechaFin] = useState(''); // Fecha de fin
  const [globalFilter, setGlobalFilter] = useState(''); // Estado para el filtro global
  const [columnFilters, setColumnFilters] = useState([]);
  const [ModalCreateOpen, setModalCreateOpen] = useState(false); // Estado para el modal crear
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [reloadTable, setReloadTable] = useState();

  // const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  // const handleCloseMenu = () => setAnchorEl(null);

const handleOpenMenu = (event, row) => {
    setAnchorEl(event.currentTarget); // Abre el menú en la posición del clic
    setSelectedRow(row); // Guarda los datos de la fila seleccionada
};

const handleCloseMenu = () => {
    setAnchorEl(null); // Cierra el menú
    setSelectedRow(null); // Limpia la fila seleccionada
};

  const [opcionesData, setOpcionesData] = useState({
    cuentas: [],
    empresas: [],
    estatusCompras: [],
    proveedores: [],
    tiposImpuestos: [],
    tiposPagos: [],
  });

  // Configuración de columnas
  const columns = [
    { accessorKey: 'id', header: 'ID', size: 80 },
    { accessorKey: 'fecha', header: 'Fecha', size: 120 },
    { accessorKey: 'proyecto', header: 'Proyecto', size: 200,
      // enableClickToCopy: true,
      //   muiCopyButtonProps: {
      //     fullWidth: true,
      //     startIcon: <ContentCopy />,
      //     sx: { justifyContent: 'flex-start' },
      //   },
      Cell: ({ cell }) => (
        <Tooltip title={cell.getValue()} arrow>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth: '100%',}}>
            {cell.getValue()}
          </span>
        </Tooltip>
      ),
     },
    {  accessorKey: 'proveedor', header: 'Proveedor', size: 200,
      enableClickToCopy: true,
      muiCopyButtonProps: { fullWidth: true, startIcon: <ContentCopy />, sx: { justifyContent: 'flex-start' },},
      Cell: ({ cell }) => (
        <Tooltip title={cell.getValue()} arrow>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth: '100%', }} >
            {cell.getValue()}
          </span>
        </Tooltip>
      ),
    },
    {
      accessorKey: 'factura',
      header: 'Factura',
      size: 120,
      Cell: ({ row }) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            {label(row.original)}
        </div>
       ),
    }, 
    { accessorKey: 'tipo', header: 'Tipo F',size: 150 },
    { accessorKey: 'area', header: 'Área',size: 150 },
    { accessorKey: 'partida', header: 'Partida',size: 120 },
    { accessorKey: 'subarea', header: 'Sub-partida',size: 150 },
    { accessorKey: 'monto', header: 'Monto' ,size: 150,
      // Cell: ({ cell }) =>
      //   cell.getValue().toLocaleString('es-MX', {
      //     style: 'currency',
      //     currency: 'MXN',
      //   }),
      // filterVariant: 'range-slider',
      // filterFn: 'betweenInclusive', // default (or between)
      // muiFilterSliderProps: {
      //   marks: true,
      //   max: 2000_000, // Máximo personalizado
      //   min: 1_000, // Mínimo personalizado
      //   step: 1_000,
      //   valueLabelFormat: (value) =>
      //     value.toLocaleString('es-MX', {
      //       style: 'currency',
      //       currency: 'MXN',
      //     }),
      // },

    },
    {  accessorKey: 'cuenta', header: 'Cuenta', size: 180,
      Cell: ({ cell }) => (
        <Tooltip title={cell.getValue()} arrow>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',display: 'block', maxWidth: '100%',}}>
            {cell.getValue()}
          </span>
        </Tooltip>
      ),
     },
    { accessorKey: 'pago', header: 'Pago',size: 130, enableColumnFilter: false, },
    { accessorKey: 'impuesto', header: 'Impuesto',size: 130 , enableColumnFilter: false,},
    { accessorKey: 'requisicion', header: 'Requisición',size: 150 },
    { accessorKey: 'descripcion', header: 'Descripción', size: 200,
      enableClickToCopy: true, muiCopyButtonProps: { fullWidth: true, startIcon: <ContentCopy />, sx: { justifyContent: 'flex-start' },},
      Cell: ({ cell }) => (
        <Tooltip title={cell.getValue()} arrow>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',display: 'block', maxWidth: '100%',}}>
            {cell.getValue()}
          </span>
        </Tooltip>
      ),
     },
  ];


   const label = (dato) => { 
          return(
      
              <div   title={`${ dato.data?.factura == 1 ? 'Con factura': 'Sin factura'}`}  >
                  {
                      dato.data?.factura ?
                      dato.data?.facturas.length > 0 || dato.data?.facturas_pdf.length ?
                       <span   style={{ color: 'green' }}><DoneAllIcon/></span>
                          : <span   style={{ color: 'red' }}><DoneAllIcon/></span>
                      : <span><DescriptionOutlinedIcon/></span>
                  }
              </div>
          )
      }
  

    useEffect(() => {
        getProveedores();
      }, []); //


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
          `v3/proyectos/compras?page=${page}&page_size=${pageSize}&search=${globalFilter}&${queryString}`,
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

  useEffect(() => {
    if (!modals.crearCompra.show && !modals.editarCompra.show) {
        reloadData();
    }
}, [modals.crearCompra.show, modals.editarCompra.show]);

  // Procesar los datos
  const processData = (datos) => {
  
    const formatMonto = (monto) => {
      if (!monto) return 's/i'; // Sin información
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN', // Cambia la moneda según sea necesario
        minimumFractionDigits: 2,
      }).format(monto);
    };
      return datos.map((dato) => ({
      id: dato.id || 's/i',
      fecha: dato.created_at ? format(new Date(dato.created_at), 'yyyy/MM/dd') : 's/i',
      // monto: parseFloat(dato.monto) || 0, // Convertir el monto a número
      monto: formatMonto(dato.monto) || 0, // Convertir el monto a número
      area: dato.area?.nombre || 's/i',
      proyecto: dato.proyecto?.nombre || 'N/A',
      partida: dato.partida?.nombre || 's/i',
      subarea: dato.subarea?.nombre || 's/i',
      proveedor: dato.proveedor?.razon_social || 's/i',
      cuenta: dato.cuenta?.nombre || 's/i',
      pago: dato.tipo_pago?.tipo || 's/i',
      impuesto: dato.tipo_impuesto?.tipo || 's/i',
      descripcion: dato.descripcion || 'N/A',
      requisicion: dato.id_requisiciones || 'N/A',
      factura: dato.factura ? 'Con factura' : 'Sin factura',
      tipo: dato.tipo === 'nacional' ? 'FN' : dato.tipo === 'extranjera' ? 'CE' : '',
      data:dato,

    }));
  };

  const getProveedores = () => {
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  
    apiOptions(`v2/administracion/egresos`, auth)
      .then((res) => {
        let data = res.data;
  
        let aux = {
          cuentas: [],
          empresas: [],
          estatusCompras: [],
          proveedores: [],
          tiposImpuestos: [],
          tiposPagos: [],
        };
  
        data.proveedores.forEach((proveedor) => {
          if (proveedor.razon_social !== null) {
            aux.proveedores.push({
              id: proveedor.id,
              name: proveedor.razon_social,
              rfc: proveedor.rfc,
            });
          }
        });
  
        data.empresas.forEach((empresa) => {
          if (empresa.name !== null) {
            aux.empresas.push({
              id: empresa.id,
              name: empresa.name,
              rfc: empresa.rfc,
              cuentas: empresa.cuentas,
            });
          }
        });
  
        data.estatusCompras.forEach((estatusCompra) => {
          if (estatusCompra.estatus !== null) {
            aux.estatusCompras.push({
              id: estatusCompra.id,
              name: estatusCompra.estatus,
            });
          }
        });
  
        data.tiposImpuestos.forEach((tipoImpuesto) => {
          if (tipoImpuesto.tipo !== null) {
            aux.tiposImpuestos.push({
              id: tipoImpuesto.id,
              name: tipoImpuesto.tipo,
            });
          }
        });
  
        data.tiposPagos.forEach((tipoPago) => {
          if (tipoPago.tipo !== null) {
            aux.tiposPagos.push({
              id: tipoPago.id,
              name: tipoPago.tipo,
            });
          }
        });
  
        Swal.close();
        setOpcionesData(aux);
      })
      .catch((error) => {
        Swal.close();
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los datos.', 'error');
      });
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
          apiDelete(`compras/${id}`, auth)
            .then(() => {
              Swal.fire('¡Eliminado!', 'La compra ha sido eliminada.', 'success');
              reloadData(); 
              // Actualiza los datos de la tabla eliminando el elemento eliminado
              setData((prevData) => prevData.filter((item) => item.id !== id));
            })
            .catch((error) => {
              console.error(error);
              Swal.fire('Error', 'No se pudo eliminar la compra.', 'error');
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
  

  // Renderizar acciones para cada fila
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
            <MenuItem onClick={() => { toggleModal('editarCompra', selectedRow); handleCloseMenu(); }}
                sx={{'&:hover': { backgroundColor: 'primary.light', color: 'white', },}} >
                <Edit sx={{ marginRight: '10px', color: 'primary.main' }} />
                Editar
            </MenuItem>
            <MenuItem onClick={() => { deleteCompraAxios(selectedRow.id); handleCloseMenu(); }} sx={{ '&:hover': {
                backgroundColor: '#f77c5d',color: 'white',},}} >
                <Delete sx={{ marginRight: '10px', color: '#d65e40' }} />
                Eliminar
            </MenuItem>
            <MenuItem onClick={() => { toggleModal('adjuntos', selectedRow.id); handleCloseMenu(); }} sx={{ '&:hover': {
                backgroundColor: '#E2D1BF',color: 'white',},}}>
                <AttachFile sx={{ marginRight: '10px', color: '#c6b7a9' }} />
                Adjuntos
            </MenuItem>
            {/* <MenuItem onClick={() => { toggleModal('facturas', selectedRow.id); handleCloseMenu(); }} sx={{ '&:hover': {
                backgroundColor: '#E2D1BF',color: 'white',},}}>
                <ReceiptIcon sx={{ marginRight: '10px', color: '#c6b7a9' }} />
                Facturas
            </MenuItem> */}
        </Menu>
    </>
);



 const handleExport = async () => {
  if (!fechaInicio || !fechaFin) {
    Swal.fire('Error', 'Por favor selecciona ambas fechas.', 'error');
    return;
  }

  try {
    const form = {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    };
    const response = await apiPostFormResponseBlob(
      `v3/proyectos/compra/exportar`,
      { columnas: form },
      auth
    );

    // Crear un enlace para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'compras.xlsx'); // Nombre del archivo descargado
    document.body.appendChild(link);
    link.click();

    // Cierra el modal
    setIsModalOpen(false);

    // Mensaje de éxito
    Swal.fire(
      'Exportación exitosa',
      response.data.message || 'Compras exportadas con éxito.',
      'success'
    );
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'No se pudo exportar los datos.', 'error');
  }
};


  // Función para abrir modales (reutiliza tu lógica actual)
  const openModal = (tipo, data) => {
    Swal.fire(`Acción: ${tipo}`, `Datos: ${JSON.stringify(data)}`, 'info');
  };

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });
  
  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };


  const handleCloseModal = () => {
    setModalCreateOpen(false);
  };

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

  const reloadData = async () => {
    setIsLoading(true);
    try {
      const page = pagination.pageIndex + 1;
      const pageSize = pagination.pageSize;
      const response = await apiGet(
        `v3/proyectos/compras?page=${page}&page_size=${pageSize}`,
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
  
  function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }
  

  return (
    <>
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
                <StyledBreadcrumb component="a" href="#" label="Proyectos" />
                <StyledBreadcrumb component="a" href="#" label="Compras"   />
            </Breadcrumbs>
        </Box>

        {/* 📌 Contenedor para los Botones y la Tabla */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* 🛠️ Botones de Acciones */}
            {/* <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Button
                        sx={{
                            backgroundColor: "#0A3E27",
                            color: "#fff",
                            "&:hover": { backgroundColor: "#075633" },
                        }}
                        onClick={() => toggleModal("crearCompra")}
                        variant="contained"
                    >
                        Crear Nuevo
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        sx={{
                            backgroundColor: "#457FF4",
                            color: "#fff",
                            "&:hover": { backgroundColor: "#568eff" },
                        }}
                        onClick={() => setIsModalOpen(true)}
                        variant="contained"
                    >
                        Exportar Compras
                    </Button>
                </Grid>
            </Grid> */}

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
                enableRowVirtualization
                muiTablePaginationProps={{
                    rowsPerPageOptions: [10, 25, 50, 100],
                    labelRowsPerPage: "Filas por página",
                    shape: "rounded",
                    variant: "outlined",
                    sx: { maxHeight: '600px' }
                }}
                paginationDisplayMode="pages"
                initialState={{
                  initialState: { pagination: { pageSize: 50, pageIndex: 1 } },
                  density: 'compact', // Opciones: 'compact', 'comfortable', 'spacious'
                  }}
                enableRowActions
                renderTopToolbarCustomActions={({ table }) => (
                  <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
                    <Button sx={{backgroundColor: '#0A3E27',color: '#fff','&:hover': {backgroundColor: '#075633', },}} onClick={() => toggleModal('crearCompra')}variant="contained">
                      Crear Nuevo
                    </Button>
                    <Button sx={{ backgroundColor: '#457FF4', color: '#fff', '&:hover': { backgroundColor: '#568eff', },}} onClick={() => setIsModalOpen(true)} variant="contained">
                    Exportar Compras
                  </Button>
                 
                  </Box>
                )}
            />
        </Box>
    </Box>

     <Modal size = "xl" title = "Crear compra" show={modals.crearCompra.show} handleClose={() => toggleModal('crearCompra')} >
        <CrearCompras handleClose={() => toggleModal('crearCompra')} reload={reloadData} opcionesData={opcionesData} getProveedores={getProveedores} />

    </Modal>

    {
        modals.editarCompra?.data &&
        <Modal size="xl" title={"Editar compra"} show={modals.editarCompra.show} handleClose={() => toggleModal('editarCompra')} >
            <EditarCompra handleClose={() => toggleModal('editarCompra')} opcionesData={opcionesData} reload={reloadTable} data={modals.editarCompra.data} />
        </Modal>
    }

    {
        modals.adjuntos?.data &&
        <Modal size="lg" title={"adjuntos"} show={modals.adjuntos?.show}  handleClose={() => toggleModal('adjuntos')} >
            <AdjuntosCompras  handleClose={() => toggleModal('adjuntos')} opcionesData={opcionesData} reload={reloadTable} data={modals.adjuntos?.data} />
        </Modal>
    }

    {
          modals.facturas?.data &&
          <Modal size="xl" title={"facturas"} show={modals.facturas?.show} handleClose={() => toggleModal('facturas')} >
              <FacturasCompras handleClose={() => toggleModal('facturas')} opcionesData={opcionesData} reload={reloadTable} compra={modals.facturas?.data} />
          </Modal>
      }

      {/* <Modal size="lg" title={"Nueva compra"}   open={editarCompraModalCreateOpen}
         aria-labelledby="modal-title" aria-describedby="modal-description"
        onClose={handleCloseModal} 
        >       
          <CrearCompras handleClose={e => handleClose('crear')} reload={reloadTable} opcionesData={opcionesData} getProveedores={getProveedores} />
      </Modal> */}

       {/* Modal para la exportación */}
       <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DialogTitle>Exportar Compras</DialogTitle>
          <DialogContent><br />
            <TextField
              label="Fecha Inicio"
              type="date"
              fullWidth
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Fecha Fin"
              type="date"
              fullWidth
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleExport} color="primary" variant="contained">
              Exportar
            </Button>
          </DialogActions>
        </Dialog>
      </>

    
  );
};

// export default ComprasTable;
