import React from 'react';

import { Modal } from '../../../../../components/singles'
import ProgramaNecesidades from './ProgramaNecesidades';
import EditProyect from '../../EditProyect'
import SolicitarFactura from './SolicitarFactura'
import Compra from './Compra'
import Venta from './Venta'
import Presupuesto from './Presupuesto'
import Avances from './Avances'
import NotasObra from './NotasObra'
import AdjuntosFase1 from './AdjuntosFase1'
import AdjuntosFase2 from './AdjuntosFase2'
import AdjuntosFase3 from './AdjuntosFase3'

export default function Modales({ modal, setModal, proyecto, reload, opciones, fase }) {
    return (
        <>
            <Modal size="lg" show={modal.edit_phase} title='Editar Fase' handleClose={() => setModal({ ...modal, edit_phase: false })}>
                <EditProyect proyecto={proyecto} reload={reload} />
            </Modal>

            {/* <Modal size="lg" show={modal.add_agreement} title='Minuta de Acuerdo' handleClose={() => setModal({ ...modal, add_agreement: false })}>
            </Modal> */}

            {/* <Modal size="lg" show={modal.hire_phase} title='Contratar Fase' handleClose={() => setModal({ ...modal, hire_phase: false })}>
            </Modal> */}

            <Modal size="lg" show={modal.invoice} title='Facturar Fase' handleClose={() => setModal({ ...modal, invoice: false })}>
                <SolicitarFactura proyecto={proyecto} opciones={opciones} />
            </Modal>

            <Modal size="lg" show={modal.sale} title='Nueva solicitud de venta' handleClose={() => setModal({ ...modal, sale: false })}>
                <Venta proyecto={proyecto} opciones={opciones} />
            </Modal>

            <Modal size="lg" show={modal.purchase} title='Nueva solicitud de compra' handleClose={() => setModal({ ...modal, purchase: false })}>
                <Compra proyecto={proyecto} opciones={opciones} />
            </Modal>

            <Modal size="lg" show={modal.end_proyect} title='Finalizar Proyecto' handleClose={() => setModal({ ...modal, end_proyect: false })}>
            </Modal>

            <Modal size="lg" show={modal.construction_notes} title='Notas de Obra' handleClose={() => setModal({ ...modal, construction_notes: false })}>
                <NotasObra proyecto={proyecto} activo={modal.construction_notes} />
            </Modal>

            <Modal size="xl" show={modal.budget} title='Presupuesto' handleClose={() => setModal({ ...modal, budget: false })}>
                <Presupuesto proyecto={proyecto} activo={modal.budget} reload={reload} />
            </Modal>

            <Modal size="xl" show={modal.advance} title='Avances' handleClose={() => setModal({ ...modal, advance: false })}>
                <Avances proyecto={proyecto} activo={modal.advance} reload={reload} />
            </Modal>



            <Modal size="lg" show={modal.needs_program} title='Programa de Necesidades' handleClose={() => setModal({ ...modal, needs_program: false })}>
                <ProgramaNecesidades />
            </Modal>

            <Modal size="lg" show={modal.attachments} title={`Adjuntos de la fase ${fase}`} handleClose={() => setModal({ ...modal, attachments: false })} style={{ width: '50vh' }}>
                {
                    fase === 1 ?
                        <AdjuntosFase1 proyecto={proyecto} /> 
                    : fase === 2 ?
                        <AdjuntosFase2 proyecto={proyecto} />
                    : fase === 3 ?
                        <AdjuntosFase3 proyecto={proyecto} />
                    : null
                }
                
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