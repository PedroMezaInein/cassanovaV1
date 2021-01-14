import { connect } from 'react-redux';
import React, { Component } from 'react';
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import Layout from '../../../components/layout/layout';
import { Col, Row, Card, Form, Tab, Nav, DropdownButton, Dropdown } from 'react-bootstrap'
import { setOptions, setDateTableLG, setContactoIcon } from '../../../functions/setters'
import { UltimosContactosCard, SinContacto, UltimosIngresosCard } from '../../../components/cards'
import { forbiddenAccessAlert, errorAlert, waitAlert, doneAlert, questionAlert, questionAlert2, deleteAlert} from '../../../functions/alert'
import LeadRhProveedor from '../../../components/tables/Lead/LeadRhProveedor'
import LeadNuevo from '../../../components/tables/Lead/LeadNuevo'
import LeadContacto from '../../../components/tables/Lead/LeadContacto'
import LeadNegociacion from '../../../components/tables/Lead/LeadNegociacion'
import LeadContrato from '../../../components/tables/Lead/LeadContrato'
import LeadNoContratado from '../../../components/tables/Lead/LeadNoContratado'
import LeadDetenido from '../../../components/tables/Lead/LeadDetenido'
import { Modal, } from '../../../components/singles'
import { AgendaLlamada, InformacionGeneral, HistorialContactoForm } from '../../../components/forms'
import InputGray from '../../../components/form-components/Gray/InputGray'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import Swal from 'sweetalert2'
import { Button } from '../../../components/form-components';
import Pagination from "react-js-pagination";
import SymbolIcon from '../../../components/singles/SymbolIcon';
import Moment from 'react-moment';
const $ = require('jquery');
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
        leads_en_negociacion: {
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
        formEditar: {
            name: '',
            empresa: '',
            empresa_dirigida: '',
            tipoProyecto: '',
            comentario: '',
            diseño: '',
            obra: '',
            email: '',
            tipoProyectoNombre: '',
            origen: '',
            telefono: '',
            proyecto: '',
            fecha: '',
        },
        formHistorial: {
            comentario: '',
            fechaContacto: '',
            success: 'Contactado',
            tipoContacto: '',
            newTipoContacto: '',
            adjuntos: {
                adjuntos: {
                    files: [],
                    value: '',
                    placeholder: 'Adjuntos'
                }
            }
        },
        modal_agendar: false,
        modal_editar: false,
        modal_historial: false,
        modal_one_lead: false,
        showForm: false,
        itemsPerPage: 5,
        activePage: 1
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

    /* ANCHOR CRM ELIMINAR CONTACTO */
    async eliminarContacto(contacto){
        const { access_token } = this.props.authUser
        const { lead } = this.state
        await axios.delete(URL_DEV + 'crm/prospecto/' + lead.id + '/contacto/' + contacto.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Registro eliminado con éxito.');
                const { lead } = response.data
                this.setState({
                    ...this.state,
                    lead: lead
                })
                setTimeout(() => {
                    this.getLeadsWeb()
                }, 1500);
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

    /* ANCHOR CRM GET ALL OPTIONS */
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'crm/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas, origenes, medios } = response.data
                const { options } = this.state
                options['tiposContactos'] = setOptions(medios, 'tipo', 'id')
                options.empresas = setOptions(empresas, 'name', 'id')
                let aux = []
                origenes.map((origen) => {
                    aux.push({
                        value: origen.id.toString(),
                        text: origen.origen
                    })
                    return ''
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
    
    /* ANCHOR CRM TIMELINE GET ULTIMOS LEADS INGRESADOS */
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

    /* ANCHOR CRM TIMELINE GET ULTIMOS LEADS SIN CONTACTO */
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

    /* ANCHOR CRM TIMELINE GET ULTIMOS LEADS INGRESADOS */
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

    /* ANCHOR CRM TABLE PUT LEADS RRHH PROVEEDOR */
    async getLeadsRhProveedores() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { lead_rh_proveedores, form } = this.state
        await axios.put(URL_DEV + 'crm/table/lead-rh-proveedor/' + lead_rh_proveedores.numPage, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { leads, total, page } = response.data
                const { lead_rh_proveedores } = this.state
                lead_rh_proveedores.data = leads
                lead_rh_proveedores.total = total
                lead_rh_proveedores.numPage = page
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

    /* ANCHOR CRM TABLE PUT LEADS DE PÁGINAS WEB */
    async getLeadsWeb() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { lead_web, form } = this.state
        await axios.put(URL_DEV + 'crm/table/lead-web/' + lead_web.numPage, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { leads, total, page } = response.data
                const { lead_web } = this.state
                lead_web.data = leads
                lead_web.total = total
                lead_web.numPage = page
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

    /* ANCHOR CRM TABLE PUT LEADS EN NEGOCIACIÓN */
    async getLeadsEnNegociacion() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { leads_en_negociacion, form } = this.state
        await axios.put(URL_DEV + 'crm/table/lead-en-negociacion/' + leads_en_negociacion.numPage, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { leads, total, page } = response.data
                const { leads_en_negociacion } = this.state
                leads_en_negociacion.data = leads
                leads_en_negociacion.total = total
                leads_en_negociacion.numPage = page
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

    /* ANCHOR CRM TABLE PUT LEADS EN CONTACTO */
    async getLeadsEnContacto() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { leads_en_contacto, form } = this.state
        await axios.put(URL_DEV + 'crm/table/lead-en-contacto/' + leads_en_contacto.numPage, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { leads, total, page } = response.data
                const { leads_en_contacto } = this.state
                leads_en_contacto.data = leads
                leads_en_contacto.total = total
                leads_en_contacto.numPage = page
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

    /* ANCHOR CRM TABLE PUT LEADS CANCELADOS */
    async getLeadsCancelados() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { leads_cancelados, form } = this.state
        await axios.put(URL_DEV + 'crm/table/lead-cancelados/' + leads_cancelados.numPage, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { leads, total, page } = response.data
                const { leads_cancelados } = this.state
                leads_cancelados.data = leads
                leads_cancelados.total = total
                leads_cancelados.numPage = page
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

    /* ANCHOR CRM TABLE PUT LEADS CONTRATADOS */
    async getLeadsContratados() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { leads_contratados, form } = this.state
        await axios.put(URL_DEV + 'crm/table/lead-contratados/' + leads_contratados.numPage, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { leads, total, page } = response.data
                const { leads_contratados } = this.state
                leads_contratados.data = leads
                leads_contratados.total = total
                leads_contratados.numPage = page
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

    /* ANCHOR CRM TABLE PUT LEADS DETENIDOS */
    async getLeadsDetenidos() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { leads_detenidos, form } = this.state
        await axios.put(URL_DEV + 'crm/table/lead-detenidos/' + leads_detenidos.numPage, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { leads, total, page } = response.data
                const { leads_detenidos } = this.state
                leads_detenidos.data = leads
                leads_detenidos.total = total
                leads_detenidos.numPage = page
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

    /* ANCHOR CRM SOLICITAR LLAMADA */
    sendEmailNewWebLead = async lead => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'crm/email/solicitud-llamada/' + lead.id, {}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getSinContactar()
                this.getUltimosIngresados()
                this.getUltimosIngresados()
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

    /* ANCHOR CRM AGENDAR LLAMADA */
    agendarLlamada = async () => {
        const { lead, form } = this.state
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'crm/add/evento/' + lead.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getUltimosIngresados()
                this.getSinContactar()
                this.getUltimosContactos()
                const { form } = this.state
                form.fecha = new Date()
                form.hora = 0
                form.minuto = 0
                this.setState({
                    ...this.state,
                    form,
                    modal_agendar: false
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

    /* ANCHOR LEAD PUT CAMBIO DE ESTATUS */
    async changeEstatusAxios(data) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'crm/lead/estatus/' + data.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { activeTable } = this.state
                this.changeActiveTable(activeTable)
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

    /* ANCHOR CRM PUT CAMBIO DE ORIGEN */
    async changeOrigenAxios(data) {

        waitAlert()

        const { access_token } = this.props.authUser

        await axios.put(URL_DEV + 'crm/lead/origen/' + data.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                const { activeTable } = this.state
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

    /* ANCHOR CRM PUT CAMBIO DE ESTATUS CANCELADO Y RECHAZADO */
    async changeEstatusCanceladoRechazadoAxios(data) {
        const { access_token } = this.props.authUser
        if(document.getElementById('motivo'))
            data.motivo = document.getElementById('motivo').value
        waitAlert()
        await axios.put(URL_DEV + 'crm/lead/estatus/' + data.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getUltimosIngresados()
                this.getSinContactar()
                this.getUltimosContactos()
                const { activeTable } = this.state
                this.changeActiveTable(activeTable)
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

    /* ANCHOR CRM UPDATE INFO LEAD */
    async addLeadInfoAxios() {
        const { access_token } = this.props.authUser
        const { formEditar, lead } = this.state
        await axios.put(URL_DEV + 'crm/update/lead-en-contacto/' + lead.id, formEditar, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el lead.')
                const { formEditar, activeTable } = this.state
                formEditar.name = ''
                formEditar.telefono = ''
                formEditar.email = ''
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
                    modal_editar: false,
                    formEditar
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

    /* ANCHOR CRM AGREGAR CONTACTO DE LEAD */
    async agregarContacto() {
        waitAlert()
        const { lead, formHistorial } = this.state
        const { access_token } = this.props.authUser
        const data = new FormData();
        let aux = Object.keys(formHistorial)
        aux.map((element) => {
            switch (element) {
                case 'fechaContacto':
                    data.append(element, (new Date(formHistorial[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                default:
                    data.append(element, formHistorial[element]);
                    break
            }
            return false
        })
        aux = Object.keys(formHistorial.adjuntos)
        aux.map((element) => {
            if (formHistorial.adjuntos[element].value !== '') {
                for (var i = 0; i < formHistorial.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, formHistorial.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, formHistorial.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
            return false
        })
        await axios.post(URL_DEV + 'crm/contacto/lead/' + lead.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getUltimosIngresados()
                this.getSinContactar()
                this.getUltimosContactos()
                const { lead } = response.data
                this.setState({
                    ...this.state,
                    formHistorial: this.clearForm(),
                    lead: lead
                })
                doneAlert('Historial actualizado con éxito');
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

    /* ANCHOR CRM GET ONE LEAD ALL INFO */
    getOneLeadInfoAxios = async( lead ) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'crm/lead/' + lead, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { lead } = response.data
                this.setState({
                    ...this.state,
                    modal_one_lead: true,
                    lead: lead,
                    activePage: 1
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

    onChangeEditar = e => {
        const { name, value } = e.target
        const { formEditar } = this.state
        formEditar[name] = value
        this.setState({
            ...this.state,
            formEditar
        })
    }

    onChangeHistorial = e => {
        const { formHistorial } = this.state
        const { name, value } = e.target
        formHistorial[name] = value
        this.setState({
            ...this.state,
            formHistorial
        })
    }

    changeActiveTable = key => {
        const { form, activeTable } = this.state
        if (key !== activeTable) {
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
            modal_agendar: true,
            lead: lead
        })
    }

    handleCloseModal = () => {
        this.setState({
            ...this.state,
            modal_agendar: false,
            lead: ''
        })
    }

    handleCloseModalOneLead = () => {
        this.setState({
            ...this.state,
            modal_one_lead: false,
            lead: ''
        })
    }

    openModalEditar = lead => {
        const { formEditar } = this.state
        formEditar.name = lead.nombre.toUpperCase()
        formEditar.email = lead.email!==null?lead.email:''
        formEditar.telefono = lead.telefono
        formEditar.fecha = new Date(lead.created_at)
        this.setState({
            ...this.state,
            modal_editar: true,
            lead: lead,
            formEditar
        })
    }

    handleCloseModalEditar = () => {
        this.setState({
            ...this.state,
            modal_editar: false,
            lead: ''
        })
    }

    handleChange = (files, item) => {
        const { formHistorial } = this.state
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        formHistorial['adjuntos'][item].value = files
        formHistorial['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            formHistorial
        })
    }

    openModalHistorial = lead => {
        let { activePage } = this.state
        activePage = 1
        this.setState({
            ...this.state,
            modal_historial: true,
            lead: lead,
            activePage
        })
    }

    handleCloseModalHistorial = () => {
        this.setState({
            ...this.state,
            modal_historial: false,
            lead: '',
            formHistorial: this.clearForm(),
        })
    }

    clearForm = () => {
        const { formHistorial } = this.state
        let aux = Object.keys(formHistorial)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    formHistorial[element] = {
                        adjuntos: {
                            files: [],
                            value: '',
                            placeholder: 'Adjuntos'
                        }
                    }
                    break;
                case 'success':
                    formHistorial[element] = 'Contactado'
                    break;
                default:
                    formHistorial[element] = ''
                    break;
            }
            return false
        })
        return formHistorial;
    }

    changeEstatus = (estatus, id) => {
        questionAlert('¿ESTÁS SEGURO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios({ id: id, estatus: estatus }))
    }

    changeOrigen = (origen, id) => {
        questionAlert('¿ESTÁS SEGURO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.changeOrigenAxios({ id: id, origen: origen }))
    }

    openModalWithInput = (estatus, id) => {
        if(estatus === 'En negociación'){
            questionAlert('¿ESTÁS SEGURO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusCanceladoRechazadoAxios({ id: id, estatus: estatus }))
        }else{
            questionAlert2(
                estatus === 'Cancelado' ?
                    'ESCRIBE EL MOTIVO DE CANCELACIÓN' :
                    'ESCRIBE EL MOTIVO DE RECHAZO',
                '',
                () => this.changeEstatusCanceladoRechazadoAxios({ id: id, estatus: estatus }),
                <div>
                    <Form.Control
                        placeholder={
                            estatus === 'Cancelado' ?
                                'MOTIVO DE CANCELACIÓN' :
                                'MOTIVO DE RECHAZO'
                        }
                        className="form-control form-control-solid h-auto py-7 px-6 text-uppercase"
                        id='motivo'
                        as="textarea"
                        rows="3"
                    />
                </div>
            )
        }
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

    changePageDetailsContratado = (lead) => {
        const { history } = this.props
        history.push({
            pathname: '/leads/crm/info/info',
            state: { lead: lead, tipo: 'Contratado' }
        });
    }

    changePageDetailsCR = (lead) => {
        const { history } = this.props
        let status = ''
        if (lead.estatus.estatus === 'Cancelado') {
            status = 'Cancelado'
        }
        else {
            status = 'Rechazado'
        }
        history.push({
            pathname: '/leads/crm/info/info',
            state: { lead: lead, tipo: status }
        });
    }

    changePageDetailsDetenido = (lead) => {
        const { history } = this.props
        history.push({
            pathname: '/leads/crm/info/info',
            state: { lead: lead, tipo: 'Detenido' }
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

    submitForm = e => {
        this.addLeadInfoAxios()
    }

    mostrarFormulario() {
        const { showForm } = this.state
        this.setState({
            ...this.state,
            showForm: !showForm
        })
    }

    onChangePage(pageNumber){
        let { activePage } = this.state
        activePage = pageNumber
        this.setState({
            ...this.state,
            activePage
        })
    }

    componentDidUpdate(){
        $(".pagination").removeClass("page-link");
    }

    printTimeLineContact = (contacto, key) => {
        console.log(key, 'key')
        return(
            <div className = 'timeline timeline-6' key = { key }>
                <div className = 'timeline-items'>
                    <div className = 'timeline-item'>
                        <div className = { contacto.success ? "timeline-media bg-light-success" : "timeline-media bg-light-danger" } >
                            <span className = {contacto.success ? "svg-icon svg-icon-success svg-icon-md" : "svg-icon svg-icon-danger  svg-icon-md"}>
                                { setContactoIcon(contacto) }
                            </span>
                        </div>
                        <div className = { contacto.success ? "timeline-desc timeline-desc-light-success" : "timeline-desc timeline-desc-light-danger" } >
                            <span className = {contacto.success ? "font-weight-bolder text-success" : "font-weight-bolder text-danger" } >
                                { setDateTableLG(contacto.created_at) }
                            </span>
                            <div className="font-weight-light pb-2 text-justify position-relative mt-2 pr-3" 
                                style={{ borderRadius: '0.42rem', padding: '1rem 1.5rem', backgroundColor: '#F3F6F9' }}>
                                <div className = "text-dark-75 font-weight-bold mb-2">
                                    <div className = "d-flex justify-content-between">
                                        { contacto.tipo_contacto ? contacto.tipo_contacto.tipo : '' }
                                        <span className="text-muted text-hover-danger font-weight-bold a-hover"
                                            onClick={(e) => { deleteAlert('¿ESTÁS SEGURO QUE DESEAS ELIMINAR EL CONTACTO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.eliminarContacto(contacto)) }}>
                                            <i className="flaticon2-cross icon-xs" />
                                        </span>
                                    </div>
                                </div>
                                { contacto.comentario }
                                {
                                    contacto.adjunto ?
                                        <div className="d-flex justify-content-end">
                                            <a href={contacto.adjunto.url} target='_blank' rel="noopener noreferrer" className="text-muted text-hover-primary font-weight-bold">
                                                <span className="svg-icon svg-icon-md svg-icon-gray-500 mr-1">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Attachment1.svg')} />
                                                </span>VER ADJUNTO
                                            </a>
                                        </div>
                                    : ''
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { ultimos_contactados, prospectos_sin_contactar, ultimos_ingresados, lead_web, activeTable, leads_en_contacto, leads_en_negociacion, modal_one_lead,
            leads_contratados, leads_cancelados, leads_detenidos, modal_agendar, form, lead, lead_rh_proveedores, options, modal_editar, formEditar, modal_historial, formHistorial, itemsPerPage, activePage} = this.state
        return (
            <Layout active='leads' {...this.props} >
                <Row>
                    <Col lg={4}>
                        <UltimosIngresosCard
                            ultimos_ingresados={ultimos_ingresados}
                            onClick={this.nextPageUltimosIngresados}
                            onClickPrev={this.prevPageUltimosIngresados}
                            clickOneLead = { this.getOneLeadInfoAxios }
                        />
                    </Col>
                    <Col lg={4}>
                        <SinContacto
                            prospectos_sin_contactar={prospectos_sin_contactar}
                            onClick={this.nextPageProspectosSinContactar}
                            onClickPrev={this.prevPageProspectosSinContactar}
                            clickOneLead = { this.getOneLeadInfoAxios }
                        />
                    </Col>
                    <Col lg={4}>
                        <UltimosContactosCard
                            ultimos_contactados={ultimos_contactados}
                            onClick={this.nextUltimosContactados}
                            onClickPrev={this.prevUltimosContactados}
                            clickOneLead = { this.getOneLeadInfoAxios }
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
                                                menualign="right"
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
                                <div className="mb-0">
                                    <div className="form-group row form-group-marginless d-flex justify-content-center mb-0">
                                        <div className="col-md-2">
                                            <InputGray
                                                letterCase={true}
                                                withtaglabel={0}
                                                withtextlabel={1}
                                                withplaceholder={1}
                                                withicon={1}
                                                requirevalidation={0}
                                                withformgroup={1}
                                                name="cliente"
                                                value={form.cliente}
                                                onChange={this.onChange}
                                                type="text"
                                                placeholder="BUSCAR CLIENTE"
                                                iconclass={"flaticon2-search-1"}
                                            />
                                        </div>
                                        {
                                            activeTable !== "web" && activeTable !== "rh-proveedores" && activeTable !== 'cancelados' ?
                                                <div className="col-md-2">
                                                    <InputGray
                                                        letterCase={true}
                                                        withtaglabel={0}
                                                        withtextlabel={1}
                                                        withplaceholder={1}
                                                        withicon={1}
                                                        requirevalidation={0}
                                                        withformgroup={1}
                                                        name="proyecto"
                                                        value={form.proyecto}
                                                        onChange={this.onChange}
                                                        type="text"
                                                        placeholder="BUSCAR PROYECTO"
                                                        iconclass={"flaticon2-search-1"}
                                                    />
                                                </div>
                                                : ''
                                        }
                                        {
                                            activeTable !== 'web' && activeTable !== 'rh-proveedores' ?
                                                <div className="col-md-2">
                                                    <Form.Control
                                                        className="form-control text-uppercase form-control-solid"
                                                        value={form.origen}
                                                        onChange={this.onChange}
                                                        name='origen'
                                                        as="select">
                                                        <option value={0}>Selecciona el origen</option>
                                                        {
                                                            options.origenes.map((origen, key) => {
                                                                return (
                                                                    <option key={key} value={origen.value} className="bg-white" >{origen.text}</option>
                                                                )
                                                            })
                                                        }
                                                    </Form.Control>
                                                </div>
                                                : ''
                                        }
                                        <div className="col-md-2">
                                            <Form.Control className="form-control text-uppercase form-control-solid"
                                                value={form.empresa} onChange={this.onChange} name='empresa' as="select">
                                                <option value={0}>Selecciona la empresa</option>
                                                {
                                                    options.empresas.map((empresa, key) => {
                                                        return (
                                                            <option key={key} value={empresa.value} className="bg-white" >{empresa.name}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Control>
                                        </div>
                                        {
                                            activeTable === 'cancelados' ?
                                                <div className="col-md-2">
                                                    <Form.Control className="form-control text-uppercase form-control-solid"
                                                        value={form.estatus} onChange={this.onChange} name='estatus' as="select">
                                                        <option value={0} > Selecciona el estatus </option>
                                                        <option value="cancelado" className="bg-white" >CANCELADO</option>
                                                        <option value="rechazado" className="bg-white" >RECHAZADO</option>
                                                    </Form.Control>
                                                </div>
                                                : ''
                                        }
                                        {
                                            activeTable === 'rh-proveedores' ?
                                                <div className="col-md-2">
                                                    <Form.Control className="form-control text-uppercase form-control-solid"
                                                        value={form.tipo} onChange={this.onChange} name='tipo' as="select">
                                                        <option value={0} >Tipo</option>
                                                        <option value="proveedor" className="bg-white">PROVEEDOR</option>
                                                        <option value="bolsa_trabajo" className="bg-white">BOLSA DE TRABAJO</option>
                                                    </Form.Control>
                                                </div>
                                                : ''
                                        }
                                        <div className="col-md-1 text-center" onClick={(e) => { e.preventDefault(); this.changeActiveTable(activeTable) }} >
                                            <span className="btn btn-light-primary px-6 font-weight-bold">Buscar</span>
                                        </div>
                                        <div className="col-md-1 text-center" onClick={this.cleanForm} >
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
                                            options={options}
                                            changeOrigen={this.changeOrigen}
                                            openModalEditar={this.openModalEditar}
                                            openModalHistorial={this.openModalHistorial}
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="contacto">
                                        <LeadContacto
                                            leads={leads_en_contacto}
                                            onClickNext={this.nextPageLeadEnContacto}
                                            onClickPrev={this.prevPageLeadEnContacto}
                                            changeEstatus={this.changeEstatus}
                                            openModalWithInput={this.openModalWithInput}
                                            changePageDetails={this.changePageDetailsContacto}
                                            options={options}
                                            changeOrigen={this.changeOrigen}
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="negociacion">
                                        <LeadNegociacion
                                            leads={leads_en_negociacion}
                                            onClickNext={this.nextPageLeadEnNegociacion}
                                            onClickPrev={this.prevPageLeadEnNegociacion}
                                            changeEstatus={this.changeEstatus}
                                            openModalWithInput={this.openModalWithInput}
                                            changePageDetails={this.changePageDetailsNegociacion}
                                            changePageContratar={this.changePageContratar}
                                            changePageCierreVenta={this.changePageCierreVenta}
                                            options={options}
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="contratados">
                                        <LeadContrato
                                            leads={leads_contratados}
                                            onClickNext={this.nextPageLeadContratados}
                                            onClickPrev={this.prevPageLeadContratados}
                                            changePageDetails={this.changePageDetailsContratado}
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="detenidos">
                                        <LeadDetenido
                                            leads={leads_detenidos}
                                            onClickNext={this.nextPageLeadDetenidos}
                                            onClickPrev={this.prevPageLeadDetenidos}
                                            changeEstatus={this.changeEstatus}
                                            openModalWithInput={this.openModalWithInput}
                                            changePageDetails={this.changePageDetailsDetenido}
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="cancelados">
                                        <LeadNoContratado
                                            leads={leads_cancelados}
                                            onClickNext={this.nextPageLeadCancelados}
                                            onClickPrev={this.prevPageLeadCancelados}
                                            changePageDetails={this.changePageDetailsCR}
                                        />
                                    </Tab.Pane>
                                </Tab.Content>
                            </div>
                        </Card>
                    </Tab.Container>
                </Col>
                <Modal title='Agenda una nueva llamada.' show={modal_agendar} handleClose={this.handleCloseModal}>
                    <AgendaLlamada
                        form={form}
                        onChange={this.onChange}
                        onSubmit={this.agendarLlamada}
                        user={this.props.authUser.user}
                        lead={lead}
                    />
                </Modal>
                <Modal size="lg" title='Editar información general' show={modal_editar} handleClose={this.handleCloseModalEditar}>
                    <div className="mt-3">
                        <InformacionGeneral
                            form={formEditar}
                            onChange={this.onChangeEditar}
                            onSubmit={this.submitForm}
                            lead={lead}
                            formeditado={false}
                        />
                    </div>
                </Modal>
                <Modal size="xl" title='HISTORIAL DE CONTACTO' show={modal_historial} handleClose={this.handleCloseModalHistorial}>
                    <div className="d-flex justify-content-end mt-4">
                        <Button
                            icon=''
                            className={"btn btn-light btn-hover-secondary font-weight-bolder p-2"}
                            onClick={() => { this.mostrarFormulario() }}
                            only_icon={"flaticon2-plus icon-13px mr-2"}
                            text='NUEVO CONTACTO'
                        />
                    </div>
                    <div className={this.state.showForm ? 'col-md-12 mb-5' : 'd-none'}>
                        <HistorialContactoForm
                            options={options}
                            formHistorial={formHistorial}
                            onChangeHistorial={this.onChangeHistorial}
                            handleChange={this.handleChange}
                            onSubmit={() => { waitAlert(); this.agregarContacto() }}
                        />
                    </div>
                    <div className="col-md-12 row mx-0 d-flex justify-content-center">
                        <div className="col-md-7 pt-4">
                            {
                                lead ?
                                    lead.prospecto ?
                                        lead.prospecto.contactos.length === 0 ?
                                            <div className="text-center text-dark-75 font-weight-bolder font-size-lg">No se ha registrado ningún contacto</div>
                                        :
                                            lead.prospecto.contactos.map((contacto, key) => {
                                                let limiteInferior = (activePage - 1) * itemsPerPage
                                                let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                                if(contacto.length < itemsPerPage || ( key >= limiteInferior && key <= limiteSuperior))
                                                    return this.printTimeLineContact(contacto, key)
                                                return false
                                            })
                                        : <div className="text-center text-dark-75 font-weight-bolder font-size-lg">No se ha registrado ningún contacto</div>
                                    : <div className="text-center text-dark-75 font-weight-bolder font-size-lg">No se ha registrado ningún contacto</div>
                            }
                            {
                                lead ? 
                                    lead.prospecto ?
                                        lead.prospecto.contactos.length > itemsPerPage ?
                                            <div className="d-flex justify-content-center mt-4">
                                                <Pagination
                                                    itemClass="page-item"
                                                    /* linkClass="page-link" */
                                                    firstPageText = 'Primero'
                                                    lastPageText = 'Último'
                                                    activePage = { activePage }
                                                    itemsCountPerPage = { itemsPerPage }
                                                    totalItemsCount = { lead.prospecto.contactos.length }
                                                    pageRangeDisplayed = { 5 }
                                                    onChange={this.onChangePage.bind(this)}
                                                    itemClassLast="d-none"
                                                    itemClassFirst="d-none"
                                                    prevPageText={<i className='ki ki-bold-arrow-back icon-xs'/>}
                                                    nextPageText={<i className='ki ki-bold-arrow-next icon-xs'/>}
                                                    linkClassPrev="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                    linkClassNext="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                    linkClass="btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 pagination"
                                                    activeLinkClass="btn btn-icon btn-sm border-0 btn-light btn-hover-primary active mr-2 my-1 pagination"
                                                />
                                            </div>
                                        : ''
                                    : ''
                                : ''
                            }
                        </div>
                    </div>
                </Modal>

                {/* ANCHOR MODAL SINGLE ONE LEAD */}
                <Modal size="xl" title='INFORMACIÓN DEL LEAD' 
                    show = { modal_one_lead } handleClose = { this.handleCloseModalOneLead } >
                    <div className = "row mx-0">
                        <div className = "col-md-12">
                            <div className = "d-flex justify-content-between mt-4">
                                <p className = "font-size-h5 text-muted font-size-lg mt-0">
                                    Nombre:&nbsp; <strong className="font-size-h6">{lead.nombre}</strong>
                                </p>
                                {
                                    lead.estatus ? 
                                        <span className="navi-link">
                                            <span className="navi-text">
                                                <span className="label label-xl label-inline w-100 font-weight-bolder" 
                                                    style = { { backgroundColor: lead.estatus.color_fondo, color: lead.estatus.color_texto, border: 'transparent' } }>
                                                    { lead.estatus.estatus.toUpperCase() }
                                                </span>
                                            </span>
                                        </span>
                                    : ''
                                }
                            </div>
                            <div className="separator separator-solid mb-3"></div>
                        </div>
                    </div>
                    <Tab.Container defaultActiveKey = 'info'>
                        {
                            lead.prospecto ?
                                lead.prospecto.contactos ?
                                    lead.prospecto.contactos.length > 0 ?
                                        <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0 mb-4 justify-content-end">
                                            <Nav.Item className="nav-item">
                                                <Nav.Link eventKey="info">
                                                    <span className="nav-text font-weight-bold">INFORMACIÓN GENERAL</span>
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item className="nav-item">
                                                <Nav.Link eventKey="contactos">
                                                    <span className="nav-text font-weight-bold">HISTORIAL DE CONTACTO</span>
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    : ''
                                : ''
                            : ''
                        }
                        <Tab.Content>
                            <Tab.Pane eventKey = 'contactos'>
                                <div className = "row mx-0 justify-content-center">
                                    <div className="col-md-7 pt-4">
                                        {
                                            lead ?
                                                lead.prospecto ?
                                                    lead.prospecto.contactos.length === 0 ?
                                                        <div className="text-center text-dark-75 font-weight-bolder font-size-lg">No se ha registrado ningún contacto</div>
                                                    :
                                                        lead.prospecto.contactos.map((contacto, key) => {
                                                            let limiteInferior = (activePage - 1) * itemsPerPage
                                                            let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                                            if(contacto.length < itemsPerPage || ( key >= limiteInferior && key <= limiteSuperior))
                                                                return this.printTimeLineContact(contacto, key)
                                                            return false
                                                        })
                                                : <div className="text-center text-dark-75 font-weight-bolder font-size-lg">No se ha registrado ningún contacto</div>
                                            : <div className="text-center text-dark-75 font-weight-bolder font-size-lg">No se ha registrado ningún contacto</div>
                                        }
                                        {
                                            lead ? 
                                                lead.prospecto ?
                                                    lead.prospecto.contactos.length > itemsPerPage ?
                                                        <div className="d-flex justify-content-center mt-4">
                                                            <Pagination itemClass="page-item"  firstPageText = 'Primero' lastPageText = 'Último'
                                                                activePage = { activePage } itemsCountPerPage = { itemsPerPage } totalItemsCount = { lead.prospecto.contactos.length }
                                                                pageRangeDisplayed = { 5 } onChange={this.onChangePage.bind(this)} itemClassLast="d-none" 
                                                                itemClassFirst="d-none" prevPageText={<i className='ki ki-bold-arrow-back icon-xs'/>}
                                                                nextPageText={<i className='ki ki-bold-arrow-next icon-xs'/>}
                                                                linkClassPrev="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                                linkClassNext="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                                linkClass="btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 pagination"
                                                                activeLinkClass="btn btn-icon btn-sm border-0 btn-light btn-hover-primary active mr-2 my-1 pagination"
                                                                />
                                                        </div>
                                                    : ''
                                                : ''
                                            : ''
                                        }
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey = 'info'>
                                <div className = "row mx-0 px-lg-2">
                                    {
                                        lead.empresa ? 
                                            <div className="col-md-3">
                                                <div className="d-flex justify-content-start">
                                                    <SymbolIcon tipo = 'info' urlIcon = '/images/svg/Building.svg' />
                                                    <div>
                                                        <div className="font-size-h6 text-dark-75 font-weight-bolder">{lead.empresa.name}</div>
                                                        <div className="font-size-sm text-muted font-weight-bold mt-1">Empresa</div>
                                                    </div>
                                                </div>
                                            </div>
                                        : ''
                                    }
                                    <div className="col-md-3">
                                        <div className="d-flex justify-content-start mr-2">
                                            <SymbolIcon tipo = 'primary' urlIcon = '/images/svg/iPhone-X.svg' />
                                            <div>
                                                <a target="_blank" href={`tel:+${lead.telefono}`} rel="noopener noreferrer"
                                                    className="font-size-h6 text-dark-75 font-weight-bolder text-hover-primary">
                                                    { lead.telefono }
                                                </a>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">TELÉFONO</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex justify-content-start mr-2">
                                            <SymbolIcon tipo = 'info' urlIcon = '/images/svg/Box1.svg' />
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder"><Moment format="DD/MM/YYYY">{lead.created_at}</Moment></div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex justify-content-start mr-2">
                                            <SymbolIcon tipo = 'primary' urlIcon = '/images/svg/Mail.svg' />
                                            <div>
                                                <a target="_blank" href={`mailto:+${lead.email}`} rel="noopener noreferrer"
                                                    className="font-size-h6 text-dark-75 font-weight-bolder text-hover-primary">
                                                    { lead.email }
                                                </a>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">CORREO ELECTRÓNICO</div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        lead.origen ? 
                                            <div className="col-md-3 mt-4">
                                                <div className="d-flex justify-content-start mr-2">
                                                    <SymbolIcon tipo = 'primary' urlIcon = '/images/svg/Folder-cloud.svg' />
                                                    <div>
                                                        <div className="font-size-h6 text-dark-75 font-weight-bolder">{lead.origen.origen}</div>
                                                        <div className="font-size-sm text-muted font-weight-bold mt-1">Origen</div>
                                                    </div>
                                                </div>
                                            </div>
                                        : ''
                                    }
                                    <div className="col-md-9 mt-4">
                                        <div className="d-flex justify-content-start mr-2">
                                            <SymbolIcon tipo = 'info' urlIcon = '/images/svg/Tools.svg' />
                                            <div>
                                                <ul className="list-inline mb-0 font-size-h6 text-dark-75 font-weight-bolder">
                                                    {
                                                        lead.servicios ? 
                                                            lead.servicios.map((servicio, key) => {
                                                                return (
                                                                    <li className="list-inline-item" key={key}>&#8226; {servicio.servicio}</li>
                                                                )
                                                            })
                                                        :
                                                            <li className="list-inline-item">No hay servicios registrados</li>
                                                    }
                                                </ul>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">Servicios</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className = 'col-md-12 mt-4'>
                                        <div className="bg-gray-100 p-3 font-size-lg font-weight-light" >
                                            <strong >Comentario: </strong>{lead.comentario}
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
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