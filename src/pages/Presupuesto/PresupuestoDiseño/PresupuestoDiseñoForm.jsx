import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import Layout from '../../../components/layout/layout'
import { URL_DEV } from '../../../constants'
import { setOptions } from '../../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert, doneAlert } from '../../../functions/alert'
import { PresupuestoDiseñoForm as PresupuestoDiseñoFormulario } from '../../../components/forms'
import { Card } from 'react-bootstrap'
class PresupuestoDiseñoForm extends Component {
    state = {
        formeditado: 0,
        data: {
            precios: [],
            empresas: []
        },
        title: 'Presupuesto de diseño',
        form: {
            empresa: '',
            m2: '',
            tipo_partida: '',
            esquema: 'esquema_1',
            fecha: new Date(),
            tiempo_ejecucion_diseno: '',
            descuento: 0.0,
            conceptos: [
                {
                    value: '',
                    text: 'REUNIÓN DE AMBOS EQUIPOS',
                    name: 'concepto1'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL MATERIAL PARA LA PRIMERA REVISIÓN PRESENCIAL',
                    name: 'concepto2'
                },
                {
                    value: '',
                    text: 'JUNTA PRESENCIAL PARA PRIMERA REVISIÓN DE LA PROPUESTA DE DISEÑO',
                    name: 'concepto3'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL PROYECTO',
                    name: 'concepto4'
                },
                {
                    value: '',
                    text: 'JUNTA PRESENCIAL PARA SEGUNDA REVISIÓN DE LA PROPUESTA DE DISEÑO',
                    name: 'concepto5'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL PROYECTO EJECUTIVO',
                    name: 'concepto6'
                },
                {
                    value: '',
                    text: 'ENTREGA FINAL DEL PROYECTO EN DIGITAL',
                    name: 'concepto7'
                },
            ],
            precio_inferior_construccion: '',
            precio_superior_construccion: '',
            tiempo_ejecucion_construccion: '',
            precio_inferior_mobiliario: '',
            precio_superior_mobiliario: '',
            semanas: [
                {
                    lunes: false,
                    martes: false,
                    miercoles: false,
                    jueves: false,
                    viernes: false,
                    sabado: false,
                    domingo: false
                }
            ],
            partidasInein: [],
            partidasIm: [],
            proyecto: ''
        },
        options: {
            empresas: [],
            precios: [],
            esquemas: []
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { match: { params: { action: action } } } = this.props
        const { history, location: { state: state } } = this.props

        const presupuesto = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'add':
                this.setState({
                    ... this.state,
                    title: 'Agregar presupuesto de diseño',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.presupuesto) {
                        const { presupuesto } = state
                        const { form, options, data } = this.state

                        form.empresa = presupuesto.empresa ? presupuesto.empresa.id.toString() : ''
                        form.m2 = presupuesto.precio ? presupuesto.precio.id.toString() : ''
                        form.esquema = presupuesto.esquema
                        form.proyecto = presupuesto.proyecto
                        form.fecha = new Date(presupuesto.fecha)
                        form.tiempo_ejecucion_diseno = presupuesto.tiempo_ejecucion_diseno
                        form.descuento = presupuesto.descuento
                        form.proyecto = presupuesto.nombre_proyecto
                        let aux = []
                        presupuesto.semanas.map((semana, key) => {
                            aux.push({
                                lunes: semana.lunes,
                                martes: semana.martes,
                                miercoles: semana.miercoles,
                                jueves: semana.jueves,
                                viernes: semana.viernes,
                                sabado: semana.sabado,
                                domingo: semana.domingo
                            })
                        })
                        if (aux.length === 0) {
                            aux.push({
                                lunes: false,
                                martes: false,
                                miercoles: false,
                                jueves: false,
                                viernes: false,
                                sabado: false,
                                domingo: false
                            })
                        }
                        form.semanas = aux
                        aux = []
                        presupuesto.conceptos.map((concepto, key) => {
                            aux.push({
                                name: 'concepto' + (key + 1),
                                value: concepto.dias,
                                text: concepto.texto
                            })
                        })
                        if (aux.length === 0) {
                            aux = [
                                {
                                    value: '',
                                    text: 'REUNIÓN DE AMBOS EQUIPOS',
                                    name: 'concepto1'
                                },
                                {
                                    value: '',
                                    text: 'DESARROLLO DEL MATERIAL PARA LA PRIMERA REVISIÓN PRESENCIAL',
                                    name: 'concepto2'
                                },
                                {
                                    value: '',
                                    text: 'JUNTA PRESENCIAL PARA PRIMERA REVISIÓN DE LA PROPUESTA DE DISEÑO',
                                    name: 'concepto3'
                                },
                                {
                                    value: '',
                                    text: 'DESARROLLO DEL PROYECTO',
                                    name: 'concepto4'
                                },
                                {
                                    value: '',
                                    text: 'JUNTA PRESENCIAL PARA SEGUNDA REVISIÓN DE LA PROPUESTA DE DISEÑO',
                                    name: 'concepto5'
                                },
                                {
                                    value: '',
                                    text: 'DESARROLLO DEL PROYECTO EJECUTIVO',
                                    name: 'concepto6'
                                },
                                {
                                    value: '',
                                    text: 'ENTREGA FINAL DEL PROYECTO EN DIGITAL',
                                    name: 'concepto7'
                                },
                            ]
                        }
                        form.conceptos = aux
                        form.precio_inferior_construccion = presupuesto.precio_inferior_construccion
                        form.precio_superior_construccion = presupuesto.precio_superior_construccion
                        form.precio_inferior_mobiliario = presupuesto.precio_inferior_mobiliario
                        form.precio_superior_mobiliario = presupuesto.precio_superior_mobiliario
                        form.tiempo_ejecucion_construccion = presupuesto.tiempo_ejecucion_construccion
                        if (presupuesto.precio) {
                            form.total = presupuesto.precio[presupuesto.esquema] * (1 - (presupuesto.descuento / 100))
                        }
                        if (presupuesto.empresa) {
                            if (presupuesto.empresa.name === 'INEIN') {
                                form.tipo_partida = 'partidasInein'
                            }
                            if (presupuesto.empresa.name === 'INFRAESTRUCTURA MÉDICA')
                                form.tipo_partida = 'partidasIm'
                        }
                        this.setState({
                            ... this.state,
                            title: 'Editar presupuesto de diseño',
                            presupuesto: presupuesto,
                            form,
                            options,
                            formeditado: 1
                        })
                    }
                    else
                        history.push('/presupuesto/presupuesto-diseño')
                } else
                    history.push('/presupuesto/presupuesto-diseño')
                break;
            default:
                break;
        }
        if (!presupuesto)
            history.push('/')
        this.getOptionsAxios()
    }
    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }
    setPartidas = (partidas, value) => {
        let checkBoxPartida = []
        partidas.map((partida, key) => {
            checkBoxPartida.push({ checked: value, text: partida.nombre, id: partida.id })
        })
        return checkBoxPartida
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'presupuestos-diseño/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { esquemas, empresas, precios, partidasInein, partidasIm } = response.data
                const { options, data, form, presupuesto } = this.state
                data.precios = precios
                data.empresas = empresas
                data.partidasInein = partidasInein
                data.partidasIm = partidasIm
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['esquemas'] = setOptions(esquemas, 'nombre', 'id')
                options['precios'] = setOptions(precios, 'm2', 'id')
                form.partidasInein = this.setPartidas(partidasInein, 'partidasInein', true)
                form.partidasIm = this.setPartidas(partidasIm, 'partidasIm', true)
                if (presupuesto) {
                    form.partidasInein = this.setPartidas(partidasInein, 'partidasInein', false)
                    form.partidasIm = this.setPartidas(partidasIm, 'partidasIm', false)
                    if (presupuesto.empresa) {
                        if (presupuesto.empresa.name === 'INEIN') {
                            form.tipo_partida = 'partidasInein'
                            presupuesto.partidas_inein.map((partida_inein, key) => {
                                if (partida_inein.partida)
                                    form.partidasInein.map((element) => {
                                        if (element.id === partida_inein.partida.id) {
                                            element.checked = true
                                        }
                                    })
                            })
                        }
                        if (presupuesto.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                            form.tipo_partida = 'partidasIm'
                            presupuesto.partidas_im.map((partida_im, key) => {
                                if (partida_im.partida)
                                    form.partidasIm.map((element) => {
                                        if (element.id === partida_im.partida.id) {
                                            element.checked = true
                                        }
                                    })
                            })
                        }
                    }
                }
                this.setState({
                    ... this.state,
                    options,
                    data,
                    form
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addPresupuestoDiseñoAxios(pdf) {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state

        form.pdf = pdf

        await axios.post(URL_DEV + 'presupuestos-diseño', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                const { presupuesto } = response.data

                if (pdf)
                    if (presupuesto.pdfs) {
                        var win = window.open(presupuesto.pdfs[0].url, '_blank');
                        win.focus();
                    }
                const { history } = this.props
                doneAlert(response.data.message !== undefined ? response.data.message : 'La presupuesto fue eliminada con éxito.',)
                history.push({
                    pathname: '/presupuesto/presupuesto-diseño'
                });
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async updatePresupuestoDiseñoAxios(pdf) {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, presupuesto } = this.state

        form.pdf = pdf

        await axios.put(URL_DEV + 'presupuestos-diseño/' + presupuesto.id, form, { headers: { Accept: '/', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { presupuesto } = response.data
                const { history } = this.props

                if (pdf)
                    if (presupuesto.pdfs) {
                        var win = window.open(presupuesto.pdfs[0].url, '_blank');
                        win.focus();
                    }
                doneAlert(response.data.message !== undefined ? response.data.message : 'La presupuesto fue eliminada con éxito.',)
                history.push({
                    pathname: '/presupuesto/presupuesto-diseño'
                });
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    checkButtonSemanas = (e, key, dia) => {
        const { form } = this.state
        const { checked } = e.target
        form.semanas[key][dia] = checked
        let count = 0;
        let aux = Object.keys(
            {
                lunes: false,
                martes: false,
                miercoles: false,
                jueves: false,
                viernes: false,
                sabado: false,
                domingo: false
            }
        )
        form.semanas.map((semana) => {
            aux.map((element) => {
                if (semana[element])
                    count++;
            })
        })
        form.tiempo_ejecucion_diseno = count
        this.setState({
            ... this.state,
            form
        })
    }
    onChangeConceptos = (e, key) => {
        const { value, form } = e.target
        form.conceptos[key].value = value
        this.setState({
            ... this.state,
            form
        })
    }
    onChange = e => {
        const { name, value } = e.target
        const { form, data } = this.state
        form[name] = value
        if (name === 'esquema') {
            form.conceptos.map((concepto) => {
                if (concepto.name === 'concepto3') {
                    if (value === 'esquema_1')
                        concepto.text = 'JUNTA PRESENCIAL PARA PRIMERA REVISIÓN DE LA PROPUESTA DE DISEÑO'
                    if (value === 'esquema_2')
                        concepto.text = 'JUNTA PRESENCIAL PARA PRIMERA REVISIÓN DE LA PROPUESTA DE DISEÑO Y MODELO 3D'
                    if (value === 'esquema_3')
                        concepto.text = 'JUNTA PRESENCIAL PARA PRIMERA REVISIÓN DE LA PROPUESTA DE DISEÑO, MODELO 3D Y RENDERS'
                }
                if (concepto.name === 'concepto5') {
                    if (value === 'esquema_1')
                        concepto.text = 'JUNTA PRESENCIAL PARA SEGUNDA REVISIÓN DE LA PROPUESTA DE DISEÑO'
                    if (value === 'esquema_2')
                        concepto.text = 'JUNTA PRESENCIAL PARA SEGUNDA REVISIÓN DE LA PROPUESTA DE DISEÑO Y MODELO 3D'
                    if (value === 'esquema_3')
                        concepto.text = 'JUNTA PRESENCIAL PARA SEGUNDA REVISIÓN DE LA PROPUESTA DE DISEÑO, MODELO 3D Y RENDERS'
                }
            })
        }
        if (name === 'tiempo_ejecucion_diseno') {
            let modulo = parseFloat(value) % 6
            let aux = Object.keys(
                {
                    lunes: false,
                    martes: false,
                    miercoles: false,
                    jueves: false,
                    viernes: false,
                    sabado: false,
                    domingo: false
                }
            )
            form.semanas = [];
            for (let i = 0; i < Math.floor(parseFloat(value) / 6); i++) {
                form.semanas.push({
                    lunes: true,
                    martes: true,
                    miercoles: true,
                    jueves: true,
                    viernes: true,
                    sabado: true,
                    domingo: false
                })
            }
            form.semanas.push({
                lunes: false,
                martes: false,
                miercoles: false,
                jueves: false,
                viernes: false,
                sabado: false,
                domingo: false
            })
            aux.map((element, key) => {
                if (key < modulo) {
                    form.semanas[form.semanas.length - 1][element] = true
                } else {
                    form.semanas[form.semanas.length - 1][element] = false
                }
            })
            if (modulo > 2) {
                form.semanas.push({
                    lunes: false,
                    martes: false,
                    miercoles: false,
                    jueves: false,
                    viernes: false,
                    sabado: false,
                    domingo: false
                })
            }
        }
        if (name === 'esquema' || name === 'm2' || name === 'descuento') {
            data.precios.map((precio) => {
                if (precio.id.toString() === form.m2)
                    if (form.esquema)
                        if (form.descuento) {
                            form.total = precio[form.esquema] * (1 - (form.descuento / 100))
                        } else
                            form.total = precio[form.esquema]
            })
        }
        if (name === "empresa") {
            data.empresas.map((empresa) => {
                if (empresa.id.toString() === value && empresa.name === 'INEIN') {
                    form.tipo_partida = 'partidasInein'
                }
                if (empresa.id.toString() === value && empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    form.tipo_partida = 'partidasIm'
                }
            })
        }
        this.setState({
            ...this.state,
            form
        })
    }
    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Editar presupuesto de diseño')
            this.updatePresupuestoDiseñoAxios(false)
        else
            this.addPresupuestoDiseñoAxios(false)
    }
    submitPDF = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Editar presupuesto de diseño')
            this.updatePresupuestoDiseñoAxios(true)
        else
            this.addPresupuestoDiseñoAxios(true)
    }
    handleChangeCheckbox = (array) => {
        const { form } = this.state
        form[form.tipo_partida] = array
        this.setState({
            ... this.state,
            form: form
        })
    }
    render() {
        const { options, title, form, formeditado } = this.state
        return (
            <Layout active={'presupuesto'} {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <PresupuestoDiseñoFormulario
                            title={title}
                            formeditado={formeditado}
                            className=" px-3 "
                            options={options}
                            form={form}
                            onChange={this.onChange}
                            onSubmit={this.onSubmit}
                            submitPDF={this.submitPDF}
                            onChangeConceptos={this.onChangeConceptos}
                            checkButtonSemanas={this.checkButtonSemanas}
                            onChangeCheckboxes={this.handleChangeCheckbox}
                        />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }

}
const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(PresupuestoDiseñoForm);