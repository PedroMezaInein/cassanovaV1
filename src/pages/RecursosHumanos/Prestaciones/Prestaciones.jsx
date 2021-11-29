import React, { Component } from 'react'
import $ from 'jquery'
import { connect } from 'react-redux'
import { Modal } from '../../../components/singles'
import Layout from '../../../components/layout/layout'
import { NewTable } from '../../../components/NewTables'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { PrestacionesForm, PrestacionesEgresos } from '../../../components/forms'
import { FiltersPrestaciones } from '../../../components/filters'
import { URL_DEV, PRESTACIONES_RH_COLUMNS } from '../../../constants'
import { apiDelete, apiGet, apiOptions, catchErrors } from '../../../functions/api'
import { deleteAlert, doneAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'
import { setTextTableCenter, setOptionsWithLabel, setMoneyTable, setNaviIcon } from '../../../functions/setters'

class Prestaciones extends Component {

    state = {
        modal: { filtros: false, form: false, egreso: false },
        filters: {},
        title: 'Nueva prestación',
        prestacion: '',
        options:{
            proveedores:[]
        }
    }

    componentDidMount(){
        this.getOptions()
        const { state } = this.props.location
        if(state){
            if(state.prestacion){
                if(state.flag){
                    if(state.flag === 'egreso'){
                        this.openModalEgreso(state.prestacion)
                    }
                }
            }
        }
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                this.getPrestacion(id)
            }
        }
    }

    getPrestacion = async(id) => {
        const { access_token } = this.props.authUser
        apiGet(`v1/rh/prestaciones/${id}/egresos`, access_token).then(
            (response) => {
                const { prestacion } = response.data
                this.openModalEgreso(prestacion)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    getOptions = async() => {
        const { access_token } = this.props.authUser
        apiOptions(`v1/rh/prestaciones`, access_token).then(
            (response) => {
                const { proveedores } = response.data
                const { options } = this.state
                options.proveedores = setOptionsWithLabel(proveedores, 'razon_social', 'id')
                this.setState({ ...this.state, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    deletePrestacion = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiDelete(`v1/rh/prestaciones/${id}`, access_token).then(
            (response) => {
                const { filters } = this.state
                doneAlert(`Prestación eliminada con éxito`, () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    setTable = (datos) => {
        let aux = []
        datos.forEach((dato) => {
            aux.push({
                actions: this.setActions(dato),
                nombre:setTextTableCenter(dato.nombre),
                periodo: setTextTableCenter(`${dato.periodo} ${dato.periodo===1?'MES':'MESES'}`),
                pago_por_empleado: setMoneyTable(dato.pago_por_empleado),
                proveedor: setTextTableCenter(dato.proveedor ? dato.proveedor.razon_social : 'SIN DEFINIR'),
                total:setTextTableCenter(dato.contadorColaboradores),
                descripcion: setTextTableCenter(dato.descripcion ? dato.descripcion : '-'),
            })
        })
        return aux
    }

    setActions = (element) => {
        return(
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >
                    <Dropdown.Item className="text-hover-success dropdown-success" onClick={(e) => { e.preventDefault(); this.openModal(element, 'edit') }}>
                        {setNaviIcon('flaticon2-pen', 'editar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-danger dropdown-danger" onClick = {(e) => { e.preventDefault(); deleteAlert(`Eliminarás la prestación`, `¿Deseas continuar?`, () => { this.deletePrestacion(element.id) }) }} >
                        {setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-info dropdown-info" onClick={(e) => { e.preventDefault(); this.openModalEgreso(element) }} >
                        {setNaviIcon('las la-sign-out-alt icon-xl', 'EGRESOS')}
                    </Dropdown.Item>
                </DropdownButton>
            </div>
        )
    }

    reloadTable = (filter) => {
        $(`#prestaciones`).DataTable().search(JSON.stringify(filter)).draw();
    }

    openModal = (element, type) => {
        const { modal } = this.state
        let { title } = this.state
        modal.form = true
        if(type==='edit'){
            title= 'Editar prestación'
        }else{
            title= 'Nueva prestación'
        }
        this.setState({ ...this.state, modal, title, prestacion:element})
    }

    openModalFiltros = () => {
        const { modal } = this.state
        modal.filtros = true
        this.setState({ ...this.state, modal })
    }

    openModalEgreso = async( element ) => {
        const { modal } = this.state
        modal.egreso = true
        this.setState({ ...this.state, modal, prestacion: element })
    }

    handleClose = () => {
        const { modal } = this.state
        modal.filtros = false
        modal.form = false
        modal.egreso = false
        this.setState({ ...this.state, modal })
    }

    sendFilters = filtro => {
        const { modal } = this.state
        modal.filtros = false
        this.setState({
            ...this.state,
            filters: filtro,
            modal
        })
        this.reloadTable(filtro)
    }

    refresh = () => {
        const { filters, modal } = this.state
        modal.form = false
        this.setState({ ...this.state, modal })
        this.reloadTable(filters)
    }

    render(){
        const { authUser: {access_token}, history } = this.props
        const { modal, filters, title, prestacion, options } = this.state
        return(
            <Layout active = 'rh' { ...this.props } >
                <NewTable tableName = 'prestaciones' subtitle = 'Listado de prestaciones' title = 'Prestaciones' abrirModal = { true }
                    accessToken = { access_token } columns = { PRESTACIONES_RH_COLUMNS } setter = { this.setTable } onClick = { this.openModal }
                    urlRender = {`${URL_DEV}v1/rh/prestaciones`}  filterClick = { this.openModalFiltros }/>
                <Modal size = 'lg' show = { modal.filtros } handleClose = { this.handleClose } title = 'Filtros'>
                    {   
                        modal.filtros ? 
                            <FiltersPrestaciones at = { access_token } sendFilters = { this.sendFilters } filters = { filters } options = { options }/> 
                        : <></> 
                    }
                </Modal>
                <Modal size = 'lg' show = { modal.form } handleClose = { this.handleClose } title = { title }>
                    {
                        modal.form ? 
                            <PrestacionesForm title = { title } at = { access_token } refresh = { this.refresh } prestacion={prestacion} options = { options }/> 
                        : <></>
                    }
                    
                </Modal>
                <Modal size = 'lg' show = { modal.egreso } handleClose = { this.handleClose } title = 'EGRESOS' bgHeader="border-0">
                    {
                        modal.egreso ?
                            <PrestacionesEgresos at = { access_token } history = { history } prestacion = { prestacion } />
                        : <></>
                    }
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return {authUser: state.authUser}}
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Prestaciones);