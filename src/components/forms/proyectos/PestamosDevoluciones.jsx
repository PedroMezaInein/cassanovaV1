import React, { Component } from 'react';
import { Tab, Nav, Col } from 'react-bootstrap';
class PestamosDevoluciones extends Component {

    render() {
        const { form, onSubmit, onChange, formeditado, options, ...props } = this.props
        return (
            <>
                <Tab.Container defaultActiveKey="first">
                    <Nav className="nav nav-pills d-flex flex-nowrap hover-scroll-x py-2">
                        <Nav.Item className="mr-1">
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
                        </Nav.Item>
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane eventKey="first">
                            <div className="d-flex flex-stack position-relative mt-8">
                                <div className="position-absolute h-100 w-4px bg-secondary rounded top-0 left-0"></div>
                                <div className="font-weight-bold ml-5 text-gray-600">
                                    <div className="fs-5">10:00 - 11:00
                                        <span className="fs-7 text-gray-400 text-uppercase">am</span>
                                    </div>
                                    <a className="fs-5 fw-bolder text-gray-800 text-hover-primary mb-2">Weekly Team Stand-Up</a>
                                    <div className="text-gray-400">
                                        Lead by <a>Kendell Trevor</a>
                                    </div>
                                </div>
                                <a className="btn btn-bg-light btn-active-color-primary btn-sm">View</a>
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                            2
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </>
        );
    }
}

export default PestamosDevoluciones;