import React, { Component } from 'react'
import { Form } from 'react-bootstrap';
import { DATE } from '../../../constants';
import { validateAlert } from '../../../functions/alert';
import { SelectSearch, Calendar, Button } from '../../form-components';
import { ItemSlider } from '../../singles';
export default class componentName extends Component {
    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }
    handleChangeDate = (date) => {
        const { onChange } = this.props
        onChange({ target: { name: 'fecha', value: date } })
    }
    render() {
        const { form, formeditado, onChange, options, onSubmit, handleChange, deleteFile, ...props } = this.props
        return (
            <>
                <Form
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                            validateAlert(onSubmit, e, 'wizard-3-content')
                        }
                    }
                    {...props} >
                    <div className="form-group row form-group-marginless pt-4 justify-content-md-center">
                        <div className="col-md-4">
                            <SelectSearch
                                formeditado={formeditado}
                                options={options.empresas}
                                placeholder='EMPRESA'
                                name='empresa'
                                value={form.empresa}
                                onChange={this.updateEmpresa}
                                iconclass='fas fa-building'
                                messageinc="Incorrecto. Selecciona la empresa"
                            />
                        </div>
                        <div className="col-md-4">
                            <Calendar
                                formeditado={formeditado}
                                onChangeCalendar={this.handleChangeDate}
                                placeholder="FECHA"
                                name="fecha"
                                value={form.fecha}
                                patterns={DATE}
                                iconclass='fas fa-calendar'
                            />
                        </div>
                    </div>
                    <div className="form-group row form-group-marginless justify-content-center">
                        <div className="col-md-6">
                            <ItemSlider
                                items={form.adjuntos.adjuntos.files}
                                item='adjuntos' handleChange={handleChange}
                                deleteFile={deleteFile} />
                        </div>
                    </div>
                    {
                        form.adjuntos.adjuntos.files.length > 0 ?
                            <div className="card-footer py-3 pr-1">
                                <div className="row mx-0">
                                    <div className="col-lg-12 text-right pr-0 pb-0">
                                        <Button
                                            icon=''
                                            text='ENVIAR'
                                            onClick={(e) => { e.preventDefault(); onSubmit(e) }}
                                        />
                                    </div>
                                </div>
                            </div>
                            : ''
                    }
                </Form>
            </>
        );
    }
}
