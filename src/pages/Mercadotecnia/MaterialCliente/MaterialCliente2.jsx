import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { connect } from 'react-redux'
import ItemSlider from '../../../components/singles/ItemSlider'
import { Tab, Nav, Col, Row, Card, Accordion, } from 'react-bootstrap'
import { setSelectOptions } from '../../../functions/setters'
import { waitAlert, questionAlert, errorAlert, forbiddenAccessAlert, doneAlert, deleteAlert } from '../../../functions/alert'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { Folder, FolderStatic, Modal } from '../../../components/singles'
import { Button, BtnBackUrl, TablePagination, NewFolderInput } from '../../../components/form-components'
import Swal from 'sweetalert2'
import { NoFiles, Files, Build } from '../../../components/Lottie'

const arrayOpcionesAdjuntos = ['portafolio', 'como_trabajamos', 'servicios_generales', '', 'brokers', 'videos'];
class MaterialCliente extends Component {
    state = {
        data: {
            empresas: []
        },
        empresa: '',
        submenuactive: '',
        opciones_adjuntos: [
            {
                nombre: 'PORTAFOLIO',
                slug: 'portafolio',
                icono: 'fas fa-briefcase',
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'COMO TRABAJAMOS (FASE 1 Y 2)',
                icono: 'flaticon2-file',
                slug: 'como_trabajamos',
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'SERVICIOS GENERALES',
                icono: 'flaticon2-settings',
                slug: 'servicios_generales',
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'SERVICIOS POR CATEGORIA',
                icono: 'fas fa-tag',
                isActive: false,
                subMenu: true
            },
            {
                nombre: 'BROKERS',
                slug: 'brokers',
                icono: 'fas fa-user-tie',
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'VIDEOS',
                slug: 'videos',
                icono: 'fas fa-video',
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'CASOS DE ÉXITO',
                icono: 'fas fa-folder-open',
                isActive: false,
                subMenu: false
            }
        ],
    };

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const material = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!material)
            history.push('/')
        this.getOptionsAxios()
    }

    /* ANCHOR AXIOS FUNCTIONS */

    /* ANCHOR GET ALL EMPRESAS Y ADJUNTOS */
    getOptionsAxios = async () => {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'mercadotecnia/material-clientes', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas } = response.data
                const { data } = this.state
                data.empresas = empresas
                this.setState({ ...this.state, data })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) { forbiddenAccessAlert() } 
                else { errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.') }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    /* ANCHOR GET ADJUNTOS POR EMPRESA */
    getAdjuntoEmpresaAxios = async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}mercadotecnia/material-clientes/empresa/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
        (response) => {
                Swal.close()
                const { empresa } = response.data
                const { opciones_adjuntos } = this.state
                if(opciones_adjuntos.length)
                    opciones_adjuntos[0].isActive = true
                this.setState({...this.state, empresa, opciones_adjuntos})
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) { forbiddenAccessAlert() } 
                else { errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.') }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    openAccordion = (key) => {
        const { opciones_adjuntos } = this.state
        if(opciones_adjuntos.length >= key+1){
            opciones_adjuntos.map((adjunto)=>{
                adjunto.isActive = false
            })
            opciones_adjuntos[key].isActive = true
        }
        this.setState({...this.state, opciones_adjuntos, submenuactive: false})
    }

    openSubmenu = (tipo) => {
        this.setState({...this.state, submenuactive: tipo.id})
    }

    printFiles = () => {
        console.log('PRINTFILES')
    }
    
    render() {
        const { data, opciones_adjuntos, empresa, submenuactive } = this.state
        return (
            <Layout active = 'mercadotecnia' {...this.props}>
                <Tab.Container className = "p-5" >
                    <Row>
                        <Col sm = { 3 } >
                            <Card className = "card-custom card-stretch gutter-b">
                                <div className = "card-header">
                                    <div className = "card-title">
                                        <h3 className = "card-label">Adjuntos</h3>
                                    </div>
                                </div>
                                <div className="card-body px-3">
                                    <Accordion id = "accordion-material" className = "accordion-light accordion-svg-toggle">
                                        {
                                            opciones_adjuntos.map((element, key) => {
                                                return (
                                                    <Card className="w-auto border-0 mb-2" key={key}>
                                                        <Card.Header>
                                                            <div className = { (element.isActive) ? 'card-title text-primary collapsed rounded-0 ' : 'card-title text-dark-50 rounded-0' } 
                                                                onClick = { () => { this.openAccordion(key) } } >
                                                                <div className="card-label">
                                                                    <i className={(element.isActive) ? element.icono + ' text-primary mr-3' : element.icono + ' text-dark-50 mr-3'}>
                                                                    </i>{element.nombre}
                                                                </div>
                                                                {
                                                                    element.subMenu ?
                                                                        <span className="svg-icon">
                                                                            <SVG src={toAbsoluteUrl('/images/svg/Angle-double-right.svg')} />
                                                                        </span>
                                                                        : ''
                                                                }
                                                            </div>
                                                        </Card.Header>
                                                        {
                                                            element.subMenu ?
                                                                <div className = { element.isActive  ? 'collapse-now' : 'collapse' }>
                                                                    <Card.Body>
                                                                        <Nav className="navi">
                                                                            {
                                                                                empresa ?
                                                                                    empresa.tipos.map( (tipo, key) => {
                                                                                        return (
                                                                                            <Nav.Item className='navi-item' key = { key } 
                                                                                                onClick = { (e) => { e.preventDefault(); this.openSubmenu(tipo) }}>
                                                                                                <Nav.Link className = "navi-link p-2" eventKey = { tipo.id }>
                                                                                                    <span className = 
                                                                                                        { submenuactive === tipo.id ? "navi-icon text-primary" : "navi-icon"}>
                                                                                                        <span className="navi-bullet">
                                                                                                            <i className="bullet bullet-dot"></i>
                                                                                                        </span>
                                                                                                    </span>
                                                                                                    <div className = 
                                                                                                        { submenuactive === tipo.id ? "navi-text text-primary" : "navi-text"}>
                                                                                                        <span className="d-block font-weight-bolder" >{tipo.tipo}</span>
                                                                                                    </div>
                                                                                                </Nav.Link>
                                                                                            </Nav.Item>
                                                                                        )
                                                                                    })
                                                                                : ''
                                                                            }
                                                                        </Nav>
                                                                    </Card.Body>
                                                                </div>
                                                            : ''
                                                        }
                                                    </Card>
                                                )
                                            })
                                        }
                                    </Accordion>
                                </div>
                            </Card>
                        </Col>
                        <Col sm = { 9 } >
                            <Card className="card-custom card-stretch gutter-b" >
                                <Card.Header className = "">
                                    <div className = "card-toolbar">
                                        <Nav className = "nav nav-pills nav-pills-sm nav-light-primary font-weight-bolder">
                                            {
                                                data.empresas.map((empresa, index) => {
                                                    return (
                                                        <Nav.Item key = { index } >
                                                            <Nav.Link eventKey = { empresa.id } className = "py-2 px-4" 
                                                                onClick = { (e) => { e.preventDefault(); this.getAdjuntoEmpresaAxios(empresa.id) }} >
                                                                { empresa.name }
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    )
                                                })
                                            }
                                        </Nav>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    {
                                        empresa !== '' ?
                                            this.printFiles()
                                        :
                                            <div className='col-md-12'>
                                                <div>
                                                    <Build />
                                                </div>
                                                <div className='text-center mt-5 font-weight-bolder font-size-h3 text-primary'>
                                                    Selecciona la empresa
                                                </div>
                                            </div>
                                    }
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab.Container>
            </Layout >
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(MaterialCliente);