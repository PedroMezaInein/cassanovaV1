import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, RENDIMIENTOS_COLUMNS } from '../../../constants'
import { setTextTable, setMoneyTable, setTextTableCenter} from '../../../functions/setters'
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal } from '../../../components/singles'
import { doneAlert, printResponseErrorAlert, errorAlert, waitAlert } from '../../../functions/alert'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { RendimientoCard } from '../../../components/cards'
const $ = require('jquery');
class Rendimientos extends Component {
    state = {
        modalDelete: false,
        modalSee: false,
        formeditado:0,
        rendimientos: [],
        rendimiento: ''
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const rendimientos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!rendimientos)
            history.push('/')
    }
    changePageEdit = (rendimiento) => {
        const { history } = this.props
        history.push({
            pathname: '/presupuesto/rendimiento/edit',
            state: { rendimiento: rendimiento}
        });
    }
    openModalDelete = rendimiento => {
        this.setState({
            ...this.state,
            modalDelete: true,
            rendimiento: rendimiento
        })
    }
    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ...this.state,
            modalDelete: !modalDelete,
            rendimiento: '',
        })
    }
    openModalSee = rendimiento => {
        this.setState({
            ...this.state,
            modalSee: true,
            rendimiento: rendimiento
        })
    }
    handleCloseSee = () => {
        this.setState({
            ...this.state,
            modalSee: false,
            rendimiento: ''
        })
    }
    setRendimientos = rendimientos => {
        let aux = []
        rendimientos.map((rendimiento) => {
            aux.push(
                {
                    actions: this.setActions(rendimiento),
                    materiales: renderToString(setTextTableCenter(rendimiento.materiales)),
                    unidad: renderToString(setTextTableCenter(rendimiento.unidad ? rendimiento.unidad.nombre : '')),
                    costo: renderToString(setMoneyTable(rendimiento.costo)),
                    proveedor: renderToString(setTextTableCenter(rendimiento.proveedor ? rendimiento.proveedor.razon_social : '')),
                    rendimiento: renderToString(setTextTableCenter(rendimiento.rendimiento)),
                    descripcion: renderToString(setTextTable(rendimiento.descripcion)),
                    id: rendimiento.id
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
                tooltip: {id:'see', text:'Mostrar', type:'info'}
            }
        )
        return aux
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
    async getRemisionesAxios() {
        $('#kt_datatable_rendimiento').DataTable().ajax.reload();
    }
    async deleteRendimientoAxios() {
        const { access_token } = this.props.authUser
        const { rendimiento } = this.state
        await axios.delete(URL_DEV + 'rendimientos/' + rendimiento.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'La rendimiento fue registrado con éxito.')                
                this.getRemisionesAxios()
                this.setState({
                    ...this.state,
                    modalDelete: false,
                    rendimiento: ''
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
    render() {
        const { modalDelete, modalSee, rendimiento} = this.state
        return (
            <Layout active={'presupuesto'}  {...this.props}>
                <NewTableServerRender
                    columns={RENDIMIENTOS_COLUMNS} 
                    title='Rendimientos' 
                    subtitle='Listado de rendimientos'
                    mostrar_boton={true}
                    abrir_modal={false}
                    mostrar_acciones={true}
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete },
                        'see': { function: this.openModalSee },
                    }}
                    url='/presupuesto/rendimiento/add'
                    idTable = 'kt_datatable_rendimiento'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    accessToken={this.props.authUser.access_token}
                    setter={this.setRendimientos}
                    urlRender={`${URL_DEV}v2/presupuesto/rendimientos`}
                    />
                <ModalDelete title={"¿Estás seguro que deseas eliminar el rendimiento?"} show={modalDelete} handleClose={this.handleCloseDelete} onClick={(e) => { e.preventDefault(); this.deleteRendimientoAxios() }}>
                </ModalDelete>
                <Modal size="lg" title="Rendimiento" show = { modalSee } handleClose = { this.handleCloseSee } >
                    <RendimientoCard 
                        rendimiento={rendimiento}
                    />
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

export default connect(mapStateToProps, mapDispatchToProps)(Rendimientos);