import React, { Component } from 'react'
import { CirclePicker } from 'react-color';

class CircleColor extends Component {
    render() {
        const {onChange, placeholder, colors, width, circlesize } = this.props
        return (
            <div className="">
                <div className="col-form-label">{placeholder}</div>
                <CirclePicker
                    circleSize={circlesize} 
                    width={width}
                    colors={colors}
                    onChange={ onChange }
                />
            </div>
        )
    }
}
export default CircleColor