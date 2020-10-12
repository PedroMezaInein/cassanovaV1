import React, { Component } from 'react'

export default class Title extends Component {
    

    render() {
        const { color, className, children } = this.props
        return (
            <h1 className={`title text-color__${color} ${className}`}>
                {children}
            </h1>
        )
    }
}