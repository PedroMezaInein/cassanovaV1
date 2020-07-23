import React, { Component } from 'react' 
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import Layout from '../../components/layout/layout' 
import { Modal} from '../../components/singles' 
import { NOMINA_ADMIN_COLUMNS, URL_DEV} from '../../constants'
import NewTable from '../../components/tables/NewTable' 
import { NominaAdminForm } from '../../components/forms'
import { setOptions, setDateTable, setMoneyTable, setTextTable } from '../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert} from '../../functions/alert'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { renderToString } from 'react-dom/server'

const $ = require('jquery');

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
            usuarios: [],
            empresas:[]
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const nominaadmin = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!nominaadmin)
            history.push('/')
            this.getOptionsAxios()
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if(title === 'Editar nómina administrativa')
            console.log('editar')
        else    
            this.addNominaAdminAxios()
    }

    async getNominasAxios(){
        var table = $('#kt_datatable2_nomina_admin')
            .DataTable();
        table.ajax.reload();
    }

    async getOptionsAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rh/nomina-administrativa/options', { responseType:'json', headers: {Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                swal.close()
                const { usuarios, empresas } = response.data
                const { options, data } = this.state 
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

    async addNominaAdminAxios(){
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
                case 'nominasAdmin':
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
        await axios.post(URL_DEV + 'rh/nomina-administrativa', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                this.handleCloseModal()
                this.getNominasAxios()
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
            formeditado:0,
            title: 'Nueva nómina administrativa',
        })
    }

    openModalEdit = nomina => {
        const { modal, form } = this.state
        modal.form = true

        form.periodo = nomina.periodo
        form.empresa = nomina.empresa ? nomina.empresa.id.toString() : ''
        form.fechaInicio = new Date(nomina.fecha_inicio)
        form.fechaFin = nomina.fecha_fin ? new Date(nomina.fecha_fin) : ''

        let aux = []
        nomina.nominas_administrativas.map( (nom, key) => {
            console.log(key, ' - ', nom)
            aux.push(
                {
                    usuario: nom.empleado ? nom.empleado.id.toString() : '',
                    sueldoDiario: nom.sueldo_diario,
                    diasVP: nom.dias_vp,
                    diasVNP: nom.dias_vnp,
                    nominImss: nom.nomina_imss,
                    restanteNomina: nom.restante_nomina,
                    extras:nom.extras
                }
            )
        })

        if(aux.length){
            form.nominasAdmin = aux
        }else{
            form.nominasAdmin = [{
                usuario: '',
                sueldoDiario: '',
                diasVP: '',
                diasVNP: '', 
                nominImss: '',
                restanteNomina: '',
                extras: ''
            }]
        }


        this.setState({
            ... this.state,
            modal,
            title: 'Editar nómina administrativa',
            nomina: nomina,
            form,
            formeditado:1
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
                case 'adjuntos': 
                    form[element] = {
                        adjunto:{
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

    setNominaAdmin = nominas => {
        let aux = []
        nominas.map( (nomina) => {
            aux.push(
                {
                    actions: this.setActions(nomina),
                    periodo: renderToString(setTextTable(nomina.periodo)),
                    fechaInicio: renderToString(setDateTable(nomina.fecha_inicio)),
                    fechaFin: renderToString(setDateTable(nomina.fecha_fin)),
                    totalNominaIMSS: renderToString(setMoneyTable(nomina.totalNominaImss)),
                    restanteNomina: renderToString(setMoneyTable(nomina.totalRestanteNomina)),
                    extras: renderToString(setMoneyTable(nomina.totalExtras)),
                    granTotal: renderToString(setMoneyTable(nomina.totalNominaImss + nomina.totalRestanteNomina + nomina.totalExtras)),
                    id: nomina.id
                }
            )
        })
        return aux
    }

    setActions = nomina => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' }
            }
        )
        return aux
    }
    
    render() {
        const { modal, options, title, form, formeditado} = this.state

        return (
            <Layout active={'rh'} {...this.props}>
                <NewTableServerRender   
                    columns = { NOMINA_ADMIN_COLUMNS }
                    title = 'Nómina Administrativa' subtitle = 'Listado de Nómina Administrativa'
                    mostrar_boton={true}
                    abrir_modal={true} 
                    onClick={this.openModal} 
                    mostrar_acciones={true} 
                    actions={{
                        'edit': { function: this.openModalEdit }
                    }}
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setNominaAdmin }
                    urlRender = {URL_DEV + 'rh/nomina-administrativa'}
                    idTable = 'kt_datatable2_nomina_admin'
                />

                <Modal size="xl" title={title} show={modal.form} handleClose={this.handleCloseModal}>
                    <NominaAdminForm
                        title = { title }
                        formeditado={formeditado}
                        className=" px-3 "
                        options={options}
                        form={form}
                        addRowNominaAdmin={this.addRowNominaAdmin}
                        deleteRowNominaAdmin={this.deleteRowNominaAdmin}
                        onChangeNominasAdmin={this.onChangeNominasAdmin}
                        onChange={this.onChange}
                        onChangeAdjunto={this.onChangeAdjunto}
                        clearFiles={this.clearFiles}
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