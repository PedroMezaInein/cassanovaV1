import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, Button, RadioGroup } from '../../form-components'
import { validateAlert } from '../../../functions/alert'

class PartidasDiseñoForm extends Component {

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    render() {
        const { title, options, form, onChange, addSubpartida, deleteSubpartida, onSubmit, formeditado, requirevalidation, ...props } = this.props
        return (
            <Form id="form-partida"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-partida')
                    }
                }
                {...props}
            >
                <div className="form-group row form-group-marginless mb-0">
                    <div className="col-md-2">
                        <RadioGroup
                            name='empresa'
                            onChange={onChange}
                            options={
                                [
                                    {
                                        label: 'INEIN',
                                        value: 'inein'
                                    },
                                    {
                                        label: 'IM',
                                        value: 'im'
                                    }
                                ]
                            }
                            placeholder='SELECCIONA LA EMPRESA'
                            value={form.empresa} 
                            formeditado={formeditado}
                        />
                    </div>
                    <div className="col-md-10">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            name="nombre"
                            value={form.nombre}
                            placeholder="NOMBRE DE LA PARTIDA"
                            onChange={onChange}
                            iconclass={"far fa-window-maximize"}
                            messageinc="Incorrecto. Ingresa el nombre de la partida."
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

export default PartidasDiseñoForm