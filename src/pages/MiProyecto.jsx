import React, { Component } from 'react'
import Layout from '../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, CP_URL, GOLD, PROYECTOS_COLUMNS, URL_ASSETS } from '../constants'

import { forbiddenAccessAlert, errorAlert, waitAlert } from '../functions/alert'
import { SelectSearch } from '../components/form-components'
import { setOptions } from '../functions/setters'
import { Card, Accordion } from 'react-bootstrap'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { Subtitle, P } from '../components/texts'
import { Button } from '../components/form-components'
import { faList, faPlus, faFolderOpen, faFilePdf } from '@fortawesome/free-solid-svg-icons'
import ItemSlider from '../components/singles/ItemSlider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function CustomToggle({ children, eventKey, icon = faPlus, iconColor = 'transparent' }) {

    let variable = false
    
    const handleClick = useAccordionToggle(eventKey, (e) => {
        if(variable){
            variable = false
        }else{
            variable = true
        }
    },);

    return (
        <div className="">
            <div className="d-flex justify-content-between">
                <div>
                    {children}
                </div>
                <Button name = { eventKey } className = " small-button " color = { iconColor } icon = { icon } text = '' onClick = { handleClick } />
            </div>
        </div>
        
    );
}
class MiProyecto extends Component{
    
    state = {
        proyecto: '',
        data:{
            proyectos: []
        },
        form:{
            proyecto: ''
        },
        options:{
            proyectos: []
        },
        adjuntos:[
            {
                name: 'Inicio y planeación',
                value: 'inicio_y_planeacion',
                adjuntos:[
                    {
                        name: 'Fotografías levantamiento',
                        value: 'fotografias_levantamiento'
                    },
                    {
                        name: 'Manuales de adaptación',
                        value: 'manuales_de_adaptacion'
                    },
                    {
                        name: 'Minutas',
                        value: 'minutas'
                    },
                    {
                        name: 'Oficios',
                        value: 'oficios'
                    },
                    {
                        name: 'Planos entregados por cliente',
                        value: 'planos_entregados_por_cliente'
                    },
                    {
                        name: 'Propuestas arquitectónicas preliminares',
                        value: 'propuestas_arquitectonicas_preliminares'
                    },
                    {
                        name: 'Referencias del diseño del proyecto',
                        value: 'referencias_del_diseño_del_proyecto'
                    },
                    {
                        name: 'Renders',
                        value: 'renders'
                    },
                    {
                        name: 'Sketch Up',
                        value: 'sketch_up'
                    },
                    {
                        name: 'Presupuestos preliminares',
                        value: 'presupuestos_preliminares'
                    },
                    {
                        name: 'Carta oferta',
                        value: 'carta_oferta'
                    }
                ]
            },
            {
                name: 'Ejecución de obra',
                value: 'ejecucion_de_obra',
                adjuntos:[
                    {
                        name: 'Datos de cliente',
                        value: 'datos_de_cliente'
                    },
                    {
                        name: 'Contrato cliente',
                        value: 'contrato_cliente'
                    },
                    {
                        name: 'Contrato proveedores y contratistas',
                        value: 'contrato_proveedores_y_contratistas'
                    },
                    {
                        name: 'Firmas de aprobación',
                        value: 'firmas_de_aprobacion'
                    },
                    {
                        name: 'Reporte fotográfico de avance de obra',
                        value: 'reporte_fotografico_de_avance_de_obra'
                    },
                    {
                        name: 'Reporte de materiales',
                        value: 'reporte_de_materiales'
                    },
                    {
                        name: 'Reporte de proyecto vs ejecutado',
                        value: 'reporte_de_proyecto_vs_ejecutado'
                    },
                    {
                        name: 'Minutas de obra',
                        value: 'minutas_de_obra'
                    },
                    {
                        name: 'Presupuesto aprobado por cliente',
                        value: 'presupuesto_aprobado_por_cliente'
                    },
                    {
                        name: 'Programa de obra',
                        value: 'programa_de_obra'
                    },
                    {
                        name: 'Planos durante obra',
                        value: 'planos_durante_obra'
                    },
                    {
                        name: 'Sketch Up aprobados',
                        value: 'sketch_up_aprobados'
                    },
                    {
                        name: 'Renders aprobados',
                        value: 'renders_aprobados'
                    },
                    {
                        name: 'Estados de cuenta',
                        value: 'estados_de_cuenta'
                    },
                    {
                        name: 'Fianzas y seguros',
                        value: 'fianzas_y_seguros'
                    },
                    {
                        name: 'Permisos de obra ante dependencias',
                        value: 'permisos_de_obra_ante_dependencias'
                    }
                ]
            },
            {
                name: 'Entrega',
                value: 'entrega',
                adjuntos:[
                    {
                        name: 'Catálogo de conceptos ASBUILT',
                        value: 'catalogo_de_conceptos_asbuilt'
                    },
                    {
                        name: 'Consignas de matenimiento',
                        value: 'consignas_de_matenimiento'
                    },
                    {
                        name: 'Planos aprobados',
                        value: 'planos_aprobados'
                    },
                    {
                        name: 'Garantía de los equipos',
                        value: 'garantia_de_los_equipos'
                    },
                    {
                        name: 'Garantía de vicios ocultos',
                        value: 'garantia_de_vicios_ocultos'
                    },
                    {
                        name: 'Memorias de cálculo',
                        value: 'memorias_de_calculo'
                    },
                    {
                        name: 'Memorias descriptivas',
                        value: 'memorias_descriptivas'
                    },
                    {
                        name: 'Fichas técnicas',
                        value: 'fichas_tecnicas'
                    },
                    {
                        name: 'Pruebas de instalaciones',
                        value: 'pruebas_de_instalaciones'
                    },
                    {
                        name: 'Fotografías fin de obra',
                        value: 'fotografias_fin_de_obra'
                    },
                    {
                        name: 'Acta de entrega',
                        value: 'acta_de_entrega'
                    },
                    {
                        name: 'Carpeta de entrega ZIP',
                        value: 'carpeta_de_entrega_zip'
                    },
                ]
            },
            {
                name: 'Mantenimiento',
                value: 'mantenimiento',
                adjuntos:[
                    {
                        name: 'Mantenimiento preventivo',
                        value: 'mantenimiento_preventivo'
                    },
                    {
                        name: 'Mantenimiento correctivo',
                        value: 'mantenimiento_correctivo'
                    },
                ]
            }
        ]
    }

