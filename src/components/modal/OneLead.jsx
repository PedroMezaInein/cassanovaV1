import React, { Component } from 'react'
import { Nav, Tab } from 'react-bootstrap'
import { FileItem, SymbolIcon } from '../singles'
import Moment from 'react-moment'
import { setContactoIcon, setDateTableLG } from '../../functions/setters'
import { deleteAlert } from '../../functions/alert'
import { toAbsoluteUrl } from '../../functions/routers'
import SVG from "react-inlinesvg";
import Pagination from 'react-js-pagination'

class OneLead extends Component{

    state = {
        activePage: 1,
        itemsPerPage: 5
    }

    hasContactos = () => {
        const { lead } = this.props
        if(lead)
            if(lead.prospecto)
                if(lead.prospecto.contactos)
                    if(lead.prospecto.contactos.length)
                        return true
        return false
    }

    hasPresupuesto = () => {
        const { lead } = this.props
        if(lead)
            if(lead.presupuesto_diseño)
                if(lead.presupuesto_diseño.pdfs)
                    if(lead.presupuesto_diseño.pdfs.length)
                        return true
        return false
    }

    printTimeLineContact = (contacto, key) => {
        const { eliminarContacto } = this.props
        return(
            <div className = 'timeline timeline-6' key = { key }>
                <div className = 'timeline-items'>
                    <div className = 'timeline-item'>
                        <div className = { contacto.success ? "timeline-media bg-light-success" : "timeline-media bg-light-danger" } >
                            <span className = {contacto.success ? "svg-icon svg-icon-success svg-icon-md" : "svg-icon svg-icon-danger  svg-icon-md"}>
                                { setContactoIcon(contacto) }
                            </span>
                        </div>
                        <div className = { contacto.success ? "timeline-desc timeline-desc-light-success" : "timeline-desc timeline-desc-light-danger" } >
                            <span className = {contacto.success ? "font-weight-bolder text-success" : "font-weight-bolder text-danger" } >
                                { setDateTableLG(contacto.created_at) }
                            </span>
                            <div className="font-weight-light pb-2 text-justify position-relative mt-2 pr-3" 
                                style={{ borderRadius: '0.42rem', padding: '1rem 1.5rem', backgroundColor: '#F3F6F9' }}>
                                <div className = "text-dark-75 font-weight-bold mb-2">
                                    <div className = "d-flex justify-content-between">
                                        { contacto.tipo_contacto ? contacto.tipo_contacto.tipo : '' }
                                        {
                                            eliminarContacto ?
                                                <span className="text-muted text-hover-danger font-weight-bold a-hover"
                                                    onClick={(e) => { deleteAlert('¿ESTÁS SEGURO QUE DESEAS ELIMINAR EL CONTACTO?', '¡NO PODRÁS REVERTIR ESTO!', () => eliminarContacto(contacto)) }}>
                                                    <i className="flaticon2-cross icon-xs" />
                                                </span>
                                            : ''
                                        }
                                    </div>
                                </div>
                                { contacto.comentario }
                                <span className="blockquote-footer font-weight-lighter ml-2 d-inline">
                                    {contacto.user.name}
                                </span>
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
    }

    onChangePage(pageNumber){
        let { activePage } = this.state
        activePage = pageNumber
        this.setState({
            ...this.state,
            activePage
        })
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

    render(){
        const { lead } = this.props
        const { activePage, itemsPerPage } = this.state
        return(
            <div>
                <div className="d-flex justify-content-between mt-4 py-3">
                    <p className="font-size-h4 text-muted font-size-lg m-0 align-self-center">
                        Nombre:&nbsp; <strong className="font-size-h5">
                        {lead.nombre}
                        </strong>
                    </p>
                    {
                        lead.estatus ? 
                            <span className="navi-link">
                                <span className="navi-text">
                                    <span className="label label-xl label-inline w-100 font-weight-bolder" 
                                        style = { { backgroundColor: lead.estatus.color_fondo, color: lead.estatus.color_texto, border: 'transparent' } }>
                                            { lead.estatus.estatus.toUpperCase() }
                                    </span>
                                </span>
                            </span>
                        : ''
                    }
                </div>
                <div className="separator separator-solid my-4" />
                <Tab.Container defaultActiveKey = 'info'>
                    
                    <Nav className = {
                        this.hasContactos() || this.hasPresupuesto() ?
                            "nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0 mb-9 justify-content-end nav"
                        : 'd-none' 
                    }>
                        <Nav.Item className="nav-item">
                            <Nav.Link eventKey="info">
                                <span className="nav-text font-weight-bold">INFORMACIÓN GENERAL</span>
                            </Nav.Link>
                        </Nav.Item>
                        {
                            this.hasContactos() ?  
                                <Nav.Item className="nav-item">
                                    <Nav.Link eventKey="contactos">
                                        <span className="nav-text font-weight-bold">HISTORIAL DE CONTACTO</span>
                                    </Nav.Link>
                                </Nav.Item>
                            : ''
                        }
                        {
                            this.hasPresupuesto() ?
                                <Nav.Item className="nav-item">
                                    <Nav.Link eventKey="presupuesto">
                                        <span className="nav-text font-weight-bold">Presupuesto</span>
                                    </Nav.Link>
                                </Nav.Item>
                            : ''
                        }
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane eventKey = 'presupuesto'> 
                            <div className="table-responsive mt-4">
                                <table className="table table-vertical-center">
                                    <thead className="thead-light">
                                        <tr className="text-dark-75">
                                            <th className="pl-2 text-align-last-left" style={{ minWidth: "150px" }}>Adjunto</th>
                                            <th style={{ minWidth: "80px" }} className="text-center">Fecha</th>
                                            <th style={{ minWidth: "80px" }} className="text-center">Fecha de envio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.hasPresupuesto()?lead.presupuesto_diseño.pdfs.map((pdf, key) => {return(<FileItem item = { pdf } key = { key } secondDate={true} anotherDate = { pdf ? pdf.pivot ? pdf.pivot.fecha_envio ? pdf.pivot.fecha_envio : '' : '' : '' }/>)}):<tr className="text-center text-dark-75"><th className="pl-2" colSpan = "3" >NO HAY ADJUNTOS</th></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey = 'info'>
                            <div className = "row mx-0 px-lg-2">
                                {
                                    lead.empresa ? 
                                        <div className="col-md-3 text-truncate form-group">
                                            <div className="d-flex justify-content-start">
                                                <SymbolIcon tipo = 'info' urlIcon = '/images/svg/Building.svg' />
                                                <div>
                                                    <div className="font-size-h6 text-dark-75 font-weight-bolder">{lead.empresa.name}</div>
                                                    <div className="font-size-sm text-muted font-weight-bold mt-1">Empresa</div>
                                                </div>
                                            </div>
                                        </div>
                                    : ''
                                }
                                <div className="col-md-3 text-truncate form-group">
                                    <div className="d-flex justify-content-start mr-2">
                                        <SymbolIcon tipo = 'primary' urlIcon = '/images/svg/iPhone-X.svg' />
                                        <div>
                                            <a target="_blank" href={`tel:+${lead.telefono}`} rel="noopener noreferrer"
                                                className="font-size-h6 text-dark-75 font-weight-bolder text-hover-primary">
                                                { lead.telefono }
                                            </a>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">TELÉFONO</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 text-truncate form-group">
                                    <div className="d-flex justify-content-start mr-2">
                                        <SymbolIcon tipo = 'info' urlIcon = '/images/svg/Box1.svg' />
                                        <div>
                                            <div className="font-size-h6 text-dark-75 font-weight-bolder"><Moment format="DD/MM/YYYY">{lead.created_at}</Moment></div>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 text-truncate form-group">
                                    <div className="d-flex justify-content-start mr-2">
                                        <SymbolIcon tipo = 'primary' urlIcon = '/images/svg/Mail.svg' />
                                        <div>
                                            <a target="_blank" href={`mailto:+${lead.email}`} rel="noopener noreferrer"
                                                className="font-size-h6 text-dark-75 font-weight-bolder text-hover-primary">
                                                { lead.email }
                                            </a>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">CORREO ELECTRÓNICO</div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    lead.origen ? 
                                        <div className="col-md-3 mt-4 text-truncate form-group">
                                            <div className="d-flex justify-content-start mr-2">
                                                <SymbolIcon tipo = 'primary' urlIcon = '/images/svg/Folder-cloud.svg' />
                                                <div>
                                                    <div className="font-size-h6 text-dark-75 font-weight-bolder">{lead.origen.origen}</div>
                                                    <div className="font-size-sm text-muted font-weight-bold mt-1">Origen</div>
                                                </div>
                                            </div>
                                        </div>
                                    : ''
                                }
                                {
                                    lead.servicios ?
                                        lead.servicios.length>0?
                                            <div className="col-md-9 mt-4 text-truncate form-group">
                                                <div className="d-flex justify-content-start mr-2">
                                                    <SymbolIcon tipo = 'info' urlIcon = '/images/svg/Tools.svg' />
                                                    <div>
                                                        <ul className="list-inline mb-0 font-size-h6 text-dark-75 font-weight-bolder">
                                                            {
                                                                lead.servicios.map((servicio, key) => {
                                                                    return ( <li className="list-inline-item" key={key}>&#8226; {servicio.servicio}</li> )
                                                                })
                                                            }
                                                        </ul>
                                                        <div className="font-size-sm text-muted font-weight-bold mt-1">Servicios</div>
                                                    </div>
                                                </div>
                                            </div>
                                        :''
                                    :''
                                }
                                {
                                    lead.comentario?
                                        <div className = 'col-md-12 mt-4'>
                                            <div className="bg-gray-100 p-3 font-size-lg font-weight-light text-justify" >
                                                <strong >Comentario: </strong>{lead.comentario}
                                            </div>
                                        </div>
                                    :''
                                }
                                
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey = 'contactos'>
                            <div className = "row mx-0 justify-content-center">
                                <div className="col-md-7 pt-4">
                                    {
                                        this.hasContactos() ? 
                                        <>
                                            { this.printContactCount(lead.prospecto.contactos) }
                                            {
                                                lead.prospecto.contactos.map((contacto, key) => {
                                                    let limiteInferior = (activePage - 1) * itemsPerPage
                                                    let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                                    if(contacto.length < itemsPerPage || ( key >= limiteInferior && key <= limiteSuperior))
                                                        return this.printTimeLineContact(contacto, key)
                                                    return false
                                                })
                                            }
                                        </>
                                        :
                                            <div className="text-center text-dark-75 font-weight-bolder font-size-lg">No se ha registrado ningún contacto</div>
                                    }
                                    {
                                        this.hasContactos() ?
                                            lead.prospecto.contactos.length > itemsPerPage ?
                                                <div className="d-flex justify-content-center mt-4">
                                                    <Pagination itemClass="page-item"  firstPageText = 'Primero' lastPageText = 'Último'
                                                        activePage = { activePage } itemsCountPerPage = { itemsPerPage } totalItemsCount = { lead.prospecto.contactos.length }
                                                        pageRangeDisplayed = { 5 } onChange={this.onChangePage.bind(this)} itemClassLast="d-none" 
                                                        itemClassFirst="d-none" prevPageText={<i className='ki ki-bold-arrow-back icon-xs'/>}
                                                        nextPageText={<i className='ki ki-bold-arrow-next icon-xs'/>}
                                                        linkClassPrev="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                        linkClassNext="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                        linkClass="btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 pagination"
                                                        activeLinkClass="btn btn-icon btn-sm border-0 btn-light btn-hover-primary active mr-2 my-1 pagination" />
                                                </div>
                                            : ''
                                        : ''
                                    }
                                    {/*     {
                                            lead ? 
                                                lead.prospecto ?
                                                    lead.prospecto.contactos.length > itemsPerPage ?
                                                        <div className="d-flex justify-content-center mt-4">
                                                            <Pagination itemClass="page-item"  firstPageText = 'Primero' lastPageText = 'Último'
                                                                activePage = { activePage } itemsCountPerPage = { itemsPerPage } totalItemsCount = { lead.prospecto.contactos.length }
                                                                pageRangeDisplayed = { 5 } onChange={this.onChangePage.bind(this)} itemClassLast="d-none" 
                                                                itemClassFirst="d-none" prevPageText={<i className='ki ki-bold-arrow-back icon-xs'/>}
                                                                nextPageText={<i className='ki ki-bold-arrow-next icon-xs'/>}
                                                                linkClassPrev="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                                linkClassNext="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                                linkClass="btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 pagination"
                                                                activeLinkClass="btn btn-icon btn-sm border-0 btn-light btn-hover-primary active mr-2 my-1 pagination"
                                                                />
                                                        </div>
                                                    : ''
                                                : ''
                                            : ''
                                        } */}
                                    </div>
                                </div>
                            </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </div>
        )
    }
}

export default OneLead