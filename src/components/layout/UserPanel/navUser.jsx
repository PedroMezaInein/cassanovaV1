import React from "react";

export default function NavUser() {

    return (
        <>   
            <div className="navi navi-spacer-x-0 p-0">
				<a href="/mi-perfil" className="navi-item">
					<div className="navi-link">
						<div className="symbol symbol-40 bg-light mr-3">
							<div className="symbol-label">
								<span className="svg-icon svg-icon-md svg-icon-success">
									<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
										<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
											<rect x="0" y="0" width="24" height="24" />
											<path d="M13.2070325,4 C13.0721672,4.47683179 13,4.97998812 13,5.5 C13,8.53756612 15.4624339,11 18.5,11 C19.0200119,11 19.5231682,10.9278328 20,10.7929675 L20,17 C20,18.6568542 18.6568542,20 17,20 L7,20 C5.34314575,20 4,18.6568542 4,17 L4,7 C4,5.34314575 5.34314575,4 7,4 L13.2070325,4 Z" fill="#000000" />
											<circle fill="#000000" opacity="0.3" cx="18.5" cy="5.5" r="2.5" />
										</g>
									</svg>
								</span>
							</div>
						</div>
						<div className="navi-text">
							<div className="font-weight-bold text-dark text-hover-success">Mi perfil</div>
							<div className="text-muted">Configurar mi cuenta</div>
						</div>
					</div>
				</a>
				<a href="/mi-calendario" className="navi-item">
					<div className="navi-link">
						<div className="symbol symbol-40 bg-light mr-3">
							<div className="symbol-label">
								<span className="svg-icon svg-icon-md svg-icon-info">
									<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
										<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
											<rect x="0" y="0" width="24" height="24"/>
											<path d="M4.875,20.75 C4.63541667,20.75 4.39583333,20.6541667 4.20416667,20.4625 L2.2875,18.5458333 C1.90416667,18.1625 1.90416667,17.5875 2.2875,17.2041667 C2.67083333,16.8208333 3.29375,16.8208333 3.62916667,17.2041667 L4.875,18.45 L8.0375,15.2875 C8.42083333,14.9041667 8.99583333,14.9041667 9.37916667,15.2875 C9.7625,15.6708333 9.7625,16.2458333 9.37916667,16.6291667 L5.54583333,20.4625 C5.35416667,20.6541667 5.11458333,20.75 4.875,20.75 Z" fill="#000000" fillRule="nonzero" opacity="0.3"/>
											<path d="M2,11.8650466 L2,6 C2,4.34314575 3.34314575,3 5,3 L19,3 C20.6568542,3 22,4.34314575 22,6 L22,15 C22,15.0032706 21.9999948,15.0065399 21.9999843,15.009808 L22.0249378,15 L22.0249378,19.5857864 C22.0249378,20.1380712 21.5772226,20.5857864 21.0249378,20.5857864 C20.7597213,20.5857864 20.5053674,20.4804296 20.317831,20.2928932 L18.0249378,18 L12.9835977,18 C12.7263047,14.0909841 9.47412135,11 5.5,11 C4.23590829,11 3.04485894,11.3127315 2,11.8650466 Z M6,7 C5.44771525,7 5,7.44771525 5,8 C5,8.55228475 5.44771525,9 6,9 L15,9 C15.5522847,9 16,8.55228475 16,8 C16,7.44771525 15.5522847,7 15,7 L6,7 Z" fill="#000000"/>
										</g>
									</svg>
								</span>
							</div>
						</div>
						<div className="navi-text">
							<div className="font-weight-bold text-dark text-hover-info">Calendario</div>
							<div className="text-muted">Eventos programados</div>
						</div>
					</div>
				</a>
				{/* <a href="#" className="navi-item">
					<div className="navi-link">
						<div className="symbol symbol-40 bg-light mr-3">
							<div className="symbol-label">
								<span className="svg-icon svg-icon-md svg-icon-danger">
									<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
										<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
											<polygon points="0 0 24 0 24 24 0 24" />
											<path d="M4.85714286,1 L11.7364114,1 C12.0910962,1 12.4343066,1.12568431 12.7051108,1.35473959 L17.4686994,5.3839416 C17.8056532,5.66894833 18,6.08787823 18,6.52920201 L18,19.0833333 C18,20.8738751 17.9795521,21 16.1428571,21 L4.85714286,21 C3.02044787,21 3,20.8738751 3,19.0833333 L3,2.91666667 C3,1.12612489 3.02044787,1 4.85714286,1 Z M8,12 C7.44771525,12 7,12.4477153 7,13 C7,13.5522847 7.44771525,14 8,14 L15,14 C15.5522847,14 16,13.5522847 16,13 C16,12.4477153 15.5522847,12 15,12 L8,12 Z M8,16 C7.44771525,16 7,16.4477153 7,17 C7,17.5522847 7.44771525,18 8,18 L11,18 C11.5522847,18 12,17.5522847 12,17 C12,16.4477153 11.5522847,16 11,16 L8,16 Z" fill="#000000" fillRule="nonzero" opacity="0.3" />
											<path d="M6.85714286,3 L14.7364114,3 C15.0910962,3 15.4343066,3.12568431 15.7051108,3.35473959 L20.4686994,7.3839416 C20.8056532,7.66894833 21,8.08787823 21,8.52920201 L21,21.0833333 C21,22.8738751 20.9795521,23 19.1428571,23 L6.85714286,23 C5.02044787,23 5,22.8738751 5,21.0833333 L5,4.91666667 C5,3.12612489 5.02044787,3 6.85714286,3 Z M8,12 C7.44771525,12 7,12.4477153 7,13 C7,13.5522847 7.44771525,14 8,14 L15,14 C15.5522847,14 16,13.5522847 16,13 C16,12.4477153 15.5522847,12 15,12 L8,12 Z M8,16 C7.44771525,16 7,16.4477153 7,17 C7,17.5522847 7.44771525,18 8,18 L11,18 C11.5522847,18 12,17.5522847 12,17 C12,16.4477153 11.5522847,16 11,16 L8,16 Z" fill="#000000" fillRule="nonzero" />
										</g>
									</svg>
								</span>
							</div>
						</div>
						<div className="navi-text">
							<div className="font-weight-bold">Actividades</div>
							<div className="text-muted">Registro de actividades</div>
						</div>
					</div>
				</a>
				<a href="#" className="navi-item">
					<div className="navi-link">
						<div className="symbol symbol-40 bg-light mr-3">
							<div className="symbol-label">
								<span className="svg-icon svg-icon-md svg-icon-primary">
									<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
										<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
											<rect x="0" y="0" width="24" height="24" />
											<path d="M6,2 L18,2 C18.5522847,2 19,2.44771525 19,3 L19,12 C19,12.5522847 18.5522847,13 18,13 L6,13 C5.44771525,13 5,12.5522847 5,12 L5,3 C5,2.44771525 5.44771525,2 6,2 Z M7.5,5 C7.22385763,5 7,5.22385763 7,5.5 C7,5.77614237 7.22385763,6 7.5,6 L13.5,6 C13.7761424,6 14,5.77614237 14,5.5 C14,5.22385763 13.7761424,5 13.5,5 L7.5,5 Z M7.5,7 C7.22385763,7 7,7.22385763 7,7.5 C7,7.77614237 7.22385763,8 7.5,8 L10.5,8 C10.7761424,8 11,7.77614237 11,7.5 C11,7.22385763 10.7761424,7 10.5,7 L7.5,7 Z" fill="#000000" opacity="0.3" />
											<path d="M3.79274528,6.57253826 L12,12.5 L20.2072547,6.57253826 C20.4311176,6.4108595 20.7436609,6.46126971 20.9053396,6.68513259 C20.9668779,6.77033951 21,6.87277228 21,6.97787787 L21,17 C21,18.1045695 20.1045695,19 19,19 L5,19 C3.8954305,19 3,18.1045695 3,17 L3,6.97787787 C3,6.70173549 3.22385763,6.47787787 3.5,6.47787787 C3.60510559,6.47787787 3.70753836,6.51099993 3.79274528,6.57253826 Z" fill="#000000" />
										</g>
									</svg>
								</span>
							</div>
						</div>
						<div className="navi-text">
							<div className="font-weight-bold">Tareas</div>
							<div className="text-muted">Proyectos pendientes</div>
						</div>
					</div>
				</a> */}
			</div>
        </>
    );
}