import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import { connect } from 'react-redux';
import Layout from '../../../components/layout/layout';
import { ModalDelete, Modal, ItemSlider } from '../../../components/singles';
import NewTableServerRender from '../../../components/tables/NewTableServerRender';
import { URL_DEV, HERRAMIENTAS_COLUMNS } from '../../../constants';
import { deleteAlert, doneAlert, errorAlert, forbiddenAccessAlert, waitAlert } from '../../../functions/alert';
import { setDateTable, setTextTable } from '../../../functions/setters';
import axios from 'axios'
import { Button } from '../../../components/form-components'

const $ = require('jquery');

class Herramienta extends Component {

    state = {
        modalDelete:false,
        modalAdjuntos: false,
        herramienta: '',
        form:{
            adjuntos:{
                adjuntos:{
                    value: '',
                    placeholder: 'Adjuntos',
                    files: []
                }
            }
        }
    }

    setHerramientas = herramientas => {
        let aux = []
        herramientas.map((herramienta)=>{
            aux.push({
                actions: this.setActions(herramienta),
                empresa: renderToString(setTextTable(herramienta.empresa ? herramienta.empresa.name : 'Sin definir')),
                proyecto: renderToString(setTextTable(herramienta.proyecto ? herramienta.proyecto.nombre : 'Sin definir')),
                nombre: renderToString(setTextTable(herramienta.nombre)),
                modelo: renderToString(setTextTable(herramienta.modelo)),
                serie: renderToString(setTextTable(herramienta.serie)),
                descripcion: renderToString(setTextTable(herramienta.descripcion)),
                fecha: renderToString(setDateTable(herramienta.created_at)),
                id: herramienta.id
            })
        })
        return aux
    }

    setActions = herramienta => {
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
        )
        return aux
    }

    changePageEdit = (herramienta) => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/herramientas/edit',
            state: { herramienta: herramienta}
        });
    }

    openModalDelete = herramienta => {
        this.setState({
            ... this.state,
            herramienta: herramienta,
            modalDelete: true
        })
    }

    openModalAdjuntos = herramienta => {
        const { form } = this.state
        let aux = []
        herramienta.adjuntos.map((adjunto)=>{
            aux.push({
                name: adjunto.name,
                url: adjunto.url,
                id: adjunto.id
            })
        })
        form.adjuntos.adjuntos.files = aux
        this.setState({
            ... this.state,
            herramienta: herramienta,
            modalAdjuntos: true,
            form
        })
    }

    handleCloseDelete = () => {
        this.setState({
            ... this.state,
            modalDelete: false,
            herramienta: ''
        })
    }

    handleCloseAdjuntos = () => {
        const { form } = this.state
        form.adjuntos.adjuntos.files = []
        this.setState({
            ... this.state,
            modalAdjuntos: false,
            herramienta: '',
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

    deleteFile = element => {
        deleteAlert('¿Deseas eliminar el archivo?', () => this.deleteAdjuntoAxios(element.id))
    }

    async getHerramientasAxios(){
        $('#kt_datatable_herramientas').DataTable().ajax.reload();
    }

    async deleteHerramientaAxios(){
        const { access_token } = this.props.authUser
        const { herramienta } = this.state
        await axios.delete(URL_DEV + 'herramientas/' + herramienta.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getHerramientasAxios()
                doneAlert('Herramienta eliminada con éxito')
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

    async deleteAdjuntoAxios(id){
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, herramienta } = this.state
        await axios.delete(URL_DEV + 'herramientas/' + herramienta.id + '/adjuntos/' +id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                
                const { herramienta } = response.data
                const { form } = this.state
                let aux = []
                herramienta.adjuntos.map((adj)=>{
                    aux.push({
                        name: adj.name,
                        url: adj.url,
                        id: adj.id
                    })
                })
                form.adjuntos.adjuntos.files = aux
                this.setState({
                    ... this.state,
                    modalDelete: false,
                    herramienta: '',
                    form
                })
                doneAlert('Adjunto eliminado con éxito')
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

    async sendAdjuntoAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, herramienta } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fecha':
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
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
        })
        
        await axios.post(URL_DEV + 'herramientas/' + herramienta.id + '/adjuntos', data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                
                const { herramienta } = response.data
                const { form } = this.state
                let aux = []
                herramienta.adjuntos.map((adj)=>{
                    aux.push({
                        name: adj.name,
                        url: adj.url,
                        id: adj.id
                    })
                })
                form.adjuntos.adjuntos.files = aux
                this.setState({
                    ... this.state,
                    modalDelete: false,
                    herramienta: '',
                    form
                })
                doneAlert('Adjunto creado con éxito')
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
        const { modalDelete, modalAdjuntos, form } = this.state
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <NewTableServerRender 
                    columns = { HERRAMIENTAS_COLUMNS }
                    title = 'Herramientas'
                    subtitle = 'Listado de herramientas'
                    mostrar_boton = { true }
                    abrir_modal = { false }
                    url = '/proyectos/herramientas/add'
                    mostrar_acciones = { true }
                    actions = {
                        {
                            'edit': { function: this.changePageEdit },
                            'delete': { function: this.openModalDelete },
                            'adjuntos': { function: this.openModalAdjuntos },
                        }
                    }
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setHerramientas }
                    urlRender = { URL_DEV + 'herramientas' }
                    idTable = 'kt_datatable_herramientas'
                    cardTable = 'cardTable'
                    cardTableHeader = 'cardTableHeader'
                    cardBody = 'cardBody'
                    />
                <ModalDelete title = '¿Estás seguro que deseas eliminar la herramienta?' show = { modalDelete }
                    handleClose = { this.handleCloseDelete } 
                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.deleteHerramientaAxios() } }  />

                <Modal size="lg" title = "Adjuntos" show = { modalAdjuntos } handleClose = { this.handleCloseAdjuntos } >
                    <ItemSlider items = { form.adjuntos.adjuntos.files } item = 'adjuntos' handleChange = { this.handleChange } 
                        deleteFile = { this.deleteFile }/>
                    {
                        form.adjuntos.adjuntos.value ?
                            <div className="d-flex justify-content-center mt-2 mb-4">
                                <Button icon='' text='ENVIAR'
                                    onClick = { (e) => { e.preventDefault(); this.sendAdjuntoAxios()}  } />
                            </div>
                        : ''
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(Herramienta);