import React, { Component } from 'react';
import { Tab, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { setDiaMesTexto, setFechaTexto } from '../../../functions/functions';

const NavItem = children => {
    const { prestamo: { id, cantidad, sumDevoluciones, proyecto, fecha }, onSelect } = children
    return (
        <OverlayTrigger overlay = { <Tooltip>{proyecto.nombre}</Tooltip> } >
            <Nav.Item className = 'mr-1' onClick = { (e) => { e.preventDefault(); onSelect(id) } }>
                <Nav.Link eventKey = { id } className="nav-link btn btn-hover-light-primary d-flex flex-column flex-center border-radius-21px min-w-60px mr-2 py-4 px-3 ">
                    <span className="opacity-50 font-size-sm font-weight-bold text-primary">
                        { setDiaMesTexto(fecha) }
                        <span className="d-block">{ new Date(fecha).getFullYear()}</span>
                    </span>
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
                    </Nav>
                    <Tab.Content>
                        {
                            bodega.prestamos.map((prestamo, index) => {
                                return(
                                    <Tab.Pane eventKey={prestamo.id} key = { index } className="col-md-10 mx-auto">
                                        <div className="w-auto d-flex flex-column mx-auto mt-8">
                                            <div className="bg-light p-4 rounded-xl flex-grow-1 align-self-center">
                                                <div id="symbol-total-contactos">
                                                    <span>
                                                        <span className="symbol symbol-circle symbol-white symbol-30 flex-shrink-0 mr-2">
                                                            <span className="symbol-label">
                                                                <i className="flaticon2-cancel-music text-danger icon-nm"></i>
                                                            </span>
                                                        </span>
                                                        <span className="font-size-sm font-weight-bolder">
                                                            <span className="font-size-lg">{prestamo.cantidad}</span>
                                                            <span className="ml-2 font-weight-light">PRESTADOS</span>
                                                        </span>
                                                    </span>
                                                    <span className="ml-4">
                                                        <span className="symbol symbol-circle symbol-white symbol-30 flex-shrink-0 mr-2">
                                                            <span className="symbol-label">
                                                                <i className="flaticon2-check-mark text-success font-size-14px"></i>
                                                            </span>
                                                        </span>
                                                        <span className="font-size-sm font-weight-bolder">
                                                            <span className="font-size-lg">{prestamo.sumDevoluciones}</span>
                                                            <span className="ml-2 font-weight-light">DEVUELTOS</span>
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* col-md-10 row mx-auto d-flex justify-content-end */}
                                        <div className="align-end">
                                            {/* ANCHOR PRESTAMOS */}
                                            <div className="d-flex flex-stack position-relative mt-8 w-100">
                                                <div className="position-absolute h-100 w-4px bg-danger rounded top-0 left-0"></div>
                                                <div className="font-weight-bold ml-5 text-dark-50 py-1 w-100">
                                                    <div className="d-flex font-size-h6 justify-content-between">
                                                        <div>PRÉSTAMO: {prestamo.cantidad}</div>
                                                        <div className="font-size-sm text-muted align-self-center">
                                                            RESPONSABLE:
                                                            <span className="text-primary"> {prestamo.responsable}</span>
                                                        </div>
                                                    </div>
                                                    <div className="font-size-h6 font-weight-bolder text-body my-2">{prestamo.proyecto.nombre}</div>
                                                    <div className="text-gray-700 text-uppercase font-weight-light text-justify">
                                                        { prestamo.comentarios }
                                                    </div>
                                                </div>
                                            </div>
                                            {/* ANCHOR DEVOLUCIONES */}
                                            {
                                                prestamo.devoluciones.map((devolucion, key) => {
                                                    return(
                                                        <div className="d-flex flex-stack position-relative mt-8 w-94" key = { key } >
                                                            <div className="position-absolute h-100 w-4px bg-success rounded top-0 left-0"></div>
                                                            <div className="font-weight-bold ml-5 text-dark-50 py-1 w-100">
                                                                <div className="d-flex font-size-h6 justify-content-between">
                                                                    <div>DEVOLUCIÓN: {devolucion.cantidad} </div>
                                                                    <div className="font-size-sm text-muted align-self-center">
                                                                        RESPONSABLE:
                                                                        <span className="text-primary"> {devolucion.responsable}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="font-size-h6 font-weight-bolder text-body my-2"> {setFechaTexto(devolucion.fecha)} </div>
                                                                <div className="text-gray-700 text-uppercase font-weight-light text-justify">
                                                                    {devolucion.comentarios}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <div className="d-flex w-94 p-3 mt-5">
                                                    Formulario
                                                </div>
                                        </div>
                                    </Tab.Pane>
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