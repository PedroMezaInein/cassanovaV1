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
import { EditProyectoForm, NotasObra, Avances } from '../../../components/forms'
class SingleProyecto extends Component {

    state = {
        proyecto: null,
        navs: [
            { eventKey: 'informacion', icon: 'flaticon-folder-1', name: 'Información' },
            { eventKey: 'compras', icon: 'flaticon-bag', name: 'Compras' },
            { eventKey: 'facturacion', icon: 'las la-file-invoice-dollar', name: 'Facturación' },
            { eventKey: 'avances', icon: 'flaticon-diagram', name: 'Avances' },
            { eventKey: 'notas', icon: 'flaticon-notes', name: 'Notas de obra' },
            { eventKey: 'adjuntos', icon: 'flaticon-attachment', name: 'Adjuntos' },
            { eventKey: 'presupuestos', icon: 'flaticon-list-1', name: 'Presupuestos' },
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
            return pathname === url + '/single/' + id
        })
        this.getOptionsAxios()
        if (!modulo)
            history.push('/')
        if (id)
            this.getOneProyecto(id)
        else
            history.push({ pathname: '/proyectos/proyectos' });
    }

    /* -------------------------------------------------------------------------- */
    /*                         ANCHOR ASYNC CALL FUNCTION                         */
    /* -------------------------------------------------------------------------- */
    getOneProyecto = async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v3/proyectos/proyectos/${id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { proyecto } = response.data
                Swal.close()
                this.setState({ ...this.state, proyecto: proyecto })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}proyectos/opciones`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { clientes, empresas, estatus } = response.data
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
                this.setState({
                    ...this.state,
                    options
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
    render() {
        const { proyecto, navs, activeKeyNav, options, data } = this.state
        const { access_token } = this.props.authUser
        const { user } = this.props.authUser
        return (
            <Layout active='proyectos' {...this.props}>
                {
                    proyecto ?
                        <div className="d-flex flex-column flex-xl-row">
                            <div className="flex-column flex-lg-row-auto w-100 w-xl-300px mb-0 mb-xl-10">
                                <Card className="mb-5 mb-xl-8 p-sticky-card">
                                    <Card.Body className="pt-15">
                                        <div className="d-flex flex-center flex-column mb-8">
                                            <div className="font-size-h5 font-weight-bolder text-dark mb-2 text-center">{proyecto.nombre}</div>
                                            <div className="font-size-h6 font-weight-bold text-muted">{proyecto.contacto}</div>
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
                                <div className="flex-lg-row-fluid ml-lg-10">
                                    <div className="d-flex overflow-auto">
                                        <Nav className="nav nav-tabs nav-tabs-line-blue nav-tabs-line nav-tabs-line-2x font-size-h6 flex-nowrap align-items-center border-transparent align-self-end mb-8">
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
                                        <Tab.Pane eventKey="avances">
                                            <Avances proyecto = { proyecto } user = { user } at = { access_token } 
                                                isActive = { activeKeyNav === 'avances' ? true : false } onClick = { this.onClick } />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="notas">
                                            <NotasObra isActive = { activeKeyNav === 'notas' ? true : false } proyecto={proyecto} at = { access_token }  onClick = { this.onClick } options = { options } />
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