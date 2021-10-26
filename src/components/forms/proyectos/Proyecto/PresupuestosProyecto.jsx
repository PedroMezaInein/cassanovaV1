import React, { Component } from 'react'
import { connect } from "react-redux"
import axios from "axios"
import Swal from 'sweetalert2'
import { PresupuestoList } from '../..'
import { URL_DEV } from '../../../../constants'
import { Budget } from '../../../../components/Lottie/'
import { setSingleHeader } from '../../../../functions/routers'
import { CreatableMultiselectGray } from '../../../form-components'
import { Modal, ModalSendMail } from '../../../../components/singles'
import { DropdownButton, Dropdown, Card, Form } from 'react-bootstrap'
import { setNaviIcon, setOptions } from '../../../../functions/setters'
import { save, deleteForm } from '../../../../redux/reducers/formulario'
import FloatBtnPresupuesto from '../../../FloatButtons/FloatBtnPresupuesto'
import PresupuestoTable from '../../../tables/Presupuestos/PresupuestoTable'
import { PresupuestoForm, ActualizarPresupuestoForm, AgregarConcepto, FilterPresupuestos } from '../../../../components/forms'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert, questionAlert2, questionAlertY } from '../../../../functions/alert'

class PresupuestosProyecto extends Component {

    state = {
        key: 'nuevo',
        navPresupuesto: '',
        formeditado: 0,
        title: "Nuevo presupuesto",
        form: {
            presupuesto: { area: "", tiempo_ejecucion: "", partida: "", subpartida: "", conceptos: {} },
            conceptos:[{ area: '', subarea: '', descripcion: '', notas:'' }],
            preeliminar: {
                conceptos: [{
                    unidad: '',
                    descipcion: '',
                    costo: '',
                    cantidad_preliminar: 0,
                    desperdicio: '',
                    active: true,
                    cantidad: 0,
                    importe: 0,
                    id: '',
                    mensajes: { active: false, mensaje: '' },
                    unidad_id:'',
                    bg_cantidad:true,
                    bg_desperdicio:true,
                    vicio_oculto:false
                }],
                conceptosNuevos: []
            },
            correos: []
        },
        options: {
            areas: [],
            partidas: [],
            subpartidas: [],
            unidades:[],
            correos: []
        },
        data: { partidas: [],subpartidas: [], conceptos: [] /*, mantenimientos: [], adjuntos: []*/ },
        presupuesto: '',
        aux_presupuestos: { conceptos: false, volumetrias: false, costos: false, revision:false, utilidad: false, espera: false, aceptado: false, rechazado: false },
        modal: { conceptos: false, filter:false, presupuestos: false, email: false },
        presupuestos: [],
        filtering: {}
    }

    componentDidMount() { 
        const { presupuestoId, proyecto } = this.props
        const { options } = this.state
        options.correos = []
        proyecto.contactos.forEach(contacto => {
            options.correos.push({
                value: contacto.correo.toLowerCase(),
                label: contacto.correo.toLowerCase(),
                id: contacto.id.toString()
            })
        })
        this.setState({options})
        if(presupuestoId){ this.setState({...this.state, navPresupuesto: 'add'}) }
        this.getOptionsAxios();
        this.getPresupuestos()
    }

    componentDidUpdate = (prev) => {
        const { isActive } = this.props
        const { isActive: prevActive } = prev
        if(isActive && !prevActive){
            this.setState({ ...this.state, filtering: {} })
            this.getPresupuestos({});
        }
    }

    navPresupuesto = (type) => { 
        const { filtering } = this.state
        if(this.navPresupuesto === 'historial'){
            this.getPresupuestos(filtering)
        }   
        this.setState({ ...this.state, navPresupuesto: type }) 
    }

