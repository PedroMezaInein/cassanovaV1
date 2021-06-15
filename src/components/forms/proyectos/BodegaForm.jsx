import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { validateAlert } from '../../../functions/alert';
import { Input, Button, SelectSearch, InputNumber } from '../../form-components';
import ItemSlider from '../../singles/ItemSlider';
class BodegaForm extends Component {
    updatePartida = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'partida' } })
    }
    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
    }
    updateUnidades = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'unidad' } })
    }
    handleChange = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
    }
    render() {
        const { form, formeditado, onChange, options, onSubmit, handleChange, deleteFile, tipo, ...props } = this.props
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
                        <div className="col-md-6">
                            <Input
                                requirevalidation={1}
                                formeditado={formeditado}
                                name="nombre"
                                value={form.nombre}
                                onChange={onChange}
                                type="text"
                                placeholder={`NOMBRE ${tipo==='materiales'?'DEL MATERIAL':'DE LA HERRAMIENTA'}`}
                                iconclass="fas fa-toolbox"
                                messageinc="Incorrecto. Ingresa el nombre de la herramienta."
                            />
                        </div>
                    </div>
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    <div className="form-group row form-group-marginless">
                        <div className="col-md-4">
                            <SelectSearch
                                options={options.partidas}
                                placeholder="SELECCIONA LA PARTIDA"
                                name="partida"
                                value={form.partida}
                                onChange={this.updatePartida}
                                iconclass="fas fa-layer-group"
                                formeditado={formeditado}
                                messageinc="Incorrecto. Selecciona la partida."
                            />
                        </div>
                        <div className="col-md-4">
                            <SelectSearch
                                formeditado={formeditado}
                                options={options.unidades}
                                placeholder="SELECCIONA LA UNIDAD"
                                name="unidad"
                                value={form.unidad}
                                onChange={this.updateUnidades}
                                iconclass={" fas fa-weight-hanging"}
                                messageinc="Incorrecto. Selecciona la unidad"
                            />
                        </div>
                        <div className="col-md-4">
                            <InputNumber
                                requirevalidation = { 1 }
                                formeditado = { formeditado }
                                name = "cantidad"
                                onChange = { onChange }
                                value = { form.cantidad }
                                type = "text"
                                placeholder = "CANTIDAD"
                                iconclass={"fas fa-ruler-combined"}
                                thousandseparator={true}
                                messageinc = "Incorrecto. Ingresa la cantidad."
                            />
                        </div>
                    </div>
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    <div className="form-group row form-group-marginless">
                        <div className="col-md-12">
                            <Input
                                requirevalidation={0}
                                formeditado={formeditado}
                                placeholder={`UBICACIÓN ${tipo==='materiales'?'DEL MATERIAL':'DE LA HERRAMIENTA'}`}
                                iconclass='fas fa-map-marker-alt'
                                name='ubicacion'
                                value={form.ubicacion}
                                onChange={onChange}
                                messageinc="Incorrecto. Ingresa la descripción."
                            />
                        </div>
                    </div>
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    <div className="form-group row form-group-marginless justify-content-center">
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
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    <div className="form-group row form-group-marginless justify-content-center">
                        <div className="col-md-6 pb-5 mt-8">
                            <ItemSlider
                                items={form.adjuntos.fotografia.files}
                                item='fotografia'
                                handleChange={handleChange}
                                deleteFile={deleteFile}
                            />
                        </div>
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

export default BodegaForm;