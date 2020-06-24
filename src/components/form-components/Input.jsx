import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

class Input extends Component {

    state = {
        inputValido: false
    }

    validarInput(e){
        const { value } = e.target
        const {pattern}= this.props
        var expRegular = new RegExp(pattern);         
            if(expRegular.test(value)){
                this.setState({
                    inputValido: true
                })
            }else{
                this.setState({
                    inputValido: false     
                    
                })
            } 
    }

    render() {
        const { error, onChange, placeholder, iconclass, messageinc, ...props } = this.props 
        const { inputValido } = this.state
        return (
            <div >
                <label className="col-form-label">{placeholder}</label>
                    <div className="input-icon">       
                        <span className="input-icon input-icon-right">
                            <i className={iconclass+" m-0 kt-font-boldest text-primary"}></i> 
                        </span>                 
                        <Form.Control 
                            placeholder={placeholder} 
                            className={ inputValido ? " form-control is-valid " : " form-control is-invalid" }
                            onChange={(e) => { console.log("onChange");e.preventDefault(); this.validarInput(e); onChange(e) }} 
                            {...props} 
                        /> 
                    </div>
                    <span className={ inputValido ? "form-text text-danger hidden" : "form-text text-danger" }> {messageinc} </span>
            </div>
        )
    }
}
export default Input
