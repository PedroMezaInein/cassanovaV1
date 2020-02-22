import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

class Select extends Component{
    constructor(props){
        super(props)
    }

    render(){
        const { options, placeholder, value, name, onChange } = this.props
        return(
            <>
                <Form.Label>
                    { placeholder }     
                </Form.Label>
                <Form.Control onChange={ onChange } name={ name } value={ value } as="select">
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