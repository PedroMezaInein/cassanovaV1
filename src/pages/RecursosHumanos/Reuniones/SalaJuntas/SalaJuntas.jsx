import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";

import NewTableServerRender from '../../../../components/tables/NewTableServerRender'
import CreateSalaJuntas from "../SalaJuntas/CreateSalaJuntas"
import{waitAlert} from '../../../../functions/alert';

import AplicantesCurso from './../Cursos/AplicantesCurso'

import { apiGet, apiDelete } from '../../../../functions/api'

import Modal from 'react-bootstrap/Modal'
import Swal from 'sweetalert2';

import '../../../../styles/_salaJuntas.scss'

export default function SalaJuntas() {
    const userAuth = useSelector((state) => state.authUser);
    const [reservas, setReservas] = useState([])
    const [newReserva, setNewReserva] = useState(false)
    const [oldReserva, setOldReserva] = useState(false)
    const [aplicantes, setAplicantes] = useState(false)
    const [viewReserva, setViewReserva] = useState({
        show: true,
    })
    const [modal, setModal] = useState({
        create: false,
        edith: false,
        aplicantes: false,
        edithInfo: false,
        menu: false,
    });
    const [show, setShow] = useState({
        show: false,
    });
        

    useEffect(() => {
        getInfoSalas()
    }, [])

    const getAplicantes = (id) => {
        try {
            apiGet(`salas/user/${id}`, userAuth.access_token)
                .then((response) => { 
                    setAplicantes(response.data)
                })
        } catch (error) {
            
        }
     }

    const handleCloseCreate = () => {
        setModal({ ...modal, create: false })
    }; 

    const handleShowCreate = () => setModal({ ...modal, create: true });

    const handleCloseEdith = () => {
        setModal({ ...modal, edith: false })
    };
    
    const handleShowAplicant = (id) => {
        setModal({ ...modal, aplicantes: true })
        getAplicantes(id)
    };

    const handleCloseAplicant = () => {
        setModal({ ...modal, aplicantes: false })
    };

    const handleShowEdith = (reserva) => {
        setModal({
            ...modal,
            edithInfo: reserva,
            edith: true
        })
    }

    const getInfoSalas = () => {
        try {
            waitAlert()
            apiGet('salas', userAuth.access_token)
                .then((response) => {
                    oldReservas(response.data.Sala)
                })
        }catch (error) {
        }
    }

    const menuShow = (e) => {
        if (show.menu) {
            setShow({
                show: false,
            })
        }
        else {
            setShow({
                show: true,
            })
        }
    }

    const oldReservas = (data) => { 
        let separator='-'
        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        let fechaHoy = `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`
        let reservasOld = []
        let reservasNew = []
        data.map((reserva) => {
            let date1 = new Date(reserva.fecha)
            let date2 = new Date(fechaHoy)
            console.log(date1, date2)
            if ((date1.getTime() < date2.getTime()) && (date1.getTime() !== date2.getTime())) {
                reservasOld.push(reserva)
            } else {
                reservasNew.push(reserva)
            }
        })
        setNewReserva(reservasNew)
        setReservas(reservasNew)
        setOldReserva(reservasOld)
        setViewReserva({
            show: true,
        })
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estas seguro de eliminar esta reserva?',
            text: "No podras revertir esta accion!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    apiDelete(`salas/${id}`, userAuth.access_token)
                    .then((response) => {
                        getInfoSalas()
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Algo salio mal!',
                            timer: 2000,
                        })
                    })
                    
                } catch (error) {
                    
                }
            }
        })
    }

    const viewReservas = () => {
        if(viewReserva.show){
            setViewReserva({
                show: false,
            })
            setReservas(oldReserva)
        } else {
            setViewReserva({
                show: true,
            })
            setReservas(newReserva)
        }
    }

    return (
        <>
            
            <div className='container-juntas'>
                <h1>Sala de Juntas</h1>
                <div className='opciones'>
                    <button className='btn-reservar' onClick={handleShowCreate}><span>+</span>Reservar</button>
                    <button className='btn-historial' onClick={viewReservas}>{viewReserva.show ? 'Ver reservas antiguas' : 'Ver reservas nuevas'}</button>
                </div>
                
                    <div>
                    {reservas[0] ? <div className="subtitle">{`${viewReserva.show ? "PrÓximas Reservaciones": "Reservaciones antiguas"}` }</div>:null}
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
                                    <th>Solicitante</th>
                                </tr>
                            </thead>
                            <br />
                            <tbody>
                            {reservas.map((reserva) => (
                                <tr className='table-reservas' key={reserva.id}>
                                    
                                    <td className="align">
                                        <div className="btn-group">
                                            <button className="btn-acciones dropdown-toggle align" onClick={e => menuShow(reserva.id)} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                            <div className={`dropdown-menu`}>
                                                <a className='dropdown-item' onClick={e => handleShowEdith(reserva)} >Editar</a>
                                                <a className='dropdown-item' onClick={e => handleDelete(reserva.id)}>Eliminar</a>
                                                {reserva.typo === "curso" ? 
                                                    <a className='dropdown-item' onClick={() => handleShowAplicant(reserva.id) }>Asistentes</a> 
                                                :null    
                                                }
                                            </div>   
                                        </div>
                                    </td>
                                    <td>{reserva.fecha}</td>
                                    <td>{reserva.typo}</td>
                                    <td>{reserva.hora}</td>
                                    <td>{reserva.sala}</td>
                                    <td>{reserva.asunto}</td>
                                    <td>{ reserva.duracion === "0.5"? "30 minutos": `${reserva.duracion} horas`}</td>
                                    <td>{reserva.usersalas.name}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : <div>Sin Salas reservadas</div>
                    }
                </div>
                
                </div>
            <Modal size="sm"  show={modal.create} onHide={handleCloseCreate} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title className='title'>Reservar sala</Modal.Title>
                    <div className="close-modal" onClick={handleCloseCreate}>X</div>
                </Modal.Header>
                <Modal.Body>
                    <CreateSalaJuntas admin={true} getInfo={getInfoSalas} closeModal={handleCloseCreate} rh={true} />
                </Modal.Body>
            </Modal>

            <Modal size="sm" show={modal.edith} onHide={handleCloseEdith} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title className='title'>Editar reserva</Modal.Title>
                    <div className="close-modal" onClick={handleCloseEdith}>X</div>
                </Modal.Header>
                <Modal.Body>
                    <CreateSalaJuntas reservaEdith={modal.edithInfo} admin={true} getInfo={getInfoSalas} closeModal={handleCloseCreate} edith={ true} />
                </Modal.Body>
            </Modal>

            <Modal size="lg" show={modal.aplicantes} onHide={handleCloseAplicant} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Aplicantes</Modal.Title>
                    <div className="close-modal" onClick={handleCloseAplicant}>X</div>
                </Modal.Header>
                <Modal.Body>
                    <AplicantesCurso rh={true} closeModal={handleCloseAplicant} aplicantes={aplicantes} />
                </Modal.Body>
            </Modal>

        </>
    );
}