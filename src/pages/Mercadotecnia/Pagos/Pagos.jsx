import { connect } from 'react-redux'
import React, { Component } from 'react'
import axios from 'axios'
import Layout from '../../../components/layout/layout'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { PAGOS_COLUMNS, URL_DEV } from '../../../constants'
import { renderToString } from 'react-dom/server'
import { setArrayTable, setDateTable, setMoneyTable, setOptions, setSelectOptions, setTextTableCenter } from '../../../functions/setters'
import { Modal, ModalDelete } from '../../../components/singles'
import { errorAlert, waitAlert, printResponseErrorAlert, createAlert, deleteAlert, doneAlert, errorAlertRedirectOnDissmis, createAlertSA2WithActionOnClose } from '../../../functions/alert'
import AdjuntosForm from '../../../components/forms/AdjuntosForm'
import { PagosCard } from '../../../components/cards'
import Swal from 'sweetalert2'
import { Form } from 'react-bootstrap'
import { Button, FileInput } from '../../../components/form-components'
import Select from '../../../components/form-components/Select'
import { FacturaTable } from '../../../components/tables'
import $ from "jquery";
class Pagos extends Component {
    state = {
        modalDelete: false,
        modalAdjuntos: false,
        modalSee: false,
        modalFacturas: false,
        pagos: [],
        pago: '',
        data: {
            proveedores: [],
            empresas: [],
            pagos: []
        },
        form: {
            formaPago: '',
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
                }
            }
        },
        facturas: [],
        options: {
            formasPagos: [],
            metodosPagos: [],
            estatusFacturas: [],
            estatusCompras: []
        }
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const pago = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!pago)
            history.push('/')
        this.getOptionsAxios()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                this.setState({
                    ...this.state,
                    modalSee: true
                })
                this.getPagosAxios(id)
            }
        }
    }

    setPagos = pagos => {
        let aux = []
        let _aux = []
        pagos.map((pago) => {
            _aux = []
            if (pago.presupuestos) {
                pago.presupuestos.map((presupuesto) => {
                    _aux.push({ name: 'Presupuesto', text: presupuesto.name, url: presupuesto.url })
                    return false
                })
            }
            if (pago.pagos) {
                pago.pagos.map((_pago) => {
                    _aux.push({ name: 'Pago', text: _pago.name, url: _pago.url })
                    return false
                })
            }
            aux.push(
                {
                    actions: this.setActions(pago),
                    identificador: renderToString(setTextTableCenter(pago.id)),
                    fecha: renderToString(setDateTable(pago.created_at)),
                    proveedor: renderToString(pago.proveedor ? setTextTableCenter(pago.proveedor.razon_social) : ''),
                    factura: renderToString(setTextTableCenter(pago.factura ? 'Con factura' : 'Sin factura')),
                    subarea: renderToString(setTextTableCenter(pago.subarea ? pago.subarea.nombre : '')),
                    monto: renderToString(setMoneyTable(pago.monto)),
                    comision: renderToString(setMoneyTable(pago.comision ? pago.comision : 0.0)),
                    total: renderToString(setMoneyTable(pago.total)),
                    cuenta: renderToString(setArrayTable(
                        [
                            { name: 'Empresa', text: pago.empresa ? pago.empresa.name : '' },
                            { name: 'Cuenta', text: pago.cuenta ? pago.cuenta.nombre : '' },
                            { name: 'No. de cuenta', text: pago.cuenta ? pago.cuenta.numero : '' }
                        ],'190px'
                    )),
                    pago: renderToString(setTextTableCenter(pago.tipo_pago ? pago.tipo_pago.tipo : '')),
                    impuesto: renderToString(setTextTableCenter(pago.tipo_impuesto ? pago.tipo_impuesto.tipo : 'Sin definir')),
                    estatus: renderToString(setTextTableCenter(pago.estatus_compra ? pago.estatus_compra.estatus : '')),
                    id: pago.id
                }
            )
            return false
        })
        return aux
    }

    setActions = (pago) => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' },
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' },
            },
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            },
            {
                text: 'Adjuntos',
                btnclass: 'info',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            }
        )
        if (pago.factura) {
            aux.push({
                text: 'Facturas',
                btnclass: 'dark',
                iconclass: 'flaticon2-paper',
                action: 'facturas',
                tooltip: { id: 'taxes', text: 'Facturas' },
            })
        }
        return aux
    }

    async getPagosAxios() { $('#kt_table_pagos').DataTable().ajax.reload(); }

    changePageEdit = (pago) => {
        const { history } = this.props
        history.push({
            pathname: '/mercadotecnia/pagos/edit',
            state: { pago: pago }
        });
    }

    deleteFile = element => {
        deleteAlert('DESEAS ELIMINAR EL ARCHIVO', element.name, () => this.deleteAdjuntoAxios(element.id))
    }

    openModalDelete = pago => {
        this.setState({
            ...this.state,
            modalDelete: true,
            pago: pago
        })
    }

    openModalAdjuntos = pago => {
        const { form } = this.state
        form.adjuntos.presupuesto.files = pago.presupuestos
        form.adjuntos.pago.files = pago.pagos
        this.setState({ ...this.state, modalAdjuntos: true, pago: pago, form })
    }

    openModalSee = pago => {
        this.setState({
            ...this.state,
            modalSee: true,
            pago: pago
        })
    }

    openModalFacturas = pago => {
        let { porcentaje, form } = this.state
        form = this.clearForm()
        form.estatusCompra = pago.estatus_compra.id
        porcentaje = 0
        pago.facturas.map((factura) => {
            porcentaje = porcentaje + factura.total
            return false
        })
        porcentaje = porcentaje * 100 / (pago.total - pago.comision)
        porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
        this.setState({
            ...this.state,
            modalFacturas: true,
            pago: pago,
            facturas: pago.facturas,
            porcentaje,
            form
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ...this.state,
            modalDelete: !modalDelete,
            pago: ''
        })
    }

    handleCloseAdjuntos = () => {
        this.setState({
            ...this.state,
            modalAdjuntos: false,
            form: this.clearForm(),
            pago: ''
        })
    }

    handleCloseSee = () => {
        this.setState({
            ...this.state,
            modalSee: false,
            pago: ''
        })
    }

    handleCloseFacturas = () => {
        this.setState({
            ...this.state,
            modalFacturas: false,
            venta: '',
            facturas: [],
            porcentaje: 0,
            form: this.clearForm()
        })
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
            () => this.addAdjuntoPagosAxios(files, item),
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
                            if(element.rfc)
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
                            if(obj.nombre_emisor === ''){
                                const { history } = this.props
                                errorAlertRedirectOnDissmis('LA FACTURA NO TIENE RAZÓN SOCIAL, CREA EL PROVEEDOR DESDE LA SECCIÓN DE PROVEEDORES EN LEADS.', history, '/leads/proveedores')
                            }else
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
                        }
                    }
                    break;
                case 'estatusCompra':
                    form[element] = 0
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
    }

    deleteFactura = id => {
        waitAlert()
        this.deleteFacturaAxios(id)
    }

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
        await axios.post(URL_DEV + 'proveedores', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
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
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deletePagoAxios = async () => {
        const { access_token } = this.props.authUser
        const { pago } = this.state
        await axios.delete(`${URL_DEV}mercadotecnia/pagos/${pago.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getPagosAxios()
                this.setState({ ...this.state, modalDelete: false, pago: '' })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El pago fue eliminado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    addAdjuntoPagosAxios = async ( files, item ) => {
        const { access_token } = this.props.authUser
        const { pago } = this.state
        const data = new FormData();
        files.map((file) => {
            data.append(`files_name_${item}[]`, file.name)
            data.append(`files_${item}[]`, file)
            return ''
        })
        data.append('tipo', item)
        data.append('pago', pago.id)
        await axios.post(`${URL_DEV}mercadotecnia/pagos/adjuntos`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { pago } = response.data
                const { form } = this.state
                form.adjuntos.pago.files = pago.pagos
                form.adjuntos.presupuesto.files = pago.presupuestos
                this.setState({...this.state, form, pago: pago})
                this.getPagosAxios()
                doneAlert('Archivo adjuntado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    deleteAdjuntoAxios = async(id) => {
        const { pago } = this.state
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}mercadotecnia/pagos/${pago.id}/adjunto/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { pago } = response.data
                const { form } = this.state
                if(pago.presupuestos)
                    form.adjuntos.presupuesto.files = pago.presupuestos
                if(pago.pagos)
                    form.adjuntos.pago.files = pago.pagos
                this.setState({...this.state, form, pago: pago})
                this.getPagosAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste el adjunto con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    sendFacturaAxios = async () => {
        const { access_token } = this.props.authUser
        const { form, pago } = this.state
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
        form.adjuntos.factura.files.map((file) => {
            data.append(`files_name_factura[]`, file.name)
            data.append(`files_factura[]`, file.file)
            return ''
        })
        data.append('id', pago.id)
        await axios.post(`${URL_DEV}mercadotecnia/pagos/factura`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { pago } = response.data
                let { form } = this.state
                form = this.clearForm()
                form.estatusCompra = pago.estatus_compra.id
                this.getPagosAxios()
                this.setState({...this.state, form, pago: pago, facturas: pago.facturas })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deleteFacturaAxios = async (id) => {
        const { access_token } = this.props.authUser
        const { pago } = this.state
        await axios.delete(URL_DEV + 'pagos/' + pago.id + '/facturas/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { pago } = response.data
                let { porcentaje, data } = this.state
                porcentaje = 0
                pago.facturas.map((factura) => {
                    porcentaje = porcentaje + factura.total
                    return false
                })
                porcentaje = porcentaje * 100 / (pago.total - pago.comision)
                porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
                this.getEgresosAxios()
                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    pago: pago,
                    facturas: pago.facturas,
                    data,
                    porcentaje
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    getOptionsAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'mercadotecnia/pagos/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data, options } = this.state
                const { proveedores, empresas, estatusCompras } = response.data
                data.proveedores = proveedores
                data.empresas = empresas
                options['estatusCompras'] = setSelectOptions(estatusCompras, 'estatus')
                Swal.close()
                this.setState({ ...this.state, data, options })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    render() {
        const { modalDelete, modalAdjuntos, modalFacturas, form, modalSee, pago, options, facturas} = this.state
        return (
            <Layout active='mercadotecnia' {...this.props}>
                <NewTableServerRender
                    columns={PAGOS_COLUMNS}
                    title='Listado de pagos'
                    subtitle='Listado de pagos'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url='/mercadotecnia/pagos/add'
                    mostrar_acciones={true}
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete },
                        'facturas': { function: this.openModalFacturas },
                        'adjuntos': { function: this.openModalAdjuntos },
                        'see': { function: this.openModalSee }
                    }}
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    idTable='kt_table_pagos'
                    accessToken={this.props.authUser.access_token}
                    setter={this.setPagos}
                    urlRender={`${URL_DEV}mercadotecnia/pagos`}
                />
                <ModalDelete title={"¿Estás seguro que deseas eliminar el pago?"} show={modalDelete} handleClose={this.handleCloseDelete} onClick={(e) => { e.preventDefault(); waitAlert(); this.deletePagoAxios() }}>
                </ModalDelete>
                <Modal size = "xl" title = "Adjuntos" show = { modalAdjuntos } handleClose = { this.handleCloseAdjuntos } >
                    <AdjuntosForm  form = { form } onChangeAdjunto = { this.handleChange } clearFiles = { this.clearFiles } deleteFile = { this.deleteFile } />
                </Modal>
                <Modal size="lg" title="Pago" show={modalSee} handleClose={this.handleCloseSee} >
                    <PagosCard pago={pago} />
                </Modal>
                <Modal size="xl" title={"Facturas"} show={modalFacturas} handleClose={this.handleCloseFacturas}>
                    <Form onSubmit={(e) => { e.preventDefault(); waitAlert(); this.sendFacturaAxios(); }}>
                        <div className="row mx-0 pt-4">
                            <div className="col-md-6 px-2">
                                <Select requirevalidation = { 1 } formeditado = { 1 } placeholder = "SELECCIONA EL ESTATUS DE COMPRA"
                                    options = { options.estatusCompras } name = "estatusCompra" value = { form.estatusCompra }
                                    onChange = { this.onChange } iconclass = "flaticon2-time" 
                                    messageinc="Incorrecto. Selecciona el estatus de compra." />
                            </div>
                            <div className="col-md-6 px-2 text-center align-self-center">
                                <FileInput onChangeAdjunto = { this.onChangeAdjunto } placeholder = { form.adjuntos.factura.placeholder }
                                    value = { form.adjuntos.factura.value } name = 'factura' id = 'factura' accept = "text/xml, application/pdf"
                                    files = { form.adjuntos.factura.files } deleteAdjunto = { this.clearFiles } multiple
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
                    <FacturaTable deleteFactura = { this.deleteFactura } facturas = { facturas } />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Pagos)