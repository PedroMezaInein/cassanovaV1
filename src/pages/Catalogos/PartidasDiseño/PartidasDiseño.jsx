import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { ModalDelete } from '../../../components/singles'
import { printResponseErrorAlert, errorAlert, waitAlert, doneAlert, customInputAlert } from '../../../functions/alert'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { PARTIDAS_DISEÑO_COLUMNS } from '../../../constants'
import { save, deleteForm } from '../../../redux/reducers/formulario'
import { setTextTableReactDom } from '../../../functions/setters'
import { Tab, Card, Nav } from 'react-bootstrap' 
import Swal from 'sweetalert2'
import { Update } from '../../../components/Lottie'
import { printSwalHeader } from '../../../functions/printers'
import { InputGray, SelectSearchGray } from '../../../components/form-components'
import $ from "jquery";
class PartidasDiseño extends Component {

    state = {
        partidas: [],
        partida: '',
        modal: { delete: false, },
        title: 'Nueva partida',
        form: { partida: '', empresa: 'inein', },
        data:{ partidas:[], empresas: [] },
        options:{
            rubro: [
                { name: "ACABADOS E INSTALACIONES", value: "Acabados e instalaciones", label: "ACABADOS E INSTALACIONES" },
                { name: "OBRA CIVIL", value: "Obra civil", label: "OBRA CIVIL" },
                { name: "MOBILIARIO", value: "Mobiliario", label: "MOBILIARIO" },
            ],
            empresas: [],
        },
        empresa: ''
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const partidas = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!partidas)
            history.push('/')
        this.getPartidasDiseño()
    }

    handleClickEmpresa = empresa => {
        this.setState({...this.state,empresa: empresa})
        this.getPartidas(empresa)
    }

    setPartidasDiseño = ( partidas ) => {
        let aux = []
        partidas.map((partida) => {
            aux.push({
                actions: this.setActions(partida),
                partida: setTextTableReactDom(partida.nombre, this.doubleClick, partida, 'nombre', 'text-center'),
                tipo: setTextTableReactDom(partida.tipo, this.doubleClick, partida, 'tipo', 'text-center'),
                id: partida.id
            })
            return false
        })
        return aux
    }

    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
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
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } letterCase = { false }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }
                        />
                }
                {
                    tipo === 'tipo' &&
                        <SelectSearchGray options = { this.setOptions(data, tipo) }
                            onChange = { (value) => { this.updateSelectSearch(value, tipo)} } name = { tipo }
                            value = { form[tipo] } customdiv="mb-2 mt-7" requirevalidation={1} 
                            placeholder={`SELECCIONA EL TIPO DE RUBRO `} withicon={1}
                        />
                }
            </div>,
            <Update />,
            () => { this.patchPartidasDiseño(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    
    setOptions = (data, tipo) => {
        const { options } = this.state
        switch(tipo){
            case 'tipo':
                return options.rubro
            default: return []
        }
    }
    
    updateSelectSearch = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    
    patchPartidasDiseño = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/catalogos/partidas-diseño/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresa } = this.state
                this.getPartidas(empresa)
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito la unidad.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            form[element] = ''
            return false
        })
        return form;
    }
    
    setActions= () => {
        let aux = []
            aux.push(
                {
                    text: 'Editar',
                    btnclass: 'success',
                    iconclass: 'flaticon2-pen',
                    action: 'edit',
                    tooltip: {id:'edit', text:'Editar'},
                },
                {
                    text: 'Eliminar',
                    btnclass: 'danger',
                    iconclass: 'flaticon2-rubbish-bin',                  
                    action: 'delete',
                    tooltip: {id:'delete', text:'Eliminar', type:'error'},
                }       
        ) 
        return aux 
    }

    changePageEdit = partida => {
        const { history } = this.props
        history.push({ pathname: '/catalogos/partidas-diseño/edit', state: { partida: partida} });
    }

    openModalDelete = (partida) => {
        const { modal } = this.state
        modal.delete = true
        this.setState({ ...this.state, modal, partida: partida })
    }

    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({ ...this.state, modal, partida: '' })
    }

    printTable = empresa => {
        let url = `${URL_DEV}partidas-diseño/${empresa.id}`
        const { access_token } = this.props.authUser
        if(empresa){
            return(
                <NewTableServerRender  columns = { PARTIDAS_DISEÑO_COLUMNS } subtitle = { `Listado de partidas ${empresa.name}` }
                    mostrar_boton = { true } abrir_modal = { false } url = {`/catalogos/partidas-diseño/add?empresa=${empresa.id}`}
                    mostrar_acciones = { true } accessToken = { access_token } setter = { this.setPartidasDiseño } 
                    actions = { { 'edit': { function: this.changePageEdit }, 'delete': { function: this.openModalDelete } } }
                    urlRender = { url } idTable = {`kt_datatable_partida_${empresa.id}`} cardTable = {`cardTable_partidas_${empresa.id}`}
                    cardTableHeader = {`cardTableHeader_partidas_${empresa.id}`} cardBody = {`cardBody_partidas_${empresa.id}`}
                    isNav = { true } customcard = 'card-without-box-shadown' customheader = 'rounded-0' customtitle = 'd-flex align-items-start mt-0 '
                    customsubtitle = 'pt-0 hidden-subtitle' customlabel = 'hidden-label' />
            )
        }
        return ''
    }

    getPartidas = async(empresa) => { $(`#kt_datatable_partida_${empresa.id}`).DataTable().ajax.reload(); }

    getPartidasDiseño = async() => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}partidas-diseño`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { empresas } = response.data
                let { empresa } = this.state
                data.empresas = empresas
                if(empresas.length)
                    empresa = empresas[0]
                this.setState({...this.state,data,empresa})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error)=>{
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async deletePartidaDiseñoAxios() {
        const { access_token } = this.props.authUser
        const { partida } = this.state
        await axios.delete(URL_DEV + 'partidas-diseño/' + partida.id, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { modal, empresa } = this.state
                modal.delete = false
                this.setState({ ...this.state, modal, partida: '' })
                this.getPartidas(empresa)
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito al usuario.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    render(){
        const { modal, empresa, data } = this.state
        return (
            <Layout active = 'catalogos'  { ...this.props } >
                <Card className = 'card-custom rounded-0'>
                    <Card.Header className="border-bottom-0">
                        <div className = 'd-flex align-items-end'>
                            <div className="card-title mb-0">
                                <h3 className="card-label font-weight-bolder font-size-h3">Partidas de diseño {empresa.name}
                                </h3>
                                <div className="d-block text-muted pt-2 font-size-sm show-lista"> Listado de partidas {empresa.name}</div>
                            </div>
                        </div>
                        <div className="card-toolbar">
                            <Nav className = 'nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0' activeKey = { empresa.id } >
                                {
                                    data.empresas.map((element, key) => {
                                        return(
                                            <Nav.Item key = { key } onClick = { (e) => { e.preventDefault(); this.handleClickEmpresa(element) } } >
                                                <Nav.Link eventKey = { element.id } >
                                                    { element.name }
                                                </Nav.Link>
                                            </Nav.Item>
                                        )
                                    })
                                }
                            </Nav>
                        </div>
                    </Card.Header>
                </Card>
                <Tab.Container activeKey = { empresa.id } >
                    <Tab.Content>
                        {
                            data.empresas.map((empresa, key) => {
                                return(
                                    <Tab.Pane eventKey = { empresa.id } key = { key } > { this.printTable(empresa) } </Tab.Pane>
                                )
                            })
                        }
                    </Tab.Content>
                </Tab.Container>
                <ModalDelete  title =  "¿Estás seguro que deseas eliminar la partida?" show = { modal.delete } handleClose = { this.handleCloseDelete } 
                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.deletePartidaDiseñoAxios() }} />
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser, formulario: state.formulario } }
const mapDispatchToProps = dispatch => ({ save: payload => dispatch(save(payload)), deleteForm: () => dispatch(deleteForm()), })

export default connect(mapStateToProps, mapDispatchToProps)(PartidasDiseño);