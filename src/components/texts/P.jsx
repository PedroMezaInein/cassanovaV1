import React, { Component } from 'react'

export default class P extends Component{

    render(){
        const { color, children, className } = this.props
        return(
            <p className={`text-color__${color} mb-0 ${className}`}>
                { children }
            </p>
        )
    }
}