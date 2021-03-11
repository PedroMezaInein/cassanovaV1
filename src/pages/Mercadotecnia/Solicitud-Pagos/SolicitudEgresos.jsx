import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, SOLICITUD_EGRESO_COLUMNS } from '../../../constants'
import { setTextTable, setDateTable, setMoneyTable, setArrayTable } from '../../../functions/setters'
import { errorAlert, printResponseErrorAlert, doneAlert, waitAlert, deleteAlert, questionAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal, ItemSlider } from '../../../components/singles'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { SolicitudEgresoCard } from '../../../components/cards'
const $ = require('jquery');
class SolicitudEgresos extends Component {

    state = {
        modalDelete: false,
        modalSee: false,
        modalAdjuntos: false,
        title: 'Nueva solicitud de egreso',
        solicitud: '',
        form: {
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Presupuesto',
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
                this.getSolicitudEgresoAxios(id)
                this.setState({ ...this.state, modalSee: true })
            }
        }
    }
    
    openModalDelete = solicitud => {
        this.setState({ ...this.state, modalDelete: true, title: 'Nueva solicitud de egreso', solicitud: solicitud })
    }
    
    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({ ...this.state, modalDelete: !modalDelete, solicitud: '', })
    }

    openModalAdjuntos = solicitud => {
        const { form } = this.state
        if(solicitud.adjunto)
            form.adjuntos.adjunto.files = [solicitud.adjunto]
        this.setState({ ...this.state, modalAdjuntos: true, solicitud: solicitud, form })
    }

    handleCloseAdjuntos = () => {
        this.setState({ ...this.state, modalAdjuntos: false, solicitud: '' })
    }

    openModalSee = solicitud => {
        this.setState({ ...this.state, modalSee: true, solicitud: solicitud })
    }

    handleCloseSee = () => {
        this.setState({ ...this.state, modalSee: false, solicitud: '' })
    }

    handleChange = (files, item) => {
        questionAlert('¿DESEAS ADJUNTAR EL PRESUPUESTO?', '', () => this.sendPresupuestoAxios(files, item))
    }
    
    setSolicitudes = solicitudes => {
        let aux = []
        solicitudes.map((solicitud) => {
            aux.push(
                {
                    actions: this.setActions(solicitud),
                    empresa: renderToString(setTextTable(solicitud.empresa ? solicitud.empresa.name : '')),
                    proveedor: renderToString(setTextTable(solicitud.proveedor ? solicitud.proveedor.razon_social : '')),
                    factura: renderToString(setTextTable(solicitud.factura ? 'Con factura' : 'Sin factura')),
                    monto: renderToString(setMoneyTable(solicitud.monto)),
                    tipoPago: renderToString(setTextTable(solicitud.tipo_pago ? solicitud.tipo_pago.tipo : '')),
                    subarea: renderToString(setTextTable(solicitud.subarea ? solicitud.subarea.nombre : '')),
                    fecha: renderToString(setDateTable(solicitud.fecha)),
                    adjunto: solicitud.adjunto ? renderToString(setArrayTable([{ text: solicitud.adjunto.name, url: solicitud.adjunto.url }])) : renderToString(setTextTable('Sin adjuntos')),
                    descripcion: renderToString(setTextTable(solicitud.descripcion)),
                    id: solicitud.id
                }
            )
            return false
        })
        return aux
    }
    
    setActions = () => {
        const { user } = this.props.authUser
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
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            },
            {
                text: 'Adjuntos',
                btnclass: 'info',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            }
        )
        if(user.permisos)
            if(user.permisos.length)
                user.permisos.map((permiso) => {
                    if(permiso.modulo)
                        if(permiso.modulo.slug === 'egresos')
                            aux.push({
                                text: 'Convertir&nbsp;a&nbsp;solicitud&nbsp;de&nbsp;egresos',
                                btnclass: 'success',
                                iconclass: 'flaticon2-refresh',
                                action: 'convert',
                                tooltip: { id: 'convert', text: 'Convertir', type: 'success' },
                            })
                    return ''
                })

        return aux
    }
    
    changePageEdit = solicitud => {
        const { history } = this.props
        history.push({
            pathname: '/mercadotecnia/solicitud-de-pagos/edit',
            state: { solicitud: solicitud }
        });
    }

    changePageConvert = solicitud => {
        const { history } = this.props        
        questionAlert( '¿DESEAS CONVERTIR EN EGRESO?',  '',  () => {
            history.push({
                pathname: '/administracion/egresos/convert',
                state: { solicitud: solicitud }
            });
        } )
    }

    deleteFile = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', '', () => this.deleteAdjuntoAxios(element.id))
    }
    
    async getSolicitudesEgresoAxios() {
        $('#kt_datatable_solicitudes_egresos').DataTable().ajax.reload();
    }

    async getSolicitudEgresoAxios(id) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'mercadotecnia/solicitud-pagos/single/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { solicitud } = response.data
                this.setState({ ...this.state, solicitud: solicitud })
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
        await axios.delete(URL_DEV + 'mercadotecnia/solicitud-pagos/' + solicitud.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'La solicitud fue registrado con éxito.')
                this.getSolicitudesEgresoAxios()
                this.setState({ ...this.state, modalDelete: false, title: 'Nueva solicitud de egreso', solicitud: '' })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteAdjuntoAxios = async(id) => {
        const { access_token } = this.props.authUser
        const { solicitud } = this.state
        waitAlert()
        await axios.delete(URL_DEV + 'mercadotecnia/solicitud-pagos/adjuntos/'+solicitud.id+'/'+id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El archivo fue eliminado con éxito.')
                const { solicitud } = response.data
                const { form } = this.state
                let aux = []
                if(solicitud.adjunto){
                    aux = [solicitud.adjunto]
                }
                form.adjuntos.adjunto.files = aux
                this.setState({
                    ...this.state,
                    form,
                    solicitud: solicitud,
                });
                this.getSolicitudesEgresoAxios()
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    sendPresupuestoAxios = async(files, item) => {
        const { access_token } = this.props.authUser
        const { solicitud } = this.state
        const data = new FormData();
        files.map((file) => {
            data.append(`files_name_adjunto[]`, file.name)
            data.append(`files_adjunto[]`, file)
            return ''
        })
        waitAlert()
        await axios.post(URL_DEV + 'mercadotecnia/solicitud-pagos/adjuntos/'+solicitud.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El archivo fue eliminado con éxito.')
                const { solicitud } = response.data
                const { form } = this.state
                let aux = []
                if(solicitud.adjunto){
                    aux = [solicitud.adjunto]
                }
                form.adjuntos.adjunto.files = aux
                this.setState({
                    ...this.state,
                    form,
                    solicitud: solicitud,
                });
                this.getSolicitudesEgresoAxios()
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
        const { modalDelete, modalSee, modalAdjuntos, solicitud, form } = this.state
        return (
            <Layout active={'mercadotecnia'}  {...this.props}>
                <NewTableServerRender  columns = { SOLICITUD_EGRESO_COLUMNS }  title = 'Solicitudes de pagos' 
                    subtitle = 'Listado de solicitudes de pagos' mostrar_boton = { true } abrir_modal = { false }
                    url = '/mercadotecnia/solicitud-de-pagos/add' mostrar_acciones = { true }
                    actions = { 
                        { 
                            'edit': { function: this.changePageEdit }, 
                            'delete': { function: this.openModalDelete },
                            'see': { function: this.openModalSee },
                            'adjuntos': { function: this.openModalAdjuntos },
                            'convert': { function: this.changePageConvert }
                        } 
                    }
                    cardTable = 'cardTable' cardTableHeader = 'cardTableHeader' cardBody = 'cardBody'
                    idTable = 'kt_datatable_solicitudes_egresos' accessToken = { this.props.authUser.access_token }
                    setter = { this.setSolicitudes } urlRender = { `${URL_DEV}v2/mercadotecnia/solicitud-de-pago` } />
                <ModalDelete title = "¿Quieres eliminar la solicitud de egreso?" show = { modalDelete } 
                    handleClose = { this.handleCloseDelete } onClick={(e) => { e.preventDefault(); this.deleteSolicitudAxios() }} />
                <Modal size = "lg" title = "Solicitud de egreso" show = { modalSee } handleClose = { this.handleCloseSee } >
                    <SolicitudEgresoCard data = { solicitud } />
                </Modal>
                <Modal size = 'lg' title = 'Adjuntos' show = { modalAdjuntos } handleClose = { this.handleCloseAdjuntos } >
                    <ItemSlider items = { form.adjuntos.adjunto.files } item = 'adjunto' deleteFile = { this.deleteFile } 
                        handleChange = { form.adjuntos.adjunto.files.length ? null : this.handleChange } multiple = { false } />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })
export default connect(mapStateToProps, mapDispatchToProps)(SolicitudEgresos);