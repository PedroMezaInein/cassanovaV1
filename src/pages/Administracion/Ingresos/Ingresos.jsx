import React, { Component } from 'react'
import $ from 'jquery'
import S3 from 'react-aws-s3'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { Update } from '../../../components/Lottie'
import { Modal } from '../../../components/singles'
import Layout from '../../../components/layout/layout'
import { IngresosCard } from '../../../components/cards'
import { NewTable } from '../../../components/NewTables'
import { IngresosFilters } from '../../../components/filters'
import { printSwalHeader } from '../../../functions/printers'
import { URL_DEV, INGRESOS_COLUMNS } from '../../../constants'
import { FacturasFormTable } from '../../../components/tables'
import { Form, DropdownButton, Dropdown } from 'react-bootstrap'
import { AdjuntosForm, FacturaExtranjera } from '../../../components/forms'
import { InputGray, CalendarDaySwal, SelectSearchGray, DoubleSelectSearchGray } from '../../../components/form-components'
import { apiOptions, apiGet, apiDelete, apiPostFormData, apiPutForm, catchErrors, apiPostFormResponseBlob } from '../../../functions/api'
import { waitAlert, deleteAlert, doneAlert, createAlertSA2WithActionOnClose, printResponseErrorAlert, customInputAlert, errorAlert } from '../../../functions/alert'
import { setNaviIcon, setOptions, setDateTableReactDom, setMoneyTable, setArrayTable, setSelectOptions, setTextTableCenter, setTextTableReactDom, setOptionsWithLabel } from '../../../functions/setters'
class Ingresos extends Component {
    state = {
        modal: {
            see: false,
            facturas: false,
            adjuntos: false,
            facturaExtranjera: false,
            filters: false
        },
        selectValido: false,
        ingresos: [],
        title: 'Nuevo ingreso',
        ingreso: '',
        data: {
            proveedores: [],
            empresas: [],
            ingresos: [],
            adjuntos: [],
            clientes: []
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
        formeditado: 0,
        options: {
            formasPago: [],
            metodosPago: [],
            estatusFacturas: [],
            empresas: [],
            clientes: []
        },
        filters: {}
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const ingresos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!ingresos)
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
                this.getIngresoAxios(id)
            }
        }
    }
    getOptionsAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiOptions(`v2/administracion/ingresos`, access_token).then(
            (response) => {
                const { data, options } = this.state
                const { clientes, empresas, formasPago, metodosPago, estatusFacturas, estatusCompras, tiposPagos, tiposImpuestos, areas } = response.data
                options['metodosPago'] = setOptionsWithLabel(metodosPago, 'nombre', 'id')
                options['formasPago'] = setOptionsWithLabel(formasPago, 'nombre', 'id')
                options['estatusFacturas'] = setOptionsWithLabel(estatusFacturas, 'estatus', 'id')
                options['estatusCompras'] = setSelectOptions(estatusCompras, 'estatus')
                options['empresas'] = setOptionsWithLabel(empresas, 'name', 'id')
                options['clientes'] = setOptionsWithLabel(clientes, 'empresa', 'id')
                options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
                options['tiposImpuestos'] = setSelectOptions(tiposImpuestos, 'tipo')
                options['areas'] = setOptionsWithLabel(areas, 'nombre', 'id')
                data.clientes = clientes
                data.empresas = empresas
                Swal.close()
                this.setState({
                    ...this.state,
                    data,
                    options
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    getIngresoAxios = async (id) => {
        const { access_token } = this.props.authUser
        apiGet(`ingresos/single/${id}`, access_token).then(
            (response) => {
                const { ingreso } = response.data
                this.setState({
                    ...this.state,
                    ingreso: ingreso
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
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
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
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
                    return false
                })
            }
            if (ingreso.pagos) {
                ingreso.pagos.map((pago) => {
                    _aux.push({
                        name: 'Pago', text: pago.name, url: pago.url
                    })
                    return false
                })
            }
            aux.push(
                {
                    actions: this.setActions(ingreso),
                    identificador: setTextTableCenter(ingreso.id),
                    cuenta: setArrayTable(
                        [
                            { name: 'Empresa', text: ingreso.empresa ? ingreso.empresa.name : '' },
                            { name: 'Cuenta', text: ingreso.cuenta ? ingreso.cuenta.nombre : '' },
                            { name: '# de cuenta', text: ingreso.cuenta ? ingreso.cuenta.numero : '' }
                        ], '200px'
                    ),
                    cliente: setTextTableCenter(ingreso.cliente ? ingreso.cliente.empresa : ''),
                    factura: setTextTableCenter(ingreso.factura ? 'Con factura' : 'Sin factura'),
                    monto: setMoneyTable(ingreso.monto),
                    impuesto: setTextTableReactDom(ingreso.tipo_impuesto ? ingreso.tipo_impuesto.tipo : 'Sin definir', this.doubleClick, ingreso, 
                        'tipoImpuesto', 'text-center'),
                    tipoPago: setTextTableReactDom(ingreso.tipo_pago.tipo, this.doubleClick, ingreso, 'tipoPago', 'text-center'),
                    descripcion: setTextTableReactDom(ingreso.descripcion !== null ? ingreso.descripcion : '', this.doubleClick, ingreso, 'descripcion', 
                        'text-justify'),
                    area: setTextTableReactDom(ingreso.area ? ingreso.area.nombre : '', this.doubleClick, ingreso, 'area', 'text-center'),
                    subarea: setTextTableReactDom(ingreso.subarea ? ingreso.subarea.nombre : '', this.doubleClick, ingreso, 'subarea', 'text-center'),
                    estatusCompra: setTextTableReactDom(ingreso.estatus_compra ? ingreso.estatus_compra.estatus : '', this.doubleClick, ingreso, 
                        'estatusCompra', 'text-center'),
                    total: setMoneyTable(ingreso.total),
                    fecha: setDateTableReactDom(ingreso.created_at, this.doubleClick, ingreso, 'fecha', 'text-center'),
                    id: ingreso.id,
                    objeto: ingreso
                }
            )
            return false
        })
        return aux
    }
    setActions = ingreso => {
        const { history } = this.props
        return (
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >
                    <Dropdown.Item className="text-hover-success dropdown-success" onClick={(e) => { e.preventDefault(); 
                            history.push({ pathname: '/administracion/ingresos/edit', state: { ingreso: ingreso }, formeditado: 1 }) }} >
                        {setNaviIcon('flaticon2-pen', 'editar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-danger dropdown-danger" onClick={(e) => { e.preventDefault(); 
                        deleteAlert('¿DESEAS CONTINUAR?', `ELIMINARÁS EL INGRESO CON IDENTIFICADOR: ${ingreso.id}`, () => this.deleteIngresoAxios(ingreso.id)) }}>
                        {setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={(e) => { e.preventDefault(); this.openModalSee(ingreso) }}>
                        {setNaviIcon('flaticon2-magnifier-tool', 'Ver ingreso')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-info dropdown-info" onClick={(e) => { e.preventDefault(); this.openModalAdjuntos(ingreso) }}>
                        {setNaviIcon('flaticon-attachment', 'Adjuntos')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-warning dropdown-warning" onClick={(e) => { e.preventDefault(); this.openFacturaExtranjera(ingreso) }}>
                        {setNaviIcon('flaticon-interface-10', 'Factura extranjera')}
                    </Dropdown.Item>
                    {
                        ingreso.factura ?
                            <Dropdown.Item className="text-hover-dark dropdown-dark" onClick={(e) => { e.preventDefault(); this.openModalFacturas(ingreso) }}>
                                {setNaviIcon('flaticon2-download-1', 'Facturas')}
                            </Dropdown.Item>
                            : <></>
                    }
                </DropdownButton>
            </div>
        )
    }
    openModalSee = async (ingreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/administracion/ingresos/${ingreso.id}`, access_token).then(
            (response) => {
                const { ingreso } = response.data
                const { modal } = this.state
                modal.see = true
                Swal.close()
                this.setState({ ...this.state, modal, ingreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openModalAdjuntos = async (ingreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/administracion/ingresos/adjuntos/${ingreso.id}`, access_token).then(
            (response) => {
                const { ingreso } = response.data
                const { modal } = this.state
                let { form } = this.state
                form = this.fillAdjuntos(ingreso)
                Swal.close()
                modal.adjuntos = true
                this.setState({ ...this.state, form, modal, ingreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openFacturaExtranjera = async (ingreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/administracion/ingresos/adjuntos/${ingreso.id}`, access_token).then(
            (response) => {
                const { ingreso } = response.data
                const { modal } = this.state
                let { form } = this.state
                form = this.fillAdjuntos(ingreso)
                Swal.close()
                modal.facturaExtranjera = true
                this.setState({ ...this.state, form, modal, ingreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openModalFacturas = async (ingreso) => {
        const { modal } = this.state
        modal.facturas = true
        this.setState({ ...this.state, modal, ingreso:ingreso })
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
        data.adjuntos = []
        modal.see = false
        modal.adjuntos = false
        modal.facturaExtranjera = false
        modal.filters = false
        this.setState({
            ...this.state,
            data,
            modal,
            ingreso: '',
            adjuntos: [],
            form: this.clearForm()
        })
    }
    handleCloseFacturas = () => {
        const { modal, filters } = this.state
        modal.facturas = false
        this.reloadTable(filters)
        this.setState({
            ...this.state,
            modal,
            venta: '',
        })
    }
    async deleteIngresoAxios() {
        const { access_token } = this.props.authUser
        const { ingreso, filters } = this.state
        apiDelete(`ingresos/${ingreso.id}`, access_token).then(
            (response) => {
                this.setState({
                    ...this.state,
                    ingreso: ''
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue eliminado con éxito.', 
                    () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    exportIngresosAxios = async() => {
        waitAlert()
        const { filters } = this.state
        const { access_token } = this.props.authUser
        apiPostFormResponseBlob(`v3/administracion/ingresos/exportar`, { columnas: filters }, access_token).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'ingresos.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(
                    response.data.message !== undefined ? 
                        response.data.message 
                    : 'Ingresos exportados con éxito.'
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    attachFiles = async(files, item) => {
        waitAlert()
        const { ingreso } = this.state
        const { access_token } = this.props.authUser
        apiGet(`v1/constant/admin-proyectos`, access_token).then(
            (response) => {
                const { alma } = response.data
                let filePath = `ingresos/${ingreso.id}/`
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
        const { ingreso } = this.state
        const { access_token } = this.props.authUser
        apiPutForm( `v3/administracion/ingresos/${ingreso.id}/archivos/s3`, { archivos: files }, access_token ).then(
            ( response ) => {
                doneAlert(`Archivos adjuntados con éxito`, 
                    () => { 
                        switch(item){
                            case 'presupuesto':
                            case 'pago':
                                this.openModalAdjuntos(ingreso)         
                                break;
                            case 'facturas_pdf':
                                this.openFacturaExtranjera(ingreso) 
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
        const { ingreso, filters } = this.state
        apiDelete(`v2/administracion/ingresos/${ingreso.id}/adjuntos/${id}`, access_token).then(
            (response) => {
                const { ingreso } = response.data
                let { form } = this.state
                form = this.fillAdjuntos(ingreso)
                this.setState({ ...this.state, form })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.', () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    addFacturaExtranjera = async (files, item) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const data = new FormData();
        files.map((file) => {
            data.append(`files_name_${item}[]`, file.name)
            data.append(`files_${item}[]`, file)
            return ''
        })
        apiPostFormData(`ingresos/adjuntos`, data, access_token).then(
            (response) => {
                const { filters } = this.state
                this.setState({ ...this.state })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.', () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    doubleClick = (data, tipo) => {
        const { form, options } = this.state
        let busqueda = undefined
        let flag = false
        switch (tipo) {
            case 'subarea':
                options.subareas = []
                flag = false
                if (data.area) {
                    busqueda = options.areas.find((elemento) => { return elemento.value === data.area.id.toString() })
                    if (busqueda) {
                        options.subareas = setOptions(busqueda.subareas, 'nombre', 'id')
                        if (data.subarea) {
                            busqueda = options.subareas.find((elemento) => { return elemento.value === data.subarea.id.toString() })
                            if (busqueda) { form.subarea = busqueda.value }
                        }
                    }
                } else {
                    flag = true
                    if (data.area) {
                        form.area = data.area.id.toString()
                        options.subareas = setOptions(data.area.subareas, 'nombre', 'id')
                    }
                    if (data.subarea) {
                        busqueda = options.subareas.find((elemento) => { return elemento.value === data.subarea.id.toString() })
                        if (busqueda) form.subarea = data.subarea.id.toString()
                    }
                }
                break
            case 'area':
                options.subareas = []
                if (data.area) {
                    form.area = data.area.id.toString()
                    options.subareas = setOptions(data.area.subareas, 'nombre', 'id')
                }
                if (data.subarea) {
                    busqueda = options.subareas.find((elemento) => { return elemento.value === data.subarea.id.toString() })
                    if (busqueda) form.subarea = data.subarea.id.toString()
                }
                break
            case 'fecha':
                form.fecha = new Date(data.created_at)
                break
            case 'tipoImpuesto':
                if (data.tipo_impuesto)
                    form[tipo] = data.tipo_impuesto.id
                break
            case 'tipoPago':
                if (data.tipo_pago)
                    form[tipo] = data.tipo_pago.id
                break
            case 'estatusCompra':
                if (data.estatus_compra)
                    form[tipo] = data.estatus_compra.id
                break
            default:
                form[tipo] = data[tipo]
                break
        }
        this.setState({ form, options })
        customInputAlert(
            <div>
                <h2 className='swal2-title mb-4 mt-2'> {printSwalHeader(tipo)} </h2>
                {
                    tipo === 'descripcion' &&
                    <InputGray withtaglabel={0} withtextlabel={0} withplaceholder={0} withicon={0}
                        requirevalidation={0} value={form[tipo]} name={tipo} rows={6} as='textarea'
                        onChange={(e) => { this.onChangeSwal(e.target.value, tipo) }} swal={true} />
                }
                {
                    (tipo === 'tipoImpuesto') || (tipo === 'tipoPago') || (tipo === 'estatusCompra') ?
                        <div className="input-icon my-3">
                            <span className="input-icon input-icon-right">
                                <span>
                                    <i className={"flaticon2-search-1 icon-md text-dark-50"}></i>
                                </span>
                            </span>
                            <Form.Control className="form-control text-uppercase form-control-solid"
                                onChange={(e) => { this.onChangeSwal(e.target.value, tipo) }} name={tipo}
                                defaultValue={form[tipo]} as="select">
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
                        : <></>
                }
                {
                    tipo === 'fecha' ?
                        <CalendarDaySwal value={form[tipo]} onChange={(e) => { this.onChangeSwal(e.target.value, tipo) }} name={tipo} date={form[tipo]} 
                        withformgroup={0} />
                    : <></>
                }
                {
                    tipo === 'subarea' ?
                        flag ?
                            <DoubleSelectSearchGray options={options} form={form} onChange={this.onChangeSwal}
                                one={{ placeholder: 'SELECCIONA EL ÁREA', name: 'area', opciones: 'areas' }}
                                two={{ placeholder: 'SELECCIONA EL SUBÁREA', name: 'subarea', opciones: 'subareas' }} />
                            :
                            <SelectSearchGray options={options.subareas} placeholder='Selecciona el subárea' value={form.subarea}
                                onChange={(value) => { this.onChangeSwal(value, tipo) }} withtaglabel={1}
                                name={tipo} customdiv="mb-3" withicon={1} />
                        : ''
                }
                {
                    tipo === 'area' &&
                    <DoubleSelectSearchGray options={options} form={form} onChange={this.onChangeSwal}
                        one={{ placeholder: 'SELECCIONA EL ÁREA', name: 'area', opciones: 'areas' }}
                        two={{ placeholder: 'SELECCIONA EL SUBÁREA', name: 'subarea', opciones: 'subareas' }} />
                }
            </div>,
            <Update />,
            () => { this.patchIngresos(data, tipo, flag) },
            () => { this.setState({ ...this.state, form: this.clearForm() }); Swal.close(); },
        )
    }
    setSwalPlaceholder = (tipo) => {
        switch (tipo) {
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
        this.setState({ ...this.state, form })
    }
    setOptions = (data, tipo) => {
        const { options } = this.state
        switch (tipo) {
            case 'estatusCompra':
                return options.estatusCompras
            case 'tipoPago':
                return options.tiposPagos
            case 'tipoImpuesto':
                return options.tiposImpuestos
            case 'subarea':
                if (data.subarea)
                    if (data.subarea.area)
                        if (data.subarea.area.subareas)
                            return setOptions(data.subarea.area.subareas, 'nombre', 'id')
                return []
            default: return []
        }
    }
    patchIngresos = async (data, tipo, flag) => {
        const { access_token } = this.props.authUser
        const { form, filters } = this.state
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
                } else {
                    value = form[tipo]
                }
                break
            default:
                value = form[tipo]
                break
        }
        waitAlert()
        apiPutForm(`v2/administracion/ingresos/${newType}/${data.id}`, { value: value }, access_token).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.', 
                    () => { this.reloadTable(filters) })
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
                case 'cliente':
                case 'cuenta':
                case 'empresa':
                case 'estatusCompra':
                case 'proyecto':
                case 'subarea':
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
        $(`#ingresos`).DataTable().search(JSON.stringify(aux)).draw();
    }
    fillAdjuntos = ingreso => {
        const { form } = this.state
        form.adjuntos.pago.value = null
        form.adjuntos.presupuesto.value = null
        form.adjuntos.facturas_pdf.value = null
        form.adjuntos.pago.files = []
        form.adjuntos.presupuesto.files = []
        form.adjuntos.facturas_pdf.files = []
        ingreso.pagos.forEach(element => {
            form.adjuntos.pago.files.push(element);
        });
        ingreso.presupuestos.forEach(element => {
            form.adjuntos.presupuesto.files.push(element);
        });
        ingreso.facturas_pdf.forEach(element => {
            form.adjuntos.facturas_pdf.files.push(element);
        });
        return form
    }
    render() {
        const { form, options, modal, ingreso, filters } = this.state
        const { access_token } = this.props.authUser
        return (
            <Layout active='administracion'  {...this.props}>
                <NewTable
                    tableName='ingresos'
                    subtitle='Listado de ingresos'
                    title='Ingresos'
                    mostrar_boton={true}
                    abrir_modal={false}
                    accessToken={access_token}
                    columns={INGRESOS_COLUMNS}
                    setter={this.setIngresos}
                    url='/administracion/ingresos/add'
                    urlRender={`${URL_DEV}v3/administracion/ingreso`}
                    filterClick={this.openModalFiltros}
                    exportar_boton={true}
                    onClickExport={() => this.exportIngresosAxios()}
                />
                <Modal size="xl" title={"Facturas"} show={modal.facturas} handleClose={this.handleCloseFacturas}>
                    <FacturasFormTable at = { access_token } tipo_factura='ingresos' id={ingreso.id} dato={ingreso}/>
                </Modal>
                <Modal size="xl" title="Adjuntos" show={modal.adjuntos} handleClose={this.handleClose} >
                    <AdjuntosForm form={form} onChangeAdjunto={this.handleChange} deleteFile={this.openModalDeleteAdjuntos} />
                </Modal>
                <Modal size="lg" title="Ingreso" show={modal.see} handleClose={this.handleClose} >
                    <IngresosCard ingreso={ingreso} />
                </Modal>
                <Modal size="lg" title="Factura extranjera" show={modal.facturaExtranjera} handleClose={this.handleClose} >
                    <FacturaExtranjera form={form} onChangeAdjunto={this.handleChange} deleteFile={this.openModalDeleteAdjuntos} />
                </Modal>
                <Modal size='xl' show={modal.filters} handleClose={this.handleClose} title='Filtros'>
                    <IngresosFilters at={access_token} sendFilters={this.sendFilters} filters={filters} options={options} setOptions={this.setOptionsArray} />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Ingresos);