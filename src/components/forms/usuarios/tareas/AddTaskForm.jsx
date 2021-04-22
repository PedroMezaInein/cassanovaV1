import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { CalendarDay } from '../../../form-components'
import { SelectCreateGray, TagSelectSearchGray, InputGray, Button, CircleColor} from '../../../form-components'
import { COLORS } from '../../../../constants'
import { NewTag } from '../..'
class AddTaskForm extends Component {

    state = {
        color: '',
        newTag: false
    }

    updateResponsable = value => {
        const { onChange } = this.props
        onChange({target: { value: value, name: 'responsables'}}, true)
    }

    updateTag = valor => {
        const { onChange } = this.props
        let flag = true
        if(valor)
            if(valor.length)
                if(valor[valor.length - 1].value === 'nueva_etiqueta')
                    flag = false
        if(flag)
            onChange({target: { value: valor, name: 'tags'}}, true)
        else
            this.setState({...this.state, newTag: true })
    }

    sendTag = e => {
        const { sendTag } = this.props
        this.setState({...this.state, newTag: false})
        sendTag(e)
    }

    closeCard = () => {
        const { onChange } = this.props
        onChange({target: { value: '', name: 'color'}}, true)
        onChange({target: { value: '', name: 'nuevo_tag'}}, true)
        this.setState({...this.state, newTag: false})
    }

    render() {
        const { form, tarea, onChange, formeditado, options, handleCreateOption, handleChangeCreate, onSubmit, sendTag, ...props } = this.props
        const { newTag } = this.state
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
                            <div className="row mx-0 justify-content-center">
                                <div className="col-md-12 px-0 mb-3">
                                    <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } 
                                        requirevalidation = { 0 } withformgroup = { 0 } formeditado = { formeditado } 
                                        placeholder = 'TÍTULO DE LA TAREA' value = { form.titulo } name = 'titulo'
                                        onChange = { (e) => { e.preventDefault(); onChange(e, false) } } iconclass = "fas fa-tasks" 
                                        messageinc = "Incorrecto. Ingresa el título de la tarea." />
                                </div>
                                <div className="col-md-12 px-0 mb-3">
                                    <TagSelectSearchGray placeholder = 'Selecciona los responsables' options = { options.responsables } 
                                        iconclass = 'las la-user-friends icon-xl' defaultvalue = { form.responsables } onChange = { this.updateResponsable } />
                                </div>
                                <div className="col-md-12 px-0 mb-3">
                                    <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 } requirevalidation = { 0 } 
                                        withformgroup = { 0 } formeditado = { formeditado } placeholder = 'DESCRIPCIÓN' value = { form.descripcion } 
                                        name = 'descripcion' as = "textarea" rows = "7" messageinc = "Incorrecto. Ingresa una descripción."
                                        onChange = {(e) => { e.preventDefault(); onChange(e, false) } } />
                                </div>
                                <div className="col-md-12 px-0 mb-3">
                                    <TagSelectSearchGray placeholder = 'Selecciona el tag' options = { options.tags } 
                                        iconclass = 'flaticon2-tag icon-xl' defaultvalue = { form.tags } onChange = { this.updateTag } />
                                </div>
                                <div className="col-md-9">
                                    { newTag && <NewTag form = { form } onChange = { onChange } formeditado = { formeditado } sendTag = { this.sendTag } 
                                        closeCard = { this.closeCard } /> }
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