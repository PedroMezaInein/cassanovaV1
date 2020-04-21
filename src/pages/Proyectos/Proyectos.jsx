import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Modal, Card, Slider } from '../../components/singles'
import { Button } from '../../components/form-components'
import { faPlus, faTrash, faEdit, faMoneyBill, faFileAlt, faFileArchive, faEye, faPhone, faEnvelope, faLink } from '@fortawesome/free-solid-svg-icons'
import { ProyectosForm } from '../../components/forms'
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


class Proyectos extends Component{

    state = {
        proyectos: [],
        title: 'Nuevo proyecto',
        prospecto: '',
        proyecto: '',
        modal: false,
        modalDelete: false,
        modalAdjuntos: false,
        adjuntos:{
            active: '',
            headers:[]
        },
        form:{
            fechaInicio: new Date(),
            fechaFin: new Date(),
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
            adjuntos:{
                image:{
                    value: '',
                    placeholder: 'Imagen',
                    files: []
                },
                cotizacion:{
                    value: '',
                    placeholder: 'Cotización',
                    files: []
                },
                comprobantePagos:{
                    value: '',
                    placeholder: 'Comprobante de pagos',
                    files: []
                },
                catalogoConceptos:{
                    value: '',
                    placeholder: 'Catálogo de conceptos',
                    files: []
                },
                programasObra:{
                    value: '',
                    placeholder: 'Programas de obra',
                    files: []
                },
                descripcion:{
                    value: '',
                    placeholder: 'Descripción de los trabajos',
                    files: []
                },
                levantamientos:{
                    value: '',
                    placeholder: 'Levantamiento',
                    files: []
                },
                fotosDurante:{
                    value: '',
                    placeholder: 'Fotos durante',
                    files: []
                },
                fotosFin:{
                    value: '',
                    placeholder: 'Fotos fin',
                    files: []
                },
                planos:{
                    value: '',
                    placeholder: 'Planos',
                    files: []
                },
                renders:{
                    value: '',
                    placeholder: 'Renders',
                    files: []
                },
                fichasTecnicas:{
                    value: '',
                    placeholder: 'Fichas técnicas',
                    files: []
                },
                dictamenes:{
                    value: '',
                    placeholder: 'Dictámenes y memorias de cálculo',
                    files: []
                },
                mantenimiento:{
                    value: '',
                    placeholder: 'Consignas de mantenimiento',
                    files: []
                },
                moodboard:{
                    value: '',
                    placeholder: 'Moodboard',
                    files: []
                },
                diseñosAprobados:{
                    value: '',
                    placeholder: 'Diseños aprobados por cliente',
                    files: []
                },
                garantia:{
                    value: '',
                    placeholder: 'Garantía de vicios ocultos',
                    files: []
                },
                contratos:{
                    value: '',
                    placeholder: 'Contratos',
                    files: []
                }
            }
        },
        options:{
            clientes: [],
            empresas: [],
            colonias: []
        }
    }

    constructor(props){
        super(props);
        const { state } = props.location
        if(state){
            this.state.modal = true
            this.state.title = 'Prospecto a convertir'
            this.getProspectoAxios(state.prospectos.id)
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const proyectos = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        })
        if(!proyectos)
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

    openModalDelete = (e) => (proyecto) => {
        this.setState({
            ... this.state,
            proyecto: proyecto,
            modalDelete: true
        })
    }

    openModalEdit = (e) => (proyecto) => {
        const {form, options} = this.state

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

        form.cliente = proyecto.cliente.id.toString()
        form.empresa = proyecto.empresa.id.toString()
        form.colonia = proyecto.colonia

        if(proyecto.imagen)
        {
            form.adjuntos.image.files = [{name: proyecto.imagen.name, file: '', url: proyecto.imagen.url, key: 0}]
        }


        this.setState({
            ... this.state,
            proyecto: proyecto,
            modal: true,
            title: 'Editar proyecto',
            form
        })
    }

