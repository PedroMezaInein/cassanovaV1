import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from '../../../components/layout/layout';
import axios from 'axios';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import esLocale from '@fullcalendar/core/locales/es';
import { forbiddenAccessAlert, errorAlert, createAlert, doneAlert, waitAlert } from '../../../functions/alert';
import { URL_ASSETS, URL_DEV } from '../../../constants';
import bootstrapPlugin from '@fullcalendar/bootstrap'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { setDateTableLG, setOptions } from '../../../functions/setters';
import { ItemSlider, Modal } from '../../../components/singles'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { AgregarVacacionesForm } from "../../../components/forms";
import { Button } from '../../../components/form-components'
import readXlsxFile from 'read-excel-file'

class Vacaciones extends Component {

    state = {
        formeditado: 0,
        modal: false,
        events: [],
        modal_add_vacaciones: false,
        modal_add_feriados: false,
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date(),
            empleado:'',
            adjuntos:{
                adjuntos:{
                    files: [],
                    value: '',
                    placeholder: 'Adjuntos'
                }
            }
        },
        espera: [],
        options:{
            empleados: []
        },
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        // const { match: { params: { action: action } } } = this.props
        // const { history, location: { state: state } } = this.props
        const vacaciones = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });

        this.getVacaciones()

    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true
        })
    }

    handleClose = () => {
        this.setState({
            ... this.state,
            modal: false
        })
    }

    setOptions = (name, array) => {
        const {options} = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }

    async getVacaciones() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'vacaciones/vacaciones', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empleados, vacaciones, vacaciones_espera, feriados } = response.data
                const { options } = this.state
                options['empleados'] = setOptions(empleados, 'nombre', 'id')

                let aux = []
                let mes = ''
                let dia = ''
                let año = new Date().getFullYear();
                empleados.map( (empleado, key) => {
                    mes = empleado.rfc.substr(6,2);
                    dia = empleado.rfc.substr(8,2);
                    for(let x = -5; x <= 5; x++){
                        aux.push({
                            title: empleado.nombre,
                            // shortName: empleado.nombre.split(" ")[0],
                            start: Number(Number(año) + Number(x)) + '-' + mes + '-' + dia,
                            end: Number(Number(año) + Number(x)) + '-' + mes + '-' + dia,
                            iconClass: 'fas fa-birthday-cake icon-md',
                            containerClass: 'cumpleaños'
                        })
                    }
                })
                vacaciones.map((vacacion) => {
                    aux.push({
                        shortName: "Vacaciones",
                        title: vacacion.empleado.nombre,
                        start: vacacion.fecha_inicio,
                        end: vacacion.fecha_fin,
                        iconClass: 'fas fa-umbrella-beach icon-md',
                        containerClass: 'vacaciones'
                    })
                })
                feriados.map((feriado) => {
                    aux.push({
                        shortName: "Feriados",
                        title: feriado.texto,
                        start: feriado.fecha,
                        end: feriado.fecha,
                        iconClass: 'fas fa-calendar-check icon-md',
                        containerClass: 'feriados'
                    })
                })


                this.setState({
                    ... this.state,
                    events: aux,
                    espera: vacaciones_espera
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

    async addVacationAxiosAdmin() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'vacaciones/admin', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Vacaciones aceptadas con éxito')
                this.getVacaciones()
                this.handleCloseAddVacaciones()
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

    async editVacacionesAxios(vacacion, estatus){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'vacaciones/'+vacacion.id, {estatus: estatus}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                
                if(estatus === 'Aceptadas'){
                    doneAlert('Vacaciones aceptadas con éxito')
                }
                if(estatus === 'Rechazadas'){
                    doneAlert('Vacaciones rechazadas con éxito')
                }

                this.getVacaciones();
                this.handleClose()

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

    async sendVacacionesAxios(feriados){
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'vacaciones/feriados', {feriados: feriados}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Días feriados agregados con éxito')
                this.handleCloseAddFeriados()
                this.getVacaciones()
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

    openModalAddVacaciones = () => {
        this.setState({
            ... this.state,
            modal_add_vacaciones: true,
            title: 'Agregar vacaciones',
            form: this.clearForm(),
            formeditado: 0
        })
    }

    openModalAddFeriados = () => {
        this.setState({
            ... this.state,
            modal_add_feriados: true,
            title: 'Agregar feriados',
            form: this.clearForm(),
            formeditado: 0
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    form[element] = new Date()
                    break;
                case 'adjuntos':
                    form[element] = {
                        adjuntos: {
                            files: [],
                            value: '',
                            placeholder: 'Adjuntos'
                        }
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }

    handleCloseAddVacaciones = () => {
        const { modal_add_vacaciones } = this.state
        this.setState({
            ... this.state,
            modal_add_vacaciones: !modal_add_vacaciones,
            title: 'Agregar vacaciones',
            form: this.clearForm()
        })
    }

    handleCloseAddFeriados = () => {
        const { modal_add_feriados } = this.state
        this.setState({
            ... this.state,
            modal_add_feriados: !modal_add_feriados,
            title: 'Agregar vacaciones',
            form: this.clearForm()
        })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
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
            ... this.state,
            form
        })
    }

    sendVacaciones = () => {
        const { form } = this.state
        let arreglo = []
        readXlsxFile(form.adjuntos.adjuntos.files[0].file).then((rows) => {
            rows.map((row, index)=>{
                if(index > 0)
                    arreglo.push({
                        fecha: row[0],
                        texto: row[1]
                    })
            })
            this.sendVacacionesAxios(arreglo)
        })
    }

    downloadPlantilla = () => {
        const link = document.createElement('a');
        const url = URL_ASSETS + '/storage/plantillas/feriados.xlsx'
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    render() {
        const { events, espera, modal, form, title, modal_add_vacaciones, formeditado, options, modal_add_feriados } = this.state
        return (
            <Layout active='rh'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">Vacaciones</h3>
                        </div>
                        <div className="card-toolbar">
                            <DropdownButton
                                title={
                                    <i className="ki ki-bold-more-ver p-0"></i>
                                }
                                id={`dropdown-button-drop-left`}
                                drop={'left'}
                            >
                                {
                                    espera.length ?
                                        <Dropdown.Item onClick={this.openModal}>Mostrar solicitudes</Dropdown.Item>
                                        : ''
                                }
                                <Dropdown.Item onClick={this.openModalAddVacaciones}>Agregar vacaciones</Dropdown.Item>
                                <Dropdown.Item onClick={this.openModalAddFeriados}>Agregar feriados</Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <FullCalendar
                            className={"prueba"}
                            locale={esLocale}
                            plugins={[dayGridPlugin, interactionPlugin,
                                bootstrapPlugin
                            ]}
                            initialView="dayGridMonth"
                            weekends={true}
                            events={events}
                            dateClick={this.handleDateClick}
                            eventContent={renderEventContent}
                            firstDay={1}
                            // headerToolbar=  {{
                            //     left: 'prev,next today',
                            //     center: 'title',
                            //     right: 'dayGridMonth' 

                            // }}
                            themeSystem='bootstrap'
                        />
                    </Card.Body>
                </Card>
                <Modal size="xl" title="Solicitudes de vacaciones" show={modal} handleClose={this.handleClose} >
                    {
                        espera.map((empleado, key) => {
                            return (
                                <div className="tab-content mt-4" key={key}>
                                    <div className="table-responsive">
                                        <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
                                            <thead>
                                                <tr className="text-left">
                                                    <th style={{ minWidth: "160px" }} className="pl-7">
                                                        <span className="text-dark-75">Empleado</span>
                                                    </th>
                                                    <th style={{ minWidth: "100px" }}>
                                                        <span className="text-dark-75">Fecha de inicio</span>
                                                    </th>
                                                    <th style={{ minWidth: "100px" }}>
                                                        <span className="text-dark-75">Fecha final</span>
                                                    </th>
                                                    <th style={{ minWidth: "100px" }}>
                                                        <span className="text-dark-75">Estatus</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            {
                                                empleado.vacaciones.map((vacacion, key) => {
                                                    return (
                                                        <tbody key={key}>
                                                            <tr>
                                                                <td className="pl-0 py-8">
                                                                    <div className="d-flex align-items-center">
                                                                        <div>
                                                                            <div className="mb-1 font-size-lg">{empleado.nombre}</div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <span className="font-size-lg">{setDateTableLG(vacacion.fecha_inicio)}</span>
                                                                </td>
                                                                <td>
                                                                    <span className="font-size-lg">{setDateTableLG(vacacion.fecha_fin)}</span>
                                                                </td>
                                                                <td className="pr-0">
                                                                    <a className="btn btn-icon btn-light-success success2 btn-sm mr-2 ml-auto" onClick = { (e) =>  { 
                                                                        e.preventDefault(); 
                                                                        createAlert('¿Estás seguro que deseas aceptar las vacaciones?', '', 
                                                                        () => this.editVacacionesAxios(vacacion, 'Aceptadas'))
                                                                    }}  
                                                                    >
                                                                        <i className="flaticon2-check-mark icon-sm"></i>
                                                                    </a>
                                                                
                                                                    <a className="btn btn-icon  btn-light-danger btn-sm pulse pulse-danger"onClick = { (e) =>  { 
                                                                        e.preventDefault(); 
                                                                        createAlert('¿Estás seguro que deseas rechazar las vacaciones?', '', 
                                                                        () => this.editVacacionesAxios(vacacion, 'Rechazadas'))
                                                                    }}
                                                                    >
                                                                        <i className="flaticon2-cross icon-sm"></i>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    )
                                                })
                                            }
                                        </table>
                                    </div>
                                </div>
                            )
                        })
                    }
                </Modal>
                <Modal size={"lg"} title={title} show={modal_add_vacaciones} handleClose={this.handleCloseAddVacaciones}>
                    <AgregarVacacionesForm
                            formeditado={formeditado}
                            form={form}
                            onChange={this.onChange}
                            options = { options }
                            onSubmit={(e) => { e.preventDefault(); waitAlert(); this.addVacationAxiosAdmin() }}
                        />
                </Modal>
                <Modal size = 'lg' title = { title } show = { modal_add_feriados } handleClose = { this.handleCloseAddFeriados }>
                    <div className="d-flex m-2 justify-content-end">
                        <Button
                            onClick = { () => { this.downloadPlantilla() } }
                            className = "btn btn-icon btn-light-primary btn-sm mr-2 ml-auto"
                            only_icon = "fas fa-file-excel icon-md"
                            tooltip = { { text: 'Descargar plantilla' } }
                            />
                    </div>
                    <div>
                        <ItemSlider items = { form.adjuntos.adjuntos.files } item = 'adjuntos' 
                            multiple = { false } handleChange = { this.handleChange }
                            accept = '.xlsx, .xls, .csv'/>
                    </div>
                    {
                        form.adjuntos.adjuntos.files.length > 0 ?
                            <div className="d-flex justify-content-center">
                                <Button icon='' className="btn btn-primary m-2"
                                    onClick = {
                                        (e) => {
                                            e.preventDefault();
                                            waitAlert();
                                            this.sendVacaciones();
                                        }
                                    }
                                    text="ENVIAR" 
                                    />
                            </div>
                        : ''
                    }
                </Modal>
            </Layout>
        );
    }
}

function renderEventContent(eventInfo) {
    return (
        <OverlayTrigger overlay={<Tooltip>{eventInfo.event.title}</Tooltip>}>
            <div className={eventInfo.event._def.extendedProps.containerClass + ' evento'}>
                <i className={eventInfo.event._def.extendedProps.iconClass + " kt-font-boldest mr-3"}></i>
                <span>{eventInfo.event.title}</span>
            </div>
        </OverlayTrigger>


    )
}
const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Vacaciones)