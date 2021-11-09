import React, { Component } from 'react'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { Form, Row, Col, Tab, Nav } from 'react-bootstrap'
import { setSingleHeader } from '../../../functions/routers'
import { validateAlert, waitAlert, doneAlert, printResponseErrorAlert, errorAlert } from '../../../functions/alert'
import { RHLicenciasForm, RHEquiposForm } from '../../forms'
class LicenciasEquiposForm extends Component {
    state = {
    }
    
    render() {
        const { at } = this.props
        const { form } = this.state
        console.log(form, 'form')
        return (
            <>
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
                            <RHLicenciasForm />
                        </Tab.Pane>
                        <Tab.Pane eventKey="equipos">
                            <RHEquiposForm />
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </>
        )
    }
}

export default LicenciasEquiposForm