    openModalAdjuntos = proyecto => {
        const { adjuntos } = this.state
        
        let auxheaders = [ 
            {name: 'cotizaciones', placeholder: 'Cotización'},
            {name: 'comprobante_pagos', placeholder: 'Comprobante de pagos'},
            {name: 'catalogo_conceptos', placeholder: 'Catálogo de conceptos'},
            {name: 'programas_obra', placeholder: 'Programas de obra'},
            {name: 'descripcion', placeholder: 'Descripción de los trabajos'},
            {name: 'levantamientos', placeholder: 'Levantamiento'},
            {name: 'fotos_durante', placeholder: 'Fotos durante'},
            {name: 'fotos_fin', placeholder: 'Fotos fin'},
            {name: 'planos', placeholder: 'Planos'},
            {name: 'renders', placeholder: 'Renders'},
            {name: 'fichas_tecnicas', placeholder: 'Fichas técnicas'},
            {name: 'dictamenes', placeholder: 'Dictámenes y memorias de cálculo'},
            {name: 'mantenimiento', placeholder: 'Consignas de mantenimiento'},
            {name: 'moodboard', placeholder: 'Moodboard'},
            {name: 'diseños_aprobados', placeholder: 'Diseños aprobados por cliente'},
            {name: 'garantia', placeholder: 'Garantía de vicios ocultos'},
            {name: 'contratos', placeholder: 'Contratos'}
        ]

        let aux = []

        auxheaders.map( (element) => {
            aux.push({
                id: element.name,
                text: element.placeholder,
                files: proyecto[element.name],
                url: ''
            })
        })

        adjuntos.headers = aux;

        console.log(adjuntos, 'ADJUNTOS')

        this.setState({
            ... this.state,
            modalAdjuntos: true,
            adjuntos,
            proyecto: proyecto
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            title: 'Nuevo proyecto',
            prospecto: '',
            form: this.clearForm()
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
            prospecto: ''
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

    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        for(let counter = 0; counter < files.length; counter ++){
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]) ,
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

    onChangeCP = event => {
        const { value, name } = event.target
        this.onChange({target:{name: name, value: value}})
        if(value.length === 5)
            this.cpAxios(value)
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for(let counter = 0; counter < form['adjuntos'][name].files.length; counter ++){
            if(counter !== key){
                aux.push(form['adjuntos'][name].files[counter])
            }
        }
        if(aux.length < 1){
            form['adjuntos'][name].value = ''    
        }
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fechaInicio':
                case 'fechaFin':
                    form[element] = new Date()
                    break;
                case 'adjuntos':
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            form.adjuntos[element].value = ''
            form.adjuntos[element].files = []
        })
        return form
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        swal({
            title: '¡Un momento!',
            text: 'La información está siendo procesada.',
            buttons: false
        })
        if(title === 'Editar proyecto')
            this.editProyectoAxios()
        else
            this.addProyectoAxios()
    }

    safeDelete = (e) => () => {
        this.deleteProyectoAxios()
    }

    setOptions = ( arreglo, name, value ) => {
        let aux = []
        arreglo.map( (element) => {
            aux.push({ name: element[name], value: element[value].toString() } )
        })
        return aux
    }

    setProyectos = proyectos => {
        let aux = []
        proyectos.map( (proyecto) => {
            aux.push({
                actions: this.setActionsTable(proyecto),
                nombre: this.setTextTable(proyecto.nombre),
                cliente: this.setTextTable(proyecto.cliente.empresa),
                direccion: this.setDireccionTable(proyecto),
                contacto: this.setArrayTable(
                    [
                        {name:'Nombre', text:proyecto.contacto},
                        {name:'Teléfono', text:proyecto.numero_contacto, url:`tel:+${proyecto.numero_contacto}`}
                    ]),
                empresa: this.setTextTable(proyecto.empresa.name),
                porcentaje: this.setTextTable(proyecto.porcentaje + '%'),
                fechaInicio: this.setDateTable(proyecto.fecha_inicio),
                fechaFin: this.setDateTable(proyecto.fecha_fin),
                adjuntos: this.setAdjuntosTable(proyecto)
            })
        })
        return aux
    }

