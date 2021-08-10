import axios from 'axios'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { EQUIPOS_COLUMNS, URL_DEV } from '../../../constants'
import { customInputAlert, deleteAlert, doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'
import { setSingleHeader } from '../../../functions/routers'
import { setOptions, setTextTableReactDom } from '../../../functions/setters'
import $ from "jquery";
import { printSwalHeader } from '../../../functions/printers'
import { Update } from '../../../components/Lottie'
import Swal from 'sweetalert2'
import InputGray from '../../../components/form-components/Gray/InputGray'
import SelectSearchGray from '../../../components/form-components/Gray/SelectSearchGray'
import { Modal } from '../../../components/singles'
import { EquipoCard } from '../../../components/cards'
class Equipo extends Component {

    state = {
        form: { marca: '', equipo: '', modelo: '', proveedor: '', partida: '', observaciones: ''},
        options: { proveedores: [], partidas: [] },
        modal: { see: false },
        equipo: ''
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const module = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!module)
            history.push('/')
        this.getOptions()
    }

    clearForm = () => {
        return { marca: '', equipo: '', modelo: '', proveedor: '', partida: '', observaciones: ''} 
    }

    setEquipos = (equipos) => {
        let aux = []
        equipos.forEach((equipo) => {
            aux.push({
                actions: this.setActions(),
                id: equipo.id,
                equipo: setTextTableReactDom(equipo.equipo, this.doubleClick, equipo, 'equipo', 'text-center'),
                marca: setTextTableReactDom(equipo.marca, this.doubleClick, equipo, 'marca', 'text-center'),
                modelo: setTextTableReactDom(equipo.modelo, this.doubleClick, equipo, 'modelo', 'text-center'),
                proveedor: setTextTableReactDom(equipo.proveedor ? equipo.proveedor.razon_social : '', this.doubleClick, equipo, 'proveedor', 'text-center'),
                partida: setTextTableReactDom(equipo.partida ? equipo.partida.nombre : '', this.doubleClick, equipo, 'partida', 'text-center'),
                observaciones: setTextTableReactDom(equipo.observaciones, this.doubleClick, equipo, 'observaciones', 'text-justify'),
                ficha: this.setFileLink(equipo.ficha_tecnica),
            })
        })
        return aux
    }

    setFileLink = liga => {
        if(liga)
            return(
                <div className="text-center">
                    <a href = {liga} target = '_blank' rel="noreferrer" className="btn btn-icon btn-xs btn-light-info mr-2 my-1 text-center">
                        <i className="flaticon-doc " />
                    </a>
                </div>
            )
        return(<></>)
    }

    setActions = () => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' },
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' },
            },
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            }
        )
        return aux
    }

    doubleClick = (data, tipo) => {
        const { form, options } = this.state
        switch(tipo){
            case 'partida':
            case 'proveedor':
                if(data[tipo])
                    form[tipo] = data[tipo].id.toString()
                break
            default:
                form[tipo] = data[tipo]
                break
        }
        customInputAlert(
            <div>
                <h2 className="swal2-title mb-4 mt-2"> { printSwalHeader(tipo) } </h2>
                {
                    tipo !== 'proveedor' && tipo !== 'partida' && tipo !== 'observaciones' ?
                        <InputGray withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } swal = { true }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } />
                    : ''
                }
                {
                    tipo === 'proveedor' ?
                        <SelectSearchGray options = { options.proveedores } onChange = { (value) => { this.onChangeSwal(value, tipo)} } 
                            name = { tipo } value = { form[tipo] } customdiv="mb-2 mt-7" requirevalidation={1} 
                            placeholder={this.setSwalPlaceholder(tipo)}/>
                    : ''
                }
                {
                    tipo === 'partida' ?
                        <SelectSearchGray options = { options.partidas } onChange = { (value) => { this.onChangeSwal(value, tipo)} } 
                            name = { tipo } value = { form[tipo] } customdiv="mb-2 mt-7" requirevalidation={1} 
                            placeholder={this.setSwalPlaceholder(tipo)}/>
                    : ''
                }
                {
                    tipo === 'observaciones' ?
                        <InputGray withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } swal = { true }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } as = 'textarea' rows = '5'/>
                    : ''
                }
            </div>,
            <Update />,
            () => { this.patchEquipo(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }

    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }

    setSwalPlaceholder = (tipo) => {
        switch(tipo){
            case 'proveedor':
                return 'SELECCIONA EL PROVEEDOR'
            case 'partida':
                return 'SELECCIONA LA PARTIDA'
            default:
                return ''
        }
    }

    changePageEdit = equipo => {
        const { history } = this.props
        history.push({ pathname: '/proyectos/equipos/edit', state: { equipo: equipo } });
    }

    openModalDelete = equipo => {
        deleteAlert('¿SEGURO DESEAS ELIMINAR EL EQUIPO?','', () => this.deleteEquipoAxios(equipo.id))
    }

    getOptions = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.options(`${URL_DEV}v1/proyectos/equipos`, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { partidas, proveedores } = response.data
                const { options } = this.state
                options.proveedores = setOptions(proveedores, 'razon_social', 'id')
                options.partidas = setOptions(partidas, 'nombre', 'id')
                this.setState({ ...this.state, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteEquipoAxios = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}v1/proyectos/equipos/${id}`, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert('Equipo eliminado con éxito')
                this.getEquiposAxios()
            }, (error) =>  { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    patchEquipo = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v1/proyectos/equipos/${tipo}/${data.id}`,  { value: value }, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getEquiposAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El equipo fue editado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getEquiposAxios = async() => { $('#kt_datatable_equipos').DataTable().ajax.reload(); }

    openModalSee = equipo => {
        const { modal } = this.state
        modal.see = true
        this.setState({ ...this.state, modal, equipo: equipo })
    }

    handleCloseSee = () => {
        const { modal } = this.state
        modal.see = false
        this.setState({ ...this.state, modal, equipo: '' })
    }
    render(){
        const { access_token } = this.props.authUser
        const { modal, equipo } = this.state
        return(
            <Layout active = 'proyectos'  {...this.props}>
                <NewTableServerRender columns = { EQUIPOS_COLUMNS } title = 'Equipos' subtitle = 'Listado de equipos'
                    mostrar_boton = { true } abrir_modal = { false } url = '/proyectos/equipos/add' mostrar_acciones = { true }
                    actions = { { 'edit': { function: this.changePageEdit }, 'delete': { function: this.openModalDelete }, 'see': { function: this.openModalSee } } }
                    accessToken = { access_token } setter = { this.setEquipos } cardTable = 'cardTable_equipos'
                    urlRender = { `${URL_DEV}v1/proyectos/equipos` } idTable = 'kt_datatable_equipos'
                    cardTableHeader = 'cardTableHeader_equipos' cardBody = 'cardBody_equipos' />
                <Modal size="lg" title="Equipo" show={modal.see} handleClose={this.handleCloseSee} >
                    <EquipoCard equipo={equipo} />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Equipo)