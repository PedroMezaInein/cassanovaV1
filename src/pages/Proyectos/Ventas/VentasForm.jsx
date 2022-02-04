import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { VentasFormulario } from '../../../components/forms'
import { errorAlert } from '../../../functions/alert'

class VentasForm extends Component {

    state = {
        type: 'add',
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
            case 'add':
                this.setState({
                    ...this.state,
                    type: action
                })
                break;
            case 'edit':
                if(state){
                    if(state.venta){
                        this.setState({
                            ...this.state,
                            venta: state.venta,
                            type: action
                        })
                    }else{
                        history.push( '/proyectos/venta' )
                    }
                }else{
                    history.push( '/proyectos/venta' )
                }
                break;
            case 'convert':
                if(state){
                    if(state.solicitud){
                        this.setState({
                            ...this.state,
                            solicitud: state.solicitud,
                            type: action
                        })
                    }else{
                        history.push( '/proyectos/solicitud-venta' )
                    }
                }else{
                    history.push( '/proyectos/solicitud-venta' )
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
        switch(type){
            case 'add':
                return 'Nueva venta'
            case 'edit':
                return 'Editar venta'
            case 'convert':
                return 'Convertir solicitud de venta'
            default: break;
        }
    }

    render() {
        const { type, venta, solicitud } = this.state
        const { history, authUser: { access_token } } = this.props
        return (
            <Layout active = 'proyectos'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label"> { this.setTitle() } </h3>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <VentasFormulario type = { type } at = { access_token } 
                            dato = { venta } solicitud = { solicitud } 
                            history = { history }  />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(VentasForm);