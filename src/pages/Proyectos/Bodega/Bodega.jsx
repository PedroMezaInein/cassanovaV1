import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal, ItemSlider } from '../../../components/singles'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { URL_DEV, BODEGA_COLUMNS } from '../../../constants'
import { deleteAlert, doneAlert, errorAlert, printResponseErrorAlert, waitAlert, customInputAlert } from '../../../functions/alert'
import { setTextTableCenter, setTextTableReactDom, setOptions, setArrayTable } from '../../../functions/setters'
import { printSwalHeader } from '../../../functions/printers'
import axios from 'axios'
import { Button, InputGray } from '../../../components/form-components'
import { FormPrestamos, PestamosDevoluciones, HistorialHM } from '../../../components/forms'
import { Tab, Tabs } from 'react-bootstrap'
import { BodegaCard } from '../../../components/cards'
import { Update } from '../../../components/Lottie'
import Swal from 'sweetalert2'
import { SelectSearchGray } from '../../../components/form-components'
import $ from "jquery";
import { setFormHeader, setSingleHeader } from '../../../functions/routers'
import { toAbsoluteUrl } from "../../../functions/routers"
import SVG from "react-inlinesvg";
class Bodega extends Component {
    state = {
        modalDelete: false,
        modalAdjuntos: false,
        modalPrestamo: false,
        modalDeleteUbicacion: false,
        modalSee: false,
        modalHistorial:false,
        active: 'historial',
        bodega: '',
        form: {
            partida:'',
            proyecto: '',
            unidad:'',
            nombre: '',
            cantidad:'',
            descripcion: '',
            adjuntos: {
                fotografia: {
                    value: '',
                    placeholder: 'Fotografía',
                    files: []
                },
            },
            ubicacion:'',
        },
        formPrestamos:{
            fecha: new Date(),
            cantidad:'',
            responsable:'',
            proyecto: '',
            comentario: '',
            ubicacion:'',
        },
        formDevoluciones:{
            fecha: new Date(),
            responsable:'',
            comentario: '',
            cantidad:'',
            existencia:''
        },
        formHistorial:{
            cantidad:''
        },
        options: {
            partidas:[],
            proyectos: [],
            unidades:[]
        },
        key: 'materiales',
        showForm: false
    }
    
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const bodega = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getOptionsAxios()
        if (!bodega)
            history.push('/')
    }

    getOptionsAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'herramientas/options', { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { empresas, proyectos, partidas, unidades } = response.data
                const { options, form } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                options['partidas'] = setOptions(partidas, 'nombre', 'id')
                options['unidades'] = setOptions(unidades, 'nombre', 'id')
                this.setState({ ...this.state, options, form })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    patchBodega = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v1/proyectos/bodegas/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key } = this.state
                if (key === 'materiales') { this.getMateriales() }
                if (key === 'herramientas') { this.getHerramientas() }
                doneAlert(response.data.message !== undefined ? response.data.message : 'El registro de bodega fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    setBodega = bodega => {
        let aux = []
        let _aux = []
        bodega.map((bodega) => {
            _aux = []
            if (bodega.adjuntos) {
                bodega.adjuntos.map((adjunto) => {
                    _aux.push({
                        text: adjunto.name, url: adjunto.url
                    })
                    return false
                })
            }
            aux.push({
                actions: this.setActions(bodega),
                nombre: setTextTableReactDom(bodega.nombre, this.doubleClick, bodega, 'nombre', 'text-center'),
                partida: setTextTableReactDom(bodega.partida ? bodega.partida.nombre:'', this.doubleClick, bodega, 'partida', 'text-center'),
                unidad: setTextTableReactDom(bodega.unidad ? bodega.unidad.nombre:'', this.doubleClick, bodega, 'unidad', 'text-center'),
                cantidad: renderToString(setTextTableCenter(bodega.cantidad)),
                ubicacion: setTextTableReactDom(bodega.ubicacion !== null ? bodega.ubicacion :'', this.doubleClick, bodega, 'ubicacion', 'text-justify'),
                descripcion: setTextTableReactDom(bodega.descripcion !== null ? bodega.descripcion :'', this.doubleClick, bodega, 'descripcion', 'text-justify'),
                adjuntos: bodega.adjuntos ? renderToString(setArrayTable(_aux)) : renderToString(setTextTableCenter('Sin adjuntos')),
                id: bodega.id
            })
            return false
        })
        return aux
    }

    renderInputSwal = ( data, tipo, form ) => {
        switch(tipo){
            case 'partida':
            case 'unidad':
                return(
                    <SelectSearchGray options = { this.setOptions(data, tipo) }
                        onChange = { (value) => { this.onChangeSwal(value, tipo)} } name = { tipo }
                        value = { form[tipo] } customdiv="mb-2 mt-7" requirevalidation={1} withtaglabel = { 0 } withtextlabel = { 0 } 
                        placeholder={`SELECCIONA ${tipo==='proyecto' ? 'EL PROYECTO' : 'LA ' + tipo.toUpperCase() }`}/>
                )
            case  'descripcion':
                return(
                    <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                        requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } rows  = { 6 } as = 'textarea'
                        onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } letterCase = { false } />
                )
            default:
                return (
                    <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                        requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } 
                        onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } />
                )
        }
    }
    
    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
            case 'partida':
            case 'proyecto':
            case 'unidad':
                if(data[tipo])
                    form[tipo] = data[tipo].id.toString()
                break
            default:
                form[tipo] = data[tipo]
                break
        }
        this.setState({form})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) } </h2>
                { this.renderInputSwal(data, tipo, form) }
            </div>,
            <Update />,
            () => { this.patchBodega(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }

    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch(element){
                case 'adjuntos':
                    form[element] = {
                        fotografia: {
                            value: '',
                            placeholder: 'Adjuntos',
                            files: []
                        }
                    }
                    break;
                default:
                    form[element] = ''
                break;
            }
        })
        return form
    }
    
    setOptions = (data, tipo) => {
        const { options } = this.state
        switch(tipo){
            case 'partida':
                return options.partidas
            case 'unidad':
                return options.unidades
            default: return []
        }
    }

    setActions = () => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' }
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' }
            },
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar' },
            },
            {
                text: 'Adjuntos',
                btnclass: 'info',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos' }
            },
            {
                text: 'Préstamos',
                btnclass: 'dark',
                iconclass: 'flaticon-bag',
                action: 'prestamos',
                tooltip: { id: 'prestamos', text: 'Préstamos' }
            },
            {
                text: 'Historial',
                btnclass: 'warning',
                iconclass: 'flaticon-list-1',
                action: 'historial',
                tooltip: { id: 'historial', text: 'Historial' }
            }
        )
        return aux
    }

    onChangePrestamo = e => {
        const { value, name } = e.target
        const { formPrestamos } = this.state
        formPrestamos[name] = value
        switch (name) {
            case 'cantidad':
                formPrestamos[name] = value.replace(/[,]/gi, '')
                break;
            default:
                break;
        }
        this.setState({ ...this.state, formPrestamos })
    }
    onChangeDevoluciones= e => {
        const { value, name } = e.target
        const { formDevoluciones } = this.state
        formDevoluciones[name] = value
        switch (name) {
            case 'cantidad':
                formDevoluciones[name] = value.replace(/[,]/gi, '')
                break;
            default:
                break;
        }
        this.setState({ ...this.state, formDevoluciones })
    }
    onChangeHistorial = e => {
        const { formHistorial } = this.state
        const { name, value } = e.target
        formHistorial[name] = value
        this.setState({
            ...this.state,
            formHistorial
        })
    }
    changePageEdit = (bodega) => {
        const { key } = this.state
        const { history } = this.props
        history.push({ pathname: '/proyectos/bodega/edit', state: { bodega: bodega, tipo:key } });
    }

    openModalDelete = bodega => { this.setState({ ...this.state, bodega: bodega, modalDelete: true }) }

    openModalAdjuntos = bodega => {
        const { form } = this.state
        let aux = []
        bodega.adjuntos.forEach((adjunto) => { aux.push({ name: adjunto.name, url: adjunto.url, id: adjunto.id }) })
        form.adjuntos.fotografia.files = aux
        this.setState({ ...this.state, bodega: bodega, modalAdjuntos: true, form })
    }

    openModalPrestamo = (bodega) => {
        this.setState({
            ...this.state,
            bodega: bodega,
            modalPrestamo: true,
            showForm: bodega.prestamos.length ? 0: 1,
        })
    }
    
    openModalHistorial = (bodega)  => { this.setState({ ...this.state, bodega: bodega, modalHistorial: true }) }
    handleCloseDelete = () => { this.setState({ ...this.state, modalDelete: false, bodega: '' }) }

    handleCloseAdjuntos = () => {
        const { form } = this.state
        form.adjuntos.fotografia.files = []
        this.setState({ ...this.state, modalAdjuntos: false, bodega: '', form })
    }

    handleClosePrestamo = () => { 
        const { formPrestamos, formDevoluciones } = this.state
        formPrestamos.fecha = new Date()
        formPrestamos.cantidad = ''
        formPrestamos.responsable = ''
        formPrestamos.proyecto = ''
        formPrestamos.comentario = ''
        formPrestamos.ubicacion = ''
        formDevoluciones.fecha = new Date()
        formDevoluciones.responsable = ''
        formDevoluciones.comentario = ''
        formDevoluciones.cantidad = ''
        formDevoluciones.existencia='Si'
        this.setState({ ...this.state, bodega: '', modalPrestamo: false, formDevoluciones, formPrestamos }) 
    }

    openModalSee = bodega => { this.setState({ ...this.state, modalSee: true, bodega: bodega }) }

    handleCloseSee = () => { this.setState({ ...this.state, modalSee: false, bodega: '' }) }

    handleCloseHistorial  = () => {
        const { formHistorial } = this.state
        formHistorial.cantidad = ''
        this.setState({ ...this.state, modalHistorial: false, bodega: '', formHistorial })
    }

    handleChange = (files, item) => {
        const { form, bodega } = this.state
        let aux = []
        if(bodega)
            bodega.adjuntos.forEach((adjunto) => { aux.push(adjunto) })
        files.forEach((file, counter) => { aux.push( { name: file.name, file: file, url: URL.createObjectURL(file), key: counter } ) })
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({ ...this.state, form })
    }

    onSubmitPrestamo = e => {
        e.preventDefault()
        waitAlert()
        this.sendPrestamoAxios()
    }

    deleteFile = element => { deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', '', () => this.deleteAdjuntoAxios(element.id)) }

    deleteBodegaAxios = async () => {
        const { access_token } = this.props.authUser
        const { bodega } = this.state
        await axios.delete(`${URL_DEV}v1/proyectos/bodegas/${bodega.id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { key } = this.state
                if (key === 'materiales') { this.getMateriales() }
                if (key === 'herramientas') { this.getHerramientas() }
                doneAlert(`${key === 'materiales'?'Material':'Herramienta'} eliminado con éxito`)
                this.setState({ ...this.state, modalDelete: false, bodega: '' })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deleteAdjuntoAxios =  async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { bodega } = this.state
        await axios.delete(`${URL_DEV}v1/proyectos/bodegas/${bodega.id}/adjunto/${id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { bodega } = response.data
                const { form, key } = this.state
                let aux = []
                bodega.adjuntos.forEach((adj) => { aux.push({ name: adj.name, url: adj.url, id: adj.id }) })
                form.adjuntos.fotografia.files = aux
                if (key === 'materiales') { this.getMateriales() }
                if (key === 'herramientas') { this.getHerramientas() }
                this.setState({ ...this.state, modalDelete: false, bodega: bodega, form })
                doneAlert('Adjunto eliminado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    sendAdjuntoAxios = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, bodega, key } = this.state
        const data = new FormData();
        let tipo = key === 'herramientas' ? 'herramienta' : 'material'
        form.adjuntos.fotografia.files.forEach((file) => { data.append(`files[]`, file.file) })
        await axios.post(`${URL_DEV}v1/proyectos/bodegas/${bodega.id}/adjuntos?tipo=${tipo}`, data, { headers: setFormHeader(access_token) }).then(
            (response) => {
                const { bodega } = response.data
                const { form } = this.state
                let aux = []
                bodega.adjuntos.forEach((adj) => { aux.push({ name: adj.name, url: adj.url, id: adj.id }) })
                form.adjuntos.fotografia.files = aux
                this.setState({ ...this.state, bodega: bodega, form })
                doneAlert('Adjunto creado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    sendPrestamoAxios = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { formPrestamos, bodega } = this.state
        await axios.post(`${URL_DEV}v1/proyectos/bodegas/${bodega.id}/prestamo`, formPrestamos, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { bodega } = response.data
                const { key, formPrestamos } = this.state
                if (key === 'materiales') { this.getMateriales() }
                if (key === 'herramientas') { this.getHerramientas() }
                formPrestamos.fecha = new Date()
                formPrestamos.cantidad = ''
                formPrestamos.responsable = ''
                formPrestamos.proyecto = ''
                formPrestamos.comentario = ''
                formPrestamos.ubicacion = ''
                this.setState({ ...this.state, active: 'historial', bodega: bodega, formPrestamos, showForm: false,  })
                doneAlert(`Prestamo agregado con éxito`)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async getMateriales() { $('#kt_datatable_materiales').DataTable().ajax.reload(); }

    async getHerramientas() { $('#kt_datatable_herramientas').DataTable().ajax.reload(); }
    
    controlledTab = value => {
        if (value === 'materiales') { this.getMateriales() }
        if (value === 'herramientas') { this.getHerramientas() }
        this.setState({ ...this.state, key: value })
    }
    mostrarFormulario() {
        const { showForm } = this.state
        this.setState({
            ...this.state,
            showForm: !showForm
        })
    }
    onSubmitDevolucion = prestamo => {
        waitAlert()
        this.sendDevolucionAxios(prestamo)
    }

    sendDevolucionAxios = async(prestamo) => {
        const { access_token } = this.props.authUser
        const { formDevoluciones, bodega } = this.state
        if((formDevoluciones.cantidad !== '' && formDevoluciones.responsable !== '') || formDevoluciones.existencia === 'No'){
            waitAlert()
            await axios.post(`${URL_DEV}v1/proyectos/bodegas/${bodega.id}/prestamo/${prestamo.id}/devolucion`, formDevoluciones, 
                { headers: setSingleHeader(access_token) }).then(
                (response) => {
                    const { bodega } = response.data
                    const { key, formDevoluciones } = this.state
                    if (key === 'materiales') { this.getMateriales() }
                    if (key === 'herramientas') { this.getHerramientas() }
                    formDevoluciones.fecha = new Date()
                    formDevoluciones.responsable = ''
                    formDevoluciones.comentario = ''
                    formDevoluciones.cantidad = ''
                    formDevoluciones.existencia='Si'
                    this.setState({ ...this.state, active: 'historial', bodega: bodega, formDevoluciones })
                    doneAlert(`Devolución registrada con éxito`)
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
        }
    }
    deletePrestamoAxios = async(prestamo) => {
        const { bodega } = this.state
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}v1/proyectos/bodegas/${bodega.id}/prestamo/${prestamo.id}`, { headers: setSingleHeader(access_token)  }).then(
            (response) => {
                const { bodega } = response.data
                const { key } = this.state
                let { showForm } = this.state
                if (key === 'materiales') { this.getMateriales() }
                if (key === 'herramientas') { this.getHerramientas() }
                showForm = bodega.prestamos.length === 0 ? true : false
                this.setState({ ...this.state, active: 'historial', bodega: bodega, showForm })
                doneAlert('Préstamo eliminado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    deleteDevolucionAxios = async(devolucion) => {
        waitAlert()
        const { bodega } = this.state
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}v1/proyectos/bodegas/${bodega.id}/prestamo/${devolucion.prestamo_bodega_id}/devolucion/${devolucion.id}`, { headers: setSingleHeader(access_token)  }).then(
            (response) => {
                const { bodega } = response.data
                const { key } = this.state
                let { showForm } = this.state
                if (key === 'materiales') { this.getMateriales() }
                if (key === 'herramientas') { this.getHerramientas() }
                showForm = bodega.prestamos.length === 0 ? true : false
                this.setState({ ...this.state, active: 'historial', bodega: bodega, showForm })
                doneAlert('Devolución eliminado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    onSubmitHistorial = async () => {
        waitAlert()
        const { formHistorial, bodega } = this.state
        const { access_token } = this.props.authUser
        await axios.post(`${URL_DEV}v1/proyectos/bodegas/${bodega.id}/entrada`, formHistorial, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { bodega } = response.data
                this.setState({...this.state, bodega: bodega})
                if(bodega.tipo === 'herramienta')
                    this.getHerramientas()
                else
                    this.getMateriales()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Se agregó al historial con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    render() {
        const { modalDelete, modalAdjuntos, modalPrestamo, form, modalSee, bodega, key, formPrestamos, options, formDevoluciones, modalHistorial, formHistorial } = this.state
        let tipo = key === 'herramientas' ? 'herramienta' : 'material'
        return (
            <Layout active={'proyectos'}  {...this.props}>

                <Tabs defaultActiveKey="materiales" activeKey={key} onSelect={(value) => { this.controlledTab(value) }}>
                    <Tab eventKey="materiales" title="Materiales">
                        <NewTableServerRender columns = { BODEGA_COLUMNS } title = 'Materiales' subtitle = 'Listado de materiales'
                            mostrar_boton = { true } abrir_modal = { false } url = '/proyectos/bodega/add?type=materiales' mostrar_acciones = { true }
                            actions = { {
                                    'edit': { function: this.changePageEdit },
                                    'delete': { function: this.openModalDelete },
                                    'adjuntos': { function: this.openModalAdjuntos },
                                    'prestamos': { function: this.openModalPrestamo },
                                    'see': { function: this.openModalSee },
                                    'historial':{ function: this.openModalHistorial },
                            } } accessToken = { this.props.authUser.access_token } setter = { this.setBodega }
                            urlRender = { `${URL_DEV}v1/proyectos/bodegas?tipo=material` } idTable = 'kt_datatable_materiales' cardTable = 'cardTable_materiales'
                            cardTableHeader = 'cardTableHeader_materiales' cardBody = 'cardBody_materiales' isTab = { true } />
                    </Tab>
                    <Tab eventKey="herramientas" title="Herramientas">
                        <NewTableServerRender columns = { BODEGA_COLUMNS } title = 'Herramientas' subtitle = 'Listado de herramientas'
                            mostrar_boton = { true } abrir_modal = { false } url = '/proyectos/bodega/add?type=herramientas'
                            mostrar_acciones = { true } accessToken = { this.props.authUser.access_token } setter = { this.setBodega }
                            actions = { {
                                    'edit': { function: this.changePageEdit },
                                    'delete': { function: this.openModalDelete },
                                    'adjuntos': { function: this.openModalAdjuntos },
                                    'prestamos': { function: this.openModalPrestamo },
                                    'see': { function: this.openModalSee },
                                    'historial':{ function: this.openModalHistorial },
                            } }
                            urlRender = { `${URL_DEV}v1/proyectos/bodegas?tipo=herramienta` } idTable = 'kt_datatable_herramientas'
                            cardTable = 'cardTable_herramientas' cardTableHeader = 'cardTableHeader_herramientas' cardBody = 'cardBody_herramientas'
                            isTab = { true } />
                    </Tab>
                </Tabs>
                
                <ModalDelete title = {`¿Estás seguro que deseas eliminar ${key === 'materiales'?'el material':'la herramienta'}?` } show = { modalDelete }
                    handleClose = { this.handleCloseDelete } onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteBodegaAxios() }} />

                <Modal size="lg" title="Adjuntos" show={modalAdjuntos} handleClose={this.handleCloseAdjuntos} >
                    <div className="p-2">
                        <ItemSlider items = { form.adjuntos.fotografia.files } item = 'fotografia' handleChange = { this.handleChange }
                            deleteFile = { this.deleteFile } />
                        {
                            form.adjuntos.fotografia.value ?
                                <div className="card-footer py-3 pr-1">
                                    <div className="row mx-0">
                                        <div className="col-lg-12 text-right pr-0 pb-0">
                                            <Button icon = '' text = 'ENVIAR' onClick = { (e) => { e.preventDefault(); this.sendAdjuntoAxios() } } />
                                        </div>
                                    </div>
                                </div>
                            : ''
                        }
                    </div>
                </Modal>
                <Modal size="xl" title={bodega?<span>Préstamo de<span className="text-primary"> {bodega.nombre}</span></span>:'Préstamo'} show={modalPrestamo} handleClose={this.handleClosePrestamo} >
                    {
                        bodega ?
                            bodega.prestamos ?
                                bodega.prestamos.length  ?
                                    <div className="d-flex justify-content-between my-5">
                                        <div className="d-flex align-items-center bg-light-success rounded px-3 py-2">
                                            <span className="svg-icon svg-icon-success mr-1">
                                                <span className="svg-icon svg-icon-lg">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Clipboard-check.svg')} />
                                                </span>
                                            </span>
                                            <div className="d-flex font-weight-bolder text-dark-75 font-size-13px mr-2">
                                                DISPONIBLES
                                            </div>
                                            <span className="font-weight-boldest text-success font-size-lg"><u>{bodega.cantidad}</u></span>
                                        </div>
                                        {
                                            bodega.cantidad > 0 &&
                                            <Button icon='' className="btn btn-sm btn-bg-light btn-icon-primary btn-hover-light-primary text-primary font-weight-bolder font-size-13px" onClick={() => { this.mostrarFormulario() }}
                                                only_icon = "flaticon-bag icon-lg mr-3 px-0" text = 'AGREGAR PRÉSTAMO' />
                                        }
                                    </div>
                                : <></>
                            : <></>
                        : <></>
                    }
                    <div className = { !this.state.showForm ? 'd-none' : '' } >
                        <FormPrestamos form = { formPrestamos } options = { options } onChange = { this.onChangePrestamo } onSubmit = { this.onSubmitPrestamo } />
                    </div>
                    { bodega !== '' ? <PestamosDevoluciones bodega = { bodega } form={formDevoluciones} onChange = { this.onChangeDevoluciones }  
                        deletePrestamo={ this.deletePrestamoAxios } deleteDevolucion={ this.deleteDevolucionAxios } tipo={tipo}
                        onSubmit = { this.onSubmitDevolucion }/> : <></> }
                </Modal>
                <Modal size="lg" title={`Detalles ${key === 'materiales'?'del material':'de la herramienta'}`} show={modalSee} handleClose={this.handleCloseSee} >
                    <BodegaCard bodega={bodega} />
                </Modal>
                <Modal size="lg" title={'Historial'} show={modalHistorial} handleClose={this.handleCloseHistorial} >
                    <HistorialHM data = { bodega } form={formHistorial} onChange={this.onChangeHistorial} onSubmit={this.onSubmitHistorial}/>
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Bodega);