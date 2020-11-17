import React, { Component } from 'react'
import { validateAlert } from '../../../functions/alert'
import { Button, Input, ImageUpload } from '../../form-components'
import { Form, Col, Tab, Nav } from 'react-bootstrap'
import { ItemSlider } from '../../../components/singles'
class ChangePasswordFrom extends Component {

	getName = () => {
		const { empresas, activeKey } = this.props
		let aux = ''
		empresas.map((empresa)=>{
			if(empresa.id.toString() === activeKey)
				aux = empresa.name
		})
		return ' '+aux
	}

	render() {
		const { onSubmit, form, onChange, sendAvatar, clearAvatar, handleChange, sendFirma, empresas, onClickEmpresa, activeKey } = this.props
		return (<>
			<div className="row">
				<Col md="7">
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
						</div>
					</Form>
					<Form id="form-firma"
						onSubmit={
							(e) => {
								e.preventDefault();
								validateAlert(sendAvatar, e, 'form-firma')
							}
						}
					>
						<div className="col-md-12 text-center mt-5">
							{/* <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.firma.placeholder}</label> */}
							<Tab.Container activeKey = { activeKey } onSelect={ (select) => { onClickEmpresa(select) }}>
								<div className = 'row mx-0'>
									<div className = 'col-md-4 px-0 navi navi-accent navi-hover navi-bold text-left border-nav'>
										{
											empresas.map((empresa, key)=>{
												return(
													<Nav variant="pills" className="flex-column navi navi-hover navi-active" key = { key } >
														<Nav.Item className="navi-item">
                                                			<Nav.Link className = "navi-link" eventKey = { empresa.id } >
																<span className = "navi-text">
																	{ empresa.name }
																</span>
                                                			</Nav.Link>
                                            			</Nav.Item>
													</Nav>
												)
											})
										}
									</div>
									{
										activeKey !== '' ?
											<div className = 'col-md-8'>
												<div>
													<label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.firma.placeholder}
														{ this.getName() }
													</label>
												</div>
												<div className=' d-flex align-items-center justify-content-center'>
													<ItemSlider
														items = { form.adjuntos.firma.files }
														item = 'firma'
														handleChange = { handleChange }
														multiple = { false }
													/>
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
						</div>
					</Form>
				</Col>
				<Col md="5">
					<Form id="form-perfil"
						onSubmit={
							(e) => {
								e.preventDefault();
								validateAlert(onSubmit, e, 'form-perfil')
							}
						}
					>
						<div className="form-group row form-group-marginless justify-content-center">
							<div className="col-md-9">
								<Input
									requirevalidation={1}
									placeholder="CONTRASEÑA ACTUAL"
									type="password"
									name="oldPassword"
									value={form.oldPassword}
									onChange={onChange}
									iconclass={"fab fa-diaspora"}
									messageinc="Incorrecto. Ingresa la contraseña actual."
									letterCase={false}
								/>
							</div>
						</div>
						<div className="form-group row form-group-marginless justify-content-center">
							<div className="col-md-9">
								<Input
									requirevalidation={1}
									placeholder="NUEVA CONTRASEÑA"
									type="password"
									name="newPassword"
									value={form.newPassword}
									onChange={onChange}
									iconclass={"fas fa-check"}
									messageinc="Incorrecto. Ingresa la nueva contraseña."
									letterCase={false}
								/>
							</div>
						</div>
						<div className="form-group row form-group-marginless justify-content-center">
							<div className="col-md-9">
								<Input
									requirevalidation={1}
									placeholder="VERIFICA CONTRASEÑA"
									type="password"
									name="newPassword2"
									value={form.newPassword2}
									onChange={onChange}
									iconclass={"fas fa-user-check"}
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
				</Col>
			</div>
		</>
		)
	}
}

export default ChangePasswordFrom