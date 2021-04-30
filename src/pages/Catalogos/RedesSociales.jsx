import React, { Component } from 'react'
import { connect } from 'react-redux'
import { RedesSocialesForm } from '../../components/forms'
import Layout from '../../components/layout/layout'
import { ModalDelete, Modal } from '../../components/singles'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { URL_DEV, RED_SOCIAL_COLUMNS } from '../../constants'
import { doneAlert, errorAlert, printResponseErrorAlert, waitAlert, customInputAlert} from '../../functions/alert'
import { setTextTableReactDom } from '../../functions/setters'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Update } from '../../components/Lottie'
import { printSwalHeader } from '../../functions/printers'
import { InputGray } from '../../components/form-components'
import $ from "jquery";

class RedesSociales extends Component {

    state = {
        form: { nombre: '', },
        data: { redesSociales: [] },
        formeditado: 0,
        redesSociales: [],
        modal: { form: false, delete: false, },
        title: 'Nueva red social',
        origen: ''
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const redesSociales = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!redesSociales)
            history.push('/')
    }

    setRedesSociales = redesSociales => {
        let aux = []
        redesSociales.map((redSocial) => {
            aux.push({
                actions: this.setActions(redSocial),
                redSocial: setTextTableReactDom(redSocial.nombre, this.doubleClick, redSocial, 'nombre', 'text-center'),
                id: redSocial.id
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
        this.setState({form, redSocial: data})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) + ' DE LA RED SOCIAL' } </h2>
                {
                    tipo === 'nombre' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } swal = { true }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } />
                }
            </div>,
            <Update />,
            () => { this.updateRedSocialAxios() },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
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

    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            modal,
            title: 'Nueva red social',
            form: this.clearForm(),
            formeditado: 0,
        })
    }

    openModalDelete = redSocial => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            modal,
            redSocial: redSocial
        })
    }

    openModalEdit = redSocial => {
        const { form, modal } = this.state
        modal.form = true
        form.nombre = redSocial.nombre
        this.setState({
            modal,
            title: 'Editar red social',
            redSocial: redSocial,
            form,
            formeditado: 1
        })
    }

    handleClose = () => {
        const { modal } = this.state
        modal.form = false
        this.setState({
            modal,
            title: 'Nueva red social',
            form: this.clearForm(),
            redSocial: ''
        })
    }

    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            modal,
            redSocial: ''
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            form[element] = ''
            return false
        })
        return form;
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

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Nueva red social')
            this.addRedSocialAxios()
        if (title === 'Editar red social')
            this.updateRedSocialAxios()
    }

    async addRedSocialAxios() {
        const { access_token } = this.props.authUser
        const { form, modal } = this.state
        await axios.post(URL_DEV + 'redes-sociales', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                modal.form = false
                this.getRedSocialAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito la red social.')
                this.setState({ ...this.state, modal, form: this.clearForm() })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async updateRedSocialAxios() {
        const { access_token } = this.props.authUser
        const { form, redSocial, modal } = this.state
        await axios.put(URL_DEV + 'redes-sociales/' + redSocial.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                modal.form = false
                this.getRedSocialAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito la red social.')
                this.setState({ ...this.state, modal, form: this.clearForm(), redSocial: '' })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteRedSocialAxios() {
        const { access_token } = this.props.authUser
        const { redSocial  } = this.state
        await axios.delete(URL_DEV + 'redes-sociales/' + redSocial.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                this.getRedSocialAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito la red social.')
                modal.delete=false
                this.setState({ ...this.state, modal, redSocial: '' })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getRedSocialAxios() { $('#kt_datatable_redesSociales').DataTable().ajax.reload(); }

    render() {
        const { modal, title, form, formeditado } = this.state
        return (
            <Layout active = 'catalogos' {...this.props}>
                <NewTableServerRender
                    columns = { RED_SOCIAL_COLUMNS }
                    title = 'REDES SOCIALES'
                    subtitle='Listado de redes sociales'
                    mostrar_boton = { true }
                    abrir_modal = { true }
                    mostrar_acciones = { true }
                    onClick = { this.openModal }
                    actions = {
                        {
                            'edit': { function: this.openModalEdit },
                            'delete': { function: this.openModalDelete }
                        }
                    }
                    idTable = 'kt_datatable_redesSociales'
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setRedesSociales }
                    urlRender = { URL_DEV + 'redes-sociales'}
                    cardTable = 'cardTable'
                    cardTableHeader = 'cardTableHeader'
                    cardBody = 'cardBody'
                />
                <Modal show = { modal.form } title = { title } handleClose = { this.handleClose } >
                    <RedesSocialesForm
                        form = { form }
                        onChange = { this.onChange }
                        onSubmit = { this.onSubmit }
                        formeditado = { formeditado }
                    />
                </Modal>
                <ModalDelete title = '¿Estás seguro que deseas eliminar la red social?'
                    show = { modal.delete } handleClose = { this.handleCloseDelete }
                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.deleteRedSocialAxios() } } />
            </Layout>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(RedesSociales)