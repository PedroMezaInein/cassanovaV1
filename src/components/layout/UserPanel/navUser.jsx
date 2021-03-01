import React from "react";
import { toAbsoluteUrl } from "../../../functions/routers"
import SVG from "react-inlinesvg";
export default function NavUser( user ) {
	const { user: usuario } = user
    return (
        <>   
            <div className="navi navi-spacer-x-0 p-0">
				<a href="/mi-perfil" className="navi-item mb-2">
					<div className="navi-link btn btn-clean py-1">
						<div className="symbol symbol-40 bg-light mr-3">
							<div className="symbol-label">
								<i className="flaticon2-user-1 text-success icon-lg"/>
							</div>
						</div>
						<div className="navi-text text-left font-weight-bold text-dark text-hover-success">
							Mi perfil
							<div className="text-muted font-weight-light">Configurar mi cuenta</div>
						</div>
					</div>
				</a>
				{
					usuario.tipo.tipo !== 'Cliente' ?
						<>
							<a href="/mi-calendario" className="navi-item mb-2">
								<div className="navi-link btn btn-clean py-1">
									<div className="symbol symbol-40 bg-light mr-3">
										<div className="symbol-label">
											<i className="flaticon2-calendar-8 text-info icon-lg"/>
										</div>
									</div>
									<div className="navi-text text-left font-weight-bold text-dark text-hover-info">
										Calendario
										<div className="text-muted font-weight-light">Eventos programados</div>
									</div>
								</div>
							</a>
							<a href="/mis-notificaciones" className="navi-item mb-2">
								<div className="navi-link btn btn-clean py-1">
									<div className="symbol symbol-40 bg-light mr-3">
										<div className="symbol-label">
											<i className="flaticon2-bell-2 text-warning icon-lg"></i>
										</div>
									</div>
									<div className="navi-text text-left font-weight-bold text-dark text-hover-warning">
										Notificaciones
										<div className="text-muted font-weight-light">Mis notificaciones</div>
									</div>
								</div>
							</a>
						</>
					: ''
				}
				<a className="navi-item mb-2">
					<div className="navi-link btn btn-clean py-1">
						<div className="symbol symbol-40 bg-light mr-3">
							<div className="symbol-label">
								<i className="fas fa-sign-out-alt text-danger icon-lg p-0"></i>
							</div>
						</div>
						<div className="navi-text text-left font-weight-bold text-dark text-hover-danger">
							Cerrar sesiones
						</div>
					</div>
				</a>
			</div>
        </>
    );
}