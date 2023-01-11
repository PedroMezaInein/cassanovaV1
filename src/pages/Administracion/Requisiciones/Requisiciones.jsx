import React, {useState} from 'react'
import { useSelector } from 'react-redux';

import Layout from '../../../components/layout/layout'
import Tabla from './../../../components/NewTables/TablaGeneral/TablaGeneral'
import { REQUISICIONES } from '../../../constants'
import { Modal } from '../../../components/singles'
import Adjuntos from '../../Administracion/RequisicionCompras/Modales/Adjuntos'
import NuevaRequisicion from '../../../components/forms/administracion/NuevaRequisicion'
import {EditarRequisicion} from '../../../components/forms/administracion/EditarRequisicion'

import useOptionsArea from '../../../hooks/useOptionsArea'
import Swal from 'sweetalert2'

function Requisiciones () {

    const userAuth = useSelector((state) => state.authUser);
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
                    solicitante: result.solicitante.name,
                    fecha: result.fecha,
                    departamento: result.departamento ?  result.departamento.nombre : '',
                    tipo_gasto: result.gasto ? result.gasto.nombre: 'no definido',
                    descripcion: result.descripcion,
                    id:result.id,
                    data:result
                }
            )
        })
        return aux
    }
    
    const handleOpen = [
        {
            nombre: 'Nueva Requisicion',
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
        ]
        return aux
    }

    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='administracion'>
                <Tabla
                    titulo="Requisicion" 
                    columnas={REQUISICIONES}
                    url={'requisicion'}  
                    numItemsPagina={12}
                    ProccessData={proccessData}
                    opciones={handleOpen}
                    acciones={acciones()}
                    >
                </Tabla>
            </Layout>
            <Modal size="lg" title={"Nueva requisicion"} show={modal.crear.show} handleClose={handleClose('crear')}>
                <NuevaRequisicion />
            </Modal>

            <Modal size="lg" title={"Editar requisicion"} show={modal.editar.show} handleClose={handleClose('editar')}>
                <EditarRequisicion data={modal.editar.data} />
            </Modal>

            <Modal size="lg" title={"Adjuntos"} show={modal.adjuntos.show} handleClose={handleClose('adjuntos')}>
                <Adjuntos data={modal.adjuntos.data} nuevaRequisicion={true}/>
            </Modal>
            
        </>
    )
    
}

export { Requisiciones }