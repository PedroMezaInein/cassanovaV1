import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, RENDIMIENTOS_COLUMNS } from '../../constants'
import { setOptions, setTextTable, setMoneyTable} from '../../functions/setters'
import Layout from '../../components/layout/layout'
import { Modal, ModalDelete } from '../../components/singles'
import { RendimientoForm } from '../../components/forms'
import NewTable from '../../components/tables/NewTable'
import { doneAlert, forbiddenAccessAlert, errorAlert, waitAlert } from '../../functions/alert'

class Rendimientos extends Component {

    state = {
        modal: false,
        modalDelete: false,
        title: 'Nuevo rendimiento',
        options: {
            proveedores: [],
            unidades: []
        },
        data: {
            rendimientos: []
        },
        formeditado:0,
        form: {
            unidad: '',
            proveedor: '',
            descripcion: '',
            materiales: '',
            costo: '',
            rendimiento: '',
            adjunto: {
                value: '',
                files: []
            }
        },
        rendimientos: [],
        rendimiento: ''
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const rendimientos = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!rendimientos)
            history.push('/')
        this.getRendimientosAxios()
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true,
            title: 'Nuevo rendimiento',
            form: this.clearForm(),
            formeditado:0
        })
    }

    openModalEdit = (rendimiento) => {
        const { form } = this.state

        if(rendimiento.unidad)
            form.unidad = rendimiento.unidad.id.toString()
        if(rendimiento.proveedor)
            form.proveedor = rendimiento.proveedor.id.toString()
        
        form.materiales = rendimiento.materiales
        form.descripcion = rendimiento.descripcion
        form.costo = rendimiento.costo
        form.rendimiento = rendimiento.rendimiento

        if(rendimiento.adjunto)
        if(rendimiento.adjunto){
            form.adjunto.files = [{
                name: rendimiento.adjunto.name,
                url: rendimiento.adjunto.url
            }]
        }

        this.setState({
            ... this.state,
            modal: true,
            title: 'Editar rendimiento',
            form,
            rendimiento: rendimiento,
            formeditado:1
        })
    }

    openModalDelete = (rendimiento) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            rendimiento: rendimiento
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            title: 'Nuevo rendimiento',
            rendimiento: '',
            form: this.clearForm()
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            rendimiento: '',
        })
    }

    setRendimientos = rendimientos => {
        let aux = []
        rendimientos.map((rendimiento) => {
            aux.push(
                {
                    actions: this.setActions(rendimiento),
                    materiales: renderToString(setTextTable(rendimiento.materiales)),
                    unidad: renderToString(setTextTable(rendimiento.unidad.nombre)),
                    costo: renderToString(setMoneyTable(rendimiento.costo)),
                    proveedor: renderToString(setTextTable(rendimiento.proveedor.nombre)),
                    rendimiento: renderToString(setTextTable(rendimiento.rendimiento)),
                    descripcion: renderToString(setTextTable(rendimiento.descripcion)),
                    id: rendimiento.id
                }
            )
        })
        return aux
    }

    setActions = rendimiento => {
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
                case 'adjunto':
                    form[element]['value'] = ''
                    form[element]['files'] = []
                    break;
                default:
                    form[element] = '';
                    break;
            }
        })
        return form
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar rendimiento')
            this.editRendimientoAxios()
        else
            this.addRendimientoAxios()
    }

    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form[name].value = value
        form[name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form[name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form[name].files[counter])
            }
        }
        if (aux.length < 1) {
            form[name].value = ''
        }
        form[name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    async getRendimientosAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rendimientos', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { unidades, proveedores, rendimientos } = response.data
                const { options } = this.state
                data.rendimientos = rendimientos
                options['unidades'] = setOptions(unidades, 'nombre', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                this.setState({
                    ... this.state,
                    options,
                    rendimientos: this.setRendimientos(rendimientos),
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

    async addRendimientoAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjunto':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        if(form.adjunto.value !== '') {
            for (var i = 0; i < form.adjunto.files.length; i++) {
                data.append(`files_name_adjuntos[]`, form.adjunto.files[i].name)
                data.append(`files_adjuntos[]`, form.adjunto.files[i].file)
            }
        }
        await axios.post(URL_DEV + 'rendimientos', data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { rendimientos } = response.data

                doneAlert(response.data.message !== undefined ? response.data.message : 'La rendimiento fue registrado con éxito.')

                this.setState({
                    ... this.state,
                    rendimientos: this.setRendimientos(rendimientos),
                    modal: false,
                    title: 'Nuevo rendimiento',
                    form: this.clearForm()
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

    async editRendimientoAxios() {
        const { access_token } = this.props.authUser
        const { form, rendimiento } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjunto':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        if(form.adjunto.value !== '') {
            for (var i = 0; i < form.adjunto.files.length; i++) {
                data.append(`files_name_adjuntos[]`, form.adjunto.files[i].name)
                data.append(`files_adjuntos[]`, form.adjunto.files[i].file)
            }
        }
        await axios.post(URL_DEV + 'rendimientos/update/' + rendimiento.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { rendimientos } = response.data

                doneAlert(response.data.message !== undefined ? response.data.message : 'La rendimiento fue registrado con éxito.')

                this.setState({
                    ... this.state,
                    rendimientos: this.setRendimientos(rendimientos),
                    modal: false,
                    title: 'Nuevo rendimiento',
                    form: this.clearForm()
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

    async deleteRendimientoAxios() {
        const { access_token } = this.props.authUser
        const { rendimiento } = this.state
        await axios.delete(URL_DEV + 'rendimientos/' + rendimiento.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { rendimientos } = response.data

                doneAlert(response.data.message !== undefined ? response.data.message : 'La rendimiento fue registrado con éxito.')
                
                this.setState({
                    ... this.state,
                    rendimientos: this.setRendimientos(rendimientos),
                    modalDelete: false,
                    rendimiento: ''
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

        const { modal, modalDelete, title, form, options, rendimientos, formeditado, data } = this.state

        return (
            <Layout active={'presupuesto'}  {...this.props}>
                <Modal size="xl" title={title} show={modal} handleClose={this.handleClose} >
                    <RendimientoForm form={form} options={options}
                        onChange={this.onChange} onSubmit={this.onSubmit} onChangeAdjunto={this.onChangeAdjunto}
                        clearFiles={this.clearFiles} formeditado={formeditado} />
                </Modal>
                <NewTable columns={RENDIMIENTOS_COLUMNS} data={rendimientos}
                    title='Rendimientos' subtitle='Listado de rendimientos'
                    mostrar_boton={true}
                    abrir_modal={true}
                    onClick={this.openModal}
                    mostrar_acciones={true}
                    actions={{
                        'edit': { function: this.openModalEdit },
                        'delete': { function: this.openModalDelete }
                    }}
                    elements={data.rendimientos}
                    idTable = 'kt_datatable_rendimiento'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    
                />
                <ModalDelete title={"¿Estás seguro que deseas eliminar el rendimiento?"} show={modalDelete} handleClose={this.handleCloseDelete} onClick={(e) => { e.preventDefault(); this.deleteRendimientoAxios() }}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Rendimientos);