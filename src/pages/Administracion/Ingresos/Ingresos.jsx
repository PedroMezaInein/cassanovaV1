import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import $ from 'jquery'
import S3 from 'react-aws-s3'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { Update } from '../../../components/Lottie'
import { Modal } from '../../../components/singles'
import Layout from '../../../components/layout/layout'
import { IngresosCard } from '../../../components/cards'
import { NewTable } from '../../../components/NewTables'
import { IngresosFilters } from '../../../components/filters'
import { printSwalHeader } from '../../../functions/printers'
import { URL_DEV, INGRESOS_COLUMNS } from '../../../constants'
import { FacturasFormTable } from '../../../components/tables'
import { Form, DropdownButton, Dropdown } from 'react-bootstrap'
import { AdjuntosForm, FacturaExtranjera } from '../../../components/forms'
import { InputGray, CalendarDaySwal, SelectSearchGray, DoubleSelectSearchGray } from '../../../components/form-components'
import { apiOptions, apiGet, apiDelete, apiPostFormData, apiPutForm, catchErrors, apiPostFormResponseBlob } from '../../../functions/api'
import { waitAlert, deleteAlert, doneAlert, createAlertSA2WithActionOnClose, printResponseErrorAlert, customInputAlert, errorAlert, } from '../../../functions/alert'
import { setNaviIcon, setOptions, setDateTableReactDom, setMoneyTable, setArrayTable, setSelectOptions, setTextTableCenter, setTextTableReactDom, setOptionsWithLabel } from '../../../functions/setters'
import { withStyles, makeStyles } from '@material-ui/core/styles';
// import Tooltip from '@material-ui/core/Tooltip';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import TablaGeneralPaginado from './../../../components/NewTables/TablaGeneral/TablaGeneralPaginado'
import { setDateTable } from '../../../functions/setters'
// import Button from '@material-ui/core/Button';
import CrearIngreso from './CrearIngreso'
import FacturasIngresos from './FacturasIngresos'
import AdjuntosIngresos from './AdjuntosIngresos'
import EditarIngreso from './EditarIngreso'
import InputLabel from '@material-ui/core/InputLabel';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'
import Grid from '@material-ui/core/Grid';
import FiltrarIngresos from './FiltrarIngresos'

