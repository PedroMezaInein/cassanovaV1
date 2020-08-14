import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, CONCEPTOS_COLUMNS } from '../../../constants'
import { setOptions, setTextTable, setMoneyTable } from '../../../functions/setters'
import Layout from '../../../components/layout/layout'
import { Modal, ModalDelete } from '../../../components/singles'
import { ConceptoForm } from '../../../components/forms'
import NewTable from '../../../components/tables/NewTable'
import { forbiddenAccessAlert, errorAlert } from '../../../functions/alert'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'

const $ = require('jquery');

class Conceptos extends Component {

    state = {
        modalDelete: false,
        title: 'Nuevo concepto',
        formeditado: 0,
        conceptos: [],
        concepto: ''
    }
    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const conceptos = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!conceptos)
            history.push('/')
    }

    changePageEdit = concepto => {
        const { history } = this.props
        history.push({
            pathname: '/presupuesto/conceptos/edit',
            state:{ concepto: concepto}
        })
    }

    openModalDelete = (concepto) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            concepto: concepto
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            concepto: '',
        })
    }

    setConceptos = conceptos => {
        let aux = []
        conceptos.map((concepto) => {
            aux.push(
                {
                    actions: this.setActions(concepto),
                    clave: renderToString(setTextTable(concepto.clave)),
                    descripcion: renderToString(setTextTable(concepto.descripcion)),
                    unidad: concepto.unidad ? renderToString(setTextTable(concepto.unidad.nombre)) : '',
                    costo: renderToString(setMoneyTable(concepto.costo)),
                    partida: concepto.subpartida ? concepto.subpartida.partida ? renderToString(setTextTable(concepto.subpartida.partida.nombre)) : '' : '',
                    subpartida: concepto.subpartida ? renderToString(setTextTable(concepto.subpartida.nombre)) : '',
                    proveedor: renderToString(setTextTable(concepto.proveedor ? concepto.proveedor.razon_social : '')),
                    id: concepto.id
                }
            )
        })
        return aux
    }

    setActions = concepto => {
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
            }
        )
        return aux
    }
    
    async deleteConceptoAxios() {
        const { access_token } = this.props.authUser
        const { concepto } = this.state
        await axios.delete(URL_DEV + 'conceptos/' + concepto.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                this.getConceptosTable()

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La concepto fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
                this.setState({
                    ... this.state,
                    modalDelete: false
                })

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getConceptosTable(){
        $('#kt_datatable_conceptos').DataTable().ajax.reload();
    }

    render() {

        const { modalDelete, conceptos } = this.state

        return (
            <Layout active={'presupuesto'}  {...this.props}>
                
                <NewTableServerRender
                    columns={CONCEPTOS_COLUMNS} 
                    data={conceptos}
                    title='Conceptos' 
                    subtitle='Listado de conceptos'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url='/presupuesto/conceptos/add'
                    mostrar_acciones={true}
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete }
                    }}
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setConceptos }
                    urlRender = {URL_DEV + 'conceptos'}
                    idTable='kt_datatable_conceptos'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'/>

                <ModalDelete 
                    title="¿Estás seguro que deseas eliminar el concepto?" 
                    show={modalDelete} 
                    handleClose={this.handleCloseDelete} 
                    onClick={(e) => { e.preventDefault(); this.deleteConceptoAxios() }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Conceptos);