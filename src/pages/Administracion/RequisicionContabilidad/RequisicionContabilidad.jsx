import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

import { Modal } from '../../../components/singles'

import TablaGeneralPaginado from '../../../components/NewTables/TablaGeneral/TablaGeneralPaginado'
import FiltrarRequisicionesContabilidad from './FiltrarRequisicionesContabilidad'

import Convertir from './Modales/Convertir'
import Editar from './Modales/Editar'
import Adjuntos from './Modales/Adjuntos'
import Ver from './Modales/Ver'
import Crear from './../../../components/forms/administracion/NuevaRequisicion'

import { apiOptions, apiPutForm } from '../../../functions/api'
import { setOptions } from '../../../functions/setters'

import useOptionsArea from '../../../hooks/useOptionsArea'
import StatusIndicator from './utils/StatusIndicator'
import Autorizado from '@material-ui/icons/AssignmentTurnedInOutlined';

// import Layout from '../../../components/layout/layout'

export default function RequisicionContabilidad() { 
    const userAuth = useSelector((state) => state.authUser);
    const [filtrado, setFiltrado] = useState('') 
    const [reloadTable, setReloadTable] = useState()
    const [opcionesApi, setOpcionesApi] = useState(false)
    const [estatusCompras, setEstatusCompras] = useState(false)

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
        filtrar: {
            show: false,
            data: false
        },
        autorizar: {
            show: false,
            data: false
        }
    })

    useEffect(() => {
        if (filtrado) {
            reloadTable.reload(filtrado)
            //  setFiltrado('')
            if(borrar == false){
                setFiltrado('')   

            }
        }

    }, [filtrado])

    const borrar = ( id) =>{
        if(id == false){
            reloadTable.reload(filtrado)
            setFiltrado('')   

        }
    }

    useEffect(() => {
        getOpciones()
    }, [])

    useOptionsArea()

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Orden no.', identificador: 'orden_compra' },
        { nombre: 'Solicitante', identificador: 'solicitante', sort: false, stringSearch: false },
        { nombre: 'Fecha', identificador: 'fecha_view', sort: false, stringSearch: false },
        { nombre: 'Departamento', identificador: 'departamento', sort: false, stringSearch: false },
        { nombre: 'Tipo de Egreso', identificador: 'tipoEgreso', sort: false, stringSearch: false },
        /* { nombre: 'Descripción', identificador: 'descripcion', sort: false, stringSearch: false }, */
        { nombre: 'Tipo de pago  (*)', identificador: 'tipoPago', sort: false, stringSearch: false },
        { nombre: 'Monto pagado  (*)', identificador: 'monto_view', sort: false, stringSearch: false },
        /* { nombre: 'E. Compra', identificador: 'estatus_compra', sort: false, stringSearch: false },
        { nombre: 'E. Conta', identificador: 'estatus_conta', sort: false, stringSearch: false }, */
        /* { nombre: 'Facturación', identificador: 'estatus_factura', sort: false, stringSearch: false },
        { nombre: 'Cuentas', identificador: 'afectacion_cuentas', sort: false, stringSearch: false }, */
        { nombre: 'Estatus', identificador: 'semaforo', sort: false, stringSearch: false },
        /* { nombre: 'Aprobación', identificador: 'aprobacion', sort: false, stringSearch: false }, */
    ]

    const opciones = [
        {
            nombre: <div><i className="fas fa-plus mr-5"></i><span>Nuevo</span></div>,
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
        {
            //filtrar
            nombre: <div><i className="fas fa-filter mr-5"></i><span>Filtrar</span></div>,
            funcion: (item) => {
                setModal({
                    ...modal,
                    filtrar: {
                        show: true,
                        data: item
                    }
                })
            }
        },
    ]

    //funcion para convertir numero a moneda con dos decimales y separador de miles
    const formatNumber = (num) => {
        return `$${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    let ProccessData = (data) => {
        let aux = []
        data.data.data.map((item, index) => {
            aux.push({
                id: item.id,
                acciones: createAcciones(),
                solicitante: item.solicitante.name,
                solicitante_id: item.solicitante.id,
                fecha: item.fecha,
                fecha_view: reformatDate(item.fecha),
                departamento: item.departamento.nombre,
                departamento_id: item.departamento.id,
                tipoEgreso: item.gasto ? item.gasto.nombre : 'no definido',
                tipoEgreso_id: item.gasto ? item.gasto.id : null,
                tipoSubEgreso: item.subarea ? item.subarea.nombre : 'No definido',
                tipoSubEgreso_id: item.subarea ? item.subarea.id : null,
                descripcion: item.descripcion,
                tipoPago: item.pago ? item.pago.tipo : 'No definido',
                tipoPago_id: item.pago ? item.pago.id : null,
                monto_solicitado: item.cantidad,
                monto: item.monto_pago,
                monto_view: `$${item.monto_pago.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`,
                aprobacion: createtagaprobaciones(item),
                auto1: item.auto1,
                auto2: item.auto2,
                orden_compra: item.orden_compra,
                fecha_pago: item.fecha_pago,
                cuenta: item.cuenta,
                id_estatus: item.id_estatus_compra ? item.id_estatus_compra : null,
                proveedor: item.id_proveedor ? item.id_proveedor : null,
                estatus_compra: item.estatus_compra ? item.estatus_compra.estatus : 'pendiente',
                estatus_conta: item.estatus_conta ? item.estatus_conta.estatus : 'pendiente',
                estatus_factura: item.estatus_factura ? item.estatus_factura.estatus : 'pendiente',
                compra: item.estatus_compra ? item.estatus_compra.id : null,
                id_estatus_compra: item.id_estatus_compra ? item.id_estatus_compra : null,
                id_estatus_factura: item.id_estatus_factura ? item.id_estatus_factura : null,
                conta: item.estatus_conta ? item.estatus_conta.id : null,
                factura: item.estatus_factura ? item.estatus_factura.id : null,
                afectacion_cuentas: item.auto2 ? "Cuentas afectadas" : "sin afectación",
                semaforo: createStatusIndicator(item),
                fecha_entrega: item.fecha_entrega ? item.fecha_entrega : null,
            })
        })
        // aux = aux.reverse()
        return aux

    }

    function reformatDate(dateStr) {
        var dArr = dateStr.split("-");  // ex input: "2010-01-18"
        return dArr[2] + "/" + dArr[1] + "/" + dArr[0]/* .substring(2) */; //ex output: "18/01/10"
    }

    const createStatusIndicator = (item) => {
        return (
            <StatusIndicator data={item} />
        )
    }

    let createtagaprobaciones = (item) => {
        return (
            <>
                {
                    item.auto2  && item.auto1 ?
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ color: 'green', weight: '700' }}>aprueba Contabilidad</label>
                        </div>
                        : item.auto1 ?
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ color: 'orange', weight: '700' }}>aprueba Compras</label>
                            </div>
                            : <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ color: 'orange', weight: '700' }}>Pendiente</label>
                            </div>
                }
            </>
            
        )
    }

    const createAcciones = () => {
        let aux = [
            {
                nombre: 'Convertir',
                icono: 'fas fa-exchange-alt',
                color: 'greenButton',
                funcion: (item) => {
                    if (item.auto2) {
                        Swal.fire({
                            title: 'Requisición ya aprobada',
                            text: 'La requisición ya fue aprobada, no se puede convertir',
                            icon: 'warning',
                            confirmButtonText: 'Aceptar'
                        })
                    } else {
                        setModal({
                            ...modal,
                            convertir: {
                                show: true,
                                data: item
                            }
                        })
                    }
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
            {
                nombre: 'Autorizar',
                color: 'perryButton',
                icono: 'fas fa-check',
                funcion: (item) => {
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
                                        apiPutForm(`requisicion/${item.id}/autorizar`, { aprobado: 1 }, userAuth.access_token).then(result => {
                                            Swal.close()
                                            Swal.fire(
                                                '¡Autorizado!',
                                                'El presupuesto ha sido Autorizado.',
                                                'success'
                                            )
                                            setTimeout(() => {
                                                Swal.fire({
                                                    title: 'Presupuesto aprobado',
                                                    text: 'El presupuesto fue aprobado exitosamente.',
                                                    icon: 'success',
                                                    confirmButtonColor: '#3085d6',
                                                    confirmButtonText: 'Ok'
                                                });
                                            }, 2000);
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
            // {
            //     nombre: 'Autorizar',
            //     color: 'perryButton',
            //     icono: 'fas fa-check',
            //     funcion: (item) => {
            //         if (userAuth.user.tipo.tipo === 'Administrador') {
            //             Swal.fire({
            //                 title: '¿Estas seguro?',
            //                 text: "¡No podrás revertir esto!",
            //                 icon: 'warning',
            //                 showCancelButton: true,
            //                 confirmButtonColor: '#3085d6',
            //                 cancelButtonColor: '#d33',
            //                 cancelButtonText: 'Cancelar',
            //                 confirmButtonText: 'Si, autorizar'
            //             }).then((result) => {
            //                 if (result.isConfirmed) {
            //                     Swal.fire({
            //                         title: 'autorizando',
            //                         text: 'Espere un momento...',
            //                         allowOutsideClick: false,
            //                         allowEscapeKey: false,
            //                         allowEnterKey: false,
            //                         showConfirmButton: false,
            //                         onOpen: () => {
            //                             Swal.showLoading()
            //                         }
            //                     })
            //                     try {
            //                         apiPutForm(`requisicion/${item.id}/autorizar`, { aprobado: 1 }, userAuth.access_token).then(result => {
            //                             Swal.close()
            //                             Swal.fire(
            //                                 '¡Autorizado!',
            //                                 'Ha sido Autorizado correctamente',
            //                                 'success'
            //                             )
            //                             if (reloadTable) {
            //                                 reloadTable.reload()
            //                             }

            //                         })
            //                     } catch (error) {
            //                         Swal.close()
            //                         Swal.fire(
            //                             '¡Error!',
            //                             'No ha sido Autorizado.',
            //                             'error'
            //                         )
            //                     }
            //                 }
            //             })
            //         } else {
            //             Swal.fire({
            //                 title: '¡No tienes permisos!',
            //                 text: "¡No tienes permisos para aprobar el presupuesto!",
            //                 icon: 'error',
            //                 confirmButtonColor: '#3085d6',
            //                 confirmButtonText: 'Ok'
            //             })
            //         }
            //     }
            // },
            
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

    let prop = {
        pathname: '/administracion/requisicion-contabilidad',
    }

    const getOpciones = () => { 
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        })

        apiOptions(`v2/proyectos/compras`, userAuth.access_token).then(
            (response) => {
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras, proyectos, proveedores, formasPago, metodosPago, estatusFacturas, cuentas } = response.data
                let aux = {}
                aux.empresas = setOptions(empresas, 'name', 'id')
                aux.proveedores = setOptions(proveedores, 'razon_social', 'id')
                /* aux.areas = setOptions(areas, 'nombre', 'id')
                aux.proyectos = setOptions(proyectos, 'nombre', 'id') */
                aux.tiposPagos = setOptions(tiposPagos, 'tipo', 'id')
                /* aux.tiposImpuestos = setOptions(tiposImpuestos, 'tipo', 'id') */
                /* aux.estatusCompras = setOptions(estatusCompras, 'estatus', 'id') */
                /* aux.estatusFacturas = setOptions(estatusFacturas, 'estatus', 'id')
                aux.formasPago = setOptions(formasPago, 'nombre', 'id')
                aux.metodosPago = setOptions(metodosPago, 'nombre', 'id') */
                aux.cuentas = setOptions(cuentas, 'nombre', 'id')
                setEstatusCompras(estatusCompras)
                setOpcionesApi(aux)
                Swal.close()
            }, (error) => { }
        ).catch((error) => { })
    }

    return (
        <>
            {/* <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='administracion'> */}
            <>
                <TablaGeneralPaginado 
                    titulo='Gasto' 
                    columnas={columnas} 
                    url='requisicion/admin' 
                    ProccessData={ProccessData} 
                    numItemsPagina={12} 
                    acciones={createAcciones()} 
                    opciones={opciones} 
                    reload={setReloadTable} 
                    filtros={filtrado}
                />
            </>
            {/* </Layout> */}

            {
                estatusCompras && opcionesApi ?
                <>
                <Modal size="xl" title={"Aprobar Requisición de compra"} show={modal.convertir.show} handleClose={handleClose('convertir')}>
                    <Convertir data={modal.convertir.data} handleClose={handleClose('convertir')} reload={reloadTable} opciones={opcionesApi} estatusCompras={estatusCompras} />
                </Modal>

                <Modal size="xl" title={"Editar requisición"} show={modal.editar.show} handleClose={handleClose('editar')}>
                    <Editar data={modal.editar.data} handleClose={handleClose('editar')} reload={reloadTable} opciones={opcionesApi} estatusCompras={estatusCompras} />
                </Modal>

                <Modal size="lg" title={"Nueva requisición"} show={modal.crear.show} handleClose={handleClose('crear')}>
                    <Crear handleClose={handleClose('crear')} reload={reloadTable} />
                </Modal>

                <Modal size="lg" title={"Adjuntos"} show={modal.adjuntos.show} handleClose={handleClose('adjuntos')}>
                    <Adjuntos data={modal.adjuntos.data} nuevaRequisicion={false} />
                </Modal>

                <Modal size="xl" title={"Ver requisición"} show={modal.ver.show} handleClose={handleClose('ver')}>
                    <Ver data={modal.ver.data} />
                </Modal>

                <Modal size="lg" title={"filtrar"} show={modal.filtrar.show} handleClose={handleClose('filtrar')}>
                    <FiltrarRequisicionesContabilidad data={modal.filtrar.data} handleClose={handleClose('filtrar')} opciones={opcionesApi} filtrarTabla={setFiltrado} borrarTabla={borrar} estatusCompras={estatusCompras} />
                </Modal>
                </>
                : null

            }

        </>
    )
}
