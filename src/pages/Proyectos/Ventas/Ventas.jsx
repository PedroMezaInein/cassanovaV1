import React, { Component } from 'react'
import $ from 'jquery'
import S3 from 'react-aws-s3'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { Tab, Tabs } from 'react-bootstrap'
import { Update } from '../../../components/Lottie'
import { Modal } from '../../../components/singles'
import { VentasCard } from '../../../components/cards'
import Layout from '../../../components/layout/layout'
import { NewTable } from '../../../components/NewTables'
import { VentasFilters } from '../../../components/filters'
import { URL_DEV, VENTAS_COLUMNS } from '../../../constants'
import { printSwalHeader } from '../../../functions/printers'
import { FacturasFormTable } from '../../../components/tables'
import { Dropdown, DropdownButton, Form } from 'react-bootstrap'
import { AdjuntosForm, FacturaExtranjera } from '../../../components/forms'
import { InputGray, CalendarDaySwal, SelectSearchGray, DoubleSelectSearchGray } from '../../../components/form-components'
import { apiOptions, apiGet, apiDelete, apiPutForm, catchErrors, apiPostFormResponseBlob } from '../../../functions/api'
import { waitAlert, printResponseErrorAlert, deleteAlert, doneAlert, createAlertSA2WithActionOnClose, customInputAlert, errorAlert } from '../../../functions/alert'
import { setOptions, setSelectOptions, setDateTableReactDom, setMoneyTable, setArrayTable, setTextTableCenter, setTextTableReactDom, 
    setCustomeDescripcionReactDom, setNaviIcon, setOptionsWithLabel } from '../../../functions/setters'
