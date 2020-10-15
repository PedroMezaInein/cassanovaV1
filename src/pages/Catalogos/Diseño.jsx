import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, URL_ASSETS } from '../../constants'
import { setSelectOptions} from '../../functions/setters'
import { waitAlert, errorAlert, forbiddenAccessAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Card, Nav, Tab, Tabs } from 'react-bootstrap'
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
        options:{
            empresas: []
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
            empresas: []
        },
        formeditado: 0,
        empresa: ''
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
                const { options, data, form } = this.state
                let { empresa } = this.state
                data.empresas = empresas
                options.empresas = setSelectOptions(empresas, 'name')
                if(empresas){
                    if(empresas.length){
                        empresa = empresas[0]
                        form.precio_inicial_diseño = empresa.precio_inicial_diseño
                        form.incremento_esquema_2 = empresa.incremento_esquema_2
                        form.incremento_esquema_3 = empresa.incremento_esquema_3
                    }
                }
                this.setState({
                    ...this.state,
                    options,
                    data,
                    empresa,
                    form
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
        let aux = true
        let arreglo = []
        form.variaciones.map( (variacion, index) => {
            if(variacion.inferior === '' || variacion.superior === '' || variacion.cambio === '' || 
                variacion.inferior === null || variacion.superior === null || variacion.cambio === null){
                variacion.error = true
                aux = false
            }else
                if(parseInt(variacion.inferior) >= parseInt(variacion.superior)){
                    variacion.inferior = null
                    variacion.superior = null
                    variacion.error = true
                    aux = false
                }else
                    variacion.error = false
            arreglo.push(variacion)
        })
        if(aux){
            form.variaciones = arreglo
            form.variaciones.push(
                {
                    inferior: '',
                    superior: '',
                    cambio: ''
                }
            )
        }else{
            form.variaciones = arreglo
        }
        this.setState({
            ...this.state,
            form
        })
    }

    changeActiveKey = empresa => {
        const { form } = this.state
        form.precio_inicial_diseño = empresa.precio_inicial_diseño
        form.incremento_esquema_2 = empresa.incremento_esquema_2
        form.incremento_esquema_3 = empresa.incremento_esquema_3
        this.setState({
            ...this.state,
            empresa: empresa,
            form
        })
    }

    onChangeVariaciones = (key, e, name) => {
        const { value } = e.target
        const { form, data } = this.state

        form.variaciones[key][name] = value
        
        this.setState({
            ...this.state,
            form
        })
    }

    render() {
        const { form, options, empresa, data } = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <Tab.Container activeKey = { empresa !== ''  ? empresa.id : '' } >
                    <Card className="card-custom">
                        <Card.Header className="align-items-center border-0">
                            <div className="card-title">
                                <h3 className="card-label">Diseño</h3>
                            </div>
                            <div className="card-toolbar">
                                <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0">
                                    {
                                        data.empresas.map( (empresa, index) => {
                                            return (
                                                <Nav.Item key = { index } className="nav-item" onClick = { (e) => { e.preventDefault(); this.changeActiveKey(empresa) } } >
                                                    <Nav.Link eventKey={empresa.id}>{empresa.name}</Nav.Link>
                                                </Nav.Item>
                                            )
                                        })
                                    }        
                                </Nav>
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
                                onChangeVariaciones = { this.onChangeVariaciones }
                            />
                        </Card.Body>
                    </Card>
                </Tab.Container>
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