import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { URL_DEV, PRECIO_M2_DISEÑOS_COLUMNS } from '../../../constants'
import { ModalDelete, Modal } from '../../../components/singles'
import axios from 'axios'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert } from '../../../functions/alert'
import { setTextTable, setMoneyTable} from '../../../functions/setters'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { PreciosDisenoCard } from '../../../components/cards'
import $ from "jquery";
class PrecioDiseño extends Component {

    state = {
        modal:{
            delete: false,
            see: false
        },
        precio: ''
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
    }

    // Change page
    changePageEdit = (precio) => {
        const { history } = this.props
        history.push({
            pathname: '/catalogos/precio-diseno/edit',
            state: { precio: precio}
        });
    }

    openModalDelete = precio => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            precio: precio
        })
    }

    handleCloseModalDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ...this.state,
            modal,
            precio: ''
        })
    }
    openModalSee = precio => {
        const { modal} = this.state
        modal.see =true
        this.setState({
            ...this.state,
            modal,
            precio: precio
        })
    }

    handleCloseSee = () => {
        const { modal} = this.state
        modal.see =false
        this.setState({
            ...this.state,
            modal,
            precio: ''
        })
    }

    //setters

    setPreciosTable = ( precios ) => {
        let aux = []
        precios.map((precio) => {
            aux.push({
                actions: this.setActions(precio),
                m2: renderToString(setTextTable(precio.m2)),
                esquema1: renderToString(setMoneyTable(precio.esquema_1)),
                esquema2: renderToString(setMoneyTable(precio.esquema_2)),
                esquema3: renderToString(setMoneyTable(precio.esquema_3)),
                id: precio.id,
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
            }
        )
        return aux
    }

    async getPreciosAxios() {
        $('#kt_datatable_precio').DataTable().ajax.reload();
    }

    async deletePrecioAxios() {
        const { access_token } = this.props.authUser
        const { precio } = this.state
        await axios.delete(URL_DEV + 'precios-diseño/' + precio.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state

                this.getPreciosAxios()

                doneAlert(response.data.message !== undefined ? response.data.message : 'El contrato fue registrado con éxito.')

                modal.delete = false

                this.setState({
                    ...this.state,
                    precio: '',
                    modal
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        const { modal, precio} = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <NewTableServerRender
                    columns={PRECIO_M2_DISEÑOS_COLUMNS}
                    title='Precios por M2 para diseño'
                    subtitle='Listado de precios por M2 para diseño'
                    mostrar_boton={true}
                    abrir_modal={false}
                    mostrar_acciones={true}
                    url='/catalogos/precio-diseno/add'
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete },
                        'see': { function: this.openModalSee },
                    }}
                    idTable='kt_datatable_precio'
                    accessToken={this.props.authUser.access_token}
                    setter={this.setPreciosTable}
                    urlRender={URL_DEV + 'precios-diseño'}
                    cardTable='cardTable_precio'
                    cardTableHeader='cardTableHeader_precio'
                    cardBody='cardBody_precio'
                    />
                <ModalDelete 
                    title='¿Quieres eliminar el elemento?' 
                    show={modal.delete} 
                    handleClose={this.handleCloseModalDelete} 
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deletePrecioAxios() }} 
                />

                <Modal title="Precio para diseño" show = { modal.see } handleClose = { this.handleCloseSee } >
                    <PreciosDisenoCard precio={precio}/>
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(PrecioDiseño);