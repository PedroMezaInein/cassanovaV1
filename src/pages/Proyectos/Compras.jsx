/* eslint-disable no-unused-vars */  
import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, COMPRAS_COLUMNS } from '../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../functions/setters'
import { errorAlert, waitAlert, createAlert, forbiddenAccessAlert } from '../../functions/alert'

//
import Layout from '../../components/layout/layout'
import { Button, FileInput } from '../../components/form-components'
import { Modal, ModalDelete } from '../../components/singles'
import { faPlus, faLink, faEdit, faTrash, faReceipt, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'
import { ComprasForm, FacturaForm } from '../../components/forms'
import { DataTable, FacturaTable } from '../../components/tables'
import Subtitle from '../../components/texts/Subtitle'
import {SolicitudCompraCard} from '../../components/cards'
import { Form, ProgressBar } from 'react-bootstrap'
import NewTable from '../../components/tables/NewTable'

class Compras extends Component{

    state = {
        modal: false,
        modalDelete: false,
        modalFacturas: false,
        modalAskFactura: false,
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
        },
        options: {
            empresas:[],
            cuentas:[],
            areas:[],
            subareas:[],
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
        data:{
            clientes: [],
            empresas: [],
            cuentas: [],
            proyectos: [],
            proveedores: [],            
            compras: []
        },
        solicitud: '',
        compras: [],
        compra: '',
        porcentaje: '',
        facturas: []
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const compras = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if(!compras)
            history.push('/')
        this.getComprasAxios()
        const { state } = this.props.location
        if(state){
            if(state.solicitud){
                this.getSolicitudCompraAxios(state.solicitud.id)
            }
        }
    }

    // Setters

    setOptions = (name, array) => {
        const {options} = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }

    setCompras = compras => {
        let aux = []
        compras.map( (compra) => {
            aux.push(
                {
                    actions: this.setActions(compra),
                    cuenta: renderToString(setArrayTable(
                        [
                            {name:'Empresa', text: compra.empresa ? compra.empresa.name : ''},
                            {name:'Cuenta', text: compra.cuenta ? compra.cuenta.nombre : ''},
                            {name:'# de cuenta', text: compra.cuenta ? compra.cuenta.numero : ''}
                        ]
                    )),
                    proyecto: renderToString(setTextTable(compra.proyecto ? compra.proyecto.nombre : '')),
                    proveedor: renderToString(setTextTable(compra.proveedor ? compra.proveedor.nombre : '')),
                    factura: renderToString(setTextTable(compra.facturas.length ? 'Con factura' : 'Sin factura')),
                    monto: renderToString(setMoneyTable(compra.monto)),
                    comision: renderToString(setMoneyTable(compra.comision)),
                    impuesto: renderToString(setTextTable( compra.tipo_impuesto ? compra.tipo_impuesto.tipo : 'Sin definir')),
                    tipoPago: renderToString(setTextTable(compra.tipo_pago.tipo)),
                    descripcion: renderToString(setTextTable(compra.descripcion)),
                    area: renderToString(setTextTable( compra.subarea ? compra.subarea.area ? compra.subarea.area.nombre : '' : '')),
                    subarea: renderToString(setTextTable( compra.subarea ? compra.subarea.nombre : '')),
                    estatusCompra: renderToString(setTextTable( compra.estatus_compra ? compra.estatus_compra.estatus : '')),
                    total: renderToString(setMoneyTable(compra.total)),
                    adjuntos: renderToString(setAdjuntosList([
                        compra.pago ? {name: 'Pago', url: compra.pago.url} : '',
                        compra.presupuesto ? {name: 'Presupuesto', url: compra.presupuesto.url} : '',
                    ])),
                    fecha: renderToString(setDateTable(compra.created_at)),
                    id: compra.id

                }
            )
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
                },
                {
                    text: 'Pedir&nbsp;factura',
                    btnclass: 'primary',
                    iconclass: 'flaticon2-medical-records',
                    action: 'askFacturas',
                    tooltip: { id: 'ask-taxes', text: 'Facturas' },
                }
            )
        }
        return aux

    }
    
    
    
    

    //Add, edit y convert modal
    openModal = ( ) => {
        this.setState({
            ... this.state,
            modal: true,
            title: 'Nueva compra',
            form: this.clearForm()
        })
    }

    openModalEdit = (compra) => {
        const { form, options } = this.state
        form.factura = compra.factura ? 'Con factura' : 'Sin factura'
        if(compra.proyecto){
            if(compra.proyecto.cliente){
                /* form.cliente = compra.proyecto.cliente.id.toString()
                options['proyectos'] = setOptions(compra.proyecto.cliente.proyectos, 'nombre', 'id') */
                form.proyecto = compra.proyecto.id.toString()
            }
        }
        if(compra.empresa){
            form.empresa = compra.empresa.id.toString()
            options['cuentas'] = setOptions(compra.empresa.cuentas, 'nombre', 'id')
            if(compra.cuenta)
                form.cuenta = compra.cuenta.id.toString()
        }
        if(compra.subarea){
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
        if(compra.proveedor){
            options['contratos'] = setOptions(compra.proveedor.contratos, 'nombre', 'id')
            form.proveedor = compra.proveedor.id.toString()
            if(compra.contrato){
                form.contrato = compra.contrato.id.toString()
            }
        }
        if(compra.pago){
            form.adjuntos.pago.files = [{
                name: compra.pago.name, url: compra.pago.url
            }]
        }
        if(compra.presupuesto){
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
            title: 'Editar compra'
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
    // Delete
    openModalDelete = (compra) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            compra: compra
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            compra: ''
        })
    }

    //Facturas
    openModalFacturas = compra => {
        let { porcentaje } = this.state
        porcentaje = 0
        compra.facturas.map((factura)=>{
            porcentaje = porcentaje + factura.total
        })
        porcentaje = porcentaje * 100 / (compra.total - compra.comision)
        porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
        this.setState({
            ... this.state,
            modalFacturas: true,
            compra: compra,
            facturas: compra.facturas,
            porcentaje,
            form: this.clearForm()
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

    //ClearForm
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

    //Form
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
                if(extension === 'xml'){
                    waitAlert()
                    const reader = new FileReader()
                    reader.onload = async (e) => { 
                        const text = (e.target.result)
                        var XMLParser = require('react-xml-parser');
                        var xml = new XMLParser().parseFromString(text);
                        const emisor = xml.getElementsByTagName('cfdi:Emisor')[0]
                        const receptor = xml.getElementsByTagName('cfdi:Receptor')[0]
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
                            numero_certificado: xml.attributes.NoCertificado ? xml.attributes.NoCertificado : '',
                            folio: xml.attributes.Folio ? xml.attributes.Folio : '',
                            serie: xml.attributes.Serie ? xml.attributes.Serie : '',
                        }
                        if(obj.numero_certificado === ''){
                            let NoCertificado = text.search('NoCertificado="')
                            if(NoCertificado)
                                obj.numero_certificado = text.substring(NoCertificado+15, NoCertificado + 35)
                        }
                        let aux = ''
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
                            console.log(index, '---')
                            console.log(element)
                            console.log(obj.rfc_receptor)
                            if(element.rfc === obj.rfc_receptor){
                                auxEmpresa = element
                            }
                        });
                        let auxProveedor = ''
                        data.proveedores.find(function(element, index) {
                            if(element.razon_social === obj.nombre_emisor){
                                auxProveedor = element
                            }
                        });
                        if(auxEmpresa){
                            options['cuentas'] = setOptions(auxEmpresa.cuentas, 'nombre', 'id')
                            form.empresa = auxEmpresa.name
                        }else{
                            errorAlert('No existe la empresa')
                        }
                        if(auxProveedor){
                            form.proveedor = auxProveedor.id.toString()
                            if(auxProveedor.contratos){
                                options['contratos'] = setOptions(auxProveedor.contratos, 'nombre', 'id')
                            }
                        }else{
                            createAlert('No existe el proveedor', '¿Lo quieres crear?', () => this.addProveedorAxios(obj))
                        }
                        if(auxEmpresa && auxProveedor){
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

    //Submits
    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if(title === 'Editar compra')
            this.editCompraAxios()
        else
            this.addCompraAxios()
    }

    deleteFactura = id => {
        waitAlert()
        this.deleteFacturaAxios(id)
    }

    // Async
    // Compras
    async getComprasAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'compras', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras, proyectos,
                    clientes, compras, proveedores, formasPago, metodosPago, estatusFacturas, contratos } = response.data
                const { options, data } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                /* options['contratos'] = setOptions(contratos, 'nombre', 'id') */
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['tiposPagos'] = setSelectOptions( tiposPagos, 'tipo' )
                options['tiposImpuestos'] = setSelectOptions( tiposImpuestos, 'tipo' )
                options['estatusCompras'] = setSelectOptions( estatusCompras, 'estatus' )
                options['estatusFacturas'] = setOptions(estatusFacturas, 'estatus', 'id')
                options['formasPago'] = setOptions(formasPago, 'nombre', 'id')
                options['metodosPago'] = setOptions(metodosPago, 'nombre', 'id')
                data.proveedores = proveedores
                data.empresas = empresas
                data.compras = compras
                this.setState({
                    ... this.state,
                    options,
                    /* form: this.clearForm(), */
                    compras: this.setCompras(compras),
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

    async addCompraAxios(){

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
        
        await axios.post(URL_DEV + 'compras', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {

                const { compras } = response.data
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    modal: false,
                    compras: this.setCompras(compras)
                })
                
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
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

    async addProveedorAxios(obj){

        const { access_token } = this.props.authUser

        const data = new FormData();

        data.append('nombre', obj.nombre_emisor)
        data.append('razonSocial', obj.nombre_emisor)
        data.append('rfc', obj.rfc_emisor)

        await axios.post(URL_DEV + 'proveedores', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {

                const { proveedores, proveedor } = response.data

                const { options, data, form } = this.state
                data.proveedores = proveedores
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                form.proveedor = proveedor.id.toString()

                this.setState({
                    ... this.state,
                    data,
                    options,
                    form
                })
                
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
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

    async editCompraAxios(){

        const { access_token } = this.props.authUser
        const { form, compra } = this.state
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
        
        await axios.post(URL_DEV + 'compras/update/' + compra.id, data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {

                const { compras } = response.data
                const { data } = this.state

                data.compras = compras

                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    modal: false,
                    compras: this.setCompras(compras),
                    data
                })
                
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
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

    async deleteCompraAxios(){

        const { access_token } = this.props.authUser
        const { compra } = this.state
        await axios.delete(URL_DEV + 'compras/' + compra.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                
                const { compras } = response.data

                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    compras: this.setCompras(compras),
                    modalDelete: false,
                    compra: ''
                })

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El ingreso fue eliminado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
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

    // Solicitud compra
    async getSolicitudCompraAxios(id){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'solicitud-compra/'+id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { solicitud } = response.data
                const { options, form } = this.state
                form.solicitud = solicitud.id
                form.factura = solicitud.factura ? 'Con factura' : 'Sin factura'
                if(solicitud.factura){
                    let aux = ''
                    options.tiposImpuestos.find(function(element, index) {        
                        if(element.text === 'IVA')
                            aux = element.value
                    });
                    form.tipoImpuesto = aux
                }
                if(solicitud.proveedor){
                    form.proveedor = solicitud.proveedor.id.toString()
                }
                if(solicitud.proyecto){
                    if(solicitud.proyecto.cliente){
                        if(solicitud.proyecto.cliente.proyectos){
                            options['proyectos'] = setOptions(solicitud.proyecto.cliente.proyectos, 'nombre', 'id')
                            /* form.cliente = solicitud.proyecto.cliente.id.toString() */
                            form.proyecto = solicitud.proyecto.id.toString()
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
                    title: 'Convierte la solicitud de compra',
                    solicitud: solicitud,
                    modal: true,
                    form,
                    options
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

    // Factura
    async sendFacturaAxios(){

        const { access_token } = this.props.authUser
        const { form, compra } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'facturaObject':
                    data.append(element, JSON.stringify(form[element]))
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

        data.append('id', compra.id )
        
        await axios.post(URL_DEV + 'compras/factura', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {

                const { compra } = response.data
                let { porcentaje } = this.state
                porcentaje = 0
                compra.facturas.map((factura)=>{
                    porcentaje = porcentaje + factura.total
                })
                porcentaje = porcentaje * 100 / (compra.total - compra.comision)
                porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    compra: compra,
                    facturas: compra.facturas,
                    porcentaje
                })
                
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
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
    
    async deleteFacturaAxios(id){

        const { access_token } = this.props.authUser
        const { compra } = this.state
        await axios.delete(URL_DEV + 'compras/' + compra.id + '/facturas/' + id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                
                const { compra } = response.data
                let { porcentaje } = this.state
                porcentaje = 0
                compra.facturas.map((factura)=>{
                    porcentaje = porcentaje + factura.total
                })
                porcentaje = porcentaje * 100 / (compra.total - compra.comision)
                porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    compra: compra,
                    facturas: compra.facturas,
                    porcentaje
                })
                
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
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

    render(){

        const {
            modal, modalDelete, modalFacturas, modalAskFactura,
            title, form, options,
            solicitud, compras, porcentaje, facturas, compra,data
        } = this.state

        return(
            <Layout active={'proyectos'}  { ...this.props}>
               
                <NewTable columns={COMPRAS_COLUMNS} data={compras}
                    title='Compras' subtitle='Listado de compras'
                    mostrar_boton={true}
                    abrir_modal={true}                    
                    onClick={this.openModal}
                    mostrar_acciones={true}

                    actions={{
                        'edit': { function: this.openModalEdit },
                        'delete': { function: this.openModalDelete },
                        'facturas': { function: this.openModalFacturas },
                        'askFacturas': { function: this.openModalAskFactura }
                    }}
                    elements={data.compras} />


                <Modal title = { title } show = {modal} handleClose = { this.handleClose } >
                    <ComprasForm  options = {options} form = {form} setOptions = {this.setOptions} data = { data }
                        onChange = { this.onChange } onChangeAdjunto = { this.onChangeAdjunto } clearFiles = {this.clearFiles}
                        sendFactura = { () => { this.sendFactura() } } onSubmit = { this.onSubmit } >
                        {
                            solicitud ?
                                <SolicitudCompraCard solicitud = {solicitud} />
                            : ''
                        }
                    </ComprasForm>
                </Modal>
                <ModalDelete show = { modalDelete } handleClose = { this.handleCloseDelete } onClick = { (e) => { e.preventDefault(); waitAlert(); this.deleteCompraAxios() }}>
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar la compra?
                    </Subtitle>
                </ModalDelete>
                <Modal show = { modalFacturas } handleClose = { this.handleCloseFacturas }>
                    <Subtitle className="text-center" color = 'gold' >
                        Facturas
                    </Subtitle>
                    {
                        compra.tipo_pago ?
                            compra.tipo_pago.tipo !== 'TOTAL' ?
                                <>
                                    <div className="px-3 my-2">
                                        <ProgressBar animated label={`${porcentaje}%`} 
                                            variant = { porcentaje > 100 ? 'danger' : porcentaje > 75 ? 'success' : 'warning'} 
                                            now = {porcentaje} />
                                    </div>
                                    <Form onSubmit = { (e) => { e.preventDefault(); waitAlert(); this.sendFacturaAxios();}}>
                                        <div className="row mx-0">
                                            <div className="col-md-6 px-2">
                                                
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
                                            {
                                                form.adjuntos.factura.files.length ?
                                                    <div className="col-md-6 px-2 align-items-center d-flex">
                                                        <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                                                    </div>
                                                : ''
                                            }
                                        </div>
                                    </Form>
                                </>
                            : ''
                        : ''
                    }
                    
                    
                    <FacturaTable deleteFactura = { this.deleteFactura } facturas = { facturas } />
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

export default connect(mapStateToProps, mapDispatchToProps)(Compras);