    setAdjuntosTable = proyecto => {
        return(
            <>
                {
                    proyecto.imagen ?
                        this.setArrayTable(
                            [
                                {name:'Imagen', text:proyecto.imagen.name, url:proyecto.imagen.url}
                            ]
                        )
                    : ''
                }
                {
                    proyecto.adjuntos.length > 0 ?
                        <div className="cursor mt-2" onClick = { (e) => { e.preventDefault(); this.openModalAdjuntos(proyecto)} }>
                            <Small>
                                <FontAwesomeIcon icon={faLink} className="mr-2" />
                                Adjuntos
                            </Small>
                        </div>
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

    setAdjuntos = adjuntos => {
        let aux = [ 
                    {name: 'cotizaciones', placeholder: 'Cotización'},
                    {name: 'comprobante_pagos', placeholder: 'Comprobante de pagos'},
                    {name: 'catalogo_conceptos', placeholder: 'Catálogo de conceptos'},
                    {name: 'programas_obra', placeholder: 'Programas de obra'},
                    {name: 'descripcion', placeholder: 'Descripción de los trabajos'},
                    {name: 'levantamientos', placeholder: 'Levantamiento'},
                    {name: 'fotos_durante', placeholder: 'Fotos durante'},
                    {name: 'fotos_fin', placeholder: 'Fotos fin'},
                    {name: 'planos', placeholder: 'Planos'},
                    {name: 'renders', placeholder: 'Renders'},
                    {name: 'fichas_tecnicas', placeholder: 'Fichas técnicas'},
                    {name: 'dictamenes', placeholder: 'Dictámenes y memorias de cálculo'},
                    {name: 'mantenimiento', placeholder: 'Consignas de mantenimiento'},
                    {name: 'moodboard', placeholder: 'Moodboard'},
                    {name: 'diseños_aprobados', placeholder: 'Diseños aprobados por cliente'},
                    {name: 'garantia', placeholder: 'Garantía de vicios ocultos'},
                    {name: 'contratos', placeholder: 'Contratos'}
                ]
        return(
            <>
                {
                    aux.map( (element) => {
                        if(adjuntos[element.name].length)
                            return(
                                <div className="border cursor mb-1" onClick = { (e) => { e.preventDefault(); alert(element.name)}}>
                                    <Small>
                                        {
                                            element.placeholder
                                        }
                                    </Small>
                                </div>
                            )
                    })
                }
            </>
        )
    }

    setActionsTable = proyecto => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalEdit(e)(proyecto) } text='' icon={faEdit} color="transparent" 
                        tooltip={{id:'edit', text:'Editar'}} />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalDelete(e)(proyecto) } text='' icon={faTrash} color="red" 
                        tooltip={{id:'delete', text:'Eliminar', type:'error'}} />
                </div>
            </>
        )
    }

    setDireccionTable = proyecto => {
        return(
            <>
                <Small className="mr-1">
                    { proyecto.calle }, colonia
                </Small>
                <Small className="mr-1">
                    { proyecto.colonia },
                </Small>
                <Small className="mr-1">
                    { proyecto.municipio },
                </Small>
                <Small className="mr-1">
                    { proyecto.estado }. CP: 
                </Small>
                <Small className="mr-1">
                    { proyecto.cp }
                </Small>
            </>
        )
    }

    setTextTable = text => {
        return(
            <Small>
                {
                    text
                }
            </Small>
        )
    }

    setDateTable = date => {
        return(
            <Small>
                <Moment format="DD/MM/YYYY">
                    {date}
                </Moment>
            </Small>
        )
    }

    setArrayTable = arreglo => {
        return(
            arreglo.map((element) => {
                return(
                    <>
                        <Small className = "mr-1" >
                            <B color = "gold">
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

    async getProyectosAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'proyectos', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { clientes, empresas, proyectos } = response.data
                const { options, prospecto } = this.state
                options['clientes'] = this.setOptions(clientes, 'empresa', 'id')
                options['empresas'] = this.setOptions(empresas, 'name', 'id')
                this.setState({
                    ...this.state,
                    options,
                    proyectos: this.setProyectos(proyectos)
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error'
                    })
                }
            }
        ).catch((error) => {
            console.log('error catch', error)
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',
                
            })
        })
    }

    async deleteProyectoAxios(){
        const { access_token } = this.props.authUser
        const { proyecto } = this.state
        await axios.delete(URL_DEV + 'proyectos/' + proyecto.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
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
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error'
                    })
                }
            }
        ).catch((error) => {
            console.log('error catch', error)
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',
                
            })
        })
    }

    async addProyectoAxios(){
        const { access_token } = this.props.authUser
        const { form, prospecto } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
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
        aux.map( (element) => {
            if(form.adjuntos[element].value !== ''){
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                if(element.toString() !== 'image')
                    data.append('adjuntos[]', element)
            }
        })
        if(prospecto){
            data.append('prospecto', prospecto.id)
        }
        await axios.post(URL_DEV + 'proyectos', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
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
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error'
                    })
                }
            }
        ).catch((error) => {
            console.log('error catch', error)
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',                
            })
        })
    }

    async editProyectoAxios(){
        const { access_token } = this.props.authUser
        const { form, prospecto, proyecto } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
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
        aux.map( (element) => {
            if(form.adjuntos[element].value !== ''){
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                if(element.toString() !== 'image')
                    data.append('adjuntos[]', element)
            }
        })
        if(prospecto){
            data.append('prospecto', prospecto.id)
        }
        await axios.post(URL_DEV + 'proyectos/' +proyecto.id, data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
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
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error'
                    })
                }
            }
        ).catch((error) => {
            console.log('error catch', error)
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',                
            })
        })
    }

    async getProspectoAxios(id){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'prospecto/' + id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { prospecto } = response.data
                const { form, options } = this.state
                if(prospecto.cliente.cp){
                    form.cp = prospecto.cliente.cp
                    this.cpAxios(prospecto.cliente.cp)
                }
                if(prospecto.cliente.colonia){
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
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error'
                    })
                }
            }
        ).catch((error) => {
            console.log('error catch', error)
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',
                
            })
        })
    }

    async cpAxios(value){
        await axios.get(CP_URL + value + '?type=simplified').then(
            (response) => {
                console.log(response, 'RESPONSE')
                const { error } = response.data
                const {form, options } = this.state
                if(!error){
                    const { municipio, estado, asentamiento } = response.data.response
                    form['municipio'] = municipio
                    form['estado'] = estado
                    let aux = []
                    asentamiento.map( (element) => {
                        aux.push({ name: element.toString(), value: element.toString() } )
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

    render(){
        const { modal, modalDelete, modalAdjuntos, title, prospecto, form, options, proyectos } = this.state
        return(
            <Layout active={'proyectos'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" />
                </div>
                <DataTable columns = {PROYECTOS_COLUMNS} data= {proyectos}/>
                <Modal show = {modal} handleClose = {this.handleClose}>
                    <ProyectosForm title = { title } form = { form } onChange = {this.onChange} options = { options } 
                        onChangeAdjunto = { this.onChangeAdjunto } clearFiles = { this.clearFiles } onChangeCP = { this.onChangeCP }
                        onSubmit = { this.onSubmit } >
                        {
                            prospecto !== '' ?
                            <Accordion>
                                <div className="d-flex justify-content-end">
                                    <Accordion.Toggle as = { Button } icon={ faEye } color="transparent" eventKey={0} />
                                </div>
                                <Accordion.Collapse eventKey = { 0 } className="px-md-5 px-2" >
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
                                                                        return(
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
                <Modal show = { modalDelete } handleClose={ this.handleCloseDelete } >
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar el proyecto?
                    </Subtitle>
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick = { this.handleCloseDelete } text="Cancelar" className="mr-3" color="green"/>
                        <Button icon='' onClick = { (e) => { this.safeDelete(e)() }} text="Continuar" color="red"/>
                    </div>
                </Modal>
                <Modal show = { modalAdjuntos } handleClose={ this.handleCloseAdjuntos } >
                    <div className="p-2">
                        <Slider elements = {this.state.adjuntos.headers.length > 0 ? this.state.adjuntos.headers : [] } />
                    </div>
                </Modal>
            </Layout>
        )
    }
}


const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Proyectos);