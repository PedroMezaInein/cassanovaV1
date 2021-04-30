import React, { Component } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert';
import { Button, Input, MultipleRangeCalendar, TagSelectSearch, CircleColor, SelectCreate, SelectSearch } from '../../form-components';
import { COLORS } from '../../../constants'
import $ from "jquery";
class PlanTrabajoForm extends Component{
    state = {
        color: ''
    }

    transformarOptions = options => {
        options = options ? options : []
        options.map((value) => {
            value.label = value.name?value.name:value.text
            value.value = value.value ?value.value.toString():value.id.toString()
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
        const { onChange, options, onChangeOptions, form } = this.props
        options.usuarios.map((user) => {
            if (user.value === value) {
                let aux = false;
                form.usuarios.map( (element) => {
                    if (element.value === value)
                        aux = true
                    return false
                })
                if (!aux)
                    onChangeOptions({ target: { value: user.value, name: 'responsable' } }, 'usuarios')
            }
            return false
        })
        onChange({ target: { value: value, name: 'responsable' } })
    }

    handleChangeColor = (color) => {
        const { onChange } = this.props
        onChange({ target: { value: color.hex, name: 'color' } })
        this.setState({
            ...this.state,
            color:color
        });
    }

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    updateRango = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'fechas' } })
    }

    render(){
        const { title, options, form, onChange, onSubmit, formeditado, handleChangeCreate, handleCreateOption, deletePlanAlert,
            clickAddRange, clickDeleteRange } = this.props
        return(
            <Form id="form-plan" onSubmit={(e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-plan') }}>
                <Row>
                    <Col md={5} className="d-flex align-items-center justify-content-center">
                        <div className="form-group row form-group-marginless mt-4">
                            <div className="col-md-12 text-center">
                                <label className="col-form-label my-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br/>
                                <MultipleRangeCalendar onChange = { this.updateRangeCalendar } start = { form.fechaInicio }
                                    end = { form.fechaFin } arraySelection = { form.fechas } updateRango = { this.updateRango }
                                    clickAddRange = { clickAddRange } clickDeleteRange = { clickDeleteRange } />
                            </div>
                        </div>
                    </Col>
                    <Col md = { 7 } className="align-self-center">
                        <div className="form-group row form-group-marginless mt-4">
                            <div className="col-md-6">
                                <Input requirevalidation = { 1 } name = "nombre" value = { form.nombre }
                                    onChange = { onChange } placeholder = "NOMBRE DEL PLAN" formeditado = { formeditado }
                                    iconclass = "fas fa-tasks" messageinc = "Incorrecto. Ingresa el nombre del plan." />
                            </div>
                            <div className="col-md-6">
                                <SelectSearch formeditado = { formeditado } options = { options.empresas }
                                    placeholder = 'EMPRESA' name = 'empresa' value = { form.empresa }
                                    onChange = { this.updateEmpresa } iconclass = "far fa-building"
                                    messageinc="Incorrecto. Selecciona la empresa" />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-6">
                                <TagSelectSearch  placeholder = "SELECCIONA LO(S) RESPONSABLE(S)"
                                    options = { this.transformarOptions(options.usuarios) }
                                    defaultvalue = { this.transformarOptions(form.usuarios) }
                                    onChange = { this.nuevoUpdateUsuarios } requirevalidation = { 0 } 
                                    iconclass = "far fa-user"  messageinc = "Incorrecto. Selecciona lo(s) responsable(s)" />
                                
                            </div>
                            <div className="col-md-6">
                                <SelectCreate placeholder = "SELECCIONA/AGREGA EL ROL" iconclass = "far fa-file-alt"
                                    requirevalidation = { 1 } messageinc = "Incorrecto. Selecciona/agrega el rol."
                                    onChange = { handleChangeCreate } onCreateOption = { handleCreateOption }
                                    elementoactual = { form.rolTarget } options = { options.roles } />
                            </div>
                        </div>
                        {
                            form.mostrarColor ?
                                <>
                                    <div className="separator separator-dashed mt-1 mb-2"></div>
                                    <div className="form-group row form-group-marginless">
                                        <div className="col-md-12">
                                            <CircleColor circlesize = { 23 } width = "auto" onChange = { this.handleChangeColor }
                                                placeholder = "SELECCIONA EL COLOR DEL ROL" colors = { COLORS } classlabel="text-center" classname="d-flex justify-content-center" value = { this.state.color }/>
                                        </div>
                                    </div>
                                </>
                            : ""
                        }
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12">
                                <Input requirevalidation = { 0 } formeditado = { formeditado } rows = "3"
                                    as = "textarea" placeholder = "DESCRIPCIÓN" name = "descripcion"
                                    value = { form.descripcion } onChange = { onChange } style = {{ paddingLeft: "10px" }}
                                    messageinc="Incorrecto. Ingresa la descripción." />
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="card-footer py-3 pr-1 text-right">
                    {
                        title !== 'Agendar plan' ?
                            <Button icon='' className="btn btn-light-danger mr-3" text="ELIMINAR" onClick = { deletePlanAlert } />
                        : ''
                    }
                    <Button icon='' className="btn btn-primary" text="ENVIAR"
                        onClick={(e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-plan') }} />
                </div>
            </Form>
        )
    }
}

export default PlanTrabajoForm