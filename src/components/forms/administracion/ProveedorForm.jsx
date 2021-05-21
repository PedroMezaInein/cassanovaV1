import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, Select, SelectSearch, Button, InputNumber, InputPhone } from '../../form-components'
import { RFC, TEL, EMAIL } from '../../../constants'
import { validateAlert } from '../../../functions/alert'
class ProveedorForm extends Component {
    updateArea = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'area' } })
        onChange({ target: { value: '', name: 'subarea' } })
        const { options: { areas } } = this.props
        areas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('subareas', element.subareas)
            }
            return false
        })
    }

    updateSubarea = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'subarea', value: value.toString() } })
    }

    render() {
        const { title, options, form, onChange, setOptions, onSubmit, formeditado, ...props } = this.props
        return (
            <Form id="form-proveedor"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-proveedor')
                    }
                }
                {...props}
            >
                <div className="form-group row form-group-marginless mt-4">
                    <div className="col-md-4">
                        <Input
                            requirevalidation={1}
                            name="nombre"
                            value={form.nombre}
                            placeholder="NOMBRE DE CONTACTO"
                            onChange={onChange}
                            iconclass={"far fa-user"}
                            formeditado={formeditado}
                            messageinc="Incorrecto. Ingresa el nombre."
                        />
                    </div>
                    <div className="col-md-4">
                        <Input
                            requirevalidation={1}
                            name="razonSocial"
                            value={form.razonSocial}
                            placeholder="RAZÓN SOCIAL / NOMBRE DE LA EMPRESA"
                            onChange={onChange}
                            iconclass={"far fa-building"}
                            formeditado={formeditado}
                            messageinc="Incorrecto. Ingresa la razón social."
                        />
                    </div>
                    <div className="col-md-4">
                        <Input
                            name="rfc"
                            value={form.rfc}
                            placeholder="RFC"
                            onChange={onChange}
                            iconclass={"far fa-file-alt"}
                            patterns={RFC}
                            formeditado={formeditado}
                            messageinc="Incorrecto. Ej. ABCD001122ABC"
                            maxLength="13"
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input
                            requirevalidation={0}
                            name="correo"
                            value={form.correo}
                            placeholder="CORREO ELECTRÓNICO"
                            type="email"
                            onChange={onChange}
                            iconclass={"fas fa-envelope"}
                            messageinc="Incorrecto. Ej. usuario@dominio.com"
                            patterns={EMAIL}
                            formeditado={formeditado}
                        />
                    </div>
                    <div className="col-md-4">
                        <InputPhone
                            requirevalidation={0}
                            thousandseparator={false}
                            prefix={''}
                            name="telefono"
                            value={form.telefono}
                            placeholder="TELÉFONO"
                            onChange={onChange}
                            iconclass={"fas fa-mobile-alt"}
                            messageinc="Incorrecto. Ingresa el número de teléfono."
                            patterns={TEL}
                            formeditado={formeditado}
                        />
                    </div>
                    <div className="col-md-4">
                        <InputNumber
                            requirevalidation={0}
                            name="numCuenta"
                            value={form.numCuenta}
                            placeholder="NÚMERO DE CUENTA"
                            onChange={onChange}
                            iconclass={" fas fa-id-card "}
                            formeditado={formeditado}
                            messageinc="Incorrecto. Ingresa el número de cuenta."
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Select
                            requirevalidation={0}
                            name='tipo'
                            options={options.tipos}
                            placeholder='SELECCIONA EL TIPO DE CUENTA'
                            value={form.tipo}
                            onChange={onChange}
                            formeditado={formeditado}
                            iconclass={" far fa-address-card"}
                        />
                    </div>
                    <div className="col-md-4">
                        <Select
                            requirevalidation={0}
                            name='banco'
                            options={options.bancos}
                            placeholder='SELECCIONA EL BANCO'
                            value={form.banco}
                            onChange={onChange}
                            formeditado={formeditado}
                            iconclass={" fab fa-cc-discover "}
                        />
                    </div>
                    {
                        form.leadId ?
                            <Input
                                name="leadId"
                                value={form.leadIn}
                                readOnly
                                hidden
                            />
                            : ''
                    }
                    <div className="col-md-4">
                        <SelectSearch
                            required
                            options={options.areas}
                            placeholder="SELECCIONA EL ÁREA"
                            name="area"
                            value={form.area}
                            onChange={this.updateArea}
                            formeditado={formeditado}
                            iconclass={"far fa-window-maximize"}
                            messageinc="Incorrecto. Selecciona el área"
                        />
                    </div>
                </div>
                <div className="form-group row form-group-marginless">
                    {
                        form.area ?
                            <div className="col-md-4">
                                <SelectSearch
                                    required
                                    options={options.subareas}
                                    placeholder="SELECCIONA EL SUBÁREA"
                                    name="subarea"
                                    value={form.subarea}
                                    onChange={this.updateSubarea}
                                    formeditado={formeditado}
                                    iconclass={"far fa-window-restore"}
                                    messageinc="Incorrecto. Selecciona el subárea"
                                />
                            </div>
                            : ''
                    }
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' className="btn btn-primary mr-2"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-proveedor')
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

export default ProveedorForm