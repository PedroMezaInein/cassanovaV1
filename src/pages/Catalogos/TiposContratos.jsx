import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV, TIPOS_COLUMNS} from '../../constants'
import { setTextTableReactDom} from '../../functions/setters'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert, customInputAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Modal, ModalDelete } from '../../components/singles'
import { TipoForm } from '../../components/forms'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { Update } from '../../components/Lottie'
import { printSwalHeader } from '../../functions/printers'
import { InputGray } from '../../components/form-components'
import $ from "jquery";

class TiposContratos extends Component {

    state = {
        form: {
            tipo: '',
        },
        formeditado:0,
        modal:{
            form: false,
            delete: false,
        },
        title: 'Nuevo tipo',
        tipo: ''
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

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    setTipos = tipos => {
        let aux = []
        tipos.map((tipo) => {
            aux.push({
                actions: this.setActions(tipo),
                tipo: setTextTableReactDom(tipo.tipo, this.doubleClick, tipo, 'tipo', 'text-center'),
                id: tipo.id
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
        this.setState({form, tipo: data})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) + 'DEL CONTRATO'} </h2>
                {
                    tipo === 'tipo' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } letterCase = { false }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }
                        />
                }
            </div>,
            <Update />,
            () => { this.updateTipoContratoAxios() },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    patchTiposContratos = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/catalogos/tipos-contratos/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getTiposContratosAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el tipo de contrato.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    setActions = tipo => {
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
            title: 'Nuevo tipo',
            form: this.clearForm(),
            tipo: ''
        })
    }

    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            modal,
            tipo: ''
        })
    }

    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            modal,
            title: 'Nuevo tipo',
            form: this.clearForm(),
            formeditado:0
        })
    }

    openModalDelete = tipo => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            modal,
            tipo: tipo
        })
    }

    openModalEdit = tipo => {
        const { form, modal } = this.state
        modal.form = true
        form.tipo = tipo.tipo
        this.setState({
            modal,
            title: 'Editar tipo',
            tipo: tipo,
            form,
            formeditado:1
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Nuevo tipo')
            this.addTipoContratoAxios()
        if (title === 'Editar tipo')
            this.updateTipoContratoAxios()
    }

    safeDelete = e => () => {
        this.deleteTipoContratoAxios()
    }

    async getTiposContratosAxios() {
        $('#kt_datatable_contratos').DataTable().ajax.reload();
    }

    async addTipoContratoAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'tipos-contratos', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                modal.form = false
                
                doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito una Nuevo área.')

                this.getTiposContratosAxios()
                
                this.setState({
                    ...this.state,
                    modal,
                    form: this.clearForm()
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

    async updateTipoContratoAxios() {
        const { access_token } = this.props.authUser
        const { form, tipo, modal } = this.state
        await axios.put(URL_DEV + 'tipos-contratos/' + tipo.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                modal.form = false
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el área.')
                this.getTiposContratosAxios()
                this.setState({ ...this.state, modal, form: this.clearForm(), tipo: '' })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async deleteTipoContratoAxios() {
        const { access_token } = this.props.authUser
        const { tipo, modal } = this.state
        await axios.delete(URL_DEV + 'tipos-contratos/' + tipo.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                modal.delete = false

                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito el área.')

                this.getTiposContratosAxios()
                
                this.setState({
                    ...this.state,
                    modal,
                    form: this.clearForm(),
                    tipo: ''
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
        const { form, modal, title, formeditado } = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <NewTableServerRender 
                    columns = { TIPOS_COLUMNS } 
                    title = 'Tipos de contratos' 
                    subtitle = 'Listado de los tipos de contrato'
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
                    idTable = 'kt_datatable_contratos'
                    cardTable = 'cardTable'
                    cardTableHeader = 'cardTableHeader'
                    cardBody = 'cardBody'
                    accessToken = { this.props.authUser.access_token }
                    setter =  {this.setTipos }
                    urlRender = { URL_DEV + 'tipos-contratos'}
                />

                <Modal size="xl" show={modal.form} title = {title} handleClose={this.handleClose}>
                    <TipoForm form = { form } onChange = { this.onChange }
                        onSubmit = { this.onSubmit } formeditado={formeditado} />
                </Modal>
                <ModalDelete title={"¿Estás seguro que deseas eliminar la tipo?"} show = { modal.delete } handleClose = { this.handleCloseDelete } onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteTipoContratoAxios() }}>
                </ModalDelete>
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

export default connect(mapStateToProps, mapDispatchToProps)(TiposContratos);