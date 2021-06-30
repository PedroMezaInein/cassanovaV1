import React, { Component } from 'react'
import axios from 'axios'
import { URL_DEV } from '../constants'
import { setOptions, setEmpresaLogo } from '../functions/setters'
import { errorAlert, printResponseErrorAlert } from '../functions/alert'
import { connect } from 'react-redux'
import { SelectSearchGray } from '../components/form-components'
import { Nav, Navbar, Tab, Col, Row } from 'react-bootstrap'
import WOW from 'wowjs';
import moment from 'moment';
import 'moment/locale/es';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../functions/routers"
import { Modal, ItemSlider } from '../components/singles'
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
        modalLevantamiento:false,
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
        showSelect : false
    }
    getLink = () => {
        return '/leads/crm'
    }
    componentDidMount() {
        this.getMiProyectoAxios()
        new WOW.WOW({
            live: false
        }).init();
    }
    async getMiProyectoAxios() {
        const { access_token, user } = this.props.authUser
        await axios.get(URL_DEV + 'proyectos/mi-proyecto', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyectos } = response.data
                const { data, options, id } = this.state
                let { proyecto, showSelect } = this.state
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
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
                    }else{
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
                this.setState({
                    ...this.state,
                    data,
                    options,
                    proyecto,
                    showSelect
                })

            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
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

                data.tiposTrabajo.forEach((tipo) => {
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
    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    changePageEdit = proyecto => {
        const { history } = this.props
        history.push({
            pathname: '/mi-proyecto/ver-proyecto',
            state: { proyecto: proyecto}

        });
    }
    setEmpresaName(proyecto){
        if(proyecto.empresa){
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
    setEmpresaColor(proyecto){
        if(proyecto.empresa){
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
    formatDay (fechaInicio, fechaFinal){
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
    render() {
        const { options, form, proyecto, showSelect, primeravista, defaultactivekey, subActiveKey, adjuntos, showadjuntos, } = this.state
        return (
            <div className="text-transform-none">
                <header id="header" className="header-cliente fixed-top">
                    <div className="container-fluid padding-container mx-auto">
                        <Navbar expand="lg" className="navbar-cliente ">
                            <Navbar.Brand href="https://infraestructuramedica.mx/" target="_blank" rel="noopener noreferrer" className="logo d-flex align-items-center">
                                {
                                    setEmpresaLogo(proyecto) !== '' ?
                                        <img alt="" className="img-logo" src = { setEmpresaLogo(proyecto) }  />
                                    : ''
                                }
                            </Navbar.Brand>
                            {
                                proyecto&&
                                <>
                                <Navbar.Toggle/>
                                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-flex-end" >
                                    <Nav.Link className="nav-cliente" href="#inicio">
                                        Inicio
                                    </Nav.Link>
                                    <Nav.Link className="nav-cliente" href="#informacion">
                                        Información
                                    </Nav.Link>
                                    {
                                        proyecto.adjuntos.length ?
                                        <Nav.Link className="nav-cliente">
                                            Material
                                        </Nav.Link>
                                        :''
                                    }
                                    {
                                        proyecto.mantenimiento_correctivo.length ?
                                        <Nav.Link className="nav-cliente">
                                            Mantenimiento
                                        </Nav.Link>
                                        :''
                                    }
                                    {
                                        proyecto.avances.length ?
                                        <Nav.Link className="nav-cliente">
                                            Avances
                                        </Nav.Link>
                                        :''
                                    }
                                    <Nav.Link className="nav-cliente">
                                        Tickets
                                    </Nav.Link>
                                    {
                                        proyecto.bitacora !== null?
                                        <Nav.Link className="nav-cliente">
                                            Bitácora
                                        </Nav.Link>
                                        :''
                                    }
                                </Navbar.Collapse>
                                </>
                            }
                        </Navbar>
                    </div>
                    {
                        showSelect&&
                        <div className="row mx-0 col-md-12 d-flex justify-content-flex-end my-8">
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
                </header>
                <section id="inicio" className="bienvenida-cliente d-flex align-items-center place-content-center" style={{ backgroundImage: "url('/hero-bg.png')" }}>
                    <div className="row mx-0 col-md-11 d-flex">
                        <div className="col-md-7 d-flex flex-column justify-content-center">
                            <div className="padding-col-7">
                                <h1 className="wow fadeInUp">{proyecto.nombre}</h1>
                                <span className="d-flex flex-column">
                                    <h2 className={`wow fadeInUp ${proyecto?'margin-y-30px':'mb-0'} ${showSelect?'order-1':'order-2'}`} data-wow-delay="400">Plaforma administrativa</h2>
                                    <h4 className={`wow fadeInUp order-3 ${!showSelect && proyecto?'':'margin-y-30px'}`}data-wow-delay="700">
                                        En este sitio podrás encontrar toda información importante de tu proyecto, como información general, avances, material,
                                        levantamiento de tickets, bitácora, de acuerdo al progreso del mismo.
                                    </h4>
                                    {
                                        proyecto&&
                                        <h3 className={`wow fadeInUp mb-0 text-${this.setEmpresaColor(proyecto)} ${showSelect?'order-2 ':'order-1 margin-y-30px'}`}>{this.setEmpresaName(proyecto)}</h3>
                                    }
                                </span>
                            </div>
                        </div>
                        <div className="col-md-5 bienvenida-img text-center wow pulse" data-wow-delay="400">
                            <img src="/bienvenida-img.png" className="img-fluid" alt="" />
                        </div>
                    </div>
                    
                </section>
                {
                    proyecto &&
                    <>
                        <section id="informacion" className="features  text-uppercase">
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
                                                    <div className="col-md-6 icon-box align-items-center mb-5 fadeInUp" data-wow-delay="500">
                                                        <i className="las la-user-alt"></i>
                                                        <div>
                                                            <h4>Contacto</h4>
                                                            <p>{proyecto.contacto}</p>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    proyecto.numero_contacto !== "Sin información" &&
                                                    <div className="col-md-6 icon-box align-items-center mb-5 fadeInUp" data-wow-delay="500">
                                                        <i className="las la-phone"></i>
                                                        <div>
                                                            <h4>Número de contacto</h4>
                                                            <p>{proyecto.numero_contacto}</p>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    proyecto.fecha_inicio &&
                                                    <div className="col-md-6 icon-box align-items-center mb-5 fadeInUp" data-wow="fade-up">
                                                        <i className="las la-calendar"></i>
                                                        <div>
                                                            <h4>Periodo</h4>
                                                            <p>{this.formatDay(proyecto.fecha_inicio, proyecto.fecha_fin)}</p>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    proyecto.tipo_proyecto &&
                                                    <div className="col-md-6 icon-box align-items-center mb-5 fadeInUp" data-wow-delay="100">
                                                        <i className="las la-toolbox"></i>
                                                        <div>
                                                            <h4>Tipo de proyecto</h4>
                                                            <p>{proyecto.tipo_proyecto}</p>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    proyecto.m2 > 0 &&
                                                    <div className="col-md-6 icon-box align-items-center mb-5 fadeInUp" data-wow-delay="200">
                                                        <i className="las la-ruler"></i>
                                                        <div>
                                                            <h4>M²</h4>
                                                            <p>{proyecto.m2}</p>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    proyecto.fase3 === 0 && proyecto.fase2 === 0 && proyecto.fase1 === 0 ? <></> :
                                                        <div className="col-md-6 icon-box align-items-center mb-5 fadeInUp" data-wow-delay="300">
                                                            <i className="las la-tools"></i>
                                                            <div>
                                                                <h4>Fase</h4>
                                                                <p>
                                                                    {proyecto.fase1 ? <span>Fase 1</span> : ''}
                                                                    {proyecto.fase2 ? <span>Fase 2</span> : ''}
                                                                    {proyecto.fase3 ? <span>Fase 3</span> : ''}
                                                                </p>
                                                            </div>
                                                        </div>
                                                }
                                                {
                                                    proyecto.cp &&
                                                    <div className="col-md-6 icon-box align-items-center mb-5 fadeInUp" data-wow-delay="400">
                                                        <i className="las la-map-pin"></i>
                                                        <div>
                                                            <h4>Código postal</h4>
                                                            <p>{proyecto.cp}</p>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    proyecto.estado &&
                                                    <div className="col-md-6 icon-box align-items-center mb-5 fadeInUp" data-wow-delay="500">
                                                        <i className="las la-globe"></i>
                                                        <div>
                                                            <h4>Estado</h4>
                                                            <p>{proyecto.estado}</p>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    proyecto.municipio &&
                                                    <div className="col-md-6 icon-box align-items-center mb-5 fadeInUp" data-wow-delay="500">
                                                        <i className="las la-map"></i>
                                                        <div>
                                                            <h4>Municipio/Delegación</h4>
                                                            <p>{proyecto.municipio}</p>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    proyecto.colonia &&
                                                    <div className="col-md-6 icon-box align-items-center mb-5 fadeInUp" data-wow-delay="500">
                                                        <i className="las la-map-marker"></i>
                                                        <div>
                                                            <h4>Colonia</h4>
                                                            <p>{proyecto.colonia}</p>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    proyecto.calle &&
                                                    <div className="col-md-6 icon-box align-items-center mb-5 fadeInUp" data-wow-delay="500">
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
                        <section style={{background:'#f6f9ff'}}>
                            {
                                proyecto &&
                                <div className="container fadeInUp">
                                    <span className="font-size-h5">ADJUNTOS DEL PROYECTO</span>
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
                                        <Row className="mx-0 bg-white">
                                            <Col md={3} className="navi navi-accent navi-hover navi-bold align-self-center">
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
                                </div>
                            }
                        </section>
                    </>
                }
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