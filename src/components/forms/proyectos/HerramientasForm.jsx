import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { DATE } from '../../../constants';
import { validateAlert } from '../../../functions/alert';
import { Input, SelectSearchTrue, Button } from '../../form-components';
import Calendar from '../../form-components/Calendar';
import ItemSlider from '../../singles/ItemSlider';
class HerramientasForm extends Component {
    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }
    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
    }
    handleChange = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
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
                    <div className="form-group row form-group-marginless">
                        <div className="col-md-4">
                            <Input
                                requirevalidation={1}
                                formeditado={formeditado}
                                name="nombre"
                                value={form.nombre}
                                onChange={onChange}
                                type="text"
                                placeholder="NOMBRE DE LA HERRAMIENTA"
                                iconclass="fas fa-toolbox"
                                messageinc="Incorrecto. Ingresa el nombre de la herramienta."
                            />
                        </div>
                        <div className="col-md-4">
                            <Input
                                requirevalidation={0}
                                formeditado={formeditado}
                                name="modelo"
                                value={form.modelo}
                                onChange={onChange}
                                type="text"
                                placeholder="MODELO DE LA HERRAMIENTA"
                                iconclass="fas fa-toolbox"
                                messageinc="Incorrecto. Ingresa el modelo de la herramienta."
                            />
                        </div>
                        <div className="col-md-4">
                            <Input
                                requirevalidation={0}
                                formeditado={formeditado}
                                name="serie"
                                value={form.serie}
                                onChange={onChange}
                                type="text"
                                placeholder="SERIE DE LA HERRAMIENTA"
                                iconclass="fas fa-toolbox"
                                messageinc="Incorrecto. Ingresa la serie de la herramienta."
                            />
                        </div>
                    </div>
                    <div className="form-group row form-group-marginless pt-4">
                        <div className="col-md-4">
                            <SelectSearchTrue
                                options={options.empresas}
                                placeholder="SELECCIONA LA EMPRESA"
                                name="empresa"
                                value={form.empresa}
                                onChange={this.updateEmpresa}
                                iconclass="fas fa-layer-group"
                                formeditado={formeditado}
                            />
                        </div>
                        <div className="col-md-4">
                            <SelectSearchTrue
                                options={options.proyectos}
                                placeholder="SELECCIONA EL PROYECTO"
                                name="proyecto"
                                value={form.proyecto}
                                onChange={this.updateProyecto}
                                iconclass="fas fa-layer-group"
                                formeditado={formeditado}
                            />
                        </div>
                        <div className="col-md-4">
                            <Calendar
                                formeditado={formeditado}
                                onChangeCalendar={this.handleChange}
                                placeholder="FECHA DE COMPRA"
                                name="fecha"
                                value={form.fecha}
                                patterns={DATE}
                            />
                        </div>
                    </div>
                    <div className="form-group row form-group-marginless pt-4">
                        <div className="col-md-12">
                            <Input
                                requirevalidation={0}
                                formeditado={formeditado}
                                rows="2"
                                as="textarea"
                                placeholder="DESCRIPCIÓN"
                                name="descripcion"
                                value={form.descripcion}
                                onChange={onChange}
                                style={{ paddingLeft: "10px" }}
                                messageinc="Incorrecto. Ingresa la descripción."
                            />
                        </div>
                    </div>
                    <div className="col-md-12 pb-5">
                        <ItemSlider
                            items={form.adjuntos.adjuntos.files}
                            item='adjuntos'
                            handleChange={handleChange}
                            deleteFile={deleteFile}
                        />
                    </div>
                    <div className="card-footer py-3 pr-1">
                        <div className="row mx-0">
                            <div className="col-lg-12 text-right pr-0 pb-0">
                                <Button icon='' text='ENVIAR' className="btn btn-primary mr-2" onClick={(e) => { e.preventDefault(); onSubmit(e) }} />
                            </div>
                        </div>
                    </div>
                </Form>
            </>
        );
    }
}

export default HerramientasForm;