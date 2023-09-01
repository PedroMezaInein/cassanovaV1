import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { apiGet, apiPostForm } from '../../../../functions/api'

import Swal from 'sweetalert2'

import Layout from "../../../../components/layout/layout"

import style from './ClimaLaboral.module.css'

export default function ClimaLaboral() {
    const auth = useSelector(state => state.authUser)
    const [form, setForm] = useState({
        usuario: `${auth.user.id}`,
        respuestas: {
            1: {
                pregunta: 'Las áreas de servicio que me ofrece la empresa están limpias y son funcionales (baños, comedor, etc.).',
                respuesta: '',
                bloque: 'Entorno físico de trabajo'
            },
            2: {
                pregunta: 'La organización me facilita las herramientas y/o equipo necesarios para el desempeño de mis funciones.',
                respuesta: '',
                bloque: 'Entorno físico de trabajo'
            },
            3: {
                pregunta: 'Las condiciones ambientales (iluminación, climatización, etc.) son buenas.',
                respuesta: '',
                bloque: 'Entorno físico de trabajo'
            },
            4: {
                pregunta: 'Mi jefe directo me comunica claramente cuales son mis funciones.',
                respuesta: '',
                bloque: 'Efectividad en el liderazgo'
            },
            5: {
                pregunta: 'Mi jefe  se preocupa por mantener comunicación y cercanía con todos lo miembros del área.',
                respuesta: '',
                bloque: 'Efectividad en el liderazgo'
            },
            6: {
                pregunta: 'Las palabras de mi jefe directo coinciden con sus acciones.',
                respuesta: '',
                bloque: 'Efectividad en el liderazgo'
            },
            7: {
                pregunta: 'Mi jefe directo me trata con respeto profesional.',
                respuesta: '',
                bloque: 'Efectividad en el liderazgo'
            },
            8: {
                pregunta: 'Recibo de mi jefe directo retroalimentación para el buen desempeño de mis funciones.',
                respuesta: '',
                bloque: 'Efectividad en el liderazgo'
            },
            9: {
                pregunta: 'Mi jefe directo toma en cuenta mis sugerencias e ideas.',
                respuesta: '',
                bloque: 'Efectividad en el liderazgo'
            },
            10: {
                pregunta: 'Mi jefe directo se preocupa por enseñarme nuevas cosas.',
                respuesta: '',
                bloque: 'Efectividad en el liderazgo'
            },
            11: {
                pregunta: 'Conozco claramente cuáles son los valores de la organización.',
                respuesta: '',
                bloque: 'Valores'
            },
            12: {
                pregunta: 'Mi jefe directo es visto como un ejemplo a seguir por poner en práctica los valores organizacionales.',
                respuesta: '',
                bloque: 'Valores'
            },
            13: {
                pregunta: 'La organización toma medidas correctivas con todos aquellos colaboradores que no actúan conforme a los valores organizacionales.',
                respuesta: '',
                bloque: 'Valores'
            },
            14: {
                pregunta: 'Existe colaboración y apoyo entre mis compañeros.',
                respuesta: '',
                bloque: 'Espíritu de equipo y colaboración'
            },
            15: {
                pregunta: 'La organización fomenta el trabajo en equipo para dar un mejor servicio.',
                respuesta: '',
                bloque: 'Espíritu de equipo y colaboración'
            },
            16: {
                pregunta: 'En mi área de trabajo no existe favoritismo.',
                respuesta: '',
                bloque: 'Espíritu de equipo y colaboración'
            },
            17: {
                pregunta: 'Los ascensos los obtienen las personas que han demostrado que lo merecen.',
                respuesta: '',
                bloque: 'Espíritu de equipo y colaboración'
            },
            18: {
                pregunta: 'La organización ofrece oportunidades de crecimiento al personal.',
                respuesta: '',
                bloque: 'Desarrollo profesional'
            },
            19: {
                pregunta: 'Las oportunidades de crecimiento laboral significan un beneficio para mi.',
                respuesta: '',
                bloque: 'Desarrollo profesional'
            },
            20: {
                pregunta: 'He recibido la capacitación básica necesaria para el buen desempeño de mis funciones.',
                respuesta: '',
                bloque: 'Desarrollo profesional'
            },
            21: {
                pregunta: 'Mi salario base es competitivo en el mercado, considerando la naturaleza de mis funciones.',
                respuesta: '',
                bloque: 'Compensación y beneficios'
            },
            22: {
                pregunta: 'La organización cuenta con beneficios para el fomento y cuidado de mi salud.',
                respuesta: '',
                bloque: 'Compensación y beneficios'
            },
            23: {
                pregunta: 'Cuento con un paquete competitivo de prestaciones. (aguinaldo, gastos medicos menores etc.',
                respuesta: '',
                bloque: 'Compensación y beneficios'
            },
            24: {
                pregunta: 'Aceptaría otra oportunidad laboral en condiciones similares aunque esté a gusto con la actual',
                respuesta: '',
                bloque: 'Orgullo y sentido de pertenencia'
            },
            25: {
                pregunta: 'Estoy orgulloso de ser parte de esta organización.',
                respuesta: '',
                bloque: 'Orgullo y sentido de pertenencia'
            },
            26: {
                pregunta: 'Estoy dispuesto a dar un esfuerzo extra para realizar mi trabajo.',
                respuesta: '',
                bloque: 'Orgullo y sentido de pertenencia'
            },
            27: {
                pregunta: 'En la organización se reconoce la contribución de todos los colaboradores. ',
                respuesta: '',
                bloque: 'Reconocimiento'
            },
            28: {
                pregunta: 'Cuando logro algo sobresaliente en mi trabajo, mi jefe directo reconoce mi aportación.',
                respuesta: '',
                bloque: 'Reconocimiento'
            },
            29: {
                pregunta: 'Mi trabajo es valorado por la organización.',
                respuesta: '',
                bloque: 'Reconocimiento'
            },
            30: {
                pregunta: 'Me siento estable en el empleo',
                respuesta: '',
                bloque: 'Estrés'
            },
            31: {
                pregunta: 'Mi puesto requiere de trabajar bajo estres constate o trabajar de prisa',
                respuesta: '',
                bloque: 'Estrés'
            },
            32: {
                pregunta: 'Las cargas de trabajo estan bien distribuidas',
                respuesta: '',
                bloque: 'Estrés'
            },
            33: {
                pregunta: 'Soy tomado en cuenta como parte de la innovación en la empresa',
                respuesta: '',
                bloque: 'Identidad y compromiso'
            },
            34: {
                pregunta: 'Me adapto rapidamente a los cambios en mi entorno laboral.',
                respuesta: '',
                bloque: 'Identidad y compromiso'
            },
            35: {
                pregunta: 'Estoy convencido de los cambios que se dan en la empresa son para mi beneficio. ',
                respuesta: '',
                bloque: 'Identidad y compromiso'
            },
        },
        area: '',
        antiguedad: '',
    })
    const [respuestas, setRespuestas] = useState(true)
 
    useEffect(() => {
        getCuestionario()
    }, [])

    const [errors, setErrors] = useState({})
    const [send, setSend] = useState(false)

    const getCuestionario = () => {
        try {
            apiGet(`respuestas/${auth.user.id}`, auth.access_token).then((res) => {
                console.log(res.data)
                if (res.data.respuesta === "Usuario registrado") {
                    setRespuestas(true)
                } else {
                    setRespuestas(false)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }


    const validate = () => {
        let errors = {}
        let formIsValid = true
        Object.keys(form.respuestas).forEach((key) => {
            if (form.respuestas[key].respuesta === "") {
                formIsValid = false
                errors[key] = 'Por favor selecciona una opción'
            }
        })
        if (form.area === '') {
            formIsValid = false
            errors.area = 'Por favor selecciona una opción'
        }
        if (form.antiguedad === '') {
            formIsValid = false
            errors.antiguedad = 'Por favor selecciona una opción'
        }


        setErrors(errors)
        return formIsValid
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            respuestas: {
                ...form.respuestas,
                [e.target.name]: {
                    ...form.respuestas[e.target.name],
                    respuesta: parseInt(e.target.value)
                }
            }
        })
    }

    const handleChangeGeneral = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const resetForm = () => {
        setForm({
            ...form,
            respuestas: {
                1: {
                    pregunta: 'Las áreas de servicio que me ofrece la empresa están limpias y son funcionales (baños, comedor, etc.).',
                    respuesta: '',
                    bloque: 'Entorno físico de trabajo'
                },
                2: {
                    pregunta: 'La organización me facilita las herramientas y/o equipo necesarios para el desempeño de mis funciones.',
                    respuesta: '',
                    bloque: 'Entorno físico de trabajo'
                },
                3: {
                    pregunta: 'Las condiciones ambientales (iluminación, climatización, etc.) son buenas.',
                    respuesta: '',
                    bloque: 'Entorno físico de trabajo'
                },
                4: {
                    pregunta: 'Mi jefe directo me comunica claramente cuales son mis funciones.',
                    respuesta: '',
                    bloque: 'Efectividad en el liderazgo'
                },
                5: {
                    pregunta: 'Mi jefe  se preocupa por mantener comunicación y cercanía con todos lo miembros del área.',
                    respuesta: '',
                    bloque: 'Efectividad en el liderazgo'
                },
                6: {
                    pregunta: 'Las palabras de mi jefe directo coinciden con sus acciones.',
                    respuesta: '',
                    bloque: 'Efectividad en el liderazgo'
                },
                7: {
                    pregunta: 'Mi jefe directo me trata con respeto profesional.',
                    respuesta: '',
                    bloque: 'Efectividad en el liderazgo'
                },
                8: {
                    pregunta: 'Recibo de mi jefe directo retroalimentación para el buen desempeño de mis funciones.',
                    respuesta: '',
                    bloque: 'Efectividad en el liderazgo'
                },
                9: {
                    pregunta: 'Mi jefe directo toma en cuenta mis sugerencias e ideas.',
                    respuesta: '',
                    bloque: 'Efectividad en el liderazgo'
                },
                10: {
                    pregunta: 'Mi jefe directo se preocupa por enseñarme nuevas cosas.',
                    respuesta: '',
                    bloque: 'Efectividad en el liderazgo'
                },
                11: {
                    pregunta: 'Conozco claramente cuáles son los valores de la organización.',
                    respuesta: '',
                    bloque: 'Valores'
                },
                12: {
                    pregunta: 'Mi jefe directo es visto como un ejemplo a seguir por poner en práctica los valores organizacionales.',
                    respuesta: '',
                    bloque: 'Valores'
                },
                13: {
                    pregunta: 'La organización toma medidas correctivas con todos aquellos colaboradores que no actúan conforme a los valores organizacionales.',
                    respuesta: '',
                    bloque: 'Valores'
                },
                14: {
                    pregunta: 'Existe colaboración y apoyo entre mis compañeros.',
                    respuesta: '',
                    bloque: 'Espíritu de equipo y colaboración'
                },
                15: {
                    pregunta: 'La organización fomenta el trabajo en equipo para dar un mejor servicio.',
                    respuesta: '',
                    bloque: 'Espíritu de equipo y colaboración'
                },
                16: {
                    pregunta: 'En mi área de trabajo no existe favoritismo.',
                    respuesta: '',
                    bloque: 'Espíritu de equipo y colaboración'
                },
                17: {
                    pregunta: 'Los ascensos los obtienen las personas que han demostrado que lo merecen.',
                    respuesta: '',
                    bloque: 'Espíritu de equipo y colaboración'
                },
                18: {
                    pregunta: 'La organización ofrece oportunidades de crecimiento al personal.',
                    respuesta: '',
                    bloque: 'Desarrollo profesional'
                },
                19: {
                    pregunta: 'Las oportunidades de crecimiento laboral significan un beneficio para mi.',
                    respuesta: '',
                    bloque: 'Desarrollo profesional'
                },
                20: {
                    pregunta: 'He recibido la capacitación básica necesaria para el buen desempeño de mis funciones.',
                    respuesta: '',
                    bloque: 'Desarrollo profesional'
                },
                21: {
                    pregunta: 'Mi salario base es competitivo en el mercado, considerando la naturaleza de mis funciones.',
                    respuesta: '',
                    bloque: 'Compensación y beneficios'
                },
                22: {
                    pregunta: 'La organización cuenta con beneficios para el fomento y cuidado de mi salud.',
                    respuesta: '',
                    bloque: 'Compensación y beneficios'
                },
                23: {
                    pregunta: 'Cuento con un paquete competitivo de prestaciones. (aguinaldo, gastos medicos menores etc.',
                    respuesta: '',
                    bloque: 'Compensación y beneficios'
                },
                24: {
                    pregunta: 'Aceptaría otra oportunidad laboral en condiciones similares aunque esté a gusto con la actual',
                    respuesta: '',
                    bloque: 'Orgullo y sentido de pertenencia'
                },
                25: {
                    pregunta: 'Estoy orgulloso de ser parte de esta organización.',
                    respuesta: '',
                    bloque: 'Orgullo y sentido de pertenencia'
                },
                26: {
                    pregunta: 'Estoy dispuesto a dar un esfuerzo extra para realizar mi trabajo.',
                    respuesta: '',
                    bloque: 'Orgullo y sentido de pertenencia'
                },
                27: {
                    pregunta: 'En la organización se reconoce la contribución de todos los colaboradores. ',
                    respuesta: '',
                    bloque: 'Reconocimiento'
                },
                28: {
                    pregunta: 'Cuando logro algo sobresaliente en mi trabajo, mi jefe directo reconoce mi aportación.',
                    respuesta: '',
                    bloque: 'Reconocimiento'
                },
                29: {
                    pregunta: 'Mi trabajo es valorado por la organización.',
                    respuesta: '',
                    bloque: 'Reconocimiento'
                },
                30: {
                    pregunta: 'Me siento estable en el empleo',
                    respuesta: '',
                    bloque: 'Estrés'
                },
                31: {
                    pregunta: 'Mi puesto requiere de trabajar bajo estres constate o trabajar de prisa',
                    respuesta: '',
                    bloque: 'Estrés'
                },
                32: {
                    pregunta: 'Las cargas de trabajo estan bien distribuidas',
                    respuesta: '',
                    bloque: 'Estrés'
                },
                33: {
                    pregunta: 'Soy tomado en cuenta como parte de la innovación en la empresa',
                    respuesta: '',
                    bloque: 'Identidad y compromiso'
                },
                34: {
                    pregunta: 'Me adapto rapidamente a los cambios en mi entorno laboral.',
                    respuesta: '',
                    bloque: 'Identidad y compromiso'
                },
                35: {
                    pregunta: 'Estoy convencido de los cambios que se dan en la empresa son para mi beneficio. ',
                    respuesta: '',
                    bloque: 'Identidad y compromiso'
                },
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            
            try {
                Swal.fire({
                    title: 'Enviando encuesta',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    onBeforeOpen: () => {
                        Swal.showLoading()
                    }
                })
                apiPostForm('respuestas/rh', form, auth.access_token)
                    .then(res => {
                        Swal.close()
                        Swal.fire({
                            icon: 'success',
                            title: 'Encuesta enviada',
                            text: 'Gracias por tu tiempo',
                        })
                        resetForm()
                        getCuestionario()
                    })
            } catch (error) {
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal',
                })
            }
        } else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor responde todas las preguntas',
            })
        }
    }

    let prop = {
        pathname: '/rh/encuestas/clima-laboral',
    }
    console.log(errors)

    return (
        <>
            <Layout authUser={auth.access_token} location={prop} history={{ location: prop }} active='rh'>
                {
                    respuestas ? 
                    <>
                        <div className={style.container}>
                            <h1>Encuesta de Clima laboral 2023</h1>
                            <p>
                                Gracias por tu participación.
                            </p>
                        </div>
                    </>
                    :
                    <>    <div className={style.container}>
                        <h1>Clima Laboral</h1>
                            <p>El presente cuestionario es una herramienta de medición de clima organizacional, cuyo objetivo es conocer la percepción que tienen los colaboradores sobre aquellos aspectos que conforman el entorno laboral en la empresa.</p>
                            <p><b>La información vertida en éste cuestionario es estrictamente confidencial, siéntete con la confianza de contestar el cuestionario.</b> </p>
                        {/* <p>La encuesta se encuentra disponible desde el 1 de enero al 31 de enero de 2021.</p> */}
                        <p>Selecciona la opcion que mas se ajuste a tu percepción en cada una de las frases.</p>

                            <div className={style.body}>
                                <div>
                                    <label>Datos Generales</label>
                                    <div>
                                        <form className={style.datos_generales}>
                                            <div>
                                                <label className={errors.area ? style.error : ''}>Area</label>
                                                <select name="area" onChange={handleChangeGeneral}>
                                                    <option value="0" hidden>Selecciona una opción</option>
                                                    <option value="RH">RH</option>
                                                    <option value="COMPRAS">COMPRAS</option>
                                                    <option value="MERCADOTECNIA">MERCADOTECNIA</option>
                                                    <option value="TI">TI</option>
                                                    <option value="VENTAS">VENTAS</option>
                                                    <option value="PROYECTOS">PROYECTOS</option>
                                                    <option value="OBRA">OBRA</option>
                                                    <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                                                    <option value="INNOVACION">INNOVACION</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className={errors.antiguedad ? style.error : ''}>Antigüedad</label>
                                                
                                                <select name="antiguedad" onChange={handleChangeGeneral}>
                                                    <option value="0" hidden>Selecciona una opción</option>
                                                    <option value="Menos de 1 año" >Menos de 1 año</option>
                                                    <option value="1 a 3 años">1 a 3 años</option>
                                                    <option value="4 a 9 años">4 a 9 años</option>
                                                    <option value="mas de 10 años">más de 10 años</option>
                                                </select>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                            <div>
                                <h3>Entorno físico de trabajo</h3>

                                <div>
                                    <label className={errors[1] ? style.error : ''}>1.- Las áreas de servicio que me ofrece la empresa están limpias y son funcionales (baños, comedor, etc.).</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="1" value="3" /> 
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="1" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="1" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[2] ? style.error : ''}>2.- La organización me facilita las herramientas y/o equipo necesarios para el desempeño de mis funciones.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="2" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="2" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="2" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[3] ? style.error : ''}>3.- Las condiciones ambientales (iluminación, climatización, etc.) son buenas.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="3" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="3" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="3" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                            </div>

                            <div>
                                <h3>Efectividad en el liderazgo</h3>

                                <div>
                                    <label className={errors[4] ? style.error : ''}>4.- Mi jefe directo me comunica claramente cuales son mis funciones.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="4" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="4" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="4" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[5] ? style.error : ''}>5.- Mi jefe  se preocupa por mantener comunicación y cercanía con todos lo miembros del área.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="5" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="5" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="5" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[6] ? style.error : ''}>6.- Las palabras de mi jefe directo coinciden con sus acciones.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="6" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="6" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="6" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[7] ? style.error : ''}>7.- Mi jefe directo me trata con respeto profesional.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="7" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="7" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="7" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[8] ? style.error : ''}>8.- Recibo de mi jefe directo retroalimentación para el buen desempeño de mis funciones.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="8" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="8" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="8" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[9] ? style.error : ''}>9.- Mi jefe directo toma en cuenta mis sugerencias e ideas.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="9" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="9" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="9" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[10] ? style.error : ''}>10.- Mi jefe directo se preocupa por enseñarme nuevas cosas.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="10" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="10" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="10" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                            </div>

                            <div>
                                <h3>Valores</h3>
                                <div>
                                    <label className={errors[11] ? style.error : ''}>11.- Conozco claramente cuáles son los valores de la organización.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="11" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="11" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="11" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[12] ? style.error : ''}>12.- Mi jefe directo es visto como un ejemplo a seguir para poner en práctica los valores organizacionales.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="12" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="12" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="12" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[13] ? style.error : ''}>13.- La organización toma medidas correctivas con todos aquellos colaboradores que no actúan conforme a los valores organizacionales.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="13" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="13" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="13" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                            </div>

                            <div>
                                <h3>Espíritu de equipo y colaboración</h3>

                                <div>
                                    <label className={errors[14] ? style.error : ''}>14.- Existe colaboración y apoyo entre mis compañeros.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="14" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="14" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="14" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>    
                                    </div>
                                    
                                </div>
                                <div>
                                    <label className={errors[15] ? style.error : ''}>15.- La organización fomenta el trabajo en equipo para dar un mejor servicio.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="15" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="15" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="15" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>    
                                    </div>
                                    
                                </div>
                                <div>
                                    <label className={errors[16] ? style.error : ''}>16.- En mi área de trabajo no existe favoritismo. </label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="16" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="16" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="16" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>    
                                    </div>
                                    
                                </div>
                                <div>
                                    <label className={errors[17] ? style.error : ''}>17.- Los ascensos los obtienen las personas que han demostrado que lo merecen.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="17" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="17" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="17" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3>Desarrollo profesional</h3>
                                <div>
                                    <label className={errors[18] ? style.error : ''}>18.- La organización ofrece oportunidades de crecimiento al personal.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="18" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="18" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="18" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[19] ? style.error : ''}>19.- Las oportunidades de crecimiento laboral significan un beneficio para mi.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="19" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="19" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="19" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[20] ? style.error : ''}>20.- He recibido la capacitación básica necesaria para el buen desempeño de mis funciones.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="20" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="20" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="20" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3>Compensación y beneficios</h3>
                                <div>
                                    <label className={errors[21] ? style.error : ''}>21.- Mi salario base es competitivo en el mercado, considerando la naturaleza de mis funciones.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="21" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="21" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="21" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[22] ? style.error : ''}>22.- La organización cuenta con beneficios para el fomento y cuidado de mi salud.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="22" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="22" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="22" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[23] ? style.error : ''}>23.- Cuento con un paquete competitivo de prestaciones. (aguinaldo, gastos medicos menores etc.).</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="23" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="23" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="23" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3>Orgullo y sentido de pertenencia</h3>
                                <div>
                                    <label className={errors[24] ? style.error : ''}>24.- Aceptaría otra oportunidad laboral en condiciones similares aunque esté a gusto con la actual</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="24" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="24" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="24" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[25] ? style.error : ''}>25.- Estoy orgulloso de ser parte de esta organización.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="25" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="25" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="25" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[26] ? style.error : ''}>26.- Estoy dispuesto a dar un esfuerzo extra para realizar mi trabajo.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="26" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="26" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="26" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3>Reconocimiento</h3>
                                <div>
                                    <label className={errors[27] ? style.error : ''}>27.- En la organización se reconoce la contribución de todos los colaboradores. </label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="27" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="27" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="27" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[28] ? style.error : ''}>28.- Cuando logro algo sobresaliente en mi trabajo, mi jefe directo reconoce mi aportación.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="28" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="28" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="28" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[29] ? style.error : ''}>29.- Mi trabajo es valorado por la organización. </label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="29" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="29" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="29" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3>Estrés</h3>
                                <div>
                                    <label className={errors[30] ? style.error : ''}>30.- Me siento estable en el empleo </label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="30" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="30" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="30" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[31] ? style.error : ''}>31.- Mi puesto requiere de trabajar bajo estres constate o trabajar de prisa</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="31" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="31" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="31" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[32] ? style.error : ''}>32.- Las cargas de trabajo estan bien distribuidas</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="32" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="32" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="32" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3>Identidad y compromiso</h3>
                                <div>
                                    <label className={errors[33] ? style.error : ''}>33.- Soy tomado en cuenta como parte de la innovación en la empresa</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="33" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="33" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="33" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[34] ? style.error : ''}>34.- Me adapto rapidamente a los cambios en mi entorno laboral.</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="34" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="34" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="34" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <label className={errors[35] ? style.error : ''}>35.- Estoy convencido de los cambios que se dan en la empresa son para mi beneficio.  </label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name="35" value="3" />
                                                <label>De acuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="35" value="2" />
                                                <label>Ni de acuerdo ni en desacuerdo</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="35" value="1" />
                                                <label>En desacuerdo</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className={style.submit}>
                            <button onClick={handleSubmit}>Enviar</button>
                        </div>
                    </div>
                    
                    </>
                }
               
                
            </Layout>
           

        </>
    )
}