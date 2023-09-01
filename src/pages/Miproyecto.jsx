import React, { Component, Fragment } from 'react'

import { login, logout } from "../redux/reducers/auth_user";
import { connect } from "react-redux";
// import { apiGet, catchErrors } from './functions/api';
//import { CommonLottie, Error404Page } from './components/Lottie';
// import { catchErrors, apiGet } from "./functions/api";
import axios from "axios";
import { URL_DEV, URL_ASSETS,MAIN_FRONT } from "../constants";
import {setOptions,setEmpresaLogo,dayDMY,setFase, } from "../functions/setters";
import {errorAlert,printResponseErrorAlert,waitAlert,validateAlert,doneAlert,questionAlertY, } from "../functions/alert";
import {SelectSearchGray,InputGray,Button, } from "../components/form-components";
import {Nav,Navbar,Tab,Col,Row,Form,OverlayTrigger,Tooltip, } from "react-bootstrap";
import moment from "moment";
import Swal from "sweetalert2";
import "moment/locale/es";
import SVG from "react-inlinesvg";
import { setSingleHeader, toAbsoluteUrl } from "../functions/routers";
import { Modal, ItemSlider } from "../components/singles";
import {DetailsInstalacion,FormFilterTickets,TablePresupuestos,TableTickets,TableMantenimiento, } from "../components/forms";
import $ from "jquery";
import { Link, Element, scroller } from "react-scroll";
import { CommonLottie } from "../components/Lottie";
import { Meetings } from "../assets/animate";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import S3 from "react-aws-s3";

