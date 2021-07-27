import React, { Component } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { dayDMY, setLabelVentas } from "../../../functions/setters"

class PresupuestoGeneradoCalidad extends Component {
    render() {
        const { presupuesto, form, onChangeAdjunto, ticket } = this.props
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
                                                <a rel="noopener noreferrer" href={ticket.presupuestoAdjunto} target="_blank" className="text-dark mb-1 font-size-lg">ADJUNTO</a>
                                                <span className="text-muted font-weight-light">PRESUPUESTO</span>
                                            </div>
                                        </div>
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
                            <div className="d-flex justify-content-center mb-8">
                                <div className="p-6 border w-fit-content text-center rounded">
                                    <span className="svg-icon svg-icon-5x svg-icon-primary">
                                        <SVG src={toAbsoluteUrl('/images/svg/Files/PDF.svg')}/>
                                    </span>
                                    <div className="font-weight-bold mt-5">
                                        <a className="font-size-lg font-weight-bolder text-dark">Captura de pantalla</a>
                                        <div className="text-gray-400">02 JULIO 2021</div>
                                    </div>
                                </div>
                            </div>
                            <label htmlFor="adjunto" className="drop-files">
                                <span className="svg-icon svg-icon-3x svg-icon-primary mr-4">
                                    <SVG src={toAbsoluteUrl('/images/svg/Uploaded-file.svg')}/>
                                </span>
                                <input
                                    id="adjunto"
                                    type="file"
                                    onChange={onChangeAdjunto}
                                    placeholder={form.adjuntos.adjunto_evidencia.placeholder}
                                    value={form.adjuntos.adjunto_evidencia.value}
                                    name='adjunto_evidencia'
                                    accept="image/*, application/pdf"
                                />
                                <div className="font-weight-bold">
                                    <div className="text-gray-900 font-weight-bolder font-size-lg">{form.adjuntos.adjunto_evidencia.placeholder}</div>
                                </div>
                            </label>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        )
    }
}

export default PresupuestoGeneradoCalidad