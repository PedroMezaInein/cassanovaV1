import { connect } from 'react-redux';
import React, { Component } from 'react'
import Layout from '../../../../components/layout/layout'
import { Col, Row, Card, Tab, Nav, Dropdown, Form } from 'react-bootstrap'
import { Button, InputGray, InputPhoneGray } from '../../../../components/form-components';
import { TEL, URL_DEV, EMAIL } from '../../../../constants'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../functions/routers"
import { setOptions, setDateTableLG } from '../../../../functions/setters';
import axios from 'axios'
import { doneAlert, errorAlert, forbiddenAccessAlert, waitAlert, questionAlert2, questionAlert } from '../../../../functions/alert';
import swal from 'sweetalert';
import { HistorialContactoForm, AgendarCitaForm, PresupuestoDiseñoCRMForm } from '../../../../components/forms'
class LeadInfo extends Component {
    state = {
        messages: [],
        form: {
            name: '',
            empresa: '',
            empresa_dirigida: '',
            tipoProyecto: '',
            comentario: '',
            diseño: '',
            obra: '',
            email: '',
            tipoProyectoNombre: '',
            origen: '',
            telefono: '',
            proyecto: ''
        },
        formHistorial: {
            comentario: '',
            fechaContacto: '',
            success: 'Contactado',
            tipoContacto: '',
            newTipoContacto: '',
            adjuntos: {
                adjuntos: {
                    files: [],
                    value: '',
                    placeholder: 'Adjuntos'
                }
            }
        },
        formAgenda: {
            fecha: new Date(),
            hora: '08',
            minuto: '00',
            cliente: '',
            tipo: 0,
            origen: 0,
            proyecto: '',
            empresa: 0,
            estatus: 0,
            correos: [],
            correo: '',
        },
        formDiseño: {
            m2: '',
            tipo_partida: '',
            esquema: 'esquema_1',
            fecha: new Date(),
            tiempo_ejecucion_diseno: '',
            descuento: 0.0,
            conceptos: [
                {
                    value: '',
                    text: 'REUNIÓN DE AMBOS EQUIPOS',
                    name: 'concepto1'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL MATERIAL PARA LA PRIMERA REVISIÓN PRESENCIAL',
                    name: 'concepto2'
                },
                {
                    value: '',
                    text: 'JUNTA PRESENCIAL PARA PRIMERA REVISIÓN DE LA PROPUESTA DE DISEÑO',
                    name: 'concepto3'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL PROYECTO',
                    name: 'concepto4'
                },
                {
                    value: '',
                    text: 'JUNTA PRESENCIAL PARA SEGUNDA REVISIÓN DE LA PROPUESTA DE DISEÑO',
                    name: 'concepto5'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL PROYECTO EJECUTIVO',
                    name: 'concepto6'
                },
                {
                    value: '',
                    text: 'ENTREGA FINAL DEL PROYECTO EN DIGITAL',
                    name: 'concepto7'
                },
            ],
            construccion_interiores_inf: '',
            construccion_interiores_sup: '',
            mobiliario_inf: '',
            mobiliario_sup: '',
            construccion_civil_inf: '',
            construccion_civil_sup: '',
            semanas: [
                {
                    lunes: false,
                    martes: false,
                    miercoles: false,
                    jueves: false,
                    viernes: false,
                    sabado: false,
                    domingo: false
                }
            ],
            partidas: [],
            planos: [],
            subtotal: 0.0
        },
        tipo: '',
        options: {
            empresas: [],
            tipos: [],
            origenes: [],
            tiposContactos: [],
            precios: [],
            esquemas: []
        },
        formeditado: 0,
        showForm: false,
        showAgenda: false,
        data:{
            empresa: null,
            tipoProyecto: null,
            partidas: null
        }
    }

