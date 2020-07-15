import React, { Component } from 'react';
import NavUser from '../UserPanel/navUser'
import UserNotifications from "./userNotifications"
import CustomUser from "./customUser"

function closeButton(){  
    if(document.getElementsByClassName("offcanvas")[0].classList.contains("offcanvas-on")){
        document.getElementsByClassName("offcanvas")[0].classList.remove("offcanvas-on");
    }
    else
    { 
        document.getElementsByClassName("offcanvas")[0].classList.add("offcanvas-on");
    }
}    

class UserPanel extends Component {
	
	render(){		
		return (
		<>   
			<div className="scroll scroll-pull offcanvas offcanvas-right p-5   ">
				<div className="offcanvas-header d-flex align-items-center justify-content-between pb-3">
					<h3 className="font-weight-bold m-0">Perfil de usuario
					<small className="text-muted font-size-sm ml-2"></small></h3>
					<button  className="btn btn-xs btn-icon btn-light btn-hover-primary" id="kt_quick_user_close" onClick = { () => { closeButton() } } >
						<i className="ki ki-close icon-xs text-muted"></i>
					</button>
				</div>			
				<div className="offcanvas-content pr-3 mr-n3">
					<div className="d-flex align-items-center mt-3">
						<div className="symbol symbol-100 mr-3">
						<img className="symbol-label"  src="/default.jpg" />
							<i className="symbol-badge bg-success"></i>
						</div>
						<CustomUser clickResponsiveMenu={this.clickResponsiveMenu} clickLogout={this.logoutUser} {... this.props}/>
					</div>
					<div className="separator separator-dashed mt-4 mb-3"></div>
					<NavUser/>
					{/*<div className="separator separator-dashed mt-4 mb-4"></div>
					<UserNotifications/>*/}	
				</div>
			</div>
		</>
	)
}
}
export default UserPanel