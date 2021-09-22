import React, { Component } from 'react'
import axios from "axios"
import Swal from 'sweetalert2'
import { URL_DEV } from "../../../../constants"
import { setSingleHeader } from '../../../../functions/routers'
import { DropdownButton, Dropdown, Card, Form } from 'react-bootstrap'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert, questionAlert2, questionAlertY } from '../../../../functions/alert'
import { setNaviIcon, setOptions } from '../../../../functions/setters'
import { PresupuestoList } from "../..";
import { PresupuestoForm, ActualizarPresupuestoForm, AgregarConcepto } from "../../../../components/forms"
import { Modal } from '../../../../components/singles'
class PresupuestosProyecto extends Component {
    state = {
        key: 'nuevo',
        navPresupuesto: 'add',
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
                    vicio_oculto:false
                }],
                conceptosNuevos: []
            },
        },
        options: {
            areas: [],
            partidas: [],
            subpartidas: [],
        },
        data: { partidas: [],subpartidas: [], conceptos: [] /*, mantenimientos: [], adjuntos: []*/ },
        presupuesto: '',
        aux_presupuestos: { conceptos: false, volumetrias: false, costos: false, revision:false, utilidad: false, espera: false, aceptado: false, rechazado: false },
        modal: { conceptos: false },
    }

    navPresupuesto = (type) => { this.setState({ ...this.state, navPresupuesto: type }) }

    componentDidMount() { this.getOptionsAxios(); }
    
    setOptions = (name, array) => {
        const { options } = this.state;
        options[name] = setOptions(array, "nombre", "id");
        this.setState({ ...this.state, options });
    };

    async getOptionsAxios() {
        waitAlert();
        const { at } = this.props;
        await axios.get(`${URL_DEV}presupuestos/options`, { headers: setSingleHeader(at) }).then(
            (response) => {
                Swal.close();
                const { areas, partidas, conceptos, unidades, proveedores } = response.data;
                const { options, data, form } = this.state;
                data.partidas = partidas
                let aux = {}
                conceptos.map((concepto) => {
                    return aux[concepto.clave] = false
                })
                form.conceptos = aux;
                options.areas = setOptions(areas, "nombre", "id")
                options.partidas = setOptions(partidas, "nombre", "id")
                options.unidades = setOptions(unidades, 'nombre', 'id')
                options.proveedores = setOptions(proveedores, "razon_social", "id")
                this.setState({
                    ...this.state,
                    options,
                });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        )
        .catch((error) => {
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
                questionAlertY(`¿Deseas enviar a compras?`, 'Enviarás a compras tus volumetrías para la estimación de costos', () => this.patchPresupuesto('estatus', 'Costos'))
                break;
            // case 'enviar_finanzas':
            //     questionAlertY(`¿Deseas enviar a finanzas?`, 'Enviarás a finanzas el presupuesto preeliminar para el cálculo de utilidad', 
            //         () => this.patchPresupuesto('estatus', 'Utilidad'))
            //     break;
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
                this.updatePresupuestoAxios()
                break;
            case 'vicio-oculto':
                this.updatePresupuestoAxios()
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
    async addPresupuestosAxios() {
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
        waitAlert()
        const { at } = this.props
        await axios.get(`${URL_DEV}presupuestos/${id}`, { headers: setSingleHeader(at) }).then(
            (response) => {
                Swal.close()
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
                        vicio_oculto:concepto.vicio_oculto ? true : false
                    })
                })
                form.preeliminar.conceptos = aux
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
        if (name === 'desperdicio')
            if (presupuesto.conceptos[key][name].toString() !== valor[key][name].toString()) {
                valor[key].mensajes.active = true
                valor[key].mensajes.mensaje = ('Actualización del desperdicio a un ' + value + '%').toUpperCase()
            } else {
                valor[key].mensajes.active = false
                valor[key].mensajes.mensaje = ''
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
    updatePresupuestoAxios = async() => {
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
                            doneAlert('Presupuesto actualizado con éxito',
                                () => questionAlertY(`¡Listo!`,
                                    `${presupuesto.estatus.estatus === 'En revisión' ? '¿Deseas enviar a finanzas el presupuesto preeliminar?'
                                        : '¿Deseas enviar a compras tus volumetrías para la estimación de costos?'}`,
                                    () => this.patchPresupuesto('estatus', presupuesto.estatus.estatus === 'En revisión' ? 'Utilidad' : 'Costos'),
                                    // () => this.getPresupuestoAxios(presupuesto.id)
                                )
                            )
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
    /* -------------------------------------------------------------------------- */
    /*                                CLEAR MODALS                               */
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
                    title = 'Agregar presupuesto'
                }
                break;
            case 'historial':
                title = 'HISTORIAL DE PRESUPUESTOS'
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

    isGarantia = () => {
        const { data } = this.state
        if(data){
            if(data.subarea){
                if(data.subarea.nombre === 'VICIOS OCULTOS'){
                    return true
                }
            }
        }
        return false
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

    render() {
        const { navPresupuesto, form, title, options, formeditado, data, presupuesto, aux_presupuestos, modal, key } = this.state
        const { proyecto, at } = this.props
        return (
            <>
                <Card className={`card-custom ${navPresupuesto !== 'historial'?'shadow-none bg-transparent':'gutter-b'}`}>
                    <Card.Header className={`border-0 align-items-center pt-6 pt-md-0 ${navPresupuesto !== 'historial'?'px-0':''}`}>
                        <div className="font-weight-bold font-size-h4 text-dark">{this.cardTitlePresupuesto(navPresupuesto)}</div>
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
                                    navPresupuesto === 'add' ?
                                        <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => { this.navPresupuesto('historial') }}>
                                            {setNaviIcon('las la-file-invoice-dollar icon-xl', 'HISTORIAL DE PRESUPUESTOS')}
                                        </Dropdown.Item>
                                        : <></>
                                }
                            </DropdownButton>
                        </div>
                    </Card.Header>
                    {
                        navPresupuesto === 'historial' ?
                                <Card.Body>
                                    <PresupuestoList proyecto={proyecto} at = { at } editPresupuesto = { this.editPresupuesto } />
                                </Card.Body>
                            : <></>
                    }
                </Card>
                {
                    navPresupuesto === 'add' ?
                        presupuesto === '' ?
                            <PresupuestoForm
                                formeditado={formeditado}
                                title={title}
                                form={form.presupuesto}
                                onChange={this.onChangePresupuesto}
                                checkButton={this.checkButtonPresupuesto}
                                options={options}
                                setOptions={this.setOptions}
                                onSubmit={(e) => { this.onSubmit('presupuesto') }}
                                data={data}
                                showFormProyecto={true}
                            />
                        : presupuesto.estatus.estatus !== 'En espera' && presupuesto.estatus.estatus !== 'Aceptado' && presupuesto.estatus.estatus !== 'Rechazado' ?
                            <ActualizarPresupuestoForm
                                showInputsProyecto={true}
                                form={form.preeliminar}
                                options={options}
                                presupuesto={presupuesto}
                                onChange={this.onChangePreeliminar}
                                formeditado={1}
                                checkButton={this.checkButtonPreeliminar}
                                onSubmit={(e) => { this.onSubmit(this.isGarantia() ? 'vicio-oculto' : 'preeliminar') }}
                                openModal={this.openModalConceptos}
                                isButtonEnabled={this.isButtonEnabled()}
                                modulo_proyectos={true} 
                                aux_presupuestos={aux_presupuestos}
                                // historialPresupuestos={historialPresupuestos}
                            >
                                {/* {
                                    presupuesto.estatus.estatus === 'En revisión' && !this.isGarantia() ?
                                        this.calcularCantidades() ?
                                            <button type="button" className="btn btn-sm btn-light-primary font-weight-bolder font-size-13px mr-2"
                                                onClick={(e) => { e.preventDefault(); onClick('enviar_finanzas'); }} >
                                                GUARDAR Y ENVIAR A FINANZAS
                                            </button>
                                            : <></>
                                        : <></>
                                } */}
                                {
                                    (presupuesto.estatus.estatus === 'Conceptos' || presupuesto.estatus.estatus === 'Volumetrías') && !this.isGarantia() ?
                                        this.calcularCantidades() ?
                                            <button type="button" className="btn btn-sm btn-light-success font-weight-bolder font-size-13px mr-2 mb-4 mb-md-0"
                                                onClick={(e) => { e.preventDefault(); this.onClick('enviar_compras'); }} >
                                                ENVIAR A COTIZAR
                                            </button>
                                        : <></>
                                    : <></>
                                }
                            </ActualizarPresupuestoForm>
                        : <></>
                    : <></>
                }
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
            </>
        )
    }
}

export default PresupuestosProyecto