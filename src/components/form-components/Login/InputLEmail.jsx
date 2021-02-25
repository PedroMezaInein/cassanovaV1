import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
class InputLEmail extends Component {
    state = {
        inputValido: !this.props.requirevalidation,
        showPassword: false
    }
    changeInputType = () => {
        this.setState({
            showPassword: !this.state.showPassword
        })
    }
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
    
    componentDidUpdate(nextProps) {
        if (nextProps.value !== this.props.value)
            if (!nextProps.requirevalidation) {
                this.setState({
                    ...this.state,
                    inputValido: true
                })
            } else {
                if (this.props.value !== '') {
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
        const {error, onChange, placeholder, letterCase, customstyle, customclass, ...props } = this.props
        const { inputValido } =  this.state
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
            <>
            <div className="form-group mb-5 fv-plugins-icon-container">
                <Form.Control
                    placeholder = { placeholder }
                    style = { customstyle }
                    autoComplete="off"
                    className = {`form-control h-auto form-control-solid text-dark-50 font-weight-bold py-4 px-8 mb-4 ${customclass}` }
                    onChange = { (e) => { e.preventDefault(); this.validarInput(e); onChange(toInputUppercase(e)) }} {...props}
                />
                {
                    error.email !== '' &&
                    <span className={ inputValido ? "text-muted font-size-sm hidden" : "text-muted font-size-sm is-invalid" }> {error.email} </span>
                }
            </div>
            </>
        )
    }
}
export default InputLEmail
