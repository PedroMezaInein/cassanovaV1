import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

class Input extends Component{

    render(){
        const { onChange, placeholder, options, customgroup, customlist} = this.props
        return(
            <div>
                <Form.Label className="font-weight-bolder">{placeholder}</Form.Label>

                <Form.Group className={customgroup}> 
                        <div className={`checkbox-list ${customlist}`} >
                        {
                            
                            options.map((option, key) => {
                                return(  
                                        <label key = {key} className="checkbox checkbox-outline checkbox-outline-2x checkbox-primary font-weight-light text-justify pb-2px">
                                            <input 
                                            type="checkbox" 
                                            onChange={ (e) => { onChange(e)} } 
                                            name = { option.id }
                                            checked = { option.checked }
                                            value = { option.checked } 
                                            />{ option.text }
                                            <span></span>
                                        </label>
                                )
                            })
                        }
                        </div> 
                </Form.Group>
            </div>
        )
    }
}

export default Input

