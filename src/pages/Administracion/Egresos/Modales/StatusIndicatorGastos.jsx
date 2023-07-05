import React, {useState} from 'react';
import { Modal } from '../../../../components/singles'

import Style from './../../Requisiciones/utils/StatusIndicator.module.css';

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

export default function StatusIndicator(props) { 
    const { estatus_compra, estatus_conta, auto1, auto2, estatus_factura, estatus, factura, facturas, total, total_facturas} = props.data
    console.log('empieza')
    console.log(factura)
    console.log(estatus_compra.estatus)
    console.log(total)
    console.log(total_facturas)
    console.log('termina')

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
                    estatus && estatus.id === 15 && estatus_compra && estatus_compra.id === 15 && estatus_conta && estatus_conta.id === 15 ?
                        <>
                            <span
                                className={Style.containerEliminado}
                                title={`Gasto Eliminado`}
                            >
                                <Eliminada /> Gasto Eliminado

                            </span>
                        </>
                        :
                        <>
                            <div
                                className={
                                    estatus_compra && (estatus_compra.estatus === "COMPLETO" || estatus_compra.estatus === "COMPLETADA") 
                                    ? Style.greenBox : estatus_compra && (estatus_compra.estatus === "CANCELADA" || estatus_compra.estatus === "Cancelada") 
                                    ? Style.redBox : estatus_compra ? Style.yellowBox: Style.grayBox}
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
                                    estatus_compra && estatus_compra.estatus === 'COMPLETO' ?
                                    <Completada/>
                                    :
                                    estatus_compra && estatus_compra.estatus === 'CANCELADA' ?
                                    <Cancelada/>
                                    :
                                    <span><AccessTimeIcon/></span>
                                }
                            </div>
                            <div
                                className={Style.greenBox}
                                title={`Estatus contabilidad: ${estatus_conta ? estatus_conta.estatus : 'Completada'}`}
                            >
                                {
                                    //estatus_conta && estatus_conta.estatus === 'Completada' ?
                                    <Completada/>
                                    //:
                                    //<span><AccessTimeIcon/></span>
                                }
                            </div>
                            <div
                                className={Style.greenBox}
                                title={`Estatus autorización compras: ${auto1 ? 'Autorizado' : 'Completada'}`}
                            >
                                {
                                    <Completada/>
                                }
                                
                            </div>
                            <div
                                className={factura === 0 ? Style.greenBox : '' || factura === 1 && facturas.length===0 ? Style.redBox : '' || factura === 1 && total === total_facturas ? Style.greenBox : '' || factura === 1  && total < total_facturas ? Style.greenBox : '' || factura === 1  && total > total_facturas ? Style.yellowBox : '' }

                                title={`Estatus factura: ${factura === 0 ? 'COMPLETO' : factura === 1 && facturas.length===0  ? 'Falta factura': factura === 1 && total === total_facturas ? 'completo' : factura === 1  && total < total_facturas ? 'completo' : factura === 1  && total > total_facturas ? 'con factura, pero falta monto' : ''}`}
                            >
                                {
                                    factura === 0 ? 
                                        <Completada/> 
                                    :
                                    factura === 1 && facturas.length === 0 ? 
                                        <Cancelada/>
                                    :
                                    factura === 1 && total === total_facturas ?
                                        <Completada/> 
                                    :
                                    factura === 1  && total < total_facturas ?
                                        <Completada/> 
                                    :
                                    factura === 1  && total > total_facturas ?
                                        <EnProceso/>
                                    :
                                    <span><DescriptionOutlinedIcon /></span>
                                    //     :
                                    // <span><AccessTimeIcon /></span>
                                }
                            </div>
                            <div
                                className={Style.greenBox}
                                title={`Estatus autorización contabilidad: ${auto2 ? 'Autorizado' : 'Completada'}`}
                            >
                                {
                                    <Completada/>
                                }
                            </div>
                            
                            <div
                                className={Style.greenBox}
                                title={`Cuentas: ${auto2 ? 'Afectadas' : 'sin afectar'}`}
                            >
                                {
                                    <Completada/>
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
                                {estatus_conta ? estatus_conta.estatus : 'Completo'}
                            </span>
                        </span>
                    </div>
                    <div>
                        <span>
                            Autorización compras:
                            <span style={{fontWeight: 'bold'}}>
                                {auto1 ? `Autoriza ${auto1.name}` : 'Completo'}
                            </span>
                        </span>
                    </div>
                    <div>
                        <span>
                            Autorización contabilidad:
                            <span style={{fontWeight: 'bold'}}>
                                {auto2 ? `Autoriza ${auto2.name}` : 'Completo'}
                            </span>
                        </span>
                    </div>
                    <div>
                        <span>
                            Estatus factura:
                            <span style={{ fontWeight: 'bold' }}>
                                {estatus_factura ? estatus_factura.estatus : 'Pendiente'}
                            </span>
                        </span>
                    </div>
                    <div>
                        <span>
                            Cuentas:
                            <span style={{ fontWeight: 'bold' }}>
                                {auto2 ? 'Afectadas' : 'Afectadas'}
                            </span>
                        </span>
                    </div>

                    <br></br>
                    leyenda:
                    <br></br>
                    <div>
                        <span>Estatus compras:</span>
                        <span style={{color:'rgba(0, 0, 0, 0.5)'}}> Pendiente <AccessTimeIcon/> / </span>
                        <span style={{color:'#FFD549'}}>Pagado, pendiente de factura <EnProceso/> / </span>
                        <span style={{color:'#FFD549'}}>Pagada <Pagada/> / </span>
                        <span style={{color:'#FFD549'}}>En camino <EnCamino/> / </span>
                        <span style={{color:'#1693A5'}}>Completo <Completada/> / </span>
                        <span style={{color:'rgba(242, 108, 79, 0.85)'}}>CANCELADA <Cancelada/></span>
                    </div>
                    <br></br>
        
                    <div>
                        <span>Estatus facturas:</span>
                        <span style={{color:'#FFD549'}}>Con factura, pero monto faltante <EnProceso/> / </span>
                        <span style={{color:'#1693A5'}}>Completo <Completada/> / </span>
                        <span style={{color:'rgba(242, 108, 79, 0.85)'}}>sin factura <Cancelada/></span>
                    </div>
                </div>
            </Modal> 
        </>
    )
}