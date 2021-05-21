import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, SelectSearch, Button, InputMoney } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { ItemSlider } from '../../../components/singles';
class RendimientoForm extends Component {

    updateUnidades = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'unidad' } })
    }

    updateProveedor = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proveedor' } })
    }

    render() {
        const { title, options, form, onChange, clearFiles, onChangeAdjunto, formeditado, onSubmit,handleChange, ...props } = this.props
        return (
            <Form id="form-rendimiento"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-rendimiento')
                    }
                }
                {...props}>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-3">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            placeholder="MATERIALES"
                            value={form.materiales}
                            name="materiales"
                            onChange={onChange}
                            iconclass={"fas fa-tools"}
                            messageinc="Incorrecto. Ingresa el material."
                        />
                    </div>
                    <div className="col-md-3">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.unidades}
                            placeholder="SELECCIONA LA UNIDAD"
                            name="unidad"
                            value={form.unidad}
                            onChange={this.updateUnidades}
                            iconclass={"fas fa-weight-hanging"}
                            messageinc="Incorrecto. Selecciona la unidad"
                        />
                    </div>
                    <div className="col-md-3">
                        <InputMoney
                            requirevalidation={1}
                            formeditado={formeditado}
                            thousandseparator={true}
                            placeholder="COSTO"
                            value={form.costo}
                            name="costo"
                            onChange={onChange}
                            iconclass={"fas fa-dollar-sign"}
                        />
                    </div>
                    <div className="col-md-3">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            placeholder="RENDIMIENTO"
                            value={form.rendimiento}
                            name="rendimiento"
                            onChange={onChange}
                            iconclass={" fas fa-chart-line "}
                            messageinc="Incorrecto. Ingresa el rendimieno."
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <SelectSearch
                            requirevalidation={1}
                            formeditado={formeditado}
                            options={options.proveedores}
                            placeholder="SELECCIONA EL PROVEEDOR"
                            name="proveedor"
                            value={form.proveedor}
                            onChange={this.updateProveedor}
                            iconclass={"far fa-user"}
                            messageinc="Incorrecto. Selecciona el proveedor"
                        />
                    </div>
                    <div className="col-md-8">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            as="textarea"
                            placeholder="DESCRIPCIÓN"
                            rows="1"
                            value={form.descripcion}
                            name="descripcion"
                            onChange={onChange}
                            messageinc="Incorrecto. Ingresa una descripción."
                            style={{ paddingLeft: "10px" }}
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless d-flex justify-content-center">
                    <div className="col-md-4 text-center">
                        <label className="col-form-label my-2 font-weight-bolder">{form.adjunto.placeholder}</label>
                        <ItemSlider
                            items={form.adjunto.files}
                            item='adjunto'
                            handleChange={handleChange}
                            multiple={false}
                        />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button text='ENVIAR' type='submit' className="btn btn-primary mr-2" icon='' />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default RendimientoForm