import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV, SOLICITUD_EGRESO_COLUMNS } from '../../../constants'
import { setDateTableReactDom, setMoneyTableReactDom, setArrayTable, setTextTableCenter, setOptions, setTextTableReactDom, setSelectOptions } from '../../../functions/setters'
import { errorAlert, printResponseErrorAlert, doneAlert, waitAlert, deleteAlert, questionAlert, customInputAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal, ItemSlider } from '../../../components/singles'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { SolicitudEgresoCard } from '../../../components/cards'
import { Update } from '../../../components/Lottie'
import { printSwalHeader } from '../../../functions/printers'
import { Form } from 'react-bootstrap'
import { CalendarDaySwal, SelectSearchGray, InputGray, InputNumberGray } from '../../../components/form-components'
import moment from 'moment'
import { replaceMoney } from '../../../functions/functions'
import $ from "jquery";
class SolicitudEgresos extends Component {

    state = {
        modalDelete: false,
        modalSee: false,
        modalAdjuntos: false,
        title: 'Nueva solicitud de egreso',
        solicitud: '',
        form: {
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
            factura: 'Sin factura',
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Presupuesto',
                    files: []
                }
            }
        },
        options: {
            proveedores: [],
            empresas: [],
            subareas: [],
            tiposPagos: [],
            facturas: [
                { text: "Si", value: "Con factura" },
                { text: "No", value: "Sin factura" },
            ],
        },
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
            this.getOptionsAxios()
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
    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'mercadotecnia/solicitud-pagos/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas, subareas, tipos, proveedores } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                options['subareas'] = setOptions(subareas, 'nombre', 'id')
                options['tiposPagos'] = setSelectOptions(tipos, 'tipo')
                this.setState({ ...this.state, options })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
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
                    empresa: setTextTableReactDom(solicitud.empresa ? solicitud.empresa.name : 'Sin definir', this.doubleClick, solicitud, 'empresa', 'text-center'),
                    proveedor: setTextTableReactDom(solicitud.proveedor.razon_social, this.doubleClick, solicitud, 'proveedor', 'text-center'),
                    factura: setTextTableReactDom(solicitud.factura ? 'Con factura' : 'Sin factura', this.doubleClick, solicitud, 'factura', 'text-center'),
                    monto: setMoneyTableReactDom(solicitud.monto, this.doubleClick, solicitud, 'monto'),
                    tipoPago: setTextTableReactDom(solicitud.tipo_pago.tipo, this.doubleClick, solicitud, 'tipoPago', 'text-center'),
                    subarea: solicitud.subarea ? setTextTableReactDom(solicitud.subarea.nombre, this.doubleClick, solicitud, 'subarea', 'text-center') : '',
                    fecha: setDateTableReactDom(solicitud.fecha, this.doubleClick, solicitud, 'fecha', 'text-center'),
                    adjunto: solicitud.adjunto ? renderToString(setArrayTable([{ text: solicitud.adjunto.name, url: solicitud.adjunto.url }])) : renderToString(setTextTableCenter('Sin adjuntos')),
                    descripcion: setTextTableReactDom(solicitud.descripcion !== null ? solicitud.descripcion :'', this.doubleClick, solicitud, 'descripcion', 'text-justify'),
                    id: solicitud.id
                }
            )
            return false
        })
        return aux
    }
    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
            case 'proveedor':
            case 'empresa':
            case 'subarea':
                if(data[tipo])
                    form[tipo] = data[tipo].id.toString()
                break
            case 'fecha':
                form.fecha = new Date(moment(data.fecha))
                break
            case 'tipoPago':
                form[tipo] = data.tipo_pago.id
                break
            case 'factura':
                if (data.factura)
                    form.factura = 'Con factura'
                else
                    form.factura = 'Sin factura'
                break
            default:
                form[tipo] = data[tipo]
                break
        }
        this.setState({ ...this.state, form })
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) } </h2>
                {
                    tipo === 'descripcion' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } rows  = { 6 } as = 'textarea'
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }  />
                }
                {
                    tipo === 'monto' &&
                        <InputNumberGray withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } prefix = '$' thousandSeparator = { true }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } />
                }
                {
                    (tipo === 'tipoPago') || (tipo === 'factura') ?
                        <div className="input-icon my-3">
                            <span className="input-icon input-icon-right">
                                <span>
                                    <i className={"flaticon2-search-1 icon-md text-dark-50"}></i>
                                </span>
                            </span>
                            <Form.Control className = "form-control text-uppercase form-control-solid"
                                onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } name = { tipo }
                                defaultValue = { form[tipo] } as = "select">
                                <option value={0} disabled>{this.setSwalPlaceholder(tipo)}</option>
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
                    (tipo === 'proveedor')  || (tipo === 'empresa') || (tipo === 'subarea') ?
                        <SelectSearchGray options = { this.setOptions(data, tipo) }
                        onChange = { (value) => { this.onChangeSwal(value, tipo)} } name = { tipo }
                        value = { form[tipo] } customdiv="mb-2 mt-7" requirevalidation={1} 
                        placeholder={this.setSwalPlaceholder(tipo)} withicon={1}/>
                    :<></>
                }
            </div>,
            <Update />,
            () => { this.patchSolicitudEgresos(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    patchSolicitudEgresos = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = ''
        switch(tipo){
            case 'monto':
                value = replaceMoney(form[tipo])
                break
            default: 
                value = form[tipo]    
                break
        }
        waitAlert()
        await axios.put(`${URL_DEV}v2/mercadotecnia/solicitud-de-pago/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getSolicitudesEgresoAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'La solicitud de pago fue editada con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    setSwalPlaceholder = (tipo) => {
        switch(tipo){
            case 'proveedor':
                return 'SELECCIONA EL PROVEEDOR'
            case 'empresa':
                return 'SELECCIONA LA EMPRESA'
            case 'tipoPago':
                return 'SELECCIONA EL TIPO DE PAGO'
            case 'subarea':
                return 'SELECCIONA EL SUBÁREA'
            case 'factura':
                return '¿LLEVA FACTURA?'
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
            case 'tipoPago':
                return options.tiposPagos
            case 'empresa':
                return options.empresas
            case 'proveedor':
                return options.proveedores
            case 'subarea':
                if(data.subarea)
                    if(data.subarea.area)
                        if(data.subarea.area.subareas)
                            return setOptions(data.subarea.area.subareas, 'nombre', 'id')
                return []
            case 'area':
                return options.areas
            case 'factura':
                return options.facturas
            default: return []
        }
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'tipoPago':
                    form[element] = 0
                    break;
                case 'fecha':
                    form[element] = new Date()
                    break;
                case 'adjuntos':
                    form[element] = { adjunto: { value: '', placeholder: 'Presupuesto', files: [] } }
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
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
            console.error(error, 'error')
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
            console.error(error, 'error')
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
            console.error(error, 'error')
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
            console.error(error, 'error')
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