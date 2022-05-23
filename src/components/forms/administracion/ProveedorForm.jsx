import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, Select, SelectSearch, Button, InputNumber,InputPhone,CalendarDay } from '../../form-components'
import { RFC, TEL, EMAIL } from '../../../constants'
import { validateAlert } from '../../../functions/alert'
class ProveedorForm extends Component {
    updateArea = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'area' } })
        onChange({ target: { value: '', name: 'subarea' } })
        const { options: { areas } } = this.props
        areas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('subareas', element.subareas)
            }
            return false
        })
    }

    updateSubarea = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'subarea', value: value.toString() } })
    }

    render() {
        const { title, options, form, onChange, setOptions, onSubmit, formeditado, ...props } = this.props
        return (
            <Form id="form-proveedor"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-proveedor')
                    }
                }
                {...props}
            >
                <div className="form-group row form-group-marginless mt-4">
                    <div className="col-md-3">
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
                    <div className="col-md-3">
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
                    <div className="col-md-3">
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
                    <div className="col-md-3">
                        <Input
                            requirevalidation={0}
                            name="correo"
                            value={form.correo}
                            placeholder="CORREO ELECTRÓNICO personal"
                            type="email"
                            onChange={onChange}
                            iconclass={"fas fa-envelope"}
                            messageinc="Incorrecto. Ej. usuario@dominio.com"
                            patterns={EMAIL}
                            formeditado={formeditado}
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    
                    <div className="col-md-3">
                        <InputPhone
                            requirevalidation={0}
                            thousandseparator={false}
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
                    <div className="col-md-3">
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
                    <div className="col-md-3">
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
                    <div className="col-md-3">
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
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    
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
                    <div className="col-md-3">
                        <SelectSearch
                            required
                            options={options.areas}
                            placeholder="SELECCIONA EL ÁREA"
                            name="area"
                            value={form.area}
                            onChange={this.updateArea}
                            formeditado={formeditado}
                            iconclass={"far fa-window-maximize"}
                            messageinc="Incorrecto. Selecciona el área"
                        />
                    </div>
                    {
                        form.area ?
                            <div className="col-md-3">
                                <SelectSearch
                                    required
                                    options={options.subareas}
                                    placeholder="SELECCIONA EL SUBÁREA"
                                    name="subarea"
                                    value={form.subarea}
                                    onChange={this.updateSubarea}
                                    formeditado={formeditado}
                                    iconclass={"far fa-window-restore"}
                                    messageinc="Incorrecto. Selecciona el subárea"
                                />
                            </div>
                            : ''
                    }

                     <div className="col-md-3">
                        <Select
                            requirevalidation={0}
                            name='tipo_persona'
                            options={options.tipo_persona}
                            placeholder='SELECCIONA TIPO DE PERSONA'
                            value={form.tipo_persona}
                            onChange={onChange}
                            formeditado={formeditado}
                            iconclass={" fab fa-cc-discover "}
                        />
                    </div>
                    
                </div>
                <div className="separator separator-dashed mt-1 mb-2">  </div>
                <p>Datos para contrato</p> 
                <div className="form-group row form-group-marginless">

                    <div className="col-md-3">
                        <Input
                            requirevalidation={1}
                            name="nombre_persona"
                            value={form.nombre_persona}
                            placeholder="Nombre persona moral  / fisica"
                            onChange={onChange}
                            iconclass={"far fa-building"}
                            formeditado={formeditado}
                            messageinc="Incorrecto. Ingresa el nombre persona moral  / fisica."
                        />
                    </div>
                    <div className="col-md-3">
                        <Input
                            requirevalidation={1}
                            name="direccion_persona"
                            value={form.direccion_persona}
                            placeholder="Direccion del persona  moral  / fisica."
                            onChange={onChange}
                            iconclass={"far fa-building"}
                            formeditado={formeditado}
                            messageinc="Incorrecto. Ingresa la direccion de la persona moral  / fisica."
                        />
                    </div>
                    <div className="col-md-3">
                        <Input
                            name="rfc_persona"
                            value={form.rfc_persona}
                            placeholder="RFC persona moral  / fisica"
                            onChange={onChange}
                            iconclass={"far fa-file-alt"}
                            patterns={RFC}
                            formeditado={formeditado}
                            messageinc="Incorrecto. Ingresa el rfc persona moral  / fisica."
                            maxLength="13"
                        />                        
                    </div>
                    <div className="col-md-3">
                        <InputPhone
                            requirevalidation={1}
                            thousandseparator={false}
                            prefix={''}
                            name="telefono_persona"
                            value={form.telefono_persona}
                            placeholder="TELÉFONO persona moral  / fisica"
                            onChange={onChange}
                            iconclass={"fas fa-mobile-alt"}
                            messageinc="Incorrecto. Ingresa el número de teléfono."
                            patterns={TEL}
                            formeditado={formeditado}
                        />
                    </div>
                    
                </div>
                <div className="form-group row form-group-marginless">

                    <div className="col-md-3">
                        <Input
                            requirevalidation={0}
                            name="email_persona"
                            value={form.email_persona}
                            placeholder="CORREO ELECTRÓNICO"
                            type="email"
                            onChange={onChange}
                            iconclass={"fas fa-envelope"}
                            messageinc="Incorrecto. Ej. usuario@dominio.com"
                            patterns={EMAIL}
                            formeditado={formeditado}
                        />
                    </div>    
                    <div className="col-md-3">
                        <Input
                            requirevalidation={1}
                            name="nombre_representante"
                            value={form.nombre_representante}
                            placeholder="Nombre del representante"
                            onChange={onChange}
                            iconclass={"far fa-building"}
                            formeditado={formeditado}
                            messageinc="Incorrecto. Ingresa el Nombre del representante."
                        />
                    </div>                      
                  
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <p>Datos para Persona moral</p> 
                <div className="form-group row form-group-marginless">

                    <div className="col-md-2">
                        <Select
                            requirevalidation={0}
                            name='tipo_consta'
                            options={options.tipo_consta}
                            placeholder='SELECCIONA TIPO DE CONSTA'
                            value={form.tipo_consta}
                            onChange={onChange}
                            formeditado={formeditado}
                            iconclass={" fab fa-cc-discover "}
                        />
                    </div>       
                    <div className="col-md-2">
                        <Input
                            name="numero_consta"
                            requirevalidation={0}
                            value={form.numero_consta}
                            placeholder="Numero"
                            onChange={onChange}
                            iconclass={"far fa-file-alt"}
                            patterns={RFC}
                            formeditado={formeditado}
                            messageinc="Incorrecto. Ingresa el numero."
                            maxLength="13"
                        />                        
                    </div>
                    <div className="col-md-3">
                        <Input
                            requirevalidation={0}
                            name="nombre_notario"
                            value={form.nombre_notario}
                            placeholder="Nombre del notario o corredor"
                            onChange={onChange}
                            iconclass={"far fa-building"}
                            formeditado={formeditado}
                            messageinc="Incorrecto. Ingresa el Nombre del notario o corredor."
                        />
                    </div>     
                    <div className="col-md-2">
                        <Input
                            name="numero_notario"
                            requirevalidation={0}
                            value={form.numero_notario}
                            placeholder="Numero del notario o corredor."
                            onChange={onChange}
                            iconclass={"far fa-file-alt"}
                            patterns={RFC}
                            formeditado={formeditado}
                            messageinc="Incorrecto. Ingresa el numero del notario o corredor."
                            maxLength="13"
                        />                        
                    </div>
                    <div className="col-md-2">
                        <Input
                            requirevalidation={0}
                            name="ciudad_notario"
                            value={form.ciudad_notario}
                            placeholder="Ciduad"
                            onChange={onChange}
                            iconclass={"far fa-building"}
                            formeditado={formeditado}
                            messageinc="Incorrecto. Ingresa lac iudad."
                        />
                    </div>   
                   
                </div>
                <div className="form-group row form-group-marginless">

                        <div className="col-md-2">
                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                <label className="text-center font-weight-bold text-dark-60">Fecha de la sociedad</label>
                            </div>
                            <CalendarDay value={form.fecha_sociedad} name='fecha_sociedad' date={form.fecha_sociedad}  onChange={onChange} withformgroup={0} requirevalidation={0}/>
                        </div>               
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>

                <div className="form-group row form-group-marginless">
                    
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' className="btn btn-primary mr-2"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-proveedor')
                                    }
                                }
                                text="ENVIAR"
                            />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default ProveedorForm