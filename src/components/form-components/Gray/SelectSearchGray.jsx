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
        const { customstyle, customclass, messageinc, customdiv, withicon, iconvalid, iconclass, disabled } = this.props
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
                <div className={`form-group ${customdiv}`}>
                    <div className="input-group input-group-solid rounded-0">
                        {
                            withicon?
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className = {`${iconclass ? iconclass : 'flaticon2-search-1'} icon-md text-dark-50`}></i>
                                </span>
                            </div>
                            :''
                        }
                        <input
                            className={`${customclass} form-control text-dark-50 font-weight-bold text-uppercase ${validado ? 'is-valid sin_icono' : `is-invalid ${iconvalid?'':'sin_icono'}`}`}
                            {...valueProps}
                            style={customstyle}
                            disabled={disabled}
                        />
                    </div>
                    {
                        iconvalid? '': <span className={validado ? "form-text text-danger hidden" : "form-text text-danger is-invalid text-left"}> {messageinc} </span>
                    }
                </div>
            </>
        );
    }
    
    render() {
        const { options, placeholder, iconclass, customlabel, withtaglabel, withtextlabel} = this.props
        return (
            <>
                {
                    options.length >= 0 ?
                        <>
                            {   withtaglabel ?
                                    <label className = { `col-form-label font-weight-bold text-dark-60  ${customlabel}` } >
                                        { withtextlabel ? placeholder : '' }
                                    </label>
                                : ''
                            }
                            <SelectSearch renderValue={this.renderFontValue} search {...this.props} />
                        </>
                    : <InputGray withtaglabel = { 1 } withformgroup = { 1 } withtextlabel = { 1 } withplaceholder = { 1 }
                            withicon = { 1 } iconclass = { iconclass } readOnly type = "text" {...this.props} />
                }
            </>
        )
    }
}

export default SelectSearchGray