import React, { useEffect, useState } from 'react';

import TablaGeneral from '../../../../components/NewTables/TablaGeneral/TablaGeneral'
import BotonAcciones from './BotonAcciones';
import { Modal } from '../../../../components/singles'
import ProgressBar from './utils/ProgressBar';

import '../../../../styles/_fases.scss'
import BotonAdjuntos from './BotonAdjuntos';

import Modales from './utils/Modales';

export default function Fase1(props) {
    const {fase} = props;
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
        <>
            <div className='container-fase'>
                <div>
                    <div>
                        <span>Avance de la fase {fase.simpleName}</span>
                        <ProgressBar avance={54} />
                    </div>
                    <BotonAdjuntos modal={modal} setModal={setModal} />
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

        </>
        
    )
}