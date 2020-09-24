import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert'
import { SelectSearch, Input, InputNumber, Select, Button, SelectSearchTrue } from '../../form-components'

export default class CuentaForm extends Component {

    updateSelect = (value, name) => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: name } })
    }

    render() {
        const { options, form, onChange, formeditado, onSubmit, removeEmpresa, tipo, ...props } = this.props
        return (
            <Form id="form-cuenta"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-cuenta')
                    }
                }
                {...props}
            >
                <div className="form-group row form-group-marginless">
                    <div className={tipo === 'cajas' ? 'col-md-6' : "col-md-4"}>
                        <Input requirevalidation={1}
                            formeditado={formeditado}
                            placeholder="INGRESE EL NOMBRE DE LA CUENTA"
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={onChange}
                            iconclass="far fa-credit-card"
                            messageinc="Incorrecto. Ingresa el nombre de la cuenta."
                        />
                    </div>
                    {
                        tipo !== 'cajas' ?
                            <div className={tipo === 'cajas' ? 'd-none' : "col-md-4"}>
                                <InputNumber requirevalidation={1}
                                    formeditado={formeditado}
                                    placeholder="INGRESA EL NÚMERO DE CUENTA"
                                    type="text"
                                    name="numero"
                                    value={form.numero}
                                    onChange={onChange}
                                    iconclass=" fas fa-id-card "
                                    messageinc="Incorrecto. Ingresa el número de cuenta." />
                            </div>
                            : ''
                    }

                    <div className={tipo === 'cajas' ? 'col-md-6' : "col-md-4"}>
                        <Select requirevalidation={1}
                            formeditado={formeditado}
                            name='estatus'
                            options={options.estatus}
                            placeholder='SELECCIONA EL ESTATUS'
                            value={form.estatus}
                            onChange={onChange}
                            iconclass=" far fa-check-square "
                            messageinc="Incorrecto. Selecciona el estatus." />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <SelectSearch requirevalidation={1}
                            formeditado={formeditado}
                            name='tipo'
                            options={options.tipos}
                            placeholder='SELECCIONA EL TIPO DE CUENTA.'
                            value={form.tipo}
                            onChange={(value) => { this.updateSelect(value, 'tipo') }}
                            iconclass='far fa-address-card'
                            messageinc='Incorrecto. Selecciona el tipo de cuenta.' />
                    </div>
                    <div className="col-md-4">
                        <SelectSearch requirevalidation={1}
                            formeditado={formeditado}
                            name='banco'
                            options={options.bancos}
                            placeholder='SELECCIONA EL BANCO'
                            value={form.banco}
                            onChange={(value) => { this.updateSelect(value, 'banco') }}
                            iconclass=" fab fa-cc-discover"
                            messageinc="Incorrecto. Selecciona el banco." />
                    </div>
                    <div className="col-md-4">
                        <SelectSearchTrue requirevalidation={0}
                            formeditado={formeditado}
                            name='empresa_principal'
                            options={options.empresas}
                            placeholder='SELECCIONA LA EMPRESA PRINCIPAL'
                            value={form.empresa_principal}
                            onChange={(value) => { this.updateSelect(value, 'empresa_principal') }}
                            iconclass="far fa-building"
                            messageinc="Incorrecto. Selecciona la empresa." />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <SelectSearch requirevalidation={0}
                            formeditado={formeditado}
                            name='empresa'
                            options={options.empresas}
                            placeholder='SELECCIONA LA(S) EMPRESA(S)'
                            value={form.empresa}
                            onChange={(value) => { this.updateSelect(value, 'empresa') }}
                            iconclass="far fa-building"
                            messageinc="Incorrecto. Selecciona la(s) empresas." />
                    </div>
                    {
                        form.empresas.length > 0 ?
                            <div className="col-md-8 row mx-0 align-items-center image-upload">
                                {
                                    form.empresas.map((empresa, key) => {
                                        return (
                                            <div className="tagify form-control p-1 col-md-4 px-2 d-flex justify-content-center align-items-center" tabIndex="-1" style={{ borderWidth: "0px" }} key={key}>
                                                <div className="tagify__tag tagify__tag--primary tagify--noAnim" key={key}>
                                                    <div
                                                        title="Borrar archivo"
                                                        className="tagify__tag__removeBtn"
                                                        role="button"
                                                        aria-label="remove tag"
                                                        onClick={(e) => { e.preventDefault(); removeEmpresa(empresa) }}
                                                    >
                                                    </div>
                                                    <div><span className="tagify__tag-text p-1 white-space">{empresa.text}</span></div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            : ''
                    }
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <Input requirevalidation={0}
                            formeditado={formeditado}
                            rows="3"
                            as="textarea"
                            placeholder="DESCRIPCIÓN"
                            name="descripcion"
                            value={form.descripcion}
                            onChange={onChange}
                            style={{ paddingLeft: "10px" }}
                            messageinc="Incorrecto. Ingresa la descripción."
                        />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' className="btn btn-primary mr-2"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-cuenta')
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
