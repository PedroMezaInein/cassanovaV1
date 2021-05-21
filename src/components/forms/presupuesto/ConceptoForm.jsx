import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, SelectSearch, Button, InputMoney } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import SelectSearchTrue from '../../form-components/SelectSearchTrue'

class ConceptoForm extends Component {

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

    render() {
        const { title, options, form, onChange, onSubmit, formeditado, setOptions, ...props } = this.props
        return (
            <Form id="form-concepto"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-concepto')
                    }
                }
                {...props}
            >
                <div className="form-group row form-group-marginless">
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
                            requirevalidation={0}
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
                            <Button text='ENVIAR' type='submit' className="btn btn-primary mr-2" icon=''/>
                        </div>
                    </div>
                </div>
            </Form >
        )
    }
}

export default ConceptoForm