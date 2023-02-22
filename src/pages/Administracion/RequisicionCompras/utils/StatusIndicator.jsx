import React, {useState} from 'react';
import { Modal } from '../../../../components/singles'

import Style from './StatusIndicator.module.css';

export default function StatusIndicator(props) { 
    console.log(props.data)
    const { estatus_compra } = props.data
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
                    className={estatus_compra && (estatus_compra.estatus === "Completada" || estatus_compra.estatus === "COMPLETADA") ? Style.greenBox : estatus_compra && (estatus_compra.estatus === "CANCELADA" || estatus_compra.estatus === "Cancelada") ? Style.redBox : Style.yellowBox}
                    title={`Estatus compra: ${estatus_compra ? estatus_compra.estatus : ''}`}
                >
                    <span >1</span>
                </div>
                <div>
                    <span>2</span>
                </div>
                <div>
                    <span>3</span>
                </div>
            </div>
            <Modal size="md" title={"Estatus"} show={modal.status.show} handleClose={handleClose}>
                <span>Requisición: status example 01</span>
            </Modal> 
        </>
    )
}