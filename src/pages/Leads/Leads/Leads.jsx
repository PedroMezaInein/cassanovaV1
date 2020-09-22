// Component
import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { renderToString } from 'react-dom/server';
import moment from 'moment'

// Custom components
import Layout from '../../../components/layout/layout';
import { ModalDelete } from '../../../components/singles';
import { URL_DEV, LEADS_COLUMNS } from '../../../constants';
import NewTableServerRender from '../../../components/tables/NewTableServerRender';
import { Modal } from '../../../components/singles'
import { RangeCalendar, Button } from '../../../components/form-components';

// Functions
import { waitAlert, errorAlert, forbiddenAccessAlert, doneAlert, createAlert } from '../../../functions/alert'
import { setTextTable, setContactoTable, setListTable, setDateTable, setLabelTable } from '../../../functions/setters';
import { LeadCard } from '../../../components/cards';

const $ = require('jquery');

class Leads extends Component {

    state = {
        modalDelete: false,
        modalConvert: false,
        modalExport: false,
        modalSingle: false,
        lead: '',
        form:{
            fechaInicio: moment().startOf('month').toDate(),
            fechaFin: moment().endOf('month').toDate(),
        }
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

    openModalSafeConvertProveedor = lead => {
        const { history } = this.props
        createAlert(
            '¿Deseas convertir el lead?', 
            `¿Deseas convertir el lead ${lead.nombre} en un proveedor?`, 
            () => 
                history.push({
                    pathname: '/administracion/proveedores/convert',
                    state: { lead: lead}
                })
        )
    }

    openModalSafeDelete =  (lead) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            lead: lead,
        })

    }

    openModalExport = () => {
        this.setState({
            ... this.state,
            modalExport: true
        })
    }

    openModalSee = lead => {
        this.setState({
            ... this.state,
            modalSingle: true,
            lead: lead
        })
    }

    handleClose = () => {
        this.setState({
            ... this.state,
            modalDelete: false,
            lead: ''
        })
    }

    handleCloseDelete = () => {
        this.setState({
            ... this.state,
            modalDelete: false,
            lead : ''
        })
    }

    handleCloseExport = () => {
        const { form } = this.state
        form.fechaInicio = moment().startOf('month').toDate()
        form.fechaFin = moment().endOf('month').toDate()
        this.setState({
            ... this.state,
            form,
            modalExport: false
        })
    }

    handleCloseSingle = () => {
        this.setState({
            ... this.state,
            modalSingle: false,
            lead : ''
        })
    }

    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({
            ... this.state,
            form
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
        console.log(lead, 'lead')
        if(lead.contactado === 0)
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
                },
                {
                    text: 'Ver',
                    btnclass: 'primary',
                    iconclass: 'flaticon2-expand',                  
                    action: 'see',
                    tooltip: {id:'see', text:'Mostrar', type:'success'},
                },
            )
        
            return aux
    }

    setLabel = lead => {
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

    async getLeadAxios() {
        $('#lead_table').DataTable().ajax.reload();
    }

    async deleteLeadAxios (){
        const { access_token } = this.props.authUser
        const { lead } = this.state

        await axios.delete(URL_DEV + 'lead/' + lead.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                this.getLeadAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito el lead.')
                this.setState({
                    ... this.state,
                    modalDelete: false,
                    lead: ''
                })
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

    async exportLeadsAxios(){
        const { form } = this.state

        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'exportar/leads',  form, { responseType:'blob', headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'leads.xlsx');
                document.body.appendChild(link);
                link.click();

                doneAlert(response.data.message !== undefined ? response.data.message : 'Leads exportados con éxito.')

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
        const { modalDelete, modalExport, modalSingle, lead, form } = this.state
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
                        'see': { function: this.openModalSee }
                    }}
                    exportar_boton = { true }
                    onClickExport = { () => this.openModalExport() }
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setLead }
                    urlRender = { URL_DEV + 'lead' }
                    cardTable = 'cardTable'
                    cardTableHeader = 'cardTableHeader'
                    cardBody = 'cardBody'
                    idTable = 'lead_table'/>
                
                <ModalDelete 
                    title = "¿Estás seguro que deseas eliminar el lead?"
                    show = { modalDelete } 
                    handleClose = { this.handleCloseDelete } 
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteLeadAxios() }}>
                </ModalDelete>

                <Modal size = 'lg' show = { modalExport } handleClose = { this.handleCloseExport } title = 'Rango de leads a exportar'>
                    <div className="pt-3 d-flex justify-content-center">
                        <RangeCalendar start = { form.fechaInicio } end = { form.fechaFin } 
                            onChange = { this.onChangeRange } />
                    </div>
                    <div className = "d-flex text-center py-3">
                        <Button icon='' className="mx-auto" text="DESCARGAR" 
                            onClick = {
                                (e) => {
                                    e.preventDefault();
                                    waitAlert();
                                    this.exportLeadsAxios()
                                }
                            }
                            />
                    </div>
                </Modal>
                {
                    lead ?
                        <Modal size="xl" title="lead" show = { modalSingle } handleClose = { this.handleCloseSingle } >
                            <LeadCard 
                                lead = { lead } 
                                border={"mt-4"}
                            />
                        </Modal>
                    :''
                }
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