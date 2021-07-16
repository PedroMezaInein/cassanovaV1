import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { setOptions } from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert, questionAlert, deleteAlert, questionAlert2, customInputAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { TicketView, AgregarConcepto } from '../../../components/forms'
import { Form, Tabs, Tab } from 'react-bootstrap'
import { setFormHeader, setSingleHeader } from '../../../functions/routers'
import { Modal } from '../../../components/singles'
import { SelectSearchGray, CalendarDay, InputMoneyGray, Button } from '../../../components/form-components'
import moment from 'moment'
import 'moment/locale/es' 
import NumberFormat from 'react-number-format';
import Swal from 'sweetalert2'
class TicketDetails extends Component {
    state = {
        formeditado: 0,
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
            tipo_trabajo:''
        },
        formPresupuesto: {
            proyecto: "",
            area: "",
            empresa: "",
            fecha: new Date(),
            tiempo_ejecucion: "",
            partida: "",
            subpartida: "",
            conceptos: {}
        },
        formPPreeliminar: {
            conceptos: [{
                unidad: '',
                descipcion: '',
                costo: '',
                cantidad_preliminar: '',
                desperdicio: '',
                active: true,
                cantidad: 0,
                importe: 0,
                id: '',
                mensajes: {
                    active: false,
                    mensaje: ''
                }
            }],
            conceptosNuevos: []
        },
        options: {
            empleados: [],
            equipos: [],
            tiposTrabajo:[],
            partidas: [],
            subpartidas: [],
        },
        modal: false,
        data: {
            mantenimientos: [],
            partidas: [],
            subpartidas: [],
            conceptos: []
        },
        presupuesto: '',
        key: 'nuevo',
    }
    componentDidMount() {
        const { location: { state } } = this.props
        const { history } = this.props
        this.getOptionsAxios()
        if (state) {
            if (state.calidad) {
                const { calidad } = state
                if (calidad.estatus_ticket.estatus === 'En espera') this.changeEstatusAxios({ id: calidad.id })
                else { this.getOneTicketAxios(calidad.id) }
            } else history.push('/calidad/tickets')
        } else history.push('/calidad/tickets')
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
        questionAlert2('¿ESTÁS SEGURO DE RECHAZAR EL TICKET?', '¡NO PODRÁS REVERTIR ESTO!', () => this.cancelTicket({ id: ticket.id, estatus: estatus }),
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
    getOptionsAxios = async() => {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'calidad/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empleados, estatus, tiposTrabajo, proyectos, partidas, conceptos} = response.data
                const { options, formPresupuesto, data } = this.state
                data.partidas = partidas
                let aux = {}
                conceptos.map((concepto) => {
                    return aux[concepto.clave] = false
                })
                formPresupuesto.conceptos = aux;
                options.empleados = setOptions(empleados, 'nombre', 'id')
                options.estatus = this.setOptionsEstatus(estatus, 'estatus', 'id')
                options.tiposTrabajo = setOptions(tiposTrabajo, 'nombre', 'id')
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                options.partidas = setOptions(partidas, "nombre", "id")
                this.setState({ ...this.state, options, data })
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
                this.setState({ ...this.state, ticket: ticket, form: this.setForm(ticket), options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    patchTicket = async(type, value) => {
        const { access_token } = this.props.authUser
        const { ticket } = this.state
        waitAlert()
        await axios.patch(`${URL_DEV}v3/calidad/tickets/${ticket.id}`, { type: type, value: value }, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert('Ticket actualizado con éxito')
                this.getOneTicketAxios(ticket.id)
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
        const { ticket, options, form } = this.state
        switch(estatus){
            case 'Rechazado':
                this.openModalWithInput('Rechazado');
                break;
            case 'Aceptado':
                // questionAlert('¿ESTÁS SEGURO?', 'DARÁS POR ACEPTADO EL TICKET ¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios({ id: ticket.id, estatus: estatus }))
                customInputAlert(
                    <div className="row mx-0">
                        <h5 className="mb-4 font-weight-bold text-dark col-md-12 mt-4">SELECCIONA EL TIPO DE TRABAJO</h5>
                        <div className="row mx-0 col-md-12 px-0 form-group-marginless d-flex justify-content-center">
                            <div className="col-md-10">
                                <SelectSearchGray withtaglabel={0} withtextlabel={0} options={options.tiposTrabajo} onChange={(value) => { this.onChangeSwal(value, 'tipo_trabajo') }}
                                    name='tipo_trabajo' value={form.tipo_trabajo} customdiv="mb-2 text-left" requirevalidation={1}
                                    placeholder='TIPO DE TRABAJO' withicon={0} customclass='text-center px-2' />
                            </div>
                        </div>
                    </div>,
                    '',
                    () => { this.patchTicket('tipo_trabajo', form.tipo_trabajo) },
                    () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
                )
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
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch(element){
                case 'fechaProgramada':
                case 'fechaMantenimiento':
                    form[element] = new Date()
                    break;
                case 'adjuntos':
                    form[element] = {
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
                    }
                    break;
                case 'costo':
                    form[element] = 0
                    break;
                default:
                    form[element] = ''
                break;
            }
        })
        return form
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
    /* ============== CONCEPTOS Y VOLUMETRIAS ============== */
    onChangePresupuesto = (e) => {
        const { name, value } = e.target;
        const { data } = this.state
        switch (name) {
            case 'partida':
                data.partidas.map((partida) => {
                    data.conceptos = []
                    if (partida.id.toString() === value) {
                        data.subpartidas = partida.subpartidas
                    }
                    return false
                })
                break;
            case 'subpartida':
                data.subpartidas.map((subpartida) => {
                    if (subpartida.id.toString() === value) {
                        data.conceptos = subpartida.conceptos
                    }
                    return false
                })
                break;
            default:
                break;
        }
        const { formPresupuesto } = this.state;
        formPresupuesto[name] = value;
        this.setState({
            ...this.state,
            formPresupuesto,
            data
        });
    };
    checkButton = e => {
        const { name, checked } = e.target
        const { formPresupuesto } = this.state
        formPresupuesto.conceptos[name] = checked
        this.setState({
            ...this.state,
            formPresupuesto
        })
    }
    setOptions = (name, array) => {
        const { options } = this.state;
        options[name] = setOptions(array, "nombre", "id");
        this.setState({
            ...this.state,
            options,
        });
    };
    onSubmitPresupuesto = e => {
        e.preventDefault()
        waitAlert()
        this.addPresupuestosAxios()
    }
    
    addPresupuestosAxios = async() => {
        const { access_token } = this.props.authUser
        const { formPresupuesto, ticket } = this.state
        if(ticket.proyecto){
            formPresupuesto.proyecto = ticket.proyecto.id
            if(ticket.proyecto.empresa)
                formPresupuesto.empresa = ticket.proyecto.empresa.id
        }
        if(ticket.subarea){
            formPresupuesto.area = ticket.subarea.area_id
        }
        await axios.post(`${URL_DEV}presupuestos`, formPresupuesto, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { presupuesto } = response.data
                this.patchTicket('presupuesto', presupuesto.id)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getPresupuestoAxios = async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}presupuestos/${id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { presupuesto } = response.data
                const { formPPreeliminar } = this.state
                let aux = []
                presupuesto.conceptos.forEach((concepto) => {
                    aux.push({
                        active: concepto.active,
                        descripcion: concepto.descripcion,
                        cantidad_preliminar: concepto.cantidad_preliminar,
                        desperdicio: concepto.desperdicio,
                        cantidad: concepto.cantidad,
                        mensajes: {
                            active: concepto.mensaje ? true : false,
                            mensaje: concepto.mensaje
                        }
                    })
                })
                formPPreeliminar.conceptos = aux
                this.setState({ ...this.state, presupuesto: presupuesto, formPPreeliminar: formPPreeliminar })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    /* ============== PRESUPUESTO PREELIMINAR ============== */
    onChangePPreeliminar = (key, e, name) => {
        let { value } = e.target
        const { formPPreeliminar, presupuesto } = this.state
        if (name === 'desperdicio') {
            value = value.replace('%', '')
        }
        formPPreeliminar['conceptos'][key][name] = value
        let cantidad = formPPreeliminar['conceptos'][key]['cantidad_preliminar'] * (1 + (formPPreeliminar['conceptos'][key]['desperdicio'] / 100))
        cantidad = cantidad.toFixed(2)
        let importe = cantidad * formPPreeliminar['conceptos'][key]['costo']
        importe = importe.toFixed(2)
        formPPreeliminar['conceptos'][key]['cantidad'] = cantidad
        formPPreeliminar['conceptos'][key]['importe'] = importe
        if (name !== 'mensajes' && name !== 'desperdicio')
            if (presupuesto.conceptos[key][name] !== formPPreeliminar.conceptos[key][name]) {
                formPPreeliminar.conceptos[key].mensajes.active = true
            } else {
                formPPreeliminar.conceptos[key].mensajes.active = false
            }
        if (name === 'desperdicio')
            if (presupuesto.conceptos[key][name].toString() !== formPPreeliminar.conceptos[key][name].toString()) {
                formPPreeliminar.conceptos[key].mensajes.active = true
                formPPreeliminar.conceptos[key].mensajes.mensaje = ('Actualización del desperdicio a un ' + value + '%').toUpperCase()
            } else {
                formPPreeliminar.conceptos[key].mensajes.active = false
                formPPreeliminar.conceptos[key].mensajes.mensaje = ''
            }
        this.setState({
            ...this.state,
            formPPreeliminar
        })
    }
    
    checkButtonPPreeliminar = (key, e) => {
        const { name, checked } = e.target
        const { formPPreeliminar, presupuesto } = this.state
        formPPreeliminar.conceptos[key][name] = checked
        if (!checked) {
            let pre = presupuesto.conceptos[key]
            let aux = { active: false, mensaje: '' }
            this.onChange(key, { target: { value: pre.descripcion } }, 'descripcion')
            this.onChange(key, { target: { value: pre.costo } }, 'costo')
            this.onChange(key, { target: { value: pre.cantidad_preliminar } }, 'cantidad_preliminar')
            this.onChange(key, { target: { value: '$' + pre.desperdicio } }, 'desperdicio')
            this.onChange(key, { target: { value: aux } }, 'mensajes')
        }
        this.setState({
            ...this.state,
            formPPreeliminar
        })
    }
    onSubmitPPreeliminar = e => {
        e.preventDefault()
        waitAlert()
        this.updatePPreeliminarAxios()
    }
    async updatePPreeliminarAxios() {
        const { access_token } = this.props.authUser
        const { formPPreeliminar, presupuesto } = this.state
        await axios.put(URL_DEV + 'presupuestos/' + presupuesto.id, formPPreeliminar, { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { presupuesto } = response.data
                this.getOnePresupuestoAxios(presupuesto.id)
                doneAlert(response.data.message !== undefined ? response.data.message : 'El presupuesto fue modificado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    openModalPPConcepto = () => {
        const { options } = this.state
        options.subpartidas = []
        this.setState({
            ...this.state,
            options,
            modalPPConcepto: true,
            //formPPreeliminar: this.clearForm(),
            formeditado: 0
        })
    }
    handleClosePPConcepto = () => {
        const { modalPPConcepto, options } = this.state
        options.subpartidas = []
        this.setState({
            ...this.state,
            modalPPConcepto: !modalPPConcepto,
            options,
            concepto: '',
            formPPreeliminar: this.clearFormPPConceptos()
        })
    }
    clearFormPPConceptos = () => {
        const { formPPreeliminar } = this.state
        let aux = Object.keys(formPPreeliminar)
        aux.map((element) => {
            if (element !== 'conceptos' && element !== 'conceptosNuevos')
            formPPreeliminar[element] = ''
            return false
        })
        return formPPreeliminar
    }
    onChangeConceptos = (e) => {
        const { name, value } = e.target;
        const { data, formPPreeliminar, presupuesto } = this.state
        switch (name) {
            case 'partida':
                data.partidas.map((partida) => {
                    data.conceptos = []
                    if (partida.id.toString() === value) {
                        data.subpartidas = partida.subpartidas
                    }
                    return false
                })
                break;
            case 'subpartida':
                data.subpartidas.map((subpartida) => {
                    if (subpartida.id.toString() === value) {
                        data.conceptos = subpartida.conceptos
                    }
                    return false
                })
                let array = []
                data.conceptos.map((concepto) => {
                    let aux = false
                    presupuesto.conceptos.map((concepto_form) => {
                        if (concepto) {
                            if (concepto.clave === concepto_form.concepto.clave) {
                                aux = true
                            }
                        }
                        return false
                    })
                    if (!aux) {
                        array.push(concepto)
                    }
                    return false
                })
                formPPreeliminar.conceptosNuevos = []
                array.map((element, key) => {
                    formPPreeliminar.conceptosNuevos.push(element)
                    formPPreeliminar.conceptosNuevos[key].active = false
                    return false
                })
                break;
            default:
                break;
        }
        formPPreeliminar[name] = value;
        this.setState({
            ...this.state,
            formPPreeliminar,
            data
        });
    };
    
    checkButtonConceptos = (e, key) => {
        const { checked } = e.target
        const { formPPreeliminar } = this.state
        formPPreeliminar.conceptosNuevos[key].active = checked
        this.setState({
            ...this.state,
            formPPreeliminar
        })
    }
    controlledTab = value => {
        this.setState({
            ...this.state,
            formPPreeliminar: this.clearForm(),
            key: value
        })
    }
    onSubmitConceptos = e => {
        e.preventDefault()
        const { key, formPPreeliminar } = this.state
        waitAlert()
        if (key === 'nuevo')
            this.addConceptoAxios()
        else {
            let aux = []
            formPPreeliminar.conceptosNuevos.map((concepto) => {
                if (concepto.active)
                    aux.push(concepto)
                return false
            })
            this.addConceptoToPresupuestoAxios(aux)
        }
    }
    
    async addConceptoAxios() {
        const { access_token } = this.props.authUser
        const { formPPreeliminar } = this.state
        await axios.post(URL_DEV + 'conceptos', formPPreeliminar, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { concepto } = response.data
                this.addConceptoToPresupuestoAxios([concepto])
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async addConceptoToPresupuestoAxios(conceptos) {
        const { access_token } = this.props.authUser
        const { presupuesto } = this.state
        let aux = {
            conceptos: conceptos
        }
        await axios.post(URL_DEV + 'presupuestos/' + presupuesto.id + '/conceptos', aux, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { presupuesto } = response.data
                this.getOnePresupuestoAxios(presupuesto.id)
                doneAlert(response.data.message !== undefined ? response.data.message : 'El presupuesto fue registrado con éxito.')
                this.setState({
                    modalPPConcepto: false
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async getOnePresupuestoAxios(id) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'presupuestos/' + id, { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { formPPreeliminar } = this.state
                const { presupuesto } = response.data
                let aux = []
                presupuesto.conceptos.map((concepto) => {
                    let mensajeAux = {}
                    if (concepto.mensaje) {
                        mensajeAux = {
                            active: true,
                            mensaje: concepto.mensaje
                        }
                    } else {
                        mensajeAux = {
                            active: false,
                            mensaje: ''
                        }
                    }
                    let bandera = false
                    formPPreeliminar.conceptos.map((elemento) => {
                        if (concepto.id === elemento.id) {
                            bandera = elemento
                        }
                        return false
                    })
                    if (bandera) {
                        aux.push(
                            bandera
                        )
                    } else {
                        aux.push({
                            descripcion: concepto.descripcion,
                            costo: concepto.costo.toFixed(2),
                            cantidad_preliminar: concepto.cantidad_preliminar,
                            desperdicio: concepto.desperdicio,
                            cantidad: (concepto.cantidad_preliminar * (1 + (concepto.desperdicio / 100))).toFixed(2),
                            importe: ((concepto.cantidad_preliminar * (1 + (concepto.desperdicio / 100))) * concepto.costo).toFixed(2),
                            active: concepto.active ? true : false,
                            id: concepto.id,
                            mensajes: mensajeAux,
                            unidad: concepto ? concepto.concepto ? concepto.concepto.unidad ? concepto.concepto.unidad.nombre : '' : '' : ''
                        })
                    }
                    return false
                })
                formPPreeliminar.conceptos = aux
                this.setState({
                    ...this.state,
                    presupuesto: presupuesto,
                    formPPreeliminar,
                    formeditado: 1
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    onClickVolumetrias = () => {
        const { ticket } = this.state
        if(ticket.presupuesto_id)
            this.getPresupuestoAxios(ticket.presupuesto_id)
    }
    render() {
        const { ticket, form, options, modal, data, formPresupuesto, formeditado, formPPreeliminar, modalPPConcepto, presupuesto, key } = this.state
        return (
            <Layout active={'calidad'}  {...this.props}>
                <TicketView data = { ticket } form = { form } options = { options } handleChange = { this.handleChange } changeEstatus = { this.changeEstatus }
                    onChange = { this.onChange } onSubmit = { this.onSubmit } generateEmail = { this.generateEmail } deleteFile = { this.deleteFile }
                    openModalWithInput = { this.openModalWithInput } openModalMantenimiento = { this.openModalMantenimiento }
                    /* ============== CONCEPTOS Y VOLUMETRIAS ============== */
                    formeditado = { formeditado } formPresupuesto = { formPresupuesto } onChangePresupuesto = { this.onChangePresupuesto }
                    checkButton = { this.checkButton } setOptions = { this.setOptions } onSubmitPresupuesto = { this.onSubmitPresupuesto }
                    dataPresupuesto = { data } onClickVolumetrias = { this.onClickVolumetrias }
                    /* ============== PRESUPUESTO PREELIMINAR ============== */
                    formPPreeliminar={formPPreeliminar} onChangePPreeliminar={this.onChangePPreeliminar} checkButtonPPreeliminar={this.checkButtonPPreeliminar}
                    onSubmitPPreeliminar = { this.onSubmitPPreeliminar } presupuesto={presupuesto} openModalPPConcepto={this.openModalPPConcepto}
                />
                <Modal size = "lg" title = 'Mantenimiento correctivo' show = { modal } handleClose = { this.handleCloseLevantamiento } customcontent = { true } contentcss="modal modal-sticky modal-sticky-bottom-right d-block modal-sticky-lg modal-dialog modal-dialog-scrollable">
                    <Tabs defaultActiveKey="formulario_mantenimiento" className="nav nav-tabs nav-tabs-line font-weight-bolder mb-8 justify-content-center border-0 mt-5 nav-tabs-line-2x">
                        <Tab eventKey="formulario_mantenimiento" title="Agregar mantenimiento">
                            <Form onSubmit={(e) => { e.preventDefault(); this.onSubmitMantenimiento(e) }} >
                                <div className="row mx-0 justify-content-center">
                                    <div className="col-md-4">
                                        <InputMoneyGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={1}
                                            requirevalidation={0} formeditado={0} thousandseparator={true} prefix='$' name="costo"
                                            value={form.costo} onChange={this.onChange} placeholder="COSTO" iconclass="la la-money-bill icon-xl" />
                                    </div>
                                    <div className="col-md-8">
                                        <SelectSearchGray withtaglabel={1} withtextlabel={1} withicon={1} options={options.equipos}
                                            placeholder='SELECCIONA EL EQUIPO INSTALADO' name="equipo"
                                            value={form.equipo} onChange={(value) => this.updateSelect(value, 'equipo')}
                                            iconclass="la la-toolbox icon-xl" formeditado={0} messageinc="Incorrecto. Selecciona el técnico que asiste" />
                                    </div>
                                </div>
                                <div className='text-center'>
                                    <div className="d-flex justify-content-center pt-5" style={{ height: '14px' }}>
                                        <label className="text-center font-weight-bolder text-dark-60">Fecha del mantenimiento</label>
                                    </div>
                                    <CalendarDay value={form.fechaMantenimiento} name='fechaMantenimiento' date={form.fechaMantenimiento} withformgroup={1}
                                        onChange={this.onChange} placeholder='Fecha del mantenimiento' requirevalidation={1} />
                                </div>
                                <div className="card-footer py-3 pr-1 text-right">
                                    <Button icon='' className="btn btn-primary mr-2" text="ENVIAR"
                                        type='submit' />
                                </div>
                            </Form>
                        </Tab>
                        {
                            data.mantenimientos.length > 0 &&
                            <Tab eventKey="historial" title="Historial de mantenimientos">
                                <table className="table table-responsive-lg table-vertical-center text-center w-100">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th></th>
                                            <th style={{ minWidth: '200px' }}>Equipo</th>
                                            <th>Fecha de mantenimiento</th>
                                            <th>Costo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.mantenimientos.map((mantenimiento, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className='px-2'>
                                                            <button className='btn btn-icon btn-actions-table btn-xs ml-2 btn-text-danger btn-hover-danger'
                                                                onClick={(e) => { e.preventDefault(); this.openModalDeleteMantenimiento(mantenimiento) }} >
                                                                <i className='flaticon2-rubbish-bin' />
                                                            </button>
                                                        </td>
                                                        <td className='px-2 text-break'>{mantenimiento.instalacion.equipo.texto}</td>
                                                        <td className='px-2 text-break'> {this.formatDay(mantenimiento.fecha)} </td>
                                                        <td className='px-2 text-break'> {this.setMoneyTable(mantenimiento.costo)} </td>
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
                <Modal size="xl" title='AGREGAR CONCEPTO' show={modalPPConcepto} handleClose={this.handleClosePPConcepto}>
                    <AgregarConcepto options = { options } formeditado = { formeditado } form = { formPPreeliminar } onChange = { this.onChangeConceptos }
                        setOptions = { this.setOptions } checkButtonConceptos = { this.checkButtonConceptos } data = { data }
                        onSelect = { this.controlledTab } activeKey = { key } onSubmit = { this.onSubmitConceptos } />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(TicketDetails);