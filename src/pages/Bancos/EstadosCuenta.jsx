import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Button, SelectSearch, Calendar } from '../../components/form-components'
import { Modal, ModalDelete } from '../../components/singles'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, EDOS_CUENTAS_COLUMNS_2} from '../../constants'
import Moment from 'react-moment'
import { Small, B } from '../../components/texts'
import { Form } from 'react-bootstrap'
import NewTable from '../../components/tables/NewTable'
import { renderToString } from 'react-dom/server'
import { waitAlert} from '../../functions/alert'
import { setTextTable, setDateTable, setArrayTable} from '../../functions/setters'

class EstadosCuenta extends Component {

    state = {
        modal: false,
        adjunto: '',
        adjuntoName: '',
        adjuntoFile: '',
        modalDelete: false,
        cuentas: [],
        cuenta: '',
        fecha: new Date(),
        estados: [],
        data: {
            estados: []
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const leads = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!leads)
            history.push('/')
        this.getEstadosCuenta()
    }

    setEstados = estados => {
        let aux = []
        estados.map((estado, key) => {
            aux.push({

                actions: this.setActions(estado),
                identificador: renderToString(setTextTable(estado.id)),
                cuenta: estado.cuenta ?
                    renderToString(setArrayTable(
                        [
                            { 'name': 'Cuenta', 'text': estado.cuenta.nombre ? estado.cuenta.nombre : 'Sin definir' },
                            { 'name': 'No. Cuenta', 'text': estado.cuenta.numero ? estado.cuenta.numero : 'Sin definir' },
                        ]
                    ))
                    : '',

                estado: renderToString(setArrayTable([{ url: estado.adjunto.url, text: estado.adjunto.name }])),

                fecha: renderToString(setDateTable(estado.created_at)),
                id: estado.id
            })
        })
        this.setState({
            ... this.state,
            estados: aux
        })
    }


