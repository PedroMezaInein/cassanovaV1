import React, { Component } from 'react'
import SelectSearch from 'react-select-search'
import InputGray from './InputGray'
import '../../../styles/select_custom_gray.css';
class SelectSearchGray extends Component {
    state = {
        requirevalidation: true
    }
    renderFontValue = (valueProps, onChange) => {
        const { customstyle, customclass } = this.props
        return (
            <>
                <div className="form-group">
                    <div className="input-group input-group-solid rounded-0">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <i className={"flaticon2-search-1 icon-lg text-dark-50"}></i>
                            </span>
                        </div>
                        <input
                            className={`form-control text-dark-50 font-weight-bold text-uppercase ${customclass}`}
                            {...valueProps}
                            style={customstyle}
                        />
                    </div>
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
                            <label className={`col-form-label ${customlabel}`}>{placeholder}</label>
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