import React, { Component } from 'react'
import axios from 'axios'
import { URL_DEV, URL_ASSETS } from '../constants'
import { setOptions, setEmpresaLogo } from '../functions/setters'
import { errorAlert, printResponseErrorAlert, waitAlert, validateAlert, questionAlert, doneAlert } from '../functions/alert'
import { connect } from 'react-redux'
import { SelectSearchGray, InputGray } from '../components/form-components'
import { Nav, Navbar, Tab, Col, Row, NavDropdown, Form } from 'react-bootstrap'
import { Button } from '../components/form-components'
import WOW from 'wowjs';
import moment from 'moment';
import Swal from 'sweetalert2'
import 'moment/locale/es';
import SVG from "react-inlinesvg";
import { setSingleHeader, toAbsoluteUrl } from "../functions/routers"
import { Modal, ItemSlider } from '../components/singles'
import Moment from 'react-moment'
import TableTickets from '../components/forms/MiProyecto/TableTickets'
import $ from "jquery";
class InicioMiProyecto extends Component {
    state = {
        id: '',
        ticket: {
            estatus_ticket: {
                estatus: ''
            },
            tecnico: {
                nombre: ''
            }
        },
        tickets: [],
        proyecto: '',
        formeditado: 0,
        primeravista: true,
        defaultactivekey: "",
        modal: false,
        modalDetalles: false,
        modalLevantamiento: false,
        showadjuntos: [
            {
                name: 'Fotografías levantamiento',
                value: 'fotografias_levantamiento'
            },
            {
                name: 'Manuales de adaptación',
                value: 'manuales_de_adaptacion'
            },
            {
                name: 'Minutas',
                value: 'minutas'
            },
            {
                name: 'Oficios',
                value: 'oficios'
            },
            {
                name: 'Planos entregados por cliente',
                value: 'planos_entregados_por_cliente'
            },
            {
                name: 'Propuestas arquitectónicas preliminares',
                value: 'propuestas_arquitectonicas_preliminares'
            },
            {
                name: 'Referencias del diseño del proyecto',
                value: 'referencias_del_diseño_del_proyecto'
            },
            {
                name: 'Renders',
                value: 'renders'
            },
            {
                name: 'Sketch Up',
                value: 'sketch_up'
            },
            {
                name: 'Presupuestos preliminares',
                value: 'presupuestos_preliminares'
            },
            {
                name: 'Carta oferta',
                value: 'carta_oferta'
            }
        ],
        data: {
            proyectos: [],
            tickets: [],
            tiposTrabajo: []
        },
        form: {
            proyecto: '',
            tipo_trabajo: '',
            partida: '',
            descripcion: '',
            nombre: '',
            adjuntos: {
                fotos: {
                    value: '',
                    placeholder: 'Fotos del incidente',
                    files: []
                }
            }
        },
        options: {
            proyectos: [],
            partidas: [],
            tiposTrabajo: [],
        },
        adjuntos: [
            {
                name: 'Inicio y planeación',
                value: 'inicio_y_planeacion',
                icon: 'la la-clipboard-list',
                adjuntos: [
                    {
                        name: 'Fotografías levantamiento',
                        value: 'fotografias_levantamiento'
                    },
                    {
                        name: 'Manuales de adaptación',
                        value: 'manuales_de_adaptacion'
                    },
                    {
                        name: 'Minutas',
                        value: 'minutas'
                    },
                    {
                        name: 'Oficios',
                        value: 'oficios'
                    },
                    {
                        name: 'Planos entregados por cliente',
                        value: 'planos_entregados_por_cliente'
                    },
                    {
                        name: 'Propuestas arquitectónicas preliminares',
                        value: 'propuestas_arquitectonicas_preliminares'
                    },
                    {
                        name: 'Referencias del diseño del proyecto',
                        value: 'referencias_del_diseño_del_proyecto'
                    },
                    {
                        name: 'Renders',
                        value: 'renders'
                    },
                    {
                        name: 'Sketch Up',
                        value: 'sketch_up'
                    },
                    {
                        name: 'Presupuestos preliminares',
                        value: 'presupuestos_preliminares'
                    },
                    {
                        name: 'Carta oferta',
                        value: 'carta_oferta'
                    }
                ]
            },
            {
                name: 'Ejecución de obra',
                value: 'ejecucion_de_obra',
                icon: 'la la-hard-hat',
                adjuntos: [
                    {
                        name: 'Datos de cliente',
                        value: 'datos_de_cliente'
                    },
                    {
                        name: 'Contrato cliente',
                        value: 'contrato_cliente'
                    },
                    {
                        name: 'Contrato proveedores y contratistas',
                        value: 'contrato_proveedores_y_contratistas'
                    },
                    {
                        name: 'Reporte fotográfico de avance de obra',
                        value: 'reporte_fotografico_de_avance_de_obra'
                    },
                    {
                        name: 'Presupuesto aprobado por cliente',
                        value: 'presupuesto_aprobado_por_cliente'
                    },
                    {
                        name: 'Programa de obra',
                        value: 'programa_de_obra'
                    },
                    {
                        name: 'Sketch Up aprobados',
                        value: 'sketch_up_aprobados'
                    },
                    {
                        name: 'Renders aprobados',
                        value: 'renders_aprobados'
                    },
                    {
                        name: 'Estimaciones y cierre',
                        value: 'estimaciones_y_cierre'
                    },
                    {
                        name: 'Fianzas y seguros',
                        value: 'fianzas_y_seguros'
                    },
                    {
                        name: 'Presupuestos extras',
                        value: 'presupuestos_extras'
                    }
                ]
            },
            {
                name: 'Entrega',
                value: 'entrega',
                icon: 'la las la-star-o',
                adjuntos: [
                    {
                        name: 'Catálogo de conceptos ASBUILT',
                        value: 'catalogo_de_conceptos_asbuilt'
                    },
                    {
                        name: 'Consignas de matenimiento',
                        value: 'consignas_de_matenimiento'
                    },
                    {
                        name: 'Planos aprobados',
                        value: 'planos_aprobados'
                    },
                    {
                        name: 'Garantía de los equipos',
                        value: 'garantia_de_los_equipos'
                    },
                    {
                        name: 'Garantía de vicios ocultos',
                        value: 'garantia_de_vicios_ocultos'
                    },
                    {
                        name: 'Memorias de cálculo',
                        value: 'memorias_de_calculo'
                    },
                    {
                        name: 'Memorias descriptivas',
                        value: 'memorias_descriptivas'
                    },
                    {
                        name: 'Fichas técnicas',
                        value: 'fichas_tecnicas'
                    },
                    {
                        name: 'Pruebas de instalaciones',
                        value: 'pruebas_de_instalaciones'
                    },
                    {
                        name: 'Fotografías fin de obra',
                        value: 'fotografias_fin_de_obra'
                    },
                    {
                        name: 'Acta de entrega',
                        value: 'acta_de_entrega'
                    }
                ]
            },
            {
                name: 'Mantenimiento',
                value: 'mantenimiento',
                icon: 'la la-tools',
                adjuntos: [
                    {
                        name: 'Fallas y reparaciones por vicios ocultos',
                        value: 'fallas_y_reparaciones_por_vicios_ocultos'
                    },
                    {
                        name: 'Mantenimiento preventivo',
                        value: 'mantenimiento_preventivo'
                    },
                    {
                        name: 'Mantenimiento correctivo',
                        value: 'mantenimiento_correctivo'
                    }
                ]
            }
        ],
        isOpen: false,
        openModalVideo: false,
        showSelect: true,
        tickets_info: {
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "en_contacto"
        },
    }
    getLink = () => {
        return '/leads/crm'
    }
    componentDidMount() {
        new WOW.WOW({
            live: false
        }).init();

        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const proyecto = permisos.find(function (element, index) {
            return element.modulo.url === pathname
        });
        if (!proyecto)
            history.push('/')
        this.getMiProyectoAxios()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                this.setState({
                    ...this.state,
                    id: id
                })
            }
        }
    }
    componentDidUpdate() {
        $(document).scroll(function () {
            var $nav = $(".fixed-top");
            $nav.toggleClass('header-scrolled', $(this).scrollTop() > $nav.height());
        });
    }
    async getMiProyectoAxios() {
        const { access_token, user } = this.props.authUser
        await axios.get(URL_DEV + 'proyectos/mi-proyecto', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyectos, partidas, tiposTrabajo } = response.data
                const { data, options, id } = this.state
                let { proyecto, tickets, showSelect } = this.state
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                options.partidas = setOptions(partidas, 'nombre', 'id')

                data.tiposTrabajo = tiposTrabajo
                data.proyectos = proyectos

                if (id !== '') {
                    proyectos.map((proy) => {
                        if (proy.id === id) {
                            proyecto = proy
                        }
                        return false
                    })
                    if (proyectos.length === 1) {
                        proyecto = proyectos[0]
                        showSelect = false
                    } else {
                        showSelect = true
                    }
                }

                if (id === '') {
                    if (user.tipo.tipo === 'Cliente') {
                        if (proyectos.length > 0) {
                            proyecto = proyectos[0]
                        }
                    }
                }

                if (proyecto !== '') {
                    proyectos.map((element) => {
                        if (element.id === proyecto.id) {
                            proyecto = element
                            data.tickets = element.tickets
                        }
                        return false
                    })
                }

                var now = moment();
                var fecha_proyecto = moment(proyecto.fecha_fin, 'YYYY-MM-DD');
                var fecha_hoy = moment(now, 'YYYY-MM-DD');

                var dias_transcurridos = fecha_hoy.diff(fecha_proyecto, 'days')
                let aux = []
                data.tiposTrabajo.forEach((tipo) => {
                    if (dias_transcurridos >= 365) {
                        if (tipo.tipo !== 'Mantenimiento') {
                            aux.push({
                                name: tipo.tipo,
                                value: tipo.id.toString()
                            })
                        }
                    } else {
                        aux.push({
                            name: tipo.tipo,
                            value: tipo.id.toString()
                        })
                    }
                })
                options.tiposTrabajo = aux
                this.setState({
                    ...this.state,
                    data,
                    options,
                    proyecto,
                    tickets,
                    form: this.clearForm()
                })
                this.getTicketsPage()

            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            if (element !== 'adjuntos')
                form[element] = ''
            else
                form[element] = {
                    adjunto: {
                        value: '',
                        placeholder: 'Ingresa los adjuntos',
                        files: []
                    },
                    fotos: {
                        value: '',
                        placeholder: 'Fotos del incidente',
                        files: []
                    }
                }
            return false
        })
        return form
    }
    updateProyecto = value => {
        const { data, form, adjuntos } = this.state
        let { options } = this.state
        options.tiposTrabajo = []
        let newdefaultactivekey = "";
        form.proyecto = value
        data.proyectos.map((proyecto) => {
            if (proyecto.id.toString() === value.toString()) {
                for (var i = 0; i < adjuntos.length; i++) {
                    var grupo = adjuntos[i];
                    let aux = false
                    grupo.adjuntos.forEach(element => {
                        if (proyecto[element.value].length)
                            aux = true
                    });
                    if (aux) {
                        newdefaultactivekey = grupo.adjuntos[0].value;
                        break;
                    }
                }
                data.tickets = proyecto.tickets

                var now = moment();
                var fecha_proyecto = moment(proyecto.fecha_fin, 'YYYY-MM-DD');
                var fecha_hoy = moment(now, 'YYYY-MM-DD');

                var dias_transcurridos = fecha_hoy.diff(fecha_proyecto, 'days')

                data.tiposTrabajo.forEach((tipo) => {
                    if (dias_transcurridos >= 365) {
                        if (tipo.tipo !== 'Mantenimiento') {
                            options.tiposTrabajo.push({
                                name: tipo.tipo,
                                value: tipo.id.toString()
                            })
                        }
                    } else {
                        options.tiposTrabajo.push({
                            name: tipo.tipo,
                            value: tipo.id.toString()
                        })
                    }
                })
                options.tiposTrabajo.sort(this.compare)
                this.setState({
                    ...this.state,
                    defaultactivekey: newdefaultactivekey,
                    proyecto: proyecto,
                    form: this.clearForm(),
                    data,
                    options
                })
            }
            return false
        })
    }
    compare(a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }
    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    updateTrabajo = value => {
        this.onChange({ target: { value: value, name: 'tipo_trabajo' } })
    }

    updatePartida = value => {
        this.onChange({ target: { value: value, name: 'partida' } })
    }
    changePageEdit = proyecto => {
        const { history } = this.props
        history.push({
            pathname: '/mi-proyecto/ver-proyecto',
            state: { proyecto: proyecto }

        });
    }
    setEmpresaName(proyecto) {
        if (proyecto.empresa) {
            switch (proyecto.empresa.name) {
                case 'INEIN':
                    return 'Infraestructura e Interiores'
                case 'INFRAESTRUCTURA MÉDICA':
                    return 'IM Infraestructura Médica'
                case 'ROCCO':
                    return 'ROCCO'
                default:
                    return proyecto.empresa.name
            }
        }
    }
    setEmpresaColor(proyecto) {
        if (proyecto.empresa) {
            switch (proyecto.empresa.name) {
                case 'INEIN':
                    return 'inein'
                case 'INFRAESTRUCTURA MÉDICA':
                    return 'gold'
                case 'ROCCO':
                    return 'dark'
                default:
                    return 'dark-75'
            }
        }
    }
    setFase(proyecto) {
        let aux = ''
        if (proyecto.fase1)
            aux = 'Fase 1'
        if (proyecto.fase2)
            aux = 'Fase 2'
        if (proyecto.fase3)
            aux = 'Fase 3'
        if (proyecto.fase1 && proyecto.fase2)
            aux = 'Fase 1 y 2'
        if (proyecto.fase1 && proyecto.fase3)
            aux = 'Fase 1 y 3'
        if (proyecto.fase2 && proyecto.fase3)
            aux = 'Fase 2 y 3'
        if (proyecto.fase1 && proyecto.fase2 && proyecto.fase3)
            aux = 'Fase 1, 2 y 3'
        return aux
    }
    formatDay(fechaInicio, fechaFinal) {
        let fecha_inicio = moment(fechaInicio);
        let fecha_final = moment(fechaFinal);
        let formatInicio = fecha_inicio.locale('es').format("DD MMM YYYY");
        let formatFinal = fecha_final.locale('es').format("DD MMM YYYY");
        return formatInicio.replace('.', '') + ' - ' + formatFinal.replace('.', '');
    }
    seleccionaradj(adjuntos) {
        const { proyecto } = this.state;
        let newdefaultactivekey = "";
        for (var i = 0; i < adjuntos.length; i++) {
            var adjunto = adjuntos[i];
            if (proyecto[adjunto.value].length) {
                newdefaultactivekey = adjunto.value
                break;
            }
        }
        this.setState({
            ...this.state,
            primeravista: false,
            defaultactivekey: newdefaultactivekey,
            subActiveKey: newdefaultactivekey,
            showadjuntos: adjuntos
        })
    }
    updateActiveTabContainer = active => {
        this.setState({
            ...this.state,
            subActiveKey: active
        })
    }
    async getProyectoAdjuntosZip(array) {
        const { access_token } = this.props.authUser
        const { proyecto } = this.state
        let aux = { tipo: array }
        waitAlert()
        await axios.post(URL_DEV + 'proyectos/' + proyecto.id + '/adjuntos/zip', aux, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const url = URL_ASSETS + '/storage/adjuntos.zip'
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', proyecto.nombre + '.zip');
                document.body.appendChild(link);
                link.click();
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    openModalSee = (ticket) => {
        this.setState({
            ...this.state,
            modal: true,
            formeditado: 0,
            ticket: ticket
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ...this.state,
            modal: !modal,
            ticket: ''
        })
    }

    openModalDetalles = (ticket) => {
        this.setState({
            ...this.state,
            modalDetalles: true,
            formeditado: 0,
            ticket: ticket
        })
    }

    handleCloseDetalles = () => {
        const { modalDetalles } = this.state
        this.setState({
            ...this.state,
            modalDetalles: !modalDetalles,
            ticket: ''
        })
    }
    openModalLevantamiento = () => { this.setState({ ...this.state, modalLevantamiento: true }) }

    handleCloseLevantamiento = () => {
        const { modalLevantamiento } = this.state
        this.setState({
            ...this.state,
            modalLevantamiento: !modalLevantamiento,
        })
    }
    handleChange = (files, item) => {
        questionAlert('ENVIAR ARCHIVO', '¿ESTÁS SEGURO QUE DESEAS ENVIARLO?', () => this.onChangeAdjunto({ target: { name: item, value: files, files: files } }))
    }
    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
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
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    onSubmit = (e) => {
        e.preventDefault()
        waitAlert()
        this.addTicketAxios();
    }
    async addTicketAxios() {
        const { access_token } = this.props.authUser
        const { form, proyecto } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element]);
                    break
            }
            return false
        })
        aux = Object.keys(form.adjuntos)
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
        data.append('proyecto', proyecto.id)
        await axios.post(URL_DEV + 'proyectos/mi-proyecto/tickets', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ticket fue solicitado con éxito.')
                const { history } = this.props
                history.push({ pathname: '/mi-proyecto' })

                this.getMiProyectoAxios()

                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    modalLevantamiento: false
                })
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    changeEstatus = estatus => {
        const { ticket } = this.state
        questionAlert('¿ESTÁS SEGURO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios({ id: ticket.id, estatus: estatus }))
    }

    async changeEstatusAxios(data) {
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'calidad/estatus/' + data.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.setState({
                    ...this.state,
                    modal: false
                })
                if (data.estatus) {
                    doneAlert('El ticket fue actualizado con éxito.')
                    this.getMiProyectoAxios()
                }
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    nextPageLeadEnContacto = (e) => {
        e.preventDefault()
        const { tickets_info } = this.state
        if (tickets_info.numPage < tickets_info.total_paginas - 1) {
            tickets_info.numPage++
            this.setState({
                tickets_info
            })
        }
        this.getTicketsPage()
    }

    prevPageLeadEnContacto = (e) => {
        e.preventDefault()
        const { tickets_info } = this.state
        if (tickets_info.numPage > 0) {
            tickets_info.numPage--
            this.setState({
                tickets_info
            })
            this.getTicketsPage()
        }
    }
    getTicketsPage = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { tickets_info, form, proyecto } = this.state
        await axios.get(`${URL_DEV}v2/mi-proyecto/tickets/${tickets_info.numPage}?id=${proyecto.id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { total, page, tickets } = response.data
                const { tickets_info } = this.state
                tickets_info.total = total
                tickets_info.numPage = page
                let total_paginas = Math.ceil(total / 10)
                tickets_info.total_paginas = total_paginas
                this.setState({ ...this.state, tickets_info, tickets })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    render() {
        const { options, form, proyecto, showSelect, primeravista, defaultactivekey, subActiveKey, adjuntos, showadjuntos, tickets, data, ticket, modal, modalDetalles, modalLevantamiento, formeditado, tickets_info } = this.state
        return (
            <div>
                <div>
                    <header id="header" className="header-cliente fixed-top">
                        <div className="container-fluid padding-container mx-auto">
                            <Navbar expand="lg" className="navbar-cliente ">
                                <Navbar.Brand href="https://infraestructuramedica.mx/" target="_blank" rel="noopener noreferrer" className="logo d-flex align-items-center">
                                    {
                                        setEmpresaLogo(proyecto) !== '' ?
                                            <img alt="" className="img-logo" src={setEmpresaLogo(proyecto)} />
                                            : ''
                                    }
                                </Navbar.Brand>
                                {
                                    proyecto &&
                                    <>
                                        <Navbar.Toggle />
                                        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-flex-end" >
                                            <Nav.Link className="nav-cliente" href="#inicio">
                                                Inicio
                                            </Nav.Link>
                                            <Nav.Link className="nav-cliente" href="#informacion">
                                                Información
                                            </Nav.Link>
                                            {
                                                proyecto.adjuntos.length ?
                                                    <Nav.Link className="nav-cliente" href="#material">
                                                        Material
                                                    </Nav.Link>
                                                    : ''
                                            }
                                            {
                                                proyecto.mantenimiento_correctivo.length ?
                                                    <Nav.Link className="nav-cliente">
                                                        Mantenimiento
                                                    </Nav.Link>
                                                    : ''
                                            }
                                            {
                                                proyecto.avances.length ?
                                                    <Nav.Link className="nav-cliente" href="#avances">
                                                        Avances
                                                    </Nav.Link>
                                                    : ''
                                            }
                                            <Nav.Link className="nav-cliente" href="#tickets">
                                                Tickets
                                            </Nav.Link>
                                            {
                                                proyecto.bitacora !== null ?
                                                    <Nav.Link className="nav-cliente">
                                                        Bitácora
                                                    </Nav.Link>
                                                    : ''
                                            }
                                        </Navbar.Collapse>
                                    </>
                                }
                            </Navbar>
                        </div>
                    </header>
                    <section id="inicio" className="bienvenida-cliente d-flex align-items-center place-content-center" style={{ backgroundImage: "url('/hero-bg.png')" }}>
                        <div>
                            {
                                showSelect &&
                                <div className="row mx-0 col-md-12 d-flex justify-content-flex-end mb-20 mt-10">
                                    <div className="col-md-7 d-flex justify-content-end">
                                        <div className="wow fadeInUp col-md-4" data-wow-delay="700">
                                            <SelectSearchGray
                                                options={options.proyectos}
                                                placeholder="SELECCIONE UN PROYECTO"
                                                name="proyecto"
                                                value={form.proyecto}
                                                onChange={this.updateProyecto}
                                                requirevalidation={0}
                                                customdiv="mb-0"
                                                withtaglabel={0}
                                                withtextlabel={0}
                                                withicon={1}
                                                iconvalid={1}
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="row mx-0 col-md-11 d-flex">
                                <div className="col-md-7 d-flex flex-column justify-content-center">
                                    <div className="padding-col-7">
                                        <h1 className="wow fadeInUp">{proyecto.nombre}</h1>
                                        <span className="d-flex flex-column">
                                            <h2 className={`wow fadeInUp ${proyecto ? 'margin-y-30px' : 'mb-0'} ${showSelect ? 'order-1' : 'order-2'}`} data-wow-delay="400">Plaforma administrativa</h2>
                                            <h4 className={`wow fadeInUp order-3 ${!showSelect && proyecto ? '' : 'margin-y-30px'}`} data-wow-delay="700">
                                                En este sitio podrás encontrar información importante de tu proyecto, como datos generales, avances, material,
                                                levantamiento de tickets, bitácora, entre otros, de acuerdo al progreso del mismo.
                                            </h4>
                                            {
                                                proyecto &&
                                                <h3 className={`wow fadeInUp mb-0 text-${this.setEmpresaColor(proyecto)} ${showSelect ? 'order-2 ' : 'order-1 margin-y-30px'}`}>{this.setEmpresaName(proyecto)}</h3>
                                            }
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-5 bienvenida-img text-center wow pulse" data-wow-delay="400">
                                    <img src="/bienvenida-img.png" className="img-fluid" alt="" />
                                </div>
                            </div>
                        </div>
                    </section>
                    {
                        proyecto &&
                        <>
                            <section id="informacion" className="features bg-blue-proyecto">
                                <div className="container fadeInUp">
                                    <div className="row mx-0 feature-icons justify-content-center fadeInUp">
                                        <h3>Información del proyecto</h3>
                                        <div className="row mx-0 col-md-12">
                                            <div className="col-xl-5 text-center fadeInRight" data-wow-delay="100">
                                                <SVG src={toAbsoluteUrl('/images/svg/Construction-info.svg')} />
                                            </div>
                                            <div className="col-xl-7 d-flex content">
                                                <div className="row align-self-center gy-4 mx-0 mt-5">
                                                    {
                                                        proyecto.contacto !== "Sin información" &&
                                                        <div className="col-md-6 icon-box align-items-center mb-7 fadeInUp" data-wow-delay="500">
                                                            <i className="las la-user-alt"></i>
                                                            <div>
                                                                <h4>Contacto</h4>
                                                                <p>{proyecto.contacto}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        proyecto.numero_contacto !== "Sin información" &&
                                                        <div className="col-md-6 icon-box align-items-center mb-7 fadeInUp" data-wow-delay="500">
                                                            <i className="las la-phone"></i>
                                                            <div>
                                                                <h4>Número de contacto</h4>
                                                                <p>{proyecto.numero_contacto}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        proyecto.fecha_inicio &&
                                                        <div className="col-md-6 icon-box align-items-center mb-7 fadeInUp" data-wow="fade-up">
                                                            <i className="las la-calendar"></i>
                                                            <div>
                                                                <h4>Periodo</h4>
                                                                <p>{this.formatDay(proyecto.fecha_inicio, proyecto.fecha_fin)}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        proyecto.tipo_proyecto &&
                                                        <div className="col-md-6 icon-box align-items-center mb-7 fadeInUp" data-wow-delay="100">
                                                            <i className="las la-toolbox"></i>
                                                            <div>
                                                                <h4>Tipo de proyecto</h4>
                                                                <p>{proyecto.tipo_proyecto}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        proyecto.m2 > 0 &&
                                                        <div className="col-md-6 icon-box align-items-center mb-7 fadeInUp" data-wow-delay="200">
                                                            <i className="las la-ruler"></i>
                                                            <div>
                                                                <h4>M²</h4>
                                                                <p>{proyecto.m2}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        proyecto.fase3 === 0 && proyecto.fase2 === 0 && proyecto.fase1 === 0 ? <></> :
                                                            <div className="col-md-6 icon-box align-items-center mb-7 fadeInUp" data-wow-delay="300">
                                                                <i className="las la-tools"></i>
                                                                <div>
                                                                    <h4>Fase</h4>
                                                                    <p>
                                                                        {this.setFase(proyecto)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                    }
                                                    {
                                                        proyecto.cp &&
                                                        <div className="col-md-6 icon-box align-items-center mb-7 fadeInUp" data-wow-delay="400">
                                                            <i className="las la-map-pin"></i>
                                                            <div>
                                                                <h4>Código postal</h4>
                                                                <p>{proyecto.cp}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        proyecto.estado &&
                                                        <div className="col-md-6 icon-box align-items-center mb-7 fadeInUp" data-wow-delay="500">
                                                            <i className="las la-globe"></i>
                                                            <div>
                                                                <h4>Estado</h4>
                                                                <p>{proyecto.estado}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        proyecto.municipio &&
                                                        <div className="col-md-6 icon-box align-items-center mb-7 fadeInUp" data-wow-delay="500">
                                                            <i className="las la-map"></i>
                                                            <div>
                                                                <h4>Municipio/Delegación</h4>
                                                                <p>{proyecto.municipio}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        proyecto.colonia &&
                                                        <div className="col-md-6 icon-box align-items-center mb-7 fadeInUp" data-wow-delay="500">
                                                            <i className="las la-map-marker"></i>
                                                            <div>
                                                                <h4>Colonia</h4>
                                                                <p>{proyecto.colonia}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        proyecto.calle &&
                                                        <div className="col-md-6 icon-box align-items-center mb-7 text-justify fadeInUp" data-wow-delay="500">
                                                            <i className="las la-map-marked-alt"></i>
                                                            <div>
                                                                <h4>Calle y número</h4>
                                                                <p>{proyecto.calle}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {
                                proyecto.adjuntos.length ?
                                    <section id="material">
                                        <div className="container fadeInUp">
                                            <div className="title-proyecto">ADJUNTOS DEL PROYECTO</div>
                                            <Nav as="ul" className="nav nav-tabs justify-content-start nav-bolder">
                                                {
                                                    adjuntos.map((grupo, key) => {
                                                        let aux = false
                                                        grupo.adjuntos.forEach(element => {
                                                            if (proyecto[element.value].length)
                                                                aux = true
                                                        });
                                                        if (aux) {
                                                            return (
                                                                <div key={key}>
                                                                    <Nav.Item as="li" className="mr-2">
                                                                        <Nav.Link data-toggle="tab" className={primeravista && key === 0 ? "active rounded-0" : " rounded-0"} eventKey={grupo.value} onClick={() => { this.seleccionaradj(grupo.adjuntos) }}>
                                                                            <span className="nav-icon">
                                                                                <i className={`icon-lg ${grupo.icon}`}></i>
                                                                            </span>
                                                                            <span className="nav-text">
                                                                                {grupo.name}
                                                                            </span>
                                                                        </Nav.Link>
                                                                    </Nav.Item>
                                                                </div>
                                                            )
                                                        }
                                                        return aux
                                                    })
                                                }
                                            </Nav>
                                            <Tab.Container activeKey={subActiveKey ? subActiveKey : defaultactivekey} defaultActiveKey={defaultactivekey}
                                                onSelect={(select) => { this.updateActiveTabContainer(select) }}>
                                                <Row className="mx-0 bg-blue-proyecto">
                                                    <Col md={3} className="navi navi-accent nav-bold d-flex align-items-center pl-5 ">
                                                        <Nav variant="pills" className="flex-column navi navi-accent nav-bolder width-inherit">
                                                            {
                                                                showadjuntos.map((adjunto, key) => {
                                                                    if (proyecto[adjunto.value].length) {
                                                                        return (
                                                                            <Nav.Item className="navi-item mb-3" key={key}>
                                                                                <Nav.Link className="navi-link rounded-0 bg-active" eventKey={adjunto.value}>
                                                                                    <div className="navi-text font-size-lg">{adjunto.name}</div>
                                                                                </Nav.Link>
                                                                            </Nav.Item>
                                                                        )
                                                                    }
                                                                    return false
                                                                })
                                                            }
                                                        </Nav>
                                                    </Col>
                                                    <Col md={9} className="py-5">
                                                        <Tab.Content>
                                                            {
                                                                showadjuntos.map((adjunto, key) => {
                                                                    if (proyecto[adjunto.value].length) {
                                                                        return (
                                                                            <Tab.Pane key={key} eventKey={adjunto.value}>
                                                                                {
                                                                                    proyecto ?
                                                                                        proyecto[adjunto.value].length ?
                                                                                            <div className="mb-5 d-flex justify-content-center">
                                                                                                <span className='btn btn-sm font-weight-bolder text-success align-self-center font-size-lg' onClick={(e) => { e.preventDefault(); this.getProyectoAdjuntosZip([adjunto.value]) }}>
                                                                                                    <i className="la la-file-archive icon-xl text-success"></i> Descargar ZIP
                                                                                                </span>
                                                                                            </div>
                                                                                            : ''
                                                                                        : ''
                                                                                }
                                                                                {
                                                                                    proyecto ?
                                                                                        <ItemSlider items={proyecto[adjunto.value]} item={adjunto.value} />
                                                                                        : ''
                                                                                }
                                                                            </Tab.Pane>
                                                                        )
                                                                    }
                                                                    return false
                                                                })
                                                            }
                                                        </Tab.Content>
                                                    </Col>
                                                </Row>
                                            </Tab.Container>
                                        </div>
                                    </section>
                                    : ''
                            }
                            <section id="tickets" className="border-y-blue">
                                <div className="title-proyecto">ESTATUS DE TICKETS</div>
                                <div className="container fadeInUp">
                                    <div className="d-flex justify-content-end mb-10">
                                        <span className='btn btn-sm font-weight-bolder text-pink align-self-center font-size-lg' onClick={(e) => { e.preventDefault(); this.openModalLevantamiento() }}>
                                            <i className="la la-file-archive icon-xl text-pink"></i> NUEVO LEVANTAMIENTO
                                        </span>
                                    </div>
                                    <TableTickets tickets={data.tickets} openModalSee={this.openModalSee} openModalDetalles={this.openModalDetalles} tickets_info={tickets_info} onClickNext={this.nextPageTicket}
                                        onClickPrev={this.prevPageTicket} />
                                </div>
                            </section>
                            <section id="avances" className="bg-blue-proyecto">
                                <div className="container fadeInUp">
                                    <div className="title-proyecto">AVANCES POR SEMANA</div>
                                    {
                                        proyecto ?
                                            proyecto.avances.length ?
                                                <>
                                                    <div className="row mx-0">
                                                        {
                                                            proyecto.avances.map((avance, key) => {
                                                                return (
                                                                    <a rel="noopener noreferrer" target="_blank" href={avance.pdf} className="text-dark-75 text-hover-primary d-flex flex-column col-md-2 align-items-center" key={key}>
                                                                        <div className="symbol symbol-60px mb-5">
                                                                            <SVG src={toAbsoluteUrl('/images/svg/Files/PDF.svg')} />
                                                                        </div>
                                                                        <div className="font-size-lg font-weight-bolder mb-2">SEMANA {avance.semana}</div>
                                                                    </a>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </>
                                                : ''
                                            : ''
                                    }
                                </div>
                            </section>
                            <section id="values" className="values">
                                <div className="container" data-aos="fade-up">
                                    <div className="title-proyecto">AVANCES POR SEMANA</div>
                                    <div className="row mx-0">
                                        {
                                            proyecto.avances.map((avance, key) => {
                                                return (
                                                    <div className="col-md-4 mt-4 mt-lg-0" key={key} rel="noopener noreferrer" target="_blank" href={avance.pdf}>
                                                        <div className="box fadeInUp" data-wow-delay="200">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Files/PDF.svg')} />
                                                            <h3 >SEMANA {avance.semana}</h3>
                                                            <p>{avance.actividades}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                </div>

                            </section>
                        </>
                    }
                </div>
                <Modal size="lg" title='Levantamiento de tickets' show={modalLevantamiento} handleClose={this.handleCloseLevantamiento} customcontent={true} contentcss="modal modal-sticky modal-sticky-bottom-right d-block modal-sticky-lg modal-dialog modal-dialog-scrollable">
                    <Form id="form-miproyecto"
                        onSubmit={
                            (e) => {
                                e.preventDefault();
                                validateAlert(this.onSubmit, e, 'form-miproyecto')
                            }
                        }
                    >
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-6">
                                <SelectSearchGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    customdiv="mb-0"
                                    formeditado={formeditado}
                                    options={options.tiposTrabajo}
                                    placeholder="SELECCIONA EL TIPO DE TRABAJO"
                                    name="tipo_trabajo"
                                    value={form.tipo_trabajo}
                                    onChange={this.updateTrabajo}
                                    iconclassName={"fas fa-book"}
                                    messageinc="Incorrecto. Selecciona el tipo de trabajo"
                                />
                            </div>
                            <div className="col-md-6">
                                <SelectSearchGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    customdiv="mb-0"
                                    formeditado={formeditado}
                                    options={options.partidas}
                                    placeholder="SELECCIONA LA PARTIDA"
                                    name="partida"
                                    value={form.partida}
                                    onChange={this.updatePartida}
                                    iconclassName={" fas fa-book"}
                                    messageinc="Incorrecto. Selecciona la partida"
                                />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12">
                                <InputGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withplaceholder={1}
                                    withicon={0}
                                    withformgroup={0}
                                    requirevalidation={1}
                                    formeditado={formeditado}
                                    as="textarea"
                                    placeholder="DESCRIPCIÓN DEL PROBLEMA"
                                    rows="2"
                                    value={form.descripcion}
                                    name="descripcion"
                                    onChange={this.onChange}
                                    messageinc="Incorrecto. Ingresa una descripción."
                                />
                            </div>
                        </div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12">
                                <ItemSlider
                                    items={form.adjuntos.fotos.files}
                                    handleChange={this.handleChange}
                                    item="fotos"
                                />
                            </div>
                        </div>
                        <div className="card-footer p-0 pt-5">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-right px-0">
                                    <Button text='SOLICITAR' type='submit' className="btn btn-primary" icon='' />
                                </div>
                            </div>
                        </div>
                    </Form >
                </Modal>
                <Modal size="lg" title="Presupuesto" show={modal} handleClose={this.handleClose} >
                    <div className="mt-4">
                        {
                            ticket ?
                                <ItemSlider
                                    items={ticket.presupuesto}
                                    item={'presupuesto'}
                                />
                                : ''
                        }
                    </div>
                    <div className="d-flex justify-content-center mt-5">
                        {
                            ticket ?
                                ticket.estatus_ticket ?
                                    ticket.estatus_ticket.estatus === "Respuesta pendiente" ?
                                        <>
                                            <Button
                                                onClick={() => { this.changeEstatus('En proceso') }}
                                                className={"btn btn-icon btn-light-success btn-sm mr-2"}
                                                only_icon={"flaticon2-check-mark icon-sm"}
                                                tooltip={{ text: 'ACEPTAR' }}
                                                icon=''
                                            />
                                            <Button
                                                onClick={() => { this.changeEstatus('En espera') }}
                                                className="btn btn-icon  btn-light-danger btn-sm pulse pulse-danger"
                                                only_icon={"flaticon2-cross icon-sm"}
                                                tooltip={{ text: 'RECHAZAR' }}
                                                icon=''
                                            />
                                        </>
                                        : ''
                                    : ''
                                : ''
                        }
                    </div>
                </Modal>
                <Modal size="lg" title="Detalles del levantamiento" show={modalDetalles} handleClose={this.handleCloseDetalles} >
                    <Tab.Container defaultActiveKey="first">
                        <Nav className="nav nav-tabs nav-tabs-space-lg nav-tabs-line nav-tabs-bold nav-tabs-line-2x mt-2">
                            <Nav.Item>
                                <Nav.Link eventKey="first"> <span className="nav-text font-weight-bold">Información general</span></Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <NavDropdown title={
                                    <>
                                        <span className="nav-text font-weight-bold ml-0">REPORTES FOTOGRÁFICOS</span>
                                    </>}>
                                    <NavDropdown.Item className="ml-0 proyecto" eventKey="second">PROBLEMA REPORTADO</NavDropdown.Item>
                                    <NavDropdown.Item className="ml-0 proyecto" eventKey="third">PROBLEMA SOLUCIONADO</NavDropdown.Item>
                                </NavDropdown>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>
                            {
                                ticket ?
                                    <>
                                        <Tab.Pane eventKey="first" className="mt-5">
                                            <p className="text-justify font-size-lg my-7 font-weight-light">
                                                <span className="font-weight-bold mr-2">Descripción de la solición:</span>{ticket.descripcion_solucion !== "null" ? ticket.descripcion_solucion : ''}
                                            </p>
                                            <div className="table-responsive mt-5">
                                                <div className="list min-w-500px" data-inbox="list">
                                                    <div className="d-flex justify-content-center align-items-center list-item my-5">
                                                        <div className={ticket.recibe !== "null" ? "col-md-4 d-flex align-items-center justify-content-center px-0" : "col-md-6 d-flex align-items-center justify-content-center px-0"}>
                                                            <div className="symbol symbol-35 symbol-light-primary mr-3 flex-shrink-0">
                                                                <div className="symbol-label">
                                                                    <span className="svg-icon svg-icon-primary svg-icon-lg">
                                                                        <SVG src={toAbsoluteUrl('/images/svg/clock.svg')} />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {
                                                                ticket ?
                                                                    ticket.tecnico_asiste ?
                                                                        <div className="d-flex flex-column font-weight-bold">
                                                                            <div className="text-dark mb-1 ">{ticket.tecnico_asiste}</div>
                                                                            <span className="text-muted ">TÉCNICO QUE ASISTE</span>
                                                                        </div>
                                                                        : ''
                                                                    : ''
                                                            }
                                                        </div>
                                                        <div className={ticket.recibe !== "null" ? "col-md-4 d-flex align-items-center justify-content-center px-0" : "col-md-6 d-flex align-items-center justify-content-center px-0"}>
                                                            <div className="symbol symbol-35 symbol-light-primary mr-3 flex-shrink-0">
                                                                <div className="symbol-label">
                                                                    <span className="svg-icon svg-icon-primary svg-icon-lg">
                                                                        <SVG src={toAbsoluteUrl('/images/svg/Building.svg')} />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-column font-weight-bold">
                                                                <div className="text-dark mb-1 ">
                                                                    <Moment format="DD/MM/YYYY">
                                                                        {ticket.fecha_programada}
                                                                    </Moment></div>
                                                                <span className="text-muted ">FECHA PROGRAMADA</span>
                                                            </div>
                                                        </div>
                                                        {
                                                            ticket.recibe !== "null" ?
                                                                <div className={ticket.recibe !== "null" ? "col-md-4 d-flex align-items-center justify-content-center px-0" : "col-md-6 d-flex align-items-center justify-content-center px-0"}>
                                                                    <div className="symbol symbol-35 symbol-light-primary mr-3 flex-shrink-0">
                                                                        <div className="symbol-label">
                                                                            <span className="svg-icon svg-icon-primary svg-icon-lg">
                                                                                <SVG src={toAbsoluteUrl('/images/svg/Menu.svg')} />
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="d-flex flex-column font-weight-bold">
                                                                        <div className="text-dark mb-1 ">
                                                                            {ticket.recibe !== "null" ? ticket.recibe : ''}
                                                                        </div>
                                                                        <span className="text-muted ">¿QUIÉN RECIBE?</span>
                                                                    </div>
                                                                </div>
                                                                : ''
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="second">
                                            {
                                                ticket ?
                                                    <div className="my-3">
                                                        <ItemSlider
                                                            items={ticket.reporte_problema_reportado}
                                                            item={'presupuesto'}
                                                        />
                                                    </div>
                                                    : ''
                                            }
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="third">
                                            {
                                                ticket ?
                                                    <div className="my-3">
                                                        <ItemSlider
                                                            items={ticket.reporte_problema_solucionado}
                                                            item={'presupuesto'}
                                                        />
                                                    </div>
                                                    : ''
                                            }
                                        </Tab.Pane>
                                    </>
                                    : ''
                            }
                        </Tab.Content>
                    </Tab.Container>
                </Modal>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(InicioMiProyecto);