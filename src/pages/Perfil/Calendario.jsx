import React, { Component } from 'react'; 
import Layout from '../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../constants'
import { waitAlert, errorAlert, forbiddenAccessAlert, doneAlert } from '../../functions/alert'

import { CalendarioForm } from '../../components/forms'
import swal from 'sweetalert';

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

	async changePasswordAxios() {
		const { access_token } = this.props.authUser
		const { form } = this.state
        await axios.post(URL_DEV + 'user/users/change-password', form,  { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
				const { history } = this.props

				doneAlert(response.data.message !== undefined ? response.data.message : 'La contraseña fue actualizada con éxito.')
				setTimeout(() => {
					swal.close()
					history.push({
						pathname: '/login'
					});
				}, 1500);
				
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
		const { form } = this.state
		return (
			<>   
				<Layout { ...this.props}>
					<Card className="card-custom"> 
						<Card.Header className="card-header py-3">
							<Card.Title className="align-items-start flex-column">
								<h3 className="card-label font-weight-bolder text-dark">Calendario</h3>
								<span className="text-muted font-weight-bold font-size-sm mt-1">Eventos programados</span>
							</Card.Title> 
						</Card.Header> 
						<Card.Body> 
							<CalendarioForm form = { form } onChange = { this.onChange } onSubmit = { (e) => { e.preventDefault(); waitAlert(); this.changePasswordAxios()} } />
						</Card.Body>
					</Card>
				</Layout>
			</>
		)
	}
}

const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);