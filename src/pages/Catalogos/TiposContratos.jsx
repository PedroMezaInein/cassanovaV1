import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, TIPOS_COLUMNS, GOLD } from '../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setPercentTable, setArrayTable, setFacturaTable, setAdjuntosList, setListTable } from '../../functions/setters'
import { waitAlert, errorAlert, createAlert,forbiddenAccessAlert } from '../../functions/alert'
//
import Layout from '../../components/layout/layout'
import { Button } from '../../components/form-components'
import { Modal, ModalDelete } from '../../components/singles'
import { faPlus, faLink, faEdit, faTrash, faReceipt, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'
import { TipoForm } from '../../components/forms'
import { Subtitle, Small } from '../../components/texts'
import NewTable from '../../components/tables/NewTable'

class TiposContratos extends Component {

    state = {
        form: {
            tipo: '',
        },
        data: {
            tipos: []
        },
        formeditado:0,
        tipos: [],
        modal:{
            form: false,
            delete: false,
        },
        title: 'Nuevo tipo',
        tipo: ''
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const areas = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!areas)
            history.push('/')
        this.getTiposContratosAxios()
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    setTipos = tipos => {
        let aux = []
        tipos.map((tipo) => {
            aux.push({
                actions: this.setActions(tipo),
                tipo: renderToString(setTextTable(tipo.tipo)),
                id: tipo.id
            })
        })
        return aux
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
        const { form, title } = this.state
        if (title === 'Nuevo tipo')
            this.addTipoContratoAxios()
        if (title === 'Editar tipo')
            this.updateTipoContratoAxios()
    }

    safeDelete = e => () => {
        this.deleteTipoContratoAxios()
    }

    async getTiposContratosAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'tipos-contratos', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { tipos } = response.data
                data.tipos = tipos
                this.setState({
                    ... this.state,
                    tipos: this.setTipos(tipos),
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addTipoContratoAxios() {
        const { access_token } = this.props.authUser
        const { form, data } = this.state
        await axios.post(URL_DEV + 'tipos-contratos', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { tipos } = response.data
                const { data, modal } = this.state
                modal.form = false
                data.tipos = tipos
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Creaste con éxito una Nuevo área.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                this.setState({
                    ... this.state,
                    modal,
                    form: this.clearForm(),
                    tipos: this.setTipos(tipos),
                    data
                })

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async updateTipoContratoAxios() {
        const { access_token } = this.props.authUser
        const { form, tipo, data, modal } = this.state
        await axios.put(URL_DEV + 'tipos-contratos/' + tipo.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { tipos } = response.data
                data.tipos = tipos
                modal.form = false
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Editaste con éxito el área.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                this.setState({
                    ... this.state,
                    modal,
                    form: this.clearForm(),
                    tipos: this.setTipos(tipos),
                    tipo: ''
                })

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteTipoContratoAxios() {
        const { access_token } = this.props.authUser
        const { tipo, modal, data } = this.state
        await axios.delete(URL_DEV + 'tipos-contratos/' + tipo.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { tipos } = response.data
                data.tipos = tipos
                modal.delete = false
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito el área.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                this.setState({
                    ... this.state,
                    modal,
                    form: this.clearForm(),
                    tipos: this.setTipos(tipos),
                    tipo: '',
                    data
                })

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        const { form, tipos, modal, title, data, formeditado} = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <NewTable 
                    columns = { TIPOS_COLUMNS } 
                    data = { tipos }
                    title = 'Tipos de contratos' 
                    subtitle='Listado de los tipos de contrato'
                    mostrar_boton={true}
                    abrir_modal={true}
                    mostrar_acciones={true}
                    onClick={this.openModal}
                    actions={{
                        'edit': { function: this.openModalEdit },
                        'delete': { function: this.openModalDelete }
                    }}
                    elements={data.tipos}
                />

                <Modal show={modal.form} title = {title} handleClose={this.handleClose}>
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