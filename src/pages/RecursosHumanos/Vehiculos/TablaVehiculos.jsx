import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'

import { Modal } from '../../../components/singles'
import TablaGeneral from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import { apiDelete } from '../../../functions/api'
import { setOptions } from '../../../functions/setters'
import useOptionsArea from '../../../hooks/useOptionsArea'
import Layout from '../../../components/layout/layout'

import AdjuntosVehiculos from './utils/AdjuntosVehiculo'
import ControlGastos from './modales/ControlGastos'
import NuevoVehiculo from './modales/NuevoVehiculo'
import EditarVehiculo from './modales/EditarVehiculo'
import Operador from './modales/Operador'

export default function TablaVehiculos() {
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
        control_gastos: {
            show: false,
            data: false
        },
        usuarios_autorizados: {
            show: false,
            data: false
        },
    })
        
    useOptionsArea() 

    let prop = {
        pathname: '/rh/vehiculos',
    }

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Marca', identificador: 'marca', sort: false, stringSearch: false },
        { nombre: 'Modelo', identificador: 'modelo', sort: false, stringSearch: false },
        { nombre: 'Placas', identificador: 'placas', sort: false, stringSearch: false },
        { nombre: 'Poliza', identificador: 'poliza', sort: false, stringSearch: false },
        { nombre: 'Ciudad', identificador: 'ciudad', sort: false, stringSearch: false },
        { nombre: 'Estatus', identificador: 'estatus_show', sort: false, stringSearch: false },
    ];

    const ProccessData = (data) => { 
        let aux = []
        data.vehiculos.map((item) => {
            aux.push({
                ...item,
                estatus_show: item.estatus === '1' ? 'Activo' : 'Inactivo',
            })
        }
        )
        aux = aux.reverse()
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
                nombre: 'Gastos',
                icono: 'fas fa-money-bill-wave',
                color: 'blueButton',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        control_gastos: {
                            show: true,
                            data: item
                        }
                    })
                }
            },
            {
                nombre: 'Operador',
                icono: 'fas fa-users',
                color: 'blueButton',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        usuarios_autorizados: {
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
                                try {
                                    Swal.fire({
                                        title: 'Eliminando',
                                        text: 'Espere un momento',
                                        allowOutsideClick: false,
                                        onBeforeOpen: () => {
                                            Swal.showLoading()
                                        }
                                    })
                                    apiDelete(`vehiculos/${item.id}`, userAuth.access_token)
                                        .then((res) => {
                                            if (res.status === 200) {
                                                Swal.close()
                                                Swal.fire({
                                                    icon: 'success',
                                                    title: 'Eliminado',
                                                    text: 'El registro ha sido eliminado',
                                                })
                                                if (reloadTable) {
                                                    reloadTable.reload()
                                                }
                                            }
                                        })
                                        .catch((err) => {
                                            Swal.close()
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Error',
                                                text: 'Ha ocurrido un error',
                                            })
                                        })
                                } catch (error) { 
                                    Swal.close()
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: 'Ha ocurrido un error',
                                    })

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
            nombre: 'Agregar vehículo',
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

    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='rh'>
                <>
                    <TablaGeneral titulo='Vehículos' columnas={columnas} url='vehiculos' ProccessData={ProccessData} numItemsPagina={12} acciones={createAcciones()} opciones={opciones} reload={setReloadTable} />
                </>
            </Layout>

            <Modal show={modal.editar.show} setShow={setModal} title='Editar Vehículo' size='lg' handleClose={handleClose('editar')}>
                <EditarVehiculo reload={reloadTable} handleClose={handleClose('editar')} vehiculo={ modal.editar.data} />
            </Modal>
            <Modal show={modal.eliminar.show} setShow={setModal} title='Eliminar Vehículo' size='lg' handleClose={handleClose('eliminar')}>
                <h1>Eliminar</h1>
            </Modal>
            <Modal show={modal.adjuntos.show} setShow={setModal} title='Adjuntos Vehículo' size='lg' handleClose={handleClose('adjuntos')}>
                <AdjuntosVehiculos />
            </Modal>
            <Modal show={modal.ver.show} setShow={setModal} title='Ver Vehículo' size='lg' handleClose={handleClose('ver')}>
                <h1>Ver</h1>
            </Modal>
            <Modal show={modal.crear.show} setShow={setModal} title='Crear Vehículo' size='lg' handleClose={handleClose('crear')}>
                <NuevoVehiculo reload={reloadTable} handleClose={handleClose('crear')} />
            </Modal>
            <Modal show={modal.control_gastos.show} setShow={setModal} title='Control de gastos' size='xl' handleClose={handleClose('control_gastos')}>
                <ControlGastos vehiculo={modal.control_gastos.data }/>
            </Modal>
            <Modal show={modal.usuarios_autorizados.show} setShow={setModal} title='Usuarios autorizados' size='lg' handleClose={handleClose('usuarios_autorizados')}>
                <Operador reload={reloadTable} handleClose={handleClose('editar')} />
            </Modal>
        </>
    );
}