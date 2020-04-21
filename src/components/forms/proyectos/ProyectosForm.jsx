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
        onChange( { target: { name: 'cliente', value: value.value } } )
    }

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange( { target: { name: 'empresa', value: value.value } } )
    }

    updateColonia = value => {
        const { onChange } = this.props
        onChange( { target: { name: 'colonia', value: value.value } } )
    }

    render(){
        const { title, children, form, onChange, onChangeCP, onChangeAdjunto, clearFiles, options, ... props } = this.props
        return(
            <Form { ... props}>
                <Subtitle className="text-center" color="gold">
                    {
                        title
                    }
                </Subtitle>
                {
                    children
                }
                <div className="row mx-0">
                    <div className="col-md-6">
                        <Input name="nombre" value={form.nombre} onChange={onChange} type="text" placeholder="Nombre del proyecto"/>
                    </div>
                    <div className="col-md-6">
                        <SelectSearch 
                            options={options.clientes} 
                            placeholder = "Selecciona el cliente" 
                            name = "cliente" 
                            value = { form.cliente } 
                            onChange = { this.updateCliente }
                            />
                    </div>
                    <div className="px-2 col-md-6">
                        <Input name="cp" onChange={onChangeCP} value={form.cp} type="text" placeholder="Código postal"/>
                    </div>
                    <div className="px-2 col-md-6">
                        <Input readOnly={options.colonias.length <= 0 ? true : false} value={form.estado} name="estado" type="text" placeholder="Estado"/>
                    </div>
                    <div className="px-2 col-md-6">
                        <Input readOnly={options.colonias.length <= 0 ? true : false} value={form.municipio} name="municipio" type="text" placeholder="Municipio/Delegación"/>
                    </div>
                    <div className="px-2 col-md-6">
                        { options.colonias.length > 0 && <SelectSearch options = { options.colonias } placeholder = "Selecciona la colonia" name="colonia"  
                            value = { form.colonia } defaultValue = { form.colonia } onChange = { this.updateColonia }/>}
                        { options.colonias.length <= 0 && <Input readOnly value={form.colonia} name="colonia" type="text" placeholder="Selecciona la colonia"/>}
                    </div>
                    <div className="px-2 col-md-12">
                        <Input name="calle" value={form.calle} onChange={onChange} type="text" placeholder="Calle y número"/>
                    </div>
                    <div className="col-md-6">
                        <Input name="contacto" value={form.contacto} onChange={onChange} type="text" placeholder="Nombre del contacto"/>
                    </div>
                    <div className="col-md-6">
                        <InputMoney thousandSeparator={false}  prefix = { '' } name = "numeroContacto" value = { form.numeroContacto } onChange = { onChange } placeholder="Número de contacto" />
                    </div>
                    <div className="col-md-6">
                        <SelectSearch 
                            options={options.empresas} 
                            placeholder = "Selecciona la empresa" 
                            name = "empresa" 
                            value = { form.empresa } 
                            onChange = { this.updateEmpresa }
                            />
                    </div>
                    <div className="col-md-6">
                        <InputMoney prefix = { '%' } thousandSeparator = {false} name = "porcentaje" value = { form.porcentaje } onChange = { onChange } placeholder="Porcentaje" />
                    </div>
                    <div className="col-md-6">
                        <Calendar 
                            onChangeCalendar = { this.handleChangeDateInicio }
                            placeholder = "Fecha de inicio"
                            name = "fechaInicio"
                            value = { form.fechaInicio }
                            selectsStart
                            startDate={ form.fechaInicio }
                            endDate={ form.fechaFin }
                            />
                    </div>
                    <div className="col-md-6">
                        <Calendar 
                            onChangeCalendar = { this.handleChangeDateFin }
                            placeholder = "Fecha final"
                            name = "fechaFin"
                            value = { form.fechaFin }
                            selectsEnd
                            startDate={ form.fechaInicio }
                            endDate={ form.fechaFin }
                            minDate={ form.fechaInicio }
                            />
                    </div>
                    <div className="col-md-12">
                        <FileInput 
                            onChangeAdjunto = { onChangeAdjunto } 
                            placeholder = "Imagen"
                            value = {form.adjuntos.image.value}
                            name = "image"
                            id = "image"
                            accept = "image/*" 
                            files = { form.adjuntos.image.files }
                            deleteAdjunto = { clearFiles }
                            />
                    </div>
                    <div className="col-md-12">
                        
                        <Input rows="3" as="textarea" placeholder="Descripción" name="descripcion" onChange={onChange} value={form.descripcion}/>
                    </div>
                </div>
                <Accordion>
                    <div className="px-3 pt-2">
                        <CustomToggle eventKey="adjuntos" >
                            <Small color="gold" className="label-form">
                                Aquí puedes adjuntar los archivos
                            </Small>
                        </CustomToggle>
                    </div>
                    
                    <Accordion.Collapse eventKey="adjuntos">
                        <div className="row mx-0">
                            {
                                Object.keys(form.adjuntos).map((adjunto, key)=>{
                                    
                                    if(adjunto.toString() !== 'image'){
                                        let aux = adjunto.toString()
                                        return(
                                            <div className="col-md-6" key = { key } >
                                                <FileInput 
                                                    onChangeAdjunto = { onChangeAdjunto } 
                                                    placeholder = { form['adjuntos'][aux]['placeholder'] }
                                                    value = { form['adjuntos'][aux]['value'] }
                                                    name = { aux }
                                                    id = { aux }
                                                    accept = "image/*, application/pdf" 
                                                    files = { form['adjuntos'][aux]['files'] }
                                                    deleteAdjunto = { clearFiles }
                                                    multiple
                                                    />
                                            </div>
                                            
                                        )
                                    }
                                })
                            }
                        </div>
                    </Accordion.Collapse>
                </Accordion>
                <div className="d-flex justify-content-center my-3">
                    <Button  icon='' type="submit" className="text-center mx-auto" text='Enviar' />
                </div>
                
            </Form>
        )
    }
}

export default ProyectosForm