class Ventas extends Component {
    state = {
        modal:{
            filters: false,
            facturas: false,
            adjuntos: false,
            facturaExtranjera: false,
            see: false
        },
        solicitud: '',
        title: 'Nueva venta',
        ventas: [],
        adjuntos: [],
        venta: '',
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
        data: {
            clientes: [],
            empresas: [],
            cuentas: [],
            proyectos: [],
            ventas: [],
            adjuntos: []
        },
        formeditado: 0,
        form: {
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
            tickets: '',
            tipoPago: 0,
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
                },
                facturas_pdf: {
                    value: '',
                    placeholder: 'Facturas extranjeras',
                    files: []
                }
            }
        },
        key: 'all',
        filters: {},
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const ventas = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!ventas)
            history.push('/')
        this.getOptionsAxios()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                const { modal, filters } = this.state
                filters.identificador = id
                modal.see = true
                this.setState({ ...this.state, modal, filters })
                this.reloadTable(filters)
                this.getVentaAxios(id)
            }
        }
    }
    getOptionsAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiOptions(`v2/proyectos/ventas`, access_token).then(
            (response) => {
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras,
                    clientes, metodosPago, formasPago, estatusFacturas, proyectos } = response.data
                const { options, data } = this.state
                options['empresas'] = setOptionsWithLabel(empresas, 'name', 'id')
                options['areas'] = setOptionsWithLabel(areas, 'nombre', 'id')
                options['clientes'] = setOptionsWithLabel(clientes, 'empresa', 'id')
                options['metodosPago'] = setOptionsWithLabel(metodosPago, 'nombre', 'id')
                options['formasPago'] = setOptionsWithLabel(formasPago, 'nombre', 'id')
                options['estatusFacturas'] = setOptionsWithLabel(estatusFacturas, 'estatus', 'id')
                options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
                options['tiposImpuestos'] = setSelectOptions(tiposImpuestos, 'tipo')
                options['estatusCompras'] = setSelectOptions(estatusCompras, 'estatus')
                options['proyectos'] = setOptionsWithLabel(proyectos, 'nombre', 'id')
                data.clientes = clientes
                data.empresas = empresas
                Swal.close()
                this.setState({
                    ...this.state,
                    options,
                    data
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    getVentaAxios = async (id) => {
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/ventas/${id}`, access_token).then(
            (response) => {
                const { venta } = response.data
                this.setState({ ...this.state, venta: venta })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
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
                        },
                        facturas_pdf: {
                            value: '',
                            placeholder: 'Facturas extranjeras',
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
            () => this.attachFiles(files, item),
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
    setVentas = ventas => {
        const { data } = this.state
        let _aux = []
        data.ventas = ventas
        this.setState({
            data
        })
        let aux = []
        ventas.forEach((venta) => {
            _aux = []
            if (venta.presupuestos) {
                venta.presupuestos.forEach((presupuesto) => {
                    _aux.push({ name: 'Presupuesto', text: presupuesto.name, url: presupuesto.url })
                })
            }
            if (venta.pagos) {
                venta.pagos.forEach((pago) => {
                    _aux.push({ name: 'Pago', text: pago.name, url: pago.url })
                })
            }
            aux.push(
                {
                    actions: this.setActions(venta),
                    identificador: setTextTableCenter(venta.id),
                    cuenta: setArrayTable(
                            [
                                { name: 'Empresa', text: venta.empresa ? venta.empresa.name : '' },
                                { name: 'Cuenta', text: venta.cuenta ? venta.cuenta.nombre : '' },
                                { name: '# de cuenta', text: venta.cuenta ? venta.cuenta.numero : '' }
                            ],'235px'
                        ),
                    proyecto: setTextTableReactDom(venta.proyecto ? venta.proyecto.nombre : '', this.doubleClick, venta, 'proyecto', 'text-center'),
                    cliente: setTextTableCenter(venta.cliente ? venta.cliente.empresa : ''),
                    factura: setTextTableCenter(venta.factura ? 'Con factura' : 'Sin factura'),
                    monto: setMoneyTable(venta.monto),
                    impuesto: setTextTableReactDom(
                            venta.tipo_impuesto ? venta.tipo_impuesto.tipo : 'Sin definir', this.doubleClick, venta, 'tipoImpuesto', 'text-center'
                        ),
                    tipoPago: setTextTableReactDom(venta.tipo_pago.tipo, this.doubleClick, venta, 'tipoPago', 'text-center'),
                    descripcion: setCustomeDescripcionReactDom(
                            venta.descripcion !== null ? venta.descripcion :'', this.doubleClick, venta, 'descripcion', 'text-justify'
                        ),
                    area: setTextTableReactDom(venta.area ? venta.area.nombre : '' , this.doubleClick, venta, 'area', 'text-center'),
                    subarea: setTextTableReactDom(venta.subarea ? venta.subarea.nombre : '', this.doubleClick, venta, 'subarea', 'text-center'),
                    estatusCompra: setTextTableReactDom(
                            venta.estatus_compra ? venta.estatus_compra.estatus : '', this.doubleClick, venta, 'estatusCompra', 'text-center'
                        ),
                    total: setMoneyTable(venta.total),
                    fecha: setDateTableReactDom(venta.created_at, this.doubleClick, venta, 'fecha', 'text-center'),
                    tipo: this.labelIcon(venta),
                    id: venta.id,
                    objeto: venta
                }
            )
        })
        return aux
    }
    labelIcon(venta){
        if(venta.hasTicket)
            return(
                <a href = {`/calidad/tickets?id=${venta.ticketId}`}>
                    <div className='d-flex align-items-center justify-content-center text-dark-75 white-space-nowrap'>
                        <i style={{ color: "#9E9D24" }} className={`las la-ticket-alt icon-xl mr-2`} />
                        <u><span className="text-hover-ticket font-size-11px font-weight-bolder">{`ticket - ${venta.ticketIdentificador}`}</span></u>
                    </div>
                </a>
            )
        return(
            <div className='d-flex align-items-center justify-content-center text-dark-75 white-space-nowrap'>
                <i style={{ color: "#EF6C00" }} className={`las la-hard-hat icon-xl mr-2`} />
                <span className="font-size-11px">{`obra`}</span>
            </div>
        )
    }
    setActions = venta => {
        const { history } = this.props
        return(
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title = { <i className="fas fa-chevron-circle-down icon-md p-0"/> } id = 'dropdown-button-newtable' >
                    <Dropdown.Item className="text-hover-success dropdown-success" 
                        onClick = { (e) => { 
                                e.preventDefault(); 
                                history.push({ pathname: '/proyectos/ventas/edit', state: { venta: venta }, formeditado: 1 }) 
                            } } >
                        { setNaviIcon('flaticon2-pen', 'editar') }
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-danger dropdown-danger" 
                        onClick = { (e) => { 
                                e.preventDefault(); 
                                deleteAlert(`¿Deseas continuar?`, `Eliminarás la venta ${venta.id}`, () => { this.deleteVentaAxios(venta.id) })
                            } } >
                        { setNaviIcon('flaticon2-rubbish-bin', 'eliminar') }
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-primary dropdown-primary" 
                        onClick = { (e) => { 
                                e.preventDefault(); 
                                this.openModalSee(venta)
                            } } >
                        { setNaviIcon('flaticon2-magnifier-tool', 'Mostrar') }
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-info dropdown-info" 
                        onClick = { (e) => { 
                                e.preventDefault(); 
                                this.openModalAdjuntos(venta)
                            } } >
                        { setNaviIcon('flaticon-attachment', 'Adjuntos') }
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-warning dropdown-warning" 
                        onClick = { (e) => { 
                                e.preventDefault(); 
                                this.openFacturaExtranjera(venta)
                            } } >
                        { setNaviIcon('flaticon2-paper', 'Factura extranjera') }
                    </Dropdown.Item>
                    {
                        venta.factura ?
                            <Dropdown.Item className="text-hover-dark dropdown-dark" 
                                onClick = { (e) => { 
                                        e.preventDefault(); 
                                        this.openModalFacturas(venta)
                                    } } >
                                { setNaviIcon('flaticon2-paper', 'Facturas') }
                            </Dropdown.Item>
                        : <></>
                    }
                </DropdownButton>
            </div>
        )
    }
    openModalSee = async (venta) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/ventas/${venta.id}`, access_token).then(
            (response) => {
                const { venta } = response.data
                const { modal } = this.state
                modal.see = true
                Swal.close()
                this.setState({ ...this.state, modal, venta })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openModalAdjuntos = async (venta) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/ventas/adjuntos/${venta.id}`, access_token).then(
            (response) => {
                const { form, modal } = this.state
                const { venta } = response.data
                form.adjuntos.presupuesto.files = venta.presupuestos
                form.adjuntos.pago.files = venta.pagos
                form.adjuntos.facturas_pdf.files = venta.facturas_pdf
                modal.adjuntos = true
                Swal.close()
                this.setState({ ...this.state, form, venta })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openFacturaExtranjera = async (venta) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/ventas/adjuntos/${venta.id}`, access_token).then(
            (response) => {
                const { form, modal } = this.state
                const { venta } = response.data
                form.adjuntos.facturas_pdf.files = venta.facturas_pdf
                modal.facturaExtranjera = true
                Swal.close()
                this.setState({ ...this.state, form, modal, venta })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openModalFacturas = (venta) => {
        const { modal } = this.state
        modal.facturas = true
        this.setState({ ...this.state, modal, venta:venta })
    }
    openModalFiltros = () => {
        const { modal } = this.state
        modal.filters = true
        this.setState({ ...this.state, modal })
    }
    openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿SEGURO DESEAS BORRAR EL ADJUNTO?', adjunto.name, () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) })
    }
    handleClose = () => {
        const { modal, data } = this.state
        modal.filters = false
        modal.adjuntos = false
        modal.facturaExtranjera = false
        modal.see = false
        modal.facturas = false
        data.adjuntos = []
        this.setState({
            ...this.state,
            modal,
            data,
            venta: '',
            form: this.clearForm(),
            adjuntos: [],
        })
    }
    reloadTableFacturas = () => {
        const { filters } = this.state
        this.reloadTable(filters)
    }
    async deleteVentaAxios(id) {
        const { access_token } = this.props.authUser
        apiDelete(`ventas/${id}`, access_token).then(
            (response) => {
                this.setState({ ...this.state, form: this.clearForm() })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue eliminado con éxito.', 
                    () => { this.getVentasAxios() } )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    exportVentasAxios = async() => {
        waitAlert()
        const { filters } = this.state
        const { access_token } = this.props.authUser
        apiPostFormResponseBlob(`v3/proyectos/ventas/exportar`, { columnas: filters }, access_token).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'ventas.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(
                    response.data.message !== undefined ? 
                        response.data.message 
                    : 'Ventas fueron exportados con éxito.'
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })    
    }

    attachFiles = async(files, item) => {
        waitAlert()
        const { venta } = this.state
        const { access_token } = this.props.authUser
        apiGet(`v1/constant/admin-proyectos`, access_token).then(
            (response) => {
                const { alma } = response.data
                let filePath = `ventas/${venta.id}/`
                let aux = ''
                switch(item){
                    case 'presupuesto':
                    case 'pago':
                        aux = files.map( ( file ) => {
                            return {
                                name: `${filePath}${item}s/${Math.floor(Date.now() / 1000)}-${file.name}`,
                                file: file,
                                tipo: item
                            }
                        })
                        break;
                    case 'facturas_pdf':
                        aux = files.map( ( file ) => {
                            return {
                                name: `${filePath}facturas-extranjeras/${Math.floor(Date.now() / 1000)}-${file.name}`,
                                file: file,
                                tipo: 'factura-extranjera'
                            }
                        })
                        break;
                    default: break;
                }
                let auxPromises  = aux.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file.file, file.name)
                            .then((data) =>{
                                const { location,status } = data
                                if(status === 204) resolve({ name: file.name, url: location, tipo: file.tipo })
                                else reject(data)
                            })
                            .catch((error) => {
                                catchErrors(error)
                                errorAlert(`Ocurrió un error al subir el archivo ${file.name}`)
                                reject(error)
                            })
                    })
                })
                Promise.all(auxPromises).then(values => { this.attachFilesS3(values, item)}).catch(err => console.error(err)) 
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    attachFilesS3 = async(files, item) => {
        const { venta, filters } = this.state
        const { access_token } = this.props.authUser
        apiPutForm( `v2/proyectos/ventas/${venta.id}/archivos/s3`, { archivos: files }, access_token ).then(
            ( response ) => {
                doneAlert(`Archivos adjuntados con éxito`, 
                    () => { 
                        switch(item){
                            case 'presupuesto':
                            case 'pago':
                                this.openModalAdjuntos(venta)         
                                break;
                            case 'facturas_pdf':
                                this.openFacturaExtranjera(venta) 
                                this.reloadTable(filters)
                                break;
                            default: break;
                        }
                        
                    }
                )
            }, ( error ) => { printResponseErrorAlert( error ) }
        ).catch( ( error ) => { catchErrors( error ) } )
    }
    deleteAdjuntoAxios = async (id) => {
        const { access_token } = this.props.authUser
        const { venta } = this.state
        apiDelete(`v2/proyectos/ventas/${venta.id}/adjuntos/${id}`, access_token).then(
            (response) => {
                const { venta } = response.data
                const { form } = this.state
                form.adjuntos.presupuesto.files = venta.presupuestos
                form.adjuntos.pago.files = venta.pagos
                form.adjuntos.facturas_pdf.files = venta.facturas_pdf
                this.setState({ ...this.state, form })
                this.getVentasAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste el adjunto con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    doubleClick = (data, tipo) => {
        const { form, options } = this.state
        let busqueda = undefined
        let flag = false
        switch(tipo){
            case 'proyecto':
                if(data[tipo])
                    form[tipo] = data[tipo].id.toString()
                break
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
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } letterCase = { false } />
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
                        <CalendarDaySwal value = { form[tipo] } onChange = { (e) => {  this.onChangeSwal(e.target.value, tipo)} } name = { tipo } 
                            date = { form[tipo] } withformgroup={0} />
                    :<></>
                }
                {
                    tipo === 'proyecto' ?
                        <SelectSearchGray options = { this.setOptions(data, tipo) }
                        onChange = { (value) => { this.onChangeSwal(value, tipo)} } name = { tipo }
                        value = { form[tipo] } customdiv="mb-2 mt-7" requirevalidation={1} 
                        placeholder={this.setSwalPlaceholder(tipo)} withicon={1}/>
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
            () => { this.patchVentas(data, tipo, flag) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    setSwalPlaceholder = (tipo) => {
        switch(tipo){
            case 'proyecto':
                return 'SELECCIONA EL PROYECTO'
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
    patchVentas = async (data, tipo, flag) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = ''
        let newType = tipo
        switch (tipo) {
            case 'area':
                value = { area: form.area, subarea: form.subarea }
                break
            case 'subarea':
                if (flag === true) {
                    value = { area: form.area, subarea: form.subarea }
                    newType = 'area'
                } else { value = form[tipo] }
                break
            default:
                value = form[tipo]
                break
        }
        waitAlert()
        apiPutForm(`v2/proyectos/ventas/${newType}/${data.id}`, { value: value }, access_token).then(
            (response) => {
                this.getVentasAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'La venta fue editada con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
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
            case 'proyecto':
                return options.proyectos
            case 'subarea':
                if(data.subarea)
                    if(data.subarea.area)
                        if(data.subarea.area.subareas)
                            return setOptions(data.subarea.area.subareas, 'nombre', 'id')
                return []
            default: return []
        }
    }
    getVentasAxios = tab => {
        $(`#ventas_${tab}`).DataTable().search(JSON.stringify({})).draw();
        this.setState({...this.state, key: tab, filters: {}})
    }
    setTabla = (key, tab) => {
        if( key === tab ){
            return(
                <NewTable
                    tableName = { `ventas_${key}` } subtitle = 'Listado de ventas' title = {`VENTAS - ${this.setName(tab)}`} mostrar_boton = { true }
                    abrir_modal = { false } url = '/proyectos/ventas/add' columns = { VENTAS_COLUMNS }
                    accessToken = { this.props.authUser.access_token } setter = { this.setVentas }
                    filterClick = { this.openModalFiltros } exportar_boton = { true } onClickExport = { () => { this.exportVentasAxios() } }
                    urlRender = { `${URL_DEV}v3/proyectos/venta?tab=${key}` } type = { 'tab' }
                />
            )
        }
    }
    setName = tab => {
        switch(tab){
            case 'all':
                return 'Fases';
            case 'fase1':
                return 'Fase 1'
            case 'fase2':
                return 'Fase 2'
            case 'fase3':
                return 'Fase 3'
            default: return '';
        }
    }
    setOptionsArray = (name, array) => {
        const { options } = this.state
        options[name] = setOptionsWithLabel(array, 'nombre', 'id')
        this.setState({ ...this.state, options })
    }
    sendFilters = filter => {
        const { modal } = this.state
        modal.filters = false
        this.setState({
            ...this.state,
            filters: filter,
            modal
        })
        this.reloadTable(filter)
    }
    reloadTable = (filter) => {
        const { key } = this.state
        let arregloFilterKeys = Object.keys(filter)
        let aux = {}
        arregloFilterKeys.forEach((elemento) => {
            switch(elemento){
                case 'area':
                case 'cliente':
                case 'cuenta':
                case 'empresa':
                case 'estatusCompra':
                case 'proyecto':
                case 'subarea':
                case 'factura':
                    aux[elemento] = {
                        value: filter[elemento]['value'],
                        name: filter[elemento]['name'],
                    }
                    break;
                default:
                    aux[elemento] = filter[elemento]
                    break;
            }
        })
        $(`#ventas_${key}`).DataTable().search(JSON.stringify(aux)).draw();
    }
    render() {
        const tabs = ['all', 'fase1', 'fase2', 'fase3']
        const { modal, options, form, venta, key, filters } = this.state
        const { access_token } = this.props.authUser
        return (
            <Layout active = 'proyectos'  {...this.props}>
                <Tabs mountOnEnter = { true } unmountOnExit = { true } defaultActiveKey = 'all' activeKey = { key } 
                    onSelect = { (value) => { this.getVentasAxios(value) } } >
                    {
                        tabs.map((tab, index) => {
                            return(
                                <Tab key = { index }  eventKey = { tab }  title = { this.setName(tab) }>
                                    { this.setTabla(key, tab) }
                                </Tab>
                            )
                        })
                    }
                </Tabs>
                <Modal size="xl" title={"Facturas"} show={modal.facturas} handleClose={this.handleClose}>
                    <FacturasFormTable at = { access_token } tipo_factura='ventas' id={venta.id} dato={venta} reloadTable = {this.reloadTableFacturas}/>
                </Modal>
                <Modal size = "xl" title = "Adjuntos" show = { modal.adjuntos } handleClose = { this.handleClose } >
                    <AdjuntosForm form = { form } onChangeAdjunto = { this.handleChange } deleteFile = { this.openModalDeleteAdjuntos } />
                </Modal>
                <Modal size="lg" title="Ventas" show={modal.see} handleClose={this.handleClose} >
                    <VentasCard venta={venta} />
                </Modal>
                <Modal size="lg" title="Factura extranjera" show={modal.facturaExtranjera} handleClose={this.handleClose} >
                    <FacturaExtranjera form={form} onChangeAdjunto = { this.handleChange } deleteFile = { this.openModalDeleteAdjuntos }/>
                </Modal>
                <Modal size = 'xl' show = { modal.filters } handleClose = { this.handleClose } title = 'Filtros'>
                    <VentasFilters at = { access_token } sendFilters = { this.sendFilters } filters = { filters } options={options} 
                        setOptions={this.setOptionsArray}/> 
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })
export default connect(mapStateToProps, mapDispatchToProps)(Ventas);