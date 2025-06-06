import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import Tabla from './../../../components/NewTables/TablaGeneral/TablaGeneral'
import TablaGeneralPaginado from './../../../components/NewTables/TablaGeneral/TablaGeneralPaginado'
import { REQUISICIONES } from '../../../constants'
import { Modal } from '../../../components/singles'
import Adjuntos from '../../Administracion/RequisicionCompras/Modales/Adjuntos'
import NuevaRequisicion from '../../../components/forms/administracion/NuevaRequisicion'
import VerRequisicion from '../../../components/forms/administracion/VerRequisicion'
import {EditarRequisicion} from '../../../components/forms/administracion/EditarRequisicion'
import FiltrarRequisiciones from '../../../components/forms/administracion/FiltrarRequisiciones'
import Historial from '../../../components/forms/administracion/Historial'
import Comentarios from '../../../components/forms/administracion/comentarios'
import { withStyles, makeStyles } from '@material-ui/core/styles';
// import Tooltip from '@material-ui/core/Tooltip';
// import Button from '@material-ui/core/Button';
import withReactContent from 'sweetalert2-react-content';

import useOptionsArea from '../../../hooks/useOptionsArea'
import StatusIndicator from './utils/StatusIndicator'
import {apiGet, apiOptions, apiPutForm , catchErrors, apiDelete, apiPostFormResponseBlob } from './../../../functions/api';


