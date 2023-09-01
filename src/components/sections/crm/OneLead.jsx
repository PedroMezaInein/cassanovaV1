import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { Tab, Nav } from 'react-bootstrap'
import { SymbolIcon } from '../../singles'
import Pagination from 'react-js-pagination'
import { toAbsoluteUrl } from "../../../functions/routers"
import { apiDelete, catchErrors } from '../../../functions/api'
import { setEmpresaLogo, dayDMY, setContactoIcon, setDate } from '../../../functions/setters'
import { deleteAlert, doneAlert, printResponseErrorAlert } from '../../../functions/alert'
import PresupuestoList from './PresupuestoList'

class OneLead extends Component {
    state = {
        activePage: 1,
        itemsPerPage: 5
    }
    onChangePage(pageNumber){
        let { activePage } = this.state
        activePage = pageNumber
        this.setState({
            ...this.state,
            activePage
        })
    }
    hasContactos = (lead) => {
        if (lead)
            if (lead.prospecto)
                if (lead.prospecto.contactos)
                    if (lead.prospecto.contactos.length)
                        return true
        return false
    }
    hasPresupuestoDiseno = () => {
        const { lead } = this.props
        if (lead)
            if (lead.presupuesto_diseño)
                if (lead.presupuesto_diseño.pdfs)
                    if (lead.presupuesto_diseño.pdfs.length)
                        return true
        return false
    }
    noHayAdjuntos = () => {
        return (
            <div className="text-center text-dark-75">NO HAY ADJUNTOS</div>
        )
    }
    anotherDate = (pdf) => {
        if (pdf)
            if (pdf.pivot)
                if (pdf.pivot.fecha_envio)
                    return true
        return false
    }
    printContactCount = (contactos) => {
        let sizeContactado = 0
        let sizeNoContactado = 0
        contactos.map((contacto) => {
            if (contacto.success) {
                return sizeContactado++
            } else {
                return sizeNoContactado++
            }
        })
        return (
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
    printTimeLineContact = (contacto, key) => {
        return (
            <div className="timeline timeline-6" key={key}>
                <div className="timeline-items">
                    <div className="timeline-item">
                        <div className={contacto.success ? "timeline-media bg-light-success" : "timeline-media bg-light-danger"} >
                            <span className={contacto.success ? "svg-icon svg-icon-success svg-icon-md" : "svg-icon svg-icon-danger  svg-icon-md"}>
                                {setContactoIcon(contacto)}
                            </span>
                        </div>
                        <div className={contacto.success ? "timeline-desc timeline-desc-light-success" : "timeline-desc timeline-desc-light-danger"} >
                            <span className={contacto.success ? "font-weight-bolder text-success" : "font-weight-bolder text-danger"} >
                                {setDate(contacto.created_at)}
                            </span>
                            <div className="font-weight-light text-justify position-relative mt-2 bg-light rounded px-5 py-3">
                                <div className="text-dark-75 font-weight-bold mb-2">
                                    <div className="d-flex justify-content-between">
                                        {contacto.tipo_contacto ? contacto.tipo_contacto.tipo : ''}
                                        <span className="text-muted text-hover-danger font-weight-bold a-hover"
                                            onClick={(e) => { deleteAlert('¿ESTÁS SEGURO QUE DESEAS ELIMINAR EL CONTACTO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.eliminarContacto(contacto)) }}>
                                            <i className="flaticon2-cross icon-xs" />
                                        </span>
                                    </div>
                                </div>
                                {contacto.comentario}
                                <span className="blockquote-footer font-weight-lighter ml-2 d-inline">
                                    {contacto.user.name}
                                </span>
                                {
                                    contacto.adjunto ?
                                        <div className="d-flex justify-content-end mt-1">
                                            <a href={contacto.adjunto.url} target='_blank' rel="noopener noreferrer" className="text-muted text-hover-primary font-weight-bold font-size-sm">
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
    }
    eliminarContacto = contacto => {
        const { refresh, at, lead } = this.props
        apiDelete(`crm/prospecto/${lead.id}/contacto/${contacto.id}`, at).then((response) => {
            doneAlert(`Registro de contacto eliminado con éxito`, () => { refresh(lead.id) } )
        }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }  
    render() {
        const { lead } = this.props
        const { activePage, itemsPerPage } = this.state
        return (
            <>
                <div className="row mx-0 d-flex justify-content-center">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-between mt-4 div-logo-empresa">
                            {
                                setEmpresaLogo(lead) !== '' ?
                                    <img alt='' src={setEmpresaLogo(lead)} className="logo-empresa" style={{ height: 50}} />
                                    : ''
                            }
                            {
                                lead.estatus ?
                                    <span className="navi-link align-self-center">
                                        <span className="navi-text">
                                            <span className="label label-md label-inline w-100 font-weight-bolder border-transparent"
                                                style={{ backgroundColor: lead.estatus.color_fondo, color: lead.estatus.color_texto }}>
                                                {lead.estatus.estatus.toUpperCase()}
                                            </span>
                                        </span>
                                    </span>
                                    : <></>
                            }
                        </div>
                    </div>
                </div>
                <Tab.Container defaultActiveKey='info'>
                    {
                        this.hasContactos(lead) ?
                            <Nav className="nav nav-bolder nav-pills border-0 nav-light-primary mb-10 justify-content-center mt-5">
                                <Nav.Item className="nav-item">
                                    <Nav.Link eventKey="info">
                                        <span className="nav-text">INFORMACIÓN GENERAL</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="nav-item">
                                    <Nav.Link eventKey="contactos">
                                        <span className="nav-text">HISTORIAL DE CONTACTO</span>
                                    </Nav.Link>
                                </Nav.Item>
                                {
                                    this.hasPresupuestoDiseno(lead) ?
                                        <Nav.Item className="nav-item">
                                            <Nav.Link eventKey="presupuesto">
                                                <span className="nav-text">Presupuesto</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                        : <></>
                                }
                            </Nav>
                            : <></>
                    }
                    <Tab.Content>
                        <Tab.Pane eventKey='presupuesto'>
                            {
                                this.hasPresupuestoDiseno(lead) ?
                                    <PresupuestoList pdfs={lead.presupuesto_diseño.pdfs}/>
                                : this.noHayAdjuntos()
                            }
                        </Tab.Pane>
                        <Tab.Pane eventKey='contactos'>
                            <div className="row mx-0 justify-content-center">
                                <div className="col-md-10">
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
                                                                    return this.printTimeLineContact(contacto, key)
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
                                                        <Pagination itemClass="page-item" firstPageText='Primero' lastPageText='Último'
                                                            activePage={activePage} itemsCountPerPage={itemsPerPage} totalItemsCount={lead.prospecto.contactos.length}
                                                            pageRangeDisplayed={5} onChange={this.onChangePage.bind(this)} itemClassLast="d-none"
                                                            itemClassFirst="d-none" prevPageText={<i className='ki ki-bold-arrow-back icon-xs' />}
                                                            nextPageText={<i className='ki ki-bold-arrow-next icon-xs' />}
                                                            linkClassPrev="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                            linkClassNext="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                            linkClass="btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 pagination"
                                                            activeLinkClass="btn btn-icon btn-sm border-0 btn-light btn-hover-primary active mr-2 my-1 pagination"
                                                        />
                                                    </div>
                                                    : ''
                                                : ''
                                            : ''
                                    }
                                </div>
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey='info'>
                            <div className="row mx-auto mt-10 col-md-12">
                                <div className="col-md-6 form-group">
                                    <div className="d-flex justify-content-start">
                                        <SymbolIcon tipo='primary' urlIcon='las la-phone icon-xl'/>
                                        <div>
                                            <a target="_blank" href={`tel:+${lead.telefono}`} rel="noopener noreferrer"
                                                className="font-size-lg text-dark-75 font-weight-bolder text-hover-primary">
                                                {lead.telefono}
                                            </a>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">TELÉFONO</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 form-group">
                                    <div className="d-flex justify-content-start">
                                        <SymbolIcon tipo='info' urlIcon='flaticon2-calendar-9 icon-lg'/>
                                        <div>
                                            <div className="font-size-lg text-dark-75 font-weight-bolder">{dayDMY(lead.created_at)}</div>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    lead.origen &&
                                    <div className="col-md-6 form-group">
                                        <div className="d-flex justify-content-start">
                                            <SymbolIcon tipo='primary' urlIcon='las la-mail-bulk icon-xl'/>
                                            <div>
                                                <div className="font-size-lg text-dark-75 font-weight-bolder">{lead.origen.origen}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">Origen</div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="col-md-6 form-group">
                                    <div className="d-flex justify-content-start">
                                        <SymbolIcon tipo='info' urlIcon='las la-envelope icon-xl' />
                                        <div className="text-truncate">
                                            <a target="_blank" href={`mailto:+${lead.email}`} rel="noopener noreferrer"
                                                className="font-size-lg text-dark-75 font-weight-bolder text-hover-primary">
                                                {lead.email}
                                            </a>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">CORREO ELECTRÓNICO</div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    lead.servicios ?
                                        lead.servicios.length > 0 ?
                                            <div className="col-md-6 text-truncate form-group">
                                                <div className="d-flex justify-content-start">
                                                    <SymbolIcon tipo='primary' urlIcon='las la-toolbox icon-xl' />
                                                    <div>
                                                        <ul className="list-inline mb-0 font-size-lg text-dark-75 font-weight-bolder">
                                                            {
                                                                lead.servicios.map((servicio, key) => {
                                                                    return (
                                                                        <li className="list-inline-item" key={key}>&#8226; {servicio.servicio}</li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                        <div className="font-size-sm text-muted font-weight-bold mt-1">Servicios</div>
                                                    </div>
                                                </div>
                                            </div>
                                            : ''
                                        : ''
                                }
                                {
                                    lead.comentario &&
                                    <div className='col-md-12'>
                                        <div className="bg-gray-100 p-3 font-size-lg font-weight-light text-justify" >
                                            <strong >Comentario: </strong>{lead.comentario}
                                        </div>
                                    </div>
                                }
                            </div>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </>
        );
    }
}

export default OneLead