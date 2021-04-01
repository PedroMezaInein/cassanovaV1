import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { TRASPASOS_COLUMNS, URL_DEV } from '../../../constants'
import { doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'
import { setArrayTable, setDateTable, setMoneyTable, setTextTableCenter } from '../../../functions/setters'
import axios from 'axios'
import { ModalDelete, Modal } from '../../../components/singles'
import { TraspasoCard } from '../../../components/cards'
const $ = require('jquery');
class Traspasos extends Component {
    state = {
        modal: {
            delete: false,
            see: false
        },
        traspaso: ''
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const modulo = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!modulo)
            history.push('/')
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                const {modal} = this.state
                modal.see = true
                this.setState({
                    ...this.state,
                    modal
                })
                this.getTraspaso(id)
            }
        }
    }
    setTraspasos = traspasos => {
        let aux = []
        traspasos.map((traspaso) => {
            let transpaso_destino = traspaso.destino ? [{ name: 'Nombre', text: traspaso.destino.nombre },{ name: '# cuenta', text: traspaso.destino.numero }] : []
            let transpaso_origen = traspaso.origen ? [{ name: 'Nombre', text: traspaso.origen.nombre },{ name: '# cuenta', text: traspaso.origen.numero }]: []
            aux.push({
                actions: this.setActions(traspaso),
                identificador: renderToString(setTextTableCenter(traspaso.id)),
                origen: renderToString(setArrayTable(transpaso_origen,'250px')),
                destino: renderToString(setArrayTable(transpaso_destino,'250px')),
                monto: renderToString(setMoneyTable(traspaso.cantidad)),
                comentario: renderToString(setTextTableCenter(traspaso.comentario)),
                usuario: renderToString(setTextTableCenter(traspaso.user.name)),
                fecha: renderToString(setDateTable(traspaso.created_at)),
                id: traspaso.id
            })
            return false
        })
        return aux
    }
    setActions = traspaso => {
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
        if (traspaso.adjunto) {
            aux.push(
                {
                    text: 'Adjunto',
                    btnclass: 'info',
                    iconclass: 'flaticon2-paper',
                    action: 'adjuntos',
                    tooltip: { id: 'adjuntos', text: 'Mostrar adjuntos' }
                }
            )
        }
        return aux
    }
    changePageEdit = traspaso => {
        const { history } = this.props
        history.push({
            pathname: '/bancos/traspasos/edit',
            state: { traspaso: traspaso }
        });
    }
    openModalDelete = traspaso => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            traspaso: traspaso
        })
    }
    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ...this.state,
            modal,
            traspaso: ''
        })
    }
    openModalSee = traspaso => {
        const { modal } = this.state
        modal.see = true
        this.setState({
            ...this.state,
            modal,
            traspaso: traspaso
        })
    }
    handleCloseSee = () => {
        const { modal } = this.state
        modal.see = false
        this.setState({
            ...this.state,
            modal,
            traspaso: ''
        })
    }
    adjuntoTranspaso = (traspaso) => {
        var win = window.open(traspaso.adjunto.url, '_blank');
        win.focus();
    }
    async getTraspasosAxios() {
        $('#kt_datatable_transpasos').DataTable().ajax.reload();
    }
    async getTraspaso(id) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'traspasos/single/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { traspaso } = response.data
                this.setState({
                    ...this.state,
                    traspaso: traspaso
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
    async exportTraspasosAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'exportar/traspasos', { responseType: 'blob', headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'traspasos.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async deleteTraspasoAxios() {
        const { access_token } = this.props.authUser
        const { traspaso } = this.state
        await axios.delete(URL_DEV + 'traspasos/' + traspaso.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getTraspasosAxios()
                const { modal } = this.state
                modal.delete = false
                this.setState({
                    ...this.state,
                    modal,
                    traspaso: ''
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    render() {
        const { modal, traspaso } = this.state
        return (
            <Layout active='bancos' {...this.props}>
                <NewTableServerRender
                    columns={TRASPASOS_COLUMNS}
                    title='Traspasos'
                    subtitle='Listado de traspasos'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url='/bancos/traspasos/add'
                    mostrar_acciones={true}
                    actions={
                        {
                            'edit': { function: this.changePageEdit },
                            'delete': { function: this.openModalDelete },
                            'adjuntos': { function: this.adjuntoTranspaso },
                            'see': { function: this.openModalSee },
                        }
                    }
                    accessToken={this.props.authUser.access_token}
                    setter={this.setTraspasos}
                    urlRender={URL_DEV + 'traspasos'}
                    idTable='kt_datatable_transpasos'
                    exportar_boton={true}
                    onClickExport={() => this.exportTraspasosAxios()}
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />
                <ModalDelete 
                    title="¿Estás seguro que deseas eliminar el traspaso?"
                    show={modal.delete} handleClose={this.handleCloseDelete}
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteTraspasoAxios() }} 
                />
                <Modal size="lg" title="Traspaso" show={modal.see} handleClose={this.handleCloseSee} >
                    <TraspasoCard traspaso={traspaso} />
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = ({})

export default connect(mapStateToProps, mapDispatchToProps)(Traspasos)