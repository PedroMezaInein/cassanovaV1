import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal } from '../../../components/singles'
import { PRESUPUESTO_DISEÑO_COLUMNS, URL_DEV, ADJUNTOS_PRESUPUESTOS_COLUMNS } from '../../../constants'
import { setDateTable, setMoneyTable, setAdjuntosList, setListTable, setTextTableCenter } from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert } from '../../../functions/alert'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { renderToString } from 'react-dom/server'
import TableForModals from '../../../components/tables/TableForModals'
import $ from "jquery";
class PresupuestoDiseño extends Component {
    state = {
        formeditado: 0,
        modal: {
            form: false,
            delete: false,
            adjuntos: false,
        },
        data: {
            adjuntos: []
        },
        title: 'Nuevo presupuesto de diseño',
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const presupuesto = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!presupuesto)
            history.push('/')
    }

    changeEditPage = presupuesto => {
        const { history } = this.props
        history.push({
            pathname: '/presupuesto/presupuesto-diseño/edit',
            state: { presupuesto: presupuesto }
        });
    }

    openModalDelete = presupuesto => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            presupuesto: presupuesto
        })
    }

    downloadPDF = presupuesto => {
        const { modal, data } = this.state
        data.adjuntos = presupuesto.pdfs
        modal.adjuntos = true
        this.setState({
            ...this.state,
            presupuesto: presupuesto,
            modal,
            adjuntos: this.setAdjuntosTable(presupuesto.pdfs),
            data
        })
    }

    setAdjuntosTable = adjuntos => {
        let aux = []
        adjuntos.map((adjunto) => {
            aux.push({
                url: renderToString(
                    setAdjuntosList([{ name: adjunto.name, url: adjunto.url }])
                ),
                identificador: renderToString(setTextTableCenter(adjunto.pivot.identificador)),
                id: adjunto.id
            })
            return false
        })
        return aux
    }

    async deletePresupuestoAdminAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { presupuesto } = this.state

        await axios.delete(URL_DEV + 'presupuestos-diseño/' + presupuesto.id, { headers: { Accept: '/', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                this.getPresupuestoAxios()
                modal.delete = false
                this.setState({
                    ...this.state,
                    modal,
                    presupuesto: '',
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'La presupuesto fue eliminada con éxito.',)
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    handleCloseModalDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ...this.state,
            form: this.clearForm(),
            modal,
            presupuesto: ''
        })
    }

    handleClose = () => {
        const { modal, data } = this.state
        data.adjuntos = []
        modal.adjuntos = false
        this.setState({
            ...this.state,
            presupuesto: '',
            modal,
            adjuntos: [],
            data
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    form[element] = new Date()
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
    }

    setPresupuestos = presupuestos => {
        let aux = []
        if (presupuestos)
            presupuestos.map((presupuesto) => {
                aux.push(
                    {
                        actions: this.setActions(presupuesto),
                        empresa: renderToString(setTextTableCenter(presupuesto.empresa ? presupuesto.empresa.name : '')),
                        fecha: renderToString(setDateTable(presupuesto.fecha)),
                        m2: renderToString(setTextTableCenter(presupuesto.m2)),
                        esquema: renderToString(setTextTableCenter(presupuesto.esquema ? presupuesto.esquema.replace('_', ' ') : '')),
                        total: renderToString(setMoneyTable(presupuesto.total)),
                        cotizacion: renderToString(this.setCotizacion(presupuesto.pdfs)),
                        id: presupuesto.id,
                    }
                )
                return false
            })
        return aux
    }

    setCotizacion = cotizaciones => {
        if(cotizaciones === undefined)
            return setTextTableCenter('Sin pdfs generados')
        if(cotizaciones.length === 0)
            return setTextTableCenter('Sin pdfs generados')
        let aux = []
        cotizaciones.map((cotizacion) => {
            aux.push({ numero: cotizacion.pivot.identificador })
            return ''
        })
        return setListTable(aux, 'numero')
    }

    setActions = presupuesto => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' }
            }
        )
        aux.push(
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' },
            }
        )
        if (presupuesto.pdfs)
            if (presupuesto.pdfs.length) {
                aux.push(
                    {
                        text: 'Descargar&nbsp;presupuesto',
                        btnclass: 'primary',
                        iconclass: 'flaticon2-download-1',
                        action: 'download',
                        tooltip: { id: 'download', text: 'Decargar presupuesto' },
                    }
                )
            }

        return aux
    }

    async getPresupuestoAxios() {
        $('#kt_datatable2_presupuesto_diseño').DataTable().ajax.reload();
    }

    render() {
        const { modal, data, adjuntos } = this.state
        return (
            <Layout active={'presupuesto'} {...this.props}>
                <NewTableServerRender
                    columns={PRESUPUESTO_DISEÑO_COLUMNS}
                    title='Presupuesto de diseño' subtitle='Listado de presupuestos'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url='/presupuesto/presupuesto-diseño/add'
                    mostrar_acciones={true}
                    actions={{
                        'edit': { function: this.changeEditPage },
                        'delete': { function: this.openModalDelete },
                        'download': { function: this.downloadPDF }
                    }}
                    accessToken={this.props.authUser.access_token}
                    setter={this.setPresupuestos}
                    urlRender={`${URL_DEV}v2/presupuesto/presupuestos-diseños`}
                    idTable='kt_datatable2_presupuesto_diseño'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />
                <ModalDelete
                    title='¿Desea eliminar el presupuesto?'
                    show={modal.delete}
                    handleClose={this.handleCloseModalDelete}
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deletePresupuestoAdminAxios() }}
                />
                <Modal show={modal.adjuntos} handleClose={this.handleClose} title="Historial de presupuestos" >
                    <TableForModals
                        columns={ADJUNTOS_PRESUPUESTOS_COLUMNS}
                        data={adjuntos}
                        hideSelector={true}
                        mostrar_acciones={false}
                        dataID='adjuntos'
                        elements={data.adjuntos}
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

export default connect(mapStateToProps, mapDispatchToProps)(PresupuestoDiseño);