import React, {useState}  from 'react';


import Layout from '../../../../components/layout/layout'
import CreateCurso from "./CreateCurso"
import AplicantesCurso from "./AplicantesCurso"


import Modal from 'react-bootstrap/Modal'

import './../../../../styles/_cursos.scss'

export default function Cursos() {
    const [modal, setModal] = useState({
        create: false,
        edith: false,
        applicants: false
    });

    const handleCloseCreate = () => {
        setModal({ ...modal, create: false })
    };

    const handleCloseApplicants = () => {
        setModal({ ...modal, applicants: false })
    };

    const handleShowApplicants = () => {
        setModal({ ...modal, applicants: true })
    };

    const handleShowCreate = () => setModal({ ...modal, create: true });

    return (
        <div>
<div className='container-cursos'>

                    <h1>Cursos</h1>
                    <button className='modal-crear' onClick={handleShowCreate}>Crear curso</button>

                    <div>
                        
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Duracion</th>
                                    <th>Lugar</th>
                                    <th>Responsable</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Curso 1</td>
                                    <td>Curso de prueba</td>
                                    <td>2021-05-05</td>
                                    <td>10:30 am</td>
                                    <td>7 horas</td>
                                    <td>Sala de juntas 2</td>
                                    <td>Karin Flores</td>
                                    <td>
                                        <button className='curso__aplicantes' onClick={handleShowApplicants}>Aplicantes</button>
                                        <button className='curso__editar'>Editar</button>
                                        <button className='curso__eliminar'>Eliminar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        </div>
                    </div>
            <Modal size="md"  show={modal.create} onHide={handleCloseCreate} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear curso</Modal.Title>
                    <div className='close-modal' onClick={handleCloseCreate}>X</div>
                </Modal.Header>
                <Modal.Body>
                    <CreateCurso />
                </Modal.Body>
            </Modal>

            <Modal size="lg"  show={modal.applicants} onHide={handleCloseApplicants} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear curso</Modal.Title>
                    <div className='close-modal' onClick={handleCloseApplicants}>X</div>
                </Modal.Header>
                <Modal.Body>
                    <AplicantesCurso />
                </Modal.Body>
            </Modal>

        </div>
    )
}