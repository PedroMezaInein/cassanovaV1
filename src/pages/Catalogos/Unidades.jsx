import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV, UNIDADES_COLUMNS, } from '../../constants'
import { setTextTableReactDom } from '../../functions/setters'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert, customInputAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Modal, ModalDelete } from '../../components/singles'
import { UnidadForm } from '../../components/forms'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { Update } from '../../components/Lottie'
import { printSwalHeader } from '../../functions/printers'
import { InputGray } from '../../components/form-components'
import $ from "jquery";
class Unidades extends Component {
    state = {
        form: {
            unidad: '',
        },
        data: {
            unidades: []
        },
        formeditado: 0,
        unidades: [],
        modal: {
            form: false,
            delete: false,
        },
        title: 'Nueva unidad',
        unidad: ''
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
        // this.getUnidadesAxios()
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

    setUnidades = unidades => {
        let aux = []
        unidades.map((unidad) => {
            aux.push({
                actions: this.setActions(unidad),
                unidad: setTextTableReactDom(unidad.nombre, this.doubleClick, unidad, 'nombre', 'text-center'),
                id: unidad.id
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
        this.setState({form, unidad: data})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) + ' DE LA UNIDAD' } </h2>
                {
                    tipo === 'nombre' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form['unidad'] } name = { 'unidad' }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, 'unidad')} } swal = { true }
                        />
                }
            </div>,
            <Update />,
            () => { this.updateUnidadAxios() },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    patchUnidades = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/catalogos/unidades/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getUnidadesAxios()
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
            title: 'Nueva unidad',
            form: this.clearForm(),
            unidad: ''
        })
    }

    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            modal,
            unidad: ''
        })
    }

    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            modal,
            title: 'Nueva unidad',
            form: this.clearForm(),
            formeditado: 0,
        })
    }

    openModalDelete = unidad => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            modal,
            unidad: unidad
        })
    }

    openModalEdit = unidad => {
        const { form, modal } = this.state
        modal.form = true
        form.unidad = unidad.nombre
        this.setState({
            modal,
            title: 'Editar unidad',
            unidad: unidad,
            form,
            formeditado: 1
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Nueva unidad')
            this.addUnidadAxios()
        if (title === 'Editar unidad')
            this.updateUnidadAxios()
    }

    safeDelete = e => () => {
        this.deleteUnidadAxios()
    }

    async addUnidadAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'unidades', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                modal.form = false

                doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito la unidad.')

                this.setState({
                    ...this.state,
                    modal,
                    form: this.clearForm(),
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

    async updateUnidadAxios() {
        const { access_token } = this.props.authUser
        const { form, unidad, modal } = this.state
        await axios.put(URL_DEV + 'unidades/' + unidad.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                modal.form = false
                this.getUnidadesAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito la unidad.')
                this.setState({ ...this.state, modal, form: this.clearForm(), unidad: '' })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteUnidadAxios() {
        const { access_token } = this.props.authUser
        const { unidad  } = this.state
        await axios.delete(URL_DEV + 'unidades/' + unidad.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                this.getUnidadesAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito la unidad.')
                modal.delete=false
                this.setState({ ...this.state, modal, unidad: '', })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getUnidadesAxios() { $('#kt_datatable_unidades').DataTable().ajax.reload(); }

    render() {
        const { form, modal, title, formeditado } = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <NewTableServerRender columns = { UNIDADES_COLUMNS } title = 'Unidades' subtitle = 'Listado de unidades' mostrar_boton = { true }
                    abrir_modal = { true } mostrar_acciones = { true } onClick = { this.openModal } idTable = 'kt_datatable_unidades' 
                    actions = { { 'edit': { function: this.openModalEdit }, 'delete': { function: this.openModalDelete } } }
                    accessToken = { this.props.authUser.access_token } setter = { this.setUnidades } urlRender = { `${URL_DEV}unidades` } 
                    cardTable = 'cardTable' cardTableHeader = 'cardTableHeader' cardBody = 'cardBody' />
                <Modal size="xl" show={modal.form} title={title} handleClose={this.handleClose}>
                    <UnidadForm form = { form } onChange = { this.onChange } onSubmit = { this.onSubmit } formeditado = { formeditado } />
                </Modal>
                <ModalDelete title={"¿Estás seguro que deseas eliminar la unidad?"} show={modal.delete} handleClose={this.handleCloseDelete} onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteUnidadAxios() }}>
                </ModalDelete>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Unidades);