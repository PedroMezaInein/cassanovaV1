import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button, TagSelectSearchGray } from '../form-components'
import InputGray from '../form-components/Gray/InputGray'
import { CalendarDay } from '../form-components'
import { questionAlert, deleteAlert } from '../../functions/alert'
class TareaForm extends Component {

    updateResponsable = value => {
        const { onChange } = this.props
        onChange({target: { value: value, name: 'responsables'}}, true)
    }

    render() {
        const { form, tarea, onChange, deleteTarea, endTarea, formeditado, options, update, ...props } = this.props
        return (
            <Form {...props}>
                <div className="row mx-0">
                    <div className="form-group row form-group-marginless col-md-12 pt-4 mx-0">
                        <div className="col-lg-5 col-12 text-center align-self-center">
                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                <label className="text-center font-weight-bolder">Fecha de entrega</label>
                            </div>
                            <CalendarDay date = { form.fecha_limite } onChange = { (e) => { onChange(e, true) } } name='fecha_limite' requirevalidation={1}/>
                        </div>
                        <div className="col-lg-7 col-12 align-self-center">
                            <div className="col-md-12 px-0">
                                <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 }
                                    withicon = { 1 } requirevalidation = { 0 } withformgroup = { 1 }
                                    formeditado = { formeditado } placeholder = 'TÍTULO DE LA TAREA'
                                    value = { form.titulo } name = 'titulo'
                                    onBlur = { (e) => { e.preventDefault(); onChange(e, true) } }
                                    onChange = { (e) => { e.preventDefault(); onChange(e, false) } }
                                    iconclass = "fas fa-tasks" messageinc = "Incorrecto. Ingresa el título de la tarea." />
                            </div>
                            <div className="col-md-12 px-0">
                                <TagSelectSearchGray placeholder = 'Selecciona los responsables' options = { options.responsables } 
                                    iconclass = 'flaticon-customer' defaultvalue = { form.responsables } onChange = { this.updateResponsable } />
                            </div>
                            <div className="col-md-12 px-0">
                                <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 }
                                    requirevalidation = { 0 } withformgroup = { 1 } formeditado = { formeditado }
                                    placeholder = 'DESCRIPCIÓN' value = { form.descripcion } name = 'descripcion'
                                    as = "textarea" rows = "7" messageinc = "Incorrecto. Ingresa una descripción."
                                    onBlur = { (e) => { e.preventDefault(); onChange(e, true) } }
                                    onChange = {(e) => { e.preventDefault(); onChange(e, false) } } />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 d-flex justify-content-center align-items-center mt-1">
                            <Button icon = '' className = "btn btn-icon btn-xs w-auto p-3 btn-light-gray mr-2 mt-2"
                                onClick = { (e) => { questionAlert('¿ESTÁS SEGURO QUE DESEAS TERMINAR LA TAREA?', '¡NO PODRÁS REVERTIR ESTO!', () => endTarea(tarea.id)) } }
                                only_icon = "far fa-calendar-check icon-15px mr-2" text = 'TERMINAR TAREA' />
                            <Button icon = '' className = "btn btn-icon btn-xs w-auto p-3 btn-light-danger mr-2 mt-2"
                                onClick = { (e) => { deleteAlert('¿ESTÁS SEGURO QUE DESEAS ELIMINAR LA TAREA?', '¡NO PODRÁS REVERTIR ESTO!', () => deleteTarea(tarea.id)) } }
                                only_icon = "far fa-trash-alt icon-15px mr-2" text = 'ELIMINAR TAREA' />
                        </div>
                </div>
            </Form>
        )
    }
}

export default TareaForm