import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { errorAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { setSingleHeader } from '../../../functions/routers'
import Swal from 'sweetalert2'
import { Card, Tab, Nav } from 'react-bootstrap'
import { setFase, setLabelTable, ordenamiento, setOptions } from '../../../functions/setters'
import { EditProyectoForm, NotasObra, Avances, Adjuntos, ComentariosProyectos, PresupuestosProyecto } from '../../../components/forms'

class SingleProyecto extends Component {

    state = {
        proyecto: null,
        navs: [
            { eventKey: 'informacion', icon: 'flaticon-folder-1', name: 'Información' },
            { eventKey: 'comentarios', icon: 'flaticon-comment', name: 'Comentarios' },
            { eventKey: 'avances', icon: 'flaticon-diagram', name: 'Avances' },
            { eventKey: 'notas', icon: 'flaticon-notes', name: 'Notas de obra' },
            { eventKey: 'adjuntos', icon: 'flaticon-attachment', name: 'Adjuntos' },
            { eventKey: 'presupuestos', icon: 'flaticon-list-1', name: 'Presupuestos' },
            // { eventKey: 'compras', icon: 'flaticon-bag', name: 'Compras' },
            // { eventKey: 'facturacion', icon: 'las la-file-invoice-dollar', name: 'Facturación' },
        ],
        activeKeyNav: 'informacion',
        options:{
            empresas: [],
            clientes: [],
            // colonias: [],
            estatus: [],
            // tipos:[],
            cp_clientes: [],
            proveedores:[]
        }
    }

    componentDidMount = () => {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const { match: { params: { id } } } = this.props
        const modulo = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === `${url}/single/${id}`
        })
        if (!modulo){ history.push('/') }
        if (id){ this.getOneProyecto(id) }
        this.getOptionsAxios()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let paramPres = params.get('presupuesto')
            if(paramPres){ this.setState({...this.state, activeKeyNav: 'presupuestos' }) }
            let paramCom = params.get('comentario')
            if(paramCom){ this.setState({...this.state, activeKeyNav: 'comentarios' }) }
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                         ANCHOR ASYNC CALL FUNCTION                         */
    /* -------------------------------------------------------------------------- */
    getOneProyecto = async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v3/proyectos/proyectos/${id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {const { proyecto } = response.data
                Swal.close()
                this.setState({ ...this.state, proyecto: proyecto })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    getOptionsAxios = async() => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}proyectos/opciones`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { clientes, empresas, estatus, proveedores } = response.data
                const { options } = this.state
                let aux = [];
                clientes.forEach((element) => {
                    aux.push({
                        name: element.empresa,
                        value: element.id.toString(),
                        label: element.empresa,
                        cp: element.cp,
                        estado: element.estado,
                        municipio: element.municipio,
                        colonia: element.colonia,
                        calle: element.calle
                    })
                    return false
                })
                options.clientes = aux.sort(ordenamiento)
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['estatus'] = setOptions(estatus, 'estatus', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                Swal.close()
                this.setState({ ...this.state, options })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    controlledNav = value => {
        this.setState({ ...this.state, activeKeyNav: value })
    }

    onClick = (type, aux) => {
        switch(type){
            case 'change-tab':
                this.controlledNav(aux)
                break;
            default: break;
        }
    }

    getPresupuestoFromUrl = () => {
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let paramPres = params.get('presupuesto')
            if(paramPres){  return paramPres }
        }
        return null
    }

    getComentarioFromUrl = () => {
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let paramPres = params.get('comentario')
            if(paramPres){  return paramPres }
        }
        return null
    }

    render() {
        const { proyecto, navs, activeKeyNav, options } = this.state
        const { access_token } = this.props.authUser
        const { user } = this.props.authUser
        return (
            <Layout active = 'proyectos' {...this.props} >
                {
                    proyecto ?
                        <div className={`d-flex flex-column flex-${activeKeyNav === 'presupuestos'?'xxl':'lg'}-row`}>
                            <div className={`flex-column flex-lg-row-auto w-100 w-lg-300px mb-0 mb-xl-10 ${activeKeyNav === 'presupuestos' ? 'd-lg-none d-xxl-block' : '' } `}>
                                <Card className="mb-5 mb-xl-8 p-sticky-card">
                                    <Card.Body className="pt-15">
                                        <div className="d-flex flex-center flex-column mb-8">
                                            <div className="font-size-h5 font-weight-bolder text-dark mb-2 text-center">{proyecto.nombre}</div>
                                            <div className="font-size-h6 font-weight-bold text-muted text-center">{proyecto.contacto}</div>
                                        </div>
                                        <div className="separator separator-dashed my-3"></div>
                                        <div className="font-size-h6 py-3 font-weight-bolder text-dark text-center">INFORMACIÓN DEL PROYECTO</div>
                                        <div className="font-weight-light text-dark-50 text-justify">
                                            <div className="text-center">{setLabelTable(proyecto.estatus)}</div>
                                            <div className="font-weight-bolder text-dark mt-5">FASE</div>{setFase(proyecto)}
                                            <div className="font-weight-bolder text-dark mt-5">EMPRESA</div>{proyecto.empresa.name}
                                            {
                                                proyecto.descripcion !== 'null' && proyecto.descripcion ?
                                                    <><div className="font-weight-bolder text-dark mt-5">DESCRIPCIÓN</div>{proyecto.descripcion}</>
                                                    : <></>
                                            }
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                            <Tab.Container activeKey={activeKeyNav}>
                                <div className={`${activeKeyNav === 'presupuestos' ? 'flex-xxl-row-fluid ml-xxl-10 ' : 'flex-lg-row-fluid ml-lg-10 ' } `}>
                                    <div className="d-flex overflow-auto">
                                        <Nav className="nav nav-tabs nav-tabs-line-blue nav-tabs-line nav-tabs-line-2x font-size-h6 flex-nowrap align-items-center border-transparent align-self-end mb-4">
                                            {
                                                navs.map((nav, key) => {
                                                    return (
                                                        <Nav.Item key={key}>
                                                            <Nav.Link eventKey={nav.eventKey} onClick={(e) => { e.preventDefault();this.onClick(nav.eventKey); this.controlledNav(nav.eventKey) }}>
                                                                <span className="nav-icon">
                                                                    <i className={`${nav.icon} icon-lg mr-2`}></i>
                                                                </span>
                                                                <span className="nav-text font-weight-bolder white-space-nowrap">{nav.name}</span>
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    )
                                                })
                                            }
                                        </Nav>
                                    </div>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="informacion">
                                            <EditProyectoForm proyecto = { proyecto } options = { options } at = { access_token } 
                                                refresh = { this.getOneProyecto } isActive = { activeKeyNav === 'informacion' ? true : false } />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="comentarios">
                                            <ComentariosProyectos proyecto = { proyecto } at = { access_token }
                                                comentarioId = { this.getComentarioFromUrl() }/>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="avances">
                                            <Avances proyecto = { proyecto } user = { user } at = { access_token } refresh = { this.getOneProyecto }
                                                isActive = { activeKeyNav === 'avances' ? true : false } onClick = { this.onClick } />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="notas">
                                            <NotasObra isActive = { activeKeyNav === 'notas' ? true : false } proyecto={proyecto} at = { access_token }
                                                onClick = { this.onClick } options = { options } refresh = { this.getOneProyecto } />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="adjuntos">
                                            <Adjuntos proyecto={proyecto} at = { access_token }/>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="presupuestos">
                                            <PresupuestosProyecto proyecto={proyecto} at = { access_token } presupuestoId = { this.getPresupuestoFromUrl() } 
                                                isActive = { activeKeyNav === 'presupuestos' ? true : false } />
                                        </Tab.Pane>
                                    </Tab.Content>
                                </div>
                            </Tab.Container>
                        </div>
                    : <></>
                }
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(SingleProyecto);