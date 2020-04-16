import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Modal, Card } from '../../components/singles'
import { Button } from '../../components/form-components'
import { faPlus, faTrash, faEdit, faMoneyBill, faFileAlt, faFileArchive, faEye, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { ProyectosForm } from '../../components/forms'
import axios from 'axios'
import { URL_DEV, GOLD, PROVEEDORES_COLUMNS, EGRESOS_COLUMNS } from '../../constants'
import { DataTable } from '../../components/tables'
import { Small, B, Subtitle, P } from '../../components/texts'
import { FileInput } from '../../components/form-components'
import Moment from 'react-moment'
import NumberFormat from 'react-number-format';
import swal from 'sweetalert'
import { Form, Accordion } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class Proyectos extends Component{

    state = {
        title: 'Nuevo proyecto',
        prospecto: '',
        modal: false
    }

    constructor(props){
        super(props);
        const { state } = props.location
        if(state){
            this.state.modal = true
            this.state.title = 'Prospecto a convertir'
            this.getProspectoAxios(state.prospectos.id)
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const proyectos = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        })
        if(!proyectos)
            history.push('/')
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true,
            title: 'Nuevo proyecto',
            prospecto: ''
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            title: 'Nuevo proyecto',
            prospecto: ''
        })
    }

    async getProspectoAxios(id){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'prospecto/' + id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { prospecto } = response.data
                console.log('Prospecto axios', prospecto)
                this.setState({
                    ... this.state,
                    prospecto
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error'
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

    render(){
        const { modal, title, prospecto } = this.state
        return(
            <Layout active={'proyectos'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" />
                </div>
                <Modal show = {modal} handleClose = {this.handleClose}>
                    <ProyectosForm title={title}>
                        {
                            prospecto !== '' ?
                            <Accordion>
                                <div className="d-flex justify-content-end">
                                    <Accordion.Toggle as = { Button } icon={ faEye } color="transparent" eventKey={0} />
                                </div>
                                <Accordion.Collapse eventKey = { 0 } className="px-md-5 px-2" >
                                    <div>
                                        <Card className="mx-md-5 my-3">
                                            <div className="row mx-0">
                                                <div className="col-md-12 mb-3">
                                                    <P className="text-center" color="gold">
                                                        Lead
                                                    </P>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <Small color="dark-blue">
                                                        <B color="gold" className="pr-1">Nombre:</B><br />
                                                        {
                                                            prospecto.lead.nombre
                                                        }
                                                    </Small>
                                                    <hr />
                                                    <Small color="dark-blue">
                                                        <B color="gold" className="pr-1">Teléfono:</B><br />
                                                        <a target="_blank" href={`tel:+${prospecto.lead.telefono}`}>
                                                            <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                                            {
                                                                prospecto.lead.telefono
                                                            }
                                                        </a>
                                                    </Small>
                                                    <hr />
                                                    <Small color="dark-blue">
                                                        <B color="gold" className="pr-1">Correo:</B><br />
                                                        <a target="_blank" href={`mailto:+${prospecto.lead.email}`}>
                                                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                                            {
                                                                prospecto.lead.email
                                                            }
                                                        </a>
                                                    </Small>
                                                    <hr />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <Small color="dark-blue">
                                                        <B color="gold" className="pr-1">Empresa:</B><br />
                                                        {
                                                            prospecto.lead.empresa.name
                                                        }
                                                    </Small>
                                                    <hr />
                                                    <Small color="dark-blue">
                                                        <B color="gold" className="mr-1">Origen:</B><br />
                                                        {
                                                            prospecto.lead.origen.origen
                                                        }
                                                    </Small>
                                                    <hr />
                                                    <Small color="dark-blue">
                                                        <Small>
                                                            <B color="gold" className="mr-1">Fecha:</B><br />
                                                        </Small>
                                                        <Moment format="DD/MM/YYYY">
                                                            {
                                                                prospecto.lead.created_at
                                                            }
                                                        </Moment>
                                                    </Small>
                                                    <hr />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <Small color="dark-blue">
                                                        <B className="mr-1" color="gold">Comentario:</B><br />
                                                        {
                                                            prospecto.lead.comentario
                                                        }
                                                    </Small>
                                                    <hr />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <div className="text-color__dark-blue">
                                                        <Small>
                                                            <B color="gold" className="mr-1">Servicios:</B><br />
                                                        </Small>
                                                        <div className="px-2">
                                                            <ul>
                                                                {
                                                                    prospecto.lead.servicios ? prospecto.lead.servicios.map((servicio, key) => {
                                                                        return(
                                                                            <li key={key}>
                                                                                <Small color="dark-blue">
                                                                                    {servicio.servicio}
                                                                                </Small>
                                                                            </li>
                                                                        )
                                                                    }) :
                                                                    <li>
                                                                        <Small color="dark-blue">
                                                                            No hay servicios registrados
                                                                        </Small>
                                                                    </li>
                                                                }
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                </div>
                                            </div>
                                        </Card>
                                        <Card className="mx-md-5 my-3">
                                            <div className="row mx-0">
                                                <div className="col-md-12 mb-3">
                                                    <P className="text-center" color="gold">
                                                        Prospecto
                                                    </P>
                                                </div>
                                                <div className="col-md-6">
                                                    <Small>
                                                        <B color="gold">
                                                            Cliente:
                                                        </B>
                                                    </Small>
                                                    <br />
                                                    <Small color="dark-blue">
                                                        {
                                                            prospecto.cliente.empresa
                                                        }
                                                    </Small>
                                                    <hr />
                                                </div>
                                                <div className="col-md-6">
                                                    <Small>
                                                        <B color="gold">
                                                            Vendedor:
                                                        </B>
                                                    </Small>
                                                    <br />
                                                    <Small color="dark-blue">
                                                        {
                                                            prospecto.vendedor.name
                                                        }
                                                    </Small>
                                                    <hr />
                                                </div>
                                                <div className="col-md-6">
                                                    <Small>
                                                        <B color="gold">
                                                            Tipo:
                                                        </B>
                                                    </Small>
                                                    <br />
                                                    <Small color="dark-blue">
                                                        {
                                                            prospecto.tipo_proyecto.tipo
                                                        }
                                                    </Small>
                                                    <hr />
                                                </div>
                                                <div className="col-md-6">
                                                    <Small>
                                                        <B color="gold">
                                                            Estatus contratación:
                                                        </B>
                                                    </Small>
                                                    <br />
                                                    <Small color="dark-blue">
                                                        {
                                                            prospecto.estatus_contratacion.estatus
                                                        }
                                                    </Small>
                                                    <hr />
                                                </div>
                                                <div className="col-md-12">
                                                    <Small>
                                                        <B color="gold">
                                                            Descripción:
                                                        </B>
                                                    </Small>
                                                    <br />
                                                    <Small color="dark-blue">
                                                        {
                                                            prospecto.descripcion
                                                        }
                                                    </Small>
                                                    <hr />
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </Accordion.Collapse>
                            </Accordion>
                            : ''
                        }
                    </ProyectosForm>
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

export default connect(mapStateToProps, mapDispatchToProps)(Proyectos);