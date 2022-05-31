import React, { Component } from 'react'
import $ from 'jquery'
import S3 from 'react-aws-s3'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { NewTable } from '../../../components/NewTables'
// import { Modal } from '../../../components/singles'
import Layout from '../../../components/layout/layout'
// import { EgresosCard } from '../../../components/cards'
// import { NewTable } from '../../../components/NewTables'
// import { EngresosFilters } from '../../../components/filters'
import { URL_DEV, MINUTAS_COLUMNS } from '../../../constants'
// import { FacturasFormTable } from '../../../components/tables'
import { DropdownButton, Dropdown } from 'react-bootstrap'
// import { AdjuntosForm, FacturaExtranjera } from '../../../components/forms'
import { apiOptions, apiGet, apiDelete, apiPutForm, catchErrors, apiPostFormResponseBlob } from '../../../functions/api'
import { waitAlert, deleteAlert, doneAlert, createAlertSA2WithActionOnClose, printResponseErrorAlert,  errorAlert } from '../../../functions/alert'
import {  setOptionsWithLabel, setTextTable, setDateTableReactDom, setMoneyTable, setArrayTable, setSelectOptions, setTextTableCenter, 
    setTextTableReactDom, setNaviIcon } from '../../../functions/setters'
class Minutas extends Component {
    state = {
        modal: {
            see: false,
            facturas: false,
            adjuntos: false,
            facturaExtranjera: false,
            filters: false,
            download: false
        },
        egresos: [],
        egresosAux: [],
        title: 'Nuevo egreso',
        egreso: '',
        data: {
            proveedores: [],
            empresas: [],
            egresos: [],
            adjuntos: []
        },
        form: {
            formaPago: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            metodoPago: '',
            estatusFactura: '',
            facturaObject: '',
            estatusCompra: 0,
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
        options: {
            formasPagos: [],
            metodosPagos: [],
            estatusFacturas: [],
            estatusCompras: [],
            allCuentas: []
        },
        filters: {}
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const egresos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!egresos)
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
                this.getEgresoAxios(id)
            }
        }
    }

    getOptionsAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiOptions(`v2/administracion/egresos`, access_token).then(
            (response) => {
                const { data, options } = this.state
                const { proveedores, empresas, estatusCompras, areas, tiposPagos, tiposImpuestos, cuentas } = response.data
                data.proveedores = proveedores
                data.empresas = empresas
                options['estatusCompras'] = setSelectOptions(estatusCompras, 'estatus')
                options['empresas'] = setOptionsWithLabel(empresas, 'name', 'id')
                options['areas'] = setOptionsWithLabel(areas, 'nombre', 'id')
                options['proveedores'] = setOptionsWithLabel(proveedores, 'razon_social', 'id')
                options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
                options['tiposImpuestos'] = setSelectOptions(tiposImpuestos, 'tipo')
                options.allCuentas = setOptionsWithLabel(cuentas, 'nombre', 'id')
                Swal.close()
                this.setState({ ...this.state, data, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    async getEgresoAxios(id) {
        const { access_token } = this.props.authUser
        apiGet(`egresos/single/${id}`, access_token).then(
            (response) => {
                const { egreso } = response.data
                this.setState({
                    ...this.state,
                    egreso: egreso
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
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
                case 'estatusCompra':
                    form[element] = 0
                    break;
                case 'fechaInicio':
                case 'fechaFin':
                    form[element] = new Date()
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
        form.adjuntos[item].value = files
        form.adjuntos[item].files = aux
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
    setEgresos = egresos => {
        let aux = []
        let _aux = []
        if (egresos)
            egresos.map((egreso) => {
                _aux = []
                if (egreso.presupuestos) {
                    egreso.presupuestos.map((presupuesto) => {
                        _aux.push({
                            name: 'Presupuesto', text: presupuesto.name, url: presupuesto.url
                        })
                        return false
                    })
                }
                if (egreso.pagos) {
                    egreso.pagos.map((pago) => {
                        _aux.push({
                            name: 'Pago', text: pago.name, url: pago.url
                        })
                        return false
                    })
                }
                aux.push(
                    {
                        actions: this.setActions(egreso),
                        identificador: setTextTableCenter(egreso.id),
                        cuenta: setArrayTable(
                            [
                                { name: 'Empresa', text: egreso.empresa ? egreso.empresa.name : '' },
                                { name: 'Cuenta', text: egreso.cuenta ? egreso.cuenta.nombre : '' },
                                { name: 'No. de cuenta', text: egreso.cuenta ? egreso.cuenta.numero : '' }
                            ], '250px'
                        ),
                        proveedor: setTextTable(egreso.proveedor ? egreso.proveedor.razon_social : ''),
                        factura: setTextTableCenter(egreso.factura ? 'Con factura' : 'Sin factura'),
                        monto: setMoneyTable(egreso.monto),
                        comision: setMoneyTable(egreso.comision ? egreso.comision : 0.0),
                        total: setMoneyTable(egreso.total),
                        impuesto: setTextTableReactDom(egreso.tipo_impuesto ? egreso.tipo_impuesto.tipo : 'Sin definir', this.doubleClick, egreso, 'tipoImpuesto', 'text-center'),
                        tipoPago: setTextTableReactDom(egreso.tipo_pago.tipo, this.doubleClick, egreso, 'tipoPago', 'text-center'),
                        descripcion: setTextTableReactDom(egreso.descripcion !== null ? egreso.descripcion : '', this.doubleClick, egreso, 'descripcion', 'text-justify'),
                        area: setTextTableReactDom(egreso.area ? egreso.area.nombre : '', this.doubleClick, egreso, 'area', 'text-center'),
                        subarea: setTextTableReactDom(egreso.subarea ? egreso.subarea.nombre : '', this.doubleClick, egreso, 'subarea', 'text-center'),
                        estatusCompra: setTextTableReactDom(egreso.estatus_compra ? egreso.estatus_compra.estatus : '', this.doubleClick, egreso, 'estatusCompra', 'text-center'),
                        adjuntos: setArrayTable(_aux),
                        fecha: setDateTableReactDom(egreso.created_at, this.doubleClick, egreso, 'fecha', 'text-center'),
                        id: egreso.id,
                        objeto: egreso
                    }
                )
                return false
            })
        return aux
    }

    setActions = egreso => {
        const { history } = this.props
        return (
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >
                    <Dropdown.Item className="text-hover-success dropdown-success" onClick={(e) => { e.preventDefault(); 
                        history.push({ pathname: '/administracion/egresos/edit', state: { egreso: egreso } }) }} >
                        {setNaviIcon('flaticon2-pen', 'editar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-danger dropdown-danger" onClick={(e) => { e.preventDefault(); deleteAlert('¿DESEAS CONTINUAR?', `ELIMINARÁS EL EGRESO CON IDENTIFICADOR: ${egreso.id}`, () => this.deleteEgresoAxios(egreso.id)) }}>
                        {setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
                    </Dropdown.Item>
                    {/* <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={(e) => { e.preventDefault(); this.openModalSee(egreso) }}>
                        {setNaviIcon('flaticon2-magnifier-tool', 'Ver egreso')}
                    </Dropdown.Item> */}
                    <Dropdown.Item className="text-hover-info dropdown-info" onClick={(e) => { e.preventDefault(); this.openModalAdjuntos(egreso) }}>
                        {setNaviIcon('flaticon-attachment', 'Adjuntos')}
                    </Dropdown.Item>
                </DropdownButton>
            </div>
        )
    }
    openModalSee = async (egreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/administracion/egresos/${egreso.id}`, access_token).then(
            (response) => {
                const { egreso } = response.data
                const { modal } = this.state
                modal.see = true
                Swal.close()
                this.setState({ ...this.state, modal, egreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openModalAdjuntos = async (egreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/administracion/egresos/adjuntos/${egreso.id}`, access_token).then(
            (response) => {
                const { egreso } = response.data
                let { form } = this.state
                const { modal } = this.state
                form = this.revertForm(egreso)
                Swal.close()
                modal.adjuntos = true
                this.setState({ ...this.state, form, modal, egreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openFacturaExtranjera = async (egreso) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/administracion/egresos/adjuntos/${egreso.id}`, access_token).then(
            (response) => {
                let { form } = this.state
                const { egreso } = response.data
                const { modal } = this.state
                form = this.revertForm(egreso)
                modal.facturaExtranjera = true
                Swal.close()
                this.setState({ ...this.state, form, modal, egreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openModalFacturas = async (egreso) => {
        const { modal } = this.state
        modal.facturas = true
        this.setState({ ...this.state, modal, egreso:egreso })
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
        modal.download = false
        modal.filters = false
        modal.facturas = false
        this.setState({
            ...this.state,
            data,
            modal,
            egreso: '',
            facturas: [],
            adjuntos: [],
            form: this.clearForm()
        })
    }
    reloadTableFacturas = () => {
        const { filters } = this.state
        this.reloadTable(filters)
    }
    async deleteEgresoAxios(id) {
        const { access_token } = this.props.authUser
        apiDelete(`egresos/${id}`, access_token).then(
            (response) => {
                const { filters } = this.state
                this.setState({
                    ...this.state,
                    egreso: '',
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue eliminado con éxito.', () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }    
    exportEgresosAxios = async () => {
        waitAlert()
        const { filters } = this.state
        const { access_token } = this.props.authUser
        apiPostFormResponseBlob(`v3/administracion/egresos/exportar`, { columnas: filters }, access_token).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'egresos.xlsx');
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
        const { egreso } = this.state
        const { access_token } = this.props.authUser
        apiGet(`v1/constant/admin-proyectos`, access_token).then(
            (response) => {
                const { alma } = response.data
                let filePath = `egresos/${egreso.id}/`
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
        const { egreso, filters } = this.state
        const { access_token } = this.props.authUser
        apiPutForm( `v3/administracion/egresos/${egreso.id}/archivos/s3`, { archivos: files }, access_token ).then(
            ( response ) => {
                doneAlert(`Archivos adjuntados con éxito`, 
                    () => { 
                        switch(item){
                            case 'presupuesto':
                            case 'pago':
                                this.openModalAdjuntos(egreso)         
                                break;
                            case 'facturas_pdf':
                                this.openFacturaExtranjera(egreso) 
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
        const { egreso } = this.state
        apiDelete(`v2/administracion/egresos/${egreso.id}/adjuntos/${id}`, access_token).then(
            (response) => {
                const { egreso } = response.data
                let { form } = this.state
                const { filters } = this.state
                form = this.revertForm(egreso)
                this.setState({ ...this.state, form })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.', () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    doubleClick = (data, tipo) => {
       
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
            default: return []
        }
    }
    patchEgresos = async (data, tipo, flag) => {
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
        apiPutForm(`v2/administracion/egresos/${newType}/${data.id}`, { value: value }, access_token).then(
            (response) => {
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
        $(`#egresos`).DataTable().search(JSON.stringify(aux)).draw();
    }
    revertForm = (egreso) => {
        const { form } = this.state
        form.adjuntos.pago.value = null
        form.adjuntos.presupuesto.value = null
        form.adjuntos.facturas_pdf.value = null
        form.adjuntos.pago.files = []
        form.adjuntos.presupuesto.files = []
        form.adjuntos.facturas_pdf.files = []
        egreso.pagos.forEach(element => {
            form.adjuntos.pago.files.push(element);
        });
        egreso.presupuestos.forEach(element => {
            form.adjuntos.presupuesto.files.push(element);
        });
        egreso.facturas_pdf.forEach(element => {
            form.adjuntos.facturas_pdf.files.push(element);
        });
        return form
    }
    render() {
        // const { form, options, egreso, modal, filters } = this.state
        const { access_token } = this.props.authUser
        return (
            <Layout  active={'rh'} {...this.props} >
                <NewTable
                    tableName='minutas'
                    subtitle='Listado de minutas'
                    title='minutas'
                    mostrar_boton={true}
                    abrir_modal={true}
                    accessToken={access_token}
                    columns={MINUTAS_COLUMNS}
                    setter={this.setEgresos}
                    url='/administracion/egresos/add'
                    urlRender={`${URL_DEV}v3/administracion/egreso`}
                    filterClick={this.openModalFiltros}
                    exportar_boton={true}
                    onClickExport = { () => { this.exportEgresosAxios() } }
                />
                {/* <Modal size="xl" title={"Facturas"} show={modal.facturas} handleClose={this.handleClose} >
                    <FacturasFormTable at = { access_token } tipo_factura='egresos' id={egreso.id} dato={egreso} reloadTable = {this.reloadTableFacturas}/>
                </Modal>
                <Modal size="xl" title={"Adjuntos"} show={modal.adjuntos} handleClose={this.handleClose}>
                    <AdjuntosForm form={form} onChangeAdjunto={this.handleChange}
                        clearFiles={this.clearFiles} deleteFile={this.openModalDeleteAdjuntos} />
                </Modal>
                <Modal size="lg" title="Egreso" show={modal.see} handleClose={this.handleClose} >
                    <EgresosCard egreso={egreso} />
                </Modal>
                <Modal size="lg" title="Factura extranjera" show={modal.facturaExtranjera} handleClose={this.handleClose} >
                    <FacturaExtranjera form={form} onChangeAdjunto={this.handleChange} deleteFile={this.openModalDeleteAdjuntos} />
                </Modal>
                <Modal size='xl' show={modal.filters} handleClose={this.handleClose} title='Filtros'>
                    <EngresosFilters at={access_token} sendFilters={this.sendFilters} filters={filters} options={options} setOptions={this.setOptionsArray} />
                </Modal> */}
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Minutas);