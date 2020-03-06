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
                <Form.Label className="mt-2 mb-1 label-form">
                    {placeholder}
                </Form.Label>
                <Form.Group id="formGridCheckbox">
                    {
                        options.map((option, key) => {
                            return(
                                <Form.Check 
                                    key = {key}
                                    type = "checkbox" 
                                    label ={ option.text } 
                                    onChange={ (e) => { onChange(e)} } 
                                    name = { option.id }
                                    checked = { option.checked }
                                    value = { option.checked }
                                    className={`${error}`}/>
                            )
                        })
                    }
                </Form.Group>
                {
                    error && 
                        <label className="error-label">
                            {error}
                        </label>
                }
            </div>
        )
    }
}

export default Input