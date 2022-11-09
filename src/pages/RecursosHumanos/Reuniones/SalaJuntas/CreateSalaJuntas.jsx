import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import { apiPostForm, apiGet, apiPutForm } from '../../../../functions/api';
import Swal from 'sweetalert2'
import '../../../../styles/_salaJuntas.scss'

export default function CreateSalaJuntas({ admin, getInfo, closeModal, reservaEdith=false , rh}) {
    const userAuth = useSelector((state) => state.authUser);
    const [errores, setErrores] = useState({})
    const [reservas, setReservas] = useState({})
    const [ rangoHora, setRangoHora ] = useState()
    const [form, setForm] = useState({
        user_id: userAuth.user.empleado_id,
        fecha: '',
        hora: '',
        sala: '',
        asunto: '',
        duracion: '',
        tipo: 'reunion',
        nombre: '',
        id: '',
    });

    const horas = [
        { id: 1, hora: '09:00', disabled: false },
            { id: 2, hora: '09:30', disabled: false },
            { id: 3, hora: '10:00', disabled: false },
            { id: 4, hora: '10:30', disabled: false },
            { id: 5, hora: '11:00', disabled: false },
            { id: 6, hora: '11:30', disabled: false },
            { id: 7, hora: '12:00', disabled: false },
            { id: 8, hora: '12:30', disabled: false },
            { id: 9, hora: '13:00', disabled: false },
            { id: 10, hora: '13:30', disabled: false },
            { id: 11, hora: '14:00', disabled: false },
            { id: 12, hora: '14:30', disabled: false },
            { id: 13, hora: '15:00', disabled: false },
            { id: 14, hora: '15:30', disabled: false },
            { id: 15, hora: '16:00', disabled: false },
            { id: 16, hora: '16:30', disabled: false },
            { id: 17, hora: '17:00', disabled: false },
        { id: 18, hora: '17:30', disabled: false },
    ]

    const [horasDisponibles, setHorasDisponibles] = useState(
       [{ id: 1, hora: '09:00', disabled: false },
        { id: 2, hora: '09:30', disabled: false },
        { id: 3, hora: '10:00', disabled: false },
        { id: 4, hora: '10:30', disabled: false },
        { id: 5, hora: '11:00', disabled: false },
        { id: 6, hora: '11:30', disabled: false },
        { id: 7, hora: '12:00', disabled: false },
        { id: 8, hora: '12:30', disabled: false },
        { id: 9, hora: '13:00', disabled: false },
        { id: 10, hora: '13:30', disabled: false },
        { id: 11, hora: '14:00', disabled: false },
        { id: 12, hora: '14:30', disabled: false },
        { id: 13, hora: '15:00', disabled: false },
        { id: 14, hora: '15:30', disabled: false },
        { id: 15, hora: '16:00', disabled: false },
        { id: 16, hora: '16:30', disabled: false },
        { id: 17, hora: '17:00', disabled: false },
        { id: 18, hora: '17:30', disabled: false }, ]
    )


    useEffect(() => {

        getInfoSalas()
        if (reservaEdith) {
            console.log(reservaEdith)
            setForm({
                user_id: userAuth.user.empleado_id,
                fecha: reservaEdith.fecha,
                hora: reservaEdith.hora.slice(0, 5),
                sala: reservaEdith.sala,
                asunto: reservaEdith.asunto,
                duracion: reservaEdith.duracion,
                tipo: reservaEdith.typo,
                nombre: reservaEdith.nombre,
                id: reservaEdith.id,
            })
        }

    }, [])

    useEffect(() => {
        if (form.duracion !== '' && form.hora !== '') {
            rangoHoras()
        }
    }, [form.hora, form.duracion])

    useEffect(() => { 
        horarioDisponible()
    }, [form.fecha, form.sala])

    const rangoHoras = () => {
        let rango_horas =[]
        if (form.hora !== '' && form.duracion !== '') {
            let hora_inicio = form.hora.slice(0, 5)
            let duracion = form.duracion
            
            switch (duracion) {
            case "0.5":
                horasDisponibles.map((hora) => {
                    if (hora.hora === hora_inicio) {
                        rango_horas.push(hora)
                    }
                })
                break;
            case "1":
                    horasDisponibles.map((item, index) => {
                    if (item.hora === hora_inicio) {
                        rango_horas.push(item)
                        rango_horas.push(horasDisponibles[index + 1])
                    }
                })
                break;
            case "2":
                    horasDisponibles.map((item, index) => {
                    if (item.hora === hora_inicio) {
                        rango_horas.push(item)
                        rango_horas.push(horasDisponibles[index + 1])
                        rango_horas.push(horasDisponibles[index + 2])
                        rango_horas.push(horasDisponibles[index + 3])
                    }
                })  
                break;
            default:

                break;
        }

        
        }
        setRangoHora({
            rango_horas
        })
    }

    const getInfoSalas = () => {
        try {
            apiGet('salas', userAuth.access_token)
                .then((response) => {
                    let reservas = []
                    response.data.Sala.map((reserva) => {
                        let hora_inicio = reserva.hora.slice(0, 5)
                        let duracion = reserva.duracion
                        let rango_horas =[]
                        switch (duracion) {
                            case "0.5":
                                horasDisponibles.map((hora) => {
                                    if (hora.hora === hora_inicio) {
                                        rango_horas.push(hora)
                                    }
                                })
                                break;
                            case "1":
                                horasDisponibles.map((item, index) => {
                                    if (item.hora === hora_inicio) {
                                        rango_horas.push(item)
                                        rango_horas.push(horasDisponibles[index + 1])
                                    }
                                })
                                break;
                            case "2":
                                horasDisponibles.map((item, index) => {
                                    if (item.hora === hora_inicio) {
                                        rango_horas.push(item)
                                        rango_horas.push(horasDisponibles[index + 1])
                                        rango_horas.push(horasDisponibles[index + 2])
                                        rango_horas.push(horasDisponibles[index + 3])
                                    }
                                })  
                                break;
                            default:

                                break;
                        }
                        reserva.rango_horas = rango_horas

                        reservas.push(reserva)
                    })
                    setReservas(reservas)
                })
            
        }catch (error) {
            
        }
    }

    const validateReserva = () => {
        let error = false

        reservas.map((reserva) => { 
            if(reserva.fecha === form.fecha && reserva.sala === form.sala) {
                reserva.rango_horas.map((hora) => {
                    rangoHora.rango_horas.map((hora2) => { 
                        if(hora.hora === hora2.hora && form.id !== reserva.id) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: `La ${reserva.sala} ya esta reservada para esa hora ${reserva.rango_horas[0].hora} - ${reserva.rango_horas[reserva.rango_horas.length - 1].hora}`,
                            })
                            error = true
                        }
                    })
                })
            }
            
        })

        return error

    }
    //salas/solicita
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    };

    async function handleSubmit (e) {
        let confirmacion = false
        e.preventDefault()

        if (validateForm()) {
            if (!validateReserva()) {
                Swal.fire({
                    title: reservaEdith? '¿Editar la reserva?': '¿Estas seguro de realizar la reserva?',
                    text: reservaEdith? 'Se editara la reserva': 'Se realizara la reserva',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: reservaEdith? 'Editar': 'Reservar'
                    }).then(result => {
                        console.log(result)
                        if (result.isConfirmed) {
                            confirmacion = true
                        }
                        if(confirmacion){
                            try {
                                reservaEdith ?
                                apiPutForm(`salas/${reservaEdith.id}`, form, userAuth.access_token)
                                    .then((response) => {
                                    closeModal()
                                    console.log(response)
                                    Swal.fire({
                                        title: 'Reserva Modificada',
                                        text: 'La reserva se ha editado correctamente',
                                        icon: 'success',
                                        showConfirmButton: false,
                                        timer: 2000,
                                    })
                                    getInfoSalas()
                                    getInfo()
                                }).catch((error) => {
                                    Swal.fire({
                                    title: 'Error',
                                    text: 'Ha ocurrido un error al editar la reserva',
                                    icon: 'error',
                                    showConfirmButton: false,
                                    timer: 2000,
                                    })
                                })
                                :
                                apiPostForm('salas', form, userAuth.access_token)
                                    .then((response) => {
                                    closeModal()
                                    console.log(response)
                                    Swal.fire({
                                        title: 'Sala reservada',
                                        text: 'La sala se ha reservado correctamente',
                                        icon: 'success',
                                        showConfirmButton: false,
                                        timer: 2000,
                                    })
                                    resetForm()
                                    getInfoSalas()
                                    if (rh) {
                                        getInfo()
                                    }
                                }).catch((error) => {
                                    console.log(error)
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

            }
            
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
        if (form.tipo === '') {
            errors.tipo = 'El tipo es requerido';
            validacionError = false;
        }
        if (form.tipo === "curso") {
            if (form.nombre === '') {
                errors.nombre = 'El tipo es requerido';
                validacionError = false;
            }
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
            tipo: '',
            nombre: '',
        });
        setErrores({})
    };

    const horarioDisponible = async () => { 
        let aux = []
        let disabledHora = horas
        if (form.fecha !== '' && form.sala !=='') {
            reservas.map((reserva) => { 
                if (reserva.fecha === form.fecha && reserva.sala === form.sala) {
                    aux.push(...reserva.rango_horas)
                }
            })
            if (aux.length > 0) {
                aux.map((hora) => { 
                    disabledHora[hora.id-1].disabled = true
                })
            }
            await setHorasDisponibles(disabledHora)
        }
        
    }
    
    return (
        <>
            <div className='modal-juntas'>
                <form>
                    {admin ?
                        <div className={`${errores.tipo ? "error":"validate"} `}>
                            <label>Tipo de reunion</label>
                            <select name="tipo" onChange={handleChange} value={form.tipo}>
                                <option value="" hidden>Seleccione el tipo</option>
                                <option value="reunion">Reunion</option>
                                <option value="curso">Curso</option>
                            </select>
                        </div>
                        :
                        null
                    }
                    
                    <div className={`${errores.fecha ? "error":"validate"}`}>
                        <label>Fecha</label>
                        <input name="fecha" type="date" value={form.fecha} onChange={(e) => handleChange(e)} />
                    </div>

                    <div className={`${errores.sala ? "error" : "validate"}`}>
                        <label>Sala</label>
                        <select name="sala" value={form.sala} onChange={(e) => handleChange(e)}>
                            <option hidden>Seleccione una sala</option>
                            <option value="Sala 1">Sala 1</option>
                            <option value="Sala 2">Sala 2</option>
                            <option value="Sala 3">Sala 3</option>
                        </select>
                        {/* {form.sala === "Sala 1" ? <span>Grupos de 4 o mas</span> : null}
                        {form.sala === "Sala 2" ? <span>Grupos de 2 o mas</span> : null}
                        {form.sala === "Sala 3" ? <span>Grupos de 1 o mas</span> : null} */}

                    </div>

                    {
                        <div className={`${errores.hora? "error" : "validate"}`}>
                            <label>Hora</label>
                            <select name="hora" value={form.hora} onChange={(e) => handleChange(e)} disabled={form.fecha !== '' && form.sala !== '' ? null : true}>
                                <option hidden>Seleccione una hora</option>
                                {horasDisponibles.map((hora) => {
                                    return (
                                        <option key={hora.id} value={hora.hora} disabled={hora.disabled ? true : null} className={hora.disabled ? 'error' : null}>{hora.hora}</option>
                                    )
                                }
                                )}
                            </select>
                        </div>
                    }

                    <div className={`${errores.duracion ? "error":"validate"}`}>
                        <label>Duración</label>
                        <select name="duracion" value={form.duracion} onChange={(e) => handleChange(e)}>
                            <option hidden>Seleccione la duracion</option>
                            <option value="0.5">30 minutos</option>
                            <option value="1">1 hora</option>
                            <option value="2">2 horas</option>
                        </select>
                    </div>

                    

                    {form.tipo === "curso" && (
                        <div className={`${errores.nombre ? "error":"validate"}`}>
                            <label>Nombre del curso</label>
                            <input name="nombre" type="text" value={form.nombre} onChange={(e) => handleChange(e)} />
                        </div>
                    )}

                </form>

                <div className={`asunto ${errores.asunto ? "error":"validate"}`}>
                    <label>Asunto{`${form.tipo==="curso"?"/DescripciÓn del curso": "" }`}</label>
                    <input type='text' name="asunto" value={form.asunto} onChange={(e) => setForm({ ...form, asunto: e.target.value })} />
                </div>

                <div className="btn-reservar-sala">
                    <button type="submit" onClick={(e) => handleSubmit(e)}>{reservaEdith?"Editar Reserva": "Reservar sala" }</button>
                </div>

            </div>
        </>
    )
}