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
import { setOptions, printTableCP } from '../../../functions/setters'
import Swal from 'sweetalert2'
import { ContratarCard } from '../../../components/cards'
import SelectSearchGray from '../../../components/form-components/Gray/SelectSearchGray'
import { setSingleHeader } from '../../../functions/routers'
import S3 from 'react-aws-s3';

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
            cliente_principal: '',
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
            fechaEvidencia: new Date(),
            adjunto: '',
            numero_orden: '',
            cotizacionId:0
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
                            colonia: cliente.colonia.toUpperCase(),
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
            () => this.uploadFilesS3(),
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

    uploadFilesS3 = async() => {
        let mustSendCorreo = document.sendCorreoForm.sendCorreo.value
        if(mustSendCorreo === 'no' || mustSendCorreo === 'si'){
            const { lead } = this.state
            const { form_orden } = this.props.location.state
            const filePath = `presupuesto-diseño/${lead.empresa.name}/${form_orden.pdf_id.pivot.identificador}/orden-compra/${Math.floor(Date.now() / 1000)}-${form_orden.adjunto.name}`
            const { access_token } = this.props.authUser
            console.log(form_orden.adjunto, 'FORM ORDEN ADJUNTO')

            await axios.get(`${URL_DEV}v1/constant/admin-proyectos`, { headers: setSingleHeader(access_token) }).then(
                (response) => {
                    const { alma } = response.data
                    console.log(filePath, form_orden)
                    new S3(alma).uploadFile(form_orden.adjunto, `${filePath}`)
                        .then((data) =>{
                            const { location,status } = data
                            if(status === 204){ 
                                this.createProyectoAxios({ name: form_orden.adjunto.name, url: location }, mustSendCorreo)
                            }
                            else{ errorAlert('Ocurrió un error al enviar la información') }
                        }).catch(err => console.log(err))
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
        }else{ errorAlert(`Vuelve a intentarlo y selecciona una opción.`) }
        
    }

    createProyectoAxios = async(value, flag) => {
        console.log(`VALUE: `, value)
        const { form_orden } = this.props.location.state
        const { formProyecto, lead } = this.state
        const { access_token } = this.props.authUser
        let aceptacion = {
            fecha_aceptacion: form_orden.fechaEvidencia,
            orden_compra: form_orden.numero_orden,
            visto_bueno: value,
            pdf: form_orden.pdf_id.id
        }
        formProyecto.aceptacion = aceptacion
        formProyecto.sendCorreo = flag
        await axios.post(`${URL_DEV}v3/leads/crm/${lead.id}/contratar`, formProyecto, { headers: setSingleHeader( access_token ) }).then(
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
                        else{ history.push({pathname: '/leads/crm/info/info',state: { lead: lead, tipo: 'Contratado' }}) }
                    }, () => { history.push({pathname: '/leads/crm/info/info',state: { lead: lead, tipo: 'Contratado' }}) }
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    getOneLead = async() => {
        const { location: { state } } = this.props
        const { lead } = state
        const { formProyecto, options } = this.state
        options.tipos = setOptions(lead.empresa.tipos, 'tipo', 'id')
        let arreglo = []
        formProyecto.numeroContacto = lead.telefono
        formProyecto.contacto = lead.nombre.toUpperCase()
        //formProyecto.nombre = state.lead.prospecto.nombre_proyecto
        if(lead.email){
            arreglo.push(lead.email)
            formProyecto.correos = arreglo
        }
        formProyecto.tipoProyecto = {
            name: lead.prospecto.tipo_proyecto.tipo, 
            value: lead.prospecto.tipo_proyecto.id.toString(), 
            label: lead.prospecto.tipo_proyecto.tipo
        }
        formProyecto.m2 = state.lead.presupuesto_diseño!==null?state.lead.presupuesto_diseño.m2:''
        formProyecto.cotizacionId = state.form_orden.pdf_id.pivot.identificador
        formProyecto.costo = state.form_orden.pdf_id.pivot.costo
        this.setState({ ...this.state, lead: state.lead, formProyecto })
    }

    getOptionsAxios = async() => {
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
    
    addCajaChicaAxios = async(proyecto) => {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'cuentas/proyecto/caja/' + proyecto.id, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                const { lead } = this.state
                doneAlert('Caja chica generada con éxito.',
                    () => { history.push({pathname: '/leads/crm/info/info',state: { lead: lead, tipo: 'Contratado' }}) }
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    addClienteAxios = async() => {
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

    sendForm = async() => {
        let { formProyecto } = this.state
        const { options } = this.state
        if(formProyecto.ubicacion_cliente === true){
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
        }else{
            formProyecto.cp = ''
            formProyecto.estado = ''
            formProyecto.municipio = ''
            formProyecto.colonia = ''
            formProyecto.calle = ''
        }
        Swal.close()
        this.setState({
            ...this.state,
            modalCP: false,
            formProyecto
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

    changeNameFile(id){
        var pdrs = document.getElementById(id).files[0].name;
        document.getElementById('info').innerHTML = pdrs;
    }

    onChangeFile = (value, name) => {
        const { formProyecto } = this.state
        formProyecto[name] = value
        this.setState({...this.state, formProyecto})
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
                            <Button icon = '' className = "btn btn-icon btn-xs w-auto p-3 btn-light-success" onClick = { this.openModal }
                                only_icon = "flaticon2-plus icon-15px mr-2" text = "NUEVO CLIENTE" />
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <ProyectosFormGray form = { formProyecto } options = { options }  onChange = { this.onChangeProyecto } 
                            onChangeOptions = { this.onChangeOptions }  removeCorreo = { this.removeCorreo }  deleteOption = { this.deleteOption }
                            tagInputChange={(e) => this.tagInputChange(e)} onChangeRange = { this.onChangeRange } onSubmit = { this.onSubmit }
                            openModalCP={this.openModalCP} showModal={showModal} changeNameFile={this.changeNameFile} onChangeFile={this.onChangeFile} >
                            <Accordion className="px-5">
                                {
                                    lead !== '' ? 
                                        lead.prospecto ?
                                            <div className="d-flex justify-content-end px-md-6 px-0 mb-5">
                                                <Accordion.Toggle as = { Button }  only_icon="far fa-eye icon-15px mr-2" text="INFORMACIÓN LEAD"
                                                    eventKey = 'prospecto' className="btn btn-icon btn-xs w-auto p-3 btn-light-info" />
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
                                                        <ContratarCard lead={lead} />
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
                <Modal size = 'xl' title = 'Nuevo cliente' show = { modal } handleClose = { this.handleClose }>
                    <ClienteForm formeditado = { 0 } form = { form } onChange = { this.onChange } onSubmit = { this.onSubmitCliente } className="mt-4" />
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
                                                    printTableCP(key, cliente)
                                                )
                                            }else if(options.cp_clientes.length === 1){
                                                return (
                                                    printTableCP(key, cliente)
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
