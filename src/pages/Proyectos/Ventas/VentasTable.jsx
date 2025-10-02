


import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MaterialReactTable, MRT_ActionMenuItem } from 'material-react-table';
import Swal from 'sweetalert2';
import { apiGet, apiOptions, catchErrors, apiDelete, apiPostFormResponseBlob } from './../../../functions/api';
import { Edit, Delete, Settings, MoreVert } from '@mui/icons-material';
import { format } from 'date-fns';
import { Box, Button, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid } from '@mui/material';
// import Modal from '@material-ui/core/Modal';
import ReceiptIcon from '@material-ui/icons/Receipt';
import CrearVentas from './CrearVentas';
import EditarVenta from './EditarVenta';
import AdjuntosVentas from './AdjuntosVentas';
import FacturasVentas from './FacturasVentas';
import FiltrarVentas from './FiltrarVentas';
import AttachFile from '@mui/icons-material/AttachFile';

// import DoneAllIcon from '@material-ui/icons/DoneAll';
// import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
// import { apiOptions, catchErrors, apiDelete, apiPostFormResponseBlob } from './../../../functions/api';
// import { printResponseErrorAlert, doneAlert } from './../../../functions/alert';
// import { setDateTable } from '../../../functions/setters';
// import { apiGet } from './../../../functions/api';
// import { Box, Tooltip } from '@mui/material';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import { useRef } from 'react';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Modal, ModalDelete, ItemSlider } from '../../../components/singles'
import { emphasize, styled } from '@mui/material/styles';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

import CircularProgress from '@mui/material/CircularProgress';

