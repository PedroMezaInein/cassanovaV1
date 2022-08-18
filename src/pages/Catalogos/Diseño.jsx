import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../constants'
import { setSelectOptions } from '../../functions/setters'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert, questionAlert, errorAdjuntos, deleteAlertSA2Parametro, createAlertSA2Parametro } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Card, Nav, Tab } from 'react-bootstrap'
import { DiseñoForm, ObraForm , IngenieriaForm} from '../../components/forms'
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../functions/routers"
import InputSinText from '../../components/form-components/SinText/InputSinText'
import Esquema3 from '../../components/draggable/Planos/Esquema3'
import Esquema from '../../components/draggable/Planos/Esquema'
import Swal from 'sweetalert2'
import { Button, SelectCreateSinText } from '../../components/form-components'

class Diseño extends Component {

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
            empresas: [],
            tipos: [],
            tipos2: []
        },
        form: {
            m2: '',
            inge_m2: '',
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
            tipos2: [],
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
            esquema_4:[],
            tipo: '',
            tipo1: '',
            tipoTarget: {taget: '', value: ''},
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

    changePosicionTipo = async(tipo, direction) => {
        const { access_token } = this.props.authUser
        const { empresa } = this.state
        await axios.put(`${URL_DEV}empresa/tabulador/reorder/esquema-3/${empresa.id}`, {tipo: tipo.tipo, dir: direction} ,{ headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close();
                const { empresa } = response.data
                const { form } = this.state
                let auxEsquema3 = [];
                empresa.planos.map((plano) => {
                    if(plano.esquema_3)
                        auxEsquema3.push(plano)
                    return ''
                })
                auxEsquema3.push({id: '', nombre: '', tipo: ''})
                form.esquema_3 = auxEsquema3
                this.setState({...this.state, form})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    changePosicionPlano = async(plano, direction) => {
        const { access_token } = this.props.authUser
        const { empresa } = this.state
        await axios.put(`${URL_DEV}empresa/tabulador/reorder/esquema-1-2/${empresa.id}`, {plano: plano.id, dir: direction} ,{ headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close();
                const { empresa } = response.data
                const { form } = this.state
                let auxEsquema2 = [];
                let auxEsquema1 = [];
                let auxEsquema3 = [];
                empresa.planos.map((plano) => {
                    if(plano.esquema_2)
                        auxEsquema2.push(plano)
                    if(plano.esquema_1)
                        auxEsquema1.push(plano)
                    if(plano.esquema_3)
                        auxEsquema3.push(plano)
                    return ''
                })
                auxEsquema1.push({id: '', nombre: ''})
                auxEsquema2.push({id: '', nombre: ''})
                auxEsquema3.push({id: '', nombre: '', tipo: ''})
                form.esquema_1 = auxEsquema1
                form.esquema_2 = auxEsquema2
                form.esquema_3 = auxEsquema3
                this.setState({...this.state, form})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    reorderPlanosEsquema1y2 = async(result) => {
        const { access_token } = this.props.authUser
        const { empresa } = this.state
        waitAlert()
        await axios.put(`${URL_DEV}empresa/tabulador/reorder/esquema-1-2/${empresa.id}`, result ,{ headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close();
                const { empresa } = response.data
                const { form } = this.state
                let auxEsquema2 = [];
                let auxEsquema1 = [];
                empresa.planos.map((plano) => {
                    if(plano.esquema_2)
                        auxEsquema2.push(plano)
                    if(plano.esquema_1)
                        auxEsquema1.push(plano)
                    return ''
                })
                auxEsquema1.push({id: '', nombre: ''})
                auxEsquema2.push({id: '', nombre: ''})
                form.esquema_1 = auxEsquema1
                form.esquema_2 = auxEsquema2
                this.setState({...this.state, form})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    reorderPlanos = async(result) => {
        const { access_token } = this.props.authUser
        const { empresa } = this.state
        waitAlert()
        await axios.put(`${URL_DEV}empresa/tabulador/reorder/${empresa.id}`, result ,{ headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close();
                const { empresa } = response.data
                const { form } = this.state
                let auxEsquema3 = [];
                empresa.planos.map((plano) => {
                    if(plano.esquema_3)
                        auxEsquema3.push(plano)
                    return ''
                })
            
                auxEsquema3.push({id: '', nombre: '', tipo: ''})

                form.esquema_3 = auxEsquema3
                this.setState({...this.state, form})
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
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
                                return ''
                            })
                            form.adjuntos.ejemplo.files = auxEj
                            form.adjuntos.subportafolio.files = auxSub
                            form.adjuntos.portada.files = auxPortada
                            
                        }

                        form.precio_inicial_diseño = empresa.precio_inicial_diseño
                        form.incremento_esquema_2 = empresa.incremento_esquema_2
                        form.incremento_esquema_3 = empresa.incremento_esquema_3

                        form.variaciones = []
                        empresa.variaciones.forEach((variacion, index) => {
                            form.variaciones.push({
                                'superior': parseInt(variacion.superior),
                                'inferior': parseInt(variacion.inferior),
                                'cambio': parseFloat(variacion.cambio)
                            })
                        })

                        form.variaciones = form.variaciones.sort(function (a, b) {
                            return parseInt(a.inferior) - parseInt(b.inferior);
                        });

                        form.precio_esquema_1 = this.getPrecioEsquemas(form, form.m2)
                        form.precio_esquema_2 = form.precio_esquema_1 === '-' ? '-' : form.precio_esquema_1 * (1 + (form.incremento_esquema_2 / 100))
                        form.precio_esquema_3 = form.precio_esquema_1 === '-' ? '-' : form.precio_esquema_1 * (1 + (form.incremento_esquema_3 / 100))

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
                            return ''
                        })
                        form.tipos = aux

                        let auxEsquema1 = []
                        let auxEsquema2 = []
                        let auxEsquema3 = []
                        let auxEsquema4 = []

                        empresas[0].planos.map((plano) => {

                            if(plano.esquema_1)
                                auxEsquema1.push(plano)
                            if(plano.esquema_2)
                                auxEsquema2.push(plano)
                            if(plano.esquema_3)
                                auxEsquema3.push(plano)
                            if(plano.esquema_4)
                                auxEsquema4.push(plano)
                            return ''
                        })
                        
                        auxEsquema1.push({id: '', nombre: ''})
                        auxEsquema2.push({id: '', nombre: ''})
                        auxEsquema3.push({id: '', nombre: '', tipo: ''})

                        form.esquema_1 = auxEsquema1
                        form.esquema_2 = auxEsquema2
                        form.esquema_3 = auxEsquema3
                        form.esquema_4 = auxEsquema4

                        this.setState({...this.state, form})

                        grafica = this.setGrafica(empresa)
                    }

                    options.tipos = []
                    options.tipos2 = []

                    empresa.tipos_planos.forEach((tipo) => {
                        options.tipos.push({
                            text: tipo.tipo,
                            value: tipo.id,
                            label: tipo.tipo
                        })
                    })
                    empresa.tipos_planos2.forEach((tipos2) => {
                        options.tipos2.push({
                            text: tipos2.tipo,
                            value: tipos2.id,
                            label: tipos2.tipo
                        })
                    })
                    empresa.tipos_planos3.forEach((tipos2) => {
                        form.esquema_4.push(tipos2)
                    })
                }
                // console.log(form)
                
                this.setState({
                    ...this.state,
                    options,
                    data,
                    empresa,
                    grafica,
                    activeTipo
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async getSingleDiseño(id) {
        waitAlert()
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
                            return ''
                        })
                        form.adjuntos.ejemplo.files = auxEj
                        form.adjuntos.subportafolio.files = auxSub
                        form.adjuntos.portada.files = auxPortada
                            
                    }

                    form.precio_inicial_diseño = empresa.precio_inicial_diseño
                    form.incremento_esquema_2 = empresa.incremento_esquema_2
                    form.incremento_esquema_3 = empresa.incremento_esquema_3

                    form.variaciones = []
                    empresa.variaciones.forEach((variacion, index) => {
                        form.variaciones.push({
                            'superior': parseInt(variacion.superior),
                            'inferior': parseInt(variacion.inferior),
                            'cambio': parseFloat(variacion.cambio)
                        })
                    })

                    form.variaciones = form.variaciones.sort(function (a, b) {
                        return parseInt(a.inferior) - parseInt(b.inferior);
                    });

                    form.precio_esquema_1 = this.getPrecioEsquemas(form, form.m2)
                    form.precio_esquema_2 = form.precio_esquema_1 === '-' ? '-' : form.precio_esquema_1 * (1 + (form.incremento_esquema_2 / 100))
                    form.precio_esquema_3 = form.precio_esquema_1 === '-' ? '-' : form.precio_esquema_1 * (1 + (form.incremento_esquema_3 / 100))

                    let aux = []

                    empresa.tipos.forEach((tipo) => {
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
                    let auxEsquema4 = []

                    empresa.planos.map((plano) => {
                        if(plano.esquema_1)
                            auxEsquema1.push(plano)
                        if(plano.esquema_2)
                            auxEsquema2.push(plano)
                        if(plano.esquema_3)
                            auxEsquema3.push(plano)
                        if(plano.esquema_4)
                            auxEsquema4.push(plano)
                        return ''
                    })
                
                    auxEsquema1.push({id: '', nombre: ''})
                    auxEsquema2.push({id: '', nombre: ''})
                    auxEsquema3.push({id: '', nombre: '', tipo: ''})

                    form.esquema_1 = auxEsquema1
                    form.esquema_2 = auxEsquema2
                    form.esquema_3 = auxEsquema3
                    form.esquema_4 = auxEsquema4

                    empresa.tipos_planos3.forEach((tipos2) => {
                        form.esquema_4.push(tipos2)
                    })
                    form.esquema_3 = auxEsquema3

                    this.setState({...this.state, form})
                    grafica = this.setGrafica(empresa)
                }
                
                Swal.close()
                this.setState({
                    ...this.state,
                    options,
                    data,
                    empresa,
                    grafica,
                    activeTipo
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
        if(aux2.length){
            let html = ''
            aux2.map((element)=>{
                html += '<div class="mb-2 text-dark-50">&bull;&nbsp;'+element +'<br/></div>'
                return ''
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
                    return ''
                })
                let arregloAuxiliar = []
                empresa.tipos.map((element)=>{
                    if(element.id.toString() === activeTipo.toString()){
                        element.adjuntos.map((adjunto)=>{
                            if(adjunto.pivot.tipo === name)
                                arregloAuxiliar.push(adjunto)
                            return ''
                        })
                    }
                    return ''
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
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
        if(name === 'inge_m2'){
            let ra = 0 
            // console.log(form.esquema_4)
            form.esquema_4.forEach(function (element) {
                    // ra = Math.sqrt(element.monto * form.inge_m2) * element.monto
                    // element.porcentaje = ra.toFixed(3)
                    element.porcentaje = element.monto * form.inge_m2
                })

        }
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

        const { inferior, superior, cambio } = form.variaciones[key]
        if(inferior !== '' && superior !== '' && cambio !== ''){
            form.precio_esquema_1 = this.getPrecioEsquemas(form, form.m2)
            form.precio_esquema_2 = form.precio_esquema_1 === '-' ? '-' : form.precio_esquema_1 * (1 + (form.incremento_esquema_2 / 100))
            form.precio_esquema_3 = form.precio_esquema_1 === '-' ? '-' : form.precio_esquema_1 * (1 + (form.incremento_esquema_3 / 100))
        }
        
        let aux = true
        form.variaciones.forEach((variacion) => {
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
            return ''
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
            return ''
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
            for (let i = 0; i <= 19; i++) {
                let limite = (limiteInf + (i * (limiteSup - limiteInf) / 20))
                limite = parseInt(parseFloat(limite).toFixed(2))
                labels.push(limite)
                data.push(this.getPrecioEsquemas(form, limite).toFixed(2))
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
                return ''
            })
            if (aux) {
                auxilar = form.variaciones
                /* auxilar = auxilar.sort(function (a, b) {
                    return parseInt(a.inferior) - parseInt(b.inferior);
                }); */
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
                            return ''
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
            return '';
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
                return ''
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
                if(form.tipoTarget !== '')
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
        const { empresa, form } = this.state

        if(datos.esquema === 'esquema_3')
            datos.value.tipo = form.tipoTarget

            if(datos.esquema === 'esquema_2')
            datos.value.tipo = form.tipoTarget

        await axios.post(`${URL_DEV}empresa/${empresa.id}/plano/${datos.esquema}`, datos.value, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresa } = response.data
                this.getSingleDiseño(empresa.id)
                doneAlert('Plano agregado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deletePlano = id => {
        deleteAlertSA2Parametro('¿ESTÁS SEGURO QUE DESEAS ELIMINAR EL PLANO?', 'ESTA ACCIÓN NO PODRÁ SER REVERTIDA',
            this.deletePlanoAxios, {id: id})
    }

    deletePlanoAxios = async(data) => {
        const { access_token } = this.props.authUser
        const { empresa } = this.state
        await axios.delete(`${URL_DEV}empresa/${empresa.id}/planos/${data.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresa } = response.data
                this.getSingleDiseño(empresa.id)
                doneAlert('Plano eliminado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    handleChangeCreate = (newValue) => {
        const { form } = this.state
        if(newValue == null){
            newValue = { "label":"","value":"" }
        }
        let nuevoValue = {
            "label":newValue.label,
            "value":newValue.value
        }
        form.tipo = newValue.value
        form.tipoTarget = nuevoValue
        this.setState({
            ...this.state,
            form
        })
    }

    handleCreateOption = inputValue => {
        let { options, form } = this.state
        let newOption = {
            'label': inputValue,
            'value': inputValue,
            'text': inputValue,
        }
        options.tipos.push(newOption)
        form.tipoTarget = newOption
        form.tipo = inputValue
        this.setState({
            ...this.state,
            form, options
        });
    }

    printTabDiseño = () => {
        const { grafica, form } = this.state
        return(
            <div className="row mx-0">
                <div className="col-lg-5">
                    <DiseñoForm form = { form } onChange = { this.onChange } onSubmit = { this.onSubmit } addRow = { this.addRow }
                        deleteRow = { this.deleteRow } onChangeVariaciones = { this.onChangeVariaciones } grafica = { grafica } />
                </div>
                <div className="col-lg-7">
                    {/* {
                        grafica !== '' ?
                            <div className="row mx-0 justify-content-center align-items center">
                                <div className="col-md-11">
                                    <Line data={grafica} />
                                </div>
                            </div>
                        : <></>
                    } */}
                </div>
            </div>
        )      
    }

    render() {
        const { form, empresa, data, options } = this.state
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
                        <Card.Body className="pt-2 px-2">
                            <Tab.Container defaultActiveKey="diseño">
                                <Nav className="nav nav-tabs nav-tabs-space-lg nav-tabs-line nav-bold nav-tabs-line-3x border-0 ml-4">
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
                                        <Nav.Link eventKey="planos">
                                            <span className="nav-icon mr-2">
                                                <span className="svg-icon mr-3">
                                                <i style={{ color: "#EF6C00" }} className={`las la-blueprints icon-xl mr-2`} />
                                                    {/* <SVG  style={{ color : "red" }}  src={toAbsoluteUrl('/images/svg/highvoltage.svg')} /> */}
                                                </span>
                                            </span>
                                            <span className="nav-text">Planos</span>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="nav-item mr-3">
                                        <Nav.Link eventKey="ingenierias">
                                            <span className="nav-icon mr-2">
                                                <span className="svg-icon mr-3">
                                                <i style={{ color: "#EF6C00" }} className={`las la-hard-hat icon-xl mr-2`} />
                                                </span>
                                            </span>
                                            <span className="nav-text">Ingenierías</span>
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className="py-5">
                                    <Tab.Pane eventKey="diseño">
                                        { this.printTabDiseño() }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="obra">
                                        <ObraForm
                                            form={form}
                                            onChange={this.onChange}
                                            onSubmit={this.onSubmitObra}
                                            addRow={this.addParametricRow}
                                        />
                                    </Tab.Pane>
                                    
                                    <Tab.Pane eventKey="ingenierias">
                                        <IngenieriaForm
                                            form={form}
                                            onChange={this.onChange}
                                            onSubmit={this.onSubmitObra}
                                            addRow={this.addParametricRow}
                                        />
                                    </Tab.Pane>
                                    {
                                        empresa ?
                                            <Tab.Pane eventKey="planos">
                                                <div className = 'row mx-0'>
                                                    <div className = 'col-md-4 mb-4'>
                                                        <Card className="border-0">
                                                            <Card.Header className="p-3 border-0 bg-gray-200">
                                                                <div className="card-label text-dark font-size-lg font-weight-bolder text-center">ESQUEMA 1</div>
                                                            </Card.Header>
                                                            <Card.Body className='py-0 px-0' style={{border:"3px solid #ECF0F3"}} >
                                                                <div className="pt-0">
                                                                    <Esquema planos = { form.esquema_1 } deletePlano = { this.deletePlano } 
                                                                        changePosicionPlano = { this.changePosicionPlano } />
                                                                    <div className = 'row mx-0 py-2'>
                                                                        <div className = 'col-10 w-100 align-self-center text-justify'>
                                                                            <InputSinText name = 'nombre' placeholder = 'PLANO' requireValidation = { 1 }
                                                                                value = { form.esquema_1[form.esquema_1.length-1].nombre } onChange = { (e) => { this.handleChangePlanos('esquema_1', e,form.esquema_1.length-1) }}
                                                                                customclass="border-top-0 border-left-0 border-right-0 rounded-0 text-center pl-0 w-100" />
                                                                        </div>
                                                                        <div className='col-2 text-center d-flex align-items-end justify-content-center'>
                                                                            <Button icon = '' onClick = { () => { this.sendPlano('esquema_1', form.esquema_1.length - 1) } } 
                                                                                className = "btn btn-icon btn-light-success btn-xs mr-2 px-2" only_icon = "fas fa-plus icon-xs"
                                                                                tooltip={{text:'ENVIAR'}}/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                    <div className = 'col-md-4 mb-4'>
                                                        <Card className="border-0">
                                                            <Card.Header className="p-3 border-0 bg-gray-200">
                                                                <div className="card-label text-dark font-size-lg font-weight-bolder text-center">ESQUEMA 2</div>
                                                            </Card.Header>
                                                            <Card.Body className='py-0 px-0' style={{border:"3px solid #ECF0F3"}}>
                                                                <div className="pt-0">
                                                                    <Esquema3 planos = { form.esquema_2 } deletePlano = { this.deletePlano } 
                                                                        changePosicionPlano = { this.changePosicionPlano } />
                                                                    <div className = 'row mx-0 py-2'>
                                                                    <div className = 'col-md-6 align-self-center text-justify pb-2 px-1'>
                                                                            <SelectCreateSinText 
                                                                                name = 'tipo1'
                                                                                placeholder = "TIPO"
                                                                                iconclass = "far fa-file-alt"
                                                                                requirevalidation = { 1 }
                                                                                messageinc = "Ingresa el tipo"
                                                                                onChange = { this.handleChangeCreate }
                                                                                onCreateOption = { this.handleCreateOption }
                                                                                elementoactual = { form.tipoTarget }
                                                                                options = { options.tipos2 }
                                                                            />
                                                                        </div>
                                                                        <div className = 'col-5 w-100 align-self-center text-justify'>
                                                                            <InputSinText name = 'nombre' placeholder = 'PLANO' requireValidation = { 1 }
                                                                                value = { form.esquema_2[form.esquema_2.length-1].nombre } onChange = { (e) => { this.handleChangePlanos('esquema_2', e,form.esquema_2.length-1) }}
                                                                                customclass="border-top-0 border-left-0 border-right-0 rounded-0 text-center pl-0 w-100" />
                                                                        </div>
                                                                        <div className='col-1 text-center d-flex align-items-end justify-content-center'>
                                                                            <Button icon = '' onClick = { () => { this.sendPlano('esquema_2', form.esquema_2.length - 1) } } 
                                                                                className = "btn btn-icon btn-light-success btn-xs mr-2 px-2" only_icon = "fas fa-plus icon-xs"
                                                                                tooltip={{text:'ENVIAR'}}/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                    <div className = 'col-md-4 mb-4'>
                                                        <Card className="border-0">
                                                            <Card.Header className="p-3 border-0 bg-gray-200">
                                                            <div className="card-label text-dark font-size-lg font-weight-bolder text-center">ESQUEMA 3</div>
                                                            </Card.Header>
                                                            <Card.Body className='py-0 px-0' style={{border:"3px solid #ECF0F3"}}>
                                                                <div className="pt-0 border-top">
                                                                    <Esquema3 planos = { form.esquema_3 } deletePlano = { this.deletePlano } 
                                                                        changePosicionPlano = { this.changePosicionPlano } changePosicionTipo = { this.changePosicionTipo } />
                                                                    <div className = 'row mx-0'>
                                                                        <div className = 'col-md-6 align-self-center text-justify pb-2 px-1'>
                                                                            {/* <InputSinText 
                                                                                    name = 'tipo' 
                                                                                    placeholder = 'TIPO' 
                                                                                    requireValidation = { 1 }
                                                                                    value = { form.esquema_3[form.esquema_3.length-1].tipo } 
                                                                                    onChange = { (e) => { this.handleChangePlanos('esquema_3', e, form.esquema_3.length-1) }}
                                                                                    customclass="border-top-0 border-left-0 border-right-0 rounded-0 text-center pl-0 w-100" 
                                                                                /> */}
                                                                            <SelectCreateSinText 
                                                                                name = 'tipo'
                                                                                placeholder = "TIPO"
                                                                                iconclass = "far fa-file-alt"
                                                                                requirevalidation = { 1 }
                                                                                messageinc = "Ingresa el tipo"
                                                                                onChange = { this.handleChangeCreate }
                                                                                onCreateOption = { this.handleCreateOption }
                                                                                elementoactual = { form.tipoTarget }
                                                                                options = { options.tipos }
                                                                            />
                                                                        </div>
                                                                        <div className = 'col-md-5 align-self-center text-justify px-2'>
                                                                            <InputSinText name = 'nombre' placeholder = 'PLANO' requireValidation = { 1 } value = { form.esquema_3[form.esquema_3.length - 1].nombre }
                                                                                onChange = { (e) => { this.handleChangePlanos('esquema_3', e, form.esquema_3.length - 1) }}
                                                                                customclass="border-top-0 border-left-0 border-right-0 rounded-0 text-center pl-0 w-100" />
                                                                        </div>
                                                                        <div className='col-md-1 text-center d-flex align-items-center justify-content-center px-2'>
                                                                            <Button icon = '' onClick = { () => { this.sendPlano('esquema_3', form.esquema_3.length - 1) } } 
                                                                                className = "btn btn-icon btn-light-success btn-xs" only_icon = "fas fa-plus icon-xs"
                                                                                tooltip={{text:'ENVIAR'}}/>
                                                                        </div>
                                                                    </div>
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

const mapStateToProps = state => {return {authUser: state.authUser}}
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Diseño);