import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
class InputNumberGray extends Component {
    state = {
        valor: '',
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
        this.setState({...this.state, valor: value})
        if (formeditado) {
            this.validarInput({ target: { value: value } })
        }
    }

    onChange = e => {
        const { onChange } = this.props
        const { value } = e.target
        onChange(e)
        this.setState({...this.state, valor: value})
    }
    render() {
        const { error, placeholder, iconclass, messageinc, typeformat, customlabel, customclass, customstyle, thousandseparator, formgroup, value, swal, withicon, ...props } = this.props
        const { inputValido, valor } = this.state
        return (
            <div className={`form-group ${formgroup}`}>
                <label className={`col-form-label font-weight-bold text-dark-60  ${customlabel}`}>{placeholder}</label>
                <div className="input-group input-group-solid rounded-0">
                    {
                        withicon ?
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <i className={iconclass + " icon-lg text-dark-50"}></i>
                            </span>
                        </div>
                        :''
                    }
                    <NumberFormat
                        placeholder={placeholder}
                        className={`form-control text-dark-50 font-weight-bold ${customclass}`}
                        onChange={(e) => { e.preventDefault(); this.validarInput(e); this.onChange(e) }}
                        thousandSeparator={thousandseparator ? ',' : ''}
                        value = { swal === true ? valor : value }
                        {...props}
                        format={typeformat}
                        style={customstyle}
                        decimalScale={2}
                    />
                </div>
                <span className={inputValido ? "form-text text-danger hidden" : "form-text text-danger is-invalid"}> {messageinc} </span>
            </div>
        )
    }
}
export default InputNumberGray
