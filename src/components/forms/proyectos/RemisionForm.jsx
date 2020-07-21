import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Subtitle, Small } from '../../texts'
import { Input, FileInput, SelectSearch, Button, Calendar } from '../../form-components'
import { validateAlert } from '../../../functions/alert'

class ConceptoForm extends Component {

    updateProyecto = value => {
        const { onChange, form } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
    }

    updateArea = value => {
        const { onChange, setOptions } = this.props

        onChange({ target: { value: value, name: 'area' } })
        onChange({ target: { value: '', name: 'subarea' } })

        const { options: { areas: areas } } = this.props
        const aux = areas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('subareas', element.subareas)
            }
        })
    }

    updateSubarea = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { name: 'subarea', value: value.toString() } })
    }

    handleChangeDate = (date) => {
        const { onChange } = this.props
        onChange({ target: { name: 'fecha', value: date } })
    }

    render() {
        const { title, options, form, onChange, setOptions, onChangeAdjunto, clearFiles, requirevalidation, onSubmit, formeditado, ...props } = this.props
        return (
            <Form id="form-remision"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-remision')
                    }
                }

                {...props}>
                <Subtitle className="text-center" color="gold">
                    {
                        title
                    }
                </Subtitle>
                <div className="form-group row form-group-marginless mt-5">
                    <div className="col-md-6">
                        <SelectSearch
                            requirevalidation={1}
                            formeditado={formeditado}
                            options={options.proyectos}
                            placeholder="SELECCIONA EL PROYECTO"
                            name="proyecto"
                            value={form.proyecto}
                            onChange={this.updateProyecto}
                            iconclass={"far fa-folder-open"}
                        />
                    </div>
                    <div className="col-md-6">
                        <FileInput
                            requirevalidation={0}
                            formeditado={formeditado}
                            onChangeAdjunto={onChangeAdjunto}
                            placeholder={form.adjuntos.adjunto.placeholder}
                            value={form.adjuntos.adjunto.value}
                            name='adjunto' id='adjunto'
                            accept="image/*, application/pdf"
                            files={form.adjuntos.adjunto.files}
                            deleteAdjunto={clearFiles} multiple
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Calendar
                            onChangeCalendar={this.handleChangeDate}
                            placeholder="FECHA"
                            name="fecha"
                            value={form.fecha}
                            iconclass={"far fa-calendar-alt"}
                        />
                    </div>
                    <div className="col-md-4">
                        <SelectSearch
                            requirevalidation={1}
                            formeditado={formeditado}
                            options={options.areas}
                            placeholder="SELECCIONA EL ÁREA"
                            name="area"
                            value={form.area}
                            onChange={this.updateArea}
                            iconclass={"far fa-window-maximize"}
                        />
                    </div>

                    {
                        form.area ?
                            <div className="col-md-4">
                                <SelectSearch
                                    requirevalidation={0}
                                    formeditado={formeditado}
                                    options={options.subareas}
                                    placeholder="SELECCIONA EL SUBÁREA"
                                    name="subarea"
                                    value={form.subarea}
                                    onChange={this.updateSubarea}
                                    iconclass={"far fa-window-restore"}
                                />
                            </div>
                            : ''
                    }
                </div>

                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            as="textarea"
                            placeholder="DESCRIPCIÓN"
                            rows="3" value={form.descripcion}
                            name="descripcion"
                            onChange={onChange}
                            messageinc="Incorrecto. Ingresa una descripción."
                            style={{ paddingLeft: "10px" }}
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-center my-3">
                    <Button icon='' type="submit" className="text-center mx-auto" text='Enviar' />
                </div>

            </Form>
        )
    }
}

export default ConceptoForm