import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'
import ReactTooltip from "react-tooltip";

export default class button extends Component{
    constructor(props){
        super(props)
    }

    render(){
        const { children, color, text, icon, onClick, className, type, tooltip, pulse, ...props } = this.props
        return(
            <Button data-tip data-for={tooltip ? tooltip.id : 'undefined'} type={type} onClick={onClick} className={`button__${color} ${className}` } { ... props }>
                {
                    icon !== ''  && <FontAwesomeIcon icon={icon} />
                }<span className={pulse}></span>
                {
                    tooltip ? 
                        <ReactTooltip id={tooltip.id} place="top" type={tooltip.type ? tooltip.type : 'dark'} effect="solid">
                            {
                                tooltip.text
                            }
                        </ReactTooltip>
                    : ''
                }
                {text}
                {children}
            </Button>
        )
    }
}