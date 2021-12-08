import React, { Component } from 'react'
import SVG from "react-inlinesvg"
import { Card } from 'react-bootstrap'
import { toAbsoluteUrl } from '../../../functions/routers'
import { dayDMY } from '../../../functions/setters'
import { apiGet, catchErrors } from '../../../functions/api'
import { printResponseErrorAlert } from '../../../functions/alert'
class HistorialVacaciones extends Component {

    state = {
        vacaciones: [],
        accordion: []
    }

    componentDidMount = () => {
        this.getVacaciones()
    }
    getVacaciones = async () => {
        const { at, empleado } = this.props
        apiGet(`v2/rh/empleados/vacaciones/${empleado.id}`, at).then(
            (response) => {
                const { vacaciones } = response.data
                this.setState({
                    ...this.state,
                    vacaciones: vacaciones
                })
            }, (error) => { printResponseErrorAlert(error) })
            .catch((error) => { catchErrors(error) })
    }
    handleAccordion = (element) => {
        const { vacaciones } = this.state
        vacaciones.forEach((vacaciones, key) => {
            if (vacaciones.año === element.año) {
                if(vacaciones.vacaciones.length>0){
                    vacaciones.isActive = vacaciones.isActive ? false : true
                }else{
                    vacaciones.isActive = false
                }
            }else {
                vacaciones.isActive = false
            }
        })
        this.setState({
            accordion: vacaciones
        });
    }
    printDate = (element) => {
        if(dayDMY(element.fecha_inicio) === dayDMY(element.fecha_fin)){
            return dayDMY(element.fecha_inicio)
        }else{
            return `${dayDMY(element.fecha_inicio)} - ${dayDMY(element.fecha_fin)}`
        }
    }
    setType(element, type) {
        switch (type) {
            case 'color':
                switch (element.estatus) {
                    case 'Aceptadas':
                        return "#e3efe3"
                    case 'En espera':
                        return "#fff4de"
                    default:
                        return "#ffe2e5"
                }
            case 'img':
                switch (element.estatus) {
                    case 'Aceptadas':
                        return "/sun-umbrella.png"
                    case 'En espera':
                        return "/sun-umbrella-warning.png"
                    default:
                        return "/sun-umbrella-danger.png"
                }
            default: break;
        }
    }
    render() {
        const { vacaciones } = this.state
        return (
            <div className="table-responsive mt-5">
                <div className="list min-w-700px col-md-12 mx-auto">
                    <div className="accordion accordion-light accordion-svg-toggle">
                        {
                            vacaciones.map((vacaciones, index) => {
                                let active = vacaciones.isActive
                                return (
                                    <Card className="w-auto" key={index}>
                                        <Card.Header >
                                            <Card.Title className={`rounded-0 ${(active) ? 'text-primary2 collapsed' : 'text-dark'}`} onClick={() => { this.handleAccordion(vacaciones) }}>
                                                <div className={`${vacaciones.vacaciones.length>0 ? '' : 'visibility-hidden'}`}>
                                                    <span className={`svg-icon ${active ? 'svg-icon-primary2' : 'svg-icon-dark'}`}>
                                                        <SVG src={toAbsoluteUrl('/images/svg/Angle-right.svg')} />
                                                    </span>
                                                </div>
                                                <div className="card-label ml-3 w-100 d-flex font-size-lg justify-content-between">
                                                    <div className="w-10">
                                                        {vacaciones.año}º año
                                                    </div>
                                                    <div className="w-auto text-right font-weight-light text-dark">
                                                        Periodo: <b className={active?'text-primary2':''}>{dayDMY(vacaciones.fechas.inicio)} - {dayDMY(vacaciones.fechas.fin)}</b>
                                                    </div>
                                                    <div className="w-20 text-right font-weight-light text-dark">
                                                        Disponibles: <b className={active?'text-success':''}>{vacaciones.disponibles} {vacaciones.disponibles===1?'día':'días'}</b>
                                                    </div>
                                                    <div className="w-20 text-right font-weight-light text-dark">
                                                        Tomados: <b className={active?'text-primary2':''}>{vacaciones.tomados} {vacaciones.tomados===1?'día':'días'}</b>
                                                    </div>
                                                </div>
                                            </Card.Title>
                                        </Card.Header>
                                        <Card.Body className={`card-body px-10 pt-2 pb-6 ${active ? 'collapse show' : 'collapse'}`} style={{backgroundColor:'#f9fafc'}}>
                                            <div className="row mx-0 justify-content-center">
                                                {
                                                    vacaciones.vacaciones.length > 0 ?
                                                        vacaciones.vacaciones.map((element, key) => {
                                                            return (
                                                                <div className="col-md-4 text-center d-flex align-items-center justify-content-center historial-vacaciones pt-4" key={key}>
                                                                    <div>
                                                                        <div>
                                                                            <img src={this.setType(element, 'img')} alt="" style={{backgroundColor: this.setType(element, 'color')  }} />
                                                                        </div>
                                                                        <div className="text-center font-weight-light mt-5">
                                                                            <div className="font-weight-bold">{element.estatus}</div>
                                                                            <span>{this.printDate(element)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                        : <></>
                                                }
                                            </div>
                                        </Card.Body>
                                    </Card>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default HistorialVacaciones