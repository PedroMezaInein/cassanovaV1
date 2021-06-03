import React, { Component } from 'react'
import NumberFormat from 'react-number-format'

class InputPhone extends Component {

    state = {
        inputPhone: !this.props.requirevalidation
    }

    validarPhone(e) {
        const { value } = e.target
        const { patterns, requirevalidation } = this.props
        if (value !== '' && value !== null && value !== undefined) {
            if (requirevalidation) {
                var expRegular = new RegExp(patterns);
                if (value >= 0 && expRegular.test(value)) {
                    this.setState({
                        inputPhone: true
                    })
                } else {
                    this.setState({
                        inputPhone: false

                    })
                }
            } else {
                this.setState({
                    inputPhone: true

                })
            }
        } else {
            if (requirevalidation) {
                this.setState({
                    inputPhone: false
                })
            } else {
                this.setState({
                    inputPhone: true
                })
            }

        }
    }

    componentDidUpdate(nextProps) {
        if (nextProps.value !== this.props.value)
            if (!nextProps.requirevalidation) {
                this.setState({
                    ...this.state,
                    inputPhone: true
                })
            } else {
                if (this.props.value !== '') {
                    this.validarPhone({ target: { value: this.props.value } })
                }
            }

    }

    componentDidMount() {
        const { formeditado, value } = this.props
        if (formeditado) {
            this.validarPhone({ target: { value: value } })
        }
    }

    onChange = values => {
        const { onChange, name } = this.props
        this.validarPhone({ target: { value: values.value, name: name } })
        onChange({ target: { value: values.value, name: name } })

    }


    render() {
        const { error, onChange, placeholder, iconclass, messageinc, value, thousandseparator, ...props } = this.props
        const { inputPhone } = this.state

        return (
            <div>
                <label className="col-form-label">{placeholder}</label>
                <div className="input-icon">
                    <span className="input-icon input-icon-right">
                        <i className={iconclass + " m-0 kt-font-boldest text-primary"}></i>
                    </span>
                    <NumberFormat
                        value={value}
                        displayType={'input'}
                        thousandSeparator={thousandseparator ? thousandseparator : false}
                        renderText={value => <div> {value} </div>}
                        onValueChange={(values) => this.onChange(values)}

                        format="(##) #### - ####"
                        allowEmptyFormatting
                        mask="_"
                        placeholder={placeholder}
                        className={inputPhone ? " form-control is-valid sin_icono " : " form-control is-invalid sin_icono"}
                        {...props}
                    />
                </div>
                <span className={inputPhone ? "form-text text-danger hidden" : "form-text text-danger"}> {messageinc} </span>
            </div>
        )
    }
}
export default InputPhone