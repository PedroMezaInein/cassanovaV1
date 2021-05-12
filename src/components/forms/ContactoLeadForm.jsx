import React, { Component } from 'react'
import { RadioGroup, Calendar, SelectSearch, Input } from '../form-components'
import { DATE } from '../../constants'
import { ItemSlider } from '../../components/singles'

class ContactoLeadForm extends Component {

    state = {
        newTipoContacto: false
    }

    updateTipoContacto = value => {
        const { onChangeContacto } = this.props
        onChangeContacto({ target: { name: 'tipoContacto', value: value } })
        if (value === 'New') {
            this.setState({
                newTipoContacto: true
            })
        } else {
            this.setState({
                newTipoContacto: false
            })
        }
    }

    handleChangeDate = (date) => {
        const { onChangeContacto } = this.props
        onChangeContacto({ target: { name: 'fechaContacto', value: date } })
    }

    render() {
        const { options, formContacto, onChangeContacto, formeditado, handleChange} = this.props
        const { newTipoContacto } = this.state
        return (
            <div className="">
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-4">
                        <RadioGroup
                            placeholder="Selecciona el estatus del intento de contacto"
                            formeditado={formeditado}
                            name={'success'}
                            onChange={onChangeContacto}
                            options={
                                [
                                    {
                                        label: 'Contactado',
                                        value: 'Contactado'
                                    },
                                    {
                                        label: 'Sin respuesta',
                                        value: 'Sin respuesta'
                                    }
                                ]
                            }
                            value={formContacto.success}
                        />
                    </div>
                    <div className="col-md-8">
                        <Input
                            formeditado={formeditado}
                            requirevalidation={0}
                            as='textarea'
                            name='descripcion'
                            placeholder='DESCRIPCIÓN DEL CONTACTO'
                            onChange={onChangeContacto}
                            value={formContacto.descripcion}
                            rows='2'
                            style={{ paddingLeft: "10px" }}
                            messageinc="Incorrecto. Ingresa una descripción."
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Calendar
                            formeditado={formeditado}
                            onChangeCalendar={this.handleChangeDate}
                            placeholder="FECHA DE CONTACTO"
                            name="fechaContacto"
                            value={formContacto.fechaContacto}
                            patterns={DATE}
                        />
                        {/* <CalendarDay
                            value = {formContacto.fechaContacto} 
                            onChange = { onChangeContacto } 
                            name = 'fechaContacto'
                            requirevalidation={1}
                        /> */}
                    </div>
                    <div className={newTipoContacto ? 'col-md-4' : 'col-md-8'}>
                        <SelectSearch
                            formeditado={formeditado}
                            requirevalidation={0}
                            options={options.tiposContactos}
                            placeholder="SELECCIONA EL MEDIO DE CONTACTO"
                            name="tipoContacto"
                            value={formContacto.tipoContacto}
                            onChange={this.updateTipoContacto}
                            messageinc="Incorrecto. Selecciona el medio de contacto"
                        />
                    </div>
                    {
                        newTipoContacto &&
                        <div className="col-md-4">
                            <Input
                                formeditado={formeditado}
                                requirevalidation={0}
                                onChange={onChangeContacto}
                                name="newTipoContacto"
                                type="text"
                                value={formContacto.newTipoContacto}
                                placeholder="NUEVO TIPO DE CONTACTO"
                                iconclass={"fas fa-mail-bulk"}
                            />
                        </div>
                    }
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless justify-content-center">
                    <div className="col-md-4">
                        <ItemSlider 
                            items={formContacto.adjuntos.adjuntos.files}
                            item='adjuntos' 
                            handleChange={handleChange}
                            multiple={true}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default ContactoLeadForm