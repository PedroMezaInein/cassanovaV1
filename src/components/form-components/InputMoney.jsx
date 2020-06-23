import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import NumberFormat from 'react-number-format'

let textoValido =false;
class InputMoney extends Component{

    state = {
        inputMoneyValido: false
    }

    validarInputMoney(e){
        const { value } = e.target   
        if(value > 0){
            this.setState({
                inputMoneyValido: true
            })
        }else{
            this.setState({
                inputMoneyValido: false     
                
            })
        }
    }

    onChange = values => {
        const { onChange, name} = this.props
        this.validarInputMoney({target:{value:values.value, name:name}})
        onChange({target:{value:values.value, name:name}})

    }
    render(){
        const { error, onChange, placeholder, value, prefix, thousandSeparator,iconclass } = this.props
        const { inputMoneyValido } = this.state

        return(
            <div>
                <Form.Label className="col-form-label">
                    {placeholder}
                </Form.Label><br />
                
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className={iconclass+" kt-font-boldest text-primary"}></i>
                        </span>
                    </div>
                    <NumberFormat
                        value = { value } 
                        displayType = { 'input' } 
                        thousandSeparator = { thousandSeparator ? thousandSeparator : false } 
                        prefix = { prefix }
                        //prefix={'$'} 
                        className={ inputMoneyValido ? " form-control is-valid " : " form-control is-invalid" }
                        renderText = { value => <div> { value } </div> } 
                        onValueChange = { (values) => this.onChange(values)}
                        placeholder = {placeholder} /> 
                    <div className="invalid-feedback msgValidation">Incorrecto, introduce la cantidad.</div>
                </div>
            </div>
        )
    }
}
export default InputMoney