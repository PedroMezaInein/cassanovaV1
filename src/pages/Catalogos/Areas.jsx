import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { AreasForm } from '../../components/forms'
import { URL_DEV, AREAS_COLUMNS, AREAS_COMPRAS_COLUMNS, PUSHER_OBJECT } from '../../constants'
import { Modal } from '../../components/singles'
import axios from 'axios'
import Swal from 'sweetalert2'
import { AreaCard } from '../../components/cards'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert, customInputAlert, deleteAlert } from '../../functions/alert'
import { setOptions, setTextTableReactDom, setTagLabelAreaReactDom, setTextTable } from '../../functions/setters'
import { Tabs, Tab } from 'react-bootstrap'
import { Update } from '../../components/Lottie'
import { InputGray, DoubleSelectSearchGray, SelectSearchGray } from '../../components/form-components'
import { printSwalHeader } from '../../functions/printers'
import Echo from 'laravel-echo';
import { setSingleHeader } from '../../functions/routers'
import $ from "jquery";
import { renderToString } from 'react-dom/server'
import MiModal from 'react-bootstrap/Modal'
import { EdithSubArea } from '../../components/cards/Catalogos/EdithSubArea'
import Gastos from '../../pages/Catalogos/Areas/Gastos'
import Compras from '../../pages/Catalogos/Areas/Compras'


class Areas extends Component {

