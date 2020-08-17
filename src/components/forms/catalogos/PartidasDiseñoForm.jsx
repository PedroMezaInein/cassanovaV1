import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, Button, RadioGroup } from '../../form-components'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
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
                <div className="form-group row form-group-marginless">
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
                            placeholder='Empresa'
                            value={form.empresa} 
                            formeditado={formeditado}
                        />
                    </div>
                    <div className="col-md-5">
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

                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>

            </Form>
        )
    }
}

export default PartidasDiseñoForm