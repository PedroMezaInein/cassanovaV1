import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, S3_CONFIG } from '../../../constants'
import { setOptions } from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert, questionAlert, questionAlert2, customInputAlert, questionAlertY, deleteAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { TicketView } from '../../../components/forms'
import { Form } from 'react-bootstrap'
import { setSingleHeader } from '../../../functions/routers'
import { SelectSearchGray } from '../../../components/form-components'
import moment from 'moment'
import 'moment/locale/es' 
import Swal from 'sweetalert2'
import S3 from 'react-aws-s3';

const ReactS3Client = new S3(S3_CONFIG);
class TicketDetails extends Component {

    state = {
        options: { empleados: [], estatus: [], tiposTrabajo: [], proyectos: [], partidas: [], subpartidas: [], proveedores: [] },
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
                    mensajes: { active: false, mensaje: '' }
                }],
                conceptosNuevos: []
            }
        },
        data: { partidas: [],subpartidas: [], conceptos: [] },
        ticket: '',
        presupuesto: ''
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

    /* -------------------------------------------------------------------------- */
    /*                                ANCHOR ASYNC                                */
    /* -------------------------------------------------------------------------- */

    getOptionsAxios = async() => {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'calidad/options', { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { empleados, estatus, tiposTrabajo, proyectos, partidas, conceptos, proveedores } = response.data
                const { options, formularios, data } = this.state
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

    getPresupuestoAxios = async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}presupuestos/${id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { presupuesto } = response.data
                const { formularios } = this.state
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
                        },
                        id: concepto.id,
                        costo: concepto.costo,
                        importe: concepto.importe
                    })
                })
                formularios.preeliminar.conceptos = aux
                this.setState({ ...this.state, presupuesto: presupuesto, formularios })
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
                    () => questionAlertY(`¡Listo!`, '¿Deseas enviar a compras tus volumetrías para la estimación de costos?', 
                        () => this.patchPresupuesto('estatus', 'Costos'),
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
        }
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
        }
    }
    
    render() {
        const { ticket, options, formularios, presupuesto, data } = this.state
        return (
            <Layout active = 'calidad'  {...this.props}>
                <TicketView
                    /* ---------------------------------- DATOS --------------------------------- */
                    data = { ticket } options = { options } formulario = { formularios } presupuesto = { presupuesto } datos = { data }
                    /* -------------------------------- FUNCIONES ------------------------------- */
                    openModalWithInput = { this.openModalWithInput } changeEstatus = { this.changeEstatus } addingFotos = { this.addFotosS3 } 
                    onClick = { this.onClick } onChange = { this.onChangeSwal } setData = { this.setData } setOptions = { this.setOptions }
                    onSubmit = { this.onSubmit } deleteFile = { this.deleteFile } />
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(TicketDetails);