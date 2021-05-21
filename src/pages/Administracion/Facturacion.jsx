import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, FACTURAS_COLUMNS } from '../../constants'
import { setTextTable, setMoneyTable, setDateTable, setOptions, setLabelTable, setTextTableCenter } from '../../functions/setters'
import { errorAlert, doneAlert, waitAlert, createAlert, questionAlertY, printResponseErrorAlert, createAlertSA2WithActionOnClose, deleteAlert } from '../../functions/alert'
import { Modal, ItemSlider, ItemDoubleSlider } from '../../components/singles'
import { Button, FileInput } from '../../components/form-components'
import { Tabs, Tab, Form } from 'react-bootstrap'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { FacturacionCard } from '../../components/cards'
import NumberFormat from 'react-number-format'
import Swal from 'sweetalert2'
import $ from "jquery";
class Facturacion extends Component {

    state = {
        formeditado: 0,
        modalFacturas: false,
        modalCancelar: false,
        modalSee: false,
        modalRestante: false,
        modalFacturaRelacionada: false,
        facturas: [],
        factura: '',
        empresas: [],
        data: {
            facturas: []
        },
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
        form: {
            facturaObject: '',
            adjuntos: {
                factura: {
                    value: '',
                    placeholder: 'Adjuntar factura',
                    files: []
                }, adjuntos: {
                    value: '',
                    placeholder: 'Ingresa los adjuntos',
                    files: []
                },relacionados:{
                    value: '',
                    placeholder: 'Facturas relacionadas',
                    files: []
                }
            }
        },
        tipo: 'Ventas',
        key: 'ventas'
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        let { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const conceptos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!conceptos)
            history.push('/')
        this.getOptionsAxios()
        this.getRestante()
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'facturas/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas, clientes } = response.data
                const { data } = this.state
                data.clientes = clientes
                data.empresas = empresas
                Swal.close()
                this.setState({
                    ...this.state,
                    data
                })
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getRestante() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'facturas/ventas/restante', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas } = response.data
                const { data } = this.state
                data.empresas = empresas
                this.setState({
                    ...this.state,
                    data
                })
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    setFactura = facturas => {
        let aux = []
        facturas.map((factura) => {
            aux.push(
                {
                    actions: this.setActions(factura),
                    folio: renderToString(setTextTableCenter(factura.folio)),
                    estatus: renderToString(this.setLabelTable(factura)),
                    fecha: renderToString(setDateTable(factura.fecha)),
                    serie: renderToString(setTextTableCenter(factura.serie)),
                    emisor: renderToString(this.setInfoTable(factura.rfc_emisor, factura.nombre_emisor)),
                    receptor: renderToString(this.setInfoTable(factura.rfc_receptor, factura.nombre_receptor)),
                    subtotal: renderToString(setMoneyTable(factura.subtotal)),
                    total: renderToString(setMoneyTable(factura.total)),
                    acumulado: renderToString(setMoneyTable(factura.ventas_compras_count + factura.ingresos_egresos_count)),
                    restante: renderToString(setMoneyTable(factura.total - factura.ventas_compras_count - factura.ingresos_egresos_count)),
                    adjuntos: renderToString(this.setAdjuntosTable(factura)),
                    descripcion: renderToString(setTextTable(factura.descripcion)),
                    noCertificado: renderToString(setTextTableCenter(factura.numero_certificado)),
                    usoCFDI: renderToString(setTextTableCenter(factura.uso_cfdi)),
                    id: factura.id,
                    objeto: factura
                }
            )
            return false
        })
        return aux
    }

    openModalSee = factura => {
        this.setState({
            ...this.state,
            modalSee: true,
            factura: factura
        })
    }

    handleCloseSee = () => {
        this.setState({
            ...this.state,
            modalSee: false,
            factura: ''
        })
    }

