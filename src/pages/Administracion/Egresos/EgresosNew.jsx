import React, { Component } from 'react'
import $ from 'jquery'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { Update } from '../../../components/Lottie'
import { EgresosCard } from '../../../components/cards'
import Layout from '../../../components/layout/layout'
import { NewTable } from '../../../components/NewTables'
import { FacturaTable } from '../../../components/tables'
import { EngresosFilters } from '../../../components/filters'
import { URL_DEV, EGRESOS_COLUMNS } from '../../../constants'
import { printSwalHeader } from '../../../functions/printers'
import Select from '../../../components/form-components/Select'
import { Modal } from '../../../components/singles'
import { Form, DropdownButton, Dropdown } from 'react-bootstrap'
import { AdjuntosForm, FacturaExtranjera } from '../../../components/forms'
import { apiOptions, apiGet, apiDelete, apiPostFormData, apiPutForm, catchErrors, apiPostFormResponseBlob } from '../../../functions/api'
import { Button, FileInput, InputGray, CalendarDaySwal, SelectSearchGray, DoubleSelectSearchGray } from '../../../components/form-components'
import { errorAlert, waitAlert, createAlert, deleteAlert, doneAlert, errorAlertRedirectOnDissmis, createAlertSA2WithActionOnClose, printResponseErrorAlert, 
    customInputAlert } from '../../../functions/alert'
import { setOptions, setOptionsWithLabel, setTextTable, setDateTableReactDom, setMoneyTable, setArrayTable, setSelectOptions, setTextTableCenter, 
    setTextTableReactDom, setNaviIcon } from '../../../functions/setters'
