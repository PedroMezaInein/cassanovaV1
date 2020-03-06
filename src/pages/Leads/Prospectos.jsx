import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { faPlus, faPhone, faEnvelope, faEye } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../components/form-components'
import { Modal, Card } from '../../components/singles'
import { ProspectoForm } from '../../components/forms'
import axios from 'axios'
import { URL_DEV } from '../../constants'
import swal from 'sweetalert'
import { P } from '../../components/texts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Accordion } from 'react-bootstrap'
import Moment from 'react-moment'

class Leads extends Component{

    state = {
        modal: false,
        title: '',
        lead: ''
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
    }

    handleCloseModal = () => {
        this.setState({
            ... this.state,
            modal: !this.state.modal
        })
    }

    // Axios
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
        const { modal, title, lead } = this.state
        return(
            <Layout active={'leads'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModalAddLead() } } text='' icon={faPlus} color="green" />
                </div>
                <Modal show = { modal } handleClose = { this.handleCloseModal } >
                    <ProspectoForm 
                        className = " px-3 "
                        title = { title }>
                        {
                            lead &&
                            <Accordion>
                                <div className="d-flex justify-content-end">
                                    <Accordion.Toggle as = { Button } icon={ faEye } color="transparent" eventKey={0} />
                                </div>
                                <Accordion.Collapse eventKey = { 0 } className="px-5" >
                                    <Card className="mx-5 my-3">
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