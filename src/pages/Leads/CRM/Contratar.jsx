import React, { Component } from 'react'
import { Accordion, Card } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Button } from '../../../components/form-components'
import ClienteForm from '../../../components/forms/ClienteForm'
import Layout from '../../../components/layout/layout'
import { Modal } from '../../../components/singles'
import { CP_URL, URL_DEV, TOKEN_CP } from '../../../constants'
import axios from 'axios'
import { doneAlert, errorAlert, printResponseErrorAlert, questionAlert2, waitAlert, createAlertSA2WithCloseAndHtml } from '../../../functions/alert'
import ProyectosFormGray from '../../../components/forms/proyectos/ProyectosFormGray'
import { setOptions } from '../../../functions/setters'
import Swal from 'sweetalert2'
import { ProyectoCard } from '../../../components/cards'

class Contratar extends Component {
    state = {
        modal: false,
        formModal: {
            caja: true
        },
        form: {
            colonias: [],
            empresa: '',
            nombre: '',
            puesto: '',
            cp: '',
            estado: '',
            municipio: '',
            colonia: '',
            calle: '',
            perfil: '',
            rfc: '',
            contacto:''
        },
        formProyecto:{
            fechaInicio: new Date(),
            fechaFin: new Date(),
            fechaReunion: new Date(),
            estatus:'',
            fase: '',
            fases: [],
            proyecto: '',
            semana: '',
            nombre: '',
            cliente: '',
            contacto: '',
            numeroContacto: '',
            empresa: '',
            cp: '',
            estado: '',
            municipio: '',
            calle: '',
            colonia: '',
            porcentaje: '',
            descripcion: '',
            correo: '',
            correos: [],
            clientes: [],
            adjuntos: {
                image:{
                    value: '',
                    placeholder: 'Imagen',
                    files: []
                }
            },
            tipoProyecto:'',
            m2:''
        },
        options:{
            empresas: [],
            clientes: [],
            colonias: [],
            estatus: [],
            fases: [],
            tipos:[]
        },
        lead: ''
    }

    componentDidMount(){
        this.getOptionsAxios()
        this.getOneLead()
    }

    openModal = () => {
        this.setState({
            ...this.state,
            modal: true
        })
    }

    handleClose = () => {
        this.setState({
            ...this.state,
            modal: false
        })
    }

    onChangeProyecto = e => {
        const { name, value } = e.target
        const { formProyecto } = this.state
        formProyecto[name] = value
        this.setState({
            ...this.state,
            formProyecto
        })
    }

