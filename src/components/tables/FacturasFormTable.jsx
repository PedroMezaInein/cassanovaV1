import React, { Component } from 'react'
import Swal from 'sweetalert2'
import j2xParser from 'fast-xml-parser'
import { Form, Col } from 'react-bootstrap'
import { FacturaTable } from '../../components/tables'
import withReactContent from 'sweetalert2-react-content'
import { setOptionsWithLabel } from '../../functions/setters'
import { FileInput, Button, ReactSelectSearchGray } from '../form-components'
import { apiGet, apiOptions, apiPostForm, apiPutForm, apiDelete, catchErrors } from '../../functions/api'
import { validateAlert, waitAlert, errorAlert, printResponseErrorAlert, doneAlert, createAlert, questionAlertY } from '../../functions/alert'
import S3 from 'react-aws-s3';

class PermisosForm extends Component {
    state = {
        form: {
            estatusCompra: '',
            facturaObject: null,
            factura: null,
            adjuntos: {
                xml: {
                    files: [], value: ''
                },
                pdf: {
                    files: [], value: ''
                }
            },
        },
        options: {
            clientes: [],
            empresas: [],
            proveedores: [],
            estatusCompra: []
        },
        response: {},
        facturas: [],
        url_factura:''
    }
    
    componentDidMount = () => {
        this.getOptions()
        this.getFacturas()
    }
    
