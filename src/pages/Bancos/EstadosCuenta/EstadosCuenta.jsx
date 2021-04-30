import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { Modal, ModalDelete } from '../../../components/singles'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV, EDOS_CUENTAS_COLUMNS_2 } from '../../../constants'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { renderToString } from 'react-dom/server'
import { waitAlert, doneAlert, errorAlert, printResponseErrorAlert, customInputAlert } from '../../../functions/alert'
import { setDateTableReactDom, setArrayTable, setTextTableCenter } from '../../../functions/setters'
import { EstadoCuentaCard } from '../../../components/cards'
import { Update } from '../../../components/Lottie'
import { printSwalHeader } from '../../../functions/printers'
import { CalendarDaySwal } from '../../../components/form-components'
import $ from "jquery";
class EstadosCuenta extends Component {
    state = {
        modal: { delete: false, see: false },
        cuentas: [],
        cuenta: '',
        estados: [],
        data: { estados: [] },
        form: {
            fecha: new Date(),
            cuenta: '',
            adjuntos: { adjuntos: { value: '', placeholder: 'Adjunto', files: [] } }
        },
    }
    
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const estados = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!estados)
            history.push('/')
    }
    
    setEstados = estados => {
        let aux = []
        estados.map((estado, key) => {
            aux.push({
                actions: this.setActions(estado),
                identificador: renderToString(setTextTableCenter(estado.id)),
                cuenta: estado.cuenta ?
                    renderToString(setArrayTable(
                        [
                            { 'name': 'Cuenta', 'text': estado.cuenta.nombre ? estado.cuenta.nombre : 'Sin definir' },
                            { 'name': 'No. Cuenta', 'text': estado.cuenta.numero ? estado.cuenta.numero : 'Sin definir' },
                        ],'129px'
                    ))
                    : '',
                estado: renderToString(setArrayTable([{ url: estado.adjunto.url, text: estado.adjunto.name }])),
                fecha: setDateTableReactDom(estado.created_at, this.doubleClick, estado, 'fecha', 'text-center'),
                id: estado.id
            })
            return false
        })
        return aux
    }
    
    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
            case 'fecha':
                form.fecha = new Date(data.created_at)
                break
            default:
                form[tipo] = data[tipo]
                break
        }
        this.setState({form})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) } </h2>
                {
                    tipo === 'fecha' ?
                        <CalendarDaySwal value = { form[tipo] } onChange = { (e) => {  this.onChangeSwal(e.target.value, tipo)} } name = { tipo } date = { form[tipo] } withformgroup={0} />
                    :<></>
                }
            </div>,
            <Update />,
            () => { this.patchEstadosCuenta(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    
    patchEstadosCuenta = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/bancos/estados-cuentas/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getEstadosCuentaAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El estado de cuenta fue editado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch(element){
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
        })
        return form
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
        modal.delete = true
        this.setState({ ...this.state, modal, estado: estado })
    }

    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({ ...this.state, modal, estado: '' })
    }

    openModalSee = estado => {
        const { modal } = this.state
        modal.see = true
        this.setState({ ...this.state, modal, estado: estado })
    }

    handleCloseSee = () => {
        const { modal } = this.state
        modal.see = false
        this.setState({ ...this.state, modal, estado: '' })
    }

    async getEstadosCuentaAxios() { $('#kt_datatable_estados_cuenta').DataTable().ajax.reload(); }

    async deleteEstadoAxios() {
        const { access_token } = this.props.authUser
        const { estado } = this.state
        await axios.delete(`${URL_DEV}cuentas/${estado.cuenta.id}/estado/${estado.adjunto_id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getEstadosCuentaAxios()
                const { modal } = this.state
                modal.delete = false
                this.setState({ ...this.state, modal, estado: '' })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste el estado de cuenta')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        const { modal, estado } = this.state
        return (
            <Layout active={'bancos'}  {...this.props}>
                <NewTableServerRender columns = { EDOS_CUENTAS_COLUMNS_2 } title = 'Estados de cuenta' subtitle = 'Listado de estados de cuenta'
                    mostrar_boton = { true } abrir_modal = { false } url = '/bancos/estados-cuenta/add' mostrar_acciones = { true }
                    actions = { { 'delete': { function: this.openModalDelete }, 'see': { function: this.openModalSee } } }
                    accessToken = { this.props.authUser.access_token } setter = { this.setEstados } urlRender = { `${URL_DEV}v2/bancos/estados-cuentas` }
                    idTable = 'kt_datatable_estados_cuenta' cardTable = 'cardTable' cardTableHeader = 'cardTableHeader' cardBody = 'cardBody' />
                <ModalDelete title = "¿Estás seguro que deseas eliminar el estado de cuenta?" show = { modal.delete } handleClose = { this.handleCloseDelete }
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteEstadoAxios() }} />
                <Modal size="lg" title="Estado de cuenta" show={modal.see} handleClose={this.handleCloseSee} >
                    <EstadoCuentaCard estado={estado} />
                </Modal>
            </Layout>
        )
    }
}
const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })
export default connect(mapStateToProps, mapDispatchToProps)(EstadosCuenta);