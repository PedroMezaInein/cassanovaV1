import React, { Component } from 'react' 
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import Layout from '../../components/layout/layout' 
import { Modal} from '../../components/singles' 
import { NOMINA_OBRA_COLUMNS, URL_DEV} from '../../constants'
import NewTable from '../../components/tables/NewTable' 
import { NominaObraForm } from '../../components/forms'
import { setOptions} from '../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert} from '../../functions/alert'

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
            empresas: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            nominas:[{
                usuario: '',
                proyecto: '',
                sueldoh: '',
                hora1T: '',
                hora2T: '',
                hora3T: '',
                nominImss: '',
                restanteNomina: '',
                extras: ''
            }],
            adjuntos:{
                adjunto:{
                    value: '',
                    placeholder: 'Ingresa los adjuntos',
                    files: []
                }
            }
        },
        options: { 
            proyectos: [],
            usuarios: [],
            empresas:[]
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

    onSubmit = e => {
        e.preventDefault()
        this.addNominaObraAxios()
    }

    async getOptionsAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rh/nomina-obra/options', { responseType:'json', headers: {Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                swal.close()
                const { proyectos, usuarios, empresas} = response.data
                const { options, data } = this.state
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['usuarios'] = setOptions( usuarios, 'nombre', 'id')
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

    async addNominaObraAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();

        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    data.append(element, (new Date(form[element])).toDateString())
                    break;
                case 'nominas':
                    data.append(element, JSON.stringify(form[element]))
                    break;
                case 'adjuntos':
                    break; 
                default:
                    data.append(element, form[element])
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })
        await axios.post(URL_DEV + 'rh/nomina-obra', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                
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
                case 'nominas':
                    form[element] = [{
                        usuarios: '',
                        proyecto: '',
                        empresa:''
                    }]
                    break;
                case 'adjuntos':
                    form[element] = {
                        adjunto: {
                            value: '',
                            placeholder: 'Ingresa los adjuntos',
                            files: []
                        }
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form.adjuntos[name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form.adjuntos[name].files[counter])
            }
        }
        if (aux.length < 1) {
            form.adjuntos[name].value = ''
        }
        form.adjuntos[name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    onChangeNominas = (key, e, name) => {
        const { value } = e.target
        const { form } = this.state
        form['nominas'][key][name]  = value
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
        form.adjuntos[name].value = value
        form.adjuntos[name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    addRowNomina = () => {
        const { form } = this.state
        form.nominas.push(
            {
                nominas:[{
                    usuario: '',
                    proyecto: '',
                    sueldoh: '',
                    hora1T: '',
                    hora2T: '',
                    hora3T: '',
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

    deleteRowNomina = () => {
        const { form } = this.state
        form.nominas.pop(
            {
                nominas:[{
                    usuario: '',
                    proyecto: '',
                    sueldoh: '',
                    hora1T: '',
                    hora2T: '',
                    hora3T: '',
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
        const { modal, options, title, form, formeditado} = this.state

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
                        options = { options }
                        form ={form}
                        addRowNomina = { this.addRowNomina }
                        deleteRowNomina = { this.deleteRowNomina }
                        onChangeNominas =  { this.onChangeNominas }
                        onChange = { this.onChange }
                        onChangeAdjunto = { this.onChangeAdjunto }
                        clearFiles = { this.clearFiles }
                        onSubmit = { this.onSubmit }
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