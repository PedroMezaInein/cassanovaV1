import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV, SOLICITUD_VENTA_COLUMNS } from '../../../constants'
import { setOptions, setSelectOptions, setDateTableReactDom, setMoneyTableReactDom, setTextTableReactDom, setTextTable } from '../../../functions/setters'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert, customInputAlert, deleteAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { Button, CalendarDaySwal, SelectSearchGray, InputGray, InputNumberGray, DoubleSelectSearchGray } from '../../../components/form-components'
import { Modal, ModalDelete, ItemSlider } from '../../../components/singles'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { FacturaForm } from '../../../components/forms'
import { SolicitudVentaCard } from '../../../components/cards'
import { Update } from '../../../components/Lottie'
import { printSwalHeader } from '../../../functions/printers'
import { Form } from 'react-bootstrap'
import { replaceMoney } from '../../../functions/functions'
import $ from "jquery";
class SolicitudVenta extends Component {
    state = {
        modal: false,
        modalDelete: false,
        modalSingle: false,
        modalAskFactura: false,
        modalAdjuntos: false,
        title: 'Nueva solicitud de compra',
        solicitud: '',
        solicitudes: [],
        data: {
            solicitudes: [],
            clientes: []
        },
        formeditado: 0,
        options: {
            proveedores: [],
            proyectos: [],
            empresas: [],
            areas: [],
            subareas: [],
            tiposPagos: [],
            clientes: [],
            estatusFacturas: [],
            metodosPago: [],
            formasPago: [],
            facturas: [
                { text: "Si", value: "Con factura", label: "Si" },
                { text: "No", value: "Sin factura", label: "No" },
            ],
        },
        form: {
            cliente: '',
            rfc: '',
            formaPago: '',
            metodoPago: '',
            estatusFactura: '',
            concepto: '',
            email: '',
            proyecto: '',
            area: '',
            subarea: '',
            empresa: '',
            descripcion: '',
            total: '',
            remision: '',
            fecha: new Date(),
            tipoPago: 0,
            factura: 'Sin factura',
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
            }
        }
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const solicitud = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!solicitud)
            history.push('/')
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                this.setState({
                    ...this.state,
                    modalSingle: true
                })
                this.getSolicitudVentaAxios(id)
            }
        }
        this.getOptionsAxios()
    }
    openModalDelete = (solicitud) => {
        this.setState({
            ...this.state,
            modalDelete: true,
            title: 'Eliminar solicitud de venta',
            form: this.clearForm(),
            solicitud: solicitud
        })
    }
    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ...this.state,
            modalDelete: !modalDelete,
            form: this.clearForm(),
            solicitud: ''
        })
    }
    openModalAskFactura = solicitud => {
        const { form } = this.state
        form.empresa = solicitud.empresa.id.toString()
        this.setState({
            ...this.state,
            modalAskFactura: true,
            solicitud: solicitud,
            form,
            formeditado: 1,
        })
    }
    handleCloseAskFactura = () => {
        this.setState({
            ...this.state,
            modalAskFactura: false,
            solicitud: '',
            form: this.clearForm()
        })
    }
    openModalSingle = (solicitud) => {
        this.setState({
            ...this.state,
            modalSingle: true,
            solicitud: solicitud
        })
    }
    handleCloseSingle = () => {
        const { modalSingle } = this.state
        this.setState({
            ...this.state,
            modalSingle: !modalSingle,
            solicitud: ''
        })
    }
    openModalAdjuntos = solicitud => {
        const { form } = this.state
        let aux = []
        aux.push({
            name: solicitud.adjunto.name,
            url: solicitud.adjunto.url,
            id: solicitud.adjunto.id
        })
        form.adjuntos.adjunto.files = aux
        this.setState({
            ...this.state,
            solicitud: solicitud,
            modalAdjuntos: true,
            form
        })
    }
    handleCloseAdjuntos = () => {
        const { form } = this.state
        form.adjuntos.adjunto.files = []
        this.setState({
            ...this.state,
            modalAdjuntos: false,
            solicitud: '',
            form
        })
    }
    setSolicitudes = solicitudes => {
        let aux = []
        solicitudes.forEach((solicitud) => {
            aux.push(
                {
                    actions: this.setActions(solicitud),
                    proyecto: setTextTableReactDom(solicitud.proyecto ? solicitud.proyecto.nombre : '', this.doubleClick, solicitud, 'proyecto', 'text-center'),
                    empresa: setTextTableReactDom(solicitud.empresa ? solicitud.empresa.name : 'Sin definir', this.doubleClick, solicitud, 'empresa', 'text-center'),
                    factura: setTextTableReactDom(solicitud.factura ? 'Con factura' : 'Sin factura', this.doubleClick, solicitud, 'factura', 'text-center'),
                    monto: setMoneyTableReactDom(solicitud.monto, this.doubleClick, solicitud, 'monto'),
                    tipoPago: setTextTableReactDom(solicitud.tipo_pago.tipo, this.doubleClick, solicitud, 'tipoPago', 'text-center'),
                    descripcion: setTextTableReactDom(solicitud.descripcion !== null ? solicitud.descripcion :'', this.doubleClick, solicitud, 'descripcion', 'text-justify'),
                    area: solicitud.subarea ? solicitud.subarea.area ? setTextTableReactDom(solicitud.subarea.area.nombre, this.doubleClick, solicitud, 'area', 'text-center') : '' : '',
                    subarea: solicitud.subarea ? setTextTableReactDom(solicitud.subarea.nombre, this.doubleClick, solicitud, 'subarea', 'text-center') : '',
                    fecha: setDateTableReactDom(solicitud.created_at, this.doubleClick, solicitud, 'fecha', 'text-center'),
                    tipo: this.labelIcon(solicitud),
                    id: solicitud.id
                }
            )
        })
        return aux
    }

    labelIcon(solicitud){
        let text = solicitud.hasTicket ? 'ticket' : 'obra'
        return(
            <div className='d-flex align-items-center justify-content-center' >
                <i style={{ color: `${text === 'ticket' ? "#9E9D24" : "#EF6C00"}` }} className={`las ${text === 'ticket' ? 'la-ticket-alt' : 'la-hard-hat'} icon-xl mr-2`} />
                {
                    solicitud.adjunto?
                        <a href={solicitud.adjunto? solicitud.adjunto.url:''} target='_blank' rel="noreferrer" className="text-dark-75 text-hover-success font-weight-bolder"><u>{setTextTable(text)}</u></a>
                    :
                    setTextTable(text)
                }
            </div>
        )
    }

    doubleClick = (data, tipo) => {
        const { form, options } = this.state
        switch(tipo){
            case 'proyecto':
            case 'empresa':
            case 'subarea':
                if(data[tipo])
                    form[tipo] = data[tipo].id.toString()
                break
            case 'area':
                if(data.subarea){
                    if(data.subarea.area){
                        form.area = data.subarea.area.id.toString()
                        form.subarea = data.subarea.id.toString()
                        options.subareas = setOptions(data.subarea.area.subareas, 'nombre', 'id')
                    }
                }
                break
            case 'fecha':
                form.fecha = new Date(data.created_at)
                break
            case 'tipoPago':
                form[tipo] = data.tipo_pago.id
                break
            case 'factura':
                if (data.factura)
                    form.factura = 'Con factura'
                else
                    form.factura = 'Sin factura'
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
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }  />
                }
                {
                    tipo === 'monto' &&
                        <InputNumberGray withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } prefix = '$' thousandSeparator = { true }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } />
                }
                {
                    (tipo === 'tipoPago') || (tipo === 'factura') ?
                        <div className="input-icon my-3">
                            <span className="input-icon input-icon-right">
                                <span>
                                    <i className={"flaticon2-search-1 icon-md text-dark-50"}></i>
                                </span>
                            </span>
                            <Form.Control className = "form-control text-uppercase form-control-solid"
                                onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } name = { tipo }
                                defaultValue = { form[tipo] } as = "select">
                                <option disabled value={0}>{this.setSwalPlaceholder(tipo)}</option>
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
                    (tipo === 'proyecto') || (tipo === 'empresa') || (tipo === 'subarea') ?
                        <SelectSearchGray options = { this.setOptions(data, tipo) }
                        onChange = { (value) => { this.onChangeSwal(value, tipo)} } name = { tipo }
                        value = { form[tipo] } customdiv="mb-2 mt-7" requirevalidation={1} 
                        placeholder={this.setSwalPlaceholder(tipo)} withicon={1}/>
                    :<></>
                }
                {
                    tipo === 'area' &&
                        <DoubleSelectSearchGray options = { options } form = { form } onChange = { this.onChangeSwal } 
                            one = { { placeholder: 'SELECCIONA EL ÁREA', name: 'area', opciones: 'areas'} } 
                            two = { { placeholder: 'SELECCIONA EL SUBÁREA', name: 'subarea', opciones: 'subareas'} }/>
                }
            </div>,
            <Update />,
            () => { this.patchSolicitudCompra(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    setSwalPlaceholder = (tipo) => {
        switch(tipo){
            case 'proyecto':
                return 'SELECCIONA EL PROYECTO'
            case 'empresa':
                return 'SELECCIONA LA EMPRESA'
            case 'tipoPago':
                return 'SELECCIONA EL TIPO DE PAGO'
            case 'subarea':
                return 'SELECCIONA EL SUBÁREA'
            case 'factura':
                return '¿LLEVA FACTURA?'
            default:
                return ''
        }
    }
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    patchSolicitudCompra = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = ''
        switch(tipo){
            case 'monto':
                value = replaceMoney(form.monto)
                break;
            case 'area':
                value = {area: form.area, subarea: form.subarea}
                break;
            default:
                value = form[tipo]
                break;
        }
        waitAlert()
        await axios.put(`${URL_DEV}v2/proyectos/solicitud-venta/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getSolicitudAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'La solicitud de venta fue editada con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    setOptions = (data, tipo) => {
        const { options } = this.state
        switch(tipo){
            case 'tipoPago':
                return options.tiposPagos
            case 'empresa':
                return options.empresas
            case 'proyecto':
                return options.proyectos
            case 'subarea':
                if(data.subarea)
                    if(data.subarea.area)
                        if(data.subarea.area.subareas)
                            return setOptions(data.subarea.area.subareas, 'nombre', 'id')
                        return []
            case 'factura':
                return options.facturas
            default: return []
        }
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'tipoPago':
                    form[element] = 0
                    break;
                case 'fecha':
                    form[element] = new Date()
                    break;
                case 'adjuntos':
                    form[element] = {
                        adjunto: {
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
    setActions = () => {
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
                text: 'Convertir',
                btnclass: 'primary',
                iconclass: 'flaticon2-refresh',
                action: 'convert',
                tooltip: { id: 'convert', text: 'Convertir', type: 'success' },
            },
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'success' },
            },
            {
                text: 'Pedir&nbsp;factura',
                btnclass: 'info',
                iconclass: 'flaticon-file-1',
                action: 'bills',
                tooltip: { id: 'bills', text: 'Pedir factura' }
            },
            {
                text: 'Adjuntos',
                btnclass: 'info',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            }
        )
        return aux
    }
    changePageConvert = solicitud => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/ventas/convert',
            state: { solicitud: solicitud },
            formeditado: 1
        });
    }
    changePageEdit = solicitud => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/solicitud-venta/edit',
            state: { solicitud: solicitud },
            formeditado: 1
        });
    }
    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'solicitud-venta/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas, areas, tiposPagos, proyectos, clientes, metodosPago, formasPago, estatusFacturas } = response.data
                const { options, data } = this.state
                // data.solicitudes = solicitudes
                data.clientes = clientes
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
                options['clientes'] = setOptions(clientes, 'empresa', 'id')
                options['metodosPago'] = setOptions(metodosPago, 'nombre', 'id')
                options['formasPago'] = setOptions(formasPago, 'nombre', 'id')
                options['estatusFacturas'] = setOptions(estatusFacturas, 'estatus', 'id')
                this.setState({
                    ...this.state,
                    options,
                    // solicitudes: this.setSolicitudes(solicitudes),
                    data
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async getSolicitudAxios() {
        $('#kt_datatable_solicitud').DataTable().ajax.reload();
    }
    async getSolicitudVentaAxios(id) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'solicitud-venta/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { solicitud } = response.data
                data.solicitud = solicitud
                this.setState({
                    ...this.state,
                    solicitud: solicitud,
                    data
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async deleteSolicitudAxios() {
        const { access_token } = this.props.authUser
        const { solicitud } = this.state
        await axios.delete(URL_DEV + 'solicitud-venta/' + solicitud.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { solicitudes } = response.data
                const { data } = this.state
                data.solicitudes = solicitudes
                this.getSolicitudAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'La solicitud fue registrado con éxito.')
                this.setState({
                    ...this.state,
                    modalDelete: false,
                    data,
                    title: 'Nueva solicitud de compra',
                    solicitud: '',
                    solicitudes: this.setSolicitudes(solicitudes)
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fecha':
                    form[element] = new Date()
                    break;
                case 'tipoPago':
                    form[element] = 0
                    break;
                case 'factura':
                    form[element] = 'Sin factura'
                    break;
                case 'adjuntos':
                    form['adjuntos'].adjunto.value = ''
                    form['adjuntos'].adjunto.files = []
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form
    }
    onChange = e => {
        const { form, data } = this.state
        const { name, value } = e.target
        form[name] = value
        if (name === 'cliente') {
            data.clientes.map((cliente) => {
                if (value === cliente.id.toString()) {
                    form.rfc = cliente.rfc
                }
                return false
            })
        }
        this.setState({
            ...this.state,
            form
        })
    }
    onSubmitAskFactura = e => {
        e.preventDefault()
        waitAlert()
        this.askFacturaAxios()
    }
    async askFacturaAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'facturas/ask', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    modalAskFactura: false
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    handleChange = (files, item) => {
        const { form } = this.state
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
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    deleteFile = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', '', () => this.deleteAdjuntoAxios(element.id))
    }
    async deleteAdjuntoAxios(id) {
        waitAlert()
        const { access_token } = this.props.authUser
        const { solicitud } = this.state
        await axios.delete(URL_DEV + 'solicitud/' + solicitud.id + '/adjuntos/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { solicitud } = response.data
                const { form } = this.state
                let aux = []
                solicitud.adjuntos.map((adj) => {
                    aux.push({
                        name: adj.name,
                        url: adj.url,
                        id: adj.id
                    })
                    return false
                })
                form.adjuntos.adjunto.files = aux
                this.setState({
                    ...this.state,
                    modalDelete: false,
                    solicitud: '',
                    form
                })
                doneAlert('Adjunto eliminado con éxito')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async sendAdjuntoAxios() {
        waitAlert()
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
        await axios.post(URL_DEV + 'solicitud/' + solicitud.id + '/adjuntos', data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { solicitud } = response.data
                const { form } = this.state
                let aux = []
                solicitud.adjunto.map((adj) => {
                    aux.push({
                        name: adj.name,
                        url: adj.url,
                        id: adj.id
                    })
                    return false
                })
                form.adjuntos.adjunto.files = aux
                this.setState({
                    ...this.state,
                    modalDelete: false,
                    solicitud: '',
                    form
                })
                doneAlert('Adjunto creado con éxito')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    render() {
        const { data, modalDelete, form, options, solicitud, modalSingle, formeditado, modalAskFactura, modalAdjuntos } = this.state
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <NewTableServerRender
                    columns={SOLICITUD_VENTA_COLUMNS}
                    title='Solicitudes de venta'
                    subtitle='Listado de solicitudes de venta'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url='/proyectos/solicitud-venta/add'
                    mostrar_acciones={true}
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete },
                        'convert': { function: this.changePageConvert },
                        'see': { function: this.openModalSingle },
                        'bills': { function: this.openModalAskFactura },
                        'adjuntos': { function: this.openModalAdjuntos }
                    }}
                    idTable='kt_datatable_solicitud'
                    accessToken={this.props.authUser.access_token}
                    setter={this.setSolicitudes}
                    urlRender={URL_DEV + 'solicitud-venta'}
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />
                <ModalDelete title={"¿Deseas eliminar la solicitud de venta?"} show={modalDelete} handleClose={this.handleCloseDelete} onClick={(e) => { e.preventDefault(); this.deleteSolicitudAxios() }}>
                </ModalDelete>
                <Modal size="xl" title="Solicitud de venta" show={modalSingle} handleClose={this.handleCloseSingle} >
                    <SolicitudVentaCard data={solicitud}>
                        {
                            solicitud.convertido ? '' :
                                <Button icon={faSync} pulse={"pulse-ring"} className={"btn btn-icon btn-light-primary pulse pulse-primary"} onClick={(e) => { e.preventDefault(); this.changePageConvert(solicitud) }}
                                    tooltip={{ text: 'COMPRAR' }} />
                        }
                    </SolicitudVentaCard>
                </Modal>
                <Modal size="xl" title={"Solicitud de factura"} show={modalAskFactura} handleClose={this.handleCloseAskFactura}>
                    <FacturaForm
                        options={options}
                        onChange={this.onChange}
                        form={form}
                        onSubmit={this.onSubmitAskFactura}
                        formeditado={formeditado}
                        data={data}
                    />
                </Modal>
                <Modal size="lg" title="Adjuntos" show={modalAdjuntos} handleClose={this.handleCloseAdjuntos} >
                    <div className="mt-6">
                        <ItemSlider
                            items={form.adjuntos.adjunto.files}
                            item='adjunto'
                            handleChange={this.handleChange}
                            deleteFile={this.deleteFile}
                        />
                    </div>
                    
                    {
                        form.adjuntos.adjunto.value ?
                            <div className="card-footer py-3 pr-1">
                                <div className="row mx-0">
                                    <div className="col-lg-12 text-right pr-0 pb-0">
                                        <Button icon='' text='ENVIAR'
                                            onClick={(e) => { e.preventDefault(); this.sendAdjuntoAxios() }} />
                                    </div>
                                </div>
                            </div>
                            : ''
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(SolicitudVenta);