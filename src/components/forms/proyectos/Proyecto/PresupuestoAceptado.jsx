import React, { Component } from 'react'
import SVG from 'react-inlinesvg'
import { Tab, Nav } from 'react-bootstrap'
import { toAbsoluteUrl } from '../../../../functions/routers'
import ItemSlider from '../../../../components/singles/ItemSlider'
import { dayDMY, setMoneyText } from '../../../../functions/setters'
import { HistorialSolicitudesFacturaProyectos, TimelinePresupuestos } from '../..'

export default class HistorialPresupuestosProyecto extends Component {
    state = {
        presupuesto_aceptado: [],
    }
    render() {
        const { at, presupuesto, presupuesto_aceptado, getPresupuestos, proyecto, onClickOrden } = this.props
        console.log(presupuesto, 'presupuesto')
        console.log(presupuesto_aceptado, 'presupuesto_aceptado')
        return (
            <>
                <div className="pt-15 pb-8 px-lg-10">
                    <div className="row mx-0 min-width-608px">
                        <div className="w-25 px-4 align-self-center">
                            <div className="icons-sombra d-flex align-items-center">
                                <div className="icon-div"><i className="flaticon-file-2"></i></div>
                                <div className="ml-6">
                                    <div className="title-icon mb-2">IDENTIFICADOR</div>
                                    <div>{presupuesto_aceptado[0].pivot.identificador}</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-25 px-4 align-self-center">
                            <div className="icons-sombra d-flex align-items-center">
                                <div className="icon-div"><i className="flaticon-calendar-1"></i></div>
                                <div className="ml-6">
                                    <h3 className="title-icon mb-2">FECHA</h3>
                                    <div>{dayDMY(presupuesto_aceptado[0].pivot.fecha)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-25 px-4 align-self-center">
                            <div className="icons-sombra d-flex align-items-center">
                                <div className="icon-div"><i className="flaticon-coins"></i></div>
                                <div className="ml-6">
                                    <h3 className="title-icon mb-2">MONTO</h3>
                                    <div>{setMoneyText(presupuesto_aceptado[0].pivot.monto)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-25 px-4 align-self-center">
                            <div className="icons-sombra d-flex align-items-center">
                                <div className="icon-div"><i className="flaticon-clock-1"></i></div>
                                <div className="ml-6">
                                    <h3 className="title-icon mb-2">TIEMPO DE VALIDEZ</h3>
                                    <div>{presupuesto.tiempo_valido} {presupuesto.tiempo_valido === '1' ? 'día' : 'días'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Tab.Container id="left-tabs-example" defaultActiveKey="presupuesto-aceptado">
                    <Nav className="nav-pills nav-light-info justify-content-center py-5 mb-5 font-weight-bolder border-0 rounded">
                        <Nav.Item>
                            <Nav.Link eventKey="presupuesto-aceptado">Presupuesto aceptado</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="orden-compra">Orden de compra</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="solicitud-factura">Solicitud de factura</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="historial-presupuestos">Historial de presupuestos</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content className="pb-10">
                        <Tab.Pane eventKey="presupuesto-aceptado">
                            <ItemSlider items={[{ url: presupuesto_aceptado[0].url, name: presupuesto_aceptado[0].name }]} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="orden-compra">
                            <div className="d-flex justify-content-end mb-8 w-85">
                                <span className="d-flex align-items-center bg-light-primary2 rounded p-1 cursor-pointer" onClick={(e) => { e.preventDefault(); onClickOrden('modify-orden', presupuesto_aceptado[0]); }} >
                                    <span className="svg-icon svg-icon-primary2 mr-1">
                                        <span className="svg-icon svg-icon-md">
                                            <SVG src={toAbsoluteUrl('/images/svg/Edit.svg')} />
                                        </span>
                                    </span>
                                    <div className="d-flex font-weight-bolder text-primary2 font-size-sm">
                                        Modificar orden de compra
                                    </div>
                                </span>
                            </div>
                            <ItemSlider items={[{ url: presupuesto_aceptado[0].pivot.url, name: presupuesto_aceptado[0].name }]} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="solicitud-factura">
                            <HistorialSolicitudesFacturaProyectos
                                presupuesto_aceptado={presupuesto_aceptado}
                                at={at}
                                proyecto={proyecto}
                                presupuesto={presupuesto}
                                getPresupuestos={getPresupuestos}
                            />
                        </Tab.Pane>
                        <Tab.Pane eventKey="historial-presupuestos">
                            <TimelinePresupuestos presupuesto={presupuesto} onClickOrden={onClickOrden} changeStatus = { false }/>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </>
        );
    }
}