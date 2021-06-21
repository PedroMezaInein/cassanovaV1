import React, { Component } from 'react';
import NavUser from '../UserPanel/navUser'
import CustomUser from "./customUser"
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../../functions/routers"
import { setDateTableLG } from '../../../functions/setters'
import { errorAlert, printResponseErrorAlert } from '../../../functions/alert'

class UserPanel extends Component {

	state ={
		showProfile: true,
        showNotif: false,
		notificaciones: [],
	}
	componentDidMount(){ this.getNotificaciones() }
    closeButton(){
        if(document.getElementsByClassName("offcanvas")[0].classList.contains("offcanvas-on")){
            document.getElementsByClassName("offcanvas")[0].classList.remove("offcanvas-on");
        } else{
            document.getElementsByClassName("offcanvas")[0].classList.add("offcanvas-on");
        }
        this.setState({
            ...this.state,
            showProfile: true,
            showNotif: false
        })
    }
	getNotificaciones = async() => {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'notificaciones/all', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { notificaciones } = response.data
                this.setState({ ...this.state, notificaciones: notificaciones })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
	setIcon = tipo => {
        switch(tipo){
            case 'lead':
                return toAbsoluteUrl('/images/svg/notificaciones/lead.svg');
            case 'tarea':
                return toAbsoluteUrl('/images/svg/notificaciones/tarea.svg');
            case 'ticket':
                return toAbsoluteUrl('/images/svg/notificaciones/ticket.svg');
            case 'vacaciones':
                return toAbsoluteUrl('/images/svg/notificaciones/vacaciones.svg');
            case 'solicitud vacaciones':
                return toAbsoluteUrl('/images/svg/notificaciones/solicitud-vacaciones.svg');
            case 'cancel':
                return toAbsoluteUrl('/images/svg/notificaciones/cancelar.svg');
            default:
                return toAbsoluteUrl('/images/svg/portapapeles.svg');
        }
    }
    // setIcon = tipo => {
    //     switch(tipo){
    //         case 'lead':
    //             return 'las la-user icon-2x text-brown';
    //         case 'tarea':
    //             return 'las la-clipboard-list icon-xl text-success';
    //         case 'ticket':
    //             return 'las la-file-invoice-dollar icon-xl text-info';
    //         case 'vacaciones':
    //             return 'las la-plane-departure icon-xl text-orange';
    //         case 'solicitud vacaciones':
    //             return 'las la-plane icon-xl text-pink';
    //         case 'cancel':
    //             return 'las la-window-close icon-xl text-primary';
    //         default: 
	// 			return '';
    //     }
    // }
    mostrarPerfil() {
        const { showProfile } = this.state
        this.setState({
            ...this.state,
            showProfile: !showProfile,
            showNotif: false
        })
    }
    mostrarNotificaciones() {
        const { showNotif } = this.state
        this.setState({
            ...this.state,
            showNotif: !showNotif,
            showProfile: false
        })
    }
	render(){		
		const { avatar, user, cerrarSesiones, checador, actualizarChecador } = this.props
		const { showProfile, showNotif, notificaciones } = this.state
		return (
			<>   
				<div className="scroll scroll-pull offcanvas offcanvas-right p-10">
					<div className="offcanvas-header d-flex align-items-center justify-content-between pb-5">
						<div className="font-weight-bolder m-0 font-size-h3">{showProfile ? 'Perfil de usuario' : 'Notificaciones'}</div>
						<div>
							<button className={`btn btn-xs btn-icon btn-light btn-hover-primary mr-2 ${showNotif ? '' : 'd-none'}`} onClick={() => { this.mostrarPerfil() }} >
								<i className="flaticon2-left-arrow-1 icon-sm text-muted"></i>
							</button>
							<button className="btn btn-xs btn-icon btn-light btn-hover-danger" onClick = { () => { this.closeButton() } } >
								<i className="flaticon2-delete icon-xs text-muted"></i>
							</button>
						</div>
					</div>			
					<div className={`offcanvas-content pr-3 mr-n3 ${showProfile ? '' : 'd-none'}`}>
						<div className="d-flex align-items-center mt-3">
							<div className="symbol symbol-100 mr-3">
								<img className="symbol-label bg-transparent rounded-avatar"  src={avatar ? avatar : "/default.jpg"} alt = '' />
								{/* <i className="symbol-badge bg-success"></i> */}
							</div>
							<CustomUser clickResponsiveMenu={this.clickResponsiveMenu} clickLogout={this.logoutUser} {...this.props}/>
						</div>
						<div className="separator separator-dashed mt-4 mb-3"></div>
						<NavUser user = { user } cerrarSesiones = { cerrarSesiones } checador = { checador } actualizarChecador = { actualizarChecador } mostrarNotificaciones={() => { this.mostrarNotificaciones() }}/>
						{/*<div className="separator separator-dashed mt-4 mb-4"></div>
						<UserNotifications/>*/}	
					</div>
					<div className={`offcanvas-content pr-3 mr-n3 ${showNotif ? '' : 'd-none'}`}>
						<div className="mt-3">
                            
								{
								notificaciones.map((notificacion, key) => {
									return(
										<div className="d-flex align-items-start mb-5" key={key}>
											<div className="symbol symbol-50 symbol-light mr-4">
												<span className="symbol-label bg-gray-200">
													<span className="svg-icon svg-icon-lg svg-icon-success mx-2">
														<SVG src = { this.setIcon(notificacion.tipo) } />
													</span>
												</span>
											</div>
											<div>
												<span className="text-dark-75 font-weight-bolder mb-1 font-size-lg">{notificacion.texto}</span>
												<div className="text-muted font-weight-bold d-block">{setDateTableLG(notificacion.created_at)}</div>
											</div>
										</div>
									)
								})
							}
							
						</div>
					</div>
				</div>
			</>
		)
	}
}
export default UserPanel