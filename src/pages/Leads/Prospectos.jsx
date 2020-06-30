import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { faPlus, faPhone, faEnvelope, faEye, faEdit, faTrash, faCalendarAlt, faPhoneVolume, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../components/form-components'
import { Modal, Card } from '../../components/singles'
import { ProspectoForm, ContactoLeadForm } from '../../components/forms'
import axios from 'axios'
import { URL_DEV, PROSPECTOS_COLUMNS, CONTACTO_COLUMNS, EMPTY_PROSPECTO, EMPTY_CONTACTO, EMPTY_CLIENTE } from '../../constants'
import swal from 'sweetalert'
import { P, Small, Subtitle, B } from '../../components/texts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Accordion, Form } from 'react-bootstrap'
import Moment from 'react-moment'
import { DataTable } from '../../components/tables'
import { setOptions, setSelectOptions, setTextTable, setDateTable, setListTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList, setContactoTable } from '../../functions/setters'
import NewTable from '../../components/tables/NewTable'
import TableForModals from '../../components/tables/TableForModals'

class Leads extends Component {

    state = {
        modal: false,
        modalHistoryContact: false,
        modalContactForm: false,
        modalDelete: false,
        modalConvert: false,
        title: '',
        lead: '',
        prospecto: '',
        prospectos: '',
        clientes: '',
        tiposContactos: '',
        vendedores: '',
        estatusContratacion: '',
        estatusProspectos: '',
        tipoProyectos: '',
        form: EMPTY_PROSPECTO,
        formCliente: EMPTY_CLIENTE,
        formContacto: EMPTY_CONTACTO,
        contactHistory: [],
        data: {
            prospecto: []
        },
        formeditado:0

    }

    constructor(props) {
        super(props);
        const { state } = props.location
        if (state) {
            this.state.modal = true
            this.state.title = 'Lead a convertir'
            this.getLeadAxios(state.lead)
        }
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
        this.getProspectos();
    }

    handleCloseModal = () => {
        this.clearForm('form', EMPTY_PROSPECTO)
        this.clearForm('formCliente', EMPTY_CLIENTE)
        this.clearForm('formContacto', EMPTY_CONTACTO)
        this.setState({
            ... this.state,
            modal: !this.state.modal,

        })
    }

    handleCloseConvertModal = () => {
        const { modalConvert } = this.state
        this.setState({
            ... this.state,
            prospecto: '',
            modalConvert: !modalConvert
        })
    }

    activeModalHistory =  prospecto => {
        let aux = []
        prospecto.contactos.map((contacto) => {
            aux.push(
                {
                    usuario: renderToString(this.setText(contacto.user.name)),
                    fecha: renderToString(this.setDateTable(contacto.created_at)),
                    medio: renderToString(this.setText(contacto.tipo_contacto.tipo)),
                    estado: contacto.success ? renderToString(this.setText('Contactado')) : renderToString(this.setText('Sin respuesta')),
                    comentario: renderToString(this.setText(contacto.comentario)),
                }
            )
        })
        this.setState({
            ... this.state,
            modalHistoryContact: true,
            contactHistory: aux
        })
    }

    /*activeModalHistory = contactos => {
        let aux = []
        contactos.map((contacto) => {
            aux.push(
                {
                    usuario: renderToString(this.setText(contacto.user.name)),
                    fecha: renderToString(this.setDateTable(contacto.created_at)),
                    medio: renderToString(this.setText(contacto.tipo_contacto.tipo)),
                    estado: contacto.success ? renderToString(this.setText('Contactado')) : renderToString(this.setText('Sin respuesta')),
                    comentario: renderToString(this.setText(contacto.comentario)),
                    //id: contacto.id
                }
            )
        })
        this.setState({
            ... this.state,
            modalHistoryContact: true,
            contactHistory: aux
        })
    }*/

    activeFormContact = prospecto => {
        this.clearForm('formContacto', EMPTY_CONTACTO)
        this.setState({
            prospecto,
            modalContactForm: true,
            formeditado:0
        })
    }

    handleCloseFormContact = () => {
        this.clearForm('formContacto', EMPTY_CONTACTO)
        this.setState({
            prospecto: '',
            modalContactForm: false,
        })
    }

    handleCloseHistoryModal = () => {
        this.setState({
            ... this.state,
            modalHistoryContact: false,
            contactHistory: []
        })
    }

    handleDeleteModal = () => {
        this.setState({
            ... this.state,
            modalDelete: false,
            prospecto: ''
        })
    }

    openSafeDelete = (prospecto) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            prospecto
        })
    }

    openEdit = (prospecto) => {
        const { form } = this.state
        form['descripcion'] = prospecto.descripcion
        form['preferencia'] = prospecto.preferencia
        form['motivo'] = prospecto.motivo
        if (prospecto.vendedor) {
            form['vendedor'] = prospecto.vendedor.email
        }
        if (prospecto.estatus_prospecto) {
            form['estatusProspecto'] = prospecto.estatus_prospecto.estatus
        }
        if (prospecto.cliente) {
            form['cliente'] = prospecto.cliente.empresa
        }
        if (prospecto.tipo_proyecto) {
            form['tipoProyecto'] = prospecto.tipo_proyecto.tipo
        }
        if (prospecto.estatus_contratacion) {
            form['estatusContratacion'] = prospecto.estatus_contratacion.estatus
        }

        this.setState({
            ... this.state,
            modal: true,
            prospecto,
            title: 'Editar prospecto',
            form,
            formeditado:1
        })
    }

    openConvert = (prospecto) => {
        this.setState({
            modalConvert: true,
            prospecto: prospecto,
            formeditado:1
        })
    }

    safeDelete = (e) => prospecto => {
        this.deleteProspectoAxios(prospecto)
    }

    safeConvert = e => prospecto => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/proyectos',
            state: { prospectos: prospecto }
        });
    }

    // Setters

    setTipos = (list, name) => {
        let aux = [{ value: 'New', name: '+ Agregar nuevo' }]
        list && list.map((element, key) => {
            aux.push({ value: element.tipo, name: element.tipo })
        })
        this.setState({
            ... this.state,
            [name]: aux
        })

    }
    setEstatus = (list, name) => {
        let aux = [{ value: 'New', name: '+ Agregar nuevo' }]
        list && list.map((element, key) => {
            aux.push({ value: element.estatus, name: element.estatus })
        })
        this.setState({
            ... this.state,
            [name]: aux
        })

    }
    setVendedores = vendedores => {
        let aux = []
        vendedores && vendedores.map((element, key) => {
            aux.push({ value: element.email, name: element.name })
        })
        this.setState({
            ... this.state,
            vendedores: aux
        })
    }
    setClientes = clientes => {
        let aux = [{ value: 'New', name: '+ Agregar nuevo' }]
        clientes && clientes.map((element, key) => {
            aux.push({ value: element.id.toString(), name: element.empresa })
        })
        this.setState({
            ... this.state,
            clientes: aux
        })
    }
    setProspectos = prospectos => {
        let _prospectos = []
        prospectos.map((prospecto, key) => {
            _prospectos.push({
                actions: this.setActions(prospecto),
                lead: prospecto.lead ?
                renderToString(setContactoTable(prospecto.lead))
                    : '',
                empresa: prospecto.lead ? prospecto.lead.empresa ?  renderToString(setTextTable(prospecto.lead.empresa.name)) : '' : '',
                cliente: prospecto.cliente ?
                renderToString(setArrayTable([
                        { name: 'Nombre', text: prospecto.cliente.nombre },
                        { name: 'RFC', text: prospecto.cliente.rfc },
                        { name: 'Empresa', text: prospecto.cliente.empresa },
                    ]))
                    : ''
                ,
                tipoProyecto: prospecto.tipo_proyecto ?  renderToString(setTextTable(prospecto.tipo_proyecto.tipo)) : '',
                descripcion:  renderToString(setTextTable(prospecto.descripcion)),
                vendedor: prospecto.vendedor ?  renderToString(setTextTable(prospecto.vendedor.name)) : '',
                preferencia:  renderToString(setTextTable(prospecto.preferencia)),
                estatusProspecto: prospecto.estatus_prospecto ?  renderToString(setTextTable(prospecto.estatus_prospecto.estatus)) : '',
                motivo:  renderToString(setTextTable(prospecto.motivo)),
                estatusContratacion: prospecto.estatus_contratacion ?  renderToString(setTextTable(prospecto.estatus_contratacion.estatus)) : '',
                fechaConversion:  renderToString(setDateTable(prospecto.created_at)),
                id: prospecto.id
            })
        })
        this.setState({
            ... this.state,
            prospectos: _prospectos
        })
    }

    setActions = prospecto => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: {id:'edit', text:'Editar'}
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin', 
                action: 'delete',
                tooltip: {id:'delete', text:'Eliminar', type:'error'}
            },
            {
                text: 'Contacto',
                btnclass: 'primary',
                iconclass: 'flaticon-support', 
                action: 'contacto',
                tooltip: {id:'contacto', text:'Contacto'}
            },                
            {
                text: 'Convertir&nbsp;en&nbsp;proyecto',
                btnclass: 'dark',
                iconclass: 'flaticon-folder-1', 
                action: 'convert',
                tooltip: {id:'convert', text:'Convertir en proyecto'}
            }
        )
        if (prospecto.contactos.length > 0) {
            aux.push(
            {
                text: 'Historial&nbsp;de&nbsp;contacto',
                btnclass: 'info',
                iconclass: 'flaticon-list-1', 
                action: 'historial',
                tooltip: {id:'historial', text:'Historial de contacto'}
            }
        )        
    }
    return aux
    }
    /*
    setActions = prospecto => {
        return (
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openEdit(e)(prospecto)} text='' icon={faEdit} color="transparent"
                        tooltip={{ id: 'edit', text: 'Editar' }} />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openSafeDelete(e)(prospecto)} text='' icon={faTrash} color="red"
                        tooltip={{ id: 'delete', text: 'Eliminar', type: 'error' }} />
                </div>
                <div className="d-flex align-items-center flex-column flex-md-row my-2">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.activeFormContact(e)(prospecto.id)} text='' icon={faPhoneVolume} color="transparent"
                        tooltip={{ id: 'contacto', text: 'Contacto', type: 'success' }} />
                    {
                        prospecto.contactos.length > 0 &&
                        <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.activeModalHistory(e)(prospecto.contactos)} text='' icon={faCalendarAlt} color="transparent"
                            tooltip={{ id: 'historial', text: 'Historial de contacto' }} />
                    }
                </div>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openConvert(e)(prospecto)} text='' icon={faSyncAlt} color="transparent"
                        tooltip={{ id: 'convert', text: 'Convertir en proyecto', type: 'success' }} />
                </div>
            </>
        )
    }
    */
    setLeadTable = lead => {
        return (
            <div>
                <Small>
                    {lead.nombre}
                </Small>
                {
                    lead.telefono &&
                    <div className="my-2">
                        <a target="_blank" href={`tel:+${lead.telefono}`}>
                            <Small>
                                <FontAwesomeIcon className="mx-3" icon={faPhone} />
                                {lead.telefono}
                            </Small>
                        </a>
                    </div>
                }
                {
                    lead.email &&
                    <div className="my-2">
                        <a target="_blank" href={`mailto:+${lead.email}`}>
                            <Small>
                                <FontAwesomeIcon className="mx-3" icon={faEnvelope} />
                                {lead.email}
                            </Small>
                        </a>
                    </div>
                }
            </div>
        )
    }
    setText = text => {
        return (
            <Small className="">
                {text}
            </Small>
        )
    }
    setClienteTable = cliente => {
        return (
            <>
                {
                    cliente &&
                    <div>
                        <Small className="mr-1">
                            {cliente.empresa}
                        </Small>
                        <Small className="mr-1">
                            {cliente.nombre}
                        </Small>
                        <Small className="mr-1">
                            {cliente.puesto}
                        </Small>
                    </div>
                }
            </>
        )
    }
    setDateTable = date => {
        return (
            <Moment format="DD/MM/YYYY">
                {date}
            </Moment>
        )
    }
    // Form

    clearForm = (name, empty) => {
        let aux = Object.keys(empty)
        let _form = this.state[name]
        aux.map((element) => {
            if (element === 'Success')
                _form[element] = 'Contactado'
            else
                _form[element] = ''
        })
        this.setState({
            [name]: _form
        })
    }

    onChange = event => {
        const { name, value } = event.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.setState({
                form
            })
        })
    }
    onChangeCliente = event => {
        const { name, value } = event.target
        const { formCliente } = this.state
        formCliente[name] = value
        this.setState({
            ... this.setState({
                formCliente
            })
        })
    }
    onChangeContacto = event => {
        const { formContacto } = this.state
        const { name, value } = event.target
        formContacto[name] = value
        this.setState({
            ... this.state,
            formContacto
        })
    }

    submitForm = (e) => {
        e.preventDefault();
        const { form, formCliente, formContacto, lead } = this.state
        form['formCliente'] = formCliente;
        form['lead'] = lead;
        form['formContacto'] = formContacto;
        this.addProspectoAxios(form);
    }

    submitEditForm = (e) => {
        e.preventDefault();
        const { form, formCliente, lead, prospecto } = this.state
        form['lead'] = lead;
        form['formCliente'] = formCliente;
        this.editProspectoAxios(form, prospecto.id);
    }

    submitContactForm = e => {
        e.preventDefault();
        const { formContacto, prospecto } = this.state
        this.addContactoAxios(formContacto, prospecto)
    }
    // Axios

    async getProspectos() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'prospecto', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { prospectos, tipoProyectos, estatusContratacion, estatusProspectos, vendedores, tiposContactos, clientes } = response.data
                const { data } = this.state
                data.prospectos = prospectos
                this.setTipos(tipoProyectos, 'tipoProyectos')
                this.setEstatus(estatusContratacion, 'estatusContratacion')
                this.setEstatus(estatusProspectos, 'estatusProspectos')
                this.setVendedores(vendedores)
                /* this.setClientes(clientes) */
                this.setTipos(tiposContactos, 'tiposContactos')
                this.setProspectos(prospectos)
                this.setState({
                    ... this.state,
                    clientes: setOptions(clientes, 'nombre', 'id'),
                    data
                    //prospectos: this.setProspectos(prospectos)
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

    async addProspectoAxios(data) {
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'prospecto', data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { prospectos, tipoProyectos, estatusContratacion, estatusProspectos, vendedores, tiposContactos, clientes } = response.data
                this.setTipos(tipoProyectos, 'tipoProyectos')
                this.setEstatus(estatusContratacion, 'estatusContratacion')
                this.setEstatus(estatusProspectos, 'estatusProspectos')
                this.setVendedores(vendedores)
                /* this.setClientes(clientes) */
                this.setTipos(tiposContactos, 'tiposContactos')
                this.setProspectos(prospectos)
                this.clearForm('form', EMPTY_PROSPECTO)
                this.clearForm('formCliente', EMPTY_CLIENTE)
                this.clearForm('formContacto', EMPTY_CONTACTO)
                this.setState({
                    ... this.state,
                    clientes: setOptions(clientes, 'nombre', 'id'),
                    modal: false,
                    title: '',
                })
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Convertiste con éxisto el lead.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
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

    async deleteProspectoAxios(id) {
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'prospecto/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { prospectos } = response.data
                this.setProspectos(prospectos)
                this.setState({
                    ... this.state,
                    modalDelete: false,
                    title: '',
                    prospecto: ''
                })
                swal({
                    title: '¡Listo 👋!',
                    text: response.data.message !== undefined ? response.data.message : 'Eliminaste el lead con éxito.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
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

    async editProspectoAxios(data, id) {
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'prospecto/' + id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { prospectos, tipoProyectos, estatusContratacion, estatusProspectos, vendedores, tiposContactos, clientes } = response.data
                this.setTipos(tipoProyectos, 'tipoProyectos')
                this.setEstatus(estatusContratacion, 'estatusContratacion')
                this.setEstatus(estatusProspectos, 'estatusProspectos')
                this.setVendedores(vendedores)
                /* this.setClientes(clientes) */
                this.setTipos(tiposContactos, 'tiposContactos')
                this.setProspectos(prospectos)
                this.clearForm('form', EMPTY_PROSPECTO)
                this.clearForm('formCliente', EMPTY_CLIENTE)
                this.clearForm('formContacto', EMPTY_CONTACTO)
                this.setState({
                    ... this.state,
                    modal: false,
                    clientes: setOptions(clientes, 'nombre', 'id'),
                    title: '',
                })
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Editaste el prospecto con éxito.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
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


    async addContactoAxios(form, id) {
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'prospecto/' + id + '/contacto', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { prospectos, tiposContactos } = response.data
                this.setTipos(tiposContactos, 'tiposContactos')
                this.setProspectos(prospectos)
                this.clearForm('formContacto', EMPTY_CONTACTO)
                this.setState({
                    ... this.state,
                    modalContactForm: false,
                    prospecto: '',
                })
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Convertiste con éxisto el lead.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
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

    async getLeadAxios(lead) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'lead/' + lead, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { lead } = response.data
                this.setState({
                    ... this.state,
                    lead
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


    render() {
        const { modal, modalConvert, title, lead, vendedores, estatusProspectos, clientes, tipoProyectos, estatusContratacion, tiposContactos, form, formCliente, formContacto,
            prospectos, modalHistoryContact, contactHistory, modalContactForm, modalDelete, prospecto, data, formeditado} = this.state

        return (
            <Layout active={'leads'}  {...this.props}>
               {/* {
                    prospectos &&
                    <DataTable columns={PROSPECTOS_COLUMNS} data={prospectos} />
                }
                */}
                <NewTable columns = { PROSPECTOS_COLUMNS } data = { prospectos } 
                            title = 'Prospectos' subtitle = 'Listado de prospectos'
                            mostrar_boton={false}
                            abrir_modal={false}  
                            mostrar_acciones={true} 
                            actions = {{
                                'edit': {function: this.openEdit},
                                'delete': {function: this.openSafeDelete},
                                'contacto': {function: this.activeFormContact},
                                'historial': {function: this.activeModalHistory},
                                'convert': {function: this.openConvert}
                            }}
                            elements = { data.prospectos }
                            />

                <Modal title={title} show={modal} handleClose={this.handleCloseModal} >
                    <ProspectoForm
                        formeditado={formeditado}
                        className=" px-3 "                        
                        vendedores={vendedores}
                        estatusProspectos={estatusProspectos}
                        clientes={clientes}
                        tipoProyecto={tipoProyectos}
                        estatusContratacion={estatusContratacion}
                        form={form}
                        formCliente={formCliente}
                        formContacto={formContacto}
                        onChange={this.onChange}
                        onChangeCliente={this.onChangeCliente}
                        onSubmit={title === 'Lead a convertir' ? this.submitForm : this.submitEditForm}
                        tiposContactos={tiposContactos}
                        onChangeContacto={this.onChangeContacto}
                    >
                        {
                            lead &&
                            <Accordion>
                                <div className="d-flex justify-content-end">
                                    <Accordion.Toggle as={Button} icon={faEye} color="transparent" eventKey={0} />
                                </div>
                                <Accordion.Collapse eventKey={0} className="px-md-5 px-2" >
                                    <Card className="mx-md-5 my-3">
                                        <div className="row mx-0">
                                            <div className="col-md-6 mb-3">
                                                <P color="dark-blue">
                                                    {
                                                        lead.nombre
                                                    }
                                                </P>
                                                <hr />
                                                <P color="dark-blue">
                                                    <a target="_blank" href={`tel:+${lead.telefono}`}>
                                                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                                        {
                                                            lead.telefono
                                                        }
                                                    </a>
                                                </P>
                                                <hr />
                                                <P color="dark-blue">
                                                    <a target="_blank" href={`mailto:+${lead.email}`}>
                                                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                                        {
                                                            lead.email
                                                        }
                                                    </a>
                                                </P>
                                                <hr />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <P color="dark-blue">
                                                    <strong className="text-color__gold mr-1">Empresa:</strong>
                                                    {
                                                        lead.empresa.name
                                                    }
                                                </P>
                                                <hr />
                                                <P color="dark-blue">
                                                    <strong className="text-color__gold mr-1">Origen:</strong>
                                                    {
                                                        lead.origen.origen
                                                    }
                                                </P>
                                                <hr />
                                                <P color="dark-blue">
                                                    <strong className="text-color__gold mr-1">Fecha:</strong>
                                                    <Moment format="DD/MM/YYYY">
                                                        {
                                                            lead.created_at
                                                        }
                                                    </Moment>
                                                </P>
                                                <hr />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <P color="dark-blue">
                                                    <strong className="text-color__gold mr-1">Comentario:</strong><br />
                                                    <div className="px-2" >
                                                        {
                                                            lead.comentario
                                                        }
                                                    </div>

                                                </P>
                                                <hr />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <P color="dark-blue">
                                                    <strong className="text-color__gold mr-1">Servicios:</strong><br />
                                                    <div className="px-2">
                                                        <ul>
                                                            {
                                                                lead.servicios ? lead.servicios.map((servicio, key) => {
                                                                    return (
                                                                        <li key={key}>
                                                                            {servicio.servicio}
                                                                        </li>
                                                                    )
                                                                }) :
                                                                    <li>No hay servicios registrados</li>
                                                            }
                                                        </ul>
                                                    </div>
                                                </P>
                                                <hr />
                                            </div>
                                        </div>
                                    </Card>
                                </Accordion.Collapse>
                            </Accordion>
                        }
                    </ProspectoForm>
                </Modal>
                <Modal show={modalHistoryContact} handleClose={this.handleCloseHistoryModal} title={"Historial de contacto"}>
                    {
                        contactHistory &&
                        <TableForModals
                            mostrar_boton={false}
                            abrir_modal={false}
                            mostrar_acciones={false}
                            columns={CONTACTO_COLUMNS} 
                            data={contactHistory} 
                            elements = { data.contactHistory }
                        />
                    }

                </Modal>
                <Modal title={"Agregar un nuevo contacto"} show={modalContactForm} handleClose={this.handleCloseFormContact}>
                    <Form className="mx-3" onSubmit={this.submitContactForm}>
                        <ContactoLeadForm tiposContactos={tiposContactos} formContacto={formContacto} onChangeContacto={this.onChangeContacto} />
                        <div className="mt-3 text-center">
                            <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                        </div>
                    </Form>
                </Modal> 
                
                <Modal title={"¿Estás seguro que deseas eliminar el prospecto?"} show={modalDelete} handleClose={this.handleDeleteModal}>
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick={this.handleDeleteModal} text="Cancelar" className={"btn btn-light-primary font-weight-bolder mr-3"} />
                        <Button icon='' onClick={(e) => { this.safeDelete(e)(prospecto.id) }} text="Continuar" className={"btn btn-danger font-weight-bold mr-2"} />
                    </div>
                </Modal> 
                <Modal show={modalConvert} handleClose={this.handleCloseConvertModal} title={"¿Estás seguro que deseas convertir el prospecto en un proyecto?"}>
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick={this.handleCloseConvertModal} text="Cancelar" className="mr-3" className={"btn btn-light-primary font-weight-bolder mr-3"} />
                        <Button icon='' onClick={(e) => { this.safeConvert(e)(prospecto) }} text="Continuar" className={"btn btn-success font-weight-bold mr-2"}/>
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