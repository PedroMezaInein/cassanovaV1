import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

class Input extends Component {

    state = {
        inputValido: !this.props.requirevalidation
    }  

    validarInput(e){         
        const { value } = e.target 
        const {patterns, requirevalidation}= this.props
        if(requirevalidation){
            var expRegular = new RegExp(patterns);       
                if(expRegular.test(value)){
                    this.setState({
                        inputValido: true
                    })
                }else{
                    this.setState({
                        inputValido: false     
                        
                    })
                } 
        }else{
            this.setState({
                inputValido: true     
                
            })
        }
    }

    componentDidUpdate(nextProps){
        if(nextProps.formeditado !== this.props.formeditado)
            if(!nextProps.requirevalidation)
            {
                this.setState({
                    ... this.state,
                    inputValido: true
                })
            }else{
                this.validarInput({ target: { value: nextProps.value } })
            }
            
    }
    
    render() {
        const { error, onChange, placeholder, iconclass, messageinc, ...props } = this.props 
        const { inputValido } =  this.state  
        
      //  let  inputValido   = this.props.value!==""? true : this.state.inputValido 
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
                            onChange={(e) => { e.preventDefault(); this.validarInput(e); onChange(e) }}  
                            {...props} 
                        /> 
                    </div>
                    <span className={ inputValido ? "form-text text-danger hidden" : "form-text text-danger" }> {messageinc} </span>
            </div>
        )
    }
}
export default Input
