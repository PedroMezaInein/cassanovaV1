import React, { Component } from 'react'
import { Form } from 'react-bootstrap'

class RadioGroup extends Component {
    render() {
        const { options, placeholder, name, onChange, value } = this.props
        return (
            <div>
                <Form.Label className="col-form-label">{placeholder}</Form.Label>

                <Form.Group>
                    <div className="radio-inline">
                        {
                            options.map((option, key) => {
                                return (
                                    <label className="radio radio-outline radio-outline-2x radio-primary" key={key}>
                                        <input
                                            type='radio'
                                            name={name}
                                            value={option.value}
                                            onChange={onChange}
                                            checked={value === option.value}
                                        />
                                        {option.label}
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

export default RadioGroup