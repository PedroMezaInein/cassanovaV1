import React, {useState} from 'react';
import { Modal } from '../../../../components/singles'

import Style from './StatusIndicator.module.css';

export default function StatusIndicator(props) { 
    const { estatus_compra, estatus_conta, auto1, auto2, estatus_factura } = props.data
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
                <div
                    className={estatus_compra && (estatus_compra.estatus === "Completada" || estatus_compra.estatus === "COMPLETADA") ? Style.greenBox : estatus_compra && (estatus_compra.estatus === "CANCELADA" || estatus_compra.estatus === "Cancelada") ? Style.redBox : estatus_compra ? Style.yellowBox: Style.grayBox}
                    title={`Estatus compra: ${estatus_compra ? estatus_compra.estatus : 'Pendiente'}`}
                >
                    <span >1</span>
                </div>
                <div
                    className={estatus_conta && (estatus_conta.estatus === "Pagado" || estatus_conta.estatus === "PAGADO") ? Style.greenBox : estatus_conta && (estatus_conta.estatus === "Rechazado" || estatus_conta.estatus === "RECHAZADO") ? Style.redBox : estatus_conta ? Style.yellowBox : Style.grayBox}
                    title={`Estatus contabilidad: ${estatus_conta ? estatus_conta.estatus : 'Pendiente'}`}
                >
                    <span>2</span>
                </div>
                <div
                    className={auto1 ? Style.greenBox : Style.grayBox}
                    title={`Estatus autorización compras: ${auto1 ? 'Autorizado' : 'Pendiente'}`}
                >
                    <span>3</span>
                </div>
                <div
                    className={auto2 ? Style.greenBox : Style.grayBox}
                    title={`Estatus autorización contabilidad: ${auto2 ? 'Autorizado' : 'Pendiente'}`}
                >
                    <span>4</span>
                </div>
                <div
                    className={estatus_factura && (estatus_factura.estatus === "Facturado" || estatus_factura.estatus === "FACTURADO") ? Style.greenBox : estatus_factura && (estatus_factura.estatus === "Pendiente de factura" || estatus_factura.estatus === "PENDIENTE DE FACTURA") ? Style.yellowBox : estatus_factura ? Style.yellowBox : Style.grayBox}
                    title={`Estatus factura: ${estatus_factura ? estatus_factura.estatus : 'Pendiente'}`}
                >
                    <span>5</span>
                </div>
                <div
                    className={auto2 ? Style.greenBox : Style.grayBox}
                    title={`Cuentas: ${auto2 ? 'Afectadas' : 'sin afectar'}}`}
                >
                    <span>6</span>
                </div>
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
                                {auto2 ? 'Afectadas' : 'sin afectar'}
                            </span>
                        </span>
                    </div>
                </div>
            </Modal> 
        </>
    )
}