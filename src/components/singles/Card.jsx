import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'

export default class card extends Component{
    constructor(props){
        super(props)
    }

    render(){
        const { img, children, variant , className} = this.props
        return(
            <Card className={`${className} card-container`}>
                {
                    img &&
                        <Card.Img variant={variant ? variant: 'top'} src={img} />
                }
                <Card.Body>
                    {children}
                </Card.Body>
            </Card>
        )
    }
}