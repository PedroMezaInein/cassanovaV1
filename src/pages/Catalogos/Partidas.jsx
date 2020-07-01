import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, PARTIDAS_COLUMNS, GOLD } from '../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setPercentTable, setArrayTable, setFacturaTable, setAdjuntosList, setListTable } from '../../functions/setters'
import { waitAlert, errorAlert, createAlert,forbiddenAccessAlert } from '../../functions/alert'
//
import Layout from '../../components/layout/layout'
import { Button } from '../../components/form-components'
import { Modal, ModalDelete } from '../../components/singles'
import { faPlus, faLink, faEdit, faTrash, faReceipt, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'
import { PartidaForm } from '../../components/forms'
import { Subtitle, Small } from '../../components/texts'
import NewTable from '../../components/tables/NewTable'

class Partidas extends Component {

    state = {
        form: {
            partida: '',
            subpartida: '',
            subpartidas: []
        },
        data: {
            partidas: []
        },
        formeditado:0,
        partidas: [],
        modal:{
            form: false,
            delete: false,
        },
        title: 'Nueva partida',
        partida: ''
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const areas = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!areas)
            history.push('/')
        this.getPartidaAxios()
    }

    addSubpartida = () => {
        const { form } = this.state
        if (form['subpartida'] !== '') {
            let aux = false;
            aux = form.subpartidas.find(function (element, index) {
                if (element === form.subpartida)
                    return true
            });
            if (aux !== true) {
                form.subpartidas.push(form.subpartida)
                form.subpartida = ''
                this.setState({
                    ... this.state,
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
        });
        form.subpartidas = aux
        this.setState({
            ... this.state,
            form
        })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    setPartidas = partidas => {
        let aux = []
        partidas.map((partida) => {
            aux.push({
                actions: this.setActions(partida),
                partida: renderToString(setTextTable(partida.nombre)),
                subpartidas: renderToString(setListTable(partida.subpartidas, 'nombre')),
                id: partida.id
            })
        })
        return aux
    }

    setActions = partida => {
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

    onSubmit = e => {
        e.preventDefault()
        const { form, title } = this.state
        if (title === 'Nueva partida')
            this.addPartidaAxios()
        if (title === 'Editar partida')
            this.updatePartidaAxios()
    }

    safeDelete = e => () => {
        this.deletePartidaAxios()
    }

    async getPartidaAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'partidas', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { partidas } = response.data
                data.partidas = partidas
                this.setState({
                    ... this.state,
                    partidas: this.setPartidas(partidas),
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

    async addPartidaAxios() {
        const { access_token } = this.props.authUser
        const { form, data } = this.state
        await axios.post(URL_DEV + 'partidas', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { partidas } = response.data
                const { data, modal } = this.state
                modal.form = false
                data.partidas = partidas
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Creaste con éxito una nueva área.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                this.setState({
                    ... this.state,
                    modal,
                    form: this.clearForm(),
                    partidas: this.setPartidas(partidas),
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

    async updatePartidaAxios() {
        const { access_token } = this.props.authUser
        const { form, partida, data, modal } = this.state
        await axios.put(URL_DEV + 'partidas/' + partida.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { partidas } = response.data
                data.partidas = partidas
                modal.form = false
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Editaste con éxito el área.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                this.setState({
                    ... this.state,
                    modal,
                    form: this.clearForm(),
                    partidas: this.setPartidas(partidas),
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
        const { partida, modal, data } = this.state
        await axios.delete(URL_DEV + 'partidas/' + partida.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { partidas } = response.data
                data.partidas = partidas
                modal.delete = false
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito el área.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                this.setState({
                    ... this.state,
                    modal,
                    form: this.clearForm(),
                    partidas: this.setPartidas(partidas),
                    partida: '',
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

    render() {
        const { form, partidas, modal, title, data, formeditado } = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <NewTable 
                    columns = { PARTIDAS_COLUMNS } 
                    data = { partidas }
                    title = 'Partidas' 
                    subtitle='Listado de partidas'
                    mostrar_boton={true}
                    abrir_modal={true}
                    mostrar_acciones={true}
                    onClick={this.openModal}
                    actions={{
                        'edit': { function: this.openModalEdit },
                        'delete': { function: this.openModalDelete }
                    }}
                    elements={data.partidas}
                />

                <Modal show={modal.form} title = {title} handleClose={this.handleClose}>
                    <PartidaForm form = { form } onChange = { this.onChange }
                        addSubpartida = { this.addSubpartida } deleteSubpartida = { this.deleteSubpartida }
                        title = { title } onSubmit = { this.onSubmit } formeditado={formeditado}/>
                </Modal>
                <ModalDelete title={"¿Estás seguro que deseas eliminar la partida?"} show = { modal.delete } handleClose = { this.handleCloseDelete } onClick={(e) => { e.preventDefault(); waitAlert(); this.deletePartidaAxios() }}>
                </ModalDelete>
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