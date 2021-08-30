import React, { Component } from 'react'
import { Card, Form, OverlayTrigger, Tooltip, Col, Row } from 'react-bootstrap';
import { InputMoneyGray, InputGray, SelectSearchGray, Button, CalendarDay, FileInput } from '../../form-components';
import { Modal } from '../../singles';
import { RFC, URL_DEV } from '../../../constants'
import { errorAlert, waitAlert, validateAlert, deleteAlert, printResponseErrorAlert, doneAlert } from '../../../functions/alert'
import { setMoneyTableSinSmall } from '../../../functions/setters'
import Swal from 'sweetalert2'
import axios from 'axios'
import { setSingleHeader } from '../../../functions/routers';
import S3 from 'react-aws-s3';
export default class SolicitudFacturacionTabla extends Component{

    state = {
        id: '',
        modal: {
            factura: false,
            venta:false
        },
        form: {
            rfc_receptor: '',
            razon_social_receptor: '',
            concepto: '',
            monto: 0.0,
            forma_pago: '',
            metodo_pago: '',
            estatus_factura: '',
            tipo_pago: 0,
            cuenta:'',
            cliente:'',
            tipo_impuesto:0,
            estatus_compra:0,
            descripcion:'',
            fecha: new Date(),
            adjuntos: {
                factura: {
                    value: '',
                    placeholder: 'Factura',
                    files: []
                },
                pago: {
                    value: '',
                    placeholder: 'Pago',
                    files: []
                }
            }
        }
    }

    openModal = e => {
        const { form, modal } = this.state
        const { ticket } = this.props
        form.estatus_factura = '1'
        form.rfc_receptor = ''
        form.razon_social_receptor = ''
        form.concepto = ''
        form.forma_pago = ''
        form.metodo_pago = ''
        form.tipo_pago = ''
        if(ticket)
            if(ticket.presupuesto_preeliminar)
                form.monto = ticket.presupuesto_preeliminar.totalPresupuesto
        modal.factura = true
        this.setState({ ...this.state, modal })
    }

    openModalGenerarVenta = (id) => {
        const { modal } = this.state
        modal.venta = true
        this.setState({ ...this.state, modal, id: id })
    }

    handleClose = () => {
        const { modal } = this.state
        modal.factura = false
        this.setState({ ...this.state, modal, form: this.clearForm()  })
    }

