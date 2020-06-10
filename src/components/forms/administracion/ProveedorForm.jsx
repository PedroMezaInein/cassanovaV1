import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Subtitle } from '../../texts'
import { Input, Select, SelectSearch, Button } from '../../form-components'

class ProveedorForm extends Component {

    updateArea = value => {
        const { onChange, setOptions } = this.props

        onChange({ target: { value: value, name: 'area' } })
        onChange({ target: { value: '', name: 'subarea' } })

        const { options: { areas: areas } } = this.props
        const aux = areas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('subareas', element.subareas)
            }
        })

    }

    updateSubarea = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'subarea', value: value.toString() } })
    }

    render() {
        const { title, options, form, onChange, setOptions, ...props } = this.props
        return (
            <Form {...props}>
                <Subtitle className="text-center">
                    {
                        title
                    }
                </Subtitle>
                <div className="">

                    <div className="form-group row form-group-marginless mt-5">
                        <div className="col-md-4">
                            <Input name="nombre" value={form.nombre} placeholder="Nombre" onChange={onChange} iconclass={"far fa-user"} spantext={"nombre."} />
                        </div>

                        <div className="col-md-4">
                            <Input name="razonSocial" value={form.razonSocial} placeholder="Razón social" onChange={onChange} iconclass={"far fa-file"} spantext={"razón social."} />
                        </div>

                        <div className="col-md-4">
                            <Input name="rfc" value={form.rfc} placeholder="RFC" onChange={onChange} iconclass={"far fa-file-alt"} spantext={"RFC."} />
                        </div>
                    </div>

                    <div className="form-group row form-group-marginless">

                        <div className="col-md-4">
                            <Input name="correo" value={form.correo} placeholder="Correo electrónico" type="email" onChange={onChange} iconclass={"far fa-envelope"} spantext={"correo electrónico."} />
                        </div>

                        <div className="col-md-4">
                            <Input name="telefono" value={form.telefono} placeholder="Teléfono" onChange={onChange} iconclass={"fas fa-mobile-alt"} spantext={"teléfono."} />
                        </div>

                        {/* <div className="col-md-4">
                            <Input name="cuenta" value={form.cuenta} placeholder="Cuenta" onChange={onChange} iconclass={"la la-file-text-o"} spantext={"cuenta."}/>
                        </div> */}

                        <div className="col-md-4">
                            <Input name="numCuenta" value={form.numCuenta} placeholder="Número de cuenta" onChange={onChange} iconclass={"far fa-credit-card"} spantext={"número de cuenta."} />
                        </div>
                    </div>

                    <div className="form-group row form-group-marginless">
                        <div className="col-md-4">
                            <Select required name='tipo' options={options.tipos} placeholder='Selecciona el tipo de cuenta' value={form.tipo}
                                onChange={onChange} />
                        </div>
                        <div className="col-md-4">
                            <Select required name='banco' options={options.bancos} placeholder='Selecciona el banco' value={form.banco}
                                onChange={onChange} />
                        </div>
                        {
                            form.leadId ?
                                <Input name="leadId" value={form.leadIn} readOnly hidden />
                                : ''
                        }
                        <div className="col-md-4">
                            <SelectSearch options={options.areas} placeholder="Selecciona el área"
                                name="area" value={form.area} onChange={this.updateArea} />
                        </div>
                    </div>
                    <div className="form-group row form-group-marginless">
                        {
                            form.area ?
                                <div className="col-md-4">
                                    <SelectSearch options={options.subareas} placeholder="Selecciona el subárea"
                                        name="subarea" value={form.subarea} onChange={this.updateSubarea} />
                                </div>
                                : ''
                        }
                    </div>
                </div>
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>
            </Form>
        )
    }
}

export default ProveedorForm