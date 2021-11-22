import React, { Component } from 'react'
import $ from 'jquery'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { Tab, Tabs } from 'react-bootstrap'
import { Update } from '../../../components/Lottie'
import { Modal } from '../../../components/singles'
import { VentasCard } from '../../../components/cards'
import Layout from '../../../components/layout/layout'
import { NewTable } from '../../../components/NewTables'
import { FacturaTable } from '../../../components/tables'
import { VentasFilters } from '../../../components/filters'
import { URL_DEV, VENTAS_COLUMNS } from '../../../constants'
import { printSwalHeader } from '../../../functions/printers'
import { Dropdown, DropdownButton, Form } from 'react-bootstrap'
import { FacturaForm, AdjuntosForm, FacturaExtranjera } from '../../../components/forms'
import { apiOptions, apiGet, apiDelete, apiPostFormData, apiPostForm, apiPutForm, catchErrors, apiPostFormResponseBlob } from '../../../functions/api'
import { Button, FileInput, InputGray, CalendarDaySwal, SelectSearchGray, DoubleSelectSearchGray, Select } from '../../../components/form-components'
import { waitAlert, errorAlert, createAlert, printResponseErrorAlert, deleteAlert, doneAlert, errorAlertRedirectOnDissmis, createAlertSA2WithActionOnClose, 
    customInputAlert } from '../../../functions/alert'
import { setOptions, setSelectOptions, setDateTableReactDom, setMoneyTable, setArrayTable, setTextTableCenter, setTextTableReactDom, 
    setCustomeDescripcionReactDom, setNaviIcon, setOptionsWithLabel } from '../../../functions/setters'
