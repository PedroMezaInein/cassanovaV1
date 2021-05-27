import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Accordion, Dropdown, Form } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import Layout from '../../../components/layout/layout'
import { ProyectosForm as ProyectoFormulario } from '../../../components/forms'
import { URL_DEV, CP_URL, TOKEN_CP } from '../../../constants'
import { Button } from '../../../components/form-components'
import { ProyectoCard, ProyectosCard } from '../../../components/cards'
import { waitAlert, printResponseErrorAlert, errorAlert, doneAlert, questionAlert, createAlertSA2WithClose } from '../../../functions/alert'
import { setOptions } from '../../../functions/setters'
import { Modal } from '../../../components/singles'
import SelectSearchGray from '../../../components/form-components/Gray/SelectSearchGray'
class ProyectosForm extends Component {
    state = {
        prevPath: '',
        action: '',
        title: 'Nuevo proyecto',
        prospecto: '',
        proyecto: '',
        formeditado: 1,
        options: {
            empresas: [],
            clientes: [],
            colonias: [],
            estatus: [],
            tipos:[],
            cp_clientes: []
        },
        data: {
            proyectos: []
        },
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date(),
            estatus:'',
            fase1: false,
            fase2: false,
            fase3: false,
            fase1_relacionado: false,
            fase2_relacionado: false,
            fase3_relacionado: false,
            proyecto: '',
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
            correo: '',
            correos: [],
            clientes: [],
            tipoProyecto:'',
            m2:'',
            adjuntos: {
                image: {
                    value: '',
                    placeholder: 'Imagen',
                    files: []
                }
            },
            ubicacion_cliente: '',
        },
        modalCP: false,
        showModal:false
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const remisiones = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        const { options } = this.state
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nuevo proyecto',
                    formeditado: 0,
                    action: 'add'
                })
                break;
            case 'edit':
                if (state) {
                    if (state.proyecto) {
                        const { proyecto, prevPath } = state
                        if(prevPath)
                            this.setState({prevPath: prevPath})
                        this.getOneProyectoAxios(proyecto)
                    }
                    else
                        history.push('/proyectos/proyectos')
                } else
                    history.push('/proyectos/proyectos')
                break;
            case 'convert':
                if (state) {
                    if (state.prospecto) {
                        this.getProspectoAxios(state.prospecto.id)
                    }
                    else
                        history.push('/proyectos/proyectos')
                } else
                    history.push('/proyectos/proyectos')
                break;
            case 'relacionar':
                if (state) {
                    if (state.proyecto) {
                        const { proyecto } = state
                        const { form } = this.state
                        form.cp = proyecto.cp;
                        this.cpAxios(proyecto.cp)
                        form.calle = proyecto.calle
                        form.nombre = proyecto.nombre
                        if(proyecto.fase2 === 1){
                            /* form.nombre = proyecto.nombre + ' - FASE 3' */
                            this.getNameProyectoAxios(proyecto.nombre)
                        }
                        else
                            if(proyecto.fase1 === 1)
                                form.nombre = proyecto.nombre + ' - FASE 2'
                        
                        form.contacto = proyecto.contacto
                        form.numeroContacto = proyecto.numero_contacto
                        form.fechaInicio = new Date(proyecto.fecha_inicio)
                        form.fechaFin = new Date(proyecto.fecha_fin)
                        form.porcentaje = proyecto.porcentaje
                        form.descripcion = proyecto.descripcion
                        let aux = []
                        if (proyecto.clientes) {
                            proyecto.clientes.forEach(cliente => {
                                aux.push(
                                    {
                                        value: cliente.id.toString(),
                                        name: cliente.empresa
                                    }
                                )
                            });
                            form.clientes = aux
                        }
                        if (proyecto.imagen) {
                            form.adjuntos.image.files = [{ name: proyecto.imagen.name, file: '', url: proyecto.imagen.url, key: 0 }]
                        }
                        if (proyecto.estatus) {
                            form.estatus = proyecto.estatus.id.toString();
                        }
                        form.fase1 = proyecto.fase1 === 0 ? false : true
                        form.fase2 = proyecto.fase2 === 0 ? false : true
                        form.fase3 = proyecto.fase3 === 0 ? false : true
                        if(proyecto.fase1 === 1 && proyecto.fase2 === 1 && proyecto.fase3 === 0)
                            form.fase3 = true
                        form.fase1_relacionado = proyecto.fase1 === 0 ? false : true
                        form.fase2_relacionado = proyecto.fase2 === 0 ? false : true
                        form.fase3_relacionado = proyecto.fase3 === 0 ? false : true
                        if (proyecto.empresa)
                            form.empresa = proyecto.empresa.id.toString()
                        form.colonia = proyecto.colonia
                        aux = []
                        if (proyecto.contactos) {
                            proyecto.contactos.map((contacto) => {
                                aux.push(contacto.correo)
                                return false
                            })
                            form.correos = aux
                        }
                        form.m2 = proyecto.m2
                        if(proyecto.empresa.tipos){
                            options.tipos = setOptions(proyecto.empresa.tipos, 'tipo', 'id')
                            if(proyecto.tipo_proyecto)
                                form.tipoProyecto = proyecto.tipo_proyecto.id.toString()
                        }
                        this.setState({
                            ...this.state,
                            proyecto: proyecto,
                            form,
                            formeditado: 1,
                            title: 'Contratar fases',
                            action: 'contratar-fases',
                            options
                        })
                    }
                    else
                        history.push('/proyectos/proyectos')
                } else
                    history.push('/proyectos/proyectos')
                break;
            default:
                break;
        }
        if (!remisiones)
            history.push('/')
        this.getOptionsAxios()
    }
    onChange = e => {
        const { name, value, type } = e.target
        const { form, options } = this.state
        let { showModal } = this.state
        form[name] = value
        if(type === 'radio'){
            if(name === 'ubicacion_cliente')
                form[name] = value === "true" ? true : false
        }
        switch (name) {
            case 'cliente':
                let aux = [];
                form.clientes.map((cliente) => {
                    if(cliente.cp !== null){
                        aux.push({
                            name: cliente.name,
                            value: cliente.value,
                            label: cliente.name,
                            cp: cliente.cp,
                            estado: cliente.estado,
                            municipio: cliente.municipio,
                            colonia: cliente.colonia,
                            calle: cliente.calle
                        })
                    }
                })
                options.cp_clientes = aux
                if(options.cp_clientes.length > 1 || options.cp_clientes.length === 1){
                    showModal = true
                }
                else if(options.cp_clientes.length === 0 ){
                    form.cp = ''
                    form.estado = ''
                    form.municipio = ''
                    form.colonia = ''
                    form.calle = ''
                    showModal = false
                }
                this.setState({
                    ...this.state,
                    form,
                    showModal,
                    options
                })
                break;
            default:
                break;
        }
        this.setState({
            ...this.state,
            form,
            showModal,
            options
        })
    }
    onChangeOptions = (e, arreglo) => {
        const { value } = e.target
        const { form, options } = this.state
        let auxArray = form[arreglo]
        let aux = []
        options[arreglo].find(function (_aux) {
            if (_aux.value.toString() === value.toString()) {
                auxArray.push(_aux)
            } else {
                aux.push(_aux)
            }
            return false
        })
        form[arreglo] = auxArray
        this.setState({
            ...this.state,
            form,
            options
        })
    }
    deleteOption = (element, array) => {
        let { form, showModal } = this.state
        const { options } = this.state

        let auxForm = []
        form[array].map((elemento, key) => {
            if (element !== elemento) {
                auxForm.push(elemento)
            }
            return false
        })
        form[array] = auxForm

        let aux = [];
        form[array].map((cliente) => {
            if(cliente.cp !== null){
                aux.push({
                    name: cliente.name,
                    value: cliente.value,
                    label: cliente.name,
                    cp: cliente.cp,
                    estado: cliente.estado,
                    municipio: cliente.municipio,
                    colonia: cliente.colonia,
                    calle: cliente.calle
                })
            }
        })
        options.cp_clientes = aux

        if(options.cp_clientes.length > 1 || options.cp_clientes.length === 1){
            showModal = true
        }else if(options.cp_clientes.length === 0 ){
            form.cp = ''
            form.estado = ''
            form.municipio = ''
            form.colonia = ''
            form.calle = ''
            showModal = false
        }
        this.setState({
            ...this.state,
            form,
            options,
            showModal,
        })
    }
    removeCorreo = value => {
        const { form } = this.state
        let aux = []
        form.correos.map((correo, key) => {
            if (correo !== value) {
                aux.push(correo)
            }
            return false
        })
        form.correos = aux
        this.setState({
            ...this.state,
            form
        })
    }
    onChangeCP = event => {
        const { value, name } = event.target
        this.onChange({ target: { name: name, value: value } })
        if (value.length === 5)
            this.cpAxios(value)
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
            ...this.state,
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
            ...this.state,
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
            ...this.state,
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
            ...this.state,
            form
        })
    }
    onSubmit = e => {
        e.preventDefault()
        const { title,action } = this.state
        waitAlert()
        if (title === 'Editar proyecto')
            this.editProyectoAxios()
        else
            if(action === 'contratar-fases')
                this.addProyectoRelacionadoAxios()
            else
                this.addProyectoAxios()
    }

    changeEstatus = estatus =>  {
        estatus === 'Detenido'?
            questionAlert('¿ESTÁS SEGURO?', 'DETENDRÁS EL PROYECTO ¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios(estatus))
        : estatus === 'Terminado' ?
            questionAlert('¿ESTÁS SEGURO?', 'DARÁS POR TEMINADO EL PROYECTO ¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios(estatus))
        : 
            questionAlert('¿ESTÁS SEGURO?', 'EL PROYECTO ESTARÁ EN PROCESO ¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios(estatus))
    }

    getOneProyectoAxios = async(proyecto) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(`${URL_DEV}v2/proyectos/proyectos/proyecto/${proyecto.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { form, options } = this.state
                const { proyecto } = response.data
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
                form.m2 = proyecto.m2
                let aux = []
                if (proyecto.clientes) {
                    proyecto.clientes.forEach(cliente => {
                        aux.push( {
                            value: cliente.id.toString(),
                            name: cliente.empresa
                        } )
                    });
                    form.clientes = aux
                }
                if (proyecto.imagen)
                    form.adjuntos.image.files = [{ name: proyecto.imagen.name, file: '', url: proyecto.imagen.url, key: 0 }]
                if (proyecto.estatus) 
                    form.estatus = proyecto.estatus.id.toString();
                form.fase1 = proyecto.fase1 === 0 ? false : true
                form.fase2 = proyecto.fase2 === 0 ? false : true
                form.fase3 = proyecto.fase3 === 0 ? false : true
                if (proyecto.empresa)
                    form.empresa = proyecto.empresa.id.toString()
                form.colonia = proyecto.colonia
                aux = []
                if (proyecto.contactos) {
                    proyecto.contactos.map((contacto) => {
                        aux.push(contacto.correo)
                        return false
                    })
                    form.correos = aux
                }
                if(proyecto.empresa.tipos){
                    options.tipos = setOptions(proyecto.empresa.tipos, 'tipo', 'id')
                    if(proyecto.tipo_proyecto)
                        form.tipoProyecto = proyecto.tipo_proyecto.id.toString()
                }
                this.setState({ ...this.state, proyecto: proyecto, form, formeditado: 1, title: 'Editar proyecto',
                    action: 'edit', options
                })
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getNameProyectoAxios(name){
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}proyectos/nombre/${name}`, { responseType: 'json', headers: { Accept: '*/*',  Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { form } = this.state
                const { nombre } = response.data
                form.nombre = nombre
                this.setState({
                    ...this.state,
                    form
                })

                /* swal.close()
                doneAlert('Estado actualizado con éxito')
                const { history } = this.props
                history.push({
                    pathname: '/proyectos/proyectos'
                }); */
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async changeEstatusAxios(estatus){
        waitAlert()
        const { proyecto } = this.state
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}proyectos/${proyecto.id}/estatus`,{estatus: estatus}, { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                doneAlert('Estado actualizado con éxito')
                const { history } = this.props
                history.push({
                    pathname: '/proyectos/proyectos'
                });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'proyectos/opciones', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { clientes, empresas, estatus } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['estatus'] = setOptions(estatus, 'estatus', 'id')
                let aux = [];
                clientes.forEach((element) => {
                    aux.push({
                        name: element.empresa,
                        value: element.id.toString(),
                        label: element.empresa,
                        cp: element.cp,
                        estado: element.estado,
                        municipio: element.municipio,
                        colonia: element.colonia,
                        calle: element.calle
                    })
                    return false
                })
                options.clientes = aux.sort(this.compare)
                this.setState({
                    ...this.state,
                    options
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    compare( a, b ) {
        if ( a.name < b.name ){
            return -1;
        }
        if ( a.name > b.name ){
            return 1;
        }
        return 0;
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
                    break;
                case 'correos':
                case 'clientes':
                    data.append(element, JSON.stringify(form[element]))
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
            return false
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
            }
            return false
        })
        if (prospecto) data.append('prospecto', prospecto.id)
        await axios.post(`${URL_DEV}v2/proyectos/proyectos`, data, 
            { headers: {'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyecto } = response.data
                const { history } = this.props
                createAlertSA2WithClose(
                    '¡FELICIDADES CREASTE EL PROYECTO!', '¿DESEAS CREAR LA CAJA CHICA?',
                    () => this.addCajaChicaAxios(proyecto), history, '/proyectos/proyectos'
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async editProyectoAxios() {
        const { access_token } = this.props.authUser
        const { form, proyecto } = this.state
        await axios.put(`${URL_DEV}v2/proyectos/proyectos/${proyecto.id}`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { prevPath } = this.state
                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue editado con éxito.')
                const { history } = this.props
                if(prevPath === 'crm')
                    history.push({ pathname: '/leads/crm' });
                else
                    history.push({ pathname: '/proyectos/proyectos' });
                
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addCajaChicaAxios(proyecto){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'cuentas/proyecto/caja/' + proyecto.id, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Caja chica generada con éxito.')
                const { history } = this.props
                history.push({ pathname: '/proyectos/proyectos' });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addProyectoRelacionadoAxios() {
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
                case 'adjuntos':
                    break;
                case 'correos':
                case 'clientes':
                    data.append(element, JSON.stringify(form[element]))
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
            return false
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    if(form.adjuntos[element].files.id === ''){
                        data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                        data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                    }
                }
            }
            return false
        })
        await axios.post(`${URL_DEV}v2/proyectos/proyectos/${proyecto.id}`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyecto } = response.data
                const { history } = this.props
                createAlertSA2WithClose(
                    '¡FELICIDADES CREASTE EL PROYECTO!', '¿DESEAS CREAR LA CAJA CHICA?',
                    () => this.addCajaChicaAxios(proyecto), history, '/proyectos/proyectos'
                )
            }, (error) => { printResponseErrorAlert(error) }
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
                const { form } = this.state
                if(prospecto){
                    if(prospecto.cliente){
                        if (prospecto.cliente.cp) {
                            form.cp = prospecto.cliente.cp
                            this.cpAxios(prospecto.cliente.cp)
                        }
                        form.calle = prospecto.cliente.calle
                        form.cliente = prospecto.cliente.id.toString()
                    }
                }
                
                form.empresa = prospecto.lead.empresa.id.toString()
                form.contacto = prospecto.lead.nombre
                form.numeroContacto = prospecto.lead.telefono
                this.setState({
                    ...this.state,
                    prospecto: prospecto,
                    form,
                    title: 'Convertir Prospecto',
                    action: 'convert'
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async cpAxios(value) {
        await axios.get(`${CP_URL}${value}?token=${TOKEN_CP}&type=simplified`).then(
            (response) => {
                const { error } = response.data
                const { form, options } = this.state
                if (!error) {
                    const { municipio, estado, asentamiento } = response.data.response
                    form['municipio'] = municipio.toUpperCase()
                    form['estado'] = estado.toUpperCase()
                    let aux = []
                    asentamiento.map((element) => {
                        aux.push({ name: element.toString().toUpperCase(), value: element.toString().toUpperCase() })
                        return false
                    })
                    options['colonias'] = aux
                    this.setState({
                        ...this.state,
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
    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({ ...this.state, form })
    }
    
    tagInputChange = (nuevosCorreos) => {
        const { form } = this.state 
        let unico = {};
        nuevosCorreos.forEach(function (i) {
            if (!unico[i]) { unico[i] = true }
        })
        form.correos = nuevosCorreos ? Object.keys(unico) : [];
        this.setState({ ...this.state, form })
    }

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'tipo', 'id')
        this.setState({
            ...this.state,
            options
        })
    }
    openModalCP = () => {
        this.setState({
            ...this.state,
            modalCP:true
        })
    }
    handleCloseCP = () => { 
        let { form } = this.state
        form.ubicacion_cliente = ''
        form.cp_ubicacion = ''
        this.setState({
            ...this.state,
            modalCP: false,
            form
        })
    }
    updateSelectCP = value => {
        this.onChange({ target: { name: 'cp_ubicacion', value: value.toString() } })
    }
    sendForm = async() => {
        let { form } = this.state
        const { options } = this.state
            options.cp_clientes.map((cliente) => {
                if(form.cp_ubicacion === cliente.value){
                    let coloniaM = cliente.colonia.toUpperCase()
                    form.cp = cliente.cp
                    this.cpAxios(cliente.cp)
                    form.colonia = coloniaM
                    form.calle = cliente.calle
                }else if(options.cp_clientes.length === 1){
                    let coloniaM = cliente.colonia.toUpperCase()
                    form.cp = cliente.cp
                    this.cpAxios(cliente.cp)
                    form.colonia = coloniaM
                    form.calle = cliente.calle
                }
            })
        Swal.close()
        // form.ubicacion_cliente = ''
        // form.cp_ubicacion = ''
        this.setState({
            ...this.state,
            modalCP: false,
            form
        })
    }
    printTable = (key, cliente) => {
        return (
            <tbody key={key}>
                <tr className="border-top-2px">
                    <td className="text-center w-5">
                        <i className="las la-user-alt icon-2x text-dark-50"></i>
                    </td>
                    <td className="w-33 font-weight-bolder text-dark-50">
                        NOMBRE DE CLIENTE
                    </td>
                    <td className="font-weight-light">
                        <span>{cliente.name}</span>
                    </td>
                </tr>
                <tr>
                    <td className="text-center">
                        <i className="las la-map-pin icon-2x text-dark-50"></i>
                    </td>
                    <td className="font-weight-bolder text-dark-50">
                        CÓDIGO POSTAL
                    </td>
                    <td className="font-weight-light">
                        <span>{cliente.cp}</span>
                    </td>
                </tr>
                <tr>
                    <td className="text-center">
                        <i className="las la-globe icon-2x text-dark-50"></i>
                    </td>
                    <td className="font-weight-bolder text-dark-50">ESTADO</td>
                    <td className="font-weight-light">
                        <span>{cliente.estado}</span>
                    </td>
                </tr>
                <tr>
                    <td className="text-center">
                        <i className="las la-map icon-2x text-dark-50"></i>
                    </td>
                    <td className="font-weight-bolder text-dark-50">
                        MUNICIPIO/DELEGACIÓN
                    </td>
                    <td className="font-weight-light">
                        <span>{cliente.municipio}</span>
                    </td>
                </tr>
                <tr>
                    <td className="text-center">
                        <i className="las la-map-marker icon-2x text-dark-50"></i>
                    </td>
                    <td className="font-weight-bolder text-dark-50">
                        COLONIA
                    </td>
                    <td className="font-weight-light text-justify">
                        <span>{cliente.colonia}</span>
                    </td>
                </tr>
                <tr>
                    <td className="text-center">
                        <i class="las la-map-marked-alt icon-2x text-dark-50"></i>
                    </td>
                    <td className="font-weight-bolder text-dark-50">
                        CALLE Y NÚMERO
                    </td>
                    <td className="font-weight-light text-justify">
                        <span>{cliente.calle}</span>
                    </td>
                </tr>
            </tbody>
        )
    }
    render() {
        const { title, form, options, formeditado, prospecto, action, proyecto, modalCP, showModal } = this.state
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                        {
                            title === 'Editar proyecto' ?
                                <div className="card-toolbar">
                                    {
                                        proyecto?
                                            proyecto.estatus?
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        style={
                                                            {
                                                                backgroundColor: proyecto.estatus.fondo, color: proyecto.estatus.letra, border: 'transparent', padding: '0.4rem 0.75rem',
                                                                width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem',
                                                                fontWeight: 600
                                                            }}>
                                                        {proyecto.estatus.estatus.toUpperCase()}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu className="p-0" >
                                                        <Dropdown.Header>
                                                            <span className="font-size-sm">Elige una opción</span>
                                                        </Dropdown.Header>
                                                        <Dropdown.Item className="p-0"  onClick={() => { this.changeEstatus('Detenido') }} >
                                                            <span className="navi-link w-100">
                                                                <span className="navi-text">
                                                                    <span className="label label-xl label-inline label-light-danger rounded-0 w-100">DETENIDO</span>
                                                                </span>
                                                            </span>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item className="p-0" onClick={() => { this.changeEstatus('Terminado') }} >
                                                            <span className="navi-link w-100">
                                                                <span className="navi-text">
                                                                    <span className="label label-xl label-inline label-light-primary rounded-0 w-100">TERMINADO</span>
                                                                </span>
                                                            </span>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item className="p-0" onClick={() => { this.changeEstatus('En proceso') }} >
                                                            <span className="navi-link w-100">
                                                                <span className="navi-text">
                                                                    <span className="label label-xl label-inline label-light-success rounded-0 w-100">EN PROCESO</span>
                                                                </span>
                                                            </span>
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            :''
                                        :''
                                    }
                                </div>
                                : ''
                        }
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <ProyectoFormulario action = { action } title = { title } form = { form } options = { options } formeditado = { formeditado }
                            onChange = { this.onChange } onChangeAdjunto = { this.onChangeAdjunto } deleteOption = { this.deleteOption }
                            onChangeOptions = { this.onChangeOptions } clearFiles = { this.clearFiles } onChangeCP = { this.onChangeCP }
                            onSubmit = { this.onSubmit } onChangeAdjuntoGrupo = { this.onChangeAdjuntoGrupo } clearFilesGrupo = { this.clearFilesGrupo }
                            removeCorreo = { this.removeCorreo } handleChange = { this.handleChange } onChangeRange = { this.onChangeRange }
                            className = "px-3" tagInputChange = { (e) => this.tagInputChange(e) } setOptions = { this.setOptions } openModalCP={this.openModalCP} showModal={showModal}>
                            <Accordion>
                                {
                                    (prospecto !== '' || proyecto !== '') && title !== 'Editar proyecto' ? 
                                        <div className="d-flex justify-content-end">
                                            <Accordion.Toggle as = { Button } icon = { faEye } pulse = "pulse-ring" 
                                                eventKey = { prospecto !== '' ? 'prospecto' : proyecto !== '' ? proyecto ?  'proyecto' : '' : '' } 
                                                className = "btn btn-icon btn-light-info pulse pulse-info" />
                                        </div>
                                    : ''
                                }
                                <Accordion.Collapse eventKey='prospecto' className="px-md-5 px-2" >
                                    <div> <ProyectoCard data={prospecto} /> </div>
                                </Accordion.Collapse>
                                <Accordion.Collapse eventKey='proyecto' className="px-md-5 px-2" >
                                    <div className="m-4">
                                        <Card className="card-custom card-stretch gutter-b border">
                                            <Card.Header className="align-items-center border-0">
                                                <div className="card-title align-items-start flex-column">
                                                    <span className="font-weight-bolder text-dark">Proyecto a relacionar</span>
                                                </div>
                                            </Card.Header>
                                            <Card.Body className="py-2">
                                                <ProyectosCard proyecto = { proyecto } />
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </Accordion.Collapse>
                            </Accordion>
                        </ProyectoFormulario>
                    </Card.Body>
                </Card>
                <Modal size="lg" show = { modalCP } title = 'ACTUALIZAR DATOS DEL CLIENTE' handleClose = { this.handleCloseCP } >
                    <Form onSubmit={(e) => { e.preventDefault(); waitAlert(); this.sendForm(); }}>
                        <div className="row py-0 mx-0 mt-6 align-items-center d-flex justify-content-center">
                            <label className="w-auto mr-4 py-0 col-form-label text-dark-75 font-weight-bold font-size-lg">¿Quieres utilizar la ubicación del cliente?</label>
                            <div className="w-auto px-3">
                                <div className="radio-inline mt-0 ">
                                    <label className="radio radio-outline radio-brand text-dark-75 font-weight-bold">
                                        <input
                                            type="radio"
                                            name='ubicacion_cliente'
                                            value={true}
                                            onChange={this.onChange}
                                            checked={form.ubicacion_cliente === true ? true : false}
                                        />Si
										<span></span>
                                    </label>
                                    <label className="radio radio-outline radio-brand text-dark-75 font-weight-bold">
                                        <input
                                            type="radio"
                                            name='ubicacion_cliente'
                                            value={false}
                                            onChange={this.onChange}
                                            checked={form.ubicacion_cliente === false ? true : false}
                                        />No
										<span></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {
                            form.ubicacion_cliente && options.cp_clientes.length !== 1?
                                    <div className="row mx-0 mt-5 text-center d-flex justify-content-center">
                                        <Form.Label className="col-md-12 col-form-label font-weight-bolder">¿DE CUÁL CLIENTE DESEA UTILIZAR SU UBICACIÓN?</Form.Label>
                                        <div className="col-md-4">
                                            <SelectSearchGray
                                                formeditado={formeditado}
                                                options={options.cp_clientes} 
                                                placeholder="SELECCIONA EL CLIENTE"
                                                name="cp_ubicacion" 
                                                value={form.cp_ubicacion} 
                                                onChange={this.updateSelectCP}
                                                withtaglabel={0}
                                                withtextlabel={0}
                                                customdiv={'mb-0'}
                                            />
                                        </div>
                                    </div>
                                : ''
                        }
                        {
                            form.cp_ubicacion || options.cp_clientes.length === 1 ?
                            <div className={form.ubicacion_cliente === false?'d-none':'table-responsive-lg mt-7 mb-10'}>
                                <table className="table table-vertical-center w-65 mx-auto table-borderless" id="tcalendar_p_info">
                                    {
                                        options.cp_clientes.map((cliente, key) => {
                                            if (form.cp_ubicacion === cliente.value) {
                                                return (
                                                    this.printTable(key, cliente)
                                                )
                                            }else if(options.cp_clientes.length === 1){
                                                return (
                                                    this.printTable(key, cliente)
                                                )
                                            }
                                        })
                                    }
                                </table>
                            </div>
                            :''
                        }
                        <div className="card-footer p-0 mt-4 pt-3">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-center p-0">
                                    <Button icon='' className="mx-auto" type="submit" text="CONFIRMAR" />
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ProyectosForm)