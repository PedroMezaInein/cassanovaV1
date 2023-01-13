import React, { useState, useEffect } from 'react'
import {useSelector} from 'react-redux'
import Swal from 'sweetalert2'

import { Modal } from '../../../components/singles'

import TablaGeneral from '../../../components/NewTables/TablaGeneral/TablaGeneral'

import Convertir from './Modales/Convertir'
import Editar from './Modales/Editar'
import Adjuntos from './Modales/Adjuntos'
import Ver from './Modales/Ver'
import Crear from './../../../components/forms/administracion/NuevaRequisicion'

import useOptionsArea from '../../../hooks/useOptionsArea'

import Layout from '../../../components/layout/layout'

export default function RequisicionCompras() { 
    const userAuth = useSelector((state) => state.authUser);
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
    })

    useOptionsArea()

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Solicitante', identificador: 'solicitante', sort: false, stringSearch: false },
        { nombre: 'Fecha', identificador: 'fecha', sort: false, stringSearch: false },
        { nombre: 'Departamento', identificador: 'departamento', sort: false, stringSearch: false },
        { nombre: 'Tipo de Egreso', identificador: 'tipoEgreso', sort: false, stringSearch: false },
        { nombre: 'Descripción', identificador: 'descripcion', sort: false, stringSearch: false },
        { nombre: 'Tipo de pago', identificador: 'tipoPago', sort: false, stringSearch: false },
        { nombre: 'Monto solicitado', identificador: 'monto_solicitado', sort: false, stringSearch: false },
        { nombre: 'Estatus', identificador: 'estatus', sort: false, stringSearch: false },
        { nombre: 'Aprobación', identificador: 'aprobacion', sort: false, stringSearch: false },

    ]

    const opciones = [
        {
            nombre: 'Solicitar nueva Requisicion',
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

    let ProccessData = (data) => {
        console.log(data)
        let aux = []
        data.Requisiciones.map((item, index) => {
            aux.push({
                id: item.id,
                acciones: createAcciones(),
                solicitante: item.solicitante.name,
                solicitante_id: item.solicitante.id,
                fecha: item.fecha,
                departamento: item.departamento ? item.departamento.nombre : null,
                departamento_id: item.departamento ? item.departamento.id : null, 
                tipoEgreso: item.gasto ? item.gasto.nombre : 'no definido',
                tipoEgreso_id: item.gasto ? item.gasto.id : null,
                tipoSubEgreso: item.subarea ? item.subarea.nombre : 'No definido',
                tipoSubEgreso_id: item.subarea ? item.subarea.id : null,
                descripcion: item.descripcion,
                tipoPago: item.pago ? item.pago.tipo : 'No definido',
                tipoPago_id: item.pago ? item.pago.id : null,
                monto_solicitado: item.cantidad,
                monto: item.monto_pago,
                estatus: item.estatus ? item.estatus.estatus : 'Pendiente',
                aprobacion: createtagaprobaciones(item),
                auto1: item.auto1,
                auto2: item.auto2,
                orden_compra: item.orden_compra,
                fecha_pago: item.fecha_pago,
                cuenta: item.cuenta,
                id_estatus: item.estatus ?  item.estatus.id : null
                /* estatus_admin: item.estatus_admin ? item.estatus_admin.nombre : 'Pendiente',
                estatus_compra: item.estatus_compra ? item.estatus_compra.nombre : 'Pendiente',
                estatus_conta: item.estatus_conta ? item.estatus_conta.nombre : 'Pendiente',
                id_estatus_admin: item.id_estatus_admin ? item.id_estatus_admin : null,
                id_estatus_compra: item.id_estatus_compra ? item.id_estatus_compra : null,
                id_estatus_conta: item.id_estatus_conta ? item.id_estatus_conta : null, */
            })
        })
        return aux

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
                    setModal({
                        ...modal,
                        convertir: {
                            show: true,
                            data: item
                        }
                    })
                }
            },
            {
                nombre: 'Editar',
                icono: 'fas fa-edit',
                color: 'blueButton',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        editar: {
                            show: true,
                            data: item
                        }
                    })
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

    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='administracion'>
                <>
                    <TablaGeneral titulo='Solicitudes de Gasto' columnas={columnas} url='requisicion' ProccessData={ProccessData} numItemsPagina={12} acciones={createAcciones()} opciones={opciones} />
                </>
            </Layout>
            
            <Modal size="lg" title={"Aprobar Requisicion de compra"} show={modal.convertir.show} handleClose={handleClose('convertir')}>
                <Convertir data={modal.convertir.data} handleClose={handleClose('convertir')} />
            </Modal>

            <Modal size="lg" title={"Editar requisicion"} show={modal.editar.show} handleClose={handleClose('editar')}>
                <Editar data={modal.editar.data} handleClose={handleClose('editar')} />
            </Modal>

            <Modal size="lg" title={"Nueva requisicion"} show={modal.crear.show} handleClose={handleClose('crear')}>
                <Crear />
            </Modal>

            <Modal size="lg" title={"Adjuntos"} show={modal.adjuntos.show} handleClose={handleClose('adjuntos')}>
                <Adjuntos data={modal.adjuntos.data} nuevaRequisicion={false} />
            </Modal>
            
            <Modal size="md" title={"Ver requisición"} show={modal.ver.show} handleClose={handleClose('ver')}>
                <Ver data={modal.ver.data} />
            </Modal>

        </>
    )
}