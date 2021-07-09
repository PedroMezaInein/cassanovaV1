import React, { Component } from 'react'
import NumberFormat from 'react-number-format'

class InputNumber extends Component {

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
        const { error, onChange, placeholder, iconclass, messageinc, typeformat, thousandseparator, formgroup, ...props } = this.props
        const { inputValido } = this.state
        return (
            <div className={`${formgroup}`}>
                <label className="col-form-label">{placeholder}</label>
                <div className="input-icon">
                    <span className="input-icon input-icon-right">
                        <i className={iconclass + " m-0 kt-font-boldest text-primary"}></i>
                    </span>
                    <NumberFormat
                        placeholder={placeholder}
                        className={inputValido ? " form-control is-valid text-uppercase sin_icono" : " form-control is-invalid text-uppercase sin_icono"}
                        onChange={(e) => { e.preventDefault(); this.validarInput(e); onChange(e) }}
                        thousandSeparator={thousandseparator ? ',' : ''}
                        {...props}
                        format={typeformat}
                        decimalScale={2}
                    />
                </div>
                <span className={inputValido ? "form-text text-danger hidden" : "form-text text-danger is-invalid"}> {messageinc} </span>
            </div>
        )
    }
}
export default InputNumber
