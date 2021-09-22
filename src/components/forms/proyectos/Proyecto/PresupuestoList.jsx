import React, { Component } from 'react'
import { Card, OverlayTrigger, Tooltip, Col, Row } from 'react-bootstrap'
import { setSingleHeader } from '../../../../functions/routers'
import SVG from "react-inlinesvg";
import axios from 'axios'
import { URL_DEV } from '../../../../constants'
import { toAbsoluteUrl } from "../../../../functions/routers"
import { dayDMY } from '../../../../functions/setters'
import { deleteAlert, errorAlert, printResponseErrorAlert, doneAlert, waitAlert } from '../../../../functions/alert'
class PresupuestoList extends Component {
    state = {
        accordion: []
    }
    handleAccordion = (indiceClick) => {
        const { proyecto: { avances } } = this.props;
        avances.forEach((element, key) => {
            if (element.id === indiceClick) {
                element.isActive = element.isActive ? false : true
            }else {
                element.isActive = false
            }
        })
        this.setState({
            accordion: avances
        });
    }
    deleteAvance = async(id) => {
        const { at } = this.props
        waitAlert()
        await axios.delete(`${URL_DEV}`, { headers: setSingleHeader(at) }).then(
            (response) => {
                doneAlert('Presupuesto eliminado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    render() {
        const { proyecto } = this.props
        console.log(proyecto, 'proyecto')
        return (
            <div>
                {
                    proyecto ?
                        proyecto.avances ?
                            proyecto.avances.length ?
                                <div className="d-flex justify-content-center">
                                    <div className="col-md-11">
                                        <div className="accordion accordion-light accordion-svg-toggle">
                                            {
                                                proyecto.avances.map((avance, key) => {
                                                    return (
                                                        <Card className="w-auto" key={key}>
                                                            <Card.Header >
                                                                <Card.Title className={`rounded-0 ${(avance.isActive) ? 'text-primary2 collapsed' : 'text-dark'}`} onClick={() => { this.handleAccordion(avance.id) }}>
                                                                    <span className={`svg-icon ${avance.isActive ? 'svg-icon-primary2' : 'svg-icon-dark'}`}>
                                                                        <SVG src={toAbsoluteUrl('/images/svg/Angle-right.svg')} />
                                                                    </span>
                                                                    <div className="card-label ml-3 row mx-0 justify-content-between">
                                                                        <div>
                                                                            <div className="font-size-lg mb-1">PES00101</div>
                                                                            <div className="font-weight-light font-size-sm text-dark-75">
                                                                                DEVOLUCION - {dayDMY(avance.fecha_inicio)}
                                                                            </div>
                                                                        </div>
                                                                        <div className="align-self-center d-flex">
                                                                            <div className="align-self-center">
                                                                                <span className="mr-15"
                                                                                    style={{
                                                                                        display: 'inline-flex',
                                                                                        padding: '0.5em 0.85em',
                                                                                        fontSize: '.65rem',
                                                                                        fontWeight: 600,
                                                                                        lineHeight:1,
                                                                                        backgroundColor:`#fff2e8c2`,
                                                                                        color: `#ff8c2c`,
                                                                                        textAlign:'center',
                                                                                        border: 'transparent',
                                                                                        whiteSpace:'nowrap',
                                                                                        verticalAlign:'baseline',
                                                                                        borderRadius:'0.475rem',
                                                                                        justifyContent: 'center',
                                                                                        alignItems: 'center'
                                                                                    }}>
                                                                                    CONCEPTOS
                                                                                </span>
                                                                            </div>
                                                                            <OverlayTrigger rootClose 
                                                                                overlay={ <Tooltip> <span className='font-weight-bolder'>EDITAR</span> </Tooltip>}>
                                                                                <span className={`btn btn-icon ${avance.isActive ?
                                                                                        'btn-color-success2'
                                                                                        : ''}  btn-active-light-success2 w-30px h-30px mr-2`}>
                                                                                    <i className="las la-pencil-alt icon-xl"></i>
                                                                                </span>
                                                                            </OverlayTrigger>
                                                                            <OverlayTrigger rootClose 
                                                                                overlay={ <Tooltip> <span className='font-weight-bolder'>DESCARGAR PRESUPUESTO</span> </Tooltip>}>
                                                                                <a rel="noopener noreferrer" href={avance.pdf} target="_blank"
                                                                                    className={`btn btn-icon ${avance.isActive ?
                                                                                        'btn-color-primary2'
                                                                                        : ''}  btn-active-light-primary2 w-30px h-30px mr-2`}>
                                                                                    <i className="las la-file-download icon-xl"></i>
                                                                                </a>
                                                                            </OverlayTrigger>
                                                                            <OverlayTrigger rootClose
                                                                                overlay={ <Tooltip> <span className='font-weight-bolder'>ELIMINAR</span> </Tooltip>}>
                                                                                <span className={`btn btn-icon ${avance.isActive ? 'btn-color-danger': ''} btn-active-light-danger w-30px h-30px mr-2`}
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        deleteAlert(
                                                                                            `DESEAS ELIMINAR EL PRESUPUESTO ${avance.semana}`,
                                                                                            '¿DESEAS CONTINUAR?',
                                                                                            () => this.deleteAvance(avance.id))
                                                                                    }}
                                                                                    >
                                                                                    <i className="las la-trash icon-xl"></i>
                                                                                </span>
                                                                            </OverlayTrigger>
                                                                        </div>
                                                                        
                                                                    </div>
                                                                </Card.Title>
                                                            </Card.Header>
                                                            <Card.Body className={`card-body px-10 ${avance.isActive ? 'collapse show' : 'collapse'}`}>
                                                                <Row className="mx-0">
                                                                    <Col md={9} className="mb-5 mx-auto d-flex justify-content-center">
                                                                        PDF PRESUPUESTO
                                                                    </Col>
                                                                </Row>
                                                            </Card.Body>
                                                        </Card>
                                                    )
                                                }
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                : ''
                            : ''
                        : ''
                }
            </div>
        )
    }
}

export default PresupuestoList