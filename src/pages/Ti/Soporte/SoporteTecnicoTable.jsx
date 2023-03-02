import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'

import { Modal } from '../../../components/singles'
import TablaGeneral from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import { apiDelete } from '../../../functions/api'
import { setOptions } from '../../../functions/setters'
import useOptionsArea from '../../../hooks/useOptionsArea'
import Layout from '../../../components/layout/layout'

import Adjuntos from './Adjuntos/Adjuntos'

export default function SoporteTecnicoTable() {
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
        adjuntos: {
            show: false,
            data: false
        }

    })

    let prop = {
        pathname: '/ti/soporte',
    }

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'F. creacion', identificador: 'fecha' },
        { nombre: 'F. servicio', identificador: 'fecha_servicio' },
        { nombre: 'Tipo', identificador: 'tipo' },
        { nombre: 'Estatus', identificador: 'estatus' },
        { nombre: 'Autorización', identificador: 'autorizacion' },
    ];

    const ProccessData = (data) => {
        let aux = [
            { fecha: "02/10/2020", fecha_servicio: "02/10/2020", tipo: "Mantenimiento", estatus: "Pendiente", autorizacion: "Pendiente" },
            { fecha: "02/10/2020", fecha_servicio: "02/10/2020", tipo: "Mantenimiento", estatus: "Pendiente", autorizacion: "Pendiente" },
            { fecha: "02/10/2020", fecha_servicio: "02/10/2020", tipo: "Mantenimiento", estatus: "Pendiente", autorizacion: "Pendiente" },
            { fecha: "02/10/2020", fecha_servicio: "02/10/2020", tipo: "Mantenimiento", estatus: "Pendiente", autorizacion: "Pendiente" },
            { fecha: "02/10/2020", fecha_servicio: "02/10/2020", tipo: "Mantenimiento", estatus: "Pendiente", autorizacion: "Pendiente" },
            { fecha: "02/10/2020", fecha_servicio: "02/10/2020", tipo: "Mantenimiento", estatus: "Pendiente", autorizacion: "Pendiente" },
            { fecha: "02/10/2020", fecha_servicio: "02/10/2020", tipo: "Mantenimiento", estatus: "Pendiente", autorizacion: "Pendiente" },
            { fecha: "02/10/2020", fecha_servicio: "02/10/2020", tipo: "Mantenimiento", estatus: "Pendiente", autorizacion: "Pendiente" },
        ]
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
            {
                nombre: 'Adjuntos',
                icono: 'fas fa-paperclip',
                color: 'blueButton',
                funcion: (item) => {
                    handleOpenModal('adjuntos', item)
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

    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='ti'>
                <>
                    <TablaGeneral titulo='Soporte ' columnas={columnas} url='vehiculos' ProccessData={ProccessData} numItemsPagina={10} acciones={createAcciones()} reload={setReloadTable} />
                </>
            </Layout>

            <Modal size="md" show={modal.editar.show} handleClose={() => setModal({ ...modal, editar: { show: false, data: false } })} title='Editar ticket'>
                
            </Modal>

            <Modal show={modal.ver.show} handleClose={() => setModal({ ...modal, ver: { show: false, data: false } })} title='Ver ticket'>
                
            </Modal>

            <Modal size="lg" show={modal.adjuntos.show} handleClose={() => setModal({ ...modal, adjuntos: { show: false, data: false } })} title='Adjuntos'>
                <Adjuntos />
            </Modal>
        </>
    );
}