import React, { Component } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import { dayDMY, setLabelVentas } from "../../../functions/setters"
// import ItemSlider from '../../singles/ItemSlider'

class PresupuestoGeneradoCalidad extends Component {
    render() {
        const { presupuesto, ticket, openAlertChangeStatusP, /*form*/ } = this.props
        return (
            <Row className="mx-0">
                <Col md="6" className="pl-0">
                    <Card className="card-custom card-stretch">
                        <Card.Body>
                            <div className="">
                                <div className="d-flex flex-center flex-column mb-5">
                                    <div className="font-size-h5 text-dark-75 font-weight-bolder mb-1">DATOS DEL PRESUPUESTO</div>
                                    <div className="badge badge-light-info d-inline">{setLabelVentas(presupuesto.estatus)}</div>
                                </div>
                                <div className="separator separator-dashed my-3"></div>
                                <div className="form-group row form-group-marginless mt-8">
                                    <div className="col-md-6">
                                        <div className="d-flex">
                                            <div className="symbol symbol-40 symbol-light-primary mr-5">
                                                <span className="symbol-label">
                                                    <i className="las la-id-card icon-2x text-primary"></i>
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                                <div className="text-dark mb-1 font-size-lg">{presupuesto.identificador}</div>
                                                <span className="text-muted font-weight-light">IDENTIFICADOR</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex">
                                            <div className="symbol symbol-40 symbol-light-info mr-5">
                                                <span className="symbol-label">
                                                    <i className="flaticon2-calendar-9 icon-lg text-info"></i>
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                                <div className="text-dark mb-1 font-size-lg">{dayDMY(presupuesto.fecha)}</div>
                                                <span className="text-muted font-weight-light">FECHA</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-6">
                                        <div className="d-flex">
                                            <div className="symbol symbol-40 symbol-light-info mr-5">
                                                <span className="symbol-label">
                                                    <i className="flaticon-calendar-with-a-clock-time-tools icon-xl text-info"></i>
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                                <div className="text-dark mb-1 font-size-lg">{presupuesto.tiempo_ejecucion}</div>
                                                <span className="text-muted font-weight-light">TIEMPO DE EJECUCIÓN</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex">
                                            <div className="symbol symbol-40 symbol-light-primary mr-5">
                                                <span className="symbol-label">
                                                    <i className="flaticon2-calendar-5 icon-lg text-primary"></i>
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                                <div className="text-dark mb-1 font-size-lg">{presupuesto.tiempo_valido} DÍAS</div>
                                                <span className="text-muted font-weight-light">TIEMPO VALIDO</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-6">
                                        <div className="d-flex">
                                            <div className="symbol symbol-40 symbol-light-primary mr-5">
                                                <span className="symbol-label">
                                                    <i className="las la-link icon-2x text-primary"></i>
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                                <a rel="noopener noreferrer" href={ticket.presupuestoAdjunto} target="_blank" className="text-dark mb-1 font-size-lg">PRESUPUESTO</a>
                                                <span className="text-muted font-weight-light">ADJUNTO</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <a className="d-inline-flex bg-change-status a-hover" onClick={(e) => { e.preventDefault(); openAlertChangeStatusP(presupuesto) }}>
                                            <div className="symbol symbol-40 pulse pulse-warning mr-5">
                                                <span className="symbol-label" style={{color:'#FF8B00 ', backgroundColor:'#FFECD7'}}>
                                                    <i className="las la-sync-alt icon-2x" style={{color:'#FF8B00 '}}></i>
                                                    <span className="pulse-ring"></span>
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                                <span className="text-dark mb-1 font-size-lg">CAMBIAR ESTATUS</span>
                                                <span className="text-muted font-weight-light">PRESUPUESTO</span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md="6" className="pr-0">
                    <Card className="card-custom card-stretch">
                        <Card.Header className="border-0 pb-0">
                            <div className="mb-0 card-title h5">
                                <div className="font-weight-bold font-size-h5">Evidencia del visto bueno</div>
                            </div>
                        </Card.Header>
                        <Card.Body className="pt-0 d-flex flex-direction-column justify-content-center">
                            {/* <ItemSlider items={form.adjuntoEvidencia} item='adjuntoEvidencia' /> */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        )
    }
}

export default PresupuestoGeneradoCalidad