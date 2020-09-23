import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, COMPRAS_COLUMNS, ADJUNTOS_COLUMNS } from '../../constants'
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setAdjuntosList } from '../../functions/setters'
import { errorAlert, waitAlert, createAlert, forbiddenAccessAlert, deleteAlert, doneAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Button, FileInput } from '../../components/form-components'
import { Modal, ModalDelete } from '../../components/singles'
import { ComprasForm } from '../../components/forms'
import { FacturaTable } from '../../components/tables'
import { SolicitudCompraCard, ComprasCard } from '../../components/cards'
import { Form, ProgressBar } from 'react-bootstrap'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import TableForModals from '../../components/tables/TableForModals'
import AdjuntosForm from '../../components/forms/AdjuntosForm'
import Select from '../../components/form-components/Select'

const $ = require('jquery');

class Compras extends Component {

    state = {
        modal: false,
        modalDelete: false,
        modalFacturas: false,
        modalAskFactura: false,
        modalSee: false,
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
                }
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
            contratos: []
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
        adjuntos: []
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const compras = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!compras)
            history.push('/')
        this.getOptionsAxios()
        const { state } = this.props.location
        if (state) {
            if (state.solicitud) {
                this.getSolicitudCompraAxios(state.solicitud.id)
            }
        }
    }

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }

    setAdjuntosTable = compra => {
        let aux = []

        let adjuntos = compra.presupuestos.concat(compra.pagos)
        adjuntos.map((adjunto) => {
            aux.push({
                actions: this.setActionsAdjuntos(adjunto),
                url: renderToString(
                    setAdjuntosList([{ name: adjunto.name, url: adjunto.url }])
                ),
                tipo: renderToString(setTextTable(adjunto.pivot.tipo)),
                id: 'adjuntos-' + adjunto.id
            })
        })
        return aux
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
                })
            }
            if (compra.pagos) {
                compra.pagos.map((pago) => {
                    _aux.push({
                        name: 'Pago', text: pago.name, url: pago.url
                    })
                })
            }
            aux.push(
                {
                    actions: this.setActions(compra),
                    identificador: renderToString(setTextTable(compra.id)),
                    cuenta: renderToString(setArrayTable(
                        [
                            { name: 'Empresa', text: compra.empresa ? compra.empresa.name : '' },
                            { name: 'Cuenta', text: compra.cuenta ? compra.cuenta.nombre : '' },
                            { name: '# de cuenta', text: compra.cuenta ? compra.cuenta.numero : '' }
                        ]
                    )),
                    proyecto: renderToString(setTextTable(compra.proyecto ? compra.proyecto.nombre : '')),
                    proveedor: renderToString(setTextTable(compra.proveedor ? compra.proveedor.razon_social : '')),
                    factura: renderToString(setTextTable(compra.factura ? 'Con factura' : 'Sin factura')),
                    monto: renderToString(setMoneyTable(compra.monto)),
                    comision: renderToString(setMoneyTable(compra.comision ? compra.comision : 0.0)),
                    impuesto: renderToString(setTextTable(compra.tipo_impuesto ? compra.tipo_impuesto.tipo : 'Sin definir')),
                    tipoPago: renderToString(setTextTable(compra.tipo_pago.tipo)),
                    descripcion: renderToString(setTextTable(compra.descripcion)),
                    area: renderToString(setTextTable(compra.subarea ? compra.subarea.area ? compra.subarea.area.nombre : '' : '')),
                    subarea: renderToString(setTextTable(compra.subarea ? compra.subarea.nombre : '')),
                    estatusCompra: renderToString(setTextTable(compra.estatus_compra ? compra.estatus_compra.estatus : '')),
                    total: renderToString(setMoneyTable(compra.total)),
                    adjuntos: renderToString(setArrayTable(_aux)),
                    fecha: renderToString(setDateTable(compra.created_at)),
                    id: compra.id,
                    objeto: compra
                }
            )
        })
        return aux
    }

    setActionsAdjuntos = () => {
        let aux = []
        aux.push(
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'deleteAdjunto',
                tooltip: { id: 'delete-Adjunto', text: 'Eliminar', type: 'error' },
            })
        return aux
    }

    setActions = compra => {
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
                text: 'Adjuntos',
                btnclass: 'primary',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            },
            {
                text: 'Ver',
                btnclass: 'info',
                iconclass: 'flaticon2-expand',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            }
        )

        if (compra.factura) {
            aux.push(
                {
                    text: 'Facturas',
                    btnclass: 'primary',
                    iconclass: 'flaticon2-medical-records',
                    action: 'facturas',
                    tooltip: { id: 'taxes', text: 'Facturas' },
                }
            )
        }
        return aux

    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true,
            title: 'Nueva compra',
            form: this.clearForm(),
            formeditado: 0
        })
    }

    openModalEdit = (compra) => {
        const { form, options } = this.state
        form.factura = compra.factura ? 'Con factura' : 'Sin factura'
        if (compra.proyecto) {
            if (compra.proyecto.clientes) {
                form.proyecto = compra.proyecto.id.toString()
            }
        }
        if (compra.empresa) {
            form.empresa = compra.empresa.id.toString()
            options['cuentas'] = setOptions(compra.empresa.cuentas, 'nombre', 'id')
            if (compra.cuenta)
                form.cuenta = compra.cuenta.id.toString()
        }
        if (compra.subarea) {
            form.area = compra.subarea.area.id.toString()
            options['subareas'] = setOptions(compra.subarea.area.subareas, 'nombre', 'id')
            form.subarea = compra.subarea.id.toString()
        }



        form.tipoPago = compra.tipo_pago ? compra.tipo_pago.id : 0
        form.tipoImpuesto = compra.tipo_impuesto ? compra.tipo_impuesto.id : 0
        form.estatusCompra = compra.estatus_compra ? compra.estatus_compra.id : 0
        form.total = compra.monto
        form.fecha = new Date(compra.created_at)
        form.descripcion = compra.descripcion
        form.comision = compra.comision
        if (compra.proveedor) {
            options['contratos'] = setOptions(compra.proveedor.contratos, 'nombre', 'id')
            form.proveedor = compra.proveedor.id.toString()
            form.rfc = compra.proveedor.rfc
            if (compra.contrato) {
                form.contrato = compra.contrato.id.toString()
            }
        }
        if (compra.pago) {
            form.adjuntos.pago.files = [{
                name: compra.pago.name, url: compra.pago.url
            }]
        }
        if (compra.presupuesto) {
            form.adjuntos.presupuesto.files = [{
                name: compra.presupuesto.name, url: compra.presupuesto.url
            }]
        }
        this.setState({
            ... this.state,
            modal: true,
            compra: compra,
            form,
            options,
            title: 'Editar compra',
            formeditado: 1
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            form: this.clearForm(),
            title: 'Nueva venta'
        })
    }

    openModalDelete = (compra) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            compra: compra
        })
    }

    openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿Seguro deseas borrar el adjunto?', () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            compra: ''
        })
    }

    openModalFacturas = compra => {
        let { porcentaje, form } = this.state
        form = this.clearForm()
        form.estatusCompra = compra.estatus_compra.id
        porcentaje = compra.total_facturas * 100 / (compra.total - compra.comision)
        porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
        this.setState({
            ... this.state,
            modalFacturas: true,
            compra: compra,
            facturas: compra.facturas,
            porcentaje,
            form,
            formeditado: 0
        })
    }

    openModalAdjuntos = compra => {
        const { data } = this.state
        data.adjuntos = compra.presupuestos.concat(compra.pagos)
        this.setState({
            ... this.state,
            modalAdjuntos: true,
            compra: compra,
            form: this.clearForm(),
            formeditado: 0,
            adjuntos: this.setAdjuntosTable(compra),
            data
        })
    }

    handleCloseFacturas = () => {
        this.setState({
            ... this.state,
            modalFacturas: false,
            venta: '',
            facturas: [],
            porcentaje: 0,
            form: this.clearForm()
        })
    }

    handleCloseAdjuntos = () => {
        const { data } = this.state
        data.adjuntos = []
        this.setState({
            ... this.state,
            modalAdjuntos: false,
            form: this.clearForm(),
            adjuntos: [],
            data
        })
    }

    openModalSee = compra => {
        this.setState({
            ... this.state,
            modalSee: true,
            compra: compra
        })
    }

    handleCloseSee = () => {
        this.setState({
            ... this.state,
            modalSee: false,
            compra: ''
        })
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
                        }
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }

    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
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
                        });
                        let auxProveedor = ''
                        data.proveedores.find(function (element, index) {
                            let cadena = obj.nombre_emisor.replace(' S. C.', ' SC').toUpperCase()
                            cadena = cadena.replace(',S.A.', ' SA').toUpperCase()
                            cadena = cadena.replace(/,/g, '').toUpperCase()
                            cadena = cadena.replace(/\./g, '').toUpperCase()
                            if (element.razon_social.toUpperCase() === obj.nombre_emisor.toUpperCase() ||
                                element.razon_social.toUpperCase() === cadena) {
                                auxProveedor = element
                            }
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
                            createAlert('No existe el proveedor', '¿Lo quieres crear?', () => this.addProveedorAxios(obj))
                        }
                        if (auxEmpresa && auxProveedor) {
                            swal.close()
                        }
                        form.facturaObject = obj
                        form.rfc = obj.rfc_emisor
                        this.setState({
                            ... this.state,
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
            ... this.state,
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
            ... this.state,
            form
        })
    }
    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar compra')
            this.editCompraAxios()
        else
            this.addCompraAxios()
    }
    deleteFactura = id => {
        waitAlert()
        this.deleteFacturaAxios(id)
    }
    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(URL_DEV + 'compras/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras, proyectos,
                    proveedores, formasPago, metodosPago, estatusFacturas } = response.data
                const { options, data } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
                options['tiposImpuestos'] = setSelectOptions(tiposImpuestos, 'tipo')
                options['estatusCompras'] = setSelectOptions(estatusCompras, 'estatus')
                options['estatusFacturas'] = setOptions(estatusFacturas, 'estatus', 'id')
                options['formasPago'] = setOptions(formasPago, 'nombre', 'id')
                options['metodosPago'] = setOptions(metodosPago, 'nombre', 'id')
                data.proveedores = proveedores
                data.empresas = empresas
                this.setState({
                    ... this.state,
                    options,
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async getComprasAxios() {
        var table = $('#kt_datatable2_compras').DataTable().ajax.reload();
    }
    async addCompraAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                case 'facturaObject':
                    data.append(element, JSON.stringify(form[element]))
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })
        await axios.post(URL_DEV + 'compras', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getComprasAxios()
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    modal: false
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addAdjuntoCompraAxios() {
        const { access_token } = this.props.authUser
        const { form, compra } = this.state
        const data = new FormData();
        let aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })
        data.append('id', compra.id)
        await axios.post(URL_DEV + 'compras/adjuntos', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { compra } = response.data
                const { data } = this.state
                data.adjuntos = compra.presupuestos.concat(compra.pagos)
                this.getComprasAxios()
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    compra: compra,
                    adjuntos: this.setAdjuntosTable(compra),
                    modal: false,
                    data
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
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
        await axios.post(URL_DEV + 'proveedores', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proveedores } = response.data
                const { options, data, form } = this.state
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                data.proveedores = proveedores
                proveedores.map((proveedor) => {
                    if (proveedor.razon_social === cadena) {
                        form.proveedor = proveedor.id.toString()
                    }
                })
                this.setState({
                    ... this.state,
                    form,
                    data,
                    options
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async editCompraAxios() {
        const { access_token } = this.props.authUser
        const { form, compra } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                case 'facturaObject':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
        })
        await axios.post(URL_DEV + 'compras/update/' + compra.id, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getComprasAxios()
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    modal: false
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async deleteCompraAxios() {
        const { access_token } = this.props.authUser
        const { compra } = this.state
        await axios.delete(URL_DEV + 'compras/' + compra.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getComprasAxios()
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    modalDelete: false,
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue eliminado con éxito.')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async getSolicitudCompraAxios(id) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'solicitud-compra/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { solicitud } = response.data
                const { options, form } = this.state
                form.solicitud = solicitud.id
                form.factura = solicitud.factura ? 'Con factura' : 'Sin factura'
                if (solicitud.factura) {
                    let aux = ''
                    options.tiposImpuestos.find(function (element, index) {
                        if (element.text === 'IVA')
                            aux = element.value
                    });
                    form.tipoImpuesto = aux
                }
                if (solicitud.proveedor) {
                    form.proveedor = solicitud.proveedor.id.toString()
                    form.rfc = solicitud.proveedor.rfc
                    if (solicitud.proveedor.contratos) {
                        options['contratos'] = setOptions(solicitud.proveedor.contratos, 'nombre', 'id')
                    }
                }
                if (solicitud.proyecto) {
                    if (solicitud.proyecto.clientes) {
                        if (solicitud.proyecto.clientes.proyectos) {
                            options['proyectos'] = setOptions(solicitud.proyecto.clientes.proyectos, 'nombre', 'id')
                            form.proyecto = solicitud.proyecto.id.toString()
                        }
                    }
                }
                if (solicitud.empresa) {
                    if (solicitud.empresa.cuentas) {
                        options['cuentas'] = setOptions(solicitud.empresa.cuentas, 'nombre', 'id')
                        form.empresa = solicitud.empresa.id.toString()
                    }
                }
                if (solicitud.subarea) {
                    if (solicitud.subarea.area) {
                        if (solicitud.subarea.area.subareas) {
                            options['subareas'] = setOptions(solicitud.subarea.area.subareas, 'nombre', 'id')
                            form.area = solicitud.subarea.area.id.toString()
                            form.subarea = solicitud.subarea.id.toString()
                        }
                    }
                }
                if (solicitud.tipo_pago) {
                    form.tipoPago = solicitud.tipo_pago.id
                }
                if (solicitud.monto) {
                    form.total = solicitud.monto
                }
                if (solicitud.descripcion) {
                    form.descripcion = solicitud.descripcion
                }
                this.setState({
                    ... this.state,
                    title: 'Convierte la solicitud de compra',
                    solicitud: solicitud,
                    modal: true,
                    form,
                    options,
                    formeditado: 1
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async sendFacturaAxios() {
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
                default:
                    break
            }
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
        })
        data.append('id', compra.id)
        await axios.post(URL_DEV + 'compras/factura', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getComprasAxios()
                const { compra } = response.data
                let { porcentaje, form } = this.state
                form = this.clearForm()
                form.estatusCompra = compra.estatus_compra.id
                porcentaje = compra.total_facturas * 100 / (compra.total - compra.comision)
                porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
                this.setState({
                    ... this.state,
                    form,
                    compra: compra,
                    facturas: compra.facturas,
                    porcentaje
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async deleteAdjuntoAxios(id) {
        const { access_token } = this.props.authUser
        const { compra } = this.state
        await axios.delete(URL_DEV + 'compras/' + compra.id + '/adjuntos/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { compra } = response.data
                const { data } = this.state
                data.adjuntos = compra.presupuestos.concat(compra.pagos)
                this.getComprasAxios()
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    compra: compra,
                    adjuntos: this.setAdjuntosTable(compra),
                    data
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteFacturaAxios(id) {
        const { access_token } = this.props.authUser
        const { compra } = this.state
        await axios.delete(URL_DEV + 'compras/' + compra.id + '/facturas/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getComprasAxios()
                const { compra } = response.data
                let { porcentaje } = this.state
                porcentaje = compra.total_facturas * 100 / (compra.total - compra.comision)
                porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    compra: compra,
                    facturas: compra.facturas,
                    porcentaje
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async exportComprasAxios() {
        let headers = []
        let documento = ''
        COMPRAS_COLUMNS.map((columna, key) => {
            if (columna !== 'actions' && columna !== 'adjuntos') {
                documento = document.getElementById(columna.accessor)
                if (documento) {
                    if (documento.value) {
                        headers.push({
                            name: columna.accessor,
                            value: documento.value
                        })
                    }
                }
            }
        })
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'exportar/compras', { columnas: headers }, { responseType: 'blob', headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'compras.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    render() {
        const {
            modal, modalDelete, modalFacturas, modalAdjuntos,title, form, options,solicitud, compras, porcentaje, facturas, compra, data, formeditado, adjuntos,modalSee} = this.state
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <NewTableServerRender columns={COMPRAS_COLUMNS} data={compras}
                    title='Compras' subtitle='Listado de compras'
                    mostrar_boton={true}
                    abrir_modal={true}
                    onClick={this.openModal}
                    mostrar_acciones={true}
                    actions={{
                        'edit': { function: this.openModalEdit },
                        'delete': { function: this.openModalDelete },
                        'facturas': { function: this.openModalFacturas },
                        'adjuntos': { function: this.openModalAdjuntos },
                        'see': { function: this.openModalSee },
                    }}
                    elements={data.compras}
                    exportar_boton={true}
                    onClickExport={() => this.exportComprasAxios()}
                    accessToken={this.props.authUser.access_token}
                    setter={this.setCompras}
                    urlRender={URL_DEV + 'compras'}
                    idTable='kt_datatable2_compras'
                    validateFactura={true}
                    tipo_validacion='compras'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />
                <Modal size="xl" title={title} show={modal} handleClose={this.handleClose} >
                    <ComprasForm
                        options={options}
                        form={form}
                        setOptions={this.setOptions}
                        data={data}
                        title={title}
                        onChange={this.onChange}
                        onChangeAdjunto={this.onChangeAdjunto}
                        clearFiles={this.clearFiles}
                        sendFactura={() => { this.sendFactura() }}
                        onSubmit={this.onSubmit}
                        formeditado={formeditado}
                        className="px-3"
                    >
                        {
                            solicitud ?
                                <SolicitudCompraCard solicitud={solicitud} formeditado={formeditado} border={"border-nav mt-4 mb-5"} />
                                : ''
                        }
                    </ComprasForm>
                </Modal>
                <ModalDelete title={"¿Estás seguro que deseas eliminar la compra?"} show={modalDelete} handleClose={this.handleCloseDelete} onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteCompraAxios() }}>
                </ModalDelete>
                <Modal size="xl" title={"Facturas"} show={modalFacturas} handleClose={this.handleCloseFacturas}>
                    <div className="form-group row form-group-marginless pt-4">
                        <div className="col-md-12">
                            <ProgressBar animated label={`${porcentaje}`}
                                variant={porcentaje > 100 ? 'danger' : porcentaje > 75 ? 'success' : 'warning'}
                                now={porcentaje} />
                        </div>
                    </div>
                    <Form onSubmit={(e) => { e.preventDefault(); waitAlert(); this.sendFacturaAxios(); }}>
                        <div className="row mx-0">
                            <div className="col-md-6 px-2">
                                <FileInput
                                    onChangeAdjunto={this.onChangeAdjunto}
                                    placeholder={form['adjuntos']['factura']['placeholder']}
                                    value={form['adjuntos']['factura']['value']}
                                    name={'factura'}
                                    id={'factura'}
                                    accept="text/xml, application/pdf"
                                    files={form['adjuntos']['factura']['files']}
                                    deleteAdjunto={this.clearFiles} multiple />
                            </div>
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
                            <div className="col-md-12 px-2 align-items-center d-flex">
                                <Button icon='' className="mx-auto" type="submit" text="ENVIAR" />
                            </div>
                        </div>
                    </Form>
                    <FacturaTable deleteFactura={this.deleteFactura} facturas={facturas} />
                </Modal>
                <Modal size="xl" title={"Adjuntos"} show={modalAdjuntos} handleClose={this.handleCloseAdjuntos}>
                    <AdjuntosForm
                        form={form}
                        onChangeAdjunto={this.onChangeAdjunto}
                        clearFiles={this.clearFiles}
                        onSubmit={(e) => { e.preventDefault(); waitAlert(); this.addAdjuntoCompraAxios() }}
                    />
                    <TableForModals
                        columns={ADJUNTOS_COLUMNS}
                        data={adjuntos}
                        hideSelector={true}
                        mostrar_acciones={true}
                        actions={{
                            'deleteAdjunto': { function: this.openModalDeleteAdjuntos }
                        }}
                        dataID='adjuntos'
                        elements={data.adjuntos}
                    />
                </Modal>
                <Modal size="lg" title="Compra" show={modalSee} handleClose={this.handleCloseSee} >
                    <ComprasCard
                        compra={compra}
                    />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Compras);