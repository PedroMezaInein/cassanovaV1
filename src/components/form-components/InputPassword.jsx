import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

class InputPassword extends Component {

    state = { inputValido: !this.props.requirevalidation, showPassword: false }  

    validarInput(e) {
        const { value } = e.target 
        const {patterns, requirevalidation}= this.props
        if(value !== '' && value !== null && value !== undefined){
            if(requirevalidation){
                var expRegular = new RegExp(patterns);
                if(expRegular.test(value))
                    this.setState({ inputValido: true })
                else
                    this.setState({ inputValido: false })
            }else
                this.setState({ inputValido: true })
        }else{
            if(requirevalidation)
                this.setState({ inputValido: false })
            else
                this.setState({ inputValido: true })
        }
    }

    componentDidUpdate(nextProps){
        if(nextProps.value !== this.props.value)
            if(!nextProps.requirevalidation) {
                this.setState({
                    ...this.state,
                    inputValido: true
                })
            }else{
                if(this.props.value !== '') {
                    this.validarInput({ target: { value: this.props.value } })
                }
            }
    }
    
    componentDidMount(){
        const { formeditado, value } = this.props
        if(formeditado){
            this.validarInput({ target: { value: value } })
        }
    }

    render() {
        const { error, onChange, placeholder, iconclass, messageinc, letterCase,customlabel,spellcheck, customicon, ...props } = this.props 
        const { inputValido, showPassword } =  this.state  
        
        const toInputUppercase = e => {
            const { type, value, selectionStart, selectionEnd } = e.target
            if(letterCase !== false)
                e.target.value = value.toUpperCase()
            if( type !== 'email'){
                e.target.selectionStart = selectionStart
                e.target.selectionEnd = selectionEnd
            }
            return e
        }

        return (
            <div>
                <label className = {`col-form-label ${customlabel}`}>{placeholder}</label>
                <div className="input-icon">
                    <span className = { `input-icon input-icon-right text-hover ${customicon}` } 
                        onClick = { (e) => { e.preventDefault(); this.setState({...this.state, showPassword: !showPassword })} }>
                        {
                            !showPassword ?
                                <i className = "fas fa-eye m-0 kt-font-boldest text-primary"></i>
                            : <i className = "fas fa-eye-slash m-0 kt-font-boldest text-primary"></i>
                        }
                        
                    </span>
                    <Form.Control placeholder={placeholder} type = { showPassword ? 'text' : 'password' }
                        className={ inputValido ? " form-control is-valid sin_icono" : " form-control is-invalid sin_icono" }
                        onChange={(e) => { e.preventDefault(); this.validarInput(e); onChange(toInputUppercase(e)) }} {...props} />
                </div>
                <span className={ inputValido ? "form-text text-danger hidden" : "form-text text-danger is-invalid" }> {messageinc} </span>    
            </div>
        )
    }
}
export default InputPassword
