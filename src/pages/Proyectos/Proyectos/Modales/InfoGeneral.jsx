import React from 'react';

export default function InfoGeneral(props) {
    const { proyecto } = props;
    return (
        <>
            <div className="parent mt-5">

                <div className="">
                    <div>
                        <span className="headerSubTitle mb-5">
                            Tipo de Proyecto
                        </span>
                        <span className="alignContent">
                            {proyecto.tipo_proyecto.tipo}
                        </span>
                    </div>
                </div>

                <div className="">
                    <div>
                        <span className="">Estado del proyecto </span>
                        <span className="badge badge-pill column" style={{ backgroundColor: proyecto.estatus.fondo, color: proyecto.estatus.letra }}>
                            {proyecto.estatus.estatus}
                        </span>
                    </div>
                </div>

                <div className="">
                    <div>
                        <span className="headerSubTitle mb-5">
                            Empresa
                        </span>
                        <span className="alignContent">
                            {proyecto.empresa.name}
                        </span>
                    </div>
                </div>
                {/* <div className="div4">
                    <div>
                        <span className="mb-5 alertColor">
                            Área
                        </span>
                        <span className="text-lowercase  alignContent">
                            {proyecto.m2}&nbsp; m²
                        </span>
                    </div>
                </div> */}
                <div className="">
                    <div>
                        <span className="headerSubTitle mb-5">
                            Sucursal
                        </span>
                        <span className="alignContent">
                            {proyecto.sucursa ? `${proyecto.sucursal}` : 'No hay sucursal'}
                        </span>
                    </div>
                </div>
                <div className="">
                    <div className="">
                        <span className="infoColor mb-5">
                            Contacto
                        </span>
                        <div className="d-flex flex-column ">
                            <span className="alignContent">
                                {proyecto.contacto}
                            </span>
                            <span className='alignContent'>
                                {proyecto.numero_contacto}
                            </span>
                            <span className='text-lowercase alignContent'>
                                {proyecto.contactos[0] ? `${proyecto.contactos[0].correo}` : ''}
                            </span>
                        </div>

                    </div>
                </div>
                <div className="">
                    <div>
                        <span className="headerSubTitle mb-5">
                            Periodo del proyecto
                        </span>
                        <span className="alignContent">
                            {proyecto.fecha_inicio ? proyecto.fecha_inicio.slice(0, 10) : 'Sin fecha de inicio'} - {proyecto.fecha_fin ? proyecto.fecha_fin.slice(0, 10) : 'Sin fecha de termino'}
                        </span>
                    </div>
                </div>

               {/*  <div className="div8">
                    <div>
                        <span className="mb-5 costosColor">
                            Costos
                        </span>
                        <div className="d-flex flex-column">
                            <span className="alignContent">
                                Costo(con iva): &nbsp; ${proyecto.costo}
                            </span>
                            <span className="alignContent">
                                Total pagado: &nbsp; ${proyecto.totalVentas}
                            </span>
                        </div>
                    </div>
                </div> */}
                <div className="">
                    <div>
                        <span className="headerSubTitle mb-5">
                            Cliente
                        </span>
                        <span className="alignContent">
                            {proyecto.clientes.map((cliente, index) => (
                                <span key={index}>
                                    ●{cliente.empresa}
                                </span>
                            ))}
                        </span>
                    </div>
                </div>
                <div className="">
                    <div>
                        <span className="infoColor mb-5">
                            Ubicación
                        </span>
                        <span className="alignContent">
                            {proyecto.estado}, {proyecto.ciudad}, {proyecto.colonia},{proyecto.calle}, {proyecto.cp}
                        </span>
                    </div>
                </div>
                <div className=" d-flex justify-content-center">
                    <div>
                        <span className="infoColor mb-5">
                            Descripción
                        </span>
                        <span className="alignContent">
                            {proyecto.descripcion !== null ? `${proyecto.descripcion}` : 'No hay descripción'}
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}