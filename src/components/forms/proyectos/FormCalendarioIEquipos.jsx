import React, { Component } from 'react';
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert';
import { Button, InputNumber, SelectSearch, CalendarDay } from '../../form-components';

class FormCalendarioIEquipos extends Component {

    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
    }
    updateEquipo = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'equipo' } })
    }
    render() {
        const { form, onChange, options, onSubmit } = this.props
        return (
            <Form id='form-equipo'>
                <div className="form-group row form-group-marginless mt-5">
                    <div className="col-md-6">
                        <SelectSearch
                            options={options.proyectos}
                            placeholder="SELECCIONA EL PROYECTO"
                            name="proyecto"
                            value={form.proyecto}
                            onChange={this.updateProyecto}
                            iconclass={"far fa-folder-open"}
                            messageinc="Incorrecto. Selecciona el proyecto"
                        />
                    </div>
                    <div className="col-md-6">
                        <SelectSearch
                            options={options.equipos}
                            placeholder="SELECCIONA EL EQUIPO"
                            name="equipo"
                            value={form.equipo}
                            onChange={this.updateEquipo}
                            iconclass={"far fa-folder-open"}
                            messageinc="Incorrecto. Selecciona el equipo"
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <InputNumber
                            requirevalidation={1}
                            placeholder="INGRESA EL TIEMPO DE VIDA (AÑOS)"
                            type="text"
                            name="duracion"
                            value={form.duracion}
                            onChange={onChange}
                            iconclass={" fas fa-id-card "}
                            messageinc="Incorrecto. Ingresa el tiempo de vida."
                            patterns="[0-9]{1,2}"
                            maxLength="2"
                        />
                    </div>
                    <div className="col-md-6">
                        <InputNumber
                            requirevalidation={1}
                            placeholder="INGRESA LA PERIODICIDAD (MESES)"
                            type="text"
                            name="periodo"
                            value={form.periodo}
                            onChange={onChange}
                            iconclass={" fas fa-id-card "}
                            messageinc="Incorrecto. Ingresa la periodicidad."
                            patterns="[0-9]{1,2}"
                            maxLength="2"
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="mx-0 row form-group-marginless mt-5">
                    <div className="col-md-12 text-center">
                        <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                            <label className="text-center font-weight-bolder">Fecha de instalación</label>
                        </div>
                        <CalendarDay value={form.fecha} name='fecha' onChange={onChange} date={form.fecha} withformgroup={1} requirevalidation={1}/>
                    </div>
                </div>
                <div className="card-footer py-3 pr-1 text-right">
                    <Button icon='' className="btn btn-primary mr-2" text="ENVIAR"
                        onClick={(e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-equipo') }} />
                </div>
            </Form>
        );
    }
}

export default FormCalendarioIEquipos;