    handleCloseGenerarVenta = () => {
        const { modal } = this.state
        modal.venta = false
        this.setState({ ...this.state, modal, form: this.clearForm()  })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'tipo_impuesto':
                case 'tipo_pago':
                case 'estatus_compra':
                    form[element] = 0
                    break;
                case 'fecha':
                    form[element] = new Date()
                    break;
                case 'adjuntos':
                    form[element] = {
                        factura: {
                            value: '',
                            placeholder: 'Factura',
                            files: []
                        },
                        pago: {
                            value: '',
                            placeholder: 'Pago',
                            files: []
                        }
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({...this.state, form})
    }

    updateConcepto = value => { this.onChange({ target: { value: value, name: 'concepto' } }) } 
    updateFormaPago= value => { this.onChange({ target: { value: value, name: 'forma_pago' } }) }
    updateTipoPago = value => { this.onChange({ target: { value: value, name: 'tipo_pago' } }) }
    updateMetodoPago = value => { this.onChange({ target: { value: value, name: 'metodo_pago' } }) }
    updateEstatusFactura = value => { this.onChange({ target: { value: value, name: 'estatus_factura' } }) }
    updateCliente = value => { this.onChange({ target: { value: value, name: 'cliente' } }) }
    updateCuenta = value => { this.onChange({ target: { value: value, name: 'cuenta' } }) }
    updateTipoImpuesto = value => { this.onChange({ target: { value: value, name: 'tipo_impuesto' } }) }
    updateEstatusCompra = value => { this.onChange({ target: { value: value, name: 'estatus_compra' } }) }

    printEmptyTable = columns => {
        return(
            <tr className = 'text-center'>
                <td colSpan = { columns }  className="text-dark-50 font-weight-light font-size-md">
                    <b>No hay solicitudes de factura</b>
                </td>
            </tr>
        )
    }

    onChangeAdjunto = e => {
        const { form } = this.state
        const { options } = this.props
        const { files, value, name } = e.target
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            if (name === 'factura') {
                let extension = files[counter].name.slice((Math.max(0, files[counter].name.lastIndexOf(".")) || Infinity) + 1);
                if (extension.toUpperCase() === 'XML') {
                    waitAlert()
                    const reader = new FileReader()
                    reader.onload = async (e) => {
                        const text = (e.target.result)
                        var XMLParser = require('react-xml-parser');
                        var xml = new XMLParser().parseFromString(text);
                        const emisor = xml.getElementsByTagName('cfdi:Emisor')[0]
                        const receptor = xml.getElementsByTagName('cfdi:Receptor')[0]
                        const timbreFiscalDigital = xml.getElementsByTagName('tfd:TimbreFiscalDigital')[0]
                        const concepto = xml.getElementsByTagName('cfdi:Concepto')[0]
                        let relacionados = xml.getElementsByTagName('cfdi:CfdiRelacionados')
                        let obj = {
                            rfc_receptor: receptor.attributes.Rfc ? receptor.attributes.Rfc : '',
                            nombre_receptor: receptor.attributes.Nombre ? receptor.attributes.Nombre : '',
                            uso_cfdi: receptor.attributes.UsoCFDI ? receptor.attributes.UsoCFDI : '',
                            rfc_emisor: emisor.attributes.Rfc ? emisor.attributes.Rfc : '',
                            nombre_emisor: emisor.attributes.Nombre ? emisor.attributes.Nombre : '',
                            regimen_fiscal: emisor.attributes.RegimenFiscal ? emisor.attributes.RegimenFiscal : '',
                            lugar_expedicion: xml.attributes.LugarExpedicion ? xml.attributes.LugarExpedicion : '',
                            fecha: xml.attributes.Fecha ? new Date(xml.attributes.Fecha) : '',
                            metodo_pago: xml.attributes.MetodoPago ? xml.attributes.MetodoPago : '',
                            tipo_de_comprobante: xml.attributes.TipoDeComprobante ? xml.attributes.TipoDeComprobante : '',
                            total: xml.attributes.Total ? xml.attributes.Total : '',
                            subtotal: xml.attributes.SubTotal ? xml.attributes.SubTotal : '',
                            tipo_cambio: xml.attributes.TipoCambio ? xml.attributes.TipoCambio : '',
                            moneda: xml.attributes.Moneda ? xml.attributes.Moneda : '',
                            numero_certificado: timbreFiscalDigital.attributes.UUID ? timbreFiscalDigital.attributes.UUID : '',
                            descripcion: concepto.attributes.Descripcion,
                            folio: xml.attributes.Folio ? xml.attributes.Folio : '',
                            serie: xml.attributes.Serie ? xml.attributes.Serie : '',
                        }
                        let tipoRelacion = ''
                        if (relacionados) {
                            if (relacionados.length) {
                                relacionados = relacionados[0]
                                tipoRelacion = relacionados.attributes.TipoRelacion
                                let uuidRelacionado = xml.getElementsByTagName('cfdi:CfdiRelacionado')[0]
                                uuidRelacionado = uuidRelacionado.attributes.UUID
                                obj.tipo_relacion = tipoRelacion
                                obj.uuid_relacionado = uuidRelacionado
                            }
                        }
                        if (obj.numero_certificado === '') {
                            let NoCertificado = text.search('NoCertificado="')
                            if (NoCertificado)
                                obj.numero_certificado = text.substring(NoCertificado + 15, NoCertificado + 35)
                        }
                        let aux = ''
                        if (obj.subtotal === '') {
                            let Subtotal = text.search('SubTotal="')
                            if (Subtotal)
                                Subtotal = text.substring(Subtotal + 10)
                            aux = Subtotal.search('"')
                            Subtotal = Subtotal.substring(0, aux)
                            obj.subtotal = Subtotal
                        }
                        aux = ''
                        if (obj.total === '') {
                            let Total = text.search('Total="')
                            if (Total)
                                Total = text.substring(Total + 7)
                            aux = Total.search('"')
                            Total = Total.substring(0, aux)
                            obj.total = Total
                        }
                        if (obj.fecha === '') {
                            let Fecha = text.search('Fecha="')
                            if (Fecha)
                                Fecha = text.substring(Fecha + 7)
                            aux = Fecha.search('"')
                            Fecha = Fecha.substring(0, aux)
                            obj.fecha = Fecha
                        }
                        let newCliente = options.clientes.find((cliente) => {
                            return cliente.rfc === obj.rfc_receptor
                        })
                        if(newCliente)
                            form.cliente = newCliente.value
                        form.facturaObject = obj
                        Swal.close()
                        this.setState({ ...this.state, options, form })
                    }
                    reader.readAsText(files[counter])
                }
            }
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form['adjuntos'][name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form['adjuntos'][name].files[counter])
            }
        }
        if (aux.length < 1) {
            form['adjuntos'][name].value = ''
            if (name === 'factura')
                form['facturaObject'] = ''
        }
        form['adjuntos'][name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }

