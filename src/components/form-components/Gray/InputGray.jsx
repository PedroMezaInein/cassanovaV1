import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
class InputGray extends Component {
    state = {
        valor: '',
        inputValido: !this.props.requirevalidation
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
        this.setState({...this.state, valor: value})
        if(formeditado){
            this.validarInput({ target: { value: value } })
        }
    }
    
    render() {
        const { messageinc,error, onChange, placeholder, iconclass, letterCase, customlabel, customstyle, customclass, withicon, withtextlabel, withtaglabel, 
                withplaceholder, customdiv, withformgroup, swal, value, iconvalid, inputsolid, ...props } = this.props
        const { inputValido, valor } =  this.state
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
                <div className={`input-group input-group-solid rounded-0 ${inputsolid}`}>
                    {
                        withicon?
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <i className={iconclass + " icon-lg text-dark-50"}></i>
                            </span>
                        </div>
                        :''
                    }
                    
                    <Form.Control placeholder = { withplaceholder ? placeholder :'' } style = { customstyle }
                        className = {`form-control text-dark-50 font-weight-bold text-justify ${customclass} ${inputValido ? 'is-valid sin_icono' : `is-invalid ${iconvalid?'':'sin_icono'}`}`}
                        onChange = { (e) => { e.preventDefault(); this.validarInput(e); onChange(toInputUppercase(e)) }}
                        value = { swal === true ? valor : value } {...props} />
                </div>
                {
                    iconvalid? '': <span className={`${inputValido ? 'form-text text-danger hidden' :'form-text text-danger is-invalid'}`}>{messageinc}</span>
                }
            </div>
        )
    }
}
export default InputGray
