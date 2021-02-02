import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, ROLES_COLUMNS } from '../../constants'
import { setTextTable, setColor } from '../../functions/setters'
import { waitAlert, errorAlert, forbiddenAccessAlert, doneAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Modal, ModalDelete } from '../../components/singles'
import { RolesMercadotecniaForm } from '../../components/forms'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
const $ = require('jquery');
class RolesMercadotecnia extends Component {
    state = {
        form: {
            rol: '',
            color: ''
        },
        data: {
            roles: []
        },
        formeditado: 0,
        roles: [],
        modal: {
            form: false,
            delete: false,
        },
        title: 'Nuevo rol',
        rol: ''
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const roles = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!roles)
            history.push('/')
    }
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    setRoles = roles => {
        let aux = []
        roles.map((rol) => {
            aux.push({
                actions: this.setActions(rol),
                rol: renderToString(setTextTable(rol.nombre)),
                color: renderToString(setColor(rol.color)),
                id: rol.id
            })
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
            }
        )
        return aux
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
    }
    handleClose = () => {
        const { modal } = this.state
        modal.form = false
        this.setState({
            modal,
            title: 'Nuevo rol',
            form: this.clearForm(),
            rol: ''
        })
    }
    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            modal,
            rol: ''
        })
    }
    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            modal,
            title: 'Nuevo rol',
            form: this.clearForm(),
            formeditado: 0,
        })
    }
    openModalDelete = rol => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            modal,
            rol: rol
        })
    }
    openModalEdit = rol => {
        const { form, modal } = this.state
        modal.form = true
        form.rol = rol.nombre
        form.color = rol.color
        this.setState({
            modal,
            title: 'Editar rol',
            rol: rol,
            form,
            formeditado: 1
        })
    }
    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Nuevo rol')
            this.addRolAxios()
        if (title === 'Editar rol')
            this.updateRolAxios()
    }
    safeDelete = e => () => {
        this.deleteRolAxios()
    }
    async addRolAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(`${URL_DEV}roles-mercadotecnia`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data, modal } = this.state
                modal.form = false
                doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito un nuevo rol.')
                this.getRolesAxios()
                this.setState({ ...this.state, modal, form: this.clearForm() })
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
    async updateRolAxios() {
        const { access_token } = this.props.authUser
        const { form, rol, data, modal } = this.state
        await axios.put(URL_DEV + 'roles-mercadotecnia/' + rol.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                modal.form = false
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el rol.')
                this.setState({
                    ...this.state,
                    modal,
                    form: this.clearForm(),
                    rol: ''
                })
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
    async deleteRolAxios() {
        const { access_token } = this.props.authUser
        const { rol } = this.state
        await axios.delete(URL_DEV + 'roles-mercadotecnia/' + rol.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                this.getRolesAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito el rol.')
                modal.delete = false
                this.setState({ ...this.state, modal, rol: '', })
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

    async getRolesAxios() { $('#kt_datatable_roles').DataTable().ajax.reload(); }
    
    render() {
        const { form, modal, title, formeditado, rol } = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <NewTableServerRender columns = { ROLES_COLUMNS } title = 'ROLES MERCADOTECNIA' subtitle = 'Listado de roles'
                    mostrar_boton = { true } abrir_modal = { true } mostrar_acciones = { true } onClick = { this.openModal }
                    actions = { {
                        'edit': { function: this.openModalEdit },
                        'delete': { function: this.openModalDelete }
                    } } idTable = 'kt_datatable_roles' accessToken = { this.props.authUser.access_token }
                    setter = { this.setRoles } urlRender = { `${URL_DEV}roles-mercadotecnia` }
                    cardTable = 'cardTable' cardTableHeader = 'cardTableHeader' cardBody = 'cardBody' />
                <Modal size="lg" show={modal.form} title={title} handleClose={this.handleClose}>
                    <RolesMercadotecniaForm form = { form } onChange = { this.onChange }
                        onSubmit = { this.onSubmit } formeditado = { formeditado } color = { rol.color } />
                </Modal>
                <ModalDelete title = "¿Estás seguro que deseas eliminar el rol?" show = { modal.delete } handleClose = { this.handleCloseDelete }
                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.deleteRolAxios() } } />
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(RolesMercadotecnia);