import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Button, InputNumberSinText, InputMoneySinText } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableForNominas } from '../../../functions/setters'
class DiseñoForm extends Component {
    render() {
        const { form, onChange, onSubmit, formeditado, requirevalidation, onChangeVariaciones, addRow, deleteRow, grafica, ...props } = this.props
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
                    <div className="col-md-12 text-center">
                        <div className="d-flex justify-content-center">
                            <div className="col-md-3">
                                <InputMoneySinText
                                    requirevalidation={1}
                                    formeditado={formeditado}
                                    thousandseparator={true}
                                    prefix={'$'}
                                    name="precio_inicial_diseño"
                                    value={form.precio_inicial_diseño}
                                    onChange={onChange}
                                    placeholder="PRECIO INICIAL"
                                    customclass="border-top-0 border-left-0 border-right-0 rounded-0 text-center pl-0 "
                                />
                            </div>
                            <div className="col-md-3">
                                <InputNumberSinText
                                    requirevalidation={0}
                                    formeditado={formeditado}
                                    name="m2"
                                    onChange={onChange}
                                    value={form.m2}
                                    type="text"
                                    placeholder="M2"
                                    messageinc="Incorrecto. Ingresa los M2."
                                    customclass="border-top-0 border-left-0 border-right-0 rounded-0 text-center pl-0"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row my-4 d-flex justify-content-center">
                        <div className="col-md-8">
                            <div className="separator separator-dashed"></div>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-md-12 px-0">
                            <div className="tab-content">
                                <div className="table-responsive d-flex justify-content-center">
                                    <table className="table table-responsive-lg table-vertical-center text-center" id="esquemas">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th></th>
                                                <th style={{minWidth:'100px'}}>ESQUEMA 1</th>
                                                <th>ESQUEMA 2</th>
                                                <th>ESQUEMA 3</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th scope="row" className="bg-gray-200">PRECIO DISEÑO</th>
                                                <td>
                                                    {
                                                        form.precio_esquema_1 !== '-' ?
                                                            setMoneyTableForNominas(form.precio_esquema_1)
                                                            : '-'
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        form.precio_esquema_2 !== '-' ?
                                                            setMoneyTableForNominas(form.precio_esquema_2)
                                                            : '-'
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        form.precio_esquema_3 !== '-' ?
                                                            setMoneyTableForNominas(form.precio_esquema_3)
                                                            : '-'
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row" className="bg-gray-200">INCREMENTO</th>
                                                <td>-</td>
                                                <td className="px-1">
                                                    <div className="d-flex justify-content-center">
                                                        <InputNumberSinText
                                                            requirevalidation={0}
                                                            name="incremento_esquema_2"
                                                            onChange={onChange}
                                                            value={form.incremento_esquema_2}
                                                            prefix='%'
                                                            identificador='incremento_esquema_2'
                                                            customclass="border-top-0 border-left-0 border-right-0 rounded-0 w-100px text-center pl-0 border-dark"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-1">
                                                    <div className="d-flex justify-content-center">
                                                        <InputNumberSinText
                                                            requirevalidation={0}
                                                            name="incremento_esquema_3"
                                                            onChange={onChange}
                                                            value={form.incremento_esquema_3}
                                                            prefix='%'
                                                            customclass="border-top-0 border-left-0 border-right-0 rounded-0 w-100px text-center pl-0 border-dark"
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
                    <div className="card-footer py-3 pr-1">
                        <div className="row mx-0">
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