    mostrarFormulario() {
        const { showForm } = this.state
        this.setState({
            ...this.state,
            showForm: !showForm,
            showAgenda: false
        })
    }
    mostrarAgenda() {
        const { showAgenda } = this.state
        this.setState({
            ...this.state,
            showAgenda: !showAgenda,
            showForm: false
        })
    }
    componentDidMount() {
        const { location: { state } } = this.props
        const { history } = this.props
        if (state) {
            if (state.lead) {
                const { form, options } = this.state
                const { lead } = state
                form.name = lead.nombre === 'SIN ESPECIFICAR' ? '' : lead.nombre.toUpperCase()
                form.email = lead.email.toUpperCase()
                form.telefono = lead.telefono
                this.setState({
                    ...this.state,
                    lead: lead,
                    form,
                    formeditado: 1,
                    options
                })
                this.getPresupuestoDiseñoOptionsAxios(lead.id)
            }
            else
                history.push('/leads/crm')
        }
        else 
            history.push('/leads/crm')
        this.getOptionsAxios()
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'crm/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { empresas, medios } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['tiposContactos'] = setOptions(medios, 'tipo', 'id')
                options.esquemas = setOptions([
                    {name: 'Esquema 1', value: 'esquema_1'},
                    {name: 'Esquema 2', value: 'esquema_2'},
                    {name: 'Esquema 3', value: 'esquema_3'},
                ], 'name', 'value')
                this.setState({
                    ...this.state,
                    options
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401)
                    forbiddenAccessAlert();
                else
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getPresupuestoDiseñoOptionsAxios(id) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'crm/options/presupuesto-diseño/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresa, tipoProyecto, partidas } = response.data
                const { data, formDiseño } = this.state
                let planos = []

                data.empresa = empresa
                data.tipoProyecto = tipoProyecto
                data.partidas = partidas
                
                if(tipoProyecto){
                    formDiseño.construccion_interiores_inf = tipoProyecto.construccion_interiores_inf
                    formDiseño.construccion_interiores_sup = tipoProyecto.construccion_interiores_sup
                    formDiseño.construccion_civil_inf = tipoProyecto.construccion_civil_inf
                    formDiseño.construccion_civil_inf = tipoProyecto.construccion_civil_inf
                    formDiseño.mobiliario_inf = tipoProyecto.mobiliario_inf
                    formDiseño.mobiliario_sup = tipoProyecto.mobiliario_sup
                }

                formDiseño.partidas = this.setOptionsCheckboxes(partidas, true)

                if(empresa)
                    empresa.planos.map( (plano) => {
                        if(plano[formDiseño.esquema])
                            planos.push(plano)
                    })

                formDiseño.planos = this.setOptionsCheckboxes(planos, true)

                this.setState({
                    ...this.state,
                    data,
                    formDiseño
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401)
                    forbiddenAccessAlert();
                else
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    onChangeHistorial = e => {
        const { formHistorial } = this.state
        const { name, value } = e.target
        formHistorial[name] = value
        this.setState({
            ...this.state,
            formHistorial
        })
    }
    onChangeAgenda = e => {
        const { name, value } = e.target
        const { formAgenda } = this.state
        formAgenda[name] = value
        this.setState({
            ...this.state,
            formAgenda
        })
    }

    handleChangeCheckbox = (array, type) => {
        const { formDiseño } = this.state
        formDiseño[type] = array
        this.setState({
            ...this.state,
            formDiseño: formDiseño
        })
    }

    onChangePresupuesto = e => {
        const { name, value } = e.target
        const { formDiseño, data } = this.state
        
        formDiseño[name] = value
/* 
        if (name === 'tiempo_ejecucion_diseno') {
            let modulo = parseFloat(value) % 6
            let aux = Object.keys(
                {
                    lunes: false,
                    martes: false,
                    miercoles: false,
                    jueves: false,
                    viernes: false,
                    sabado: false,
                    domingo: false
                }
            )
            form.semanas = [];
            for (let i = 0; i < Math.floor(parseFloat(value) / 6); i++) {
                form.semanas.push({
                    lunes: true,
                    martes: true,
                    miercoles: true,
                    jueves: true,
                    viernes: true,
                    sabado: true,
                    domingo: false
                })
            }
            form.semanas.push({
                lunes: false,
                martes: false,
                miercoles: false,
                jueves: false,
                viernes: false,
                sabado: false,
                domingo: false
            })
            aux.map((element, key) => {
                if (key < modulo) {
                    form.semanas[form.semanas.length - 1][element] = true
                } else {
                    form.semanas[form.semanas.length - 1][element] = false
                }
                return false
            })
            if (modulo > 2) {
                form.semanas.push({
                    lunes: false,
                    martes: false,
                    miercoles: false,
                    jueves: false,
                    viernes: false,
                    sabado: false,
                    domingo: false
                })
            }
        } */

        if(name === 'm2' || name === 'esquema')
            if(formDiseño.m2 && formDiseño.esquema){
                formDiseño.subtotal = this.getSubtotal(formDiseño.m2, formDiseño.esquema)
                
            }
        if(formDiseño.subtotal > 0){
            formDiseño.total = formDiseño.subtotal * ( 1 - (formDiseño.descuento / 100))
        }

        if(name === 'esquema'){
            let planos = []
            if(data.empresa)
                data.empresa.planos.map( (plano) => {
                    if(plano[formDiseño.esquema])
                        planos.push(plano)
                })
            formDiseño.planos = this.setOptionsCheckboxes(planos, true)
        }
        
        this.setState({
            ...this.state,
            formDiseño
        })
    }
    handleChange = (files, item) => {
        const { formHistorial } = this.state
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
        formHistorial['adjuntos'][item].value = files
        formHistorial['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            formHistorial
        })
    }

    removeCorreo = value => {
        const { formAgenda } = this.state
        let aux = []
        formAgenda.correos.map((correo, key) => {
            if (correo !== value) {
                aux.push(correo)
            }
            return false
        })
        formAgenda.correos = aux
        this.setState({
            ...this.state,
            formAgenda
        })
    }

    onChangeConceptos = (e, key) => {
        const { value } = e.target
        const { formDiseño } = this.state
        formDiseño.conceptos[key].value = value
        this.setState({
            ...this.state,
            formDiseño
        })
    }

    checkButtonSemanas = (e, key, dia) => {
        const { formDiseño } = this.state
        const { checked } = e.target
        formDiseño.semanas[key][dia] = checked
        let count = 0;
        let aux = Object.keys(
            {
                lunes: false,
                martes: false,
                miercoles: false,
                jueves: false,
                viernes: false,
                sabado: false,
                domingo: false
            }
        )
        formDiseño.semanas.map((semana) => {
            aux.map((element) => {
                if (semana[element])
                    count++;
                return false
            })
            return false
        })
        formDiseño.tiempo_ejecucion_diseno = count
        this.setState({
            ...this.state,
            formDiseño
        })
    }

    setOptionsCheckboxes = (partidas, value) => {
        let checkBoxPartida = []
        partidas.map((partida, key) => {
            checkBoxPartida.push({ checked: value, text: partida.nombre, id: partida.id, tipo: partida.tipo })
            return false
        })
        return checkBoxPartida
    }

    getSubtotal = (m2, esquema) => {

        if(m2 === '')
            return 0.0
        
        const { data } = this.state
        
        let precio_inicial = 0
        let incremento = 0
        let aux = false
        let limiteInf = 0.0
        let limiteSup = 0.0
        let m2Aux = parseInt(m2)
        let acumulado = 0
        let total = 0
        

        if(data.empresa)
            precio_inicial = data.empresa.precio_inicial_diseño
        else{
            errorAlert('No fue posible calcular el total')
            return 0.0
        }
        
        if(data.empresa.variaciones.length === 0){
            errorAlert('No fue posible calcular el total')
            return 0.0
        }   

        switch(esquema){
            case 'esquema_2':
                incremento = data.empresa.incremento_esquema_2 / 100;
                break
            case 'esquema_3':
                incremento = data.empresa.incremento_esquema_3 / 100;
                break
            default:
                incremento = 0
                break
        }

        data.empresa.variaciones.sort(function (a, b) {
            return parseInt(a.inferior) - parseInt(b.inferior)
        })

        limiteInf = parseInt(data.empresa.variaciones[0].inferior)
        limiteSup = parseInt(data.empresa.variaciones[ data.empresa.variaciones.length - 1 ].superior)

        if (limiteInf <= m2Aux && limiteSup >= m2Aux) {
            data.empresa.variaciones.map((variacion, index) => {
                if (index === 0) {
                    acumulado = parseFloat(precio_inicial) - ((parseInt(m2) - parseInt(variacion.inferior)) * parseFloat(variacion.cambio))
                    if (m2Aux >= parseInt(variacion.superior))
                        acumulado = parseFloat(precio_inicial) - ((parseInt(variacion.superior) - parseInt(variacion.inferior)) * parseFloat(variacion.cambio))
                    if (m2Aux >= parseInt(variacion.inferior) && m2Aux <= parseInt(variacion.superior))
                        total = parseFloat(acumulado) * parseFloat(m2)
                } else {
                    if (m2Aux >= parseInt(variacion.superior))
                        acumulado = parseFloat(acumulado) - ((parseInt(variacion.superior) - parseInt(variacion.inferior) + 1) * parseFloat(variacion.cambio))
                    else {
                        acumulado = parseFloat(acumulado) - ((parseInt(m2) - parseInt(variacion.inferior) + 1) * parseFloat(variacion.cambio))
                    }
                    if (m2Aux >= parseInt(variacion.inferior) && m2Aux <= parseInt(variacion.superior))
                        total = parseFloat(acumulado) * parseFloat(m2)
                }
            })

            return total = total * (1 + incremento)
        }

        if(limiteSup < m2Aux){
            errorAlert('Los m2 no están considerados en los límites')
            return 0.0
        }

    }

    async agregarContacto() {
        waitAlert()
        const { lead, formHistorial } = this.state
        const { access_token } = this.props.authUser
        const data = new FormData();
        let aux = Object.keys(formHistorial)
        aux.map((element) => {
            switch (element) {
                case 'fechaContacto':
                    data.append(element, (new Date(formHistorial[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                default:
                    data.append(element, formHistorial[element]);
                    break
            }
            return false
        })
        aux = Object.keys(formHistorial.adjuntos)
        aux.map((element) => {
            if (formHistorial.adjuntos[element].value !== '') {
                for (var i = 0; i < formHistorial.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, formHistorial.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, formHistorial.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
            return false
        })
        await axios.post(URL_DEV + 'crm/contacto/lead/' + lead.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { lead } = response.data
                const { formHistorial } = this.state
                this.setState({
                    ...this.state,
                    formHistorial,
                    lead: lead
                })
                doneAlert('Historial actualizado con éxito');
                const { history } = this.props
                history.push({
                    pathname: '/leads/crm/info/info',
                    state: { lead: lead }
                });
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

    async agendarEvento() {
        const { lead, formAgenda } = this.state
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'crm/agendar/evento/' + lead.id, formAgenda, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                formAgenda.fecha = new Date()
                formAgenda.hora = '08'
                formAgenda.minuto = '00'
                formAgenda.titulo = ''
                formAgenda.correo = ''
                formAgenda.correos = []
                this.setState({
                    ...this.state,
                    formAgenda,
                    modal: false
                })
                doneAlert('Evento generado con éxito');
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
    openModalWithInput = (estatus, id) => {
        questionAlert2('ESCRIBE EL MOTIVO DEL RECHAZO O CANCELACIÓN', '', () => this.changeEstatusCanceladoRechazadoAxios({ id: id, estatus: estatus }),
            <div>
                <Form.Control
                    placeholder='MOTIVO DE RECHAZO'
                    className="form-control form-control-solid h-auto py-7 px-6"
                    id='motivo'
                    as="textarea"
                    rows="3"
                />
            </div>
        )
    }

    async getLeadEnContacto() {
        const { access_token } = this.props.authUser
        const { lead } = this.state
        await axios.get(URL_DEV + 'crm/table/lead-en-contacto/' + lead.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { lead } = response.data
                const { history } = this.props
                history.push({
                    pathname: '/leads/crm/info/info',
                    state: { lead: lead }
                });
                this.setState({
                    ...this.state,
                    lead: lead
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
    async changeEstatusCanceladoRechazadoAxios(data) {
        waitAlert()
        const { access_token } = this.props.authUser
        data.motivo = document.getElementById('motivo').value
        await axios.put(URL_DEV + 'crm/lead/estatus/' + data.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push('/leads/crm')
                doneAlert('El estatus fue actualizado con éxito.')
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
    async changeEstatusAxios(data) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'crm/lead/estatus/' + data.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {       
                const { history } = this.props
                history.push('/leads/crm')    
                doneAlert('El estatus fue actualizado con éxito.')
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

    changeEstatus = (estatus, id) => {
        questionAlert('¿ESTÁS SEGURO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios({ id: id, estatus: estatus }))
    }

    solicitarFechaCita = async() => {
        const { access_token } = this.props.authUser
        const { lead } = this.state
        await axios.put(URL_DEV + 'crm/email/lead-potencial/' + lead.id, {}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Correo enviado con éxito');
                this.getLeadEnContacto()
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
        const { lead, form, formHistorial, options, formAgenda, formDiseño } = this.state
        return (
            <Layout active={'leads'}  {...this.props}>
                <Tab.Container defaultActiveKey="2" className="p-5">
                    <Row>
                        <Col md={3} className="mb-3">
                            <Card className="card-custom card-stretch">
                                <Card.Body >
                                    <div className="d-flex justify-content-end mb-2">
                                        <Button
                                            icon=''
                                            className="btn btn-light-success btn-sm"
                                            only_icon="fab fa-whatsapp pr-0"
                                            tooltip={{ text: 'CONTACTAR POR WHATSAPP' }}
                                        />
                                    </div>
                                    {
                                        lead ?
                                            <div className="table-responsive">
                                                <div className="list min-w-300px" >
                                                    <div className="d-flex align-items-center">
                                                        <div className="symbol symbol-75 symbol-xxl-100 mr-3 col-3">
                                                            <span className="symbol-label font-weight-bolder">{lead.nombre.split(" ", 1)}</span>
                                                        </div>
                                                        <div className="text-center col">
                                                            <div className="font-weight-bolder font-size-h6 text-dark-75 mb-2">{lead.nombre} </div>
                                                            <div className="text-muted font-size-sm mb-2">{lead.empresa.name}</div>
                                                            {/* {
                                                                lead ?
                                                                    lead.prospecto.estatus_prospecto ?
                                                                        <span style={{ color: lead.prospecto.estatus_prospecto.color_texto, backgroundColor: lead.prospecto.estatus_prospecto.color_fondo }} className="font-weight-bolder label label-inline mt-2 font-size-xs">{lead.prospecto.estatus_prospecto.estatus}</span>
                                                                        : ''
                                                                    : ''
                                                            } */}
                                                            {
                                                                lead ?
                                                                    lead.prospecto.estatus_prospecto ?
                                                                        <Dropdown>
                                                                            <Dropdown.Toggle
                                                                                style={
                                                                                    {
                                                                                        backgroundColor: lead.prospecto.estatus_prospecto.color_fondo, color: lead.prospecto.estatus_prospecto.color_texto, border: 'transparent', padding: '0.15rem 0.75rem',
                                                                                        width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem',
                                                                                        fontWeight: 600
                                                                                    }}>
                                                                                {lead.prospecto.estatus_prospecto.estatus.toUpperCase()}
                                                                            </Dropdown.Toggle>
                                                                            <Dropdown.Menu className="p-0" >
                                                                                <Dropdown.Header>
                                                                                    <span className="font-size-sm">Elige una opción</span>
                                                                                </Dropdown.Header>
                                                                                <Dropdown.Item href="#"  className="p-0" onClick={(e) => { e.preventDefault(); this.changeEstatus('Detenido', lead.id ) }} >
                                                                                    <span className="navi-link w-100">
                                                                                        <span className="navi-text">
                                                                                            <span className="label label-xl label-inline bg-light-gray text-gray rounded-0 w-100">DETENIDO</span>
                                                                                        </span>
                                                                                    </span>
                                                                                </Dropdown.Item>
                                                                                <Dropdown.Item className="p-0" onClick={(e) => { e.preventDefault(); this.openModalWithInput('Rechazado', lead.id) }} >
                                                                                    <span className="navi-link w-100">
                                                                                        <span className="navi-text">
                                                                                            <span className="label label-xl label-inline label-light-danger rounded-0 w-100">Rechazado</span>
                                                                                        </span>
                                                                                    </span>
                                                                                </Dropdown.Item>
                                                                            </Dropdown.Menu>
                                                                        </Dropdown>
                                                                        : ''
                                                                    : ''
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="my-4">
                                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                                            <span className="font-weight-bolder mr-2">Origen:</span>
                                                            <div className="text-muted font-weight-bold text-hover-dark">{lead.origen.origen}</div>
                                                        </div>
                                                        {/* <div className="d-flex align-items-center justify-content-between mb-2">
                                                            <span className="font-weight-bolder mr-2">Teléfono:</span>
                                                            <a href={`tel:+${lead.telefono}`} className="text-muted font-weight-bold text-hover-dark">{lead.telefono}</a>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                                            <span className="font-weight-bolder mr-2">Email:</span>
                                                                <a href={`mailto:+${lead.email}`} className="text-muted font-weight-bold text-hover-dark">{lead.email}</a>
                                                        </div> */}
                                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                                            <span className="font-weight-bolder mr-2">Fecha de ingreso:</span>
                                                            <div className="text-muted font-weight-bold text-hover-dark">{setDateTableLG(lead.created_at)}</div>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                                            <span className="font-weight-bolder mr-2">Fecha último contacto:</span>
                                                            <div className="text-muted font-weight-bold text-hover-dark">{setDateTableLG(lead.prospecto.contactos[0].created_at)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            : ''
                                    }
                                    <Nav className="navi navi-bold navi-hover navi-active navi-link-rounded">
                                        <Nav.Item className="navi-item mb-2">
                                            <Nav.Link className="navi-link px-2" eventKey="1">
                                                <span className="navi-icon mr-2">
                                                    <span className="svg-icon">
                                                        <SVG src={toAbsoluteUrl('/images/svg/User.svg')} />
                                                    </span>
                                                </span>
                                                <div className="navi-text">
                                                    <span className="d-block font-weight-bold">Información personal</span>
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="navi-item mb-2">
                                            <Nav.Link className="navi-link px-2" eventKey="2">
                                                <span className="navi-icon mr-2">
                                                    <span className="svg-icon">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Group-chat.svg')} />
                                                    </span>
                                                </span>
                                                <div className="navi-text">
                                                    <span className="d-block font-weight-bold">Historial de contacto</span>
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="navi-item mb-2">
                                            <Nav.Link className="navi-link px-2" eventKey="3">
                                                <span className="navi-icon mr-2">
                                                    <span className="svg-icon">
                                                        <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                                    </span>
                                                </span>
                                                <div className="navi-text">
                                                    <span className="d-block font-weight-bold">Presupuesto de diseño</span>
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="navi-item mb-2">
                                            <Nav.Link className="navi-link px-2" eventKey="4">
                                                <span className="navi-icon mr-2">
                                                    <span className="svg-icon">
                                                        <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                                    </span>
                                                </span>
                                                <div className="navi-text">
                                                    <span className="d-block font-weight-bold">Contrato</span>
                                                    {/* <span className="text-muted">Descripción del paso 2</span> */}
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Body>
                            </Card >
                        </Col >
                        <Col md={9} className="mb-3">
                            <Card className="card-custom card-stretch">
                                <Tab.Content>
                                    <Tab.Pane eventKey="1">
                                        <Card.Header className="align-items-center border-0 mt-4 pt-3 pb-0">
                                            <Card.Title>
                                                <h3 className="card-title align-items-start flex-column">
                                                    <span className="font-weight-bolder text-dark">Información general</span>
                                                </h3>
                                            </Card.Title>
                                        </Card.Header>
                                        <Card.Body className="pt-0">
                                            <div className="form-group row form-group-marginless">
                                                <div className="col-md-4">
                                                    <InputGray
                                                        withtaglabel={1}
                                                        withtextlabel={1}
                                                        withplaceholder={1}
                                                        withicon={1}
                                                        placeholder='NOMBRE DEL LEAD'
                                                        iconclass="far fa-user"
                                                        name='name'
                                                        value={form.name}
                                                        onChange={this.onChange}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <InputGray
                                                        withtaglabel={1}
                                                        withtextlabel={1}
                                                        withplaceholder={1}
                                                        withicon={1}
                                                        placeholder="CORREO ELECTRÓNICO DE CONTACTO"
                                                        iconclass="fas fa-envelope"
                                                        type="email"
                                                        name="email"
                                                        value={form.email}
                                                        onChange={this.onChange}
                                                        patterns={EMAIL}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <InputPhoneGray
                                                        withtaglabel={1}
                                                        withtextlabel={1}
                                                        withplaceholder={1}
                                                        withicon={1}
                                                        placeholder="TELÉFONO DE CONTACTO"
                                                        iconclass="fas fa-mobile-alt"
                                                        name="telefono"
                                                        value={form.telefono}
                                                        onChange={this.onChange}
                                                        patterns={TEL}
                                                        thousandseparator={false}
                                                        prefix=''
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <InputGray
                                                        withtaglabel={1}
                                                        withtextlabel={1}
                                                        withplaceholder={1}
                                                        withicon={1}
                                                        placeholder='NOMBRE DEL PROYECTO'
                                                        iconclass="far fa-folder-open"
                                                        name='proyecto'
                                                        value={form.proyecto}
                                                        onChange={this.onChange}
                                                    />
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="2">
                                        <Card.Header className="border-0 mt-4 pt-3">
                                            <h3 className="card-title d-flex justify-content-between">
                                                <span className="font-weight-bolder text-dark align-self-center">Historial de contacto</span>
                                                <div>
                                                    <Button
                                                        icon=''
                                                        className={"btn btn-icon btn-xs p-3 btn-light-success success2 mr-2"}
                                                        onClick={() => { this.mostrarFormulario() }}
                                                        only_icon={"flaticon2-plus icon-13px"}
                                                        tooltip={{ text: 'AGREGAR NUEVO CONTACTO' }}
                                                    />
                                                    <Button
                                                        icon=''
                                                        className={"btn btn-icon btn-xs p-3 btn-light-primary"}
                                                        onClick={() => { this.mostrarAgenda() }}
                                                        only_icon={"flaticon2-calendar-2 icon-md"}
                                                        tooltip={{ text: 'AGENDAR CITA' }}
                                                    />
                                                </div>
                                            </h3>
                                        </Card.Header>
                                        <Card.Body className="d-flex justify-content-center pt-0 row">
                                            <div className={this.state.showForm ? 'col-md-12 mb-5' : 'd-none'}>
                                                <HistorialContactoForm
                                                    options={options}
                                                    formHistorial={formHistorial}
                                                    onChangeHistorial={this.onChangeHistorial}
                                                    handleChange={this.handleChange}
                                                    onSubmit={() => { waitAlert(); this.agregarContacto() }} />
                                            </div>
                                            <div className={this.state.showAgenda ? 'col-md-12 mb-5' : 'd-none'}>
                                                <AgendarCitaForm
                                                    formAgenda={formAgenda}
                                                    onChange={this.onChangeAgenda}
                                                    removeCorreo={this.removeCorreo}
                                                    solicitarFechaCita = { () => { waitAlert(); this.solicitarFechaCita() } }
                                                    onSubmit={() => { waitAlert(); this.agendarEvento() }} />
                                            </div>
                                            <div className="col-md-8">
                                                {
                                                    lead ?
                                                        lead.prospecto.contactos.map((contacto, key) => {
                                                            return (
                                                                <div className="timeline timeline-6" key={key}>
                                                                    <div className="timeline-items">
                                                                        <div className="timeline-item">
                                                                            <div className={contacto.success ? "timeline-media bg-light-success" : "timeline-media bg-light-danger"}>
                                                                                <span className={contacto.success ? "svg-icon svg-icon-success svg-icon-md" : "svg-icon svg-icon-danger  svg-icon-md"}>
                                                                                    {
                                                                                        contacto.tipo_contacto.tipo === 'Llamada' ?
                                                                                            <SVG src={toAbsoluteUrl('/images/svg/Outgoing-call.svg')} />
                                                                                            : contacto.tipo_contacto.tipo === 'Correo' ?
                                                                                                <SVG src={toAbsoluteUrl('/images/svg/Outgoing-mail.svg')} />
                                                                                                : contacto.tipo_contacto.tipo === 'VIDEO LLAMADA' ?
                                                                                                    <SVG src={toAbsoluteUrl('/images/svg/Video-camera.svg')} />
                                                                                                    : contacto.tipo_contacto.tipo === 'Whatsapp' ?
                                                                                                        <i className={contacto.success ? "socicon-whatsapp text-success icon-16px" : "socicon-whatsapp text-danger icon-16px"}></i>
                                                                                                        : contacto.tipo_contacto.tipo === 'TAWK TO ADS' ?
                                                                                                            <i className={contacto.success ? "fas fa-dove text-success icon-16px" : "fas fa-dove text-danger icon-16px"}></i>
                                                                                                            : contacto.tipo_contacto.tipo === 'REUNIÓN PRESENCIAL' ?
                                                                                                                <i className={contacto.success ? "fas fa-users text-success icon-16px" : "fas fa-users text-danger icon-16px"}></i>
                                                                                                                : contacto.tipo_contacto.tipo === 'Visita' ?
                                                                                                                    <i className={contacto.success ? "fas fa-house-user text-success icon-16px" : "fas fa-house-user text-danger icon-16px"}></i>
                                                                                                                    : <i className={contacto.success ? "fas fa-mail-bulk text-success icon-16px" : "fas fa-mail-bulk text-danger icon-16px"}></i>
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            <div className={contacto.success ? "timeline-desc timeline-desc-light-success" : "timeline-desc timeline-desc-light-danger"}>
                                                                                <span className={contacto.success ? "font-weight-bolder text-success" : "font-weight-bolder text-danger"}>{setDateTableLG(contacto.created_at)}</span>
                                                                                <div className="font-weight-light pb-2 text-justify position-relative mt-2" style={{ borderRadius: '0.42rem', padding: '1rem 1.5rem', backgroundColor: '#F3F6F9' }}>
                                                                                    <div className="text-dark-75 font-weight-bold mb-2">{contacto.tipo_contacto.tipo}</div>
                                                                                    {contacto.comentario}
                                                                                    {
                                                                                        contacto.adjunto ?
                                                                                            <div className="d-flex justify-content-end">
                                                                                                <a href={contacto.adjunto.url} target='_blank' rel="noopener noreferrer" className="text-muted text-hover-primary font-weight-bold">
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
                                                            )
                                                        })
                                                        : ''
                                                }
                                            </div>
                                        </Card.Body>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="3">
                                        <Card.Header className="align-items-center border-0 mt-4 pt-3">
                                            <Card.Title>
                                                <h3 className="card-title align-items-start flex-column">
                                                    <span className="font-weight-bolder text-dark">Presupuesto de diseño</span>
                                                </h3>
                                            </Card.Title>
                                        </Card.Header>
                                        <Card.Body className="pt-0">
                                            <PresupuestoDiseñoCRMForm
                                                options={options}
                                                formDiseño={formDiseño}
                                                onChange={this.onChangePresupuesto}
                                                onChangeConceptos={this.onChangeConceptos}
                                                checkButtonSemanas={this.checkButtonSemanas}
                                                onChangeCheckboxes = { this.handleChangeCheckbox }
                                            />
                                        </Card.Body>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="4">
                                        <Card.Header className="align-items-center border-0 mt-4 pt-3">
                                            <Card.Title>
                                                <h3 className="card-title align-items-start flex-column">
                                                    <span className="font-weight-bolder text-dark">Historial de contacto</span>
                                                    {/* <span class="text-muted mt-3 font-weight-bold font-size-sm">890,344 Sales</span> */}
                                                </h3>
                                            </Card.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            ...
                                        </Card.Body>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card>
                        </Col>
                    </Row >
                </Tab.Container>
            </Layout >
        )
    }
}
const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(LeadInfo)