class egresos extends Component {
    state = {
        modal: {
            see: false,
            facturas: false,
            adjuntos: false,
            facturaExtranjera: false,
            filters: false,
            download: false
        },
        egresos: [],
        egresosAux: [],
        title: 'Nuevo egreso',
        egreso: '',
        facturas: [],
        data: {
            proveedores: [],
            empresas: [],
            egresos: [],
            adjuntos: []
        },
        form: {
            formaPago: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            metodoPago: '',
            estatusFactura: '',
            facturaObject: '',
            estatusCompra: 0,
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
                    placeholder: 'Factura extranjera',
                    files: []
                }
            }
        },
        options: {
            formasPagos: [],
            metodosPagos: [],
            estatusFacturas: [],
            estatusCompras: []
        },
        filters: {}
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const egresos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!egresos)
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
                this.getEgresoAxios(id)
            }
        }
    }

    getOptionsAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiOptions(`v2/administracion/egresos`, access_token).then(
            (response) => {
                const { data, options } = this.state
                const { proveedores, empresas, estatusCompras, areas, tiposPagos, tiposImpuestos } = response.data
                data.proveedores = proveedores
                data.empresas = empresas
                options['estatusCompras'] = setSelectOptions(estatusCompras, 'estatus')
                options['empresas'] = setOptionsWithLabel(empresas, 'name', 'id')
                options['areas'] = setOptionsWithLabel(areas, 'nombre', 'id')
                options['proveedores'] = setOptionsWithLabel(proveedores, 'razon_social', 'id')
                options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
                options['tiposImpuestos'] = setSelectOptions(tiposImpuestos, 'tipo')
                Swal.close()
                this.setState({ ...this.state, data, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    async getEgresoAxios(id) {
        const { access_token } = this.props.authUser
        apiGet(`egresos/single/${id}`, access_token).then(
            (response) => {
                const { egreso } = response.data
                this.setState({
                    ...this.state,
                    egreso: egreso
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
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
                            placeholder: 'Factura extranjera',
                            files: []
                        }
                    }
                    break;
                case 'estatusCompra':
                    form[element] = 0
                    break;
                case 'fechaInicio':
                case 'fechaFin':
                    form[element] = new Date()
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
        form.adjuntos[item].value = files
        form.adjuntos[item].files = aux
        this.setState({ ...this.state, form })
        createAlertSA2WithActionOnClose(
            '¿DESEAS AGREGAR EL ARCHIVO?',
            '',
            () => this.addAdjuntoEgresoAxios(files, item),
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
                        if (auxProveedor) { form.proveedor = auxProveedor.id.toString() }
                        else {
                            if (obj.nombre_emisor === '') {
                                const { history } = this.props
                                errorAlertRedirectOnDissmis('LA FACTURA NO TIENE RAZÓN SOCIAL, CREA EL PROVEEDOR DESDE LA SECCIÓN DE PROVEEDORES EN LEADS.', history, '/leads/proveedores')
                            } else
                                createAlert('NO EXISTE EL PROVEEDOR', '¿LO QUIERES CREAR?', () => this.addProveedorAxios(obj))
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
    setEgresos = egresos => {
        let aux = []
        let _aux = []
        if (egresos)
            egresos.map((egreso) => {
                _aux = []
                if (egreso.presupuestos) {
                    egreso.presupuestos.map((presupuesto) => {
                        _aux.push({
                            name: 'Presupuesto', text: presupuesto.name, url: presupuesto.url
                        })
                        return false
                    })
                }
                if (egreso.pagos) {
                    egreso.pagos.map((pago) => {
                        _aux.push({
                            name: 'Pago', text: pago.name, url: pago.url
                        })
                        return false
                    })
                }
                aux.push(
                    {
                        actions: this.setActions(egreso),
                        identificador: setTextTableCenter(egreso.id),
                        cuenta: setArrayTable(
                            [
                                { name: 'Empresa', text: egreso.empresa ? egreso.empresa.name : '' },
                                { name: 'Cuenta', text: egreso.cuenta ? egreso.cuenta.nombre : '' },
                                { name: 'No. de cuenta', text: egreso.cuenta ? egreso.cuenta.numero : '' }
                            ], '250px'
                        ),
                        proveedor: setTextTable(egreso.proveedor ? egreso.proveedor.razon_social : ''),
                        factura: setTextTableCenter(egreso.factura ? 'Con factura' : 'Sin factura'),
                        monto: setMoneyTable(egreso.monto),
                        comision: setMoneyTable(egreso.comision ? egreso.comision : 0.0),
                        total: setMoneyTable(egreso.total),
                        impuesto: setTextTableReactDom(egreso.tipo_impuesto ? egreso.tipo_impuesto.tipo : 'Sin definir', this.doubleClick, egreso, 'tipoImpuesto', 'text-center'),
                        tipoPago: setTextTableReactDom(egreso.tipo_pago.tipo, this.doubleClick, egreso, 'tipoPago', 'text-center'),
                        descripcion: setTextTableReactDom(egreso.descripcion !== null ? egreso.descripcion : '', this.doubleClick, egreso, 'descripcion', 'text-justify'),
                        area: setTextTableReactDom(egreso.area ? egreso.area.nombre : '', this.doubleClick, egreso, 'area', 'text-center'),
                        subarea: setTextTableReactDom(egreso.subarea ? egreso.subarea.nombre : '', this.doubleClick, egreso, 'subarea', 'text-center'),
                        estatusCompra: setTextTableReactDom(egreso.estatus_compra ? egreso.estatus_compra.estatus : '', this.doubleClick, egreso, 'estatusCompra', 'text-center'),
                        adjuntos: setArrayTable(_aux),
                        fecha: setDateTableReactDom(egreso.created_at, this.doubleClick, egreso, 'fecha', 'text-center'),
                        id: egreso.id,
                        objeto: egreso
                    }
                )
                return false
            })
        return aux
    }

    setActions = egreso => {
        const { history } = this.props
        return (
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >
                    <Dropdown.Item className="text-hover-success dropdown-success" onClick={(e) => { e.preventDefault(); history.push({ pathname: '/administracion/egresos/edit', state: { egreso: egreso } }) }} >
                        {setNaviIcon('flaticon2-pen', 'editar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-danger dropdown-danger" onClick={(e) => { e.preventDefault(); deleteAlert('¿DESEAS CONTINUAR?', `ELIMINARÁS EL EGRESO CON IDENTIFICADOR: ${egreso.id}`, () => this.deleteEgresoAxios(egreso.id)) }}>
                        {setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={(e) => { e.preventDefault(); this.openModalSee(egreso) }}>
                        {setNaviIcon('flaticon2-magnifier-tool', 'Ver egreso')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-info dropdown-info" onClick={(e) => { e.preventDefault(); this.openModalAdjuntos(egreso) }}>
                        {setNaviIcon('flaticon-attachment', 'Adjuntos')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-warning dropdown-warning" onClick={(e) => { e.preventDefault(); this.openFacturaExtranjera(egreso) }}>
                        {setNaviIcon('flaticon-interface-10', 'Factura extranjera')}
                    </Dropdown.Item>
                    {
                        egreso.factura ?
                            <Dropdown.Item className="text-hover-dark dropdown-dark" onClick={(e) => { e.preventDefault(); this.openModalFacturas(egreso) }}>
                                {setNaviIcon('flaticon2-download-1', 'Facturas')}
                            </Dropdown.Item>
                            : <></>
                    }
                </DropdownButton>
            </div>
        )
    }
    openModalSee = async (egreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/administracion/egresos/${egreso.id}`, access_token).then(
            (response) => {
                const { egreso } = response.data
                const { modal } = this.state
                modal.see = true
                Swal.close()
                this.setState({ ...this.state, modal, egreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openModalAdjuntos = async (egreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/administracion/egresos/adjuntos/${egreso.id}`, access_token).then(
            (response) => {
                const { egreso } = response.data
                let { form } = this.state
                const { modal } = this.state
                form = this.revertForm(egreso)
                Swal.close()
                modal.adjuntos = true
                this.setState({ ...this.state, form, modal, egreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openFacturaExtranjera = async (egreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/administracion/egresos/adjuntos/${egreso.id}`, access_token).then(
            (response) => {
                let { form } = this.state
                const { egreso } = response.data
                const { modal } = this.state
                form = this.revertForm(egreso)
                modal.facturaExtranjera = true
                Swal.close()
                this.setState({ ...this.state, form, modal, egreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openModalFacturas = async (egreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/administracion/egresos/facturas/${egreso.id}`, access_token).then(
            (response) => {
                let { form } = this.state
                const { egreso } = response.data
                const { modal } = this.state
                form = this.clearForm()
                if (egreso)
                    if (egreso.estatus_compra)
                        form.estatusCompra = egreso.estatus_compra.id
                Swal.close()
                modal.facturas = true
                this.setState({ ...this.state, form, modal, egreso, facturas: egreso.facturas })
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
        data.adjuntos = []
        modal.see = false
        modal.facturas = false
        modal.adjuntos = false
        modal.facturaExtranjera = false
        modal.download = false
        modal.filters = false
        this.setState({
            ...this.state,
            data,
            modal,
            egreso: '',
            facturas: [],
            adjuntos: [],
            form: this.clearForm()
        })
    }
    deleteFactura = id => { waitAlert(); this.deleteFacturaAxios(id) }
    async addProveedorAxios(obj) {
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
                    if (proveedor.razon_social === cadena) {
                        form.proveedor = proveedor.id.toString()
                    }
                    return false
                })
                this.setState({
                    ...this.state,
                    form,
                    data,
                    options
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    async deleteEgresoAxios(id) {
        const { access_token } = this.props.authUser
        apiDelete(`egresos/${id}`, access_token).then(
            (response) => {
                const { filters } = this.state
                this.setState({
                    ...this.state,
                    egreso: '',
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue eliminado con éxito.', () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    sendFacturaAxios = async () => {
        const { access_token } = this.props.authUser
        const { form, egreso, modal } = this.state
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
        data.append('id', egreso.id)
        apiPostFormData(`v2/administracion/egresos/${egreso.id}/factura`, data, access_token).then(
            (response) => {
                let { form } = this.state
                const { egreso } = response.data
                const { filters } = this.state
                modal.facturas = true
                form = this.clearForm()
                if (egreso)
                    if (egreso.estatus_compra)
                        form.estatusCompra = egreso.estatus_compra.id
                doneAlert(response.data.message !== undefined ? response.data.message : 'Las facturas fueron actualizadas con éxito.', () => { this.reloadTable(filters) })
                this.setState({ ...this.state, form, modal, egreso, facturas: egreso.facturas })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    deleteFacturaAxios = async (id) => {
        const { access_token } = this.props.authUser
        const { egreso } = this.state
        apiDelete(`v2/administracion/egresos/${egreso.id}/facturas/${id}`, access_token).then(
            (response) => {
                let { form } = this.state
                const { egreso } = response.data
                form = this.clearForm()
                if (egreso)
                    if (egreso.estatus_compra)
                        form.estatusCompra = egreso.estatus_compra.id
                Swal.close()
                this.setState({ ...this.state, form, egreso, facturas: egreso.facturas })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({ ...this.state, form })
    }
    
    exportEgresosAxios = async () => {
        waitAlert()
        const { filters } = this.state
        const { access_token } = this.props.authUser
        apiPostFormResponseBlob(`v3/administracion/egresos/exportar`, { columnas: filters }, access_token).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'egresos.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(
                    response.data.message !== undefined ? 
                        response.data.message 
                    : 'Ingresos exportados con éxito.'
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    addAdjuntoEgresoAxios = async (files, item) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { egreso } = this.state
        const data = new FormData();
        files.map((file) => {
            data.append(`files_name_${item}[]`, file.name)
            data.append(`files_${item}[]`, file)
            return ''
        })
        data.append('tipo', item)
        data.append('id', egreso.id)
        apiPostFormData(`v2/administracion/egresos/${egreso.id}/adjuntos`, data, access_token).then(
            (response) => {
                const { egreso } = response.data
                let { form } = this.state
                const { filters } = this.state
                form = this.revertForm(egreso)
                this.setState({ ...this.state, form })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.', () => { this.reloadTable(filters) })
            }, (error) => {
                let { form } = this.state
                form = this.revertForm(egreso);
                this.setState({ ...this.state, form })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    deleteAdjuntoAxios = async (id) => {
        const { access_token } = this.props.authUser
        const { egreso } = this.state
        apiDelete(`v2/administracion/egresos/${egreso.id}/adjuntos/${id}`, access_token).then(
            (response) => {
                const { egreso } = response.data
                let { form } = this.state
                const { filters } = this.state
                form = this.revertForm(egreso)
                this.setState({ ...this.state, form })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.', () => { this.reloadTable(filters) })
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
        apiPostFormData(`egresos/adjuntos`, data, access_token).then(
            (response) => {
                const { filters } = this.state
                this.setState({ ...this.state })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.', () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    doubleClick = (data, tipo) => {
        const { form, options } = this.state
        let busqueda = undefined
        let flag = false
        switch (tipo) {
            case 'subarea':
                options.subareas = []
                flag = false
                if (data.area) {
                    busqueda = options.areas.find((elemento) => { return elemento.value === data.area.id.toString() })
                    if (busqueda) {
                        options.subareas = setOptions(busqueda.subareas, 'nombre', 'id')
                        if (data.subarea) {
                            busqueda = options.subareas.find((elemento) => { return elemento.value === data.subarea.id.toString() })
                            if (busqueda) { form.subarea = busqueda.value }
                        }
                    }
                } else {
                    flag = true
                    if (data.area) {
                        form.area = data.area.id.toString()
                        options.subareas = setOptions(data.area.subareas, 'nombre', 'id')
                    }
                    if (data.subarea) {
                        busqueda = options.subareas.find((elemento) => { return elemento.value === data.subarea.id.toString() })
                        if (busqueda) form.subarea = data.subarea.id.toString()
                    }
                }
                break
            case 'area':
                options.subareas = []
                if (data.area) {
                    form.area = data.area.id.toString()
                    options.subareas = setOptions(data.area.subareas, 'nombre', 'id')
                }
                if (data.subarea) {
                    busqueda = options.subareas.find((elemento) => { return elemento.value === data.subarea.id.toString() })
                    if (busqueda) form.subarea = data.subarea.id.toString()
                }
                break
            case 'fecha':
                form.fecha = new Date(data.created_at)
                break
            case 'tipoImpuesto':
                if (data.tipo_impuesto)
                    form[tipo] = data.tipo_impuesto.id
                break
            case 'tipoPago':
                if (data.tipo_pago)
                    form[tipo] = data.tipo_pago.id
                break
            case 'estatusCompra':
                if (data.estatus_compra)
                    form[tipo] = data.estatus_compra.id
                break
            default:
                form[tipo] = data[tipo]
                break
        }
        this.setState({ form, options })
        customInputAlert(
            <div>
                <h2 className='swal2-title mb-4 mt-2'> {printSwalHeader(tipo)} </h2>
                {
                    tipo === 'descripcion' &&
                    <InputGray withtaglabel={0} withtextlabel={0} withplaceholder={0} withicon={0}
                        requirevalidation={0} value={form[tipo]} name={tipo} rows={6} as='textarea'
                        onChange={(e) => { this.onChangeSwal(e.target.value, tipo) }} swal={true} />
                }
                {
                    (tipo === 'tipoImpuesto') || (tipo === 'tipoPago') || (tipo === 'estatusCompra') ?
                        <div className="input-icon my-3">
                            <span className="input-icon input-icon-right">
                                <span>
                                    <i className={"flaticon2-search-1 icon-md text-dark-50"}></i>
                                </span>
                            </span>
                            <Form.Control className="form-control text-uppercase form-control-solid"
                                onChange={(e) => { this.onChangeSwal(e.target.value, tipo) }} name={tipo}
                                defaultValue={form[tipo]} as="select">
                                <option value={0}>{this.setSwalPlaceholder(tipo)}</option>
                                {this.setOptions(data, tipo).map((tipo, key) => { return (<option key={key} value={tipo.value} className="bg-white" >{tipo.text}</option>) })}
                            </Form.Control>
                        </div>
                        : <></>
                }
                {
                    tipo === 'fecha' ?
                        <CalendarDaySwal value={form[tipo]} onChange={(e) => { this.onChangeSwal(e.target.value, tipo) }} name={tipo} date={form[tipo]} withformgroup={0} />
                        : <></>
                }
                {
                    tipo === 'subarea' ?
                        flag ?
                            <DoubleSelectSearchGray options={options} form={form} onChange={this.onChangeSwal}
                                one={{ placeholder: 'SELECCIONA EL ÁREA', name: 'area', opciones: 'areas' }}
                                two={{ placeholder: 'SELECCIONA EL SUBÁREA', name: 'subarea', opciones: 'subareas' }} />
                            :
                            <SelectSearchGray options={options.subareas} placeholder='Selecciona el subárea' value={form.subarea}
                                onChange={(value) => { this.onChangeSwal(value, tipo) }} withtaglabel={1}
                                name={tipo} customdiv="mb-3" withicon={1} />
                        : ''
                }
                {
                    tipo === 'area' &&
                    <DoubleSelectSearchGray options={options} form={form} onChange={this.onChangeSwal}
                        one={{ placeholder: 'SELECCIONA EL ÁREA', name: 'area', opciones: 'areas' }}
                        two={{ placeholder: 'SELECCIONA EL SUBÁREA', name: 'subarea', opciones: 'subareas' }} />
                }
            </div>,
            <Update />,
            () => { this.patchEgresos(data, tipo, flag) },
            () => { this.setState({ ...this.state, form: this.clearForm() }); Swal.close(); },
        )
    }
    setSwalPlaceholder = (tipo) => {
        switch (tipo) {
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
        this.setState({ ...this.state, form })
    }
    setOptions = (data, tipo) => {
        const { options } = this.state
        switch (tipo) {
            case 'estatusCompra':
                return options.estatusCompras
            case 'tipoPago':
                return options.tiposPagos
            case 'tipoImpuesto':
                return options.tiposImpuestos
            default: return []
        }
    }
    patchEgresos = async (data, tipo, flag) => {
        const { access_token } = this.props.authUser
        const { form, filters } = this.state
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
                } else {
                    value = form[tipo]
                }
                break
            default:
                value = form[tipo]
                break
        }
        waitAlert()
        apiPutForm(`v2/administracion/egresos/${newType}/${data.id}`, { value: value }, access_token).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.', () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
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
        $(`#egresos`).DataTable().search(JSON.stringify(filter)).draw();
    }
    revertForm = (egreso) => {
        const { form } = this.state
        form.adjuntos.pago.value = null
        form.adjuntos.presupuesto.value = null
        form.adjuntos.facturas_pdf.value = null
        form.adjuntos.pago.files = []
        form.adjuntos.presupuesto.files = []
        form.adjuntos.facturas_pdf.files = []
        egreso.pagos.forEach(element => {
            form.adjuntos.pago.files.push(element);
        });
        egreso.presupuestos.forEach(element => {
            form.adjuntos.presupuesto.files.push(element);
        });
        egreso.facturas_pdf.forEach(element => {
            form.adjuntos.facturas_pdf.files.push(element);
        });
        return form
    }
    render() {
        const { facturas, form, options, egreso, modal, filters } = this.state
        const { access_token } = this.props.authUser
        return (
            <Layout active='administracion'  {...this.props}>
                <NewTable
                    tableName='egresos'
                    subtitle='Listado de egresos'
                    title='Egresos'
                    mostrar_boton={true}
                    abrir_modal={false}
                    accessToken={access_token}
                    columns={EGRESOS_COLUMNS}
                    setter={this.setEgresos}
                    url='/administracion/egresos/add'
                    urlRender={`${URL_DEV}v3/administracion/egreso`}
                    filterClick={this.openModalFiltros}
                    exportar_boton={true}
                    onClickExport = { () => { this.exportEgresosAxios() } }
                    validateFactura={true}
                    elementClass='total'
                    tipo_validacion='compras'
                />
                <Modal size="xl" title={"Facturas"} show={modal.facturas} handleClose={this.handleClose}>
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
                        </div>
                        {
                            form.adjuntos.factura.value &&
                            <div className="col-md-12 align-items-center d-flex mt-4">
                                <Button icon='' className="mx-auto" type="submit" text="ENVIAR" />
                            </div>
                        }
                    </Form>
                    <div className="separator separator-dashed separator-border-2 mb-6 mt-5"></div>
                    <FacturaTable deleteFactura={this.deleteFactura} facturas={facturas} />
                </Modal>
                <Modal size="xl" title={"Adjuntos"} show={modal.adjuntos} handleClose={this.handleClose}>
                    <AdjuntosForm form={form} onChangeAdjunto={this.handleChange}
                        clearFiles={this.clearFiles} deleteFile={this.openModalDeleteAdjuntos} />
                </Modal>
                <Modal size="lg" title="Egreso" show={modal.see} handleClose={this.handleClose} >
                    <EgresosCard egreso={egreso} />
                </Modal>
                <Modal size="lg" title="Factura extranjera" show={modal.facturaExtranjera} handleClose={this.handleClose} >
                    <FacturaExtranjera form={form} onChangeAdjunto={this.handleChange} deleteFile={this.openModalDeleteAdjuntos} />
                </Modal>
                <Modal size='xl' show={modal.filters} handleClose={this.handleClose} title='Filtros'>
                    <EngresosFilters at={access_token} sendFilters={this.sendFilters} filters={filters} options={options} setOptions={this.setOptionsArray} />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(egresos);