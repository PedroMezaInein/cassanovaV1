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
        title: 'Levantamiento de ticket',
        remision: '',
        form:{
            proyecto: '',
            fecha: new Date(),
            area: '',
            subarea: '',
            descripcion: '',
            adjuntos:{
                adjunto:{
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
            }
        },
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
                this.setState({
                    ... this.state,
                    title: 'Levantamiento de ticket',
                    formeditado:0
                })
                break;
            default:
                break;
        }
        if(!remisiones)
            history.push('/')
        // this.getCalidadAxios()
    }

    onChange = e => {
        const {form} = this.state
        const {name, value} = e.target
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const{ title } = this.state
        waitAlert()
        if(title === 'Editar calidad'){
            this.editRemisionAxios()
        }else
            this.addRemisionAxios()
    }

    setOptions = (name, array) => {
        const {options} = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }
    
    async getCalidadAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'calidad', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { proyectos, areas } = response.data
                const { options } = this.state
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                this.setState({
                    ... this.state,
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

    render(){

        const { form, title, options } = this.state

        return(
            <Layout active={'proyectos'}  {...this.props}>
                <CalidadView
                    title={title}
                    form={form}
                    onChange={this.onChange}
                    options={options}
                    setOptions={this.setOptions}
                    onSubmit={this.onSubmit}
                />
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