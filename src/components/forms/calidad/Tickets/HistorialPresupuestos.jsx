import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { toAbsoluteUrl } from "../../../../functions/routers"
import { setDateTableLG, setMoneyText } from '../../../../functions/setters';
export default class HistorialPresupuestos extends Component {
    hasMontos = () => {
        const { presupuesto } = this.props
        let flag = false
        presupuesto.pdfs.forEach((pdf) => {
            if(pdf.pivot.hasOwnProperty('monto'))
                flag = true
        })
        return flag
    }
    hasOrdenCompra = () => {
        const { presupuesto } = this.props
        let flag = false
        presupuesto.pdfs.forEach((pdf) => {
            if(pdf.pivot.url)
                flag = true
        })
        return flag
    }
    render() {
        const { presupuesto, actionsEnable, onClick, btnOrden, onClickOrden } = this.props
        return (
            <div className="timeline mt-9">
                {
                    presupuesto ?
                        presupuesto.pdfs.map((pdf, index) => {
                            let flag = this.hasMontos()
                            let flagOrden = this.hasOrdenCompra()
                            return (
                                <div className="timeline-item-dashed" key={index}>
                                    <div className="timeline-line-dashed w-40px"></div>
                                    <div className="timeline-icon-dashed symbol symbol-30 symbol-lg-40 symbol-circle">
                                        <div className="symbol-label bg-light ">
                                            {
                                                pdf.pivot.motivo_cancelacion !== null ?
                                                    <span className="svg-icon svg-icon-danger svg-icon-lg">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Deleted-file.svg')} />
                                                    </span>
                                                    :pdf.pivot.url?
                                                    <span className="svg-icon svg-icon-success svg-icon-lg">
                                                        <SVG src={toAbsoluteUrl('/images/svg/File-done.svg')} />
                                                    </span>
                                                    :
                                                    <span className="svg-icon svg-icon-primary svg-icon-lg">
                                                        <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                                    </span>
                                            }
                                        </div>
                                    </div>
                                    <div className={`timeline-content-dashed mt-n1 ${ index === presupuesto.pdfs.length - 1 ? 'mb-0':'mb-15'}`}>
                                        <div className="mb-5 pr-3">
                                            <div className="font-size-h6 font-weight-bold text-dark-75 d-flex justify-content-between">
                                                <div className="align-self-center">Identificador {pdf.pivot.identificador}</div>
                                                {
                                                    actionsEnable ?
                                                    <OverlayTrigger rootClose overlay={<Tooltip>Enviar al cliente</Tooltip>}>
                                                        <div>
                                                            <span onClick = { (e) => { e.preventDefault(); onClick('send-presupuesto', pdf); } } 
                                                                className="btn btn-default btn-icon btn-sm btn-hover-text-success">
                                                                <span className="svg-icon svg-icon-md svg-icon-primary">
                                                                    <SVG src={toAbsoluteUrl('/images/svg/Sending-mail.svg')} />
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </OverlayTrigger>
                                                    : <></>
                                                }
                                                {
                                                    btnOrden && !flagOrden && pdf.pivot.enviado ?
                                                    <OverlayTrigger rootClose overlay={<Tooltip>Agregar orden de compra</Tooltip>}>
                                                        <div>
                                                            <span onClick = { (e) => { e.preventDefault(); onClickOrden('add-orden', pdf); } } 
                                                                className="btn btn-default btn-icon btn-sm btn-text-primary btn-hover-text-success">
                                                                <i className="las la-cart-plus icon-xl"></i>
                                                            </span>
                                                        </div>
                                                    </OverlayTrigger>
                                                    : <></>
                                                }
                                                {
                                                    btnOrden && flagOrden ?
                                                    <OverlayTrigger rootClose overlay={<Tooltip>Modificar orden de compra</Tooltip>}>
                                                        <div>
                                                            <span onClick = { (e) => { e.preventDefault(); onClickOrden('modify-orden', pdf); } } 
                                                                className="btn btn-default btn-icon btn-sm btn-text-primary btn-hover-text-success">
                                                                <i className="las flaticon-cart icon-lg"></i>
                                                            </span>
                                                        </div>
                                                    </OverlayTrigger>
                                                    : <></>
                                                }
                                            </div>
                                            
                                                    <span className="text-dark-75 font-weight-bolder d-block my-3">
                                                        FECHA: <span className="text-dark-75 font-weight-normal font-size-sm">{setDateTableLG(pdf.created_at)}</span>
                                                        {
                                                            flag ?
                                                                <span className="ml-3">MONTO: <span className="text-dark-75 font-weight-normal font-size-sm">{setMoneyText(pdf.pivot.monto)}</span></span>
                                                            : <></>
                                                        }
                                                        <span className={`ml-3 ${pdf.pivot.enviado?'text-success':'text-red'}`}>PRESUPUESTO {pdf.pivot.enviado?'Enviado':'No enviado'}</span>
                                                    </span>
                                            {
                                                pdf.pivot.motivo_cancelacion !== null ?
                                                    <div className="d-flex align-items-center mt-1">
                                                        <div className="text-muted text-justify">{pdf.pivot.motivo_cancelacion}</div>
                                                    </div>
                                                    : <></>
                                            }
                                        </div>
                                        <div className="d-flex">
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
                                            {
                                                pdf.pivot.url !== null ?
                                                <div className="d-flex align-items-center border border-dashed border-gray-300 rounded p-3 w-fit-content bg-hover-light border-hover-light ml-5">
                                                    <div className="d-flex flex-aligns-center align-items-center">
                                                        <span className="svg-icon svg-icon-2x">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Files/PDF.svg')} />
                                                        </span>
                                                        <div className="ml-2">
                                                            <u><a rel="noopener noreferrer" target="_blank" href={pdf.pivot.url} className="font-size-sm text-hover-primary font-weight-bolder text-dark-75">ORDEN DE COMPRA</a></u>
                                                        </div>
                                                    </div>
                                                </div>
                                                :<></>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        : <></>
                }
            </div>
        );
    }
}