import React, { Component } from 'react'
import { FileInput, Button, CalendarDay, InputGray, ReactSelectSearchGray } from '../../form-components'
import j2xParser from 'fast-xml-parser'
import { errorAlert, printResponseErrorAlert, waitAlert, validateAlert } from '../../../functions/alert'
import Swal from 'sweetalert2'
import { apiGet, apiOptions, apiPostForm, apiPutForm, catchErrors } from '../../../functions/api'
import { setOptions } from '../../../functions/setters'
import { transformOptions } from '../../../functions/options'
import { Form, Col } from 'react-bootstrap'
import S3 from 'react-aws-s3';
class FormVentasSolicitudFactura extends Component{

    state = {
        form: {
            cliente: '',
            proyecto: '',
            cuenta: '',
            subarea: '',
            empresa: '',
            area: '',
            impuesto: '',
            pago: '',
            estatus: '',
            adjuntos:{
                xml: {
                    files: [], value: ''
                },
                pdf: {
                    files: [], value: ''
                },
                pagos: {
                    files: [], value: ''
                }
            },
            facturaObject: null,
            factura: null,
            fecha: new Date(),
            descripcion:''
        },
        options: {
            clientes: [],
            proyectos: [],
            cuentas: [],
            empresa: '',
            area: '',
            subareas: [],
            impuestos: [],
            pagos: [],
            estatus: []
        },
        response: {}
    }

    componentDidMount = () => {
        this.getOptions()
    }

