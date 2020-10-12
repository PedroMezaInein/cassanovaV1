import React, { Component } from 'react'

export default class Subtitle extends Component {
    

    render() {
        const { color, children, className } = this.props
        return (
            <h3 className={`text-color__${color} subtitle ${className}`}>
                {children}
            </h3>
        )
    }
}