import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'

export default class button extends Component{
    constructor(props){
        super(props)
    }

    render(){
        const { color, text, icon, onClick, className, type } = this.props
        return(
            <Button type={type} onClick={onClick} className={`button__${color} ${className}`}>
                {
                    icon && <FontAwesomeIcon icon={icon} />
                }
                {text}
            </Button>
        )
    }
}