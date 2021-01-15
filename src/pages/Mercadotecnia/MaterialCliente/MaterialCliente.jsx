import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { connect } from 'react-redux'
import ItemSlider from '../../../components/singles/ItemSlider'
import { Tab, Nav, Col, Row, Card, Accordion, } from 'react-bootstrap'
import { setSelectOptions } from '../../../functions/setters'
import { waitAlert, questionAlert, errorAlert, forbiddenAccessAlert, doneAlert, deleteAlert } from '../../../functions/alert'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { Folder, FolderStatic, Modal } from '../../../components/singles'
import { Button, BtnBackUrl, TablePagination, NewFolderInput } from '../../../components/form-components'
import Swal from 'sweetalert2'
import { NoFiles, Files, Build, Nothing } from '../../../components/Lottie'
class MaterialCliente extends Component {
    state = {
        newFolder: false,
        activeFolder: false,
        modal_add: false,
        submenuactive: null,
        abiertoSubMenu: false,
        abiertoCarpetaRender: false,
        adjuntosSubMenu: [],
        actualSubMenu: "",
        actualSubMenuCarpeta: "",
        opciones_adjuntos: [
            {
                nombre: 'PORTAFOLIO',
                icono: 'fas fa-briefcase',
                tipo: 1,
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'COMO TRABAJAMOS (FASE 1 Y 2)',
                icono: 'flaticon2-file',
                tipo: 2,
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'SERVICIOS GENERALES',
                icono: 'flaticon2-settings',
                tipo: 3,
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'SERVICIOS POR CATEGORIA',
                icono: 'fas fa-tag',
                tipo: 4,
                isActive: false,
                subMenu: true
            },
            {
                nombre: 'BROKERS',
                icono: 'fas fa-user-tie',
                tipo: 5,
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'VIDEOS',
                icono: 'fas fa-video',
                tipo: 6,
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'CASOS DE ÉXITO',
                icono: 'fas fa-folder-open',
                tipo: 7,
                isActive: false,
                subMenu: false
            }
        ],
        form: {
            empresa: 'inein',
            carpeta: '',
            adjuntos: {
                slider: {
                    name: '',
                    value: '',
                    placeholder: 'PORTAFOLIO',
                    files: [],
                    menu: 0
                },
                subportafolio: {
                    value: '',
                    placeholder: 'SUBPORTAFOLIO',
                    files: []
                },
                ejemplo: {
                    value: '',
                    placeholder: 'EJEMPLOS',
                    files: []
                },
                portada: {
                    value: '',
                    placeholder: 'PORTADA',
                    files: []
                },
                renders: {
                    reales: {
                        value: '',
                        placeholder: 'Reales',
                        files: []
                    },
                    inventados: {
                        value: '',
                        placeholder: 'Inventados',
                        files: []
                    },
                    placeholder: 'RENDERS'
                }
            }
        },
        options: {
            empresas: []
        },
        data: {
            empresas: []
        },
        formeditado: 0,
        empresa: '',
        activeTipo: ''
    };

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const material = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!material)
            history.push('/')
        this.getOptionsAxios()
    }

    openModalAddFiles = () => {
        this.setState({
            ...this.state,
            modal_add: true
        })
    }

    handleCloseModalAdd = () => {
        this.setState({
            ...this.state,
            modal_add: false
        })
    }

    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'mercadotecnia/material-clientes', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas } = response.data
                const { options, data, form } = this.state
                let { empresa } = this.state
                data.empresas = empresas
                options.empresas = setSelectOptions(empresas, 'name')
                empresas.map((element) => {
                    if(element.id === empresa.id)
                        empresa = element
                })
                this.setState({
                    ...this.state,
                    options,
                    data,
                    empresa,
                    form,
                    modal_add: false
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

    handleChange = (files, item) => {
        console.log('item', item)
        const { form, activeFolder, actualSubMenuCarpeta } = this.state
        this.onChangeAdjuntos({ target: { name: item, value: files, files: files } })
        if(actualSubMenuCarpeta === 'Reales' || actualSubMenuCarpeta === 'Inventados'){
            questionAlert('ENVIAR ARCHIVO', '¿ESTÁS SEGURO QUE DESEAS ENVIARLO?', () => { waitAlert(); this.addAdjuntoInRendersAxios(actualSubMenuCarpeta === 'Reales' ? 'renders-reales' : 'renders-inventados') })
        }else{
            if (form.adjuntos[item].value !== '') {
                if (activeFolder === false)
                    questionAlert('ENVIAR ARCHIVO', '¿ESTÁS SEGURO QUE DESEAS ENVIARLO?', () => { waitAlert(); this.addAdjunto(item) })
                else
                    questionAlert('ENVIAR ARCHIVO', '¿ESTÁS SEGURO QUE DESEAS ENVIARLO?', () => { waitAlert(); this.addAdjuntoInFolderAxios() })
            }
        }
    }

    onChangeAdjuntos = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        files.map((file, index) => {
            aux.push({
                name: file.name,
                file: file,
                url: URL.createObjectURL(file),
                key: index
            })
        })
        if(name === 'reales' || name === 'inventados'){
            form.adjuntos.renders[name].value = value
            form.adjuntos.renders[name].files = aux
        }else{
            form.adjuntos[name].value = value
            form.adjuntos[name].files = aux
        }
        this.setState({
            ...this.state,
            form
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

    deleteFile = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', element.name, () => this.deleteAdjuntoAxios(element.id, 'slider'))
    }

    deleteFileSubportafolio = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', '', () => this.deleteAdjuntoAxios(element.id, 'subportafolio'))
    }

    deleteFileEjemplo = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', '', () => this.deleteAdjuntoAxios(element.id, 'ejemplo'))
    }

    deleteFilePortada = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', '', () => this.deleteAdjuntoAxios(element.id, 'portada'))
    }

    deleteFileRenders = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', '', () => this.deleteAdjuntoAxios(element.id, 'renders'))
    }

    onClickDelete = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', element.name, () => this.deleteAdjuntoFromFolder(element.id))
    }

    onClickDeleteFolder = element => {
        deleteAlert('¿DESEAS ELIMINAR LA CARPETA?', element.tipo, () => this.deleteFolderAxios(element.id))
    }

    newFolder = () => {
        const { form, newFolder } = this.state
        form.carpeta = ''
        this.setState({
            ...this.state,
            newFolder: !newFolder,
            form
        })
    }

    goBackFolder = () => {
        this.setState({
            ...this.state,
            activeFolder: false
        })
    }
    goBackFolderSubmenu = () => {
        let { abiertoSubMenu, actualSubMenuCarpeta, abiertoCarpetaRender } = this.state
        if (abiertoCarpetaRender) {
            abiertoSubMenu = true
            actualSubMenuCarpeta = "RENDERS"
        }
        else {
            abiertoSubMenu = false
            actualSubMenuCarpeta = ""
        }

        this.setState({
            ...this.state,
            abiertoCarpetaRender: false,
            abiertoSubMenu,
            adjuntosSubMenu: [],
            actualSubMenuCarpeta

        })
    }
    onClickFolderSubMenu = (element) => {
        this.setState({
            ...this.state,
            adjuntosSubMenu: element.files,
            actualSubMenuCarpeta: element.placeholder,
            abiertoSubMenu: true
        })
    }

    onClickFolderRender = (element) => {
        this.setState({
            ...this.state,
            adjuntosSubMenu: element.files,
            actualSubMenuCarpeta: element.placeholder,
            abiertoSubMenu: true,
            abiertoCarpetaRender: true
        })
    }
    onClickFolder = (element) => {

        this.setState({
            ...this.state,
            activeFolder: element
        })
    }

    onSubmitNewDirectory = async () => {
        const { access_token } = this.props.authUser
        const { form, empresa } = this.state
        waitAlert()
        await axios.post(URL_DEV + 'mercadotecnia/material-clientes/empresas/' + empresa.id + '/caso-exito', { tipo: form.carpeta },
            { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
                (response) => {
                    Swal.close()
                    const { empresa, empresas } = response.data
                    const { form, data } = this.state
                    data.empresas = empresas
                    form.carpeta = ''
                    this.setState({
                        ...this.state,
                        empresa: empresa,
                        newFolder: false,
                        form,
                        data
                    })
                },
                (error) => {
                    console.log(error, 'error')
                    if (error.response.status === 401) forbiddenAccessAlert()
                    else errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.log(error, 'error')
            })
    }

    updateDirectoryAxios = async (name, element) => {
        const { access_token } = this.props.authUser
        const { form, empresa } = this.state
        waitAlert()
        await axios.put(URL_DEV + 'mercadotecnia/material-clientes/empresas/' + empresa.id + '/caso-exito/' + element.id, { tipo: name },
            { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
                (response) => {
                    Swal.close()
                    const { empresa, empresas } = response.data
                    const { form, data } = this.state
                    data.empresas = empresas
                    form.carpeta = ''
                    this.setState({
                        ...this.state,
                        empresa: empresa,
                        newFolder: false,
                        form,
                        data
                    })
                    return true
                },
                (error) => {
                    console.log(error, 'error')
                    if (error.response.status === 401) forbiddenAccessAlert()
                    else errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                    return true
                }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.log(error, 'error')
                return true
            })
    }

    deleteAdjuntoAxios = async (id, tipo_adjunto) => {
        const { access_token } = this.props.authUser
        const { empresa, submenuactive } = this.state
        await axios.delete(URL_DEV + 'mercadotecnia/material-clientes/' + empresa.id + '/adjunto/' + tipo_adjunto + '/' + id,
            { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
                (response) => {
                    const { empresa, tipo } = response.data
                    const { form } = this.state
                    if (tipo_adjunto === 'slider') {
                        form.adjuntos.slider.files = []
                        empresa.adjuntos.map((adjunto, key) => {
                            if (adjunto.pivot.tipo === tipo)
                                form.adjuntos.slider.files.push(adjunto)
                        })
                    } else {
                        form.adjuntos[tipo].files = []
                        empresa.tipos.map((element, key) => {
                            if (element.id === submenuactive)
                                element.adjuntos.map((adjunto) => {
                                    if (adjunto.pivot.tipo === tipo)
                                        form.adjuntos[tipo].files.push(adjunto)
                                })
                        })
                    }

                    this.setState({
                        ...this.state,
                        form
                    })

                    this.getOptionsAxios()
                    doneAlert('Archivo eliminado con éxito.')
                },
                (error) => {
                    console.log(error, 'error')
                    if (error.response.status === 401) forbiddenAccessAlert()
                    else errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.log(error, 'error')
            })
    }

    deleteAdjuntoFromFolder = async (id) => {
        const { access_token } = this.props.authUser
        const { empresa, activeFolder } = this.state
        await axios.delete(URL_DEV + 'mercadotecnia/material-clientes/empresas/' + empresa.id + '/caso-exito/' + activeFolder.id + '/adjuntos/' + id,
            { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
                (response) => {
                    const { empresa, empresas, carpeta } = response.data
                    const { data } = this.state
                    data.empresas = empresas
                    doneAlert('Archivos eliminado con éxito')
                    this.setState({
                        ...this.state,
                        empresa: empresa,
                        activeFolder: carpeta,
                        data
                    })
                },
                (error) => {
                    console.log(error, 'error')
                    if (error.response.status === 401) forbiddenAccessAlert()
                    else errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.log(error, 'error')
            })
    }

    deleteFolderAxios = async (id) => {
        const { access_token } = this.props.authUser
        const { empresa } = this.state
        await axios.delete(URL_DEV + 'mercadotecnia/material-clientes/empresas/' + empresa.id + '/caso-exito/' + id,
            { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
                (response) => {
                    const { empresa, empresas } = response.data
                    const { data } = this.state
                    data.empresas = empresas
                    doneAlert('Carpeta eliminada con éxito')
                    this.setState({
                        ...this.state,
                        empresa: empresa,
                        data
                    })
                },
                (error) => {
                    console.log(error, 'error')
                    if (error.response.status === 401) forbiddenAccessAlert()
                    else errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.log(error, 'error')
            })
    }

    async addAdjuntoInFolderAxios() {
        const { form, empresa, activeFolder } = this.state
        const { access_token } = this.props.authUser
        const data = new FormData();
        form.adjuntos.slider.files.map((file, key) => {
            if (typeof file.id === 'undefined') {
                data.append(`files_name[]`, file.name)
                data.append(`files[]`, file.file)
            }
        })
        data.append('tipo', activeFolder.id)
        await axios.post(URL_DEV + 'mercadotecnia/material-clientes/empresas/' + empresa.id + '/caso-exito/adjuntos', data,
            { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
                (response) => {
                    Swal.close()
                    const { empresa, empresas, carpeta } = response.data
                    const { form, data } = this.state
                    data.empresas = empresas
                    form.adjuntos.slider.files = []
                    form.adjuntos.slider.value = ''
                    doneAlert('Archivos adjuntados con éxito')
                    this.setState({
                        ...this.state,
                        empresa: empresa,
                        modal_add: false,
                        activeFolder: carpeta,
                        form,
                        data
                    })
                },
                (error) => {
                    console.log(error, 'error')
                    if (error.response.status === 401) forbiddenAccessAlert()
                    else errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.log(error, 'error')
            })
    }

    addAdjuntoInRendersAxios = async(tipo) => {
        const { access_token } = this.props.authUser
        const { form, empresa, submenuactive } = this.state
        const data = new FormData();
        waitAlert()
        data.append('empresa', empresa.id)
        form.adjuntos.renders[tipo ? 'reales' : 'inventandos'].files.map((file, key) => {
            if (typeof file.id === 'undefined') {
                data.append(`files_name[]`, file.name)
                data.append(`files[]`, file.file)
            }
        })
        data.append('proyecto', submenuactive)
        data.append('tipo', tipo)
        await axios.post(URL_DEV + 'mercadotecnia/material-clientes', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresa: empresaResponse, empresas, tipo } = response.data
                const { form, data } = this.state
                let { submenuactive, actualSubMenu } = this.state
                empresaResponse.tipos.map((element, key) => {
                    if (element.id === submenuactive){
                        let subportafolio = []
                        let ejemplo = []
                        let portada = []
                        let rendersReales = []
                        let rendersInventados = []
                        element.adjuntos.map((adjunto, index) => {
                            switch (adjunto.pivot.tipo) {
                                case "portada":
                                    portada.push(adjunto)
                                    break;
                                case "subportafolio":
                                    subportafolio.push(adjunto)
                                    break;
                                case "ejemplo":
                                    ejemplo.push(adjunto)
                                    break;
                                case "renders-reales":
                                    rendersReales.push(adjunto)
                                    break;
                                case "renders-inventados":
                                    rendersInventados.push(adjunto)
                                    break;
                            }
                        })
                        form.adjuntos.portada.files = portada
                        form.adjuntos.subportafolio.files = subportafolio
                        form.adjuntos.ejemplo.files = ejemplo
                        form.adjuntos.renders.reales.files = rendersReales
                        form.adjuntos.renders.inventados.files = rendersInventados
                        actualSubMenu = element.tipo
                        submenuactive = element.id
                    }
                })
                
                data.empresas = empresas

                this.setState({
                    ...this.state,
                    form,
                    empresa: empresaResponse,
                    empresas: empresas,
                    data,
                    modal_add: false,
                    abiertoSubMenu: false,
                    submenuactive,
                    actualSubMenu
                })

                doneAlert('Archivo adjuntado con éxito.')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) forbiddenAccessAlert()
                else errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addAdjunto(name) {
        const { access_token } = this.props.authUser
        const { form, empresa, submenuactive } = this.state
        const data = new FormData();
        const tipos = [
            'portafolio',
            'como_trabajamos',
            'servicios_generales',
            '',
            'brokers',
            'videos'
        ]

        data.append('empresa', empresa.id)

        if (name === 'slider') {
            form.adjuntos.slider.files.map((file, key) => {
                if (typeof file.id === 'undefined') {
                    data.append(`files_name[]`, file.name)
                    data.append(`files[]`, file.file)
                }
            })
            data.append('tipo', tipos[form.adjuntos.slider.eventKey])
        } else {
            form.adjuntos[name].files.map((file, key) => {
                if (typeof file.id === 'undefined') {
                    data.append(`files_name[]`, file.name)
                    data.append(`files[]`, file.file)
                }
            })
            data.append('proyecto', submenuactive)
            data.append('tipo', name)
        }

        await axios.post(URL_DEV + 'mercadotecnia/material-clientes', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresa: empresaResponse, empresas, tipo } = response.data
                const { form, data } = this.state
                let { submenuactive, actualSubMenu } = this.state

                if (name === 'slider') {
                    form.adjuntos.slider.files = []
                    empresaResponse.adjuntos.map((adjunto, key) => {
                        if (adjunto.pivot.tipo === tipo)
                            form.adjuntos.slider.files.push(adjunto)
                    })
                } else {
                    
                    empresaResponse.tipos.map((element, key) => {
                        if (element.id === submenuactive){
                            let subportafolio = []
                            let ejemplo = []
                            let portada = []
                            let rendersReales = []
                            let rendersInventados = []
                            element.adjuntos.map((adjunto, index) => {
                                switch (adjunto.pivot.tipo) {
                                    case "portada":
                                        portada.push(adjunto)
                                        break;
                                    case "subportafolio":
                                        subportafolio.push(adjunto)
                                        break;
                                    case "ejemplo":
                                        ejemplo.push(adjunto)
                                        break;
                                    case "renders-reales":
                                        rendersReales.push(adjunto)
                                        break;
                                    case "renders-inventados":
                                        rendersInventados.push(adjunto)
                                        break;
                                }
                            })
                            form.adjuntos.portada.files = portada
                            form.adjuntos.subportafolio.files = subportafolio
                            form.adjuntos.ejemplo.files = ejemplo
                            form.adjuntos.renders.reales.files = rendersReales
                            form.adjuntos.renders.inventados.files = rendersInventados
                            actualSubMenu = element.tipo
                            submenuactive = element.id
                        }
                    })
                }

                data.empresas = empresas

                this.setState({
                    ...this.state,
                    form,
                    empresa: empresaResponse,
                    empresas: empresas,
                    data,
                    modal_add: false,
                    abiertoSubMenu: false,
                    submenuactive,
                    actualSubMenu
                })

                doneAlert('Archivo adjuntado con éxito.')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) forbiddenAccessAlert()
                else errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    openAccordion = (indiceClick, name) => {

        const tipos = ['portafolio', 'como_trabajamos', 'servicios_generales', '', 'brokers', 'videos']
        let { opciones_adjuntos, form, empresa } = this.state

        form.adjuntos.slider.placeholder = name
        form.adjuntos.slider.files = []
        form.adjuntos.slider.menu = indiceClick === 3 ? 1 : 0
        form.adjuntos.slider.eventKey = indiceClick

        if (indiceClick !== 3) {
            if (empresa.adjuntos)
                empresa.adjuntos.map((adjunto, key) => {
                    if (tipos[indiceClick] === adjunto.pivot.tipo)
                        form.adjuntos.slider.files.push(adjunto)
                })
        }

        opciones_adjuntos.map((element, key) => {
            if (indiceClick === key) {
                element.isActive = element.isActive ? false : true
            }
            else {
                element.isActive = false
            }
            return false
        })

        this.setState({
            opciones_adjuntos: opciones_adjuntos,
            form,
            submenuactive: '',
            activeTipo: indiceClick
        });
    }

    changeActiveKey = empresa => {

        let { opciones_adjuntos, form, activeTipo } = this.state
        let aux = activeTipo === undefined ? 0 : activeTipo
        const tipos = ['portafolio', 'como_trabajamos', 'servicios_generales', '', 'brokers', 'videos']
        const placeholder = ['PORTAFOLIO', 'COMO TRABAJAMOS (FASE 1 Y 2)', 'SERVICIOS GENERALES', 'SERVICIOS POR CATEGORIA', 'BROKERS', 'VIDEOS']

        form.adjuntos.slider.placeholder = placeholder[aux]
        form.adjuntos.slider.files = []
        empresa.adjuntos.map((adjunto, key) => {
            if (aux !== 3)
                if (adjunto.pivot.tipo === tipos[aux])
                    form.adjuntos.slider.files.push(adjunto)
        })
        form.adjuntos.slider.menu = aux === 3 ? 1 : 0
        form.adjuntos.slider.eventKey = aux
        opciones_adjuntos.map((element, key) => {
            if (key === aux)
                opciones_adjuntos[aux].isActive = true
            else
                opciones_adjuntos[key].isActive = false
        })
        this.setState({
            empresa: empresa,
            opciones_adjuntos: opciones_adjuntos,
            form,
            submenuactive: ''
        });
    }

    loadAdjuntos = tipo => {
        console.log(tipo, 'TIPO')
        const { adjuntos } = tipo
        let { form } = this.state
        let subportafolio = []
        let ejemplo = []
        let portada = []
        let rendersReales = []
        let rendersInventados = []
        adjuntos.forEach(adjunto => {
            switch (adjunto.pivot.tipo) {
                case "portada":
                    portada.push(adjunto)
                    break;
                case "subportafolio":
                    subportafolio.push(adjunto)
                    break;
                case "ejemplo":
                    ejemplo.push(adjunto)
                    break;
                case "renders-reales":
                    rendersReales.push(adjunto)
                    break;
                case "renders-inventados":
                    rendersInventados.push(adjunto)
                    break;
                //  case "renders":
                //    renders.push(adjunto)
                //  break;
            }
        })
        form.adjuntos.portada.files = portada
        form.adjuntos.subportafolio.files = subportafolio
        form.adjuntos.ejemplo.files = ejemplo
        form.adjuntos.renders.reales.files = rendersReales
        form.adjuntos.renders.inventados.files = rendersInventados
        this.setState({
            form,
            abiertoSubMenu: false,
            submenuactive: tipo.id,
            actualSubMenu: tipo.tipo
        })
    }

    renderCarpetaVacia = () => {
        return(
            <div className='col-md-12 '>
                <div>
                    <NoFiles />
                </div>
                <div className='text-center mt-5 font-weight-bolder font-size-h4 text-primary'>
                    CARPETA VACÍA
                </div>
            </div>
        )
    }

    getNameSlider = () => {
        const { activeTipo, actualSubMenuCarpeta } = this.state
        if(activeTipo !== 3)
            return 'slider'
        else{
            switch(actualSubMenuCarpeta.toUpperCase()){
                case 'SUBPORTAFOLIO':
                    return 'subportafolio'
                case 'EJEMPLO':
                    return 'ejemplo'
                case 'PORTADA':
                    return 'portada'
                case 'REALES':
                    return 'reales'
                case 'INVENTADOS':
                    return 'inventados'
                default:
                    break;
            }
        }
    }

    getFilesSlider = () => {
        const { form, activeTipo, actualSubMenuCarpeta } = this.state
        let aux = []
        if(activeTipo !== 3){
            form.adjuntos.slider.files.map((file)=>{
                if(!file.id){
                    aux.push(file)
                }
            })
        }else{
            switch(actualSubMenuCarpeta.toUpperCase()){
                case 'SUBPORTAFOLIO':
                    form.adjuntos.subportafolio.files.map((file)=>{
                        if(!file.id){
                            aux.push(file)
                        }
                    })
                    break;
                case 'EJEMPLO':
                    form.adjuntos.ejemplo.files.map((file)=>{
                        if(!file.id){
                            aux.push(file)
                        }
                    })
                    break;
                case 'PORTADA':
                    form.adjuntos.portada.files.map((file)=>{
                        if(!file.id){
                            aux.push(file)
                        }
                    })
                    break;
                case 'REALES':
                    form.adjuntos.renders.reales.files.map((file)=>{
                        if(!file.id){
                            aux.push(file)
                        }
                    })
                    break;
                case 'INVENTADOS':
                    form.adjuntos.renders.inventados.files.map((file)=>{
                        if(!file.id){
                            aux.push(file)
                        }
                    })
                    break;
                default:
                    break;
            }
        }
        return aux
    }
    
    render() {
        const { form, data, opciones_adjuntos, empresa, submenuactive, newFolder, activeTipo, activeFolder, modal_add, abiertoSubMenu, adjuntosSubMenu, actualSubMenu, actualSubMenuCarpeta, abiertoCarpetaRender } = this.state
        // let adjuntos = [];
        // adjuntos = adjuntos ? adjuntos : []
        const sub_menu = (element) => {
            switch (element.tipo) {
                case 4: return <Nav className="navi">
                    {
                        empresa ?
                            empresa.tipos.map((tipo, key) => {
                                return (
                                    <Nav.Item className='navi-item' key={key} onClick={(e) => { e.preventDefault(); this.loadAdjuntos(tipo) }}>
                                        <Nav.Link className="navi-link p-2" eventKey={tipo.id}>
                                            <span className={submenuactive === tipo.id ? "navi-icon text-primary" : "navi-icon"}>
                                                <span className="navi-bullet">
                                                    <i className="bullet bullet-dot"></i>
                                                </span>
                                            </span>
                                            <div className={submenuactive === tipo.id ? "navi-text text-primary" : "navi-text"}>
                                                <span className="d-block font-weight-bolder" >{tipo.tipo}</span>
                                            </div>
                                        </Nav.Link>
                                    </Nav.Item>
                                )
                            })
                            : ''
                    }
                </Nav>;
                default:
                    return <></>
            }
        }

        return (
            <Layout active={'mercadotecnia'} {...this.props}>
                <Tab.Container className="p-5">
                    <Row>
                        <Col sm={3}>
                            <Card className="card-custom card-stretch gutter-b">
                                <div className="card-header">
                                    <div className="card-title">
                                        <h3 className="card-label">Adjuntos</h3>
                                    </div>
                                </div>
                                <div className="card-body px-3">
                                    <Accordion id="accordion-material" className="accordion-light accordion-svg-toggle">
                                        {
                                            opciones_adjuntos.map((element, key) => {
                                                return (
                                                    <Card className="w-auto border-0 mb-2" key={key}>
                                                        <Card.Header>
                                                            <div className={(element.isActive) ? 'card-title text-primary collapsed rounded-0 ' : 'card-title text-dark-50 rounded-0'} onClick={() => { this.openAccordion(key, element.nombre) }}>
                                                                <div className="card-label">
                                                                    <i className={(element.isActive) ? element.icono + ' text-primary mr-3' : element.icono + ' text-dark-50 mr-3'}>
                                                                    </i>{element.nombre}
                                                                </div>
                                                                {
                                                                    element.subMenu ?
                                                                        <span className="svg-icon">
                                                                            <SVG src={toAbsoluteUrl('/images/svg/Angle-double-right.svg')} />
                                                                        </span>
                                                                        : ''
                                                                }
                                                            </div>
                                                        </Card.Header>
                                                        <div className={(element.isActive) ? 'collapse show' : 'collapse'} >
                                                            {
                                                                element.subMenu ?
                                                                    <Card.Body>
                                                                        <div>{sub_menu(element)}</div>
                                                                    </Card.Body>
                                                                    : ''
                                                            }
                                                        </div>
                                                    </Card>
                                                )
                                            }
                                            )
                                        }
                                    </Accordion>
                                </div>
                            </Card>
                        </Col>
                        <Col sm={9}>
                            <Card className="card-custom card-stretch gutter-b" >
                                <Card.Header className="">
                                    <div className="card-toolbar">
                                        <Nav className="nav nav-pills nav-pills-sm nav-light-primary font-weight-bolder">
                                            {
                                                data.empresas.map((empresa, index) => {
                                                    return (
                                                        <Nav.Item key={index}>
                                                            <Nav.Link eventKey={empresa.id} className="py-2 px-4" onClick={(e) => { e.preventDefault(); this.changeActiveKey(empresa) }} >
                                                                {empresa.name}
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    )
                                                })
                                            }
                                        </Nav>
                                    </div>
                                </Card.Header>
                                <Card.Body className={""}>
                                    {
                                        empresa !== '' ?
                                            activeTipo === 6 ?
                                                <div>
                                                    <div className='d-flex justify-content-between'>
                                                        <div className=''>
                                                            {
                                                                activeFolder !== false ?
                                                                    <BtnBackUrl
                                                                        id_boton="regresar"
                                                                        icon=""
                                                                        classname_boton="btn btn-outline-secondary btn-icon btn-sm"
                                                                        onclick_boton={(e) => { e.preventDefault(); this.goBackFolder() }}
                                                                        only_icon="fas fa-angle-left icon-md text-primary"
                                                                        tooltip={{ text: 'REGRESAR' }}
                                                                        url_1="Casos de éxito |"
                                                                        url_2={activeFolder.tipo}
                                                                    />
                                                                    : ''
                                                            }
                                                        </div>
                                                        <div>
                                                            {
                                                                activeFolder === false ?
                                                                    newFolder === false &&
                                                                        /* Entra en casos de éxito no está en un folder activo y no está el modal newFolder */
                                                                        <Button id="nueva_carpeta" icon='' 
                                                                            className="btn btn-outline-secondary btn-icon btn-sm "
                                                                            onClick={(e) => { e.preventDefault(); this.newFolder() }}
                                                                            only_icon="fas fa-folder-plus icon-15px text-primary"
                                                                            tooltip={{ text: 'NUEVA CARPETA' }} />
                                                                :
                                                                    <Button id="subir_archivos" icon=''
                                                                        className="btn btn-outline-secondary btn-icon btn-sm "
                                                                        onClick={(e) => { e.preventDefault(); this.openModalAddFiles() }}
                                                                        only_icon="fas fa-upload icon-15px text-primary"
                                                                        tooltip={{ text: 'SUBIR ARCHIVOS' }} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className='row mx-0 my-3'>
                                                        {
                                                            newFolder && activeFolder === false &&
                                                                <div className='col-md-3 col-lg-2'>
                                                                    <NewFolderInput
                                                                        newFolder={this.newFolder}
                                                                        onSubmit={(e) => { e.preventDefault(); this.onSubmitNewDirectory() }}
                                                                        customclass={"input-folder"}
                                                                        name={'carpeta'}
                                                                        value={form.carpeta}
                                                                        onChange={this.onChange}
                                                                    />
                                                                </div>
                                                        }
                                                        {
                                                            activeFolder === false ?
                                                                empresa.casos_exito.length > 0 ?
                                                                    empresa.casos_exito.map((element, index) => {
                                                                        return (
                                                                            <div className='col-md-3 col-lg-2' key={index}>
                                                                                <Folder
                                                                                    text={element.tipo}
                                                                                    onClick={this.onClickFolder}
                                                                                    onClickDelete={this.onClickDeleteFolder}
                                                                                    element={element}
                                                                                    updateDirectory={this.updateDirectoryAxios}
                                                                                />
                                                                            </div>
                                                                        )
                                                                    })
                                                                :
                                                                    this.renderCarpetaVacia()
                                                            :
                                                                activeFolder.adjuntos.length === 0 ?
                                                                    this.renderCarpetaVacia()
                                                                :
                                                                    <TablePagination
                                                                        adjuntos={activeFolder.adjuntos}
                                                                        delete_onclick={this.onClickDelete} />
                                                        }
                                                    </div>
                                                </div>
                                            :
                                                form.adjuntos.slider.menu === 0 ?
                                                    <>
                                                        {
                                                            form.adjuntos.slider.files.length === 0 ?
                                                                <>
                                                                    <div className="d-flex justify-content-end">
                                                                        <Button id="subir_archivos" icon=''
                                                                            className="btn btn-outline-secondary btn-icon btn-sm "
                                                                            onClick={(e) => { e.preventDefault(); this.openModalAddFiles() }}
                                                                            only_icon="fas fa-upload icon-15px text-primary"
                                                                            tooltip={{ text: 'SUBIR ARCHIVOS' }} />
                                                                    </div>
                                                                    { this.renderCarpetaVacia() }
                                                                </>
                                                            :
                                                                <>
                                                                    <div className="d-flex justify-content-end">
                                                                        <Button id="subir_archivos" icon=''
                                                                            className="btn btn-outline-secondary btn-icon btn-sm "
                                                                            onClick={(e) => { e.preventDefault(); this.openModalAddFiles() }}
                                                                            only_icon="fas fa-upload icon-15px text-primary"
                                                                            tooltip={{ text: 'SUBIR ARCHIVOS' }} />
                                                                    </div>
                                                                    <TablePagination
                                                                        adjuntos={form.adjuntos.slider.files} delete_onclick={this.deleteFile} />
                                                                </>
                                                        }
                                                    </>
                                                :
                                                    abiertoSubMenu ?
                                                        <div>
                                                            <div className="d-flex justify-content-end">
                                                                {
                                                                    actualSubMenuCarpeta !== 'RENDERS' ?
                                                                        <Button id="subir_archivos" icon=''
                                                                            className="btn btn-outline-secondary btn-icon btn-sm "
                                                                            onClick={(e) => { e.preventDefault(); this.openModalAddFiles() }}
                                                                            only_icon="fas fa-upload icon-15px text-primary"
                                                                            tooltip={{ text: 'SUBIR ARCHIVOS' }} />
                                                                    : ''
                                                                }
                                                            </div>
                                                            <BtnBackUrl id_boton="regresar" icon=""
                                                                classname_boton="btn btn-outline-secondary btn-icon btn-sm"
                                                                onclick_boton={(e) => { e.preventDefault(); this.goBackFolderSubmenu() }}
                                                                only_icon="fas fa-angle-left icon-md text-primary" tooltip={{ text: 'REGRESAR' }}
                                                                url_1 = { actualSubMenu + "  |  " + (abiertoCarpetaRender ? "RENDERS  |  " : "")}
                                                                url_2 = { actualSubMenuCarpeta }
                                                            />
                                                            {
                                                                actualSubMenuCarpeta === "RENDERS" ?
                                                                    <div className="row mx-0 col-md-12 row-paddingless px-0 d-flex justify-content-center">
                                                                        <div className="col-md-4">
                                                                            {
                                                                                Object.keys(form.adjuntos.renders).map((nombreRenderCarpeta, key) => {
                                                                                    if (nombreRenderCarpeta !== "placeholder")
                                                                                        return (
                                                                                            <div className='col-md-12' key={key}>
                                                                                                <FolderStatic
                                                                                                    text={form.adjuntos.renders[nombreRenderCarpeta].placeholder}
                                                                                                    onClick={this.onClickFolderRender}
                                                                                                    element={form.adjuntos.renders[nombreRenderCarpeta]}
                                                                                                />
                                                                                            </div>
                                                                                        )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    adjuntosSubMenu.length === 0 ?
                                                                        this.renderCarpetaVacia()
                                                                    :
                                                                        <TablePagination adjuntos={adjuntosSubMenu} delete_onclick={this.deleteFile} />
                                                            }
                                                        </div>
                                                        :
                                                        submenuactive ?
                                                            <div className="row mx-0 col-md-12 row-paddingless px-0 d-flex justify-content-center">
                                                                <div className="col-md-3">
                                                                    {
                                                                        Object.keys(form.adjuntos).map((subcarpeta, key) => {
                                                                            if (subcarpeta !== "slider")
                                                                                return (
                                                                                    <div className='col-md-12' key={key}>
                                                                                        <FolderStatic
                                                                                            text={subcarpeta}
                                                                                            onClick={this.onClickFolderSubMenu}
                                                                                            element={form.adjuntos[subcarpeta]}
                                                                                        />
                                                                                    </div>
                                                                                )
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className='col-md-12'>
                                                                <div>
                                                                    <Files />
                                                                </div>
                                                                <div className='text-center font-weight-bolder font-size-h3 text-primary'>
                                                                    Da click a un submenú de <br />servicios por categoría
                                                                </div>
                                                            </div>
                                            :
                                            <div className='col-md-12'>
                                                <div>
                                                    <Build />
                                                </div>
                                                <div className='text-center mt-5 font-weight-bolder font-size-h3 text-primary'>
                                                    Selecciona la empresa
                                                </div>
                                            </div>
                                    }
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab.Container>
                <Modal show={modal_add} title='Agregar adjuntos' handleClose={this.handleCloseModalAdd} size='lg' >
                    <div className=''>
                        <div className="text-center font-weight-bolder my-2 pt-3">
                            {activeTipo === 6 ? activeFolder.tipo : activeTipo === 3 ? actualSubMenuCarpeta : form.adjuntos.slider.placeholder}
                        </div>
                        <ItemSlider item={this.getNameSlider()} items = { this.getFilesSlider() }
                            handleChange={this.handleChange} multiple={true} />
                    </div>
                </Modal>
            </Layout >
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(MaterialCliente);