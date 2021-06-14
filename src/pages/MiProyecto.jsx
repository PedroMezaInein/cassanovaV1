import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, URL_ASSETS, TICKETS_ESTATUS } from '../constants'
import { errorAlert, waitAlert, doneAlert, questionAlert, printResponseErrorAlert } from '../functions/alert'
import { SelectSearch, SelectSearchGray, Input } from '../components/form-components'
import { setOptions, setLabelTable, setEmpresaLogo } from '../functions/setters'
import { Card, Nav, Tab, Col, Row, NavDropdown, Navbar } from 'react-bootstrap'
import { Button } from '../components/form-components'
import Moment from 'react-moment'
import { Form } from 'react-bootstrap'
import { validateAlert } from '../functions/alert'
import TableForModals from '../components/tables/TableForModals'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../functions/routers"
import { Modal, ItemSlider } from '../components/singles'
import Swal from 'sweetalert2'
import WOW from 'wowjs';
import moment from 'moment'
/* import ModalVideo from 'react-modal-video' */
class MiProyecto extends Component {

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
        openModalVideo:false,
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

    updateActiveTabContainer = active => {
        this.setState({
            ...this.state,
            subActiveKey: active
        })
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

                data.tiposTrabajo.map((tipo) => {
                    if(dias_transcurridos >= 365){
                        if(tipo.tipo !== 'Mantenimiento'){
                            options.tiposTrabajo.push({
                                name: tipo.tipo,
                                value: tipo.id.toString()
                            })
                        }
                    }else{
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
                    tickets: this.setTickets(proyecto.tickets),
                    form: this.clearForm(),
                    data,
                    options
                })
            }
            return false
        })
    }

    compare( a, b ) {
        if ( a.name < b.name ){
            return -1;
        }
        if ( a.name > b.name ){
            return 1;
        }
        return 0;
    }

    async getMiProyectoAxios() {
        const { access_token, user } = this.props.authUser
        await axios.get(URL_DEV + 'proyectos/mi-proyecto', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyectos, partidas, tiposTrabajo } = response.data
                const { data, options, id } = this.state
                let { proyecto, tickets } = this.state
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
                            tickets = this.setTickets(element.tickets)
                        }
                        return false
                    })
                }

                this.setState({
                    ...this.state,
                    data,
                    options,
                    proyecto,
                    tickets,
                    form: this.clearForm()
                })

            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
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
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
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
                    form: this.clearForm()
                })
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    setTickets = (tickets) => {
        let aux = []
        tickets.map((ticket) => {
            aux.push(
                {
                    actions: this.setActions(ticket),
                    fecha: renderToString(this.setDate(ticket.created_at)),
                    partida: renderToString(this.setText(ticket.partida.nombre)),
                    estatus: renderToString(setLabelTable(ticket.estatus_ticket)),
                    descripcion: renderToString(this.setText(ticket.descripcion)),
                    tipo_trabajo: renderToString(this.setText(ticket.tipo_trabajo.tipo)),
                    motivo: renderToString(this.setText(ticket.motivo_cancelacion)),
                    id: ticket.id
                }
            )
            return false
        })
        return aux
    }

    setDate(date) {
        let seconds = new Date(date);
        seconds = seconds.getTime() / 1000;
        return (
            <>
                <span className="d-none" style={{ fontSize: "11.7px" }}>
                    {
                        seconds
                    }
                </span>
                <span className="d-none" style={{ fontSize: "11.7px" }}>
                    <Moment format="YYYY/MM/DD">
                        {date}
                    </Moment>
                </span>

                <Moment format="DD/MM/YYYY" style={{ fontSize: "11.7px" }}>
                    {date}
                </Moment>
            </>
        )
    }

    setText(text) {
        return (
            <span style={{ fontSize: "11.7px" }}>
                {text}
            </span>
        )
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

    handleChange = (files, item) => {
        questionAlert('ENVIAR ARCHIVO', '¿ESTÁS SEGURO QUE DESEAS ENVIARLO?', () => this.onChangeAdjunto({ target: { name: item, value: files, files: files } }))
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

    onchange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    setActions = (ticket) => {
        let aux = []
        if (ticket.presupuesto.length) {
            aux.push(
                {
                    text: 'Ver&nbsp;presupuesto',
                    btnclass: 'primary',
                    iconclass: 'flaticon2-file-1',
                    action: 'see',
                    tooltip: { id: 'see', text: 'Ver presupuesto' }
                }
            )
        }
        if (ticket.estatus_ticket.estatus === "Terminado") {
            aux.push({
                text: 'Ticket&nbsp;final',
                btnclass: 'info',
                iconclass: 'flaticon-list-2',
                action: 'details',
                tooltip: { id: 'details', text: 'Ticket final' }
            })
        }
        return aux
    }

    changeEstatus = estatus => {
        const { ticket } = this.state
        // this.changeEstatusAxios({id: ticket.id, estatus: estatus})
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

    setImage(proyecto){
        if(proyecto){
            if(proyecto.empresa.name==='INEIN'){
                return 'url("/inein_proyecto1.jpg")'
            }else if (proyecto.empresa.name==='INFRAESTRUCTURA MÉDICA'){
                return 'url("/im_proyecto1.jpg")'
            }else{
                return 'url("/header_1.jpg")'
            }
        }else{
            return 'url("/header_1.jpg")'
        }
    }

    showFase (proyecto){
        let aux = ''
        if(proyecto.fase1)
            aux = 'Fase 1'
        if(proyecto.fase2)
            aux =  'Fase 2'
        if(proyecto.fase3)
            aux =  'Fase 3'
        if(proyecto.fase1 && proyecto.fase2)
            aux = 'Fase 1 y 2'
        if(proyecto.fase2 && proyecto.fase3)
            aux = 'Fase 2 y 3'
        if(proyecto.fase1 && proyecto.fase2 && proyecto.fase3)
            aux = 'Fase 1, 2 y 3'
        return aux
    }

    getWebPage = proyecto => {
        if(proyecto)
            if(proyecto.empresa)
                if(proyecto.empresa.pagina_web)
                    return 'https://' + proyecto.empresa.pagina_web;
        return ''
    }

    render() {
        const { options, proyecto, form, adjuntos, showadjuntos, primeravista, defaultactivekey, subActiveKey, formeditado, tickets, data, 
            modal, ticket, modalDetalles, /* openModalVideo */ } = this.state
        return (

            <Layout {...this.props}>
                <section className="py-10 overflow-hidden text-center section-proyecto">
                    <div className="background-holder overlay overlay-1 parallax" style={{ backgroundImage: this.setImage(proyecto) }}>
                    </div>
                    <div className="container">
                        <div className="row d-flex justify-content-center">
                            <div className="row d-flex justify-content-center">
                                <div className="w-auto pb-25rem">
                                    <div className="znav-container znav-white znav-freya znav-fixed" id="znav-container">
                                        <div className="container wow fadeIn" data-wow-delay="1.7s" data-wow-duration="1.5s">
                                            <Navbar expand="lg">
                                                <Navbar.Brand target = '_blank' href = { this.getWebPage(proyecto)} className="overflow-hidden pr-3">
                                                    {
                                                        setEmpresaLogo(proyecto) !== '' ?
                                                            <img alt = '' width="120" src = { setEmpresaLogo(proyecto) }  />
                                                        : ''
                                                    }
                                                </Navbar.Brand>
                                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                                <Navbar.Collapse className="text-center mt-3">
                                                    <Nav className="">
                                                        <div className="widthSelect">
                                                            <SelectSearchGray
                                                                options={options.proyectos}
                                                                placeholder="SELECCIONE UN PROYECTO"
                                                                name="proyecto"
                                                                value={form.proyecto}
                                                                onChange={this.updateProyecto}
                                                                requirevalidation={1}
                                                                messageinc="Incorrecto. Seleccione el proyecto."
                                                                customdiv="mb-0"
                                                                withtaglabel={0}
                                                                withtextlabel={0}
                                                            />
                                                        </div>
                                                    </Nav>
                                                    <Nav.Link href={proyecto.empresa?proyecto.empresa.facebook:''} className="py-0 pt-2">
                                                        <i className="socicon-facebook icon-lg text-hover-dark"></i>
                                                    </Nav.Link>
                                                    <Nav.Link href={proyecto.empresa?proyecto.empresa.linkedin:''}  className="py-0 pt-2">
                                                        <i className="socicon-linkedin icon-lg text-hover-dark"></i>
                                                    </Nav.Link>
                                                    <Nav.Link href={proyecto.empresa?proyecto.empresa.pinterest:''}  className="py-0 pt-2">
                                                        <i className="socicon-pinterest icon-lg text-hover-dark"></i>
                                                    </Nav.Link>
                                                </Navbar.Collapse>
                                            </Navbar>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 wow fadeIn" data-wow-delay="1.7s" data-wow-duration="1.5s">
                                    <div className="overflow-hidden px-5">
                                        <h1 className="text-white mb-3 letter-spacing-1">{proyecto.nombre}</h1>
                                        <div className="text-white mb-3 letter-spacing-1">{this.showFase(proyecto)}</div>
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="mt-3">
                                            {/* ANCHOR Ver video comentario */}
                                            {/* <React.Fragment>
                                                <ModalVideo channel='custom' isOpen={openModalVideo} url='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' autoplay={1} onClose={() => this.setState({openModalVideo: false})} />
                                                    <a className="btn btn-outline-white font-weight-bolder rounded-0 font-size-lg letter-spacing-1" onClick={() => this.setState({openModalVideo: true})}>Ver video</a>
                                            </React.Fragment> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="content pt-4 d-flex flex-column flex-column-fluid " style={{ paddingBottom: "11px" }}>
                    <div className="col-md-12">
                        <div className="row ">
                            <div className="col-lg-4 mb-3 ">
                                <div className="card card-custom wave wave-animate-slow wave-primary mb-8 mb-lg-0 h-100">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center ">
                                            <div className="mr-6">
                                                <span className="svg-icon svg-icon-primary svg-icon-4x">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Bulb1.svg')} />
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <span className="text-dark text-hover-primary font-weight-bold font-size-h4 mb-3 pl-2">PROYECTO</span>
                                                <div className="text-dark-75 pl-2">{proyecto.nombre}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 mb-3 ">
                                <div className="card card-custom wave wave-animate-slow wave-danger mb-8 mb-lg-0 h-100">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className="mr-6">
                                                <span className="svg-icon svg-icon-danger svg-icon-4x">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Earth.svg')} />
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <span className="text-dark text-hover-danger font-weight-bold font-size-h4 mb-3 pl-2">Dirección</span>
                                                <div className="text-dark-75 text-justify pl-2">
                                                    {
                                                        proyecto ?
                                                            <div>
                                                                {proyecto.calle}
                                                                , colonia
                                                                {proyecto.colonia},
                                                                {proyecto.municipio},
                                                                {proyecto.estado}. CP:
                                                                {proyecto.cp}

                                                                {/* <Small className="mr-1 mb-0" >
                                                                    {proyecto.calle}, colonia
                                                                    </Small>
                                                                <Small className="mr-1 mb-0">
                                                                    {proyecto.colonia},
                                                                    </Small>
                                                                <Small className="mr-1 mb-0">
                                                                    {proyecto.municipio},
                                                                    </Small>
                                                                <Small className="mr-1 mb-0">
                                                                    {proyecto.estado}. CP:
                                                                    </Small>
                                                                <Small className="mr-1 mb-0">
                                                                    {proyecto.cp}
                                                                </Small> */}
                                                            </div>
                                                            : ""
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 mb-3">
                                <div className="card card-custom wave wave-animate-slow wave-info mb-8 mb-lg-0 h-100">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className="mr-6">
                                                <span className="svg-icon svg-icon-info svg-icon-4x">
                                                    <SVG src={toAbsoluteUrl('/images/svg/clock.svg')} />
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <span className="text-dark text-hover-info font-weight-bold font-size-h4 mb-3 pl-2">PERIODO</span>
                                                <div className="text-dark-75 pl-2">
                                                    {
                                                        proyecto ?
                                                            <div>
                                                                <Moment format="DD/MM/YYYY">
                                                                    {proyecto.fecha_inicio}
                                                                </Moment>
                                                                {" - "}
                                                                <Moment format="DD/MM/YYYY">
                                                                    {proyecto.fecha_fin}
                                                                </Moment>
                                                            </div>
                                                            : ""
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {proyecto ?
                    <Tab.Container defaultActiveKey="third">
                        <Card className="card-custom">
                            <Card.Header className="card-header-tabs-line">
                                <Nav className="nav nav-tabs nav-tabs-space-lg nav-tabs-line nav-tabs-bold nav-tabs-line-3x">
                                    {
                                        proyecto.adjuntos.length ?
                                            <Nav.Item className="nav-item">
                                                <Nav.Link eventKey="first">
                                                    <span className="nav-icon">
                                                        <span className="svg-icon mr-3">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Attachment1.svg')} />
                                                        </span>
                                                    </span>
                                                    <span className="nav-text font-weight-bold">ADJUNTOS DEL PROYECTO</span>
                                                </Nav.Link>
                                            </Nav.Item>
                                            : ''
                                    }
                                    {proyecto ?
                                        proyecto.avances.length ?
                                            <Nav.Item className="nav-item">
                                                <Nav.Link eventKey="second">
                                                    <span className="nav-icon">
                                                        <span className="svg-icon mr-3">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Shield-check.svg')} />
                                                        </span>
                                                    </span>
                                                    <span className="nav-text font-weight-bold">AVANCES POR SEMANA</span>
                                                </Nav.Link>
                                            </Nav.Item>
                                            : '' : ''
                                    }
                                    <Nav.Item className="nav-item">
                                        <Nav.Link eventKey="third">
                                            <span className="nav-icon">
                                                <span className="svg-icon mr-3">
                                                    <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                                </span>
                                            </span>
                                            <span className="nav-text font-weight-bold">LEVANTAMIENTO DE TICKETS</span>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="nav-item">
                                        <Nav.Link eventKey="fourth">
                                            <span className="nav-icon">
                                                <span className="svg-icon mr-3">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Question-circle.svg')} />
                                                </span>
                                            </span>
                                            <span className="nav-text font-weight-bold">ESTATUS DE TICKETS</span>
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>
                            <Card.Body>
                                <Tab.Content>
                                    <Tab.Pane eventKey="first" className="tab-pane fade">
                                        {
                                            proyecto ?
                                                <div className="col-md-12 mb-4">
                                                    <Nav as="ul" className="nav nav-tabs justify-content-start nav-bold bg-gris-nav bg-gray-100">
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
                                                                                <Nav.Link data-toggle="tab" className={primeravista && key === 0 ? "active rounded-0" : " rounded-0"} eventKey={grupo.value} onClick={() => { this.seleccionaradj(grupo.adjuntos) }}>{grupo.name}</Nav.Link>
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
                                                        <Row className="mt-5 mx-0">
                                                            <Col md={3} className="navi navi-accent navi-hover navi-bold">
                                                                <Nav variant="pills" className="flex-column navi navi-hover navi-active">
                                                                    {
                                                                        showadjuntos.map((adjunto, key) => {
                                                                            if (proyecto[adjunto.value].length) {
                                                                                return (
                                                                                    <Nav.Item className="navi-item" key={key}>
                                                                                        <Nav.Link className="navi-link" eventKey={adjunto.value}>
                                                                                            <span className="navi-text">{adjunto.name}</span>
                                                                                        </Nav.Link>
                                                                                    </Nav.Item>
                                                                                )
                                                                            }
                                                                            return false
                                                                        })
                                                                    }
                                                                </Nav>
                                                            </Col>

                                                            <Col md={9}>
                                                                <Tab.Content>
                                                                    {
                                                                        showadjuntos.map((adjunto, key) => {
                                                                            if (proyecto[adjunto.value].length) {
                                                                                return (
                                                                                    <Tab.Pane key={key} eventKey={adjunto.value}>
                                                                                        {
                                                                                            proyecto ?
                                                                                                proyecto[adjunto.value].length ?
                                                                                                    <div className="mt-2 d-flex justify-content-center">
                                                                                                        <span className='btn btn-hover btn-text-success' onClick={(e) => { e.preventDefault(); this.getProyectoAdjuntosZip([adjunto.value]) }}>
                                                                                                            <i className="fas fa-file-archive"></i> Descargar ZIP
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
                                                </div> : ''
                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second" className="tab-pane fade">
                                        {
                                            proyecto ?
                                                <div className="col-md-12 mb-4" >
                                                    {
                                                        proyecto.avances.length ?
                                                            <>
                                                                <div className="row mx-0">
                                                                    {
                                                                        proyecto.avances.map((avance, key) => {
                                                                            return (
                                                                                <div key={key} className="col-md-2 text-center">
                                                                                    <div className="d-flex flex-column align-items-center">
                                                                                        <a href={avance.pdf} className="text-dark-75 font-weight-bold mt-15 font-size-lg text-hover-danger2 pb-3">
                                                                                            <img alt="" className="max-h-50px pb-2" src="/pdf.svg" />{avance.semana}
                                                                                        </a>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </>
                                                            : ''
                                                    }
                                                </div>
                                                : ''
                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="third" className="tab-pane fade">
                                        {
                                            proyecto ?
                                                <div className="col-md-12 mb-4" >
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
                                                                <SelectSearch
                                                                    formeditado={formeditado}
                                                                    options={options.tiposTrabajo}
                                                                    placeholder="SELECCIONA EL TIPO DE TRABAJO"
                                                                    name="tipo_trabajo"
                                                                    value={form.tipo_trabajo}
                                                                    onChange={this.updateTrabajo}
                                                                    iconclass={"fas fa-book"}
                                                                    messageinc="Incorrecto. Selecciona el tipo de trabajo"
                                                                />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <SelectSearch
                                                                    formeditado={formeditado}
                                                                    options={options.partidas}
                                                                    placeholder="SELECCIONA LA PARTIDA"
                                                                    name="partida"
                                                                    value={form.partida}
                                                                    onChange={this.updatePartida}
                                                                    iconclass={" fas fa-book"}
                                                                    messageinc="Incorrecto. Selecciona la partida"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                                        <div className="form-group row form-group-marginless">
                                                            <div className="col-md-12">
                                                                <Input
                                                                    requirevalidation={1}
                                                                    formeditado={formeditado}
                                                                    as="textarea"
                                                                    placeholder="DESCRIPCIÓN DEL PROBLEMA"
                                                                    rows="2"
                                                                    value={form.descripcion}
                                                                    name="descripcion"
                                                                    onChange={this.onChange}
                                                                    messageinc="Incorrecto. Ingresa una descripción."
                                                                    style={{ paddingLeft: "10px" }}
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
                                                        <div className="card-footer py-3 pr-1">
                                                            <div className="row mx-0">
                                                                <div className="col-lg-12 text-right pr-0 pb-0">
                                                                    <Button text='SOLICITAR' type='submit' className="btn btn-primary mr-2" icon='' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Form >
                                                </div>
                                                : ''
                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="fourth" className="tab-pane fade">
                                        {
                                            proyecto ?
                                                <TableForModals
                                                    mostrar_acciones={true}
                                                    actions={{
                                                        'see': { function: this.openModalSee },
                                                        'details': { function: this.openModalDetalles },
                                                    }}
                                                    columns={TICKETS_ESTATUS}
                                                    data={tickets}
                                                    elements={data.tickets}
                                                    idTable='kt_datatable_presupuesto'
                                                />
                                                : ''
                                        }
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Card>
                    </Tab.Container>
                    : ''
                }
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
                                    <NavDropdown.Item className="ml-0" eventKey="second">PROBLEMA REPORTADO</NavDropdown.Item>
                                    <NavDropdown.Item className="ml-0" eventKey="third">PROBLEMA SOLUCIONADO</NavDropdown.Item>
                                </NavDropdown>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>
                            {
                                ticket ?
                                    <>
                                        <Tab.Pane eventKey="first">
                                            <p className="my-5 lead font-weight-bold text-justify">{ticket.descripcion_solucion !== "null" ? ticket.descripcion_solucion : ''}</p>
                                            <div className="table-responsive">
                                                <div className="list min-w-500px" data-inbox="list">
                                                    <div className="d-flex justify-content-center align-items-center list-item ">

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
                                                                    ticket.tecnico ?
                                                                        <div className="d-flex flex-column font-weight-bold">
                                                                            <div className="text-dark mb-1 ">{ticket.tecnico.nombre}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MiProyecto);