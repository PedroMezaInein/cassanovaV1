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
import { errorAlert, waitAlert, forbiddenAccessAlert, deleteAlert, doneAlert } from '../../../functions/alert'
import TableForModals from '../../../components/tables/TableForModals'
import { NominaAdminForm as NominaAdminFormulario } from '../../../components/forms'
import { Card } from 'react-bootstrap'

const $ = require('jquery');

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
            empresas: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            nominasAdmin: [{
                usuario: '',
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
            usuarios: [],
            empresas: []
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action: action } } } = this.props
        const { history, location: { state: state } } = this.props

        const nominaOmbra = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nueva nómina administrativa',
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
                        nomina.nominas_administrativas.map((nom, key) => {
                            aux.push(
                                {
                                    usuario: nom.empleado ? nom.empleado.id.toString() : '',
                                    nominImss: nom.nomina_imss,
                                    restanteNomina: nom.restante_nomina,
                                    extras: nom.extras
                                }
                            )
                        })

                        if (aux.length) {
                            form.nominasAdmin = aux
                        } else {
                            form.nominasAdmin = [{
                                usuario: '',
                                nominImss: '',
                                restanteNomina: '',
                                extras: ''
                            }]
                        }
                        
                        this.setState({
                            ...this.state,
                            title: 'Editar nómina administrativa',
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



    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ...this.state,
            options
        })
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rh/nomina-administrativa/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { usuarios, empresas } = response.data
                const { options, data } = this.state
                data.usuarios = usuarios
                options['usuarios'] = setOptions(usuarios, 'nombre', 'id')
                options['empresas'] = setOptions(empresas, 'name', 'id')

                this.setState({
                    ...this.state,
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

    async addNominaAdminAxios() {
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

                const { history } = this.props

                doneAlert(response.data.message !== undefined ? response.data.message : 'La nomina fue modificado con éxito.')

                history.push({
                    pathname: '/rh/nomina-admin'
                });

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

    async updateNominaAdminAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, nomina } = this.state

        await axios.put(URL_DEV + 'rh/nomina-administrativa/' + nomina.id, form, { headers: { Accept: '/', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props

                doneAlert(response.data.message !== undefined ? response.data.message : 'La nomina fue modificado con éxito.')

                history.push({
                    pathname: '/rh/nomina-admin'
                });
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

    // onChangeAdjunto = e => {
    //     const { form } = this.state
    //     const { files, value, name } = e.target
    //     let aux = []
    //     for (let counter = 0; counter < files.length; counter++) {
    //         aux.push(
    //             {
    //                 name: files[counter].name,
    //                 file: files[counter],
    //                 url: URL.createObjectURL(files[counter]),
    //                 key: counter
    //             }
    //         )
    //     }
    //     form.adjuntos[name].value = value
    //     form.adjuntos[name].files = aux
    //     this.setState({
    //         ...this.state,
    //         form
    //     })
    // }

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
        const { form, data} = this.state
        if(name === 'usuario'){
            data.usuarios.map( (empleado) => {
                if(value.toString() === empleado.id.toString()){
                    form['nominasAdmin'][key].nominImss = empleado.nomina_imss
                    form['nominasAdmin'][key].restanteNomina = empleado.nomina_extras
                    form['nominasAdmin'][key].extras = 0.0
                }
            }) 
        }
        form['nominasAdmin'][key][name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    addRowNominaAdmin = () => {
        const { form } = this.state
        form.nominasAdmin.push(
            {
                nominasAdmin: [{
                    usuario: '',
                    nominImss: '',
                    restanteNomina: '',
                    extras: ''
                }]
            }
        )
        this.setState({
            ...this.state,
            form
        })
    }

    deleteRowNominaAdmin = () => {
        const { form } = this.state
        form.nominasAdmin.pop()
        this.setState({
            ...this.state,
            form
        })
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
        this.setState({
            ...this.state,
            form
        })
    }

    render() {
        const { options, title, form, formeditado } = this.state

        return (
            <Layout active={'rh'} {...this.props}>
                <NominaAdminFormulario
                    title={title}
                    formeditado={formeditado}
                    className=" px-3 "
                    options={options}
                    form={form}
                    addRowNominaAdmin={this.addRowNominaAdmin}
                    deleteRowNominaAdmin={this.deleteRowNominaAdmin}
                    onChangeNominasAdmin={this.onChangeNominasAdmin}
                    onChange={this.onChange}
                    // onChangeAdjunto={this.onChangeAdjunto}
                    clearFiles={this.clearFiles}
                    onSubmit={this.onSubmit}
                    handleChange={this.handleChange}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(NominaAdminForm);