import React, { Component } from 'react'
import SelectSearch from 'react-select-search'
import InputGray from './InputGray'
import '../../styles/select_custom_gray.css';
class SelectSearchGray extends Component {

    state = {
        requirevalidation: true
    }

    renderFontValue = (valueProps, onChange) => {
        const { requirevalidation } = this.state
        const { customstyle } = this.props

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
            <>
                <div className="input-icon">
                    <span className="input-icon input-icon-right">
                        <i className={"flaticon2-search-1 m-0 kt-font-boldest text-primary"}></i>
                    </span>
                    <input
                        className={validado ? " form-control is-valid text-uppercase" : " form-control is-invalid text-uppercase"}
                        {...valueProps}
                        style={customstyle}
                    />
                </div>
                <span className={validado ? "form-text text-danger hidden" : "form-text text-danger"}> Selecciona una opción </span>
            </>
        );
    }

    componentDidMount() {

    }

    render() {

        const { options, placeholder, iconclass } = this.props
        return (
            <>
                {
                    options.length > 0 ?
                        <>
                            <label className="col-form-label">{placeholder}</label>
                            <SelectSearch
                                renderValue={this.renderFontValue}
                                search
                                {...this.props}
                            />
                        </>
                        :
                        <InputGray
                            iconclass={iconclass}
                            readOnly
                            type="text"
                            {...this.props} />
                }

            </>

        )
    }

}

export default SelectSearchGray