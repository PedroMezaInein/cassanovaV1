import React, { Component } from 'react'
import { Input } from '../form-components'
import { ItemSlider } from '../../components/singles'
import { Nav, Tab, Form} from 'react-bootstrap'
import { validateAlert } from '../../functions/alert'
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../functions/routers"
import { Button } from '../../components/form-components'
import { diffCommentDate } from '../../functions/functions'
class Comentarios extends Component {
    render() {
        const { addComentario, form, onChange, handleChange, diffCommentDate, proyecto} = this.props
        return (
            <Tab.Container defaultActiveKey="1">
                <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0 nav-tabs-line-info mt-3 d-flex justify-content-end" id="nav-tareas">
                    {
                        proyecto ?
                            proyecto.comentarios.length > 0 ?
                                <>
                                    <Nav.Item>
                                        <Nav.Link eventKey="1">
                                            <span className="nav-icon">
                                                <i className="flaticon2-plus"></i>
                                            </span>
                                            <span className="nav-text">AGREGAR COMENTARIO</span>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="2">
                                            <span className="nav-icon">
                                                <i className="flaticon2-chat-1"></i>
                                            </span>
                                            <span className="nav-text">MOSTRAR COMENTARIOS</span>
                                        </Nav.Link>
                                    </Nav.Item>
                                </>
                            : ''
                        : ''
                    }
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey="1">
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
                                        <Input 
                                            requirevalidation={0}
                                            placeholder="COMENTARIO"
                                            as="textarea"
                                            rows="3"
                                            name="comentario"
                                            value={form.comentario}
                                            onChange={onChange}
                                            messageinc="Incorrecto. Ingresa el comentario."
                                            style={{ paddingLeft: "10px" }}
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
                                            <Button icon='' className="btn btn-light-info font-weight-bold"
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
                    <Tab.Pane eventKey="2">
                        {
                            proyecto &&
                                <div className="col-md-12 row d-flex justify-content-center">
                                    <div className="col-md-7 mt-5">
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
                                                                                <span className="text-info font-weight-bolder">{comentario.user.name}</span>
                                                                                <span className="text-muted ml-2 font-weight-bold">
                                                                                    {diffCommentDate(comentario)}
                                                                                </span>
                                                                                <p className={comentario.adjunto === null ? "p-0 font-weight-light mb-0" : "p-0 font-weight-light"}>{comentario.comentario}</p>
                                                                                {
                                                                                    comentario.adjunto ?
                                                                                        <div className="d-flex justify-content-end">
                                                                                            <a href={comentario.adjunto.url} target='_blank' rel="noopener noreferrer" className="text-muted text-hover-info font-weight-bold">
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
        )
    }
}

export default Comentarios