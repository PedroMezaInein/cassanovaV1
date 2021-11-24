import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { ComprasFormNew } from '../../../components/forms'

class ComprasForm extends Component {

    state = {
        type: 'add',
        compra: null
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
                break;
            case 'edit':
                break;
            case 'convert': 
                break;
            default:
                history.push('/')
                break;
        }
        this.setState({
            ...this.state,
            type: action
        })
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
        const { type, compra } = this.state
        const { access_token } = this.props.authUser
        return (
            <Layout active = 'proyectos'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label"> { this.setTitle() } </h3>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <ComprasFormNew type = { type } at = { access_token } dato = { compra } />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(ComprasForm);