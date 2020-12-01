import React, { Component } from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

class FloatButtons extends Component {
    render() {
        const { save, recover, formulario, url, exportar, descargar} = this.props

        return (
            <ul className="sticky-toolbar nav flex-column pl-2 pr-2 pt-3 pb-2 mt-4">
                <OverlayTrigger overlay={<Tooltip>GUARDAR</Tooltip>}>
                    <li className="nav-item mb-2" data-placement="right">
                        <span className="btn btn-sm btn-icon btn-bg-light btn-text-success btn-hover-success" onClick={save}>
                            <i className="far fa-save"></i>
                        </span>
                    </li>
                </OverlayTrigger>
                {
                    url === formulario.page ?
                        Object.keys(formulario.form).length > 0 ?
                            <OverlayTrigger overlay={<Tooltip>RECUPERAR FORMULARIO</Tooltip>}>
                                <li className="nav-item mb-2" title="" data-placement="left">
                                    <span className="btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary" onClick={recover}>
                                        <i className="flaticon2-list-3"></i>
                                    </span>
                                </li>
                            </OverlayTrigger>
                            : ''

                        : ''
                }
                {
                    exportar ? 
                        <OverlayTrigger overlay={<Tooltip>DESCARGAR</Tooltip>}>
                            <li className="nav-item mb-2" data-placement="left">
                                <span className="btn btn-sm btn-icon btn-bg-light btn-text-info btn-hover-info" onClick={descargar}>
                                    <i className="flaticon-download"></i>
                                </span>
                            </li>
                        </OverlayTrigger>
                    :''
                    
                }
                
            </ul>
        )
    }
}
export default FloatButtons