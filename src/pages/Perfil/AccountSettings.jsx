import React, { Component } from 'react'; 
import Layout from '../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../constants'
import { waitAlert, errorAlert, forbiddenAccessAlert, doneAlert } from '../../functions/alert'
import { update } from '../../redux/reducers/auth_user'
import { ChangePasswordForm } from '../../components/forms'
import swal from 'sweetalert';

class AccountSettings extends Component {

	state = {
		form:{
			oldPassword: '',
			newPassword: '',
            newPassword2: '',
            foto: '',
            adjuntos: {
                firma: {
                    value: '',
                    placeholder: 'Ingresa la firma electrónica',
                    files: []
                }
            }
		}
    }
    
    componentDidMount(){
        const { avatar }  = this.props.authUser.user
        const { form } = this.state
        form.foto = avatar
        this.setState({
            ...this.state,
            form
        })
    }
	
	onChange = e => {
        const { form } = this.state
		const { name, value } = e.target
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    
    clearAvatar = () => {

        const { avatar } = this.props.authUser.user
        const { form } = this.state
        form.foto = avatar
        this.setState({
            ...this.state,
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

	sendAvatar = async (e) => {
		e.preventDefault();
		const { access_token } = this.props.authUser
		const { form } = this.state
        await axios.post(URL_DEV + 'user/users/avatar', form,  { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
				const { update } = this.props
                update({
                    access_token: response.data.access_token,
                    user: response.data.user,
                    modulos: response.data.modulos
                })
				doneAlert(response.data.message !== undefined ? response.data.message : 'El avatar fue actualizado con éxito.')
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
    handleChange = (files, item) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    sendFirma = async (e) => {
		e.preventDefault();
		const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
            return false
        })
        await axios.post(URL_DEV + 'user/users/firma', data,  { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
				
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
						<Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">Mi perfil</h3>
                        </div>
                    </Card.Header>
						<Card.Body>
                            <ChangePasswordForm
                                form = { form }
                                onChange = { this.onChange }
                                onSubmit = { (e) => { e.preventDefault(); waitAlert(); this.changePasswordAxios()} }
                                sendAvatar = { this.sendAvatar }
                                clearAvatar = { this.clearAvatar }
                                handleChange={this.handleChange}
                                sendFirma={this.sendFirma}
                            />
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
    update: payload => dispatch(update(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);