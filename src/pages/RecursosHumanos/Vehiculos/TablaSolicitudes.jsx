import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'

import { Modal } from '../../../components/singles'
import TablaGeneral from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import { apiGet } from '../../../functions/api'
import useOptionsArea from '../../../hooks/useOptionsArea'
import Layout from '../../../components/layout/layout'
import NuevoOperador from './modales/NuevoOperador'

export default function TablaSolicitudes() {
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
    const [vehicles, setVehicles] = useState(false)

    useEffect(() => {
        getVehicles()
    }, [])

    const getVehicles = () => {
        Swal.fire({
            title: 'Cargando',
            text: 'Espere un momento...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        })
        try {
            apiGet('vehiculos', userAuth.access_token)
                .then(res => {
                    setVehicles(res.data.vehiculos)
                    Swal.close()
                })
                .catch(err => {
                    Swal.close()
                console.log(err)
                })
        } catch (error) {

        }
        
    }

    useOptionsArea()

    let prop = {
        pathname: '/rh/solicitudes',
    }

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Usuario', identificador: 'usuario', sort: false, stringSearch: false },
        { nombre: 'Vehículo', identificador: 'vehiculo', sort: false, stringSearch: false },
        { nombre: 'Fecha Inicio', identificador: 'fecha_ini', sort: false, stringSearch: false },
        { nombre: 'Fecha Fin', identificador: 'fecha_fin', sort: false, stringSearch: false },
        { nombre: 'Hora Inicio', identificador: 'hora_ini', sort: false, stringSearch: false },
        { nombre: 'Hora Fin', identificador: 'hora_fin', sort: false, stringSearch: false },
        { nombre: 'Destino', identificador: 'destino', sort: false, stringSearch: false },

    ];

    const ProccessData = (data) => {
        let aux = []
        data.solicitud.map((result) => {
            aux.push(
                {
                    // acciones: acciones(),
                    usuario: result.user.name,
                    vehiculo: result.vehiculo ? result.vehiculo.marca : '',
                    fecha_ini: result.fecha_inicio ?  result.fecha_inicio : '',
                    fecha_fin: result.fecha_fin ? result.fecha_fin : '',
                    hora_ini: result.hora_inicio ? result.hora_inicio : '',
                    hora_fin: result.hora_fin ? result.hora_fin : '' ,
                    destino: result.destino ? result.destino : 'no especificado',
                    id:result.id,
                    data:result
                }
            )
        })
        return aux

        // return [
        //     { operador: 'Juan Perez', vehiculo: 'VW Jetta', estatus: 'Activo' },
        //     { operador: 'Fernanda Lopez', vehiculo: 'zuzuki', estatus: 'Activo' },
        //     { operador: 'Karla Perez', vehiculo: 'VW Jetta', estatus: 'Inactivo' },
        // ]
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
                nombre: 'Asignar Vehiculo',
                icono: 'fas fa-car',
                color: 'blueButton',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        asignar_vehiculo: {
                            show: true,
                            data: item
                        }
                    })
                }
            },
            {
                nombre: 'Aprobar',
                icono: 'fas fa-users',
                color: 'greenButton',
                funcion: (item) => {
                    // setModal({
                    //     ...modal,
                    //     usuarios_autorizados: {
                    //         show: true,
                    //         data: item
                    //     }
                    // })
                    Swal.fire({
                        title: '¿Estás seguro?',
                        text: "¡No podrás revertir esto!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: '¡Sí, Aprovarlo!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire(
                                '¡Aprovado!',
                                'El registro ha sido aprovado.',
                                'success'
                            )
                        }
                    })

                }
            },
            {
                nombre: 'Rechazar',
                icono: 'fas fa-users',
                color: 'redButton',
                funcion: (item) => {
                    // setModal({
                    //     ...modal,
                    //     usuarios_autorizados: {
                    //         show: true,
                    //         data: item
                    //     }
                    // })
                    Swal.fire({
                        title: '¿Estás seguro?',
                        text: "¡No podrás revertir esto!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: '¡Si, Rechazar!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire(
                                '¡Rechazado!',
                                'El registro ha sido rechazado.',
                                'success'
                            )
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
                                Swal.fire(
                                    '¡Eliminado!',
                                    'El registro ha sido eliminado.',
                                    'success'
                                )
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
            nombre: 'Agregar operador',
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
                    <TablaGeneral titulo='Solicitudes' columnas={columnas} url='vehiculos/solicitudes' ProccessData={ProccessData} numItemsPagina={12} acciones={createAcciones()}  reload={setReloadTable} />
                </>
            </Layout>

            <Modal show={modal.editar.show} setShow={setModal} title='Editar operador' size='lg' handleClose={handleClose('editar')}>
                
            </Modal>
            <Modal show={modal.eliminar.show} setShow={setModal} title='Eliminar operador' size='lg' handleClose={handleClose('eliminar')}>
                <h1>Eliminar</h1>
            </Modal>
            <Modal show={modal.adjuntos.show} setShow={setModal} title='Adjuntos operador' size='lg' handleClose={handleClose('adjuntos')}>
                
            </Modal>
            <Modal show={modal.ver.show} setShow={setModal} title='Ver operador' size='lg' handleClose={handleClose('ver')}>
                <h1>Ver</h1>
            </Modal>
            {
                vehicles ?
                <Modal show={modal.crear.show} setShow={setModal} title='Crear operador' size='lg' handleClose={handleClose('crear')}>
                        <NuevoOperador handleClose={handleClose('crear')} reload={reloadTable} vehiculos={vehicles} />
                </Modal> : null  
            }
            
        </>
    );
}