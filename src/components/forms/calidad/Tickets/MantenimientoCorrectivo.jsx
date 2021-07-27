import React, { Component } from 'react'
import { Form, Tabs, Tab, Row, Col } from 'react-bootstrap'
import { SelectSearchGray, CalendarDay, InputMoneyGray, Button } from '../../../../components/form-components'
import { dayDMY } from '../../../../functions/setters'
import NumberFormat from 'react-number-format';

export default class SolicitudesTabla extends Component {
    updateSelect = value => {
        const { onChangeMantenimientos } = this.props
        onChangeMantenimientos({ target: { name: 'equipo', value: value } })
    }
    setMoneyTable(value) {
        let cantidad = 0
        cantidad = parseFloat(value).toFixed(2)
        return (
            <NumberFormat value={cantidad} displayType={'text'} thousandSeparator={true} prefix={'$'}
                renderText={cantidad => <span> {cantidad} </span>} />
        )
    }
    render() {
        const { form, options, onChangeMantenimientos, data, onSubmitMantenimiento, openModalDeleteMantenimiento } = this.props
        return (
            <div>
                <Tabs defaultActiveKey="formulario_mantenimiento" className="nav nav-tabs nav-tabs-line font-weight-bolder mb-8 justify-content-center border-0 mt-5 nav-tabs-line-2x">
                    <Tab eventKey="formulario_mantenimiento" title="Agregar mantenimiento">
                        <Form onSubmit={(e) => { e.preventDefault(); onSubmitMantenimiento(e) }} >
                            <Row className="mx-0 d-flex align-items-center justify-content-center">
                                <Col md="4" className="text-center">
                                    <div className="d-flex justify-content-center pt-5" style={{ height: '14px' }}>
                                        <label className="text-center font-weight-bolder text-dark-60">Fecha del mantenimiento</label>
                                    </div>
                                    <CalendarDay value={form.fechaMantenimiento} name='fechaMantenimiento' date={form.fechaMantenimiento} withformgroup={0} onChange={onChangeMantenimientos} placeholder='Fecha del mantenimiento' requirevalidation={1} />
                                </Col>
                                <Col md="4">
                                    <InputMoneyGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={1}
                                        requirevalidation={0} formeditado={0} thousandseparator={true} prefix='$' name="costo"
                                        value={form.costo} onChange={onChangeMantenimientos} placeholder="COSTO" iconclass="la la-money-bill icon-xl" />
                                    <SelectSearchGray withtaglabel={1} withtextlabel={1} withicon={1} options={options.equipos}
                                        placeholder='SELECCIONA EL EQUIPO INSTALADO' name="equipo"
                                        value={form.equipo} onChange={this.updateSelect}
                                        iconclass="la la-toolbox icon-xl" formeditado={0} messageinc="Incorrecto. Selecciona el técnico que asiste" />
                                </Col>
                            </Row>
                            <div className="card-footer py-3 pr-1 text-right">
                                <Button icon='' className="btn btn-primary mr-2" text="ENVIAR"
                                    type='submit' />
                            </div>
                        </Form>
                    </Tab>
                    {
                        data.mantenimientos.length > 0 &&
                        <Tab eventKey="historial" title="Historial de mantenimientos">
                            <table className="table table-responsive-lg table-vertical-center table-hover text-center w-80 mx-auto">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th style={{ minWidth: '200px' }} className="text-dark-75">Equipo</th>
                                        <th className="text-dark-75">Fecha de mantenimiento</th>
                                        <th className="text-dark-75">Costo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.mantenimientos.map((mantenimiento, index) => {
                                            return (
                                                <tr key={index} className="font-weight-light">
                                                    <td className='px-2'>
                                                        <button className='btn btn-icon btn-actions-table btn-xs ml-2 btn-text-danger btn-hover-danger'
                                                            onClick={(e) => { e.preventDefault(); openModalDeleteMantenimiento(mantenimiento) }} >
                                                            <i className='flaticon2-rubbish-bin' />
                                                        </button>
                                                    </td>
                                                    <td className='px-2 text-break'>{mantenimiento.instalacion.equipo.texto}</td>
                                                    <td className='px-2 text-break'> {dayDMY(mantenimiento.fecha)} </td>
                                                    <td className='px-2 text-break'> {this.setMoneyTable(mantenimiento.costo)} </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </Tab>
                    }
                </Tabs>
            </div>
        );
    }
}