import React, { Component } from 'react'
import { validateAlert } from '../../../functions/alert'
import { Button, Input, ImageUpload } from '../../form-components'
import { Form, Col, Tab, Nav, Row, Card } from 'react-bootstrap'
import { ItemSlider } from '../../../components/singles'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { setDateTableLG } from '../../../functions/setters'
class ChangePasswordFrom extends Component {

	getName = () => {
		const { empresas, activeKey } = this.props
		let aux = ''
		empresas.map((empresa) => {
			if (empresa.id.toString() === activeKey)
				aux = empresa.name
		})
		return ' ' + aux
	}

	render() {
		const { user, onSubmit, form, onChange, sendAvatar, clearAvatar, handleChange, sendFirma, empresas, onClickEmpresa, activeKey } = this.props
		return (<>
			<Tab.Container defaultActiveKey="1" className="p-5">
				<Row>
					<Col md={3} className="mb-3">
						<Card className="card-custom card-stretch">
							<Card.Body>
								<div className="table-responsive">
									<div className="list min-w-300px">
										<div className="row mx-0 px-0 col-md-12">
											<div className="col-md-4 d-flex justify-content-center pb-2">
												<span className="symbol symbol-circle symbol-xxl-100">
													<img className="symbol-label p-1 font-size-h5 font-weight-bold bg-transparent" src={user.avatar ? user.avatar : "/default.jpg"} />
												</span>
											</div>
											<div className="col d-flex justify-content-center align-items-center">
												<div className="text-center">
													<div className="font-weight-bolder font-size-h6 text-dark-75 mb-2">{user ? user.empleado.nombre : ''}</div>
													<div className="text-muted font-size-sm">{user ? user.empleado.puesto : ''}</div>
												</div>
											</div>
										</div>
									</div>
									<div className="my-4">
										<div className="d-flex align-items-center justify-content-between mb-2">
											<span className="font-weight-bolder mr-2">Correo electrónico:</span>
											<a href={`mailto:+${user.email}`}className="text-muted font-weight-bold text-hover-dark">{user ? user.email : ''}</a>
										</div>
										<div className="d-flex align-items-center justify-content-between mb-2">
											<span className="font-weight-bolder mr-2">Fecha de registro:</span>
												<div className="text-muted font-weight-bold text-hover-dark">{user ? setDateTableLG(user.created_at): '' } </div>
										</div>
									</div>
								</div>
								<Nav className="navi navi-bold navi-hover navi-active navi-link-rounded">
									<Nav.Item className="navi-item mb-2">
										<Nav.Link className="navi-link px-2" eventKey="1">
											<span className="navi-icon mr-2">
												<span className="svg-icon">
													<SVG src={toAbsoluteUrl('/images/svg/Camera.svg')} />
												</span>
											</span>
											<div className="navi-text">
												<span className="d-block font-weight-bold">Cambiar foto de perfil</span>
											</div>
										</Nav.Link>
									</Nav.Item>
									<Nav.Item className="navi-item mb-2">
										<Nav.Link className="navi-link px-2" eventKey="2">
											<span className="navi-icon mr-2">
												<span className="svg-icon">
													<SVG src={toAbsoluteUrl('/images/svg/Shield-user.svg')} />
												</span>
											</span>
											<div className="navi-text">
												<span className="d-block font-weight-bold">Cambiar contraseña</span>
											</div>
										</Nav.Link>
									</Nav.Item>
									{
										user.tipo !== 3 ?
											<Nav.Item className="navi-item mb-2">
												<Nav.Link className="navi-link px-2" eventKey="3">
													<span className="navi-icon mr-2">
														<span className="svg-icon">
															<SVG src={toAbsoluteUrl('/images/svg/Write.svg')} />
														</span>
													</span>
													<div className="navi-text">
														<span className="d-block font-weight-bold">Firma electrónica</span>
													</div>
												</Nav.Link>
											</Nav.Item>
										:''
									}
								</Nav>
							</Card.Body>
						</Card >
					</Col >
					<Col md={9} className="mb-3">
						<Card className="card-custom card-stretch">
							<Tab.Content>
								<Tab.Pane eventKey="1">
									<Card.Header className="align-items-center border-0 mt-4 pt-3 pb-0">
										<Card.Title>
											<h3 className="card-title align-items-start flex-column">
												<span className="font-weight-bolder text-dark">Cambiar foto de perfil</span>
											</h3>
										</Card.Title>
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
												/>
												{
													form.foto ?
														<div className="form-group row form-group-marginless justify-content-center mb-0">
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
													:''
												}
												
											</div>
										</Form>
									</Card.Body>
								</Tab.Pane>
								<Tab.Pane eventKey="2">
									<Card.Header className="align-items-center border-0 mt-4 pt-3 pb-0">
										<Card.Title>
											<h3 className="card-title align-items-start flex-column">
												<span className="font-weight-bolder text-dark">Cambiar contraseña</span>
											</h3>
										</Card.Title>
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
													<Input
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
													<Input
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
													<Input
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
													<div className="mt-3 text-center">
														<Button icon='' className="mx-auto"
															onClick={
																(e) => {
																	e.preventDefault();
																	validateAlert(onSubmit, e, 'form-perfil')
																}
															}
															text="CAMBIAR CONTRASEÑA" />
													</div>
													: ''
											}
										</Form>
									</Card.Body>
								</Tab.Pane>
								<Tab.Pane eventKey="3">
									<Card.Header className="align-items-center border-0 mt-4 pt-3 pb-0">
										<Card.Title className="mb-0">
											<h3 className="card-title align-items-start flex-column mb-0">
												<span className="font-weight-bolder text-dark">Firma electrónica</span>
											</h3>
										</Card.Title>
									</Card.Header>
									<Card.Body className="pt-0">
										<Form id="form-firma"
											onSubmit={
												(e) => {
													e.preventDefault();
													validateAlert(sendAvatar, e, 'form-firma')
												}
											}
										>
											<Tab.Container activeKey={activeKey} onSelect={(select) => { onClickEmpresa(select) }}>
												<div className="d-flex justify-content-end">
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
												<div className='row mx-0'>
													{
														activeKey !== '' ?
															<div className='col-md-12 text-center mt-5'>
																<div>
																	<label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.firma.placeholder}
																		{this.getName()}
																	</label>
																</div>
																<div className=' d-flex align-items-center justify-content-center'>
																	<div>
																		<ItemSlider
																			items={form.adjuntos.firma.files}
																			item='firma'
																			handleChange={handleChange}
																			multiple={false}
																		/>
																	</div>
																</div>
																<div className="mt-4 text-center">
																	<Button icon='' className="btn btn-light-primary font-weight-bold"
																		onClick={
																			(e) => {
																				e.preventDefault();
																				validateAlert(sendFirma, e, 'form-firma')
																			}
																		}
																		text="SUBIR FIRMA" />
																</div>
															</div>
															: ''
													}
												</div>
											</Tab.Container>
										</Form>
									</Card.Body>
								</Tab.Pane>
							</Tab.Content>
						</Card>
					</Col>
				</Row >
			</Tab.Container>
		</>
		)
	}
}

export default ChangePasswordFrom