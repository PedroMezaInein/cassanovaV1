import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { DataTable } from '../../components/tables'
import { faPlus, faEdit, faTrash, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../components/form-components'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, LEADS_COLUMNS } from '../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Moment from 'react-moment'

class Leads extends Component{

    state = {
        leads: '',
        empresas: '',
        origenes: '',
        servicios: ''
    }
    constructor(props){
        super(props)
    }

    // Setters
    setLeads = leads => {
        let _leads = []
        console.log(leads, 'leads')
        leads.map((lead, key) => {
            _leads[key] = {
                actions: this.setActions(lead),
                nombre: lead.nombre,
                contacto: this.setContacto(lead),
                comentario: lead.comentario,
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
        console.log(lead, 'lead')
        return(
            <div className="d-flex align-items-center">
                <Button className="mx-2 small-button" onClick={(e) => console.log(lead)} text='' icon={faEdit} color="yellow" />
                <Button className="mx-2 small-button" onClick={(e) => console.log(lead)} text='' icon={faTrash} color="red" />
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

    setEmpresas = empresas => {
        this.setState({
            ... this.state,
            empresas
        })
    }

    setOrigenes = origenes =>  {
        this.setState({
            ... this.state,
            origenes
        })
    }

    setServicios = servicios => {
        this.setState({
            ... this.state,
            servicios
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
        const { leads } = this.state
        console.log(leads, 'leads before table')
        return(
            <Layout active={'leads'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={(e) => console.log('HOLA')} text='' icon={faPlus} color="green" />
                </div>
                { leads && <DataTable columns={LEADS_COLUMNS} data={leads}/>}
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