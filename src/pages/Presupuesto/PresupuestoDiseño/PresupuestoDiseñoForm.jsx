import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import Layout from '../../../components/layout/layout'
import { URL_DEV } from '../../../constants'
import { setOptions } from '../../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert, doneAlert } from '../../../functions/alert'
import { PresupuestoDiseñoForm as PresupuestoDisenoFormulario } from '../../../components/forms'
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
            m2: '',
            tipo_partida: '',
            esquema: 'esquema_1',
            fecha: new Date(),
            tiempo_ejecucion_diseno: '',
            tiempo_ejecucion_construccion: 0,
            descuento: 0.0,
            conceptos: [
                {
                    value: '',
                    text: 'VISITA A INSTALACIONES Y REUNIÓN DE AMBOS EQUIPOS',
                    name: 'concepto1'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL MATERIAL PARA LA PRIMERA REVISIÓN PRESENCIAL',
                    name: 'concepto2'
                },
                {
                    value: '',
                    text: 'JUNTA PRESENCIAL/REMOTA PARA PRIMERA REVISIÓN DE LA PROPUESTA DE DISEÑO Y MODELO 3D',
                    name: 'concepto3'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL PROYECTO',
                    name: 'concepto4'
                },
                {
                    value: '',
                    text: 'JUNTA PRESENCIAL/REMOTA PARA SEGUNDA REVISIÓN DE LA PROPUESTA DE DISEÑO ,MODELO 3D Y V.º B.º DE DISEÑO ',
                    name: 'concepto5'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL PROYECTO',
                    name: 'concepto6'
                },
                {
                    value: '',
                    text: 'ENTREGA FINAL DEL PROYECTO DIGITAL',
                    name: 'concepto7'
                },
            ],
            construccion_interiores_inf: '',
            construccion_interiores_sup: '',
            mobiliario_inf: '',
            mobiliario_sup: '',
            construccion_civil_inf: '',
            construccion_civil_sup: '',
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
            partidas: [],
            planos: [],
            subtotal: 0.0,
            fase1: true,
            fase2: true,
            renders: '',
            empresa: '',
            tipoProyecto: '',
            proyecto: '',
        },
        options: {
            empresas: [],
            precios: [],
            esquemas: []
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props

        const presupuesto = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Agregar presupuesto de diseño',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.presupuesto) {
                        const { presupuesto } = state
                        const { form, options } = this.state
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
                            return false
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
                            return false
                        })
                        if (aux.length === 0) {
                            aux = [
                                {
                                    value: '1',
                                    text: 'VISITA A INSTALACIONES Y REUNIÓN DE AMBOS EQUIPOS',
                                    name: 'concepto1'
                                },
                                {
                                    value: '1 AL 2',
                                    text: 'DESARROLLO DEL MATERIAL PARA LA PRIMERA REVISIÓN PRESENCIAL',
                                    name: 'concepto2'
                                },
                                {
                                    value: '3',
                                    text: 'JUNTA PRESENCIAL/REMOTA PARA PRIMERA REVISIÓN DE LA PROPUESTA DE DISEÑO Y MODELO 3D',
                                    name: 'concepto3'
                                },
                                {
                                    value: '3 AL 4',
                                    text: 'DESARROLLO DEL PROYECTO',
                                    name: 'concepto4'
                                },
                                {
                                    value: '5',
                                    text: 'JUNTA PRESENCIAL/REMOTA PARA SEGUNDA REVISIÓN DE LA PROPUESTA DE DISEÑO ,MODELO 3D Y V.º B.º DE DISEÑO ',
                                    name: 'concepto5'
                                },
                                {
                                    value: '5 AL 6',
                                    text: 'DESARROLLO DEL PROYECTO',
                                    name: 'concepto6'
                                },
                                {
                                    value: '7',
                                    text: 'ENTREGA FINAL DEL PROYECTO DIGITAL',
                                    name: 'concepto7'
                                },
                            ]
                        }
                        form.conceptos = aux
                        form.construccion_interiores_inf = presupuesto.construccion_interiores_inf
                        form.construccion_interiores_sup = presupuesto.construccion_interiores_sup
                        form.mobiliario_inf = presupuesto.mobiliario_inf
                        form.mobiliario_sup = presupuesto.mobiliario_sup
                        form.construccion_civil_inf = presupuesto.construccion_civil_inf
                        form.construccion_civil_sup = presupuesto.construccion_civil_sup

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
                            ...this.state,
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
            ...this.state,
            options
        })
    }
    setPartidas = (partidas, value) => {
        let checkBoxPartida = []
        partidas.map((partida, key) => {
            checkBoxPartida.push({ checked: value, text: partida.nombre, id: partida.id })
            return false
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
                                        return false
                                    })
                                return false
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
                                        return false
                                    })
                                return false
                            })
                        }
                    }
                }
                this.setState({
                    ...this.state,
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
                return false
            })
            return false
        })
        form.tiempo_ejecucion_diseno = count
        this.setState({
            ...this.state,
            form
        })
    }
    // onChangeConceptos = (e, key) => {
    //     const { value, form } = e.target
    //     form.conceptos[key].value = value
    //     this.setState({
    //         ...this.state,
    //         form
    //     })
    // }
    onChangeConceptos = (e, key) => {
        const { value } = e.target
        const { form } = this.state
        form.conceptos[key].value = value
        this.setState({
            ...this.state,
            form
        })
    }
    // onChange = e => {
    //     const { name, value } = e.target
    //     const { form, data } = this.state
    //     form[name] = value
    //     if (name === 'esquema') {
    //         form.conceptos.map((concepto) => {
    //             if (concepto.name === 'concepto3') {
    //                 if (value === 'esquema_1')
    //                     concepto.text = 'JUNTA PRESENCIAL PARA PRIMERA REVISIÓN DE LA PROPUESTA DE DISEÑO'
    //                 if (value === 'esquema_2')
    //                     concepto.text = 'JUNTA PRESENCIAL PARA PRIMERA REVISIÓN DE LA PROPUESTA DE DISEÑO Y MODELO 3D'
    //                 if (value === 'esquema_3')
    //                     concepto.text = 'JUNTA PRESENCIAL PARA PRIMERA REVISIÓN DE LA PROPUESTA DE DISEÑO, MODELO 3D Y RENDERS'
    //             }
    //             if (concepto.name === 'concepto5') {
    //                 if (value === 'esquema_1')
    //                     concepto.text = 'JUNTA PRESENCIAL PARA SEGUNDA REVISIÓN DE LA PROPUESTA DE DISEÑO'
    //                 if (value === 'esquema_2')
    //                     concepto.text = 'JUNTA PRESENCIAL PARA SEGUNDA REVISIÓN DE LA PROPUESTA DE DISEÑO Y MODELO 3D'
    //                 if (value === 'esquema_3')
    //                     concepto.text = 'JUNTA PRESENCIAL PARA SEGUNDA REVISIÓN DE LA PROPUESTA DE DISEÑO, MODELO 3D Y RENDERS'
    //             }
    //             return false
    //         })
    //     }
    //     if (name === 'tiempo_ejecucion_diseno') {
    //         let modulo = parseFloat(value) % 6
    //         let aux = Object.keys(
    //             {
    //                 lunes: false,
    //                 martes: false,
    //                 miercoles: false,
    //                 jueves: false,
    //                 viernes: false,
    //                 sabado: false,
    //                 domingo: false
    //             }
    //         )
    //         form.semanas = [];
    //         for (let i = 0; i < Math.floor(parseFloat(value) / 6); i++) {
    //             form.semanas.push({
    //                 lunes: true,
    //                 martes: true,
    //                 miercoles: true,
    //                 jueves: true,
    //                 viernes: true,
    //                 sabado: true,
    //                 domingo: false
    //             })
    //         }
    //         form.semanas.push({
    //             lunes: false,
    //             martes: false,
    //             miercoles: false,
    //             jueves: false,
    //             viernes: false,
    //             sabado: false,
    //             domingo: false
    //         })
    //         aux.map((element, key) => {
    //             if (key < modulo) {
    //                 form.semanas[form.semanas.length - 1][element] = true
    //             } else {
    //                 form.semanas[form.semanas.length - 1][element] = false
    //             }
    //             return false
    //         })
    //         if (modulo > 2) {
    //             form.semanas.push({
    //                 lunes: false,
    //                 martes: false,
    //                 miercoles: false,
    //                 jueves: false,
    //                 viernes: false,
    //                 sabado: false,
    //                 domingo: false
    //             })
    //         }
    //     }
    //     if (name === 'esquema' || name === 'm2' || name === 'descuento') {
    //         data.precios.map((precio) => {
    //             if (precio.id.toString() === form.m2)
    //                 if (form.esquema)
    //                     if (form.descuento) {
    //                         form.total = precio[form.esquema] * (1 - (form.descuento / 100))
    //                     } else
    //                         form.total = precio[form.esquema]
    //             return false
    //         })
    //     }
    //     if (name === "empresa") {
    //         data.empresas.map((empresa) => {
    //             if (empresa.id.toString() === value && empresa.name === 'INEIN') {
    //                 form.tipo_partida = 'partidasInein'
    //             }
    //             if (empresa.id.toString() === value && empresa.name === 'INFRAESTRUCTURA MÉDICA') {
    //                 form.tipo_partida = 'partidasIm'
    //             }
    //             return false
    //         })
    //     }
    //     this.setState({
    //         ...this.state,
    //         form
    //     })
    // }
    onChange = e => {
        const { name, value, type, checked } = e.target
        const { form, data } = this.state
        form[name] = value
        if (name === 'esquema') {
            form.conceptos.map((concepto) => {
                switch(concepto.name){
                    case 'concepto1':
                        concepto.value = "1";
                        break;
                    case 'concepto2':
                        switch(value){
                            case 'esquema_1':
                                concepto.value = "1 al 2"
                                break;
                            case 'esquema_2':
                                concepto.value = "2 al 3"
                                break;
                            case 'esquema_3':
                                concepto.value = "2 al 4"
                                break;
                        }
                        break;
                    case 'concepto3':
                        switch(value){
                            case 'esquema_1':
                                concepto.value = "3"
                                break;
                            case 'esquema_2':
                                concepto.value = "4"
                                break;
                            case 'esquema_3':
                                concepto.value = "5"
                                break;
                        }
                        break;
                    case 'concepto4':
                        switch(value){
                            case 'esquema_1':
                                concepto.value = "3 al 4"
                                concepto.text = 'DESARROLLO DEL PROYECTO'
                                break;
                            case 'esquema_2':
                                concepto.value = "5 al 6"
                                concepto.text = 'DESARROLLO DEL PROYECTO'
                                break;
                            case 'esquema_3':
                                concepto.value = "6 al 9"
                                concepto.text = 'DESARROLLO DEL PROYECTO EJECUTIVO'
                                break;
                        }
                        break;
                    case 'concepto5':
                        switch(value){
                            case 'esquema_1':
                                concepto.value = "5"
                                break;
                            case 'esquema_2':
                                concepto.value = "7"
                                break;
                            case 'esquema_3':
                                concepto.value = "10"
                                break;
                        }
                        break;
                    case 'concepto6':
                        switch(value){
                            case 'esquema_1':
                                concepto.value = "5 al 6"
                                concepto.text = 'DESARROLLO DEL PROYECTO'
                                break;
                            case 'esquema_2':
                                concepto.value = "8 al 9"
                                concepto.text = 'DESARROLLO DEL PROYECTO'
                                break;
                            case 'esquema_3':
                                concepto.value = "11 al 14"
                                concepto.text = 'DESARROLLO DEL PROYECTO EJECUTIVO'
                                break;
                        }
                        break;
                    case 'concepto7':
                        switch(value){
                            case 'esquema_1':
                                concepto.value = "7"
                                concepto.text = 'ENTREGA FINAL DEL PROYECTO DIGITAL'
                                break;
                            case 'esquema_2':
                                concepto.value = "10"
                                concepto.text = 'ENTREGA FINAL DEL PROYECTO DIGITAL'
                                break;
                            case 'esquema_3':
                                concepto.value = "15"
                                concepto.text = 'ENTREGA FINAL DEL PROYECTO EJECUTIVO EN DIGITAL'
                                break;
                        }
                        break;
                    default: break;
                }
                return false
            })
        }
        if (type === 'checkbox')
            form[name] = checked
        else
            form[name] = value

        switch (name) {
            case 'construccion_interiores_inf':
            case 'construccion_interiores_sup':
            case 'construccion_civil_inf':
            case 'construccion_civil_sup':
            case 'mobiliario_inf':
            case 'mobiliario_sup':
                form[name] = value.replace(',', '')
                break
            default:
                break;
        }

        if (name === 'tiempo_ejecucion_diseno') {
            let modulo = parseFloat(value) % 5
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
            for (let i = 0; i < Math.floor(parseFloat(value) / 5); i++) {
                form.semanas.push({
                    lunes: true,
                    martes: true,
                    miercoles: true,
                    jueves: true,
                    viernes: true,
                    sabado: false,
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
                return false
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

        if (name === 'm2' || name === 'esquema')
            if (form.m2 && form.esquema) {
                form.subtotal = this.getSubtotal(form.m2, form.esquema)

            }
        if (form.subtotal > 0) {
            form.total = form.subtotal * (1 - (form.descuento / 100))
        }

        if (name === 'esquema') {
            let planos = []
            if (data.empresa)
                data.empresa.planos.map((plano) => {
                    if (plano[form.esquema])
                        planos.push(plano)
                })
            form.planos = this.setOptionsCheckboxes(planos, true)
        }

        this.setState({
            ...this.state,
            form
        })
    }

    getSubtotal = (m2, esquema) => {

        if (m2 === '')
            return 0.0

        const { data } = this.state

        let precio_inicial = 0
        let incremento = 0
        let aux = false
        let limiteInf = 0.0
        let limiteSup = 0.0
        let m2Aux = parseInt(m2)
        let acumulado = 0
        let total = 0

        if (data.empresa)
            precio_inicial = data.empresa.precio_inicial_diseño
        else {
            errorAlert('No fue posible calcular el total')
            return 0.0
        }

        if (data.empresa.variaciones.length === 0) {
            errorAlert('No fue posible calcular el total')
            return 0.0
        }

        switch (esquema) {
            case 'esquema_2':
                incremento = data.empresa.incremento_esquema_2 / 100;
                break
            case 'esquema_3':
                incremento = data.empresa.incremento_esquema_3 / 100;
                break
            default:
                incremento = 0
                break
        }

        data.empresa.variaciones.sort(function (a, b) {
            return parseInt(a.inferior) - parseInt(b.inferior)
        })

        limiteInf = parseInt(data.empresa.variaciones[0].inferior)
        limiteSup = parseInt(data.empresa.variaciones[data.empresa.variaciones.length - 1].superior)

        if (limiteInf <= m2Aux && limiteSup >= m2Aux) {
            data.empresa.variaciones.map((variacion, index) => {
                if (index === 0) {
                    acumulado = parseFloat(precio_inicial) - ((parseInt(m2) - parseInt(variacion.inferior)) * parseFloat(variacion.cambio))
                    if (m2Aux >= parseInt(variacion.superior))
                        acumulado = parseFloat(precio_inicial) - ((parseInt(variacion.superior) - parseInt(variacion.inferior)) * parseFloat(variacion.cambio))
                    if (m2Aux >= parseInt(variacion.inferior) && m2Aux <= parseInt(variacion.superior))
                        total = parseFloat(acumulado) * parseFloat(m2)
                } else {
                    if (m2Aux >= parseInt(variacion.superior))
                        acumulado = parseFloat(acumulado) - ((parseInt(variacion.superior) - parseInt(variacion.inferior) + 1) * parseFloat(variacion.cambio))
                    else {
                        acumulado = parseFloat(acumulado) - ((parseInt(m2) - parseInt(variacion.inferior) + 1) * parseFloat(variacion.cambio))
                    }
                    if (m2Aux >= parseInt(variacion.inferior) && m2Aux <= parseInt(variacion.superior))
                        total = parseFloat(acumulado) * parseFloat(m2)
                }
            })

            return total = total * (1 + incremento)
        }

        if (limiteSup < m2Aux) {
            errorAlert('Los m2 no están considerados en los límites')
            return 0.0
        }

    }
    setOptionsCheckboxes = (partidas, value) => {
        let checkBoxPartida = []
        partidas.map((partida, key) => {
            checkBoxPartida.push({ checked: value, text: partida.nombre, id: partida.id, tipo: partida.tipo })
            return false
        })
        return checkBoxPartida
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
    // handleChangeCheckbox = (array) => {
    //     const { form } = this.state
    //     form[form.tipo_partida] = array
    //     this.setState({
    //         ...this.state,
    //         form: form
    //     })
    // }

    handleChangeCheckbox = (array, type) => {
        const { form} = this.state
        form[type] = array
        this.setState({
            ...this.state,
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
                        <PresupuestoDisenoFormulario
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