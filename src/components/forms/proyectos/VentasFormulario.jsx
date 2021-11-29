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
import { CalendarDay, RadioGroup, InputGray, FileInput, SelectSearchGray, InputMoneyGray, Button, SelectSearchGrayTrue } from '../../form-components'

class VentasFormulario extends Component {

    state = {
        form: {
            cliente: '',
            proyecto: '',
            empresa: '',
            area: '',
            subarea: '',
            descripcion: '',
            cuenta: '',
            rfc: '',
            contrato: '',
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
        },
        options: {
            empresas: [], clientes: [], areas: [], subareas: [], proyectos: [], tiposPagos: [], tiposImpuestos: [], estatusCompras: [], 
            estatusFacturas: [], formasPago: [], metodosPago: [], cuentas: [], contratos: []
        },
        data: { clientes: [], empresas: [] },
        formeditado: 0
    }

    componentDidMount = () => {
        this.getOptions()
        const { type, solicitud, dato } = this.props
        this.setState({
            ...this.state,
            formeditado: type === 'add' ? 0 : 1
        })
        if(solicitud){
            this.getSolicitud()
        }
        if(dato){
            this.getVenta()
        }
    }

    componentDidUpdate = (nextProps) => {
        if(this.props.solicitud !== nextProps.solicitud){
            if(this.props.solicitud){
                this.getSolicitud()
            }
        }
        if(this.props.dato !== nextProps.dato){
            if(this.props.dato){
                this.getVenta()
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
                item = data.clientes.find((elemento) => {
                    return elemento.id.toString() === value
                })
                if(item){
                    form.contrato = ''
                    options.contratos = setOptions(item.contratos, 'nombre', 'id')
                    form.proyecto = ''
                    options.proyectos = setOptions(item.proyectos, 'nombre', 'id')
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
                    form.cuenta = ''
                    options.cuentas = setOptions(empresa.cuentas, 'nombre', 'id')
                }
                cliente = data.clientes.find((element) => {
                    return element.rfc === obj.rfc_receptor
                })
                if(cliente){
                    form.cliente = cliente.id.toString()
                    form.contrato = ''
                    options.contratos = setOptions(cliente.contratos, 'nombre', 'id')
                    form.proyecto = ''
                    options.proyectos = setOptions(cliente.proyectos, 'nombre', 'id')
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
                    }else{
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
        const { at } = this.props
        apiOptions(`v2/proyectos/ventas`, at).then(
            (response) => {
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras, clientes, formasPago, 
                    metodosPago, estatusFacturas } = response.data
                const { options, data } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                options.clientes = setOptions(clientes, 'empresa', 'id')
                options.areas = setOptions(areas, 'nombre', 'id')
                options.tiposPagos = setOptions(tiposPagos, 'tipo', 'id')
                options.tiposImpuestos = setOptions(tiposImpuestos, 'tipo', 'id')
                options.estatusCompras = setOptions(estatusCompras, 'estatus', 'id')
                options.estatusFacturas = setOptions(estatusFacturas, 'estatus', 'id')
                options.formasPago = setOptions(formasPago, 'nombre', 'id')
                options.metodosPago = setOptions(metodosPago, 'nombre', 'id')
                data.clientes = clientes
                data.empresas = empresas
                this.setState({ ...this.state, options, data })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch( (error) => { catchErrors(error) })
    }

    checkFactura = async(obj) => {
        const { at } = this.props
        apiPutForm(`v2/administracion/facturas/check?tipo_factura=ventas`, obj, at).then(
            (response) => {
                const { factura } = response.data
                const { form } = this.state
                form.facturaItem = factura
                this.setState({ ...this.state, form })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch(( error ) => { catchErrors(error) })
    }

    editVentaAxios = async() => {
        const { dato, at } = this.props
        const { form } = this.state
        apiPutForm(`v3/proyectos/ventas/${dato.id}`, form, at).then(
            (response) => {
                const { history } = this.props
                history.push(`/proyectos/ventas?id=${dato.id}`)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    
    addVenta = () => {
        const { form } = this.state
        const { at } = this.props
        apiPostForm('v3/proyectos/ventas', form, at).then(
            (response) => {
                const { venta } = response.data
                this.setState({
                    ...this.state,
                    venta: venta
                })
                doneAlert(
                    `Venta generada con éxito`,
                    () => {
                        // La venta es con factura
                        if(venta.factura){
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
                                    //La venta tiene adjuntos
                                    this.attachFiles()
                                }else{
                                    //Venta generada con éxito y cambio de página
                                    doneAlert(`Venta generada con éxito`, 
                                        () => {
                                            const { history } = this.props
                                            history.push(`/proyectos/ventas?id=${venta.id}`)
                                        }
                                    )
                                }
                            }
                        }else{
                            // La venta no es con factura
                            if(form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length){
                                //La venta tiene adjuntos
                                this.attachFiles()
                            }else{
                                //Venta generada con éxito y cambio de página
                                doneAlert(`Venta generada con éxito`, 
                                    () => {
                                        const { history } = this.props
                                        history.push(`/proyectos/ventas?id=${venta.id}`)
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
                let filePath = `facturas/ventas/`
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
        const { form, venta } = this.state
        let objeto = {}
        objeto.dato = venta.id
        objeto.tipo = 'venta'
        objeto.factura = form.facturaItem.id
        apiPutForm(`v2/administracion/facturas/attach`, objeto, at).then(
                (response) => {
                    doneAlert(`Factura asignada con éxito`, () => { 
                        if(form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length){
                            this.attachFiles()
                        }else{
                            history.push(`/proyectos/ventas?id=${venta.id}`)
                        }
                    })
                }, (error) => { printResponseErrorAlert(error) }
            ).catch( (error) => { catchErrors(error) } )
    }

    attachFiles = async() => {
        waitAlert()
        const { form, venta } = this.state
        const { at } = this.props
        apiGet(`v1/constant/admin-proyectos`, at).then(
            (response) => {
                const { alma } = response.data
                let filePath = `ventas/${venta.id}/`
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
        const { venta } = this.state
        const { at } = this.props
        apiPutForm( `v2/proyectos/ventas/${venta.id}/archivos/s3`, { archivos: files }, at ).then(
            ( response ) => {
                doneAlert(`Archivos adjuntados con éxito`, 
                    () => {
                        const { history } = this.props
                        history.push(`/proyectos/ventas?id=${venta.id}`)
                    }
                )
            }, ( error ) => { printResponseErrorAlert( error ) }
        ).catch( ( error ) => { catchErrors( error ) } )
    }

    getVenta = async() => {
        waitAlert()
        const { dato, at } = this.props
        apiGet(`v2/proyectos/ventas/${dato.id}`, at).then(
            (response) => {
                const { venta } = response.data
                const { form, options } = this.state
                form.factura = venta.factura ? 'Con factura' : 'Sin factura'
                if(venta.cliente){
                    form.cliente = venta.cliente.id.toString()
                    form.rfc = venta.cliente.rfc
                    if(venta.cliente.contratos){
                        options.contratos = setOptions(venta.cliente.contratos, 'nombre', 'id')
                    }
                    if (venta.contrato) {
                        form.contrato = venta.contrato.id.toString()
                    }
                    if(venta.cliente.proyectos){
                        options.proyectos = setOptions(venta.cliente.proyectos, 'nombre', 'id')
                    }
                }
                if(venta.proyecto){
                    form.proyecto = venta.proyecto.id.toString()
                }
                if (venta.empresa) {
                    form.empresa = venta.empresa.id.toString()
                    if(venta.empresa.cuentas){
                        options.cuentas = setOptions(venta.empresa.cuentas, 'nombre', 'id')
                        if (venta.cuenta){
                            form.cuenta = venta.cuenta.id.toString()
                        }
                    }
                }
                
                if(venta.area){
                    form.area = venta.area.id.toString()
                    if(venta.area.subareas){
                        options.subareas = setOptions(venta.area.subareas, 'nombre', 'id')
                    }
                    if (venta.subarea) {
                        form.subarea = venta.subarea.id.toString()
                    }    
                }

                if(venta.tipo_pago){
                    form.tipoPago = venta.tipo_pago ? venta.tipo_pago.id.toString() : ''
                }

                if(venta.tipo_impuesto){
                    form.tipoImpuesto = venta.tipo_impuesto ? venta.tipo_impuesto.id.toString() : ''
                }

                if(venta.estatus_compra){
                    form.estatusCompra = venta.estatus_compra ? venta.estatus_compra.id.toString() : ''
                }

                form.total = venta.monto
                form.fecha = new Date( venta.created_at )
                form.descripcion = venta.descripcion
                Swal.close()

                this.setState({
                    ...this.state,
                    form,
                    options
                })
            }, ( error ) => { printResponseErrorAlert(error) }
        ).catch( (error ) => { catchErrors(error) })
    }

    getSolicitud = async() => {
        waitAlert()
        const { solicitud, at } = this.props
        apiGet(`solicitud-venta/${solicitud.id}`, at).then(
            ( response ) => {
                const { solicitud: solicitudResponse } = response.data
                const { options, form } = this.state
                form.solicitud = solicitudResponse.id
                form.factura = solicitudResponse.factura ? 'Con factura' : 'Sin factura'
                form.fecha = new Date(solicitudResponse.created_at)
                let item = null;
                if (solicitudResponse.factura) {
                    item = options.tiposImpuestos.find((elemento) => {
                        return elemento.name === 'IVA'
                    })
                    if(item){
                        form.tipoImpuesto = item.value
                    }
                }
                if (solicitud.proyecto) {
                    if (solicitud.proyecto.clientes) {
                        if (solicitud.proyecto.clientes[0].proyectos) {
                            options.proyectos = setOptions(solicitud.proyecto.clientes[0].proyectos, 'nombre', 'id')
                            form.proyecto = solicitud.proyecto.id.toString()
                            form.cliente = solicitud.proyecto.clientes[0].id.toString()
                            form.rfc = solicitud.proyecto.clientes[0].rfc
                        }
                        if (solicitud.proyecto.clientes.contratos) {
                            options.contratos = setOptions(solicitud.proyecto.clientes.contratos, 'nombre', 'id')
                        }
                    }
                }
                if (solicitud.empresa) {
                    if (solicitud.empresa.cuentas) {
                        options.cuentas = setOptions(solicitud.empresa.cuentas, 'nombre', 'id')
                        form.empresa = solicitud.empresa.id.toString()
                    }
                }
                if (solicitud.subarea) {
                    if (solicitud.subarea.area) {
                        if (solicitud.subarea.area.subareas) {
                            options.subareas = setOptions(solicitud.subarea.area.subareas, 'nombre', 'id')
                            form.area = solicitud.subarea.area.id.toString()
                            form.subarea = solicitud.subarea.id.toString()
                        }
                    }
                }
                if (solicitud.tipo_pago) {
                    form.tipoPago = solicitud.tipo_pago.id.toString()
                }
                if (solicitud.monto) {
                    form.total = solicitud.monto
                }
                if (solicitud.descripcion) {
                    form.descripcion = solicitud.descripcion
                }
                Swal.close()
                this.setState({ ...this.state, form, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => catchErrors(error))
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
        switch(type){
            case 'add':
            case 'convert':
                this.addVenta()
            break;
            case 'edit':
                this.editVentaAxios()
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
                        <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos de la factura</h5>
                        <div className="form-group form-group-marginless row mx-0">
                            <div className = 'col-md-3'>
                                <RadioGroup name='factura' onChange = { this.onChange } placeholder = '¿Lleva factura?' value = { form.factura }
                                    options = { [ { label: 'Si', value: 'Con factura' }, { label: 'No', value: 'Sin factura' } ] } />    
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
                                <SelectSearchGray options = { options.empresas } placeholder = 'Selecciona la empresa' value = { form.empresa } 
                                    onChange = { (value) => { this.updateSelect(value, 'empresa') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                    withicon = { 1 } iconclass = "far fa-building" messageinc = "Incorrecto. Selecciona la empresa" 
                                    formeditado = { formeditado }/>
                            </div>
                            <div className="col-md-4">
                                <SelectSearchGray options = { options.clientes } placeholder = 'Selecciona el cliente' value = { form.cliente } 
                                    onChange = { (value) => { this.updateSelect(value, 'cliente') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                    withicon = { 1 } iconclass = "far fa-user" messageinc = "Incorrecto. Selecciona el cliente" formeditado = { formeditado }/>
                            </div>
                            <div className="col-md-4">
                                <SelectSearchGray options = { options.proyectos } placeholder = 'Selecciona el proyecto' value = { form.proyecto } 
                                    onChange = { (value) => { this.updateSelect(value, 'proyecto') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                    withicon = { 1 } iconclass = "far fa-folder-open" messageinc = "Incorrecto. Selecciona el proyecto" 
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
                                <label className="col-form-label font-weight-bold text-dark-60">Fecha de la venta</label>
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
                            <div className="col-md-4">
                                <SelectSearchGray options = { options.tiposPagos } placeholder = 'Selecciona el tipo de pago' 
                                    value = { form.tipoPago } onChange = { (value) => { this.updateSelect(value, 'tipoPago') } } 
                                    withtaglabel = { 1 } withtextlabel = { 1 } withicon = { 1 } iconclass = "fas fa-coins" 
                                    messageinc = "Incorrecto. Selecciona el tipo de pago"  formeditado = { formeditado } 
                                        requirevalidation = { 1 }/>
                            </div>
                            <div className="col-md-4">
                                <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } withformgroup = { 0 } 
                                    requirevalidation = { 1 } formeditado = { formeditado } thousandseparator = { true } prefix = '$' 
                                    name = "total" value = { form.total } onChange = { this.onChange } placeholder = "MONTO" 
                                    iconclass = 'fas fa-money-check-alt' messageinc = "Incorrecto. ingresa el monto de la venta" />
                            </div>
                            <div className="col-md-4">
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

export default VentasFormulario