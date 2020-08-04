import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import Layout from '../../../components/layout/layout'
import { Modal, ModalDelete } from '../../../components/singles'
import { NOMINA_OBRA_COLUMNS, URL_DEV, ADJUNTOS_COLUMNS } from '../../../constants'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { AdjuntosForm } from '../../../components/forms'
import { setOptions, setDateTable, setMoneyTable, setTextTable, setAdjuntosList } from '../../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert, deleteAlert } from '../../../functions/alert'
import TableForModals from '../../../components/tables/TableForModals'
import { NominaObraForm as NominaObraFormulario } from '../../../components/forms'
import { Card } from 'react-bootstrap'

const $ = require('jquery');

class NominaObraForm extends Component {
    state = {
        formeditado: 0,
        data: {
            adjuntos: []
        },
        title: 'Nueva nómina de obra',
        form: {
            periodo: '',
            empresas: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            nominasObra: [{
                usuario: '',
                proyecto: '',
                salario_hr: '',
                salario_hr_extra: '',
                hr_trabajadas: '',
                hr_extra: '',
                nominImss: '',
                restanteNomina: '',
                extras: ''
            }],
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Ingresa los adjuntos',
                    files: []
                }
            }
        },
        options: {
            proyectos: [],
            usuarios: [],
            empresas: []
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { match: { params: { action: action } } } = this.props
        const { history, location: { state: state } } = this.props

        const nominaOmbra = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'add':
                this.setState({
                    ... this.state,
                    title: 'Nueva nómina obra',
                    formeditado: 0
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
                        nomina.nominas_obras.map((nom, key) => {
                            aux.push(
                                {
                                    usuario: nom.empleado ? nom.empleado.id.toString() : '',
                                    proyecto: nom.proyecto ? nom.proyecto.id.toString() : '',
                                    salario_hr: nom.salario_hr,
                                    salario_hr_extra: nom.salario_hr_extra,
                                    hr_trabajadas: nom.hr_trabajadas,
                                    hr_extra: nom.hr_extra,
                                    nominImss: nom.nomina_imss,
                                    restanteNomina: nom.restante_nomina,
                                    extras: nom.extras
                                }
                            )
                        })

                        if (aux.length) {
                            form.nominasObra = aux
                        } else {
                            form.nominasObra = [{
                                usuario: '',
                                proyecto: '',
                                salario_hr: '',
                                salario_hr_extra: '',
                                hr_trabajadas: '',
                                hr_extra: '',
                                nominImss: '',
                                restanteNomina: '',
                                extras: ''
                            }]
                        }
                        this.setState({
                            ... this.state,
                            title: 'Editar nómina obra',
                            nomina: nomina,
                            form,
                            options,
                            formeditado: 1
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

    openModalDelete = nomina => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ... this.state,
            modal,
            nomina: nomina
        })
    }

    openModalAdjuntos = nomina => {
        const { modal, data } = this.state
        modal.adjuntos = true
        data.adjuntos = nomina.adjuntos
        this.setState({
            ... this.state,
            modal,
            nomina: nomina,
            data,
            form: this.clearForm(),
            adjuntos: this.setAdjuntosTable(data.adjuntos)
        })
    }

    openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿Seguro deseas borrar el adjunto?', () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) })
    }


    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rh/nomina-obra/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { proyectos, usuarios, empresas } = response.data
                const { options, data } = this.state
                data.usuarios = usuarios
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['usuarios'] = setOptions(usuarios, 'nombre', 'id')
                options['empresas'] = setOptions(empresas, 'name', 'id')

                this.setState({
                    ... this.state,
                    options,
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addNominaObraAxios() {
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

                this.handleCloseModal()
                this.getNominasAxios()

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La nomina fue modificado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false,
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async updateNominaObraAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, nomina } = this.state

        await axios.put(URL_DEV + 'rh/nomina-obra/' + nomina.id, form, { headers: { Accept: '/', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state

                this.getNominasAxios()

                modal.form = false

                this.setState({
                    ... this.state,
                    modal,
                    nomina: '',
                    form: this.clearForm()
                })

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La nomina fue modificado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false,
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteNominaObraAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, nomina } = this.state

        await axios.delete(URL_DEV + 'rh/nomina-obra/' + nomina.id, { headers: { Accept: '/', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                const { nomina } = response.data
                this.getNominasAxios()

                modal.delete = false

                this.setState({
                    ... this.state,
                    modal,
                    nomina: '',
                    form: this.clearForm()
                })

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La nomina fue eliminada con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false,
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addAdjuntoNominaAdminAxios() {

        const { access_token } = this.props.authUser
        const { form, nomina } = this.state
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

        data.append('id', nomina.id)

        await axios.post(URL_DEV + 'rh/nomina-obra/adjuntos', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                const { nomina } = response.data
                const { data, key } = this.state
                data.adjuntos = nomina.adjuntos
                //AQUI
                this.getNominasAxios()

                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    nomina: nomina,
                    adjuntos: this.setAdjuntosTable(data.adjuntos),
                    data
                })

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })

            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteAdjuntoAxios(id) {
        const { access_token } = this.props.authUser
        const { nomina } = this.state
        await axios.delete(URL_DEV + 'rh/nomina-obra/' + nomina.id + '/adjuntos/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { nomina } = response.data
                const { data, key } = this.state
                data.adjuntos = nomina.adjuntos

                this.getNominasAxios()
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    nomina: nomina,
                    adjuntos: this.setAdjuntosTable(data.adjuntos),
                    data
                })

            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
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

    handleCloseModalDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ... this.state,
            form: this.clearForm(),
            modal,
            nomina: ''
        })
    }

    handleCloseAdjuntos = () => {
        const { modal } = this.state
        modal.adjuntos = false
        this.setState({
            ... this.state,
            form: this.clearForm(),
            modal,
            nomina: ''
        })
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
                case 'nominasObra':
                    form[element] = [{
                        usuarios: '',
                        proyecto: '',
                        empresa: ''
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

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Editar nómina obra')
            this.updateNominaObraAxios()
        else
            this.addNominaObraAxios()
    }

    onChangeNominasObra = (key, e, name) => {
        const { value } = e.target
        const { form, data} = this.state
        if(name === 'usuario'){
            data.usuarios.map( (empleado) => {
                if(value.toString() === empleado.id.toString())
                    form['nominasObra'][key].nominImss = empleado.nomina_imss
                    form['nominasObra'][key].salario_hr = empleado.salario_hr
                    form['nominasObra'][key].salario_hr_extra = empleado.salario_hr_extra
            }) 
        }
        form['nominasObra'][key][name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    addRowNominaObra = () => {
        const { form } = this.state
        form.nominasObra.push(
            {
                nominasObra: [{
                    usuario: '',
                    proyecto: '',
                    salario_hr: '',
                    salario_hr_extra: '',
                    hr_trabajadas: '',
                    hr_extra: '',
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
                nominasObra: [{
                    usuario: '',
                    proyecto: '',
                    salario_hr: '',
                    salario_hr_extra: '',
                    hr_trabajadas: '',
                    hr_extra: '',
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

    async getNominasAxios() {
        var table = $('#kt_datatable2_nomina_obra')
            .DataTable();
        table.ajax.reload();
    }

    render() {
        const { modal, options, title, form, formeditado, adjuntos, data } = this.state

        return (
            <Layout active={'rh'} {...this.props}>
                
                        <NominaObraFormulario
                            title={title}
                            formeditado={formeditado}
                            className=" px-3 "
                            options={options}
                            form={form}
                            addRowNominaObra={this.addRowNominaObra}
                            deleteRowNominaObra={this.deleteRowNominaObra}
                            onChangeNominasObra={this.onChangeNominasObra}
                            onChange={this.onChange}
                            onChangeAdjunto={this.onChangeAdjunto}
                            clearFiles={this.clearFiles}
                            onSubmit={this.onSubmit}
                        >
                        </NominaObraFormulario> 
            </Layout>
        )
    }

}
const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(NominaObraForm);