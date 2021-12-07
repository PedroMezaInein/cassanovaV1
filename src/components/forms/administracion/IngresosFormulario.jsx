import React, { Component } from 'react'
import S3 from 'react-aws-s3'
import Swal from 'sweetalert2'
import { Form } from 'react-bootstrap'
import j2xParser from 'fast-xml-parser'
import { RFC } from '../../../constants'
import { setOptions } from '../../../functions/setters'
import withReactContent from 'sweetalert2-react-content'
import {openWizard1, openWizard2, openWizard3 } from '../../../functions/wizard'
import { apiOptions, catchErrors, apiPutForm, apiPostForm, apiGet } from '../../../functions/api'
import { printResponseErrorAlert, errorAlert, waitAlert, validateAlert, doneAlert, createAlert } from '../../../functions/alert'
import { CalendarDay, RadioGroupGray, InputGray, FileInput, SelectSearchGray, InputMoneyGray, Button } from '../../form-components'

class IngresosFormulario extends Component {
    state = {
        form: {
            cliente: '',
            empresa: '',
            area: '',
            subarea: '',
            descripcion: '',
            cuenta: '',
            rfc: '',
            total: 0,
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
            tipoPago: 0,
            facturaObject: {},
            tipoImpuesto: 0,
            estatusCompra: 0,
        },
        options: {
            empresas: [],
            clientes: [],
            areas: [],
            subareas: [],
            cuentas: [],
            tiposPagos: [],
            tiposImpuestos: [],
            estatusCompras: [],
        },
        data: { clientes: [], empresas: [] },
        formeditado: 0,
        ingreso: ''
    }

    componentDidMount = () => {
        this.getOptions()
        const { type, dato } = this.props
        this.setState({
            ...this.state,
            formeditado: type === 'add' ? 0 : 1
        })
        if(dato){
            this.getIngreso()
        }
    }

