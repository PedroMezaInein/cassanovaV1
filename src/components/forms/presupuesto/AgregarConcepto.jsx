import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { InputGray, SelectSearchGray, InputMoneyGray, Button } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
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
                <Tabs defaultActiveKey="nuevo" className="nav nav-pills nav-pills-sm nav-light-info mb-3 justify-content-center mt-5 font-weight-bolder border-0" activeKey={activeKey} onSelect={onSelect}>
                    <Tab eventKey="nuevo" title="Nuevo concepto" className="px-5 border-0">
                        <div className="form-group row form-group-marginless pt-4">
                            <div className='col-md-4'>
                                <SelectSearchGray
                                    formeditado={formeditado}
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withicon={1}
                                    customdiv = "mb-0"
                                    options={options.unidades}
                                    placeholder="SELECCIONA LA UNIDAD"
                                    name="unidad"
                                    value={form.unidad}
                                    onChange={this.updateUnidades}
                                    iconclass=" fas fa-weight-hanging"
                                    messageinc="Incorrecto. Selecciona la unidad"
                                />
                            </div>
                            <div className='col-md-4'>
                                <InputMoneyGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withplaceholder={1}
                                    withicon={1}
                                    withformgroup={0}
                                    requirevalidation={1}
                                    formeditado={formeditado}
                                    thousandseparator={true}
                                    placeholder="COSTO"
                                    value={form.costo}
                                    name="costo"
                                    onChange={onChange}
                                    iconclass="fas fa-dollar-sign"
                                />
                            </div>
                            <div className='col-md-4'>
                                <SelectSearchGray
                                    formeditado={formeditado}
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withicon={1}
                                    customdiv = "mb-0"
                                    requirevalidation={false}
                                    options={options.proveedores}
                                    placeholder="SELECCIONA EL PROVEEDOR"
                                    name="proveedor"
                                    value={form.proveedor}
                                    onChange={this.updateProveedor}
                                />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-6">
                                <SelectSearchGray
                                    formeditado={formeditado}
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withicon={1}
                                    customdiv = "mb-0"
                                    options={options.partidas}
                                    placeholder="SELECCIONA LA PARTIDA"
                                    name="partida"
                                    value={form.partida}
                                    onChange={this.updatePartida}
                                    iconclass="fas fa-book"
                                    messageinc="Incorrecto. Selecciona la partida"
                                />
                            </div>
                            <div className="col-md-6">
                                <SelectSearchGray
                                    formeditado={formeditado}
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withicon={1}
                                    customdiv = "mb-0"
                                    options={options.subpartidas}
                                    placeholder="SELECCIONA LA SUBPARTIDA"
                                    name="subpartida"
                                    value={form.subpartida}
                                    onChange={this.updateSubpartida}
                                    iconclass="fas fa-book"
                                    messageinc="Incorrecto. Selecciona la subpartida"
                                />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12">
                                <InputGray
                                    withtaglabel = { 1 }
                                    withtextlabel = { 1 }
                                    withplaceholder = { 1 }
                                    withicon = { 0 }
                                    withformgroup={0}
                                    requirevalidation={1}
                                    formeditado={formeditado}
                                    as="textarea"
                                    placeholder="DESCRIPCIÓN"
                                    rows="2"
                                    value={form.descripcion}
                                    name="descripcion"
                                    onChange={onChange}
                                    messageinc="Incorrecto. Ingresa una descripción."
                                    customclass="px-2"
                                />
                            </div>
                        </div>
                        <div className="card-footer py-3 px-0">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-right pr-0 pb-0">
                                    <Button icon=''
                                        onClick={
                                            (e) => {
                                                e.preventDefault();
                                                validateAlert(onSubmit, e, 'form-presupuesto')
                                            }
                                        }
                                        className="btn btn-light-info font-weight-bolder" text='AGREGAR'
                                    />
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="existente" title="Concepto existente" className="px-5 border-0">
                        <div className="form-group row form-group-marginless pt-4">
                            <div className='col-md-6'>
                                <SelectSearchGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withicon={1}
                                    customdiv = "mb-0"
                                    formeditado={formeditado}
                                    options={options.partidas}
                                    placeholder="SELECCIONA LA PARTIDA"
                                    name="partida"
                                    value={form.partida}
                                    onChange={this.updatePartida}
                                    iconclass="fas fa-book"
                                    messageinc="Incorrecto. Selecciona la partida"
                                />
                            </div>
                            {
                                form.partida ?
                                    <div className='col-md-6'>
                                        <SelectSearchGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withicon={1}
                                            customdiv = "mb-0"
                                            formeditado={formeditado}
                                            options={options.subpartidas}
                                            placeholder="SELECCIONA LA SUBPARTIDA"
                                            name="subpartida"
                                            value={form.subpartida}
                                            onChange={this.updateSubpartida}
                                            iconclass="fas fa-book"
                                            messageinc="Incorrecto. Selecciona el subpartida"
                                        />
                                    </div>
                                :''
                            }
                        </div>
                        {
                            form.subpartida ?
                                <>
                                    <div className="separator separator-dashed mb-6 mt-12"></div>
                                    <div className="table-responsive mb-10">
                                        <div className="list min-w-230px">
                                            <div className="list min-w-500px">
                                                <div className="d-flex align-items-start list-item card-spacer-x pt-4">
                                                    <div className="d-flex align-items-center col-1">
                                                    </div>
                                                    <div className="flex-grow-1 col-1 pl-0">
                                                        <div className="font-weight-bold font-size-lg text-center">CLAVE</div>
                                                    </div>
                                                    <div className="flex-grow-1 col-6 p-0">
                                                        <div className="font-weight-bold font-size-lg text-center"> DESCRIPCIÓN</div>
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-center flex-wrap col-2 pr-0">
                                                        <div className="font-weight-bolder font-size-lg text-center">UNIDAD</div>
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-center flex-wrap col-2 p-0">
                                                        <div className="font-weight-bolder font-size-lg text-center">COSTO</div>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                form.conceptosNuevos.length === 0 ?
                                                    <div className="d-flex align-items-start card-spacer-x p-2 rounded-0 justify-content-center bg-light mt-3 font-weight-bold font-size-lg">
                                                        NO HAY CONCEPTOS
                                                    </div>
                                                :<></>
                                            }
                                            {
                                                form.conceptosNuevos.map((concepto, key) => {
                                                    return (
                                                        <div key={key} className="d-flex align-items-start list-item card-spacer-x pt-4 pb-5 rounded-0">
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
                                                            <div className="flex-grow-1 col-1 pl-0">
                                                                <div className="font-size-xs font-weight-bold text-center">
                                                                    {concepto.clave}
                                                                </div>
                                                            </div>
                                                            <div className="flex-grow-1 col-6 p-0">
                                                                <div className="font-size-xs text-justify font-weight-bold">
                                                                    {concepto.descripcion}
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center flex-wrap col-2 pr-0">
                                                                <div className="font-size-xs font-weight-bold">
                                                                    {concepto.unidad.nombre}
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center flex-wrap col-2 p-0">
                                                                <div className="font-size-xs font-weight-bold">
                                                                    {setMoneyTableSinSmall(concepto.costo)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="card-footer py-3 px-0">
                                        <div className="col-lg-12 text-right px-0">
                                            <Button icon=''
                                                onClick={
                                                    (e) => {
                                                        e.preventDefault();
                                                        validateAlert(onSubmit, e, 'form-presupuesto')
                                                    }
                                                }
                                                className="btn btn-light-info font-weight-bolder" text='AGREGAR'
                                            />
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