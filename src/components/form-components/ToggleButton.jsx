import React, { Component } from 'react'
import { Toggle } from "react-toggle-component";


class ToggleButton extends Component{

    render(){
        const { leftBG, rightBG, borderColor, knobColor } = this.props
        return(
            <Toggle
                leftBackgroundColor={leftBG ? leftBG: ''}
                rightBackgroundColor={rightBG ? rightBG: ''}
                borderColor={borderColor ? borderColor: ''}
                knobColor={knobColor ? knobColor: ''}
                { ... this.props }
                />
        )
    }

}

export default ToggleButton