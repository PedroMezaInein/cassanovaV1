import React, { Component } from 'react'
import { Card, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { dayDMY, setMoneyText } from "../../../functions/setters"
import ItemSlider from '../../singles/ItemSlider'
import { CommonLottie, SearchNotFound } from '../../Lottie'

class HistorialCotizacionesDiseño extends Component {
    state = {
        accordion: [],
    }

    handleAccordion = (indiceClick) => {
        const { pdfs } = this.props;
        pdfs.forEach((element, key) => {
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
    addOrden = (pdf) => {
        let flag = false
        if (pdf.pivot.fecha_envio) {
            if(pdf.pivot.motivo_rechazo === null){
                flag = true
            }
        }
        return flag
    }
    render() {
        const { pdfs, sendPresupuesto, onClickOrden, filtering } = this.props
        return (
            <div className="table-responsive">
                <div className="list min-w-500px col-md-12 px-0">
                    <div className="accordion accordion-light accordion-svg-toggle">
                        {
                            pdfs.length>0?
                                pdfs.map((pdf, index) => {
                                    return (
                                        <Card key={index} className={`min-w-xxs-700px w-auto ${pdf.isActive? 'border-top-0' : ''}`} >
                                            <Card.Header >
                                                <Card.Title className={`rounded-0 px-3 ${(pdf.isActive) ? 'text-primary2 collapsed bg-light' : 'text-dark'}`} onClick={() => { this.handleAccordion(pdf.id) }}>
                                                    <span className={`svg-icon ${pdf.isActive ? 'svg-icon-primary2' : 'svg-icon-dark'}`}>
                                                        <SVG src={toAbsoluteUrl('/images/svg/Angle-right.svg')} />
                                                    </span>
                                                    <div className="card-label ml-3 w-100 d-flex">
                                                        <div className="w-70 d-flex">
                                                            <div className="w-40">
                                                                <div className="font-size-lg"><span className="font-size-sm">ID</span>. {pdf.pivot.identificador}</div>
                                                                <div className="font-weight-light font-size-sm text-dark-75">
                                                                    {dayDMY(pdf.created_at)} - {this.getEsquema(pdf.name)}
                                                                </div>
                                                            </div>
                                                            <div className="w-30 d-flex justify-content-center align-self-center">
                                                                <div className="font-weight-light font-size-sm align-items-center">
                                                                    <b>Con iva:</b>
                                                                    <span className="text-dark ml-2">
                                                                        {setMoneyText(pdf.pivot.costo)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="w-30 d-flex justify-content-center align-self-center">
                                                                <div className="font-weight-light font-size-sm align-items-center">
                                                                    <b>Sin iva:</b>
                                                                    <span className="text-dark ml-2">
                                                                        {setMoneyText(pdf.pivot.costo_sin_iva)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="w-30 d-flex align-self-center">
                                                            <div className="align-self-center w-70 text-center">
                                                                {this.labelStatus(pdf)}
                                                            </div>
                                                            <div className="w-30 d-flex justify-content-end">
                                                                {
                                                                    pdf.pivot.fecha_envio === null ?
                                                                        <OverlayTrigger rootClose overlay={<Tooltip> <span className='font-weight-bolder'>ENVIAR A CLIENTE</span> </Tooltip>}>
                                                                            <span onClick={(e) => { e.preventDefault(); sendPresupuesto(pdf) }}
                                                                                className={`btn btn-icon ${pdf.isActive ?
                                                                                    'btn-color-info2'
                                                                                    : ''}  btn-active-light-info2 w-30px h-30px`}>
                                                                                <i className="las la-envelope icon-xl"></i>
                                                                            </span>
                                                                        </OverlayTrigger>
                                                                        :
                                                                        <></>
                                                                }
                                                                <OverlayTrigger rootClose overlay={<Tooltip><span className='font-weight-bolder'>VER PDF</span></Tooltip>}>
                                                                    <a rel="noopener noreferrer" href={pdf.url} target="_blank"
                                                                        className={`btn btn-icon ${pdf.isActive ?
                                                                            'btn-color-primary2'
                                                                            : ''}  btn-active-light-primary2 w-30px h-30px ml-3`}>
                                                                        <i className="las la-file-pdf icon-xl mt-1"></i>
                                                                    </a>
                                                                </OverlayTrigger>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card.Title>
                                            </Card.Header>
                                            <Card.Body className={`card-body px-10 ${pdf.isActive ? 'collapse show' : 'collapse'}`}>
                                                {
                                                    this.addOrden(pdf) ?
                                                        <div className="d-flex col-md-9 mx-auto my-6 justify-content-between">
                                                            <div className="text-justify">
                                                                <span className="font-weight-light"><span className="font-weight-bolder"><u>Fecha de envio:</u> </span>{dayDMY(pdf.pivot.fecha_envio)}</span>
                                                            </div>
                                                            <div className="d-flex align-items-center bg-light-primary2 rounded p-1 cursor-pointer w-fit-content" onClick={(e) => { e.preventDefault(); onClickOrden('add-orden', pdf); }} >
                                                                <span className="svg-icon svg-icon-primary2 mr-1">
                                                                    <span className="svg-icon svg-icon-md">
                                                                        <SVG src={toAbsoluteUrl('/images/svg/Question-circle.svg')} />
                                                                    </span>
                                                                </span>
                                                                <div className="d-flex font-weight-bolder text-primary2 font-size-sm">
                                                                    Aceptar o rechazar cotización
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : <></>
                                                }
                                                <Col md={10} className="mx-auto text-center mt-8">
                                                    <ItemSlider items={[{ url: pdf.url, name: pdf.name }]}/>
                                                </Col>
                                                {
                                                    pdf.pivot.motivo_rechazo !== null?
                                                    <>
                                                        <div className="mt-5 text-justify font-weight-light col-md-9 mx-auto">
                                                        <div className="text-justify mb-3 mt-8">
                                                            <span className="font-weight-light"><span className="font-weight-bolder">Fecha de envio: </span>{dayDMY(pdf.pivot.fecha_envio)}</span>
                                                        </div>
                                                            <span className="font-weight-bolder">MOTIVO DE RECHAZO:</span> {pdf.pivot.motivo_rechazo}
                                                        </div>
                                                    </>
                                                    :<></>
                                                }
                                            </Card.Body>
                                        </Card>
                                    )
                                }
                                )
                            :pdfs.length === 0 && filtering.status_filtering?
                                <>  
                                <div className="col-md-4 mx-auto">
                                    <CommonLottie animationData = { SearchNotFound } />
                                </div>
                                <div className="text-center font-weight-bold font-size-h6">No se encontró la cotización</div>
                                </>
                            :<></>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default HistorialCotizacionesDiseño