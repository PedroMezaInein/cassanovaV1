import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button, Input, Calendar, Select, OptionsCheckbox } from '../form-components'
import { DATE, TEL, EMAIL } from '../../constants'
import { validateAlert } from '../../functions/alert'
import InputPhone from '../form-components/InputPhone'
import RadioGroup from '../form-components/RadioGroup'

class LeadForm extends Component {


    handleChangeCheckbox = e => {
        const { name, checked } = e.target
        const { form, onChangeCheckboxes } = this.props
        let aux = form['servicios']
        aux.find(function (_aux, index) {
            if (_aux.id.toString() === name.toString()) {
                _aux.checked = checked
            }
            return false
        });
        onChangeCheckboxes(aux)
    }


    render() {
        const { title, servicios, options, form, onChange, onChangeCalendar, onChangeCheckboxes, onSubmit, formeditado, ...props } = this.props
        return (
            <Form id="form-lead"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-lead')
                    }
                }
                {...props}
            >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            type="text"
                            placeholder="NOMBRE DEL LEAD"
                            name="nombre"
                            value={form.nombre}
                            onChange={onChange}
                            iconclass={"far fa-user"}
                            messageinc="Incorrecto. Introduce el nombre del lead."
                            completeelement={1}
                        />
                    </div>
                    <div className="col-md-4">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            type="email"
                            placeholder="CORREO ELECTRÓNICO"
                            name="email"
                            value={form.email}
                            onChange={onChange}
                            iconclass={"fas fa-envelope"}
                            messageinc="Incorrecto. Ej. usuario@dominio.com"
                            patterns={EMAIL}
                        />
                    </div>
                    <div className="col-md-4">
                        <InputPhone
                            requirevalidation={0}
                            formeditado={formeditado}
                            placeholder="TELÉFONO"
                            name="telefono"
                            value={form.telefono}
                            onChange={onChange}
                            iconclass={"fas fa-mobile-alt"}
                            patterns={TEL}
                            messageinc="Incorrecto. Ingresa el número de teléfono."
                            thousandseparator={false}
                            prefix={''}
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-3">
                        <Select
                            requirevalidation={1}
                            formeditado={formeditado}
                            placeholder="SELECCIONA LA EMPRESA PARA EL LEAD"
                            options={options.empresas}
                            name="empresa"
                            value={form.empresa}
                            onChange={onChange}
                            iconclass={"far fa-building"}
                            messageinc="Incorrecto. Selecciona la empresa para el lead."
                        />
                    </div>
                    <div className="col-md-3">
                        <Select
                            requirevalidation={1}
                            formeditado={formeditado}
                            placeholder="SELECCIONA EL ORIGEN PARA EL LEAD"
                            options={options.origenes}
                            name="origen"
                            value={form.origen}
                            onChange={onChange}
                            iconclass={" fas fa-mail-bulk"}
                            messageinc="Incorrecto. Selecciona el origen para el lead."
                        />
                    </div>
                    <div className="col-md-3">
                        <Calendar
                            required
                            formeditado={formeditado}
                            onChangeCalendar={onChangeCalendar}
                            placeholder="FECHA DE INGRESO"
                            name="fecha"
                            value={form.fecha}
                            patterns={DATE}
                        />
                    </div>
                    <div className="col-md-3">
                        <RadioGroup
                            placeholder = 'Tipo de lead'
                            formeditado = { formeditado }
                            name = 'tipo_lead'
                            onChange = { onChange }
                            options = {
                                [
                                    {
                                        label: 'Potencial',
                                        value: 'potencial'
                                    },
                                    {
                                        label: 'Basura',
                                        value: 'basura'
                                    }
                                ]
                            }
                            value = { form.tipo_lead }
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            rows="3"
                            as="textarea"
                            placeholder="COMENTARIO"
                            name="comentario"
                            value={form.comentario}
                            onChange={onChange}
                            messageinc="Incorrecto. Ingresa el comentario."
                            style={{ paddingLeft: "10px" }}
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <OptionsCheckbox
                            requirevalidation={0}
                            formeditado={formeditado}
                            placeholder="SELECCIONA LOS SERIVICIOS DE INTERÉS"
                            options={form.servicios}
                            name="servicios"
                            value={form.servicios}
                            onChange={this.handleChangeCheckbox}
                            customcolor="primary"
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
                                        validateAlert(onSubmit, e, 'form-lead')
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

export default LeadForm