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
                    <div class="col-12">
                        <div class="checkbox-list">
                        {
                            
                            options.map((option, key) => {
                                return(  
                                        <label className="checkbox checkbox-square checkbox-primary">
                                            <input
                                            key = {key}
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
                    </div>
                </Form.Group>
            </div>
        )
    }
}

export default Input

