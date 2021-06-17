import React, { Component } from 'react';
import { Tab, Nav, OverlayTrigger, Tooltip, Row, Col, Form } from 'react-bootstrap';
import { setDiaMesTexto, setFechaTexto } from '../../../functions/functions';
import { validateAlert } from '../../../functions/alert';
import { InputGray, CalendarDay, Button, InputNumberGray } from '../../form-components'

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
        active: '',
        showForm:false
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
    mostrarFormulario() {
        const { showForm } = this.state
        this.setState({
            ...this.state,
            showForm: !showForm
        })
    }
    render() {
        const { bodega, form, onChange, onSubmit } = this.props
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
                                            <div className="d-flex p-3 mt-5 w-94 flex-direction-column align-items-center">
                                                <Button icon='' className = "btn btn-sm btn-bg-light btn-icon-success btn-hover-light-success text-success font-weight-bolder font-size-13px" onClick={() => { this.mostrarFormulario() }}
                                                    only_icon = "la la-reply icon-lg mr-3 px-0 text-success" text = 'AGREGAR DEVOLUCIÓN' />
                                                <Form
                                                    onSubmit={
                                                        (e) => {
                                                            e.preventDefault();
                                                            validateAlert(onSubmit, e, 'form-devolución')
                                                        }
                                                    }
                                                >
                                                    <Row className={!this.state.showForm ? 'd-none' : 'row mx-0 col-md-12 border-dashed p-5 mt-5'}>
                                                        <Col md="6" className="text-center align-self-center">
                                                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                                                <label className="text-center font-weight-bolder">Fecha del préstamo</label>
                                                            </div>
                                                            <CalendarDay value={form.fecha} name='fecha' onChange={onChange} date={form.fecha} withformgroup={0} requirevalidation={1} />
                                                        </Col>
                                                        <Col md="6" className="align-self-center">
                                                            <div className="row form-group-marginless row-paddingless">
                                                                <div className="col-md-12">
                                                                    <InputGray
                                                                        withtaglabel={1} withtextlabel={1} withplaceholder={1}
                                                                        withicon={1} requirevalidation={1} withformgroup={0}
                                                                        name="responsable"
                                                                        value={form.responsable}
                                                                        onChange={onChange}
                                                                        type="text"
                                                                        placeholder='NOMBRE DEL RESPONSABLE'
                                                                        iconclass="fas fa-user"
                                                                        messageinc="Ingresa el nombre del responsable."
                                                                    />
                                                                </div>
                                                                <div className="col-md-12 separator separator-dashed mt-5 mb-1"></div>
                                                                <div className="col-md-12">
                                                                    <InputNumberGray
                                                                        formgroup="mb-0"
                                                                        requirevalidation={1}
                                                                        name="cantidad"
                                                                        onChange={onChange}
                                                                        value={form.cantidad}
                                                                        type="text"
                                                                        placeholder="CANTIDAD"
                                                                        iconclass={"flaticon2-add-square"}
                                                                        thousandseparator={true}
                                                                        messageinc="Ingresa la cantidad."
                                                                    />
                                                                </div>
                                                                <div className="col-md-12 separator separator-dashed mt-5 mb-1"></div>
                                                                <div className="col-md-12">
                                                                    <InputGray
                                                                        withtaglabel={1} withtextlabel={1} withplaceholder={1}
                                                                        withicon={0} requirevalidation={0} withformgroup={0}
                                                                        formeditado={0}
                                                                        rows="3"
                                                                        as="textarea"
                                                                        placeholder="COMENTARIO"
                                                                        name="comentario"
                                                                        value={form.comentario}
                                                                        onChange={onChange}
                                                                        style={{ paddingLeft: "10px" }}
                                                                        messageinc="Incorrecto. Ingresa tu comentario."
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col md="12" className="mt-6">
                                                            <div className="card-footer px-0 pb-0 pt-4 text-center">
                                                                <Button icon='' text='ENVIAR' className="btn btn-light-success font-weight-bolder" onClick={(e) => { e.preventDefault(); onSubmit(e) }} />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Form>
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