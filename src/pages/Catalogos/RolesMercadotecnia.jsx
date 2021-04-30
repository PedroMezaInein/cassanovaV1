import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, ROLES_COLUMNS, COLORS } from '../../constants'
import { setTextTableReactDom, setColorTableReactDom } from '../../functions/setters'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert, customInputAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Modal, ModalDelete } from '../../components/singles'
import { RolesMercadotecniaForm } from '../../components/forms'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import Swal from 'sweetalert2'
import { Update } from '../../components/Lottie'
import { printSwalHeader } from '../../functions/printers'
import { InputGray, CircleColor } from '../../components/form-components'
import $ from "jquery";
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
        rol: '',
        color: ''
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
                rol: setTextTableReactDom(rol.nombre, this.doubleClick, rol, 'nombre', 'text-center'),
                color: setColorTableReactDom(rol.color, this.doubleClick, rol, 'color', 'text-center'),
                id: rol.id
            })
            return false
        })
        return aux
    }
    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
            default:
                form[tipo] = data[tipo]
                break
        }
        this.setState({form})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) + ' DEL ROL'} </h2>
                {
                    tipo === 'nombre' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }
                        />
                }
                {
                    tipo === 'color' &&
                        <CircleColor circlesize = { 23 } width = "auto" onChange = { this.handleChangeColor }
                        colors = { COLORS } classlabel="d-none" value = { data.color } classdiv='ml-2' swal = { true }/>
                }
            </div>,
            <Update />,
            () => { this.patchRedesSociales(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    handleChangeColor = (color) => {
        this.setState({...this.state,color:color.hex});
    }
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    patchRedesSociales = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/catalogos/redes-sociales/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getRedSocialAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito la unidad.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
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
                const { modal } = this.state
                modal.form = false
                doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito un nuevo rol.')
                this.getRolesAxios()
                this.setState({ ...this.state, modal, form: this.clearForm() })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async updateRolAxios() {
        const { access_token } = this.props.authUser
        const { form, rol, modal } = this.state
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
                printResponseErrorAlert(error)
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
                printResponseErrorAlert(error)
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