import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { faPlus, faPhone, faEnvelope, faEye, faEdit, faTrash, faCalendarAlt, faPhoneVolume } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../components/form-components'
import { Modal, Card } from '../../components/singles'
import { ProspectoForm, ContactoLeadForm } from '../../components/forms'
import axios from 'axios'
import { URL_DEV, PROSPECTOS_COLUMNS, CONTACTO_COLUMNS, EMPTY_PROSPECTO, EMPTY_CONTACTO, EMPTY_CLIENTE } from '../../constants'
import swal from 'sweetalert'
import { P, Small, Subtitle } from '../../components/texts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Accordion, Form } from 'react-bootstrap'
import Moment from 'react-moment'
import { DataTable } from '../../components/tables'

class Leads extends Component{

    state = {
        modal: false,
        modalHistoryContact: false,
        modalContactForm: false,
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
        formContacto:EMPTY_CONTACTO,
        contactHistory: []
    }

    constructor(props){
        super(props);
        const { state } = props.location
        console.log(state);
        if(state){
            this.state.modal = true
            this.state.title = 'Lead a convertir'
            this.getLeadAxios(state.lead)
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const leads = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        });
        if(!leads)
            history.push('/')
        this.getProspectos();
    }

    handleCloseModal = () => {
        this.setState({
            ... this.state,
            modal: !this.state.modal,
            form: EMPTY_PROSPECTO,
            formCliente: EMPTY_CLIENTE,
            formContacto: EMPTY_CONTACTO
        })
    }

    activeModalHistory = e => contactos => {
        let aux = []
        /* console.log(contactos, 'contactos') */
        contactos.map((contacto) => {
            aux.push(
                {
                    usuario: this.setText(contacto.user.name),
                    fecha: this.setDateTable(contacto.created_at),
                    medio: this.setText(contacto.tipo_contacto.tipo),
                    estado: contacto.success ? this.setText('Contactado') : this.setText('Sin respuesta'),
                    comentario: this.setText(contacto.comentario)
                }
            )
        })
        this.setState({
            ... this.state,
            modalHistoryContact: true,
            contactHistory: aux
        })
    }

    activeFormContact = e => prospecto => {
        this.setState({
            prospecto,
            modalContactForm: true,
            form: EMPTY_PROSPECTO,
            formCliente: EMPTY_CLIENTE,
            formContacto: EMPTY_CONTACTO
        })
    }

    handleCloseFormContact = () => {
        this.setState({
            prospecto: '',
            modalContactForm: false,
            form: EMPTY_PROSPECTO,
            formCliente: EMPTY_CLIENTE,
            formContacto: EMPTY_CONTACTO
        })
    }

    handleCloseHistoryModal = () => {
        this.setState({
            ... this.state,
            modalHistoryContact: false,
            contactHistory: [],
            form: EMPTY_PROSPECTO,
            formCliente: EMPTY_CLIENTE,
            formContacto: EMPTY_CONTACTO
        })
    }

    // Setters

    setTipos = (list, name) => {
        let aux = [{ value: 'New', name: '+ Agregar nuevo'}]
        list && list.map((element, key) => {
            aux.push({ value: element.id, name: element.tipo })
        })
        this.setState({
            ... this.state,
            [name]: aux
        })
        
    }
    setEstatus = (list, name) => {
        let aux = [{ value: 'New', name: '+ Agregar nuevo'}]
        list && list.map((element, key) => {
            aux.push({ value: element.id, name: element.estatus })
        })
        this.setState({
            ... this.state,
            [name]: aux
        })
        
    }
    setVendedores = vendedores => {
        let aux = []
        vendedores && vendedores.map((element, key) => {
            aux.push({ value: element.id, name: element.name })
        })
        this.setState({
            ... this.state,
            vendedores: aux
        })
    }
    setClientes = clientes => {
        let aux = [{ value: 'New', name: '+ Agregar nuevo'}]
        clientes && clientes.map((element, key) => {
            aux.push({ value: element.id, name: element.empresa })
        })
        this.setState({
            ... this.state,
            clientes: aux
        })
    }
    setProspectos = prospectos => {
        let _prospectos = []
        console.log(prospectos, 'prospectos')
        prospectos.map((prospecto, key) => {
            _prospectos.push( {
                actions: this.setActions(prospecto),
                lead: this.setLeadTable(prospecto.lead),
                empresa: this.setText(prospecto.lead.empresa.name),
                cliente: this.setClienteTable(prospecto.cliente),
                tipoProyecto: this.setText(prospecto.tipo_proyecto.tipo),
                descripcion: this.setText(prospecto.descripcion),
                vendedor: this.setText(prospecto.vendedor.name),
                preferencia: this.setText(prospecto.preferencia),
                estatusProspecto: this.setText(prospecto.estatus_prospecto.estatus),
                motivo: this.setText(prospecto.motivo),
                estatusContratacion: this.setText(prospecto.estatus_contratacion.estatus),
                fechaConversion: this.setDateTable(prospecto.created_at)
            } )
        })
        this.setState({
            ... this.state,
            prospectos: _prospectos
        })
    }

    setActions = prospecto => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => console.log(e)} text='' icon={faEdit} color="transparent" />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => console.log(e)} text='' icon={faTrash} color="red" />
                </div>
                <div className="d-flex align-items-center flex-column flex-md-row my-2">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.activeFormContact(e)(prospecto.id)} text='' icon={faPhoneVolume} color="transparent" />
                    {
                        prospecto.contactos.length > 0 && 
                            <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.activeModalHistory(e)(prospecto.contactos)} text='' icon={faCalendarAlt} color="transparent" />
                    }
                </div>
            </>
        )
    }
    setLeadTable = lead => {
        return(
            <div>
                <Small>
                    { lead.nombre }
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
                                <FontAwesomeIcon className="mx-3"  icon={faEnvelope} />
                                {lead.email}
                            </Small>
                        </a>
                    </div>
                }
            </div>
        )
    }
    setText = text => {
        return(
            <Small className="">
                { text }
            </Small>
        )
    }
    setClienteTable = cliente => {
        return(
            <div>
                <Small>
                    { cliente.empresa }
                </Small>
                <Small>
                    { cliente.nombre }
                </Small>
                <Small>
                    { cliente.puesto }
                </Small>
            </div>
        )
    }
    setDateTable = date => {
        return(
            <Moment format="DD/MM/YYYY">
                {date}
            </Moment>
        )
    }
    // Form
    onChange = event => {
        console.log(event.target.value, 'event')
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
        console.log(event.target.value, 'event')
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
        console.log(event.target.value, 'event copntacto', event.target.name)
        const { name, value } = event.target
        const { formContacto } = this.state
        formContacto[name] = value
        this.setState({
            ... this.setState({
                formContacto
            })
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

    submitContactForm = e => {  
        e.preventDefault();
        const { formContacto, prospecto } = this.state
        this.addContactoAxios(formContacto, prospecto)
    }
    // Axios

    async getProspectos(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'prospecto', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { prospectos, tipoProyectos, estatusContratacion, estatusProspectos, vendedores, tiposContactos, clientes } = response.data
                this.setTipos(tipoProyectos, 'tipoProyectos')
                this.setEstatus(estatusContratacion,'estatusContratacion')
                this.setEstatus(estatusProspectos,'estatusProspectos')
                this.setVendedores(vendedores)
                this.setClientes(clientes)
                this.setTipos(tiposContactos,'tiposContactos')
                this.setProspectos(prospectos)
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
        })
    }

    async addProspectoAxios(data){
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'prospecto', data, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { prospectos, tipoProyectos, estatusContratacion, estatusProspectos, vendedores, tiposContactos, clientes } = response.data
                this.setTipos(tipoProyectos, 'tipoProyectos')
                this.setEstatus(estatusContratacion,'estatusContratacion')
                this.setEstatus(estatusProspectos,'estatusProspectos')
                this.setVendedores(vendedores)
                this.setClientes(clientes)
                this.setTipos(tiposContactos,'tiposContactos')
                this.setProspectos(prospectos)
                this.setState({
                    ... this.state,
                    modal: false,
                    title: '',
                    form: EMPTY_PROSPECTO,
                    formCliente: EMPTY_CLIENTE,
                    formContacto: EMPTY_CONTACTO
                })
                swal({
                    title: '¡Listo!',
                    text: 'Convertiste con éxisto el lead.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
        })
    }

    async addContactoAxios(form, id){
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'prospecto/'+id+'/contacto', form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { prospectos, tiposContactos } = response.data
                this.setTipos(tiposContactos,'tiposContactos')
                this.setProspectos(prospectos)
                this.setState({
                    ... this.state,
                    modalContactForm: false,
                    prospecto: '',
                    form: EMPTY_PROSPECTO,
                    formCliente: EMPTY_CLIENTE,
                    formContacto: EMPTY_CONTACTO
                })
                swal({
                    title: '¡Listo!',
                    text: 'Convertiste con éxisto el lead.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
        })
    }

    async getLeadAxios(lead){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'lead/' + lead, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { lead } = response.data
                this.setState({
                    ... this.state,
                    lead
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
        })
    }


    render(){
        const { modal, title, lead, vendedores, estatusProspectos, clientes, tipoProyectos, estatusContratacion, tiposContactos, form, formCliente, formContacto, 
                prospectos, modalHistoryContact, contactHistory, modalContactForm } = this.state
        
        return(
            <Layout active={'leads'}  { ...this.props}>
                {/* <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModalAddLead() } } text='' icon={faPlus} color="green" />
                </div> */}
                {
                    prospectos &&
                        <DataTable columns = { PROSPECTOS_COLUMNS } data = { prospectos }/>
                }
                <Modal show = { modal } handleClose = { this.handleCloseModal } >
                    <ProspectoForm 
                        className = " px-3 "
                        title = { title }
                        vendedores = { vendedores }
                        estatusProspectos = { estatusProspectos }
                        clientes = { clientes }
                        tipoProyecto = { tipoProyectos }
                        estatusContratacion = { estatusContratacion }
                        form = { form }
                        formCliente = { formCliente }
                        formContacto = { formContacto }
                        onChange = {this.onChange}
                        onChangeCliente = {this.onChangeCliente}
                        onSubmit = { this.submitForm }
                        tiposContactos = { tiposContactos }
                        onChangeContacto = { this.onChangeContacto }
                        >
                        {
                            lead &&
                            <Accordion>
                                <div className="d-flex justify-content-end">
                                    <Accordion.Toggle as = { Button } icon={ faEye } color="transparent" eventKey={0} />
                                </div>
                                <Accordion.Collapse eventKey = { 0 } className="px-md-5 px-2" >
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
                                                                    return(
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
                <Modal show = { modalHistoryContact } handleClose = { this.handleCloseHistoryModal }>
                    <Subtitle className="my-3">
                        Historial de contacto
                    </Subtitle>
                    {
                        contactHistory &&
                            <DataTable columns = { CONTACTO_COLUMNS } data = { contactHistory } />
                    }
                </Modal>
                <Modal show = { modalContactForm } handleClose = { this.handleCloseFormContact }>
                    <Form className="mx-3" onSubmit={this.submitContactForm}>
                        <Subtitle className="mb-3">
                            Agregar un nuevo contacto
                        </Subtitle>
                        <ContactoLeadForm tiposContactos = { tiposContactos } form = { formContacto } onChange = { this.onChangeContacto } />
                        <div className="mt-3 text-center">
                            <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                        </div>
                    </Form>
                </Modal>
            </Layout>
        )
    }
}


const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Leads);