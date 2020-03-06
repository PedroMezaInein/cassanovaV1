import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button, Input, Calendar, Select, OptionsCheckbox } from '../form-components'
import { Subtitle } from '../texts'

class ProspectoForm extends Component{

    constructor(props){
        super(props)
        
    }
    
    render(){
        const { title, form, children,  ...props } = this.props
        return(
            <Form { ... props}>

                <Subtitle className="text-center" color="gold">
                    {title}
                </Subtitle>
                { children }
                <div className="mt-3 text-center">
                    <Button className="mx-auto" type="submit" text="Enviar" />
                </div>

            </Form>
        )
    }
}

export default ProspectoForm