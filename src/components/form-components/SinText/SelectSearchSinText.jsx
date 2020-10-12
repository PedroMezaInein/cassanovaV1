import React, { Component } from 'react'
import SelectSearch from 'react-select-search'
import InputSinText from './InputSinText'
import '../../../styles/select_custom.css';
class SelectSearchSinText extends Component {
    state = {
        requirevalidation: true
    }
    renderFontValue = (valueProps, onChange) => {
        const { requirevalidation } = this.state
        const { customstyle, placeholder, identificador } = this.props
        let validado = false;
        if (requirevalidation) {
            if (onChange === null || onChange.value === null) {
                validado = false;
            } else {
                validado = true;
            }
        } else {
            validado = true
        }
        return (
            <input
                id={identificador}
                className={validado ? " form-control form-control-sm is-valid sin_icono text-uppercase" : " form-control form-control-sm is-invalid sin_icono text-uppercase"}
                {...valueProps}
                style={customstyle}
                placeholder={placeholder}
            />
        )
    }
    render() {
        const { options, iconclass } = this.props
        return (
            <>
                {
                    options.length > 0 ?
                        <SelectSearch
                            renderValue={this.renderFontValue}
                            search
                            {...this.props}
                        />
                        :
                        <InputSinText
                            iconclass={iconclass}
                            readOnly
                            type="text"
                            {...this.props} />
                }
            </>
        )
    }
}

export default SelectSearchSinText