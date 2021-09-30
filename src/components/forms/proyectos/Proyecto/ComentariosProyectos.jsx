import React, { Component } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV } from '../../../../constants'
import { Card, DropdownButton, Dropdown } from 'react-bootstrap'
import { waitAlert, doneAlert, printResponseErrorAlert, errorAlert } from '../../../../functions/alert'
import { setNaviIcon } from '../../../../functions/setters'
import { ComentarioForm, TimelineComments } from '../../../forms'

class ComentariosProyectos extends Component {
    state = {
        activeComment: 'comments',
        proyecto: '',
        form: {
            comentario:'',
            adjuntos: {
                adjunto_comentario: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
            }
        }
    }
    componentDidMount() {
        const { proyecto } = this.props
        this.getComments(proyecto)
    }
    onClickComments = (type) => {
        this.setState({
            ...this.state,
            activeComment: type
        })
    }
    getTitle = () => {
        const { activeComment } = this.state
        switch (activeComment) {
            case 'new':
                return 'AGREGAR COMENTARIO'
            case 'comments':
                return 'MOSTRAR COMENTARIOS'
            default:
                return ''
        }
    }
    /* -------------------------------------------------------------------------- */
    /*                                GET COMMENTS                                */
    /* -------------------------------------------------------------------------- */
    getComments = async (proyecto) => {
        const { at } = this.props
        waitAlert()
        await axios.get(`${URL_DEV}v2/proyectos/proyectos/proyecto/${proyecto.id}/comentarios`, { headers: { Authorization: `Bearer ${at}` } }).then(
            (response) => {
                const { proyecto } = response.data
                let { activeComment } = this.state
                if (proyecto.comentarios.length === 0) {
                    activeComment = 'new'
                }
                this.setState({
                    ...this.state,
                    proyecto: proyecto,
                    activeComment
                })
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    handleChange = (files, item) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    addComentarioAxios = async () => {
        waitAlert()
        const { at } = this.props
        const { form, proyecto } = this.state
        const data = new FormData();
        form.adjuntos.adjunto_comentario.files.map(( adjunto) => {
            data.append(`files_name_adjunto[]`, adjunto.name)
            data.append(`files_adjunto[]`, adjunto.file)
            return ''
        })
        data.append(`comentario`, form.comentario)
        await axios.post(`${URL_DEV}v2/proyectos/proyectos/proyecto/${proyecto.id}/comentarios`, data, { headers: {'Content-Type': 'multipart/form-data', Authorization: `Bearer ${at}` } }).then(
            (response) => {
                doneAlert('Comentario agregado con éxito');
                const { proyecto } = response.data
                const { form } = this.state
                form.comentario = ''
                form.adjuntos.adjunto_comentario = {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
                this.setState({ ...this.state, form, proyecto: proyecto, activeComment: 'comments'})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    render() {
        const { proyecto, activeComment, form } = this.state
        const { comentarioId } = this.props
        return (
            <>
                <Card className="card-custom gutter-b">
                    <Card.Header className="border-0 align-items-center pt-8 pt-md-0">
                        <div className="font-weight-bold font-size-h4 text-dark">{this.getTitle()}</div>
                        {
                            proyecto ?
                                proyecto.comentarios ?
                                    proyecto.comentarios.length > 0 ?
                                        <div className="card-toolbar toolbar-dropdown">
                                            <DropdownButton menualign="right" title={<span className="d-flex">OPCIONES <i className="las la-angle-down icon-md p-0 ml-2"></i></span>} id='dropdown-proyectos-light-primary' >
                                                {
                                                    activeComment === 'comments' ?
                                                        <Dropdown.Item className="text-hover-success dropdown-success" onClick={() => { this.onClickComments('new') }}>
                                                            {setNaviIcon(`las la-comment icon-lg`, 'AGREGAR COMENTARIO')}
                                                        </Dropdown.Item>
                                                        : <></>
                                                }
                                                {
                                                    activeComment === 'new' && proyecto.comentarios.length > 0 ?
                                                        <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => { this.onClickComments('comments') }}>
                                                            {setNaviIcon(`las la-comments icon-lg`, 'MOSTRAR COMENTARIOS')}
                                                        </Dropdown.Item>
                                                        : <></>
                                                }
                                            </DropdownButton>
                                        </div>
                                        : ''
                                    : ''
                                : ''
                        }
                    </Card.Header>
                    <Card.Body>
                        {
                            activeComment === 'comments' ?
                                <TimelineComments
                                    comentariosObj={proyecto}
                                    col='8'
                                    color='primary2'
                                    comentarioId = { comentarioId }
                                />
                                : activeComment === 'new' ?
                                    <ComentarioForm
                                        addComentario={this.addComentarioAxios}
                                        form={form}
                                        onChange={this.onChange}
                                        handleChange={this.handleChange}
                                        color="primary2"
                                    />
                                :''
                        }
                    </Card.Body>
                </Card>
            </>
        )
    }
}

export default ComentariosProyectos