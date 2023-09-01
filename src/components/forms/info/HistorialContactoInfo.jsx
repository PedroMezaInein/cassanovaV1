import React, { Component } from 'react'
import SVG from 'react-inlinesvg'
import Pagination from 'react-js-pagination'
import { Card, DropdownButton, Dropdown } from 'react-bootstrap'
import { setNaviIcon, setContactoIcon, dayDMY } from '../../../functions/setters'
import { deleteAlert, doneAlert, printResponseErrorAlert, solicitarCita, waitAlert} from '../../../functions/alert'
import { toAbsoluteUrl } from '../../../functions/routers'
import { apiPutForm, apiPostForm, catchErrors } from '../../../functions/api'
import AgendarCitaForm from '../info/AgendarCitaForm'
import HistorialContactoForm from '../HistorialContactoForm'

class ComentariosProyectos extends Component {
    state = {
        activeHistorial: 'historial',
        formAgenda: {
            fecha: new Date(),
            hora_inicio: '08',
            minuto_inicio: '00',
            hora_final: '08',
            minuto_final: '15',
            cliente: '',
            tipo: 0,
            origen: 0,
            proyecto: '',
            empresa: 0,
            estatus: 0,
            correos: [],
            correo: '',
            lugar: 'presencial',
            url: '',
            ubicacion: '',
            si_empresa: '',
            no_empresa: '',
            cita_empresa: 'si_empresa',
            agendarLlamada: false,
            agendarCita: true
        },
        activePage: 1,
        itemsPerPage: 5,
    }
    onClickActiveHistorial = (type) => {
        this.setState({
            ...this.state,
            activeHistorial: type
        })
    }
    getTitle = () => {
        const { activeHistorial, formAgenda } = this.state
        switch (activeHistorial) {
            case 'historial':
                return 'HISTORIAL DE CONTACTOS'
            case 'agendar-cita':
                if(formAgenda.agendarLlamada){
                    return 'AGENDAR LLAMADA'
                }else{
                    return 'AGENDAR CITA'
                }
            case 'nuevo-contacto':
                return 'AGREGAR NUEVO CONTACTO'
            default:
                return ''
        }
    }
    onChangePage(pageNumber){
        let { activePage } = this.state
        activePage = pageNumber
        this.setState({ ...this.state, activePage })
    }
    printContactCount = (contactos) => {
        let sizeContactado = 0
        let sizeNoContactado = 0
        contactos.map((contacto) => {
            if(contacto.success){
                return sizeContactado++
            }else{
                return sizeNoContactado++
            }
        })
        return(
            <div className="w-auto d-flex flex-column mx-auto mb-8">
                <div className="bg-light-warning p-4 rounded-xl flex-grow-1 align-self-center">
                    <div className="d-flex align-items-center justify-content-center font-size-lg font-weight-light mb-2">
                        TOTAL DE CONTACTOS:<span className="font-weight-boldest ml-2"><u>{contactos.length}</u></span>
                    </div>
                    <div id="symbol-total-contactos">
                        <span>
                            <span className="symbol symbol-circle symbol-white symbol-30 flex-shrink-0 mr-2">
                                <span className="symbol-label">
                                    <i className="fas fa-user-check text-success font-size-13px"></i>
                                </span>
                            </span>
                            <span className="font-size-sm font-weight-bolder">
                                <span className="font-size-lg">{sizeContactado}</span>
                                <span className="ml-2 font-weight-light">{sizeContactado <= 1 ? 'Contacto' : 'Contactados'}</span>
                            </span>
                        </span>
                        <span className="ml-4">
                            <span className="symbol symbol-circle symbol-white symbol-30 flex-shrink-0 mr-2">
                                <span className="symbol-label">
                                    <i className="fas fa-user-times text-danger font-size-13px"></i>
                                </span>
                            </span>
                            <span className="font-size-sm font-weight-bolder">
                                <span className="font-size-lg">{sizeNoContactado}</span>
                                <span className="ml-2 font-weight-light">Sin respuesta</span>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
    /* ---------------- ANCHOR ASYNC CALL TO SOLICITAR CITA FECHA --------------- */
    solicitarFechaCita = async () => {
        const { at, refresh, lead } = this.props
        apiPutForm(`crm/email/lead-potencial/${lead.id}`, {}, at).then(
            (response) => {
                doneAlert('Correo enviado con éxito', () => { refresh() });
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    /* ------------------------------------------------------------------------- */
    /*                               AGENDAR CITA                                */
    /* ------------------------------------------------------------------------- */
    onChangeAgenda = e => {
        const { name, value } = e.target
        const { formAgenda } = this.state
        formAgenda[name] = value
        this.setState({ ...this.state, formAgenda })
    }
    tagInputChange = (nuevosCorreos) => {
        const uppercased = nuevosCorreos.map(tipo => tipo.toUpperCase());
        const { formAgenda } = this.state
        let unico = {};
        uppercased.forEach(function (i) {
            if (!unico[i]) { unico[i] = true }
        })
        formAgenda.correos = uppercased ? Object.keys(unico) : [];
        this.setState({ formAgenda })
    }
    onChangeAgendaLC = e => {
        const { name, value, checked, type } = e.target
        const { formAgenda  } = this.state
        formAgenda[name] = value
        if (type === 'radio') {
            if (name === "agendarLlamada") {
                formAgenda.agendarCita = false
            }
            else if (name === "agendarCita") {
                formAgenda.agendarLlamada = false
            }
            formAgenda[name] = checked
        }
        this.setState({ ...this.state, formAgenda })
    }
    agendarEvento = async () => {
        const { formAgenda } = this.state
        const { at, lead } = this.props
        waitAlert()
        apiPostForm(`crm/agendar/evento/${lead.id}`, formAgenda, at).then(
            (response) => {
                formAgenda.fecha = new Date()
                formAgenda.hora_inicio = '08'
                formAgenda.minuto_inicio = '00'
                formAgenda.hora_final = '08'
                formAgenda.minuto_final = '15'
                formAgenda.titulo = ''
                formAgenda.correo = ''
                formAgenda.correos = []
                formAgenda.lugar = 'presencial'
                formAgenda.ubicacion = ''
                formAgenda.url = ''
                this.setState({ ...this.state, formAgenda })
                doneAlert('Evento generado con éxito', () => { this.refreshNav() });
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    refreshNav = () => {
        const { refresh } = this.props
        let { activeHistorial } = this.state
        activeHistorial="historial"
        this.setState({
            ...this.state,
            activeHistorial
        })
        refresh()
    }
    render() {
        const { activePage, itemsPerPage, activeHistorial, formAgenda, formeditado } = this.state
        const { lead, options, at, eliminarContacto } = this.props
        return (
            <>
                <Card className="card-custom gutter-b">
                    <Card.Header className="border-0 align-items-center pt-8 pt-md-0">
                        <div className="font-weight-bold font-size-h4 text-dark">{this.getTitle()}</div>
                        {
                            lead ?
                                lead.prospecto ?
                                    lead.prospecto.contactos.length > 0 ?
                                        <div className="card-toolbar">
                                            <DropdownButton menualign="right" title='opciones' className="dropdown-historial-contactos">
                                                <Dropdown.Item className="solicitar-cita" onClick={(e) => { solicitarCita(lead.nombre, () => this.solicitarFechaCita()) }}>
                                                    {setNaviIcon(`las la-user-tie icon-xl`, 'SOLICITAR CITA')}
                                                </Dropdown.Item>
                                                {
                                                    activeHistorial !== 'agendar-cita'?
                                                    <Dropdown.Item className="agendar-cita" onClick={() => { this.onClickActiveHistorial('agendar-cita') }}>
                                                        {setNaviIcon(`las la-calendar-check icon-xl`, 'AGENDAR CITA')}
                                                    </Dropdown.Item>
                                                    :<></>
                                                }
                                                {
                                                    activeHistorial !== 'nuevo-contacto'?
                                                    <Dropdown.Item className="nuevo-contacto" onClick={() => { this.onClickActiveHistorial('nuevo-contacto') }}>
                                                        {setNaviIcon(`las la-comments icon-xl`, 'AGREGAR CONTACTO')}
                                                    </Dropdown.Item>
                                                    :<></>
                                                }
                                                {
                                                    lead.prospecto.contactos.length > 0 && activeHistorial !== 'historial' ?
                                                    <Dropdown.Item className="historial" onClick={() => { this.onClickActiveHistorial('historial') }}>
                                                        {setNaviIcon(`las la-clipboard-list icon-xl`, 'HISTORIAL DE CONTACTOS')}
                                                    </Dropdown.Item>
                                                    :<></>
                                                }
                                            </DropdownButton>
                                        </div>
                                        : ''
                                    : ''
                                : ''
                        }
                    </Card.Header>
                    <Card.Body>
                        {
                            activeHistorial === 'agendar-cita' ?
                                <AgendarCitaForm formAgenda={formAgenda} onChange={this.onChangeAgenda}
                                    onSubmit={() => { waitAlert(); this.agendarEvento() }}
                                    tagInputChange={(e) => this.tagInputChange(e)}
                                    onChangeAgendaLC={this.onChangeAgendaLC} lead={lead}
                                    formeditado={formeditado}
                                />
                            :<></>
                        }
                        {
                            activeHistorial === 'nuevo-contacto'?
                                <HistorialContactoForm refresh = { this.refreshNav } 
                                lead = { lead } at = { at } options = { options } classcalendar="col-md-10 col-xxl-6 mx-auto" classhora="col-md-7 col-xxl-4"/>
                            :<></>
                        }
                        {
                            activeHistorial === 'historial' ?
                                <div className="col-md-8 mx-auto">
                                    {
                                        lead ?
                                            lead.prospecto ?
                                                lead.prospecto.contactos.length === 0 ?
                                                    <div className="text-center text-dark-75 font-weight-bolder font-size-lg">No se ha registrado ningún contacto</div>
                                                    :
                                                    <>
                                                        {this.printContactCount(lead.prospecto.contactos)}
                                                        {
                                                            lead.prospecto.contactos.map((contacto, key) => {
                                                                let limiteInferior = (activePage - 1) * itemsPerPage
                                                                let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                                                if (contacto.length < itemsPerPage || (key >= limiteInferior && key <= limiteSuperior))
                                                                    return (
                                                                        <div className="timeline timeline-6" key={key}>
                                                                            <div className="timeline-items">
                                                                                <div className="timeline-item">
                                                                                    <div className={contacto.success ? "timeline-media bg-light-success" : "timeline-media bg-light-danger"}>
                                                                                        <span className={contacto.success ? "svg-icon svg-icon-success svg-icon-md" : "svg-icon svg-icon-danger  svg-icon-md"}>
                                                                                            {setContactoIcon(contacto)}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className={contacto.success ? "timeline-desc timeline-desc-light-success" : "timeline-desc timeline-desc-light-danger"}>
                                                                                        <span className={contacto.success ? "font-weight-bolder text-success" : "font-weight-bolder text-danger"}>{dayDMY(contacto.created_at)}</span>
                                                                                        <div className="font-weight-light pb-2 text-justify position-relative mt-2 pr-3" style={{ borderRadius: '0.42rem', padding: '1rem 1.5rem', backgroundColor: '#F3F6F9' }}>
                                                                                            <div className="text-dark-75 font-weight-bold mb-2">
                                                                                                <div className="d-flex justify-content-between">
                                                                                                    {contacto.tipo_contacto ? contacto.tipo_contacto.tipo : ''}
                                                                                                    <span className="text-muted text-hover-danger font-weight-bold a-hover"
                                                                                                        onClick={(e) => { deleteAlert('¿ESTÁS SEGURO QUE DESEAS ELIMINAR EL CONTACTO?', '¡NO PODRÁS REVERTIR ESTO!', () => eliminarContacto(contacto)) }}>
                                                                                                        <i className="flaticon2-cross icon-xs" />
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                            {contacto.comentario}
                                                                                            {
                                                                                                contacto.user ?
                                                                                                    <span className="blockquote-footer font-weight-lighter ml-2 d-inline">
                                                                                                        {contacto.user.name}
                                                                                                    </span>
                                                                                                    : <></>
                                                                                            }
                                                                                            {
                                                                                                contacto.adjunto ?
                                                                                                    <div className="d-flex justify-content-end mt-1">
                                                                                                        <a href={contacto.adjunto.url} target='_blank' rel="noopener noreferrer" className="text-muted text-hover-primary font-weight-bold">
                                                                                                            <span className="svg-icon svg-icon-md svg-icon-gray-500 mr-1">
                                                                                                                <SVG src={toAbsoluteUrl('/images/svg/Attachment1.svg')} />
                                                                                                            </span>VER ADJUNTO
                                                                                                        </a>
                                                                                                    </div>
                                                                                                    : ''
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                return false
                                                            })
                                                        }
                                                    </>
                                                : <div className="text-center text-dark-75 font-weight-bolder font-size-lg">No se ha registrado ningún contacto</div>
                                            : <div className="text-center text-dark-75 font-weight-bolder font-size-lg">No se ha registrado ningún contacto</div>
                                    }
                                    {
                                        lead ?
                                            lead.prospecto ?
                                                lead.prospecto.contactos.length > itemsPerPage ?
                                                    <div className="d-flex justify-content-center mt-4">
                                                        <Pagination itemClassLast="d-none" itemClassFirst="d-none" itemClass="page-item"
                                                            firstPageText='Primero' lastPageText='Último' activePage={activePage}
                                                            itemsCountPerPage={itemsPerPage} totalItemsCount={lead.prospecto.contactos.length}
                                                            pageRangeDisplayed={5} onChange={this.onChangePage.bind(this)}
                                                            prevPageText={<i className='ki ki-bold-arrow-back icon-xs' />}
                                                            nextPageText={<i className='ki ki-bold-arrow-next icon-xs' />}
                                                            linkClassPrev="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                            linkClassNext="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                            linkClass="btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 pagination"
                                                            activeLinkClass="btn btn-icon btn-sm border-0 btn-light btn-hover-primary active mr-2 my-1 pagination" />
                                                    </div>
                                                    : ''
                                                : ''
                                            : ''
                                    }
                                </div>
                            : <></>
                        }
                    </Card.Body>
                </Card>
            </>
        )
    }
}

export default ComentariosProyectos