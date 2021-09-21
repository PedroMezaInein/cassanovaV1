import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { Tab, Tabs } from 'react-bootstrap';
import { NewTable } from '../../../components/NewTables';
import { Update } from '../../../components/Lottie';
import { URL_DEV, PROYECTOS_COLUMNS, TEL } from '../../../constants'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { setArrayTableReactDom, setDateTableReactDom, setDireccion, setLabelTableReactDom, setListTable, setTagLabelProyectoReactDom, setTextTableCenter, 
        setTextTableReactDom, setOptions } from '../../../functions/setters';
import { renderToString } from 'react-dom/server';
import { questionAlert, waitAlert, doneAlert, printResponseErrorAlert, errorAlert, customInputAlert, deleteAlert } from '../../../functions/alert';
import axios from 'axios'
import { setSingleHeader } from '../../../functions/routers';
import { printSwalHeader } from '../../../functions/printers';
import $ from 'jquery';
import Swal from 'sweetalert2'
import { InputGray, InputPhoneGray, RangeCalendarSwal, SelectSearchGray } from '../../../components/form-components';
import { Modal } from '../../../components/singles';
import { ProyectoFilter } from '../../../components/filters';

class Proyectos extends Component {

    state = {
        activeTab: 'all',
        form: {
            tipo_proyecto: '',
            fecha_inicio: new Date(),
            fecha_fin: new Date(),
            contacto: '',
            numeroContacto: '',
            nombre: '',
            descripcion: ''
        },
        modal: { filtros: false },
        filtrado: {}
    }

    getProyectosAxios = tab => {
        $(`#proyectos-${tab}`).DataTable().search(JSON.stringify({})).draw();
        this.setState({...this.state, activeTab: tab, filtrado: {}})
    }

    openModalFiltros = () => {
        const { modal } = this.state
        modal.filtros = true
        this.setState({...this.state, modal})
    }

    handleCloseFiltros = () => {
        const { modal } = this.state
        modal.filtros = false
        this.setState({...this.state, modal})
    }

    setName = tab => {
        switch(tab){
            case 'all':
                return 'Todas las Fases';
            case 'fase1':
                return 'Fase 1'
            case 'fase2':
                return 'Fase 2'
            case 'fase3':
                return 'Fase 3'
            default: return '';
        }
    }

    changePageSee = element => {
        const { history } = this.props
        history.push({ pathname: `/proyectos/proyectos/single/${element.id}` });
    }

    setProyectos = (proyectos) => {
        let aux = []
        proyectos.map((proyecto) => {
            aux.push({
                actions: this.setActions(proyecto),
                status: setLabelTableReactDom(proyecto, this.changeEstatus),
                nombre: setTextTableReactDom(proyecto.nombre, this.doubleClick, proyecto, 'nombre', 'text-center'),
                tipo_proyecto: setTextTableReactDom( proyecto.tipo_proyecto ? 
                        proyecto.tipo_proyecto.tipo
                    : 'Sin tipo de proyecto', this.doubleClick, proyecto, 'tipo_proyecto', 'text-center'),
                cliente: setTagLabelProyectoReactDom(proyecto, proyecto.clientes, 'cliente', this.deleteElementAxios, 'empresa'),
                direccion: renderToString(setDireccion(proyecto)),
                contacto: setArrayTableReactDom([
                        { name: 'Nombre', text: proyecto.contacto },
                        { name: 'Teléfono', text: proyecto.numero_contacto, url: `tel:+${proyecto.numero_contacto}` }
                    ],'190px',  this.doubleClick, proyecto, 'contacto' ),
                empresa: renderToString(setTextTableCenter(proyecto.empresa ? proyecto.empresa.name : '')),
                fechaInicio: setDateTableReactDom(proyecto.fecha_inicio, this.doubleClick, proyecto, 'fecha_inicio', 'text-center'),
                fechaFin: proyecto.fecha_fin !== null ?
                        setDateTableReactDom(proyecto.fecha_fin, this.doubleClick, proyecto, 'fecha_fin', 'text-center') 
                    : setTextTableCenter('Sin definir'),
                fases: renderToString( setListTable(this.setFasesList(proyecto), 'text') ),
                descripcion: setTextTableReactDom(proyecto.descripcion !== null ? 
                        proyecto.descripcion 
                    : '', this.doubleClick, proyecto, 'descripcion', 'text-justify min-width-180px'),
            })
            return false
        })
        return aux
    }

