import React, { Component } from 'react';
import Select from 'react-select';
class TagSelectSearch extends Component {
    render() {
        const { options, placeholder, onChange, defaultvalue, iconclass } = this.props
        return (
            <div>
                <label className="col-form-label">{placeholder}</label>
                <div className="input-icon">
                    <span className="input-icon input-icon-right">
                        <i className={iconclass + " m-0 kt-font-boldest text-primary"} style={{zIndex:'2'}}></i>
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

export default TagSelectSearch 