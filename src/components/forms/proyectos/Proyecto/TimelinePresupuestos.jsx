import React, { Component } from 'react'
import SVG from 'react-inlinesvg'
import { Col } from 'react-bootstrap'
import { toAbsoluteUrl } from '../../../../functions/routers'
import { setDateTableLG, setMoneyText } from '../../../../functions/setters'
export default class TimelinePresupuestos extends Component {
    
    typeSymbol(pdf) {
        if (pdf.pivot.motivo_cancelacion !== null) {
            return (
                <span className="svg-icon svg-icon-danger svg-icon-lg">
                    <SVG src={toAbsoluteUrl('/images/svg/Deleted-file.svg')} />
                </span>
            )
        } else if (pdf.pivot.url) {
            return (
                <span className="svg-icon svg-icon-success svg-icon-lg">
                    <SVG src={toAbsoluteUrl('/images/svg/File-done.svg')} />
                </span>
            )
        } else {
            return (
                <span className="svg-icon svg-icon-primary svg-icon-lg">
                    <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                </span>
            )
        }
    }
    
    acceptPptoAddOrden = (pdf) => {
        const { onClickOrden, changeStatus } = this.props
        if(changeStatus){
            if (pdf.pivot.enviado) {
                if (pdf.pivot.motivo_cancelacion === null) {
                    if (pdf.pivot.url === null) {
                        // ACEPTAR PRESUPUESTO Y AGREGAR ORDEN DE COMPRA
                        return (
                            <div className="d-flex align-items-center bg-light-primary2 rounded p-1 cursor-pointer" onClick={(e) => { e.preventDefault(); onClickOrden('add-orden', pdf); }} >
                                <span className="svg-icon svg-icon-primary2 mr-1">
                                    <span className="svg-icon svg-icon-md">
                                        <SVG src={toAbsoluteUrl('/images/svg/Question-circle.svg')} />
                                    </span>
                                </span>
                                <div className="d-flex font-weight-bolder text-primary2 font-size-sm">
                                    Estatus presupuesto
                                </div>
                            </div>
                        )
                    }
                }
            }

        }
    }
    
    hasMontos = () => {
        const { presupuesto } = this.props
        let flag = false
        presupuesto.pdfs.forEach((pdf) => {
            if (pdf.pivot.hasOwnProperty('monto'))
                flag = true
        })
        return flag
    }

    pdfPresupuesto = ( pdf ) => {
        return (
            <div className="d-flex align-items-center border border-dashed border-gray-300 rounded p-3 w-fit-content bg-hover-light border-hover-light">
                <div className="d-flex flex-aligns-center align-items-center">
                    <span className="svg-icon svg-icon-2x">
                        <SVG src={toAbsoluteUrl('/images/svg/Files/PDF.svg')} />
                    </span>
                    <div className="ml-2">
                        <u><a rel="noopener noreferrer" target="_blank" href={pdf.url} className="font-size-sm text-hover-primary font-weight-bolder text-dark-75">{pdf.name}</a></u>
                    </div>
                </div>
            </div>
        )
    }
    pdfOrdenCompra = ( pdf ) => {
        if(pdf.pivot.url !== null){
            return (
                <div className="d-flex align-items-center border border-dashed border-gray-300 rounded p-3 w-fit-content bg-hover-light border-hover-light ml-5">
                    <div className="d-flex flex-aligns-center align-items-center">
                        <span className="svg-icon svg-icon-2x">
                            <SVG src={toAbsoluteUrl('/images/svg/Files/PDF.svg')} />
                        </span>
                        <div className="ml-2">
                            <u><a rel="noopener noreferrer" target="_blank" href={pdf.pivot.url} className="font-size-sm text-hover-primary font-weight-bolder text-dark-75">ORDEN DE COMPRA.PDF</a></u>
                        </div>
                    </div>
                </div>
            )
        }
    }
    render() {
        const { presupuesto } = this.props
        return (
            <Col md={10} className="mb-5 mx-auto d-flex justify-content-center">
                <div className="timeline mt-9">
                    {
                        presupuesto ?
                            presupuesto.pdfs.map((pdf, index) => {
                                return (
                                    <div className="timeline-item-dashed" key={index}>
                                        <div className="timeline-line-dashed w-40px"></div>
                                        <div className="timeline-icon-dashed symbol symbol-30 symbol-lg-40 symbol-circle">
                                            <div className="symbol-label bg-light">
                                                {this.typeSymbol(pdf)}
                                            </div>
                                        </div>
                                        <div className={`timeline-content-dashed mt-n1 ${index === presupuesto.pdfs.length - 1 ? 'mb-0' : 'mb-15'}`}>
                                            <div className="mb-5 pt-3">
                                                <div className="font-size-h6 font-weight-bold text-dark-75 d-flex justify-content-between">
                                                    <div className="align-self-center">Identificador {pdf.pivot.identificador}</div>
                                                    {this.acceptPptoAddOrden(pdf)}
                                                </div>
                                                <span className="text-dark-75 font-weight-bolder d-block my-3">
                                                    FECHA: <span className="text-dark-75 font-weight-normal font-size-sm">{setDateTableLG(pdf.created_at)}</span>
                                                    {this.hasMontos() ? <span className="ml-3">MONTO: <span className="text-dark-75 font-weight-normal font-size-sm">{setMoneyText(pdf.pivot.monto)}</span></span> : <></>}
                                                    <span className={`ml-3 ${pdf.pivot.enviado ? 'text-success' : 'text-red'}`}>PRESUPUESTO {pdf.pivot.enviado ? 'Enviado' : 'No enviado'}</span>
                                                </span>
                                                {
                                                    pdf.pivot.motivo_cancelacion !== null ?
                                                        <div className="d-flex align-items-center mt-1">
                                                            <div className="text-muted text-justify">{pdf.pivot.motivo_cancelacion}</div>
                                                        </div>
                                                        : <></>
                                                }
                                            </div>
                                            <div className="mt-8">
                                                <div className="d-flex mt-5 justify-content-between">
                                                    {this.pdfPresupuesto(pdf)}
                                                    {this.pdfOrdenCompra(pdf)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            : <></>
                    }
                </div>
            </Col>
        );
    }
}