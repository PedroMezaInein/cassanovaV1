import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

import '../../styles/select_custom.css';
 
class Select extends Component{
    /* constructor(props){
        super(props)
    } */ 

    state = {
        selectValido: !this.props.requirevalidation
    }

    validarSelect(e){
        const { value } = e.target
        const {requirevalidation}= this.props
        if(requirevalidation){
            if(value > 0){
                this.setState({
                    selectValido: true
                })
            }else{
                this.setState({
                    selectValido: false     
                    
                })
            }
        }else{
            this.setState({
                selectValido: true     
                
            })
        }
    }
    componentDidUpdate(nextProps){
        if(nextProps.formeditado !== this.props.formeditado)
            this.setState({
                ... this.state,
                selectValido: true
            })
    }

    render(){
        const { options, placeholder, value, name, onChange, iconclass, messageinc, ...props } = this.props
        const { selectValido } = this.state 
        return(
            <>
                <Form.Label className="col-form-label">{ placeholder }</Form.Label>
                
                
                <div className="input-icon">       
                        <span className="input-icon input-icon-right">
                            <span>
                                <i className={iconclass+" kt-font-boldest text-primary"}></i>
                            </span>
                        </span>  
                    <Form.Control 
                        className={ selectValido ? " form-control is-valid " : " form-control is-invalid" }
                        onChange={ (e) => { e.preventDefault(); this.validarSelect(e); onChange(e) }} 
                        name={ name } 
                        value={ value } 
                        as="select" {... props}>
                        <option value={0} disabled>
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
                </div> 
                <span className={ selectValido ? "form-text text-danger hidden" : "form-text text-danger" }> {messageinc} </span>
            </>
        )
    }
}
export default Select



