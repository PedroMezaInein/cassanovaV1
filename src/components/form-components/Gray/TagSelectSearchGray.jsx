import React, { Component } from 'react';
import Select from 'react-select';
const $ = require('jquery');

class TagSelectSearchGray extends Component {
    componentDidMount() {
        $('.css-2b097c-container').attr('id','css-2b097c-container-gray')
    }
    render() {
        const { options, placeholder, onChange, defaultvalue, iconclass } = this.props
        return (
            <div>
                <label className="col-form-label">{placeholder}</label>
                <div className="input-icon">
                    <span className="input-icon input-icon-right">
                        <i className={iconclass + " m-0 kt-font-boldest text-dark-50"} style={{zIndex:'2'}}></i>
                    </span>
                    <Select
                        isMulti
                        value={defaultvalue}
                        options={options}
                        noOptionsMessage={placeholder}
                        placeholder={placeholder}
                        onChange={onChange}
                    />
                </div>
            </div>
        )
    }
}

export default TagSelectSearchGray 