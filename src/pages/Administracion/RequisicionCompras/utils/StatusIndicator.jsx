import React, {useState} from 'react';
import { Modal } from '../../../../components/singles'

import Style from './StatusIndicator.module.css';

import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined';
import EnProceso from '@material-ui/icons/HourglassEmptyOutlined';
import Pagada from '@material-ui/icons/CreditCardOutlined';
import EnCamino from '@material-ui/icons/LocalShippingOutlined';
import Completada from '@material-ui/icons/AssignmentTurnedInOutlined';
import Cancelada from '@material-ui/icons/BlockOutlined';
import Eliminada from '@material-ui/icons/DeleteOutline';
import Administracion from '@material-ui/icons/SupervisorAccount';

export default function StatusIndicator(props) { 
    const { estatus_compra, estatus_conta, auto1, auto2,auto3, estatus } = props.data
    const [modal, setModal] = useState({
        status: {
            data: false,
            show: false
        }
    })

    const openModal = () => {
        setModal({
            status: {
                show: true
            }
        })
    }
    const handleClose = () => {
        setModal({
            status: {
                show: false
            }
        })
    }
    return (
        <>
            <div className={Style.container} onClick={openModal}>
                {
                    estatus && estatus.id === 12 && estatus_compra && estatus_compra.id === 12 && estatus_conta && estatus_conta.id === 12?
                        <>
                            <span
                                className={Style.containerEliminado}
                                title={`Gasto Eliminado`}
                            >
                                <Eliminada/> Gasto Eliminado / cancelado
                        
                            </span>
                        </>
                        : 
                        <>
                            <div
                                className={ estatus_conta && estatus_conta.id === 19 ? Style.blueBox : estatus_compra && (estatus_compra.estatus === "Completada" || estatus_compra.estatus === "COMPLETADA") ? Style.greenBox : estatus_compra && (estatus_compra.estatus === "CANCELADA" || estatus_compra.estatus === "Cancelada") ? Style.redBox : estatus_compra ? Style.yellowBox: Style.grayBox}
                                title={`Estatus compra: ${estatus_compra ? estatus_compra.estatus : 'Pendiente'}`}
                            >
                                {
                                    estatus_compra && estatus_compra.estatus === 'EN PROCESO' ?
                                    <EnProceso/>
                                    :
                                    estatus_compra && estatus_compra.estatus === 'PAGADA' ?
                                    <Pagada/>
                                    :
                                    estatus_compra && estatus_compra.estatus === 'EN CAMINO' ?
                                    <EnCamino/>
                                    :
                                    estatus_compra && estatus_compra.estatus === 'COMPLETADA' ?
                                    <Completada/>
                                    :
                                    estatus_compra && estatus_compra.estatus === 'CANCELADA' ?
                                    <Cancelada/>
                                    :
                                    estatus_conta && estatus_conta.id === 19 ? 
                                    <Administracion />
                                    :
                                    <span><AccessTimeIcon/></span>
                                }
                            </div>
                            
                            <div
                                className={auto1 ? Style.greenBox : Style.grayBox}
                                title={`Estatus autorización compras: ${auto1 ? 'Autorizado' : 'Pendiente'}`}
                            >
                                {
                                    auto1 ? 
                                    <span><DoneIcon/></span>
                                    : 
                                    <span><AccessTimeIcon/></span>
                                }
                            </div>
                            <div
                                className={auto3 ? Style.greenBox : Style.grayBox}
                                title={`Estatus autorización admin: ${auto3 ? 'Autorizado' : 'Pendiente'}`}
                            >
                                {
                                    auto3 ? 
                                    <span><DoneIcon/></span>
                                    : 
                                    <span><AccessTimeIcon/></span>
                                }
                            </div>
                            <div
                                className={estatus_conta && (estatus_conta.estatus === "Pagado" || estatus_conta.estatus === "PAGADO") ? Style.greenBox : estatus_conta && (estatus_conta.estatus === "Rechazado" || estatus_conta.estatus === "RECHAZADO") ? Style.redBox : estatus_conta ? Style.yellowBox : Style.grayBox}
                                title={`Estatus contabilidad: ${estatus_conta ? estatus_conta.estatus : 'Pendiente'}`}
                            >
                                {
                                    estatus_conta && estatus_conta.estatus === 'PAGADO' ?
                                        <Pagada />
                                        :
                                        estatus_conta && estatus_conta.estatus === 'RECHAZADO' ?
                                            <Cancelada />
                                            :
                                            <span><AccessTimeIcon /></span>
                                }
                            </div>
                            <div
                                className={auto2 ? Style.greenBox : Style.grayBox}
                                title={`Estatus autorización contabilidad: ${auto2 ? 'Autorizado' : 'Pendiente'}`}
                            >
                                {
                                    auto2 ? 
                                    <span><DoneAllIcon/></span>
                                    : 
                                    <span><AccessTimeIcon/></span>
                                }
                            </div>    
                        </>
                }
                
            </div>

            <Modal size="md" title={"Estatus"} show={modal.status.show} handleClose={handleClose}>
                <div>
                    <div>
                        <span>
                            Estatus compras:
                            <span style={{fontWeight: 'bold'}}>
                                {estatus_compra ? estatus_compra.estatus : 'Pendiente'}
                            </span>
                        </span>
                    </div>
                    <div>
                        <span>
                            Estatus contabilidad: 
                            <span style={{fontWeight: 'bold'}}>
                                {estatus_conta ? estatus_conta.estatus : 'Pendiente'}
                            </span>
                        </span>
                    </div>
                    <div>
                        <span>
                            Autorización compras:
                            <span style={{fontWeight: 'bold'}}>
                                {auto1 ? `Autoriza ${auto1.name}` : 'Pendiente'}
                            </span>
                        </span>
                    </div>
                    <div>
                        <span>
                            Autorización contabilidad:
                            <span style={{fontWeight: 'bold'}}>
                                {auto2 ? `Autoriza ${auto2.name}` : 'Pendiente'}
                            </span>
                        </span>
                    </div>
                    <div>
                        <span>
                            Autorización Administracion:
                            <span style={{fontWeight: 'bold'}}>
                                {auto3 ? `Autoriza ${auto3.name}` : 'Pendiente'}
                            </span>
                        </span>
                    </div>

                    <br></br>
                    leyenda:
                    <br></br>
                    <div>
                        <span>Estatus compras:</span>
                        <span style={{color:'rgba(0, 0, 0, 0.5)'}}> Pendiente <AccessTimeIcon/> / </span>
                        <span style={{color:'#FFD549'}}>En proceso <EnProceso/> / </span>
                        <span style={{color:'#FFD549'}}>Pagada <Pagada/> / </span>
                        <span style={{color:'#FFD549'}}>En camino <EnCamino/> / </span>
                        <span style={{color:'#1693A5'}}>Completada <Completada/> / </span>
                        <span style={{color:'rgba(242, 108, 79, 0.85)'}}>CANCELADA <Cancelada/> / </span>
                        <span style={{color:'rgba(58, 137, 201, 1)'}}>ANÁLISIS ADMINISTRACIÓN <Administracion/> </span>

                    </div>
                    <br></br>
                    <div>
                        <span>Estatus contabilidad:</span>
                        <span style={{color:'rgba(0, 0, 0, 0.5)'}}> Pendiente <AccessTimeIcon/> / </span> 
                        <span style={{color:'#1693A5'}}> Pagado <Pagada/> / </span>
                        <span style={{color:'rgba(58, 137, 201, 1)'}}>ANÁLISIS ADMINISTRACIÓN <Administracion/> </span>
                    </div>
                    
                </div>
            </Modal> 
        </>
    )
}