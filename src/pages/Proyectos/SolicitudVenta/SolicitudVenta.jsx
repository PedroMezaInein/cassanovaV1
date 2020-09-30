import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, SOLICITUD_VENTA_COLUMNS } from '../../../constants'
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable } from '../../../functions/setters'
import { waitAlert, errorAlert, forbiddenAccessAlert, doneAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { Button } from '../../../components/form-components'
import { Modal, ModalDelete } from '../../../components/singles'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { FacturaForm } from '../../../components/forms'
import { SolicitudVentaCard } from '../../../components/cards'
const $ = require('jquery');
class SolicitudVenta extends Component {
    state = {
        modal: false,
        modalDelete: false,
        modalSingle: false,
        modalAskFactura: false,
        title: 'Nueva solicitud de compra',
        solicitud: '',
        solicitudes: [],
        data: {
            solicitudes: [],
            clientes: []
        },
        formeditado: 0,
        options: {
            proveedores: [],
            proyectos: [],
            empresas: [],
            areas: [],
            subareas: [],
            tiposPagos: [],
            clientes: [],
            estatusFacturas: [],
            metodosPago: [],
            formasPago: []
        },
        form: {
            cliente: '',
            rfc: '',
            formaPago: '',
            metodoPago: '',
            estatusFactura: '',
            concepto: '',
            email: '',
            proyecto: '',
            area: '',
            subarea: '',
            empresa: '',
            descripcion: '',
            total: '',
            remision: '',
            fecha: new Date(),
            tipoPago: 0,
            factura: 'Sin factura',
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
            }
        }
    }
    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const solicitud = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!solicitud)
            history.push('/')
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                this.setState({
                    ... this.state,
                    modalSingle: true
                })
                this.getSolicitudVentaAxios(id)
            }
        }
        this.getOptionsAxios()
    }
    openModalDelete = (solicitud) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            title: 'Eliminar solicitud de venta',
            form: this.clearForm(),
            solicitud: solicitud
        })
    }
    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            form: this.clearForm(),
            solicitud: ''
        })
    }
    openModalAskFactura = solicitud => {
        const { form } = this.state
        form.empresa = solicitud.empresa.id.toString()
        this.setState({
            ... this.state,
            modalAskFactura: true,
            solicitud: solicitud,
            form,
            formeditado: 1,
        })
    }
    handleCloseAskFactura = () => {
        this.setState({
            ... this.state,
            modalAskFactura: false,
            solicitud: '',
            form: this.clearForm()
        })
    }
    openModalSingle = (solicitud) => {
        this.setState({
            ... this.state,
            modalSingle: true,
            solicitud: solicitud
        })
    }
    handleCloseSingle = () => {
        const { modalSingle } = this.state
        this.setState({
            ... this.state,
            modalSingle: !modalSingle,
            solicitud: ''
        })
    }
    setSolicitudes = solicitudes => {
        let aux = []
        solicitudes.map((solicitud) => {
            aux.push(
                {
                    actions: this.setActions(solicitud),
                    proyecto: renderToString(setTextTable(solicitud.proyecto ? solicitud.proyecto.nombre : '')),
                    empresa: renderToString(setTextTable(solicitud.empresa ? solicitud.empresa.name : '')),
                    factura: renderToString(setTextTable(solicitud.factura ? 'Con factura' : 'Sin factura')),
                    monto: renderToString(setMoneyTable(solicitud.monto)),
                    tipoPago: renderToString(setTextTable(solicitud.tipo_pago ? solicitud.tipo_pago.tipo : '')),
                    descripcion: renderToString(setTextTable(solicitud.descripcion)),
                    area: renderToString(setTextTable(solicitud.subarea ? solicitud.subarea.area ? solicitud.subarea.area.nombre : '' : '')),
                    subarea: renderToString(setTextTable(solicitud.subarea ? solicitud.subarea.nombre : '')),
                    fecha: renderToString(setDateTable(solicitud.created_at)),
                    adjunto: solicitud.adjunto ? renderToString(setArrayTable([{ text: 'Adjunto', url: solicitud.adjunto.url }])) : renderToString(setTextTable('Sin adjuntos')),
                    id: solicitud.id
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
                text: 'Convertir',
                btnclass: 'primary',
                iconclass: 'flaticon2-refresh',
                action: 'convert',
                tooltip: { id: 'convert', text: 'Convertir', type: 'success' },
            },
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'success' },
            },
            {
                text: 'Pedir&nbsp;factura',
                btnclass: 'info',
                iconclass: 'flaticon-file-1',
                action: 'bills',
                tooltip: { id: 'bills', text: 'Pedir factura' }
            }
        )
        return aux
    }
    changePageConvert = solicitud => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/ventas/convert',
            state: { solicitud: solicitud },
            formeditado: 1
        });
    }
    changePageEdit = solicitud => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/solicitud-venta/edit',
            state: { solicitud: solicitud },
            formeditado: 1
        });
    }
    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'solicitud-venta/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas, areas, tiposPagos, proyectos, solicitudes, clientes, metodosPago, formasPago, estatusFacturas } = response.data
                const { options, data } = this.state
                // data.solicitudes = solicitudes
                data.clientes = clientes
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
                options['clientes'] = setOptions(clientes, 'empresa', 'id')
                options['metodosPago'] = setOptions(metodosPago, 'nombre', 'id')
                options['formasPago'] = setOptions(formasPago, 'nombre', 'id')
                options['estatusFacturas'] = setOptions(estatusFacturas, 'estatus', 'id')
                this.setState({
                    ... this.state,
                    options,
                    // solicitudes: this.setSolicitudes(solicitudes),
                    data
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
    async getSolicitudAxios() {
        var table = $('#kt_datatable_solicitud').DataTable().ajax.reload();
    }
    async getSolicitudVentaAxios(id) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'solicitud-venta/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { solicitud } = response.data
                data.solicitud = solicitud
                this.setState({
                    ... this.state,
                    solicitud: solicitud,
                    data
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
    async deleteSolicitudAxios() {
        const { access_token } = this.props.authUser
        const { solicitud } = this.state
        await axios.delete(URL_DEV + 'solicitud-venta/' + solicitud.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { solicitudes } = response.data
                const { data } = this.state
                data.solicitudes = solicitudes
                this.getSolicitudAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'La solicitud fue registrado con éxito.')
                this.setState({
                    ... this.state,
                    modalDelete: false,
                    data,
                    title: 'Nueva solicitud de compra',
                    solicitud: '',
                    solicitudes: this.setSolicitudes(solicitudes)
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
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fecha':
                    form[element] = new Date()
                    break;
                case 'tipoPago':
                    form[element] = 0
                    break;
                case 'factura':
                    form[element] = 'Sin factura'
                    break;
                case 'adjuntos':
                    form['adjuntos'].adjunto.value = ''
                    form['adjuntos'].adjunto.files = []
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form
    }
    onChange = e => {
        const { form, data } = this.state
        const { name, value } = e.target
        form[name] = value
        if (name === 'cliente') {
            data.clientes.map((cliente) => {
                if (value === cliente.id.toString()) {
                    form.rfc = cliente.rfc
                }
            })
        }
        this.setState({
            ... this.state,
            form
        })
    }
    onSubmitAskFactura = e => {
        e.preventDefault()
        waitAlert()
        this.askFacturaAxios()
    }
    async askFacturaAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'facturas/ask', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    modalAskFactura: false
                })
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
        const { data, modalDelete, form, options, solicitud, modalSingle, formeditado, modalAskFactura } = this.state
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <NewTableServerRender
                    columns={SOLICITUD_VENTA_COLUMNS}
                    title='Solicitudes de venta'
                    subtitle='Listado de solicitudes de venta'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url='/proyectos/solicitud-venta/add'
                    mostrar_acciones={true}
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete },
                        'convert': { function: this.changePageConvert },
                        'see': { function: this.openModalSingle },
                        'bills': { function: this.openModalAskFactura }
                    }}
                    idTable='kt_datatable_solicitud'
                    accessToken={this.props.authUser.access_token}
                    setter={this.setSolicitudes}
                    urlRender={URL_DEV + 'solicitud-venta'}
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />
                <ModalDelete title={"¿Deseas eliminar la solicitud de venta?"} show={modalDelete} handleClose={this.handleCloseDelete} onClick={(e) => { e.preventDefault(); this.deleteSolicitudAxios() }}>
                </ModalDelete>
                <Modal size="xl" title="Solicitud de venta" show={modalSingle} handleClose={this.handleCloseSingle} >
                    <SolicitudVentaCard data={solicitud}>
                        {
                            solicitud.convertido ? '' :
                                <Button icon={faSync} pulse={"pulse-ring"} className={"btn btn-icon btn-light-primary pulse pulse-primary"} onClick={(e) => { e.preventDefault(); this.changePageConvert(solicitud) }}
                                    tooltip={{ text: 'COMPRAR' }} />
                        }
                    </SolicitudVentaCard>
                </Modal>
                <Modal size="xl" title={"Solicitud de factura"} show={modalAskFactura} handleClose={this.handleCloseAskFactura}>
                    <FacturaForm
                        options={options}
                        onChange={this.onChange}
                        form={form}
                        onSubmit={this.onSubmitAskFactura}
                        formeditado={formeditado}
                        data={data}
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

export default connect(mapStateToProps, mapDispatchToProps)(SolicitudVenta);