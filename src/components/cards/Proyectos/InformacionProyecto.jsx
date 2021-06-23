import React, { Component } from 'react'
import { Tab, Nav } from 'react-bootstrap'
import { printDates } from '../../../functions/printers'
import ComentarioForm from '../../forms/ComentarioForm'
import TimelineComments from '../../forms/TimelineComments'
import { setEmpresaLogo } from '../../../functions/setters'
export default class InformacionProyecto extends Component {

    hasComentarios = (proyecto) => {
        if(proyecto)
            if(proyecto.comentarios)
                if(proyecto.comentarios.length)
                    return true
        return false
    }

    render() {
        const { proyecto, form, addComentario, onChange, handleChange, tipo, urls } = this.props
        console.log(proyecto)
        return (
            <div className="col-md-12 mt-4">
                {
                    proyecto &&
                    <Tab.Container defaultActiveKey={ tipo === '' ? "tab_informacion_general" : proyecto.comentarios.length ? "tab_mostrar_comentarios" : "tab_informacion_general" }>
                        <Nav className="nav nav-light-primary nav-pills d-flex justify-content-end">
                            {
                                form && this.hasComentarios(proyecto) ?
                                    <Nav.Item className="nav-item">
                                        <Nav.Link className="nav-link px-3" eventKey="tab_informacion_general">
                                            <span className="nav-icon"><i className="flaticon2-file"></i></span>
                                            <span className="nav-text font-size-lg font-weight-bolder">Información general</span>
                                        </Nav.Link>
                                    </Nav.Item>
                                : ''
                            }
                            {
                                form ?
                                    <Nav.Item className="nav-item">
                                        <Nav.Link className="nav-link px-3" eventKey="tab_comentarios">
                                            <span className="nav-icon"><i className="flaticon2-plus"></i></span>
                                            <span className="nav-text font-size-lg font-weight-bolder">Agregar comentario</span>
                                        </Nav.Link>
                                    </Nav.Item>
                                :''
                            }
                            {
                                this.hasComentarios(proyecto) ?
                                    <Nav.Item className="nav-item">
                                        <Nav.Link className="nav-link px-3" eventKey="tab_mostrar_comentarios" >
                                            <span className="nav-icon"><i className="flaticon2-chat-1"></i></span>
                                            <span className="nav-text font-size-lg font-weight-bolder">Mostrar comentarios</span>
                                        </Nav.Link>
                                    </Nav.Item>
                                :''
                            }
                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey='tab_informacion_general'>
                                {
                                    urls &&
                                    <div className="mt-5">
                                        <div className="d-flex justify-content-center">
                                            <a className="d-flex align-items-center pr-5 text-hover-info cursor-pointer" href = {`/proyectos/proyectos?id=${proyecto.id}&name=${proyecto.nombre}`}>
                                                <i className="las la-toolbox icon-2x mr-1 text-muted"></i>
                                                <span className="text-muted font-weight-bolder text-hover-info border-bottom-2px-info-hover">VER PROYECTO</span>
                                            </a>
                                            {
                                                proyecto.prospecto&&
                                                <a className="d-flex align-items-center text-hover-info cursor-pointer" href = {`/leads/crm?id=${proyecto.prospecto.lead.id}`}>
                                                    <i className="las la-user-alt icon-2x mr-1 text-muted"></i>
                                                    <span className="text-muted font-weight-bolder text-hover-info border-bottom-2px-info-hover">VER LEAD</span>
                                                </a>
                                            }
                                        </div>
                                    </div>
                                }
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
                                            {
                                                proyecto.calle &&
                                                    <tr>
                                                        <td className="text-center">
                                                            <i className="las la-calendar icon-2x text-dark-50"></i>
                                                        </td>
                                                        <td className="font-weight-bolder text-dark-50">PERIODO DEL PROYECTO</td>
                                                        <td className="font-weight-light">
                                                            {printDates(proyecto.fecha_inicio, proyecto.fecha_fin)}
                                                        </td>
                                                    </tr>
                                            }
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
                            {
                                form ?
                                    <Tab.Pane eventKey='tab_comentarios'>
                                        <ComentarioForm
                                            addComentario={addComentario}
                                            form={form}
                                            onChange={onChange}
                                            handleChange={handleChange}
                                            color="primary"
                                        />
                                    </Tab.Pane>
                                :''
                            }
                            <Tab.Pane eventKey='tab_mostrar_comentarios'>
                                <TimelineComments
                                    comentariosObj = {proyecto}
                                    col='11'
                                    color='primary'
                                />
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                }
            </div>
        )
    }
}