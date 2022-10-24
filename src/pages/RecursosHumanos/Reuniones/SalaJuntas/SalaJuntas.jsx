import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";

import NewTableServerRender from '../../../../components/tables/NewTableServerRender'
import CreateSalaJuntas from "../SalaJuntas/CreateSalaJuntas"

import AplicantesCurso from './../Cursos/AplicantesCurso'

import { apiGet } from '../../../../functions/api'

import Modal from 'react-bootstrap/Modal'

import '../../../../styles/_salaJuntas.scss'

export default function SalaJuntas() {
    const userAuth = useSelector((state) => state.authUser);
    const [reservas, setReservas] = useState([])
    const [modal, setModal] = useState({
        create: false,
        edith: false,
    });
        

    useEffect(() => {
        getInfoSalas()
    }, [])

    const handleCloseCreate = () => {
        setModal({ ...modal, create: false })
    }; 

    const handleShowCreate = () => setModal({ ...modal, create: true });

    const handleCloseEdith = () => {
        setModal({ ...modal, edith: false })
    };

    const handleShowEdith = () => setModal({ ...modal, edith: true });

    const getInfoSalas = () => {
        try {
            apiGet('salas', userAuth.access_token)
                .then((response) => {
                    setReservas(response.data.Sala)
                })
        }catch (error) {
        }
    }



    return (
        <>
            
            <div className='container-juntas'>
                    <h1>Sala de Juntas</h1>
                    <button className='btn-reservar' onClick={handleShowCreate}><span>+</span>Reservar</button>
                    {/* <button className='btn btn-primary' onClick={handleShowEdith}>Editar</button> */}
                    <div>
                    {reservas[0] ? (
                            <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>Acciones</th>
                                    <th>Fecha</th>
                                    <th>Tipo</th>
                                    <th>Hora</th>
                                    <th>Sala</th>
                                    <th>Asunto</th>
                                    <th>Duración</th>
                                    {/* <th>Solicitante</th> */}
                                    
                                </tr>
                            </thead>
                            <tbody>
                            {reservas.map((reserva) => (
                                <tr key={reserva.id}>
                                    <td>
                                        <button className='btn btn-primary' onClick={handleShowEdith}>Editar</button>
                                    </td>
                                    <td>{reserva.fecha}</td>
                                    <td>{reserva.typo}</td>
                                    <td>{reserva.hora}</td>
                                    <td>{reserva.sala}</td>
                                    <td>{reserva.asunto}</td>
                                    <td>{ reserva.duracion === "0.5"? "30 minutos": `${reserva.duracion} horas`}</td>
                                    {/* <td>{reserva.id_usuario}</td> */}
                                    
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : <div>Sin Salas reservadas</div>
                    }
                    </div>
                </div>
            <Modal size="lg"  show={modal.create} onHide={handleCloseCreate} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Reservar sala</Modal.Title>
                    <div className="close-modal" onClick={handleCloseCreate}>X</div>
                </Modal.Header>
                <Modal.Body>
                    <CreateSalaJuntas admin={true} getInfo={getInfoSalas} closeModal={handleCloseCreate} />
                </Modal.Body>
            </Modal>

            <Modal size="lg" show={modal.edith} onHide={handleCloseEdith} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar reserva</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AplicantesCurso />
                </Modal.Body>
            </Modal>

        </>
    );
}