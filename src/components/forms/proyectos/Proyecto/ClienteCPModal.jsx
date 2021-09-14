import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { ReactSelectSearchGray, Button } from '../../../form-components'
import { waitAlert, validateAlert } from '../../../../functions/alert'
import { printTableCP } from '../../../../functions/setters'
class ClienteCPModal extends Component {
    transformarOptions = options => {
        options = options ? options : []
        options.map((value) => {
            value.label = value.name
            return ''
        });
        return options
    }
    updateSelect = (value, name) => {
        if (value === null) {
            value = []
        }
        const { onChange } = this.props
        onChange({ target: { value: value, name: name } })
    }
    render() {
        const { sendForm, form, onChange, options } = this.props
        return (
            <Form id="form-clientecp" onSubmit = { (e) => { e.preventDefault(); waitAlert(); validateAlert(sendForm, e, 'form-clientecp') } } >
                <div className="row py-0 mx-0 mt-6 align-items-center d-flex justify-content-center">
                    <label className="w-auto mr-4 py-0 col-form-label text-dark-60 font-weight-bold font-size-lg">¿Quieres utilizar la ubicación del cliente?</label>
                    <div className="w-auto px-3">
                        <div className="radio-inline mt-0 ">
                            <label className="radio radio-outline radio-brand text-dark-60 font-weight-bold">
                                <input
                                    type="radio"
                                    name='ubicacion_cliente'
                                    value={true}
                                    onChange={onChange}
                                    checked={form.ubicacion_cliente === true ? true : false}
                                />Si
                                <span></span>
                            </label>
                            <label className="radio radio-outline radio-brand text-dark-60 font-weight-bold">
                                <input
                                    type="radio"
                                    name='ubicacion_cliente'
                                    value={false}
                                    onChange={onChange}
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
                            <div className="col-md-7">
                                <ReactSelectSearchGray
                                    placeholder='¿DE CUÁL CLIENTE DESEA UTILIZAR SU UBICACIÓN?'
                                    defaultvalue={form.cp_ubicacion}
                                    iconclass='las la-user icon-xl'
                                    options={options.cp_clientes}
                                    onChange={(value) => { this.updateSelect(value, 'cp_ubicacion') }}
                                    requirevalidation={1}
                                    messageinc="Selecciona el cliente."
                                />
                            </div>
                        </div>
                        : ''
                }
                {
                    form.cp_ubicacion.value || options.cp_clientes.length === 1 ?
                        <div className={form.ubicacion_cliente === false ? 'd-none' : 'table-responsive-lg mt-7 mb-10'}>
                            <table className="table table-vertical-center w-65 mx-auto table-borderless" id="tcalendar_p_info">
                                {
                                    options.cp_clientes.map((cliente, key) => {
                                        if (form.cp_ubicacion.value === cliente.value) {
                                            return (
                                                printTableCP(key, cliente)
                                            )
                                        } else if (options.cp_clientes.length === 1) {
                                            return (
                                                printTableCP(key, cliente)
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
                            <Button icon='' className="mx-auto" text="CONFIRMAR" onClick = { (e) => { e.preventDefault(); validateAlert(sendForm, e, 'form-clientecp') } } />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default ClienteCPModal