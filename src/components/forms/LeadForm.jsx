import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button, Input, Calendar, Select, OptionsCheckbox } from '../form-components'
import { Subtitle } from '../texts'

class LeadForm extends Component{

    constructor(props){
        super(props)
        this.state = { validated: false };
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

    handleKeyPress(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
        //event.preventDefault();
        //event.stopPropagation();
        }
        this.setState({ validated: true });
    }
    
    render(){
        const { validated } = this.state;
        const { title, servicios, empresas, origenes, form, onChange, onChangeCalendar, onChangeCheckboxes, ...props } = this.props
        return(
            <Form { ... props}
                noValidate
                validated={validated}
                onKeyPress={e => this.handleKeyPress(e)}
                >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input 
                            required 
                            type="text" 
                            placeholder="Nombre del lead"
                            name="nombre" 
                            value={ form.nombre } 
                            onChange = { onChange } 
                            iconclass={"far fa-user"} 
                            messageinc="Incorrecto. Introduce el nombre del lead"
                        />
                        <span className="form-text text-muted">Por favor, ingresa el nombre del lead. </span>
                    </div>
                    <div className="col-md-4">
                        <Input 
                            required type="email" 
                            placeholder="Correo electrónico"
                            name="email" 
                            value={ form.email } 
                            onChange = { onChange } 
                            iconclass={"far fa-envelope"} 
                            messageinc="Incorrecto. Ej. email@dominio.com"
                        />
                        <span className="form-text text-muted">Por favor, ingresa el correo electrónico. </span>
                    </div>
                    <div className="col-md-4">
                            <Input 
                                required type="text" 
                                placeholder="Teléfono"
                                name="telefono" 
                                value={ form.telefono } 
                                onChange = { onChange } 
                                iconclass={"fas fa-mobile-alt"}
                                pattern="^(\d{10})$"
                                messageinc="Incorrecto. Ej. 1234567890"
                                maxLength="10"
                            />
                            <span className="form-text text-muted">Por favor, ingresa el teléfono. </span>
                    </div>
                </div>
                <div class="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Select 
                            placeholder="Selecciona la empresa para el lead" 
                            options = { empresas } 
                            name="empresa" 
                            value = { form.empresa } 
                            onChange = { onChange } 
                            iconclass={"far fa-building"} 
                        />
                        <span className="form-text text-muted">Por favor, selecciona la empresa para el lead. </span>
                    </div>
                    <div className="col-md-4">
                        <Select 
                            placeholder="Selecciona el origen para el lead" 
                            options = { origenes } 
                            name="origen" 
                            value = { form.origen } 
                            onChange = { onChange } 
                            iconclass={" fas fa-mail-bulk "}
                        />
                        <span className="form-text text-muted">Por favor, selecciona el origen para el lead. </span>
                    </div>
                    <div className="col-md-4">
                        <Calendar 
                            required
                            onChangeCalendar ={ onChangeCalendar }    
                            placeholder="Fecha de ingreso"
                            name="fecha"
                            value={form.fecha}
                            iconclass={"far fa-calendar-alt"}
                            messageinc="Incorrecto. Introduce la fecha de ingreso"
                            
                            />
                        <span className="form-text text-muted">Por favor, ingresa la fecha de ingreso. </span>
                    </div>
                </div>
                <div class="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <Input 
                            required 
                            rows="3" 
                            as="textarea" 
                            placeholder="Comentario"
                            name="comentario"  
                            value = { form.comentario } 
                            onChange = { onChange } 
                            iconclass={" far fa-comment-dots"}
                            messageinc="Incorrecto. Introduce un comentario"
                        />
                        <span className="form-text text-muted">Por favor, ingresa un comentario</span>
                    </div>
                </div>
                <div class="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <OptionsCheckbox 
                            placeholder="Selecciona los serivicios de interés" 
                            options = { form.servicios } 
                            name="servicios" 
                            value = { form.servicios } 
                            onChange =  { this.handleChangeCheckbox }
                        />
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