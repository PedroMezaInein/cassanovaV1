import React, { Component } from 'react'
import { connect } from 'react-redux'
import { renderToString } from "react-dom/server";
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { setOptions, setSelectOptions, setAdjuntosList, setTextTableCenter } from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert, questionAlert, questionAlert2, customInputAlert, questionAlertY, deleteAlert, validateAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { PresupuestoGeneradoNoCrm, TicketView } from '../../../components/forms'
import { Form } from 'react-bootstrap'
import { setSingleHeader, setFormHeader } from '../../../functions/routers'
import { SelectSearchGray, CalendarDaySwal, InputGray } from '../../../components/form-components'
import moment from 'moment'
import 'moment/locale/es'
import Swal from 'sweetalert2'
import S3 from 'react-aws-s3';
import { CreatableMultiselectGray } from '../../../components/form-components'
import { Modal } from "react-bootstrap"
import { Modal as CustomModal } from '../../../components/singles'
import { save, deleteForm } from '../../../redux/reducers/formulario'
class TicketDetails extends Component {

    state = {
        options: { 
            metodosPago: [],
            formasPago: [],
            estatusFacturas: [],
            tiposPagos: [],
            tiposPagosFactura:[],
            conceptos: [],
            clientes:[],
            cuentas:[],
            tiposImpuestos:[],
            estatusCompras:[],
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
            estatus_final:[
                {
                    id: 1, estatus: "Aceptado"
                },
                {
                    id: 2, estatus: "Rechazado"
                }
            ],
            correos_clientes:[],
        },
        formularios: {
            presupuesto: { tiempo_ejecucion: "", conceptos: {} },
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
                        placeholder: 'Peticiones',
                        files: []
                    },
                    reporte_problema_solucionado: {
                        value: '',
                        placeholder: 'Trabajos realizados',
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
                    unidad_id:'',
                    bg_cantidad:true,
                    vicio_oculto:false
                }],
                conceptosNuevos: []
            },
            presupuesto_generado:{
                estatus_final:'',
                fechaEvidencia: new Date(),
                adjuntoEvidencia: '',
                motivo_rechazo:'',
                correos_reporte: [],
                ordenCompra:''
            },
            orden_compra:{
                adjunto: '',
                numero_orden:''
            },
            mantenimientos:{
                costo: 0.0,
                equipo: '',
                fechaMantenimiento: new Date()
            },
            conceptos:[{
                area: '', subarea: '', descripcion: '', notas:''
            }]
        },
        data: { partidas: [],subpartidas: [], conceptos: [], mantenimientos: [], adjuntos: [] },
        ticket: '',
        presupuesto: '',
        modal: { conceptos: false, solicitud: false, solicitud_venta:false, reporte:false, pdfs: false, orden_compra:false, historial: false },
        formeditado: 0,
        key: 'nuevo',
        title:'',
        solicitudes: [],
        activeKeyNav:'adjuntos',
        aux_estatus: {
            espera: false,
            revision: false,
            rechazado: false,
            aceptado: false,
            aprobacion: false,
            proceso: false,
            pendiente:false,
            terminado: false
        },
        aux_presupuestos: {
            conceptos: false,
            volumetrias: false,
            costos: false,
            revision:false,
            utilidad: false,
            espera: false,
            aceptado: false,
            rechazado: false,
        },
        defaultNavTabs:'',
        adjuntos: [],
        adjunto: null
    }
    
    componentDidMount() {
        const { location: { state } } = this.props
        const { history } = this.props
        this.getOptionsAxios()
        if (state) {
            if (state.calidad) {
                const { calidad } = state
                this.setNavTabs(calidad.estatus.estatus)
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
        waitAlert()
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
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
                this.setState({ticket: ticket, formularios, options, data })
                this.showStatusTickets(ticket)
                if(ticket.presupuesto_preeliminar){ this.getPresupuestoAxios(ticket.presupuesto_id) }
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
                let { defaultNavTabs } = this.state
                defaultNavTabs = 'adjuntos'
                this.setState({ defaultNavTabs })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
                if(type === 'tipo_trabajo'){
                    let { defaultNavTabs } = this.state
                    defaultNavTabs = 'adjuntos'
                    this.setState({ defaultNavTabs })
                }
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
            console.error(error, 'error')
        })
    }

    addFotosS3 = async(arreglo, id, proyecto) => {
        let filePath = `proyecto/${proyecto}/tickets/${id}/`
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v1/constant/admin-proyectos`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { alma } = response.data
                let auxPromises  = arreglo.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file, `${filePath}${Math.floor(Date.now() / 1000)}-${file.name}`)
                            .then((data) =>{
                                const { location,status } = data
                                if(status === 204) resolve({ name: file.name, url: location })
                                else reject(data)
                            }).catch(err => reject(err))
                    })
                })
                Promise.all(auxPromises).then(values => { this.addFotosToTicket(values, id)}).catch(err => console.error(err))
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
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
            console.error(error, 'error')
        })
    }

    addS3Images = async(arreglo, flag) => {
        waitAlert()
        const { ticket } = this.state
        let filePath = `proyecto/${ticket.proyecto_id}/tickets/${ticket.id}/`
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v1/constant/admin-proyectos`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { alma } = response.data
                let auxPromises  = arreglo.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file.file, `${filePath}${file.type}/${Math.floor(Date.now() / 1000)}-${file.file.name}`)
                            .then((data) =>{
                                const { location,status } = data
                                if(status === 204) resolve({ name: file.file.name, url: location, type: file.type })
                                else reject(data)
                            }).catch(err => reject(err))
                    })
                })
                Promise.all(auxPromises).then(values => { this.addImagesToReporte(values, flag)}).catch(err => console.error(err))
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    addImagesToReporte = async(values, flag) => {
        const { access_token } = this.props.authUser
        const { id } = this.state.ticket
        let form = {}
        form.archivos = values
        await axios.post(`${URL_DEV}v3/calidad/tickets/${id}/s3/reporte_fotografico`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert('Fotos adjuntadas con éxito', () => { this.saveProcesoTicketAxios(flag) })
                /* this.getOneTicketAxios(id) */
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
                if(presupuesto.conceptos.length === 0){
                    formularios.conceptos = [{area: '', subarea: '', descripcion: ''}]
                }else{ formularios.conceptos = [] }
                presupuesto.conceptos.forEach((concepto) => {
                    let objeto = { area: '', subarea: '', descripcion: ''}
                    objeto.descripcion = concepto.descripcion
                    objeto.concepto = concepto
                    if(concepto.concepto)
                        if(concepto.concepto.subpartida)
                            if(concepto.concepto.subpartida.partida)
                                if(concepto.concepto.subpartida.partida.areas)
                                    if(concepto.concepto.subpartida.partida.areas.length){
                                        if(concepto.concepto.subpartida.partida.areas.length === 1)
                                            objeto.area = concepto.concepto.subpartida.partida.areas[0].id.toString()
                                    }
                    formularios.conceptos.push(objeto)
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
                        unidad_id: concepto.unidad ? concepto.unidad.id.toString() : '',
                        bg_cantidad:true,
                        vicio_oculto:concepto.vicio_oculto ? true : false
                    })
                })
                formularios.preeliminar.conceptos = aux
                this.showStatusPresupuestos(presupuesto)
                this.setState({ ...this.state, presupuesto: presupuesto, formularios, formeditado: 1 })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
            console.error(error, 'error')
        })
    }

    updatePresupuestoAxios = async(  ) => {
        const { access_token } = this.props.authUser
        const { formularios, presupuesto } = this.state
        await axios.put(`${URL_DEV}presupuestos/${presupuesto.id}`, formularios.preeliminar, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { nombre } = this.state.ticket.subarea
                if(nombre === 'VICIOS OCULTOS'){
                    questionAlertY(`¡Presupuesto actualizado con éxito!`, `¿Deseas generar el PDF?`,
                        () => this.onClick('generar-presupuesto'),
                        () => this.getPresupuestoAxios(presupuesto.id))
                }else{
                    if(presupuesto.estatus){
                        switch(presupuesto.estatus.estatus){
                            case 'En revisión':
                                questionAlert2(
                                    '¿DÓNDE DESEAS ENVIAR EL PRESUPUESTO?',
                                    'Si aún no deseas enviar, solamente cierra',
                                    () => { this.onSubmitUpdatePresupueso() },
                                    <form id = 'updatePresupuestoForm' name = 'updatePresupuestoForm' >
                                        <Form.Check inline type="radio" label="COMPRAS" name="sendPresupuesto" className="px-0 mb-2" value = 'costos'/>
                                        <Form.Check inline type="radio" label="FINANZAS" name="sendPresupuesto" className="px-0 mb-2" value = 'finanzas'/>
                                    </form>,
                                    () => { this.patchPresupuesto('estatus', 'En revisión') }
                                )
                                break;
                            default:
                                doneAlert('Presupuesto actualizado con éxito',
                                    () => questionAlertY(`¡Listo!`, 
                                        `${presupuesto.estatus.estatus === 'En revisión' ? '¿Deseas enviar a finanzas el presupuesto preeliminar?' 
                                            : '¿Deseas enviar a compras tus volumetrías para la estimación de costos?'}`,
                                        () => this.patchPresupuesto('estatus', presupuesto.estatus.estatus === 'En revisión' ? 'Utilidad' : 'Costos'),
                                        () => this.getPresupuestoAxios(presupuesto.id))
                                )
                                break;
                        }
                    }
                }
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
            console.error(error, 'error')
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
            console.error(error, 'error')
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
            console.error(error, 'error')
        })
    }

    getSolicitudesAxios = async(type) => {
        /* -------------------------------------------------------------------------- */
        /*                  ANCHOR GET SOLICITUDES DE COMPRA Y VENTA.                 */
        /* -------------------------------------------------------------------------- */
        waitAlert()
        const { access_token } = this.props.authUser
        const { ticket } = this.state
        await axios.get(`${URL_DEV}v3/calidad/tickets/${ticket.id}/${type}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { formularios, options } = this.state
                const { solicitudes, metodosPago, formasPago, estatusFacturas, tiposPago, cuentas, tiposImpuestos, estatusCompras, clientes } = response.data
                if(type === 'facturacion'){
                    options.metodosPago = setOptions(metodosPago, 'nombre', 'id')
                    options.formasPago = setOptions(formasPago, 'nombre', 'id')
                    options.estatusFacturas = setOptions(estatusFacturas, 'estatus', 'id')
                    options.tiposPagosFactura = setOptions(tiposPago, 'tipo', 'id')
                    // options.conceptos = setOptions(conceptos, 'concepto', 'id')
                    options.cuentas = setOptions(cuentas, 'nombre', 'id')
                    options.cuentas = setOptions(cuentas, 'nombre', 'id')
                    options.tiposImpuestos = setOptions(tiposImpuestos, 'tipo', 'id')
                    options.estatusCompras = setOptions(estatusCompras, 'estatus', 'id')
                    //
                    let aux = []
                    clientes.forEach((cliente) => {
                        aux.push({
                            name: cliente.empresa,
                            value: cliente.id.toString(),
                            rfc: cliente.rfc
                        })
                    })
                    options.clientes = aux
                }
                this.setState({...this.state, solicitudes: solicitudes, formularios, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deleteSolicitud = async(id, type) => {
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}solicitud-${type}/${id}`, { headers: setFormHeader(access_token) }).then(
            (response) => {
                doneAlert('Solicitud eliminada con éxito.', () => { this.getSolicitudesAxios(`solicitud-${type}`) } )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    submitSolicitudesCompras = async() => {
        const { access_token } = this.props.authUser
        const { formularios, ticket } = this.state
        await axios.post(`${URL_DEV}v3/calidad/tickets/${ticket.id}/solicitud-compra`, { solicitudes: formularios.conceptos }, 
            { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { modal, formularios } = this.state
                modal.solicitud = false
                formularios.conceptos = this.clearFormConceptos()
                this.setState({...this.state, modal, formularios})
                doneAlert(response.data.message !== undefined ? response.data.message : 'La solicitud fue registrada con éxito.',
                    () => { this.getSolicitudesAxios(`solicitud-compra`) }
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deleteSolicitudAxios = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { ticket } = this.state
        await axios.delete(`${URL_DEV}v3/calidad/tickets/${ticket.id}/solicitud-factura/${id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert(`Solicitud eliminada con éxito`, () => { this.getSolicitudesAxios('facturacion') } )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    addVentaAxios = async(id, form) => {
        waitAlert()
    }

    addSolicitudFacturaAxios = async(formulario) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { ticket } = this.state
        await axios.post(`${URL_DEV}v3/calidad/tickets/${ticket.id}/solicitud-factura`, formulario, 
            { headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert(`Solicitud generada con éxito`, () => { this.getSolicitudesAxios('facturacion') } )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    async deleteMantenimientoAxios(mantenimiento) {
        const { access_token } = this.props.authUser
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
            console.error(error, 'error')
        })
    }

    generarPDFAxios = async() =>{
        waitAlert()
        const { access_token } = this.props.authUser
        const { presupuesto } = this.state
        await axios.get(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/pdf`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { adjunto, presupuesto: pres } = response.data
                this.getPresupuestoAxios(pres.id)
                const { form, presupuesto, options } = this.state
                var win = window.open(adjunto.url, '_blank');
                if (win) {
                    win.focus();
                }
                Swal.close()
                this.onClick('mostrar-presupuestos')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    /* -------------------------------------------------------------------------- */
    /*                               ANCHOR SETTERS                               */
    /* -------------------------------------------------------------------------- */
    setForm = ticket => {
        const { formularios } = this.state
        let aux = []
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
    
    openModalSolicitud = () => {
        /* -------------------------------------------------------------------------- */
        /*                           ANCHOR MODAL SOLICITUD                           */
        /* -------------------------------------------------------------------------- */
        const { modal, formularios } = this.state
        let { title } = this.state
        title = 'Nueva solicitud de compra'
        formularios.conceptos = this.clearFormConceptos()
        modal.solicitud = true
        this.setState({ ...this.state, modal, formeditado: 1, title:title, formularios })
        this.getOptionsAxios()
    }

    handleCloseSolicitud = () => {
        let { modal } = this.state
        modal.solicitud = false
        this.setState({
            ...this.state,
            modal
        })
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
                                        className="form-control form-control-solid p-3 text-uppercase text-justify"
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
                        <h5 className="mb-2 font-weight-bold text-dark col-md-12">¿El presupuesto fue aceptado?</h5>
                        <div className="mt-7 text-underline-position col-md-10 mx-auto">
                            <span className="font-weight-bold">Nota:</span> La fecha y la evidencia del visto bueno son datos <span className="font-weight-bolder"><u className="bg-danger-o-30 text-danger px-1">requeridos</u></span>.
                        </div>
                        <div className="mx-auto col-md-11 text-break">
                            <form id='sendStatusForm' name='sendStatusForm'>
                                <div id='customInputAceptado'>
                                    <div className="form-group row form-group-marginless mb-0">
                                        <div className="mt-6 col-md-12">
                                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                                <label className="text-center font-weight-bolder">Fecha de visto bueno</label>
                                            </div>
                                            <CalendarDaySwal value={formularios.presupuesto_generado.fechaEvidencia} onChange={(e) => { this.onChangeSwal(e.target.value, 'fechaEvidencia', 'presupuesto_generado') }} name={'fechaEvidencia'}
                                                date={formularios.presupuesto_generado.fechaEvidencia} withformgroup={0} />
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-marginless mt-5 mb-0">
                                        <div className="col-md-12">
                                            <label htmlFor="adjunto_evidencia" className="drop-files">
                                                <i className="las la-file-pdf icon-xl text-primary"></i>
                                                <input
                                                    id="adjunto_evidencia"
                                                    type="file"
                                                    onChange={(e) => { this.onChangeSwal(e.target.files[0], 'adjuntoEvidencia', 'presupuesto_generado'); this.changeNameFile('adjunto_evidencia') }}
                                                    name='adjunto_evidencia'
                                                    accept="application/pdf"
                                                />
                                                <div className="font-weight-bolder font-size-md ml-2" id="info">Subir evidencia (PDF)</div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="separator separator-dashed mt-5 mb-2"></div>
                                    <div className="form-group row form-group-marginless mb-1">
                                        <div className="col-md-12 text-justify">
                                            <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} iconclass='las la-hashtag icon-xl'
                                                requirevalidation={0} value={formularios.presupuesto_generado.ordenCompra} name={'orden_compra'}
                                                onChange={(e) => { this.onChangeSwal(e.target.value, 'orden_compra', 'presupuesto_generado') }}
                                                swal={true} placeholder='NÚMERO DE ORDEN DE COMPRA'
                                            />
                                        </div>
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
        const { modal, formularios, presupuesto, options } = this.state
        const { user } = this.props.authUser
        modal.reporte = true
        
        formularios.presupuesto_generado.correos_reporte = []
        let aux_contactos = [];
        if (user.email) {
            formularios.presupuesto_generado.correos_reporte.push({ value: user.email, label: user.email })
            aux_contactos.push({
                value: user.email,
                label: user.email
            })
        }
        options.correos_clientes = []
        presupuesto.proyecto.contactos.forEach(contacto => {
            aux_contactos.push({
                value: contacto.correo.toLowerCase(),
                label: contacto.correo.toLowerCase()
            })
            return ''
        })
        options.correos_clientes = aux_contactos
        this.setState({ ...this.state, modal, formularios, options })
    }
    openModalOrdenCompra = () => {
        const { modal } = this.state
        modal.orden_compra = true
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
        Object.keys(formularios['presupuesto_generado']).forEach((element) => {
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
                let { defaultNavTabs } = this.state
                defaultNavTabs = 'solicitud-compra'
                this.setState({ defaultNavTabs })
            },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    changeNameFile(id){
        var pdrs = document.getElementById(id).files[0].name;
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
    clearFormConceptos = () => {
        const { presupuesto } = this.state
        let aux = presupuesto.conceptos
        aux.sort(function (a, b) {
            if(a.concepto === null)
                return 0;
            if(b.concepto === null)
                return -1;
            if(a.concepto.partidaId > b.concepto.partidaId){
                return 1;
            }
            if(a.concepto.partidaId < b.concepto.partidaId){
                return -1;
            }
            return 0;
        });
        let aux2 = [];
        aux.forEach((element) => {
            if(element.active){
                if(element.concepto.partidaId){
                    let finding = aux2.find((elemento) => {
                        return elemento.partidaId === element.concepto.partidaId
                    })
                    if(finding){ 
                        finding.conceptos.push(element) 
                        finding.descripcion = finding.descripcion + "\n\n" + element.descripcion
                        finding.form.push(
                            {
                                area: element.concepto.subpartida.partida.areas[0].id.toString(),
                                subarea: '', 
                                descripcion: element.descripcion, 
                                concepto: element,
                                notas: ''
                            }
                        )
                    }
                    else{
                        let objeto = { 
                            area: element.concepto.subpartida.partida.areas[0].id.toString(),
                            subarea: '', 
                            descripcion: element.descripcion, 
                            conceptos: [], 
                            partidaId: element.concepto.partidaId,
                            concepto: element,
                            partida: element.concepto.subpartida.partida.nombre,
                            join: true,
                            notas: '',
                            form: [{
                                area: element.concepto.subpartida.partida.areas[0].id.toString(),
                                subarea: '', 
                                descripcion: element.descripcion,
                                concepto: element,
                                notas: ''
                            }]
                        }
                        objeto.conceptos.push(element) 
                        aux2.push(objeto)
                    }
                    
                }
            }
        })
        return aux2
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
            case 'Aprobación pendiente':
                questionAlert('¿ESTÁS SEGURO?', 'ESTARÁ EL TICKET EN APROBACIÓN PENDIENTE ¡NO PODRÁS REVERTIR ESTO!',  () => this.changeEstatusAxios({ id: ticket.id, estatus: estatus }))
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
            case 'vicio-oculto':
                this.updatePresupuestoAxios()
                break;
            default: break;
        }
    }
    onSubmitUpdatePresupueso = async (e) => {
        let valueCheck = document.updatePresupuestoForm.sendPresupuesto.value;
        switch(valueCheck){
            case 'costos':
                this.patchPresupuesto('estatus', 'Costos')
                break;
            case 'finanzas':
                this.patchPresupuesto('estatus', 'Utilidad')
                break;
            default:
                this.patchPresupuesto('estatus', 'En revisión')
                break;
        }
    }

    onChangeSolicitudCompra = (value, name, index) => {
        let { formularios } = this.state
        formularios.conceptos[index][name] = value
        this.setState({ ...this.state, formularios })
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
            console.error(error, 'error')
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
            console.error(error, 'error')
        })
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
            this.addS3Images(aux, false)
        }else{
            this.saveProcesoTicketAxios( false )
        }
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

    generateEmailTicketProceso = () => {
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
            this.addS3Images(aux, true)
        }else{
            this.saveProcesoTicketAxios( true ) 
        }
    }

    generarReporteFotografico = () => {
        const { ticket, formularios } = this.state
        questionAlertY('¿DESEAS GENERAR EL REPORTE?',
            'GENERARÁS UN PDF CON LAS FOTOGRAFÍAS DE LAS PETICIONES Y LOS TRABAJOS REALIZADOS',
            () => this.generarReporteFotograficoAxios(),
            () => { formularios.ticket = this.setForm(ticket); this.setState({ ...this.state, formularios }); Swal.close(); },
        )
    }
    
    saveProcesoTicketAxios = async(flag) =>{
        waitAlert()
        const { access_token } = this.props.authUser
        const { ticket, formularios } = this.state
        await axios.put(`${URL_DEV}v3/calidad/tickets/${ticket.id}/proceso`, formularios.ticket, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { ticket } = response.data
                if(flag === true)
                    this.generarReporteFotograficoAxios()
                else
                    doneAlert('Datos guardados con éxito.', () => this.generarReporteFotografico())
                    this.getOneTicketAxios(ticket.id)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
            console.error(error, 'error')
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
    
    onClick = (type, aux) => {
        const { presupuesto, modal, formularios } = this.state
        switch(type){
            case 'volumetrias':
                this.onClickVolumetrias()
                break;
            case 'facturacion':
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
            case 'ticket-proceso':
                const { ticket } = this.state
                if(ticket.mantenimiento){
                    formularios.ticket.equipo = ticket.mantenimiento.instalacion.id.toString()
                    formularios.ticket.costo = ticket.mantenimiento.costo
                    this.setState({...this.state, formularios})
                }
                break;
            case 'generar-presupuesto':
                this.generarPDFAxios()
                break;
            case 'mostrar-presupuestos':
                this.openModalPdfs()
                break;
            case 'send-presupuesto':
                const { modal, presupuesto, options } = this.state
                const { user } = this.props.authUser
                modal.pres = true
                modal.pdfs = false
                formularios.presupuesto_generado.correos_reporte = []
                let aux_contactos = [];
                if (user.email) {
                    formularios.presupuesto_generado.correos_reporte.push({ value: user.email, label: user.email })
                    aux_contactos.push({
                        value: user.email,
                        label: user.email
                    })
                }
                options.correos_clientes = []
                presupuesto.proyecto.contactos.forEach(contacto => {
                    aux_contactos.push({
                        value: contacto.correo.toLowerCase(),
                        label: contacto.correo.toLowerCase()
                    })
                    return ''
                })
                options.correos_clientes = aux_contactos
                this.setState({ ...this.state, modal, formularios, options, adjunto: aux })
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
            activeKeyNav: value,
            defaultNavTabs:value
        })
    }
    handleCloseModalReporte = () => {
        const { formularios, modal } = this.state
        formularios.presupuesto_generado.correos_reporte = []
        if(modal.pres)
            modal.pdfs = true
        modal.pres = false
        modal.reporte = false
        this.setState({...this.state, modal, formularios, adjunto: null })
    }
    handleCloseModalOrden = () => {
        const { formularios, modal } = this.state
        modal.orden_compra = false
        this.setState({...this.state, modal, formularios })
    }
    openModalPdfs = () => {
        const { modal } = this.state
        modal.pdfs = true
        this.setState({ ...this.state, modal })
    }
    handleClosePdfs = () => {
        const { modal } = this.state
        modal.pdfs = false
        this.setState({ ...this.state, modal })
    }
    setAdjuntosTable = adjuntos => {
        let aux = []
        adjuntos.map((adjunto) => {
            aux.push({
                url: renderToString(
                    setAdjuntosList([{ name: adjunto.name, url: adjunto.url }])
                ),
                identificador: renderToString(setTextTableCenter(adjunto.pivot.identificador)),
                id: adjunto.id
            })
            return false
        })
        return aux
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
        var arrayCorreos = formularios.presupuesto_generado.correos_reporte.map(function (obj) {
            return obj.label;
        });
        formularios.presupuesto_generado.correos_reporte = arrayCorreos
        await axios.put(`${URL_DEV}v2/calidad/tickets/${ticket.id}/correo`, formularios.presupuesto_generado, { headers: setSingleHeader(access_token) }).then(
            (response) => { 
                this.handleCloseModalReporte()
                doneAlert('Correo enviado con éxito', () => { this.getOneTicketAxios(ticket.id) } ) 
            },  (error) => { this.handleCloseModalReporte(); printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    sendPresupuesto = async () => {
        waitAlert();
        const { adjunto, formularios, presupuesto, ticket } = this.state
        const { access_token } = this.props.authUser
        formularios.presupuesto_generado.presupuestoAdjunto = adjunto
        var arrayCorreos = formularios.presupuesto_generado.correos_reporte.map(function (obj) {
            return obj.label;
        });
        formularios.presupuesto_generado.correos_presupuesto = arrayCorreos
        await axios.post(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/correo`, formularios.presupuesto_generado, 
            { headers: setSingleHeader(access_token) }).then(
            (response) => { 
                const { modal } = this.state
                modal.pdfs = false
                modal.pres = false
                this.setState({...this.state, modal})
                this.getOneTicketAxios(ticket.id)
                doneAlert('Correo enviado con éxito', () => { this.handleCloseModalReporte() } ) 
            },  (error) => { this.handleCloseModalReporte(); printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    onSubmitOrden = async () => {
        const { formularios, presupuesto, ticket, modal } = this.state
        const { access_token } = this.props.authUser
        waitAlert();
        let presupuestoId = null
        if(ticket){
            if(ticket.presupuesto){
                if(ticket.presupuesto.length){
                    presupuestoId = ticket.presupuesto[0].id
                }
            }
        }
        if(presupuestoId){
            let data = new FormData()
            data.append('file', formularios.orden_compra.adjunto)
            data.append('adjunto', presupuestoId)
            data.append('orden', formularios.orden_compra.numero_orden)
            await axios.post(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/orden-compra?_method=PUT`, data, 
                { headers: setSingleHeader(access_token) }).then(
                (response) => {
                    modal.orden_compra = false
                    this.setState({ ...this.state, modal })
                    doneAlert('La orden de compra fue adjuntada con éxito.')
                    this.getOneTicketAxios(ticket.id)
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
        }else{ errorAlert(`No fue posible encontrar el presupuesto`) }
    }
    changeTypeSolicitudes = value => {
        const { formularios } = this.state
        if(value)
            formularios.conceptos = this.clearFormConceptos()
        else
            formularios.conceptos = [{area: '', subarea: '', descripcion: '', notas: ''}]
        
        this.setState({formularios})
    }

    addRows = (type) => {
        const { formularios } = this.state
        if(type === 'delete'){
            if(formularios.conceptos.length > 1){ formularios.conceptos.pop() }
        } else{ formularios.conceptos.push({area: '', subarea: '', descripcion: ''}) }
            
        this.setState({formularios})
    }

    showStatusTickets = (data) => {
        let auxiliar = '';
        if (data) {
            if (data.estatus_ticket)
                switch (data.estatus_ticket.estatus) {
                    case 'En espera':
                        auxiliar = { espera: true, revision: false, rechazado: false, aceptado: false, aprobacion: false, proceso: false, pendiente:false, terminado: false};
                        break;
                    case 'En revisión':
                        auxiliar = { espera: true, revision: true, rechazado: false, aceptado: false, aprobacion: false, proceso: false, pendiente:false, terminado: false };
                        break;
                    case 'Rechazado':
                        auxiliar = { espera: true, revision: true, rechazado: true, aceptado: false, aprobacion: false, proceso: false, pendiente:false, terminado: false };
                        break;
                    case 'Aceptado':
                        auxiliar = { espera: true, revision: true, rechazado: false, aceptado: true, aprobacion: false, proceso: false, pendiente:false, terminado: false };
                        break;
                    case 'Aprobación pendiente':
                        auxiliar = { espera: true, revision: true, rechazado: false, aceptado: true, aprobacion: true, proceso: false, pendiente:false, terminado: false };
                        break;
                    case 'En proceso':
                        auxiliar = { espera: true, revision: true, rechazado: false, aceptado: true, aprobacion: true, proceso: true, pendiente:false, terminado: false };
                        break;
                    case 'Pendiente de pago':
                        auxiliar = { espera: true, revision: true, rechazado: false, aceptado: true, aprobacion: true, proceso: true, pendiente:true, terminado: false };
                        break;
                    case 'Terminado':
                        auxiliar = { espera: true, revision: true, rechazado: false, aceptado: true, aprobacion: true, proceso: true, pendiente:true, terminado: true };
                        break;
                    default:
                        break;
                }
        }
        this.setState({
            ...this.state,
            aux_estatus: auxiliar
        })
    }

    showStatusPresupuestos= (presupuesto) => {
        let auxiliar = '';
        if (presupuesto) {
            if (presupuesto.estatus)
                switch (presupuesto.estatus.estatus) {
                    case 'Conceptos':
                        auxiliar = { conceptos: true, volumetrias: false, costos: false, revision: false, utilidad: false, espera: false, aceptado: false, rechazado: false };
                        break;
                    case 'Volumetrías':
                        auxiliar = { conceptos: true, volumetrias: true, costos: false, revision: false, utilidad: false, espera: false, aceptado: false, rechazado: false };
                        break;
                    case 'Costos':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: false, utilidad: false, espera: false, aceptado: false, rechazado: false };
                        break;
                    case 'En revisión':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: true, utilidad: false, espera: false, aceptado: false, rechazado: false };
                        break;
                    case 'Utilidad':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: true, utilidad: true, espera: false, aceptado: false, rechazado: false };
                        break;
                    case 'En espera':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: true, utilidad: true, espera: true, aceptado: false, rechazado: false };
                        break;
                    case 'Aceptado':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: true, utilidad: true, espera: true, aceptado: true, rechazado: false };
                        break;
                    case 'Rechazado':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: true, utilidad: true, espera: true, aceptado: false, rechazado: true };
                        break;
                    default:
                        break;
                }
        }
        this.setState({ ...this.state, aux_presupuestos: auxiliar })
    }
    save = () => {
        const { formularios } = this.state
        const { save } = this.props
        let auxObject = {}
        let aux = Object.keys(formularios.preeliminar)
        aux.map((element) => {
            auxObject[element] = formularios.preeliminar[element]
            return false
        })
        save({
            form: auxObject,
            page: 'calidad/tickets/detalles-ticket'
        })
    }
    recover = () => {
        const { formulario, deleteForm } = this.props
        let { formularios } = this.state
        formularios.preeliminar = formulario.form
        this.setState({
            ...this.state,
            formularios
        })
        deleteForm()
    }
    
    handleChangeCreateMSelect = (newValue) => {
        const { formularios } = this.state
        if(newValue == null){
            newValue = []
        }
        let currentValue = []
        newValue.forEach(valor => {
            currentValue.push({
                value: valor.value,
                label: valor.label
            })
            return ''
        })
        formularios.presupuesto_generado.correos_reporte = currentValue
        this.setState({...this.state, formularios })
    };

    setNavTabs = (estatus) => {
        let { defaultNavTabs } = this.state
        switch (estatus) {
            case 'En espera':
            case 'En revisión':
            case 'Rechazado':
                defaultNavTabs = 'adjuntos'
                break;
            case 'Aceptado':
            case 'Aprobación pendiente':
                defaultNavTabs = 'presupuesto'
                break;
            case 'En proceso':
            case 'Pendiente de pago':
                this.getSolicitudesAxios('solicitud-compra');
                defaultNavTabs = 'solicitud-compra'
                break;
            case 'Terminado':
                defaultNavTabs = 'ticket-proceso'
                break;
            default:
                break;
        }
        this.setState({ defaultNavTabs })
    }

    canSend = () => {
        const { presupuesto } = this.state
        let flag = false
        if(presupuesto){
            if(presupuesto.pdfs){
                if(presupuesto.pdfs.length){
                    flag = true
                    presupuesto.pdfs.forEach((pdf) => {
                        const { enviado, aceptado } = pdf.pivot
                        if(enviado && aceptado){
                            flag = false
                        }
                    })
                }
            }
        }
        return flag
    }

    render() {
        const { ticket, options, formularios, presupuesto, data, modal, formeditado, key, title, solicitudes, activeKeyNav, aux_estatus, aux_presupuestos, 
            defaultNavTabs, adjuntos, adjunto } = this.state
        const { formulario } = this.props
        const { access_token } = this.props.authUser
        return (
            <Layout active = 'calidad'  {...this.props}>
                <TicketView
                    /* ---------------------------------- DATOS --------------------------------- */
                    data = { ticket } options = { options } formulario = { formularios } presupuesto = { presupuesto } datos = { data }
                    solicitudes = { solicitudes } aux_estatus = { aux_estatus } aux_presupuestos={aux_presupuestos} title={title} modal={modal} key={key} 
                    activeKeyNav={activeKeyNav} modalSol = { modal.solicitud } formeditado={formeditado} at = { access_token }
                    /* -------------------------------- FUNCIONES ------------------------------- */
                    openModalWithInput = { this.openModalWithInput }  changeEstatus = { this.changeEstatus }  addingFotos = { this.addFotosS3 } 
                    onClick = { this.onClick }  onChange = { this.onChangeSwal }  setData = { this.setData }  setOptions = { this.setOptions }
                    onSubmit = { this.onSubmit }  openModalConceptos={this.openModalConceptos}  deleteFile = { this.deleteFile }  
                    openModalSolicitud = {this.openModalSolicitud}  handleCloseSolicitud={this.handleCloseSolicitud} deleteSolicitud={this.deleteSolicitud}
                    onSubmitSVenta={this.onSubmitSVenta}  onChangeTicketProceso={this.onChangeTicketProceso}  onSubmitTicketProceso={this.onSubmitTicketProceso} 
                    handleChangeTicketProceso={this.handleChangeTicketProceso}  generateEmailTicketProceso={this.generateEmailTicketProceso}  
                    controlledNav={this.controlledNav}  openAlertChangeStatusP={this.openAlertChangeStatusP}  onChangeConceptos = { this.onChangeConceptos } 
                    checkButtonConceptos = { this.checkButtonConceptos }  controlledTab={this.controlledTab} onSubmitConcept = { this.onSubmitConcept } 
                    handleCloseConceptos={this.handleCloseConceptos} openModalReporte={this.openModalReporte} addRows = { this.addRows } 
                    onChangeSolicitudCompra = { this.onChangeSolicitudCompra } submitSolicitudesCompras = { this.submitSolicitudesCompras } 
                    changeTypeSolicitudes = { this.changeTypeSolicitudes }  formularioGuardado={formulario} save={this.save} recover={this.recover}
                    addSolicitudFacturaAxios = { this.addSolicitudFacturaAxios } deleteSolicitudFactura = { this.deleteSolicitudAxios } 
                    addVenta = { this.addVentaAxios } getSolicitudes = { this.getSolicitudesAxios } defaultNavTabs={defaultNavTabs}
                    historialPresupuestos={this.openModalPdfs} openModalOrdenCompra={this.openModalOrdenCompra}
                />
                <Modal show = { modal.reporte } onHide = { this.handleCloseModalReporte } centered contentClassName = 'swal2-popup d-flex' >
                    <Modal.Header className = 'border-0 justify-content-center swal2-title text-center font-size-h4'>¿DESEAS ENVIAR EL REPORTE?</Modal.Header>
                    <Modal.Body className = 'p-0 mt-3'>
                        <div className = 'row mx-0 justify-content-center'>
                            <div className="col-md-12 text-center py-2">
                                <div>
                                    {
                                        ticket.reporte_url !== undefined ?
                                            <u>
                                                <a className="font-weight-bold text-hover-success text-primary" target= '_blank' rel="noreferrer" href = {ticket.reporte_url}>
                                                    DA CLIC AQUÍ PARA VER <i className="las la-hand-point-right text-primary icon-md ml-1"></i> EL REPORTE
                                                </a>
                                            </u>
                                        : <></>
                                    }
                                </div>
                            </div>
                            <div className="col-md-11 font-weight-light mt-4 text-justify">
                                Si deseas enviar el reporte fotográfico agrega el o los correos del destinatario, de lo contario da clic en <span onClick = { this.handleCloseModalReporte } className="font-weight-bold">cancelar</span>.
                            </div>
                            <div className="col-md-11 mt-5">
                                <div>
                                    <CreatableMultiselectGray placeholder = "SELECCIONA/AGREGA EL O LOS CORREOS" iconclass = "flaticon-email" uppercase = { false }
                                        requirevalidation = { 1 } messageinc = "Selecciona el o los correos" onChange = { this.handleChangeCreateMSelect } 
                                        options = { options.correos_clientes } elementoactual = { formularios.presupuesto_generado.correos_reporte } />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className = 'border-0 justify-content-center'>
                        <button type="button" className="swal2-cancel btn-light-gray-sweetalert2 swal2-styled d-flex" onClick = { this.handleCloseModalReporte }>CANCELAR</button>
                        <button type="button" className="swal2-confirm btn-light-success-sweetalert2 swal2-styled d-flex" onClick = { this.sendMail } >SI, ENVIAR</button>
                    </Modal.Footer>
                </Modal>
                <Modal show = { modal.pres } onHide = { this.handleCloseModalReporte } centered contentClassName = 'swal2-popup d-flex' >
                    <Modal.Header className = 'border-0 justify-content-center swal2-title text-center font-size-h4'>¿DESEAS ENVIAR EL PRESUPUESTO?</Modal.Header>
                    <Modal.Body className = 'p-0 mt-3'>
                        <div className = 'row mx-0 justify-content-center'>
                            <div className="col-md-12 text-center py-2">
                                <div>
                                    {
                                        adjunto ?
                                            adjunto.url !== undefined ?
                                                <u>
                                                    <a className="font-weight-bold text-hover-success text-primary" target= '_blank' rel="noreferrer" href = { adjunto.url } >
                                                        DA CLIC AQUÍ PARA VER <i className="las la-hand-point-right text-primary icon-md ml-1"></i> EL PRESUPUESTO
                                                    </a>
                                                </u>
                                            : <></>
                                        : <></>
                                    }
                                </div>
                            </div>
                            <div className="col-md-11 font-weight-light mt-4 text-justify">
                                Si deseas enviar el presupuesto agrega el o los correos del destinatario, de lo contario da clic en <span onClick = { this.handleCloseModalReporte } className="font-weight-bold">cancelar</span>.
                            </div>
                            <div className="col-md-11 mt-5">
                                <div>
                                    <CreatableMultiselectGray placeholder = "SELECCIONA/AGREGA EL O LOS CORREOS" iconclass = "flaticon-email" uppercase = { false }
                                        requirevalidation = { 1 } messageinc = "Selecciona el o los correos" onChange = { this.handleChangeCreateMSelect } 
                                        options = { options.correos_clientes } elementoactual = { formularios.presupuesto_generado.correos_reporte } />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className = 'border-0 justify-content-center'>
                        <button type="button" className="swal2-cancel btn-light-gray-sweetalert2 swal2-styled d-flex" onClick = { this.handleCloseModalReporte }>CANCELAR</button>
                        <button type="button" className="swal2-confirm btn-light-success-sweetalert2 swal2-styled d-flex" onClick = { this.sendPresupuesto } >SI, ENVIAR</button>
                    </Modal.Footer>
                </Modal>
                <CustomModal show={modal.pdfs} handleClose={this.handleClosePdfs} title="Historial de presupuestos" >
                    <PresupuestoGeneradoNoCrm pdfs = { presupuesto.pdfs } actionsEnable = { this.canSend() ? true : false } 
                        onClick = { this.onClick } />    
                </CustomModal>
                <Modal show = { modal.orden_compra } onHide = { this.handleCloseModalOrden } centered contentClassName = 'swal2-popup d-flex' >
                    <Modal.Header className = 'border-0 justify-content-center swal2-title text-center font-size-h4'>AGREGAR ORDEN DE COMPRA</Modal.Header>
                    <Modal.Body className = 'p-0 mt-3'>
                        <Form id="form-orden" onSubmit = { (e) => { e.preventDefault(); validateAlert(this.onSubmitOrden, e, 'form-orden') } }>
                            <div className='row mx-0 justify-content-center'>
                                <div className="col-md-12">
                                    <div className="form-group row form-group-marginless mb-1">
                                        <div className="col-md-12 text-justify">
                                            <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} iconclass='las la-hashtag icon-xl'
                                                requirevalidation={0} value={formularios.orden_compra.numero_orden} name={'numero_orden'}
                                                onChange={(e) => { this.onChangeSwal(e.target.value, 'numero_orden', 'orden_compra') }}
                                                swal={true} placeholder='NÚMERO DE ORDEN DE COMPRA'
                                            />
                                        </div>
                                    </div>
                                    <div className="separator separator-dashed mt-5 mb-2"></div>
                                    <div className="form-group row form-group-marginless mt-5 mb-0">
                                        <div className="col-md-12">
                                            <label htmlFor="adjunto" className="drop-files">
                                                <i className="las la-file-pdf icon-xl text-primary"></i>
                                                <input
                                                    id="adjunto"
                                                    type="file"
                                                    onChange={(e) => { this.onChangeSwal(e.target.files[0], 'adjunto', 'orden_compra'); this.changeNameFile('adjunto') }}
                                                    name='adjunto'
                                                    accept="application/pdf"
                                                />
                                                <div className="font-weight-bolder font-size-md ml-2" id="info">Subir orden de compra (PDF)</div>
                                            </label>
                                            {
                                                formularios.orden_compra.adjunto === '' ?
                                                    <span className="form-text text-danger is-invalid font-size-xs text-center"> Adjunta la orden (PDF) </span>
                                                :<></>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className = 'border-0 justify-content-center'>
                        <button type="button" className="swal2-cancel btn-light-gray-sweetalert2 swal2-styled d-flex" onClick = { this.handleCloseModalOrden }>CANCELAR</button>
                        <button type="button" className="swal2-confirm btn-light-success-sweetalert2 swal2-styled d-flex" onClick = { (e) => { e.preventDefault(); validateAlert(this.onSubmitOrden, e, 'form-orden') } } >AGREGAR</button>
                    </Modal.Footer>
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser,
        formulario: state.formulario
    }
}

const mapDispatchToProps = dispatch => ({
    save: payload => dispatch(save(payload)),
    deleteForm: () => dispatch(deleteForm()),
})

export default connect(mapStateToProps, mapDispatchToProps)(TicketDetails);