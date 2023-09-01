import React, { Component } from 'react'
import $ from 'jquery'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { isMobile } from 'react-device-detect'
import Scrollbar from 'perfect-scrollbar-react'
import Layout from '../../components/layout/layout'
import 'perfect-scrollbar-react/dist/style.min.css'
import { ModalSendMail } from '../../components/modals'
import { CommonLottie, Update } from '../../components/Lottie'
import { Card, Tab, Nav, Dropdown, Form } from 'react-bootstrap'
import { diffCommentDate, replaceAll } from '../../functions/functions'
import { setOptions, dayDMY, setEsquema, setMoneyText } from '../../functions/setters'
import { catchErrors, apiGet, apiPutForm, apiDelete, apiPostForm } from '../../functions/api'
import { Button, InputGray, CreatableMultiselectGray } from '../../components/form-components'
import { InformacionGeneralEdit, CotizacionesDiseño, HistorialContactoInfo, CotizacionAceptada, HistorialSolicitudes } from '../../components/forms'
import { doneAlert, errorAlert, waitAlert, questionAlert2, questionAlert, printResponseErrorAlert, customInputAlert } from '../../functions/alert'
class LeadInfo extends Component {
    state = {
        navs: [
            { eventKey: 'informacion', icon: 'flaticon-user', name: 'EDITAR INFORMACIÓN', show_item:true },
            { eventKey: 'historial-contacto', icon: 'flaticon-folder-1', name: 'HISTORIAL DE CONTACTO', show_item:true },
            { eventKey: 'cotizacion', icon: 'flaticon-file-1', name: 'COTIZACIÓN', show_item:true},
            { eventKey: 'cotizacion-aceptada', icon: 'flaticon-list-1', name: 'COTIZACIÓN ACEPTADA', show_item:false },
            { eventKey: 'facturación', icon: 'las la-file-invoice-dollar icon-xl', name: 'FACTURACIÓN', show_item:false }
        ],
        solicitud: '',
        tipo: '',
        activeNav: 'historial-contacto',
        modal: {
            presupuesto: false,
            email:false
        },
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
            proyecto: '',
            fecha: '',
            estado: '',
        },
        formSendMail:{
            correos: [],
            pdf:'',
            identificador:0
        },
        formDiseño: {
            m2: '',
            tipo_partida: '',
            esquema: 'esquema_1',
            fecha: new Date(),
            tiempo_ejecucion_diseno: '',
            tiempo_ejecucion_construccion: 0,
            descuento: 0.0,
            diviza_pesos: true,
            precio_dolar: 0,
            desglose: [],
            MontoIngenerias: [],
            MontoEsquemas: [],
            conceptos: [
                {
                    value: '',
                    text: 'VISITA A INSTALACIONES Y REUNIÓN DE AMBOS EQUIPOS',
                    name: 'concepto1'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL MATERIAL PARA LA PRIMERA REVISIÓN PRESENCIAL',
                    name: 'concepto2'
                },
                {
                    value: '',
                    text: 'JUNTA PRESENCIAL/REMOTA PARA PRIMERA REVISIÓN DE LA PROPUESTA DE DISEÑO Y MODELO 3D',
                    name: 'concepto3'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL PROYECTO',
                    name: 'concepto4'
                },
                {
                    value: '',
                    text: 'JUNTA PRESENCIAL/REMOTA PARA SEGUNDA REVISIÓN DE LA PROPUESTA DE DISEÑO, MODELO 3D Y VISTO BUENO DEL DISEÑO ',
                    name: 'concepto5'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL PROYECTO',
                    name: 'concepto6'
                },
                {
                    value: '',
                    text: 'ENTREGA FINAL DEL PROYECTO DIGITAL',
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
            partidasAcabados: [],
            partidasMobiliario: [],
            partidasObra: [],
            subtotal: 0.0,
            fase1: true,
            fase2: true,
            renders: '',
            acabados: true,
            mobiliario: true,
            obra_civil: true,
            si_desglose: true,
            no_desglose: false,
            si_renders: true,
            no_renders: false,
            proyecto: ''
        },
        activeKey: '',
        defaultKey: '',
        options: {
            empresas: [],
            tipos: [],
            tiposContactos: [],
            esquemas: [],
            motivosCancelacion: [],
            correos:[]
        },
        formeditado: 0,
        data: {
            empresa: null,
            tipoProyecto: null,
            partidas: null
        },
        lead: '',
        activePage: 1, flag: false,
        cotizacion_aceptada:[]
    }

    componentDidMount() {
        let queryString = this.props.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let lead = parseInt(params.get("lead"))
            let tipo = params.get("tipo")
            if (lead) { this.getOneLeadInfoAxios(lead, tipo) }
        } else {
            const { history } = this.props
            history.push('/leads/crm')
        }
        this.getOptionsAxios()
    }
    navsActive = lead => {
        const { navs } = this.state;
        navs.forEach((nav) => {
            if(lead.estatus.estatus === 'Contratado'){
                if(nav.eventKey === 'cotizacion-aceptada' || nav.eventKey === 'facturación'){
                    nav.show_item = true
                }
                if(nav.eventKey === 'cotizacion'){
                    nav.show_item = true
                }
            }
        })
        this.setState({
            navs
        });
        
    }
    getOneLeadInfoAxios = async (lead, tipo) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`crm/lead/${lead}`, access_token).then(
            (response) => {
                Swal.close()
                const { form, formDiseño } = this.state
                const { lead } = response.data
                form.name = lead.nombre === 'SIN ESPECIFICAR' ? '' : lead.nombre.toUpperCase()
                form.email = lead.email ? lead.email.toUpperCase() : ''
                form.telefono = lead.telefono
                form.estado = lead.estado !== null ? lead.estado.toString() : ''
                form.fecha = new Date(lead.created_at)
                
                this.navsActive(lead)
                this.cotizacionAceptada(lead) 
                if (formDiseño.esquema === 'esquema_1') {
                    formDiseño.tiempo_ejecucion_diseno = 7
                    formDiseño.semanas = this.calculateSemanas(formDiseño.tiempo_ejecucion_diseno)
                    formDiseño.conceptos = [
                        {
                            value: '1',
                            text: 'VISITA A INSTALACIONES Y REUNIÓN DE AMBOS EQUIPOS',
                            name: 'concepto1'
                        },
                        {
                            value: '1 AL 2',
                            text: 'DESARROLLO DEL MATERIAL PARA LA PRIMERA REVISIÓN PRESENCIAL',
                            name: 'concepto2'
                        },
                        {
                            value: '3',
                            text: 'JUNTA PRESENCIAL/REMOTA PARA PRIMERA REVISIÓN DE LA PROPUESTA DE DISEÑO Y MODELO 3D',
                            name: 'concepto3'
                        },
                        {
                            value: '3 AL 4',
                            text: 'DESARROLLO DEL PROYECTO',
                            name: 'concepto4'
                        },
                        {
                            value: '5',
                            text: 'JUNTA PRESENCIAL/REMOTA PARA SEGUNDA REVISIÓN DE LA PROPUESTA DE DISEÑO, MODELO 3D Y VISTO BUENO DEL DISEÑO ',
                            name: 'concepto5'
                        },
                        {
                            value: '5 AL 6',
                            text: 'DESARROLLO DEL PROYECTO',
                            name: 'concepto6'
                        },
                        {
                            value: '7',
                            text: 'ENTREGA FINAL DEL PROYECTO DIGITAL',
                            name: 'concepto7'
                        },
                    ]
                }
                this.setState({
                    ...this.state,
                    lead: lead,
                    form,
                    formeditado: 1,
                    tipo: tipo,
                    formDiseño
                })
                this.getPresupuestoDiseñoOptionsAxios(lead.id)
                this.getOneLead(lead)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    componentDidUpdate() { $(".pagination").removeClass("page-link"); }

    /* -------------------------------------------------------------------------- */
    /*                          ANCHOR ASYNC CALL TO APIS                         */
    /* -------------------------------------------------------------------------- */
    /* -------------------- ANCHOR ASYNC CALL TO GET OPTIONS -------------------- */
    getOptionsAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet('crm/options', access_token).then(
            (response) => {
                Swal.close()
                const { medios, motivosCancelacion } = response.data
                const { options } = this.state
                options['tiposContactos'] = setOptions(medios, 'tipo', 'id')
                options.esquemas = setOptions([
                    { name: 'Esquema 1', value: 'esquema_1' },
                    { name: 'Esquema 2', value: 'esquema_2' },
                    { name: 'Esquema 3', value: 'esquema_3' },
                ], 'name', 'value')
                options.motivosCancelacion = motivosCancelacion
                options.motivosCancelacion.map((motivo) => {
                    motivo.checked = false
                    return ''
                })
                this.setState({ ...this.state, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    /* -------- ANCHOR ASYNC CALL GET OPTIONS FROM PRESUPUESTO DE DISEÑO -------- */
    getPresupuestoDiseñoOptionsAxios = async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`crm/options/presupuesto-diseño/${id}`, access_token).then(
            (response) => {
                const { empresa, tipo, partidas } = response.data
                const { data, formDiseño } = this.state
                let planos = []
                data.empresa = empresa
                data.tipoProyecto = tipo
                data.partidas = partidas
                if (tipo) {
                    formDiseño.construccion_interiores_inf = tipo.construccion_interiores_inf
                    formDiseño.construccion_interiores_sup = tipo.construccion_interiores_sup
                    formDiseño.construccion_civil_inf = tipo.construccion_civil_inf
                    formDiseño.construccion_civil_sup = tipo.construccion_civil_sup
                    formDiseño.mobiliario_inf = tipo.mobiliario_inf
                    formDiseño.mobiliario_sup = tipo.mobiliario_sup
                }
                formDiseño.partidas = this.setOptionsCheckboxes(partidas, true)
                if (empresa)
                    empresa.planos.map((plano) => {
                        if (plano[formDiseño.esquema])
                            planos.push(plano)
                        return ''
                    })
                formDiseño.planos = this.setOptionsCheckboxes(planos, true)
                let auxPartidasAcabados = []
                let auxPartidasMobiliario = []
                let auxPartidasObra = []
                partidas.map((partida) => {
                    switch (partida.tipo) {
                        case 'Acabados e instalaciones':
                            auxPartidasAcabados.push(partida)
                            break;
                        case 'Mobiliario':
                            auxPartidasMobiliario.push(partida)
                            break;
                        case 'Obra civil':
                            auxPartidasObra.push(partida)
                            break;
                        default: break;
                    }
                    return ''
                })
                formDiseño.partidasAcabados = this.setOptionsCheckboxes(auxPartidasAcabados, true)
                formDiseño.partidasMobiliario = this.setOptionsCheckboxes(auxPartidasMobiliario, true)
                formDiseño.partidasObra = this.setOptionsCheckboxes(auxPartidasObra, true)
                this.setState({ ...this.state, data, formDiseño })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    /* -------------------- ANCHOR ASYNC CALL TO GET ONE LEAD ------------------- */
    getOneLead = async (lead) => {
        let { tipo } = this.state
        const { access_token } = this.props.authUser
        if (tipo === '')
            if (lead.estatus === undefined) {
                tipo = lead.prospecto.estatus_prospecto.estatus
            } else {
                tipo = lead.estatus.estatus
            }
        let api = ''
        if (tipo === 'En proceso') {
            api = 'crm/table/lead-en-contacto/';
        } else if (tipo === 'En negociación') {
            api = 'crm/table/lead-en-negociacion/';
        } else {
            api = 'crm/table/lead-detenido/';
        }
        api = 'crm/lead/'
        apiGet(`${api}${lead.id}`, access_token).then(
            (response) => {
                const { lead } = response.data
                // const { history } = this.props
                const { form, formDiseño, data, options } = this.state
                options.tipos = setOptions(lead.empresa.tipos, 'tipo', 'id')
                form.name = lead.nombre
                form.email = lead.email
                form.telefono = lead.telefono
                if (lead.prospecto) {
                    if (lead.prospecto.tipo_proyecto)
                        form.tipoProyecto = lead.prospecto.tipo_proyecto.id.toString()
                }
                form.fecha = new Date(lead.created_at)
                if (lead.presupuesto_diseño) {
                    formDiseño.fase1 = lead.presupuesto_diseño.fase1
                    formDiseño.fase2 = lead.presupuesto_diseño.fase2
                    formDiseño.renders = lead.presupuesto_diseño.renders
                    formDiseño.acabados = lead.presupuesto_diseño.acabados_e_instalaciones
                    formDiseño.mobiliario = lead.presupuesto_diseño.mobiliario
                    formDiseño.obra_civil = lead.presupuesto_diseño.obra_civil
                    formDiseño.si_desglose = lead.presupuesto_diseño.desglose === 1 ? true : false
                    formDiseño.si_renders = lead.presupuesto_diseño.con_renders === 1 ? true : false
                    let aux = JSON.parse(lead.presupuesto_diseño.actividades)
                    if (aux) {
                        aux = aux.actividades
                        formDiseño.conceptos = aux
                    }
                    aux = JSON.parse(lead.presupuesto_diseño.semanas)
                    if (aux) {
                        aux = aux.semanas
                        formDiseño.semanas = aux
                    }
                    let planos = []
                    if (data.empresa)
                        data.empresa.planos.map((plano) => {
                            if (plano[lead.presupuesto_diseño.esquema])
                                planos.push(plano)
                            return ''
                        })
                    formDiseño.planos = this.setOptionsCheckboxes(planos, true)
                    aux = JSON.parse(lead.presupuesto_diseño.planos)
                    if (aux) {
                        aux = aux.planos
                        aux.map((element) => {
                            formDiseño.planos.map((plano) => {
                                if (plano.id.toString() === element.toString())
                                    plano.checked = true
                                else
                                    plano.checked = false
                                return ''
                            })
                            return ''
                        })
                    }
                    aux = JSON.parse(lead.presupuesto_diseño.planos)
                    if (aux) {
                        aux = aux.planos
                        formDiseño.planos.map((plano) => {
                            if (aux.indexOf(plano.id) >= 0) plano.checked = true
                            else plano.checked = false
                            return ''
                        })
                    }
                    aux = JSON.parse(lead.presupuesto_diseño.partidas)
                    if (aux) {
                        aux = aux.partidas
                        formDiseño.partidasAcabados.map((partida) => {
                            if (aux.indexOf(partida.id) >= 0) partida.checked = true
                            else partida.checked = false
                            return ''
                        })
                        formDiseño.partidasMobiliario.map((partida) => {
                            if (aux.indexOf(partida.id) >= 0) partida.checked = true
                            else partida.checked = false
                            return ''
                        })
                        formDiseño.partidasObra.map((partida) => {
                            if (aux.indexOf(partida.id) >= 0) partida.checked = true
                            else partida.checked = false
                            return ''
                        })
                    }
                    formDiseño.construccion_civil_inf = lead.presupuesto_diseño.construccion_civil_inf
                    formDiseño.construccion_civil_sup = lead.presupuesto_diseño.construccion_civil_sup
                    formDiseño.construccion_interiores_inf = lead.presupuesto_diseño.construccion_interiores_inf
                    formDiseño.construccion_interiores_sup = lead.presupuesto_diseño.construccion_interiores_sup
                    formDiseño.mobiliario_inf = lead.presupuesto_diseño.mobiliario_inf
                    formDiseño.mobiliario_sup = lead.presupuesto_diseño.mobiliario_sup
                    formDiseño.tiempo_ejecucion_construccion = lead.presupuesto_diseño.tiempo_ejecucion_construccion
                    formDiseño.tiempo_ejecucion_diseno = lead.presupuesto_diseño.tiempo_ejecucion_diseño
                    formDiseño.m2 = lead.presupuesto_diseño.m2
                    formDiseño.fecha = new Date(lead.presupuesto_diseño.fecha)
                    formDiseño.total = lead.presupuesto_diseño.total
                    formDiseño.subtotal = lead.presupuesto_diseño.subtotal
                    formDiseño.esquema = lead.presupuesto_diseño.esquema
                    formDiseño.descuento = lead.presupuesto_diseño.descuento
                }
                this.setState({ ...this.state, lead: lead, form, formDiseño, options })
                // history.push({ state: { lead: lead } })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    /* ------------------ ANCHOR ASYNC CALL TO RECHAZAR ESTATUS ----------------- */
    changeEstatusCanceladoRechazadoAxios = async (data) => {
        const { estatus } = data
        let elemento = ''
        let motivo = ''
        if (estatus === 'Cancelado') {
            elemento = document.canceladoForm.motivoCancelado.value;
            motivo = document.getElementById('otro-motivo-cancelado').value
        }
        if (elemento === '')
            errorAlert('No seleccionaste el motivo')
        else {
            waitAlert()
            if (elemento === 'Otro')
                if (motivo !== '')
                    elemento = motivo
            data.motivo = elemento
            this.changeEstatusAxios(data)
        }
    }
    /* ------------------- ANCHOR ASYNC CALL TO CHANGE ESTATUS ------------------ */
    changeEstatusAxios = async (data) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiPutForm(`v2/leads/crm/lead/estatus/${data.id}`, data, access_token).then(
            (response) => {
                const { history } = this.props
                history.push('/leads/crm')
                doneAlert('El estatus fue actualizado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    /* ----------------- ANCHOR ASYNC CALL TO ELIMINAR CONTACTO ----------------- */
    eliminarContacto = async (contacto) => {
        const { access_token } = this.props.authUser
        const { lead } = this.state
        apiDelete(`crm/prospecto/${lead.id}/contacto/${contacto.id}`, access_token).then(
            (response) => {
                doneAlert('Registro eliminado con éxito.');
                this.getOneLead(lead)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    /* ------------ ANCHOR ASYNC CALL TO SEND CORREO CON PRESUPUESTO ------------ */
    sendCorreoPresupuesto = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { lead, formSendMail } = this.state
        let aux = []
        formSendMail.correos.map((contacto) => {
            aux.push(contacto.value)
            return false
        })
        formSendMail.correos = aux
        apiPutForm(`crm/email/envio-cotizacion/${lead.id}`, { identificador: formSendMail.identificador, correos:aux }, access_token).then(
            (response) => {
                const { flag, modal } = this.state
                modal.email = false
                this.setState({ ...this.state, flag: !flag, modal })
                doneAlert('Correo enviado con éxito', () => { this.refresh() })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    /* ------------------ ANCHOR ASYNC CALL TO UPDATE LEAD INFO ----------------- */
    addLeadInfoAxios = async () => {
        const { access_token } = this.props.authUser
        const { form, lead } = this.state
        apiPutForm(`v2/leads/crm/update/lead-en-contacto/${lead.id}`, form, access_token).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el lead.')
                this.getOneLead(lead)
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => { catchErrors(error) })
    }
    /* ------------ ANCHOR ASYNC CALL TO SUBMIT PRESUPUESTO DE DISEÑO ----------- */
    onSubmitPresupuestoDiseñoAxios = async (pdf) => {
        waitAlert();
        const { access_token } = this.props.authUser
        const { formDiseño, lead } = this.state
        formDiseño.pdf = pdf
        apiPostForm(`v2/leads/crm/add/presupuesto-diseño/${lead.id}`, formDiseño, access_token).then(
            (response) => {
                if (formDiseño.pdf) {
                    const { presupuesto } = response.data
                    if (presupuesto)
                        if (presupuesto.pdfs)
                            if (presupuesto.pdfs[0])
                                if (presupuesto.pdfs[0].pivot) {
                                    Swal.close()
                                    this.openModalSendPresupuesto(presupuesto.pdfs[0])
                                }
                }
                else
                    doneAlert('Presupuesto generado con éxito')
                this.getOneLead(lead)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    /* ----------------- ANCHOR ASYNC CALL TO SUBMIT PRESUPUESTO ---------------- */
    addSolicitudPresupuestoAxios = async () => {
        const { form, lead } = this.state
        const { access_token } = this.props.authUser
        if (form.comentario === '')
            errorAlert(`Debes agregar un comentario`)
        else {
            apiPostForm('v1/presupuestos/solicitud-presupuesto/lead', { comentario: form.comentario, lead: lead.id }, access_token).then(
                (response) => {
                    const { form } = this.state
                    const { solicitud } = response.data
                    form.comentario = ''
                    this.setState({ ...this.state, form })
                    doneAlert('Solicitud enviada con éxito', () => { this.getOneLead(lead) })
                    this.getSolicitudPresupuesto(solicitud.id)
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => { catchErrors(error) })
        }
    }
    /* ------------ ANCHOR ASYNC CALL TO GET SOLICITUD DE PRESUPUESTO ----------- */
    getSolicitudPresupuesto = async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v1/presupuestos/solicitud-presupuesto/${id}`, access_token).then(
            (response) => {
                const { solicitud } = response.data
                Swal.close()
                this.setState({ ...this.state, activeNav: 'cotizacion', solicitud: solicitud })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    /* ---------------------- ANCHOR ASYNC SAVE COMENTARIO ---------------------- */
    comentarAxios = async () => {
        waitAlert()
        const { form, solicitud } = this.state
        const { access_token } = this.props.authUser
        apiPostForm(`v1/presupuestos/solicitud-presupuesto/${solicitud.id}/comentario`, form, access_token).then(
            (response) => {
                const { solicitud } = response.data
                const { form } = this.state
                form.comentario = ''
                this.setState({ ...this.state, form })
                Swal.close()
                doneAlert(`Comentario agregado con éxito`, () => { this.getSolicitudPresupuesto(solicitud.id) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({ ...this.state, form })
    }

    handleChangeCheckbox = (array, type) => {
        const { formDiseño } = this.state
        formDiseño[type] = array
        this.setState({ ...this.state, formDiseño: formDiseño })
    }

    onChangePresupuesto = e => {
        const { name, value, type, checked } = e.target
        const { formDiseño, data } = this.state
        formDiseño[name] = value
        switch (name) {
            case 'esquema':
                switch (value) {
                    case 'esquema_1':
                        formDiseño.tiempo_ejecucion_diseno = 7
                        formDiseño.semanas = this.calculateSemanas(7)
                        break;
                    case 'esquema_2':
                        formDiseño.tiempo_ejecucion_diseno = 10
                        formDiseño.semanas = this.calculateSemanas(10)
                        break;
                    case 'esquema_3':
                        formDiseño.tiempo_ejecucion_diseno = 25
                        formDiseño.semanas = this.calculateSemanas(25)
                        break;
                    default:
                        break;
                }

                // Planos
                let planos = []
                if (data.empresa)
                    data.empresa.planos.map((plano) => {
                        if (plano[formDiseño.esquema])
                            planos.push(plano)
                        return ''
                    })
                formDiseño.planos = this.setOptionsCheckboxes(planos, true)

                // Conceptos
                formDiseño.conceptos.map((concepto) => {
                    switch (concepto.name) {
                        case 'concepto1':
                            concepto.value = "1";
                            break;
                        case 'concepto2':
                            switch (value) {
                                case 'esquema_1':
                                    concepto.value = "1 AL 2"
                                    break;
                                case 'esquema_2':
                                    concepto.value = "2 AL 3"
                                    break;
                                case 'esquema_3':
                                    concepto.value = "2 AL 4"
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'concepto3':
                            switch (value) {
                                case 'esquema_1':
                                    concepto.value = "3"
                                    break;
                                case 'esquema_2':
                                    concepto.value = "4"
                                    break;
                                case 'esquema_3':
                                    concepto.value = "5"
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'concepto4':
                            switch (value) {
                                case 'esquema_1':
                                    concepto.value = "3 AL 4"
                                    concepto.text = 'DESARROLLO DEL PROYECTO'
                                    break;
                                case 'esquema_2':
                                    concepto.value = "5 AL 6"
                                    concepto.text = 'DESARROLLO DEL PROYECTO'
                                    break;
                                case 'esquema_3':
                                    concepto.value = "6 AL 9"
                                    concepto.text = 'DESARROLLO DEL PROYECTO EJECUTIVO'
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'concepto5':
                            switch (value) {
                                case 'esquema_1':
                                    concepto.value = "5"
                                    break;
                                case 'esquema_2':
                                    concepto.value = "7"
                                    break;
                                case 'esquema_3':
                                    concepto.value = "10"
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'concepto6':
                            switch (value) {
                                case 'esquema_1':
                                    concepto.value = "5 AL 6"
                                    concepto.text = 'DESARROLLO DEL PROYECTO'
                                    break;
                                case 'esquema_2':
                                    concepto.value = "8 AL 9"
                                    concepto.text = 'DESARROLLO DEL PROYECTO'
                                    break;
                                case 'esquema_3':
                                    concepto.value = "11 AL 14"
                                    concepto.text = 'DESARROLLO DEL PROYECTO EJECUTIVO'
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'concepto7':
                            switch (value) {
                                case 'esquema_1':
                                    concepto.value = "7"
                                    concepto.text = 'ENTREGA FINAL DEL PROYECTO DIGITAL'
                                    break;
                                case 'esquema_2':
                                    concepto.value = "10"
                                    concepto.text = 'ENTREGA FINAL DEL PROYECTO DIGITAL'
                                    break;
                                case 'esquema_3':
                                    concepto.value = "15"
                                    concepto.text = 'ENTREGA FINAL DEL PROYECTO EJECUTIVO EN DIGITAL'
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                    return false
                })
                break;
            case 'tiempo_ejecucion_diseno':
                formDiseño.conceptos.map((concepto) => {
                    if (concepto.name === 'concepto7') {
                        concepto.value = formDiseño.tiempo_ejecucion_diseno
                    }
                    return false
                })
                formDiseño.semanas = this.calculateSemanas(value)
                break;
            case 'construccion_interiores_inf':
            case 'construccion_interiores_sup':
            case 'construccion_civil_inf':
            case 'construccion_civil_sup':
            case 'mobiliario_inf':
            case 'mobiliario_sup':
            case 'total':
                formDiseño[name] = replaceAll(value.toString(), ',', '')
                formDiseño[name] = replaceAll(formDiseño[name], '$', '')
                break
            default:
                break;
        }
        if (name === 'm2' || name === 'esquema')
            if (formDiseño.m2 && formDiseño.esquema) {
                formDiseño.subtotal = this.getSubtotal(formDiseño.m2, formDiseño.esquema)
            }
        if (formDiseño.subtotal > 0) {
            if (name === 'm2' || name === 'esquema' || name === 'descuento')
                formDiseño.total = formDiseño.subtotal * (1 - (formDiseño.descuento / 100))
        }
        if (type === 'checkbox')
            formDiseño[name] = checked

        if (type === 'radio') {
            if (name === 'si_desglose' || name === 'si_renders' || name === 'diviza_pesos')
                formDiseño[name] = value === "true" ? true : false
        }
        this.setState({ ...this.state, formDiseño })
    }

    onChangePartidas = e => {
        const { name, type, value, checked } = e.target
        const { formDiseño } = this.state
        let { defaultKey, activeKey } = this.state
        formDiseño[name] = value
        if (type === 'checkbox') { formDiseño[name] = checked }
        defaultKey = formDiseño.acabados ? "acabados" : formDiseño.mobiliario ? "mobiliario" : formDiseño.obra_civil ? "obra_civil" : "vacio"
        activeKey = formDiseño.acabados ? "acabados" : formDiseño.mobiliario ? "mobiliario" : formDiseño.obra_civil ? "obra_civil" : "vacio"
        this.setState({ ...this.state, formDiseño, defaultKey, activeKey })
    }

    calculateSemanas = tiempo => {
        let modulo = parseFloat(tiempo) % 5
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
        let semanas = []
        for (let i = 0; i < Math.floor(parseFloat(tiempo) / 5); i++) {
            semanas.push({
                lunes: true,
                martes: true,
                miercoles: true,
                jueves: true,
                viernes: true,
                sabado: false,
                domingo: false
            })
        }
        semanas.push({
            lunes: false,
            martes: false,
            miercoles: false,
            jueves: false,
            viernes: false,
            sabado: false,
            domingo: false
        })
        aux.map((element, key) => {
            if (key < modulo)
                semanas[semanas.length - 1][element] = true
            else
                semanas[semanas.length - 1][element] = false
            return false
        })
        if (modulo > 2) {
            semanas.push({
                lunes: false,
                martes: false,
                miercoles: false,
                jueves: false,
                viernes: false,
                sabado: false,
                domingo: false
            })
        }
        return semanas
    }

    onChangeConceptos = (e, key) => {
        const { value } = e.target
        const { formDiseño } = this.state
        formDiseño.conceptos[key].value = value
        this.setState({ ...this.state, formDiseño })
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
        this.setState({ ...this.state, formDiseño })
    }

    setOptionsCheckboxes = (partidas, value) => {
        let checkBoxPartida = []
        partidas.map((partida, key) => {
            if ((partida.nombre === 'PLANO DE LEVANTAMIENTO TOPOGRÁFICO') || (partida.nombre === 'PLANO CUADRO DE CARGAS') || (partida.nombre === 'PLANO DE DIAGRAMA UNIFILAR')) {
                checkBoxPartida.push({ checked: false, text: partida.nombre, id: partida.id, tipo: partida.tipo })
            } else {
                checkBoxPartida.push({ checked: value, text: partida.nombre, id: partida.id, tipo: partida.tipo })
            }
            return false
        })
        return checkBoxPartida
    }

    getSubtotal = (m2, esquema) => {

        if (m2 === '')
            return 0.0

        const { data } = this.state
        const { form ,formDiseño} = this.state

        let precio_inicial = 0
        let incremento = 0
        let limiteInf = 0.0
        let limiteSup = 0.0
        let m2Aux = parseInt(m2)
        let acumulado = 0
        let total = 0
        let raiz = 0
        // console.log(data.empresa)
        if (data.empresa)
            precio_inicial = data.empresa.precio_inicial_diseño
        else {
            errorAlert('No fue posible calcular el total')
            return 0.0
        }

        if (data.empresa.variaciones.length === 0) {
            errorAlert('No fue posible calcular el total')
            return 0.0
        }

        switch (esquema) {
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
        limiteSup = parseInt(data.empresa.variaciones[data.empresa.variaciones.length - 1].superior)
        console.log(data.empresa.variaciones)
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
                return ''
            })

            raiz= Math.sqrt(precio_inicial * m2 ) * precio_inicial;
            total = raiz.toFixed(3) *  (1 + incremento)
            let accu = 0
            let sum = 0
            let ra = 0
            let nuevo = 0

            formDiseño.desglose = []
            formDiseño.MontoIngenerias = []
            formDiseño.MontoEsquemas = []

            if(esquema === 'esquema_3'){
                if( data.empresa.tipos_planos3){
                    data.empresa.tipos_planos3.forEach((tipos,key) => { 

                        ra= Math.sqrt(tipos.monto * m2 ) * tipos.monto;
                        sum = ra.toFixed(2) *  (1 + 0)
                        nuevo = (tipos.monto * tipos.base) + (m2* tipos.monto);
                        // nuevo = tipos.monto * m2;

                        // ra= (tipos.monto * 400) + (m2* tipos.monto);
                        // console.log(ra)
                        // sum = ra.toFixed(2);
                        // console.log(sum)
                        // // ra= Math.sqrt(tipos.monto * m2 ) * tipos.monto;
                        // // sum = ra.toFixed(2) *  (1 + 0)
                        // nuevo = (tipos.monto * 400) + (m2* tipos.monto);
                        // console.log(sum)

                        formDiseño.desglose.push( [
                            {
                                id: tipos.id,
                                nombre: tipos.tipo,
                                monto: nuevo,
                                checked : true
                            }
                        ])
                        accu =  nuevo + accu
                    })
                    formDiseño.MontoIngenerias.push( [
                        {
                            id: 1,
                            nombre: 'MONTO INGENIERIAS',
                            monto: accu
                        }
                    ])
                    formDiseño.MontoEsquemas.push( [
                        {
                            id: 1,
                            nombre: 'MONTO DE ESQUEMA',
                            monto: total
                        }
                    ])
                    sum =  accu + total
                }               
                }else{
                    sum = total
                }            
                // console.log( formDiseño.desglose)
                return Math.round(sum.toFixed(2))
        }
        console.log(limiteSup)
        console.log(m2Aux)

        if (limiteSup < m2Aux) {
            errorAlert('Los m2 no están considerados en los límites')
            return 0.0
        }
    }

    onChangeMotivoCancelado = e => {
        const { value } = e.target
        var element = document.getElementById("customInputCancelado");
        if (value === 'Otro') {
            element.classList.remove("d-none");
        } else {
            element.classList.add("d-none");
        }
    }

    openModalWithInput = (estatus, id) => {
        const { options } = this.state
        questionAlert2('ESCRIBE EL MOTIVO DE CANCELACIÓN', '', () => this.changeEstatusCanceladoRechazadoAxios({ id: id, estatus: estatus }),
            <div style={{ display: 'flex', maxHeight: '250px' }} >
                <Scrollbar>
                    <form id='canceladoForm' name='canceladoForm' className="mx-auto w-80">
                        {
                            options.motivosCancelacion.map((option, key) => {
                                return (
                                    <Form.Check key={key} id={`motivo-cancelado-${option.id}`}
                                        type="radio" label={option.motivo} name='motivoCancelado'
                                        className="text-justify mb-3" value={option.motivo}
                                        onChange={this.onChangeMotivoCancelado}
                                    />
                                )
                            })
                        }
                        <Form.Check
                            id="motivo-cancelado-7"
                            name='motivoCancelado'
                            type="radio"
                            label="Otro"
                            className="text-justify mb-3"
                            value="Otro"
                            onChange={this.onChangeMotivoCancelado}
                        />
                        <div id='customInputCancelado' className='d-none'>
                            <Form.Control
                                placeholder='MOTIVO DE CANCELACIÓN'
                                className="form-control form-control-solid h-auto py-7 px-6 text-uppercase"
                                id='otro-motivo-cancelado'
                                as="textarea"
                                rows="3"
                            />
                        </div>
                    </form>
                </Scrollbar>
            </div>
        )
    }
    changeEstatus = (estatus, id) => {
        questionAlert('¿ESTÁS SEGURO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios({ id: id, estatus: estatus }))
    }
    handleClickTab = (type) => {
        let { defaultKey, formDiseño } = this.state
        defaultKey = formDiseño.acabados ? "acabados" : formDiseño.mobiliario ? "mobiliario" : formDiseño.obra_civil ? "obra_civil" : "vacio"
        this.setState({ ...this.state, activeKey: type, defaultKey })
    }
    changeActiveNav = key => {
        /* this.setState({ ...this.state, activeNav: key }) */
        const { lead, form } = this.state
        let flag = true
        if (key === 'cotizacion') {
            if (lead.prospecto) {
                if (!lead.prospecto.diseño && lead.prospecto.obra) {
                    if (!lead.solicitud_presupuesto) {
                        flag = false
                        customInputAlert(
                            <div>
                                <h2 className='swal2-title mb-4 mt-2'>COMENTA QUÉ SE REQUIERE COTIZAR.</h2>
                                <div className='text-center my-5' style={{ fontSize: '1rem', textTransform: 'none' }} >
                                    DA TODOS LOS DETALLES POSIBLES, CON ESTOS EL DEPARTAMENTO DE PROYECTOS GENERARÁ UNA COTIZACIÓN.
                                </div>
                                <InputGray withtaglabel={0} withtextlabel={0} withplaceholder={1} withicon={0} requirevalidation={0}
                                    value={form.comentario} name='comentario' rows={8} as='textarea' swal={true} letterCase={false}
                                    onChange={this.onChange} placeholder='COMENTARIOS' />
                            </div>,
                            <CommonLottie animationData={Update} />,
                            () => { this.addSolicitudPresupuestoAxios() },
                            () => { Swal.close(); },
                        )
                    } else {
                        flag = false
                        this.getSolicitudPresupuesto(lead.solicitud_presupuesto.id)
                    }
                }
            }
        }
        if (flag)
            this.setState({ ...this.state, activeNav: key })
    }

    printContactCount = (contactos) => {
        let sizeContactado = 0
        let sizeNoContactado = 0
        contactos.map((contacto) => {
            if (contacto.success) {
                return sizeContactado++
            } else {
                return sizeNoContactado++
            }
        })
        return (
            <div className="w-auto d-flex flex-column mx-auto mb-8">
                <div className="bg-light-warning p-4 rounded-xl flex-grow-1 align-self-center">
                    <div className="d-flex align-items-center justify-content-center font-size-lg font-weight-light mb-2">
                        TOTAL DE CONTACTOS:<span className="font-weight-boldest ml-2"><u>{contactos.length}</u></span>
                    </div>
                    <div id="symbol-total-contactos">
                        <span>
                            <span className="symbol symbol-circle symbol-white symbol-30 flex-shrink-0 mr-2">
                                <span className="symbol-label">
                                    <i className="fas fa-user-check text-success font-size-13px"></i>
                                </span>
                            </span>
                            <span className="font-size-sm font-weight-bolder">
                                <span className="font-size-lg">{sizeContactado}</span>
                                <span className="ml-2 font-weight-light">{sizeContactado <= 1 ? 'Contacto' : 'Contactados'}</span>
                            </span>
                        </span>
                        <span className="ml-4">
                            <span className="symbol symbol-circle symbol-white symbol-30 flex-shrink-0 mr-2">
                                <span className="symbol-label">
                                    <i className="fas fa-user-times text-danger font-size-13px"></i>
                                </span>
                            </span>
                            <span className="font-size-sm font-weight-bolder">
                                <span className="font-size-lg">{sizeNoContactado}</span>
                                <span className="ml-2 font-weight-light">Sin respuesta</span>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
  
    printComment = (coment) => {
        const { usuario } = coment
        const { user } = this.props.authUser
        let own = user.id === usuario.id
        return (
            <div>
                {
                    isMobile ?
                        <div className={`text-${own ? 'right' : 'left'}`}>
                            <div className="symbol symbol-50 symbol-circle" data-toggle="tooltip">
                                <img alt="Pic" src={usuario.avatar ? usuario.avatar : "/default.jpg"} />
                            </div>
                        </div>
                        :
                        <div className={`d-flex ${own ? 'flex-row-reverse' : ''} mx-3`}>
                            <div className="symbol symbol-50 symbol-circle" data-toggle="tooltip">
                                <img alt="Pic" src={usuario.avatar ? usuario.avatar : "/default.jpg"} />
                            </div>
                        </div>
                }

                <div className={`d-flex ${own ? 'flex-row-reverse' : ''} m-3`}>
                    <div style={{ maxWidth: isMobile ? '100%' : '80%' }}
                        className={`border rounded bg-light-${own ? 'info' : 'primary'} text-justify px-3 py-2`} >
                        {coment.texto}
                        <span className="blockquote-footer font-weight-lighter ml-2 d-inline">
                            <span className='font-weight-boldest'>{usuario.name}</span> / {diffCommentDate(coment)}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
    controlledNav = value => {
        this.setState({ ...this.state, activeNav: value })
    }

    titleNav = (title, lead) => {
        let newTitle = title
        if (title === 'COTIZACIÓN') {
            if (lead) {
                if (lead.prospecto) {
                    if (lead.prospecto.obra) {
                        newTitle = 'COTIZACIÓN DE OBRA'
                    }
                    if (lead.prospecto.diseño) {
                        newTitle = 'COTIZACIÓN DE DISEÑO'
                    }
                }
            }
        }
        return newTitle
    }
    refresh = () => {
        const { lead } = this.state
        this.getOneLead(lead)
    }
    // GUARDAR
    onSubmitPresupuestoDiseño = () => { this.onSubmitPresupuestoDiseñoAxios(false) }
    
    // GUARDAR Y GENERAR PDF
    onSubmitPDF = () => { this.onSubmitPresupuestoDiseñoAxios(true) }

    openModalSendPresupuesto = pdf => {
        const { modal, options, lead } = this.state
        let { formSendMail } = this.state
        modal.email = true

        let aux_correos = []
        formSendMail.correos = []

        if (lead.email) {
            formSendMail.correos.push({ value: lead.email, label: lead.email, name: lead.email })
            aux_correos.push({
                value: lead.email,
                label: lead.email,
                name: lead.email
            })
        }

        // ELIMINAR OPCIÓN DUPLICADO
        const values = aux_correos.map(o => o.value)
        const filtered = aux_correos.filter(({value}, index) => !values.includes(value, index + 1))

        options.correos = filtered
        formSendMail.pdf = pdf.url
        formSendMail.identificador = pdf.pivot.identificador
        this.setState({
            ...this.state,
            modal,
            formSendMail,
            options
        })
    }
    handleCloseMail = () => {
        let { formSendMail } = this.state
        const { modal } = this.state
        modal.email = false
        formSendMail.pdf = ''
        this.setState({ ...this.state, modal, formSendMail})
    }
    handleChangeCreateMSelect = (newValue) => {
        const { formSendMail } = this.state
        if(newValue == null){
            newValue = []
        }
        let currentValue = []
        newValue.forEach(valor => {
            currentValue.push({
                value: valor.value,
                label: valor.label,
                id:valor.id
            })
            return ''
        })
        formSendMail.correos = currentValue
        this.setState({...this.state, formSendMail })
    };
    cotizacionAceptada = (lead) => {
        let { cotizacion_aceptada } = this.state
        let aux = []
        if (lead.presupuesto_diseño) {
            if (lead.presupuesto_diseño.pdfs.length > 0) {
                lead.presupuesto_diseño.pdfs.forEach((pdf, key) => {
                    if (pdf.pivot.fecha_aceptacion !== null && lead.estatus.estatus === 'Contratado'){
                        aux.push(pdf)
                    }
                })
            }
        }
        cotizacion_aceptada=aux
        this.setState({
            cotizacion_aceptada
        });
    }
    setEsquemaPDF(lead) {
        if(lead.presupuesto_diseño.pdfs>0){
            return setEsquema(lead.presupuesto_diseño.pdfs[0].esquema)
        }else{
            return setEsquema(lead.presupuesto_diseño.esquema)
        }
    }
    setCostoConIva(lead){
        if(lead.presupuesto_diseño.pdfs>0){
            return setMoneyText(lead.presupuesto_diseño.pdfs[0].pivot.costo)
        }else{
            return setMoneyText(lead.presupuesto_diseño.total)
        }
    }
    setTextCostoConIva(lead){
        if(lead.presupuesto_diseño.pdfs>0){
            return 'Costo con iva'
        }else{
            return 'Total'
        }
    }
    setCostoSinIva(lead){
        if(lead.presupuesto_diseño.pdfs>0){
            return setMoneyText(lead.presupuesto_diseño.pdfs[0].pivot.costo_sin_iva)
        }else{
            return ''
        }
    }
    render() {
        const { lead, form, options, formDiseño, formeditado, activeKey, defaultKey, activeNav, solicitud, navs, flag, modal, formSendMail, cotizacion_aceptada } = this.state
        const { history } = this.props
        const { access_token } = this.props.authUser
        return (
            <Layout active='leads' {...this.props} botonHeader={this.botonHeader} >
                {
                    lead ?
                        <div className='d-flex flex-column flex-lg-row'>
                            <div className='flex-column flex-lg-row-auto w-100 w-lg-300px mb-0 mb-xl-10'>
                                <Card className="mb-5 mb-xl-8 p-sticky-card">
                                    <Card.Body className="pt-10">
                                        <div className="d-flex flex-center flex-column mb-7">
                                            <div>
                                                {
                                                    lead.empresa.isotipos.length > 0 ?
                                                        lead.empresa.isotipos.map((isotipo, key) => {
                                                            return (
                                                                <img alt="Pic" 
                                                                 style={{ height: 50 }}
                                                                src={isotipo.url} className="w-isotipo max-height-4rem" key={key} />
                                                            )
                                                        })
                                                        : <></>
                                                }
                                            </div>
                                            <div className="font-size-h5 font-weight-bolder text-dark mb-2 text-center mt-5">{lead.nombre}</div>
                                            {
                                                lead.prospecto ?
                                                    lead.prospecto.estatus_prospecto ?
                                                        <Dropdown drop='down' className="dropdown-estatus-crm">
                                                            <Dropdown.Toggle style={{ backgroundColor: lead.estatus.color_fondo, color: lead.estatus.color_texto, fontSize: '9.7px', fontWeight: 400 }} >
                                                                {lead.estatus.estatus.toUpperCase()}
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu className="p-0">
                                                                <Dropdown.Header>
                                                                    <span className="font-size-sm font-weight-bold">Elige una opción</span>
                                                                </Dropdown.Header>
                                                                <Dropdown.Item className="p-0" onClick={(e) => { e.preventDefault(); this.changeEstatus('Detenido', lead.id) }} >
                                                                    <span className="navi-link w-100">
                                                                        <span className="navi-text">
                                                                            <span className="label label-lg label-inline label-light-detenido rounded-0 w-100">DETENIDO</span>
                                                                        </span>
                                                                    </span>
                                                                </Dropdown.Item>
                                                                <Dropdown.Item className="p-0" onClick={(e) => { e.preventDefault(); this.openModalWithInput('Cancelado', lead.id) }} >
                                                                    <span className="navi-link w-100">
                                                                        <span className="navi-text">
                                                                            <span className="label label-lg label-inline label-light-danger rounded-0 w-100">Cancelado</span>
                                                                        </span>
                                                                    </span>
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                        : <></>
                                                    : <></>
                                            }
                                        </div>
                                        <div className="separator separator-dashed mb-7"></div>
                                        <div className="font-size-h6 text-dark font-weight-bolder text-center">DATOS PROSPECTO</div>
                                        <div className="font-weight-light text-dark-50 text-justify">
                                            {
                                                lead.prospecto ?
                                                    lead.prospecto.tipo_proyecto ?
                                                        <><div className="font-weight-bolder text-dark mt-5">TIPO DEL PROYECTO</div>{lead.prospecto.tipo_proyecto.tipo}</>
                                                        : <></>
                                                    : <></>
                                            }
                                            {
                                                lead.created_at ?
                                                    <><div className="font-weight-bolder text-dark mt-4">FECHA DE INGRESO</div>{dayDMY(lead.created_at)}</>
                                                    : <></>
                                            }
                                            {
                                                lead.telefono ?
                                                    <><div className="font-weight-bolder text-dark mt-4">TELÉFONO</div><a href={`tel:+${lead.telefono}`} className="text-dark-50 text-hover-primary">{lead.telefono}</a></>
                                                    : <></>
                                            }
                                            {
                                                lead.email ?
                                                    <><div className="font-weight-bolder text-dark mt-5">CORREO</div><a href={`mailto:+${lead.email}`} className="text-dark-50 text-hover-primary">{lead.email}</a></>
                                                    : <></>
                                            }
                                            {
                                                lead.origen ?
                                                    <><div className="font-weight-bolder text-dark mt-4">ORIGEN</div>{lead.origen.origen}</>
                                                    : <></>
                                            }
                                            {
                                                lead.estado ?
                                                    <><div className="font-weight-bolder text-dark mt-4">ESTADO</div>{lead.estado}</>
                                                    : <></>
                                            }
                                        </div>
                                        {
                                            cotizacion_aceptada.length>0?
                                                cotizacion_aceptada.map((pdf, key) => {
                                                    return (
                                                        <div key={key}>
                                                            <div className="separator separator-dashed my-7"></div>
                                                            <div className="font-size-h6 text-dark font-weight-bolder text-center">DATOS DE COTIZACIÓN ACEPTADA</div>
                                                            <div className="font-weight-light text-dark-50 text-justify">
                                                                <div className="font-weight-bolder text-dark mt-4">ESQUEMA</div>{setEsquema(pdf.pivot.esquema)}
                                                                <div className="font-weight-bolder text-dark mt-4">COSTO CON IVA</div>{setMoneyText(pdf.pivot.costo)}
                                                                <div className="font-weight-bolder text-dark mt-4">COSTO SIN IVA</div>{setMoneyText(pdf.pivot.costo_sin_iva)}
                                                                <div className="font-weight-bolder text-dark mt-4">M²</div>{lead.presupuesto_diseño.m2}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            :
                                                lead.presupuesto_diseño?
                                                <>
                                                    <div className="separator separator-dashed my-7"></div>
                                                    <div className="font-size-h6 text-dark font-weight-bolder text-center">DATOS DE ÚLTIMA COTIZACIÓN</div>
                                                    <div className="font-weight-light text-dark-50 text-justify">
                                                        <div className="font-weight-bolder text-dark mt-4">ESQUEMA</div>{this.setEsquemaPDF(lead)}
                                                        <div className="font-weight-bolder text-dark mt-4">{this.setTextCostoConIva(lead)}</div>{this.setCostoConIva(lead)}
                                                        {
                                                            this.setCostoSinIva(lead)?
                                                            <><div className="font-weight-bolder text-dark mt-4">COSTO SIN IVA</div>{this.setCostoSinIva(lead)}</>
                                                            :<></>
                                                        }
                                                        <div className="font-weight-bolder text-dark mt-4">M²</div>{lead.presupuesto_diseño.m2}
                                                    </div>
                                                </>
                                            :<></>
                                        
                                        }
                                    </Card.Body>
                                </Card>
                            </div>
                            <Tab.Container defaultActiveKey={activeNav} activeKey={activeNav} onSelect={(select) => { this.changeActiveNav(select) }} >
                                <div className={`flex-lg-row-fluid ml-lg-10`}>
                                    <div className="d-flex overflow-auto">
                                        <Nav className="nav nav-tabs nav-tabs-line-blue nav-tabs-line nav-tabs-line-2x font-size-h6 flex-nowrap align-items-center border-transparent align-self-end mb-4">
                                            {
                                                navs.map((nav, key) => {
                                                    if(nav.show_item){
                                                        return (
                                                            <Nav.Item key={key}>
                                                                <Nav.Link eventKey={nav.eventKey} onClick={(e) => { e.preventDefault(); this.controlledNav(nav.eventKey) }}>
                                                                    <span className="nav-icon">
                                                                        <i className={`${nav.icon} icon-lg mr-2`}></i>
                                                                    </span>
                                                                    <span className="nav-text font-weight-bolder white-space-nowrap">{this.titleNav(nav.name, lead)}</span>
                                                                </Nav.Link>
                                                            </Nav.Item>
                                                        )
                                                    }else return <span key = { key } ></span>
                                                })
                                            }
                                        </Nav>
                                    </div>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="informacion">
                                            <Card className='card card-custom gutter-b'>
                                                <Card.Header className="border-0 align-items-center pt-8 pt-md-0">
                                                    <div className="font-weight-bold font-size-h4 text-dark">Editar información</div>
                                                </Card.Header>
                                                <Card.Body className=''>
                                                    <InformacionGeneralEdit form={form} onChange={this.onChange}
                                                        onSubmit={this.addLeadInfoAxios} user={this.props.authUser.user}
                                                        lead={lead} formeditado={formeditado} options={options}
                                                    />
                                                </Card.Body>
                                            </Card>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="historial-contacto">
                                            <HistorialContactoInfo lead={lead} at={access_token} refresh={this.refresh} options={options} eliminarContacto={this.eliminarContacto}/>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="cotizacion">
                                            {
                                                lead ?
                                                    lead.prospecto ?
                                                        lead.prospecto.diseño ?
                                                            <CotizacionesDiseño flag = { flag }
                                                                lead={lead} sendPresupuesto={this.openModalSendPresupuesto}
                                                                options={options} formDiseño={formDiseño}
                                                                onChange={this.onChangePresupuesto} onChangeConceptos={this.onChangeConceptos} 
                                                                checkButtonSemanas={this.checkButtonSemanas} onChangeCheckboxes={this.handleChangeCheckbox}
                                                                onSubmit={this.onSubmitPresupuestoDiseño} submitPDF={this.onSubmitPDF}
                                                                formeditado={formeditado} onClickTab={this.handleClickTab}
                                                                activeKey={activeKey} defaultKey={defaultKey} onChangePartidas={this.onChangePartidas}
                                                                history={history} at={access_token} isActive={activeNav === 'cotizacion' ? true : false} />
                                                            : lead.prospecto.obra ?
                                                                solicitud !== '' ?
                                                                    <Card className='card card-custom gutter-b'>
                                                                        <Card.Header className="border-0 align-items-center pt-8 pt-md-0">
                                                                            <div className="font-weight-bold font-size-h4 text-dark">Presupuesto de obra</div>
                                                                            <div className="card-toolbar"></div>
                                                                        </Card.Header>
                                                                        <Card.Body>
                                                                            <div className="row mx-0">
                                                                                <div className="col-md-6">
                                                                                    <div className="table-responsive-lg border rounded p-2">
                                                                                        <table className={`table table-vertical-center w-${isMobile ? '100' : '80'} mx-auto table-borderless`}
                                                                                            id="tcalendar_p_info">
                                                                                            <thead>
                                                                                                <tr>
                                                                                                    <th colSpan="3" className="text-center pt-0">
                                                                                                        {
                                                                                                            solicitud.empresa ? solicitud.empresa.logoPrincipal ?
                                                                                                                <img alt='' width="170" src={solicitud.empresa.logoPrincipal} />
                                                                                                                : '' : ''
                                                                                                        }
                                                                                                    </th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                <tr className="border-top-2px">
                                                                                                    <td className="text-center w-5">
                                                                                                        <i className="las la-user-edit icon-2x text-dark-50"></i>
                                                                                                    </td>
                                                                                                    <td className="w-33 font-weight-bolder text-dark-50">NOMBRE</td>
                                                                                                    <td className="font-weight-light">
                                                                                                        <span>{solicitud.nombre}</span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td className="text-center">
                                                                                                        <i className="fab la-readme icon-2x text-dark-50"></i>
                                                                                                    </td>
                                                                                                    <td className="font-weight-bolder text-dark-50">Descripción</td>
                                                                                                    <td className="font-weight-light">
                                                                                                        <span>{solicitud.descripcion}</span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                {
                                                                                                    solicitud.area ?
                                                                                                        <tr>
                                                                                                            <td className="text-center">
                                                                                                                <i className="las la-list-ol icon-2x text-dark-50"></i>
                                                                                                            </td>
                                                                                                            <td className="font-weight-bolder text-dark-50">Fase</td>
                                                                                                            <td className="font-weight-light">
                                                                                                                <span>{solicitud.area.nombre}</span>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                        : ''
                                                                                                }
                                                                                                <tr>
                                                                                                    <td className="text-center">
                                                                                                        <i className="las la-file-contract icon-2x text-dark-50"></i>
                                                                                                    </td>
                                                                                                    <td className="font-weight-bolder text-dark-50">Presupuesto</td>
                                                                                                    <td className="font-weight-light">
                                                                                                        <span>
                                                                                                            {!solicitud.presupuesto ? 'En espera' : ''}
                                                                                                        </span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-6 mt-3 mt-md-0">
                                                                                    <Form onSubmit={(e) => { e.preventDefault(); }} >
                                                                                        <div className="row mx-0 border rounded p-3">
                                                                                            <div className="col md-12">
                                                                                                <InputGray withtaglabel={1} withtextlabel={1} rows='3'
                                                                                                    withplaceholder={1} withicon={0} as='textarea'
                                                                                                    value={form.comentario} requirevalidation={1}
                                                                                                    name='comentario' placeholder='ESCRIBE UN COMENTARIO'
                                                                                                    onChange={this.onChange}
                                                                                                />
                                                                                            </div>
                                                                                            <div className="col-md-12 mt-3 text-right">
                                                                                                <Button icon='' text="Enviar"
                                                                                                    className="btn btn-light-success font-weight-bold text-uppercase"
                                                                                                    onClick={(e) => {
                                                                                                        questionAlert('¿DESEAS ENVIAR TU COMENTARIO?',
                                                                                                            '', () => this.comentarAxios())
                                                                                                    }} />
                                                                                            </div>
                                                                                        </div>
                                                                                    </Form>
                                                                                    <div className="row mx-0 my-3 border rounded">
                                                                                        {
                                                                                            solicitud.comentarios.map((coment, index) => {
                                                                                                return (
                                                                                                    <div className='col-md-12 my-4' key={index}>
                                                                                                        {
                                                                                                            this.printComment(coment)
                                                                                                        }
                                                                                                    </div>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Card.Body>
                                                                    </Card>
                                                                    : <></>
                                                                : <></>
                                                        : <></>
                                                    : <></>
                                            }
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="cotizacion-aceptada">
                                            {
                                                lead.estatus.estatus === 'Contratado'?
                                                <CotizacionAceptada lead={lead} at={access_token} />
                                                :<></>
                                            }
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="facturación">
                                            {
                                                lead.estatus.estatus === 'Contratado'?
                                                <HistorialSolicitudes lead={lead} at={access_token} />
                                                :<></>
                                            }
                                        </Tab.Pane>
                                    </Tab.Content>
                                </div>
                            </Tab.Container>
                        </div>
                        : <></>
                }
                <ModalSendMail header = '¿DESEAS ENVIAR LA COTIZACIÓN AL LEAD?' show = { modal.email } handleClose = { this.handleCloseMail }
                    validation = { true } url={formSendMail.pdf} url_text = 'EL PRESUPUESTO' sendMail = { this.sendCorreoPresupuesto } >
                    <div className="col-md-11 mt-5">
                        <div>
                            <CreatableMultiselectGray placeholder = 'SELECCIONA/AGREGA EL O LOS CORREOS' iconclass = 'flaticon-email' 
                                requirevalidation = { 1 } messageinc = 'Selecciona el o los correos' uppercase = { false }
                                onChange = { this.handleChangeCreateMSelect } options = { options.correos } elementoactual = { formSendMail.correos } />
                        </div>
                    </div>
                </ModalSendMail>
            </Layout >
        )
    }
}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(LeadInfo)