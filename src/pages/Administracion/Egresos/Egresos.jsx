import React, { Component, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'


import $ from 'jquery'
import S3 from 'react-aws-s3'
import { Tabs, Tab } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { Modal } from '../../../components/singles'
import { Update } from '../../../components/Lottie'
import Layout from '../../../components/layout/layout'
import { EgresosCard } from '../../../components/cards'
import { NewTable } from '../../../components/NewTables'
import { EngresosFilters } from '../../../components/filters'
import { URL_DEV, EGRESOS_COLUMNS } from '../../../constants'
import { printSwalHeader } from '../../../functions/printers'
import { FacturasFormTable } from '../../../components/tables'
import { Form, DropdownButton, Dropdown } from 'react-bootstrap'
import { AdjuntosForm, FacturaExtranjera } from '../../../components/forms'
import { apiOptions, apiGet, apiDelete, apiPutForm, catchErrors, apiPostFormResponseBlob } from '../../../functions/api'
import { InputGray, CalendarDaySwal, SelectSearchGray, DoubleSelectSearchGray } from '../../../components/form-components'
import { waitAlert, deleteAlert, doneAlert, createAlertSA2WithActionOnClose, printResponseErrorAlert, customInputAlert, errorAlert } from '../../../functions/alert'
import { setOptions, setOptionsWithLabel, setTextTable, setDateTableReactDom, setMoneyTable, setArrayTable, setSelectOptions, setTextTableCenter, 
    setTextTableReactDom, setNaviIcon
} from '../../../functions/setters'
import RequisicionCompras from './../RequisicionCompras/RequisicionCompras'
import RequisicionContabilidad from './../RequisicionContabilidad/RequisicionContabilidad'
import {Requisiciones} from './../Requisiciones/Requisiciones'
import Table from './../../../components/NewTables/TablaGeneral/TablaGeneral'
import TablaGeneralPaginado from '../../../components/NewTables/TablaGeneral/TablaGeneralPaginado'

export default function Egresos(props) {

    const authUser = useSelector((state) => state.authUser);
    const areas = useSelector((state) => state.opciones.areas);

    const [state, setState] = useState({
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
        filters: {},
        key: 'gastos'
    })

    useEffect(() => { 
        const { history: { location: { pathname } } } = props
        const { history } = props
        const egresos = authUser.user.permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!egresos)
            history.push('/')
        getOptionsAxios()
        let queryString = props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                const { modal, filters } = state
                filters.identificador = id
                modal.see = true
                setState({ ...state, modal, filters })
                reloadTable(filters)
                getEgresoAxios(id)
            }
        }
    }, [])

    const columnas = [
        { nombre: 'Opciones', identificador: 'actions', stringSearch: false },
        { nombre: 'ID', identificador: 'identificador', stringSearch: false },
        { nombre: 'Fecha', identificador: 'fecha', stringSearch: false },
        { nombre: 'Proveedor', identificador: 'proveedor', stringSearch: false },
        { nombre: 'Factura', identificador: 'factura', stringSearch: false },
        { nombre: 'Área', identificador: 'area', stringSearch: false },
        { nombre: 'Sub-Área', identificador: 'subarea', stringSearch: false },
        { nombre: 'Monto', identificador: 'monto', stringSearch: false },
        { nombre: 'Comisión', identificador: 'comision', stringSearch: false },
        { nombre: 'Total', identificador: 'total', stringSearch: false },
        { nombre: 'Cuenta', identificador: 'cuenta', stringSearch: false },
        { nombre: 'Pago', identificador: 'tipoPago', stringSearch: false },    
        { nombre: 'Impuesto', identificador: 'impuesto', stringSearch: false },
        // { nombre: 'Estatus', identificador: 'estatusCompra', stringSearch: false }, 
        { nombre: 'Descripción', identificador: 'descripcion', stringSearch: false }
    ]

    const getOptionsAxios = async () => {
        waitAlert()
        apiOptions(`v2/administracion/egresos`, authUser.access_token).then(
            (response) => {
                const { data, options } = state
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
                setState({ ...state, data, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    async function getEgresoAxios(id) {
        apiGet(`egresos/single/${id}`, authUser.access_token).then(
            (response) => {
                const { egreso } = response.data
                setState({
                    ...state,
                    egreso: egreso
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    const clearForm = () => {
        const { form } = state
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

    const handleChange = (files, item) => {
        const { form } = state
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
        setState({ ...state, form })
        createAlertSA2WithActionOnClose(
            '¿DESEAS AGREGAR EL ARCHIVO?',
            '',
            () => attachFiles(files, item),
            () => cleanAdjuntos(item)
        )
    }

    const cleanAdjuntos = (item) => {
        const { form } = state
        let aux = []
        form.adjuntos[item].files.map((file) => {
            if (file.id) aux.push(file)
            return ''
        })
        form.adjuntos[item].value = ''
        form.adjuntos[item].files = aux
        setState({ ...state, form })
    }
    
    const clearFiles = (name, key) => {
        const { form } = state
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
        setState({
            ...state,
            form
        })
    }

    const proccessData = egresos => {
        let aux = []
        let _aux = []
        if (egresos)
            egresos.data.data.map((egreso) => {
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
                        actions: setActions(egreso),
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
                        impuesto: setTextTableReactDom(egreso.tipo_impuesto ? egreso.tipo_impuesto.tipo : 'Sin definir', doubleClick, egreso, 'tipoImpuesto', 'text-center'),
                        tipoPago: setTextTableReactDom(egreso.tipo_pago.tipo, doubleClick, egreso, 'tipoPago', 'text-center'),
                        descripcion: setTextTableReactDom(egreso.descripcion !== null ? egreso.descripcion : 'sin descripción', doubleClick, egreso, 'descripcion', 'text-justify'),
                        area: setTextTableReactDom(egreso.area ? egreso.area.nombre : '', doubleClick, egreso, 'area', 'text-center'),
                        subarea: setTextTableReactDom(egreso.subarea ? egreso.subarea.nombre : '', doubleClick, egreso, 'subarea', 'text-center'),
                        estatusCompra: setTextTableReactDom(egreso.estatus_compra ? egreso.estatus_compra.estatus : '', doubleClick, egreso, 'estatusCompra', 'text-center'),
                        adjuntos: setArrayTable(_aux),
                        fecha: setDateTableReactDom(egreso.created_at, doubleClick, egreso, 'fecha', 'text-center'),
                        id: egreso.id,
                        objeto: egreso
                    }
                )
                return false
            })
        return aux
    }

    const setActions = egreso => {
        const { history } = props
        return (
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >
                    <Dropdown.Item className="text-hover-success dropdown-success" onClick={(e) => { e.preventDefault(); 
                        history.push({ pathname: '/administracion/egresos/edit', state: { egreso: egreso } }) }} >
                        {setNaviIcon('flaticon2-pen', 'editar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-danger dropdown-danger" onClick={(e) => { e.preventDefault(); deleteAlert('¿DESEAS CONTINUAR?', `ELIMINARÁS EL EGRESO CON IDENTIFICADOR: ${egreso.id}`, () => deleteEgresoAxios(egreso.id)) }}>
                        {setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={(e) => { e.preventDefault(); openModalSee(egreso) }}>
                        {setNaviIcon('flaticon2-magnifier-tool', 'Ver egreso')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-info dropdown-info" onClick={(e) => { e.preventDefault(); openModalAdjuntos(egreso) }}>
                        {setNaviIcon('flaticon-attachment', 'Adjuntos')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-warning dropdown-warning" onClick={(e) => { e.preventDefault(); openFacturaExtranjera(egreso) }}>
                        {setNaviIcon('flaticon-interface-10', 'Factura extranjera')}
                    </Dropdown.Item>
                    {
                        egreso.factura ?
                            <Dropdown.Item className="text-hover-dark dropdown-dark" onClick={(e) => { e.preventDefault(); openModalFacturas(egreso) }}>
                                {setNaviIcon('flaticon2-download-1', 'Facturas')}
                            </Dropdown.Item>
                            : <></>
                    }
                </DropdownButton>
            </div>
        )
    }

    const setActionsPermiso = egreso => {
        const { history } = props
        return (
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >
                    <Dropdown.Item className="text-hover-success dropdown-success" onClick={(e) => { e.preventDefault(); 
                        history.push({ pathname: '/administracion/egresos/edit', state: { egreso: egreso } }) }} >
                        {setNaviIcon('flaticon2-pen', 'editar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-danger dropdown-danger" onClick={(e) => { e.preventDefault(); deleteAlert('¿DESEAS CONTINUAR?', `ELIMINARÁS EL EGRESO CON IDENTIFICADOR: ${egreso.id}`, () => deleteEgresoAxios(egreso.id)) }}>
                        {setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={(e) => { e.preventDefault(); openModalSee(egreso) }}>
                        {setNaviIcon('flaticon2-magnifier-tool', 'Ver egreso')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-info dropdown-info" onClick={(e) => { e.preventDefault(); openModalAdjuntos(egreso) }}>
                        {setNaviIcon('flaticon-attachment', 'Adjuntos')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-warning dropdown-warning" onClick={(e) => { e.preventDefault(); openFacturaExtranjera(egreso) }}>
                        {setNaviIcon('flaticon-interface-10', 'Factura extranjera')}
                    </Dropdown.Item>
                    {
                        egreso.factura ?
                            <Dropdown.Item className="text-hover-dark dropdown-dark" onClick={(e) => { e.preventDefault(); openModalFacturas(egreso) }}>
                                {setNaviIcon('flaticon2-download-1', 'Facturas')}
                            </Dropdown.Item>
                            : <></>
                    }
                </DropdownButton>
            </div>
        )
    }

    const openModalSee = async (egreso) => {
        waitAlert()
        apiGet(`v2/administracion/egresos/${egreso.id}`, authUser.access_token).then(
            (response) => {
                const { egreso } = response.data
                const { modal } = state
                modal.see = true
                Swal.close()
                setState({ ...state, modal, egreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    const openModalAdjuntos = async (egreso) => {
        waitAlert()
        apiGet(`v2/administracion/egresos/adjuntos/${egreso.id}`, authUser.access_token).then(
            (response) => {
                const { egreso } = response.data
                let { form } = state
                const { modal } = state
                form = revertForm(egreso)
                Swal.close()
                modal.adjuntos = true
                setState({ ...state, form, modal, egreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    const openFacturaExtranjera = async (egreso) => {
        waitAlert()
        apiGet(`v2/administracion/egresos/adjuntos/${egreso.id}`, authUser.access_token).then(
            (response) => {
                let { form } = state
                const { egreso } = response.data
                const { modal } = state
                form = revertForm(egreso)
                modal.facturaExtranjera = true
                Swal.close()
                setState({ ...state, form, modal, egreso })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    const openModalFacturas = async (egreso) => {
        const { modal } = state
        modal.facturas = true
        setState({ ...state, modal, egreso:egreso })
    }

    const openModalFiltros = () => {
        const { modal } = state
        modal.filters = true
        setState({ ...state, modal })
    }

    const openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿SEGURO DESEAS BORRAR EL ADJUNTO?', adjunto.name, () => { waitAlert(); deleteAdjuntoAxios(adjunto.id) })
    }

    const handleClose = () => {
        const { modal, data } = state
        data.adjuntos = []
        modal.see = false
        modal.adjuntos = false
        modal.facturaExtranjera = false
        modal.download = false
        modal.filters = false
        modal.facturas = false
        
        setState({
            ...state,
            data,
            modal,
            egreso: '',
            facturas: [],
            adjuntos: [],
            form: clearForm()
        })
    }

    const reloadTableFacturas = () => {
        const { filters } = state
        reloadTable(filters)
    }

    async function deleteEgresoAxios(id) {
        apiDelete(`egresos/${id}`, authUser.access_token).then(
            (response) => {
                const { filters } = state
                setState({
                    ...state,
                    egreso: '',
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue eliminado con éxito.', () => { reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }    

    const exportEgresosAxios = async () => {
        waitAlert()
        const { filters } = state
        apiPostFormResponseBlob(`v3/administracion/egresos/exportar`, { columnas: filters }, authUser.access_token).then(
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

    const attachFiles = async(files, item) => {
        waitAlert()
        const { egreso } = state
        apiGet(`v1/constant/admin-proyectos`, authUser.access_token).then(
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
                Promise.all(auxPromises).then(values => { attachFilesS3(values, item)}).catch(err => console.error(err)) 
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    const attachFilesS3 = async(files, item) => {
        const { egreso, filters } = state
        apiPutForm(`v3/administracion/egresos/${egreso.id}/archivos/s3`, { archivos: files }, authUser.access_token ).then(
            ( response ) => {
                doneAlert(`Archivos adjuntados con éxito`, 
                    () => { 
                        switch(item){
                            case 'presupuesto':
                            case 'pago':
                                openModalAdjuntos(egreso)         
                                break;
                            case 'facturas_pdf':
                                openFacturaExtranjera(egreso) 
                                reloadTable(filters)
                                break;
                            default: break;
                        }
                        
                    }
                )
            }, ( error ) => { printResponseErrorAlert( error ) }
        ).catch( ( error ) => { catchErrors( error ) } )
    }

    const deleteAdjuntoAxios = async (id) => {
        const { egreso } = state
        apiDelete(`v2/administracion/egresos/${egreso.id}/adjuntos/${id}`, authUser.access_token).then(
            (response) => {
                const { egreso } = response.data
                let { form } = state
                const { filters } = state
                form = revertForm(egreso)
                setState({ ...state, form })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.', () => { reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    const doubleClick = (data, tipo) => {
        const { form, options } = state
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

        setState({ form, options })

        customInputAlert(
            <div>
                <h2 className='swal2-title mb-4 mt-2'> {printSwalHeader(tipo)} </h2>
                {
                    tipo === 'descripcion' &&
                    <InputGray withtaglabel={0} withtextlabel={0} withplaceholder={0} withicon={0}
                        requirevalidation={0} value={form[tipo]} name={tipo} rows={6} as='textarea'
                        onChange={(e) => { onChangeSwal(e.target.value, tipo) }} swal={true} />
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
                                onChange={(e) => { onChangeSwal(e.target.value, tipo) }} name={tipo}
                                defaultValue={form[tipo]} as="select">
                                <option value={0}>{setSwalPlaceholder(tipo)}</option>
                                {setOptions(data, tipo).map((tipo, key) => { return (<option key={key} value={tipo.value} className="bg-white" >{tipo.text}</option>) })}
                            </Form.Control>
                        </div>
                        : <></>
                }
                {
                    tipo === 'fecha' ?
                        <CalendarDaySwal value={form[tipo]} onChange={(e) => { onChangeSwal(e.target.value, tipo) }} name={tipo} date={form[tipo]} withformgroup={0} />
                        : <></>
                }
                {
                    tipo === 'subarea' ?
                        flag ?
                            <DoubleSelectSearchGray options={options} form={form} onChange={onChangeSwal}
                                one={{ placeholder: 'SELECCIONA EL ÁREA', name: 'area', opciones: 'areas' }}
                                two={{ placeholder: 'SELECCIONA EL SUBÁREA', name: 'subarea', opciones: 'subareas' }} />
                            :
                            <SelectSearchGray options={options.subareas} placeholder='Selecciona el subárea' value={form.subarea}
                                onChange={(value) => { onChangeSwal(value, tipo) }} withtaglabel={1}
                                name={tipo} customdiv="mb-3" withicon={1} />
                        : ''
                }
                {
                    tipo === 'area' &&
                    <DoubleSelectSearchGray options={options} form={form} onChange={onChangeSwal}
                        one={{ placeholder: 'SELECCIONA EL ÁREA', name: 'area', opciones: 'areas' }}
                        two={{ placeholder: 'SELECCIONA EL SUBÁREA', name: 'subarea', opciones: 'subareas' }} />
                }
            </div>,
            <Update />,
            () => { patchEgresos(data, tipo, flag) },
            () => { setState({ ...state, form: clearForm() }); Swal.close(); },
        )
    }

    const setSwalPlaceholder = (tipo) => {
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

    const onChangeSwal = (value, tipo) => {
        const { form } = state
        form[tipo] = value
        setState({ ...state, form })
    }

    const setOptions = (data, tipo) => {
        const { options } = state
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

    const patchEgresos = async (data, tipo, flag) => {
        const { form, filters } = state
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
        apiPutForm(`v2/administracion/egresos/${newType}/${data.id}`, { value: value }, authUser.access_token).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.', () => { reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    const setOptionsArray = (name, array) => {
        const { options } = state
        options[name] = setOptionsWithLabel(array, 'nombre', 'id')
        setState({ ...state, options })
    }

    const sendFilters = filter => {
        const { modal } = state
        modal.filters = false
        setState({
            ...state,
            filters: filter,
            modal
        })
        reloadTable(filter)
    }

    const reloadTable = (filter) => {
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

    const revertForm = (egreso) => {
        const { form } = state
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

    const controlledTab = value => {
        setState({
            ...state,
            key: value
        })
    }
    const tabs = ['r. compras', 'r. contabilidad', 'requisiciones']

    let prop = {
        pathname: '/administracion/egresos',
    }

    return (
        <Layout authUser={authUser.acces_token} location={prop} history={{ location: prop }} active='administracion'>

            <Tabs id="tabAdministracion" defaultActiveKey="gastos" activeKey={state.key} onSelect = {(value) => {controlledTab(value)}}>

                <Tab eventKey = { 'gastos' } title = { 'gastos' }>

                    {/* <Table
                        titulo="Gastos" 
                        subtitle='Listado de gastos'
                        columnas={columnas}
                        url={'v3/administracion/gastos'}  
                        numItemsPagina={12}
                        ProccessData={proccessData}
                        // opciones={handleOpen}
                        // acciones={acciones()}
                        // reload={setReloadTable}
                        >
                    </Table>  */}

                    <TablaGeneralPaginado 
                        titulo="Gastos"
                        url={'v3/administracion/gastos'}
                        columnas={columnas}
                        numItemsPagina={20}
                        ProccessData={proccessData}
                        // opciones={handleOpen}
                        // acciones={acciones()}
                        // reload={setReloadTable}
                    />  

                    {/* <NewTable
                        tableName='egresos'
                        // tableName='gastos'
                        subtitle='Listado de gastos'
                        title='Gastos'
                        mostrar_boton={true}
                        abrir_modal={false}
                        accessToken={authUser.access_token}
                        columns={EGRESOS_COLUMNS}
                        setter={proccessData}
                        url='/administracion/egresos/add'
                        urlRender={`${URL_DEV}v3/administracion/egreso`}
                        filterClick={openModalFiltros}
                        exportar_boton={true}
                        onClickExport={() => { exportEgresosAxios() }}
                    /> */}

                    
                </Tab> 

                <Tab eventKey="requisiciones" title="requisiciones">
                    <Requisiciones/>
                </Tab>

                <Tab eventKey="requisición compras" title="requisición compras">
                    <RequisicionCompras/>
                </Tab>

                <Tab eventKey="requisición contabilidad" title="requisición contabilidad">
                    <RequisicionContabilidad/>
                </Tab>

            </Tabs>

            <Modal size="xl" title={"Facturas"} show={state.modal.facturas} handleClose={handleClose} >
                <FacturasFormTable at={authUser.access_token } tipo_factura='egresos' id={state.egreso.id} dato={state.egreso} reloadTable = {reloadTableFacturas}/>
            </Modal>
            <Modal size="xl" title={"Adjuntos"} show={state.modal.adjuntos} handleClose={handleClose}>
                <AdjuntosForm form={state.form} onChangeAdjunto={handleChange}
                    clearFiles={clearFiles} deleteFile={openModalDeleteAdjuntos} />
            </Modal>
            <Modal size="lg" title="Egreso" show={state.modal.see} handleClose={handleClose} >
                <EgresosCard egreso={state.egreso} areas={areas} />
            </Modal>
            <Modal size="lg" title="Factura extranjera" show={state.modal.facturaExtranjera} handleClose={handleClose} >
                <FacturaExtranjera form={state.form} onChangeAdjunto={handleChange} deleteFile={openModalDeleteAdjuntos} />
            </Modal>
            <Modal size='xl' show={state.modal.filters} handleClose={handleClose} title='Filtros'>
                <EngresosFilters at={authUser.access_token} sendFilters={sendFilters} filters={state.filters} options={state.options} setOptions={setOptionsArray} areas={areas} />
            </Modal>
        </Layout>
    )
}











// class Egresos extends Component {
//     state = {
//         modal: {
//             see: false,
//             facturas: false,
//             adjuntos: false,
//             facturaExtranjera: false,
//             filters: false,
//             download: false
//         },
//         egresos: [],
//         egresosAux: [],
//         title: 'Nuevo egreso',
//         egreso: '',
//         data: {
//             proveedores: [],
//             empresas: [],
//             egresos: [],
//             adjuntos: []
//         },
//         form: {
//             formaPago: '',
//             fechaInicio: new Date(),
//             fechaFin: new Date(),
//             metodoPago: '',
//             estatusFactura: '',
//             facturaObject: '',
//             estatusCompra: 0,
//             adjuntos: {
//                 factura: {
//                     value: '',
//                     placeholder: 'Factura',
//                     files: []
//                 },
//                 pago: {
//                     value: '',
//                     placeholder: 'Pago',
//                     files: []
//                 },
//                 presupuesto: {
//                     value: '',
//                     placeholder: 'Presupuesto',
//                     files: []
//                 },
//                 facturas_pdf: {
//                     value: '',
//                     placeholder: 'Factura extranjera',
//                     files: []
//                 }
//             }
//         },
//         options: {
//             formasPagos: [],
//             metodosPagos: [],
//             estatusFacturas: [],
//             estatusCompras: [],
//             allCuentas: []
//         },
//         filters: {},
//         key: 'gastos'
//     }

//     componentDidMount() {
//         const { authUser: { user: { permisos } } } = this.props
//         const { history: { location: { pathname } } } = this.props
//         const { history } = this.props
//         const egresos = permisos.find(function (element, index) {
//             const { modulo: { url } } = element
//             return pathname === url
//         });
//         if (!egresos)
//             history.push('/')
//         this.getOptionsAxios()
//         let queryString = this.props.history.location.search
//         if (queryString) {
//             let params = new URLSearchParams(queryString)
//             let id = parseInt(params.get("id"))
//             if (id) {
//                 const { modal, filters } = this.state
//                 filters.identificador = id
//                 modal.see = true
//                 this.setState({ ...this.state, modal, filters })
//                 this.reloadTable(filters)
//                 this.getEgresoAxios(id)
//             }
//         }
//     }

//     getOptionsAxios = async () => {
//         waitAlert()
//         const { access_token } = this.props.authUser
//         apiOptions(`v2/administracion/egresos`, access_token).then(
//             (response) => {
//                 const { data, options } = this.state
//                 const { proveedores, empresas, estatusCompras, areas, tiposPagos, tiposImpuestos, cuentas } = response.data
//                 data.proveedores = proveedores
//                 data.empresas = empresas
//                 options['estatusCompras'] = setSelectOptions(estatusCompras, 'estatus')
//                 options['empresas'] = setOptionsWithLabel(empresas, 'name', 'id')
//                 options['areas'] = setOptionsWithLabel(areas, 'nombre', 'id')
//                 options['proveedores'] = setOptionsWithLabel(proveedores, 'razon_social', 'id')
//                 options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
//                 options['tiposImpuestos'] = setSelectOptions(tiposImpuestos, 'tipo')
//                 options.allCuentas = setOptionsWithLabel(cuentas, 'nombre', 'id')
//                 Swal.close()
//                 this.setState({ ...this.state, data, options })
//             }, (error) => { printResponseErrorAlert(error) }
//         ).catch((error) => { catchErrors(error) })
//     }
//     async getEgresoAxios(id) {
//         const { access_token } = this.props.authUser
//         apiGet(`egresos/single/${id}`, access_token).then(
//             (response) => {
//                 const { egreso } = response.data
//                 this.setState({
//                     ...this.state,
//                     egreso: egreso
//                 })
//             }, (error) => { printResponseErrorAlert(error) }
//         ).catch((error) => { catchErrors(error) })
//     }
//     clearForm = () => {
//         const { form } = this.state
//         let aux = Object.keys(form)
//         aux.map((element) => {
//             switch (element) {
//                 case 'adjuntos':
//                     form[element] = {
//                         factura: {
//                             value: '',
//                             placeholder: 'Factura',
//                             files: []
//                         },
//                         pago: {
//                             value: '',
//                             placeholder: 'Pago',
//                             files: []
//                         },
//                         presupuesto: {
//                             value: '',
//                             placeholder: 'Presupuesto',
//                             files: []
//                         },
//                         facturas_pdf: {
//                             value: '',
//                             placeholder: 'Factura extranjera',
//                             files: []
//                         }
//                     }
//                     break;
//                 case 'estatusCompra':
//                     form[element] = 0
//                     break;
//                 case 'fechaInicio':
//                 case 'fechaFin':
//                     form[element] = new Date()
//                     break;
//                 default:
//                     form[element] = ''
//                     break;
//             }
//             return false
//         })
//         return form;
//     }
//     handleChange = (files, item) => {
//         const { form } = this.state
//         let aux = form.adjuntos[item].files
//         for (let counter = 0; counter < files.length; counter++) {
//             aux.push(
//                 {
//                     name: files[counter].name,
//                     file: files[counter],
//                     url: URL.createObjectURL(files[counter]),
//                     key: counter
//                 }
//             )
//         }
//         form.adjuntos[item].value = files
//         form.adjuntos[item].files = aux
//         this.setState({ ...this.state, form })
//         createAlertSA2WithActionOnClose(
//             '¿DESEAS AGREGAR EL ARCHIVO?',
//             '',
//             () => this.attachFiles(files, item),
//             () => this.cleanAdjuntos(item)
//         )
//     }
//     cleanAdjuntos = (item) => {
//         const { form } = this.state
//         let aux = []
//         form.adjuntos[item].files.map((file) => {
//             if (file.id) aux.push(file)
//             return ''
//         })
//         form.adjuntos[item].value = ''
//         form.adjuntos[item].files = aux
//         this.setState({ ...this.state, form })
//     }
    
//     clearFiles = (name, key) => {
//         const { form } = this.state
//         let aux = []
//         for (let counter = 0; counter < form['adjuntos'][name].files.length; counter++) {
//             if (counter !== key) {
//                 aux.push(form['adjuntos'][name].files[counter])
//             }
//         }
//         if (aux.length < 1) {
//             form['adjuntos'][name].value = ''
//             if (name === 'factura')
//                 form['facturaObject'] = ''
//         }
//         form['adjuntos'][name].files = aux
//         this.setState({
//             ...this.state,
//             form
//         })
//     }
//     setEgresos = egresos => {
//         let aux = []
//         let _aux = []
//         if (egresos)
//             egresos.map((egreso) => {
//                 _aux = []
//                 if (egreso.presupuestos) {
//                     egreso.presupuestos.map((presupuesto) => {
//                         _aux.push({
//                             name: 'Presupuesto', text: presupuesto.name, url: presupuesto.url
//                         })
//                         return false
//                     })
//                 }
//                 if (egreso.pagos) {
//                     egreso.pagos.map((pago) => {
//                         _aux.push({
//                             name: 'Pago', text: pago.name, url: pago.url
//                         })
//                         return false
//                     })
//                 }
//                 aux.push(
//                     {
//                         actions: this.setActions(egreso),
//                         identificador: setTextTableCenter(egreso.id),
//                         cuenta: setArrayTable(
//                             [
//                                 { name: 'Empresa', text: egreso.empresa ? egreso.empresa.name : '' },
//                                 { name: 'Cuenta', text: egreso.cuenta ? egreso.cuenta.nombre : '' },
//                                 { name: 'No. de cuenta', text: egreso.cuenta ? egreso.cuenta.numero : '' }
//                             ], '250px'
//                         ),
//                         proveedor: setTextTable(egreso.proveedor ? egreso.proveedor.razon_social : ''),
//                         factura: setTextTableCenter(egreso.factura ? 'Con factura' : 'Sin factura'),
//                         monto: setMoneyTable(egreso.monto),
//                         comision: setMoneyTable(egreso.comision ? egreso.comision : 0.0),
//                         total: setMoneyTable(egreso.total),
//                         impuesto: setTextTableReactDom(egreso.tipo_impuesto ? egreso.tipo_impuesto.tipo : 'Sin definir', this.doubleClick, egreso, 'tipoImpuesto', 'text-center'),
//                         tipoPago: setTextTableReactDom(egreso.tipo_pago.tipo, this.doubleClick, egreso, 'tipoPago', 'text-center'),
//                         descripcion: setTextTableReactDom(egreso.descripcion !== null ? egreso.descripcion : '', this.doubleClick, egreso, 'descripcion', 'text-justify'),
//                         area: setTextTableReactDom(egreso.area ? egreso.area.nombre : '', this.doubleClick, egreso, 'area', 'text-center'),
//                         subarea: setTextTableReactDom(egreso.subarea ? egreso.subarea.nombre : '', this.doubleClick, egreso, 'subarea', 'text-center'),
//                         estatusCompra: setTextTableReactDom(egreso.estatus_compra ? egreso.estatus_compra.estatus : '', this.doubleClick, egreso, 'estatusCompra', 'text-center'),
//                         adjuntos: setArrayTable(_aux),
//                         fecha: setDateTableReactDom(egreso.created_at, this.doubleClick, egreso, 'fecha', 'text-center'),
//                         id: egreso.id,
//                         objeto: egreso
//                     }
//                 )
//                 return false
//             })
//         return aux
//     }

//     setActions = egreso => {
//         const { history } = this.props
//         return (
//             <div className="w-100 d-flex justify-content-center">
//                 <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >
//                     <Dropdown.Item className="text-hover-success dropdown-success" onClick={(e) => { e.preventDefault(); 
//                         history.push({ pathname: '/administracion/egresos/edit', state: { egreso: egreso } }) }} >
//                         {setNaviIcon('flaticon2-pen', 'editar')}
//                     </Dropdown.Item>
//                     <Dropdown.Item className="text-hover-danger dropdown-danger" onClick={(e) => { e.preventDefault(); deleteAlert('¿DESEAS CONTINUAR?', `ELIMINARÁS EL EGRESO CON IDENTIFICADOR: ${egreso.id}`, () => this.deleteEgresoAxios(egreso.id)) }}>
//                         {setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
//                     </Dropdown.Item>
//                     <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={(e) => { e.preventDefault(); this.openModalSee(egreso) }}>
//                         {setNaviIcon('flaticon2-magnifier-tool', 'Ver egreso')}
//                     </Dropdown.Item>
//                     <Dropdown.Item className="text-hover-info dropdown-info" onClick={(e) => { e.preventDefault(); this.openModalAdjuntos(egreso) }}>
//                         {setNaviIcon('flaticon-attachment', 'Adjuntos')}
//                     </Dropdown.Item>
//                     <Dropdown.Item className="text-hover-warning dropdown-warning" onClick={(e) => { e.preventDefault(); this.openFacturaExtranjera(egreso) }}>
//                         {setNaviIcon('flaticon-interface-10', 'Factura extranjera')}
//                     </Dropdown.Item>
//                     {
//                         egreso.factura ?
//                             <Dropdown.Item className="text-hover-dark dropdown-dark" onClick={(e) => { e.preventDefault(); this.openModalFacturas(egreso) }}>
//                                 {setNaviIcon('flaticon2-download-1', 'Facturas')}
//                             </Dropdown.Item>
//                             : <></>
//                     }
//                 </DropdownButton>
//             </div>
//         )
//     }
//     setActionsPermiso = egreso => {
//         const { history } = this.props
//         return (
//             <div className="w-100 d-flex justify-content-center">
//                 <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >
//                     <Dropdown.Item className="text-hover-success dropdown-success" onClick={(e) => { e.preventDefault(); 
//                         history.push({ pathname: '/administracion/egresos/edit', state: { egreso: egreso } }) }} >
//                         {setNaviIcon('flaticon2-pen', 'editar')}
//                     </Dropdown.Item>
//                     <Dropdown.Item className="text-hover-danger dropdown-danger" onClick={(e) => { e.preventDefault(); deleteAlert('¿DESEAS CONTINUAR?', `ELIMINARÁS EL EGRESO CON IDENTIFICADOR: ${egreso.id}`, () => this.deleteEgresoAxios(egreso.id)) }}>
//                         {setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
//                     </Dropdown.Item>
//                     <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={(e) => { e.preventDefault(); this.openModalSee(egreso) }}>
//                         {setNaviIcon('flaticon2-magnifier-tool', 'Ver egreso')}
//                     </Dropdown.Item>
//                     <Dropdown.Item className="text-hover-info dropdown-info" onClick={(e) => { e.preventDefault(); this.openModalAdjuntos(egreso) }}>
//                         {setNaviIcon('flaticon-attachment', 'Adjuntos')}
//                     </Dropdown.Item>
//                     <Dropdown.Item className="text-hover-warning dropdown-warning" onClick={(e) => { e.preventDefault(); this.openFacturaExtranjera(egreso) }}>
//                         {setNaviIcon('flaticon-interface-10', 'Factura extranjera')}
//                     </Dropdown.Item>
//                     {
//                         egreso.factura ?
//                             <Dropdown.Item className="text-hover-dark dropdown-dark" onClick={(e) => { e.preventDefault(); this.openModalFacturas(egreso) }}>
//                                 {setNaviIcon('flaticon2-download-1', 'Facturas')}
//                             </Dropdown.Item>
//                             : <></>
//                     }
//                 </DropdownButton>
//             </div>
//         )
//     }
//     openModalSee = async (egreso) => {
//         waitAlert()
//         const { access_token } = this.props.authUser
//         apiGet(`v2/administracion/egresos/${egreso.id}`, access_token).then(
//             (response) => {
//                 const { egreso } = response.data
//                 const { modal } = this.state
//                 modal.see = true
//                 Swal.close()
//                 this.setState({ ...this.state, modal, egreso })
//             }, (error) => { printResponseErrorAlert(error) }
//         ).catch((error) => { catchErrors(error) })
//     }
//     openModalAdjuntos = async (egreso) => {
//         waitAlert()
//         const { access_token } = this.props.authUser
//         apiGet(`v2/administracion/egresos/adjuntos/${egreso.id}`, access_token).then(
//             (response) => {
//                 const { egreso } = response.data
//                 let { form } = this.state
//                 const { modal } = this.state
//                 form = this.revertForm(egreso)
//                 Swal.close()
//                 modal.adjuntos = true
//                 this.setState({ ...this.state, form, modal, egreso })
//             }, (error) => { printResponseErrorAlert(error) }
//         ).catch((error) => { catchErrors(error) })
//     }
//     openFacturaExtranjera = async (egreso) => {
//         waitAlert()
//         const { access_token } = this.props.authUser
//         apiGet(`v2/administracion/egresos/adjuntos/${egreso.id}`, access_token).then(
//             (response) => {
//                 let { form } = this.state
//                 const { egreso } = response.data
//                 const { modal } = this.state
//                 form = this.revertForm(egreso)
//                 modal.facturaExtranjera = true
//                 Swal.close()
//                 this.setState({ ...this.state, form, modal, egreso })
//             }, (error) => { printResponseErrorAlert(error) }
//         ).catch((error) => { catchErrors(error) })
//     }
//     openModalFacturas = async (egreso) => {
//         const { modal } = this.state
//         modal.facturas = true
//         this.setState({ ...this.state, modal, egreso:egreso })
//     }
//     openModalFiltros = () => {
//         const { modal } = this.state
//         modal.filters = true
//         this.setState({ ...this.state, modal })
//     }
//     openModalDeleteAdjuntos = adjunto => {
//         deleteAlert('¿SEGURO DESEAS BORRAR EL ADJUNTO?', adjunto.name, () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) })
//     }
//     handleClose = () => {
//         const { modal, data } = this.state
//         data.adjuntos = []
//         modal.see = false
//         modal.adjuntos = false
//         modal.facturaExtranjera = false
//         modal.download = false
//         modal.filters = false
//         modal.facturas = false
        
//         this.setState({
//             ...this.state,
//             data,
//             modal,
//             egreso: '',
//             facturas: [],
//             adjuntos: [],
//             form: this.clearForm()
//         })
//     }
//     reloadTableFacturas = () => {
//         const { filters } = this.state
//         this.reloadTable(filters)
//     }
//     async deleteEgresoAxios(id) {
//         const { access_token } = this.props.authUser
//         apiDelete(`egresos/${id}`, access_token).then(
//             (response) => {
//                 const { filters } = this.state
//                 this.setState({
//                     ...this.state,
//                     egreso: '',
//                 })
//                 doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue eliminado con éxito.', () => { this.reloadTable(filters) })
//             }, (error) => { printResponseErrorAlert(error) }
//         ).catch((error) => { catchErrors(error) })
//     }    
//     exportEgresosAxios = async () => {
//         waitAlert()
//         const { filters } = this.state
//         const { access_token } = this.props.authUser
//         apiPostFormResponseBlob(`v3/administracion/egresos/exportar`, { columnas: filters }, access_token).then(
//             (response) => {
//                 const url = window.URL.createObjectURL(new Blob([response.data]));
//                 const link = document.createElement('a');
//                 link.href = url;
//                 link.setAttribute('download', 'egresos.xlsx');
//                 document.body.appendChild(link);
//                 link.click();
//                 doneAlert(
//                     response.data.message !== undefined ? 
//                         response.data.message 
//                     : 'Ingresos exportados con éxito.'
//                 )
//             }, (error) => { printResponseErrorAlert(error) }
//         ).catch((error) => { catchErrors(error) })
//     }
//     attachFiles = async(files, item) => {
//         waitAlert()
//         const { egreso } = this.state
//         const { access_token } = this.props.authUser
//         apiGet(`v1/constant/admin-proyectos`, access_token).then(
//             (response) => {
//                 const { alma } = response.data
//                 let filePath = `egresos/${egreso.id}/`
//                 let aux = ''
//                 switch(item){
//                     case 'presupuesto':
//                     case 'pago':
//                         aux = files.map( ( file ) => {
//                             return {
//                                 name: `${filePath}${item}s/${Math.floor(Date.now() / 1000)}-${file.name}`,
//                                 file: file,
//                                 tipo: item
//                             }
//                         })
//                         break;
//                     case 'facturas_pdf':
//                         aux = files.map( ( file ) => {
//                             return {
//                                 name: `${filePath}facturas-extranjeras/${Math.floor(Date.now() / 1000)}-${file.name}`,
//                                 file: file,
//                                 tipo: 'factura-extranjera'
//                             }
//                         })
//                         break;
//                     default: break;
//                 }
//                 let auxPromises  = aux.map((file) => {
//                     return new Promise((resolve, reject) => {
//                         new S3(alma).uploadFile(file.file, file.name)
//                             .then((data) =>{
//                                 const { location,status } = data
//                                 if(status === 204) resolve({ name: file.name, url: location, tipo: file.tipo })
//                                 else reject(data)
//                             })
//                             .catch((error) => {
//                                 catchErrors(error)
//                                 errorAlert(`Ocurrió un error al subir el archivo ${file.name}`)
//                                 reject(error)
//                             })
//                     })
//                 })
//                 Promise.all(auxPromises).then(values => { this.attachFilesS3(values, item)}).catch(err => console.error(err)) 
//             }, (error) => { printResponseErrorAlert(error) }
//         ).catch((error) => { catchErrors(error) })
//     }

//     attachFilesS3 = async(files, item) => {
//         const { egreso, filters } = this.state
//         const { access_token } = this.props.authUser
//         apiPutForm( `v3/administracion/egresos/${egreso.id}/archivos/s3`, { archivos: files }, access_token ).then(
//             ( response ) => {
//                 doneAlert(`Archivos adjuntados con éxito`, 
//                     () => { 
//                         switch(item){
//                             case 'presupuesto':
//                             case 'pago':
//                                 this.openModalAdjuntos(egreso)         
//                                 break;
//                             case 'facturas_pdf':
//                                 this.openFacturaExtranjera(egreso) 
//                                 this.reloadTable(filters)
//                                 break;
//                             default: break;
//                         }
                        
//                     }
//                 )
//             }, ( error ) => { printResponseErrorAlert( error ) }
//         ).catch( ( error ) => { catchErrors( error ) } )
//     }
//     deleteAdjuntoAxios = async (id) => {
//         const { access_token } = this.props.authUser
//         const { egreso } = this.state
//         apiDelete(`v2/administracion/egresos/${egreso.id}/adjuntos/${id}`, access_token).then(
//             (response) => {
//                 const { egreso } = response.data
//                 let { form } = this.state
//                 const { filters } = this.state
//                 form = this.revertForm(egreso)
//                 this.setState({ ...this.state, form })
//                 doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.', () => { this.reloadTable(filters) })
//             }, (error) => { printResponseErrorAlert(error) }
//         ).catch((error) => { catchErrors(error) })
//     }
//     doubleClick = (data, tipo) => {
//         const { form, options } = this.state
//         let busqueda = undefined
//         let flag = false
//         switch (tipo) {
//             case 'subarea':
//                 options.subareas = []
//                 flag = false
//                 if (data.area) {
//                     busqueda = options.areas.find((elemento) => { return elemento.value === data.area.id.toString() })
//                     if (busqueda) {
//                         options.subareas = setOptions(busqueda.subareas, 'nombre', 'id')
//                         if (data.subarea) {
//                             busqueda = options.subareas.find((elemento) => { return elemento.value === data.subarea.id.toString() })
//                             if (busqueda) { form.subarea = busqueda.value }
//                         }
//                     }
//                 } else {
//                     flag = true
//                     if (data.area) {
//                         form.area = data.area.id.toString()
//                         options.subareas = setOptions(data.area.subareas, 'nombre', 'id')
//                     }
//                     if (data.subarea) {
//                         busqueda = options.subareas.find((elemento) => { return elemento.value === data.subarea.id.toString() })
//                         if (busqueda) form.subarea = data.subarea.id.toString()
//                     }
//                 }
//                 break
//             case 'area':
//                 options.subareas = []
//                 if (data.area) {
//                     form.area = data.area.id.toString()
//                     options.subareas = setOptions(data.area.subareas, 'nombre', 'id')
//                 }
//                 if (data.subarea) {
//                     busqueda = options.subareas.find((elemento) => { return elemento.value === data.subarea.id.toString() })
//                     if (busqueda) form.subarea = data.subarea.id.toString()
//                 }
//                 break
//             case 'fecha':
//                 form.fecha = new Date(data.created_at)
//                 break
//             case 'tipoImpuesto':
//                 if (data.tipo_impuesto)
//                     form[tipo] = data.tipo_impuesto.id
//                 break
//             case 'tipoPago':
//                 if (data.tipo_pago)
//                     form[tipo] = data.tipo_pago.id
//                 break
//             case 'estatusCompra':
//                 if (data.estatus_compra)
//                     form[tipo] = data.estatus_compra.id
//                 break
//             default:
//                 form[tipo] = data[tipo]
//                 break
//         }
//         this.setState({ form, options })
//         customInputAlert(
//             <div>
//                 <h2 className='swal2-title mb-4 mt-2'> {printSwalHeader(tipo)} </h2>
//                 {
//                     tipo === 'descripcion' &&
//                     <InputGray withtaglabel={0} withtextlabel={0} withplaceholder={0} withicon={0}
//                         requirevalidation={0} value={form[tipo]} name={tipo} rows={6} as='textarea'
//                         onChange={(e) => { this.onChangeSwal(e.target.value, tipo) }} swal={true} />
//                 }
//                 {
//                     (tipo === 'tipoImpuesto') || (tipo === 'tipoPago') || (tipo === 'estatusCompra') ?
//                         <div className="input-icon my-3">
//                             <span className="input-icon input-icon-right">
//                                 <span>
//                                     <i className={"flaticon2-search-1 icon-md text-dark-50"}></i>
//                                 </span>
//                             </span>
//                             <Form.Control className="form-control text-uppercase form-control-solid"
//                                 onChange={(e) => { this.onChangeSwal(e.target.value, tipo) }} name={tipo}
//                                 defaultValue={form[tipo]} as="select">
//                                 <option value={0}>{this.setSwalPlaceholder(tipo)}</option>
//                                 {this.setOptions(data, tipo).map((tipo, key) => { return (<option key={key} value={tipo.value} className="bg-white" >{tipo.text}</option>) })}
//                             </Form.Control>
//                         </div>
//                         : <></>
//                 }
//                 {
//                     tipo === 'fecha' ?
//                         <CalendarDaySwal value={form[tipo]} onChange={(e) => { this.onChangeSwal(e.target.value, tipo) }} name={tipo} date={form[tipo]} withformgroup={0} />
//                         : <></>
//                 }
//                 {
//                     tipo === 'subarea' ?
//                         flag ?
//                             <DoubleSelectSearchGray options={options} form={form} onChange={this.onChangeSwal}
//                                 one={{ placeholder: 'SELECCIONA EL ÁREA', name: 'area', opciones: 'areas' }}
//                                 two={{ placeholder: 'SELECCIONA EL SUBÁREA', name: 'subarea', opciones: 'subareas' }} />
//                             :
//                             <SelectSearchGray options={options.subareas} placeholder='Selecciona el subárea' value={form.subarea}
//                                 onChange={(value) => { this.onChangeSwal(value, tipo) }} withtaglabel={1}
//                                 name={tipo} customdiv="mb-3" withicon={1} />
//                         : ''
//                 }
//                 {
//                     tipo === 'area' &&
//                     <DoubleSelectSearchGray options={options} form={form} onChange={this.onChangeSwal}
//                         one={{ placeholder: 'SELECCIONA EL ÁREA', name: 'area', opciones: 'areas' }}
//                         two={{ placeholder: 'SELECCIONA EL SUBÁREA', name: 'subarea', opciones: 'subareas' }} />
//                 }
//             </div>,
//             <Update />,
//             () => { this.patchEgresos(data, tipo, flag) },
//             () => { this.setState({ ...this.state, form: this.clearForm() }); Swal.close(); },
//         )
//     }
//     setSwalPlaceholder = (tipo) => {
//         switch (tipo) {
//             case 'tipoImpuesto':
//                 return 'SELECCIONA EL IMPUESTO'
//             case 'tipoPago':
//                 return 'SELECCIONA EL TIPO DE PAGO'
//             case 'estatusCompra':
//                 return 'SELECCIONA EL ESTATUS DE COMPRA'
//             default:
//                 return ''
//         }
//     }
//     onChangeSwal = (value, tipo) => {
//         const { form } = this.state
//         form[tipo] = value
//         this.setState({ ...this.state, form })
//     }
//     setOptions = (data, tipo) => {
//         const { options } = this.state
//         switch (tipo) {
//             case 'estatusCompra':
//                 return options.estatusCompras
//             case 'tipoPago':
//                 return options.tiposPagos
//             case 'tipoImpuesto':
//                 return options.tiposImpuestos
//             default: return []
//         }
//     }
//     patchEgresos = async (data, tipo, flag) => {
//         const { access_token } = this.props.authUser
//         const { form, filters } = this.state
//         let value = ''
//         let newType = tipo
//         switch (tipo) {
//             case 'area':
//                 value = { area: form.area, subarea: form.subarea }
//                 break
//             case 'subarea':
//                 if (flag === true) {
//                     value = { area: form.area, subarea: form.subarea }
//                     newType = 'area'
//                 } else {
//                     value = form[tipo]
//                 }
//                 break
//             default:
//                 value = form[tipo]
//                 break
//         }
//         waitAlert()
//         apiPutForm(`v2/administracion/egresos/${newType}/${data.id}`, { value: value }, access_token).then(
//             (response) => {
//                 doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.', () => { this.reloadTable(filters) })
//             }, (error) => { printResponseErrorAlert(error) }
//         ).catch((error) => { catchErrors(error) })
//     }
//     setOptionsArray = (name, array) => {
//         const { options } = this.state
//         options[name] = setOptionsWithLabel(array, 'nombre', 'id')
//         this.setState({ ...this.state, options })
//     }
//     sendFilters = filter => {
//         const { modal } = this.state
//         modal.filters = false
//         this.setState({
//             ...this.state,
//             filters: filter,
//             modal
//         })
//         this.reloadTable(filter)
//     }
//     reloadTable = (filter) => {
//         let arregloFilterKeys = Object.keys(filter)
//         let aux = {}
//         arregloFilterKeys.forEach((elemento) => {
//             switch(elemento){
//                 case 'area':
//                 case 'proveedor':
//                 case 'cuenta':
//                 case 'empresa':
//                 case 'estatusCompra':
//                 case 'proyecto':
//                 case 'subarea':
//                 case 'factura':
//                     aux[elemento] = {
//                         value: filter[elemento]['value'],
//                         name: filter[elemento]['name'],
//                     }
//                     break;
//                 default:
//                     aux[elemento] = filter[elemento]
//                     break;
//             }
//         })
//         $(`#egresos`).DataTable().search(JSON.stringify(aux)).draw();
//     }
//     revertForm = (egreso) => {
//         const { form } = this.state
//         form.adjuntos.pago.value = null
//         form.adjuntos.presupuesto.value = null
//         form.adjuntos.facturas_pdf.value = null
//         form.adjuntos.pago.files = []
//         form.adjuntos.presupuesto.files = []
//         form.adjuntos.facturas_pdf.files = []
//         egreso.pagos.forEach(element => {
//             form.adjuntos.pago.files.push(element);
//         });
//         egreso.presupuestos.forEach(element => {
//             form.adjuntos.presupuesto.files.push(element);
//         });
//         egreso.facturas_pdf.forEach(element => {
//             form.adjuntos.facturas_pdf.files.push(element);
//         });
//         return form
//     }
//     controlledTab = value => {
//         this.setState({
//             ...this.state,
//             key: value
//         })
//     }
//     render() {
//         const { form, options, egreso, modal, filters, key } = this.state
//         const { access_token } = this.props.authUser
//         const { areas } = this.props
//         const tabs = [ 'r. compras', 'r. contabilidad', 'requisiciones']

//         return (
//             <Layout active='administracion'  {...this.props}>

//                 <Tabs id = "tabAdministracion" defaultActiveKey = "gastos" activeKey = {key} onSelect = {(value) => {this.controlledTab(value)}}>

//                     <Tab eventKey = { 'gastos' } title = { 'gastos' }>

//                         <NewTable
//                             tableName='egresos'
//                             // tableName='gastos'
//                             subtitle='Listado de gastos'
//                             title='Gastos'
//                             mostrar_boton={true}
//                             abrir_modal={false}
//                             accessToken={access_token}
//                             columns={EGRESOS_COLUMNS}
//                             setter={this.setEgresos}
//                             url='/administracion/egresos/add'
//                             urlRender={`${URL_DEV}v3/administracion/egreso`}
//                             filterClick={this.openModalFiltros}
//                             exportar_boton={true}
//                             onClickExport={() => { this.exportEgresosAxios() }}
//                         />
//                     </Tab>

//                     <Tab eventKey="requisiciones" title="requisiciones">
//                         <Requisiciones/>
//                     </Tab>

//                     <Tab eventKey="requisición compras" title="requisición compras">
//                         <RequisicionCompras/>
//                     </Tab>

//                     <Tab eventKey="requisición contabilidad" title="requisición contabilidad">
//                         <RequisicionContabilidad/>
//                     </Tab>

//                 </Tabs>

//                 <Modal size="xl" title={"Facturas"} show={modal.facturas} handleClose={this.handleClose} >
//                     <FacturasFormTable at = { access_token } tipo_factura='egresos' id={egreso.id} dato={egreso} reloadTable = {this.reloadTableFacturas}/>
//                 </Modal>
//                 <Modal size="xl" title={"Adjuntos"} show={modal.adjuntos} handleClose={this.handleClose}>
//                     <AdjuntosForm form={form} onChangeAdjunto={this.handleChange}
//                         clearFiles={this.clearFiles} deleteFile={this.openModalDeleteAdjuntos} />
//                 </Modal>
//                 <Modal size="lg" title="Egreso" show={modal.see} handleClose={this.handleClose} >
//                     <EgresosCard egreso={egreso} areas={areas} />
//                 </Modal>
//                 <Modal size="lg" title="Factura extranjera" show={modal.facturaExtranjera} handleClose={this.handleClose} >
//                     <FacturaExtranjera form={form} onChangeAdjunto={this.handleChange} deleteFile={this.openModalDeleteAdjuntos} />
//                 </Modal>
//                 <Modal size='xl' show={modal.filters} handleClose={this.handleClose} title='Filtros'>
//                     <EngresosFilters at={access_token} sendFilters={this.sendFilters} filters={filters} options={options} setOptions={this.setOptionsArray} areas={areas} />
//                 </Modal>
//             </Layout>
//         )
//     }
// }

// const mapStateToProps = state => { return { authUser: state.authUser, areas: state.opciones.areas } }
// const mapDispatchToProps = dispatch => ({})

// export default connect(mapStateToProps, mapDispatchToProps)(Egresos);