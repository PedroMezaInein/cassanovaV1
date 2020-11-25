import { connect } from 'react-redux';
import React, { Component } from 'react';
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import Layout from '../../../components/layout/layout';
import swal from 'sweetalert'
import { Col, Row, Card, Form, Tab, Nav, DropdownButton, Dropdown } from 'react-bootstrap'
import { setOptions } from '../../../functions/setters'
import { UltimosContactosCard, SinContacto, UltimosIngresosCard } from '../../../components/cards'
import { forbiddenAccessAlert, errorAlert, waitAlert, doneAlert,questionAlert, questionAlert2} from '../../../functions/alert'
import LeadRhProveedor from '../../../components/tables/Lead/LeadRhProveedor'
import LeadNuevo from '../../../components/tables/Lead/LeadNuevo'
import LeadContacto from '../../../components/tables/Lead/LeadContacto'
import LeadNegociacion from '../../../components/tables/Lead/LeadNegociacion'
import LeadContrato from '../../../components/tables/Lead/LeadContrato'
import LeadNoContratado from '../../../components/tables/Lead/LeadNoContratado'
import LeadDetenido from '../../../components/tables/Lead/LeadDetenido'
import { Modal } from '../../../components/singles'
import { AgendaLlamada } from '../../../components/forms'

class Crm extends Component {
    state = {
        ultimos_contactados: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "ultimos_contactados"
        },
        activeTable: 'web',
        options: {
            empresas: [],
            servicios: [],
            origenes: []
        },
        prospectos_sin_contactar: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "prospectos_sin_contactar"
        },
        ultimos_ingresados: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "ultimos_ingresados"
        },
        lead_rh_proveedores: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "rh_proveedores"
        },
        lead_web: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "ultimos_ingresados"
        },
        leads_en_contacto: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "en_contacto"
        },
        leads_en_negociacion:{
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "en_negociacion"
        },
        leads_contratados: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "contratados"
        },
        leads_cancelados: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "cancelados"
        },
        leads_detenidos: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "detenidos"
        },
        lead: '',
        form: {
            fecha: new Date(),
            hora: '08',
            minuto: '00',
            cliente: '',
            tipo: 0,
            origen: 0,
            proyecto: '',
            empresa: 0,
            estatus: 0
        },
        modal: false
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const crm = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!crm)
            history.push('/')
        this.getOptionsAxios()
        this.getUltimosContactos()
        this.getSinContactar()
        this.getUltimosIngresados()
        this.getLeadsWeb()
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'crm/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { empresas, origenes } = response.data
                const { options } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                // console.log(options.empresas, 'empresas')
                let aux = []
                origenes.map((origen)=>{
                    aux.push({
                        value: origen.id.toString(),
                        text: origen.origen
                    })
                })
                options.origenes = aux
                this.setState({
                    ...this.state,
                    options
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
    nextUltimosContactados = (e) => {
        e.preventDefault()
        const { ultimos_contactados } = this.state
        if (ultimos_contactados.numPage < ultimos_contactados.total_paginas - 1) {
            this.setState({
                numPage: ultimos_contactados.numPage++
            })
            this.getUltimosContactos()
        }
    }
    prevUltimosContactados = (e) => {
        e.preventDefault()
        const { ultimos_contactados } = this.state
        if (ultimos_contactados.numPage > 0) {
            this.setState({
                numPage: ultimos_contactados.numPage--
            })
            this.getUltimosContactos()
        }
    }
    nextPageProspectosSinContactar = (e) => {
        e.preventDefault()
        const { prospectos_sin_contactar } = this.state
        if (prospectos_sin_contactar.numPage < prospectos_sin_contactar.total_paginas - 1) {
            this.setState({
                numPage: prospectos_sin_contactar.numPage++
            })
            this.getSinContactar()
        }
    }
    prevPageProspectosSinContactar = (e) => {
        e.preventDefault()
        const { prospectos_sin_contactar } = this.state
        if (prospectos_sin_contactar.numPage > 0) {
            this.setState({
                numPage: prospectos_sin_contactar.numPage--
            })
            this.getSinContactar()
        }
    }
    nextPageUltimosIngresados = (e) => {
        e.preventDefault()
        const { ultimos_ingresados } = this.state
        if (ultimos_ingresados.numPage < ultimos_ingresados.total_paginas - 1) {
            this.setState({
                numPage: ultimos_ingresados.numPage++
            })
        }
        this.getUltimosIngresados()
    }
    prevPageUltimosIngresados = (e) => {
        e.preventDefault()
        const { ultimos_ingresados } = this.state
        if (ultimos_ingresados.numPage > 0) {
            this.setState({
                numPage: ultimos_ingresados.numPage--
            })
            this.getUltimosIngresados()
        }
    }
    nextPageLeadWeb = (e) => {
        e.preventDefault()
        const { lead_web } = this.state
        if (lead_web.numPage < lead_web.total_paginas - 1) {
            this.setState({
                numPage: lead_web.numPage++
            })
        }
        this.getLeadsWeb()
    }
    prevPageLeadWeb = (e) => {
        e.preventDefault()
        const { lead_web } = this.state
        if (lead_web.numPage > 0) {
            this.setState({
                numPage: lead_web.numPage--
            })
            this.getLeadsWeb()
        }
    }
    nextPageLeadEnContacto = (e) => {
        e.preventDefault()
        const { leads_en_contacto } = this.state
        if (leads_en_contacto.numPage < leads_en_contacto.total_paginas - 1) {
            leads_en_contacto.numPage++
            this.setState({
                leads_en_contacto
            })
        }
        this.getLeadsEnContacto()
    }
    prevPageLeadEnContacto = (e) => {
        e.preventDefault()
        const { leads_en_contacto } = this.state
        if (leads_en_contacto.numPage > 0) {
            leads_en_contacto.numPage--
            this.setState({
                leads_en_contacto
            })
            this.getLeadsEnContacto()
        }
    }
    nextPageLeadEnNegociacion = (e) => {
        e.preventDefault()
        const { leads_en_negociacion } = this.state
        if (leads_en_negociacion.numPage < leads_en_negociacion.total_paginas - 1) {
            leads_en_negociacion.numPage++
            this.setState({
                leads_en_negociacion
            })
        }
        this.getLeadsEnNegociacion()
    }
    prevPageLeadEnNegociacion = (e) => {
        e.preventDefault()
        const { leads_en_negociacion } = this.state
        if (leads_en_negociacion.numPage > 0) {
            leads_en_negociacion.numPage--
            this.setState({
                leads_en_negociacion
            })
            this.getLeadsEnNegociacion()
        }
    }
    nextPageLeadCancelados = (e) => {
        e.preventDefault()
        const { leads_cancelados } = this.state
        if (leads_cancelados.numPage < leads_cancelados.total_paginas - 1) {
            leads_cancelados.numPage++
            this.setState({
                leads_cancelados
            })
        }
        this.getLeadsCancelados()
    }
    prevPageLeadCancelados = (e) => {
        e.preventDefault()
        const { leads_cancelados } = this.state
        if (leads_cancelados.numPage > 0) {
            leads_cancelados.numPage--
            this.setState({
                leads_cancelados
            })
            this.getLeadsCancelados()
        }
    }
    nextPageLeadContratados = (e) => {
        e.preventDefault()
        const { leads_contratados } = this.state
        if (leads_contratados.numPage < leads_contratados.total_paginas - 1) {
            leads_contratados.numPage++
            this.setState({
                leads_contratados
            })
        }
        this.getLeadsContratados()
    }
    prevPageLeadContratados = (e) => {
        e.preventDefault()
        const { leads_contratados } = this.state
        if (leads_contratados.numPage > 0) {
            leads_contratados.numPage--
            this.setState({
                leads_contratados
            })
            this.getLeadsContratados()
        }
    }
    nextPageLeadDetenidos = (e) => {
        e.preventDefault()
        const { leads_detenidos } = this.state
        if (leads_detenidos.numPage < leads_detenidos.total_paginas - 1) {
            leads_detenidos.numPage++
            this.setState({
                leads_detenidos
            })
        }
        this.getLeadsDetenidos()
    }
    prevPageLeadDetenidos = (e) => {
        e.preventDefault()
        const { leads_detenidos } = this.state
        if (leads_detenidos.numPage > 0) {
            leads_detenidos.numPage--
            this.setState({
                leads_detenidos
            })
            this.getLeadsDetenidos()
        }
    }
    nextPageRhProveedor = (e) => {
        e.preventDefault()
        const { lead_rh_proveedores } = this.state
        if (lead_rh_proveedores.numPage < lead_rh_proveedores.total_paginas - 1) {
            lead_rh_proveedores.numPage++
            this.setState({
                lead_rh_proveedores
            })
        }
        this.getLeadsRhProveedores()
    }
    prevPageRhProveedor = (e) => {
        e.preventDefault()
        const { lead_rh_proveedores } = this.state
        if (lead_rh_proveedores.numPage > 0) {
            lead_rh_proveedores.numPage--
            this.setState({
                lead_rh_proveedores
            })
            this.getLeadsRhProveedores()
        }
    }
    async getUltimosContactos() {
        const { access_token } = this.props.authUser
        const { ultimos_contactados } = this.state
        await axios.get(URL_DEV + 'crm/timeline/ultimos-contactos/' + ultimos_contactados.numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { contactos, total } = response.data
                const { ultimos_contactados } = this.state
                let total_paginas = Math.ceil(total / 5)
                ultimos_contactados.data = contactos
                ultimos_contactados.total = total
                ultimos_contactados.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    ultimos_contactados
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
    async getSinContactar() {
        const { access_token } = this.props.authUser
        const { prospectos_sin_contactar } = this.state
        await axios.get(URL_DEV + 'crm/timeline/ultimos-prospectos-sin-contactar/' + prospectos_sin_contactar.numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { contactos, total } = response.data
                const { prospectos_sin_contactar } = this.state
                prospectos_sin_contactar.data = contactos
                prospectos_sin_contactar.total = total
                let total_paginas = Math.ceil(total / 5)
                prospectos_sin_contactar.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    prospectos_sin_contactar
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
    async getUltimosIngresados() {
        const { access_token } = this.props.authUser
        const { ultimos_ingresados } = this.state
        await axios.get(URL_DEV + 'crm/timeline/ultimos-leads-ingresados/' + ultimos_ingresados.numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { leads, total } = response.data
                const { ultimos_ingresados } = this.state
                ultimos_ingresados.data = leads
                ultimos_ingresados.total = total
                let total_paginas = Math.ceil(total / 5)
                ultimos_ingresados.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    ultimos_ingresados
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
    async getLeadsRhProveedores() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { lead_rh_proveedores, form } = this.state
        await axios.put(URL_DEV + 'crm/table/lead-rh-proveedor/' + lead_rh_proveedores.numPage, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { leads, total } = response.data
                const { lead_rh_proveedores } = this.state
                lead_rh_proveedores.data = leads
                lead_rh_proveedores.total = total
                let total_paginas = Math.ceil(total / 10)
                lead_rh_proveedores.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    lead_rh_proveedores
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

    async getLeadsWeb() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { lead_web, form } = this.state
        await axios.put(URL_DEV + 'crm/table/lead-web/' + lead_web.numPage, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { leads, total } = response.data
                const { lead_web } = this.state
                lead_web.data = leads
                lead_web.total = total
                let total_paginas = Math.ceil(total / 10)
                lead_web.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    lead_web
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

    async getLeadsEnNegociacion(){
        waitAlert()
        const { access_token } = this.props.authUser
        const { leads_en_negociacion, form } = this.state
        await axios.put(URL_DEV + 'crm/table/lead-en-negociacion/' + leads_en_negociacion.numPage, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { leads, total } = response.data
                const { leads_en_negociacion } = this.state
                leads_en_negociacion.data = leads
                leads_en_negociacion.total = total
                let total_paginas = Math.ceil(total / 10)
                leads_en_negociacion.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    leads_en_negociacion
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

    async getLeadsEnContacto() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { leads_en_contacto, form } = this.state
        await axios.put(URL_DEV + 'crm/table/lead-en-contacto/' + leads_en_contacto.numPage, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { leads, total } = response.data
                const { leads_en_contacto } = this.state
                leads_en_contacto.data = leads
                leads_en_contacto.total = total
                let total_paginas = Math.ceil(total / 10)
                leads_en_contacto.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    leads_en_contacto
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

    async getLeadsCancelados() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { leads_cancelados, form } = this.state
        await axios.put(URL_DEV + 'crm/table/lead-cancelados/' + leads_cancelados.numPage, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { leads, total } = response.data
                const { leads_cancelados } = this.state
                leads_cancelados.data = leads
                leads_cancelados.total = total
                let total_paginas = Math.ceil(total / 10)
                leads_cancelados.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    leads_cancelados
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
    async getLeadsContratados() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { leads_contratados, form } = this.state
        await axios.put(URL_DEV + 'crm/table/lead-contratados/' + leads_contratados.numPage, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { leads, total } = response.data
                const { leads_contratados } = this.state
                leads_contratados.data = leads
                leads_contratados.total = total
                let total_paginas = Math.ceil(total / 10)
                leads_contratados.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    leads_contratados
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
    async getLeadsDetenidos() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { leads_detenidos, form } = this.state
        await axios.put(URL_DEV + 'crm/table/lead-detenidos/' + leads_detenidos.numPage, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { leads, total } = response.data
                const { leads_detenidos } = this.state
                leads_detenidos.data = leads
                leads_detenidos.total = total
                let total_paginas = Math.ceil(total / 10)
                leads_detenidos.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    leads_detenidos
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
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    sendEmailNewWebLead = async lead => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'crm/email/solicitud-llamada/' + lead.id, {}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Correo enviado con éxito');
                this.getLeadsWeb()
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

    agendarLlamada = async() => {
        const { lead, form } = this.state
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'crm/add/evento/' + lead.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { form } = this.state
                form.fecha = new Date()
                form.hora = 0
                form.minuto = 0
                this.setState({
                    ...this.state,
                    form,
                    modal: false
                })
                doneAlert('Evento generado con éxito');
                this.getLeadsWeb()
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

    changeActiveTable = key => {
        const { form, activeTable } = this.state
        if( key !== activeTable ){
            form.cliente = ''
            form.tipo = 0
            form.proyecto = ''
            form.origen = 0
            form.empresa = 0
            form.estatus = 0
        }
        switch (key) {
            case 'rh-proveedores':
                this.getLeadsRhProveedores();
                break;
            case 'web':
                this.getLeadsWeb();
                break;
            case 'contacto':
                this.getLeadsEnContacto();
                break;
            case 'contratados':
                this.getLeadsContratados();
                break;
            case 'cancelados':
                this.getLeadsCancelados();
                break;
            case 'detenidos':
                this.getLeadsDetenidos();
                break;
            case 'negociacion':
                this.getLeadsEnNegociacion();
                break;
            default: break;
        }
        this.setState({
            ...this.state,
            activeTable: key,
            form
        })
    }

    cleanForm = () => {
        const { form, activeTable } = this.state
        form.cliente = ''
        form.tipo = 0
        form.proyecto = ''
        form.origen = 0
        form.empresa = 0
        form.estatus = 0
        switch (activeTable) {
            case 'rh-proveedores':
                this.getLeadsRhProveedores();
                break;
            case 'web':
                this.getLeadsWeb();
                break;
            case 'contacto':
                this.getLeadsEnContacto();
                break;
            case 'contratados':
                this.getLeadsContratados();
                break;
            case 'cancelados':
                this.getLeadsCancelados();
                break;
            case 'detenidos':
                this.getLeadsDetenidos();
                break;
            case 'negociacion':
                this.getLeadsEnNegociacion();
                break;
            default: break;
        }
        this.setState({
            ...this.state,
            form
        })
    }

    openModal = lead => {
        this.setState({
            ...this.state,
            modal: true,
            lead: lead
        })
    }
    handleCloseModal = () => {
        this.setState({
            ...this.state,
            modal: false,
            lead: ''
        })
    }
    async changeEstatusAxios(data) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'crm/lead/estatus/' + data.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { activeTable } = this.state
                this.changeActiveTable( activeTable )
                doneAlert('El estatus fue actualizado con éxito.')
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

    async changeOrigenAxios(data) {

        waitAlert()

        const { access_token } = this.props.authUser
        
        await axios.put(URL_DEV + 'crm/lead/origen/' + data.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                
                const {activeTable}=this.state
                this.changeActiveTable(activeTable)            
                doneAlert('El origen fue actualizado con éxito.')
                
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

    async changeEstatusCanceladoRechazadoAxios(data) {
        waitAlert()
        const { access_token } = this.props.authUser
        data.motivo = document.getElementById('motivo').value
        await axios.put(URL_DEV + 'crm/lead/estatus/' + data.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { activeTable } = this.state
                this.changeActiveTable( activeTable )
                doneAlert('El estatus fue actualizado con éxito.')
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

    changeEstatus = (estatus, id) => {
        questionAlert('¿ESTÁS SEGURO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios({ id: id, estatus: estatus }))
    }

    changeOrigen = ( origen, id ) => {
        questionAlert('¿ESTÁS SEGURO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.changeOrigenAxios({ id: id, origen: origen }))
    }

    openModalWithInput = (estatus, id) => {
        questionAlert2(
            estatus === 'Cancelado' ?
                'ESCRIBE EL MOTIVO DE CANCELACIÓN' :
                'ESCRIBE EL MOTIVO DE RECHAZO', 
            '', 
            () => this.changeEstatusCanceladoRechazadoAxios({ id: id, estatus: estatus }),
            <div>
                <Form.Control
                    placeholder = { 
                        estatus === 'Cancelado' ?
                            'MOTIVO DE CANCELACIÓN' :
                            'MOTIVO DE RECHAZO'
                    }
                    className = "form-control form-control-solid h-auto py-7 px-6"
                    id = 'motivo'
                    as = "textarea"
                    rows = "3"
                />
            </div>
        )
    }    
    
    changePageLlamadaSalida = (lead) => {
        const { history } = this.props
        history.push({
            pathname: '/leads/crm/add/llamada-salida',
            state: { lead: lead }
        });
    }

    changePageDetailsContacto = (lead) => {
        const { history } = this.props
        history.push({
            pathname: '/leads/crm/info/info',
            state: { lead: lead, tipo: 'En contacto' }
        });
    }

    changePageDetailsNegociacion = (lead) => {
        const { history } = this.props
        history.push({
            pathname: '/leads/crm/info/info',
            state: { lead: lead, tipo: 'En negociación' }
        });
    }

    changePageCierreVenta = (lead) => {
        const { history } = this.props
        history.push({
            pathname: '/leads/crm/cierre/llamada-cierre',
            state: { lead: lead }
        });
    }

    changePageContratar = lead => {
        const { history } = this.props
        history.push({
            pathname: '/leads/crm/contratar',
            state: { lead: lead }
        })
    }

    render() {
        const { ultimos_contactados, prospectos_sin_contactar, ultimos_ingresados, lead_web, activeTable, leads_en_contacto, leads_en_negociacion,
            leads_contratados, leads_cancelados, leads_detenidos, modal, form, lead, lead_rh_proveedores, options} = this.state
        return (
            <Layout active='leads' {...this.props} >
                <Row>
                    <Col lg={4}>
                        <UltimosIngresosCard
                            ultimos_ingresados={ultimos_ingresados}
                            onClick={this.nextPageUltimosIngresados}
                            onClickPrev={this.prevPageUltimosIngresados}
                        />
                    </Col>
                    <Col lg={4}>
                        <SinContacto
                            prospectos_sin_contactar={prospectos_sin_contactar}
                            onClick={this.nextPageProspectosSinContactar}
                            onClickPrev={this.prevPageProspectosSinContactar}
                        />
                    </Col>
                    <Col lg={4}>
                        <UltimosContactosCard
                            ultimos_contactados={ultimos_contactados}
                            onClick={this.nextUltimosContactados}
                            onClickPrev={this.prevUltimosContactados}
                        />
                    </Col>
                </Row>
                <Col md={12} className="px-0">
                    <Tab.Container defaultActiveKey="web"
                        activeKey={activeTable}
                        onSelect={(select) => { this.changeActiveTable(select) }}>
                        <Card className="card-custom card-stretch gutter-b py-2">
                            <Card.Header className="align-items-center border-0">
                                <h3 className="card-title align-items-start flex-column">
                                    <span className="font-weight-bolder text-dark">Leads</span>
                                </h3>
                                <div className="card-toolbar">
                                    <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0">
                                        <Nav.Item className="nav-item">
                                            <Nav.Link eventKey="web">PÁGINA WEB</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="nav-item">
                                            <Nav.Link eventKey="contacto">EN CONTACTO</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="nav-item">
                                            <Nav.Link eventKey="negociacion">EN NEGOCIACIÓN</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="nav-item">
                                            <Nav.Link eventKey="contratados">CONTRATADOS</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="nav-item">
                                            <Nav.Link eventKey="detenidos">DETENIDOS</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="nav-item pt-2">
                                            <DropdownButton
                                                menuAlign="right"
                                                title={
                                                    <i className="fas fa-chevron-down icon-nm p-0"></i>
                                                }
                                                id={`dropdown-button-drop-left-crm`}
                                            >
                                                <Dropdown.Item eventKey="rh-proveedores" className="text-hover-primary" id="rh-proveedores">
                                                    <span className="navi-icon">
                                                        <i className="fas fa-users pr-3 text"></i>
                                                    </span>
                                                    <span className="navi-text align-self-center">RH/PROVEEDORES</span>
                                                </Dropdown.Item>
                                                <Dropdown.Item eventKey="cancelados" className="text-hover-primary" id="cancelados-rechazados">
                                                    <span className="navi-icon">
                                                        <i className="fas fa-user-times pr-3 text"></i>
                                                    </span>
                                                    <span className="navi-text align-self-center">CANCELADOS/RECHAZADOS</span>
                                                </Dropdown.Item>
                                            </DropdownButton>
                                        </Nav.Item>
                                    </Nav>
                                </div>
                            </Card.Header>
                            <div className="card-body">
                                <div className="mb-5">
                                    <div className="form-group row form-group-marginless d-flex justify-content-center">
                                        <div className="col-md-2">
                                            <div className="input-icon">
                                                <input value = { form.cliente } type="text" className="form-control form-control-solid" 
                                                    placeholder="BUSCAR CLIENTE" onChange = { this.onChange } name = 'cliente' />
                                                <span>
                                                    <i className="flaticon2-search-1 text-muted"></i>
                                                </span>
                                            </div>
                                        </div>
                                        {
                                            activeTable !== "rh-proveedores" && activeTable !== 'cancelados' ?
                                                <div className="col-md-2">
                                                    <div className="input-icon">
                                                        <input value = { form.proyecto } type="text" className="form-control form-control-solid" 
                                                            placeholder="BUCAR PROYECTO" onChange = { this.onChange } name = 'proyecto' />
                                                        <span>
                                                            <i className="flaticon2-search-1 text-muted"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            : ''
                                        }
                                        {
                                            activeTable !== 'web' && activeTable !== 'rh-proveedores' ?
                                                <div className="col-md-2">
                                                    <Form.Control
                                                        className="form-control text-uppercase form-control-solid"
                                                        value = { form.origen }
                                                        onChange = { this.onChange }
                                                        name = 'origen'
                                                        as = "select">
                                                        <option  value={0}>Selecciona el origen</option>
                                                        {
                                                            options.origenes.map((origen, key)=>{
                                                                return(
                                                                    <option key = { key } value = { origen.value } className="bg-white" >{origen.text}</option>
                                                                )
                                                            })
                                                        }
                                                    </Form.Control>
                                                </div>
                                            : ''
                                        }
                                        <div className="col-md-2">
                                            <Form.Control className="form-control text-uppercase form-control-solid"
                                                value = { form.empresa } onChange = { this.onChange } name = 'empresa' as = "select">
                                                <option  value={0}>Selecciona la empresa</option>
                                                {
                                                    options.empresas.map((empresa, key)=>{
                                                        return(
                                                            <option key = { key } value = { empresa.value } className="bg-white" >{empresa.name}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Control>
                                        </div>
                                        {
                                            activeTable === 'cancelados' ?
                                                <div className="col-md-2">
                                                    <Form.Control className="form-control text-uppercase form-control-solid"
                                                        value = { form.estatus } onChange = { this.onChange } name = 'estatus' as="select">
                                                        <option value = { 0 } > Selecciona el estatus </option>
                                                        <option value = "cancelado" className = "bg-white" >CANCELADO</option>
                                                        <option value = "rechazado" className = "bg-white" >RECHAZADO</option>
                                                    </Form.Control>
                                                </div>
                                                : ''
                                        }
                                        {
                                            activeTable === 'rh-proveedores' ?
                                                <div className="col-md-2">
                                                    <Form.Control className="form-control text-uppercase form-control-solid"
                                                        value = {form.tipo} onChange = { this.onChange }  name = 'tipo' as="select">
                                                        <option value = { 0 } >Tipo</option>
                                                        <option value = "proveedor" className="bg-white">PROVEEDOR</option>
                                                        <option value = "bolsa_trabajo" className="bg-white">BOLSA DE TRABAJO</option>
                                                    </Form.Control>
                                                </div>
                                                : ''
                                        }
                                        <div className="col-md-1 text-center" onClick = { (e) => { e.preventDefault(); this.changeActiveTable(activeTable) } } >
                                            <span className="btn btn-light-primary px-6 font-weight-bold">Buscar</span>
                                        </div>
                                        <div className="col-md-1 text-center" onClick = { this.cleanForm } >
                                            <span className="btn btn-light-danger px-6 font-weight-bold">Limpiar</span>
                                        </div>
                                    </div>
                                </div>
                                <Tab.Content>
                                    <Tab.Pane eventKey="rh-proveedores">
                                        <LeadRhProveedor
                                            leads={lead_rh_proveedores}
                                            onClickNext={this.nextPageRhProveedor}
                                            onClickPrev={this.prevPageRhProveedor}
                                            sendEmail={this.sendEmailNewWebLead}
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="web">
                                        <LeadNuevo
                                            leads={lead_web}
                                            onClickNext={this.nextPageLeadWeb}
                                            onClickPrev={this.prevPageLeadWeb}
                                            sendEmail={this.sendEmailNewWebLead}
                                            openModal={this.openModal}
                                            openModalWithInput={this.openModalWithInput}
                                            changePageLlamadaSalida={this.changePageLlamadaSalida}
                                            options = { options }
                                            changeOrigen = { this.changeOrigen }
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="contacto">
                                        <LeadContacto
                                            leads = { leads_en_contacto }
                                            onClickNext = { this.nextPageLeadEnContacto }
                                            onClickPrev = { this.prevPageLeadEnContacto }
                                            changeEstatus = { this.changeEstatus }
                                            openModalWithInput = { this.openModalWithInput }
                                            changePageDetails = { this.changePageDetailsContacto }
                                            options = { options }
                                            changeOrigen = { this.changeOrigen }
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="negociacion">
                                        <LeadNegociacion
                                            leads = { leads_en_negociacion }
                                            onClickNext = { this.nextPageLeadEnNegociacion }
                                            onClickPrev = { this.prevPageLeadEnNegociacion }
                                            changeEstatus = { this.changeEstatus }
                                            openModalWithInput = { this.openModalWithInput }
                                            changePageDetails = { this.changePageDetailsNegociacion }
                                            changePageContratar = { this.changePageContratar }
                                            changePageCierreVenta = { this.changePageCierreVenta }
                                            options = { options }
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="contratados">
                                        <LeadContrato
                                            leads={leads_contratados}
                                            onClickNext={this.nextPageLeadContratados}
                                            onClickPrev={this.prevPageLeadContratados}
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="detenidos">
                                        <LeadDetenido
                                            leads={leads_detenidos}
                                            onClickNext={this.nextPageLeadDetenidos}
                                            onClickPrev={this.prevPageLeadDetenidos}
                                            changeEstatus={this.changeEstatus}
                                            openModalWithInput={this.openModalWithInput}
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="cancelados">
                                        <LeadNoContratado
                                            leads={leads_cancelados}
                                            onClickNext={this.nextPageLeadCancelados}
                                            onClickPrev={this.prevPageLeadCancelados}
                                        />
                                    </Tab.Pane>
                                </Tab.Content>
                            </div>
                        </Card>
                    </Tab.Container>
                </Col>
                <Modal title='Agenda una nueva llamada.' show={modal} handleClose={this.handleCloseModal}>
                    <AgendaLlamada
                        form={form}
                        onChange={this.onChange}
                        onSubmit={this.agendarLlamada}
                        user={this.props.authUser.user}
                        lead={lead}
                    />
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Crm)