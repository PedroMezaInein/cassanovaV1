import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import { URL_DEV } from '../../../constants'
import { setOptions } from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert } from '../../../functions/alert'
import { NominaObraForm as NominaObraFormulario } from '../../../components/forms'
import $ from "jquery";
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
                                    salario_hr_extra: nom.salario_hr_extras,
                                    hr_trabajadas: nom.hr_trabajadas,
                                    hr_extra: nom.hr_extras,
                                    nominImss: nom.nomina_imss,
                                    restanteNomina: nom.restante_nomina,
                                    extras: nom.extras
                                }
                            )
                            return false
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
                            ...this.state,
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
        await axios.get(URL_DEV + 'rh/nomina-obra/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { proyectos, usuarios, empresas } = response.data
                const { options, data } = this.state
                data.usuarios = usuarios
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['usuarios'] = setOptions(usuarios, 'nombre', 'id')
                options['empresas'] = setOptions(empresas, 'name', 'id')
                this.setState({
                    ...this.state,
                    options,
                    data
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
            return false
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
            return false
        })
        await axios.post(URL_DEV + 'rh/nomina-obra', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                doneAlert(response.data.message !== undefined ? response.data.message : 'La nomina fue modificado con éxito.')
                history.push({
                    pathname: '/rh/nomina-obras'
                });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async updateNominaObraAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, nomina } = this.state
        await axios.put(URL_DEV + 'rh/nomina-obra/' + nomina.id, form, { headers: { Accept: '/', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                doneAlert(response.data.message !== undefined ? response.data.message : 'La nomina fue modificado con éxito.')
                history.push({
                    pathname: '/rh/nomina-obras'
                });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
            return false
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
        const { form, data } = this.state
        form['nominasObra'][key][name] = value
        if (name === 'usuario') {
            data.usuarios.map((empleado) => {
                if (value.toString() === empleado.id.toString()) {
                    form['nominasObra'][key].nominImss = empleado.nomina_imss
                    form['nominasObra'][key].salario_hr = empleado.salario_hr
                    form['nominasObra'][key].salario_hr_extra = empleado.salario_hr_extra
                }
                return false
            })
        } else {
            if (name === 'salario_hr' || name === 'hr_trabajadas' || name === 'nominImss') {
                if (form['nominasObra'][key].salario_hr !== '' && form['nominasObra'][key].hr_trabajadas !== '' && form['nominasObra'][key].nominImss !== '') {
                    form['nominasObra'][key].restanteNomina = (parseFloat(form['nominasObra'][key].hr_trabajadas) * parseFloat(form['nominasObra'][key].salario_hr)) - form['nominasObra'][key].nominImss
                }
            }
            if (name === 'salario_hr_extra' || name === 'hr_extra') {
                if (form['nominasObra'][key].salario_hr_extra !== '' && form['nominasObra'][key].hr_extra !== '') {
                    form['nominasObra'][key].extras = parseFloat(form['nominasObra'][key].hr_extra) * parseFloat(form['nominasObra'][key].salario_hr_extra)
                }
            }
        }
        this.setState({
            ...this.state,
            form
        })
    }
    addRowNominaObra = () => {
        const { form } = this.state
        form.nominasObra.push(
            {
                usuario: '',
                proyecto: '',
                salario_hr: '',
                salario_hr_extra: '',
                hr_trabajadas: '',
                hr_extra: '',
                nominImss: '',
                restanteNomina: '',
                extras: ''
            }
        )
        this.setState({
            ...this.state,
            form
        })
    }
    deleteRowNominaObra = () => {
        const { form } = this.state
        form.nominasObra.pop()
        this.setState({
            ...this.state,
            form
        })
    }
    async getNominasAxios() {
        $('#kt_datatable2_nomina_obra').DataTable().ajax.reload();
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
    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({
            ...this.state,
            form
        })
    }
    render() {
        const { options, title, form, formeditado } = this.state
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
                    clearFiles={this.clearFiles}
                    onSubmit={this.onSubmit}
                    handleChange={this.handleChange}
                    onChangeRange={this.onChangeRange}
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

export default connect(mapStateToProps, mapDispatchToProps)(NominaObraForm);