    componentDidMount(){
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const proyecto = permisos.find(function(element, index) {
            return element.modulo.url === pathname
        });
        if(!proyecto)
            history.push('/')
        this.getMiProyectoAxios()
    }

    updateProyecto = value => {
        const { data, form } = this.state
        form.proyecto = value
        data.proyectos.map( (proyecto) => {
            if(proyecto.id.toString() === value.toString()){
                this.setState({
                    ... this.state,
                    form,
                    proyecto: proyecto
                })
            }
        } )
        console.log(this.state.proyecto)
    }

    async getMiProyectoAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'proyectos/mi-proyecto', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyectos } = response.data
                const { data, options } = this.state
                let { proyecto } = this.state
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                data.proyectos = proyectos
                if(proyectos.length === 1){
                    proyecto = proyectos[0]
                }
                this.setState({
                    ... this.state,
                    data,
                    options,
                    proyecto
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getProyectoAdjuntosZip(array) {
        const { access_token } = this.props.authUser
        const { proyecto } = this.state
        let aux = { tipo: array }
        waitAlert()
        await axios.post(URL_DEV + 'proyectos/' + proyecto.id + '/adjuntos/zip', aux, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const url =  URL_ASSETS+'/storage/adjuntos.zip'
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', proyecto.nombre+'.zip'); //or any other extension
                document.body.appendChild(link);
                link.click();
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render(){
        const { options, proyecto, form, adjuntos } = this.state
        return(
            <Layout { ...this.props}>
                <div className="content pt-0 d-flex flex-column flex-column-fluid" id="kt_content" style ={ { paddingBottom:"11px" } }>
                    <div className="d-flex flex-row-fluid bgi-size-cover bgi-position-center min-h-350px mb-4 d-flex justify-content-center align-items-center" style ={ { backgroundImage: "url('/proyecto.jpg')", margin:"-25px" } }>
                        <div className="container">
                            <div className="d-flex align-items-stretch text-center flex-column py-40">
                                {/*<h2 className="text-dark font-weight-bolder mb-12"></h2>*/}
                                
                                <div className="form-group row form-group-marginless d-flex justify-content-center align-items-center">
                                    <div className="col-md-5">
                                        <SelectSearch 
                                            formeditado = { 0 }
                                            options = { options.proyectos }
                                            name = "Seleccione un proyecto"
                                            name = "proyecto"
                                            value = { form.proyecto }
                                            onChange = { this.updateProyecto }
                                            /> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container py-8">
							<div className="row">
								<div className="col-lg-4 mb-3">
									<div className="card card-custom wave wave-animate-slow wave-primary mb-8 mb-lg-0">
										<div className="card-body">
											<div className="d-flex align-items-center ">
												<div className="mr-6">
													<span className="svg-icon svg-icon-primary svg-icon-4x">
														<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
															<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
																<rect x="0" y="0" width="24" height="24" />
																<path d="M13,17.0484323 L13,18 L14,18 C15.1045695,18 16,18.8954305 16,20 L8,20 C8,18.8954305 8.8954305,18 10,18 L11,18 L11,17.0482312 C6.89844817,16.5925472 3.58685702,13.3691811 3.07555009,9.22038742 C3.00799634,8.67224972 3.3975866,8.17313318 3.94572429,8.10557943 C4.49386199,8.03802567 4.99297853,8.42761593 5.06053229,8.97575363 C5.4896663,12.4577884 8.46049164,15.1035129 12.0008191,15.1035129 C15.577644,15.1035129 18.5681939,12.4043008 18.9524872,8.87772126 C19.0123158,8.32868667 19.505897,7.93210686 20.0549316,7.99193546 C20.6039661,8.05176407 21.000546,8.54534521 20.9407173,9.09437981 C20.4824216,13.3000638 17.1471597,16.5885839 13,17.0484323 Z" fill="#000000" fillRule="nonzero" />
																<path d="M12,14 C8.6862915,14 6,11.3137085 6,8 C6,4.6862915 8.6862915,2 12,2 C15.3137085,2 18,4.6862915 18,8 C18,11.3137085 15.3137085,14 12,14 Z M8.81595773,7.80077353 C8.79067542,7.43921955 8.47708263,7.16661749 8.11552864,7.19189981 C7.75397465,7.21718213 7.4813726,7.53077492 7.50665492,7.89232891 C7.62279197,9.55316612 8.39667037,10.8635466 9.79502238,11.7671393 C10.099435,11.9638458 10.5056723,11.8765328 10.7023788,11.5721203 C10.8990854,11.2677077 10.8117724,10.8614704 10.5073598,10.6647638 C9.4559885,9.98538454 8.90327706,9.04949813 8.81595773,7.80077353 Z" fill="#000000" opacity="0.3" />
															</g>
														</svg>
													</span>
												</div>
												<div className="d-flex flex-column">
													<a className="text-dark text-hover-primary font-weight-bold font-size-h4 mb-3">PROYECTO</a>
													<div className="text-dark-75">CENTAURO - SANTA FE - OBRA</div>
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
																<rect x="0" y="0" width="24" height="24" />
																<path d="M16.3740377,19.9389434 L22.2226499,11.1660251 C22.4524142,10.8213786 22.3592838,10.3557266 22.0146373,10.1259623 C21.8914367,10.0438285 21.7466809,10 21.5986122,10 L17,10 L17,4.47708173 C17,4.06286817 16.6642136,3.72708173 16.25,3.72708173 C15.9992351,3.72708173 15.7650616,3.85240758 15.6259623,4.06105658 L9.7773501,12.8339749 C9.54758575,13.1786214 9.64071616,13.6442734 9.98536267,13.8740377 C10.1085633,13.9561715 10.2533191,14 10.4013878,14 L15,14 L15,19.5229183 C15,19.9371318 15.3357864,20.2729183 15.75,20.2729183 C16.0007649,20.2729183 16.2349384,20.1475924 16.3740377,19.9389434 Z" fill="#000000" />
																<path d="M4.5,5 L9.5,5 C10.3284271,5 11,5.67157288 11,6.5 C11,7.32842712 10.3284271,8 9.5,8 L4.5,8 C3.67157288,8 3,7.32842712 3,6.5 C3,5.67157288 3.67157288,5 4.5,5 Z M4.5,17 L9.5,17 C10.3284271,17 11,17.6715729 11,18.5 C11,19.3284271 10.3284271,20 9.5,20 L4.5,20 C3.67157288,20 3,19.3284271 3,18.5 C3,17.6715729 3.67157288,17 4.5,17 Z M2.5,11 L6.5,11 C7.32842712,11 8,11.6715729 8,12.5 C8,13.3284271 7.32842712,14 6.5,14 L2.5,14 C1.67157288,14 1,13.3284271 1,12.5 C1,11.6715729 1.67157288,11 2.5,11 Z" fill="#000000" opacity="0.3" />
															</g>
														</svg>
													</span>
												</div>
												<div className="d-flex flex-column">
													<a className="text-dark text-hover-primary font-weight-bold font-size-h4 mb-3">CONTACTO</a>
													<div className="text-dark-75">PAULA GARAVITO</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-4 mb-3">
									<div className="card card-custom wave wave-animate-slow wave-success mb-8 mb-lg-0">
										<div className="card-body">
											<div className="d-flex align-items-center">
												<div className="mr-6">
													<span className="svg-icon svg-icon-success svg-icon-4x">
														<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
															<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
																<rect x="0" y="0" width="24" height="24" />
																<polygon fill="#000000" opacity="0.3" points="5 3 19 3 23 8 1 8" />
																<polygon fill="#000000" points="23 8 12 20 1 8" />
															</g>
														</svg>
													</span>
												</div>
												<div className="d-flex flex-column">
													<a className="text-dark text-hover-primary font-weight-bold font-size-h4 mb-3">PERIODO</a>
													<div className="text-dark-75">11/04/2019 - 06/06/2019</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
                </div>
                <div className="col-md-12">
							<div className="card">
								<div className="card-body">
									<div className="p-6">
										<h2 className="text-dark mb-8 pb-4">Adjuntos del proyecto</h2>
										<div className="row">
											<div className="col-lg-3">
												<ul className="navi navi-link-rounded navi-accent navi-hover flex-column mb-8 mb-lg-0" role="tablist">
													<li className="navi-item mb-2">
														<a className="navi-link" data-toggle="tab">
															<span className="navi-text text-dark-50 font-size-h5 font-weight-bold">Inicio y planeación</span>
														</a>
													</li>
													<li className="navi-item mb-2">
														<a className="navi-link active" data-toggle="tab">
															<span className="navi-text text-dark font-size-h5 font-weight-bold">Ejecución de obra</span>
														</a>
													</li>
													<li className="navi-item mb-2">
														<a className="navi-link" data-toggle="tab">
															<span className="navi-text text-dark-50 font-size-h5 font-weight-bold">Entrega</span>
														</a>
													</li>
													<li className="navi-item mb-2">
														<a className="navi-link" data-toggle="tab">
															<span className="navi-text text-dark-50 font-size-h5 font-weight-bold">Mantenimiento</span>
														</a>
													</li>
												</ul>
											</div>
											<div className="col-lg-9">
												<div className="accordion accordion-light accordion-light-borderless accordion-svg-toggle" id="accordionExample7">
													<div className="card">
														<div className="card-header" id="headingOne7">
															<div className="card-title" data-toggle="collapse" data-target="#collapseOne7" aria-expanded="true" role="button">
																<span className="svg-icon svg-icon-primary">
																	<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																		<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
																			<polygon points="0 0 24 0 24 24 0 24"></polygon>
																			<path d="M12.2928955,6.70710318 C11.9023712,6.31657888 11.9023712,5.68341391 12.2928955,5.29288961 C12.6834198,4.90236532 13.3165848,4.90236532 13.7071091,5.29288961 L19.7071091,11.2928896 C20.085688,11.6714686 20.0989336,12.281055 19.7371564,12.675721 L14.2371564,18.675721 C13.863964,19.08284 13.2313966,19.1103429 12.8242777,18.7371505 C12.4171587,18.3639581 12.3896557,17.7313908 12.7628481,17.3242718 L17.6158645,12.0300721 L12.2928955,6.70710318 Z" fill="#000000" fillRule="nonzero"></path>
																			<path d="M3.70710678,15.7071068 C3.31658249,16.0976311 2.68341751,16.0976311 2.29289322,15.7071068 C1.90236893,15.3165825 1.90236893,14.6834175 2.29289322,14.2928932 L8.29289322,8.29289322 C8.67147216,7.91431428 9.28105859,7.90106866 9.67572463,8.26284586 L15.6757246,13.7628459 C16.0828436,14.1360383 16.1103465,14.7686056 15.7371541,15.1757246 C15.3639617,15.5828436 14.7313944,15.6103465 14.3242754,15.2371541 L9.03007575,10.3841378 L3.70710678,15.7071068 Z" fill="#000000" fillRule="nonzero" opacity="0.3" transform="translate(9.000003, 11.999999) rotate(-270.000000) translate(-9.000003, -11.999999)"></path>
																		</g>
																	</svg>
																</span>
																<div className="card-label text-dark pl-4">Product Inventory</div>
															</div>
														</div>
														<div id="collapseOne7" className="collapse show" aria-labelledby="headingOne7" data-parent="#accordionExample7">
															<div className="card-body text-dark-50 font-size-lg pl-12">Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo.</div>
														</div>
													</div>
													<div className="card">
														<div className="card-header" id="headingTwo7">
															<div className="card-title collapsed" data-toggle="collapse" data-target="#collapseTwo7" aria-expanded="true" role="button">
																<span className="svg-icon svg-icon-primary">
																	<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																		<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
																			<polygon points="0 0 24 0 24 24 0 24"></polygon>
																			<path d="M12.2928955,6.70710318 C11.9023712,6.31657888 11.9023712,5.68341391 12.2928955,5.29288961 C12.6834198,4.90236532 13.3165848,4.90236532 13.7071091,5.29288961 L19.7071091,11.2928896 C20.085688,11.6714686 20.0989336,12.281055 19.7371564,12.675721 L14.2371564,18.675721 C13.863964,19.08284 13.2313966,19.1103429 12.8242777,18.7371505 C12.4171587,18.3639581 12.3896557,17.7313908 12.7628481,17.3242718 L17.6158645,12.0300721 L12.2928955,6.70710318 Z" fill="#000000" fillRule="nonzero"></path>
																			<path d="M3.70710678,15.7071068 C3.31658249,16.0976311 2.68341751,16.0976311 2.29289322,15.7071068 C1.90236893,15.3165825 1.90236893,14.6834175 2.29289322,14.2928932 L8.29289322,8.29289322 C8.67147216,7.91431428 9.28105859,7.90106866 9.67572463,8.26284586 L15.6757246,13.7628459 C16.0828436,14.1360383 16.1103465,14.7686056 15.7371541,15.1757246 C15.3639617,15.5828436 14.7313944,15.6103465 14.3242754,15.2371541 L9.03007575,10.3841378 L3.70710678,15.7071068 Z" fill="#000000" fillRule="nonzero" opacity="0.3" transform="translate(9.000003, 11.999999) rotate(-270.000000) translate(-9.000003, -11.999999)"></path>
																		</g>
																	</svg>
																</span>
																<div className="card-label text-dark pl-4">Order Statistics</div>
															</div>
														</div>
														<div id="collapseTwo7" className="collapse" aria-labelledby="headingTwo7" data-parent="#accordionExample7">
															<div className="card-body text-dark-50 font-size-lg pl-12">Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.</div>
														</div>
													</div>
													<div className="card">
														<div className="card-header" id="headingThree7">
															<div className="card-title collapsed" data-toggle="collapse" data-target="#collapseThree7" aria-expanded="true" role="button">
																<span className="svg-icon svg-icon-primary">
																	<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																		<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
																			<polygon points="0 0 24 0 24 24 0 24"></polygon>
																			<path d="M12.2928955,6.70710318 C11.9023712,6.31657888 11.9023712,5.68341391 12.2928955,5.29288961 C12.6834198,4.90236532 13.3165848,4.90236532 13.7071091,5.29288961 L19.7071091,11.2928896 C20.085688,11.6714686 20.0989336,12.281055 19.7371564,12.675721 L14.2371564,18.675721 C13.863964,19.08284 13.2313966,19.1103429 12.8242777,18.7371505 C12.4171587,18.3639581 12.3896557,17.7313908 12.7628481,17.3242718 L17.6158645,12.0300721 L12.2928955,6.70710318 Z" fill="#000000" fillRule="nonzero"></path>
																			<path d="M3.70710678,15.7071068 C3.31658249,16.0976311 2.68341751,16.0976311 2.29289322,15.7071068 C1.90236893,15.3165825 1.90236893,14.6834175 2.29289322,14.2928932 L8.29289322,8.29289322 C8.67147216,7.91431428 9.28105859,7.90106866 9.67572463,8.26284586 L15.6757246,13.7628459 C16.0828436,14.1360383 16.1103465,14.7686056 15.7371541,15.1757246 C15.3639617,15.5828436 14.7313944,15.6103465 14.3242754,15.2371541 L9.03007575,10.3841378 L3.70710678,15.7071068 Z" fill="#000000" fillRule="nonzero" opacity="0.3" transform="translate(9.000003, 11.999999) rotate(-270.000000) translate(-9.000003, -11.999999)"></path>
																		</g>
																	</svg>
																</span>
																<div className="card-label text-dark pl-4">eCommerce Reports</div>
															</div>
														</div>
														<div id="collapseThree7" className="collapse" aria-labelledby="headingThree7" data-parent="#accordionExample7">
															<div className="card-body text-dark-50 font-size-lg pl-12">Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.</div>
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
                        <Card>
                            <Card.Header>
                                <Subtitle className="text-center">                                    
                                    {
                                        proyecto.nombre
                                    }
                                </Subtitle>
                            </Card.Header>
                            <Card.Body>
                                <Accordion>
                                    <div className="row mx-0">
                                        {
                                            adjuntos.map( (grupo, key) => {
                                                let aux = false
                                                grupo.adjuntos.forEach(element => {
                                                    if(proyecto[element.value].length)
                                                        aux = true
                                                });
                                                if(aux)
                                                return(
                                                    <div className="col-md-6" key = {key}>
                                                        <div className="px-3 py-2">
                                                            <CustomToggle icon = { faList } iconColor = 'gold' iconColor = 'transparent' eventKey={grupo.value} >
                                                                <strong>
                                                                    <p className="label-form mb-0">
                                                                        {grupo.name}
                                                                    </p>
                                                                </strong>
                                                            </CustomToggle>
                                                            <Accordion.Collapse eventKey = { grupo.value }>
                                                                <div>
                                                                    <div className="row mx-0 pl-2 py-2">
                                                                        <Accordion className="w-100">
                                                                            {
                                                                                grupo.adjuntos.map( (adjunto, key) => {
                                                                                    if(proyecto[adjunto.value].length)
                                                                                    return(
                                                                                        <div key = {key}>
                                                                                            <div className="px-3 pt-2">
                                                                                                <CustomToggle icon = { faFolderOpen } eventKey = { adjunto.value } >
                                                                                                    <strong>
                                                                                                        <p className="label-form">
                                                                                                            {adjunto.name}
                                                                                                        </p>
                                                                                                    </strong>
                                                                                                </CustomToggle>
                                                                                                
                                                                                            </div>
                                                                                            <Accordion.Collapse eventKey={adjunto.value}>
                                                                                                <div>
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
                                                                                                </div>
                                                                                            </Accordion.Collapse>
                                                                                        </div>
                                                                                    )
                                                                                } )
                                                                            }
                                                                        </Accordion>            
                                                                    </div>
                                                                </div>                                            
                                                            </Accordion.Collapse>
                                                        </div>
                                                    </div>
                                                )
                                            } )
                                        }
                                    </div>
                                </Accordion>
                                {
                                    proyecto.avances.length ?
                                        <>
                                            <div className="separator separator-dashed mt-1 mb-2"></div>
                                            <div className="my-2">
                                                <p>
                                                    Avances por semana.
                                                </p>
                                            </div>
                                            <div className="row mx-0">
                                                {
                                                    proyecto.avances.map( (avance, key) => {
                                                        return(
                                                            <div className="col-md-2 text-center">
                                                                <P>
                                                                    {
                                                                        avance.semana
                                                                    }
                                                                </P>
                                                                <a href = { avance.pdf } target = '_blank'>
                                                                    <FontAwesomeIcon icon = { faFilePdf } />
                                                                </a>
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
                    : ''
                }
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(MiProyecto);