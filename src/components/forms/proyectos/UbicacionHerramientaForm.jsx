import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { DATE } from '../../../constants';
import { validateAlert } from '../../../functions/alert';
import { Input, Calendar, Button } from '../../form-components'
class UbicacionHerramientaForm extends Component {
    handleChange = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
    }

    render() {
        const { form, onSubmit, onChange, ...props } = this.props
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
                    <div className="form-group row form-group-marginless pt-4">
                        <div className="col-md-4">
                            <Calendar
                                formeditado={0}
                                onChangeCalendar={this.handleChange}
                                placeholder="FECHA"
                                name="fecha"
                                value={form.fecha}
                                patterns={DATE}
                            />
                        </div>
                        <div className="col-md-8">
                            <Input
                                requirevalidation={1}
                                formeditado={0}
                                rows="1"
                                as="textarea"
                                placeholder="UBICACIÓN"
                                name="ubicacion"
                                value={form.ubicacion}
                                onChange={onChange}
                                iconclass="fas fa-map-marked-alt"
                                messageinc="Incorrecto. Ingresa la ubicación."
                            />
                        </div>
                    </div>
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    <div className="form-group row form-group-marginless">
                        <div className="col-md-12">
                            <Input
                                requirevalidation={1}
                                formeditado={0}
                                rows="2"
                                as="textarea"
                                placeholder="COMENTARIO"
                                name="comentario"
                                value={form.comentario}
                                onChange={onChange}
                                style={{ paddingLeft: "10px" }}
                                messageinc="Incorrecto. Ingresa tu comentario."
                            />
                        </div>
                    </div>
                    {
                        form.ubicacion !== '' ?
                            <div className="card-footer py-3 pr-1">
                                <div className="row mx-0">
                                    <div className="col-lg-12 text-right pr-0 pb-0">
                                        <Button icon='' text='ENVIAR'
                                            onClick={(e) => { e.preventDefault(); onSubmit(e) }} />
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

export default UbicacionHerramientaForm;