import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV, CLIENTES_COLUMNS } from '../../../constants'
import { Modal, ModalDelete } from '../../../components/singles'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { setDateTableReactDom, setTagLabelClienteReactDom, setDireccion, setTextTableReactDom } from '../../../functions/setters'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert, customInputAlert } from '../../../functions/alert'
import { ClienteCard } from '../../../components/cards'
import { printSwalHeader } from '../../../functions/printers'
import { Update } from '../../../components/Lottie'
import { InputGray, CalendarDaySwal } from '../../../components/form-components'
import moment from 'moment'
import $ from "jquery";

class Leads extends Component {

    state = {
        modal: {
            delete: false,
            see: false,
            prospecto: false,
        },
        clientes: [],
        cliente: '',
        data: {
            clientes: []
        },
        form: {
            colonias: [],
            empresa: '',
            nombre: '',
            puesto: '',
            cp: '',
            estado: '',
            municipio: '',
            colonia: '',
            calle: '',
            perfil: '',
            rfc: '',
            contacto:'',
            fecha: new Date(),
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const clientes = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!clientes)
            history.push('/')
    }

    setClientes = clientes => {
        let aux = []
        clientes.map((cliente) => {
            aux.push({
                actions: this.setActions(cliente),
                empresa: setTextTableReactDom(cliente.empresa, this.doubleClick, cliente, 'empresa', 'text-center'),
                nombre: setTextTableReactDom(cliente.nombre, this.doubleClick, cliente, 'nombre', 'text-center'),
                proyecto: setTagLabelClienteReactDom(cliente, cliente.proyectos, 'proyecto', this.deleteElementAxios),
                direccion: renderToString(setDireccion(cliente)),
                puesto: setTextTableReactDom(cliente.puesto, this.doubleClick, cliente, 'puesto', 'text-center'),
                rfc: setTextTableReactDom(cliente.rfc, this.doubleClick, cliente, 'rfc', 'text-center'),
                fecha: setDateTableReactDom(cliente.created_at, this.doubleClick, cliente, 'fecha', 'text-center'),
                id: cliente.id
            })
            return false
        })
        return aux
    }

    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
            case 'fecha':
                form.fecha = new Date(moment(data.created_at))
                break
            case 'nombre_emergencia':
                form.nombre_emergencia = data.nombre_emergencia
                form.telefono_emergencia = data.telefono_emergencia
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
                    (tipo === 'nombre') || (tipo === 'puesto') || (tipo === 'rfc') || (tipo === 'empresa') ?
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }
                        />
                    :<></>
                }
                {
                    tipo === 'fecha' ?
                        <CalendarDaySwal value = { form.fecha } onChange = { (e) => {  this.onChangeSwal(e.target.value, 'fecha')} } name = { 'fecha' } date = { form.fecha } withformgroup={0} />
                    :<></>
                }
            </div>,
            <Update />,
            () => { this.patchEmpleados(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch(element){
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

    changePageEdit = cliente => {
        const { history } = this.props
        history.push({ pathname: '/leads/clientes/edit', state: { cliente: cliente } });
    }

    openModalDelete = cliente => {
        const { modal } = this.state
        modal.delete = true
        this.setState({ ...this.state, modal, cliente })
    }

    handleDeleteModal = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({ ...this.state, modal, cliente: '' })
    }

    openModalSee = cliente => {
        const { modal } = this.state
        modal.see = true
        this.setState({ ...this.state, modal, cliente: cliente })
    }

    handleCloseSee = () => {
        const { modal } = this.state
        modal.see = false
        this.setState({ ...this.state, modal, cliente: '' })
    }

    openModalAddProspecto = cliente => {
        const { modal } = this.state
        modal.prospecto = true
        this.setState({ ...this.state, modal, cliente: cliente })
    }

    handleCloseAddProspecto = () => {
        const { modal } = this.state
        modal.prospecto = false
        this.setState({ ...this.state, modal, cliente: '' })
    }

    deleteClienteAxios = async () => {
        const { access_token } = this.props.authUser
        const { cliente } = this.state
        await axios.delete(URL_DEV + 'cliente/' + cliente.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getClientesAxios()
                const { modal } = this.state
                modal.delete = false
                this.setState({ ...this.state, modal, cliente: '' })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Cliente eliminada con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    patchEmpleados = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/leads/clientes/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getClientesAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'La empleado fue editado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    deleteElementAxios = async(data, element, tipo) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.delete(`${URL_DEV}v2/leads/clientes/${data.id}/proyecto/${element.id}`, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getClientesAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El empleado fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getClientesAxios = async () => { $('#clientes').DataTable().ajax.reload(); }

    render() {
        const { modal, cliente } = this.state
        return (
            <Layout active = 'leads'  {...this.props}>
                <NewTableServerRender columns = { CLIENTES_COLUMNS } title = 'Clientes' subtitle = 'Listado de clientes' mostrar_boton = { true }
                    abrir_modal = { false } url = '/leads/clientes/add' mostrar_acciones = { true } accessToken = { this.props.authUser.access_token }
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete },
                        'see': { function: this.openModalSee },
                        'prospecto': { function: this.openModalAddProspecto }
                    }}
                    setter = { this.setClientes } urlRender = { `${URL_DEV}cliente` } cardTable = 'cardTable' cardTableHeader = 'cardTableHeader'
                    cardBody = 'cardBody' idTable = 'clientes' />
                <ModalDelete title = { cliente === null ? "¿Estás seguro que deseas eliminar a " : "¿Estás seguro que deseas eliminar a " + cliente.empresa + " ?" }
                    show = { modal.delete } handleClose = { this.handleDeleteModal } onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteClienteAxios() }} />
                <Modal size="lg" title="Cliente" show={modal.see} handleClose={this.handleCloseSee} >
                    <ClienteCard cliente={cliente} />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Leads);