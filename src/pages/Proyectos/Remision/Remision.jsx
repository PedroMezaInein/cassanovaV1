import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV, REMISION_COLUMNS } from '../../../constants'
import { setArrayTable, setTextTableCenter, setTextTableReactDom, setOptions, setDateTableReactDom } from '../../../functions/setters'
import { errorAlert, printResponseErrorAlert, doneAlert, customInputAlert, waitAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { Modal, ModalDelete } from '../../../components/singles'
import { Button, SelectSearchGray, CalendarDaySwal, InputGray, DoubleSelectSearchGray } from '../../../components/form-components'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import { RemisionCard } from '../../../components/cards'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { Update } from '../../../components/Lottie'
import { printSwalHeader } from '../../../functions/printers'
import $ from "jquery";
class Remisiones extends Component {
    state = {
        modalDelete: false,
        modalSingle: false,
        title: 'Nueva remisión',
        remision: '',
        formeditado: 0,
        form: {
            proyecto: '',
            fecha: new Date(),
            area: '',
            subarea: '',
            descripcion: '',
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
            }
        },
        options: {
            proyectos: [],
            areas: [],
            subareas: []
        },
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const remisiones = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!remisiones)
            history.push('/')
            this.getOptionsAxios()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                this.getRemisionAxios(id)
            }
        }
    }
    openModalDelete = remision => {
        this.setState({
            ...this.state,
            modalDelete: true,
            remision: remision
        })
    }
    openModalSee = remision => {
        this.setState({
            ...this.state,
            modalSingle: true,
            remision: remision
        })
    }
    handleCloseSingle = () => {
        this.setState({
            ...this.state,
            modalSingle: false,
            remision: ''
        })
    }
    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ...this.state,
            modalDelete: !modalDelete,
            remision: '',
        })
    }
    setRemisiones = remisiones => {
        let aux = []
        remisiones.map((remision) => {
            aux.push(
                {
                    actions: this.setActions(remision),
                    fecha: setDateTableReactDom(remision.created_at, this.doubleClick, remision, 'fecha', 'text-center'),
                    proyecto: setTextTableReactDom(remision.proyecto ? remision.proyecto.nombre : '', this.doubleClick, remision, 'proyecto', 'text-center'),
                    area: remision.subarea ? remision.subarea.area ? setTextTableReactDom(remision.subarea.area.nombre, this.doubleClick, remision, 'area', 'text-center') : '' : '',
                    subarea: remision.subarea ? setTextTableReactDom(remision.subarea.nombre, this.doubleClick, remision, 'subarea', 'text-center') : '',
                    descripcion: setTextTableReactDom(remision.descripcion !== null ? remision.descripcion :'', this.doubleClick, remision, 'descripcion', 'text-justify'),
                    adjunto: remision.adjunto ? renderToString(setArrayTable([{ text: remision.adjunto.name, url: remision.adjunto.url }])) : renderToString(setTextTableCenter('Sin adjuntos')),
                    id: remision.id
                }
            )
            return false
        })
        return aux
    }
    doubleClick = (data, tipo) => {
        const { form, options } = this.state
        switch(tipo){
            case 'proyecto':
            case 'subarea':
                if(data[tipo])
                    form[tipo] = data[tipo].id.toString()
                break
            case 'area':
                if(data.subarea){
                    if(data.subarea.area){
                        form.area = data.subarea.area.id.toString()
                        form.subarea = data.subarea.id.toString()
                        options.subareas = setOptions(data.subarea.area.subareas, 'nombre', 'id')
                    }
                }
                break
            case 'fecha':
                form.fecha = new Date(data.created_at)
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
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } />
                }
                {
                    tipo === 'fecha' ?
                        <CalendarDaySwal value = { form[tipo] } onChange = { (e) => {  this.onChangeSwal(e.target.value, tipo)} } name = { tipo } date = { form[tipo] } withformgroup={0} />
                    :<></>
                }
                {
                    (tipo === 'proyecto') || (tipo === 'subarea') ?
                        <SelectSearchGray options = { this.setOptions(data, tipo) }
                        onChange = { (value) => { this.onChangeSwal(value, tipo)} } name = { tipo }
                        value = { form[tipo] } customdiv="mb-2 mt-7" requirevalidation={1} 
                        placeholder={this.setSwalPlaceholder(tipo)} withicon={1}/>
                    :<></>
                }
                {
                    tipo === 'area' &&
                        <DoubleSelectSearchGray options = { options } form = { form } onChange = { this.onChangeSwal } 
                        one = { { placeholder: 'SELECCIONA EL ÁREA', name: 'area', opciones: 'areas'} } 
                        two = { { placeholder: 'SELECCIONA EL SUBÁREA', name: 'subarea', opciones: 'subareas'} }/>
                }
            </div>,
            <Update />,
            () => { this.patchRemision(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    setSwalPlaceholder = (tipo) => {
        switch(tipo){
            case 'proyecto':
                return 'SELECCIONA EL PROYECTO'
            case 'subarea':
                return 'SELECCIONA EL SUBÁREA'
            default:
                return ''
        }
    }
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    patchRemision = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = ''
        if(tipo === 'area')
            value = { area: form.area, subarea: form.subarea }
        else
            value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/proyectos/remision/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getRemisionesAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'La remisión fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    setOptions = (data, tipo) => {
        const { options } = this.state
        switch(tipo){
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
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch(element){
                default:
                    form[element] = ''
                break;
            }
        })
        return form
    }
    setActions = () => {
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
                tooltip: { id: 'see', text: 'Mostrar', type: 'success' },
            },
            {
                text: 'Convertir&nbsp;a&nbsp;solicitud&nbsp;de&nbsp;compra',
                btnclass: 'info',
                iconclass: 'flaticon2-refresh',
                action: 'convert',
                tooltip: { id: 'convert', text: 'Convertir', type: 'success' },
            }
        )
        return aux
    }
    changePageConvert = remision => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/solicitud-compra/convert',
            state: { remision: remision },
            formeditado: 1
        });
    }
    changePageEdit = remision => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/remision/edit',
            state: { remision: remision },
            formeditado: 1
        });
    }
    async getRemisionesAxios() {
        $('#kt_datatable_remisiones').DataTable().ajax.reload();
    }
    async getRemisionAxios(id) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'remision/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { remision } = response.data
                this.setState({
                    ...this.state,
                    modalSingle: true,
                    remision: remision,
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async deleteRemisionAxios() {
        const { access_token } = this.props.authUser
        const { remision } = this.state
        await axios.delete(URL_DEV + 'remision/' + remision.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getRemisionesAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'La remisión fue eliminada con éxito.')
                this.setState({
                    ...this.state,
                    modalDelete: false,
                    remision: '',
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'remision/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyectos, areas } = response.data
                const { options } = this.state
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                this.setState({
                    ...this.state,
                    options
                })
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
        const { modalDelete, modalSingle, remision } = this.state
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <NewTableServerRender 
                    columns = { REMISION_COLUMNS }
                    title = 'Remisiones' 
                    subtitle = 'Listado de remisiones'
                    mostrar_boton = { true }
                    abrir_modal = { false }
                    url = '/proyectos/remision/add'
                    mostrar_acciones = { true }
                    actions = {
                        {
                            'edit': { function: this.changePageEdit },
                            'delete': { function: this.openModalDelete },
                            'convert': { function: this.changePageConvert },
                            'see': { function: this.openModalSee }
                        }
                    }
                    cardTable = 'cardTable'
                    cardTableHeader = 'cardTableHeader'
                    cardBody = 'cardBody'
                    idTable = 'kt_datatable_remisiones'
                    accessToken={this.props.authUser.access_token}
                    setter={this.setRemisiones}
                    urlRender={URL_DEV + 'remision'}
                />
                <ModalDelete 
                    title = "¿Estás seguro que deseas eliminar la remisión?" 
                    show = { modalDelete } 
                    handleClose = { this.handleCloseDelete } 
                    onClick = { (e) => { e.preventDefault(); this.deleteRemisionAxios() }} />
                <Modal size="xl" title="Remisión" show={modalSingle} handleClose={this.handleCloseSingle} >
                    <RemisionCard data={remision}>
                        {
                            remision.convertido ? '' :
                                <Button pulse="pulse-ring" className="btn btn-icon btn-light-info pulse pulse-info" onClick={(e) => { e.preventDefault(); this.changePageConvert(remision) }} icon={faSync}
                                    tooltip={{ text: 'COMPRAR' }} />
                        }
                    </RemisionCard>
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Remisiones);