import React, { Component } from 'react';
import Select from 'react-select';
class ReactSelectSearch extends Component {
    render() {
        const { options, placeholder, onChange, defaultvalue, iconclass, requirevalidation, messageinc} = this.props
        const customStyles = {
            indicatorSeparator: () => ({ 
                backgroundColor:'transparent !important'
            }),
            control: () => ({
                alignItems:'center',
                backgroundColor:'white',
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
                borderColor: '#ECF0F3 !important',
                // paddingLeft:'calc(1.5em + 1.3rem + 2px) !important'
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
            <div>
                <label className="col-form-label font-weight-bold text-dark-60">{placeholder}</label>
                <Select
                    placeholder={placeholder}
                    onChange={onChange}
                    styles={customStyles}
                    defaultValue={defaultvalue}
                    isClearable={true}
                    isSearchable={true}
                    name="color"
                    options={options}
                    noOptionsMessage={() => "NO HAY MÁS OPCIONES"}
                />
                {
                    requirevalidation?(defaultvalue.length>0?'':<span className={"form-text text-danger"}> {messageinc} </span>):''
                }
            </div>
        )
    }
}
export default ReactSelectSearch 