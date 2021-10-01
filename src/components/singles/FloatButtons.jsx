import React, { Component } from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

class FloatButtons extends Component {
    render() {
        const { save, recover, formulario, url, exportar, descargar} = this.props

        return (
            <ul className="sticky-toolbar nav flex-column pl-2 pr-2 pt-3 pb-2 mt-4">
                <OverlayTrigger rootClose placement="left" overlay={<Tooltip><span className="font-weight-bold">GUARDAR RESUPUESTO</span></Tooltip>}>
                    <li className="nav-item mb-2" data-placement="right">
                        <span className="btn btn-sm btn-icon btn-light-primary" onClick={save}>
                            <i className="las la-save icon-xl"></i>
                        </span>
                    </li>
                </OverlayTrigger>
                <OverlayTrigger rootClose placement="left" overlay={<Tooltip><span className="font-weight-bold">GUARDAR TEMPORALMENTE PRESUPUESTO</span></Tooltip>}>
                    <li className="nav-item mb-2" data-placement="right">
                        <span className="btn btn-sm btn-icon btn-bg-light btn-text-success btn-hover-success" onClick={save}>
                            <i className="las la-clock icon-xl"></i>
                        </span>
                    </li>
                </OverlayTrigger>
                {
                    url === formulario.page ?
                        Object.keys(formulario.form).length > 0 ?
                            <OverlayTrigger rootClose placement="left" overlay={<Tooltip><span className="font-weight-bold">RECUPERAR DATOS TEMPORALES</span></Tooltip>}>
                                <li className="nav-item mb-2" title="" data-placement="left">
                                    <span className="btn btn-sm btn-icon btn-bg-light btn-text-info btn-hover-info" onClick={recover}>
                                        <i className="las la-list-alt icon-xl"></i>
                                    </span>
                                </li>
                            </OverlayTrigger>
                            : <></>
                        : <></>
                }
                {
                    exportar ? 
                        <OverlayTrigger rootClose overlay={<Tooltip>DESCARGAR</Tooltip>}>
                            <li className="nav-item mb-2" data-placement="left">
                                <span className="btn btn-sm btn-icon btn-bg-light btn-text-warning btn-hover-warning" onClick={descargar}>
                                    <i className="las la-file-download"></i>
                                </span>
                            </li>
                        </OverlayTrigger>
                    : <></>
                }
            </ul>
        )
    }
}
export default FloatButtons