import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import $ from "jquery";
class InputSinText extends Component {
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
        this.autoResizeTextArea()
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
        this.autoResizeTextArea()
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
    autoResizeTextArea(){
        $(".textarea-input").each(function () {
            this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
        }).on("input", function () {
            this.style.height = "auto";
            this.style.height = (this.scrollHeight) + "px";
        });
    }
    
    render() {
        const { error, onChange, placeholder, iconclass, messageinc, letterCase, customstyle,customclass, ...props } = this.props
        const { inputValido } = this.state
        const toInputUppercase = e => {
            const { type, value, selectionStart, selectionEnd } = e.target
            e.target.value = value.toUpperCase()
            if( type !== 'email'){
                e.target.selectionStart = selectionStart
                e.target.selectionEnd = selectionEnd
            }
            return e
        }
        return (
            <Form.Control
                placeholder={placeholder}
                className = { inputValido ? 
                        `form-control form-control-sm is-valid sin_icono ${customclass}` 
                    : `form-control form-control-sm is-invalid sin_icono ${customclass}` }
                onChange={(e) => { e.preventDefault(); this.validarInput(e); onChange(toInputUppercase(e)) }}
                /* onInput={toInputUppercase} */
                {...props}
                style={customstyle}
            />
        )
    }
}
export default InputSinText
