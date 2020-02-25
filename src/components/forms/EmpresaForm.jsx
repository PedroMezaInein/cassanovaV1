import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Button, Select } from '../form-components'
import { Subtitle, P } from '../texts'
import { URL_ASSETS } from '../../constants'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
class EmpresaForm extends Component{

    constructor(props){
        super(props)
        this.state = {
            files: []
        }
    }
    
    render(){
        const { form, onChange, title, img, removeFile} = this.props
        return(
            <Form { ... this.props}>
                <Subtitle color="gold">
                    {title}
                </Subtitle>
                <Input onChange={ onChange } required name="name" type="text" value={ form.name } placeholder="Nombre"/>
                {
                    (img === '' ) && (form.file !== '' && form.file !== undefined && form.file !== null) &&
                        <div className="p-3 position-relative">
                            <img className='w-100' src={URL_ASSETS + form.file } />
                        </div>
                }
                {
                    form.logo &&
                        <div className="p-3 position-relative">
                            <img value={img} className='w-100' src={ img } />
                            <Button className="position-absolute delete-item " 
                                onClick={removeFile} text='' icon={faTimesCircle}/>
                        </div>
                }
                <Input onChange={ onChange } name="logo" type="file" value={ form.logo } placeholder="File"/>
                <div className="mt-3 text-center">
                    <Button className="mx-auto" type="submit" text="Enviar" />
                </div>
            </Form>
        )
    }
}

export default EmpresaForm