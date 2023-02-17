import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'

import { apiDelete } from '../../../../functions/api'

import { Modal } from '../../../../components/singles'
import TablaGeneral from '../../../../components/NewTables/TablaGeneral/TablaGeneral'
import EditarGasto from './EditarGasto'
import AdjuntosGasto from './../utils/AdjuntosGasto'
import NuevoGasto from './NuevoGasto'
import VerGasto from './VerGasto'

export default function ControlGastos(props) { 
    const { vehiculo } = props
    const userAuth = useSelector((state) => state.authUser);
    const [reloadTable, setReloadTable] = useState(false)
    const [modal, setModal] = useState({
        editar: {
            show: false,
            data: false
        },
        eliminar: {
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
        crear: {
            show: false,
            data: false
        },
    })

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Fecha', identificador: 'fecha', sort: false, stringSearch: false },
        { nombre: 'Kilometros', identificador: 'kilometros', sort: false, stringSearch: false },
        { nombre: 'Costo', identificador: 'costo', sort: false, stringSearch: false },
        { nombre: 'Trabajo realizado', identificador: 'trabajo_realizado', sort: false, stringSearch: false },
        { nombre: 'Observaciones', identificador: 'observaciones', sort: false, stringSearch: false },
    ];

    const ProccessData = (data) => {
        let aux = []
        data.servicio.forEach((item) => {
            aux.push({
                ...item,
                acciones: createAcciones()
            })
        })
        return aux
    }

    const createAcciones = () => {
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
            {
                nombre: 'Eliminar',
                icono: 'fas fa-trash',
                color: 'redButton',
                funcion: (item) => {
                    if (userAuth.user.tipo.id === 1) {
                        Swal.fire({
                            title: '¿Estás seguro?',
                            text: "¡No podrás revertir esto!",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: '¡Sí, bórralo!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                Swal.fire({
                                    title: 'Eliminando...',
                                    allowOutsideClick: false,
                                    onBeforeOpen: () => {
                                        Swal.showLoading()
                                    }
                                })
                                
                                try {   
                                    apiDelete(`servicios/${item.id}`, userAuth.access_token)
                                        .then((res) => {
                                            Swal.close()
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Eliminado',
                                                text: 'El registro ha sido eliminado',
                                                timer: 1500,
                                            })
                                            if (reloadTable) {
                                                reloadTable.reload()
                                            }

                                        })
                                        .catch((err) => { 
                                            Swal.close()
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Error',
                                                text: 'Ha ocurrido un error al eliminar el registro',
                                            })
                                        })
                                    
                                } catch (error) {

                                }
                            }
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Acción no permitida',
                            text: 'No tienes permisos para eliminar este registro',
                        })
                    }
                    
                }
            },
        ]
        return aux
    }

    const opciones = [
        {
            nombre: 'Agregar Gasto',
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

    const handleClose = (tipo) => () => {
        setModal({
            ...modal,
            [tipo]: {
                show: false,
                data: false
            }
        })
    }

    console.log(vehiculo)

    return (
        <>
            <TablaGeneral titulo='Control de Gastos' subtitulo='Vehículos' columnas={columnas} url={`servicios/${vehiculo.id}`} ProccessData={ProccessData} numItemsPagina={8} acciones={createAcciones()} opciones={opciones} reload={setReloadTable} />

            <Modal show={modal.editar.show} setShow={setModal} title='Editar Gasto' size='lg' handleClose={handleClose('editar')}>
                <EditarGasto reload={reloadTable} handleClose={handleClose('editar')} vehiculo={vehiculo} gasto={modal.editar.data} />
            </Modal>
            <Modal show={modal.eliminar.show} setShow={setModal} title='Eliminar Gasto' size='lg' handleClose={handleClose('eliminar')}>
                <h1>Eliminar</h1>
            </Modal>
            {
                modal.adjuntos.data &&
                <Modal show={modal.ver.show} setShow={setModal} title='Ver Gasto' size='lg' handleClose={handleClose('ver')}>
                    <VerGasto reload={reloadTable} handleClose={handleClose('ver')} vehiculo={modal.ver.data} />
                </Modal>
            }
           
            <Modal show={modal.crear.show} setShow={setModal} title='Nuevo gasto' size='lg' handleClose={handleClose('crear')}>
                <NuevoGasto reload={reloadTable} handleClose={handleClose('crear')} vehiculo={vehiculo} />
            </Modal>
            <Modal show={modal.adjuntos.show} setShow={setModal} title='Adjuntos Gasto' size='lg' handleClose={handleClose('adjuntos')}>
                <AdjuntosGasto />
            </Modal>
        </>
    )
}