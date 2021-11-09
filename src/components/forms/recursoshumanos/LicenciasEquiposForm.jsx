import React, { Component } from 'react'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { Form, Row, Col, Tab, Nav } from 'react-bootstrap'
import { setSingleHeader } from '../../../functions/routers'
import { Button, InputGray } from '../../form-components'
import { validateAlert, waitAlert, doneAlert, printResponseErrorAlert, errorAlert } from '../../../functions/alert'
import { RHLicenciasForm } from '../../forms'
class LicenciasEquiposForm extends Component {
    state = {
        form: {
            tipo: '',
            equipos: [
                {
                    equipo: '',
                    modelo: '',
                    marca: '',
                    serie: '',
                    descripcion: ''
                }
            ],
        }
    }
    updateSelect = (value, name) => {
        this.onChange({ target: { value: value, name: name } })
    }
    onChangeEquipos = (key, e, name) => {
        const { value } = e.target
        const { form } = this.state
        form.equipos[key][name] = value
        this.setState({ ...this.state, form })
    }
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    onSubmit = async () => {
        waitAlert()
        const { at, refresh } = this.props
        const { form } = this.state
        await axios.post(`${URL_DEV}`, form, { headers: setSingleHeader(at) }).then(
            (response) => {
                doneAlert(`Solicitud generada con éxito`, () => { refresh() })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    addRowEquipo = () => {
        const { form } = this.state
        form.equipos.push({
            equipo: '',
            modelo: '',
            marca: '',
            serie: '',
            descripcion: ''
        })
        this.setState({ ...this.state, form })
    }

    deleteRowEquipo = (key) => {
        let aux = []
        const { form } = this.state
        form.equipos.forEach((element, index) => {
            if (index !== key)
                aux.push(element)
        })
        if (aux.length) {
            form.equipos = aux
        } else {
            form.equipos = [{
                equipo: '',
                modelo: '',
                marca: '',
                serie: '',
                descripcion: ''
            }]
        }
        this.setState({
            ...this.state,
            form
        })
    }
    render() {
        const { form } = this.state
        const { at } = this.props
        return (
            <Tab.Container defaultActiveKey="licencias">
                <Nav className="nav-pills nav-light-info justify-content-center py-5 nav-bolder border-0 rounded">
                    <Nav.Item className="nav-item">
                        <Nav.Link className="nav-link px-3" eventKey="licencias">
                            <span className="nav-icon"><i className="las la-shield-alt icon-xl"></i></span>
                            <span className="nav-text font-size-lg ml-2">Licencias</span>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="nav-item">
                        <Nav.Link className="nav-link px-3" eventKey="equipos">
                            <span className="nav-icon"><i className="las la-laptop icon-xl"></i></span>
                            <span className="nav-text font-size-lg ml-2">Equipos</span>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey="licencias">
                        <RHLicenciasForm at = { at } />
                    </Tab.Pane>
                    <Tab.Pane eventKey="equipos">
                        <Form id="form-licencias-equipos" onSubmit={(e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-licencias-equipos') }}>
                            <div className="mb-8">
                                <Button icon='' className="btn btn-sm btn-bg-light btn-icon-success btn-hover-light-success text-success font-weight-bolder font-size-13px" onClick={this.addRowEquipo}
                                    text='AGREGAR EQUIPO' only_icon="flaticon2-plus icon-13px mr-2 px-0 text-success" />
                                <div className="mt-5">
                                    {
                                        form.equipos.map((equipo, key) => {
                                            return (
                                                <Row className="mx-0 form-group-marginless" key={key}>
                                                    <Col md="auto" className="align-self-center pl-2 pr-0">
                                                        <Button icon='' onClick={() => { this.deleteRowEquipo(key) }}
                                                            className="btn btn-icon btn-xs p-4 btn-bg-white btn-icon-danger btn-hover-danger" only_icon="las la-trash text-danger icon-xl" />
                                                    </Col>
                                                    <Col>
                                                        <InputGray
                                                            requirevalidation={1}
                                                            iconvalid={1}
                                                            placeholder='EQUIPO'
                                                            value={form['equipos'][key]['equipo']}
                                                            withtaglabel={0}
                                                            name='equipo'
                                                            withtextlabel={0}
                                                            withplaceholder={1}
                                                            withicon={0}
                                                            iconclass='las la-clipboard-list'
                                                            onChange={e => this.onChangeEquipos(key, e, 'equipo')}
                                                            customclass="px-2"
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <InputGray
                                                            requirevalidation={1}
                                                            iconvalid={1}
                                                            placeholder='MODELO'
                                                            value={form['equipos'][key]['modelo']}
                                                            withtaglabel={0}
                                                            name='modelo'
                                                            withtextlabel={0}
                                                            withplaceholder={1}
                                                            withicon={0}
                                                            iconclass='las la-clipboard-list'
                                                            onChange={e => this.onChangeEquipos(key, e, 'modelo')}
                                                            customclass="px-2"
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <InputGray
                                                            requirevalidation={1}
                                                            iconvalid={1}
                                                            placeholder='MARCA'
                                                            value={form['equipos'][key]['marca']}
                                                            withtaglabel={0}
                                                            name='marca'
                                                            withtextlabel={0}
                                                            withplaceholder={1}
                                                            withicon={0}
                                                            iconclass='las la-clipboard-list'
                                                            onChange={e => this.onChangeEquipos(key, e, 'marca')}
                                                            customclass="px-2"
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <InputGray
                                                            requirevalidation={1}
                                                            iconvalid={1}
                                                            placeholder='SERIE'
                                                            value={form['equipos'][key]['serie']}
                                                            withtaglabel={0}
                                                            name='serie'
                                                            withtextlabel={0}
                                                            withplaceholder={1}
                                                            withicon={0}
                                                            iconclass='las la-clipboard-list'
                                                            onChange={e => this.onChangeEquipos(key, e, 'serie')}
                                                            customclass="px-2"
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <InputGray
                                                            requirevalidation={0}
                                                            placeholder='DESCRIPCIÓN'
                                                            value={form['equipos'][key]['descripcion']}
                                                            withtaglabel={0}
                                                            name='descripcion'
                                                            withtextlabel={0}
                                                            withplaceholder={1}
                                                            withicon={0}
                                                            iconclass='las la-clipboard-list'
                                                            onChange={e => this.onChangeEquipos(key, e, 'descripcion')}
                                                            customclass="px-2"
                                                        />
                                                    </Col>
                                                    {
                                                        form.equipos.length === 1 || key === form.equipos.length - 1 ? <></>
                                                            : <Col md="12"> <div className="separator separator-solid my-3"></div> </Col>
                                                    }
                                                </Row>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="card-footer pt-3 pb-0 px-0 text-right">
                                <Button icon='' className="btn btn-primary" text="ENVIAR"
                                    onClick={(e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-licencias-equipos') }} />
                            </div>
                        </Form>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        )
    }
}

export default LicenciasEquiposForm