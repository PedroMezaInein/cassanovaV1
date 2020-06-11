import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button, Input, Calendar, Select, OptionsCheckbox } from '../form-components'
import { Subtitle } from '../texts'

class LeadForm extends Component{

    constructor(props){
        super(props)
        
    }

    handleChangeCheckbox = e => {
        const { name, value, checked } = e.target
        const { form, onChangeCheckboxes } = this.props
        let aux = form['servicios']
        aux.find(function(_aux, index) {
            if(_aux.id.toString() === name.toString()){
                _aux.checked = checked
            }
        });
        onChangeCheckboxes(aux)
    }
    
    render(){
        const { title, servicios, empresas, origenes, form, onChange, onChangeCalendar, onChangeCheckboxes, ...props } = this.props
        return(
            <Form { ... props}>

                <Subtitle className="text-center" color="gold">
                    {title}
                </Subtitle>

                <div className="form-group row form-group-marginless mt-5">
                    <div className="col-md-4">
                        <Input required type="text" placeholder="Nombre"
                            name="nombre" value={ form.nombre } onChange = { onChange } iconclass={"far fa-user"} 
                        />
                        <span className="form-text text-muted">Por favor, ingrese el nombre. </span>
                    </div>
                    <div className="col-md-4">
                        <Input required type="email" placeholder="Correo electrónico"
                            name="email" value={ form.email } onChange = { onChange } iconclass={"far fa-envelope"} 
                        />
                        <span className="form-text text-muted">Por favor, ingrese su correo electrónico. </span>
                    </div>
                    <div className="col-md-4">
                            <Input required type="text" placeholder="Teléfono"
                                name="telefono" value={ form.telefono } onChange = { onChange } iconclass={"fas fa-mobile-alt"}/>
                            <span className="form-text text-muted">Por favor, ingrese su teléfono. </span>
                    </div>
                </div>
                <div class="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-8">
                        <Input required rows="2" as="textarea" placeholder="Comentario"
                            name="comentario"  value = { form.comentario } onChange = { onChange } iconclass={" far fa-comment-dots"}/>
                        <span className="form-text text-muted">Por favor, ingrese su comentario</span>
                    </div>
                    <div className="col-md-4">
                        <Calendar 
                            onChangeCalendar ={ onChangeCalendar }    
                            placeholder="Fecha de ingreso"
                            name="fecha"
                            value={form.fecha}
                            iconclass={"far fa-calendar-alt"} 
                            />
                        <span className="form-text text-muted">Por favor, ingrese su fecha de ingreso. </span>
                    </div>
                </div>
                <div class="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    
                    <div className="col-md-6">
                        <Select placeholder="Seleccione la empresa para el lead" options = { empresas } 
                            name="empresa" value = { form.empresa } onChange = { onChange } iconclass={"far fa-building"} 
                            />
                        <span className="form-text text-muted">Por favor, seleccione la empresa para el lead. </span>
                    </div>
                    <div className="col-md-6">
                        <Select placeholder="Seleccione el origen para el lead" options = { origenes } 
                            name="origen" value = { form.origen } onChange = { onChange } iconclass={" fas fa-mail-bulk "}
                            />
                        <span className="form-text text-muted">Por favor, seleccione el origen para el lead. </span>
                    </div>
                </div>
                <div class="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <OptionsCheckbox placeholder="Selecciona los serivicios de interés" options = { form.servicios } 
                            name="servicios" value = { form.servicios } onChange =  { this.handleChangeCheckbox }/>
                    </div>
                </div>
                                
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>
            </Form>
        )
    }
}

export default LeadForm