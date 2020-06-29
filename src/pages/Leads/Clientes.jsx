import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { faPlus, faPhone, faEnvelope, faEye, faEdit, faTrash, faCalendarAlt, faPhoneVolume } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../components/form-components'
import axios from 'axios'
import { URL_DEV, CLIENTES_COLUMNS, EMPTY_CLIENTE, CP_URL } from '../../constants'
import swal from 'sweetalert'
import Moment from 'react-moment'
import { DataTable } from '../../components/tables'
import { Small, Subtitle, B } from '../../components/texts'
import { Form } from 'react-bootstrap'
import { ClienteForm } from '../../components/forms'
import { Modal } from '../../components/singles'
import NewTable from '../../components/tables/NewTable'

import { setOptions, setSelectOptions, setTextTable, setDateTable, setListTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../functions/setters'

class Leads extends Component {

    state = {
        clientes: [],
        modal: false,
        modalDelete: false,
        cliente: '',
        form: EMPTY_CLIENTE,
        typeForm: 'Add',
        estado: '',
        municipio: '',
        data: {
            clientes: []
        },
        formeditado:0,
        colonias: []
    }

    constructor(props) {
        super(props);
        const { state } = props.location
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const leads = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!leads)
            history.push('/')
        this.getClientesAxios();
    }

    // Form

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
        form[name] = value
        this.setState({
            ... this.state,
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

    // Modal
    handleCloseModal = () => {
        this.setState({
            ... this.state,
            modal: false,
            typeForm: '',
            estado: '',
            municipio: ''
        })
        this.clearForm('form', EMPTY_CLIENTE)
    }

    handleDeleteModal = () => {
        this.setState({
            ... this.state,
            modalDelete: !this.state.modalDelete,
            cliente: ''
        })
        this.clearForm('form', EMPTY_CLIENTE)
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true,
            typeForm: 'Add',
            formeditado:0
        })
        this.clearForm('form', EMPTY_CLIENTE)
    }

    openModalDelete = cliente => {
        this.setState({
            ... this.state,
            modalDelete: true,
            cliente
        })

    }

    openModalEdit = cliente => {

        const { form, colonias } = this.state

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
            ... this.state,
            modal: true,
            typeForm: 'Edit',
            form,
            cliente,
            formeditado:1
        })
    }

    // Setters

    setClientes = clientes => {
        let aux = [];
        clientes.map((cliente) => {
            aux.push(
                {
                    actions: this.setActions(cliente),
                    empresa: renderToString(setTextTable(cliente.empresa)),
                    direccion: renderToString(this.setDireccion(cliente)),
                    perfil: renderToString(setTextTable(cliente.perfil)),
                    nombre: renderToString(setTextTable(cliente.nombre)),
                    puesto: renderToString(setTextTable(cliente.puesto)),
                    fecha: renderToString(setDateTable(cliente.created_at)),
                    id: cliente.id
                }
            )
        })
        this.setState({
            ... this.state,
            clientes: aux
        })
    }
    setActions = cliente => {
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
            }
        )
        return aux
    }

    /*    setActions = cliente => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalEdit(e)(cliente)} text='' icon={faEdit} color="transparent" 
                        tooltip={{id:'edit', text:'Editar'}} />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalDelete(e)(cliente)} text='' icon={faTrash} color="red" 
                        tooltip={{id:'delete', text:'Eliminar', type:'error'}} />
                </div>
            </>
        )
    }*/

    setText = text => {
        return (
            <Small>
                {text}
            </Small>
        )
    }

    setDireccion = cliente => {
        return (
            <>
                <Small className="mr-1">
                    {cliente.calle}, colonia
                </Small>
                <Small className="mr-1">
                    {cliente.colonia},
                </Small>
                <Small className="mr-1">
                    {cliente.municipio},
                </Small>
                <Small className="mr-1">
                    {cliente.estado}. CP:
                </Small>
                <Small className="mr-1">
                    {cliente.cp}
                </Small>
            </>
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

    // Axios

    async getClientesAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'cliente', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { clientes } = response.data
                const { data } = this.state
                data.clientes = clientes
                this.setClientes(clientes)
                this.setState({
                    ... this.state,
                    //clientes: this.setClientes(clientes),
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                } else {
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',

                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',

            })
        })
    }

    async addClienteAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'cliente', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { clientes } = response.data
                this.setClientes(clientes)
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Creaste con éxito un nuevo cliente.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                this.setState({
                    ... this.state,
                    modal: false,
                    typeForm: ''
                })
                this.clearForm('form', EMPTY_CLIENTE)
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                } else {
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',

                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',

            })
        })
    }

    async editClienteAxios() {
        const { access_token } = this.props.authUser
        const { form, cliente } = this.state
        await axios.put(URL_DEV + 'cliente/' + cliente.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { clientes, message } = response.data
                this.setClientes(clientes)
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Editaste con éxito al cliente.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                this.setState({
                    ... this.state,
                    modal: false,
                    cliente: ''
                })
                this.clearForm('form', EMPTY_CLIENTE)
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                } else {
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',

                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',

            })
        })
    }

    async deleteClienteAxios() {
        const { access_token } = this.props.authUser
        const { form, cliente } = this.state
        await axios.delete(URL_DEV + 'cliente/' + cliente.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { clientes } = response.data
                this.setClientes(clientes)
                swal({
                    title: '¡Listo 👋!',
                    text: response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito al cliente.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                this.setState({
                    ... this.state,
                    modalDelete: false,
                    cliente: ''
                })
                this.clearForm('form', EMPTY_CLIENTE)
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                } else {
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',

                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',

            })
        })
    }

    async cpAxios(value) {
        await axios.get(CP_URL + value + '?type=simplified').then(
            (response) => {
                const { municipio, estado, asentamiento } = response.data.response
                const { cliente } = this.state
                let aux = [];
                asentamiento.map((colonia, key) => {
                    aux.push({ value: colonia, name: colonia })
                })
                this.setState({
                    ... this.state,
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
                this.onChange({ target: { name: 'municipio', value: municipio } })
                this.onChange({ target: { name: 'estado', value: estado } })
            },
            (error) => {

            }
        ).catch((error) => {

        })
    }

    render() {
        const { clientes, modal, typeForm, form, estado, municipio, colonias, modalDelete, cliente, data, formeditado, onSubmit} = this.state
        return (
            <Layout active={'leads'}  {...this.props}>
                {/*<div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon={faPlus} color="green" 
                        tooltip={{id:'add', text:'Nuevo'}} />
                </div>
                */}

                {/* <DataTable columns = { CLIENTES_COLUMNS } data = { clientes } />*/}
                <NewTable columns={CLIENTES_COLUMNS} data={clientes}
                    title='Clientes' subtitle='Listado de clientes'
                    mostrar_boton={true}
                    abrir_modal={true}
                    mostrar_acciones={true}
                    onClick={this.openModal}
                    actions={{
                        'edit': { function: this.openModalEdit },
                        'delete': { function: this.openModalDelete }
                    }}
                    elements={data.clientes}
                />

                <Modal  title={typeForm === 'Add' ? 'Registrar nuevo cliente' : 'Editar cliente'} show={modal} handleClose={this.handleCloseModal}>
                    <Form id="form-cliente"
                    onSubmit = { 
                                    (e) => {
                                        e.preventDefault(); 
                                        var elementsInvalid = document.getElementById("form-cliente").getElementsByClassName("is-invalid"); 
                                        if(elementsInvalid.length===0){   
                                            onSubmit(e)
                                        }else{ 
                                            alert("Rellena todos los campos")
                                        } 
                                    }
                                }
                        onSubmit={typeForm === 'Add' ? this.submitForm : this.submitEditForm}>
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
                        <div className="mt-3 text-center">
                            <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                        </div>
                    </Form>
                </Modal>
                <Modal show={modalDelete} handleClose={this.handleDeleteModal} >
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar a <B color="red">{cliente.empresa}</B>?
                    </Subtitle>
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick={this.handleDeleteModal} text="Cancelar" className="mr-3" color="green" />
                        <Button icon='' onClick={(e) => { this.safeDelete(e)(cliente.id) }} text="Continuar" color="red" />
                    </div>
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