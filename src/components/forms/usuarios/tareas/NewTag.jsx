import React, { Component } from 'react'
import { COLORS } from '../../../../constants';
import { Button, CircleColor, InputGray } from '../../../form-components'

class NewTag extends Component{

    state = { color: '' }

    handleChangeColor = (color) => {
        const { onChange } = this.props
        onChange({ target: { value: color.hex, name: 'color' } })
        this.setState({ ...this.state, color:color });
    }

    render(){
        const { color } = this.state
        const { form, onChange, formeditado, sendTag, closeCard } = this.props
        return(
            <div className = ' card card-custom bg-light gutter-b mt-10 mx-auto shadow '>
                <div className="card-header border-0">
                    <h3 className="card-title font-weight-bold text-dark">
                        <span className="d-block text-dark font-weight-bolder">NUEVO TAG</span>
                    </h3>
                </div>
                <div className="card-body pt-2">
                    <div className="form">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 } requirevalidation = { 0 } 
                            withformgroup = { 1 } formeditado = { formeditado } placeholder = 'NOMBRE DEL TAG' value = { form.nuevo_tag } 
                            name = 'nuevo_tag' onChange = { (e) => { e.preventDefault(); onChange(e, false) } } iconclass = "fas fa-tasks" 
                            messageinc = "Incorrecto. Ingresa el título de la tarea." customclass='bg-white' />
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12">
                                <CircleColor circlesize = { 20 } width = "auto" onChange = { this.handleChangeColor } placeholder = "SELECCIONA EL COLOR DEL TAG" 
                                    colors = { COLORS } classlabel="font-weight-bold text-dark-60" classname="d-flex justify-content-center" value = { color }/>
                            </div>
                        </div>
                        <div className="mt-5 text-center">
                            <Button icon = '' className="btn btn-danger mr-2" onClick = { closeCard } text="CANCELAR" />
                            <Button icon = '' className="btn btn-primary" onClick = { sendTag } text="AGREGAR" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewTag