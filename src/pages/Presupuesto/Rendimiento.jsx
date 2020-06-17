/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, RENDIMIENTOS_COLUMNS } from '../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../functions/setters'

//
import Layout from '../../components/layout/layout'
import { Button } from '../../components/form-components'
import { Modal, ModalDelete } from '../../components/singles'
import { faPlus, faLink, faEdit, faTrash, faSync } from '@fortawesome/free-solid-svg-icons'
import { DataTable } from '../../components/tables'
import { Subtitle } from '../../components/texts'
import { RendimientoForm } from '../../components/forms'
import NewTable from '../../components/tables/NewTable'

class Rendimientos extends Component {

    state = {
        modal: false,
        modalDelete: false,
        title: 'Nuevo rendimiento',
        options: {
            proveedores: [],
            unidades: []
        },
        data: {
            rendimientos: []
        },
        form: {
            unidad: '',
            proveedor: '',
            descripcion: '',
            materiales: '',
            costo: '',
            rendimiento: '',
            adjunto: {
                value: '',
                files: []
            }
        },
        rendimientos: [],
        rendimiento: ''
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const rendimientos = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!rendimientos)
            history.push('/')
        this.getRendimientosAxios()
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true,
            title: 'Nuevo rendimiento',
            form: this.clearForm()
        })
    }

    openModalEdit = (rendimiento) => {
        const { form } = this.state

        form.manoObra = rendimiento.manoObra
        form.herramienta = rendimiento.herramienta
        form.materiales = rendimiento.materiales

        form.descripcion = rendimiento.descripcion
        form.clave = rendimiento.clave
        form.costo = rendimiento.costo

        form.categoria = rendimiento.categoria.id.toString()
        form.unidad = rendimiento.unidad.id.toString()

        this.setState({
            ... this.state,
            modal: true,
            title: 'Editar rendimiento',
            form,
            rendimiento: rendimiento
        })
    }

    openModalDelete = (rendimiento) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            rendimiento: rendimiento
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            title: 'Nuevo rendimiento',
            rendimiento: '',
            form: this.clearForm()
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            rendimiento: '',
        })
    }

    setRendimientos = rendimientos => {
        let aux = []
        rendimientos.map((rendimiento) => {
            aux.push(
                {
                    actions: this.setActions(rendimiento),
                    materiales: renderToString(setTextTable(rendimiento.materiales)),
                    unidad: renderToString(setTextTable(rendimiento.unidad.nombre)),
                    costo: renderToString(setMoneyTable(rendimiento.costo)),
                    proveedor: renderToString(setTextTable(rendimiento.proveedor.nombre)),
                    rendimiento: renderToString(setTextTable(rendimiento.rendimiento)),
                    descripcion: renderToString(setTextTable(rendimiento.descripcion)),
                    id: rendimiento.id
                }
            )
        })
        return aux
    }

    setActions = rendimiento => {
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

    /*setActions = rendimiento => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.openModalEdit(rendimiento)} } text='' icon={faEdit} color="transparent" 
                        tooltip={{id:'edit', text:'Editar'}} />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.openModalDelete(rendimiento)} } text='' icon={faTrash} color="red" 
                        tooltip={{id:'delete', text:'Eliminar', type:'error'}} />
                </div>
            </>
        )
    }*/

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjunto':
                    form[element]['value'] = ''
                    form[element]['files'] = []
                    break;
                default:
                    form[element] = '';
                    break;
            }
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
        if (title === 'Editar rendimiento')
            this.editRendimientoAxios()
        else
            this.addRendimientoAxios()
    }

    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
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
        form[name].value = value
        form[name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form[name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form[name].files[counter])
            }
        }
        if (aux.length < 1) {
            form[name].value = ''
        }
        form[name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    async getRendimientosAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rendimientos', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { unidades, proveedores, rendimientos } = response.data
                const { options } = this.state
                data.rendimientos = rendimientos
                options['unidades'] = setOptions(unidades, 'nombre', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                this.setState({
                    ... this.state,
                    options,
                    rendimientos: this.setRendimientos(rendimientos),
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                } else {
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    async addRendimientoAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjunto':
                    if (form.adjunto.files.length > 0)
                        //Falta adjuntar fotos
                        break;
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        await axios.post(URL_DEV + 'rendimientos', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { rendimientos } = response.data
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La rendimiento fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
                this.setState({
                    ... this.state,
                    rendimientos: this.setRendimientos(rendimientos),
                    modal: false,
                    title: 'Nuevo rendimiento',
                    form: this.clearForm()
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                } else {
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    async editRendimientoAxios() {
        const { access_token } = this.props.authUser
        const { form, rendimiento } = this.state
        await axios.put(URL_DEV + 'rendimientos/' + rendimiento.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { rendimientos } = response.data
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La rendimiento fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
                this.setState({
                    ... this.state,
                    rendimientos: this.setRendimientos(rendimientos),
                    modal: false,
                    title: 'Nuevo rendimiento',
                    form: this.clearForm()
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                } else {
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    async deleteRendimientoAxios() {
        const { access_token } = this.props.authUser
        const { rendimiento } = this.state
        await axios.delete(URL_DEV + 'rendimientos/' + rendimiento.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { rendimientos } = response.data
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La rendimiento fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
                this.setState({
                    ... this.state,
                    rendimientos: this.setRendimientos(rendimientos),
                    modalDelete: false,
                    rendimiento: ''
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                } else {
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    render() {

        const { modal, modalDelete, title, form, options, rendimientos, data } = this.state

        return (
            <Layout active={'presupuesto'}  {...this.props}>
                {/*
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" />
                </div>
                */}
                <Modal title={title} show={modal} handleClose={this.handleClose} >
                    <RendimientoForm form={form} options={options}
                        onChange={this.onChange} onSubmit={this.onSubmit} onChangeAdjunto={this.onChangeAdjunto}
                        clearFiles={this.clearFiles} />
                </Modal>

                {/*<DataTable columns = { RENDIMIENTOS_COLUMNS } data = { rendimientos } />*/}
                <NewTable columns={RENDIMIENTOS_COLUMNS} data={rendimientos}
                    title='Rendimientos' subtitle='Listado de rendimientos'
                    mostrar_boton={true}
                    abrir_modal={true}
                    onClick={this.openModal}
                    mostrar_acciones={true}

                    elements={data.rendimientos}
                />


                <ModalDelete show={modalDelete} handleClose={this.handleCloseDelete} onClick={(e) => { e.preventDefault(); this.deleteRendimientoAxios() }}>
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar el rendimiento?
                    </Subtitle>
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

export default connect(mapStateToProps, mapDispatchToProps)(Rendimientos);