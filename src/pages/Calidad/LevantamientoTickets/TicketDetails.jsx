import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, S3_CONFIG } from '../../../constants'
import { setOptions, setSelectOptions } from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert, questionAlert, questionAlert2, customInputAlert, questionAlertY, deleteAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { TicketView, AgregarConcepto } from '../../../components/forms'
import { Form } from 'react-bootstrap'
import { setSingleHeader } from '../../../functions/routers'
import { Modal } from '../../../components/singles'
import { SelectSearchGray } from '../../../components/form-components'
import moment from 'moment'
import 'moment/locale/es'
import Swal from 'sweetalert2'
import S3 from 'react-aws-s3';

const ReactS3Client = new S3(S3_CONFIG);
class TicketDetails extends Component {

    state = {
        options: { 
            empleados: [],
            estatus: [],
            tiposTrabajo: [],
            proyectos: [],
            partidas: [],
            subpartidas: [],
            proveedores: [],
            unidades: [],
            empresas: [],
            areas: [],
            subareas: [],
            tiposPagos: []
        },
        formularios: {
            presupuesto: { fecha: new Date(), tiempo_ejecucion: "", conceptos: {} },
            ticket: {
                fechaProgramada: new Date(),
                empleado: '',
                recibe: '',
                motivo: '',
                costo: 0.0,
                tipo_trabajo:''
            },
            preeliminar: {
                conceptos: [{
                    unidad: '',
                    descipcion: '',
                    costo: '',
                    cantidad_preliminar: 0,
                    desperdicio: '',
                    active: true,
                    cantidad: 0,
                    importe: 0,
                    id: '',
                    mensajes: { active: false, mensaje: '' },
                    unidad_id:''
                }],
                conceptosNuevos: []
            },
            solicitud: {
                proveedor: '',
                proyecto: '',
                area: '',
                subarea: '',
                empresa: '',
                descripcion: '',
                total: '',
                fecha: new Date(),
                tipoPago: 0,
                factura: 'Sin factura',
                adjuntos: {
                    adjunto: {
                        value: '',
                        placeholder: 'Presupuesto',
                        files: []
                    }
                }
            },
        },
        data: { partidas: [],subpartidas: [], conceptos: [] },
        ticket: '',
        presupuesto: '',
        modal: {
            conceptos: false,
            solicitud: false,
            solicitud_venta:false
        },
        formeditado: 0,
        key: 'nuevo',
        title:''
    }
    
    componentDidMount() {
        const { location: { state } } = this.props
        const { history } = this.props
        this.getOptionsAxios()
        if (state) {
            if (state.calidad) {
                const { calidad } = state
                if(calidad.estatus_ticket){
                    if (calidad.estatus_ticket.estatus === 'En espera') this.changeEstatusAxios({ id: calidad.id })
                    else { this.getOneTicketAxios(calidad.id) }
                }else { this.getOneTicketAxios(calidad.id) }
            } else history.push('/calidad/tickets')
        } else history.push('/calidad/tickets')
    }

    /* -------------------------------------------------------------------------- */
    /*                                ANCHOR ASYNC                                */
    /* -------------------------------------------------------------------------- */