import { History, Comment } from '@mui/icons-material';

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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import SyncIcon from '@mui/icons-material/Sync';
import { Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';


function Requisiciones () {

    //muevo
     const auth = useSelector((state) => state.authUser.access_token);
     const authUser = useSelector((state) => state.authUser);
     
     const [data, setData] = useState([]);
     const [isLoading, setIsLoading] = useState(true);
    // const [reloadTable, setReloadTable] = useState()

    const columnVirtualizerInstanceRef = useRef(null);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });
    const [totalRows, setTotalRows] = useState(0); // Total de registros
    const [modals, setModals] = useState({
        crearRequi: { show: false, data: null },
        editarReqi: { show: false, data: null },
        exportar: { show: false },
        adjuntos: { show: false, data: null },    
        historial: { show: false, data: null },    
        comentarios: { show: false, data: null },    
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




    const handleOpenMenu = (event, row) => {
        setAnchorEl(event.currentTarget); // Abre el menú en la posición del clic
        setSelectedRow(row); // Guarda los datos de la fila seleccionada
    };

    const handleCloseMenu = () => {
        setAnchorEl(null); // Cierra el menú
        setSelectedRow(null); // Limpia la fila seleccionada
    };


        // fin de nevo

    const userAuth = useSelector((state) => state.authUser);
    // const [reloadTable, setReloadTable] = useState()
    const [filtrado, setFiltrado] = useState('') 

    // const [modal, setModal] = useState({

    //     crear: {
    //         show: false,
    //         data: false
    //     },

    //     editar: {
    //         show: false,
    //         data: false
    //     },
    //     filtrar: {
    //         show: false,
    //         data: null
    //     },
    //     adjuntos: {
    //         show: false,
    //         data: false
    //     },
    //     ver: {
    //         show: false,
    //         data: false
    //     },
    //     cancelar: {
    //         show: false,
    //         data: false
    //     },
    //     historial:{
    //         show: false,
    //         data: false
    //     },
    //     comentarios:{
    //         show: false,
    //         data: false
    //     },

    // })

    useOptionsArea()

    // useEffect(() => {
    //     if (filtrado) {
    //         reloadTable.reload(filtrado)
    //         if(borrar == false){
    //             setFiltrado('')  
    //         }
    //     }
    // }, [filtrado])
    

    // const borrar = ( id) =>{
    //     if(id == false){
    //         reloadTable.reload(filtrado)
    //         setFiltrado('')   
    //         handleClose('filtrar')

    //     }
    // }

    let prop = {
        pathname: '/administracion/requisicion',
    }

    const createStatusIndicator = (item) => {
        return (
            <StatusIndicator data={item} />
        )
    }

// nuevo 

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


       // Configuración de columnas
        const columns = [
          { accessorKey: 'id', header: 'ID', size: 80 },
          {
                accessorKey: 'terminar',
                header: 'Terminar',
                size: 120,
                Cell: ({ row }) => (
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleTerminarClick(row.original)}
                        sx={{ textTransform: 'none' }}
                    >
                        Terminar
                    </Button>
                ),
            },
          { accessorKey: 'orden', header: 'Orden de compra', size: 120, 
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
          { accessorKey: 'presupuesto', header: 'Presupuesto', size: 200,
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
          {  accessorKey: 'solicitante', header: 'Solicitante', size: 200,},
          { accessorKey: 'departamento', header: 'Departamento',size: 150 },
          { accessorKey: 'gasto', header: 'Gasto',size: 150 },
          { accessorKey: 'fecha', header: 'Fecha',size: 120 },
          { accessorKey: 'tiempo', header: 'Tiempo estimado',size: 150 },
          {
            accessorKey: 'estatus',
            header: 'Estatus',
            size: 150,
            Cell: ({ row }) => {
                const { icon, color, label } = getEstatusConfig(row.original.estatus);
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {icon}
                        <Typography sx={{ color }}>{label}</Typography>
                    </Box>
                );
            }
        },
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

        // Función para obtener el icono y color según el estatus
        const getEstatusConfig = (estatus) => {
            switch (estatus?.toLowerCase()) {
                case 'completada':
                    return { icon: <CheckCircleIcon style={{ color: 'green' }} />, color: 'green', label: 'Completada' };
                case 'pendiente':
                    return { icon: <HourglassEmptyIcon style={{ color: 'orange' }} />, color: 'orange', label: 'Pendiente' };
                case 'cancelada':
                    return { icon: <CancelIcon style={{ color: 'red' }} />, color: 'red', label: 'Cancelada' };
                case 'en proceso':
                    return { icon: <SyncIcon style={{ color: 'blue' }} />, color: 'blue', label: 'En Proceso' };
                case 'solicitada':
                    return { icon: <DescriptionIcon style={{ color: '#0288D1' }} />, color: '#0288D1', label: 'Solicitada' };
                default:
                    return { icon: <HourglassEmptyIcon style={{ color: 'gray' }} />, color: 'gray', label: 'Desconocido' };
            }
        };

          useEffect(() => {
            reloadData()
               if (!modals.crearRequi.show && !modals.editarReqi.show) {
                   reloadData();
               }
           }, [modals.crearRequi.show, modals.editarReqi.show]);

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
                // console.log(datos)
              return datos.map((dato) => ({
              id: dato.id || 's/i',
              orden: dato.orden_compra  || 'N/A',
              presupuesto: dato.presu?.nombre || 'N/A',
              solicitante: dato.solicitante?.name || 'N/A',
              departamento: dato.departamento?.nombre || 'N/A',
              gasto: dato.gasto?.nombre || 'N/A',
              fecha: dato.created_at ? format(new Date(dato.created_at), 'yyyy/MM/dd') : 's/i',
              tiempo: dato.fecha_entrega || 'N/A',
              descripcion: dato.descripcion || 'N/A',
              estatus: dato.estatus?.estatus || 'N/A', // ✅ Se pasa sin transformar
              data: dato,                    
            }));
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
                    <MenuItem onClick={() => { toggleModal('editarReqi', selectedRow); handleCloseMenu(); }}
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
                    {/* ✅ Historial */}
                    <MenuItem onClick={() => { toggleModal('historial', selectedRow.id); handleCloseMenu(); }} 
                        sx={{ '&:hover': { backgroundColor: '#D4AF37', color: 'white' } }}>
                        <History sx={{ marginRight: '10px', color: '#AF8700' }} />
                        Historial
                    </MenuItem>

                    {/* ✅ Comentarios */}
                    <MenuItem onClick={() => { toggleModal('comentarios', selectedRow.id); handleCloseMenu(); }} 
                        sx={{ '&:hover': { backgroundColor: '#90CAF9', color: 'white' } }}>
                        <Comment sx={{ marginRight: '10px', color: '#42A5F5' }} />
                        Comentarios
                    </MenuItem>
                    {/* <MenuItem onClick={() => { toggleModal('facturas', selectedRow.id); handleCloseMenu(); }} sx={{ '&:hover': {
                        backgroundColor: '#E2D1BF',color: 'white',},}}>
                        <ReceiptIcon sx={{ marginRight: '10px', color: '#c6b7a9' }} />
                        Facturas
                    </MenuItem> */}
                </Menu>
            </>
        );

          const toggleModal = (modalKey, data = null) => {
            // console.log(modalKey)
            setModals((prevModals) => {
                const isOpen = prevModals[modalKey]?.show ?? false;
                // console.log(isOpen)
                return {
                    ...prevModals,
                    [modalKey]: { 
                        show: !isOpen, 
                        data: data ?? prevModals[modalKey]?.data // 🔥 Mantiene los datos si se cierra
                    },
                };
            });
        
        };

        // Obtener datos de la API
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const page = pagination.pageIndex + 1; 
                const pageSize = pagination.pageSize;
                const columnFilterParams = columnFilters.reduce((acc, filter) => {
                    acc[filter.id] = filter.value;
                    return acc;
                }, {});
                const queryString = Object.keys(columnFilterParams)
                    .map((key) => `${key}=${encodeURIComponent(columnFilterParams[key])}`)
                    .join('&');
        
                const response = await apiGet(
                    `requisicion?page=${page}&page_size=${pageSize}&search=${globalFilter}&${queryString}`,
                    auth
                );
        
                if (response?.data?.data) {
                    const { data: tableData, total } = response.data.data;
                    setData(processData(tableData)); // 🔥 Asegura que los datos se procesan correctamente
                    setTotalRows(total);
                } else {
                    console.warn("⚠️ No se recibieron datos válidos en la respuesta");
                }
            } catch (error) {
                console.error("❌ Error al obtener datos:", error);
                Swal.fire('Error', 'No se pudieron cargar los datos.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchData();
        }, [pagination, globalFilter, columnFilters, auth]);
        
        
        

        const reloadData = async () => {
            setIsLoading(true);
            try {
                const response = await apiGet(
                    `requisicion?page=${pagination.pageIndex + 1}&page_size=${pagination.pageSize}`,
                    auth
                );
                if (response?.data?.data) {
                    const { data: tableData, total } = response.data.data;
                    setData(processData(tableData)); // ✅ Asegura que los datos se reflejen correctamente
                    setTotalRows(total);
                } else {
                    setData([]); // 🔥 Previene que la tabla se vacíe si la API no devuelve datos
                }
            } catch (error) {
                console.error('Error al recargar los datos:', error);
                Swal.fire('Error', 'No se pudieron cargar los datos.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

            // Función para eliminar una compra
            const deleteCompraAxios = async (id) => {
                const result = await Swal.fire({
                    title: '¿Estás seguro?',
                    text: '¡No podrás revertir esto!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, bórralo',
                    cancelButtonText: 'Cancelar',
                });
            
                if (!result.isConfirmed) return;
            
                // Verifica si el usuario tiene permiso de administrador
                if (authUser.user.tipo.tipo !== 'Administrador') {
                    Swal.fire({
                        icon: 'error',
                        title: 'No tienes permiso',
                        text: 'Lo sentimos, no tienes permiso para borrar esta compra.',
                        showConfirmButton: false,
                        timer: 4000,
                    });
                    return;
                }
            
                try {
                    await apiDelete(`requisicion/${id}/cancelar`, userAuth.access_token);
                    Swal.fire('¡Eliminado!', 'La requisición ha sido cancelada.', 'success');
            
                    // 🔥 Recargar datos desde la API en lugar de solo filtrar localmente
                    await fetchData();
                } catch (error) {
                    console.error('Error al eliminar la requisición:', error);
                    Swal.fire('Error', 'No se pudo cancelar la requisición.', 'error');
                }
            };
            

            const handleTerminarClick = async (item) => {
                if (item.id_estatus_compra === 11) {
                    Swal.fire({
                        title: 'Requisición ya terminada',
                        text: 'La requisición ya fue completada',
                        icon: 'warning',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok'
                    });
                } else {
                    const result = await Swal.fire({
                        title: `¿Estás seguro que deseas terminar la requisición ${item.orden_compra}?`,
                        text: "No podrás revertir esto.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sí, terminar",
                        cancelButtonText: "No, cancelar",
                        reverseButtons: true
                    });
            
                    if (result.isConfirmed) {
                        try {
                            await apiPutForm(`requisicion/terminar/${item.id}`, item, auth);
                            Swal.fire({
                                title: "¡Terminado!",
                                text: "Tu requisición ha sido terminada.",
                                icon: "success"
                            });
            
                            // 🔥 Llamar a fetchData() para recargar los datos en la tabla
                            fetchData();
                        } catch (error) {
                            console.error('Error al terminar la requisición:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Ha ocurrido un error al procesar la solicitud.',
                            });
                        }
                    }
                }
            };
            
            


            
        

// fin de nuevo




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


    // const proccessData = (datos) => {
        
    //     let aux = []
    //     datos.data.data.map((result) => {
    //         aux.push(
    //                 {
    //                     // acciones: acciones(),
    //                     terminar: botton(result),
    //                     orden_compra: result.orden_compra,
    //                     solicita: result.solicitante.name,
    //                     fecha: result.fecha,
    //                     fecha_view: reformatDate(result.fecha),
    //                     departamento: result.departamento ?  result.departamento.nombre : '',
    //                     tipo_gasto: result.gasto ? result.gasto.nombre: 'no definido',
    //                     // descripcion: result.descripcion,
    //                     descripcion: result.descripcion ? descripcion(result.descripcion) : 'N/A',
    //                     estatus: result.estatus ? result.estatus.estatus : 'pendiente' ,
    //                     tiempo_estimado: result.fecha_entrega ? result.fecha_entrega : 'no especificado',
    //                     id:result.id,
    //                     data: result, 
    //                     presupuesto: result.presu ? result.presu.nombre : '',
    //                     semaforo: createStatusIndicator(result),
    //                 }
    //             )
    //         })
    //         // aux=aux.reverse()
    //         return aux
    // }


    const botton = (item) => {
        const handleClick = () => {
    
            if(item.id_estatus_compra == 11){
                Swal.fire({
                    title: 'Requisición ya terminada',
                    text: 'La requisición ya fue completada',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                })

            }else{
                
                const swalWithBootstrapButtons = withReactContent(Swal.mixin({
                    customClass: {
                        confirmButton: "btn btn-success",
                        cancelButton: "btn btn-danger"
                    },
                    buttonsStyling: false
                }));
              
            swalWithBootstrapButtons.fire({
                title: `¿Estás seguro que deseas terminar la requisición ${item.orden_compra} ? `,
                text: "No podrás revertir esto.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, terminar",
                cancelButtonText: "No, cancelar",
                reverseButtons: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // Realizar la llamada a la API después de confirmar
                    try {
                        apiPutForm(`requisicion/terminar/${item.id}`, item, userAuth.access_token)
                                .then((response) => {
    
                                    swalWithBootstrapButtons.fire({
                                        title: "¡Terminado!",
                                        text: "Tu requisicion ha sido terminado.",
                                        icon: "success"
                                    });
                                
                                    if (reloadTable) {
                                        reloadTable.reload()
                                    }
                                       
                                 
                                })
                                .catch((error) => {
                                    Swal.close()
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'Ha ocurrido un error 1',
                                    })
                                    console.log(error)
                                })      
                       
                    } catch (error) {
                        // Manejar errores de red u otros errores
                        console.error('Error al realizar la llamada a la API:', error);
                        swalWithBootstrapButtons.fire({
                            title: "Error",
                            text: "Hubo un error al procesar la solicitud.",
                            icon: "error"
                        });
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire({
                        title: "Cancelado",
                        text: "Tu archivo imaginario está a salvo :)",
                        icon: "error"
                    });
                    // Puedes agregar lógica adicional al cancelar aquí
                }
            });
            }
          
    };

    return (
        <Button className="btn btn-light-info btn-sm font-weight-bold" color="primary" onClick={handleClick}>
            Terminar
        </Button>
    );
};
    
    

    function reformatDate(dateStr) {
        var dArr = dateStr.split("-");  // ex input: "2010-01-18"
        return dArr[2] + "/" + dArr[1] + "/" + dArr[0]/* .substring(2) */; //ex output: "18/01/10"
    }

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
    //             ...modal,
    //             [tipo]: {
    //                 show: true,
    //                 data: data
    //             }
    //         })
    //     }

    // }
    
    // const handleOpen = [
    //     {
    //         nombre: <div><i className="fas fa-plus mr-5"></i><span>Nuevo</span></div>,
    //         funcion: (item) => { 
    //             setModal({
    //                 ...modal,
    //                 crear: {
    //                     show: true,
    //                     data: item
    //                 }
    //             })
    //         }
    //     },
    //     {
    //         //filtrar
    //         nombre: <div><i className="fas fa-filter mr-5"></i><span>Filtrar</span></div>,
    //         funcion: (item) => {
    //             setModal({
    //                 ...modal,
    //                 filtrar: {
    //                     show: true,
    //                     data: item
    //                 }
    //             })
    //         }
    //     },
    // ]

    // let handleClose = (tipo) => () => {
    //     setModal({
    //         ...modal,
    //         [tipo]: {
    //             show: false,
    //             data: false
    //         }
    //     })
    // }

    // const acciones = [
    //         {
    //             nombre: 'Editar',
    //             icono: 'fas fa-edit',
    //             color: 'blueButton',
    //             funcion: (item) => {
    //                 if (item.data.autorizacion_2 ) {
    //                     Swal.fire({
    //                         title: 'Requisición ya aprobada',
    //                         text: 'La requisición ya fue comprada, no se puede editar',
    //                         icon: 'warning',
    //                         confirmButtonText: 'Aceptar'
    //                     })
    //                 } else {
    //                     setModals({
    //                         ...modals,
    //                         editar: {
    //                             show: true,
    //                             data: item.data
    //                         }
    //                     })
    //                 }
                
    //             }
    //         },  
        
    //         {
    //             nombre: 'Adjuntos',
    //             icono: 'fas fa-paperclip',
    //             color: 'reyButton',
    //             funcion: (item) => {
    //                 setModals({
    //                     ...modals,
    //                     adjuntos: {
    //                         show: true,
    //                         data: item
    //                     }
    //                 })
    //             }
    //         }, 
    //         {
    //             nombre: 'ver',
    //             icono: 'fas fa-paperclip',
    //             color: 'perryButton',
    //             funcion: (item) => {
    //                 setModals({
    //                     ...modals,
    //                     ver: {
    //                         show: true,
    //                         data: item
    //                     }
    //                 })
    //             }
    //         }, 
    //         {
    //             nombre: 'Cancelar',
    //             color: 'redButton',
    //             icono: 'fas fa-trash-alt',
    //             funcion: (item) => {
    //                 if (!item.data.autorizacion_2 ) {
    //                     Swal.fire({
    //                         title: '¿Estas seguro?',
    //                         text: "¡No podrás revertir esto!",
    //                         icon: 'warning',
    //                         showCancelButton: true,
    //                         confirmButtonColor: '#3085d6',
    //                         cancelButtonColor: '#d33',
    //                         cancelButtonText: 'Cancelar',
    //                         confirmButtonText: 'Si, Cancelar'
    //                     }).then((result) => {
    //                         if (result.isConfirmed) {
    //                             try {
    //                                 apiDelete(`requisicion/${item.id}/cancelar`, userAuth.access_token).then(result => {
    //                                     if (reloadTable) {
    //                                         reloadTable.reload()
    //                                     }
    //                                     Swal.fire({
    //                                         title: 'Cancelado!',
    //                                         text: 'La requisición se ha cancelado',
    //                                         icon: 'success',
    //                                         confirmButtonColor: '#3085d6',
    //                                         confirmButtonText: 'Ok',
    //                                         timer: 2000
    //                                     })
    //                                 })
    //                             } catch (error) {

    //                             }
    //                         }
    //                     })
    //                 } else {
    //                     Swal.fire({
    //                         title: 'Requisición ya aprobada',
    //                         text: 'La requisición ya fue comprada, no se puede cancelar',
    //                         icon: 'warning',
    //                         confirmButtonColor: '#3085d6',
    //                         confirmButtonText: 'Ok'
    //                     })
    //                 }
    //             }
    //         },
    //         {
    //             nombre: 'Historial',
    //             icono: 'fas fa-paperclip',
    //             color: 'reyButton',
    //             funcion: (item) => {
    //                 setModals({
    //                     ...modals,
    //                     historial: {
    //                         show: true,
    //                         data: item.data
    //                     }
    //                 })
    //             }
    //         }, 
    //         {
    //             nombre: 'Comentarios',
    //             icono: 'fas fa-paperclip',
    //             color: 'reyButton',
    //             funcion: (item) => {
    //                 setModals({
    //                     ...modals,
    //                     comentarios: {
    //                         show: true,
    //                         data: item.data
    //                     }
    //                 })
    //             }
    //         }, 
    //     ]
    
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
                            <Button sx={{backgroundColor: '#0A3E27',color: '#fff','&:hover': {backgroundColor: '#075633', },}} onClick={() => toggleModal('crearRequi')}variant="contained">
                              Crear Requisicion
                            </Button>                          
                         
                          </Box>
                        )}
                    />
                </Box>
            </Box>
                
            {/* <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='administracion'> */}
             {/* <TablaGeneralPaginado
                titulo="Requisición"
                subtitulo="listado de requisición"
                url={'requisicion'}
                columnas={REQUISICIONES}
                numItemsPagina={50}
                ProccessData={proccessData}
                opciones={handleOpen}
                acciones={acciones}
                reload={setReloadTable} 
                filtros={filtrado}
            /> */}
            {/* </Layout> */}

            <Modal size="xl" title={"Nueva requisición"} show={modals.crearRequi.show}  handleClose={() => toggleModal('crearRequi')}>
                <NuevaRequisicion handleClose={() => toggleModal('crearRequi')} reload={reloadData}/>
            </Modal>
            
            {
                modals.editarReqi?.data &&
                <Modal size = "xl"  title={"Editar requisición"} show={modals.editarReqi?.show}  handleClose={() => toggleModal('editarReqi')}>
                    <EditarRequisicion data={modals.editarReqi?.data}  handleClose={() => toggleModal('editarReqi')} reload={reloadData}/>
                </Modal>
            }

            <Modal size="lg" title={"Adjuntos"} show={modals.adjuntos?.show} handleClose={() => toggleModal('adjuntos')} >
                <Adjuntos data={modals.adjuntos?.data} handleClose={() => toggleModal('adjuntos')} nuevaRequisicion={true} factura={false} />
            </Modal>

            {/* <Modal size="md" title={"ver requisición"} show={modals.ver.show} handleClose={handleClose('ver')}>
                <VerRequisicion data={modals.ver.data} verRequisicion={true}/>
            </Modal> */}

            <Modal size="lg" title={"Historial"} show={modals.historial.show}  handleClose={() => toggleModal('historial')}  >
                <Historial data={modals.historial.data} handleClose={() => toggleModal('historial')} reload={reloadData}/>
            </Modal>

            <Modal size="lg" title={"Comentarios"} show={modals.comentarios.show} handleClose={() => toggleModal('comentarios')} >
                <Comentarios data={modals.comentarios.data}handleClose={() => toggleModal('comentarios')} reload={reloadData}/>
            </Modal>


            {/* <Modal size="lg" title={"Filtrar gastos"} show={modals.filtrar.show}  handleClose={handleClose('filtrar')} >
              <FiltrarRequisiciones handleClose={handleClose('filtrar')}filtrarTabla={setFiltrado} borrarTabla={borrar}  reload={reloadTable}/>
            </Modal> */}

        </>
    )
    
}

export { Requisiciones }