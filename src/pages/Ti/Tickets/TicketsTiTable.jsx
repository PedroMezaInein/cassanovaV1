import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Modal } from '../../../components/singles'
import TablaGeneral from '../../../components/NewTables/TablaGeneral/TablaGeneral'

import Layout from '../../../components/layout/layout'

import EditarTicketTi from './Modales/EditarTicketTi'
import VerTicketTi from './Modales/VerTicketTi'
import Nuevo from './NuevoTicket.jsx'
import Funcionalidades from './Modales/Funcionalidades'

import Style from './Modales/TicketsTi.module.css'

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
        funcionalidades: {
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
        { nombre: 'Departamento', identificador: 'depto_show' },
        { nombre: 'Tipo', identificador: 'tipo_view' },
        { nombre: 'Estatus', identificador: 'estatus_view' },
        { nombre: 'F. de entrega', identificador: 'fecha_entrega_view' },
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
                fecha_entrega_view: item.fecha_entrega ? reformatDate(item.fecha_entrega) : 'pendiente',
                tipo: item.tipo,
                tipo_view: setTipo(item.tipo) ,
                estatus: item.estatus,
                estatus_view: setEstatus(item.estatus) ,
                autorizacion: item.autorizacion,
                auto_view: item.autorizacion ? <span className={Style.autorizado}>Aprobado</span> : <span className={Style.pendiente}>pendiente</span>,
                descripcion: item.descripcion,
                funcionalidades: item.funcionalidades,
                departamento: item.departamento,
                id_departamento: item.departamento ? item.departamento.id : null,
                depto_show: item.departamento ? item.departamento.nombre : 'Sin departamento',
                id_solicitante: item.id_solicitante,
            })
            return true
        })
        aux = aux.reverse()
        return aux
    }


    const setTipo = (data) => {
        if (data === '0') {
            return 'cambio'
        } else if (data === '1') {
            return 'soporte'
        } else if (data === '2') {
            return 'mejora'
        } else if (data === '3') {
            return 'reporte'
        } else if (data === '4') {
            return 'información'
        } else if (data === '5') {
            return 'capacitación'
        } else if (data === '6') {
            return 'funcionalidad'
        } else if (data === '7') {
            return 'proyecto'
        }
    }

    const setEstatus = (data) => {
        if (data === '0') {
            return 'Solicitado'
        } else if (data === '1') {
            return 'Solicitado'
        } else if (data === '2') {
            return 'En desarrollo'
        } else if (data === '3') {
            return 'Terminado'
        } else if (data === '4') {
            return 'Cancelado'
        } else if (data === '5') {
            return 'Rechazado'
        }
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

            {
                modal.editar.data &&
                <Modal size="md" show={modal.editar.show} handleClose={() => setModal({ ...modal, editar: { show: false, data: false } })} title='Editar ticket'>
                    <EditarTicketTi data={modal.editar.data} reload={reloadTable} handleClose={() => setModal({ ...modal, editar: { show: false, data: false } })} />
                </Modal>
            }



            <Modal show={modal.ver.show} handleClose={() => setModal({ ...modal, ver: { show: false, data: false } })} title='Ver ticket'>
                <VerTicketTi data={modal.ver.data} />
            </Modal>

            <Modal size="lg" show={modal.crear.show} handleClose={() => setModal({ ...modal, crear: { show: false, data: false } })} title='Nuevo mantenimiento'>
                <Nuevo reload={reloadTable} handleClose={() => setModal({ ...modal, crear: { show: false, data: false } })} />
            </Modal>

            <Modal size="lg" show={modal.funcionalidades.show} handleClose={() => setModal({ ...modal, funcionalidades: { show: false, data: false } })} title='Funcionalidades'>
                <Funcionalidades data={modal.funcionalidades.data} reload={reloadTable} handleClose={() => setModal({ ...modal, funcionalidades: { show: false, data: false } })} />
            </Modal>
        </>
    );
}