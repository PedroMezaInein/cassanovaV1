import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Box, Button } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';

import { apiGet } from '../../../functions/api';
import { Modal } from '../../../components/singles';
import Layout from '../../../components/layout/layout';

import NuevoTicket from './NuevoTicket';
import EditarTicket from './EditarTicket';
import VerTicket from './VerTicket';
import AprobarTicket from './Modales/AprobarTicket';

import Style from './Modales/TicketsTi.module.css';

export default function TicketsUserTable() {
    const auth = useSelector(state => state.authUser.access_token);
    const userAuth = useSelector(state => state.authUser);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reloadTable, setReloadTable] = useState(false);

    const [modal, setModal] = useState({
        crear: { show: false, data: false },
        editar: { show: false, data: false },
        ver: { show: false, data: false },
        aprobar: { show: false, data: false },
        cancelar: { show: false, data: false },
    });

    const prop = { pathname: '/ti/tickets-usuario' };

    useEffect(() => {
        fetchTickets();
    }, [reloadTable]);

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const res = await apiGet('ti', auth);
            let processed = ProccessData(res.data);

            // ✅ Ordena por fecha DESC (más nuevo primero)
            processed.sort((a, b) => {
                // Asegúrate que 'fecha' sea tipo Date o YYYY-MM-DD
                return new Date(b.fecha) - new Date(a.fecha);
            });

            setData(processed);
        } catch (error) {
            console.error('Error al cargar tickets:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const ProccessData = (data) => {
        return data.ti.map((item) => ({
            id: item.id,
            nombre: item.solicitante ? item.solicitante.name : '',
            fecha: item.fecha,
            tipo_view: setTipo(item.tipo),
            estatus_view: setEstatus(item.estatus),
            aprobacion: item.autorizacion
                ? <span className={Style.autorizado}>Aprobado</span>
                : <span className={Style.pendiente}>pendiente</span>,
            fecha_entrega: item.fecha_entrega || 'por definir',
            prioridad_view: renderPrioridad(item.prioridad),
            id_asignacion: item.empleado
                ? [item.empleado.nombre, item.empleado.apellido_paterno, item.empleado.apellido_materno].filter(Boolean).join(' ')
                : '',
            raw: item
        }));
    };

    const setTipo = (data) => {
        switch (data) {
            case '1': return '🍠 Capacitación o ayuda técnica';
            case '2': return '⚙️ Problemas con la plataforma';
            case '3': return '🚀 Nuevo proyecto o desarrollo';
            case '4': return '🧑‍💻 Problemas con computadora';
            case '5': return '⚠️ Otro...';
            default: return '';
        }
    };

    const setEstatus = (data) => {
        switch (data) {
            case '0':
            case '1': return 'Solicitado';
            case '2': return 'En desarrollo';
            case '3': return 'Terminado';
            case '4': return 'Cancelado';
            case '5': return 'Rechazado';
            default: return '';
        }
    };

    const renderPrioridad = (nivel) => {
        if (nivel === 'alta') return <span className={Style.prioridadAlta}>🔴 Alta</span>;
        if (nivel === 'media') return <span className={Style.prioridadMedia}>🟡 Media</span>;
        if (nivel === 'baja') return <span className={Style.prioridadBaja}>🟢 Baja</span>;
        return <span className={Style.prioridadBaja}>No definida</span>;
    };

    const handleOpenModal = (tipo, data) => {
        setModal({ ...modal, [tipo]: { show: true, data } });
    };

    const columnas = [
        { accessorKey: 'nombre', header: 'Nombre' },
        { accessorKey: 'fecha', header: 'Fecha' },
        { accessorKey: 'tipo_view', header: 'Tipo' },
        { accessorKey: 'estatus_view', header: 'Estatus' },
        {
            accessorKey: 'aprobacion',
            header: 'Autorización',
            Cell: ({ cell }) => <>{cell.getValue()}</>
        },
        { accessorKey: 'fecha_entrega', header: 'F. de entrega' },
        {
            accessorKey: 'prioridad_view',
            header: 'Prioridad',
            Cell: ({ cell }) => <>{cell.getValue()}</>
        },
        { accessorKey: 'id_asignacion', header: 'Asignación' }
    ];

    return (
        <Layout authUser={auth} location={prop} history={{ location: prop }} active="ti">
            <MaterialReactTable
                columns={columnas}
                data={data}
                enableColumnOrdering
                enablePagination
                enableDensityToggle
                enableColumnFilters
                enableRowActions
                state={{ isLoading }}
                renderRowActions={({ row }) => (
                    <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                                if (row.original.estatus === '0') {
                                    Swal.fire({ icon: 'error', title: 'Oops...', text: 'Ya fue autorizado' });
                                } else {
                                    handleOpenModal('aprobar', row.original.raw);
                                }
                            }}
                        >
                            Aprobar
                        </Button>
                        <Button variant="outlined" size="small" onClick={() => handleOpenModal('ver', row.original.raw)}>
                            Ver
                        </Button>
                    </Box>
                )}
                renderTopToolbarCustomActions={() => (
                    <Button variant="contained" color="primary" onClick={() => handleOpenModal('crear')}>
                        Nuevo ticket
                    </Button>
                )}
                initialState={{
                    pagination: {
                        pageSize: 10,
                        pageIndex: 0, // 👈 SIEMPRE empieza en página 1 (índice 0)
                    },
                    sorting: [
                        {
                            id: 'fecha', // 👈 Nombre de tu columna clave
                            desc: true,  // 👈 Orden DESC: más recientes primero
                        },
                    ],
                }}
                muiTablePaginationProps={{
                    rowsPerPageOptions: [10, 20, 50],
                    labelRowsPerPage: 'Tickets por página',
                }}
            />


            <Modal size="lg" title="Nuevo ticket" show={modal.crear.show} handleClose={() => setModal({ ...modal, crear: { show: false, data: false } })}>
                <NuevoTicket handleClose={() => setModal({ ...modal, crear: { show: false, data: false } })} reload={() => setReloadTable(!reloadTable)} />
            </Modal>

            <Modal size="lg" title="Editar ticket" show={modal.editar.show} handleClose={() => setModal({ ...modal, editar: { show: false, data: false } })}>
                <EditarTicket data={modal.editar.data} handleClose={() => setModal({ ...modal, editar: { show: false, data: false } })} reload={() => setReloadTable(!reloadTable)} />
            </Modal>

            <Modal size="lg" title="Ver ticket" show={modal.ver.show} handleClose={() => setModal({ ...modal, ver: { show: false, data: false } })}>
                <VerTicket data={modal.ver.data} handleClose={() => setModal({ ...modal, ver: { show: false, data: false } })} reload={() => setReloadTable(!reloadTable)} />
            </Modal>

            <Modal size="md" title="Aprobar funcionalidades" show={modal.aprobar.show} handleClose={() => setModal({ ...modal, aprobar: { show: false, data: false } })}>
                <AprobarTicket data={modal.aprobar.data} handleClose={() => setModal({ ...modal, aprobar: { show: false, data: false } })} reload={() => setReloadTable(!reloadTable)} />
            </Modal>
        </Layout>
    );
}
