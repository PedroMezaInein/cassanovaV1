import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV, CONCEPTOS_FACTURACION_COLUMNS,} from '../../constants'
import { setTextTableReactDom } from '../../functions/setters'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert, customInputAlert, deleteAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Modal } from '../../components/singles'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { Update } from '../../components/Lottie'
import { Button, InputGray } from '../../components/form-components'
import $ from "jquery";
import { setSingleHeader } from "../../functions/routers"
import { Form } from 'react-bootstrap'

class ConceptoFacturacion extends Component {

    state = {
        form: {
            clave: '',
            descripcion: ''
        },
        formeditado:0,
        modal: false,
        action: 'add',
        concepto: ''
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const modulo = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!modulo)
            history.push('/')
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    setConceptos = conceptos => {
        let aux = []
        conceptos.forEach((concepto) => {
            aux.push({
                actions: this.setActions(concepto),
                clave: setTextTableReactDom(concepto.clave, this.doubleClick, concepto, 'clave', 'text-center'),
                descripcion: setTextTableReactDom(concepto.descripcion, this.doubleClick, concepto, 'descripcion', 'text-center')
            })
        })
        return aux
    }

    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
            default:
                form[tipo] = data[tipo]
                break
        }
        this.setState({form, banco: data})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { tipo === 'descripcion' ? 'DESCRIPCIÓN' : 'CLAVE' } </h2>
                {
                    tipo === 'clave' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } swal = { true }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } />
                }
                {
                    tipo === 'descripcion' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 } requirevalidation = { 0 }  
                            value = { form[tipo] } name = { tipo } swal = { true } onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } 
                            as = 'textarea' rows = '4' />
                }
            </div>,
            <Update />,
            () => { this.patchAxios(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }

    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
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
            }
        )
        return aux
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.forEach((element) => {
            form[element] = ''
        })
        return form;
    }

    handleClose = () => {
        this.setState({
            ...this.state,
            modal: false,
            action: 'add', 
            form: this.clearForm(),
            concepto: ''
        })
    }

    openModal = () => {
        this.setState({
            modal: true,
            action: 'add', 
            form: this.clearForm(),
            formeditado:0,
        })
    }

    openModalEdit = concepto => {
        const { form } = this.state
        form.clave = concepto.clave
        form.descripcion = concepto.descripcion
        this.setState({
            ...this.state,
            modal: true,
            action: 'edit',
            concepto: concepto,
            form,
            formeditado:1
        })
    }

    openModalDelete = concepto => {
        deleteAlert('¿ESTÁS SEGURO QUE DESEAS ELIMINAR EL CONCEPTO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.deleteAxios(concepto.id))
    }

    onSubmit = e => {
        e.preventDefault()
        waitAlert()
        const { action } = this.state
        switch(action){
            case 'add':
                this.addAxios()
                break;
            case 'edit':
                this.updateAxios()
                break;
        }
    }

    getAxios = async() => { $('#conceptos').DataTable().ajax.reload(); }

    addAxios = async() => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(`${URL_DEV}v1/catalogos/conceptos-facturacion`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito una nueva área.')
                this.getAxios()
                this.setState({ ...this.state, modal: false, form: this.clearForm() })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    updateAxios = async() => {
        const { access_token } = this.props.authUser
        const { form, concepto } = this.state
        await axios.put(`${URL_DEV}v1/catalogos/conceptos-facturacion/${concepto.id}`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                this.getAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el área.') 
                this.setState({ ...this.state, modal: false, form: this.clearForm(), concepto: '' })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deleteAxios = async(id) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.delete(`${URL_DEV}v1/catalogos/conceptos-facturacion/${id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                this.getAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito el área.')
                this.setState({ ...this.state, concepto: '', })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    patchAxios = async(data, tipo) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.patch(`${URL_DEV}v1/catalogos/conceptos-facturacion/${data.id}`, { tipo: tipo, value: value }, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                this.getAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El documento del IMSS editado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    render() {
        const { form, modal, action, formeditado} = this.state
        return (
            <Layout active = 'catalogos'  {...this.props}>
                <NewTableServerRender columns = { CONCEPTOS_FACTURACION_COLUMNS } title = 'Conceptos' subtitle='Listado de conceptos de facturación' 
                    mostrar_boton = { true } abrir_modal = { true } mostrar_acciones = { true } onClick = { this.openModal } idTable = 'conceptos'
                    actions = { { 'edit': { function: this.openModalEdit }, 'delete': { function: this.openModalDelete } } }
                    cardTable = 'cardTable' cardTableHeader = 'cardTableHeader' cardBody = 'cardBody' accessToken = { this.props.authUser.access_token }
                    setter =  {this.setConceptos } urlRender = { `${URL_DEV}v1/catalogos/conceptos-facturacion` } />
                <Modal size="md" show={modal} title = { `${action === 'add' ? 'Nuevo concepto' : 'Editar concepto'}` } handleClose={this.handleClose}>
                    <Form onSubmit = { this.onSubmit } >
                        <div className="form-group row form-group-marginless pt-4">
                            <div className="col-md-12">
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={1} placeholder="CLAVE" 
                                    iconclass="las la-key" name="clave" value={form.clave} onChange={this.onChange}/>
                            </div>
                            <div className="col-md-12">
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={0} withformgroup={0} placeholder="DESCRIPCIÓN" 
                                    name="descripcion" value={form.descripcion} onChange={this.onChange} as='textarea' rows='2'/>
                            </div>
                        </div>
                        <div className="card-footer py-3 pr-1">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-center pr-0 pb-0">
                                    <Button icon='' className="btn btn-primary mr-2" type = 'submit' text="ENVIAR" />
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ConceptoFacturacion);