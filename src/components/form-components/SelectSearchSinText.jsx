import React, { Component } from 'react'
import SelectSearch from 'react-select-search'
import Input from './Input'
import '../../styles/select_custom.css';

class SelectSearchSinText extends Component {

    state = {
        requirevalidation: true
    }

    renderFontValue = (valueProps, onChange) => {
        const { requirevalidation } = this.state
        const { customstyle, placeholder } = this.props
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
                className={validado ? " form-control form-control-sm is-valid text-uppercase" : " form-control form-control-sm is-invalid text-uppercase"}
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
                        <Input
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