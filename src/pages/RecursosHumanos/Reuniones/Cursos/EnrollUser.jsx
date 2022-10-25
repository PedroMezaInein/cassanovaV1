import React, {useState} from 'react';
import { useSelector } from 'react-redux';

import {useEffect} from 'react';

import { apiPostForm, apiGet } from '../../../../functions/api'

import Swal from 'sweetalert2';


export default function EnrollUser({close}) {
    const userAuth = useSelector((state) => state.authUser);
    const [cursos, setCursos] = useState(false);
    const [form, setForm] = useState({
        user_id: userAuth.user.empleado_id,
        curso_id: 0,
    });

    useEffect(() => { 
        getInfoCursos()
    }, []);


    const validateForm = () => {
        return form.curso_id.length > 0;
    };

    const resetForm = () => {
        setForm({
            user_id: userAuth.user.empleado_id,
            curso_id: 0,
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
                apiPostForm('salas/solicita', form, userAuth.access_token)
                .then((response) => {
                    close()
                    Swal.fire({
                        title: 'Felicidades!',
                        text: 'Tu postulación ha sido enviada',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    })
                    resetForm();
                })
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
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div>
            <form>
                <div>
                    <label>Solicitante</label>
                    <input disabled type="text" name="name" value={userAuth.user.name } />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleFormControlSelect1">Nombre del curso</label>
                    <select name="curso_id" className="form-control" id="exampleFormControlSelect1" onChange={handleChange}>
                        <option hidden>Selecciona un curso</option>
                        {cursos ? cursos.map((item) => { 
                            return <option key={item.id} value={item.id} >{item.nombre}</option>
                        } ) : null}
                    </select>
                </div>
            </form>
            <button className="btn btn-primary" onClick={handleSubmit}>Inscribirme</button>
        </div>
    )
}