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
import VerTicketTi from './Modales/VerTicketTi'
import Nuevo from './NuevoTicket.jsx'

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
        crear: {
            show: false,
            data: false
        },
    })

    let prop = {
        pathname: '/ti/tickets-ti',
    }

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Fecha', identificador: 'fecha_view' },
        { nombre: 'Tipo', identificador: 'tipo_view' },
        { nombre: 'Estatus', identificador: 'estatus_view' },
        { nombre: 'F. de entrega', identificador: 'gecha_entrega_view' },
        { nombre: 'Autorización', identificador: 'auto_view' },
    ];

    const ProccessData = (data) => {
        let aux = []

        data.ti.map((item) => {
            aux.push({
                id: item.id,
                fecha: item.fecha,
                fecha_view: reformatDate(item.fecha),
                fecha_entrega: item.fecha_entrega,
                gecha_entrega_view: item.fecha_entrega ? reformatDate(item.fecha_entrega) : 'pendiente',
                tipo: item.tipo,
                tipo_view: item.tipo ? item.tipo : 'Requerimiento',
                estatus: item.estatus,
                estatus_view: item.estatus ? item.estatus : 'Pendiente',
                fecha_entrega: item.fecha_entrega,
                autorizacion: item.autorizacion,
                auto_view: item.autorizacion ? item.autorizacion : 'Pendiente',
                descripcion: item.descripcion,
                funcionalidades: item.funcionalidades,
            })
        })
        return aux
    }

    function reformatDate(dateStr) {
        var dArr = dateStr.split("-");  // ex input: "2010-01-18"
        return dArr[2] + "/" + dArr[1] + "/" + dArr[0]/* .substring(2) */; //ex output: "18/01/10"
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

    const handleOpenModal = (tipo, data) => { 
        setModal({
            ...modal,
            [tipo]: {
                show: true,
                data: data
            }
        })
    }

    const opciones = [
        {
            nombre: 'Nuevo soporte',
            funcion: (item) => {
                setModal({
                    ...modal,
                    crear: {
                        show: true,
                        data: item
                    }
                })
            }
        },
    ]

    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='ti'>
                <>
                    <TablaGeneral titulo='Tickets TI' columnas={columnas} url='ti' ProccessData={ProccessData} numItemsPagina={8} acciones={createAcciones()} reload={setReloadTable} opciones={opciones} />
                </>
            </Layout>

            <Modal size="md" show={modal.editar.show} handleClose={() => setModal({ ...modal, editar: { show: false, data: false } })} title='Editar ticket'>
                <EditarTicketTi data={modal.editar.data} />
            </Modal>

            <Modal show={modal.ver.show} handleClose={() => setModal({ ...modal, ver: { show: false, data: false } })} title='Ver ticket'>
                <VerTicketTi data={modal.ver.data} />
            </Modal>

            <Modal size="lg" show={modal.crear.show} handleClose={() => setModal({ ...modal, crear: { show: false, data: false } })} title='Nuevo mantenimiento'>
                <Nuevo reload={reloadTable} handleClose={() => setModal({ ...modal, crear: { show: false, data: false } }) } />
            </Modal>
        </>
    );
}