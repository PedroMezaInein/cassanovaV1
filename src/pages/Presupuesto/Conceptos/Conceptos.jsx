import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, CONCEPTOS_COLUMNS } from '../../../constants'
import { setTextTable, setMoneyTable } from '../../../functions/setters'
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal } from '../../../components/singles'
import { forbiddenAccessAlert, errorAlert, doneAlert, waitAlert } from '../../../functions/alert'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { ConceptoCard } from '../../../components/cards'

const $ = require('jquery');

class Conceptos extends Component {

    state = {
        modalDelete: false,
        modalSee: false,
        title: 'Nuevo concepto',
        formeditado: 0,
        conceptos: [],
        concepto: ''
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const conceptos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
            return false
        });
        if (!conceptos)
            history.push('/')
    }

    changePageEdit = concepto => {
        const { history } = this.props
        history.push({
            pathname: '/presupuesto/conceptos/edit',
            state: { concepto: concepto }
        })
    }

    openModalDelete = concepto => {
        this.setState({
            ...this.state,
            modalDelete: true,
            concepto: concepto
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ...this.state,
            modalDelete: !modalDelete,
            concepto: '',
        })
    }

    openModalSee = concepto => {
        this.setState({
            ...this.state,
            modalSee: true,
            concepto: concepto
        })
    }

    handleCloseSee = () => {
        this.setState({
            ...this.state,
            modalSee: false,
            concepto: ''
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
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
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
                doneAlert(response.data.message !== undefined ? response.data.message : 'La concepto fue registrado con éxito.')
                this.setState({
                    ...this.state,
                    modalDelete: false
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getConceptosTable() {
        $('#kt_datatable_conceptos').DataTable().ajax.reload();
    }
    async exportConceptosAxios() {
        waitAlert()
        let aux = $('#kt_datatable_conceptos').DataTable().rows({ selected: true }).data();
        let longitud = aux.length
        let arreglo = []
        for (let i = 0; i < longitud; i++) {
            arreglo.push(aux[i].id)
        }
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'exportar/conceptos', { selected: arreglo }, { responseType: 'blob', headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'conceptos.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        const { modalDelete, conceptos, modalSee, concepto } = this.state
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
                        'delete': { function: this.openModalDelete },
                        'see': { function: this.openModalSee }
                    }}
                    exportar_boton={true}
                    onClickExport={() => this.exportConceptosAxios()}
                    accessToken={this.props.authUser.access_token}
                    setter={this.setConceptos}
                    urlRender={URL_DEV + 'conceptos'}
                    idTable='kt_datatable_conceptos'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    checkbox={true} />

                <ModalDelete
                    title="¿Estás seguro que deseas eliminar el concepto?"
                    show={modalDelete}
                    handleClose={this.handleCloseDelete}
                    onClick={(e) => { e.preventDefault(); this.deleteConceptoAxios() }} />

                <Modal size="lg" title="Concepto" show={modalSee} handleClose={this.handleCloseSee} >
                    <ConceptoCard 
                        concepto={concepto}
                    />
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

export default connect(mapStateToProps, mapDispatchToProps)(Conceptos);