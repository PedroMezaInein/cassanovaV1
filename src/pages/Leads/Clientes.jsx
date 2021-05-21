import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Button } from '../../components/form-components'
import axios from 'axios'
import { URL_DEV, CLIENTES_COLUMNS, EMPTY_CLIENTE, CP_URL, TOKEN_CP } from '../../constants'
import Moment from 'react-moment'
import { Small } from '../../components/texts'
import { Form } from 'react-bootstrap'
import { ClienteForm } from '../../components/forms'
import { Modal } from '../../components/singles'
import NewTable from '../../components/tables/NewTable'
import { setTextTable, setDateTable, setDireccion } from '../../functions/setters'
import { validateAlert, doneAlert, errorAlert, printResponseErrorAlert } from '../../functions/alert'
import { ClienteCard} from '../../components/cards'

class Leads extends Component {

    state = {
        clientes: [],
        modal: false,
        modalDelete: false,
        modalSee: false,
        modalProspecto: false,
        cliente: '',
        form: EMPTY_CLIENTE,
        typeForm: 'Add',
        estado: '',
        municipio: '',
        data: {
            clientes: []
        },
        formeditado: 0,
        colonias: []
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const leads = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!leads)
            history.push('/')
        this.getClientesAxios();
    }

    clearForm = (name, empty) => {
        let aux = Object.keys(empty)
        let _form = this.state[name]
        aux.map((element) => {
            _form[element] = '';
        })
        this.setState({
            [name]: _form
        })
    }

    updateColonia = value => {
        this.onChange({ target: { name: 'colonia', value: value } })
    }

    changeCP = event => {
        const { value, name } = event.target
        this.onChange({ target: { name: name, value: value } })
        if (value.length === 5)
            this.cpAxios(value)
    }

    onChange = event => {
        const { form } = this.state
        const { name, value } = event.target
        if (name === 'empresa') {
            let cadena = value.replace(/,/g, '')
            cadena = cadena.replace(/\./g, '')
            form[name] = cadena
        } else
            form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    submitForm = (event) => {
        event.preventDefault();
        this.addClienteAxios();
    }

    submitEditForm = (event) => {
        event.preventDefault();
        this.editClienteAxios();
    }

    safeDelete = e => id => {
        this.deleteClienteAxios()
    }

    handleCloseModal = () => {
        this.setState({
            ...this.state,
            modal: false,
            typeForm: '',
            estado: '',
            municipio: ''
        })
        this.clearForm('form', EMPTY_CLIENTE)
    }

    handleDeleteModal = () => {
        this.setState({
            ...this.state,
            modalDelete: !this.state.modalDelete,
            cliente: ''
        })
        this.clearForm('form', EMPTY_CLIENTE)
    }

    openModal = () => {
        this.setState({
            ...this.state,
            modal: true,
            typeForm: 'Add',
            formeditado: 0
        })
        this.clearForm('form', EMPTY_CLIENTE)
    }

    openModalDelete = cliente => {
        this.setState({
            ...this.state,
            modalDelete: true,
            cliente
        })

    }

    openModalEdit = cliente => {

        const { form } = this.state

        if (cliente.cp) {
            this.cpAxios(cliente.cp)
            form['cp'] = cliente.cp
        }

        if (cliente.colonia) {
            form['colonia'] = cliente.colonia
        }

        form['empresa'] = cliente.empresa
        form['nombre'] = cliente.nombre
        form['puesto'] = cliente.puesto
        form['calle'] = cliente.calle
        form['perfil'] = cliente.perfil
        form['rfc'] = cliente.rfc

        this.setState({
            ...this.state,
            modal: true,
            typeForm: 'Edit',
            form,
            cliente,
            formeditado: 1
        })
    }

    openModalSee = cliente => {
        this.setState({
            ...this.state,
            modalSee: true,
            cliente: cliente
        })
    }

    handleCloseSee = () => {
        this.setState({
            ...this.state,
            modalSee: false,
            cliente: ''
        })
    }

    openModalAddProspecto = cliente => {
        this.setState({
            ...this.state,
            modalProspecto: true,
            cliente: cliente
        })
    }

    handleCloseAddProspecto = () => {
        this.setState({
            ...this.state,
            modalProspecto: false,
            cliente: ''
        })
    }

    setClientes = clientes => {
        let aux = [];
        clientes.map((cliente) => {
            aux.push(
                {
                    actions: this.setActions(cliente),
                    empresa: renderToString(setTextTable(cliente.empresa)),
                    nombre: renderToString(setTextTable(cliente.nombre)),
                    direccion: renderToString(setDireccion(cliente)),
                    perfil: renderToString(setTextTable(cliente.perfil)),
                    puesto: renderToString(setTextTable(cliente.puesto)),
                    rfc: renderToString(setTextTable(cliente.rfc)),
                    fecha: renderToString(setDateTable(cliente.created_at)),
                    id: cliente.id
                }
            )
        })
        this.setState({
            ...this.state,
            clientes: aux
        })
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
            },
            {
                text: 'Agregar&nbsp;prospecto',
                btnclass: 'info',
                iconclass: 'flaticon2-user-1',
                action: 'add_prospecto',
                tooltip: { id: 'add_prospecto', text: 'Agregar prospecto' }
            }
        )
        return aux
    }

    setText = text => {
        return (
            <Small>
                {text}
            </Small>
        )
    }

    setDate = date => {
        return (
            <Small>
                <Moment format="DD/MM/YYYY">
                    {date}
                </Moment>
            </Small>
        )
    }

    async getClientesAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'cliente', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { clientes } = response.data
                const { data } = this.state
                data.clientes = clientes
                this.setClientes(clientes)
                this.setState({
                    ...this.state,
                    data
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

    async addClienteAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'cliente', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { clientes } = response.data
                const { data } = this.state
                data.clientes = clientes
                this.setClientes(clientes)

                doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito un nuevo cliente.')

                this.setState({
                    ...this.state,
                    modal: false,
                    typeForm: '',
                    data
                })
                this.clearForm('form', EMPTY_CLIENTE)
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async editClienteAxios() {
        const { access_token } = this.props.authUser
        const { form, cliente } = this.state
        await axios.put(URL_DEV + 'cliente/' + cliente.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { clientes } = response.data
                const { data } = this.state
                data.clientes = clientes
                this.setClientes(clientes)

                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito al cliente.')

                this.setState({
                    ...this.state,
                    modal: false,
                    cliente: '',
                    data
                })
                this.clearForm('form', EMPTY_CLIENTE)
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteClienteAxios() {
        const { access_token } = this.props.authUser
        const { cliente } = this.state
        await axios.delete(URL_DEV + 'cliente/' + cliente.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { clientes } = response.data
                const { data } = this.state
                data.clientes = clientes
                this.setClientes(clientes)

                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito al cliente.')
                this.setState({
                    ...this.state,
                    modalDelete: false,
                    cliente: '',
                    data
                })
                this.clearForm('form', EMPTY_CLIENTE)
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async cpAxios(value) {
        await axios.get(`${CP_URL}${value}?token=${TOKEN_CP}&type=simplified`).then(
            (response) => {
                const { municipio, estado, asentamiento } = response.data.response
                const { cliente } = this.state
                let aux = [];
                asentamiento.map((colonia, key) => {
                    aux.push({ value: colonia, name: colonia.toUpperCase() })
                })
                this.setState({
                    ...this.state,
                    municipio,
                    estado,
                    colonias: aux
                })
                if (cliente.colonia) {
                    aux.find(function (element, index) {
                        if (element.name === cliente.colonia) {
                            this.updateColonia(element)
                        }
                    })
                }
                this.onChange({ target: { name: 'cp', value: value } })
                this.onChange({ target: { name: 'municipio', value: municipio.toUpperCase() } })
                this.onChange({ target: { name: 'estado', value: estado.toUpperCase() } })
            },
            (error) => {

            }
        ).catch((error) => {

        })
    }

    onSubmit = e => {
        e.preventDefault();
        const { typeForm } = this.state
        if (typeForm === 'Add') {
            this.submitForm(e)
        } else {
            this.submitEditForm(e)
        }
    }

    render() {
        const { clientes, modal, typeForm, form, estado, municipio, colonias, modalDelete, cliente, data, formeditado, modalSee, modalProspecto} = this.state
        return (
            <Layout active={'leads'}  {...this.props}>
                <NewTable columns={CLIENTES_COLUMNS} data={clientes}
                    title='Clientes' subtitle='Listado de clientes'
                    mostrar_boton={true}
                    abrir_modal={true}
                    mostrar_acciones={true}
                    onClick={this.openModal}
                    actions={{
                        'edit': { function: this.openModalEdit },
                        'delete': { function: this.openModalDelete },
                        'see': { function: this.openModalSee },
                        'add_prospecto': { function: this.openModalAddProspecto }
                    }}
                    elements={data.clientes}
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />

                <Modal size="xl" title={typeForm === 'Add' ? 'Registrar nuevo cliente' : 'Editar cliente'} show={modal} handleClose={this.handleCloseModal}>
                    <Form id="form-cliente"
                        onSubmit={
                            (e) => {
                                e.preventDefault();
                                validateAlert(this.onSubmit, e, 'form-cliente')
                            }
                        }>
                        <div className="">
                            <ClienteForm
                                formeditado={formeditado}
                                onChange={this.onChange}
                                form={form}
                                changeCP={this.changeCP}
                                estado={estado}
                                municipio={municipio}
                                colonias={colonias}
                                updateColonia={this.updateColonia}
                            />
                        </div>
                        <div className="card-footer py-3 pr-1">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-right pr-0 pb-0">
                                    <Button icon='' className="btn btn-primary mr-2"
                                        onClick={
                                            (e) => {
                                                e.preventDefault();
                                                validateAlert(this.onSubmit, e, 'form-cliente')
                                            }
                                        }
                                        text="ENVIAR"
                                    />
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal>
                <Modal size="lg" title={cliente === null ? "¿Estás seguro que deseas eliminar a " : "¿Estás seguro que deseas eliminar a " + cliente.empresa + " ?"} show={modalDelete} handleClose={this.handleDeleteModal} >
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick={this.handleDeleteModal} text="CANCELAR" className={"btn btn-light-primary font-weight-bolder mr-3"} />
                        <Button icon='' onClick={(e) => { this.safeDelete(e)(cliente.id) }} text="CONTINUAR" className={"btn btn-danger font-weight-bold mr-2"} />
                    </div>
                </Modal>
                <Modal size="lg" title="Cliente" show={modalSee} handleClose={this.handleCloseSee} >
                    <ClienteCard cliente={cliente} />
                </Modal>
                <Modal size="xl" title="Agregar prospecto" show={modalProspecto} handleClose={this.handleCloseAddProspecto} >
                    Formulario prospecto
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

export default connect(mapStateToProps, mapDispatchToProps)(Leads);