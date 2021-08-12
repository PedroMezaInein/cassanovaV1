import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { Button } from '../../../components/form-components'
import { Modal, ModalDelete } from '../../../components/singles'
import { ContactoLeadForm } from '../../../components/forms'
import axios from 'axios'
import { URL_DEV, PROSPECTOS_COLUMNS, CONTACTO_COLUMNS } from '../../../constants'
import { Form } from 'react-bootstrap'
import { setOptions, setTextTable, setDateTable, setArrayTable, setContactoTable, setLabelTable, setTextTableCenter } from '../../../functions/setters'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import TableForModals from '../../../components/tables/TableForModals'
import { doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'
import { ProspectoCard } from '../../../components/cards'
import { Tab, Tabs } from 'react-bootstrap'
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../../functions/routers"
import $ from "jquery";
class Leads extends Component {
    state = {
        modal: {
            convert: false,
            contactForm: false,
            delete: false,
            see: false,
        },
        title: '',
        lead: '',
        prospecto: '',
        prospectos: '',
        clientes: '',
        tiposContactos: '',
        vendedores: '',
        estatusProspectos: '',
        tipoProyectos: '',
        formContacto: {
            comentario: '',
            fechaContacto: '',
            success: 'Contactado',
            tipoContacto: '',
            newTipoContacto: '',
            adjuntos:{
                adjuntos:{
                    files: [],
                    value: '',
                    placeholder: 'Adjuntos'
                }
            }
        },
        contactHistory: [],
        data: {
            prospecto: []
        },
        formeditado: 0,
        options: {
            tiposContactos: []
        },
        active: 'nuevo',
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const leads = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!leads)
            history.push('/')
        this.getOptions();
    }

    openSafeDelete = (prospecto) => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            prospecto: prospecto
        })
    }

    handleDeleteModal = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ...this.state,
            prospecto: '',
            modal
        })
    }

    activeFormContact = prospecto => {
        const { modal } = this.state
        modal.contactForm = true
        this.setState({
            ...this.state,
            prospecto,
            modal,
            formeditado: 0,
            formContacto: this.clearContactForm()
        })
    }

    handleCloseFormContact = () => {
        const { modal } = this.state
        modal.contactForm = false
        this.setState({
            ...this.state,
            prospecto: '',
            modal,
            formContacto: this.clearContactForm()
        })
    }

    activeModalHistory = prospecto => {
        const { modal } = this.state
        modal.contactForm = true
        let aux = []
        prospecto.contactos.map((contacto) => {
            aux.push(
                {
                    usuario: renderToString(contacto ? contacto.user ? contacto.user.name ? setTextTable(contacto.user.name) : '' : '' : ''),
                    fecha: renderToString(setDateTable(contacto.created_at)),
                    medio: renderToString(setTextTable(contacto ? contacto.tipo_contacto ? contacto.tipo_contacto.tipo ? contacto.tipo_contacto.tipo : '' : '' : '')),
                    estado: renderToString(setTextTable(contacto.success ? 'Contactado' : 'Sin respuesta')),
                    comentario: renderToString(setTextTable(contacto.comentario)),
                }
            )
            return false
        })
        this.setState({
            ...this.state,
            prospecto,
            modal,
            contactHistory: aux,
            formContacto: this.clearContactForm()
        })
    }

    openConvert = (prospecto) => {
        const { modal } = this.state
        modal.convert = true
        this.setState({
            ...this.state,
            modal,
            prospecto: prospecto,
            formeditado: 1
        })
    }

    handleCloseConvertModal = () => {
        const { modal } = this.state
        modal.convert = false
        this.setState({
            ...this.state,
            prospecto: '',
            modal
        })
    }

    changePageEdit = (prospecto) => {
        const { history } = this.props
        history.push({
            pathname: '/leads/prospectos/edit',
            state: { prospecto: prospecto }
        });
    }

    openModalSee = prospecto => {
        const { modal } = this.state
        modal.see = true
        this.setState({
            ...this.state,
            modal,
            prospecto: prospecto
        })
    }

    handleCloseSee = () => {
        const { modal } = this.state
        modal.see = false
        this.setState({
            ...this.state,
            modal,
            prospecto: ''
        })
    }

    clearContactForm = () => {
        const { formContacto } = this.state
        let aux = Object.keys(formContacto)
        aux.map((element) => {
            switch (element) {
                case 'success':
                    formContacto[element] = 'Contactado'
                    break;
                case 'adjuntos':
                    formContacto[element] = {
                        adjuntos:{
                            files: [],
                            value: '',
                            placeholder: 'Adjuntos'
                        }
                    }
                    break;
                default:
                    formContacto[element] = ''
                    break;
            }
            return false
        })
        return formContacto;
    }

    onChangeContacto = event => {
        const { formContacto } = this.state
        const { name, value } = event.target
        formContacto[name] = value
        this.setState({
            ...this.state,
            formContacto
        })
    }

    setProspectos = prospectos => {
        let aux = []
        prospectos.map((prospecto, key) => {
            aux.push({
                actions: this.setActions(prospecto),
                lead: prospecto.lead ? renderToString(setContactoTable(prospecto.lead)) : '',
                empresa: prospecto.lead ? prospecto.lead.empresa ? renderToString(setTextTableCenter(prospecto.lead.empresa.name)) : '' : '',
                cliente: prospecto.cliente ?
                    renderToString(setArrayTable([
                        { name: 'Nombre', text: prospecto.cliente.nombre },
                        { name: 'RFC', text: prospecto.cliente.rfc },
                        { name: 'Empresa', text: prospecto.cliente.empresa },
                    ]))
                    : '',
                tipoProyecto: prospecto.tipo_proyecto ? renderToString(setTextTableCenter(prospecto.tipo_proyecto.tipo)) : '',
                descripcion: renderToString(setTextTable(prospecto.descripcion)),
                vendedor: prospecto.vendedor ? renderToString(setTextTable(prospecto.vendedor.name)) : '',
                preferencia: renderToString(setTextTableCenter(prospecto.preferencia)),
                estatusProspecto: prospecto.estatus_prospecto ? renderToString(this.setLabel(prospecto.estatus_prospecto)) : '',
                motivo: renderToString(setTextTable(prospecto.motivo)),
                fechaConversion: renderToString(setDateTable(prospecto.created_at)),
                id: prospecto.id
            })
            return aux
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
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            },
            {
                text: 'Contacto',
                btnclass: 'info',
                iconclass: 'flaticon2-paper',
                action: 'contacto',
                tooltip: { id: 'contacto', text: 'Contacto' }
            },
            {
                text: 'Convertir&nbsp;en&nbsp;proyecto',
                btnclass: 'dark',
                iconclass: 'flaticon2-refresh',
                action: 'convert',
                tooltip: { id: 'convert', text: 'Convertir en proyecto' }
            }
        )
        // if (prospecto.contactos.length > 0) {
        //     aux.push(
        //         {
        //             text: 'Historial&nbsp;de&nbsp;contacto',
        //             btnclass: 'primary',
        //             iconclass: 'flaticon-list-1',
        //             action: 'historial',
        //             tooltip: { id: 'historial', text: 'Historial de contacto' }
        //         }
        //     )
        // }
        return aux
    }

    setLabel = (estatus) => {
        let text = {}
        text.letra = estatus.color_texto
        text.fondo = estatus.color_fondo
        text.estatus = estatus.estatus
        return setLabelTable(text)
    }

    submitContactForm = e => {
        e.preventDefault();
        this.addContactoAxios()
    }

    safeConvert = e => prospecto => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/proyectos/convert',
            state: { prospecto: prospecto }
        });
    }

    async getOptions() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'prospecto/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { options } = this.state
                const { tiposContactos } = response.data
                options.tiposContactos = setOptions(tiposContactos, 'tipo', 'id')
                options.tiposContactos.push({
                    value: 'New', name: '+ Agregar nuevo'
                })
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
            console.error(error, 'error')
        })
    }

    async getProspectoAxios() {
        $('#kt_datatable_prospectos').DataTable().ajax.reload();
    }

    async deleteProspectoAxios() {
        const { prospecto } = this.state
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'prospecto/' + prospecto.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getProspectoAxios()
                const { modal } = this.state
                modal.delete = false
                this.setState({
                    ...this.state,
                    modal,
                    title: '',
                    prospecto: ''
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste el lead con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async addContactoAxios() {
        const { access_token } = this.props.authUser
        const { formContacto, prospecto } = this.state
        await axios.post(URL_DEV + 'prospecto/' + prospecto.id + '/contacto', formContacto, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getProspectoAxios()
                const { tiposContactos } = response.data
                const { modal, options } = this.state
                modal.contactForm = false
                options.tiposContactos = setOptions(tiposContactos, 'tipo', 'id')
                options.tiposContactos.push({
                    value: 'New', name: '+ Agregar nuevo'
                })
                this.setState({
                    ...this.state,
                    modal,
                    prospecto: '',
                    options
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Convertiste con éxisto el lead.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    controlledTab = value => {
        this.setState({
            ...this.state,
            formContacto: this.clearContactForm(),
            active: value
        })
    }

    changePageDesign = prospecto => {
        const { history } = this.props
        history.push({
            pathname: '/presupuesto/presupuesto-diseño/add',
            state: { prospecto: prospecto }
        });
    }

    changePageObra = prospecto => {
        const { history } = this.props
        history.push({
            pathname: '/presupuesto/presupuesto/add',
            state: { prospecto: prospecto }
        });
    }

    handleChange = (files, item) => {
        const { formContacto } = this.state
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
        formContacto['adjuntos'][item].value = files
        formContacto['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            formContacto
        })
    }

    render() {
        const { modal, options, formContacto, prospecto, data, contactHistory, active } = this.state
        return (
            <Layout active={'leads'}  {...this.props}>
                <NewTableServerRender
                    columns={PROSPECTOS_COLUMNS}
                    title='Prospectos'
                    subtitle='Listado de prospectos'
                    mostrar_boton={true}
                    url='/leads/prospectos/add'
                    abrir_modal={false}
                    mostrar_acciones={true}
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openSafeDelete },
                        'contacto': { function: this.activeModalHistory },
                        'convert': { function: this.openConvert },
                        'see': { function: this.openModalSee },
                    }}
                    idTable='kt_datatable_prospectos'
                    accessToken={this.props.authUser.access_token}
                    setter={this.setProspectos}
                    urlRender={URL_DEV + 'prospecto'}
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />
                <Modal size="xl" title="Agregar un nuevo contacto" show={modal.contactForm} handleClose={this.handleCloseFormContact} >
                    <div className="d-flex justify-content-center mt-4">
                        <div className="row m-0">
                            <span onClick={(e) => { e.preventDefault(); this.changePageDesign(prospecto) }} className="text-info font-weight-bold font-size-sm">
                                <div className="bg-light-info rounded-sm mr-5 p-2">
                                    <span className="svg-icon svg-icon-xl svg-icon-info mr-2">
                                        <SVG src={toAbsoluteUrl('/images/svg/Pen-tool-vector.svg')} />
                                    </span>
                                    Presupuesto de diseño
                                </div>
                            </span>
                            <span onClick={(e) => { e.preventDefault(); this.changePageObra(prospecto) }} className="text-pink font-weight-bold font-size-sm">
                                <div className="bg-light-pink rounded-sm p-2">
                                    <span className="svg-icon svg-icon-xl svg-icon-pink mr-2">
                                        <SVG src={toAbsoluteUrl('/images/svg/Road-Cone.svg')} />
                                    </span>
                                    Presupuesto de obra
                                </div>
                            </span>
                        </div>
                    </div>
                    <Tabs defaultActiveKey="nuevo" className="mt-4 nav nav-tabs justify-content-start nav-bold bg-gris-nav bg-gray-100" activeKey={active} onSelect={this.controlledTab}>
                        <Tab eventKey="nuevo" title="Agregar un nuevo contacto">
                            <Form className="mx-3" onSubmit={this.submitContactForm}>
                                <ContactoLeadForm
                                    options={options}
                                    formContacto={formContacto}
                                    onChangeContacto={this.onChangeContacto}
                                    handleChange = { this.handleChange }
                                />
                                <div className="mt-3 text-center">
                                    <Button icon='' className="mx-auto" type="submit" text="ENVIAR" />
                                </div>
                            </Form>
                        </Tab>
                        {
                            // prospecto !== ''?
                                // contactHistory> 0 ?
                                    <Tab eventKey="historial" title="Historial de contacto">
                                        {
                                            contactHistory &&
                                            <div className="px-4">
                                                <TableForModals
                                                    mostrar_boton={false}
                                                    abrir_modal={false}
                                                    mostrar_acciones={false}
                                                    columns={CONTACTO_COLUMNS}
                                                    data={contactHistory}
                                                    elements={data.contactHistory}
                                                />
                                            </div>
                                        }
                                    </Tab>
                                // :''
                            // :''
                        }
                        {
                            
                        }
                    </Tabs>
                </Modal >
                <ModalDelete
                    title="¿Deseas eliminar el prospecto?"
                    show={modal.delete}
                    handleClose={this.handleDeleteModal}
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteProspectoAxios() }}
                />
                <Modal
                    size="xl"
                    show={modal.convert}
                    handleClose={this.handleCloseConvertModal}
                    title="¿Estás seguro que deseas convertir el prospecto en un proyecto?">
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick={this.handleCloseConvertModal} text="CANCELAR" className={"btn btn-light-primary font-weight-bolder mr-3"} />
                        <Button icon='' onClick={(e) => { this.safeConvert(e)(prospecto) }} text="CONTINUAR" className={"btn btn-success font-weight-bold mr-2"} />
                    </div>
                </Modal>
                <Modal size="lg" title="Prospecto" show={modal.see} handleClose={this.handleCloseSee} >
                    <ProspectoCard prospecto={prospecto} />
                </Modal>
            </Layout >
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

export default connect(mapStateToProps, mapDispatchToProps)(Leads);