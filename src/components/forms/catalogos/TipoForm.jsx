import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, Button } from '../../form-components'
import { validateAlert } from '../../../functions/alert'

class UnidadForm extends Component {

    render() {
        const { title, form, onChange, onSubmit, formeditado, ...props } = this.props
        return (
            <Form id="form-tipo"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-tipo')
                    }
                }
                {...props}>
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-12">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            name="tipo"
                            value={form.tipo}
                            placeholder="TIPO"
                            onChange={onChange}
                            iconclass={"far fa-window-maximize"}
                            messageinc="Incorrecto. Ingresa el tipo de contrato."
                        />
                    </div>
                </div>
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="ENVIAR" />
                </div>
            </Form>
        )
    }
}

export default UnidadForm