import React, { Component } from 'react'
import axios from "axios"
import Swal from 'sweetalert2'
import { URL_DEV } from "../../../../constants"
import { setSingleHeader } from '../../../../functions/routers'
import { DropdownButton, Dropdown, Card } from 'react-bootstrap'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert} from '../../../../functions/alert'
import { setNaviIcon, setOptions } from '../../../../functions/setters'
import { PresupuestoList } from "../..";
import { PresupuestoForm, ActualizarPresupuestoForm } from "../../../../components/forms"
class PresupuestosProyecto extends Component {
    state = {
        navPresupuesto: 'add',
        formeditado: 0,
        title: "Nuevo presupuesto",
        titleCard:'',
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
        aux_estatus: { espera: false, revision: false, rechazado: false, aceptado: false, aprobacion: false, proceso: false, pendiente:false, terminado: false },
        aux_presupuestos: { conceptos: false, volumetrias: false, costos: false, revision:false, utilidad: false, espera: false, aceptado: false, rechazado: false },
    }

    navPresupuesto = (type) => { this.setState({ ...this.state, navPresupuesto: type }) }

    componentDidMount() { this.getOptionsAxios(); }
    
    setOptions = (name, array) => {
        const { options } = this.state;
        options[name] = setOptions(array, "nombre", "id");
        this.setState({ ...this.state, options, });
    };

    async getOptionsAxios() {
        waitAlert();
        const { at } = this.props;
        await axios.get(`${URL_DEV}presupuestos/options`, { headers: setSingleHeader(at) }).then(
            (response) => {
                Swal.close();
                const { areas, partidas, conceptos, unidades } = response.data;
                const { options, data, form } = this.state;
                data.partidas = partidas
                let aux = {}
                conceptos.map((concepto) => {
                    return aux[concepto.clave] = false
                })
                form.conceptos = aux;
                options.areas = setOptions(areas, "nombre", "id");
                options.partidas = setOptions(partidas, "nombre", "id");
                options.unidades = setOptions(unidades, 'nombre', 'id')
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
    
    /* -------------------------------------------------------------------------- */
    /*                                ADD PRESUPUESTO                             */
    /* -------------------------------------------------------------------------- */
    onChange = (e) => {
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
    checkButton = e => {
        const { name, checked } = e.target
        const { form } = this.state
        form.presupuesto.conceptos[name] = checked
        this.setState({
            ...this.state,
            form
        })
    }

    onSubmit = type => {
        waitAlert()
        switch(type){
            case 'presupuesto':
                this.addPresupuestosAxios()
                break;
            // case 'preeliminar':
            //     this.updatePresupuestoAxios()
            //     break;
            // case 'vicio-oculto':
            //     this.updatePresupuestoAxios()
            //     break;
            default: break;
        }
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

    render() {
        const { navPresupuesto, form, title, titleCard, options, formeditado, data, presupuesto, aux_presupuestos } = this.state
        const { proyecto, at } = this.props
        console.log(presupuesto, 'presupuesto')
        return (
            <div>
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
                                    <PresupuestoList proyecto={proyecto} at = { at }/>
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
                                onChange={this.onChange}
                                checkButton={this.checkButton}
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
                                // onChange={this.onChangePreeliminar}
                                formeditado={1}
                                // checkButton={this.checkButtonPreeliminar}
                                onSubmit={(e) => { this.onSubmit(this.isGarantia() ? 'vicio-oculto' : 'preeliminar') }}
                                // openModal={openModalConceptos}
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
                                }
                                {
                                    (presupuesto.estatus.estatus === 'Conceptos' || presupuesto.estatus.estatus === 'Volumetrías') && !this.isGarantia() ?
                                        this.calcularCantidades() ?
                                            <button type="button" className="btn btn-sm btn-light-success font-weight-bolder font-size-13px mr-2"
                                                onClick={(e) => { e.preventDefault(); onClick('enviar_compras'); }} >
                                                ENVIAR A COTIZAR
                                            </button>
                                        : <></>
                                    : <></>
                                } */}
                            </ActualizarPresupuestoForm>
                        : <></>
                    : <></>
                }
            </div>
        )
    }
}

export default PresupuestosProyecto