import { Box, Button, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import { emphasize, styled } from '@mui/material/styles';
import { MaterialReactTable, MRT_ActionMenuItem } from 'material-react-table';
import { Edit, Delete, Settings, MoreVert } from '@mui/icons-material';
import AttachFile from '@mui/icons-material/AttachFile';
import { format } from 'date-fns';
import CircularProgress from '@mui/material/CircularProgress';
import { ContentCopy } from '@mui/icons-material';
import { TextField } from '@mui/material';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';



export default function Ingresos(props) { 
    const auth = useSelector((state) => state.authUser.access_token);
    const authUser = useSelector((state) => state.authUser);
    const [opcionesData, setOpcionesData] = useState()
    const [filtrado, setFiltrado] = useState('') 
    const areaCompras = useSelector(state => state.opciones.ingresos)
    const clientes = useSelector((state) => state.opciones.clientes);
    const empresas = useSelector((state) => state.opciones.empresa);

    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });
    const [totalRows, setTotalRows] = useState(0); // Total de registros
    const [exporting, setExporting] = useState(false);
    const [columnFilters, setColumnFilters] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [reloadTable, setReloadTable] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState(''); // Estado para el filtro global
    const [fechaInicio, setFechaInicio] = useState(''); // Fecha de inicio
    const [fechaFin, setFechaFin] = useState(''); // Fecha de fin

    const [form, setForm] = useState({     
        fecha_fin: '',
        fecha_inicio: '',
        idSeleccionado: '',
        options: {
            formasPago: [],
            metodosPago: [],
            estatusFacturas: [],
            empresas: [],
            clientes: []
        },
        filters: {}
    })

  const [modal, setModal] = useState({
          ver: { show: false, data: null },
          editar: { show: false, data: null },
          crear: { show: false, data: null },
          eliminar: { show: false, data: false },
          filtrar: { show: false, data: null },
          adjuntos: { show: false, data: null },
          facturas: { show: false, data: null }
      });



    useEffect(() => {
        // getProveedores()
        // setFiltrado()
        if (filtrado) {
            reloadTable.reload(filtrado)
            //  setFiltrado('')
            if(borrar == false){
                setFiltrado('')   

            }
        }
    }, [filtrado])

    const borrar = ( id) =>{
        if(id == false){
            reloadTable.reload(filtrado)
            setFiltrado('')   
        }
    }


    const handleOpenMenu = (event, row) => {
        setAnchorEl(event.currentTarget); // Abre el menú en la posición del clic
        setSelectedRow(row); // Guarda los datos de la fila seleccionada
    };

     const handleCloseMenu = () => {
        setAnchorEl(null); // Cierra el menú
        setSelectedRow(null); // Limpia la fila seleccionada
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
    }); 

      const toggleModal = (modalKey, data = null) => {
        setModal((prevModal) => {
            const isOpen = prevModal[modalKey]?.show ?? false;
            return {
                ...prevModal,
                [modalKey]: {
                    show: !isOpen,
                    data: data ?? prevModal[modalKey]?.data // 🔥 Mantiene los datos si se cierra
                },
            };
        });

    };
    
      const renderRowActions = ({ row }) => (
        <>
            <IconButton
                onClick={(event) => handleOpenMenu(event, row.original)}
                sx={{ color: '#F96D49', fontSize: '1.5rem' }}
            >
                <Settings />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                sx={{
                    '& .MuiPaper-root': {
                        boxShadow: 'none',
                        border: 'none',
                    },
                }}
            >

                <MenuItem onClick={() => { toggleModal('editar', selectedRow); handleCloseMenu(); }}
                    sx={{ '&:hover': { backgroundColor: 'primary.light', color: 'white', }, }} >
                    <Edit sx={{ marginRight: '10px', color: 'primary.main' }} />
                    Editar
                </MenuItem>
                {/* <MenuItem
                    onClick={() => {
                        toggleModal('editar', row.original);
                        handleCloseMenu();
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
                </MenuItem> */}

                <MenuItem
                    onClick={() => {
                        toggleModal('adjuntos', selectedRow.id);
                        handleCloseMenu();
                    }}
                    sx={{
                        '&:hover': {
                            backgroundColor: '#E2D1BF',
                            color: 'white',
                        },
                    }}
                >
                    <AttachFile sx={{ marginRight: '10px', color: '#c6b7a9' }} />
                    Adjuntos
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        if (selectedRow?.id) {
                            deleteCompraAxios(selectedRow.id);
                        }
                        handleCloseMenu();
                    }}
                    sx={{
                        '&:hover': {
                            backgroundColor: '#f77c5d',
                            color: 'white',
                        },
                    }}
                >
                    <Delete sx={{ marginRight: '10px', color: '#d65e40' }} />
                    Eliminar
                </MenuItem>

            </Menu>
        </>
    );

    // const columns = [
    //     { nombre: '', identificador: 'acciones', sort: false, stringSearch: false },
    //     { nombre: 'ID', identificador: 'id', stringSearch: false },
    //     { nombre: 'Fecha', identificador: 'fecha', stringSearch: false },
    //     { nombre: 'Cliente', identificador: 'cliente', stringSearch: false },
    //     { nombre: 'Factura', identificador: 'factura', stringSearch: false },
    //     { nombre: 'Área', identificador: 'area', stringSearch: false },
    //     { nombre: 'partida', identificador: 'partida', stringSearch: false },
    //     { nombre: 'Sub-partida', identificador: 'subarea', stringSearch: false },
    //     { nombre: 'Total', identificador: 'total', stringSearch: false },
    //     { nombre: 'Cuenta', identificador: 'cuenta', stringSearch: false },
    //     { nombre: 'Pago', identificador: 'tipoPago', stringSearch: false },
    //     { nombre: 'Impuesto', identificador: 'impuesto', stringSearch: false },
    //     { nombre: 'Descripción', identificador: 'descripcion', stringSearch: false }, //quitar

    //     // { nombre: 'Estatus', identificador: 'estatusCompra', stringSearch: false },
    // ]


    const columns = [
            { header: 'ID', accessorKey: 'id', size: 80 },
            { header: 'Fecha', accessorKey: 'fecha', size: 120 },
            {
                header: 'Cliente',
                accessorKey: 'cliente',
                size: 200,
                Cell: ({ cell }) => (
                    <Tooltip title={cell.getValue()} arrow>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth: '100%' }}>
                            {cell.getValue()}
                        </span>
                    </Tooltip>
                ),
            },
            
            {
            accessorKey: 'factura',
            header: 'Factura',
            size: 130,
            filterFn: 'equals', // compara exacto
            filterSelectOptions: [
                { text: 'Con factura', value: "1" },
                { text: 'Sin factura', value: "0" },
            ],
            filterVariant: 'select', // ← 👈 obligatorio para usar el dropdown
            Cell: ({ row }) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {label(row.original)}
                </div>
            )
            },
            { header: 'Área', accessorKey: 'area', size: 120 },
            { header: 'Partida', accessorKey: 'partida', size: 140 },
            { header: 'Sub-partida', accessorKey: 'subarea', size: 140 },
            {
                header: 'Monto',
                accessorKey: 'monto',
                size: 120,
            },
    
            {
                header: 'Cuenta',
                accessorKey: 'cuenta',
                size: 180,
                Cell: ({ cell }) => (
                    <Tooltip title={cell.getValue()} arrow>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth: '100%' }}>
                            {cell.getValue()}
                        </span>
                    </Tooltip>
                ),
            },
            { header: 'Pago', accessorKey: 'pago', size: 120 },
            { header: 'Impuesto', accessorKey: 'impuesto', size: 130 },
            {
                header: 'Descripción',
                accessorKey: 'descripcion',
                size: 220,
                enableClickToCopy: true,
                muiCopyButtonProps: {
                    fullWidth: true,
                    startIcon: <ContentCopy />,
                    sx: { justifyContent: 'flex-start' },
                },
                Cell: ({ cell }) => (
                    <Tooltip title={cell.getValue()} arrow>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth: '100%' }}>
                            {cell.getValue()}
                        </span>
                    </Tooltip>
                ),
            },
        ];

         useEffect(() => {
                const fetchData = async () => {
                    setIsLoading(true);
                    try {
                        const page = pagination.pageIndex + 1; // Ajusta el índice para Laravel
                        const pageSize = pagination.pageSize;
                        const columnFilterParams = columnFilters.reduce((acc, f) => {
                        // console.log(f.id)
                        if (f.id === 'factura') {
                            acc['egreso_factura'] = String(f.value); // '0' | '1'
                        } else {
                            acc[f.id] = f.value;
                        }
                        // console.log(acc)
                        return acc;
                        }, {});
        
                        const queryString = Object.keys(columnFilterParams)
                        .map((key) => `${key}=${encodeURIComponent(columnFilterParams[key])}`)
                        .join('&');
                        // console.log(`Fetching page: ${pagination.pageIndex + 1}, pageSize: ${pagination.pageSize}`);
                        // console.log(columnFilterParams)
                        // console.log(globalFilter)
                        // console.log(queryString)
                        const response = await apiGet(`v3/administracion/ingresos/ingreso?page=${page}&page_size=${pageSize}&${queryString}`, auth);
        
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
            }, [pagination.pageIndex, pagination.pageSize, globalFilter, columnFilters]);
        
            useEffect(() => {
                if (!modal.crear.show && !modal.editar.show && !modal.adjuntos.show) {
                    reloadData();
                }
            }, [modal.crear.show, modal.editar.show, modal.adjuntos.show]);
        


      const processData = (datos) => {
            const formatMonto = (monto) => {
                if (!monto) return 's/i';
                return new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                    minimumFractionDigits: 2,
                }).format(monto);
            };
    
            return datos.map((dato) => {
    
                const comisionReal = parseFloat(dato.comision) || 0;
                // console.log(dato)
    
                return {
                    id: dato.id,
                    fecha: dato.created_at ? format(new Date(dato.created_at), 'yyyy/MM/dd') : 's/i',
                    monto: formatMonto(dato.total),  // ✅ Aquí se refleja monto + comisión
                    area: dato.area?.nombre || 's/i',
                    partida: dato.partidas?.nombre || 's/i',
                    subarea: dato.subarea?.nombre || 's/i',
                    cuenta: dato.cuenta ? `${dato.cuenta.nombre} (${dato.cuenta.numero || dato.cuenta.numero_cuenta || 's/n'})` : 's/i',
                    pago: dato.tipo_pago?.tipo || 's/i',
                    impuesto: dato.tipo_impuesto?.tipo || 's/i',
                    descripcion: dato.descripcion || 'N/A',
                    cliente: dato.cliente?.empresa || 'N/A',
                    requisicion: dato.id_requisiciones || 'N/A',
                    factura: dato.factura ,
                    tipo: dato.tipo === 'nacional' ? 'FN' : dato.tipo === 'extranjera' ? 'CE' : '',
                    empresa: dato?.empresa?.name || 's/i',
                    data: dato,
                };
            });
        };

    // const deleteCompraAxios = (id) => {
    //     apiDelete(`ingresos/${id}`, auth).then(
    //         (response) => {
    //             Swal.fire( 
    //                 '¡Eliminado!',
    //                 'El Ingreso ha sido eliminado.',
    //                 'success'
    //             )                
    //             if (reloadTable) {
    //                 reloadTable.reload()
    //             }
    //         }, (error) => { }
    //     ).catch((error) => { catchErrors(error) })
    // }

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
                    if (authUser.user.tipo.tipo === 'Administrador') {
                        apiDelete(`ingresos/${id}`, auth)
                            .then(() => {
                                Swal.fire('¡Eliminado!', 'La venta ha sido eliminada.', 'success');
                                reloadData(); // 👈 Asegúrate de tener esta función o cámbiala por fetchVentas()
                                setData((prevData) => prevData.filter((item) => item.id !== id));
                            })
                            .catch((error) => {
                                console.error(error);
                                Swal.fire('Error', 'No se pudo eliminar el ingreso.', 'error');
                            });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'No tienes permiso',
                            text: 'Lo sentimos, no tienes permiso para borrar esta venta.',
                            showConfirmButton: false,
                            timer: 4000,
                        });
                    }
                }
                // if (result.isConfirmed) {
                //     apiDelete(`ventas/${id}`, auth)
                //         .then(() => {
                //             Swal.fire('¡Eliminado!', 'La venta ha sido eliminada.', 'success');
                //             reloadData(); // o fetchVentas()
                //             setData((prevData) => prevData.filter((item) => item.id !== id));
                //         })
                //         .catch((error) => {
                //             console.error(error);
                //             Swal.fire('Error', 'No se pudo eliminar la venta.', 'error');
                //         });
                // }
    
    
            });
        };
    
    const reloadData = async () => {
            setIsLoading(true);
            try {
                const page = pagination.pageIndex + 1;
                const pageSize = pagination.pageSize;
    
                const response = await apiGet(
                    `v3/administracion/ingresos/ingreso?page=${page}&page_size=${pageSize}`,
                    auth
                );
    
                const { data: tableData, total } = response.data.data;
    
                setData(processData(tableData)); // Procesa y actualiza la tabla con los datos
                setTotalRows(total); // Total de registros para paginación
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudieron cargar las ventas.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

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
    //         nombre: 'Ver ingreso',
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
    //             openModal('adjuntos', item)
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
    //     // {
    //     //     nombre: 'Factura extranjera',
    //     //     icono: 'fas fa-file-invoice',
    //     //     color: 'perryButton',
    //     //     funcion: (item) => {
    //     //         openModal('facturas_estra', item)
    //     //     }
    //     // },
    //     {
    //         nombre: 'Eliminar',
    //         icono: 'fas fa-trash-alt',
    //         color: 'redButton',
    //         funcion: (item) => {
    //             authUser.user.tipo.tipo === 'Administrador' ?
    //             Swal.fire({
    //                 title: '¿Estás seguro?',
    //                 text: "¡No podrás revertir esto!",
    //                 icon: 'warning',
    //                 showCancelButton: true,
    //                 confirmButtonColor: '#3085d6',
    //                 cancelButtonColor: '#d33',

    //                 cancelButtonText: 'Cancelar',
    //                 confirmButtonText: 'Sí, bórralo',
    //             }).then((result) => {
    //                 if (result.isConfirmed) {
    //                     deleteCompraAxios(item.id)
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
    // ]

    // if (proyecto.bitacora) {
    //     handleOpen.push({
    //         nombre: 'ver bitácora',
    //         funcion: (item) => {
    //             window.open(proyecto.bitacora, '_blank');
    //         }
    //     });
    // } 

    // const  exportEgresosAxios = () => {
    //     if(fechaFin && fechaInicio){

    //         Swal.fire({
    //             icon: 'success',
    //             title: 'Descargar compra',
    //             text: 'Exportando compras espere...',
    //             showConfirmButton: false,
    //             timer: 4000
    //         })
            
    //         apiPostFormResponseBlob(`v3/administracion/ingresos/exportar`,{ columnas: form },  auth).then(
    //             (response) => {
    //                 const url = window.URL.createObjectURL(new Blob([response.data]));
    //                 const link = document.createElement('a');
    //                 link.href = url;
    //                 link.setAttribute('download', 'ingresos.xlsx');
    //                 document.body.appendChild(link);
    //                 link.click();
    //                 doneAlert(
    //                     response.data.message !== undefined ? 
    //                         response.data.message 
    //                     : 'Ingresos exportadas con éxito.'
    //                 )
    //                 setModal({
    //                     ...modal,
    //                     ['exportar']: {
    //                         show: false,
    //                         data: null
    //                     }
    //                 })
    //             }, (error) => { printResponseErrorAlert(error) }
    //         ).catch((error) => { catchErrors(error) })

    //     }else{
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Campos obligatorios',
    //             text: 'Por favor, completa las fechas de inicio y fin.',
    //         });
    //         return; // Detén la función si los campos están vacíos


    //     }
    // }

      const exportEgresosAxios = async () => {
      if (!fechaInicio || !fechaFin) {
        Swal.fire('Error', 'Por favor selecciona ambas fechas.', 'error');
        return;
      }
    
      setExporting(true);
    
      // Loader bloqueante
      Swal.fire({
        title: 'Generando Excel',
        html: 'Tu archivo se está preparando…',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });
    
      try {
        const form = { fecha_inicio: fechaInicio, fecha_fin: fechaFin };
    
        const response = await apiPostFormResponseBlob(
          `v3/administracion/ingresos/exportar`,
          { columnas: form },
          auth,
          {
            onDownloadProgress: (e) => {
              if (e?.total) {
                const pct = Math.round((e.loaded * 100) / e.total);
                Swal.update({ html: `Descargando… ${pct}%` });
              }
            },
          }
        );
    
        // Cierra loader y modal antes de descargar
        if (Swal.isVisible()) Swal.close();
        toggleModal('exportar', false);
    
        // Nombre de archivo desde headers (si viene)
        const cd = response.headers?.['content-disposition'];
        const match = cd && /filename\*?=(?:UTF-8'')?("?)([^";]+)\1/.exec(cd);
        const fileName = (match && decodeURIComponent(match[2])) || 'Ingresos.xlsx';
    
        // Dispara la descarga
        const blob = new Blob(
          [response.data],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    
        // Toast corto
        Swal.fire({
          icon: 'success',
          title: 'Descarga iniciada',
          timer: 1600,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
    
        // Limpia fechas si quieres
        setFechaInicio('');
        setFechaFin('');
      } catch (error) {
        if (Swal.isVisible()) Swal.close();
        console.error(error);
        Swal.fire('Error', 'No se pudo exportar los datos.', 'error');
      } finally {
        setExporting(false);
      }
    };


    const opciones = [
        {
            nombre: <div><i className="fas fa-plus mr-5"></i><span>Nuevo</span></div>,
            funcion: (item) => {
                openModal('crear', item)
            }
        },
        {
            //filtrar
            nombre: <div><i className="fas fa-filter mr-5"></i><span>Filtrar</span></div>,
            funcion: (item) => {
                openModal('filtrar', item)
            }
        },
        {
            //exportar
            nombre: <div><i className="fas fa-file-export mr-5"></i><span>Exportar</span></div>,
            funcion: (item) => {
                openModal('exportar', item)

                // exportEgresosAxios(item.id)

            }
        },
    ]

    const openModal = (tipo, data) => {
            form.fecha_inicio = ''
            form.fecha_fin = ''
        if(data.factura == 'Sin factura' && tipo == 'facturas'){
            Swal.fire({
                icon: 'error',
                title: 'No tiene facura',
                text: 'El registro es sin factura',
                showConfirmButton: false,
                timer: 1500
            })
            
        }else{
            setModal({
                ...modal,
                [tipo]: {
                    show: true,
                    data: data
                }
            })
        }
    }

    const handleClose = (tipo) => {
        setModal({
            ...modal,
            [tipo]: {
                show: false,
                data: null
            }
        })
    }

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };


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
        apiOptions(`v2/administracion/egresos`, auth)
            .then(res => {
                let data = res.data

                let aux = {
                    cuentas: [],
                    empresas: [],
                    estatusCompras: [],
                    proveedores: [],
                    tiposImpuestos: [],
                    tiposPagos: [],
                }

                data.proveedores.map((proveedor) => {
                    if (proveedor.razon_social !== null) {
                        aux.proveedores.push({
                            id: proveedor.id,
                            name: proveedor.razon_social,
                            rfc: proveedor.rfc,
                        })   
                    }  
                })

                data.empresas.map((empresa) => {
                    if (empresa.nombre !== null) {
                        aux.empresas.push({
                            id: empresa.id,
                            name: empresa.name,
                            rfc: empresa.rfc,
                            cuentas: empresa.cuentas,
                        })
                    }
                })

                data.estatusCompras.map((estatusCompra) => {
                    if (estatusCompra.estatus !== null) {
                        aux.estatusCompras.push({
                            id: estatusCompra.id,
                            name: estatusCompra.estatus,
                        })
                    }
                })

                data.tiposImpuestos.map((tipoImpuesto) => {
                    if (tipoImpuesto.tipo !== null) {
                        aux.tiposImpuestos.push({
                            id: tipoImpuesto.id,
                            name: tipoImpuesto.tipo,
                        })
                    }
                })

                data.tiposPagos.map((tipoPago) => {
                    if (tipoPago.tipo !== null) {
                        aux.tiposPagos.push({
                            id: tipoPago.id,
                            name: tipoPago.tipo,
                        })
                    }
                })

                Swal.close()
                setOpcionesData(aux)
                // setProveedoresData(aux);

            }
        )
    }

    const formatNumber = (num) => {
        return `$${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    // const proccessData = (datos) => { 

    //     let aux = []
    //     datos.data.data.map((dato) => {
    //         aux.push({
    //             data: dato,
    //             id: dato.id ? dato.id : 's/i',
    //             fecha: dato.created_at ? setDateTable(dato.created_at) : 's/i',
    //             // monto: dato.monto ? formatNumber(dato.monto) : 's/i',
    //             area: dato.area ?  dato.area.nombre : 's/i',
    //             cliente: dato.cliente ? dato.cliente.empresa : 'N/A', 
    //             partida: dato.partidas ? dato.partidas.nombre : 's/i',
    //             subarea: dato.subarea ? dato.subarea.nombre : 's/i',
    //             tipoPago: dato.tipo_pago ? dato.tipo_pago.tipo : 's/i',
    //             cuenta: dato.empresa ? dato.empresa.name : 's/i',
    //             pago: dato.tipo_pago.tipo ? dato.tipo_pago.tipo : 's/i',
    //             impuesto: dato.tipo_impuesto.tipo ? dato.tipo_impuesto.tipo : 's/i',
    //             total: dato.total ? formatNumber(dato.total) : 's/i',
    //             descripcion: dato.descripcion ? descripcion(dato.descripcion) : 'N/A',
    //             // // factura: dato.factura ? 'Con factura' : 'Sin factura',
    //             factura:label(dato),  
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


      const label = (dato) => {
             const data = dato?.data || {};
             const tieneFactura = data.factura === 1;
             // Verifica si hay alguna factura asociada
             const hayFacturas = 
               Array.isArray(data.facturas) && data.facturas.length > 0 ||
               Array.isArray(data.factura) && data.factura.length > 0 ||
               Array.isArray(data.facturas_pdf) && data.facturas_pdf.length > 0;
       
             return (
               <div title={tieneFactura ? 'Con factura' : 'Sin factura'}>
                 {
                   tieneFactura ? (
                     hayFacturas ? (
                       <span style={{ color: 'green' }}>
                         <RequestQuoteIcon />
                       </span>
                     ) : (
                       <span style={{ color: 'red' }}>
                         <RequestQuoteIcon />
                       </span>
                     )
                   ) : (
                     <span>
                       <DescriptionOutlinedIcon />
                     </span>
                   )
                 }
               </div>
             );
           };

    return (
        <>
        <Layout active="administracion" {...props}>

            {/* <TablaGeneralPaginado
                titulo="ingresos"
                subtitulo="listado de ingresos"
                url={`v3/administracion/ingresos/ingreso`}
                //url={'v3/proyectos/compra'}
                columnas={columns}
                numItemsPagina={50}
                ProccessData={proccessData}
                opciones={opciones}
                acciones={acciones}
                reload={setReloadTable} 
                filtros={filtrado}
            /> */}

            <Box sx={{ padding: "20px" }}>
                {/* 🏠 Breadcrumbs: Rastro de Navegación */}
            <Box mb={2}>
                <Breadcrumbs aria-label="breadcrumb">
                    <StyledBreadcrumb component="a" href="#" label="Home" icon={<HomeIcon fontSize="small" />} />
                    <StyledBreadcrumb component="a" href="#" label="Administacion" />
                    <StyledBreadcrumb component="a" href="#" label="Ingresos" />
                </Breadcrumbs>
            </Box>

            {/* 📌 Contenedor para los Botones y la Tabla */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                        sx: { maxHeight: '600px' },
                    }}
                    paginationDisplayMode="pages"
                    initialState={{
                        initialState: { pagination: { pageSize: 50, pageIndex: 1 } },
                        density: 'compact',
                    }}
                    enableRowActions
                    renderTopToolbarCustomActions={({ table }) => (
                        <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
                            <Button sx={{ backgroundColor: '#0A3E27', color: '#fff', '&:hover': { backgroundColor: '#075633' } }}
                                onClick={() => toggleModal('crear')}
                                variant="contained"
                            >
                                Crear Nuevo
                            </Button>
                            <Button
                                sx={{ backgroundColor: '#457FF4', color: '#fff', '&:hover': { backgroundColor: '#568eff' } }}
                                onClick={() => toggleModal('exportar', true)}
                                variant="contained"
                                disabled={exporting}
                                startIcon={exporting ? <CircularProgress size={16} /> : null}
                            >
                                {exporting ? 'Exportando…' : 'Exportar Ingresos'}
                            </Button>
                        </Box>
                    )}
                />
            </Box>
        </Box>
        </Layout>
        <Modal size="xl" title="Nueva ingreso" show={modal.crear.show} handleClose={() => toggleModal('crear')}>
        {/* <Modal size="lg" title={"Nuevo ingreso"} show={modal.crear?.show} handleClose={e => handleClose('crear')} > */}
            <CrearIngreso handleClose={() => toggleModal('crear')} reload={reloadTable} opcionesData={opcionesData} getProveedores={getProveedores}/> 
        </Modal>

        {/* {
                modal.filtrar.data &&
                <Modal size="lg" title={"Filtrar gastos"} show={modal.filtrar?.show} handleClose={e => handleClose('filtrar')} >
                    <FiltrarIngresos handleClose={e => handleClose('filtrar')} opcionesData={opcionesData} filtrarTabla={setFiltrado} borrarTabla={borrar}  reload={reloadTable}/>
                </Modal>
            } */}

        {
            modal.facturas?.data &&
                <Modal size="xl" title="Facturas" show={modal.facturas.show} handleClose={() => toggleModal('facturas')}>
                {/* <FacturasIngresos handleClose={e => handleClose('facturas')} opcionesData={opcionesData} reload={reloadTable} compra={modal.facturas?.data?.data}/> */}
                <FacturasIngresos handleClose={() => toggleModal('facturas')} opcionesData={opcionesData} reload={reloadTable} compra={modal.facturas.data} />
            
            </Modal>
        }
        {
            modal.adjuntos?.data &&
                <Modal size="lg" title="Adjuntos" show={modal.adjuntos.show} handleClose={() => toggleModal('adjuntos')}>
            {/* <Modal size="lg" title={"adjuntos"} show={modal.adjuntos?.show} handleClose={e => handleClose('adjuntos')} > */}
                {/* <AdjuntosIngresos handleClose={e => handleClose('adjuntos')} opcionesData={opcionesData} reload={reloadTable} data={modal.adjuntos?.data?.data}/> */}
                {/* <AdjuntosIngresos handleClose={() => toggleModal('adjuntos')} opcionesData={opcionesData} reload={reloadTable} data={modal.adjuntos.data} /> */}
                <AdjuntosIngresos handleClose={() => toggleModal('adjuntos')} opcionesData={opcionesData} reload={reloadTable} data={modal.adjuntos.data} />
    
        </Modal>
        }

        {
            modal.editar?.data &&
            <Modal size="xl" title="Editar Ingreso" show={modal.editar.show} handleClose={() => toggleModal('editar')}>
                <EditarIngreso handleClose={e => handleClose('editar')} opcionesData={opcionesData} reload={reloadTable} data={modal.editar?.data?.data}/>
            </Modal>
        }

         <Modal
            size="md"
            title="Exportar Ventas"
            show={modal.exportar?.show}
            handleClose={() => toggleModal('exportar', false)}
        >
            <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'grid', gap: 2 }}>
                <TextField
                label="Fecha Inicio"
                type="date"
                fullWidth
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                InputLabelProps={{ shrink: true }}
                />
                <TextField
                label="Fecha Fin"
                type="date"
                fullWidth
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                InputLabelProps={{ shrink: true }}
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                <Button
                onClick={() => toggleModal('exportar', false)}
                color="secondary"
                variant="outlined"
                disabled={exporting}
                >
                Cancelar
                </Button>
                <Button
                onClick={exportEgresosAxios}
                color="primary"
                variant="contained"
                disabled={exporting}
                startIcon={exporting ? <CircularProgress size={16} /> : null}
                >
                {exporting ? 'Exportando…' : 'Exportar'}
                </Button>
            </Box>
            </Box>
        </Modal>

{
                // modal.exportar.data &&
                // <Modal size="lg" title={"Exportar compras"} show={modal.exportar?.show} handleClose={e => handleClose('exportar')} >
                //     {/* <Filtrar handleClose={e => handleClose('filtrar')} opcionesData={opcionesData} filtrarTabla={setFiltrado} borrarTabla={borrar}  reload={reloadTable}/> */}
                //         <div className="form-group form-group-marginless  mx-0">
                //                 <br></br> 
                //             <div className="row">
                //             <div className="col-md-3">
                //             </div> 

                //                 <div className="col-md-3">
                //                     <InputLabel >FECHA INICIAL</InputLabel>
                //                     <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                //                         <Grid container >
                //                             <KeyboardDatePicker

                //                                 format="dd/MM/yyyy"
                //                                 name="fecha_inicio"
                //                                 value={form.fecha_inicio !== '' ? form.fecha_inicio : null}
                //                                 placeholder="dd/mm/yyyy"
                //                                 onChange={e => handleChangeFecha(e, 'fecha_inicio')} 
                //                                 KeyboardButtonProps={{
                //                                     'aria-label': 'change date',
                //                                 }}
                //                             />
                //                         </Grid>
                //                     </MuiPickersUtilsProvider>
                //                 </div> 

                //                 <div className="col-md-3">
                //                     <InputLabel >FECHA FINAL</InputLabel>
                //                     <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                //                         <Grid container >
                //                             <KeyboardDatePicker

                //                                 format="dd/MM/yyyy"
                //                                 name="fecha_fin"
                //                                 value={form.fecha_fin !== '' ? form.fecha_fin : null}
                //                                 placeholder="dd/mm/yyyy"
                //                                 onChange={e => handleChangeFecha(e, 'fecha_fin')} 
                //                                 KeyboardButtonProps={{
                //                                     'aria-label': 'change date',
                //                                 }}
                //                             />
                //                         </Grid>
                //                     </MuiPickersUtilsProvider>
                //                 </div>     
                //             </div>
                //             <br></br> 

                //             <div className=" row ">
                //                 <div className="col-md-6"> 
                //                 </div>
                //                 <div className="col-md-6">
                //                     <Button variant="contained" color="primary" onClick={exportEgresosAxios}>Exportar</Button>
                //                 </div>
                //             </div>

                //         </div>
                // </Modal>
            }




                
        </>
    )

}