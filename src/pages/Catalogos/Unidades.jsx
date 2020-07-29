import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, UNIDADES_COLUMNS,} from '../../constants'
import { setTextTable} from '../../functions/setters'
import { waitAlert, errorAlert, forbiddenAccessAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Modal, ModalDelete } from '../../components/singles'
import { UnidadForm } from '../../components/forms'
import NewTable from '../../components/tables/NewTable'

class Unidades extends Component {

    state = {
        form: {
            unidad: '',
        },
        data: {
            unidades: []
        },
        formeditado:0,
        unidades: [],
        modal:{
            form: false,
            delete: false,
        },
        title: 'Nueva unidad',
        unidad: ''
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
        this.getUnidadesAxios()
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

    setUnidades = unidades => {
        let aux = []
        unidades.map((unidad) => {
            aux.push({
                actions: this.setActions(unidad),
                unidad: renderToString(setTextTable(unidad.nombre)),
                id: unidad.id
            })
        })
        return aux
    }

    setActions = unidad => {
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
            formeditado:0,
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
            formeditado:1
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

    async getUnidadesAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'unidades', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { unidades } = response.data
                data.unidades = unidades
                this.setState({
                    ... this.state,
                    unidades: this.setUnidades(unidades),
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

    async addUnidadAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'unidades', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { unidades } = response.data
                const { data, modal } = this.state
                modal.form = false
                data.unidades = unidades
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Creaste con éxito una nueva área.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                this.setState({
                    ... this.state,
                    modal,
                    form: this.clearForm(),
                    unidades: this.setUnidades(unidades),
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

    async updateUnidadAxios() {
        const { access_token } = this.props.authUser
        const { form, unidad, data, modal } = this.state
        await axios.put(URL_DEV + 'unidades/' + unidad.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { unidades } = response.data
                data.unidades = unidades
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
                    unidades: this.setUnidades(unidades),
                    unidad: ''
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

    async deleteUnidadAxios() {
        const { access_token } = this.props.authUser
        const { unidad, modal, data } = this.state
        await axios.delete(URL_DEV + 'unidades/' + unidad.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { unidades } = response.data
                data.unidades = unidades
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
                    unidades: this.setUnidades(unidades),
                    unidad: '',
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
        const { form, unidades, modal, title, data, formeditado} = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <NewTable 
                    columns = { UNIDADES_COLUMNS } 
                    data = { unidades }
                    title = 'Unidades' 
                    subtitle='Listado de unidades'
                    mostrar_boton={true}
                    abrir_modal={true}
                    mostrar_acciones={true}
                    onClick={this.openModal}
                    actions={{
                        'edit': { function: this.openModalEdit },
                        'delete': { function: this.openModalDelete }
                    }}
                    elements={data.unidades}
                    idTable = 'kt_datatable_catalogos'
                />

                <Modal size="xl" show={modal.form} title = {title} handleClose={this.handleClose}>
                    <UnidadForm form = { form } onChange = { this.onChange }
                        onSubmit = { this.onSubmit } formeditado={formeditado} />
                </Modal>
                <ModalDelete title={"¿Estás seguro que deseas eliminar la unidad?"} show = { modal.delete } handleClose = { this.handleCloseDelete } onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteUnidadAxios() }}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Unidades);