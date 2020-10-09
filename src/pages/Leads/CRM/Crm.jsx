import { connect } from 'react-redux';
import React, { Component } from 'react';
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import Layout from '../../../components/layout/layout';
import { Col, Row, OverlayTrigger, Tooltip, Card, Dropdown, DropdownButton } from 'react-bootstrap'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { UltimosContactosCard, SinContacto, UltimosIngresosCard } from '../../../components/cards'
import { forbiddenAccessAlert, errorAlert } from '../../../functions/alert'
class Crm extends Component {
    state = {
        ultimos_contactados:{
            data: [],
            numPage:0,
            total:0,
            value:"ultimos_contactados"
        },
        prospectos_sin_contactar:{
            data: [],
            numPage:0,
            total:0,
            value:"prospectos_sin_contactar"
        },
        ultimos_ingresados:{
            data: [],
            numPage:0,
            total:0,
            value:"ultimos_ingresados"
        }
    }
    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const crm = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!crm)
            history.push('/')
        this.getUltimosContactos()
        this.getSinContactar()
        this.getUltimosIngresados()
    }

    onPageUltimosContactados=(e)=>{
        e.preventDefault()
        const {ultimos_contactados}=this.state
        this.setState({
            numPage:ultimos_contactados.numPage++
        })
        this.getUltimosContactos()
    }
    onPageProspectosSinContactar=(e)=>{
        e.preventDefault()
        const {prospectos_sin_contactar}=this.state
        this.setState({
            numPage:prospectos_sin_contactar.numPage++
        })
        this.getSinContactar()
    }
    onPageUltimosIngresados=(e)=>{
        e.preventDefault()
        const {ultimos_ingresados}=this.state
        this.setState({
            numPage:ultimos_ingresados.numPage++
        })
        this.getUltimosIngresados()
    }

    // onPage = e => {
    //     e.preventDefault()
    //     const {ultimos_contactados, prospectos_sin_contactar, ultimos_ingresados}=this.state
    //     let aux;
    //     if (ultimos_contactados.value ==="ultimos_contactados") {
    //         aux= ultimos_contactados.numPage++
    //         this.getUltimosContactos()
    //     }
    //     if (prospectos_sin_contactar.value ==="prospectos_sin_contactar") {
    //         aux=prospectos_sin_contactar.numPage++
    //         this.getSinContactar()
    //     }
    //     if (ultimos_ingresados.value ==="ultimos_ingresados") {
    //         aux=ultimos_ingresados.numPage++
    //         this.getUltimosIngresados()
    //     }
    //     this.setState({
    //         // ... this.state,
    //         // key: value
    //         numPage:aux
    //     })
    // }
    
    async getUltimosContactos() {
        const { access_token } = this.props.authUser
        const{ultimos_contactados}=this.state
        await axios.get(URL_DEV + 'crm/timeline/ultimos-contactos/'+ultimos_contactados.numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { contactos, total } = response.data
                const { ultimos_contactados } = this.state
                ultimos_contactados.data = contactos
                ultimos_contactados.total=total
                this.setState({
                    ... this.state,
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
        const{prospectos_sin_contactar}=this.state
        await axios.get(URL_DEV + 'crm/timeline/ultimos-prospectos-sin-contactar/'+prospectos_sin_contactar.numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { contactos, total} = response.data
                const { prospectos_sin_contactar } = this.state
                prospectos_sin_contactar.data = contactos
                prospectos_sin_contactar.total=total
                this.setState({
                    ... this.state,
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
        const{ultimos_ingresados}=this.state
        await axios.get(URL_DEV + 'crm/timeline/ultimos-leads-ingresados/'+ultimos_ingresados.numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { leads, total} = response.data
                const { ultimos_ingresados } = this.state
                ultimos_ingresados.data = leads
                ultimos_ingresados.total=total
                this.setState({
                    ... this.state,
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

    changePageAdd = tipo => {
        const { history } = this.props
        history.push({
            pathname: '/leads/crm/add/' + tipo
        });
    }

    render() {
        const { ultimos_contactados, prospectos_sin_contactar, ultimos_ingresados } = this.state
        return (
            <Layout active='leads' {... this.props} >
                <Row>
                    <Col lg={4}>
                        <UltimosContactosCard
                            ultimos_contactados={ultimos_contactados}
                            onClick={this.onPageUltimosContactados}
                        />
                    </Col>
                    <Col lg={4}>
                        <SinContacto
                            prospectos_sin_contactar={prospectos_sin_contactar}
                            onClick={this.onPageProspectosSinContactar}
                        />
                    </Col>
                    <Col lg={4}>
                        <UltimosIngresosCard 
                            ultimos_ingresados={ultimos_ingresados}
                            onClick={this.onPageUltimosIngresados}
                        />
                    </Col>
                </Row>
                <Col md={12} className="px-0">
                    <Card className="card-custom card-stretch gutter-b py-2">
                        <Card.Header className="align-items-center border-0">
                            <h3 className="card-title align-items-start flex-column">
                                <span className="font-weight-bolder text-dark">Nuevos leads</span>
                            </h3>
                        </Card.Header>
                        <Card.Body className="py-2">
                            <div className="tab-content">
                                <div className="table-responsive-lg">
                                    <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
                                        <thead>
                                            <tr className="text-left text-uppercase">
                                                <th style={{ minWidth: "250px" }} className="pl-7">
                                                    <span className="text-dark-75">Proyecto/Nombre</span>
                                                </th>
                                                <th style={{ minWidth: "100px" }} className="text-center">Vendedor</th>
                                                <th style={{ minWidth: "100px" }} className="text-center">Origen</th>
                                                <th style={{ minWidth: "100px" }} className="text-center">Estatus</th>
                                                <th style={{ minWidth: "80px" }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="pl-0 py-8">
                                                    <div className="d-flex align-items-center">
                                                        <div className="symbol symbol-45 symbol-light-primary mr-3">
                                                            <span className="symbol-label font-size-h5">P</span>
                                                        </div>
                                                        <div>
                                                            <a href="#" className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">Nombre cliente X</a>
                                                            <span className="text-muted font-weight-bold d-block">Proyecto X</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="d-flex justify-content-center">
                                                    <div className="symbol-group symbol-hover">
                                                        <OverlayTrigger overlay={<Tooltip>OMAR ABAROA</Tooltip>}>
                                                            <div className="symbol symbol-35 symbol-circle">
                                                                <img alt="Pic" src="/100_1.jpg" />
                                                            </div>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger overlay={<Tooltip>CARINA JIMÉNEZ</Tooltip>}>
                                                            <div className="symbol symbol-35 symbol-circle">
                                                                <img alt="Pic" src="/100_2.jpg" />
                                                            </div>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger overlay={<Tooltip>FERNANDO MÁRQUEZ</Tooltip>}>
                                                            <div className="symbol symbol-35 symbol-circle">
                                                                <img alt="Pic" src="/100_3.jpg" />
                                                            </div>
                                                        </OverlayTrigger>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg text-center">WEB</span>
                                                </td>
                                                <td className="text-center">
                                                    <DropdownButton
                                                        variant={"secondary"}
                                                        title={"Estatus"}
                                                    >
                                                        <Dropdown.Header>
                                                            <span className="font-size-sm">Elige una opción</span>
                                                        </Dropdown.Header>
                                                        <Dropdown.Divider />
                                                        <Dropdown.Item eventKey="1">
                                                            <a href="#" className="navi-link">
                                                                <span className="navi-text">
                                                                    <span className="label label-xl label-inline label-light-success rounded-0">CONTRATADO</span>
                                                                </span>
                                                            </a>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item eventKey="2">
                                                            <a href="#" className="navi-link">
                                                                <span className="navi-text">
                                                                    <span className="label label-xl label-inline label-light-danger rounded-0">DETENIDO</span>
                                                                </span>
                                                            </a>
                                                        </Dropdown.Item>
                                                    </DropdownButton>
                                                </td>
                                                <td className="pr-0 text-right">
                                                    <OverlayTrigger overlay={<Tooltip>Ver más</Tooltip>}>
                                                        <a className="btn btn-default btn-icon btn-sm mr-2">
                                                            <span className="svg-icon svg-icon-md">
                                                                <SVG src={toAbsoluteUrl('/images/svg/Arrow-right.svg')} />
                                                            </span>
                                                        </a>
                                                    </OverlayTrigger>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = (dispatch) => {
}

export default connect(mapStateToProps, mapDispatchToProps)(Crm)



// onpag2=(e)=>{
    //     e.preventDefault()
    //     const {numPage}=this.state 
        
    //     this.setState({
    //         numPage:numPage+1
    //     })
    //     this.getUltimosContactos()
    // }
    // async getUltimosContactos() {
    //     const { access_token } = this.props.authUser
    //     const{numPage}=this.state

    //     await axios.get(URL_DEV + 'crm/timeline/ultimos-contactos/'+numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
    //         (response) => {
    //             const { contactos } = response.data
    //             const { ultimos_contactados } = this.state
    //             ultimos_contactados.data = contactos
    //             this.setState({
    //                 ... this.state,
    //                 ultimos_contactados
    //             })
    //         },
    //         (error) => {
    //             console.log(error, 'error')
    //             if (error.response.status === 401) {
    //                 forbiddenAccessAlert()
    //             } else {
    //                 errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
    //             }
    //         }
    //     ).catch((error) => {
    //         errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
    //         console.log(error, 'error')
    //     })
    // }