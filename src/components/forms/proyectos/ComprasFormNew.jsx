import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { DATE, RFC } from '../../../constants'
import { printResponseErrorAlert, errorAlert, waitAlert, validateAlert } from '../../../functions/alert'
import { apiOptions, catchErrors, apiPutForm } from '../../../functions/api'
import { setOptions, setSelectOptions } from '../../../functions/setters'
import {openWizard1, openWizard2, openWizard3 } from '../../../functions/wizard'
import { CalendarDay, RadioGroup, InputGray, FileInput, SelectSearchGray, InputMoneyGray, Button, SelectSearchGrayTrue } from '../../form-components'
import j2xParser from 'fast-xml-parser'
import Swal from 'sweetalert2'

class ComprasFormNew extends Component {

    state = {
        form: {
            proveedor: '',
            proyecto: '',
            empresa: '',
            area: '',
            subarea: '',
            descripcion: '',
            cuenta: '',
            rfc: '',
            contrato: '',
            total: 0,
            comision: 0,
            factura: 'Sin factura',
            fecha: new Date(),
            adjuntos: {
                xml: {
                    files: [], value: ''
                },
                pdf: {
                    files: [], value: ''
                },
                pago: {
                    files: [], value: ''
                },
                presupuesto: {
                    files: [], value: ''
                }
            },
        },
        options: {
            empresas: [], proveedores: [], areas: [], subareas: [], proyectos: [], tiposPagos: [], tiposImpuestos: [], estatusCompras: [], 
            estatusFacturas: [], formasPago: [], metodosPago: [], cuentas: [], contratos: []
        },
        data: { proveedores: [], empresas: [] },
        formeditado: 0
    }

    componentDidMount = () => {
        const { type, at } = this.props
        this.setState({
            ...this.state,
            formeditado: type === 'add' ? 0 : 1
        })
        this.getOptions()
    }

