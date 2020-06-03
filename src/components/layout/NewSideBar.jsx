import React, { Component } from 'react';
import ReactDOM from 'react-dom'

 

class NewSideBar extends Component {
  render() {
    return (
	<div>
		{/*begin::Aside Menu*/}
		<div className="aside-menu-wrapper flex-column-fluid" id="kt_aside_menu_wrapper">
		{/*begin::Menu Container*/}
		<div id="kt_aside_menu" className="aside-menu my-4" data-menu-vertical="1" data-menu-scroll="1" data-menu-dropdown-timeout="500">
			{/*begin::Menu Nav*/}
			<ul className="menu-nav">
				<li className="menu-item menu-item-active" aria-haspopup="true" style="margin-top: 10px;margin-bottom: 10px;">
					<a href="index.html" className="menu-link">
						<span className="svg-icon menu-icon">
							{/*begin::Svg Icon | path:assets/media/svg/icons/Design/Layers.svg*/}
							<svg xmlns="http://www.w3.org/2000/svg"   width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
								<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
									<polygon points="0 0 24 0 24 24 0 24" />
									<path d="M12.9336061,16.072447 L19.36,10.9564761 L19.5181585,10.8312381 C20.1676248,10.3169571 20.2772143,9.3735535 19.7629333,8.72408713 C19.6917232,8.63415859 19.6104327,8.55269514 19.5206557,8.48129411 L12.9336854,3.24257445 C12.3871201,2.80788259 11.6128799,2.80788259 11.0663146,3.24257445 L4.47482784,8.48488609 C3.82645598,9.00054628 3.71887192,9.94418071 4.23453211,10.5925526 C4.30500305,10.6811601 4.38527899,10.7615046 4.47382636,10.8320511 L4.63,10.9564761 L11.0659024,16.0730648 C11.6126744,16.5077525 12.3871218,16.5074963 12.9336061,16.072447 Z" fill="#000000" fillRule="nonzero" />
									<path d="M11.0563554,18.6706981 L5.33593024,14.122919 C4.94553994,13.8125559 4.37746707,13.8774308 4.06710397,14.2678211 C4.06471678,14.2708238 4.06234874,14.2738418 4.06,14.2768747 L4.06,14.2768747 C3.75257288,14.6738539 3.82516916,15.244888 4.22214834,15.5523151 C4.22358765,15.5534297 4.2250303,15.55454 4.22647627,15.555646 L11.0872776,20.8031356 C11.6250734,21.2144692 12.371757,21.2145375 12.909628,20.8033023 L19.7677785,15.559828 C20.1693192,15.2528257 20.2459576,14.6784381 19.9389553,14.2768974 C19.9376429,14.2751809 19.9363245,14.2734691 19.935,14.2717619 L19.935,14.2717619 C19.6266937,13.8743807 19.0546209,13.8021712 18.6572397,14.1104775 C18.654352,14.112718 18.6514778,14.1149757 18.6486172,14.1172508 L12.9235044,18.6705218 C12.377022,19.1051477 11.6029199,19.1052208 11.0563554,18.6706981 Z" fill="#000000" opacity="0.3" />
								</g>
							</svg>
							{/*end::Svg Icon*/}
						</span>
						<span className="menu-text">Inicio</span>
					</a>
				</li>
				
				<li className="menu-item menu-item-submenu" aria-haspopup="true" data-menu-toggle="hover" style="margin-top: 10px;margin-bottom: 10px;">
					<a href="javascript:;" className="menu-link menu-toggle">
						<span className="svg-icon menu-icon">
							{/*begin::Svg Icon | path:assets/media/svg/icons/General/Settings-1.svg*/}
							<svg xmlns="http://www.w3.org/2000/svg"   width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
								<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
									<polygon points="0 0 24 0 24 24 0 24"/>
									<path d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z" fill="#000000" fillRule="nonzero" opacity="0.3"/>
									<path d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z" fill="#000000" fillRule="nonzero"/>
								</g>
							</svg>
							{/*end::Svg Icon*/}
						</span>
						<span className="menu-text">Usuarios</span>
						<i className="menu-arrow"></i>
					</a>
					<div className="menu-submenu">
						<i className="menu-arrow"></i>
						<ul className="menu-subnav">
							<li className="menu-item menu-item-parent" aria-haspopup="true">
								<span className="menu-link">
									<span className="menu-text">Usuarios</span>
								</span>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Usuarios</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Empresas</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Tareas</span>
								</a>
							</li>
							
						</ul>
					</div>
				</li>
				
				
				<li className="menu-item menu-item-submenu" aria-haspopup="true" data-menu-toggle="hover" style="margin-top: 10px;margin-bottom: 10px;">
					<a href="javascript:;" className="menu-link menu-toggle">
						<span className="svg-icon menu-icon">
							{/*begin::Svg Icon | path:assets/media/svg/icons/Shopping/Box2.svg*/}
							<svg xmlns="http://www.w3.org/2000/svg"   width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
								<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
									<rect x="0" y="0" width="24" height="24"/>
									<rect fill="#000000" opacity="0.3" x="7" y="4" width="10" height="4"/>
									<path d="M7,2 L17,2 C18.1045695,2 19,2.8954305 19,4 L19,20 C19,21.1045695 18.1045695,22 17,22 L7,22 C5.8954305,22 5,21.1045695 5,20 L5,4 C5,2.8954305 5.8954305,2 7,2 Z M8,12 C8.55228475,12 9,11.5522847 9,11 C9,10.4477153 8.55228475,10 8,10 C7.44771525,10 7,10.4477153 7,11 C7,11.5522847 7.44771525,12 8,12 Z M8,16 C8.55228475,16 9,15.5522847 9,15 C9,14.4477153 8.55228475,14 8,14 C7.44771525,14 7,14.4477153 7,15 C7,15.5522847 7.44771525,16 8,16 Z M12,12 C12.5522847,12 13,11.5522847 13,11 C13,10.4477153 12.5522847,10 12,10 C11.4477153,10 11,10.4477153 11,11 C11,11.5522847 11.4477153,12 12,12 Z M12,16 C12.5522847,16 13,15.5522847 13,15 C13,14.4477153 12.5522847,14 12,14 C11.4477153,14 11,14.4477153 11,15 C11,15.5522847 11.4477153,16 12,16 Z M16,12 C16.5522847,12 17,11.5522847 17,11 C17,10.4477153 16.5522847,10 16,10 C15.4477153,10 15,10.4477153 15,11 C15,11.5522847 15.4477153,12 16,12 Z M16,16 C16.5522847,16 17,15.5522847 17,15 C17,14.4477153 16.5522847,14 16,14 C15.4477153,14 15,14.4477153 15,15 C15,15.5522847 15.4477153,16 16,16 Z M16,20 C16.5522847,20 17,19.5522847 17,19 C17,18.4477153 16.5522847,18 16,18 C15.4477153,18 15,18.4477153 15,19 C15,19.5522847 15.4477153,20 16,20 Z M8,18 C7.44771525,18 7,18.4477153 7,19 C7,19.5522847 7.44771525,20 8,20 L12,20 C12.5522847,20 13,19.5522847 13,19 C13,18.4477153 12.5522847,18 12,18 L8,18 Z M7,4 L7,8 L17,8 L17,4 L7,4 Z" fill="#000000"/>
								</g>
							</svg>
							{/*end::Svg Icon*/}
						</span>
						<span className="menu-text">Presupuestos</span>
						<i className="menu-arrow"></i>
					</a>
					<div className="menu-submenu">
						<i className="menu-arrow"></i>
						<ul className="menu-subnav">
							<li className="menu-item menu-item-parent" aria-haspopup="true">
								<span className="menu-link">
									<span className="menu-text">Presupuestos</span>
								</span>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Conceptos</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Presupuestos</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Rendimiento</span>
								</a>
							</li>
							
						</ul>
					</div>
				</li>
				<li className="menu-item menu-item-submenu" aria-haspopup="true" data-menu-toggle="hover" style="margin-top: 10px;margin-bottom: 10px;">
					<a href="javascript:;" className="menu-link menu-toggle">
						<span className="svg-icon menu-icon">
							{/*begin::Svg Icon | path:assets/media/svg/icons/Files/Pictures1.svg*/}
							<svg xmlns="http://www.w3.org/2000/svg"   width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
								<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
									<rect x="0" y="0" width="24" height="24"/>
									<path d="M3.5,21 L20.5,21 C21.3284271,21 22,20.3284271 22,19.5 L22,8.5 C22,7.67157288 21.3284271,7 20.5,7 L10,7 L7.43933983,4.43933983 C7.15803526,4.15803526 6.77650439,4 6.37867966,4 L3.5,4 C2.67157288,4 2,4.67157288 2,5.5 L2,19.5 C2,20.3284271 2.67157288,21 3.5,21 Z" fill="#000000" opacity="0.3"/>
									<rect fill="#000000" opacity="0.3" transform="translate(8.984240, 14.127098) rotate(-45.000000) translate(-8.984240, -14.127098) " x="7.41281179" y="12.5556689" width="3.14285714" height="3.14285714" rx="0.75"/>
									<rect fill="#000000" opacity="0.3" transform="translate(15.269955, 14.127098) rotate(-45.000000) translate(-15.269955, -14.127098) " x="13.6985261" y="12.5556689" width="3.14285714" height="3.14285714" rx="0.75"/>
									<rect fill="#000000" transform="translate(12.127098, 17.269955) rotate(-45.000000) translate(-12.127098, -17.269955) " x="10.5556689" y="15.6985261" width="3.14285714" height="3.14285714" rx="0.75"/>
									<rect fill="#000000" transform="translate(12.127098, 10.984240) rotate(-45.000000) translate(-12.127098, -10.984240) " x="10.5556689" y="9.41281179" width="3.14285714" height="3.14285714" rx="0.75"/>
								</g>
							</svg>
							{/*end::Svg Icon*/}
						</span>
						<span className="menu-text">Proyectos</span>
						<i className="menu-arrow"></i>
					</a>
					<div className="menu-submenu">
						<i className="menu-arrow"></i>
						<ul className="menu-subnav">
							<li className="menu-item menu-item-parent" aria-haspopup="true">
								<span className="menu-link">
									<span className="menu-text">Proyectos</span>
								</span>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Compras</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Herramientas</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Proyectos</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Remisión</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Solicitud de compra</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Reportes</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Utilidad</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Ventas</span>
								</a>
							</li>
						</ul>
					</div>
				</li>
				<li className="menu-item menu-item-submenu" aria-haspopup="true" data-menu-toggle="hover" style="margin-top: 10px;margin-bottom: 10px;">
					<a href="javascript:;" className="menu-link menu-toggle">
						<span className="svg-icon menu-icon">
							{/*begin::Svg Icon | path:assets/media/svg/icons/Layout/Layout-arrange.svg*/}
							<svg xmlns="http://www.w3.org/2000/svg"   width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
								<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
									<rect x="0" y="0" width="24" height="24" />
									<rect fill="#000000" opacity="0.3" x="2" y="3" width="20" height="18" rx="2" />
									<path d="M9.9486833,13.3162278 C9.81256925,13.7245699 9.43043041,14 9,14 L5,14 C4.44771525,14 4,13.5522847 4,13 C4,12.4477153 4.44771525,12 5,12 L8.27924078,12 L10.0513167,6.68377223 C10.367686,5.73466443 11.7274983,5.78688777 11.9701425,6.75746437 L13.8145063,14.1349195 L14.6055728,12.5527864 C14.7749648,12.2140024 15.1212279,12 15.5,12 L19,12 C19.5522847,12 20,12.4477153 20,13 C20,13.5522847 19.5522847,14 19,14 L16.118034,14 L14.3944272,17.4472136 C13.9792313,18.2776054 12.7550291,18.143222 12.5298575,17.2425356 L10.8627389,10.5740611 L9.9486833,13.3162278 Z" fill="#000000" fillRule="nonzero" />
									<circle fill="#000000" opacity="0.3" cx="19" cy="6" r="1" />
								</g>
							</svg>
							{/*end::Svg Icon*/}
						</span>
						<span className="menu-text">Administración</span>
						<i className="menu-arrow"></i>
					</a>
					<div className="menu-submenu">
						<i className="menu-arrow"></i>
						<ul className="menu-subnav">
							<li className="menu-item menu-item-parent" aria-haspopup="true">
								<span className="menu-link">
									<span className="menu-text">Administración</span>
								</span>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Contratos</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Herramientas</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Proyectos</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Remisión</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Solicitud de compra</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Reportes</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Utilidad</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Ventas</span>
								</a>
							</li>
						</ul>
					</div>
				</li>
				<li className="menu-item menu-item-submenu" aria-haspopup="true" data-menu-toggle="hover" style="margin-top: 10px;margin-bottom: 10px;">
					<a href="javascript:;" className="menu-link menu-toggle">
						<span className="svg-icon menu-icon">
							{/*begin::Svg Icon | path:assets/media/svg/icons/Devices/Diagnostics.svg*/}
							<svg xmlns="http://www.w3.org/2000/svg"   width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
								<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
									<rect x="0" y="0" width="24" height="24"/>
									<rect fill="#000000" opacity="0.3" x="2" y="5" width="20" height="14" rx="2"/>
									<rect fill="#000000" x="2" y="8" width="20" height="3"/>
									<rect fill="#000000" opacity="0.3" x="16" y="14" width="4" height="2" rx="1"/>
								</g>
							</svg>
							{/*end::Svg Icon*/}
						</span>
						<span className="menu-text">Bancos</span>
						<i className="menu-arrow"></i>
					</a>
					<div className="menu-submenu">
						<i className="menu-arrow"></i>
						<ul className="menu-subnav">
							<li className="menu-item menu-item-parent" aria-haspopup="true">
								<span className="menu-link">
									<span className="menu-text">Bancos</span>
								</span>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Cuentas</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Estados de cuenta</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Transpasos</span>
								</a>
							</li>
						</ul>
					</div>
				</li>
				
				<li className="menu-item menu-item-submenu" aria-haspopup="true" data-menu-toggle="hover" style="margin-top: 10px;margin-bottom: 10px;">
					<a href="javascript:;" className="menu-link menu-toggle">
						<span className="svg-icon menu-icon">
							{/*begin::Svg Icon | path:assets/media/svg/icons/Design/Select.svg*/}
							<svg xmlns="http://www.w3.org/2000/svg"   width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
								<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
									<polygon points="0 0 24 0 24 24 0 24"/>
									<path d="M18,14 C16.3431458,14 15,12.6568542 15,11 C15,9.34314575 16.3431458,8 18,8 C19.6568542,8 21,9.34314575 21,11 C21,12.6568542 19.6568542,14 18,14 Z M9,11 C6.790861,11 5,9.209139 5,7 C5,4.790861 6.790861,3 9,3 C11.209139,3 13,4.790861 13,7 C13,9.209139 11.209139,11 9,11 Z" fill="#000000" fillRule="nonzero" opacity="0.3"/>
									<path d="M17.6011961,15.0006174 C21.0077043,15.0378534 23.7891749,16.7601418 23.9984937,20.4 C24.0069246,20.5466056 23.9984937,21 23.4559499,21 L19.6,21 C19.6,18.7490654 18.8562935,16.6718327 17.6011961,15.0006174 Z M0.00065168429,20.1992055 C0.388258525,15.4265159 4.26191235,13 8.98334134,13 C13.7712164,13 17.7048837,15.2931929 17.9979143,20.2 C18.0095879,20.3954741 17.9979143,21 17.2466999,21 C13.541124,21 8.03472472,21 0.727502227,21 C0.476712155,21 -0.0204617505,20.45918 0.00065168429,20.1992055 Z" fill="#000000" fillRule="nonzero"/>
								</g>
							</svg>
							{/*end::Svg Icon*/}
						</span>
						<span className="menu-text">Recursos Humanos</span>
						<i className="menu-arrow"></i>
					</a>
					<div className="menu-submenu">
						<i className="menu-arrow"></i>
						<ul className="menu-subnav">
							<li className="menu-item menu-item-parent" aria-haspopup="true">
								<span className="menu-link">
									<span className="menu-text">Recursos Humanos</span>
								</span>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Empleados</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">IMSS</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Nómina Admin</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Nómina Obras</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Préstamos</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Vacaciones</span>
								</a>
							</li>
						</ul>
					</div>
				</li>
				
				<li className="menu-item menu-item-submenu" aria-haspopup="true" data-menu-toggle="hover" style="margin-top: 10px;margin-bottom: 10px;">
					<a href="javascript:;" className="menu-link menu-toggle">
						<span className="svg-icon menu-icon">
							{/*begin::Svg Icon | path:assets/media/svg/icons/Home/Book-open.svg*/}
							<svg xmlns="http://www.w3.org/2000/svg"   width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
								<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
									<rect x="0" y="0" width="24" height="24"/>
									<path d="M3.5,21 L20.5,21 C21.3284271,21 22,20.3284271 22,19.5 L22,8.5 C22,7.67157288 21.3284271,7 20.5,7 L10,7 L7.43933983,4.43933983 C7.15803526,4.15803526 6.77650439,4 6.37867966,4 L3.5,4 C2.67157288,4 2,4.67157288 2,5.5 L2,19.5 C2,20.3284271 2.67157288,21 3.5,21 Z" fill="#000000" opacity="0.3"/>
									<path d="M12,13 C10.8954305,13 10,12.1045695 10,11 C10,9.8954305 10.8954305,9 12,9 C13.1045695,9 14,9.8954305 14,11 C14,12.1045695 13.1045695,13 12,13 Z" fill="#000000" opacity="0.3"/>
									<path d="M7.00036205,18.4995035 C7.21569918,15.5165724 9.36772908,14 11.9907452,14 C14.6506758,14 16.8360465,15.4332455 16.9988413,18.5 C17.0053266,18.6221713 16.9988413,19 16.5815,19 C14.5228466,19 11.463736,19 7.4041679,19 C7.26484009,19 6.98863236,18.6619875 7.00036205,18.4995035 Z" fill="#000000" opacity="0.3"/>
								</g>
							</svg>
							{/*end::Svg Icon*/}
						</span>
						<span className="menu-text">Leads</span>
						<i className="menu-arrow"></i>
					</a>
					<div className="menu-submenu">
						<i className="menu-arrow"></i>
						<ul className="menu-subnav">
							<li className="menu-item menu-item-parent" aria-haspopup="true">
								<span className="menu-link">
									<span className="menu-text">Leads</span>
								</span>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Leads</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Prospectos</span>
								</a>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Clientes</span>
								</a>
							</li>
						</ul>
					</div>
				</li>

				<li className="menu-item" aria-haspopup="true" style="margin-top: 10px;margin-bottom: 10px;">
					<a target="_blank" href="" className="menu-link">
						<span className="svg-icon menu-icon">
							{/*begin::Svg Icon | path:assets/media/svg/icons/Home/Library.svg*/}
							<svg xmlns="http://www.w3.org/2000/svg"   width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
								<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
									<polygon points="0 0 24 0 24 24 0 24"/>
									<path d="M9.26193932,16.6476484 C8.90425297,17.0684559 8.27315905,17.1196257 7.85235158,16.7619393 C7.43154411,16.404253 7.38037434,15.773159 7.73806068,15.3523516 L16.2380607,5.35235158 C16.6013618,4.92493855 17.2451015,4.87991302 17.6643638,5.25259068 L22.1643638,9.25259068 C22.5771466,9.6195087 22.6143273,10.2515811 22.2474093,10.6643638 C21.8804913,11.0771466 21.2484189,11.1143273 20.8356362,10.7474093 L17.0997854,7.42665306 L9.26193932,16.6476484 Z" fill="#000000" fillRule="nonzero" opacity="0.3" transform="translate(14.999995, 11.000002) rotate(-180.000000) translate(-14.999995, -11.000002) "/>
									<path d="M4.26193932,17.6476484 C3.90425297,18.0684559 3.27315905,18.1196257 2.85235158,17.7619393 C2.43154411,17.404253 2.38037434,16.773159 2.73806068,16.3523516 L11.2380607,6.35235158 C11.6013618,5.92493855 12.2451015,5.87991302 12.6643638,6.25259068 L17.1643638,10.2525907 C17.5771466,10.6195087 17.6143273,11.2515811 17.2474093,11.6643638 C16.8804913,12.0771466 16.2484189,12.1143273 15.8356362,11.7474093 L12.0997854,8.42665306 L4.26193932,17.6476484 Z" fill="#000000" fillRule="nonzero" transform="translate(9.999995, 12.000002) rotate(-180.000000) translate(-9.999995, -12.000002) "/>
								</g>
							</svg>
							{/*end::Svg Icon*/}
						</span>
						<span className="menu-text">Normas</span>
					</a>
				</li>

				<li className="menu-item menu-item-submenu" aria-haspopup="true" data-menu-toggle="hover" style="margin-top: 10px;margin-bottom: 10px;">
					<a href="javascript:;" className="menu-link menu-toggle">
						<span className="svg-icon menu-icon">
							{/*begin::Svg Icon | path:assets/media/svg/icons/Home/Mirror.svg*/}
							<svg xmlns="http://www.w3.org/2000/svg"   width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
								<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
									<rect x="0" y="0" width="24" height="24"/>
									<path d="M15.9956071,6 L9,6 C7.34314575,6 6,7.34314575 6,9 L6,15.9956071 C4.70185442,15.9316381 4,15.1706419 4,13.8181818 L4,6.18181818 C4,4.76751186 4.76751186,4 6.18181818,4 L13.8181818,4 C15.1706419,4 15.9316381,4.70185442 15.9956071,6 Z" fill="#000000" fillRule="nonzero" opacity="0.3"/>
									<path d="M10.1818182,8 L17.8181818,8 C19.2324881,8 20,8.76751186 20,10.1818182 L20,17.8181818 C20,19.2324881 19.2324881,20 17.8181818,20 L10.1818182,20 C8.76751186,20 8,19.2324881 8,17.8181818 L8,10.1818182 C8,8.76751186 8.76751186,8 10.1818182,8 Z" fill="#000000"/>
								</g>
							</svg>
							{/*end::Svg Icon*/}
						</span>
						<span className="menu-text">Catálogos</span>
						<i className="menu-arrow"></i>
					</a>
					<div className="menu-submenu">
						<i className="menu-arrow"></i>
						<ul className="menu-subnav">
							<li className="menu-item menu-item-parent" aria-haspopup="true">
								<span className="menu-link">
									<span className="menu-text">Catálogos</span>
								</span>
							</li>
							<li className="menu-item" aria-haspopup="true">
								<a href="" className="menu-link">
									<i className="menu-bullet menu-bullet-dot">
										<span></span>
									</i>
									<span className="menu-text">Áreas</span>
								</a>
							</li>
						</ul>
					</div>
				</li>
			</ul>
			{/*end::Menu Nav*/}
		</div>
		{/*end::Menu Container*/}
	</div>
	{/*end::Aside Menu*/}
	</div>
    )
    }
}

export default NewSideBar