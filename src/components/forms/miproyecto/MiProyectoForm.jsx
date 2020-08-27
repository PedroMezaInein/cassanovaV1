import React, { Component } from 'react'
import { validateAlert } from '../../../functions/alert'
import { Button, Input } from '../../form-components'
import { Card, Nav, Tab, Col, Row} from 'react-bootstrap'
import { SelectSearch, SelectSearchSinText } from '../../../components/form-components'
import ItemSlider from '../../../components/singles/ItemSlider'
import Moment from 'react-moment'
import { Small } from '../../../components/texts'
import { Form } from 'react-bootstrap'
class MiProyectoForm extends Component {

    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
    }
    constructor(props) {
        super(props)
        this.state = {
            files: []
        }
    }

    render() {
        const { options, proyecto, form, adjuntos, showadjuntos, primeravista, defaultactivekey, subActiveKey, onChange, onSubmit, formeditado, ...props} = this.state
        return (
            <>
            {/* <div className="content pt-0 d-flex flex-column flex-column-fluid" id="kt_content" style ={ { paddingBottom:"11px" } }>
                    <div className="d-flex flex-row-fluid bgi-size-cover bgi-position-center min-h-350px mb-4 d-flex justify-content-center align-items-center" style ={ { backgroundImage: "url('/proyecto.jpg')", margin:"-25px" } }>
                        <div className="container">
                            <div className="d-flex align-items-stretch text-center flex-column py-40">
                                
                                <div className="form-group row form-group-marginless d-flex justify-content-center align-items-center">
                                    <div className="col-md-5">
                                        <SelectSearchSinText  
                                            options = { options.proyectos }
                                            placeholder = "Seleccione un proyecto"
                                            name = "proyecto"
                                            value = { form.proyecto }
                                            onChange = { this.updateProyecto }
                                            requirevalidation = { 1 }
                                            /> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
							<div className="row">
								<div className="col-lg-4 mb-3">
									<div className="card card-custom wave wave-animate-slow wave-primary mb-8 mb-lg-0">
										<div className="card-body">
											<div className="d-flex align-items-center ">
												<div className="mr-6">
													<span className="svg-icon svg-icon-primary svg-icon-4x">
														<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                            <rect x="0" y="0" width="24" height="24"/>
                                                            <circle fill="#000000" opacity="0.3" cx="12" cy="9" r="8"/>
                                                            <path d="M14.5297296,11 L9.46184488,11 L11.9758349,17.4645458 L14.5297296,11 Z M10.5679953,19.3624463 L6.53815512,9 L17.4702704,9 L13.3744964,19.3674279 L11.9759405,18.814912 L10.5679953,19.3624463 Z" fill="#000000" fillRule="nonzero" opacity="0.3"/>
                                                            <path d="M10,22 L14,22 L14,22 C14,23.1045695 13.1045695,24 12,24 L12,24 C10.8954305,24 10,23.1045695 10,22 Z" fill="#000000" opacity="0.3"/>
                                                            <path d="M9,20 C8.44771525,20 8,19.5522847 8,19 C8,18.4477153 8.44771525,18 9,18 C8.44771525,18 8,17.5522847 8,17 C8,16.4477153 8.44771525,16 9,16 L15,16 C15.5522847,16 16,16.4477153 16,17 C16,17.5522847 15.5522847,18 15,18 C15.5522847,18 16,18.4477153 16,19 C16,19.5522847 15.5522847,20 15,20 C15.5522847,20 16,20.4477153 16,21 C16,21.5522847 15.5522847,22 15,22 L9,22 C8.44771525,22 8,21.5522847 8,21 C8,20.4477153 8.44771525,20 9,20 Z" fill="#000000"/>
                                                        </g>
														</svg>
													</span>
												</div>
												<div className="d-flex flex-column">
													<a className="text-dark text-hover-primary font-weight-bold font-size-h4 mb-3 pl-2">PROYECTO</a>
													<div className="text-dark-75">{proyecto.nombre}</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-4 mb-3">
									<div className="card card-custom wave wave-animate-slow wave-danger mb-8 mb-lg-0">
										<div className="card-body">
											<div className="d-flex align-items-center">
												<div className="mr-6">
													<span className="svg-icon svg-icon-danger svg-icon-4x">
														<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                            <rect x="0" y="0" width="24" height="24"/>
                                                            <circle fill="#000000" opacity="0.3" cx="12" cy="12" r="9"/>
                                                            <path d="M11.7357634,20.9961946 C6.88740052,20.8563914 3,16.8821712 3,12 C3,11.9168367 3.00112797,11.8339369 3.00336944,11.751315 C3.66233009,11.8143341 4.85636818,11.9573854 4.91262842,12.4204038 C4.9904938,13.0609191 4.91262842,13.8615942 5.45804656,14.101772 C6.00346469,14.3419498 6.15931561,13.1409372 6.6267482,13.4612567 C7.09418079,13.7815761 8.34086797,14.0899175 8.34086797,14.6562185 C8.34086797,15.222396 8.10715168,16.1034596 8.34086797,16.2636193 C8.57458427,16.423779 9.5089688,17.54465 9.50920913,17.7048097 C9.50956962,17.8649694 9.83857487,18.6793513 9.74040201,18.9906563 C9.65905192,19.2487394 9.24857641,20.0501554 8.85059781,20.4145589 C9.75315358,20.7620621 10.7235846,20.9657742 11.7357634,20.9960544 L11.7357634,20.9961946 Z M8.28272988,3.80112099 C9.4158415,3.28656421 10.6744554,3 12,3 C15.5114513,3 18.5532143,5.01097452 20.0364482,7.94408274 C20.069657,8.72412177 20.0638332,9.39135321 20.2361262,9.6327358 C21.1131932,10.8600506 18.0995147,11.7043158 18.5573343,13.5605384 C18.7589671,14.3794892 16.5527814,14.1196773 16.0139722,14.886394 C15.4748026,15.6527403 14.1574598,15.137809 13.8520064,14.9904917 C13.546553,14.8431744 12.3766497,15.3341497 12.4789081,14.4995164 C12.5805657,13.664636 13.2922889,13.6156126 14.0555619,13.2719546 C14.8184743,12.928667 15.9189236,11.7871741 15.3781918,11.6380045 C12.8323064,10.9362407 11.963771,8.47852395 11.963771,8.47852395 C11.8110443,8.44901109 11.8493762,6.74109366 11.1883616,6.69207022 C10.5267462,6.64279981 10.170464,6.88841096 9.20435656,6.69207022 C8.23764828,6.49572949 8.44144409,5.85743687 8.2887174,4.48255778 C8.25453994,4.17415686 8.25619136,3.95717082 8.28272988,3.80112099 Z M20.9991771,11.8770357 C20.9997251,11.9179585 21,11.9589471 21,12 C21,16.9406923 17.0188468,20.9515364 12.0895088,20.9995641 C16.970233,20.9503326 20.9337111,16.888438 20.9991771,11.8770357 Z" fill="#000000" opacity="0.3"/>
                                                        </g>
														</svg>
													</span>
												</div>
												<div className="d-flex flex-column">
													<a className="text-dark text-hover-danger font-weight-bold font-size-h4 mb-3 pl-2">Dirección</a>
													<div className="text-dark-75 text-justify">
                                                        {
                                                            proyecto ? 
                                                                <div> 
                                                                    <Small className="mr-1 mb-0" >
                                                                        {proyecto.calle}, colonia
                                                                    </Small>
                                                                    <Small className="mr-1 mb-0">
                                                                        {proyecto.colonia},
                                                                    </Small>
                                                                    <Small className="mr-1 mb-0">
                                                                        {proyecto.municipio},
                                                                    </Small>
                                                                    <Small className="mr-1 mb-0">
                                                                        {proyecto.estado}. CP:
                                                                    </Small>
                                                                    <Small className="mr-1 mb-0">
                                                                        {proyecto.cp}
                                                                    </Small>
                                                                </div>
                                                            :""
                                                        }
                                                    </div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-4 mb-3">
									<div className="card card-custom wave wave-animate-slow wave-info mb-8 mb-lg-0">
										<div className="card-body">
											<div className="d-flex align-items-center">
												<div className="mr-6">
													<span className="svg-icon svg-icon-info svg-icon-4x">
														<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                            <rect x="0" y="0" width="24" height="24"/>
                                                            <path d="M12,22 C7.02943725,22 3,17.9705627 3,13 C3,8.02943725 7.02943725,4 12,4 C16.9705627,4 21,8.02943725 21,13 C21,17.9705627 16.9705627,22 12,22 Z" fill="#000000" opacity="0.3"/>
                                                            <path d="M11.9630156,7.5 L12.0475062,7.5 C12.3043819,7.5 12.5194647,7.69464724 12.5450248,7.95024814 L13,12.5 L16.2480695,14.3560397 C16.403857,14.4450611 16.5,14.6107328 16.5,14.7901613 L16.5,15 C16.5,15.2109164 16.3290185,15.3818979 16.1181021,15.3818979 C16.0841582,15.3818979 16.0503659,15.3773725 16.0176181,15.3684413 L11.3986612,14.1087258 C11.1672824,14.0456225 11.0132986,13.8271186 11.0316926,13.5879956 L11.4644883,7.96165175 C11.4845267,7.70115317 11.7017474,7.5 11.9630156,7.5 Z" fill="#000000"/>
                                                        </g>
														</svg>
													</span>
												</div>
												<div className="d-flex flex-column">
													<a className="text-dark text-hover-info font-weight-bold font-size-h4 mb-3 pl-2">PERIODO</a>
													<div className="text-dark-75">
                                                    {
                                                        proyecto ? 
                                                            <div>
                                                                <Moment format="DD/MM/YYYY">
                                                                        {proyecto.fecha_inicio}
                                                                </Moment>
                                                                {" - "}
                                                                <Moment format="DD/MM/YYYY">
                                                                        {proyecto.fecha_fin}
                                                                </Moment>
                                                            </div>
                                                        :""
                                                    }
                                                    </div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
                </div>
                {
                    proyecto ? 
                        <div className="col-md-12 mb-4">                                 
                                <Card className="card-custom gutter-b">
                                    <Card.Header>
                                        <Card.Title>
                                            <div className="card-title">
                                                <h3 className="card-label">Adjuntos del proyecto</h3>
                                            </div>
                                        </Card.Title>
                                        <div className="card-toolbar">
                                            <Nav as="ul" className="nav nav-bold nav-pills">
                                                {
                                                    adjuntos.map((grupo, key) => { 
                                                        let aux = false 
                                                        grupo.adjuntos.forEach(element => {
                                                            if(proyecto[element.value].length)
                                                            aux = true
                                                        });
                                                        if(aux) 
                                                        {
                                                            return(
                                                                <div key = {key}>
                                                                    <Nav.Item as="li">
                                                                        <Nav.Link data-toggle="tab" className={primeravista&&key===0?"active":""} eventKey={grupo.value} onClick = { () => { this.seleccionaradj(grupo.adjuntos) } }>{grupo.name}</Nav.Link>
                                                                    </Nav.Item>
                                                                </div>
                                                            )
                                                        }
                                                    })
                                                }
                                            </Nav>
                                        </div>
                                    </Card.Header>
                                    
                                    <Card.Body>
                                        <>
                                        <Tab.Container id="left-tabs-example" activeKey = { subActiveKey ? subActiveKey : defaultactivekey } defaultActiveKey={defaultactivekey}
                                            onSelect = { (select) => { this.updateActiveTabContainer(select) } }>
                                            <Row>
                                                <Col md={3} className="navi navi-accent navi-hover navi-bold">
                                                    <Nav variant="pills" className="flex-column navi navi-hover navi-active">                                                    
                                                        { 
                                                            showadjuntos.map((adjunto, key) => { 
                                                                if(proyecto[adjunto.value].length)
                                                                {  
                                                                    return( 
                                                                        <Nav.Item className="navi-item" key = {key}>
                                                                            <Nav.Link className="navi-link" eventKey={adjunto.value}>
                                                                                <span className="navi-text">{adjunto.name}</span>
                                                                            </Nav.Link>
                                                                        </Nav.Item>
                                                                    )
                                                                }
                                                            })
                                                        }
													</Nav>
												</Col>
                                                <Col md={8}>
                                                    <Tab.Content>
                                                    { 
                                                        showadjuntos.map((adjunto, key) => {  
                                                            if(proyecto[adjunto.value].length)
                                                            {  
                                                                return(
                                                                    <Tab.Pane key = {key} eventKey={adjunto.value}>
                                                                        {
                                                                            proyecto ? 
                                                                                proyecto[adjunto.value].length ?
                                                                                    <div className="mt-2 d-flex justify-content-center">
                                                                                        <span className = 'btn btn-hover btn-text-success' onClick={(e) => { e.preventDefault(); this.getProyectoAdjuntosZip([adjunto.value]) }}>
                                                                                            <i className="fas fa-file-archive"></i> Descargar ZIP
                                                                                        </span>
                                                                                    </div>
                                                                                : ''
                                                                            : ''
                                                                        }   
                                                                        {
                                                                            proyecto ? 
                                                                                <ItemSlider items = { proyecto[adjunto.value] } item = {adjunto.value} />
                                                                            : ''
                                                                        }
                                                                    </Tab.Pane>  
                                                                )
                                                            }
                                                        })
                                                    } 
                                                    </Tab.Content>
                                                </Col>
                                            </Row>
                                        </Tab.Container>                     
                                        </>
                                    </Card.Body>
                                </Card>
                            
                        </div>
                    : ''
                }
                {
                    proyecto ? 
                        <div className="col-md-12 mb-4" >
                        <Card className="card-custom">
                            <Card.Header>
                                <Card.Title> 
                                    <div className="card-title">
                                        <h3 className="card-label">Avances por semana</h3>
                                    </div>
                                </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                {
                                    proyecto.avances.length ?
                                        <>
                                            <div className="row mx-0">
                                                {
                                                    proyecto.avances.map( (avance, key) => {
                                                        return(
                                                            <div key = {key} className="col-md-2 text-center">
                                                                <div className="d-flex flex-column align-items-center">
                                                                <a href = { avance.pdf } className="text-dark-75 font-weight-bold mt-15 font-size-lg text-hover-danger2 pb-3">
                                                                    <img alt="" className="max-h-50px pb-2" src="/pdf.svg"/>{avance.semana}
                                                                </a>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            
                                        </>
                                    : ''
                                }
                            </Card.Body>
                        </Card>
                        </div>
                    : ''
                }
                {
                    proyecto ? 
                        <div className="col-md-12 mb-4" >
                        <Card className="card-custom">
                            <Card.Header>
                                <div className="card-title">
                                    <h3 className="card-label">Levantamiento de tickets</h3>
                                </div>
                            </Card.Header>
                            <Card.Body>
                            <Form id="form-concepto"
                                onSubmit={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-concepto')
                                    }
                                }
                                {...props}
                            >
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <SelectSearch
                                            formeditado={formeditado}
                                            options={options.partidas}
                                            placeholder="SELECCIONA LA PARTIDA"
                                            name="partida"
                                            value={form.partida}
                                            onChange={this.updatePartida}
                                            iconclass={" fas fa-book"}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <SelectSearch
                                            formeditado={formeditado}
                                            options={options.subpartidas}
                                            placeholder="SELECCIONA LA SUBPARTIDA"
                                            name="subpartida"
                                            value={form.subpartida}
                                            onChange={this.updateSubpartida}
                                            iconclass={" fas fa-book"}
                                        />
                                    </div>                                    
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-12">
                                        <Input
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            as="textarea"
                                            placeholder="DESCRIPCIÓN"
                                            rows="2"
                                            value={form.descripcion}
                                            name="descripcion"
                                            onChange={onChange}
                                            messageinc="Incorrecto. Ingresa una descripción."
                                            style={{ paddingLeft: "10px" }}
                                        />
                                    </div>
                                </div>
                                <div className="card-footer py-3 pr-1">
                                    <div className="row">
                                        <div className="col-lg-12 text-right pr-0 pb-0">
                                            <Button text='ENVIAR' type='submit' className="btn btn-primary mr-2" />
                                        </div>
                                    </div>
                                </div>
                            </Form >
                            </Card.Body>
                        </Card>
                        </div>
                    : ''
                } */}
            </>    
        )
    }
}

export default MiProyectoForm