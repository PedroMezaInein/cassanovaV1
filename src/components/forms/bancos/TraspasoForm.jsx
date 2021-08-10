import React, { Component } from 'react'
import { InputMoney, SelectSearch, Input, Button, Calendar } from '../../form-components'
import { Form } from 'react-bootstrap'
import { DATE } from '../../../constants'
import { validateAlert } from '../../../functions/alert'
import ItemSlider from '../../singles/ItemSlider'
class TraspasoForm extends Component {
    updateOrigen = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'origen', value: value } })
    }
    updateDestino = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'destino', value: value } })
    }
    changeDate = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
    }
    render() {
        const { title, options, form, onChange, onChangeAdjunto, deleteAdjunto, requirevalidation, onSubmit, formeditado, handleChange, deleteFile, ...props } = this.props
        return (
            <Form id="form-transpasos" onSubmit = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-transpasos') } } {...props} >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-3">
                        <SelectSearch formeditado = { formeditado } options = { options.cuentas } value = { form.origen } onChange = { this.updateOrigen }
                            placeholder = "CUENTA ORIGEN" iconclass = "far fa-credit-card" messageinc = "Incorrecto. Selecciona la cuenta de origen" />
                    </div>
                    <div className="col-md-3">
                        <SelectSearch formeditado = { formeditado } options = { options.cuentas } value = { form.destino } onChange = { this.updateDestino }
                            placeholder = "CUENTA DESTINO" iconclass = "far fa-credit-card" messageinc = "Incorrecto. Selecciona la cuenta destino" />
                    </div>
                    <div className="col-md-3">
                        <InputMoney requirevalidation = { 1 } formeditado = { formeditado } thousandseparator = { true } prefix = { '$' } name = "cantidad"
                            value = { form.cantidad } onChange = { onChange } placeholder = "INGRESE EL MONTO DE TRASPASO" iconclass = " fas fa-money-check-alt" />
                    </div>
                    <div className="col-md-3">
                        <Calendar formeditado = { formeditado } onChangeCalendar = { this.changeDate } name = "fecha" value = { form.fecha }
                            placeholder = "FECHA DE TRASPASO" patterns = { DATE } />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <Input requirevalidation = { 0 } formeditado = { formeditado } placeholder = "COMENTARIO" as = "textarea" rows = "3"
                            name = "comentario" value = { form.comentario } onChange = { onChange } messageinc = "Incorrecto. Ingresa el comentario."
                            customclass="px-2" />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless justify-content-center">
                    <div className="col-md-6">
                        <ItemSlider items = { form.adjuntos.adjuntos.files } item = 'adjuntos' handleChange = { handleChange }
                            deleteFile = { deleteFile } multiple = { false } />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon = '' className = "mx-auto" onClick = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-transpasos') } }
                                text = "ENVIAR" />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default TraspasoForm