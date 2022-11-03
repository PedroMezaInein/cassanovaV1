import React, {useState} from 'react';
import { useSelector } from 'react-redux';

import {useEffect} from 'react';

import { apiPostForm, apiGet } from '../../../../functions/api'

import Swal from 'sweetalert2';


export default function EnrollUser({close}) {
    const userAuth = useSelector((state) => state.authUser);
    const [cursos, setCursos] = useState(false);
    const [curso, setCurso] = useState(false);
    const [form, setForm] = useState({
        user_id: userAuth.user.empleado_id,
        id_sala: 0,
    });

    useEffect(() => { 
        getInfoCursos()
    }, []);


    const validateForm = () => {
        return form.id_sala !== 0;
    };

    const resetForm = () => {
        setForm({
            user_id: userAuth.user.empleado_id,
            id_sala: 0,
        });
    };

    const getInfoCursos = () => {
        try {
            apiGet('salas', userAuth.access_token)
                .then((response) => {
                    let aux =[]
                    response.data.Sala.map((sala) => { 
                        if (sala.typo === "curso") {
                            aux.push(sala)
                        }
                    });
                    setCursos(aux)
                    
                })
        }catch (error) {
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                Swal.fire({
                    title: 'Validando disponibilidad',
                    text: 'Espere un momento por favor',
                    icon: 'info',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    onOpen: () => { 
                        apiPostForm('salas/solicita', form, userAuth.access_token)
                            .then((response) => {
                                if (response.data.message === "Curso ya esta reservado con éxito.") {
                                    Swal.fire({
                                        title: 'Curso ya esta reservado',
                                        text: 'El curso ya esta reservado',
                                        icon: 'warning',
                                        timer: 2000
                                    })
                                } else { 
                                    close()
                                    Swal.fire({
                                        title: 'Gracias por postularte ' + userAuth.user.name,
                                        text: 'Tu postulación ha sido enviada y será revisada por el responsable de tu área',
                                        icon: 'success',
                                        confirmButtonText: 'Aceptar'
                                    })
                                    resetForm();
                                }
                            })
                    },
                    


                });

            } catch (error) {
                
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se pudo inscribir al usuario al curso',
            });
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: cursos[e.target.value].id,
        });
        setCurso(cursos[e.target.value])
    };
    console.log(form)

    return (
        <div>
            <form>
                <div className="form-group">
                    <label>Curso</label>
                    <select name="id_sala" className="form-control" id="exampleFormControlSelect1" onChange={handleChange}>
                        <option hidden>Selecciona un curso</option>
                        {cursos ? cursos.map((item, index) => { 
                            return <option key={item.id} value={index}>{item.nombre}</option>
                        } ) : null}
                    </select>
                </div>
                {curso ?
                <>
                <div className="form-group">
                    <label>Fecha</label>
                    <input className="form-control" disabled type="text" name="fecha_inicio" value={curso.fecha} />
                </div>
                <div className="form-group">
                    <label>Hora</label>
                    <input className="form-control" disabled type="text" name="hora_inicio" value={curso.hora} />
                </div>
                <div className="form-group">
                    <label>Duracion</label>
                    <input className="form-control" disabled type="text" name="duracion" value={curso.duracion + " Hora(s)"} />
                </div>
                <div className="form-group">
                    <label>Descripción del curso</label>
                    <input className="form-control" disabled type="text" name="descripcion" value={curso.asunto} />
                </div>
                </>
                : null}
            </form>
            
            <button className="btn btn-primary" onClick={handleSubmit}>Inscribirme</button>
        </div>
    )
}