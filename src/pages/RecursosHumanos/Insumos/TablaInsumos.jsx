import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'

import { Modal } from '../../../components/singles'
import TablaGeneral from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import { apiDelete } from '../../../functions/api'
import useOptionsArea from '../../../hooks/useOptionsArea'
import Layout from '../../../components/layout/layout'

import NuevoInsumo from './modales/NuevoInsumo'
import EditarInsumos from './modales/EditarInsumos'
import ControlGastos from './modales/ControlGastos'
import VerInsumo from './modales/VerInsumo'

export default function TablaInsumos() {

    const userAuth = useSelector((state) => state.authUser);
    const [reloadTable, setReloadTable] = useState(false)
    const [modal, setModal] = useState({
        editar: {
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
     
    })
        
    useOptionsArea() 

    let prop = {
        pathname: '/rh/insumos',
    }

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Nombre', identificador: 'nombre', sort: false, stringSearch: false },
        { nombre: 'Cantidad', identificador: 'cantidad', sort: false, stringSearch: false },
        { nombre: 'Costo', identificador: 'costo_view', sort: false, stringSearch: false },
        { nombre: 'Fecha', identificador: 'fecha', sort: false, stringSearch: false },
        { nombre: 'Frecuencia', identificador: 'frecuencia_view', sort: false, stringSearch: false },
        { nombre: 'Stock', identificador: 'stock', sort: false, stringSearch: false },
        { nombre: 'Maximo', identificador: 'maximo', sort: false, stringSearch: false },
        { nombre: 'Minimo', identificador: 'minimo', sort: false, stringSearch: false },
    ];

    //funcion para dar formato a los numeros con comas y dos decimales sin redondear
    const formatNumber = (num) => {
        return `$${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    const ProccessData = (data) => { 
        let aux = []
        data.insumos.map((item) => {
            aux.push({
                ...item,
                id: item.id,
                costo_view: item.costo ? '$ '+ formatNumber (item.costo): '',
                costo: item.costo ? item.costo : '',
                frecuencia_view: item.frecuencia ? `${item.frecuencia} Mes` : '',
                frecuencia: item.frecuencia ? item.frecuencia : '',
                estatus: item.estatus === '1' ? 'Activo' : 'Inactivo',
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
                                    apiDelete(`insumos/${item.id}`, userAuth.access_token)
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
            nombre: 'Agregar Insumo',
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
                    <TablaGeneral 
                    titulo='Insumos' 
                    columnas={columnas} 
                    url='insumos' 
                    ProccessData={ProccessData} 
                    numItemsPagina={12} 
                    acciones={createAcciones()} 
                    opciones={opciones} 
                    reload={setReloadTable} />
                </>
            </Layout>

            <Modal show={modal.crear.show} setShow={setModal} title='Crear Insumo' size='lg' handleClose={handleClose('crear')}>
                <NuevoInsumo reload={reloadTable} handleClose={handleClose('crear')} />
            </Modal>

             <Modal show={modal.editar.show} setShow={setModal} title='Editar insumo' size='lg' handleClose={handleClose('editar')}>
                <EditarInsumos data={modal.editar.data} reload={reloadTable} handleClose={handleClose('editar')} insumo={ modal.editar.data} />
            </Modal>

            <Modal show={modal.control_gastos.show} setShow={setModal} title='Control de insumo' size='md' handleClose={handleClose('control_gastos')}>
                <ControlGastos data={modal.control_gastos.data} reload={reloadTable} handleClose={handleClose('control_gastos')} insumo={ modal.control_gastos.data} />
            </Modal>

            <Modal show={modal.ver.show} setShow={setModal} title='Ver insumo' size='lg' handleClose={handleClose('ver')}>
                <VerInsumo data={modal.ver.data} reload={reloadTable} handleClose={handleClose('ver')} insumo={ modal.ver.data} />
            </Modal>
        </>
    );
}