    setActions = estado => {
        let aux = []
        aux.push(

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

    setLinks = value => {
        return (
            <a href={value.url} target="_blank">
                <Small>
                    {
                        value.name
                    }
                </Small>
            </a>
        )
    }
    setCuenta = cuenta => {
        return (
            <>
                <div>
                    <Small className="mr-2">
                        Nombre:
                    </Small>
                    <Small color="gold">
                        <B>
                            {cuenta.nombre}
                        </B>
                    </Small>
                </div>
                <div>
                    <Small className="mr-2">
                        Número
                    </Small>
                    <Small color="gold">
                        <B>
                            {cuenta.numero}
                        </B>
                    </Small>
                </div>
            </>
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

    onChangeAdjunto = (e) => {
        this.setState({
            ... this.state,
            adjuntoFile: e.target.files[0],
            adjunto: e.target.value,
            adjuntoName: e.target.files[0].name
        })
    }
    deleteAdjunto = () => {
        this.setState({
            ... this.state,
            adjuntoFile: '',
            adjunto: '',
            adjuntoName: ''
        })
    }
    updateCuenta = value => {
        this.setState({
            ... this.state,
            cuenta: value
        })
    }
    submitForm = e => {
        e.preventDefault();
        const { adjunto } = this.state
        if (adjunto) {
            swal({
                title: '¡Un momento!',
                text: 'Se está enviando tu estado de cuenta.',
                buttons: false
            })
            this.addEstadoAxios()
        }
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            modal: !modal,
            adjuntoName: '',
            adjuntoFile: '',
            adjunto: '',
            cuenta: '',
            fecha: new Date()
        })
    }
    openModal = () => {
        this.setState({
            modal: true,
            fecha: new Date()
        })
    }
    openModalDelete = estado => {
        this.setState({
            ... this.state,
            modalDelete: true,
            estado: estado
        })
    }
    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            estado: ''
        })
    }
    handleChangeDate = date => {
        this.setState({
            ... this.state,
            fecha: date
        })
    }

    async getEstadosCuenta() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'estados-cuentas', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { estados, cuentas } = response.data
                const { data } = this.state
                data.estados = estados
                this.setEstados(estados)
                let aux = []
                cuentas.map((element, key) => {
                    aux.push({ value: element.numero, name: element.nombre })
                })
                this.setState({
                    ... this.state,
                    cuentas: aux
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
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }
    async addEstadoAxios() {
        const { access_token } = this.props.authUser
        const { adjuntoName, adjuntoFile, cuenta, fecha } = this.state
        const data = new FormData();
        data.append('adjunto', adjuntoFile)
        data.append('adjuntoName', adjuntoName)
        data.append('cuenta', cuenta)
        data.append('fecha', (new Date(fecha)).toDateString())
        await axios.post(URL_DEV + 'estados-cuentas', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { estados } = response.data
                const { data } = this.state
                data.estados = estados
                this.setEstados(estados)
                this.setState({
                    ... this.state,
                    adjunto: '',
                    adjuntoFile: '',
                    adjuntoName: '',
                    cuenta: '',
                    modal: false,
                    data
                })
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Estado de cuenta agregado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
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
            console.log(error, 'error')
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }
    async deleteEstadoAxios() {
        const { access_token } = this.props.authUser
        const { estado } = this.state
        await axios.delete(URL_DEV + 'cuentas/' + estado.cuenta.id + '/estado/' + estado.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { estados } = response.data
                const { data } = this.state
                data.estados = estados
                this.setState({
                    ... this.state,
                    modalDelete: false,
                    estado: '',
                    data
                })
                this.setEstados(estados)
                swal({
                    title: '¡Listo 👋!',
                    text: response.data.message !== undefined ? response.data.message : 'Eliminaste el estado de cuenta',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
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
            console.log(error)
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }
    render() {
        const { modal, modalDelete, adjunto, adjuntoName, cuentas, cuenta, estados, fecha, data } = this.state
        return (
            <Layout active={'bancos'}  {...this.props}>

                <NewTable columns={EDOS_CUENTAS_COLUMNS_2} data={estados}
                    title='Estados de cuenta' subtitle='Listado de estados de cuenta'
                    mostrar_boton={true}
                    abrir_modal={true}
                    mostrar_acciones={true}
                    onClick={this.openModal}
                    actions={{
                        'delete': { function: this.openModalDelete },
                    }}
                    elements={data.estados}
                    idTable='kt_datatable_estados_cuenta'
                />
                <ModalDelete title={"¿Estás seguro que deseas eliminar el estado de cuenta?"} show={modalDelete} handleClose={this.handleCloseDelete} onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteEstadoAxios() }}>
                </ModalDelete>
                <Modal size="xl" title={"Agregar estado de cuenta"} show={modal} handleClose={this.handleClose} >

                    <Form onSubmit={this.submitForm}>
                        <div className="form-group row form-group-marginless pt-4">
                            <div className="col-md-8">
                                <SelectSearch
                                    options={cuentas}
                                    placeholder="SELECCIONA LA CUENTA"
                                    name="cuenta"
                                    value={cuenta}
                                    onChange={this.updateCuenta}
                                    iconclass={"far fa-credit-card"}
                                />
                            </div>
                            <div className="col-md-4">
                                <Calendar
                                    onChangeCalendar={this.handleChangeDate}
                                    placeholder="FECHA"
                                    name="fecha"
                                    value={fecha}
                                    iconclass={"far fa-calendar-alt"}
                                />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2 pt-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-4 mt-3">
                                <div className="px-2 d-flex align-items-center">
                                    <div className="image-upload d-flex align-items-center">
                                        <div className="no-label">
                                            <input
                                                onChange={this.onChangeAdjunto}
                                                value={adjunto}
                                                name="adjunto"
                                                type="file"
                                                id="adjunto"
                                                accept="application/pdf"
                                                className={"mr-3"}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {

                                adjuntoName &&
                                <div className="col-md-8">
                                    <div className="tagify form-control p-1" tabIndex="-1" style={{ borderWidth: "0px" }}>
                                        <div className="tagify__tag tagify__tag--primary tagify--noAnim">
                                            <div
                                                title="Borrar archivo"
                                                className="tagify__tag__removeBtn"
                                                role="button"
                                                aria-label="remove tag"
                                                onClick={(e) => { e.preventDefault(); this.deleteAdjunto() }}
                                            >
                                            </div>
                                            <div><span className="tagify__tag-text p-1 white-space">{adjuntoName}</span></div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                        <div className="row mx-0">
                            <div className="col-md-12 text-center mt-3">
                                <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                            </div>
                        </div>
                    </Form>
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
export default connect(mapStateToProps, mapDispatchToProps)(EstadosCuenta);