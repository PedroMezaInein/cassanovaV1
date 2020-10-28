import { connect } from 'react-redux';
import React, { Component } from 'react'
import Layout from '../../../../components/layout/layout'
import { Col, Row, Card, Tab, Nav } from 'react-bootstrap'
import { Button, InputGray, InputPhoneGray } from '../../../../components/form-components';
import { TEL, URL_DEV, EMAIL } from '../../../../constants'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../functions/routers"
import { setOptions, setDateTableLG } from '../../../../functions/setters';
import axios from 'axios'
import { errorAlert, forbiddenAccessAlert, waitAlert } from '../../../../functions/alert';
import swal from 'sweetalert';
import { HistorialContactoForm, AgendarCitaForm } from '../../../../components/forms'
class LeadInfo extends Component {
    state = {
        messages: [],
        form: {
            name: '',
            empresa: '',
            empresa_dirigida: '',
            tipoProyecto: '',
            comentario: '',
            diseño: '',
            obra: '',
            email: '',
            tipoProyectoNombre: '',
            origen: '',
            telefono: '',
        },
        formHistorial: {
            comentario: '',
            fechaContacto: '',
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
        formAgenda: {
            fecha: new Date(),
            hora: '08',
            minuto: '00',
            cliente: '',
            tipo: 0,
            origen: 0,
            proyecto: '',
            empresa: 0,
            estatus: 0,
            correos: [],
            correo: '',
        },
        tipo: '',
        options: {
            empresas: [],
            tipos: [],
            origenes: [],
            tiposContactos: []
        },
        formeditado: 0,
        showForm: false,
        showAgenda: false,
    }

    mostrarFormulario() {
        const { showForm } = this.state
        this.setState({
            ...this.state,
            showForm: !showForm
        })
    }
    mostrarAgenda() {
        const { showAgenda } = this.state
        this.setState({
            ...this.state,
            showAgenda: !showAgenda
        })
    }
    componentDidMount() {
        const { location: { state } } = this.props
        if (state) {
            if (state.lead) {
                const { form, options } = this.state
                const { lead } = state
                form.name = lead.nombre === 'SIN ESPECIFICAR' ? '' : lead.nombre.toUpperCase()
                form.email = lead.email.toUpperCase()
                form.telefono = lead.telefono
                this.setState({
                    ...this.state,
                    lead: lead,
                    form,
                    formeditado: 1,
                    options
                })
            }
        }
        this.getOptionsAxios()
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'crm/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { medios } = response.data
                const { options } = this.state
                // options['empresas'] = setOptions(empresas, 'name', 'id')
                // options['origenes'] = setOptions(origenes, 'origen', 'id')
                options['tiposContactos'] = setOptions(medios, 'tipo', 'id')
                options.tiposContactos.push({
                    value: 'New', name: '+ Agregar nuevo'
                })
                this.setState({
                    ...this.state,
                    options
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401)
                    forbiddenAccessAlert();
                else
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    handleChange = (files, item) => {
        const { formHistorial } = this.state
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
        formHistorial['adjuntos'][item].value = files
        formHistorial['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            formHistorial
        })
    }
    onChangeHistorial = e => {
        const { formHistorial } = this.state
        const { name, value } = e.target
        formHistorial[name] = value
        this.setState({
            ...this.state,
            formHistorial
        })
    }
    onChangeAgenda = e => {
        const { name, value } = e.target
        const { formAgenda } = this.state
        formAgenda[name] = value
        this.setState({
            ...this.state,
            formAgenda
        })
    }
    removeCorreo = value => {
        const { formAgenda } = this.state
        let aux = []
        formAgenda.correos.map((correo, key) => {
            if (correo !== value) {
                aux.push(correo)
            }
            return false
        })
        formAgenda.correos = aux
        this.setState({
            ...this.state,
            formAgenda
        })
    }
    render() {
        const { lead, form, formHistorial, options, formAgenda } = this.state
        return (
            <Layout active={'leads'}  {...this.props}>
                <Tab.Container defaultActiveKey="2" className="p-5">
                    <Row>
                        <Col md={3} className="mb-3">
                            <Card className="card-custom card-stretch">
                                <Card.Body >
                                    <div className="d-flex justify-content-end mb-2">
                                        <Button
                                            icon=''
                                            className="btn btn-light-success mr-2 btn-sm"
                                            only_icon="fab fa-whatsapp pr-0"
                                            tooltip={{ text: 'CONTACTAR POR WHATSAPP' }}
                                        />
                                    </div>
                                    {
                                        lead ?
                                            <div className="table-responsive">
                                                <div className="list min-w-300px" >
                                                    <div className="d-flex align-items-center">
                                                        <div className="symbol symbol-75 symbol-xxl-100 mr-3 col-3">
                                                            <span className="symbol-label font-weight-bolder">{lead.nombre.split(" ", 1)}</span>
                                                        </div>
                                                        <div className="text-center col">
                                                            <div className="font-weight-bolder font-size-h6 text-dark-75 mb-2">{lead.nombre} </div>
                                                            <div className="text-muted font-size-sm">{lead.empresa.name}</div>
                                                            {
                                                                lead ?
                                                                    lead.prospecto.estatus_prospecto ?
                                                                        <span style={{ color: lead.prospecto.estatus_prospecto.color_texto, backgroundColor: lead.prospecto.estatus_prospecto.color_fondo }} className="font-weight-bolder label label-inline mt-2 font-size-xs">{lead.prospecto.estatus_prospecto.estatus}</span>
                                                                        : ''
                                                                    : ''
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="my-4">
                                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                                            <span className="font-weight-bolder mr-2">Origen:</span>
                                                            <div className="text-muted font-weight-bold text-hover-dark">{lead.origen.origen}</div>
                                                        </div>
                                                        {/* <div className="d-flex align-items-center justify-content-between mb-2">
                                                            <span className="font-weight-bolder mr-2">Teléfono:</span>
                                                            <a href={`tel:+${lead.telefono}`} className="text-muted font-weight-bold text-hover-dark">{lead.telefono}</a>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                                            <span className="font-weight-bolder mr-2">Email:</span>
                                                                <a href={`mailto:+${lead.email}`} className="text-muted font-weight-bold text-hover-dark">{lead.email}</a>
                                                        </div> */}
                                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                                            <span className="font-weight-bolder mr-2">Fecha de ingreso:</span>
                                                            <div className="text-muted font-weight-bold text-hover-dark">{setDateTableLG(lead.created_at)}</div>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                                            <span className="font-weight-bolder mr-2">Fecha último contacto:</span>
                                                            <div className="text-muted font-weight-bold text-hover-dark">{setDateTableLG(lead.prospecto.contactos[0].created_at)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            : ''
                                    }
                                    <Nav className="navi navi-bold navi-hover navi-active navi-link-rounded">
                                        <Nav.Item className="navi-item mb-2">
                                            <Nav.Link className="navi-link px-2" eventKey="1">
                                                <span className="navi-icon mr-2">
                                                    <span className="svg-icon">
                                                        <SVG src={toAbsoluteUrl('/images/svg/User.svg')} />
                                                    </span>
                                                </span>
                                                <div className="navi-text">
                                                    <span className="d-block font-weight-bold">Información personal</span>
                                                    {/* <span className="text-muted">Descripción del paso 1</span> */}
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="navi-item mb-2">
                                            <Nav.Link className="navi-link px-2" eventKey="2">
                                                <span className="navi-icon mr-2">
                                                    <span className="svg-icon">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Group-chat.svg')} />
                                                    </span>
                                                </span>
                                                <div className="navi-text">
                                                    <span className="d-block font-weight-bold">Historial de contacto</span>
                                                    {/* <span className="text-muted">Descripción del paso 2</span> */}
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="navi-item mb-2">
                                            <Nav.Link className="navi-link px-2" eventKey="3">
                                                <span className="navi-icon mr-2">
                                                    <span className="svg-icon">
                                                        <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                                    </span>
                                                </span>
                                                <div className="navi-text">
                                                    <span className="d-block font-weight-bold">Contrato</span>
                                                    {/* <span className="text-muted">Descripción del paso 2</span> */}
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Body>
                            </Card >
                        </Col >
                        <Col md={9} className="mb-3">
                            <Card className="card-custom card-stretch">
                                <Tab.Content>
                                    <Tab.Pane eventKey="1">
                                        <Card.Header className="align-items-center border-0 mt-4 pt-3 pb-0">
                                            <Card.Title>
                                                <h3 className="card-title align-items-start flex-column">
                                                    <span className="font-weight-bolder text-dark">Información general</span>
                                                    {/* <span class="text-muted mt-3 font-weight-bold font-size-sm">890,344 Sales</span> */}
                                                </h3>
                                            </Card.Title>
                                        </Card.Header>
                                        <Card.Body className="pt-0">
                                            <div className="form-group row form-group-marginless">
                                                <div className="col-md-4">
                                                    <InputGray
                                                        placeholder='NOMBRE DEL LEAD'
                                                        withicon={1}
                                                        iconclass="far fa-user"
                                                        name='name'
                                                        value={form.name}
                                                        onChange={this.onChange}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <InputGray
                                                        placeholder="CORREO ELECTRÓNICO DE CONTACTO"
                                                        withicon={1}
                                                        iconclass="fas fa-envelope"
                                                        type="email"
                                                        name="email"
                                                        value={form.email}
                                                        onChange={this.onChange}
                                                        patterns={EMAIL}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <InputPhoneGray
                                                        placeholder="TELÉFONO DE CONTACTO"
                                                        withicon={1}
                                                        iconclass="fas fa-mobile-alt"
                                                        name="telefono"
                                                        value={form.telefono}
                                                        onChange={this.onChange}
                                                        patterns={TEL}
                                                        thousandseparator={false}
                                                        prefix=''
                                                    />
                                                </div>
                                            </div>
                                            {/* <div className="separator separator-dashed mt-1 mb-2"></div>
                                            <div className="form-group row form-group-marginless">
                                                <div className="col-md-4">
                                                    <InputGray
                                                        formeditado={formeditado}
                                                        name='nombre'
                                                        value={''}
                                                        onChange={this.onChange}
                                                        type='text'
                                                        placeholder='NOMBRE DEL LEAD'
                                                        iconclass={'far fa-user'}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <InputGray
                                                        formeditado={formeditado}
                                                        name='correo'
                                                        value={''}
                                                        onChange={this.onChange}
                                                        type='text'
                                                        placeholder='CORREO ELECTRÓNICO'
                                                        iconclass={'far fa-envelope'}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <InputPhoneGray
                                                        thousandseparator={false}
                                                        prefix={''}
                                                        name='telefono'
                                                        value={''}
                                                        placeholder='TELÉFONO'
                                                        onChange={this.onChange}
                                                        iconclass={'fas fa-mobile-alt'}
                                                        messageinc='Incorrecto. Ingresa el número de teléfono.'
                                                        patterns={TEL}
                                                        formeditado={formeditado}
                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <InputGray
                                                        formeditado={formeditado}
                                                        as="textarea"
                                                        placeholder="DESCRIPCIÓN"
                                                        rows="2"
                                                        name='correo'
                                                        value={'dedee'}
                                                        onChange={this.onChange}
                                                        type='text'
                                                        style={{ paddingLeft: "10px" }}
                                                    />
                                                </div>
                                            </div> */}
                                        </Card.Body>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="2">
                                        <Card.Header className="border-0 mt-4 pt-3">
                                            <h3 className="card-title d-flex justify-content-between">
                                                <span className="font-weight-bolder text-dark align-self-center">Historial de contacto</span>
                                                <div>
                                                    <Button
                                                        icon=''
                                                        className={"btn btn-icon btn-xs p-3 btn-light-success success2 mr-2"}
                                                        onClick={() => { this.mostrarFormulario() }}
                                                        only_icon={"flaticon2-plus icon-13px"}
                                                        tooltip={{ text: 'AGREGAR NUEVO CONTACTO' }}
                                                    />
                                                    <Button
                                                        icon=''
                                                        className={"btn btn-icon btn-xs p-3 btn-light-primary"}
                                                        onClick={() => { this.mostrarAgenda() }}
                                                        only_icon={"flaticon2-calendar-2 icon-md"}
                                                        tooltip={{ text: 'AGENDAR CITA' }}
                                                    />
                                                </div>
                                            </h3>
                                        </Card.Header>
                                        <Card.Body className="d-flex justify-content-center pt-0 row">
                                            <div className={this.state.showForm ? 'col-md-12 mb-5' : 'd-none'}>
                                                <HistorialContactoForm
                                                    options={options}
                                                    formHistorial={formHistorial}
                                                    onChangeHistorial={this.onChangeHistorial}
                                                    handleChange={this.handleChange}
                                                />
                                            </div>
                                            <div className={this.state.showAgenda ? 'col-md-12 mb-5' : 'd-none'}>
                                                <AgendarCitaForm
                                                    formAgenda={formAgenda}
                                                    onChange={this.onChangeAgenda}
                                                    removeCorreo={this.removeCorreo}
                                                />
                                            </div>
                                            <div className="col-md-8">
                                                {
                                                    lead ?
                                                        lead.prospecto.contactos.map((contacto, key) => {
                                                            return (
                                                                <div className="timeline timeline-6" key={key}>
                                                                    <div className="timeline-items">
                                                                        <div className="timeline-item">
                                                                            <div className={contacto.success ? "timeline-media bg-light-success" : "timeline-media bg-light-danger"}>
                                                                                <span className={contacto.success ? "svg-icon svg-icon-success svg-icon-md" : "svg-icon svg-icon-danger  svg-icon-md"}>
                                                                                    {
                                                                                        contacto.tipo_contacto.tipo === 'Llamada' ?
                                                                                            <SVG src={toAbsoluteUrl('/images/svg/Outgoing-call.svg')} />
                                                                                            : contacto.tipo_contacto.tipo === 'Correo' ?
                                                                                                <SVG src={toAbsoluteUrl('/images/svg/Outgoing-mail.svg')} />
                                                                                                : contacto.tipo_contacto.tipo === 'VIDEO LLAMADA' ?
                                                                                                    <SVG src={toAbsoluteUrl('/images/svg/Video-camera.svg')} />
                                                                                                    : contacto.tipo_contacto.tipo === 'Whatsapp' ?
                                                                                                        <i className={contacto.success ? "socicon-whatsapp text-success icon-16px" : "socicon-whatsapp text-danger icon-16px"}></i>
                                                                                                        : contacto.tipo_contacto.tipo === 'TAWK TO ADS' ?
                                                                                                            <i className={contacto.success ? "fas fa-dove text-success icon-16px" : "fas fa-dove text-danger icon-16px"}></i>
                                                                                                            : contacto.tipo_contacto.tipo === 'REUNIÓN PRESENCIAL' ?
                                                                                                                <i className={contacto.success ? "fas fa-users text-success icon-16px" : "fas fa-users text-danger icon-16px"}></i>
                                                                                                                : contacto.tipo_contacto.tipo === 'Visita' ?
                                                                                                                    <i className={contacto.success ? "fas fa-house-user text-success icon-16px" : "fas fa-house-user text-danger icon-16px"}></i>
                                                                                                                    : <i className={contacto.success ? "fas fa-mail-bulk text-success icon-16px" : "fas fa-mail-bulk text-danger icon-16px"}></i>
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            <div className={contacto.success ? "timeline-desc timeline-desc-light-success" : "timeline-desc timeline-desc-light-danger"}>
                                                                                <span className={contacto.success ? "font-weight-bolder text-success" : "font-weight-bolder text-danger"}>{setDateTableLG(contacto.created_at)}</span>
                                                                                <div className="font-weight-light pb-2 text-justify position-relative mt-2" style={{ borderRadius: '0.42rem', padding: '1rem 1.5rem', backgroundColor: '#F3F6F9' }}>
                                                                                    <div className="text-dark-75 font-weight-bold mb-2">{contacto.tipo_contacto.tipo}</div>
                                                                                    {contacto.comentario}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                        : ''
                                                }
                                            </div>
                                        </Card.Body>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="3">
                                        <Card.Header className="align-items-center border-0 mt-4 pt-3">
                                            <Card.Title>
                                                <h3 className="card-title align-items-start flex-column">
                                                    <span className="font-weight-bolder text-dark">Historial de contacto</span>
                                                    {/* <span class="text-muted mt-3 font-weight-bold font-size-sm">890,344 Sales</span> */}
                                                </h3>
                                            </Card.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            ...
                                        </Card.Body>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card>
                        </Col>
                    </Row >
                </Tab.Container>
            </Layout >
        )
    }
}
const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = (dispatch) => {
}

export default connect(mapStateToProps, mapDispatchToProps)(LeadInfo)