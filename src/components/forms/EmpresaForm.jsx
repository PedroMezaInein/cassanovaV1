import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Button, Select } from '../form-components'
import { Subtitle, P } from '../texts'
import { faTimesCircle, faClipboard, faCameraRetro, faCamera } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
                <Subtitle className="text-center" color="gold">
                    {title}
                </Subtitle>
                <div className="row my-3 mx-auto">
                    <div className="col-md-6">
                        <Input onChange={ onChange } required name="name" type="text" value={ form.name } placeholder="Nombre"/>
                    </div>
                    <div className="col-md-6 ">
                        <div className="image-upload">
                            <Input
                                onChange={ onChange }
                                name="logo" 
                                type="file" 
                                value={ form.logo }
                                id="logo"
                                placeholder="Logo de la empresa"/>
                            <label htmlFor="logo">
                                <FontAwesomeIcon icon={faCamera} />
                            </label>
                        </div>
                        {
                            (img === '' ) && (form.file !== '' && form.file !== undefined && form.file !== null) &&
                                <div className="p-3 position-relative">
                                    <img className='w-100' src={form.file } />
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
                    </div>
                </div>
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>
            </Form>
        )
    }
}

export default EmpresaForm