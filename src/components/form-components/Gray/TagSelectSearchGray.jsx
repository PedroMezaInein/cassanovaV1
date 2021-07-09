import React, { Component } from 'react';
import Select from 'react-select';
import $ from "jquery";
class TagSelectSearchGray extends Component {
    componentDidMount() {
        $('.css-2b097c-container').attr('id','css-2b097c-container-gray')
    }
    render() {
        const { options, placeholder, onChange, defaultvalue, iconclass, requirevalidation, messageinc, bgcolor } = this.props
        const customStyles = {
            indicatorSeparator: () => ({ 
                backgroundColor:'transparent !important'
            }),
            multiValueLabel: () => ({ 
                color: '#80808F!important',
                padding:'2px .46875em!important',
                fontSize:'13px!important',
                fontWeight: 500
            }),
            multiValue: () => ({ 
                backgroundColor: '#e5e5e8 !important',
                borderRadius:'2px!important',
                color: '#80808F!important',
                margin: '2px 3px!important',
                display:'flex', 
                minWidth:'0',
                boxSizing:'border-box'
            }),
            control: () => ({
                alignItems:'center',
                backgroundColor:`${bgcolor?bgcolor:'#F3F6F9'}` ,
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
                borderColor:'#F3F6F9',
                paddingLeft:'calc(1.5em + 1.3rem + 2px) !important'
            }),
            dropdownIndicator: () => ({ 
                color:'#686871',
                display: 'flex',
                padding: '8px',
                boxSizing:'border-box',
            }),
            clearIndicator: () => ({ 
                color:'#686871',
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
            // option: () => ({
            // }),
        }
        return (
            <div>
                <label className="col-form-label font-weight-bold text-dark-60">{placeholder}</label>
                <div className="input-icon">
                    <span className="input-icon input-icon-right">
                        <i className={iconclass + " m-0 kt-font-boldest text-dark-50"} style={{zIndex:'2'}}></i>
                    </span>
                    <Select
                        isMulti
                        value={defaultvalue}
                        options={options}
                        // noOptionsMessage={placeholder}
                        placeholder={placeholder}
                        onChange={onChange}
                        styles={customStyles}
                        noOptionsMessage={() => "NO HAY MÁS OPCIONES"}
                    />
                </div>
                {
                    requirevalidation?(defaultvalue.length>0?'':<span className={"form-text text-danger is-invalid"}> {messageinc} </span>):''
                }
            </div>
        )
    }
}

export default TagSelectSearchGray 