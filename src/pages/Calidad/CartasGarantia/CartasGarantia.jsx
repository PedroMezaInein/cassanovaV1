import React, { Component } from 'react'
import { Tabs, Tab } from 'react-bootstrap';
import Layout from '../../../components/layout/layout';
import { connect } from 'react-redux'
import NewTableServerRender from '../../../components/tables/NewTableServerRender';
import { CARTAS_GARANTIAS_TICKETS, URL_DEV } from '../../../constants';
import { setDateTableReactDom, setOptions, setTextTableReactDom } from '../../../functions/setters'
import { Modal } from '../../../components/singles';
import { CartasCalidadForm } from '../../../components/forms';
import { customInputAlert, deleteAlert, doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert';
import axios from 'axios';
import { setFormHeader, setSingleHeader } from '../../../functions/routers';
import Swal from 'sweetalert2';
import $ from "jquery";
import { printSwalHeader } from '../../../functions/printers';
import { CalendarDaySwal, DoubleSelectSearchGray, SelectSearchGray } from '../../../components/form-components';
import { Update } from '../../../components/Lottie';
import moment from 'moment'

class CartasGarantia extends Component{

    state = {
        key: 'clientes',
        modal: false,
        title: 'Nuevo registro',
        form: {
            proyecto: '',
            area: '',
            subarea: '',
            fecha: new Date(),
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Ingresa los adjuntos',
                    files: []
                }
            }
        },options: {
            proyectos: [], 
            areasC: [],
            areasV: [],
            subareas: []
        },carta: ''
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const accessos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!accessos)
            history.push('/')
        this.getOptionsAxios()
    }

    onSubmit = () => {
        const { title } = this.state
        if(title === 'Nuevo registro')
            this.createCartaAxios()
        else
            this.updateCartaAxios()
    }

    getOptionsAxios = async() => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.options(`${URL_DEV}v1/calidad/cartas_garantia`, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                Swal.close()
                const { proyectos, areasVentas, areasCompras } = response.data
                const { options } = this.state
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                options.areasC = setOptions(areasCompras, 'nombre', 'id')
                options.areasV = setOptions(areasVentas, 'nombre', 'id')
                this.setState({...this.state, options})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    createCartaAxios = async() => {
        const { access_token } = this.props.authUser
        const { form, key } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.forEach((element) => {
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
        })
        if(form.adjuntos.adjunto.value !== '') {
            form.adjuntos.adjunto.files.forEach((file) => {
                data.append(`files[]`, file.file)
            })
        }
        waitAlert()
        await axios.post(`${URL_DEV}v1/calidad/cartas_garantia?type=${key}`, data, { headers: setFormHeader(access_token) }).then(
            (response) => {
                const { key } = this.state
                this.controlledTab(key)
                doneAlert('Elemento registrado con éxito')
                this.setState({...this.state, form: this.clearForm(), modal: false})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    updateCartaAxios = async() => {
        const { access_token } = this.props.authUser
        const { form, carta } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.forEach((element) => {
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
        })
        if(form.adjuntos.adjunto.value !== '') {
            form.adjuntos.adjunto.files.forEach((file) => {
                if(file.id === undefined)
                    data.append(`files[]`, file.file)
            })
        }
        waitAlert()
        await axios.post(`${URL_DEV}v1/calidad/cartas_garantia/${carta.id}?_method=PUT`, data, { headers: setFormHeader(access_token) }).then(
            (response) => {
                const { key } = this.state
                this.controlledTab(key)
                doneAlert('Elemento actualizado con éxito')
                this.setState({...this.state, form: this.clearForm(), modal: false, carta: ''})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    patchCartas = async( data, tipo, flag ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = ''
        let newType = tipo
        switch(tipo){
            case 'area':
                value = { area: form.area, subarea: form.subarea }
                break
            case 'subarea':
                if(flag === true){
                    value = { area: form.area, subarea: form.subarea }
                    newType = 'area'
                }else{ value = form[tipo] }
                break
            default:
                value = form[tipo]
                break
        }
        waitAlert()
        await axios.put(`${URL_DEV}v1/calidad/cartas_garantia/${newType}/${data.id}`, 
            { value: value }, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { key } = this.state
                this.controlledTab(key)
                doneAlert('Registro actualizado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteAdjunto = async (id) =>{
        waitAlert()
        const { carta } = this.state
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}v1/calidad/cartas_garantia/${carta.id}/adjuntos/${id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { carta } = response.data
                const { options } = this.state
                if(carta.area)
                    options.subareas = setOptions(carta.area.subareas, 'nombre', 'id')
                doneAlert('Adjunto eliminado con éxito.')
                this.setState({...this.state, carta: carta, form: this.setForm(carta), options})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    openModalEdit = async(value)  => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(`${URL_DEV}v1/calidad/cartas_garantia/${value.id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { carta } = response.data
                const { options } = this.state
                if(carta.area)
                    options.subareas = setOptions(carta.area.subareas, 'nombre', 'id')
                this.setState({ ...this.state, carta: value, modal: true, title: 'Actualizar registro', form: this.setForm(carta), options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteCarta = async(value) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.delete(`${URL_DEV}v1/calidad/cartas_garantia/${value.id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert('CARTA ELIMINADA CON ÉXITO.')
                const { key } = this.state
                this.controlledTab(key)
                this.setState({ ...this.state, carta: '',  })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getCartasGarantiaClientes = async () => { $('#clientes_table').DataTable().ajax.reload(); }
    getCartasGarantiaProveedores = async () => { $('#proveedores_table').DataTable().ajax.reload(); }

    setForm = (data) => {
        const { form } = this.state
        form.fecha = new Date(moment(data.fecha))
        if(data.proyecto)
            form.proyecto =  data.proyecto.id.toString()
        if(data.area)
            form.area = data.area.id.toString()
        if(data.subarea)
            form.subarea = data.subarea.id.toString()
        if(data.adjuntos)
            if(data.adjuntos.length){
                form.adjuntos.adjunto.files = []
                data.adjuntos.forEach((element) => {
                    form.adjuntos.adjunto.files.push(element)
                })
            }else{ form.adjuntos.adjunto.files = [] }
        return form
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch (element) {
                case 'fecha':
                    form[element] = new Date()
                    break;
                case 'adjuntos':
                    form[element] = {
                        adjunto: {
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
        return form;
    }

    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }

    onChange = e => {
        const { value, name } = e.target
        const { form, options, key } = this.state
        form[name] = value
        if(name === 'area'){
            form.subarea = ''
            let name = ''
            if(key === 'clientes')
                name = 'areasV'
            else
                name = 'areasC'
            let valor = options[name].find((element) => {
                return element.value === value
            })
            if(valor)
                options.subareas = setOptions(valor.subareas, 'nombre', 'id')
        }
        this.setState({ ...this.state, form, options })
    }

    handleChange = (files, item) => {
        const { form } = this.state
        let aux = []
        form.adjuntos[item].files.forEach((file, index) => {
            if(file.id)
                aux.push( file )    
        })
        files.forEach((file, index) => {
            aux.push(
                {
                    name: file.name,
                    file: file,
                    url: URL.createObjectURL(file),
                    key: index
                }
            )
        })
        form.adjuntos[item].value = files
        form.adjuntos[item].files = aux
        this.setState({ ...this.state, form })
    }

    controlledTab = value => {
        if(value === 'clientes')
            this.getCartasGarantiaClientes()
        if(value === 'proveedores')
            this.getCartasGarantiaProveedores()
        this.setState({ ...this.state, key: value })
    }

    openModal = () => { this.setState({ ...this.state,modal:true, title: 'Nuevo registro', form: this.clearForm(), carta: '' }) }
    handleClose = () => { this.setState({ ...this.state, modal: false, form: this.clearForm(), carta: '' }) }

    openModalDelete = value => { deleteAlert('¿DESEAS ELIMINAR LA CARTA?', '', () => this.deleteCarta(value)) }
    deleteFile = element => { deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', '', () => this.deleteAdjunto(element.id)) }

    doubleClick = (data, tipo) => {
        const { form, options, key } = this.state
        let busqueda = undefined
        let flag = false
        switch(tipo){
            case 'subarea':
                options.subareas = []
                flag = false
                if(data.area){
                    if(key === 'clientes')
                        busqueda = options.areasV.find( (elemento) => { return elemento.value === data.area.id.toString() })
                    else
                        busqueda = options.areasC.find( (elemento) => { return elemento.value === data.area.id.toString() })
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
                form.fecha = new Date(data.fecha)
                break
            case 'proyecto':
                if(data[tipo])
                    form[tipo] = data[tipo].id.toString()
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
                    tipo === 'fecha' &&
                        <CalendarDaySwal value = { form[tipo] } onChange = { (e) => {  this.onChangeSwal(e.target.value, tipo)} } name = { tipo } date = { form[tipo] } withformgroup={0} />
                }
                {
                    tipo === 'proyecto' ?
                        <SelectSearchGray options = { options.proyectos } value = { form.proyecto } customdiv = 'mb-2 mt-7' requirevalidation = { 1 }
                            onChange = { (value) => { this.onChangeSwal(value, tipo)} } name = { tipo } placeholder = 'SELECCIONA EL PROYECTO' withicon={1}/>
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
                            one = { { placeholder: 'SELECCIONA EL ÁREA', name: 'area', opciones: key === 'clientes' ? 'areasV' : 'areasC'} } 
                            two = { { placeholder: 'SELECCIONA EL SUBÁREA', name: 'subarea', opciones: 'subareas'} }/>
                }
            </div>,
            <Update />,
            () => { this.patchCartas(data, tipo, flag) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }

    setCartas = cartas => {
        let aux = []
        if(cartas){
            cartas.forEach( (carta) => {
                aux.push({
                    actions: this.setActions(carta),
                    fecha: setDateTableReactDom(carta.fecha, this.doubleClick, carta, 'fecha', 'text-center'),
                    proyecto: setTextTableReactDom(carta.proyecto ? carta.proyecto.nombre : '', this.doubleClick, carta, 'proyecto', 'text-center'),
                    area: setTextTableReactDom(carta.area ? carta.area.nombre : '', this.doubleClick, carta, 'area', 'text-center'),
                    subarea: setTextTableReactDom(carta.subarea ? carta.subarea.nombre : '', this.doubleClick, carta, 'subarea', 'text-center'),
                })
            })
        }
        return aux
    }

    setActions= () => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: {id:'edit', text:'Editar'},
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',                  
                action: 'delete',
                tooltip: {id:'delete', text:'Eliminar', type:'error'},
            }
        ) 
        return aux 
    }

    render(){
        const { key, modal, title, form, options } = this.state
        return(
            <Layout active = 'calidad' {...this.props}>
                <Tabs defaultActiveKey = 'clientes' activeKey = { key } onSelect = { (value) => { this.controlledTab(value) } }>
                    <Tab eventKey = 'clientes' title = 'Clientes'>
                        <NewTableServerRender columns = { CARTAS_GARANTIAS_TICKETS } title = 'Cartas de garantías de clientes'
                            subtitle = 'Listado de cartas de garantías de clientes' mostrar_boton = { true } abrir_modal = { true }
                            onClick = { this.openModal } mostrar_acciones = { true } accessToken = { this.props.authUser.access_token }
                            actions = {
                                {
                                    'edit': { function: this.openModalEdit },
                                    'delete': { function: this.openModalDelete },
                                }
                            } setter = { this.setCartas } urlRender = { `${URL_DEV}v1/calidad/cartas_garantia?type=clientes` }
                            idTable = 'clientes_table' cardTable = 'cardTable_clientes' cardTableHeader = 'carTableHader_clientes'
                            cardBody = 'cardBody_clientes' isTab = { true }/>
                    </Tab>
                    <Tab eventKey = 'proveedores' title = 'Proveedores'>
                        <NewTableServerRender columns = { CARTAS_GARANTIAS_TICKETS } title = 'Cartas de garantías de proveedores'
                            subtitle = 'Listado de cartas de garantías de proveedores' mostrar_boton = { true } abrir_modal = { true }
                            onClick = { this.openModal } mostrar_acciones = { true } accessToken = { this.props.authUser.access_token }
                            actions = {
                                {
                                    'edit': { function: this.openModalEdit },
                                    'delete': { function: this.openModalDelete },
                                }
                            } setter = { this.setCartas } urlRender = { `${URL_DEV}v1/calidad/cartas_garantia?type=proveedores` }
                            idTable = 'proveedores_table' cardTable = 'cardTable_proveedores' cardTableHeader = 'carTableHader_proveedores'
                            cardBody = 'cardBody_proveedores' isTab = { true }/>
                    </Tab>
                </Tabs>
                <Modal title = { title } show = { modal } handleClose = { this.handleClose } size = 'xl' >
                    <CartasCalidadForm form = { form } options = { options } onChange = { this.onChange } tipo = { key } 
                        handleChange = { this.handleChange } onSubmit = { this.onSubmit } deleteFile = { this.deleteFile } />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(CartasGarantia)