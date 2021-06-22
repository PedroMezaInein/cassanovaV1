import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
class InputMoneyGray extends Component {
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
        const { placeholder, value, prefix, thousandseparator, iconclass, customstyle, customlabel, customclass, withformgroup, customdiv, withtaglabel, withtextlabel, withicon, messageinc } = this.props
        const { inputMoneyValido } = this.state
        return (
            <div className={withformgroup?`form-group ${customdiv}`:''}>
                {
                    withtaglabel?
                    <label className={`col-form-label font-weight-bold text-dark-60  ${customlabel}`}>{withtextlabel?placeholder:''}</label>
                    :''
                }
                <div className="input-group input-group-solid rounded-0">
                    {
                        withicon?
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <i className={iconclass + " icon-lg text-dark-50"}></i>
                            </span>
                        </div>
                        :''
                    }
                    <NumberFormat
                        value={value}
                        displayType={'input'}
                        thousandSeparator={thousandseparator ? thousandseparator : false}
                        prefix={prefix}
                        className={`form-control text-dark-50 font-weight-bold text-uppercase ${customclass}`}
                        renderText={value => <div> {value} </div>}
                        onValueChange={(values) => this.onChange(values)}
                        placeholder={placeholder}
                        style={customstyle}
                    />
                </div>
                <span className={inputMoneyValido ? "form-text text-danger hidden" : "form-text text-danger is-invalid"}>{messageinc}</span>
            </div>
        )
    }
}
export default InputMoneyGray