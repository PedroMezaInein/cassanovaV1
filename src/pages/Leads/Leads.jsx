import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { DataTable } from '../../components/tables'
import { faPlus, faEdit, faTrash, faPhone, faEnvelope, faSync} from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../components/form-components'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, LEADS_COLUMNS } from '../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Moment from 'react-moment'
import { Modal } from '../../components/singles'
import { LeadForm } from '../../components/forms'
import { Subtitle, B } from '../../components/texts'

class Leads extends Component{

    state = {
        leads: '',
        empresas: '',
        origenes: '',
        servicios: '',
        modalAdd: false,
        modalDelete: false,
        modalConvert: false,
        title: '',
        tipoForm: '',
        form: {
            nombre: '',
            telefono: '',
            email: '',
            comentario: '',
            fecha: new Date(),
            empresa: '',
            origen: '',
            servicios: []
        },
        leadId : ''
    }
    constructor(props){
        super(props)
    }

    // Setters
    setLeads = leads => {
        let _leads = []
        leads.map((lead, key) => {
            _leads[key] = {
                actions: this.setActions(lead),
                nombre: lead.nombre,
                contacto: this.setContacto(lead),
                comentario: lead.comentario,
                servicios: this.setServiciosData(lead.servicios),
                empresa: lead.empresa.name,
                origen: lead.origen.origen,
                fecha: this.setDate(lead.created_at)
            }
        })
        this.setState({
            ... this.state,
            leads: _leads
        })
    }

    setDate = date => {
        return(
            <Moment format="DD/MM/YYYY">
                {date}
            </Moment>
        )
    }

