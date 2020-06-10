import React, { Component } from 'react'
import SelectSearch from 'react-select-search'
import Input from './Input'

import '../../styles/select_custom.css';
class SelectSearchForm extends Component{

    render(){
        
        const { name, onChange, options,  placeholder, value  } = this.props 
        
        return(
            <div>
                { 
                    options.length > 0 ?
                        <>
                            <label className="col-form-label">{placeholder}</label>

                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                    <i className="far fa-calendar-check kt-font-boldest text-success"></i>
                                    </span>
                                </div>

                                <div className="dropdown bootstrap-select form-control">																	

                                    <SelectSearch 
                                        search
                                        {...this.props}
                                        />
                                </div>    
                            </div>
                                
                        </>
                    :
                    <Input readOnly type="text" { ...this.props }/>
                }
                
            </div>
            
        )
    }

}

export default SelectSearchForm