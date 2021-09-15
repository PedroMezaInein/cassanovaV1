import React, { Component } from 'react'
import { setMoneyText, setFase } from '../../../../functions/setters'
import { printDates, printDireccion } from '../../../../functions/printers';
class InfoProyecto extends Component {

    render() {
        const { proyecto } = this.props
        return (
            <div className="container-fluid gtco-features">
                <div className="">
                    <div className="row mx-0 d-flex justify-content-center align-self-center align-content-center">
                        <div className="col-cards col-md-12 col-lg-12 col-xxl-8">
                            <svg width="100%" height="80%" viewBox="0 0 1000 800">
                                <defs>
                                    <linearGradient id="PSgrad_02" x1="64.279%" x2="0%" y1="76.604%" y2="0%">
                                        <stop offset="0%" stopColor="rgb(1,230,248)" stopOpacity="1" />
                                        <stop offset="100%" stopColor="rgb(29,62,222)" stopOpacity="1" />
                                    </linearGradient>
                                </defs>
                                <path fillRule="evenodd" opacity="0.102" fill="url(#PSgrad_02)" d="M801.878,3.146 L116.381,128.537 C26.052,145.060 -21.235,229.535 9.856,312.073 L159.806,710.157 C184.515,775.753 264.901,810.334 338.020,792.380 L907.021,652.668 C972.912,636.489 1019.383,573.766 1011.301,510.470 L962.013,124.412 C951.950,45.594 881.254,-11.373 801.878,3.146 Z" />
                            </svg>
                            <div className="row mx-0 justify-content-center">
                                <div className="col-md-6">
                                    <div className="card text-center border-0">
                                        <div className="oval">
                                            <img className="card-img-top" src="/images/svg/Proyecto-project.svg" alt="" />
                                        </div>
                                        <div className="pt-8 px-0">
                                            <h3 className="card-title">Proyecto</h3>
                                            <div className="card-text text-justify table-responsive">
                                                <table className='table table-vertical-center table-borderless mb-0 tb-contacto w-max-content mx-auto'>
                                                    <tbody>
                                                        <tr>
                                                            <td className="font-weight-bolder">TIPO</td>
                                                            <td className="font-weight-light">{proyecto.tipo_proyecto.tipo}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="font-weight-bolder">M²</td>
                                                            <td className="font-weight-light">{proyecto.m2 ? proyecto.m2 : 0} m²</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="font-weight-bolder">Fase</td>
                                                            <td className="font-weight-light">{setFase(proyecto)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="font-weight-bolder">PERIODO</td>
                                                            <td className="font-weight-light">{printDates(proyecto.fecha_inicio, proyecto.fecha_fin)}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card text-center border-0">
                                        <div className="oval">
                                            <img className="card-img-top" src="/images/svg/Proyecto-costo.svg" alt="" />
                                        </div>
                                        <div className="pt-8 px-0">
                                            <h3 className="card-title">Costos</h3>
                                            <div className="card-text text-justify table-responsive">
                                                <table className='table table-vertical-center table-borderless mb-0 tb-contacto w-max-content mx-auto'>
                                                    <tbody>
                                                        <tr>
                                                            <td className="font-weight-bolder">Costo (IVA)</td>
                                                            <td className="font-weight-light">{setMoneyText(proyecto.costo)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="font-weight-bolder">Total pagado</td>
                                                            <td className="font-weight-light"><span className={`font-weight-bold text-${proyecto.costo - proyecto.totalVentas > 0 ? 'red' : 'green'}`}>{setMoneyText(proyecto.totalVentas)}</span></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card text-center border-0">
                                        <div className="oval">
                                            <img className="card-img-top" src="/images/svg/Proyecto-user.svg" alt="" />
                                        </div>
                                        <div className="pt-8 px-2">
                                            <h3 className="card-title">Contacto</h3>
                                            <div className="card-text text-justify table-responsive">
                                                <table className='table table-vertical-center table-borderless mb-0 tb-contacto w-max-content mx-auto'>
                                                    <tbody>
                                                        <tr>
                                                            <td className="font-weight-bolder">Nombre</td>
                                                            <td className="font-weight-light"><span>{proyecto.contacto}</span></td>
                                                        </tr>
                                                        {
                                                            proyecto.numero_contacto !== 'Sin información' ?
                                                                <tr>
                                                                    <td className="font-weight-bolder">Teléfono</td>
                                                                    <td className="font-weight-light">
                                                                        <div>
                                                                            <a className="text-body text-hover-primary" href={`tel:+${proyecto.numero_contacto}`}>
                                                                                {proyecto.numero_contacto}
                                                                            </a>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                : <></>
                                                        }
                                                        {
                                                            proyecto.contactos.length > 0 ?
                                                                <tr>
                                                                    <td className="font-weight-bolder">{proyecto.contactos.length > 1 ? 'Correos' : 'Correo'}</td>
                                                                    <td className="font-weight-light">
                                                                        {
                                                                            proyecto.contactos.map((contacto, key) => {
                                                                                return (
                                                                                    proyecto.contactos.length > 1 ?
                                                                                        <div key={key}>• {contacto.correo}</div> : <div key={key}>{contacto.correo}</div>
                                                                                )
                                                                            })
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                : <></>
                                                        }
                                                        <tr>
                                                            <td className="font-weight-bolder">{proyecto.clientes.length > 1 ? 'Clientes' : 'Cliente'}</td>
                                                            <td className="font-weight-light">
                                                                {
                                                                    proyecto.clientes.map((cliente, key) => {
                                                                        return (
                                                                            proyecto.clientes.length > 1 ?
                                                                                <div key={key}>• {cliente.empresa}</div> : <div key={key}>{cliente.empresa}</div>
                                                                        )
                                                                    })
                                                                }
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card text-center border-0">
                                        <div className="oval">
                                            <img className="card-img-top" src="/images/svg/Proyecto-location.svg" alt="" />
                                        </div>
                                        <div className="pt-8 px-2">
                                            <h3 className="card-title">Ubicación</h3>
                                            <div className="card-text">
                                                <span className={`font-weight-light ${printDireccion(proyecto) === 'Sin especificar' ? 'text-center' : 'text-justify'}`}> {printDireccion(proyecto)} </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default InfoProyecto