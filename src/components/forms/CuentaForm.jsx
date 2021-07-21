import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Select, Button, InputNumber } from '../form-components'
import { validateAlert } from '../../functions/alert'
class CuentaForm extends Component {
    render() {
        const { bancos, estatus, tipos, title, form, onChange, onChangeEmpresa, updateEmpresa, empresas, empresas2, onSubmit, formeditado, tipo, ...props } = this.props
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
                <div className="form-group row form-group-marginless pt-4">
                    <div className={tipo === 'Caja chica' ? "col-md-4" : "col-md-8"}>
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            placeholder="INGRESE EL NOMBRE DE LA CUENTA"
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={onChange}
                            iconclass={"far fa-credit-card"}
                            messageinc="Incorrecto. Ingresa el nombre de la cuenta."
                        />
                    </div>
                    {
                        tipo === 'Caja chica' ?
                            <>
                                <div className="col-md-4">
                                    <Select
                                        requirevalidation={1}
                                        formeditado={formeditado}
                                        name='estatus'
                                        options={estatus}
                                        placeholder='SELECCIONA EL ESTATUS'
                                        value={form.estatus}
                                        onChange={onChange}
                                        iconclass={" far fa-check-square "}
                                        messageinc="Incorrecto. Selecciona el estatus."
                                    />
                                </div>
                                <div className="col-md-4">
                                    <Select
                                        requirevalidation={1}
                                        formeditado={formeditado}
                                        name='tipo'
                                        options={tipos}
                                        placeholder='SELECCIONA EL TIPO'
                                        value={form.tipo}
                                        onChange={onChange}
                                        iconclass={" far fa-address-card"}
                                        messageinc="Incorrecto. Selecciona el tipo."
                                    />
                                </div>
                            </>
                            :
                            <div className="col-md-4">
                                <Select
                                    requirevalidation={1}
                                    formeditado={formeditado}
                                    name='banco'
                                    options={bancos}
                                    placeholder='SELECCIONA EL BANCO'
                                    value={form.banco}
                                    onChange={onChange}
                                    iconclass={" fab fa-cc-discover"}
                                    messageinc="Incorrecto. Selecciona el banco."
                                />
                            </div>
                    }
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                {
                    tipo !== 'Caja chica' ?
                        <>
                            <div className="form-group row form-group-marginless">
                                <div className="col-md-4">
                                    <InputNumber
                                        requirevalidation={1}
                                        formeditado={formeditado}
                                        placeholder="INGRESA EL NÚMERO DE CUENTA"
                                        type="text"
                                        name="numero"
                                        value={form.numero}
                                        onChange={onChange}
                                        iconclass={" fas fa-id-card "}
                                        messageinc="Incorrecto. Ingresa el número de cuenta."
                                    />
                                </div>
                                <div className="col-md-4">
                                    <Select
                                        requirevalidation={1}
                                        formeditado={formeditado}
                                        name='tipo'
                                        options={tipos}
                                        placeholder='SELECCIONA EL TIPO'
                                        value={form.tipo}
                                        onChange={onChange}
                                        iconclass={" far fa-address-card"}
                                        messageinc="Incorrecto. Selecciona el tipo."
                                    />
                                </div>
                                <div className="col-md-4">
                                    <Select
                                        requirevalidation={1}
                                        formeditado={formeditado}
                                        name='estatus'
                                        options={estatus}
                                        placeholder='SELECCIONA EL ESTATUS'
                                        value={form.estatus}
                                        onChange={onChange}
                                        iconclass={" far fa-check-square "}
                                        messageinc="Incorrecto. Selecciona el estatus."
                                    />
                                </div>
                            </div>
                            <div className="separator separator-dashed mt-1 mb-2"></div>
                        </>
                        :
                        ''
                }
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Select
                            requirevalidation={0}
                            formeditado={formeditado}
                            name='empresa_principal'
                            options={empresas2}
                            placeholder='SELECCIONA LA EMPRESA PRINCIPAL'
                            value={form.empresa_principal}
                            onChange={onChange}
                            iconclass={"far fa-building"}
                            messageinc="Incorrecto. Selecciona la empresa."
                        />
                    </div>
                    <div className="col-md-4">
                        <Select
                            requirevalidation={0}
                            formeditado={formeditado}
                            name='empresa'
                            options={empresas}
                            placeholder='SELECCIONA LA(S) EMPRESA(S)'
                            value={form.empresa}
                            onChange={onChangeEmpresa}
                            iconclass={"far fa-building"}
                            messageinc="Incorrecto. Selecciona la(s) empresas."
                        />
                    </div>
                    {
                        form.empresas.length > 0 ?
                            <div className="col-md-4 row mx-0 align-items-center image-upload">
                                {
                                    form.empresas.map((empresa, key) => {
                                        return (
                                            <div className="tagify form-control p-1 col-md-6 px-2 d-flex justify-content-center align-items-center" tabIndex="-1" style={{ borderWidth: "0px" }}>
                                                <div className="tagify__tag tagify__tag--primary tagify--noAnim" key={key}>
                                                    <div
                                                        title="Borrar archivo"
                                                        className="tagify__tag__removeBtn"
                                                        role="button"
                                                        aria-label="remove tag"
                                                        onClick={(e) => { e.preventDefault(); updateEmpresa(empresa) }}
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
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            rows="3"
                            as="textarea"
                            placeholder="DESCRIPCIÓN"
                            name="descripcion"
                            value={form.descripcion}
                            onChange={onChange}
                            customclass="px-2"
                            messageinc="Incorrecto. Ingresa la descripción."
                        />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' className="btn btn-primary mr-2"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-cuenta')
                                    }
                                }
                                text="ENVIAR" />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default CuentaForm