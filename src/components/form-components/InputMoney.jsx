import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import NumberFormat from 'react-number-format'

class InputMoney extends Component{

    /* constructor(props){
        super(props)
    } */

    onChange = values => {
        const { onChange, name } = this.props
        onChange({target:{value:values.value, name:name}})
    }

    render(){
        const { error, onChange, placeholder, value  } = this.props
        return(
            <div>
                <Form.Label className="mt-2 mb-1 label-form">
                    {placeholder}
                </Form.Label><br />
                <NumberFormat value = { value } displayType = { 'input' } thousandSeparator = { true } prefix = { '$' } className="form-control w-100"
                    renderText = { value => <div> { value } </div> } onValueChange = { (values) => this.onChange(values) } />
            </div>
        )
    }
}

export default InputMoney