    sendPresupuestoToClient = async() => {
        waitAlert()
        const { adjunto, presupuesto, form } = this.state
        const { at } = this.props
        let aux = {
            presupuestoAdjunto: adjunto,
            correos_presupuesto: []
        }
        form.correos.forEach((correo) => { aux.correos_presupuesto.push(correo.label) })
        await axios.post(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/correo`, aux, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { modal } = this.state
                modal.email = false
                this.setState({ ...this.state, modal, adjunto: null })
                doneAlert(
                    `Presupuesto enviado con éxito`,
                    () => { this.getPresupuestoAxios(presupuesto.id); this.openModalHistorialPdfs(); }
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    getPresupuestos = async(filtering) => {
        const { at, proyecto } = this.props
        let { navPresupuesto } = this.state
        // waitAlert()
        await axios.put(`${URL_DEV}v3/proyectos/proyectos/${proyecto.id}/presupuestos`, {filters: filtering}, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { presupuestos } = response.data
                Swal.close()
                const { presupuestoId } = this.props
                if(!presupuestoId){
                    if(presupuestos.length === 0){
                        if(filtering !== {}){
                            navPresupuesto = 'historial'
                        }else{
                            navPresupuesto = 'add'
                        }
                        navPresupuesto = 'add'
                    }else{
                        navPresupuesto = 'historial'
                    }
                }else{
                    navPresupuesto = 'add'
                }
                this.setState({ ...this.state, presupuestos: presupuestos, navPresupuesto })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    setOptions = (name, array) => {
        const { options } = this.state;
        options[name] = setOptions(array, "nombre", "id");
        this.setState({ ...this.state, options });
    };

    getOptionsAxios = async() => {
        // waitAlert();
        const { at } = this.props;
        await axios.get(`${URL_DEV}presupuestos/options`, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { areas, partidas, conceptos, unidades, proveedores } = response.data;
                const { options, data, form } = this.state;
                const { presupuestoId } = this.props
                data.partidas = partidas
                let aux = {}
                conceptos.map((concepto) => { return aux[concepto.clave] = false })
                form.conceptos = aux;
                aux = setOptions(areas, "nombre", "id")
                options.areas = []
                aux.forEach((element) => {
                    if(element.name !== 'FASE 3' && element.name !== 'DEVOLUCION'){
                        options.areas.push(element)
                    }
                })
                options.partidas = setOptions(partidas, "nombre", "id")
                options.unidades = setOptions(unidades, 'nombre', 'id')
                options.proveedores = setOptions(proveedores, "razon_social", "id")
                Swal.close();
                if(presupuestoId){
                    // waitAlert()
                    this.getPresupuestoAxios(presupuestoId)
                }
                this.setState({ ...this.state, options });
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert("Ocurrió un error desconocido catch, intenta de nuevo.");
            console.error(error, "error");
        });
    }

    onChange = (value, tipo, formulario) => {
        const { form } = this.state
        form[formulario][tipo] = value
        this.setState({...this.state, form})
    }
    /* -------------------------------------------------------------------------- */
    /*                             ONCLICK PRESUPUESTO                            */
    /* -------------------------------------------------------------------------- */
    onClick = (type, aux) => {
        switch(type){
            case 'enviar_compras':
                questionAlertY(`¿Deseas enviar a compras?`, 
                    'Enviarás a compras tus volumetrías para la estimación de costos', 
                    () => this.updatePresupuestoAxios(false))
                break;
            case 'enviar_finanzas':
                questionAlertY(`¿Deseas enviar a finanzas?`, 'Enviarás a finanzas el presupuesto preeliminar para el cálculo de utilidad', 
                    () => this.patchPresupuesto('estatus', 'Utilidad'))
                break;
            default: break;
        }
    }
    /* -------------------------------------------------------------------------- */
    /*                             ONSUBMIT PRESUPUESTO                           */
    /* -------------------------------------------------------------------------- */
    onSubmit = type => {
        waitAlert()
        switch(type){
            case 'presupuesto':
                this.addPresupuestosAxios()
                break;
            case 'preeliminar':
                this.updatePresupuestoAxios(true)
                break;
            case 'vicio-oculto':
                this.updatePresupuestoAxios(true)
                break;
            default: break;
        }
    }
    /* -------------------------------------------------------------------------- */
    /*                                ADD PRESUPUESTO                             */
    /* -------------------------------------------------------------------------- */
    onChangePresupuesto = (e) => {
        const { name, value } = e.target;
        const { data, form } = this.state
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
                break;
            default:
                break;
        }
        form.presupuesto[name] = value;
        this.setState({
            ...this.state,
            form,
            data
        });
    };
    checkButtonPresupuesto = e => {
        const { name, checked } = e.target
        const { form } = this.state
        form.presupuesto.conceptos[name] = checked
        this.setState({
            ...this.state,
            form
        })
    }
    addPresupuestosAxios = async() => {
        const { at, proyecto } = this.props
        const { form } = this.state
        form.presupuesto.proyecto = proyecto.id
        form.presupuesto.empresa = proyecto.empresa.id
        await axios.post(`${URL_DEV}presupuestos`, form.presupuesto, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { presupuesto } = response.data
                this.getPresupuestoAxios(presupuesto.id)
                doneAlert(`El presupuesto fue registrado con éxito.`)
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    /* -------------------------------------------------------------------------- */
    /*                             UPDATE PRESUPUESTO                             */
    /* -------------------------------------------------------------------------- */
    getPresupuestoAxios = async (id, conceptosNuevos) => {
        // waitAlert()
        const { at } = this.props
        await axios.get(`${URL_DEV}presupuestos/${id}`, { headers: setSingleHeader(at) }).then(
            (response) => {
                
                const { presupuesto } = response.data
                const { form } = this.state
                let aux = []
                if(presupuesto.conceptos.length === 0){
                    form.conceptos = [{area: '', subarea: '', descripcion: ''}]
                }else{ form.conceptos = [] }
                presupuesto.conceptos.forEach((concepto) => {
                    let objeto = { area: '', subarea: '', descripcion: ''}
                    objeto.descripcion = concepto.descripcion
                    objeto.concepto = concepto
                    if(concepto.concepto)
                        if(concepto.concepto.subpartida)
                            if(concepto.concepto.subpartida.partida)
                                if(concepto.concepto.subpartida.partida.areas)
                                    if(concepto.concepto.subpartida.partida.areas.length){
                                        if(concepto.concepto.subpartida.partida.areas.length === 1)
                                            objeto.area = concepto.concepto.subpartida.partida.areas[0].id.toString()
                                    }
                    form.conceptos.push(objeto)
                    let active = false
                    if (conceptosNuevos !== undefined){
                        conceptosNuevos.forEach((conceptoNuevo) => {
                            if(conceptoNuevo.id === concepto.concepto.id) {
                                active = true
                            }
                        })
                    }
                    aux.push({
                        active: concepto.active,
                        descripcion: concepto.descripcion,
                        cantidad_preliminar: concepto.cantidad_preliminar,
                        desperdicio: concepto.desperdicio,
                        cantidad: concepto.cantidad,
                        mensajes: {
                            active: active ? true : concepto.mensaje ? true : false,
                            mensaje: concepto.mensaje
                        },
                        id: concepto.id,
                        costo: concepto.costo,
                        importe: concepto.importe,
                        unidad: concepto.unidad ? concepto.unidad.nombre : '',
                        unidad_id: concepto.unidad ? concepto.unidad.id.toString() : '',
                        bg_cantidad:true,
                        bg_desperdicio:true,
                        vicio_oculto:concepto.vicio_oculto ? true : false
                    })
                })
                form.preeliminar.conceptos = aux
                Swal.close()
                this.showStatusPresupuestos(presupuesto)
                this.setState({ ...this.state, presupuesto: presupuesto, form, formeditado: 1 })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    onChangePreeliminar = (key, e, name) => {
        let { value } = e.target
        const { form, presupuesto } = this.state
        let valor = form.preeliminar.conceptos
        if (name === 'desperdicio') { value = value.replace('%', '') }
        if (name === 'cantidad_preliminar'){
            if (presupuesto.conceptos[key][name].toString() !== value) {
                valor[key]['bg_cantidad'] = false
            }else{
                valor[key]['bg_cantidad'] = true
            }
        }
        valor[key][name] = value
        valor[key].cantidad = this.getCantidad(key, valor)

        if(valor[key].vicio_oculto){
            valor[key].importe = (0).toFixed(2)
        }else{
            valor[key].importe = this.getImporte(key, valor)
        }
        if (name !== 'mensajes' && name !== 'desperdicio')
            if (presupuesto.conceptos[key][name] !== valor[key][name]) {
                valor[key].mensajes.active = true
            } else {
                valor[key].mensajes.active = false
            }
        if (name === 'desperdicio'){
            if (presupuesto.conceptos[key][name].toString() !== valor[key][name].toString()) {
                valor[key].mensajes.active = true
                valor[key].mensajes.mensaje = ('Actualización del desperdicio a un ' + value + '%').toUpperCase()
                valor[key]['bg_desperdicio'] = false
            } else {
                valor[key].mensajes.active = false
                valor[key].mensajes.mensaje = ''
                valor[key]['bg_desperdicio'] = true
            }
        }
        this.onChange(valor, 'conceptos', 'preeliminar')
    }
    checkButtonPreeliminar = (key, e) => {
        const { name, checked } = e.target
        const { form } = this.state
        let valor = form.preeliminar.conceptos
        valor[key][name] = checked ? 1 : 0
        if(name === 'vicio_oculto'){
            if(valor[key].vicio_oculto){
                valor[key].importe = (0).toFixed(2)
            }else{
                valor[key].importe = this.getImporte(key, valor)
            }
        }
        this.onChange(valor, 'conceptos', 'preeliminar')
    }
    updatePresupuestoAxios = async(flag) => {
        const { at } = this.props
        const { form, presupuesto } = this.state
        await axios.put(`${URL_DEV}presupuestos/${presupuesto.id}`, form.preeliminar, { headers: setSingleHeader(at) }).then(
            (response) => {
                if (presupuesto.estatus) {
                    switch (presupuesto.estatus.estatus) {
                        case 'En revisión':
                            questionAlert2(
                                '¿DÓNDE DESEAS ENVIAR EL PRESUPUESTO?',
                                'Si aún no deseas enviar, solamente cierra',
                                () => { this.onSubmitUpdatePresupueso() },
                                <form id='updatePresupuestoForm' name='updatePresupuestoForm' >
                                    <Form.Check inline type="radio" label="COMPRAS" name="sendPresupuesto" className="px-0 mb-2" value='costos' />
                                    <Form.Check inline type="radio" label="FINANZAS" name="sendPresupuesto" className="px-0 mb-2" value='finanzas' />
                                </form>,
                                () => { this.patchPresupuesto('estatus', 'En revisión') }
                            )
                            break;
                        default:
                            if(flag){
                                doneAlert('Presupuesto actualizado con éxito',
                                    () => questionAlertY(`¡Listo!`,
                                        `${presupuesto.estatus.estatus === 'En revisión' ? '¿Deseas enviar a finanzas el presupuesto preeliminar?'
                                            : '¿Deseas enviar a compras tus volumetrías para la estimación de costos?'}`,
                                        () => this.patchPresupuesto('estatus', presupuesto.estatus.estatus === 'En revisión' ? 'Utilidad' : 'Costos'),
                                        () => this.getPresupuestoAxios(presupuesto.id)
                                    )
                                )
                            }else{
                                this.patchPresupuesto('estatus', 'Costos')
                            }
                            break;
                    }
                }
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    onSubmitUpdatePresupueso = async (e) => {
        let valueCheck = document.updatePresupuestoForm.sendPresupuesto.value;
        switch(valueCheck){
            case 'costos':
                this.patchPresupuesto('estatus', 'Costos')
                break;
            case 'finanzas':
                this.patchPresupuesto('estatus', 'Utilidad')
                break;
            default:
                this.patchPresupuesto('estatus', 'En revisión')
                break;
        }
    }
    patchPresupuesto = async(type, value) => {
        const { at } = this.props
        const { presupuesto } = this.state
        waitAlert()
        await axios.patch(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}`, { type: type, value: value }, { headers: setSingleHeader(at) }).then(
            (response) => {
                if(type === 'estatus')
                    doneAlert('Presupuesto actualizado con éxito', () => this.sendCorreoAxios(value))
                else
                    doneAlert('Presupuesto actualizado con éxito', () => this.getPresupuestoAxios(presupuesto.id))
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    sendCorreoAxios = async(value) => {
        const { at } = this.props
        const { presupuesto } = this.state
        waitAlert()
        await axios.get(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/correo?estatus=${value}`, { headers: setSingleHeader(at) }).then(
            (response) => {
                this.getPresupuestoAxios(presupuesto.id)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    /* ---------------------- FORMULARIO CONCEPTOS ---------------------- */
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
                form.preeliminar.conceptosNuevos = []
                array.map((element, key) => {
                    form.preeliminar.conceptosNuevos.push(element)
                    form.preeliminar.conceptosNuevos[key].active = false
                    return false
                })
                break;
            default:
                break;
        }
        form.preeliminar[name] = value;
        this.setState({
            ...this.state,
            form,
            data
        });
    };
    checkButtonConceptos = (e, key) => {
        const { checked } = e.target
        const { form } = this.state
        form.preeliminar.conceptosNuevos[key].active = checked
        this.setState({
            ...this.state,
            form
        })
    }
    onSubmitConcept = e => {
        e.preventDefault()
        const { key, form } = this.state
        waitAlert()
        if (key === 'nuevo')
            this.addConceptoAxios()
        else {
            let aux = []
            form.preeliminar.conceptosNuevos.map((concepto) => {
                if (concepto.active)
                    aux.push(concepto)
                return false
            })
            this.addConceptoToPresupuestoAxios(aux)
        }
    }
    async addConceptoAxios() {
        const { at } = this.props
        const { form } = this.state
        await axios.post(URL_DEV + 'conceptos', form.preeliminar, { headers: { Authorization: `Bearer ${at}` } }).then(
            (response) => {
                const { concepto } = response.data
                this.addConceptoToPresupuestoAxios([concepto])
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async addConceptoToPresupuestoAxios(conceptos) {
        const { at } = this.props
        const { presupuesto } = this.state
        let aux = { conceptos: conceptos }
        await axios.post(URL_DEV + 'presupuestos/' + presupuesto.id + '/conceptos', aux, { headers: { Authorization: `Bearer ${at}` } }).then(
            (response) => {
                const { presupuesto } = response.data
                const { modal } = this.state
                this.getPresupuestoAxios(presupuesto.id, conceptos );
                doneAlert(response.data.message !== undefined ? response.data.message : 'El concepto fue agregado con éxito.')
                modal.conceptos = false
                this.setState({
                    modal
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
    tabModalConceptos = value => {
        this.setState({
            ...this.state,
            form: this.clearModalConceptos(),
            key: value
        })
    }

    /* -------------------------------------------------------------------------- */
    /*                                     MODALS                                 */
    /* -------------------------------------------------------------------------- */
    openModalConceptos = () => {
        const { options, modal } = this.state
        options.subpartidas = []
        modal.conceptos = true
        this.setState({
            ...this.state,
            options,
            modal,
            form: this.clearModalConceptos(),
            formeditado: 0
        })
    }
    handleCloseConceptos = () => {
        const { modal, options } = this.state
        options.subpartidas = []
        modal.conceptos = false
        this.setState({
            ...this.state,
            modal,
            options,
            concepto: '',
            form: this.clearModalConceptos()
        })
    }
    
    openFormFilter = () => {
        const { modal } = this.state
        modal.filter = true
        this.setState({
            ...this.state,
            modal,
            formeditado: 0
        })
    }
    handleCloseFilter = () => {
        const { modal } = this.state
        modal.filter = false
        this.setState({ ...this.state, modal})
    }

    openModalHistorialPdfs = () => {
        const { modal } = this.state
        modal.presupuestos = true
        this.setState({ ...this.state, modal })
    }

    handleCloseModalHistorialPdfs = () => {
        const { modal } = this.state
        modal.presupuestos = false
        this.setState({ ...this.state, modal })
    }

    openModalSendToClient = ( adj ) => {
        const { modal } = this.state
        modal.email = true
        modal.presupuestos = false
        this.setState({ ...this.state, modal, adjunto: adj })
    }

    handleCloseMail = () => {
        const { modal } = this.state
        modal.email = false
        this.setState({ ...this.state, modal, adjunto: null })
    }

    /* -------------------------------------------------------------------------- */
    /*                                 CLEAR MODALS                               */
    /* -------------------------------------------------------------------------- */
    clearModalConceptos = () => {
        const { form } = this.state
        let aux = Object.keys(form.preeliminar)
        aux.map((element) => {
            if (element !== 'conceptos' && element !== 'conceptosNuevos')
            form.preeliminar[element] = ''
            return false
        })
        return form
    }
    /* -------------------------------------------------------------------------- */
    /*                                       DATA                                 */
    /* -------------------------------------------------------------------------- */
    cardTitlePresupuesto = (navPresupuesto) => {
        const { presupuesto } = this.state
        let title = ''
        switch(navPresupuesto){
            case 'add':
                if(presupuesto){
                    if(presupuesto.estatus){
                        switch(presupuesto.estatus.estatus){
                            case 'Conceptos':
                            case 'Volumetrías':
                                title = 'Conceptos y volumetrías'
                                break;
                            case 'Costos':
                                title = 'Estimación de costos'
                                break;
                            case 'Utilidad':
                                title = 'Calculando utilidad'
                                break;
                            case 'En revisión':
                                title = 'En revisión'
                                break;
                            case 'En espera':
                                title = 'En espera del cliente'
                                break;
                            case 'Aceptado':
                                title = 'Presupuesto Aceptado'
                                break;
                            case 'Rechazado':
                                title = 'Presupuesto Rechazado'
                                break;
                            default:
                                break;
                        }
                    }
                }else{
                    title = ''
                }
                break;
            case 'historial':
                title = 'HISTORIAL DE PRESUPUESTOS'
                break;
            default:break;
        }
        return title
    }

    isButtonEnabled = () => {
        const { presupuesto } = this.state
        if( presupuesto ){
            if(presupuesto.estatus)
                switch(presupuesto.estatus.estatus){
                    case 'Conceptos':
                    case 'Volumetrías':
                    case 'En revisión':
                        return true
                    default:
                        return false
                }
            return true
        }
        return true
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
        this.setState({ ...this.state, aux_presupuestos: auxiliar })
    }
    getCantidad(key, valor){
        let cantidad = (valor[key].cantidad_preliminar * (1 + (valor[key].desperdicio / 100))).toFixed(2)
        return cantidad
    }
    getImporte(key, valor){
        let importe = (this.getCantidad(key, valor) * valor[key].costo).toFixed(2)
        return importe
    }
    calcularCantidades = () => {
        const { presupuesto } = this.state
        let suma = 0
        presupuesto.conceptos.forEach((con) => {
            if(con.active)
                suma += con.cantidad
        })
        if(suma)
            return true
        return false
    }

    editPresupuesto = (pres) => {
        this.setState({ ...this.state, navPresupuesto: 'add' })
        this.getPresupuestoAxios(pres.id)
    }

    showForm() {
        const { navPresupuesto, presupuesto } = this.state
        const { presupuestoId } = this.props
        let type = ''
        if (navPresupuesto === 'add') {
            if (presupuestoId) {
                if (presupuesto !== '') {
                    type = 'form'
                }
            } else {
                if (presupuesto !== '') {
                    type = 'form'
                }
            }
        }
        return type
    }
    printActiveNav = () => {
        const { navPresupuesto, form, title, options, formeditado, data, presupuesto, aux_presupuestos } = this.state
        const { presupuestoId } = this.props
        let type = ''
        if(navPresupuesto === 'add'){
            if(presupuestoId){
                if(presupuesto !== ''){
                    type = 'form'
                }
            }else{
                if(presupuesto !== ''){
                    type = 'form'
                }else{
                    type = 'new'
                }
            }
        }else{
            return ''
        }
        switch(type){
            case 'new':
                return(
                    <PresupuestoForm formeditado = { formeditado } title = { title } form = { form.presupuesto } onChange = { this.onChangePresupuesto }
                        checkButton = { this.checkButtonPresupuesto } options = { options } setOptions = { this.setOptions }
                        onSubmit = { (e) => { this.onSubmit('presupuesto') } } data = { data } showFormProyecto = { true } />
                )
            case 'form':
                return(
                    <ActualizarPresupuestoForm showInputsProyecto = { true } form = { form.preeliminar } options = { options } presupuesto = { presupuesto }
                        onChange = { this.onChangePreeliminar } formeditado = { 1 } checkButton = { this.checkButtonPreeliminar }
                        onSubmit = { (e) => { this.onSubmit('preeliminar') } } openModal = { this.openModalConceptos } 
                        isButtonEnabled = { this.isButtonEnabled() } modulo_proyectos = { true } aux_presupuestos = { aux_presupuestos }
                        historialPresupuestos = { this.openModalHistorialPdfs }
                        // historialPresupuestos={historialPresupuestos}
                        >
                        {
                            presupuesto.estatus.estatus === 'En revisión' ?
                                this.calcularCantidades() ?
                                    <button type="button" className="btn btn-sm btn-light-primary font-weight-bolder font-size-13px mr-2"
                                        onClick={(e) => { e.preventDefault(); this.onClick('enviar_finanzas'); }} >
                                        GUARDAR Y ENVIAR A FINANZAS
                                    </button>
                                : <></>
                            : <></>
                        }
                        {
                            (presupuesto.estatus.estatus === 'Conceptos' || presupuesto.estatus.estatus === 'Volumetrías') ?
                                this.calcularCantidades() ?
                                    <button type="button" className="btn btn-sm btn-light-success font-weight-bolder font-size-13px mr-2 mb-4 mb-md-0"
                                        onClick={(e) => { e.preventDefault(); this.onClick('enviar_compras'); }} >
                                        ENVIAR A COTIZAR
                                    </button>
                                : <></>
                            : <></>
                        }
                    </ActualizarPresupuestoForm>
                )
            default:
                return(
                <Card className='card-custom gutter-b'>
                    <Card.Header className='border-0 align-items-center pt-6 pt-md-0'>
                        <div className="font-weight-bold font-size-h4 text-dark">CARGANDO DATOS</div>
                    </Card.Header>
                    <Card.Body><Budget/></Card.Body>
                </Card>
                )
        }
    }
    /* -------------------------------------------------------------------------- */
    /*                           FILTRADO PRESUPUESTOS                            */
    /* -------------------------------------------------------------------------- */
    filterTable = async(form) => {
        waitAlert()
        const { modal } = this.state
        modal.filter = false
        this.setState({ ...this.state, filtering: form, modal })
        this.getPresupuestos(form)
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
    save = () => {
        const { form } = this.state
        const { save, proyecto } = this.props
        let auxObject = {}
        let aux = Object.keys(form.preeliminar)
        aux.map((element) => {
            auxObject[element] = form.preeliminar[element]
            return false
        })
        save({
            form: auxObject,
            page: `/proyectos/proyectos/single/${proyecto.id}`
        })
    }
    recover = () => {
        const { formulario, deleteForm } = this.props
        let { form } = this.state
        form.preeliminar = formulario.form
        this.setState({
            ...this.state,
            form
        })
        deleteForm()
    }
    refreshPresupuestos = () => {
        const { filtering } = this.state
        this.getPresupuestos(filtering)
    }

    render() {
        const { navPresupuesto, form, options, formeditado, data, presupuestos, modal, key, presupuesto, adjunto, filtering } = this.state
        const { proyecto, at, formulario } = this.props
        return (
            <>
                <Card className={`card-custom ${navPresupuesto !== 'historial'?'shadow-none bg-transparent':'gutter-b'}`}>
                    <Card.Header className={`border-0 align-items-center pt-6 pt-md-0 ${navPresupuesto !== 'historial'?'px-0':''}`}>
                        <div className="font-weight-bold font-size-h4 text-dark">{this.cardTitlePresupuesto(navPresupuesto)}</div>
                        {
                            presupuestos.length > 0 || filtering !== {} ?
                                <div className="toolbar-dropdown">
                                    <DropdownButton menualign="right" title={<span className="d-flex">OPCIONES <i className="las la-angle-down icon-md p-0 ml-2"></i></span>}
                                        id={`${navPresupuesto !== 'historial' ? 'dropdown-white' : 'dropdown-proyectos'}`}>
                                        {
                                            navPresupuesto === 'add' ? <></> :
                                                <Dropdown.Item className="text-hover-success dropdown-success" onClick={() => { this.navPresupuesto('add') }}>
                                                    {setNaviIcon('las la-plus icon-xl', 'AGREGAR PRESUPUESTO')}
                                                </Dropdown.Item>
                                        }
                                        {
                                            presupuestos.length > 0 && navPresupuesto === 'add' ?
                                                <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => { this.navPresupuesto('historial') }}>
                                                    {setNaviIcon('las la-file-invoice-dollar icon-xl', 'HISTORIAL DE PRESUPUESTOS')}
                                                </Dropdown.Item>
                                                : <></>
                                        }
                                        {
                                            navPresupuesto === 'historial' ?
                                                <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => { this.openFormFilter('filter') }}>
                                                    {setNaviIcon('las la-filter icon-xl', 'FILTRAR HISTORIAL')}
                                                </Dropdown.Item>
                                            :<></>
                                        }
                                    </DropdownButton>
                                </div>
                                : <></>
                        }
                    </Card.Header>
                    {
                        navPresupuesto === 'historial' ?
                            <Card.Body>
                                <PresupuestoList proyecto={proyecto} at = { at } editPresupuesto = { this.editPresupuesto }
                                    presupuestos = { presupuestos }  refresh = { this.refreshPresupuestos } />
                            </Card.Body>
                        : <></>
                    }
                </Card>
                { this.printActiveNav() }
                <Modal size = "xl" title = 'Agregar concepto' show = { modal.conceptos } handleClose = { this.handleCloseConceptos } >
                    <AgregarConcepto 
                        options = { options }
                        formeditado = { formeditado }
                        form = { form.preeliminar }
                        onChange = { this.onChangeConceptos }
                        setOptions = { this.setOptions }
                        checkButtonConceptos = { this.checkButtonConceptos }
                        data = { data }
                        onSelect = { this.tabModalConceptos }
                        activeKey = { key }
                        onSubmit = { this.onSubmitConcept }
                    />
                </Modal>
                <Modal size = "lg" title = 'Filtrar historial' show = { modal.filter } handleClose = { this.handleCloseFilter} >
                    {
                        modal.filter ?
                            <FilterPresupuestos at={at} filtering = { this.filterTable } filters = { filtering } />
                        : <></>
                    }
                    
                </Modal>
                <Modal show = { modal.presupuestos } handleClose={this.handleCloseModalHistorialPdfs} title="Historial de presupuestos" >
                    <PresupuestoTable datos = { presupuesto.pdfs } sendClient = { this.openModalSendToClient } presupuesto = { presupuesto } />
                </Modal>
                <ModalSendMail header = '¿Deseas enviar el presupuesto?' show = { modal.email } handleClose = { this.handleCloseMail }
                    validation = { true } url = { adjunto ? adjunto.url : '' } url_text = 'EL PRESUPUESTO' sendMail = { this.sendPresupuestoToClient } >
                    <div className="col-md-11 mt-5">
                        <div>
                            <CreatableMultiselectGray placeholder = 'SELECCIONA/AGREGA EL O LOS CORREOS' iconclass = 'flaticon-email'
                                requirevalidation = { 1 } messageinc = 'Selecciona el o los correos' uppercase = { false }
                                onChange = { this.handleChangeCreateMSelect } options = { options.correos } elementoactual = { form.correos } />
                        </div>
                    </div>
                </ModalSendMail>
                {
                    this.isButtonEnabled() !== false && this.showForm() === 'form'?
                        <FloatBtnPresupuesto
                            save = { (e) => { this.onSubmit('preeliminar') } }
                            saveTempData = { this.save }
                            recover = { this.recover }
                            formulario = { formulario }
                            url = {`/proyectos/proyectos/single/${proyecto.id}`}
                        />
                    : <></>
                }
            </>
        )
    }
}

// export default PresupuestosProyecto

const mapStateToProps = state => {
    return {
        authUser: state.authUser,
        formulario: state.formulario
    }
}
const mapDispatchToProps = dispatch => ({
    save: payload => dispatch(save(payload)),
    deleteForm: () => dispatch(deleteForm()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PresupuestosProyecto);