import React, { Component } from 'react'
import { Form, Accordion, Card} from 'react-bootstrap'
import { Input, SelectSearch, Button, Calendar, ToggleButton } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { DATE } from '../../../constants'

class PresupuestoForm extends Component {

    state={
        data: {
            partidas: []
        },
        options: {  
            partidas: [],
            subpartidas: []
        }
    }

    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
    }

    handleChangeDate = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
    }

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    updateArea = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'area' } })
    }

    updatePartida = value => {
        const { onChange, setOptions } = this.props

        onChange({ target: { value: value, name: 'partida' } })
        onChange({ target: { value: '', name: 'subpartida' } })

        const { options: { partidas: partidas } } = this.props
        const aux = partidas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('subpartidas', element.subpartidas)
            }
        })
    }

    updateSubpartida = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'subpartida' } })
    }


    render() {
        const { options, form, onChange, onSubmit, formeditado } = this.props
        const { data } = this.state
        console.log(data.partidas = options.partidas) 
        console.log(data.partidas)
        return (
            <Form id="form-presupuesto"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-presupuesto')
                    }
                }
            >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.proyectos}
                            placeholder="SELECCIONA EL PROYECTO"
                            name="proyecto"
                            value={form.proyecto}
                            onChange={this.updateProyecto}
                            iconclass={"far fa-folder-open"}
                        />
                    </div>
                    <div className="col-md-4">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.areas}
                            placeholder="SELECCIONA EL ÁREA"
                            name="areas"
                            value={form.area}
                            onChange={this.updateArea}
                            iconclass={"far fa-window-maximize"}
                        />
                    </div>
                    <div className="col-md-4">
                        {
                            form.facturaObject ?
                                <Input
                                    placeholder="EMPRESA"
                                    name="empresa"
                                    readOnly
                                    value={form.empresa}
                                    onChange={onChange}
                                    iconclass={"far fa-building"}
                                />
                                :
                                <SelectSearch
                                    formeditado={formeditado}
                                    options={options.empresas}
                                    placeholder="SELECCIONA LA EMPRESA"
                                    name="empresas"
                                    value={form.empresa}
                                    onChange={this.updateEmpresa}
                                    iconclass={"far fa-building"}
                                />
                        }
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Calendar
                            formeditado={formeditado}
                            onChangeCalendar={this.handleChangeDate}
                            placeholder="FECHA"
                            name="fecha"
                            value={form.fecha}
                            patterns={DATE}
                        />
                    </div>
                    <div className="col-md-4">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            placeholder="TIEMPO DE EJECUCIÓN"
                            value={form.tiempo_ejecucion}
                            name="tiempo_ejecucion"
                            onChange={onChange}
                            iconclass={"flaticon-calendar-with-a-clock-time-tools"}
                            messageinc="Incorrecto. Ingresa un tiempo de ejecución."
                        />
                    </div>
                </div>

                {/* <Accordion activeKey={activeKey} className="accordion accordion-light">
                    {
                        grupos !== null && grupos.map((grupo, key) => {
                            return (
                                <div key={key}>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey={grupo.name} onClick={() => this.handleAccordion(grupo.name)}>
                                            <div className="d-flex align-items-center">
                                                <ToggleButton
                                                    {...grupo}
                                                    onToggle={(e) => this.handleGroupToggler(e)}
                                                    leftBG={"#ECF0F3"}
                                                    rightBG={"#ECF0F3"}
                                                    borderColor={"#ECF0F3"}
                                                    leftKnobColor={"#FFF"}
                                                    rightKnobColor={"#2171c1"}
                                                />
                                                <div className="card-title collapsed pl-2">{grupo.nombre}</div>

                                            </div>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey={grupo.name}>
                                            <Card.Body className="bg-light">
                                                <div className="row mx-0 mt-2 d-flex justify-content-center">
                                                    {
                                                        grupo.modulos.map((modulo, key) => {
                                                            return (
                                                                <div key={key} className="col-md-2 pt-4 px-3">
                                                                    <div className="text-center">
                                                                        <p className="font-size-sm font-weight-bold">{modulo.nombre}</p>
                                                                    </div>
                                                                    <div className="d-flex justify-content-center">
                                                                        <Form.Group>
                                                                            <div className="checkbox-list pt-2">
                                                                                <label className="checkbox checkbox-outline checkbox-outline-2x checkbox-primary">
                                                                                    <input
                                                                                        name={modulo.name}
                                                                                        type="checkbox"
                                                                                        checked={modulo.checked}
                                                                                        onChange={this.handleCheckbox(modulo)}
                                                                                    />
                                                                                    <span></span>
                                                                                </label>
                                                                            </div>
                                                                        </Form.Group>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                    <div className="separator separator-solid"></div>
                                </div>
                            )
                        })
                    }
                </Accordion> */}

                <div className="d-flex justify-content-center my-3">
                    <Button icon='' type="submit" className="text-center mx-auto" text='Enviar' />
                </div>
            </Form>
        )
    }
}

export default PresupuestoForm