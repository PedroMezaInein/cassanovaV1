import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { SelectSearchGray, Button } from '../../../form-components'
import { waitAlert } from '../../../../functions/alert'

class ClienteCPModal extends Component {
    render() {
        const { sendForm, form, onChangeProyecto, updateSelectCP, options } = this.props
        return (
            <Form onSubmit={(e) => { e.preventDefault(); waitAlert(); sendForm(); }}>
                <div className="row py-0 mx-0 mt-6 align-items-center d-flex justify-content-center">
                    <label className="w-auto mr-4 py-0 col-form-label text-dark-75 font-weight-bold font-size-lg">¿Quieres utilizar la ubicación del cliente?</label>
                    <div className="w-auto px-3">
                        <div className="radio-inline mt-0 ">
                            <label className="radio radio-outline radio-brand text-dark-75 font-weight-bold">
                                <input
                                    type="radio"
                                    name='ubicacion_cliente'
                                    value={true}
                                    onChange={onChangeProyecto}
                                    checked={form.ubicacion_cliente === true ? true : false}
                                />Si
                                <span></span>
                            </label>
                            <label className="radio radio-outline radio-brand text-dark-75 font-weight-bold">
                                <input
                                    type="radio"
                                    name='ubicacion_cliente'
                                    value={false}
                                    onChange={onChangeProyecto}
                                    checked={form.ubicacion_cliente === false ? true : false}
                                />No
                                <span></span>
                            </label>
                        </div>
                    </div>
                </div>
                {
                    form.ubicacion_cliente && options.cp_clientes.length !== 1 ?
                        <div className="row mx-0 mt-5 text-center d-flex justify-content-center">
                            <Form.Label className="col-md-12 col-form-label font-weight-bolder">¿DE CUÁL CLIENTE DESEA UTILIZAR SU UBICACIÓN?</Form.Label>
                            <div className="col-md-4">
                                <SelectSearchGray
                                    formeditado={0}
                                    options={options.cp_clientes}
                                    placeholder="SELECCIONA EL CLIENTE"
                                    name="cp_ubicacion"
                                    value={form.cp_ubicacion}
                                    onChange={updateSelectCP}
                                    withtaglabel={0}
                                    withtextlabel={0}
                                    customdiv={'mb-0'}
                                    withicon={1}
                                />
                            </div>
                        </div>
                        : ''
                }
                {
                    form.cp_ubicacion || options.cp_clientes.length === 1 ?
                        <div className={form.ubicacion_cliente === false ? 'd-none' : 'table-responsive-lg mt-7 mb-10'}>
                            <table className="table table-vertical-center w-65 mx-auto table-borderless" id="tcalendar_p_info">
                                {
                                    options.cp_clientes.map((cliente, key) => {
                                        if (form.cp_ubicacion === cliente.value) {
                                            return (
                                                this.printTable(key, cliente)
                                            )
                                        } else if (options.cp_clientes.length === 1) {
                                            return (
                                                this.printTable(key, cliente)
                                            )
                                        }
                                        return <></>
                                    })
                                }
                            </table>
                        </div>
                        : ''
                }
                <div className="card-footer p-0 mt-4 pt-3">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-center p-0">
                            <Button icon='' className="mx-auto" type="submit" text="CONFIRMAR" />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default ClienteCPModal