    onSubmit = e => {
        const { onSubmit } = this.props
        const { form, modal } = this.state
        modal.factura = false
        let arreglo = []
        arreglo.push(
            new Promise((resolve, reject) => {
                onSubmit(form).then(function () {
                    resolve()
                }).catch(function (error) { });
            })
        )
        Promise.all(arreglo).then(values => { this.setState({ ...this.state, modal }) }).catch(err => console.error(err))
    }

    onSubmitGenerarVenta = async() => {
        const { at } = this.props
        const { form } = this.state
        waitAlert()
        await axios.put(`${URL_DEV}v2/administracion/facturas`, form.facturaObject, 
            { headers: setSingleHeader(at) }).then(
            (response) => {
                const { factura } = response.data
                if(factura)
                    this.addNewVentaAxios(factura)
                else
                    this.submitFacturaAxios()
            }, (error) => {  printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    addNewVentaAxios = async(factura) => {
        const { at, ticket, getSolicitudes } = this.props
        let { form, id, modal } = this.state
        waitAlert()
        await axios.post(`${URL_DEV}v3/calidad/tickets/${ticket.id}/solicitud-factura/${id}/venta/${factura.id}`, form, 
            { headers: setSingleHeader(at) }).then(
            async (response) => {
                const { venta } = response.data
                modal.venta = false
                this.setState({...this.state, modal})
                if(form.adjuntos.pago.files.length){
                    await axios.get(`${URL_DEV}v1/constant/admin-proyectos`, { headers: setSingleHeader(at) }).then(
                        (response) => {
                            const { alma } = response.data
                            let filePath = `ventas/${venta.id}/pagos/`
                            let auxPromises  = form.adjuntos.pago.files.map((file) => {
                                return new Promise((resolve, reject) => {
                                    new S3(alma).uploadFile(file.file, `${filePath}${Math.floor(Date.now() / 1000)}-${file.name}`)
                                        .then((data) =>{
                                            const { location,status } = data
                                            if(status === 204) resolve({ name: file.name, url: location })
                                            else reject(data)
                                        }).catch(err => reject(err))
                                })
                            })
                            Promise.all(auxPromises).then(values => { this.addPagoAxios(values, venta.id)}).catch(err => console.error(err))
                        }, (error) => { printResponseErrorAlert(error) }
                    ).catch((error) => {
                        errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                        console.error(error, 'error')
                    })
                }
                doneAlert(`Venta generada con éxito`,  () => { getSolicitudes('facturacion') } )
            }, (error) => {  printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    addPagoAxios = async(files, id) => {
        const { at } = this.props
        let form = {}
        form.archivos = files
        form.type = 'pago'
        await axios.post(`${URL_DEV}v2/proyectos/ventas/${id}/adjuntos-url`, form, 
            { headers: setSingleHeader(at) }).then(
            (response) => {
            }, (error) => {  printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    submitFacturaAxios = async() => {
        const { form } = this.state
        const { at } = this.props
        await axios.get(`${URL_DEV}v1/constant/admin-proyectos`, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { alma } = response.data
                let filePath = `facturas/ventas/`
                let auxPromises  = form.adjuntos.factura.files.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file.file, `${filePath}${Math.floor(Date.now() / 1000)}-${file.name}`)
                            .then((data) =>{
                                const { location,status } = data
                                if(status === 204) resolve({ name: file.name, url: location })
                                else reject(data)
                            }).catch(err => reject(err))
                    })
                })
                Promise.all(auxPromises).then(values => { this.addNewFacturaAxios(values)}).catch(err => console.error(err))        
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    addNewFacturaAxios = async(files) => {
        const { form } = this.state
        const { at } = this.props
        form.archivos = files
        await axios.post(`${URL_DEV}v2/administracion/facturas`, form, 
            { headers: setSingleHeader(at) }).then(
            (response) => {
                const { factura } = response.data
                this.addNewVentaAxios(factura)
            }, (error) => {  printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    render(){
        const { modal, form } = this.state
        const { options, solicitudes, deleteSolicitud } = this.props
        return(
            <div>
                <Card className="card-custom gutter-b card-stretch">
                    <Card.Header className = 'border-0 pt-8 pt-md-0'>
                        <Card.Title className = 'm-0'>
                            <div className="font-weight-bold font-size-h5">
                                Listado de solicitudes de facturación
                            </div>
                        </Card.Title>
                        <div className="card-toolbar">
                            <button type="button" className="btn btn-sm btn-bg-light btn-icon-info btn-hover-light-info btn-text-solicitud font-weight-bolder font-size-13px" 
                                onClick = { this.openModal }>
                                <i className="las la-file-invoice-dollar icon-xl mr-2 px-0" /> SOLICITAR FACTURA
                            </button>
                        </div>
                    </Card.Header>
                    <Card.Body className = 'p-9 pt-0'>
                        <div className="table-responsive">
                            <table className="table table-vertical-center table-sol-fact box-shadow-53">
                                <thead>
                                    <tr className="font-weight-bolder text-center white-space-nowrap">
                                        <th></th>
                                        <th>Emisor</th>
                                        <th>Receptor</th>
                                        <th>Concepto</th>
                                        <th>Monto</th>
                                        <th>Tipo de <br/> pago</th>
                                        <th>Forma de <br/> pago</th>
                                        <th>Método de <br/> pago</th>
                                        <th>Estatus de <br/> facturación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        solicitudes ?
                                            solicitudes.length === 0 ?
                                                    this.printEmptyTable(9)
                                                :
                                                solicitudes.map((sol, index) => {
                                                    return (
                                                        <tr key={index} className="font-weight-light">
                                                            <td className='text-center'>
                                                                {
                                                                    sol.venta ?
                                                                        'Venta realizada'
                                                                        :
                                                                        <div className="white-space-nowrap">
                                                                            <OverlayTrigger overlay={<Tooltip><span className='font-weight-bolder'>ELIMINAR</span></Tooltip>}>
                                                                                <div className="btn btn-icon btn-sm btn-bg-white btn-text-solicitud btn-hover-light-danger btn-circle mr-2"
                                                                                        onClick = { (e) => { e.preventDefault(); 
                                                                                        deleteAlert('¿ESTÁS SEGURO QUE DESEAS ELIMINAR LA SOLICITUD?', '¡NO PODRÁS REVERTIR ESTO!', () => deleteSolicitud(sol.id)) } } >
                                                                                    <i className="las la-trash-alt icon-xl " />
                                                                                </div>
                                                                            </OverlayTrigger>
                                                                            <OverlayTrigger overlay={<Tooltip><span className='font-weight-bolder'>ADJUNTAR FACTURA</span></Tooltip>}>
                                                                                <span className="btn btn-icon btn-sm btn-bg-white btn-text-solicitud btn-hover-light-info btn-circle" 
                                                                                    onClick = { () => { this.openModalGenerarVenta(sol.id) }}>
                                                                                    <i className="las la-file-invoice-dollar icon-lg"></i>
                                                                                </span>
                                                                            </OverlayTrigger>
                                                                        </div>
                                                                }
                                                            </td>
                                                            <td className='text-center'>
                                                                <div>
                                                                    {sol.razon_social_emisor}
                                                                    <div className="font-weight-bold text-dark-75">{sol.rfc_emisor}</div>
                                                                </div>
                                                            </td>
                                                            <td className='text-center'>
                                                                <div>
                                                                    {sol.razon_social_receptor}
                                                                    <div className="font-weight-bold text-dark-75">{sol.rfc_receptor}</div>
                                                                </div>
                                                            </td>
                                                            <td className='text-center'>
                                                                {sol.concepto ? sol.concepto.concepto : '-'}
                                                            </td>
                                                            <td className='text-center'>
                                                                { setMoneyTableSinSmall(sol.monto) }
                                                            </td>
                                                            <td className='text-center'>
                                                                {sol.tipo_pago ? sol.tipo_pago.tipo : '-'}
                                                            </td>
                                                            <td className='text-center'>
                                                                {sol.forma_pago ? sol.forma_pago.nombre : '-'}
                                                            </td>
                                                            <td className='text-center'>
                                                                {sol.metodo_pago ? sol.metodo_pago.nombre : ''}
                                                            </td>
                                                            <td className='text-center'>
                                                                {sol.estatus_factura ? sol.estatus_factura.estatus : ''}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                        : this.printEmptyTable(9)
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                </Card>
                <Modal size = 'xl' show = { modal.factura } title = 'Nueva solicitud de factura' handleClose = { this.handleClose } >
                    <Form onSubmit={(e) => { e.preventDefault(); this.onSubmit(form) }}>
                        <Row className="form-group mx-0 form-group-marginless mt-5">
                            <Col md="4">
                                <InputGray
                                    withtaglabel = { 1 }
                                    withtextlabel = { 1 }
                                    withplaceholder = { 1 }
                                    withicon = { 1 }
                                    withformgroup = { 0 }
                                    requirevalidation={1}
                                    formeditado={0}
                                    placeholder="RFC DEL CLIENTE"
                                    value={form.rfc_receptor}
                                    name="rfc_receptor"
                                    onChange={this.onChange}
                                    iconclass="far fa-file-alt"
                                    patterns={RFC}
                                    messageinc="Incorrecto. Ej. ABCD001122ABC."
                                    maxLength="13"
                                />
                            </Col>
                            <Col md="4">
                                <InputGray
                                    withtaglabel = { 1 }
                                    withtextlabel = { 1 }
                                    withplaceholder = { 1 }
                                    withicon = { 1 }
                                    withformgroup = { 0 }
                                    requirevalidation={1}
                                    formeditado={0}
                                    placeholder="RAZÓN SOCIAL DEL CLIENTE"
                                    value={form.razon_social_receptor}
                                    name="razon_social_receptor"
                                    onChange={this.onChange}
                                    iconclass="far fa-file-alt"
                                    messageinc="Incorrecto. Ingresa la razón social."
                                />
                            </Col>
                            <Col md="4">
                                <SelectSearchGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withicon = { 1 }
                                    customdiv="mb-0"
                                    formeditado={0}
                                    options={options.conceptos}
                                    placeholder="CONCEPTO"
                                    name="concepto"
                                    value={form.concepto}
                                    onChange={this.updateConcepto}
                                    messageinc="Incorrecto. Selecciona el concepto."
                                />
                            </Col>
                        </Row>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <Row className="form-group mx-0 form-group-marginless">
                            <Col md="4">
                                <SelectSearchGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withicon = { 1 }
                                    customdiv="mb-0"
                                    formeditado={0}
                                    options={options.formasPago}
                                    placeholder="FORMA DE PAGO"
                                    name="forma_pago"
                                    value={form.forma_pago}
                                    onChange={this.updateFormaPago}
                                    messageinc="Incorrecto. Selecciona la forma de pago."
                                />
                            </Col>
                            <Col md="4">
                                <SelectSearchGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withicon = { 1 }
                                    customdiv="mb-0"
                                    formeditado={0}
                                    options={options.metodosPago}
                                    placeholder="MÉTODO DE PAGO"
                                    name="metodo_pago"
                                    value={form.metodo_pago}
                                    onChange={this.updateMetodoPago}
                                    messageinc="Incorrecto. Selecciona el método de pago."
                                />
                            </Col>
                            <Col md="4">
                                <SelectSearchGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withicon = { 1 }
                                    customdiv="mb-0"
                                    formeditado={0}
                                    options={options.tiposPagos}
                                    placeholder="TIPOS DE PAGO"
                                    name="tipo_pago"
                                    value={form.tipo_pago}
                                    onChange={this.updateTipoPago}
                                    messageinc="Incorrecto. Selecciona el tipo de pago."
                                />
                            </Col>
                        </Row>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <Row className="form-group mx-0 form-group-marginless">
                            <Col  md="4">
                                <SelectSearchGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withicon = { 1 }
                                    customdiv="mb-0"
                                    formeditado={0}
                                    options={options.estatusFacturas}
                                    placeholder="ESTATUS DE FACTURA"
                                    name="estatus_factura"
                                    value={form.estatus_factura}
                                    onChange={this.updateEstatusFactura}
                                    messageinc="Incorrecto. Selecciona el estatus de la factura."
                                />
                            </Col>
                            <Col md="4">
                                <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 } 
                                    withformgroup = { 0 } requirevalidation = { 0 } formeditado = { 0 } thousandseparator = { true } 
                                    prefix = '$' name = "monto" value = { form.monto } onChange = { this.onChange } placeholder = "MONTO CON IVA"/>
                            </Col>
                        </Row>
                        <div className="card-footer pt-3 pb-0 px-0 text-right">
                            <Button icon='' className="btn btn-primary" text="ENVIAR" type='submit' />
                        </div>
                    </Form>
                </Modal>
                <Modal size = 'xl' show = { modal.venta } title = 'ADJUNTAR FACTURA' handleClose = { this.handleCloseGenerarVenta } >
                    <Form id="form-generar-factura" onSubmit={ (e) => { e.preventDefault(); validateAlert(this.onSubmitGenerarVenta, e, 'form-generar-factura') } } >  
                        <Row className="form-group mx-0 form-group-marginless mt-5">
                            <Col md="4" className="text-center align-self-center">
                                <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                    <label className="text-center font-weight-bolder text-dark-60 ">Fecha de entrega</label>
                                </div>
                                <CalendarDay date = { form.fecha } onChange = { this.onChange } name='fecha' requirevalidation={1}/>
                            </Col>
                            <Col md="8" className="align-self-center">
                                <div className="row form-group-marginless">
                                    <div className="col-md-6">
                                        <SelectSearchGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withicon={1}
                                            customdiv="mb-0"
                                            iconclass="far fa-credit-card"
                                            formeditado={0}
                                            options={options.clientes}
                                            placeholder="SELECCIONA EL CLIENTE"
                                            name="cliente"
                                            value={form.cliente}
                                            onChange={this.updateCliente}
                                            messageinc="Incorrecto. Selecciona el cliente."
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <SelectSearchGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withicon={1}
                                            customdiv="mb-0"
                                            iconclass="far fa-credit-card"
                                            formeditado={0}
                                            options={options.cuentas}
                                            placeholder="SELECCIONA LA CUENTA"
                                            name="cuenta"
                                            value={form.cuenta}
                                            onChange={this.updateCuenta}
                                            messageinc="Incorrecto. Selecciona la cuenta."
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-5 mb-2"></div>
                                <div className="row form-group-marginless">
                                    <div className="col-md-6">
                                        <SelectSearchGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withicon = { 1 }
                                            customdiv="mb-0"
                                            formeditado={0}
                                            options={options.tiposImpuestos}
                                            placeholder="SELECCIONA EL IMPUESTO"
                                            name="tipo_impuesto"
                                            value={form.tipo_impuesto}
                                            onChange={this.updateTipoImpuesto}
                                            messageinc="Incorrecto. Selecciona el tipo de impuesto."
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <SelectSearchGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withicon = { 1 }
                                            customdiv="mb-0"
                                            formeditado={0}
                                            options={options.estatusCompras}
                                            placeholder="SELECCIONA EL ESTATUS DE COMPRA"
                                            name="estatus_compra"
                                            value={form.estatus_compra}
                                            onChange={this.updateEstatusCompra}
                                            messageinc="Incorrecto. Selecciona el estatus de compra."
                                        />
                                    </div>
                                    <div className="col-md-12"><div className="separator separator-dashed mt-5 mb-2"></div></div>
                                    <div className="col-md-12">
                                        <InputGray
                                            withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 }
                                            withformgroup = { 0 } formeditado = { 0 } requirevalidation = { 0 } as = 'textarea'
                                            name = 'descripcion' placeholder = 'DESCRIPCIÓN' rows = '4' onChange = { this.onChange } 
                                            value = { form.descripcion } messageinc = "Incorrecto. Ingresa una descripción." />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="separator separator-dashed mt-1 mb-5"></div>
                        <Row className="mx-0 mb-5">
                            <Col md="6" className="align-self-center text-center">
                                <FileInput
                                    requirevalidation={1}
                                    formeditado={0}
                                    onChangeAdjunto={this.onChangeAdjunto}
                                    placeholder={form.adjuntos.factura.placeholder}
                                    value={form.adjuntos.factura.value}
                                    name='factura'
                                    id='factura'
                                    accept="text/xml, application/pdf"
                                    files={form.adjuntos.factura.files}
                                    deleteAdjunto={this.clearFiles} multiple
                                    classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0'
                                    iconclass='flaticon2-clip-symbol text-primary'
                                    messageinc="Adjunta la factura"
                                />
                            </Col>
                            <Col md="6" className="text-center">
                                <FileInput
                                    requirevalidation={0}
                                    formeditado={0}
                                    onChangeAdjunto={this.onChangeAdjunto}
                                    placeholder={form.adjuntos.pago.placeholder}
                                    value={form.adjuntos.pago.value}
                                    name='pago' id='pago'
                                    files={form.adjuntos.pago.files}  
                                    deleteAdjunto={this.clearFiles}
                                    classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0'
                                    iconclass='flaticon2-clip-symbol text-primary'
                                />
                            </Col>
                        </Row>
                        <div className="card-footer pt-3 pb-0 px-0 text-right">
                            <Button icon='' className="btn btn-primary"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(this.onSubmitGenerarVenta, e, 'form-generar-factura')
                                    }
                                }
                                text="ENVIAR" />
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
}