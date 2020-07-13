import React, {Component} from 'react'
import NumberFormat from 'react-number-format'
import Moment from 'react-moment'
import Card from 'react-bootstrap/Card'

export default class SolicitudCompraCard extends Component{
    render(){
        const { data, children } = this.props
        return(
            <div class="col-md-12">
				<Card className="card card-without-box-shadown border-0">
					<div class="card-body d-flex align-items-center justify-content-between flex-wrap pb-2 pl-0 pr-0">
						<div class="mr-2">
                        {
                            data.proyecto ?
                                <>
                                <p class="font-size-h3 mb-0">Proyecto:&nbsp;<strong class="font-size-h4"> {data.proyecto.nombre}</strong></p>
                                </>
                            : ''
                        }
                        {
                            data.empresa ?
                                <>
                                <p class="font-size-h5 text-muted font-size-lg mt-0">Empresa:&nbsp;<strong class="font-size-h6"> {data.empresa.name} </strong></p>
                                </>
                            : ''
                        }
						</div>
                        {children}
                        {/* <a href="#" class="btn btn-icon btn-light-primary pulse pulse-primary mr-5">
                            <i class="fas fa-sync"></i>
                            <span class="pulse-ring"></span>
                        </a> */}
					</div>
                    <div className="separator separator-solid mb-3"></div>
                    <div class="mb-5">
						<div class="row row-paddingless mb-4">
							<div class="col-md-3">
								<div class="d-flex align-items-center">
									<div class="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
										<div class="symbol-label">
                                            <span class="svg-icon svg-icon-lg svg-icon-info">
												<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                    <rect x="0" y="0" width="24" height="24"/>
                                                    <path d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z" fill="#000000" opacity="0.3" transform="translate(11.500000, 12.000000) rotate(-345.000000) translate(-11.500000, -12.000000) "/>
                                                    <path d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z M11.5,14 C12.6045695,14 13.5,13.1045695 13.5,12 C13.5,10.8954305 12.6045695,10 11.5,10 C10.3954305,10 9.5,10.8954305 9.5,12 C9.5,13.1045695 10.3954305,14 11.5,14 Z" fill="#000000"/>
                                                </g>
												</svg>
											</span>
										</div>
									</div>
									<div>
                                    {
                                        data.monto ?
                                            <>
                                                <NumberFormat 
                                                    value = { data.monto }
                                                    displayType = { 'text' } 
                                                    thousandSeparator = { true } 
                                                    prefix = { '$' }
                                                    renderText = { value => <div className="font-size-h6 text-dark-75 font-weight-bolder"> { value } </div> } />
                                                <div class="font-size-sm text-muted font-weight-bold mt-1">Monto</div>
                                            </>
                                        : ''
                                    }
                                    </div>
								</div>
							</div>
                            <div class="col-md-3">
								<div class="d-flex align-items-center mr-2">
									<div class="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
										<div class="symbol-label">
											<span class="svg-icon svg-icon-lg svg-icon-primary">
												<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                    <polygon points="0 0 24 0 24 24 0 24"/>
                                                    <path d="M5.85714286,2 L13.7364114,2 C14.0910962,2 14.4343066,2.12568431 14.7051108,2.35473959 L19.4686994,6.3839416 C19.8056532,6.66894833 20,7.08787823 20,7.52920201 L20,20.0833333 C20,21.8738751 19.9795521,22 18.1428571,22 L5.85714286,22 C4.02044787,22 4,21.8738751 4,20.0833333 L4,3.91666667 C4,2.12612489 4.02044787,2 5.85714286,2 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"/>
                                                    <rect fill="#000000" x="6" y="11" width="9" height="2" rx="1"/>
                                                    <rect fill="#000000" x="6" y="15" width="5" height="2" rx="1"/>
                                                </g>
												</svg>
											</span>
										</div>
									</div>
									<div>
                                        <div class="font-size-h6 text-dark-75 font-weight-bolder">{data.factura ? 'Con factura' : 'Sin factura'}</div>
										<div class="font-size-sm text-muted font-weight-bold mt-1">Factura</div>
									</div>
								</div>
                            </div>
                            <div class="col-md-3">
								<div class="d-flex align-items-center mr-2">
									<div class="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
										<div class="symbol-label">
											<span class="svg-icon svg-icon-lg svg-icon-info">
												<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                    <rect x="0" y="0" width="24" height="24"/>
                                                    <rect fill="#000000" opacity="0.3" x="11.5" y="2" width="2" height="4" rx="1"/>
                                                    <rect fill="#000000" opacity="0.3" x="11.5" y="16" width="2" height="5" rx="1"/>
                                                    <path d="M15.493,8.044 C15.2143319,7.68933156 14.8501689,7.40750104 14.4005,7.1985 C13.9508311,6.98949895 13.5170021,6.885 13.099,6.885 C12.8836656,6.885 12.6651678,6.90399981 12.4435,6.942 C12.2218322,6.98000019 12.0223342,7.05283279 11.845,7.1605 C11.6676658,7.2681672 11.5188339,7.40749914 11.3985,7.5785 C11.2781661,7.74950085 11.218,7.96799867 11.218,8.234 C11.218,8.46200114 11.2654995,8.65199924 11.3605,8.804 C11.4555005,8.95600076 11.5948324,9.08899943 11.7785,9.203 C11.9621676,9.31700057 12.1806654,9.42149952 12.434,9.5165 C12.6873346,9.61150047 12.9723317,9.70966616 13.289,9.811 C13.7450023,9.96300076 14.2199975,10.1308324 14.714,10.3145 C15.2080025,10.4981676 15.6576646,10.7419985 16.063,11.046 C16.4683354,11.3500015 16.8039987,11.7268311 17.07,12.1765 C17.3360013,12.6261689 17.469,13.1866633 17.469,13.858 C17.469,14.6306705 17.3265014,15.2988305 17.0415,15.8625 C16.7564986,16.4261695 16.3733357,16.8916648 15.892,17.259 C15.4106643,17.6263352 14.8596698,17.8986658 14.239,18.076 C13.6183302,18.2533342 12.97867,18.342 12.32,18.342 C11.3573285,18.342 10.4263378,18.1741683 9.527,17.8385 C8.62766217,17.5028317 7.88033631,17.0246698 7.285,16.404 L9.413,14.238 C9.74233498,14.6433354 10.176164,14.9821653 10.7145,15.2545 C11.252836,15.5268347 11.7879973,15.663 12.32,15.663 C12.5606679,15.663 12.7949989,15.6376669 13.023,15.587 C13.2510011,15.5363331 13.4504991,15.4540006 13.6215,15.34 C13.7925009,15.2259994 13.9286662,15.0740009 14.03,14.884 C14.1313338,14.693999 14.182,14.4660013 14.182,14.2 C14.182,13.9466654 14.1186673,13.7313342 13.992,13.554 C13.8653327,13.3766658 13.6848345,13.2151674 13.4505,13.0695 C13.2161655,12.9238326 12.9248351,12.7908339 12.5765,12.6705 C12.2281649,12.5501661 11.8323355,12.420334 11.389,12.281 C10.9583312,12.141666 10.5371687,11.9770009 10.1255,11.787 C9.71383127,11.596999 9.34650161,11.3531682 9.0235,11.0555 C8.70049838,10.7578318 8.44083431,10.3968355 8.2445,9.9725 C8.04816568,9.54816454 7.95,9.03200304 7.95,8.424 C7.95,7.67666293 8.10199848,7.03700266 8.406,6.505 C8.71000152,5.97299734 9.10899753,5.53600171 9.603,5.194 C10.0970025,4.85199829 10.6543302,4.60183412 11.275,4.4435 C11.8956698,4.28516587 12.5226635,4.206 13.156,4.206 C13.9160038,4.206 14.6918294,4.34533194 15.4835,4.624 C16.2751706,4.90266806 16.9686637,5.31433061 17.564,5.859 L15.493,8.044 Z" fill="#000000"/>
                                                </g>
												</svg>
											</span>
										</div>
									</div>
									<div>
                                        {
                                            data.tipo_pago ?
                                            <div class="font-size-h6 text-dark-75 font-weight-bolder">{data.tipo_pago.tipo}</div>
                                            : ''
                                        }
                                        <div class="font-size-sm text-muted font-weight-bold mt-1">TIPO DE PAGO</div>
									</div>
								</div>
                            </div>
                            <div class="col-md-3">
								<div class="d-flex align-items-center mr-2">
									<div class="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
										<div class="symbol-label">
											<span class="svg-icon svg-icon-lg svg-icon-primary">
												<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                    <rect x="0" y="0" width="24" height="24"/>
                                                    <polygon fill="#000000" opacity="0.3" points="6 3 18 3 20 6.5 4 6.5"/>
                                                    <path d="M6,5 L18,5 C19.1045695,5 20,5.8954305 20,7 L20,19 C20,20.1045695 19.1045695,21 18,21 L6,21 C4.8954305,21 4,20.1045695 4,19 L4,7 C4,5.8954305 4.8954305,5 6,5 Z M9,9 C8.44771525,9 8,9.44771525 8,10 C8,10.5522847 8.44771525,11 9,11 L15,11 C15.5522847,11 16,10.5522847 16,10 C16,9.44771525 15.5522847,9 15,9 L9,9 Z" fill="#000000"/>
                                                </g>
												</svg>
											</span>
										</div>
									</div>
									<div>
                                        {
                                            data.created_at ? 
                                                <div class="font-size-h6 text-dark-75 font-weight-bolder">
                                                    <Moment format="DD/MM/YYYY">
                                                        {data.created_at}
                                                    </Moment>
                                                </div>
                                            : ''
                                        }
										<div class="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
									</div>
								</div>
                            </div>
						</div>
                        <div class="row row-paddingless">
							<div class="col-md-3">
								<div class="d-flex align-items-center mr-2">
									<div class="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
										<div class="symbol-label">
										    <span class="svg-icon svg-icon-lg svg-icon-primary">
												<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
													<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <rect x="0" y="0" width="24" height="24"/>
                                                        <rect fill="#000000" x="2" y="5" width="19" height="4" rx="1"/>
                                                        <rect fill="#000000" opacity="0.3" x="2" y="11" width="19" height="10" rx="1"/>
                                                    </g>
												</svg>					
											</span>
										</div>
									</div>
									<div>
                                        {  
                                            data.subarea ?
                                                <div class="font-size-h6 text-dark-75 font-weight-bolder">{data.subarea.area.nombre}</div>
                                            : ''
                                        }
										<div class="font-size-sm text-muted font-weight-bold mt-1">ÁREA</div>
									</div>						
								</div>
							</div>						
							<div class="col-md-3">
								<div class="d-flex align-items-center mr-2">
									<div class="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
										<div class="symbol-label">
											<span class="svg-icon svg-icon-lg svg-icon-info">
												<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
													<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <rect x="0" y="0" width="24" height="24"/>
                                                        <path d="M10.5,5 L20.5,5 C21.3284271,5 22,5.67157288 22,6.5 L22,9.5 C22,10.3284271 21.3284271,11 20.5,11 L10.5,11 C9.67157288,11 9,10.3284271 9,9.5 L9,6.5 C9,5.67157288 9.67157288,5 10.5,5 Z M10.5,13 L20.5,13 C21.3284271,13 22,13.6715729 22,14.5 L22,17.5 C22,18.3284271 21.3284271,19 20.5,19 L10.5,19 C9.67157288,19 9,18.3284271 9,17.5 L9,14.5 C9,13.6715729 9.67157288,13 10.5,13 Z" fill="#000000"/>
                                                        <rect fill="#000000" opacity="0.3" x="2" y="5" width="5" height="14" rx="1"/>
                                                    </g>
                                                </svg>					
											</span>
										</div>
									</div>
                                    <div>
                                        {  
                                            data.subarea ?
                                                <div class="font-size-h6 text-dark-75 font-weight-bolder">{data.subarea.nombre}</div>
                                            : ''
                                        }
                                        <div class="font-size-sm text-muted font-weight-bold mt-1">SUB-ÁREA</div>
                                    </div>				
								</div>
							</div>
                            <div class="col-md-5">
								<div class="d-flex align-items-center mr-2">
									<div class="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
										<div class="symbol-label">
											<span class="svg-icon svg-icon-lg svg-icon-primary">
												<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
													<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <rect x="0" y="0" width="24" height="24"/>
                                                        <path d="M14,16 L12,16 L12,12.5 C12,11.6715729 11.3284271,11 10.5,11 C9.67157288,11 9,11.6715729 9,12.5 L9,17.5 C9,19.4329966 10.5670034,21 12.5,21 C14.4329966,21 16,19.4329966 16,17.5 L16,7.5 C16,5.56700338 14.4329966,4 12.5,4 L12,4 C10.3431458,4 9,5.34314575 9,7 L7,7 C7,4.23857625 9.23857625,2 12,2 L12.5,2 C15.5375661,2 18,4.46243388 18,7.5 L18,17.5 C18,20.5375661 15.5375661,23 12.5,23 C9.46243388,23 7,20.5375661 7,17.5 L7,12.5 C7,10.5670034 8.56700338,9 10.5,9 C12.4329966,9 14,10.5670034 14,12.5 L14,16 Z" fill="#000000" fill-rule="nonzero" transform="translate(12.500000, 12.500000) rotate(-315.000000) translate(-12.500000, -12.500000) "/>
                                                    </g>
												</svg>					
											</span>
										</div>
									</div>
                                    <div>
                                        {  
                                            data.adjunto ?
                                            <a href={data.adjunto.url} target="_blank">
                                                <div class="font-size-h6 text-dark-75 font-weight-bolder">{data.adjunto.name}</div>
                                            </a>
                                            : 
                                                <div class="font-size-h6 text-dark-75 font-weight-bolder">SIN ADJUNTO</div>
                                        }
                                        <div class="font-size-sm text-muted font-weight-bold mt-1">Adjunto</div>
                                    </div>				
								</div>
							</div>						
						</div>
					</div>
				</Card>
		    </div>
                              
            // <Card className="mx-md-5 my-3">
            //     <div className="row mx-0">
            //         <div className="col-md-12 mb-3">
            //             <P className="text-center" color="gold">
            //                 Solicitud de venta
            //             </P>
            //         </div>
            //         {
            //             children
            //         }
            //         {
            //             data.proyecto ?
            //                 <div className="col-md-6">
            //                     <Small>
            //                         <B color="gold">
            //                             Proyecto:
            //                         </B>
            //                     </Small>
            //                     <br />
            //                     <Small color="dark-blue">
            //                         {
            //                             data.proyecto.nombre
            //                         }
            //                     </Small>
            //                     <hr />
            //                 </div>
            //             : ''
            //         }
            //         {
            //             data.empresa ?
            //                 <div className="col-md-6">
            //                     <Small>
            //                         <B color="gold">
            //                             Empresa:
            //                         </B>
            //                     </Small>
            //                     <br />
            //                     <Small color="dark-blue">
            //                         {
            //                             data.empresa.name
            //                         }
            //                     </Small>
            //                     <hr />
            //                 </div>
            //             : ''
            //         }
            //         {
            //             data.monto ?
            //                 <div className="col-md-6">
            //                     <Small>
            //                         <B color="gold">
            //                             Monto:
            //                         </B>
            //                     </Small>
            //                     <br />
            //                     <NumberFormat value = { data.monto } displayType = { 'text' } thousandSeparator = { true } prefix = { '$' }
            //                         renderText = { value => <Small color="dark-blue"> { value } </Small> } />
            //                     <hr />
            //                 </div>
            //             : ''
            //         }
            //         <div className="col-md-6">
            //             <Small>
            //                 <B color="gold">
            //                     Factura:
            //                 </B>
            //             </Small>
            //             <br />
            //             <Small color="dark-blue">
            //                 {
            //                     data.factura ? 'Con factura' : 'Sin factura'
            //                 }
            //             </Small>
            //             <hr />
            //         </div>
            //         {
            //             data.tipo_pago ?
            //                 <div className="col-md-6">
            //                     <Small>
            //                         <B color="gold">
            //                             Tipo de pago:
            //                         </B>
            //                     </Small>
            //                     <br />
            //                     <Small color="dark-blue">
            //                         {
            //                             data.tipo_pago.tipo
            //                         }
            //                     </Small>
            //                     <hr />
            //                 </div>
            //             : ''
            //         }
            //         {
            //             data.subarea ?
            //                 <>
            //                     {
            //                         data.subarea.area ?
            //                             <div className="col-md-6">
            //                                 <Small>
            //                                     <B color="gold">
            //                                         Área:
            //                                     </B>
            //                                 </Small>
            //                                 <br />
            //                                 <Small color="dark-blue">
            //                                     {
            //                                         data.subarea.area.nombre
            //                                     }
            //                                 </Small>
            //                                 <hr />
            //                             </div>
            //                         : ''
            //                     }
            //                     <div className="col-md-6">
            //                         <Small>
            //                             <B color="gold">
            //                                 Subarea:
            //                             </B>
            //                         </Small>
            //                         <br />
            //                         <Small color="dark-blue">
            //                             {
            //                                 data.subarea.nombre
            //                             }
            //                         </Small>
            //                         <hr />
            //                     </div>
            //                 </>
            //             : ''
            //         }
            //         {
            //             data.created_at ?
            //                 <div className="col-md-6">
            //                     <Small>
            //                         <B color="gold">
            //                             Fecha:
            //                         </B>
            //                     </Small>
            //                     <br />
            //                     <Small color="dark-blue">
            //                         <Moment format="DD/MM/YYYY">
            //                             {data.created_at}
            //                         </Moment>
            //                     </Small>
                                
            //                     <hr />
            //                 </div>
            //             : ''
            //         }
            //         <div className="col-md-6">
            //             <Small>
            //                 <B color="gold">
            //                     Adjunto:
            //                 </B>
            //             </Small>
            //             <br />
            //             {
            //                 data.adjunto ?
            //                     <a href={data.adjunto.url} target="_blank">
            //                         <Small>
            //                             {
            //                                 data.adjunto.name
            //                             }
            //                         </Small>
            //                     </a>
            //                 :
            //                     <Small>
            //                         Sin adjunto
            //                     </Small>
            //             }
            //             <hr />
            //         </div>
            //         {
            //             data.descripcion ?
            //                 <div className="col-md-6">
            //                     <Small>
            //                         <B color="gold">
            //                             Descripción:
            //                         </B>
            //                     </Small>
            //                     <br />
            //                     <Small color="dark-blue">
            //                         {
            //                             data.descripcion
            //                         }
            //                     </Small>
            //                     <hr />
            //                 </div>
            //             : ''
            //         }
            //     </div>
            // </Card>
        )
    }
}