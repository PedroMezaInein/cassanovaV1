import React, { Component } from 'react'
import { Subtitle } from '../../texts'
import { SelectSearch, Select, Calendar, RadioGroup, FileInput, Button, Input, InputMoney } from '../../form-components'
import { Form } from 'react-bootstrap'
import { RFC } from '../../../constants'

function openWizard1(){  
    document.getElementById('wizardP').setAttribute("data-wizard-state","first");
    document.getElementById('wizard-1').setAttribute("data-wizard-state","current");
    document.getElementById('wizard-2').setAttribute("data-wizard-state","pending");
    document.getElementById('wizard-3').setAttribute("data-wizard-state","pending");
    document.getElementById('wizard-1-content').setAttribute("data-wizard-state","current");  
    document.getElementById("wizard-2-content").removeAttribute("data-wizard-state");
    document.getElementById("wizard-3-content").removeAttribute("data-wizard-state");
}
function openWizard2(){  
    document.getElementById('wizardP').setAttribute("data-wizard-state","between");
    document.getElementById('wizard-1').setAttribute("data-wizard-state","done");
    document.getElementById('wizard-2').setAttribute("data-wizard-state","current");
    document.getElementById('wizard-3').setAttribute("data-wizard-state","pending");
    document.getElementById('wizard-2-content').setAttribute("data-wizard-state","current");
    document.getElementById("wizard-1-content").removeAttribute("data-wizard-state");
    document.getElementById("wizard-3-content").removeAttribute("data-wizard-state");
}

function openWizard3(){  
    document.getElementById('wizardP').setAttribute("data-wizard-state","last");
    document.getElementById('wizard-1').setAttribute("data-wizard-state","done");
    document.getElementById('wizard-2').setAttribute("data-wizard-state","done");
    document.getElementById('wizard-3').setAttribute("data-wizard-state","current");
    document.getElementById('wizard-3-content').setAttribute("data-wizard-state","current"); 
    document.getElementById("wizard-1-content").removeAttribute("data-wizard-state");
    document.getElementById("wizard-2-content").removeAttribute("data-wizard-state");   
}

class ComprasForm extends Component {


    /* Código Omar
    updateCliente = value => {
    const { onChange, setOptions } = this.props
    onChange({ target: { value: value.value, name: 'cliente' } })
    onChange({ target: { value: '', name: 'proyecto' } })
    setOptions('proyectos', value.proyectos)
}

updateProyecto = value => {
    const { onChange } = this.props
    onChange({ target: { value: value.value, name: 'proyecto' } })
}

updateEmpresa = value => {
    const { onChange, setOptions } = this.props
    onChange({ target: { value: value.value, name: 'empresa' } })
    onChange({ target: { value: '', name: 'cuenta' } })
    setOptions('cuentas', value.cuentas)
}

updateCuenta = value => {
    const { onChange } = this.props
    onChange({ target: { value: value.value, name: 'cuenta' } })
}


updateArea = value => {
    const { onChange, setOptions } = this.props
    onChange({target:{value: value.value, name:'area'}})
    onChange({target:{value: '', name:'subarea'}})
    setOptions('subareas',value.subareas)
}*/

