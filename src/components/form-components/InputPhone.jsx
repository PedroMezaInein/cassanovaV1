import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import NumberFormat from 'react-number-format'

class InputPhone extends Component {

    state = {
        inputPhone: !this.props.requirevalidation
    }

    validarPhone(e){
        const { value } = e.target
        const {patterns, requirevalidation}= this.props
        var expRegular = new RegExp(patterns);  
        if(requirevalidation){
            if(value > 0 && expRegular.test(value)){
                this.setState({
                    inputPhone: true
                })
            }else{
                this.setState({
                    inputPhone: false     
                    
                })
            }
        }else{
            this.setState({
                inputPhone: true     
                
            })
        }
    }

    componentDidUpdate(nextProps){
        if(nextProps.formeditado !== this.props.formeditado)
            if(!nextProps.requirevalidation)
            {
                this.setState({
                    ... this.state,
                    inputPhone: true
                })
            }else{
                this.validarPhone({ target: { value: nextProps.value } })
            }
            
    }

    onChange = values => {
        const { onChange, name} = this.props
        this.validarPhone({target:{value:values.value, name:name}})
        onChange({target:{value:values.value, name:name}})
        
    }


    render() {
        const { error, onChange, placeholder, iconclass, messageinc, value, thousandSeparator,  ...props } = this.props 
        const { inputPhone } = this.state
        
        return (
            <div >
                <label className="col-form-label">{placeholder}</label>
                    <div className="input-icon">       
                        <span className="input-icon input-icon-right">
                            <i className={iconclass+" m-0 kt-font-boldest text-primary"}></i> 
                        </span>                 
                        <NumberFormat 
                            value = { value } 
                            displayType = { 'input' } 
                            thousandSeparator = { thousandSeparator ? thousandSeparator : false } 
                            renderText = { value => <div> { value } </div> } 
                            onValueChange = { (values) => this.onChange(values)}                            
                            
                            format="+52 1 (##) #### - ####" 
                            allowEmptyFormatting 
                            mask="_"
                            placeholder={placeholder} 
                            className={ inputPhone ? " form-control is-valid " : " form-control is-invalid" }
                            //onChange={(e) => { e.preventDefault(); this.validarPhone(e); onChange(e) }} 
                            {...props} 
                        /> 
                    </div>
                    <span className={ inputPhone ? "form-text text-danger hidden" : "form-text text-danger" }> {messageinc} </span>
            </div>
        )
    }
}
export default InputPhone