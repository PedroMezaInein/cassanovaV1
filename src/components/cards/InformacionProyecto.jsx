import React, { Component } from 'react'
import { Tab, Nav } from 'react-bootstrap'
import { setEmpresaLogo, setMoneyText } from '../../functions/setters'
import { printDates } from '../../functions/printers'

class InformacionProyecto extends Component{

    hasComentarios = (proyecto) => {
        if(proyecto)
            if(proyecto.comentarios)
                if(proyecto.comentarios.length)
                    return true
        return false
    }

    render(){
        const { proyecto } = this.props
        return(
            <div>
                {
                    proyecto ?
                        <Tab.Container defaultActiveKey = { this.hasComentarios(proyecto) ? 'tab_mostrar_comentarios' : 'tab_informacion_general'} >
                            {
                                this.hasComentarios(proyecto) ? 
                                    <Nav.Item className="nav-item">
                                        <Nav.Link className="nav-link px-3" eventKey="tab_informacion_general">
                                            <span className="nav-icon"><i className="flaticon2-file"></i></span>
                                            <span className="nav-text font-size-lg font-weight-bolder">Información general</span>
                                        </Nav.Link>
                                    </Nav.Item>
                                : <> </>
                            }
                            {
                                this.hasComentarios(proyecto) ? 
                                    <Nav.Item className="nav-item">
                                        <Nav.Link className="nav-link px-3" eventKey="tab_mostrar_comentarios" >
                                            <span className="nav-icon"><i className="flaticon2-chat-1"></i></span>
                                            <span className="nav-text font-size-lg font-weight-bolder">Mostrar comentarios</span>
                                        </Nav.Link>
                                    </Nav.Item>
                                : <> </>
                            }
                            <Tab.Content>
                                <Tab.Pane eventKey = 'tab_informacion_general'>
                                    <div className="table-responsive-lg mt-8">
                                        <table className="table table-vertical-center w-80 mx-auto table-borderless" id="tcalendar_p_info">
                                            <thead>
                                                <tr>
                                                    <th colSpan="3" className="text-center pt-0">
                                                        {
                                                            setEmpresaLogo(proyecto) !== '' ?
                                                                <img alt='' width="170" src={setEmpresaLogo(proyecto)} />
                                                            : ''
                                                        }
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    proyecto.contacto &&
                                                        <tr className="border-top-2px">
                                                            <td className="text-center w-5">
                                                                <i className="las la-user-alt icon-2x text-dark-50"></i>
                                                            </td>
                                                            <td className="w-33 font-weight-bolder text-dark-50">NOMBRE DE CONTACTO</td>
                                                            <td className="font-weight-light">
                                                                <span>{proyecto.contacto}</span>
                                                            </td>
                                                        </tr>
                                                }
                                                {
                                                    proyecto.numero_contacto &&
                                                        <tr>
                                                            <td className="text-center">
                                                                <i className="las la-phone icon-2x text-dark-50"></i>
                                                            </td>
                                                            <td className="font-weight-bolder text-dark-50">NÚMERO DE CONTACTO</td>
                                                            <td className="font-weight-light">
                                                                <span>{proyecto.numero_contacto}</span>
                                                            </td>
                                                        </tr>
                                                }
                                                {
                                                    proyecto.contactos.length > 0 &&
                                                        <tr>
                                                            <td className="text-center">
                                                                <i className="las la-envelope icon-2x text-dark-50"></i>
                                                            </td>
                                                            {
                                                                proyecto.clientes.length > 1 ?
                                                                    <td className="font-weight-bolder text-dark-50">Correos de contacto</td>
                                                                    : <td className="font-weight-bolder text-dark-50">Correo de contacto</td>
                                                            }
                                                            <td className="font-weight-light">
                                                                {
                                                                    proyecto.contactos.map((contacto, key) => {
                                                                        return (
                                                                            proyecto.contactos.length > 1 ?
                                                                                <div key={key}>• {contacto.correo}</div>
                                                                                : <div key={key}>{contacto.correo}</div>
                                                                        )
                                                                    })
                                                                }
                                                            </td>
                                                        </tr>
                                                }
                                                {
                                                    proyecto.clientes &&
                                                        <tr>
                                                            <td className="text-center">
                                                                <i className="las la-user-friends icon-2x text-dark-50"></i>
                                                            </td>
                                                            {
                                                                proyecto.clientes.length > 1 ?
                                                                    <td className="font-weight-bolder text-dark-50">Clientes</td>
                                                                    : <td className="font-weight-bolder text-dark-50">Cliente</td>
                                                            }
                                                            <td className="font-weight-light text-justify">
                                                                {
                                                                    proyecto.clientes.map((cliente, key) => {
                                                                        return (
                                                                            proyecto.clientes.length > 1 ?
                                                                                <div key={key}>• {cliente.empresa}</div>
                                                                                : <div key={key}>{cliente.empresa}</div>
                                                                        )
                                                                    })
                                                                }
                                                            </td>
                                                        </tr>
                                                }
                                                <tr>
                                                    <td className="text-center">
                                                        <i className="las la-calendar icon-2x text-dark-50"></i>
                                                    </td>
                                                    <td className="font-weight-bolder text-dark-50">PERIODO DEL PROYECTO</td>
                                                    <td className="font-weight-light">
                                                        {printDates(proyecto.fecha_inicio, proyecto.fecha_fin)}
                                                    </td>
                                                </tr>
                                                {
                                                    proyecto.tipo_proyecto &&
                                                        <tr>
                                                            <td className="text-center">
                                                                <i className="las la-toolbox icon-2x text-dark-50"></i>
                                                            </td>
                                                            <td className="font-weight-bolder text-dark-50">TIPO DEL PROYECTO</td>
                                                            <td className="font-weight-light">
                                                                <span>{proyecto.tipo_proyecto.tipo}</span>
                                                            </td>
                                                        </tr>
                                                }
                                                {
                                                    proyecto.m2>0 &&
                                                        <tr>
                                                            <td className="text-center">
                                                                <i className="las la-ruler icon-2x text-dark-50"></i>
                                                            </td>
                                                            <td className="font-weight-bolder text-dark-50">M²</td>
                                                            <td className="font-weight-light">
                                                                <span>{proyecto.m2} m²</span>
                                                            </td>
                                                        </tr>
                                                }
                                                {
                                                    proyecto.costo &&
                                                        <tr>
                                                            <td className="text-center">
                                                                <i className="fas fa-dollar-sign icon-2x text-dark-50"></i>
                                                            </td>
                                                            <td className="font-weight-bolder text-dark-50">Costo con IVA</td>
                                                            <td className="font-weight-light">
                                                                <span> { setMoneyText(proyecto.costo) } </span>
                                                            </td>
                                                        </tr>
                                                }
                                                {
                                                    proyecto.totalVentas >= 0 ?
                                                        <tr>
                                                            <td className="text-center">
                                                                <i className = {`fas fa-file-invoice-dollar icon-2x text-${ proyecto.costo - proyecto.totalVentas > 0 ? 'danger' : 'dark-50'}`} />
                                                            </td>
                                                            <td className="font-weight-bolder text-dark-50">
                                                                Total pagado
                                                            </td>
                                                            <td className="font-weight-light">
                                                                <span> { setMoneyText(proyecto.totalVentas) } </span>
                                                            </td>
                                                        </tr>
                                                    : <></>
                                                }
                                                {
                                                    proyecto.fase3 === 0 && proyecto.fase2 === 0 && proyecto.fase1 === 0 ? <></> :
                                                        <tr>
                                                            <td className="text-center">
                                                                <i className="las la-tools icon-2x text-dark-50"></i>
                                                            </td>
                                                            <td className="font-weight-bolder text-dark-50">FASE</td>
                                                            <td className="font-weight-light">
                                                                {
                                                                    proyecto.fase1 ?
                                                                        <div>• Fase 1</div>
                                                                        : ''
                                                                }
                                                                {
                                                                    proyecto.fase2 ?
                                                                        <div>• Fase 2</div>
                                                                        : ''
                                                                }
                                                                {
                                                                    proyecto.fase3 ?
                                                                        <div>• Fase 3</div>
                                                                        : ''
                                                                }
                                                            </td>
                                                        </tr>
                                                }
                                                {
                                                    proyecto.cp &&
                                                        <tr>
                                                            <td className="text-center">
                                                                <i className="las la-map-pin icon-2x text-dark-50"></i>
                                                            </td>
                                                            <td className="font-weight-bolder text-dark-50">CÓDIGO POSTAL</td>
                                                            <td className="font-weight-light">
                                                                <span>{proyecto.cp}</span>
                                                            </td>
                                                        </tr>
                                                }
                                                {
                                                    proyecto.estado &&
                                                        <tr>
                                                            <td className="text-center">
                                                                <i className="las la-globe icon-2x text-dark-50"></i>
                                                            </td>
                                                            <td className="font-weight-bolder text-dark-50">ESTADO</td>
                                                            <td className="font-weight-light">
                                                                <span>{proyecto.estado}</span>
                                                            </td>
                                                        </tr>
                                                }
                                                {
                                                    proyecto.municipio &&
                                                        <tr>
                                                            <td className="text-center">
                                                                <i className="las la-map icon-2x text-dark-50"></i>
                                                            </td>
                                                            <td className="font-weight-bolder text-dark-50">MUNICIPIO/DELEGACIÓN</td>
                                                            <td className="font-weight-light">
                                                                <span>{proyecto.municipio}</span>
                                                            </td>
                                                        </tr>
                                                }
                                                {
                                                    proyecto.colonia &&
                                                        <tr>
                                                            <td className="text-center">
                                                                <i className="las la-map-marker icon-2x text-dark-50"></i>
                                                            </td>
                                                            <td className="font-weight-bolder text-dark-50">COLONIA</td>
                                                            <td className="font-weight-light text-justify">
                                                                <span>{proyecto.colonia}</span>
                                                            </td>
                                                        </tr>
                                                }
                                                {
                                                    proyecto.calle &&
                                                        <tr>
                                                            <td className="text-center">
                                                                <i className="las la-map-marked-alt icon-2x text-dark-50"></i>
                                                            </td>
                                                            <td className="font-weight-bolder text-dark-50">CALLE Y NÚMERO</td>
                                                            <td className="font-weight-light text-justify">
                                                                <span>{proyecto.calle}</span>
                                                            </td>
                                                        </tr>
                                                }
                                                {
                                                    proyecto.descripcion && proyecto.descripcion !== "null" &&
                                                        <tr>
                                                            <td className="text-center">
                                                                <i className="las la-file-alt icon-2x text-dark-50"></i>
                                                            </td>
                                                            <td className="font-weight-bolder text-dark-50">DESCRIPCIÓN</td>
                                                            <td className="font-weight-light text-justify">
                                                                <span>{proyecto.descripcion}</span>
                                                            </td>
                                                        </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    : <> </>
                }
            </div>
        )   
    }
}

export default InformacionProyecto