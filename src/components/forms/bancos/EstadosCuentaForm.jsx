import React, { Component } from 'react'
import { SelectSearch, Button, Calendar } from '../../form-components'
import { Form } from 'react-bootstrap'
import { DATE } from '../../../constants'
import { validateAlert } from '../../../functions/alert'
import ItemSlider from '../../singles/ItemSlider'
class EstadosCuentaForm extends Component {
    updateCuenta = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'cuenta' } })
    }
    changeDate = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
    }
    render() {
        const { options, form, onChange, onSubmit, formeditado, handleChange, deleteFile, ...props } = this.props
        return (
            <Form id="form-estadoCuenta"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-estadoCuenta')
                    }
                }
                {...props}
            >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.cuentas}
                            placeholder="SELECCIONA LA CUENTA"
                            name="cuenta"
                            value={form.cuenta}
                            onChange={this.updateCuenta}
                            iconclass={"far fa-credit-card"}
                            messageinc="Incorrecto. Selecciona la cuenta"
                        />
                    </div>
                    <div className="col-md-6">
                        <Calendar
                            formeditado={formeditado}
                            onChangeCalendar={this.changeDate}
                            name="fecha" value={form.fecha}
                            placeholder="FECHA DE TRASPASO"
                            patterns={DATE}
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless justify-content-center">
                    <div className="col-md-6">
                        <ItemSlider
                            items={form.adjuntos.adjuntos.files}
                            item='adjuntos' 
                            handleChange={handleChange}
                            deleteFile={deleteFile}
                            multiple={false} 
                        />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' className="mx-auto"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-estadoCuenta')
                                    }
                                }
                                text="ENVIAR"
                            />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default EstadosCuentaForm