import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, CLIENTES_COLUMNS} from '../../../constants'
import { Small } from '../../../components/texts'
import { Modal, ModalDelete } from '../../../components/singles'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { setTextTable, setDateTable, setListTableLinkProyecto } from '../../../functions/setters'
import { waitAlert, errorAlert, forbiddenAccessAlert, doneAlert } from '../../../functions/alert'
import { ClienteCard } from '../../../components/cards'
const $ = require('jquery');

class Leads extends Component {
    state = {
        modal: {
            delete: false,
            see: false,
            prospecto: false,
        },
        clientes: [],
        cliente: '',
        data: {
            clientes: []
        }
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const clientes = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!clientes)
            history.push('/')
    }
    setClientes = clientes => {
        let aux = []
        clientes.map((cliente) => {
            aux.push({
                actions: this.setActions(cliente),
                empresa: renderToString(setTextTable(cliente.empresa)),
                nombre: renderToString(setTextTable(cliente.nombre)),
                contacto: renderToString(setTextTable(cliente.contacto)),
                proyecto: renderToString(cliente.proyectos.length === 0 ? setTextTable("Sin definir") : setListTableLinkProyecto(cliente.proyectos, "nombre")),
                direccion: renderToString(this.setDireccion(cliente)),
                perfil: renderToString(setTextTable(cliente.perfil)),
                puesto: renderToString(setTextTable(cliente.puesto)),
                rfc: renderToString(setTextTable(cliente.rfc)),
                fecha: renderToString(setDateTable(cliente.created_at)),
                id: cliente.id
            })
            return false
        })
        return aux
    }

    
    setDireccion = cliente => {
        return (
            <>
                <Small className="mr-1">
                    {cliente.calle}, colonia
                </Small>
                <Small className="mr-1">
                    {cliente.colonia},
                </Small>
                <Small className="mr-1">
                    {cliente.municipio},
                </Small>
                <Small className="mr-1">
                    {cliente.estado}. CP:
                </Small>
                <Small className="mr-1">
                    {cliente.cp}
                </Small>
            </>
        )
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
            },
            {
                text: 'Agregar&nbsp;prospecto',
                btnclass: 'info',
                iconclass: 'flaticon2-user-1',
                action: 'prospecto',
                tooltip: { id: 'prospecto', text: 'Agregar prospecto' }
            }
        )
        return aux
    }
    async getClientesAxios() {
        $('#clientes').DataTable().ajax.reload();
    }
    changePageEdit = cliente => {
        const { history } = this.props
        history.push({
            pathname: '/leads/clientes/edit',
            state: { cliente: cliente }
        });
    }
    openModalDelete = cliente => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            cliente
        })
    }
    handleDeleteModal = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ...this.state,
            modal,
            cliente: ''
        })
    }
    openModalSee = cliente => {
        const { modal } = this.state
        modal.see = true
        this.setState({
            ...this.state,
            modal,
            cliente: cliente
        })
    }
    handleCloseSee = () => {
        const { modal } = this.state
        modal.see = false
        this.setState({
            ...this.state,
            modal,
            cliente: ''
        })
    }
    openModalAddProspecto = cliente => {
        const { modal } = this.state
        modal.prospecto = true
        this.setState({
            ...this.state,
            modal,
            cliente: cliente
        })
    }
    handleCloseAddProspecto = () => {
        const { modal } = this.state
        modal.prospecto = false
        this.setState({
            ...this.state,
            modal,
            cliente: ''
        })
    }
    async deleteClienteAxios() {
        const { access_token } = this.props.authUser
        const { cliente } = this.state
        await axios.delete(URL_DEV + 'cliente/' + cliente.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getClientesAxios()
                const { modal } = this.state
                modal.delete = false
                this.setState({
                    ...this.state,
                    modal,
                    cliente: ''
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Cliente eliminada con éxito.')
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

    render() {
        const { modal, cliente } = this.state
        return (
            <Layout active={'leads'}  {...this.props}>
                <NewTableServerRender
                    columns={CLIENTES_COLUMNS}
                    title='Clientes'
                    subtitle='Listado de clientes'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url='/leads/clientes/add'
                    mostrar_acciones={true}
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete },
                        'see': { function: this.openModalSee },
                        'prospecto': { function: this.openModalAddProspecto }
                    }}
                    accessToken={this.props.authUser.access_token}
                    setter={this.setClientes}
                    urlRender={URL_DEV + 'cliente'}
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    idTable='clientes'
                />
                <ModalDelete
                    title={cliente === null ? "¿Estás seguro que deseas eliminar a " : "¿Estás seguro que deseas eliminar a " + cliente.empresa + " ?"}
                    show={modal.delete}
                    handleClose={this.handleDeleteModal}
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteClienteAxios() }}
                />
                <Modal size="lg" title="Cliente" show={modal.see} handleClose={this.handleCloseSee} >
                    <ClienteCard cliente={cliente} />
                </Modal>
                <Modal title="Agregar prospecto" show={modal.prospecto} handleClose={this.handleCloseAddProspecto} >
                    {/* <ProspectoForm
                    
                    /> */}
                    Formulario prospecto
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

export default connect(mapStateToProps, mapDispatchToProps)(Leads);