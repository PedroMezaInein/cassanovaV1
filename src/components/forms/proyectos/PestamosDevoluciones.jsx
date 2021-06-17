import React, { Component } from 'react';
import { Tab, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';

const NavItem = children => {
    const { prestamo: {id, cantidad, sumDevoluciones, proyecto}, onSelect } = children
    return (
        <OverlayTrigger overlay = { <Tooltip>{proyecto.nombre}</Tooltip> } >
            <Nav.Item className = 'mr-1' onClick = { (e) => { e.preventDefault(); onSelect(id) } }>
                <Nav.Link eventKey = { id } className="nav-link btn btn-hover-light-primary d-flex flex-column flex-center border-radius-21px min-w-60px mr-2 py-4 px-3 ">
                    <span className="opacity-50 font-size-sm font-weight-bold text-primary">16 JUN<span className="d-block">2021</span></span>
                    <span className="font-size-lg font-weight-bolder text-primary">{ cantidad } / { sumDevoluciones } </span>
                </Nav.Link>
            </Nav.Item>
        </OverlayTrigger>
    )
}
class PestamosDevoluciones extends Component {

    state = {
        active: ''
    }

    componentDidMount = () => {
        const { bodega: { prestamos } } = this.props
        let active = ''
        if(prestamos.length){ active = prestamos[0].id }
        this.setState({...this.state, active: active})
    }

    onSelect = item => {
        this.setState({...this.state, active: item})
    }

    render() {
        const { bodega } = this.props
        const { active } = this.state
        return (
            <div>
                <Tab.Container activeKey = { active }>
                    <Nav className="nav nav-pills d-flex flex-nowrap hover-scroll-x py-2 justify-content-center">
                        { 
                            bodega.prestamos.map((prestamo, index) => { 
                                return( <NavItem prestamo = { prestamo } key = { index } onSelect = { this.onSelect } /> ) 
                            }) 
                        }
                        {/* <Nav.Item className="mr-1">
                            <Nav.Link eventKey="first" className="nav-link btn btn-hover-light-primary d-flex flex-column flex-center border-radius-21px min-w-60px mr-2 py-4 px-3 ">
                                <span className="opacity-50 font-size-sm font-weight-bold text-primary">16 JUN<span className="d-block">2021</span></span>
                                <span className="font-size-lg font-weight-bolder text-primary">5</span>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="mr-1">
                            <Nav.Link eventKey="second" className="nav-link btn btn-hover-light-primary d-flex flex-column flex-center border-radius-21px min-w-60px mr-2 py-4 px-3 ">
                                <span className="opacity-50 font-size-sm font-weight-bold text-primary">15 JUN <span className="d-block">2021</span></span>
                                <span className="font-size-lg font-weight-bolder text-primary">5</span>
                            </Nav.Link>
                        </Nav.Item> */}
                    </Nav>
                    <Tab.Content>
                        {
                            bodega.prestamos.map((prestamo, index) => {
                                return(
                                    <div key = {index}>
                                        <Tab.Pane eventKey={prestamo.id} className="col-md-10 mx-auto">
                                            <div className="w-auto d-flex flex-column mx-auto mt-8">
                                                <div className="bg-light p-4 rounded-xl flex-grow-1 align-self-center">
                                                    <div id="symbol-total-contactos">
                                                        <span>
                                                            <span className="symbol symbol-circle symbol-white symbol-30 flex-shrink-0 mr-2">
                                                                <span className="symbol-label">
                                                                    <i className="flaticon2-check-mark text-success font-size-14px"></i>
                                                                </span>
                                                            </span>
                                                            <span className="font-size-sm font-weight-bolder">
                                                                <span className="font-size-lg">9</span>
                                                                <span className="ml-2 font-weight-light">Disponibles</span>
                                                            </span>
                                                        </span>
                                                        <span className="ml-4">
                                                            <span className="symbol symbol-circle symbol-white symbol-30 flex-shrink-0 mr-2">
                                                                <span className="symbol-label">
                                                                    <i className="flaticon2-cancel-music text-danger icon-nm"></i>
                                                                </span>
                                                            </span>
                                                            <span className="font-size-sm font-weight-bolder">
                                                                <span className="font-size-lg">0</span>
                                                                <span className="ml-2 font-weight-light">PRÉSTAMOS</span>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* col-md-10 row mx-auto d-flex justify-content-end */}
                                            <div className="align-end">
                                                <div className="d-flex flex-stack position-relative mt-8">
                                                    <div className="position-absolute h-100 w-4px bg-danger rounded top-0 left-0"></div>
                                                    <div className="font-weight-bold ml-5 text-dark-50 py-1 w-100">
                                                        <div className="d-flex font-size-h6 justify-content-between">
                                                            <div>PRÉSTAMO: 1</div>
                                                            <div className="font-size-sm text-muted align-self-center">
                                                                RESPONSABLE:
                                                                <span className="text-primary"> CARINA JIMÉNEZ GARCÍA</span>
                                                            </div>
                                                        </div>
                                                        <div className="font-size-h6 font-weight-bolder text-body my-2">CENTAURO - OBRA - CHURUBUSCO</div>
                                                        <div className="text-gray-700 text-uppercase font-weight-light text-justify">
                                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam finibus mattis dui a suscipit.
                                                            Ut dictum nulla non justo molestie viverra. Etiam eget risus id erat hendrerit viverra.
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-stack position-relative mt-8 w-94">
                                                    <div className="position-absolute h-100 w-4px bg-success rounded top-0 left-0"></div>
                                                    <div className="font-weight-bold ml-5 text-dark-50 py-1 w-100">
                                                        <div className="d-flex font-size-h6 justify-content-between">
                                                            <div>DEVOLUCIÓN: 5 </div>
                                                            <div className="font-size-sm text-muted align-self-center">
                                                                RESPONSABLE:
                                                                <span className="text-primary"> CARINA JIMÉNEZ GARCÍA</span>
                                                            </div>
                                                        </div>
                                                        <div className="font-size-h6 font-weight-bolder text-body my-2">BODEGA 1, CAJÓN 2</div>
                                                        <div className="text-gray-700 text-uppercase font-weight-light text-justify">
                                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam finibus mattis dui a suscipit.
                                                            Ut dictum nulla non justo molestie viverra. Etiam eget risus id erat hendrerit viverra.
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex w-94 p-3 mt-5">
                                                        Formulario
                                                    </div>
                                            </div>
                                        </Tab.Pane>
                                    </div>
                                )
                            })
                        }
                        
                    </Tab.Content>
                </Tab.Container>
            </div>
        );
    }
}

export default PestamosDevoluciones;