import React, { Component } from 'react'; 
import Layout from '../../components/layout/layout'
import {Card, Form, Col, Tab, Nav } from 'react-bootstrap'
import { validateAlert } from '../../functions/alert'
import { Input, Button } from '../../components/form-components'

import { ChangePasswordForm } from '../../components/forms'

class AccountSettings extends Component {

	state = {
		form:{
			oldPassword: '',
			newPassword: '',
			newPassword2: '',
		}
	}
	
	onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
	}
	
	render(){		
		const {onSubmit} = this.props
		const { form } = this.state
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
					<ChangePasswordForm form = { form } onChange = { this.onChange } />
				</Card.Body>
			</Card>
		</Layout>
		</>
	)
}
}
export default AccountSettings