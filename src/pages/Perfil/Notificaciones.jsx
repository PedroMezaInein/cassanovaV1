import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../components/layout/layout'
import { errorAlert, printResponseErrorAlert } from '../../functions/alert'
import axios from 'axios'
import { URL_DEV } from '../../constants'
import { Card } from 'react-bootstrap'
import { setDateTableLG } from '../../functions/setters'
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../functions/routers"

class Notificaciones extends Component {

    state = { notificaciones: [] }
    
    componentDidMount(){ this.getNotificaciones() }

    getNotificaciones = async() => {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'notificaciones/all', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { notificaciones } = response.data
                this.setState({ ...this.state, notificaciones: notificaciones })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    setIcon = tipo => {
        switch(tipo){
            case 'lead':
                return toAbsoluteUrl('/images/svg/notificaciones/lead.svg');
            case 'tarea':
                return toAbsoluteUrl('/images/svg/notificaciones/tarea.svg');
            case 'ticket':
                return toAbsoluteUrl('/images/svg/notificaciones/ticket.svg');
            case 'vacaciones':
                return toAbsoluteUrl('/images/svg/notificaciones/vacaciones.svg');
            case 'solicitud vacaciones':
                return toAbsoluteUrl('/images/svg/notificaciones/solicitud-vacaciones.svg');
            case 'cancel':
                return toAbsoluteUrl('/images/svg/notificaciones/cancelar.svg');
            default:
                return toAbsoluteUrl('/images/svg/portapapeles.svg');
        }
    }
    
    render() {
        const { notificaciones } = this.state
        return (
            <Layout { ...this.props}>
                <div className = 'row mx-0'>
                    {
                        notificaciones.map((notificacion) => {
                            return(
                                <div className = 'col-md-3'>
                                    <Card className = 'p-3 my-3'>
                                        <div className="row mx-0">
                                            <div className="col-3 d-flex justify-content-center align-items-center">
                                                <span className="svg-icon svg-icon-lg svg-icon-success mx-2">
                                                    <SVG src = { this.setIcon(notificacion.tipo) } />
                                                </span>
                                            </div>
                                            <div className="col-9 p-0">
                                                <div className="text-center">
                                                    {
                                                        notificacion.texto
                                                    }
                                                </div>
                                                <div className = 'd-flex justify-content-end text-dark-50 mt-3'>
                                                    {
                                                        setDateTableLG(notificacion.created_at)
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                    
                                </div>
                            )
                        })
                    }
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Notificaciones)