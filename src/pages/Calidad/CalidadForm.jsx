import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../constants'
import { setOptions } from '../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert, questionAlert, deleteAlert, questionAlert2 } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { CalidadView } from '../../components/forms'
import { Form, Tabs, Tab } from 'react-bootstrap'
import { setFormHeader, setSingleHeader } from '../../functions/routers'
import { Modal } from '../../components/singles'
import { SelectSearchGray, CalendarDay, InputMoneyGray, Button } from '../../components/form-components'
import moment from 'moment'
import 'moment/locale/es' 
import NumberFormat from 'react-number-format';
class CalidadForm extends Component {
    state = {
        ticket: '',
        form: {
            adjuntos: {
                presupuesto: {
                    value: '',
                    placeholder: 'Presupuesto',
                    files: []
                },
                reporte_problema_reportado: {
                    value: '',
                    placeholder: 'Reporte fotográfico del problema reportado',
                    files: []
                },
                reporte_problema_solucionado: {
                    value: '',
                    placeholder: 'Reporte fotográfico del problema solucionado',
                    files: []
                }
            },
            fechaProgramada: new Date(),
            fechaMantenimiento: new Date(),
            empleado: '',
            recibe: '',
            motivo: '',
            costo: 0.0,
            equipo: '',
        },
        options: { empleados: [], equipos: [] },
        modal: false,
        data: {
            mantenimientos: []
        },
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const remisiones = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        this.getTicketsOptions()
        switch (action) {
            case 'see':
                if (state) {
                    if (state.calidad) {
                        const { calidad } = state
                        if (calidad.estatus_ticket.estatus === 'En espera') this.changeEstatusAxios({ id: calidad.id })
                        else {
                            console.log(calidad, 'CALIDAD')
                            this.getOneTicketAxios(calidad.id)
                            //this.setState({ ...this.state, ticket: calidad, form: this.setForm(calidad) }) 
                        }
                        //window.history.replaceState(null, '')
                    } else history.push('/calidad/tickets')
                } else history.push('/calidad/tickets')
                break;
            default:
                break;
        }
        if (!remisiones) history.push('/')
    }
    setForm = ticket => {
        const { form } = this.state
        let aux = []
        ticket.presupuesto.forEach((presupuesto) => {
            aux.push({ name: presupuesto.name, url: presupuesto.url, file: '' })
        })
        form.adjuntos.presupuesto.files = aux
        aux = []
        ticket.reporte_problema_reportado.forEach((element) => {
            aux.push({ name: element.name, url: element.url, file: '', id: element.id })
        })
        form.adjuntos.reporte_problema_reportado.files = aux
        aux = []
        ticket.reporte_problema_solucionado.forEach((element) => {
            aux.push({ name: element.name, url: element.url, file: '', id: element.id })
        })
        form.adjuntos.reporte_problema_solucionado.files = aux
        form.fechaProgramada = new Date(ticket.created_at)
        /* if (ticket.tecnico)
            form.empleado = ticket.tecnico.id.toString() */
        form.empleado = ticket.tecnico_asiste
        form.descripcion = ticket.descripcion_solucion
        form.recibe = ticket.recibe
        return form
    }
    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push( { name: files[counter].name, file: files[counter], url: URL.createObjectURL(files[counter]), key: counter } )
        }
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({ ...this.state, form })
    }
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    handleChange = (files, item) => {
        if (item === 'presupuesto')
            questionAlert('¿DESEAS ENVIAR EL PRESUPUESTO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.sendPresupuestoTicketAxios(files, item))
        else
            this.onChangeAdjunto({ target: { name: item, value: files, files: files } })
    }
    deleteFile = element => { deleteAlert('DESEAS ELIMINAR EL ARCHIVO', '', () => this.deleteAdjuntoAxios(element.id)) }
    openModalWithInput = estatus => {
        const { ticket } = this.state
        // this.changeEstatusAxios({id: ticket.id, estatus: estatus})
        questionAlert2('¿ESTÁS SEGURO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.cancelTicket({ id: ticket.id, estatus: estatus }),
            <div>
                <Form.Control placeholder='MOTIVO DE CANCELACIÓN' className="form-control form-control-solid h-auto py-7 px-6 text-uppercase"
                    id='motivo' as="textarea" rows="3" />
            </div>
        )
    }
    onSubmit = e => {
        e.preventDefault();
        this.saveProcesoTicketAxios('')
    }
    generateEmail = value => { this.saveProcesoTicketAxios(value) }
    onSubmitMantenimiento = async(e) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { ticket, form, data } = this.state
        await axios.post(`${URL_DEV}v2/calidad/tickets/${ticket.id}/mantenimiento`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => { 
                doneAlert('Mantenimiento correctivo generado con éxito.') 
                this.getOneTicketAxios(ticket.id)
                data.mantenimientos = ticket.mantenimientos
                this.setState({
                    ...this.state,
                    data
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    deleteAdjuntoAxios = async(id) => {
        const { access_token } = this.props.authUser
        const { ticket } = this.state
        await axios.delete(URL_DEV + 'calidad/' + ticket.id + '/adjuntos/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { ticket } = response.data
                window.history.replaceState(ticket, 'calidad')
                this.setState({ ...this.state, ticket: ticket, form: this.setForm(ticket) })
                doneAlert('Adjunto eliminado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    saveProcesoTicketAxios = async(email) =>{
        waitAlert()
        const { access_token } = this.props.authUser
        const { ticket, form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch (element) {
                case 'fechaProgramada':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element]);
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.forEach((element) => {
            if (form.adjuntos[element].value !== '' && element !== 'presupuesto') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })
        if (email !== '')
            data.append('email', email)
        await axios.post(`${URL_DEV}calidad/proceso/${ticket.id}`, data, { headers: setFormHeader(access_token) }).then(
            (response) => {
                const { ticket } = response.data
                window.history.replaceState(ticket, 'calidad')
                this.setState({ ...this.state, ticket: ticket, form: this.setForm(ticket) })
                doneAlert('Presupuesto adjuntado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    sendPresupuestoTicketAxios = async(files, item) => {
        this.onChangeAdjunto({ target: { name: item, value: files, files: files } })
        waitAlert()
        const { access_token } = this.props.authUser
        const { ticket, form } = this.state
        const data = new FormData();
        let aux = Object.keys(form.adjuntos)
        aux.forEach((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })
        await axios.post(URL_DEV + 'calidad/presupuesto/' + ticket.id, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { ticket } = response.data
                window.history.replaceState(ticket, 'calidad')
                this.setState({ ...this.state, ticket: ticket, form: this.setForm(ticket) })
                doneAlert('Presupuesto adjuntado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    changeEstatusAxios = async(data) =>{
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'calidad/estatus/' + data.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { ticket } = response.data
                window.history.replaceState(ticket, 'calidad')
                this.setState({ ...this.state, ticket: ticket, form: this.setForm(ticket) })
                if (data.estatus)
                    doneAlert('El ticket fue actualizado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    cancelTicket = async(data) => {
        const { access_token } = this.props.authUser
        data.motivo = document.getElementById('motivo').value
        await axios.put(URL_DEV + 'calidad/estatus/' + data.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { ticket } = response.data
                window.history.replaceState(ticket, 'calidad')
                this.setState({ ...this.state, ticket: ticket, form: this.setForm(ticket) })
                if (data.estatus) 
                    doneAlert('El ticket fue actualizado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    getTicketsOptions = async() => {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'calidad/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empleados, estatus } = response.data
                const { options } = this.state
                options['empleados'] = setOptions(empleados, 'nombre', 'id')
                options['estatus'] = this.setOptionsEstatus(estatus, 'estatus', 'id')
                this.setState({ ...this.state, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    getOneTicketAxios = async(id) => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/calidad/tickets/${id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { ticket } = response.data
                const { options, data } = this.state
                let aux = []
                if(ticket.proyecto){
                    if(ticket.proyecto.equipos_instalados){
                        ticket.proyecto.equipos_instalados.forEach((element) => {
                            if(element.equipo){
                                const { texto } = element.equipo
                                aux.push({ value: element.id.toString(), name: `${element.fecha} - (${element.cantidad}) ${texto}` })
                            }
                        })
                    }
                }
                options.equipos = aux
                data.mantenimientos = ticket.mantenimientos
                this.setState({ ...this.state, ticket: ticket, form: this.setForm(ticket), options, data })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    setOptionsEstatus = (arreglo) => {
        let aux = []
        arreglo.forEach((element) => {
            aux.push( {  name: element.estatus,  value: element.id.toString(), letra: element.letra, fondo: element.fondo } )
        });
        return aux
    }
    changeEstatus = estatus => {
        const { ticket } = this.state
        switch(estatus){
            case 'Rechazado':
                this.openModalWithInput('Rechazado');
                break;
            case 'Aceptado':
                questionAlert('¿ESTÁS SEGURO?', 'DARÁS POR ACEPTADO EL TICKET ¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios({ id: ticket.id, estatus: estatus }))
                break;
            case 'Terminado':
                questionAlert('¿ESTÁS SEGURO?', 'DARÁS POR TERMINADO EL TICKET ¡NO PODRÁS REVERTIR ESTO!',  () => this.changeEstatusAxios({ id: ticket.id, estatus: estatus }))
                break;
            case 'En proceso':
                questionAlert('¿ESTÁS SEGURO?', 'ESTARÁ EN PROCESO EL TICKET ¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios({ id: ticket.id, estatus: estatus }))
                break;
            case 'Respuesta pendiente':
                questionAlert('¿ESTÁS SEGURO?', 'ESTARÁ EL TICKET EN RESPUESTA PENDIENTE ¡NO PODRÁS REVERTIR ESTO!',  () => this.changeEstatusAxios({ id: ticket.id, estatus: estatus }))
                break;
            case 'En revisión':
                questionAlert('¿ESTÁS SEGURO?', 'ESTARÁ EN REVISIÓN EL TICKET ¡NO PODRÁS REVERTIR ESTO!',  () => this.changeEstatusAxios({ id: ticket.id, estatus: estatus }))
                break;
            case 'En espera':
                questionAlert('¿ESTÁS SEGURO?', 'ESTARÁ EN ESPERA EL TICKET ¡NO PODRÁS REVERTIR ESTO!',  () => this.changeEstatusAxios({ id: ticket.id, estatus: estatus }))
                break;
            default: break;
        }
    }
    updateSelect = (value, name) => {
        const { form } = this.state
        form[name] = value
        this.setState({...this.state, form})
    }
    openModalMantenimiento = () => { this.setState({...this.state, modal: true}) }
    handleCloseLevantamiento = () => { this.setState({...this.state, modal: false}) }
    
    formatDay (fecha){
        let fecha_momment = moment(fecha);
        let format = fecha_momment.locale('es').format("DD MMM YYYY");
        return format.replace('.', '');
    }
    setMoneyTable(value) {
        let cantidad = 0
        cantidad = parseFloat(value).toFixed(2)
        return (
            <NumberFormat value={cantidad} displayType={'text'} thousandSeparator={true} prefix={'$'}
                renderText={cantidad => <span> {cantidad} </span>} />
        )
    }
    openModalDeleteMantenimiento = mantenimiento => {
        deleteAlert(`¿DESEAS ELIMINAR EL MANTENIMIENTO?`, '', () => this.deleteMantenimientoAxios(mantenimiento))
    }
    async deleteMantenimientoAxios(mantenimiento) {
        const { access_token } = this.props.authUser
        const { ticket } = this.state
        await axios.delete(`${URL_DEV}v2/calidad/tickets/${mantenimiento.id}?ticket=${ticket.id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { ticket } = response.data
                const { data } = this.state
                data.mantenimiento = ticket.notas
                this.setState({ ...this.state, data })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El mantenimiento fue eliminado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    render() {
        const { ticket, form, options, modal, data } = this.state
        
        console.log(data.mantenimientos)
        return (
            <Layout active={'calidad'}  {...this.props}>
                <CalidadView data = { ticket } form = { form } options = { options } handleChange = { this.handleChange }
                    changeEstatus = { this.changeEstatus } onChange = { this.onChange } onSubmit = { this.onSubmit }
                    generateEmail = { this.generateEmail } openModalWithInput = { this.openModalWithInput}
                    deleteFile = { this.deleteFile } openModalMantenimiento = { this.openModalMantenimiento } />
                <Modal size = "lg" title = 'Mantenimiento correctivo' show = { modal } handleClose = { this.handleCloseLevantamiento } customcontent = { true } 
                    contentcss = "modal modal-sticky modal-sticky-bottom-right d-block modal-sticky-lg modal-dialog modal-dialog-scrollable">
                    <Tabs defaultActiveKey = "formulario_mantenimiento" className = "nav nav-tabs nav-tabs-line font-weight-bolder mb-8 justify-content-center border-0 mt-5 nav-tabs-line-2x">
                        <Tab eventKey = "formulario_mantenimiento" title = "Agregar mantenimiento">
                            <Form onSubmit = { (e) => { e.preventDefault(); this.onSubmitMantenimiento(e) } } >
                                <div className="row mx-0 justify-content-center">
                                    <div className="col-md-4">
                                        <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } withformgroup = { 1 }
                                            requirevalidation = { 0 } formeditado = { 0 } thousandseparator = { true } prefix = '$' name = "costo"
                                            value = { form.costo } onChange = { this.onChange } placeholder = "COSTO" iconclass = "la la-money-bill icon-xl" />
                                    </div>
                                    <div className="col-md-8">
                                        <SelectSearchGray withtaglabel={1} withtextlabel={1} withicon={1} options = { options.equipos } 
                                            placeholder = 'SELECCIONA EL EQUIPO INSTALADO' name = "equipo" 
                                            value = { form.equipo } onChange = { (value) => this.updateSelect(value, 'equipo') }
                                            iconclass="la la-toolbox icon-xl" formeditado={0} messageinc="Incorrecto. Selecciona el técnico que asiste" />
                                    </div>
                                </div>
                                <div className = 'text-center'>
                                    <div className="d-flex justify-content-center pt-5" style={{ height: '14px' }}>
                                        <label className="text-center font-weight-bolder text-dark-60">Fecha del mantenimiento</label>
                                    </div>
                                    <CalendarDay value = { form.fechaMantenimiento } name = 'fechaMantenimiento' date = { form.fechaMantenimiento } withformgroup = { 1 } 
                                        onChange = { this.onChange } placeholder = 'Fecha del mantenimiento' requirevalidation = { 1 } />
                                </div>
                                <div className="card-footer py-3 pr-1 text-right">
                                    <Button icon = '' className = "btn btn-primary mr-2" text = "ENVIAR"
                                        type = 'submit'/>
                                </div>
                            </Form>
                        </Tab>
                        {
                            data.mantenimientos.length > 0 &&
                                <Tab eventKey = "historial" title = "Historial de mantenimientos">
                                    <table className="table table-responsive-lg table-vertical-center text-center w-100">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th></th>
                                                <th style={{minWidth:'200px'}}>Equipo</th>
                                                <th>Fecha de mantenimiento</th>
                                                <th>Costo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                data.mantenimientos.map((mantenimiento, index) => {
                                                    return(
                                                        <tr key = { index }>
                                                            <td className = 'px-2'>
                                                                <button className = 'btn btn-icon btn-actions-table btn-xs ml-2 btn-text-danger btn-hover-danger' 
                                                                    onClick = { (e) => {e.preventDefault(); this.openModalDeleteMantenimiento(mantenimiento)}} >
                                                                    <i className='flaticon2-rubbish-bin' />
                                                                </button>
                                                            </td>
                                                            <td className = 'px-2 text-break'>{mantenimiento.instalacion.equipo.texto}</td>
                                                            <td className = 'px-2 text-break'> {this.formatDay(mantenimiento.fecha)} </td>
                                                            <td className = 'px-2 text-break'> {this.setMoneyTable(mantenimiento.costo)} </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </Tab>
                        }
                    </Tabs>
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

export default connect(mapStateToProps, mapDispatchToProps)(CalidadForm);