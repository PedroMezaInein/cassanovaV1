import React, { Component } from 'react';
import axios from 'axios';
import { URL_DEV } from '../../../constants';
import moment from 'moment'
import { errorAlert, forbiddenAccessAlert } from '../../../functions/alert';
import { connect } from 'react-redux';
import Layout from '../../../components/layout/layout';
import { Card } from 'react-bootstrap'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from '@fullcalendar/bootstrap'
import esLocale from '@fullcalendar/core/locales/es';
import { Button } from '../../../components/form-components'
import { Modal } from '../../../components/singles'
import ParrillaContenidoForm from '../../../components/forms/mercadotecnia/ParrillaContenidoForm';
const $ = require('jquery');

class Calendario extends Component {
    state = {
        content:[],
        formeditado:0,
        title:'',
        modal:{
            form: false
        },
        form:{
            socialNetwork:'',
            typeConent:'',
            title:'',
            copy:'',
            cta:'',
            comments:'',
        },
        options:{
            socialNetworks:
            [
                {
                    name: "FACEBOOK", value: "1", label: "FACEBOOK"
                },
                {
                    name: "INSTAGRAM", value: "2", label: "INSTAGRAM"
                },
                {
                    name: "PINTEREST", value: "3", label: "PINTEREST"
                },
                {
                    name: "LINKEDIN", value: "4", label: "LINKEDIN"
                },
            ],
            typeContents:
            [
                {
                    name: "CONTENIDO", value: "1", label: "CONTENIDO"
                },
                {
                    name: "HISTORIA", value: "2", label: "HISTORIA"
                }
            ],
        }
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
        await axios.get(URL_DEV + 'content', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                this.setState({
                    ... this.state,
                })
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
    openModal = () => {
        const { modal} = this.state
        modal.form =true
        this.setState({
            ...this.state,
            modal,
            title: 'Agregar contenido',
        })
    }

    handleCloseForm = () => {
        const { modal} = this.state
        modal.form =false
        this.setState({
            ...this.state,
            modal,
            empleado: ''
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

    render() {
        const { modal, title, form, formeditado, options, content} = this.state
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
                        <FullCalendar
                            locale={esLocale}
                            plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
                            initialView="dayGridMonth"
                            weekends={false}
                            firstDay={1}
                            themeSystem='bootstrap'
                            events = { content }
                        />
                    </Card.Body>
                </Card>
                <Modal size="xl" title={title} show={modal.form} handleClose={this.handleCloseForm}>
                    <ParrillaContenidoForm
                        form={form}
                        formeditado={formeditado}
                        options={options}
                        onChange={this.onChange}
                    />
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Calendario)