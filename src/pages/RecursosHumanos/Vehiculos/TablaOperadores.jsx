import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'

import { Modal } from '../../../components/singles'
import TablaGeneral from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import { apiGet, apiDelete } from '../../../functions/api'
import useOptionsArea from '../../../hooks/useOptionsArea'
import Layout from '../../../components/layout/layout'
import NuevoOperador from './modales/NuevoOperador'
import EditarOperador from './modales/EditarOperador'
import VerOperador from './modales/VerOperador'

export default function TablaOperadores(props) {
    const {id} = props
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
        pathname: '/rh/operadores',
    }

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Operador', identificador: 'operador', sort: false, stringSearch: false },
        { nombre: 'Vehículo', identificador: 'vehiculo', sort: false, stringSearch: false },
        { nombre: 'Licencia', identificador: 'licencia', sort: false, stringSearch: false },
    ];

    const ProccessData = (data) => {
        let aux = []
        data.asigando.map((result) => {
            if (id === result.id_vehiculo) {
                aux.push(
                {
                    operador: result.user.name,
                    vehiculo: result.vehiculos ? result.vehiculos.marca : '',
                    licencia: result.licencia ?  result.licencia : '',
                    id:result.id,
                    data:result
                }
            )   
            }
            
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
                                let recargar = reloadTable ? reloadTable.reload : false
                                apiDelete(`servicios/eliminarasignacion/${item.id}`, userAuth.access_token)
                                    .then(res => {
                                        if (recargar) {
                                            recargar()
                                        }
                                        Swal.fire(
                                            '¡Eliminado!',
                                            'El registro ha sido eliminado.',
                                            'success'
                                        )
                                    })
                                
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
            <TablaGeneral titulo='Operadores' columnas={columnas} url='vehiculos/asignacion' ProccessData={ProccessData} numItemsPagina={12} acciones={createAcciones()} opciones={opciones} reload={setReloadTable} />

            {
                modal.editar.data &&
                <Modal show={modal.editar.show} setShow={setModal} title='Editar operador' size='lg' handleClose={handleClose('editar')}>
                        <EditarOperador handleClose={handleClose('editar')} reload={reloadTable} vehiculos={vehicles}
                            operador={modal.editar.data} />
                </Modal>
            }
            
            <Modal show={modal.eliminar.show} setShow={setModal} title='Eliminar operador' size='lg' handleClose={handleClose('eliminar')}>
                <h1>Eliminar</h1>
            </Modal>
            <Modal show={modal.adjuntos.show} setShow={setModal} title='Adjuntos operador' size='lg' handleClose={handleClose('adjuntos')}>
                
            </Modal>
            {
                modal.ver.data &&
                <Modal show={modal.ver.show} setShow={setModal} title='Información del operador' size='lg' handleClose={handleClose('ver')}>
                        <VerOperador handleClose={handleClose('ver')} reload={reloadTable} vehiculos={vehicles}
                            operador={modal.ver.data} />
                </Modal>
            }
            
            {
                vehicles ?
                <Modal show={modal.crear.show} setShow={setModal} title='Crear operador' size='lg' handleClose={handleClose('crear')}>
                        <NuevoOperador handleClose={handleClose('crear')} reload={reloadTable} vehiculos={vehicles} />
                </Modal> : null  
            }
            
        </>
    );
}