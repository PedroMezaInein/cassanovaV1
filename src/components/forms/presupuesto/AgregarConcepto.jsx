import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, SelectSearch, InputMoney, Button, ToggleButton } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import SelectSearchTrue from '../../form-components/SelectSearchTrue'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { setMoneyTable } from '../../../functions/setters'

class AgregarConcepto extends Component {

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

    updateUnidades = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'unidad' } })
    }

    updateProveedor = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proveedor' } })
    }

    onChange = e => {
        const { checked } = e.target
        const { form, data, checkButtonConceptos } = this.props

        data.subpartidas.map((subpartida) => {
            subpartida.conceptos.map((concepto) => {
                checkButtonConceptos({ target: { name: concepto.clave, value: checked, checked: checked } })
            })
        })
    }

    render() {
        const { title, options, form, onChange, onSubmit, formeditado, data, checkButtonConceptos, key, onSelect, ...props } = this.props
        return (
            <Form id="form-presupuesto"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-presupuesto')
                    }
                }
            >
                <Tabs defaultActiveKey="nuevo" className="pt-2 nav nav-tabs nav-tabs-line justify-content-start nav-tabs-line-2x" activeKey={key} onSelect = {onSelect}>
                    <Tab eventKey="nuevo" title="Nuevo concepto">
                        <div className="form-group row form-group-marginless pt-4">
                            <div className="col-md-4">
                                <SelectSearch
                                    formeditado={formeditado}
                                    options={options.partidas}
                                    placeholder="SELECCIONA LA PARTIDA"
                                    name="partida"
                                    value={form.partida}
                                    onChange={this.updatePartida}
                                    iconclass={" fas fa-book"}
                                />
                            </div>
                            <div className="col-md-4">
                                <SelectSearch
                                    formeditado={formeditado}
                                    options={options.subpartidas}
                                    placeholder="SELECCIONA LA SUBPARTIDA"
                                    name="subpartida"
                                    value={form.subpartida}
                                    onChange={this.updateSubpartida}
                                    iconclass={" fas fa-book"}
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
                                />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12">
                                <Input
                                    requirevalidation={1}
                                    formeditado={formeditado}
                                    as="textarea"
                                    placeholder="DESCRIPCIÓN"
                                    rows="2"
                                    value={form.descripcion}
                                    name="descripcion"
                                    onChange={onChange}
                                    messageinc="Incorrecto. Ingresa una descripción."
                                    style={{ paddingLeft: "10px" }}
                                />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-4">
                                <SelectSearchTrue
                                    requirevalidation={false}
                                    options={options.proveedores}
                                    placeholder="SELECCIONA EL PROVEEDOR"
                                    name="proveedor"
                                    value={form.proveedor}
                                    onChange={this.updateProveedor}
                                />
                            </div>
                            <div className="col-md-4">
                                <InputMoney
                                    requirevalidation={1}
                                    formeditado={formeditado}
                                    thousandSeparator={true}
                                    placeholder="COSTO"
                                    value={form.costo}
                                    name="costo"
                                    onChange={onChange}
                                    iconclass={"fas fa-dollar-sign"}
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-center my-3">
                            <Button icon='' type="submit" className="text-center mx-auto" text='Agregar' />
                        </div>
                    </Tab>
                    <Tab eventKey="existente" title="Concepto existente">
                        <div className="form-group row form-group-marginless pt-4">
                            <div className="col-md-6">
                                <SelectSearch
                                    formeditado={formeditado}
                                    options={options.partidas}
                                    placeholder="SELECCIONA LA PARTIDA"
                                    name="partida"
                                    value={form.partida}
                                    onChange={this.updatePartida}
                                    iconclass={" fas fa-book"}
                                />
                            </div>
                            <div className="col-md-6">
                                <SelectSearch
                                    formeditado={formeditado}
                                    options={options.subpartidas}
                                    placeholder="SELECCIONA LA SUBPARTIDA"
                                    name="subpartida"
                                    value={form.subpartida}
                                    onChange={this.updateSubpartida}
                                    iconclass={" fas fa-book"}
                                />
                            </div>
                        </div>
                        <div className="table-responsive">
                            <div className="list list-hover min-w-500px" data-inbox="list">
                                {
                                    form.conceptosNuevos.map((concepto, key) => {
                                        return (
                                            <div key={key} className="d-flex align-items-start list-item card-spacer-x pt-4 pb-5 rounded-0" data-inbox="message">
                                                <div className="d-flex align-items-center col-1">
                                                    <div className="d-flex align-items-center" data-inbox="actions">
                                                        <label className="checkbox checkbox-single checkbox-primary flex-shrink-0">
                                                            <input
                                                                type="checkbox"
                                                                onChange={(e) => { checkButtonConceptos(e, key) }}
                                                                name={concepto.clave}
                                                                checked={form.conceptosNuevos.active}
                                                                value={form.conceptosNuevos.active}
                                                            />
                                                            <span></span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 col-1 pl-0" data-toggle="view">
                                                    <div className="font-weight-bold font-size-sm">{concepto.clave}</div>
                                                </div>
                                                <div className="flex-grow-1 col-8 p-0" data-toggle="view">
                                                    <div className="font-weight-bold font-size-sm text-justify">
                                                        {
                                                            concepto.descripcion
                                                        }
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center flex-wrap col-1 pr-0" data-toggle="view">
                                                    <div className="font-weight-bolder position-absolute font-size-sm" data-toggle="view">UNIDAD</div>
                                                    <span className="label label-light-primary  label-inline position-relative" style={{ top: "22px" }} >
                                                        {
                                                            concepto.unidad.nombre
                                                        }
                                                    </span>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center flex-wrap col-1 p-0" data-toggle="view">
                                                    <div className="font-weight-bolder position-absolute font-size-sm" data-toggle="view">COSTO</div>
                                                    <span className="label label-light-primary  label-inline position-relative" style={{ top: "22px" }}>
                                                        {
                                                            setMoneyTable(concepto.costo)
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="d-flex justify-content-center my-3">
                            <Button icon='' type="submit" className="text-center mx-auto" text='Agregar' />
                        </div>
                    </Tab>
                </Tabs>
            </Form>
        )
    }
}

export default AgregarConcepto