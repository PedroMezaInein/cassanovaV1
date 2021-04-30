import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV, PROVEEDORES_COLUMNS, TEL } from '../../../constants'
import { setDateTable, setMoneyTable, setArrayTable, setTextTableReactDom, setOptions, setArrayTableReactDom } from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert, customInputAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal } from '../../../components/singles'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { ProveedorCard } from '../../../components/cards'
import { printSwalHeader } from '../../../functions/printers'
import { Update } from '../../../components/Lottie'
import { InputGray, SelectSearchGray, InputPhoneGray, DoubleSelectSearchGray } from '../../../components/form-components'
import $ from "jquery";
class Proveedor extends Component {

    state = {
        modalDelete: false,
        modalSee: false,
        lead: '',
        proveedor: '',
        proveedores: [],
        data: {
            proveedores: []
        },
        form: {
            nombre: '',
            razonSocial: '',
            rfc: '',
            correo: '',
            telefono: '',
            cuenta: '',
            numCuenta: '',
            tipo: 0,
            banco: 0,
            leadId: '',
            area: '',
            subarea: ''
        },
        options: {
            areas: [],
            subareas: [],
            bancos: [],
            tipos: []
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const proveedor = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!proveedor)
            history.push('/')
        this.getOptionsAxios()
    }

    setProveedores = proveedores => {
        let aux = []
        proveedores.map((proveedor) => {
            aux.push(
                {
                    actions: this.setActions(proveedor),
                    nombre: setTextTableReactDom(proveedor.nombre, this.doubleClick, proveedor, 'nombre', 'text-center'),
                    razonSocial: setTextTableReactDom(proveedor.razon_social, this.doubleClick, proveedor, 'razonSocial', 'text-center'),
                    rfc: setTextTableReactDom(proveedor.rfc, this.doubleClick, proveedor, 'rfc', 'text-center'),
                    contacto:setArrayTableReactDom(
                        [
                            { 'name': 'Correo', 'text': proveedor.email ? proveedor.email : 'Sin definir' },
                            { 'name': 'Teléfono', 'text': proveedor.telefono ? proveedor.telefono : 'Sin definir' }
                        ],'120px', this.doubleClick, proveedor, 'contacto'
                    ),
                    cuenta: renderToString(setArrayTable(
                        [
                            { 'name': 'No. Cuenta', 'text': proveedor.numero_cuenta ? proveedor.numero_cuenta : 'Sin definir' },
                            { 'name': 'Banco', 'text': proveedor.banco ? proveedor.banco.nombre : 'Sin definir' },
                            { 'name': 'Tipo Cuenta', 'text': proveedor.tipo_cuenta ? proveedor.tipo_cuenta.tipo : 'Sin definir' },
                        ],'120px'
                    )),
                    area: setTextTableReactDom(proveedor.subarea ? proveedor.subarea.area ? proveedor.subarea.area.nombre : '' : '', this.doubleClick, proveedor, 'area', 'text-center'),
                    subarea: setTextTableReactDom(proveedor.subarea ? proveedor.subarea.nombre : '', this.doubleClick, proveedor, 'subarea', 'text-center'),
                    total: renderToString(setMoneyTable(proveedor.sumatoria_compras + proveedor.sumatoria_egresos)),
                    fecha: renderToString(setDateTable(proveedor.created_at)),
                    id: proveedor.id
                }
            )
            return false
        })
        return aux
    }

