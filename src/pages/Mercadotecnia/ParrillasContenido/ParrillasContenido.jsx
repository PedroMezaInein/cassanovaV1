import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import { URL_DEV } from '../../../constants'
import { doneAlert, errorAlert, printResponseErrorAlert, questionAlert, waitAlert, deleteAlert, createAlertSA2 } from '../../../functions/alert'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { Card, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import bootstrapPlugin from '@fullcalendar/bootstrap'
import esLocale from '@fullcalendar/core/locales/es'
import { Button } from '../../../components/form-components'
import { Modal } from '../../../components/singles'
import ParrillaContenidoForm from '../../../components/forms/mercadotecnia/ParrillaContenidoForm'
import { setOptions } from '../../../functions/setters'
import Swal from 'sweetalert2'

class ParrillasContenido extends Component {
    state = {
        content: [],
        formeditado: 0,
        title: '',
        activeKeyModal: 'form',
        modal: {
            form: false
        },
        post: {},
        form: {
            socialNetwork: '',
            socialNetworks: [],
            post: '',
            typeContent: "contenido",
            title: '',
            copy: '',
            cta: '',
            comments: '',
            empresa: '',
            hora: '09',
            minuto: '00',
            fecha: '',
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                },
                adjunto_comentario: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                },
                image: {
                    value: '',
                    placeholder: 'Imagen',
                    files: []
                },
            }
        },
        options: {
            socialNetworks: [],
            typeContents:
                [
                    {
                        name: "CONTENIDO", value: "contenido", label: "CONTENIDO"
                    },
                    {
                        name: "HISTORIA", value: "historia", label: "HISTORIA"
                    }
                ],
            empresas: []
        },
        data: {
            empresas: []
        },
        empresa: '',
        evento: ''
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getContentAxios()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = params.get("id")
            if (id)
                this.getParrillaAxios(id)
        }
    }

    getParrillaAxios = async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}mercadotecnia/parrilla-contenido/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { parrilla, post } = response.data
                const { form, modal } = this.state

                modal.form = true

                form.copy = parrilla.copy
                form.cta = parrilla.cta
                form.comments = parrilla.imagen
                form.typeContent = parrilla.tipo_contenido
                if (parrilla.red) {
                    form.socialNetwork = parrilla.subarea_id.toString()
                    form.socialNetworks = [
                        {
                            name: parrilla.red.nombre,
                            value: parrilla.red.id.toString(),
                            label: parrilla.red.nombre
                        }
                    ]
                }
                form.empresa = parrilla.empresa_id.toString()
                form.title = parrilla.titulo

                let aux = []
                aux = parrilla.hora.split(":")
                if (aux.length === 3) {
                    form.hora = aux[0].toString();
                    form.minuto = aux[1].toString();
                }

                form.fecha = new Date(moment(parrilla.fecha))

                if (parrilla.post_id) {
                    let aux = parrilla.post_id.split("_");
                    if (aux.length > 1) {
                        if (aux[1].length)
                            form.post = aux[1];
                    }
                }

                if (parrilla.imagenes) {
                    form.adjuntos.image.files = [];
                    parrilla.imagenes.forEach(element => {
                        form.adjuntos.image.files.push(element)
                    });
                }

                this.setState({
                    ...this.state,
                    form,
                    modal,
                    formeditado: 1,
                    activeKeyModal: "form",
                    evento: parrilla,
                    title: 'Editar contenido',
                    post: post
                })
            },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async getContentAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'mercadotecnia/parrilla-contenido', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { options, data, empresa } = this.state
                let { evento } = this.state
                const { empresas, redes } = response.data

                data.empresas = empresas

                options.empresas = setOptions(empresas, 'name', 'id')
                options.socialNetworks = setOptions(redes, 'nombre', 'id')

                let bandera = false
                let aux = []

                if (empresa === '') {
                    empresas.map((item) => {
                        if (item.parrillas.length > 0 && bandera === false) {
                            bandera = item;
                        }
                        return ''
                    })
                } else {
                    empresas.map((item) => {
                        if (item.id === empresa.id) {
                            bandera = item;
                            item.parrillas.map((parrilla) => {
                                if (parrilla.id === evento.id) {
                                    evento = parrilla
                                }
                                return ''
                            })
                        }
                        return ''
                    })
                }
                if (bandera !== false) {
                    bandera.parrillas.map((parrilla) => {
                        aux.push(
                            {
                                title: parrilla.titulo,
                                start: parrilla.fecha,
                                end: parrilla.fecha,
                                evento: parrilla
                            }
                        )
                        return ''
                    })
                }

                this.setState({
                    ...this.state,
                    options,
                    data,
                    empresa: bandera === false ? '' : bandera,
                    content: aux,
                    evento
                })
            },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    sendParrillaAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    break;
                case 'socialNetworks':
                    form.socialNetworks.map((dato) => {
                        data.append(`socialNetworks[]`, dato.value)
                        return ''
                    })
                    break;
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break;
                default:
                    data.append(element, form[element]);
                    break
            }
            return false
        })
        if (form.adjuntos.image.value !== '') {
            form.adjuntos.image.files.forEach(element => {
                data.append(`files_image[]`, element.file)
            });
        }
        await axios.post(`${URL_DEV}v2/mercadotecnia/parrilla-contenido`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Parrilla guardado con éxito');
                const { modal } = this.state
                modal.form = false
                this.setState({ ...this.state, modal })
                this.getContentAxios()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    updateParrillaAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, evento } = this.state
        await axios.put(URL_DEV + 'mercadotecnia/parrilla-contenido/' + evento.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Parrilla editada con éxito');
                const { modal } = this.state
                modal.form = false
                this.setState({
                    ...this.state,
                    modal
                })
                this.getContentAxios()
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    addComentarioAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, evento } = this.state
        const data = new FormData();

        form.adjuntos.adjunto_comentario.files.map((adjunto) => {
            data.append(`files_name_adjunto[]`, adjunto.name)
            data.append(`files_adjunto[]`, adjunto.file)
            return ''
        })

        data.append(`comentario`, form.comentario)

        await axios.post(URL_DEV + 'mercadotecnia/parrilla-contenido/comentario/' + evento.id, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Comentario agregado con éxito');
                const { form } = this.state
                form.comentario = ''
                form.adjuntos.adjunto_comentario = {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
                this.setState({
                    ...this.state,
                    form
                })
                this.getContentAxios()
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    sendAdjuntoAxios = async (files, item) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { evento } = this.state
        const data = new FormData();

        for (var i = 0; i < files.length; i++) {
            data.append(`files_name_adjunto[]`, files[i].name)
            data.append(`files_adjunto[]`, files[i])
        }

        await axios.post(URL_DEV + 'mercadotecnia/parrilla-contenido/adjunto/' + evento.id, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Adjunto agregado con éxito');
                const { form } = this.state
                form.adjuntos.adjunto = {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }

                this.setState({
                    ...this.state,
                    form
                })
                this.getContentAxios()
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async deleteContenidoAxios() {
        const { evento } = this.state
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'mercadotecnia/parrilla-contenido/' + evento.id, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { modal } = this.state
                modal.form = false
                doneAlert('Adjunto eliminado con éxito.')
                this.setState({
                    ...this.state,
                    evento: '',
                    modal
                })
                this.getContentAxios()
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    postInFacebookAxios = async () => {
        waitAlert()
        const { evento } = this.state
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}v2/mercadotecnia/parrilla-contenido/${evento.id}/facebook`, {}, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { evento } = response.data
                doneAlert('Contenido publicado con éxito.')
                this.setState({ ...this.state, evento: evento })
                this.getContentAxios();
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    onSumitParrilla = () => {
        const { title } = this.state
        if (title === 'Editar contenido')
            this.updateParrillaAxios()
        else
            this.sendParrillaAxios()
    }

    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            ...this.state,
            modal,
            title: 'Agregar contenido',
            form: this.clearForm(),
            activeKeyModal: 'form'
        })
    }

    openModalFacebookPost = () => {
        const { evento } = this.state
        createAlertSA2(
            '¿Estás seguro?',
            `Postearás ${evento.titulo} en la página de ${evento.empresa.name}`,
            () => { this.postInFacebookAxios() }
        )
    }

    handleCloseForm = () => {
        const { modal } = this.state
        modal.form = false
        this.setState({
            ...this.state,
            modal,
            empresa: '',
            form: this.clearForm(),
            evento: '',
            post: {}
        })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    onChangeOptions = (e, arreglo) => {
        const { value } = e.target
        const { form, options } = this.state
        let auxArray = form[arreglo]
        let aux = []
        options[arreglo].find(function (_aux) {
            if (_aux.value.toString() === value.toString())
                auxArray.push(_aux)
            else
                aux.push(_aux)
            return false
        })
        form[arreglo] = auxArray
        this.setState({ ...this.state, form, options })
    }

    deleteOption = (element, array) => {
        let { form } = this.state
        let auxForm = []
        form[array].map((elemento, key) => {
            if (element !== elemento)
                auxForm.push(elemento)
            return false
        })
        form[array] = auxForm
        this.setState({ ...this.state, form })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'typeContent':
                    form[element] = "contenido";
                    break;
                case 'socialNetworks':
                    form[element] = []
                    break;
                case 'hora':
                    form[element] = "09";
                    break;
                case 'minuto':
                    form[element] = "00";
                    break;
                case 'adjuntos':
                    form[element] = {
                        adjunto: {
                            value: '',
                            placeholder: 'Adjunto',
                            files: []
                        },
                        adjunto_comentario: {
                            value: '',
                            placeholder: 'Adjunto',
                            files: []
                        },
                        image: {
                            value: '',
                            placeholder: 'Imagen',
                            files: []
                        }
                    }
                    break;
                default:
                    form[element] = '';
                    break;
            }
            return ''
        })
        return form
    }

    handleClickEmpresa = item => {

        let aux = []

        item.parrillas.map((parrilla) => {
            aux.push({
                title: parrilla.titulo,
                start: parrilla.fecha,
                end: parrilla.fecha,
                evento: parrilla
            })
            return ''
        })

        this.setState({
            ...this.state,
            empresa: item,
            content: aux
        })
    }

    getNameFromUrl = url => {
        let aux = url.split('/');
        if (aux.length) {
            return aux[aux.length - 1];
        }
        return 'imagen.jpg'
    }

    clickEvent = (evento) => {

        const { evento: event } = evento.event._def.extendedProps
        const { form, modal } = this.state

        modal.form = true

        form.copy = event.copy
        form.cta = event.cta
        form.comments = event.imagen
        form.typeContent = event.tipo_contenido
        form.socialNetwork = event.subarea_id.toString()
        form.empresa = event.empresa_id.toString()
        form.title = event.titulo

        let aux = []
        aux = event.hora.split(":")
        if (aux.length === 3) {
            form.hora = aux[0].toString();
            form.minuto = aux[1].toString();
        }

        form.fecha = new Date(moment(event.fecha))

        if (event.imagen_file) {
            form.adjuntos.image.files = [
                {
                    id: event.id,
                    name: this.getNameFromUrl(event.imagen_file),
                    url: event.imagen_file
                }
            ]
        }

        this.setState({
            ...this.state,
            form,
            modal,
            formeditado: 1,
            activeKeyModal: "addcomments",
            evento: event,
            title: 'Editar contenido'
        })
    }

    onChangeModalTab = key => {
        this.setState({
            ...this.state,
            activeKeyModal: key
        })
    }

    renderEventContent = (eventInfo) => {
        const { evento: event } = eventInfo.event._def.extendedProps
        let aux = ''
        if (event.red)
            if (event.red.nombre)
                aux = event.red.nombre.toLowerCase()
        let auxHora = ''
        if (event.hora) {
            auxHora = event.hora.split(':')
            if (auxHora.length === 3) auxHora = auxHora[0] + ':' + auxHora[1]
            else auxHora = ''
        }
        return (
            <div className='pb-2'>
                <OverlayTrigger rootClose overlay={
                    <Tooltip>
                        <span>
                            <span>
                                {eventInfo.event.title}
                            </span>
                            <div className="mt-3 font-weight-bolder">
                                <div>
                                    {event.tipo_contenido.toUpperCase()}<span> - {auxHora}</span>
                                </div>
                            </div>
                        </span>
                    </Tooltip>}>
                    <div className="d-flex justify-content-center align-items-center position-relative"
                        onClick={(e) => { e.preventDefault(); this.getParrillaAxios(eventInfo.event._def.extendedProps.evento.id) }}>
                        <span className={'btn btn-icon btn-sm ml-2 btn-light-' + aux}>
                            <i className={'line-height-0 socicon-' + aux}></i>
                        </span>
                        {
                            eventInfo.event._def.extendedProps.evento.uploaded === 1 ?
                                <div className='circle-notificacion bg-success position-absolute'></div>
                                :
                                eventInfo.event._def.extendedProps.evento.uploaded === 0 ?
                                    <div className='circle-notificacion bg-danger position-absolute'></div>
                                    : ''
                        }
                    </div>
                </OverlayTrigger>
            </div>
        )
    }

    handleChangeSubmit = (files, item) => {
        questionAlert('¿DESEAS ADJUNTAR EL ARCHIVO?', '', () => this.sendAdjuntoAxios(files, item))
    }

    onClickDelete = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', element.name, () => this.deleteAdjunto(element.id))
    }
    deleteAdjunto = async (id) => {
        const { access_token } = this.props.authUser
        const { empresa, activeFolder } = this.state
        await axios.delete(URL_DEV + 'mercadotecnia/material-clientes/empresas/' + empresa.id + '/caso-exito/' + activeFolder.id + '/adjuntos/' + id,
            { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
                (response) => {
                    const { empresa, empresas } = response.data
                    const { data } = this.state
                    data.empresas = empresas
                    doneAlert('Archivos eliminado con éxito')
                    this.setState({
                        ...this.state,
                        empresa: empresa,
                        data
                    })
                },
                (error) => {
                    printResponseErrorAlert(error)
                }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
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

    deleteContenido = (id) => {
        this.deleteContenidoAxios(id)
    }

    render() {

        const { modal, title, form, formeditado, options, content, data, empresa, activeKeyModal, evento, post } = this.state

        return (
            <Layout active={"mercadotecnia"} {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="d-flex align-items-center">
                            <h3 className="card-title align-items-start flex-column">
                                <span className="font-weight-bolder text-dark">
                                    Calendario de contenido
                                </span>
                            </h3>
                        </div>
                        <div className="card-toolbar">
                            <Button
                                icon=''
                                className="btn btn-light-success btn-sm font-weight-bold"
                                only_icon="flaticon2-writing pr-0 mr-2"
                                text='AGREGAR CONTENIDO'
                                onClick={this.openModal}
                            />
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className='parrilla'>
                            <div className='d-flex justify-content-end mb-4'>
                                <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0"
                                    activeKey={empresa.id} >
                                    {
                                        data.empresas.map((item, key) => {
                                            return (
                                                <Nav.Item key={key} onClick={(e) => { e.preventDefault(); this.handleClickEmpresa(item) }} >
                                                    <Nav.Link eventKey={item.id}>
                                                        {item.name}
                                                    </Nav.Link>
                                                </Nav.Item>
                                            )
                                        })
                                    }
                                </Nav>
                            </div>
                            <FullCalendar locale={esLocale} plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]} eventContent={this.renderEventContent}
                                initialView="dayGridMonth" firstDay={1} themeSystem='bootstrap' events={content} />
                        </div>
                    </Card.Body>
                </Card>
                <Modal size="xl" title={title} show={modal.form} handleClose={this.handleCloseForm}>
                    <ParrillaContenidoForm form={form} formeditado={formeditado} title={title}
                        options={options} onChange={this.onChange} onSubmit={this.onSumitParrilla}
                        onChangeModalTab={this.onChangeModalTab} activeKey={activeKeyModal}
                        addComentario={this.addComentarioAxios} evento={evento} handleChange={this.handleChange}
                        deleteContenido={this.deleteContenido} handleChangeSubmit={this.handleChangeSubmit} onClickDelete={this.onClickDelete}
                        onClickFacebookPost={this.openModalFacebookPost} post={post}
                        onChangeOptions={this.onChangeOptions} deleteOption={this.deleteOption} />
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(ParrillasContenido)