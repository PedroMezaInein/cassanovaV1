import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar' 
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"

const NameUser = React.forwardRef(({userName}, ref) => (        
    <div >    
        {userName}      
    </div>
)); 
class customUser extends Component{
    
    render(){
        const { clickLogout, authUser: { user: { name: userName } } } = this.props
        return(
        <>               
			<div className="d-flex flex-column">
				<span className="font-weight-bold font-size-h5 text-dark-75 text-hover-primary"><Navbar as={NameUser} userName={userName}> </Navbar></span>
				<div className="text-muted mt-1"></div>
					<div className="navi mt-1"> 
							<span className="navi-link p-0 pb-1">
								<span className="navi-icon mr-1">
									<span className="svg-icon svg-icon-lg svg-icon-primary">
										<SVG src={toAbsoluteUrl('/images/svg/Mail-notification.svg')} /> 
									</span>
								</span>
								<a href={"mailto:"+this.props.authUser.user.email} target="_blank">
									<span className="navi-text text-muted text-hover-primary">{this.props.authUser.user.email}</span>
								</a>
							</span> 
						<a href="#" className="btn btn-sm btn-light-primary font-weight-bolder mt-2 " onClick={clickLogout}>Cerrar Sesión</a>
					</div>
            </div>        
        </>
        )
    }
}

export default customUser