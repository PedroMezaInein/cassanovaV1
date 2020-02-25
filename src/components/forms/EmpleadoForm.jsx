import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Button, Select } from '../form-components'
import { Subtitle, P } from '../texts'

class RegisterUserForm extends Component{

    constructor(props){
        super(props)
    }

    render(){
        const { children, options, form, onChange, title } = this.props
        return(
            <>
                <Subtitle color="gold">
                    {title}
                </Subtitle>
            </>
        )
    }
}

export default RegisterUserForm