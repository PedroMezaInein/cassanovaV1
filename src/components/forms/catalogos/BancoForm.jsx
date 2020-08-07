import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, Button } from '../../form-components'
import { validateAlert } from '../../../functions/alert'

class BancoForm extends Component {

    render() {
        const { title, form, onChange, onSubmit, formeditado, ...props } = this.props
        return (
            <Form id="form-banco"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-banco')
                    }
                }
                {...props}
            >
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-12">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            name="nombre"
                            value={form.nombre}
                            placeholder="NOMBRE DE LA BANCO"
                            onChange={onChange}
                            iconclass={"far fa-window-maximize"}
                            messageinc="Incorrecto. Ingresa el nombre del banco."
                        />
                    </div>
                </div>
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>
            </Form>
        )
    }
}

export default BancoForm