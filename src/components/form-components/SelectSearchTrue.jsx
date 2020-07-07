import React, { Component } from 'react'
import SelectSearch from 'react-select-search'
import Input from './Input'

import '../../styles/select_custom.css';
class SelectSearchTrue extends Component{

    renderFontValue(valueProps,onChange) {  
        let validado=false;
        if(onChange===null || onChange.value===null)
        {
            validado=true;
        }
        else
        {
            validado=false;
        }  
        return (           
            <> 
            <div className="input-icon">       
                <span className="input-icon input-icon-right">
                    <i className={"flaticon2-search-1 m-0 kt-font-boldest text-primary"}></i> 
                </span>  
                
                <input   
                    className={ validado ? " form-control is-valid text-uppercase" : " form-control is-invalid text-uppercase" }   
                    {...valueProps}
                />
            </div>
            <span className={ validado ? "form-text text-danger hidden" : "form-text text-danger" }> Selecciona una opción </span>
            </>               
        );
    } 

    render(){
        
        const { name, onChange, options,  placeholder, value, iconclass} = this.props 
        return(
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
                    <Input 
                    iconclass={iconclass}
                    readOnly 
                    type="text"
                    { ...this.props }/>
                }
                
            </>
            
        )
    }

}

export default SelectSearchTrue