class Miproyecto extends Component {
    state = {
        activeFlag: "calendario",
        mantenimientos: [],
        events: [],
        id: "",
        ticket: {
            estatus_ticket: { estatus: "" },
            tecnico: { nombre: "" },
        },
        tickets: [],
        presupuestos: [],
        proyecto: "",
        formeditado: 0,
        primeravista: true,
        modal: {
            single: false,
            details: false,
            tickets: false,
            mantenimiento: false,
            filterTickets: false,
        },
        showadjuntos: [
            {
                name: "Fotografías levantamiento",
                value: "fotografias_levantamiento",
            },
            {
                name: "Manuales de adaptación",
                value: "manuales_de_adaptacion",
            },
            {
                name: "Minutas",
                value: "minutas",
            },
            {
                name: "Oficios",
                value: "oficios",
            },
            {
                name: "Planos entregados por cliente",
                value: "planos_entregados_por_cliente",
            },
            {
                name: "Propuestas arquitectónicas preliminares",
                value: "propuestas_arquitectonicas_preliminares",
            },
            {
                name: "Referencias del diseño del proyecto",
                value: "referencias_del_diseño_del_proyecto",
            },
            {
                name: "Renders",
                value: "renders",
            },
            {
                name: "Sketch Up",
                value: "sketch_up",
            },
            {
                name: "Presupuestos preliminares",
                value: "presupuestos_preliminares",
            },
            {
                name: "Carta oferta",
                value: "carta_oferta",
            },
        ],
        form: {
            proyecto: "",
            tipo_trabajo: "",
            partida: "",
            descripcion: "",
            nombre: "",
            mantenimiento: "",
            equipo: "",
            estatus: "",
            costo: "",
            fechaInicio: new Date(),
            fechaFin: new Date(),
            rubro: [],
            adjuntos: {
                fotos: {
                    value: "",
                    placeholder: "Fotos del incidente",
                    files: [],
                },
            },
            filterTickets: {
                filter: [],
                id: "",
                estatus: "",
                fechaInicio: new Date(),
                fechaFin: new Date(),
                tipo_trabajo: "",
                descripcion: "",
                proyecto: "",
                area: "",
            },
            filterPresupuestos: {
                filter: [],
                id: "",
                proyecto: "",
                estatus: "",
                area: "",
                tiempo_ejecucion: "",
                fechaInicio: new Date(),
                fechaFin: new Date(),
            },
        },
        options: {
            proyectos: [],
            partidas: [],
            tiposTrabajo: [],
            equipos: [],
            estatus: [],
            areas: [
                { label: "FASE 1", value: "fase_1", name: "FASE 1" },
                { label: "FASE 2", value: "fase_2", name: "FASE 2" },
                { label: "FASE 3", value: "fase_3", name: "FASE 3" },
            ],
            mantenimientos: [
                { label: "PREVENTIVO", value: "preventivo", name: "PREVENTIVO" },
                { label: "CORRECTIVO", value: "correctivo", name: "CORRECTIVO" },
            ],
            rubro: [
                {
                    label: "TIPO DE MANTENIMIENTO",
                    value: "tipo_mantenimiento",
                    name: "TIPO DE MANTENIMIENTO",
                },
                { label: "EQUIPO", value: "equipo", name: "EQUIPO" },
                { label: "ESTATUS", value: "estatus", name: "ESTATUS" },
                { label: "COSTO", value: "costo", name: "COSTO" },
                { label: "FECHA", value: "fecha", name: "FECHA" },
            ],
            filterTickets: [
                { label: "IDENTIFICADOR", value: "id", name: "IDENTIFICADOR" },
                { label: "ESTATUS", value: "estatus", name: "ESTATUS" },
                {
                    label: "TIPO DE TRABAJO",
                    value: "tipo_trabajo",
                    name: "TIPO DE TRABAJO",
                },
                { label: "DESCRIPCIÓN", value: "descripcion", name: "DESCRIPCIÓN" },
                { label: "FECHA", value: "fecha", name: "FECHA" },
            ],
            filterPresupuesto: [
                { label: "IDENTIFICADOR", value: "id", name: "IDENTIFICADOR" },
                { label: "ESTATUS", value: "estatus", name: "ESTATUS" },
                { label: "FASE", value: "fase", name: "FASE" },
                {
                    label: "TIEMPO DE EJECUCIÓN",
                    value: "tiempo_ejecucion",
                    name: "TIEMPO DE EJECUCIÓN",
                },
                { label: "FECHA", value: "fecha", name: "FECHA" },
            ],
        },
        adjuntos: [
            {
                name: "Inicio y planeación",
                value: "inicio_y_planeacion",
                icon: "la la-clipboard-list",
                adjuntos: [
                    {
                        name: "Fotografías levantamiento",
                        value: "fotografias_levantamiento",
                    },
                    {
                        name: "Manuales de adaptación",
                        value: "manuales_de_adaptacion",
                    },
                    {
                        name: "Minutas",
                        value: "minutas",
                    },
                    {
                        name: "Oficios",
                        value: "oficios",
                    },
                    {
                        name: "Planos entregados por cliente",
                        value: "planos_entregados_por_cliente",
                    },
                    {
                        name: "Propuestas arquitectónicas preliminares",
                        value: "propuestas_arquitectonicas_preliminares",
                    },
                    {
                        name: "Referencias del diseño del proyecto",
                        value: "referencias_del_diseño_del_proyecto",
                    },
                    {
                        name: "Renders",
                        value: "renders",
                    },
                    {
                        name: "Sketch Up",
                        value: "sketch_up",
                    },
                    {
                        name: "Presupuestos preliminares",
                        value: "presupuestos_preliminares",
                    },
                    {
                        name: "Carta oferta",
                        value: "carta_oferta",
                    },
                ],
            },
            {
                name: "Ejecución de obra",
                value: "ejecucion_de_obra",
                icon: "la la-hard-hat",
                adjuntos: [
                    {
                        name: "Datos de cliente",
                        value: "datos_de_cliente",
                    },
                    {
                        name: "Contrato cliente",
                        value: "contrato_cliente",
                    },
                    {
                        name: "Contrato proveedores y contratistas",
                        value: "contrato_proveedores_y_contratistas",
                    },
                    {
                        name: "Reporte fotográfico de avance de obra",
                        value: "reporte_fotografico_de_avance_de_obra",
                    },
                    {
                        name: "Presupuesto aprobado por cliente",
                        value: "presupuesto_aprobado_por_cliente",
                    },
                    {
                        name: "Programa de obra",
                        value: "programa_de_obra",
                    },
                    {
                        name: "Sketch Up aprobados",
                        value: "sketch_up_aprobados",
                    },
                    {
                        name: "Renders aprobados",
                        value: "renders_aprobados",
                    },
                    {
                        name: "Estimaciones y cierre",
                        value: "estimaciones_y_cierre",
                    },
                    {
                        name: "Fianzas y seguros",
                        value: "fianzas_y_seguros",
                    },
                    {
                        name: "Presupuestos extras",
                        value: "presupuestos_extras",
                    },
                ],
            },
            {
                name: "Entrega",
                value: "entrega",
                icon: "la las la-star-o",
                adjuntos: [
                    {
                        name: "Catálogo de conceptos ASBUILT",
                        value: "catalogo_de_conceptos_asbuilt",
                    },
                    {
                        name: "Consignas de matenimiento",
                        value: "consignas_de_matenimiento",
                    },
                    {
                        name: "Planos aprobados",
                        value: "planos_aprobados",
                    },
                    {
                        name: "Garantía de los equipos",
                        value: "garantia_de_los_equipos",
                    },
                    {
                        name: "Garantía de vicios ocultos",
                        value: "garantia_de_vicios_ocultos",
                    },
                    {
                        name: "Memorias de cálculo",
                        value: "memorias_de_calculo",
                    },
                    {
                        name: "Memorias descriptivas",
                        value: "memorias_descriptivas",
                    },
                    {
                        name: "Fichas técnicas",
                        value: "fichas_tecnicas",
                    },
                    {
                        name: "Pruebas de instalaciones",
                        value: "pruebas_de_instalaciones",
                    },
                    {
                        name: "Fotografías fin de obra",
                        value: "fotografias_fin_de_obra",
                    },
                    {
                        name: "Acta de entrega",
                        value: "acta_de_entrega",
                    },
                ],
            },
            {
                name: "Mantenimiento",
                value: "mantenimiento",
                icon: "la la-tools",
                adjuntos: [
                    {
                        name: "Fallas y reparaciones por vicios ocultos",
                        value: "fallas_y_reparaciones_por_vicios_ocultos",
                    },
                    {
                        name: "Mantenimiento preventivo",
                        value: "mantenimiento_preventivo",
                    },
                    {
                        name: "Mantenimiento correctivo",
                        value: "mantenimiento_correctivo",
                    },
                ],
            },
        ],
        isOpen: false,
        openModalVideo: false,
        showSelect: true,
        tickets_info: {
            numPage: 0,
            total: 0,
            total_paginas: 0,
        },
        presupuestos_info: {
            numPage: 0,
            total: 0,
            total_paginas: 0,
        },
        mantenimiento: "",
        tipoTickets: "proyecto",
        typePresupuesto: "proyecto",
        typeForm: "ticket",
    };
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const modulo = permisos.find(function (element, index) {
            return element.modulo.url === pathname
        });
        if (!modulo)
            history.push('/')
        this.getOptionsAxios()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) { this.getMiProyectoAxios(id, 'tickets') }
        }else{
            this.getProyectoAxios()
        }
        this.changePage(permisos)
    }

    componentDidUpdate() {
        $(document).scroll(function () {
            var $nav = $(".fixed-top");
            $nav.toggleClass("header-scrolled", $(this).scrollTop() > $nav.height());
        });
    }

    scrolling = (location) => {
        scroller.scrollTo(location, {
            offset: -50,
            spy: true,
            smooth: "true",
            duration: 800,
        });
    };

    updateProyecto = (value) => {
        const { form } = this.state;
        form.proyecto = value;
        this.setState({ ...this.state, form });
        this.getMiProyectoAxios(value);
    };

    setEmpresaName(proyecto) {
        if (proyecto.empresa) {
            switch (proyecto.empresa.name) {
                case "INEIN":
                    return "Infraestructura e Interiores";
                case "INFRAESTRUCTURA MÉDICA":
                    return "IM Infraestructura Médica";
                case "ROCCO":
                    return "ROCCO";
                default:
                    return proyecto.empresa.name;
            }
        }
    }

    setEmpresaColor(proyecto) {
        if (proyecto.empresa) {
            switch (proyecto.empresa.name) {
                case "INEIN":
                    return "inein";
                case "INFRAESTRUCTURA MÉDICA":
                    return "gold";
                case "ROCCO":
                    return "dark";
                default:
                    return "dark-75";
            }
        }
    }

    formatDay(fechaInicio, fechaFinal) {
        let fecha_inicio = moment(fechaInicio);
        let fecha_final = moment(fechaFinal);
        let formatInicio = fecha_inicio.locale("es").format("DD MMM YYYY");
        let formatFinal = fecha_final.locale("es").format("DD MMM YYYY");
        return formatInicio.replace(".", "") + " - " + formatFinal.replace(".", "");
    }

    seleccionaradj(adjuntos) {
        const { proyecto } = this.state;
        let newdefaultactivekey = "";
        for (var i = 0; i < adjuntos.length; i++) {
            var adjunto = adjuntos[i];
            if (proyecto[adjunto.value].length) {
                newdefaultactivekey = adjunto.value;
                break;
            }
        }
        this.setState({
            ...this.state,
            primeravista: false,
            subActiveKey: newdefaultactivekey,
            showadjuntos: adjuntos,
        });
    }

    updateActiveTabContainer = (active) => {
        this.setState({ ...this.state, subActiveKey: active });
    };

    updateOptions = (opciones) => {
        const { proyecto } = this.state;
        let now = moment();
        let fecha_proyecto = moment(proyecto.fecha_fin, "YYYY-MM-DD");
        let fecha_hoy = moment(now, "YYYY-MM-DD");
        let dias_transcurridos = fecha_hoy.diff(fecha_proyecto, "days");
        let aux = [];
        opciones.forEach((tipo) => {
            if (dias_transcurridos >= 365) {
                if (tipo.name !== "Mantenimiento") {
                    aux.push(tipo);
                }
            } else {
                aux.push(tipo);
            }
        });
        return aux;
    };

    updateSelect = (value, name) => {
        const { form } = this.state;
        form[name] = value;
        this.setState({ ...this.state, form });
    };

    onChange = (e) => {
        const { value, name } = e.target;
        const { form } = this.state;
        form[name] = value;
        this.setState({ ...this.state, form });
    };

    onChangeType = (e, formulario) => {
        const { value, name } = e.target;
        const { form, typeForm, tipoTickets, typePresupuesto } = this.state;
        if (name === "filter") {
            if (value.length < form[formulario][name].length) {
                form[formulario][name] = value;
                this.setState({ ...this.state, form });
                if (typeForm === "ticket") {
                    this.getTicketsPage("", tipoTickets);
                } else {
                    this.getPresupuestosPage(typePresupuesto);
                }
            }
        }
        form[formulario][name] = value;
        this.setState({ ...this.state, form });
    };

    onChangeRange = (range) => {
        const { startDate, endDate } = range;
        const { form } = this.state;
        form.fechaInicio = startDate;
        form.fechaFin = endDate;
        this.setState({ ...this.state, form });
    };

    onChangeRangeFilter = (range) => {
        const { startDate, endDate } = range;
        const { form, typeForm } = this.state;
        if (typeForm === "ticket") {
            form.filterTickets.fechaInicio = startDate;
            form.filterTickets.fechaFin = endDate;
        } else {
            form.filterPresupuestos.fechaInicio = startDate;
            form.filterPresupuestos.fechaFin = endDate;
        }
        this.setState({ ...this.state, form });
    };

    handleChange = (files, item) => {
        if (files.length)
            this.onChangeAdjunto({
                target: { name: item, value: files, files: files },
            });
    };

    onChangeAdjunto = (e) => {
        const { form } = this.state;
        const { files, value, name } = e.target;
        let aux = [];
        files.forEach((file, key) => {
            aux.push({
                name: file.name,
                file: file,
                url: URL.createObjectURL(file),
                key: key,
            });
        });
        form["adjuntos"][name].value = value;
        form["adjuntos"][name].files = aux;
        this.setState({ ...this.state, form });
    };

    clearForm = () => {
        const { form } = this.state;
        let aux = Object.keys(form);
        aux.forEach((element) => {
            switch (element) {
                case "adjuntos":
                    form[element] = {
                        adjunto: {
                            value: "",
                            placeholder: "Ingresa los adjuntos",
                            files: [],
                        },
                        fotos: {
                            value: "",
                            placeholder: "Fotos del incidente",
                            files: [],
                        },
                    };
                    break;
                case "filterTickets":
                    break;
                case "fechaInicio":
                case "fechaFin":
                    form[element] = new Date();
                    break;
                case "rubro":
                    form[element] = [];
                    break;
                default:
                    form[element] = "";
                    break;
            }
        });
        return form;
    };

    openModalLevantamiento = () => {
        const { modal } = this.state;
        modal.tickets = true;
        this.setState({ ...this.state, modal });
    };

    openModalSee = (ticket) => {
        const { modal } = this.state;
        modal.single = true;
        this.setState({ ...this.state, modal, formeditado: 0, ticket: ticket });
    };

    openModalDetalles = (ticket) => {
        const { modal } = this.state;
        modal.details = true;
        this.setState({ ...this.state, modal, formeditado: 0, ticket: ticket });
    };

    openFilter = (type) => {
        const { modal, tipoTickets, options, typePresupuesto } = this.state;
        let { typeForm } = this.state;
        modal.filterTickets = true;
        typeForm = type;

        let optionsType =
            typeForm === "ticket" ? options.filterTickets : options.filterPresupuesto;
        if (tipoTickets === "all" || typePresupuesto === "all") {
            let found = optionsType.some((item) => item.value.includes("proyecto"));
            if (!found) {
                optionsType.push({
                    label: "PROYECTO",
                    value: "proyecto",
                    name: "PROYECTO",
                });
            }
        }
        if (
            (tipoTickets === "proyecto" && typeForm === "ticket") ||
            (typePresupuesto === "proyecto" && typeForm === "presupuesto")
        ) {
            optionsType.forEach((element, index) => {
                if (element.value === "proyecto") {
                    optionsType.splice(index, 1);
                }
            });
        }

        this.setState({ ...this.state, modal, options, formeditado: 0, typeForm });
    };

    handleClose = () => {
        const { modal } = this.state;
        modal.tickets = false;
        modal.details = false;
        modal.single = false;
        modal.mantenimiento = false;
        this.setState({
            ...this.state,
            form: this.clearForm(),
            modal,
            ticket: "",
            mantenimiento: "",
        });
    };

    onClickMantenimiento = (mantenimiento) => {
        const { modal } = this.state;
        modal.mantenimiento = true;
        this.setState({ ...this.state, modal, mantenimiento: mantenimiento });
    };

    handleCloseFilter = () => {
        const { modal, form, tipoTickets, typeForm, typePresupuesto } = this.state;
        modal.filterTickets = false;
        if (typeForm === "ticket") {
            form.filterTickets.filter = [];
            form.filterTickets.area = "";
            form.filterTickets.descripcion = "";
            form.filterTickets.estatus = "";
            form.filterTickets.fechaInicio = new Date();
            form.filterTickets.fechaFin = new Date();
            form.filterTickets.id = "";
            form.filterTickets.proyecto = "";
            form.filterTickets.tipo_trabajo = "";
            this.setState({ ...this.state, modal, form });
            this.getTicketsPage("", tipoTickets);
        } else {
            form.filterPresupuestos.filter = [];
            form.filterPresupuestos.area = "";
            form.filterPresupuestos.estatus = "";
            form.filterPresupuestos.fechaInicio = new Date();
            form.filterPresupuestos.fechaFin = new Date();
            form.filterPresupuestos.id = "";
            form.filterPresupuestos.proyecto = "";
            form.filterPresupuestos.tiempo_ejecucion = "";
            this.setState({ ...this.state, modal, form });
            this.getPresupuestosPage(typePresupuesto);
        }
    };

    nextPageTicket = (e) => {
        e.preventDefault();
        const { tickets_info, tipoTickets } = this.state;
        if (tickets_info.numPage < tickets_info.total_paginas - 1) {
            tickets_info.numPage++;
            this.setState({ tickets_info });
        }
        this.getTicketsPage("", tipoTickets);
    };

    prevPageTicket = (e) => {
        e.preventDefault();
        const { tickets_info, tipoTickets } = this.state;
        if (tickets_info.numPage > 0) {
            tickets_info.numPage--;
            this.setState({ tickets_info });
            this.getTicketsPage("", tipoTickets);
        }
    };

    renderEventContent = (eventInfo) => {
        const { proyecto } = this.state;
        let { extendedProps } = eventInfo.event._def;
        return (
            <OverlayTrigger
                rootClose
                overlay={
                    <Tooltip>
                        <span className="font-weight-bolder">{eventInfo.event.title}</span>{" "}
                        - {proyecto.nombre}
                    </Tooltip>
                }
            >
                <div
                    className="text-hover container p-1 tarea"
                    style={{
                        backgroundColor: eventInfo.backgroundColor,
                        borderColor: eventInfo.borderColor,
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        this.onClickMantenimiento(extendedProps);
                    }}
                >
                    <div className="row mx-0 row-paddingless">
                        <div className="col-md-auto mr-1 text-truncate">
                            <i
                                className={`${eventInfo.event._def.extendedProps.iconClass} font-size-17px px-1 text-white`}
                            ></i>
                        </div>
                        <div className="col align-self-center text-truncate">
                            <span className="text-white font-weight-bold font-size-12px">
                                {eventInfo.event.title} - {proyecto.nombre}
                            </span>
                        </div>
                    </div>
                </div>
            </OverlayTrigger>
        );
    };

    changePage = (permisos) => {
        let flag = false;
        let { link_url } = this.state;
        const calendarioTareas = permisos
            ? permisos.find(function (element, index) {
                return element.modulo.slug === "calendario-tareas";
            })
            : null;
        if (calendarioTareas) {
            flag = true;
            link_url=`${MAIN_FRONT}/usuarios/calendario-tareas`;
            // link_url = MAIN_FRONT."/usuarios/calendario-tareas";
        }
        const crm = permisos
            ? permisos.find(function (element, index) {
                return element.modulo.slug === "crm";
            })
            : null;
        if (crm && flag === false) {
            flag = true;
            // window.location.href = `${LEADS_FRONT}/leads/crm?tag=${access_token}`;
        }
        const tareas = permisos
            ? permisos.find(function (element, index) {
                return element.modulo.slug === "tareas";
            })
            : null;
        if (tareas && flag === false) {
            flag = true;
            link_url = "/usuarios/tareas";
        }
        if (permisos === undefined && flag === false) {
            link_url = "/login";
        } else {
            if (flag === false) {
                link_url = permisos[0].modulo.url;
            }
        }
        this.setState({ ...this.state, link_url });
    };

    changeActiveFlag = () => {
        const { activeFlag } = this.state;
        this.setState({
            ...this.state,
            activeFlag: activeFlag === "calendario" ? "tabla" : "calendario",
        });
    };

    getOptionsAxios = async () => {
        const { access_token } = this.props.authUser;
        await axios.get(`${URL_DEV}v2/mi-proyecto`, {headers: setSingleHeader(access_token),}).then(
                (response) => {
                    const { proyectos, tiposTrabajo, partidas, status } = response.data;
                    const { options } = this.state;
                    let show = proyectos.length === 1 ? false : true;
                    options.proyectos = setOptions(proyectos, "nombre", "id");
                    options.partidas = setOptions(partidas, "nombre", "id");
                    options.tiposTrabajo = setOptions(tiposTrabajo, "nombre", "id");
                    options.estatus = setOptions(status, "estatus", "id");
                    this.setState({ ...this.state, options, showSelect: show });
                },
                (error) => {
                    printResponseErrorAlert(error);
                }
            )
            .catch((error) => {
                errorAlert("Ocurrió un error desconocido catch, intenta de nuevo.");
                console.error(error, "error");
            });
    };

    getProyectoAxios = async () => {
        const { access_token } = this.props.authUser;
        await axios.get(`${URL_DEV}v2/mi-proyecto`, {headers: setSingleHeader(access_token),}).then(
                (response) => {
                    const { proyectos } = response.data;
                    const { options, form } = this.state;
                    options.proyectos = setOptions(proyectos, "nombre", "id");
                    let proyecto = options.proyectos[0];
                    form.proyecto = proyecto.value.toString();
                    this.getMiProyectoAxios(proyecto.value);
                    this.setState({ ...this.state, form, options });
                },
                (error) => {
                    printResponseErrorAlert(error);
                }
            )
            .catch((error) => {
                errorAlert("Ocurrió un error desconocido catch, intenta de nuevo.");
                console.error(error, "error");
            });
    };

    getMiProyectoAxios = async (id, location) => {
        waitAlert();
        const { access_token } = this.props.authUser;
        await axios.get(`${URL_DEV}v2/mi-proyecto/${id}`, {headers: setSingleHeader(access_token), }).then(
                (response) => {
                    Swal.close();
                    const { adjuntos, options, form, tipoTickets, typePresupuesto } =
                        this.state;
                    const { proyecto } = response.data;
                    let activeKey = "";
                    adjuntos.forEach((grupo) => {
                        grupo.adjuntos.forEach((element) => {
                            if (proyecto[element.value].length)
                                if (activeKey === "") activeKey = element.value;
                        });
                    });
                    let aux = [];
                    let aux2 = [];
                    let aux3 = [];
                    let objeto;
                    proyecto.equipos_instalados.forEach((equipo) => {
                        objeto = {
                            value: equipo.equipo.id.toString(),
                            name: equipo.equipo.texto,
                        };
                        if (!aux3.includes(objeto)) {
                            aux3.push(objeto);
                        }
                        aux.push({
                            title: equipo.equipo.equipo,
                            start: equipo.fecha,
                            end: equipo.fecha,
                            instalacion: equipo,
                            backgroundColor: "#17a2b8",
                            borderColor: "#17a2b8",
                            iconClass: "la la-toolbox",
                            tipo: "Instalación",
                        });
                        equipo.mantenimientos.forEach((mantenimiento) => {
                            if (mantenimiento.tipo === "correctivo")
                                aux.push({
                                    title: equipo.equipo.equipo,
                                    start: mantenimiento.fecha,
                                    end: mantenimiento.fecha,
                                    instalacion: equipo,
                                    backgroundColor: "#2756C3",
                                    borderColor: "#2756C3",
                                    iconClass: "la la-tools",
                                    tipo: "Mantenimiento correctivo",
                                });
                            else
                                aux.push({
                                    title: equipo.equipo.equipo,
                                    start: mantenimiento.fecha,
                                    end: mantenimiento.fecha,
                                    instalacion: equipo,
                                    backgroundColor: "#eea71a",
                                    borderColor: "#eea71a",
                                    iconClass: "la la-tools",
                                    tipo: "Mantenimiento preventivo",
                                });
                            aux2.push({ mantenimiento: mantenimiento, instalacion: equipo });
                        });
                    });
                    options.equipos = aux3;
                    form.proyecto = proyecto.id.toString();
                    this.setState({
                        ...this.state,
                        proyecto: proyecto,
                        subActiveKey: activeKey,
                        events: aux,
                        mantenimientos: aux2,
                        options,
                        form,
                    });

                    this.getTicketsPage(location, tipoTickets);
                    this.getPresupuestosPage(typePresupuesto);
                },
                (error) => {
                    printResponseErrorAlert(error);
                }
            )
            .catch((error) => {
                errorAlert("Ocurrió un error desconocido catch, intenta de nuevo.");
                console.error(error, "error");
            });
    };

    getProyectoAdjuntosZip = async (array) => {
        const { access_token } = this.props.authUser;
        const { proyecto } = this.state;
        let aux = { tipo: array };
        waitAlert();
        await axios.post(URL_DEV + "proyectos/" + proyecto.id + "/adjuntos/zip", aux, {headers: { Authorization: `Bearer ${access_token}` }, }).then(
                (response) => {
                    Swal.close();
                    const url = URL_ASSETS + "/storage/adjuntos.zip";
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", proyecto.nombre + ".zip");
                    document.body.appendChild(link);
                    link.click();
                },
                (error) => {
                    printResponseErrorAlert(error);
                }
            )
            .catch((error) => {
                errorAlert("Ocurrió un error desconocido catch, intenta de nuevo.");
                console.error(error, "error");
            });
    };

    addTicketAxios = async () => {
        waitAlert();
        let { form } = this.state;
        const { access_token } = this.props.authUser;
        await axios.post(`${URL_DEV}v2/mi-proyecto/tickets`, form, {headers: setSingleHeader(access_token), }).then(
                (response) => {
                    const { ticket, proyecto } = response.data;
                    const { tipoTickets } = this.state;
                    if (form.adjuntos.fotos.value) {
                        this.addFotosS3(form.adjuntos.fotos.files, ticket.id, proyecto.id);
                    } else {
                        doneAlert("Ticket creado con éxito");
                        this.getTicketsPage("", tipoTickets);
                        this.handleClose();
                    }
                },
                (error) => {
                    printResponseErrorAlert(error);
                }
            )
            .catch((error) => {
                errorAlert("Ocurrió un error desconocido catch, intenta de nuevo.");
                console.error(error, "error");
            });
    };

    addFotosS3 = async (arreglo, id, proyecto) => {
        let filePath = `proyecto/${proyecto}/tickets/${id}/`;
        const { access_token } = this.props.authUser;
        await axios.get(`${URL_DEV}v1/constant/admin-proyectos`, {headers: setSingleHeader(access_token), }).then(
                (response) => {
                    const { alma } = response.data;
                    let auxPromises = arreglo.map((file) => {
                        return new Promise((resolve, reject) => {
                            new S3(alma)
                                .uploadFile(
                                    file.file,
                                    `${filePath}${Math.floor(Date.now() / 1000)}-${file.name}`
                                )
                                .then((data) => {
                                    const { location, status } = data;
                                    if (status === 204)
                                        resolve({ name: file.name, url: location });
                                    else reject(data);
                                })
                                .catch((err) => reject(err));
                        });
                    });
                    Promise.all(auxPromises)
                        .then((values) => {
                            this.addFotosToTicket(values, id);
                        })
                        .catch((err) => console.error(err));
                },
                (error) => {
                    printResponseErrorAlert(error);
                }
            )
            .catch((error) => {
                errorAlert("Ocurrió un error desconocido catch, intenta de nuevo.");
                console.error(error, "error");
            });
    };

    addFotosToTicket = async (values, id) => {
        const { access_token } = this.props.authUser;
        let form = {};
        form.archivos = values;
        form.type = "fotos";
        await axios.post(`${URL_DEV}v3/calidad/tickets/${id}/s3`, form, {headers: setSingleHeader(access_token), }).then(
                (response) => {
                    const { tipoTickets } = this.state;
                    doneAlert("Ticket creado con éxito");
                    this.getTicketsPage("", tipoTickets);
                    this.handleClose();
                },
                (error) => {
                    printResponseErrorAlert(error);
                }
            )
            .catch((error) => {
                errorAlert("Ocurrió un error desconocido catch, intenta de nuevo.");
                console.error(error, "error");
            });
    };

    getTicketsPage = async (location, tipo) => {
        waitAlert();
        const { access_token } = this.props.authUser;
        const { tickets_info, proyecto, form } = this.state;
        await axios.put(`${URL_DEV}v2/mi-proyecto/tickets/${tickets_info.numPage}?id=${proyecto.id}&type=${tipo}`,
                { filtrado: form.filterTickets },
                { headers: setSingleHeader(access_token) }
            ).then(
                (response) => {
                    Swal.close();
                    const { total, page, tickets } = response.data;
                    const { tickets_info, modal } = this.state;
                    tickets_info.total = total;
                    tickets_info.numPage = page;
                    let total_paginas = Math.ceil(total / 10);
                    tickets_info.total_paginas = total_paginas;
                    modal.filterTickets = false;
                    this.setState({ ...this.state, tickets_info, tickets, modal });
                    if (location) this.scrolling(location);
                },
                (error) => {
                    printResponseErrorAlert(error);
                }
            )
            .catch((error) => {
                errorAlert("Ocurrió un error desconocido catch, intenta de nuevo.");
                console.error(error, "error");
            });
    };

    getPresupuestosPage = async (tipo) => {
        waitAlert();
        const { access_token } = this.props.authUser;
        const { presupuestos_info, proyecto, form } = this.state;
        await axios.put(`${URL_DEV}v2/mi-proyecto/presupuestos/${presupuestos_info.numPage}?id=${proyecto.id}&type=${tipo}`,
                { filtrado: form.filterPresupuestos },
                { headers: setSingleHeader(access_token) }
            ).then(
                (response) => {
                    Swal.close();
                    const { total, page, presupuestos } = response.data;
                    const { presupuestos_info, modal } = this.state;
                    presupuestos_info.total = total;
                    presupuestos_info.numPage = page;
                    let total_paginas = Math.ceil(total / 10);
                    presupuestos_info.total_paginas = total_paginas;
                    this.setState({
                        ...this.state,
                        presupuestos_info,
                        presupuestos,
                        modal,
                    });
                },
                (error) => {
                    printResponseErrorAlert(error);
                }
            )
            .catch((error) => {
                errorAlert("Ocurrió un error desconocido catch, intenta de nuevo.");
                console.error(error, "error");
            });
    };

    filtrarTabla = async () => {
        waitAlert();
        const { access_token } = this.props.authUser;
        const { proyecto, form } = this.state;
        await axios.put(`${URL_DEV}v2/mi-proyecto/${proyecto.id}`, form, {headers: setSingleHeader(access_token),}).then(
                (response) => {
                    const { mantenimientos } = response.data;
                    let aux = [];
                    mantenimientos.forEach((mantenimiento) => {
                        aux.push({
                            mantenimiento: mantenimiento,
                            instalacion: mantenimiento.instalacion,
                        });
                    });
                    this.setState({ ...this.state, mantenimientos: aux });
                    Swal.close();
                },
                (error) => {
                    printResponseErrorAlert(error);
                }
            )
            .catch((error) => {
                errorAlert("Ocurrió un error desconocido catch, intenta de nuevo.");
                console.error(error, "error");
            });
    };

    filterTickets = () => {
        waitAlert();
        const { tipoTickets, typePresupuesto, typeForm } = this.state;
        if (typeForm === "ticket") this.getTicketsPage("", tipoTickets);
        else this.getPresupuestosPage(typePresupuesto);
    };

    cleanForm = () => {
        const { form } = this.state;
        form.rubro = [];
        form.mantenimiento = "";
        form.equipo = "";
        form.estatus = "";
        form.costo = "";
        form.fechaInicio = new Date();
        form.fechaFin = new Date();
        this.filtrarTabla();
        this.setState({
            ...this.state,
            form,
        });
    };

    nameAdjunto(name) {
        var nombre_adjunto = name.slice(11, -4);
        return nombre_adjunto;
    }

    async logoutUserAxios() {
        const {
            logout,
            authUser: { access_token },
            history,
        } = this.props;
        console.log('logoutUserAxios')
        await axios
            .get(`${URL_DEV}user/logout`, {
                headers: { Authorization: `Bearer ${access_token}` },
            })
            .then(
                (response) => {
                    logout();
                    // history.push("/login");
                window.location.href = `${MAIN_FRONT}/login`;

                },
                (error) => {
                    logout();
                    history.push("/login");
                }
            )
            .catch((error) => {
                logout();
                history.push("/login");
            });
    }

    onChangeTicketTab = (type) => {
        const { tickets_info } = this.state;
        tickets_info.numPage = 0;
        this.setState({ ...this.state, tipoTickets: type, tickets_info });
        this.getTicketsPage("", type);
    };

    onChangePresupuestoTab = (type) => {
        const { presupuestos_info } = this.state;
        presupuestos_info.numPage = 0;
        this.setState({ ...this.state, typePresupuesto: type, presupuestos_info });
        this.getPresupuestosPage(type);
    };

    nextPagePresupuesto = (e) => {
        e.preventDefault();
        const { presupuestos_info, tipoTickets } = this.state;
        if (presupuestos_info.numPage < presupuestos_info.total_paginas - 1) {
            presupuestos_info.numPage++;
            this.setState({ presupuestos_info });
        }
        this.getTicketsPage("", tipoTickets);
    };

    prevPagePresupuesto = (e) => {
        e.preventDefault();
        const { presupuestos_info, tipoTickets } = this.state;
        if (presupuestos_info.numPage > 0) {
            presupuestos_info.numPage--;
            this.setState({ presupuestos_info });
            this.getTicketsPage("", tipoTickets);
        }
    };

    render() {
        const {options,form,proyecto,showSelect,primeravista,subActiveKey,defaultactivekey,adjuntos,showadjuntos,tickets,events,ticket,modal,
            formeditado,tickets_info,link_url,activeFlag,mantenimientos,mantenimiento,tipoTickets,typePresupuesto,typeForm,presupuestos_info,presupuestos,
        } = this.state;
        const { user } = this.props.authUser;
        return (
            <div>
                <div>
                    <header
                        id="header"
                        className="header-cliente fixed-top header-cliente-mobile"
                    >
                        <div className="container-fluid padding-container mx-auto container-mobile">
                            <Navbar expand="lg" className="navbar-cliente ">
                                <Navbar.Brand
                                    href={proyecto ? proyecto.empresa.pagina_web : ""}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="d-flex align-items-center"
                                >
                                    {setEmpresaLogo(proyecto) !== "" ? (
                                        <img
                                            alt=""
                                            className="img-logo"
                                            src={setEmpresaLogo(proyecto)}
                                        />
                                    ) : (
                                        ""
                                    )}
                                </Navbar.Brand>
                                {proyecto && (
                                    <>
                                        <Navbar.Toggle />
                                        <Navbar.Collapse
                                            id="basic-navbar-nav"
                                            className="justify-content-flex-end"
                                        >
                                            <Nav.Item className="nav-cliente">
                                                <Link
                                                    activeClass="active"
                                                    offset={0}
                                                    className="nav-cliente nav-link pt-13px"
                                                    to="inicio"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                >
                                                    Inicio
                                                </Link>
                                            </Nav.Item>
                                            <Nav.Item className="nav-cliente">
                                                <Link
                                                    activeClass="active"
                                                    offset={-50}
                                                    className="nav-cliente nav-link pt-13px"
                                                    to="informacion"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                >
                                                    Información
                                                </Link>
                                            </Nav.Item>
                                            {/* {
                                                        proyecto.adjuntos.length ||  proyecto.avances.length || proyecto.bitacora !== null ? */}
                                            <div className="nav-general-durante">
                                                <div className="div-nav">
                                                    <span className="span-nav">Durante obra</span>
                                                </div>
                                                <div className="nav-durante-obra">
                                                    {proyecto.adjuntos.length ? (
                                                        <Nav.Item className="nav-cliente">
                                                            <Link
                                                                activeClass="active"
                                                                offset={-50}
                                                                className="nav-cliente nav-link mt-0 link-durante-obra"
                                                                to="adjuntos"
                                                                spy={true}
                                                                smooth={true}
                                                                duration={500}
                                                            >
                                                                Adjuntos
                                                            </Link>
                                                        </Nav.Item>
                                                    ) : (
                                                        ""
                                                    )}
                                                    <Nav.Item className="nav-cliente">
                                                        <Link
                                                            activeClass="active"
                                                            offset={-50}
                                                            className="nav-cliente nav-link mt-0 link-durante-obra"
                                                            to="presupuestos"
                                                            spy={true}
                                                            smooth={true}
                                                            duration={500}
                                                        >
                                                            Presupuestos
                                                        </Link>
                                                    </Nav.Item>
                                                    {proyecto.avances.length ? (
                                                        <Nav.Item className="nav-cliente">
                                                            <Link
                                                                activeClass="active"
                                                                offset={-50}
                                                                className="nav-cliente nav-link mt-0 link-durante-obra"
                                                                to="avances"
                                                                spy={true}
                                                                smooth={true}
                                                                duration={500}
                                                            >
                                                                Avances
                                                            </Link>
                                                        </Nav.Item>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {proyecto.bitacora !== null ? (
                                                        <Nav.Link
                                                            className="nav-cliente mt-0 link-durante-obra"
                                                            href={proyecto.bitacora}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Bitácora
                                                        </Nav.Link>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>
                                            {/* :<></>
                                                    } */}
                                            <div className="nav-general-termino">
                                                <div className="div-nav">
                                                    <span className="span-nav">Al término de obra</span>
                                                </div>
                                                <div className="nav-termino-obra">
                                                    <Nav.Item className="nav-cliente">
                                                        <Link
                                                            activeClass="active"
                                                            offset={-50}
                                                            className="nav-cliente nav-link mt-0 link-termino-obra"
                                                            to="tickets"
                                                            spy={true}
                                                            smooth={true}
                                                            duration={500}
                                                        >
                                                            Tickets
                                                        </Link>
                                                    </Nav.Item>
                                                    {proyecto.equipos_instalados.length ? (
                                                        <Nav.Item className="nav-cliente">
                                                            <Link
                                                                activeClass="active"
                                                                offset={-50}
                                                                className="nav-cliente nav-link mt-0 link-termino-obra"
                                                                to="mantenimiento"
                                                                spy={true}
                                                                smooth={true}
                                                                duration={500}
                                                            >
                                                                Mantenimiento
                                                            </Link>
                                                        </Nav.Item>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>
                                        </Navbar.Collapse>
                                    </>
                                )}
                            </Navbar>
                        </div>
                        <div className="header-proyecto d-none">{proyecto.nombre}</div>
                    </header>
                    <Element
                        name="inicio"
                        className="section bienvenida-cliente d-flex align-items-center place-content-center"
                        style={{ backgroundImage: "url('/hero-bg.png')" }}
                    >
                        <div className="mb-10">
                            <div className="row mx-auto col-md-11 d-flex">
                                {showSelect && (
                                    <div className="row mx-0 col-md-12 d-flex justify-content-flex-end mb-20 px-0">
                                        <div className="col-md-8 d-flex justify-content-end px-0">
                                            <div className="col-md-4 px-0">
                                                <SelectSearchGray
                                                    options={options.proyectos}
                                                    placeholder="SELECCIONE UN PROYECTO"
                                                    name="proyecto"
                                                    value={form.proyecto}
                                                    onChange={this.updateProyecto}
                                                    requirevalidation={0}
                                                    customdiv="mb-0"
                                                    withtaglabel={0}
                                                    withtextlabel={0}
                                                    withicon={1}
                                                    iconvalid={1}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="col-md-6 d-flex flex-column justify-content-center">
                                    <div className="padding-col-7">
                                        <h1>{proyecto.nombre}</h1>
                                        <span className="d-flex flex-column">
                                            <h2
                                                className={`${proyecto ? "margin-y-30px" : "mb-0"} ${showSelect ? "order-1" : "order-2"
                                                    }`}
                                            >
                                                Plaforma administrativa
                                            </h2>
                                            <h4
                                                className={`order-3 ${!showSelect && proyecto ? "" : "margin-y-30px mb-0"
                                                    }`}
                                            >
                                                En este sitio podrás encontrar información importante de
                                                tu proyecto, como datos generales, avances, material,
                                                levantamiento de tickets, bitácora, entre otros, de
                                                acuerdo al progreso del mismo.
                                            </h4>
                                            {proyecto && (
                                                <h3
                                                    className={`mb-0 text-${this.setEmpresaColor(
                                                        proyecto
                                                    )} ${showSelect ? "order-2 " : "order-1 margin-y-30px"
                                                        }`}
                                                >
                                                    {this.setEmpresaName(proyecto)}
                                                </h3>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-6 bienvenida-img px-10 text-center">
                                    <CommonLottie animationData={Meetings} />
                                </div>
                            </div>
                        </div>
                    </Element>
                    {proyecto && (
                        <>
                            <Element
                                name="informacion"
                                className="informacion bg-blue-proyecto section"
                            >
                                <div className="container">
                                    <div className="row mx-0 feature-icons justify-content-center">
                                        <h3>Información del proyecto</h3>
                                        <div className="font-weight-lighter font-size-lg text-center px-10 mb-8 col-md-12">
                                            En esta sección encontraras los datos generales e
                                            importantes de tu proyecto.
                                        </div>
                                        <div className="row mx-0 col-md-12">
                                            <div className="col-md-5 text-center align-self-center">
                                                <SVG
                                                    src={toAbsoluteUrl(
                                                        "/images/svg/Construction-info.svg"
                                                    )}
                                                />
                                            </div>
                                            <div className="col-md-7 d-flex content d-flex overflow-auto white-space-nowrap">
                                                <div className="row align-self-center mx-0">
                                                    {proyecto.contacto !== "Sin información" && (
                                                        <div className="col-md-6 icon-box align-items-center mb-7">
                                                            <i className="las la-user-alt"></i>
                                                            <div>
                                                                <h4>Contacto</h4>
                                                                <p>{proyecto.contacto}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {proyecto.numero_contacto !== "Sin información" && (
                                                        <div className="col-md-6 icon-box align-items-center mb-7">
                                                            <i className="las la-phone"></i>
                                                            <div>
                                                                <h4>Número de contacto</h4>
                                                                <p>{proyecto.numero_contacto}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {proyecto.fecha_inicio && (
                                                        <div className="col-md-6 icon-box align-items-center mb-7">
                                                            <i className="las la-calendar"></i>
                                                            <div>
                                                                <h4>Periodo</h4>
                                                                <p>
                                                                    {this.formatDay(
                                                                        proyecto.fecha_inicio,
                                                                        proyecto.fecha_fin
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {proyecto.tipo_proyecto && (
                                                        <div className="col-md-6 icon-box align-items-center mb-7">
                                                            <i className="las la-toolbox"></i>
                                                            <div>
                                                                <h4>Tipo de proyecto</h4>
                                                                <p>{proyecto.tipo_proyecto}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {proyecto.m2 > 0 && (
                                                        <div className="col-md-6 icon-box align-items-center mb-7">
                                                            <i className="las la-ruler"></i>
                                                            <div>
                                                                <h4>M²</h4>
                                                                <p>{proyecto.m2}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {proyecto.fase3 === 0 &&
                                                        proyecto.fase2 === 0 &&
                                                        proyecto.fase1 === 0 ? (
                                                        <></>
                                                    ) : (
                                                        <div className="col-md-6 icon-box align-items-center mb-7">
                                                            <i className="las la-tools"></i>
                                                            <div>
                                                                <h4>Fase</h4>
                                                                <p>{setFase(proyecto)}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {proyecto.cp && (
                                                        <div className="col-md-6 icon-box align-items-center mb-7">
                                                            <i className="las la-map-pin"></i>
                                                            <div>
                                                                <h4>Código postal</h4>
                                                                <p>{proyecto.cp}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {proyecto.estado && (
                                                        <div className="col-md-6 icon-box align-items-center mb-7">
                                                            <i className="las la-globe"></i>
                                                            <div>
                                                                <h4>Estado</h4>
                                                                <p>{proyecto.estado}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {proyecto.municipio && (
                                                        <div className="col-md-6 icon-box align-items-center mb-7">
                                                            <i className="las la-map"></i>
                                                            <div>
                                                                <h4>Municipio/Delegación</h4>
                                                                <p>{proyecto.municipio}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {proyecto.colonia && (
                                                        <div className="col-md-6 icon-box align-items-center mb-7">
                                                            <i className="las la-map-marker"></i>
                                                            <div>
                                                                <h4>Colonia</h4>
                                                                <p>{proyecto.colonia}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {proyecto.calle && (
                                                        <div className="col-md-6 icon-box align-items-center mb-7 text-justify">
                                                            <i className="las la-map-marked-alt"></i>
                                                            <div>
                                                                <h4>Calle y número</h4>
                                                                <p>{proyecto.calle}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Element>
                            {proyecto.adjuntos.length ? (
                                <Element name="adjuntos" className="section border-y-blue">
                                    <div className="container">
                                        <div className="header-section link-durante-obra">
                                            Durante obra
                                        </div>
                                        <div className="title-proyecto">ADJUNTOS DEL PROYECTO</div>
                                        <div className="font-weight-lighter font-size-lg text-center px-10 mb-8 col-md-8 mx-auto">
                                            En este apartado podrás visualizar los archivos que se
                                            obtendrán de acuerdo al progreso de tu proyecto, es decir,
                                            desde el inicio y planeación hasta la entrega del mismo.
                                        </div>
                                        <div className="d-flex overflow-auto">
                                            <Nav
                                                as="ul"
                                                className="nav nav-tabs justify-content-start nav-bolder flex-nowrap white-space-nowrap"
                                            >
                                                {adjuntos.map((grupo, key) => {
                                                    let aux = false;
                                                    grupo.adjuntos.forEach((element) => {
                                                        if (proyecto[element.value].length) aux = true;
                                                    });
                                                    if (aux) {
                                                        return (
                                                            <div key={key}>
                                                                <Nav.Item as="li" className="mr-2">
                                                                    <Nav.Link
                                                                        data-toggle="tab"
                                                                        className={
                                                                            primeravista && key === 0
                                                                                ? "active rounded-0"
                                                                                : " rounded-0"
                                                                        }
                                                                        eventKey={grupo.value}
                                                                        onClick={() => {
                                                                            this.seleccionaradj(grupo.adjuntos);
                                                                        }}
                                                                    >
                                                                        <span className="nav-icon">
                                                                            {" "}
                                                                            <i
                                                                                className={`icon-lg ${grupo.icon}`}
                                                                            ></i>{" "}
                                                                        </span>
                                                                        <span className="nav-text">
                                                                            {" "}
                                                                            {grupo.name}{" "}
                                                                        </span>
                                                                    </Nav.Link>
                                                                </Nav.Item>
                                                            </div>
                                                        );
                                                    }
                                                    return aux;
                                                })}
                                            </Nav>
                                        </div>
                                        <Tab.Container
                                            activeKey={subActiveKey ? subActiveKey : defaultactivekey}
                                            onSelect={(select) => {
                                                this.updateActiveTabContainer(select);
                                            }}
                                        >
                                            <Row className="mx-0 bg-blue-proyecto">
                                                <Col
                                                    md={3}
                                                    className="navi navi-accent nav-bold d-flex align-items-center"
                                                >
                                                    <Nav
                                                        variant="pills"
                                                        className="flex-column navi navi-accent nav-bolder width-inherit"
                                                    >
                                                        {showadjuntos.map((adjunto, key) => {
                                                            if (proyecto[adjunto.value].length) {
                                                                return (
                                                                    <Nav.Item
                                                                        className="navi-item mb-3"
                                                                        key={key}
                                                                    >
                                                                        <Nav.Link
                                                                            className="navi-link rounded-0 bg-active"
                                                                            eventKey={adjunto.value}
                                                                        >
                                                                            <div className="navi-text font-size-lg">
                                                                                {adjunto.name}
                                                                            </div>
                                                                        </Nav.Link>
                                                                    </Nav.Item>
                                                                );
                                                            }
                                                            return false;
                                                        })}
                                                    </Nav>
                                                </Col>
                                                <Col md={9} className="py-5">
                                                    <Tab.Content>
                                                        {showadjuntos.map((adjunto, key) => {
                                                            if (proyecto[adjunto.value].length) {
                                                                return (
                                                                    <Tab.Pane key={key} eventKey={adjunto.value}>
                                                                        {adjunto.value ===
                                                                            "propuestas_arquitectonicas_preliminares" ? (
                                                                            <>
                                                                                <div className="font-weight-bolder text-center mb-5 font-size-h5 listado-planos d-flex align-items-center place-content-center ">
                                                                                    Listado de planos
                                                                                </div>
                                                                                <div className="row justify-content-center d-grid">
                                                                                    {proyecto[adjunto.value].map(
                                                                                        (adjunto, index) => {
                                                                                            return (
                                                                                                <div
                                                                                                    className="mb-1"
                                                                                                    key={index}
                                                                                                >
                                                                                                    <i className="fa fa-genderless text-primary icon-md mr-3"></i>
                                                                                                    <a
                                                                                                        href={adjunto.url}
                                                                                                        target="_blank"
                                                                                                        rel="noopener noreferrer"
                                                                                                        className="font-weight-normal font-size-h6 text-dark-75 text-hover-primary a-name-planos"
                                                                                                    >
                                                                                                        {this.nameAdjunto(
                                                                                                            adjunto.name
                                                                                                        )}
                                                                                                    </a>
                                                                                                </div>
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                {proyecto ? (
                                                                                    proyecto[adjunto.value].length ? (
                                                                                        <div className="mb-5 d-flex justify-content-center">
                                                                                            <span
                                                                                                className="btn btn-sm font-weight-bolder text-success align-self-center font-size-lg box-shadow-button"
                                                                                                onClick={(e) => {
                                                                                                    e.preventDefault();
                                                                                                    this.getProyectoAdjuntosZip([
                                                                                                        adjunto.value,
                                                                                                    ]);
                                                                                                }}
                                                                                            >
                                                                                                <i className="la la-file-archive icon-xl text-success"></i>{" "}
                                                                                                Descargar ZIP
                                                                                            </span>
                                                                                        </div>
                                                                                    ) : (
                                                                                        ""
                                                                                    )
                                                                                ) : (
                                                                                    ""
                                                                                )}
                                                                                {proyecto ? (
                                                                                    <ItemSlider
                                                                                        items={proyecto[adjunto.value]}
                                                                                        item={adjunto.value}
                                                                                    />
                                                                                ) : (
                                                                                    ""
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </Tab.Pane>
                                                                );
                                                            }
                                                            return false;
                                                        })}
                                                    </Tab.Content>
                                                </Col>
                                            </Row>
                                        </Tab.Container>
                                    </div>
                                </Element>
                            ) : (
                                ""
                            )}
                            <Element
                                name="presupuestos"
                                className="presupuestos bg-presupuestos section"
                            >
                                <div className="container">
                                    <div className="header-section link-durante-obra">
                                        Durante obra
                                    </div>
                                    <div className="title-proyecto">PRESUPUESTOS</div>
                                    <div className="font-weight-lighter font-size-lg text-center px-10 mb-8 col-md-8 mx-auto">
                                        En la siguiente sección, se muestra un listado de los
                                        presupuestos generados en dos secciones, el primero son los
                                        presupuestos del proyecto seleccionado y el segundo todos
                                        los presupuestos de todos los proyectos asignados.
                                    </div>
                                    <TablePresupuestos
                                        presupuestos={presupuestos}
                                        openModalSee={this.openModalSee}
                                        presupuestos_info={presupuestos_info}
                                        onClickNext={this.nextPagePresupuesto}
                                        onClickPrev={this.prevPagePresupuesto}
                                        typePresupuesto={typePresupuesto}
                                        openFilter={this.openFilter}
                                        changeTicketTab={this.onChangePresupuestoTab}
                                    />
                                </div>
                            </Element>
                            {proyecto.avances.length ? (
                                <Element
                                    name="avances"
                                    className="avances bg-white section border-y-blue "
                                >
                                    <div className="container">
                                        <div className="header-section link-durante-obra">
                                            Durante obra
                                        </div>
                                        <div className="title-proyecto">AVANCES POR SEMANA</div>
                                        <div className="font-weight-lighter font-size-lg text-center px-10 mb-8 col-md-8 mx-auto">
                                            En la siguiente sección, se muestra el trabajo realizado
                                            de acuerdo a la semana, donde se describen las actividades
                                            que se realizaron, el porcentaje del avance y evidencia
                                            fotográfica, con el objetivo de comparar el progreso de
                                            cada semana.
                                            <span className="font-weight-normal">
                                                <span className="font-weight-bolder"> Nota:</span> Para
                                                ver el adjunto, da clic en la semana.
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <SVG
                                                src={toAbsoluteUrl("/images/svg/Avances-Proyecto.svg")}
                                                style={{ width: "40%" }}
                                            />
                                        </div>
                                        <div className="row mx-0 mt-12 d-flex justify-content-center">
                                            {proyecto.avances.map((avance, key) => {
                                                return (
                                                    <div className="col-md-4 mt-4 mt-lg-0" key={key}>
                                                        <div className="box">
                                                            <a
                                                                rel="noopener noreferrer"
                                                                target="_blank"
                                                                href={avance.pdf}
                                                            >
                                                                SEMANA {avance.semana}
                                                            </a>
                                                            <p>{avance.actividades}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </Element>
                            ) : (
                                ""
                            )}
                            <Element name="tickets" className="bg-presupuestos section">
                                <div className="header-section link-termino-obra">
                                    Al termino de obra
                                </div>
                                <div className="title-proyecto">TICKETS</div>
                                <div className="font-weight-lighter font-size-lg text-center px-10 mb-8 col-md-8 mx-auto">
                                    En este apartado podrás mandar una solicitud de alguna falla
                                    que tengas en el proyecto, solo deberás dar clic en{" "}
                                    <span className="font-weight-bolder">“Nuevo ticket”</span>, el
                                    cual abrirá una ventana donde podrás describirnos el problema
                                    que tienes y adjuntar o tomar fotografías, con el objetivo de
                                    brindarte una pronta solución.
                                </div>
                                <TableTickets
                                    tickets={tickets}
                                    openModalSee={this.openModalSee}
                                    openModalDetalles={this.openModalDetalles}
                                    tickets_info={tickets_info}
                                    onClickNext={this.nextPageTicket}
                                    onClickPrev={this.prevPageTicket}
                                    tipoTickets={tipoTickets}
                                    openModalLevantamiento={this.openModalLevantamiento}
                                    openFilter={this.openFilter}
                                    changeTicketTab={this.onChangeTicketTab}
                                />
                            </Element>
                            {proyecto.equipos_instalados.length ? (
                                <Element
                                    name="mantenimiento"
                                    className="section border-y-blue position-relative"
                                >
                                    <div className="header-section link-termino-obra">
                                        Al termino de obra
                                    </div>
                                    <div className="title-proyecto">MANTENIMIENTO</div>
                                    <div className="font-weight-lighter font-size-lg text-center px-10 mb-8 col-md-8 mx-auto">
                                        En esta sección se agregarán al calendario y al listado los
                                        mantenimientos preventivos o correctivos programados en la
                                        obra.
                                        <span className="font-weight-normal">
                                            <span className="font-weight-bolder"> Nota:</span> En el
                                            calendario puedes encontrar información detallada de la
                                            instalación/mantenimiento preventivo o correctivo y en el
                                            listado podrás encontrar el estatus del mantenimiento, el
                                            presupuesto y el costo del mismo y si lo deseas puedes
                                            filtrar la información de acuerdo a tus necesidades.
                                        </span>
                                    </div>
                                    <div className="col-md-11 mx-auto">
                                        <div className="justify-content-center mb-5 text-center">
                                            <span
                                                className={`btn btn-sm btn-bg-light font-weight-bolder font-size-13px box-shadow-button text--${activeFlag === "tabla" ? "primary" : "info"
                                                    } btn-text-${activeFlag === "tabla" ? "primary" : "info"
                                                    } btn-hover-light-${activeFlag === "tabla" ? "primary" : "info"
                                                    }`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    this.changeActiveFlag();
                                                }}
                                            >
                                                <i
                                                    className={`flaticon2-${activeFlag === "tabla" ? "calendar-8" : "list-2"
                                                        } mr-2 icon-xl`}
                                                ></i>
                                                {`${activeFlag === "tabla"
                                                        ? "MOSTRAR CALENDARIO"
                                                        : "MOSTRAR LISTA"
                                                    }`}
                                            </span>
                                        </div>
                                        {activeFlag === "calendario" ? (
                                            <FullCalendar
                                                locale={esLocale}
                                                plugins={[
                                                    dayGridPlugin,
                                                    interactionPlugin,
                                                    bootstrapPlugin,
                                                ]}
                                                initialView="dayGridMonth"
                                                weekends={true}
                                                events={events}
                                                eventContent={this.renderEventContent}
                                                firstDay={1}
                                                themeSystem="bootstrap"
                                                height="1290.37px"
                                            />
                                        ) : (
                                            <TableMantenimiento
                                                mantenimientos={mantenimientos}
                                                form={form}
                                                options={options}
                                                onChange={this.onChange}
                                                onChangeRange={this.onChangeRange}
                                                filtrarTabla={this.filtrarTabla}
                                                cleanForm={this.cleanForm}
                                            />
                                        )}
                                    </div>
                                </Element>
                            ) : (
                                <></>
                            )}
                        </>
                    )}
                    {user.tipo.tipo !== "Cliente" ? (
                        <a
                            href={link_url}
                            className="back-to-top d-flex align-items-center justify-content-center"
                        >
                            <i className="la la-arrow-right"></i>
                        </a>
                    ) : (
                        <span
                            onClick={() => {
                                questionAlertY("Cerrarás sesión", "¿DESEAS CONTINUAR?", () => {
                                    this.logoutUserAxios();
                                });
                            }}
                            className="back-to-top d-flex align-items-center justify-content-center btn btn-icon btn-light-youtube"
                        >
                            <i className="las la-sign-out-alt icon-2x" />
                        </span>
                    )}
                </div>

                <Modal
                    size="lg"
                    title="Levantamiento de tickets"
                    show={modal.tickets}
                    handleClose={this.handleClose}
                    customcontent={true}
                    contentcss="modal modal-sticky modal-sticky-bottom-right d-block modal-sticky-lg modal-dialog modal-dialog-scrollable"
                >
                    <Form
                        id="form-miproyecto"
                        onSubmit={(e) => {
                            e.preventDefault();
                            validateAlert(this.addTicketAxios, e, "form-miproyecto");
                        }}
                    >
                        <div className="form-group row form-group-marginless mx-0 mt-3">
                            <div className="col-md-12">
                                <InputGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withplaceholder={1}
                                    withicon={0}
                                    withformgroup={0}
                                    requirevalidation={1}
                                    formeditado={formeditado}
                                    as="textarea"
                                    placeholder="DESCRIPCIÓN DEL PROBLEMA"
                                    rows="2"
                                    value={form.descripcion}
                                    name="descripcion"
                                    onChange={this.onChange}
                                    messageinc="Incorrecto. Ingresa una descripción."
                                />
                            </div>
                        </div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12">
                                <ItemSlider
                                    items={form.adjuntos.fotos.files}
                                    handleChange={this.handleChange}
                                    item="fotos"
                                />
                            </div>
                        </div>
                        <div className="card-footer p-0 pt-5">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-right px-0">
                                    <Button
                                        text="SOLICITAR"
                                        type="submit"
                                        className="btn btn-primary"
                                        icon=""
                                    />
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal>
                <Modal
                    size="lg"
                    title="Presupuesto"
                    show={modal.single}
                    handleClose={this.handleClose}
                    customcontent={true}
                    contentcss="modal modal-sticky modal-sticky-bottom-right d-block modal-sticky-lg modal-dialog modal-dialog-scrollable"
                >
                    <div className="mt-4">
                        {ticket ? (
                            <ItemSlider items={ticket.presupuesto} item="presupuesto" />
                        ) : (
                            ""
                        )}
                    </div>
                </Modal>
                <Modal
                    size="lg"
                    title="Detalles del levantamiento"
                    show={modal.details}
                    handleClose={this.handleClose}
                    customcontent={true}
                    contentcss="modal modal-sticky modal-sticky-bottom-right d-block modal-sticky-lg modal-dialog modal-dialog-scrollable"
                >
                    {ticket ? (
                        <>
                            <div className="d-flex justify-content-center align-items-center my-5 row mx-0">
                                {ticket.fecha_programada ? (
                                    <div className="col-md-6 d-flex align-items-center justify-content-center px-0">
                                        <div className="symbol symbol-35 symbol-light-primary mr-3 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-primary svg-icon-lg">
                                                    <SVG
                                                        src={toAbsoluteUrl("/images/svg/Building.svg")}
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column font-weight-bold">
                                            <div className="text-dark mb-1">
                                                {dayDMY(ticket.fecha_programada)}
                                            </div>
                                            <span className="text-muted ">FECHA PROGRAMADA</span>
                                        </div>
                                    </div>
                                ) : (
                                    <></>
                                )}
                                {ticket.tecnico_asiste ? (
                                    <div className="col-md-6 d-flex align-items-center justify-content-center px-0">
                                        <div className="symbol symbol-35 symbol-light-primary mr-3 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-primary svg-icon-lg">
                                                    <SVG src={toAbsoluteUrl("/images/svg/clock.svg")} />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column font-weight-bold">
                                            <div className="text-dark mb-1">
                                                {ticket.tecnico_asiste}
                                            </div>
                                            <span className="text-muted ">TÉCNICO QUE ASISTE</span>
                                        </div>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                            {ticket.descripcion_solucion !== "null" ? (
                                <p className="text-justify font-size-lg mt-7 mb-0 font-weight-light">
                                    <span className="font-weight-bold mr-2">
                                        Descripción de los trabajos realizados:
                                    </span>
                                    {ticket.descripcion_solucion}
                                </p>
                            ) : (
                                <></>
                            )}
                            {ticket.reporte_url ? (
                                <div className="text-center mt-5">
                                    <a
                                        type="button"
                                        href={ticket.reporte_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-bg-light btn-icon-success btn-hover-light-success text-success font-weight-bolder font-size-13px text-uppercase btn btn-primary"
                                    >
                                        <i className="las la-file-pdf icon-xl mr-2 px-0 text-success"></i>
                                        VER REPORTE
                                    </a>
                                </div>
                            ) : (
                                <></>
                            )}
                        </>
                    ) : (
                        ""
                    )}
                </Modal>
                {mantenimiento !== "" && (
                    <Modal
                        size="lg"
                        title={
                            <span>
                                <i
                                    className={`${mantenimiento.iconClass} icon-lg mr-2
                                ${mantenimiento.tipo === "Instalación"
                                            ? "color-instalacion"
                                            : mantenimiento.tipo ===
                                                "Mantenimiento correctivo"
                                                ? "color-mantenimiento"
                                                : "color-mantenimiento-preventivo"
                                        }`}
                                ></i>
                                {`${mantenimiento.tipo} de ${mantenimiento.instalacion.equipo.equipo}`}
                            </span>
                        }
                        show={modal.mantenimiento}
                        handleClose={this.handleClose}
                        classBody="bg-light"
                    >
                        <DetailsInstalacion instalacion={mantenimiento} />
                    </Modal>
                )}
                <Modal
                    size="lg"
                    title={`Filtrado de ${typeForm}s`}
                    show={modal.filterTickets}
                    handleClose={this.handleCloseFilter}
                    contentcss="bg-light"
                    bgHeader="border-0"
                >
                    <FormFilterTickets
                        form={
                            typeForm === "ticket"
                                ? form.filterTickets
                                : form.filterPresupuestos
                        }
                        options={options}
                        onChange={this.onChangeType}
                        typeForm={typeForm}
                        onChangeRange={this.onChangeRangeFilter}
                        onSubmit={this.filterTickets}
                    />
                </Modal>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        authUser: state.authUser,
    };
};
const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
    login: (payload) => dispatch(login(payload)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Miproyecto);