import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Modal, ModalDelete, ItemSlider} from '../../../components/singles'

import Crear from './Modales/CrearEgreso'
import Editar from './Modales/EditarGasto'
import Ver from './Modales/VerEgreso'
import Filtrar from './Modales/Filtrar'
import FacturaExtranjera from './Modales/FacturaExtranjera'
import Facturas from './Modales/Facturas'
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

import { setDateTable } from '../../../functions/setters'
import { printResponseErrorAlert, doneAlert } from '../../../functions/alert'

import { setMoneyTable,setLabelTable } from '../../../functions/setters'

import StatusIndicatorGastos from './Modales/StatusIndicatorGastos'

import Swal from 'sweetalert2'
import { withStyles, makeStyles } from '@material-ui/core/styles';
// import Tooltip from '@material-ui/core/Tooltip';
// import Button from '@material-ui/core/Button';


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
import daysToWeeks from 'date-fns/daysToWeeks/index.js';

export default function EgresosTable(props) { 
    const auth = useSelector((state) => state.authUser.access_token);
    const [opcionesData, setOpcionesData] = useState()
    const authUser = useSelector((state) => state.authUser);

    const {eliminar } = props
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });
    const [totalRows, setTotalRows] = useState(0); // Total de registros
    const [modals, setModals] = useState({
        crearGasto: { show: false, data: null },
        editarGasto: { show: false, data: null },
        exportar: { show: false },
        adjuntos: { show: false, data: null },    
    });
    const [globalFilter, setGlobalFilter] = useState(''); // Estado para el filtro global
    const [columnFilters, setColumnFilters] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [reloadTable, setReloadTable] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
    const [fechaInicio, setFechaInicio] = useState(''); // Fecha de inicio
    const [fechaFin, setFechaFin] = useState(''); // Fecha de fin

    const handleOpenMenu = (event, row) => {
        setAnchorEl(event.currentTarget); // Abre el menú en la posición del clic
        setSelectedRow(row); // Guarda los datos de la fila seleccionada
    };

    const handleCloseMenu = () => {
        setAnchorEl(null); // Cierra el menú
        setSelectedRow(null); // Limpia la fila seleccionada
    };

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
                <MenuItem onClick={() => { toggleModal('editarGasto', true, selectedRow); handleCloseMenu(); }}
                    sx={{'&:hover': { backgroundColor: 'primary.light', color: 'white', },}} >
                    <Edit sx={{ marginRight: '10px', color: 'primary.main' }} />
                    Editar
                </MenuItem>
                <MenuItem onClick={() => { deleteCompraAxios(selectedRow.id); handleCloseMenu(); }} sx={{ '&:hover': {
                    backgroundColor: '#f77c5d',color: 'white',},}} >
                    <Delete sx={{ marginRight: '10px', color: '#d65e40' }} />
                    Eliminar
                </MenuItem>
                <MenuItem onClick={() => { toggleModal('adjuntos', true, selectedRow.id); handleCloseMenu(); }} sx={{ '&:hover': {
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

    // const toggleModal = (modalKey, data = null) => {
    //     setModals((prevModals) => {
    //         const isOpen = prevModals[modalKey]?.show ?? false;
    //         return {
    //             ...prevModals,
    //             [modalKey]: { 
    //                 show: !isOpen, 
    //                 data: data ?? prevModals[modalKey]?.data // 🔥 Mantiene los datos si se cierra
    //             },
    //         };
    //     });
    
    // };
    const toggleModal = (modalKey, show = null, data = null) => {
        setModals((prevModals) => {
            const current = prevModals[modalKey] || {};
            const isOpen = current.show ?? false;

            const nextShow = typeof show === 'boolean' ? show : !isOpen;

            return {
                ...prevModals,
                [modalKey]: {
                    show: nextShow,
                    data: data ?? current.data,
                },
            };
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
              apiDelete(`egresos/${id}`, auth)
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
       if (!modals.crearGasto.show && !modals.editarGasto.show  && !modals.adjuntos.show ) {
           reloadData();
       }
   }, [modals.crearGasto.show, modals.editarGasto.show, modals.adjuntos.show]);

    const reloadData = async () => {
        setIsLoading(true);
        try {
        const page = pagination.pageIndex + 1;
        const pageSize = pagination.pageSize;
        const response = await apiGet(
            `v3/administracion/gastos?page=${page}&page_size=${pageSize}`,
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
              `v3/administracion/gastos?page=${page}&page_size=${pageSize}&search=${globalFilter}&${queryString}`,
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
        
            const formatMonto = (monto) => {
            if (!monto) return 's/i'; // Sin información
            return new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN', // Cambia la moneda según sea necesario
                minimumFractionDigits: 2,
            }).format(monto);
            };
            // console.log(daysToWeeks)
            return datos.map((dato) => ({
            id: dato.id || 's/i',
            fecha: dato.created_at ? format(new Date(dato.created_at), 'yyyy/MM/dd') : 's/i',            // // monto: parseFloat(dato.monto) || 0, // Convertir el monto a número
            proveedor: dato.proveedor?.razon_social || 's/i',
            factura: dato.factura ? 'Con factura' : 'Sin factura',
            area: dato.area?.nombre || 's/i',
            partida: dato.partidas?.nombre || 's/i',
            subarea: dato.subarea?.nombre || 's/i',
            monto: formatMonto(dato.monto) || 0, // Convertir el monto a número           
            cuenta: dato.cuenta?.nombre || 's/i',
            descripcion: dato.descripcion || 'N/A',
            requisicion: dato.id_requisiciones || 'N/A',
            data: dato,
            }));
        };

        // Configuración de columnas
        const columns = [
          { accessorKey: 'id', header: 'ID', size: 80 },
          { accessorKey: 'fecha', header: 'Fecha', size: 120 },
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
          { accessorKey: 'tipo', header: 'Tipo F',size: 120 },
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
        //   { accessorKey: 'pago', header: 'Pago',size: 130, enableColumnFilter: false, },
        //   { accessorKey: 'impuesto', header: 'Impuesto',size: 130 , enableColumnFilter: false,},
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
    // const [modal, setModal] = useState({
    //     ver: {
    //         show: false,
    //         data: null
    //     },
    //     editar: {
    //         show: false,
    //         data: null
    //     },
    //     crear: {
    //         show: false,
    //         data: null
    //     },
    //     filtrar: {
    //         show: false,
    //         data: null
    //     },
    //     facturaExtranjera: {
    //         show: false,
    //         data: null
    //     },
    //     facturas: {
    //         show: false,
    //         data: null
    //     }
    // })



    useEffect(() => {
        getProveedores()
    }, [filtrado])
    
    const getProveedores = () => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            },
        })
    
        apiOptions("v2/administracion/egresos", auth)
            .then(res => {
                // console.log("Respuesta de la API:", res);
                
                let data = res.data || {}; // Asegurar que `data` es un objeto válido
    
                let aux = {
                    cuentas: [],
                    empresas: [],
                    estatusCompras: [],
                    // proveedores: [],
                    tiposImpuestos: [],
                    tiposPagos: [],
                };
    
                // Asegurar que cada propiedad es un array antes de usar `.map()`
                if (Array.isArray(data.empresas)) {
                    data.empresas.forEach((empresa) => {
                        if (empresa.nombre !== null) {
                            aux.empresas.push({
                                id: empresa.id,
                                name: empresa.name,
                                rfc: empresa.rfc,
                                cuentas: empresa.cuentas || [],
                            });
                        }
                    });
                } else {
                    console.warn("⚠️ `data.empresas` no es un array:");
                }
    
                if (Array.isArray(data.estatusCompras)) {
                    data.estatusCompras.forEach((estatusCompra) => {
                        if (estatusCompra.estatus !== null) {
                            aux.estatusCompras.push({
                                id: estatusCompra.id,
                                name: estatusCompra.estatus,
                            });
                        }
                    });
                } else {
                    console.warn("⚠️ `data.estatusCompras` no es un array:");
                }
    
                if (Array.isArray(data.tiposImpuestos)) {
                    data.tiposImpuestos.forEach((tipoImpuesto) => {
                        if (tipoImpuesto.tipo !== null) {
                            aux.tiposImpuestos.push({
                                id: tipoImpuesto.id,
                                name: tipoImpuesto.tipo,
                            });
                        }
                    });
                } else {
                    console.warn("⚠️ `data.tiposImpuestos` no es un array:");
                }
    
                if (Array.isArray(data.tiposPagos)) {
                    data.tiposPagos.forEach((tipoPago) => {
                        if (tipoPago.tipo !== null) {
                            aux.tiposPagos.push({
                                id: tipoPago.id,
                                name: tipoPago.tipo,
                            });
                        }
                    });
                } else {
                    console.warn("⚠️ `data.tiposPagos` no es un array:");
                }
    
                Swal.close();
                setOpcionesData(aux);
            })
            .catch(error => {
                console.error("Error al obtener proveedores:", error);
                Swal.close();
            });
    };
    

    const [filtrado, setFiltrado] = useState('') 

    // useEffect(() => {
    //     if (filtrado) {
    //         reloadTable.reload(filtrado)
    //         if(borrar == false){
    //             setFiltrado('')   
    //         }
    //     }
    // }, [filtrado])

    const borrar = ( id) =>{
        if(id == false){
            reloadTable.reload(filtrado)
            setFiltrado('')   
        }
    }

    const deleteEgresoAxios = (id) => {
        apiDelete(`egresos/${id}`, auth).then(
            (response) => {
                Swal.fire(
                    '¡Eliminado!',
                    'El egreso ha sido eliminado.',
                    'success'
                )
                if (reloadTable) {
                    reloadTable.reload()
                }
            }, (error) => { }
        ).catch((error) => { catchErrors(error) })
    }  

    // const columns = [
    //     { nombre: '', identificador: 'acciones', sort: false, stringSearch: false },
    //     { nombre: 'ID', identificador: 'id', stringSearch: false },
    //     { nombre: 'Fecha', identificador: 'fecha', stringSearch: false },
    //     { nombre: 'Proveedor', identificador: 'proveedor', stringSearch: false },
    //     { nombre: 'Factura', identificador: 'factura', orderable: false },
    //     { nombre: 'Área', identificador: 'area', stringSearch: false },
    //     { nombre: 'partida', identificador: 'partida', stringSearch: false },
    //     { nombre: 'Sub-Área', identificador: 'subarea', stringSearch: false },
    //     { nombre: 'Monto', identificador: 'monto', stringSearch: false },
    //     { nombre: 'Cuenta', identificador: 'cuenta', stringSearch: false },

    //     { nombre: 'Descripción', identificador: 'descripcion', stringSearch: false }, //quitar
    //     { nombre: 'Requisicion', identificador: 'id_requisicion', stringSearch: false ,active : true }, //quitar

    //     // { nombre: 'Pago', identificador: 'pago', stringSearch: false },
    //     // { nombre: 'Impuesto', identificador: 'impuesto', stringSearch: false },
    //     // { nombre: 'Estatus', identificador: 'estatusCompra', stringSearch: false },
    //     // { nombre: 'Descripción', identificador: 'descripcion', stringSearch: false }, //quitar

    //     // { nombre: 'estatus', identificador: 'semaforo', stringSearch: false } //quitar
    // ]

    // const acciones = [
    //     {
    //         nombre: 'Editar',
    //         icono: 'fas fa-edit',
    //         color: 'blueButton',
    //         funcion: (item) => {
    //             openModal('editar', item)
    //         }
    //     },

    //     {
    //         nombre: 'Eliminar',
    //         icono: 'fas fa-trash-alt',
    //         color: 'redButton',
    //         funcion: (item) => {
    //             eliminar == 1 ?
    //             Swal.fire({
    //                 title: '¿Estás seguro?',
    //                 text: "¡No podrás revertir esto!",
    //                 icon: 'warning',
    //                 showCancelButton: true,
    //                 confirmButtonColor: '#3085d6',
    //                 cancelButtonColor: '#d33',

    //                 confirmButtonText: 'Sí, bórralo',
    //                 cancelButtonText: 'Cancelar'
    //             }).then((result) => {
    //                 if (result.isConfirmed) {
    //                     console.log(eliminar)
    //                     // deleteEgresoAxios(item.id)
                        
    //                 }
    //             })
    //             :   
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'No tienes permiso',
    //                 text: 'Lo sentimos no tienes permiso para borrar...',
    //                 showConfirmButton: false,
    //                 timer: 4000
    //             })
                
    //         }
    //     },
    //     {
    //         nombre: 'Ver gasto',
    //         icono: 'fas fa-eye',
    //         color: 'greenButton',
    //         funcion: (item) => {
    //             openModal('ver', item)
    //         }
    //     },
    
    //     {
    //         nombre: 'Adjuntos',
    //         icono: 'fas fa-paperclip',
    //         color: 'yellowButton',
    //         funcion: (item) => {
    //             openModal('facturaExtranjera', item)
    //         }
    //     },
    //     {
    //         nombre: 'Facturas',
    //         icono: 'fas fa-file-invoice',
    //         color: 'perryButton',
    //         funcion: (item) => {
    //             openModal('facturas', item)
    //         }
    //     },
    // ]

    // const opciones = [
    //     {
    //         nombre: <div><i className="fas fa-plus mr-5"></i><span>Nuevo</span></div>,
    //         funcion: (item) => {
    //             openModal('crear', item)
    //         }
    //     },
    //     {
    //         nombre: <div><i className="fas fa-filter mr-5"></i><span>Filtrar</span></div>,
    //         funcion: (item) => {
    //             openModal('filtrar', item)
    //         }
    //     },
    //     {
    //         nombre: <div><i className="fas fa-file-export mr-5"></i><span>Exportar</span></div>,
    //         funcion: (item) => {
    //             exportEgresosAxios(item.id)
    //         }
    //     },
    // ]

    // const  exportEgresosAxios = () => {
    //     Swal.fire({
    //         icon: 'success',
    //         title: 'Descargar gasto',
    //         text: 'Exportando gastos espere...',
    //         showConfirmButton: false,
    //         timer: 4000
    //     })
        
    //     apiPostFormResponseBlob(`v3/administracion/egresos/exportar`,{ columnas: filtrado },  auth).then(
    //         (response) => {
    //             const url = window.URL.createObjectURL(new Blob([response.data]));
    //             const link = document.createElement('a');
    //             link.href = url;
    //             link.setAttribute('download', 'egresos.xlsx');
    //             document.body.appendChild(link);
    //             link.click();
    //             doneAlert(
    //                 response.data.message !== undefined ? 
    //                     response.data.message 
    //                 : 'Ingresos exportados con éxito.'
    //             )
    //         }, (error) => { printResponseErrorAlert(error) }
    //     ).catch((error) => { catchErrors(error) })
    // }

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
          `v3/administracion/egresos/exportar`,
          { columnas: form },
          auth
        );
    
        // Crear un enlace para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Gastos.xlsx'); // Nombre del archivo descargado
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

    // const openModal = (tipo, data) => {
    //     if(data.factura == 'Sin factura' && tipo == 'facturas' ){
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'No tiene facura',
    //             text: 'El registro es sin factura',
    //             showConfirmButton: false,
    //             timer: 1500
    //         })
            
    //     }else{
    //         setModal({
    //             ...modals,
    //             [tipo]: {
    //                 show: true,
    //                 data: data
    //             }
    //         })
    //     }

    // }

    // const handleClose = (tipo) => {
    //     setModal({
    //         ...modal,
    //         [tipo]: {
    //             show: false,
    //             data: null
    //         }
    //     })
    // }

    const createStatusIndicator = (item) => {
        const createStatusIndicator = (item) => {
            return (
                <StatusIndicatorGastos data={item} />
            )
        }
    }

    const HtmlTooltip = withStyles((theme) => ({
        tooltip: {
          backgroundColor: '#f5f5f9',
          color: 'rgba(0, 0, 0, 0.87)',
          maxWidth: 500,
          maxHeight: 500,
          fontSize: theme.typography.pxToRem(14),
          border: '1px solid #dadde9',
        },
      }))(Tooltip);

    
    const formatNumber = (num) => {
        return `$${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    // const proccessData = (datos) => { 
    //     let aux = []
    //     datos.data.data.map((dato) => {
    //         // console.log(dato)
    //         aux.push({
    //             data: dato,
    //             acciones:dato,
    //             id: dato.id ? dato.id : '',
    //             fecha: dato.created_at ? setDateTable(dato.created_at) : '',
    //             monto: dato.monto ? formatNumber(dato.monto) : '$0',
    //             area: dato.area ? dato.area.nombre : '',
    //             partida: dato.partidas ? dato.partidas.nombre : '',
    //             subarea: dato.subarea ? dato.subarea.nombre : '',
    //             proveedor: dato.proveedor ? dato.proveedor.razon_social : '',
    //             cuenta: dato.cuenta ? dato.cuenta.nombre : '',
    //             // pago: dato.tipo_pago ? dato.tipo_pago.tipo : '',
    //             // impuesto: dato.tipo_impuesto ? dato.tipo_impuesto.tipo : '',
    //             // descripcion: dato.descripcion ? dato.descripcion : '',
    //             descripcion: dato.descripcion ? descripcion(dato.descripcion) : 'N/A',

    //             id_requisicion: dato.requisicion ? adjuntos(dato) : 'N/A',  

    //             // factura: dato.factura ? 'Con factura' : 'Sin factura',
    //             // semaforo: createStatusIndicator(dato),
    //             factura:label(dato),  

    //             // id_requisicion: dato.id_requisiciones ? dato.id_requisiciones : 's/n',

    //         })
    //     }
    //     )
    //     return aux
    // }

    const descripcion = (dato) => {  
        return(            
           <div>        
            <div>
                <HtmlTooltip
                title={
                    <React.Fragment>                 
                        {"Descripcion: " + dato }
                    </React.Fragment>
                } >
                <Button>{dato} </Button>
                </HtmlTooltip>
            </div>              
            </div>
        )
    }

    
    const adjuntos = (dato) => { 
        // console.log(dato.requisicion.presu)
            return(
            <div>  
                    <div key={dato.id}>
                            <em>{dato.requisicion.orden_compra ? "R: " + dato.requisicion.orden_compra : ' N/A'}</em>   <br />                            

                            <em>{dato.requisicion.presu ? "P: " + dato.requisicion.presu.nombre : ' N/A'}</em>  
                    </div>
                </div>      
             )                
    }

  

    const label = (dato) => {  
      // console.log(dato)
        return(
          
            <div   title={`${ dato.data?.factura == 1 ? 'Con factura': 'Sin factura'}`}  >
                {
                    dato.data?.factura ?
                    dato.data?.facturas.length > 0 || dato.data?.factura.length > 0 || dato.data?.facturas_pdf.length ?
                     <span   style={{ color: 'green' }}><DoneAllIcon/></span>
                        : <span   style={{ color: 'red' }}><DoneAllIcon/></span>
                    : <span><DescriptionOutlinedIcon/></span>
                }
            </div>
        )
    }



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
                <StyledBreadcrumb component="a" href="#" label="Administracion" />
                <StyledBreadcrumb component="a" href="#" label="Gastos"   />
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
                    <Button sx={{backgroundColor: '#0A3E27',color: '#fff','&:hover': {backgroundColor: '#075633', },}} onClick={() => toggleModal('crearGasto')}variant="contained">
                      Crear Gasto
                    </Button>
                    <Button sx={{ backgroundColor: '#457FF4', color: '#fff', '&:hover': { backgroundColor: '#568eff', },}} onClick={() => setIsModalOpen(true)} variant="contained">
                    Exportar Gastos
                  </Button>
                 
                  </Box>
                )}
            />
        </Box>
    </Box>
        
            {/* <TablaGeneralPaginado
                titulo="Gastos"
                subtitulo="listado de gastos"
                url={'v3/administracion/gastos'}
                columnas={columns}
                numItemsPagina={50}
                ProccessData={proccessData}
                opciones={opciones}
                acciones={acciones}
                reload={setReloadTable} 
                filtros={filtrado}
            /> */}

           <Modal
              size="xl"
              title="Nuevo gasto"
              show={modals.crearGasto?.show}
              handleClose={() => toggleModal('crearGasto', false)} // ⛔️ Ya no solo togglear
            >
              <Crear
                handleClose={(wasSaved) => {
                  toggleModal('crearGasto', false) // 👈 siempre cierra
                  if (wasSaved) reloadData()       // 👈 recarga si fue guardado
                }}
                getProveedores={getProveedores}
                opcionesData={opcionesData}
                reload={reloadData}
              />
            </Modal>

            {
            modals.editarGasto?.data &&
            <Modal size="xl" title={"Editar gasto"} show={modals.editarGasto?.show}  handleClose={() => toggleModal('editarGasto')} >
                <Editar handleClose={() => toggleModal('editarGasto')} opcionesData={opcionesData} reload={reloadData} data={modals.editarGasto?.data}/>
            </Modal>
                 
            }

            {
            modals.adjuntos?.data &&
            <Modal size="lg" title={"Adjuntos"} show={modals.adjuntos?.show} handleClose={() => toggleModal('adjuntos')} >
                <FacturaExtranjera handleClose={() => toggleModal('adjuntos')} opcionesData={opcionesData} reload={reloadTable} data={modals.adjuntos?.data}/>
            </Modal>            
            }

            {/* {
                modal.facturas.data &&
                <Modal size="xl" title={"Facturas"} show={modal.facturas?.show} handleClose={e => handleClose('facturas')} >
                    <Facturas handleClose={e => handleClose('facturas')}  opcionesData={opcionesData} egreso={modal.facturas.data}/>
                </Modal> 
            }
        
            

            {
                modal.ver.data &&
                <Modal size="lg" title={"Ver gasto"} show={modal.ver?.show} handleClose={e => handleClose('ver')} >
                    <Ver handleClose={e => handleClose('ver')} opcionesData={opcionesData} data={modal.ver?.data?.data}/>
                </Modal>
            }
            
            {
                modal.filtrar.data &&
                <Modal size="lg" title={"Filtrar gastos"} show={modal.filtrar?.show} handleClose={e => handleClose('filtrar')} >
                    <Filtrar handleClose={e => handleClose('filtrar')} opcionesData={opcionesData} filtrarTabla={setFiltrado} borrarTabla={borrar}  reload={reloadTable}/>
                </Modal>
            }

            
 */}
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
    )

}