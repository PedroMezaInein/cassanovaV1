import React, { Component } from 'react'
import { validateAlert } from '../../../functions/alert'
import { Button, ImageUpload, InputGray } from '../../form-components'
import { Form, Col, Tab, Nav, Row, Card } from 'react-bootstrap'
import { ItemSlider } from '../../../components/singles'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { setDateTableLG } from '../../../functions/setters'
import { EMAIL } from '../../../constants'
class ChangePasswordFrom extends Component {

	getName = () => {
		const { empresas, activeKey } = this.props
		let aux = ''
		empresas.map((empresa) => {
			if (empresa.id.toString() === activeKey)
				aux = empresa.name
			return ''
		})
		return ' ' + aux
	}

	render() {
		const { user, onSubmit, form, onChange, sendAvatar, clearAvatar, handleChange, sendCorreo, empresas, onClickEmpresa, activeKey, formeditado, cropped } = this.props
		
		return (<>
		{
			user&&
			<Tab.Container defaultActiveKey="1" className="p-5">
				<div className="card mb-6 mb-xl-9">
					<div className="card-body pt-9 pb-0">
						<div className="d-flex flex-wrap flex-sm-nowrap mb-3">
							<div className="d-flex flex-center flex-shrink-0 rounded mr-7">
								<img alt='avatar' className="rounded w-100px h-100px w-lg-150px h-lg-150px" src={user.avatar ? user.avatar : "/default.jpg"} />
							</div>
							<div className="flex-grow-1 align-self-center">
								<div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
									<div className="d-flex flex-column">
										<div className="d-flex align-items-center mb-2">
											<span className="text-dark-75 font-size-h3 font-weight-bolder">
												{
													user ? 
														user.empleado?
														user.empleado.nombre : user.name
													: ''
												}
											</span>
										</div>
										<div className="d-flex flex-wrap font-weight-bold text-muted">
											<div className="d-flex align-items-center text-muted mr-5 mb-2">
												<span className="svg-icon svg-icon-2x mr-1">
													<SVG src={toAbsoluteUrl('/images/svg/Folder-star.svg')} />
												</span>
												<span className="font-size-h6">
													{
														user ? 
															user.empleado? user.empleado.puesto : 'CLIENTE'
														: ''
													}
												</span>
											</div>
											<div className="d-flex align-items-center text-muted mr-5 mb-2">
												<span className="svg-icon svg-icon-2x mr-1">
													<SVG src={toAbsoluteUrl('/images/svg/Mail.svg')} />
												</span>
												<a  href={`mailto:+${user.email}`} className="font-size-h6 text-muted">{user ? user.email : ''}</a>
											</div>
										</div>
									</div>
								</div>
								{
									user.tipo !== 3 &&
									<div className="d-flex flex-wrap justify-content-start">
										<div className="d-flex flex-wrap">
											<div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 mr-6">
												<div className="d-flex align-items-center">
													<span className="svg-icon svg-icon-3 svg-icon-success mr-2">
														<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
															<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
																<polygon points="0 0 24 0 24 24 0 24"></polygon>
																<rect fill="#000000" opacity="0.5" x="11" y="5" width="2" height="14" rx="1"></rect>
																<path d="M6.70710678,12.7071068 C6.31658249,13.0976311 5.68341751,13.0976311 5.29289322,12.7071068 C4.90236893,12.3165825 4.90236893,11.6834175 5.29289322,11.2928932 L11.2928932,5.29289322 C11.6714722,4.91431428 12.2810586,4.90106866 12.6757246,5.26284586 L18.6757246,10.7628459 C19.0828436,11.1360383 19.1103465,11.7686056 18.7371541,12.1757246 C18.3639617,12.5828436 17.7313944,12.6103465 17.3242754,12.2371541 L12.0300757,7.38413782 L6.70710678,12.7071068 Z" fill="#000000" fillRule="nonzero"></path>
															</g>
														</svg>
													</span>
													<div className="font-size-h5 font-weight-bolder counted">{user ? setDateTableLG(user.empleado.fecha_inicio) : ''}</div>
												</div>
												<div className="font-weight-bold font-size-lg text-muted">FECHA DE INGRESO</div>
											</div>
											<div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 mr-6">
												<div className="d-flex align-items-center justify-content-center">
													<div className="font-size-h5 font-weight-bolder">{user ? user.empleado.tipo_empleado : ''}</div>
												</div>
												<div className="font-weight-bold font-size-lg text-muted text-center">TIPO DE EMPLEADO</div>
											</div>
											<div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 mr-6">
												<div className="d-flex align-items-center justify-content-center">
													<div className="font-size-h5 font-weight-bolder">{
														user ?
															user.empleado.contratos ?
																user.empleado.contratos[0] ?
																	user.empleado.contratos[0].indefinido === 1 ? 'INDEFINIDO' : 'TIEMPO DETERMINADO'
																	: '-'
																: '-'
															: '-'
													}</div>
												</div>
												<div className="font-weight-bold font-size-lg text-muted text-center">TIPO DE CONTRATO</div>
											</div>
										</div>
									</div>
								}
							</div>
						</div>
						<div className="separator"></div>
						<div className="d-flex overflow-auto h-55px">
							<Nav className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent font-size-h6 font-weight-bolder flex-nowrap align-items-center">
								<Nav.Item className="nav-item">
									<Nav.Link className="nav-link pl-0 pb-0" eventKey="1">
										Cambiar foto de perfil
									</Nav.Link>
								</Nav.Item>
								<Nav.Item className="nav-item">
									<Nav.Link className="nav-link pb-0" eventKey="2">
										Cambiar contraseña
									</Nav.Link>
								</Nav.Item>
								{
									user.tipo !== 3 ?
										<Nav.Item className="nav-item">
											<Nav.Link className="nav-link pb-0" eventKey="3">
												Firma electrónica y correo electrónico
											</Nav.Link>
										</Nav.Item>
										: ''
								}
							</Nav>
						</div>
					</div>
				</div>
					<Row>
						<Col md={12} className="mb-3">
							<Card className="card-custom card-stretch">
								<Tab.Content>
									<Tab.Pane eventKey="1">
										<Card.Header className="align-items-center border-0">
												<h3 className="card-title align-items-start flex-column mb-0">
													<span className="font-weight-bolder text-dark">Cambiar foto de perfil</span>
												</h3>
										</Card.Header>
										<Card.Body>
											<Form id="form-foto"
												onSubmit={
													(e) => {
														e.preventDefault();
														validateAlert(sendAvatar, e, 'form-foto')
													}
												}
											>
												<div className="align-self-center">
													<ImageUpload
														name="foto"
														value={form.foto}
														onChange={onChange}
														clearAvatar={clearAvatar}
														cropped={cropped}
													/>
													{/* {console.log(form)} */}
													{
														form.foto ?
															<div className="form-group row form-group-marginless justify-content-center mb-0 mt-5">
																<div className="text-center">
																	<Button icon='' className="btn btn-light-primary font-weight-bold"
																		onClick={
																			(e) => {
																				e.preventDefault();
																				validateAlert(sendAvatar, e, 'form-foto')
																			}
																		}
																		text="SUBIR FOTO" />
																</div>
															</div>
															: ''
													}
												</div>
											</Form>
										</Card.Body>
									</Tab.Pane>
									<Tab.Pane eventKey="2">
										<Card.Header className="align-items-center border-0 ">
												<h3 className="card-title align-items-start flex-column mb-0">
													<span className="font-weight-bolder text-dark">Cambiar contraseña</span>
												</h3>
										</Card.Header>
										<Card.Body className="pt-0">
											<Form id="form-perfil"
												onSubmit={
													(e) => {
														e.preventDefault();
														validateAlert(onSubmit, e, 'form-perfil')
													}
												}
											>
												<div className="form-group row form-group-marginless justify-content-center">
													<div className="col-md-4">
														<InputGray
															withtaglabel={1}
															withtextlabel={1}
															withplaceholder={1}
															withicon={1}
															withformgroup={0}
															requirevalidation={1}
															placeholder="CONTRASEÑA ACTUAL"
															type="password"
															name="oldPassword"
															value={form.oldPassword}
															onChange={onChange}
															iconclass="fab fa-diaspora"
															messageinc="Incorrecto. Ingresa la contraseña actual."
															letterCase={false}
														/>
													</div>
													<div className="col-md-4">
														<InputGray
															withtaglabel={1}
															withtextlabel={1}
															withplaceholder={1}
															withicon={1}
															withformgroup={0}
															requirevalidation={1}
															placeholder="NUEVA CONTRASEÑA"
															type="password"
															name="newPassword"
															value={form.newPassword}
															onChange={onChange}
															iconclass="fas fa-check"
															messageinc="Incorrecto. Ingresa la nueva contraseña."
															letterCase={false}
														/>
													</div>
													<div className="col-md-4">
														<InputGray
															withtaglabel={1}
															withtextlabel={1}
															withplaceholder={1}
															withicon={1}
															withformgroup={0}
															requirevalidation={1}
															placeholder="VERIFICA CONTRASEÑA"
															type="password"
															name="newPassword2"
															value={form.newPassword2}
															onChange={onChange}
															iconclass="fas fa-user-check"
															messageinc="Incorrecto. Vuelve a introducir la nueva contraseña."
															letterCase={false}
														/>
													</div>
												</div>
												{
													form.oldPassword && form.newPassword && form.newPassword2 && form.newPassword === form.newPassword2 ?
													<div className="card-footer p-0 pt-3">
														<div className="row mx-0">
															<div className="col-lg-12 text-right p-0">
																<Button icon='' className="btn btn-sm btn-bg-light btn-hover-light-primary text-dark-50 text-hover-primary font-weight-bolder font-size-13px py-3"
																	onClick={
																		(e) => {
																			e.preventDefault();
																			validateAlert(onSubmit, e, 'form-perfil')
																		}
																	}
																	text="CAMBIAR CONTRASEÑA" />
															</div>
														</div>
													</div>
													: ''
												}
											</Form>
										</Card.Body>
									</Tab.Pane>
									<Tab.Pane eventKey="3">
										<Card.Header className="align-items-center border-0">
												<h3 className="card-title align-items-start flex-column mb-0">
													<span className="font-weight-bolder text-dark">Firma electrónica y correo electrónico</span>
												</h3>
										</Card.Header>
										<Card.Body className="pt-0">
											<Tab.Container activeKey={activeKey} onSelect={(select) => { onClickEmpresa(select) }}>
												<div className="d-flex justify-content-end mb-8">
													<Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0">
														{
															empresas.map((empresa, key) => {
																return (
																	<Nav.Item className="navi-item" key={key}>
																		<Nav.Link eventKey={empresa.id}>{empresa.name}</Nav.Link>
																	</Nav.Item>
																)
															})
														}
													</Nav>
												</div>
												{/* <div className=''> */}
												{
													activeKey !== '' ?
														<>
															<div className='col-md-10 text-center mt-5 mb-10 mx-auto'>
																<label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.firma.placeholder}</label>
																<div className='d-flex align-items-center justify-content-center'>
																	<ItemSlider
																		items={form.adjuntos.firma.files}
																		item='firma'
																		handleChange={handleChange}
																		multiple={false}
																	/>
																</div>
															</div>
															
															<Form id="form-correo"
																onSubmit={
																	(e) => {
																		e.preventDefault();
																		validateAlert(sendCorreo, e, 'form-correo')
																	}
																}
															>
																<div className="form-group row form-group-marginless justify-content-center">
																	<div className="col-md-4">
																		<InputGray
																			withtaglabel={1}
																			withtextlabel={1}
																			withplaceholder={1}
																			withicon={1}
																			withformgroup={0}
																			requirevalidation={0}
																			placeholder={`CORREO ELECTRÓNICO${this.getName()}`}
																			type="email"
																			name="correo_empresa"
																			value={form.correo_empresa}
																			onChange={onChange}
																			iconclass="fas fa-envelope"
																			messageinc="Incorrecto. Ej. usuario@dominio.com"
																			letterCase={false}
																			patterns={EMAIL}
																			formeditado={formeditado}
																		/>
																	</div>
																</div>
																{
																	form.correo_empresa&&
																	<div className="mt-4 text-center">
																		<Button icon='' className="btn btn-light-primary font-weight-bold"
																			onClick={
																				(e) => {
																					e.preventDefault();
																					validateAlert(sendCorreo, e, 'form-correo')
																				}
																			}
																			text="ENVIAR CORREO" />
																	</div>
																}
															</Form>
														</>
														: ''
												}
												{/* </div> */}
											</Tab.Container>
										</Card.Body>
									</Tab.Pane>
								</Tab.Content>
							</Card>
						</Col>
					</Row >
			</Tab.Container>
		
		}
		</>
			)
	}
}

			export default ChangePasswordFrom