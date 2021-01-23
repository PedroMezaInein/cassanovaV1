import React, { Component } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert';
import { Button, Input, RangeCalendar, TagSelectSearch, CircleColor, SelectCreate, SelectSearch } from '../../form-components';
const $ = require('jquery');

const colors = ["#20ACE9", "#EE4C9E", "#62D270 ", "#E63850", "#A962E2", "#E4C127", "#1D69E1", "#8C5E4D", "##737373"];

class PlanTrabajoForm extends Component{
    state = {
        optionsCreate: [{"label":"label", "value":"value"}],
        elementoActual: {"label":"label", "value":"value"},
        mostrarColor:false
    };

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

    handleChangeColor = (color) => {
        const { onChange } = this.props
        let {elementoActual} = this.state

        onChange({ target: { value: color.hex, name: 'color' } })
        elementoActual["color"] = color.hex;
        
        this.setState({
            elementoActual
        });
    }

    handleChangeCreate = (newValue) => {
        if(newValue==null){
            newValue={"label":"","value":""}
        }
            let nuevoValue ={
                "label":newValue.label,
                "value":newValue.value,
                "color":""
            }
            
            this.setState({
                elementoActual: nuevoValue,
                mostrarColor:false
            })
        
    };
    handleCreateOption = (inputValue) => {
        let {optionsCreate} = this.state
        let newOption = {
            "label":inputValue,
            "value":inputValue,
            "color":""
        }
        optionsCreate.push( newOption )
        this.setState({
            optionsCreate,
            elementoActual: newOption,
            mostrarColor:true
        });
        
        
    };
    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }
    render(){
        const {  elementoActual, optionsCreate,mostrarColor } = this.state
        const { title, options, form, onChange, onSubmit, formeditado, ...props } = this.props
        return(
            <Form id="form-plan" {...props} onSubmit={(e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-plan') }}>
                <Row>
                    <Col md={5} className="d-flex align-items-center justify-content-center">
                        <div className="form-group row form-group-marginless mt-4">
                            <div className="col-md-12 text-center">
                                <label className="col-form-label my-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br/>
                                <RangeCalendar
                                    onChange={this.updateRangeCalendar}
                                    start={form.fechaInicio}
                                    end={form.fechaFin}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col md={7}>
                        <div className="form-group row form-group-marginless mt-4">
                            <div className="col-md-6">
                                <Input
                                    requirevalidation={1}
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={onChange}
                                    placeholder="NOMBRE DEL PLAN"
                                    formeditado={formeditado}
                                    iconclass="fas fa-tasks"
                                    messageinc="Incorrecto. Ingresa el nombre del plan."
                                />
                            </div>
                            <div className="col-md-6">
                                <TagSelectSearch 
                                    placeholder = "SELECCIONA LO(S) RESPONSABLE(S)"
                                    options = { this.transformarOptions(options.usuarios) }
                                    defaultvalue = { this.transformarOptions(form.usuarios) }
                                    onChange = { this.nuevoUpdateUsuarios }
                                    requirevalidation = { 0 }
                                    iconclass = "far fa-user"
                                    messageinc = "Incorrecto. Selecciona lo(s) responsable(s)"
                                />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-6">
                                <SelectSearch
                                    formeditado={formeditado}
                                    options={options.empresas}
                                    placeholder='EMPRESA'
                                    name='empresa'
                                    value={form.empresa}
                                    onChange={this.updateEmpresa}
                                    iconclass={"far fa-building"}
                                    messageinc="Incorrecto. Selecciona la empresa"
                                />
                            </div>
                            <div className="col-md-6">
                                <SelectCreate
                                    placeholder="SELECCIONA/AGREGA EL ROL"
                                    iconclass={"far fa-file-alt"}
                                    requirevalidation={1}
                                    messageinc="Incorrecto. Selecciona/agrega el rol."
                                    onChange={this.handleChangeCreate}
                                    onCreateOption={this.handleCreateOption}
                                    elementoactual={elementoActual}
                                    options = { optionsCreate }
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
                                    placeholder="DESCRIPCIÓN"
                                    name="descripcion"
                                    value={form.descripcion}
                                    onChange={onChange}
                                    style={{ paddingLeft: "10px" }}
                                    messageinc="Incorrecto. Ingresa la descripción."
                                />
                            </div>
                        </div>
                        {
                            mostrarColor ?
                            <>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-12">
                                            <CircleColor
                                                circlesize={23}
                                                width="auto"
                                                onChange={ this.handleChangeColor }
                                                placeholder="SELECCIONA EL COLOR DEL ROL"
                                                colors={colors}
                                        />
                                    </div>
                                </div>
                            </>
                            :""
                        }
                        
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