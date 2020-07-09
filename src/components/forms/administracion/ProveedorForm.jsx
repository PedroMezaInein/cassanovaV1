import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Subtitle } from '../../texts'
import { Input, Select, SelectSearch, Button, InputNumber, InputPhone} from '../../form-components'
import { RFC, TEL, EMAIL} from '../../../constants'
import { validateAlert } from '../../../functions/alert'

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
        const { title, options, form, onChange, setOptions, onSubmit, formeditado, ...props } = this.props 
       // const formeditado = 1;
        return (
            <Form id="form-proveedor"
                onSubmit = { 
                    (e) => {
                        /* e.preventDefault(); 
                        var elementsInvalid = document.getElementById("form-proveedor").getElementsByClassName("is-invalid"); 
                        if(elementsInvalid.length===0){   
                            onSubmit(e)
                        }else{ 
                            alert("Rellena todos los campos")
                        }  */
                        e.preventDefault(); 
                        validateAlert(onSubmit, e, 'form-proveedor')
                    }
                }
                {...props}
                >
                <Subtitle className="text-center">
                    {
                        title
                    }
                </Subtitle>
                <div className="">
                    <div className="form-group row form-group-marginless mt-5">
                        <div className="col-md-4">
                            <Input 
                                requirevalidation={1}
                                name="nombre" 
                                value={form.nombre} 
                                placeholder="Nombre de contacto" 
                                onChange={onChange} 
                                iconclass={"far fa-user"}
                                formeditado={formeditado}
                                messageinc="Incorrecto. Ingresa el nombre."
                            />
                            {/*<span className="form-text text-muted">Por favor, ingrese el nombre. </span>*/}
                        </div>

                        <div className="col-md-4">
                            <Input            
                                requirevalidation={1}                 
                                name="razonSocial"
                                value={form.razonSocial}
                                placeholder="Razón social / Nombre de la empresa"
                                onChange={onChange}
                                iconclass={"far fa-building"}
                                formeditado={formeditado}
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
                                formeditado={formeditado}
                                messageinc="Incorrecto. Ej. ABCD001122ABC"
                                maxLength="13"
                            />
                            {/*<span className="form-text text-muted">Por favor, ingrese su RFC. </span>*/}
                        </div>
                    </div>
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    <div className="form-group row form-group-marginless">
                        <div className="col-md-4">
                            <Input 
                                requirevalidation={1}
                                name="correo" 
                                value={form.correo} 
                                placeholder="Correo electrónico" 
                                type="email" 
                                onChange={onChange} 
                                iconclass={"fas fa-envelope"}                                            
                                messageinc="Incorrecto. Ej. usuario@dominio.com"
                                patterns={EMAIL}
                                formeditado={formeditado}
                            />
                            {/*<span className="form-text text-muted">Por favor, ingrese su correo electrónico. </span>*/}
                        </div>

                        <div className="col-md-4">
                            <InputPhone 
                                requirevalidation={1}
                                thousandSeparator={false}
                                prefix = { '' }
                                name="telefono" 
                                value={form.telefono}
                                placeholder="Teléfono" 
                                onChange={onChange} 
                                iconclass={"fas fa-mobile-alt"}                                            
                                messageinc="Incorrecto. Ingresa el número de teléfono."
                                patterns={TEL}
                                formeditado={formeditado}
                            />
                            {/*<span className="form-text text-muted">Por favor, ingrese su teléfono. </span>*/}
                        </div>

                        {/* <div className="col-md-4">
                            <Input name="cuenta" value={form.cuenta} placeholder="Cuenta" onChange={onChange} iconclass={"la la-file-text-o"}/>
                        </div> */}

                        <div className="col-md-4">
                            <InputNumber 
                                requirevalidation={0}
                                name="numCuenta" 
                                value={form.numCuenta}
                                placeholder="Número de cuenta"
                                onChange={onChange}
                                iconclass={" fas fa-id-card "}
                                formeditado={formeditado}
                                messageinc="Incorrecto. Ingresa el número de cuenta."
                            />
                            {/*<span className="form-text text-muted">Por favor, ingrese el número de cuenta </span>*/}
                        </div>
                    </div>
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    <div className="form-group row form-group-marginless">
                        <div className="col-md-4">
                            <Select 
                                requirevalidation={0} 
                                name='tipo' 
                                options={options.tipos} 
                                placeholder='Selecciona el tipo de cuenta' 
                                value={form.tipo}
                                onChange={onChange} 
                                formeditado={formeditado}
                                iconclass={" far fa-address-card"}
                            />
                            {/*<span className="form-text text-muted">Por favor, ingrese el tipo de cuenta </span>*/}
                        </div>
                        <div className="col-md-4">
                            <Select 
                                requirevalidation={0} 
                                name='banco' 
                                options={options.bancos} 
                                placeholder='Selecciona el banco' 
                                value={form.banco}
                                onChange={onChange} 
                                formeditado={formeditado}
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
                                required
                                options={options.areas}
                                placeholder="Selecciona el área"
                                name="area" 
                                value={form.area} 
                                onChange={this.updateArea} 
                                formeditado={formeditado}
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
                                        required
                                        options={options.subareas} 
                                        placeholder="Selecciona el subárea"
                                        name="subarea" 
                                        value={form.subarea} 
                                        onChange={this.updateSubarea} 
                                        formeditado={formeditado}
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