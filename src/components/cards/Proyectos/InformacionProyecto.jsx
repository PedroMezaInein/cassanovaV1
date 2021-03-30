import React, { Component } from 'react'
import { Tab, Nav, Form } from 'react-bootstrap'
import { ItemSlider } from '../../../components/singles'
import { validateAlert } from '../../../functions/alert'
import { InputGray } from '../../../components/form-components'
import { Button } from '../../../components/form-components'
import { diffCommentDate } from '../../../functions/functions'
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../../functions/routers"
export default class InformacionProyecto extends Component {
    setEmpresaLogo = proyecto => {
        if (proyecto)
            if (proyecto.empresa)
                if (proyecto.empresa.logo_principal)
                    if (proyecto.empresa.logo_principal.length)
                        return proyecto.empresa.logo_principal[0].url
        return ''
    }
    render() {
        const { proyecto, printDates, form, addComentario, onChange, handleChange} = this.props
        return (
            <div className="col-md-12 mt-4">
                <Tab.Container defaultActiveKey="tab_informacion_general">
                    <Nav className="nav nav-light-primary nav-pills d-flex justify-content-end">
                        <Nav.Item className="nav-item">
                            <Nav.Link className="nav-link px-3" eventKey="tab_informacion_general">
                                <span className="nav-icon"><i className="flaticon2-file"></i></span>
                                <span className="nav-text font-size-lg font-weight-bolder">Información general</span>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="nav-item">
                            <Nav.Link className="nav-link px-3" eventKey="tab_comentarios">
                                <span className="nav-icon"><i className="flaticon2-plus"></i></span>
                                <span className="nav-text font-size-lg font-weight-bolder">Agregar comentario</span>
                            </Nav.Link>
                        </Nav.Item>
                        {
                            proyecto ?
                                proyecto.comentarios.length > 0 ?
                                    <Nav.Item className="nav-item">
                                        <Nav.Link className="nav-link px-3" eventKey="tab_mostrar_comentarios" >
                                            <span className="nav-icon"><i className="flaticon2-chat-1"></i></span>
                                            <span className="nav-text font-size-lg font-weight-bolder">Mostrar comentarios</span>
                                        </Nav.Link>
                                    </Nav.Item>
                                :''
                            :''
                        }
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane eventKey='tab_informacion_general'>
                            <div className="table-responsive-lg mt-8">
                                <table className="table table-vertical-center w-75 mx-auto table-borderless" id="tcalendar_p_info">
                                    <thead>
                                        <tr>
                                            <th colSpan="3" className="text-center pt-0">
                                                {
                                                    this.setEmpresaLogo(proyecto) !== '' ?
                                                        <img alt='' width="170" src={this.setEmpresaLogo(proyecto)} />
                                                        : ''
                                                }
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            proyecto.contacto ?
                                                <tr className="border-top-2px">
                                                    <td className="text-center w-5">
                                                        <i className="las la-user-alt icon-2x text-dark-50"></i>
                                                    </td>
                                                    <td className="w-25 font-weight-bolder text-dark-50">NOMBRE DE CONTACTO</td>
                                                    <td className="font-weight-light">
                                                        <span>{proyecto.contacto}</span>
                                                    </td>
                                                </tr>
                                                :
                                                ''
                                        }
                                        {
                                            proyecto.clientes ?
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
                                                : ''
                                        }
                                        {
                                            proyecto.calle ?
                                                <tr>
                                                    <td className="text-center">
                                                        <i className="las la-calendar icon-2x text-dark-50"></i>
                                                    </td>
                                                    <td className="font-weight-bolder text-dark-50">PERIODO DEL PROYECTO</td>
                                                    <td className="font-weight-light">
                                                        {printDates(proyecto)}
                                                    </td>
                                                </tr>
                                                :
                                                ''
                                        }
                                        {
                                            proyecto.tipo_proyecto ?
                                                <tr>
                                                    <td className="text-center">
                                                        <i className="las la-toolbox icon-2x text-dark-50"></i>
                                                    </td>
                                                    <td className="font-weight-bolder text-dark-50">TIPO DEL PROYECTO</td>
                                                    <td className="font-weight-light">
                                                        <span>{proyecto.tipo_proyecto.tipo}</span>
                                                    </td>
                                                </tr>
                                                :
                                                ''
                                        }{
                                            proyecto.m2 ?
                                                <tr>
                                                    <td className="text-center">
                                                        <i className="las la-ruler icon-2x text-dark-50"></i>
                                                    </td>
                                                    <td className="font-weight-bolder text-dark-50">M²</td>
                                                    <td className="font-weight-light">
                                                        <span>{proyecto.m2} m²</span>
                                                    </td>
                                                </tr>
                                                :
                                                ''
                                        }
                                        {
                                            proyecto.fase3 === 0 && proyecto.fase2 === 0 && proyecto.fase1 === 0 ? '' :
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
                                            proyecto.numero_contacto ?
                                                <tr>
                                                    <td className="text-center">
                                                        <i className="las la-phone icon-2x text-dark-50"></i>
                                                    </td>
                                                    <td className="font-weight-bolder text-dark-50">NÚMERO DE CONTACTO</td>
                                                    <td className="font-weight-light">
                                                        <span>{proyecto.numero_contacto}</span>
                                                    </td>
                                                </tr>
                                                :
                                                ''
                                        }
                                        {
                                            proyecto.contactos.length > 0 ?
                                                <tr>
                                                    <td className="text-center">
                                                        <i className="las la-envelope icon-2x text-dark-50"></i>
                                                    </td>
                                                    {
                                                        proyecto.clientes.length > 1 ?
                                                            <td className="font-weight-bolder text-dark-50">Correos</td>
                                                            : <td className="font-weight-bolder text-dark-50">Correo</td>
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
                                                : ''
                                        }
                                        {
                                            proyecto.cp ?
                                                <tr>
                                                    <td className="text-center">
                                                        <i className="las la-map-pin icon-2x text-dark-50"></i>
                                                    </td>
                                                    <td className="font-weight-bolder text-dark-50">CÓDIGO POSTAL</td>
                                                    <td className="font-weight-light">
                                                        <span>{proyecto.cp}</span>
                                                    </td>
                                                </tr>
                                                :
                                                ''
                                        }
                                        {
                                            proyecto.estado ?
                                                <tr>
                                                    <td className="text-center">
                                                        <i className="las la-globe icon-2x text-dark-50"></i>
                                                    </td>
                                                    <td className="font-weight-bolder text-dark-50">ESTADO</td>
                                                    <td className="font-weight-light">
                                                        <span>{proyecto.estado}</span>
                                                    </td>
                                                </tr>
                                                :
                                                ''
                                        }
                                        {
                                            proyecto.municipio ?
                                                <tr>
                                                    <td className="text-center">
                                                        <i className="las la-map icon-2x text-dark-50"></i>
                                                    </td>
                                                    <td className="font-weight-bolder text-dark-50">MUNICIPIO/DELEGACIÓN</td>
                                                    <td className="font-weight-light">
                                                        <span>{proyecto.municipio}</span>
                                                    </td>
                                                </tr>
                                                :
                                                ''
                                        }
                                        {
                                            proyecto.colonia ?
                                                <tr>
                                                    <td className="text-center">
                                                        <i className="las la-map-marker icon-2x text-dark-50"></i>
                                                    </td>
                                                    <td className="font-weight-bolder text-dark-50">COLONIA</td>
                                                    <td className="font-weight-light text-justify">
                                                        <span>{proyecto.colonia}</span>
                                                    </td>
                                                </tr>
                                                :
                                                ''
                                        }
                                        {
                                            proyecto.calle ?
                                                <tr>
                                                    <td className="text-center">
                                                        <i className="las la-map-marked-alt icon-2x text-dark-50"></i>
                                                    </td>
                                                    <td className="font-weight-bolder text-dark-50">CALLE Y NÚMERO</td>
                                                    <td className="font-weight-light text-justify">
                                                        <span>{proyecto.calle}</span>
                                                    </td>
                                                </tr>
                                                :
                                                ''
                                        }
                                        {
                                            proyecto.descripcion && proyecto.descripcion !== "null" ?
                                                <tr>
                                                    <td className="text-center">
                                                        <i className="las la-file-alt icon-2x text-dark-50"></i>
                                                    </td>
                                                    <td className="font-weight-bolder text-dark-50">DESCRIPCIÓN</td>
                                                    <td className="font-weight-light text-justify">
                                                        <span>{proyecto.descripcion}</span>
                                                    </td>
                                                </tr>
                                                :
                                                ''
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey='tab_comentarios'>
                            <div>
                                <Form id="form-comentario"
                                    onSubmit={
                                        (e) => {
                                            e.preventDefault();
                                            validateAlert(addComentario, e, 'form-comentario')
                                        }
                                    }>
                                    <div className="form-group row form-group-marginless mt-3 d-flex justify-content-center">
                                        <div className="col-md-11 align-self-center">
                                            <InputGray 
                                                withtaglabel={1}
                                                withtextlabel={1}
                                                withplaceholder={1}
                                                withicon={0}
                                                requirevalidation={0}
                                                placeholder='COMENTARIO'
                                                value={form.comentario}
                                                name='comentario'
                                                onChange={onChange}
                                                as="textarea"
                                                rows="3"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-marginless mt-3 d-flex justify-content-center">
                                        <div className="col-md-12 d-flex justify-content-center align-self-center mt-4">
                                            <div className = 'w-100'>
                                                <div className="text-center font-weight-bolder mb-2">
                                                    {form.adjuntos.adjunto_comentario.placeholder}
                                                </div>
                                                <ItemSlider
                                                    multiple={true}
                                                    items={form.adjuntos.adjunto_comentario.files}
                                                    item='adjunto_comentario'
                                                    handleChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer py-3 pr-1">
                                        <div className="row mx-0">
                                            <div className="col-lg-12 text-right pr-0 pb-0">
                                                <Button icon='' className="btn btn-light-primary font-weight-bold"
                                                    onClick={
                                                        (e) => {
                                                            e.preventDefault();
                                                            validateAlert(addComentario, e, 'form-comentario')
                                                        }
                                                    } text="ENVIAR" />
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey='tab_mostrar_comentarios'>
                            {
                                proyecto &&
                                <div className="col-md-12 mx-0 row d-flex justify-content-center">
                                    <div className="col-md-11 mt-10">
                                        {
                                            proyecto.comentarios.length > 0 &&
                                            proyecto.comentarios.map((comentario, key) => {
                                                return (
                                                    <div key={key} className="form-group row form-group-marginless px-3">
                                                        <div className="col-md-12">
                                                            <div className="timeline timeline-3">
                                                                <div className="timeline-items">
                                                                    <div className="timeline-item">
                                                                        <div className="timeline-media border-0">
                                                                            <img alt="Pic" src={comentario.user.avatar ? comentario.user.avatar : "/default.jpg"} />
                                                                        </div>
                                                                        <div className="timeline-content">
                                                                            <span className="text-primary font-weight-bolder">{comentario.user.name}</span>
                                                                            <span className="text-muted ml-2 font-weight-bold">
                                                                                {diffCommentDate(comentario)}
                                                                            </span>
                                                                            <p className={comentario.adjunto === null ? "p-0 font-weight-light mb-0" : "p-0 font-weight-light"}>{comentario.comentario}</p>
                                                                            {
                                                                                comentario.adjunto ?
                                                                                    <div className="d-flex justify-content-end">
                                                                                        <a href={comentario.adjunto.url} target='_blank' rel="noopener noreferrer" className="text-muted text-hover-primary font-weight-bold">
                                                                                            <span className="svg-icon svg-icon-md svg-icon-gray-500 mr-1">
                                                                                                <SVG src={toAbsoluteUrl('/images/svg/Attachment1.svg')} />
                                                                                            </span>VER ADJUNTO
                                                                                                </a>
                                                                                    </div>
                                                                                    : ''
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            }
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </div>
        )
    }
}