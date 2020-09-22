import React, { Component } from 'react'
import { SelectSearch, Input, InputNumber } from '../form-components'
import { RFC } from '../../constants'

class ClienteForm extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        const { form, onChange, changeCP, estado, municipio, colonias, updateColonia, formeditado } = this.props
        return (
            <>
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
                    <div className="col-md-8">
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
            </>
        )
    }

}

export default ClienteForm