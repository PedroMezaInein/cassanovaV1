import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, S3_CONFIG } from '../../../constants'
import { setOptions, setSelectOptions } from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert, questionAlert, questionAlert2, customInputAlert, questionAlertY, deleteAlert, sendFileAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { TicketView } from '../../../components/forms'
import { Form } from 'react-bootstrap'
import { setSingleHeader, setFormHeader, toAbsoluteUrl } from '../../../functions/routers'
import { SelectSearchGray, CalendarDaySwal } from '../../../components/form-components'
import moment from 'moment'
import 'moment/locale/es'
import Swal from 'sweetalert2'
import S3 from 'react-aws-s3';
import SVG from "react-inlinesvg";
import { TagInputGray } from '../../../components/form-components'
import { Modal } from "react-bootstrap"

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
            tiposPagos: [],
            estatus_final:[
                {
                    id: 1, estatus: "Aceptado"
                },
                {
                    id: 2, estatus: "Rechazado"
                }
            ]
        },
        formularios: {
            presupuesto: { fecha: new Date(), tiempo_ejecucion: "", conceptos: {} },
            ticket: {
                fechaProgramada: new Date(),
                empleado: '',
                recibe: '',
                descripcion_solucion:'',
                motivo: '',
                costo: 0.0,
                tipo_trabajo:'',
                adjuntos: {
                    reporte_problema_reportado: {
                        value: '',
                        placeholder: 'Problema reportado',
                        files: []
                    },
                    reporte_problema_solucionado: {
                        value: '',
                        placeholder: 'Problema solucionado',
                        files: []
                    }
                },
                estatus_final:''
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
            presupuesto_generado:{
                estatus_final:'',
                fechaEvidencia: new Date(),
                adjuntoEvidencia: '',
                motivo_rechazo:'',
                correos_reporte: []
            },
            mantenimientos:{
                costo: 0.0,
                equipo: '',
                fechaMantenimiento: new Date()
            }
        },
        data: { partidas: [],subpartidas: [], conceptos: [], mantenimientos: [] },
        ticket: '',
        presupuesto: '',
        modal: {
            conceptos: false,
            solicitud: false,
            solicitud_venta:false,
            reporte:false
        },
        formeditado: 0,
        key: 'nuevo',
        title:'',
        solicitudes: [],
        activeKeyNav:'adjuntos'
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
                const { empleados, estatus, tiposTrabajo, proyectos, partidas, conceptos, proveedores, unidades, tiposPago, areasCompras, areasVentas, empresas } = response.data
                const { options, formularios, data, title, ticket } = this.state
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
                options.empresas = setOptions(empresas, 'name', 'id')
                if(title === 'Nueva solicitud de compra' || title === 'Editar solicitud de compra'){
                    options.areas = setOptions(areasCompras, 'nombre', 'id')
                }else{ 
                    options.areas = setOptions(areasVentas, 'nombre', 'id') 
                    let auxArea
                    if(ticket.subarea){
                        auxArea = options.areas.find((area) => {
                            return area.value === ticket.subarea.area_id.toString()
                        })
                        if(auxArea)
                            options.subareas = setOptions(auxArea.subareas, 'nombre', 'id')
                    }
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
                this.setState({ ...this.state, ticket: ticket, formularios, options, data })
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
                const { formularios } = this.state
                const { ticket } = response.data
                window.history.replaceState(ticket, 'calidad')
                formularios.ticket = this.setForm(ticket)
                this.setState({ ...this.state, formularios })
                if (data.estatus)
                    doneAlert('El ticket fue actualizado con éxito.')
                this.getOneTicketAxios(ticket.id)
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

    addS3Images = async(arreglo) => {
        const { ticket } = this.state
        let filePath = `proyecto/${ticket.proyecto_id}/tickets/${ticket.id}/`
        let auxPromises  = arreglo.map((file) => {
            return new Promise((resolve, reject) => {
                ReactS3Client.uploadFile(file.file, `${filePath}${file.type}/${Math.floor(Date.now() / 1000)}-${file.file.name}`)
                    .then((data) =>{
                        const { location,status } = data
                        if(status === 204) resolve({ name: file.file.name, url: location, type: file.type })
                        else reject(data)
                    }).catch(err => reject(err))
            })
        })
        Promise.all(auxPromises).then(values => { this.addImagesToReporte(values)}).catch(err => console.error(err))
    }

    addImagesToReporte = async(values) => {
        const { access_token } = this.props.authUser
        const { id } = this.state.ticket
        let form = {}
        form.archivos = values
        await axios.post(`${URL_DEV}v3/calidad/tickets/${id}/s3/reporte_fotografico`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert('Fotos adjuntadas con éxito', () => { this.saveProcesoTicketAxios() })
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
                        unidad: concepto.unidad ? concepto.unidad.nombre : '',
                        unidad_id: concepto.unidad ? concepto.unidad.id.toString() : ''
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

    getSolicitudesAxios = async(type) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { ticket } = this.state
        await axios.get(`${URL_DEV}v3/calidad/tickets/${ticket.id}/${type}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { solicitudes } = response.data
                this.setState({...this.state, solicitudes: solicitudes})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addSolicitudCompraAxios = async () => {
        const { access_token } = this.props.authUser
        const { formularios, ticket } = this.state
        const data = new FormData();
        
        let aux = Object.keys(formularios.solicitud)
        aux.forEach((element) => {
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
        })
        aux = Object.keys(formularios.solicitud.adjuntos)
        aux.forEach((element) => {
            if (formularios.solicitud.adjuntos[element].value !== '') {
                formularios.solicitud.adjuntos[element].files.forEach((file) => {
                    data.append(`files_name_${element}[]`, file.name)
                    data.append(`files_${element}[]`, file.file)
                })
                data.append('adjuntos[]', element)
            }
        })
        data.append('ticket', ticket.id)
        await axios.post(`${URL_DEV}solicitud-compra`, data, { headers: setFormHeader(access_token) }).then(
            (response) => {
                const { modal } = this.state
                modal.solicitud = false
                this.setState({...this.state, modal, formularios:this.clearFormSolicitud()})
                doneAlert(response.data.message !== undefined ? response.data.message : 'La solicitud fue registrada con éxito.',
                    () => { this.getSolicitudesAxios(`solicitud-compra`) }
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    addSolicitudVentaAxios = async () => {
        const { access_token } = this.props.authUser
        const { formularios, ticket } = this.state
        const data = new FormData();
        let aux = Object.keys(formularios.solicitud)
        aux.forEach((element) => {
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
        })
        aux = Object.keys(formularios.solicitud.adjuntos)
        aux.forEach((element) => {
            if (formularios.solicitud.adjuntos[element].value !== '') {
                formularios.solicitud.adjuntos[element].files.forEach((file) => {
                    data.append(`files_name_${element}[]`, file.name)
                    data.append(`files_${element}[]`, file.file)
                })
                data.append('adjuntos[]', element)
            }
        })
        data.append('ticket', ticket.id)
        await axios.post(`${URL_DEV}solicitud-venta`, data, { headers: setFormHeader(access_token) }).then(
            (response) => {
                const { modal } = this.state
                modal.solicitud = false
                this.setState({...this.state, modal, formularios:this.clearFormSolicitud()})
                doneAlert(response.data.message !== undefined ? response.data.message : 'La solicitud fue registrada con éxito.')
                doneAlert(response.data.message !== undefined ? response.data.message : 'La solicitud fue registrada con éxito.',
                    () => { this.getSolicitudesAxios(`solicitud-venta`) }
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    deleteSolicitudAxios = async(id, type) => {
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}solicitud-${type}/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'La solicitud fue eliminada con éxito.')
                this.getSolicitudesAxios(`solicitud-${type}`)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    async deleteMantenimientoAxios(mantenimiento) {
        const { access_token } = this.props.authUser
        const { ticket } = this.state
        //await axios.delete(`${URL_DEV}v2/calidad/tickets/${mantenimiento.id}?ticket=${ticket.id}`, { headers: setSingleHeader(access_token) }).then(
        await axios.delete(`${URL_DEV}v1/proyectos/instalacion-equipos/mantenimientos/${mantenimiento.id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { ticket } = response.data
                const { data } = this.state
                data.mantenimientos = ticket.notas
                this.setState({ ...this.state, data })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El mantenimiento fue eliminado con éxito.')
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
        const { formularios } = this.state
        let aux = []

        console.log(ticket, 'TICKET')
        if(ticket.fecha_programada)
            formularios.ticket.fechaProgramada = new Date( moment(ticket.fecha_programada) )
        else 
            formularios.ticket.fechaProgramada = new Date()
        formularios.ticket.empleado = ticket.tecnico_asiste === null || ticket.tecnico_asiste === 'null' ? '' : ticket.tecnico_asiste
        formularios.ticket.descripcion_solucion = ticket.descripcion_solucion === null || ticket.descripcion_solucion === 'null' ? '' : ticket.descripcion_solucion
        formularios.ticket.recibe = ticket.recibe === null || ticket.recibe === 'null' ? '' : ticket.recibe
        
        ticket.reporte_problema_reportado.forEach((element) => {
            aux.push({ name: element.name, url: element.url, file: '', id: element.id })
        })
        formularios.ticket.adjuntos.reporte_problema_reportado.files = aux
        aux = []

        ticket.reporte_problema_solucionado.forEach((element) => {
            aux.push({ name: element.name, url: element.url, file: '', id: element.id })
        })
        formularios.ticket.adjuntos.reporte_problema_solucionado.files = aux

        if(ticket.subarea)
            formularios.ticket.tipo_trabajo = ticket.subarea.id.toString()
        else
            formularios.ticket.tipo_trabajo = ''
        return formularios.ticket
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
                break;
            case 'venta':
                title = 'Nueva solicitud de venta'
                if(ticket.subarea)
                    formularios.solicitud.area = ticket.subarea.area_id.toString()
                    formularios.solicitud.subarea = ticket.subarea.id.toString()
                break;
            default:
                break;
        }
        modal.solicitud = true
        formularios.solicitud.empresa = ticket.proyecto.empresa.id.toString()
        formularios.solicitud.proyecto = ticket.proyecto.id.toString()
        this.setState({ ...this.state, modal, formeditado: 1, title:title })
        this.getOptionsAxios()
    }

    openModalEditarSolicitud = (type, solicitud) => {
        const { history } = this.props
        switch(type){
            case 'compra':
                history.push({ pathname: '/proyectos/solicitud-compra/edit', state: { solicitud: solicitud } });
                break;
            case 'venta':
                history.push({ pathname: '/proyectos/solicitud-venta/edit', state: { solicitud: solicitud } });
                break;
            default:
                break;
        }
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
    openModalDeleteMantenimiento = mantenimiento => {
        deleteAlert(`¿DESEAS ELIMINAR EL MANTENIMIENTO?`, '', () => this.deleteMantenimientoAxios(mantenimiento))
    }
    openAlertChangeStatusP = (estatus, presupuesto) => {
        const { formularios, ticket } = this.state;
        switch(estatus){
            case 'Rechazado':
                customInputAlert(
                    <div>
                        <h5 className="mb-2 font-weight-bold text-dark col-md-12">ESCRIBE EL MOTIVO DE RECHAZO</h5>
                        <div className="mx-auto col-md-11 mt-5">
                            <form id='sendStatusForm' name='sendStatusForm'>
                                <div id='customInputRechazado'>
                                    <Form.Control
                                        placeholder='MOTIVO DE RECHAZO'
                                        className="form-control form-control-solid p-3 text-uppercase"
                                        id='motivo_rechazo'
                                        as="textarea"
                                        rows="3"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>,
                    '',
                    (e) => { this.updateStatus(estatus) },
                    () => { formularios.ticket = this.setForm(ticket); this.setState({...this.state,formularios }); Swal.close(); }
                )
                break;
            case 'Aceptado':
                customInputAlert(
                    <div>
                        <h5 className="mb-2 font-weight-bold text-dark col-md-12">INGRESA LOS SIGUIENTES DATOS</h5>
                        <div className="mx-auto col-md-11 mt-6 text-break">
                            <form id='sendStatusForm' name='sendStatusForm'>
                                <div id='customInputAceptado'>
                                    <label htmlFor="adjunto_evidencia" className="drop-files">
                                        <span className="svg-icon svg-icon-2x svg-icon-primary">
                                            <SVG src={toAbsoluteUrl('/images/svg/Uploaded-file.svg')}/>
                                        </span>
                                        <input
                                            id="adjunto_evidencia"
                                            type="file"
                                            onChange={(e) => {this.onChangeSwal(e.target.files[0], 'adjuntoEvidencia', 'presupuesto_generado'); this.changeNameFile()}}
                                            name='adjunto_evidencia'
                                            accept="image/*, application/pdf"
                                        />
                                        <div className="font-weight-bolder font-size-md ml-2" id="info">Subir evidencia</div>
                                    </label>
                                    <div className="mt-6">
                                        <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                            <label className="text-center font-weight-bolder">Fecha de entrega</label>
                                        </div>
                                        <CalendarDaySwal value = { formularios.presupuesto_generado.fechaEvidencia } onChange = { (e) => {  this.onChangeSwal(e.target.value, 'fechaEvidencia', 'presupuesto_generado' )} } name = { 'fechaEvidencia' } 
                                        date = { formularios.presupuesto_generado.fechaEvidencia } withformgroup={0} />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>,
                    '',
                    () => { this.updateStatus(estatus) },
                    () => { formularios.ticket = this.setForm(ticket); this.setState({...this.state,formularios }); Swal.close(); },
                )
                break;
            default: break;
        }
    }
    openModalReporte = () => {
        const { modal } = this.state
        modal.reporte = true
        this.setState({ ...this.state, modal })
    }
    updateStatus = async (estatus) => {
        const { presupuesto, ticket } = this.state
        let { formularios } = this.state
        const { access_token } = this.props.authUser
        if(estatus === 'Rechazado'){
            formularios.presupuesto_generado.estatus_final=estatus
            let motivo = document.sendStatusForm.motivo_rechazo.value
            formularios.presupuesto_generado.motivo_rechazo = motivo
        }else{
            formularios.presupuesto_generado.estatus_final=estatus
        }
        let data = new FormData()
        Object.keys(formularios['presupuesto_generado']).map((element) => {
            if(element === 'fechaEvidencia'){
                data.append(element, (new Date(formularios['presupuesto_generado'][element])).toDateString())
            }else{
                data.append(element, formularios['presupuesto_generado'][element])
            }
            
        })
        Swal.close()
        await axios.post(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/estatus?_method=PUT`, data, 
            { headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert('El estatus fue actualizado con éxito.')
                this.getOneTicketAxios(ticket.id)
            },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    changeNameFile(){
        var pdrs = document.getElementById('adjunto_evidencia').files[0].name;
        document.getElementById('info').innerHTML = pdrs;
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
        this.addSolicitudCompraAxios()
    }
    
    onSubmitSVenta = e => {
        e.preventDefault()
        this.addSolicitudVentaAxios()
    }
    onChangeAdjunto = valor => {
        let tipo = valor.target.id
        sendFileAlert( valor, (success) => { this.addAdjuntoAxios(success, tipo);})
    }
    
    async addAdjuntoAxios(valor, tipo) {
        waitAlert()
        const { name, file } = valor.target
        const { access_token } = this.props.authUser
        const { presupuesto } = this.state
        let data = new FormData();
        if(file){
            data.append(`file`, file)
            await axios.post(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/adjuntos/${name}/adjuntar?tipo=${tipo}`, data, { headers: setFormHeader(access_token) }).then(
                (response) => {
                    doneAlert(response.data.message !== undefined ? response.data.message : 'El adjunto fue registrado con éxito.')
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.log(error, 'error')
            })
        }else{ errorAlert('Adjunta solo un archivo') }
    }
    
    /* ---------------------- FORMULARIO TICKET EN PROCESO ---------------------- */
    onChangeTicketProceso = e => {
        const { name, value } = e.target
        const { formularios } = this.state
        formularios.ticket[name] = value
        this.setState({ ...this.state, formularios })
    }
    onSubmitTicketProceso = e => {
        e.preventDefault();
        const { adjuntos } = this.state.formularios.ticket
        let aux = []
        adjuntos.reporte_problema_reportado.files.forEach((file) => {
            if(file.id === undefined)
                aux.push({'file': file.file, type: 'reportado'})
        })
        adjuntos.reporte_problema_solucionado.files.forEach((file) => {
            if(file.id === undefined)
                aux.push({'file': file.file, type: 'solucionado'})
        })
        if(aux.length > 0 ){
            this.addS3Images(aux)
        }else{
            this.saveProcesoTicketAxios()
        }
        
        console.log(aux, 'aux')
    }
    handleChangeTicketProceso = (files, item) => {
        this.onChangeAdjuntoTicketProceso({ target: { name: item, value: files, files: files } })
    }
    onChangeAdjuntoTicketProceso = e => {
        const { formularios } = this.state
        const { files, value, name } = e.target
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push( { name: files[counter].name, file: files[counter], url: URL.createObjectURL(files[counter]), key: counter } )
        }
        formularios.ticket['adjuntos'][name].value = value
        formularios.ticket['adjuntos'][name].files = aux
        this.setState({ ...this.state, formularios })
    }
    generateEmailTicketProceso = value => {
        const { adjuntos } = this.state.formularios.ticket
        let aux = []
        adjuntos.reporte_problema_reportado.files.forEach((file) => {
            if(file.id === undefined)
                aux.push({'file': file.file, type: 'reportado'})
        })
        adjuntos.reporte_problema_solucionado.files.forEach((file) => {
            if(file.id === undefined)
                aux.push({'file': file.file, type: 'solucionado'})
        })
        if(aux.length > 0 ){
            this.addS3Images(aux)
        }
        console.log(aux, 'aux')
        this.saveProcesoTicketAxios(value) 
    }

    generarReporteFotografico = () => {
        const { ticket, formularios } = this.state
        questionAlertY('¿DESEAS GENERAR EL REPORTE?',
            'GENERARÁS UN PDF CON LAS FOTOGRAFÍAS DEL PROBLEMA REPORTADO Y SOLUCIONADO',
            () => this.generarReporteFotograficoAxios(),
            () => { formularios.ticket = this.setForm(ticket); this.setState({ ...this.state, formularios }); Swal.close(); },
        )
    }
    saveProcesoTicketAxios = async(email) =>{
        waitAlert()
        const { access_token } = this.props.authUser
        const { ticket, formularios } = this.state
        await axios.put(`${URL_DEV}v3/calidad/tickets/${ticket.id}/proceso`, formularios.ticket, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                if(email)
                    this.generarReporteFotograficoAxios()
                else
                    doneAlert('Presupuesto adjuntado con éxito.', () => this.generarReporteFotografico())
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    generarReporteFotograficoAxios = async() => {
        const { access_token } = this.props.authUser
        const { ticket, formularios } = this.state
        waitAlert()
        await axios.put(`${URL_DEV}v3/calidad/tickets/${ticket.id}/reporte`, formularios.ticket, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { ticket } = response.data
                doneAlert('PDF GENERADO CON ÉXITO')
                window.open(ticket.reporte_url, '_blank').focus();
                this.getOneTicketAxios(ticket.id)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    /* ---------------------- FORMULARIO MANTENIMIENTO CORRECTIVO ---------------------- */
    onChangeMantenimientos = e => {
        const { name, value } = e.target
        const { formularios } = this.state
        formularios.mantenimientos[name] = value
        this.setState({ ...this.state, formularios })
    }
    onSubmitMantenimiento = async(e) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { ticket, formularios, data } = this.state
        await axios.post(`${URL_DEV}v2/calidad/tickets/${ticket.id}/mantenimiento`, formularios.mantenimientos, { headers: setSingleHeader(access_token) }).then(
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
            case 'solicitud-venta':
            case 'solicitud-compra':
                this.getSolicitudesAxios(type);
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
    controlledNav = value => {
        this.setState({
            ...this.state,
            activeKeyNav: value
        })
    }
    handleCloseModalReporte = () => {
        const { formularios, modal } = this.state
        formularios.presupuesto_generado.correos_reporte = []
        modal.reporte = false
        this.setState({...this.state, modal, formularios })
    }
    tagInputChange = (nuevosCorreos) => {
        const { formularios } = this.state 
        let unico = {};
        nuevosCorreos.forEach(function (i) {
            if (!unico[i]) { unico[i] = true }
        })
        formularios.presupuesto_generado.correos_reporte = nuevosCorreos ? Object.keys(unico) : [];
        this.setState({ ...this.state, formularios })
    }
    sendMail = async () => {
        waitAlert();
        const { access_token } = this.props.authUser
        const { formularios, ticket } = this.state
        formularios.presupuesto_generado.presupuestoAdjunto = ticket.reporte_url
        await axios.post(`${URL_DEV}v2/calidad/tickets/${ticket.id}/correo`, formularios.presupuesto_generado, { headers: setSingleHeader(access_token) }).then(
            (response) => { 
                doneAlert('Correo enviado con éxito', () => { this.handleCloseModalReporte() } ) 
            },  (error) => { this.handleCloseModalReporte(); printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    render() {
        const { ticket, options, formularios, presupuesto, data, modal, formeditado, key, title, solicitudes, activeKeyNav } = this.state
        return (
            <Layout active = 'calidad'  {...this.props}>
                <TicketView
                    /* ---------------------------------- DATOS --------------------------------- */
                    data = { ticket } options = { options } formulario = { formularios } presupuesto = { presupuesto } datos = { data }
                    solicitudes = { solicitudes }
                    /* -------------------------------- FUNCIONES ------------------------------- */
                    openModalWithInput = { this.openModalWithInput } changeEstatus = { this.changeEstatus } addingFotos = { this.addFotosS3 } 
                    onClick = { this.onClick } onChange = { this.onChangeSwal } setData = { this.setData } setOptions = { this.setOptions }
                    onSubmit = { this.onSubmit } openModalConceptos={this.openModalConceptos} deleteFile = { this.deleteFile } 
                    openModalSolicitud={this.openModalSolicitud} handleCloseSolicitud={this.handleCloseSolicitud} title={title} modal={modal} formeditado={formeditado}
                    onChangeSolicitud={this.onChangeSolicitud} clearFiles = { this.clearFiles } handleChange={this.handleChange} openModalEditarSolicitud = { this.openModalEditarSolicitud}
                    deleteSolicitud={this.deleteSolicitud} onSubmitSCompra={this.onSubmitSCompra} onSubmitSVenta={this.onSubmitSVenta} onChangeAdjunto={this.onChangeAdjunto}
                    onChangeTicketProceso={this.onChangeTicketProceso} onSubmitTicketProceso={this.onSubmitTicketProceso} handleChangeTicketProceso={this.handleChangeTicketProceso}
                    generateEmailTicketProceso={this.generateEmailTicketProceso} generarReporteFotografico={this.generarReporteFotografico} onChangeMantenimientos={this.onChangeMantenimientos}
                    onSubmitMantenimiento={this.onSubmitMantenimiento} openModalDeleteMantenimiento={this.openModalDeleteMantenimiento} controlledNav={this.controlledNav} activeKeyNav={activeKeyNav}
                    openAlertChangeStatusP={this.openAlertChangeStatusP}  onChangeConceptos = { this.onChangeConceptos } checkButtonConceptos = { this.checkButtonConceptos } controlledTab={this.controlledTab}
                    key={key} onSubmitConcept = { this.onSubmitConcept } handleCloseConceptos={this.handleCloseConceptos} openModalReporte={this.openModalReporte}
                />
                <Modal show = { modal.reporte } onHide = { this.handleCloseModalReporte } centered contentClassName = 'swal2-popup d-flex' >
                    <Modal.Header className = 'border-0 justify-content-center swal2-title text-center font-size-h4'>¿DESEAS ENVIAR EL REPORTE?</Modal.Header>
                    <Modal.Body className = 'p-0'>
                        <div className = 'row mx-0 justify-content-center'>
                            <div className="col-md-12 text-center py-2">
                                <div>
                                    {
                                        ticket.reporte_url !== undefined ?
                                                <a className="font-weight-bold text-hover-success text-primary" target= '_blank' rel="noreferrer" href = {ticket.reporte_url}>
                                                REPORTE GENERADO
                                            </a>
                                        : <></>
                                    }
                                </div>
                            </div>
                            <div className="col-md-11 font-weight-light mt-5 text-justify">
                                Si deseas enviar el reporte fotográfico agrega el o los correos del destinatario, de lo contario da clic en <span className="font-weight-bold">cancelar</span>.
                            </div>
                            <div className="col-md-11 mt-5">
                                <div>
                                    <TagInputGray swal = { true } tags = { formularios.presupuesto_generado.correos_reporte } placeholder = "CORREO(S)" iconclass = "flaticon-email" 
                                        uppercase = { false } onChange = { this.tagInputChange } /> 
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className = 'border-0 justify-content-center'>
                        <button type="button" class="swal2-cancel btn-light-gray-sweetalert2 swal2-styled d-flex" onClick = { this.handleCloseModalReporte }>CANCELAR</button>
                        <button type="button" class="swal2-confirm btn-light-success-sweetalert2 swal2-styled d-flex" onClick = { this.sendMail } >SI, ENVIAR</button>
                    </Modal.Footer>
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(TicketDetails);