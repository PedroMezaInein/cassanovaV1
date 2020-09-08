import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, VENTAS_COLUMNS, ADJUNTOS_COLUMNS} from '../../constants'
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setAdjuntosList } from '../../functions/setters'
import { waitAlert, errorAlert, createAlert,forbiddenAccessAlert, deleteAlert, doneAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Button, FileInput } from '../../components/form-components'
import { Modal, ModalDelete } from '../../components/singles'
import { VentasForm, FacturaForm, AdjuntosForm } from '../../components/forms'
import { FacturaTable } from '../../components/tables'
import { Form, ProgressBar } from 'react-bootstrap'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import TableForModals from '../../components/tables/TableForModals'
import Select from '../../components/form-components/Select'

const $ = require('jquery');

class Ventas extends Component{

    state = {
        solicitud: '',
        modal: false,
        modalDelete: false,
        modalFacturas: false,
        modalAskFactura: false,
        modalAdjuntos: false,
        porcentaje: 0,
        title: 'Nueva venta',
        ventas: [],
        facturas: [],
        adjuntos: [],
        venta: '',
        options:{
            empresas:[],
            cuentas:[],
            areas:[],
            subareas:[],
            clientes: [],
            proyectos: [],
            formasPago: [],
            metodosPago: [],
            estatusFacturas: [],
            contratos: []
        },
        data:{
            clientes: [],
            empresas: [],
            cuentas: [],
            proyectos: [],
            ventas: [],
            adjuntos: []
        },
        formeditado:0,
        form:{
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
            adjuntos:{
                factura:{
                    value: '',
                    placeholder: 'Factura',
                    files: []
                },
                pago:{
                    value: '',
                    placeholder: 'Pago',
                    files: []
                },
                presupuesto:{
                    value: '',
                    placeholder: 'Presupuesto',
                    files: []
                }
            }
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const egresos = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if(!egresos)
            history.push('/')
        this.getOptionsAxios()
        const { state } = this.props.location
        if(state){
            if(state.solicitud){
                this.getSolicitudVentaAxios(state.solicitud.id)
            }
        }
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true,
            title: 'Nueva venta',
            form: this.clearForm(),
            formeditado:0
        })
    }

    openModalEdit = (venta) => {
        const { form, options } = this.state
        form.factura = venta.factura ? 'Con factura' : 'Sin factura'
        if(venta.cliente){
            form.cliente = venta.cliente.id.toString()
            options['proyectos'] = setOptions(venta.cliente.proyectos, 'nombre', 'id')
            if(venta.proyecto)
                form.proyecto = venta.proyecto.id.toString()
            form.rfc = venta.cliente.rfc
            options['contratos'] = setOptions(venta.cliente.contratos, 'nombre', 'id')
            if(venta.contrato){
                form.contrato = venta.contrato.id.toString()
            }
        }
        if(venta.empresa){
            form.empresa = venta.empresa.id.toString()
            options['cuentas'] = setOptions(venta.empresa.cuentas, 'nombre', 'id')
            if(venta.cuenta)
            form.cuenta = venta.cuenta.id.toString()
        }
        if(venta.subarea){
            form.area = venta.subarea.area.id.toString()
            options['subareas'] = setOptions(venta.subarea.area.subareas, 'nombre', 'id')
            form.subarea = venta.subarea.id.toString()
        }
        
        form.tipoPago = venta.tipo_pago ? venta.tipo_pago.id : 0
        form.tipoImpuesto = venta.tipo_impuesto ? venta.tipo_impuesto.id : 0
        form.estatusCompra = venta.estatus_compra ? venta.estatus_compra.id : 0
        form.total = venta.monto
        form.fecha = new Date(venta.created_at)
        form.descripcion = venta.descripcion
        if(venta.pago){
            form.adjuntos.pago.files = [{
                name: venta.pago.name, url: venta.pago.url
            }]
        }
        if(venta.presupuesto){
            form.adjuntos.presupuesto.files = [{
                name: venta.presupuesto.name, url: venta.presupuesto.url
            }]
        }
        this.setState({
            ... this.state,
            modal: true,
            venta: venta,
            form,
            options,
            title: 'Editar venta',
            formeditado:1
        })
    }

    openModalAskFactura = venta => {
        const { form } = this.state
        form.empresa = venta.empresa.id.toString()
        form.cliente = venta.cliente.id.toString()
        form.rfc = venta.cliente.rfc
        this.setState({
            ... this.state,
            modalAskFactura: true,
            venta: venta,
            form,
            formeditado:1
        })
    }

    openModalFacturas = venta => {
        let { porcentaje, form } = this.state
        form = this.clearForm()
        form.estatusCompra = venta.estatus_compra.id
        porcentaje = 0
        venta.facturas.map((factura)=>{
            porcentaje = porcentaje + factura.total
        })
        porcentaje = porcentaje * 100 / venta.total
        porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
        this.setState({
            ... this.state,
            modalFacturas: true,
            venta: venta,
            facturas: venta.facturas,
            porcentaje,
            form,
            formeditado:0
        })
    }

    openModalDelete = (venta) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            venta: venta
        })
    }

    openModalAdjuntos = venta => {
        const { data } = this.state
        data.adjuntos = venta.presupuestos.concat(venta.pagos)
        this.setState({
            ... this.state,
            modalAdjuntos: true,
            venta: venta,
            form: this.clearForm(),
            formeditado:0,
            adjuntos: this.setAdjuntosTable(venta),
            data
        })
    }

    openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿Seguro deseas borrar el adjunto?', () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) }  )
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

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            venta: ''
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

    handleCloseAskFactura = () => {
        this.setState({
            ... this.state,
            modalAskFactura: false,
            venta: '',
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
            data,
            venta: ''
        })
    }

    setVentas = ventas => {
        const { data } = this.state
        data.ventas = ventas
        this.setState({
            data
        })
        let aux = []
        ventas.map( (venta) => {
            aux.push(
                {
                    actions: this.setActions(venta),
                    identificador: renderToString(setTextTable( venta.id )),
                    cuenta: renderToString(setArrayTable(
                        [
                            {name:'Empresa', text: venta.empresa ? venta.empresa.name : '' },
                            {name:'Cuenta', text: venta.cuenta ? venta.cuenta.nombre : '' },
                            {name:'# de cuenta', text: venta.cuenta ? venta.cuenta.numero : '' }
                        ]
                    )),
                    proyecto: renderToString(setTextTable( venta.proyecto ? venta.proyecto.nombre : '' )),
                    cliente: renderToString(setTextTable( venta.cliente ? venta.cliente.empresa : '' )),
                    factura: renderToString(setTextTable(venta.factura ? 'Con factura' : 'Sin factura')),
                    monto: renderToString(setMoneyTable(venta.monto)),
                    impuesto: renderToString(setTextTable( venta.tipo_impuesto ? venta.tipo_impuesto.tipo : 'Sin definir')),
                    tipoPago: renderToString(setTextTable( venta.tipo_pago ? venta.tipo_pago.tipo: '' )),
                    descripcion: renderToString(setTextTable(venta.descripcion)),
                    area: renderToString(setTextTable( venta.subarea ? venta.subarea.area ? venta.subarea.area.nombre : '' : '')),
                    subarea: renderToString(setTextTable( venta.subarea ? venta.subarea.nombre : '')),
                    estatusCompra: renderToString(setTextTable( venta.estatus_compra ? venta.estatus_compra.estatus : '')),
                    total: renderToString(setMoneyTable(venta.total)),
                    adjuntos: renderToString(setAdjuntosList([
                        venta.pago ? {name: 'Pago', url: venta.pago.url} : '',
                        venta.presupuesto ? {name: 'Presupuesto', url: venta.presupuesto.url} : '',
                    ])),
                    fecha: renderToString(setDateTable(venta.created_at)),
                    id: venta.id,
                    objeto: venta
                }
            )
        })
        return aux
    }

    setAdjuntosTable = venta => {
        let aux = []

        venta.adjuntos.map( (adjunto) => {
            aux.push({
                actions: this.setActionsAdjuntos(adjunto),
                url: renderToString(
                    setAdjuntosList([{name: adjunto.name, url: adjunto.url}])
                ),
                tipo: renderToString(setTextTable(adjunto.pivot.tipo)),
                id: 'adjuntos-'+adjunto.id
            })
        })
        return aux
    }

    setActions = venta => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' }
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' }
            },
            {
                text: 'Adjuntos',
                btnclass: 'primary',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            }
        )
        if(venta.factura){
            aux.push(
                {
                    text: 'Facturas',
                    btnclass: 'primary',
                    iconclass: 'flaticon-file-1',
                    action: 'taxes',
                    tooltip: { id: 'taxes', text: 'Facturas' }
                },
                {
                    text: 'Pedir&nbsp;factura',
                    btnclass: 'info',
                    iconclass: 'flaticon-file-1',
                    action: 'bills',
                    tooltip: { id: 'bills', text: 'Pedir factura' }
                }
            )
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

    setOptions = (name, array) => {
        const {options} = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }

    onChange = e => {
        const {form} = this.state
        const {name, value} = e.target
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
        for(let counter = 0; counter < files.length; counter ++){
            if(name === 'factura')
            {
                let extension = files[counter].name.slice((Math.max(0, files[counter].name.lastIndexOf(".")) || Infinity) + 1);
                if(extension.toUpperCase() === 'XML'){
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
                        if(relacionados){
                            if(relacionados.length){
                                relacionados = relacionados[0]
                                tipoRelacion = relacionados.attributes.TipoRelacion
                                let uuidRelacionado = xml.getElementsByTagName('cfdi:CfdiRelacionado')[0]
                                uuidRelacionado = uuidRelacionado.attributes.UUID
                                obj.tipo_relacion = tipoRelacion
                                obj.uuid_relacionado = uuidRelacionado
                            }
                        }
                        if(obj.numero_certificado === ''){
                            let NoCertificado = text.search('NoCertificado="')
                            if(NoCertificado)
                                obj.numero_certificado = text.substring(NoCertificado+15, NoCertificado + 35)
                        }
                        if(obj.subtotal === ''){
                            let Subtotal = text.search('SubTotal="')
                            if(Subtotal)
                                Subtotal = text.substring(Subtotal+10)
                                aux = Subtotal.search('"')
                                Subtotal = Subtotal.substring(0,aux)
                                obj.subtotal = Subtotal
                        }
                        if(obj.fecha === ''){
                            let Fecha = text.search('Fecha="')
                            if(Fecha)
                                Fecha = text.substring(Fecha+7)
                                aux = Fecha.search('"')
                                Fecha = Fecha.substring(0,aux)
                                obj.fecha = Fecha
                        }
                        let auxEmpresa = ''
                        data.empresas.find(function(element, index) {
                            if(element.rfc === obj.rfc_emisor){
                                auxEmpresa = element
                            }
                        });
                        let auxCliente = ''
                        data.clientes.find(function(element, index) {
                            let cadena = obj.nombre_receptor.replace(' S. C.',  ' SC').toUpperCase()
                            cadena = cadena.replace(',S.A.',  ' SA').toUpperCase()
                            cadena = cadena.replace(/,/g, '').toUpperCase()
                            cadena = cadena.replace(/\./g, '').toUpperCase()
                            if (element.empresa === obj.nombre_receptor ||
                                element.empresa === cadena){
                                auxCliente = element
                            }
                        });
                        if(auxEmpresa){
                            options['cuentas'] = setOptions(auxEmpresa.cuentas, 'nombre', 'id')
                            form.empresa = auxEmpresa.name
                        }else{
                            errorAlert('No existe la empresa')
                        }
                        if(auxCliente){
                            options['proyectos'] = setOptions(auxCliente.proyectos, 'nombre', 'id')
                            form.cliente = auxCliente.empresa
                            if(auxCliente.contratos){
                                options['contratos'] = setOptions(auxCliente.contratos, 'nombre', 'id')
                            }
                        }else{
                            createAlert('No existe el cliente', '¿Lo quieres crear?', () => this.addClienteAxios(obj))
                        }
                        if(auxEmpresa && auxCliente){
                            swal.close()
                        }
                        form.facturaObject = obj
                        form.rfc = obj.rfc_receptor
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
                    url: URL.createObjectURL(files[counter]) ,
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
        for(let counter = 0; counter < form['adjuntos'][name].files.length; counter ++){
            if(counter !== key){
                aux.push(form['adjuntos'][name].files[counter])
            }
        }
        if(aux.length < 1){
            form['adjuntos'][name].value = ''
            if(name === 'factura')
                form['facturaObject'] = ''
        }
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
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
                        factura:{
                            value: '',
                            placeholder: 'Factura',
                            files: []
                        },
                        pago:{
                            value: '',
                            placeholder: 'Pago',
                            files: []
                        },
                        presupuesto:{
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

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if(title === 'Editar venta')
            this.editVentaAxios()
        else
            this.addVentaAxios()
    }

    onSubmitAskFactura = e => {
        e.preventDefault()
        waitAlert()
        this.askFacturaAxios()
    }

    async addClienteAxios(obj){

        const { access_token } = this.props.authUser

        const data = new FormData();


        let cadena = obj.nombre_receptor.replace(' S. C.',  ' SC').toUpperCase()
        cadena = cadena.replace(',S.A.',  ' SA').toUpperCase()
        cadena = cadena.replace(/,/g, '').toUpperCase()
        cadena = cadena.replace(/\./g, '').toUpperCase()
        data.append('empresa', cadena)
        data.append('nombre', cadena)
        data.append('rfc', obj.rfc_receptor.toUpperCase())
        await axios.post(URL_DEV + 'cliente', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {

                const { clientes } = response.data

                const { options, data, form } = this.state

                options.clientes = []
                options['clientes'] = setOptions(clientes, 'empresa', 'id')
                data.clientes = clientes
                clientes.map( (cliente) => {
                    if(cliente.empresa === cadena){
                        form.cliente = cliente.empresa
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
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    async getOptionsAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'ventas/options', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras, 
                    clientes, metodosPago, formasPago, estatusFacturas } = response.data
                const { options, data } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['clientes'] = setOptions(clientes, 'empresa', 'id')
                options['metodosPago'] = setOptions(metodosPago, 'nombre', 'id')
                options['formasPago'] = setOptions(formasPago, 'nombre', 'id')
                options['estatusFacturas'] = setOptions(estatusFacturas, 'estatus', 'id')
                options['tiposPagos'] = setSelectOptions( tiposPagos, 'tipo' )
                options['tiposImpuestos'] = setSelectOptions( tiposImpuestos, 'tipo' )
                options['estatusCompras'] = setSelectOptions( estatusCompras, 'estatus' )
                data.clientes = clientes
                data.empresas = empresas
                swal.close()
                this.setState({
                    ... this.state,
                    options,
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getVentasAxios(){
        var table = $('#kt_datatable2_ventas').DataTable().ajax.reload();
    }
    
    async addVentaAxios(){

        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
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
        aux.map( (element) => {
            if(form.adjuntos[element].value !== ''){
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })
        
        await axios.post(URL_DEV + 'ventas', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {

                this.getVentasAxios()

                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    modal: false,
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
                
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async sendFacturaAxios(){

        const { access_token } = this.props.authUser
        const { form, venta } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
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
        aux.map( (element) => {
            if(form.adjuntos[element].value !== '' && element === 'factura'){
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })

        data.append('id', venta.id )
        
        await axios.post(URL_DEV + 'ventas/factura', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {

                this.getVentasAxios()

                const { venta } = response.data
                let { porcentaje, form } = this.state
                form = this.clearForm()
                form.estatusCompra = venta.estatus_compra.id
                porcentaje = 0
                venta.facturas.map((factura)=>{
                    porcentaje = porcentaje + factura.total
                })
                porcentaje = porcentaje * 100 / venta.total
                porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
                this.setState({
                    ... this.state,
                    form,
                    venta: venta,
                    facturas: venta.facturas,
                    porcentaje
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
                                
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async editVentaAxios(){

        const { access_token } = this.props.authUser
        const { form, venta } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
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
        aux.map( (element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
        })
        
        await axios.post(URL_DEV + 'ventas/update/' + venta.id, data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {

                this.getVentasAxios();
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    modal: false
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
                                
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteVentaAxios(){

        const { access_token } = this.props.authUser
        const { venta } = this.state
        await axios.delete(URL_DEV + 'ventas/' + venta.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                this.getVentasAxios()

                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    modalDelete: false,
                    venta: ''
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue eliminado con éxito.')

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteFactura = id => {
        waitAlert()
        this.deleteFacturaAxios(id)
    }

    async deleteFacturaAxios(id){

        const { access_token } = this.props.authUser
        const { venta } = this.state
        await axios.delete(URL_DEV + 'ventas/' + venta.id + '/facturas/' + id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                
                const { venta } = response.data
                let { porcentaje } = this.state
                porcentaje = 0
                venta.facturas.map((factura)=>{
                    porcentaje = porcentaje + factura.total
                })
                porcentaje = porcentaje * 100 / venta.total
                porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);

                this.getVentasAxios()
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    venta: venta,
                    facturas: venta.facturas,
                    porcentaje
                })
                
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async askFacturaAxios(){

        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'facturas/ask', form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {


                this.getVentasAxios()
                
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    modalAskFactura: false
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getSolicitudVentaAxios(id){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'solicitud-venta/'+id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { solicitud } = response.data
                const { options, form } = this.state
                form.solicitud = solicitud.id
                form.factura = solicitud.factura ? 'Con factura' : 'Sin factura'
                if(solicitud.proyecto){
                    if(solicitud.proyecto.clientes){
                        if(solicitud.proyecto.clientes.proyectos){
                            options['proyectos'] = setOptions(solicitud.proyecto.clientes.proyectos, 'nombre', 'id')
                            form.cliente = solicitud.proyecto.clientes[0].id.toString()
                            form.rfc = solicitud.proyecto.clientes[0].rfc
                            form.proyecto = solicitud.proyecto.id.toString()
                        }
                        if(solicitud.proyecto.clientes.contratos){
                            options['contratos'] = setOptions(solicitud.proyecto.clientes.contratos, 'nombre', 'id')
                        }
                    }
                }
                if(solicitud.empresa){
                    if(solicitud.empresa.cuentas){
                        options['cuentas'] = setOptions(solicitud.empresa.cuentas, 'nombre', 'id')
                        form.empresa = solicitud.empresa.id.toString()
                    }
                }
                if(solicitud.subarea){
                    if(solicitud.subarea.area){
                        if(solicitud.subarea.area.subareas){
                            options['subareas'] = setOptions(solicitud.subarea.area.subareas, 'nombre', 'id')
                            form.area = solicitud.subarea.area.id.toString()
                            form.subarea = solicitud.subarea.id.toString()
                        }
                    }
                }
                if(solicitud.tipo_pago){
                    form.tipoPago = solicitud.tipo_pago.id
                }
                if(solicitud.monto){
                    form.total = solicitud.monto
                }
                if(solicitud.descripcion){
                    form.descripcion = solicitud.descripcion
                }
                this.setState({
                    ... this.state,
                    title: 'Convierte la solicitud de venta',
                    solicitud: solicitud,
                    modal: true,
                    form,
                    options, 
                    formeditado:1
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async exportVentasAxios(){

        waitAlert()

        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'exportar/ventas', { responseType:'blob', headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'ventas.xlsx');
                document.body.appendChild(link);
                link.click();

                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addAdjuntoVentaAxios(){

        const { access_token } = this.props.authUser
        const { form, venta } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            if(form.adjuntos[element].value !== ''){
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })

        data.append('id', venta.id )
        
        await axios.post(URL_DEV + 'ventas/adjuntos', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {

                const { venta } = response.data
                const { data } = this.state
                data.adjuntos = venta.presupuestos.concat(venta.pagos)
                this.getVentasAxios()

                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    venta: venta,
                    adjuntos: this.setAdjuntosTable(venta),
                    modal: false,
                    data
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
                
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteAdjuntoAxios(id){
        const { access_token } = this.props.authUser
        const { venta } = this.state
        await axios.delete(URL_DEV + 'ventas/' + venta.id + '/adjuntos/' + id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { venta } = response.data
                const { data } = this.state
                data.adjuntos = venta.presupuestos.concat(venta.pagos)
                this.getVentasAxios()

                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    venta: venta,
                    adjuntos: this.setAdjuntosTable(venta),
                    data
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render(){

        const { modal, modalDelete, modalFacturas, modalAskFactura, modalAdjuntos, adjuntos, title, options, form, ventas, venta, porcentaje, facturas,data, formeditado} = this.state
        return(
            <Layout active={'proyectos'}  { ...this.props}>
                
                <NewTableServerRender columns={VENTAS_COLUMNS} data={ventas}
                    title='Ventas' subtitle='Listado de ventas'
                    mostrar_boton={true}
                    abrir_modal={true}
                    mostrar_acciones={true}
                    onClick={ this.openModal }
                    actions={{
                        'edit': { function: this.openModalEdit },
                        'delete': { function: this.openModalDelete },                        
                        'taxes': { function: this.openModalFacturas },                   
                        'bills': { function: this.openModalAskFactura },
                        'adjuntos': { function: this.openModalAdjuntos }
                    }}
                    elements={data.ventas}
                    exportar_boton={true} 
                    onClickExport={() => this.exportVentasAxios()}
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setVentas }
                    urlRender = {URL_DEV + 'ventas'}
                    idTable = 'kt_datatable2_ventas'
                    elementClass = 'total'
                    // zeroRed = { true }
                    validateFactura={true}
                    tipo_validacion = 'ventas'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                /> 

                <Modal size="xl" show = {modal} handleClose = { this.handleClose } title = { title } >
                    <VentasForm options = {options} form = {form} setOptions = {this.setOptions} 
                        onChange = { this.onChange } onChangeAdjunto = { this.onChangeAdjunto } clearFiles = {this.clearFiles}
                        onSubmit = { this.onSubmit } formeditado={formeditado} data = {data} />
                </Modal>

                <ModalDelete title={"¿Estás seguro que deseas eliminar la venta?"} show = { modalDelete } handleClose = { this.handleCloseDelete } onClick = { (e) => { e.preventDefault(); this.deleteVentaAxios() }}>
                </ModalDelete>

                <Modal size="xl" title={"Facturas"} show = { modalFacturas } handleClose = { this.handleCloseFacturas }>
                    
                    <div className="form-group row form-group-marginless pt-4">
                        <div className="col-md-12">
                            <ProgressBar animated label={`${porcentaje}`} 
                                variant = { porcentaje > 100 ? 'danger' : porcentaje > 75 ? 'success' : 'warning'} 
                                now = {porcentaje} />
                        </div>
                    </div>
                    <Form onSubmit = { (e) => { e.preventDefault(); waitAlert(); this.sendFacturaAxios();}}>    
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-6">                                
                                <FileInput 
                                    onChangeAdjunto = { this.onChangeAdjunto } 
                                    placeholder = { form['adjuntos']['factura']['placeholder'] }
                                    value = { form['adjuntos']['factura']['value'] }
                                    name = { 'factura' } 
                                    id = { 'factura' }
                                    accept = "text/xml, application/pdf" 
                                    files = { form['adjuntos']['factura']['files'] }
                                    deleteAdjunto = { this.clearFiles } multiple/>
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
                            <div className="col-md-12 align-items-center d-flex">
                                <Button icon='' className="mx-auto" type="submit" text="ENVIAR" />
                            </div>
                        </div>
                    </Form>
                    <FacturaTable deleteFactura = { this.deleteFactura } facturas = { facturas } />
                </Modal>
                <Modal size="xl" title={"Solicitar factura"} show = { modalAskFactura } handleClose = { this.handleCloseAskFactura }>
                    <FacturaForm options = { options } onChange = { this.onChange } form = { form } 
                        onSubmit = { this.onSubmitAskFactura } formeditado={formeditado} data ={data} />
                </Modal>
                <Modal size="xl" title={"Adjuntos"} show = { modalAdjuntos } handleClose = { this.handleCloseAdjuntos }>
                    <AdjuntosForm form = { form } onChangeAdjunto = { this.onChangeAdjunto } clearFiles = { this.clearFiles } 
                        onSubmit = { (e) => { e.preventDefault(); waitAlert(); this.addAdjuntoVentaAxios() } }/>
                    <TableForModals
                        columns = { ADJUNTOS_COLUMNS } 
                        data = { adjuntos } 
                        hideSelector = { true } 
                        mostrar_acciones={true}
                        actions={{
                            'deleteAdjunto': { function: this.openModalDeleteAdjuntos}
                        }}
                        dataID = 'adjuntos'
                        elements={data.adjuntos}
                            />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Ventas);