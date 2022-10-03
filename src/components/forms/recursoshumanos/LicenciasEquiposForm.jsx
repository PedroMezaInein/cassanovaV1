import React, { Component } from 'react'
import { Tab, Nav } from 'react-bootstrap'
import { RHLicenciasForm, RHEquiposForm } from '../../forms'
class LicenciasEquiposForm extends Component {
    
    state = {
        key: 'licencias'
    }

    changeTab = (tab) => {
        this.setState({
            ...this.state,
            key: tab
        })
    }

    render() {

        const { at, empleado } = this.props
        const { key } = this.state

        return (
            <Tab.Container activeKey = { key }  onSelect = { ( select ) => { this.changeTab(select) } } >
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
                        {
                            key === 'licencias' ? <RHLicenciasForm at = { at } empleado = { empleado } adminView={false}/> : null
                        }
                    </Tab.Pane>
                    <Tab.Pane eventKey="equipos">
                        {
                            key === 'equipos' ? <RHEquiposForm at = { at } empleado = { empleado } adminView={false}/> : null
                        }
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        )
    }
}

export default LicenciasEquiposForm