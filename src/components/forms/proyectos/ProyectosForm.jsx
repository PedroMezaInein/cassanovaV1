import React, { Component } from 'react'
import { Form, Accordion } from 'react-bootstrap'
import {Subtitle, Small} from '../../texts'
import {Input, Select, SelectSearch, Button, Calendar, InputMoney, FileInput } from '../../form-components'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { DATE, TEL} from '../../../constants'
import {openWizard1, openWizard2, openWizard3 } from '../../../functions/wizard'

function CustomToggle({ children, eventKey }) {

    let variable = false
    
    const handleClick = useAccordionToggle(eventKey, (e) => {
        if(variable){
            variable = false
        }else{
            variable = true
        }
    },);

    
    return (
        <div className="d-flex justify-content-between">
            <div>
                {children}
            </div>
            <Button name={eventKey} className="small-button " color="transparent" icon={faPlus} text='' onClick={handleClick} />
        </div>
    );
}

class ProyectosForm extends Component{

    handleChangeDateInicio = date => {
        const { onChange, form }  = this.props
        if(form.fechaInicio > form.fechaFin){
            onChange( { target: { name: 'fechaFin', value: date } } )
        }
        onChange( { target: { name: 'fechaInicio', value: date } } )
    }

    handleChangeDateFin = date => {
        const { onChange }  = this.props
        onChange( { target: { name: 'fechaFin', value: date } } )
    }

