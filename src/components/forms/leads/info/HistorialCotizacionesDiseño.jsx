import React, { Component } from 'react'
import { Card, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../functions/routers"
import { dayDMY, setMoneyText } from "../../../../functions/setters"
import ItemSlider from '../../../../components/singles/ItemSlider'
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
        return(
            <span className="label-status" style={{ backgroundColor: `${pdf.pivot.fecha_envio!==null?'#E0F2F1':'#ffe6ee'}`, color:  `${pdf.pivot.fecha_envio!==null?'#26A69A':'#f73967'}`}}>
                {pdf.pivot.fecha_envio!==null?'Enviada':'Sin enviar'}
            </span>
        )
    }
    render() {
        const { pdfs, sendPresupuesto, changePageContratar } = this.props
        return (
            <>
                <div className="table-responsive">
                    <div className="list min-w-500px col-md-11 mx-auto">
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
                                                        <div className="w-70 d-flex">
                                                            <div className="w-70">
                                                                <div className="font-size-lg"><span className="font-size-sm">ID</span>. {pdf.pivot.identificador}</div>
                                                                <div className="font-weight-light font-size-sm text-dark-75">
                                                                    {dayDMY(pdf.created_at)} - {this.getEsquema(pdf.name)}
                                                                </div>
                                                            </div>
                                                            <div className="w-30 align-self-center">
                                                                <span className="font-weight-light font-size-sm text-dark-75">{setMoneyText(23434)}</span>
                                                            </div>
                                                        </div>
                                                        <div className="align-self-center d-flex w-30">
                                                            <div className="w-100 d-flex justify-content-end">
                                                                <div className="align-self-center w-50 text-center">
                                                                    {this.labelStatus(pdf)}
                                                                </div>
                                                                <div className="min-w-fit-content text-right">
                                                                    <OverlayTrigger rootClose overlay={ <Tooltip><span className='font-weight-bolder'>VER PDF</span></Tooltip>}>
                                                                        <a rel="noopener noreferrer" href={pdf.url} target="_blank"
                                                                            className={`btn btn-icon ${pdf.isActive ?
                                                                                'btn-color-primary2'
                                                                                : ''}  btn-active-light-primary2 w-30px h-30px mr-2`}>
                                                                            <i className="las la-file-pdf icon-xl mt-1"></i>
                                                                        </a>
                                                                    </OverlayTrigger>
                                                                    {
                                                                        pdf.pivot.fecha_envio === null?
                                                                        <OverlayTrigger rootClose overlay={ <Tooltip> <span className='font-weight-bolder'>ENVIAR A CLIENTE</span> </Tooltip>}>
                                                                            <span onClick = { (e) => { e.preventDefault(); sendPresupuesto(pdf); } }
                                                                                className={`btn btn-icon ${pdf.isActive ?
                                                                                    'btn-color-info2'
                                                                                    : ''}  btn-active-light-info2 w-30px h-30px`}>
                                                                                <i className="las la-envelope icon-xl"></i>
                                                                            </span>
                                                                        </OverlayTrigger>
                                                                        :
                                                                        <OverlayTrigger rootClose overlay={ <Tooltip><span className='font-weight-bolder'>CONTRATAR</span></Tooltip>}>
                                                                            <span onClick={() => { changePageContratar(pdf)}}
                                                                                className={`btn btn-icon ${pdf.isActive ?
                                                                                    'btn-color-success2'
                                                                                    : ''}  btn-active-light-success2 w-30px h-30px`}>
                                                                                <i className="las la-file-signature icon-xl mt-1"></i>
                                                                            </span>
                                                                        </OverlayTrigger>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card.Title>
                                            </Card.Header>
                                            <Card.Body className={`card-body px-10 ${pdf.isActive ? 'collapse show' : 'collapse'}`}>
                                                {
                                                    pdf.pivot.fecha_envio !== null?
                                                        <div className="mx-auto w-max-content text-justify mb-5 col-md-10 mt-5">
                                                            <span className="font-weight-light"><span className="font-weight-bolder"><u>Fecha de envio:</u> </span>{dayDMY(pdf.pivot.fecha_envio)}</span>
                                                        </div>
                                                    :<></>
                                                }
                                                <Col md={10} className="mx-auto text-center mt-5">
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
            </>
        )
    }
}

export default HistorialCotizacionesDiseño