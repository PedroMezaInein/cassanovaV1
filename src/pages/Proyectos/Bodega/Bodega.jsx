
import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, IconButton, Menu, MenuItem, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { Delete, Edit, Settings, AttachFile, History, Visibility, AddToPhotos } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { apiGet, apiDelete, setSingleHeader } from '../../../functions/api';
import { doneAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert';
import { URL_DEV } from '../../../constants';
import { Modal, ModalDelete } from '../../../components/singles';
import ItemSlider2 from '../../../components/singles/itemSlider2';

import { Typography, TextField } from '@mui/material';

import { FormPrestamos, PestamosDevoluciones, HistorialHM } from '../../../components/forms';
import { BodegaCard } from '../../../components/cards';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Layout from '../../../components/layout/layout';
import { useLocation, useHistory } from 'react-router-dom';
import { apiPostForm, apiPutForm, catchErrors } from '../../../functions/api';
import FormMaterialBodega from './FormMaterialBodega';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ModalEstatus from './ModalEstatus';
import ModalReasignar from './ModalReasignar'; // ajusta la ruta si es necesario
import axios from 'axios';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export default function Bodega() {
    const auth = useSelector(state => state.authUser);
    const access_token = auth.access_token;

    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });
    const [isLoading, setIsLoading] = useState(false);
    const [bodega, setBodega] = useState(null);
    const location = useLocation();
    const history = useHistory();
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
    const [modalDevolucion, setModalDevolucion] = useState(false);
    const [bodegaDetalle, setBodegaDetalle] = useState({});
    const [adjuntosLocales, setAdjuntosLocales] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [tabActivo, setTabActivo] = useState('admin'); // 'admin' o 'inventario'
    const [nuevoEstatus, setNuevoEstatus] = useState('');
    const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
    const [importOpen, setImportOpen] = useState(false);
    const [excelFile, setExcelFile] = useState(null);
    const [importRes, setImportRes] = useState(null);
    const [modal, setModal] = useState({
        eliminar: false,
        adjuntos: false,
        prestamos: false,
        historial: false,
        ver: false,
        crear: false,
    });
    const [modalReasignar, setModalReasignar] = useState(false);
    const [formReasignacion, setFormReasignacion] = useState({
        responsable: '',
        ubicacion: '',
        comentario: '',
    });


    const fetchBodega = async () => {
        setIsLoading(true);

        try {
            const body = {
                draw: 1,
                start: pagination.pageIndex * pagination.pageSize,
                length: pagination.pageSize,
                tipo: '', // puedes usarlo para materiales/herramientas si aplica
                columns: columns.map(col => {
                    const filtro = columnFilters.find(f => f.id === col.accessorKey);
                    return {
                        data: col.accessorKey,
                        search: { value: filtro?.value || '' }
                    };
                }),
                order: [{ column: 0, dir: 'desc' }],
            };

            const res = await apiPostForm(`v1/proyectos/bodegas/filtrar`, body, access_token); // 👈 usa POST si el backend espera el body

            const bodegaData = Array.isArray(res.data?.data) ? res.data.data.map(processRow) : [];
            setData(bodegaData);
            setTotalRows(res.data?.recordsFiltered || 0);
        } catch (error) {
            printResponseErrorAlert(error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchBodega(); // Llamada cada que cambian la página o el tamaño
    }, [pagination, columnFilters]);

    useEffect(() => {
        if (modal.adjuntos && bodega?.adjuntos) {
            setAdjuntosLocales(bodega.adjuntos);
        }
    }, [modal.adjuntos, bodega]);


    const processRow = (item) => {
        const ultimoPrestamo = item.prestamos?.[item.prestamos.length - 1];
        return {
            id: item.id,
            nombre: item.nombre || 'N/A',
            tipo_detalle: item.tipo || 'N/A',
            partida: item.partida?.nombre || 'N/A',
            fecha_compra: item.fecha_compra || '',
            fecha_entrada: item.fecha_entrada || '',
            proveedor: item.proveedor || '',
            unidad: item.unidad?.nombre || 'N/A',
            cantidad: item.cantidad || '0',
            marca: item.marca || '',
            modelo: item.modelo || '',
            serie: item.serie || '',
            ubicacion: item.ubicacion || '',
            estatus: item.estatus || '—',
            descripcion: item.descripcion || '',
            adjuntos: item.adjuntos?.map(adj => ({
                id: adj.id,
                name: adj.name,
                url: adj.url,
            })) || [],
            ubicacion_prestamo: ultimoPrestamo?.ubicacion || 'Sin ubicación', // 👈 Aquí está el dato nuevo
            data: item
        };
    };


    const toggleModal = (name, data = null) => {
        setModal(prev => ({ ...prev, [name]: !prev[name] }));
        setBodega(data);

        if (name === 'estatus') {
            setRegistroSeleccionado(data); // ✅ aquí le decimos qué registro va a editar
        }
    };


    const handleDelete = async () => {
        try {
            waitAlert();
            await apiDelete(`v1/proyectos/bodegas/${bodega.id}`, access_token);
            doneAlert('Eliminado con éxito');
            toggleModal('eliminar');
            fetchBodega();
        } catch (error) {
            printResponseErrorAlert(error);
        }
    };
    const handleAgregarArchivo = (nuevosArchivos) => {
        setAdjuntosLocales(prev => [...prev, ...nuevosArchivos]);
    };




    const columns = [
        { header: 'ID', accessorKey: 'id', size: 60 },
        {
            header: 'NOMBRE',
            id: 'nombre',
            size: 140,
            accessorKey: 'nombre',
            Cell: ({ row }) => {
                const nombre = row.original.nombre;

                const handleCopy = () => {
                    navigator.clipboard.writeText(nombre);
                };

                return (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title="Copiar nombre">
                            <IconButton onClick={handleCopy} size="small">
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <span>{nombre}</span>
                    </Box>
                );
            },
        },
        { header: 'Tipo', accessorKey: 'tipo_detalle', size: 120 },
        { header: 'Partida', accessorKey: 'partida', size: 100 },
        {
            header: 'Estatus',
            accessorKey: 'estatus',
            id: 'estatus',
            size: 100,
            muiTableHeadCellProps: { sx: { padding: '2px 4px', textAlign: 'center' } },
            muiTableBodyCellProps: { sx: { padding: '2px 4px', textAlign: 'center' } },
            Cell: ({ row }) => {
                const estatusRaw = row.original.estatus ?? '';

                // normaliza: minúsculas, quita acentos y espacios extra
                const key = estatusRaw
                    .toString()
                    .trim()
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/\p{Diacritic}/gu, ''); // requiere motor JS moderno

                const colorMap = {
                    'disponible': { bg: '#d4edda', color: '#155724', label: 'Disponible' },
                    'precaucion': { bg: '#fff3cd', color: '#856404', label: 'Precaución' },
                    'danado': { bg: '#f8d7da', color: '#721c24', label: 'Dañado' },
                    'no disponible': { bg: '#cce5ff', color: '#004085', label: 'No disponible' },
                    'vendido': { bg: '#e8e6f3', color: '#4b0082', label: 'Vendido' },
                    'mantenimiento': { bg: '#f3ede6', color: '#d3670e', label: 'Mantenimiento' },
                    'default': { bg: '#e2e3e5', color: '#383d41', label: estatusRaw || '—' },
                };

                const colors = colorMap[key] || colorMap['default'];

                return (
                    <Box
                        title={`Estatus: ${estatusRaw || 'No definido'}`}
                        sx={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            backgroundColor: colors.bg,
                            color: colors.color,
                            display: 'inline-block',
                        }}
                    >
                        {colors.label}
                    </Box>
                );
            },
        },

        { header: 'Fecha Compra', accessorKey: 'fecha_compra', size: 110 },
        { header: 'Fecha Entrada', accessorKey: 'fecha_entrada', size: 110 },
        {
            header: 'Proveedor',
            accessorKey: 'proveedor',
            size: 100,
            muiTableHeadCellProps: { sx: { padding: '2px 4px' } },
            muiTableBodyCellProps: { sx: { padding: '2px 4px' } }
        },
        {
            header: 'Unidad',
            accessorKey: 'unidad',
            size: 60,
            muiTableHeadCellProps: { sx: { padding: '2px 4px' } },
            muiTableBodyCellProps: { sx: { padding: '2px 4px' } }
        },
        {
            header: 'Cantidad',
            accessorKey: 'cantidad',
            size: 60,
            muiTableHeadCellProps: { sx: { padding: '2px 4px', textAlign: 'center' } },
            muiTableBodyCellProps: { sx: { padding: '2px 4px', textAlign: 'center' } }
        },
        {
            header: 'Marca',
            accessorKey: 'marca',
            size: 80,
            muiTableHeadCellProps: { sx: { padding: '2px 4px' } },
            muiTableBodyCellProps: { sx: { padding: '2px 4px' } }
        },
        {
            header: 'Modelo',
            accessorKey: 'modelo',
            size: 80,
            muiTableHeadCellProps: { sx: { padding: '2px 4px' } },
            muiTableBodyCellProps: { sx: { padding: '2px 4px' } }
        },

        {
            header: '# Serie',
            accessorKey: 'serie',
            id: 'serie',
            size: 100,
            Cell: ({ row }) => {
                const serie = row.original.serie;

                const handleCopy = () => {
                    navigator.clipboard.writeText(serie);
                };

                return (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title="Copiar serie">
                            <IconButton onClick={handleCopy} size="small">
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <span>{serie}</span>
                    </Box>
                );
            },
        },

        { header: 'Ubicación', accessorKey: 'ubicacion', size: 90 },
        {
            header: 'Ubicación préstamo',
            accessorKey: 'ubicacion_prestamo',
            id: 'ubicacion_prestamo',
            size: 120,
            muiTableHeadCellProps: {
                sx: { padding: '2px 4px' }
            },
            muiTableBodyCellProps: {
                sx: { padding: '2px 4px' }
            },
            Cell: ({ row }) => {
                const ubicacion = row.original.ubicacion_prestamo;

                const handleCopy = () => {
                    navigator.clipboard.writeText(ubicacion);
                };

                return (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title="Copiar ubicación">
                            <IconButton onClick={handleCopy} size="small">
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <span>{ubicacion}</span>
                    </Box>
                );
            },
        },
        {
            header: 'Descripción',
            accessorKey: 'descripcion',
            id: 'descripcion',
            size: 100, // o 90 u 80 según prefieras
            muiTableHeadCellProps: { sx: { padding: '2px 4px' } },
            muiTableBodyCellProps: { sx: { padding: '2px 4px' } },
            Cell: ({ row }) => {
                const descripcion = row.original.descripcion;

                const handleCopy = () => {
                    navigator.clipboard.writeText(descripcion);
                };

                return (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title="Copiar descripción">
                            <IconButton onClick={handleCopy} size="small">
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <span>{descripcion}</span>
                    </Box>
                );
            }

        },


        {
            header: 'Adjuntos',
            accessorKey: 'adjuntos',
            size: 100,
            muiTableHeadCellProps: {
                sx: { padding: '2px 4px', textAlign: 'center' }
            },
            muiTableBodyCellProps: {
                sx: {
                    padding: '2px 4px',
                    textAlign: 'center',
                    whiteSpace: 'normal',
                    overflow: 'visible'
                }
            },
            Cell: ({ cell }) => {
                const adjuntos = cell.getValue();
                if (!adjuntos?.length) return '—';

                return (
                    <Box display="flex" gap={1} justifyContent="center" flexWrap="wrap">
                        {adjuntos.map((adj, idx) => (
                            <Tooltip key={idx} title={adj.name || `Archivo ${idx + 1}`} arrow>
                                <a
                                    href={adj.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#9b9b9b' }}
                                >
                                    <InsertDriveFileIcon fontSize="small" />
                                </a>
                            </Tooltip>
                        ))}
                    </Box>
                );
            }
        }


    ];

    const columnasInventario = [
        'id',
        'nombre',
        'tipo_detalle',
        'unidad',
        'ubicacion',
        'ubicacion_prestamo',
        'adjuntos',
        'estatus',

    ];
    const columnasFinales = tabActivo === 'inventario'
        ? columns.filter(col => columnasInventario.includes(col.accessorKey || col.id))
        : columns;



    const renderRowActions = ({ row }) => (
        <>
            <IconButton onClick={(e) => toggleMenu(e, row.original)}>
                <Settings />
            </IconButton>
        </>
    );

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const toggleMenu = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const [formPrestamos, setFormPrestamos] = useState({
        fecha: new Date(),
        cantidad: '',
        responsable: '',
        proyecto: '',
        comentario: '',
        ubicacion: ''
    });

    const [formDevoluciones, setFormDevoluciones] = useState({
        fecha: new Date(),
        responsable: '',
        comentario: '',
        ubicacion: '',
        existencia: '',
        adjuntos: []
    });

    const [options, setOptions] = useState({
        proyectos: [],
        ubicaciones: []
    });

    const [showForm, setShowForm] = useState(false); // para mostrar el formulario

    const deletePrestamo = async (bodegaId, prestamoId) => {
        try {
            waitAlert();
            await apiDelete(`v1/proyectos/bodegas/${bodegaId}/prestamo/${prestamoId}`, access_token);
            doneAlert('Préstamo eliminado correctamente');

            setBodegaDetalle(prev => ({
                ...prev,
                prestamos: prev.prestamos?.filter(p => p.id !== prestamoId)
            }));

            fetchBodega();

        } catch (error) {
            printResponseErrorAlert(error);
        }
    };


    const deleteDevolucion = async (devolucion) => {
        const { id, prestamo_id, bodega_id } = devolucion; // ✅ destructura correctamente

        try {
            waitAlert();
            await apiDelete(
                `v1/proyectos/bodegas/${bodega_id}/prestamo/${prestamo_id}/devolucion/${id}`,
                access_token
            );
            doneAlert('Devolución eliminada correctamente');
            fetchBodega(); // recarga los datos si aplica
        } catch (error) {
            printResponseErrorAlert(error);
        }
    };

    const handleSubmitEstatus = async (e) => {
        e.preventDefault();

        console.log('🧾 Registro seleccionado:', registroSeleccionado);
        console.log('🆔 ID que se va a enviar:', registroSeleccionado?.id);
        console.log('📦 Estatus nuevo:', nuevoEstatus);
        apiPutForm(`v1/proyectos/bodegas/estatus/${registroSeleccionado.id}/estatus`, {
            estatus: nuevoEstatus,
        }, access_token).then(
            (response) => {
                console.log(response)
                doneAlert('Estatus actualizado');
                toggleModal('estatus');
                fetchBodega(); // si aplica
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    };





    const recargarPrestamo = async (id) => {
        try {
            const res = await apiGet(`v1/proyectos/bodegas/prestamos/${id}`, access_token);
            setPrestamoSeleccionado(res.data); // actualiza con la versión nueva (ya con devoluciones)
        } catch (error) {
            printResponseErrorAlert(error);
        }
    };
    const handleDevolucionExitosa = (prestamoActualizado) => {
        // Actualiza bodegaDetalle para que se vea en el historial
        setBodegaDetalle(prev => ({
            ...prev,
            prestamos: prev.prestamos.map(p =>
                p.id === prestamoActualizado.id ? prestamoActualizado : p
            )
        }));

        // Cierra el modal de devolución
        setModalDevolucion(false);

        // Recarga la tabla
        fetchBodega();
    };
    const handleGuardarAdjuntos = async () => {
        const formData = new FormData();

        // Solo enviar los archivos nuevos (con fileOriginal)
        const nuevosArchivos = adjuntosLocales.filter(file => file.fileOriginal instanceof File);

        nuevosArchivos.forEach(file => {
            formData.append('files[]', file.fileOriginal);
        });

        formData.append('tipo', bodega?.tipo || 'material');

        try {
            waitAlert();
            const res = await apiPostForm(`v1/proyectos/bodegas/${bodega?.id}/adjuntos`, formData, access_token);

            doneAlert();
            toggleModal('adjuntos');
            fetchBodega(); // Recarga los archivos incluyendo los nuevos desde backend

            // Limpia los archivos locales que ya se subieron
            setAdjuntosLocales(prev => prev.filter(file => !file.fileOriginal));
        } catch (error) {
            printResponseErrorAlert(error);
        }
    };

    const handleEliminarArchivo = async (archivo) => {
        try {
            waitAlert();
            await apiDelete(
                `v1/proyectos/bodegas/${bodega.id}/adjunto/${archivo.id}`,
                access_token
            );
            doneAlert();

            // Recarga toda la tabla desde backend
            await fetchBodega();

            // Cierra y reabre el modal para forzar datos actualizados
            toggleModal('adjuntos'); // cerrar


        } catch (error) {
            if (!error?.status && !error?.response?.status) {
                error.response = {
                    status: 500,
                    data: { message: error.message || 'Error inesperado' }
                };
            }
            printResponseErrorAlert(error);
        }
    };

    const handleSubmitReasignar = async (e) => {
        e.preventDefault();

        try {
            waitAlert('Reasignando préstamo...');

            await apiPostForm(`v1/proyectos/bodegas/${bodegaDetalle.id}/prestamo/${prestamoSeleccionado.id}/reasignar`, {
                responsable: formReasignacion.responsable,
                comentario: formReasignacion.comentario,
                proyecto: formReasignacion.proyecto,
            }, access_token);

            doneAlert('Préstamo reasignado con éxito');
            setModalReasignar(false);
            fetchBodega(); // o recargar el historial
        } catch (error) {
            printResponseErrorAlert(error);
        }
    };

    const handleExport = async () => {
        try {
            const res = await axios.get(
                `${URL_DEV}v1/proyectos/bodegas/export`,
                {
                    responseType: 'blob',
                    headers: { Authorization: `Bearer ${access_token}` },
                }
            );

            const blob = new Blob(
                [res.data],
                { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
            );
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bodegas_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            // evita el "Cannot read properties of undefined (reading 'status')"
            const msg = err?.response?.data?.message || err?.message || 'Error al exportar';
            console.error(msg, err);
            printResponseErrorAlert({ response: { status: err?.response?.status || 500, data: { message: msg } } });
        }
    };


    console.log('📊 Toda la data:', data);
    return (
        <Layout active="proyectos" location={location} history={history}>
            <Box sx={{ width: '100%', height: '100%' }}>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1}
                    mb={2}
                >
                    <Tabs
                        value={tabActivo}
                        onChange={(e, newValue) => {
                            setTabActivo(newValue);
                            setPagination({ pageIndex: 0, pageSize: 50 });
                        }}
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{ flexShrink: 1 }}
                    >
                        <Tab label="Inventario Admin" value="admin" />
                        <Tab label="Inventario" value="inventario" />
                    </Tabs>

                    {tabActivo === 'admin' && (
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                flexWrap: { xs: 'nowrap', sm: 'nowrap' }, // 🔹 No permitir salto de línea
                                overflowX: 'auto', // 🔹 Scroll horizontal en móviles si no caben
                                mt: { xs: 1, sm: 0 }
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => toggleModal('crear')}
                                startIcon={<AddToPhotos />}
                                sx={{ whiteSpace: 'nowrap', flexShrink: 0 }} // 🔹 Mantener tamaño fijo
                            >
                                Agregar Registro
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FileUploadIcon />}
                                onClick={() => setImportOpen(true)}
                            >
                                Importar Excel
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FileDownloadIcon />}
                                onClick={handleExport}
                            >
                                Exportar Excel
                            </Button>
                        </Box>

                    )}



                </Box>




                <MaterialReactTable
                    columns={columnasFinales}
                    data={data}
                    state={{ isLoading, pagination, columnFilters }}
                    manualPagination
                    manualFiltering
                    onPaginationChange={setPagination}
                    rowCount={totalRows}
                    enableRowActions
                    renderRowActions={renderRowActions}
                    onColumnFiltersChange={setColumnFilters}

                    // 👇 Este es el contenedor con scroll
                    muiTableContainerProps={{
                        sx: {
                            maxHeight: '70vh',
                            overflowY: 'auto',
                            position: 'relative', // 🔑 Requerido para que sticky funcione
                        },
                    }}

                    muiTableHeadCellProps={{
                        sx: {
                            position: 'sticky',
                            top: 0,
                            zIndex: 10,
                            backgroundColor: '#fff',
                            padding: '2px 4px',
                            fontSize: '0.75rem',
                            whiteSpace: 'normal',
                            lineHeight: 1.2,
                        },
                    }}

                    muiTableBodyCellProps={{
                        sx: {
                            padding: '2px 4px',
                            fontSize: '0.75rem',
                            whiteSpace: 'normal',
                            lineHeight: 1.2,
                        },
                    }}

                    muiTableBodyRowProps={{
                        sx: {
                            height: '30px',
                        },
                    }}
                />





                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                    <MenuItem onClick={() => { toggleModal('ver', selectedRow.data); handleCloseMenu(); }}>
                        <Visibility fontSize="small" sx={{ mr: 1 }} /> Ver
                    </MenuItem>
                    <MenuItem onClick={() => { toggleModal('adjuntos', selectedRow.data); handleCloseMenu(); }}>
                        <AttachFile fontSize="small" sx={{ mr: 1 }} /> Adjuntos
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            // Normaliza para comparar sin acentos ni mayúsculas
                            const estatus = (selectedRow?.estatus || '')
                                .toString()
                                .trim()
                                .toLowerCase()
                                .normalize('NFD')
                                .replace(/\p{Diacritic}/gu, '');

                            // Lista de estados bloqueados
                            const bloqueados = ['mantenimiento', 'danado', 'no disponible', 'vendido'];

                            if (bloqueados.includes(estatus)) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'No se puede registrar el préstamo',
                                    text: `Este equipo está en estatus "${selectedRow.estatus}" y no se puede prestar.`,
                                });
                                return;
                            }

                            // Si está disponible, abre modal y prepara el form
                            toggleModal('prestamos', selectedRow.data);
                            setFormPrestamos({
                                fecha: new Date(),
                                cantidad: selectedRow.cantidad || '',
                                responsable: '',
                                comentario: '',
                                ubicacion: selectedRow.ubicacion || '',
                                proyecto: '',
                            });
                            handleCloseMenu();
                        }}
                    >
                        <AddToPhotos fontSize="small" sx={{ mr: 1 }} /> Préstamos
                    </MenuItem>



                    <MenuItem
                        onClick={() => {
                            toggleModal('historial', selectedRow.data);       // Abre el modal
                            setBodegaDetalle(selectedRow.data);                // Guarda en el estado local del historial
                            handleCloseMenu();                                 // Cierra el menú contextual
                        }}
                    >
                        <History fontSize="small" sx={{ mr: 1 }} /> Historial
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            console.log('📌 Registro seleccionado para estatus:', selectedRow.data); // 👈 AQUI

                            setRegistroSeleccionado(selectedRow.data);
                            setNuevoEstatus(selectedRow.data.estatus || '');
                            toggleModal('estatus', selectedRow.data);
                            handleCloseMenu();
                        }}

                    >
                        <Settings fontSize="small" sx={{ mr: 1 }} /> Estatus
                    </MenuItem>



                    {tabActivo === 'admin' && (
                        <MenuItem
                            onClick={() => {
                                toggleModal('eliminar', selectedRow.data);
                                handleCloseMenu();
                            }}
                        >
                            <Delete fontSize="small" sx={{ mr: 1 }} /> Eliminar
                        </MenuItem>
                    )}


                </Menu>
                <Modal
                    size="xl"
                    title="Agregar Registro"
                    show={modal.crear}
                    handleClose={() => toggleModal('crear')}

                >
                    <FormMaterialBodega
                        tipo=''
                        onSuccess={() => {
                            toggleModal('crear');
                            setPagination({ pageIndex: 0, pageSize: 50 }); // 👈 esto ya dispara fetchBodega() por el useEffect
                        }}
                        onCancel={() => toggleModal('crear')}
                    />

                </Modal>



                <ModalDelete
                    title="¿Estás seguro que deseas eliminar este registro?"
                    show={modal.eliminar}
                    handleClose={() => toggleModal('eliminar')}
                    onClick={handleDelete}
                />

                <Modal size="lg" title="Adjuntos" show={modal.adjuntos} handleClose={() => toggleModal('adjuntos')}>
                    <>
                        {console.log('Adjuntos precargados:', adjuntosLocales)}

                        <ItemSlider2
                            items={adjuntosLocales}
                            item="archivos"
                            handleChange={(archivosNuevos) => {
                                const nuevosArchivos = archivosNuevos.map(a => {
                                    if (a instanceof File) {
                                        return {
                                            name: a.name,
                                            url: URL.createObjectURL(a),
                                            fileOriginal: a,
                                        };
                                    }
                                    return a; // si ya venía como objeto válido
                                });

                                setAdjuntosLocales(prev => [...prev, ...nuevosArchivos]);
                            }}
                            deleteFile={(archivo) => {
                                if (archivo.id) {
                                    handleEliminarArchivo(archivo); // backend
                                } else {
                                    setAdjuntosLocales(prev => prev.filter(a => a !== archivo)); // local
                                }
                            }}
                            multiple={true}
                            accept="image/*,application/pdf"
                        />

                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleGuardarAdjuntos}
                                disabled={adjuntosLocales.length === 0}
                            >
                                Guardar archivos
                            </Button>
                        </Box>
                    </>
                </Modal>


                <Modal
                    size="lg"
                    title={bodega ? `Préstamo de ${bodega.nombre}` : 'Préstamo'}
                    show={modal.prestamos}
                    handleClose={() => toggleModal('prestamos')}
                >
                    {bodega && (
                        <>
                            {/* 🔴 Alerta visual si el estatus es Vendido */}
                            {bodega.estatus === 'vendido' && (
                                <Typography color="error" sx={{ mt: 1, mb: 2 }}>
                                    Este material fue vendido y ya no se puede prestar.
                                </Typography>
                            )}

                            <FormPrestamos
                                form={formPrestamos}
                                setForm={setFormPrestamos}
                                onChange={(e) =>
                                    setFormPrestamos(prev => ({
                                        ...prev,
                                        [e.target.name]: e.target.value
                                    }))
                                }
                                onSubmit={(e) => {
                                    e.preventDefault();

                                    // 🚫 Bloquear préstamo si ya está vendido
                                    if (bodega.estatus === 'Vendido') {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'No se puede registrar el préstamo',
                                            text: 'Este material ha sido vendido y ya no está disponible para préstamo.',
                                        });
                                        return;
                                    }

                                    // Validación de cantidad
                                    if (parseInt(formPrestamos.cantidad) > parseInt(bodega.cantidad)) {
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Cantidad excedida',
                                            text: `Solo hay ${bodega.cantidad} disponibles.`,
                                        });
                                        return;
                                    }

                                    waitAlert('Registrando préstamo...');

                                    apiPostForm(`v1/proyectos/bodegas/${bodega.id}/prestamo`, formPrestamos, access_token)
                                        .then(async () => {
                                            await apiPutForm(
                                                `v1/proyectos/bodegas/estatus/${bodega.id}/estatus`,
                                                { estatus: 'No disponible' },
                                                access_token
                                            );

                                            doneAlert('Préstamo registrado y estatus actualizado');
                                            toggleModal('prestamos');
                                            fetchBodega();
                                        })
                                        .catch((error) => {
                                            printResponseErrorAlert(error);
                                        });
                                }}
                                formeditado={1}
                                options={options}
                            />
                        </>
                    )}
                </Modal>


                <Modal size="xl" title={bodega ? `Detalles de ${bodega.nombre}` : 'Detalles'} show={modal.ver} handleClose={() => toggleModal('ver')}>
                    {bodega && <BodegaCard bodega={bodega} />}
                </Modal>

                <Modal
                    size="xl"
                    title={'Historial'}
                    show={modal.historial}
                    handleClose={() => toggleModal('historial')}
                >
                    <HistorialHM
                        deletePrestamo={deletePrestamo}
                        deleteDevolucion={deleteDevolucion}

                        data={bodegaDetalle}
                        form={{}}
                        onChange={() => { }}
                        onSubmit={() => { }}
                        onDevolucion={(prestamo) => {
                            // 1. Cierra el modal de historial
                            setModal(prev => ({ ...prev, historial: false }));

                            // 2. Espera un poco y abre el de devolución
                            setTimeout(() => {
                                setPrestamoSeleccionado(prestamo);
                                setModalDevolucion(true);
                            }, 300); // puedes ajustar el delay si quieres una transición más suave
                        }}
                        onReasignar={(prestamo) => {
                            setModal(prev => ({ ...prev, historial: false }));
                            setTimeout(() => {
                                setPrestamoSeleccionado(prestamo);
                                setModalReasignar(true); // este modal lo defines tú
                            }, 300);
                        }}


                    />


                </Modal>
                <ModalEstatus
                    open={modal.estatus}
                    onClose={() => toggleModal('estatus')}
                    nuevoEstatus={nuevoEstatus}
                    setNuevoEstatus={setNuevoEstatus}
                    handleSubmitEstatus={handleSubmitEstatus}
                />

                {modalDevolucion && prestamoSeleccionado && (
                    <Modal
                        size="lg"
                        title="Registrar devolución"
                        show={modalDevolucion}
                        handleClose={() => setModalDevolucion(false)}
                    >
                        <PestamosDevoluciones
                            bodega={bodegaDetalle}
                            form={formDevoluciones}
                            setForm={setFormDevoluciones}
                            data={data}
                            onChange={(e) =>
                                setFormDevoluciones(prev => ({
                                    ...prev,
                                    [e.target.name]: e.target.value
                                }))
                            }
                            onSubmit={async (e, prestamo) => {
                                e.preventDefault();

                                const data = new FormData();
                                data.append('responsable', formDevoluciones.responsable);
                                const fechaISO = new Date(formDevoluciones.fecha).toISOString().split('T')[0];
                                data.append('fecha', fechaISO);
                                data.append('comentarios', formDevoluciones.comentario);
                                data.append('ubicacion', formDevoluciones.ubicacion || '');
                                data.append('cantidad', 1);

                                if (formDevoluciones.adjuntos?.length > 0) {
                                    formDevoluciones.adjuntos.forEach(file => {
                                        data.append('adjuntos[]', file);
                                    });
                                }

                                try {
                                    waitAlert();

                                    const res = await apiPostForm(
                                        `v1/proyectos/bodegas/${prestamo.bodega_id}/prestamo/${prestamo.id}/devolucion`,
                                        data,
                                        access_token
                                    );

                                    doneAlert(res.message || 'Devolución registrada correctamente');

                                    setFormDevoluciones({
                                        fecha: new Date(),
                                        responsable: '',
                                        comentario: '',
                                        ubicacion: '',
                                        existencia: '',
                                        adjuntos: []
                                    });

                                    const resPrestamo = await apiGet(`v1/proyectos/bodegas/prestamos/${prestamo.id}`, access_token);

                                    setBodegaDetalle(prev => ({
                                        ...prev,
                                        prestamos: prev.prestamos?.map(p =>
                                            p.id === resPrestamo.data.id ? resPrestamo.data : p
                                        ) || [resPrestamo.data]
                                    }));

                                    setPrestamoSeleccionado(resPrestamo.data);

                                    // ✅ Ya no se restaura estatus aquí. Lo hace el backend automáticamente si se devuelve todo.
                                    console.log('🔁 El backend se encarga de restaurar el estatus si aplica.');

                                    setModalDevolucion(false);
                                    setModal(prev => ({ ...prev, historial: false }));
                                    fetchBodega();

                                } catch (error) {
                                    printResponseErrorAlert(error);
                                }
                            }}

                            deletePrestamo={deletePrestamo}
                            deleteDevolucion={deleteDevolucion}
                            tipo="material"
                        />
                    </Modal>


                )}
                <ModalReasignar
                    modalReasignar={modalReasignar}
                    setModalReasignar={setModalReasignar}
                    prestamoSeleccionado={prestamoSeleccionado}
                    formReasignacion={formReasignacion}
                    setFormReasignacion={setFormReasignacion}
                    handleSubmitReasignar={handleSubmitReasignar}
                />
                <Modal size="md" title="Importar Excel" show={importOpen} handleClose={() => { setImportOpen(false); setExcelFile(null); setImportRes(null); }}>
                    <Box display="grid" gap={2}>
                        <input type="file" accept=".xlsx,.xls" onChange={(e) => setExcelFile(e.target.files?.[0] || null)} />
                        <Box display="flex" justifyContent="flex-end" gap={1}>
                            <Button variant="contained" disabled={!excelFile} onClick={async () => {
                                try {
                                    waitAlert('Importando...');
                                    const fd = new FormData();
                                    fd.append('file', excelFile);
                                    const res = await apiPostForm('v1/proyectos/bodegas/import', fd, access_token);
                                    doneAlert('Importación lista');
                                    setImportRes(res.data);
                                    fetchBodega();
                                } catch (err) { printResponseErrorAlert(err); }
                            }}>
                                Subir
                            </Button>
                        </Box>

                        {importRes && (
                            <Box>
                                <Typography variant="body2">Insertados: {importRes.insertados ?? 0}</Typography>
                                <Typography variant="body2">Actualizados: {importRes.actualizados ?? 0}</Typography>
                                {!!(importRes.errores?.length) && (
                                    <Box mt={1}>
                                        <Typography variant="body2" fontWeight={700}>Errores:</Typography>
                                        <ul style={{ margin: 0 }}>
                                            {importRes.errores.map((e, i) => (<li key={i} style={{ fontSize: 12 }}>Fila {e.fila}: {e.error}</li>))}
                                        </ul>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>
                </Modal>





            </Box>
        </Layout>
    );
}
