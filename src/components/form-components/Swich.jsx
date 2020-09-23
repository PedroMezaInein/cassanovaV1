import React, {Component} from 'react'
import { Form } from 'react-bootstrap'

class RadioGroup extends Component{
    constructor(props){
        super(props)
    }
    state = {
        switch1: true,
    }
    handleSwitchChange = nr => () => {
        let switchNumber = `switch${nr}`;
        this.setState({
        [switchNumber]: !this.state[switchNumber]
        });
    }

    render(){
        const { options, placeholder, name, onChange, value } = this.props
        return(
            <div>
                <Form.Label className="col-3 col-form-label"> {placeholder}</Form.Label>
                
                <Form.Group className="radio-group d-flex mb-0">
                    {
                        options.map((option, key) => {
                            return( 
                                    <span class="switch switch-outline switch-icon switch-primary">
                                        <Form.Check 
                                            key={key}
                                            type={'switch'}
                                            label={option.label}
                                            name={name}
                                            value={option.value}
                                            onChange={onChange}
                                            checked={ value === option.value }
                                            />
                                    </span>
                            )
                        })
                    }
                </Form.Group>
            </div>
        )
    }
}

export default RadioGroup