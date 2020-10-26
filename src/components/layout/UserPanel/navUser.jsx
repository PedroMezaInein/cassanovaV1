import React from "react";
import { toAbsoluteUrl } from "../../../functions/routers"
import SVG from "react-inlinesvg";
export default function NavUser() {

    return (
        <>   
            <div className="navi navi-spacer-x-0 p-0">
				<a href="/mi-perfil" className="navi-item">
					<div className="navi-link">
						<div className="symbol symbol-40 bg-light mr-3">
							<div className="symbol-label">
								<span className="svg-icon svg-icon-md svg-icon-success">
									<SVG src={toAbsoluteUrl('/images/svg/Notification2.svg')} />
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
									<SVG src={toAbsoluteUrl('/images/svg/Chat-check.svg')} />
								</span>
							</div>
						</div>
						<div className="navi-text">
							<div className="font-weight-bold text-dark text-hover-info">Calendario</div>
							<div className="text-muted">Eventos programados</div>
						</div>
					</div>
				</a>
				<a href="/mis-notificaciones" className="navi-item">
					<div className="navi-link">
						<div className="symbol symbol-40 bg-light mr-3">
							<div className="symbol-label">
								<span className="text-warning">
								<i className="flaticon2-file text-warning"></i>
								</span>
							</div>
						</div>
						<div className="navi-text">
							<div className="font-weight-bold text-dark text-hover-info">Notificaciones</div>
							<div className="text-muted">Mis notificaciones</div>
						</div>
					</div>
				</a>
			</div>
        </>
    );
}