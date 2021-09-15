import React, { Component } from 'react'
import SelectSearch from 'react-select-search'
import InputGray from './InputGray'
import '../../../styles/select_custom_gray.css';
class SelectSearchGrayTrue extends Component {

    renderFontValue = (valueProps) => {
        const { customstyle, customclass, customdiv, withicon, iconclass, disabled } = this.props
        return (
            <>
                <div className={`form-group ${customdiv}`}>
                    <div className="input-group input-group-solid rounded-0">
                        {
                            withicon ?
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <i className={`${iconclass ? iconclass : 'flaticon2-search-1'} icon-md text-dark-50`}></i>
                                    </span>
                                </div>
                                : ''
                        }
                        <input
                            className={`${customclass} form-control text-dark-50 font-weight-bold text-uppercase`}
                            {...valueProps}
                            style={customstyle}
                            disabled={disabled}
                        />
                    </div>
                </div>
            </>
        );
    }

    render() {
        const { options, placeholder, iconclass, customlabel, withtaglabel, withtextlabel } = this.props
        return (
            <>
                {
                    options.length >= 0 ?
                        <>
                            {withtaglabel ?
                                <label className={`col-form-label font-weight-bold text-dark-60  ${customlabel}`} >
                                    {withtextlabel ? placeholder : ''}
                                </label>
                                : ''
                            }
                            <SelectSearch renderValue={this.renderFontValue} search {...this.props} />
                        </>
                        : <InputGray withtaglabel={1} withformgroup={1} withtextlabel={1} withplaceholder={1}
                            withicon={1} iconclass={iconclass} readOnly type="text" {...this.props} />
                }
            </>
        )
    }
}

export default SelectSearchGrayTrue