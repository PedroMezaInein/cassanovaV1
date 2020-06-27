import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Subtitle } from '../../texts'
import { Input, Select, SelectSearch, Button } from '../../form-components'
import { RFC, TEL, EMAIL} from '../../../constants'

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
                            <Input 
                                name="nombre" 
                                value={form.nombre} 
                                placeholder="Nombre" 
                                onChange={onChange} 
                                iconclass={"far fa-user"}
                                messageinc="Incorrecto. Ingresa el nombre."
                            />
                            {/*<span className="form-text text-muted">Por favor, ingrese el nombre. </span>*/}
                        </div>

                        <div className="col-md-4">
                            <Input 
                                name="razonSocial"
                                value={form.razonSocial}
                                placeholder="Razón social"
                                onChange={onChange}
                                iconclass={"far fa-building"}
                                messageinc="Incorrecto. Ingresa la razón social."
                            />
                            {/*<span className="form-text text-muted">Por favor, ingrese su razón social. </span>*/}
                        </div>

                        <div className="col-md-4">
                            <Input 
                                name="rfc"
                                value={form.rfc}
                                placeholder="RFC"
                                onChange={onChange}
                                iconclass={"far fa-file-alt"}
                                patterns={RFC}
                                messageinc="Incorrecto. Ej. ABCD001122ABC"
                                maxLength="13"
                            />
                            {/*<span className="form-text text-muted">Por favor, ingrese su RFC. </span>*/}
                        </div>
                    </div>

                    <div className="form-group row form-group-marginless">
                        <div className="col-md-4">
                            <Input 
                                name="correo" 
                                value={form.correo} 
                                placeholder="Correo electrónico" 
                                type="email" 
                                onChange={onChange} 
                                iconclass={"fas fa-envelope"}                                            
                                messageinc="Incorrecto. Ej. usuario@dominio.com"
                                patterns={EMAIL}
                            />
                            {/*<span className="form-text text-muted">Por favor, ingrese su correo electrónico. </span>*/}
                        </div>

                        <div className="col-md-4">
                            <Input 
                                name="telefono" 
                                value={form.telefono}
                                placeholder="Teléfono" 
                                onChange={onChange} 
                                iconclass={"fas fa-mobile-alt"}
                                messageinc="Incorrecto. Ingresa el número de contacto."
                                patterns={TEL}
                                maxLength="10"
                            />
                            {/*<span className="form-text text-muted">Por favor, ingrese su teléfono. </span>*/}
                        </div>

                        {/* <div className="col-md-4">
                            <Input name="cuenta" value={form.cuenta} placeholder="Cuenta" onChange={onChange} iconclass={"la la-file-text-o"}/>
                        </div> */}

                        <div className="col-md-4">
                            <Input 
                                name="numCuenta" 
                                value={form.numCuenta}
                                placeholder="Número de cuenta"
                                onChange={onChange}
                                iconclass={" fas fa-id-card "}
                                messageinc="Incorrecto. Ingresa el número de cuenta."
                            />
                            {/*<span className="form-text text-muted">Por favor, ingrese el número de cuenta </span>*/}
                        </div>
                    </div>

                    <div className="form-group row form-group-marginless">
                        <div className="col-md-4">
                            <Select 
                                required 
                                name='tipo' 
                                options={options.tipos} 
                                placeholder='Selecciona el tipo de cuenta' 
                                value={form.tipo}
                                onChange={onChange} 
                                iconclass={" far fa-address-card"}
                            />
                            {/*<span className="form-text text-muted">Por favor, ingrese el tipo de cuenta </span>*/}
                        </div>
                        <div className="col-md-4">
                            <Select 
                                required 
                                name='banco' 
                                options={options.bancos} 
                                placeholder='Selecciona el banco' 
                                value={form.banco}
                                onChange={onChange} 
                                iconclass={" fab fa-cc-discover "}
                            />
                            {/*<span className="form-text text-muted">Por favor, seleccione el banco </span>*/}
                        </div>
                        {
                            form.leadId ?
                                <Input 
                                    name="leadId" 
                                    value={form.leadIn} 
                                    readOnly 
                                    hidden 
                                />
                                : ''
                        }
                        <div className="col-md-4">
                            <SelectSearch 
                                options={options.areas}
                                placeholder="Selecciona el área"
                                name="area" 
                                value={form.area} 
                                onChange={this.updateArea} 
                                iconclass={"far fa-window-maximize"}
                            />
                            {/*<span className="form-text text-muted">Por favor, ingrese el área </span>*/}
                        </div>
                    </div>
                    <div className="form-group row form-group-marginless">
                        {
                            form.area ?
                                <div className="col-md-4">
                                    <SelectSearch 
                                        options={options.subareas} 
                                        placeholder="Selecciona el subárea"
                                        name="subarea" 
                                        value={form.subarea} 
                                        onChange={this.updateSubarea} 
                                        iconclass={"far fa-window-restore"}
                                    />
                                    {/*<span className="form-text text-muted">Por favor, ingrese la sub-área </span>*/}
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