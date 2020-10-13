import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
class InputGray extends Component {
    state = {
        inputValido: !this.props.requirevalidation
    }
    validarInput(e) {
        const { value } = e.target
        const { patterns, requirevalidation } = this.props
        if (value !== '' && value !== null && value !== undefined) {
            if (requirevalidation) {
                var expRegular = new RegExp(patterns);
                if (expRegular.test(value)) {
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
    letterCase = (e) => {
        const { letterCase } = this.state
        if (letterCase === undefined)
            e.target.value = ("" + e.target.value).toUpperCase();
        else {
            if (letterCase === 'Upper')
                e.target.value = ("" + e.target.value).toUpperCase();
        }
    }
    render() {
        const { error, onChange, placeholder, iconclass, letterCase, customlabel, customstyle, customclass, ...props } = this.props
        const toInputUppercase = e => {
            if (letterCase === undefined)
                e.target.value = ("" + e.target.value).toUpperCase();
            else {
                if (letterCase === true)
                    e.target.value = ("" + e.target.value).toUpperCase();
            }
        };
        return (
            <div className="form-group">
                <label className={`col-form-label ${customlabel}`}>{placeholder}</label>
                <div className="input-group input-group-solid rounded-0">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className={iconclass + " icon-lg text-dark-50"}></i>
                        </span>
                    </div>
                    <Form.Control
                        placeholder={placeholder}
                        className={`form-control text-dark-50 font-weight-bold ${customclass}`}
                        onChange={(e) => { e.preventDefault(); this.validarInput(e); onChange(e) }}
                        onInput={toInputUppercase}
                        style={customstyle}
                        {...props}
                    />
                </div>
            </div>
        )
    }
}
export default InputGray
