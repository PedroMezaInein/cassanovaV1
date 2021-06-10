import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { connect } from 'react-redux'
import ItemSlider from '../../../components/singles/ItemSlider'
import { Tab, Nav, Col, Row, Card, Accordion, } from 'react-bootstrap'
import { waitAlert, questionAlert, errorAlert, printResponseErrorAlert, doneAlert, deleteAlert } from '../../../functions/alert'
import SVG from "react-inlinesvg";
import { setFormHeader, setSingleHeaderJson, toAbsoluteUrl } from "../../../functions/routers"
import { Folder, FolderStatic, Modal } from '../../../components/singles'
import { Button, BtnBackUrl, TablePagination, NewFolderInput } from '../../../components/form-components'
import Swal from 'sweetalert2'
import { NoFiles, Files, Build } from '../../../components/Lottie'
import { v4 as uuidv4 } from "uuid";
const chunkSize = 1048576 * 30;
/* const arrayOpcionesAdjuntos = ['portafolio', 'como_trabajamos', 'servicios_generales', '', 'brokers', 'videos']; */
class MaterialCliente extends Component {
    state = {
        chunked: {
            showProgress: false,
            progress: 0,
            counter: 1,
            begin: 0,
            end: chunkSize,
            filesize: 0,
            totalCount: 1,
            fileID: '',
            file: '',
            type: ''
        },
        data: { empresas: [] },
        empresa: '',
        submenuactive: '',
        menuactive: '',
        level: 0,
        levelName: '',
        levelItem: [],
        url: [],
        newFolder: false,
        modal: false,
        form: {
            carpeta: '',
            adjuntos: {
                adjuntos: {
                    name: '',
                    value: '',
                    placeholder: '',
                    files: [],
                },
            }
        },
        opciones_adjuntos: [
            {
                nombre: 'PORTAFOLIO',
                slug: 'portafolio',
                icono: 'fas fa-briefcase',
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'COMO TRABAJAMOS (FASE 1 Y 2)',
                icono: 'flaticon2-file',
                slug: 'como_trabajamos',
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'SERVICIOS GENERALES',
                icono: 'flaticon2-settings',
                slug: 'servicios_generales',
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'SERVICIOS POR CATEGORIA',
                icono: 'fas fa-tag',
                isActive: false,
                subMenu: true
            },
            {
                nombre: 'BROKERS',
                slug: 'brokers',
                icono: 'fas fa-user-tie',
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'VIDEOS',
                slug: 'videos',
                icono: 'fas fa-video',
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'CASOS DE ÉXITO',
                icono: 'fas fa-folder-open',
                isActive: false,
                subMenu: false
            }
        ],
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

    /* ANCHOR AXIOS FUNCTIONS */

    /* ANCHOR GET ALL EMPRESAS Y ADJUNTOS */
    getOptionsAxios = async () => {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'mercadotecnia/material-clientes', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas } = response.data
                const { data } = this.state
                data.empresas = empresas
                this.setState({ ...this.state, data })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    /* ANCHOR GET ADJUNTOS POR EMPRESA */
    getAdjuntoEmpresaAxios = async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}mercadotecnia/material-clientes/empresa/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
        (response) => {
                Swal.close()
                const { empresa } = response.data
                const { opciones_adjuntos } = this.state
                opciones_adjuntos.map((element, index)=>{
                    if(index === 0) element.isActive = true
                    else element.isActive = false
                    return ''
                })
                this.setState({...this.state, empresa, opciones_adjuntos, submenuactive: '', menuactive: 0, level: 0})
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    /* ANCHOR AGREGANDO NUEVA CARPETA EN LOS RENDERS */
    onSubmitNewDirectoryRender = async () => {
        const { access_token } = this.props.authUser
        const { form, empresa, url, submenuactive } = this.state
        waitAlert()
        await axios.post(`${URL_DEV}mercadotecnia/material-clientes/empresas/${empresa.id}/renders`, 
            { carpeta: form.carpeta, tipo: url[url.length - 1], categoria: submenuactive },
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresa } = response.data
                const { form } = this.state
                form.carpeta = ''
                this.setState({...this.state, empresa: empresa, form, newFolder: false})
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    /* ANCHOR AGREGANDO NUEVA CARPETA EN LAS FOTOGRAFÍAS */
    onSubmitNewDirectoryFotografías = async () => {
        const { access_token } = this.props.authUser
        const { form, empresa, url, submenuactive } = this.state
        waitAlert()
        await axios.post(`${URL_DEV}v2/mercadotecnia/material-clientes/empresas/${empresa.id}/fotografias`, 
            { carpeta: form.carpeta, tipo: url[url.length - 1], categoria: submenuactive },
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresa } = response.data
                const { form } = this.state
                form.carpeta = ''
                this.setState({...this.state, empresa: empresa, form, newFolder: false})
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    /* ANCHOR NEW DIRECTORY FOR CASOS DE EXITO */
    onSubmitNewDirectoryCasosExito = async () => {
        const { access_token } = this.props.authUser
        const { form, empresa } = this.state
        waitAlert()
        await axios.post(`${URL_DEV}mercadotecnia/material-clientes/empresas/${empresa.id}/caso-exito`, { tipo: form.carpeta },
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresa } = response.data
                const { form } = this.state
                form.carpeta = ''
                this.setState({...this.state, empresa: empresa, form, newFolder: false})
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    resetChunks = (file) => {
        const { chunked } = this.state
        chunked.showProgress = false
        chunked.progress = 0
        chunked.counter = 1
        chunked.begin = 0
        chunked.end = chunkSize
        chunked.filesize = file ? file.file.size : 0
        chunked.totalCount = 1
        chunked.fileID = ''
        chunked.file = ''
        chunked.tipo = ''
        this.setState({chunked})
    }

    addAdjunto = () => {
        const { form } = this.state
        let totalCount = 0
        let fileID = ''
        if(form.adjuntos.adjuntos.files.length){
            form.adjuntos.adjuntos.files.forEach((file) => {
                this.resetChunks(file)
                totalCount = file.file.size % chunkSize === 0 ? file.file.size / chunkSize : Math.floor(file.file.size / chunkSize) + 1
                fileID = uuidv4()
                this.fileUpload(totalCount, fileID, file)
            })
        }
    }

    fileUpload = (totalCount, fileID, file) => {
        waitAlert()
        const { chunked } = this.state
        chunked.totalCount = totalCount
        chunked.fileID = fileID
        chunked.file = file.file
        const { menuactive, opciones_adjuntos, levelName  } = this.state
        if(menuactive === 3){
            chunked.tipo = levelName
        }else{
            if(opciones_adjuntos.length >= menuactive + 1)
                chunked.tipo = opciones_adjuntos[menuactive].slug
        }
        console.log(chunked, 'chunked')
        this.setState({chunked})
        if(chunked.counter < totalCount){
            let chunk = file.file.slice(chunked.begin, chunked.end)
            this.uploadChunk(chunk)
        }
    }

    uploadChunk = async(chunk) => {
        try{
            const { chunked, menuactive, submenuactive } = this.state
            const { access_token } = this.props.authUser
            let parametros = { counter: chunked.counter, id: chunked.fileID, fileName: chunked.file.name }
            if(menuactive === 3){ parametros.proyecto = submenuactive }
            await axios.post(`${URL_DEV}v2/mercadotecnia/material-clientes/chunk`, chunk, 
                { params: parametros, headers: setSingleHeaderJson(access_token) }).then((response) => {
                    chunked.begin = chunked.end
                    chunked.end = chunked.end + chunkSize
                    if(chunked.counter === chunked.totalCount){
                        console.log("Process is complete, counter", chunked.counter);
                        this.setState({chunked});
                        this.uploadCompleted();
                    }else{
                        chunked.porcentaje = ( chunked.counter / chunked.totalCount ) * 100;
                        chunked.counter =  chunked.counter + 1;
                        this.setState({chunked})
                        let chunk = chunked.file.slice(chunked.begin, chunked.end)
                        this.uploadChunk(chunk)
                    }
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.log(error, 'error')
            })
        } catch (error) { console.log("error", error); }
    }

    uploadCompleted = async() => {
        const { access_token } = this.props.authUser
        const { chunked, form, empresa } = this.state
        waitAlert()
        try{
            await axios.post(`${URL_DEV}v2/mercadotecnia/material-clientes/complete`, { empresa: empresa.id }, 
            { 
                params: { tipo: chunked.tipo, total: chunked.totalCount, id: chunked.fileID, fileName: chunked.file.name }, 
                headers: setSingleHeaderJson(access_token)
            }).then(
                (response) => {
                    Swal.close()
                    const { empresa } = response.data
                    form.adjuntos.adjuntos.files = []
                    form.adjuntos.adjuntos.value = ''
                    this.setState({...this.state,form,empresa:empresa})
            }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.log(error, 'error')
            })
        } catch (error) { console.log("error", error); }   
    }

    /* ANCHOR ADD ADJUNTO RENDER */
    addAdjuntoInRender = async() => {
        const { url, levelItem, form, submenuactive, empresa } = this.state
        const { access_token } = this.props.authUser
        const data = new FormData();
        let tipo = ''
        if(url.length > 2)
            tipo = url[url.length - 2]
        data.append('empresa', empresa.id)
        form.adjuntos.adjuntos.files.map((file)=>{
            data.append(`files_name[]`, file.name)
            data.append(`files[]`, file.file)
            return ''
        })
        data.append('tipo', tipo)
        data.append('categoria', submenuactive)
        await axios.post(`${URL_DEV}mercadotecnia/material-clientes/renders/carpeta/${levelItem.id}`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresa, carpeta } = response.data
                let { levelItem } = this.state
                form.adjuntos.adjuntos.files = []
                form.adjuntos.adjuntos.value = ''
                levelItem = carpeta
                this.setState({...this.state, form, empresa:empresa, levelItem})
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    /* ANCHOR ADD ADJUNTO RENDER */
    addAdjuntoInFotografias = async() => {
        const { url, levelItem, form, submenuactive, empresa } = this.state
        const { access_token } = this.props.authUser
        const data = new FormData();
        let tipo = ''
        if(url.length > 2)
            tipo = url[url.length - 2]
        data.append('empresa', empresa.id)
        form.adjuntos.adjuntos.files.map((file)=>{
            data.append(`files_name[]`, file.name)
            data.append(`files[]`, file.file)
            return ''
        })
        data.append('tipo', tipo)
        data.append('categoria', submenuactive)
        await axios.post(`${URL_DEV}v2/mercadotecnia/material-clientes/empresas/${empresa.id}/fotografias/carpeta/${levelItem.id}`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresa, carpeta } = response.data
                let { levelItem } = this.state
                form.adjuntos.adjuntos.files = []
                form.adjuntos.adjuntos.value = ''
                levelItem = carpeta
                this.setState({...this.state, form, empresa:empresa, levelItem})
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    /* ANCHOR ADD ADJUNTO CASOS EXITO */
    addAdjuntoInCasoExito = async() => {
        const { levelItem, form, empresa } = this.state
        const { access_token } = this.props.authUser
        const data = new FormData();
        form.adjuntos.adjuntos.files.map((file)=>{
            data.append(`files_name[]`, file.name)
            data.append(`files[]`, file.file)
            return '';
        })
        data.append('tipo', levelItem.id)
        await axios.post(`${URL_DEV}mercadotecnia/material-clientes/empresas/${empresa.id}/caso-exito/adjuntos`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresa, carpeta } = response.data
                let { levelItem } = this.state
                form.adjuntos.adjuntos.files = []
                form.adjuntos.adjuntos.value = ''
                levelItem = carpeta
                this.setState({...this.state, form, empresa:empresa, levelItem})
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    /* ANCHOR DELETE SINGLE FILE */
    deleteAdjunto = async (id, tipo) => {
        const { access_token } = this.props.authUser
        const { empresa } = this.state
        await axios.delete(`${URL_DEV}mercadotecnia/material-clientes/${empresa.id}/adjunto/${tipo}/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('ADJUNTO ELIMINADO CON ÉXITO')
                const { empresa } = response.data
                this.setState({...this.state,empresa:empresa})
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    /* ANCHOR DELETE ADJUNTO IN RENDER */
    deleteAdjuntoInRender = async element => {
        const { access_token } = this.props.authUser
        const { empresa, submenuactive, url } = this.state
        let tipo = ''
        if(url.length > 2){
            tipo = url[url.length - 2]
        }
        await axios.delete(`${URL_DEV}mercadotecnia/material-clientes/empresas/${empresa.id}/tipo/${submenuactive}/renders/${tipo}/adjuntos/${element.id}`, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('ADJUNTO ELIMINADO CON ÉXITO')
                const { empresa, carpeta } = response.data
                this.setState({...this.state,empresa:empresa, levelItem: carpeta})
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    /* ANCHOR DELETE ADJUNTO IN RENDER */
    deleteAdjuntoInFotografias = async element => {
        const { access_token } = this.props.authUser
        const { empresa, submenuactive, url } = this.state
        let tipo = ''
        if(url.length > 2){
            tipo = url[url.length - 2]
        }
        await axios.delete(`${URL_DEV}v2/mercadotecnia/material-clientes/empresas/${empresa.id}/tipo/${submenuactive}/fotografias/${tipo}/adjuntos/${element.id}`, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('ADJUNTO ELIMINADO CON ÉXITO')
                const { empresa, carpeta } = response.data
                this.setState({...this.state,empresa:empresa, levelItem: carpeta})
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    /* ANCHOR DELETE ADJUNTO IN CASO EXITO */
    deleteAdjuntoInCasoExito = async element => {
        const { access_token } = this.props.authUser
        const { empresa, levelItem } = this.state
        await axios.delete(`${URL_DEV}mercadotecnia/material-clientes/empresas/${empresa.id}/caso-exito/${levelItem.id}/adjuntos/${element.id}`, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('ADJUNTO ELIMINADO CON ÉXITO')
                const { empresa, carpeta } = response.data
                this.setState({...this.state,empresa:empresa, levelItem: carpeta})
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    /* ANCHOR CHANGE NAME OF DIRECTORY IN RENDERS */
    updateDirectoryInRender = async (name, element) => {
        const { access_token } = this.props.authUser
        const { empresa } = this.state
        waitAlert()
        await axios.put(`${URL_DEV}mercadotecnia/material-clientes/empresas/${empresa.id}/renders/carpeta/${element.id}`, { name: name },
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresa, carpeta } = response.data
                const { form } = this.state
                form.carpeta = ''
                this.setState({ ...this.state, empresa: empresa, levelItem: carpeta, newFolder: false, form })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
            return true
        })
    }

    /* ANCHOR CHANGE NAME OF DIREC IN CASO DE EXITO */
    updateDirectoryInCasoExito = async (name, element) => {
        const { access_token } = this.props.authUser
        const { empresa } = this.state
        waitAlert()
        await axios.put(`${URL_DEV}mercadotecnia/material-clientes/empresas/${empresa.id}/caso-exito/${element.id}`, { tipo: name },
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresa, carpeta } = response.data
                const { form } = this.state
                form.carpeta = ''
                this.setState({ ...this.state, empresa: empresa, levelItem: carpeta, newFolder: false, form })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
            return true
        })
    }

    /* ANCHOR DELETE FOLDER IN RENDERS */
    deleteFolderInRenderAxios = async(id) => {
        const { access_token } = this.props.authUser
        const { empresa } = this.state
        waitAlert()
        await axios.delete(`${URL_DEV}mercadotecnia/material-clientes/empresas/${empresa.id}/renders/carpeta/${id}`, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresa } = response.data
                this.setState({ ...this.state, empresa: empresa })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
            return true
        })
    }

    /* ANCHOR DELETE FOLDER IN FOTOGRAFÍA */
    deleteFolderInFotografiaAxios = async(id) => {
        const { access_token } = this.props.authUser
        const { empresa } = this.state
        waitAlert()
        await axios.delete(`${URL_DEV}v2/mercadotecnia/material-clientes/empresas/${empresa.id}/fotografias/carpeta/${id}`, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresa } = response.data
                this.setState({ ...this.state, empresa: empresa })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
            return true
        })
    }

    /* ANCHOR DELETE FOLDER IN CASO EXITO */
    deleteFolderInCasoExitoAxios = async(id) => {
        const { access_token } = this.props.authUser
        const { empresa } = this.state
        waitAlert()
        await axios.delete(`${URL_DEV}mercadotecnia/material-clientes/empresas/${empresa.id}/caso-exito/${id}`, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresa } = response.data
                this.setState({ ...this.state, empresa: empresa })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
            return true
        })
    }

    getUrl = () => {
        const { url } = this.state
        let aux = ''
        url.map((element, index)=>{
            if(index < url.length - 1 ){aux += element + ' | '}
            return ''
        })
        return aux
    }

    openAccordion = (key) => {
        const { opciones_adjuntos } = this.state
        let { url } = this.state
        url = []
        if(opciones_adjuntos.length >= key+1){
            opciones_adjuntos.map((adjunto)=>{
                adjunto.isActive = false
                return ''
            })
            opciones_adjuntos[key].isActive = true
        }
        this.setState({...this.state, opciones_adjuntos, submenuactive: '', level: 0, url, menuactive: key})
    }

    openSubmenu = (tipo) => {
        let { url } = this.state
        url = []
        url.push(tipo.tipo)
        this.setState({...this.state, submenuactive: tipo.id, level: 0, url})
    }

    onClickFolder = element => {
        const { level, url } = this.state
        let { levelName } = this.state
        if(element.nombre){
            levelName = element.nombre
            url.push(element.nombre)
        }else{
            if(element.tipo){
                levelName = element.tipo
                url.push(element.tipo)
            }else{
                levelName = element
                url.push(element)
            }
        }
        this.setState({...this.state, levelName, level: level+1, url, levelItem: element})
    }

    goBackFolderSubmenu = () => {
        const { url, level } = this.state
        url.pop()
        this.setState({...this.state, levelName: url[url.length - 1], level: level-1, url})
    }

    addCarpeta = () => { this.setState({...this.state, newFolder: true}) }
    
    newFolder = () => {
        const { form, newFolder } = this.state
        form.carpeta = ''
        this.setState({
            ...this.state,
            newFolder: !newFolder,
            form
        })
    }

    onChange = e => {
        const { value, name } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({...this.state,form})
    }

    handleChange = (files, item) => {
        const { menuactive, level, url} = this.state
        let tipoSubCarpeta = url[url.length - 3];
        this.onChangeAdjuntos({ target: { name: item, value: files, files: files } })
        switch(menuactive){
            case 3:
                if(level === 1){
                    questionAlert('ENVIAR ARCHIVO', '¿ESTÁS SEGURO QUE DESEAS ENVIARLO?', () => { waitAlert(); this.addAdjunto() })
                }else{
                    if(tipoSubCarpeta === 'renders'){
                        questionAlert('ENVIAR ARCHIVO', '¿ESTÁS SEGURO QUE DESEAS ENVIARLO?', () => { waitAlert(); this.addAdjuntoInRender() })
                    }else{
                        questionAlert('ENVIAR ARCHIVO', '¿ESTÁS SEGURO QUE DESEAS ENVIARLO?', () => { waitAlert(); this.addAdjuntoInFotografias() })
                    }
                    break;
                }
                break
            case 6:
                questionAlert('ENVIAR ARCHIVO', '¿ESTÁS SEGURO QUE DESEAS ENVIARLO?', () => { waitAlert(); this.addAdjuntoInCasoExito() })
                break;
            default:
                questionAlert('ENVIAR ARCHIVO', '¿ESTÁS SEGURO QUE DESEAS ENVIARLO?', () => { waitAlert(); this.addAdjunto() })
                break
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
            return ''
        })
        form.adjuntos[name].value = value
        form.adjuntos[name].files = aux
        this.setState({ ...this.state, form })
    }

    printCarpetasLevel2 = () => {
        const { submenuactive, url, empresa } = this.state
        let tipoSubCarpeta = url[url.length - 2];
        let carpetas = []
        empresa.tipos.map((tipo) => {
            if(tipo.id === submenuactive){
                tipo[`${tipoSubCarpeta}`].map((tipo)=>{
                    if(tipo.nombre === url[url.length - 1]){
                        tipo.carpetas.map((carpeta)=>{
                            carpetas.push(carpeta)
                            return ''
                        })
                    }
                    return ''
                })
            }
            return ''
        })
        return carpetas
    }

    openModalAddFiles = type => {
        const { form, opciones_adjuntos, levelName, level, url } = this.state
        switch(type){
            case 3:
                if(level === 1)
                    form.adjuntos.adjuntos.placeholder = levelName
                else
                    form.adjuntos.adjuntos.placeholder = url[url.length - 1]
                break;
            case 6:
                form.adjuntos.adjuntos.placeholder = levelName
                break;
            default:
                if(opciones_adjuntos.length >= type + 1)
                    form.adjuntos.adjuntos.placeholder = opciones_adjuntos.nombre
                break;
        }
        form.adjuntos.adjuntos.value = ''
        form.adjuntos.adjuntos.files = []
        this.setState({...this.state,modal:true, form})
    }

    handleCloseModal = () => {
        const { form } = this.state
        form.adjuntos.adjuntos.value = ''
        form.adjuntos.adjuntos.files = []
        this.setState({...this.state,modal:false, form})
    }

    onClickDelete = (element) => {
        const { menuactive, level, url} = this.state
        let tipoSubCarpeta = url[url.length - 3];
        switch(menuactive){
            case 3:
                if(level === 1){
                    deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', element.name, () => this.deleteAdjunto(element.id, element.pivot.tipo))
                }else{
                    if(tipoSubCarpeta === 'renders'){
                        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', element.name, () => this.deleteAdjuntoInRender(element))
                    }else{
                        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', element.name, () => this.deleteAdjuntoInFotografias(element))
                    }
                }
                break;
            case 6:
                deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', element.name, () => this.deleteAdjuntoInCasoExito(element))
                break;
            default:
                deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', element.name, () => this.deleteAdjunto(element.id, element.pivot.tipo))
                break;
        }
    }

    onClickDeleteFolder = async (element) => {
        const { menuactive, url } = this.state
        let tipoSubCarpeta = url[url.length - 2];
        switch(menuactive){
            case 3:
                if(tipoSubCarpeta === 'renders'){
                    deleteAlert('¿DESEAS ELIMINAR LA CARPETA?', element.nombre, () => this.deleteFolderInRenderAxios(element.id))
                }else{
                    deleteAlert('¿DESEAS ELIMINAR LA CARPETA?', element.nombre, () => this.deleteFolderInFotografiaAxios(element.id))
                }
                break;
            case 6:
                deleteAlert('¿DESEAS ELIMINAR LA CARPETA?', element.tipo, () => this.deleteFolderInCasoExitoAxios(element.id))
                break;
            default:
                break;
        }
    }

    printFiles = () => {
        const { opciones_adjuntos, empresa, level, submenuactive, levelName, url, newFolder, form, levelItem } = this.state
        let active = ''
        let index = 0
        let adjuntos = []
        opciones_adjuntos.map((adjunto, key)=>{
            if(adjunto.isActive){
                active = adjunto
                index = key
            }
            return ''
        })
        switch(index){
            case 3:
                if(submenuactive === ''){
                    return(
                        <div className='col-md-12'>
                            <div className='row mx-0 my-3'>
                                <div className='col-md-12'>
                                    <div> <Files /> </div>
                                    <div className='text-center font-weight-bolder font-size-h3 text-primary'>
                                        Da click a un submenú de <br />servicios por categoría
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                switch(level){
                    case 0:
                        return(
                            <div className="col-md-12">
                                <div className="form-group row form-group-marginless">
                                    <div className='col-md-3'>
                                        <FolderStatic text = "SUBPORTAFOLIO" onClick = { this.onClickFolder} element = 'subportafolio' />
                                    </div>
                                    <div className='col-md-3'>
                                        <FolderStatic text = "INSERTOS" onClick = { this.onClickFolder } element = 'inserto' />
                                    </div>
                                    <div className='col-md-3'>
                                        <FolderStatic text = "EJEMPLO" onClick = { this.onClickFolder } element = 'ejemplo' />
                                    </div>
                                    {/* <div className='col-md-3'>
                                        <FolderStatic text = "PORTADA" onClick = { this.onClickFolder } element = 'portada' />
                                    </div> */}
                                    <div className='col-md-3'>
                                        <FolderStatic text = "RENDERS" onClick = { this.onClickFolder } element = 'renders' />
                                    </div>
                                </div>
                                <div className="form-group row form-group-marginless">
                                    <div className='col-md-3'>
                                        <FolderStatic text = "FOTOGRAFÍAS" onClick = { this.onClickFolder } element = 'fotografias' />
                                    </div>
                                </div>
                            </div>
                        )
                    case 1:
                        if(levelName !== 'renders' && levelName !== 'fotografias' ){
                            empresa.tipos.map((tipo)=>{
                                if(tipo.id === submenuactive){
                                    tipo.adjuntos.map((adjunto)=>{
                                        if(adjunto.pivot.tipo === levelName)
                                            adjuntos.push(adjunto)
                                        return ''
                                    })
                                }
                                return ''
                            })
                            return(
                                <div>
                                    <div className='d-flex justify-content-between'>
                                        <div className=''>
                                            <BtnBackUrl id_boton = "regresar" icon = "" classname_boton = "btn btn-outline-secondary btn-icon btn-sm"
                                                onclick_boton={(e) => { e.preventDefault(); this.goBackFolderSubmenu() }}
                                                only_icon="fas fa-angle-left icon-md text-primary" tooltip={{ text: 'REGRESAR' }}
                                                url_1 = { this.getUrl() } url_2 = { url[url.length - 1] } />
                                        </div>
                                        <div>
                                            <Button id="subir_archivos" icon='' className="btn btn-outline-secondary btn-icon btn-sm "
                                                onClick={(e) => { e.preventDefault(); this.openModalAddFiles(index) }} only_icon="fas fa-upload icon-15px text-primary"
                                                tooltip={{ text: 'SUBIR ARCHIVOS' }} />
                                        </div>
                                    </div>
                                    <div className='row mx-0 my-3'>
                                    {
                                        adjuntos.length === 0 ?
                                            this.renderCarpetaVacia()     
                                        : 
                                            <TablePagination adjuntos = { adjuntos } delete_onclick = { this.onClickDelete } />
                                    }
                                    </div>
                                </div>
                            )
                        }else if(levelName === 'renders'){
                            return(
                                <div>
                                    <div className='d-flex justify-content-between'>
                                        <div className=''>
                                            <BtnBackUrl id_boton = "regresar" icon = "" classname_boton = "btn btn-outline-secondary btn-icon btn-sm"
                                                onclick_boton={(e) => { e.preventDefault(); this.goBackFolderSubmenu() }}
                                                only_icon="fas fa-angle-left icon-md text-primary" tooltip={{ text: 'REGRESAR' }}
                                                url_1 = { this.getUrl() } url_2 = { url[url.length - 1] } />
                                        </div>
                                        <div></div>
                                    </div>
                                    <div className='row mx-0 my-3 justify-content-center'>
                                        <div className='col-md-3'>
                                            <FolderStatic text = 'reales' onClick = { this.onClickFolder } element = 'reales' />
                                        </div>
                                        <div className='col-md-3'>
                                            <FolderStatic text = 'inventados' onClick = { this.onClickFolder } element = 'inventados' />
                                        </div>
                                    </div>
                                </div>
                            )
                        }else if(levelName === 'fotografias'){
                            return(
                                <div>
                                    <div className='d-flex justify-content-between'>
                                        <div className=''>
                                            <BtnBackUrl id_boton = "regresar" icon = "" classname_boton = "btn btn-outline-secondary btn-icon btn-sm"
                                                onclick_boton={(e) => { e.preventDefault(); this.goBackFolderSubmenu() }}
                                                only_icon="fas fa-angle-left icon-md text-primary" tooltip={{ text: 'REGRESAR' }}
                                                url_1 = { this.getUrl() } url_2 = { url[url.length - 1] } />
                                        </div>
                                        <div></div>
                                    </div>
                                    <div className='row mx-0 my-3 justify-content-center'>
                                        <div className='col-md-3'>
                                            <FolderStatic text = 'proceso' onClick = { this.onClickFolder } element = 'proceso' />
                                        </div>
                                        <div className='col-md-3'>
                                            <FolderStatic text = 'terminado' onClick = { this.onClickFolder } element = 'terminado' />
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        break
                    case 2:
                        return(
                            <div>
                                <div className='d-flex justify-content-between'>
                                    <div className=''>
                                        <BtnBackUrl id_boton = "regresar" icon = "" classname_boton = "btn btn-outline-secondary btn-icon btn-sm"
                                            onclick_boton={(e) => { e.preventDefault(); this.goBackFolderSubmenu() }}
                                            only_icon="fas fa-angle-left icon-md text-primary" tooltip={{ text: 'REGRESAR' }}
                                            url_1 = { this.getUrl() } url_2 = { url[url.length - 1] } />
                                    </div>
                                    <div>
                                        <Button id = "nueva_carpeta" icon='' className="btn btn-outline-secondary btn-icon btn-sm "
                                            onClick={(e) => { e.preventDefault(); this.addCarpeta() }} only_icon="fas fa-folder-plus icon-15px text-primary"
                                            tooltip={{ text: 'NUEVA CARPETA' }} />
                                    </div>
                                </div>
                                <div className='row mx-0 my-3 justify-content-center'>
                                    {
                                        newFolder &&
                                        <div className='col-md-3 col-lg-2'>
                                            <NewFolderInput
                                                newFolder = { this.newFolder } 
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    if(levelName === 'proceso' || levelName === 'terminado'){
                                                        this.onSubmitNewDirectoryFotografías()
                                                    }else{
                                                        this.onSubmitNewDirectoryRender()
                                                    }
                                                }}
                                                customclass = "input-folder" name = 'carpeta' value = { form.carpeta } onChange = { this.onChange } />
                                        </div>
                                    }
                                    { 
                                        this.printCarpetasLevel2().map((carpeta, index) =>{
                                            return(
                                                <div className='col-md-3 col-lg-2' key = { index } >
                                                    <Folder text = { carpeta.nombre } onClick = { this.onClickFolder }
                                                        onClickDelete = { this.onClickDeleteFolder } element = { carpeta }
                                                        updateDirectory = { this.updateDirectoryInRender } />
                                                </div>
                                            )
                                        }) 
                                    }
                                </div>
                            </div>
                        )
                    case 3:
                        return(
                            <div>
                                <div className='d-flex justify-content-between'>
                                    <div className=''>
                                        <BtnBackUrl id_boton = "regresar" icon = "" classname_boton = "btn btn-outline-secondary btn-icon btn-sm"
                                            onclick_boton={(e) => { e.preventDefault(); this.goBackFolderSubmenu() }}
                                            only_icon="fas fa-angle-left icon-md text-primary" tooltip={{ text: 'REGRESAR' }}
                                            url_1 = { this.getUrl() } url_2 = { url[url.length - 1] } />
                                    </div>
                                    <div>
                                        <Button id="subir_archivos" icon='' className="btn btn-outline-secondary btn-icon btn-sm "
                                            onClick={(e) => { e.preventDefault(); this.openModalAddFiles(index) }} only_icon="fas fa-upload icon-15px text-primary"
                                            tooltip={{ text: 'SUBIR ARCHIVOS' }} />
                                    </div>
                                </div>
                                <div className='row mx-0 my-3 justify-content-center'>
                                    {
                                        levelItem.adjuntos.length === 0 ?
                                            this.renderCarpetaVacia()     
                                        : 
                                            <TablePagination adjuntos = { levelItem.adjuntos } delete_onclick = { this.onClickDelete } />
                                    }
                                </div>
                            </div>
                        )
                    default: break;
                }
                break
            case 6:
                switch(level){
                    case 0:
                        return(
                            <div>
                                <div className='d-flex justify-content-between'>
                                    <div className=''></div>
                                    <div>
                                        <Button id = "nueva_carpeta" icon='' className="btn btn-outline-secondary btn-icon btn-sm "
                                            onClick={(e) => { e.preventDefault(); this.addCarpeta() }} only_icon="fas fa-folder-plus icon-15px text-primary"
                                            tooltip={{ text: 'NUEVA CARPETA' }} />
                                    </div>
                                </div>
                                <div className='row mx-0 my-3 justify-content-center'>
                                    {
                                        newFolder &&
                                        <div className='col-md-3 col-lg-2'>
                                            <NewFolderInput
                                                newFolder = { this.newFolder } onSubmit={(e) => { e.preventDefault(); this.onSubmitNewDirectoryCasosExito() }}
                                                customclass = "input-folder" name = 'carpeta' value = { form.carpeta } onChange = { this.onChange } />
                                        </div>
                                    }
                                    {
                                        empresa.casos_exito.map((caso, index) =>{
                                            return(
                                                <div className='col-md-3 col-lg-2' key = { index } >
                                                    <Folder text = { caso.tipo } onClick = { this.onClickFolder }
                                                        onClickDelete = { this.onClickDeleteFolder } element = { caso }
                                                        updateDirectory={this.updateDirectoryInCasoExito} />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    case 1:
                        return(
                            <div>
                                <div className='d-flex justify-content-between'>
                                    <div className=''>
                                        <BtnBackUrl id_boton = "regresar" icon = "" classname_boton = "btn btn-outline-secondary btn-icon btn-sm"
                                            onclick_boton={(e) => { e.preventDefault(); this.goBackFolderSubmenu() }}
                                            only_icon="fas fa-angle-left icon-md text-primary" tooltip={{ text: 'REGRESAR' }}
                                            url_1 = { this.getUrl() } url_2 = { url[url.length - 1] } />
                                    </div>
                                    <div>
                                        <Button id="subir_archivos" icon='' className="btn btn-outline-secondary btn-icon btn-sm "
                                            onClick={(e) => { e.preventDefault(); this.openModalAddFiles(index) }} only_icon="fas fa-upload icon-15px text-primary"
                                            tooltip={{ text: 'SUBIR ARCHIVOS' }} />
                                    </div>
                                </div>
                                <div className='row mx-0 my-3 justify-content-center'>
                                    {
                                        levelItem.adjuntos.length === 0 ?
                                            this.renderCarpetaVacia()     
                                        : 
                                            <TablePagination adjuntos = { levelItem.adjuntos } delete_onclick = { this.onClickDelete } />
                                    }
                                </div>
                            </div>
                        )
                    default: break;
                }
                break;
            default:
                empresa.adjuntos.map((adjunto)=>{
                    if(adjunto.pivot.tipo === active.slug)
                        adjuntos.push(adjunto)
                    return ''
                })
                return(
                    <div>
                        <div className='d-flex justify-content-between'>
                            <div className=''></div>
                            <div>
                                <Button id="subir_archivos" icon='' className="btn btn-outline-secondary btn-icon btn-sm "
                                    onClick={(e) => { e.preventDefault(); this.openModalAddFiles(index) }} only_icon="fas fa-upload icon-15px text-primary"
                                    tooltip={{ text: 'SUBIR ARCHIVOS' }} />
                            </div>
                        </div>
                        <div className='row mx-0 my-3'>
                            {
                                adjuntos.length === 0 ?
                                    this.renderCarpetaVacia()     
                                : 
                                    <TablePagination adjuntos = { adjuntos } delete_onclick = { this.onClickDelete } />
                            }
                        </div>
                    </div>
                )
        }
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
    
    render() {
        const { data, opciones_adjuntos, empresa, submenuactive, modal, form, menuactive, level} = this.state
        return (
            <Layout active = 'mercadotecnia' {...this.props}>
                <Tab.Container className = "p-5" >
                    <Row>
                        <Col sm = { 3 } >
                            <Card className = "card-custom card-stretch gutter-b">
                                <div className = "card-header">
                                    <div className = "card-title">
                                        <h3 className = "card-label">Adjuntos</h3>
                                    </div>
                                </div>
                                <div className="card-body px-3">
                                    <Accordion id = "accordion-material" className = "accordion-light accordion-svg-toggle">
                                        {
                                            opciones_adjuntos.map((element, key) => {
                                                return (
                                                    <Card className="w-auto border-0 mb-2" key={key}>
                                                        <Card.Header>
                                                            <div className = { (element.isActive) ? 'card-title text-primary collapsed rounded-0 ' : 'card-title text-dark-50 rounded-0' } 
                                                                onClick = { () => { this.openAccordion(key) } } >
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
                                                        {
                                                            element.subMenu ?
                                                                <div className = { element.isActive  ? 'collapse-now' : 'collapse' }>
                                                                    <Card.Body>
                                                                        <Nav className="navi">
                                                                            {
                                                                                empresa ?
                                                                                    empresa.tipos.map( (tipo, key) => {
                                                                                        return (
                                                                                            <Nav.Item className='navi-item' key = { key } 
                                                                                                onClick = { (e) => { e.preventDefault(); this.openSubmenu(tipo) }}>
                                                                                                <Nav.Link className = "navi-link p-2" eventKey = { tipo.id }>
                                                                                                    <span className = 
                                                                                                        { submenuactive === tipo.id ? "navi-icon text-primary" : "navi-icon"}>
                                                                                                        <span className="navi-bullet">
                                                                                                            <i className="bullet bullet-dot"></i>
                                                                                                        </span>
                                                                                                    </span>
                                                                                                    <div className = 
                                                                                                        { submenuactive === tipo.id ? "navi-text text-primary" : "navi-text"}>
                                                                                                        <span className="d-block font-weight-bolder" >{tipo.tipo}</span>
                                                                                                    </div>
                                                                                                </Nav.Link>
                                                                                            </Nav.Item>
                                                                                        )
                                                                                    })
                                                                                : ''
                                                                            }
                                                                        </Nav>
                                                                    </Card.Body>
                                                                </div>
                                                            : ''
                                                        }
                                                    </Card>
                                                )
                                            })
                                        }
                                    </Accordion>
                                </div>
                            </Card>
                        </Col>
                        <Col sm = { 9 } >
                            <Card className="card-custom card-stretch gutter-b" >
                                <Card.Header className = "">
                                    <div className = "card-toolbar">
                                        <Nav className = "nav nav-pills nav-pills-sm nav-light-primary font-weight-bolder">
                                            {
                                                data.empresas.map((empresa, index) => {
                                                    return (
                                                        <Nav.Item key = { index } >
                                                            <Nav.Link eventKey = { empresa.id } className = "py-2 px-4" 
                                                                onClick = { (e) => { e.preventDefault(); this.getAdjuntoEmpresaAxios(empresa.id) }} >
                                                                { empresa.name }
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    )
                                                })
                                            }
                                        </Nav>
                                    </div>
                                </Card.Header>
                                <Card.Body className={menuactive === 3 && level===0 ? 'd-flex align-items-center': ''}>
                                    {
                                        empresa !== '' ?
                                            this.printFiles()
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
                <Modal show = { modal } title = 'Agregar adjuntos' handleClose = { this.handleCloseModal } size = 'lg' >
                    <div className = ''>
                        <div className="text-center font-weight-bolder my-2 pt-3">
                            {form.adjuntos.adjuntos.placeholder}
                        </div>
                        <ItemSlider item = 'adjuntos' items = { form.adjuntos.adjuntos.files } handleChange = { this.handleChange } multiple={true} />
                    </div>
                </Modal>
            </Layout >
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(MaterialCliente);