import React, { Component } from 'react'
import SelectSearch from 'react-select-search'

class SelectSearchForm extends Component{

    render(){
        
        const { placeholder } = this.props
        return(
            <div>
                <label className="mt-2 mb-1 label-form">
                    {placeholder}
                </label>
                <SelectSearch 
                    className="select-search"
                    search
                    { ... this.props} />
            </div>
            
        )
    }

}

export default SelectSearchForm