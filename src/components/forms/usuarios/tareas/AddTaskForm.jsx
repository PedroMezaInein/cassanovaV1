import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { CalendarDay } from '../../../form-components'
import { SelectCreateGray, TagSelectSearchGray, InputGray, Button, CircleColor} from '../../../form-components'
import { COLORS } from '../../../../constants'
class AddTaskForm extends Component {
    state = {
        color: ''
    }
    updateResponsable = value => {
        const { onChange } = this.props
        onChange({target: { value: value, name: 'responsables'}}, true)
    }

    handleChangeColor = (color) => {
        const { onChange } = this.props
        onChange({ target: { value: color.hex, name: 'color' } })
        this.setState({
            ...this.state,
            color:color
        });
    }

    render() {
        const { form, tarea, onChange, formeditado, options, handleCreateOption, handleChangeCreate, onSubmit, ...props } = this.props
        return (
            <Form {...props}>
                <div className="row mx-0">
                    <div className="row form-group-marginless col-md-12 pt-4 mx-0">
                        <div className="col-lg-5 col-12 text-center align-self-center">
                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                <label className="text-center font-weight-bolder text-dark-60">Fecha de entrega</label>
                            </div>
                            <CalendarDay date = { form.fecha_entrega } onChange = { (e) => { onChange(e, true) } } name='fecha_entrega' />
                        </div>
                        <div className="col-lg-7 col-12 align-self-center">
                            <div className="col-md-12 px-0 mb-3">
                                <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 }
                                    withicon = { 1 } requirevalidation = { 0 } withformgroup = { 0 }
                                    formeditado = { formeditado } placeholder = 'TÍTULO DE LA TAREA'
                                    value = { form.titulo } name = 'titulo'
                                    // onBlur = { (e) => { e.preventDefault(); onChange(e, true) } }
                                    onChange = { (e) => { e.preventDefault(); onChange(e, false) } }
                                    iconclass = "fas fa-tasks" messageinc = "Incorrecto. Ingresa el título de la tarea." />
                            </div>
                            <div className="col-md-12 px-0 mb-3">
                                <TagSelectSearchGray placeholder = 'Selecciona los responsables' options = { options.responsables } 
                                    iconclass = 'las la-user-friends icon-xl' defaultvalue = { form.responsables } onChange = { this.updateResponsable } />
                            </div>
                            <div className="col-md-12 px-0 mb-3">
                                <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 }
                                    requirevalidation = { 0 } withformgroup = { 0 } formeditado = { formeditado }
                                    placeholder = 'DESCRIPCIÓN' value = { form.descripcion } name = 'descripcion'
                                    as = "textarea" rows = "7" messageinc = "Incorrecto. Ingresa una descripción."
                                    // onBlur = { (e) => { e.preventDefault(); onChange(e, true) } }
                                    onChange = {(e) => { e.preventDefault(); onChange(e, false) } } />
                            </div>
                            <div className="col-md-12 px-0 mb-3">
                                <SelectCreateGray placeholder = "SELECCIONA EL TAG" iconclass = "flaticon2-tag"
                                    requirevalidation = { 0 } messageinc = "Incorrecto. Selecciona/agrega el rol."
                                    onChange = { handleChangeCreate } onCreateOption = { handleCreateOption }
                                    elementoactual = { form.tipoTarget } options = { options.tipos }/>
                            </div>
                            <div className="col-md-9 card card-custom bg-light gutter-b mt-10 mx-auto shadow">
                                <div className="card-header border-0">
                                    <h3 className="card-title font-weight-bold text-dark">
                                        <span className="d-block text-dark font-weight-bolder">NUEVO TAG</span>
                                    </h3>
                                </div>
                                <div className="card-body pt-2">
                                    <form className="form" id="kt_form_1">
                                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 }
                                            withicon = { 0 } requirevalidation = { 0 } withformgroup = { 1 }
                                            formeditado = { formeditado } placeholder = 'NOMBRE DEL TAG'
                                            value = { form.nuevo_tag } name = 'nuevo_tag'
                                            onChange = { (e) => { e.preventDefault(); onChange(e, false) } }
                                            iconclass = "fas fa-tasks" messageinc = "Incorrecto. Ingresa el título de la tarea." customclass='bg-white'
                                        />
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-12">
                                                <CircleColor circlesize = { 20 } width = "auto" onChange = { this.handleChangeColor }
                                                    placeholder = "SELECCIONA EL COLOR DEL TAG" colors = { COLORS } classlabel="font-weight-bold text-dark-60" classname="d-flex justify-content-center" value = { this.state.color }/>
                                            </div>
                                        </div>
                                        <div className="mt-5 text-center">
                                            <Button icon = '' className="btn btn-primary" onClick = { '' } text="AGREGAR" />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer px-0 pt-4 pb-0">
                    <div className="row row-paddingless mx-0">
                        <div className="col-lg-12 text-right">
                            <Button icon = '' className="btn btn-primary" onClick = { onSubmit } text="ENVIAR" />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default AddTaskForm