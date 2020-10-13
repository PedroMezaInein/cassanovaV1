import React, { Component } from 'react'
import { validateAlert } from '../../../functions/alert'
import { Button, Input, ImageUpload } from '../../form-components'
import { Form } from 'react-bootstrap'
class ChangePasswordFrom extends Component {
	render() {
		const { onSubmit, form, onChange } = this.props
		return (<>
			<Form id="form-foto"
				onSubmit={
					(e) => {
						e.preventDefault();
						validateAlert(onSubmit, e, 'form-foto')
					}
				}
			>
				<div className="col-md-7 align-self-center">
					<ImageUpload
						name="foto"
						value={form.foto}
						onChange={onChange}
					/>
				</div>
				<div className="mt-3 text-center">
					<Button icon='' className="mx-auto"
						onClick={
							(e) => {
								e.preventDefault();
								validateAlert(onSubmit, e, 'form-foto')
							}
						}
						text="ENVIAR" />
				</div>
			</Form>
			<Form id="form-perfil"
				onSubmit={
					(e) => {
						e.preventDefault();
						validateAlert(onSubmit, e, 'form-perfil')
					}
				}
			>
				<div className="form-group row form-group-marginless justify-content-center">
					<div className="col-md-5">
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
										text="ENVIAR" />
								</div>
								: ''
						}
					</div>
				</div>
			</Form>
		</>
		)
	}
}

export default ChangePasswordFrom