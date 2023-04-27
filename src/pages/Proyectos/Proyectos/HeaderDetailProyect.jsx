import React from 'react';
import { Card, DropdownButton, Dropdown } from 'react-bootstrap'

import { setFase, setLabelTable, ordenamiento, setOptions, setNaviIcon } from '../../../functions/setters'

export default function HeaderDetailProyect(props) {
    const { proyecto, fases, modal, setModal } = props;
    console.log(proyecto)
    return (
        <>
            <div className="HeaderTitle mt-n4 mb-n3">
                <h3>
                    {proyecto.simpleName}
                </h3>
                {/* <div>
                        <span >Estado del proyecto: <span className="badge badge-pill" style={{ backgroundColor: proyecto.estatus.fondo, color: proyecto.estatus.letra }}>
                            {proyecto.estatus.estatus}
                        </span></span>
                    </div> */}
                {fases &&
                    <div className="card-toolbar">
                        <div className="card-toolbar toolbar-dropdown">
                            <DropdownButton menualign="right"
                                title={<span className="d-flex">OPCIONES <i className="las la-angle-down icon-md p-0 ml-2"></i></span>} id='dropdown-proyectos' >
                                <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => setModal({ ...modal, info: true })}>
                                    {setNaviIcon('las la-clipboard-list icon-xl', 'INFORMACIÓN')}
                                </Dropdown.Item>
                                {/* <Dropdown.Item className="text-hover-success dropdown-success" onClick={() => setModal({ ...modal, edit_proyect: true })}>
                                        {setNaviIcon('las la-pencil-alt icon-xl', 'EDITAR PROYECTO')}
                                    </Dropdown.Item> */
                                }
                                <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => setModal({ ...modal, hire_phase: true })}>
                                    {setNaviIcon('las la-handshake icon-xl', 'CONTRATAR FASES')}
                                </Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </div>
                }

            </div>
            <hr />
            <div className="row HeaderContainer">

                <div className="col-2">
                    <div className="col-12">
                        <span className="TagTitle">
                            Contacto
                        </span>
                        <span className="mt-2 alignContent">
                            {proyecto.contacto}
                        </span>
                        {/* <span>
                            <i className="fas fa-phone mr-2"></i>
                            {proyecto.numero_contacto}
                        </span> */}
                    </div>
                </div>

                <div className="col-2">
                    <div>
                        <span className="TagTitle">
                            Empresa
                        </span>
                        <span className="mt-2 alignContent">
                            {proyecto.empresa.name}
                        </span>
                    </div>
                </div>

                {/* <div className="col-2">
                    <div>
                        <span className="TagTitle">
                            Área
                        </span>
                        <span className="text-lowercase mt-2 alignContent">
                                {proyecto.m2}&nbsp; m²
                        </span>
                    </div>
                </div>  */}

                <div className="col-2">
                    <div>
                        <span className="TagTitle">
                            Tipo de Proyecto
                        </span>
                        <span className="mt-2 alignContent">
                            {proyecto.tipo_proyecto.tipo}
                        </span>
                    </div>
                </div>

                <div className="col-3">
                    <div>
                        <span className="TagTitle">
                            dirección
                        </span>
                        <span className="mt-2 alignContent">
                            {proyecto.sucursal ? proyecto.sucursal.direccion : 'Sin dirección'}
                        </span>
                    </div>
                </div>

                <div className="col-3">
                    <div>
                        <span className="TagTitle">
                            Cliente
                        </span>
                        <span className="mt-2 alignContent">
                            {proyecto.clientes.map((cliente, index) => (
                                <span key={index}>
                                    {cliente.empresa}
                                </span>
                            ))}
                        </span>
                    </div>
                </div>

            </div>
        </>
    )
}

