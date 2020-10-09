import { connect } from 'react-redux';
import React, { Component } from 'react';
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import Layout from '../../../components/layout/layout';
import { Col, Row, Card } from 'react-bootstrap'
import { UltimosContactosCard, SinContacto, UltimosIngresosCard } from '../../../components/cards'
import { forbiddenAccessAlert, errorAlert } from '../../../functions/alert'
import LeadNuevo from '../../../components/tables/Lead/LeadNuevo'
import LeadContacto from '../../../components/tables/Lead/LeadContacto'
import LeadNegociacion from '../../../components/tables/Lead/LeadNegociacion'
import LeadContrato from '../../../components/tables/Lead/LeadContrato'
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

    nextUltimosContactados=(e)=>{
        e.preventDefault()
        const {ultimos_contactados}=this.state
        this.setState({
            numPage:ultimos_contactados.numPage++
        })
        this.getUltimosContactos()
    }
    nextPageProspectosSinContactar=(e)=>{
        e.preventDefault()
        const {prospectos_sin_contactar}=this.state
        this.setState({
            numPage:prospectos_sin_contactar.numPage++
        })
        this.getSinContactar()
    }
    nextPageUltimosIngresados=(e)=>{
        e.preventDefault()
        const {ultimos_ingresados}=this.state
        this.setState({
            numPage:ultimos_ingresados.numPage++
        })
        this.getUltimosIngresados()
    }



    prevUltimosContactados=(e)=>{
        e.preventDefault()
        const {ultimos_contactados}=this.state
        this.setState({
            numPage:ultimos_contactados.numPage--
        })
        this.getUltimosContactos()
    }
    prevPageProspectosSinContactar=(e)=>{
        e.preventDefault()
        const {prospectos_sin_contactar}=this.state
        this.setState({
            numPage:prospectos_sin_contactar.numPage--
        })
        this.getSinContactar()
    }
    prevPageUltimosIngresados=(e)=>{
        e.preventDefault()
        const {ultimos_ingresados}=this.state
        this.setState({
            numPage:ultimos_ingresados.numPage--
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
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
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
                            onClick={this.nextUltimosContactados}
                            onClickPrev={this.prevUltimosContactados}
                        />
                    </Col>
                    <Col lg={4}>
                        <SinContacto
                            prospectos_sin_contactar={prospectos_sin_contactar}
                            onClick={this.nextPageProspectosSinContactar}
                            onClickPrev={this.prevPageProspectosSinContactar}
                        />
                    </Col>
                    <Col lg={4}>
                        <UltimosIngresosCard 
                            ultimos_ingresados={ultimos_ingresados}
                            onClick={this.nextPageUltimosIngresados}
                            onClickPrev={this.prevPageUltimosIngresados}
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
                            <LeadNuevo/>
                        </Card.Body>
                    </Card>
                    <Card className="card-custom card-stretch gutter-b py-2">
                        <Card.Header className="align-items-center border-0">
                            <h3 className="card-title align-items-start flex-column">
                                <span className="font-weight-bolder text-dark">Leads en contacto</span>
                            </h3>
                        </Card.Header>
                        <Card.Body className="py-2">
                            <LeadContacto/>
                        </Card.Body>
                    </Card>
                    <Card className="card-custom card-stretch gutter-b py-2">
                        <Card.Header className="align-items-center border-0">
                            <h3 className="card-title align-items-start flex-column">
                                <span className="font-weight-bolder text-dark">Leads en negociación</span>
                            </h3>
                        </Card.Header>
                        <Card.Body className="py-2">
                            <LeadNegociacion/>
                        </Card.Body>
                    </Card>
                    <Card className="card-custom card-stretch gutter-b py-2">
                        <Card.Header className="align-items-center border-0">
                            <h3 className="card-title align-items-start flex-column">
                                <span className="font-weight-bolder text-dark">Leads contratados</span>
                            </h3>
                        </Card.Header>
                        <Card.Body className="py-2">
                            <LeadContrato/>
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