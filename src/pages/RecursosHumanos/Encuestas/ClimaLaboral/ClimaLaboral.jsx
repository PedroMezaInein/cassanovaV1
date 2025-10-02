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
        antiguedad: ''
    })

    const [respuestas, setRespuestas] = useState(false)
    const [errors, setErrors] = useState({})
    const [send, setSend] = useState(false)

    useEffect(() => {
        getCuestionario()
    }, [])

    const getCuestionario = async () => {
        try {
            const res = await apiGet(`respuestas/${auth.user.id}`, auth.access_token)
            setRespuestas(res.data.respuesta === "Usuario registrado")
        } catch (error) {
            console.log(error)
        }
    }

    const validate = () => {
        let errors = {}
        let formIsValid = true

        Object.keys(form.respuestas).forEach((key) => {
            if (form.respuestas[key].respuesta === '') {
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
                    pregunta: 'Mi puesto requiere de trabajar bajo estres constante o trabajar de prisa',
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
            antiguedad: ''
        })
    }

    const handleSubmit = async (e) => {
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
                await apiPostForm('respuestas/rh', form, auth.access_token)
                Swal.close()
                Swal.fire({
                    icon: 'success',
                    title: 'Encuesta enviada',
                    text: 'Gracias por tu tiempo'
                })
                resetForm()
                getCuestionario()
            } catch (error) {
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal'
                })
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor responde todas las preguntas'
            })
        }
    }

    let prop = {
        pathname: '/rh/encuestas/clima-laboral'
    }
    let bloquesMostrados = [];


    return (
        <Layout authUser={auth.access_token} location={prop} history={{ location: prop }} active='rh'>
            {respuestas ? (
                <div className={style.container}>
                    <h1>Encuesta de Clima laboral 2024</h1>
                    <p>Gracias por tu participación.</p>
                </div>
            ) : (
                <div className={style.container}>
                    <h1>Clima Laboral</h1>
                    <p>El presente cuestionario es una herramienta de medición de clima organizacional, cuyo objetivo es conocer la percepción que tienen los colaboradores sobre aquellos aspectos que conforman el entorno laboral en la empresa.</p>
                    <p><b>La información vertida en este cuestionario es estrictamente confidencial, siéntete con la confianza de contestar el cuestionario.</b></p>
                    <p>Selecciona la opción que más se ajuste a tu percepción en cada una de las frases.</p>
                    <div className={style.body}>
                        <div>
                            <label>Datos Generales</label>
                            <div>
                                <form className={style.datos_generales}>
                                    <div>
                                        <label className={errors.area ? style.error : ''}>Área</label>
                                        <select name="area" value={form.area} onChange={handleChangeGeneral} className={errors.area ? style.errorSelect : ''}>
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
                                            <option value="PLANEACION">PLANEACION</option>

                                        </select>
                                    </div>
                                    <div>
                                        <label className={errors.antiguedad ? style.error : ''}>Antigüedad</label>
                                        <select name="antiguedad" value={form.antiguedad} onChange={handleChangeGeneral} className={errors.antiguedad ? style.errorSelect : ''}>
                                            <option value="0" hidden>Selecciona una opción</option>
                                            <option value="Menos de 1 año">Menos de 1 año</option>
                                            <option value="1 a 3 años">1 a 3 años</option>
                                            <option value="4 a 9 años">4 a 9 años</option>
                                            <option value="más de 10 años">más de 10 años</option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div>
                            <h3>Entorno físico de trabajo</h3>
                            {Object.keys(form.respuestas).map((key, index) => (
                                <div key={index}>
                                {!bloquesMostrados.includes(form.respuestas[key].bloque) && (
                                                <h3>{form.respuestas[key].bloque}</h3>
                                            )}
                                    <label className={errors[key] ? style.error : ''}>{key}.- {form.respuestas[key].pregunta}</label>
                                    <div>
                                        <form onChange={handleChange}>
                                            <div>
                                                <input type="radio" name={key} value="1" />
                                                <label>TOTALMENTE DE ACUERDO</label>
                                            </div>
                                            <div>
                                                <input type="radio" name={key} value="2" />
                                                <label>DE ACUERDO</label>
                                            </div>
                                            <div>
                                                <input type="radio" name={key} value="3" />
                                                <label>NI DE ACUERDO NI DESACUERDO</label>
                                            </div>
                                            <div>
                                                <input type="radio" name={key} value="4" />
                                                <label>EN DESACUERDO</label>
                                            </div>
                                            <div>
                                                <input type="radio" name={key} value="5" />
                                                <label>TOTALMENTE EN DESACUERDO</label>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={style.submit}>
                            <button onClick={handleSubmit}>Enviar</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    )
}
