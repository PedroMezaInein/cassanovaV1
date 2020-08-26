import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, Button } from '../../form-components'
import { validateAlert } from '../../../functions/alert'

class UnidadForm extends Component {

    render() {
        const { title, form, onChange, onSubmit, formeditado, ...props } = this.props
        return (
            <Form id="form-unidad"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-unidad')
                    }
                }
                {...props}
            >
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-12">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            name="unidad"
                            value={form.unidad}
                            placeholder="NOMBRE DE LA UNIDAD"
                            onChange={onChange}
                            iconclass={"far fa-window-maximize"}
                            messageinc="Incorrecto. Ingresa el nombre de la unidad."
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