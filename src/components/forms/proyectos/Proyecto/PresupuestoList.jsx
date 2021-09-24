import React, { Component } from 'react'
import { Card, OverlayTrigger, Tooltip, Col, Row } from 'react-bootstrap'
import { setSingleHeader } from '../../../../functions/routers'
import SVG from "react-inlinesvg";
import axios from 'axios'
import { URL_DEV } from '../../../../constants'
import { toAbsoluteUrl } from "../../../../functions/routers"
import { dayDMY } from '../../../../functions/setters'
import { deleteAlert, errorAlert, printResponseErrorAlert, doneAlert, waitAlert } from '../../../../functions/alert'
import { Budget } from '../../../../components/Lottie/'
import Swal from 'sweetalert2';
class PresupuestoList extends Component {

    state = {
        accordion: [],
        presupuestos: []
    }

    componentDidMount = () => {
        this.getPresupuestos()
    }

    getPresupuestos = async() => {
        const { at, proyecto } = this.props
        waitAlert()
        await axios.get(`${URL_DEV}v3/proyectos/proyectos/${proyecto.id}/presupuestos`, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { presupuestos } = response.data
                Swal.close()
                this.setState({ ...this.state, presupuestos: presupuestos })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deletePresupuesto = async(id) => {
        waitAlert()
        const { at } = this.props
        await axios.delete(`${URL_DEV}v2/presupuesto/presupuestos/${id}`, { headers: setSingleHeader(at) }).then(
            (response) => {
                doneAlert(`Presupuesto eliminado con éxito`,  () => { this.getPresupuestos() })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    handleAccordion = (presupuesto) => {
        const { presupuestos } = this.state;
        presupuestos.forEach((element, key) => {
            if (element.id === presupuesto.id) {
                element.isActive = element.isActive ? false : true
            }else {
                element.isActive = false
            }
        })
        this.setState({ ...this.state, accordion: presupuestos });
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
        switch(pdfs.length){
            case 0:
                return 'Sin identificador'
            case 1:
                return (
                    <span>
                        Identificador: 
                        <a href = { pdfs[0].url } target = '_blank' rel="noopener noreferrer" className = 'ml-2'>
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
                                    <a key = { key } href = { pdf.url } target = '_blank' rel="noopener noreferrer" className = 'ml-2'>
                                    { key === pdfs.length - 1 ? 'Y ' : '' }     
                                        {pdf.pivot.identificador}
                                    </a>
                                )
                            })
                        }
                    </span>
                )
        }
    }

    printPresupuestos = () => {
        const { presupuestos } = this.state
        const { editPresupuesto } = this.props
        return(
            <div className="table-responsive">
                <div className="list min-w-650px col-md-11 mx-auto">
                    <div className="accordion accordion-light accordion-svg-toggle">
                        {
                            presupuestos.map((presupuesto, key) => {
                                return (
                                    <Card className="w-auto" key={key}>
                                        <Card.Header >
                                            <Card.Title className={`rounded-0 ${(presupuesto.isActive) ? 'text-primary2 collapsed' : 'text-dark'}`} 
                                                onClick={() => { this.handleAccordion(presupuesto) }}>
                                                <span className={`svg-icon ${presupuesto.isActive ? 'svg-icon-primary2' : 'svg-icon-dark'}`}>
                                                    <SVG src={toAbsoluteUrl('/images/svg/Angle-right.svg')} />
                                                </span>
                                                <div className="card-label ml-3 row mx-0 justify-content-between w-100">
                                                    <div className="w-70">
                                                        <div className="font-size-lg mb-1">
                                                            { this.printIdentificadores(presupuesto.pdfs)}
                                                        </div>
                                                        <div className="font-weight-light font-size-sm text-dark-75">
                                                            { presupuesto.area.nombre } - {dayDMY(presupuesto.fecha)}
                                                        </div>
                                                    </div>
                                                    <div className="align-self-center d-flex w-30">
                                                        <div className="w-100 d-flex">
                                                            <div className="align-self-center w-60 text-center">
                                                                <span style={{ display: 'inline-flex', padding: '0.5em 0.85em', fontSize: '.68rem',
                                                                        fontWeight: 600, lineHeight:1, backgroundColor:`${presupuesto.estatus.fondo}`, 
                                                                        color: `${presupuesto.estatus.letra}`, textAlign:'center', border: 'transparent', 
                                                                        whiteSpace:'nowrap', verticalAlign:'baseline', borderRadius:'0.475rem', 
                                                                        justifyContent: 'center', alignItems: 'center' }}>
                                                                    { presupuesto.estatus.estatus }
                                                                </span>
                                                            </div>
                                                            <div className="w-40 text-right">
                                                                {
                                                                    this.canWork(presupuesto) ? 
                                                                        <OverlayTrigger rootClose 
                                                                            overlay={ <Tooltip> <span className='font-weight-bolder'>EDITAR</span> </Tooltip>}>
                                                                            <span className={`btn btn-icon ${presupuesto.isActive ?
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
                                                                            <span className={`btn btn-icon ${presupuesto.isActive ? 'btn-color-danger': ''} btn-active-light-danger w-30px h-30px`}
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
                                        <Card.Body className={`card-body px-10 ${presupuesto.isActive ? 'collapse show' : 'collapse'}`}>
                                            <Row className="mx-0">
                                                <Col md={9} className="mb-5 mx-auto d-flex justify-content-center">
                                                    PDF PRESUPUESTO
                                                </Col>
                                            </Row>
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
        const { presupuestos } = this.state
        return ( <div> { presupuestos.length ? this.printPresupuestos() : this.printEmpty() } </div> )
    }
}

export default PresupuestoList