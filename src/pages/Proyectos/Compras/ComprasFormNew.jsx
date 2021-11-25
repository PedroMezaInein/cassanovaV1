import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { ComprasFormNew } from '../../../components/forms'

class ComprasForm extends Component {

    state = {
        type: 'add',
        compra: null,
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
                this.setState({
                    ...this.state,
                    type: action
                })
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
                        history.push( '/proyectos/solicitud-compra' )
                    }
                }else{
                    history.push( '/proyectos/solicitud-compra' )
                }
                break;
            default:
                history.push('/')
                break;
        }
        /* if (!acceso)
            history.push('/') */
    }

    setTitle = () => {
        const { type } = this.state
        switch(type){
            case 'add':
                return 'Nueva compra'
            case 'edit':
                return 'Editar compra'
            case 'convert':
                return 'Convertir solicitud de compra'
            default: break;
        }
    }

    render() {
        const { type, compra, solicitud } = this.state
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
                        <ComprasFormNew type = { type } at = { access_token } dato = { compra } solicitud = { solicitud } history = { history }  />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(ComprasForm);