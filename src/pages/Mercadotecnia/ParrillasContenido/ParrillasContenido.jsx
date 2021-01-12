import React, { Component } from 'react';
import axios from 'axios';
import { URL_DEV } from '../../../constants';
import { doneAlert, errorAlert, forbiddenAccessAlert, waitAlert } from '../../../functions/alert';
import { connect } from 'react-redux';
import Layout from '../../../components/layout/layout';
import { Card, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from '@fullcalendar/bootstrap'
import esLocale from '@fullcalendar/core/locales/es';
import { Button } from '../../../components/form-components'
import { Modal } from '../../../components/singles'
import ParrillaContenidoForm from '../../../components/forms/mercadotecnia/ParrillaContenidoForm';
import { setOptions } from '../../../functions/setters';
const $ = require('jquery');
class Calendario extends Component {
    state = {
        content: [],
        formeditado: 0,
        title: '',
        activeKeyModal: 'form',
        modal: {
            form: false
        },
        form: {
            socialNetwork: '',
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
                let aux2 = ''

                if (empresa === '') {
                    empresas.map((item) => {
                        if (item.parrillas.length > 0 && bandera === false) {
                            bandera = item;
                        }
                    })
                } else {
                    empresas.map((item) => {
                        if (item.id === empresa.id) {
                            bandera = item;
                            item.parrillas.map((parrilla) => {
                                if (parrilla.id === evento.id) {
                                    evento = parrilla
                                }
                            })
                        }
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
                    })
                }

                // console.log(evento, 'evento')

                this.setState({
                    ... this.state,
                    options,
                    data,
                    empresa: bandera === false ? '' : bandera,
                    content: aux,
                    evento
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    sendParrillaAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'mercadotecnia/parrilla-contenido', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Parrilla guardad con éxito');
                const { modal } = this.state
                modal.form = false
                this.setState({
                    ...this.state,
                    modal
                })
                this.getContentAxios()
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    updateParrillaAxios = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, evento } = this.state
        await axios.put(URL_DEV + 'mercadotecnia/parrilla-contenido/' + evento.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Parrilla editada con éxito');
                const { modal} = this.state
                modal.form = false
                this.setState({
                    ...this.state,
                    modal
                })
                this.getContentAxios()
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addComentarioAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, evento } = this.state
        await axios.post(URL_DEV + 'mercadotecnia/parrilla-contenido/comentario/' + evento.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Comentario agregado con éxito');
                const { form } = this.state
                form.comentario = ''
                this.setState({
                    ...this.state,
                    form
                })
                this.getContentAxios()
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    onSumitParrilla = () => {
        const { title } = this.state
        if( title === 'Editar contenido' )
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

    handleCloseForm = () => {
        const { modal } = this.state
        modal.form = false
        this.setState({
            ...this.state,
            modal,
            empresa: '',
            form: this.clearForm(),
            evento: ''
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

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'typeContent':
                    form[element] = "contenido";
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
                        }
                    }
                    break;
                default:
                    form[element] = '';
                    break;
            }
        })
        return form
    }

    handleClickEmpresa = item => {

        let aux = []

        item.parrillas.map((parrilla) => {
            aux.push(
                {
                    title: parrilla.titulo,
                    start: parrilla.fecha,
                    end: parrilla.fecha,
                    evento: parrilla
                }
            )
        })

        this.setState({
            ...this.state,
            empresa: item,
            content: aux
        })
    }

    clickEvent = (evento) => {
        const { evento: event } = evento.event._def.extendedProps
        const { form, modal } = this.state

        modal.form = true

        form.copy = event.copy
        form.cta = event.cta
        form.comments = event.imagen
        form.typeContent = event.tipo_contenido
        form.socialNetwork = event.red_social_id.toString()
        form.empresa = event.empresa_id.toString()
        form.title = event.titulo

        let aux = []
        aux = event.hora.split(":")
        if (aux.length === 3) {
            form.hora = aux[0].toString();
            form.minuto = aux[1].toString();
        }
        
        form.fecha = new Date(moment(event.fecha))

        this.setState({
            ...this.state,
            form,
            modal,
            formeditado: 1,
            activeKeyModal: "comments",
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
        // console.log(event)
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
            <OverlayTrigger overlay={
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
                <div className="d-flex justify-content-center align-items-center" onClick={(e) => { e.preventDefault(); this.clickEvent(eventInfo) }}>
                    <span className={'btn btn-icon btn-sm ml-2 btn-light-' + aux}>
                        <i className={'line-height-0 socicon-' + aux}></i>
                    </span>
                </div>
            </OverlayTrigger>
        )
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
    async deleteContenidoAxios(id) {
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'mercadotecnia/parrillas-de-contenido/' + id, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                this.setState({
                    ...this.state,
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    render() {

        const { modal, title, form, formeditado, options, content, data, empresa, activeKeyModal, evento } = this.state

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
                                initialView="dayGridMonth" weekends={false} firstDay={1} themeSystem='bootstrap' events={content} />
                        </div>

                    </Card.Body>
                </Card>
                <Modal size="xl" title={title} show={modal.form} handleClose={this.handleCloseForm}>
                    <ParrillaContenidoForm form={form} formeditado={formeditado}
                        options={options} onChange={this.onChange} onSubmit={this.sendParrillaAxios}
                        onChangeModalTab={this.onChangeModalTab} activeKey={activeKeyModal}
                        addComentario={this.addComentarioAxios} evento={evento} handleChange={this.handleChange} 
                        deleteContenido={this.deleteContenido}
                    />
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Calendario)