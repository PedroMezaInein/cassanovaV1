import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { Modal, ModalDelete } from '../../../components/singles'
import axios from 'axios'
import { URL_DEV, EDOS_CUENTAS_COLUMNS_2 } from '../../../constants'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { renderToString } from 'react-dom/server'
import { waitAlert, doneAlert, errorAlert, forbiddenAccessAlert } from '../../../functions/alert'
import { setTextTable, setDateTable, setArrayTable } from '../../../functions/setters'
import { EstadoCuentaCard } from '../../../components/cards'
const $ = require('jquery');
class EstadosCuenta extends Component {
    state = {
        modal: {
            delete: false,
            see: false
        },
        cuentas: [],
        cuenta: '',
        estados: [],
        data: {
            estados: []
        }
    }
    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const estados = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!estados)
            history.push('/')
        // this.getEstadosCuenta()
    }
    setEstados = estados => {
        let aux = []
        estados.map((estado, key) => {
            aux.push({
                actions: this.setActions(estado),
                identificador: renderToString(setTextTable(estado.id)),
                cuenta: estado.cuenta ?
                    renderToString(setArrayTable(
                        [
                            { 'name': 'Cuenta', 'text': estado.cuenta.nombre ? estado.cuenta.nombre : 'Sin definir' },
                            { 'name': 'No. Cuenta', 'text': estado.cuenta.numero ? estado.cuenta.numero : 'Sin definir' },
                        ]
                    ))
                    : '',
                estado: renderToString(setArrayTable([{ url: estado.adjunto.url, text: estado.adjunto.name }])),
                fecha: renderToString(setDateTable(estado.created_at)),
                id: estado.id
            })
        })
        this.setState({
            ... this.state,
            estados: aux
        })
    }
    setActions = () => {
        let aux = []
        aux.push(
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
            },
        )
        return aux
    }
    openModalDelete = estado => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ... this.state,
            modal,
            estado: estado
        })
    }
    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ... this.state,
            modal,
            estado: ''
        })
    }
    openModalSee = estado => {
        const { modal } = this.state
        modal.see = false
        this.setState({
            ... this.state,
            modal,
            estado: estado
        })
    }
    handleCloseSee = () => {
        const { modal } = this.state
        modal.see = false
        this.setState({
            ... this.state,
            modal,
            estado: ''
        })
    }
    async getEstadosCuentaAxios() {
        $('#kt_datatable_estados_cuenta').DataTable().ajax.reload();
    }
    // async getEstadosCuenta() {
    //     const { access_token } = this.props.authUser
    //     await axios.get(URL_DEV + 'estados-cuentas', { headers: { Authorization: `Bearer ${access_token}` } }).then(
    //         (response) => {
    //             const { estados, cuentas } = response.data
    //             const { data } = this.state
    //             data.estados = estados
    //             this.setEstados(estados)
    //             let aux = []
    //             cuentas.map((element, key) => {
    //                 aux.push({ value: element.numero, name: element.nombre })
    //             })
    //             this.setState({
    //                 ... this.state,
    //                 cuentas: aux
    //             })
    //         },
    //         (error) => {
    //             console.log(error, 'error')
    //             if (error.response.status === 401) {
    //                 forbiddenAccessAlert()
    //             } else {
    //                 errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
    //             }
    //         }
    //     ).catch((error) => {
    //         errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
    //         console.log(error, 'error')
    //     })
    // }
    async deleteEstadoAxios() {
        const { access_token } = this.props.authUser
        const { estado } = this.state
        await axios.delete(URL_DEV + 'cuentas/' + estado.cuenta.id + '/estado/' + estado.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getEstadosCuentaAxios()
                const { estados } = response.data
                const { modal } = this.state
                modal.delete = false
                // data.estados = estados
                this.setState({
                    ... this.state,
                    modal,
                    estado: '',
                    // data
                })
                this.setEstados(estados)
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste el estado de cuenta')
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
        const { modal, estado } = this.state
        return (
            <Layout active={'bancos'}  {...this.props}>
                <NewTableServerRender
                    columns={EDOS_CUENTAS_COLUMNS_2}
                    // data={estados}
                    title='Estados de cuenta'
                    subtitle='Listado de estados de cuenta'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url = '/bancos/estados-cuenta/add'
                    mostrar_acciones={true}
                    actions={{
                        'delete': { function: this.openModalDelete },
                        'see': { function: this.openModalSee },
                    }}
                    accessToken={this.props.authUser.access_token}
                    setter={this.setEstados}
                    urlRender={URL_DEV + 'estados-cuentas'}
                    idTable='kt_datatable_estados_cuenta'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    // elements={data.estados}
                />
                <ModalDelete 
                    title={"¿Estás seguro que deseas eliminar el estado de cuenta?"}
                    show={modal.delete}
                    handleClose={this.handleCloseDelete}
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteEstadoAxios() }}
                >
                </ModalDelete>
                <Modal size="lg" title="Estado de cuenta" show={modal.see} handleClose={this.handleCloseSee} >
                    <EstadoCuentaCard estado={estado} />
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
export default connect(mapStateToProps, mapDispatchToProps)(EstadosCuenta);