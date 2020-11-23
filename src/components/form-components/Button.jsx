import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { Tooltip } from 'react-bootstrap'


export default class button extends Component {

    render() {
        const { children, color, text, icon, onClick, className, type, tooltip, pulse, only_icon, ...props } = this.props
        return (
            <>
                {
                    tooltip ?
                        <OverlayTrigger overlay={<Tooltip>{tooltip.text}</Tooltip>}>
                            <Button type={type} onClick={onClick} className={className} {...props}>
                                {
                                    <i className={only_icon}></i>
                                }
                                {
                                    icon !== undefined && icon !== '' ?
                                        <FontAwesomeIcon icon={icon} />
                                    : ''
                                }
                                <span className={pulse}></span>

                                {text}
                                {children}
                            </Button>
                        </OverlayTrigger>
                        :
                        <Button type={type} onClick={onClick} className={className} {...props}>
                            {/* {
                                <i className={only_icon}></i>
                            } */}
                            {
                                icon !== undefined && icon !== '' ?
                                    <FontAwesomeIcon icon={icon} />
                                : ''
                            }<span className={pulse}></span>

                            {text}
                            {children}
                        </Button>
                }
            </>
        )
    }
}