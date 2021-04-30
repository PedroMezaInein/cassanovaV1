import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal } from '../../../components/singles'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { PROVEEDORES_MERCA_COLUMNS, URL_DEV } from '../../../constants'
import { doneAlert, errorAlert, printResponseErrorAlert, waitAlert, customInputAlert } from '../../../functions/alert'
import { setTextTableReactDom, setOptions } from '../../../functions/setters'
import axios from 'axios'
import Swal from 'sweetalert2'
import { ProveedorCard } from '../../../components/cards'
import { printSwalHeader } from '../../../functions/printers'
import { Update } from '../../../components/Lottie'
import { InputGray, SelectSearchGray } from '../../../components/form-components'
import $ from "jquery";
class Proveedores extends Component{

    state = {
        modal_delete: false,
        modal_see: false,
        form: {
            nombre: '', rfc: '', razonSocial: '', correo: '', telefono: '', numCuenta: '', tipo: 0, banco: 0, subarea: ''
        },
    }

    setProveedores = proveedores => {
        let aux = []
        proveedores.map((proveedor) => {
            aux.push(
                {
                    actions: this.setActions(proveedor),
                    razonSocial: setTextTableReactDom(proveedor.razon_social, this.doubleClick, proveedor, 'razonSocial', 'text-center'),
                    rfc: setTextTableReactDom(proveedor.rfc ? proveedor.rfc : '', this.doubleClick, proveedor, 'rfc', 'text-center'),
                    subarea: setTextTableReactDom( proveedor.subarea ? proveedor.subarea.nombre : '', this.doubleClick, proveedor, 'subarea', 'text-center'),
                    id: proveedor.id
                }
            )
            return false
        })
        return aux
    }
    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
            case 'subarea':
                if(data[tipo])
                    form[tipo] = data[tipo].id.toString()
                break
            case 'razonSocial':
                form.razonSocial = data.razon_social
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
                    (tipo === 'razonSocial') || (tipo === 'rfc') ?
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }
                        />
                    :<></>
                }
                {
                    (tipo === 'subarea')  &&
                        <SelectSearchGray options = { this.setOptions(data, tipo) } value = { form[tipo] } customdiv="mb-2 mt-7"
                            onChange = { (value) => { this.onChangeSwal(value, tipo)} } name = { tipo } requirevalidation={1} 
                            placeholder={this.setSwalPlaceholder(tipo)}
                        />
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
    patchProveedores = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/leads/proveedores/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getProveedoresAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'La proveedor fue editado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
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
        history.push({
            pathname: '/mercadotecnia/merca-proveedores/edit',
            state: { proveedor: proveedor }
        });
    }

    openModalDelete = proveedor => { this.setState({ ...this.state, modal_delete: true, proveedor: proveedor }) }
    handleCloseModalDelete = () => { this.setState({ ...this.state, modal_delete: false, proveedor: '' }) }

    openModalSee = proveedor => {  this.setState({ ...this.state, modal_see: true, proveedor: proveedor }) }
    handleCloseSee = () => { this.setState({ ...this.state, modal_see: false, proveedor: '' }) }

    deleteProveedorAxios = async() => {
        const { access_token } = this.props.authUser
        const { proveedor } = this.state
        waitAlert()
        await axios.delete(URL_DEV + 'mercadotecnia/proveedores/' + proveedor.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Proveedor eliminado con éxito.')
                this.setState({ ...this.state, modal_delete: false, proveedor: '' })
                this.getProveedoresAxios()
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getProveedoresAxios = async() => { $('#kt_datatable_proveedores').DataTable().ajax.reload(); }

    render(){
        const { modal_delete, modal_see, proveedor } = this.state
        return(
            <Layout active = 'mercadotecnia' {...this.props} >
                <NewTableServerRender  columns = { PROVEEDORES_MERCA_COLUMNS }  title = 'PROVEEDORES' 
                    subtitle = 'Listado de proveedores' mostrar_boton = { true } abrir_modal = { false }
                    mostrar_acciones = { true } onClick = { this.openModal } cardTable = 'cardTable'
                    actions = { { 'edit': { function: this.changePageEdit }, 'delete': { function: this.openModalDelete }, 'see': { function: this.openModalSee } } }
                    idTable = 'kt_datatable_proveedores' cardTableHeader = 'cardTableHeader' cardBody = 'cardBody'
                    accessToken = { this.props.authUser.access_token } setter =  {this.setProveedores }
                    urlRender = { URL_DEV + 'mercadotecnia/proveedores' } url = '/mercadotecnia/merca-proveedores/add'
                />
                <ModalDelete title = '¿Quieres eliminar el proveedor?' show = { modal_delete } handleClose = { this.handleCloseModalDelete } 
                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.deleteProveedorAxios() }}>
                </ModalDelete>
                <Modal size = "lg" title = "Proveedor" show = { modal_see } handleClose = { this.handleCloseSee } >
                    <ProveedorCard proveedor = { proveedor } />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Proveedores)