    getOptions = async() => {
        const { tipo_factura, at } = this.props
        console.log(tipo_factura)
        apiOptions(`v2/administracion/facturas/${tipo_factura}`, at).then(
            (response) => {
                const { estatusCompras, clientes, empresas, proveedores } = response.data
                const { options } = this.state
                options.clientes = clientes
                options.empresas = empresas
                options.proveedores = proveedores
                options.estatusCompra = setOptionsWithLabel(estatusCompras, 'estatus', 'id')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch(( error ) => { catchErrors(error) })
    }

    getFacturas = () => {
        waitAlert()
        const { at } = this.props
        apiGet(this.getUrl('getFacturas'), at).then(
            (response) => {                
                this.getResponse(response.data)
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    
    getUrl = (type, id_factura) => {
        const { id, tipo_factura } = this.props
        let url = ''
        switch (type) {
            case 'getFacturas':
                switch (tipo_factura) {
                    case 'compras':
                    case 'ventas':
                        url = `v2/proyectos/${tipo_factura}/facturas/${id}`
                        break;
                    case 'egresos':
                    case 'ingresos':
                        url = `v2/administracion/${tipo_factura}/facturas/${id}`
                        break;
                    default:
                        break;
                }
                break;
            case 'deleteFactura':
                switch (tipo_factura) {
                    case 'compras':
                    case 'ventas':
                        url = `v2/proyectos/${tipo_factura}/${id}/facturas/${id_factura}`
                        break;
                    case 'egresos':
                    case 'ingresos':
                        url = `v2/administracion/${tipo_factura}/${id}/facturas/${id_factura}`
                        break;
                    default:
                        break;
                }
                break;
            case 'updateStatus':
                switch (tipo_factura) {
                    case 'compras':
                    case 'ventas':
                        url = `v2/proyectos/${tipo_factura}/estatusCompra/${id}`
                        break;
                    case 'egresos':
                    case 'ingresos':
                        url = `v2/administracion/${tipo_factura}/estatusCompra/${id}`
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        return url
    }
    
    getResponse = (response) => {
        const { options, form } = this.state
        let { facturas } = this.state
        let aux = ''
        if(response.compra){
            aux = response.compra
            facturas = aux.facturas
        }else if(response.venta){
            aux = response.venta
            facturas = aux.facturas
        }else if(response.ingreso){
            aux = response.ingreso
            facturas = aux.facturas
        }else{
            aux = response.egreso
            facturas = aux.facturas
        }
        
        if (aux.estatus_compra) {
            let estatus = options.estatusCompra.find((elemento) => {
                return elemento.value === aux.estatus_compra.id.toString()
            })
            form.estatusCompra = estatus
        }
        this.setState({ ...this.state, form, facturas })
    }
    
    deleteFactura = id => { waitAlert(); this.deleteFacturaAxios(id) }
    
    deleteFacturaAxios = async (id) => {
        const { at } = this.props
        apiDelete(this.getUrl('deleteFactura', id), at).then(
            (response) => {
                this.getResponse(response.data)
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    
    updateSelect = ( value, name) => {
        if (value === null) {
            value = []
            Swal.fire({
                title: '¡LO SENTIMOS!',
                text: 'No puede dejar el estatus de la compra vacio, seleccione otro estatus si desea cambiarlo.',
                icon: 'warning',
                customClass: { actions: 'd-none' },
                timer: 2500,
            })
        }else{
            const { form } = this.state
            form[name] = value
            console.log(value)
            this.setState({ ...this.state, form })
            questionAlertY(
                `Cambiarás el estatus de la compra a: ${value.label}`,
                `¿Deseas continuar?`,
                () => this.updateStatus()
            )
        }
    }
    updateStatus = async () => {
        const { at } = this.props
        // console.log(at)
        const { form } = this.state
        let value = form.estatusCompra.value
        waitAlert()
        apiPutForm(this.getUrl('updateStatus'), { value: value }, at).then(
            (response) => {
                doneAlert('El estatus fue editado con éxito.', () => { this.reloadTables() })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    
    onChangeFactura = (e) => {
        waitAlert()
        const MySwal = withReactContent(Swal)
        const { files, name } = e.target
        const { form, options } = this.state
        const { tipo_factura, dato } = this.props
        let empresa = null
        let cliente = null
        let proveedor = null
        form.adjuntos[name].files = []
        form.facturaObject = {}
        form.factura = ''
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
                switch(tipo_factura){
                    case 'compras':
                    case 'egresos':
                        if(dato.empresa){
                            if(dato.empresa.rfc !== obj.rfc_receptor){
                                //errores.push( 'El RFC empresa y el RFC receptor no coincide' )
                            }
                        }
                        empresa = options.empresas.find((element) => {
                            return element.rfc === obj.rfc_receptor
                        })
                        proveedor = options.proveedores.find((element) => {
                            return element.rfc === obj.rfc_emisor
                        })
                        if(!empresa){
                            errores.push( 'No existe una empresa con ese RFC' )
                        }
                        if(!proveedor){
                            errores.push( 'No existe el proveedor, genéralo desde el apartado de Leads/Proveedores' )
                        }
                        break;
                    case 'ventas':
                    case 'ingresos':
                        if(dato.empresa){
                            if(dato.empresa.rfc !== obj.rfc_emisor){
                                errores.push( 'El RFC empresa y el RFC emisor no coincide' )
                            }
                        }
                        empresa = options.empresas.find((element) => {
                            return element.rfc === obj.rfc_emisor
                        })
                        if(!empresa){
                            errores.push( 'No existe una empresa con ese RFC' )
                        }
                        cliente = options.clientes.find((element) => {
                            return element.rfc === obj.rfc_receptor
                        })
                        break;
                    default:
                        errores.push( 'El tipo de factura no está definido' )
                        break;
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
                    form.factura = ''
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
                        this.setState({
                            ...this.state,
                            form
                        })
                        this.checkFactura(obj)
                    }
                    
                }
            }else{ 
                form.facturaObject = {}
                form.factura = ''
                form.adjuntos.xml.files = []
                form.adjuntos.xml.value = ''
                this.setState({ ...this.state, form })
                errorAlert(`La factura no tiene el formato correcto`) 
            }
        };
        reader.readAsText(files[0])
    }
    
    checkFactura = async(obj) => {
        const { at, tipo_factura } = this.props
        apiPutForm(`v2/administracion/facturas/check?${tipo_factura}`, obj, at).then(
            (response) => {
                const { factura } = response.data
                const { form } = this.state
                form.factura = factura
                this.setState({ ...this.state, form })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch(( error ) => { catchErrors(error) })
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
    
    sendFacturaAxios = async () => {
        const { form } = this.state
        waitAlert()
        if(form.factura){
            this.attachFactura()
        }else{
            this.uploadFacturaFiles()
        }
    }

    uploadFacturaFiles = async() => { // es addFacturaS3()
        const { at, tipo_factura } = this.props
        const { form } = this.state
        apiGet(`v1/constant/admin-proyectos`, at).then(
            (response) => {
                const { alma } = response.data
                let filePath = `facturas/${tipo_factura}/`
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
                form.factura = factura
                this.setState({ ...this.state, form })
                this.attachFactura()
            }, (error) => {  printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    attachFactura = () => {
        const { at, tipo_factura, id } = this.props
        console.log('id.data')
        console.log(id)
        const { form } = this.state
        console.log(form)
        let objeto = {}
        objeto.dato = id
        console.log('objeto.dato')
        console.log(objeto) //contiene id_item, id_factura y tipo: egresos
        switch(tipo_factura){
            case 'compras':
                objeto.tipo = 'compra'
                break;
            case 'ventas':
                objeto.tipo = 'venta'
                break;
            case 'ingresos':
                objeto.tipo = 'ingreso'
                break;
            case 'egresos':
                objeto.tipo = 'egreso'
                break;
            default: break;
        }
        objeto.factura = form.factura.id
        apiPutForm(`v2/administracion/facturas/attach`, objeto, at).then(
                (response) => {
                    doneAlert(`Factura asignada con éxito`, () => { this.reloadTables() })
                }, (error) => { printResponseErrorAlert(error) }
            ).catch( (error) => { catchErrors(error) } )
    }
    reloadTables(){
        const { reloadTable } = this.props
        this.getFacturas()
        reloadTable()
    }
    render() {
        const { form, options, facturas } = this.state
        return (
            <div>
                <Form id='form-factura' onSubmit={(e) => { e.preventDefault(); validateAlert(this.sendFacturaAxios, e, 'form-factura') }}>
                    <div className='row mx-0 mt-5'>
                        <Col md="12">
                            <div className="mb-4 row form-group-marginless text-center">
                                <div className="col-md-4 text-left">
                                    <ReactSelectSearchGray placeholder='ESTATUS DE LA COMPRA' defaultvalue={form.estatusCompra}
                                        iconclass='las la-check-circle icon-xl' requirevalidation={0} 
                                        options={ Array.isArray(options.estatusCompra) ? options.estatusCompra : [] } 
                                        onChange={(value) => this.updateSelect(value, 'estatusCompra')} messageinc='Selecciona el estatus de la compra.' />
                                </div>
                                <div className="col-md-8 border rounded border-dashed">
                                    <div className="row mx-0">
                                        <div className="col-md-6">
                                            <label className="col-form-label font-weight-bold text-dark-60">XML DE LA FACTURA</label>
                                            <br />
                                            <FileInput onChangeAdjunto={this.onChangeFactura} placeholder='Factura XML' value={form.adjuntos.xml.value}
                                                name='xml' id='xml' accept='text/xml' files={form.adjuntos.xml.files} deleteAdjunto={this.clearFiles}
                                                messageinc='Agrega el XML de la factura' iconclass='las la-file-alt icon-xl' classinput='file-input'
                                                classbtn='btn btn-sm btn-light font-weight-bolder mb-0'
                                                requirevalidation={1} formeditado={0} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="col-form-label font-weight-bold text-dark-60">PDF DE LA FACTURA</label>
                                            <br />
                                            <FileInput requirevalidation={0} formeditado={0} onChangeAdjunto={this.onChangeAdjunto}
                                                placeholder='Factura PDF' value={form.adjuntos.pdf.value} name='pdf' id='pdf' classinput='file-input'
                                                accept='application/pdf' files={form.adjuntos.pdf.files} iconclass='las la-file-pdf icon-xl'
                                                classbtn='btn btn-sm btn-light font-weight-bolder mb-0'
                                                deleteAdjunto={this.clearFiles} />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center my-3 pt-3">
                                        <div>
                                            <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" type='submit' text="ENVIAR" />
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </Col>
                    </div>
                </Form>
                <FacturaTable deleteFactura={this.deleteFactura} facturas={facturas} />
            </div>
        )
    }
}

export default PermisosForm