    updateCliente = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'cliente' } })
        onChange({ target: { value: '', name: 'proyecto' } })
        const { options: { proyectos: proyectos } } = this.props

        const aux = proyectos.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('proyectos', element.proyectos)
            }
        })
    }
    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
    }

    updateEmpresa = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
        onChange({ target: { value: '', name: 'cuenta' } })

        const { options: { empresas: empresas } } = this.props

        const aux = empresas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('cuentas', element.cuentas)
            }
        })
    }
    updateCuenta = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'cuenta' } })
    }
    
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

    updateProveedor = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'proveedor' } })
        onChange({ target: { value: '', name: 'contrato' } })
        const { data: { proveedores: proveedores } } = this.props
        proveedores.find(function (element, index) {
            if (value.toString() === element.id.toString()) {
                setOptions('contratos', element.contratos)
            }
        })
    }

    updateContrato = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'contrato' } })
        
    }
    /*Código Omar
    updateSubarea = value => {
        const { onChange } = this.props
        onChange({target:{value: value.value, name:'subarea'}})
    }*/

    updateSubarea = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'subarea', value: value.toString() } })
    }

    handleChangeDate = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
    }

    updateFactura = e => {
        const { value, name } = e.target
        const { onChange, options } = this.props
        onChange({ target: { value: value, name: name } })
        let aux = ''
        options.tiposImpuestos.find(function (element, index) {
            if (element.text === 'IVA')
                aux = element.value
        });
        onChange({ target: { value: aux, name: 'tipoImpuesto' } })
    }

    updateTipoPago = e => {
        const { options, form, onChange } = this.props
        const { value } = e.target
        if (form.facturaObject) {
            options.tiposPagos.map((option) => {
                if (option.value.toString() === value.toString() && option.text.toString() === 'TOTAL')
                    onChange({ target: { value: form.facturaObject.total, name: 'total' } })
            })
        }
        onChange(e)
    }

    render() {
        const { title, options, form, onChange, setOptions, onChangeAdjunto, clearFiles, ...props } = this.props
        return (
            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps px-8 py-8 px-lg-15 py-lg-3"> 
                        <div id="wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" onClick = { () => { openWizard1() } }>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                <span>1.</span> Datos de la factura</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div> 
                        <div id="wizard-2" className="wizard-step" data-wizard-type="step" onClick = { () => { openWizard2() } }>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                <span>2.</span> Área y fecha</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div> 
                        <div id="wizard-3" className="wizard-step" data-wizard-type="step" onClick = { () => { openWizard3() } }>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                <span>3.</span> Pago</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>   
                    </div>
                </div>
                <div className="row justify-content-center py-10 px-8 py-lg-12 px-lg-10">
                    <div className="col-xl-12 col-xxl-7">                   
                        <Form 
                            {...props}
                            >
                            {/*<Subtitle className="text-center" color="gold">{title}</Subtitle>*/}
                            <div id="wizard-1-content" className="pb-3" data-wizard-type="step-content" data-wizard-state="current">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos de la factura</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <RadioGroup
                                            name='factura'
                                            onChange={this.updateFactura}
                                            options={
                                                [
                                                    {
                                                        label: 'Si',
                                                        value: 'Con factura'
                                                    },
                                                    {
                                                        label: 'No',
                                                        value: 'Sin factura'
                                                    }
                                                ]
                                            }
                                            placeholder={' Lleva factura '}
                                            value={form.factura}
                                        />
                                    </div> 
                                    {
                                        form.factura === 'Con factura' && title !== 'Editar compra' ?
                                            <div className="col-md-4">
                                                <FileInput
                                                    onChangeAdjunto={onChangeAdjunto}
                                                    placeholder={form['adjuntos']['factura']['placeholder']}
                                                    value={form['adjuntos']['factura']['value']}
                                                    name={'factura'} id={'factura'}
                                                    accept="text/xml, application/pdf"
                                                    files={form['adjuntos']['factura']['files']}
                                                    deleteAdjunto={clearFiles} multiple 
                                                />
                                                <span className="form-text text-muted">Por favor, adjunta el documento. </span>
                                            </div>
                                        : ''
                                    }
                                    {
                                        form.factura === 'Con factura' && title !== 'Editar compra' ?
                                            <div className="col-md-4">
                                                <Input 
                                                    placeholder="RFC" 
                                                    name="rfc" 
                                                    value={form.rfc} 
                                                    onChange={onChange} 
                                                    pattern={RFC}
                                                    iconclass={"far fa-file-alt"}
                                                    messageinc="Incorrecto. Ej. ABCD001122ABC"
                                                    maxLength="13"
                                                />
                                                <span className="form-text text-muted">Por favor, ingresa el RFC. </span>
                                            </div>
                                            : ''
                                    }
                                </div>
                                <div class="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <SelectSearch 
                                            options={options.proveedores} 
                                            placeholder="Selecciona el proveedor"
                                            name="proveedores" 
                                            value={form.proveedor} 
                                            onChange={this.updateProveedor} 
                                            iconclass={"far fa-user"}
                                        />
                                        <span className="form-text text-muted">Por favor, selecciona el proveedor</span>
                                    </div>
                                    <div className="col-md-4">
                                        <SelectSearch 
                                            options={options.proyectos} 
                                            placeholder="Selecciona el proyecto"
                                            name="proyecto" 
                                            value={form.proyecto} 
                                            onChange={this.updateProyecto}
                                            iconclass={"far fa-folder-open"} 
                                        />
                                        <span className="form-text text-muted">Por favor, selecciona el proyecto.</span>
                                    </div>
                                    <div className="col-md-4">
                                        {
                                            form.facturaObject ?
                                                <Input 
                                                    placeholder="Empresa" 
                                                    name="empresa" 
                                                    readOnly 
                                                    value={form.empresa} 
                                                    onChange={onChange} 
                                                    iconclass={"far fa-building"}
                                                />                                    
                                                :
                                                <SelectSearch 
                                                    options={options.empresas} 
                                                    placeholder="Selecciona la empresa"
                                                    name="empresas" 
                                                    value={form.empresa} 
                                                    onChange={this.updateEmpresa} 
                                                    iconclass={"far fa-building"}
                                                />
                                        }
                                        <span className="form-text text-muted">Por favor, selecciona la empresa.</span>
                                    </div>
                                </div>                                
                                <div className="form-group row form-group-marginless">
                                    {
                                        form.empresa ?                                            
                                            <div className="col-md-4">
                                                <div class="separator separator-dashed mt-1 mb-2"></div>
                                                <SelectSearch 
                                                    options={options.cuentas} 
                                                    placeholder="Selecciona la cuenta"
                                                    name="cuenta" 
                                                    value={form.cuenta} 
                                                    onChange={this.updateCuenta}
                                                    iconclass={"far fa-credit-card"} 
                                                />
                                                <span className="form-text text-muted">Por favor, selecciona la cuenta.</span>
                                            </div>
                                        : ''
                                    }
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick = { () => { openWizard2() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Selecciona el área y fecha</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <Calendar 
                                            onChangeCalendar={this.handleChangeDate}
                                            placeholder="Fecha" 
                                            name="fecha" 
                                            value={form.fecha}
                                        />
                                        <span className="form-text text-muted">Por favor, selecciona la fecha.</span>
                                    </div>
                                    <div className="col-md-4">
                                        <SelectSearch 
                                            options={options.areas} 
                                            placeholder="Selecciona el área"
                                            name="areas" 
                                            value={form.area} 
                                            onChange={this.updateArea}
                                            iconclass={"far fa-window-maximize"} 
                                        />
                                        <span className="form-text text-muted">Por favor, selecciona el área.</span>
                                    </div>
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
                                                <span className="form-text text-muted">Por favor, selecciona la sub-área.</span>
                                            </div>
                                        : ''
                                    }
                                </div>
                                <div class="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-12">
                                        <Input 
                                            as="textarea" 
                                            placeholder="Descripción" 
                                            rows="2" value={form.descripcion}
                                            name="descripcion" 
                                            onChange={onChange}
                                            iconclass={"far fa-file-alt"}
                                        />
                                        <span className="form-text text-muted">Por favor, ingresa la descripción.</span>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick = { () => { openWizard1() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick = { () => { openWizard3() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-3-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Selecciona el tipo de pago, impuesto y estatus</h5>
                                <div className="form-group row form-group-marginless">
                                    {
                                        options.tiposPagos.length > 0 ?
                                            <div className="col-md-4">
                                                <Select 
                                                    placeholder="Selecciona el tipo de pago" 
                                                    options={options.tiposPagos}
                                                    name="tipoPago" 
                                                    value={form.tipoPago} 
                                                    onChange={this.updateTipoPago} 
                                                    messageinc="Incorrecto. Selecciona el tipo de pago."
                                                    iconclass={"fas fa-coins"}
                                                    required
                                                />
                                                <span className="form-text text-muted">Por favor, selecciona el tipo de pago.</span>
                                            </div>
                                            : ''
                                    }
                                    <div className="col-md-4">
                                        <Select 
                                            placeholder="Selecciona el impuesto" 
                                            options={options.tiposImpuestos}
                                            name="tipoImpuesto" 
                                            value={form.tipoImpuesto} 
                                            onChange={onChange}
                                            messageinc="Incorrecto. Selecciona el impuesto."
                                            iconclass={"fas fa-file-invoice-dollar"}
                                            required
                                        />
                                        <span className="form-text text-muted">Por favor, selecciona el impuesto.</span>
                                    </div>
                                    <div className="col-md-4">
                                        <Select 
                                            placeholder="Selecciona el estatus de compra" 
                                            options={options.estatusCompras}
                                            name="estatusCompra" 
                                            value={form.estatusCompra} 
                                            onChange={onChange}
                                            messageinc="Incorrecto. Selecciona el estatus de compra."
                                            required
                                            iconclass={"flaticon2-time"}
                                        />
                                        <span className="form-text text-muted">Por favor, selecciona el estatus de compra.</span>
                                    </div>
                                </div>
                                <div class="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <InputMoney 
                                            thousandSeparator={true} 
                                            placeholder="Monto" 
                                            value={form.total} 
                                            name="total" 
                                            onChange={onChange}
                                            iconclass={"fas fa-money-check-alt"}

                                        />
                                        <span className="form-text text-muted">Por favor, ingresa el monto.</span>
                                    </div>
                                    <div className="col-md-4">
                                        <InputMoney 
                                            thousandSeparator={true} 
                                            placeholder="Comisión" 
                                            value={form.comision} 
                                            name="comision" 
                                            onChange={onChange} 
                                            iconclass={"fas fa-money-bill-alt"} 
                                        />
                                        <span className="form-text text-muted">Por favor, ingresa la comisión.</span>
                                    </div>
                                    <div className="col-md-4">
                                        <SelectSearch 
                                            options={options.contratos} 
                                            placeholder="Selecciona el contrato"
                                            name="contrato" 
                                            value={form.contrato} 
                                            onChange={this.updateContrato} 
                                            iconclass={"fas fa-file-signature"}
                                        />
                                        <span className="form-text text-muted">Por favor, selecciona el contrato.</span>
                                    </div>
                                </div>
                                <div class="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">                                
                                    <div className="col-md-6">
                                        <FileInput
                                            onChangeAdjunto={onChangeAdjunto}
                                            placeholder={form['adjuntos']['presupuesto']['placeholder']}
                                            value={form['adjuntos']['presupuesto']['value']}
                                            name={'presupuesto'} id={'presupuesto'}
                                            accept="text/xml, application/pdf"
                                            files={form['adjuntos']['presupuesto']['files']}
                                            deleteAdjunto={clearFiles} 
                                        />
                                        <span className="form-text text-muted">Por favor, adjunta el documento.</span>
                                    </div>
                                    <div className="col-md-6">
                                        <FileInput
                                            onChangeAdjunto={onChangeAdjunto}
                                            placeholder={form['adjuntos']['pago']['placeholder']}
                                            value={form['adjuntos']['pago']['value']}
                                            name={'pago'} id={'pago'}
                                            accept="text/xml, application/pdf"
                                            files={form['adjuntos']['pago']['files']}
                                            deleteAdjunto={clearFiles} 
                                        />
                                        <span className="form-text text-muted">Por favor, adjunta el documento.</span>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase"  onClick = { () => { openWizard2() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" type="submit" data-wizard-type="action-submit" text="Enviar" />
                                    </div>
                                </div>                                    
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default ComprasForm