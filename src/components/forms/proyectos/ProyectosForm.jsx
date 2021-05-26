import React, { Component } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { Input, SelectSearch, Button, RangeCalendar, InputNumber, InputPhone, TagSelectSearch, TagInput } from '../../form-components'
import { TEL } from '../../../constants'
import { openWizard1, openWizard2, openWizard3 } from '../../../functions/wizard'
import { validateAlert } from '../../../functions/alert'
import ItemSlider from '../../singles/ItemSlider'
import $ from "jquery";
class ProyectosForm extends Component {

    addCorreo = () => {
        const { onChange, form } = this.props
        let aux = false
        let array = []
        if (/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,63}$/i.test(form.correo)) {
            if (form.correo) {
                form.correos.map((correo) => {
                    if (correo === form.correo)
                        aux = true
                    return false
                })
                if (!aux) {
                    array = form.correos
                    array.push(form.correo)
                    onChange({ target: { name: 'correos', value: array } })
                    onChange({ target: { name: 'correo', value: '' } })
                }
            }
        } else { alert("La dirección de email es incorrecta."); }
    }

    nuevoUpdateCliente = seleccionados =>{
        const { form,deleteOption } = this.props
        seleccionados = seleccionados?seleccionados:[];
        if(seleccionados.length>form.clientes.length){
            let diferencia = $(seleccionados).not(form.clientes).get();
            let val_diferencia = diferencia[0].value
            this.updateCliente(val_diferencia)
        }
        else {
            let diferencia = $(form.clientes ).not(seleccionados).get(); 
            diferencia.forEach(borrar=>{
                deleteOption(borrar,"clientes")
            })
        }
    }

    updateCliente = value => { 
        const { onChange, options, onChangeOptions, form } = this.props
        options.clientes.map((cliente) => {
            if (cliente.value === value) {
                let aux = false;
                form.clientes.map((element) => {
                    if (element.value === value)
                        aux = true
                    return false
                })
                if (!aux)
                    onChangeOptions({ target: { value: cliente.value, name: 'cliente' } }, 'clientes')
            }
            return false
        })
        onChange({ target: { value: value, name: 'cliente' } })
    }

    updateColonia = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'colonia', value: value } })
    }

    updateEstatus = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'estatus', value: value } })
    }

    handleToggler = e => {
        const { name, checked } = e.target
        const { onChange } = this.props
        onChange({ target: { name: name, value: checked } })
    }

    transformarOptions = options => {  
        options = options ? options : []
        options.map( (value) => {
            value.label = value.name 
            return ''
        });
        return options
    }

    updateEmpresa = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
        onChange({ target: { value: '', name: 'tipoProyecto' } })
        const { options: { empresas } } = this.props
        empresas.find(function (element, index) {
            if (value.toString() === element.value.toString())
                setOptions('tipos', element.tipos)
            return false
        })
    }

    updateTipo = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'tipoProyecto', value: value.toString() } })
    }
    
    render() {
        const { title, children, form, onChange, onChangeCP, onChangeAdjunto, onChangeAdjuntoGrupo, clearFiles, clearFilesGrupo, options, onSubmit, 
            removeCorreo, formeditado, deleteOption, onChangeOptions, action,handleChange, onChangeRange, tagInputChange, setOptions, openModalCP, ...props } = this.props
        return (
            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps">
                        <div id="wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" style={{ paddingTop: "0px" }} onClick={() => { openWizard1() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>1.</span> Datos generales</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-2" className="wizard-step" data-wizard-type="step" style={{ paddingTop: "0px" }} onClick={() => { openWizard2() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>2.</span> Ubicación</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-3" className="wizard-step" data-wizard-type="step" style={{ paddingTop: "0px" }} onClick={() => { openWizard3() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>3.</span> Fechas e imagen</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <Form onSubmit = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'wizard-3-content') } } {...props} >
                            {children}
                            <div id="wizard-1-content" className="pb-3 px-2" data-wizard-type="step-content" data-wizard-state="current">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos de generales</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className = 'col-md-2 mt-2 align-self-center'>
                                        <div className="d-flex justify-content-space-around">
                                            <div className="mr-5">
                                                <div className="text-center">
                                                    <p className="font-size-sm font-weight-bold">FASE 1</p>
                                                </div>
                                                <div className="d-flex justify-content-center">
                                                    <Form.Group>
                                                        <div className="checkbox-list pt-2">
                                                            <label className="checkbox checkbox-outline checkbox-outline-2x checkbox-primary">
                                                                <input name = 'fase1' type = "checkbox" checked = { form.fase1 } onChange = { e => this.handleToggler(e) }
                                                                    disabled = { form.fase1_relacionado === false ? false : form.fase1_relacionado } />
                                                                <span className = { form.fase1_relacionado === false ? '' : 'disabled-label-span' } ></span>
                                                            </label>
                                                        </div>
                                                    </Form.Group>
                                                </div>
                                            </div>
                                            <div className="mr-5">
                                                <div className="text-center">
                                                    <p className="font-size-sm font-weight-bold">FASE 2</p>
                                                </div>
                                                <div className="d-flex justify-content-center">
                                                    <Form.Group>
                                                        <div className="checkbox-list pt-2">
                                                            <label className="checkbox checkbox-outline checkbox-outline-2x checkbox-primary">
                                                                <input name = 'fase2' type = "checkbox" checked = { form.fase2 } onChange = { e => this.handleToggler(e) }
                                                                    disabled = { form.fase2_relacionado === false ? false : form.fase2_relacionado } />
                                                                <span className = { form.fase2_relacionado === false ? '' : 'disabled-label-span' } ></span>
                                                            </label>
                                                        </div>
                                                    </Form.Group>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-center">
                                                    <p className="font-size-sm font-weight-bold">FASE 3</p>
                                                </div>
                                                <div className="d-flex justify-content-center">
                                                    <Form.Group>
                                                        <div className="checkbox-list pt-2">
                                                            <label className="checkbox checkbox-outline checkbox-outline-2x checkbox-primary">
                                                                <input name = 'fase3' type = "checkbox" checked = { form.fase3 } onChange={e => this.handleToggler(e)}
                                                                    disabled = { form.fase3_relacionado === false ? false : form.fase3_relacionado } />
                                                                <span className = { form.fase3_relacionado === false ? '' : 'disabled-label-span' } ></span>
                                                            </label>
                                                        </div>
                                                    </Form.Group>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <Input requirevalidation = { 0 } formeditado = { formeditado } name = "nombre" value = { form.nombre }
                                            onChange = { onChange } type = "text" placeholder = "NOMBRE DEL PROYECTO" iconclass = "far fa-folder-open"
                                            messageinc="Ingresa el nombre del proyecto." />
                                    </div>
                                    <div className="col-md-3">
                                        <Input requirevalidation = { 0 } formeditado = { formeditado } name = "contacto" value = { form.contacto } 
                                            onChange = { onChange } type = "text" placeholder="NOMBRE DEL CONTACTO" iconclass = "far fa-user-circle"
                                            messageinc="Ingresa el nombre de contacto." />
                                    </div>
                                    <div className="col-md-3">
                                        <InputPhone requirevalidation = { 0 } formeditado = { formeditado } prefix = '' name="numeroContacto"
                                            value = { form.numeroContacto } onChange = { onChange } placeholder = "NÚMERO DE CONTACTO"
                                            iconclass = "fas fa-mobile-alt" messageinc = "Ingresa el número de contacto."
                                            patterns = { TEL } />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-5">
                                        <TagInput tags = { form.correos } onChange = { tagInputChange }  placeholder = "CORREO DE CONTACTO"
                                            iconclass = "far fa-folder-open" uppercase = { false } />
                                    </div>
                                    <div className="col-md-7">
                                        <TagSelectSearch placeholder = "SELECCIONA EL CLIENTE" iconclass = "far fa-folder-open"
                                            options = { this.transformarOptions(options.clientes) } requirevalidation = { 0 }
                                            defaultvalue = { this.transformarOptions(form.clientes) } onChange = { this.nuevoUpdateCliente }
                                            messageinc = "Selecciona el cliente" />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={(e) => { e.preventDefault(e); openWizard2();  openModalCP();  }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Escribe la ubicación</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <InputNumber requirevalidation = { 1 } formeditado = { formeditado } name = "cp" onChange = { onChangeCP }
                                            value = { form.cp } type = "text" placeholder = "CÓDIGO POSTAL" iconclass = "far fa-envelope"
                                            maxLength = "5" messageinc = "Ingresa el código postal." />
                                    </div>
                                    <div className="col-md-4" hidden={ form.cp === '' ? true : false}>
                                        <Input requirevalidation = { 0 } formeditado = { formeditado } name = "estado" type = "text"
                                            readOnly = { form.cp === '' ? true : false } value = { form.estado } 
                                            iconclass = "fas fa-map-marked-alt" disabled placeholder = "ESTADO" />
                                    </div>
                                    <div className="col-md-4" hidden={form.cp === '' ? true : false}>
                                        <Input requirevalidation = { 0 } formeditado = { formeditado } value = { form.municipio }
                                            readOnly = { form.cp === '' ? true : false } name = "municipio" type = "text"
                                            placeholder = "MUNICIPIO/DELEGACIÓN" iconclass = "fas fa-map-marker-alt" disabled />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2" hidden={form.cp === '' ? true : false}></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-5" hidden={form.cp === '' ? true : false}>
                                        {
                                            options.colonias.length > 0 &&
                                                <SelectSearch formeditado = { formeditado } options = { options.colonias }
                                                    placeholder = "SELECCIONA LA COLONIA" name = "colonia" iconclass = "fas fa-map-pin"
                                                    value = { form.colonia } defaultValue = { form.colonia } onChange = { this.updateColonia }
                                                    messageinc = "Selecciona la colonia" />
                                        }
                                        {
                                            form.cp === '' &&
                                                <Input requirevalidation = { 1 } formeditado = { formeditado } readOnly
                                                    value = { form.colonia } name = "colonia" type = "text"
                                                    placeholder = "SELECCIONA LA COLONIA" iconclass = "fas fa-map-pin" />
                                        }
                                    </div>
                                    <div className="col-md-7" hidden={form.cp === '' ? true : false}>
                                        <Input requirevalidation = { 1 } formeditado = { formeditado } name = "calle"
                                            value = { form.calle } onChange = { onChange } type = "text" placeholder = "CALLE Y NÚMERO"
                                            iconclass = "fas fa-map-signs" messageinc = "Ingresa la calle y número." />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard1() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard3() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-3-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa las fechas e imagenes</h5>
                                <Row className="mx-0">
                                    <Col md="4" className="text-center">
                                        <label className="col-form-label my-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br/>
                                        <RangeCalendar onChange = { onChangeRange } start = { form.fechaInicio } end = { form.fechaFin } />
                                    </Col>
                                    <Col md="8" className="align-self-center">
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-4">
                                                <InputNumber requirevalidation = { 1 } formeditado = { formeditado } placeholder = "M²"
                                                    value = { form.m2 } name = "m2" onChange = { onChange } iconclass = "fas fa-ruler-combined"
                                                    messageinc = "Ingresa los m²." />
                                            </div>
                                            <div className="col-md-4">
                                                <SelectSearch formeditado = { formeditado } options = { options.empresas }
                                                    placeholder = "EMPRESA" name = "empresa" value = { form.empresa }
                                                    onChange = { this.updateEmpresa } iconclass = "far fa-building"
                                                    messageinc = "Selecciona la empresa" />
                                            </div>
                                            <div className="col-md-4">
                                                <SelectSearch formeditado = { formeditado } options = { options.tipos } placeholder = "TIPO DE PROYECTO"
                                                    name = "tipoProyecto" value = { form.tipoProyecto } onChange = { this.updateTipo }  
                                                    iconclass = "far fa-building" messageinc = "Selecciona el tipo de proyecto" />
                                            </div>
                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-12">
                                                <Input requirevalidation = { 0 } formeditado = { formeditado } rows = "3" onChange = { onChange }
                                                    as = "textarea" placeholder = "DESCRIPCIÓN" name = "descripcion" value = { form.descripcion }
                                                    style = { { paddingLeft: "10px" } } messageinc = "Ingresa una descripción." />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                {
                                    title !== 'Editar proyecto' && 
                                    <>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless justify-content-center mt-3">
                                            <div className="col-md-6 text-center">
                                                <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.image.placeholder}</label>
                                                <ItemSlider items = { form.adjuntos.image.files } item = 'image'  handleChange = { handleChange }
                                                    multiple = { false } />
                                            </div>
                                        </div>
                                    </>
                                }
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard2() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <Button icon='' className = "btn btn-primary font-weight-bold text-uppercase"
                                            onClick = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'wizard-3-content') } }
                                            text="ENVIAR" />
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProyectosForm