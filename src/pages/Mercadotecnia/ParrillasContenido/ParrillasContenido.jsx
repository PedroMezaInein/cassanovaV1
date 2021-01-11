import React, { Component } from 'react';
import axios from 'axios';
import { URL_DEV } from '../../../constants';
import moment from 'moment'
import { doneAlert, errorAlert, forbiddenAccessAlert, waitAlert } from '../../../functions/alert';
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
import { setOptions } from '../../../functions/setters';
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
            typeContent:"contenido",
            title:'',
            copy:'',
            cta:'',
            comments:'',
            empresa: '',
            hora: '09',
            minuto: '00',
            fecha: ''
        },
        options:{
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
        await axios.get(URL_DEV + 'mercadotecnia/parrilla-contenido', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { options } = this.state
                const { empresas, redes } = response.data

                options.empresas = setOptions(empresas, 'name', 'id')
                options.socialNetworks  = setOptions(redes, 'nombre', 'id')

                this.setState({
                    ... this.state,
                    options
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

    sendParrillaAxios = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'mercadotecnia/parrilla-contenido', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Parrilla guardad con éxito');
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

    openModal = () => {
        const { modal} = this.state
        modal.form =true
        this.setState({
            ...this.state,
            modal,
            title: 'Agregar contenido',
            form: this.clearForm()
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

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch(element){
                case 'typeContent':
                    form[element] =  "contenido";
                    break;
                case 'hora':
                    form[element] = "09";
                    break;
                case 'minuto':
                    form[element] = "00";
                    break;
                default:
                    form[element] = '';
                    break;
            }
        })
        return form
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
                        onSubmit = { this.sendParrillaAxios }
                    />
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Calendario)