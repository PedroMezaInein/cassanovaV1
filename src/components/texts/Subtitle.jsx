import React, { Component } from 'react'

export default class Subtitle extends Component{
    constructor(props){
        super(props)
    }

    render(){
        const { color, children } = this.props
        return(
            <h3 className={`text-color__${color}`}>
                {children}
            </h3>
        )
    }
}