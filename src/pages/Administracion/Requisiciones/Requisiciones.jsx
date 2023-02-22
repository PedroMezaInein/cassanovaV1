import React, {useState} from 'react'
import { useSelector } from 'react-redux';

import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import Tabla from './../../../components/NewTables/TablaGeneral/TablaGeneral'
import { REQUISICIONES } from '../../../constants'
import { Modal } from '../../../components/singles'
import Adjuntos from '../../Administracion/RequisicionCompras/Modales/Adjuntos'
import NuevaRequisicion from '../../../components/forms/administracion/NuevaRequisicion'
import VerRequisicion from '../../../components/forms/administracion/VerRequisicion'
import {EditarRequisicion} from '../../../components/forms/administracion/EditarRequisicion'

import useOptionsArea from '../../../hooks/useOptionsArea'

function Requisiciones () {

    const userAuth = useSelector((state) => state.authUser);
    const [reloadTable, setReloadTable] = useState()
    const [modal, setModal] = useState({

        crear: {
            show: false,
            data: false
        },

        editar: {
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

    let prop = {
        pathname: '/administracion/requisicion',
    }


    const proccessData = (datos) => {
        
        let aux = []
            datos.Requisiciones.map((result) => {
                aux.push(
                    {
                        acciones: acciones(),
                        orden_compra: result.orden_compra,
                        solicitante: result.solicitante.name,
                        fecha: result.fecha,
                        departamento: result.departamento ?  result.departamento.nombre : '',
                        tipo_gasto: result.gasto ? result.gasto.nombre: 'no definido',
                        descripcion: result.descripcion,
                        estatus: result.estatus ? result.estatus.estatus : 'pendiente' ,
                        tiempo_estimado: result.fecha_entrega ? result.fecha_entrega : 'no especificado',
                        id:result.id,
                        data:result
                    }
                )
            })
            aux=aux.reverse()
            return aux
    }
    
    const handleOpen = [
        {
            nombre: 'Nueva Requisición',
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


    let handleClose = (tipo) => () => {
        setModal({
            ...modal,
            [tipo]: {
                show: false,
                data: false
            }
        })
    }

    let acciones = () => {
        let aux = [
            {
                nombre: 'Editar',
                icono: 'fas fa-edit',
                color: 'blueButton',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        editar: {
                            show: true,
                            data: item.data
                        }
                    })
                
                }
            },  
           
            {
                nombre: 'Adjuntos',
                icono: 'fas fa-paperclip',
                color: 'reyButton',
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
                nombre: 'ver',
                icono: 'fas fa-paperclip',
                color: 'perryButton',
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

    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='administracion'>
                <Tabla
                    titulo="Requisición" 
                    columnas={REQUISICIONES}
                    url={'requisicion'}  
                    numItemsPagina={12}
                    ProccessData={proccessData}
                    opciones={handleOpen}
                    acciones={acciones()}
                    reload={setReloadTable}
                    >
                </Tabla>
            </Layout>

            <Modal size="lg" title={"Nueva requisición"} show={modal.crear.show} handleClose={handleClose('crear')}>
                <NuevaRequisicion handleClose={handleClose('crear')} reload={reloadTable}/>
            </Modal>

            <Modal size="lg" title={"Editar requisición"} show={modal.editar.show} handleClose={handleClose('editar')}>
                <EditarRequisicion data={modal.editar.data} handleClose={handleClose('editar')} reload={reloadTable}/>
            </Modal>

            <Modal size="lg" title={"Adjuntos"} show={modal.adjuntos.show} handleClose={handleClose('adjuntos')}>
                <Adjuntos data={modal.adjuntos.data} nuevaRequisicion={true}/>
            </Modal>

            <Modal size="lg" title={"ver requisición"} show={modal.ver.show} handleClose={handleClose('ver')}>
                <VerRequisicion data={modal.ver.data} verRequisicion={true}/>
            </Modal>
            
        </>
    )
    
}

export { Requisiciones }