import React, { Component } from 'react'
import { Toggle } from "react-toggle-component";


class ToggleButton extends Component{

    render(){
        const { leftBG, rightBG, borderColor, rightKnobColor, leftKnobColor, knobColor} = this.props
        return( 
            <Toggle
                leftBackgroundColor={leftBG ? leftBG: ''}
                rightBackgroundColor={rightBG ? rightBG: ''}
                borderColor={borderColor ? borderColor: ''}
                knobColor={knobColor ? knobColor: ''}
                leftKnobColor={leftKnobColor ? leftKnobColor: ''}
                rightKnobColor={rightKnobColor ? rightKnobColor: ''}
                { ... this.props }
            /> 
        )
    }

}

export default ToggleButton