    updateSelect = (value, name) => {
        const { form, options, data } = this.state
        form[name] = value
        let item = null
        switch(name){
            case 'area':
                item = options.areas.find((elemento) => {
                    return elemento.value === value
                })
                if(item){
                    form.subarea = ''
                    options.subareas = setOptions(item.subareas, 'nombre', 'id')
                }
            break;
            case 'empresa':
                item = options.empresas.find((elemento) => {
                    return elemento.value === value
                })
                if(item){
                    form.cuenta = ''
                    options.cuentas = setOptions(item.cuentas, 'nombre', 'id')
                }
            break;
            case 'proveedor':
                item = data.proveedores.find((elemento) => {
                    return elemento.id.toString() === value
                })
                if(item){
                    form.contrato = ''
                    options.contratos = setOptions(item.contratos, 'nombre', 'id')
                }
            break;
            default: break;
        }
        this.setState({ ...this.state, form, options })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form, options } = this.state
        form[name] = value
        let item = null
        switch(name){
            case 'factura':
                if(value === 'Con factura'){
                    item = options.tiposImpuestos.find((elemento) => {
                        return elemento.name === 'IVA'
                    })
                    if(item){
                        form.tipoImpuesto = item.value.toString()
                    }
                }
            break;
            default: break;
        }
        this.setState({
            ...this.state,
            form
        })
    }

    onChangeAdjunto = e => {
        const { name, value, files } = e.target
        const { form } = this.state
        form.adjuntos[name].value = value
        form.adjuntos[name].files = []
        files.forEach((file, index) => {
            form.adjuntos[name].files.push({
                name: file.name,
                file: file,
                url: URL.createObjectURL(file),
                key: index
            })
        })
        this.setState({ ...this.state, form })
    }

    onChangeFactura = (e) => {
        waitAlert()
        const { files, name } = e.target
        const { form, options, data } = this.state
        const { dato } = this.props
        let empresa = null
        let proveedor = null
        form.adjuntos[name].files = []
        form.facturaObject = {}
        form.facturaItem = ''
        files.forEach((file, index) => {
            form.adjuntos[name].files.push({
                name: file.name,
                file: file,
                url: URL.createObjectURL(file),
                key: index
            })
        })
        const reader = new FileReader()
        reader.onload = async (event) => { 
            const text = (event.target.result)
            let jsonObj = j2xParser.parse(text, {
                ignoreAttributes: false,
                attributeNamePrefix: ''
            })
            if(jsonObj['cfdi:Comprobante']){
                jsonObj = jsonObj['cfdi:Comprobante']
                const keys = Object.keys(jsonObj)
                let obj = { }
                let errores = []
                if( keys.includes('cfdi:Receptor') ){
                    obj.rfc_receptor = jsonObj['cfdi:Receptor']['Rfc']
                    obj.nombre_receptor = jsonObj['cfdi:Receptor']['Nombre']
                    obj.uso_cfdi = jsonObj['cfdi:Receptor']['UsoCFDI']
                }else{ errores.push( 'El XML no tiene el receptor' ) }
                if( keys.includes('cfdi:Emisor') ){
                    obj.rfc_emisor = jsonObj['cfdi:Emisor']['Rfc']
                    obj.nombre_emisor = jsonObj['cfdi:Emisor']['Nombre']
                    obj.regimen_fiscal = jsonObj['cfdi:Emisor']['RegimenFiscal']
                    form.rfc = obj.rfc_emisor
                }else{ errores.push( 'El XML no tiene el emisor' ) }
                obj.lugar_expedicion = jsonObj['LugarExpedicion']
                obj.fecha = jsonObj['Fecha'] ? new Date(jsonObj['Fecha']) : null
                obj.metodo_pago = jsonObj['MetodoPago']
                obj.tipo_de_comprobante = jsonObj['TipoDeComprobante']
                obj.total = jsonObj['Total']
                obj.subtotal = jsonObj['SubTotal']
                obj.tipo_cambio = jsonObj['TipoCambio']
                obj.moneda = jsonObj['Moneda']
                if( keys.includes('cfdi:Complemento') ){
                    if(jsonObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']){
                        obj.numero_certificado = jsonObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']['UUID']
                    }else{ errores.push( 'El XML no tiene el UUID' ) }
                }else{ errores.push( 'El XML no tiene el UUID' ) }
                obj.descripcion = ''
                if( keys.includes('cfdi:Conceptos') ){
                    if( jsonObj['cfdi:Conceptos']['cfdi:Concepto'] ){
                        if(Array.isArray(jsonObj['cfdi:Conceptos']['cfdi:Concepto'])){
                            jsonObj['cfdi:Conceptos']['cfdi:Concepto'].forEach((element, index) => {
                                if(index){
                                    obj.descripcion += ' - '
                                }
                                obj.descripcion += element['Descripcion']
                            })
                        }else{
                            obj.descripcion += jsonObj['cfdi:Conceptos']['cfdi:Concepto']['Descripcion']
                        }
                    }
                }
                obj.folio = jsonObj['Folio']
                obj.serie = jsonObj['Serie']
                if(keys.includes('cfdi:CfdiRelacionados')){
                    if(Array.isArray(jsonObj['cfdi:CfdiRelacionados'])){
                        obj.tipo_relacion = jsonObj['cfdi:CfdiRelacionados'][0]['TipoRelacion']   
                    }
                }
                if(keys.includes('cfdi:CfdiRelacionado')){
                    if(Array.isArray(jsonObj['cfdi:CfdiRelacionado'])){
                        obj.uuid_relacionado = jsonObj['cfdi:CfdiRelacionado'][0]['UUID']   
                    }
                }
                if(dato){
                    if(dato.empresa){
                        if(dato.empresa.rfc !== obj.rfc_receptor){
                            errores.push( 'El RFC empresa y el RFC receptor no coincide' )
                        }
                    }
                }
                empresa = data.empresas.find((element) => {
                    return element.rfc === obj.rfc_receptor
                })
                proveedor = data.proveedores.find((element) => {
                    return element.rfc === obj.rfc_emisor
                })
                if(!empresa){
                    errores.push( 'No existe una empresa con ese RFC' )
                }else{
                    form.empresa = empresa.id.toString()
                    form.cuenta = ''
                    options.cuentas = setOptions(empresa.cuentas, 'nombre', 'id')
                }
                if(!proveedor){
                    errores.push( 'No existe el proveedor, genéralo desde el apartado de Leads/Proveedores' )
                }else{
                    form.proveedor = proveedor.id.toString()
                    form.contrato = ''
                    options.contratos = setOptions(proveedor.contratos, 'nombre', 'id')
                    console.log(options.contratos, 'CONTRATOS')
                }
                if(errores.length){
                    let textError = ''    
                    errores.forEach((mistake, index) => {
                        if(index){
                            textError += '\\n'
                        }
                        textError += mistake
                    })
                    form.adjuntos[name].files = []
                    form.facturaObject = {}
                    form.facturaItem = ''
                    form.adjuntos[name].value = ''
                    this.setState({ ...this.state, form })
                    setTimeout(function(){ 
                        errorAlert(textError)
                    }, 100);
                }else{
                    form.facturaObject = obj
                    Swal.close()
                    this.setState({ ...this.state, form, options })
                    this.checkFactura(obj)
                }
            }else{ 
                form.facturaObject = {}
                form.facturaItem = ''
                form.adjuntos.xml.files = []
                form.adjuntos.xml.value = ''
                this.setState({ ...this.state, form })
                errorAlert(`La factura no tiene el formato correcto`) 
            }
        };
        reader.readAsText(files[0])
    }
    
    clearFiles = (name, key) => {
        const { form } = this.state
        if(name === 'xml'){
            form.facturaObject = {}
            form.factura = ''
        }
        form.adjuntos[name].files.splice(key, 1)
        if(form.adjuntos[name].files.length === 0){
            form.adjuntos[name].value = ''
        }
        this.setState({ ...this.state, form })
    }

    getOptions = async() => {
        const { at } = this.props
        apiOptions(`v2/proyectos/compras`, at).then(
            (response) => {
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras, proyectos, proveedores, formasPago, 
                    metodosPago, estatusFacturas } = response.data
                const { options, data } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                options.proveedores = setOptions(proveedores, 'razon_social', 'id')
                options.areas = setOptions(areas, 'nombre', 'id')
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                options.tiposPagos = setOptions(tiposPagos, 'tipo', 'id')
                options.tiposImpuestos = setOptions(tiposImpuestos, 'tipo', 'id')
                options.estatusCompras = setOptions(estatusCompras, 'estatus', 'id')
                options.estatusFacturas = setOptions(estatusFacturas, 'estatus', 'id')
                options.formasPago = setOptions(formasPago, 'nombre', 'id')
                options.metodosPago = setOptions(metodosPago, 'nombre', 'id')
                data.proveedores = proveedores
                data.empresas = empresas
                this.setState({ ...this.state, options, data })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch( (error) => { catchErrors(error) })
    }

    checkFactura = async(obj) => {
        const { at } = this.props
        apiPutForm(`v2/administracion/facturas/check?tipo_factura=compras`, obj, at).then(
            (response) => {
                const { factura } = response.data
                const { form } = this.state
                form.facturaItem = factura
                this.setState({ ...this.state, form })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch(( error ) => { catchErrors(error) })
    }

    isActiveFactura = () => {
        const { form } = this.state
        const { type } = this.props
        if(type !== 'edit'){
            if(form.factura === 'Con factura'){
                return true
            }
        }
        return false
    }

    onSubmit = () => {
        console.log(`THIS ON SUBMIT`)
    }
    
    render() {
        const { formeditado, form, options } = this.state
        const { type } = this.props
        return(
            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps"> 
                        <div id="wizard-1" className="wizard-step pt-0" data-wizard-state="current" data-wizard-type="step" 
                            onClick = { openWizard1 } >
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                <span>1.</span> Datos de la factura</h3>
                                <div className="wizard-bar" />
                            </div>
                        </div> 
                        <div id="wizard-2" className="wizard-step pt-0" data-wizard-type="step" onClick = { openWizard2 }>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                <span>2.</span> Área y fecha</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div> 
                        <div id="wizard-3" className="wizard-step pt-0" data-wizard-type="step" onClick = { openWizard3 }>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                <span>3.</span> Pago</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>   
                    </div>
                </div>
                <Form>
                    <div id="wizard-1-content" className="pb-3 px-2" data-wizard-type="step-content" data-wizard-state="current">
                        <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos de la factura</h5>
                        <div className="form-group form-group-marginless row mx-0">
                            <div className = 'col-md-2'>
                                <RadioGroup name='factura' onChange = { this.onChange } placeholder = '¿Lleva factura?' value = { form.factura }
                                    options = { [ { label: 'Si', value: 'Con factura' }, { label: 'No', value: 'Sin factura' } ] } />    
                            </div>
                            {
                                this.isActiveFactura() ?
                                    <div className="col-md-10">
                                        <div className="row mx-0">
                                            <div className="col-md-4 ">
                                                <label className="col-form-label font-weight-bold text-dark-60">XML DE LA FACTURA</label>
                                                <br />
                                                <FileInput onChangeAdjunto = { this.onChangeFactura } placeholder = 'Factura XML' 
                                                    value = { form.adjuntos.xml.value } name = 'xml' id = 'xml' accept = 'text/xml' 
                                                    files = { form.adjuntos.xml.files } deleteAdjunto = { this.clearFiles }
                                                    messageinc = 'Agrega el XML de la factura' iconclass = 'las la-file-alt icon-xl' 
                                                    classinput = 'file-input' classbtn='btn btn-sm btn-light font-weight-bolder mb-0' 
                                                    requirevalidation = { 0 } formeditado = { 0 } />
                                            </div>
                                            <div className="col-md-4 ">
                                                <label className="col-form-label font-weight-bold text-dark-60">PDF DE LA FACTURA</label>
                                                <br />
                                                <FileInput requirevalidation = { 0 } formeditado = { 0 } onChangeAdjunto = { this.onChangeAdjunto }
                                                    placeholder = 'Factura PDF' value = { form.adjuntos.pdf.value } name = 'pdf' id = 'pdf' 
                                                    classinput = 'file-input' accept = 'application/pdf' files = { form.adjuntos.pdf.files } 
                                                    iconclass = 'las la-file-pdf icon-xl' classbtn = 'btn btn-sm btn-light font-weight-bolder mb-0'
                                                    deleteAdjunto = { this.clearFiles } />
                                            </div>
                                            <div className="col-md-4">
                                                <InputGray requirevalidation = { 0 } formeditado = { formeditado } placeholder = "RFC" 
                                                    name = "rfc"  value = { form.rfc } onChange = { this.onChange }  iconclass = "far fa-file-alt"
                                                    patterns = { RFC } messageinc = "Incorrecto. Ej. ABCD001122ABC" maxLength = "13"
                                                    withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } disabled/>
                                            </div>
                                        </div>
                                    </div>
                                : <></>
                            }
                            <div className="col-md-12">
                                <div className="separator separator-dashed mt-1 mb-2" />
                            </div>
                            <div className="col-md-4">
                                <SelectSearchGray options = { options.proveedores } placeholder = 'Selecciona el proveedor' value = { form.proveedor } 
                                    onChange = { (value) => { this.updateSelect(value, 'proveedor') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                    withicon = { 1 } iconclass = "far fa-user" messageinc = "Incorrecto. Selecciona el proveedor" formeditado = { formeditado }/>
                            </div>
                            <div className="col-md-4">
                                <SelectSearchGray options = { options.proyectos } placeholder = 'Selecciona el proyecto' value = { form.proyecto } 
                                    onChange = { (value) => { this.updateSelect(value, 'proyecto') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                    withicon = { 1 } iconclass = "far fa-folder-open" messageinc = "Incorrecto. Selecciona el proyecto" 
                                    formeditado = { formeditado }/>
                            </div>
                            <div className="col-md-4">
                                <SelectSearchGray options = { options.empresas } placeholder = 'Selecciona la empresa' value = { form.empresa } 
                                    onChange = { (value) => { this.updateSelect(value, 'empresa') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                    withicon = { 1 } iconclass = "far fa-building" messageinc = "Incorrecto. Selecciona la empresa" 
                                    formeditado = { formeditado }/>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between border-top mt-3 pt-3">
                            <div className="mr-2"></div>
                            <div>
                                <button type="button" className="btn btn-primary font-weight-bold text-uppercase" 
                                    onClick = { openWizard2 } data-wizard-type="action-next">
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">
                        <h5 className="mb-4 font-weight-bold text-dark">Selecciona el área y fecha</h5>
                        <div className="form-group form-group-marginless row mx-0">
                            <div className = 'col-md-4 text-center'>
                                <label className="col-form-label font-weight-bold text-dark-60">Fecha de la compra</label>
                                <br />
                                <CalendarDay date = { form.fecha } onChange = { this.onChange } name = 'fecha' requirevalidation = { 1 } />
                            </div>
                            <div className="col-md-8">
                                <div className="row mx-0">
                                    <div className="col md-6">
                                        <SelectSearchGray options = { options.areas } placeholder = 'Selecciona el área' value = { form.area } 
                                            onChange = { (value) => { this.updateSelect(value, 'area') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                            withicon = { 1 } iconclass = "far fa-window-maximize" messageinc = "Incorrecto. Selecciona el área" 
                                            formeditado = { formeditado } requirevalidation = { 1 }/>
                                    </div>
                                    <div className="col md-6">
                                        <SelectSearchGray options = { options.subareas } placeholder = 'Selecciona subarea' value = { form.subarea } 
                                            onChange = { (value) => { this.updateSelect(value, 'subarea') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                            withicon = { 1 } iconclass = "far fa-window-restore" messageinc = "Incorrecto. Selecciona el subárea" 
                                            formeditado = { formeditado } requirevalidation = { 1 }/>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="separator separator-dashed mt-1 mb-2" />
                                    </div>
                                    <div className="col-md-12">
                                        <InputGray requirevalidation = { 0 } formeditado = { formeditado } as = "textarea" placeholder = "DESCRIPCIÓN" 
                                            rows = "3" value = { form.descripcion } name = "descripcion" onChange = { this.onChange } 
                                            customclass = "px-2 text-justify" messageinc="Incorrecto. Ingresa una descripción." 
                                            withtaglabel = { 1 } withtextlabel = { 1 }/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between border-top mt-3 pt-3">
                            <div className="mr-2">
                                <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick = { openWizard1 } 
                                    data-wizard-type="action-prev">
                                    Anterior
                                </button>
                            </div>
                            <div>
                                <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick = { openWizard3 } 
                                    data-wizard-type="action-next">
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="wizard-3-content" className="pb-3" data-wizard-type="step-content">
                        <h5 className="mb-4 font-weight-bold text-dark">Selecciona el tipo de pago, impuesto y estatus</h5>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-4">
                                <SelectSearchGray options = { options.cuentas } placeholder = 'Selecciona la cuenta' value = { form.cuenta } 
                                    onChange = { (value) => { this.updateSelect(value, 'cuenta') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                    withicon = { 1 } iconclass = "far fa-credit-card" messageinc = "Incorrecto. Selecciona la cuenta" 
                                    formeditado = { formeditado } requirevalidation = { 1 }/>
                            </div>
                            <div className="col-md-4">
                                <SelectSearchGray options = { options.tiposImpuestos } placeholder = 'Selecciona el tipo de impuesto' 
                                    value = { form.tipoImpuesto } onChange = { (value) => { this.updateSelect(value, 'tipoImpuesto') } } 
                                    withtaglabel = { 1 } withtextlabel = { 1 } withicon = { 1 } iconclass = "fas fa-file-invoice-dollar" 
                                    messageinc = "Incorrecto. Selecciona el tipo de impuesto"  formeditado = { formeditado } 
                                    requirevalidation = { 1 }/>
                            </div>
                            <div className="col-md-4">
                                <SelectSearchGray options = { options.estatusCompras } placeholder = 'Selecciona el estatus de la compra' 
                                    value = { form.estatusCompra } onChange = { (value) => { this.updateSelect(value, 'estatusCompra') } } 
                                    withtaglabel = { 1 } withtextlabel = { 1 } withicon = { 1 } iconclass = "flaticon2-time" 
                                    messageinc = "Incorrecto. Selecciona el estatus de la compra"  formeditado = { formeditado } 
                                    requirevalidation = { 1 }/>
                            </div>
                            <div className="col-md-12">
                                <div className="separator separator-dashed mt-1 mb-2" />
                            </div>
                            <div className="col-md-3">
                                <SelectSearchGray options = { options.tiposPagos } placeholder = 'Selecciona el tipo de pago' 
                                    value = { form.tipoPago } onChange = { (value) => { this.updateSelect(value, 'tipoPago') } } 
                                    withtaglabel = { 1 } withtextlabel = { 1 } withicon = { 1 } iconclass = "fas fa-coins" 
                                    messageinc = "Incorrecto. Selecciona el tipo de pago"  formeditado = { formeditado } 
                                    requirevalidation = { 1 }/>
                            </div>
                            <div className="col-md-3">
                                <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } withformgroup = { 0 } 
                                    requirevalidation = { 1 } formeditado = { formeditado } thousandseparator = { true } prefix = '$' 
                                    name = "total" value = { form.total } onChange = { this.onChange } placeholder = "MONTO" 
                                    iconclass = 'fas fa-money-check-alt' messageinc = "Incorrecto. ingresa el monto de la compra" />
                            </div>
                            <div className="col-md-3">
                                <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } withformgroup = { 0 } 
                                    requirevalidation = { 0 } formeditado = { formeditado } thousandseparator = { true } prefix = '$' 
                                    name = "comision" value = { form.comision } onChange = { this.onChange } placeholder = "COMISIÓN" 
                                    iconclass = 'fas fa-money-check-alt' />
                            </div>
                            <div className="col-md-3">
                                <SelectSearchGrayTrue options = { options.contratos } placeholder = 'Selecciona el contrato' 
                                    value = { form.contrato } onChange = { (value) => { this.updateSelect(value, 'contrato') } } 
                                    withtaglabel = { 1 } withtextlabel = { 1 } withicon = { 1 } iconclass = "fas fa-file-signature" 
                                    formeditado = { formeditado } requirevalidation = { 0 }/>
                            </div>
                            {
                                this.isActiveFactura() ?
                                    <div className="col-md-12">
                                        <div className="row mx-0">
                                            <div className="col-md-12">
                                                <div className="separator separator-dashed mt-1 mb-2" />
                                            </div>
                                            <div className="col-md-6 text-center">
                                                <label className="col-form-label font-weight-bold text-dark-60">PAGOS</label>
                                                <br />
                                                <FileInput requirevalidation = { 0 } formeditado = { formeditado } onChangeAdjunto = { this.onChangeAdjunto }
                                                    placeholder = 'Pagos' value = { form.adjuntos.pago.value } name = 'pago' id = 'pago'
                                                    files = { form.adjuntos.pago.files } deleteAdjunto = { this.clearFiles } multiple
                                                    classinput = 'file-input' accept = '*/*' iconclass = 'las la-file-pdf icon-xl' 
                                                    classbtn = 'btn btn-sm btn-light font-weight-bolder mb-0' />
                                            </div>
                                            <div className="col-md-6 text-center">
                                                <label className="col-form-label font-weight-bold text-dark-60">PRESUPUESTOS</label>
                                                <br />
                                                <FileInput requirevalidation = { 0 } formeditado = { formeditado } onChangeAdjunto = { this.onChangeAdjunto }
                                                    placeholder = 'PRESUPUESTOS' value = { form.adjuntos.presupuesto.value } name = 'presupuesto' 
                                                    id = 'presupuesto' files = { form.adjuntos.presupuesto.files } deleteAdjunto = { this.clearFiles } multiple
                                                    classinput = 'file-input' accept = '*/*' iconclass = 'las la-file-pdf icon-xl' 
                                                    classbtn = 'btn btn-sm btn-light font-weight-bolder mb-0' />
                                            </div>
                                        </div>
                                    </div>
                                : <></>
                            }
                        </div>
                        <div className="d-flex justify-content-between border-top mt-3 pt-3">
                            <div className="mr-2">
                                <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase"  onClick = { openWizard2 } 
                                    data-wizard-type="action-prev">
                                    Anterior
                                </button>
                            </div>
                            <div>
                                <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" text="ENVIAR"
                                    onClick = {  (e) => { e.preventDefault();  validateAlert(this.onSubmit, e, 'wizard-3-content') } } />
                            </div>
                        </div>  
                    </div>
                </Form>
            </div>
        )
    }
}

export default ComprasFormNew