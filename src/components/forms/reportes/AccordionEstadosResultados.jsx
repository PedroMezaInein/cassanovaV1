import React, { Component } from 'react'
import {Accordion, Card} from 'react-bootstrap'


export function openAccordion1() { 
    document.getElementById('card-title1').classList.remove("collapsed")
    document.getElementById('collapse1').classList.add("show")
    document.getElementById('card-title1').setAttribute("aria-expanded", "true");

    document.getElementById('card-title2').classList.add("collapsed")
    document.getElementById('collapse2').classList.remove("show")
    document.getElementById('card-title2').removeAttribute("aria-expanded", "true");
    document.getElementById('card-title2').setAttribute("aria-expanded", "false");

    document.getElementById('card-title3').classList.add("collapsed")
    document.getElementById('collapse3').classList.remove("show")
    document.getElementById('card-title3').removeAttribute("aria-expanded", "true");
    document.getElementById('card-title3').setAttribute("aria-expanded", "false");

}

export function openAccordion2() { 
    document.getElementById('card-title2').classList.remove("collapsed")
    document.getElementById('collapse2').classList.add("show")
    document.getElementById('card-title2').setAttribute("aria-expanded", "true");

    document.getElementById('card-title1').classList.add("collapsed")
    document.getElementById('collapse1').classList.remove("show")
    document.getElementById('card-title1').removeAttribute("aria-expanded", "true");
    document.getElementById('card-title1').setAttribute("aria-expanded", "false");

    document.getElementById('card-title3').classList.add("collapsed")
    document.getElementById('collapse3').classList.remove("show")
    document.getElementById('card-title3').removeAttribute("aria-expanded", "true");
    document.getElementById('card-title3').setAttribute("aria-expanded", "false");

    
}

export function openAccordion3() { 
    document.getElementById('card-title3').classList.remove("collapsed")
    document.getElementById('collapse3').classList.add("show")
    document.getElementById('card-title3').setAttribute("aria-expanded", "true");

    document.getElementById('card-title1').classList.add("collapsed")
    document.getElementById('collapse1').classList.remove("show")
    document.getElementById('card-title1').removeAttribute("aria-expanded", "true");
    document.getElementById('card-title1').setAttribute("aria-expanded", "false");

    document.getElementById('card-title2').classList.add("collapsed")
    document.getElementById('collapse2').classList.remove("show")
    document.getElementById('card-title2').removeAttribute("aria-expanded", "true");
    document.getElementById('card-title2').setAttribute("aria-expanded", "false");
}



class AccordionEstadosResultados extends Component {
    
    state = { 
        isActive1: false,
        isActive2: false,
        isActive3: false,
    };

    toggleVisibility1 = () => 
        this.setState(() => ({ 
            isActive1: !this.state.isActive1
        }));

    toggleVisibility2 = () => 
        this.setState(() => ({ 
            isActive2: !this.state.isActive2 
        }));

    toggleVisibility3 = () => 
        this.setState(() => ({ 
            isActive3: !this.state.isActive3 
        }));

    render() {
        const { form, onChange, onChangeEmpresa,  options, formeditado, onSubmit, ...props } = this.props
        const {isActive1,isActive2, isActive3 } = this.state
        return (
            <>
                <div class="accordion accordion-solid accordion-toggle-plus" id="accordionExample6">
                    <div class="card">
                        <div class="card-header" id="headingOne6">
                            <div id="card-title1" class="card-title collapsed" data-toggle="collapse" data-target="#collapseOne6" onClick = { () => { openAccordion1() } }>
                                <i class="flaticon-pie-chart-1"></i> VENTAS
                            </div>
                        </div>
                        <div id="collapse1" class="collapse" data-parent="#accordionExample6">
                            <div class="card-body">
                                (VENTAS)
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header" id="headingTwo6">
                            <div id="card-title2" class="card-title collapsed" data-toggle="collapse" data-target="#collapseTwo6" onClick = { () => { openAccordion2() } }>
                                <i class="flaticon2-notification"></i> COSTOS DE SERVICIO
                            </div>
                        </div>
                        <div id="collapse2" class="collapse" data-parent="#accordionExample6">
                            <div class="card-body">
                            (COSTOS DE SERVICIO)
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header" id="headingThree6">
                            <div id="card-title3" class="card-title collapsed" data-toggle="collapse" data-target="#collapseThree6" onClick = { () => { openAccordion3() } }>
                                <i class="flaticon2-chart"></i> GASTOS OPERATIVOS
                            </div>
                        </div>
                        <div id="collapse3" class="collapse" data-parent="#accordionExample6">
                            <div class="card-body">
                                (GASTOS OPERATIVOS)
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Accordion className="accordion accordion-solid accordion-toggle-arrow">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0" onClick={this.toggleVisibility1}>
                            <div className={(isActive1) ? 'card-title' : 'card-title collapsed'}>
                                <i className="flaticon2-chart"></i> VENTAS
                            </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                (VENTAS)
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card> 
                        <div className="table-responsive d-flex justify-content-center">
                            <table className="table table-head-custom table-borderless table-vertical-center col-md-8">
                                <thead className="bg-primary-o-20">
                                    <tr className="text-left text-uppercase">
                                        <th style={{ minWidth: "250px" }} className="pl-7">
                                            <span className="text-dark-75 font-size-lg">Proyectos</span>
                                        </th>
                                        <th className="text-center" style={{ minWidth: "100px" }}>
                                            <span className="text-muted font-weight-bold">Total</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-center">
                                        <td className="p-2">
                                            <div className="d-flex align-items-start">
                                                <div>
                                                    <div className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg pl-2">Proyecto 1</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-dark-75 font-weight-bolder d-block font-size-lg">$8,000,000</span>
                                        </td>
                                    </tr>
                                </tbody>
                                
                                <tfoot>
                                    <tr className="text-right">
                                        <th className="pl-7">
                                            <span className="text-dark-75 font-size-lg">Proyectos</span>
                                        </th>
                                        <th className="text-center">
                                            <span className="text-muted font-weight-bold">Total</span>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>  
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="1" onClick={this.toggleVisibility2}>
                            <div className={(isActive2) ? 'card-title' : 'card-title collapsed'}>
                                <i className="flaticon-coins"></i> COSTOS DE SERVICIO
                            </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>(COSTOS DE SERVICIO)</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="2" onClick={this.toggleVisibility3}>
                            <div  className={(isActive3) ? 'card-title' : 'card-title collapsed'}>
                                <i className="flaticon2-chart"></i> GASTOS OPERATIVOS
                            </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="2">
                            <Card.Body>(GASTOS OPERATIVOS)</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion> */}
            </>
        )
    }
}

export default AccordionEstadosResultados