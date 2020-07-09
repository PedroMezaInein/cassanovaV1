import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'

//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, GOLD, INGRESOS_COLUMNS } from '../../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert, createAlert } from '../../../functions/alert'

//
import Layout from '../../../components/layout/layout'
import { Modal, ModalDelete } from '../../../components/singles'
import { Button, FileInput } from '../../../components/form-components'
import { faPlus, faTrash, faEdit, faMoneyBill, faFileAlt, faFileArchive, faMoneyBillWave, faReceipt, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'
import { IngresosForm, FacturaForm } from '../../../components/forms'
import { DataTable, FacturaTable } from '../../../components/tables'
import { Small, B, Subtitle } from '../../../components/texts'
import Moment from 'react-moment'
import NumberFormat from 'react-number-format';
import { Form, ProgressBar } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NewTable from '../../../components/tables/NewTable'


class Ingresos extends Component {

    state = {
        selectValido:false,
        ingresos: [],
        title: 'Nuevo ingreso',
        ingreso: '',
        modalDelete: false,
        modalFacturas: false,
        modalAskFacturas: false,
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
        this.getIngresosAxios()
    }
    // Submit 
    onSubmitAskFactura = e => {
        e.preventDefault()
        waitAlert()
        this.askFacturaAxios()
    }
    // Form
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
                if (extension === 'xml') {
                    waitAlert()
                    const reader = new FileReader()
                    reader.onload = async (e) => {
                        const text = (e.target.result)
                        var XMLParser = require('react-xml-parser');
                        var xml = new XMLParser().parseFromString(text);
                        const emisor = xml.getElementsByTagName('cfdi:Emisor')[0]
                        const receptor = xml.getElementsByTagName('cfdi:Receptor')[0]
                        const timbreFiscalDigital = xml.getElementsByTagName('tfd:TimbreFiscalDigital')[0]
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
                            folio: xml.attributes.Folio ? xml.attributes.Folio : '',
                            serie: xml.attributes.Serie ? xml.attributes.Serie : '',
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
                            let cadena = obj.nombre_receptor.replace(/,/g, '')
                            cadena = cadena.replace(/\./g, '')
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

    // Route page
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

    // TABLA
    setIngresos = ingresos => {
        let aux = []
        ingresos.map((ingreso) => {
            aux.push(
                {
                    actions: this.setActions(ingreso),
                    cuenta: renderToString(setArrayTable(
                        [
                            { name: 'Empresa', text: ingreso.empresa ? ingreso.empresa.name : '' },
                            { name: 'Cuenta', text: ingreso.cuenta ? ingreso.cuenta.nombre : '' },
                            { name: '# de cuenta', text: ingreso.cuenta ? ingreso.cuenta.numero : '' }
                        ]
                    )),
                    cliente: renderToString(setTextTable(ingreso.cliente ? ingreso.cliente.empresa : '')),
                    factura: renderToString(setTextTable(ingreso.facturas.length ? 'Con factura' : 'Sin factura')),
                    monto: renderToString(setMoneyTable(ingreso.monto)),
                    impuesto: renderToString(setTextTable(ingreso.tipo_impuesto ? ingreso.tipo_impuesto.tipo : 'Sin definir')),
                    tipoPago: renderToString(setTextTable(ingreso.tipo_pago ? ingreso.tipo_pago.tipo : '')),
                    descripcion: renderToString(setTextTable(ingreso.descripcion)),
                    area: renderToString(setTextTable(ingreso.subarea ? ingreso.subarea.area.nombre : '')),
                    subarea: renderToString(setTextTable(ingreso.subarea ? ingreso.subarea.nombre : '')),
                    estatusCompra: renderToString(setTextTable(ingreso.estatus_compra ? ingreso.estatus_compra.estatus : '')),
                    total: renderToString(setMoneyTable(ingreso.total)),
                    adjuntos: renderToString(setAdjuntosList([
                        ingreso.pago ? { name: 'Pago', url: ingreso.pago.url } : '',
                        ingreso.presupuesto ? { name: 'Presupuesto', url: ingreso.presupuesto.url } : '',
                    ])),
                    fecha: renderToString(setDateTable(ingreso.created_at)),
                    id: ingreso.id
                }
            )
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
            }
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
                {
                    text: 'Pedir&nbsp;factura',
                    btnclass: 'info',
                    iconclass: 'flaticon-file-1',
                    action: 'askFacturas',
                    tooltip: { id: 'ask-taxes', text: 'Facturas' },
                }
            )
        }
        return aux

        /* return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.changePageEdit(ingreso)} } text='' icon={faEdit} color="transparent" 
                        tooltip={{id:'edit', text:'Editar'}} />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => { e.preventDefault(); this.openModalDelete(ingreso)} } text='' icon={faTrash} color="red" 
                        tooltip={{id:'delete', text:'Eliminar', type:'error'}} />
                </div>
                {
                    ingreso.factura ?
                        <div className="d-flex align-items-center flex-column flex-md-row">
                            <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.openModalFacturas(ingreso)} } text='' icon={faReceipt} color="transparent" 
                                tooltip={{id:'taxes', text:'Facturas'}} />
                            <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.openModalAskFactura(ingreso)} } text='' icon={faEnvelopeOpenText} color="transparent" 
                                tooltip={{id:'bills', text:'Pedir factura'}} />
                        </div>
                    : ''
                }
            </>
        ) */
    }

    // Modales
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
        let { porcentaje } = this.state
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
            form: this.clearForm(),
            formeditado:0
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

    openModalAskFactura = ingreso => {
        const { form } = this.state
        form.empresa = ingreso.empresa.id.toString()
        form.cliente = ingreso.cliente.id.toString()
        form.rfc = ingreso.cliente.rfc
        this.setState({
            ... this.state,
            modalAskFactura: true,
            ingreso: ingreso,
            form,
            formeditado:1
        })
    }

    handleCloseAskFactura = () => {
        this.setState({
            ... this.state,
            modalAskFactura: false,
            ingreso: '',
            form: this.clearForm()
        })
    }

    deleteFactura = id => {
        waitAlert()
        this.deleteFacturaAxios(id)
    }

    async getIngresosAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'ingresos', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data, options } = this.state
                const { ingresos, clientes, empresas, formasPago, metodosPago, estatusFacturas } = response.data
                options['metodosPago'] = setOptions(metodosPago, 'nombre', 'id')
                options['formasPago'] = setOptions(formasPago, 'nombre', 'id')
                options['estatusFacturas'] = setOptions(estatusFacturas, 'estatus', 'id')
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['clientes'] = setOptions(clientes, 'empresa', 'id')
                data.clientes = clientes
                data.empresas = empresas
                data.ingresos = ingresos
                this.setState({
                    ... this.state,
                    ingresos: this.setIngresos(ingresos),
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
                const { ingresos } = response.data
                const { data } = this.state
                data.ingresos = ingresos
                this.setState({
                    ... this.state,
                    ingresos: this.setIngresos(ingresos),
                    data,
                    modalDelete: false,
                    ingreso: ''
                })
                swal({
                    title: '¡Listo 👋!',
                    text: response.data.message !== undefined ? response.data.message : 'El ingreso fue eliminado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
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

    // Factura
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

                const { ingreso, ingresos } = response.data
                let { porcentaje, data } = this.state
                porcentaje = 0
                ingreso.facturas.map((factura) => {
                    porcentaje = porcentaje + factura.total
                })
                porcentaje = porcentaje * 100 / (ingreso.total)
                porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
                data.ingresos = ingresos
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    ingreso: ingreso,
                    facturas: ingreso.facturas,
                    porcentaje,
                    data,
                    ingresos: this.setIngresos(ingresos)
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

                const { ingresos, ingreso } = response.data
                let { porcentaje, data } = this.state
                porcentaje = 0
                ingreso.facturas.map((factura) => {
                    porcentaje = porcentaje + factura.total
                })
                porcentaje = porcentaje * 100 / (ingreso.total)
                porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
                data.ingresos = ingresos
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    ingreso: ingreso,
                    data,
                    ingresos: this.setIngresos(ingresos),
                    facturas: ingreso.facturas,
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
                    modalAskFactura: false
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


        let cadena = obj.nombre_receptor.replace(/,/g, '')
        cadena = cadena.replace(/\./g, '').toUpperCase()
        data.append('empresa', cadena)
        data.append('nombre', cadena)
        data.append('rfc', obj.rfc_receptor.toUpperCase())

        console.log(obj, 'obj')

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
        const { ingresos, form, options, modalDelete, modalFacturas, porcentaje, facturas, ingreso, modalAskFactura, data, formeditado } = this.state
        return (
            <Layout active={'administracion'}  {...this.props}>
                {/* <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.changePageAdd() } } text='' icon = { faPlus } color="green" 
                        tooltip={{id:'add', text:'Nuevo'}} />
                </div> */}

                {/* <DataTable columns = {INGRESOS_COLUMNS} data= {ingresos}/> */}
                <NewTable columns={INGRESOS_COLUMNS} data={ingresos}
                    title='Ingresos' subtitle='Listado de ingresos'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url='/administracion/ingresos/add'
                    mostrar_acciones={true}

                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete },
                        'facturas': { function: this.openModalFacturas },
                        'askFacturas': { function: this.openModalAskFactura }
                    }}
                    elements={data.ingresos} />

                <ModalDelete title={"¿Estás seguro que deseas eliminar el ingreso?"}show={modalDelete} handleClose={this.handleCloseDelete} onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteIngresoAxios() }}>
                </ModalDelete>

                <Modal title={"Facturas"} show={modalFacturas} handleClose={this.handleCloseFacturas}>
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-12">
                        <ProgressBar 
                            animated label={`${porcentaje}%`}
                            variant={porcentaje > 100 ? 'danger' : porcentaje > 75 ? 'success' : 'warning'}
                            now={porcentaje} 
                        />
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
                            {
                                form.adjuntos.factura.files.length ?
                                    <div className="col-md-6 px-2 align-items-center d-flex">
                                        <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                                    </div>
                                    : ''
                            }
                        </div>
                    </Form>
                    <FacturaTable deleteFactura={this.deleteFactura} facturas={facturas} />
                </Modal>

                <Modal title={"Solicitud de factura"} show={modalAskFactura} handleClose={this.handleCloseAskFactura}>
                    <FacturaForm options={options} onChange={this.onChange} form={form}
                        onSubmit={this.onSubmitAskFactura} formeditado={formeditado} />
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