export default function VentasTable(props) {
    const { handleClose, reload } = props

    const auth = useSelector((state) => state.authUser.access_token);
    const authUser = useSelector((state) => state.authUser);

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // const [reloadTable, setReloadTable] = useState()

    const columnVirtualizerInstanceRef = useRef(null);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });
    const [totalRows, setTotalRows] = useState(0); // Total de registros
    const [exporting, setExporting] = useState(false);

    const [modal, setModal] = useState({
        ver: { show: false, data: null },
        editar: { show: false, data: null },
        crear: { show: false, data: null },
        eliminar: { show: false, data: false },
        filtrar: { show: false, data: null },
        adjuntos: { show: false, data: null },
        facturas: { show: false, data: null }
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
    // const acciones = {
    //     header: 'Acciones',
    //     size: 80,
    //     Cell: renderRowActions,
    // };

    const [opcionesData, setOpcionesData] = useState({
        cuentas: [],
        empresas: [],
        estatusCompras: [],
        clientes: [],
        tiposImpuestos: [],
        tiposPagos: [],
        tickets: [],
    });
    const mapColumnFilterToBackend = {
        cliente: 'cliente_id',
        proyecto: 'proyecto_id',
        area: 'area_id',
        cuenta: 'cuenta_id',
        partida: 'partida_id',
        subarea: 'subarea_id',
        pago: 'tipo_pago_id',
        impuesto: 'tipo_impuesto_id',
        descripcion: 'descripcion', // este puede quedarse igual si es texto libre
        monto: 'total', // si filtras por monto
        fecha: 'created_at', // si filtras por fecha
    };

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
            header: 'Proyecto',
            accessorKey: 'proyecto',
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
        { header: 'Partida', accessorKey: 'partida', size: 120 },
        { header: 'Sub-partida', accessorKey: 'subarea', size: 120 },
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
        { header: 'Impuesto', accessorKey: 'impuesto', size: 120 },
        {
            header: 'Descripción',
            accessorKey: 'descripcion',
            size: 180,
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

    // const label = (dato) => {
    //     return (

    //         <div title={`${dato.data?.factura == 1 ? 'Con factura' : 'Sin factura'}`}  >
    //             {
    //                 dato.data?.factura ?
    //                     dato.data?.facturas.length > 0 || dato.data?.facturas_pdf.length ?
    //                         <span style={{ color: 'green' }}><RequestQuoteIcon /></span>
    //                         : <span style={{ color: 'red' }}><RequestQuoteIcon /></span>
    //                     : <span><DescriptionOutlinedIcon /></span>
    //             }
    //         </div>
    //     )
    // }
    useEffect(() => {
        getProveedores();
    }, []); 
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
                const response = await apiGet(`v3/proyectos/ventas/index?page=${page}&page_size=${pageSize}&${queryString}`, auth);

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


            return {
                id: dato.id,
                fecha: dato.created_at ? format(new Date(dato.created_at), 'yyyy/MM/dd') : 's/i',
                monto: formatMonto(dato.total),  // ✅ Aquí se refleja monto + comisión
                area: dato.area?.nombre || 's/i',
                proyecto: dato.proyecto?.nombre || 'N/A',
                partida: dato.partida?.nombre || 's/i',
                subarea: dato.subarea?.nombre || 's/i',
                cuenta: dato.cuenta ? `${dato.cuenta.nombre} (${dato.cuenta.numero || dato.cuenta.numero_cuenta || 's/n'})` : 's/i',
                pago: dato.tipo_pago?.tipo || 's/i',
                impuesto: dato.tipo_impuesto?.tipo || 's/i',
                descripcion: dato.descripcion || 'N/A',
                cliente: dato.cliente?.empresa || 'N/A',
                requisicion: dato.id_requisiciones || 'N/A',
                factura: dato.factura,
                tipo: dato.tipo === 'nacional' ? 'FN' : dato.tipo === 'extranjera' ? 'CE' : '',
                empresa: dato?.empresa?.name || 's/i',
                data: dato,
            };
        });
    };


    const getProveedores = () => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        apiOptions(`v2/proyectos/ventas`, auth)
            .then((res) => {
                const data = res.data;
                // console.log(data)
                const aux = {
                    cuentas: [],
                    empresas: [],
                    estatusCompras: [],
                    clientes: [],
                    tiposImpuestos: [],
                    tiposPagos: [],
                    tickets: [],
                };

                data.clientes.forEach((cliente) => {
                    if (cliente.empresa) {
                        aux.clientes.push({
                            id: cliente.id,
                            name: cliente.empresa,
                            rfc: cliente.rfc,
                            proyectos: cliente.proyectos,
                        });
                    }
                });

                data.empresas.forEach((empresa) => {
                    if (empresa.name) {
                        aux.empresas.push({
                            id: empresa.id,
                            name: empresa.name,
                            rfc: empresa.rfc,
                            cuentas: empresa.cuentas || [],
                        });
                    }
                });

                data.estatusCompras.forEach((estatusCompra) => {
                    if (estatusCompra.estatus) {
                        aux.estatusCompras.push({
                            id: estatusCompra.id,
                            name: estatusCompra.estatus,
                        });
                    }
                });

                data.tiposImpuestos.forEach((tipoImpuesto) => {
                    if (tipoImpuesto.tipo) {
                        aux.tiposImpuestos.push({
                            id: tipoImpuesto.id,
                            name: tipoImpuesto.tipo,
                        });
                    }
                });

                data.tiposPagos.forEach((tipoPago) => {
                    if (tipoPago.tipo) {
                        aux.tiposPagos.push({
                            id: tipoPago.id,
                            name: tipoPago.tipo,
                        });
                    }
                });

                data.tickets.forEach((ticket) => {
                    if (ticket.identificador) {
                        aux.tickets.push({
                            id: ticket.id,
                            name: ticket.identificador,
                        });
                    }
                });

                Swal.close();
                setOpcionesData(aux);
            })
            .catch((error) => {
                Swal.close();
                console.error(error);
                Swal.fire('Error', 'No se pudieron cargar los datos de ventas.', 'error');
            });
    };
    const deleteVentaAxios = (id) => {
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
                    apiDelete(`ventas/${id}`, auth)
                        .then(() => {
                            Swal.fire('¡Eliminado!', 'La venta ha sido eliminada.', 'success');
                            reloadData(); // 👈 Asegúrate de tener esta función o cámbiala por fetchVentas()
                            setData((prevData) => prevData.filter((item) => item.id !== id));
                        })
                        .catch((error) => {
                            console.error(error);
                            Swal.fire('Error', 'No se pudo eliminar la venta.', 'error');
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
                            deleteVentaAxios(selectedRow.id);
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

    const exportVentasAxios = async () => {
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
                `v3/proyectos/ventas/exportar`,
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


            // const response = await apiPostFormResponseBlob(
            //     `v3/proyectos/ventas/exportar`,
            //     { columnas: form },
            //     auth
            // );

            // Cierra loader y modal antes de descargar
            if (Swal.isVisible()) Swal.close();
            toggleModal('exportar', false);

            const cd = response.headers?.['content-disposition'];
            const match = cd && /filename\*?=(?:UTF-8'')?("?)([^";]+)\1/.exec(cd);
            const fileName = (match && decodeURIComponent(match[2])) || 'Ventas.xlsx';

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



            // const url = window.URL.createObjectURL(new Blob([response.data]));
            // const link = document.createElement('a');
            // link.href = url;
            // link.setAttribute('download', 'ventas.xlsx');
            // document.body.appendChild(link);
            // link.click();

            // // Cerrar modal si existe
            // setIsModalOpen && setIsModalOpen(false);

            // Swal.fire(
            //     'Exportación exitosa',
            //     'Ventas exportadas con éxito.',
            //     'success'
            // );
        } catch (error) {
            console.error(error);
            if (Swal.isVisible()) Swal.close();
            Swal.fire('Error', 'No se pudo exportar los datos.', 'error');
        } finally {
            // 🔑 sin esto, el botón queda en "Exportando…"
            setExporting(false);
        }
    };


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
    const reloadData = async () => {
        setIsLoading(true);
        try {
            const page = pagination.pageIndex + 1;
            const pageSize = pagination.pageSize;

            const response = await apiGet(
                `v3/proyectos/ventas/index?page=${page}&page_size=${pageSize}`,
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
                        <StyledBreadcrumb component="a" href="#" label="Home" icon={<HomeIcon fontSize="small" />} />
                        <StyledBreadcrumb component="a" href="#" label="Proyectos" />
                        <StyledBreadcrumb component="a" href="#" label="Ventas" />
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
                                    {exporting ? 'Exportando…' : 'Exportar Ventas'}
                                </Button>
                            </Box>
                        )}
                    />
                </Box>
            </Box>
            {opcionesData && opcionesData.clientes && opcionesData.empresas && (
                <Modal size="xl" title="Nueva venta" show={modal.crear.show} handleClose={() => toggleModal('crear')}>
                    <CrearVentas
                        handleClose={() => toggleModal('crear')}
                        reload={reloadData}
                        opcionesData={opcionesData}
                    // getProveedores={getProveedores}
                    />
                </Modal>
            )}

            {modal.editar?.data && (
                <Modal size="xl" title="Editar venta" show={modal.editar.show} handleClose={() => toggleModal('editar')}>
                    <EditarVenta handleClose={() => toggleModal('editar')} opcionesData={opcionesData} reload={reloadTable} data={modal.editar.data} />
                </Modal>
            )}

            {modal.adjuntos?.data && (
                <Modal size="lg" title="Adjuntos" show={modal.adjuntos.show} handleClose={() => toggleModal('adjuntos')}>
                    <AdjuntosVentas handleClose={() => toggleModal('adjuntos')} opcionesData={opcionesData} reload={reloadTable} data={modal.adjuntos.data} />
                </Modal>
            )}

            {modal.facturas?.data && (
                <Modal size="xl" title="Facturas" show={modal.facturas.show} handleClose={() => toggleModal('facturas')}>
                    <FacturasVentas handleClose={() => toggleModal('facturas')} opcionesData={opcionesData} reload={reloadTable} venta={modal.facturas.data} />
                </Modal>
            )}

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
                            onClick={exportVentasAxios}
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

            {/* Modal para la exportación */}
            {/* <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <DialogTitle>Exportar Ventas</DialogTitle>
                <DialogContent><br />
                    <TextField
                        label="Fecha Inicio"
                        type="date"
                        fullWidth
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Fecha Fin"
                        type="date"
                        fullWidth
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsModalOpen(false)} color="secondary">Cancelar</Button>
                    <Button onClick={exportVentasAxios} color="primary" variant="contained">Exportar</Button>
                </DialogActions>
            </Dialog> */}
        </>
    );
};