    doubleClick = (data, tipo) => {
        const { form, options } = this.state
        switch(tipo){
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
            case 'razonSocial':
                form.razonSocial = data.razon_social
                break
            case 'contacto':
                form.correo = data.email
                form.telefono = data.telefono
                break
            default:
                form[tipo] = data[tipo]
                break
        }
        this.setState({ ...this.state, form, options})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) } </h2>
                {
                    (tipo === 'nombre') || (tipo === 'razonSocial') || (tipo === 'rfc') ?
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }
                        />
                    :<></>
                }
                {
                    tipo === 'contacto' &&
                    <>
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 1 } placeholder="CORREO ELECTRÓNICO"
                            requirevalidation = { 0 }  value = { form.correo} name = { 'correo' } letterCase = { false } iconclass={"fas fa-envelope"}
                            onChange = { (e) => { this.onChangeSwal(e.target.value, 'correo')} } swal = { true } />
                        
                        <InputPhoneGray withicon={1} iconclass="fas fa-mobile-alt" name="telefono" value={form.telefono} 
                            onChange = { (e) => { this.onChangeSwal(e.target.value, 'telefono')} }
                            patterns={TEL} thousandseparator={false} prefix=''  swal = { true } 
                        />
                    </>
                }
                {
                    (tipo === 'subarea')  ?
                        <SelectSearchGray options = { this.setOptions(data, tipo) } value = { form[tipo] } customdiv="mb-2 mt-7"
                            onChange = { (value) => { this.onChangeSwal(value, tipo)} } name = { tipo } requirevalidation={1} 
                            placeholder={this.setSwalPlaceholder(tipo)}
                        />
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
            () => { this.patchProveedores(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }

    setSwalPlaceholder = (tipo) => {
        switch(tipo){
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
    
    setOptions = (data, tipo) => {
        switch(tipo){
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
                case 'adjuntos':
                    form[element] = { adjuntos: { value: '', placeholder: 'Adjuntos', files: [] } }
                    break;
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
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            }
        )
        return aux
    }

    changePageEdit = (proveedor) => {
        const { history } = this.props
        history.push({ pathname: '/leads/proveedores/edit', state: { proveedor: proveedor } });
    }

    openModalDelete = proveedor => { this.setState({ ...this.state, modalDelete: true, proveedor: proveedor }) }

    handleCloseDelete = () => { this.setState({ modalDelete: false, proveedor: '' }) }

    openModalSee = proveedor => { this.setState({ ...this.state, modalSee: true, proveedor: proveedor }) }

    handleCloseSee = () => { this.setState({ ...this.state, modalSee: false, proveedor: '' }) }
    
    async deleteProveedor() {
        const { access_token } = this.props.authUser
        const { proveedor } = this.state
        await axios.delete(URL_DEV + 'proveedores/' + proveedor.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getProveedorAxios()
                this.setState({ ...this.state,  modalDelete: false, proveedor: '' })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El provedor fue eliminado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    patchProveedores = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = ''
        switch(tipo){
            case 'area':
                value = { area: form.area, subarea: form.subarea }
                break
            case 'contacto':
                value = { telefono: form.telefono, correo: form.correo }
                break
            default: 
                value = form[tipo]    
                break
        }
        waitAlert()
        await axios.put(`${URL_DEV}v2/leads/proveedores/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getProveedorAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'La proveedor fue editado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getOptionsAxios = async() => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(`${URL_DEV}proveedores/options`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { areas } = response.data
                const { options } = this.state
                options.areas = setOptions(areas, 'nombre', 'id')
                this.setState({...this.state, options})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getProveedorAxios() { $('#proveedor_table').DataTable().ajax.reload(); }
    
    render() {
        const { modalDelete, modalSee, proveedor } = this.state
        return (
            <Layout active = 'leads'  {...this.props}>
                <NewTableServerRender columns = { PROVEEDORES_COLUMNS } title = 'Proveedores' subtitle = 'Listado de proveedores' mostrar_boton = { true }
                    abrir_modal = { false } url = '/leads/proveedores/add' mostrar_acciones = { true } accessToken = { this.props.authUser.access_token }
                    actions = { {
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete },
                        'see': { function: this.openModalSee },
                    } } setter = { this.setProveedores } urlRender = { `${URL_DEV}proveedores` } cardTable = 'cardTable' cardTableHeader = 'cardTableHeader'
                    cardBody = 'cardBody' idTable = 'proveedor_table' />
                <ModalDelete title = "¿Deseas eliminar el proveedor?" show = { modalDelete } handleClose = { this.handleCloseDelete }
                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.deleteProveedor() } } />
                <Modal title="Proveedor" show={modalSee} handleClose={this.handleCloseSee} >
                    <ProveedorCard proveedor={proveedor} />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Proveedor);