import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../constants'
import { setSelectOptions } from '../../functions/setters'
import { waitAlert, errorAlert, forbiddenAccessAlert, doneAlert, questionAlert, errorAdjuntos, deleteAlertSA2Parametro, createAlertSA2Parametro } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Card, Nav, Tab } from 'react-bootstrap'
import { DiseñoForm, ObraForm } from '../../components/forms'
import { Button } from '../../components/form-components'
import { Line } from 'react-chartjs-2';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"
import ItemSlider from '../../components/singles/ItemSlider'
import InputSinText from '../../components/form-components/SinText/InputSinText'
import Input from '../../components/form-components/Input'

class Contabilidad extends Component {

    state = {
        
        title: 'Diseño',
        empresas: {
            precio_inicial_diseño: '',
            incremento_esquema_2: '',
            incremento_esquema_3: '',
            variaciones: [{
                inferior: '',
                superior: '',
                cambio: ''
            }]
        },
        options: {
            empresas: []
        },
        form: {
            m2: '',
            precio_inicial_diseño: '',
            incremento_esquema_2: '',
            incremento_esquema_3: '',
            precio_esquema_1: '-',
            precio_esquema_2: '-',
            precio_esquema_3: '-',
            empresa: 'inein',
            variaciones: [{
                inferior: '',
                superior: '',
                cambio: ''
            }],
            tipos: [],
            adjuntos: {
                subportafolio: {
                    value: '',
                    placeholder: 'Subportafolio',
                    files: []
                },
                ejemplo: {
                    value: '',
                    placeholder: 'Ejemplo',
                    files: []
                },
                portada: {
                    value: '',
                    placeholder: 'Portada',
                    files: []
                }
            },
            esquema_1:[],
            esquema_2:[],
            esquema_3:[],
        },
        data: {
            empresas: []
        },
        formeditado: 0,
        empresa: '',
        activeTipo: ''
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const diseño = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!diseño)
            history.push('/')
        this.getDiseñoAxios()
    }

    async getDiseñoAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'empresa/tabulador', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas } = response.data
                let { activeTipo } = response.data
                const { options, data, form } = this.state
                let { empresa, grafica } = this.state
                data.empresas = empresas
                options.empresas = setSelectOptions(empresas, 'name')
                if (empresas) {
                    if (empresas.length) {
                        empresa = empresas[0]

                        if(empresas[0].tipos.length){
                            activeTipo = empresas[0].tipos[0].id
                            let auxSub = []
                            let auxEj = []
                            let auxPortada = []
                            empresas[0].tipos[0].adjuntos.map((adjunto)=>{
                                if(adjunto.pivot.tipo === 'subportafolio')
                                    auxSub.push(adjunto)
                                if(adjunto.pivot.tipo === 'ejemplo')
                                    auxEj.push(adjunto)
                                if(adjunto.pivot.tipo === 'portada')
                                    auxPortada.push(adjunto)
                            })
                            form.adjuntos.ejemplo.files = auxEj
                            form.adjuntos.subportafolio.files = auxSub
                            form.adjuntos.portada.files = auxPortada
                            
                        }

                        form.precio_inicial_diseño = empresa.precio_inicial_diseño
                        form.incremento_esquema_2 = empresa.incremento_esquema_2
                        form.incremento_esquema_3 = empresa.incremento_esquema_3

                        empresa.variaciones.map((variacion, index) => {
                            this.onChangeVariaciones(index, { target: { value: variacion.superior } }, 'superior')
                            this.onChangeVariaciones(index, { target: { value: variacion.inferior } }, 'inferior')
                            this.onChangeVariaciones(index, { target: { value: variacion.cambio } }, 'cambio')
                        })

                        let aux = []
                        empresa.tipos.map((tipo) => {
                            aux.push({
                                name: tipo.tipo,
                                id: tipo.id,
                                parametricos: {
                                    construccion_civil_inf: tipo.construccion_civil_inf,
                                    construccion_civil_sup: tipo.construccion_civil_sup,
                                    construccion_interiores_inf: tipo.construccion_interiores_inf,
                                    construccion_interiores_sup: tipo.construccion_interiores_sup,
                                    mobiliario_inf: tipo.mobiliario_inf,
                                    mobiliario_sup: tipo.mobiliario_sup
                                }
                            })
                        })
                        form.tipos = aux

                        let auxEsquema1 = []
                        let auxEsquema2 = []
                        let auxEsquema3 = []

                        empresas[0].planos.map((plano) => {
                            if(plano.esquema_1)
                                auxEsquema1.push(plano)
                            if(plano.esquema_2)
                                auxEsquema2.push(plano)
                            if(plano.esquema_3)
                                auxEsquema3.push(plano)
                        })
                        
                        auxEsquema1.push({id: '', nombre: ''})
                        auxEsquema2.push({id: '', nombre: ''})
                        auxEsquema3.push({id: '', nombre: '', tipo: ''})

                        form.esquema_1 = auxEsquema1
                        form.esquema_2 = auxEsquema2
                        form.esquema_3 = auxEsquema3

                        grafica = this.setGrafica(empresa)
                    }
                }
                this.setState({
                    ...this.state,
                    options,
                    data,
                    empresa,
                    form,
                    grafica,
                    activeTipo
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

    async getSingleDiseño(id) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'empresa/tabulador/one/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresa } = response.data
                let { activeTipo } = response.data
                const { options, data, form } = this.state
                let { grafica } = this.state
                if (empresa) {
                    if(empresa.tipos.length){
                        activeTipo = empresa.tipos[0].id
                        let auxSub = []
                        let auxEj = []
                        let auxPortada = []
                        empresa.tipos[0].adjuntos.map((adjunto)=>{
                            if(adjunto.pivot.tipo === 'subportafolio')
                                auxSub.push(adjunto)
                            if(adjunto.pivot.tipo === 'ejemplo')
                                auxEj.push(adjunto)
                            if(adjunto.pivot.tipo === 'portada')
                                auxPortada.push(adjunto)
                        })
                        form.adjuntos.ejemplo.files = auxEj
                        form.adjuntos.subportafolio.files = auxSub
                        form.adjuntos.portada.files = auxPortada
                            
                    }

                    form.precio_inicial_diseño = empresa.precio_inicial_diseño
                    form.incremento_esquema_2 = empresa.incremento_esquema_2
                    form.incremento_esquema_3 = empresa.incremento_esquema_3

                    empresa.variaciones.map((variacion, index) => {
                        this.onChangeVariaciones(index, { target: { value: variacion.superior } }, 'superior')
                        this.onChangeVariaciones(index, { target: { value: variacion.inferior } }, 'inferior')
                        this.onChangeVariaciones(index, { target: { value: variacion.cambio } }, 'cambio')
                    })

                    let aux = []

                    empresa.tipos.map((tipo) => {
                        aux.push({
                            name: tipo.tipo,
                            id: tipo.id,
                            parametricos: {
                                construccion_civil_inf: tipo.construccion_civil_inf,
                                construccion_civil_sup: tipo.construccion_civil_sup,
                                construccion_interiores_inf: tipo.construccion_interiores_inf,
                                construccion_interiores_sup: tipo.construccion_interiores_sup,
                                mobiliario_inf: tipo.mobiliario_inf,
                                mobiliario_sup: tipo.mobiliario_sup
                            }
                        })
                    })
                    form.tipos = aux

                    let auxEsquema1 = []
                    let auxEsquema2 = []
                    let auxEsquema3 = []

                    empresa.planos.map((plano) => {
                        if(plano.esquema_1)
                            auxEsquema1.push(plano)
                        if(plano.esquema_2)
                            auxEsquema2.push(plano)
                        if(plano.esquema_3)
                            auxEsquema3.push(plano)
                    })
                
                    auxEsquema1.push({id: '', nombre: ''})
                    auxEsquema2.push({id: '', nombre: ''})
                    auxEsquema3.push({id: '', nombre: '', tipo: ''})

                    form.esquema_1 = auxEsquema1
                    form.esquema_2 = auxEsquema2
                    form.esquema_3 = auxEsquema3

                    grafica = this.setGrafica(empresa)
                }
                
                this.setState({
                    ...this.state,
                    options,
                    data,
                    empresa,
                    form,
                    grafica,
                    activeTipo
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

    handleChange = (files, item) => {
        const { form } = this.state
        this.onChangeAdjuntos({ target: { name: item, value: files, files: files } })
        if(form.adjuntos[item].value !== '')
            questionAlert('ENVIAR ARCHIVO', '¿ESTÁS SEGURO QUE DESEAS ENVIARLO?', () => { waitAlert(); this.addAdjunto(item) })
    }

    onChangeAdjuntos = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        let aux2 = []
        let size = 0
        for (let counter = 0; counter < files.length; counter++) {
            size = files[counter].size;
            size = size / (Math.pow(2, 20))
            if(size <= 2)
                aux.push(
                    {
                        name: files[counter].name,
                        file: files[counter],
                        url: URL.createObjectURL(files[counter]),
                        key: counter
                    }
                )
            else
                aux2.push(files[counter].name)
        }
        // if(aux2.length){
        //     let html = '<ul style="padding-left: 20px;">'
        //     aux2.map((element)=>{
        //         html += '<li>' + '<div class="mb-2">'+ element +'</div>' + '</li>'
        //     })
        //     html += '</ul>'
        //     errorAdjuntos(
        //         'OCURRIÓ UN ERROR',
        //         'LOS SIGUIENTES ARCHIVOS NO SE PUDIERON ADJUNTAR, PESAN MÁS DE 2M',
        //         html
        //     )
        //     form['adjuntos'][name].value = ''
        // }
        if(aux2.length){
            let html = ''
            aux2.map((element)=>{
                html += '<div class="mb-2 text-dark-50">'+ '&bull;&nbsp;'+element +'<br/>'+'</div>'
            })
            // html
            errorAdjuntos(
                'OCURRIÓ UN ERROR',
                'LOS SIGUIENTES ARCHIVOS NO SE PUDIERON ADJUNTAR, PESAN MÁS DE 2M',
                html
            )
            form['adjuntos'][name].value = ''
        }else{
            form['adjuntos'][name].value = value
            form['adjuntos'][name].files = aux
        }

        this.setState({
            ...this.state,
            form
        })
    }

    async addAdjunto(name){
        
        const { access_token } = this.props.authUser
        const { activeTipo, empresa, form } = this.state

        let data = new FormData();
        data.append('tipo', name)
        let aux = Object.keys(form.adjuntos)
        
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
            return false
        })

        await axios.post(URL_DEV + 'empresa/' + empresa.id + '/proyecto/' + activeTipo + '/adjuntos', data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas } = response.data
                let { empresa } = this.state
                const { activeTipo, form } = this.state
                empresas.map((element)=>{
                    if(element.id === empresa.id){
                        empresa = element
                    }
                })
                let arregloAuxiliar = []
                empresa.tipos.map((element)=>{
                    if(element.id.toString() === activeTipo.toString()){
                        element.adjuntos.map((adjunto)=>{
                            if(adjunto.pivot.tipo === name)
                                arregloAuxiliar.push(adjunto)
                        })
                    }
                })
                form.adjuntos[name].files = arregloAuxiliar

                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito')
                this.setState({
                    ...this.state,
                    empresa,
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

    onSubmit = async (e) => {
        e.preventDefault()
        waitAlert()
        const { access_token } = this.props.authUser
        const { empresa, form } = this.state
        await axios.post(`${URL_DEV}empresa/${empresa.id}/tabulador/diseño`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Datos actualizados con éxito')
                this.getDiseñoAxios()
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

    onSubmitObra = async (e) => {
        e.preventDefault()
        waitAlert()
        const { access_token } = this.props.authUser
        const { empresa, form } = this.state
        await axios.post(`${URL_DEV}empresa/${empresa.id}/tabulador/obra`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                // const { empresa: { respuesta } } = response.data
                this.setState({
                    ...this.state,
                    empresa: ''
                })
                doneAlert('Datos actualizados con éxito')
                this.getDiseñoAxios()
                /*  */
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

    onChange = e => {
        let { name, value } = e.target
        const { form } = this.state
        let { grafica } = this.state
        if (name === 'incremento_esquema_2' || name === 'incremento_esquema_3')
            value = value.replace('%', '')
        form[name] = value
        form.precio_esquema_1 = this.getPrecioEsquemas(form, form.m2)
        form.precio_esquema_2 = form.precio_esquema_1 === '-' ? '-' : form.precio_esquema_1 * (1 + (form.incremento_esquema_2 / 100))
        form.precio_esquema_3 = form.precio_esquema_1 === '-' ? '-' : form.precio_esquema_1 * (1 + (form.incremento_esquema_3 / 100))
        if (name === 'precio_inicial_diseño' || name === 'incremento_esquema_2' || name === 'incremento_esquema_3')
            if (form.precio_inicial_diseño !== '' && form.incremento_esquema_2 !== '' && form.incremento_esquema_3 !== '')
                grafica = this.setGrafica(form)
        this.setState({
            ...this.state,
            form,
            grafica
        })
    }

    onChangeVariaciones = (key, e, name) => {
        let { value } = e.target
        let { form, grafica } = this.state
        if (key === form.variaciones.length) {
            this.addRow()
        }
        if (name === 'cambio')
            value = parseFloat(value)
        if (name === 'inferior' || name === 'superior')
            value = parseInt(value)
        form.variaciones[key][name] = value
        form.precio_esquema_1 = this.getPrecioEsquemas(form, form.m2)
        form.precio_esquema_2 = form.precio_esquema_1 === '-' ? '-' : form.precio_esquema_1 * (1 + (form.incremento_esquema_2 / 100))
        form.precio_esquema_3 = form.precio_esquema_1 === '-' ? '-' : form.precio_esquema_1 * (1 + (form.incremento_esquema_3 / 100))

        let aux = true
        form.variaciones.map((variacion) => {
            if (variacion.superior === '' || variacion.inferior === '' || variacion.cambio === '' || variacion.cambio === 0 ||
                variacion.cambio === '0.' || variacion.cambio === '.' || variacion.superior < variacion.inferior) {
                aux = false
            }
        })

        if (aux) {
            grafica = this.setGrafica(form)
        }

        this.setState({
            ...this.state,
            form,
            grafica
        })
    }

    addRow = () => {
        const { form } = this.state
        let aux = true
        let arreglo = []
        form.variaciones.map((variacion, index) => {
            if (variacion.inferior === '' || variacion.superior === '' || variacion.cambio === '' ||
                variacion.inferior === null || variacion.superior === null || variacion.cambio === null) {
                aux = false
            } else
                if (parseInt(variacion.inferior) >= parseInt(variacion.superior)) {
                    variacion.inferior = null
                    variacion.superior = null
                    aux = false
                }
            arreglo.push(variacion)
        })
        if (aux) {
            form.variaciones = arreglo
            form.variaciones.push(
                {
                    inferior: '',
                    superior: '',
                    cambio: ''
                }
            )
        } else {
            form.variaciones = arreglo
        }
        this.setState({
            ...this.state,
            form
        })
    }

    addParametricRow = () => {
        const { form } = this.state
        let aux = true
        let arreglo = form.tipos
        form.tipos.map((tipo) => {
            if (tipo.name === '')
                aux = false
        })
        if (aux) {
            arreglo.push({
                id: '',
                name: '',
                parametricos: {
                    construccion_civil_inf: 0,
                    construccion_civil_sup: 0,
                    construccion_interiores_inf: 0,
                    construccion_interiores_sup: 0,
                    mobiliario_inf: 0,
                    mobiliario_sup: 0
                }
            })
            form.tipos = arreglo
            this.setState({
                ...this.state,
                form
            })
        }
    }

    deleteRow = () => {
        const { form } = this.state
        let { grafica } = this.state

        form.variaciones.pop()

        if (form.variaciones.length === 0) {
            grafica = ''
            form.variaciones = [{ superior: '', inferior: '', cambio: '' }]
        }
        else
            grafica = this.setGrafica(form)

        this.setState({
            ...this.state,
            form,
            grafica
        })
    }

    changeActiveKey = empresa => {

        this.setState({
            empresa: empresa
        })

        this.getSingleDiseño(empresa.id)
    }

    setGrafica = empresa => {
        const { form } = this.state
        if (empresa.variaciones.length) {
            let labels = []
            let data = []
            let aux = empresa.variaciones
            let limiteInf = aux[0].inferior
            let limiteSup = aux[aux.length - 1].superior
            for (let i = 0; i <= 39; i++) {
                let limite = (limiteInf + (i * (limiteSup - limiteInf) / 40))
                limite = parseInt(parseFloat(limite).toFixed(2))
                labels.push(limite)
                data.push(this.getPrecioEsquemas(form, limite))
            }
            labels.push(limiteSup)
            data.push(this.getPrecioEsquemas(form, limiteSup))
            return {
                labels: labels,
                datasets: [
                    {
                        label: '',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: '#d8005a',
                        borderColor: '#d8005a',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: '#444',
                        pointBackgroundColor: '#444',
                        pointBorderWidth: 10,
                        pointHoverRadius: 10,
                        pointHoverBackgroundColor: '#444',
                        pointHoverBorderColor: '#444',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 5,
                        data: data
                    }
                ]
            };
        }
        return ''
    }

    getPrecioEsquemas = (form, m2) => {
        let aux = true
        let auxilar = []
        if (m2 !== '' && form.precio_inicial_diseño !== '') {
            form.variaciones.map((variacion) => {
                if (!(variacion.inferior !== null && variacion.inferior !== '' &&
                    variacion.superior !== null && variacion.superior !== '' &&
                    variacion.cambio !== ''))
                    aux = false
            })
            if (aux) {
                auxilar = form.variaciones
                auxilar = auxilar.sort(function (a, b) {
                    return parseInt(a.inferior) - parseInt(b.inferior);
                });
                if (auxilar.length) {
                    let limiteInf = parseInt(auxilar[0].inferior)
                    let limiteSup = parseInt(auxilar[auxilar.length - 1].superior)
                    let m2Aux = parseInt(m2)
                    if (limiteInf <= m2Aux && limiteSup >= m2Aux) {
                        let acumulado = 0;
                        let total;
                        auxilar.map((variacion, index) => {
                            if (index === 0) {
                                acumulado = parseFloat(form.precio_inicial_diseño) - ((parseInt(m2) - parseInt(variacion.inferior)) * parseFloat(variacion.cambio))
                                if (m2Aux >= parseInt(variacion.superior))
                                    acumulado = parseFloat(form.precio_inicial_diseño) - ((parseInt(variacion.superior) - parseInt(variacion.inferior)) * parseFloat(variacion.cambio))
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
                        return total
                    } else return '-'
                } else return '-'
            }
        } else
            aux = false
        return '-'
    }

    updateAdjuntosTab = select => {
        const { empresa, form } = this.state
        let aux = ''
        empresa.tipos.map((tipo)=>{
            if(tipo.id.toString() === select.toString())
                aux = tipo
        })
        if(aux !== ''){

            let auxSubportafolios = []
            let auxEjemplos = []
            let auxPortadas = []

            aux.adjuntos.map((adjunto)=>{
                if(adjunto.pivot.tipo === 'subportafolio')
                    auxSubportafolios.push(adjunto)
                if(adjunto.pivot.tipo === 'ejemplo')
                    auxEjemplos.push(adjunto)
                if(adjunto.pivot.tipo === 'portada')
                    auxPortadas.push(adjunto)
            })

            form.adjuntos.ejemplo.files = auxEjemplos
            form.adjuntos.subportafolio.files = auxSubportafolios
            form.adjuntos.portada.files = auxPortadas
            
            this.setState({
                ...this.state,
                activeTipo: aux.id,
                form
            })
        }
    }

    handleChangePlanos = (esquema, e, key) => {
        const { name, value } = e.target
        let { form } = this.state
        form[esquema][key][name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    sendPlano = (esquema, key) => {
        const { form } = this.state
        if(form[esquema][key].nombre !== '')
            if(esquema === 'esquema_3')
                if(form[esquema][key].tipo !== '')
                    createAlertSA2Parametro(
                        '¿CONFIRMAS EL ENVÍO DE INFORMACIÓN?', '', this.sendPlanoAxios, {esquema: esquema, value: form[esquema][key]}
                    )
                else
                    errorAlert('NO LLENASTE TODOS LOS CAMPOS')
            else
                createAlertSA2Parametro(
                    '¿CONFIRMAS EL ENVÍO DE INFORMACIÓN?', '', this.sendPlanoAxios, {esquema: esquema, value: form[esquema][key]}
                )
        else
            errorAlert('NO LLENASTE TODOS LOS CAMPOS')   
    }

    sendPlanoAxios = async(datos) => {

        const { access_token } = this.props.authUser
        const { empresa } = this.state

        await axios.post(URL_DEV + 'empresa/' + empresa.id + '/plano/' + datos.esquema, datos.value, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresa } = response.data

                this.getSingleDiseño(empresa.id)
                doneAlert('Plano agregado con éxito')

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

    deletePlano = id => {
        deleteAlertSA2Parametro('¿ESTÁS SEGURO QUE DESEAS ELIMINAR EL PLANO?', 'ESTA ACCIÓN NO PODRÁ SER REVERTIDA',
            this.deletePlanoAxios, {id: id})
    }

    deletePlanoAxios = async(data) => {
        const { access_token } = this.props.authUser
        const { empresa } = this.state

        await axios.delete(URL_DEV + 'empresa/' + empresa.id + '/planos/' + data.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresa } = response.data

                this.getSingleDiseño(empresa.id)
                doneAlert('Plano eliminado con éxito')

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

    render() {
        const { form, empresa, data, grafica, activeTipo } = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <Tab.Container activeKey={empresa !== '' ? empresa.id : ''} >
                    <Card className="card-custom">
                        <Card.Header className="align-items-center border-0">
                            <div className="card-title">
                                <h3 className="card-label">Tabulador</h3>
                            </div>
                            <div className="card-toolbar">
                                <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0">
                                    {
                                        data.empresas.map((empresa, index) => {
                                            return (
                                                <Nav.Item key={index} className="nav-item" onClick={(e) => { e.preventDefault(); this.changeActiveKey(empresa) }} >
                                                    <Nav.Link eventKey={empresa.id}>{empresa.name}</Nav.Link>
                                                </Nav.Item>
                                            )
                                        })
                                    }
                                </Nav>
                            </div>
                        </Card.Header>
                        <Card.Body className="pt-2">
                            <Tab.Container defaultActiveKey="planos">
                                <Nav className="nav nav-tabs nav-tabs-space-lg nav-tabs-line nav-bold nav-tabs-line-3x border-0">
                                    <Nav.Item className="nav-item">
                                        <Nav.Link className="nav-link" eventKey="diseño">
                                            <span className="nav-icon mr-2">
                                                <span className="svg-icon mr-3">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Pen-tool-vector.svg')} />
                                                </span>
                                            </span>
                                            <span className="nav-text">Diseño</span>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="nav-item mr-3">
                                        <Nav.Link eventKey="obra">
                                            <span className="nav-icon mr-2">
                                                <span className="svg-icon mr-3">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Road-Cone.svg')} />
                                                </span>
                                            </span>
                                            <span className="nav-text">Obra</span>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="nav-item mr-3">
                                        <Nav.Link eventKey="adjuntos">
                                            <span className="nav-icon mr-2">
                                                <span className="svg-icon mr-3">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Attachment1.svg')} />
                                                </span>
                                            </span>
                                            <span className="nav-text">Adjuntos</span>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="nav-item mr-3">
                                        <Nav.Link eventKey="planos">
                                            <span className="nav-icon mr-2">
                                                <span className="svg-icon mr-3">
                                                    <SVG src={toAbsoluteUrl('/images/svg/highvoltage.svg')} />
                                                </span>
                                            </span>
                                            <span className="nav-text">Planos</span>
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className="py-5">
                                    <Tab.Pane eventKey="diseño">
                                        <DiseñoForm
                                            form={form}
                                            onChange={this.onChange}
                                            onSubmit={this.onSubmit}
                                            addRow={this.addRow}
                                            deleteRow={this.deleteRow}
                                            onChangeVariaciones={this.onChangeVariaciones}
                                        />
                                        {
                                            grafica !== '' ?
                                                <div className="row mx-0 justify-content-center p-3">
                                                    <div className="col-md-8">
                                                        <Line data={grafica} />
                                                    </div>
                                                </div>
                                                : <></>
                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="obra">
                                        <ObraForm
                                            form={form}
                                            onChange={this.onChange}
                                            onSubmit={this.onSubmitObra}
                                            addRow={this.addParametricRow}
                                        />
                                    </Tab.Pane>
                                    {
                                        empresa ?
                                            <Tab.Pane eventKey="adjuntos">
                                                <Tab.Container activeKey = { activeTipo } 
                                                    onSelect={(select) => { this.updateAdjuntosTab(select) }}>
                                                    <div className='row mx-0'>
                                                        <div className='col-md-2 navi navi-accent navi-hover navi-bold border-nav'>
                                                            <Nav variant="pills" className="flex-column navi navi-hover navi-active">
                                                                {
                                                                    empresa.tipos.map((tipo, key)=>{
                                                                        return(
                                                                            <Nav.Item className='navi-item' key = { key } >
                                                                                <Nav.Link className="navi-link" eventKey={tipo.id}>
                                                                                    <span className="navi-text">{tipo.tipo}</span>
                                                                                </Nav.Link>
                                                                            </Nav.Item>
                                                                        )
                                                                    })
                                                                }
                                                            </Nav>
                                                        </div>
                                                        <div className='col-md-10'>
                                                            <div className='row mx-0 justify-content-center'>
                                                                <div className='col-md-6 mb-3'>
                                                                    <div className="text-dark-65 text-center pb-2 pt-2 font-weight-bolder">
                                                                        Subportafolio
                                                                    </div>
                                                                    <ItemSlider item = 'subportafolio' items = { form.adjuntos.subportafolio.files } 
                                                                        handleChange = { this.handleChange } />
                                                                </div>
                                                                <div className='col-md-6 mb-3'>
                                                                    <div className="text-dark-65 text-center pb-2 pt-2 font-weight-bolder">
                                                                        Ejemplos
                                                                    </div>
                                                                    <ItemSlider item = 'ejemplo' items = { form.adjuntos.ejemplo.files }
                                                                        handleChange = { this.handleChange } />
                                                                </div>
                                                                <div className='col-md-6 mb-3'>
                                                                    <div className="text-dark-65 text-center pb-2 pt-2 font-weight-bolder">
                                                                        Portada
                                                                    </div>
                                                                    <ItemSlider item = 'portada' items = { form.adjuntos.portada.files }
                                                                        handleChange = { this.handleChange } />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tab.Container>
                                            </Tab.Pane>
                                        : ''
                                    }
                                    
                                    {
                                        empresa ?
                                            <Tab.Pane eventKey="planos">
                                                <div className = 'row mx-0'>
                                                    <div className = 'col-md-4 mb-4'>
                                                        <Card className="border-0">
                                                            <Card.Header className="p-3 border-0 bg-light">
                                                                <div class="card-label text-dark font-size-h6 font-weight-bold text-center">ESQUEMA 1</div>
                                                            </Card.Header>
                                                            <Card.Body className='py-0 px-3' style={{border:"3px solid #F3F6F9"}} >
                                                                <div className="pt-2">
                                                                    {
                                                                        form.esquema_1.map((plano, key) => {
                                                                            return(
                                                                                <div className = { plano.id !== '' ? 'row borderBottom mx-0 py-2 ' : 'row mx-0 py-2'} key = { key } >
                                                                                    {
                                                                                        plano.id !== '' ?
                                                                                            <div className='col-1 px-1 change-col-2'>
                                                                                                <Button
                                                                                                    icon = ''
                                                                                                    onClick = { () => { this.deletePlano(plano.id) } } 
                                                                                                    className = "btn btn-icon btn-light-danger btn-xs mr-2"
                                                                                                    only_icon = "flaticon2-delete icon-xs"
                                                                                                    tooltip={{text:'ELIMINAR'}}
                                                                                                />
                                                                                            </div>
                                                                                        : ''
                                                                                    }   
                                                                                    <div className={plano.id !== '' ? 'col-11 w-100 px-2 align-self-center text-justify change-col-10' : 'col-11 w-100 px-2 align-self-center text-justify change-col-10'}>
                                                                                        {
                                                                                            plano.id !== '' ?
                                                                                                <span className="text-dark font-weight-bold font-size-lg">{plano.nombre}</span>
                                                                                            :
                                                                                                <InputSinText
                                                                                                    name = 'nombre'
                                                                                                    placeholder = 'PLANO'
                                                                                                    requireValidation = { 1 }
                                                                                                    value = { plano.nombre }
                                                                                                    onChange = { (e) => { this.handleChangePlanos('esquema_1', e, key) }}
                                                                                                    customclass="border-top-0 border-left-0 border-right-0 rounded-0 text-center pl-0 w-100"
                                                                                                />
                                                                                        }
                                                                                    </div>
                                                                                    {
                                                                                        plano.id !== '' ? 
                                                                                            ''
                                                                                        :
                                                                                            <div className='col-1 text-center d-flex align-items-end justify-content-center'>
                                                                                                <Button
                                                                                                    icon = ''
                                                                                                    onClick = { () => { this.sendPlano('esquema_1', key) } } 
                                                                                                    className = "btn btn-icon btn-light-success btn-xs px-2"
                                                                                                    only_icon = "fas fa-plus icon-xs"
                                                                                                    tooltip={{text:'ENVIAR'}}/>
                                                                                            </div>
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                    <div className = 'col-md-4 mb-4'>
                                                        <Card className="border-0">
                                                            <Card.Header className="p-3 border-0 bg-light">
                                                                <div class="card-label text-dark font-size-h6 font-weight-bold text-center">ESQUEMA 2</div>
                                                            </Card.Header>
                                                            <Card.Body className='py-0 px-3' style={{border:"3px solid #F3F6F9"}}>
                                                            <div className="pt-2">
                                                                    {
                                                                        form.esquema_2.map((plano, key) => {
                                                                            return(
                                                                                <div className = { plano.id !== '' ? 'row borderBottom mx-0 py-2' : 'row mx-0 py-2'} key = { key } >
                                                                                    {
                                                                                        plano.id !== '' ?
                                                                                            <div className='col-1 px-1 change-col-2 '>
                                                                                                <Button
                                                                                                    icon = ''
                                                                                                    onClick = { () => { this.deletePlano(plano.id) } } 
                                                                                                    className = "btn btn-icon btn-light-danger btn-xs mr-2"
                                                                                                    only_icon = "flaticon2-delete icon-xs"
                                                                                                    tooltip={{text:'ELIMINAR'}}
                                                                                                />
                                                                                        </div> : ''
                                                                                    } 
                                                                                    <div className={plano.id !== '' ? 'col-11 w-100 px-2 align-self-center text-justify change-col-10 ' : 'col-11 w-100 px-2 align-self-center text-justify change-col-10'}>
                                                                                        {
                                                                                            plano.id !== '' ?
                                                                                                <span className="text-dark font-weight-bold font-size-lg">{plano.nombre}</span>
                                                                                            :
                                                                                                <InputSinText
                                                                                                    name = 'nombre'
                                                                                                    placeholder = 'PLANO'
                                                                                                    requireValidation = { 1 }
                                                                                                    value = { plano.nombre }
                                                                                                    onChange = { (e) => { this.handleChangePlanos('esquema_2', e, key) }}
                                                                                                    customclass="border-top-0 border-left-0 border-right-0 rounded-0 text-center pl-0 w-100" 
                                                                                                />
                                                                                        }
                                                                                    </div>
                                                                                    {
                                                                                        plano.id !== '' ? 
                                                                                            ''
                                                                                        :
                                                                                            <div className='col-1 text-center d-flex align-items-end justify-content-center'>
                                                                                                <Button
                                                                                                    icon = ''
                                                                                                    onClick = { () => { this.sendPlano('esquema_2', key) } } 
                                                                                                    className = "btn btn-icon btn-light-success btn-xs px-2"
                                                                                                    only_icon = "fas fa-plus icon-xs"
                                                                                                    tooltip={{text:'ENVIAR'}}/>
                                                                                            </div>
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                    <div className = 'col-md-4 mb-4'>
                                                        <Card className="border-0">
                                                            <Card.Header className="p-3 border-0 bg-light">
                                                            <div class="card-label text-dark font-size-h6 font-weight-bold text-center">ESQUEMA 3</div>
                                                            </Card.Header>
                                                            <Card.Body className='py-0 px-3' style={{border:"3px solid #F3F6F9"}}>
                                                                <div className="pt-2">
                                                                    {
                                                                        form.esquema_3.map((plano, key) => {
                                                                            return(
                                                                                <>
                                                                                    {
                                                                                        form.esquema_3.length === 0 ? plano.tipo : ''
                                                                                    }
                                                                                    <div className="text-muted font-weight-bolder my-3">
                                                                                        {
                                                                                            key === 0 ? plano.tipo : 
                                                                                                plano.tipo !== form.esquema_3[key - 1].tipo ? plano.tipo : ''
                                                                                        }
                                                                                    </div>
                                                                                    <div className = { plano.id !== '' ? 'row borderBottom mx-0 py-2' : 'row mx-0 py-2'} key = { key } >
                                                                                            {
                                                                                                plano.id !== '' ?
                                                                                                    <div className='col-1 px-1 change-col-2 '>
                                                                                                        <Button
                                                                                                            icon = ''
                                                                                                            onClick = { () => { this.deletePlano(plano.id) } } 
                                                                                                            className = "btn btn-icon btn-light-danger btn-xs mr-2"
                                                                                                            only_icon = "flaticon2-delete icon-xs"
                                                                                                            tooltip={{text:'Eliminar'}}
                                                                                                        />
                                                                                                    </div>
                                                                                                : ''
                                                                                            }
                                                                                        <div className={plano.id !== '' ? ' ': 'col-5 w-100 align-self-center text-justify'}>
                                                                                            {
                                                                                                plano.id !== '' ?
                                                                                                    ''
                                                                                                :
                                                                                                    <InputSinText
                                                                                                        name = 'tipo'
                                                                                                        placeholder = 'TIPO'
                                                                                                        requireValidation = { 1 }
                                                                                                        value = { plano.tipo }
                                                                                                        onChange = { (e) => { this.handleChangePlanos('esquema_3', e, key) }}
                                                                                                        customclass="border-top-0 border-left-0 border-right-0 rounded-0 text-center pl-0 w-100" 
                                                                                                    />
                                                                                            }
                                                                                        </div>
                                                                                        <div className={plano.id !== '' ? 'col-10 w-100 px-2 align-self-center text-justify change-col-10' : 'col-5 w-100 align-self-center text-justify'}>
                                                                                            {
                                                                                                plano.id !== '' ?
                                                                                                    <span className="text-dark font-weight-bold font-size-lg">{plano.nombre}</span>
                                                                                                :
                                                                                                    <InputSinText
                                                                                                        name = 'nombre'
                                                                                                        placeholder = 'PLANO'
                                                                                                        requireValidation = { 1 }
                                                                                                        value = { plano.nombre }
                                                                                                        onChange = { (e) => { this.handleChangePlanos('esquema_3', e, key) }}
                                                                                                        customclass="border-top-0 border-left-0 border-right-0 rounded-0 text-center pl-0 w-100" 
                                                                                                    />
                                                                                            }
                                                                                        </div>
                                                                                        {
                                                                                            plano.id !== '' ? 
                                                                                                ''
                                                                                            :
                                                                                                <div className='col-2 text-center d-flex align-items-end justify-content-center'>
                                                                                                    <Button
                                                                                                        icon = ''
                                                                                                        onClick = { () => { this.sendPlano('esquema_3', key) } } 
                                                                                                        className = "btn btn-icon btn-light-success btn-xs mr-2 px-2"
                                                                                                        only_icon = "fas fa-plus icon-xs"
                                                                                                        tooltip={{text:'ENVIAR'}}/>
                                                                                                </div>
                                                                                        }
                                                                                    </div>
                                                                                </>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                </div>
                                            </Tab.Pane>
                                        : ''
                                    }
                                </Tab.Content>
                            </Tab.Container>
                            
                        </Card.Body>
                    </Card>
                </Tab.Container>
            </Layout >
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

export default connect(mapStateToProps, mapDispatchToProps)(Contabilidad);