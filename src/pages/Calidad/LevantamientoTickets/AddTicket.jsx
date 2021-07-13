import { connect } from 'react-redux'
import { URL_DEV } from '../../../constants'
import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import axios from 'axios'
import { errorAlert, printResponseErrorAlert, waitAlert, doneAlert} from '../../../functions/alert'
import { setOptions } from '../../../functions/setters'
import { FormNuevoTicket } from '../../../components/forms'
import { Card } from 'react-bootstrap'
class AddTicket extends Component {
    state = {
        form: {
            proyecto: '',
            tipo_trabajo: '',
            descripcion: '',
            adjuntos: {
                fotos: {
                    value: '',
                    placeholder: 'Fotos del incidente',
                    files: []
                }
            }
        },
        options: {
            proyectos: [],
            tiposTrabajo: []
        }
    }
    componentDidMount() {
        this.getOptionsAxios()
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'crm/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyectos, tiposTrabajo } = response.data
                const { options } = this.state
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                options.tiposTrabajo = setOptions(tiposTrabajo, 'tipo', 'id')
                this.setState({
                    ...this.state,
                    options
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
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
    handleChange = (files, item) => {
        if(files.length)
            this.onChangeAdjunto({ target: { name: item, value: files, files: files } })
    }

    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        files.forEach((file, key) => { aux.push( { name: file.name, file: file, url: URL.createObjectURL(file), key: key } ) })
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({ ...this.state, form })
    }
    async onSubmit() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
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
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
            return false
        })
        await axios.post(URL_DEV + 'documentos', data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/calidad/tickets/detalles-ticket'
                });
                doneAlert('Ticket credo con éxito')
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    render() {
        const { form, options } = this.state
        return (
            <Layout active={'calidad'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header className="border-0">
                        <Card.Title>
                            <span className="card-label">Nuevo levantamiento de ticket</span>
                        </Card.Title>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <FormNuevoTicket
                            form={form}
                            options={options}
                            onChange={this.onChange}
                            handleChange={this.handleChange}
                            onSubmit={this.onSubmit}
                        />
                    </Card.Body>
                </Card>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {return {authUser: state.authUser}}
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(AddTicket)