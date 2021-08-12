import React, { Component } from 'react' 
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV} from '../../../constants'
import { errorAlert, printResponseErrorAlert, doneAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { PrecioDiseñoForm as Formulario } from '../../../components/forms'
import { Card } from 'react-bootstrap'


class PrecioDiseñoForm extends Component{

    state = {
        precio: '',
        form:{
            m2: 0,
            precio_m2: 0.0,
            esquema_1: 0.0,
            esquema_2: 0.0,
            esquema_3: 0.0,
            incremento_esquema_2: 0,
            incremento_esquema_3: 0
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos  } } } = this.props
        const { history : { location: { pathname } } } = this.props
        const { match : { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const remisiones = permisos.find(function(element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch(action){
            case 'add':
                const { form } = this.state
                form.precio_m2 = 550
                form.incremento_esquema_2 = 45
                form.incremento_esquema_3 = 95
                this.setState({
                    ...this.state,
                    title: 'Nuevo elemento',
                    formeditado:0,
                    form
                })
                break;
            case 'edit':
                if(state){
                    if(state.precio)
                    {
                        const { form } = this.state
                        const { precio } = state
                        form.m2 = precio.m2
                        form.precio_m2 = precio.precio_m2
                        form.esquema_1 = precio.esquema_1
                        form.incremento_esquema_2 = precio.incremento_esquema_2
                        form.esquema_2 = precio.esquema_2
                        form.incremento_esquema_3= precio.incremento_esquema_3
                        form.esquema_3 = precio.esquema_3
                        
                        this.setState({
                            ...this.state,
                            title: 'Editar elemento',
                            form,
                            precio: precio
                        })
                        
                    }
                    else
                        history.push('/catalogos/precio-diseno')
                }else
                    history.push('/catalogos/precio-diseno')
                break;
            default:
                break;
        }
        if(!remisiones)
            history.push('/')
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        
        if(name !== 'esquema_1' && name !== 'esquema_2' && name !== 'esquema_3'){
            form.esquema_1 = Math.ceil(form.m2 * form.precio_m2)
            form.esquema_2 = Math.ceil(form.esquema_1 * ( 1 + (form.incremento_esquema_2 / 100)))
            form.esquema_3 = Math.ceil(form.esquema_1 * ( 1 + (form.incremento_esquema_3 / 100)))
        }

        this.setState({
            ...this.state,
            form
        })
    }

    onSubmit = e => {
        e.preventDefault();
        const { title } = this.state
        if(title === 'Editar elemento')
            this.editPrecioAxios()
        else
            this.addPrecioAxios()
    }

    async addPrecioAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'precios-diseño', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.')

                const { history } = this.props
                    history.push({
                    pathname: '/catalogos/precio-diseno'
                });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async editPrecioAxios() {
        const { access_token } = this.props.authUser
        const { form, precio } = this.state
        await axios.put(URL_DEV + 'precios-diseño/'+precio.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.')
                
                const { history } = this.props
                    history.push({
                    pathname: '/catalogos/precio-diseno'
                });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    render(){

        const { form, title } = this.state

        return(
            <Layout active={'catalogos'}  { ...this.props}>                
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Formulario 
                            onChange = { this.onChange } 
                            formeditado = { 0 }  
                            form = { form } 
                            title = { title } 
                            onSubmit = { this.onSubmit } />
                    </Card.Body>    
                </Card>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(PrecioDiseñoForm);