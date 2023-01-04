import React, {useState} from 'react'
import { useSelector } from 'react-redux';
import Layout from '../../../components/layout/layout'
import Tabla from './../../../components/NewTables/TablaGeneral/TablaGeneral'
import { REQUISICIONES } from '../../../constants'
import { Modal } from '../../../components/singles'
import NuevaRequisicion from '../../../components/forms/administracion/NuevaRequisicion'
import {EditarRequisicion} from '../../../components/forms/administracion/EditarRequisicion'
import useOptionsArea from '../../../hooks/useOptionsArea'
import Swal from 'sweetalert2'

function Requisiciones () {

    const userAuth = useSelector((state) => state.authUser);
    const [modal, setModal] = useState({

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
                    departamento: result.departamento.nombre,
                    tipo_gasto: result.gasto ? result.gasto.nombre: 'no definido',
                    descripcion: result.descripcion
                }
            )
        })
        return aux
    }

    let handleClose = (nombre_modal)=>{
        setModal({
            ...modal,
            crear: false,
            editar: false
        })
    }

    const handleOpen = [
        {
            nombre: 'Nueva Requisicion',
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
    ]

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
            
                // nombre: 'Editar',
                // icono: 'fas fa-edit',
                // color: 'blueButton ',
                // funcion: (item) => {
                //     Swal.fire({
                //         title: 'Editar',
                //         text: '¿Desea editar el registro?',
                //         icon: 'question',
                //         showCancelButton: true,
                //         confirmButtonText: 'Si',
                //         cancelButtonText: 'No',
                //     }).then((result) => {
                //         if (result.isConfirmed) {
                //             setModal({
                //                 ...modal,
                //                 editar: {
                //                     show: true,
                //                     data: item
                //                 }
                //             })
                //         }
                //     });
                // }
            
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
                    numItemsPagina={10}
                    ProccessData={proccessData}
                    opciones={handleOpen}
                    acciones={acciones()}
                    >
                    </Tabla>
            </Layout>
            <Modal size="lg" title={"Nueva requisicion"} show={modal.crear} handleClose={handleClose}>
                <NuevaRequisicion />
            </Modal>

            <Modal size="lg" title={"Editar requisicion"} show={modal.editar} handleClose={handleClose}>
                <EditarRequisicion data={modal.editar.data}/>
            </Modal>
            
        </>
    )
    
}

export { Requisiciones }