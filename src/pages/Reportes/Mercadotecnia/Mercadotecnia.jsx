import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, REPORTE_MERCA_COLUMNS} from '../../../constants'
import { setOptions, setAdjuntoTable, setTextTableCenter } from '../../../functions/setters'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { Modal, ModalDelete } from '../../../components/singles'
import { MercadotecniaForm } from '../../../components/forms'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import Swal from 'sweetalert2'
import $ from "jquery";
class Mercadotecnia extends Component {

    state = {
        formeditado:0,
        options: { empresas: [] },
        modal:{
            form: false,
            delete: false
        },
        title: 'Adjuntar reporte',
        form: {
            empresa: '',
            mes: '',
            año: '',
            adjuntos: {
                adjuntos: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
            }
        },
        reporte: '',
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const egresos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!egresos)
            history.push('/')
        this.getOptionsAxios()
    }

    getOptionsAxios = async () => {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'reportes/reporte-mercadotecnia/options', { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas } = response.data
                const { options } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                this.setState({ ...this.state, options })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addReporteAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        form.adjuntos.adjuntos.files.map(( adjunto) => {
            data.append(`files_name_adjunto[]`, adjunto.name)
            data.append(`files_adjunto[]`, adjunto.file)
            return ''
        })
        data.append(`empresa`, form.empresa)
        data.append(`mes`, form.mes)
        data.append(`año`, form.año)
        await axios.post(URL_DEV + 'reportes/reporte-mercadotecnia', data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { modal } = this.state
                modal.form = false
                this.getReporteAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito una nueva reporte.')
                this.setState({ ...this.state, modal, form: this.clearForm() })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            console.log(error, 'error')
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
        })
    }

    /* async updateReporteAxios() {
        const { access_token } = this.props.authUser
        const { form, reporte } = this.state
        await axios.put(URL_DEV + 'reporte/' + reporte.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                modal.form = false
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el reporte.')
                this.getReporteAxios()
                this.setState({ ...this.state, modal, form: this.clearForm(), reporte: '' })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    } */

    async deleteReporteAxios() {
        const { access_token } = this.props.authUser
        const { reporte } = this.state
        await axios.delete(URL_DEV + 'reportes/reporte-mercadotecnia/' + reporte.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                modal.delete = false
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito el reporte.')
                this.getReporteAxios()
                this.setState({ ...this.state, modal, form: this.clearForm(), reporte: '' })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getReporteAxios = async() => { $('#kt_datatable_reporte_merca').DataTable().ajax.reload(); }

    setActions = () => {
        let aux = []
        aux.push(
            /* {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' }
            }, */
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

    setReportes = reportes => {
        let aux = []
        reportes.map((reporte) => {
            aux.push(
                {
                    actions: this.setActions(reporte),
                    empresa: renderToString(setTextTableCenter(reporte.empresa ? reporte.empresa.name : '')),
                    fecha: renderToString(setTextTableCenter(reporte.mes + ' - ' + reporte.año)),
                    reporte: renderToString(setAdjuntoTable(reporte)),
                    id: reporte.id
                }
            )
            return false
        })
        return aux
    }

    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            modal,
            title: 'Nuevo reporte',
            form: this.clearForm(),
            formeditado:0
        })
    }

    handleClose = () => {
        const { modal } = this.state
        modal.form = false
        this.setState({
            modal,
            title: 'Nuevo reporte',
            form: this.clearForm(),
            reporte: ''
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    form[element] = {
                        adjuntos: {
                            value: '',
                            placeholder: 'Adjunto',
                            files: []
                        }
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return ''
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

    handleChange = (files, item) => {
        const { form } = this.state
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
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            form
        })
    }

    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            modal,
            reporte: ''
        })
    }

    openModalDelete = reporte => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            modal,
            reporte: reporte
        })
    }

    openModalEdit = reporte => {
        const { form, modal } = this.state
        modal.form = true
        
        form.empresa = reporte.empresa.id.toString()
        form.mes = reporte.mes
        form.año = reporte.año
        let aux = []
        if (reporte.adjuntos) {
            reporte.adjuntos.map((adj) => {
                aux.push({
                    url: adj.url,
                    name: adj.name,
                    id: adj.id
                })
                return false
            })
        }
        form.adjuntos.adjuntos.files = aux
        this.setState({
            modal,
            title: 'Editar reporte',
            reporte: reporte,
            form,
            formeditado:1
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Nuevo reporte')
            this.addReporteAxios()
        if (title === 'Editar reporte')
            this.updateReporteAxios()
    }

    render() {
        const { form, modal, title, formeditado, options} = this.state
        return (
            <Layout active={'reportes'}  {...this.props}>
                <NewTableServerRender 
                    columns = { REPORTE_MERCA_COLUMNS } 
                    title = 'Reporte de mercadotecnia' 
                    subtitle ='Listado de reporte de mercadotecnia'
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
                    idTable = 'kt_datatable_reporte_merca'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    accessToken = { this.props.authUser.access_token }
                    setter =  {this.setReportes }
                    // urlRender = { URL_DEV + 'partidas'}
                    urlRender = { URL_DEV + 'reportes/reporte-mercadotecnia' }
                />

                <Modal size="xl" show={modal.form} title = {title} handleClose={this.handleClose}>
                    <MercadotecniaForm
                        form = { form } 
                        onChange = { this.onChange }
                        onSubmit = { this.onSubmit } 
                        formeditado={formeditado}
                        options={options}
                        handleChange={this.handleChange}
                    />
                </Modal>
                <ModalDelete title = "¿Estás seguro que deseas eliminar el reporte?" show = { modal.delete } 
                    handleClose = { this.handleCloseDelete } onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteReporteAxios() }} >
                </ModalDelete>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })
export default connect(mapStateToProps, mapDispatchToProps)(Mercadotecnia);