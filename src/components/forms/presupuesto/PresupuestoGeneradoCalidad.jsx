import React, { Component } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import { dayDMY, setLabelVentas } from "../../../functions/setters"
import ItemSlider from '../../singles/ItemSlider'

class PresupuestoGeneradoCalidad extends Component {

    getVobo = () => {
        const { presupuesto } = this.props
        let aux = []
        presupuesto.pdfs_accepeted.forEach((pdf) => {
            if(pdf.pivot.url)
                aux.push({url: pdf.pivot.url, name: pdf.pivot.url})
        })
        return aux
    }

    isActiveSumaVentas = () => {
        const { presupuesto } = this.props
        if(presupuesto){
            if(presupuesto.estatus){
                if(presupuesto.estatus.estatus === 'Aceptado'){
                    return true
                }
            }
        }
        return false
    }

    getStatus = () => {
        const { presupuesto, ticket } = this.props
        let total = presupuesto.totalPresupuesto
        let totalVentas = ticket.totalVentas
        if(totalVentas < (total - 1) )
            return 'danger';
        return 'success'
    }

    render() {
        const { presupuesto, ticket, openAlertChangeStatusP } = this.props
        return (
            <Row className="mx-0">
                <Col md='12' className="p-0 mb-5">
                    <Card className="card-custom card-stretch">
                        <Card.Body>
                            <div className="">
                                <div className="d-flex flex-center flex-column mb-5">
                                    <div className="font-size-h5 text-dark-75 font-weight-bolder mb-1">DATOS DEL PRESUPUESTO</div>
                                    <div className="badge badge-light-info d-inline">{setLabelVentas(presupuesto.estatus)}</div>
                                    <div className="d-flex mt-2">
                                        {
                                            presupuesto.estatus ? 
                                                presupuesto.estatus.estatus !== 'Aceptado' ?
                                                    <span onClick = { () => { openAlertChangeStatusP('Aceptado') } } className="btn btn-hover-text-success btn-hover-icon-success btn-sm btn-text-dark-50 bg-hover-light-success rounded font-weight-bolder font-size-sm p-2 mr-2">
                                                        <i className="las la-check-circle icon-lg text-success pr-1"></i>
                                                        <span className="border-bottom border-success">¿Se aceptó el presupuesto?</span>
                                                    </span>
                                                : ''
                                            : ''
                                        }
                                        {
                                            presupuesto.estatus ? 
                                                presupuesto.estatus.estatus !== 'Rechazado' ?
                                                    <span onClick = { () => { openAlertChangeStatusP('Rechazado') } } className="btn btn-hover-text-danger btn-hover-icon-danger btn-sm btn-text-dark-50 bg-hover-light-danger rounded font-weight-bolder font-size-sm p-2">
                                                        <i className="las la-times-circle icon-lg text-danger pr-1"></i>
                                                        <span className="border-bottom border-danger">¿Se rechazó el presupuesto?</span>
                                                    </span>
                                                : ''
                                            : ''
                                        }
                                    </div>
                                </div>
                                <div className="separator separator-dashed my-3"></div>
                                <div className="row form-group-marginless mt-8">
                                    <div className = {`col-md-${this.isActiveSumaVentas() ? 2 : 3} mb-4 mb-md-0`}>
                                        <div className="d-flex">
                                            <div className="symbol symbol-40 symbol-light-primary mr-5">
                                                <span className="symbol-label">
                                                    <i className="las la-id-card icon-2x text-primary"></i>
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                                <div className="text-dark mb-1 font-size-lg">{presupuesto.identificador}</div>
                                                <span className="text-muted font-weight-light">NO. DEL PRESUPUESTO</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className = {`col-md-${this.isActiveSumaVentas() ? 2 : 3} mb-4 mb-md-0`}>
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
                                    <div className="col-md-3 mb-4 mb-md-0">
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
                                    <div className = {`col-md-${this.isActiveSumaVentas() ? 2 : 3} mb-4 mb-md-0`}>
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
                                    {
                                        this.isActiveSumaVentas() ?
                                            <div className="col-md-3">
                                                <div className="d-flex">
                                                    <div className = {`symbol symbol-40 symbol-light-${this.getStatus()} mr-5`}>
                                                        <span className="symbol-label">
                                                            <i className={`fas fa-search-dollar icon-lg text-${this.getStatus()}`}></i>
                                                        </span>
                                                    </div>
                                                    <div className="d-flex flex-column font-weight-bold">
                                                        <div className="text-dark mb-1 font-size-lg">
                                                            <b>
                                                                ${presupuesto.totalPresupuesto.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                                                            </b> / 
                                                            <span className = { `text-${this.getStatus()}` }>
                                                                ${ticket.totalVentas.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                                                            </span>
                                                        </div>
                                                        <span className="text-muted font-weight-light">Total / Total pagado</span>
                                                    </div>
                                                </div>
                                            </div>  
                                        : <></>
                                    }
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md='12' className="px-0 py-4">
                    <Card className="card-custom card-stretch">
                        <Card.Body className="py-5 d-flex flex-direction-column justify-content-center">
                            <div className="row mx-0">
                                <div className = {`col-md-${presupuesto.estatus.estatus === 'Aceptado' ? 6 : 12} align-self-center`}>
                                    <div className="font-size-h5 text-dark-75 font-weight-bolder mb-1 py-5 text-center">PRESUPUESTO</div>
                                    {
                                        ticket ? 
                                            <ItemSlider items = { [ {name: ticket.presupuestoAdjunto, url: ticket.presupuestoAdjunto} ] } item='adjuntoEvidencia' />
                                        : <></>
                                    }
                                </div>
                                {
                                    presupuesto.estatus.estatus === 'Aceptado' ? 
                                        <div className="col-md-6 align-self-center">
                                            <div className="font-size-h5 text-dark-75 font-weight-bolder mb-1 py-5 text-center">Evidencias Vo.Bo.</div>
                                            {
                                                ticket ? 
                                                    <ItemSlider items = { this.getVobo() } item='adjuntoEvidencia' />
                                                : <></>
                                            }
                                        </div>
                                    : <></>
                                }
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        )
    }
}

export default PresupuestoGeneradoCalidad