import React, {Component} from 'react'
import { Form } from 'react-bootstrap'

class RadioGroup extends Component{
    constructor(props){
        super(props)
    }

    render(){
        const { options, placeholder, name, onChange, value } = this.props
        return(
            <div>
                <Form.Label className="mt-2 mb-1 label-form">
                        {placeholder}
                </Form.Label>
                <Form.Group className="radio-group d-flex mb-0">
                    
                    {
                        options.map((option, key) => {
                            return(
                                <Form.Check 
                                    key={key}
                                    type={'radio'}
                                    label={option.label}
                                    name={name}
                                    value={option.value}
                                    onChange={onChange}
                                    checked={ value === option.value }
                                    />
                            )
                        })
                    }
                </Form.Group>
            </div>
        )
    }
}

export default RadioGroup