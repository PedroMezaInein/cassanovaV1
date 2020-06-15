import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { faPlus, faTrash, faEdit, faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Button, Select, SelectSearch, Calendar } from '../../components/form-components'
import { Modal, ModalDelete } from '../../components/singles'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, CUENTAS_COLUMNS, EDOS_CUENTAS_COLUMNS_2, DARK_BLUE } from '../../constants'
import { CuentaForm } from '../../components/forms'
import Moment from 'react-moment'
import { Small, Subtitle, B } from '../../components/texts'
import DataTable from '../../components/tables/Data'
import NumberFormat from 'react-number-format';
import { Form, Badge } from 'react-bootstrap'
import Input from '../../components/form-components/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NewTable from '../../components/tables/NewTable'
import { renderToString } from 'react-dom/server'
import { errorAlert, waitAlert, forbiddenAccessAlert, createAlert } from '../../functions/alert'
import { setOptions, setSelectOptions, setTextTable, setDateTable, setListTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../functions/setters'

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

    // Setters

    setEstados = estados => {
        let aux = []
        estados.map((estado, key) => {
            console.log(estado.cuentas[0].numero, 'estado')
            aux.push({

                actions: this.setActions(estado),

                cuenta: estado.cuentas.length > 0 ?
                    renderToString(setArrayTable(
                        [
                            { 'name': 'Cuenta', 'text': estado.cuentas[0].nombre ? estado.cuentas[0].nombre : 'Sin definir' },
                            { 'name': 'No. Cuenta', 'text': estado.cuentas[0].numero ? estado.cuentas[0].numero : 'Sin definir' },
                        ]
                    ))
                    : '',

                estado: renderToString(setArrayTable([{ url: estado.url, text: estado.name }])),

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

    /*
       setAction = (id, cuentas ) => {
           return(
               <>
                   <div className="d-flex align-items-center flex-column flex-md-row">
                       <Button className="mx-2 my-2 my-md-0 small-button" text='' icon={faTrash} color="red" 
                           tooltip={{id:'delete', text:'Eliminar', type:'error'}}
                           onClick = { () => {
                               swal({
                                   title: '¿Estás seguro?',
                                   icon: 'warning',
                                   buttons: {
                                       cancel: {
                                           text: "Cancelar",
                                           value: null,
                                           visible: true,
                                           className: "button__green btn-primary cancel",
                                           closeModal: true,
                                       },
                                       confirm: {
                                           text: "Aceptar",
                                           value: true,
                                           visible: true,
                                           className: "button__red btn-primary",
                                           closeModal: true
                                       }
                                   }
                               }).then((result) => {
                                   if(result){
                                       this.deleteEstadoAxios(id, cuentas[0].id)
                                   }
                               })
                           }} />
                   </div>
               </>
           )
       } 
       */
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
    // Form
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
        const { cuenta, adjuntoFile, adjunto, adjuntoName } = this.state
        if (adjunto) {
            swal({
                title: '¡Un momento!',
                text: 'Se está enviando tu estado de cuenta.',
                buttons: false
            })
            this.addEstadoAxios()
        }
    }
    // Modal
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
    // Axios
    // Get
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
                    cuentas: aux,
                    //  estados: this.setEstados(estados)
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
        const { adjunto, adjuntoName, adjuntoFile, cuenta, fecha } = this.state
        const data = new FormData();
        data.append('adjunto', adjuntoFile)
        data.append('adjuntoName', adjuntoName)
        data.append('cuenta', cuenta)
        data.append('fecha', (new Date(fecha)).toDateString())
        await axios.post(URL_DEV + 'estados-cuentas', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { estados } = response.data
                this.setEstados(estados)
                this.setState({
                    ... this.state,
                    adjunto: '',
                    adjuntoFile: '',
                    adjuntoName: '',
                    cuenta: '',
                    modal: false
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
        console.log(this.state)
        await axios.delete(URL_DEV + 'cuentas/' + estado.cuentas[0].id + '/estado/' + estado.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { estados } = response.data
                const { data } = this.state
                data.estados = estados
                this.setState({
                    ... this.state,
                    //estados: this.setEstados(estados),
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
        const { modal, modalDelete, adjunto, adjuntoName, adjuntoFile, cuentas, cuenta, estados, fecha, data } = this.state
        console.log(estados, 'egresos -')
        console.log(data.estados)
        return (
            <Layout active={'bancos'}  {...this.props}>
                {/* <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon={faPlus} color="green" 
                        tooltip={{id:'add', text:'Nuevo'}} />
                </div>*/
                }

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
                />
                <ModalDelete show={modalDelete} handleClose={this.handleCloseDelete} onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteEstadoAxios() }}>
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar el egreso?
                    </Subtitle>
                </ModalDelete>
                <Modal show={modal} handleClose={this.handleClose} >
                    <Subtitle className="text-center" color="gold">
                        Agregar estado de cuenta
                    </Subtitle>
                    <Form onSubmit={this.submitForm}>
                    <div className="form-group row form-group-marginless mt-5">
                        <div className="col-md-8">
                            <SelectSearch
                                options={cuentas}
                                placeholder="Selecciona la cuenta"
                                name="cuenta"
                                value={cuenta}
                                onChange={this.updateCuenta}
                                iconclass={"far fa-credit-card"} 
                                />
                            <span className="form-text text-muted">Por favor, seleccione la cuenta. </span>
                        </div>
                        <div className="col-md-4">
                            <Calendar
                                onChangeCalendar={this.handleChangeDate}
                                placeholder="Fecha"
                                name="fecha"
                                value={fecha}
                                iconclass={"far fa-calendar-alt"} 
                            />
                            <span className="form-text text-muted">Por favor, seleccione la fecha. </span>
                        </div>
                    </div>
                    <div class="separator separator-dashed mt-1 mb-2"></div>
                    <div className="form-group row form-group-marginless">
                        <div className="col-md-12">
                            <div className="px-2 d-flex align-items-center">
                                    <div className="image-upload d-flex align-items-center">
                                        <div className="no-label">
                                            <Input
                                                onChange={this.onChangeAdjunto}
                                                value={adjunto}
                                                name="adjunto"
                                                type="file"
                                                id="adjunto"
                                                accept="application/pdf" 
                                                />
                                            <span className="form-text text-muted">Por favor, adjunte su documento. </span>
                                        </div>
                                        {/*<label htmlFor="adjunto">
                                            <FontAwesomeIcon className="p-0 font-unset mr-2" icon={faPaperclip} color={DARK_BLUE} />
                                        </label>
                                        */}
                                        {
                                            adjuntoName &&
                                            <Badge variant="light" className="d-flex px-3 align-items-center" pill>
                                                <FontAwesomeIcon icon={faTimes} onClick={(e) => { e.preventDefault(); this.deleteAdjunto() }} className=" small-button mr-2" />
                                                {
                                                    adjuntoName
                                                }
                                            </Badge>
                                        }
                                    </div>
                                </div>
                        </div>
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