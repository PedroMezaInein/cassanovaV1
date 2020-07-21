import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Subtitle } from '../../texts'
import { Input, Select, SelectSearch, Button, InputNumber, InputPhone } from '../../form-components'
import { RFC, TEL, EMAIL } from '../../../constants'
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
                onSubmit={
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
                                placeholder="NOMBRE DE CONTACTO"
                                onChange={onChange}
                                iconclass={"far fa-user"}
                                formeditado={formeditado}
                                messageinc="Incorrecto. Ingresa el nombre."
                            />
                        </div>

                        <div className="col-md-4">
                            <Input
                                requirevalidation={1}
                                name="razonSocial"
                                value={form.razonSocial}
                                placeholder="RAZÓN SOCIAL / NOMBRE DE LA EMPRESA"
                                onChange={onChange}
                                iconclass={"far fa-building"}
                                formeditado={formeditado}
                                messageinc="Incorrecto. Ingresa la razón social."
                            />
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
                        </div>
                    </div>
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    <div className="form-group row form-group-marginless">
                        <div className="col-md-4">
                            <Input
                                requirevalidation={1}
                                name="correo"
                                value={form.correo}
                                placeholder="CORREO ELECTRÓNICO"
                                type="email"
                                onChange={onChange}
                                iconclass={"fas fa-envelope"}
                                messageinc="Incorrecto. Ej. usuario@dominio.com"
                                patterns={EMAIL}
                                formeditado={formeditado}
                            />
                        </div>

                        <div className="col-md-4">
                            <InputPhone
                                requirevalidation={1}
                                thousandSeparator={false}
                                prefix={''}
                                name="telefono"
                                value={form.telefono}
                                placeholder="TELÉFONO"
                                onChange={onChange}
                                iconclass={"fas fa-mobile-alt"}
                                messageinc="Incorrecto. Ingresa el número de teléfono."
                                patterns={TEL}
                                formeditado={formeditado}
                            />
                        </div>

                        {/* <div className="col-md-4">
                            <Input name="cuenta" value={form.cuenta} placeholder="Cuenta" onChange={onChange} iconclass={"la la-file-text-o"}/>
                        </div> */}

                        <div className="col-md-4">
                            <InputNumber
                                requirevalidation={0}
                                name="numCuenta"
                                value={form.numCuenta}
                                placeholder="NÚMERO DE CUENTA"
                                onChange={onChange}
                                iconclass={" fas fa-id-card "}
                                formeditado={formeditado}
                                messageinc="Incorrecto. Ingresa el número de cuenta."
                            />
                        </div>
                    </div>
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    <div className="form-group row form-group-marginless">
                        <div className="col-md-4">
                            <Select
                                requirevalidation={0}
                                name='tipo'
                                options={options.tipos}
                                placeholder='SELECCIONA EL TIPO DE CUENTA'
                                value={form.tipo}
                                onChange={onChange}
                                formeditado={formeditado}
                                iconclass={" far fa-address-card"}
                            />
                        </div>
                        <div className="col-md-4">
                            <Select
                                requirevalidation={0}
                                name='banco'
                                options={options.bancos}
                                placeholder='SELECCIONA EL BANCO'
                                value={form.banco}
                                onChange={onChange}
                                formeditado={formeditado}
                                iconclass={" fab fa-cc-discover "}
                            />
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
                                placeholder="SELECCIONA EL ÁREA"
                                name="area"
                                value={form.area}
                                onChange={this.updateArea}
                                formeditado={formeditado}
                                iconclass={"far fa-window-maximize"}
                            />
                        </div>
                    </div>
                    <div className="form-group row form-group-marginless">
                        {
                            form.area ?
                                <div className="col-md-4">
                                    <SelectSearch
                                        required
                                        options={options.subareas}
                                        placeholder="SELECCIONA EL SUBÁREA"
                                        name="subarea"
                                        value={form.subarea}
                                        onChange={this.updateSubarea}
                                        formeditado={formeditado}
                                        iconclass={"far fa-window-restore"}
                                    />
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