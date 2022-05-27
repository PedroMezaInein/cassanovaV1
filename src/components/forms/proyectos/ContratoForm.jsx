import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import {  Button, InputGray, SelectSearchGray,InputMoneyGray,InputNumberGray } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
class ContratoForm extends Component {
    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }
    updateCliente = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'cliente' } })
    }
    updateTipoContrato = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'tipoContrato' } })
    }
    updateProveedor = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proveedor' } })
    }
    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
    }

    updateprediseño = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'prediseño' } })
    }

    render() {
        const { title, options, form, onChange, tipo, onSubmit, formeditado, clearFiles, onChangeAdjunto,handleChange,onChangeRange, ...props } = this.props
        return (
            <Form id="form-contrato"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-contrato')
                    }
                }
                {...props}>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-3">
                    {
                            tipo === 'Cliente' ?
                                <SelectSearchGray options = { options.tiposContratosC }  placeholder="SELECCIONA EL TIPO DE CONTRATO" value = { form.tipoContrato } 
                                    onChange = { (value) => { this.updateTipoContrato(value, 'tipoContrato') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                    withicon = { 1 } iconclass={"fas fa-pen-fancy"} messageinc = "Incorrecto. Selecciona el tipo de contrato" 
                                    formeditado = { formeditado }/>                                  
                                :
                                <SelectSearchGray options = { options.tiposContratosP }  placeholder="SELECCIONA EL TIPO DE CONTRATO" value = { form.tipoContrato } 
                                onChange = { (value) => { this.updateTipoContrato(value, 'tipoContrato') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                withicon = { 1 } iconclass={"fas fa-pen-fancy"} messageinc = "Incorrecto. Selecciona el tipo de contrato" 
                                formeditado = { formeditado }/>    
                        }
                          
                    </div>                    
                    <div className="col-md-3">
                        <SelectSearchGray options = { options.proyectos }  placeholder="SELECCIONA EL PROYECTO" value = { form.proyecto } 
                            onChange = { (value) => { this.updateProyecto(value, 'proyecto') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                            withicon = { 1 } iconclass={"fas fa-pen-fancy"} messageinc = "Incorrecto. Selecciona el proyecto" name="proyecto"
                            formeditado = { formeditado }/>  
                    </div>
                    <div className="col-md-3">
                        {
                            tipo === 'Cliente' ?
                                <SelectSearchGray options = { options.clientes }  placeholder="SELECCIONA EL CLIENTE" value = { form.proyecto } 
                                    onChange = { (value) => { this.updateCliente(value, 'cliente') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                    withicon = { 1 }  iconclass={"far fa-user"} messageinc = "Incorrecto. Selecciona el cliente" name="cliente"
                                    formeditado = { formeditado }/>                                  
                                :
                                <SelectSearchGray options = { options.proveedores }  placeholder="SELECCIONA EL PROVEEDOR" value = { form.proveedor } 
                                    onChange = { (value) => { this.updateProveedor(value, 'proveedor') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                    withicon = { 1 }  iconclass={"far fa-user"} messageinc = "Incorrecto. Selecciona el proveedor" name="cliente"
                                    formeditado = { formeditado }/>    
                        }
                    </div>
                    <div className="col-md-3">
                        <SelectSearchGray options = { options.empresas }  placeholder="SELECCIONA LA EMPRESA" value = { form.empresa } 
                            onChange = { (value) => { this.updateEmpresa(value, 'empresa') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                            withicon = { 1 } iconclass={"far fa-building"} messageinc = "Incorrecto. Selecciona la empresa" name="empresa"
                            formeditado = { formeditado }/>    
                    </div>
                    <div className="col-md-3">
                        <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } withformgroup = { 0 } 
                            requirevalidation = { 1 } formeditado = { formeditado } thousandseparator = { true } prefix = '$' 
                            name = "monto" value = { form.monto } onChange = { onChange } placeholder = "MONTO" 
                            iconclass = 'fas fa-money-check-alt' messageinc = "Incorrecto. ingresa el monto " />
                        {/* <InputMoney
                            requirevalidation={1}
                            formeditado={formeditado}
                            thousandseparator={true}
                            prefix={'$'}
                            name="monto"
                            value={form.monto}
                            onChange={onChange}
                            placeholder="MONTO CON IVA"
                            iconclass={"fas fa-money-bill-wave-alt"}
                        /> */}
                    </div>
                    <div className="col-md-3">
                        <SelectSearchGray options = { options.prediseño }  placeholder="SELECCIONA EL PRESUPUESTO DE DISEÑO" value = { form.prediseño } 
                            onChange = { (value) => { this.updateprediseño(value, 'prediseño') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                            withicon = { 1 } iconclass={"far fa-building"} messageinc = "Incorrecto. Selecciona el presupuesto de diseño" name="prediseño"
                            formeditado = { formeditado }/>                          
                    </div>
                    <div className="col-md-3">
                        <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                            name='semanas' iconclass="flaticon2-website" placeholder='SEMANAS'onChange={onChange} 
                            value={form.semanas} messageinc="Ingresa las semanas del contrato." />  
                    </div>
                    <div className="col-md-3">
                         <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} 
                            formeditado = { formeditado } placeholder = "anexo en numero"
                            value = { form.anexo } name = "anexo" onChange = { onChange } iconclass = "fas fa-folder-open"
                            messageinc = "Ingresa el anexo en numero."
                        />
                    </div>
                </div>  
                {/* <div className="separator separator-dashed mt-1 mb-2"></div> */}
                
                <div className="form-group row form-group-marginless d-flex justify-content-center">
                    {/* <div className="col text-center">
                        <label className="col-form-label my-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br/>
                        <RangeCalendar
                            onChange={onChangeRange}
                            start={form.fechaInicio}
                            end={form.fechaFin}
                        />
                    </div> */}
                    {/* {
                        title === 'Editar contrato de Cliente' || title === 'Editar contrato de Proveedor'
                            ? ''
                            :
                            <div className="col text-center">
                                <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.adjunto.placeholder}</label>
                                <ItemSlider
                                    items={form.adjuntos.adjunto.files}
                                    item='adjunto'
                                    handleChange={handleChange}
                                    multiple={true}
                                />
                            </div>
                    } */}
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' className="btn btn-primary mr-2"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-contrato')
                                    }
                                }
                                text="ENVIAR" />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default ContratoForm