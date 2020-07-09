import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input,InputImage, Button, Select} from '../form-components'
import { Subtitle, P } from '../texts'
import { faTimesCircle, faClipboard, faCameraRetro, faCamera } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { validateAlert } from '../../functions/alert'
import { RFC} from '../../constants'

class EmpresaForm extends Component{

    constructor(props){
        super(props)
        this.state = {
            files: []
        }
    }
    
    render(){
        const { form, onChange, title, img, removeFile,onSubmit, formeditado} = this.props
        return(
            <Form id="form-empresa"
                onSubmit = { 
                    (e) => {
                        e.preventDefault(); 
                        validateAlert(onSubmit, e, 'form-empresa')
                    }
                }
                { ... this.props}
                >
                    <div className="form-group row form-group-marginless">
                        <div className="col-md-4">
                            <Input 
                                requirevalidation={1}
                                formeditado={formeditado}
                                onChange={ onChange } 
                                name="name" 
                                type="text" 
                                value={ form.name } 
                                placeholder="Nombre" 
                                iconclass={"far fa-user"}
                                messageinc="Incorrecto. Ingresa el nombre de la empresa"
                                />
                            {/* <span className="form-text text-muted">Por favor, ingrese su nombre. </span> */}
                        </div>
                        <div className="col-md-4">
                            <Input 
                                requirevalidation={1}
                                formeditado={formeditado}
                                onChange={ onChange }
                                name="razonSocial" 
                                type="text" 
                                value={ form.razonSocial } 
                                placeholder="Razón social" 
                                iconclass={"far fa-building"}
                                messageinc="Incorrecto. Ingresa la razón social"
                            />
                            {/* <span className="form-text text-muted">Por favor, ingrese su razón social. </span> */}
                        </div>
                        <div className="col-md-4">
                            <Input 
                                requirevalidation={1}
                                formeditado={formeditado}
                                onChange={ onChange } 
                                name="rfc" 
                                type="text" 
                                value={ form.rfc } 
                                placeholder="RFC" 
                                iconclass={"far fa-file-alt"}
                                patterns={RFC}
                                messageinc="Incorrecto. Ej. ABCD001122ABC"
                                maxLength="13"
                                />
                            {/* <span className="form-text text-muted">Por favor, ingrese su RFC. </span> */}
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless mt-4 pl-3">
                            <div className="col-md-4">
                                <div className="image-upload">
                                    <input
                                        onChange={ onChange }
                                        formeditado={formeditado}
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
                                        <img className='max-h-70px' src={form.file } />
                                    </div>
                            }
                            {
                                form.logo &&
                                    <div className="p-3 position-relative">
                                        <img value={img} className='max-h-70px' src={ img } />
                                        <Button className="position-absolute delete-item " 
                                            onClick={removeFile} text='' icon={faTimesCircle}/>
                                    </div>
                            }
                            </div>
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