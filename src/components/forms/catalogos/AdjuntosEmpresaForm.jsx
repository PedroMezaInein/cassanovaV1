import React, { Component } from 'react'
import { SelectSearch, Button } from '../../form-components'
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert'
import ItemSlider from '../../singles/ItemSlider'
class AdjuntosEmpresaForm extends Component {
    updateCuenta = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'cuenta' } })
    }
    changeDate = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
    }
    render() {
        const { options, form, onChange, onSubmit, formeditado, handleChange, deleteFile, ...props } = this.props
        return (
            <Form id="form-estadoCuenta"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-estadoCuenta')
                    }
                }
                {...props}
            >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
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
                    <div className="col-md-6">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.tiposContratos}
                            placeholder="SELECCIONA EL TIPO DE CONTRATO"
                            name="tipo_adjunto"
                            value={form.tipo_adjunto}
                            onChange={this.updateTipoContrato}
                            iconclass={"fas fa-pen-fancy"}
                            messageinc="Incorrecto. Selecciona el tipo de contrato"
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless justify-content-center">
                    <div className="col-md-6 text-center">
                        <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.adjunto.placeholder}</label>
                        <ItemSlider
                            items={form.adjuntos.adjunto.files}
                            item='adjunto'
                            handleChange={handleChange}
                            multiple={true}
                        />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' className="mx-auto"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-estadoCuenta')
                                    }
                                }
                                text="ENVIAR"
                            />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default AdjuntosEmpresaForm