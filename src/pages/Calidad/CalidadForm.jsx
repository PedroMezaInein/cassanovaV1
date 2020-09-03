import React, { Component } from 'react' 
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV} from '../../constants'
import { setOptions} from '../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert, doneAlert, createAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { CalidadView} from '../../components/forms'
import { Card } from 'react-bootstrap'


class CalidadForm extends Component{

    state = {
        ticket: '',
        form: {
            adjuntos:{
                presupuesto:{
                    value: '',
                    placeholder: 'Presupuesto',
                    files: []
                }
            }
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { match : { params: { action: action } } } = this.props
        const { history, location: { state: state} } = this.props
        const remisiones = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url + '/' + action
        });
        switch(action){
            
            case 'see':
                if(state){
                    if(state.calidad)
                    {
                        const { calidad } = state
                        if(calidad.estatus_ticket.estatus === 'En espera')
                            this.changeEstatusAxios({id: calidad.id})
                        else{
                            this.setState({
                                ... this.state,
                                ticket: calidad,
                                form: this.setForm(calidad)
                            })
                        } 
                    }
                    else
                        history.push('/calidad/calidad')
                }
                else
                    history.push('/calidad/calidad')
                break;
            default:
                break;
        }
        if(!remisiones)
            history.push('/')
    }

    setForm = ticket => {
        const { form } = this.state
        let aux = []
        ticket.presupuesto.map( (presupuesto) => {
            aux.push({
                name: presupuesto.name,
                url: presupuesto.url,
                file: ''
            })
        })
        console.log(ticket, 'ticket')
        form.adjuntos.presupuesto.files = aux
        return form
    }

    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    handleChange = (files, item) => {
        createAlert('¿Deseas enviar el presupuesto?', '', () => this.sendPresupuestoTicketAxios( files, item ))
    }

    changeEstatus = estatus =>  {
        const { ticket } = this.state
        this.changeEstatusAxios({id: ticket.id, estatus: estatus})
    }

    async sendPresupuestoTicketAxios( files, item ){

        this.onChangeAdjunto({ target: { name: item, value: files, files: files } })

        waitAlert()

        const { access_token } = this.props.authUser
        const { ticket, form } = this.state
        const data = new FormData();

        let aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })
        await axios.post(URL_DEV + 'calidad/presupuesto/' + ticket.id, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { ticket } = response.data
                
                window.history.replaceState(ticket, 'calidad')

                this.setState({
                    ... this.state,
                    ticket: ticket,
                    form: this.setForm(ticket)
                })
                doneAlert('Presupuesto adjuntado con éxito.')
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

    async changeEstatusAxios(data){
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'calidad/estatus/' + data.id, data, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { ticket } = response.data
                
                window.history.replaceState(ticket, 'calidad')
                
                this.setState({
                    ... this.state,
                    ticket: ticket,
                    form: this.setForm(ticket)
                })
                if(data.estatus){
                    doneAlert('El ticket fue actualizado con éxito.')
                }
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

    render(){

        const { ticket, form } = this.state

        return(
            <Layout active={'proyectos'}  {...this.props}>
                <CalidadView
                    data = { ticket } 
                    form = { form }
                    handleChange = { this.handleChange }
                    changeEstatus = { this.changeEstatus } />
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

export default connect(mapStateToProps, mapDispatchToProps)(CalidadForm);