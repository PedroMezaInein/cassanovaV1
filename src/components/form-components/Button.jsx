import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'

export default class button extends Component{
    constructor(props){
        super(props)
    }

    render(){
        const { children, color, text, icon, onClick, className, type, ...props } = this.props
        return(
            <Button type={type} onClick={onClick} className={`button__${color} ${className}` } { ... props }>
                {
                    icon && <FontAwesomeIcon icon={icon} />
                }
                {text}
                {children}
            </Button>
        )
    }
}