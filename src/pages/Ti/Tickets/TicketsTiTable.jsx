
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button, Tooltip } from '@mui/material';

import { Modal } from '../../../components/singles';
import Layout from '../../../components/layout/layout';

import EditarTicketTi from './Modales/EditarTicketTi';
import VerTicketTi from './Modales/VerTicketTi';
import Nuevo from './NuevoTicket';
import Funcionalidades from './Modales/Funcionalidades';

import Style from './Modales/TicketsTi.module.css';
import { apiGet } from '../../../functions/api';

export default function TicketsUserTable() {
    const auth = useSelector(state => state.authUser.access_token);
    const userAuth = useSelector(state => state.authUser);

    const [data, setData] = useState([]);
    const [reloadTable, setReloadTable] = useState(false);

    const [modal, setModal] = useState({
        editar: { show: false, data: false },
        ver: { show: false, data: false },
        crear: { show: false, data: false },
        funcionalidades: { show: false, data: false },
    });

    const prop = { pathname: '/ti/tickets-ti' };

    useEffect(() => {
        fetchTickets();
    }, [reloadTable]);

    const fetchTickets = async () => {
        try {
            const res = await apiGet('ti', auth);
            setData(ProccessData(res.data));
        } catch (error) {
            console.error('Error cargando tickets', error);
        }
    };

    const columnas = [
        { accessorKey: 'fecha_view', header: 'Fecha' },
        { accessorKey: 'depto_show', header: 'Departamento' },
        { accessorKey: 'tipo_view', header: 'Tipo' },
        { accessorKey: 'estatus_view', header: 'Estatus' },
        { accessorKey: 'fecha_entrega_view', header: 'F. de entrega' },
        {
            accessorKey: 'auto_view',
            header: 'Autorización',
            Cell: ({ cell }) => <span>{cell.getValue()}</span>
        },
        {
            accessorKey: 'prioridad_view',
            header: 'Prioridad',
            Cell: ({ cell }) => <span>{cell.getValue()}</span>
        },
        {
            accessorKey: 'id_asignacion',
            header: 'Asignación',
        }
    ];

    const ProccessData = (data) => {
        if (!data || !Array.isArray(data.ti)) return [];

        return data.ti.map((item) => ({
            id: item.id,
            fecha: item.fecha,
            fecha_view: reformatDate(item.fecha),
            fecha_entrega_view: item.fecha_entrega ? reformatDate(item.fecha_entrega) : 'pendiente',
            tipo_view: setTipo(item.tipo),
            estatus_view: setEstatus(item.estatus),
            auto_view: item.autorizacion
                ? <span className={Style.autorizado}>Aprobado</span>
                : <span className={Style.pendiente}>pendiente</span>,
            prioridad_view: renderPrioridad(item.prioridad),
            depto_show: item.departamento ? item.departamento.nombre : 'Sin departamento',
            id_asignacion: item.empleado
                ? [item.empleado.nombre, item.empleado.apellido_paterno, item.empleado.apellido_materno].filter(Boolean).join(' ')
                : '',
            raw: item
        })).reverse();
    };

    const reformatDate = (dateStr) => {
        const dArr = dateStr.split("-");
        return `${dArr[2]}/${dArr[1]}/${dArr[0]}`;
    };

    const setTipo = (data) => {
        switch (data) {
            case '1': return '🍠 Capacitación o ayuda técnica';
            case '2': return '⚙️ Problemas con la plataforma';
            case '3': return '🚀 Nuevo proyecto o desarrollo';
            case '4': return '🧑‍💻 Problemas con computadora';
            case '5': return '⚠️ Otro ...';
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
        switch (nivel) {
            case 'alta': return <span className={Style.prioridadAlta}>🔴 Alta</span>;
            case 'media': return <span className={Style.prioridadMedia}>🟡 Media</span>;
            case 'baja': return <span className={Style.prioridadBaja}>🟢 Baja</span>;
            default: return <span className={Style.prioridadBaja}>No definida</span>;
        }
    };

    const handleOpenModal = (tipo, data) => {
        setModal({ ...modal, [tipo]: { show: true, data } });
    };

    return (
        <>
            <Layout authUser={auth} location={prop} history={{ location: prop }} active='ti'>
                <MaterialReactTable
                    columns={columnas}
                    data={data}
                    enableColumnOrdering
                    enablePagination
                    enableDensityToggle
                    enableColumnFilters
                    enableRowActions
                    renderRowActions={({ row }) => (
                        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                            <Button variant="outlined" size="small" onClick={() => handleOpenModal('editar', row.original.raw)}>Editar</Button>
                            <Button variant="outlined" size="small" onClick={() => handleOpenModal('ver', row.original.raw)}>Ver</Button>
                        </Box>
                    )}
                    initialState={{ pagination: { pageSize: 8 } }}
                    muiTablePaginationProps={{
                        rowsPerPageOptions: [8, 25, 50],
                        labelRowsPerPage: 'Tickets por página',
                    }}
                />
            </Layout>

            {modal.editar.data && (
                <Modal size="md" show={modal.editar.show} handleClose={() => setModal({ ...modal, editar: { show: false, data: false } })} title='Editar ticket'>
                    <EditarTicketTi
                        data={modal.editar.data}
                        reload={() => setReloadTable(!reloadTable)}
                        handleClose={() => setModal({ ...modal, editar: { show: false, data: false } })}
                    />
                </Modal>
            )}

            {modal.ver.data && (
                <Modal show={modal.ver.show} handleClose={() => setModal({ ...modal, ver: { show: false, data: false } })} title='Ver ticket'>
                    <VerTicketTi data={modal.ver.data} />
                </Modal>
            )}

            {modal.crear.show && (
                <Modal size="lg" show={modal.crear.show} handleClose={() => setModal({ ...modal, crear: { show: false, data: false } })} title='Nuevo mantenimiento'>
                    <Nuevo
                        reload={() => setReloadTable(!reloadTable)}
                        handleClose={() => setModal({ ...modal, crear: { show: false, data: false } })}
                    />
                </Modal>
            )}

            {modal.funcionalidades.show && (
                <Modal size="lg" show={modal.funcionalidades.show} handleClose={() => setModal({ ...modal, funcionalidades: { show: false, data: false } })} title='Funcionalidades'>
                    <Funcionalidades
                        data={modal.funcionalidades.data}
                        reload={() => setReloadTable(!reloadTable)}
                        handleClose={() => setModal({ ...modal, funcionalidades: { show: false, data: false } })}
                    />
                </Modal>
            )}
        </>
    );
}
