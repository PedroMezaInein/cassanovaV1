import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, ETIQUETAS_COLUMNS, COLORS } from '../../constants'
import { setTextTableReactDom, setColorTableReactDom } from '../../functions/setters'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert, customInputAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Modal, ModalDelete } from '../../components/singles'
import { EtiquetasForm } from '../../components/forms'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import Swal from 'sweetalert2'
import { Update } from '../../components/Lottie'
import { printSwalHeader } from '../../functions/printers'
import { InputGray, CircleColor } from '../../components/form-components'
import $ from "jquery";
import { setSingleHeader } from '../../functions/routers'
class Etiquetas extends Component {
    state = {
        form: {
            etiqueta: '',
            color: ''
        },
        data: {
            etiquetas: []
        },
        formeditado: 0,
        etiquetas: [],
        modal: {
            form: false,
            delete: false,
        },
        title: 'Nueva etiqueta',
        etiqueta: '',
        color: ''
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const etiquetas = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!etiquetas)
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
    setEtiquetas = etiquetas => {
        let aux = []
        etiquetas.map((etiqueta) => {
            aux.push({
                actions: this.setActions(etiqueta),
                etiqueta: setTextTableReactDom(etiqueta.titulo, this.doubleClick, etiqueta, 'titulo', 'text-center'),
                color: setColorTableReactDom(etiqueta.color, this.doubleClick, etiqueta, 'color', 'text-center'),
                id: etiqueta.id
            })
            return false
        })
        return aux
    }
    doubleClick = (data, tipo) => {
        const { form } = this.state
        let { color } = this.state
        switch(tipo){
            case 'color':
                color = data.color
                break
            default:
                form[tipo] = data[tipo]
                break
        }
        this.setState({form})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) + ' DE LA ETIQUETA'} </h2>
                {
                    tipo === 'titulo' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }
                        />
                }
                {
                    tipo === 'color' &&
                        <CircleColor circlesize = { 23 } width = "auto" onChange = { this.handleChangeColor }
                        colors = { COLORS } classlabel="d-none" value = { color }  classdiv='ml-2' swal = { true }/>
                }
            </div>,
            <Update />,
            () => { this.patchEtiquetas(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    handleChangeColor = (color) => {
        this.onChange({ target: { value: color.hex, name: 'color' } })
        this.setState({...this.state,color:color});
    }
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    patchEtiquetas = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/catalogos/etiquetas/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getEtiquetasAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito la etiqueta.')
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
            title: 'Nueva etiqueta',
            form: this.clearForm(),
            etiqueta: ''
        })
    }
    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            modal,
            etiqueta: ''
        })
    }
    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            modal,
            title: 'Nueva etiqueta',
            form: this.clearForm(),
            formeditado: 0,
        })
    }
    openModalDelete = etiqueta => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            modal,
            etiqueta: etiqueta
        })
    }
    openModalEdit = etiqueta => {
        const { form, modal } = this.state
        modal.form = true
        form.etiqueta = etiqueta.titulo
        form.color = etiqueta.color
        this.setState({
            modal,
            title: 'Editar etiqueta',
            etiqueta: etiqueta,
            form,
            formeditado: 1
        })
    }
    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Nueva etiqueta')
            this.addEtiquetaAxios()
        if (title === 'Editar etiqueta')
            this.updateEtiquetaAxios()
    }
    safeDelete = e => () => {
        this.deleteEtiquetaAxios()
    }
    async addEtiquetaAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(`${URL_DEV}tareas-etiquetas`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                modal.form = false
                doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito una nueva etiqueta.')
                this.getEtiquetasAxios()
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
    async updateEtiquetaAxios() {
        const { access_token } = this.props.authUser
        const { form, etiqueta, modal } = this.state
        await axios.put(`${URL_DEV}v2/catalogos/etiquetas/${etiqueta.id}`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                modal.form = false
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito la etiqueta.')
                this.getEtiquetasAxios()
                this.setState({ ...this.state, modal, form: this.clearForm(), etiqueta: '' })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async deleteEtiquetaAxios() {
        const { access_token } = this.props.authUser
        const { etiqueta } = this.state
        await axios.delete(`${URL_DEV}v2/catalogos/etiquetas/${etiqueta.id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { modal } = this.state
                this.getEtiquetasAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito la etiqueta.')
                modal.delete = false
                this.setState({ ...this.state, modal, etiqueta: '', })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getEtiquetasAxios() { $('#kt_datatable_etiqueta').DataTable().ajax.reload(); }
    
    render() {
        const { form, modal, title, formeditado, etiqueta } = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <NewTableServerRender columns = { ETIQUETAS_COLUMNS } title = 'ETIQUETA' subtitle = 'Listado de etiquetas'
                    mostrar_boton = { true } abrir_modal = { true } mostrar_acciones = { true } onClick = { this.openModal }
                    actions = { {
                        'edit': { function: this.openModalEdit },
                        'delete': { function: this.openModalDelete }
                    } } idTable = 'kt_datatable_etiqueta' accessToken = { this.props.authUser.access_token }
                    setter = { this.setEtiquetas } urlRender = { `${URL_DEV}v2/catalogos/etiquetas` }
                    cardTable = 'cardTable' cardTableHeader = 'cardTableHeader' cardBody = 'cardBody' />
                <Modal size="lg" show={modal.form} title={title} handleClose={this.handleClose}>
                    <EtiquetasForm form = { form } onChange = { this.onChange }
                        onSubmit = { this.onSubmit } formeditado = { formeditado } color = { etiqueta.color } />
                </Modal>
                <ModalDelete title = "¿Estás seguro que deseas eliminar la etiqueta?" show = { modal.delete } handleClose = { this.handleCloseDelete }
                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.deleteEtiquetaAxios() } } />
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Etiquetas);