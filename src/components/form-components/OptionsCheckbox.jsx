import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

class Input extends Component{

    /* constructor(props){
        super(props)
    } */

    render(){
        const { error, onChange, placeholder, options  } = this.props
        return(
            <div>
                <Form.Label className="font-weight-bolder">{placeholder}</Form.Label>

                <Form.Group id="formGridCheckbox"> 
                        <div className="checkbox-list pt-2">
                        {
                            
                            options.map((option, key) => {
                                return(  
                                        <label key = {key} className="checkbox checkbox-outline checkbox-outline-2x checkbox-primary">
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

