import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { Modal, ModalDelete } from '../../../components/singles'
import axios from 'axios'
import { URL_DEV, EDOS_CUENTAS_COLUMNS_2 } from '../../../constants'
import NewTable from '../../../components/tables/NewTable'
import { renderToString } from 'react-dom/server'
import { waitAlert, doneAlert, errorAlert, forbiddenAccessAlert } from '../../../functions/alert'
import { setTextTable, setDateTable, setArrayTable } from '../../../functions/setters'
import { EstadoCuentaCard } from '../../../components/cards'
class EstadosCuenta extends Component {
    state = {
        modalSee: false,
        adjunto: '',
        adjuntoName: '',
        adjuntoFile: '',
        modalDelete: false,
        cuentas: [],
        cuenta: '',
        fecha: new Date(),
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
        this.getEstadosCuenta()
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
        this.setState({
            ... this.state,
            modalDelete: true,
            estado: estado
        })
    }
    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            estado: ''
        })
    }
    openModalSee = estado => {
        this.setState({
            ... this.state,
            modalSee: true,
            estado: estado
        })
    }
    handleCloseSee = () => {
        this.setState({
            ... this.state,
            modalSee: false,
            estado: ''
        })
    }
    changePageEdit = estado => {
        const { history } = this.props
        history.push({
            pathname: '/bancos/estados-cuenta/edit',
            state: { estado: estado}
        });
    }
    async getEstadosCuenta() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'estados-cuentas', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { estados, cuentas } = response.data
                const { data } = this.state
                data.estados = estados
                this.setEstados(estados)
                let aux = []
                cuentas.map((element, key) => {
                    aux.push({ value: element.numero, name: element.nombre })
                })
                this.setState({
                    ... this.state,
                    cuentas: aux
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
    async deleteEstadoAxios() {
        const { access_token } = this.props.authUser
        const { estado } = this.state
        await axios.delete(URL_DEV + 'cuentas/' + estado.cuenta.id + '/estado/' + estado.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { estados } = response.data
                const { data } = this.state
                data.estados = estados
                this.setState({
                    ... this.state,
                    modalDelete: false,
                    estado: '',
                    data
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
        const { modalDelete, estados, data, modalSee, estado } = this.state
        return (
            <Layout active={'bancos'}  {...this.props}>
                <NewTable 
                    columns={EDOS_CUENTAS_COLUMNS_2}
                    data={estados}
                    title='Estados de cuenta'
                    subtitle='Listado de estados de cuenta'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url = '/bancos/estados-cuenta/add'
                    mostrar_acciones={true}
                    actions={{
                        'delete': { function: this.changePageEdit },
                        'see': { function: this.openModalSee },
                    }}
                    elements={data.estados}
                    idTable='kt_datatable_estados_cuenta'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />
                <ModalDelete 
                    title={"¿Estás seguro que deseas eliminar el estado de cuenta?"}
                    show={modalDelete}
                    handleClose={this.handleCloseDelete}
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteEstadoAxios() }}
                >
                </ModalDelete>
                <Modal size="lg" title="Estado de cuenta" show={modalSee} handleClose={this.handleCloseSee} >
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