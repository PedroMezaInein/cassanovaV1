import React, { Component } from 'react'
import { Input, InputNumber, Button, InputPhone } from '../form-components'
import { RFC, TEL } from '../../constants'
import Form from 'react-bootstrap/Form'
import { validateAlert } from '../../functions/alert'
class ClienteForm extends Component {

    updateColonia = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'colonia', value: value } })
    }

    render() {
        const { form, onChange, estado, municipio, colonias, formeditado, onSubmit, ...props } = this.props
        return (
            <Form id="form-cliente"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-cliente')
                    }
                }
                {...props}
            >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            name="empresa"
                            value={form.empresa}
                            onChange={onChange}
                            type="text"
                            placeholder="NOMBRE EMPRESA O PARTICULAR"
                            iconclass={"far fa-building"}
                            messageinc="Incorrecto. Ingresa el nombre de la empresa o particular."
                        />
                    </div>
                    <div className="col-md-4">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            name="rfc"
                            value={form.rfc}
                            onChange={onChange}
                            type="text"
                            placeholder="RFC DE LA EMPRESA O PARTICULAR"
                            iconclass={"far fa-file-alt"}
                            patterns={RFC}
                            messageinc="Incorrecto. Ej. ABCD001122ABC"
                            maxLength="13"
                        />
                    </div>
                    <div className="col-md-4">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            name="nombre"
                            value={form.nombre}
                            onChange={onChange}
                            type="text"
                            placeholder="NOMBRE DEL CONTACTO"
                            iconclass={"far fa-user"}
                            messageinc="Incorrecto. Ingresa el nombre del contacto."
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            name="puesto"
                            value={form.puesto}
                            onChange={onChange}
                            type="text"
                            placeholder="PUESTO DEL CONTACTO"
                            iconclass={" fas fa-user-tie"}
                            messageinc="Incorrecto. Ingresa el puesto del contacto."
                        />
                    </div>
                    <div className="col-md-4">
                        <InputPhone
                            requirevalidation={0}
                            thousandseparator={false}
                            prefix={''}
                            name="contacto"
                            value={form.contacto}
                            placeholder="CONTACTO"
                            onChange={onChange}
                            iconclass={"fas fa-mobile-alt"}
                            messageinc="Incorrecto. Ingresa el número de contacto."
                            patterns={TEL}
                            formeditado={formeditado}
                        />
                    </div>
                    <div className="col-md-4">
                        <InputNumber
                            requirevalidation={1}
                            formeditado={formeditado}
                            name="cp"
                            onChange={onChange}
                            value={form.cp}
                            type="text"
                            placeholder="CÓDIGO POSTAL"
                            iconclass={"far fa-envelope"}
                            maxLength="5"
                            messageinc="Incorrecto. Ingresa el código postal."
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            value={form.estado}
                            name="estado"
                            onChange={onChange}
                            type="text"
                            placeholder="ESTADO"
                            iconclass={"fas fa-map-marked-alt"}
                        />
                    </div>
                    <div className="col-md-4">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            value={form.municipio}
                            name="municipio"
                            onChange={onChange}
                            type="text"
                            placeholder="MUNICIPIO/DELEGACIÓN"
                            iconclass={"fas fa-map-marker-alt"}
                        />
                    </div>
                    <div className="col-md-4">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            value={form.colonia}
                            name="colonia"
                            onChange={onChange}
                            type="text"
                            placeholder="COLONIA"
                            iconclass={"fas fa-map-pin"}
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            name="calle"
                            value={form.calle}
                            onChange={onChange}
                            type="text"
                            placeholder="CALLE Y NÚMERO"
                            iconclass={"fas fa-map-signs"}
                            messageinc="Incorrecto. Ingresa la calle y número."
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
                                        validateAlert(onSubmit, e, 'form-cliente')
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

export default ClienteForm