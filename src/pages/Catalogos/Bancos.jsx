import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV, BANCOS_COLUMNS,} from '../../constants'
import { setTextTableReactDom } from '../../functions/setters'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert, customInputAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Modal, ModalDelete } from '../../components/singles'
import { BancoForm } from '../../components/forms'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { Update } from '../../components/Lottie'
import { printSwalHeader } from '../../functions/printers'
import { InputGray } from '../../components/form-components'
import $ from "jquery";
class Bancos extends Component {

    state = {
        form: {
            nombre: '',
        },
        formeditado:0,
        modal:{
            form: false,
            delete: false,
        },
        title: 'Nuevo banco',
        banco: ''
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

    setBancos = bancos => {
        let aux = []
        bancos.map((banco) => {
            aux.push({
                actions: this.setActions(banco),
                banco: setTextTableReactDom(banco.nombre, this.doubleClick, banco, 'nombre', 'text-center'),
                id: banco.id
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
        this.setState({form, banco: data})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) + ' DEL BANCO' } </h2>
                {
                    tipo === 'nombre' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } swal = { true }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } />
                }
            </div>,
            <Update />,
            () => { this.updateBancoAxios() },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    
    setActions = banco => {
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
            return form[element] = ''
        })
        return form;
    }

    handleClose = () => {
        const { modal } = this.state
        modal.form = false
        this.setState({
            modal,
            title: 'Nuevo banco',
            form: this.clearForm(),
            banco: ''
        })
    }

    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            modal,
            banco: ''
        })
    }

    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            modal,
            title: 'Nuevo banco',
            form: this.clearForm(),
            formeditado:0,
        })
    }

    openModalDelete = banco => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            modal,
            banco: banco
        })
    }

    openModalEdit = banco => {
        const { form, modal } = this.state
        modal.form = true
        form.nombre = banco.nombre
        this.setState({
            modal,
            title: 'Editar banco',
            banco: banco,
            form,
            formeditado:1
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Nuevo banco')
            this.addBancoAxios()
        if (title === 'Editar banco')
            this.updateBancoAxios()
    }

    safeDelete = e => () => { this.deleteBancoAxios() }

    async getBancosAxios() { $('#kt_datatable_catalogos').DataTable().ajax.reload(); }

    async addBancoAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'bancos', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                modal.form = false
                doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito una nueva área.')
                this.getBancosAxios()
                this.setState({ ...this.state, modal, form: this.clearForm() })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async updateBancoAxios() {
        const { access_token } = this.props.authUser
        const { form, banco, modal } = this.state
        await axios.put(URL_DEV + 'bancos/' + banco.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                modal.form = false
                this.getBancosAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el área.') 
                this.setState({ ...this.state, modal, form: this.clearForm(), banco: '' })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async deleteBancoAxios() {
        const { access_token } = this.props.authUser
        const { banco, modal } = this.state
        await axios.delete(URL_DEV + 'bancos/' + banco.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                modal.delete = false
                this.getBancosAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito el área.')
                this.setState({ ...this.state, modal, form: this.clearForm(), banco: '', })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    render() {
        const { form, modal, title, formeditado} = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <NewTableServerRender columns = { BANCOS_COLUMNS } title = 'Bancos' subtitle='Listado de bancos' mostrar_boton = { true }
                    abrir_modal = { true } mostrar_acciones = { true } onClick = { this.openModal } idTable = 'kt_datatable_catalogos'
                    actions = { { 'edit': { function: this.openModalEdit }, 'delete': { function: this.openModalDelete } } }
                    cardTable = 'cardTable' cardTableHeader = 'cardTableHeader' cardBody = 'cardBody' accessToken = { this.props.authUser.access_token }
                    setter =  {this.setBancos } urlRender = { `${URL_DEV}bancos` } />
                <Modal size="xl" show={modal.form} title = {title} handleClose={this.handleClose}>
                    <BancoForm form = { form } onChange = { this.onChange } onSubmit = { this.onSubmit } formeditado={formeditado} />
                </Modal>
                <ModalDelete title = "¿Estás seguro que deseas eliminar el banco?" show = { modal.delete } handleClose = { this.handleCloseDelete } 
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteBancoAxios() }} />
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Bancos);