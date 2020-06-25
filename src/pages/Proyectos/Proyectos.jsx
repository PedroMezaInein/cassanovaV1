import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Modal, Card, Slider } from '../../components/singles'
import { Button } from '../../components/form-components'
import { faPlus, faTrash, faEdit, faMoneyBill, faFileAlt, faFileArchive, faEye, faPhone, faEnvelope, faLink } from '@fortawesome/free-solid-svg-icons'
import { ProyectosForm, AvanceForm } from '../../components/forms'
import axios from 'axios'
import { URL_DEV, CP_URL, GOLD, PROYECTOS_COLUMNS } from '../../constants'
import { DataTable } from '../../components/tables'
import { Small, B, Subtitle, P } from '../../components/texts'
import { FileInput } from '../../components/form-components'
import Moment from 'react-moment'
import NumberFormat from 'react-number-format';
import swal from 'sweetalert'
import { Form, Accordion } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { setOptions, setSelectOptions, setTextTable, setDateTable, setListTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList, setContactoTable } from '../../functions/setters'
import NewTable from '../../components/tables/NewTable'
import { errorAlert, waitAlert, forbiddenAccessAlert, createAlert } from '../../functions/alert'
import { forIn } from 'lodash'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import ItemSlider from '../../components/singles/ItemSlider'

