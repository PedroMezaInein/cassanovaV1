import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, URL_ASSETS } from '../../constants'
import { setSelectOptions} from '../../functions/setters'
import { waitAlert, errorAlert, forbiddenAccessAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { DiseñoForm } from '../../components/forms'

class Contabilidad extends Component {

    state = {
        partidas: [],
        partida: '',
        title: 'Diseño',
        empresas:{
            precio_inicial_diseño:'',
            incremento_esquema_2:'',
            incremento_esquema_3:'',
            variaciones:[{
                inferior:'',
                superior:'',
                cambio:''
            }]
        },
        form: {
            m2: '',
            precio_inicial_diseño:'',
            incremento_esquema_2:'',
            incremento_esquema_3:'',
            empresa: 'inein',
            variaciones:[{
                inferior:'',
                superior:'',
                cambio:''
            }]
        },
        data:{
            partidas:[],
        },
        formeditado: 0,
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const diseño = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!diseño)
            history.push('/')
        this.getDiseñoAxios()
    }

    async getDiseñoAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'empresa/diseño', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas } = response.data
                const { options } = this.state

                options.empresas = setSelectOptions(empresas, 'name')
                this.setState({
                    ...this.state,
                    options
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
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
            ...this.state,
            form
        })
    }


    onSubmit = e => {
        e.preventDefault()
        waitAlert()
        // this.createReporteContabilidad()
    }

    addRow = () => {
        const { form } = this.state
        form.variaciones.push(
            {
                variaciones: [{
                    inferior: '',
                    superior: '',
                    cambio: ''
                }]
            }
        )
        this.setState({
            ...this.state,
            form
        })
    }

    render() {
        const { form, options } = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">Diseño</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <DiseñoForm 
                            form = { form } 
                            options = { options } 
                            onChangeEmpresa = { this.onChangeEmpresa } 
                            updateEmpresa = { this.updateEmpresa } 
                            onChange = { this.onChange } 
                            onSubmit = { this.onSubmit }
                            addRow={this.addRow}
                        />                            
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}


const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Contabilidad);