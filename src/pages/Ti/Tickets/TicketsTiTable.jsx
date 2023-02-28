import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'

import { Modal } from '../../../components/singles'
import TablaGeneral from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import { apiDelete } from '../../../functions/api'
import { setOptions } from '../../../functions/setters'
import useOptionsArea from '../../../hooks/useOptionsArea'
import Layout from '../../../components/layout/layout'

import EditarTicketTi from './Modales/EditarTicketTi'

export default function TicketsUserTable() {
    const userAuth = useSelector((state) => state.authUser);
    const [reloadTable, setReloadTable] = useState(false)
    const [modal, setModal] = useState({
        editar: {
            show: false,
            data: false
        },
        ver: {
            show: false,
            data: false
        },
    })

    let prop = {
        pathname: '/ti/tickets-ti',
    }

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Fecha', identificador: 'fecha' },
        { nombre: 'Tipo', identificador: 'tipo' },
        { nombre: 'Estatus', identificador: 'estatus' },
        { nombre: 'F. de entrega', identificador: 'fecha_entrega' },
        { nombre: 'Autorización', identificador: 'autorizacion' },
    ];

    const ProccessData = (data) => {
        let aux = [
            { fecha: '2021-01-01', tipo: 'Módulo', estatus: 'Solicitada', fecha_entrega: '2021-01-01', autorizacion: 'Autorizado' },
            { fecha: '2021-01-01', tipo: 'Funcionalidad', estatus: 'En desarrollo', fecha_entrega: '2021-01-01', autorizacion: 'Autorizado' },
            { fecha: '2021-01-01', tipo: 'Módulo', estatus: 'Solicitada', fecha_entrega: '2021-01-01', autorizacion: 'Autorizado' },
            { fecha: '2021-01-01', tipo: 'Funcionalidad', estatus: 'En desarrollo', fecha_entrega: '2021-01-01', autorizacion: 'Autorizado' },
            { fecha: '2021-01-01', tipo: 'Módulo', estatus: 'Solicitada', fecha_entrega: '2021-01-01', autorizacion: 'Autorizado' },
            { fecha: '2021-01-01', tipo: 'Funcionalidad', estatus: 'En desarrollo', fecha_entrega: '2021-01-01', autorizacion: 'Autorizado' },
        ]
        return aux
    }

    const createAcciones = () => {
        return [
            {
                nombre: 'Editar',
                icono: 'fas fa-edit',
                color: 'blueButton',
                funcion: (item) => {
                    handleOpenModal('editar', item)
                }
            },
            {
                nombre: 'Ver',
                icono: 'fas fa-eye',
                color: 'blueButton',
                funcion: (item) => {
                    handleOpenModal('ver', item)
                }
            },
        ]
    }

    const handleOpenModal = (modal, data) => { 
        setModal({
            ...modal,
            [modal]: {
                show: true,
                data: data
            }
        })
    }

    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='ti'>
                <>
                    <TablaGeneral titulo='Tickets' columnas={columnas} url='vehiculos' ProccessData={ProccessData} numItemsPagina={8} acciones={createAcciones()} reload={setReloadTable} />
                </>
            </Layout>

            <Modal show={modal.editar.show} handleClose={() => setModal({ ...modal, editar: { show: false, data: false } })} titulo='Editar ticket'>
                <EditarTicketTi data={modal.editar.data} />
            </Modal>

            <Modal show={modal.ver.show} handleClose={() => setModal({ ...modal, ver: { show: false, data: false } })} titulo='Ver ticket'>
                <EditarTicketTi data={modal.ver.data} />
            </Modal>
        </>
    );
}