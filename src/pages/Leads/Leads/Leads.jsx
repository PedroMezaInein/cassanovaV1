import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { renderToString } from 'react-dom/server'
import moment from 'moment'
import Layout from '../../../components/layout/layout'
import { ModalDelete } from '../../../components/singles'
import { URL_DEV, LEADS_COLUMNS } from '../../../constants'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { Modal } from '../../../components/singles'
import { RangeCalendar, Button } from '../../../components/form-components'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert, createAlertSA2, questionAlert2} from '../../../functions/alert'
import { setTextTable, setContactoTable, setListTable, setDateTable, setLabelTable, setTextTableCenter } from '../../../functions/setters'
import { LeadCard } from '../../../components/cards';
import { Form } from 'react-bootstrap';
import $ from "jquery";

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

    openModalSafeConvert = lead => {
        const { history } = this.props
        createAlertSA2(
            'LEAD A PROSPECTO', 
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
        createAlertSA2(
            'LEAD A PROVEEDOR', 
            `¿Deseas convertir el lead ${lead.nombre} en un proveedor?`, 
            () => 
                history.push({
                    pathname: '/leads/proveedores/convert',
                    state: { lead: lead}
                })
        )
    }

    openModalSafeDelete =  (lead) => {
        this.setState({
            ...this.state,
            modalDelete: true,
            lead: lead,
        })

    }

    openModalExport = () => {
        this.setState({
            ...this.state,
            modalExport: true
        })
    }

    openModalSee = lead => {
        this.setState({
            ...this.state,
            modalSingle: true,
            lead: lead
        })
    }

    openModalRechazar = lead => {
        questionAlert2(
            'SELECCIONA EL MOTIVO DE RECHAZO', '',
            () => this.rechazarLeadAxios(lead),
            <div>
                <Form.Check
                    type="radio"
                    label="Recursos Humanos"
                    name="motivo"
                    id="recursos-humanos"
                    className="px-0 mb-2"
                />
                <Form.Check
                    type="radio"
                    label="No potencial"
                    name="motivo"
                    id="no-potencial"
                    className="px-0 mb-2"
                />
                <Form.Check
                    type="radio"
                    label="Proveedor"
                    name="motivo"
                    id="proveedor"
                    className="px-0"
                />
            </div>
        )
        
    }

    rechazarLeadAxios = async (lead) => {
        let rh = ''
        let proveedor = ''
        let no_potencial = ''
        let motivo = ''
        if(document.getElementById('recursos-humanos'))
            rh = document.getElementById('recursos-humanos').checked
        if(document.getElementById('proveedor'))
            proveedor = document.getElementById('proveedor').checked
        if(document.getElementById('no-potencial'))
            no_potencial = document.getElementById('no-potencial').checked
        if(rh)
            motivo = 'rh'
        if(proveedor)
            motivo = 'proveedor'
        if(no_potencial)
            motivo = 'no_potencial'
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'lead/' + lead.id + '/rechazar', {motivo: motivo}, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                this.getLeadAxios()
                doneAlert('Lead rechazado.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    openModalCancelar = async lead => {
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'lead/' + lead.id + '/cancelar', {}, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                this.getLeadAxios()
                doneAlert('Lead cancelado.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    handleClose = () => {
        this.setState({
            ...this.state,
            modalDelete: false,
            lead: ''
        })
    }

    handleCloseDelete = () => {
        this.setState({
            ...this.state,
            modalDelete: false,
            lead : ''
        })
    }

    handleCloseExport = () => {
        const { form } = this.state
        form.fechaInicio = moment().startOf('month').toDate()
        form.fechaFin = moment().endOf('month').toDate()
        this.setState({
            ...this.state,
            form,
            modalExport: false
        })
    }

    handleCloseSingle = () => {
        this.setState({
            ...this.state,
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
            ...this.state,
            form
        })
    }

    setLead = leads => {
        let aux = []
        leads.map((lead)=>{
            aux.push({
                actions: this.setActions(lead),
                nombre: renderToString(setTextTableCenter(lead.nombre +' - '+lead.id)),
                contacto: renderToString(setContactoTable(lead)),
                comentario: renderToString(setTextTable(lead.comentario)),
                servicios: renderToString(setListTable(lead.servicios, 'servicio')),
                empresa: renderToString(setTextTableCenter(lead.empresa ? lead.empresa.name : '')),
                origen: renderToString(setTextTableCenter(lead.origen ? lead.origen.origen : '')),
                fecha: renderToString(setDateTable(lead.created_at)),
                tipo_lead: renderToString(setTextTableCenter(lead.tipo_lead ? lead.tipo_lead : 'Sin definir')),
                convertido: renderToString(this.setLabel(lead)),
                id: lead.id
            })
            return false
        })
        return aux
    }

    setActions = lead => {
        let aux = []
        if(lead.contactado === 0){
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
                    text: 'Mostrar&nbsp;información',
                    btnclass: 'primary',
                    iconclass: 'flaticon2-magnifier-tool',                  
                    action: 'see',
                    tooltip: {id:'see', text:'Mostrar', type:'dark'},
                },
                {
                    text: 'Convertir&nbsp;a&nbsp;prospecto',
                    btnclass: 'info',
                    iconclass: 'flaticon2-user-1',
                    action: 'prospecto',
                    tooltip: {id:'prospecto', text:'Convertir en prospecto'}
                },
                {
                    text: 'Convertir&nbsp;en&nbsp;proveedor',
                    btnclass: 'dark',
                    iconclass: 'flaticon2-lorry',
                    action: 'proveedor',
                    tooltip: {id:'proveedor', text:'Convertir en proveedor'}
                },
                {
                    text: 'Rechazar',
                    btnclass: 'danger',
                    iconclass: 'flaticon2-delete',
                    action: 'rechazar',
                    tooltip: {id:'rechazar', text:'Rechazar'}
                },
                {
                    text: 'Cancelar',
                    btnclass: 'warning',
                    iconclass: 'flaticon-signs-2',
                    action: 'cancelar',
                    tooltip: {id:'cancelar', text:'Cancelar'}
                }
            )
        }else
            aux.push(
                {
                    text: 'Editar',
                    btnclass: 'success',
                    iconclass: 'flaticon2-pen',
                    action: 'edit',
                    tooltip: {id:'edit', text:'Editar'}
                }
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
                    ...this.state,
                    modalDelete: false,
                    lead: ''
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
                        'see': { function: this.openModalSee },
                        'rechazar':  { function: this.openModalRechazar },
                        'cancelar': { function: this.openModalCancelar }
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