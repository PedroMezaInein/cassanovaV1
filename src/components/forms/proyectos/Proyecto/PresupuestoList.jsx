import React, { Component } from 'react'
import axios from 'axios'
import { URL_DEV } from '../../../../constants'
import { PresupuestoAnswer } from '../../../forms'
import { dayDMY } from '../../../../functions/setters'
import { Budget } from '../../../../components/Lottie/'
import { setSingleHeader } from '../../../../functions/routers'
import { Card, OverlayTrigger, Tooltip, Col, Row } from 'react-bootstrap'
import { deleteAlert, errorAlert, printResponseErrorAlert, doneAlert, waitAlert } from '../../../../functions/alert'
class PresupuestoList extends Component {

    state = {
        accordion: [],
        presupuestos: [],
        activeAccordion: null
    }

    deletePresupuesto = async(id) => {
        waitAlert()
        const { at } = this.props
        await axios.delete(`${URL_DEV}v2/presupuesto/presupuestos/${id}`, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { refresh } = this.props
                doneAlert(`Presupuesto eliminado con éxito`,  () => { refresh() } )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    handleAccordion = (presupuesto) => {
        const { activeAccordion } = this.state
        if(activeAccordion === null){
            this.setState({ ...this.state, activeAccordion: presupuesto.id })
        }else{
            if(presupuesto.id.toString() === activeAccordion.toString()){
                this.setState({ ...this.state, activeAccordion: null })
            }else{
                this.setState({ ...this.state, activeAccordion: presupuesto.id })
            }
        }
    }

    printEmpty = () => {
        return(
            <Budget/>
        )
    }

    canWork = pres => {
        if(pres.estatus){
            switch(pres.estatus.estatus){
                case 'Conceptos':
                case 'Volumetrías':
                case 'En revisión':
                    return true
                default: break;
            }
        }
        return false
    }

    printIdentificadores = (pdfs) => {
        pdfs.sort(function(a, b) {
            return a.id - b.id;
        });
        switch(pdfs.length){
            case 0:
                return 'Sin identificador'
            case 1:
                return (
                    <span>
                        Identificador: 
                        <a href = { pdfs[0].url } target = '_blank' rel="noopener noreferrer" className={`mx-2 ${pdfs[0].pivot.url!==null?'identificador-aceptado':''}`}>
                            {pdfs[0].pivot.identificador}
                        </a>
                    </span>
                )
            default:
                return(
                    <span>
                        Identificadores: {
                            pdfs.map((pdf, key) => {
                                
                                return(
                                    <a key = { key } href = { pdf.url } target = '_blank' rel="noopener noreferrer">
                                        { key === pdfs.length - 1 ? ' Y ' : ' ' }<span className={`${pdf.pivot.url!==null?'identificador-aceptado':''}`}>{pdf.pivot.identificador}</span>{ key === pdfs.length - 1 || key === pdfs.length - 2 ? '' : ',' }  
                                    </a>
                                )
                            })
                        }
                    </span>
                )
        }
    }
    labelStatus = presupuesto => {
        return(
            <span style={{
                display: 'inline-flex', padding: '0.5em 0.85em', fontSize: '.68rem',
                fontWeight: 600, lineHeight: 1, backgroundColor: `${presupuesto.estatus.fondo}`,
                color: `${presupuesto.estatus.letra}`, textAlign: 'center', border: 'transparent',
                whiteSpace: 'nowrap', verticalAlign: 'baseline', borderRadius: '0.475rem',
                justifyContent: 'center', alignItems: 'center'
            }}>
                {presupuesto.estatus.estatus}
            </span>
        )
    }
    getSVG = presupuesto => {
        const { activeAccordion } = this.state
        if(activeAccordion === null){
            if(presupuesto.pdfs.length <= 0){
                return(
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="5" fill='none'></rect>
                        <rect x="6.0104" y="10.9247" width="12" height="2" rx="1" fill='none'></rect>
                    </svg>
                )
            }else{
                return(
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="5" fill={`${presupuesto.hasTickets ? "#9E9D24" : "#EF6C00"}`}></rect>
                        <rect x="10.8891" y="17.8033" width="12" height="2" rx="1" transform="rotate(-90 10.8891 17.8033)" fill={`${presupuesto.hasTickets ? "#9E9D24" : "#EF6C00"}`}></rect>
                        <rect x="6.01041" y="10.9247" width="12" height="2" rx="1" fill={`${presupuesto.hasTickets ? "#9E9D24" : "#EF6C00"}`}></rect>
                    </svg>
                )
            }
        }
        if(presupuesto.pdfs.length <= 0){
            return(
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="5" fill='none'></rect>
                    <rect x="6.0104" y="10.9247" width="12" height="2" rx="1" fill='none'></rect>
                </svg>
            )
        }
        if(presupuesto.id.toString() === activeAccordion.toString()){
            return(
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="5" fill={`${presupuesto.hasTickets ? "#9E9D24" : "#EF6C00"}`}></rect>
                    <rect x="6.0104" y="10.9247" width="12" height="2" rx="1" fill={`${presupuesto.hasTickets ? "#9E9D24" : "#EF6C00"}`}></rect>
                </svg>
            )
        }else{
            return(
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="5" fill={`${presupuesto.hasTickets ? "#9E9D24" : "#EF6C00"}`}></rect>
                    <rect x="10.8891" y="17.8033" width="12" height="2" rx="1" transform="rotate(-90 10.8891 17.8033)" fill={`${presupuesto.hasTickets ? "#9E9D24" : "#EF6C00"}`}></rect>
                    <rect x="6.01041" y="10.9247" width="12" height="2" rx="1" fill={`${presupuesto.hasTickets ? "#9E9D24" : "#EF6C00"}`}></rect>
                </svg>
            )
        }
    }
    printPresupuestos = () => {
        const { activeAccordion } = this.state
        const { editPresupuesto, at, presupuestos, refresh, proyecto } = this.props
        return(
            <div className="table-responsive">
                <div className="list min-w-650px col-md-11 mx-auto">
                    <div className="accordion accordion-light">
                        {
                            presupuestos.map((presupuesto, key) => {
                                return (
                                    <Card key={key} className={`w-auto ${(presupuesto.id ===  activeAccordion) ? 'border-top-0' : ''}`} >
                                        <Card.Header >
                                            <Card.Title className={`rounded px-2 ${(presupuesto.id ===  activeAccordion) ? 'collapsed bg-light' : 'text-dark'}`} 
                                                onClick={() => { this.handleAccordion(presupuesto) }}
                                                >
                                                <span className='svg-icon svg-icon-sm'>
                                                    {this.getSVG(presupuesto)}
                                                    
                                                </span>
                                                <div className="card-label ml-2 row mx-0 justify-content-between w-100">
                                                    <div className="w-70 d-flex">
                                                        <div className="mx-2 align-self-center">
                                                            <div className="d-flex align-items-center justify-content-center">
                                                                <i style={{ color: `${presupuesto.hasTickets ? "#9E9D24" : "#EF6C00"}` }} className={`las la-${presupuesto.hasTickets ? 'ticket-alt' : 'hard-hat'} icon-xl mr-2`}></i>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-size-lg mb-2">
                                                                { this.printIdentificadores(presupuesto.pdfs)}
                                                            </div>
                                                            <div className="font-weight-light font-size-sm text-dark-75">
                                                                { presupuesto.area.nombre } - {dayDMY(presupuesto.fecha)} - {`${presupuesto.tiempo_ejecucion} ${presupuesto.tiempo_ejecucion === '1'?'día':'días'} de ejecución`} 
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="align-self-center d-flex w-30">
                                                        <div className="w-100 d-flex">
                                                            <div className="align-self-center w-60 text-center">
                                                                {this.labelStatus(presupuesto)}
                                                            </div>
                                                            <div className="w-40 text-right">
                                                                {
                                                                    this.canWork(presupuesto) ? 
                                                                        <OverlayTrigger rootClose 
                                                                            overlay={ <Tooltip> <span className='font-weight-bolder'>EDITAR</span> </Tooltip>}>
                                                                            <span className={`btn btn-icon ${(presupuesto.id ===  activeAccordion) ?
                                                                                'btn-color-primary2'
                                                                                : ''}  btn-active-light-primary2 w-30px h-30px mr-2`}
                                                                                onClick = { (e) => { e.preventDefault(); editPresupuesto(presupuesto); } } >
                                                                                <i className="las la-pencil-alt icon-xl"></i>
                                                                            </span>
                                                                        </OverlayTrigger>
                                                                    : <></>
                                                                }
                                                                {
                                                                    this.canWork(presupuesto) ?
                                                                        <OverlayTrigger rootClose
                                                                            overlay={ <Tooltip> <span className='font-weight-bolder'>ELIMINAR</span> </Tooltip>}>
                                                                            <span className={`btn btn-icon ${(presupuesto.id ===  activeAccordion) ? 'btn-color-danger': ''} btn-active-light-danger w-30px h-30px`}
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    deleteAlert(
                                                                                        `ELIMINARÁS EL PRESUPUESTO`,
                                                                                        '¿DESEAS CONTINUAR?',
                                                                                        () => this.deletePresupuesto(presupuesto.id))
                                                                                    }} >
                                                                                <i className="las la-trash icon-xl"></i>
                                                                            </span>
                                                                        </OverlayTrigger>
                                                                    : <></>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>      
                                                </div>
                                            </Card.Title>
                                        </Card.Header>
                                        <Card.Body className={`card-body ${presupuesto.id === activeAccordion && presupuesto.pdfs.length > 0 ? 'collapse show' : 'collapse'}`}>
                                            {
                                                presupuesto.id === activeAccordion ?
                                                    <PresupuestoAnswer presupuestos={presupuestos} presupuesto={presupuesto} at={at}
                                                        getPresupuestos={refresh} proyecto={proyecto} />
                                                    : <></>
                                            }
                                        </Card.Body>
                                    </Card>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { presupuestos } = this.props
        return ( <div> { presupuestos.length ? this.printPresupuestos() : this.printEmpty() } </div> )
    }
}

export default PresupuestoList