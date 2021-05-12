import React, { Component } from 'react'
import { SelectSearch, Button, Input, CalendarDay, SelectHorario } from '../../form-components'
import { Form, Col, Row, Nav, Tab } from 'react-bootstrap'
import { validateAlert, deleteAlert } from '../../../functions/alert'
import ItemSlider from '../../../components/singles/ItemSlider'
import FileItem from '../../singles/FileItem'
import Pagination from "react-js-pagination";
import TagSelectSearch from '../../form-components/TagSelectSearch'
import { transformarOptions } from '../../../functions/setters'
import ComentarioForm from '../../forms/ComentarioForm'
import TimelineComments from '../../forms/TimelineComments'
import $ from "jquery";

class ParrillaContenidoForm extends Component {

    state = {
        itemsPerPage: 10,
        activePage: 1
    }

    selectTagSocialNetworks = seleccionados => {
        const { form, deleteOption } = this.props
        seleccionados = seleccionados ? seleccionados : []
        if (seleccionados.length > form.socialNetworks.length) {
            let diferencia = $(seleccionados).not(form.socialNetworks).get();
            let val_diferencia = diferencia[0].value
            this.updateSocialNetworks(val_diferencia)
        } else {
            let diferencia = $(form.socialNetworks).not(seleccionados).get();
            diferencia.forEach(borrar => {
                deleteOption(borrar, "socialNetworks")
            })
        }
    }

    updateSocialNetworks = value => {
        const { onChange, options, onChangeOptions, form } = this.props
        options.socialNetworks.map((red) => {
            if (red.value === value) {
                let aux = false;
                form.socialNetworks.map((element) => {
                    if (element.value === value)
                        aux = true
                    return false
                })
                if (!aux)
                    onChangeOptions({ target: { value: red.value, name: 'socialNetwork' } }, 'socialNetworks')
            }
            return false
        })
        onChange({ target: { value: value, name: 'socialNetwork' } })
    }

