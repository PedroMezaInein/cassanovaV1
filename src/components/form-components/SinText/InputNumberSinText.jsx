import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
class InputNumberSinText extends Component {
    state = {
        inputValido: !this.props.requirevalidation
    }
    validarInput(e) {
        const { value } = e.target
        const { requirevalidation } = this.props
        if (value !== '' && value !== null && value !== undefined) {
            if (requirevalidation) {
                if (value >= 0) {
                    this.setState({
                        inputValido: true
                    })
                } else {
                    this.setState({
                        inputValido: false
                    })
                }
            } else {
                this.setState({
                    inputValido: true
                })
            }
        } else {
            if (requirevalidation) {
                this.setState({
                    inputValido: false
                })
            } else {
                this.setState({
                    inputValido: true
                })
            }
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
        const { error, onChange, placeholder, iconclass, messageinc, identificador, typeformat, customstyle, customclass, thousandseparator, disabled, ...props } = this.props
        const { inputValido } = this.state
        return (
            <div >
                <NumberFormat
                    id={identificador}
                    placeholder={placeholder}
                    className={inputValido ? `form-control form-control-sm is-valid sin_icono text-uppercase ${customclass}` : `form-control form-control-sm is-invalid sin_icono text-uppercase ${customclass}`}
                    onChange={(e) => { e.preventDefault(); this.validarInput(e); onChange(e) }}
                    {...props}
                    format={typeformat}
                    style={customstyle}
                    thousandSeparator={thousandseparator}
                    disabled={disabled}
                />
            </div>
        )
    }
}
export default InputNumberSinText