    setActions = (lead) => {
        return(
            <div className="d-flex align-items-center flex-column flex-md-row">
                <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalEditLead(e)(lead)} text='' icon={faEdit} color="yellow" />
                <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalSafeDelete(e)(lead)} text='' icon={faTrash} color="red" />
                <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalSafeConvert(e)(lead)} text='' icon={faSync} color="transparent" />
            </div>
        )
    }

    setContacto = (lead) => {
        return(
            <div>
                {
                    lead.telefono &&
                    <div className="my-2">
                        <a target="_blank" href={`tel:+${lead.telefono}`}>
                            <FontAwesomeIcon className="mx-3" icon={faPhone} />
                            {lead.telefono}
                        </a>
                    </div>
                }
                {
                    lead.email &&
                    <div className="my-2">
                        <a target="_blank" href={`mailto:+${lead.email}`}>
                            <FontAwesomeIcon className="mx-3"  icon={faEnvelope} />
                            {lead.email}
                        </a>
                    </div>
                }
            </div>
        )
    }

    setServiciosData = (servicios) => {
        if(servicios.length)
            return(
                <ul>
                    {
                        servicios.map((servicio, key) => {
                            return(
                                <li key={key}>
                                    {servicio.servicio}
                                </li>
                            )
                        })
                    }
                </ul>
            )
        else{
            return(
                <ul>
                    <li>
                        Sin información
                    </li>
                </ul>
            )
        }
    }

    setEmpresas = empresas => {
        let _empresas = []
        empresas.map((empresa, key) => {
            _empresas.push( { value: empresa.id, text: empresa.name })
        })
        this.setState({
            ... this.state,
            empresas: _empresas
        })
    }

    setOrigenes = origenes =>  {
        let _origenes = []
        origenes.map((origen, key) => {
            _origenes.push( { value: origen.id, text: origen.origen })
        })
        this.setState({
            ... this.state,
            origenes: _origenes
        })
    }

    setServicios = servicios => {
        let _servicios = []
        const { form } = this.state

        servicios.map((servicio, key) => {
            _servicios.push( { checked: false, text: servicio.servicio, id: servicio.id })
        })
        form['servicios'] = _servicios
        this.setState({
            ... this.state,
            form,
            servicios: _servicios,
        })
    }

    
    // Modals

    openModalAddLead = () => {
        this.setState({
            ... this.state,
            modalAdd: !this.state.modalAdd,
            title: 'Registrar nuevo lead',
            tipoForm: 'Add'
        })
    }

    openModalEditLead = (e) => (lead) => {
        let { form, leadId } = this.state
        
        form['nombre'] = lead.nombre
        form['email'] = lead.email
        form['telefono'] = lead.telefono
        
        form['comentario'] = lead.comentario
        
        form['empresa'] = lead.empresa_id
        form['origen'] = lead.tipo_id

        let _servicios = []
        let servicios = form['servicios']

        servicios.map((_form, key) => {
            const aux = lead.servicios.find( function(element, index){
                if(element.id === _form.id)
                    return true
                else{
                    return false
                }
            })
            if(aux){
                _servicios.push( { checked: true, text: _form.text, id: _form.id })
            }else{
                _servicios.push( { checked: false, text: _form.text, id: _form.id })
            }
        })

        form['servicios'] = _servicios;

        form['fecha'] = new Date(lead.created_at);

        leadId = lead

        this.setState({
            ... this.state,
            modalAdd: true,
            form,
            title: 'Editar lead',
            tipoForm: 'Edit',
            leadId
        })
    }

    openModalSafeDelete = (e) => (lead) => {
        let { leadId } = this.state

        leadId = lead

        this.setState({
            ... this.state,
            modalDelete: true,
            leadId
        })

    }

    openModalSafeConvert = (e) => (lead) => {
        let { leadId } = this.state
        leadId = lead
        this.setState({
            ... this.state,
            modalConvert: true,
            leadId
        })
    }

    handleCloseModal = () => {
        this.setState({
            ... this.state,
            modalAdd: !this.state.modalAdd,
            form: {
                nombre: '',
                telefono: '',
                email: '',
                comentario: '',
                fecha: new Date(),
                empresa: '',
                origen: '',
                servicios: this.state.servicios
            },
            title: '',
            tipoForm: '',
            leadId : ''
        })
    }

    handleCloseDeleteModal = () => {
        this.setState({
            ... this.state,
            modalDelete: !this.state.modalDelete,
            leadId : ''
        })
    }

    handleCloseConvertModal = () => {
        this.setState({
            ... this.state,
            modalConvert: !this.state.modalConvert,
            leadId : ''
        })
    }
    
    // Forms

    handleSubmitAddLead = (e) => {
        e.preventDefault();
        this.addLeadAxios()
    }

    handleSubmitEditLead = (e) => {
        e.preventDefault();
        this.editLeadAxios()
    }

    safeDeleteLead = (e) => (lead) => {
        this.deleteLeadAxios(lead);
        this.setState({
            ... this.state,
            modalDelete: false,
            leadId: ''
        })
    }

    safeConvertLead = (e) => (lead) => {
        const { history } = this.props
        history.push({
            pathname: '/leads/prospectos',
            state: { lead: lead}
        });
    }

    handleChangeInput = (e) => {
        e.preventDefault();
        const { name, value } = e.target
        const { form }  = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    handleChangeDate = (date) =>{
        const { form }  = this.state
        form['fecha'] = date
        this.setState({
            ... this.state,
            form: form
        })
    }

    handleChangeCheckbox = (array) => {
        const { form }  = this.state
        form['servicios'] = array
        this.setState({
            ... this.state,
            form: form
        })
    }

    // Axios

    async getLeads(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'lead', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas, leads, origenes, servicios } = response.data
                this.setLeads(leads)
                this.setOrigenes(origenes)
                this.setServicios(servicios)
                this.setEmpresas(empresas)
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

    async addLeadAxios (){
        const { access_token } = this.props.authUser
        const { form: data } = this.state
        await axios.post(URL_DEV + 'lead', data, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas, leads, origenes, servicios } = response.data
                this.setLeads(leads)
                this.setOrigenes(origenes)
                this.setServicios(servicios)
                this.setEmpresas(empresas)
                this.setState({
                    ... this.state,
                    form: {
                        nombre: '',
                        telefono: '',
                        email: '',
                        comentario: '',
                        fecha: new Date(),
                        empresa: '',
                        origen: '',
                        servicios: this.state.servicios
                    },
                    modalAdd: false
                })
                swal({
                    title: '¡Listo!',
                    text: 'Agregaste con éxito el lead.',
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

    async editLeadAxios (){
        const { access_token } = this.props.authUser
        const { form: data, leadId } = this.state
        await axios.put(URL_DEV + 'lead/' + leadId.id, data, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas, leads, origenes, servicios } = response.data
                this.setLeads(leads)
                this.setOrigenes(origenes)
                this.setServicios(servicios)
                this.setEmpresas(empresas)
                this.setState({
                    ... this.state,
                    form: {
                        nombre: '',
                        telefono: '',
                        email: '',
                        comentario: '',
                        fecha: new Date(),
                        empresa: '',
                        origen: '',
                        servicios: this.state.servicios
                    },
                    modalAdd: false
                })
                swal({
                    title: '¡Listo!',
                    text: 'Editaste con éxito el lead.',
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

    async deleteLeadAxios (lead){
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'lead/' + lead, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas, leads, origenes, servicios } = response.data
                this.setLeads(leads)
                this.setOrigenes(origenes)
                this.setServicios(servicios)
                this.setEmpresas(empresas)
                swal({
                    title: '¡Listo!',
                    text: 'Eliminaste con éxito el lead.',
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
        this.getLeads()
    }

    render(){
        const { leads, modalAdd, form, origenes, empresas, servicios, title, tipoForm, modalDelete, leadId, modalConvert } = this.state
        return(
            <Layout active={'leads'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModalAddLead() } } text='' icon={faPlus} color="green" />
                </div>
                { leads && <DataTable columns={LEADS_COLUMNS} data={leads}/>}
                <Modal show = { modalAdd } handleClose = { this.handleCloseModal } >
                    <LeadForm 
                        className = " px-3 "
                        form = { form } 
                        origenes = { origenes }
                        empresas = { empresas }
                        servicios = { servicios }
                        onSubmit ={ tipoForm === 'Add' ? this.handleSubmitAddLead : this.handleSubmitEditLead }
                        onChange = { (e) => { e.preventDefault(); this.handleChangeInput(e) } } 
                        title = { title }
                        onChangeCalendar = { this.handleChangeDate }
                        onChangeCheckboxes = { this.handleChangeCheckbox }
                        >
                    </LeadForm>
                </Modal>
                <Modal show={modalDelete} handleClose={this.handleCloseDeleteModal}>
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar el lead <B color="red">{leadId.nombre}</B>?
                    </Subtitle>
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick={this.handleCloseDeleteModal} text="Cancelar" className="mr-3" color="green"/>
                        <Button icon='' onClick={(e) => { this.safeDeleteLead(e)(leadId.id) }} text="Continuar" color="red"/>
                    </div>
                </Modal>
                <Modal show={modalConvert} handleClose={this.handleCloseConvertModal}>
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas convertir el lead <B color="red">{leadId.nombre}</B>?
                    </Subtitle>
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick={this.handleCloseConvertModal} text="Cancelar" className="mr-3" color="red"/>
                        <Button icon='' onClick={(e) => { this.safeConvertLead(e)(leadId.id) }} text="Continuar" />
                    </div>
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