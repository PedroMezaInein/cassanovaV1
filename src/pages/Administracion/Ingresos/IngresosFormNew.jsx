import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card } from 'react-bootstrap'
// import { errorAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { IngresosFormulario } from '../../../components/forms'

class IngresoFormNew extends Component {

    state = {
        type: 'add',
        ingreso: null
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
                break;
            case 'edit':
                if (state) {
                    if (state.ingreso) {
                        this.setState({
                            ...this.state,
                            ingreso: state.ingreso,
                            type: action
                        })
                    } else {
                        history.push('/administracion/ingreso')
                    }
                } else {
                    history.push('/administracion/ingreso')
                }
                break;
            default:
                history.push('/')
                break;
        }
        // const modulo = permisos.find((element) => {
        //     return pathname === `${element.modulo.url}/${action}`
        // })
        // if (!modulo){
        //     errorAlert(
        //         `No tienes acceso a este módulo`,
        //         () => { history.push('/') }
        //     )
        // }
    }

    setTitle = () => {
        const { type } = this.state
        switch (type) {
            case 'add':
                return 'Nuevo ingreso'
            case 'edit':
                return 'Editar ingreso'
            default: break;
        }
    }

    render() {
        const { type, ingreso } = this.state
        const { history, authUser: { access_token } } = this.props
        return (
            <Layout active='proyectos'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label"> {this.setTitle()} </h3>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <IngresosFormulario type={type} at={access_token} dato={ingreso} history={history} />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(IngresoFormNew);