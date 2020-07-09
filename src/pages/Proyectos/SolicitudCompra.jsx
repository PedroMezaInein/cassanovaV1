import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, SOLICITUD_COMPRA_COLUMNS } from '../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../functions/setters'

//
import Layout from '../../components/layout/layout'
import { Button } from '../../components/form-components'
import { Modal, ModalDelete } from '../../components/singles'
import { faPlus, faLink, faEdit, faTrash, faSync } from '@fortawesome/free-solid-svg-icons'
import { DataTable } from '../../components/tables'
import Subtitle from '../../components/texts/Subtitle'
import { SolicitudCompraForm } from '../../components/forms'
import { SolicitudCompraCard } from '../../components/cards'
import { Small } from '../../components/texts'
import RemisionCard from '../../components/cards/Proyectos/RemisionCard'
import { Accordion } from 'react-bootstrap'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import NewTable from '../../components/tables/NewTable'

class SolicitudCompra extends Component{

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
        form:{
            proveedor: '',
            proyecto: '',
            area: '',
            subarea: '',
            empresa: '',
            descripcion: '',
            total: '',
            remision: '',
            fecha: new Date(),
            tipoPago: 0,
            factura: 'Sin factura'
        },
        options:{
            proveedores: [],
            proyectos: [],
            empresas: [],
            areas: [],
            subareas: [],
            tiposPagos: []
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
                this.getSolicitudCompraAxios(id)
            }
        }
        this.getSolicitudesCompraAxios()
        const { state } = this.props.location
        if(state){
            if(state.remision){
                this.getRemisionAxios(state.remision.id)
            }
        }
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true,
            title: 'Nueva solicitud de compra',
            form: this.clearForm(),
            remision: '',
            formeditado:0
        })
    }

    openModalEdit = ( solicitud ) => {
        const {form, options} = this.state
        if(solicitud.empresa)
            form.empresa = solicitud.empresa.id.toString()
        if(solicitud.tipo_pago)
            form.tipoPago = solicitud.tipo_pago.id
        if(solicitud.proveedor)
            form.proveedor = solicitud.proveedor.id.toString()
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
        this.setState({
            ... this.state,
            modal: true,
            title: 'Editar solicitud de compra',
            solicitud: solicitud,
            form,
            options,
            remision: '',
            formeditado:1
        })
    }

    openModalDelete = ( solicitud ) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            title: 'Nueva solicitud de compra',
            form: this.clearForm(),
            solicitud: solicitud
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            form: this.clearForm(),
            solicitud: '',
            remision: ''
        })
    }

    handleCloseDelete = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            form: this.clearForm(),
            solicitud: '',
            remision: ''
        })
    }

    handleCloseSingle = () => {
        const { modalSingle } = this.state
        this.setState({
            ... this.state,
            modalSingle: !modalSingle,
            solicitud: '',
            remision: ''
        })
    }

    //Handle change
    onChange = e => {
        const {form} = this.state
        const {name, value} = e.target
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
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
                default:
                    form[element] = ''
                    break;
            }
        })
        return form
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        swal({
            title: '¡Un momento!',
            text: 'La información está siendo procesada.',
            buttons: false
        })
        if(title === 'Editar solicitud de compra')
            this.editSolicitudCompraAxios()
        else
            this.addSolicitudCompraAxios()
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
                    proveedor: renderToString(setTextTable( solicitud.proveedor ? solicitud.proveedor.nombre : '' )),
                    factura: renderToString(setTextTable(solicitud.factura ? 'Con factura' : 'Sin factura')),
                    monto: renderToString(setMoneyTable(solicitud.monto)),
                    tipoPago: renderToString(setTextTable(solicitud.tipo_pago.tipo)),
                    descripcion: renderToString(setTextTable(solicitud.descripcion)),
                    area: renderToString(setTextTable( solicitud.subarea ? solicitud.subarea.area ? solicitud.subarea.area.nombre : '' : '' )),
                    subarea: renderToString(setTextTable( solicitud.subarea ? solicitud.subarea.nombre : '' )),
                    fecha: renderToString(setDateTable(solicitud.created_at)),
                    id: solicitud.id
                }
            )
        })
        return aux
    }

    setActions = concepto => {
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
                text: 'Convertir',
                btnclass: 'danger',
                iconclass: 'flaticon2-refresh',
                action: 'convertir',
                tooltip: { id: 'convertir', text: 'Eliminar', type: 'error' }
            }
        )
        return aux
    }
    /*setActions = solicitud => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.openModalEdit(solicitud)} } text='' icon={faEdit} color="transparent" 
                        tooltip={{id:'edit', text:'Editar'}} />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.openModalDelete(solicitud)} } text='' icon={faTrash} color="red" 
                        tooltip={{id:'delete', text:'Eliminar', type:'error'}} />
                </div>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.convertirSolicitud(solicitud)} } text='' icon={faSync} color="transparent" 
                        tooltip={{id:'convertir', text:'Comprar', type:'success'}} />
                </div>
            </>
        )
    }*/

    convertirSolicitud = solicitud => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/compras',
            state: { solicitud: solicitud},
            formeditado:1
        });
    }

    //Async
    async getSolicitudesCompraAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'solicitud-compra', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas, areas, tiposPagos, proveedores, proyectos, solicitudes, data } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['tiposPagos'] = setSelectOptions( tiposPagos, 'tipo' )
                const { data } = this.state
                data.solicitudes = solicitudes
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
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    async getSolicitudCompraAxios(id){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'solicitud-compra/'+id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { data } = this.state
                const { solicitud } = response.data
                data.solicitud = solicitud
                this.setState({
                    ... this.state,
                    solicitud: solicitud,
                    solicitud: this.setSolicitudes(solicitud),
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    async getRemisionAxios(id){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'remision/'+id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { remision } = response.data
                const { form, options } = this.state
                if(remision.subarea){
                    if(remision.subarea.area){
                        form.area = remision.subarea.area.id.toString()
                        if(remision.subarea.area.subareas){
                            options['subareas'] = setOptions(remision.subarea.area.subareas, 'nombre', 'id')
                            form.subarea = remision.subarea.id.toString()
                        }
                    }
                }
                if(remision.proyecto){
                    form.proyecto = remision.proyecto.id.toString()
                }
                form.remision = remision.id
                form.fecha = new Date(remision.created_at)
                form.descripcion = remision.descripcion
                this.setState({
                    ... this.state,
                    remision: remision,
                    form,
                    options,
                    title: 'Converit remisión',
                    modal: true
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    async addSolicitudCompraAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'solicitud-compra', form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
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
                    modal: false,
                    form: this.clearForm(),
                    title: 'Nueva solicitud de compra',
                    solicitudes: this.setSolicitudes(solicitudes),
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    async editSolicitudCompraAxios(){
        const { access_token } = this.props.authUser
        const { form, solicitud } = this.state
        await axios.put(URL_DEV + 'solicitud-compra/' + solicitud.id, form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
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
                    modal: false,
                    form: this.clearForm(),
                    title: 'Nueva solicitud de compra',
                    solicitud: '',
                    solicitudes: this.setSolicitudes(solicitudes),
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    async deleteSolicitudAxios(){
        const { access_token } = this.props.authUser
        const { solicitud } = this.state
        await axios.delete(URL_DEV + 'solicitud-compra/' + solicitud.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
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
                    form: this.clearForm(),
                    title: 'Nueva solicitud de compra',
                    solicitud: '',
                    solicitudes: this.setSolicitudes(solicitudes),
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    render(){

        const { modal, modalDelete, modalSingle, title, form, options, solicitudes, solicitud, remision, formeditado } = this.state

        return(
            <Layout active={'proyectos'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" />
                </div>
            
                {/* <DataTable columns = { SOLICITUD_COMPRA_COLUMNS } data= { solicitudes }/>*/}
                
                <NewTable columns={SOLICITUD_COMPRA_COLUMNS} data={solicitudes}
                    title='Solicitudes' subtitle='Listado de solicitudes'
                    mostrar_boton={true}
                    abrir_modal={true}
                    mostrar_acciones={true}
                    onClick={ this.openModal }
                    actions={{
                        'edit': { function: this.openModalEdit },
                        'delete': { function: this.openModalDelete },
                        'convertir': { function: alert('coinvertir') }
                    }}
                    elements={data.solicitudes}
                />

                <Modal show = {modal} handleClose = { this.handleClose } >
                    <SolicitudCompraForm title = { title } form = { form } options = { options } 
                        setOptions = {this.setOptions}  onChange = { this.onChange }
                        onSubmit = { this.onSubmit } formeditado={formeditado}>
                        {
                            remision !== '' ?
                            
                            <Accordion>
                                <div className="d-flex justify-content-end">
                                    <Accordion.Toggle as = { Button } icon={ faEye } color="transparent" eventKey={0} />
                                </div>
                                <Accordion.Collapse eventKey = { 0 } className="px-md-5 px-2" >
                                    <div>
                                        <RemisionCard data = { remision }/>
                                    </div>
                                </Accordion.Collapse>
                            </Accordion>
                            : ''
                        }
                    </SolicitudCompraForm>
                </Modal>
                <ModalDelete title={"¿Estás seguro que deseas eliminar la solicitud de compra?"} show = { modalDelete } handleClose = { this.handleCloseDelete } onClick = { (e) => { e.preventDefault(); this.deleteSolicitudAxios() }}>
                </ModalDelete>
                <Modal show = { modalSingle } handleClose = { this.handleCloseSingle } >
                    <SolicitudCompraCard data = { solicitud }>
                        {
                            solicitud.convertido ? '' :
                                <div className="col-md-12 mb-3 d-flex justify-content-end">
                                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.convertirSolicitud(solicitud)} } text='' icon={faSync} color="transparent" 
                                        tooltip={{id:'convertir', text:'Comprar', type:'success'}} />
                                </div>
                        }
                        
                    </SolicitudCompraCard>
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

export default connect(mapStateToProps, mapDispatchToProps)(SolicitudCompra);