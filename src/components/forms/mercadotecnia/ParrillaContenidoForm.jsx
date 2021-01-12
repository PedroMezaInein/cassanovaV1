import React, { Component } from 'react'
import { SelectSearch, Button, Input, CalendarDay, SelectHorario, InputGray } from '../../form-components'
import { Form, Col, Row, Nav, Tab } from 'react-bootstrap'
import { validateAlert, deleteAlert } from '../../../functions/alert'
import moment from 'moment'
import ItemSlider from '../../../components/singles/ItemSlider'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import FileItem from '../../singles/FileItem'
class ParrillaContenidoForm extends Component {

    updateSocialNetworks = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'socialNetwork' } })
    }

    updateTypeContent = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'typeContent' } })
    }

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    diffCommentDate = (comentario) => {
        var now = new Date();
        var then = new Date(comentario.created_at);

        var diff = moment.duration(moment(now).diff(moment(then)));
        var months = parseInt(moment(now).diff(moment(then), 'month'))

        var days = parseInt(diff.asDays());
        var hours = parseInt(diff.asHours());
        var minutes = parseInt(diff.asMinutes());

        if (months) {
            if (months === 1)
                return 'Hace un mes'
            else
                return `Hace ${months} meses`
        }
        else {
            if (days) {
                if (days === 1)
                    return 'Hace un día'
                else
                    return `Hace ${days} días`
            }
            else {
                if (hours) {
                    if (hours === 1)
                        return 'Hace una hora'
                    else
                        return `Hace ${hours} horas`
                }
                else {
                    if (minutes) {
                        if (minutes === 1)
                            return 'Hace un minuto'
                        else
                            return `Hace ${minutes} minutos`
                    }
                    else {
                        return 'Hace un momento'
                    }
                }
            }
        }

    }

    render() {
        const { options, form, onChange, onSubmit, formeditado, activeKey, onChangeModalTab, addComentario, evento, handleChange, deleteContenido, 
            title, addAdjunto, handleChangeSubmit, ...props } = this.props
        return (
            <Tab.Container activeKey={activeKey} >
                <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0 nav-tabs-line-primary my-3 d-flex justify-content-end">
                    <Nav.Item onClick={(e) => { e.preventDefault(); onChangeModalTab("form") }}>
                        <Nav.Link eventKey="form" >
                            <span className="nav-icon">
                                <i className="flaticon2-writing"></i>
                            </span>
                            <span className="nav-text">INFORMACIÓN DEL COPY</span>
                        </Nav.Link>
                    </Nav.Item>
                    {
                        evento !== '' ?
                            <>
                                <Nav.Item onClick={(e) => { e.preventDefault(); onChangeModalTab("files") }}>
                                    <Nav.Link eventKey="files" >
                                        <span className="nav-icon">
                                            <i className="flaticon2-file"></i>
                                        </span>
                                        <span className="nav-text">ADJUNTOS</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item onClick={(e) => { e.preventDefault(); onChangeModalTab("addcomments") }}>
                                    <Nav.Link eventKey="addcomments" >
                                        <span className="nav-icon">
                                            <i className="flaticon2-plus"></i>
                                        </span>
                                        <span className="nav-text">AGREGAR COMENTARIO</span>
                                    </Nav.Link>
                                </Nav.Item>
                            </>
                            : ''
                    }
                    {
                        evento &&
                        evento.comentarios.length > 0 ?
                            <Nav.Item onClick={(e) => { e.preventDefault(); onChangeModalTab("comments") }}>
                                <Nav.Link eventKey="comments" >
                                    <span className="nav-icon">
                                        <i className="flaticon2-chat-1"></i>
                                    </span>
                                    <span className="nav-text">MOSTRAR COMENTARIOS</span>
                                </Nav.Link>
                            </Nav.Item>
                        : ''
                    }
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey="form">
                        <Form id="form-contenido"
                            onSubmit={
                                (e) => {
                                    e.preventDefault();
                                    validateAlert(onSubmit, e, 'form-contenido')
                                }
                            }
                            {...props}
                        >
                            <Row>
                                <Col md={4} className="d-flex justify-content-center">
                                    <div className="col-md-12 text-center align-self-center mt-4">
                                        <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                            <label className="text-center font-weight-bolder">Fecha de publicación</label>
                                        </div>
                                        <CalendarDay value={form.fecha} date={form.fecha} onChange={onChange}
                                            name='fecha' withformgroup={1} />
                                        <div className="d-flex justify-content-center">
                                            <div className="col-md-12">
                                                <label className="col-form-label text-center font-weight-bolder">Hora de publicación</label>
                                                <div className="form-group row d-flex justify-content-center">
                                                    <SelectHorario onChange={onChange} hora={{ value: form.hora, name: 'hora' }}
                                                        minuto={{ value: form.minuto, name: 'minuto' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={8} >
                                    <div className="form-group row form-group-marginless mt-4">
                                        <div className="col-md-4">
                                            <SelectSearch formeditado={formeditado} options={options.empresas}
                                                placeholder="SELECCIONA LA EMPRESA" name="empresa" value={form.empresa}
                                                onChange={this.updateEmpresa} iconclass="far fa-building"
                                                messageinc="Incorrecto. Selecciona la empresa"
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <SelectSearch formeditado={formeditado} options={options.socialNetworks}
                                                placeholder="SELECCIONA LA RED SOCIAL" name="socialNetwork"
                                                value={form.socialNetwork} onChange={this.updateSocialNetworks}
                                                iconclass="fas fa-mail-bulk" messageinc="Incorrecto. Selecciona la red social"
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <SelectSearch formeditado={formeditado} options={options.typeContents}
                                                placeholder="SELECCIONA EL CONTENIDO" name="typeContent"
                                                value={form.typeContent} onChange={this.updateTypeContent}
                                                iconclass="fas fa-pen-fancy" messageinc="Incorrecto. Selecciona el contenido"
                                            />
                                        </div>
                                    </div>
                                    <div className="separator separator-dashed mt-1 mb-2"></div>
                                    <div className="form-group row form-group-marginless justify-content-center">
                                        <div className="col-md-4">
                                            <Input requirevalidation={1} formeditado={formeditado}
                                                name="title" value={form.title} onChange={onChange}
                                                type="text" placeholder="TÍTULO" iconclass="flaticon2-crisp-icons"
                                                messageinc="Incorrecto. Ingresa el título." spellCheck={true} letterCase={false} />
                                        </div>
                                        <div className="col-md-4">
                                            <Input requirevalidation={0} formeditado={formeditado} name="cta"
                                                value={form.cta} onChange={onChange} type="text"
                                                placeholder="CTA" iconclass="fas fa-share-square"
                                                messageinc="Incorrecto. Ingresa la cta." spellCheck={true} letterCase={false} />
                                        </div>
                                        <div className="col-md-4">
                                            <Input requirevalidation={0} formeditado={formeditado}
                                                name="comments" value={form.comments} onChange={onChange}
                                                type="text" placeholder="COMENTARIOS (IMAGEN)" iconclass="far fa-file-alt"
                                                messageinc="Incorrecto. Ingresa los comentarios." />
                                        </div>
                                    </div>
                                    <div className="separator separator-dashed mt-1 mb-2"></div>
                                    <div className="form-group row form-group-marginless justify-content-center">
                                        <div className="col-md-12">
                                            <Input requirevalidation={1} formeditado={formeditado}
                                                name="copy" value={form.copy} onChange={onChange}
                                                type="text" placeholder="COPY" messageinc="Incorrecto. Ingresa el copy."
                                                spellCheck={true} letterCase={false} as="textarea"
                                                rows="5" style={{ paddingLeft: "10px" }} customicon="d-none" />
                                        </div>
                                    </div>
                                </Col>
                                {
                                    title === 'Agregar contenido'  && false ? 
                                        <Col md="12">
                                            <div className="form-group row form-group-marginless justify-content-center">
                                                <div className="col-md-12 d-flex justify-content-center align-self-center">
                                                    <div>
                                                        <div className="text-center font-weight-bolder mb-2">
                                                            {form.adjuntos.adjunto.placeholder}
                                                        </div>
                                                        <ItemSlider multiple = { true } items = { form.adjuntos.adjunto.files }
                                                            item = 'adjunto' handleChange={handleChange}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    : ''
                                }
                            </Row>
                            <div className="card-footer py-3 pr-1">
                                <div className="row mx-0">
                                    <div className="col-lg-12 text-right pr-0 pb-0">
                                        <Button
                                            icon=''
                                            className="btn-light-danger mr-2 font-weight-bold"
                                            onClick={(e) => { deleteAlert('¿ESTÁS SEGURO QUE DESEAS ELIMINAR EL CONTENIDO ?', '¡NO PODRÁS REVERTIR ESTO!', () => deleteContenido(form.id)) }}
                                            text='ELIMINAR'
                                        />
                                        <Button
                                            icon=''
                                            className="btn-light-primary font-weight-bold mx-auto"
                                            onClick={
                                                (e) => {
                                                    e.preventDefault();
                                                    validateAlert(onSubmit, e, 'form-contenido')
                                                }
                                            }
                                            text="ENVIAR"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Tab.Pane>
                    <Tab.Pane eventKey="addcomments">
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
                                        <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1}
                                            withicon={0} requirevalidation={0} placeholder='COMENTARIO'
                                            value={form.comentario} name='comentario' onChange={onChange}
                                            as="textarea" rows="3" />
                                    </div>
                                    <div className="col-md-12 d-flex justify-content-center align-self-center mt-4">
                                        <div>
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
                    <Tab.Pane eventKey="comments">
                        {
                            evento &&
                                evento.comentarios.length > 0 ?
                                <div className="col-md-12 row d-flex justify-content-center">
                                    <div className="col-md-7 mt-5">
                                        {
                                            evento.comentarios.length > 0 &&
                                            evento.comentarios.map((comentario, key) => {
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
                                                                            <span className="text-muted ml-2 font-weight-bold">{this.diffCommentDate(comentario)}</span>
                                                                            <p className="p-0 font-weight-light mb-0">{comentario.comentario}</p>
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
                                : ''
                        }
                    </Tab.Pane>
                    <Tab.Pane eventKey="files">
                        <div>
                            <Form id="form-adjuntos"
                                onSubmit={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(addAdjunto, e, 'form-adjuntos')
                                    }
                                }>
                                <Row>
                                    <Col md = '12'>
                                        <div className="table-responsive mt-4">
                                            <table className="table table-vertical-center">
                                                <thead className="thead-light">
                                                    <tr className="text-left text-dark-75">
                                                        <th className="pl-2" style={{ minWidth: "150px" }}>Adjunto</th>
                                                        <th style={{ minWidth: "80px" }} className="text-center">Fecha</th>
                                                        <th className="pr-0 text-right" style={{ minWidth: "70px" }}></th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    {
                                                        evento ?
                                                            evento.adjuntos ?
                                                                evento.adjuntos.length === 0 ?
                                                                    <tr className="text-center text-dark-75">
                                                                        <th className="pl-2" colSpan = "3" >NO HAY ADJUNTOS</th>
                                                                    </tr>
                                                                : ''
                                                            : 
                                                                <tr className="text-center text-dark-75">
                                                                    <th className="pl-2" colSpan = "3" >NO HAY ADJUNTOS</th>
                                                                </tr>
                                                        : 
                                                            <tr className="text-center text-dark-75">
                                                                <th className="pl-2" colSpan = "3" >NO HAY ADJUNTOS</th>
                                                            </tr>
                                                    }
                                                    {
                                                        evento ?
                                                            evento.adjuntos.map((adjunto, key) => {
                                                                return (
                                                                    <FileItem item={adjunto} onClickDelete={this.onClickDelete} key={key} />
                                                                )
                                                            })
                                                        : ''
                                                    }
                                                </tbody>
                                            </table>
                                        </div >
                                    </Col>
                                    <Col md="12">
                                        <div className="form-group row form-group-marginless justify-content-center">
                                            <div className="col-md-12 d-flex justify-content-center align-self-center">
                                                <div>
                                                    <div className="text-center font-weight-bolder mb-2">
                                                        {form.adjuntos.adjunto.placeholder}
                                                    </div>
                                                    <ItemSlider multiple = { true } items = { form.adjuntos.adjunto.files }
                                                        item = 'adjunto' handleChange = { handleChangeSubmit } />
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        )
    }
}

export default ParrillaContenidoForm