import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { Modal, ModalDelete } from '../../../components/singles'
import { AvanceForm } from '../../../components/forms'
import axios from 'axios'
import { URL_DEV, PROYECTOS_COLUMNS, URL_ASSETS } from '../../../constants'
import { Small } from '../../../components/texts'
import swal from 'sweetalert'
import { Card } from 'react-bootstrap'
import { setTextTable, setDateTable, setArrayTable, setListTable, setLabelTable } from '../../../functions/setters'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { errorAlert, waitAlert, forbiddenAccessAlert, doneAlert } from '../../../functions/alert'
import ItemSlider from '../../../components/singles/ItemSlider'
import { Nav, Tab, Col, Row } from 'react-bootstrap'
import { ProyectosCard } from '../../../components/cards'
const $ = require('jquery');
class Proyectos extends Component {
    state = {
        proyectos: [],
        title: 'Nuevo proyecto',
        prospecto: '',
        proyecto: '',
        modal: false,
        modalDelete: false,
        modalAdjuntos: false,
        modalAvances: false,
        adjuntos: [],
        primeravista: true,
        defaultactivekey: "",
        showadjuntos: [
            {
                placeholder: 'Fotografías levantamiento',
                id: 'fotografias_levantamiento',
                value: '',
                files: []
            },
            {
                placeholder: 'Manuales de adaptación',
                id: 'manuales_de_adaptacion',
                value: '',
                files: []
            },
            {
                placeholder: 'Minutas',
                id: 'minutas',
                value: '',
                files: []
            },
            {
                placeholder: 'Oficios',
                id: 'oficios',
                value: '',
                files: []
            },
            {
                placeholder: 'Planos entregados por cliente',
                id: 'planos_entregados_por_cliente',
                value: '',
                files: []
            },
            {
                placeholder: 'Propuestas arquitectónicas preliminares',
                id: 'propuestas_arquitectonicas_preliminares',
                value: '',
                files: []
            },
            {
                placeholder: 'Referencias del diseño del proyecto',
                id: 'referencias_del_diseño_del_proyecto',
                value: '',
                files: []
            },
            {
                placeholder: 'Renders',
                id: 'renders',
                value: '',
                files: []
            },
            {
                placeholder: 'Sketch Up',
                id: 'sketch_up',
                value: '',
                files: []
            },
            {
                placeholder: 'Presupuestos preliminares',
                id: 'presupuestos_preliminares',
                value: '',
                files: []
            },
            {
                placeholder: 'Carta oferta',
                id: 'carta_oferta',
                value: '',
                files: []
            }
        ],
        data: {
            proyectos: []
        },
        formeditado: 0,
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date(),
            semana: '',
            nombre: '',
            cliente: '',
            contacto: '',
            numeroContacto: '',
            empresa: '',
            cp: '',
            estado: '',
            municipio: '',
            calle: '',
            colonia: '',
            porcentaje: '',
            descripcion: '',
            correos: [],
            correo: '',
            adjuntos_grupo: [
                {
                    text: 'Inicio y planeación',
                    id: 'inicio_y_planeacion',
                    adjuntos: [
                        {
                            placeholder: 'Fotografías levantamiento',
                            id: 'fotografias_levantamiento',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Manuales de adaptación',
                            id: 'manuales_de_adaptacion',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Minutas',
                            id: 'minutas',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Oficios',
                            id: 'oficios',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Planos entregados por cliente',
                            id: 'planos_entregados_por_cliente',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Propuestas arquitectónicas preliminares',
                            id: 'propuestas_arquitectonicas_preliminares',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Referencias del diseño del proyecto',
                            id: 'referencias_del_diseño_del_proyecto',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Renders',
                            id: 'renders',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Sketch Up',
                            id: 'sketch_up',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Presupuestos preliminares',
                            id: 'presupuestos_preliminares',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Carta oferta',
                            id: 'carta_oferta',
                            value: '',
                            files: []
                        }
                    ]
                },
                {
                    text: 'Ejecución de obra',
                    id: 'ejecucion_de_obra',
                    adjuntos: [
                        {
                            placeholder: 'Datos de cliente',
                            id: 'datos_de_cliente',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Contrato cliente',
                            id: 'contrato_cliente',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Contrato proveedores y contratistas',
                            id: 'contrato_proveedores_y_contratistas',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Firmas de aprobación',
                            id: 'firmas_de_aprobacion',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Reporte fotográfico de avance de obra',
                            id: 'reporte_fotografico_de_avance_de_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Reporte de materiales',
                            id: 'reporte_de_materiales',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Reporte de proyecto vs ejecutado',
                            id: 'reporte_de_proyecto_vs_ejecutado',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Minutas de obra',
                            id: 'minutas_de_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Presupuesto aprobado por cliente',
                            id: 'presupuesto_aprobado_por_cliente',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Programa de obra',
                            id: 'programa_de_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Planos durante obra',
                            id: 'planos_durante_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Sketch Up aprobados',
                            id: 'sketch_up_aprobados',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Renders aprobados',
                            id: 'renders_aprobados',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Estados de cuenta',
                            id: 'estados_de_cuenta',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Estimaciones y cierre',
                            id: 'estimaciones_y_cierre',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Fianzas y seguros',
                            id: 'fianzas_y_seguros',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Permisos de obra ante dependencias',
                            id: 'permisos_de_obra_ante_dependencias',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Presupuestos extras',
                            id: 'presupuestos_extras',
                            value: '',
                            files: []
                        }
                    ]
                },
                {
                    text: 'Entrega',
                    id: 'entrega',
                    adjuntos: [
                        {
                            placeholder: 'Catálogo de conceptos ASBUILT',
                            id: 'catalogo_de_conceptos_asbuilt',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Consignas de matenimiento',
                            id: 'consignas_de_matenimiento',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Planos aprobados',
                            id: 'planos_aprobados',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Garantía de los equipos',
                            id: 'garantia_de_los_equipos',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Garantía de vicios ocultos',
                            id: 'garantia_de_vicios_ocultos',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Memorias de cálculo',
                            id: 'memorias_de_calculo',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Memorias descriptivas',
                            id: 'memorias_descriptivas',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Fichas técnicas',
                            id: 'fichas_tecnicas',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Pruebas de instalaciones',
                            id: 'pruebas_de_instalaciones',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Fotografías fin de obra',
                            id: 'fotografias_fin_de_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Acta de entrega',
                            id: 'acta_de_entrega',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Carpeta de entrega ZIP',
                            id: 'carpeta_de_entrega_zip',
                            value: '',
                            files: []
                        },
                    ]
                },
                {
                    text: 'Mantenimiento',
                    id: 'mantenimiento',
                    adjuntos: [
                        {
                            placeholder: 'Fallas y reparaciones por vicios ocultos',
                            id: 'fallas_y_reparaciones_por_vicios_ocultos',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Mantenimiento preventivo',
                            id: 'mantenimiento_preventivo',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Mantenimiento correctivo',
                            id: 'mantenimiento_correctivo',
                            value: '',
                            files: []
                        },
                    ]
                },
            ],
            adjuntos: {
                image: {
                    value: '',
                    placeholder: 'Imagen',
                    files: []
                }
            },
            avances: [
                {
                    descripcion: '',
                    avance: '',
                    adjuntos: {
                        value: '',
                        placeholder: 'Fotos del avance',
                        files: []
                    }
                }
            ]
        },
        options: {
            clientes: [],
            empresas: [],
            colonias: []
        }
    }

    seleccionaradj(adjuntos) {
        const { proyecto } = this.state;
        let newdefaultactivekey = "";
        for (var i = 0; i < adjuntos.length; i++) {
            var adjunto = adjuntos[i];
            if (proyecto[adjunto.id].length) {
                newdefaultactivekey = adjunto.id
                break;
            }
        }
        this.setState({
            ... this.state,
            primeravista: false,
            defaultactivekey: newdefaultactivekey,
            subActiveKey: newdefaultactivekey,
            showadjuntos: adjuntos
        })
    }
    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const proyectos = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        })
        if (!proyectos)
            history.push('/')
        // this.getProyectosAxios()
    }
    updateActiveTabContainer = active => {
        this.setState({
            ... this.state,
            subActiveKey: active
        })
    }
    openModalDelete = proyecto => {
        this.setState({
            ... this.state,
            proyecto: proyecto,
            modalDelete: true
        })
    }
    changePageEdit = proyecto => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/proyectos/edit',
            state: { proyecto: proyecto }
        });
    }
    openModalAvances = proyecto => {
        this.setState({
            ... this.state,
            modalAvances: true,
            title: 'Avances del proyecto',
            proyecto: proyecto,
            form: this.clearForm(),
            formeditado: 0,
        })
    }
    openModalAdjuntos = proyecto => {
        let { adjuntos } = this.state
        let auxheaders = [
        ]
        this.setState({
            ... this.state,
            modalAdjuntos: true,
            adjuntos: this.setAdjuntosSlider(proyecto),
            proyecto: proyecto,
            form: this.clearForm(),
            formeditado: 0,
        })
    }
    openModalSee = proyecto => {
        this.setState({
            ... this.state,
            modalSee: true,
            proyecto: proyecto
        })
    }
    handleCloseSee = () => {
        this.setState({
            ... this.state,
            modalSee: false,
            proyecto: ''
        })
    }
    setAdjuntosSlider = proyecto => {
        let auxheaders = []
        let aux = []
        auxheaders.map((element) => {
            aux.push({
                id: element.name,
                text: element.placeholder,
                files: proyecto[element.name],
                form: element.form,
                url: ''
            })
        })
        return aux
    }
    handleCloseAvances = () => {
        const { modalAvances } = this.state
        this.setState({
            ... this.state,
            modalAvances: !modalAvances,
            form: this.clearForm(),
            proyecto: ''
        })
    }
    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            proyecto: '',
            prospecto: ''
        })
    }
    handleCloseAdjuntos = () => {
        const { modalAdjuntos } = this.state
        this.setState({
            ... this.state,
            modalAdjuntos: !modalAdjuntos,
            proyecto: '',
            prospecto: '',
            form: this.clearForm()
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
    onChangeAvance = (key, e, name) => {
        const { value } = e.target
        const { form } = this.state
        form['avances'][key][name] = value
        this.setState({
            ...this.state,
            form
        })

    }
    onChangeAdjuntoAvance = (e, key, name) => {
        const { form } = this.state
        const { files, value } = e.target
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
        form['avances'][key][name].value = value
        form['avances'][key][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }
    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
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
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }
    onChangeAdjuntoGrupo = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let grupo = 0
        let adjunto = 0
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
        for (let i = 0; i < form.adjuntos_grupo.length; i++) {
            for (let j = 0; j < form.adjuntos_grupo[i].adjuntos.length; j++) {
                if (form.adjuntos_grupo[i].adjuntos[j].id === name) {
                    grupo = i;
                    adjunto = j;
                }
            }
        }
        form.adjuntos_grupo[grupo].adjuntos[adjunto].value = value
        form.adjuntos_grupo[grupo].adjuntos[adjunto].files = aux
        this.setState({
            ... this.state,
            form
        })
    }
    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form['adjuntos'][name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form['adjuntos'][name].files[counter])
            }
        }
        if (aux.length < 1) {
            form['adjuntos'][name].value = ''
        }
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }
    clearFilesGrupo = (name, key) => {
        const { form } = this.state
        let aux = []
        let grupo = 0
        let adjunto = 0
        for (let i = 0; i < form.adjuntos_grupo.length; i++) {
            for (let j = 0; j < form.adjuntos_grupo[i].adjuntos.length; j++) {
                if (form.adjuntos_grupo[i].adjuntos[j].id === name) {
                    grupo = i;
                    adjunto = j;
                }
            }
        }
        for (let counter = 0; counter < form.adjuntos_grupo[grupo].adjuntos[adjunto].files.length; counter++) {
            if (counter !== key) {
                aux.push(form.adjuntos_grupo[grupo].adjuntos[adjunto].files[counter])
            }
        }
        if (aux.length < 1) {
            form.adjuntos_grupo[grupo].adjuntos[adjunto].value = ''
        }
        form.adjuntos_grupo[grupo].adjuntos[adjunto].files = aux
        this.setState({
            ... this.state,
            form
        })
    }
    clearFilesAvances = (name, key, _key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form.avances[_key].adjuntos.files.length; counter++) {
            if (counter !== key) {
                aux.push(form.avances[_key].adjuntos.files[counter])
            }
        }
        if (aux.length < 1) {
            form.avances[_key].adjuntos.files = []
            form.avances[_key].adjuntos.value = ''
        }
        form.avances[_key].adjuntos.files = aux
        this.setState({
            ... this.state,
            form
        })
    }
    addRowAvance = () => {
        const { form } = this.state
        form.avances.push(
            {
                descripcion: '',
                adjuntos: {
                    value: '',
                    placeholder: 'Fotos del avance',
                    files: []
                }
            }
        )
        this.setState({
            ... this.state,
            form
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
                case 'avances':
                    form[element] = [{
                        descripcion: '',
                        avance: '',
                        adjuntos: {
                            value: '',
                            placeholder: 'Fotos del avance',
                            files: []
                        }
                    }]
                    break;
                case 'adjuntos':
                case 'adjuntos_grupo':
                    break;
                case 'correos':
                    form[element] = []
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            form.adjuntos[element].value = ''
            form.adjuntos[element].files = []
        })
        form.adjuntos_grupo.map((grupo) => {
            grupo.adjuntos.map((adjunto) => {
                adjunto.value = ''
                adjunto.files = []
            })
        })
        return form
    }
    deleteFile = element => {
        swal({
            title: '¿Deseas eliminar el archivo?',
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: null,
                    visible: true,
                    className: "button__green btn-primary cancel",
                    closeModal: true,
                },
                confirm: {
                    text: "Aceptar",
                    value: true,
                    visible: true,
                    className: "button__red btn-primary",
                    closeModal: true
                }
            }
        }).then((result) => {
            if (result) {
                this.deleteAdjuntoAxios(element.id)
            }
        })
    }
    handleChange = (files, item) => {

        this.onChangeAdjuntoGrupo({ target: { name: item, value: files, files: files } })
        swal({
            title: '¿Confirmas el envio de adjuntos?',
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: null,
                    visible: true,
                    className: "button__red btn-primary cancel",
                    closeModal: true,
                },
                confirm: {
                    text: "Aceptar",
                    value: true,
                    visible: true,
                    className: "button__green btn-primary",
                    closeModal: true
                }
            }
        }).then((result) => {
            if (result) {
                waitAlert()
                this.addProyectoAdjuntoAxios(item)
            }
        })
    }
    onSubmitAvance = e => {
        e.preventDefault()
        waitAlert();
        this.addAvanceAxios()
    }
    safeDelete = (e) => () => {
        this.deleteProyectoAxios()
    }
    setProyectos = proyectos => {
        let aux = []
        proyectos.map((proyecto) => {
            aux.push({
                actions: this.setActions(proyecto),
                status: renderToString(setLabelTable(proyecto.estatus)),
                nombre: renderToString(setTextTable(proyecto.nombre)),
                cliente: renderToString(setListTable(proyecto.clientes, 'empresa')),
                direccion: renderToString(this.setDireccionTable(proyecto)),
                contacto: renderToString(setArrayTable(
                    [
                        { name: 'Nombre', text: proyecto.contacto },
                        { name: 'Teléfono', text: proyecto.numero_contacto, url: `tel:+${proyecto.numero_contacto}` }
                    ])),
                empresa: renderToString(setTextTable(proyecto.empresa ? proyecto.empresa.name : '')),
                porcentaje: renderToString(setTextTable(proyecto.porcentaje + '%')),
                fechaInicio: renderToString(setDateTable(proyecto.fecha_inicio)),
                descripcion: renderToString(setTextTable(proyecto.descripcion)),
                fechaFin: renderToString(proyecto.fecha_fin !== null ? setDateTable(proyecto.fecha_fin) : setTextTable('Sin definir')),
                adjuntos: renderToString(this.setAdjuntosTable(proyecto)),
                fases: renderToString(setListTable(this.setFasesList(proyecto), 'text')),
                id: proyecto.id
            })
        })
        return aux
    }
    setFasesList = proyecto => {
        let aux = [];
        if(proyecto.fase1)
            aux.push({text: 'FASE 1'})
        if(proyecto.fase2)
            aux.push({text: 'FASE 2'})
        if(proyecto.fase3)
            aux.push({text: 'FASE 3'})
        return aux
    }
    setAdjuntosTable = proyecto => {
        return (
            <>
                {
                    proyecto.imagen ?
                        setArrayTable(
                            [
                                { name: 'Imagen', text: proyecto.imagen.name, url: proyecto.imagen.url }
                            ]
                        )
                        : ''
                }
                {
                    proyecto.adjuntos.length === 0 && !proyecto.imagen ?
                        <Small>
                            Sin adjuntos
                        </Small>
                        : ''
                }
            </>
        )
    }

    setActions = () => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' }
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' }
            },
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            },
            {
                text: 'Adjuntos',
                btnclass: 'info',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            },
            {
                text: 'Avances',
                btnclass: 'dark',
                iconclass: 'flaticon2-photo-camera',
                action: 'avances',
                tooltip: { id: 'avances', text: 'Avances' }
            }
        )
        return aux
    }
    setDireccionTable = proyecto => {
        return (
            <>
                <Small className="mr-1">
                    {proyecto.calle}, colonia
                </Small>
                <Small className="mr-1">
                    {proyecto.colonia},
                </Small>
                <Small className="mr-1">
                    {proyecto.municipio},
                </Small>
                <Small className="mr-1">
                    {proyecto.estado}. CP:
                </Small>
                <Small className="mr-1">
                    {proyecto.cp}
                </Small>
            </>
        )
    }
    async getProyectoAdjuntosZip(array) {
        const { access_token } = this.props.authUser
        const { proyecto } = this.state
        let aux = { tipo: array }
        waitAlert()
        await axios.post(URL_DEV + 'proyectos/' + proyecto.id + '/adjuntos/zip', aux, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const url = URL_ASSETS + '/storage/adjuntos.zip'
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', proyecto.nombre + '.zip'); //or any other extension
                document.body.appendChild(link);
                link.click();
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
    async deleteProyectoAxios() {
        const { access_token } = this.props.authUser
        const { proyecto } = this.state
        await axios.delete(URL_DEV + 'proyectos/' + proyecto.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyectos } = response.data
                const { data } = this.state
                data.proyectos = proyectos
                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue eliminado con éxito.')
                this.setState({
                    ...this.state,
                    proyectos: this.setProyectos(proyectos),
                    modalDelete: false,
                    proyecto: '',
                    data
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
    async deleteAdjuntoAxios(id) {
        const { access_token } = this.props.authUser
        const { proyecto } = this.state
        await axios.delete(URL_DEV + 'proyectos/' + proyecto.id + '/adjunto/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyecto, proyectos } = response.data
                const { data } = this.state
                // this.getClientesAxios()
                data.proyectos = proyectos

                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue registrado con éxito.')

                this.setState({
                    ... this.state,
                    proyecto: proyecto,
                    proyectos: this.setProyectos(proyectos),
                    adjuntos: this.setAdjuntosSlider(proyecto),
                    data
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
    async addAvanceAxios() {
        const { access_token } = this.props.authUser
        const { form, proyecto } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'semana':
                    data.append(element, form[element])
                    break;
                case 'avances':
                    break;
                case 'correos':
                    data.append(element, JSON.stringify(form[element]))
                    break;
                default:
                    break
            }
        })
        form.avances.map((avance, key) => {
            if (avance.adjuntos.value !== '') {
                for (var i = 0; i < avance.adjuntos.files.length; i++) {
                    data.append(`files_name[]`, avance.adjuntos.files[i].name)
                    data.append(`files[]`, avance.adjuntos.files[i].file)
                    data.append(`files_descripcion[]`, avance.descripcion)
                    data.append(`files_avance[]`, avance.avance)
                }
            }
        })

        await axios.post(URL_DEV + 'proyectos/' + proyecto.id + '/avances', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyecto, proyectos, avance } = response.data
                const { data } = this.state
                data.proyectos = proyectos

                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue registrado con éxito.')
                var win = window.open(avance.pdf, '_blank');
                win.focus();
                this.setState({
                    ... this.state,
                    proyecto: proyecto,
                    proyectos: this.setProyectos(proyectos),
                    form: this.clearForm(),
                    data
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
    async addProyectoAdjuntoAxios(name) {
        const { access_token } = this.props.authUser
        const { form, proyecto } = this.state
        const data = new FormData();
        data.append('tipo', name)
        let grupo = 0
        let adjunto = 0
        for (let i = 0; i < form.adjuntos_grupo.length; i++) {
            for (let j = 0; j < form.adjuntos_grupo[i].adjuntos.length; j++) {
                if (form.adjuntos_grupo[i].adjuntos[j].id === name) {
                    grupo = i;
                    adjunto = j;
                }
            }
        }
        form.adjuntos_grupo[grupo].adjuntos[adjunto].files.map((file) => {
            data.append(`files_name_${form.adjuntos_grupo[grupo].adjuntos[adjunto].id}[]`, file.name)
            data.append(`files_${form.adjuntos_grupo[grupo].adjuntos[adjunto].id}[]`, file.file)
        })
        await axios.post(URL_DEV + 'proyectos/' + proyecto.id + '/adjuntos', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyecto, proyectos } = response.data
                const { data } = this.state
                data.proyectos = proyectos
                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue registrado con éxito.')
                this.setState({
                    ... this.state,
                    proyecto: proyecto,
                    proyectos: this.setProyectos(proyectos),
                    adjuntos: this.setAdjuntosSlider(proyecto),
                    data
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
    sendMail = avance => {
        waitAlert();
        this.sendMailAvanceAxios(avance);
    }
    async sendMailAvanceAxios(avance) {
        const { access_token } = this.props.authUser
        const { proyecto } = this.state
        await axios.get(URL_DEV + 'proyectos/' + proyecto.id + '/avances/' + avance, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue editado con éxito.')
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

    async getProyectoAxios() {
        $('#proyecto').DataTable().ajax.reload();
    }

    render() {
        const { modalDelete, modalAdjuntos, modalAvances, title, form, proyecto, formeditado, showadjuntos, primeravista, subActiveKey, defaultactivekey, modalSee } = this.state
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <NewTableServerRender
                    columns={PROYECTOS_COLUMNS}
                    title='Proyectos'
                    subtitle='Listado de proyectos'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url='/proyectos/proyectos/add'
                    mostrar_acciones={true}
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete },
                        'adjuntos': { function: this.openModalAdjuntos },
                        'avances': { function: this.openModalAvances },
                        'see': { function: this.openModalSee }
                    }}
                    accessToken={this.props.authUser.access_token}
                    setter={this.setProyectos}
                    urlRender={URL_DEV + 'proyectos'}
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    idTable='cliente_table'
                />
                <ModalDelete title={"¿Estás seguro que deseas eliminar el proyecto?"} show={modalDelete} handleClose={this.handleCloseDelete} onClick={(e) => { this.safeDelete(e)() }}>
                </ModalDelete>

                <Modal size="xl" title="Adjuntos del proyecto" show={modalAdjuntos} handleClose={this.handleCloseAdjuntos} >
                    <div className="p-2">
                        <Card className="card-custom card-without-box-shadown">
                            <Card.Header className="pl-0 pr-0 justify-content-start">
                                <Card.Title>
                                    <h3 className="text-dark"></h3>
                                </Card.Title>
                                <div className="card-toolbar">
                                    <Nav as="ul" className="nav nav-bold nav-pills">
                                        {
                                            form.adjuntos_grupo.map((grupo, key) => {
                                                return (
                                                    <Nav.Item as="li" key={key}>
                                                        <Nav.Link data-toggle="tab" className={primeravista && key === 0 ? "active" : ""} eventKey={grupo.id} onClick={() => { this.seleccionaradj(grupo.adjuntos) }}>{grupo.text}</Nav.Link>
                                                    </Nav.Item>
                                                )
                                            })
                                        }
                                    </Nav>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Tab.Container id="left-tabs-example" activeKey={subActiveKey ? subActiveKey : defaultactivekey} defaultActiveKey={defaultactivekey}
                                    onSelect={(select) => { this.updateActiveTabContainer(select) }}>
                                    <Row>
                                        <Col md={4} className="navi navi-accent navi-hover navi-bold border-nav">
                                            <Nav variant="pills" className="flex-column navi navi-hover navi-active">
                                                {
                                                    showadjuntos.map((adjunto, key) => {
                                                        return (
                                                            <Nav.Item className="navi-item" key={key}>
                                                                <Nav.Link className="navi-link" eventKey={adjunto.id}>
                                                                    <span className="navi-text">{adjunto.placeholder}</span>
                                                                </Nav.Link>
                                                            </Nav.Item>
                                                        )
                                                    })
                                                }
                                            </Nav>
                                        </Col>
                                        <Col md={8} className="align-self-center">
                                            <Tab.Content>
                                                {
                                                    showadjuntos.map((adjunto, key) => {
                                                        return (
                                                            <Tab.Pane key={key} eventKey={adjunto.id} className="">
                                                                <>
                                                                    {
                                                                        proyecto ?
                                                                            proyecto[adjunto.id] ?
                                                                                proyecto[adjunto.id].length ?
                                                                                    <div className="mt-2 d-flex justify-content-center">
                                                                                        <span className='btn btn-hover btn-text-success' onClick={(e) => { e.preventDefault(); this.getProyectoAdjuntosZip([adjunto.id]) }}>
                                                                                            <i className="fas fa-file-archive"></i> Descargar ZIP
                                                                                        </span>
                                                                                    </div>
                                                                                    : ''
                                                                                : ''
                                                                            : ''
                                                                    }
                                                                    {
                                                                        proyecto ?
                                                                            proyecto[adjunto.id] ?
                                                                                <ItemSlider items={proyecto[adjunto.id]} handleChange={this.handleChange}
                                                                                    item={adjunto.id} deleteFile={this.deleteFile} />
                                                                                : ''
                                                                            : ''
                                                                    }
                                                                </>
                                                            </Tab.Pane>
                                                        )
                                                    })
                                                }
                                            </Tab.Content>
                                        </Col>
                                    </Row>
                                </Tab.Container>
                            </Card.Body>
                        </Card>
                    </div>
                </Modal>
                <Modal size="xl" title={title} show={modalAvances} handleClose={this.handleCloseAvances}>
                    <AvanceForm
                        form={form}
                        onChangeAvance={this.onChangeAvance}
                        onChangeAdjuntoAvance={this.onChangeAdjuntoAvance}
                        clearFilesAvances={this.clearFilesAvances}
                        addRowAvance={this.addRowAvance}
                        onSubmit={this.onSubmitAvance}
                        onChange={this.onChange}
                        proyecto={proyecto}
                        sendMail={this.sendMail}
                        formeditado={formeditado}
                    />
                </Modal>
                <Modal size="lg" title="Proyecto" show={modalSee} handleClose={this.handleCloseSee} >
                    <ProyectosCard
                        proyecto={proyecto}
                    />
                </Modal>
            </Layout>
        )
    }
}


const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Proyectos);