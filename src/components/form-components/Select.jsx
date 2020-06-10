import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

import '../../styles/select_custom.css';

class Select extends Component{
    /* constructor(props){
        super(props)
    } */

    render(){
        const { options, placeholder, value, name, onChange, ...props } = this.props
        return(
            <>
                <Form.Label className="col-form-label">{ placeholder }</Form.Label>
                
                <Form.Control onChange={ onChange } name={ name } value={ value } as="select" {... props}>
                    <option value={0} disabled>
                        {placeholder}
                    </option>
                    {
                        options.map((option, key) => {
                            return(
                                <option key={key} value={option.value}>
                                    { option.text }
                                </option>
                            )
                        })
                    }
                </Form.Control>
            </>
        )
    }
}

export default Select