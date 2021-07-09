import React, { Component } from 'react'
import $ from 'jquery';
import 'bootstrap';
import "bootstrap-touchspin";
class InputCantidad extends Component {
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
    
    componentDidMount(){
        const { formeditado, value, onChange, name } = this.props
        if (formeditado) {
            this.validarInput({ target: { value: value } })
        }
        $('#touchspin').TouchSpin({
            buttondown_class: 'btn btn-light border',
            buttonup_class: 'btn btn-light border',
            min: 0,
            max: 1000,
            step: 1,
            maxboostedstep: 1000,
            initval: 0
        }).on('change', function(e){
            const { value } = e.target
            onChange({target:{value: value, name: name}})
        });
    }

    render() {
        const { error, onChange, placeholder, iconclass, messageinc, letterCase,customlabel,spellcheck, customicon, value, customclass, ...props } = this.props 
        const { inputValido } =  this.state  
        return (
            <>
                <label className={`col-form-label ${customlabel}`}>{placeholder}</label>
                <input
                    id="touchspin"
                    type="text"
                    className={`form-control text-center ${customclass}` }
                    onChange={(e) => { e.preventDefault(); this.validarInput(e); onChange(e) }}
                    value={value}
                    {...props}
                />
                {
                    !inputValido&&<span className="form-text text-danger mt-2">{messageinc}</span>
                }
                
            </>
        )
    }
}
export default InputCantidad
