import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, SelectSearch, InputMoney, Button } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import SelectSearchTrue from '../../form-components/SelectSearchTrue'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { setMoneyTableSinSmall } from '../../../functions/setters'

class AgregarConcepto extends Component {

    updatePartida = value => {
        const { onChange, setOptions } = this.props

        onChange({ target: { value: value, name: 'partida' } })
        onChange({ target: { value: '', name: 'subpartida' } })

        const { options: { partidas } } = this.props
        partidas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('subpartidas', element.subpartidas)
            }
            return false
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
        const { data, checkButtonConceptos } = this.props
        data.subpartidas.map((subpartida) => {
            subpartida.conceptos.map((concepto) => {
                checkButtonConceptos({ target: { name: concepto.clave, value: checked, checked: checked } })
                return false
            })
            return false
        })
    }

    render() {
        const { options, form, onChange, onSubmit, formeditado, checkButtonConceptos, activeKey, onSelect } = this.props
        return (
            <Form id="form-presupuesto"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-presupuesto')
                    }
                }
            >
                <Tabs defaultActiveKey="nuevo" className="mt-4 nav nav-tabs justify-content-start nav-bold bg-gris-nav bg-gray-100" activeKey={activeKey} onSelect={onSelect}>
                    <Tab eventKey="nuevo" title="Nuevo concepto">
                        <div className="form-group row form-group-marginless pt-4">
                            <div className={form.partida.length ?'col-md-4':'col-md-6'}>
                                <SelectSearch
                                    formeditado={formeditado}
                                    options={options.partidas}
                                    placeholder="SELECCIONA LA PARTIDA"
                                    name="partida"
                                    value={form.partida}
                                    onChange={this.updatePartida}
                                    iconclass={" fas fa-book"}
                                    messageinc="Incorrecto. Selecciona la partida"
                                />
                            </div>
                            {
                                form.partida ?
                                    <div className={form.partida.length ?'col-md-4':'col-md-6'}>
                                        <SelectSearch
                                            formeditado={formeditado}
                                            options={options.subpartidas}
                                            placeholder="SELECCIONA LA SUBPARTIDA"
                                            name="subpartida"
                                            value={form.subpartida}
                                            onChange={this.updateSubpartida}
                                            iconclass={" fas fa-book"}
                                            messageinc="Incorrecto. Selecciona la subpartida"
                                        />
                                    </div>
                                :''
                            }
                            <div className={form.partida.length ?'col-md-4':'col-md-6'}>
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
                                    thousandseparator={true}
                                    placeholder="COSTO"
                                    value={form.costo}
                                    name="costo"
                                    onChange={onChange}
                                    iconclass={"fas fa-dollar-sign"}
                                />
                            </div>
                        </div>
                        <div className="card-footer py-3 pr-1">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-right pr-0 pb-0">
                                    <Button icon=''
                                        onClick={
                                            (e) => {
                                                e.preventDefault();
                                                validateAlert(onSubmit, e, 'form-presupuesto')
                                            }
                                        }
                                        className="btn btn-primary mr-2" text='AGREGAR' />
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="existente" title="Concepto existente">
                        <div className="form-group row form-group-marginless pt-4">
                            <div className={form.partida.length ?'col-md-6':'col-md-12'}>
                                <SelectSearch
                                    formeditado={formeditado}
                                    options={options.partidas}
                                    placeholder="SELECCIONA LA PARTIDA"
                                    name="partida"
                                    value={form.partida}
                                    onChange={this.updatePartida}
                                    iconclass={" fas fa-book"}
                                    messageinc="Incorrecto. Selecciona la partida"
                                />
                            </div>
                            {
                                form.partida ?
                                    <div className={form.partida.length ?'col-md-6':'col-md-12'}>
                                        <SelectSearch
                                            formeditado={formeditado}
                                            options={options.subpartidas}
                                            placeholder="SELECCIONA LA SUBPARTIDA"
                                            name="subpartida"
                                            value={form.subpartida}
                                            onChange={this.updateSubpartida}
                                            iconclass={" fas fa-book"}
                                            messageinc="Incorrecto. Selecciona el subpartida"
                                        />
                                    </div>
                                :''
                            }
                        </div>
                        {
                            form.partida ?
                                <>
                                    <div className="table-responsive">
                                        <div className="list min-w-230px" data-inbox="list">
                                            {
                                                form.subpartida ?
                                                    <div className="list min-w-500px" data-inbox="list">
                                                        <div className="d-flex align-items-start list-item card-spacer-x pt-4" data-inbox="message">
                                                            <div className="d-flex align-items-center col-1">
                                                            </div>
                                                            <div className="flex-grow-1 col-1 pl-0" data-toggle="view">
                                                                <div className="font-weight-bold font-size-lg text-center">CLAVE</div>
                                                            </div>
                                                            <div className="flex-grow-1 col-6 p-0" data-toggle="view">
                                                                <div className="font-weight-bold font-size-lg text-center"> DESCRIPCIÓN</div>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center flex-wrap col-2 pr-0" data-toggle="view">
                                                                <div className="font-weight-bolder font-size-lg text-center" data-toggle="view">UNIDAD</div>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center flex-wrap col-2 p-0" data-toggle="view">
                                                                <div className="font-weight-bolder font-size-lg text-center" data-toggle="view">COSTO</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : ''
                                            }
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
                                                                <div className="font-size-xs font-weight-bold text-center">
                                                                    {concepto.clave}
                                                                </div>
                                                            </div>
                                                            <div className="flex-grow-1 col-6 p-0" data-toggle="view">
                                                                <div className="font-size-xs text-justify font-weight-bold">
                                                                    {concepto.descripcion}
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center flex-wrap col-2 pr-0" data-toggle="view">
                                                                <div className="font-size-xs font-weight-bold" data-toggle="view">
                                                                    {concepto.unidad.nombre}
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center flex-wrap col-2 p-0" data-toggle="view">
                                                                <div className="font-size-xs font-weight-bold" data-toggle="view">
                                                                    {setMoneyTableSinSmall(concepto.costo)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="card-footer py-3 pr-1">
                                        <div className="row mx-0">
                                            <div className="col-lg-12 text-right pr-0 pb-0">
                                                <Button icon=''
                                                    onClick={
                                                        (e) => {
                                                            e.preventDefault();
                                                            validateAlert(onSubmit, e, 'form-presupuesto')
                                                        }
                                                    }
                                                    className="btn btn-primary mr-2" text='AGREGAR'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                                : ''
                        }
                    </Tab>
                </Tabs>
            </Form>
        )
    }
}

export default AgregarConcepto