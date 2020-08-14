import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, InputImage, Button } from '../form-components' 
import { faTimesCircle, faCamera } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { validateAlert } from '../../functions/alert'
import { RFC } from '../../constants'

class EmpresaForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            files: []
        }
    }

    render() {
        const { form, onChange, img, removefile, onSubmit, formeditado } = this.props
        return (
            <Form id="form-empresa"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-empresa')
                    }
                }
                {... this.props}
            >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            onChange={onChange}
                            name="name"
                            type="text"
                            value={form.name}
                            placeholder="NOMBRE"
                            iconclass={"far fa-user"}
                            messageinc="Incorrecto. Ingresa el nombre de la empresa"
                        />
                    </div>
                    <div className="col-md-4">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            onChange={onChange}
                            name="razonSocial"
                            type="text"
                            value={form.razonSocial}
                            placeholder="RAZÓN SOCIAL"
                            iconclass={"far fa-building"}
                            messageinc="Incorrecto. Ingresa la razón social"
                        />
                    </div>
                    <div className="col-md-4">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            onChange={onChange}
                            name="rfc"
                            type="text"
                            value={form.rfc}
                            placeholder="RFC"
                            iconclass={"far fa-file-alt"}
                            patterns={RFC}
                            messageinc="Incorrecto. Ej. ABCD001122ABC"
                            maxLength="13"
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                {/* <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <div className="uppy">
                            <div className="uppy-wrapper">
                                <div className="uppy-Root uppy-FileInput-container mb-3">
                                    <InputImage
                                        onChange={onChange}
                                        name="logo"
                                        type="file"
                                        value={form.logo}
                                        id="logo"
                                        placeholder="LOGO DE LA EMPRESA"
                                    />
                                </div>
                            </div>
                            <label htmlFor="logo">
                                <FontAwesomeIcon icon={faCamera} />
                            </label>
                        </div>
                    </div>
                    {
                        (img === '') && (form.file !== '' && form.file !== undefined && form.file !== null) &&
                        <div className="p-3 position-relative">
                            <img className='img-empresa' src={form.file} />
                        </div>
                    }
                    {
                        form.logo &&
                        <div className="p-3 position-relative img-empresa">
                            <img value={img} className='img-empresa' src={img} />
                            <Button className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow text-muted"
                                onClick={removefile} text='' icon={faTimesCircle} />
                        </div>
                    }
                </div> */}

                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>
            </Form>
        )
    }
}

export default EmpresaForm