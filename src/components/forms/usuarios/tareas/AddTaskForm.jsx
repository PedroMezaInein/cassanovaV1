import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { CalendarDay } from '../../../form-components'
import { SelectCreateGray, TagSelectSearchGray, InputGray } from '../../../form-components'
class AddTaskForm extends Component {

    updateResponsable = value => {
        const { onChange } = this.props
        onChange({target: { value: value, name: 'responsables'}}, true)
    }

    render() {
        const { form, tarea, onChange, formeditado, options, handleCreateOption, handleChangeCreate, ...props } = this.props
        return (
            <Form {...props}>
                <div className="row mx-0">
                    <div className="form-group row form-group-marginless col-md-12 pt-4 mx-0">
                        <div className="col-lg-5 col-12 text-center align-self-center">
                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                <label className="text-center font-weight-bolder">Fecha de entrega</label>
                            </div>
                            <CalendarDay date = { form.fecha_entrega } onChange = { (e) => { onChange(e, true) } } name='fecha_entrega' />
                        </div>
                        <div className="col-lg-7 col-12 align-self-center">
                            <div className="col-md-12 px-0">
                                <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 }
                                    withicon = { 1 } requirevalidation = { 0 } withformgroup = { 0 }
                                    formeditado = { formeditado } placeholder = 'TÍTULO DE LA TAREA'
                                    value = { form.titulo } name = 'titulo'
                                    // onBlur = { (e) => { e.preventDefault(); onChange(e, true) } }
                                    onChange = { (e) => { e.preventDefault(); onChange(e, false) } }
                                    iconclass = "fas fa-tasks" messageinc = "Incorrecto. Ingresa el título de la tarea." />
                            </div>
                            <div className="col-md-12 px-0">
                                <TagSelectSearchGray placeholder = 'Selecciona los responsables' options = { options.responsables } 
                                    iconclass = 'las la-user-friends icon-xl' defaultvalue = { form.responsables } onChange = { this.updateResponsable } />
                            </div>
                            <div className="col-md-12 px-0">
                                <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 }
                                    requirevalidation = { 0 } withformgroup = { 0 } formeditado = { formeditado }
                                    placeholder = 'DESCRIPCIÓN' value = { form.descripcion } name = 'descripcion'
                                    as = "textarea" rows = "7" messageinc = "Incorrecto. Ingresa una descripción."
                                    // onBlur = { (e) => { e.preventDefault(); onChange(e, true) } }
                                    onChange = {(e) => { e.preventDefault(); onChange(e, false) } } />
                            </div>
                            <div className="col-md-12 px-0">
                                <SelectCreateGray placeholder = "SELECCIONA EL TAG" iconclass = "flaticon2-tag"
                                    requirevalidation = { 0 } messageinc = "Incorrecto. Selecciona/agrega el rol."
                                    onChange = { handleChangeCreate } onCreateOption = { handleCreateOption }
                                    elementoactual = { form.tipoTarget } options = { options.tipos }/>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default AddTaskForm