import React, { Component } from 'react'
import { Accordion, Card, Form } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Button } from '../../../components/form-components'
import ClienteForm from '../../../components/forms/ClienteForm'
import Layout from '../../../components/layout/layout'
import { Modal } from '../../../components/singles'
import { URL_DEV } from '../../../constants'
import axios from 'axios'
import { doneAlert, errorAlert, printResponseErrorAlert, questionAlert2, waitAlert, createAlertSA2WithCloseAndHtml } from '../../../functions/alert'
import ProyectosFormGray from '../../../components/forms/proyectos/ProyectosFormGray'
import { setOptions } from '../../../functions/setters'
import Swal from 'sweetalert2'
import { ProyectoCard } from '../../../components/cards'
import SelectSearchGray from '../../../components/form-components/Gray/SelectSearchGray'
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
            costo: 0.0,
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
            m2:'',
            ubicacion_cliente: '',
        },
        options:{
            empresas: [],
            clientes: [],
            colonias: [],
            estatus: [],
            fases: [],
            tipos:[],
            cp_clientes: []
        },
        lead: '',
        modalCP: false,
        showModal:false
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

    // onChangeProyecto = e => {
    //     const { name, value } = e.target
    //     const { formProyecto } = this.state
    //     formProyecto[name] = value
    //     this.setState({
    //         ...this.state,
    //         formProyecto
    //     })
    // }
    onChangeProyecto = e => {
        const { name, value, type } = e.target
        const { formProyecto, options } = this.state
        let { showModal } = this.state
        formProyecto[name] = value
        if(type === 'radio'){
            if(name === 'ubicacion_cliente')
            formProyecto[name] = value === "true" ? true : false
        }
        switch (name) {
            case 'cliente':
                let aux = [];
                formProyecto.clientes.forEach((cliente) => {
                    if(cliente.cp !== null){
                        aux.push({
                            name: cliente.name,
                            value: cliente.value,
                            label: cliente.name,
                            cp: cliente.cp,
                            estado: cliente.estado,
                            municipio: cliente.municipio,
                            colonia: cliente.colonia,
                            calle: cliente.calle
                        })
                    }
                })
                options.cp_clientes = aux
                if(options.cp_clientes.length > 1 || options.cp_clientes.length === 1){
                    showModal = true
                }
                else if(options.cp_clientes.length === 0 ){
                    formProyecto.cp = ''
                    formProyecto.estado = ''
                    formProyecto.municipio = ''
                    formProyecto.colonia = ''
                    formProyecto.calle = ''
                    showModal = false
                }
                this.setState({
                    ...this.state,
                    formProyecto,
                    showModal,
                    options
                })
                break;
            default:
                break;
        }
        this.setState({
            ...this.state,
            formProyecto,
            showModal,
            options
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
        let { formProyecto, showModal } = this.state
        const { options } = this.state
        let auxForm = []
        formProyecto[array].map((elemento, key) => {
            if (element !== elemento) {
                auxForm.push(elemento)
            }
            return false
        })
        formProyecto[array] = auxForm

        let aux = [];
        formProyecto[array].forEach((cliente) => {
            if(cliente.cp !== null){
                aux.push({
                    name: cliente.name,
                    value: cliente.value,
                    label: cliente.name,
                    cp: cliente.cp,
                    estado: cliente.estado,
                    municipio: cliente.municipio,
                    colonia: cliente.colonia,
                    calle: cliente.calle
                })
            }
        })
        options.cp_clientes = aux

        if(options.cp_clientes.length > 1 || options.cp_clientes.length === 1){
            showModal = true
        }else if(options.cp_clientes.length === 0 ){
            formProyecto.cp = ''
            formProyecto.estado = ''
            formProyecto.municipio = ''
            formProyecto.colonia = ''
            formProyecto.calle = ''
            showModal = false
        }
        this.setState({
            ...this.state,
            formProyecto,
            options,
            showModal,
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

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch(element){
                case 'colonias':
                    form[element] = []
                    break;
                case 'costo':
                    form[element] = 0.0
                    break;
                default:
                    form[element] = ''
                    break;
            }
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
        //formProyecto.nombre = state.lead.prospecto.nombre_proyecto
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
                let aux = [];
                clientes.forEach((element) => {
                    aux.push({
                        name: element.empresa,
                        value: element.id.toString(),
                        label: element.empresa,
                        cp: element.cp,
                        estado: element.estado,
                        municipio: element.municipio,
                        colonia: element.colonia,
                        calle: element.calle
                    })
                    return false
                })
                options.clientes = aux.sort(this.compare)
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
            console.error(error, 'error')
        })
    }
    compare( a, b ) {
        if ( a.name < b.name ){
            return -1;
        }
        if ( a.name > b.name ){
            return 1;
        }
        return 0;
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
                            <h2 className = 'swal2-title mb-10 mt-2'>
                                <span className="text-primary">¡FELICIDADES!</span> CREASTE EL PROYECTO <span className="text-success">{proyecto.nombre}</span>
                            </h2>
                            <span className = 'mb-2'>
                                ¿DESEAS CREAR LA CAJA CHICA?
                            </span>
                            <form id = 'formulario_swal' name = 'formulario_swal'>
                                <div className="my-5">
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
                console.error(error, 'error')
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
            console.error(error, 'error')
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
            console.error(error, 'error')
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
    openModalCP = () => {
        this.setState({
            ...this.state,
            modalCP:true
        })
    }
    handleCloseCP = () => { 
        let { formProyecto } = this.state
        formProyecto.ubicacion_cliente = ''
        formProyecto.cp_ubicacion = ''
        this.setState({
            ...this.state,
            modalCP: false,
            formProyecto
        })
    }
    updateSelectCP = value => {
        this.onChangeProyecto({ target: { name: 'cp_ubicacion', value: value.toString() } })
    }
    sendForm = async() => {
        let { formProyecto } = this.state
        const { options } = this.state
        options.cp_clientes.forEach((cliente) => {
            if (formProyecto.cp_ubicacion === cliente.value) {
                formProyecto.cp = cliente.cp
                formProyecto.estado = cliente.estado
                formProyecto.municipio = cliente.municipio
                formProyecto.colonia = cliente.colonia
                formProyecto.calle = cliente.calle
            }else if(options.cp_clientes.length === 1){
                formProyecto.cp = cliente.cp
                formProyecto.estado = cliente.estado
                formProyecto.municipio = cliente.municipio
                formProyecto.colonia = cliente.colonia
                formProyecto.calle = cliente.calle
            }
        })
        Swal.close()
        // formProyecto.ubicacion_cliente = ''
        // formProyecto.cp_ubicacion = ''
        
        this.setState({
            ...this.state,
            modalCP: false,
            formProyecto
        })
    }
    printTable = (key, cliente) => {
        return (
            <tbody key={key}>
                <tr className="border-top-2px">
                    <td className="text-center w-5">
                        <i className="las la-user-alt icon-2x text-dark-50"></i>
                    </td>
                    <td className="w-33 font-weight-bolder text-dark-50">
                        NOMBRE DE CLIENTE
                    </td>
                    <td className="font-weight-light">
                        <span>{cliente.name}</span>
                    </td>
                </tr>
                <tr>
                    <td className="text-center">
                        <i className="las la-map-pin icon-2x text-dark-50"></i>
                    </td>
                    <td className="font-weight-bolder text-dark-50">
                        CÓDIGO POSTAL
                    </td>
                    <td className="font-weight-light">
                        <span>{cliente.cp}</span>
                    </td>
                </tr>
                <tr>
                    <td className="text-center">
                        <i className="las la-globe icon-2x text-dark-50"></i>
                    </td>
                    <td className="font-weight-bolder text-dark-50">ESTADO</td>
                    <td className="font-weight-light">
                        <span>{cliente.estado}</span>
                    </td>
                </tr>
                <tr>
                    <td className="text-center">
                        <i className="las la-map icon-2x text-dark-50"></i>
                    </td>
                    <td className="font-weight-bolder text-dark-50">
                        MUNICIPIO/DELEGACIÓN
                    </td>
                    <td className="font-weight-light">
                        <span>{cliente.municipio}</span>
                    </td>
                </tr>
                <tr>
                    <td className="text-center">
                        <i className="las la-map-marker icon-2x text-dark-50"></i>
                    </td>
                    <td className="font-weight-bolder text-dark-50">
                        COLONIA
                    </td>
                    <td className="font-weight-light text-justify">
                        <span>{cliente.colonia}</span>
                    </td>
                </tr>
                <tr>
                    <td className="text-center">
                        <i className="las la-map-marked-alt icon-2x text-dark-50"></i>
                    </td>
                    <td className="font-weight-bolder text-dark-50">
                        CALLE Y NÚMERO
                    </td>
                    <td className="font-weight-light text-justify">
                        <span>{cliente.calle}</span>
                    </td>
                </tr>
            </tbody>
        )
    }
    render() {
        const { modal, form, formProyecto, options, lead, modalCP, showModal } = this.state
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
                            tagInputChange={(e) => this.tagInputChange(e)}
                            onChangeRange = { this.onChangeRange }
                            onSubmit = { this.onSubmit }
                            openModalCP={this.openModalCP}
                            showModal={showModal}
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
                        <ClienteForm formeditado = { 0 } form = { form } onChange = { this.onChange } onSubmit = { this.onSubmitCliente } 
                            className="mt-4" />
                </Modal>
                <Modal size="lg" show = { modalCP } title = 'ACTUALIZAR DATOS DEL CLIENTE' handleClose = { this.handleCloseCP } >
                    <Form onSubmit={(e) => { e.preventDefault(); waitAlert(); this.sendForm(); }}>
                        <div className="row py-0 mx-0 mt-6 align-items-center d-flex justify-content-center">
                            <label className="w-auto mr-4 py-0 col-form-label text-dark-75 font-weight-bold font-size-lg">¿Quieres utilizar la ubicación del cliente?</label>
                            <div className="w-auto px-3">
                                <div className="radio-inline mt-0 ">
                                    <label className="radio radio-outline radio-brand text-dark-75 font-weight-bold">
                                        <input
                                            type="radio"
                                            name='ubicacion_cliente'
                                            value={true}
                                            onChange={this.onChangeProyecto}
                                            checked={formProyecto.ubicacion_cliente === true ? true : false}
                                        />Si
										<span></span>
                                    </label>
                                    <label className="radio radio-outline radio-brand text-dark-75 font-weight-bold">
                                        <input
                                            type="radio"
                                            name='ubicacion_cliente'
                                            value={false}
                                            onChange={this.onChangeProyecto}
                                            checked={formProyecto.ubicacion_cliente === false ? true : false}
                                        />No
										<span></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {
                            formProyecto.ubicacion_cliente && options.cp_clientes.length !== 1?
                                    <div className="row mx-0 mt-5 text-center d-flex justify-content-center">
                                        <Form.Label className="col-md-12 col-form-label font-weight-bolder">¿DE CUÁL CLIENTE DESEA UTILIZAR SU UBICACIÓN?</Form.Label>
                                        <div className="col-md-4">
                                            <SelectSearchGray
                                                formeditado={0}
                                                options={options.cp_clientes} 
                                                placeholder="SELECCIONA EL CLIENTE"
                                                name="cp_ubicacion" 
                                                value={formProyecto.cp_ubicacion} 
                                                onChange={this.updateSelectCP}
                                                withtaglabel={0}
                                                withtextlabel={0}
                                                customdiv={'mb-0'}
                                                withicon={1}
                                            />
                                        </div>
                                    </div>
                                : ''
                        }
                        {
                            formProyecto.cp_ubicacion || options.cp_clientes.length === 1 ?
                            <div className={formProyecto.ubicacion_cliente === false?'d-none':'table-responsive-lg mt-7 mb-10'}>
                                <table className="table table-vertical-center w-65 mx-auto table-borderless" id="tcalendar_p_info">
                                    {
                                        options.cp_clientes.map((cliente, key) => {
                                            if (formProyecto.cp_ubicacion === cliente.value) {
                                                return (
                                                    this.printTable(key, cliente)
                                                )
                                            }else if(options.cp_clientes.length === 1){
                                                return (
                                                    this.printTable(key, cliente)
                                                )
                                            }
                                            return <></>
                                        })
                                    }
                                </table>
                            </div>
                            :''
                        }
                        <div className="card-footer p-0 mt-4 pt-3">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-center p-0">
                                    <Button icon='' className="mx-auto" type="submit" text="CONFIRMAR" />
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Contratar)
