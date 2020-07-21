import React, { Component } from 'react' 
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import Layout from '../../components/layout/layout' 
import { Modal, Card, ModalDelete} from '../../components/singles' 
import { NOMINA_OBRA_COLUMNS, URL_DEV} from '../../constants'
import NewTable from '../../components/tables/NewTable' 
import { NominaObraForm } from '../../components/forms'
import { setOptions, setSelectOptions } from '../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert, createAlert } from '../../functions/alert'

class NominaObra extends Component {
    state = {  
        formeditado:0,
        modal:{
            form: false,
            delete: false,
            adjuntos: false,
        },
        title: 'Nueva nómina de obra',
        form:{
            periodo : '',
            empresa: 0,
            fechaInicio: new Date(),
            fechaFin: new Date(),
            usuario: '',
            proyecto: '',
            sueldoh: '',
            hora1T: '',
            hora2T: '',
            hora3T: '',
            nominImss: '',
            restanteNomina: '',
            extras: ''
        },
        options: { 
            proyectos: [],
            usuarios: []
        },
        nominaObra:""
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const nominaobra = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!nominaobra)
            history.push('/')
            this.getOptionsAxios()
    }

    //Setters
    setOptions = (name, array) => {
        const {options} = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }

    async getOptionsAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rh/nomina-obra/options', { responseType:'json', headers: {Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                swal.close()
                const { proyectos, usuarios} = response.data
                const { options, data } = this.state
                options['proyectos'] = setSelectOptions(proyectos, 'nombre', 'id')
                options['usuarios'] = setSelectOptions( usuarios, 'usuarios', 'id')
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

    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            ... this.state,
            modal,
            form: this.clearForm(),
            formeditado:0
        })
    }

    handleCloseModal = () => {
        const { modal } = this.state 
        modal.form = false
        this.setState({
            ... this.state,
            modal, 
            form: this.clearForm()
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fechaInicio':
                case 'fechaFin':
                    form[element] = new Date()
                    break;
                case 'proyectos':
                case 'usuarios':
                    form[element] = {
                        proyectos: '',
                        usuarios: ''
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }
    
    render() {
        const { modal, title, data, formeditado} = this.state

        return (
            <Layout active={'rh'} {...this.props}>
                <NewTable   
                    columns = { NOMINA_OBRA_COLUMNS } data = { "" } 
                    title = 'Nómina de obra' subtitle = 'Listado de nómina de obra'
                    mostrar_boton={true}
                    abrir_modal={true} 
                    onClick={this.openModal} 
                    mostrar_acciones={false} 
                    actions = {{
                    }}
                    elements = { "" }
                />

                <Modal size="xl" title={title} show={modal.form} handleClose={this.handleCloseModal}>
                    <NominaObraForm
                        formeditado={formeditado}
                        className=" px-3 "     
                    >
                    </NominaObraForm>
                </Modal>  
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

export default connect(mapStateToProps, mapDispatchToProps)(NominaObra);