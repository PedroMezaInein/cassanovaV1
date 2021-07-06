import React, { Component } from 'react'
import axios from 'axios'
import { URL_DEV, URL_ASSETS } from '../constants'
import { setOptions, setEmpresaLogo } from '../functions/setters'
import { errorAlert, printResponseErrorAlert, waitAlert, validateAlert, questionAlert, doneAlert } from '../functions/alert'
import { connect } from 'react-redux'
import { SelectSearchGray, InputGray } from '../components/form-components'
import { Nav, Navbar, Tab, Col, Row, NavDropdown, Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Button } from '../components/form-components'
import moment from 'moment';
import Swal from 'sweetalert2'
import 'moment/locale/es';
import SVG from "react-inlinesvg";
import { setSingleHeader, toAbsoluteUrl } from "../functions/routers"
import { Modal, ItemSlider } from '../components/singles'
import Moment from 'react-moment'
import TableTickets from '../components/forms/MiProyecto/TableTickets'
import TableMantenimiento from '../components/forms/MiProyecto/TableMantenimiento'
import $ from "jquery";
import { Link, Element } from 'react-scroll'
import { CommonLottie } from '../components/Lottie'
import { Meetings } from '../assets/animate'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import esLocale from '@fullcalendar/core/locales/es'
import bootstrapPlugin from '@fullcalendar/bootstrap'
class InicioMiProyecto extends Component {
    state = {
        activeFlag: 'calendario',
        mantenimientos: [],
        events: [],
        id: '',
        ticket: {
            estatus_ticket: { estatus: '' }, 
            tecnico: { nombre: '' }
        },
        tickets: [],
        proyecto: '',
        formeditado: 0,
        primeravista: true,
        modal: {
            single : false,
            details: false,
            tickets: false,
        },
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
        form: {
            proyecto: '',
            tipo_trabajo: '',
            partida: '',
            descripcion: '',
            nombre: '',
            mantenimiento: '',
            equipo: '',
            estatus: '',
            costo: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            rubro: [],
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
            equipos:[],
            estatus:[],
            mantenimientos:[
                { label: 'PREVENTIVO', value: 'preventivo', name:'PREVENTIVO' },
                { label: 'CORRECTIVO', value: 'correctivo', name:'CORRECTIVO' }
            ],
            rubro:[
                { label: 'TIPO DE MANTENIMIENTO', value: 'tipo_mantenimiento', name:'TIPO DE MANTENIMIENTO' },
                { label: 'EQUIPO', value: 'equipo', name:'EQUIPO' },
                { label: 'ESTATUS', value: 'estatus', name:'ESTATUS' },
                { label: 'COSTO', value: 'costo', name:'COSTO' },
                { label: 'FECHA', value: 'fecha', name:'FECHA' },
            ]
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

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const modulo = permisos.find(function (element, index) {
            return element.modulo.url === pathname
        });
        if (!modulo)
            history.push('/')
        this.getProyectosAxios()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) { this.getMiProyectoAxios(id) }
        }
        this.changePage(permisos)
    }

    componentDidUpdate() {
        $(document).scroll(function () {
            var $nav = $(".fixed-top");
            $nav.toggleClass('header-scrolled', $(this).scrollTop() > $nav.height());
        });
    }

    updateProyecto = value => {
        const { form } = this.state
        form.proyecto = value
        this.setState({...this.state, form})
        this.getMiProyectoAxios(value)
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
            subActiveKey: newdefaultactivekey,
            showadjuntos: adjuntos
        })
    }

    updateActiveTabContainer = active => { this.setState({ ...this.state, subActiveKey: active }) }

    updateOptions = opciones => {
        const { proyecto } = this.state
        let now = moment();
        let fecha_proyecto = moment(proyecto.fecha_fin, 'YYYY-MM-DD');
        let fecha_hoy = moment(now, 'YYYY-MM-DD');
        let dias_transcurridos = fecha_hoy.diff(fecha_proyecto, 'days')
        let aux = []
        opciones.forEach((tipo) => {
            if (dias_transcurridos >= 365) {
                if (tipo.name !== 'Mantenimiento') { aux.push(tipo) }
            } else { aux.push(tipo) }
        })
        return aux
    }

    updateSelect = (value, name) => {
        const { form } = this.state
        form[name] = value
        this.setState({...this.state, form})
    }

    onChange = e => {
        const { value, name } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({...this.state, form})
    }

    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({ ...this.state, form })
    }

    handleChange = (files, item) => {
        if(files.length)
            this.onChangeAdjunto({ target: { name: item, value: files, files: files } })
    }

    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        files.forEach((file, key) => { aux.push( { name: file.name, file: file, url: URL.createObjectURL(file), key: key } ) })
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({ ...this.state, form })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch(element){
                case 'adjuntos':
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
                    break;
                case 'fechaInicio':
                case 'fechaFin':
                    form[element] =  new Date()
                    break;
                case 'proyecto':
                    break;
                case 'rubro':
                    form[element] = []
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form
    }

    openModalLevantamiento = () => { 
        const { modal } = this.state
        modal.tickets = true
        this.setState({ ...this.state, modal }) 
    }

    openModalSee = (ticket) => {
        const { modal } = this.state
        modal.single = true
        this.setState({ ...this.state, modal, formeditado: 0, ticket: ticket })
    }

    openModalDetalles = (ticket) => {
        const { modal } = this.state
        modal.details = true
        this.setState({ ...this.state, modal, formeditado: 0, ticket: ticket })
    }

    handleClose = () => {
        const { modal } = this.state
        modal.tickets = false
        modal.details = false
        modal.single = false
        this.setState({...this.state, form: this.clearForm(), modal, ticket: '' })
    }

    changeEstatus = estatus => {
        const { ticket } = this.state
        questionAlert('¿ESTÁS SEGURO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios({ id: ticket.id, estatus: estatus }))
    }

    nextPageTicket = (e) => {
        e.preventDefault()
        const { tickets_info } = this.state
        if (tickets_info.numPage < tickets_info.total_paginas - 1) {
            tickets_info.numPage++
            this.setState({ tickets_info })
        }
        this.getTicketsPage()
    }

    prevPageTicket = (e) => {
        e.preventDefault()
        const { tickets_info } = this.state
        if (tickets_info.numPage > 0) {
            tickets_info.numPage--
            this.setState({ tickets_info })
            this.getTicketsPage()
        }
    }

    renderEventContent = (eventInfo) => {
        const { proyecto } = this.state
        let { extendedProps } = eventInfo.event._def
        return (
            <OverlayTrigger overlay={<Tooltip><span className='font-weight-bolder'>{eventInfo.event.title}</span> - {proyecto.nombre}</Tooltip>}>
                <div className="text-hover container p-1 tarea" style={{backgroundColor:eventInfo.backgroundColor, borderColor:eventInfo.borderColor}} onClick={(e) => { e.preventDefault(); this.getInstalacion(extendedProps) }}>
                        <div className="row mx-0 row-paddingless">
                            <div className="col-md-auto mr-1 text-truncate">
                                <i className={`${eventInfo.event._def.extendedProps.iconClass} font-size-17px px-1 text-white`}></i>
                            </div>
                            <div className="col align-self-center text-truncate">
                                <span className="text-white font-weight-bold font-size-12px">{eventInfo.event.title} - {proyecto.nombre}</span>
                            </div>
                        </div>
                    </div>
            </OverlayTrigger>
        )
    }

    changePage = (permisos) => {
        let flag = false
        let { link_url } = this.state
        const calendarioTareas = permisos ? permisos.find(function(element, index) {
            return element.modulo.slug === 'calendario-tareas'
        }) : null;
        if(calendarioTareas){
            flag = true
            link_url ='/usuarios/calendario-tareas'
        }
        const crm = permisos ? permisos.find(function(element, index) {
            return element.modulo.slug === 'crm'
        }) : null;
        if(crm && flag === false){
            flag = true
            link_url ='/leads/crm'
        }
        const tareas = permisos ? permisos.find(function(element, index) {
            return element.modulo.slug === 'tareas'
        }) : null;
        if(tareas && flag === false){
            flag = true
            link_url ='/usuarios/tareas'
        }
        if(permisos === undefined && flag === false){ link_url ='/login' }
        else{ if(flag === false) { link_url =permisos[0].modulo.url } }
        this.setState({ ...this.state, link_url })
    }

    changeActiveFlag = () => {
        const { activeFlag } = this.state
        this.setState({...this.state, activeFlag: activeFlag === 'calendario' ? 'tabla' : 'calendario'})
    }

    getProyectosAxios = async() => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/mi-proyecto`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { proyectos, tiposTrabajo, partidas, status } = response.data
                const { options, form } = this.state
                let show = proyectos.length === 1 ? false : true
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                options.partidas = setOptions(partidas, 'nombre', 'id')
                options.tiposTrabajo = setOptions(tiposTrabajo, 'tipo', 'id')
                options.estatus = setOptions(status, 'estatus', 'id')
                let proyecto = options.proyectos[0]
                form.proyecto = proyecto.value
                this.getMiProyectoAxios(proyecto.value);
                this.setState( { ...this.state, showSelect: show, options, form } )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getMiProyectoAxios = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/mi-proyecto/${id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { adjuntos, options } = this.state
                const { proyecto } = response.data
                let activeKey = ''
                adjuntos.forEach((grupo) => {
                    grupo.adjuntos.forEach(element => {
                        if (proyecto[element.value].length)
                            if(activeKey === '')
                                activeKey = element.value
                    });
                })
                let aux = []
                let aux2 = []
                let aux3 = []
                let objeto
                proyecto.equipos_instalados.forEach((equipo) => {
                    objeto = { value: equipo.equipo.id.toString(), name: equipo.equipo.texto };
                    if(!aux3.includes(objeto)){ aux3.push(objeto) }
                    aux.push( { 
                        title: equipo.equipo.equipo,
                        start: equipo.fecha,
                        end: equipo.fecha,
                        instalacion: equipo,
                        backgroundColor: "#17a2b8",
                        borderColor: "#17a2b8",
                        iconClass: 'la la-toolbox',
                        tipo:'Instalación'
                    })
                    equipo.mantenimientos.forEach((mantenimiento) => {
                        if(mantenimiento.tipo === 'correctivo')
                            aux.push({
                                title: equipo.equipo.equipo,
                                start:mantenimiento.fecha,
                                end:mantenimiento.fecha,
                                instalacion: equipo,
                                backgroundColor: "#2756C3",
                                borderColor: "#2756C3",
                                iconClass: 'la la-tools',
                                tipo:'Mantenimiento'
                            })
                        else
                            aux.push({
                                title: equipo.equipo.equipo,
                                start:mantenimiento.fecha,
                                end:mantenimiento.fecha,
                                instalacion: equipo,
                                backgroundColor: "#eea71a",
                                borderColor: "#eea71a",
                                iconClass: 'la la-tools',
                                tipo:'Mantenimiento'
                            })
                        aux2.push({mantenimiento: mantenimiento, instalacion: equipo})
                    })
                })
                options.equipos = aux3
                this.setState({ ...this.state, proyecto: proyecto, subActiveKey: activeKey, events: aux, mantenimientos: aux2, options })
                this.getTicketsPage()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getProyectoAdjuntosZip = async(array) =>{
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
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addTicketAxios = async () =>{
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, proyecto } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch (element) {
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element]);
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.forEach((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })
        data.append('proyecto', proyecto.id)
        await axios.post(URL_DEV + 'proyectos/mi-proyecto/tickets', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ticket fue solicitado con éxito.')
                this.getMiProyectoAxios(proyecto.id)
                this.handleClose()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getTicketsPage = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { tickets_info, proyecto } = this.state
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

    changeEstatusAxios = async (data) => {
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'calidad/estatus/' + data.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyecto } = this.state
                this.handleClose()
                if (data.estatus) {
                    doneAlert('El ticket fue actualizado con éxito.')
                    this.getMiProyectoAxios(proyecto.id)
                }
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    filtrarTabla = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { proyecto, form } = this.state
        await axios.put(`${URL_DEV}v2/mi-proyecto/${proyecto.id}`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { mantenimientos } = response.data
                let aux = []
                mantenimientos.forEach((mantenimiento) => {
                    aux.push({mantenimiento: mantenimiento, instalacion: mantenimiento.instalacion})
                })
                this.setState({...this.state, mantenimientos: aux})
                Swal.close()
                /* doneAlert(response.data.message !== undefined ? response.data.message : 'Tabla filtrada con éxito.') */
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    render() {
        const { options, form, proyecto, showSelect, primeravista, subActiveKey, defaultactivekey, adjuntos, showadjuntos, tickets, events, ticket, modal, formeditado, tickets_info, link_url, activeFlag, mantenimientos } = this.state
        const { user } = this.props.authUser
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
                                                <Nav.Item className = 'nav-cliente'>
                                                    <Link activeClass="active" offset = { 0 } className="nav-cliente nav-link" to="inicio" spy={true} smooth={true} duration={500} >Inicio</Link>
                                                </Nav.Item>
                                                <Nav.Item className = 'nav-cliente'>
                                                    <Link activeClass="active" offset = { -50 } className="nav-cliente nav-link" to="informacion" spy={true} smooth={true} duration={500} >Información</Link>
                                                </Nav.Item>
                                                {
                                                    proyecto.adjuntos.length ?
                                                        <Nav.Item className = 'nav-cliente'>
                                                            <Link activeClass="active" offset = { -50 } className="nav-cliente nav-link" to="material" spy={true} smooth={true} duration={500} >Material</Link>
                                                        </Nav.Item>
                                                    : ''
                                                }
                                                <Nav.Item className = 'nav-cliente'>
                                                    <Link activeClass="active" offset = { -50 } className="nav-cliente nav-link" to="tickets" spy={true} smooth={true} duration={500} >Tickets</Link>
                                                </Nav.Item>
                                                {
                                                    proyecto.avances.length ?
                                                        <Nav.Item className = 'nav-cliente'>
                                                            <Link activeClass="active" offset = { -50 } className="nav-cliente nav-link" to="avances" spy={true} smooth={true} duration={500} >Avances</Link>
                                                        </Nav.Item>
                                                    : ''
                                                }
                                                {
                                                    proyecto.equipos_instalados.length ?
                                                        <Nav.Item className = 'nav-cliente'>
                                                            <Link activeClass="active" offset = { -50 } className="nav-cliente nav-link" to="mantenimiento" spy={true} smooth={true} duration={500} >Mantenimiento</Link>
                                                        </Nav.Item>
                                                    : ''
                                                }
                                                {
                                                    proyecto.bitacora !== null ?
                                                        <Nav.Link className="nav-cliente" href = { proyecto.bitacora} target = '_blank' rel="noopener noreferrer" >
                                                            Bitácora
                                                        </Nav.Link>
                                                    : ''
                                                }
                                                {
                                                    user.tipo.tipo !== 'Cliente'?
                                                        <Nav.Link className="nav-cliente" href={link_url} >
                                                            Regresar
                                                        </Nav.Link>
                                                    :''
                                                }
                                            </Navbar.Collapse>
                                        </>
                                }
                            </Navbar>
                        </div>
                    </header>
                    <Element name = 'inicio' className="section bienvenida-cliente d-flex align-items-center place-content-center" style={{ backgroundImage: "url('/hero-bg.png')" }}>
                        <div>
                            {
                                showSelect &&
                                    <div className="row mx-0 col-md-12 d-flex justify-content-flex-end mb-20 mt-10">
                                        <div className="col-md-7 d-flex justify-content-end">
                                            <div className="wow fadeInUp col-md-4" data-wow-delay="700">
                                                <SelectSearchGray options = { options.proyectos } placeholder = "SELECCIONE UN PROYECTO" name = "proyecto" 
                                                    value = { form.proyecto } onChange = { this.updateProyecto } requirevalidation = { 0 }  customdiv = "mb-0" 
                                                    withtaglabel = { 0 } withtextlabel = { 0 } withicon = { 1 } iconvalid = { 1 } />
                                            </div>
                                        </div>
                                    </div>
                            }
                            <div className="row mx-auto col-md-11 d-flex">
                                <div className="col-md-6 d-flex flex-column justify-content-center">
                                    <div className="padding-col-7">
                                        <h1 className="wow fadeInUp">{proyecto.nombre}</h1>
                                        <span className="d-flex flex-column">
                                            <h2 className={`wow fadeInUp ${proyecto ? 'margin-y-30px' : 'mb-0'} ${showSelect ? 'order-1' : 'order-2'}`} data-wow-delay="400">Plaforma administrativa</h2>
                                            <h4 className={`wow fadeInUp order-3 ${!showSelect && proyecto ? '' : 'margin-y-30px mb-0'}`} data-wow-delay="700">
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
                                <div className="col-md-6 bienvenida-img px-10 text-center wow pulse" data-wow-delay="400">
                                    <CommonLottie animationData = { Meetings } />
                                </div>
                            </div>
                        </div>
                    </Element>
                    {
                        proyecto &&
                            <>
                                <Element name = 'informacion' className="informacion bg-blue-proyecto section" >
                                    <div className="container fadeInUp">
                                        <div className="row mx-0 feature-icons justify-content-center fadeInUp">
                                            <h3>Información del proyecto</h3>
                                            <div className="row mx-0 col-md-12">
                                                <div className="col-xl-5 text-center my-10 fadeInRight" data-wow-delay="100">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Construction-info.svg')} />
                                                </div>
                                                <div className="col-xl-7 d-flex content">
                                                    <div className="row align-self-center gy-4 mx-0">
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
                                </Element>
                                {
                                    proyecto.adjuntos.length ?
                                        <Element name = 'material' className = 'section' >
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
                                                                            <Nav.Link data-toggle = "tab" className = { primeravista && key === 0 ? "active rounded-0" : " rounded-0" } 
                                                                                eventKey = { grupo.value } onClick = { () => { this.seleccionaradj(grupo.adjuntos) } }>
                                                                                <span className="nav-icon"> <i className={`icon-lg ${grupo.icon}`}></i> </span>
                                                                                <span className="nav-text"> {grupo.name} </span>
                                                                            </Nav.Link>
                                                                        </Nav.Item>
                                                                    </div>
                                                                )
                                                            }
                                                            return aux
                                                        })
                                                    }
                                                </Nav>
                                                <Tab.Container activeKey={subActiveKey ? subActiveKey : defaultactivekey}
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
                                                                                                    <span className='btn btn-sm font-weight-bolder text-success align-self-center font-size-lg box-shadow-button' 
                                                                                                        onClick={(e) => { e.preventDefault(); this.getProyectoAdjuntosZip([adjunto.value]) }}>
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
                                        </Element>
                                        : ''
                                }
                            <Element name = 'tickets' className = 'border-y-blue section' >
                                <div className="title-proyecto">ESTATUS DE TICKETS</div>
                                <div className="container fadeInUp">
                                    <div className="d-flex justify-content-end mb-10">
                                        <span className='btn btn-sm font-weight-bolder text-pink align-self-center font-size-lg box-shadow-button' 
                                            onClick={(e) => { e.preventDefault(); this.openModalLevantamiento() }}>
                                            <i className="la la-file-archive icon-xl text-pink"></i> NUEVO LEVANTAMIENTO
                                        </span>
                                    </div>
                                    <TableTickets tickets = { tickets } openModalSee = { this.openModalSee }  openModalDetalles = { this.openModalDetalles } 
                                        tickets_info = { tickets_info } onClickNext = { this.nextPageTicket } onClickPrev = { this.prevPageTicket } />
                                </div>
                            </Element>
                            {
                                proyecto.avances.length ?
                                    <Element name="avances" className="avances bg-white section">
                                        <div className="container" data-aos="fade-up">
                                            <div className="title-proyecto">AVANCES POR SEMANA</div>
                                            <div className="text-center">
                                                <SVG src={toAbsoluteUrl('/images/svg/Avances-Proyecto.svg')} style={{width:'40%'}}/>
                                            </div>
                                            <div className="row mx-0 mt-12 justify-content-center">
                                                {
                                                    proyecto.avances.map((avance, key) => {
                                                        return (
                                                            <div className="col-md-4 mt-4 mt-lg-0" key={key}>
                                                                <div className="box fadeInUp" data-wow-delay="200">
                                                                    <a rel="noopener noreferrer" target="_blank" href={avance.pdf}>SEMANA {avance.semana}</a>
                                                                    <p>{avance.actividades}</p>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </Element>
                                : ''
                            }
                            {
                                proyecto.equipos_instalados.length ? 
                                    <Element name="mantenimiento" className="section border-y-blue position-relative">
                                        <ul className="sticky-toolbar nav flex-column pl-2 pr-2 pt-3 pb-2 mt-4 position-absolute">
                                            <OverlayTrigger overlay={<Tooltip><span className="text-dark-50 font-weight-bold">
                                                {`${activeFlag === 'tabla' ? 'MOSTRAR CALENDARIO' : 'MOSTRAR TABLA'}`}</span></Tooltip>}>
                                                <li className="nav-item mb-2" onClick={(e) => { e.preventDefault(); this.changeActiveFlag() }} >
                                                    <span className = {`btn btn-sm btn-icon btn-bg-light btn-text-${activeFlag === 'tabla' ? 'primary' : 'info'} btn-hover-${activeFlag === 'tabla' ? 'primary' : 'info'}`}>
                                                        <i className = {`la flaticon2-${activeFlag === 'tabla' ? 'calendar-8' : 'list-2'} icon-xl`}></i>
                                                    </span>
                                                </li>
                                            </OverlayTrigger>
                                        </ul>
                                        <div className="title-proyecto">MANTENIMIENTO</div>
                                        <div className="col-md-11 mx-auto">
                                            {
                                                activeFlag === 'calendario' ?
                                                    <FullCalendar locale={esLocale} plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
                                                        initialView="dayGridMonth" weekends={true} events={events} eventContent={this.renderEventContent}
                                                        firstDay={1} themeSystem='bootstrap' height='1290.37px' />
                                                :
                                                    <TableMantenimiento mantenimientos = { mantenimientos } form = { form } options = { options } 
                                                        onChange = { this.onChange } onChangeRange = { this.onChangeRange } filtrarTabla = { this.filtrarTabla }/>
                                            }
                                        </div>
                                    </Element>
                                : <></>
                            }
                        </>
                    }
                </div>
                {/* <a href="#" className="back-to-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short"></i></a> */}
                <Modal size = "lg" title = 'Levantamiento de tickets' show = {modal.tickets } handleClose = { this.handleClose } 
                    customcontent = { true } contentcss = "modal modal-sticky modal-sticky-bottom-right d-block modal-sticky-lg modal-dialog modal-dialog-scrollable">
                    <Form id="form-miproyecto" onSubmit = { (e) => { e.preventDefault(); validateAlert(this.addTicketAxios, e, 'form-miproyecto') } } >
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-6">
                                <SelectSearchGray withtaglabel = { 1 } withtextlabel = { 1 } customdiv = "mb-0" formeditado = { formeditado }
                                    options = { this.updateOptions(options.tiposTrabajo) } placeholder = "SELECCIONA EL TIPO DE TRABAJO" name = "tipo_trabajo" 
                                    value = { form.tipo_trabajo } onChange = { (value) => { this.updateSelect(value, 'tipo_trabajo') } } iconclassName = "fas fa-book"
                                    messageinc="Incorrecto. Selecciona el tipo de trabajo" />
                            </div>
                            <div className="col-md-6">
                                <SelectSearchGray withtaglabel = { 1 } withtextlabel = { 1 } customdiv = "mb-0" formeditado = { formeditado }
                                    options = { options.partidas } placeholder = "SELECCIONA LA PARTIDA" name = "partida" value = { form.partida }
                                    onChange = { (value) => { this.updateSelect(value, 'partida') } } iconclassName = " fas fa-book" 
                                    messageinc = "Incorrecto. Selecciona la partida" />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12">
                                <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 } withformgroup = { 0 }
                                    requirevalidation = { 1 } formeditado = { formeditado } as = "textarea" placeholder = "DESCRIPCIÓN DEL PROBLEMA"
                                    rows = "2" value = { form.descripcion } name = "descripcion" onChange = { this.onChange }
                                    messageinc = "Incorrecto. Ingresa una descripción." />
                            </div>
                        </div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12">
                                <ItemSlider items = { form.adjuntos.fotos.files } handleChange = { this.handleChange } item = "fotos" />
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
                <Modal size = "lg" title = "Presupuesto" show = { modal.single } handleClose = { this.handleClose } customcontent = { true } 
                    contentcss = "modal modal-sticky modal-sticky-bottom-right d-block modal-sticky-lg modal-dialog modal-dialog-scrollable">
                    <div className="mt-4">
                        { ticket ? <ItemSlider items = { ticket.presupuesto } item = 'presupuesto' /> : '' }
                    </div>
                    <div className="d-flex justify-content-center mt-5">
                        {
                            ticket ?
                                ticket.estatus_ticket ?
                                    ticket.estatus_ticket.estatus === "Respuesta pendiente" ?
                                        <>
                                            <Button onClick = { () => { this.changeEstatus('En proceso') } } 
                                                className = "btn btn-icon btn-light-success btn-sm mr-2" only_icon = "flaticon2-check-mark icon-sm"
                                                tooltip = { { text: 'ACEPTAR' } } icon = '' />
                                            <Button onClick = { () => { this.changeEstatus('En espera') } }
                                                className = "btn btn-icon  btn-light-danger btn-sm pulse pulse-danger" only_icon = "flaticon2-cross icon-sm"
                                                tooltip = { { text: 'RECHAZAR' } } icon = '' />
                                        </>
                                    : ''
                                : ''
                            : ''
                        }
                    </div>
                </Modal>
                <Modal size = "lg" title = "Detalles del levantamiento" show = { modal.details } handleClose = { this.handleClose } customcontent = { true } 
                    contentcss="modal modal-sticky modal-sticky-bottom-right d-block modal-sticky-lg modal-dialog modal-dialog-scrollable" >
                    <Tab.Container defaultActiveKey = "first">
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
                                                        <ItemSlider items = { ticket.reporte_problema_reportado } item = 'presupuesto' />
                                                    </div>
                                                : ''
                                            }
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="third">
                                            {
                                                ticket ?
                                                    <div className="my-3">
                                                        <ItemSlider items = { ticket.reporte_problema_solucionado } item = 'presupuesto' />
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

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(InicioMiProyecto);