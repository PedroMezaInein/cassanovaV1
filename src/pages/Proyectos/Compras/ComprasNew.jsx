import React, { Component } from 'react'
import $ from 'jquery'
import axios from 'axios'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { Modal } from '../../../components/singles'
import Layout from '../../../components/layout/layout'
import { ComprasCard } from '../../../components/cards'
import { NewTable } from '../../../components/NewTables'
import { FacturaTable } from '../../../components/tables'
import { ComprasFilters } from '../../../components/filters'
import { URL_DEV, COMPRAS_COLUMNS } from '../../../constants'
import Select from '../../../components/form-components/Select'
import { Form, DropdownButton, Dropdown } from 'react-bootstrap'
import { Button, FileInput } from '../../../components/form-components'
import { AdjuntosForm, FacturaExtranjera } from '../../../components/forms'
import { apiOptions, apiGet, apiDelete, apiPostFormData, apiPostForm, catchErrors } from '../../../functions/api'
import { setOptions, setOptionsWithLabel, setSelectOptions, setTextTable, setMoneyTable, setArrayTable, setTextTableCenter, setDateTable, setNaviIcon } from '../../../functions/setters'
import { errorAlert, waitAlert, createAlert, printResponseErrorAlert, deleteAlert, doneAlert, errorAlertRedirectOnDissmis, createAlertSA2WithActionOnClose } from '../../../functions/alert'
class ComprasNew extends Component {
    state = {
        modal: {
            facturas: false,
            see: false,
            facturaExtranjera: false,
            adjuntos: false,
            filters: false
        },
        title: 'Nueva compra',
        form: {
            factura: 'Sin factura',
            facturaObject: '',
            contrato: '',
            rfc: '',
            total: '',
            cliente: '',
            proveedor: '',
            proyecto: '',
            empresa: '',
            cuenta: '',
            area: '',
            subarea: '',
            comision: '',
            solicitud: '',
            //Factura
            formaPago: '',
            metodoPago: '',
            estatusPago: '',
            //Fin factura
            tipoAdjunto: 'presupuesto',
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
                },
            }
        },
        options: {
            empresas: [],
            cuentas: [],
            areas: [],
            subareas: [],
            clientes: [],
            proyectos: [],
            proveedores: [],
            tiposImpuestos: [],
            tiposPagos: [],
            estatusCompras: [],
            formasPago: [],
            metodosPago: [],
            estatusFacturas: [],
            contratos: [],
        },
        data: {
            clientes: [],
            empresas: [],
            cuentas: [],
            proyectos: [],
            proveedores: [],
            compras: [],
            adjuntos: []
        },
        formeditado: 0,
        solicitud: '',
        compras: [],
        compra: '',
        porcentaje: '',
        facturas: [],
        adjuntos: [],
        filters: {},
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const compras = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!compras)
            history.push('/')
        this.getOptionsAxios()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                const { modal, filters } = this.state
                filters.identificador = id
                modal.see = true
                this.setState({ ...this.state, modal, filters })
                this.reloadTable(filters)
                this.getCompraAxios(id)
            }
        }
    }
    getOptionsAxios = async () => {
        const { access_token } = this.props.authUser
        waitAlert()
        apiOptions(`v2/proyectos/compras`, access_token).then(
            (response) => {
                Swal.close()
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras, proyectos,
                    proveedores, formasPago, metodosPago, estatusFacturas } = response.data
                const { options, data } = this.state
                options['empresas'] = setOptionsWithLabel(empresas, 'name', 'id')
                options['proveedores'] = setOptionsWithLabel(proveedores, 'razon_social', 'id')
                options['areas'] = setOptionsWithLabel(areas, 'nombre', 'id')
                options['proyectos'] = setOptionsWithLabel(proyectos, 'nombre', 'id')
                options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
                options['tiposImpuestos'] = setSelectOptions(tiposImpuestos, 'tipo')
                options['estatusCompras'] = setSelectOptions(estatusCompras, 'estatus')
                options['estatusFacturas'] = setOptionsWithLabel(estatusFacturas, 'estatus', 'id')
                options['formasPago'] = setOptionsWithLabel(formasPago, 'nombre', 'id')
                options['metodosPago'] = setOptionsWithLabel(metodosPago, 'nombre', 'id')
                data.proveedores = proveedores
                data.empresas = empresas
                this.setState({ ...this.state, options, data })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    getCompraAxios = async (id) => {
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/compras/${id}`, access_token).then(
            (response) => {
                const { compra } = response.data
                this.setState({ ...this.state, compra: compra })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'tipoAdjunto':
                    form[element] = 'presupuesto'
                    break;
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
    handleChange = (files, item) => {
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
        this.setState({ ...this.state, form })
        createAlertSA2WithActionOnClose(
            '¿DESEAS AGREGAR EL ARCHIVO?',
            '',
            () => this.addAdjuntoCompraAxios(files, item),
            () => this.cleanAdjuntos(item)
        )
    }
    cleanAdjuntos = (item) => {
        const { form } = this.state
        let aux = []
        form.adjuntos[item].files.map((file) => {
            if (file.id) aux.push(file)
            return ''
        })
        form.adjuntos[item].value = ''
        form.adjuntos[item].files = aux
        this.setState({ ...this.state, form })
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
                        const text = (e.target.result)
                        var XMLParser = require('react-xml-parser');
                        var xml = new XMLParser().parseFromString(text);
                        const emisor = xml.getElementsByTagName('cfdi:Emisor')[0]
                        const receptor = xml.getElementsByTagName('cfdi:Receptor')[0]
                        const timbreFiscalDigital = xml.getElementsByTagName('tfd:TimbreFiscalDigital')[0]
                        const conceptos = xml.getElementsByTagName('cfdi:Concepto')
                        let relacionados = xml.getElementsByTagName('cfdi:CfdiRelacionados')
                        let desc = ''
                        conceptos.forEach(element => {
                            desc = desc + element.attributes.Descripcion + '. ';
                        });
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
                            descripcion: desc,
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
                        let auxEmpresa = ''
                        data.empresas.find(function (element, index) {
                            if (element.rfc === obj.rfc_receptor) {
                                auxEmpresa = element
                            }
                            return false
                        });
                        let auxProveedor = ''
                        data.proveedores.find(function (element, index) {
                            if (element.rfc)
                                if (element.rfc.toUpperCase() === obj.rfc_emisor.toUpperCase()) {
                                    auxProveedor = element
                                }
                            return false
                        });
                        if (auxEmpresa) {
                            options['cuentas'] = setOptions(auxEmpresa.cuentas, 'nombre', 'id')
                            form.empresa = auxEmpresa.name
                        } else {
                            errorAlert('No existe la empresa')
                        }
                        if (auxProveedor) {
                            form.proveedor = auxProveedor.id.toString()
                            if (auxProveedor.contratos) {
                                options['contratos'] = setOptions(auxProveedor.contratos, 'nombre', 'id')
                            }
                        } else {
                            if (obj.nombre_emisor === '') {
                                const { history } = this.props
                                errorAlertRedirectOnDissmis('LA FACTURA NO TIENE RAZÓN SOCIAL, CREA EL PROVEEDOR DESDE LA SECCIÓN DE PROVEEDORES EN LEADS.', history, '/leads/proveedores')
                            } else {
                                createAlert('NO EXISTE EL PROVEEDOR', '¿LO QUIERES CREAR?', () => this.addProveedorAxios(obj))
                            }
                        }
                        if (auxEmpresa && auxProveedor) {
                            Swal.close()
                        }
                        form.facturaObject = obj
                        form.rfc = obj.rfc_emisor
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
    setCompras = compras => {
        let aux = []
        let _aux = []
        compras.map((compra) => {
            _aux = []
            if (compra.presupuestos) {
                compra.presupuestos.map((presupuesto) => {
                    _aux.push({
                        name: 'Presupuesto', text: presupuesto.name, url: presupuesto.url
                    })
                    return false
                })
            }
            if (compra.pagos) {
                compra.pagos.map((pago) => {
                    _aux.push({
                        name: 'Pago', text: pago.name, url: pago.url
                    })
                    return false
                })
            }
            aux.push(
                {
                    actions: this.setActions(compra),
                    identificador: setTextTableCenter(compra.id),
                    cuenta: setArrayTable(
                        [
                            { name: 'Empresa', text: compra.empresa ? compra.empresa.name : '' },
                            { name: 'Cuenta', text: compra.cuenta ? compra.cuenta.nombre : '' },
                            { name: '# de cuenta', text: compra.cuenta ? compra.cuenta.numero : '' }
                        ], '153px'
                    ),
                    proyecto: setTextTableCenter(compra.proyecto ? compra.proyecto.nombre : ''),
                    proveedor: setTextTableCenter(compra.proveedor ? compra.proveedor.razon_social : ''),
                    factura: setTextTable(compra.factura ? 'Con factura' : 'Sin factura'),
                    monto: setMoneyTable(compra.monto),
                    comision: setMoneyTable(compra.comision ? compra.comision : 0.0),
                    impuesto: setTextTableCenter(compra.tipo_impuesto ? compra.tipo_impuesto.tipo : 'Sin definir'),
                    tipoPago: setTextTableCenter(compra.tipo_pago.tipo),
                    descripcion: setTextTable(compra.descripcion !== null ? compra.descripcion : ''),
                    area: setTextTableCenter(compra.area ? compra.area.nombre : ''),
                    subarea: setTextTableCenter(compra.subarea ? compra.subarea.nombre : ''),
                    estatusCompra: setTextTableCenter(compra.estatus_compra ? compra.estatus_compra.estatus : ''),
                    total: setMoneyTable(compra.total),
                    fecha: setDateTable(compra.created_at),
                    tipo: this.labelIcon(compra),
                    id: compra.id,
                    objeto: compra
                }
            )
            return false
        })
        return aux
    }
    labelIcon(compra) {
        if (compra.hasTicket)
            return (
                <a href={`/calidad/tickets?id=${compra.ticketId}`}>
                    <div className='d-flex align-items-center justify-content-center text-dark-75 white-space-nowrap'>
                        <i style={{ color: "#9E9D24" }} className={`las la-ticket-alt icon-xl mr-2`} />
                        <u><span className="text-hover-ticket font-size-11px font-weight-bolder">{`ticket - ${compra.ticketIdentificador}`}</span></u>
                    </div>
                </a>
            )
        return (
            <div className='d-flex align-items-center justify-content-center text-dark-75 white-space-nowrap'>
                <i style={{ color: "#EF6C00" }} className={`las la-hard-hat icon-xl mr-2`} />
                <span className="font-size-11px">{`obra`}</span>
            </div>
        )
    }
    setActions = compra => {
        const { history } = this.props
        return (
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >
                    <Dropdown.Item className="text-hover-success dropdown-success" onClick={(e) => { e.preventDefault(); history.push({ pathname: '/proyectos/compras/edit', state: { compra: compra }, formeditado: 1 }) }} >
                        {setNaviIcon('flaticon2-pen', 'editar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-danger dropdown-danger" onClick={(e) => { e.preventDefault(); deleteAlert(`ELIMINARÁS LA COMPRA CON IDENTIFICADOR: ${compra.id}`, '¿DESEAS CONTINUAR?', () => this.deleteCompraAxios(compra.id)) }}>
                        {setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={(e) => { e.preventDefault(); this.openModalSee(compra) }}>
                        {setNaviIcon('flaticon2-magnifier-tool', 'Ver compra')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-info dropdown-info" onClick={(e) => { e.preventDefault(); this.openModalAdjuntos(compra) }}>
                        {setNaviIcon('flaticon-attachment', 'Adjuntos')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-warning dropdown-warning" onClick={(e) => { e.preventDefault(); this.openFacturaExtranjera(compra) }}>
                        {setNaviIcon('flaticon-interface-10', 'Factura extranjera')}
                    </Dropdown.Item>
                    {
                        compra.factura ?
                            <Dropdown.Item className="text-hover-dark dropdown-dark" onClick={(e) => { e.preventDefault(); this.openModalFacturas(compra) }}>
                                {setNaviIcon('flaticon2-download-1', 'Facturas')}
                            </Dropdown.Item>
                            : <></>
                    }
                </DropdownButton>
            </div>
        )
    }
    openModalSee = async (compra) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/compras/${compra.id}`, access_token).then(
            (response) => {
                const { compra } = response.data
                const { modal } = this.state
                modal.see = true
                Swal.close()
                this.setState({ ...this.state, modal, compra })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openModalAdjuntos = async (compra) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/compras/adjuntos/${compra.id}`, access_token).then(
            (response) => {
                const { form, modal } = this.state
                const { compra } = response.data
                form.adjuntos.presupuesto.files = compra.presupuestos
                form.adjuntos.pago.files = compra.pagos
                modal.adjuntos = true
                Swal.close()
                this.setState({ ...this.state, form, modal, compra })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openFacturaExtranjera = async (compra) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/compras/adjuntos/${compra.id}`, access_token).then(
            (response) => {
                const { form, modal } = this.state
                const { compra } = response.data
                form.adjuntos.facturas_pdf.files = compra.facturas_pdf
                modal.facturaExtranjera = true
                Swal.close()
                this.setState({ ...this.state, form, modal, compra })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openModalFacturas = async (compra) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/compras/facturas/${compra.id}`, access_token).then(
            (response) => {
                let { form } = this.state
                const { compra } = response.data
                const { modal } = this.state
                form = this.clearForm()
                if (compra)
                    if (compra.estatus_compra)
                        form.estatusCompra = compra.estatus_compra.id
                Swal.close()
                modal.facturas = true
                this.setState({ ...this.state, form, modal, compra, facturas: compra.facturas })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openModalFiltros = () => {
        const { modal } = this.state
        modal.filters = true
        this.setState({ ...this.state, modal })
    }
    handleClose = () => {
        const { data, modal } = this.state
        data.adjuntos = []
        modal.see = false
        modal.facturaExtranjera = false
        modal.adjuntos = false
        modal.facturas = false
        modal.filters = false
        this.setState({
            ...this.state,
            modal,
            form: this.clearForm(),
            facturas: [],
            adjuntos: [],
            porcentaje: 0,
            compra: '',
            data
        })
    }
    openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿SEGURO DESEAS BORRAR EL ADJUNTO?', adjunto.name, () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) })
    }
    deleteFactura = id => { waitAlert(); this.deleteFacturaAxios(id) }
    addProveedorAxios = async (obj) => {
        const { access_token } = this.props.authUser
        const data = new FormData();
        let cadena = obj.nombre_emisor.replace(' S. C.', ' SC').toUpperCase()
        cadena = cadena.replace(',S.A.', ' SA').toUpperCase()
        cadena = cadena.replace(/,/g, '').toUpperCase()
        cadena = cadena.replace(/\./g, '').toUpperCase()
        data.append('nombre', cadena)
        data.append('razonSocial', cadena)
        data.append('rfc', obj.rfc_emisor.toUpperCase())
        apiPostFormData(`proveedores`, data, access_token).then(
            (response) => {
                const { proveedores } = response.data
                const { options, data, form } = this.state
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                data.proveedores = proveedores
                proveedores.map((proveedor) => {
                    if (proveedor.razon_social === cadena)
                        form.proveedor = proveedor.id.toString()
                    return false
                })
                this.setState({ ...this.state, form, data, options })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El proveedor fue registrado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    deleteCompraAxios = async (id) => {
        const { access_token } = this.props.authUser
        apiDelete(`compras/${id}`, access_token).then(
            (response) => {
                const { filters } = this.state
                this.setState({ ...this.state, form: this.clearForm() })
                doneAlert(response.data.message !== undefined ? response.data.message : 'La compra fue eliminada con éxito.', () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    sendFacturaAxios = async () => {
        const { access_token } = this.props.authUser
        const { form, compra } = this.state
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
                default: break
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
                return false
            }
            return false
        })
        data.append('id', compra.id)
        apiPostFormData(`v2/proyectos/compras/${compra.id}/factura`, data, access_token).then(
            (response) => {
                let { form } = this.state
                const { compra } = response.data
                const { modal, filters } = this.state
                modal.facturas = true
                form = this.clearForm()
                if (compra)
                    if (compra.estatus_compra)
                        form.estatusCompra = compra.estatus_compra.id
                doneAlert(response.data.message !== undefined ? response.data.message : 'Las facturas fueron actualizadas con éxito.', () => { this.reloadTable(filters) })
                this.setState({ ...this.state, form, modal, compra, facturas: compra.facturas })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    deleteFacturaAxios = async (id) => {
        const { access_token } = this.props.authUser
        const { compra } = this.state
        apiDelete(`v2/proyectos/compras/${compra.id}/facturas/${id}`, access_token).then(
            (response) => {
                let { form } = this.state
                const { compra } = response.data
                form = this.clearForm()
                if (compra)
                    if (compra.estatus_compra)
                        form.estatusCompra = compra.estatus_compra.id
                Swal.close()
                this.setState({ ...this.state, form, compra, facturas: compra.facturas })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    exportComprasAxios = async () => {
        let headers = []
        let documento = ''
        COMPRAS_COLUMNS.map((columna, key) => {
            if (columna !== 'actions' && columna !== 'adjuntos') {
                documento = document.getElementById(columna.accessor + '-compras')
                if (documento) {
                    if (documento.value) {
                        headers.push({
                            name: columna.accessor,
                            value: documento.value
                        })
                    }
                }
            }
            return false
        })
        waitAlert()
        const { access_token } = this.props.authUser
        apiPostForm(`v2/exportar/proyectos/compras`, { columnas: headers }, access_token).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'compras.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    addAdjuntoCompraAxios = async (files, item) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { compra } = this.state
        const data = new FormData();
        files.map((file) => {
            data.append(`files_name_${item}[]`, file.name)
            data.append(`files_${item}[]`, file)
            return ''
        })
        data.append('tipo', item)
        data.append('id', compra.id)
        apiPostFormData(`v2/proyectos/compras/${compra.id}/adjuntos`, data, access_token).then(
            (response) => {
                const { compra } = response.data
                const { form, filters } = this.state
                form.adjuntos.pago.files = compra.pagos
                form.adjuntos.presupuesto.files = compra.presupuestos
                form.adjuntos.facturas_pdf.files = compra.facturas_pdf
                this.setState({ ...this.state, form })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.', () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    deleteAdjuntoAxios = async (id) => {
        const { access_token } = this.props.authUser
        const { compra } = this.state
        apiDelete(`v2/proyectos/compras/${compra.id}/adjuntos/${id}`, access_token).then(
            (response) => {
                const { compra } = response.data
                const { form, filters } = this.state
                form.adjuntos.presupuesto.files = compra.presupuestos
                form.adjuntos.pago.files = compra.pagos
                form.adjuntos.facturas_pdf.files = compra.facturas_pdf
                this.setState({ ...this.state, form })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste el adjunto con éxito.', () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    addFacturaExtranjera = async (files, item) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const data = new FormData();
        files.map((file) => {
            data.append(`files_name_${item}[]`, file.name)
            data.append(`files_${item}[]`, file)
            return ''
        })
        apiPostFormData(`compras/adjuntos`, data, access_token).then(
            (response) => {
                this.setState({ ...this.state })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    setOptions = (name, array) => {
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
        $(`#compras`).DataTable().search(JSON.stringify(filter)).draw();
    }
    render() {
        const { modal, form, options, facturas, compra, filters } = this.state
        const { access_token } = this.props.authUser
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <NewTable
                    tableName = 'compras'
                    subtitle = 'Listado de compras'
                    title = 'Compras'
                    mostrar_boton = { true }
                    abrir_modal = { false }
                    accessToken = { access_token }
                    columns = { COMPRAS_COLUMNS }
                    setter = { this.setCompras }
                    url = '/proyectos/compras/add'
                    urlRender = {`${URL_DEV}v3/proyectos/compra`} 
                    filterClick = { this.openModalFiltros }
                    exportar_boton = { true}
                    onClickExport = { () => this.exportComprasAxios() }
                    validateFactura = { true }
                    tipo_validacion = 'compras'
                />
                <Modal size="xl" title="Facturas" show={modal.facturas} handleClose={this.handleClose} >
                    <Form onSubmit={(e) => { e.preventDefault(); waitAlert(); this.sendFacturaAxios(); }}>
                        <div className="row mx-0 pt-4">
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
                                    classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0'
                                    iconclass='flaticon2-clip-symbol text-primary'
                                />
                            </div>
                            {
                                form.adjuntos.factura.value &&
                                <div className="col-md-12 px-2 align-items-center d-flex mt-4">
                                    <Button icon='' className="mx-auto" type="submit" text="ENVIAR" />
                                </div>
                            }
                        </div>
                    </Form>
                    <div className="separator separator-dashed separator-border-2 mb-6 mt-5"></div>
                    <FacturaTable deleteFactura={this.deleteFactura} facturas={facturas} />
                </Modal>
                <Modal size="xl" title="Adjuntos" show={modal.adjuntos} handleClose={this.handleClose} >
                    <AdjuntosForm form={form} onChangeAdjunto={this.handleChange} deleteFile={this.openModalDeleteAdjuntos} />
                </Modal>
                <Modal size="lg" title="Compra" show={modal.see} handleClose={this.handleClose} >
                    <ComprasCard compra={compra} />
                </Modal>
                <Modal size="lg" title="Factura extranjera" show={modal.facturaExtranjera} handleClose={this.handleClose} >
                    <FacturaExtranjera form={form} onChangeAdjunto={this.handleChange} deleteFile={this.openModalDeleteAdjuntos} />
                </Modal>
                <Modal size='xl' show={modal.filters} handleClose={this.handleClose} title='Filtros'>
                    <ComprasFilters at={access_token} sendFilters={this.sendFilters} filters={filters} options={options} setOptions={this.setOptions} />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ComprasNew);