import React, { useEffect, useState } from 'react';

import { DropdownButton, Dropdown } from 'react-bootstrap'
import { setNaviIcon } from '../../../../functions/setters'

export default function BotonAdjuntos({ modal, setModal }) {

    return (
        <div>
            <div className="card-toolbar">
                <div className="card-toolbar toolbar-dropdown">
                    <DropdownButton menualign="right"
                        title={<span className="d-flex">ADJUNTOS <i className="las la-angle-down icon-md p-0 ml-2"></i></span>} id='dropdown-proyectos' >

                        <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => setModal({ ...modal, needs_program: true })}>
                            {setNaviIcon('las la-clipboard-list icon-xl', 'PROGRAMA DE NECESIDADES')}
                        </Dropdown.Item>

                        <Dropdown.Item className="text-hover-success dropdown-success" onClick={() => setModal({ ...modal, uprising_photographs: true })}>
                            {setNaviIcon('las la-pencil-alt icon-xl', 'FOTOGRAFIAS LEVANTAMIENTO')}
                        </Dropdown.Item>

                        <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => setModal({ ...modal, plan_measurements: true })}>
                            {setNaviIcon('las la-handshake icon-xl', 'PLANO DE MEDIDAS')}
                        </Dropdown.Item>

                        <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => setModal({ ...modal, contract: true })}>
                            {setNaviIcon('las la-handshake icon-xl', 'CONTRATO')}
                        </Dropdown.Item>

                        <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => setModal({ ...modal, proof_payment: true })}>
                            {setNaviIcon('las la-handshake icon-xl', 'COMPROBANTE DE PAGO')}
                        </Dropdown.Item>

                    </DropdownButton>
                </div>
            </div>
        </div>
    )
}