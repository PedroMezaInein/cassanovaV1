import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

class Select extends Component{
    /* constructor(props){
        super(props)
    } */

    render(){
        const { options, placeholder, value, name, onChange } = this.props
        return(
            <>
                <Form.Label className="mt-2 mb-1 label-form">
                    { placeholder }     
                </Form.Label>
                <Form.Control onChange={ onChange } name={ name } value={ value } as="select">
                    <option value={0} disabled hidden>
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