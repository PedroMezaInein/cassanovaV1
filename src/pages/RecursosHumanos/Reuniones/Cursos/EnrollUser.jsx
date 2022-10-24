import React, {useState} from 'react';
import { useSelector } from 'react-redux';

import {useEffect} from 'react';

import { apiGet } from '../../../../functions/api'

import Swal from 'sweetalert2';


export default function EnrollUser() {
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
        console.log(form)
        console.log(validateForm())
        
        if (validateForm()) {
            try {
                Swal.fire({
                    title: 'Felicidades!',
                    text: 'Te has inscrito al curso correctamente',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                });
            } catch (error) {
                
            }
            resetForm();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se pudo inscribir al usuario al curso',
            });
        }
    };


    console.log(cursos)

    return (
        <div>
            <form>
                <div>
                    <label>Solicitante</label>
                    <input disabled type="text" name="name" value={userAuth.user.name } />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleFormControlSelect1">Nombre del curso</label>
                    <select className="form-control" id="exampleFormControlSelect1">
                        <option hidden>Selecciona un curso</option>
                        {cursos ? cursos.map((curso) => { 
                            return <option value={curso.id}>{curso.name}</option>
                        } ) : null}
                    </select>
                </div>
            </form>
            <button className="btn btn-primary" onClick={handleSubmit}>Inscribirme</button>
        </div>
    )
}