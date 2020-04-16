import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import {Subtitle} from '../../texts'
import {Input, Select, SelectSearch, Button} from '../../form-components'
import { faAngleRight, faTimes, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge } from 'react-bootstrap'

class ProyectosForm extends Component{

    render(){
        const { title, children, ... props } = this.props
        return(
            <Form { ... props}>
                <Subtitle className="text-center" color="gold">
                    {
                        title
                    }
                </Subtitle>
                {
                    children
                }
                <div className="row mx-0">
                    <div className="col-md-6">

                    </div>
                </div>
            </Form>
        )
    }
}

export default ProyectosForm