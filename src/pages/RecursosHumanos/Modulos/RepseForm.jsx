import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { RepseFormulario } from '../../../components/forms'
import { errorAlert } from '../../../functions/alert'

class RepseForm extends Component {

    state = {
        type: 'repse',
        venta: null,
        solicitud: null
    }
    
    componentDidMount() {
        const {
            authUser: { user: { permisos } },
            history: { location: { pathname, state } },
            match: { params: { action } },
            history
        } = this.props
        switch (action) {
            case 'repse':
                this.setState({
                    ...this.state,
                    type: action
                })
                break;

            case 'patronal':
                this.setState({
                    ...this.state,
                    type: action
                })
                break;
            case 'siroc':
                this.setState({
                    ...this.state,
                    type: action
                })
                break;
            case 'Colaborador':
                this.setState({
                    ...this.state,
                    type: action
                })
                break;
            case 'Nomina':
                this.setState({
                    ...this.state,
                    type: action
                })
                break;
            case 'Sipare':
                this.setState({
                    ...this.state,
                    type: action
                })
                break;
            case 'claves':
                    this.setState({
                        ...this.state,
                        type: action
                    })
                    break;
            case 'isn':
                    this.setState({
                        ...this.state,
                        type: action
                    })
                    break;

                case 'add':
                    this.setState({
                        ...this.state,
                        type: action
                    })
                    break;
                case 'edit_Repse':
                case 'edit_Registro Patronal':
                case 'edit_Siroc':
                case 'edit_Recibos nomina':
                case 'edit_Sipare':
                case 'edit_Accesos claves':
                case 'edit_Isn':

                    if(state){
                        if(state.venta){
                            this.setState({
                                ...this.state,
                                venta: state.venta,
                                type: action
                            })
                        }else{
                            history.push( '/rh/modulo' )
                        }
                    }else{
                        history.push( '/rh/modulo' )
                    }
                    break;
            default:
                history.push('/')
                break;
        }
        const modulo = permisos.find((venta) => {
            return pathname === `${venta.modulo.url}/${action}`
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
        // console.log(type)
        switch(type){
            case 'repse':
                return 'Nuevo registro de Repse'
            case 'patronal':
                return 'Nuevo registro Patronal'
            case 'siroc':
                return 'Nuevo Registro Siroc'
            case 'Colaborador':
                return 'Nuevo Registro de Colaboradores de obra'                
            case 'Nomina':
                return 'Nuevo Recibos de Nomina'
            case 'Sipare':
                return 'Nuevo registro de Sipare'
            case 'claves':
                return 'Nuevo registro de acceso y clave'
            case 'isn':
                return 'Nuevo registro de ISN'
            case 'edit':
            case 'edit_Repse':
                return 'Editar Repse'
            case 'edit_Registro Patronal':
                return 'Editar Registro Patronal'
            case 'edit_Siroc':
                return 'Editar Siroc'
            case 'edit_Recibos nomina':
                return 'Editar Recibo de monina'
            case 'edit_Sipare':
                return 'Editar Sipare'
            case 'edit_Accesos claves':
                return 'Editar Accesos y claves'
            case 'edit_Isn':
                return 'Editar Isn'
            case 'convert':
                return 'Convertir solicitud de venta'
            default: break;
        }
    }

    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({ ...this.state, form })
    }

    render() {
        const { type, venta } = this.state
        const { history, authUser: { access_token } } = this.props
        return (
            <Layout active = 'rh'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label"> { this.setTitle() } </h3>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <RepseFormulario type = { type } at = { access_token } 
                            dato = { venta } 
                            history = { history }  />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(RepseForm);