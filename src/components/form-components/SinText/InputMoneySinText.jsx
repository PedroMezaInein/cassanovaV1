import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
class InputMoneySinText extends Component {
    state = {
        inputMoneyValido: !this.props.requirevalidation
    }
    validarInputMoney(e) {
        const { value } = e.target
        const { requirevalidation } = this.props
        const { inputMoneyValido } = this.state
        let inputValido = false
        if (value !== '' && value !== null && value !== undefined) {
            if (requirevalidation) {
                if (value >= 0) {
                    inputValido = true
                } else {
                    inputValido = false
                }
            } else {
                inputValido = true
            }
        } else {
            if (requirevalidation) {
                inputValido = false
            } else {
                inputValido = true
            }
        }
        if (inputValido !== inputMoneyValido)
            this.setState({
                ...this.state,
                inputMoneyValido: inputValido
            })
    }
    componentDidUpdate(nextProps) {
        if (nextProps.value !== this.props.value) {
            if (!nextProps.requirevalidation) {
                this.setState({
                    ...this.state,
                    inputMoneyValido: true
                })
            } else {
                if (this.props.value !== '') {
                    this.validarInputMoney({ target: { value: this.props.value } })
                }
            }
        }
    }
    componentDidMount() {
        const { formeditado, value } = this.props
        if (formeditado) {
            this.validarInputMoney({ target: { value: value } })
        }
    }
    onChange = values => {
        const { onChange, name } = this.props
        this.validarInputMoney({ target: { value: values.value, name: name } })
        onChange({ target: { value: values.value, name: name } })
    }
    render() {
        const { placeholder, value, prefix, thousandseparator, customstyle, identificador, customclass, disabled } = this.props
        const { inputMoneyValido } = this.state
        return (
            <NumberFormat
                id={identificador}
                value={value}
                displayType={'input'}
                thousandSeparator={thousandseparator ? thousandseparator : false}
                prefix={prefix}
                className={inputMoneyValido ? `form-control form-control-sm is-valid sin_icono text-uppercase ${customclass}` : `form-control form-control-sm is-invalid sin_icono text-uppercase ${customclass}`}
                renderText={value => <div> {value} </div>}
                onValueChange={(values) => this.onChange(values)}
                placeholder={placeholder}
                style={customstyle}
                disabled={disabled}
            />
        )
    }
}
export default InputMoneySinText