    updateCliente = value => {
        const { onChange } = this.props
        onChange( { target: { name: 'cliente', value: value } } )
    }

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange( { target: { name: 'empresa', value: value } } )
    }

    updateColonia = value => {
        const { onChange } = this.props
        onChange( { target: { name: 'colonia', value: value } } )
    }

    render(){
        const { title, children, form, onChange, onChangeCP, onChangeAdjunto, onChangeAdjuntoGrupo, clearFiles, clearFilesGrupo, options, ... props } = this.props
        return(
            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps px-8 py-0 px-lg-15 py-lg-0"> 
                        <div id="wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" style={{paddingTop:"0px"}} onClick = { () => { openWizard1() } }>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                <span>1.</span> Datos generales</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div> 
                        <div id="wizard-2" className="wizard-step" data-wizard-type="step" style={{paddingTop:"0px"}} onClick = { () => { openWizard2() } }>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                <span>2.</span> Ubicación</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div> 
                        <div id="wizard-3" className="wizard-step" data-wizard-type="step" style={{paddingTop:"0px"}} onClick = { () => { openWizard3() } }>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                <span>3.</span> Fechas e imagen</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>   
                    </div>
                </div>
                <div className="row justify-content-center py-10 px-8 py-lg-12 px-lg-10">
                    <div className="col-xl-12 col-xxl-7">             
                        <Form 
                            { ... props}
                            >
                            {children}
                            <div id="wizard-1-content" className="pb-3" data-wizard-type="step-content" data-wizard-state="current">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos de generales</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-6">
                                        <Input 
                                            name="nombre"
                                            value={form.nombre}
                                            onChange={onChange}
                                            type="text"
                                            placeholder="Nombre del proyecto"
                                            iconclass={"far fa-folder-open"}
                                            messageinc="Incorrecto. Ingresa el nombre del proyecto."
                                        />
                                        {/*<span className="form-text text-muted">Por favor, ingresa el nombre del proyecto.</span>*/}
                                    </div>
                                    <div className="col-md-6">
                                        <SelectSearch 
                                            options={options.clientes} 
                                            placeholder = "Selecciona el cliente" 
                                            name = "cliente" 
                                            value = { form.cliente } 
                                            onChange = { this.updateCliente }
                                            iconclass={"far fa-user"}
                                        />
                                        {/*<span className="form-text text-muted">Por favor, selecciona el cliente</span>*/}
                                    </div>      
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-6">                                       
                                        <Input 
                                            thousandSeparator={false}
                                            prefix = { '' }
                                            name = "numeroContacto"
                                            value = { form.numeroContacto }
                                            onChange = { onChange }
                                            placeholder="Número de contacto"
                                            iconclass={"fas fa-mobile-alt"}                                            
                                            messageinc="Incorrecto. Ingresa el número de contacto."
                                            patterns={TEL}
                                            maxLength="10"
                                        />
                                        {/*<span className="form-text text-muted">Por favor, ingresa el número de contacto. </span>*/}
                                    </div>
                                    <div className="col-md-6">
                                        <Input 
                                            name="contacto"
                                            value={form.contacto}
                                            onChange={onChange}
                                            type="text"
                                            placeholder="Nombre del contacto"
                                            iconclass={"far fa-user-circle"}
                                            messageinc="Incorrecto. Ingresa el nombre de contacto."
                                        />
                                        {/*<span className="form-text text-muted">Por favor, ingresa el nombre del contacto. </span>*/}
                                    </div>                            
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick = { () => { openWizard2() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Escribe la ubicación</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <Input 
                                            name="cp"
                                            onChange={onChangeCP}
                                            value={form.cp}
                                            type="text"
                                            placeholder="Código postal"
                                            iconclass={"far fa-envelope"}
                                            maxLength="5"
                                            messageinc="Incorrecto. Ingresa el código postal."
                                        />
                                        {/*<span className="form-text text-muted">Por favor, ingresa el código postal. </span>*/}
                                    </div>
                                    <div className="col-md-4" hidden={options.colonias.length <= 0 ? true : false}>
                                        <Input 
                                            readOnly={options.colonias.length <= 0 ? true : false}
                                            value={form.estado}
                                            name="estado"
                                            type="text"
                                            placeholder="Estado"
                                            iconclass={"fas fa-map-marked-alt"}
                                            disabled
                                        />
                                        {/*<span className="form-text text-muted">Por favor, ingrese su estado. </span>*/}
                                    </div>
                                    <div className="col-md-4" hidden={options.colonias.length <= 0 ? true : false}>
                                        <Input 
                                            readOnly={options.colonias.length <= 0 ? true : false}
                                            value={form.municipio}
                                            name="municipio"
                                            type="text"
                                            placeholder="Municipio/Delegación"
                                            iconclass={"fas fa-map-marker-alt"}
                                            disabled                                            
                                        />
                                        {/*<span className="form-text text-muted">Por favor, ingresa el municipio/delegación. </span>*/}
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2" hidden={options.colonias.length <= 0 ? true : false}></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-5" hidden={options.colonias.length <= 0 ? true : false}>
                                        { 
                                            options.colonias.length > 0 && 
                                                <SelectSearch 
                                                    options = { options.colonias } 
                                                    placeholder = "Selecciona la colonia" 
                                                    name="colonia" 
                                                    iconclass={"fas fa-map-pin"}
                                                    value = { form.colonia }
                                                    defaultValue = { form.colonia }
                                                    onChange = { this.updateColonia }
                                                /> 
                                        }
                                        { 
                                            options.colonias.length <= 0 && 
                                                <Input 
                                                    readOnly
                                                    value={form.colonia}
                                                    name="colonia" type="text"
                                                    placeholder="Selecciona la colonia"
                                                    iconclass={"fas fa-map-pin"}
                                                />
                                        }
                                        {/*<span className="form-text text-muted">Por favor, selecciona la colonia.</span>*/}
                                    </div>  
                                    <div className="col-md-7" hidden={options.colonias.length <= 0 ? true : false}>
                                        <Input 
                                            name="calle"
                                            value={form.calle}
                                            onChange={onChange}
                                            type="text"
                                            placeholder="Calle y número"
                                            iconclass={"fas fa-map-signs"}
                                            messageinc="Incorrecto. Ingresa la calle y número."
                                        />
                                        {/*<span className="form-text text-muted">Por favor, ingresa la calle y el número. </span>*/}
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick = { () => { openWizard1() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick = { () => { openWizard3() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-3-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa las fechas e imagenes</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <SelectSearch 
                                            options={options.empresas} 
                                            placeholder = "Selecciona la empresa" 
                                            name = "empresa" 
                                            value = { form.empresa } 
                                            onChange = { this.updateEmpresa }
                                            iconclass={"far fa-building"}
                                        />
                                        {/*<span className="form-text text-muted">Por favor, selecciona el cliente</span>*/}
                                    </div>
                                    <div className="col-md-4">
                                        <InputMoney 
                                            prefix = { '%' }
                                            thousandSeparator = {false}
                                            name = "porcentaje"
                                            value = { form.porcentaje }
                                            onChange = { onChange }
                                            placeholder="Porcentaje"
                                            iconclass={"fas fa-percent"}
                                        />
                                        {/*<span className="form-text text-muted">Por favor, ingresa el porcentaje. </span>*/}
                                    </div>
                                    <div className="col-md-4">
                                        <FileInput 
                                            onChangeAdjunto = { onChangeAdjunto } 
                                            placeholder = "Imagen"
                                            value = {form.adjuntos.image.value}
                                            name = "image"
                                            id = "image"
                                            accept = "image/*" 
                                            files = { form.adjuntos.image.files }
                                            deleteAdjunto = { clearFiles }
                                            iconclass={"far fa-file-image"}
                                            />
                                        {/*<span className="form-text text-muted">Por favor, ingrese su imagen. </span>*/}
                                    </div>                                    
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">  
                                    <div className="col-md-4">
                                        <Calendar 
                                            onChangeCalendar = { this.handleChangeDateInicio }
                                            placeholder = "Fecha de inicio"
                                            name = "fechaInicio"
                                            value = { form.fechaInicio }
                                            selectsStart
                                            startDate={ form.fechaInicio }
                                            endDate={ form.fechaFin }
                                            iconclass={"far fa-calendar-alt"}
                                            /* pattern={DATE}        */                 
                                        />
                                        {/*<span className="form-text text-muted">Por favor, ingrese su fecha de inicio. </span>*/}
                                    </div>
                                    <div className="col-md-4">
                                        <Calendar 
                                            onChangeCalendar = { this.handleChangeDateFin }
                                            placeholder = "Fecha final"
                                            name = "fechaFin"
                                            value = { form.fechaFin }
                                            selectsEnd
                                            startDate={ form.fechaInicio }
                                            endDate={ form.fechaFin }
                                            minDate={ form.fechaInicio }
                                            iconclass={"far fa-calendar-alt"}
                                            /* patterns={DATE} */
                                        />
                                        {/*<span className="form-text text-muted">Por favor, ingrese su fecha de final. </span>*/}
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">                                
                                    <div className="col-md-12">
                                        <Input 
                                            rows="3"
                                            as="textarea"
                                            placeholder="Descripción"
                                            name="descripcion"
                                            onChange={onChange}
                                            value={form.descripcion}
                                            style={{paddingLeft:"10px"}}
                                            messageinc="Incorrecto. Ingresa una descripción."
                                        />
                                        {/*<span className="form-text text-muted">Por favor, ingrese su descripción. </span>*/}
                                    </div>
                                </div>
                            {
                                title !== 'Editar proyecto' ?
                                <Accordion>
                                    {
                                        form.adjuntos_grupo.map( (grupo, key) => {
                                            return(
                                                <div key = {key}>
                                                    <div className="px-3 pt-2">
                                                        <CustomToggle eventKey={grupo.id} >
                                                            <strong>
                                                                <p className="label-form">
                                                                    {grupo.text}
                                                                </p>
                                                            </strong>
                                                        </CustomToggle>
                                                    </div>
                                                    <Accordion.Collapse eventKey={grupo.id}>
                                                        <div className="row mx-0">
                                                            {
                                                                grupo.adjuntos.map( (adjunto, key) => {
                                                                    return(
                                                                        <div key = { key }>
                                                                            <div className="col-md-6"  >
                                                                                <FileInput 
                                                                                    onChangeAdjunto = { onChangeAdjuntoGrupo } 
                                                                                    placeholder = { adjunto.placeholder }
                                                                                    value = { adjunto.value }
                                                                                    name = { adjunto.id }
                                                                                    id = { adjunto.id }
                                                                                    accept = "image/*, application/pdf" 
                                                                                    files = { adjunto.files }
                                                                                    deleteAdjunto = { clearFilesGrupo }
                                                                                    multiple
                                                                                    iconclass={"fas fa-paperclip"}     
                                                                                    />
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </Accordion.Collapse>
                                                </div>
                                            )
                                            
                                        })
                                    }
                                </Accordion>
                                : ''
                            }
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase"  onClick = { () => { openWizard2() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" type="submit" data-wizard-type="action-submit" text="Enviar" />
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