    setActions = factura => {
        let aux = []
        aux.push(
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'primary' },
            },
            {
                text: 'Factura&nbsp;relacionada',
                btnclass: 'warning',
                iconclass: 'flaticon-interface-10',
                action: 'facturaRelacionada',
                tooltip: { id: 'facturaRelacionada', text: 'Factura extranjera'},
            }
        )
        if (!factura.detenida) {
            aux.push(
                {
                    text: 'Inhabilitar&nbsp;factura',
                    btnclass: 'info',
                    iconclass: 'flaticon2-lock',
                    action: 'inhabilitar',
                    tooltip: { id: 'inhabilitar', text: 'Inhabilitar factura', type: 'info' },
                })
        }
        if (!factura.cancelada) {
            aux.push(
                {
                    text: 'Cancelar',
                    btnclass: 'danger',
                    iconclass: "flaticon-circle",
                    action: 'cancelarFactura',
                    tooltip: { id: 'delete-Adjunto', text: 'Cancelar', type: 'error' },
                })
        }
        if (factura.cancelada) {
            aux.push(
                {
                    text: 'Mostrar&nbsp;adjuntos',
                    btnclass: 'info',
                    iconclass: "flaticon-attachment",
                    action: 'cancelarFactura',
                    tooltip: { id: 'delete-Adjunto', text: 'Eliminar', type: 'error' },
                })
        }
        return aux
    }

    deleteRelacionada = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', '', () => this.deleteAdjuntoAxios(element.id))
    }

    inhabilitar = (factura) => {
        questionAlertY('¿ESTÁS SEGURO?', '¿DESEAS INHABILITAR LA FACTURA?', () => this.inhabilitarFactura(factura))
    }

    deleteAdjuntoAxios = async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { factura, form } = this.state
        await axios.delete(`${URL_DEV}v2/administracion/facturas/${factura.id}/relacionadas/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key } = this.state
                const { factura } = response.data
                form.adjuntos.relacionados.files = []
                factura.relacionadas.forEach(element => {
                    form.adjuntos.relacionados.files.push(element)
                });
                if (key === 'compras') 
                    this.getComprasAxios()
                if (key === 'ventas') 
                    this.getVentasAxios()
                doneAlert('La factura fue inhabilitado con éxito.')
                this.setState({ ...this.state,form })
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async inhabilitarFactura(factura) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'facturas/detener/' + factura.id, {}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key } = this.state
                if (key === 'compras') {
                    this.getComprasAxios()
                }
                if (key === 'ventas') {
                    this.getVentasAxios()
                }
                doneAlert('La factura fue inhabilitado con éxito.')
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    setLabelTable = objeto => {
        let restante = objeto.total - objeto.ventas_compras_count - objeto.ingresos_egresos_count
        let text = {}
        if (objeto.detenida) {
            text.letra = '#5F6A6A'
            text.fondo = '#ECEFF1'
            text.estatus = 'DETENIDA'
        }
        else {
            if (objeto.cancelada) {
                text.letra = '#8950FC'
                text.fondo = '#EEE5FF'
                text.estatus = 'CANCELADA'
            } else {
                if (restante <= 1) {
                    text.letra = '#388E3C'
                    text.fondo = '#E8F5E9'
                    text.estatus = 'PAGADA'
                } else {
                    text.letra = '#F64E60'
                    text.fondo = '#FFE2E5'
                    text.estatus = 'PENDIENTE'
                }
            }
        }
        return setLabelTable(text)
    }

    setAdjuntosTable = factura => {
        return (
            <div>
                {
                    factura.xml ?
                        <a href={factura.xml.url} target="_blank" rel="noopener noreferrer">
                            <span className="font-size-11px">
                                factura.xml
                            </span>
                        </a>
                        : ''
                }
                <br />
                {
                    factura.pdf ?
                        <a href={factura.pdf.url} target="_blank" rel="noopener noreferrer">
                            <span className="font-size-11px">
                                factura.pdf
                            </span>
                        </a>
                        : ''
                }
            </div>
        )
    }

    setInfoTable = (rfc, nombre) => {
        return (
            <div style={{minWidth:'160px'}}>
                <span className="mr-1 font-size-12px" >
                    <span className="font-weight-bold">
                        RFC:
                    </span>
                </span>
                <span className="font-size-11px">
                    {rfc}
                </span>
                <br />
                <span className="mr-1 font-size-12px" >
                    <span className="font-weight-bold">
                        Nombre:
                    </span>
                </span>
                <span className="font-size-11px">
                    {nombre}
                </span>
            </div>
        )
    }

    cancelarFactura = (factura) => {
        const { form } = this.state
        let aux = []
        factura.adjuntos_cancelados.map((adjunto) => {
            aux.push({
                name: adjunto.name,
                url: adjunto.url
            })
            return false
        })
        form.adjuntos.adjuntos.files = aux
        this.setState({
            ...this.state,
            modalCancelar: true,
            // tipo: 'Ventas',
            factura: factura,
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
                        adjuntos: {
                            value: '',
                            placeholder: 'Ingresa los adjuntos',
                            files: []
                        }, factura: {
                            value: '',
                            placeholder: 'Adjuntar factura',
                            files: []
                        }, relacionados:{
                            value: '',
                            placeholder: 'Facturas relacionadas',
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

    handleChangeRelacionadas = ( files, item ) => {
        const { form } = this.state
        let arreglo = { xml: {
            name: '',
            file: null,
            url: ''
        }, pdf: {
            name: '',
            file: null,
            url: ''
        }}
        if(files.length <= 2 && files.length > 0){
            files.forEach(element => {
                switch(element.type){
                    case 'application/pdf':
                        arreglo.pdf = {
                            name: element.name,
                            file: element,
                            url: URL.createObjectURL(element),
                        }
                        break;
                    case 'text/xml':
                        arreglo.xml = {
                            name: element.name,
                            file: element,
                            url: URL.createObjectURL(element),
                        }
                        break;
                    default: break;
                }
            });    
            form.adjuntos.relacionados.files.push(arreglo)
        }
        
        this.setState({ ...this.state,form })
        createAlertSA2WithActionOnClose(
            '¿DESEAS AGREGAR LA FACTURA RELACIONADA?',
            '',
            () => this.addFacturaRelacionada(files, item),
            () => this.cleanAdjuntos(item)
        )
        /* this.onChangeRelacionados({ target: { name: item, value: files, files: files } }) */
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

    handleChange = (files, item) => { this.onChangeAdjunto({ target: { name: item, value: files, files: files } }) }

    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
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
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({ ...this.state, form })
    }

    addFacturaRelacionada = async(files, item) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { factura } = this.state
        const data = new FormData()
        files.map((file) => {
            data.append(`files_name[]`, file.name)
            data.append(`files[]`, file)
            return ''
        })
        await axios.post(`${URL_DEV}v2/administracion/facturas/${factura.id}/relacionadas`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key, form } = this.state
                const { factura } = response.data
                form.adjuntos.relacionados.files = []
                factura.relacionadas.forEach(element => {
                    form.adjuntos.relacionados.files.push(element)    
                });
                if (key === 'compras') {
                    this.getComprasAxios()
                }
                if (key === 'ventas') {
                    this.getVentasAxios()
                }
                doneAlert('Factura relacionada con éxito')
                this.setState({ ...this.state,form })
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async cancelarFacturaAxios() {
        const { access_token } = this.props.authUser
        const { form, factura } = this.state
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
            return false
        })
        await axios.post(URL_DEV + 'facturas/cancelar/' + factura.id, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data, key } = this.state
                const { facturasVentas } = response.data
                data.facturas = facturasVentas
                this.setState({
                    facturas: this.setFactura(facturasVentas),
                    data,
                    modalCancelar: false
                })
                if (key === 'compras') {
                    this.getComprasAxios()
                }
                if (key === 'ventas') {
                    this.getVentasAxios()
                }
                doneAlert('Factura cancelada con éxito')
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getFacturas() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'facturas', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { facturasVentas } = response.data
                data.facturas = facturasVentas
                this.setState({
                    facturas: this.setFactura(facturasVentas),
                    data
                })
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    handleClose = () => {
        const { modalCancelar } = this.state
        this.setState({
            ...this.state,
            modalCancelar: !modalCancelar,
            form: this.clearForm()
        })
    }

    onSubmit = e => {
        e.preventDefault()
        waitAlert()
        this.cancelarFacturaAxios(e)
    }

    openModal = () => {
        this.setState({
            ...this.state,
            modalFacturas: true,
            title: 'Agregar Factura',
            // tipo: 'Compras',
            form: this.clearForm(),
            formeditado: 0
        })
    }

    handleCloseFacturas = () => {
        const { modalFacturas } = this.state
        this.setState({
            ...this.state,
            modalFacturas: !modalFacturas,
            // form: this.clearForm()
        })
    }

    openModalRestante = async() => {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'facturas/ventas/restante', { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas } = response.data
                this.setState({
                    ...this.state,
                    modalRestante: true,
                    title: 'Restante por empresa',
                    empresas: empresas
                })        
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    handleCloseRestante = () => {
        const { modalRestante } = this.state
        this.setState({
            ...this.state,
            modalRestante: !modalRestante,
            empresas: []
        })
    }

    openFacturaRelacionada = factura => {
        const { form } = this.state
        form.adjuntos.relacionados.files = []
        factura.relacionadas.forEach(element => {
            form.adjuntos.relacionados.files.push(element)    
        });
        this.setState({ ...this.state, modalFacturaRelacionada: true, factura: factura,form })
    }

    handleCloseFacturaRelacionada = () => {
        const { modalFacturaRelacionada } = this.state
        this.setState({
            ...this.state,
            modalFacturaRelacionada: !modalFacturaRelacionada,
            factura: '',
            form: this.clearForm()
        })
    }

    onChangeAdjuntoFacturas = e => {
        const { form, data } = this.state
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
                        let auxiliar = ''
                        if (obj.subtotal === '') {
                            let Subtotal = text.search('SubTotal="')
                            if (Subtotal)
                                Subtotal = text.substring(Subtotal + 10)
                            auxiliar = Subtotal.search('"')
                            Subtotal = Subtotal.substring(0, auxiliar)
                            obj.subtotal = Subtotal
                        }
                        if (obj.total === '') {
                            let Total = text.search('Total="')
                            if (Total)
                                Total = text.substring(Total + 7)
                            Total.search('"')
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
                            if (element.rfc === obj.rfc_emisor)
                                auxEmpresa = element
                            return false
                        });
                        let auxCliente = ''
                        data.clientes.find(function (element, index) {
                            let cadena = obj.nombre_receptor.replace(' S. C.', ' SC').toUpperCase()
                            cadena = cadena.replace(',S.A.', ' SA').toUpperCase()
                            cadena = cadena.replace(/,/g, '').toUpperCase()
                            cadena = cadena.replace(/\./g, '').toUpperCase()
                            if (element.empresa === obj.nombre_receptor ||
                                element.empresa === cadena) {
                                auxCliente = element
                            }
                            return false
                        });
                        if (auxEmpresa) {
                        } else {
                            errorAlert('No existe la empresa')
                        }
                        if (auxCliente) {
                        } else {
                            createAlert('NO EXISTE EL CLIENTE', '¿LO QUIERES CREAR?', () => this.addClienteAxios(obj))
                        }
                        if (auxEmpresa && auxCliente) {
                            Swal.close()
                        }
                        form.facturaObject = obj
                        this.setState({
                            ...this.state,
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
        this.setState({ ...this.state, form })
    }

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({ ...this.state, options })
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form['adjuntos'][name].files.length; counter++) {
            if (counter !== key)
                aux.push(form['adjuntos'][name].files[counter])
        }
        if (aux.length < 1) {
            form['adjuntos'][name].value = ''
            if (name === 'factura')
                form['facturaObject'] = ''
        }
        form['adjuntos'][name].files = aux
        this.setState({ ...this.state, form })
    }

    async getComprasAxios() { $('#kt_datatable_compras').DataTable().ajax.reload(); }
    async getVentasAxios() { $('#kt_datatable_ventas').DataTable().ajax.reload(); }

    controlledTab = value => {
        if (value === 'compras')
            this.getComprasAxios()
        if (value === 'ventas')
            this.getVentasAxios()
        this.setState({ ...this.state, key: value })
    }
    
    async sendFacturaAxios() {
        waitAlert();
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    break;
                case 'facturaObject':
                    data.append(element, JSON.stringify(form[element]))
                    break;
                default:
                    break
            }
            return false
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
            return false
        })
        await axios.post(URL_DEV + 'facturas/new', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getVentasAxios()
                this.setState({ ...this.state, form: this.clearForm(), modalFacturas: false })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
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
        await axios.post(URL_DEV + 'cliente', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { clientes } = response.data
                const { options, data, form } = this.state
                options.clientes = []
                options['clientes'] = setOptions(clientes, 'empresa', 'id')
                data.clientes = clientes
                clientes.map((cliente) => {
                    if (cliente.empresa === cadena)
                        form.cliente = cliente.empresa
                    return false
                })
                this.setState({ ...this.state, form, data, options })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getExcelFacturasVentas = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'exportar/facturas/ventas', { responseType:'blob', headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'ventas.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getExcelFacturasCompras = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'exportar/facturas/compras', { responseType:'blob', headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'compras.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        const { factura, modalSee, modalCancelar, form, modalFacturas, key, modalRestante, empresas, modalFacturaRelacionada} = this.state
        return (
            <Layout active = 'administracion'  {...this.props} >
                <Tabs defaultActiveKey = "ventas" activeKey = { key } onSelect = { (value) => { this.controlledTab(value) } } >
                    <Tab eventKey = "ventas" title = "Ventas">
                        <NewTableServerRender columns = { FACTURAS_COLUMNS } title = 'Facturas' subtitle = 'Listado de facturas'
                            mostrar_boton = { true } abrir_modal = { true } mostrar_acciones = { true } onClick = { this.openModal }
                            restante_empresa = { true } onClickRestante = { this.openModalRestante }
                            actions = {
                                {
                                    'see': { function: this.openModalSee },
                                    'cancelarFactura': { function: this.cancelarFactura },
                                    'inhabilitar': { function: this.inhabilitar },
                                    'facturaRelacionada': { function: this.openFacturaRelacionada}
                                }
                            }
                            idTable = 'kt_datatable_ventas' accessToken = { this.props.authUser.access_token } setter = { this.setFactura }
                            urlRender = { URL_DEV + 'facturas/ventas' } cardTable = 'cardTable_ventas' cardTableHeader = 'cardTableHeader_ventas'
                            cardBody = 'cardBody_ventas' isTab = { true } tipo_validacion = 'facturas' exportar_boton = { true }
                            onClickExport = { () => this.getExcelFacturasVentas() } />
                    </Tab>
                    <Tab eventKey = "compras" title = "Compras">
                        <NewTableServerRender columns = { FACTURAS_COLUMNS } title = 'Facturas' subtitle = 'Listado de facturas'
                            mostrar_boton = { true } abrir_modal = { true } mostrar_acciones = { true } onClick = { this.openModal }
                            restante_empresa = { true } onClickRestante = { this.openModalRestante }
                            actions = {
                                {
                                    'see': { function: this.openModalSee },
                                    'cancelarFactura': { function: this.cancelarFactura },
                                    'inhabilitar': { function: this.inhabilitar },
                                    'facturaRelacionada': { function: this.openFacturaRelacionada}
                                }
                            } idTable = 'kt_datatable_compras' accessToken = { this.props.authUser.access_token } setter = { this.setFactura }
                            urlRender = { URL_DEV + 'facturas/compras' } cardTable = 'cardTable_compras' cardTableHeader = 'cardTableHeader_compras'
                            cardBody = 'cardBody_compras' isTab = { true } tipo_validacion = 'facturas' exportar_boton = { true }
                            onClickExport = { () => this.getExcelFacturasCompras() } />
                    </Tab>
                </Tabs>
                <Modal size="lg" title={"Agregar adjuntos"} show={modalCancelar} handleClose={this.handleClose} >
                    <div className="mt-4 mb-4">
                        <ItemSlider items={form.adjuntos.adjuntos.files} handleChange={this.handleChange} item="adjuntos" multiple={true} />
                    </div>
                    <div className="card-footer py-3 pr-1">
                        <div className="row mx-0">
                            <div className="col-lg-12 text-right pr-0 pb-0">
                                <Button icon = '' text = 'ENVIAR' className="btn btn-primary mr-2"
                                    onClick={(e) => { e.preventDefault(); waitAlert(); this.cancelarFacturaAxios() }} />
                            </div>
                        </div>
                    </div>
                </Modal>

                <Modal title = "Agregar facturas" show = { modalFacturas } handleClose = { this.handleCloseFacturas }>
                    <Form /*onSubmit = { (e) => { e.preventDefault(); waitAlert(); this.sendFacturaAxios();}} */ >
                        <div className="mt-3 mb-4 text-center">
                            <FileInput onChangeAdjunto = { this.onChangeAdjuntoFacturas } placeholder = { form.adjuntos.factura.placeholder }
                                value = { form.adjuntos.factura.value} name = 'factura' id = 'factura' accept = "text/xml, application/pdf"
                                files = {form.adjuntos.factura.files } deleteAdjunto = { this.clearFiles } multiple
                                classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0'
                                iconclass='flaticon2-clip-symbol text-primary'
                                />
                        </div>
                        <div className="card-footer py-3 pr-1">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-right pr-0 pb-0">
                                    <Button icon='' className="mx-auto" type="submit" text="ENVIAR"
                                        onClick={(e) => { e.preventDefault(); waitAlert(); this.sendFacturaAxios(); }} />
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal>
                <Modal size="lg" title="Factura" show={modalSee} handleClose={this.handleCloseSee} >
                    <FacturacionCard factura = { factura } />
                </Modal>

                <Modal title="Restante por empresa" show={modalRestante} handleClose={this.handleCloseRestante} >
                    <div className="table-responsive mt-4">
                        <table className="table table-head-bg table-borderless table-vertical-center">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="text-left text-muted font-size-sm d-flex justify-content-start">EMPRESA</div>
                                    </th>
                                    <th className="text-center text-muted font-size-sm">
                                        <div className="text-left text-muted font-size-sm d-flex justify-content-end">RESTANTE</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    empresas ?
                                        empresas.map((empresa, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td>
                                                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg">{empresa.name}</span>
                                                    </td>
                                                    <td className="text-right">
                                                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                                            <NumberFormat value = { empresa.restante } displayType = 'text'
                                                                thousandSeparator = { true } prefix = '$'
                                                                renderText = { value => <div>{value}</div> } />
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        : <span>-</span>
                                }
                                
                            </tbody>
                        </table>
                    </div>
                </Modal>
                <Modal size = "xl" title = "Facturas relacionadas" show = { modalFacturaRelacionada } handleClose = { this.handleCloseFacturaRelacionada } >
                    <ItemDoubleSlider items = { form.adjuntos.relacionados.files } handleChange = { this.handleChangeRelacionadas } item = 'relacionados' 
                        deleteFile = { this.deleteRelacionada } /> 
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return {authUser: state.authUser}}
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Facturacion);