import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';

import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import Tabla from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import TablaGeneralPaginado from '../../../components/NewTables/TablaGeneral/TablaGeneralPaginado'
import { REQUISICIONES } from '../../../constants'
import { Modal } from '../../../components/singles'
import { apiDelete, apiPutForm } from '../../../functions/api'
import Adjuntos from '../RequisicionCompras/Modales/Adjuntos'
import NuevaRequisicion from '../../../components/forms/administracion/NuevaRequisicion'
import VerRequisicion from '../../../components/forms/administracion/VerRequisicion'
import {EditarRequisicion} from '../../../components/forms/administracion/EditarRequisicion'
import Autoriza from '../../../components/forms/administracion/Autorizar'

import useOptionsArea from '../../../hooks/useOptionsArea'
import StatusIndicator from './utils/StatusIndicator'

function Requisicionesautoriza () {

    const userAuth = useSelector((state) => state.authUser);
    const [reloadTable, setReloadTable] = useState()
    const [modal, setModal] = useState({

        crear: {
            show: false,
            data: false
        },

        autoriza: {
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

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Orden no.', identificador: 'presupuesto', sort: false, },
        // { nombre: 'Solicitante', identificador: 'solicita', sort: false, stringSearch: false },
        { nombre: 'Departamento', identificador: 'area', sort: false, stringSearch: false },
        { nombre: 'Partida', identificador: 'partida', sort: false, stringSearch: false },
        { nombre: 'Subpartida', identificador: 'subpartida', sort: false, stringSearch: false },
        { nombre: 'Monto solicitado (*)', identificador: 'monto', sort: false, stringSearch: false },
        /* { nombre: 'Aprobación', identificador: 'aprobacion', sort: false, stringSearch: false }, */
    ]

    const proccessData = (datos) => {
        
        let aux = [];
            datos.data.data.map((result) => {
                let totalMeses = 0;

                if (result.enero) totalMeses += result.enero;
                if (result.febrero) totalMeses += result.febrero;
                if (result.marzo) totalMeses += result.marzo;
                if (result.abril) totalMeses += result.abril;
                if (result.mayo) totalMeses += result.mayo;
                if (result.junio) totalMeses += result.junio;
                if (result.julio) totalMeses += result.julio;
                if (result.agosto) totalMeses += result.agosto;
                if (result.septiembre) totalMeses += result.septiembre;
                if (result.octubre) totalMeses += result.octubre;
                if (result.noviembre) totalMeses += result.noviembre;
                if (result.diciembre) totalMeses += result.diciembre;

                aux.push({
                    presupuesto: result.presupuesto.nombre,
                    area: result.areas.nombre,
                    partida: result.partidas.nombre,
                    subpartida: result.subpartidas.nombre,
                    // solicita: result.departamento ? result.departamento.nombre : '',
                    monto: totalMeses,
                    id: result.id,
                    data: result,
                });
            });
            return aux;
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
            nombre: <div><i className="fas fa-plus mr-5"></i><span>autorizar</span></div>,
            funcion: (item) => { 
                setModal({
                    ...modal,
                    autoriza: {
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
            nombre: 'Autorizar',
            color: 'perryButton',
            icono: 'fas fa-check',
            funcion: (item) => {
                if (userAuth.user.tipo.tipo === 'Administrador') {            

                    // if (!item.estatus) {
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
                                    apiPutForm(`requisicion/${item.id}/autorizarpresu`, { aprobado: 1 }, userAuth.access_token).then(result => {
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
                    // } else {
                    //     Swal.fire({
                    //         title: 'Presupuesto ya autorizado',
                    //         text: "¡El presupuesto ya ha sido autorizado!",
                    //         icon: 'error',
                    //         confirmButtonColor: '#3085d6',
                    //         confirmButtonText: 'Ok'
                    //     })
                    // }

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
    
    return (
        <>
            {/* <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='administracion'> */}
             <TablaGeneralPaginado
                titulo="Requisición"
                subtitulo="listado de gastos"
                url={'requisicion/autoriza/presupuesto'}
                columnas={columnas}
                numItemsPagina={50}
                ProccessData={proccessData}
                opciones={handleOpen}
                acciones={acciones}
                reload={setReloadTable} 
                filtros={filtrado}
            />
            {/* </Layout> */}

                        
            <Modal size="xl" title={"autoriza Requisicion"} show={modal.autoriza.show} handleClose={handleClose('autoriza')}>
                 <Autoriza data={modal.autoriza.data} handleClose={handleClose('autoriza')} filtrarTabla={setFiltrado} />
            </Modal>
        </>
    )
    
}

export { Requisicionesautoriza }