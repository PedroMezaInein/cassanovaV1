import React from "react";

function openMobileAside(){    
	document.body.classList.add('aside-on');		
	document.getElementById("openbuerger").classList.add("mobile-toggle-active");
	document.getElementById("aside").classList.add("aside-on");
	document.getElementById('showaside').classList.add("aside-overlay"); 	
}

function openMobileHeader(){    
	document.body.classList.add('header-menu-wrapper-on');		
	document.getElementById("openbuerger").classList.add("mobile-toggle-active");
	document.getElementById("showheadermenu").classList.add("header-menu-wrapper-on");
	document.getElementById('showheader').classList.add("header-menu-wrapper-overlay"); 	
}

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
				<a href="/mi-proyecto">
					<img alt="Logo" src="/dashboard.png" />
				</a>
				<div className="d-flex align-items-center">
					<button id="openbuerger"className="btn p-0 burger-icon burger-icon-left" onClick = { () => { openMobileAside() } }>
						<span></span>
					</button>
					{/* <button className="btn p-0 burger-icon ml-4" onClick = { () => { openMobileHeader() } }>
						<span></span>
					</button> */}
					<button id="opentopbar"className="btn btn-hover-text-primary p-0 ml-2" onClick = { () => { openMobileTopbar() } }>
						<span className="svg-icon svg-icon-xl">
							<svg xmlns="http://www.w3.org/2000/svg"width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
								<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
									<polygon points="0 0 24 0 24 24 0 24" />
									<path d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z" fill="#000000" fillRule="nonzero" opacity="0.3" />
									<path d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z" fill="#000000" fillRule="nonzero" />
								</g>
							</svg>
						</span>
					</button>
				</div>
			</div>
        </>
    );
}
