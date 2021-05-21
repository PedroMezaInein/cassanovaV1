import React, { Component } from 'react'
import Form from 'react-bootstrap/Form' 
import { Button, RangeCalendar, OptionsCheckbox, TagSelectSearch} from '../../form-components' 
import { validateAlert } from '../../../functions/alert'
import $ from "jquery";
class ContabilidadForm extends Component {

    // handleChangeDateInicio = date => {
    //     const { onChange } = this.props
    //     onChange({ target: { value: date, name: 'fechaInicio' } })
    // }
    // handleChangeDateFin = date => {
    //     const { onChange } = this.props
    //     onChange({ target: { value: date, name: 'fechaFin' } })
    // }

    handleChangeCheckbox = (e, aux) => {
        const { checked, name } = e.target
        const { form, onChange } = this.props
        let optionesChecked = form[aux]
        optionesChecked.find(function (element, index) {
            if (element.id.toString() === name.toString()) {
                element.checked = checked
            }
            return false
        })
        onChange({ target: { value: optionesChecked, name: aux } })
    }

    nuevoUpdateEmpresa = seleccionados =>{
        const { form,updateEmpresa, onChangeEmpresa } = this.props
        seleccionados = seleccionados?seleccionados:[];
        if(seleccionados.length>form.empresas.length){
            let diferencia = $(seleccionados).not(form.empresas).get();
            let val_diferencia = diferencia[0].value
            onChangeEmpresa(val_diferencia)
        }
        else {
            let diferencia = $(form.empresas).not(seleccionados).get(); 
            diferencia.forEach(borrar=>{
                updateEmpresa(borrar,"empresas")
            })
        }
    }
    transformarOptions = options => {
        options = options?options:[]
        options.map((value)=>{
            value.label = value.text 
            return ''
        } );
    
        return options
    }
    render() {
        const { form, onChange, options, onChangeEmpresa, updateEmpresa, formeditado, onSubmit, onChangeRange, ...props } = this.props
        return (
            <Form id="form-contabilidad"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-contabilidad')
                    }
                }
                {...props}
            >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12 d-flex justify-content-center mb-2">
                        <div className="col-md-6">
                            <TagSelectSearch
                                requirevalidation={1}
                                placeholder="SELECCIONA LA(S) EMPRESA(S)"
                                options={this.transformarOptions(options.empresas)}
                                defaultvalue={this.transformarOptions(form.empresas)}
                                // onChange={onChangeEmpresa}
                                onChange={this.nuevoUpdateEmpresa}
                                iconclass={"far fa-building"}
                                messageinc="Incorrecto. Selecciona la(s) empresa(s)."
                            />
                        </div>
                    </div>
                    <div className="col-md-12 text-center">
                    <label className="col-form-label my-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br/>
                        <RangeCalendar
                            onChange={onChangeRange}
                            start={form.fechaInicio}
                            end={form.fechaFin}
                        />
                    </div>
                </div>
                <div className="form-group row form-group-marginless d-flex justify-content-center">
                    
                    {/* <div className="col-md-4">
                        <Calendar
                            onChangeCalendar={this.handleChangeDateInicio}
                            placeholder="FECHA DE INICIO"
                            name="fechaInicio"
                            value={form.fechaInicio}
                            selectsStart
                            startDate={form.fechaInicio}
                            endDate={form.fechaFin}
                            iconclass={"far fa-calendar-alt"}
                        />
                    </div>
                    <div className="col-md-4">
                        <Calendar
                            onChangeCalendar={this.handleChangeDateFin}
                            placeholder="FECHA FINAL"
                            name="fechaFin"
                            value={form.fechaFin}
                            selectsEnd
                            startDate={form.fechaInicio}
                            endDate={form.fechaFin}
                            minDate={form.fechaInicio}
                            iconclass={"far fa-calendar-alt"}
                        />
                    </div> */}
                </div>
                
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless pt-3">
                    <div className="col-md-4  d-flex justify-content-around align-items-top">
                        <OptionsCheckbox
                            placeholder="SELECCIONA LOS MODULOS A IMPORTAR"
                            options={form.modulos}
                            name="modulos"
                            value={form.modulos}
                            onChange={(e) => { this.handleChangeCheckbox(e, 'modulos') }}
                            customcolor="primary"
                        />
                    </div>
                    <div className="col-md-4  d-flex justify-content-around align-items-top">
                        <OptionsCheckbox
                            placeholder="SELECCIONA LOS ARCHIVOS A INCLUIR"
                            options={form.archivos}
                            name="archivos"
                            value={form.archivos}
                            onChange={(e) => { this.handleChangeCheckbox(e, 'archivos') }}
                            customcolor="primary" 
                        />
                    </div>
                    <div className="col-md-4  d-flex justify-content-around align-items-top">
                        <OptionsCheckbox
                            placeholder="¿LLEVA FACTURA?"
                            options={form.facturas}
                            name="facturas"
                            value={form.facturas}
                            onChange={(e) => { this.handleChangeCheckbox(e, 'facturas') }}
                            customcolor="primary" 
                        />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' text='DESCARGAR' type='submit' className="btn btn-primary mr-2" />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default ContabilidadForm