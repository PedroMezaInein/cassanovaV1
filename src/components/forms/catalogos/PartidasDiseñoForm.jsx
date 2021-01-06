import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { TagInput, Button, SelectSearch } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
class PartidasDiseñoForm extends Component {

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }
    updateRubro = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'rubro' } })
    }

    render() {
        const { options, form, onChange, onSubmit, formeditado, tagInputChange, ...props } = this.props
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
                <div className="form-group row form-group-marginless mb-4">
                    <div className="col-md-3">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.empresas}
                            placeholder="SELECCIONA LA EMPRESA"
                            name="empresa"
                            value={form.empresa}
                            onChange={this.updateEmpresa}
                            iconclass={"far fa-building"}
                            messageinc="Incorrecto. Selecciona la empresa"
                        />
                    </div>
                    <div className="col-md-3">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.rubro}
                            placeholder="SELECCIONA El RUBRO"
                            name="rubro"
                            iconclass={"fas fa-map-pin"}
                            value={form.rubro}
                            defaultValue={form.rubro}
                            onChange={this.updateRubro}
                            messageinc="Incorrecto. Selecciona el rubro"
                        />
                    </div>
                    <div className="col-md-6">
                        <TagInput
                            tags={form.partidas} 
                            onChange={tagInputChange} 
                            placeholder={"NOMBRE DE LA PARTIDA"}
                            iconclass={"far fa-folder-open"}
                        />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' text='ENVIAR' type='submit' className="btn btn-primary mr-2" />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default PartidasDiseñoForm