import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"

class SymbolIcon extends Component {
    render() {
        const { tipo, urlIcon } = this.props
        return(
            <div className={`symbol symbol-35 symbol-light-${tipo} mr-4 flex-shrink-0`}>
                <div className="symbol-label">
                    <span className={`svg-icon svg-icon-lg svg-icon-${tipo}`}>
                        <SVG src = { toAbsoluteUrl(urlIcon) } />
                    </span>
                </div>
            </div>
        )
    }
}

export default SymbolIcon