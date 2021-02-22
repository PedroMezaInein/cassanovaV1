import React, { Component } from 'react'
import { CirclePicker } from 'react-color';
class CircleColor extends Component {
    render() {
        const {onChange, placeholder, colors, width, circlesize, value } = this.props
        return (
            <div className="">
                <div className="col-form-label">{placeholder}</div>
                <div className="p-2">
                    <CirclePicker
                        circleSize={circlesize} 
                        width={width}
                        colors={colors}
                        onChange={ onChange }
                        color = { value }
                    />
                </div>
                {/* {
                    requirevalidation?(<span className={"form-text text-danger"}> {messageinc} </span>):''
                } */}
            </div>
        )
    }
}
export default CircleColor