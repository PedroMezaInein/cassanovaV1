import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, BANCOS_COLUMNS,} from '../../constants'
import { setTextTable} from '../../functions/setters'
import { waitAlert, errorAlert, forbiddenAccessAlert, doneAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Modal, ModalDelete } from '../../components/singles'
import { BancoForm } from '../../components/forms'
import NewTable from '../../components/tables/NewTable'

class Bancos extends Component {

    state = {
        form: {
            nombre: '',
        },
        data: {
            bancos: []
        },
        formeditado:0,
        bancos: [],
        modal:{
            form: false,
            delete: false,
        },
        title: 'Nuevo banco',
        banco: ''
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
        this.getBancosAxios()
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

    setBancos = bancos => {
        let aux = []
        bancos.map((banco) => {
            aux.push({
                actions: this.setActions(banco),
                banco: renderToString(setTextTable(banco.nombre)),
                id: banco.id
            })
        })
        return aux
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
            form[element] = ''
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

    safeDelete = e => () => {
        this.deleteBancoAxios()
    }

    async getBancosAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'bancos', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { bancos } = response.data
                data.bancos = bancos
                this.setState({
                    ... this.state,
                    bancos: this.setBancos(bancos),
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

    async addBancoAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'bancos', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { bancos } = response.data
                const { data, modal } = this.state
                modal.form = false
                data.bancos = bancos

                doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito una nueva área.')
                
                this.setState({
                    ... this.state,
                    modal,
                    form: this.clearForm(),
                    bancos: this.setBancos(bancos),
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

    async updateBancoAxios() {
        const { access_token } = this.props.authUser
        const { form, banco, data, modal } = this.state
        await axios.put(URL_DEV + 'bancos/' + banco.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { bancos } = response.data
                data.bancos = bancos
                modal.form = false
                
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el área.')
                
                this.setState({
                    ... this.state,
                    modal,
                    form: this.clearForm(),
                    bancos: this.setBancos(bancos),
                    banco: ''
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

    async deleteBancoAxios() {
        const { access_token } = this.props.authUser
        const { banco, modal, data } = this.state
        await axios.delete(URL_DEV + 'bancos/' + banco.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { bancos } = response.data
                data.bancos = bancos
                modal.delete = false

                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito el área.')
                
                this.setState({
                    ... this.state,
                    modal,
                    form: this.clearForm(),
                    bancos: this.setBancos(bancos),
                    banco: '',
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
        const { form, bancos, modal, title, data, formeditado} = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <NewTable 
                    columns = { BANCOS_COLUMNS } 
                    data = { bancos }
                    title = 'Bancos' 
                    subtitle='Listado de bancos'
                    mostrar_boton={true}
                    abrir_modal={true}
                    mostrar_acciones={true}
                    onClick={this.openModal}
                    actions={{
                        'edit': { function: this.openModalEdit },
                        'delete': { function: this.openModalDelete }
                    }}
                    elements={data.bancos}
                    idTable = 'kt_datatable_catalogos'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />

                <Modal size="xl" show={modal.form} title = {title} handleClose={this.handleClose}>
                    <BancoForm form = { form } onChange = { this.onChange }
                        onSubmit = { this.onSubmit } formeditado={formeditado} />
                </Modal>
                <ModalDelete title={"¿Estás seguro que deseas eliminar el banco?"} show = { modal.delete } handleClose = { this.handleCloseDelete } onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteBancoAxios() }}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Bancos);