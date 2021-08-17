import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, EGRESOS_COLUMNS } from '../../../constants'
import { setOptions, setTextTable, setDateTableReactDom, setMoneyTable, setArrayTable, setAdjuntosList, setSelectOptions, setTextTableCenter, setTextTableReactDom } from '../../../functions/setters'
import { errorAlert, waitAlert, createAlert, deleteAlert, doneAlert, errorAlertRedirectOnDissmis, createAlertSA2WithActionOnClose, printResponseErrorAlert, customInputAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { Button, FileInput, InputGray, CalendarDaySwal, SelectSearchGray, DoubleSelectSearchGray, RangeCalendar } from '../../../components/form-components'
import { Modal, ModalDelete } from '../../../components/singles'
import { FacturaTable } from '../../../components/tables'
import { Form } from 'react-bootstrap'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import Select from '../../../components/form-components/Select'
import { AdjuntosForm, FacturaExtranjera } from '../../../components/forms'
import { EgresosCard } from '../../../components/cards'
import Swal from 'sweetalert2'
import { printSwalHeader } from '../../../functions/printers'
import { Update } from '../../../components/Lottie'
import $ from "jquery";
import { setSingleHeader } from '../../../functions/routers'
class egresos extends Component {
    state = {
        egresos: [],
        egresosAux: [],
        title: 'Nuevo egreso',
        egreso: '',
        modalDelete: false,
        modalFacturas: false,
        modalAdjuntos: false,
        modalSee: false,
        modalFacturaExtranjera: false,
        modalDownload: false,
        facturas: [],
        porcentaje: 0,
        data: {
            proveedores: [],
            empresas: [],
            egresos: []
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
        formFacturaExtranjera:{
            adjuntos: {
                factura: {
                    value: '',
                    placeholder: 'Factura extranjera',
                    files: []
                },
            }
        },
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
                this.setState({
                    ...this.state,
                    modalSee: true
                })
                this.getEgresoAxios(id)
            }
        }
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

    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({ ...this.state, form })
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
        form.adjuntos[item].value = files
        form.adjuntos[item].files = aux
        this.setState({...this.state,form})
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
                        identificador: renderToString(setTextTableCenter(egreso.id)),
                        cuenta: renderToString(setArrayTable(
                            [
                                { name: 'Empresa', text: egreso.empresa ? egreso.empresa.name : '' },
                                { name: 'Cuenta', text: egreso.cuenta ? egreso.cuenta.nombre : '' },
                                { name: 'No. de cuenta', text: egreso.cuenta ? egreso.cuenta.numero : '' }
                            ], '250px'
                        )),
                        proveedor: renderToString(setTextTable(egreso.proveedor ? egreso.proveedor.razon_social : '')),
                        factura: renderToString(setTextTableCenter(egreso.factura ? 'Con factura' : 'Sin factura')),
                        monto: renderToString(setMoneyTable(egreso.monto)),
                        comision: renderToString(setMoneyTable(egreso.comision ? egreso.comision : 0.0)),
                        total: renderToString(setMoneyTable(egreso.total)),
                        impuesto: setTextTableReactDom(egreso.tipo_impuesto ? egreso.tipo_impuesto.tipo : 'Sin definir', this.doubleClick, egreso, 'tipoImpuesto', 'text-center'),
                        tipoPago: setTextTableReactDom(egreso.tipo_pago.tipo, this.doubleClick, egreso, 'tipoPago', 'text-center'),
                        descripcion: setTextTableReactDom(egreso.descripcion !== null ? egreso.descripcion :'', this.doubleClick, egreso, 'descripcion', 'text-justify'),
                        area: setTextTableReactDom(egreso.area ? egreso.area.nombre : '', this.doubleClick, egreso, 'area', 'text-center'),
                        subarea: setTextTableReactDom(egreso.subarea ? egreso.subarea.nombre : '', this.doubleClick, egreso, 'subarea', 'text-center'),
                        estatusCompra: setTextTableReactDom(egreso.estatus_compra ? egreso.estatus_compra.estatus : '', this.doubleClick, egreso, 'estatusCompra', 'text-center'),
                        adjuntos: renderToString(setArrayTable(_aux)),
                        fecha: setDateTableReactDom(egreso.created_at, this.doubleClick, egreso, 'fecha', 'text-center'),
                        id: egreso.id,
                        objeto: egreso
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
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }/>
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
                                { this.setOptions(data, tipo).map((tipo, key) => { return ( <option key={key} value={tipo.value} className="bg-white" >{tipo.text}</option> ) }) }
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
            () => { this.patchEgresos(data, tipo, flag) },
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
    patchEgresos = async( data,tipo, flag ) => {
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
        await axios.put(`${URL_DEV}v2/administracion/egresos/${newType}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getEgresosAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
            default: return []
        }
    }
    setAdjuntosTable = egreso => {
        let aux = []
        let adjuntos = egreso.presupuestos.concat(egreso.pagos)
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
    setActions = egreso => {
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
        if (egreso.factura) {
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
    setActionsAdjuntos = adjunto => {
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
    changePageAdd = () => {
        const { history } = this.props
        history.push({
            pathname: '/administracion/egresos/add'
        });
    }
    changePageEdit = (egreso) => {
        const { history } = this.props
        history.push({
            pathname: '/administracion/egresos/edit',
            state: { egreso: egreso }
        });
    }
    openModalDelete = egreso => {
        this.setState({
            ...this.state,
            modalDelete: true,
            egreso: egreso
        })
    }

    openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿SEGURO DESEAS BORRAR EL ADJUNTO?', adjunto.name, () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) })
    }

    handleCloseDownload = () => {
        this.setState({ ...this.state, modalDownload: false, form: this.clearForm() })
    }

    handleCloseFacturaExtranjera = () => {
        const { modalFacturaExtranjera } = this.state
        this.setState({
            ...this.state,
            modalFacturaExtranjera: !modalFacturaExtranjera,
            egreso: ''
        })
    }

    handleCloseSee = () => {
        this.setState({
            ...this.state,
            modalSee: false,
            egreso: ''
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
    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ...this.state,
            modalDelete: !modalDelete,
            egreso: ''
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
            egreso: ''
        })
    }
    deleteFactura = id => {
        waitAlert()
        this.deleteFacturaAxios(id)
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

    openFacturaExtranjera = async(egreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/administracion/egresos/adjuntos/${egreso.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { form } = this.state
                const { egreso } = response.data
                form = this.revertForm(egreso)
                Swal.close()
                this.setState({ ...this.state, form, modalFacturaExtranjera: true, egreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    openModalSee = async(egreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/administracion/egresos/${egreso.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { egreso } = response.data
                Swal.close()
                this.setState({ ...this.state, modalSee: true, egreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    openModalAdjuntos = async(egreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/administracion/egresos/adjuntos/${egreso.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { form } = this.state
                const { egreso } = response.data
                form = this.revertForm(egreso)
                Swal.close()
                this.setState({ ...this.state, form, modalAdjuntos: true, egreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    openModalFacturas = async(egreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/administracion/egresos/facturas/${egreso.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { form } = this.state
                const { egreso } = response.data
                form = this.clearForm()
                if(egreso)
                    if(egreso.estatus_compra)
                        form.estatusCompra = egreso.estatus_compra.id
                Swal.close()
                this.setState({ ...this.state, form, modalFacturas: true, egreso, facturas: egreso.facturas })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
            console.error(error, 'error')
        })
    }
    async getEgresosAxios() {
        $('#egresos').DataTable().ajax.reload();
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.options(`${URL_DEV}v2/administracion/egresos`, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { data, options } = this.state
                const { proveedores, empresas, estatusCompras, areas, tiposPagos, tiposImpuestos } = response.data
                data.proveedores = proveedores
                data.empresas = empresas
                options['estatusCompras'] = setSelectOptions(estatusCompras, 'estatus')
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
                options['tiposImpuestos'] = setSelectOptions(tiposImpuestos, 'tipo')
                Swal.close()
                this.setState({ ...this.state, data, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async deleteEgresoAxios() {
        const { access_token } = this.props.authUser
        const { egreso } = this.state
        await axios.delete(URL_DEV + 'egresos/' + egreso.id, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getEgresosAxios()
                this.setState({
                    ...this.state,
                    modalDelete: false,
                    egreso: '',
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue eliminado con éxito.')
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    sendFacturaAxios = async() => {
        const { access_token } = this.props.authUser
        const { form, egreso } = this.state
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
        await axios.post(`${URL_DEV}v2/administracion/egresos/${egreso.id}/factura`, data, { headers: {'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { form } = this.state
                const { egreso } = response.data
                form = this.clearForm()
                if(egreso)
                    if(egreso.estatus_compra)
                        form.estatusCompra = egreso.estatus_compra.id
                doneAlert(response.data.message !== undefined ? response.data.message : 'Las facturas fueron actualizadas con éxito.')
                this.setState({ ...this.state, form, modalFacturas: true, egreso, facturas: egreso.facturas })
                this.getEgresosAxios()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deleteFacturaAxios = async(id) => {
        const { access_token } = this.props.authUser
        const { egreso } = this.state
        await axios.delete(`${URL_DEV}v2/administracion/egresos/${egreso.id}/facturas/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { form } = this.state
                const { egreso } = response.data
                form = this.clearForm()
                if(egreso)
                    if(egreso.estatus_compra)
                        form.estatusCompra = egreso.estatus_compra.id
                Swal.close()
                this.setState({ ...this.state, form, egreso, facturas: egreso.facturas })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    /* -------------------------------------------------------------------------- */
    /*                        ANCHOR Exportar egresos Axios                       */
    /* -------------------------------------------------------------------------- */

    exportEgresos = () => {
        this.setState({ ...this.state, modalDownload: true, form: this.clearForm() })
    }

    exportEgresosAxios = async () => {
        const { form } = this.state
        let headers = []
        let documento = ''
        EGRESOS_COLUMNS.map((columna, key) => {
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
            return ''
        })
        waitAlert();
        const { access_token } = this.props.authUser
        await axios.post(`${URL_DEV}v2/exportar/administracion/egresos`, { columnas: headers, start: form.fechaInicio, end: form.fechaFin }, 
            { responseType: 'blob', headers: setSingleHeader(access_token) }).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'egresos.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
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
        await axios.post(`${URL_DEV}v2/administracion/egresos/${egreso.id}/adjuntos`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { form } = this.state
                const { egreso } = response.data
                form = this.revertForm(egreso)
                this.getEgresosAxios()
                this.setState({ ...this.state, form })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.')
            }, (error) => { 
                let { form } = this.state
                form = this.revertForm(egreso); 
                this.setState({...this.state,form})
                printResponseErrorAlert(error) 
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deleteAdjuntoAxios = async(id) => {
        const { access_token } = this.props.authUser
        const { egreso } = this.state
        await axios.delete(`${URL_DEV}v2/administracion/egresos/${egreso.id}/adjuntos/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { form } = this.state
                const { egreso } = response.data
                form = this.revertForm(egreso)
                this.getEgresosAxios()
                this.setState({ ...this.state, form })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.')
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async getEgresoAxios(id){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'egresos/single/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { egreso } = response.data
                this.setState({
                    ...this.state,
                    egreso: egreso
                })
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
            () => this.addAdjuntoEgresoAxios(files, 'facturas_pdf'),
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
        await axios.post(`${URL_DEV}egresos/adjuntos`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getEgresosAxios()
                this.setState({ ...this.state })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.')
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    render() {
        const { modalDelete, modalFacturas, modalAdjuntos, facturas, form, options, modalSee, egreso, modalFacturaExtranjera, modalDownload } = this.state
        return (
            <Layout active = 'administracion'  {...this.props}>

                <NewTableServerRender columns = { EGRESOS_COLUMNS } title = 'Egresos' subtitle = 'Listado de egresos' url = '/administracion/egresos/add'
                    mostrar_boton = { true } abrir_modal = { false } mostrar_acciones = { true } idTable = 'egresos' exportar_boton = { true }
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete },
                        'facturas': { function: this.openModalFacturas },
                        'adjuntos': { function: this.openModalAdjuntos },
                        'see': { function: this.openModalSee },
                        'facturaExtranjera': { function: this.openFacturaExtranjera}
                    }}
                    onClickExport = { () => this.exportEgresos() } accessToken = { this.props.authUser.access_token } setter = { this.setEgresos }
                    urlRender = { `${URL_DEV}v2/administracion/egresos`} validateFactura = { true } tipo_validacion = 'compras' cardTable = 'cardTable'
                    cardTableHeader = 'cardTableHeader' cardBody = 'cardBody' />
                
                <Modal show = { modalDownload } title = 'Descargar egresos' handleClose = { this.handleCloseDownload } >
                    <Form onSubmit = { this.onSubmit} >
                        <div className="text-center">
                            <label className="col-form-label my-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br/>
                            <RangeCalendar onChange = { this.onChangeRange } start = { form.fechaInicio } end = { form.fechaFin } />
                        </div>
                        <div className="card-footer py-3 pr-1">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-right pr-0 pb-0">
                                    <Button icon='' className="btn btn-primary mr-2" onClick={ this.exportEgresosAxios } text="ENVIAR" />
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal>

                <ModalDelete title = "¿Estás seguro que deseas eliminar el egreso?" show = { modalDelete } handleClose = { this.handleCloseDelete } 
                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.deleteEgresoAxios() } } />

                <Modal size="xl" title={"Facturas"} show={modalFacturas} handleClose={this.handleCloseFacturas}>
                    {/* <div className="form-group row form-group-marginless pt-4">
                        <div className="col-md-12">
                            <ProgressBar 
                                animated 
                                label={`${porcentaje}`} 
                                variant = { porcentaje > 100 ? 'danger' : porcentaje > 75 ? 'success' : 'warning'} 
                                now = {porcentaje} />
                        </div>
                    </div> */}
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
                <Modal size="xl" title={"Adjuntos"} show={modalAdjuntos} handleClose={this.handleCloseAdjuntos}>
                    <AdjuntosForm form = { form } onChangeAdjunto = { this.handleChange }
                        clearFiles = { this.clearFiles } deleteFile = { this.openModalDeleteAdjuntos } />
                </Modal>
                <Modal size="lg" title="Egreso" show={modalSee} handleClose={this.handleCloseSee} >
                    <EgresosCard egreso={egreso} />
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

export default connect(mapStateToProps, mapDispatchToProps)(egresos);