    setActions = (element) => {
        return(
            <div className="w-100 d-flex justify-content-center">
                <OverlayTrigger rootClose overlay = { <Tooltip><span className="font-weight-bold">Ver proyecto</span></Tooltip> } >
                    <button className = 'btn btn-icon btn-actions-table btn-xs ml-2 btn-text-info btn-hover-info'
                        onClick = { (e) => { e.preventDefault(); this.changePageSee(element) } }>
                        <i className = 'far fa-eye' />
                    </button>
                </OverlayTrigger>
                <OverlayTrigger rootClose overlay = { <Tooltip>Eliminar</Tooltip> }  >
                    <button className = 'btn btn-icon btn-actions-table btn-xs ml-2 btn-text-danger btn-hover-danger'
                        onClick = { (e) => {
                            e.preventDefault(); 
                            deleteAlert(
                                `Eliminarás el proyecto ${element.nombre}`,
                                `¿Deseas continuar?`,
                                () => { this.deleteProyectoAxios(element.id) }
                            )
                        } }>
                        <i className = 'flaticon2-rubbish-bin' />
                    </button>
                </OverlayTrigger>
            </div>
        )
    }

    setFasesList = proyecto => {
        let aux = [];
        if(proyecto.fase1)
            aux.push({text: 'FASE 1'})
        if(proyecto.fase2)
            aux.push({text: 'FASE 2'})
        if(proyecto.fase3)
            aux.push({text: 'FASE 3'})
        if(proyecto.fase3 === 0 && proyecto.fase2 === 0 && proyecto.fase1=== 0)
            aux.push({text: 'SIN FASES'})
        return aux
    }

    setTabla = (key, tab) => {
        if( key === tab ){
            return(
                <div>
                    <NewTable tableName = {`proyectos-${tab}`} subtitle = 'Listado de proyectos' title = 'Proyectos ' mostrar_boton = { true } 
                        abrir_modal = { false } url = '/calidad/tickets/nuevo-ticket' columns = { PROYECTOS_COLUMNS } 
                        accessToken = { this.props.authUser.access_token } setter = { this.setProyectos } 
                        filterClick = { this.openModalFiltros } exportar_boton = { true } onClickExport = { () => this.exportProyectosAxios() } 
                        pendingPaymentClick = { this.pendingPaymentClick} urlRender={`${URL_DEV}v3/proyectos/proyectos?type=${key}`} />
                </div>
            )
        }
    }

    setOptions = (data, tipo) => {
        switch(tipo){
            case 'tipo_proyecto':
                if(data.empresa)
                    if(data.empresa.tipos)
                        return setOptions(data.empresa.tipos, 'tipo', 'id')
                return []
            default: return []
        }
    }

    setSwalPlaceholder = (tipo) => {
        switch(tipo){
            case 'tipo_proyecto':
                return 'SELECCIONA EL TIPO DE PROYECTO'
            default:
                return ''
        }
    }

    clearForm = () => {
        const { form } = this.state
        form.nombre = ''
        form.tipo_proyecto = ''
        form.contacto = ''
        form.fecha_inicio = new Date()
        form.fecha_fin = new Date()
        form.contacto = ''
        form.descripcion = ''
        form.numeroContacto = ''
        return form
    }

