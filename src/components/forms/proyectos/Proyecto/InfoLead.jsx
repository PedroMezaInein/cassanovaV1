import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
class InfoLead extends Component {
    render() {
        const { proyecto } = this.props
        return (
            <>
                <Card className="card-custom gutter-b">
                    <Card.Header className="border-0 align-items-center">
                        <div className="font-weight-bold font-size-h4 text-dark">INFORMACIÓN DEL LEAD</div>
                    </Card.Header>
                    <Card.Body>
                        
                    </Card.Body>
                </Card>
            </>
        )
    }
}

export default InfoLead