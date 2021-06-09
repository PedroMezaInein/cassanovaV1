import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import { URL_DEV } from '../../../constants'
import { setOptions } from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert } from '../../../functions/alert'
import { NominaAdminForm as NominaAdminFormulario } from '../../../components/forms'
import { setFormHeader, setSingleHeader } from '../../../functions/routers'
import { onChangeAdjunto } from '../../../functions/onChanges'
import moment from 'moment'
const meses = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

class NominaAdminForm extends Component {
    state = {
        formeditado: 0,
        data: {
            adjuntos: [],
            usuarios: []
        },
        title: 'Nueva nómina administrativa',
        form: {
            periodo: '',
            empresa:'',
            empresas: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            cuentaImss: '',
            cuentaRestante: '',
            cuentaExtras: '',
            nominasAdmin: [{
                usuario: '',
                nominImss: '',
                restanteNomina: '',
                extras: ''
            }],
            quincena:new Date().getDate() < 15 ? '1Q' : '2Q',
            mes: meses[new Date().getMonth()],
            año: new Date().getFullYear(),
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Ingresa los adjuntos',
                    files: []
                }
            }
        },
        options: {
            usuarios: [],
            empresas: [],
            cuentas: []
        },
        action: '',
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props

        const nominaOmbra = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nueva nómina administrativa',
                    formeditado: 0,
                    action: 'add'
                })
                break;
            case 'edit':
                if (state) {
                    if (state.nomina) {
                        const { nomina } = state
                        const { form, options } = this.state
                        form.periodo = nomina.periodo
                        form.empresa = nomina.empresa ? nomina.empresa.id.toString() : ''
                        form.fechaInicio = new Date(nomina.fecha_inicio)
                        form.fechaFin = nomina.fecha_fin ? new Date(nomina.fecha_fin) : ''

                        let aux = []
                        nomina.nominas_administrativas.forEach((nom, key) => {
                            aux.push(
                                {
                                    usuario: nom.empleado ? nom.empleado.id.toString() : '',
                                    nominImss: nom.nomina_imss,
                                    restanteNomina: nom.restante_nomina,
                                    extras: nom.extras,
                                    id: nom.id
                                }
                            )
                        })

                        if (aux.length) { form.nominasAdmin = aux } 
                        else { form.nominasAdmin = [{ usuario: '', nominImss: '', restanteNomina: '', extras: '' }] }

                        if(nomina.egresos){
                            if(nomina.egresos.length){
                                if(nomina.cuentaImss){ form.cuentaImss = nomina.cuentaImss.id.toString() }
                                if(nomina.cuentaRestante){ form.cuentaRestante = nomina.cuentaRestante.id.toString() }
                                if(nomina.cuentaExtras){ form.cuentaExtras = nomina.cuentaExtras.id.toString() }
                            }
                        }
                        this.setState({
                            ...this.state,
                            title: 'Editar nómina administrativa',
                            nomina: nomina,
                            form,
                            options,
                            formeditado: 1,
                            action: 'edit'
                        })
                    }
                    else
                        history.push('/rh/nomina-obras')
                } else
                    history.push('/rh/nomina-obras')
                break;
            default:
                break;
        }
        if (!nominaOmbra)
            history.push('/')
        this.getOptionsAxios()
    }

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({ ...this.state, options })
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.options(`${URL_DEV}v2/rh/nomina-administrativa`, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { usuarios, empresas, cuentas } = response.data
                const { options, data, form, formeditado } = this.state
                data.usuarios = usuarios
                options.empresas = setOptions(empresas, 'name', 'id')
                options.cuentas = setOptions(cuentas, 'nombre', 'id')
                if(formeditado === 0){
                    let aux = []
                    usuarios.forEach((element) =>{
                        aux.push({
                            'usuario': element.id.toString(),
                            'nominImss': element.nomina_imss,
                            'restanteNomina': element.nomina_extras,
                            'extras': 0.0
                        })
                    })
                    form.nominasAdmin = aux
                }
                options.usuarios = this.updateOptionsUsuarios(form.nominasAdmin)
                this.setState({ ...this.state, options, data, form })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addNominaAdminAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.forEach((element) => {
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
        aux.forEach((element) => {
            if (form.adjuntos[element].value !== '') {
                form.adjuntos[element].files.forEach((file) => {
                    data.append(`files_name_${element}[]`, file.name)
                    data.append(`files_${element}[]`, file.file)
                })
                data.append('adjuntos[]', element)
            }
        })
        await axios.post(`${URL_DEV}v2/rh/nomina-administrativa`, data, { headers: setFormHeader(access_token) }).then(
            (response) => {
                const { history } = this.props
                doneAlert(response.data.message !== undefined ? response.data.message : 'La nomina fue modificado con éxito.')
                history.push({ pathname: '/rh/nomina-admin' });
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async updateNominaAdminAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, nomina } = this.state
        await axios.put(`${URL_DEV}v2/rh/nomina-administrativa/${nomina.id}`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { nom } = response.data
                const { options } = this.state
                doneAlert(response.data.message !== undefined ? response.data.message : 'La nomina fue modificado con éxito.')
                let aux = []
                nom.nominas_administrativas.forEach((element, key) => {
                    aux.push(
                        {
                            usuario: element.empleado ? element.empleado.id.toString() : '',
                            nominImss: element.nomina_imss,
                            restanteNomina: element.restante_nomina,
                            extras: element.extras,
                            id: element.id
                        }
                    )
                })
                if (aux.length) { form.nominasAdmin = aux } 
                else { form.nominasAdmin = [{ usuario: '', nominImss: '', restanteNomina: '', extras: '' }] }
                options.usuarios = this.updateOptionsUsuarios(form.nominasAdmin)
                window.history.replaceState(nom, 'nomina')
                this.setState({...this.state, nomina: nom, options, form })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteRowNominaAdmin = async(nominaAdmin, key) => {
        if(nominaAdmin.id){
            waitAlert()
            const { access_token } = this.props.authUser
            const { nomina } = this.state
            await axios.delete(`${URL_DEV}v2/rh/nomina-administrativa/${nomina.id}/${nominaAdmin.id}`, { headers: setSingleHeader(access_token) }).then(
                (response) => {
                    Swal.close()
                    const { form, options } = this.state
                    const { nom } = response.data
                    let aux = []
                    nom.nominas_administrativas.forEach((element, key) => {
                        aux.push(
                            {
                                usuario: element.empleado ? element.empleado.id.toString() : '',
                                nominImss: element.nomina_imss,
                                restanteNomina: element.restante_nomina,
                                extras: element.extras,
                                id: element.id
                            }
                        )
                    })
                    if (aux.length) { form.nominasAdmin = aux } 
                    else { form.nominasAdmin = [{ usuario: '', nominImss: '', restanteNomina: '', extras: '' }] }
                    options.usuarios = this.updateOptionsUsuarios(form.nominasAdmin)
                    window.history.replaceState(nom, 'nomina')
                    this.setState({...this.state, nomina: nom, options, form })
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.log(error, 'error')
            })
        }else{
            let aux = []
            const { form, options } = this.state
            form.nominasAdmin.forEach((element, index) => {
                if(index !== key)
                    aux.push(element)
            })
            if (aux.length) { form.nominasAdmin = aux } 
            else { form.nominasAdmin = [{ usuario: '', nominImss: '', restanteNomina: '', extras: '' }] }
            options.usuarios = this.updateOptionsUsuarios(form.nominasAdmin)
            this.setState({...this.state, form, options})
        }
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    form[element] = new Date()
                    break;
                case 'nominasAdmin':
                    form[element] = [{
                        usuarios: ''
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
            return false
        })
        return form;
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form.adjuntos[name].files.length; counter++) { if (counter !== key) { aux.push(form.adjuntos[name].files[counter]) } }
        if (aux.length < 1) { form.adjuntos[name].value = '' }
        form.adjuntos[name].files = aux
        this.setState({ ...this.state, form })
    }

    onChange = e => {
        const { name, value } = e.target
        let { form } = this.state
        form[name] = value
        if(form.empresa !== ''){
            form.periodo = form.año+form.mes+form.quincena
            if(form.quincena === '1Q'){
                form.fechaInicio= moment(`${form.año}-${form.mes}-01`).format("DD/MM/YYYY");
                form.fechaFin= moment(`${form.año}-${form.mes}-15`).format("DD/MM/YYYY");
            }else{
                var diasMes = new Date(form.año, form.mes, 0).getDate();
                form.fechaInicio= moment(`${form.año}-${form.mes}-16`).format("DD/MM/YYYY");
                form.fechaFin= moment(`${form.año}-${form.mes}-${diasMes}`).format("DD/MM/YYYY");
            }
        }
        this.setState({ ...this.state, form })
    }
    
    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Editar nómina administrativa')
            this.updateNominaAdminAxios()
        else
            this.addNominaAdminAxios()
    }

    onChangeNominasAdmin = (key, e, name) => {
        const { value } = e.target
        const { form, data, options } = this.state
        if(name === 'usuario'){
            data.usuarios.map( (empleado) => {
                if(value.toString() === empleado.id.toString()){
                    form['nominasAdmin'][key].nominImss = empleado.nomina_imss
                    form['nominasAdmin'][key].restanteNomina = empleado.nomina_extras
                    form['nominasAdmin'][key].extras = 0.0
                }
                return false
            }) 
        }
        form['nominasAdmin'][key][name] = value
        if(name === 'usuario'){
            options.usuarios = this.updateOptionsUsuarios(form.nominasAdmin)
        }
        
        this.setState({ ...this.state, form, options })
    }

    addRowNominaAdmin = () => {
        const { form } = this.state
        form.nominasAdmin.push( {  usuario: '', nominImss: '', restanteNomina: '', extras: '' } )
        this.setState({ ...this.state, form })
    }

    handleChange = (files, item) => {
        const { form } = this.state
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
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({ ...this.state, form })
    }

    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({ ...this.state, form })
    }

    updateOptionsUsuarios = (formulario) => {
        const { data, options } = this.state
        let aux = []
        let aux2 = []
        options.usuarios = setOptions(data.usuarios, 'nombre', 'id')
        formulario.forEach((element) => {
            aux.push(element.usuario)
        })
        options.usuarios.forEach((element) => {
            if(!aux.includes(element.value))
                aux2.push(element)
        })
        return aux2
    }

    render() {
        const { options, title, form, formeditado, data, action } = this.state
        return (
            <Layout active={'rh'} {...this.props}>
                <NominaAdminFormulario title = { title } formeditado = { formeditado } className = "px-3" options = { options } form = { form }
                    addRowNominaAdmin = { this.addRowNominaAdmin } deleteRowNominaAdmin = { this.deleteRowNominaAdmin } 
                    onChangeNominasAdmin = { this.onChangeNominasAdmin } onChange = { this.onChange } clearFiles = { this.clearFiles } 
                    onSubmit = { this.onSubmit } handleChange = { this.handleChange } onChangeRange = { this.onChangeRange } 
                    usuarios = { data.usuarios } action = { action } onChangeAdjunto={ (e) => { this.setState({...this.state,form: onChangeAdjunto(e, form) });}}/>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(NominaAdminForm);