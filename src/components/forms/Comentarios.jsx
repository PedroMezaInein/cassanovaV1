import React, { Component } from 'react'
import { Nav, Tab } from 'react-bootstrap'
import ComentarioForm from '../forms/ComentarioForm'
import TimelineComments from '../forms/TimelineComments'
class Comentarios extends Component {
    render() {
        const { addComentario, form, onChange, handleChange, proyecto} = this.props
        return (
            <Tab.Container defaultActiveKey="1">
                <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0 nav-tabs-line-info mt-4 d-flex justify-content-end" id="nav-tareas">
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
                        <ComentarioForm
                            addComentario={addComentario}
                            form={form}
                            onChange={onChange}
                            handleChange={handleChange}
                            color="info"
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="2">
                        <TimelineComments
                            comentariosObj = {proyecto}
                            col='11'
                            color='info'
                        />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        )
    }
}

export default Comentarios