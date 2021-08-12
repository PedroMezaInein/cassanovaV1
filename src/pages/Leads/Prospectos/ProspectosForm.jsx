import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV } from '../../../constants'
import Layout from '../../../components/layout/layout'
import { errorAlert, printResponseErrorAlert, doneAlert, waitAlert, questionAlert } from '../../../functions/alert'
import { setOptions } from '../../../functions/setters'
import { Card, Accordion, Dropdown } from 'react-bootstrap'
import { ProspectoForm as ProspectoFormulario } from '../../../components/forms'
import { LeadCard } from '../../../components/cards'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../../components/form-components'

class ProspectosForm extends Component {

    state = {
        title: 'Nuevo prospecto',
        lead: '',
        prospecto: '',
        form: {
            descripcion: '',
            vendedor: '',
            preferencia: '',
            motivo: '',
            cliente: '',
            tipoProyecto: '',
            estatusContratacion: '',
            estatusProspecto: '',
            newEstatusProspecto: '',
            newTipoProyecto: '',
            newEstatusContratacion: ''
        },
        formContacto: {
            comentario: '',
            fechaContacto: new Date(),
            success: 'Contactado',
            tipoContacto: '',
            newTipoContacto: '',
            adjuntos: {
                adjuntos: {
                    files: [],
                    value: '',
                    placeholder: 'Adjuntos'
                }
            }
        },
        options: {
            tiposContactos: [],
            vendedores: [],
            estatusProspectos: [],
            tipoProyectos: []
        }

    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const remisiones = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'convert':
                if (state) {
                    if (state.lead) {
                        const { lead } = state
                        this.getLeadAxios(lead.id)
                    }
                    else
                        history.push('/leads/leads')
                } else
                    history.push('/leads/leads')
                break;
            case 'edit':
                if (state) {
                    if (state.prospecto) {
                        const { form } = this.state
                        const { prospecto } = state
                        form.descripcion = prospecto.descripcion
                        form.preferencia = prospecto.preferencia
                        form.motivo = prospecto.motivo
                        if (prospecto.vendedor) {
                            form.vendedor = prospecto.vendedor.id.toString()
                        }
                        if (prospecto.estatus_prospecto) {
                            form.estatusProspecto = prospecto.estatus_prospecto.id.toString()
                        }
                        if (prospecto.tipo_proyecto) {
                            form.tipoProyecto = prospecto.tipo_proyecto.id.toString()
                        }
                        this.setState({
                            ...this.state,
                            prospecto: prospecto,
                            title: 'Editar prospecto',
                            form,
                            formeditado: 1
                        })
                    }
                    else
                        history.push('/leads/prospectos')
                } else
                    history.push('/leads/prospectos')
                break;
            default:
                break;
        }
        if (!remisiones)
            history.push('/')
        this.getOptionsAxios()
    }

    onChange = event => {
        const { name, value } = event.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.setState({
                form
            })
        })
    }

    onChangeContacto = event => {
        const { formContacto } = this.state
        const { name, value } = event.target
        formContacto[name] = value
        this.setState({
            ...this.state,
            formContacto
        })
    }

    onSubmit = e => {
        e.preventDefault();
        const { form, formContacto, lead, title } = this.state
        form['lead'] = lead;
        form['formContacto'] = formContacto;
        if (title === 'Editar prospecto')
            this.editProspectoAxios(form);
        else
            this.addProspectoAxios(form);
    }

    setOptionsEstatus = (arreglo, name, value) => {
        let aux = []
        arreglo.map((element) => {
            aux.push(
                { 
                    name: element[name], 
                    value: element[value].toString(),
                    color: element.color_texto,
                    fondo: element.color_fondo
                }
            )
            return ''
        });
        return aux
    }

    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'prospecto/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { options } = this.state
                const { tiposContactos, vendedores, estatusProspectos, tipoProyectos } = response.data
                options.tiposContactos = setOptions(tiposContactos, 'tipo', 'id')
                options.tiposContactos.push({
                    value: 'New', name: '+ Agregar nuevo'
                })
                options.tipoProyectos = setOptions(tipoProyectos, 'tipo', 'id')
                options.tipoProyectos.push({
                    value: 'New', name: '+ Agregar nuevo'
                })
                options.vendedores = setOptions(vendedores, 'name', 'id')
                options.estatusProspectos = this.setOptionsEstatus(estatusProspectos, 'estatus', 'id')
                /* options.estatusProspectos.push({
                    value: 'New', name: '+ Agregar nuevo'
                }) */
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
            console.error(error, 'error')
        })
    }

    async getLeadAxios(id) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'lead/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { lead } = response.data
                this.setState({
                    ...this.state,
                    lead
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

    async editProspectoAxios(data) {
        const { access_token } = this.props.authUser
        const { prospecto } = this.state
        await axios.put(URL_DEV + 'prospecto/' + prospecto.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste el prospecto con éxito.')

                const { history } = this.props

                history.push({
                    pathname: '/leads/prospectos'
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

    async addProspectoAxios(data) {
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'prospecto', data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste el prospecto con éxito.')

                const { history } = this.props

                history.push({
                    pathname: '/leads/prospectos'
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

    handleChange = (files, item) => {
        const { formContacto } = this.state
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
        formContacto['adjuntos'][item].value = files
        formContacto['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            formContacto
        })
    }

    changeEstatus = estatus => {
        if (estatus === 'Detenido') {
            questionAlert('¿ESTÁS SEGURO?', 'DETENDRÁS EL PROSPECTO ¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios(estatus))
        }
        if (estatus === 'Cancelado') {
            questionAlert('¿ESTÁS SEGURO?', 'DARÁS POR CANCELADO EL PROSPECTO ¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios(estatus))
        }
        if (estatus === 'Rechazado') {
            questionAlert('¿ESTÁS SEGURO?', 'DARÁS POR RECHAZADO EL PROSPECTO ¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios(estatus))
        }
        if (estatus === 'Contratado') {
            questionAlert('¿ESTÁS SEGURO?', 'DARÁS POR CONTRATADO EL PROSPECTO ¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios(estatus))
        }
        if (estatus === 'En proceso') {
            questionAlert('¿ESTÁS SEGURO?', 'REACTIVARÁS EL PROSPECTO ¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios(estatus))
        }
    }

    async changeEstatusAxios(estatus) {
        waitAlert()
        const { prospecto } = this.state
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}prospecto/${prospecto.id}/estatus`, { estatus: estatus }, { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                doneAlert('Estado actualizado con éxito')
                const { history } = this.props
                history.push({
                    pathname: '/leads/prospectos'
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

    estatusText = () => {
        let estatus = ''
        const { options, form } = this.state
        options.estatusProspectos.map(element => { 
            if (form.estatusProspecto.toString() === element.value.toString()) {
                estatus = element.name.toUpperCase()
            }
            return false
        })
        return estatus
    }

    render() {
        const { options, form, formContacto, title, formeditado, lead } = this.state
        return (
            <Layout active={'leads'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                        {
                            title === 'Editar prospecto' ?
                                <div className="card-toolbar">
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            style={
                                                { 
                                                    backgroundColor: '#F3F6F9', color: '#80808F', border: 'transparent', padding: '2.8px 5.6px', 
                                                    width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center',
                                                    fontSize: '12.5px', fontWeight: 500 
                                                }
                                            }
                                        >
                                            {this.estatusText()} 
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="p-0">
                                            <Dropdown.Header>
                                                <span className="font-size-sm">Elige una opción</span>
                                            </Dropdown.Header>
                                            {
                                                options.estatusProspectos.map((estatus, key) => {
                                                    if(estatus.name === 'Cancelado' || estatus.name === 'En proceso' || estatus.name === 'Contratado' ||
                                                        estatus.name === 'Detenido' || estatus.name === 'Rechazado')
                                                    return (
                                                        <>
                                                            <Dropdown.Item className="p-0" key={key} onClick={() => { this.changeEstatus(estatus.name) }} >
                                                                <span className="navi-link w-100">
                                                                    <span className="navi-text">
                                                                        <span className="label label-xl label-inline rounded-0 w-100 font-weight-bolder" 
                                                                            style = {{ color: estatus.color, backgroundColor: estatus.fondo }}>
                                                                            {
                                                                                estatus.name
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                </span>
                                                            </Dropdown.Item>
                                                            <Dropdown.Divider className="m-0" style={{ borderTop: '1px solid #fff' }} />
                                                        </>
                                                    )
                                                    return ''
                                                })
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                : ''
                        }
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <ProspectoFormulario
                            formeditado={formeditado}
                            className="px-3"
                            options={options}
                            form={form}
                            formContacto={formContacto}
                            onChange={this.onChange}
                            onChangeContacto={this.onChangeContacto}
                            onSubmit={this.onSubmit}
                            title={title}
                            handleChange={this.handleChange} 
                        >
                            {
                                lead ?
                                    <Accordion>
                                        <div className="d-flex justify-content-end">
                                            <Accordion.Toggle as={Button} icon={faEye} pulse="pulse-ring" eventKey={0} className="btn btn-icon btn-light-info pulse pulse-info" />
                                        </div>
                                        <Accordion.Collapse eventKey={0} className="px-md-5 px-2" >
                                            <LeadCard lead={lead} border={"border-nav mt-4 mb-5"} />
                                        </Accordion.Collapse>
                                    </Accordion>
                                    : ''
                            }
                        </ProspectoFormulario>
                    </Card.Body>
                </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProspectosForm);