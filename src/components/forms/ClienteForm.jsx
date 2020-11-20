import React, { Component } from 'react'
import { SelectSearch, Input, InputNumber, Button, InputPhone } from '../form-components'
import { RFC, TEL } from '../../constants'
import Form from 'react-bootstrap/Form'
import { validateAlert } from '../../functions/alert'
class ClienteForm extends Component {

    render() {
        const { form, onChange, changeCP, estado, municipio, colonias, updateColonia, formeditado, onSubmit, ...props } = this.props
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
                            placeholder="NOMBRE EMPRESA"
                            iconclass={"far fa-building"}
                            messageinc="Incorrecto. Ingresa el nombre de la empresa."
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
                            placeholder="RFC EMPRESA"
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
                            placeholder="NOMBRE DEL EMPLEADO"
                            iconclass={"far fa-user"}
                            messageinc="Incorrecto. Ingresa el nombre del empleado."
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
                            placeholder="PUESTO DEL EMPLEADO"
                            iconclass={" fas fa-user-tie"}
                            messageinc="Incorrecto. Ingresa el puesto del empleado."
                        />
                    </div>
                    <div className="col-md-4">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            rows="1"
                            as="textarea"
                            placeholder="PERFIL"
                            name="perfil"
                            value={form.perfil}
                            onChange={onChange}
                            iconclass={"fas fa-user-tag"}
                            messageinc="Incorrecto. Ingresa el perfil."
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
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <InputNumber
                            requirevalidation={1}
                            formeditado={formeditado}
                            name="cp"
                            onChange={changeCP}
                            value={form.cp}
                            type="text"
                            placeholder="CÓDIGO POSTAL"
                            iconclass={"far fa-envelope"}
                            maxLength="5"
                            messageinc="Incorrecto. Ingresa el código postal."
                        />
                    </div>
                    <div className="col-md-4" hidden={colonias.length <= 0 ? true : false}>
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            readOnly={colonias.length <= 0 ? true : false}
                            value={estado}
                            name="estado"
                            type="text"
                            placeholder="ESTADO"
                            iconclass={"fas fa-map-marked-alt"}
                            disabled
                        />
                    </div>
                    <div className="col-md-4" hidden={colonias.length <= 0 ? true : false}>
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            readOnly={colonias.length <= 0 ? true : false}
                            value={municipio}
                            name="municipio"
                            type="text"
                            placeholder="MUNICIPIO/DELEGACIÓN"
                            iconclass={"fas fa-map-marker-alt"}
                            disabled
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2" hidden={colonias.length <= 0 ? true : false}></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-5" hidden={colonias.length <= 0 ? true : false}>
                        {
                            colonias.length > 0 &&
                            <SelectSearch
                                formeditado={formeditado}
                                options={colonias}
                                placeholder="SELECCIONA LA COLONIA"
                                name="colonia"
                                value={form.colonia}
                                defaultValue={form.colonia}
                                onChange={updateColonia}
                                iconclass={"fas fa-map-pin"}
                                messageinc="Incorrecto. Selecciona la colonia"
                            />
                        }
                        {
                            colonias.length <= 0 &&
                            <Input
                                requirevalidation={1}
                                formeditado={formeditado}
                                readOnly
                                value={form.colonia}
                                name="colonia"
                                type="text"
                                placeholder="SELECCIONA LA COLONIA"
                                iconclass={"fas fa-map-pin"}
                            />
                        }
                    </div>
                    <div className="col-md-7" hidden={colonias.length <= 0 ? true : false}>
                        <Input
                            requirevalidation={1}
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
                    <div className="row">
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