    updateSocialNetwork = value => {
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

    onChangePage(pageNumber) {
        let { activePage } = this.state
        activePage = pageNumber
        this.setState({ ...this.state, activePage })
    }

    isActivePostingButton = evento => {
        if (evento)
            if (evento.red)
                if (evento.red.nombre === 'FACEBOOK')
                    if (evento.uploaded !== 1)
                        return true
        return false
    }

    isFacebook = () => {
        const { form } = this.props
        let bandera = false
        form.socialNetworks.map((red) => {
            if (red.label === 'FACEBOOK') bandera = true
            return ''
        })
        if (bandera) {
            if (form.typeContent === 'contenido')
                bandera = true
            else
                bandera = false
        }
        return bandera
    }

    render() {
        const { options, form, onChange, onSubmit, formeditado, activeKey, onChangeModalTab, addComentario, evento, handleChange, deleteContenido,
            title, addAdjunto, handleChangeSubmit, onClickDelete, onClickFacebookPost, post, ...props } = this.props
        const { itemsPerPage, activePage } = this.state
        return (
            <Tab.Container activeKey={activeKey} >
                <div className='d-flex justify-content-between'>
                    <div className='d-flex align-items-center'>
                        {
                            Object.keys(post).length > 0 ?
                                <>
                                    <div>
                                        <div className="label label-md label-light-primary label-inline font-weight-bold h-auto py-2" style={{ fontSize: '10px' }}>
                                            <i className='animation animation__heart fas fa-heart mr-2 text-danger' style={{ fontSize: '10px' }}></i>
                                            {post.reacciones} reacciones
                                        </div>
                                    </div>
                                    <div className='mx-2'>
                                        <div className="label label-md label-light-success label-inline font-weight-bold h-auto py-2" style={{ fontSize: '10px' }}>
                                            <i className='animation animation__comment flaticon-comment mr-2 text-primary' style={{ fontSize: '10px' }}></i>
                                            {post.comentarios} comentarios
                                        </div>
                                    </div>
                                    <div className=''>
                                        <div className="label label-md label-light-info label-inline font-weight-bold h-auto py-2" style={{ fontSize: '10px' }}>
                                            <i className='animation animation__people flaticon-users-1 mr-2 text-dark' style={{ fontSize: '10px' }}></i>
                                            {post.engaged} personas alcanzadas
                                        </div>
                                    </div>
                                </>
                                : ''
                        }
                    </div>
                    <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0 nav-tabs-line-primary mt-2 mb-4 d-flex justify-content-end">
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
                                                <i className="flaticon-attachment"></i>
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
                </div>
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
                                        <CalendarDay value={form.fecha} date={form.fecha} onChange={onChange} className='input-calendar'
                                            name='fecha' withformgroup={1} requirevalidation={1}
                                        />
                                        <div className="d-flex justify-content-center">
                                            <div className="col-md-12">
                                                <label className="col-form-label text-center font-weight-bolder">Hora de publicación</label>
                                                <div className="form-group row d-flex justify-content-center">
                                                    <SelectHorario onChange={onChange} hora={{ value: form.hora, name: 'hora' }}
                                                        minuto={{ value: form.minuto, name: 'minuto' }} quarter={true} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={8} >
                                    <div className="form-group row form-group-marginless mt-4">
                                        <div className='col-md-4'>
                                            <SelectSearch formeditado={formeditado} options={options.empresas}
                                                placeholder="SELECCIONA LA EMPRESA" name="empresa" value={form.empresa}
                                                onChange={this.updateEmpresa} iconclass="far fa-building"
                                                messageinc="Incorrecto. Selecciona la empresa"
                                            />
                                        </div>
                                        <div className='col-md-5'>
                                            <TagSelectSearch placeholder="SELECCIONA LA RED" options={transformarOptions(options.socialNetworks)}
                                                defaultvalue={transformarOptions(form.socialNetworks)} onChange={this.selectTagSocialNetworks}
                                                iconclass="fas fa-mail-bulk" requirevalidation={1} messageinc="Incorrecto. Selecciona la red" />
                                            </div>
                                        <div className='col-md-3'>
                                            <SelectSearch formeditado={formeditado} options={options.typeContents}
                                                placeholder="SELECCIONA EL CONTENIDO" name="typeContent"
                                                value={form.typeContent} onChange={this.updateTypeContent}
                                                iconclass="fas fa-pen-fancy" messageinc="Incorrecto. Selecciona el contenido"
                                            />
                                        </div>
                                    </div>
                                    <div className="separator separator-dashed mt-1 mb-2"></div>
                                    <div className="form-group row form-group-marginless justify-content-center">
                                        <div className={this.isFacebook() ? "col-md-3" : 'd-none'}>
                                            <Input requirevalidation={0} formeditado={formeditado}
                                                name="post" value={form.post} onChange={onChange}
                                                type="text" placeholder="POST ID" iconclass="flaticon-facebook-letter-logo"
                                                messageinc="Incorrecto. Ingresa ID del post." />
                                        </div>
                                        <div className={this.isFacebook() ? "col-md-3" : 'col-md-4'}>
                                            <Input requirevalidation={1} formeditado={formeditado}
                                                name="title" value={form.title} onChange={onChange}
                                                type="text" placeholder="TÍTULO" iconclass="flaticon2-crisp-icons"
                                                messageinc="Incorrecto. Ingresa el título." spellCheck={true} letterCase={false} />
                                        </div>
                                        <div className={this.isFacebook() ? "col-md-3" : 'col-md-4'}>
                                            <Input requirevalidation={1} formeditado={formeditado} name="cta"
                                                value={form.cta} onChange={onChange} type="text"
                                                placeholder="CTA" iconclass="fas fa-share-square"
                                                messageinc="Incorrecto. Ingresa la cta." spellCheck={true} letterCase={false} />
                                        </div>
                                        <div className={this.isFacebook() ? "col-md-3" : 'col-md-4'}>
                                            <Input requirevalidation={0} formeditado={formeditado}
                                                name="comments" value={form.comments} onChange={onChange}
                                                type="text" placeholder="COMENTARIOS (IMAGEN)" iconclass="far fa-file-alt"
                                                messageinc="Incorrecto. Ingresa los comentarios." />
                                        </div>
                                    </div>
                                    <div className="separator separator-dashed mt-1 mb-2"></div>
                                    <div className="form-group row form-group-marginless justify-content-center">
                                        <div className="col-md-12">
                                            <Input requirevalidation={0} formeditado={formeditado} name="copy" value={form.copy}
                                                onChange={onChange} type="text" placeholder="COPY" messageinc="Incorrecto. Ingresa el copy."
                                                spellCheck={true} letterCase={false} as="textarea" rows="5" style={{ paddingLeft: "10px" }}
                                                customicon="d-none" />
                                        </div>
                                    </div>
                                </Col>
                                <Col md="12">
                                    <div className="form-group row form-group-marginless justify-content-center">
                                        <div className="col-md-6 d-flex justify-content-center align-self-center">
                                            <div>
                                                <div className="text-center font-weight-bolder mb-2">
                                                    {form.adjuntos.image.placeholder}
                                                </div>
                                                <ItemSlider multiple={true} items={form.adjuntos.image.files} item='image' 
                                                    handleChange={ title === 'Editar contenido' ?  null : handleChange} accept = 'image/*'/>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <div className="card-footer py-3 pr-1">
                                <div className='d-flex justify-content-between'>
                                    <div>
                                        {
                                            this.isActivePostingButton(evento) ?
                                                <Button icon='' className="btn-light-success font-weight-bold" only_icon="flaticon-facebook-letter-logo pr-0 mr-2"
                                                    text='POSTEAR EN FACEBOOK' onClick={onClickFacebookPost} />
                                                : ''
                                        }
                                    </div>
                                    <div>
                                        <Button icon='' className='btn-light-danger font-weight-bold mr-3' text="ELIMINAR"
                                            onClick={(e) => { deleteAlert('¿ESTÁS SEGURO QUE DESEAS ELIMINAR EL CONTENIDO ?', '¡NO PODRÁS REVERTIR ESTO!', () => deleteContenido(form.id)) }} />
                                        <Button icon='' className="btn-light-primary font-weight-bold mx-auto" text="ENVIAR"
                                            onClick={(e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-contenido') }} />
                                    </div>
                                </div>
                                {/* <div className="row mx-0 justify">
                                    <div className="col-lg-12 text-right pr-0 pb-0">
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
                                </div> */}
                            </div>
                        </Form>
                    </Tab.Pane>
                    <Tab.Pane eventKey="addcomments">
                        <ComentarioForm
                            addComentario={addComentario}
                            form={form}
                            onChange={onChange}
                            handleChange={handleChange}
                            color="primary"
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="comments">
                        <TimelineComments
                            comentariosObj = {evento}
                            col='7'
                            color='primary'
                        />
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
                                    <Col md="12">
                                        <div className="form-group row form-group-marginless justify-content-center">
                                            <div className="col-md-12 d-flex justify-content-center align-self-center">
                                                <div>
                                                    <div className="text-center font-weight-bolder mb-2">
                                                        {form.adjuntos.adjunto.placeholder}
                                                    </div>
                                                    <ItemSlider multiple={true} items={form.adjuntos.adjunto.files}
                                                        item='adjunto' handleChange={handleChangeSubmit} />
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md='12'>
                                        <div className="table-responsive mt-4">
                                            <table className="table table-vertical-center">
                                                <thead className="thead-light">
                                                    <tr className="text-left text-dark-75">
                                                        <th className="pl-2" style={{ minWidth: "150px" }}>Adjunto</th>
                                                        <th style={{ minWidth: "80px" }} className="text-center">Fecha</th>
                                                        <th className="pr-0 text-right" style={{ minWidth: "70px" }}></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        evento ?
                                                            evento.adjuntos ?
                                                                evento.adjuntos.length === 0 ?
                                                                    <tr className="text-center text-dark-75">
                                                                        <th className="pl-2" colSpan="3" >NO HAY ADJUNTOS</th>
                                                                    </tr>
                                                                    : ''
                                                                :
                                                                <tr className="text-center text-dark-75">
                                                                    <th className="pl-2" colSpan="3" >NO HAY ADJUNTOS</th>
                                                                </tr>
                                                            :
                                                            <tr className="text-center text-dark-75">
                                                                <th className="pl-2" colSpan="3" >NO HAY ADJUNTOS</th>
                                                            </tr>
                                                    }
                                                    {
                                                        evento ?
                                                            evento.adjuntos.map((adjunto, key) => {
                                                                let limiteInferior = (activePage - 1) * itemsPerPage
                                                                let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                                                if (adjunto.length < itemsPerPage || (key >= limiteInferior && key <= limiteSuperior))
                                                                    return (
                                                                        <FileItem item={adjunto} onClickDelete={onClickDelete} key={key} />
                                                                    )
                                                                return false
                                                            })
                                                            : ''
                                                    }
                                                </tbody>
                                            </table>
                                        </div >
                                        {
                                            evento ?
                                                evento.adjuntos ?
                                                    evento.adjuntos.length > itemsPerPage ?
                                                        <div className="d-flex justify-content-center mt-4">
                                                            <Pagination
                                                                itemClass="page-item"
                                                                /* linkClass="page-link" */
                                                                firstPageText='Primero'
                                                                lastPageText='Último'
                                                                activePage={activePage}
                                                                itemsCountPerPage={itemsPerPage}
                                                                totalItemsCount={evento.adjuntos.length}
                                                                pageRangeDisplayed={5}
                                                                onChange={this.onChangePage.bind(this)}
                                                                itemClassLast="d-none"
                                                                itemClassFirst="d-none"
                                                                prevPageText={<i className='ki ki-bold-arrow-back icon-xs' />}
                                                                nextPageText={<i className='ki ki-bold-arrow-next icon-xs' />}
                                                                linkClassPrev="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                                linkClassNext="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                                linkClass="btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 pagination"
                                                                activeLinkClass="btn btn-icon btn-sm border-0 btn-light btn-hover-primary active mr-2 my-1 pagination"
                                                            />
                                                        </div>
                                                        : ''
                                                    : ''
                                                : ''
                                        }
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