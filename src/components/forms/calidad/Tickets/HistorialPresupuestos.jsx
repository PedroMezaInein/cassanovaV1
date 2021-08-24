import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../functions/routers"
export default class HistorialPresupuestos extends Component {

    render() {
        const { presupuesto } = this.props
        return (
            <div className="timeline mt-9">
                {
                    presupuesto ?
                        presupuesto.pdfs.map((pdf, index) => {
                            return (
                                <div className="timeline-item-dashed" key={index}>
                                    <div className="timeline-line-dashed w-40px"></div>
                                    <div className="timeline-icon-dashed symbol symbol-30 symbol-lg-40 symbol-circle">
                                        <div className="symbol-label bg-light">
                                            {
                                                pdf.pivot.motivo_cancelacion !== null ?
                                                    <span className="svg-icon svg-icon-danger svg-icon-lg">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Deleted-file.svg')} />
                                                    </span>
                                                    :
                                                    <span className="svg-icon svg-icon-success svg-icon-lg">
                                                        <SVG src={toAbsoluteUrl('/images/svg/File-done.svg')} />
                                                    </span>
                                            }
                                        </div>
                                    </div>
                                    <div className="timeline-content-dashed mb-8 mt-n1">
                                        <div className="mb-5 pr-3">
                                            <div className="font-size-h6 font-weight-bold text-dark-75 mb-2">Presupuesto {pdf.pivot.identificador}</div>
                                            {
                                                pdf.pivot.motivo_cancelacion !== null ?
                                                    <div className="d-flex align-items-center mt-1">
                                                        <div className="text-muted text-justify">{pdf.pivot.motivo_cancelacion}</div>
                                                    </div>
                                                    : <></>
                                            }
                                        </div>
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