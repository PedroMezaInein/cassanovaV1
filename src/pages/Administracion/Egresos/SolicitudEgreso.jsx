import React, {useState, useEffect} from 'react'
import Swal from 'sweetalert2'

import { Modal } from '../../../components/singles'

import TablaGeneral from '../../../components/NewTables/TablaGeneral/TablaGeneral'

import Convertir from './Modales/Convertir'
import Editar from './Modales/Editar'
import Adjuntos from './Modales/Adjuntos'
import Ver from './Modales/Ver'

import useOptionsArea from '../../../hooks/useOptionsArea'


export default function SolicitudEgreso() {
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
        { nombre: 'Descripcion', identificador: 'descripcion', sort: false, stringSearch: false },
        { nombre: 'Tipo de pago', identificador: 'tipoPago', sort: false, stringSearch: false },
        { nombre: 'Monto solicitado', identificador: 'monto', sort: false, stringSearch: false },
        { nombre: 'Estatus', identificador: 'estatus', sort: false, stringSearch: false },
        { nombre: 'Aprobacion', identificador: 'aprobacion', sort: false, stringSearch: false },
        
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
        console.log(data)
        data.Requisiciones.map((item, index) => {
            aux.push({
                id: item.id,
                acciones: createAcciones(),
                solicitante: item.solicitante.name,
                solicitante_id: item.solicitante.id,
                fecha: item.fecha,
                departamento: item.departamento.nombre,
                departamento_id: item.departamento.id,
                tipoEgreso: item.gasto.nombre,
                tipoEgreso_id: item.gasto.id,
                descripcion: item.descripcion,
                monto: item.monto_pago,
                estatus: item.estatus === 5 ? 'Pendiente' : item.estatus === null ? 'Pendiente' : 'Aprobado',
                aprobacion: createtagaprobaciones(item)
            })
        })

        return aux

    }

    let createtagaprobaciones = (item) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {item.auto1 === 1 ? <span style={{ color: 'green' }}>Aprobado</span> : item.auto1 === 0 ? <span style={{ color: 'red' }}>Rechazado</span> : <span style={{ color: 'orange' }}>Pendiente</span>}
                <br />
                {item.auto2 === 1 ? <span style={{ color: 'green' }}>Aprobado</span> : item.auto2 === 0 ? <span style={{ color: 'red' }}>Rechazado</span> : <span style={{ color: 'orange' }}>Pendiente</span>}
                <br />
                {item.auto3 === 1 ? <span style={{ color: 'green' }}>Aprobado</span> : item.auto3 === 0 ? <span style={{ color: 'red' }}>Rechazado</span> : <span style={{ color: 'orange' }}>Pendiente</span>}
            </div>
        )
    }

    const createAcciones = () => {
        let aux = [
            {
                nombre: 'Convertir',
                icono: 'fas fa-shopping-cart',
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

    let handleClose = (tipo) => () => {
        setModal({
            ...modal,
            [tipo]: {
                show: false,
                data: false
            }
        })
    }

   
    

    return (
        <>
            <TablaGeneral titulo='Solicitud de Egreso' columnas={columnas} url='requisicion' ProccessData={ProccessData} numItemsPagina={12} acciones={createAcciones()} opciones={opciones} />

            <Modal size="lg" title={"Aprobar Requisicion de compra"} show={modal.convertir.show} handleClose={handleClose('convertir')}>
                <Convertir data={modal.convertir.data} />
            </Modal>

            <Modal size="lg" title={"Editar requisicion"} show={modal.editar.show} handleClose={handleClose('editar')}>
                <Editar data={modal.editar.data} />
            </Modal>

            <Modal size="lg" title={"Nueva requisicion"} show={modal.crear.show} handleClose={handleClose('crear')}>
                
            </Modal>

            <Modal size="lg" title={"Adjuntos"} show={modal.adjuntos.show} handleClose={handleClose('adjuntos')}>
                <Adjuntos data={modal.adjuntos.data} />
            </Modal>

            <Modal size="md" title={"Ver requisicion"} show={modal.ver.show} handleClose={handleClose('ver')}>
                <Ver data={modal.ver.data} />
            </Modal>

        </>
    )
}