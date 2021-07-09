import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import NumberFormat from 'react-number-format'

class InputMoney extends Component {

    state = {
        inputMoneyValido: !this.props.requirevalidation
    }

    validarInputMoney(e) {
        const { value } = e.target
        const { requirevalidation } = this.props
        if (value !== '' && value !== null && value !== undefined) {
            if (requirevalidation) {
                if (value >= 0) {
                    this.setState({
                        inputMoneyValido: true
                    })
                } else {
                    this.setState({
                        inputMoneyValido: false

                    })
                }
            } else {
                this.setState({
                    inputMoneyValido: true

                })
            }
        } else {
            if (requirevalidation) {
                this.setState({
                    inputMoneyValido: false
                })
            } else {
                this.setState({
                    inputMoneyValido: true
                })
            }

        }
    }

    componentDidUpdate(nextProps) {
        if (nextProps.value !== this.props.value)
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
        const { placeholder, value, prefix, thousandseparator, iconclass, customstyle} = this.props
        const { inputMoneyValido } = this.state

        return (
            <div>
                <Form.Label className="col-form-label">
                    {placeholder}
                </Form.Label><br />

                <div className="input-icon">
                    <span className="input-icon input-icon-right">
                        <i className={iconclass + " kt-font-boldest text-primary"}></i>
                    </span>
                    <NumberFormat
                        value={value}
                        displayType={'input'}
                        thousandSeparator={thousandseparator ? ',' : ''}
                        prefix={prefix}
                        className={inputMoneyValido ? " form-control is-valid text-uppercase sin_icono" : " form-control is-invalid text-uppercase sin_icono"}
                        renderText={value => <div> {value} </div>}
                        onValueChange={(values) => this.onChange(values)}
                        placeholder={placeholder}
                        style={customstyle}
                    />
                </div>
                <span className={inputMoneyValido ? "form-text text-danger hidden" : "form-text text-danger is-invalid"}>Incorrecto. Ingresa la cantidad.</span>
            </div>
        )
    }
}
export default InputMoney