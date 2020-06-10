import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import NumberFormat from 'react-number-format'

class InputMoney extends Component{

    /* constructor(props){
        super(props)
    } */

    onChange = values => {
        const { onChange, name} = this.props
        onChange({target:{value:values.value, name:name}})
    }

    render(){
        const { error, onChange, placeholder, value, prefix, thousandSeparator,iconclass,spantext  } = this.props
        return(
            <div>
                <Form.Label className="col-form-label">
                    {placeholder}
                </Form.Label><br />
                
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className={iconclass+" kt-font-boldest text-success"}></i>
                        </span>
                    </div>
                    <NumberFormat value = { value } displayType = { 'input' } thousandSeparator = { thousandSeparator ? thousandSeparator : false } prefix = { prefix } className="form-control w-100"
                    renderText = { value => <div> { value } </div> } onValueChange = { (values) => this.onChange(values) } placeholder = {placeholder} />
                </div>
                <span className="form-text text-muted">Por favor, ingrese su {spantext}</span>
            </div>
        )
    }
}

export default InputMoney