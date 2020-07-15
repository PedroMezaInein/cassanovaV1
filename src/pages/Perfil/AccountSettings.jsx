import React, { Component } from 'react'; 
import Layout from '../../components/layout/layout'
import {Card, Form, Col, Tab, Nav } from 'react-bootstrap'
import { validateAlert } from '../../functions/alert'
import { Input, Button } from '../../components/form-components'

class AccountSettings extends Component {
	
	render(){		
		const {onSubmit} = this.props
		return (
		<>   
		<Layout { ...this.props}>
			<Card className="card-custom"> 
				<Card.Header className="card-header py-3">
					<Card.Title className="align-items-start flex-column">
						<h3 className="card-label font-weight-bolder text-dark">Cambio de contraseña</h3>
						<span className="text-muted font-weight-bold font-size-sm mt-1">Cambia la contraseña de tu cuenta</span>
					</Card.Title> 
				</Card.Header> 

				<Card.Body> 
					<Form id="form-cuenta"
						onSubmit = { 
							(e) => {
								e.preventDefault(); 
								validateAlert(onSubmit, e, 'form-cuenta')
							}
						} 
						>
						<div className="form-group row form-group-marginless">
							<div className="col-md-4">
								<Input 
									requirevalidation={1} 
									placeholder = "Contraseña actual" 
									type = "text"
									name = "" 
									value = { "" } 
									onChange = { "" }
									iconclass={"fab fa-diaspora"}
									messageinc="Incorrecto. Ingresa la contraseña actual."
								/>
							</div>
							<div className="col-md-4">
								<Input 
									requirevalidation={1} 
									placeholder = "Nueva contraseña" 
									type = "text"
									name = "" 
									value = { "" } 
									onChange = { "" }
									iconclass={"fas fa-check"}
									messageinc="Incorrecto. Ingresa la nueva contraseña."
								/>
							</div>
							<div className="col-md-4">
								<Input 
									requirevalidation={1} 
									placeholder = "Verifica contraseña" 
									type = "text"
									name = "" 
									value = { "" } 
									onChange = { "" }
									iconclass={"fas fa-user-check"}
									messageinc="Incorrecto. Vuelve a introducir la nueva contraseña."
								/>
							</div>
						</div> 
						<div className="mt-3 text-center">
							<Button icon='' className="mx-auto" type="submit" text="Enviar" />
						</div>
					</Form>
				</Card.Body>
			</Card>
		</Layout>
		</>
	)
}
}
export default AccountSettings