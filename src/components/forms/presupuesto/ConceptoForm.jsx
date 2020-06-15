import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Subtitle, Small } from '../../texts'
import { Input, Select, SelectSearch, Button, Calendar, InputMoney, RadioGroup } from '../../form-components'

class ConceptoForm extends Component {

    updateCategoria = value => {
        const { onChange, form } = this.props
        if (form.clave === '')
            onChange({ target: { value: value + '.', name: 'clave' } })
        onChange({ target: { value: value, name: 'categoria' } })
    }

    updateUnidades = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'unidad' } })
    }

    render() {
        const { title, options, form, onChange, ...props } = this.props
        return (
            <Form {...props}>
                    <div className="form-group row form-group-marginless">
                        <div className="col-md-4">
                            <SelectSearch options={options.categorias} placeholder="Selecciona la categoría"
                                name="categoria" value={form.categoria} onChange={this.updateCategoria} iconclass={" fas fa-book"} fas fa-weight-hanging/>
                            <span className="form-text text-muted">Por favor, selecciona la categoría</span>
                        </div>
                        <div className="col-md-4">
                            <Input placeholder="Clave" value={form.clave} name="clave" onChange={onChange} iconclass={"fas fa-key"}/>
                            <span className="form-text text-muted">Por favor, ingrese su clave. </span>
                        </div>
                        <div className="col-md-4">
                            <Input placeholder="Mano de obra" value={form.manoObra} name="manoObra" onChange={onChange} iconclass={"fas fa-tractor"}/>
                            <span className="form-text text-muted">Por favor, ingrese su mano de obra. </span>
                        </div>
                    </div>
                    <div class="separator separator-dashed mt-1 mb-2"></div>
                    <div className="form-group row form-group-marginless">
                        <div className="col-md-4">
                            <Input placeholder="Herramienta" value={form.herramienta} name="herramienta" onChange={onChange} iconclass={"fas fa-toolbox"}/>
                            <span className="form-text text-muted">Por favor, ingrese su herramienta. </span>
                        </div>
                        <div className="col-md-4">
                            <Input placeholder="Materiales" value={form.materiales} name="materiales" onChange={onChange} iconclass={"fas fa-tools"}/>
                            <span className="form-text text-muted">Por favor, ingrese su material. </span>
                        </div>
                        <div className="col-md-4">
                            <InputMoney thousandSeparator={true} placeholder="Costo" value={form.costo} name="costo" onChange={onChange} iconclass={"fas fa-dollar-sign"}/>
                            <span className="form-text text-muted">Por favor, ingrese su costo. </span>
                        </div>
                    </div>
                    <div class="separator separator-dashed mt-1 mb-2"></div>
                    <div className="form-group row form-group-marginless">
                        <div className="col-md-4">
                            <SelectSearch options={options.unidades} placeholder="Selecciona la unidad"
                                name="unidad" value={form.unidad} onChange={this.updateUnidades} iconclass={" fas fa-weight-hanging"}/>
                            <span className="form-text text-muted">Por favor, selecciona la unidad</span>
                        </div>

                        <div className="col-md-8">
                            <Input as="textarea" placeholder="Descripción" rows="1" value={form.descripcion}
                                name="descripcion" onChange={onChange} iconclass={"far fa-file-alt"} />
                            <span className="form-text text-muted">Por favor, ingresa la descripción. </span>
                        </div>
                    </div>
                
                <div className="d-flex justify-content-center my-3">
                    <Button icon='' type="submit" className="text-center mx-auto" text='Enviar' />
                </div>

            </Form>
        )
    }
}

export default ConceptoForm