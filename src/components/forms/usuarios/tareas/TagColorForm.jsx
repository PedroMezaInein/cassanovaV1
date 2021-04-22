import React, { Component } from 'react'
import { Button, CircleColor, InputGray } from '../../../form-components'

class TagColorForm extends Component{

    state = { color: '' }

    handleChangeColor = (color) => {
        const { onChange } = this.props
        onChange({ target: { value: color.hex, name: 'color' } })
        this.setState({ ...this.state, color:color });
    }

    render(){
        const { color } = this.state
        const { form, onChange, formeditado, sendTag, closeCard, colors, customclass, btnCloseCard } = this.props
        return(
            <div className="form">
                <InputGray
                    withtaglabel={1}
                    withtextlabel={1}
                    withplaceholder={1}
                    withicon={0}
                    requirevalidation={0}
                    withformgroup={1}
                    formeditado={formeditado}
                    placeholder='NOMBRE DEL TAG'
                    value={form.nuevo_tag}
                    name='nuevo_tag'
                    onChange={(e) => { e.preventDefault(); onChange(e, false) }}
                    iconclass="fas fa-tasks"
                    messageinc="Incorrecto. Ingresa el título de la tarea."
                    customclass={customclass}
                />
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <CircleColor
                            circlesize={20}
                            width="auto"
                            onChange={this.handleChangeColor}
                            placeholder="SELECCIONA EL COLOR DEL TAG"
                            colors={colors}
                            classlabel="font-weight-bold text-dark-60"
                            classname="d-flex justify-content-center"
                            value={color}
                        />
                    </div>
                </div>
                <div className="mt-5 text-center">
                    {
                        btnCloseCard &&
                            <Button icon='' className="btn btn-danger mr-2 p-2 font-weight-bold" onClick={closeCard} text="CANCELAR" />
                    }
                    {
                        form.nuevo_tag && color?
                            <Button icon='' className="btn btn-primary p-2 font-weight-bold" onClick={sendTag} text="AGREGAR" />
                        :<></>
                    }
                </div>
            </div>
        )
    }
}

export default TagColorForm