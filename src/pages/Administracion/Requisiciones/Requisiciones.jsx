import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';

import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import Tabla from './../../../components/NewTables/TablaGeneral/TablaGeneral'
import TablaGeneralPaginado from './../../../components/NewTables/TablaGeneral/TablaGeneralPaginado'
import { REQUISICIONES } from '../../../constants'
import { Modal } from '../../../components/singles'
import { apiDelete, apiPutForm } from './../../../functions/api'
import Adjuntos from '../../Administracion/RequisicionCompras/Modales/Adjuntos'
import NuevaRequisicion from '../../../components/forms/administracion/NuevaRequisicion'
import VerRequisicion from '../../../components/forms/administracion/VerRequisicion'
import {EditarRequisicion} from '../../../components/forms/administracion/EditarRequisicion'
import FiltrarRequisiciones from '../../../components/forms/administracion/FiltrarRequisiciones'
import Historial from '../../../components/forms/administracion/Historial'
import Comentarios from '../../../components/forms/administracion/comentarios'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import withReactContent from 'sweetalert2-react-content';

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
        historial:{
            show: false,
            data: false
        },
        comentarios:{
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


    const HtmlTooltip = withStyles((theme) => ({
        tooltip: {
          backgroundColor: '#f5f5f9',
          color: 'rgba(0, 0, 0, 0.87)',
          maxWidth: 500,
          maxHeight: 500,
          fontSize: theme.typography.pxToRem(14),
          border: '1px solid #dadde9',
        },
      }))(Tooltip);


    const proccessData = (datos) => {
        
        let aux = []
        datos.data.data.map((result) => {
            aux.push(
                    {
                        // acciones: acciones(),
                        terminar: botton(result),
                        orden_compra: result.orden_compra,
                        solicita: result.solicitante.name,
                        fecha: result.fecha,
                        fecha_view: reformatDate(result.fecha),
                        departamento: result.departamento ?  result.departamento.nombre : '',
                        tipo_gasto: result.gasto ? result.gasto.nombre: 'no definido',
                        // descripcion: result.descripcion,
                        descripcion: result.descripcion ? descripcion(result.descripcion) : 'N/A',

                        estatus: result.estatus ? result.estatus.estatus : 'pendiente' ,
                        tiempo_estimado: result.fecha_entrega ? result.fecha_entrega : 'no especificado',
                        id:result.id,
                        data: result, 
                        presupuesto: result.presu ? result.presu.nombre : '',
                        semaforo: createStatusIndicator(result)
                    }
                )
            })
            // aux=aux.reverse()
            return aux
    }


    const botton = (item) => {
        const handleClick = () => {
    
            if(item.id_estatus_compra == 11){
                Swal.fire({
                    title: 'Requisición ya terminada',
                    text: 'La requisición ya fue completada',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                })

            }else{
                
                const swalWithBootstrapButtons = withReactContent(Swal.mixin({
                    customClass: {
                        confirmButton: "btn btn-success",
                        cancelButton: "btn btn-danger"
                    },
                    buttonsStyling: false
                }));
              
            swalWithBootstrapButtons.fire({
                title: `¿Estás seguro que deseas terminar la requisición ${item.orden_compra} ? `,
                text: "No podrás revertir esto.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, terminar",
                cancelButtonText: "No, cancelar",
                reverseButtons: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // Realizar la llamada a la API después de confirmar
                    try {
                        apiPutForm(`requisicion/terminar/${item.id}`, item, userAuth.access_token)
                                .then((response) => {
    
                                    swalWithBootstrapButtons.fire({
                                        title: "¡Terminado!",
                                        text: "Tu requisicion ha sido terminado.",
                                        icon: "success"
                                    });
                                
                                    if (reloadTable) {
                                        reloadTable.reload()
                                    }
                                       
                                 
                                })
                                .catch((error) => {
                                    Swal.close()
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'Ha ocurrido un error 1',
                                    })
                                    console.log(error)
                                })      
                       
                    } catch (error) {
                        // Manejar errores de red u otros errores
                        console.error('Error al realizar la llamada a la API:', error);
                        swalWithBootstrapButtons.fire({
                            title: "Error",
                            text: "Hubo un error al procesar la solicitud.",
                            icon: "error"
                        });
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire({
                        title: "Cancelado",
                        text: "Tu archivo imaginario está a salvo :)",
                        icon: "error"
                    });
                    // Puedes agregar lógica adicional al cancelar aquí
                }
            });
            }
          
    };

    return (
        <Button className="btn btn-light-info btn-sm font-weight-bold" color="primary" onClick={handleClick}>
            Terminar
        </Button>
    );
};
    
    

    function reformatDate(dateStr) {
        var dArr = dateStr.split("-");  // ex input: "2010-01-18"
        return dArr[2] + "/" + dArr[1] + "/" + dArr[0]/* .substring(2) */; //ex output: "18/01/10"
    }

    const descripcion = (dato) => {  
        return(            
           <div>        
            <div>
                <HtmlTooltip
                title={
                    <React.Fragment>                 
                        {"Descripcion: " + dato }
                    </React.Fragment>
                } >
                <Button>{dato} </Button>
                </HtmlTooltip>
            </div>              
            </div>
        )
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
        // {
        //     //filtrar
        //     nombre: <div><i className="fas fa-filter mr-5"></i><span>Filtrar</span></div>,
        //     funcion: (item) => {
        //         setModal({
        //             ...modal,
        //             filtrar: {
        //                 show: true,
        //                 data: item
        //             }
        //         })
        //     }
        // },
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
                    if (item.data.autorizacion_2 ) {
                        Swal.fire({
                            title: 'Requisición ya aprobada',
                            text: 'La requisición ya fue comprada, no se puede editar',
                            icon: 'warning',
                            confirmButtonText: 'Aceptar'
                        })
                    } else {
                        setModal({
                            ...modal,
                            editar: {
                                show: true,
                                data: item.data
                            }
                        })
                    }
                
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
                    if (!item.data.autorizacion_2 ) {
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
                    } else {
                        Swal.fire({
                            title: 'Requisición ya aprobada',
                            text: 'La requisición ya fue comprada, no se puede cancelar',
                            icon: 'warning',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok'
                        })
                    }
                }
            },
            {
                nombre: 'Historial',
                icono: 'fas fa-paperclip',
                color: 'reyButton',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        historial: {
                            show: true,
                            data: item.data
                        }
                    })
                }
            }, 
            {
                nombre: 'Comentarios',
                icono: 'fas fa-paperclip',
                color: 'reyButton',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        comentarios: {
                            show: true,
                            data: item.data
                        }
                    })
                }
            }, 
        ]
    
    return (
        <>
            {/* <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='administracion'> */}
             <TablaGeneralPaginado
                titulo="Requisición"
                subtitulo="listado de requisición"
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
                <Adjuntos data={modal.adjuntos.data} nuevaRequisicion={true} factura={false} />
            </Modal>

            <Modal size="md" title={"ver requisición"} show={modal.ver.show} handleClose={handleClose('ver')}>
                <VerRequisicion data={modal.ver.data} verRequisicion={true}/>
            </Modal>

            <Modal size="lg" title={"Historial"} show={modal.historial.show}  handleClose={handleClose('historial')} >
                <Historial data={modal.historial.data} handleClose={e => handleClose('historial')} reload={reloadTable}/>
            </Modal>

            <Modal size="lg" title={"Comentarios"} show={modal.comentarios.show}  handleClose={handleClose('comentarios')} >
                <Comentarios data={modal.comentarios.data} handleClose={e => handleClose('comentarios')} reload={reloadTable}/>
            </Modal>


            <Modal size="lg" title={"Filtrar gastos"} show={modal.filtrar.show}  handleClose={handleClose('filtrar')} >
                <FiltrarRequisiciones handleClose={e => handleClose('filtrar')} filtrarTabla={setFiltrado} borrarTabla={borrar} reload={reloadTable}/>
            </Modal>

        </>
    )
    
}

export { Requisiciones }