import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal } from '../../../components/singles'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { PROVEEDORES_MERCA_COLUMNS, URL_DEV } from '../../../constants'
import { doneAlert, errorAlert, forbiddenAccessAlert, waitAlert } from '../../../functions/alert'
import { setArrayTable, setTextTable } from '../../../functions/setters'
import axios from 'axios'
import { ProveedorCard } from '../../../components/cards'

const $ = require('jquery');

class Proveedores extends Component{

    state = {
        modal_delete: false,
        modal_see: false
    }

    setProveedores = proveedores => {
        let aux = []
        proveedores.map((proveedor) => {
            aux.push(
                {
                    actions: this.setActions(proveedor),
                    nombre: renderToString(setTextTable(proveedor.nombre)),
                    razonSocial: renderToString(setTextTable(proveedor.razon_social)),
                    rfc: renderToString(setTextTable(proveedor.rfc)),
                    contacto: renderToString(setArrayTable(
                        [
                            { 'url': `tel:+${proveedor.telefono}`, 'text': proveedor.telefono },
                            { 'url': `mailto:${proveedor.email}`, 'text': proveedor.email }
                        ]
                    )),
                    cuenta: renderToString(setArrayTable(
                        [
                            { 'name': 'No. Cuenta', 'text': proveedor.numero_cuenta ? proveedor.numero_cuenta : 'Sin definir' },
                            { 'name': 'Banco', 'text': proveedor.banco ? proveedor.banco.nombre : 'Sin definir' },
                            { 'name': 'Tipo Cuenta', 'text': proveedor.tipo_cuenta ? proveedor.tipo_cuenta.tipo : 'Sin definir' },
                        ]
                    )),
                    subarea: renderToString(setTextTable(proveedor.subarea ? proveedor.subarea.nombre : 'Sin definir')),
                    id: proveedor.id
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
                console.log(error, 'error')
                if (error.response.status === 401) { forbiddenAccessAlert() } 
                else { errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.') }
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