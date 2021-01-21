import React, { Component } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert';
import { Button, Input, RangeCalendar, TagSelectSearch, CircleColor } from '../../form-components';
const $ = require('jquery');

const colors = ["#20ACE9", "#EE4C9E", "#62D270 ", "#E63850", "#A962E2", "#E4C127", "#1D69E1", "#8C5E4D", "##737373"];

class PlanTrabajoForm extends Component{
    updateRangeCalendar = range => {
        const { startDate, endDate } = range
        const { onChange } = this.props
        onChange({ target: { value: startDate, name: 'fechaInicio' } })
        onChange({ target: { value: endDate, name: 'fechaFin' } })
    }
    transformarOptions = options => {
        options = options ? options : []
        options.map((value) => {
            value.label = value.text
            return ''
        });
        return options
    }
    nuevoUpdateUsuarios = seleccionados => {
        const { form, deleteOption } = this.props
        seleccionados = seleccionados ? seleccionados : [];
        if (seleccionados.length > form.usuarios.length) {
            let diferencia = $(seleccionados).not(form.usuarios).get();
            let val_diferencia = diferencia[0].value
            this.updateUsuarios(val_diferencia)
        }
        else {
            let diferencia = $(form.usuarios).not(seleccionados).get();
            diferencia.forEach(borrar => {
                deleteOption(borrar, "usuarios")
            })
        }
    }
    updateUsuarios = value => {
        const { onChange, onChangeAndAdd, options } = this.props
        options.usuarios.map((user) => {
            if (user.value === value)
                onChangeAndAdd({ target: { value: user.value, name: 'responsable' } }, 'usuarios')
            return false
        })
        onChange({ target: { value: value, name: 'responsable' } })
    }

    handleChangeColor(color,event) {
        console.log(color, 'color')
        // console.log(event, 'event')
    }
    render(){
        const { title, options, form, onChange, onSubmit, formeditado, ...props } = this.props
        return(
            <Form id="form-plan" {...props} onSubmit={(e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-plan') }}>
                <Row>
                    <Col md={6}>
                        <div className="form-group row form-group-marginless mt-4">
                            <div className="col-md-12 d-flex justify-content-center">
                                <RangeCalendar
                                    onChange={this.updateRangeCalendar}
                                    start={form.fechaInicio}
                                    end={form.fechaFin}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="form-group row form-group-marginless mt-4">
                            <div className="col-md-12">
                                <Input
                                    requirevalidation={1}
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={onChange}
                                    placeholder="NOMBRE DEL PLAN"
                                    formeditado={formeditado}
                                    iconclass="far fa-building"
                                    messageinc="Incorrecto. Ingresa el nombre del plan."
                                />
                            </div>
                            <div className="col-md-12 mt-3">
                                <TagSelectSearch 
                                    placeholder = "SELECCIONA LO(S) RESPONSABLE(S)"
                                    options = { this.transformarOptions(options.usuarios) }
                                    defaultvalue = { this.transformarOptions(form.usuarios) }
                                    onChange = { this.nuevoUpdateUsuarios }
                                    requirevalidation = { 0 } iconclass = "far fa-user"
                                    messageinc = "Incorrecto. Selecciona lo(s) responsable(s)"
                                />
                            </div>
                            <div className="col-md-12 mt-3">
                                <Input
                                    requirevalidation={1}
                                    name="rol"
                                    value={form.rol}
                                    onChange={onChange}
                                    placeholder="NOMBRE DEL ROL"
                                    formeditado={formeditado}
                                    iconclass="far fa-building"
                                    messageinc="Incorrecto. Ingresa el nombre del rol."
                                />
                            </div>
                            <div className="col-md-12 d-flex justify-content-start">
                                <CircleColor
                                    onChange={ this.handleChangeColor }
                                    placeholder="SELECCIONA EL COLOR DEL ROL"
                                    colors={colors}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                
                <div className="card-footer py-3 pr-1 text-right">
                    <Button icon='' className="btn btn-primary" text="ENVIAR"
                        onClick={(e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-plan') }} />
                </div>
            </Form>
        )
    }
}

export default PlanTrabajoForm