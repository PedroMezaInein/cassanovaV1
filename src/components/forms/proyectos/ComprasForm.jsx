import React, { Component } from 'react'
import {Subtitle} from '../../texts'

class ComprasForm extends Component{
    render(){
        const { title } = this.props
        return(
            <Subtitle className="text-center" color = "gold">
                {
                    title
                }
            </Subtitle>
        )
    }
}

export default ComprasForm