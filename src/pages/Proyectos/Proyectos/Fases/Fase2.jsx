import React, { useEffect, useState } from 'react';

import TablaGeneral from '../../../../components/NewTables/TablaGeneral/TablaGeneral'
import BotonAcciones from './BotonAcciones';
import { Modal } from '../../../../components/singles'
import ProgressBar from './utils/ProgressBar';
import Modales from './utils/Modales';

export default function Fase2(props) {
    const { fase } = props;
    const [modal, setModal] = useState({
        edit_phase: false,
        add_agreement: false,
        hire_phase: false,
        invoice: false,
        sale: false,
        purchase: false,
        end_proyect: false,
        needs_program: false,
        uprising_photographs: false,
        plan_measurements: false,
        contract: false,
        proof_payment: false,
    });

    return (
        <div>
            <div className='container-fase'>
                <div>
                    <div>
                        <span>Avance de la fase</span>
                        <ProgressBar avance={78} />
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

            <Modales modal={modal} setModal={setModal} proyecto={fase} />
        </div>
    )
}