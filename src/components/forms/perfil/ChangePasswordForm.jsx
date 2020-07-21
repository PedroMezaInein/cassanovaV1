import React, { Component } from 'react'

import { validateAlert } from '../../../functions/alert'
import { Button, SelectSearch, Input, InputNumber } from '../../form-components'
import { Form } from 'react-bootstrap'

class ChangePasswordFrom extends Component {
	render() {
		const { onSubmit, form, onChange } = this.props
		return (
			<Form id="form-perfil"
				onSubmit={
					(e) => {
						e.preventDefault();
						validateAlert(onSubmit, e, 'form-perfil')
					}
				}
			>
				<div className="form-group row form-group-marginless">
					<div className="col-md-4">
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
					<div className="col-md-4">
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
					<div className="col-md-4">
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
							<Button icon='' className="mx-auto" type="submit" text="Enviar" />
						</div>
						: ''
				}

			</Form>
		)
	}
}

export default ChangePasswordFrom