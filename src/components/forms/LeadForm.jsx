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
            if(_aux.id == name){
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

                <div className="row mx-0">
                    
                    <div className="col-md-4 px-2">
                        <Input required type="text" placeholder="Nombre"
                            name="nombre" value={ form.nombre } onChange = { onChange }
                            />
                    </div>
                    <div className="col-md-4 px-2">
                        <Input required type="email" placeholder="Correo electrónico"
                            name="email" value={ form.email } onChange = { onChange }
                            />
                    </div>
                    <div className="col-md-4 px-2">
                        <Input required type="text" placeholder="Teléfono"
                            name="telefono" value={ form.telefono } onChange = { onChange }/>
                    </div>

                    <div className="col-md-12 px-2">
                        <Input required rows="3" as="textarea" placeholder="Comentario"
                            name="comentario"  value = { form.comentario } onChange = { onChange } />
                    </div>

                    <div className="col-md-4 px-2">
                        <Calendar 
                            onChangeCalendar ={ onChangeCalendar }    
                            placeholder="Fecha de ingreso"
                            name="fecha"
                            value={form.fecha}
                            />
                    </div>
                    <div className="col-md-4 px-2">
                        <Select placeholder="Selecciona la empresa para el lead" options = { empresas } 
                            name="empresa" value = { form.empresa } onChange = { onChange } 
                            />
                    </div>
                    <div className="col-md-4 px-2">
                        <Select placeholder="Selecciona el origen para el lead" options = { origenes } 
                            name="origen" value = { form.origen } onChange = { onChange } 
                            />
                    </div>

                    <div className="col-md-12 px-2">
                        <OptionsCheckbox placeholder="Selecciona los serivicios de interés" options = { form.servicios } 
                            name="servicios" value = { form.servicios } onChange =  { this.handleChangeCheckbox }/>
                    </div>

                </div>
                
                <div className="mt-3 text-center">
                    <Button className="mx-auto" type="submit" text="Enviar" />
                </div>

            </Form>
        )
    }
}

export default LeadForm