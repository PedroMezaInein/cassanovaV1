import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';

import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import Tabla from './../../../components/NewTables/TablaGeneral/TablaGeneral'
import TablaGeneralPaginado from './../../../components/NewTables/TablaGeneral/TablaGeneralPaginado'
import { REQUISICIONES } from '../../../constants'
import { Modal } from '../../../components/singles'
import { apiDelete } from './../../../functions/api'
import Adjuntos from '../../Administracion/RequisicionCompras/Modales/Adjuntos'
import NuevaRequisicion from '../../../components/forms/administracion/NuevaRequisicion'
import VerRequisicion from '../../../components/forms/administracion/VerRequisicion'
import {EditarRequisicion} from '../../../components/forms/administracion/EditarRequisicion'
import FiltrarRequisiciones from '../../../components/forms/administracion/FiltrarRequisiciones'

import useOptionsArea from '../../../hooks/useOptionsArea'
import StatusIndicator from './utils/StatusIndicator'

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
        filtrar: {
            show: false,
            data: null
        },
        adjuntos: {
            show: false,
            data: false
        },
        ver: {
            show: false,
            data: false
        },
        cancelar: {
            show: false,
            data: false
        },

    })

    useOptionsArea()

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
    const [filtrado, setFiltrado] = useState('') 

    let prop = {
        pathname: '/administracion/requisicion',
    }

    const createStatusIndicator = (item) => {
        return (
            <StatusIndicator data={item} />
        )
    }

    const proccessData = (datos) => {
        
        let aux = []
        datos.data.data.map((result) => {
            aux.push(
                    {
                        // acciones: acciones(),
                        orden_compra: result.orden_compra,
                        solicitante: result.solicitante.name,
                        fecha: result.fecha,
                        fecha_view: reformatDate(result.fecha),
                        departamento: result.departamento ?  result.departamento.nombre : '',
                        tipo_gasto: result.gasto ? result.gasto.nombre: 'no definido',
                        descripcion: result.descripcion,
                        estatus: result.estatus ? result.estatus.estatus : 'pendiente' ,
                        tiempo_estimado: result.fecha_entrega ? result.fecha_entrega : 'no especificado',
                        id:result.id,
                        data: result,
                        semaforo: createStatusIndicator(result)
                    }
                )
            })
            // aux=aux.reverse()
            return aux
    }

    function reformatDate(dateStr) {
        var dArr = dateStr.split("-");  // ex input: "2010-01-18"
        return dArr[2] + "/" + dArr[1] + "/" + dArr[0]/* .substring(2) */; //ex output: "18/01/10"
    }

    const openModal = (tipo, data) => {
        if(data.factura == 'Sin factura' && tipo == 'facturas' ){
            Swal.fire({
                icon: 'error',
                title: 'No tiene facura',
                text: 'El registro es sin factura',
                showConfirmButton: false,
                timer: 1500
            })
            
        }else{
            setModal({
                ...modal,
                [tipo]: {
                    show: true,
                    data: data
                }
            })
        }

    }
    
    const handleOpen = [
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

    let handleClose = (tipo) => () => {
        setModal({
            ...modal,
            [tipo]: {
                show: false,
                data: false
            }
        })
    }

    const acciones = [
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
            {
                nombre: 'Cancelar',
                color: 'redButton',
                icono: 'fas fa-trash-alt',
                funcion: (item) => {
                    // if (userAuth.user.tipo.tipo === 'Administrador') {
                        Swal.fire({
                            title: '¿Estas seguro?',
                            text: "¡No podrás revertir esto!",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            cancelButtonText: 'Cancelar',
                            confirmButtonText: 'Si, Cancelar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                try {
                                    apiDelete(`requisicion/${item.id}/cancelar`, userAuth.access_token).then(result => {
                                        if (reloadTable) {
                                            reloadTable.reload()
                                        }
                                        Swal.fire({
                                            title: 'Cancelado!',
                                            text: 'La requisición se ha cancelado',
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
                    // } else {
                    //     Swal.fire({
                    //         title: '¡No tienes permisos!',
                    //         text: "¡No tienes permisos para eliminar el presupuesto!",
                    //         icon: 'error',
                    //         confirmButtonColor: '#3085d6',
                    //         confirmButtonText: 'Ok'
                    //     })
                    // }
                }
            },
        ]
    
    return (
        <>
            {/* <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='administracion'> */}
             <TablaGeneralPaginado
                titulo="Requisición"
                subtitulo="listado de gastos"
                url={'requisicion'}
                columnas={REQUISICIONES}
                numItemsPagina={50}
                ProccessData={proccessData}
                opciones={handleOpen}
                acciones={acciones}
                reload={setReloadTable} 
                filtros={filtrado}
            />
            {/* </Layout> */}

            <Modal size="lg" title={"Nueva requisición"} show={modal.crear.show} handleClose={handleClose('crear')}>
                <NuevaRequisicion handleClose={handleClose('crear')} reload={reloadTable}/>
            </Modal>

            <Modal size="lg" title={"Editar requisición"} show={modal.editar.show} handleClose={handleClose('editar')}>
                <EditarRequisicion data={modal.editar.data} handleClose={handleClose('editar')} reload={reloadTable}/>
            </Modal>

            <Modal size="lg" title={"Adjuntos"} show={modal.adjuntos.show} handleClose={handleClose('adjuntos')}>
                <Adjuntos data={modal.adjuntos.data} nuevaRequisicion={true}/>
            </Modal>

            <Modal size="md" title={"ver requisición"} show={modal.ver.show} handleClose={handleClose('ver')}>
                <VerRequisicion data={modal.ver.data} verRequisicion={true}/>
            </Modal>

            <Modal size="lg" title={"Filtrar gastos"} show={modal.filtrar.show}  handleClose={handleClose('filtrar')} >
                <FiltrarRequisiciones handleClose={e => handleClose('filtrar')} filtrarTabla={setFiltrado} borrarTabla={borrar} reload={reloadTable}/>
            </Modal>

        </>
    )
    
}

export { Requisiciones }