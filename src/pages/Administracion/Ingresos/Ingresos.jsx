import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, INGRESOS_COLUMNS, ADJUNTOS_COLUMNS } from '../../../constants'
import { setOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setAdjuntosList, setSelectOptions } from '../../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert, createAlert, deleteAlert, doneAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { Modal, ModalDelete } from '../../../components/singles'
import { Button, FileInput } from '../../../components/form-components'
import { FacturaForm } from '../../../components/forms'
import { FacturaTable } from '../../../components/tables'
import { Form, ProgressBar } from 'react-bootstrap'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import Select from '../../../components/form-components/Select'
import AdjuntosForm from '../../../components/forms/AdjuntosForm'
import TableForModals from '../../../components/tables/TableForModals'
import { IngresosCard } from '../../../components/cards'
import { Tab, Tabs } from 'react-bootstrap';
const $ = require('jquery');
class Ingresos extends Component {

    state = {
        active:'facturas',
        selectValido:false,
        ingresos: [],
        title: 'Nuevo ingreso',
        ingreso: '',
        modalDelete: false,
        modalFacturas: false,
        // modalAskFacturas: false,
        modalAdjuntos: false,
        modalSee: false,
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
        formeditado:0,
        options: {
            formasPago: [],
            metodosPago: [],
            estatusFacturas: [],
            empresas: [],
            clientes: []
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const ingresos = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!ingresos)
            history.push('/')
        this.getOptionsAxios()
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
                            if (element.rfc === obj.rfc_emisor) {
                                auxEmpresa = element
                            }
                        });
                        let auxCliente = ''
                        data.clientes.find(function (element, index) {
                            let cadena = obj.nombre_receptor.replace(' S. C.',  ' SC').toUpperCase()
                            cadena = cadena.replace(',S.A.',  ' SA').toUpperCase()
                            cadena = cadena.replace(/,/g, '').toUpperCase()
                            cadena = cadena.replace(/\./g, '').toUpperCase()
                            if (element.empresa.toUpperCase() === obj.nombre_receptor.toUpperCase() ||
                                element.empresa.toUpperCase() === cadena.toUpperCase()){
                                auxCliente = element
                            }
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
                            createAlert('No existe el cliente', '¿Lo quieres crear?', () => this.addClienteAxios(obj))
                        }
                        if (auxEmpresa && auxCliente) {
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
            formeditado:1
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
                })
            }
            if (ingreso.pagos) {
                ingreso.pagos.map((pago) => {
                    _aux.push({
                        name: 'Pago', text: pago.name, url: pago.url
                    })
                })
            }
            aux.push(
                {
                    actions: this.setActions(ingreso),
                    identificador: renderToString(setTextTable(ingreso.id)),
                    cuenta: renderToString(setArrayTable(
                        [
                            { name: 'Empresa', text: ingreso.empresa ? ingreso.empresa.name : '' },
                            { name: 'Cuenta', text: ingreso.cuenta ? ingreso.cuenta.nombre : '' },
                            { name: '# de cuenta', text: ingreso.cuenta ? ingreso.cuenta.numero : '' }
                        ]
                    )),
                    cliente: renderToString(setTextTable(ingreso.cliente ? ingreso.cliente.empresa : '')),
                    factura: renderToString(setTextTable(ingreso.factura ? 'Con factura' : 'Sin factura')),
                    monto: renderToString(setMoneyTable(ingreso.monto)),
                    impuesto: renderToString(setTextTable(ingreso.tipo_impuesto ? ingreso.tipo_impuesto.tipo : 'Sin definir')),
                    tipoPago: renderToString(setTextTable(ingreso.tipo_pago ? ingreso.tipo_pago.tipo : '')),
                    descripcion: renderToString(setTextTable(ingreso.descripcion)),
                    area: renderToString(setTextTable(ingreso.subarea ? ingreso.subarea.area.nombre : '')),
                    subarea: renderToString(setTextTable(ingreso.subarea ? ingreso.subarea.nombre : '')),
                    estatusCompra: renderToString(setTextTable(ingreso.estatus_compra ? ingreso.estatus_compra.estatus : '')),
                    total: renderToString(setMoneyTable(ingreso.total)),
                    adjuntos: renderToString(setArrayTable(_aux)),
                    fecha: renderToString(setDateTable(ingreso.created_at)),
                    id: ingreso.id,
                    objeto: ingreso
                }
            )
        })
        return aux
    }

    setAdjuntosTable = ingreso => {
        let aux = []
        let adjuntos = ingreso.presupuestos.concat(ingreso.pagos)
        adjuntos.map( (adjunto) => {
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
                text: 'Adjuntos',
                btnclass: 'primary',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            },
            {
                text: 'Ver',
                btnclass: 'dark',
                iconclass: 'flaticon2-expand',                  
                action: 'see',
                tooltip: {id:'see', text:'Mostrar', type:'info'},
            },
        )

        if (ingreso.factura) {
            aux.push(
                {
                    text: 'Facturas',
                    btnclass: 'primary',
                    iconclass: 'flaticon2-medical-records',
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
            ... this.state,
            modalDelete: true,
            ingreso: ingreso
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            ingreso: ''
        })
    }

    openModalFacturas = (ingreso) => {
        let { porcentaje, form } = this.state
        form.empresa = ingreso.empresa.id.toString()
        form.cliente = ingreso.cliente.id.toString()
        form.rfc = ingreso.cliente.rfc
        // form = this.clearForm()
        form.estatusCompra = ingreso.estatus_compra.id
        porcentaje = 0
        ingreso.facturas.map((factura) => {
            porcentaje = porcentaje + factura.total
        })
        porcentaje = porcentaje * 100 / (ingreso.total)
        porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
        this.setState({
            ... this.state,
            modalFacturas: true,
            ingreso: ingreso,
            facturas: ingreso.facturas,
            porcentaje,
            form,
            formeditado:1
        })
    }

    handleCloseFacturas = () => {
        this.setState({
            ... this.state,
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
    //         ... this.state,
    //         // modalAskFactura: true,
    //         ingreso: ingreso,
    //         form,
    //         formeditado:1
    //     })
    // }

    // handleCloseAskFactura = () => {
    //     this.setState({
    //         ... this.state,
    //         // modalAskFactura: false,
    //         ingreso: '',
    //         form: this.clearForm()
    //     })
    // }

    openModalAdjuntos = ingreso => {
        const { data } = this.state
        data.adjuntos = ingreso.presupuestos.concat(ingreso.pagos)
        this.setState({
            ... this.state,
            modalAdjuntos: true,
            ingreso: ingreso,
            form: this.clearForm(),
            formeditado:0,
            adjuntos: this.setAdjuntosTable(ingreso),
            data
        })
    }

    openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿Seguro deseas borrar el adjunto?', () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) }  )
    }

    openModalSee = ingreso => {
        this.setState({
            ... this.state,
            modalSee: true,
            ingreso: ingreso
        })
    }

    handleCloseSee = () => {
        this.setState({
            ... this.state,
            modalSee: false,
            ingreso: ''
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
            ingreso: ''
        })
    }

    deleteFactura = id => {
        waitAlert()
        this.deleteFacturaAxios(id)
    }

    async getIngresosAxios(){
        var table = $('#ingresostable').DataTable().ajax.reload();
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'ingresos/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data, options } = this.state
                const { clientes, empresas, formasPago, metodosPago, estatusFacturas, estatusCompras } = response.data
                options['metodosPago'] = setOptions(metodosPago, 'nombre', 'id')
                options['formasPago'] = setOptions(formasPago, 'nombre', 'id')
                options['estatusFacturas'] = setOptions(estatusFacturas, 'estatus', 'id')
                options['estatusCompras'] = setSelectOptions( estatusCompras, 'estatus' )
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['clientes'] = setOptions(clientes, 'empresa', 'id')
                data.clientes = clientes
                data.empresas = empresas
                swal.close()
                this.setState({
                    ... this.state,
                    data,
                    options
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

    async deleteIngresoAxios() {
        const { access_token } = this.props.authUser
        const { ingreso } = this.state
        await axios.delete(URL_DEV + 'ingresos/' + ingreso.id, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getIngresosAxios()
                this.setState({
                    ... this.state,
                    modalDelete: false,
                    ingreso: ''
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

    async sendFacturaAxios() {
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

        data.append('id', ingreso.id)

        await axios.post(URL_DEV + 'ingresos/factura', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                const { ingreso } = response.data
                let { porcentaje, form } = this.state
                form = this.clearForm()
                form.estatusCompra = ingreso.estatus_compra.id
                porcentaje = 0
                ingreso.facturas.map((factura) => {
                    porcentaje = porcentaje + factura.total
                })
                porcentaje = porcentaje * 100 / (ingreso.total)
                porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
                this.getIngresosAxios()
                this.setState({
                    ... this.state,
                    form,
                    ingreso: ingreso,
                    facturas: ingreso.facturas,
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

    async deleteFacturaAxios(id) {
        const { access_token } = this.props.authUser
        const { ingreso } = this.state
        await axios.delete(URL_DEV + 'ingresos/' + ingreso.id + '/facturas/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                const { ingreso } = response.data
                let { porcentaje} = this.state
                porcentaje = 0
                ingreso.facturas.map((factura) => {
                    porcentaje = porcentaje + factura.total
                })
                porcentaje = porcentaje * 100 / (ingreso.total)
                porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
                this.getIngresosAxios()
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    ingreso: ingreso,
                    facturas: ingreso.facturas,
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

    async askFacturaAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'facturas/ask', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    // modalAskFactura: false
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

    async addClienteAxios(obj) {
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

    async exportIngresosAxios(){

        waitAlert()
        
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'exportar/ingresos', { responseType:'blob', headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'ingresos.xlsx');
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

    async addAdjuntoEgresoAxios(){

        const { access_token } = this.props.authUser
        const { form, ingreso } = this.state
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

        data.append('id', ingreso.id )
        
        await axios.post(URL_DEV + 'ingresos/adjuntos', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {

                const { ingreso } = response.data
                const { data } = this.state
                data.adjuntos = ingreso.presupuestos.concat(ingreso.pagos)
                this.getIngresosAxios()

                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    ingreso: ingreso,
                    adjuntos: this.setAdjuntosTable(ingreso),
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
        const { ingreso } = this.state
        await axios.delete(URL_DEV + 'ingresos/' + ingreso.id + '/adjuntos/' + id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { ingreso } = response.data
                const { data } = this.state
                data.adjuntos = ingreso.presupuestos.concat(ingreso.pagos)
                this.getIngresosAxios()
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    ingreso: ingreso,
                    adjuntos: this.setAdjuntosTable(ingreso),
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

    onSelect = value => {
        const { form } = this.state
        if (value === 'facturas') {
        }
        this.setState({
            ... this.state,
            active: value,
            form
        })
    }

    render() {
        const { ingresos, form, options, modalDelete, modalFacturas, modalAdjuntos, adjuntos, porcentaje, facturas, modalAskFactura, data, formeditado, modalSee, ingreso, active} = this.state
        return (
            <Layout active={'administracion'}  {...this.props}>
                
                <NewTableServerRender columns={INGRESOS_COLUMNS} data={ingresos}
                    title='Ingresos' subtitle='Listado de ingresos'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url='/administracion/ingresos/add'
                    mostrar_acciones={true}

                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete },
                        'facturas': { function: this.openModalFacturas },
                        // 'askFacturas': { function: this.openModalAskFactura },
                        'adjuntos': { function: this.openModalAdjuntos }, 
                        'see': { function: this.openModalSee },
                    }}
                    elements={data.ingresos}
                    exportar_boton={true} 
                    onClickExport={() => this.exportIngresosAxios()}
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setIngresos }
                    urlRender = {URL_DEV + 'ingresos'}
                    elementClass = 'total'
                    idTable = 'ingresostable'
                    validateFactura={true}
                    tipo_validacion = 'ventas'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    />

                <ModalDelete title={"¿Estás seguro que deseas eliminar el ingreso?"}show={modalDelete} handleClose={this.handleCloseDelete} onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteIngresoAxios() }}>
                </ModalDelete>

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
                                    <div className="col-md-12 px-2 align-items-center d-flex mt-4">
                                        <Button icon='' className="mx-auto" type="submit" text="ENVIAR" />
                                    </div>
                                </div>
                            </Form>
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
                                data ={data}
                            />
                        </Tab>
                    </Tabs>
                </Modal>

                {/* <Modal size="xl" title={"Solicitud de factura"} show={modalAskFactura} handleClose={this.handleCloseAskFactura}>
                    <FacturaForm 
                        options={options}
                        onChange={this.onChange}
                        form={form}
                        onSubmit={this.onSubmitAskFactura}
                        formeditado={formeditado}
                        data ={data}
                    />
                </Modal> */}

                <Modal size="xl" title={"Adjuntos"} show = { modalAdjuntos } handleClose = { this.handleCloseAdjuntos }>
                    <AdjuntosForm form = { form } onChangeAdjunto = { this.onChangeAdjunto } clearFiles = { this.clearFiles } 
                        onSubmit = { (e) => { e.preventDefault(); waitAlert(); this.addAdjuntoEgresoAxios() } }/>
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
                <Modal size="lg" title="Ingreso" show = { modalSee } handleClose = { this.handleCloseSee } >
                    <IngresosCard ingreso={ingreso}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Ingresos);