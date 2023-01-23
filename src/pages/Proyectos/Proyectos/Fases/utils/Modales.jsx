import React from 'react';

import { Modal } from '../../../../../components/singles'
import ProgramaNecesidades from './ProgramaNecesidades';
import EditProyect from '../../EditProyect'
import SolicitarFactura from './SolicitarFactura'

export default function Modales({ modal, setModal, proyecto, reload, opciones }) {
    return (
        <>
            <Modal size="lg" show={modal.edit_phase} title='Editar Fase' handleClose={() => setModal({ ...modal, edit_phase: false })}>
                <EditProyect proyecto={proyecto} reload={reload} />
            </Modal>

            <Modal size="lg" show={modal.add_agreement} title='Minuta de Acuerdo' handleClose={() => setModal({ ...modal, add_agreement: false })}>
            </Modal>

            <Modal size="lg" show={modal.hire_phase} title='Contratar Fase' handleClose={() => setModal({ ...modal, hire_phase: false })}>
            </Modal>

            <Modal size="lg" show={modal.invoice} title='Facturar Fase' handleClose={() => setModal({ ...modal, invoice: false })}>
                <SolicitarFactura proyecto={proyecto} opciones={opciones} />
            </Modal>

            <Modal size="lg" show={modal.sale} title='Venta' handleClose={() => setModal({ ...modal, sale: false })}>
            </Modal>

            <Modal size="lg" show={modal.purchase} title='Compra' handleClose={() => setModal({ ...modal, purchase: false })}>
            </Modal>

            <Modal size="lg" show={modal.end_proyect} title='Finalizar Proyecto' handleClose={() => setModal({ ...modal, end_proyect: false })}>
            </Modal>

            

            <Modal size="lg" show={modal.needs_program} title='Programa de Necesidades' handleClose={() => setModal({ ...modal, needs_program: false })}>
                <ProgramaNecesidades />
            </Modal>

            <Modal size="lg" show={modal.uprising_photographs} title='Fotografías de Levantamiento' handleClose={() => setModal({ ...modal, uprising_photographs: false })}>
            </Modal>

            <Modal size="lg" show={modal.plan_measurements} title='Planos de Medidas' handleClose={() => setModal({ ...modal, plan_measurements: false })}>
            </Modal>

            <Modal size="lg" show={modal.contract} title='Contrato' handleClose={() => setModal({ ...modal, contract: false })}>
            </Modal>

            <Modal size="lg" show={modal.proof_payment} title='Comprobante de Pago' handleClose={() => setModal({ ...modal, proof_payment: false })}>
            </Modal>
        </>
    )
}