import React, { useEffect, useState } from 'react';

import BotonAcciones from './BotonAcciones';

import '../../../../styles/_fases.scss'

export default function Fase1() {
    const [modal, setModal] = useState({
        edit_proyect: false,
        hire_phase: false,
        info: false,
    });
    return (
        <div className='container-fase'>
            <div>
                header
                <BotonAcciones modal={modal} setModal={setModal} />
            </div>
            <div>
                body
            </div>
        </div>
    )
}