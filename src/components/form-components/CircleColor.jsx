import React, { Component } from 'react'
import { CirclePicker } from 'react-color';
class CircleColor extends Component {
    state = {
        valor: ''
    }
    componentDidMount(){
        const { value } = this.props
        this.setState({...this.state, valor: value})
    }
    render() {
        const {onChange, placeholder, colors, width, circlesize, value, classlabel, classdiv, swal } = this.props
        const { valor } =  this.state
        return (
            <div className={`${classdiv}`}>
                <div className={`col-form-label ${classlabel}`}>{placeholder}</div>
                <div className={`p-2 ${classdiv}`}>
                    <CirclePicker
                        circleSize={circlesize} 
                        width={width}
                        colors={colors}
                        onChange={ onChange }
                        color = { swal === true ? valor : value }
                    />
                </div>
                {/* {
                    requirevalidation?(<span className={"form-text text-danger is-invalid"}> {messageinc} </span>):''
                } */}
            </div>
        )
    }
}
export default CircleColor