import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Button } from '../form-components' 
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
                <div className="form-group row form-group-marginless pb-4">
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
                <div className="card-footer py-3 pr-1">
                    <div className="row">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button text='ENVIAR' type='submit' className="btn btn-primary mr-2" />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default EmpresaForm