    getOptionsAxios = async() => {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'calidad/options', { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { empleados, estatus, tiposTrabajo, proyectos, partidas, conceptos, proveedores, unidades, tiposPago, areasCompras, areasVentas } = response.data
                const { options, formularios, data, title } = this.state
                data.partidas = partidas
                let aux = {}
                conceptos.map((concepto) => { return aux[concepto.clave] = false })
                formularios.presupuesto.conceptos = aux;
                options.empleados = setOptions(empleados, 'nombre', 'id')
                options.estatus = this.setOptionsEstatus(estatus, 'estatus', 'id')
                options.tiposTrabajo = setOptions(tiposTrabajo, 'nombre', 'id')
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                options.partidas = setOptions(partidas, "nombre", "id")
                options.proveedores = setOptions(proveedores, "razon_social", "id")
                options.unidades = setOptions(unidades, 'nombre', 'id')
                options.tiposPagos = setSelectOptions(tiposPago, 'tipo')
                if(title === 'Nueva solicitud de compra' || title === 'Editar solicitud de compra'){
                    options.areas = setOptions(areasCompras, 'nombre', 'id')
                }else{
                    options.areas = setOptions(areasVentas, 'nombre', 'id')
                }
                this.setState({ ...this.state, options, data, formularios })
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
                const { options, data, formularios } = this.state
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
                formularios.ticket = this.setForm(ticket)
                this.setState({ ...this.state, ticket: ticket, formularios, options })
                if(ticket.presupuesto_preeliminar){ this.getPresupuestoAxios(ticket.presupuesto_id) }
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    cancelTicket = async(data) => {
        const { access_token } = this.props.authUser
        data.motivo = document.getElementById('motivo').value
        await axios.put(`${URL_DEV}calidad/estatus/${data.id}`, data, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { ticket } = response.data
                if (data.estatus) 
                    doneAlert('El ticket fue actualizado con éxito.')
                this.getOneTicketAxios(ticket.id)
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

    changeEstatusAxios = async(data) =>{
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}calidad/estatus/${data.id}`, data, { headers: setSingleHeader(access_token) }).then(
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

    addFotosS3 = async(arreglo, id, proyecto) => {
        let filePath = `proyecto/${proyecto}/tickets/${id}/`
        let auxPromises  = arreglo.map((file) => {
            return new Promise((resolve, reject) => {
                ReactS3Client.uploadFile(file, `${filePath}${Math.floor(Date.now() / 1000)}-${file.name}`)
                    .then((data) =>{
                        const { location,status } = data
                        if(status === 204) resolve({ name: file.name, url: location })
                        else reject(data)
                    }).catch(err => reject(err))
            })
        })
        Promise.all(auxPromises).then(values => { this.addFotosToTicket(values, id)}).catch(err => console.error(err))
    }

    addFotosToTicket = async(values, id) => {
        const { access_token } = this.props.authUser
        let form = {}
        form.archivos = values
        form.type = 'fotos'
        await axios.post(`${URL_DEV}v3/calidad/tickets/${id}/s3`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert('Fotos adjuntadas con éxito')
                this.getOneTicketAxios(id)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getPresupuestoAxios = async (id, conceptosNuevos) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}presupuestos/${id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { presupuesto } = response.data
                const { formularios } = this.state
                
                let aux = []
                presupuesto.conceptos.forEach((concepto) => {
                    let active = false
                    if (conceptosNuevos !== undefined){
                        conceptosNuevos.forEach((conceptoNuevo) => {
                            if(conceptoNuevo.id === concepto.concepto.id) {
                                active = true
                            }
                        })
                    }
                    aux.push({
                        active: concepto.active,
                        descripcion: concepto.descripcion,
                        cantidad_preliminar: concepto.cantidad_preliminar,
                        desperdicio: concepto.desperdicio,
                        cantidad: concepto.cantidad,
                        mensajes: {
                            active: active ? true : concepto.mensaje ? true : false,
                            mensaje: concepto.mensaje
                        },
                        id: concepto.id,
                        costo: concepto.costo,
                        importe: concepto.importe,
                        unidad: concepto.unidad.nombre,
                        unidad_id: concepto.unidad.id.toString()
                    })
                })
                formularios.preeliminar.conceptos = aux
                
                this.setState({ ...this.state, presupuesto: presupuesto, formularios, formeditado: 1 })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    addPresupuestosAxios = async() => {
        const { access_token } = this.props.authUser
        const { formularios, ticket } = this.state
        if(ticket.proyecto){
            formularios.presupuesto.proyecto = ticket.proyecto.id
            if(ticket.proyecto.empresa)
                formularios.presupuesto.empresa = ticket.proyecto.empresa.id
        }
        if(ticket.subarea){
            formularios.presupuesto.area = ticket.subarea.area_id
        }
        await axios.post(`${URL_DEV}presupuestos`, formularios.presupuesto, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { presupuesto } = response.data
                this.patchTicket('presupuesto', presupuesto.id)
                this.getPresupuestoAxios(presupuesto.id)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    updatePresupuestoAxios = async() => {
        const { access_token } = this.props.authUser
        const { formularios, presupuesto } = this.state
        await axios.put(`${URL_DEV}presupuestos/${presupuesto.id}`, formularios.preeliminar, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert('Presupuesto actualizado con éxito',
                    () => questionAlertY(`¡Listo!`, 
                        `${presupuesto.estatus.estatus === 'En revisión' ? '¿Deseas enviar a finanzas el presupuesto preeliminar?' 
                            : '¿Deseas enviar a compras tus volumetrías para la estimación de costos?'}`,
                        () => this.patchPresupuesto('estatus', presupuesto.estatus.estatus === 'En revisión' ? 'Utilidad' : 'Costos'),
                        () => this.getPresupuestoAxios(presupuesto.id))
                )
                
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    patchPresupuesto = async(type, value) => {
        const { access_token } = this.props.authUser
        const { presupuesto } = this.state
        waitAlert()
        await axios.patch(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}`, { type: type, value: value }, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                if(type === 'estatus')
                    doneAlert('Presupuesto actualizado con éxito', () => this.sendCorreoAxios(value))
                else
                    doneAlert('Presupuesto actualizado con éxito', () => this.getPresupuestoAxios(presupuesto.id))
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    sendCorreoAxios = async(value) => {
        const { access_token } = this.props.authUser
        const { presupuesto } = this.state
        waitAlert()
        await axios.get(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/correo?estatus=${value}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                this.getPresupuestoAxios(presupuesto.id)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteAdjuntoAxios = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { ticket } = this.state
        await axios.delete(`${URL_DEV}v3/calidad/tickets/${ticket.id}/adjuntos/${id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert('Foto eliminada con éxito')
                this.getOneTicketAxios(ticket.id)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async addSolicitudCompraAxios() {
        const { access_token } = this.props.authUser
        const { formularios } = this.state
        const data = new FormData();
        let aux = Object.keys(formularios.solicitud)
        aux.map((element) => {
            switch (element) {
                case 'fecha':
                    data.append(element, (new Date(formularios.solicitud[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                default:
                    data.append(element, formularios.solicitud[element])
                    break
            }
            return false
        })
        aux = Object.keys(formularios.solicitud.adjuntos)
        aux.map((element) => {
            if (formularios.solicitud.adjuntos[element].value !== '') {
                for (var i = 0; i < formularios.solicitud.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, formularios.solicitud.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, formularios.solicitud.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
            return false
        })
        await axios.post(URL_DEV + 'solicitud-compra', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'La solicitud fue registrada con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async editSolicitudCompraAxios() {
        const { access_token } = this.props.authUser
        const { formularios, solicitud } = this.state
        const data = new FormData();
        let aux = Object.keys(formularios.solicitud)
        aux.map((element) => {
            switch (element) {
                case 'fecha':
                    data.append(element, (new Date(formularios.solicitud[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                default:
                    data.append(element, formularios.solicitud[element])
                    break
            }
            return false
        })
        aux = Object.keys(formularios.solicitud.adjuntos)
        aux.map((element) => {
            for (var i = 0; i < formularios.solicitud.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, formularios.solicitud.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, formularios.solicitud.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
            return false
        })
        await axios.post(URL_DEV + 'solicitud-compra/update/' + solicitud.id, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'La solicitud fue editada con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    deleteSolicitud = solicitud => {
        deleteAlert('¿DESEAS ELIMINAR LA SOLICITUD DE COMPRA?', '', () => this.deleteSolicitudAxios(solicitud.id))
    }
    deleteSolicitudAxios = async(id) => {
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}solicitud-compra/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'La solicitud fue eliminada con éxito.')
                
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    /* -------------------------------------------------------------------------- */
    /*                               ANCHOR SETTERS                               */
    /* -------------------------------------------------------------------------- */
    setForm = ticket => {
        let formulario = {}
        formulario.fechaProgramada = new Date( moment(ticket.created_at) )
        formulario.empleado = ticket.tecnico_asiste
        formulario.descripcion = ticket.descripcion_solucion
        formulario.recibe = ticket.recibe
        if(ticket.subarea)
            formulario.tipo_trabajo = ticket.subarea.id.toString()
        else
            formulario.tipo_trabajo = ''
        return formulario
    }

    setOptionsEstatus = (arreglo) => {
        let aux = []
        arreglo.forEach((element) => {
            aux.push( {  name: element.estatus,  value: element.id.toString(), letra: element.letra, fondo: element.fondo } )
        });
        return aux
    }

    setOptions = (name, array) => {
        const { options } = this.state;
        options[name] = setOptions(array, "nombre", "id");
        this.setState({ ...this.state, options });
    };

    setData = (value) => {
        let { data } = this.state;
        data = value
        this.setState({ ...this.state, data });
    };

    /* -------------------------------------------------------------------------- */
    /*                                ANCHOR MODALS                               */
    /* -------------------------------------------------------------------------- */
    openModalWithInput = estatus => {
        const { ticket } = this.state
        questionAlert2('¿ESTÁS SEGURO DE RECHAZAR EL TICKET?', '¡NO PODRÁS REVERTIR ESTO!', () => this.cancelTicket({ id: ticket.id, estatus: estatus }),
            <div>
                <Form.Control placeholder='MOTIVO DE CANCELACIÓN' className="form-control form-control-solid h-auto py-7 px-6 text-uppercase"
                    id='motivo' as="textarea" rows="3" />
            </div>
        )
    }
    openModalConceptos = () => {
        const { options, modal } = this.state
        options.subpartidas = []
        modal.conceptos = true

        this.setState({
            ...this.state,
            options,
            modal,
            formularios: this.clearForm(),
            formeditado: 0
        })
    }
    handleCloseConceptos = () => {
        const { modal, options } = this.state
        options.subpartidas = []
        modal.conceptos = false
        this.setState({
            ...this.state,
            modal,
            options,
            concepto: '',
            formularios: this.clearForm()
        })
    }
    openModalSolicitud = type => {
        const { modal, formularios, ticket } = this.state
        let { title } = this.state
        switch(type){
            case 'compra':
                title = 'Nueva solicitud de compra'
                this.getOptionsAxios()
                modal.solicitud = true
                formularios.solicitud.empresa = ticket.proyecto.empresa.name
                formularios.solicitud.proyecto = ticket.proyecto.id.toString()
                break;
            case 'venta':
                title = 'Nueva solicitud de venta'
                this.getOptionsAxios()
                modal.solicitud = true
                formularios.solicitud.empresa = ticket.proyecto.empresa.name
                formularios.solicitud.proyecto = ticket.proyecto.id.toString()
                break;
            default:
                break;
        }
        this.setState({
            ...this.state,
            modal,
            formeditado: 1,
            title
        })
    }
    handleCloseSolicitud = () => {
        let { modal } = this.state
        modal.solicitud = false
        this.setState({
            ...this.state,
            modal,
            formularios:this.clearFormSolicitud()
        })
    }
    handleChange = (files, item) => {
        const { formularios } = this.state
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        formularios.solicitud['adjuntos'][item].value = files
        formularios.solicitud['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            formularios
        })
    }
    /* -------------------------------------------------------------------------- */
    /*                                CLEAR MODALS                               */
    /* -------------------------------------------------------------------------- */
    clearForm = () => {
        const { formularios } = this.state
        let aux = Object.keys(formularios.preeliminar)
        aux.map((element) => {
            if (element !== 'conceptos' && element !== 'conceptosNuevos')
                formularios.preeliminar[element] = ''
            return false
        })
        return formularios
    }
    clearFiles = (name, key) => {
        const { formularios } = this.state
        let aux = []
        for (let counter = 0; counter < formularios.solicitud['adjuntos'][name].files.length; counter++) {
            if (counter !== key) {
                aux.push(formularios.solicitud['adjuntos'][name].files[counter])
            }
        }
        if (aux.length < 1) {
            formularios.solicitud['adjuntos'][name].value = ''
        }
        formularios.solicitud['adjuntos'][name].files = aux
        this.setState({
            ...this.state,
            formularios
        })
    }
    clearFormSolicitud = () => {
        const { formularios } = this.state
        let aux = Object.keys(formularios.solicitud)
        aux.map((element) => {
            switch (element) {
                case 'tipoPago':
                    formularios.solicitud[element] = 0
                    break;
                case 'factura':
                    formularios.solicitud[element] = 'Sin factura'
                    break;
                case 'fecha':
                    formularios.solicitud[element] = new Date()
                    break;
                case 'adjuntos':
                    formularios.solicitud[element] = {
                        adjunto: {
                            value: '',
                            placeholder: 'Presupuesto',
                            files: []
                        }
                    }
                    break;
                default:
                    formularios.solicitud[element] = ''
                    break;
            }
            return false
        })
        return formularios;
    }
    openModalEditarSolicitud = (type, solicitud) => {
        const { modal } = this.state
        let { title } = this.state
        switch(type){
            case 'compra':
                title = 'Editar solicitud de compra'
                this.getOptionsAxios()
                modal.solicitud = true
                break;
            case 'venta':
                title = 'Editar solicitud de venta'
                this.getOptionsAxios()
                modal.solicitud = true
                break;
            default:
                break;
        }
        this.setState({
            ...this.state,
            modal,
            formeditado: 1,
            title
        })
    }
    /* -------------------------------------------------------------------------- */
    /*                             ANCHOR FORMULARIOS                             */
    /* -------------------------------------------------------------------------- */

    onChangeSwal = (value, tipo, form) => {
        const { formularios } = this.state
        formularios[form][tipo] = value
        this.setState({...this.state, form})
    }

    changeEstatus = estatus => {
        const { ticket, options, formularios } = this.state
        switch(estatus){
            case 'Rechazado':
                this.openModalWithInput('Rechazado');
                break;
            case 'Aceptado':
                customInputAlert(
                    <div className="row mx-0">
                        <h5 className="mb-4 font-weight-bold text-dark col-md-12 mt-4">SELECCIONA EL TIPO DE TRABAJO</h5>
                        <div className="row mx-0 col-md-12 px-0 form-group-marginless d-flex justify-content-center">
                            <div className="col-md-10">
                                <SelectSearchGray withtaglabel={0} withtextlabel={0} options={options.tiposTrabajo} 
                                    onChange={(value) => { this.onChangeSwal(value, 'tipo_trabajo', 'ticket') }} name='tipo_trabajo' 
                                    value={formularios.ticket.tipo_trabajo} customdiv="mb-2 text-left" requirevalidation={1}
                                    placeholder='TIPO DE TRABAJO' withicon={0} customclass='text-center px-2' />
                            </div>
                        </div>
                    </div>,
                    '',
                    () => { this.patchTicket('tipo_trabajo', formularios.ticket.tipo_trabajo) },
                    () => { formularios.ticket = this.setForm(ticket); this.setState({...this.state,formularios }); Swal.close(); },
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

    onSubmit = type => {
        waitAlert()
        switch(type){
            case 'presupuesto':
                this.addPresupuestosAxios()
                break;
            case 'preeliminar':
                this.updatePresupuestoAxios()
                break;
            default: break;
        }
    }
    /* ---------------------- FORMULARIO CONCEPTOS ---------------------- */
    onChangeConceptos = (e) => {
        const { name, value } = e.target;
        const { data, formularios, presupuesto } = this.state
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
                formularios.preeliminar.conceptosNuevos = []
                array.map((element, key) => {
                    formularios.preeliminar.conceptosNuevos.push(element)
                    formularios.preeliminar.conceptosNuevos[key].active = false
                    return false
                })
                break;
            default:
                break;
        }
        formularios.preeliminar[name] = value;
        this.setState({
            ...this.state,
            formularios,
            data
        });
    };

    checkButtonConceptos = (e, key) => {
        const { checked } = e.target
        const { formularios } = this.state
        formularios.preeliminar.conceptosNuevos[key].active = checked
        this.setState({
            ...this.state,
            formularios
        })
    }
    onSubmitConcept = e => {
        e.preventDefault()
        const { key, formularios } = this.state
        waitAlert()
        if (key === 'nuevo')
            this.addConceptoAxios()
        else {
            let aux = []
            formularios.preeliminar.conceptosNuevos.map((concepto) => {
                if (concepto.active)
                    aux.push(concepto)
                return false
            })
            this.addConceptoToPresupuestoAxios(aux)
        }
    }
    async addConceptoAxios() {
        const { access_token } = this.props.authUser
        const { formularios } = this.state
        await axios.post(URL_DEV + 'conceptos', formularios.preeliminar, { headers: { Authorization: `Bearer ${access_token}` } }).then(
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
                const { modal } = this.state
                this.getPresupuestoAxios(presupuesto.id, conceptos );
                doneAlert(response.data.message !== undefined ? response.data.message : 'El concepto fue agregado con éxito.')
                modal.conceptos = false
                this.setState({
                    modal
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
    
    /* ---------------------- FORMULARIO SOLICITUD ---------------------- */
    onChangeSolicitud = e => {
        const { formularios } = this.state
        const { name, value } = e.target
        formularios.solicitud[name] = value
        this.setState({
            ...this.state,
            formularios
        })
    }
    
    onSubmitSCompra = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar solicitud de compra')
            this.editSolicitudCompraAxios()
        else
            this.addSolicitudCompraAxios()
    }

    deleteFile = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', '', () => { this.deleteAdjuntoAxios(element.id) } )
    }
    /* -------------------------------------------------------------------------- */
    /*                               ANCHOR ONCLICK                               */
    /* -------------------------------------------------------------------------- */
    
    onClickVolumetrias = () => {
        const { ticket } = this.state
        if(ticket.presupuesto_id)
            this.getPresupuestoAxios(ticket.presupuesto_id)
    }

    onClick = (type) => {
        switch(type){
            case 'volumetrias':
                this.onClickVolumetrias()
                break;
            case 'enviar_compras':
                questionAlertY(`¿Deseas enviar a compras?`, 'Enviarás a compras tus volumetrías para la estimación de costos', () => this.patchPresupuesto('estatus', 'Costos'))
                break;
            case 'enviar_finanzas':
                questionAlertY(`¿Deseas enviar a finanzas?`, 'Enviarás a finanzas el presupuesto preeliminar para el cálculo de utilidad', 
                    () => this.patchPresupuesto('estatus', 'Utilidad'))
                break;
            default: break;
        }
    }
    
    controlledTab = value => {
        this.setState({
            ...this.state,
            formularios: this.clearForm(),
            key: value
        })
    }
    render() {
        const { ticket, options, formularios, presupuesto, data, modal, formeditado, key, title } = this.state
        return (
            <Layout active = 'calidad'  {...this.props}>
                <TicketView
                    /* ---------------------------------- DATOS --------------------------------- */
                    data = { ticket } options = { options } formulario = { formularios } presupuesto = { presupuesto } datos = { data }
                    /* -------------------------------- FUNCIONES ------------------------------- */
                    openModalWithInput = { this.openModalWithInput } changeEstatus = { this.changeEstatus } addingFotos = { this.addFotosS3 } 
                    onClick = { this.onClick } onChange = { this.onChangeSwal } setData = { this.setData } setOptions = { this.setOptions }
                    onSubmit = { this.onSubmit } openModalConceptos={this.openModalConceptos} deleteFile = { this.deleteFile } 
                    openModalSolicitud={this.openModalSolicitud} handleCloseSolicitud={this.handleCloseSolicitud} title={title} modal={modal} 
                    onChangeSolicitud={this.onChangeSolicitud} clearFiles = { this.clearFiles } handleChange={this.handleChange} openModalEditarSolicitud = { this.openModalEditarSolicitud} deleteSolicitud={this.deleteSolicitud}
                />
                <Modal size="xl" title='Agregar concepto' show={modal.conceptos} handleClose={this.handleCloseConceptos} >
                    <AgregarConcepto
                        options={options}
                        formeditado={formeditado}
                        form={formularios.preeliminar}
                        onChange={this.onChangeConceptos}
                        setOptions={this.setOptions}
                        checkButtonConceptos={this.checkButtonConceptos}
                        data={data}
                        onSelect={this.controlledTab}
                        activeKey={key}
                        onSubmit={this.onSubmitConcept}
                    />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(TicketDetails);