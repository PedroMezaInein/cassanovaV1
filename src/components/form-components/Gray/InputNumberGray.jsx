import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
class InputNumberGray extends Component {
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
        const { error, onChange, placeholder, iconclass, messageinc, typeformat, customlabel, customclass, customstyle, ...props } = this.props
        return (
            <div className="form-group">
                <label className={`col-form-label ${customlabel}`}>{placeholder}</label>
                <div className="input-group input-group-solid rounded-0">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className={iconclass + " icon-lg text-dark-50"}></i>
                        </span>
                    </div>
                    <NumberFormat
                        placeholder={placeholder}
                        className={`form-control text-dark-50 font-weight-bold ${customclass}`}
                        onChange={(e) => { e.preventDefault(); this.validarInput(e); onChange(e) }}
                        {...props}
                        format={typeformat}
                        style={customstyle}
                    />
                </div>
            </div>
        )
    }
}
export default InputNumberGray
