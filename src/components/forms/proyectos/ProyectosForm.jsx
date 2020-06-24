import React, { Component } from 'react'
import { Form, Accordion } from 'react-bootstrap'
import {Subtitle, Small} from '../../texts'
import {Input, Select, SelectSearch, Button, Calendar, InputMoney, FileInput } from '../../form-components'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'


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
            <Form { ... props}>
                
                {
                    children
                }
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input name="nombre" value={form.nombre} onChange={onChange} type="text" placeholder="Nombre del proyecto" iconclass={"far fa-folder-open"}/>
                        <span className="form-text text-muted">Por favor, ingrese su nombre del proyecto. </span>
                    </div>
                    <div className="col-md-4">
                        <SelectSearch 
                            options={options.clientes} 
                            placeholder = "Selecciona el cliente" 
                            name = "cliente" 
                            value = { form.cliente } 
                            onChange = { this.updateCliente }
                            iconclass={"far fa-user"}
                        />
                        <span className="form-text text-muted">Por favor, selecciona el cliente</span>
                    </div>
                    <div className="col-md-4">
                        <Input name="cp" onChange={onChangeCP} value={form.cp} type="text" placeholder="Código postal" iconclass={"far fa-envelope"}/>
                        <span className="form-text text-muted">Por favor, ingrese su código postal. </span>
                    </div>
                </div>
                <div class="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input readOnly={options.colonias.length <= 0 ? true : false} value={form.estado} name="estado" type="text" placeholder="Estado" iconclass={"fas fa-map-marked-alt"}/>
                        <span className="form-text text-muted">Por favor, ingrese su estado. </span>
                    </div>
                    <div className="col-md-4">
                        <Input readOnly={options.colonias.length <= 0 ? true : false} value={form.municipio} name="municipio" type="text" placeholder="Municipio/Delegación" iconclass={"fas fa-map-marker-alt"}/>
                        <span className="form-text text-muted">Por favor, ingrese su municipio/delegación. </span>
                    </div>
                    <div className="col-md-4">
                        { options.colonias.length > 0 && <SelectSearch options = { options.colonias } placeholder = "Selecciona la colonia" name="colonia" iconclass={"fas fa-map-pin"}
                            value = { form.colonia } defaultValue = { form.colonia } onChange = { this.updateColonia }/> }
                        { options.colonias.length <= 0 && <Input readOnly value={form.colonia} name="colonia" type="text" placeholder="Selecciona la colonia" iconclass={"fas fa-map-pin"}/>}
                        <span className="form-text text-muted">Por favor, selecciona la colonia.</span>
                    </div>                    
                </div>
                <div class="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input name="calle" value={form.calle} onChange={onChange} type="text" placeholder="Calle y número" iconclass={"fas fa-map-signs"}/>
                        <span className="form-text text-muted">Por favor, ingrese su calle y número. </span>
                    </div>
                    <div className="col-md-4">
                        <Input name="contacto" value={form.contacto} onChange={onChange} type="text" placeholder="Nombre del contacto" iconclass={"far fa-user-circle"}/>
                        <span className="form-text text-muted">Por favor, ingrese su nombre del contacto. </span>
                    </div>
                    <div className="col-md-4">
                        <InputMoney thousandSeparator={false}  prefix = { '' } name = "numeroContacto" value = { form.numeroContacto } onChange = { onChange } placeholder="Número de contacto" iconclass={"fas fa-mobile-alt"}/>
                        <span className="form-text text-muted">Por favor, ingrese su número de contacto. </span>
                    </div>
                </div>
                <div class="separator separator-dashed mt-1 mb-2"></div>
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
                        <span className="form-text text-muted">Por favor, selecciona la empresa</span>
                    </div>
                    <div className="col-md-4">
                        <InputMoney prefix = { '%' } thousandSeparator = {false} name = "porcentaje" value = { form.porcentaje } onChange = { onChange } placeholder="Porcentaje" iconclass={"fas fa-percent"}/>
                        <span className="form-text text-muted">Por favor, ingrese su número de contacto. </span>
                    </div>
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
                        />
                        <span className="form-text text-muted">Por favor, ingrese su fecha de inicio. </span>
                    </div>
                </div>
                <div class="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
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
                            />
                        <span className="form-text text-muted">Por favor, ingrese su fecha de final. </span>
                    </div>
                    <div className="col-md-8">
                        <Input rows="1" as="textarea" placeholder="Descripción" name="descripcion" onChange={onChange} value={form.descripcion} iconclass={"far fa-file-alt"}/>
                        <span className="form-text text-muted">Por favor, ingrese su descripción. </span>
                    </div>
                </div>
                <div class="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
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
                        <span className="form-text text-muted">Por favor, ingrese su imagen. </span>
                    </div>
                </div>

                {
                    title !== 'Editar proyecto' ?
                    <Accordion>
                        {
                            form.adjuntos_grupos.map((grupo, key_grupo)=>{
                                return(
                                    <>
                                        <div className="px-3 pt-2">
                                            <CustomToggle eventKey={grupo.value} >
                                                <Small color="gold" className="label-form">
                                                    {grupo.text}
                                                </Small>
                                            </CustomToggle>
                                        </div>
                                        <Accordion.Collapse eventKey={grupo.value}>
                                            <div className="row mx-0">
                                                {
                                                    grupo.adjuntos.map((adjunto, key)=>{
                                                        
                                                        if(adjunto.toString() !== 'image'){
                                                            let aux = adjunto.id.toString()
                                                            return(
                                                                <div className="col-md-4 px-2" key = { key } >
                                                                    <FileInput 
                                                                        onChangeAdjunto = { onChangeAdjuntoGrupo } 
                                                                        placeholder = { adjunto['placeholder'] }
                                                                        value = { adjunto['value'] }
                                                                        name = { adjunto['id'] }
                                                                        id = { adjunto['id'] }
                                                                        accept = "image/*, application/pdf" 
                                                                        files = { adjunto['files'] }
                                                                        deleteAdjunto = { clearFilesGrupo }
                                                                        multiple
                                                                        iconclass={"fas fa-paperclip"}     
                                                                        />
                                                                </div>
                                                                
                                                            )
                                                        }
                                                    })
                                                }
                                            </div>
                                        </Accordion.Collapse>
                                    </>
                                )
                            })
                        }
                        
                        
                        
                    </Accordion>
                    : ''
                }
                <div className="d-flex justify-content-center my-3">
                    <Button  icon='' type="submit" className="text-center mx-auto" text='Enviar' />
                </div>
                
            </Form>
        )
    }
}

export default ProyectosForm