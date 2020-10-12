import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, REMISION_COLUMNS } from '../../../constants'
import { setTextTable, setDateTable, setArrayTable } from '../../../functions/setters'
import { errorAlert, forbiddenAccessAlert, doneAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { Modal, ModalDelete } from '../../../components/singles'
import { Button } from '../../../components/form-components'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import { RemisionCard } from '../../../components/cards'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
const $ = require('jquery');
class Remisiones extends Component {
    state = {
        modalDelete: false,
        modalSingle: false,
        title: 'Nueva remisión',
        remision: '',
        formeditado: 0,
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const remisiones = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!remisiones)
            history.push('/')
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                this.getRemisionAxios(id)
            }
        }
    }
    openModalDelete = remision => {
        this.setState({
            ...this.state,
            modalDelete: true,
            remision: remision
        })
    }
    openModalSee = remision => {
        this.setState({
            ...this.state,
            modalSingle: true,
            remision: remision
        })
    }
    handleCloseSingle = () => {
        this.setState({
            ...this.state,
            modalSingle: false,
            remision: ''
        })
    }
    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ...this.state,
            modalDelete: !modalDelete,
            remision: '',
        })
    }
    setRemisiones = remisiones => {
        let aux = []
        remisiones.map((remision) => {
            aux.push(
                {
                    actions: this.setActions(remision),
                    fecha: renderToString(setDateTable(remision.created_at)),
                    proyecto: renderToString(setTextTable(remision.proyecto ? remision.proyecto.nombre : '')),
                    area: renderToString(setTextTable(remision.subarea ? remision.subarea.area ? remision.subarea.area.nombre : '' : '')),
                    subarea: renderToString(setTextTable(remision.subarea ? remision.subarea.nombre : '')),
                    descripcion: renderToString(setTextTable(remision.descripcion)),
                    adjunto: remision.adjunto ? renderToString(setArrayTable([{ text: remision.adjunto.name, url: remision.adjunto.url }])) : renderToString(setTextTable('Sin adjuntos')),
                    id: remision.id
                }
            )
            return false
        })
        return aux
    }
    setActions = () => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' },
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' },
            },
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'success' },
            },
            {
                text: 'Convertir&nbsp;a&nbsp;solicitud&nbsp;de&nbsp;compra',
                btnclass: 'info',
                iconclass: 'flaticon2-refresh',
                action: 'convert',
                tooltip: { id: 'convert', text: 'Convertir', type: 'success' },
            }
        )
        return aux
    }
    changePageConvert = remision => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/solicitud-compra/convert',
            state: { remision: remision },
            formeditado: 1
        });
    }
    changePageEdit = remision => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/remision/edit',
            state: { remision: remision },
            formeditado: 1
        });
    }
    async getRemisionesAxios() {
        $('#kt_datatable_remisiones').DataTable().ajax.reload();
    }
    async getRemisionAxios(id) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'remision/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { remision } = response.data
                this.setState({
                    ...this.state,
                    modalSingle: true,
                    remision: remision,
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async deleteRemisionAxios() {
        const { access_token } = this.props.authUser
        const { remision } = this.state
        await axios.delete(URL_DEV + 'remision/' + remision.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getRemisionesAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'La remisión fue eliminada con éxito.')
                this.setState({
                    ...this.state,
                    modalDelete: false,
                    remision: '',
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    render() {
        const { modalDelete, modalSingle, remision } = this.state
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <NewTableServerRender 
                    columns = { REMISION_COLUMNS }
                    title = 'Remisiones' 
                    subtitle = 'Listado de remisiones'
                    mostrar_boton = { true }
                    abrir_modal = { false }
                    url = '/proyectos/remision/add'
                    mostrar_acciones = { true }
                    actions = {
                        {
                            'edit': { function: this.changePageEdit },
                            'delete': { function: this.openModalDelete },
                            'convert': { function: this.changePageConvert },
                            'see': { function: this.openModalSee }
                        }
                    }
                    cardTable = 'cardTable'
                    cardTableHeader = 'cardTableHeader'
                    cardBody = 'cardBody'
                    idTable = 'kt_datatable_remisiones'
                    accessToken={this.props.authUser.access_token}
                    setter={this.setRemisiones}
                    urlRender={URL_DEV + 'remision'}
                />
                <ModalDelete 
                    title = "¿Estás seguro que deseas eliminar la remisión?" 
                    show = { modalDelete } 
                    handleClose = { this.handleCloseDelete } 
                    onClick = { (e) => { e.preventDefault(); this.deleteRemisionAxios() }} />
                <Modal size="xl" title="Remisión" show={modalSingle} handleClose={this.handleCloseSingle} >
                    <RemisionCard data={remision}>
                        {
                            remision.convertido ? '' :
                                <Button pulse="pulse-ring" className="btn btn-icon btn-light-info pulse pulse-info" onClick={(e) => { e.preventDefault(); this.changePageConvert(remision) }} icon={faSync}
                                    tooltip={{ text: 'COMPRAR' }} />
                        }
                    </RemisionCard>
                </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(Remisiones);