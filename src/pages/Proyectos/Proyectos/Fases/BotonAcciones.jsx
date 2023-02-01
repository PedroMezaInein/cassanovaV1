import React, { useEffect, useState } from 'react';

import { DropdownButton, Dropdown } from 'react-bootstrap'
import { setNaviIcon } from '../../../../functions/setters'

export default function BotonAcciones({ modal, setModal }) {
    
    return (
        <div>
            <div className="card-toolbar">
                <div className="card-toolbar toolbar-dropdown">
                    <DropdownButton menualign="right"
                        title={<span className="d-flex">OPCIONES <i className="las la-angle-down icon-md p-0 ml-2"></i></span>} id='dropdown-proyectos' >
                        
                        <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => setModal({ ...modal, edit_phase: true })}>
                            {setNaviIcon('las la-clipboard-list icon-xl', 'EDITAR FASE')}
                        </Dropdown.Item>

                        {/* <Dropdown.Item className="text-hover-success dropdown-success" onClick={() => setModal({ ...modal, add_agreement: true })}>
                            {setNaviIcon('las la-pencil-alt icon-xl', 'AGREGAR MINUTA DE ACUERDO')}
                        </Dropdown.Item> */}

                        {/* <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => setModal({ ...modal, hire_phase: true })}>
                            {setNaviIcon('las la-handshake icon-xl', 'CONTRATAR FASES')}
                        </Dropdown.Item> */}

                        <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => setModal({ ...modal, invoice: true })}>
                            {setNaviIcon('las la-handshake icon-xl', 'SOLICITAR FACTURA')}
                        </Dropdown.Item>

                        <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => setModal({ ...modal, sale: true })}>
                            {setNaviIcon('las la-handshake icon-xl', 'VENTA')}
                        </Dropdown.Item>

                        <Dropdown.Item className="text-hover-success dropdown-success" onClick={() => setModal({ ...modal, purchase: true })}>
                            {setNaviIcon('las la-handshake icon-xl', 'COMPRA')}
                        </Dropdown.Item>

                        <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => setModal({ ...modal, budget: true })}>
                            {setNaviIcon('las la-handshake icon-xl', 'PRESUPUESTO')}
                        </Dropdown.Item>
                        
                        <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => setModal({ ...modal, advance: true })}>
                            {setNaviIcon('las la-handshake icon-xl', 'AVANCES')}
                        </Dropdown.Item>

                        <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => setModal({ ...modal, construction_notes: true, })}>
                            {setNaviIcon('las la-handshake icon-xl', 'NOTAS DE OBRA')}
                        </Dropdown.Item>

                        <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => setModal({ ...modal, attachments: true, })}>
                            {setNaviIcon('las la-handshake icon-xl', 'ADJUNTOS')}
                        </Dropdown.Item>

                        <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => setModal({ ...modal, end_proyect: true })}>
                            {setNaviIcon('las la-handshake icon-xl', 'FIN DE PROYECTO')}
                        </Dropdown.Item>

                    </DropdownButton>
                </div>
            </div>
        </div>
    )
}