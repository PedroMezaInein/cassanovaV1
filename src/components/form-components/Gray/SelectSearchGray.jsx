import React, { Component } from 'react'
import SelectSearch from 'react-select-search'
import InputGray from './InputGray'
import '../../../styles/select_custom_gray.css';
class SelectSearchGray extends Component {
    state = {
        requirevalidation: true
    }
    renderFontValue = (valueProps, onChange) => {
        const { requirevalidation } = this.state
        const { customstyle, customclass, messageinc} = this.props

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
                <div className="form-group">
                    <div className="input-group input-group-solid rounded-0">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <i className={"flaticon2-search-1 icon-md text-dark-50"}></i>
                            </span>
                        </div>
                        <input
                            className={`form-control text-dark-50 font-weight-bold text-uppercase ${customclass}`}
                            {...valueProps}
                            style={customstyle}
                        />
                    </div>
                    <span className={validado ? "form-text text-danger hidden" : "form-text text-danger is-invalid"}> {messageinc} </span>
                </div>
            </>
        );
    }
    componentDidMount() {
    }
    render() {
        const { options, placeholder, iconclass, customlabel } = this.props
        return (
            <>
                {
                    options.length > 0 ?
                        <>
                            <label className={`col-form-label font-weight-bold text-dark-60  ${customlabel}`}>{placeholder}</label>
                            <SelectSearch
                                renderValue={this.renderFontValue}
                                search
                                {...this.props}
                            />
                        </>
                        :
                        <InputGray
                            withtaglabel={1}
                            withtextlabel={1}
                            withplaceholder={1}
                            withicon={1}
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