    changeEstatus = (estatus, proyecto) =>  {
        estatus === 'Detenido'?
            questionAlert('¿ESTÁS SEGURO?', 'DETENDRÁS EL PROYECTO ¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios(estatus, proyecto))
        : estatus === 'Terminado' ?
            questionAlert('¿ESTÁS SEGURO?', 'DARÁS POR TEMINADO EL PROYECTO ¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios(estatus, proyecto))
        : 
            questionAlert('¿ESTÁS SEGURO?', 'EL PROYECTO ESTARÁ EN PROCESO ¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios(estatus, proyecto))
    }

    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
            case 'tipo_proyecto':
                console.log(data, tipo)
                if(data[tipo])
                    form[tipo] = data[tipo].id.toString()
                break
            case 'fecha_inicio':
            case 'fecha_fin':
                form.fechaInicio = new Date(data.fecha_inicio)
                form.fechaFin = new Date(data.fecha_fin)
                break
            case 'contacto':
                form.contacto = data.contacto
                form.numeroContacto = data.numero_contacto
                break
            default: //Nombre y descripción
                form[tipo] = data[tipo]
                break
        }
        this.setState({...this.state, form})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) } </h2>
                {
                    tipo === 'nombre' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }
                        />
                }
                {
                    tipo === 'descripcion' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } rows  = { 6 } as = 'textarea'
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }
                        />
                }
                {
                    (tipo === 'fecha_inicio') || (tipo === 'fecha_fin') ?
                        <RangeCalendarSwal onChange = { this.onChangeRange } start = { form.fechaInicio } end = {form.fechaFin } />:<></>
                }
                {
                    tipo === 'tipo_proyecto' &&
                        <SelectSearchGray options = { this.setOptions(data, tipo) } value = { form[tipo] } customdiv="mb-2 mt-7"
                            onChange = { (value) => { this.onChangeSwal(value, tipo)} } name = { tipo } requirevalidation={1} 
                            placeholder={this.setSwalPlaceholder(tipo)} withicon={1}/>
                }
                {
                    tipo === 'contacto' &&
                    <>
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 0 } placeholder="NOMBRE DEL CONTACTO"
                            requirevalidation = { 0 }  value = { form.contacto } name = { 'contacto' } letterCase = { false }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } />
                        <InputPhoneGray withicon={1} iconclass="fas fa-mobile-alt" name="numeroContacto" value={form.numeroContacto} 
                            onChange = { (e) => { this.onChangeSwal(e.target.value, 'numeroContacto')} }
                            patterns={TEL} thousandseparator={false} prefix=''  swal = { true } 
                        />
                    </>
                }
            </div>,
            <Update />,
            () => { this.patchProyectos(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }

    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }

    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({ ...this.state, form })
    }
    
    changeEstatusAxios = async(estatus, proyecto) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}proyectos/${proyecto.id}/estatus`,{estatus: estatus}, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert('Estado actualizado con éxito')
                const { activeTab } = this.state
                this.getProyectosAxios(activeTab)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deleteElementAxios = async(proyecto, element, tipo) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.delete(`${URL_DEV}v2/proyectos/proyectos/${proyecto.id}/${tipo}/${element.id}`, 
            { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { activeTab } = this.state
                this.getProyectosAxios(activeTab)
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    patchProyectos = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = ''
        switch(tipo){
            case 'fecha_inicio':
            case 'fecha_fin':
                value = {
                    fecha_inicio: form.fechaInicio,
                    fecha_fin: form.fechaFin
                }
                break;
            case 'contacto':
                value = { 
                    contacto: form.contacto,
                    numeroContacto: form.numeroContacto
                }
                break
            default:
                value = form[tipo]
                break
        }
        waitAlert()
        await axios.put(`${URL_DEV}v2/proyectos/proyectos/${tipo}/${data.id}`, { value: value }, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { activeTab } = this.state
                this.getProyectosAxios(activeTab)
                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deleteProyectoAxios = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { filtrado } = this.state
        await axios.delete(`${URL_DEV}v3/proyectos/proyectos/${id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                this.onFilter(filtrado)
                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    exportProyectosAxios = async() => {
        const { access_token } = this.props.authUser
        const { filtrado } = this.state
        let filtros = JSON.stringify(filtrado)
        await axios.post(`${URL_DEV}v3/proyectos/proyectos/exportar`, { 'search': filtros }, 
            { responseType:'blob', headers: setSingleHeader(access_token)}).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'proyectos.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(response.data.message !== undefined ? response.data.message : 'Proyectos exportados con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    onFilter = (datos) => {
        const { activeTab, modal } = this.state
        modal.filtros = false
        $(`#proyectos-${activeTab}`).DataTable().search(JSON.stringify(datos)).draw();
        this.setState({...this.state, modal, filtrado: datos})
    }

    render() {
        const tabs = ['all', 'fase1', 'fase2', 'fase3']
        const { activeTab, modal, filtrado } = this.state
        const { access_token } = this.props.authUser
        return (
            <Layout active = 'proyectos' {...this.props}>
                <Tabs mountOnEnter = { true } unmountOnExit = { true } defaultActiveKey = 'all' activeKey = { activeTab } 
                    onSelect = { (value) => { this.getProyectosAxios(value) } } >
                    {
                        tabs.map((tab, index) => {
                            return(
                                <Tab key = { index }  eventKey = { tab }  title = { this.setName(tab) }>
                                    { this.setTabla(activeTab, tab) }
                                </Tab>
                            )
                        })
                    }
                </Tabs>
                <Modal size = 'lg' title = 'Filtros' show = { modal.filtros } handleClose = { this.handleCloseFiltros }>
                    {
                        modal.filtros ? 
                            <ProyectoFilter at = { access_token } filtering = { this.onFilter } filtrado = { filtrado } /> 
                        : <></>
                    }
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })
export default connect(mapStateToProps, mapDispatchToProps)(Proyectos);