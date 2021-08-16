import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, Button } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
class PrestacionForm extends Component {
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
                    <div className="col-md-4 align-self-center">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            name="prestacion"
                            value={form.prestacion}
                            placeholder="PRESTACIÓN"
                            onChange={onChange}
                            iconclass="las la-hand-holding-usd icon-xl"
                            messageinc="Incorrecto. Ingresa la prestación."
                        />
                    </div>
                    <div className="col-md-8">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            rows="1"
                            as="textarea"
                            name="descripcion"
                            value={form.descripcion}
                            placeholder="DESCRIPCIÓN"
                            onChange={onChange}
                            messageinc="Incorrecto. Ingresa la descripción."
                            customclass="px-2 text-justify"
                        />
                    </div>
                </div>
                <div className="card-footer px-0 pb-0 pt-2 text-center">
                    <Button icon='' className="btn btn-primary mr-2"
                        onClick={
                            (e) => {
                                e.preventDefault();
                                validateAlert(onSubmit, e, 'form-tipo')
                            }
                        } text="ENVIAR" />
                </div>
            </Form>
        )
    }
}

export default PrestacionForm