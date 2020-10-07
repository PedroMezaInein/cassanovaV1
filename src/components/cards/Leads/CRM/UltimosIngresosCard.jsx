import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
export default class UltimosContactosCard extends Component {
    render() {
        return (
            <Card className="card-custom card-stretch gutter-b py-2">
                <Card.Header className="align-items-center border-0">
                    <div className="card-title align-items-start flex-column">
                        <span className="font-weight-bolder text-dark">Últimos leads ingresados</span>
                    </div>
                    <div className="card-toolbar">
                        <a href="#" className="btn btn-icon btn-xs btn-light-primary mr-2 my-1"><i className="ki ki-bold-arrow-back icon-xs"></i></a>
                        <a href="#" className="btn btn-icon btn-xs btn-light-primary mr-2 my-1"><i className="ki ki-bold-arrow-next icon-xs"></i></a>
                    </div>
                </Card.Header>
                <Card.Body className="py-2">
                    <div className="timeline timeline-5 text-dark-50">
                        <div className="timeline-item">
                            <div className="timeline-label">1 DÍA</div>
                            <div className="timeline-badge"><span className="bg-primary w-50 h-50"></span></div>
                            <div className="timeline-content">
                                <a href="tel:+5500112233" className="text-dark-75 font-weight-bolder text-hover-primary mb-1">LUIS MIGUEL SOLANA</a> - REMODELACIÓN DE OFICINAS
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-label">12 meses</div>
                            <div className="timeline-badge"><span className="bg-success w-50 h-50"></span></div>
                            <div className="timeline-content">
                                <a href="tel:+5500112233" className="text-dark-75 font-weight-bolder text-hover-primary mb-1">IVÁN PÉREZ ALFARO</a> - SERVICIO DE INTERÉS
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-label">3 años</div>
                            <div className="timeline-badge"><span className="bg-warning w-50 h-50"></span></div>
                            <div className="timeline-content">
                                <a href="tel:+5500112233" className="text-dark-75 font-weight-bolder text-hover-primary mb-1">ANA MARIA ALEJANDRA LEON REBOLLO</a> - VENTA DE EQUIPO MÉDICO Y MOBILIARIO
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-label">4 años</div>
                            <div className="timeline-badge"><span className="bg-danger w-50 h-50"></span></div>
                            <div className="timeline-content">
                                <a href="tel:+5500112233" className="text-dark-75 font-weight-bolder text-hover-primary mb-1">MARILYN MARISCAL</a> - REMODELACIÓN DE OFICINAS
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-label">4 años</div>
                            <div className="timeline-badge"><span className="bg-info w-50 h-50"></span></div>
                            <div className="timeline-content">
                                <a href="tel:+5500112233" className="text-dark-75 font-weight-bolder text-hover-primary mb-1">VANESSA CANTU FLORES</a> - REMODELACIÓN DE OFICINAS
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        )
    }
}