    getOptions = async() => {
        const { solicitud, at } = this.props
        apiOptions(`v1/administracion/solicitud-factura/${solicitud.id}`, at).then(
            (response) => {
                const { clientes, empresa, area, tipoImpuestos, tipoPagos, estatusCompras } = response.data
                const { options, form } = this.state
                options.clientes = setOptions(clientes, 'empresa', 'id')
                if(clientes.length === 1){
                    options.proyectos = setOptions(clientes[0].proyectos, 'nombre', 'id')
                    if(clientes[0].proyectos.length === 1){
                        form.proyecto = clientes[0].proyectos[0].id.toString()
                    }
                    form.cliente = clientes[0].id.toString()
                }
                options.cuentas = setOptions(empresa.cuentas, 'nombre', 'id')
                form.empresa = empresa.id
                options.empresa = empresa
                options.subareas = setOptions(area.subareas, 'nombre', 'id')
                options.area = area
                form.area = area.id
                options.pagos = setOptions(tipoPagos, 'tipo', 'id')
                options.impuestos = setOptions(tipoImpuestos, 'tipo', 'id')
                options.estatus = setOptions(estatusCompras, 'estatus', 'id')
                this.setState({ ...this.state, options, form, response: response.data })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch(( error ) => { catchErrors(error) })
    }

    checkFactura = async(obj) => {
        const { at } = this.props
        apiPutForm(`v2/administracion/facturas`, obj, at).then(
            (response) => {
                const { factura } = response.data
                const { form } = this.state
                form.factura = factura
                this.setState({ ...this.state, form })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch(( error ) => { catchErrors(error) })
    }

    uploadFacturaFiles = async() => {
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

    addNewFacturaAxios = async(archivos) => {
        const { at } = this.props
        const { form } = this.state
        apiPostForm(`v2/administracion/facturas`, {
                facturaObject: form.facturaObject,
                archivos: archivos
            }, at).then( (response) => {
                const { factura } = response.data
                form.factura = factura
                this.setState({ ...this.state, form })
                this.addVentaAxios([])
            }, (error) => {  printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    addVentaAxios = async() => {
        const { at, solicitud } = this.props
        const { form } = this.state
        apiPostForm(`v1/administracion/solicitud-factura/${solicitud.id}/venta`, form, at).then( (response) => {
                const { factura } = response.data
                form.factura = factura
                this.setState({ ...this.state, form })
                this.addVentaAxios([])
            }, (error) => {  printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    onSubmit = async() => {
        const { form } = this.state
        if(form.factura !== '' && form.factura !== null){
            this.addVentaAxios()
        }else{
            this.uploadFacturaFiles()
        }
    }

    onChangeFactura = (e) => {
        waitAlert()
        const { files, value, name } = e.target
        const { form } = this.state
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
                const { solicitud } = this.props
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
                if(obj.rfc_receptor !== solicitud.rfc_receptor){
                    errores.push('El RFC del receptor no coincide con la solicitud.')
                }
                if(obj.rfc_emisor !== solicitud.rfc_emisor){
                    errores.push('El RFC del emisir no coincide con la solicitud.')
                }
                let resta = parseFloat(obj.total) - parseFloat(solicitud.monto)
                if( resta < -1 || resta > 1 ){
                    errores.push('El monto no coincide con la solicitud')
                }
                if(errores.length){
                    let textError = ''    
                    errores.forEach((mistake, index) => {
                        if(index){
                            textError += '\\n'
                        }
                        textError += mistake
                    })
                    Swal.close()
                    form.facturaObject = {}
                    form.factura = ''
                    form.adjuntos.xml.files = []
                    form.adjuntos.xml.value = ''
                    this.setState({ ...this.state, form })
                    errorAlert(textError)
                }else{
                    form.facturaObject = obj
                    this.setState({ ...this.state, form })
                    this.checkFactura(obj)
                    Swal.close()
                }
            }else{ 
                Swal.close()
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

    updateSelect = ( value, name) => {
        if (value === null) {
            value = []
        }
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
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
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    render(){
        const { form, options } = this.state
        console.log(form, 'form')
        return(
            <Form 
                id = 'form-ventas-solicitud-factura'
                onSubmit = { (e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-ventas-solicitud-factura') } }>
                <div className = 'row mx-0 mt-5'>
                    <Col md="4" className="text-center align-self-center">
                        <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                            <label className="text-center font-weight-bolder">Fecha</label>
                        </div>
                        <CalendarDay value={form.fecha} name='fecha' onChange={this.onChange} date={form.fecha} withformgroup={1} requirevalidation={1}/>
                    </Col>
                    <Col md="8" className="align-self-center">
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-4">
                                <ReactSelectSearchGray placeholder = 'SELECCIONA LA CUENTA' defaultvalue = { form.cuenta } iconclass = 'las la-credit-card icon-xl' requirevalidation={1}
                                options = { transformOptions(options.cuentas) } onChange = { ( value ) => this.updateSelect(value, 'cuenta') } messageinc = 'Selecciona la cuenta.'/>
                            </div>
                            <div className="col-md-4">
                                <ReactSelectSearchGray placeholder = 'SELECCIONA LA SUBÁREA' defaultvalue = { form.subarea } iconclass = 'las la-tools icon-xl' requirevalidation={1}
                                options = { transformOptions(options.subareas) } onChange = { ( value ) => this.updateSelect(value, 'subarea') } messageinc = 'Selecciona la subarea.'/>
                            </div>
                            <div className="col-md-4">
                                <ReactSelectSearchGray placeholder = 'SELECCIONA EL TIPO DE PAGO' defaultvalue = { form.pago } iconclass = 'las la-coins icon-xl' requirevalidation={1}
                                options = { transformOptions(options.pagos) } onChange = { ( value ) => this.updateSelect(value, 'pago') } messageinc = 'Selecciona el tipo de pago.'/>
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-6">
                                <ReactSelectSearchGray placeholder = 'SELECCIONA EL TIPO DE IMPUESTO' defaultvalue = { form.impuesto } iconclass = 'las la-file-invoice-dollar icon-xl' requirevalidation={1}
                                options = { transformOptions(options.impuestos) } onChange = { ( value ) => this.updateSelect(value, 'impuesto') } messageinc = 'Selecciona el tpo de impuestos.'/>
                            </div>
                            <div className="col-md-6">
                                <ReactSelectSearchGray placeholder = 'SELECCIONA EL ESTATUS DE COMPRA' defaultvalue = { form.estatus } iconclass = 'las la-check-circle icon-xl' requirevalidation={1}
                                options = { transformOptions(options.estatus) } onChange = { ( value ) => this.updateSelect(value, 'estatus') } messageinc = 'Selecciona el estatus de compra.'/>
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12">
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={0}
                                    withformgroup={0} requirevalidation={0} as='textarea' name='descripcion' customclass="px-2 text-justify"
                                    placeholder='DESCRIPCIÓN'onChange={this.onChange} value={form.descripcion} rows='2' messageinc="Ingresa una descripción." />
                            </div>
                        </div>
                    </Col>
                    <div className="col-md-12">
                        <div className="separator separator-dashed my-3" />
                    </div>
                    <Col md="12">
                        <div className="mb-4 row form-group-marginless text-center">
                            <div className="col-md-4 align-self-center">
                                <label className="col-form-label font-weight-bold text-dark-60">XML DE LA FACTURA</label>
                                <br />
                                <FileInput requirevalidation = { 1 } formeditado = { 0 } onChangeAdjunto = { this.onChangeFactura }
                                    placeholder = 'Factura XML' value = { form.adjuntos.xml.value } name = 'xml' id = 'xml' classinput = 'file-input'
                                    accept = 'text/xml' files = { form.adjuntos.xml.files } false iconclass='flaticon2-clip-symbol text-primary'
                                    classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0'
                                    messageinc = 'Agrega el XML de la factura' deleteAdjunto = { this.clearFiles }/>
                            </div>
                            <div className="col-md-4 align-self-center">
                                <label className="col-form-label font-weight-bold text-dark-60">PDF DE LA FACTURA</label>
                                <br />
                                <FileInput requirevalidation = { 0 } formeditado = { 0 } onChangeAdjunto = { this.onChangeAdjunto }
                                    placeholder = 'Factura PDF' value = { form.adjuntos.pdf.value } name = 'pdf' id = 'pdf' classinput = 'file-input'
                                    accept = 'application/pdf' files = { form.adjuntos.pdf.files } false iconclass='flaticon2-clip-symbol text-primary'
                                    classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0' 
                                    deleteAdjunto = { this.clearFiles } />
                            </div>
                            <div className="col-md-4 align-self-center">
                                <label className="col-form-label font-weight-bold text-dark-60">PAGO</label>
                                <br />
                                <FileInput requirevalidation = { 1 } formeditado = { 0 } onChangeAdjunto = { this.onChangeAdjunto }
                                    placeholder = 'PAGO' value = { form.adjuntos.pagos.value } name = 'pagos' id = 'pagos' classinput = 'file-input'
                                    accept = '*/*' files = { form.adjuntos.pagos.files } false iconclass='flaticon2-clip-symbol text-primary'
                                    classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0' 
                                    multiple deleteAdjunto = { this.clearFiles }/>
                            </div>
                        </div>
                    </Col>
                </div>
                <div className="d-flex justify-content-end border-top mt-3 pt-3">
                    <div>
                        <Button icon='' className="btn btn-primary font-weight-bold text-uppercase"
                            type = 'submit'
                            /* onClick = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-ventas-solicitud-factura')
                                }
                            } */
                            
                            text="ENVIAR" />
                    </div>
                </div>
            </Form>
            
        )
    }
}

export default FormVentasSolicitudFactura