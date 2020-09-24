import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, PROVEEDORES_COLUMNS } from '../../../constants'
import { setTextTable, setDateTable, setMoneyTable, setArrayTable } from '../../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert, doneAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal } from '../../../components/singles'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { ProveedorCard } from '../../../components/cards'

const $ = require('jquery');
class Proveedor extends Component {

    state = {
        modalDelete: false,
        modalSee: false,
        lead: '',
        proveedor: '',
        proveedores: [],
        data: {
            proveedores: []
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const proveedor = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!proveedor)
            history.push('/')
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
                    area: renderToString(setTextTable(proveedor.subarea ? proveedor.subarea.area.nombre : 'Sin definir')),
                    subarea: renderToString(setTextTable(proveedor.subarea ? proveedor.subarea.nombre : 'Sin definir')),
                    total: renderToString(setMoneyTable(proveedor.sumatoria_compras + proveedor.sumatoria_egresos)),
                    fecha: renderToString(setDateTable(proveedor.created_at)),
                    id: proveedor.id
                }
            )
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
                text: 'Ver',
                btnclass: 'info',
                iconclass: 'flaticon2-expand',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            }
        )
        return aux
    }

    changePageEdit = (proveedor) => {
        const { history } = this.props
        history.push({
            pathname: '/administracion/proveedores/edit',
            state: { proveedor: proveedor }
        });
    }

    openModalDelete = proveedor => {
        this.setState({
            ... this.state,
            modalDelete: true,
            proveedor: proveedor
        })
    }

    handleCloseDelete = () => {
        this.setState({
            modalDelete: false,
            proveedor: ''
        })
    }

    openModalSee = proveedor => {
        this.setState({
            ... this.state,
            modalSee: true,
            proveedor: proveedor
        })
    }

    handleCloseSee = () => {
        this.setState({
            ... this.state,
            modalSee: false,
            proveedor: ''
        })
    }

    async deleteProveedor() {
        const { access_token } = this.props.authUser
        const { proveedor } = this.state
        await axios.delete(URL_DEV + 'proveedores/' + proveedor.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proveedores } = response.data
                const { data } = this.state
                data.proveedores = proveedores
                this.setState({
                    ... this.state,
                    proveedores: this.setProveedores(proveedores),
                    data,
                    modalDelete: false,
                    proveedor: ''
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El provedor fue eliminado con éxito.')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getProveedorAxios() {
        $('#proveedor_table').DataTable().ajax.reload();
    }

    render() {
        const { modalDelete, modalSee, proveedor } = this.state
        return (
            <Layout active={'administracion'}  {...this.props}>
                <NewTableServerRender
                    columns={PROVEEDORES_COLUMNS}
                    title='Proveedores'
                    subtitle='Listado de proveedores'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url='/administracion/proveedores/add'
                    mostrar_acciones={true}
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete },
                        'see': { function: this.openModalSee },
                    }}
                    accessToken={this.props.authUser.access_token}
                    setter={this.setProveedores}
                    urlRender={URL_DEV + 'proveedores'}
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    idTable='proveedor_table'
                />
                <ModalDelete
                    title={"¿Deseas eliminar el proveedor?"}
                    show={modalDelete}
                    handleClose={this.handleCloseDelete}
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteProveedor() }}
                >
                </ModalDelete>
                <Modal title="Proveedor" show={modalSee} handleClose={this.handleCloseSee} >
                    <ProveedorCard proveedor={proveedor} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Proveedor);