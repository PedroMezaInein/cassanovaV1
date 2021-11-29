import React, { Component } from 'react';
import Select from 'react-select';
class ReactSelectSearchGray extends Component {

    validateValue = () => {
        const { defaultvalue, messageinc } = this.props
        if (typeof defaultvalue === 'string') {
            return (
                <span className="form-text text-danger is-invalid"> {messageinc} </span>
            )
        } else {
            if (Object.keys(defaultvalue).length) {
                return (
                    <span className="form-text text-danger d-none"> {messageinc} </span>
                )
            } else {
                return (
                    <span className="form-text text-danger is-invalid"> {messageinc} </span>
                )
            }
        }
    }
    
    render() {
        const { options, placeholder, onChange, defaultvalue, name, requirevalidation, iconclass, customdiv} = this.props
        const customStyles = {
            indicatorSeparator: () => ({ 
                backgroundColor:'transparent !important'
            }),
            control: () => ({
                alignItems:'center',
                backgroundColor:'#F3F6F9',
                borderStyle:'solid',
                borderWidth:'1px',
                cursor:'default',
                borderRadius:'2px!important',
                display:'flex',
                flexWrap:'wrap',
                justifyContent:'space-between',
                minHeight:'38px',
                outline:'0 !important',
                position:'relative',
                transition:'all 100ms',
                boxSizing:'border-box',
                borderColor: '#F3F6F9 !important',
                paddingLeft:'calc(1.5em + 1.3rem + 2px) !important'
            }),
            dropdownIndicator: () => ({ 
                color:'#686871 !important',
                display: 'flex',
                padding: '8px',
                boxSizing:'border-box',
            }),
            clearIndicator: () => ({ 
                color:'#686871 !important',
                display: 'flex',
                padding: '8px',
                boxSizing:'border-box'
            }),
            placeholder: () => ({
                color: '#B5B5C3 !important',
                marginLeft: '2px',
                marginRight: '2px',
                position:'absolute',
                boxSizing:'border-box'
            }),
            menu: (provided) => ({
                ...provided,
                top:"95%",
                zIndex: 3 ,
                borderRadius:'0px!important',
                width:"99.5%",
                left:"1px",
            }),
            // option: (provided) => ({
            //     ...provided,
            // }),
            noOptionsMessage: (provided) => ({
                ...provided,
                color:"#464E5F"
            }),
            input: () => ({
                textTransform:'uppercase!important',
                color: '#686871'
            }),
            singleValue: (provided) => ({
                ...provided,
                color:'#686871',
                fontWeight:500
            }),
        }
        return (
            <div className={customdiv}>
                <label className="col-form-label font-weight-bold text-dark-60">{placeholder}</label>
                <div className="input-icon">
                    <span className="input-icon input-icon-right">
                        <i className={iconclass + " m-0 kt-font-boldest text-dark-50"} style={{zIndex:'2'}}></i>
                    </span>
                    <Select
                        placeholder={placeholder}
                        onChange={onChange}
                        styles={customStyles}
                        defaultValue={defaultvalue}
                        isClearable={true}
                        isSearchable={true}
                        name={name}
                        options={options}
                        value = { defaultvalue }
                        noOptionsMessage={() => "NO HAY MÁS OPCIONES"}
                    />
                </div>
                {
                    requirevalidation ?
                        this.validateValue()
                    :   ''
                }
            </div>
        )
    }
}
export default ReactSelectSearchGray 