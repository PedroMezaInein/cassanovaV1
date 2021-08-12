import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Card } from 'react-bootstrap'
import Layout from '../../../components/layout/layout'
import { URL_DEV } from '../../../constants'
import { LeadForm as LeadFormulario } from '../../../components/forms'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert } from '../../../functions/alert'
import { setCheckedOptions, setSelectOptions } from '../../../functions/setters'

class LeadsForm extends Component {

    state = {
        title: 'Nuevo lead',
        form: {
            nombre: '',
            telefono: '',
            email: '',
            comentario: '',
            fecha: new Date(),
            empresa: 0,
            origen: 0,
            servicios: [],
            tipo_lead: 'potencial'
        },
        options:{
            empresas: [],
            origenes: [],
            servicios: []
        },
        formeditado: 0
    }

    componentDidMount(){
        const { authUser: { user : { permisos  } } } = this.props
        const { history : { location: { pathname } } } = this.props
        const { match : { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        permisos.find(function(element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        this.getOptions()
        switch(action){
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nuevo lead',
                    formeditado: 0
                })
                break;
            case 'edit':
                if(state){
                    if(state.lead)
                    {
                        const { form } = this.state
                        const { lead } = state

                        form.nombre = lead.nombre
                        form.email = lead.email
                        form.telefono = lead.telefono
                        
                        form.comentario = lead.comentario
                        
                        form.empresa = lead.empresa_id
                        form.origen = lead.tipo_id
                        form.tipo_lead = lead.tipo_lead

                        let _servicios = []
                        let servicios = form.servicios

                        servicios.map((_form, key) => {
                            const aux = lead.servicios.find( function(element, index){
                                if(element.id === _form.id)
                                    return true
                                else{
                                    return false
                                }
                            })
                            if(aux){
                                _servicios.push( { checked: true, text: _form.text, id: _form.id })
                            }else{
                                _servicios.push( { checked: false, text: _form.text, id: _form.id })
                            }
                            return false
                        })

                        form.servicios = _servicios;

                        form.fecha = new Date(lead.created_at);

                        this.setState({
                            ...this.state,
                            lead: lead,
                            title: 'Editar lead',
                            form,
                            formeditado:1
                        })
                    }
                    else
                        history.push('/leads/leads')
                }else
                    history.push('/leads/leads')
                break;
            default:
                break;
        }
    }

    handleChangeInput = (e) => {
        const { name, value } = e.target
        const { form }  = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    handleChangeDate = (date) =>{
        const { form }  = this.state
        form['fecha'] = date
        this.setState({
            ...this.state,
            form: form
        })
    }

    handleChangeCheckbox = (array) => {
        const { form }  = this.state
        form['servicios'] = array
        this.setState({
            ...this.state,
            form: form
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if(title === 'Editar lead'){
            this.editLeadAxios()
        }else{
            this.addLeadAxios()
        }
    }

    async getOptions(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'lead/options/options', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas, origenes, servicios } = response.data
                const { options,form, lead } = this.state
                form.servicios = setCheckedOptions(servicios, 'servicio')
                options.empresas = setSelectOptions(empresas, 'name')
                options.origenes = setSelectOptions(origenes, 'origen')
                if(lead){
                    let _servicios = []
                    let servicios = form.servicios
                    servicios.map((_form, key) => {
                        const aux = lead.servicios.find( function(element, index){
                            if(element.id === _form.id)
                                return true
                            else{
                                return false
                            }
                        })
                        if(aux){
                            _servicios.push( { checked: true, text: _form.text, id: _form.id })
                        }else{
                            _servicios.push( { checked: false, text: _form.text, id: _form.id })
                        }
                        return false
                    })
                    form.servicios = _servicios;
                }
                this.setState({
                    ...this.state,
                    form,
                    options
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async addLeadAxios (){
        const { access_token } = this.props.authUser
        const { form: data } = this.state
        await axios.post(URL_DEV + 'lead', data, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/leads/leads'
                });
                doneAlert(response.data.message !== undefined ? response.data.message : 'Agregaste con éxito el lead.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async editLeadAxios (){
        const { access_token } = this.props.authUser
        const { form: data, lead } = this.state
        await axios.put(URL_DEV + 'lead/' + lead.id, data, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/leads/leads'
                });
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el lead.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    render() {
        const { form, options, formeditado,title } = this.state
        return (
            <Layout active = 'leads'  { ...this.props } >
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <LeadFormulario 
                            form = { form } 
                            options = { options }
                            onChange = { this.handleChangeInput } 
                            onChangeCalendar = { this.handleChangeDate }
                            onChangeCheckboxes = { this.handleChangeCheckbox }
                            formeditado = { formeditado }
                            onSubmit = { this.onSubmit }
                            />

                    </Card.Body>
                </Card>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(LeadsForm)