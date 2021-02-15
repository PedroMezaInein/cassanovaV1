import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { ModalDelete } from '../../../components/singles'
import { printResponseErrorAlert, errorAlert, waitAlert, doneAlert } from '../../../functions/alert'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { PARTIDAS_DISEÑO_COLUMNS } from '../../../constants'
import { save, deleteForm } from '../../../redux/reducers/formulario'
import { setTextTable } from '../../../functions/setters'
import { renderToString } from 'react-dom/server'
import { Tab, Card, Nav } from 'react-bootstrap' 

const $ = require('jquery');

class PartidasDiseño extends Component {

    state = {
        partidas: [],
        partida: '',
        modal: {
            delete: false,
        },
        title: 'Nueva partida',
        form: {
            partida: '',
            empresa: 'inein',
        },
        data:{
            partidas:[],
            empresas: []
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
                partida: renderToString(setTextTable(partida.nombre)),
                tipo: renderToString(setTextTable(partida.tipo)),
                id: partida.id
            })
            return false
        })
        return aux
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
        history.push({
            pathname: '/catalogos/partidas-diseño/edit',
            state: { partida: partida}
        });
    }

    openModalDelete = (partida) => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            partida: partida
        })
    }

    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ...this.state,
            modal,
            partida: ''
        })
    }

    printTable = empresa => {
        let url = `${URL_DEV}partidas-diseño/${empresa.id}`
        const { access_token } = this.props.authUser
        console.log(empresa, 'empresa print')
        if(empresa){
            return(
                <NewTableServerRender 
                    columns = { PARTIDAS_DISEÑO_COLUMNS }
                    // title = { `Partidas de diseño ${empresa.name}` } 
                    subtitle = { `Listado de partidas ${empresa.name}` }
                    mostrar_boton = { true }
                    abrir_modal = { false }
                    url = {`/catalogos/partidas-diseño/add?empresa=${empresa.id}`}
                    mostrar_acciones = { true } 
                    actions = { {
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete }
                    } }
                    accessToken = { access_token } setter = { this.setPartidasDiseño } 
                    urlRender = { url } idTable = {`kt_datatable_partida_${empresa.id}`}
                    cardTable = {`cardTable_partidas_${empresa.id}`}
                    cardTableHeader = {`cardTableHeader_partidas_${empresa.id}`}
                    cardBody = {`cardBody_partidas_${empresa.id}`}
                    isNav = { true }
                    customcard={'card-without-box-shadown'}
                    customheader={'rounded-0'}
                    customtitle={'d-flex align-items-start mt-0 '}
                    customsubtitle={'pt-0 hidden-subtitle'}
                    customlabel={'hidden-label'}
                />
            )
        }
        return ''
    }

    getPartidas = async(empresa) => {
        $(`#kt_datatable_partida_${empresa.id}`).DataTable().ajax.reload();
    }

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
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error)=>{
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
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
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render(){
        const { modal, empresa, data } = this.state
        return (
            <Layout active = { 'catalogos' }  { ...this.props } >
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
                <Tab.Container activeKey = { empresa.id} >
                    <Tab.Content>
                        {
                            data.empresas.map((empresa, key) => {
                                console.log(empresa, 'EMPRESA')
                                return(
                                    <Tab.Pane eventKey = { empresa.id } key = { key } >
                                        {this.printTable(empresa)}
                                    </Tab.Pane>
                                )
                            })
                        }
                    </Tab.Content>
                </Tab.Container>
                <ModalDelete 
                    title =  "¿Estás seguro que deseas eliminar la partida?"
                    show = { modal.delete } handleClose = { this.handleCloseDelete } 
                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.deletePartidaDiseñoAxios() }}>
                </ModalDelete>

            </Layout>
        )
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(PartidasDiseño);