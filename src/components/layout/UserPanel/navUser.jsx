import React, { Component } from 'react';
class NavUser extends Component{

	isCliente = usuario => {
		if(usuario)
			if(usuario.tipo)
				if(usuario.tipo.tipo)
					if(usuario.tipo.tipo === 'Cliente')
						return true
		return false
	}

	render(){
		const { user: usuario, cerrarSesiones } = this.props
		return(
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
						!this.isCliente(usuario) ?
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
					<span className="navi-item mb-2"
						onClick = { (e) => { e.preventDefault(); cerrarSesiones() } } >
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
					</span>
				</div>
        	</>
		)
	}
}

export default NavUser