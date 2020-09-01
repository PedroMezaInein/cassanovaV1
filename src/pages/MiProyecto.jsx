import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, URL_ASSETS, TICKETS_ESTATUS } from '../constants'
import { forbiddenAccessAlert, errorAlert, waitAlert, doneAlert } from '../functions/alert'
import { SelectSearch, SelectSearchSinText, Input } from '../components/form-components'
import { setOptions} from '../functions/setters'
import { Card, Nav, Tab, Col, Row, NavDropdown } from 'react-bootstrap'
import { Button } from '../components/form-components'
import ItemSlider from '../components/singles/ItemSlider'
import Moment from 'react-moment'
import { Small } from '../components/texts'
import { Form } from 'react-bootstrap'
import { validateAlert } from '../functions/alert'
import TableForModals from '../components/tables/TableForModals'
class MiProyecto extends Component {

    state = {
        tickets: [],
        proyecto: '',
        formeditado: 0,
        primeravista: true,
        defaultactivekey: "",
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
            proyectos: []
        },
        form: {
            proyecto: '',
            tipo_trabajo: '',
            partida: '',
            descripcion: '',
            nombre: ''
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
        adjuntosTickets:{
            factura:{
                value: '', 
                files: []
            }
        }
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
            ... this.state,
            primeravista: false,
            defaultactivekey: newdefaultactivekey,
            subActiveKey: newdefaultactivekey,
            showadjuntos: adjuntos
        })
    }
    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const proyecto = permisos.find(function (element, index) {
            return element.modulo.url === pathname
        });
        if (!proyecto)
            history.push('/')
        this.getMiProyectoAxios()
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            form[element] = ''
        })
        return form
    }

    updateActiveTabContainer = active => {
        this.setState({
            ... this.state,
            subActiveKey: active
        })
    }

    updateProyecto = value => {
        const { data, form, adjuntos } = this.state
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
                this.setState({
                    ... this.state,
                    defaultactivekey: newdefaultactivekey,
                    proyecto: proyecto,
                    tickets: this.setMiProyecto(proyecto.tickets),
                    form: this.clearForm()
                })
            }
        })
    }

    async getMiProyectoAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'proyectos/mi-proyecto', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyectos, partidas, tiposTrabajo } = response.data
                const { data, options } = this.state
                let { proyecto } = this.state
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                options.partidas = setOptions(partidas, 'nombre', 'id')
                options.tiposTrabajo = setOptions(tiposTrabajo, 'tipo', 'id')

                data.proyectos = proyectos
                if (proyectos.length === 1) {
                    proyecto = proyectos[0]
                }
                this.setState({
                    ... this.state,
                    data,
                    options,
                    proyecto,
                    form: this.clearForm()
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

    async getProyectoAdjuntosZip(array) {
        const { access_token } = this.props.authUser
        const { proyecto } = this.state
        let aux = { tipo: array }
        waitAlert()
        await axios.post(URL_DEV + 'proyectos/' + proyecto.id + '/adjuntos/zip', aux, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const url = URL_ASSETS + '/storage/adjuntos.zip'
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', proyecto.nombre + '.zip');
                document.body.appendChild(link);
                link.click();
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
            ... this.state,
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
        form.proyecto = proyecto.id
        await axios.post(URL_DEV + 'proyectos/mi-proyecto/tickets', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                doneAlert(response.data.message !== undefined ? response.data.message : 'El ticket fue solicitado con éxito.')

                const { history } = this.props
                history.push({ pathname: '/mi-proyecto' })

                this.setState({
                    ... this.state,
                    form: this.clearForm()
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

    setMiProyecto = (tickets) => {
        let aux = []
        tickets.map((ticket) => { 
            aux.push(
                {
                    fecha: renderToString(this.setDate(ticket.created_at)),
                    partida: renderToString(this.setText(ticket.partida.nombre)),
                    estatus: renderToString(this.setEstatus(ticket.estatus_ticket)),
                    descripcion: renderToString(this.setText(ticket.descripcion)),
                    descripcion: renderToString(this.setText(ticket.descripcion)),
                    tipo_trabajo: renderToString(this.setText(ticket.tipo_trabajo.tipo)),
                }
            )
        })
        return aux
    }

    setDate(date) {
        let seconds = new Date(date);
        seconds = seconds.getTime() / 1000;
        return (
            <>
                <span className="d-none" style={{fontSize:"11.7px"}}>
                    {
                        seconds
                    }
                </span>
                <span className="d-none" style={{fontSize:"11.7px"}}>
                    <Moment format="YYYY/MM/DD">
                        {date}
                    </Moment>
                </span>

                <Moment format="DD/MM/YYYY" style={{fontSize:"11.7px"}}>
                    {date}
                </Moment>
            </>
        )
    }

    setEstatus = (text) => {
        return (
            <>
                <span className="label label-lg bg- label-inline font-weight-bold py-2" style={{
                    color: `${text.letra}`,
                    backgroundColor: `${text.fondo}`,
                    fontSize:"11.7px"
                }} >{text.estatus}</span>
            </>
        )
    }

    setText(text) {
        return (
            <span style={{fontSize:"11.7px"}}>
                {text}
            </span>
        )
    }

    handleChangeImages = (files, item) => {
        // this.onChangeAdjuntoGrupo({ target: { name: item, value: files, files: files } })
        swal({
            title: '¿Confirmas el envio de adjuntos?',
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: null,
                    visible: true,
                    className: "button__red btn-primary cancel",
                    closeModal: true,
                },
                confirm: {
                    text: "Aceptar",
                    value: true,
                    visible: true,
                    className: "button__green btn-primary",
                    closeModal: true
                }
            }
        }).then((result) => {
            if (result) {
                waitAlert()
                this.addAdjuntoAxios(item)
            }
        })
    }

    deleteFile = element => {
        swal({
            title: '¿Deseas eliminar el archivo?',
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: null,
                    visible: true,
                    className: "button__green btn-primary cancel",
                    closeModal: true,
                },
                confirm: {
                    text: "Aceptar",
                    value: true,
                    visible: true,
                    className: "button__red btn-primary",
                    closeModal: true
                }
            }
        }).then((result) => {
            if (result) {
                this.deleteAdjuntoAxios(element.id)
            }
        })
    }


    render() {
        const { options, proyecto, form, adjuntos, showadjuntos, primeravista, defaultactivekey, subActiveKey, formeditado, tickets, data } = this.state

        return (
            <Layout {...this.props}>
                <div className="content pt-0 d-flex flex-column flex-column-fluid" style={{ paddingBottom: "11px" }}>
                    <div className="d-flex flex-row-fluid bgi-size-cover bgi-position-center min-h-350px mb-4 d-flex justify-content-center align-items-center" style={{ backgroundImage: "url('/proyecto.jpg')", margin: "-25px" }}>
                        <div className="container">
                            <div className="d-flex align-items-stretch text-center flex-column py-40">

                                <div className="form-group row form-group-marginless d-flex justify-content-center align-items-center">
                                    <div className="col-md-5">
                                        <SelectSearchSinText
                                            options={options.proyectos}
                                            placeholder="Seleccione un proyecto"
                                            name="proyecto"
                                            value={form.proyecto}
                                            onChange={this.updateProyecto}
                                            requirevalidation={1}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-lg-4 mb-3">
                                <div className="card card-custom wave wave-animate-slow wave-primary mb-8 mb-lg-0 h-100">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center ">
                                            <div className="mr-6">
                                                <span className="svg-icon svg-icon-primary svg-icon-4x">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                            <rect x="0" y="0" width="24" height="24" />
                                                            <circle fill="#000000" opacity="0.3" cx="12" cy="9" r="8" />
                                                            <path d="M14.5297296,11 L9.46184488,11 L11.9758349,17.4645458 L14.5297296,11 Z M10.5679953,19.3624463 L6.53815512,9 L17.4702704,9 L13.3744964,19.3674279 L11.9759405,18.814912 L10.5679953,19.3624463 Z" fill="#000000" fillRule="nonzero" opacity="0.3" />
                                                            <path d="M10,22 L14,22 L14,22 C14,23.1045695 13.1045695,24 12,24 L12,24 C10.8954305,24 10,23.1045695 10,22 Z" fill="#000000" opacity="0.3" />
                                                            <path d="M9,20 C8.44771525,20 8,19.5522847 8,19 C8,18.4477153 8.44771525,18 9,18 C8.44771525,18 8,17.5522847 8,17 C8,16.4477153 8.44771525,16 9,16 L15,16 C15.5522847,16 16,16.4477153 16,17 C16,17.5522847 15.5522847,18 15,18 C15.5522847,18 16,18.4477153 16,19 C16,19.5522847 15.5522847,20 15,20 C15.5522847,20 16,20.4477153 16,21 C16,21.5522847 15.5522847,22 15,22 L9,22 C8.44771525,22 8,21.5522847 8,21 C8,20.4477153 8.44771525,20 9,20 Z" fill="#000000" />
                                                        </g>
                                                    </svg>
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <a className="text-dark text-hover-primary font-weight-bold font-size-h4 mb-3 pl-2">PROYECTO</a>
                                                <div className="text-dark-75">{proyecto.nombre}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 mb-3">
                                <div className="card card-custom wave wave-animate-slow wave-danger mb-8 mb-lg-0 h-100">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className="mr-6">
                                                <span className="svg-icon svg-icon-danger svg-icon-4x">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                            <rect x="0" y="0" width="24" height="24" />
                                                            <circle fill="#000000" opacity="0.3" cx="12" cy="12" r="9" />
                                                            <path d="M11.7357634,20.9961946 C6.88740052,20.8563914 3,16.8821712 3,12 C3,11.9168367 3.00112797,11.8339369 3.00336944,11.751315 C3.66233009,11.8143341 4.85636818,11.9573854 4.91262842,12.4204038 C4.9904938,13.0609191 4.91262842,13.8615942 5.45804656,14.101772 C6.00346469,14.3419498 6.15931561,13.1409372 6.6267482,13.4612567 C7.09418079,13.7815761 8.34086797,14.0899175 8.34086797,14.6562185 C8.34086797,15.222396 8.10715168,16.1034596 8.34086797,16.2636193 C8.57458427,16.423779 9.5089688,17.54465 9.50920913,17.7048097 C9.50956962,17.8649694 9.83857487,18.6793513 9.74040201,18.9906563 C9.65905192,19.2487394 9.24857641,20.0501554 8.85059781,20.4145589 C9.75315358,20.7620621 10.7235846,20.9657742 11.7357634,20.9960544 L11.7357634,20.9961946 Z M8.28272988,3.80112099 C9.4158415,3.28656421 10.6744554,3 12,3 C15.5114513,3 18.5532143,5.01097452 20.0364482,7.94408274 C20.069657,8.72412177 20.0638332,9.39135321 20.2361262,9.6327358 C21.1131932,10.8600506 18.0995147,11.7043158 18.5573343,13.5605384 C18.7589671,14.3794892 16.5527814,14.1196773 16.0139722,14.886394 C15.4748026,15.6527403 14.1574598,15.137809 13.8520064,14.9904917 C13.546553,14.8431744 12.3766497,15.3341497 12.4789081,14.4995164 C12.5805657,13.664636 13.2922889,13.6156126 14.0555619,13.2719546 C14.8184743,12.928667 15.9189236,11.7871741 15.3781918,11.6380045 C12.8323064,10.9362407 11.963771,8.47852395 11.963771,8.47852395 C11.8110443,8.44901109 11.8493762,6.74109366 11.1883616,6.69207022 C10.5267462,6.64279981 10.170464,6.88841096 9.20435656,6.69207022 C8.23764828,6.49572949 8.44144409,5.85743687 8.2887174,4.48255778 C8.25453994,4.17415686 8.25619136,3.95717082 8.28272988,3.80112099 Z M20.9991771,11.8770357 C20.9997251,11.9179585 21,11.9589471 21,12 C21,16.9406923 17.0188468,20.9515364 12.0895088,20.9995641 C16.970233,20.9503326 20.9337111,16.888438 20.9991771,11.8770357 Z" fill="#000000" opacity="0.3" />
                                                        </g>
                                                    </svg>
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <a className="text-dark text-hover-danger font-weight-bold font-size-h4 mb-3 pl-2">Dirección</a>
                                                <div className="text-dark-75 text-justify">
                                                    {
                                                        proyecto ?
                                                            <div>
                                                                <Small className="mr-1 mb-0" >
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
                                                                </Small>
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
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                            <rect x="0" y="0" width="24" height="24" />
                                                            <path d="M12,22 C7.02943725,22 3,17.9705627 3,13 C3,8.02943725 7.02943725,4 12,4 C16.9705627,4 21,8.02943725 21,13 C21,17.9705627 16.9705627,22 12,22 Z" fill="#000000" opacity="0.3" />
                                                            <path d="M11.9630156,7.5 L12.0475062,7.5 C12.3043819,7.5 12.5194647,7.69464724 12.5450248,7.95024814 L13,12.5 L16.2480695,14.3560397 C16.403857,14.4450611 16.5,14.6107328 16.5,14.7901613 L16.5,15 C16.5,15.2109164 16.3290185,15.3818979 16.1181021,15.3818979 C16.0841582,15.3818979 16.0503659,15.3773725 16.0176181,15.3684413 L11.3986612,14.1087258 C11.1672824,14.0456225 11.0132986,13.8271186 11.0316926,13.5879956 L11.4644883,7.96165175 C11.4845267,7.70115317 11.7017474,7.5 11.9630156,7.5 Z" fill="#000000" />
                                                        </g>
                                                    </svg>
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <a className="text-dark text-hover-info font-weight-bold font-size-h4 mb-3 pl-2">PERIODO</a>
                                                <div className="text-dark-75">
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
                    <Tab.Container defaultActiveKey="first">
                        <Card className="card-custom">
                            <Card.Header className="card-header-tabs-line">
                                <Nav className="nav nav-tabs nav-tabs-space-lg nav-tabs-line nav-tabs-bold nav-tabs-line-3x">
                                    {
                                        proyecto.adjuntos.length ?
                                            <Nav.Item className="nav-item">
                                                <Nav.Link eventKey="first">
                                                    <span className="nav-icon">
                                                        <span className="svg-icon mr-3">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                                    <rect x="0" y="0" width="24" height="24" />
                                                                    <path d="M12.4644661,14.5355339 L9.46446609,14.5355339 C8.91218134,14.5355339 8.46446609,14.9832492 8.46446609,15.5355339 C8.46446609,16.0878187 8.91218134,16.5355339 9.46446609,16.5355339 L12.4644661,16.5355339 L12.4644661,17.5355339 C12.4644661,18.6401034 11.5690356,19.5355339 10.4644661,19.5355339 L6.46446609,19.5355339 C5.35989659,19.5355339 4.46446609,18.6401034 4.46446609,17.5355339 L4.46446609,13.5355339 C4.46446609,12.4309644 5.35989659,11.5355339 6.46446609,11.5355339 L10.4644661,11.5355339 C11.5690356,11.5355339 12.4644661,12.4309644 12.4644661,13.5355339 L12.4644661,14.5355339 Z" fill="#000000" opacity="0.3" transform="translate(8.464466, 15.535534) rotate(-45.000000) translate(-8.464466, -15.535534) " />
                                                                    <path d="M11.5355339,9.46446609 L14.5355339,9.46446609 C15.0878187,9.46446609 15.5355339,9.01675084 15.5355339,8.46446609 C15.5355339,7.91218134 15.0878187,7.46446609 14.5355339,7.46446609 L11.5355339,7.46446609 L11.5355339,6.46446609 C11.5355339,5.35989659 12.4309644,4.46446609 13.5355339,4.46446609 L17.5355339,4.46446609 C18.6401034,4.46446609 19.5355339,5.35989659 19.5355339,6.46446609 L19.5355339,10.4644661 C19.5355339,11.5690356 18.6401034,12.4644661 17.5355339,12.4644661 L13.5355339,12.4644661 C12.4309644,12.4644661 11.5355339,11.5690356 11.5355339,10.4644661 L11.5355339,9.46446609 Z" fill="#000000" transform="translate(15.535534, 8.464466) rotate(-45.000000) translate(-15.535534, -8.464466) " />
                                                                </g>
                                                            </svg>
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
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                                    <rect x="0" y="0" width="24" height="24" />
                                                                    <path d="M8,3 L8,3.5 C8,4.32842712 8.67157288,5 9.5,5 L14.5,5 C15.3284271,5 16,4.32842712 16,3.5 L16,3 L18,3 C19.1045695,3 20,3.8954305 20,5 L20,21 C20,22.1045695 19.1045695,23 18,23 L6,23 C4.8954305,23 4,22.1045695 4,21 L4,5 C4,3.8954305 4.8954305,3 6,3 L8,3 Z" fill="#000000" opacity="0.3" />
                                                                    <path d="M10.875,15.75 C10.6354167,15.75 10.3958333,15.6541667 10.2041667,15.4625 L8.2875,13.5458333 C7.90416667,13.1625 7.90416667,12.5875 8.2875,12.2041667 C8.67083333,11.8208333 9.29375,11.8208333 9.62916667,12.2041667 L10.875,13.45 L14.0375,10.2875 C14.4208333,9.90416667 14.9958333,9.90416667 15.3791667,10.2875 C15.7625,10.6708333 15.7625,11.2458333 15.3791667,11.6291667 L11.5458333,15.4625 C11.3541667,15.6541667 11.1145833,15.75 10.875,15.75 Z" fill="#000000" />
                                                                    <path d="M11,2 C11,1.44771525 11.4477153,1 12,1 C12.5522847,1 13,1.44771525 13,2 L14.5,2 C14.7761424,2 15,2.22385763 15,2.5 L15,3.5 C15,3.77614237 14.7761424,4 14.5,4 L9.5,4 C9.22385763,4 9,3.77614237 9,3.5 L9,2.5 C9,2.22385763 9.22385763,2 9.5,2 L11,2 Z" fill="#000000" />
                                                                </g>
                                                            </svg>
                                                        </span>
                                                    </span>
                                                    <span className="nav-text font-weight-bold">AVANCES POR SEMANA</span>
                                                </Nav.Link>
                                            </Nav.Item>
                                            : '' : ''
                                    }
                                    <NavDropdown title={
                                        <>
                                            <span className="nav-icon">
                                                <span className="svg-icon mr-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                            <polygon points="0 0 24 0 24 24 0 24" />
                                                            <path d="M5.85714286,2 L13.7364114,2 C14.0910962,2 14.4343066,2.12568431 14.7051108,2.35473959 L19.4686994,6.3839416 C19.8056532,6.66894833 20,7.08787823 20,7.52920201 L20,20.0833333 C20,21.8738751 19.9795521,22 18.1428571,22 L5.85714286,22 C4.02044787,22 4,21.8738751 4,20.0833333 L4,3.91666667 C4,2.12612489 4.02044787,2 5.85714286,2 Z" fill="#000000" fillRule="nonzero" opacity="0.3" />
                                                            <rect fill="#000000" x="6" y="11" width="9" height="2" rx="1" />
                                                            <rect fill="#000000" x="6" y="15" width="5" height="2" rx="1" />
                                                        </g>
                                                    </svg>
                                                </span>
                                            </span>
                                            <span className="nav-text font-weight-bold">TICKETS</span>
                                        </>}>
                                        <NavDropdown.Item eventKey="third">LEVANTAMIENTO DE TICKETS</NavDropdown.Item>
                                        <NavDropdown.Item eventKey="fourth">ESTATUS DE TICKETS</NavDropdown.Item>
                                    </NavDropdown>
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
                                                                <label className="col-form-label">ADJUNTA EL(LOS) ARCHIVOS</label>
                                                                {/* <ItemSlider multiple = { false } items={ " "} handleChange={this.handleChangeImages}
                                                                            item={" "} /> */}
                                                            </div>
                                                        </div>
                                                        <div className="card-footer py-3 pr-1">
                                                            <div className="row">
                                                                <div className="col-lg-12 text-right pr-0 pb-0">
                                                                    <Button text='SOLICITAR' type='submit' className="btn btn-primary mr-2" />
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
                                                    mostrar_boton={false}
                                                    abrir_modal={false}
                                                    mostrar_acciones={false}
                                                    columns={TICKETS_ESTATUS}
                                                    data={tickets}
                                                    elements={data.tickets}
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