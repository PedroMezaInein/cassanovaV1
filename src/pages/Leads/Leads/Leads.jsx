// Component
import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

// Custom components
import Layout from '../../../components/layout/layout';
import { ModalDelete } from '../../../components/singles';

// Functions
import { waitAlert, errorAlert, forbiddenAccessAlert, doneAlert, createAlert } from '../../../functions/alert'
import { URL_DEV, LEADS_COLUMNS } from '../../../constants';
import NewTableServerRender from '../../../components/tables/NewTableServerRender';
import { setTextTable, setContactoTable, setListTable, setDateTable, setLabelTable } from '../../../functions/setters';
import { renderToString } from 'react-dom/server';

class Leads extends Component {

    state = {
        modalDelete: false,
        modalConvert: false,
        lead: ''
    }

    changePageEdit = lead => {
        const { history } = this.props
        history.push({
            pathname: '/leads/leads/edit',
            state: { lead: lead}
        });
    }

    openModalSafeConvert =  (lead) => {
        const { history } = this.props
        createAlert(
            '¿Deseas convertir el lead?', 
            `¿Deseas convertir el lead ${lead.nombre} en un prospecto?`, 
            () => 
                history.push({
                    pathname: '/leads/prospectos/convert',
                    state: { lead: lead}
                })
        )
    }

    handleClose = () => {
        this.setState({
            ... this.state,
            modalDelete: false,
            lead: ''
        })
    }

    setLead = leads => {
        let aux = []
        leads.map((lead)=>{
            aux.push({
                actions: this.setActions(lead),
                nombre: renderToString(setTextTable(lead.nombre)),
                contacto: renderToString(setContactoTable(lead)),
                comentario: renderToString(setTextTable(lead.comentario)),
                servicios: renderToString(setListTable(lead.servicios, 'servicio')),
                empresa: renderToString(setTextTable(lead.empresa ? lead.empresa.name : '')),
                origen: renderToString(setTextTable(lead.origen ? lead.origen.origen : '')),
                fecha: renderToString(setDateTable(lead.created_at)),
                tipo_lead: renderToString(setTextTable(lead.tipo_lead ? lead.tipo_lead : 'Sin definir')),
                convertido: renderToString(this.setLabel(lead)),
                id: lead.id
            })
        })
        return aux
    }

    setActions = lead => {
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
                text: 'Convertir&nbsp;a&nbsp;prospecto',
                btnclass: 'primary',
                iconclass: 'flaticon2-user-1',
                action: 'prospecto',
                tooltip: {id:'prospecto', text:'Convertir en prospecto'}
            },
            {
                text: 'Convertir&nbsp;en&nbsp;proveedor',
                btnclass: 'info',
                iconclass: 'flaticon-user-ok',
                action: 'proveedor',
                tooltip: {id:'proveedor', text:'Convertir en proveedor'}
            }
        )
        return aux
    }

    setLabel = lead => {
        console.log(lead)
        let text = {}
        if(lead.contactado){
            text.letra = '#388E3C'
            text.fondo = '#E8F5E9'
            text.estatus = 'Convertido'
        }else{
            text.letra = '#F64E60'
            text.fondo = '#FFE2E5'
            text.estatus = 'Sin convertir'
        }
        return setLabelTable(text)
    }

    async deleteLeadAxios (){
        const { access_token } = this.props.authUser
        const { lead } = this.state

        await axios.delete(URL_DEV + 'lead/' + lead.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito el lead.')
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        const { modalDelete } = this.state
        return (
            <Layout active = 'leads'  { ...this.props } >

                <NewTableServerRender
                    columns = { LEADS_COLUMNS }
                    title = 'Leads'
                    subititle = 'Listado de leads'
                    mostrar_boton = { true }
                    abrir_modal = { false }
                    url = '/leads/leads/add'
                    mostrar_acciones = { true }
                    actions = {{
                        'edit': {function: this.changePageEdit},
                        'delete': {function: this.openModalSafeDelete},
                        'prospecto': {function: this.openModalSafeConvert},
                        'proveedor': {function: this.openModalSafeConvertProveedor},
                    }}
                    exportar_boton = { true }
                    onClickExport = { () => console.log('aux') }
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setLead }
                    urlRender = { URL_DEV + 'lead' }
                    cardTable = 'cardTable'
                    cardTableHeader = 'cardTableHeader'
                    cardBody = 'cardBody'/>

                
                <ModalDelete 
                    title = "¿Estás seguro que deseas eliminar el lead?"
                    show = { modalDelete } 
                    handleClose = { this.handleCloseDelete } 
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteLeadAxios() }}>
                </ModalDelete>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Leads)