class VentasNew extends Component {
    state = {
        modal:{
            filters: false,
            facturas: false,
            adjuntos: false,
            facturaExtranjera: false,
            see: false
        },
        active: 'facturas',
        solicitud: '',
        porcentaje: 0,
        title: 'Nueva venta',
        ventas: [],
        facturas: [],
        adjuntos: [],
        venta: '',
        options: {
            empresas: [],
            cuentas: [],
            areas: [],
            subareas: [],
            clientes: [],
            proyectos: [],
            formasPago: [],
            metodosPago: [],
            estatusFacturas: [],
            contratos: []
        },
        data: {
            clientes: [],
            empresas: [],
            cuentas: [],
            proyectos: [],
            ventas: [],
            adjuntos: []
        },
        formeditado: 0,
        form: {
            solicitud: '',
            factura: 'Sin factura',
            facturaObject: '',
            rfc: '',
            total: '',
            cliente: '',
            proyecto: '',
            empresa: '',
            cuenta: '',
            area: '',
            subarea: '',
            contrato: '',
            //Factura
            formaPago: '',
            metodoPago: '',
            estatusFactura: '',
            concepto: '',
            email: '',
            //Fin factura
            tipoImpuesto: 0,
            tipoPago: 0,
            estatusCompra: 0,
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
                },
                presupuesto: {
                    value: '',
                    placeholder: 'Presupuesto',
                    files: []
                },
                facturas_pdf: {
                    value: '',
                    placeholder: 'Facturas extranjeras',
                    files: []
                }
            }
        },
        formFacturaExtranjera:{
            adjuntos: {
                factura: {
                    value: '',
                    placeholder: 'Factura extranjera',
                    files: []
                },
            }
        },
        key: 'all',
        filters: {},
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const ventas = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!ventas)
            history.push('/')
        this.getOptionsAxios()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                const { modal, key } = this.state
                modal.see = true
                this.setState({ ...this.state, modal })
                this.getVentaAxios(id)
                setTimeout(() => {
                    $(`#ventas_${key}`).DataTable().column(1).search(id, false, false).ajax.reload();
                }, 1000);
            }
        }
    }
    getOptionsAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiOptions(`v2/proyectos/ventas`, access_token).then(
            (response) => {
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras,
                    clientes, metodosPago, formasPago, estatusFacturas, proyectos } = response.data
                const { options, data } = this.state
                options['empresas'] = setOptionsWithLabel(empresas, 'name', 'id')
                options['areas'] = setOptionsWithLabel(areas, 'nombre', 'id')
                options['clientes'] = setOptionsWithLabel(clientes, 'empresa', 'id')
                options['metodosPago'] = setOptionsWithLabel(metodosPago, 'nombre', 'id')
                options['formasPago'] = setOptionsWithLabel(formasPago, 'nombre', 'id')
                options['estatusFacturas'] = setOptionsWithLabel(estatusFacturas, 'estatus', 'id')
                options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
                options['tiposImpuestos'] = setSelectOptions(tiposImpuestos, 'tipo')
                options['estatusCompras'] = setSelectOptions(estatusCompras, 'estatus')
                options['proyectos'] = setOptionsWithLabel(proyectos, 'nombre', 'id')
                data.clientes = clientes
                data.empresas = empresas
                Swal.close()
                this.setState({
                    ...this.state,
                    options,
                    data
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    getVentaAxios = async (id) => {
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/ventas/${id}`, access_token).then(
            (response) => {
                const { venta } = response.data
                this.setState({ ...this.state, venta: venta })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'tipoImpuesto':
                case 'tipoPago':
                case 'estatusCompra':
                    form[element] = 0
                    break;
                case 'factura':
                    form[element] = 'Sin factura'
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
                        },
                        presupuesto: {
                            value: '',
                            placeholder: 'Presupuesto',
                            files: []
                        },
                        facturas_pdf: {
                            value: '',
                            placeholder: 'Facturas extranjeras',
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
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    handleChange = (files, item)  => {
        const { form } = this.state
        let aux = form.adjuntos[item].files
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({...this.state,form})
        createAlertSA2WithActionOnClose(
            '¿DESEAS AGREGAR EL ARCHIVO?',
            '',
            () => this.addAdjuntoVentaAxios(files, item),
            () => this.cleanAdjuntos(item)
        )
    }
    cleanAdjuntos = (item) => {
        const { form } = this.state
        let aux = []
        form.adjuntos[item].files.map((file) => {
            if(file.id) aux.push(file)
            return ''
        })
        form.adjuntos[item].value = ''
        form.adjuntos[item].files = aux
        this.setState({...this.state,form})
    }
    onChangeAdjunto = e => {
        const { form, data, options } = this.state
        const { files, value, name } = e.target
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            if (name === 'factura') {
                let extension = files[counter].name.slice((Math.max(0, files[counter].name.lastIndexOf(".")) || Infinity) + 1);
                if (extension.toUpperCase() === 'XML') {
                    waitAlert()
                    const reader = new FileReader()
                    reader.onload = async (e) => {
                        let auxiliar = ''
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
                        if (obj.subtotal === '') {
                            let Subtotal = text.search('SubTotal="')
                            if (Subtotal)
                                Subtotal = text.substring(Subtotal + 10)
                            auxiliar = Subtotal.search('"')
                            Subtotal = Subtotal.substring(0, auxiliar)
                            obj.subtotal = Subtotal
                        }
                        auxiliar = ''
                        if (obj.total === '') {
                            let Total = text.search('Total="')
                            if (Total)
                                Total = text.substring(Total + 7)
                            auxiliar = Total.search('"')
                            Total = Total.substring(0, aux)
                            obj.total = Total
                        }
                        if (obj.fecha === '') {
                            let Fecha = text.search('Fecha="')
                            if (Fecha)
                                Fecha = text.substring(Fecha + 7)
                                auxiliar = Fecha.search('"')
                            Fecha = Fecha.substring(0, auxiliar)
                            obj.fecha = Fecha
                        }
                        let auxEmpresa = ''
                        data.empresas.find(function (element, index) {
                            if (element.rfc === obj.rfc_emisor) {
                                auxEmpresa = element
                            }
                            return false
                        });
                        let auxCliente = ''
                        data.clientes.find(function (element, index) {
                            if(element.rfc)
                                if (element.rfc.toUpperCase() === obj.rfc_receptor.toUpperCase()) {
                                    auxCliente = element
                                }
                            return false
                        });
                        if (auxEmpresa) {
                            options['cuentas'] = setOptions(auxEmpresa.cuentas, 'nombre', 'id')
                            form.empresa = auxEmpresa.name
                        } else {
                            errorAlert('No existe la empresa')
                        }
                        if (auxCliente) {
                            options['proyectos'] = setOptions(auxCliente.proyectos, 'nombre', 'id')
                            form.cliente = auxCliente.empresa
                            if (auxCliente.contratos) {
                                options['contratos'] = setOptions(auxCliente.contratos, 'nombre', 'id')
                            }
                        } else {
                            if(obj.nombre_receptor === ''){
                                const { history } = this.props
                                errorAlertRedirectOnDissmis(
                                    'LA FACTURA NO TIENE RAZÓN SOCIAL, CREA EL CLIENTE DESDE LA SECCIÓN DE CLIENTES EN LEADS.', 
                                    history, 
                                    '/leads/clientes')
                            }else { createAlert('NO EXISTE EL CLIENTE', '¿LO QUIERES CREAR?', () => this.addClienteAxios(obj)) }
                        }
                        if (auxEmpresa && auxCliente) { Swal.close() }
                        form.facturaObject = obj
                        form.rfc = obj.rfc_receptor
                        this.setState({
                            ...this.state,
                            options,
                            form
                        })
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
    setVentas = ventas => {
        const { data } = this.state
        let _aux = []
        data.ventas = ventas
        this.setState({
            data
        })
        let aux = []
        ventas.forEach((venta) => {
            _aux = []
            if (venta.presupuestos) {
                venta.presupuestos.forEach((presupuesto) => {
                    _aux.push({ name: 'Presupuesto', text: presupuesto.name, url: presupuesto.url })
                })
            }
            if (venta.pagos) {
                venta.pagos.forEach((pago) => {
                    _aux.push({ name: 'Pago', text: pago.name, url: pago.url })
                })
            }
            aux.push(
                {
                    actions: this.setActions(venta),
                    identificador: setTextTableCenter(venta.id),
                    cuenta: setArrayTable(
                            [
                                { name: 'Empresa', text: venta.empresa ? venta.empresa.name : '' },
                                { name: 'Cuenta', text: venta.cuenta ? venta.cuenta.nombre : '' },
                                { name: '# de cuenta', text: venta.cuenta ? venta.cuenta.numero : '' }
                            ],'235px'
                        ),
                    proyecto: setTextTableReactDom(venta.proyecto ? venta.proyecto.nombre : '', this.doubleClick, venta, 'proyecto', 'text-center'),
                    cliente: setTextTableCenter(venta.cliente ? venta.cliente.empresa : ''),
                    factura: setTextTableCenter(venta.factura ? 'Con factura' : 'Sin factura'),
                    monto: setMoneyTable(venta.monto),
                    impuesto: setTextTableReactDom(
                            venta.tipo_impuesto ? venta.tipo_impuesto.tipo : 'Sin definir', this.doubleClick, venta, 'tipoImpuesto', 'text-center'
                        ),
                    tipoPago: setTextTableReactDom(venta.tipo_pago.tipo, this.doubleClick, venta, 'tipoPago', 'text-center'),
                    descripcion: setCustomeDescripcionReactDom(
                            venta.descripcion !== null ? venta.descripcion :'', this.doubleClick, venta, 'descripcion', 'text-justify'
                        ),
                    area: setTextTableReactDom(venta.area ? venta.area.nombre : '' , this.doubleClick, venta, 'area', 'text-center'),
                    subarea: setTextTableReactDom(venta.subarea ? venta.subarea.nombre : '', this.doubleClick, venta, 'subarea', 'text-center'),
                    estatusCompra: setTextTableReactDom(
                            venta.estatus_compra ? venta.estatus_compra.estatus : '', this.doubleClick, venta, 'estatusCompra', 'text-center'
                        ),
                    total: setMoneyTable(venta.total),
                    fecha: setDateTableReactDom(venta.created_at, this.doubleClick, venta, 'fecha', 'text-center'),
                    tipo: this.labelIcon(venta),
                    id: venta.id,
                    objeto: venta
                }
            )
        })
        return aux
    }
    labelIcon(venta){
        if(venta.hasTicket)
            return(
                <a href = {`/calidad/tickets?id=${venta.ticketId}`}>
                    <div className='d-flex align-items-center justify-content-center text-dark-75 white-space-nowrap'>
                        <i style={{ color: "#9E9D24" }} className={`las la-ticket-alt icon-xl mr-2`} />
                        <u><span className="text-hover-ticket font-size-11px font-weight-bolder">{`ticket - ${venta.ticketIdentificador}`}</span></u>
                    </div>
                </a>
            )
        return(
            <div className='d-flex align-items-center justify-content-center text-dark-75 white-space-nowrap'>
                <i style={{ color: "#EF6C00" }} className={`las la-hard-hat icon-xl mr-2`} />
                <span className="font-size-11px">{`obra`}</span>
            </div>
        )
    }
    setActions = venta => {
        const { history } = this.props
        return(
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title = { <i className="fas fa-chevron-circle-down icon-md p-0"/> } id = 'dropdown-button-newtable' >
                    <Dropdown.Item className="text-hover-success dropdown-success" 
                        onClick = { (e) => { 
                                e.preventDefault(); 
                                history.push({ pathname: '/proyectos/ventas/edit', state: { venta: venta }, formeditado: 1 }) 
                            } } >
                        { setNaviIcon('flaticon2-pen', 'editar') }
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-danger dropdown-danger" 
                        onClick = { (e) => { 
                                e.preventDefault(); 
                                deleteAlert(`¿Deseas continuar?`, `Eliminarás la venta ${venta.id}`, () => { this.deleteVentaAxios(venta.id) })
                            } } >
                        { setNaviIcon('flaticon2-rubbish-bin', 'eliminar') }
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-primary dropdown-primary" 
                        onClick = { (e) => { 
                                e.preventDefault(); 
                                this.openModalSee(venta)
                            } } >
                        { setNaviIcon('flaticon2-magnifier-tool', 'Mostrar') }
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-info dropdown-info" 
                        onClick = { (e) => { 
                                e.preventDefault(); 
                                this.openModalAdjuntos(venta)
                            } } >
                        { setNaviIcon('flaticon-attachment', 'Adjuntos') }
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-warning dropdown-warning" 
                        onClick = { (e) => { 
                                e.preventDefault(); 
                                this.openFacturaExtranjera(venta)
                            } } >
                        { setNaviIcon('flaticon2-paper', 'Factura extranjera') }
                    </Dropdown.Item>
                    {
                        venta.factura ?
                            <Dropdown.Item className="text-hover-dark dropdown-dark" 
                                onClick = { (e) => { 
                                        e.preventDefault(); 
                                        this.openModalFacturas(venta)
                                    } } >
                                { setNaviIcon('flaticon2-paper', 'Facturas') }
                            </Dropdown.Item>
                        : <></>
                    }
                </DropdownButton>
            </div>
        )
    }
    openModalSee = async (venta) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/ventas/${venta.id}`, access_token).then(
            (response) => {
                const { venta } = response.data
                const { modal } = this.state
                modal.see = true
                Swal.close()
                this.setState({ ...this.state, modal, venta })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openModalAdjuntos = async (venta) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/ventas/adjuntos/${venta.id}`, access_token).then(
            (response) => {
                const { form, modal } = this.state
                const { venta } = response.data
                form.adjuntos.presupuesto.files = venta.presupuestos
                form.adjuntos.pago.files = venta.pagos
                form.adjuntos.facturas_pdf.files = venta.facturas_pdf
                modal.adjuntos = true
                Swal.close()
                this.setState({ ...this.state, form, venta })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openFacturaExtranjera = async (venta) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/ventas/adjuntos/${venta.id}`, access_token).then(
            (response) => {
                const { form, modal } = this.state
                const { venta } = response.data
                form.adjuntos.facturas_pdf.files = venta.facturas_pdf
                modal.facturaExtranjera = true
                Swal.close()
                this.setState({ ...this.state, form, modal, venta })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openModalFacturas = async (venta) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/ventas/facturas/${venta.id}`, access_token).then(
            (response) => {
                let { form } = this.state
                const { modal } = this.state
                const { venta } = response.data
                form = this.clearForm()
                if (venta)
                    if (venta.estatus_compra)
                        form.estatusCompra = venta.estatus_compra.id
                Swal.close()
                modal.facturas = true
                this.setState({ ...this.state, form, modal, venta, facturas: venta.facturas })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openModalFiltros = () => {
        const { modal } = this.state
        modal.filters = true
        this.setState({ ...this.state, modal })
    }
    openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿SEGURO DESEAS BORRAR EL ADJUNTO?', adjunto.name, () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) })
    }
    handleClose = () => {
        const { modal, data } = this.state
        modal.filters = false
        modal.facturas = false
        modal.adjuntos = false
        modal.facturaExtranjera = false
        modal.see = false
        data.adjuntos = []
        this.setState({
            ...this.state,
            modal,
            data,
            venta: '',
            facturas: [],
            porcentaje: 0,
            form: this.clearForm(),
            adjuntos: [],
        })
    }
    deleteFactura = id => { waitAlert(); this.deleteFacturaAxios(id) }
    async addClienteAxios(obj) {
        const { access_token } = this.props.authUser
        const data = new FormData();
        let cadena = obj.nombre_receptor.replace(' S. C.', ' SC').toUpperCase()
        cadena = cadena.replace(',S.A.', ' SA').toUpperCase()
        cadena = cadena.replace(/,/g, '').toUpperCase()
        cadena = cadena.replace(/\./g, '').toUpperCase()
        data.append('empresa', cadena)
        data.append('nombre', cadena)
        data.append('rfc', obj.rfc_receptor.toUpperCase())
        apiPostFormData(`cliente`, data, access_token).then(
            (response) => {
                const { clientes } = response.data
                const { options, data, form } = this.state
                options.clientes = []
                options['clientes'] = setOptions(clientes, 'empresa', 'id')
                data.clientes = clientes
                clientes.map((cliente) => {
                    if (cliente.empresa === cadena) {
                        form.cliente = cliente.empresa
                    }
                    return false
                })
                this.setState({
                    ...this.state,
                    form,
                    data,
                    options
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    async deleteVentaAxios(id) {
        const { access_token } = this.props.authUser
        apiDelete(`ventas/${id}`, access_token).then(
            (response) => {
                this.setState({ ...this.state, form: this.clearForm() })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue eliminado con éxito.', 
                    () => { this.getVentasAxios() } )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    sendFacturaAxios = async () => {
        const { access_token } = this.props.authUser
        const { form, venta } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'facturaObject':
                    data.append(element, JSON.stringify(form[element]))
                    break;
                case 'estatusCompra':
                    data.append(element, form[element]);
                    break;
                default:
                    break
            }
            return false
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '' && element === 'factura') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
            return false
        })
        data.append('id', venta.id)
        apiPostFormData(`v2/proyectos/ventas/${venta.id}/factura`, data, access_token).then(
            (response) => {
                let { form } = this.state
                const { venta } = response.data
                const { modal } = this.state
                form = this.clearForm()
                if (venta)
                    if (venta.estatus_compra)
                        form.estatusCompra = venta.estatus_compra.id
                doneAlert(response.data.message !== undefined ? response.data.message : 'Las facturas fueron actualizadas con éxito.', 
                    () => { this.getVentasAxios() })
                modal.facturas = true
                this.setState({ ...this.state, form, venta, facturas: venta.facturas })
                
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    deleteFacturaAxios = async (id) => {
        const { access_token } = this.props.authUser
        const { venta } = this.state
        apiDelete(`v2/proyectos/ventas/${venta.id}/facturas/${id}`, access_token).then(
            (response) => {
                let { form } = this.state
                const { venta } = response.data
                form = this.clearForm()
                if (venta)
                    if (venta.estatus_compra)
                        form.estatusCompra = venta.estatus_compra.id
                Swal.close()
                this.setState({ ...this.state, form, venta, facturas: venta.facturas })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    async exportVentasAxios() {

        waitAlert()
        const { filters } = this.state
        const { access_token } = this.props.authUser
        apiPostFormResponseBlob(`v3/proyectos/ventas/exportar`, { columnas: filters }, access_token).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'ventas.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(
                    response.data.message !== undefined ? 
                        response.data.message 
                    : 'Ventas fueron exportados con éxito.'
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
        
    }
    addAdjuntoVentaAxios = async (files, item) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { venta } = this.state
        const data = new FormData();
        files.map((file) => {
            data.append(`files_name_${item}[]`, file.name)
            data.append(`files_${item}[]`, file)
            return ''
        })
        data.append('tipo', item)
        data.append('id', venta.id)
        apiPostFormData(`v2/proyectos/ventas/${venta.id}/adjuntos`, data, access_token).then(
            (response) => {
                const { venta } = response.data
                const { form } = this.state
                form.adjuntos.pago.files = venta.pagos
                form.adjuntos.presupuesto.files = venta.presupuestos
                form.adjuntos.facturas_pdf.files = venta.facturas_pdf
                this.getVentasAxios()
                this.setState({ ...this.state, form })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    deleteAdjuntoAxios = async (id) => {
        const { access_token } = this.props.authUser
        const { venta } = this.state
        apiDelete(`v2/proyectos/ventas/${venta.id}/adjuntos/${id}`, access_token).then(
            (response) => {
                const { venta } = response.data
                const { form } = this.state
                form.adjuntos.presupuesto.files = venta.presupuestos
                form.adjuntos.pago.files = venta.pagos
                form.adjuntos.facturas_pdf.files = venta.facturas_pdf
                this.setState({ ...this.state, form })
                this.getVentasAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste el adjunto con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    addFacturaExtranjera= async(files, item)=>{
        waitAlert()
        const { access_token } = this.props.authUser
        const data = new FormData();
        files.map((file) => {
            data.append(`files_name_${item}[]`, file.name)
            data.append(`files_${item}[]`, file)
            return ''
        })
        apiPostFormData(`ventas/adjuntos`, data, access_token).then(
            (response) => {
                this.getVentasAxios()
                this.setState({ ...this.state })
                doneAlert('Archivo adjuntado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    onSubmitAskFactura = e => {
        e.preventDefault()
        waitAlert()
        this.askFacturaAxios()
    }
    async askFacturaAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        apiPostForm(`facturas/ask`, form, access_token).then(
            (response) => {
                this.getVentasAxios()
                this.setState({
                    ...this.state,
                    form: this.clearForm()
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    doubleClick = (data, tipo) => {
        const { form, options } = this.state
        let busqueda = undefined
        let flag = false
        switch(tipo){
            case 'proyecto':
                if(data[tipo])
                    form[tipo] = data[tipo].id.toString()
                break
            case 'subarea':
                options.subareas = []
                flag = false
                if(data.area){
                    busqueda = options.areas.find( (elemento) => { return elemento.value === data.area.id.toString() })
                    if(busqueda){
                        options.subareas = setOptions(busqueda.subareas, 'nombre', 'id')
                        if(data.subarea){
                            busqueda = options.subareas.find( (elemento) => { return elemento.value === data.subarea.id.toString() })
                            if(busqueda){ form.subarea = busqueda.value }
                        }
                    }
                }else{ 
                    flag = true 
                    if(data.area){
                        form.area = data.area.id.toString()
                        options.subareas = setOptions(data.area.subareas, 'nombre', 'id')
                    }
                    if(data.subarea){
                        busqueda = options.subareas.find( (elemento) => { return elemento.value === data.subarea.id.toString() } )
                        if(busqueda) form.subarea = data.subarea.id.toString()
                    }
                }
                break
            case 'area':
                options.subareas = []
                if(data.area){
                    form.area = data.area.id.toString()
                    options.subareas = setOptions(data.area.subareas, 'nombre', 'id')
                }
                if(data.subarea){
                    busqueda = options.subareas.find( (elemento) => { return elemento.value === data.subarea.id.toString() } )
                    if(busqueda) form.subarea = data.subarea.id.toString()
                }
                break
            case 'fecha':
                form.fecha = new Date(data.created_at)
                break
            case 'tipoImpuesto':
                if(data.tipo_impuesto)
                    form[tipo] = data.tipo_impuesto.id
                break
            case 'tipoPago':
                if(data.tipo_pago)
                    form[tipo] = data.tipo_pago.id
                break
            case 'estatusCompra':
                if(data.estatus_compra)
                    form[tipo] = data.estatus_compra.id
                break
            default:
                form[tipo] = data[tipo]
                break
        }
        this.setState({form, options})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) } </h2>
                {
                    tipo === 'descripcion' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } rows  = { 6 } as = 'textarea'
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } letterCase = { false } />
                }
                {
                    (tipo === 'tipoImpuesto') || (tipo === 'tipoPago') || (tipo === 'estatusCompra')?
                        <div className="input-icon my-3">
                            <span className="input-icon input-icon-right">
                                <span>
                                    <i className={"flaticon2-search-1 icon-md text-dark-50"}></i>
                                </span>
                            </span>
                            <Form.Control className = "form-control text-uppercase form-control-solid"
                                onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } name = { tipo }
                                defaultValue = { form[tipo] } as = "select">
                                <option value={0}>{this.setSwalPlaceholder(tipo)}</option>
                                {
                                    this.setOptions(data, tipo).map((tipo, key) => {
                                        return (
                                            <option key={key} value={tipo.value} className="bg-white" >{tipo.text}</option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </div>
                    :<></>
                }
                {
                    tipo === 'fecha' ?
                        <CalendarDaySwal value = { form[tipo] } onChange = { (e) => {  this.onChangeSwal(e.target.value, tipo)} } name = { tipo } 
                            date = { form[tipo] } withformgroup={0} />
                    :<></>
                }
                {
                    tipo === 'proyecto' ?
                        <SelectSearchGray options = { this.setOptions(data, tipo) }
                        onChange = { (value) => { this.onChangeSwal(value, tipo)} } name = { tipo }
                        value = { form[tipo] } customdiv="mb-2 mt-7" requirevalidation={1} 
                        placeholder={this.setSwalPlaceholder(tipo)} withicon={1}/>
                    :<></>
                }
                {
                    tipo === 'subarea'  ?
                        flag ? 
                            <DoubleSelectSearchGray options = { options } form = { form } onChange = { this.onChangeSwal } 
                                one = { { placeholder: 'SELECCIONA EL ÁREA', name: 'area', opciones: 'areas'} } 
                                two = { { placeholder: 'SELECCIONA EL SUBÁREA', name: 'subarea', opciones: 'subareas'} }/>
                        :
                            <SelectSearchGray options = { options.subareas } placeholder = 'Selecciona el subárea' value = { form.subarea } 
                                onChange = { (value) => { this.onChangeSwal(value, tipo) } } withtaglabel = { 1 } 
                                name = { tipo } customdiv = "mb-3" withicon={1}/>
                    : ''
                }
                {
                    tipo === 'area' &&
                        <DoubleSelectSearchGray options = { options } form = { form } onChange = { this.onChangeSwal } 
                            one = { { placeholder: 'SELECCIONA EL ÁREA', name: 'area', opciones: 'areas'} } 
                            two = { { placeholder: 'SELECCIONA EL SUBÁREA', name: 'subarea', opciones: 'subareas'} }/>
                }
            </div>,
            <Update />,
            () => { this.patchVentas(data, tipo, flag) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    setSwalPlaceholder = (tipo) => {
        switch(tipo){
            case 'proyecto':
                return 'SELECCIONA EL PROYECTO'
            case 'tipoImpuesto':
                return 'SELECCIONA EL IMPUESTO'
            case 'tipoPago':
                return 'SELECCIONA EL TIPO DE PAGO'
            case 'estatusCompra':
                return 'SELECCIONA EL ESTATUS DE COMPRA'
            default:
                return ''
        }
    }
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    patchVentas = async (data, tipo, flag) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = ''
        let newType = tipo
        switch (tipo) {
            case 'area':
                value = { area: form.area, subarea: form.subarea }
                break
            case 'subarea':
                if (flag === true) {
                    value = { area: form.area, subarea: form.subarea }
                    newType = 'area'
                } else { value = form[tipo] }
                break
            default:
                value = form[tipo]
                break
        }
        waitAlert()
        apiPutForm(`v2/proyectos/ventas/${newType}/${data.id}`, { value: value }, access_token).then(
            (response) => {
                this.getVentasAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'La venta fue editada con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    setOptions = (data, tipo) => {
        const { options } = this.state
        switch(tipo){
            case 'estatusCompra':
                return options.estatusCompras
            case 'tipoPago':
                return options.tiposPagos
            case 'tipoImpuesto':
                return options.tiposImpuestos
            case 'proyecto':
                return options.proyectos
            case 'subarea':
                if(data.subarea)
                    if(data.subarea.area)
                        if(data.subarea.area.subareas)
                            return setOptions(data.subarea.area.subareas, 'nombre', 'id')
                return []
            default: return []
        }
    }    
    getVentasAxios = tab => {
        $(`#ventas_${tab}`).DataTable().search(JSON.stringify({})).draw();
        this.setState({...this.state, key: tab, filters: {}})
    }
    onSelect = value => {
        const { form } = this.state
        this.setState({
            ...this.state,
            active: value,
            form
        })
    }
    setTabla = (key, tab) => {
        if( key === tab ){
            return(
                <NewTable
                    tableName = { `ventas_${key}` } subtitle = 'Listado de ventas' title = {`VENTAS - ${this.setName(tab)}`} mostrar_boton = { true }
                    abrir_modal = { false } url = '/proyectos/compras/add' columns = { VENTAS_COLUMNS }
                    accessToken = { this.props.authUser.access_token } setter = { this.setVentas }
                    filterClick = { this.openModalFiltros } exportar_boton = { true } onClickExport = { () => { this.exportVentasAxios() } }
                    // urlRender = { `${URL_DEV}v3/proyectos/venta?tab=${key}` }
                    urlRender = { `${URL_DEV}v3/proyectos/venta?tab=${key}` } type = { 'tab' }
                />
            )
        }
    }
    setName = tab => {
        switch(tab){
            case 'all':
                return 'Fases';
            case 'fase1':
                return 'Fase 1'
            case 'fase2':
                return 'Fase 2'
            case 'fase3':
                return 'Fase 3'
            default: return '';
        }
    }
    setOptionsArray = (name, array) => {
        const { options } = this.state
        options[name] = setOptionsWithLabel(array, 'nombre', 'id')
        this.setState({ ...this.state, options })
    }
    sendFilters = filter => {
        const { modal } = this.state
        modal.filters = false
        this.setState({
            ...this.state,
            filters: filter,
            modal
        })
        this.reloadTable(filter)
    }
    reloadTable = (filter) => {
        const { key } = this.state
        $(`#ventas_${key}`).DataTable().search(JSON.stringify(filter)).draw();
    }
    render() {
        const tabs = ['all', 'fase1', 'fase2', 'fase3']
        const { modal, options, form, venta, facturas, data, formeditado, active, key, filters } = this.state
        const { access_token } = this.props.authUser
        return (
            <Layout active = 'proyectos'  {...this.props}>
                <Tabs mountOnEnter = { true } unmountOnExit = { true } defaultActiveKey = 'all' activeKey = { key } 
                    onSelect = { (value) => { this.getVentasAxios(value) } } >
                    {
                        tabs.map((tab, index) => {
                            return(
                                <Tab key = { index }  eventKey = { tab }  title = { this.setName(tab) }>
                                    { this.setTabla(key, tab) }
                                </Tab>
                            )
                        })
                    }
                </Tabs>
                <Modal size="xl" title={"Facturas"} show={modal.facturas} handleClose={this.handleClose}>
                    <Tabs defaultActiveKey="facturas" className="mt-4 nav nav-tabs justify-content-start nav-bold bg-gris-nav bg-gray-100" 
                        activeKey={active} onSelect={this.onSelect}>
                        <Tab eventKey="facturas" title="FACTURAS">
                            <Form onSubmit={(e) => { e.preventDefault(); waitAlert(); this.sendFacturaAxios(); }}>
                                <div className="form-group row form-group-marginless mt-4">
                                    <div className="col-md-6 px-2">
                                        <Select
                                            requirevalidation={1}
                                            formeditado={1}
                                            placeholder="SELECCIONA EL ESTATUS DE COMPRA"
                                            options={options.estatusCompras}
                                            name="estatusCompra"
                                            value={form.estatusCompra}
                                            onChange={this.onChange}
                                            iconclass={"flaticon2-time"}
                                            messageinc="Incorrecto. Selecciona el estatus de compra."
                                        />
                                    </div>
                                    <div className="col-md-6 px-2 text-center align-self-center">
                                        <FileInput
                                            onChangeAdjunto={this.onChangeAdjunto}
                                            placeholder={form['adjuntos']['factura']['placeholder']}
                                            value={form['adjuntos']['factura']['value']}
                                            name={'factura'}
                                            id={'factura'}
                                            accept="text/xml, application/pdf"
                                            files={form['adjuntos']['factura']['files']}
                                            deleteAdjunto={this.clearFiles} multiple
                                            classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light 
                                                text-hover-success text-dark-50 mb-0'
                                            iconclass='flaticon2-clip-symbol text-primary'
                                        />
                                    </div>
                                    {
                                        form.adjuntos.factura.value &&
                                        <div className="col-md-12 align-items-center d-flex mt-4">
                                            <Button icon='' className="mx-auto" type="submit" text="ENVIAR" />
                                        </div>
                                    }
                                </div>
                            </Form>
                            <div className="separator separator-dashed separator-border-2 mb-6 mt-5"></div>
                            <FacturaTable deleteFactura={this.deleteFactura} facturas={facturas} />
                        </Tab>
                        <Tab eventKey="solicitar" title="SOLICITAR FACTURA">
                            <FacturaForm
                                className={"mt-4"}
                                options={options}
                                onChange={this.onChange}
                                form={form}
                                onSubmit={this.onSubmitAskFactura}
                                formeditado={formeditado}
                                data={data}
                            />
                        </Tab>
                    </Tabs>
                </Modal>
                <Modal size = "xl" title = "Adjuntos" show = { modal.adjuntos } handleClose = { this.handleClose } >
                    <AdjuntosForm form = { form } onChangeAdjunto = { this.handleChange } deleteFile = { this.openModalDeleteAdjuntos } />
                </Modal>
                <Modal size="lg" title="Ventas" show={modal.see} handleClose={this.handleClose} >
                    <VentasCard venta={venta} />
                </Modal>
                <Modal size="lg" title="Factura extranjera" show={modal.facturaExtranjera} handleClose={this.handleClose} >
                    <FacturaExtranjera form={form} onChangeAdjunto = { this.handleChange } deleteFile = { this.openModalDeleteAdjuntos }/>
                </Modal>
                <Modal size = 'xl' show = { modal.filters } handleClose = { this.handleClose } title = 'Filtros'>
                    <VentasFilters at = { access_token } sendFilters = { this.sendFilters } filters = { filters } options={options} 
                        setOptions={this.setOptionsArray}/> 
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })
export default connect(mapStateToProps, mapDispatchToProps)(VentasNew);