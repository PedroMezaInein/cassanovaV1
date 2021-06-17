import React, { Component } from 'react';
import { Tab, Nav } from 'react-bootstrap';

const NavItem = children => {
    const { id, cantidad } = children.prestamo
    
    return (
        <Nav.Item className = 'mr-1'>
            <Nav.Link eventKey = { id } className="nav-link btn btn-hover-light-primary d-flex flex-column flex-center border-radius-21px min-w-60px mr-2 py-4 px-3 ">
                <span className="opacity-50 font-size-sm font-weight-bold text-primary">16 JUN<span className="d-block">2021</span></span>
                <span className="font-size-lg font-weight-bolder text-primary">{ cantidad }</span>
            </Nav.Link>
        </Nav.Item>
    )
}
class PestamosDevoluciones extends Component {

    render() {
        const { bodega } = this.props
        return (
            <div>
                <Tab.Container>
                    <Nav className="nav nav-pills d-flex flex-nowrap hover-scroll-x py-2 justify-content-center">
                        {
                            bodega.prestamos.map((prestamo) => {
                                return(
                                    <NavItem prestamo = { prestamo } />
                                )
                            })
                        }
                    </Nav>
                    <Tab.Content className="col-md-7 mx-auto">
                        <Tab.Pane eventKey="first">
                            <div className="d-flex flex-stack position-relative mt-8">
                                <div className="position-absolute h-100 w-4px bg-success rounded top-0 left-0"></div>
                                <div className="font-weight-bold ml-5 text-dark-50 py-1">
                                    <div className="d-flex font-size-h6 justify-content-between">
                                        <div>DEVOLUCIÓN: 5</div>
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
                            <div className="d-flex flex-stack position-relative mt-8">
                                <div className="position-absolute h-100 w-4px bg-danger rounded top-0 left-0"></div>
                                <div className="font-weight-bold ml-5 text-dark-50 py-1">
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
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </div>
        );
    }
}

export default PestamosDevoluciones;