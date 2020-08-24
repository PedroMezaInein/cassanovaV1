import React, { Component } from 'react'
import { RadioGroup, Calendar, SelectSearch, Input } from '../form-components'
import { DATE } from '../../constants'

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
        const { options, formContacto, onChangeContacto, formeditado } = this.props
        const { newTipoContacto } = this.state
        return (
            <div className="">
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-12">
                        <p className="m-0">Selecciona el estatus del intento de contacto</p>
                        <RadioGroup
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
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <SelectSearch
                            formeditado={formeditado}
                            requirevalidation={0}
                            options={options.tiposContactos}
                            placeholder="SELECCIONA EL MEDIO DE CONTACTO"
                            name="tipoContacto"
                            value={formContacto.tipoContacto}
                            onChange={this.updateTipoContacto}
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
                                placeholder="NUEVO TIPO DE CONTACTO" />
                        </div>
                    }
                    <div className="col-md-4">
                        <Calendar
                            formeditado={formeditado}
                            onChangeCalendar={this.handleChangeDate}
                            placeholder="FECHA DE CONTACTO"
                            name="fechaContacto"
                            value={formContacto.fechaContacto}
                            patterns={DATE}
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <Input
                            formeditado={formeditado}
                            requirevalidation={0}
                            as='textarea'
                            name='descripcion'
                            placeholder='DESCRIPCIÓN DEL CONTRATO'
                            onChange={onChangeContacto}
                            value={formContacto.descripcion}
                            rows='3'
                            style={{ paddingLeft: "10px" }}
                            messageinc="Incorrecto. Ingresa una descripción."
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default ContactoLeadForm