import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"

function openMobileAside(){    
	document.body.classList.add('aside-on');		
	document.getElementById("openbuerger").classList.add("mobile-toggle-active");
	document.getElementById("aside").classList.add("aside-on");
	document.getElementById('showaside').classList.add("aside-overlay"); 	
}

/* function openMobileHeader(){    
	document.body.classList.add('header-menu-wrapper-on');		
	document.getElementById("openbuerger").classList.add("mobile-toggle-active");
	document.getElementById("showheadermenu").classList.add("header-menu-wrapper-on");
	document.getElementById('showheader').classList.add("header-menu-wrapper-overlay"); 	
} */

function openMobileTopbar(){    
	if(!document.body.classList.contains('topbar-mobile-on') )
    {
		document.body.classList.add('topbar-mobile-on');
		document.getElementById("opentopbar").classList.add("active");	
	}else{
		document.body.classList.remove('topbar-mobile-on');
		document.getElementById("opentopbar").classList.remove("active");	
	}
}
export default function MobileHeader() {

    return (
        <>   
            <div className="header-mobile align-items-center header-mobile-fixed">
				{/* <a href="/mi-proyecto" className="brand-logo">
					<span className="svg-icon svg-icon-xl">
                		<i className = 'fas fa-home home-icon-menu d-block'></i>	
					</span>
					{/* Eliminar */}
					{/* <img alt="Logo" src="/dashboard.png" /> 
				</a> */}
				<div className="d-flex align-items-center">
					<button id="openbuerger"className="btn p-0 burger-icon burger-icon-left" onClick = { () => { openMobileAside() } }>
						<span></span>
					</button>
					{/* <button className="btn p-0 burger-icon ml-4" onClick = { () => { openMobileHeader() } }>
						<span></span>
					</button> */}
					<button id="opentopbar"className="btn btn-hover-text-primary p-0 ml-2" onClick = { () => { openMobileTopbar() } }>
						<span className="svg-icon svg-icon-xl">
							<SVG src={toAbsoluteUrl('/images/svg/Lines-right.svg')} />
						</span>
					</button>
				</div>
			</div>
        </>
    );
}
