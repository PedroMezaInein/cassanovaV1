import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert';
import { Button, CalendarDay, SelectSearch } from '../../form-components';
import { ItemSlider } from '../../singles';

class CartasCalidadForm extends Component{

    updateValue = (value, name) => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: name } })
    }

    render(){
        const { onSubmit, tipo, formeditado, options, form, onChange, handleChange, deleteFile, ...props } = this.props
        return(
            <Form id = 'form-cartas-calidad' onSubmit = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-cartas-calidad')}} { ...props}>
                <div className="form-group row form-group-marginless mt-5 mx-0">
                    <div className="col-md-4">
                        <SelectSearch formeditado = { formeditado } options = { options.proyectos } placeholder = 'SELECCIONA EL PROYECTO'
                            name = 'proyecto' value = { form.proyecto } onChange = { (value) =>  { this.updateValue(value, 'proyecto') }}
                            iconclass = 'far fa-user' messageinc = 'Incorrecto. Selecciona el proyecto.' />
                    </div>
                    <div className="col-md-4">
                        <SelectSearch formeditado = { formeditado } options = { tipo === 'clientes' ? options.areasV : options.areasC } 
                            placeholder = 'SELECCIONA EL ÁREAS' name = 'area' value = { form.area } onChange = { (value) =>  { this.updateValue(value, 'area') }}
                            iconclass = 'far fa-user' messageinc = 'Incorrecto. Selecciona el área.' />
                    </div>
                    <div className="col-md-4">
                        <SelectSearch formeditado = { formeditado } options = { options.subareas } placeholder = 'SELECCIONA EL SUBÁREA'
                            name = 'subarea' value = { form.subarea } onChange = { (value) =>  { this.updateValue(value, 'subarea') }}
                            iconclass = 'far fa-user' messageinc = 'Incorrecto. Selecciona el subárea.' />
                    </div>
                </div>
                <div className="row form-group-marginless mx-0">
                    <div className="col-md-6 text-center align-self-center mt-4">
                        <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                            <label className="text-center font-weight-bolder">Fecha de entrega</label>
                        </div>
                        <CalendarDay value = { form.fecha } date = { form.fecha } onChange = { onChange } name = 'fecha' withformgroup={0} requirevalidation={1}/>
                    </div>
                    <div className="col-md-6 text-center mt-4 align-self-center">
                        <label  className="col-form-label mt-2 font-weight-bolder">Adjuntos</label>
                        <ItemSlider items = { form.adjuntos.adjunto.files } item = 'adjunto' handleChange = { handleChange } multiple = { true }
                            deleteFile = { deleteFile } />
                    </div>
                </div>
                <div className="mt-3 text-right card-footer">
                    <Button icon = '' className = "btn btn-primary" text = "ENVIAR" 
                        onClick = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-cartas-calidad') } } />
                </div>
            </Form>
        )
    }
}

export default CartasCalidadForm