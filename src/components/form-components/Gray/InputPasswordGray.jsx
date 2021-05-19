import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

class InputPasswordGray extends Component {

    state = {
        inputValido: !this.props.requirevalidation,
        showPassword: false,
        valor: '',
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
        this.setState({...this.state, valor: value})
        if(formeditado){
            this.validarInput({ target: { value: value } })
        }
    }

    render() {
        const { error, onChange, placeholder, iconclass, messageinc, letterCase,customlabel,spellcheck, customicon, withformgroup, customdiv, withtextlabel, withplaceholder, customstyle, withtaglabel, withicon, customclass, swal, value, ...props } = this.props 
        const { inputValido, showPassword, valor } =  this.state  
        
        const toInputUppercase = e => {
            const { type, value, selectionStart, selectionEnd } = e.target
            if(letterCase !== false)
                e.target.value = value.toUpperCase()
            if( type !== 'email'){
                e.target.selectionStart = selectionStart
                e.target.selectionEnd = selectionEnd
            }
            this.setState({...this.state, valor: e.target.value})
            return e
        }

        return (
            <div className={withformgroup?`form-group ${customdiv}`:''}>
                {
                    withtaglabel?
                    <label className={`col-form-label font-weight-bold text-dark-60  ${customlabel}`}>{withtextlabel?placeholder:''}</label>
                    :''
                }
                <div className="input-group input-group-solid rounded-0">
                    {
                        withicon?
                        <div className="input-group-prepend">
                            <span className="input-group-text" onClick = { (e) => { e.preventDefault(); this.setState({...this.state, showPassword: !showPassword })} }>
                                {
                                    !showPassword ?
                                        <i className = "fas fa-eye m-0 icon-lg text-dark-50"></i>
                                    : <i className = "fas fa-eye-slash m-0 icon-lg text-dark-50"></i>
                                }
                            </span>
                        </div>
                        :''
                    }
                    
                    <Form.Control placeholder = { withplaceholder ? placeholder :'' } style = { customstyle } type = { showPassword ? 'text' : 'password' }
                        className = {`form-control text-dark-50 font-weight-bold ${customclass}` }
                        onChange = { (e) => { e.preventDefault(); this.validarInput(e); onChange(toInputUppercase(e)) }}
                        value = { swal === true ? valor : value } {...props} />
                </div>
                <span className={ inputValido ? "form-text text-danger hidden" : "form-text text-danger is-invalid" }> {messageinc} </span>
            </div>
        )
    }
}
export default InputPasswordGray
