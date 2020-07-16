import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

class Input extends Component {

    state = {
        inputValido: !this.props.requirevalidation
    }  

    validarInput(e){         
        const { value } = e.target 
        const {patterns, requirevalidation}= this.props
        if(value !== '' && value !== null && value !== undefined)
        {
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
        }else{
            if(requirevalidation){
                this.setState({
                    inputValido: false
                })
            }else{
                this.setState({
                    inputValido: true
                })
            }
            
        }
    }

    componentDidUpdate(nextProps){
        if(nextProps.value !== this.props.value)
            if(!nextProps.requirevalidation)
            {
                this.setState({
                    ... this.state,
                    inputValido: true
                })
            }else{
                if(this.props.value !== '')
                {
                    this.validarInput({ target: { value: this.props.value } })
                }
            }
            
    }
    
    componentDidMount(){
        const { formeditado, value, name } = this.props
        if(formeditado){
            this.validarInput({ target: { value: value } })
        }
    }

    letterCase = (e) => {
        const { letterCase } = this.state
        if(letterCase === undefined)
            e.target.value = ("" + e.target.value).toUpperCase();
        else{
            if(letterCase === 'Upper')
                e.target.value = ("" + e.target.value).toUpperCase();
            else{ 
                console.log('lower case')
                e.target.value = e.target.value
            }
        }
    }

    render() {
        const { error, onChange, placeholder, iconclass, messageinc, letterCase, ...props } = this.props 
        const { inputValido } =  this.state  
        
        const toInputUppercase = e => {
            if(letterCase === undefined)
                e.target.value = ("" + e.target.value).toUpperCase();
            else{
                if(letterCase === true)
                    e.target.value = ("" + e.target.value).toUpperCase();
            }
        };
        
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
                            className={ inputValido ? " form-control is-valid " : " form-control is-invalid " }
                            onChange={(e) => { e.preventDefault(); this.validarInput(e); onChange(e) }}  
                            onInput={toInputUppercase}
                            /* onInput = { (e) => { this.letterCase(e) }  } */
                            {...props} 
                        /> 
                    </div>
                    <span className={ inputValido ? "form-text text-danger hidden" : "form-text text-danger" }> {messageinc} </span>
            </div>
        )
    }
}
export default Input
