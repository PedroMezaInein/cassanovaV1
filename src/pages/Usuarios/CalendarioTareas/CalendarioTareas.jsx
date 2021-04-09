import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import axios from 'axios';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import esLocale from '@fullcalendar/core/locales/es'
import { errorAlert, printResponseErrorAlert, waitAlert, doneAlert } from '../../../functions/alert'
import { URL_DEV } from '../../../constants'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { Modal } from '../../../components/singles'
import FormCalendarioTareas from '../../../components/forms/usuarios/FormCalendarioTareas'
class Calendario extends Component {
    state = {
        events: [],
        checador: [],
        json: {},
        tipo: 'own',
        title:'',
        modal: {
            tareas:false
        },
        form: {
            adjuntos: {
                adjunto_comentario: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
            },
            comentario: ''
        },
    };

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getUserChecador()
        this.getCalendarioTareasAxios('own')
    }

    actualizarChecadorAxios = async(tipo) => {
        const { access_token } = this.props.authUser
        const { json } = this.state
        waitAlert()
        await axios.put(`${URL_DEV}v2/usuarios/usuarios/checador/${tipo}`, {ip: json}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => { 
                const { usuario } = response.data
                if(tipo === 'entrada')
                    doneAlert('Entrada checada con éxito')
                else
                    doneAlert('Salida checada con éxito')
                this.setState({...this.state, checador: usuario.checadores})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getUserChecador = async() => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/usuarios/usuarios/checador`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { usuario } = response.data
                this.setState({...this.state, checador: usuario.checadores})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    printChecador = () => {
		const { checador } = this.state
		if(checador.length){
			if(checador[0].fecha_fin === null)
				return(
                    <span className="btn btn-sm btn-bg-light btn-icon-primary btn-hover-primary font-weight-bolder text-primary" onClick = { (e) => { e.preventDefault(); this.actualizarChecadorAxios('salida') } } >
                        <i className="fas fa-sign-in-alt text-primary"></i> CHECAR SALIDA
                    </span>
				)
		}else{
			return(
                <span className="btn btn-sm btn-bg-light btn-icon-success btn-hover-success font-weight-bolder text-success" onClick = { (e) => { e.preventDefault(); this.actualizarChecadorAxios('entrada') } }>
                    <i className="fas fa-sign-in-alt text-success"></i> CHECAR ENTRADA
                </span>
			)
		}
	}

    handleDateClick = (arg) => {
        waitAlert()
        this.getEventsOneDateAxios(arg.dateStr)
    }

    async getEventsOneDateAxios(date) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'vacaciones/single/' + date, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { eventos } = response.data
                this.setState({
                    ...this.state,    
                    eventos: eventos
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

    async getCalendarioTareasAxios(tipo) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/usuarios/calendario-proyectos/${tipo}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { tareas } = response.data
                let aux = []
                tareas.map((tarea, index) => { aux.push( { title: tarea.titulo, start: tarea.fecha_limite, end: tarea.fecha_limite, tarea: tarea } ) })
                this.setState({ ...this.state, events: aux, tipo: tipo })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getTareas = (tarea) => {
        console.log(tarea)
        const { modal } = this.state
        modal.tareas = true
        this.setState({
            ...this.state,
            modal,
            tarea: tarea,
            title: tarea.titulo,
            form: this.clearForm(),
        })
    }
    
    handleCloseModalT = () => {
        const { modal } = this.state
        modal.tareas = false
        this.setState({
            ...this.state,
            modal
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    form[element] = {
                        adjunto_comentario: {
                            value: '',
                            placeholder: 'Adjunto',
                            files: []
                        },
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form
    }
    renderEventContent = (eventInfo) => {
        const { tarea } = eventInfo.event._def.extendedProps
        return (
            <OverlayTrigger overlay={<Tooltip>{eventInfo.event.title}</Tooltip>}>
                <div className="container p-1 bg-info rounded-xl" onClick={(e) => { e.preventDefault(); this.getTareas(tarea) }}>
                    <div className="row mx-0 row-paddingless">
                        <div className="col-md-auto mr-2 text-truncate">
                            {
                                <div className="symbol-group symbol-hover justify-content-center">
                                    {
                                        tarea.responsables.map((responsable, key) => {
                                            return(
                                                <div className="symbol symbol-25 symbol-circle border-1" key={key}>
                                                    <img src={responsable.avatar ? responsable.avatar : "/default.jpg"}/>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            }
                        </div>
                        <div className="col align-self-center text-truncate">
                            <span className="text-white font-weight-bold">{eventInfo.event.title}</span>
                        </div>
                    </div>
                </div>
            </OverlayTrigger>
        )
    }
    
    openCalendarMisTareas = () => { this.getCalendarioTareasAxios('own') }
    
    openCalendarDeptos = () => { this.getCalendarioTareasAxios('all') }

    addComentarioAxios = async () => {
        // waitAlert()
        // const { access_token } = this.props.authUser
        // const { form, proyecto } = this.state
        // const data = new FormData();

        // form.adjuntos.adjunto_comentario.files.map(( adjunto) => {
        //     data.append(`files_name_adjunto[]`, adjunto.name)
        //     data.append(`files_adjunto[]`, adjunto.file)
        //     return ''
        // })

        // data.append(`comentario`, form.comentario)
        // await axios.post(`${URL_DEV}v2/usuarios/calendario-tareas/tarea/${tarea.id}/tarea`, data, { headers: {'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
        //     (response) => {
        //         doneAlert('Comentario agregado con éxito');
        //         const { proyecto } = response.data
        //         const { form } = this.state
        //         form.comentario = ''
        //         form.adjuntos.adjunto_comentario = {
        //             value: '',
        //             placeholder: 'Adjunto',
        //             files: []
        //         }
        //         this.setState({ ...this.state, form, proyecto: proyecto })
        //     }, (error) => { printResponseErrorAlert(error) }
        // ).catch((error) => {
        //     errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
        //     console.log(error, 'error')
        // })
    }
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    handleChangeComentario = (files, item) => {
        const { form } = this.state
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
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    render() {
        const { events, tipo, title, modal, tarea, form } = this.state
        return (
            <Layout {...this.props}>
                    <Card className="card-custom">
                        <Card.Header>
                            <div className="d-flex align-items-center">
                                <div className="align-items-start flex-column">
                                    <span className="font-weight-bolder text-dark font-size-h3">Calendario de tareas</span>
                                </div>
                            </div>
                            <div className="card-toolbar">
                                { this.printChecador() }
                            </div>
                        </Card.Header>
                        <Card.Body>
                        <div className="btn-toolbar btn-group justify-content-center mb-7">
                            <div className="btn-group btn-group-sm">
                                <button type="button" className={`btn font-weight-bolder ${tipo === 'own' ? 'btn-success' : 'btn-light-success'}`} onClick={this.openCalendarMisTareas}>
                                    <i className="fas fa-tasks"></i> MIS TAREAS
                                </button>
                                <button type="button" className={`btn font-weight-bolder ${tipo === 'all' ? 'btn-primary' : 'btn-light-primary'}`}  onClick={this.openCalendarDeptos}>
                                    <i className="fas fa-list-ol"></i> TAREAS DEPTOS
                                </button>
                            </div>
                        </div>
                            <FullCalendar
                                locale={esLocale}
                                plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
                                initialView="dayGridMonth"
                                weekends={true}
                                events={events}
                                // dateClick={this.handleDateClick}
                                eventContent={this.renderEventContent}
                                firstDay={1}
                                themeSystem='bootstrap'
                                height='1290.37px'
                            />
                        </Card.Body>
                    </Card>
                <Modal size="lg" title={title} show={modal.tareas} handleClose={this.handleCloseModalT}>
                    <FormCalendarioTareas
                        tarea={tarea}
                        addComentario={this.addComentarioAxios} 
                        form={form}
                        onChange={this.onChange}
                        handleChange={this.handleChangeComentario}
                    />
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Calendario)
