import React, { Component } from 'react'
import { Card, Col } from 'react-bootstrap'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { dayDMY, setMoneyText } from '../../../functions/setters'
import { ItemSlider } from '../../singles'
class PresupuestoList extends Component {

    state = {
        accordion: [],
    }

    handleAccordion = (indiceClick) => {
        const { pdfs } = this.props;
        pdfs.forEach((element) => {
            if (element.id === indiceClick) {
                element.isActive = element.isActive ? false : true
            }else {
                element.isActive = false
            }
        })
        this.setState({
            accordion: pdfs
        });
    }
    getEsquema(name){
        let cadena = name.split("-", 1);
        return cadena
    }
    labelStatus = pdf => {
        if(pdf.pivot.fecha_envio === null){
            return(
                <span className="label-status" style={{ backgroundColor: `#f0e3fd`, color:  `#764ca2`}}>
                    Sin enviar
                </span>    
            )
        }
        if(pdf.pivot.motivo_rechazo){
            return(
                <span className="label-status" style = { { backgroundColor: `#ffe6ee`, color:  `#f73967`}}>
                    Rechazado
                </span>    
            )
        }
        if(pdf.pivot.fecha_aceptacion){
            return(
                <span className="label-status" style = { { backgroundColor: `#E1F0FF`, color:  `#2171c1`}}>
                    Aceptado
                </span>
            )
        }
        return(
            <span className="label-status" style = { { backgroundColor: `#E0F2F1`, color:  `#26A69A`}}>
                En espera
            </span>
        )
    }
    render() {
        const { pdfs } = this.props
        return (
            <div className="table-responsive">
                <div className="list min-w-400px col-md-11 mx-auto">
                    <div className="accordion accordion-light accordion-svg-toggle">
                        {
                            pdfs.map((pdf, index) => {
                                return (
                                    <Card key={index} className={`w-auto ${pdf.isActive? 'border-top-0' : ''}`} >
                                        <Card.Header >
                                            <Card.Title className={`rounded-0 px-3 ${(pdf.isActive) ? 'text-primary2 collapsed bg-light' : 'text-dark'}`} onClick={() => { this.handleAccordion(pdf.id) }}>
                                                <span className={`svg-icon ${pdf.isActive ? 'svg-icon-primary2' : 'svg-icon-dark'}`}>
                                                    <SVG src={toAbsoluteUrl('/images/svg/Angle-right.svg')} />
                                                </span>
                                                <div className="card-label ml-3 w-100 d-flex">
                                                    <div className="w-80 d-flex">
                                                        <div className="w-33">
                                                            <a rel="noopener noreferrer" href={pdf.url} target="_blank" className= {`font-size-lg ${(pdf.isActive) ? 'text-primary2' : 'text-dark'}`}><span className="font-size-sm">ID</span>. {pdf.pivot.identificador}</a>
                                                            <div className="font-weight-light font-size-sm text-dark-75 mt-2">
                                                                {dayDMY(pdf.created_at)} - {this.getEsquema(pdf.name)}
                                                            </div>
                                                        </div>
                                                        <div className="w-33 align-self-center text-center">
                                                            <span className="font-weight-light font-size-sm">
                                                                <b>Con iva:</b><span className="text-dark ml-2">{setMoneyText(pdf.pivot.costo)}</span>
                                                            </span>
                                                        </div>
                                                        <div className="w-33 align-self-center text-center">
                                                            <span className="font-weight-light font-size-sm">
                                                                <b>Sin iva:</b><span className="text-dark ml-2">{setMoneyText(pdf.pivot.costo_sin_iva)}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="align-self-center d-flex w-20">
                                                        <div className="w-100 d-flex justify-content-end">
                                                            <div className="align-self-center w-50 text-center">
                                                                {this.labelStatus(pdf)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Title>
                                        </Card.Header>
                                        <Card.Body className={`card-body p-5 ${pdf.isActive ? 'collapse show' : 'collapse'}`}>
                                            {
                                                pdf.pivot.fecha_envio !== null?
                                                <div className="font-weight-light mb-4 text-center">
                                                    <span className="font-weight-bolder"><u>Fecha de envio:</u> </span>{dayDMY(pdf.pivot.fecha_envio)}
                                                </div>
                                                :<></>
                                            }
                                            <Col md={12} className="mx-auto text-center">
                                                <ItemSlider items={[{ url: pdf.url, name: pdf.name }]}/>
                                            </Col>
                                        </Card.Body>
                                    </Card>
                                )
                            }
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default PresupuestoList