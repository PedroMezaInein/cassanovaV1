import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV, INGRESOS_COLUMNS } from '../../../constants'
import { setOptions, setTextTable, setDateTableReactDom, setMoneyTable, setArrayTable, setAdjuntosList, setSelectOptions, setTextTableCenter, setTextTableReactDom } from '../../../functions/setters'
import { errorAlert, waitAlert, createAlert, deleteAlert, doneAlert, errorAlertRedirectOnDissmis, createAlertSA2WithActionOnClose, printResponseErrorAlert, customInputAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { Modal, ModalDelete } from '../../../components/singles'
import { Button, FileInput, InputGray, CalendarDaySwal, SelectSearchGray, DoubleSelectSearchGray } from '../../../components/form-components'
import { FacturaForm } from '../../../components/forms'
import { FacturaTable } from '../../../components/tables'
import { Form } from 'react-bootstrap'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import Select from '../../../components/form-components/Select'
import { AdjuntosForm, FacturaExtranjera} from '../../../components/forms'
import { IngresosCard } from '../../../components/cards'
import { Tab, Tabs } from 'react-bootstrap'
import { printSwalHeader } from '../../../functions/printers'
import { Update } from '../../../components/Lottie'
import $ from "jquery";
import { setSingleHeader } from '../../../functions/routers'
class Ingresos extends Component {
    state = {
        active: 'facturas',
        selectValido: false,
        ingresos: [],
        title: 'Nuevo ingreso',
        ingreso: '',
        modalDelete: false,
        modalFacturas: false,
        // modalAskFacturas: false,
        modalAdjuntos: false,
        modalSee: false,
        modalFacturaExtranjera: false,
        facturas: [],
        porcentaje: 0,
        data: {
            proveedores: [],
            empresas: [],
            ingresos: []
        },
        form: {
            formaPago: '',
            metodoPago: '',
            estatusFactura: '',
            facturaObject: '',
            cliente: '',
            empresa: '',
            concepto: '',
            email: '',
            rfc: '',
            total: '',
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
                },facturas_pdf: {
                    value: '',
                    placeholder: 'Factura extranjera',
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
        formeditado: 0,
        options: {
            formasPago: [],
            metodosPago: [],
            estatusFacturas: [],
            empresas: [],
            clientes: []
        }
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const ingresos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!ingresos)
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
                this.getIngresoAxios(id)
            }
        }
    }
    onSubmitAskFactura = e => {
        e.preventDefault()
        waitAlert()
        this.askFacturaAxios()
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
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
                        },facturas_pdf: {
                            value: '',
                            placeholder: 'Factura extranjera',
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
            () => this.addAdjuntoIngresoAxios(files, item),
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

    cleanAdjuntosExtranjero = (item) => {
        const { formFacturaExtranjera } = this.state
        let aux = []
        formFacturaExtranjera.adjuntos[item].files.map((file) => {
            if(file.id) aux.push(file)
            return ''
        })
        formFacturaExtranjera.adjuntos[item].value = ''
        formFacturaExtranjera.adjuntos[item].files = aux
        this.setState({...this.state,formFacturaExtranjera})
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
                            form.cliente = auxCliente.empresa
                        } else {
                            if(obj.nombre_receptor === ''){
                                const { history } = this.props
                                errorAlertRedirectOnDissmis('LA FACTURA NO TIENE RAZÓN SOCIAL, CREA EL CLIENTE DESDE LA SECCIÓN DE CLIENTES EN LEADS.', history, '/leads/clientes')
                            }else {
                                createAlert('NO EXISTE EL CLIENTE', '¿LO QUIERES CREAR?', () => this.addClienteAxios(obj))
                            }
                        }
                        if (auxEmpresa && auxCliente) {
                            Swal.close()
                        }
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
    changePageAdd = () => {
        const { history } = this.props
        history.push({
            pathname: '/administracion/ingresos/add'
        });
    }
    changePageEdit = (ingreso) => {
        const { history } = this.props
        history.push({
            pathname: '/administracion/ingresos/edit',
            state: { ingreso: ingreso },
            formeditado: 1
        });
    }
    setIngresos = ingresos => {
        let aux = []
        let _aux = []
        ingresos.map((ingreso) => {
            _aux = []
            if (ingreso.presupuestos) {
                ingreso.presupuestos.map((presupuesto) => {
                    _aux.push({
                        name: 'Presupuesto', text: presupuesto.name, url: presupuesto.url
                    })
                    return false
                })
            }
            if (ingreso.pagos) {
                ingreso.pagos.map((pago) => {
                    _aux.push({
                        name: 'Pago', text: pago.name, url: pago.url
                    })
                    return false
                })
            }
            aux.push(
                {
                    actions: this.setActions(ingreso),
                    identificador: renderToString(setTextTableCenter(ingreso.id)),
                    cuenta: renderToString(setArrayTable(
                        [
                            { name: 'Empresa', text: ingreso.empresa ? ingreso.empresa.name : '' },
                            { name: 'Cuenta', text: ingreso.cuenta ? ingreso.cuenta.nombre : '' },
                            { name: '# de cuenta', text: ingreso.cuenta ? ingreso.cuenta.numero : '' }
                        ],'200px'
                    )),
                    cliente: renderToString(setTextTableCenter(ingreso.cliente ? ingreso.cliente.empresa : '')),
                    factura: renderToString(setTextTableCenter(ingreso.factura ? 'Con factura' : 'Sin factura')),
                    monto: renderToString(setMoneyTable(ingreso.monto)),
                    impuesto: setTextTableReactDom(ingreso.tipo_impuesto ? ingreso.tipo_impuesto.tipo : 'Sin definir', this.doubleClick, ingreso, 'tipoImpuesto', 'text-center'),
                    tipoPago: setTextTableReactDom(ingreso.tipo_pago.tipo, this.doubleClick, ingreso, 'tipoPago', 'text-center'),
                    descripcion: setTextTableReactDom(ingreso.descripcion !== null ? ingreso.descripcion :'', this.doubleClick, ingreso, 'descripcion', 'text-justify'),
                    area: setTextTableReactDom(ingreso.area ? ingreso.area.nombre : '', this.doubleClick, ingreso, 'area', 'text-center'),
                    subarea: setTextTableReactDom(ingreso.subarea ? ingreso.subarea.nombre : '', this.doubleClick, ingreso, 'subarea', 'text-center'),
                    estatusCompra: setTextTableReactDom(ingreso.estatus_compra ? ingreso.estatus_compra.estatus : '', this.doubleClick, ingreso, 'estatusCompra', 'text-center'),
                    total: renderToString(setMoneyTable(ingreso.total)),
                    /* adjuntos: renderToString(setArrayTable(_aux)), */
                    fecha: setDateTableReactDom(ingreso.created_at, this.doubleClick, ingreso, 'fecha', 'text-center'),
                    id: ingreso.id,
                    objeto: ingreso
                }
            )
            return false
        })
        return aux
    }
    doubleClick = (data, tipo) => {
        const { form, options } = this.state
        let busqueda = undefined
        let flag = false
        switch(tipo){
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
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } />
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
                        <CalendarDaySwal value = { form[tipo] } onChange = { (e) => {  this.onChangeSwal(e.target.value, tipo)} } name = { tipo } date = { form[tipo] } withformgroup={0} />
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
            () => { this.patchIngresos(data, tipo, flag) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    setSwalPlaceholder = (tipo) => {
        switch(tipo){
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
    patchIngresos = async( data,tipo, flag ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = ''
        let newType = tipo
        switch(tipo){
            case 'area':
                value = { area: form.area, subarea: form.subarea }
                break
            case 'subarea':
                if(flag === true){
                    value = { area: form.area, subarea: form.subarea }
                    newType = 'area'
                }else{
                    value = form[tipo]
                }
                break
            default:
                value = form[tipo]
                break
        }
        waitAlert()
        await axios.put(`${URL_DEV}v2/administracion/ingresos/${newType}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getIngresosAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
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
            case 'subarea':
                if(data.subarea)
                    if(data.subarea.area)
                        if(data.subarea.area.subareas)
                            return setOptions(data.subarea.area.subareas, 'nombre', 'id')
                return []
            default: return []
        }
    }
    setAdjuntosTable = ingreso => {
        let aux = []
        let adjuntos = ingreso.presupuestos.concat(ingreso.pagos)
        adjuntos.map((adjunto) => {
            aux.push({
                actions: this.setActionsAdjuntos(adjunto),
                url: renderToString(
                    setAdjuntosList([{ name: adjunto.name, url: adjunto.url }])
                ),
                tipo: renderToString(setTextTable(adjunto.pivot.tipo)),
                id: 'adjuntos-' + adjunto.id
            })
            return false
        })
        return aux
    }
    setActions = ingreso => {
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
            },
            {
                text: 'Factura&nbsp;extranjera',
                btnclass: 'warning',
                iconclass: 'flaticon-interface-10',
                action: 'facturaExtranjera',
                tooltip: { id: 'facturaExtranjera', text: 'Factura extranjera'},
            }
        )
        if (ingreso.factura) {
            aux.push(
                {
                    text: 'Facturas',
                    btnclass: 'dark',
                    iconclass: 'flaticon2-paper',
                    action: 'facturas',
                    tooltip: { id: 'taxes', text: 'Facturas' },
                },
                // {
                //     text: 'Pedir&nbsp;factura',
                //     btnclass: 'info',
                //     iconclass: 'flaticon-file-1',
                //     action: 'askFacturas',
                //     tooltip: { id: 'ask-taxes', text: 'Facturas' },
                // }
            )
        }
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
    openModalDelete = (ingreso) => {
        this.setState({
            ...this.state,
            modalDelete: true,
            ingreso: ingreso
        })
    }
    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ...this.state,
            modalDelete: !modalDelete,
            ingreso: ''
        })
    }
    handleCloseFacturas = () => {
        this.setState({
            ...this.state,
            modalFacturas: false,
            ingreso: '',
            facturas: [],
            porcentaje: 0,
            form: this.clearForm()
        })
    }
    // openModalAskFactura = ingreso => {
    //     const { form } = this.state
    //     form.empresa = ingreso.empresa.id.toString()
    //     form.cliente = ingreso.cliente.id.toString()
    //     form.rfc = ingreso.cliente.rfc
    //     this.setState({
    //         ...this.state,
    //         // modalAskFactura: true,
    //         ingreso: ingreso,
    //         form,
    //         formeditado:1
    //     })
    // }
    // handleCloseAskFactura = () => {
    //     this.setState({
    //         ...this.state,
    //         // modalAskFactura: false,
    //         ingreso: '',
    //         form: this.clearForm()
    //     })
    // }

    openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿SEGURO DESEAS BORRAR EL ADJUNTO?', adjunto.name, () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) })
    }

    handleCloseFacturaExtranjera = () => {
        const { modalFacturaExtranjera } = this.state
        this.setState({
            ...this.state,
            modalFacturaExtranjera: !modalFacturaExtranjera,
            ingreso: ''
        })
    }

    handleCloseSee = () => {
        this.setState({
            ...this.state,
            modalSee: false,
            ingreso: ''
        })
    }
    handleCloseAdjuntos = () => {
        const { data } = this.state
        data.adjuntos = []
        this.setState({
            ...this.state,
            modalAdjuntos: false,
            modalFacturaExtranjera: false,
            form: this.clearForm(),
            adjuntos: [],
            data,
            ingreso: ''
        })
    }
    deleteFactura = id => {
        waitAlert()
        this.deleteFacturaAxios(id)
    }

    fillAdjuntos = ingreso => {
        const { form } = this.state
        form.adjuntos.pago.value = null
        form.adjuntos.presupuesto.value = null
        form.adjuntos.facturas_pdf.value = null
        form.adjuntos.pago.files = []
        form.adjuntos.presupuesto.files = []
        form.adjuntos.facturas_pdf.files = []
        ingreso.pagos.forEach(element => {
            form.adjuntos.pago.files.push(element);
        });
        ingreso.presupuestos.forEach(element => {
            form.adjuntos.presupuesto.files.push(element);
        });
        ingreso.facturas_pdf.forEach(element => {
            form.adjuntos.facturas_pdf.files.push(element);
        });
        return form
    }

    openModalFacturas = async(ingreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/administracion/ingresos/facturas/${ingreso.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { form } = this.state
                const { ingreso } = response.data
                form = this.clearForm()
                if(ingreso)
                    if(ingreso.estatus_compra)
                        form.estatusCompra = ingreso.estatus_compra.id
                Swal.close()
                this.setState({ ...this.state, form, modalFacturas: true, ingreso, facturas: ingreso.facturas })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    openFacturaExtranjera = async(ingreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/administracion/ingresos/adjuntos/${ingreso.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { form } = this.state
                const { ingreso } = response.data
                form = this.fillAdjuntos(ingreso)
                Swal.close()
                this.setState({ ...this.state, form, modalFacturaExtranjera: true, ingreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    openModalSee = async(ingreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/administracion/ingresos/${ingreso.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { ingreso } = response.data
                Swal.close()
                this.setState({ ...this.state, modalSee: true, ingreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    openModalAdjuntos = async(ingreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/administracion/ingresos/adjuntos/${ingreso.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { form } = this.state
                const { ingreso } = response.data
                form = this.fillAdjuntos(ingreso)
                Swal.close()
                this.setState({ ...this.state, form, modalAdjuntos: true, ingreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getIngresosAxios() { $('#ingresostable').DataTable().ajax.reload(); }

    async getIngresoAxios(id){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'ingresos/single/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { ingreso } = response.data
                this.setState({
                    ...this.state,
                    ingreso: ingreso
                })
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.options(`${URL_DEV}v2/administracion/ingresos`, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { data, options } = this.state
                const { clientes, empresas, formasPago, metodosPago, estatusFacturas, estatusCompras, tiposPagos, tiposImpuestos, areas } = response.data
                options['metodosPago'] = setOptions(metodosPago, 'nombre', 'id')
                options['formasPago'] = setOptions(formasPago, 'nombre', 'id')
                options['estatusFacturas'] = setOptions(estatusFacturas, 'estatus', 'id')
                options['estatusCompras'] = setSelectOptions(estatusCompras, 'estatus')
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['clientes'] = setOptions(clientes, 'empresa', 'id')
                options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
                options['tiposImpuestos'] = setSelectOptions(tiposImpuestos, 'tipo')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                data.clientes = clientes
                data.empresas = empresas
                Swal.close()
                this.setState({
                    ...this.state,
                    data,
                    options
                })
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteIngresoAxios() {
        const { access_token } = this.props.authUser
        const { ingreso } = this.state
        await axios.delete(URL_DEV + 'ingresos/' + ingreso.id, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getIngresosAxios()
                this.setState({
                    ...this.state,
                    modalDelete: false,
                    ingreso: ''
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue eliminado con éxito.')
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    sendFacturaAxios = async() => {
        const { access_token } = this.props.authUser
        const { form, ingreso } = this.state
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
        data.append('id', ingreso.id)
        await axios.post(`${URL_DEV}v2/administracion/ingresos/${ingreso.id}/factura`, data, { headers: {'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { form } = this.state
                const { ingreso } = response.data
                form = this.clearForm()
                if(ingreso)
                    if(ingreso.estatus_compra)
                        form.estatusCompra = ingreso.estatus_compra.id
                doneAlert(response.data.message !== undefined ? response.data.message : 'Las facturas fueron actualizadas con éxito.')
                this.setState({ ...this.state, form, modalFacturas: true, ingreso, facturas: ingreso.facturas })
                this.getIngresosAxios()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteFacturaAxios = async(id) => {
        const { access_token } = this.props.authUser
        const { ingreso } = this.state
        await axios.delete(`${URL_DEV}v2/administracion/ingresos/${ingreso.id}/facturas/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { form } = this.state
                const { ingreso } = response.data
                form = this.clearForm()
                if(ingreso)
                    if(ingreso.estatus_compra)
                        form.estatusCompra = ingreso.estatus_compra.id
                Swal.close()
                this.setState({ ...this.state, form, ingreso, facturas: ingreso.facturas })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async askFacturaAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'facturas/ask', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    // modalAskFactura: false
                })
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
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async exportIngresosAxios() {
        let headers = []
        let documento = ''
        INGRESOS_COLUMNS.map((columna, key) => {
            if (columna !== 'actions' && columna !== 'adjuntos') {
                documento = document.getElementById(columna.accessor+'-ingresostable')
                if (documento)
                    if (documento.value) { headers.push({ name: columna.accessor, value: documento.value }) }
            }
            return false
        })
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.post(`${URL_DEV}v2/exportar/administracion/ingresos`, { columns: headers }, { responseType: 'blob', headers: setSingleHeader(access_token) }).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'ingresos.xlsx');
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

    addAdjuntoIngresoAxios = async(files, item) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { ingreso } = this.state
        const data = new FormData();
        files.map((file) => {
            data.append(`files_name_${item}[]`, file.name)
            data.append(`files_${item}[]`, file)
            return ''
        })
        data.append('tipo', item)
        data.append('id', ingreso.id)
        await axios.post(`${URL_DEV}v2/administracion/ingresos/${ingreso.id}/adjuntos`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { form } = this.state
                const { ingreso } = response.data
                form = this.fillAdjuntos(ingreso)
                this.getIngresosAxios()
                this.setState({ ...this.state, form })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteAdjuntoAxios = async (id) => {
        const { access_token } = this.props.authUser
        const { ingreso } = this.state
        await axios.delete(`${URL_DEV}v2/administracion/ingresos/${ingreso.id}/adjuntos/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { form } = this.state
                const { ingreso } = response.data
                form = this.fillAdjuntos(ingreso)
                this.getIngresosAxios()
                this.setState({ ...this.state, form })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    onSelect = value => {
        const { form } = this.state
        if (value === 'facturas') {
        }
        this.setState({
            ...this.state,
            active: value,
            form
        })
    }
    handleChangeFacturaExtranjera = (files, item)  => {
        const { formFacturaExtranjera } = this.state
        let aux = formFacturaExtranjera.adjuntos[item].files
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
        formFacturaExtranjera['adjuntos'][item].value = files
        formFacturaExtranjera['adjuntos'][item].files = aux
        this.setState({...this.state,formFacturaExtranjera})
        createAlertSA2WithActionOnClose( 
            '¿DESEAS AGREGAR EL ARCHIVO?',
            '',
            () => this.addAdjuntoIngresoAxios(files, 'facturas_pdf'),
            () => this.cleanAdjuntosExtranjero(item)
        )
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
        await axios.post(`${URL_DEV}ingresos/adjuntos`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getIngresosAxios()
                this.setState({ ...this.state })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.')
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    render() {
        const { form, options, modalDelete, modalFacturas, modalAdjuntos, facturas, data, formeditado, modalSee, ingreso, active, modalFacturaExtranjera } = this.state
        return (
            <Layout active = 'administracion'  {...this.props}>
                <NewTableServerRender columns = { INGRESOS_COLUMNS } title = 'Ingresos' subtitle = 'Listado de ingresos' exportar_boton = { true }
                    mostrar_boton = { true } abrir_modal = { false } url = '/administracion/ingresos/add' mostrar_acciones = { true }
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete },
                        'facturas': { function: this.openModalFacturas },
                        // 'askFacturas': { function: this.openModalAskFactura },
                        'adjuntos': { function: this.openModalAdjuntos },
                        'see': { function: this.openModalSee },
                        'facturaExtranjera': { function: this.openFacturaExtranjera}
                    }}
                    onClickExport = { () => this.exportIngresosAxios() } accessToken = { this.props.authUser.access_token } setter = { this.setIngresos }
                    urlRender = { `${URL_DEV}v2/administracion/ingresos`} elementClass = 'total' idTable = 'ingresostable' validateFactura = { true }
                    tipo_validacion = 'ventas' cardTable = 'cardTable' cardTableHeader = 'cardTableHeader' cardBody = 'cardBody' />

                <ModalDelete title = "¿Estás seguro que deseas eliminar el ingreso?" show = { modalDelete } handleClose = { this.handleCloseDelete }
                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.deleteIngresoAxios() } } />

                <Modal size="xl" title={"Facturas"} show={modalFacturas} handleClose={this.handleCloseFacturas}>
                    <Tabs defaultActiveKey="facturas" className="mt-4 nav nav-tabs justify-content-start nav-bold bg-gris-nav bg-gray-100" activeKey={active} onSelect={this.onSelect}>
                        <Tab eventKey="facturas" title="FACTURAS">
                            {/* <div className="form-group row form-group-marginless pt-4">
                                <div className="col-md-12">
                                    <ProgressBar 
                                        animated label={`${porcentaje}`}
                                        variant={porcentaje > 100 ? 'danger' : porcentaje > 75 ? 'success' : 'warning'}
                                        now={porcentaje} 
                                    />
                                </div>
                            </div> */}
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

                <Modal size = "xl" title = "Adjuntos" show = { modalAdjuntos } handleClose = { this.handleCloseAdjuntos } >
                    <AdjuntosForm  form = { form } onChangeAdjunto = { this.handleChange } deleteFile = { this.openModalDeleteAdjuntos } />
                </Modal>
                <Modal size="lg" title="Ingreso" show={modalSee} handleClose={this.handleCloseSee} >
                    <IngresosCard ingreso={ingreso} />
                </Modal>
                <Modal size="lg" title="Factura extranjera" show={modalFacturaExtranjera} handleClose={this.handleCloseAdjuntos} >
                    <FacturaExtranjera form={form} onChangeAdjunto = { this.handleChange } deleteFile = { this.openModalDeleteAdjuntos }/>
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Ingresos);