import React, { useState } from 'react'
import { useSelector } from 'react-redux';

import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'

import TablaPresupuesto from './Departamento/TablaPresupuesto'
import TablaPresupuestoObra from './Obra/TablaPresupuestoObra'
import Editar from './Departamento/EditarPresupuestoDepartamento'
import Ver from './Departamento/VerPresupuestoDepartamento'

import { Form, Tabs, Tab, Row, Col } from 'react-bootstrap'
import { Modal } from '../../../components/singles'

import Tabla from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import { apiDelete, apiPutForm } from '../../../functions/api'



export default function Presupuesto() {
    const userAuth = useSelector((state) => state.authUser);
    const [reloadTable, setReloadTable] = useState()
    const [reloadTableObra, setReloadTableObra] = useState()

    const [modal, setModal] = useState({
        nuevo: {
            show: false,
            data: null
        },
        editar: {
            show: false,
            data: null
        },
        ver: {
            show: false,
            data: null
        }
    })

    const [modalObra, setModalObra] = useState({
        nuevo: {
            show: false,
            data: null
        },
        editar: {
            show: false,
            data: null
        },
        ver: {
            show: false,
            data: null
        }
    })

    const [key, setKey] = useState('departamentos');

    let prop = {
        pathname: '/administracion/requisicion',
    }

    const setKeyTab = (key) => {
        setKey(key)
    }

    const formatNumberCurrency = (number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        }).format(number)
    }

    const formatDateString = (date) => {
        let aux = date.split('-')
        return aux[2] + '/' + aux[1] + '/' + aux[0]
    }

    const tagAprobado = (value) => {
        if (value === '0') {
            return <span className="badge badge-danger">No autorizado</span>
        } else {
            return <span className="badge badge-success">Autorizado</span>
        }
    }

    // Departamentos

    const ProccessData = (e) => {
        let aux = []
        e.presupuesto.map(item => {
            aux.push({
                id: item.id,
                id_area: item.id_area,
                nombre: item.nombre,
                fecha: formatDateString(item.fecha),
                monto: item.presupuesto,
                monto_show: formatNumberCurrency(item.presupuesto),
                departamento: item.area.nombre,
                usuario: item.usuario ? item.usuario.name : '',
                autorizacion: tagAprobado(item.estatus),
                estatus: item.estatus === "1" ? true : false,
                presupuesto_autorizado: item.presupuesto_autorizado ? formatNumberCurrency(item.presupuesto_autorizado) : ''
            })
        })
        return aux
    }

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Departamento', identificador: 'departamento', sort: false, },
        { nombre: 'usuario', identificador: 'usuario', sort: false, },
        { nombre: 'Nombre', identificador: 'nombre', sort: false, },
        { nombre: 'Fecha', identificador: 'fecha', sort: false, stringSearch: false },
        { nombre: 'Ppto.', identificador: 'monto_show', sort: false, stringSearch: false },
        { nombre: 'Ppto. autorizado', identificador: 'presupuesto_autorizado', sort: false, stringSearch: false },
        { nombre: 'Autorización', identificador: 'autorizacion', sort: false, stringSearch: false },
    ]

    const createAcciones = () => {
        let acciones = [
            {
                nombre: 'Ver',
                color: 'blueButton',
                icono: 'fas fa-eye',
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
                nombre: 'Editar',
                color: 'blueButton',
                icono: 'fas fa-edit',
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
                nombre: 'Eliminar',
                color: 'redButton',
                icono: 'fas fa-trash-alt',
                funcion: (item) => {
                    if (userAuth.user.tipo.tipo === 'Administrador') {
                        Swal.fire({
                            title: '¿Estas seguro?',
                            text: "¡No podrás revertir esto!",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            cancelButtonText: 'Cancelar',
                            confirmButtonText: 'Si, eliminar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                try {
                                    apiDelete(`presupuestosdep/${item.id}`, userAuth.access_token).then(result => {
                                        if (reloadTable) {
                                            reloadTable.reload()
                                        }
                                        Swal.fire({
                                            title: '¡Eliminado!',
                                            text: 'El presupuesto ha sido eliminado.',
                                            icon: 'success',
                                            confirmButtonColor: '#3085d6',
                                            confirmButtonText: 'Ok',
                                            timer: 2000
                                        })
                                    })
                                } catch (error) {

                                }
                            }
                        })
                    } else {
                        Swal.fire({
                            title: '¡No tienes permisos!',
                            text: "¡No tienes permisos para eliminar el presupuesto!",
                            icon: 'error',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok'
                        })
                    }
                }
            },
            {
                nombre: 'Autorizar',
                color: 'perryButton',
                icono: 'fas fa-check',
                funcion: (item) => {
                    console.log(item)
                    if (userAuth.user.tipo.tipo === 'Administrador') {
                        if (!item.estatus) {
                            Swal.fire({
                                title: '¿Estas seguro?',
                                text: "¡No podrás revertir esto!",
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                cancelButtonText: 'Cancelar',
                                confirmButtonText: 'Si, autorizar'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    Swal.fire({
                                        title: 'autorizando',
                                        text: 'Espere un momento...',
                                        allowOutsideClick: false,
                                        allowEscapeKey: false,
                                        allowEnterKey: false,
                                        showConfirmButton: false,
                                        onOpen: () => {
                                            Swal.showLoading()
                                        }
                                    })
                                    try {
                                        apiPutForm(`presupuestosdep/aprobacion/${item.id}`, { aprobado: 1 }, userAuth.access_token).then(result => {
                                            Swal.close()
                                            Swal.fire(
                                                '¡Autorizado!',
                                                'El presupuesto ha sido Autorizado.',
                                                'success'
                                            )
                                            if (reloadTable) {
                                                reloadTable.reload()
                                            }

                                        })
                                    } catch (error) {
                                        Swal.close()
                                        Swal.fire(
                                            '¡Error!',
                                            'El presupuesto no ha sido Autorizado.',
                                            'error'
                                        )

                                    }

                                }
                            })
                        } else {
                            Swal.fire({
                                title: 'Presupuesto ya autorizado',
                                text: "¡El presupuesto ya ha sido autorizado!",
                                icon: 'error',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'Ok'
                            })
                        }

                    } else {
                        Swal.fire({
                            title: '¡No tienes permisos!',
                            text: "¡No tienes permisos para aprobar el presupuesto!",
                            icon: 'error',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok'
                        })
                    }
                }
            },
        ]
        return acciones
    }

    const opciones = [
        {
            nombre: 'Nuevo presupuesto',
            funcion: (item) => {
                setModal({
                    ...modal,
                    nuevo: {
                        show: true,
                        data: item
                    }
                })
            }
        },
    ]

    const handleClose = (data) => () => {
        setModal({
            ...modal,
            [data]: {
                show: false,
                data: null
            }
        })
    }

    // Obras

    const columnasObras = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Departamento', identificador: 'departamento', sort: false, },
        { nombre: 'usuario', identificador: 'usuario', sort: false, },
        { nombre: 'Nombre', identificador: 'nombre', sort: false, },
        { nombre: 'Fecha', identificador: 'fecha', sort: false, stringSearch: false },
        { nombre: 'Ppto.', identificador: 'monto_show', sort: false, stringSearch: false },
        { nombre: 'Ppto. autorizado', identificador: 'presupuesto_autorizado', sort: false, stringSearch: false },
        { nombre: 'Autorización', identificador: 'autorizacion', sort: false, stringSearch: false },
    ]

    const ProccessDataObras = (e) => {
        let aux = []
        e.presupuesto.map(item => {
            aux.push({
                id: item.id,
                id_area: item.id_area,
                nombre: item.nombre,
                fecha: formatDateString(item.fecha),
                monto: item.presupuesto,
                monto_show: formatNumberCurrency(item.presupuesto),
                departamento: item.area.nombre,
                usuario: item.usuario ? item.usuario.name : '',
                autorizacion: tagAprobado(item.estatus),
                estatus: item.estatus === "1" ? true : false,
                presupuesto_autorizado: item.presupuesto_autorizado ? formatNumberCurrency(item.presupuesto_autorizado) : ''
            })
        })
        return aux
    }

    const accionesObras = [
        {
            nombre: 'Editar',
            color: 'blueButton',
            icono: 'fas fa-edit',
            funcion: (item) => {
                setModalObra({
                    ...modalObra,
                    editar: {
                        show: true,
                        data: item
                    }   
                })

            }
        },
        {
            nombre: 'Ver',
            color: 'greenButton',
            icono: 'fas fa-eye',
            funcion: (item) => {
                setModalObra({
                    ...modalObra,
                    ver: {
                        show: true,
                        data: item
                    }
                })
            }
        },
    ]

    const opcionesObras = [
        {
            nombre: 'Nuevo presupuesto',
            funcion: (item) => {
                setModalObra({
                    ...modalObra,
                    nuevo: {
                        show: true,
                        data: item
                    }
                })
            }
        },
    ]

    const handleCloseObra = (data) => () => {
        setModalObra({
            ...modalObra,
            [data]: {
                show: false,
                data: null
            }
        })
    }

    return (
        <>

            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='administracion'>
                {/* <TablaPresupuesto /> */}

                <Tabs defaultActiveKey="departamentos" activeKey={key} onSelect={(value) => { setKeyTab(value) }}>
                    <Tab eventKey="departamentos" title="Presupuestos departamentos">
                        <Tabla
                            titulo='Presupuestos'
                            columnas={columnas}
                            url='presupuestosdep'
                            ProccessData={ProccessData}
                            numItemsPagina={12}
                            acciones={createAcciones()}
                            opciones={opciones}
                            reload={setReloadTable}
                        />
                    </Tab>
                    <Tab eventKey="obra" title="Presupuestos Obra">
                        <Tabla
                            titulo='Presupuestos'
                            columnas={columnasObras}
                            url='presupuestosdep/obra'
                            ProccessData={ProccessDataObras}
                            numItemsPagina={12}
                            acciones={accionesObras}
                            opciones={opcionesObras}
                            reload={setReloadTableObra}
                        />
                    </Tab>
                </Tabs>

            </Layout>

            <Modal size="xl" title={"Nuevo presupuesto"} show={modal.nuevo.show} handleClose={handleClose('nuevo')}>
                <TablaPresupuesto reload={reloadTable} handleClose={handleClose('nuevo')} />
            </Modal>
            {
                modal.editar.data &&
                <Modal size="xl" title={"Editar presupuesto"} show={modal.editar.show} handleClose={handleClose('editar')}>
                    <Editar data={modal.editar.data} reload={reloadTable} handleClose={handleClose('editar')} />
                </Modal>
            }

            {
                modal.ver.data &&
                <Modal size="xl" title={"Ver presupuesto"} show={modal.ver.show} handleClose={handleClose('ver')}>
                    <Ver data={modal.ver.data} reload={reloadTable} handleClose={handleClose('ver')} />
                </Modal>
            }

            <Modal size="xl" title={"Nuevo presupuesto"} show={modalObra.nuevo.show} handleClose={handleCloseObra('nuevo')}>
                <TablaPresupuestoObra reload={reloadTableObra} handleClose={handleClose('nuevoObra')} />
            </Modal>

            {
                modalObra.editar.data &&
                <Modal size="xl" title={"Editar presupuesto"} show={modalObra.editar.show} handleClose={handleCloseObra('editar')}>
                       
                </Modal>
            }

            {
                modalObra.ver.data &&
                <Modal size="xl" title={"Ver presupuesto"} show={modalObra.ver.show} handleClose={handleCloseObra('ver')}>
                    
                </Modal>
            }


        </>
    );
}
