import React, { Component } from 'react' 
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV} from '../../constants'
import { setOptions} from '../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert, doneAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { CalidadView} from '../../components/forms'
import { Card } from 'react-bootstrap'


class CalidadForm extends Component{

    state = {
        ticket: ''
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
                                ticket: calidad
                            })
                        }
                    }
                }
                break;
            default:
                break;
        }
        if(!remisiones)
            history.push('/')
    }

    changeEstatus = estatus =>  {
        const { ticket } = this.state
        this.changeEstatusAxios({id: ticket.id, estatus: estatus})
    }

    async changeEstatusAxios(data){
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'calidad/estatus/' + data.id, data, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { ticket } = response.data
                console.log(ticket, 'ticket')
                this.setState({
                    ... this.state,
                    ticket: ticket
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

        const { ticket } = this.state

        return(
            <Layout active={'proyectos'}  {...this.props}>
                <CalidadView
                    data = { ticket } 
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