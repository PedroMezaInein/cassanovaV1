import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import { apiPostForm } from '../../../../functions/api';
import Swal from 'sweetalert2'
import '../../../../styles/_salaJuntas.scss'

export default function CreateSalaJuntas() {
    const userAuth = useSelector((state) => state.authUser);
    const [errores, setErrores] = useState({})
    const [form, setForm] = useState({
        user_id: userAuth.user.empleado_id,
        fecha: '',
        hora: '',
        sala: '',
        asunto: '',
        duracion: '',
    });

    let horas = [
        { id: 1, hora: '09:00' },
        { id: 2, hora: '09:30' },
        { id: 3, hora: '10:00' },
        { id: 4, hora: '10:30' },
        { id: 5, hora: '11:00' },
        { id: 6, hora: '11:30' },
        { id: 7, hora: '12:00' },
        { id: 8, hora: '12:30' },
        { id: 9, hora: '13:00' },
        { id: 10, hora: '13:30' },
        { id: 11, hora: '14:00' },
        { id: 12, hora: '14:30' },
        { id: 13, hora: '15:00' },
        { id: 14, hora: '15:30' },
        { id: 15, hora: '16:00' },
        { id: 16, hora: '16:30' },
        { id: 17, hora: '17:00' },
        { id: 18, hora: '17:30' },
    ]

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        let confirmacion = false
        e.preventDefault()

        if(validateForm()){
            Swal.fire({
            title: '¿Deseas reservar la sala?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, reservar!'
            }).then(result => {
                console.log(result)
                if (result.isConfirmed) {
                    confirmacion = true
                }
                if(confirmacion){
                    try {
                        apiPostForm('sala-juntas', form, userAuth.acces_token)
                        .then((response) => { 
                            console.log(response)
                            Swal.fire({
                                title: 'Sala reservada',
                                text: 'La sala se ha reservado correctamente',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 2000,
                            })
                            resetForm()
                        }).catch((error) => {
                            Swal.fire({
                            title: 'Error',
                            text: 'Ha ocurrido un error al reservar la sala',
                            icon: 'error',
                            showConfirmButton: false,
                            timer: 2000,
                            })
                        })
                        
                    } catch (error) {
                        Swal.fire({
                            title: 'Error',
                            text: 'Ha ocurrido un error al reservar la sala',
                            icon: 'error',
                            showConfirmButton: false,
                            timer: 2000,
                        })
                    }     
                }
            })
        } else {
            Swal.fire({
                title: 'Verifica el formulario',
                text: 'Por favor, rellena todos los campos',
                icon: 'warning',
                showConfirmButton: false,
                timer: 2000,
            })
        }
    };

    const validateForm = () => {
        let validacionError = true;
        let errors = {};
        if (form.fecha === '') {
            errors.fecha = 'La fecha es requerida';
            validacionError = false;
        }
        if (form.hora === '') {
            errors.hora = 'La hora es requerida';
            validacionError = false;
        }
        if (form.sala === '') {
            errors.sala = 'La sala es requerida';
            validacionError = false;
        }
        if (form.asunto === '') {
            errors.asunto = 'El asunto es requerido';
            validacionError = false;
        }
        if (form.duracion === '') {
            errors.duracion = 'La duración es requerida';
            validacionError = false;
        }
        setErrores(errors);
        return validacionError;
    };

    const resetForm = () => {
        setForm({
            user_id: userAuth.user.empleado_id,
            fecha: '',
            hora: '',
            sala: '',
            asunto: '',
            duracion: '',
        });
        setErrores({})
    };
    
    return (
        <>
            <div className='modal-juntas'>
                <div className="solicitante">
                    <label>Solicitante</label>
                    <input disabled type="text" value={userAuth.user.name} />  
                </div>
                <form>
                    
                    <div className={`${errores.fecha ? "error":"validate"}`}>
                        <label>Fecha</label>
                        <input name="fecha" type="date" value={form.fecha} onChange={(e) => handleChange(e)} />
                    </div>

                    <div className={`${errores.hora ? "error":"validate"}`}>
                        <label>Hora</label>
                        <select name="hora" value={form.hora} onChange={(e) => handleChange(e)}>
                            <option hidden>Seleccione una hora</option>
                            {horas.map((hora) => (
                                <option key={hora.id} value={hora.hora}>{hora.hora}</option>
                            ))}
                        </select>
                    </div>

                    <div className={`${errores.duracion ? "error":"validate"}`}>
                        <label>Duración</label>
                        <select name="duracion" value={form.duracion} onChange={(e) => handleChange(e)}>
                            <option hidden>Seleccione la duracion</option>
                            <option value="1">30 minutos</option>
                            <option value="2">1 hora</option>
                            <option value="3">2 horas</option>
                        </select>
                    </div>

                    <div className={`${errores.sala ? "error":"validate"}`}>
                        <label>Sala</label>
                        <select name="sala" value={form.sala} onChange={(e) => handleChange(e)}>
                            <option hidden>Seleccione una sala</option>
                            <option value="1">Sala 1</option>
                            <option value="2">Sala 2</option>
                            <option value="3">Sala 3</option>
                        </select>
                    </div>

                </form>

                <div className={`asunto ${errores.asunto ? "error":"validate"}`}>
                    <label>Asunto</label>
                    <input type='text' name="asunto" value={form.asunto} onChange={(e) => setForm({ ...form, asunto: e.target.value })} />
                </div>

                <div className="btn-reservar-sala">
                    <button type="submit" onClick={(e) => handleSubmit(e)}>Reservar sala</button>
                </div>

            </div>
        </>
    )
}