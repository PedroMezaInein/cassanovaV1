import React, { Component } from 'react';
import NavUser from '../UserPanel/navUser'
import CustomUser from "./customUser"

function closeButton(){  
    if(document.getElementsByClassName("offcanvas")[0].classList.contains("offcanvas-on")){
        document.getElementsByClassName("offcanvas")[0].classList.remove("offcanvas-on");
	} else{
        document.getElementsByClassName("offcanvas")[0].classList.add("offcanvas-on");
    }
}

class UserPanel extends Component {

	render(){		
		const { avatar, user, cerrarSesiones, checador, actualizarChecador } = this.props
		return (
			<>   
				<div className="scroll scroll-pull offcanvas offcanvas-right p-10">
					<div className="offcanvas-header d-flex align-items-center justify-content-between pb-5">
						<div className="font-weight-bolder m-0 font-size-h3">Perfil de usuario</div>
						<button className="bbtn btn-xs btn-icon btn btn-light btn-hover-danger" onClick = { () => { closeButton() } } >
							<i className="flaticon2-delete icon-xs text-muted"></i>
						</button>
					</div>			
					<div className="offcanvas-content pr-3 mr-n3">
						<div className="d-flex align-items-center mt-3">
							<div className="symbol symbol-100 mr-3">
								<img className="symbol-label bg-transparent"  src={avatar ? avatar : "/default.jpg"} alt = '' />
								{/* <i className="symbol-badge bg-success"></i> */}
							</div>
							<CustomUser clickResponsiveMenu={this.clickResponsiveMenu} clickLogout={this.logoutUser} {...this.props}/>
						</div>
						<div className="separator separator-dashed mt-4 mb-3"></div>
						<NavUser user = { user } cerrarSesiones = { cerrarSesiones } checador = { checador } actualizarChecador = { actualizarChecador } />
						{/*<div className="separator separator-dashed mt-4 mb-4"></div>
						<UserNotifications/>*/}	
					</div>
				</div>
			</>
		)
	}
}
export default UserPanel