import React, {useMemo} from "react";

export default function UserNotifications() {

    return (
        <>   
			<div>
				<h5 className="mb-4">Notificaciones recientes</h5>
					<div className="d-flex align-items-center bg-light-warning rounded p-3 gutter-b">
						<span className="svg-icon svg-icon-warning mr-3">
							<span className="svg-icon svg-icon-lg">
								{/* Aqui va cualquier <svg></svg> */}
							</span>
						</span>
						<div className="d-flex flex-column flex-grow-1 mr-2">
							<a href="#" className="font-weight-normal text-dark-75 text-hover-primary font-size-lg mb-1">Diseño de plantilla</a>
							<span className="text-muted font-size-sm">Fecha de entrega: 02/10/2020</span>
						</div>
						<span className="font-weight-bolder text-warning py-1 font-size-lg">+28%</span>
					</div>
					<div className="d-flex align-items-center bg-light-success rounded p-3 gutter-b">
						<span className="svg-icon svg-icon-success mr-3">
							<span className="svg-icon svg-icon-lg">
								{/* Aqui va cualquier <svg></svg> */}
							</span>
						</span>
						<div className="d-flex flex-column flex-grow-1 mr-2">
							<a href="#" className="font-weight-normal text-dark-75 text-hover-primary font-size-lg mb-1">Modificar base de datos</a>
							<span className="text-muted font-size-sm">Fecha de entrega: 20/10/2020</span>
						</div>
						<span className="font-weight-bolder text-success py-1 font-size-lg">+50%</span>
					</div>
					<div className="d-flex align-items-center bg-light-danger rounded p-3 gutter-b">
						<span className="svg-icon svg-icon-danger mr-3">
							<span className="svg-icon svg-icon-lg">
								{/* Aqui va cualquier <svg></svg> */}
							</span>
						</span>
						<div className="d-flex flex-column flex-grow-1 mr-2">
							<a href="#" className="font-weight-normel text-dark-75 text-hover-primary font-size-lg mb-1">Exportar base de datos</a>
							<span className="text-muted font-size-sm">Fecha de entrega: 09/11/2020</span>
						</div>
						<span className="font-weight-bolder text-danger py-1 font-size-lg">+27%</span>
					</div>
					<div className="d-flex align-items-center bg-light-info rounded p-3">
						<span className="svg-icon svg-icon-info mr-3">
							<span className="svg-icon svg-icon-lg">
								{/* Aqui va cualquier <svg></svg> */}
							</span>
						</span>
						<div className="d-flex flex-column flex-grow-1 mr-2">
							<a href="#" className="font-weight-normel text-dark-75 text-hover-primary font-size-lg mb-1">Modificar login</a>
							<span className="text-muted font-size-sm">Fecha de entrega: 26/11/2020</span>
						</div>
						<span className="font-weight-bolder text-info py-1 font-size-lg">+8%</span>
					</div>
			</div>
        </>
    );
}