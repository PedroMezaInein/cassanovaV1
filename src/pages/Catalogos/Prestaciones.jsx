import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV, PRESTACIONES_COLUMNS} from '../../constants'
import { setTextTableReactDom} from '../../functions/setters'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert, customInputAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Modal, ModalDelete } from '../../components/singles'
import { PrestacionForm } from '../../components/forms'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { Update } from '../../components/Lottie'
import { printSwalHeader } from '../../functions/printers'
import { InputGray } from '../../components/form-components'
import $ from "jquery";

class Prestaciones extends Component {
    state = {
        form: {
            prestacion: '',
            descripcion: '',
        },
        formeditado:0,
        modal:{
            form: false,
            delete: false,
        },
        title: 'Nueva prestación',
        prestacion: ''
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const prestacion = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!prestacion)
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

    setPrestacion = prestaciones => {
        let aux = []
        prestaciones.map((prestacion) => {
            aux.push({
                actions: this.setActions(prestacion),
                prestacion: setTextTableReactDom(prestacion.prestacion, this.doubleClick, prestacion, 'prestacion', 'text-center'),
                descripcion: setTextTableReactDom(prestacion.descripcion !== null ? prestacion.descripcion :'', this.doubleClick, prestacion, 'descripcion', 'text-justify'),
                id: prestacion.id
            })
            return false
        })
        return aux
    }
    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
            default:
                form[tipo] = data.tipo
                break
        }
        this.setState({form, prestacion: data})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) } </h2>
                {
                    tipo === 'prestacion' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } letterCase = { false }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }
                        />
                }
                {
                    tipo === 'descripcion' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } rows  = { 6 } as = 'textarea'
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } letterCase = { false }
                        />
                }
            </div>,
            <Update />,
            () => { this.updatePrestacionAxios() },
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
            title: 'Nueva prestación',
            form: this.clearForm(),
            prestacion: ''
        })
    }

    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            modal,
            prestacion: ''
        })
    }

    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            modal,
            title: 'Nueva prestación',
            form: this.clearForm(),
            formeditado:0
        })
    }

    openModalDelete = prestacion => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            modal,
            prestacion: prestacion
        })
    }

    openModalEdit = prestacion => {
        const { form, modal } = this.state
        modal.form = true
        form.prestacion = prestacion.prestacion
        this.setState({
            modal,
            title: 'Editar prestación',
            prestacion: prestacion,
            form,
            formeditado:1
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Nueva prestación')
            this.addPrestacionAxios()
        if (title === 'Editar prestación')
            this.updatePrestacionAxios()
    }

    async getPrestacioneAxios() {
        $('#kt_datatable_prestaciones').DataTable().ajax.reload();
    }

    async addPrestacionAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(`${URL_DEV}prestaciones`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                modal.form = false
                doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito la prestación.')
                this.getPrestacioneAxios()
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

    async updatePrestacionAxios() {
        const { access_token } = this.props.authUser
        const { form, prestacion, modal } = this.state
        await axios.put(`${URL_DEV}prestaciones/${prestacion.id}`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                modal.form = false
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito la prestación.')
                this.getPrestacioneAxios()
                this.setState({ ...this.state, modal, form: this.clearForm(), prestacion: '' })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async deletePrestacionAxios() {
        const { access_token } = this.props.authUser
        const { prestacion, modal } = this.state
        await axios.delete(`${URL_DEV}prestaciones/${prestacion.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                modal.delete = false
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito la prestación.')
                this.getPrestacioneAxios()
                this.setState({
                    ...this.state,
                    modal,
                    form: this.clearForm(),
                    prestacion: ''
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
                    columns = { PRESTACIONES_COLUMNS } 
                    title = 'Prestaciones' 
                    subtitle = 'Listado de prestaciones'
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
                    setter =  {this.setPrestacion }
                    urlRender = {`${URL_DEV}prestaciones`}
                />
                <Modal size="xl" show={modal.form} title = {title} handleClose={this.handleClose}>
                    <PrestacionForm form = { form } onChange = { this.onChange } onSubmit = { this.onSubmit } formeditado={formeditado} />
                </Modal>
                <ModalDelete title="¿Estás seguro que deseas eliminar la prestación?" show = { modal.delete } handleClose = { this.handleCloseDelete } onClick={(e) => { e.preventDefault(); waitAlert(); this.deletePrestacionAxios() }}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Prestaciones);