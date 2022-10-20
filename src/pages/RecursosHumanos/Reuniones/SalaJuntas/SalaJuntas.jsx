import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";

import Layout from '../../../../components/layout/layout'
import CreateSalaJuntas from "../SalaJuntas/CreateSalaJuntas"

import Modal from 'react-bootstrap/Modal'

import '../../../../styles/_salaJuntas.scss'

export default function SalaJuntas() {
    const userAuth = useSelector((state) => state.authUser);


    const [modal, setModal] = useState({
        create: false,
        edith: false,
    });
        
    const handleCloseCreate = () => {
        setModal({ ...modal, create: false })
    };
    const handleShowCreate = () => setModal({ ...modal, create: true });

    const handleCloseEdith = () => {
        setModal({ ...modal, edith: false })
    };
    const handleShowEdith = () => setModal({ ...modal, edith: true });

    return (
        <>
            
            <div className='container-juntas'>
                    <h1>Sala de Juntas</h1>
                    <button className='btn-reservar' onClick={handleShowCreate}><span>+</span>Reservar</button>
                    {/* <button className='btn btn-primary' onClick={handleShowEdith}>Editar</button> */}
                    <div>
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Sala</th>
                                    <th>Asunto</th>
                                    <th>Duración</th>
                                    <th>Solicitante</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2021-05-05</td>
                                    <td>10:00</td>
                                    <td>1</td>
                                    <td>Reunión</td>
                                    <td>1 hora</td>
                                    <td>Claudio Herrera</td>
                                    <td>
                                        <button className='btn btn-primary' onClick={handleShowEdith}>Editar</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>2021-05-05</td>
                                    <td>10:00</td>
                                    <td>1</td>
                                    <td>Reunión</td>
                                    <td>1 hora</td>
                                    <td>Claudio Herrera</td>
                                    <td>
                                        <button className='btn btn-primary' onClick={handleShowEdith}>Editar</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>2021-05-05</td>
                                    <td>10:00</td>
                                    <td>1</td>
                                    <td>Reunión</td>
                                    <td>1 hora</td>
                                    <td>Claudio Herrera</td>
                                    <td>
                                        <button className='btn btn-primary' onClick={handleShowEdith}>Editar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            <Modal size="lg"  show={modal.create} onHide={handleCloseCreate} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Reservar sala</Modal.Title>
                    <div className="close-modal" onClick={handleCloseCreate}>X</div>
                </Modal.Header>
                <Modal.Body>
                    <CreateSalaJuntas />
                </Modal.Body>
            </Modal>

            <Modal size="sd" show={modal.edith} onHide={handleCloseEdith} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar reserva</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='modal-juntas'>

                    </div>
                </Modal.Body>
            </Modal>

        </>
    );
}