function CustomToggle({ children, eventKey }) {

    let variable = false
    
    const handleClick = useAccordionToggle(eventKey, (e) => {
        if(variable){
            variable = false
        }else{
            variable = true
        }
    },);

    
    return (
        <div className="d-flex justify-content-between">
            <div>
                {children}
            </div>
            <Button name={eventKey} className="small-button " color="transparent" icon={faPlus} text='' onClick={handleClick} />
        </div>
    );
}
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
        data: {
            proyectos: []
        },
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
            adjuntos_grupo:[
                {
                    text: 'Inicio y planeación',
                    id: 'inicio_y_planeacion',
                    adjuntos:[
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
                    adjuntos:[
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
                        }
                    ]
                },
                {
                    text: 'Entrega',
                    id: 'entrega',
                    adjuntos:[
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
                    adjuntos:[
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
                },
                cotizacion: {
                    value: '',
                    placeholder: 'Cotización',
                    files: []
                },
                comprobantePagos: {
                    value: '',
                    placeholder: 'Comprobante de pagos',
                    files: []
                },
                catalogoConceptos: {
                    value: '',
                    placeholder: 'Catálogo de conceptos',
                    files: []
                },
                programasObra: {
                    value: '',
                    placeholder: 'Programas de obra',
                    files: []
                },
                descripcion: {
                    value: '',
                    placeholder: 'Descripción de los trabajos',
                    files: []
                },
                levantamientos: {
                    value: '',
                    placeholder: 'Levantamiento',
                    files: []
                },
                fotosDurante: {
                    value: '',
                    placeholder: 'Fotos durante',
                    files: []
                },
                fotosFin: {
                    value: '',
                    placeholder: 'Fotos fin',
                    files: []
                },
                planos: {
                    value: '',
                    placeholder: 'Planos',
                    files: []
                },
                renders: {
                    value: '',
                    placeholder: 'Renders',
                    files: []
                },
                fichasTecnicas: {
                    value: '',
                    placeholder: 'Fichas técnicas',
                    files: []
                },
                dictamenes: {
                    value: '',
                    placeholder: 'Dictámenes y memorias de cálculo',
                    files: []
                },
                mantenimiento: {
                    value: '',
                    placeholder: 'Consignas de mantenimiento',
                    files: []
                },
                moodboard: {
                    value: '',
                    placeholder: 'Moodboard',
                    files: []
                },
                diseñosAprobados: {
                    value: '',
                    placeholder: 'Diseños aprobados por cliente',
                    files: []
                },
                garantia: {
                    value: '',
                    placeholder: 'Garantía de vicios ocultos',
                    files: []
                },
                contratos: {
                    value: '',
                    placeholder: 'Contratos',
                    files: []
                }
            },
            avances:[
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

    constructor(props) {
        super(props);
        const { state } = props.location
        if (state) {
            this.state.modal = true
            this.state.title = 'Prospecto a convertir'
            this.getProspectoAxios(state.prospectos.id)
        }
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
        this.getProyectosAxios()
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true,
            title: 'Nuevo proyecto',
            prospecto: ''
        })
    }

    openModalDelete = (proyecto) => {
        this.setState({
            ... this.state,
            proyecto: proyecto,
            modalDelete: true
        })
    }

    openModalEdit = (proyecto) => {
        const { form, options } = this.state

        form.cp = proyecto.cp;
        this.cpAxios(proyecto.cp)
        form.calle = proyecto.calle

        form.nombre = proyecto.nombre
        form.contacto = proyecto.contacto
        form.numeroContacto = proyecto.numero_contacto

        form.fechaInicio = new Date(proyecto.fecha_inicio)
        form.fechaFin = new Date(proyecto.fecha_fin)

        form.porcentaje = proyecto.porcentaje
        form.descripcion = proyecto.descripcion
        if(proyecto.cliente)        
        form.cliente = proyecto.cliente.id.toString()   
        if(proyecto.empresa)     
        form.empresa = proyecto.empresa.id.toString()
        form.colonia = proyecto.colonia

        if (proyecto.imagen) {
            form.adjuntos.image.files = [{ name: proyecto.imagen.name, file: '', url: proyecto.imagen.url, key: 0 }]
        }


        this.setState({
            ... this.state,
            proyecto: proyecto,
            modal: true,
            title: 'Editar proyecto',
            form
        })
    }

    openModalAvances = proyecto => {

        this.setState({
            ... this.state,
            modalAvances: true,
            title: 'Avances del proyecto',
            proyecto: proyecto,
            form: this.clearForm(),
        })

    }

    openModalAdjuntos = proyecto => {

        let { adjuntos } = this.state

        let auxheaders = [
            /* { name: 'cotizaciones', placeholder: 'Cotización', form: 'cotizacion' },
            { name: 'comprobante_pagos', placeholder: 'Comprobante de pagos', form: 'comprobantePagos' },
            { name: 'catalogo_conceptos', placeholder: 'Catálogo de conceptos', form: 'catalogoConceptos' },
            { name: 'programas_obra', placeholder: 'Programas de obra', form: 'programasObra' },
            { name: 'descripcion', placeholder: 'Descripción de los trabajos', form: 'descripcion' },
            { name: 'levantamientos', placeholder: 'Levantamiento', form: 'levantamientos' },
            { name: 'fotos_durante', placeholder: 'Fotos durante', form: 'fotosDurante' },
            { name: 'fotos_fin', placeholder: 'Fotos fin', form: 'fotosFin' },
            { name: 'planos', placeholder: 'Planos', form: 'planos' },
            { name: 'renders', placeholder: 'Renders', form: 'renders' },
            { name: 'fichas_tecnicas', placeholder: 'Fichas técnicas', form: 'fichasTecnicas' },
            { name: 'dictamenes', placeholder: 'Dictámenes y memorias de cálculo', form: 'dictamenes' },
            { name: 'mantenimiento', placeholder: 'Consignas de mantenimiento', form: 'mantenimiento' },
            { name: 'moodboard', placeholder: 'Moodboard', form: 'moodboard' },
            { name: 'diseños_aprobados', placeholder: 'Diseños aprobados por cliente', form: 'diseñosAprobados' },
            { name: 'garantia', placeholder: 'Garantía de vicios ocultos', form: 'garantia' },
            { name: 'contratos', placeholder: 'Contratos', form: 'contratos' } */
        ]

        /* let aux = []

        auxheaders.map((element) => {
            aux.push({
                id: element.name,
                text: element.placeholder,
                files: proyecto[element.name],
                form: element.form,
                url: ''
            })
        })

        adjuntos = aux;
 */
        this.setState({
            ... this.state,
            modalAdjuntos: true,
            adjuntos: this.setAdjuntosSlider(proyecto),
            proyecto: proyecto,
            form: this.clearForm()
        })
    }

    setAdjuntosSlider = proyecto => {

        let auxheaders = [
            /* { name: 'cotizaciones', placeholder: 'Cotización', form: 'cotizacion' },
            { name: 'comprobante_pagos', placeholder: 'Comprobante de pagos', form: 'comprobantePagos' },
            { name: 'catalogo_conceptos', placeholder: 'Catálogo de conceptos', form: 'catalogoConceptos' },
            { name: 'programas_obra', placeholder: 'Programas de obra', form: 'programasObra' },
            { name: 'descripcion', placeholder: 'Descripción de los trabajos', form: 'descripcion' },
            { name: 'levantamientos', placeholder: 'Levantamiento', form: 'levantamientos' },
            { name: 'fotos_durante', placeholder: 'Fotos durante', form: 'fotosDurante' },
            { name: 'fotos_fin', placeholder: 'Fotos fin', form: 'fotosFin' },
            { name: 'planos', placeholder: 'Planos', form: 'planos' },
            { name: 'renders', placeholder: 'Renders', form: 'renders' },
            { name: 'fichas_tecnicas', placeholder: 'Fichas técnicas', form: 'fichasTecnicas' },
            { name: 'dictamenes', placeholder: 'Dictámenes y memorias de cálculo', form: 'dictamenes' },
            { name: 'mantenimiento', placeholder: 'Consignas de mantenimiento', form: 'mantenimiento' },
            { name: 'moodboard', placeholder: 'Moodboard', form: 'moodboard' },
            { name: 'diseños_aprobados', placeholder: 'Diseños aprobados por cliente', form: 'diseñosAprobados' },
            { name: 'garantia', placeholder: 'Garantía de vicios ocultos', form: 'garantia' },
            { name: 'contratos', placeholder: 'Contratos', form: 'contratos' } */
        ]

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

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            title: 'Nuevo proyecto',
            proyecto: '',
            form: this.clearForm()
        })
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
        form['avances'][key][name]  = value
        console.log(form.avances[key][name])
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

    onChangeAdjuntoGrupo = (e) => {
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
        for(let i = 0; i < form.adjuntos_grupo.length; i++){
            for(let j = 0; j < form.adjuntos_grupo[i].adjuntos.length; j++){
                if(form.adjuntos_grupo[i].adjuntos[j].id === name){
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

    onChangeCP = event => {
        const { value, name } = event.target
        this.onChange({ target: { name: name, value: value } })
        if (value.length === 5)
            this.cpAxios(value)
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
        for(let i = 0; i < form.adjuntos_grupo.length; i++){
            for(let j = 0; j < form.adjuntos_grupo[i].adjuntos.length; j++){
                if(form.adjuntos_grupo[i].adjuntos[j].id === name){
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
        form.adjuntos_grupo.map( (grupo) => {
            grupo.adjuntos.map( (adjunto) => {
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
                this.addProyectoAdjuntoAxios(item)
            }
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        swal({
            title: '¡Un momento!',
            text: 'La información está siendo procesada.',
            buttons: false
        })
        if (title === 'Editar proyecto')
            this.editProyectoAxios()
        else
            this.addProyectoAxios()
    }

    onSubmitAvance = e => {
        e.preventDefault()
        waitAlert();
        this.addAvanceAxios()
    }

    safeDelete = (e) => () => {
        this.deleteProyectoAxios()
    }

    setOptions = (arreglo, name, value) => {
        let aux = []
        arreglo.map((element) => {
            aux.push({ name: element[name], value: element[value].toString() })
        })
        return aux
    }

    setProyectos = proyectos => {
        let aux = []
        proyectos.map((proyecto) => {
            aux.push({
                actions: this.setActions(proyecto),
                nombre: renderToString(setTextTable(proyecto.nombre)),
                cliente: renderToString(setTextTable(proyecto.cliente ? proyecto.cliente.empresa : '')),
                direccion: renderToString(this.setDireccionTable(proyecto)),
                contacto: renderToString(setArrayTable(
                    [
                        { name: 'Nombre', text: proyecto.contacto },
                        { name: 'Teléfono', text: proyecto.numero_contacto, url: `tel:+${proyecto.numero_contacto}` }
                    ])),
                empresa: renderToString(setTextTable(proyecto.empresa ? proyecto.empresa.name : '')),
                porcentaje: renderToString(setTextTable(proyecto.porcentaje + '%')),
                fechaInicio: renderToString(setDateTable(proyecto.fecha_inicio)),
                fechaFin: renderToString(proyecto.fecha_fin !== null ? setDateTable(proyecto.fecha_fin) : setTextTable('Sin definir')),
                adjuntos: renderToString(this.setAdjuntosTable(proyecto)),
                id: proyecto.id
            })
        })
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

    setActions = concepto => {
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
                text: 'Adjuntos',
                btnclass: 'primary',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            },
            {
                text: 'Avances',
                btnclass: 'primary',
                iconclass: 'flaticon-photo-camera',
                action: 'avances',
                tooltip: { id: 'avances', text: 'Avances' }
            }
        )
        return aux
    }
    /*setActions = proyecto => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalEdit(e)(proyecto) } text='' icon={faEdit} color="transparent" 
                        tooltip={{id:'edit', text:'Editar'}} />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalDelete(e)(proyecto) } text='' icon={faTrash} color="red" 
                        tooltip={{id:'delete', text:'Eliminar', type:'error'}} />
                </div>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => { e.preventDefault(); this.openModalAdjuntos(proyecto)} } text='' icon={faLink} 
                        color="transparent" tooltip={{id:'adjuntos', text:'Adjuntos'}} />
                </div>
            </>
        )
    }*/

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

    setTextTable = text => {
        return (
            <Small>
                {
                    text
                }
            </Small>
        )
    }

    setDateTable = date => {
        return (
            <Small>
                <Moment format="DD/MM/YYYY">
                    {date}
                </Moment>
            </Small>
        )
    }

    setArrayTable = arreglo => {
        return (
            arreglo.map((element) => {
                return (
                    <>
                        <Small className="mr-1" >
                            <B color="gold">
                                {
                                    element.name
                                }:
                            </B>
                        </Small>
                        {
                            element.url ?
                                <a href={element.url} target="_blank">
                                    <Small>
                                        {
                                            element.text
                                        }
                                    </Small>
                                </a>
                                :
                                <Small>
                                    {
                                        element.text
                                    }
                                </Small>
                        }
                        <br />
                    </>
                )
            })
        )
    }

    async getProyectosAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'proyectos', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { clientes, empresas, proyectos } = response.data
                const { options, prospecto } = this.state
                data.proyectos = proyectos
                options['clientes'] = this.setOptions(clientes, 'empresa', 'id')
                options['empresas'] = this.setOptions(empresas, 'name', 'id')
                this.setState({
                    ...this.state,
                    options,
                    proyectos: this.setProyectos(proyectos),
                    data

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

    async deleteProyectoAxios() {
        const { access_token } = this.props.authUser
        const { proyecto } = this.state
        await axios.delete(URL_DEV + 'proyectos/' + proyecto.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyectos } = response.data
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El proyecto fue eliminado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
                this.setState({
                    ...this.state,
                    proyectos: this.setProyectos(proyectos),
                    modalDelete: false,
                    proyecto: ''
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

    async deleteAdjuntoAxios(id) {
        const { access_token } = this.props.authUser
        const { proyecto } = this.state
        await axios.delete(URL_DEV + 'proyectos/' + proyecto.id + '/adjunto/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyecto, proyectos } = response.data

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El proyecto fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })

                this.setState({
                    ... this.state,
                    proyecto: proyecto,
                    proyectos: this.setProyectos(proyectos),
                    adjuntos: this.setAdjuntosSlider(proyecto)
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

    async addProyectoAxios() {
        const { access_token } = this.props.authUser
        const { form, prospecto } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                case 'adjuntos_grupo':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                if (element.toString() !== 'image')
                    data.append('adjuntos[]', element)
            }
        })
        if (prospecto) {
            data.append('prospecto', prospecto.id)
        }
        form.adjuntos_grupo.map( (grupo) => {
            grupo.adjuntos.map( (adjunto) => {
                adjunto.files.map((file)=> {
                    data.append(`files_name_${adjunto.id}[]`, file.name)
                    data.append(`files_${adjunto.id}[]`, file.file)
                })
                if(adjunto.files.length)
                    data.append('adjuntos[]', adjunto.id)
            })
        })
        await axios.post(URL_DEV + 'proyectos', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyectos, proyecto } = response.data
                const { options } = this.state
                options['clientes'] = []
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El proyecto fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    proyectos: this.setProyectos(proyectos),
                    options,
                    proyecto: '',
                    modal: false
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
                    /* data.append(element, JSON.stringify(form[element]))
                    break; */
                default:
                    break
            }
        })
        form.avances.map(( avance, key) => {
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

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El proyecto fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })

                var win = window.open( avance.pdf, '_blank');
                win.focus();

                this.setState({
                    ... this.state,
                    proyecto: proyecto,
                    proyectos: this.setProyectos(proyectos),
                    form: this.clearForm()
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

    async addProyectoAdjuntoAxios(name) {
        const { access_token } = this.props.authUser
        const { form, proyecto } = this.state
        const data = new FormData();
        data.append('tipo', name)
        let grupo = 0
        let adjunto = 0
        for(let i = 0; i < form.adjuntos_grupo.length; i++){
            for(let j = 0; j < form.adjuntos_grupo[i].adjuntos.length; j++){
                if(form.adjuntos_grupo[i].adjuntos[j].id === name){
                    grupo = i;
                    adjunto = j;
                }
            }
        }
        form.adjuntos_grupo[grupo].adjuntos[adjunto].files.map( (file) => {
            data.append(`files_name_${form.adjuntos_grupo[grupo].adjuntos[adjunto].id}[]`, file.name)
            data.append(`files_${form.adjuntos_grupo[grupo].adjuntos[adjunto].id}[]`, file.file)
        })

        await axios.post(URL_DEV + 'proyectos/' + proyecto.id + '/adjuntos', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                const { proyecto, proyectos } = response.data

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El proyecto fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })

                this.setState({
                    ... this.state,
                    proyecto: proyecto,
                    proyectos: this.setProyectos(proyectos),
                    adjuntos: this.setAdjuntosSlider(proyecto)
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

    async editProyectoAxios() {
        const { access_token } = this.props.authUser
        const { form, prospecto, proyecto } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                if (element.toString() !== 'image')
                    data.append('adjuntos[]', element)
            }
        })
        if (prospecto) {
            data.append('prospecto', prospecto.id)
        }
        await axios.post(URL_DEV + 'proyectos/' + proyecto.id, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyectos, proyecto } = response.data
                const { options } = this.state
                options['clientes'] = []
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El proyecto fue editado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    proyectos: this.setProyectos(proyectos),
                    options,
                    proyecto: '',
                    modal: false
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

    async getProspectoAxios(id) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'prospecto/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { prospecto } = response.data
                const { form, options } = this.state
                if (prospecto.cliente.cp) {
                    form.cp = prospecto.cliente.cp
                    this.cpAxios(prospecto.cliente.cp)
                }
                if (prospecto.cliente.colonia) {
                    form.colonia = prospecto.cliente.colonia.toString()
                }
                form.calle = prospecto.cliente.calle
                form.cliente = prospecto.cliente.id.toString()
                form.empresa = prospecto.lead.empresa.id.toString()
                form.contacto = prospecto.lead.nombre
                form.numeroContacto = prospecto.lead.telefono
                this.setState({
                    ... this.state,
                    prospecto,
                    form
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

    async cpAxios(value) {
        await axios.get(CP_URL + value + '?type=simplified').then(
            (response) => {
                const { error } = response.data
                const { form, options } = this.state
                if (!error) {
                    const { municipio, estado, asentamiento } = response.data.response
                    form['municipio'] = municipio
                    form['estado'] = estado
                    let aux = []
                    asentamiento.map((element) => {
                        aux.push({ name: element.toString(), value: element.toString() })
                    })
                    options['colonias'] = aux
                    this.setState({
                        ... this.state,
                        form,
                        options
                    })
                }
            },
            (error) => {

            }
        ).catch((error) => {
            console.log('error catch', error)
        })
    }

    render() {
        const { modal, modalDelete, modalAdjuntos, modalAvances, title, adjuntos, prospecto, form, options, proyectos, proyecto, data } = this.state
        return (
            <Layout active={'proyectos'}  {...this.props}>
                
                <NewTable columns={PROYECTOS_COLUMNS} data={proyectos}
                    title='Proyectos' subtitle='Listado de proyectos'
                    mostrar_boton={true}
                    abrir_modal={true}
                    mostrar_acciones={true}
                    onClick={this.openModal}
                    actions={{
                        'edit': { function: this.openModalEdit },
                        'delete': { function: this.openModalDelete },
                        'adjuntos': { function: this.openModalAdjuntos },
                        'avances': { function: this.openModalAvances },
                    }}
                    elements={data.proyectos}
                />

                <Modal title = { title } show={modal} handleClose={this.handleClose}>
                    <ProyectosForm title={title} form={form} onChange={this.onChange} options={options}
                        onChangeAdjunto={this.onChangeAdjunto} clearFiles={this.clearFiles} onChangeCP={this.onChangeCP}
                        onSubmit={this.onSubmit} onChangeAdjuntoGrupo = { this.onChangeAdjuntoGrupo } 
                        clearFilesGrupo = { this.clearFilesGrupo } >
                        {
                            prospecto !== '' ?
                                <Accordion>
                                    <div className="d-flex justify-content-end">
                                        <Accordion.Toggle as={Button} icon={faEye} color="transparent" eventKey={0} />
                                    </div>
                                    <Accordion.Collapse eventKey={0} className="px-md-5 px-2" >
                                        <div>
                                            <Card className="mx-md-5 my-3">
                                                <div className="row mx-0">
                                                    <div className="col-md-12 mb-3">
                                                        <P className="text-center" color="gold">
                                                            Lead
                                                    </P>
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <Small color="dark-blue">
                                                            <B color="gold" className="pr-1">Nombre:</B><br />
                                                            {
                                                                prospecto.lead.nombre
                                                            }
                                                        </Small>
                                                        <hr />
                                                        <Small color="dark-blue">
                                                            <B color="gold" className="pr-1">Teléfono:</B><br />
                                                            <a target="_blank" href={`tel:+${prospecto.lead.telefono}`}>
                                                                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                                                {
                                                                    prospecto.lead.telefono
                                                                }
                                                            </a>
                                                        </Small>
                                                        <hr />
                                                        <Small color="dark-blue">
                                                            <B color="gold" className="pr-1">Correo:</B><br />
                                                            <a target="_blank" href={`mailto:+${prospecto.lead.email}`}>
                                                                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                                                {
                                                                    prospecto.lead.email
                                                                }
                                                            </a>
                                                        </Small>
                                                        <hr />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <Small color="dark-blue">
                                                            <B color="gold" className="pr-1">Empresa:</B><br />
                                                            {
                                                                prospecto.lead.empresa.name
                                                            }
                                                        </Small>
                                                        <hr />
                                                        <Small color="dark-blue">
                                                            <B color="gold" className="mr-1">Origen:</B><br />
                                                            {
                                                                prospecto.lead.origen.origen
                                                            }
                                                        </Small>
                                                        <hr />
                                                        <Small color="dark-blue">
                                                            <Small>
                                                                <B color="gold" className="mr-1">Fecha:</B><br />
                                                            </Small>
                                                            <Moment format="DD/MM/YYYY">
                                                                {
                                                                    prospecto.lead.created_at
                                                                }
                                                            </Moment>
                                                        </Small>
                                                        <hr />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <Small color="dark-blue">
                                                            <B className="mr-1" color="gold">Comentario:</B><br />
                                                            {
                                                                prospecto.lead.comentario
                                                            }
                                                        </Small>
                                                        <hr />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <div className="text-color__dark-blue">
                                                            <Small>
                                                                <B color="gold" className="mr-1">Servicios:</B><br />
                                                            </Small>
                                                            <div className="px-2">
                                                                <ul>
                                                                    {
                                                                        prospecto.lead.servicios ? prospecto.lead.servicios.map((servicio, key) => {
                                                                            return (
                                                                                <li key={key}>
                                                                                    <Small color="dark-blue">
                                                                                        {servicio.servicio}
                                                                                    </Small>
                                                                                </li>
                                                                            )
                                                                        }) :
                                                                            <li>
                                                                                <Small color="dark-blue">
                                                                                    No hay servicios registrados
                                                                        </Small>
                                                                            </li>
                                                                    }
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                    </div>
                                                </div>
                                            </Card>
                                            <Card className="mx-md-5 my-3">
                                                <div className="row mx-0">
                                                    <div className="col-md-12 mb-3">
                                                        <P className="text-center" color="gold">
                                                            Prospecto
                                                    </P>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Small>
                                                            <B color="gold">
                                                                Cliente:
                                                        </B>
                                                        </Small>
                                                        <br />
                                                        <Small color="dark-blue">
                                                            {
                                                                prospecto.cliente.empresa
                                                            }
                                                        </Small>
                                                        <hr />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Small>
                                                            <B color="gold">
                                                                Vendedor:
                                                        </B>
                                                        </Small>
                                                        <br />
                                                        <Small color="dark-blue">
                                                            {
                                                                prospecto.vendedor.name
                                                            }
                                                        </Small>
                                                        <hr />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Small>
                                                            <B color="gold">
                                                                Tipo:
                                                        </B>
                                                        </Small>
                                                        <br />
                                                        <Small color="dark-blue">
                                                            {
                                                                prospecto.tipo_proyecto.tipo
                                                            }
                                                        </Small>
                                                        <hr />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Small>
                                                            <B color="gold">
                                                                Estatus contratación:
                                                        </B>
                                                        </Small>
                                                        <br />
                                                        <Small color="dark-blue">
                                                            {
                                                                prospecto.estatus_contratacion.estatus
                                                            }
                                                        </Small>
                                                        <hr />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <Small>
                                                            <B color="gold">
                                                                Descripción:
                                                        </B>
                                                        </Small>
                                                        <br />
                                                        <Small color="dark-blue">
                                                            {
                                                                prospecto.descripcion
                                                            }
                                                        </Small>
                                                        <hr />
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </Accordion.Collapse>
                                </Accordion>
                                : ''
                        }
                    </ProyectosForm>
                </Modal>
                <Modal show={modalDelete} handleClose={this.handleCloseDelete} >
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar el proyecto?
                    </Subtitle>
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick={this.handleCloseDelete} text="Cancelar" className="mr-3" color="green" />
                        <Button icon='' onClick={(e) => { this.safeDelete(e)() }} text="Continuar" color="red" />
                    </div>
                </Modal>
                <Modal show={modalAdjuntos} handleClose={this.handleCloseAdjuntos} >
                    <div className="p-2">
                        {/* <Slider elements={adjuntos.length > 0 ? adjuntos : []}
                            deleteFile={this.deleteFile} handleChange={this.handleChange} /> */}
                        <Accordion>
                        {
                            form.adjuntos_grupo.map( (grupo, key) => {
                                return(
                                    <div key = {key}>
                                        <div className="px-3 pt-2">
                                            <CustomToggle eventKey={grupo.id} >
                                                <strong>
                                                    <p className="label-form">
                                                        {grupo.text}
                                                    </p>
                                                </strong>
                                            </CustomToggle>
                                        </div>
                                        <Accordion.Collapse eventKey={grupo.id}>
                                            <div className="row mx-0 px-3 py-2">
                                                <Accordion className="w-100">
                                                    {
                                                        grupo.adjuntos.map( (adjunto, key) => {
                                                            return(
                                                                <div key = {key}>
                                                                    <div className="px-3 pt-2">
                                                                        <CustomToggle eventKey={adjunto.id} >
                                                                            <strong>
                                                                                <p className="label-form">
                                                                                    {adjunto.placeholder}
                                                                                </p>
                                                                            </strong>
                                                                        </CustomToggle>
                                                                    </div>
                                                                    <Accordion.Collapse eventKey={adjunto.id}>
                                                                        <div>
                                                                            {
                                                                                proyecto ? 
                                                                                    <ItemSlider items = { proyecto[adjunto.id] }  handleChange = { this.handleChange }
                                                                                     item = {adjunto.id} deleteFile = { this.deleteFile } />
                                                                                : ''
                                                                            }
                                                                            
                                                                        </div>
                                                                    </Accordion.Collapse>
                                                                </div>
                                                            )
                                                        } )
                                                    }
                                                </Accordion>            
                                            </div>
                                        </Accordion.Collapse>
                                    </div>
                                )
                                            
                            })
                        }
                        </Accordion>
                    </div>
                </Modal>
                <Modal title = { title } show = { modalAvances } handleClose = { this.handleCloseAvances }>
                    <AvanceForm form = { form } onChangeAvance =  { this.onChangeAvance } onChangeAdjuntoAvance = { this.onChangeAdjuntoAvance } 
                        clearFilesAvances = { this.clearFilesAvances } addRowAvance = { this.addRowAvance } onSubmit = { this.onSubmitAvance }
                        onChange = { this.onChange } proyecto = { proyecto } />
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