import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV, PARTIDAS_COLUMNS} from '../../constants'
import { setTagLabelReactDom, setTextTableCenter, setTextTableReactDom } from '../../functions/setters'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert, customInputAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Modal, ModalDelete } from '../../components/singles'
import { PartidaForm } from '../../components/forms'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { PartidaCard } from '../../components/cards'
import { Update } from '../../components/Lottie'
import { InputGray } from '../../components/form-components'
import { printSwalHeader } from '../../functions/printers'
import $ from "jquery";
class Partidas extends Component {

    state = {
        form: {
            partida: '',
            subpartida: '',
            subpartidas: [],
            subpartidasEditable: []
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
            form.subpartidas.find(function (element, index) {
                if (element === form.subpartida)
                    aux = true
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
        if(value.id){
            this.deleteSubpartidaAxios(value.id)
        }else{
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

    editSubpartida = (value, subpartida) => {
        const { form } = this.state
        let bandera = true
        form.subpartidasEditable.forEach((element) => {
            if(element.id === subpartida.id){
                bandera = false
                element.nombre = value
            }
        });
        if(bandera)
            form.subpartidasEditable.push({
                id: subpartida.id,
                nombre: value
            })
        this.setState({...this.state,form})
    }

    setPartidas = partidas => {
        let aux = []
        partidas.map((partida) => {
            aux.push({
                actions: this.setActions(partida),
                clave: renderToString(setTextTableCenter(partida.id)),
                partida: setTextTableReactDom(partida.nombre, this.doubleClick, partida, 'partida', 'text-center'),
                subpartidas: setTagLabelReactDom(partida, partida.subpartidas, 'subpartidas', this.deleteElementAxios),
                id: partida.id
            })
            return false
        })
        return aux
    }
    deleteElementAxios = async(data, element, tipo) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.delete(`${URL_DEV}v2/catalogos/partidas/${data.id}/${tipo}/${element.id}`, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
            case 'partida':
                form.partida = data.nombre
                break
            default:
                form[tipo] = data[tipo]
                break
        }
        this.setState({form})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) } </h2>
                {
                    tipo === 'partida' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form.partida } name = { 'partida' }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, 'nombre')} } swal = { true }
                        />
                }
            </div>,
            <Update />,
            () => { this.patchPartida(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    patchPartida = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/catalogos/partidas/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getPartidaAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
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
                case 'subpartidasEditable':
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
        form.subpartidas = []
        form.subpartidasEditable = []
        this.setState({
            ...this.state,
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

    deleteSubpartidaAxios = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { partida } = this.state
        await axios.delete(`${URL_DEV}v2/catalogos/partidas/${partida.id}/subpartida/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { partida } = response.data
                this.getPartidaAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Subpartida eliminado con éxito.')
                this.setState({ ...this.state,  partida: partida })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getPartidaAxios() {
        $('#kt_datatable_partidas').DataTable().ajax.reload();
    }

    async addPartidaAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.put(URL_DEV + 'partidas', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
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
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async updatePartidaAxios() {
        const { access_token } = this.props.authUser
        const { form, partida } = this.state
        await axios.put(`${URL_DEV}v2/catalogos/partidas/${partida.id}`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
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
                printResponseErrorAlert(error)
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
                printResponseErrorAlert(error)
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
                    <PartidaForm partida={partida} form = { form } onChange = { this.onChange }
                        addSubpartida = { this.addSubpartida } editSubpartida = { this.editSubpartida }  deleteSubpartida = { this.deleteSubpartida }
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