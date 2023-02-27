import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card } from 'react-bootstrap'
import { errorAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { EgresosFormNew } from '../../../components/forms'
class EgresosForm extends Component {
    state = {
        type: 'add',
        egreso: null,
        solicitud: null,
        prestacion: null,
        pago: null
    }

    componentDidMount() {
        const {
            authUser: { user: { permisos } },
            history: { location: { pathname, state } },
            match: { params: { action } },
            history
        } = this.props

        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    type: action
                })
                if (state) {
                    if(state.prestacion){
                        this.setState({
                            ...this.state,
                            prestacion: state.prestacion,
                            type: action
                        })
                    }
                    if(state.pago){
                        this.setState({
                            ...this.state,
                            pago: state.pago,
                            type: action
                        })
                    }
                }
                break;
            case 'edit':
                if (state) {
                    if (state.egreso) {
                        this.setState({
                            ...this.state,
                            egreso: state.egreso,
                            type: action
                        })
                    } else {
                        history.push('/administracion/egreso')
                    }
                } else {
                    history.push('/administracion/egreso')
                }
                break;
            case 'convert':
                if (state) {
                    if (state.solicitud) {
                        this.setState({
                            ...this.state,
                            solicitud: state.solicitud,
                            type: action
                        })
                    } else {
                        history.push('/administracion/egresos')
                    }
                } else {
                    history.push('/administracion/egresos')
                }
                break;
            default:
                history.push('/')
                break;
        }
        const modulo = permisos.find((element) => {
            return pathname === `${element.modulo.url}/${action}`
        })
        if (!modulo){
            errorAlert(
                `No tienes acceso a este módulo`,
                () => { history.push('/') }
            )
        }
    }

    setTitle = () => {
        const { type } = this.state
        switch (type) {
            case 'add':
                return 'Nuevo egreso'
            case 'edit':
                return 'Editar egreso'
            case 'convert':
                return 'Convertir solicitud de egreso'
            default: break;
        }
    }

    render() {
        const { type, egreso, solicitud, prestacion, pago } = this.state
        const { history, location, authUser: { access_token }, areas } = this.props
        return (
            <Layout active='administracion'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label"> {this.setTitle()} </h3>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <EgresosFormNew type={type} at={access_token} dato={egreso} solicitud={solicitud} history={history} location={location} prestacion={prestacion} pago={pago} areas={areas} />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser, areas: state.opciones.areas } }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(EgresosForm);