import React, { Component } from 'react'
import $ from 'jquery'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { Update } from '../../../components/Lottie'
import { Modal } from '../../../components/singles'
import Layout from '../../../components/layout/layout'
import { ComprasCard } from '../../../components/cards'
import { NewTable } from '../../../components/NewTables'
import { ComprasFilters } from '../../../components/filters'
import { URL_DEV, COMPRAS_COLUMNS } from '../../../constants'
import { printSwalHeader } from '../../../functions/printers'
import { FacturasFormTable } from '../../../components/tables'
import { Form, DropdownButton, Dropdown } from 'react-bootstrap'
import { AdjuntosForm, FacturaExtranjera } from '../../../components/forms'
import { apiOptions, apiGet, apiDelete, apiPostFormResponseBlob, catchErrors, apiPutForm } from '../../../functions/api'
import { waitAlert, printResponseErrorAlert, deleteAlert, doneAlert, createAlertSA2WithActionOnClose, customInputAlert,
    errorAlert } from '../../../functions/alert'
import { SelectSearchGray, CalendarDaySwal, InputGray, DoubleSelectSearchGray } from '../../../components/form-components'
import { setOptions, setOptionsWithLabel, setSelectOptions, setTextTable, setMoneyTable, setArrayTable, setTextTableCenter, setTextTableReactDom, 
    setNaviIcon, setCustomeDescripcionReactDom, setDateTableReactDom } from '../../../functions/setters'
