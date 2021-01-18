import { connect } from 'react-redux'
import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { Button } from '../../../components/form-components'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from '@fullcalendar/bootstrap'
import esLocale from '@fullcalendar/core/locales/es';
import Axios from 'axios'
import { errorAlert, forbiddenAccessAlert } from '../../../functions/alert'
import { URL_DEV } from '../../../constants'

class PlanTrabajo extends Component{

    state = {
        data: {
            empresas: []
        },
        content: [],
        empresa: ''
    }

    componentDidMount(){
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getContentAxios()
    }

    getContentAxios = async() => {
        const { access_token } = this.props.authUser
        await Axios.get(URL_DEV + 'mercadotecnia/plan-trabajo', { headers: { Authorization: `Bearer ${access_token}` } }).then(
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

    render(){
        return(
            <Layout active = 'mercadotecnia' { ...this.props }>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="d-flex align-items-center">
                            <h3 className="card-title align-items-start flex-column">
                                <span className="font-weight-bolder text-dark">
                                    Plan de trabajo
                                </span>
                            </h3>
                        </div>
                        <div className="card-toolbar">
                            <Button icon = '' className = 'btn btn-light-success btn-sm font-weight-bold' 
                                only_icon = 'flaticon2-writing pr-0 mr-2' text = 'Agendar plan'
                                onClick = { console.log('Parrilla de contenido') } />
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className='parrilla'>
                            {/* <div className='d-flex justify-content-end mb-4'>
                                <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0"
                                    activeKey = { empresa.id } >
                                    {
                                        data.empresas.map((item, key) => {
                                            return (
                                                <Nav.Item key={key} onClick={(e) => { e.preventDefault(); this.handleClickEmpresa(item) }} >
                                                    <Nav.Link eventKey={item.id}>
                                                        {item.name}
                                                    </Nav.Link>
                                                </Nav.Item>
                                            )
                                        })
                                    }
                                </Nav>
                            </div> */}
                            <FullCalendar locale = { esLocale } plugins = { [ dayGridPlugin, interactionPlugin, bootstrapPlugin ] }
                                eventContent = { this.renderEventContent } initialView = 'dayGridMonth' weekends = { false } firstDay = { 1 }
                                themeSystem = 'bootstrap' events = { /* content */[] } />
                        </div>
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PlanTrabajo)
