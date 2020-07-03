import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, SOLICITUD_VENTA_COLUMNS } from '../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../functions/setters'
import { waitAlert, errorAlert, createAlert,forbiddenAccessAlert } from '../../functions/alert'
//
import Layout from '../../components/layout/layout'
import { Button } from '../../components/form-components'
import { Modal, ModalDelete } from '../../components/singles'
import { faPlus, faLink, faEdit, faTrash, faSync } from '@fortawesome/free-solid-svg-icons'
import { DataTable } from '../../components/tables'
import Subtitle from '../../components/texts/Subtitle'
import { Small } from '../../components/texts'
import RemisionCard from '../../components/cards/Proyectos/RemisionCard'
import { Accordion } from 'react-bootstrap'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import NewTable from '../../components/tables/NewTable'
import {SolicitudVentaForm} from '../../components/forms'
import {SolicitudVentaCard} from '../../components/cards'

class SolicitudVenta extends Component{

    state = {
        modal: false,
        modalDelete: false,
        modalSingle: false,
        title: 'Nueva solicitud de compra',
        solicitud: '',
        solicitudes: [],
        data: {
            solicitudes: []
        },
        formeditado:0,
        options:{
            proveedores: [],
            proyectos: [],
            empresas: [],
            areas: [],
            subareas: [],
            tiposPagos: []
        },
        form:{
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
            adjuntos:{
                adjunto:{
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
            }
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const solicitud = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if(!solicitud)
            history.push('/')
        let queryString = this.props.history.location.search
        if(queryString){
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if(id){
                
                this.setState({
                    ... this.state,
                    modalSingle: true
                })
                this.getSolicitudVentaAxios(id)
            }
        }
        this.getSolicitudesVentaAxios()
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
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
        })
        return form
    }

    openModal = () => {
        this.setState({
            ... this.state,
            form: this.clearForm(),
            modal: true,
            title: 'Nueva solicitud de venta',
            formeditado:0
        })
    }

    openModalEdit = solicitud => {
        const {form, options} = this.state
        if(solicitud.empresa)
            form.empresa = solicitud.empresa.id.toString()
        if(solicitud.tipo_pago)
            form.tipoPago = solicitud.tipo_pago.id
        if(solicitud.proyecto)
            form.proyecto = solicitud.proyecto.id.toString()
        if(solicitud.subarea){
            if(solicitud.subarea.area){
                form.area = solicitud.subarea.area.id.toString()
                if(solicitud.subarea.area.subareas){
                    options['subareas'] = setOptions(solicitud.subarea.area.subareas, 'nombre', 'id')
                    form.subarea = solicitud.subarea.id.toString()
                }
            }
        }
        if(solicitud.factura)
            form.factura = 'Con factura'
        else
            form.factura = 'Sin factura'
        form.descripcion = solicitud.descripcion
        form.fecha = new Date(solicitud.created_at)
        form.total = solicitud.monto
        if(solicitud.adjunto){
            form.adjuntos.adjunto.files = [{
                name: solicitud.adjunto.name,
                url: solicitud.adjunto.url
            }]
        }
        this.setState({
            ... this.state,
            modal: true,
            title: 'Editar solicitud de venta',
            solicitud: solicitud,
            form,
            options,
            formeditado:1
        })
    }

