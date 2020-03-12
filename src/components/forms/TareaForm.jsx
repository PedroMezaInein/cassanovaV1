import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Input from '../form-components/Input'

class TareaForm extends Component{

    render(){
        const { form } = this.props
        console.log('PROPS TAREA FORM', this.props);
        return(
            <Form { ... this.props}>
                <div className="row mx-0">
                    <div className="col-md-4 mx-auto no-label">
                        <Input className=" no-label " placeholder = 'Título' value = { form.titulo } name = 'titulo' />
                    </div>
                    <div className="col-md-12">
                        <Input placeholder = 'Descripción' value = { form.descripcion } name = 'descripcion' as="textarea" rows="3"/>
                    </div>
                </div>
                
            </Form>
        )
    }
}

export default TareaForm