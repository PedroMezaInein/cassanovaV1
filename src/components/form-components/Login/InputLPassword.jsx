import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
class InputLPassword extends Component {
    state = {
        inputValido: !this.props.requirevalidation
    }

    validarInput(e) {
        const { value } = e.target
        const { patterns, requirevalidation } = this.props
        if (value !== '' && value !== null && value !== undefined) {
            if (requirevalidation) {
                var expRegular = new RegExp(patterns);
                if (expRegular.test(value))
                    this.setState({ inputValido: true })
                else
                    this.setState({ inputValido: false })
            } else
                this.setState({ inputValido: true })
        } else {
            if (requirevalidation)
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

    componentDidMount() {
        const { formeditado, value } = this.props
        if (formeditado) {
            this.validarInput({ target: { value: value } })
        }
    }

    render() {
        const { messageinc, error, onChange, placeholder, letterCase, customstyle, customclass, ...props } = this.props
        const { name } = this.props
        const { inputValido, showPassword} = this.state
        const toInputUppercase = e => {
            const { type, value, selectionStart, selectionEnd } = e.target
            if (letterCase !== false)
                e.target.value = value.toUpperCase()
            if (type !== 'email') {
                e.target.selectionStart = selectionStart
                e.target.selectionEnd = selectionEnd
            }
            return e
        }
        return (
            <>
                <div className="form-group mb-5 fv-plugins-icon-container">
                    <div className="input-group ">
                        <Form.Control
                            placeholder={placeholder}
                            style={customstyle}
                            className={`form-control h-auto form-control-solid text-dark-50 font-weight-bold py-4 px-8 ${customclass}`}
                            type={showPassword ? 'text' : 'password'}
                            onChange={(e) => { e.preventDefault(); this.validarInput(e); onChange(toInputUppercase(e)) }} {...props}
                        />
                        <div className="input-group-prepend text-hover text-muted " onClick={(e) => { e.preventDefault(); this.setState({ ...this.state, showPassword: !showPassword }) }}>
                            <div className="input-group-text text-muted bg-gray-200 border-0">
                                {
                                    !showPassword ?
                                        <i className="fas fa-eye"></i>
                                        : <i className="fas fa-eye-slash"></i>
                                }
                            </div>
                        </div>
                    </div>
                    {
                        error[name] !== '' &&
                        <span className={ inputValido ? "text-danger font-size-sm hidden" : "text-danger font-size-sm is-invalid" }> {error[name]} </span>
                    }
                </div>
            </>
        )
    }
}
export default InputLPassword
