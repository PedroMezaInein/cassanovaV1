import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { URL_DEV, ADJUNTOS_EMPRESA_COLUMNS } from '../../../constants'
import { ModalDelete, Modal } from '../../../components/singles'
import axios from 'axios'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert } from '../../../functions/alert'
import { setTextTable, setArrayTable } from '../../../functions/setters'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { AdjuntoFormCard } from '../../../components/cards'
import $ from "jquery";
class AdjuntosEmpresa extends Component {
    state = {
        modal: {
            delete: false,
            see: false
        },
        adjunto: ''
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const adjunto = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!adjunto)
            history.push('/')
    }
    changePageEdit = (adjunto) => {
        const { history } = this.props
        history.push({
            pathname: '/catalogos/adjuntos/edit',
            state: { adjunto: adjunto }
        });
    }
    openModalDelete = adjunto => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            adjunto: adjunto
        })
    }
    handleCloseModalDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ...this.state,
            modal,
            adjunto: ''
        })
    }
    openModalSee = adjunto => {
        const { modal } = this.state
        modal.see = true
        this.setState({
            ...this.state,
            modal,
            adjunto: adjunto
        })
    }
    handleCloseSee = () => {
        const { modal } = this.state
        modal.see = false
        this.setState({
            ...this.state,
            modal,
            adjunto: ''
        })
    }
    setAdjuntos = (adjuntos) => {
        let aux = []
        adjuntos.map((adjunto) => {
            aux.push({
                actions: this.setActions(adjunto),
                empresa: renderToString(setTextTable(adjunto.empresa ? adjunto.empresa.name : 'Sin definir')),
                tipo_adjunto: renderToString(setTextTable(adjunto.nombre)),
                adjunto: renderToString(setArrayTable([{ text: adjunto.name, url: adjunto.url }])),
                id: adjunto.id,
            })
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
                tooltip: { id: 'edit', text: 'Editar' }
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' }
            },
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            }
        )
        return aux
    }
    async getAdjuntosAxios() {
        $('#kt_datatable_adjunto').DataTable().ajax.reload();
    }
    async deleteAdjuntosAxios() {
        const { access_token } = this.props.authUser
        const { adjunto } = this.state
        await axios.delete(URL_DEV + 'adjuntos/' + adjunto.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                this.getAdjuntosAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El adjunto fue eliminado con éxito.')
                modal.delete = false
                this.setState({
                    ...this.state,
                    adjunto: '',
                    modal
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
        const { modal, adjunto } = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <NewTableServerRender
                    columns={ADJUNTOS_EMPRESA_COLUMNS}
                    title='Adjuntos de empresas'
                    subtitle='Listado de adjuntos'
                    mostrar_boton={true}
                    abrir_modal={false}
                    mostrar_acciones={true}
                    url='/catalogos/adjuntos/add'
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete },
                        'see': { function: this.openModalSee },
                    }}
                    idTable='kt_datatable_adjunto'
                    accessToken={this.props.authUser.access_token}
                    setter={this.setAdjuntos}
                    urlRender={URL_DEV + 'adjuntos'}
                    cardTable='cardTable_adjunto'
                    cardTableHeader='cardTableHeader_adjunto'
                    cardBody='cardBody_adjunto'
                />
                <ModalDelete
                    title='¿Quieres eliminar el elemento?'
                    show={modal.delete}
                    handleClose={this.handleCloseModalDelete}
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteAdjuntosAxios() }}
                />
                <Modal title="Adjunto" show={modal.see} handleClose={this.handleCloseSee} >
                    <AdjuntoFormCard adjunto={adjunto} />
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

export default connect(mapStateToProps, mapDispatchToProps)(AdjuntosEmpresa);