    openModalDelete = ( solicitud ) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            title: 'Eliminar solicitud de venta',
            form: this.clearForm(),
            solicitud: solicitud
        })
    }

    openModalSingle = ( solicitud ) => {
        this.setState({
            ... this.state,
            modalSingle: true,
            solicitud: solicitud
        })
    }

    handleClose = () => {
        this.setState({
            ... this.state,
            form: this.clearForm(),
            modal: false,
            solicitudes: '',
            title: 'Nueva solicitud de venta'
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            form: this.clearForm(),
            solicitud: ''
        })
    }

    handleCloseSingle = () => {
        const { modalSingle } = this.state
        this.setState({
            ... this.state,
            modalSingle: !modalSingle,
            solicitud: ''
        })
    }

    changePageConvert = solicitud => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/ventas',
            state: { solicitud: solicitud},
            formeditado:1
        });
    }

    onChange = e => {
        const {form} = this.state
        const {name, value} = e.target
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    onChangeAdjunto = e => {
        const { form, data, options } = this.state
        const { files, value, name } = e.target
        let aux = []
        for(let counter = 0; counter < files.length; counter ++){
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]) ,
                    key: counter
                }
            )
        }
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for(let counter = 0; counter < form['adjuntos'][name].files.length; counter ++){
            if(counter !== key){
                aux.push(form['adjuntos'][name].files[counter])
            }
        }
        if(aux.length < 1){
            form['adjuntos'][name].value = ''
        }
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        swal({
            title: '¡Un momento!',
            text: 'La información está siendo procesada.',
            buttons: false
        })
        if(title === 'Editar solicitud de venta')
            this.editSolicitudVentaAxios()
        else
            this.addSolicitudVentaAxios()
    }

    //Setters
    setOptions = (name, array) => {
        const {options} = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }

    setSolicitudes = solicitudes => {
        let aux = []
        solicitudes.map( (solicitud) => {
            aux.push(
                {
                    actions: this.setActions(solicitud),
                    proyecto: renderToString(setTextTable( solicitud.proyecto ? solicitud.proyecto.nombre : '')),
                    empresa: renderToString(setTextTable( solicitud.empresa ? solicitud.empresa.name : '' )),
                    factura: renderToString(setTextTable(solicitud.factura ? 'Con factura' : 'Sin factura')),
                    monto: renderToString(setMoneyTable(solicitud.monto)),
                    tipoPago: renderToString(setTextTable(solicitud.tipo_pago ? solicitud.tipo_pago.tipo : '')),
                    descripcion: renderToString(setTextTable(solicitud.descripcion)),
                    area: renderToString(setTextTable( solicitud.subarea ? solicitud.subarea.area ? solicitud.subarea.area.nombre : '' : '' )),
                    subarea: renderToString(setTextTable( solicitud.subarea ? solicitud.subarea.nombre : '' )),
                    fecha: renderToString(setDateTable(solicitud.created_at)),
                    adjunto: solicitud.adjunto ? renderToString(setArrayTable([{text: 'Adjunto', url: solicitud.adjunto.url}])) : renderToString(setTextTable('Sin adjuntos')),
                    id: solicitud.id
                }
            )
        })
        return aux
    }

    setActions = solicitud => {
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
                },
                {
                    text: 'Convertir',
                    btnclass: 'primary',
                    iconclass: 'flaticon2-refresh',                  
                    action: 'convert',
                    tooltip: {id:'convert', text:'Convertir', type:'success'},
                },
                {
                    text: 'Ver',
                    btnclass: 'primary',
                    iconclass: 'flaticon2-expand',                  
                    action: 'see',
                    tooltip: {id:'see', text:'Mostrar', type:'success'},
                }
        )
        return aux
    }

    async getSolicitudesVentaAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'solicitud-venta', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas, areas, tiposPagos, proyectos, solicitudes } = response.data
                const { options, data } = this.state
                data.solicitudes = solicitudes
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['tiposPagos'] = setSelectOptions( tiposPagos, 'tipo' )
                this.setState({
                    ... this.state,
                    options,
                    solicitudes: this.setSolicitudes(solicitudes),
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getSolicitudVentaAxios(id){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'solicitud-venta/'+id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { data } = this.state
                const { solicitud } = response.data
                data.solicitud = solicitud
                this.setState({
                    ... this.state,
                    solicitud: solicitud,
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async addSolicitudVentaAxios(){
        
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
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
        aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            if(form.adjuntos[element].value !== ''){
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })

        await axios.post(URL_DEV + 'solicitud-venta', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { solicitudes } = response.data
                const { data } = this.state
                data.solicitudes = solicitudes
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false,
                })
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    solicitud: '',
                    solicitudes: this.setSolicitudes(solicitudes),
                    title: 'Nueva solicitud de venta',
                    modal: false,
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async editSolicitudVentaAxios(){

        const { access_token } = this.props.authUser
        const { form, solicitud } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
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
        aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
        })
        
        await axios.post(URL_DEV + 'solicitud-venta/update/' + solicitud.id, data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const {solicitud, solicitudes} = response.data
                const { data } = this.state
                data.solicitudes = solicitudes
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false,
                })
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    solicitud: '',
                    solicitudes: this.setSolicitudes(solicitudes),
                    title: 'Nueva solicitud de venta',
                    modal: false,
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteSolicitudAxios(){
        const { access_token } = this.props.authUser
        const { solicitud } = this.state
        await axios.delete(URL_DEV + 'solicitud-venta/' + solicitud.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { solicitudes } = response.data
                const { data } = this.state
                data.solicitudes = solicitudes 
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La solicitud fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
                this.setState({
                    ... this.state,
                    modalDelete: false,
                    data,
                    title: 'Nueva solicitud de compra',
                    solicitud: '',
                    solicitudes: this.setSolicitudes(solicitudes)
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render(){

        const { data, solicitudes, modal, modalDelete, title, form, options, solicitud, modalSingle, formeditado} = this.state
        return(
            <Layout active={'proyectos'}  { ...this.props}>
                <NewTable 
                    columns = { SOLICITUD_VENTA_COLUMNS } 
                    data = { solicitudes } 
                    title = 'Solicitudes de venta' 
                    subtitle = 'Listado de solicitudes de venta'
                    mostrar_boton = { true }
                    abrir_modal = { true }
                    onClick = { this.openModal }
                    mostrar_acciones = { true }
                    actions = {{
                        'edit': {function: this.openModalEdit},
                        'delete': {function: this.openModalDelete},
                        'convert': {function: this.changePageConvert},
                        'see': {function: this.openModalSingle}
                    }}
                    elements = { data.solicitudes } />
                <Modal show = { modal } handleClose = { this.handleClose } title = { title }>
                    <SolicitudVentaForm title = { title } form = { form } options = { options } 
                        setOptions = {this.setOptions}  onChange = { this.onChange } onChangeAdjunto = { this.onChangeAdjunto }
                        clearFiles = { this.clearFiles } onSubmit = { this.onSubmit } formeditado={formeditado}/>
                </Modal>
                <ModalDelete title={"¿Estás seguro que deseas eliminar la solicitud de venta?"} show = { modalDelete } handleClose = { this.handleCloseDelete } onClick = { (e) => { e.preventDefault(); this.deleteSolicitudAxios() }}>
                </ModalDelete>
                <Modal title = "Solicitud de venta" show = { modalSingle } handleClose = { this.handleCloseSingle } >
                    <SolicitudVentaCard data = { solicitud }>
                        {
                            solicitud.convertido ? '' :
                                <div className="col-md-12 mb-3 d-flex justify-content-end">
                                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.changePageConvert(solicitud)} } text='' icon={faSync} color="transparent" 
                                        tooltip={{id:'convertir', text:'Comprar', type:'success'}} />
                                </div>
                        }
                        
                    </SolicitudVentaCard>
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SolicitudVenta);