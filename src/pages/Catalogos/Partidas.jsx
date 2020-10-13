import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, PARTIDAS_COLUMNS} from '../../constants'
import { setTextTable, setArrayTable } from '../../functions/setters'
import { waitAlert, errorAlert, forbiddenAccessAlert, doneAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Modal, ModalDelete } from '../../components/singles'
import { PartidaForm } from '../../components/forms'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { PartidaCard } from '../../components/cards'

const $ = require('jquery');
class Partidas extends Component {

    state = {
        form: {
            partida: '',
            subpartida: '',
            subpartidas: []
        },
        formeditado:0,
        modal:{
            form: false,
            delete: false,
            see: false,
        },
        title: 'Nueva partida',
        partida: ''
    }

    componentDidMount() {   
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const areas = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!areas)
            history.push('/')
    }

    addSubpartida = () => {
        const { form } = this.state
        if (form['subpartida'] !== '') {
            let aux = false;
            aux = form.subpartidas.find(function (element, index) {
                if (element === form.subpartida)
                    return true
                return false
            });
            if (aux !== true) {
                form.subpartidas.push(form.subpartida)
                form.subpartida = ''
                this.setState({
                    ...this.state,
                    form,
                    formeditado:0,
                })
            }
        }
    }

    deleteSubpartida = value => {
        const { form } = this.state
        let aux = []
        form.subpartidas.find(function (element, index) {
            if (element.toString() !== value.toString())
                aux.push(element)
            return false
        });
        form.subpartidas = aux
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

    setPartidas = partidas => {
        let aux = []
        partidas.map((partida) => {
            aux.push({
                actions: this.setActions(partida),
                clave: renderToString(setTextTable(partida.id)),
                partida: renderToString(setTextTable(partida.nombre)),
                subpartidas: renderToString(setArrayTable(this.setArrayTable(partida.subpartidas))),
                id: partida.id
            })
            return false
        })
        return aux
    }

    setArrayTable = subpartidas => {
        let aux = []
        subpartidas.map( (subpartida) => {
            aux.push({
                name: subpartida.clave,
                text: subpartida.nombre,
                lista: true
            })
            return false
        })
        return aux
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
                tooltip: {id:'see', text:'Mostrar', type:'info'},
            }
        )
        return aux
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'subpartidas':
                    form[element] = []
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
    }

    handleClose = () => {
        const { modal } = this.state
        modal.form = false
        this.setState({
            modal,
            title: 'Nueva partida',
            form: this.clearForm(),
            partida: ''
        })
    }

    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            modal,
            partida: ''
        })
    }

    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            modal,
            title: 'Nueva partida',
            form: this.clearForm(),
            formeditado:0
        })
    }

    openModalDelete = partida => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            modal,
            partida: partida
        })
    }

    openModalEdit = partida => {
        const { form, modal } = this.state
        modal.form = true
        form.partida = partida.nombre
        let aux = []
        partida.subpartidas.map((element) => {
            aux.push(element.nombre)
            return false
        })
        form.subpartidas = aux
        this.setState({
            modal,
            title: 'Editar partida',
            partida: partida,
            form,
            formeditado:1
        })
    }

    openModalSee = partida => {
        const { modal} = this.state
        modal.see =true
        this.setState({
            ...this.state,
            modal,
            partida: partida
        })
    }

    handleCloseSee = () => {
        const { modal} = this.state
        modal.see =false
        this.setState({
            ...this.state,
            modal,
            partida: ''
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Nueva partida')
            this.addPartidaAxios()
        if (title === 'Editar partida')
            this.updatePartidaAxios()
    }

    safeDelete = e => () => {
        this.deletePartidaAxios()
    }

    async getPartidaAxios() {
        $('#kt_datatable_partidas').DataTable().ajax.reload();
    }

    async addPartidaAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'partidas', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                
                const { modal } = this.state
                modal.form = false

                this.getPartidaAxios()

                doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito una nueva área.')

                this.setState({
                    ...this.state,
                    modal,
                    form: this.clearForm(),
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

    async updatePartidaAxios() {
        const { access_token } = this.props.authUser
        const { form, partida } = this.state
        await axios.put(URL_DEV + 'partidas/' + partida.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                modal.form = false

                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el área.')

                this.getPartidaAxios()

                this.setState({
                    ...this.state,
                    modal,
                    form: this.clearForm(),
                    partida: ''
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

    async deletePartidaAxios() {
        const { access_token } = this.props.authUser
        const { partida } = this.state
        await axios.delete(URL_DEV + 'partidas/' + partida.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                modal.delete = false
                
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito el área.')
                
                this.getPartidaAxios()

                this.setState({
                    ...this.state,
                    modal,
                    form: this.clearForm(),
                    partida: '',
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

    render() {
        const { form, modal, title, formeditado, partida} = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <NewTableServerRender 
                    columns = { PARTIDAS_COLUMNS } 
                    title = 'Partidas' 
                    subtitle ='Listado de partidas'
                    mostrar_boton = { true }
                    abrir_modal = { true }
                    mostrar_acciones = { true }
                    onClick = { this.openModal }
                    actions = {
                        {
                            'edit': { function: this.openModalEdit },
                            'delete': { function: this.openModalDelete },
                            'see': { function: this.openModalSee },
                        }
                    }
                    idTable = 'kt_datatable_partidas'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    accessToken = { this.props.authUser.access_token }
                    setter =  {this.setPartidas }
                    urlRender = { URL_DEV + 'partidas'}
                />

                <Modal size="xl" show={modal.form} title = {title} handleClose={this.handleClose}>
                    <PartidaForm form = { form } onChange = { this.onChange }
                        addSubpartida = { this.addSubpartida } deleteSubpartida = { this.deleteSubpartida }
                        title = { title } onSubmit = { this.onSubmit } formeditado={formeditado}/>
                </Modal>
                <ModalDelete title={"¿Estás seguro que deseas eliminar la partida?"} show = { modal.delete } handleClose = { this.handleCloseDelete } onClick={(e) => { e.preventDefault(); waitAlert(); this.deletePartidaAxios() }}>
                </ModalDelete>
                <Modal title="Partida" show = { modal.see } handleClose = { this.handleCloseSee } >
                    <PartidaCard partida={partida}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Partidas);