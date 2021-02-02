import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import { OrigenLeadForm } from '../../components/forms'
import Layout from '../../components/layout/layout'
import { ModalDelete, Modal } from '../../components/singles'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { URL_DEV, ORIGENES_COLUMNS } from '../../constants'
import { doneAlert, errorAlert, forbiddenAccessAlert, waitAlert } from '../../functions/alert'
import { setTextTable } from '../../functions/setters'
import axios from 'axios'
const $ = require('jquery');

class OrigenesLeads extends Component {

    state = {
        form: {
            origen: '',
        },
        data: {
            origenes: []
        },
        formeditado: 0,
        origenes: [],
        modal: {
            form: false,
            delete: false,
        },
        title: 'Nuevo origen',
        origen: ''
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const areas = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!areas)
            history.push('/')
    }

    setOrigenes = origenes => {
        let aux = []
        origenes.map((origen) => {
            aux.push({
                actions: this.setActions(origen),
                origen: renderToString(setTextTable(origen.origen)),
                id: origen.id
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

    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            modal,
            title: 'Nuevo origen',
            form: this.clearForm(),
            formeditado: 0,
        })
    }

    openModalDelete = origen => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            modal,
            origen: origen
        })
    }

    openModalEdit = origen => {
        const { form, modal } = this.state
        modal.form = true
        form.origen = origen.origen
        this.setState({
            modal,
            title: 'Editar origen',
            origen: origen,
            form,
            formeditado: 1
        })
    }

    handleClose = () => {
        const { modal } = this.state
        modal.form = false
        this.setState({
            modal,
            title: 'Nuevo origen',
            form: this.clearForm(),
            origen: ''
        })
    }

    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            modal,
            origen: ''
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
        if (title === 'Nuevo origen')
            this.addOrigenAxios()
        if (title === 'Editar origen')
            this.updateOrigenAxios()
    }

    async addOrigenAxios() {
        const { access_token } = this.props.authUser
        const { form, modal } = this.state
        await axios.post(URL_DEV + 'origenes', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                modal.form = false
                this.getOrigenesAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito una nueva área.')

                this.setState({
                    ...this.state,
                    modal,
                    form: this.clearForm()
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

    async updateOrigenAxios() {
        const { access_token } = this.props.authUser
        const { form, origen, modal } = this.state
        await axios.put(URL_DEV + 'origenes/' + origen.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                modal.form = false
                this.getOrigenesAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el área.')

                this.setState({
                    ...this.state,
                    modal,
                    form: this.clearForm(),
                    origen: ''
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

    async deleteOrigenAxios() {
        const { origen } = this.state
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'origenes/' + origen.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getOrigenesAxios()
                const { modal } = this.state
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito la origen.')
                modal.delete=false
                this.setState({
                    ...this.state,
                    modal,
                    origen: '',
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

    async getOrigenesAxios() {
        $('#kt_datatable_origenes').DataTable().ajax.reload();
    }

    render() {
        const { modal, title, form, formeditado } = this.state
        return (
            <Layout active = 'catalogos' {...this.props}>
                <NewTableServerRender
                    columns = { ORIGENES_COLUMNS }
                    title = 'ORIGENES LEADS'
                    subtitle='Listado de origenes de leads'
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
                    idTable = 'kt_datatable_origenes'
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setOrigenes }
                    urlRender = { URL_DEV + 'origenes'}
                    cardTable = 'cardTable'
                    cardTableHeader = 'cardTableHeader'
                    cardBody = 'cardBody'
                />
                <Modal size="xl" show = { modal.form } title = { title } handleClose = { this.handleClose } >
                    <OrigenLeadForm
                        form = { form }
                        onChange = { this.onChange }
                        onSubmit = { this.onSubmit }
                        formeditado = { formeditado }
                    />
                </Modal>
                <ModalDelete 
                    title = '¿Estás seguro que deseas eliminar el origen?'
                    show = { modal.delete } 
                    handleClose = { this.handleCloseDelete }
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteOrigenAxios() }}
                    />
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

export default connect(mapStateToProps, mapDispatchToProps)(OrigenesLeads)