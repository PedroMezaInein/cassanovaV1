import React, { Component } from 'react' 
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import Layout from '../../components/layout/layout' 
import { Modal} from '../../components/singles' 
import { NOMINA_OBRA_COLUMNS, URL_DEV} from '../../constants'
import NewTableServerRender from '../../components/tables/NewTableServerRender' 
import { NominaObraForm } from '../../components/forms'
import { setOptions, setDateTable, setMoneyTable, setTextTable } from '../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert} from '../../functions/alert'

const $ = require('jquery');

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
            nominasObra:[{
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
        }
    }

    componentDidMount() {
        var element = document.getElementById("kt_datatable2_nomina_obra");
        element.classList.remove("table-responsive");
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

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if(title === 'Editar nómina obra')
            console.log('editar')
        else    
            this.addNominaObraAxios() 
    }

    async getNominasAxios(){
        var table = $('#kt_datatable2_nomina_obra')
            .DataTable();
        table.ajax.reload();
    }

    async getOptionsAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rh/nomina-obra/options', { responseType:'json', headers: {Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                swal.close()
                const { proyectos, usuarios, empresas} = response.data
                const { options} = this.state
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
                case 'nominasObra':
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
            title: 'Nueva nómina obra',
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
        console.log(nomina)
        nomina.nominas_obras.map( (nom, key) => {
            console.log(key, ' - ', nom)
            aux.push(
                {
                    usuario: nom.empleado ? nom.empleado.id.toString() : '',
                    proyecto: nom.proyecto ? nom.proyecto.id.toString() : '',
                    sueldoh: nom.sueldo_por_hora,
                    hora1T: nom.horas_1t,
                    hora2T: nom.horas_2t,
                    hora3T: nom.horas_3t,
                    nominImss: nom.nomina_imss,
                    restanteNomina:nom.restante_nomina,
                    extras:nom.extras
                }
            )
        })

        if(aux.length){
            form.nominasObra = aux
        }else{
            form.nominasObra = [{
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

        this.setState({
            ... this.state,
            modal,
            title: 'Editar nómina obra',
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
                case 'nominasObra':
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

    onChangeNominasObra = (key, e, name) => {
        const { value } = e.target
        const { form } = this.state
        form['nominasObra'][key][name]  = value
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

    addRowNominaObra = () => {
        const { form } = this.state
        form.nominasObra.push(
            {
                nominasObra:[{
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

    deleteRowNominaObra = () => {
        const { form } = this.state
        form.nominasObra.pop(
            {
                nominasObra:[{
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

    setNominaObra = nominas => {
        console.log(nominas)
        let aux = []
        nominas.map( (nomina) => {
            aux.push(
                {
                    actions: this.setActions(nomina),
                    periodo: renderToString(setTextTable(nomina.periodo)),
                    fechaInicio: renderToString(setDateTable(nomina.fecha_inicio)),
                    fechaFin: renderToString(setDateTable(nomina.fecha_fin)),
                    totalPagoNomina: renderToString(setMoneyTable(nomina.totalPagoNomina)),
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
                    columns = { NOMINA_OBRA_COLUMNS }
                    title = 'Nómina de obra' subtitle = 'Listado de nómina de obra'
                    mostrar_boton={true}
                    abrir_modal={true} 
                    onClick={this.openModal} 
                    mostrar_acciones={true} 
                    actions={{
                        'edit': { function: this.openModalEdit }
                    }}
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setNominaObra }
                    urlRender = {URL_DEV + 'rh/nomina-obra'}
                    idTable = 'kt_datatable2_nomina_obra'
                />

                <Modal size="xl" title={title} show={modal.form} handleClose={this.handleCloseModal}>
                    <NominaObraForm
                        formeditado={formeditado}
                        className=" px-3 "   
                        options = { options }
                        form ={form}
                        addRowNominaObra = { this.addRowNominaObra }
                        deleteRowNominaObra = { this.deleteRowNominaObra }
                        onChangeNominasObra =  { this.onChangeNominasObra }
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