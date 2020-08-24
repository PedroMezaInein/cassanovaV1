import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { faPhone, faEnvelope} from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../components/form-components'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, LEADS_COLUMNS } from '../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal } from '../../components/singles'
import { LeadForm } from '../../components/forms'
import { Small } from '../../components/texts'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { setTextTable, setDateTable,setListTable, setContactoTable } from '../../functions/setters'
import NewTable from '../../components/tables/NewTable'
import { waitAlert, doneAlert, errorAlert, forbiddenAccessAlert } from '../../functions/alert'

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
            empresa: 0,
            origen: 0,
            servicios: [],
            tipo_lead: 'potencial',
        },
        data:{
            leads: []
        },
        formeditado:0,
        leadId : '',
        convertir: ''
    }

    setLeads = leads => {
        const { data } = this.state
        data.leads = leads
        let _leads = []
        leads.map((lead, key) => {
            _leads[key] = {
                actions: this.setActions(lead),
                nombre: renderToString(setTextTable(lead.nombre)),
                contacto: renderToString(setContactoTable(lead)),
                comentario: renderToString(setTextTable(lead.comentario)),
                servicios: renderToString(setListTable(lead.servicios, 'servicio')),
                empresa: renderToString(setTextTable(lead.empresa ? lead.empresa.name : '')),
                origen: renderToString(setTextTable(lead.origen ? lead.origen.origen : '')),
                fecha: renderToString(setDateTable(lead.created_at)),
                id: lead.id
            }
        })
        let aux = []

        leads.map((lead) => {
            aux.push({
                Nombre: lead.nombre,
                Teléfono: lead.telefono,
                Correo: lead.email,
                Empresa: lead.empresa ? lead.empresa.name : '',
                Origen: lead.origen ? lead.origen.origen : '',
                Servicios: lead.servicios ? this.setServiciosCSV(lead.servicios) : '',
                Comentario: lead.comentario,
                Fecha: new Date(lead.created_at),
                Tipo: lead.tipo_lead,
            })
        })

        this.setState({
            ... this.state,
            leads: _leads,
            leadsData: aux,
            data
        })
    }

    setServiciosCSV = servicios => {
        let aux = ''
        servicios.map((servicio, key) => {
            if(key > 0){
                aux += ', '
            }
            aux += servicio.servicio
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

    setContacto = (lead) => {
        return(
            <div>
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

    setServiciosData = (servicios) => {
        if(servicios.length)
            return(
                <ul>
                    {
                        servicios.map((servicio, key) => {
                            return(
                                <li key={key}>
                                    <Small>
                                        {servicio.servicio}
                                    </Small>
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
                        <Small>
                        Sin información
                        </Small>
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

    openModal = () => {
        this.setState({
            ... this.state,
            modalAdd: !this.state.modalAdd,
            title: 'Registrar nuevo lead',
            tipoForm: 'Add',
            formeditado:0
        })
    }

    openModalEditLead =  (lead) => {
        let { form, leadId } = this.state
        
        form['nombre'] = lead.nombre
        form['email'] = lead.email
        form['telefono'] = lead.telefono
        
        form['comentario'] = lead.comentario
        
        form['empresa'] = lead.empresa_id
        form['origen'] = lead.tipo_id
        form['tipo_lead'] = lead.tipo_lead

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
            leadId,
            formeditado:1
        })
    }

    openModalSafeDelete =  (lead) => {
        let { leadId } = this.state

        leadId = lead

        this.setState({
            ... this.state,
            modalDelete: true,
            leadId,
        })

    }

    openModalSafeConvert =  (lead) => {
        let { leadId } = this.state
        leadId = lead
        this.setState({
            ... this.state,
            modalConvert: true,
            convertir: 'Prospecto',
            leadId,
            formeditado:0
        })
    }

    openModalSafeConvertProveedor =  (lead) => {
        let { leadId } = this.state
        leadId = lead
        this.setState({
            ... this.state,
            modalConvert: true,
            convertir: 'Proveedor',
            leadId,
            formeditado:1
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
                empresa: 0,
                origen: 0,
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
            convertir: '',
            leadId: ''
        })
    }

    handleSubmitAddLead = (e) => {
        e.preventDefault();
        waitAlert();
        this.addLeadAxios()
    }

    handleSubmitEditLead = (e) => {
        e.preventDefault();
        waitAlert();
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
        const { convertir } = this.state
        
        if(convertir === 'Proveedor'){
            history.push({
                pathname: '/administracion/proveedores/convert',
                state: { lead: lead}
            });
        }else{
            history.push({
                pathname: '/leads/prospectos/convert',
                state: { lead: lead}
            });
        }
        
    }

    handleChangeInput = (e) => {
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

    async getLeads(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'lead', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas, leads, origenes, servicios } = response.data
                const { data } = this.state
                data.leads = leads
                this.setLeads(leads)
                this.setOrigenes(origenes)
                this.setServicios(servicios)
                this.setEmpresas(empresas)
                this.setState({
                    ... this.state,
                    data
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
                        empresa: 0,
                        origen: 0,
                        tipo_lead: 'potencial',
                        servicios: this.state.servicios
                    },
                    modalAdd: false
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'Agregaste con éxito el lead.')
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
                        empresa: 0,
                        origen: 0,
                        tipo_lead: 'potencial',
                        servicios: this.state.servicios
                    },
                    modalAdd: false
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el lead.')
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

    async deleteLeadAxios (lead){
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'lead/' + lead, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas, leads, origenes, servicios } = response.data
                this.setLeads(leads)
                this.setOrigenes(origenes)
                this.setServicios(servicios)
                this.setEmpresas(empresas)

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

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const leads = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if(!leads)
            history.push('/')
        this.getLeads()
    }

    exportToCSV = () => {
        const { leadsData } = this.state
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const ws = XLSX.utils.json_to_sheet(leadsData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, 'leads' + fileExtension);
    }

    render(){
        const { leads, modalAdd, form, origenes, empresas, servicios, title, tipoForm, modalDelete, leadId, modalConvert, convertir,data, formeditado } = this.state
        return(
            <Layout active={'leads'}  { ...this.props}>
                { 
                    <NewTable columns = { LEADS_COLUMNS } data = { leads } 
                        title = 'Leads' subtitle = 'Listado de leads'
                        mostrar_boton={true}
                        abrir_modal={true} 
                        onClick={this.openModal}
                        mostrar_acciones={true} 
                        
                        exportar_boton={true} 
                        onClickExport={this.exportToCSV}
                        
                        actions = {{
                            'edit': {function: this.openModalEditLead},
                            'delete': {function: this.openModalSafeDelete},
                            'prospecto': {function: this.openModalSafeConvert},
                            'proveedor': {function: this.openModalSafeConvertProveedor},
                        }}
                        elements = { data.leads }
                        cardTable='cardTable'
                        cardTableHeader='cardTableHeader'
                        cardBody='cardBody'
                    />
                }
                <Modal size="xl" title = { title } show = { modalAdd } handleClose = { this.handleCloseModal } >
                    <LeadForm 
                        className = " px-3 "
                        form = { form } 
                        origenes = { origenes }
                        empresas = { empresas }
                        servicios = { servicios }
                        onSubmit ={ tipoForm === 'Add' ? this.handleSubmitAddLead : this.handleSubmitEditLead }
                        onChange = { this.handleChangeInput } 
                        onChangeCalendar = { this.handleChangeDate }
                        onChangeCheckboxes = { this.handleChangeCheckbox }
                        formeditado={formeditado}
                        >
                    </LeadForm>
                </Modal>
                <Modal size="xl" title= {leadId === null ? "¿Estás seguro que deseas eliminar el lead": "¿Estás seguro que deseas eliminar el lead "+leadId.nombre +"?"} show={modalDelete} handleClose={this.handleCloseDeleteModal}>
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick={this.handleCloseDeleteModal} text="Cancelar" className={"btn btn-light-primary font-weight-bolder mr-3"}/>
                        <Button icon='' onClick={(e) => { this.safeDeleteLead(e)(leadId.id) }} text="Continuar" className={"btn btn-danger font-weight-bold mr-2"}/>
                    </div>
                </Modal>
                <Modal size="xl" title= {leadId === null ? "¿Estás seguro que deseas convertir el lead": "¿Estás seguro que deseas convertir el lead "+leadId.nombre +" en un "+convertir+"?"} show={modalConvert} handleClose={this.handleCloseConvertModal}>
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick={this.handleCloseConvertModal} text="Cancelar" className={"btn btn-light-primary font-weight-bolder mr-3"}/>
                        <Button icon='' onClick={(e) => { this.safeConvertLead(e)(leadId) }} text="Continuar" className={"btn btn-success font-weight-bold mr-2"}/>
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