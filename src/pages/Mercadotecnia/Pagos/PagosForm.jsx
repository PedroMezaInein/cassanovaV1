import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV } from '../../../constants'
import { setOptions, setSelectOptions } from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, createAlert, doneAlert, deleteAlert, errorAlertRedirectOnDissmis } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { PagosForm as PagosFormulario } from '../../../components/forms'
import { Card } from 'react-bootstrap'
import XMLParser from 'react-xml-parser'
class PagosForm extends Component {
    
    state = {
        title: 'Nuevo pago',
        solicitud: '',
        options: {
            empresas: [],
            cuentas: [],
            areas: [],
            subareas: [],
            tiposPagos: [],
            tiposImpuestos: [],
            estatusCompras: [],
            proveedores: [],
        }, 
        form: {
            factura: 'Sin factura',
            rfc: '',
            proveedor: '',
            empresa: '',
            cuenta: '',
            area: '',
            subarea: '',
            total: '',
            comision: 0,
            descripcion: '',
            facturaObject: '',
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
        },
        data: {
            proveedores: [],
            empresas: []
        },
        formeditado: 0
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

    onChangeFactura = e => {
        const { files, value, name } = e.target
        const { data, form, options } = this.state
        let aux = []
        for(let x = 0; x < files.length; x++){
            let file = files[x];
            let extension = file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1);
            if (extension.toUpperCase() === 'XML') {
                const reader = new FileReader()
                reader.onload = async (e) => {
                    const { result: text } = e.target
                    let xml = new XMLParser().parseFromString(text);
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
                        if (element.rfc === obj.rfc_receptor)
                            auxEmpresa = element
                        return false
                    });
                    let auxProveedor = ''
                    data.proveedores.find(function (element, index) {
                        if(element.rfc)
                            if (element.rfc.toUpperCase() === obj.rfc_emisor.toUpperCase()) 
                                auxProveedor = element
                        return false
                    });
                    if (auxEmpresa) {
                        options['cuentas'] = setOptions(auxEmpresa.cuentas, 'nombre', 'id')
                        form.empresa = auxEmpresa.name
                    } else { errorAlert('No existe la empresa') }
                    if (auxProveedor) { form.proveedor = auxProveedor.id.toString() } 
                    else {
                        if(obj.nombre_emisor === ''){
                            const { history } = this.props
                            errorAlertRedirectOnDissmis('LA FACTURA NO TIENE RAZÓN SOCIAL, CREA EL PROVEEDOR DESDE LA SECCIÓN DE PROVEEDORES EN LEADS.', history, '/leads/proveedores')
                        }else createAlert('NO EXISTE EL PROVEEDOR', '¿LO QUIERES CREAR?', () => this.addProveedorAxios(obj))
                    }
                    if (auxEmpresa && auxProveedor) { Swal.close() }
                    form.facturaObject = obj
                    form.rfc = obj.rfc_emisor
                    this.setState({
                        ...this.state,
                        options,
                        form
                    })
                }
                reader.readAsText(file)
            }
            aux.push(
                {
                    name: file.name,
                    file: file,
                    url: URL.createObjectURL(file),
                    key: x
                }
            )
        }

        form.adjuntos[name].value = value
        form.adjuntos[name].files = aux
        
        this.setState({ ...this.state, form })
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
                case 'comision':
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

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar pago') {
            this.editPagoAxios()
        } else
            this.addPagoAxios()
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const pagos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nuevo pago',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.pago) {
                        const { pago } = state
                        const { form, options } = this.state
                        if (pago.empresa) {
                            form.empresa = pago.empresa.id.toString()
                            options['cuentas'] = setOptions(pago.empresa.cuentas, 'nombre', 'id')
                            form.cuenta = pago.cuenta.id.toString()
                        }
                        if (pago.subarea) {
                            form.area = pago.subarea.area.id.toString()
                            options['subareas'] = setOptions(pago.subarea.area.subareas, 'nombre', 'id')
                            form.subarea = pago.subarea.id.toString()
                        }
                        form.tipoPago = pago.tipo_pago ? pago.tipo_pago.id : 0
                        form.tipoImpuesto = pago.tipo_impuesto ? pago.tipo_impuesto.id : 0
                        form.estatusCompra = pago.estatus_compra ? pago.estatus_compra.id : 0
                        form.total = pago.monto
                        form.fecha = new Date(pago.created_at)
                        form.descripcion = pago.descripcion ==="null"?"":pago.descripcion
                        form.comision = pago.comision
                        form.factura = pago.factura ? 'Con factura' : 'Sin factura'
                        if (pago.proveedor) {
                            form.proveedor = pago.proveedor.id.toString()
                            form.rfc = pago.proveedor.rfc
                        }
                        if (pago.pagos)
                            form.adjuntos.pago.files = pago.pagos
                        if (pago.presupuestos)
                            form.adjuntos.presupuesto.files = pago.presupuestos
                        this.setState({
                            ...this.state,
                            title: 'Editar pago',
                            form,
                            options,
                            pago: pago,
                            formeditado: 1
                        })
                    }
                    else
                        history.push('/mercadotecnia/pagos')
                } else
                    history.push('/mercadotecnia/pagos')
                break;
            case 'convert':
                const { form, options } = this.state
                const { solicitud } = state
                if(solicitud.proveedor)
                    form.proveedor = solicitud.proveedor.id.toString()
                if(solicitud.empresa){
                    form.empresa = solicitud.empresa.id.toString()
                    if(solicitud.empresa.cuentas)
                        options.cuentas = setOptions(solicitud.empresa.cuentas, 'nombre', 'id')
                }
                if(solicitud.subarea){
                    if(solicitud.subarea.area){
                        form.area = solicitud.subarea.area.id.toString()
                        options.subareas = setOptions(solicitud.subarea.area.subareas, 'nombre', 'id')
                        form.subarea = solicitud.subarea.id.toString()
                    }
                }
                if(solicitud.tipo_pago)
                    form.tipoPago = solicitud.tipo_pago.id
                form.total = solicitud.monto
                form.descripcion = solicitud.descripcion
                form.fecha = new Date(solicitud.fecha)
                if(solicitud.factura)
                    form.factura = 'Con factura'
                else
                    form.factura = 'Sin factura'
                this.setState({...this.state, title: 'Convertir solicitud de pago', solicitud: state.solicitud, form, options})
                break;
            default:
                break;
        }
        if (!pagos)
            history.push('/')
        this.getEgresosAxios()
    }

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({ ...this.state, options })
    }

    getEgresosAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'mercadotecnia/pagos/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proveedores, empresas, subareas, tiposPagos, tiposImpuestos, estatusCompras } = response.data
                const { options, data } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['subareas'] = setOptions(subareas, 'nombre', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
                options['tiposImpuestos'] = setSelectOptions(tiposImpuestos, 'tipo')
                options['estatusCompras'] = setSelectOptions(estatusCompras, 'estatus')
                data.proveedores = proveedores
                data.empresas = empresas
                this.setState({
                    ...this.state,
                    options,
                    data
                })
                Swal.close()
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    addPagoAxios = async () => {
        const { access_token } = this.props.authUser
        const { form, solicitud } = this.state
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
        if(solicitud !== ''){
            data.append(`solicitud`, solicitud.id)
        }
        await axios.post(`${URL_DEV}mercadotecnia/pagos`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El pago fue registrado con éxito.')
                const { history } = this.props
                history.push({ pathname: '/mercadotecnia/pagos' });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    editPagoAxios = async () => {
        const { access_token } = this.props.authUser
        const { form, pago } = this.state
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
            form.adjuntos[element].files.map((file) => {
                if(file.id === undefined){
                    data.append(`files_name_${element}[]`, file.name)
                    data.append(`files_${element}[]`, file.file)
                }
                return ''
            })
            data.append('adjuntos[]', element)
            return false
        })
        await axios.post(`${URL_DEV}mercadotecnia/pagos/update/${pago.id}`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El pago fue editado con éxito.')
                const { history } = this.props
                history.push({ pathname: '/mercadotecnia/pagos' });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
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

    deleteAdjuntoAxios = async(id) => {
        const { pago } = this.state
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}mercadotecnia/pagos/${pago.id}/adjunto/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { pago } = response.data
                const { form } = this.state
                const { history } = this.props
                if(pago.presupuestos)
                    form.adjuntos.presupuesto.files = pago.presupuestos
                if(pago.pagos)
                    form.adjuntos.pago.files = pago.pagos
                this.setState({...this.state, form})
                history.push({
                    pathname: '/mercadotecnia/pagos/edit',
                    state: { pago: pago }
                });
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

    handleChange = (files, item) => {
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
        this.setState({
            ...this.state,
            form
        })
    }

    deleteFile = element => {
        deleteAlert('DESEAS ELIMINAR EL ARCHIVO', element.name, () => this.deleteAdjuntoAxios(element.id))
    }

    render() {
        const { form, title, options, formeditado, data } = this.state
        return (
            <Layout active={'mercadotecnia'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <PagosFormulario className = "px-3" formeditado = { formeditado } title = { title } form = { form } 
                            onChange = { this.onChange } onChangeFactura = { this.onChangeFactura } clearFiles = { this.clearFiles }
                            options = { options } setOptions = { this.setOptions } onSubmit = { this.onSubmit } data = { data }
                            handleChange = { this.handleChange } deleteFile = { this.deleteFile } />
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

export default connect(mapStateToProps, mapDispatchToProps)(PagosForm);