import React, {useState} from 'react'
import Swal from 'sweetalert2'

import { Modal } from '../../../components/singles'

import TablaGeneral from '../../../components/NewTables/TablaGeneral/TablaGeneral'

import Convertir from './Modales/Convertir'
import Editar from './Modales/Editar'
import Adjuntos from './Modales/Adjuntos'
import Ver from './Modales/Ver'


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
        let aux = [
            {
                solicitante: 'Juan Perez',
                fecha: '2020-10-10',
                departamento: 'Proyectos',
                tipoEgreso: 'Gasto',
                descripcion: 'Compra de materiales',
                tipoPago: 'Efectivo',
                monto: '$ 1000.00',
                status: 'Pendiente',
                estatus: <span className="pendiente" style={{ backgroundColor: 'gray', color: 'white' }}>Pendiente</span>,
            },
            {
                solicitante: 'Susana Lopez',
                fecha: '2020-08-10',
                departamento: 'Calidad',
                tipoEgreso: 'Gasto',
                descripcion: 'Compra de pintura por vicio de calidad',
                tipoPago: 'Transferencia',
                monto: '$ 2500.00',
                status: 'Pendiente',
                estatus: <span className="pendiente" style={{ backgroundColor: 'gray', color: 'white' }}>Pendiente</span>,
            },
            {
                solicitante: 'Diego Martinez',
                fecha: '2020-09-10',
                departamento: 'Marketing',
                tipoEgreso: 'Gasto',
                descripcion: 'Anuncio en RRSSdfghhdfhdhdfhdfhdh lorem lorem waijndlkawndlkanwldinalindlianwdlnalidnlianlkdnwqa',
                tipoPago: 'Efectivo',
                monto: '$ 500.00',
                status: 'Pre-autorizado',
                estatus: <span className="pre-autorizado" style={{ backgroundColor: 'yellow', color: 'black' }}>Pre-autorizado</span>,
            },
            {
                solicitante: 'Maria Garcia',
                fecha: '2020-10-10',
                departamento: 'Ventas',
                tipoEgreso: 'Gasto',
                descripcion: 'Cena de negocios',
                tipoPago: 'Efectivo',
                monto: '$ 1000.00',
                status: 'Autorizado',
                estatus: <span className="autorizado" style={{ backgroundColor: 'green', color: 'white' }}>Autorizado</span>,
            },

        ] 
        
        console.log(aux)
        return aux

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
            <TablaGeneral titulo='Solicitud de Egreso' columnas={columnas} url='salas' ProccessData={ProccessData} numItemsPagina={12} acciones={createAcciones()} opciones={opciones} />

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