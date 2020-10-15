import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, Button, InputNumber, InputMoney, InputNumberSinText, InputMoneySinText } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
class DiseñoForm extends Component {
    render() {
        const { title, options, form, onChange, addSubpartida, deleteSubpartida, onSubmit, formeditado, requirevalidation, onChangeNominasAdmin, addRow, ...props } = this.props
        return (
            <>
                <Form id="form-diseño"
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                            validateAlert(onSubmit, e, 'form-diseño')
                        }
                    }
                    {...props}
                >
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row d-flex justify-content-center">
                                <div className="col-md-5">
                                    <InputMoney
                                        requirevalidation={1}
                                        formeditado={formeditado}
                                        thousandseparator={true}
                                        prefix={'$'}
                                        name="m2"
                                        value={form.precio_inicial_diseño}
                                        onChange={onChange}
                                        placeholder="PRECIO INICIAL"
                                        iconclass={"fas fa-coins"}
                                    />
                                </div>
                                <div className="col-md-5">
                                    <InputNumber
                                        requirevalidation={1}
                                        formeditado={formeditado}
                                        name="m2"
                                        onChange={onChange}
                                        value={form.m2}
                                        type="text"
                                        placeholder="M2"
                                        iconclass={"fas fa-ruler-combined"}
                                        messageinc="Incorrecto. Ingresa los M2."
                                    />
                                </div>
                            </div>
                            <div className="row my-4 d-flex justify-content-center">
                                <div className="col-md-8">
                                    <div className="separator separator-dashed"></div>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-md-12">
                                    <div className="tab-content">
                                        <div className="table-responsive d-flex justify-content-center">
                                            <table className="table table-responsive-lg table-vertical-center text-center" id="esquemas">
                                                <thead>
                                                    <tr className="bg-gray-200">
                                                        <th></th>
                                                        <th>ESQUEMA 1</th>
                                                        <th>ESQUEMA 2</th>
                                                        <th>ESQUEMA 3</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th scope="row" className="bg-gray-200">PRECIO DISEÑO</th>
                                                        <td>$35.500,00</td>
                                                        <td>$47.925,00</td>
                                                        <td>$62.125,00</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row" className="bg-gray-200">INCREMENTO</th>
                                                        <td>-</td>
                                                        <td>
                                                            <div className="d-flex justify-content-center">
                                                                <InputNumberSinText
                                                                    requirevalidation={1}
                                                                    formeditado={formeditado}
                                                                    name="incremento_esquema_2"
                                                                    onChange={onChange}
                                                                    value={form.incremento_esquema_2}
                                                                    type="text"
                                                                    prefix={'%'}
                                                                    customstyle={{ width: "70px" }}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-center">
                                                                <InputNumberSinText
                                                                    requirevalidation={1}
                                                                    formeditado={formeditado}
                                                                    name="incremento_esquema_3"
                                                                    onChange={onChange}
                                                                    value={form.incremento_esquema_3}
                                                                    type="text"
                                                                    prefix={'%'}
                                                                    customstyle={{ width: "70px" }}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group d-flex justify-content-center mb-1">
                                <Button
                                    icon=''
                                    onClick={addRow}
                                    className={"btn btn-icon btn-light-primary btn-sm ml-auto"}
                                    only_icon={"flaticon2-plus icon-nm"}
                                    tooltip={{ text: 'AGREGAR' }}
                                />
                            </div>
                            <div className="d-flex justify-content-center">
                                <table className="table table-separate table-responsive-sm text-center w-50" id="table_diseño">
                                    <thead>
                                        <tr>
                                            <th className="pb-0 border-bottom-0">Inferior</th>
                                            <th className="pb-0 border-bottom-0">Superior</th>
                                            <th className="pb-0 border-bottom-0">Cambio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            form.variaciones.map((variaciones, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td>
                                                            <div className="d-flex justify-content-center">
                                                                <InputNumberSinText
                                                                    requirevalidation={1}
                                                                    formeditado={formeditado}
                                                                    name="inferior"
                                                                    value={form['variaciones'][key]['inferior']}
                                                                    onChange={e => onChangeNominasAdmin(key, e, 'inferior')}
                                                                    type="text"
                                                                    customstyle={{ width: "auto" }}
                                                                    identificador={"inferior"}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-center">
                                                                <InputNumberSinText
                                                                    requirevalidation={1}
                                                                    formeditado={formeditado}
                                                                    name="superior"
                                                                    value={form['variaciones'][key]['superior']}
                                                                    onChange={e => onChangeNominasAdmin(key, e, 'superior')}
                                                                    type="text"
                                                                    customstyle={{ width: "auto" }}
                                                                    identificador={"superior"}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-center">
                                                                <InputMoneySinText
                                                                    requirevalidation={1}
                                                                    formeditado={formeditado}
                                                                    name="cambio"
                                                                    value={form['variaciones'][key]['cambio']}
                                                                    onChange={e => onChangeNominasAdmin(key, e, 'cambio')}
                                                                    thousandseparator={true}
                                                                    prefix={'$'}
                                                                    customstyle={{ width: "auto" }}
                                                                    identificador={"cambio"}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer py-3 pr-1">
                        <div className="row">
                            <div className="col-lg-12 text-right pr-0 pb-0">
                                <Button icon='' className="btn btn-primary mr-2"
                                    onClick={
                                        (e) => {
                                            e.preventDefault();
                                            validateAlert(onSubmit, e, 'form-diseño')
                                        }
                                    }
                                    text="ENVIAR" />
                            </div>
                        </div>
                    </div>
                </Form>
            </>
        )
    }
}

export default DiseñoForm