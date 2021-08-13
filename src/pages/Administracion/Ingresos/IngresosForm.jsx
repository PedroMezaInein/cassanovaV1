import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV } from '../../../constants'
import { setOptions, setSelectOptions } from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, createAlert, doneAlert, errorAlertRedirectOnDissmis} from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { IngresosForm as IngresosFormulario } from '../../../components/forms'
import { Card } from 'react-bootstrap'
import { setSingleHeader } from '../../../functions/routers'
class IngresosForm extends Component {
    state = {
        ingresos: [],
        ingreso: '',
        title: 'Nuevo ingreso',
        options: {
            empresas: [],
            cuentas: [],
            areas: [],
            subareas: [],
            tiposPagos: [],
            tiposImpuestos: [],
            estatusCompras: [],
            clientes: [],
        },
        data: {
            clientes: [],
            empresas: []
        },
        formeditado: 0,
        form: {
            factura: 'Sin factura',
            rfc: '',
            cliente: '',
            empresa: '',
            cuenta: '',
            area: '',
            subarea: '',
            total: '',
            descripcion: '',
            facturaObject: '',
            fileFactura: {
                value: '',
                adjuntos: [],
            },
            tipoPago: 0,
            tipoImpuesto: 0,
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
        }
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const ingresos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        })
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nuevo ingreso',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.ingreso) {
                        const { ingreso } = state
                        const { form, options } = this.state
                        if (ingreso.empresa) {
                            form.empresa = ingreso.empresa.id.toString()
                            options['cuentas'] = setOptions(ingreso.empresa.cuentas, 'nombre', 'id')
                            form.cuenta = ingreso.cuenta.id.toString()
                        }
                        if (ingreso.subarea) {
                            form.area = ingreso.subarea.area.id.toString()
                            options['subareas'] = setOptions(ingreso.subarea.area.subareas, 'nombre', 'id')
                            form.subarea = ingreso.subarea.id.toString()
                        }
                        form.factura = ingreso.factura ? 'Con factura' : 'Sin factura'
                        form.tipoPago = ingreso.tipo_pago ? ingreso.tipo_pago.id : 0
                        form.tipoImpuesto = ingreso.tipo_impuesto ? ingreso.tipo_impuesto.id : 0
                        form.estatusCompra = ingreso.estatus_compra ? ingreso.estatus_compra.id : 0
                        form.total = ingreso.monto
                        form.fecha = new Date(ingreso.created_at)
                        form.descripcion = ingreso.descripcion
                        if (ingreso.cliente) {
                            form.cliente = ingreso.cliente.id.toString()
                            form.rfc = ingreso.cliente.rfc
                        }
                        if (ingreso.pago) {
                            form.adjuntos.pago.files = [{
                                name: ingreso.pago.name, url: ingreso.pago.url
                            }]
                        }
                        if (ingreso.presupuesto) {
                            form.adjuntos.presupuesto.files = [{
                                name: ingreso.presupuesto.name, url: ingreso.presupuesto.url
                            }]
                        }
                        this.setState({
                            ...this.state,
                            title: 'Editar ingreso',
                            form,
                            options,
                            ingreso: ingreso,
                            formeditado: 1
                        })
                    }
                    else
                        history.push('/administracion/ingresos')
                } else
                    history.push('/administracion/ingresos')
                break;
            default:
                break;
        }
        if (!ingresos)
            history.push('/')
        this.getOptionsAxios()
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
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
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
            return false
        })
        return form;
    }
    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ...this.state,
            options
        })
    }
    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar ingreso') {
            this.editIngresoAxios()
        } else
            this.addIngresoAxios()
    }
    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        await axios.options(`${URL_DEV}v2/administracion/ingresos`, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { clientes, empresas, areas, tiposPagos, tiposImpuestos, estatusCompras } = response.data
                const { options, data } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['clientes'] = setOptions(clientes, 'empresa', 'id')
                options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
                options['tiposImpuestos'] = setSelectOptions(tiposImpuestos, 'tipo')
                options['estatusCompras'] = setSelectOptions(estatusCompras, 'estatus')
                data.clientes = clientes
                data.empresas = empresas
                this.setState({
                    ...this.state,
                    options,
                    data
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async addIngresoAxios() {
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
        await axios.post(URL_DEV + 'ingresos', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.setState({
                    ...this.state,
                    form: this.clearForm()
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/administracion/ingresos'
                });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async editIngresoAxios() {
        const { access_token } = this.props.authUser
        const { form, ingreso } = this.state
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
            return false
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
            return false
        })
        await axios.post(URL_DEV + 'ingresos/update/' + ingreso.id, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.setState({
                    ...this.state,
                    form: this.clearForm()
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/administracion/ingresos'
                });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
        const { form, title, options, formeditado, data } = this.state
        return (
            <Layout active={'administracion'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <IngresosFormulario
                            formeditado={formeditado}
                            className="px-3"
                            title={title}
                            form={form}
                            onChange={this.onChange}
                            onChangeAdjunto={this.onChangeAdjunto}
                            clearFiles={this.clearFiles}
                            options={options}
                            setOptions={this.setOptions}
                            onSubmit={this.onSubmit}
                            data={data} />
                    </Card.Body>
                </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(IngresosForm);