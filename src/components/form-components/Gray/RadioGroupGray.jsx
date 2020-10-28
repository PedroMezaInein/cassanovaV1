import React, { Component } from 'react'
import { Form } from 'react-bootstrap'

class RadioGroupGray extends Component {
    render() {
        const { options, placeholder, name, onChange, value, customlabel} = this.props
        return (
            <div>
                <label className={`col-form-label font-weight-bold text-dark-60  ${customlabel}`}>{placeholder}</label>

                <Form.Group>
                    <div className="radio-inline">
                        {
                            options.map((option, key) => {
                                return (
                                    <label className="radio radio-outline radio-outline-2x radio-dark-60 text-dark-50 font-weight-bold" key={key}>
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

export default RadioGroupGray