import S3 from 'react-aws-s3';
class Compras extends Component {
    state = {
        modal: {
            facturas: false,
            see: false,
            facturaExtranjera: false,
            adjuntos: false,
            filters: false
        },
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
            tipoAdjunto: 'presupuesto',
            tipoImpuesto: 0,
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
                },
            }
        },
        options: {
            empresas: [],
            cuentas: [],
            areas: [],
            subareas: [],
            clientes: [],
            proyectos: [],
            proveedores: [],
            tiposImpuestos: [],
            tiposPagos: [],
            estatusCompras: [],
            formasPago: [],
            metodosPago: [],
            estatusFacturas: [],
            contratos: [],
            allCuentas: []
        },
        data: {
            clientes: [],
            empresas: [],
            cuentas: [],
            proyectos: [],
            proveedores: [],
            compras: [],
            adjuntos: []
        },
        formeditado: 0,
        solicitud: '',
        compras: [],
        compra: '',
        adjuntos: [],
        filters: {},
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const compras = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!compras)
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
                this.getCompraAxios(id)
            }
        }
    }
    getOptionsAxios = async () => {
        const { access_token } = this.props.authUser
        waitAlert()
        apiOptions(`v2/proyectos/compras`, access_token).then(
            (response) => {
                Swal.close()
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras, proyectos,
                    proveedores, formasPago, metodosPago, estatusFacturas, cuentas } = response.data
                const { options, data } = this.state
                options['empresas'] = setOptionsWithLabel(empresas, 'name', 'id')
                options['proveedores'] = setOptionsWithLabel(proveedores, 'razon_social', 'id')
                options['areas'] = setOptionsWithLabel(areas, 'nombre', 'id')
                options['proyectos'] = setOptionsWithLabel(proyectos, 'nombre', 'id')
                options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
                options['tiposImpuestos'] = setSelectOptions(tiposImpuestos, 'tipo')
                options['estatusCompras'] = setSelectOptions(estatusCompras, 'estatus')
                options['estatusFacturas'] = setOptionsWithLabel(estatusFacturas, 'estatus', 'id')
                options['formasPago'] = setOptionsWithLabel(formasPago, 'nombre', 'id')
                options['metodosPago'] = setOptionsWithLabel(metodosPago, 'nombre', 'id')
                options.allCuentas = setOptionsWithLabel(cuentas, 'nombre', 'id')
                data.proveedores = proveedores
                data.empresas = empresas
                this.setState({ ...this.state, options, data })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    getCompraAxios = async (id) => {
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/compras/${id}`, access_token).then(
            (response) => {
                const { compra } = response.data
                this.setState({ ...this.state, compra: compra })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'tipoAdjunto':
                    form[element] = 'presupuesto'
                    break;
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
    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ...this.state,
            form
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
        this.setState({ ...this.state, form })
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
            if (file.id) aux.push(file)
            return ''
        })
        form.adjuntos[item].value = ''
        form.adjuntos[item].files = aux
        this.setState({ ...this.state, form })
    }
    setCompras = compras => {
        let aux = []
        let _aux = []
        compras.map((compra) => {
            _aux = []
            if (compra.presupuestos) {
                compra.presupuestos.map((presupuesto) => {
                    _aux.push({
                        name: 'Presupuesto', text: presupuesto.name, url: presupuesto.url
                    })
                    return false
                })
            }
            if (compra.pagos) {
                compra.pagos.map((pago) => {
                    _aux.push({
                        name: 'Pago', text: pago.name, url: pago.url
                    })
                    return false
                })
            }
            aux.push(
                {
                    actions: this.setActions(compra),
                    identificador: setTextTableCenter(compra.id),
                    cuenta: setArrayTable(
                        [
                            { name: 'Empresa', text: compra.empresa ? compra.empresa.name : '' },
                            { name: 'Cuenta', text: compra.cuenta ? compra.cuenta.nombre : '' },
                            { name: '# de cuenta', text: compra.cuenta ? compra.cuenta.numero : '' }
                        ],'153px'
                    ),
                    proyecto: setTextTableReactDom(compra.proyecto ? compra.proyecto.nombre : '', this.doubleClick, compra, 'proyecto', 'text-center'),
                    proveedor: setTextTableCenter(compra.proveedor ? compra.proveedor.razon_social : ''),
                    factura: setTextTable(compra.factura ? 'Con factura' : 'Sin factura'),
                    monto: setMoneyTable(compra.monto),
                    comision: setMoneyTable(compra.comision ? compra.comision : 0.0),
                    impuesto: setTextTableReactDom(compra.tipo_impuesto ? compra.tipo_impuesto.tipo : 'Sin definir', this.doubleClick, compra, 'tipoImpuesto', 
                        'text-center'),
                    tipoPago: setTextTableReactDom(compra.tipo_pago.tipo, this.doubleClick, compra, 'tipoPago', 'text-center'),
                    descripcion: setCustomeDescripcionReactDom(compra.descripcion !== null ? compra.descripcion :'', this.doubleClick, compra, 'descripcion', 
                        'text-justify'),
                    area: setTextTableReactDom(compra.area ? compra.area.nombre : '', this.doubleClick, compra, 'area', 'text-center'),
                    subarea: setTextTableReactDom(compra.subarea ? compra.subarea.nombre : '', this.doubleClick, compra, 'subarea', 'text-center'),
                    estatusCompra: setTextTableReactDom(compra.estatus_compra ? compra.estatus_compra.estatus : '', this.doubleClick, compra, 'estatusCompra', 
                        'text-center'),
                    total: setMoneyTable(compra.total),
                    fecha: setDateTableReactDom(compra.created_at, this.doubleClick, compra, 'fecha', 'text-center'),
                    tipo: this.labelIcon(compra),
                    id: compra.id,
                    objeto: compra
                }
            )
            return false
        })
        return aux
    }
    labelIcon(compra) {
        if (compra.hasTicket)
            return (
                <a href={`/calidad/tickets?id=${compra.ticketId}`}>
                    <div className='d-flex align-items-center justify-content-center text-dark-75 white-space-nowrap'>
                        <i style={{ color: "#9E9D24" }} className={`las la-ticket-alt icon-xl mr-2`} />
                        <u><span className="text-hover-ticket font-size-11px font-weight-bolder">{`ticket - ${compra.ticketIdentificador}`}</span></u>
                    </div>
                </a>
            )
        return (
            <div className='d-flex align-items-center justify-content-center text-dark-75 white-space-nowrap'>
                <i style={{ color: "#EF6C00" }} className={`las la-hard-hat icon-xl mr-2`} />
                <span className="font-size-11px">{`obra`}</span>
            </div>
        )
    }
    setActions = compra => {
        const { history } = this.props
        return (
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >
                    <Dropdown.Item className="text-hover-success dropdown-success" 
                        onClick={(e) => { e.preventDefault(); history.push({ pathname: '/proyectos/compras/edit', state: { compra: compra }, formeditado: 1 }) }} >
                        {setNaviIcon('flaticon2-pen', 'editar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-danger dropdown-danger" 
                        onClick={(e) => { e.preventDefault(); deleteAlert(`ELIMINARÁS LA COMPRA CON IDENTIFICADOR: ${compra.id}`, 
                            '¿DESEAS CONTINUAR?', () => this.deleteCompraAxios(compra.id)) }}>
                        {setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={(e) => { e.preventDefault(); this.openModalSee(compra) }}>
                        {setNaviIcon('flaticon2-magnifier-tool', 'Ver compra')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-info dropdown-info" onClick={(e) => { e.preventDefault(); this.openModalAdjuntos(compra) }}>
                        {setNaviIcon('flaticon-attachment', 'Adjuntos')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-warning dropdown-warning" onClick={(e) => { e.preventDefault(); this.openFacturaExtranjera(compra) }}>
                        {setNaviIcon('flaticon-interface-10', 'Factura extranjera')}
                    </Dropdown.Item>
                    {
                        compra.factura ?
                            <Dropdown.Item className="text-hover-dark dropdown-dark" onClick={(e) => { e.preventDefault(); this.openModalFacturas(compra) }}>
                                {setNaviIcon('flaticon2-download-1', 'Facturas')}
                            </Dropdown.Item>
                            : <></>
                    } 
                </DropdownButton>
            </div>
        )
    }
    openModalSee = async (compra) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/compras/${compra.id}`, access_token).then(
            (response) => {
                const { compra } = response.data
                const { modal } = this.state
                modal.see = true
                Swal.close()
                this.setState({ ...this.state, modal, compra })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openModalAdjuntos = async (compra) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/compras/adjuntos/${compra.id}`, access_token).then(
            (response) => {
                const { form, modal } = this.state
                const { compra } = response.data
                form.adjuntos.presupuesto.files = compra.presupuestos
                form.adjuntos.pago.files = compra.pagos
                modal.adjuntos = true
                Swal.close()
                this.setState({ ...this.state, form, modal, compra })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openFacturaExtranjera = async (compra) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/proyectos/compras/adjuntos/${compra.id}`, access_token).then(
            (response) => {
                const { form, modal } = this.state
                const { compra } = response.data
                form.adjuntos.facturas_pdf.files = compra.facturas_pdf
                modal.facturaExtranjera = true
                Swal.close()
                this.setState({ ...this.state, form, modal, compra })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openModalFacturas = (compra) => {
        const { modal } = this.state
        modal.facturas = true
        this.setState({ ...this.state, modal, compra:compra })
    }
    openModalFiltros = () => {
        const { modal } = this.state
        modal.filters = true
        this.setState({ ...this.state, modal })
    }
    handleClose = () => {
        const { data, modal } = this.state
        data.adjuntos = []
        modal.see = false
        modal.facturaExtranjera = false
        modal.adjuntos = false
        modal.filters = false
        modal.facturas = false
        this.setState({
            ...this.state,
            modal,
            form: this.clearForm(),
            adjuntos: [],
            compra: '',
            data
        })
    }
    reloadTableFacturas = () => {
        const { filters } = this.state
        this.reloadTable(filters)
    }
    openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿SEGURO DESEAS BORRAR EL ADJUNTO?', adjunto.name, () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) })
    }
    deleteCompraAxios = async (id) => {
        const { access_token } = this.props.authUser
        apiDelete(`compras/${id}`, access_token).then(
            (response) => {
                const { filters } = this.state
                this.setState({ ...this.state, form: this.clearForm() })
                doneAlert(response.data.message !== undefined ? response.data.message : 'La compra fue eliminada con éxito.', () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    exportComprasAxios = async () => {
        waitAlert()
        const { filters } = this.state
        const { access_token } = this.props.authUser
        apiPostFormResponseBlob(`v3/proyectos/compra/exportar`, { columnas: filters }, access_token).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'compras.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(
                    response.data.message !== undefined ? 
                        response.data.message 
                    : 'Las compras fueron exportados con éxito.'
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    attachFiles = async(files, item) => {
        waitAlert()
        const { compra } = this.state
        const { access_token } = this.props.authUser
        apiGet(`v1/constant/admin-proyectos`, access_token).then(
            (response) => {
                const { alma } = response.data
                let filePath = `compras/${compra.id}/`
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
        const { compra, filters } = this.state
        const { access_token } = this.props.authUser
        apiPutForm( `v2/proyectos/compras/${compra.id}/archivos/s3`, { archivos: files }, access_token ).then(
            ( response ) => {
                doneAlert(`Archivos adjuntados con éxito`, 
                    () => { 
                        switch(item){
                            case 'presupuesto':
                            case 'pago':
                                this.openModalAdjuntos(compra)         
                                break;
                            case 'facturas_pdf':
                                this.openFacturaExtranjera(compra)
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
        const { compra } = this.state
        apiDelete(`v2/proyectos/compras/${compra.id}/adjuntos/${id}`, access_token).then(
            (response) => {
                const { compra } = response.data
                const { form, filters } = this.state
                form.adjuntos.presupuesto.files = compra.presupuestos
                form.adjuntos.pago.files = compra.pagos
                form.adjuntos.facturas_pdf.files = compra.facturas_pdf
                this.setState({ ...this.state, form })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste el adjunto con éxito.', () => { this.reloadTable(filters) })
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
                    tipo === 'fecha' &&
                        <CalendarDaySwal value = { form[tipo] } onChange = { (e) => {  this.onChangeSwal(e.target.value, tipo)} } name = { tipo } 
                            date = { form[tipo] } withformgroup={0} />
                }
                {
                    tipo === 'proyecto' ?
                        <SelectSearchGray options = { this.setOptions(data, tipo) } value = { form[tipo] } customdiv = "mb-2 mt-7" requirevalidation = { 1 } 
                            onChange = { (value) => { this.onChangeSwal(value, tipo)} } name = { tipo } placeholder={this.setSwalPlaceholder(tipo)} withicon={1}/>
                    : <></>
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
            () => { this.patchCompras(data, tipo, flag) },
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
    patchCompras = async (data, tipo, flag) => {
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
        apiPutForm(`v2/proyectos/compras/${newType}/${data.id}`, { value: value }, access_token).then(
            (response) => {
                const { filters } = this.state
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.', () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
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
        let arregloFilterKeys = Object.keys(filter)
        let aux = {}
        arregloFilterKeys.forEach((elemento) => {
            switch(elemento){
                case 'area':
                case 'proveedor':
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
        $(`#compras`).DataTable().search(JSON.stringify(aux)).draw();
    }
    render() {
        const { modal, form, options, compra, filters } = this.state
        const { access_token } = this.props.authUser
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <NewTable
                    tableName = 'compras'
                    subtitle = 'Listado de compras'
                    title = 'Compras'
                    mostrar_boton = { true }
                    abrir_modal = { false }
                    accessToken = { access_token }
                    columns = { COMPRAS_COLUMNS }
                    setter = { this.setCompras }
                    url = '/proyectos/compras/add'
                    urlRender = {`${URL_DEV}v3/proyectos/compra`} 
                    filterClick = { this.openModalFiltros }
                    exportar_boton = { true}
                    onClickExport = { () => this.exportComprasAxios() } />
                <Modal size="xl" title="Facturas" show={modal.facturas} handleClose={this.handleClose} >
                    <FacturasFormTable at = { access_token } tipo_factura='compras' id={compra.id} dato={compra} reloadTable = {this.reloadTableFacturas}/>
                </Modal>
                <Modal size="xl" title="Adjuntos" show={modal.adjuntos} handleClose={this.handleClose} >
                    <AdjuntosForm form={form} onChangeAdjunto={this.handleChange} deleteFile={this.openModalDeleteAdjuntos} />
                </Modal>
                <Modal size="lg" title="Compra" show={modal.see} handleClose={this.handleClose} >
                    <ComprasCard compra={compra} />
                </Modal>
                <Modal size="lg" title="Factura extranjera" show={modal.facturaExtranjera} handleClose={this.handleClose} >
                    <FacturaExtranjera form={form} onChangeAdjunto={this.handleChange} deleteFile={this.openModalDeleteAdjuntos} />
                </Modal>
                <Modal size='xl' show={modal.filters} handleClose={this.handleClose} title='Filtros'>
                    <ComprasFilters at={access_token} sendFilters={this.sendFilters} filters={filters} options={options} setOptions={this.setOptionsArray} />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Compras);