    state = {
        form: {
            nombre: '',
            subarea: '',
            subareas: [],
            subareasEditable: []
        },
        formeditado:0,
        subArea: false,
        selectedSubArea: '',
        modal: false,
        modalDelete: false,
        modalSee: false,
        title: 'Nueva área',
        area: '',
        tipo: 'compras',
        key: 'gastos',
        options: { areas: [], subareas: [], partidas: []}
    }

    
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const areas = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!areas)
            history.push('/')
        if(process.env.NODE_ENV === 'production'|| true){
            const pusher = new Echo( PUSHER_OBJECT );
            pusher.channel('Catalogos.Areas').listen('Catalogos\\AreaNotificacion', (data) => {
                const { key } = this.state
                if(data.area)
                    if(data.area.tipo)
                        if(key === data.area.tipo)
                            this.controlledTab(key)
            })
        }
        this.getOptionsAxios()
    }

    addSubarea = () => {
        const { form } = this.state
        if (form['subarea'] !== '') {
            let aux = false;
            aux = form.subareas.find(function (element, index) {
                if (element === form.subarea)
                    return true
                return false
            });
            if (aux !== true) {
                form.subareas.push(form.subarea)
                form.subarea = ''
                this.setState({ ...this.state, form })
            }
        }
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    editSubarea = (value, subarea) => {
        const { form } = this.state
        let bandera = true
        form.subareasEditable.forEach((element) => {
            if(element.id === subarea.id){
                bandera = false
                element.nombre = value
            }
        });
        if(bandera)
            form.subareasEditable.push({ id: subarea.id, nombre: value })
        this.setState({...this.state,form})
    }

    setAreas = areas => {
        let aux = []
        areas.map((area) => {
            aux.push({
                actions: this.setActions(area),
                area: setTextTableReactDom(area.nombre, this.doubleClick, area, 'nombre', 'text-center'),
                subareas: setTagLabelAreaReactDom(area, area.subareas, 'subareas', this.openModalDeleteSubarea, this.doubleClickSubArea),
                partida: renderToString(setTextTable(area.partida ? area.partida.nombre : '')),
                id: area.id
            })
            return false
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
                tooltip: {id:'see', text:'Mostrar', type:'info'},
            },
        )
        return aux
    }

    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
            case 'area':
                form.nombre = data.nombre
                break
            default:
                form[tipo] = data[tipo]
                break
        }
        this.setState({form})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) } </h2>
                {
                    tipo === 'nombre' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } swal = { true }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } />
                }
            </div>,
            <Update />,
            () => { this.patchArea(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }

    controlledTab = async(value) => {
        $(`#kt_datatable_${value}`).DataTable().ajax.reload();
        this.setState({ ...this.state, key: value })
    }

    deleteElementAxios = async(data, element, tipo) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert()
        // await axios.delete(`${URL_DEV}v2/catalogos/areas/${data.id}/subarea/${element.id}?sub=${form.subarea}`, 
        await axios.delete(`${URL_DEV}v2/catalogos/areas/${data.id}/subarea/${element.id}?sub=${form.subarea}`, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { form } = this.state
                const { area } = response.data
                form.area = ''
                form.subarea = ''
                this.setState({...this.state, area: area, form})
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    patchArea = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/catalogos/areas/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { form } = this.state
                form.subarea = ''
                form.area = ''
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.')
                this.setState({...this.state, form})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deleteSubareaAxios = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { area } = this.state
        await axios.delete(`${URL_DEV}v2/catalogos/areas/${area.id}/subarea/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key, form } = this.state
                form.subarea = ''
                const { area } = response.data
                this.controlledTab(key)
                doneAlert(response.data.message !== undefined ? response.data.message : 'Subarea eliminado con éxito.')
                this.setState({ ...this.state,  area: area, form })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    addAreaAxios = async () => {
        const { access_token } = this.props.authUser
        const { form, tipo } = this.state
        form.tipo = tipo
        this.setState({ ...this.state, form })
        await axios.post(URL_DEV + 'areas', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key } = this.state
                this.controlledTab(key)
                doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito una nueva área.')
                this.setState({ ...this.state, modal: false, form: this.clearForm(), })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    updateAreaAxios = async () => {
        const { access_token } = this.props.authUser
        const { form, area } = this.state
        await axios.put(`${URL_DEV}v2/catalogos/areas/${area.id}`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key } = this.state
                this.controlledTab(key)
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el área.')
                this.setState({ ...this.state, modal: false, form: this.clearForm(), area: '' })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deleteAreaAxios = async (area) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.delete(`${URL_DEV}v2/catalogos/areas/${area.id}?area=${form.area}&subarea=${form.subarea}`, 
            { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { key } = this.state
                this.controlledTab(key)
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito el área.')
                this.setState({ ...this.state, modalDelete: false, form: this.clearForm(), area: '', })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    openModalDeleteSubarea = async(data, element, tipo) => {
        const { key } = this.state
        const { access_token } = this.props.authUser
        await axios.options(`${URL_DEV}v2/catalogos/areas?id=${data.id}&tipo=${key}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { subareas } = response.data
                // debugger
                let conteo = 0;
                let busqueda = subareas.find((elemento) => {
                    return elemento.id === element.id
                })
                if(busqueda){
                    switch(key){
                        case 'compras':
                            if(busqueda.compras_count)
                                conteo = busqueda.compras_count
                            break;
                        case 'ventas':
                            if(busqueda.ventas_count)
                                conteo = busqueda.ventas_count
                            break;
                        case 'ingresos':
                            if(busqueda.ingresos_count)
                                conteo = busqueda.ingresos_count
                            break;
                        case 'egresos':
                            if(busqueda.egresos_count)
                                conteo = busqueda.egresos_count
                            break;
                        default: break;
                    }
                    if(conteo){
                        const { options, form } = this.state
                        options.subareas = []
                        subareas.forEach((elemento) => {
                            if(element.id !== elemento.id)
                                options.subareas.push({value: elemento.id.toString(), name: elemento.nombre })
                        })
                        form.subarea = ''
                        this.setState({...this.state, options, form})
                        customInputAlert(
                            <div>
                                <h2 className = 'swal2-title mb-4 mt-2'> ELIMINARÁS LA SUBÁREA "{element.nombre}"</h2>
                                <p className = ''> Y TIENE {conteo} {key} ASIGNADAS </p>
                                <p className = 'pt-5 mb-0'> SELECCIONA LA SUBÁREA QUE SUSTITUIRÁ </p>
                                <div className="px-5">
                                    <SelectSearchGray options = { options.subareas } placeholder = 'Selecciona el subárea' value = { form.subarea } 
                                        onChange = { (value) => { this.onChangeSwal(value, 'subarea') } } withtaglabel = { 1 } 
                                        name = { 'subarea' } customdiv = "mb-3" withicon={1}/>
                                </div>
                            </div>,
                            <Update />,
                            () => { this.deleteElementAxios(data, element, tipo) },
                            () => this.clearArea()
                        )
                    }else{ deleteAlert( `BORRARÁS LA SUBÁREA ${element.nombre}`, '', () => this.deleteElementAxios(data,element, tipo) ) }
                }else{ deleteAlert( `BORRARÁS LA SUBÁREA ${element.nombre}`, '', () => this.deleteElementAxios(data,element, tipo) ) }
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    clearArea = () => { this.setState({ ...this.state, form: this.clearForm() }) }

    openModalDelete = async (area) => {
        const { access_token } = this.props.authUser
        const { key } = this.state
        let conteo = 0;
        switch(key){
            case 'compras':
                if(area.compras_count)
                    conteo = area.compras_count
                break;
            case 'ventas':
                if(area.ventas_count)
                    conteo = area.ventas_count
                break;
            case 'ingresos':
                if(area.ingresos_count)
                    conteo = area.ingresos_count
                break;
            case 'egresos':
                if(area.egresos_count)
                    conteo = area.egresos_count
                break;
            default: break;
        }
        if(conteo === 0){
            deleteAlert(
                `BORRARÁS EL ÁREA ${area.nombre}`,
                this.setSubText(area),
                () => this.deleteAreaAxios(area)
            )
        }else{
            await axios.options(`${URL_DEV}v2/catalogos/areas?id=${area.id}&tipo=${key}`, { headers: setSingleHeader(access_token) }).then(
                (response) => {
                    const { areas } = response.data
                    const { options, form } = this.state
                    options.areas = setOptions(areas, 'nombre', 'id')
                    options.subareas = []
                    form.area = ''
                    form.subarea = ''
                    this.setState({...this.state, options, form})
                    customInputAlert(
                        <div>
                            <h2 className = 'swal2-title mb-4 mt-2'> ELIMINARÁS EL ÁREA {area.nombre} </h2>
                            <p className = ''> Y TIENE {conteo} {key} ASIGNADAS </p>
                            <div className="px-5">
                                <DoubleSelectSearchGray options = { options } form = { form } onChange = { this.onChangeSwal } 
                                    one = { { placeholder: 'SELECCIONA EL ÁREA A REASIGNAR', name: 'area', opciones: 'areas'} } 
                                    two = { { placeholder: 'SELECCIONA EL SUBÁREA  A REASIGNAR', name: 'subarea', opciones: 'subareas'} }/>
                            </div>
                            
                        </div>,
                        <Update />,
                        () => this.deleteAreaAxios(area),
                        () => this.clearArea()
                    )
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
        }
    }

    getOptionsAxios = async() => {
        const { access_token } = this.props.authUser
        await axios.options(`${URL_DEV}v2/catalogos/areas/options`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { partidas } = response.data
                const { options } = this.state
                options.partidas = setOptions(partidas, 'nombre', 'id')
                this.setState({...this.state, options})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    onChangeSwal = (value, tipo) => {
        const { form, options } = this.state
        if(tipo === 'area'){
            let valor = options.areas.find((elemento) => {
                return elemento.value = value
            })
            options.subareas = setOptions(valor.subareas, 'nombre', 'id')
        }
        form[tipo] = value
        this.setState({...this.state, form, options})
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'subareas':
                case 'subareasEditable':
                    form[element] = []
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
    }

    setSubText = area => {
        const { key } = this.state
        switch(key){
            case 'compras':
                if(area.compras_count)
                    return `EL ÁREA TIENE ${area.compras_count} COMPRAS. ¿DESEAS CONTINUAR?`
                break;
            case 'ventas':
                if(area.ventas_count)
                    return `EL ÁREA TIENE ${area.ventas_count} VENTAS. ¿DESEAS CONTINUAR?`
                break;
            case 'ingresos':
                if(area.ingresos_count)
                    return `EL ÁREA TIENE ${area.ingresos_count} INGRESOS. ¿DESEAS CONTINUAR?`
                break;
            case 'egresos':
                if(area.egresos_count)
                    return `EL ÁREA TIENE ${area.egresos_count} EGRESOS. ¿DESEAS CONTINUAR?`
                break;
            default: break;
        }
        return ''
    }

    handleClose = () => { this.setState({ modal: false, title: 'Nueva área', form: this.clearForm(), area: '' }) }

    openModal = ( type ) => { this.setState({ modal: true, title: 'Nueva área', form: this.clearForm(), tipo: type, formeditado:0 }) }

    openModalEdit = area => {
        const { form, key } = this.state
        form.nombre = area.nombre
        form.subareas = []
        form.subareasEditable = []
        form.subarea = ''
        if(area.partida)
            form.partida = area.partida.id.toString()
        this.setState({ ...this.state, modal: true, title: `Editar área`, area: area, form, tipo: key, formeditado:1 })
    }

    openModalSee = area => { this.setState({ ...this.state, modalSee: true, area: area }) }

    handleCloseSee = () => { this.setState({ ...this.state, modalSee: false, area: '' }) }

    onSubmit = e => {
        e.preventDefault();
        waitAlert()
        const { title } = this.state
        if (title === 'Nueva área')
            this.addAreaAxios()
        if (title === 'Editar área')
            this.updateAreaAxios()
    }

    handleCloseSubArea = () => {
        this.setState({
            ...this.state,
            subArea:false
        })
    }

    doubleClickSubArea = (element) => {
        console.log(element)
        this.setState({
            ...this.state,
            subArea:true,
            selectedSubArea:element
        })
    }

    render() {
        const { form, modal, title, formeditado, key, modalSee, area, options, subArea, selectedSubArea } = this.state
        const { access_token } = this.props.authUser
        const tabs = [ 'ventas', 'ingresos']
      
        console.log(this.props)
        return (
            <Layout active = 'catalogos'  {...this.props} >

                <Tabs id = "tabsAreas" defaultActiveKey = "compras" activeKey = { key } onSelect = { (value) => { this.controlledTab(value) } } >
                    {/* <Tab eventKey = { 'compras' } title = { 'compras' }>
                        <NewTableServerRender columns = { AREAS_COMPRAS_COLUMNS } title = 'ÁREAS' 
                            subtitle = 'Listado de áreas' mostrar_boton = { true } abrir_modal = { true } mostrar_acciones = { true } 
                            onClick = { (e) => { this.openModal(key) } } setter = { this.setAreas } accessToken = { access_token } 
                            urlRender = { `${URL_DEV}areas/compras` } idTable = {`kt_datatable_compras`} 
                            cardTable = {`card_table_compras`} cardTableHeader = {`card_table_header_compras`} 
                            cardBody = {`card_body_compras`} isTab = { true }
                            actions = { { 'edit': { function: this.openModalEdit }, 'delete': { function: this.openModalDelete }, 'see': { function: this.openModalSee } } }/>
                    </Tab> */}

                    <Tab eventKey="gastos" title="gastos" onSelect = { (value) => { this.controlledTab(value) } }>
                        <Gastos /> 
                    </Tab>

                    <Tab eventKey="compras" title="compras">
                        <Compras/> 
                    </Tab>

                    {
                        tabs.map((elemento,index) => {
                            return(
                                <Tab key={index} eventKey = { elemento } title = { elemento }>
                                    <NewTableServerRender columns = { AREAS_COLUMNS } title = 'ÁREAS' 
                                        subtitle = 'Listado de áreas' mostrar_boton = { true } abrir_modal = { true } mostrar_acciones = { true } 
                                        onClick = { (e) => { this.openModal(key) } } setter = { this.setAreas } accessToken = { access_token } 
                                        urlRender = { `${URL_DEV}areas/${elemento}` } idTable = {`kt_datatable_${elemento}`} 
                                        cardTable = {`card_table_${elemento}`} cardTableHeader = {`card_table_header_${elemento}`} 
                                        cardBody = {`card_body_${elemento}`} isTab = { true }
                                        actions = { { 'edit': { function: this.openModalEdit }, 'delete': { function: this.openModalDelete }, 'see': { function: this.openModalSee } } }/>
                                </Tab>
                            )
                        })
                    }
                </Tabs>

                <Modal size="xl" title={title} show={modal} handleClose={this.handleClose}>
                    <AreasForm area = {area} form = { form } onChange = { this.onChange } addSubarea = { this.addSubarea } editSubarea = { this.editSubarea } 
                        deleteSubarea = { this.openModalDeleteSubarea } title = { title } onSubmit = { this.onSubmit } formeditado = { formeditado } 
                        tipo = { key } options = { options } />
                </Modal>

                <Modal title={key === 'egresos' ?'Egreso' : key === 'compras' ? 'Compra' : key === 'ventas' ? 'Venta/Ingreso' :''} show = { modalSee } handleClose = { this.handleCloseSee } >
                    <AreaCard area={area}/>
                </Modal>

                <MiModal show = { subArea } onHide = { this.handleCloseSubArea } centered ={true} >
                  
                    <MiModal.Body>
                        <EdithSubArea subarea={selectedSubArea} closeSubArea={this.handleCloseSubArea} tabla={key}/>
                        
                    </MiModal.Body>
                </MiModal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Areas);