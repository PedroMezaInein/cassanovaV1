import React, { useState, useEffect } from 'react'
import {useSelector} from 'react-redux'
import Swal from 'sweetalert2'

import { Modal } from '../../../components/singles'

import TablaGeneral from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import TablaGeneralPaginado from '../../../components/NewTables/TablaGeneral/TablaGeneralPaginado'
import { apiDelete } from './../../../functions/api'

import Convertir from './Modales/Convertir'
import Editar from './Modales/Editar'
import Adjuntos from './Modales/Adjuntos'
import Ver from './Modales/Ver'
import Crear from './../../../components/forms/administracion/NuevaRequisicion'
import FiltrarRequisicionesCompras from './FiltrarRequisicionesCompras'

import { apiOptions, apiPutForm, apiGet } from '../../../functions/api'
import { setOptions } from '../../../functions/setters'

import useOptionsArea from '../../../hooks/useOptionsArea'
import StatusIndicator from './utils/StatusIndicator'
import Autoriza from '../../../components/forms/administracion/Autorizar'
import Historial from '../../../components/forms/administracion/Historial'
import Comentarios from '../../../components/forms/administracion/comentarios'

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
import { History, Comment } from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

// import Layout from '../../../components/layout/layout'

export default function RequisicionCompras() { 
    const userAuth = useSelector((state) => state.authUser);
    const [reloadTable, setReloadTable] = useState()
    const [opcionesApi, setOpcionesApi] = useState(false)
    const [estatusCompras, setEstatusCompras] = useState(false)
    const [filtrado, setFiltrado] = useState('') 
    const [modal, setModal] = useState({
        convertir: {
            show: false,
            data: false
        },
        editar: {
            show: false,
            data: false
        },
        crear: {
            show: false,
            data: false
        },
        adjuntos: {
            show: false,
            data: false
        },
        ver: {
            show: false,
            data: false
        },
        filtrar: {
            show: false,
            data: false
        },
        autoriza: {
            show: false,
            data: false
        },
        historial:{
            show: false,
            data: false
        },
        comentarios:{
            show: false,
            data: false
        },
    })
        const auth = useSelector((state) => state.authUser.access_token);
        const authUser = useSelector((state) => state.authUser);
        const [modals, setModals] = useState({
            crear: { show: false, data: null },
            convertir: { show: false, data: null },
            editar: { show: false, data: null },
            adjuntos: { show: false },
            autoriza: { show: false, data: null },  
            historial: { show: false, data: null },    
            comentarios: { show: false, data: null },    
  
        });
        const [isLoading, setIsLoading] = useState(true);
        const [data, setData] = useState([]);
        const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });
        const [totalRows, setTotalRows] = useState(0); // Total de registros
    
        const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
        const [fechaInicio, setFechaInicio] = useState(''); // Fecha de inicio
        const [fechaFin, setFechaFin] = useState(''); // Fecha de fin
        const [globalFilter, setGlobalFilter] = useState(''); // Estado para el filtro global
        const [columnFilters, setColumnFilters] = useState([]);
        const [ModalCreateOpen, setModalCreateOpen] = useState(false); // Estado para el modal crear
        const [anchorEl, setAnchorEl] = useState(null);
        const [selectedRow, setSelectedRow] = useState(null);
   
    useEffect(() => {
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

    useEffect(() => {
        reloadData()
        getOpciones()
    }, [])

    useOptionsArea() 

    // const columnas = [
    //     { nombre: 'Acciones', identificador: 'acciones' },
    //     { nombre: 'Orden no.', identificador: 'orden_compra', sort: false, },
    //     { nombre: 'Presupuesto', identificador: 'presupuesto', sort: false, },
    //     { nombre: 'Solicitante', identificador: 'solicita', sort: false, stringSearch: false },
    //     { nombre: 'Fecha', identificador: 'fecha_view', sort: false, stringSearch: false },
    //     // userAuth.user.tipo.tipo === 'Administrador' ? 
    //     // { nombre: 'Fecha solicitud', identificador: 'solicitud', sort: false, stringSearch: false } : '',
   
    //     { nombre: 'Departamento', identificador: 'departamento', sort: false, stringSearch: false },
    //     { nombre: 'Tipo de Egreso', identificador: 'tipoEgreso', sort: false, stringSearch: false },
    //     /* { nombre: 'Descripción', identificador: 'descripcion', sort: false, stringSearch: false }, */
    //     { nombre: 'Tipo de pago (*)', identificador: 'tipoPago', sort: false, stringSearch: false },
    //     { nombre: 'Monto solicitado (*)', identificador: 'monto_view', sort: false, stringSearch: false },
    //     { nombre: 'Estatus', identificador: 'estatus', sort: false, stringSearch: false },
    //     { nombre: 'Factura', identificador: 'factura',  sort: false, stringSearch: false },
    //     /* { nombre: 'E. Compra', identificador: 'estatus_compra', sort: false, stringSearch: false },
    //     { nombre: 'E. Conta', identificador: 'estatus_conta', sort: false, stringSearch: false }, */
    //     { nombre: 'Estatus', identificador: 'semaforo', sort: false, stringSearch: false },
    //     /* { nombre: 'Aprobación', identificador: 'aprobacion', sort: false, stringSearch: false }, */
    // ]

    // const opciones = [
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
    //     {
    //         //filtrar
    //         nombre: <div><i className="fas fa-filter mr-5"></i><span>Autorizar</span></div>,
    //         funcion: (item) => {
    //             setModal({
    //                 ...modal,
    //                 autoriza: {
    //                     show: true,
    //                     data: item
    //                 }
    //             })
    //         }
    //     },
    // ]

    //funcion para dar formato a los numeros con comas y dos decimales sin redondear
    const formatNumber = (num) => {
        return `$${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    // let ProccessData = (data) => {
    //     let aux = []
    //     data.data.data.map((item, index) => {
    //         // console.log(aux)
    //         aux.push({
    //             id: item.id,
    //             acciones: createAcciones(),
    //             solicita: item.solicitante.name,
    //             solicitante_id: item.solicitante.id,
    //             fecha: item.fecha,
    //             fecha_view: reformatDate(item.fecha),
    //             departamento: item.departamento ? item.departamento.nombre : null,
    //             departamento_id: item.departamento ? item.departamento.id : null, 
    //             tipoEgreso: item.gasto ? item.gasto.nombre : 'no definido',
    //             tipoEgreso_id: item.gasto ? item.gasto.id : null,
    //             tipoSubEgreso: item.subarea ? item.subarea.nombre : 'No definido',
    //             tipoSubEgreso_id: item.subarea ? item.subarea.id : null,
    //             descripcion: item.descripcion,
    //             tipoPago: item.pago ? item.pago.tipo : 'No definido',
    //             tipoPago_id: item.pago ? item.pago.id : null,
    //             monto_solicitado: item.cantidad,
    //             monto: item.monto_pago,
    //             monto_view: formatNumber(item.cantidad),
    //             estatus: item.estatus ? item.estatus.estatus : 'Pendiente',
    //             aprobacion: createtagaprobaciones(item),
    //             auto1: item.auto1,
    //             auto2: item.auto2,
    //             orden_compra: item.orden_compra,
    //             fecha_pago: item.fecha_pago,
    //             cuenta: item.cuenta,
    //             id_estatus: item.id_estatus_compra ? item.id_estatus_compra : null,
    //             proveedor: item.id_proveedor ? item.id_proveedor : null,
    //             /* estatus_admin: item.estatus_admin ? item.estatus_admin : 'Pendiente', */
    //             estatus_compra: item.estatus_compra ? item.estatus_compra.estatus : 'pendiente',
    //             estatus_conta: item.estatus_conta ? item.estatus_conta.estatus : 'pendiente',
    //             /* id_estatus_admin: item.id_estatus_admin ? item.id_estatus_admin : null, */
    //             id_estatus_compra: item.id_estatus_compra ? item.id_estatus_compra : null,
    //             id_estatus_conta: item.id_estatus_conta ? item.id_estatus_conta : null,
    //             fecha_entrega: item.fecha_entrega ? item.fecha_entrega : null,
    //             conta: item.estatus_conta ? item.estatus_conta.id : null,
    //             factura: item.facturas == 1 ? 'Con Factura' : 'Sin Factura' ,
    //             semaforo: createStatusIndicator(item),
    //             presupuesto: item.presu ? item.presu.nombre: '',
    //             solicitud: item.created_at ? reformatDates(item.created_at) : '',
    //             data:item,
    //         })
    //     })
    //     // aux = aux.reverse()
    //     return aux
    // }
    const reformatDates = (dateString) => {
        const dateObject = new Date(dateString);
        const day = dateObject.getDate();
        const month = dateObject.getMonth() + 1; // Months are zero-based
        const year = dateObject.getFullYear();

        // Ensure leading zeros for single-digit days and months
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;

        return `${formattedDay}-${formattedMonth}-${year}`;
      };

    function reformatDate(dateStr) {
        var dArr = dateStr.split("-");  // ex input: "2010-01-18"
        return dArr[2] + "/" + dArr[1] + "/" + dArr[0]/* .substring(2) */; //ex output: "18/01/10"
    }

    const createStatusIndicator = (item) => {
        return (
            <StatusIndicator data={item}/>
        )
    }

    let createtagaprobaciones = (item) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {item.auto1 ? <span style={{ color: 'green' }}>{ item.auto1.name}</span> : <span style={{ color: 'orange' }}>Pendiente</span>}
            </div>
        )
    }

    const createAcciones = () => {
        let aux = [
            {
                nombre: 'Convertir',
                icono: 'fas fa-exchange-alt',
                color: 'greenButton',
                funcion: (item) => {
                    if( item.id_estatus == 12){
                        Swal.fire({
                            title: 'Requisición esta cancelada',
                            text: 'La requisición ya fue cancelada, no se puede convertir',
                            icon: 'warning',
                            confirmButtonText: 'Aceptar'
                        })
                    }else
                    if (item.auto1) {
                        Swal.fire({
                            title: 'Requisición ya aprobada',
                            text: 'La requisición ya fue aprobada, no se puede convertir',
                            icon: 'warning',
                            confirmButtonText: 'Aceptar'
                        })   
                    } else {
                        setModal({
                            ...modal,
                            convertir: {
                                show: true,
                                data: item
                            }
                        })    
                    }
                    
                }
            },
            {
                nombre: 'Editar',
                icono: 'fas fa-edit',
                color: 'blueButton',
                funcion: (item) => {
                    if( item.id_estatus == 12){
                        Swal.fire({
                            title: 'Requisición esta cancelada',
                            text: 'La requisición ya fue cancelada, no se puede convertir',
                            icon: 'warning',
                            confirmButtonText: 'Aceptar'
                        })
                    }else
                    if (item.auto2 && item.id_estatus_compra == 11 ) {
                        Swal.fire({
                            title: 'Requisición ya aprobada',
                            text: 'La requisición ya fue aprobada, no se puede convertir',
                            icon: 'warning',
                            confirmButtonText: 'Aceptar'
                        })
                    } else 
                    {
                        setModal({
                            ...modal,
                            editar: {
                                show: true,
                                data: item
                            }
                        })

                    }
                }
            },
            {
                nombre: 'Adjuntos',
                icono: 'fas fa-paperclip',
                color: 'blueButton',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        adjuntos: {
                            show: true,
                            data: item
                        }
                    })
                }
            },
            {
                nombre: 'Ver',
                icono: 'fas fa-eye',
                color: 'blueButton',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        ver: {
                            show: true,
                            data: item
                        }
                    })
                }
            },
            {
                nombre: 'Historial',
                icono: 'fas fa-paperclip',
                color: 'reyButton',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        historial: {
                            show: true,
                            data: item.data
                        }
                    })
                }
            }, 
            {
                nombre: 'Comentarios',
                icono: 'fas fa-paperclip',
                color: 'reyButton',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        comentarios: {
                            show: true,
                            data: item.data
                        }
                    })
                }
            }, 
            // {
            //     nombre: 'Autorizar',
            //     color: 'perryButton',
            //     icono: 'fas fa-check',
            //     funcion: (item) => {
            //         if (userAuth.user.tipo.tipo === 'Administrador') {            

            //             // if (!item.estatus) {
            //                 Swal.fire({
            //                     title: '¿Estas seguro?',
            //                     text: "¡No podrás revertir esto!",
            //                     icon: 'warning',
            //                     showCancelButton: true,
            //                     confirmButtonColor: '#3085d6',
            //                     cancelButtonColor: '#d33',
            //                     cancelButtonText: 'Cancelar',
            //                     confirmButtonText: 'Si, autorizar'
            //                 }).then((result) => {
            //                     if (result.isConfirmed) {
            //                         Swal.fire({
            //                             title: 'autorizando',
            //                             text: 'Espere un momento...',
            //                             allowOutsideClick: false,
            //                             allowEscapeKey: false,
            //                             allowEnterKey: false,
            //                             showConfirmButton: false,
            //                             onOpen: () => {
            //                                 Swal.showLoading()
            //                             }
            //                         })
            //                         try {
            //                             apiPutForm(`requisicion/${item.id}/autorizar`, { aprobado: 1 }, userAuth.access_token).then(result => {
            //                                 Swal.close()
            //                                 Swal.fire(
            //                                     '¡Autorizado!',
            //                                     'El presupuesto ha sido Autorizado.',
            //                                     'success'
            //                                 )
            //                                 setTimeout(() => {
            //                                     Swal.fire({
            //                                         title: 'Presupuesto aprobado',
            //                                         text: 'El presupuesto fue aprobado exitosamente.',
            //                                         icon: 'success',
            //                                         confirmButtonColor: '#3085d6',
            //                                         confirmButtonText: 'Ok'
            //                                     });
            //                                 }, 2000);
            //                                 if (reloadTable) {
            //                                     reloadTable.reload()
            //                                 }

            //                             })
            //                         } catch (error) {
            //                             Swal.close()
            //                             Swal.fire(
            //                                 '¡Error!',
            //                                 'El presupuesto no ha sido Autorizado.',
            //                                 'error'
            //                             )

            //                         }

            //                     }
            //                 })
            //             // } else {
            //             //     Swal.fire({
            //             //         title: 'Presupuesto ya autorizado',
            //             //         text: "¡El presupuesto ya ha sido autorizado!",
            //             //         icon: 'error',
            //             //         confirmButtonColor: '#3085d6',
            //             //         confirmButtonText: 'Ok'
            //             //     })
            //             // }

            //         } else {
            //             Swal.fire({
            //                 title: '¡No tienes permisos!',
            //                 text: "¡No tienes permisos para aprobar el presupuesto!",
            //                 icon: 'error',
            //                 confirmButtonColor: '#3085d6',
            //                 confirmButtonText: 'Ok'
            //             })
            //         }
            //     }
            // },
            {
                nombre: 'Cancelar',
                color: 'redButton',
                icono: 'fas fa-trash-alt',
                funcion: (item) => {
                    // if (userAuth.user.tipo.tipo === 'Administrador') {
                        if( item.id_estatus == 12){
                            Swal.fire({
                                title: 'Requisición esta cancelada',
                                text: 'La requisición ya fue cancelada, no se puede convertir',
                                icon: 'warning',
                                confirmButtonText: 'Aceptar'
                            })
                        }else
                        { 
                        Swal.fire({
                            title: '¿Estas seguro?',
                            text: "¡No podrás revertir esto!",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            cancelButtonText: 'Cancelar',
                            confirmButtonText: 'Si, Cancelar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                try {
                                    apiDelete(`requisicion/${item.id}/cancelar`, userAuth.access_token).then(result => {
                                      
                                        Swal.fire({
                                            title: 'Cancelado!',
                                            text: 'La requisición se ha cancelado',
                                            icon: 'success',
                                            confirmButtonColor: '#3085d6',
                                            confirmButtonText: 'Ok',
                                            timer: 2000
                                        })
                                        if (reloadTable) {
                                            reloadTable.reload()
                                        }
                                        
                                    })
                                } catch (error) {

                                }
                            }
                        })
                    } 
                    // } else {
                    //     Swal.fire({
                    //         title: '¡No tienes permisos!',
                    //         text: "¡No tienes permisos para eliminar el presupuesto!",
                    //         icon: 'error',
                    //         confirmButtonColor: '#3085d6',
                    //         confirmButtonText: 'Ok'
                    //     })
                    // }
                }
            },
        ]
        return aux
    }

    const handleClose = (tipo) => () => {
        setModal({
            ...modal,
            [tipo]: {
                show: false,
                data: false
            }
        })
    }

    let prop = {
        pathname: '/administracion/requisicion-compras',
    }

    const getOpciones = () => { 
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        })

        apiOptions(`v2/proyectos/compras`, userAuth.access_token).then(
            (response) => {
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras, proyectos, proveedores, formasPago, metodosPago, estatusFacturas, cuentas } = response.data
                let aux = {}
                aux.empresas = setOptions(empresas, 'name', 'id')
                aux.proveedores = setOptions(proveedores, 'razon_social', 'id')
                /* aux.areas = setOptions(areas, 'nombre', 'id')
                aux.proyectos = setOptions(proyectos, 'nombre', 'id') */
                aux.tiposPagos = setOptions(tiposPagos, 'tipo', 'id')
                /* aux.tiposImpuestos = setOptions(tiposImpuestos, 'tipo', 'id') */
                /* aux.estatusCompras = setOptions(estatusCompras, 'estatus', 'id') */
                /* aux.estatusFacturas = setOptions(estatusFacturas, 'estatus', 'id')
                aux.formasPago = setOptions(formasPago, 'nombre', 'id')
                aux.metodosPago = setOptions(metodosPago, 'nombre', 'id') */
                aux.cuentas = setOptions(cuentas, 'nombre', 'id')
                setEstatusCompras(estatusCompras)
                setOpcionesApi(aux)
                Swal.close()
            }, (error) => { }
        ).catch((error) => { })
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
              { accessorKey: 'presupuesto', header: 'Presupuesto', size: 150,
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
              { accessorKey: 'solicitante', header: 'Solicitante', size: 200,},
              { accessorKey: 'fecha', header: 'Fecha',size: 120 },
              { accessorKey: 'departamento', header: 'Departamento',size: 150 },
              { accessorKey: 'gasto', header: 'Gasto',size: 150 },
              { accessorKey: 'pago', header: 'Tipo de pago',size: 150 },
              { accessorKey: 'monto', header: 'Monto solicitado',size: 150 },
           
            { accessorKey: 'factura', header: 'Factura',size: 150 },

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
               {
                accessorKey: 'estatus',
                header: 'Estatus',
                size: 200,
                Cell: ({ row }) => {
                    const { estatus_compra, estatus_conta, auto1, auto2, auto3 } = row.original?.data;
                    // console.log(estatus_compra)
                    // console.log(row.original)

                    // 🔥 Definir iconos y colores para cada estatus
                    const getEstatusCompraConfig = (estatus) => {
                        if (!estatus) {
                            return { icon: <AccessTimeIcon />, color: '#B0BEC5', label: 'Pendiente' }; // Siempre muestra "Pendiente"
                        }
                        switch (estatus.toUpperCase()) {
                            case 'EN PROCESO':
                                return { icon: <HourglassEmptyOutlinedIcon />, color: '#FFC107', label: 'En Proceso' }; // Amarillo ⏳
                            case 'PAGADA':
                                return { icon: <CreditCardOutlinedIcon />, color: '#1976D2', label: 'Pagada' }; // Azul 💳
                            case 'EN CAMINO':
                                return { icon: <LocalShippingOutlinedIcon />, color: '#FF9800', label: 'En Camino' }; // Naranja 🚛
                            case 'COMPLETADA':
                                return { icon: <AssignmentTurnedInOutlinedIcon />, color: '#4CAF50', label: 'Completada' }; // Verde ✅
                            case 'CANCELADA':
                                return { icon: <BlockOutlinedIcon />, color: '#D32F2F', label: 'Cancelada' }; // Rojo ❌
                            case 'PENDIENTE':
                                return { icon: <AccessTimeIcon />, color: '#3A89C9', label: 'Pendiente' }; 
                            case 'SOLICITADA':
                                return { icon: <AccessTimeIcon />, color: '#3A89C9', label: 'Solicitada' }; 
                            case 'ANÁLISIS ADMINISTRACIÓN':
                                return { icon: <SupervisorAccountIcon />, color: '#3A89C9', label: 'Análisis Administración' }; 
                                
                            default:
                                return { icon: <AccessTimeIcon />, color: '#3A89C9', label: 'Pendiente' }; // Siempre muestra algo
                        }
                    };
                    // 🔥 Función para manejar "ANÁLISIS ADMINISTRACIÓN"
                    const getAdminAnalysisConfig = () => {
                        if (estatus_conta?.id === 19) {
                            return { icon: <SupervisorAccountIcon />, color: '#3A89C9' }; // Azul fuerte 🔍
                        }
                        return null;
                    };

                    // 🔥 Obtener icono y color de estatus de compra o análisis de administración
                    const compraStatus = estatus_compra 
                    ? getEstatusCompraConfig(estatus_compra.estatus) 
                    : getAdminAnalysisConfig() 
                    || { icon: <AccessTimeIcon />, color: '#B0BEC5', label: 'Pendiente' }; // 🔥 Default: Pendiente
                
                    const contaStatus = estatus_conta?.id === 19 ? getEstatusCompraConfig('ANÁLISIS ADMINISTRACIÓN', 'conta') : getEstatusCompraConfig(estatus_conta?.estatus, 'conta');

                    // 🔥 Configuración de cada indicador de estatus
                    const estatusConfig = [
                        { label: 'Estatus Compra', icon: compraStatus.icon, color: compraStatus.color, status: compraStatus.label },
                        { label: 'Autorización Compras', icon: auto1 ? <DoneIcon /> : <AccessTimeIcon />, color: auto1 ? '#009688' : '#B0BEC5', status: auto1 ? 'Autorizado' : 'Pendiente' },
                        { label: 'Autorización Admin', icon: auto3 ? <DoneIcon /> : <AccessTimeIcon />, color: auto3 ? '#009688' : '#B0BEC5', status: auto3 ? 'Autorizado' : 'Pendiente' },
                        { label: 'Estatus Contabilidad', icon: auto3 ? <DoneIcon /> : <AccessTimeIcon />, color: auto3 ? '#009688' : '#B0BEC5', status: auto3 ? 'Autorizado' : 'Pendiente' },
                        { label: 'Autorización Contabilidad', icon: auto2 ? <DoneAllIcon /> : <AccessTimeIcon />, color: auto2 ? '#009688' : '#B0BEC5', status: auto2 ? 'Autorizado' : 'Pendiente' },
                    ];
            
                    return (
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            {estatusConfig.map((item, index) => (
                                <Tooltip key={index} title={`${item.label}: ${item.status}`} arrow>
                                    <Box 
                                        sx={{ 
                                            backgroundColor: item.color, 
                                            color: 'white', 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '8px',
                                            padding: '6px',
                                            width: '30px',
                                            height: '30px',
                                        }}
                                    >
                                        {item.icon}
                                    </Box>
                                </Tooltip>
                            ))}
                        </Box>
                    );
                }
            },
            
            ];
            

            // Función para obtener el icono y color según el estatus
            // const getEstatusConfig = (estatus) => {
            //     const estatusStr = estatus ? String(estatus).toLowerCase() : 'desconocido';
            
            //     const estatusMap = {
            //         'completada': { icon: <CheckCircleIcon />, color: '#009688', bgColor: '#00796B', label: 'Completada' },
            //         'pendiente': { icon: <HourglassEmptyIcon />, color: '#FFC107', bgColor: '#FFA000', label: 'Pendiente' },
            //         'cancelada': { icon: <CancelIcon />, color: '#D32F2F', bgColor: '#C62828', label: 'Cancelada' },
            //         'en proceso': { icon: <SyncIcon />, color: '#0277BD', bgColor: '#01579B', label: 'En Proceso' },
            //         'solicitada': { icon: <DescriptionIcon />, color: '#1976D2', bgColor: '#1565C0', label: 'Solicitada' },
            //         'desconocido': { icon: <HourglassEmptyIcon />, color: '#9E9E9E', bgColor: '#757575', label: 'Desconocido' }
            //     };
            
            //     return estatusMap[estatusStr] || estatusMap['desconocido'];
            // };
            
    
                useEffect(() => {
                    if (!modals.crear.show && !modals.editar.show) {
                        reloadData();
                    }
                }, [modals.crear.show, modals.editar.show]);
    
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
                    pago: dato.pago?.tipo || 'N/A', 
                    monto: formatMonto(dato.cantidad) || 'N/A', 
                    factura: dato.facturas == 1 ? 'Con Factura' : 'Sin Factura' ,
                    estatus: dato.status || 'N/A', // ✅ Se pasa sin transformar
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
                      <MenuItem
                            onClick={() => {
                                if (selectedRow.data?.id_estatus_compra === 11) {
                                    return; // 🔥 No ejecuta nada si id_estatus_compra es 11
                                }

                                if (selectedRow.data?.id_estatus === 12) {
                                    Swal.fire({
                                        title: 'Requisición cancelada',
                                        text: 'La requisición ya fue cancelada, no se puede convertir',
                                        icon: 'warning',
                                        confirmButtonText: 'Aceptar'
                                    });
                                } else if (selectedRow.data?.auto1) {
                                    Swal.fire({
                                        title: 'Requisición ya aprobada',
                                        text: 'La requisición ya fue aprobada, no se puede convertir',
                                        icon: 'warning',
                                        confirmButtonText: 'Aceptar'
                                    });
                                } else {
                                    toggleModal('convertir', selectedRow); // ✅ Solo abre el modal si pasa las validaciones
                                    handleCloseMenu();
                                }
                            }}
                            sx={{
                                '&:hover': { backgroundColor: 'primary.light', color: 'white' },
                            }}
                        >
                            <Edit sx={{ marginRight: '10px', color: 'primary.main' }} />
                            Convertir
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

            const handleOpenMenu = (event, row) => {
                setAnchorEl(event.currentTarget); // Abre el menú en la posición del clic
                setSelectedRow(row); // Guarda los datos de la fila seleccionada
            };
        
            const handleCloseMenu = () => {
                setAnchorEl(null); // Cierra el menú
                setSelectedRow(null); // Limpia la fila seleccionada
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
                        `requisicion/admin?page=${page}&page_size=${pageSize}&search=${globalFilter}&${queryString}`,
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
                        `requisicion/admin?page=${pagination.pageIndex + 1}&page_size=${pagination.pageSize}`,
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
                        


    return (
        <>
            {/* <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='administracion'> */}

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
                            <Button sx={{backgroundColor: '#0A3E27',color: '#fff','&:hover': {backgroundColor: '#075633', },}} onClick={() => toggleModal('crear')}variant="contained">
                                Crear Requisicion
                            </Button>   
                            {userAuth.user.tipo.tipo === 'Administrador' && (
                                <Button 
                                    sx={{
                                        backgroundColor: '#0A3E27',
                                        color: '#fff',
                                        '&:hover': { backgroundColor: '#075633' },
                                    }} 
                                    onClick={() => toggleModal('autoriza')}
                                    variant="contained"
                                >
                                    Autorizar
                                </Button>
                            )}                     
                            
                            </Box>
                        )}
                    />
                </Box>
            </Box>

            {/* <>
                <TablaGeneralPaginado 
                    titulo='Solicitudes de Gasto' 
                    columnas={columnas} 
                    url='requisicion/admin' 
                    ProccessData={ProccessData} 
                    numItemsPagina={20} 
                    acciones={createAcciones()} 
                    opciones={opciones} 
                    reload={setReloadTable} 
                    filtros={filtrado}
                />
            </> */}
            {/* </Layout> */}
            {
                estatusCompras && opcionesApi ?
                    <>
                        <Modal size="xl" title={"Aprobar Requisición de compra"} show={modals.convertir?.show} handleClose={() => toggleModal('convertir')}  >
                            <Convertir data={modals.convertir?.data} getProveedores={opcionesApi.proveedores}  handleClose={() => toggleModal('convertir')} 
                            reload={reloadData} opciones={opcionesApi} getOpciones={getOpciones} estatusCompras={estatusCompras} />
                        </Modal>

                        {/* <Modal size="xl" title={"Editar requisición"} show={modals.editar?.show}  handleClose={() => toggleModal('editar')} >
                            <Editar data={modals.editar?.data}  handleClose={() => toggleModal('editar')}  reload={reloadTable} opciones={opcionesApi} estatusCompras={estatusCompras} />
                        </Modal> */}

                        <Modal size="xl" title={"Nueva requisición"} show={modals.crear?.show} handleClose={() => toggleModal('crear')}>
                            <Crear handleClose={() => toggleModal('crear')} reload={reloadData} />
                        </Modal>

                        <Modal size="lg" title={"Adjuntos"} show={modals.adjuntos?.show} handleClose={() => toggleModal('adjuntos')} >
                            <Adjuntos data={modals.adjuntos?.data} nuevaRequisicion={false} />
                        </Modal>

                        {/* <Modal size="md" title={"Ver requisición"} show={modal.ver.show} handleClose={handleClose('ver')}>
                            <Ver data={modal.ver.data} opciones={opcionesApi} estatusCompras={estatusCompras} />
                        </Modal> */}

                        
                         {/* <Modal size="lg" title={"Filtrar gastos"} show={modal.filtrar.show}  handleClose={handleClose('filtrar')} >
                            <FiltrarRequisicionesCompras handleClose={handleClose('filtrar')}filtrarTabla={setFiltrado} borrarTabla={borrar}  reload={reloadTable}/>
                        </Modal> */}
                        
                        <Modal size="xl" title={"autoriza Requisicion"} show={modals.autoriza?.show} handleClose={() => toggleModal('autoriza')} >
                            <Autoriza data={modals.autoriza?.data} handleClose={() => toggleModal('autoriza')} filtrarTabla={setFiltrado} />
                        </Modal>

                        <Modal size="lg" title={"Comentarios"} show={modals.comentarios?.show} handleClose={() => toggleModal('comentarios')} >
                            <Comentarios data={modals.comentarios?.data}  handleClose={() => toggleModal('comentarios')} reload={reloadData}/>
                        </Modal>

                        <Modal size="lg" title={"Historial"} show={modals.historial?.show}  handleClose={() => toggleModal('historial')}>
                            <Historial data={modals.historial?.data}  handleClose={() => toggleModal('historial')} reload={reloadData}/>
                        </Modal>
                    </>
                    : null
            }
        </>
    )
}