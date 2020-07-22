import React, { Component } from 'react' 
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import Layout from '../../components/layout/layout' 
import { Modal} from '../../components/singles' 
import { NOMINA_ADMIN_COLUMNS, URL_DEV} from '../../constants'
import NewTable from '../../components/tables/NewTable' 
import { NominaAdminForm } from '../../components/forms'
import { setOptions} from '../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert} from '../../functions/alert'

class NominaAdmin extends Component {
    state = {  
        formeditado:0,
        modal:{
            form: false,
            delete: false,
            adjuntos: false,
        },
        title: 'Nueva nómina administrativa',
        form:{
            periodo : '',
            empresas: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            nominasAdmin:[{
                usuario: '',
                sueldoDiario: '',
                diasVP: '',
                diasVNP: '', 
                nominImss: '',
                restanteNomina: '',
                extras: ''
            }]
        },
        options: {
            usuarios: [],
            empresas:[]
        },
        nominaAdmin:""
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
        await axios.get(URL_DEV + 'rh/nomina-administrativa/options', { responseType:'json', headers: {Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                swal.close()
                const { usuarios, empresas } = response.data
                const { options, data } = this.state 
                options['usuarios'] = setOptions( usuarios, 'name', 'id')
                options['empresas'] = setOptions(empresas, 'name', 'id')
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
    //Submits
    // onSubmit = e => {
    //     e.preventDefault()
    //     const { title } = this.state
    //     waitAlert()
    //     if(title === 'Editar nómina de obra')
    //         this.editCompraAxios()
    //     else
    //         this.addCompraAxios()
    // }
    
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
                case 'nominasAdmin':
                    form[element] = [{
                        usuarios: '',
                        empresa:''
                    }]
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }

    onChangeNominasAdmin = (key, e, name) => {
        const { value } = e.target
        const { form } = this.state
        form['nominasAdmin'][key][name]  = value
        this.setState({
            ...this.state,
            form
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

    addRowNominaAdmin = () => {
        const { form } = this.state
        form.nominasAdmin.push(
            {
                nominasAdmin:[{
                    usuario: '',
                    sueldoDiario: '',
                    diasVP: '',
                    diasVNP: '', 
                    nominImss: '',
                    restanteNomina: '',
                    extras: ''
                }]
            }
        )
        this.setState({
            ... this.state,
            form
        })
    }

    deleteRowNominaAdmin = () => {
        const { form } = this.state
        form.nominasAdmin.pop(
            {
                nominasAdmin:[{
                    usuario: '',
                    sueldoDiario: '',
                    diasVP: '',
                    diasVNP: '', 
                    nominImss: '',
                    restanteNomina: '',
                    extras: ''
                }]
            }
        )
        this.setState({
            ... this.state,
            form
        })
    }
    
    render() {
        const { modal, options, title, data, form, formeditado} = this.state

        return (
            <Layout active={'rh'} {...this.props}>
                <NewTable   
                    columns = { NOMINA_ADMIN_COLUMNS } data = { "" } 
                    title = 'Nómina Administrativa' subtitle = 'Listado de Nómina Administrativa'
                    mostrar_boton={true}
                    abrir_modal={true} 
                    onClick={this.openModal} 
                    mostrar_acciones={false} 
                    actions = {{
                    }}
                    elements = { "" }
                />

                <Modal size="xl" title={title} show={modal.form} handleClose={this.handleCloseModal}>
                    <NominaAdminForm
                        formeditado={formeditado}
                        className=" px-3 "   
                        options = { options }
                        form ={form}
                        addRowNominaAdmin = { this.addRowNominaAdmin }
                        deleteRowNominaAdmin = { this.deleteRowNominaAdmin }
                        onChangeNominasAdmin =  { this.onChangeNominasAdmin }
                        onChange = { this.onChange } 
                        onSubmit = { this.onSubmit }
                    >
                    </NominaAdminForm>
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

export default connect(mapStateToProps, mapDispatchToProps)(NominaAdmin);