    componentDidUpdate = (nextProps) => {
        if(this.props.dato !== nextProps.dato){
            if(this.props.dato){
                this.getIngreso()
            }
        }
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
            case 'cliente':
                data.clientes.find(function (elemento) {
                    if (value.toString() === elemento.id.toString()) {
                        if (elemento.rfc !== '') {
                            form.rfc = elemento.rfc
                        }
                    }
                    return false
                })
            break;
            case 'tipoPago':
                if(form.facturaObject){
                    let tipoPago = options.tiposPagos.find( (elemento) => {
                        return elemento.value.toString() === value.toString()
                    })
                    if(tipoPago){
                        if(tipoPago.name === 'TOTAL'){
                            form.total = form.facturaObject.total
                        }
                    }
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
                }else{
                    form.tipoImpuesto = ''
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
        const MySwal = withReactContent(Swal)
        const { files, name } = e.target
        const { form, options, data } = this.state
        const { dato } = this.props
        let empresa = null
        let cliente = null
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
                        if(dato.empresa.rfc !== obj.rfc_emisor){
                            errores.push( 'El RFC empresa y el RFC emisor no coincide' )
                        }
                    }
                }
                empresa = data.empresas.find((element) => {
                    return element.rfc === obj.rfc_emisor
                })
                if(!empresa){
                    errores.push( 'No existe una empresa con ese RFC' )
                }else{
                    form.empresa = empresa.id.toString()
                    if(empresa.cuentas){
                        options.cuentas = setOptions(empresa.cuentas, 'nombre', 'id')
                    }
                }
                cliente = data.clientes.find((element) => {
                    return element.rfc === obj.rfc_receptor
                })
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
                    Swal.close()
                    MySwal.close()
                    setTimeout(function(){ 
                        errorAlert(textError)
                    }, 100);
                }else{
                    if(cliente === undefined){
                        createAlert(
                            `No existe el cliente`,
                            `¿Lo deseas crear?`,
                            () => {
                                const { at } = this.props
                                let objeto = {}
                                let cadena = obj.nombre_receptor.replace(' S. C.', ' SC').toUpperCase()
                                cadena = cadena.replace(',S.A.', ' SA').toUpperCase()
                                cadena = cadena.replace(/,/g, '').toUpperCase()
                                cadena = cadena.replace(/\./g, '').toUpperCase()
                                objeto.empresa = cadena
                                objeto.nombre = cadena
                                objeto.rfc = obj.rfc_receptor.toUpperCase()
                                apiPostForm( 'cliente', objeto, at ).then(
                                    (response) => {
                                        const { cliente } = response.data
                                        this.getOptions()
                                        doneAlert(`Cliente ${cliente.empresa} generado con éxito`, () => {
                                            form.facturaObject = obj
                                            this.setState({
                                                ...this.state,
                                                form
                                            })
                                            this.checkFactura(obj)                    
                                        })
                                    }, (error) => { printResponseErrorAlert(error) }
                                ).catch((error) => { catchErrors(error) })
                            }
                        )
                    } else {
                        form.cliente = cliente.id.toString()
                        form.facturaObject = obj
                        Swal.close()
                        this.setState({ ...this.state, form, options })
                        this.checkFactura(obj)
                    }
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
        const { at, state } = this.props
        apiOptions(`v2/administracion/ingresos`, at).then(
            (response) => {
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras, clientes } = response.data
                const { options, data, form } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                options.areas = setOptions(areas, 'nombre', 'id')
                if(state){
                    const { prestacion } = state
                    if(prestacion){
                        let area = areas.find((value) => {
                            return value.nombre === 'RECURSOS HUMANOS'
                        })
                        if(area){
                            form.area = area.id.toString()
                            options.subareas = setOptions(area.subareas, 'nombre', 'id')
                            let subarea = area.subareas.find((value) => {
                                return value.nombre === 'PRESTACIONES'
                            })
                            if(subarea){
                                form.subarea = subarea.id.toString()
                            }
                        }
                    }
                }
                options.clientes = setOptions(clientes, 'empresa', 'id')
                options.tiposPagos = setOptions(tiposPagos, 'tipo', 'id')
                options.tiposImpuestos = setOptions(tiposImpuestos, 'tipo', 'id')
                options.estatusCompras = setOptions(estatusCompras, 'estatus', 'id')
                data.clientes = clientes
                data.empresas = empresas
                this.setState({ ...this.state, options, data, form })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch( (error) => { catchErrors(error) })
    }

    checkFactura = async(obj) => {
        const { at } = this.props
        apiPutForm(`v2/administracion/facturas/check?tipo_factura=ingresos`, obj, at).then(
            (response) => {
                const { factura } = response.data
                const { form } = this.state
                form.facturaItem = factura
                this.setState({ ...this.state, form })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch(( error ) => { catchErrors(error) })
    }

    editIngresoAxios = async() => {
        const { dato, at } = this.props
        const { form } = this.state
        apiPutForm(`v3/administracion/ingresos/${dato.id}`, form, at).then(
            (response) => {
                const { history } = this.props
                doneAlert(`Ingreso editado con éxito`, 
                    () => { history.push(`/administracion/ingresos?id=${dato.id}`) }     )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    addIngreso = () => {
        const { form } = this.state
        const { at } = this.props
        apiPostForm('v3/administracion/ingresos', form, at).then(
            (response) => {
                const { ingreso } = response.data
                this.setState({
                    ...this.state,
                    ingreso: ingreso
                })
                doneAlert(
                    `Ingreso generado con éxito`,
                    () => {
                        // Los ingresos es con factura
                        if(ingreso.factura){
                            // Adjunto un XML
                            if(Object.keys(form.facturaObject).length > 0 ){
                                if(form.facturaItem){
                                    //Tiene una factura guardada
                                    this.attachFactura()
                                }else{
                                    //No hay factura generada
                                    this.addFacturaS3()
                                }
                            }else{
                                //No adjunto XML
                                if(form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length){
                                    //El ingreso tiene adjuntos
                                    this.attachFiles()
                                }else{
                                    //Ingreso generado con éxito y cambio de página
                                    doneAlert(`Ingreso generado con éxito`, 
                                        () => {
                                            const { history } = this.props
                                            history.push(`/administracion/ingresos?id=${ingreso.id}`)
                                        }
                                    )
                                }
                            }
                        }else{
                            // La ingreso no es con factura
                            if(form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length){
                                //La ingreso tiene adjuntos
                                this.attachFiles()
                            }else{
                                //Ingreso generado con éxito y cambio de página
                                doneAlert(`Ingreso generado con éxito`,
                                    () => {
                                        const { history } = this.props
                                        history.push(`/administracion/ingresos?id=${ingreso.id}`)
                                    }
                                )
                            }
                        }
                    }
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch( (error) => { catchErrors(error) })
    }

    addFacturaS3 = async() => {
        waitAlert()
        const { at } = this.props
        const { form } = this.state
        apiGet(`v1/constant/admin-proyectos`, at).then(
            (response) => {
                const { alma } = response.data
                let filePath = `facturas/ingresos/`
                let aux = []
                form.adjuntos.xml.files.forEach((file) => {
                    aux.push(file)
                })
                form.adjuntos.pdf.files.forEach((file) => {
                    aux.push(file)
                })
                let auxPromises  = aux.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file.file, `${filePath}${Math.floor(Date.now() / 1000)}-${file.name}`)
                            .then((data) =>{
                                const { location,status } = data
                                if(status === 204) resolve({ name: file.name, url: location })
                                else reject(data)
                            })
                            .catch((error) => {
                                catchErrors(error)
                                errorAlert(`Ocurrió un error al subir el archivo ${file.name}`)
                                reject(error)
                            })
                    })
                })
                Promise.all(auxPromises).then(values => { this.addNewFacturaAxios(values)}).catch(err => console.error(err))        
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    addNewFacturaAxios = async(files) => {
        const { form } = this.state
        const { at } = this.props
        form.archivos = files
        apiPostForm(`v2/administracion/facturas`, form, at).then(
            (response) => {
                const { factura } = response.data
                const { form } = this.state
                form.facturaItem = factura
                this.setState({ ...this.state, form })
                this.attachFactura()
            }, (error) => {  printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    attachFactura = async() => {
        waitAlert()
        const { at, history } = this.props
        const { form, ingreso } = this.state
        let objeto = {}
        objeto.dato = ingreso.id
        objeto.tipo = 'ingreso'
        objeto.factura = form.facturaItem.id
        apiPutForm(`v2/administracion/facturas/attach`, objeto, at).then(
                (response) => {
                    doneAlert(`Factura asignada con éxito`, () => { 
                        if(form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length){
                            this.attachFiles()
                        }else{
                            history.push(`/administracion/ingresos?id=${ingreso.id}`)
                        }
                    })
                }, (error) => { printResponseErrorAlert(error) }
            ).catch( (error) => { catchErrors(error) } )
    }

    attachFiles = async() => {
        waitAlert()
        const { form, ingreso } = this.state
        const { at } = this.props
        apiGet(`v1/constant/admin-proyectos`, at).then(
            (response) => {
                const { alma } = response.data
                let filePath = `ingresos/${ingreso.id}/`
                let aux = []
                form.adjuntos.pago.files.forEach((file) => {
                    aux.push(
                        {
                            name: `${filePath}pagos/${Math.floor(Date.now() / 1000)}-${file.name}`,
                            file: file,
                            tipo: 'pago'
                        }
                    )
                })
                form.adjuntos.presupuesto.files.forEach((file) => {
                    aux.push(
                        {
                            name: `${filePath}presupuestos/${Math.floor(Date.now() / 1000)}-${file.name}`,
                            file: file,
                            tipo: 'presupuesto'
                        }
                    )
                })
                let auxPromises  = aux.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file.file.file, file.name)
                            .then((data) =>{
                                const { location,status } = data
                                if(status === 204) resolve({ name: file.name, url: location, tipo: file.tipo })
                                else reject(data)
                            })
                            .catch((error) => {
                                catchErrors(error)
                                errorAlert(`Ocurrió un error al subir el archivo ${file.name}`)
                                reject(error)
                            })
                    })
                })
                Promise.all(auxPromises).then(values => { this.attachFilesS3(values)}).catch(err => console.error(err))        
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    attachFilesS3 = async(files) => {
        const { ingreso } = this.state
        const { at } = this.props
        apiPutForm( `v3/administracion/ingresos/${ingreso.id}/archivos/s3`, { archivos: files }, at ).then(
            ( response ) => {
                doneAlert(`Archivos adjuntados con éxito`, 
                    () => {
                        const { history } = this.props
                        history.push(`/administracion/ingresos?id=${ingreso.id}`)
                    }
                )
            }, ( error ) => { printResponseErrorAlert( error ) }
        ).catch( ( error ) => { catchErrors( error ) } )
    }
    getIngreso = async() => {
        waitAlert()
        const { dato, at } = this.props
        apiGet(`v2/administracion/ingresos/${dato.id}`, at).then(
            (response) => {
                const { ingreso } = response.data
                const { form, options } = this.state
                form.factura = ingreso.factura ? 'Con factura' : 'Sin factura'
                if(ingreso.cliente){
                    form.cliente = ingreso.cliente.id.toString()
                    form.rfc = ingreso.cliente.rfc
                }
                if (ingreso.empresa) {
                    form.empresa = ingreso.empresa.id.toString()
                    if(ingreso.empresa.cuentas){
                        options.cuentas = setOptions(ingreso.empresa.cuentas, 'nombre', 'id')
                        if (ingreso.cuenta){
                            form.cuenta = ingreso.cuenta.id.toString()
                        }
                    }
                }
                
                if(ingreso.area){
                    form.area = ingreso.area.id.toString()
                    if(ingreso.area.subareas){
                        options.subareas = setOptions(ingreso.area.subareas, 'nombre', 'id')
                    }
                    if (ingreso.subarea) {
                        form.subarea = ingreso.subarea.id.toString()
                    }    
                }

                if(ingreso.tipo_pago){
                    form.tipoPago = ingreso.tipo_pago ? ingreso.tipo_pago.id.toString() : ''
                }

                if(ingreso.tipo_impuesto){
                    form.tipoImpuesto = ingreso.tipo_impuesto ? ingreso.tipo_impuesto.id.toString() : ''
                }

                if(ingreso.estatus_compra){
                    form.estatusCompra = ingreso.estatus_compra ? ingreso.estatus_compra.id.toString() : ''
                }

                form.total = ingreso.monto
                form.fecha = new Date( ingreso.created_at )
                form.descripcion = ingreso.descripcion

                Swal.close()

                this.setState({
                    ...this.state,
                    form,
                    options
                })
            }, ( error ) => { printResponseErrorAlert(error) }
        ).catch( (error ) => { catchErrors(error) })
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
        const { type } = this.props
        waitAlert()
        switch (type) {
            case 'add':
                this.addIngreso()
            break;
            case 'edit':
                this.editIngresoAxios()
                break;
            default: break;
        }
    }
    
    render() {
        const { formeditado, form, options } = this.state
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
                        <h5 className="mb-4 font-weight-bold text-dark px-4">Ingresa los datos de la factura</h5>
                        <div className="form-group-marginless row mx-0">
                            <div className = 'col-md-3 align-self-center'>
                                <RadioGroupGray name='factura' onChange = { this.onChange } placeholder = '¿Lleva factura?' value = { form.factura }
                                    options = { [ { label: 'Si', value: 'Con factura' }, { label: 'No', value: 'Sin factura' } ] } 
                                    messageinc = "Selecciona una opción" customdiv='mb-2'
                                />    
                            </div>
                            {
                                this.isActiveFactura() ?
                                    <div className="col-md-9">
                                        <div className="row mx-0">
                                            <div className="col-md-4 text-center">
                                                <label className="col-form-label font-weight-bold text-dark-60">XML DE LA FACTURA</label>
                                                <br />
                                                <FileInput onChangeAdjunto = { this.onChangeFactura } placeholder = 'Factura XML' 
                                                    value = { form.adjuntos.xml.value } name = 'xml' id = 'xml' accept = 'text/xml' 
                                                    files = { form.adjuntos.xml.files } deleteAdjunto = { this.clearFiles }
                                                    messageinc = 'Agrega el XML de la factura' iconclass = 'las la-file-alt icon-xl' 
                                                    classinput = 'file-input' classbtn='btn btn-sm btn-light font-weight-bolder mb-0' 
                                                    requirevalidation = { 0 } formeditado = { 0 } />
                                            </div>
                                            <div className="col-md-4 text-center">
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
                                                    patterns = { RFC } messageinc = "Ej. ABCD001122ABC" maxLength = "13"
                                                    withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } disabled/>
                                            </div>
                                        </div>
                                    </div>
                                : <></>
                            }
                            <div className="col-md-12 mt-5">
                                <div className="separator separator-dashed mt-1 mb-2" />
                            </div>
                            <div className="col-md-6">
                                <SelectSearchGray options = { options.clientes } placeholder = 'Selecciona el cliente' value = { form.cliente } 
                                    onChange = { (value) => { this.updateSelect(value, 'cliente') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                    withicon = { 1 } iconclass = "far fa-user" messageinc = "Selecciona el cliente" formeditado = { formeditado }/>
                            </div>
                            <div className="col-md-6">
                                <SelectSearchGray options = { options.empresas } placeholder = 'Selecciona la empresa' value = { form.empresa } 
                                    onChange = { (value) => { this.updateSelect(value, 'empresa') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                    withicon = { 1 } iconclass = "far fa-building" messageinc = "Selecciona la empresa" 
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
                        <h5 className="mb-4 font-weight-bold text-dark px-4">Selecciona el área y fecha</h5>
                        <div className="form-group form-group-marginless row mx-0">
                            <div className = 'col-md-4 text-center'>
                                <div className="d-flex justify-content-center h-10px">
                                    <label className="col-form-label font-weight-bold text-dark-60">Fecha del ingreso</label>
                                </div>
                                <CalendarDay date = { form.fecha } onChange = { this.onChange } name = 'fecha' requirevalidation = { 1 } />
                            </div>
                            <div className="col-md-8 align-self-center">
                                <div className="row mx-0">
                                    <div className="col md-6">
                                        <SelectSearchGray options = { options.areas } placeholder = 'Selecciona el área' value = { form.area } 
                                            onChange = { (value) => { this.updateSelect(value, 'area') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                            withicon = { 1 } iconclass = "far fa-window-maximize" messageinc = "Selecciona el área" 
                                            formeditado = { formeditado } requirevalidation = { 1 }/>
                                    </div>
                                    <div className="col md-6">
                                        <SelectSearchGray options = { options.subareas } placeholder = 'Selecciona subarea' value = { form.subarea } 
                                            onChange = { (value) => { this.updateSelect(value, 'subarea') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                            withicon = { 1 } iconclass = "far fa-window-restore" messageinc = "Selecciona el subárea" 
                                            formeditado = { formeditado } requirevalidation = { 1 }/>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="separator separator-dashed mt-1 mb-2" />
                                    </div>
                                    <div className="col-md-12">
                                        <InputGray requirevalidation = { 0 } formeditado = { formeditado } as = "textarea" placeholder = "DESCRIPCIÓN" 
                                            rows = "3" value = { form.descripcion } name = "descripcion" onChange = { this.onChange } 
                                            customclass = "px-2 text-justify" messageinc="Ingresa una descripción." 
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
                        <h5 className="mb-4 font-weight-bold text-dark px-4">Selecciona el tipo de pago, impuesto y estatus</h5>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-6">
                                <SelectSearchGray options = { options.cuentas } placeholder = 'Selecciona la cuenta' value = { form.cuenta } 
                                    onChange = { (value) => { this.updateSelect(value, 'cuenta') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                    withicon = { 1 } iconclass = "far fa-credit-card" messageinc = "Selecciona la cuenta" 
                                    formeditado = { formeditado } requirevalidation = { 1 }/>
                            </div>
                            <div className="col-md-6">
                                <SelectSearchGray options = { options.estatusCompras } placeholder = 'Selecciona el estatus de la compra' 
                                    value = { form.estatusCompra } onChange = { (value) => { this.updateSelect(value, 'estatusCompra') } } 
                                    withtaglabel = { 1 } withtextlabel = { 1 } withicon = { 1 } iconclass = "flaticon2-time" 
                                    messageinc = "Selecciona el estatus de la compra"  formeditado = { formeditado } 
                                    requirevalidation = { 1 }/>
                            </div>
                            <div className="col-md-12">
                                <div className="separator separator-dashed mt-1 mb-2" />
                            </div>
                            <div className="col-md-4">
                                <SelectSearchGray options = { options.tiposPagos } placeholder = 'Selecciona el tipo de pago' 
                                    value = { form.tipoPago } onChange = { (value) => { this.updateSelect(value, 'tipoPago') } } 
                                    withtaglabel = { 1 } withtextlabel = { 1 } withicon = { 1 } iconclass = "fas fa-coins" 
                                    messageinc = "Selecciona el tipo de pago"  formeditado = { formeditado } 
                                    requirevalidation = { 1 }/>
                            </div>
                            <div className="col-md-4">
                                <SelectSearchGray options = { options.tiposImpuestos } placeholder = 'Selecciona el tipo de impuesto' 
                                    value = { form.tipoImpuesto } onChange = { (value) => { this.updateSelect(value, 'tipoImpuesto') } } 
                                    withtaglabel = { 1 } withtextlabel = { 1 } withicon = { 1 } iconclass = "fas fa-file-invoice-dollar" 
                                    messageinc = "Selecciona el tipo de impuesto"  formeditado = { formeditado } 
                                    requirevalidation = { 1 }/>
                            </div>
                            <div className="col-md-4">
                                <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } withformgroup = { 0 } 
                                    requirevalidation = { 1 } formeditado = { formeditado } thousandseparator = { true } prefix = '$' 
                                    name = "total" value = { form.total } onChange = { this.onChange } placeholder = "MONTO" 
                                    iconclass = 'fas fa-money-check-alt' messageinc = "ingresa el monto del ingreso" />
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
                                                    classinput = 'file-input' accept = '*/*' iconclass = 'las la-file icon-xl' 
                                                    classbtn = 'btn btn-sm btn-light font-weight-bolder mb-0' />
                                            </div>
                                            <div className="col-md-6 text-center">
                                                <label className="col-form-label font-weight-bold text-dark-60">PRESUPUESTOS</label>
                                                <br />
                                                <FileInput requirevalidation = { 0 } formeditado = { formeditado } onChangeAdjunto = { this.onChangeAdjunto }
                                                    placeholder = 'PRESUPUESTOS' value = { form.adjuntos.presupuesto.value } name = 'presupuesto' 
                                                    id = 'presupuesto' files = { form.adjuntos.presupuesto.files } deleteAdjunto = { this.clearFiles } multiple
                                                    classinput = 'file-input' accept = '*/*' iconclass = 'las la-file icon-xl' 
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

export default IngresosFormulario