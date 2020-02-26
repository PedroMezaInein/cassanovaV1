import React, { Component } from 'react'

export default class B extends Component{
    constructor(props){
        super(props)
    }

    render(){
        const { color, children } = this.props
        return(
            <b className={`text-color__${color} mb-0 font-weight-bold`}>
                { children }
            </b>
        )
    }
}