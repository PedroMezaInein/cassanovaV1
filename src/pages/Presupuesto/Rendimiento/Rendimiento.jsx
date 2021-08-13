import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, RENDIMIENTOS_COLUMNS } from '../../../constants'
import { setTextTableReactDom, setMoneyTableReactDom, setOptions} from '../../../functions/setters'
import { replaceAll } from '../../../functions/functions'
import { doneAlert, printResponseErrorAlert, errorAlert, waitAlert, customInputAlert } from '../../../functions/alert'
import { printSwalHeader } from '../../../functions/printers'
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal } from '../../../components/singles'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { RendimientoCard } from '../../../components/cards'
import { Update } from '../../../components/Lottie'
import Swal from 'sweetalert2'
import { InputGray, InputNumberGray, SelectSearchGray } from '../../../components/form-components'
import $ from "jquery";
class Rendimientos extends Component {
    state = {
        modalDelete: false,
        modalSee: false,
        rendimientos: [],
        rendimiento: '',
        form: {
            unidad: '',
            proveedor: '',
            descripcion: '',
            materiales: '',
            costo: '',
            rendimiento: ''
        },
        options:{
            unidades: [],
            proveedores: [],
        }
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const rendimientos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getOptionsAxios()
        if (!rendimientos)
            history.push('/')
    }
    changePageEdit = (rendimiento) => {
        const { history } = this.props
        history.push({
            pathname: '/presupuesto/rendimiento/edit',
            state: { rendimiento: rendimiento}
        });
    }
    openModalDelete = rendimiento => {
        this.setState({
            ...this.state,
            modalDelete: true,
            rendimiento: rendimiento
        })
    }
    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ...this.state,
            modalDelete: !modalDelete,
            rendimiento: '',
        })
    }
    openModalSee = rendimiento => {
        this.setState({
            ...this.state,
            modalSee: true,
            rendimiento: rendimiento
        })
    }
    handleCloseSee = () => {
        this.setState({
            ...this.state,
            modalSee: false,
            rendimiento: ''
        })
    }
    setRendimientos = rendimientos => {
        let aux = []
        rendimientos.map((rendimiento) => {
            aux.push(
                {
                    actions: this.setActions(rendimiento),
                    materiales: setTextTableReactDom(rendimiento.materiales, this.doubleClick, rendimiento, 'materiales', 'text-center'),
                    unidad: rendimiento.unidad ? setTextTableReactDom(rendimiento.unidad.nombre, this.doubleClick, rendimiento, 'unidad', 'text-center') : '',
                    costo: setMoneyTableReactDom(rendimiento.costo, this.doubleClick, rendimiento, 'costo'),
                    proveedor: setTextTableReactDom(rendimiento.proveedor ? rendimiento.proveedor.razon_social : '', this.doubleClick, rendimiento, 'proveedor', 'text-center'),
                    rendimiento: setTextTableReactDom(rendimiento.rendimiento, this.doubleClick, rendimiento, 'rendimiento', 'text-center'),
                    descripcion: setTextTableReactDom(rendimiento.descripcion, this.doubleClick, rendimiento, 'descripcion', 'text-justify'),
                    id: rendimiento.id
                }
            )
            return false
        })
        return aux
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
                tooltip: {id:'see', text:'Mostrar', type:'info'}
            }
        )
        return aux
    }
    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
            case 'proveedor':
            case 'unidad':
            case 'subpartida':
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
                {
                    ( tipo === 'materiales') || (tipo === 'rendimiento') ?
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } swal = { true }
                            onChange = { (e) => { this.onChange(e.target.value, tipo)} }  />
                    :<></>
                }
                {
                    tipo === 'descripcion' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } rows  = { 6 } as = 'textarea'
                            onChange = { (e) => { this.onChange(e.target.value, tipo)} } swal = { true } letterCase = { false } />
                }
                {
                    tipo === 'costo' &&
                        <InputNumberGray withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } prefix = '$' thousandSeparator = { true }
                            onChange = { (e) => { this.onChange(e.target.value, tipo)} } swal = { true } />
                }
                {
                    (tipo !== 'descripcion') && (tipo !== 'costo') && (tipo !== 'materiales') &&  (tipo !== 'rendimiento') &&
                        <SelectSearchGray options = { this.setOptions(data, tipo) }
                            onChange = { (value) => { this.onChange(value, tipo)} } name = { tipo }
                            value = { form[tipo] } customdiv="mb-2 mt-7" withicon={1}/>
                }
            </div>,
            <Update />,
            () => { this.patchRendimiento(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    onChange = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
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
    patchRendimiento = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = ''
        switch(tipo){
            case 'costo':
                value = replaceAll(form[tipo], ',', '')
                value = replaceAll(value, '$', '')
                break;
            default:
                value = form[tipo]
                break;
        }
        waitAlert()
        await axios.put(`${URL_DEV}v2/presupuesto/rendimientos/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getRemisionesAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    setOptions = (data, tipo) => {
        const { options } = this.state
        switch(tipo){
            case 'proveedor':
                return options.proveedores
            case 'unidad':
                return options.unidades
            default: return []
        }
    }
    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rendimientos/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { unidades, proveedores } = response.data
                const { options } = this.state
                options['unidades'] = setOptions(unidades, 'nombre', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
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
    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar rendimiento')
            this.editRendimientoAxios()
        else
            this.addRendimientoAxios()
    }
    async getRemisionesAxios() {
        $('#kt_datatable_rendimiento').DataTable().ajax.reload();
    }
    async deleteRendimientoAxios() {
        const { access_token } = this.props.authUser
        const { rendimiento } = this.state
        await axios.delete(URL_DEV + 'rendimientos/' + rendimiento.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'La rendimiento fue registrado con éxito.')                
                this.getRemisionesAxios()
                this.setState({
                    ...this.state,
                    modalDelete: false,
                    rendimiento: ''
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
        const { modalDelete, modalSee, rendimiento} = this.state
        return (
            <Layout active={'presupuesto'}  {...this.props}>
                <NewTableServerRender
                    columns={RENDIMIENTOS_COLUMNS} 
                    title='Rendimientos' 
                    subtitle='Listado de rendimientos'
                    mostrar_boton={true}
                    abrir_modal={false}
                    mostrar_acciones={true}
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete },
                        'see': { function: this.openModalSee },
                    }}
                    url='/presupuesto/rendimiento/add'
                    idTable = 'kt_datatable_rendimiento'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    accessToken={this.props.authUser.access_token}
                    setter={this.setRendimientos}
                    urlRender={`${URL_DEV}v2/presupuesto/rendimientos`}
                    />
                <ModalDelete title={"¿Estás seguro que deseas eliminar el rendimiento?"} show={modalDelete} handleClose={this.handleCloseDelete} onClick={(e) => { e.preventDefault(); this.deleteRendimientoAxios() }}>
                </ModalDelete>
                <Modal size="lg" title="Rendimiento" show = { modalSee } handleClose = { this.handleCloseSee } >
                    <RendimientoCard 
                        rendimiento={rendimiento}
                    />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Rendimientos);