import React, { Component } from "react"
import { connect } from "react-redux"
import axios from "axios"
import Swal from 'sweetalert2'
import { URL_DEV } from "../../constants"
import { setOptions } from "../../functions/setters"
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert, questionAlertY } from "../../functions/alert"
import Layout from "../../components/layout/layout"
import { ActualizarPresupuestoForm, AgregarConcepto } from "../../components/forms"
import { Modal, ModalSendMail } from '../../components/singles'
import FloatBtnPresupuesto from '../../components/FloatButtons/FloatBtnPresupuesto'
import { save, deleteForm } from '../../redux/reducers/formulario'
import { setSingleHeader } from "../../functions/routers"
import { CreatableMultiselectGray } from "../../components/form-components"
import PresupuestoTable from "../../components/tables/Presupuestos/PresupuestoTable"
class ActualizarPresupuesto extends Component {
    state = {
        key: 'nuevo',
        formeditado: 0,
        modal: false,
        modal_adjuntos:false,
        modal_mail: false,
        presupuesto: '',
        ticket: '',
        form: {
            unidad: '',
            partida: '',
            subpartida: '',
            descripcion: '',
            costo: '',
            proveedor: '',
            conceptos: [{
                unidad: '',
                descipcion: '',
                costo: '',
                cantidad_preliminar: '',
                desperdicio: '',
                active: true,
                cantidad: 0,
                importe: 0,
                id: '',
                mensajes: {
                    active: false,
                    mensaje: ''
                },
                unidad_id:'',
                bg_costo:true,
                bg_cantidad:true,
                vicio_oculto:false,
                activo_costo:false
            }],
            conceptosNuevos: [],
            correos: []
        },
        options: {
            unidades: [],
            partidas: [],
            subpartidas: [],
            proveedores: [],
            correos: []
        },
        data: {
            partidas: [],
            subpartidas: [],
            conceptos: [],
            adjuntos: []
        },
        aux_presupuestos: {
            conceptos: false,
            volumetrias: false,
            costos: false,
            revision:false,
            utilidad: false,
            espera: false,
            aceptado: false,
            rechazado: false,
        },
        adjuntos: []
    };
    openModal = () => {
        const { options } = this.state
        options.subpartidas = []
        this.setState({
            ...this.state,
            options,
            modal: true,
            title: 'Agregar concepto',
            form: this.clearForm(),
            formeditado: 0
        })
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            if (element !== 'conceptos' && element !== 'conceptosNuevos')
                form[element] = ''
            if(element === 'correos')
                form[element] = []
            return false
        })
        return form
    }
    handleClose = () => {
        const { modal, options } = this.state
        options.subpartidas = []
        this.setState({
            ...this.state,
            modal: !modal,
            options,
            title: 'Agregar concepto',
            concepto: '',
            form: this.clearForm()
        })
    }
    componentDidMount = () => {
        const { authUser: { user: { permisos } } } = this.props;
        const { history: { location: { pathname } } } = this.props;
        const { history, location: { state } } = this.props;
        const presupuesto = permisos.find(function (element, index) {
            const { modulo: { url } } = element;
            return pathname === url + "/update";
        });
        if (state) {
            if (state.presupuesto) {
                const { presupuesto } = state
                this.getOnePresupuestoAxios(presupuesto.id);
            }
        }
        if (!presupuesto) history.push("/");
        this.getOptionsAxios()
    }

    /* -------------------------------------------------------------------------- */
    /*                                ANCHOR async                                */
    /* -------------------------------------------------------------------------- */
    getOptionsAxios = async () => {
        /* waitAlert() */
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}presupuestos/options`, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                /* Swal.close() */
                const { empresas, proyectos, areas, partidas, proveedores, unidades, conceptos } = response.data
                const { options, data } = this.state
                data.partidas = partidas
                let aux = {}
                conceptos.forEach((concepto) => { aux[concepto.clave] = false })
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['partidas'] = setOptions(partidas, 'nombre', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                options['unidades'] = setOptions(unidades, 'nombre', 'id')
                this.setState({ ...this.state, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    addConceptoAxios = async () => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(`${URL_DEV}conceptos`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { concepto } = response.data
                this.addConceptoToPresupuestoAxios([concepto])
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    addConceptoToPresupuestoAxios = async (conceptos) => {
        const { access_token } = this.props.authUser
        const { presupuesto } = this.state
        let aux = { conceptos: conceptos }
        await axios.post(`${URL_DEV}presupuestos/${presupuesto.id}/conceptos`, aux, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { presupuesto } = response.data
                this.getOnePresupuestoAxios(presupuesto.id)
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
                this.setState({ modal: false })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    getOnePresupuestoAxios = async(id) => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}presupuestos/${id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { form, options } = this.state
                const { presupuesto } = response.data
                if(presupuesto.proyecto){
                    if(presupuesto.proyecto.contactos){
                        if(presupuesto.proyecto.contactos.length){
                            options.correos = []
                            presupuesto.proyecto.contactos.forEach(contacto => {
                                options.correos.push({
                                    value: contacto.correo.toLowerCase(),
                                    label: contacto.correo.toLowerCase(),
                                    id: contacto.id.toString()
                                })
                            })
                        }
                    }
                }
                let { bg_costo } = this.state
                let aux = []
                presupuesto.conceptos.forEach((concepto) => {
                    let mensajeAux = {}
                    if (concepto.mensaje) {
                        mensajeAux = { active: true, mensaje: concepto.mensaje }
                    } else {
                        mensajeAux = { active: false, mensaje: '' }
                    }
                    let bandera = false
                    form.conceptos.forEach((elemento) => {
                        if (concepto.id === elemento.id)
                            bandera = elemento
                    })
                    if (bandera) {
                        aux.push( bandera )
                    } else {
                        aux.push({
                            descripcion: concepto.descripcion,
                            costo: concepto.costo.toFixed(2),
                            cantidad_preliminar: concepto.cantidad_preliminar,
                            desperdicio: concepto.desperdicio,
                            cantidad: (concepto.cantidad_preliminar * (1 + (concepto.desperdicio / 100))).toFixed(2),
                            importe: ((concepto.cantidad_preliminar * (1 + (concepto.desperdicio / 100))) * concepto.costo).toFixed(2),
                            active: concepto.active ? true : false,
                            id: concepto.id,
                            mensajes: mensajeAux,
                            unidad: concepto ? concepto.concepto ? concepto.concepto.unidad ? concepto.concepto.unidad.nombre : '' : '' : '',
                            unidad_id: concepto.unidad.id.toString(),
                            bg_costo:concepto.costo>0?false:true,
                            bg_cantidad:true,
                            vicio_oculto:concepto.vicio_oculto ? true : false,
                            activo_costo:concepto.activo_costo ? true : false
                        })
                    }
                })
                form.conceptos = aux
                
                this.showStatusPresupuestos(presupuesto)
                this.setState({ ...this.state, presupuesto: presupuesto, form, formeditado: 1, bg_costo, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    updatePresupuestosAxios = async() => {
        const { access_token } = this.props.authUser
        const { form, presupuesto } = this.state
        await axios.put(`${URL_DEV}presupuestos/${presupuesto.id}`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { presupuesto } = response.data
                switch(presupuesto.estatus.estatus){
                    case 'Costos':
                        doneAlert('Presupuesto actualizado con éxito', 
                                () => questionAlertY(`¡Presupuesto estimado!`, 
                                    `¿Deseas enviar el presupuesto preeliminar a ${presupuesto.hasTickets ? 'calidad' : 'proyectos'}?`, 
                                    () => this.patchPresupuesto('estatus', 'En revisión'), 
                                    () => this.getOnePresupuestoAxios(presupuesto.id))
                            )
                        break;
                    default: 
                        doneAlert(`Presupuesto actualizado con éxito`,
                            () => { this.getOnePresupuestoAxios(presupuesto.id) } )
                    break;
                }
                
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    patchPresupuesto = async(type, value) => {
        const { access_token } = this.props.authUser
        const { presupuesto } = this.state
        waitAlert()
        await axios.patch(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}`, { type: type, value: value }, 
            { headers: setSingleHeader(access_token) }).then(
            (response) => {
                if(type === 'estatus')
                    doneAlert('Presupuesto actualizado con éxito', () => this.sendCorreoAxios(value))
                else
                    doneAlert('Presupuesto actualizado con éxito', () => this.getOnePresupuestoAxios(presupuesto.id))
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    sendCorreoAxios = async(value) => {
        const { access_token } = this.props.authUser
        const { presupuesto } = this.state
        waitAlert()
        await axios.get(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/correo?estatus=${value}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                this.getOnePresupuestoAxios(presupuesto.id)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    sendPresupuestoToClient = async() => {
        waitAlert()
        const { adjunto, presupuesto, form } = this.state
        const { access_token } = this.props.authUser
        let aux = {
            presupuestoAdjunto: adjunto,
            correos_presupuesto: []
        }
        form.correos.forEach((correo) => { aux.correos_presupuesto.push(correo.label) })
        await axios.post(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/correo`, aux, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                this.setState({ ...this.state, modal_mail: false, adjunto: null })
                doneAlert(
                    `Presupuesto enviado con éxito`,
                    () => { this.getOnePresupuestoAxios(presupuesto.id); this.openModalDownloadPDF(); }
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ...this.state,
            options
        })
    }
    onChangeConceptos = (e) => {
        const { name, value } = e.target;
        const { data, form, presupuesto } = this.state
        switch (name) {
            case 'partida':
                data.partidas.map((partida) => {
                    data.conceptos = []
                    if (partida.id.toString() === value) {
                        data.subpartidas = partida.subpartidas
                    }
                    return false
                })
                break;
            case 'subpartida':
                data.subpartidas.map((subpartida) => {
                    if (subpartida.id.toString() === value) {
                        data.conceptos = subpartida.conceptos
                    }
                    return false
                })
                let array = []
                data.conceptos.map((concepto) => {
                    let aux = false
                    presupuesto.conceptos.map((concepto_form) => {
                        if (concepto) {
                            if (concepto.clave === concepto_form.concepto.clave) {
                                aux = true
                            }
                        }
                        return false
                    })
                    if (!aux) {
                        array.push(concepto)
                    }
                    return false
                })
                form.conceptosNuevos = []
                array.map((element, key) => {
                    form.conceptosNuevos.push(element)
                    form.conceptosNuevos[key].active = false
                    return false
                })
                break;
            default:
                break;
        }
        form[name] = value;
        this.setState({
            ...this.state,
            form,
            data
        });
    };
    checkButtonConceptos = (e, key) => {
        const { checked } = e.target
        const { form } = this.state
        form.conceptosNuevos[key].active = checked
        this.setState({
            ...this.state,
            form
        })
    }
    onChange = (key, e, name) => {
        let { value } = e.target
        const { form, presupuesto } = this.state
        if (name === 'desperdicio') { 
            value = value.replace('%', '')
        }
        if (name === 'costo'){
            if(value <= 0){
                form.conceptos[key].bg_costo = true
            }else{
                form.conceptos[key].bg_costo = false
            }
        }
        if (name === 'cantidad_preliminar'){
            if (presupuesto.conceptos[key][name].toString() !== value) {
                form.conceptos[key].bg_cantidad = false
            }else{
                form.conceptos[key].bg_cantidad = true
            }
        }
        form.conceptos[key][name] = value
        form.conceptos[key].cantidad = this.getCantidad(key)

        if(form.conceptos[key].vicio_oculto){
            form.conceptos[key].importe = (0).toFixed(2)
        }else{
            form.conceptos[key].importe =  this.getImporte(key)
        }
        if (name !== 'mensajes' && name !== 'desperdicio')
            if (presupuesto.conceptos[key][name] !== form.conceptos[key][name]) {
                form.conceptos[key].mensajes.active = true
            } else {
                form.conceptos[key].mensajes.active = false
            }
        if (name === 'desperdicio')
            if (presupuesto.conceptos[key][name].toString() !== form.conceptos[key][name].toString()) {
                form.conceptos[key].mensajes.active = true
                form.conceptos[key].mensajes.mensaje = ('Actualización del desperdicio a un ' + value + '%').toUpperCase()
            } else {
                form.conceptos[key].mensajes.active = false
                form.conceptos[key].mensajes.mensaje = ''
            }
        this.setState({
            ...this.state,
            form
        })
    }

    handleChangeCreateMSelect = (newValue) => {
        const { form } = this.state
        if(newValue == null){
            newValue = []
        }
        let currentValue = []
        newValue.forEach(valor => {
            currentValue.push({
                value: valor.value,
                label: valor.label,
                id:valor.id
            })
            return ''
        })
        form.correos = currentValue
        this.setState({...this.state, form })
    };

    getCantidad(key){
        const { form } = this.state
        let cantidad = (form.conceptos[key].cantidad_preliminar * (1 + (form.conceptos[key].desperdicio / 100))).toFixed(2)
        return cantidad
    }
    getImporte(key){
        const { form } = this.state
        let importe = (this.getCantidad(key) * form.conceptos[key].costo).toFixed(2)
        return importe
    }
    checkButton = (key, e) => {
        const { name, checked } = e.target
        const { form /*, presupuesto*/ } = this.state
        form.conceptos[key][name] = checked
        if(name === 'vicio_oculto'){
            if(form.conceptos[key].vicio_oculto){ form.conceptos[key].importe = (0).toFixed(2) }
            else{ form.conceptos[key].importe = this.getImporte(key) }
        }
        // if (!checked) {
        //     let pre = presupuesto.conceptos[key]
        //     let aux = { active: false, mensaje: '' }
        //     this.onChange(key, { target: { value: pre.descripcion } }, 'descripcion')
        //     this.onChange(key, { target: { value: pre.costo } }, 'costo')
        //     this.onChange(key, { target: { value: pre.cantidad_preliminar } }, 'cantidad_preliminar')
        //     this.onChange(key, { target: { value: '$' + pre.desperdicio } }, 'desperdicio')
        //     this.onChange(key, { target: { value: aux } }, 'mensajes')
        // }
        this.setState({ ...this.state, form })
    }
    onSubmit = e => {
        e.preventDefault()
        waitAlert()
        this.updatePresupuestosAxios()
    }
    onSubmitConcept = e => {
        e.preventDefault()
        const { key, form } = this.state
        waitAlert()
        if (key === 'nuevo')
            this.addConceptoAxios()
        else {
            let aux = []
            form.conceptosNuevos.map((concepto) => {
                if (concepto.active)
                    aux.push(concepto)
                return false
            })
            this.addConceptoToPresupuestoAxios(aux)
        }
    }

    controlledTab = value => {
        this.setState({
            ...this.state,
            form: this.clearForm(),
            key: value
        })
    }
    save = () => {
        const { form } = this.state
        const { save } = this.props
        let auxObject = {}
        let aux = Object.keys(form)
        aux.map((element) => {
            auxObject[element] = form[element]
            return false
        })
        save({
            form: auxObject,
            page: 'presupuesto/presupuesto/update'
        })
    }
    recover = () => {
        const { formulario, deleteForm } = this.props
        this.setState({
            ...this.state,
            form: formulario.form
        })
        deleteForm()
    }
    showStatusPresupuestos= (presupuesto) => {
        let auxiliar = '';
        if (presupuesto) {
            if (presupuesto.estatus)
                switch (presupuesto.estatus.estatus) {
                    case 'Conceptos':
                        auxiliar = { conceptos: true, volumetrias: false, costos: false, revision: false, utilidad: false, espera: false, aceptado: false, rechazado: false };
                        break;
                    case 'Volumetrías':
                        auxiliar = { conceptos: true, volumetrias: true, costos: false, revision: false, utilidad: false, espera: false, aceptado: false, rechazado: false };
                        break;
                    case 'Costos':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: false, utilidad: false, espera: false, aceptado: false, rechazado: false };
                        break;
                    case 'En revisión':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: true, utilidad: false, espera: false, aceptado: false, rechazado: false };
                        break;
                    case 'Utilidad':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: true, utilidad: true, espera: false, aceptado: false, rechazado: false };
                        break;
                    case 'En espera':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: true, utilidad: true, espera: true, aceptado: false, rechazado: false };
                        break;
                    case 'Aceptado':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: true, utilidad: true, espera: true, aceptado: true, rechazado: false };
                        break;
                    case 'Rechazado':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: true, utilidad: true, espera: true, aceptado: false, rechazado: true };
                        break;
                    default:
                        break;
                }
        }
        this.setState({
            ...this.state,
            aux_presupuestos: auxiliar
        })
    }

    openModalSendToClient = adj => { 
        this.setState({ ...this.state, modal_mail: true, adjunto: adj, modal_adjuntos: false }) 
    }
    handleCloseMail = () => { 
        
        this.setState({ ...this.state, modal_mail: false, adjunto: null })  
    }

    openModalDownloadPDF = () => {
        this.setState({ ...this.state, modal_adjuntos:true })
    }
    handleCloseModalDownloadPDF = () => {
        this.setState({ ...this.state, modal_adjuntos:false })
    }

    render() {
        const { form, title, options, formeditado, presupuesto, modal, data, key, aux_presupuestos, modal_adjuntos, adjunto, modal_mail  } = this.state;
        const { formulario } = this.props
        return (
            <Layout active={"presupuesto"} {...this.props}>
                <ActualizarPresupuestoForm formeditado = { formeditado } form = { form } onChange = { this.onChange } checkButton = { this.checkButton }
                    onSubmit = { this.onSubmit } presupuesto = { presupuesto } openModal = { this.openModal } showInputsCalidad = { false }
                    options = { options } modulo_calidad = { false } aux_presupuestos = { aux_presupuestos }
                    historialPresupuestos = { this.openModalDownloadPDF } {...this.props} /> 
                <Modal size="xl" title={title} show={modal} handleClose={this.handleClose}>
                    <AgregarConcepto
                        options={options}
                        formeditado={formeditado}
                        form={form}
                        onChange={this.onChangeConceptos}
                        setOptions={this.setOptions}
                        checkButtonConceptos={this.checkButtonConceptos}
                        data={data}
                        onSelect={this.controlledTab}
                        activeKey={key}
                        onSubmit={this.onSubmitConcept}
                    />
                </Modal>
                <FloatBtnPresupuesto
                    save={this.onSubmit}
                    saveTempData={this.save}
                    recover={this.recover}
                    formulario={formulario}
                    url={'presupuesto/presupuesto/update'}
                />
                <Modal show={modal_adjuntos} handleClose={this.handleCloseModalDownloadPDF} title="Historial de presupuestos" >
                    <PresupuestoTable datos = { presupuesto.pdfs } presupuesto = { presupuesto } sendClient = { this.openModalSendToClient }/>
                </Modal>
                <ModalSendMail header = '¿Deseas enviar el presupuesto?' show = { modal_mail } handleClose = { this.handleCloseMail }
                    validation = { true } url = { adjunto ? adjunto.url : '' } url_text = 'EL PRESUPUESTO' sendMail = { this.sendPresupuestoToClient } >
                    <div className="col-md-11 mt-5">
                        <div>
                            <CreatableMultiselectGray placeholder = 'SELECCIONA/AGREGA EL O LOS CORREOS' iconclass = 'flaticon-email'
                                requirevalidation = { 1 } messageinc = 'Selecciona el o los correos' uppercase = { false }
                                onChange = { this.handleChangeCreateMSelect } options = { options.correos } elementoactual = { form.correos } />
                        </div>
                    </div>
                </ModalSendMail>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser, formulario: state.formulario } }
const mapDispatchToProps = dispatch => ({ save: payload => dispatch(save(payload)), deleteForm: () => dispatch(deleteForm()), })

export default connect(mapStateToProps, mapDispatchToProps)(ActualizarPresupuesto);