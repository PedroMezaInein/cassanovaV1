import React, { Component } from 'react'
import SelectSearch from 'react-select-search'
import Input from './Input'

class SelectSearchForm extends Component{

    render(){
        
        const { placeholder, options } = this.props
        return(
            <div>
                { 
                    options.length > 0 ?
                        <>
                            <label className="mt-2 mb-1 label-form">
                                {placeholder}
                            </label>
                            <SelectSearch 
                                className="select-search"
                                search
                                { ... this.props} />
                        </>
                    :
                    <Input readOnly type="text" { ...this.props }/>
                }
                
            </div>
            
        )
    }

}

export default SelectSearchForm