    onChange = event => {
        const { form } = this.state
        const { name, value } = event.target
        if (name === 'empresa') {
            let cadena = value.replace(/,/g, '')
            cadena = cadena.replace(/\./g, '')
            form[name] = cadena
        } else
            form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    onChangeOptions = (e, arreglo) => {
        const { value } = e.target
        const { formProyecto, options } = this.state
        let auxArray = formProyecto[arreglo]
        let aux = []
        options[arreglo].find(function (_aux) {
            if (_aux.value.toString() === value.toString()) {
                auxArray.push(_aux)
            } else {
                aux.push(_aux)
            }
            return false
        })
        formProyecto[arreglo] = auxArray
        this.setState({
            ...this.state,
            formProyecto,
            options
        })
    }
    deleteOption = (element, array) => {
        let { formProyecto } = this.state
        let auxForm = []
        formProyecto[array].map((elemento, key) => {
            if (element !== elemento) {
                auxForm.push(elemento)
            }
            return false
        })
        formProyecto[array] = auxForm
        this.setState({
            ...this.state,
            formProyecto
        })
    }

    removeCorreo = value => {
        const { formProyecto } = this.state
        let aux = []
        formProyecto.correos.map((correo, key) => {
            if (correo !== value) {
                aux.push(correo)
            }
            return false
        })
        formProyecto.correos = aux
        this.setState({
            ...this.state,
            formProyecto
        })
    }

    changeCP = event => {
        const { value, name } = event.target
        this.onChange({ target: { name: name, value: value } })
        if (value.length === 5)
            this.cpAxios(value)
    }

    onChangeCPProyecto = event => {
        const { value, name } = event.target
        this.onChangeProyecto({ target: { name: name, value: value } })
        if (value.length === 5)
            this.cpProyectosAxios(value)
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            if (element === 'colonias')
                form[element] = []
            else
                form[element] = ''
            return false
        })
        return form
    }

    onSubmitCliente = e => {
        e.preventDefault();
        waitAlert()
        this.addClienteAxios();
    }

    onSubmit = e => {
        e.preventDefault();
        questionAlert2(
            '¿DESEAS ENVIAR CORREO Y GENERAR NUEVO USUARIO?', 
            '', 
            () => this.convertLeadAxios(),
            <form id = 'sendCorreoForm' name = 'sendCorreoForm'>
                <div className="form-group">
                    <div className="radio-inline">
                        <label className="radio">
                            <input type = "radio" name = 'sendCorreo' value = 'si'/>SI
                            <span></span>
                        </label>
                        <label className="radio">
                            <input type = "radio" name = 'sendCorreo' value = 'no' />NO
                            <span></span>
                        </label>
                    </div>
                </div>
            </form>
        )
    }

    async getOneLead() {
        const { location: { state } } = this.props
        const { formProyecto, options} = this.state
        options.tipos = setOptions(state.lead.empresa.tipos, 'tipo', 'id')
        let arreglo = []
        formProyecto.numeroContacto = state.lead.telefono
        formProyecto.contacto = state.lead.nombre.toUpperCase()
        formProyecto.nombre = state.lead.prospecto.nombre_proyecto
        if(state.lead.email){
            arreglo.push(state.lead.email)
            formProyecto.correos = arreglo
        }
        formProyecto.tipoProyecto = state.lead.prospecto.tipo_proyecto.id.toString()
        formProyecto.m2 = state.lead.presupuesto_diseño!==null?state.lead.presupuesto_diseño.m2:''
        this.setState({
            ...this.state,
            lead: state.lead,
            formProyecto
        })
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'proyectos/opciones', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { clientes, empresas, estatus } = response.data
                const { options } = this.state
                options['clientes'] = setOptions(clientes, 'empresa', 'id')
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['estatus'] = setOptions(estatus, 'estatus', 'id')
                options['fases'] = setOptions([
                    {id: 'fase1', name : 'Fase 1'},
                    {id: 'fase2', name : 'Fase 2'},
                    {id: 'fase3', name : 'Fase 3'}], 'name', 'id')
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
            console.log(error, 'error')
        })
    }

    async convertLeadAxios(){
        const { access_token } = this.props.authUser
        let { formProyecto, lead } = this.state
        let sendCorreoValue = document.sendCorreoForm.sendCorreo.value;
        if(sendCorreoValue === 'si' || sendCorreoValue === 'no'){
            formProyecto.sendCorreo = sendCorreoValue
            await axios.post( `${URL_DEV}v2/leads/crm/convert/${lead.id}`, formProyecto, { headers: { Authorization: `Bearer ${access_token}` } }).then(
                (response) => {
                    const { proyecto } = response.data
                    const { history } = this.props;
                    createAlertSA2WithCloseAndHtml(
                        <div>
                            <h2 className = 'swal2-title mb-4 mt-2'>
                                <span className="text-primary">¡FELICIDADES!</span> CREASTE EL PROYECTO <span className="text-success">{proyecto.nombre}</span>
                            </h2>
                            <span className = 'mb-2'>
                                ¿DESEAS CREAR LA CAJA CHICA?
                            </span>
                            <form id = 'formulario_swal' name = 'formulario_swal'>
                                <div className="form-group">
                                    <div className="radio-inline">
                                        <label className="radio">
                                            <input type = "radio" name = 'caja' value = { true } />Si
                                            <span></span>
                                        </label>
                                        <label className="radio">
                                            <input type = "radio" name = 'caja' value = { false } />No
                                            <span></span>
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>,
                        () => { 
                            if(document.formulario_swal.caja.value){ this.addCajaChicaAxios(proyecto)}
                            else{ history.push({pathname: '/leads/crm'}) }
                        }, () => { history.push({pathname: '/leads/crm'}) }
                    )
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.log(error, 'error')
            })
        }else{ errorAlert('Selecciona una opción') }
    }

    async addCajaChicaAxios(proyecto){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'cuentas/proyecto/caja/' + proyecto.id, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                doneAlert('Caja chica generada con éxito.')
                history.push({pathname: '/leads/crm'})
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addClienteAxios() {
        const { access_token } = this.props.authUser
        let { form } = this.state
        await axios.post(URL_DEV + 'cliente', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { cliente, clientes } = response.data
                const { formProyecto, options } = this.state
                options.clientes = setOptions(clientes, 'empresa', 'id')
                formProyecto.clientes.push({
                    name: cliente.empresa, value: cliente.id.toString(), label: cliente.empresa
                })
                this.setState({
                    ...this.state,
                    modal: false,
                    form: this.clearForm(),
                    formProyecto,
                    options
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Cliente agregado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async cpAxios(value) {
        await axios.get(`${CP_URL}${value}?token=${TOKEN_CP}&type=simplified`).then(
            (response) => {
                const { municipio, estado, asentamiento } = response.data.response
                const { form } = this.state
                let aux = [];
                asentamiento.map((colonia, key) => {
                    aux.push({ value: colonia, name: colonia.toUpperCase() })
                    return false
                })
                form.municipio = municipio.toUpperCase()
                form.estado = estado.toUpperCase()
                form.colonias = aux
                this.setState({
                    ...this.state,
                    form
                })
            },
            (error) => {
            }
        ).catch((error) => {
        })
    }

    async cpProyectosAxios(value) {
        await axios.get(`${CP_URL}${value}?token=${TOKEN_CP}&type=simplified`).then(
            (response) => {
                const { error } = response.data
                const { formProyecto, options } = this.state
                if (!error) {
                    const { municipio, estado, asentamiento } = response.data.response
                    formProyecto['municipio'] = municipio.toUpperCase()
                    formProyecto['estado'] = estado.toUpperCase()
                    let aux = []
                    asentamiento.map((element) => {
                        aux.push({ name: element.toString().toUpperCase(), value: element.toString().toUpperCase() })
                        return false
                    })
                    options['colonias'] = aux
                    this.setState({
                        ...this.state,
                        formProyecto,
                        options
                    })
                }
            },
            (error) => {
            }
        ).catch((error) => {
            console.log('error catch', error)
        })
    }
    tagInputChange = (nuevosCorreos) => {
        const uppercased = nuevosCorreos.map(tipo => tipo.toUpperCase()); 
        const { formProyecto } = this.state 
        let unico = {};
        uppercased.forEach(function (i) {
            if (!unico[i]) { unico[i] = true }
        })
        formProyecto.correos = uppercased ? Object.keys(unico) : [];
        this.setState({
            formProyecto
        })
    }

    onChangeRange = range => {
        const { startDate, endDate } = range
        const { formProyecto } = this.state
        formProyecto.fechaInicio = startDate
        formProyecto.fechaFin = endDate
        this.setState({
            ...this.state,
            formProyecto
        })
    }

    render() {
        const { modal, form, formProyecto, options, lead } = this.state
        return (
            <Layout active = 'leads' { ... this.props }>
                <Card className="card-custom card-stretch">
                    <Card.Header className="border-0 mt-4 pt-3">
                        <div className="card-title d-flex justify-content-between">
                            <span className="font-weight-bolder text-dark align-self-center font-size-h3">CONVERTIR LEAD</span>
                        </div>
                        <div className="d-flex justify-content-end">
                            <Button
                                icon=''
                                className={"btn btn-icon btn-xs w-auto p-3 btn-light-success"}
                                onClick = { this.openModal }
                                only_icon={"flaticon2-plus icon-15px mr-2"}
                                text="NUEVO CLIENTE"
                            />
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <ProyectosFormGray 
                            form = { formProyecto }
                            options = { options } 
                            onChange = { this.onChangeProyecto } 
                            onChangeOptions = { this.onChangeOptions } 
                            removeCorreo = { this.removeCorreo } 
                            deleteOption = { this.deleteOption } 
                            onChangeCP = { this.onChangeCPProyecto }
                            tagInputChange={(e) => this.tagInputChange(e)}
                            onChangeRange = { this.onChangeRange }
                            onSubmit = { this.onSubmit }
                        >
                            <Accordion>
                                {
                                    lead !== '' ? 
                                        lead.prospecto ?
                                            <div className="d-flex justify-content-end">
                                                <Accordion.Toggle as = { Button }  only_icon={"far fa-eye icon-15px mr-2"} text="INFORMACIÓN LEAD"
                                                eventKey = 'prospecto' className={"btn btn-icon btn-xs w-auto p-3 btn-light-info mr-2"}
                                                />
                                            </div>
                                        : ''
                                    : ''
                                }
                                <Accordion.Collapse eventKey='prospecto'  className="px-md-6 px-0">
                                    <div>
                                        {
                                            lead !== ''?
                                                lead.prospecto ?
                                                    <div>
                                                        <ProyectoCard data={lead.prospecto} />
                                                    </div>
                                                : ''
                                            : ''
                                        }
                                    </div>
                                </Accordion.Collapse>
                            </Accordion>
                        </ProyectosFormGray>
                    </Card.Body>
                </Card>
                <Modal size = 'xl' title = 'Nuevo cliente' show = { modal }
                    handleClose = { this.handleClose }>
                        <ClienteForm formeditado = { 0 } form = { form } onChange = { this.onChange } changeCP = { this.changeCP } onSubmit = { this.onSubmitCliente } 
                            className="mt-4" />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Contratar)
