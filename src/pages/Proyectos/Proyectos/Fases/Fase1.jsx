import React, { useEffect, useState } from 'react';



import BotonAcciones from './BotonAcciones';
import { Modal } from '../../../../components/singles'

import '../../../../styles/_fases.scss'

export default function Fase1() {
    const [modal, setModal] = useState({
        edit_phase: false,
        add_agreement: false,
        hire_phase: false,
        invoice: false,
        sale: false,
        purchase: false,
        end_proyect: false,
    });
    return (
        <>
            <div className='container-fase'>
                <div>
                    <div>
                        porcentaje de avance
                    </div>
                    <BotonAcciones modal={modal} setModal={setModal} />
                </div>
                <div>
                    
                    <div>
                        Historial de minutas
                    </div>
                    <div>
                        Presupuesto inicial
                    </div>
                    <div>
                        Presupuestos adicionales
                    </div>
                </div>
            </div>

            <Modal size="lg" show={modal.edit_phase} title='Editar Fase' handleClose={() => setModal({ ...modal, edit_phase: false })}>
            </Modal>

            <Modal size="lg" show={modal.add_agreement} title='Minuta de Acuerdo' handleClose={() => setModal({ ...modal, add_agreement: false })}>
            </Modal>

            <Modal size="lg" show={modal.hire_phase} title='Contratar Fase' handleClose={() => setModal({ ...modal, hire_phase: false })}>
            </Modal>

            <Modal size="lg" show={modal.invoice} title='Facturar Fase' handleClose={() => setModal({ ...modal, invoice: false })}>
            </Modal>

            <Modal size="lg" show={modal.sale} title='Venta' handleClose={() => setModal({ ...modal, sale: false })}>
            </Modal>

            <Modal size="lg" show={modal.purchase} title='Compra' handleClose={() => setModal({ ...modal, purchase: false })}>
            </Modal>

            <Modal size="lg" show={modal.end_proyect} title='Finalizar Proyecto' handleClose={() => setModal({ ...modal, end_proyect: false })}>
            </Modal>

        </>
        
    )
}