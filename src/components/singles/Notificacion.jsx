import React, { Component } from 'react';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"

class Notificacion extends Component {
    render() {
        const { data } = this.props
        return (
            <div>
                <span className="svg-icon svg-icon-lg svg-icon-success mr-3">
                    <SVG src={toAbsoluteUrl('/images/svg/portapapeles.svg')} />
                </span>
                <span>
                    {
                        data.texto
                    }
                </span>
            </div>
        );
    }
}

export default Notificacion;