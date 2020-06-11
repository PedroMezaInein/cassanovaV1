import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input,InputImage, Button, Select} from '../form-components'
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
                    <div className="form-group row form-group-marginless mt-5">
                        <div className="col-md-4">
                            <Input onChange={ onChange } required name="name" type="text" value={ form.name } placeholder="Nombre" iconclass={"far fa-user"}/>
                            <span className="form-text text-muted">Por favor, ingrese su nombre. </span>
                        </div>
                        <div className="col-md-4">
                            <Input onChange={ onChange } required name="razonSocial" type="text" value={ form.razonSocial } placeholder="Razón social" iconclass={"far fa-building"}/>
                            <span className="form-text text-muted">Por favor, ingrese su razón social. </span>
                        </div>
                        <div className="col-md-4">
                        <div className="image-upload">
                            <Input
                                onChange={ onChange }
                                name="logo" 
                                type="file" 
                                value={ form.logo }
                                id="logo"
                                placeholder="Logo de la empresa"
                            />
                                <span className="form-text text-muted">Por favor, adjunte su logo. </span>
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